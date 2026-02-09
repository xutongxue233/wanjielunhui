import type { FastifyRequest, FastifyReply } from 'fastify';
import { saveService } from './save.service.js';

class SaveController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { page?: string; pageSize?: string; search?: string };
    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '20', 10);
    const search = query.search;

    const result = await saveService.getList(page, pageSize, search);
    return reply.send({ success: true, data: result });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const save = await saveService.getById(params.id);
    if (!save) {
      return reply.status(404).send({
        success: false,
        error: { message: '存档不存在' },
      });
    }
    return reply.send({ success: true, data: save });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await saveService.delete(params.id);
    return reply.send({ success: true });
  }

  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    const stats = await saveService.getStats();
    return reply.send({ success: true, data: stats });
  }
}

export const saveController = new SaveController();
