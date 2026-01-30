import type { FastifyRequest, FastifyReply } from 'fastify';
import { friendService } from './friend.service.js';
import {
  sendFriendRequestSchema,
  type SendFriendRequestInput,
} from './friend.schema.js';

export class FriendController {
  async sendRequest(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const input = sendFriendRequestSchema.parse(request.body) as SendFriendRequestInput;

    const result = await friendService.sendFriendRequest(
      playerId,
      input.targetId,
      input.message
    );

    return reply.status(201).send({
      success: true,
      data: result,
    });
  }

  async getRequests(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await friendService.getFriendRequests(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async acceptRequest(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await friendService.acceptFriendRequest(playerId, id);

    return reply.send({
      success: true,
      data: { message: '已接受好友请求' },
    });
  }

  async rejectRequest(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await friendService.rejectFriendRequest(playerId, id);

    return reply.send({
      success: true,
      data: { message: '已拒绝好友请求' },
    });
  }

  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const result = await friendService.getFriendList(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async deleteFriend(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await friendService.deleteFriend(playerId, id);

    return reply.send({
      success: true,
      data: { message: '已删除好友' },
    });
  }
}

export const friendController = new FriendController();
