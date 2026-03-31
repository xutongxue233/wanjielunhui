import type { FastifyRequest, FastifyReply } from 'fastify';
import { adminMailService } from './mail.service.js';
import { z } from 'zod';

const broadcastMailSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  attachments: z
    .array(
      z.object({
        type: z.string(),
        id: z.string(),
        amount: z.number().int().positive(),
      })
    )
    .optional(),
  targetType: z.enum(['all', 'realm', 'vip', 'custom']),
  targetRealm: z.string().optional(),
  targetVipLevel: z.number().int().min(0).optional(),
  targetPlayerIds: z.array(z.string()).optional(),
});

export class AdminMailController {
  async broadcast(request: FastifyRequest, reply: FastifyReply) {
    const parsed = broadcastMailSchema.parse(request.body);
    const input = {
      ...parsed,
      attachments: parsed.attachments ?? [],
    };
    const result = await adminMailService.broadcastMail(input);
    return reply.send({ success: true, data: result });
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const result = await adminMailService.getMailStats();
    return reply.send({ success: true, data: result });
  }
}

export const adminMailController = new AdminMailController();
