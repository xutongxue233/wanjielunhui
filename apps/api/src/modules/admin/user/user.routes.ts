import type { FastifyInstance } from 'fastify';
import { userController } from './user.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminUserRoutes(fastify: FastifyInstance) {
  fastify.get('/users', {
    schema: {
      description: '获取用户列表',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: userController.getList.bind(userController),
  });

  fastify.post('/users/:id/ban', {
    schema: {
      description: '封禁用户',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: userController.ban.bind(userController),
  });

  fastify.post('/users/:id/unban', {
    schema: {
      description: '解封用户',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: userController.unban.bind(userController),
  });

  fastify.put('/users/:id/role', {
    schema: {
      description: '更新用户角色',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN')],
    handler: userController.updateRole.bind(userController),
  });
}

export default adminUserRoutes;
