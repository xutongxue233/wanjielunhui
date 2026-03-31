import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminPvpService } from './pvp.service.js';

export class AdminPvpController {
  async getMatches(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };
    const result = await adminPvpService.getMatches(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );
    return reply.send({ success: true, data: result });
  }

  async getSeasons(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminPvpService.getSeasons();
    return reply.send({ success: true, data: result });
  }

  async createSeason(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as { name: string; startAt: string; endAt: string; rewards: Record<string, unknown> };
    const result = await adminPvpService.createSeason(data);
    return reply.status(201).send({ success: true, data: result });
  }

  async activateSeason(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminPvpService.activateSeason(parseInt(id, 10));
    return reply.send({ success: true, data: { message: '赛季已激活' } });
  }

  async endSeason(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminPvpService.endSeason(parseInt(id, 10));
    return reply.send({ success: true, data: { message: '赛季已结束' } });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminPvpService.getStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminPvpController = new AdminPvpController();
