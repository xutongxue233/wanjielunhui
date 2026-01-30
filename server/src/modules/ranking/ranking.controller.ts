import type { FastifyRequest, FastifyReply } from 'fastify';
import type { RankingType } from '@prisma/client';
import { rankingService } from './ranking.service.js';
import { rankingTypeSchema, getRankingQuerySchema } from './ranking.schema.js';
import { BadRequestError, ErrorCodes } from '../../shared/errors/index.js';
import { prisma } from '../../lib/prisma.js';

export class RankingController {
  async getRankingList(
    request: FastifyRequest<{
      Params: { type: string };
      Querystring: { page?: string; pageSize?: string };
    }>,
    reply: FastifyReply
  ) {
    const typeResult = rankingTypeSchema.safeParse(request.params.type.toUpperCase());
    if (!typeResult.success) {
      throw new BadRequestError(ErrorCodes.VALIDATION_ERROR, '无效的排行榜类型');
    }

    const query = getRankingQuerySchema.parse(request.query);
    const result = await rankingService.getRankingList(
      typeResult.data as RankingType,
      query.page,
      query.pageSize
    );

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getMyRank(
    request: FastifyRequest<{ Params: { type: string } }>,
    reply: FastifyReply
  ) {
    const typeResult = rankingTypeSchema.safeParse(request.params.type.toUpperCase());
    if (!typeResult.success) {
      throw new BadRequestError(ErrorCodes.VALIDATION_ERROR, '无效的排行榜类型');
    }

    const { userId } = request.user;
    const player = await prisma.player.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!player) {
      throw new BadRequestError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const result = await rankingService.getPlayerRank(player.id, typeResult.data as RankingType);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getAroundRanking(
    request: FastifyRequest<{
      Params: { type: string };
      Querystring: { count?: string };
    }>,
    reply: FastifyReply
  ) {
    const typeResult = rankingTypeSchema.safeParse(request.params.type.toUpperCase());
    if (!typeResult.success) {
      throw new BadRequestError(ErrorCodes.VALIDATION_ERROR, '无效的排行榜类型');
    }

    const { userId } = request.user;
    const player = await prisma.player.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!player) {
      throw new BadRequestError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const count = request.query.count ? parseInt(request.query.count, 10) : 5;
    const result = await rankingService.getAroundRanking(
      player.id,
      typeResult.data as RankingType,
      Math.min(count, 10)
    );

    return reply.send({
      success: true,
      data: result,
    });
  }
}

export const rankingController = new RankingController();
