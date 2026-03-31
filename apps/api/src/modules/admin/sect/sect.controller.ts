import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminSectService } from './sect.service.js';

export class AdminSectController {
  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize, search } = request.query as { page?: string; pageSize?: string; search?: string };
    const result = await adminSectService.getList(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
      search
    );
    return reply.send({ success: true, data: result });
  }

  async getMembers(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await adminSectService.getMembers(id);
    return reply.send({ success: true, data: result });
  }

  async disband(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await adminSectService.disband(id);
    return reply.send({ success: true, data: { message: '门派已解散' } });
  }

  async kickMember(request: FastifyRequest, reply: FastifyReply) {
    const { id, playerId } = request.params as { id: string; playerId: string };
    await adminSectService.kickMember(id, playerId);
    return reply.send({ success: true, data: { message: '成员已踢出' } });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminSectService.getStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminSectController = new AdminSectController();
