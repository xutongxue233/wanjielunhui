import type { FastifyInstance } from 'fastify';
import { adminChatController } from './chat.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminChatRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/chat', { handler: adminChatController.getList.bind(adminChatController) });
  fastify.get('/chat/stats', { handler: adminChatController.getStats.bind(adminChatController) });
  fastify.delete('/chat/:id', { handler: adminChatController.delete.bind(adminChatController) });
  fastify.delete('/chat/channel/:channel', { handler: adminChatController.clearChannel.bind(adminChatController) });
}

export default adminChatRoutes;
