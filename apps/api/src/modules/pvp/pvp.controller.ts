import type { FastifyRequest, FastifyReply } from 'fastify';
import { pvpService } from './pvp.service.js';
import { pvpHistoryQuerySchema, type PvpHistoryQuery } from './pvp.schema.js';

export class PvpController {
  async joinMatch(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await pvpService.joinMatchQueue(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async leaveMatch(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    await pvpService.leaveMatchQueue(playerId);

    return reply.send({
      success: true,
      data: { message: '已退出匹配队列' },
    });
  }

  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const query = pvpHistoryQuerySchema.parse(request.query) as PvpHistoryQuery;

    const result = await pvpService.getPvpHistory(
      playerId,
      query.page,
      query.pageSize,
      query.seasonId
    );

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getSeason(request: FastifyRequest, reply: FastifyReply) {
    const result = await pvpService.getCurrentSeason();

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await pvpService.getPlayerPvpStats(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getBattle(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await pvpService.getBattleState(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async performAction(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { action } = request.body as { action: 'attack' | 'skill' | 'defend' };

    const result = await pvpService.performBattleAction(playerId, action);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async surrender(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    await pvpService.surrender(playerId);

    return reply.send({
      success: true,
      data: { message: '已投降' },
    });
  }
}

export const pvpController = new PvpController();
