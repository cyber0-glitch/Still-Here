import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { checkForScam } from '../utils/scamDetection';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

// ── Validation Schemas ──────────────────────────────────────────────────────

const leaveMemorySchema = z.object({
  content: z.string().min(1, 'Memory content is required'),
  imageUrl: z.string().url().optional(),
});

const memoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── GET /:userId ─ View memorial page ────────────────────────────────────────

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const targetUserId = req.params.userId as string;

    // Fetch the user and verify they are in memorial state
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        memorial: {
          include: {
            memories: {
              orderBy: { createdAt: 'desc' },
              include: {
                author: {
                  select: {
                    id: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isMemorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Filter out removed memories
    // Note: MemorialMemory does not currently have a status column.
    // When one is added, filter with: memories.filter(m => m.status !== 'removed')
    const visibleMemories = user.memorial?.memories ?? [];

    return res.status(200).json({
      displayName: user.displayName,
      memorialMessage: user.memorialMessage,
      memorialActivatedAt: user.memorialActivatedAt,
      memorial: user.memorial
        ? {
            id: user.memorial.id,
            displayMessage: user.memorial.displayMessage,
            allowMemories: user.memorial.allowMemories,
            createdAt: user.memorial.createdAt,
            memories: visibleMemories,
          }
        : null,
      prompts: {
        promptNoPatience: user.promptNoPatience,
        promptWantCompany: user.promptWantCompany,
        promptBodyCanHandle: user.promptBodyCanHandle,
        promptDontTalkLike: user.promptDontTalkLike,
        promptBeforeIGo: user.promptBeforeIGo,
        promptFreeform: user.promptFreeform,
      },
      conditionSummary: user.conditionSummary,
    });
  } catch (error) {
    console.error('View memorial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /:userId/memories ─ Leave a memory ──────────────────────────────────

router.post('/:userId/memories', async (req: Request, res: Response) => {
  try {
    const targetUserId = req.params.userId as string;
    const authorId = req.user!.userId;

    // Validate body
    const parsed = leaveMemorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { content, imageUrl } = parsed.data;

    // Verify the memorial exists and allows memories
    const memorial = await prisma.memorial.findUnique({
      where: { userId: targetUserId },
    });

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    if (!memorial.allowMemories) {
      return res.status(403).json({ error: 'This memorial is not accepting new memories' });
    }

    // Check for scam content
    const scamResult = await checkForScam(content, prisma);

    // Create the memory
    const memory = await prisma.memorialMemory.create({
      data: {
        memorialId: memorial.id,
        authorId,
        content,
        imageUrl: imageUrl ?? undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // If flagged as scam, create a report for moderation
    if (scamResult.flagged) {
      await prisma.report.create({
        data: {
          reporterId: null,
          reportedUserId: authorId,
          reason: 'auto_scam_detection',
          details: `Auto-flagged memorial memory containing: "${scamResult.matchedPhrase}". Content: "${content}"`,
          status: 'pending',
        },
      });
    }

    // The user is deceased -- no notification is sent to them.

    return res.status(201).json({ memory });
  } catch (error) {
    console.error('Leave memory error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:userId/memories ─ List memories for a memorial (paginated) ─────────

router.get('/:userId/memories', async (req: Request, res: Response) => {
  try {
    const targetUserId = req.params.userId as string;

    // Validate query params
    const parsed = memoriesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { page, limit } = parsed.data;

    // Verify the memorial exists
    const memorial = await prisma.memorial.findUnique({
      where: { userId: targetUserId },
    });

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    const skip = (page - 1) * limit;

    // Only return visible memories (not removed ones).
    // Note: MemorialMemory does not currently have a status column.
    // When one is added, add to where: { NOT: { status: 'removed' } }
    const where = { memorialId: memorial.id };

    const [memories, total] = await Promise.all([
      prisma.memorialMemory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.memorialMemory.count({ where }),
    ]);

    return res.status(200).json({
      memories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List memories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /:userId/activate ─ Activate memorial (admin only) ──────────────────

router.post('/:userId/activate', async (req: Request, res: Response) => {
  try {
    const callerUserId = req.user!.userId;
    const targetUserId = req.params.userId as string;

    // Only admins can activate a memorial
    if (!req.user!.isAdmin) {
      return res.status(403).json({ error: 'Admin access required to activate a memorial' });
    }

    // Fetch the target user
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isMemorial) {
      return res.status(409).json({ error: 'Memorial has already been activated for this user' });
    }

    const now = new Date();

    // ── Handle "disappear" preference ─────────────────────────────────────

    if (user.memorialPreference === 'disappear') {
      await prisma.$transaction(async (tx) => {
        // 1. Set user as memorial
        await tx.user.update({
          where: { id: targetUserId },
          data: {
            isMemorial: true,
            memorialActivatedAt: now,
            isActive: false,
          },
        });

        // 2. Create memorial record
        await tx.memorial.create({
          data: {
            userId: targetUserId,
            activatedBy: 'moderator',
            activatedByUserId: callerUserId,
            displayMessage: user.memorialMessage,
            allowMemories: false,
          },
        });

        // 3. Delete their moment requests
        await tx.momentRequest.deleteMany({
          where: { userId: targetUserId },
        });

        // 4. Lock their conversations and add system message
        const participantRecords = await tx.conversationParticipant.findMany({
          where: { userId: targetUserId },
          select: { conversationId: true },
        });

        const conversationIds = participantRecords.map(p => p.conversationId);

        if (conversationIds.length > 0) {
          await tx.conversation.updateMany({
            where: { id: { in: conversationIds } },
            data: { memorialLocked: true },
          });

          // Add system message to each conversation
          await tx.message.createMany({
            data: conversationIds.map(conversationId => ({
              conversationId,
              content: `${user.displayName}'s profile is no longer available per their disappear preference.`,
              messageType: 'system',
              systemEventType: 'memorial_disappear',
            })),
          });
        }

        // 5. Archive their moment requests (already deleted above for disappear)
        // 6. Cancel their group events (as organizer)
        await tx.groupEvent.updateMany({
          where: { organizerId: targetUserId, status: 'upcoming' },
          data: { status: 'cancelled' },
        });

        // 7. Remove them as attendees from events
        await tx.groupEventAttendee.deleteMany({
          where: { userId: targetUserId },
        });
      });

      return res.status(200).json({
        message: 'Memorial activated with disappear preference. User profile has been removed.',
      });
    }

    // ── Handle "memorial" or "undecided" preference ───────────────────────

    await prisma.$transaction(async (tx) => {
      // 1. Set user as memorial
      await tx.user.update({
        where: { id: targetUserId },
        data: {
          isMemorial: true,
          memorialActivatedAt: now,
        },
      });

      // 2. Create memorial record
      await tx.memorial.create({
        data: {
          userId: targetUserId,
          activatedBy: 'moderator',
          activatedByUserId: callerUserId,
          displayMessage: user.memorialMessage,
        },
      });

      // 3. Lock their conversations and add system message + notify partners
      const participantRecords = await tx.conversationParticipant.findMany({
        where: { userId: targetUserId },
        select: { conversationId: true },
      });

      const conversationIds = participantRecords.map(p => p.conversationId);

      if (conversationIds.length > 0) {
        await tx.conversation.updateMany({
          where: { id: { in: conversationIds } },
          data: { memorialLocked: true },
        });

        // Add system message to each conversation
        await tx.message.createMany({
          data: conversationIds.map(conversationId => ({
            conversationId,
            content: `${user.displayName} is no longer with us. Their memorial is open if you'd like to visit it.`,
            messageType: 'system',
            systemEventType: 'memorial_activated',
          })),
        });

        // Find all conversation partners to notify
        const allParticipants = await tx.conversationParticipant.findMany({
          where: {
            conversationId: { in: conversationIds },
            userId: { not: targetUserId },
          },
          select: { userId: true },
        });

        // Deduplicate partner IDs (a user may appear in multiple conversations)
        const partnerIds = [...new Set(allParticipants.map(p => p.userId))];

        if (partnerIds.length > 0) {
          await tx.notification.createMany({
            data: partnerIds.map(partnerId => ({
              userId: partnerId,
              type: 'memorial',
              title: 'In memory',
              body: `${user.displayName} is no longer with us. Their memorial is open if you'd like to visit it.`,
              data: { memorialUserId: targetUserId },
            })),
          });
        }
      }

      // 4. Archive their moment requests (set status to expired)
      await tx.momentRequest.updateMany({
        where: { userId: targetUserId, status: { not: 'expired' } },
        data: { status: 'expired' },
      });

      // 5. Cancel their group events (as organizer)
      await tx.groupEvent.updateMany({
        where: { organizerId: targetUserId, status: 'upcoming' },
        data: { status: 'cancelled' },
      });

      // 6. Remove them as attendees from events
      await tx.groupEventAttendee.deleteMany({
        where: { userId: targetUserId },
      });
    });

    return res.status(200).json({
      message: 'Memorial activated. Conversations have been locked and contacts notified.',
    });
  } catch (error) {
    console.error('Activate memorial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
