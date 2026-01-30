import type { FastifyRequest, FastifyReply } from 'fastify';
import { mailService } from './mail.service.js';
import {
  sendMailSchema,
  mailListQuerySchema,
  type SendMailInput,
  type MailListQuery,
} from './mail.schema.js';

export class MailController {
  async sendMail(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const input = sendMailSchema.parse(request.body) as SendMailInput;

    const result = await mailService.sendMail(
      playerId,
      input.receiverId,
      input.title,
      input.content,
      input.attachments
    );

    return reply.status(201).send({
      success: true,
      data: result,
    });
  }

  async getList(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const query = mailListQuerySchema.parse(request.query) as MailListQuery;

    const result = await mailService.getMailList(
      playerId,
      query.page,
      query.pageSize,
      query.unreadOnly
    );

    return reply.send({
      success: true,
      data: result,
    });
  }

  async getDetail(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    const result = await mailService.getMailDetail(playerId, id);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async markAsRead(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await mailService.markAsRead(playerId, id);

    return reply.send({
      success: true,
      data: { message: '已标记为已读' },
    });
  }

  async claimAttachments(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    const attachments = await mailService.claimAttachments(playerId, id);

    return reply.send({
      success: true,
      data: { attachments, message: '附件领取成功' },
    });
  }

  async deleteMail(request: FastifyRequest, reply: FastifyReply) {
    const { playerId } = request.user;
    const { id } = request.params as { id: string };

    await mailService.deleteMail(playerId, id);

    return reply.send({
      success: true,
      data: { message: '邮件已删除' },
    });
  }
}

export const mailController = new MailController();
