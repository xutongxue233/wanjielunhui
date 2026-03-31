import type { FastifyRequest, FastifyReply } from 'fastify';
import { playerService } from './player.service.js';
import { updatePlayerSchema } from './player.schema.js';

export class PlayerController {
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const profile = await playerService.getProfile(userId);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  async getPublicProfile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const profile = await playerService.getPublicProfile(id);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const input = updatePlayerSchema.parse(request.body);
    const profile = await playerService.updateProfile(userId, input);

    return reply.send({
      success: true,
      data: profile,
    });
  }

  async syncData(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const rawData = request.body as Record<string, unknown>;

    // 安全白名单: 只允许同步非敏感数据，禁止客户端修改核心游戏数据
    const ALLOWED_SYNC_FIELDS = new Set([
      'health',
      'maxHealth',
      'attack',
      'defense',
      'speed',
    ]);

    const FORBIDDEN_FIELDS = [
      'realm', 'realmStage', 'cultivation', 'totalCultivation',
      'combatPower', 'pvpRating', 'reincarnations',
      'spiritStones', 'destinyPoints', 'vipLevel', 'vipExpireAt',
      'id', 'userId', 'name', 'createdAt', 'updatedAt',
    ];

    // 检查是否包含禁止字段
    const forbiddenFound = Object.keys(rawData).filter((key) => FORBIDDEN_FIELDS.includes(key));
    if (forbiddenFound.length > 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: `禁止同步以下字段: ${forbiddenFound.join(', ')}`,
        },
      });
    }

    // 只保留白名单字段
    const safeData: Record<string, unknown> = {};
    for (const key of Object.keys(rawData)) {
      if (ALLOWED_SYNC_FIELDS.has(key)) {
        safeData[key] = rawData[key];
      }
    }

    if (Object.keys(safeData).length === 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '没有可同步的有效字段',
        },
      });
    }

    await playerService.syncData(userId, safeData);

    return reply.send({
      success: true,
      data: { message: '同步成功' },
    });
  }

  async search(request: FastifyRequest<{ Querystring: { keyword: string } }>, reply: FastifyReply) {
    const { keyword } = request.query;
    const players = await playerService.searchPlayers(keyword);

    return reply.send({
      success: true,
      data: players,
    });
  }
}

export const playerController = new PlayerController();
