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
          battleLog: JSON.stringify({}),
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
          battleLog: JSON.stringify(battleLog),
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
      rewards: (season.rewards ? JSON.parse(season.rewards) : {}) as Record<string, unknown>,
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

  async getBattleState(playerId: string): Promise<{
    matchId: string;
    myHp: number;
    myMaxHp: number;
    enemyHp: number;
    enemyMaxHp: number;
    isMyTurn: boolean;
    opponent: { id: string; name: string; realm: string };
    logs: { message: string; type: string }[];
    status: 'ongoing' | 'won' | 'lost';
  } | null> {
    const redis = getRedis();
    const battleKey = `pvp:battle:${playerId}`;
    const battleData = await redis.get(battleKey);

    if (!battleData) {
      return null;
    }

    return JSON.parse(battleData);
  }

  async performBattleAction(
    playerId: string,
    action: 'attack' | 'skill' | 'defend'
  ): Promise<{
    matchId: string;
    myHp: number;
    myMaxHp: number;
    enemyHp: number;
    enemyMaxHp: number;
    isMyTurn: boolean;
    opponent: { id: string; name: string; realm: string };
    logs: { message: string; type: string }[];
    status: 'ongoing' | 'won' | 'lost';
  }> {
    const redis = getRedis();
    const battleKey = `pvp:battle:${playerId}`;
    const battleData = await redis.get(battleKey);

    if (!battleData) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '当前没有进行中的战斗');
    }

    const battle = JSON.parse(battleData);

    if (!battle.isMyTurn) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '不是你的回合');
    }

    // 获取双方玩家属性用于计算伤害
    const [myPlayer, enemyPlayer] = await Promise.all([
      prisma.player.findUnique({ where: { id: playerId } }),
      prisma.player.findUnique({ where: { id: battle.opponent.id } }),
    ]);

    const myAtk = myPlayer?.attack ?? 10;
    const myDef = myPlayer?.defense ?? 5;
    const mySpeed = myPlayer?.speed ?? 10;
    const myCritRate = myPlayer?.critRate ?? 0.05;
    const myCritDamage = myPlayer?.critDamage ?? 1.5;
    const enemyAtk = enemyPlayer?.attack ?? 10;
    const enemyDef = enemyPlayer?.defense ?? 5;

    const logs: { message: string; type: string }[] = [...battle.logs];
    let damage = 0;

    // 伤害公式: 基础伤害 = 攻击力 * 倍率 - 防御力 * 减免系数 + 随机浮动
    // 防御减免系数: 防御/(防御+100)，最高减免60%
    const defReduction = Math.min(0.6, enemyDef / (enemyDef + 100));
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9~1.1随机浮动
    const isCrit = Math.random() < myCritRate;
    const critMultiplier = isCrit ? myCritDamage : 1.0;

    switch (action) {
      case 'attack': {
        const baseDamage = myAtk * 1.0;
        damage = Math.max(1, Math.floor(baseDamage * (1 - defReduction) * randomFactor * critMultiplier));
        battle.enemyHp = Math.max(0, battle.enemyHp - damage);
        const critText = isCrit ? '(暴击!)' : '';
        logs.push({ message: `你发动攻击，造成 ${damage} 点伤害${critText}`, type: 'player' });
        break;
      }
      case 'skill': {
        const baseDamage = myAtk * 1.8;
        damage = Math.max(1, Math.floor(baseDamage * (1 - defReduction) * randomFactor * critMultiplier));
        battle.enemyHp = Math.max(0, battle.enemyHp - damage);
        const critText = isCrit ? '(暴击!)' : '';
        logs.push({ message: `你使用技能，造成 ${damage} 点伤害${critText}`, type: 'player' });
        break;
      }
      case 'defend':
        logs.push({ message: '你进入防御姿态', type: 'player' });
        break;
    }

    if (battle.enemyHp <= 0) {
      battle.status = 'won';
      logs.push({ message: '你获得了胜利!', type: 'system' });
      await redis.del(battleKey);
    } else {
      // 敌人回击伤害也基于属性
      const myDefReduction = Math.min(0.6, myDef / (myDef + 100));
      const enemyRandomFactor = 0.9 + Math.random() * 0.2;
      const enemyBaseDamage = enemyAtk * 1.0;
      let enemyDamage = Math.max(1, Math.floor(enemyBaseDamage * (1 - myDefReduction) * enemyRandomFactor));
      const actualDamage = action === 'defend' ? Math.floor(enemyDamage / 2) : enemyDamage;
      battle.myHp = Math.max(0, battle.myHp - actualDamage);
      logs.push({ message: `${battle.opponent.name} 攻击你，造成 ${actualDamage} 点伤害`, type: 'enemy' });

      if (battle.myHp <= 0) {
        battle.status = 'lost';
        logs.push({ message: '你被击败了...', type: 'system' });
        await redis.del(battleKey);
      } else {
        battle.logs = logs.slice(-10);
        await redis.setex(battleKey, 600, JSON.stringify(battle));
      }
    }

    return { ...battle, logs: logs.slice(-10) };
  }

  async surrender(playerId: string): Promise<void> {
    const redis = getRedis();
    const battleKey = `pvp:battle:${playerId}`;
    const battleData = await redis.get(battleKey);

    if (!battleData) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '当前没有进行中的战斗');
    }

    const battle = JSON.parse(battleData);

    // 清除Redis战斗数据
    await redis.del(battleKey);

    // 投降者为败方，进行积分结算
    if (battle.matchId) {
      const opponentId = battle.opponent?.id;
      await this.settlePvpMatch(
        battle.matchId,
        opponentId ?? null,   // 对手为胜方
        { result: 'surrender', surrenderedBy: playerId },
        0
      );
    }
  }
}

export const pvpService = new PvpService();
