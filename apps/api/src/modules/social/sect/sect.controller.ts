import type { FastifyRequest, FastifyReply } from 'fastify';
import type { SectRole } from '@prisma/client';
import { sectService } from './sect.service.js';
import {
  createSectSchema,
  updateSectSchema,
  sectListQuerySchema,
  joinSectSchema,
  type CreateSectInput,
  type UpdateSectInput,
  type SectListQuery,
  type JoinSectInput,
} from './sect.schema.js';

export class SectController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const input = createSectSchema.parse(request.body) as CreateSectInput;

    const result = await sectService.createSect(playerId, input);

    return reply.status(201).send({
      success: true,
      data: result,
    });
  }

  async getList(request: FastifyRequest, reply: FastifyReply) {
    const query = sectListQuerySchema.parse(request.query) as SectListQuery;

    const result = await sectService.getSectList(
      query.page,
      query.pageSize,
      query.sortBy
    );

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getDetail(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const result = await sectService.getSectDetail(id);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async join(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };
    const input = joinSectSchema.parse(request.body) as JoinSectInput;

    await sectService.joinSect(playerId, id, input.message);

    return reply.send({
      success: true,
      data: { message: '申请已提交' },
    });
  }

  async getApplications(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    const result = await sectService.getApplications(playerId, id);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async approve(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id, applicantId } = request.params as { id: string; applicantId: string };

    await sectService.approveApplication(playerId, id, applicantId);

    return reply.send({
      success: true,
      data: { message: '已批准申请' },
    });
  }

  async reject(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id, applicantId } = request.params as { id: string; applicantId: string };

    await sectService.rejectApplication(playerId, id, applicantId);

    return reply.send({
      success: true,
      data: { message: '已拒绝申请' },
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };
    const input = updateSectSchema.parse(request.body) as UpdateSectInput;

    const result = await sectService.updateSect(playerId, id, input);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async promote(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id, targetId } = request.params as { id: string; targetId: string };
    const { role } = request.body as { role: SectRole };

    await sectService.promoteMember(playerId, id, targetId, role);

    return reply.send({
      success: true,
      data: { message: '已晋升成员' },
    });
  }

  async kick(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id, targetId } = request.params as { id: string; targetId: string };

    await sectService.kickMember(playerId, id, targetId);

    return reply.send({
      success: true,
      data: { message: '已踢出成员' },
    });
  }

  async leave(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await sectService.leaveSect(playerId, id);

    return reply.send({
      success: true,
      data: { message: '已离开门派' },
    });
  }

  async getMySect(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;

    const result = await sectService.getMySect(playerId);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getMembers(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const result = await sectService.getSectMembers(id);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async contribute(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };
    const { amount } = request.body as { amount: number };

    await sectService.contribute(playerId, id, amount);

    return reply.send({
      success: true,
      data: { message: '贡献成功' },
    });
  }
}

export const sectController = new SectController();
