import type { FastifyInstance } from 'fastify';
import { playerController } from './player.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

export async function playerRoutes(fastify: FastifyInstance) {
  fastify.get('/profile', {
    schema: {
      description: '获取自己的玩家信息',
      tags: ['玩家'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: playerController.getProfile.bind(playerController),
  });

  fastify.get<{ Querystring: { keyword: string } }>('/search', {
    schema: {
      description: '搜索玩家',
      tags: ['玩家'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['keyword'],
        properties: {
          keyword: { type: 'string', minLength: 1 },
        },
      },
    },
    preHandler: authenticate,
    handler: playerController.search.bind(playerController),
  });

  fastify.get('/:id', {
    schema: {
      description: '获取其他玩家的公开信息',
      tags: ['玩家'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: playerController.getPublicProfile.bind(playerController),
  });

  fastify.put('/profile', {
    schema: {
      description: '更新玩家信息',
      tags: ['玩家'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 32 },
          title: { type: 'string', maxLength: 64 },
          avatarId: { type: 'integer', minimum: 1 },
        },
      },
    },
    preHandler: authenticate,
    handler: playerController.updateProfile.bind(playerController),
  });

  fastify.post('/sync', {
    schema: {
      description: '同步游戏数据',
      tags: ['玩家'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: playerController.syncData.bind(playerController),
  });
}

export default playerRoutes;
