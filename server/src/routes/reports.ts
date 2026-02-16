import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// ── Validation Schemas ──────────────────────────────────────────────────────

const VALID_REASONS = [
  'scam', 'money_request', 'harassment', 'fake_profile', 'exploitation', 'other',
] as const;

const createReportSchema = z.object({
  reportedUserId: z.string().uuid('Invalid user ID'),
  reason: z.enum(VALID_REASONS, {
    errorMap: () => ({ message: `Reason must be one of: ${VALID_REASONS.join(', ')}` }),
  }),
  details: z.string().optional(),
});

// ── POST / - File a report ──────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const reporterId = req.user!.userId;
    const { reportedUserId, reason, details } = parsed.data;

    // Cannot report yourself
    if (reporterId === reportedUserId) {
      return res.status(400).json({ error: 'You cannot report yourself' });
    }

    // Verify reported user exists
    const reportedUser = await prisma.user.findUnique({
      where: { id: reportedUserId },
    });

    if (!reportedUser) {
      return res.status(404).json({ error: 'Reported user not found' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        details,
      },
    });

    return res.status(201).json({ report });
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /mine - List own reports and their status ───────────────────────────

router.get('/mine', async (req: Request, res: Response) => {
  try {
    const reporterId = req.user!.userId;

    const reports = await prisma.report.findMany({
      where: { reporterId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ reports });
  } catch (error) {
    console.error('List my reports error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
