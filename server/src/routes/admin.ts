import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth';
import { invalidatePhrasesCache } from '../utils/scamDetection';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication + admin
router.use(authenticate);
router.use(requireAdmin);

// ── Validation Schemas ──────────────────────────────────────────────────────

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const reviewReportSchema = z.object({
  status: z.enum(['reviewed', 'action_taken', 'dismissed'], {
    errorMap: () => ({ message: 'Status must be one of: reviewed, action_taken, dismissed' }),
  }),
  reviewNotes: z.string().optional(),
});

const searchUsersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  verificationStatus: z.string().max(20).optional(),
});

const createCommunityCodeSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required').max(200),
  code: z.string().min(1, 'Code is required').max(50),
  organizationType: z.string().max(50).optional(),
  maxUses: z.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
});

const createPartnerSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
  websiteUrl: z.string().max(500).optional(),
  contactEmail: z.string().email().max(255).optional(),
  locationCity: z.string().max(100).optional(),
  locationCountry: z.string().max(100).optional(),
  isVetted: z.boolean().optional(),
  vettedNotes: z.string().optional(),
  offersDescription: z.string().optional(),
  accessibilityInfo: z.string().optional(),
});

const updatePartnerSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
  websiteUrl: z.string().max(500).optional(),
  contactEmail: z.string().email().max(255).optional(),
  locationCity: z.string().max(100).optional(),
  locationCountry: z.string().max(100).optional(),
  isVetted: z.boolean().optional(),
  vettedNotes: z.string().optional(),
  offersDescription: z.string().optional(),
  accessibilityInfo: z.string().optional(),
  isActive: z.boolean().optional(),
});

const createBlockedPhraseSchema = z.object({
  phrase: z.string().min(1, 'Phrase is required').max(200),
  category: z.string().max(50).optional(),
});

// ── GET /reports - List pending reports (paginated) ─────────────────────────

router.get('/reports', async (req: Request, res: Response) => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = { status: 'pending' };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          reporter: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return res.status(200).json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List pending reports error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /reports/:id - Take action on a report ────────────────────────────

router.patch('/reports/:id', async (req: Request, res: Response) => {
  try {
    const parsed = reviewReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const reportId = req.params.id as string;
    const { status, reviewNotes } = parsed.data;
    const reviewerEmail = req.user!.email;

    const existing = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        reviewedBy: reviewerEmail,
        reviewedAt: new Date(),
        ...(reviewNotes !== undefined && { reviewNotes }),
      },
    });

    // If action was taken, notify the reporter
    if (status === 'action_taken' && existing.reporterId) {
      await prisma.notification.create({
        data: {
          userId: existing.reporterId,
          type: 'report_action_taken',
          title: 'Report update',
          body: 'Action has been taken on a report you submitted. Thank you for helping keep our community safe.',
        },
      });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Review report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /flagged-messages - List auto-flagged reports (paginated) ────────────

router.get('/flagged-messages', async (req: Request, res: Response) => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = {
      reason: { contains: 'scam' },
      details: { contains: 'Auto-flagged' },
    };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          reportedUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return res.status(200).json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List flagged messages error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /users - Search/list users (paginated) ──────────────────────────────

router.get('/users', async (req: Request, res: Response) => {
  try {
    const parsed = searchUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { search, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true,
          isMemorial: true,
          verificationStatus: true,
          createdAt: true,
          lastActiveAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /users/:id - Suspend/ban user ─────────────────────────────────────

router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.params.id as string;
    const data = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.verificationStatus !== undefined && { verificationStatus: data.verificationStatus }),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        verificationStatus: true,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /community-codes - Create invite code ──────────────────────────────

router.post('/community-codes', async (req: Request, res: Response) => {
  try {
    const parsed = createCommunityCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { organizationName, code, organizationType, maxUses, expiresAt } = parsed.data;

    // Check for duplicate code
    const existingCode = await prisma.communityCode.findUnique({
      where: { code },
    });

    if (existingCode) {
      return res.status(409).json({ error: 'Code already exists' });
    }

    const communityCode = await prisma.communityCode.create({
      data: {
        organizationName,
        code,
        ...(organizationType !== undefined && { organizationType }),
        ...(maxUses !== undefined && { maxUses }),
        ...(expiresAt !== undefined && { expiresAt: new Date(expiresAt) }),
      },
    });

    return res.status(201).json({ communityCode });
  } catch (error) {
    console.error('Create community code error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /community-codes - List codes ───────────────────────────────────────

router.get('/community-codes', async (req: Request, res: Response) => {
  try {
    const codes = await prisma.communityCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ codes });
  } catch (error) {
    console.error('List community codes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /community-codes/:id - Deactivate code ────────────────────────────

router.patch('/community-codes/:id', async (req: Request, res: Response) => {
  try {
    const codeId = req.params.id as string;

    const existing = await prisma.communityCode.findUnique({
      where: { id: codeId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Community code not found' });
    }

    const communityCode = await prisma.communityCode.update({
      where: { id: codeId },
      data: { isActive: false },
    });

    return res.status(200).json({ communityCode });
  } catch (error) {
    console.error('Deactivate community code error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /analytics - Dashboard stats ────────────────────────────────────────

router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const [
      totalActiveUsers,
      memorialUsers,
      inactiveUsers,
      totalMomentsCreated,
      totalMomentsCompleted,
      totalReportsPending,
      totalReportsResolved,
      totalEventsUpcoming,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true, isMemorial: false } }),
      prisma.user.count({ where: { isMemorial: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.momentRequest.count(),
      prisma.momentRequest.count({ where: { status: 'completed' } }),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.report.count({ where: { status: { in: ['reviewed', 'action_taken', 'dismissed'] } } }),
      prisma.groupEvent.count({ where: { status: 'upcoming' } }),
    ]);

    return res.status(200).json({
      totalActiveUsers,
      memorialUsers,
      inactiveUsers,
      totalMomentsCreated,
      totalMomentsCompleted,
      totalReportsPending,
      totalReportsResolved,
      totalEventsUpcoming,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /partners - Add experience partner ─────────────────────────────────

router.post('/partners', async (req: Request, res: Response) => {
  try {
    const parsed = createPartnerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;

    const partner = await prisma.experiencePartner.create({
      data: {
        businessName: data.businessName,
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.locationCity !== undefined && { locationCity: data.locationCity }),
        ...(data.locationCountry !== undefined && { locationCountry: data.locationCountry }),
        ...(data.isVetted !== undefined && { isVetted: data.isVetted }),
        ...(data.vettedNotes !== undefined && { vettedNotes: data.vettedNotes }),
        ...(data.offersDescription !== undefined && { offersDescription: data.offersDescription }),
        ...(data.accessibilityInfo !== undefined && { accessibilityInfo: data.accessibilityInfo }),
      },
    });

    return res.status(201).json({ partner });
  } catch (error) {
    console.error('Create partner error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /partners - List partners ───────────────────────────────────────────

router.get('/partners', async (req: Request, res: Response) => {
  try {
    const partners = await prisma.experiencePartner.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ partners });
  } catch (error) {
    console.error('List partners error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /partners/:id - Update partner ────────────────────────────────────

router.patch('/partners/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updatePartnerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const partnerId = req.params.id as string;
    const data = parsed.data;

    const existing = await prisma.experiencePartner.findUnique({
      where: { id: partnerId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const partner = await prisma.experiencePartner.update({
      where: { id: partnerId },
      data: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.locationCity !== undefined && { locationCity: data.locationCity }),
        ...(data.locationCountry !== undefined && { locationCountry: data.locationCountry }),
        ...(data.isVetted !== undefined && { isVetted: data.isVetted }),
        ...(data.vettedNotes !== undefined && { vettedNotes: data.vettedNotes }),
        ...(data.offersDescription !== undefined && { offersDescription: data.offersDescription }),
        ...(data.accessibilityInfo !== undefined && { accessibilityInfo: data.accessibilityInfo }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return res.status(200).json({ partner });
  } catch (error) {
    console.error('Update partner error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /blocked-phrases - Add a blocked phrase ────────────────────────────

router.post('/blocked-phrases', async (req: Request, res: Response) => {
  try {
    const parsed = createBlockedPhraseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { phrase, category } = parsed.data;

    const blockedPhrase = await prisma.blockedPhrase.create({
      data: {
        phrase,
        ...(category !== undefined && { category }),
      },
    });

    invalidatePhrasesCache();

    return res.status(201).json({ blockedPhrase });
  } catch (error) {
    console.error('Create blocked phrase error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /blocked-phrases - List all blocked phrases ─────────────────────────

router.get('/blocked-phrases', async (req: Request, res: Response) => {
  try {
    const phrases = await prisma.blockedPhrase.findMany({
      orderBy: { phrase: 'asc' },
    });

    return res.status(200).json({ phrases });
  } catch (error) {
    console.error('List blocked phrases error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /blocked-phrases/:id - Delete a blocked phrase ───────────────────

router.delete('/blocked-phrases/:id', async (req: Request, res: Response) => {
  try {
    const phraseId = req.params.id as string;

    const existing = await prisma.blockedPhrase.findUnique({
      where: { id: phraseId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Blocked phrase not found' });
    }

    await prisma.blockedPhrase.delete({
      where: { id: phraseId },
    });

    invalidatePhrasesCache();

    return res.status(200).json({ message: 'Blocked phrase deleted' });
  } catch (error) {
    console.error('Delete blocked phrase error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
