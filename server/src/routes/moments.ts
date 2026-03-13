import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { checkForScam } from '../utils/scamDetection';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticate);

// ── Validation Schemas ──────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'talk', 'food', 'nature', 'adventure', 'art', 'music',
  'travel', 'night_out', 'quiet', 'ridiculous', 'virtual', 'other',
] as const;

const createMomentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }),
  }),
  locationType: z.string().max(20).optional(),
  locationName: z.string().max(200).optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().max(20).optional(),
  energyLevelNeeded: z.string().max(20).optional(),
  maxParticipants: z.number().int().min(1).optional(),
});

const updateMomentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  status: z.enum(['open', 'matched', 'completed', 'expired']).optional(),
  locationType: z.string().max(20).optional(),
  locationName: z.string().max(200).optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().max(20).optional(),
  energyLevelNeeded: z.string().max(20).optional(),
  maxParticipants: z.number().int().min(1).optional(),
});

const respondSchema = z.object({
  message: z.string().optional(),
});

const updateResponseSchema = z.object({
  status: z.enum(['accepted', 'declined'], {
    errorMap: () => ({ message: 'Status must be either accepted or declined' }),
  }),
});

const listQuerySchema = z.object({
  category: z.string().optional(),
  energyLevel: z.string().optional(),
  locationType: z.string().optional(),
  status: z.string().default('open'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── GET / - List moments with filters ───────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { category, energyLevel, locationType, status, page, limit } = parsed.data;
    const userId = req.user!.userId;
    const skip = (page - 1) * limit;

    // Find users blocked by or blocking the current user (via Connection with status 'blocked')
    const blockedConnections = await prisma.connection.findMany({
      where: {
        OR: [
          { userAId: userId, status: 'blocked' },
          { userBId: userId, status: 'blocked' },
        ],
      },
      select: { userAId: true, userBId: true },
    });

    const blockedUserIds = blockedConnections.map((c) =>
      c.userAId === userId ? c.userBId : c.userAId
    );

    // Build where clause
    const where: Prisma.MomentRequestWhereInput = {
      status,
      userId: {
        notIn: [userId, ...blockedUserIds],
      },
      user: {
        isMemorial: false,
        isActive: true,
        deletedAt: null,
      },
    };

    if (category) where.category = category;
    if (energyLevel) where.energyLevelNeeded = energyLevel;
    if (locationType) where.locationType = locationType;

    const [moments, total] = await Promise.all([
      prisma.momentRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              displayName: true,
              verificationStatus: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.momentRequest.count({ where }),
    ]);

    return res.status(200).json({
      moments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List moments error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /mine - List current user's own moments ─────────────────────────────

router.get('/mine', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const moments = await prisma.momentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    return res.status(200).json({ moments });
  } catch (error) {
    console.error('List my moments error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id - Get single moment with user info and response count ──────────

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const moment = await prisma.momentRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            displayName: true,
            verificationStatus: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    return res.status(200).json({ moment });
  } catch (error) {
    console.error('Get moment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST / - Create moment request ──────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createMomentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const data = parsed.data;

    // Check for scam content in title + description
    const textToCheck = [data.title, data.description].filter(Boolean).join(' ');
    const scamResult = await checkForScam(textToCheck, prisma);

    const moment = await prisma.momentRequest.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        locationType: data.locationType,
        locationName: data.locationName,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
        preferredTime: data.preferredTime,
        energyLevelNeeded: data.energyLevelNeeded,
        maxParticipants: data.maxParticipants,
      },
    });

    // If flagged as scam, create a report
    if (scamResult.flagged) {
      await prisma.report.create({
        data: {
          reportedUserId: userId,
          reason: 'scam',
          details: `Auto-flagged content. Matched phrase: "${scamResult.matchedPhrase}"`,
        },
      });
    }

    return res.status(201).json({ moment });
  } catch (error) {
    console.error('Create moment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /:id - Update moment (owner only) ─────────────────────────────────

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateMomentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existing = await prisma.momentRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'You can only update your own moments' });
    }

    const data = parsed.data;

    const moment = await prisma.momentRequest.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.locationType !== undefined && { locationType: data.locationType }),
        ...(data.locationName !== undefined && { locationName: data.locationName }),
        ...(data.locationLat !== undefined && { locationLat: data.locationLat }),
        ...(data.locationLng !== undefined && { locationLng: data.locationLng }),
        ...(data.preferredDate !== undefined && {
          preferredDate: new Date(data.preferredDate),
        }),
        ...(data.preferredTime !== undefined && { preferredTime: data.preferredTime }),
        ...(data.energyLevelNeeded !== undefined && { energyLevelNeeded: data.energyLevelNeeded }),
        ...(data.maxParticipants !== undefined && { maxParticipants: data.maxParticipants }),
      },
    });

    return res.status(200).json({ moment });
  } catch (error) {
    console.error('Update moment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /:id - Delete moment (owner only) ─────────────────────────────────

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existing = await prisma.momentRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own moments' });
    }

    await prisma.momentRequest.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Moment deleted' });
  } catch (error) {
    console.error('Delete moment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /:id/respond - Respond to a moment ("I'm in") ─────────────────────

router.post('/:id/respond', async (req: Request, res: Response) => {
  try {
    const parsed = respondSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const responderId = req.user!.userId;
    const momentId = req.params.id as string;

    // Verify moment exists
    const moment = await prisma.momentRequest.findUnique({
      where: { id: momentId },
    });

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    // Cannot respond to own moment
    if (moment.userId === responderId) {
      return res.status(400).json({ error: 'You cannot respond to your own moment' });
    }

    // Check uniqueness: one response per user per moment
    const existingResponse = await prisma.momentResponse.findUnique({
      where: {
        momentId_responderId: {
          momentId,
          responderId,
        },
      },
    });

    if (existingResponse) {
      return res.status(409).json({ error: 'You have already responded to this moment' });
    }

    const response = await prisma.momentResponse.create({
      data: {
        momentId,
        responderId,
        message: parsed.data.message,
        status: 'pending',
      },
    });

    // Notify the moment owner
    await prisma.notification.create({
      data: {
        userId: moment.userId,
        type: 'moment_response',
        title: 'New response to your moment',
        body: `Someone responded to your moment: "${moment.title}"`,
      },
    });

    return res.status(201).json({ response });
  } catch (error) {
    console.error('Respond to moment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id/responses - List responses to a moment (owner only) ────────────

router.get('/:id/responses', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const momentId = req.params.id as string;

    const moment = await prisma.momentRequest.findUnique({
      where: { id: momentId },
    });

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    if (moment.userId !== userId) {
      return res.status(403).json({ error: 'You can only view responses to your own moments' });
    }

    const responses = await prisma.momentResponse.findMany({
      where: { momentId },
      orderBy: { createdAt: 'desc' },
      include: {
        responder: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.status(200).json({ responses });
  } catch (error) {
    console.error('List responses error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /:id/responses/:respId - Accept or decline a response ─────────────

router.patch('/:id/responses/:respId', async (req: Request, res: Response) => {
  try {
    const parsed = updateResponseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const momentId = req.params.id as string;
    const respId = req.params.respId as string;
    const { status } = parsed.data;

    // Verify moment exists and belongs to the current user
    const moment = await prisma.momentRequest.findUnique({
      where: { id: momentId },
    });

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    if (moment.userId !== userId) {
      return res.status(403).json({ error: 'You can only manage responses to your own moments' });
    }

    // Verify response exists and belongs to this moment
    const existingResponse = await prisma.momentResponse.findUnique({
      where: { id: respId },
    });

    if (!existingResponse || existingResponse.momentId !== momentId) {
      return res.status(404).json({ error: 'Response not found' });
    }

    // Update the response status
    const updatedResponse = await prisma.momentResponse.update({
      where: { id: respId },
      data: { status },
    });

    if (status === 'accepted') {
      // Create a conversation between the two users
      const conversation = await prisma.conversation.create({
        data: {
          originMomentId: momentId,
          participants: {
            create: [
              { userId: moment.userId },
              { userId: existingResponse.responderId },
            ],
          },
          messages: {
            create: {
              content: `You connected through: ${moment.title}`,
              messageType: 'system',
              systemEventType: 'moment_connection',
            },
          },
        },
      });

      // Create a connection record between the two users (ignore if already connected)
      const [sortedA, sortedB] = [moment.userId, existingResponse.responderId].sort();
      await prisma.connection.upsert({
        where: {
          userAId_userBId: { userAId: sortedA, userBId: sortedB },
        },
        update: {},
        create: {
          userAId: sortedA,
          userBId: sortedB,
          status: 'connected',
          connectedVia: 'moment',
        },
      });

      // Notify the responder of acceptance
      await prisma.notification.create({
        data: {
          userId: existingResponse.responderId,
          type: 'response_accepted',
          title: 'Your response was accepted!',
          body: `Your response to "${moment.title}" was accepted. You can now start a conversation!`,
        },
      });

      return res.status(200).json({ response: updatedResponse, conversation });
    }

    // Status is 'declined'
    await prisma.notification.create({
      data: {
        userId: existingResponse.responderId,
        type: 'response_declined',
        title: 'Response update',
        body: `Your response to "${moment.title}" was declined.`,
      },
    });

    return res.status(200).json({ response: updatedResponse });
  } catch (error) {
    console.error('Update response error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
