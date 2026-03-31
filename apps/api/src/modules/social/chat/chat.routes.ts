import type { FastifyInstance } from 'fastify';
import { chatController } from './chat.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.get('/messages', {
    schema: {
      description: '获取聊天消息',
      tags: ['Chat'],
    },
    handler: chatController.getMessages.bind(chatController),
  });

  fastify.post('/send', {
    schema: {
      description: '发送聊天消息',
      tags: ['Chat'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: chatController.sendMessage.bind(chatController),
  });
}

export default chatRoutes;
