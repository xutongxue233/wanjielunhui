import { prisma } from '../../../lib/prisma.js';

export class AdminFriendService {
  async getList(page: number, pageSize: number, search?: string) {
    const where = search
      ? {
          OR: [
            { player: { name: { contains: search } } },
            { friend: { name: { contains: search } } },
          ],
        }
      : {};

    const [relations, total] = await Promise.all([
      prisma.friend.findMany({
        where,
        include: {
          player: { select: { id: true, name: true, realm: true } },
          friend: { select: { id: true, name: true, realm: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.friend.count({ where }),
    ]);

    return {
      relations: relations.map((r) => ({
        id: r.id,
        playerId: r.player.id,
        playerName: r.player.name,
        playerRealm: r.player.realm,
        friendId: r.friend.id,
        friendName: r.friend.name,
        friendRealm: r.friend.realm,
        intimacy: r.intimacy,
        createdAt: r.createdAt,
      })),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    const relation = await prisma.friend.findUnique({ where: { id } });
    if (relation) {
      await prisma.$transaction([
        prisma.friend.delete({ where: { id } }),
        prisma.friend.deleteMany({
          where: { playerId: relation.friendId, friendId: relation.playerId },
        }),
      ]);
    }
  }

  async getStats() {
    const totalRelations = await prisma.friend.count();
    const playerCount = await prisma.player.count();
    const avgFriends = playerCount > 0 ? totalRelations / playerCount : 0;

    return { totalRelations, avgFriends };
  }
}

export const adminFriendService = new AdminFriendService();
