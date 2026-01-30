import type { FastifyInstance } from 'fastify';
import { adminPvpController } from './pvp.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminPvpRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/pvp/matches', { handler: adminPvpController.getMatches.bind(adminPvpController) });
  fastify.get('/pvp/seasons', { handler: adminPvpController.getSeasons.bind(adminPvpController) });
  fastify.get('/pvp/stats', { handler: adminPvpController.getStats.bind(adminPvpController) });
  fastify.post('/pvp/seasons', { handler: adminPvpController.createSeason.bind(adminPvpController) });
  fastify.post('/pvp/seasons/:id/activate', { handler: adminPvpController.activateSeason.bind(adminPvpController) });
  fastify.post('/pvp/seasons/:id/end', { handler: adminPvpController.endSeason.bind(adminPvpController) });
}

export default adminPvpRoutes;
