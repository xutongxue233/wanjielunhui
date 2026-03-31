import type { FastifyRequest, FastifyReply } from 'fastify';
import { announcementService } from './announcement.service.js';
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcement.schema.js';

export class AnnouncementController {
  async getActive(request: FastifyRequest, reply: FastifyReply) {
    const result = await announcementService.getActiveAnnouncements();
    return reply.send({ success: true, data: result });
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const { page, pageSize } = request.query as { page?: string; pageSize?: string };
    const result = await announcementService.getAllAnnouncements(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20
    );
    return reply.send({ success: true, data: result });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createAnnouncementSchema.parse(request.body);
    const result = await announcementService.createAnnouncement(input);
    return reply.status(201).send({ success: true, data: result });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = updateAnnouncementSchema.parse(request.body);
    const result = await announcementService.updateAnnouncement(id, input);
    return reply.send({ success: true, data: result });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await announcementService.deleteAnnouncement(id);
    return reply.send({ success: true, data: { message: '公告已删除' } });
  }
}

export const announcementController = new AnnouncementController();
