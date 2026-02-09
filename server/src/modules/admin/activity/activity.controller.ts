import type { FastifyRequest, FastifyReply } from 'fastify';
import { activityService } from './activity.service.js';
import { createActivitySchema } from './activity.schema.js';

export class ActivityController {
  async getActive(request: FastifyRequest, reply: FastifyReply) {
    const result = await activityService.getActiveActivities();
    return reply.send({ success: true, data: result });
  }

  async getProgress(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };
    const result = await activityService.getActivityProgress(playerId, id);
    return reply.send({ success: true, data: result });
  }

  async claimReward(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };
    const result = await activityService.claimActivityReward(playerId, id);
    return reply.send({ success: true, data: result });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createActivitySchema.parse(request.body);
    const result = await activityService.createActivity(input);
    return reply.status(201).send({ success: true, data: result });
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { page?: string; pageSize?: string };
    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '20', 10);
    const result = await activityService.getAllActivities(page, pageSize);
    return reply.send({ success: true, data: result });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = request.body as Record<string, unknown>;
    const result = await activityService.updateActivity(id, input);
    return reply.send({ success: true, data: result });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await activityService.deleteActivity(id);
    return reply.send({ success: true, data: { message: '活动已删除' } });
  }
}

export const activityController = new ActivityController();
