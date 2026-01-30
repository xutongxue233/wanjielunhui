import { prisma } from '../../../lib/prisma.js';

export class AdminSectService {
  async getList(page: number, pageSize: number, search?: string) {
    const where = search ? { name: { contains: search } } : {};

    const [sects, total] = await Promise.all([
      prisma.sect.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { totalPower: 'desc' },
      }),
      prisma.sect.count({ where }),
    ]);

    return {
      sects: sects.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        notice: s.notice,
        iconId: s.iconId,
        level: s.level,
        memberCount: s.memberCount,
        maxMembers: s.maxMembers,
        totalPower: Number(s.totalPower),
        joinType: s.joinType,
        founderId: s.founderId,
        createdAt: s.createdAt,
      })),
      total,
    };
  }

  async getMembers(sectId: string) {
    const members = await prisma.sectMember.findMany({
      where: { sectId },
      include: { player: true },
      orderBy: [{ role: 'asc' }, { contribution: 'desc' }],
    });

    return {
      members: members.map((m) => ({
        id: m.id,
        playerId: m.player.id,
        playerName: m.player.name,
        playerRealm: m.player.realm,
        role: m.role,
        combatPower: Number(m.player.combatPower),
        contribution: Number(m.contribution),
        joinedAt: m.joinedAt,
      })),
    };
  }

  async disband(sectId: string): Promise<void> {
    await prisma.$transaction([
      prisma.sectMember.deleteMany({ where: { sectId } }),
      prisma.sectApplication.deleteMany({ where: { sectId } }),
      prisma.sect.delete({ where: { id: sectId } }),
    ]);
  }

  async kickMember(sectId: string, playerId: string): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
      include: { player: true },
    });

    if (member && member.sectId === sectId) {
      await prisma.$transaction([
        prisma.sectMember.delete({ where: { playerId } }),
        prisma.sect.update({
          where: { id: sectId },
          data: {
            memberCount: { decrement: 1 },
            totalPower: { decrement: member.player.combatPower },
          },
        }),
      ]);
    }
  }

  async getStats() {
    const [totalSects, totalMembers] = await Promise.all([
      prisma.sect.count(),
      prisma.sectMember.count(),
    ]);
    const avgMembers = totalSects > 0 ? totalMembers / totalSects : 0;

    return { totalSects, totalMembers, avgMembers };
  }
}

export const adminSectService = new AdminSectService();
