import type { FastifyRequest, FastifyReply } from 'fastify';
import { saveService } from './save.service.js';

export class SaveController {
  async listSaves(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const saves = await saveService.listSaves(userId);

    return reply.send({
      success: true,
      data: saves,
    });
  }

  async getSave(request: FastifyRequest<{ Params: { slot: string } }>, reply: FastifyReply) {
    const { userId } = request.user;
    const slot = parseInt(request.params.slot, 10);
    const save = await saveService.getSave(userId, slot);

    return reply.send({
      success: true,
      data: save,
    });
  }

  async saveSave(request: FastifyRequest<{ Params: { slot: string } }>, reply: FastifyReply) {
    const { userId } = request.user;
    const slot = parseInt(request.params.slot, 10);
    const data = request.body as {
      name: string;
      playerData: unknown;
      gameData: unknown;
      alchemyData: unknown;
      discipleData: unknown;
      roguelikeData: unknown;
      playTime?: number;
      checkpoint?: string;
    };

    const result = await saveService.createOrUpdateSave(userId, slot, data);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async deleteSave(request: FastifyRequest<{ Params: { slot: string } }>, reply: FastifyReply) {
    const { userId } = request.user;
    const slot = parseInt(request.params.slot, 10);
    await saveService.deleteSave(userId, slot);

    return reply.send({
      success: true,
      data: { message: '存档已删除' },
    });
  }
}

export const saveController = new SaveController();
