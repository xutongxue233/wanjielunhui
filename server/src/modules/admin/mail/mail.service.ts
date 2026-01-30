import { prisma } from '../../../lib/prisma.js';
import type { MailType } from '@prisma/client';

interface MailAttachment {
  type: string;
  id: string;
  amount: number;
}

interface BroadcastMailInput {
  title: string;
  content: string;
  attachments?: MailAttachment[];
  targetType: 'all' | 'realm' | 'vip' | 'custom';
  targetRealm?: string;
  targetVipLevel?: number;
  targetPlayerIds?: string[];
}

export class AdminMailService {
  async broadcastMail(input: BroadcastMailInput): Promise<{ sent: number }> {
    let playerIds: string[] = [];

    switch (input.targetType) {
      case 'all':
        const allPlayers = await prisma.player.findMany({
          select: { id: true },
        });
        playerIds = allPlayers.map((p) => p.id);
        break;

      case 'realm':
        if (!input.targetRealm) {
          throw new Error('必须指定目标境界');
        }
        const realmPlayers = await prisma.player.findMany({
          where: { realm: input.targetRealm },
          select: { id: true },
        });
        playerIds = realmPlayers.map((p) => p.id);
        break;

      case 'vip':
        if (input.targetVipLevel === undefined) {
          throw new Error('必须指定VIP等级');
        }
        const vipPlayers = await prisma.player.findMany({
          where: { vipLevel: { gte: input.targetVipLevel } },
          select: { id: true },
        });
        playerIds = vipPlayers.map((p) => p.id);
        break;

      case 'custom':
        if (!input.targetPlayerIds || input.targetPlayerIds.length === 0) {
          throw new Error('必须指定目标玩家');
        }
        playerIds = input.targetPlayerIds;
        break;
    }

    if (playerIds.length === 0) {
      return { sent: 0 };
    }

    const mailData = playerIds.map((receiverId) => ({
      receiverId,
      type: 'SYSTEM' as MailType,
      title: input.title,
      content: input.content,
      attachments: input.attachments ? JSON.stringify(input.attachments) : null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }));

    await prisma.mail.createMany({
      data: mailData,
    });

    await prisma.operationLog.create({
      data: {
        action: 'BROADCAST_MAIL',
        target: input.targetType,
        details: JSON.stringify({
          title: input.title,
          targetType: input.targetType,
          sentCount: playerIds.length,
        }),
      },
    });

    return { sent: playerIds.length };
  }

  async getMailStats(): Promise<{
    total: number;
    unread: number;
    unclaimed: number;
  }> {
    const [total, unread, unclaimed] = await Promise.all([
      prisma.mail.count(),
      prisma.mail.count({ where: { isRead: false } }),
      prisma.mail.count({
        where: {
          isClaimed: false,
          attachments: { not: null },
        },
      }),
    ]);

    return { total, unread, unclaimed };
  }
}

export const adminMailService = new AdminMailService();
