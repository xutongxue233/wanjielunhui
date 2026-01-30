import type { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from './user.service.js';

export class UserController {
  async getList(
    request: FastifyRequest<{ Querystring: { page?: string; pageSize?: string; search?: string } }>,
    reply: FastifyReply
  ) {
    const page = parseInt(request.query.page || '1', 10);
    const pageSize = parseInt(request.query.pageSize || '20', 10);
    const search = request.query.search;

    const result = await userService.getList(page, pageSize, search);
    return reply.send({ success: true, data: result });
  }

  async ban(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await userService.updateStatus(request.params.id, 'BANNED');
    return reply.send({ success: true, data: { message: '用户已封禁' } });
  }

  async unban(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await userService.updateStatus(request.params.id, 'ACTIVE');
    return reply.send({ success: true, data: { message: '用户已解封' } });
  }

  async updateRole(
    request: FastifyRequest<{ Params: { id: string }; Body: { role: 'PLAYER' | 'GM' | 'ADMIN' } }>,
    reply: FastifyReply
  ) {
    await userService.updateRole(request.params.id, request.body.role);
    return reply.send({ success: true, data: { message: '角色已更新' } });
  }
}

export const userController = new UserController();
