import type { FastifyInstance } from 'fastify';
import { adminMailController } from './mail.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminMailRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.post('/mail/broadcast', {
    schema: {
      description: '群发系统邮件',
      tags: ['管理员-邮件'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'content', 'targetType'],
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                id: { type: 'string' },
                amount: { type: 'number' },
              },
            },
          },
          targetType: { type: 'string', enum: ['all', 'realm', 'vip', 'custom'] },
          targetRealm: { type: 'string' },
          targetVipLevel: { type: 'number' },
          targetPlayerIds: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    handler: adminMailController.broadcast.bind(adminMailController),
  });

  fastify.get('/mail/stats', {
    schema: {
      description: '获取邮件统计',
      tags: ['管理员-邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: adminMailController.getStats.bind(adminMailController),
  });
}

export default adminMailRoutes;
