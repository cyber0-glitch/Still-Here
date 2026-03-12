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

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(5000, 'Message is too long'),
});

const messagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ── GET / ─ List current user's conversations ───────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Find all conversations the user participates in
    const participantRecords = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: {
        conversationId: true,
        lastReadAt: true,
      },
    });

    if (participantRecords.length === 0) {
      return res.status(200).json({ conversations: [] });
    }

    const conversationIds = participantRecords.map(p => p.conversationId);
    const lastReadMap = new Map(
      participantRecords.map(p => [p.conversationId, p.lastReadAt])
    );

    // Fetch conversations with participants, last message, and origin moment
    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                verificationStatus: true,
                isMemorial: true,
              },
            },
          },
        },
        originMoment: {
          select: {
            title: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Build response with unread counts
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const lastReadAt = lastReadMap.get(conv.id);

        // Count unread messages (messages created after lastReadAt, excluding own messages)
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
          },
        });

        // Other participants (exclude current user)
        const otherParticipants = conv.participants
          .filter(p => p.user.id !== userId)
          .map(p => p.user);

        const lastMessage = conv.messages[0] || null;

        return {
          id: conv.id,
          createdAt: conv.createdAt,
          lastMessageAt: conv.lastMessageAt,
          memorialLocked: conv.memorialLocked,
          originMomentTitle: conv.originMoment?.title || null,
          participants: otherParticipants,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content.length > 100
                  ? lastMessage.content.substring(0, 100) + '...'
                  : lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
          unreadCount,
        };
      })
    );

    return res.status(200).json({ conversations: result });
  } catch (error) {
    console.error('List conversations error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id ─ Get conversation detail ──────────────────────────────────────

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.id as string;

    // Verify current user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant of this conversation' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                verificationStatus: true,
                isMemorial: true,
              },
            },
          },
        },
        originMoment: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.status(200).json({
      id: conversation.id,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      lastMessageAt: conversation.lastMessageAt,
      memorialLocked: conversation.memorialLocked,
      originMomentTitle: conversation.originMoment?.title || null,
      participants: conversation.participants.map(p => ({
        userId: p.user.id,
        displayName: p.user.displayName,
        avatarUrl: p.user.avatarUrl,
        verificationStatus: p.user.verificationStatus,
        isMemorial: p.user.isMemorial,
        joinedAt: p.joinedAt,
        muted: p.muted,
        lastReadAt: p.lastReadAt,
      })),
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /:id/messages ─ List messages (paginated) ───────────────────────────

router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.id as string;

    // Validate query params
    const parsed = messagesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { page, limit } = parsed.data;

    // Verify current user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant of this conversation' });
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.message.count({
        where: { conversationId },
      }),
    ]);

    return res.status(200).json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List messages error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /:id/messages ─ Send a message ─────────────────────────────────────

router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.id as string;

    // Validate body
    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { content } = parsed.data;

    // Verify current user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant of this conversation' });
    }

    // Check if conversation is memorial-locked
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { userId: true },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.memorialLocked) {
      return res.status(403).json({ error: 'This conversation is memorial-locked and cannot receive new messages' });
    }

    // Check for scam content
    const scamResult = await checkForScam(content, prisma);

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // If scam flagged, create a report
    if (scamResult.flagged) {
      await prisma.report.create({
        data: {
          reporterId: null,
          reportedUserId: userId,
          reason: 'auto_scam_detection',
          details: `Auto-flagged message containing: "${scamResult.matchedPhrase}". Message content: "${content}"`,
          status: 'pending',
        },
      });
    }

    // Create notification for other participant(s)
    const otherParticipantIds = conversation.participants
      .map(p => p.userId)
      .filter(id => id !== userId);

    const truncatedContent = content.length > 100
      ? content.substring(0, 100) + '...'
      : content;

    if (otherParticipantIds.length > 0) {
      await prisma.notification.createMany({
        data: otherParticipantIds.map(recipientId => ({
          userId: recipientId,
          type: 'new_message',
          title: 'New message',
          body: truncatedContent,
        })),
      });
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /:id/read ─ Mark conversation as read ─────────────────────────────

router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.id as string;

    // Verify current user is a participant and update lastReadAt
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant of this conversation' });
    }

    const updated = await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return res.status(200).json({
      conversationId: updated.conversationId,
      lastReadAt: updated.lastReadAt,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
