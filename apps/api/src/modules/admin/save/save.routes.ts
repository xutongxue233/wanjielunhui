import type { FastifyInstance } from 'fastify';
import { saveController } from './save.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminSaveRoutes(fastify: FastifyInstance) {
  fastify.get('/saves', {
    schema: {
      description: '获取存档列表',
      tags: ['管理后台-存档'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: saveController.getList.bind(saveController),
  });

  fastify.get('/saves/stats', {
    schema: {
      description: '获取存档统计',
      tags: ['管理后台-存档'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: saveController.getStats.bind(saveController),
  });

  fastify.get('/saves/:id', {
    schema: {
      description: '获取存档详情',
      tags: ['管理后台-存档'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: saveController.getById.bind(saveController),
  });

  fastify.delete('/saves/:id', {
    schema: {
      description: '删除存档',
      tags: ['管理后台-存档'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN')],
    handler: saveController.delete.bind(saveController),
  });
}

export default adminSaveRoutes;
