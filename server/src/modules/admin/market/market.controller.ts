import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminMarketService } from './market.service.js';

export class AdminMarketController {
  async getListings(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };
    const result = await adminMarketService.getListings(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );
    return reply.send({ success: true, data: result });
  }

  async getTrades(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };
    const result = await adminMarketService.getTrades(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );
    return reply.send({ success: true, data: result });
  }

  async cancelListing(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminMarketService.cancelListing(id);
    return reply.send({ success: true, data: { message: '商品已下架' } });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminMarketService.getStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminMarketController = new AdminMarketController();
