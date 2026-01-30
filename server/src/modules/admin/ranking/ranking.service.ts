import { prisma } from '../../../lib/prisma.js';
import { getRedis } from '../../../lib/redis.js';
import { rankingService } from '../../ranking/ranking.service.js';
import type { RankingType } from '@prisma/client';

export class AdminRankingService {
  async getList(type: RankingType, page: number, pageSize: number) {
    return rankingService.getRankingList(type, page, pageSize);
  }

  async syncAll(): Promise<{ synced: number }> {
    const count = await rankingService.syncAllPlayersToRanking();
    return { synced: count };
  }

  async rebuild(type: RankingType): Promise<void> {
    await rankingService.rebuildRankingFromDb(type);
  }
}

export const adminRankingService = new AdminRankingService();
