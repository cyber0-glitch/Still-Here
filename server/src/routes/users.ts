import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// ---------------------------------------------------------------------------
// Multer configuration for avatar uploads
// ---------------------------------------------------------------------------
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads/avatars');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, _file, cb) => {
    const ext = path.extname(_file.originalname).toLowerCase();
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------
const patchProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  age: z.number().int().min(0).max(150).optional().nullable(),
  locationCity: z.string().max(100).optional().nullable(),
  locationCountry: z.string().max(100).optional().nullable(),
  locationLat: z.number().min(-90).max(90).optional().nullable(),
  locationLng: z.number().min(-180).max(180).optional().nullable(),
  radiusKm: z.number().int().min(1).max(500).optional(),
  conditionSummary: z.string().optional().nullable(),
  energyLevel: z.string().max(20).optional(),
  mobilityNotes: z.string().optional().nullable(),
  promptNoPatience: z.string().optional().nullable(),
  promptWantCompany: z.string().optional().nullable(),
  promptBodyCanHandle: z.string().optional().nullable(),
  promptDontTalkLike: z.string().optional().nullable(),
  promptBeforeIGo: z.string().optional().nullable(),
  promptFreeform: z.string().optional().nullable(),
  contactPreference: z.string().max(20).optional(),
  showOnlineStatus: z.boolean().optional(),
  allowCaregiverView: z.boolean().optional(),
  memorialPreference: z.string().max(20).optional().nullable(),
  memorialMessage: z.string().optional().nullable(),
});

const patchMemorialPreferencesSchema = z.object({
  memorialPreference: z.string().max(20).optional().nullable(),
  memorialMessage: z.string().optional().nullable(),
  designatedPerson: z
    .object({
      name: z.string().min(1).max(200),
      contact: z.string().min(1).max(255),
    })
    .optional()
    .nullable(),
});

// ---------------------------------------------------------------------------
// All routes require authentication
// ---------------------------------------------------------------------------
router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /me - current user's full profile
// ---------------------------------------------------------------------------
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
      include: {
        designatedPersons: true,
      },
    });

    if (!user || user.deletedAt) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Return everything except passwordHash
    const { passwordHash, ...profile } = user;
    res.json(profile);
  } catch (error) {
    console.error('GET /me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// PATCH /me - update profile fields
// ---------------------------------------------------------------------------
router.patch('/me', async (req: Request, res: Response) => {
  try {
    const parsed = patchProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.userId;
    const data = parsed.data;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { passwordHash, ...profile } = user;
    res.json(profile);
  } catch (error) {
    console.error('PATCH /me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// PATCH /me/memorial-preferences - update memorial preferences + designated person
// ---------------------------------------------------------------------------
router.patch('/me/memorial-preferences', async (req: Request, res: Response) => {
  try {
    const parsed = patchMemorialPreferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      return;
    }

    const userId = req.user!.userId;
    const { designatedPerson, ...memorialFields } = parsed.data;

    // Update memorial fields on the user
    const user = await prisma.user.update({
      where: { id: userId },
      data: memorialFields,
    });

    // Upsert designated person if provided
    let designatedPersonRecord = null;
    if (designatedPerson !== undefined) {
      if (designatedPerson === null) {
        // Remove all designated persons for this user
        await prisma.designatedPerson.deleteMany({
          where: { userId },
        });
      } else {
        // Upsert: find existing or create
        const existing = await prisma.designatedPerson.findFirst({
          where: { userId },
        });

        if (existing) {
          designatedPersonRecord = await prisma.designatedPerson.update({
            where: { id: existing.id },
            data: {
              name: designatedPerson.name,
              contact: designatedPerson.contact,
            },
          });
        } else {
          designatedPersonRecord = await prisma.designatedPerson.create({
            data: {
              userId,
              name: designatedPerson.name,
              contact: designatedPerson.contact,
            },
          });
        }
      }
    }

    const { passwordHash, ...profile } = user;
    res.json({
      ...profile,
      designatedPerson: designatedPersonRecord,
    });
  } catch (error) {
    console.error('PATCH /me/memorial-preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// POST /me/avatar - upload avatar
// ---------------------------------------------------------------------------
router.post('/me/avatar', upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const userId = req.user!.userId;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    res.json({ avatarUrl });
  } catch (error) {
    console.error('POST /me/avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /me - soft delete
// ---------------------------------------------------------------------------
router.delete('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('DELETE /me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// GET /:id - another user's public profile
// ---------------------------------------------------------------------------
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.userId;
    const targetId = req.params.id as string;

    // Check if the target user is blocked by the current user (via Connection with status "blocked")
    const blockedConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { userAId: currentUserId, userBId: targetId, status: 'blocked' },
          { userAId: targetId, userBId: currentUserId, status: 'blocked' },
        ],
      },
    });

    if (blockedConnection) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: targetId },
      include: {
        memorial: true,
      },
    });

    if (!user || user.deletedAt) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Type the result with memorial relation included
    const userWithRelations = user as typeof user & { memorial?: unknown };

    // Build public profile — exclude passwordHash, email, isAdmin
    const publicProfile: Record<string, unknown> = {
      id: user.id,
      displayName: user.displayName,
      age: user.age,
      locationCity: user.locationCity,
      locationCountry: user.locationCountry,
      conditionSummary: user.conditionSummary,
      energyLevel: user.energyLevel,
      mobilityNotes: user.mobilityNotes,
      promptNoPatience: user.promptNoPatience,
      promptWantCompany: user.promptWantCompany,
      promptBodyCanHandle: user.promptBodyCanHandle,
      promptDontTalkLike: user.promptDontTalkLike,
      promptBeforeIGo: user.promptBeforeIGo,
      promptFreeform: user.promptFreeform,
      verificationStatus: user.verificationStatus,
      contactPreference: user.contactPreference,
      isMemorial: user.isMemorial,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    // Include memorial info if user is in memorial state
    if (user.isMemorial) {
      publicProfile.memorialMessage = user.memorialMessage;
      publicProfile.memorial = userWithRelations.memorial;
    }

    res.json(publicProfile);
  } catch (error) {
    console.error('GET /:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
