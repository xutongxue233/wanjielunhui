import type { FastifyInstance } from 'fastify';
import { saveController } from './save.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

export async function saveRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/list', {
    schema: {
      description: '获取存档列表',
      tags: ['存档'],
      security: [{ bearerAuth: [] }],
    },
    handler: saveController.listSaves.bind(saveController),
  });

  fastify.get('/:slot', {
    schema: {
      description: '获取指定存档',
      tags: ['存档'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['slot'],
        properties: {
          slot: { type: 'string', pattern: '^[1-3]$' },
        },
      },
    },
    handler: saveController.getSave.bind(saveController),
  });

  fastify.post('/:slot', {
    schema: {
      description: '保存存档',
      tags: ['存档'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['slot'],
        properties: {
          slot: { type: 'string', pattern: '^[1-3]$' },
        },
      },
      body: {
        type: 'object',
        required: ['name', 'playerData', 'gameData', 'alchemyData', 'discipleData', 'roguelikeData'],
        properties: {
          name: { type: 'string', maxLength: 64 },
          playerData: { type: 'object' },
          gameData: { type: 'object' },
          alchemyData: { type: 'object' },
          discipleData: { type: 'object' },
          roguelikeData: { type: 'object' },
          playTime: { type: 'integer', minimum: 0 },
          checkpoint: { type: 'string', maxLength: 255 },
        },
      },
    },
    handler: saveController.saveSave.bind(saveController),
  });

  fastify.delete('/:slot', {
    schema: {
      description: '删除存档',
      tags: ['存档'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['slot'],
        properties: {
          slot: { type: 'string', pattern: '^[1-3]$' },
        },
      },
    },
    handler: saveController.deleteSave.bind(saveController),
  });
}

export default saveRoutes;
