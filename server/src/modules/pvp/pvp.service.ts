import { prisma } from '../../lib/prisma.js';
import { getRedis } from '../../lib/redis.js';
import { NotFoundError, BadRequestError, ErrorCodes } from '../../shared/errors/index.js';
import type {
  PvpMatchInfo,
  PvpMatchResult,
  PvpSeasonInfo,
  MatchPoolEntry,
} from './pvp.types.js';
import { PVP_CONFIG } from './pvp.types.js';

export class PvpService {
  private getMatchPoolKey(): string {
    return 'pvp:match:pool';
  }

  async joinMatchQueue(playerId: string): Promise<{ status: 'queued' | 'matched'; matchId?: string }> {
    const redis = getRedis();
    const poolKey = this.getMatchPoolKey();

    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const existingEntry = await redis.zscore(poolKey, playerId);
    if (existingEntry !== null) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '已在匹配队列中');
    }

    const potentialMatches = await redis.zrangebyscore(
      poolKey,
      player.pvpRating - PVP_CONFIG.RATING_RANGE_MAX,
      player.pvpRating + PVP_CONFIG.RATING_RANGE_MAX,
      'WITHSCORES'
    );

    let matchedPlayerId: string | null = null;
    let minRatingDiff = Infinity;

    for (let i = 0; i < potentialMatches.length; i += 2) {
      const candidateId = potentialMatches[i];
      const candidateRating = parseInt(potentialMatches[i + 1] ?? '0', 10);

      if (candidateId && candidateId !== playerId) {
        const ratingDiff = Math.abs(candidateRating - player.pvpRating);
        if (ratingDiff < minRatingDiff) {
          minRatingDiff = ratingDiff;
          matchedPlayerId = candidateId;
        }
      }
    }

    if (matchedPlayerId) {
      await redis.zrem(poolKey, matchedPlayerId);

      const season = await this.getCurrentSeason();
      const opponent = await prisma.player.findUnique({
        where: { id: matchedPlayerId },
      });

      if (!opponent) {
        await redis.zadd(poolKey, player.pvpRating, playerId);
        return { status: 'queued' };
      }

      const match = await prisma.pvpMatch.create({
        data: {
          playerId,
          opponentId: matchedPlayerId,
          result: 'DRAW',
          playerRatingChange: 0,
          opponentRatingChange: 0,
          battleLog: {},
          duration: 0,
          seasonId: season?.id ?? 1,
        },
      });

      return { status: 'matched', matchId: match.id };
    }

    await redis.zadd(poolKey, player.pvpRating, playerId);
    await redis.expire(poolKey, 300);

    return { status: 'queued' };
  }

  async leaveMatchQueue(playerId: string): Promise<void> {
    const redis = getRedis();
    await redis.zrem(this.getMatchPoolKey(), playerId);
  }

  async settlePvpMatch(
    matchId: string,
    winnerId: string | null,
    battleLog: Record<string, unknown>,
    duration: number
  ): Promise<PvpMatchResult> {
    const match = await prisma.pvpMatch.findUnique({
      where: { id: matchId },
      include: {
        player: true,
        opponent: true,
      },
    });

    if (!match) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '对战不存在');
    }

    let result: 'WIN' | 'LOSE' | 'DRAW';
    let playerRatingChange: number;
    let opponentRatingChange: number;

    if (winnerId === null) {
      result = 'DRAW';
      playerRatingChange = 0;
      opponentRatingChange = 0;
    } else if (winnerId === match.playerId) {
      result = 'WIN';
      const expected = 1 / (1 + Math.pow(10, (match.opponent.pvpRating - match.player.pvpRating) / 400));
      playerRatingChange = Math.round(PVP_CONFIG.K_FACTOR * (1 - expected));
      opponentRatingChange = -playerRatingChange;
    } else {
      result = 'LOSE';
      const expected = 1 / (1 + Math.pow(10, (match.opponent.pvpRating - match.player.pvpRating) / 400));
      playerRatingChange = Math.round(PVP_CONFIG.K_FACTOR * (0 - expected));
      opponentRatingChange = -playerRatingChange;
    }

    await prisma.$transaction([
      prisma.pvpMatch.update({
        where: { id: matchId },
        data: {
          winnerId,
          result,
          playerRatingChange,
          opponentRatingChange,
          battleLog,
          duration,
        },
      }),
      prisma.player.update({
        where: { id: match.playerId },
        data: { pvpRating: { increment: playerRatingChange } },
      }),
      prisma.player.update({
        where: { id: match.opponentId },
        data: { pvpRating: { increment: opponentRatingChange } },
      }),
    ]);

    return {
      matchId,
      winnerId,
      result,
      playerRatingChange,
      opponentRatingChange,
    };
  }

  async getPvpHistory(
    playerId: string,
    page: number = 1,
    pageSize: number = 20,
    seasonId?: number
  ): Promise<{ matches: PvpMatchInfo[]; total: number }> {
    const where: Record<string, unknown> = {
      OR: [{ playerId }, { opponentId: playerId }],
    };

    if (seasonId !== undefined) {
      where.seasonId = seasonId;
    }

    const [matches, total] = await Promise.all([
      prisma.pvpMatch.findMany({
        where,
        include: {
          player: true,
          opponent: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.pvpMatch.count({ where }),
    ]);

    return {
      matches: matches.map((m) => ({
        id: m.id,
        player: {
          playerId: m.player.id,
          playerName: m.player.name,
          realm: m.player.realm,
          avatarId: m.player.avatarId,
          combatPower: Number(m.player.combatPower),
          pvpRating: m.player.pvpRating,
        },
        opponent: {
          playerId: m.opponent.id,
          playerName: m.opponent.name,
          realm: m.opponent.realm,
          avatarId: m.opponent.avatarId,
          combatPower: Number(m.opponent.combatPower),
          pvpRating: m.opponent.pvpRating,
        },
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

  async getCurrentSeason(): Promise<PvpSeasonInfo | null> {
    const season = await prisma.pvpSeason.findFirst({
      where: { isActive: true },
    });

    if (!season) return null;

    return {
      id: season.id,
      name: season.name,
      startAt: season.startAt,
      endAt: season.endAt,
      isActive: season.isActive,
      rewards: season.rewards as Record<string, unknown>,
    };
  }

  async getPlayerPvpStats(playerId: string): Promise<{
    rating: number;
    rank: number | null;
    wins: number;
    losses: number;
    draws: number;
  }> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const season = await this.getCurrentSeason();

    const [wins, losses, draws] = await Promise.all([
      prisma.pvpMatch.count({
        where: {
          playerId,
          result: 'WIN',
          ...(season ? { seasonId: season.id } : {}),
        },
      }),
      prisma.pvpMatch.count({
        where: {
          playerId,
          result: 'LOSE',
          ...(season ? { seasonId: season.id } : {}),
        },
      }),
      prisma.pvpMatch.count({
        where: {
          playerId,
          result: 'DRAW',
          ...(season ? { seasonId: season.id } : {}),
        },
      }),
    ]);

    const higherRatedCount = await prisma.player.count({
      where: { pvpRating: { gt: player.pvpRating } },
    });

    return {
      rating: player.pvpRating,
      rank: higherRatedCount + 1,
      wins,
      losses,
      draws,
    };
  }
}

export const pvpService = new PvpService();
