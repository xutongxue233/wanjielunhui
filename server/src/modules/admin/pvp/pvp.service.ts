import { prisma } from '../../../lib/prisma.js';
import { getRedis } from '../../../lib/redis.js';

export class AdminPvpService {
  async getMatches(page: number, pageSize: number) {
    const [matches, total] = await Promise.all([
      prisma.pvpMatch.findMany({
        include: {
          player: { select: { name: true } },
          opponent: { select: { name: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pvpMatch.count(),
    ]);

    return {
      matches: matches.map((m) => ({
        id: m.id,
        playerId: m.playerId,
        playerName: m.player.name,
        opponentId: m.opponentId,
        opponentName: m.opponent.name,
        result: m.result,
        playerRatingChange: m.playerRatingChange,
        opponentRatingChange: m.opponentRatingChange,
        duration: m.duration,
        seasonId: m.seasonId,
        createdAt: m.createdAt,
      })),
      total,
    };
  }

  async getSeasons() {
    const seasons = await prisma.pvpSeason.findMany({
      orderBy: { id: 'desc' },
    });

    return {
      seasons: seasons.map((s) => ({
        id: s.id,
        name: s.name,
        startAt: s.startAt,
        endAt: s.endAt,
        isActive: s.isActive,
        rewards: JSON.parse(s.rewards),
      })),
    };
  }

  async createSeason(data: { name: string; startAt: string; endAt: string; rewards: Record<string, unknown> }) {
    const season = await prisma.pvpSeason.create({
      data: {
        name: data.name,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        rewards: JSON.stringify(data.rewards),
      },
    });

    return {
      id: season.id,
      name: season.name,
      startAt: season.startAt,
      endAt: season.endAt,
      isActive: season.isActive,
      rewards: data.rewards,
    };
  }

  async activateSeason(id: number): Promise<void> {
    await prisma.$transaction([
      prisma.pvpSeason.updateMany({ where: { isActive: true }, data: { isActive: false } }),
      prisma.pvpSeason.update({ where: { id }, data: { isActive: true } }),
    ]);
  }

  async endSeason(id: number): Promise<void> {
    await prisma.pvpSeason.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const redis = getRedis();

    const [totalMatches, todayMatches, currentSeason, activeQueue] = await Promise.all([
      prisma.pvpMatch.count(),
      prisma.pvpMatch.count({ where: { createdAt: { gte: today } } }),
      prisma.pvpSeason.findFirst({ where: { isActive: true } }),
      redis.zcard('pvp:match:pool'),
    ]);

    return {
      totalMatches,
      todayMatches,
      activeQueue,
      currentSeason: currentSeason?.name || '',
    };
  }
}

export const adminPvpService = new AdminPvpService();
