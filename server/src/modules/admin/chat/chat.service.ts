import { prisma } from '../../../lib/prisma.js';
import type { ChatChannel } from '@prisma/client';

export class AdminChatService {
  async getList(channel: ChatChannel, page: number, pageSize: number) {
    const where = { channel };

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.chatMessage.count({ where }),
    ]);

    return {
      messages: messages.map((m) => ({
        id: m.id,
        channel: m.channel,
        senderId: m.senderId,
        senderName: m.senderName,
        senderRealm: m.senderRealm,
        content: m.content,
        createdAt: m.createdAt,
      })),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.chatMessage.delete({ where: { id } });
  }

  async clearChannel(channel: ChatChannel): Promise<void> {
    await prisma.chatMessage.deleteMany({ where: { channel } });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalMessages, todayMessages] = await Promise.all([
      prisma.chatMessage.count(),
      prisma.chatMessage.count({ where: { createdAt: { gte: today } } }),
    ]);

    return { totalMessages, todayMessages };
  }
}

export const adminChatService = new AdminChatService();
