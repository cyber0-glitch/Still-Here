import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
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

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }),
  }),
  eventDate: z.string().min(1, 'Event date is required'),
  locationName: z.string().max(200).optional(),
  locationAddress: z.string().optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  isVirtual: z.boolean().optional(),
  virtualLink: z.string().max(500).optional(),
  durationMinutes: z.number().int().min(1).optional(),
  maxAttendees: z.number().int().min(1).optional(),
  energyLevel: z.string().max(20).optional(),
  accessibilityNotes: z.string().optional(),
});

const updateEventSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  eventDate: z.string().optional(),
  locationName: z.string().max(200).optional(),
  locationAddress: z.string().optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  isVirtual: z.boolean().optional(),
  virtualLink: z.string().max(500).optional(),
  durationMinutes: z.number().int().min(1).optional(),
  maxAttendees: z.number().int().min(1).optional(),
  energyLevel: z.string().max(20).optional(),
  accessibilityNotes: z.string().optional(),
});

const listQuerySchema = z.object({
  category: z.string().optional(),
  energyLevel: z.string().optional(),
  isVirtual: z.string().optional(),
  status: z.string().default('upcoming'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const attendSchema = z.object({
  status: z.enum(['going', 'maybe'], {
    errorMap: () => ({ message: 'Status must be either going or maybe' }),
  }),
});

// ── GET / - List events with filters ────────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { category, energyLevel, isVirtual, status, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status,
      organizer: {
        isMemorial: false,
        isActive: true,
      },
    };

    if (category) where.category = category;
    if (energyLevel) where.energyLevel = energyLevel;
    if (isVirtual !== undefined) where.isVirtual = isVirtual === 'true';

    const [events, total] = await Promise.all([
      prisma.groupEvent.findMany({
        where,
        orderBy: { eventDate: 'asc' },
        skip,
        take: limit,
        include: {
          organizer: {
            select: {
              displayName: true,
              avatarUrl: true,
              verificationStatus: true,
            },
          },
          _count: {
            select: { attendees: true },
          },
        },
      }),
      prisma.groupEvent.count({ where }),
    ]);

    return res.status(200).json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST / - Create event (verified users only) ────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;

    // Check that the user has verified or community_verified status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { verificationStatus: true },
    });

    if (!user || !['verified', 'community_verified'].includes(user.verificationStatus)) {
      return res.status(403).json({
        error: 'You must be verified to create events',
      });
    }

    const data = parsed.data;

    const event = await prisma.groupEvent.create({
      data: {
        organizerId: userId,
        title: data.title,
        description: data.description,
        category: data.category,
        eventDate: new Date(data.eventDate),
        locationName: data.locationName,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        isVirtual: data.isVirtual ?? false,
        virtualLink: data.virtualLink,
        durationMinutes: data.durationMinutes,
        maxAttendees: data.maxAttendees,
        energyLevel: data.energyLevel,
        accessibilityNotes: data.accessibilityNotes,
        attendees: {
          create: {
            userId,
            status: 'going',
          },
        },
      },
    });

    return res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id - Get event detail ─────────────────────────────────────────────

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const event = await prisma.groupEvent.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            displayName: true,
            avatarUrl: true,
            verificationStatus: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                verificationStatus: true,
              },
            },
          },
        },
        _count: {
          select: { attendees: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /:id - Update event (organizer only) ─────────────────────────────

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existing = await prisma.groupEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existing.organizerId !== userId) {
      return res.status(403).json({ error: 'You can only update your own events' });
    }

    const data = parsed.data;

    const event = await prisma.groupEvent.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.eventDate !== undefined && { eventDate: new Date(data.eventDate) }),
        ...(data.locationName !== undefined && { locationName: data.locationName }),
        ...(data.locationAddress !== undefined && { locationAddress: data.locationAddress }),
        ...(data.locationLat !== undefined && { locationLat: data.locationLat }),
        ...(data.locationLng !== undefined && { locationLng: data.locationLng }),
        ...(data.isVirtual !== undefined && { isVirtual: data.isVirtual }),
        ...(data.virtualLink !== undefined && { virtualLink: data.virtualLink }),
        ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
        ...(data.maxAttendees !== undefined && { maxAttendees: data.maxAttendees }),
        ...(data.energyLevel !== undefined && { energyLevel: data.energyLevel }),
        ...(data.accessibilityNotes !== undefined && { accessibilityNotes: data.accessibilityNotes }),
      },
    });

    return res.status(200).json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /:id - Cancel event (organizer only) ─────────────────────────────

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existing = await prisma.groupEvent.findUnique({
      where: { id },
      include: {
        attendees: {
          select: { userId: true },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existing.organizerId !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own events' });
    }

    // Set status to cancelled
    await prisma.groupEvent.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    // Notify all attendees (excluding the organizer)
    const attendeeNotifications = existing.attendees
      .filter((a) => a.userId !== userId)
      .map((a) =>
        prisma.notification.create({
          data: {
            userId: a.userId,
            type: 'event_cancelled',
            title: 'Event cancelled',
            body: `The event "${existing.title}" has been cancelled.`,
          },
        })
      );

    await Promise.all(attendeeNotifications);

    return res.status(200).json({ message: 'Event cancelled' });
  } catch (error) {
    console.error('Cancel event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /:id/attend - RSVP to event ───────────────────────────────────────

router.post('/:id/attend', async (req: Request, res: Response) => {
  try {
    const parsed = attendSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const eventId = req.params.id as string;

    // Verify event exists
    const event = await prisma.groupEvent.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { attendees: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already attending
    const existingAttendee = await prisma.groupEventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingAttendee) {
      return res.status(409).json({ error: 'You have already RSVP\'d to this event' });
    }

    // Check capacity if maxAttendees is set
    if (event.maxAttendees && event._count.attendees >= event.maxAttendees) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    const attendee = await prisma.groupEventAttendee.create({
      data: {
        eventId,
        userId,
        status: parsed.data.status,
      },
    });

    // Notify the organizer
    if (event.organizerId && event.organizerId !== userId) {
      await prisma.notification.create({
        data: {
          userId: event.organizerId,
          type: 'event_rsvp',
          title: 'New RSVP for your event',
          body: `Someone RSVP'd to your event: "${event.title}"`,
        },
      });
    }

    return res.status(201).json({ attendee });
  } catch (error) {
    console.error('Attend event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /:id/attend - Update RSVP status ──────────────────────────────────

router.patch('/:id/attend', async (req: Request, res: Response) => {
  try {
    const parsed = attendSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const eventId = req.params.id as string;

    // Verify the attendee record exists
    const existingAttendee = await prisma.groupEventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!existingAttendee) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    const attendee = await prisma.groupEventAttendee.update({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      data: { status: parsed.data.status },
    });

    return res.status(200).json({ attendee });
  } catch (error) {
    console.error('Update RSVP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id/attendees - List attendees ─────────────────────────────────────

router.get('/:id/attendees', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id as string;

    // Verify event exists
    const event = await prisma.groupEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendees = await prisma.groupEventAttendee.findMany({
      where: { eventId },
      orderBy: { joinedAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            verificationStatus: true,
          },
        },
      },
    });

    return res.status(200).json({ attendees });
  } catch (error) {
    console.error('List attendees error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
