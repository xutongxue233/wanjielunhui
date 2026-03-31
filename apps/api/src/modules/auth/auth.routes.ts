import type { FastifyInstance } from 'fastify';
import { authController } from './auth.controller.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', {
    schema: {
      description: '用户注册',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 2, maxLength: 32 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 128 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
    handler: authController.register.bind(authController),
  });

  fastify.post('/login', {
    schema: {
      description: '用户登录',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['account', 'password'],
        properties: {
          account: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: authController.login.bind(authController),
  });

  fastify.post('/refresh', {
    schema: {
      description: '刷新令牌',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: authController.refresh.bind(authController),
  });

  fastify.post('/logout', {
    schema: {
      description: '登出',
      tags: ['认证'],
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: authController.logout.bind(authController),
  });

  fastify.get('/me', {
    schema: {
      description: '获取当前用户信息',
      tags: ['认证'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: authController.me.bind(authController),
  });
}

export default authRoutes;
