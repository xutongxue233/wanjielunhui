import type { FastifyInstance } from 'fastify';
import { dashboardController } from './dashboard.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminDashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/dashboard/stats', {
    schema: {
      description: '获取仪表盘统计数据',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: dashboardController.getStats.bind(dashboardController),
  });

  fastify.get('/dashboard/system', {
    schema: {
      description: '获取系统状态',
      tags: ['管理后台'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate, requireRole('ADMIN', 'GM')],
    handler: dashboardController.getSystemStatus.bind(dashboardController),
  });
}

export default adminDashboardRoutes;
