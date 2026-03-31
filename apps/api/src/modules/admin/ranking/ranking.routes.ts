import type { FastifyInstance } from 'fastify';
import { adminRankingController } from './ranking.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminRankingRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/ranking/:type', {
    schema: {
      description: '获取排行榜列表',
      tags: ['管理员-排行榜'],
      params: {
        type: 'object',
        properties: {
          type: { type: 'string' },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
        },
      },
    },
    handler: adminRankingController.getList.bind(adminRankingController),
  });

  fastify.post('/ranking/sync', {
    schema: {
      description: '同步所有玩家排行榜数据',
      tags: ['管理员-排行榜'],
    },
    handler: adminRankingController.syncAll.bind(adminRankingController),
  });

  fastify.post('/ranking/:type/rebuild', {
    schema: {
      description: '重建指定类型排行榜',
      tags: ['管理员-排行榜'],
    },
    handler: adminRankingController.rebuild.bind(adminRankingController),
  });
}

export default adminRankingRoutes;
