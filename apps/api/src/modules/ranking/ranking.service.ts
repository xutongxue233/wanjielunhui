import type { RankingType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { getRedis } from '../../lib/redis.js';
import { NotFoundError, ErrorCodes } from '../../shared/errors/index.js';
import {
  type RankingEntry,
  type RankingListResponse,
  type PlayerRankResponse,
  type AroundRankingResponse,
  type RankingSnapshot,
  RANKING_CONFIG,
} from './ranking.types.js';

export class RankingService {
  private getRedisKey(type: RankingType, seasonId?: number): string {
    const suffix = seasonId ? `:season:${seasonId}` : '';
    return `${RANKING_CONFIG.REDIS_KEY_PREFIX}:${type}${suffix}`;
  }

  async updatePlayerRanking(
    playerId: string,
    type: RankingType,
    score: bigint,
    snapshot: RankingSnapshot,
    seasonId?: number
  ): Promise<void> {
    const redis = getRedis();
    const key = this.getRedisKey(type, seasonId);

    await redis.zadd(key, Number(score), playerId);

    await prisma.ranking.upsert({
      where: {
        playerId_type_seasonId: {
          playerId,
          type,
          seasonId: seasonId ?? 0,
        },
      },
      update: {
        score,
        snapshot: JSON.stringify(snapshot),
      },
      create: {
        playerId,
        type,
        score,
        snapshot: JSON.stringify(snapshot),
        seasonId: seasonId ?? 0,
      },
    });
  }

  async getRankingList(
    type: RankingType,
    page: number = 1,
    pageSize: number = RANKING_CONFIG.PAGE_SIZE_DEFAULT,
    seasonId?: number
  ): Promise<RankingListResponse> {
    const redis = getRedis();
    const key = this.getRedisKey(type, seasonId);

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const playerIds = await redis.zrevrange(key, start, end);
    const total = await redis.zcard(key);

    if (playerIds.length === 0) {
      return {
        type,
        entries: [],
        total,
        page,
        pageSize,
        updatedAt: new Date(),
      };
    }

    const rankings = await prisma.ranking.findMany({
      where: {
        playerId: { in: playerIds },
        type,
        seasonId: seasonId ?? 0,
      },
      include: {
        player: {
          include: {
            sectMember: {
              include: {
                sect: true,
              },
            },
          },
        },
      },
    });

    const rankingMap = new Map(rankings.map((r) => [r.playerId, r]));

    const entries: RankingEntry[] = playerIds.map((playerId, index) => {
      const ranking = rankingMap.get(playerId);
      const snapshot = ranking?.snapshot as RankingSnapshot | undefined;

      return {
        rank: start + index + 1,
        playerId,
        playerName: snapshot?.name ?? ranking?.player.name ?? '未知',
        playerRealm: snapshot?.realm ?? ranking?.player.realm ?? '炼气',
        playerTitle: snapshot?.title ?? ranking?.player.title ?? undefined,
        avatarId: snapshot?.avatarId ?? ranking?.player.avatarId ?? 1,
        score: Number(ranking?.score ?? 0),
        sectName: snapshot?.sectName ?? ranking?.player.sectMember?.sect.name,
      };
    });

    return {
      type,
      entries,
      total,
      page,
      pageSize,
      updatedAt: new Date(),
    };
  }

  async getPlayerRank(
    playerId: string,
    type: RankingType,
    seasonId?: number
  ): Promise<PlayerRankResponse> {
    const redis = getRedis();
    const key = this.getRedisKey(type, seasonId);

    const rank = await redis.zrevrank(key, playerId);
    const score = await redis.zscore(key, playerId);
    const total = await redis.zcard(key);

    return {
      type,
      rank: rank !== null ? rank + 1 : null,
      score: score !== null ? Number(score) : 0,
      totalPlayers: total,
    };
  }

  async getAroundRanking(
    playerId: string,
    type: RankingType,
    count: number = RANKING_CONFIG.AROUND_COUNT,
    seasonId?: number
  ): Promise<AroundRankingResponse> {
    const redis = getRedis();
    const key = this.getRedisKey(type, seasonId);

    const myRank = await redis.zrevrank(key, playerId);
    const myScore = await redis.zscore(key, playerId);

    if (myRank === null) {
      return {
        type,
        myRank: null,
        myScore: 0,
        entries: [],
      };
    }

    const start = Math.max(0, myRank - count);
    const end = myRank + count;

    const playerIds = await redis.zrevrange(key, start, end);

    if (playerIds.length === 0) {
      return {
        type,
        myRank: myRank + 1,
        myScore: Number(myScore ?? 0),
        entries: [],
      };
    }

    const rankings = await prisma.ranking.findMany({
      where: {
        playerId: { in: playerIds },
        type,
        seasonId: seasonId ?? 0,
      },
      include: {
        player: {
          include: {
            sectMember: {
              include: {
                sect: true,
              },
            },
          },
        },
      },
    });

    const rankingMap = new Map(rankings.map((r) => [r.playerId, r]));

    const entries: RankingEntry[] = playerIds.map((pid, index) => {
      const ranking = rankingMap.get(pid);
      const snapshot = ranking?.snapshot as RankingSnapshot | undefined;

      return {
        rank: start + index + 1,
        playerId: pid,
        playerName: snapshot?.name ?? ranking?.player.name ?? '未知',
        playerRealm: snapshot?.realm ?? ranking?.player.realm ?? '炼气',
        playerTitle: snapshot?.title ?? ranking?.player.title ?? undefined,
        avatarId: snapshot?.avatarId ?? ranking?.player.avatarId ?? 1,
        score: Number(ranking?.score ?? 0),
        sectName: snapshot?.sectName ?? ranking?.player.sectMember?.sect.name,
      };
    });

    return {
      type,
      myRank: myRank + 1,
      myScore: Number(myScore ?? 0),
      entries,
    };
  }

  async syncPlayerToRanking(playerId: string): Promise<void> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        sectMember: {
          include: {
            sect: true,
          },
        },
      },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const snapshot: RankingSnapshot = {
      name: player.name,
      realm: player.realm,
      realmStage: player.realmStage,
      title: player.title ?? undefined,
      avatarId: player.avatarId,
      sectName: player.sectMember?.sect.name,
      combatPower: Number(player.combatPower),
    };

    await Promise.all([
      this.updatePlayerRanking(playerId, 'COMBAT_POWER', player.combatPower, snapshot),
      this.updatePlayerRanking(playerId, 'REALM', player.totalCultivation, snapshot),
      this.updatePlayerRanking(playerId, 'REINCARNATION', BigInt(player.reincarnations), snapshot),
      this.updatePlayerRanking(playerId, 'PVP_RATING', BigInt(player.pvpRating), snapshot),
      this.updatePlayerRanking(playerId, 'WEALTH', player.spiritStones, snapshot),
    ]);
  }

  async syncAllPlayersToRanking(): Promise<number> {
    const players = await prisma.player.findMany({
      select: { id: true },
    });

    let count = 0;
    for (const player of players) {
      await this.syncPlayerToRanking(player.id);
      count++;
    }

    return count;
  }

  async rebuildRankingFromDb(type: RankingType, seasonId?: number): Promise<void> {
    const redis = getRedis();
    const key = this.getRedisKey(type, seasonId);

    await redis.del(key);

    const rankings = await prisma.ranking.findMany({
      where: {
        type,
        seasonId: seasonId ?? 0,
      },
    });

    if (rankings.length === 0) return;

    const members: (string | number)[] = [];
    for (const ranking of rankings) {
      members.push(Number(ranking.score), ranking.playerId);
    }

    await redis.zadd(key, ...members);
  }
}

export const rankingService = new RankingService();
