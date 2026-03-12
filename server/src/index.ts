import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import path from 'path';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import momentRoutes from './routes/moments';
import conversationRoutes from './routes/conversations';
import connectionRoutes from './routes/connections';
import eventRoutes from './routes/events';
import memorialRoutes from './routes/memorials';
import reportRoutes from './routes/reports';
import verifyRoutes from './routes/verify';
import adminRoutes from './routes/admin';
import { verifyAccessToken } from './utils/jwt';

const prisma = new PrismaClient();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Socket.io
const io = new SocketServer(httpServer, {
  cors: { origin: CORS_ORIGIN, methods: ['GET', 'POST'] },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/moments', momentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/memorials', memorialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io authentication and real-time messaging
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const payload = verifyAccessToken(token);
    (socket as any).userId = payload.userId;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  socket.join(`user:${userId}`);

  socket.on('join_conversation', async (conversationId: string) => {
    // Verify user is a participant before allowing them to join
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (participant) {
      socket.join(`conversation:${conversationId}`);
    }
  });

  socket.on('leave_conversation', (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('send_message', async (data: { conversationId: string; content: string }) => {
    // Only emit if sender is in the conversation room (verified on join)
    if (!socket.rooms.has(`conversation:${data.conversationId}`)) return;
    io.to(`conversation:${data.conversationId}`).emit('new_message', {
      conversationId: data.conversationId,
      senderId: userId,
      content: data.content,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on('typing', (data: { conversationId: string }) => {
    if (!socket.rooms.has(`conversation:${data.conversationId}`)) return;
    socket.to(`conversation:${data.conversationId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId,
    });
  });

  socket.on('disconnect', () => {
    socket.leave(`user:${userId}`);
  });
});

// Export io for use in routes if needed
export { io };

httpServer.listen(PORT, () => {
  console.log(`Still Here server running on port ${PORT}`);
});
