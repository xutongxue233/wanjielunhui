import type { FastifyInstance } from 'fastify';
import { friendController } from './friend.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function friendRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/request', {
    schema: {
      description: '发送好友请求',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.sendRequest.bind(friendController),
  });

  fastify.get('/requests', {
    schema: {
      description: '获取好友请求列表',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.getRequests.bind(friendController),
  });

  fastify.post('/accept/:id', {
    schema: {
      description: '接受好友请求',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.acceptRequest.bind(friendController),
  });

  fastify.post('/reject/:id', {
    schema: {
      description: '拒绝好友请求',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.rejectRequest.bind(friendController),
  });

  fastify.get('/list', {
    schema: {
      description: '获取好友列表',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.getList.bind(friendController),
  });

  fastify.delete('/:id', {
    schema: {
      description: '删除好友',
      tags: ['好友'],
      security: [{ bearerAuth: [] }],
    },
    handler: friendController.deleteFriend.bind(friendController),
  });
}

export default friendRoutes;
