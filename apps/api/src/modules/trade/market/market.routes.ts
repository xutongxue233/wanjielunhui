import type { FastifyInstance } from 'fastify';
import { marketController } from './market.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';

export async function marketRoutes(fastify: FastifyInstance) {
  fastify.post('/list', {
    schema: {
      description: '上架商品',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.createListing.bind(marketController),
  });

  fastify.get('/listings', {
    schema: {
      description: '获取商品列表',
      tags: ['交易市场'],
    },
    handler: marketController.getListings.bind(marketController),
  });

  fastify.post('/buy/:id', {
    schema: {
      description: '购买商品',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.buyListing.bind(marketController),
  });

  fastify.post('/cancel/:id', {
    schema: {
      description: '取消上架',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.cancelListing.bind(marketController),
  });

  fastify.get('/history', {
    schema: {
      description: '获取交易记录',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.getHistory.bind(marketController),
  });

  fastify.get('/my-listings', {
    schema: {
      description: '获取我的上架商品',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.getMyListings.bind(marketController),
  });

  fastify.get('/shop', {
    schema: {
      description: '获取系统商店商品',
      tags: ['交易市场'],
    },
    handler: marketController.getShopItems.bind(marketController),
  });

  fastify.post('/shop/buy', {
    schema: {
      description: '购买系统商店商品',
      tags: ['交易市场'],
      security: [{ bearerAuth: [] }],
    },
    preHandler: authenticate,
    handler: marketController.buyShopItem.bind(marketController),
  });
}

export default marketRoutes;
