import type { FastifyInstance } from 'fastify';
import { announcementController } from './announcement.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function announcementRoutes(fastify: FastifyInstance) {
  fastify.get('/announcements', {
    schema: { description: '获取活动公告', tags: ['运营'] },
    handler: announcementController.getActive.bind(announcementController),
  });
}

export async function adminAnnouncementRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/announcements', {
    schema: { description: '获取所有公告', tags: ['管理-公告'], security: [{ bearerAuth: [] }] },
    handler: announcementController.getAll.bind(announcementController),
  });

  fastify.post('/announcements', {
    schema: { description: '创建公告', tags: ['管理-公告'], security: [{ bearerAuth: [] }] },
    handler: announcementController.create.bind(announcementController),
  });

  fastify.put('/announcements/:id', {
    schema: { description: '更新公告', tags: ['管理-公告'], security: [{ bearerAuth: [] }] },
    handler: announcementController.update.bind(announcementController),
  });

  fastify.delete('/announcements/:id', {
    schema: { description: '删除公告', tags: ['管理-公告'], security: [{ bearerAuth: [] }] },
    handler: announcementController.delete.bind(announcementController),
  });
}

export default announcementRoutes;
