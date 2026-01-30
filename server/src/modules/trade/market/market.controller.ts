import type { FastifyRequest, FastifyReply } from 'fastify';
import { marketService } from './market.service.js';
import {
  createListingSchema,
  listingQuerySchema,
  type CreateListingInput,
  type ListingQuery,
} from './market.schema.js';

export class MarketController {
  async createListing(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const input = createListingSchema.parse(request.body) as CreateListingInput;

    const result = await marketService.createListing(playerId, input);

    return reply.status(201).send({
      success: true,
      data: result,
    });
  }

  async getListings(request: FastifyRequest, reply: FastifyReply) {
    const query = listingQuerySchema.parse(request.query) as ListingQuery;
    const result = await marketService.getListings(query);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async buyListing(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    const result = await marketService.buyListing(playerId, id);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async cancelListing(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await marketService.cancelListing(playerId, id);

    return reply.send({
      success: true,
      data: { message: '商品已下架' },
    });
  }

  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };

    const result = await marketService.getTradeHistory(
      playerId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getMyListings(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await marketService.getMyListings(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }
}

export const marketController = new MarketController();
