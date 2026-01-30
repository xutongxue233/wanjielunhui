import type { FastifyRequest, FastifyReply } from 'fastify';
import { dashboardService } from './dashboard.service.js';

export class DashboardController {
  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    const stats = await dashboardService.getStats();
    return reply.send({ success: true, data: stats });
  }

  async getSystemStatus(_request: FastifyRequest, reply: FastifyReply) {
    const status = await dashboardService.getSystemStatus();
    return reply.send({ success: true, data: status });
  }
}

export const dashboardController = new DashboardController();
