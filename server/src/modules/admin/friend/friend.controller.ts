import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminFriendService } from './friend.service.js';

export class AdminFriendController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize, search } = request.query as {
      page?: string;
      pageSize?: string;
      search?: string;
    };
    const result = await adminFriendService.getList(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
      search
    );
    return reply.send({ success: true, data: result });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminFriendService.delete(id);
    return reply.send({ success: true, data: { message: '好友关系已删除' } });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminFriendService.getStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminFriendController = new AdminFriendController();
