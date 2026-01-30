import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminChatService } from './chat.service.js';
import type { ChatChannel } from '@prisma/client';

export class AdminChatController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { channel, page, pageSize } = request.query as { channel: string; page?: string; pageSize?: string };
    const result = await adminChatService.getList(
      channel as ChatChannel,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 50
    );
    return reply.send({ success: true, data: result });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminChatService.delete(id);
    return reply.send({ success: true, data: { message: '消息已删除' } });
  }

  async clearChannel(request: FastifyRequest, reply: FastifyReply) {
    const { channel } = request.params as { channel: string };
    await adminChatService.clearChannel(channel as ChatChannel);
    return reply.send({ success: true, data: { message: '频道已清空' } });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminChatService.getStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminChatController = new AdminChatController();
