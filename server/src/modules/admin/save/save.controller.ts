import type { FastifyRequest, FastifyReply } from 'fastify';
import { saveService } from './save.service.js';

class SaveController {
  async getList(
    request: FastifyRequest<{
      Querystring: { page?: string; pageSize?: string; search?: string };
    }>,
    reply: FastifyReply
  ) {
    const page = parseInt(request.query.page || '1', 10);
    const pageSize = parseInt(request.query.pageSize || '20', 10);
    const search = request.query.search;

    const result = await saveService.getList(page, pageSize, search);
    return reply.send({ success: true, data: result });
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const save = await saveService.getById(request.params.id);
    if (!save) {
      return reply.status(404).send({
        success: false,
        error: { message: '存档不存在' },
      });
    }
    return reply.send({ success: true, data: save });
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await saveService.delete(request.params.id);
    return reply.send({ success: true });
  }

  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    const stats = await saveService.getStats();
    return reply.send({ success: true, data: stats });
  }
}

export const saveController = new SaveController();
