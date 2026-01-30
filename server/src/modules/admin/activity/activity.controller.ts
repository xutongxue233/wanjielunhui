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
}

export const activityController = new ActivityController();
