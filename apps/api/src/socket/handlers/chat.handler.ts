import type { Server as SocketServer, Socket } from 'socket.io';
import { prisma } from '../../lib/prisma.js';
import { getRedis } from '../../lib/redis.js';
import { logger } from '../../lib/logger.js';

interface ChatMessage {
  channel: 'WORLD' | 'SECT' | 'PRIVATE';
  content: string;
  targetId?: string;
}

interface ChatResponse {
  id: string;
  channel: string;
  senderId: string;
  senderName: string;
  senderRealm: string;
  content: string;
  createdAt: Date;
}

const MESSAGE_COOLDOWN = 2000;
const MAX_MESSAGE_LENGTH = 500;

export function chatHandler(io: SocketServer, socket: Socket) {
  const redis = getRedis();

  socket.on('chat:send', async (data: ChatMessage, callback?: (res: { success: boolean; error?: string }) => void) => {
    try {
      const { playerId, playerName, playerRealm, sectId } = socket.user;

      if (!data.content || data.content.trim().length === 0) {
        callback?.({ success: false, error: '消息内容不能为空' });
        return;
      }

      if (data.content.length > MAX_MESSAGE_LENGTH) {
        callback?.({ success: false, error: '消息内容过长' });
        return;
      }

      const cooldownKey = `chat:cooldown:${playerId}`;
      const lastSend = await redis.get(cooldownKey);
      if (lastSend) {
        callback?.({ success: false, error: '发送太频繁，请稍后再试' });
        return;
      }

      await redis.set(cooldownKey, '1', 'PX', MESSAGE_COOLDOWN);

      const message = await prisma.chatMessage.create({
        data: {
          channel: data.channel,
          channelId: data.channel === 'SECT' ? sectId : data.channel === 'PRIVATE' ? data.targetId : null,
          senderId: playerId,
          senderName: playerName,
          senderRealm: playerRealm,
          content: data.content.trim(),
        },
      });

      const response: ChatResponse = {
        id: message.id,
        channel: message.channel,
        senderId: message.senderId,
        senderName: message.senderName,
        senderRealm: message.senderRealm,
        content: message.content,
        createdAt: message.createdAt,
      };

      switch (data.channel) {
        case 'WORLD':
          io.to('world').emit('chat:message', response);
          break;

        case 'SECT':
          if (!sectId) {
            callback?.({ success: false, error: '未加入门派' });
            return;
          }
          io.to(`sect:${sectId}`).emit('chat:message', response);
          break;

        case 'PRIVATE':
          if (!data.targetId) {
            callback?.({ success: false, error: '未指定目标玩家' });
            return;
          }
          const targetSocketId = await redis.get(`player:online:${data.targetId}`);
          if (targetSocketId) {
            io.to(targetSocketId).emit('chat:message', response);
          }
          socket.emit('chat:message', response);
          break;
      }

      callback?.({ success: true });
    } catch (error) {
      logger.error({ error }, '发送消息失败');
      callback?.({ success: false, error: '发送消息失败' });
    }
  });

  socket.on('chat:history', async (
    data: { channel: 'WORLD' | 'SECT' | 'PRIVATE'; channelId?: string; limit?: number },
    callback: (res: { success: boolean; messages?: ChatResponse[]; error?: string }) => void
  ) => {
    try {
      const { sectId } = socket.user;
      const limit = Math.min(data.limit ?? 50, 100);

      let channelId: string | null = null;
      if (data.channel === 'SECT') {
        if (!sectId) {
          callback({ success: false, error: '未加入门派' });
          return;
        }
        channelId = sectId;
      } else if (data.channel === 'PRIVATE' && data.channelId) {
        channelId = data.channelId;
      }

      const messages = await prisma.chatMessage.findMany({
        where: {
          channel: data.channel,
          channelId,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      callback({
        success: true,
        messages: messages.reverse().map((m) => ({
          id: m.id,
          channel: m.channel,
          senderId: m.senderId,
          senderName: m.senderName,
          senderRealm: m.senderRealm,
          content: m.content,
          createdAt: m.createdAt,
        })),
      });
    } catch (error) {
      logger.error({ error }, '获取聊天记录失败');
      callback({ success: false, error: '获取聊天记录失败' });
    }
  });
}

export default chatHandler;
