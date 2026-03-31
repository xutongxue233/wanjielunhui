import type { FastifyInstance } from 'fastify';
import { mailController } from './mail.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function mailRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/send', {
    schema: {
      description: '发送邮件',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.sendMail.bind(mailController),
  });

  fastify.get('/list', {
    schema: {
      description: '获取邮件列表',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.getList.bind(mailController),
  });

  fastify.get('/:id', {
    schema: {
      description: '获取邮件详情',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.getDetail.bind(mailController),
  });

  fastify.post('/:id/read', {
    schema: {
      description: '标记邮件为已读',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.markAsRead.bind(mailController),
  });

  fastify.post('/:id/claim', {
    schema: {
      description: '领取邮件附件',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.claimAttachments.bind(mailController),
  });

  fastify.delete('/:id', {
    schema: {
      description: '删除邮件',
      tags: ['邮件'],
      security: [{ bearerAuth: [] }],
    },
    handler: mailController.deleteMail.bind(mailController),
  });
}

export default mailRoutes;
