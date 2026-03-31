import type { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from './user.service.js';

export class UserController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { page?: string; pageSize?: string; search?: string };
    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '20', 10);
    const search = query.search;

    const result = await userService.getList(page, pageSize, search);
    return reply.send({ success: true, data: result });
  }

  async ban(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await userService.updateStatus(params.id, 'BANNED');
    return reply.send({ success: true, data: { message: '用户已封禁' } });
  }

  async unban(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await userService.updateStatus(params.id, 'ACTIVE');
    return reply.send({ success: true, data: { message: '用户已解封' } });
  }

  async updateRole(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const body = request.body as { role: 'PLAYER' | 'GM' | 'ADMIN' };
    await userService.updateRole(params.id, body.role);
    return reply.send({ success: true, data: { message: '角色已更新' } });
  }
}

export const userController = new UserController();
