import type { FastifyInstance } from 'fastify';
import { rankingController } from './ranking.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

export async function rankingRoutes(fastify: FastifyInstance) {
  fastify.get('/:type', {
    schema: {
      description: '获取排行榜列表',
      tags: ['排行榜'],
    },
    handler: rankingController.getRankingList.bind(rankingController),
  });

  fastify.get('/:type/me', {
    schema: {
      description: '获取自己的排名',
      tags: ['排行榜'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: rankingController.getMyRank.bind(rankingController),
  });

  fastify.get('/:type/around', {
    schema: {
      description: '获取自己排名附近的玩家',
      tags: ['排行榜'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: rankingController.getAroundRanking.bind(rankingController),
  });
}

export default rankingRoutes;
