import type { FastifyInstance } from 'fastify';
import { sectController } from './sect.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function sectRoutes(fastify: FastifyInstance) {
  fastify.get('/my', {
    schema: {
      description: '获取当前玩家所属门派',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.getMySect.bind(sectController),
  });

  fastify.post('/create', {
    schema: {
      description: '创建门派',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.create.bind(sectController),
  });

  fastify.get('/list', {
    schema: {
      description: '获取门派列表',
      tags: ['门派'],
    },
    handler: sectController.getList.bind(sectController),
  });

  fastify.get('/:id', {
    schema: {
      description: '获取门派详情',
      tags: ['门派'],
    },
    handler: sectController.getDetail.bind(sectController),
  });

  fastify.get('/:id/members', {
    schema: {
      description: '获取门派成员列表',
      tags: ['门派'],
    },
    handler: sectController.getMembers.bind(sectController),
  });

  fastify.post('/:id/join', {
    schema: {
      description: '申请加入门派',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.join.bind(sectController),
  });

  fastify.get('/:id/applications', {
    schema: {
      description: '获取入门申请列表',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.getApplications.bind(sectController),
  });

  fastify.post('/:id/approve/:applicantId', {
    schema: {
      description: '批准入门申请',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.approve.bind(sectController),
  });

  fastify.post('/:id/reject/:applicantId', {
    schema: {
      description: '拒绝入门申请',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.reject.bind(sectController),
  });

  fastify.put('/:id', {
    schema: {
      description: '更新门派信息',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.update.bind(sectController),
  });

  fastify.post('/:id/promote/:targetId', {
    schema: {
      description: '晋升成员',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.promote.bind(sectController),
  });

  fastify.post('/:id/kick/:targetId', {
    schema: {
      description: '踢出成员',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.kick.bind(sectController),
  });

  fastify.post('/:id/leave', {
    schema: {
      description: '离开门派',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: sectController.leave.bind(sectController),
  });

  fastify.post('/:id/contribute', {
    schema: {
      description: '贡献资源',
      tags: ['门派'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'integer', minimum: 1 },
        },
      },
    },
    preHandler: authenticate,
    handler: sectController.contribute.bind(sectController),
  });
}

export default sectRoutes;
