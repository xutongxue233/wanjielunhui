import type { FastifyInstance } from 'fastify';
import { activityController } from './activity.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function activityRoutes(fastify: FastifyInstance) {
  fastify.get('/activities', {
    schema: { description: '获取活动列表', tags: ['运营'] },
    handler: activityController.getActive.bind(activityController),
  });

  fastify.get('/activity/:id/progress', {
    schema: { description: '获取活动进度', tags: ['运营'], security: [{ bearerAuth: [] }] },
    preHandler: authenticate,
    handler: activityController.getProgress.bind(activityController),
  });

  fastify.post('/activity/:id/claim', {
    schema: { description: '领取活动奖励', tags: ['运营'], security: [{ bearerAuth: [] }] },
    preHandler: authenticate,
    handler: activityController.claimReward.bind(activityController),
  });
}

export async function adminActivityRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/activities', {
    schema: { description: '获取所有活动', tags: ['管理-活动'], security: [{ bearerAuth: [] }] },
    handler: activityController.getAll.bind(activityController),
  });

  fastify.post('/activities', {
    schema: { description: '创建活动', tags: ['管理-活动'], security: [{ bearerAuth: [] }] },
    handler: activityController.create.bind(activityController),
  });

  fastify.put('/activities/:id', {
    schema: { description: '更新活动', tags: ['管理-活动'], security: [{ bearerAuth: [] }] },
    handler: activityController.update.bind(activityController),
  });

  fastify.delete('/activities/:id', {
    schema: { description: '删除活动', tags: ['管理-活动'], security: [{ bearerAuth: [] }] },
    handler: activityController.delete.bind(activityController),
  });
}

export default activityRoutes;
