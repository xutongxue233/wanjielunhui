import type { FastifyInstance } from 'fastify';
import { adminFriendController } from './friend.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminFriendRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/friends', {
    schema: { description: '获取好友关系列表', tags: ['管理员-好友'] },
    handler: adminFriendController.getList.bind(adminFriendController),
  });

  fastify.delete('/friends/:id', {
    schema: { description: '删除好友关系', tags: ['管理员-好友'] },
    handler: adminFriendController.delete.bind(adminFriendController),
  });

  fastify.get('/friends/stats', {
    schema: { description: '获取好友统计', tags: ['管理员-好友'] },
    handler: adminFriendController.getStats.bind(adminFriendController),
  });
}

export default adminFriendRoutes;
