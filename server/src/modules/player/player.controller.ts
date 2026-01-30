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
    const data = request.body as Record<string, unknown>;
    await playerService.syncData(userId, data);

    return reply.send({
      success: true,
      data: { message: '同步成功' },
    });
  }
}

export const playerController = new PlayerController();
