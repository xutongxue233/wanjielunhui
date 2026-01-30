import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminRankingService } from './ranking.service.js';
import type { RankingType } from '@prisma/client';

export class AdminRankingController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { type } = request.params as { type: string };
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };

    const result = await adminRankingService.getList(
      type.toUpperCase() as RankingType,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 50
    );

    return reply.send({ success: true, data: result });
  }

  async syncAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminRankingService.syncAll();
    return reply.send({ success: true, data: result });
  }

  async rebuild(request: FastifyRequest, reply: FastifyReply) {
    const { type } = request.params as { type: string };
    await adminRankingService.rebuild(type.toUpperCase() as RankingType);
    return reply.send({ success: true, data: { message: '排行榜重建完成' } });
  }
}

export const adminRankingController = new AdminRankingController();
