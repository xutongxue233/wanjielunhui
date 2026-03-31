import type { Server as SocketServer, Socket } from 'socket.io';
import type { FastifyInstance } from 'fastify';
import { verifySocketToken } from './auth.js';
import { chatHandler } from './handlers/chat.handler.js';
import { pvpHandler } from './handlers/pvp.handler.js';
import { getRedis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';

export interface SocketUserData {
  userId: string;
  playerId: string;
  playerName: string;
  playerRealm: string;
  sectId?: string;
}

declare module 'socket.io' {
  interface Socket {
    user: SocketUserData;
  }
}

export function setupSocketIO(io: SocketServer, app: FastifyInstance) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;
      if (!token) {
        return next(new Error('未提供认证令牌'));
      }

      const userData = await verifySocketToken(token, app);
      socket.user = userData;
      next();
    } catch (error) {
      next(new Error('认证失败'));
    }
  });

  io.on('connection', async (socket) => {
    const { playerId, playerName } = socket.user;
    logger.info({ playerId, playerName }, '玩家连接');

    const redis = getRedis();
    await redis.set(`player:online:${playerId}`, socket.id, 'EX', 3600);

    if (socket.user.sectId) {
      socket.join(`sect:${socket.user.sectId}`);
    }

    socket.join('world');

    chatHandler(io, socket);
    pvpHandler(io, socket);

    socket.on('disconnect', async () => {
      logger.info({ playerId, playerName }, '玩家断开连接');
      await redis.del(`player:online:${playerId}`);
    });

    socket.on('error', (error) => {
      logger.error({ error, playerId }, 'Socket错误');
    });
  });

  return io;
}

export default setupSocketIO;
