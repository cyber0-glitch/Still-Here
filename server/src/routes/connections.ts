import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// All routes require authentication
router.use(authenticate);

// ---------------------------------------------------------------------------
// GET / - List current user's connections
// ---------------------------------------------------------------------------
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const connections = await prisma.connection.findMany({
      where: {
        status: 'connected',
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            verificationStatus: true,
            isMemorial: true,
            locationCity: true,
          },
        },
        userB: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            verificationStatus: true,
            isMemorial: true,
            locationCity: true,
          },
        },
      },
    });

    const result = connections.map((conn) => {
      const otherUser = conn.userAId === userId ? conn.userB : conn.userA;
      return {
        connectionId: conn.id,
        user: {
          id: otherUser.id,
          displayName: otherUser.displayName,
          avatarUrl: otherUser.avatarUrl,
          verificationStatus: otherUser.verificationStatus,
          isMemorial: otherUser.isMemorial,
          locationCity: otherUser.locationCity,
        },
        connectedVia: conn.connectedVia,
        createdAt: conn.createdAt,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('GET /connections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// POST /:userId/block - Block a user
// ---------------------------------------------------------------------------
router.post('/:userId/block', async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.userId;
    const targetUserId = req.params.userId as string;

    if (currentUserId === targetUserId) {
      res.status(400).json({ error: 'You cannot block yourself' });
      return;
    }

    // Check if a connection already exists between the two users (in either direction)
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { userAId: currentUserId, userBId: targetUserId },
          { userAId: targetUserId, userBId: currentUserId },
        ],
      },
    });

    if (existing) {
      // Update the existing connection to blocked (preserve original user IDs)
      await prisma.connection.update({
        where: { id: existing.id },
        data: { status: 'blocked' },
      });
    } else {
      // Create a new blocked connection
      await prisma.connection.create({
        data: {
          userAId: currentUserId,
          userBId: targetUserId,
          status: 'blocked',
        },
      });
    }

    res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    console.error('POST /:userId/block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// DELETE /:userId/block - Unblock a user
// ---------------------------------------------------------------------------
router.delete('/:userId/block', async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.userId;
    const targetUserId = req.params.userId as string;

    const blocked = await prisma.connection.findFirst({
      where: {
        OR: [
          { userAId: currentUserId, userBId: targetUserId },
          { userAId: targetUserId, userBId: currentUserId },
        ],
        status: 'blocked',
      },
    });

    if (!blocked) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    await prisma.connection.delete({
      where: { id: blocked.id },
    });

    res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    console.error('DELETE /:userId/block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
