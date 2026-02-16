import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Validation Schemas ──────────────────────────────────────────────────────

const idVerificationSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
});

const communityCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

// ---------------------------------------------------------------------------
// POST /id - Submit ID + selfie for verification (placeholder)
// ---------------------------------------------------------------------------
router.post('/id', async (req: Request, res: Response) => {
  try {
    const parsed = idVerificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;

    // In the real app this would call Veriff/Jumio for ID verification.
    // For now, auto-approve the user.
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: 'verified',
        verifiedAt: new Date(),
      },
    });

    return res.status(200).json({ message: 'Identity verified successfully' });
  } catch (error) {
    console.error('POST /verify/id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// POST /community-code - Submit community invite code
// ---------------------------------------------------------------------------
router.post('/community-code', async (req: Request, res: Response) => {
  try {
    const parsed = communityCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const userId = req.user!.userId;
    const { code } = parsed.data;

    // Look up the community code
    const communityCode = await prisma.communityCode.findUnique({
      where: { code },
    });

    if (!communityCode) {
      return res.status(404).json({ error: 'Invalid community code' });
    }

    // Check if code is active
    if (!communityCode.isActive) {
      return res.status(400).json({ error: 'This community code is no longer active' });
    }

    // Check if code has expired
    if (communityCode.expiresAt && communityCode.expiresAt < new Date()) {
      return res.status(400).json({ error: 'This community code has expired' });
    }

    // Check if code has reached max uses
    if (communityCode.maxUses !== null && communityCode.currentUses >= communityCode.maxUses) {
      return res.status(400).json({ error: 'This community code has reached its maximum number of uses' });
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: 'community_verified',
        verifiedAt: new Date(),
        communityCodeUsed: communityCode.organizationName,
      },
    });

    // Increment the code's current uses
    await prisma.communityCode.update({
      where: { id: communityCode.id },
      data: {
        currentUses: { increment: 1 },
      },
    });

    return res.status(200).json({ organizationName: communityCode.organizationName });
  } catch (error) {
    console.error('POST /verify/community-code error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// GET /status - Check verification status
// ---------------------------------------------------------------------------
router.get('/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationStatus: true,
        verifiedAt: true,
        communityCodeUsed: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      verificationStatus: user.verificationStatus,
      verifiedAt: user.verifiedAt,
      communityCodeUsed: user.communityCodeUsed,
    });
  } catch (error) {
    console.error('GET /verify/status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
