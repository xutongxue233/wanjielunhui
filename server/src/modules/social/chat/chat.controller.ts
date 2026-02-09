import type { FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from './chat.service.js';

export class ChatController {
  async getMessages(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { channel: string; before?: string; limit?: string };

    if (!query.channel) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: '频道参数必填' },
      });
    }

    const messages = await chatService.getMessages(
      query.channel,
      query.before,
      query.limit ? parseInt(query.limit, 10) : undefined
    );

    return reply.send({ success: true, data: messages });
  }

  async sendMessage(request: FastifyRequest, reply: FastifyReply) {
    const playerId = request.user?.playerId;

    if (!playerId) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: '未创建角色' },
      });
    }

    const body = request.body as { channel: string; content: string };
    const message = await chatService.sendMessage(playerId, body);

    return reply.send({ success: true, data: message });
  }
}

export const chatController = new ChatController();
