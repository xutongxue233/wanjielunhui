import type { FastifyInstance } from 'fastify';
import { adminMarketController } from './market.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminMarketRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/market/listings', { handler: adminMarketController.getListings.bind(adminMarketController) });
  fastify.get('/market/trades', { handler: adminMarketController.getTrades.bind(adminMarketController) });
  fastify.get('/market/stats', { handler: adminMarketController.getStats.bind(adminMarketController) });
  fastify.delete('/market/listings/:id', { handler: adminMarketController.cancelListing.bind(adminMarketController) });
}

export default adminMarketRoutes;
