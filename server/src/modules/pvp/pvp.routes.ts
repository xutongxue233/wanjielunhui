import type { FastifyInstance } from 'fastify';
import { pvpController } from './pvp.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

export async function pvpRoutes(fastify: FastifyInstance) {
  fastify.post('/match', {
    schema: {
      description: '加入匹配队列',
      tags: ['PVP'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: pvpController.joinMatch.bind(pvpController),
  });

  fastify.delete('/match', {
    schema: {
      description: '退出匹配队列',
      tags: ['PVP'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: pvpController.leaveMatch.bind(pvpController),
  });

  fastify.get('/history', {
    schema: {
      description: '获取战斗记录',
      tags: ['PVP'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: pvpController.getHistory.bind(pvpController),
  });

  fastify.get('/season', {
    schema: {
      description: '获取当前赛季信息',
      tags: ['PVP'],
    },
    handler: pvpController.getSeason.bind(pvpController),
  });

  fastify.get('/stats', {
    schema: {
      description: '获取PVP统计',
      tags: ['PVP'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: pvpController.getStats.bind(pvpController),
  });
}

export default pvpRoutes;
