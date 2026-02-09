import type { MailType } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import {
  NotFoundError,
  BadRequestError,
  ErrorCodes,
} from '../../../shared/errors/index.js';
import type {
  MailAttachment,
  MailInfo,
  MailListResponse,
  MailDetailResponse,
} from './mail.types.js';

export class MailService {
  async sendMail(
    senderId: string,
    receiverId: string,
    title: string,
    content: string,
    attachments?: MailAttachment[],
    type: MailType = 'NORMAL'
  ): Promise<MailInfo> {
    const receiver = await prisma.player.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '收件人不存在');
    }

    const sender = await prisma.player.findUnique({
      where: { id: senderId },
    });

    const mail = await prisma.mail.create({
      data: {
        senderId,
        receiverId,
        type,
        title,
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      id: mail.id,
      senderId: mail.senderId ?? undefined,
      senderName: sender?.name,
      type: mail.type,
      title: mail.title,
      content: mail.content,
      attachments: mail.attachments ? (JSON.parse(mail.attachments) as MailAttachment[]) : undefined,
      isRead: mail.isRead,
      isClaimed: mail.isClaimed,
      expiresAt: mail.expiresAt ?? undefined,
      createdAt: mail.createdAt,
    };
  }

  async getMailList(
    playerId: string,
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<MailListResponse> {
    const where = {
      receiverId: playerId,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [mails, total, unreadCount] = await Promise.all([
      prisma.mail.findMany({
        where,
        include: {
          sender: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.mail.count({ where }),
      prisma.mail.count({
        where: { receiverId: playerId, isRead: false },
      }),
    ]);

    return {
      mails: mails.map((mail) => ({
        id: mail.id,
        senderId: mail.senderId ?? undefined,
        senderName: mail.sender?.name,
        type: mail.type,
        title: mail.title,
        content: mail.content,
        attachments: mail.attachments ? (JSON.parse(mail.attachments) as MailAttachment[]) : undefined,
        isRead: mail.isRead,
        isClaimed: mail.isClaimed,
        expiresAt: mail.expiresAt ?? undefined,
        createdAt: mail.createdAt,
      })),
      total,
      unreadCount,
      page,
      pageSize,
    };
  }

  async getMailDetail(playerId: string, mailId: string): Promise<MailDetailResponse> {
    const mail = await prisma.mail.findUnique({
      where: { id: mailId },
      include: {
        sender: {
          select: { name: true },
        },
      },
    });

    if (!mail) {
      throw new NotFoundError(ErrorCodes.MAIL_NOT_FOUND, '邮件不存在');
    }

    if (mail.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权查看此邮件');
    }

    if (!mail.isRead) {
      await prisma.mail.update({
        where: { id: mailId },
        data: { isRead: true },
      });
    }

    return {
      id: mail.id,
      senderId: mail.senderId ?? undefined,
      senderName: mail.sender?.name,
      receiverId: mail.receiverId,
      type: mail.type,
      title: mail.title,
      content: mail.content,
      attachments: mail.attachments ? (JSON.parse(mail.attachments) as MailAttachment[]) : undefined,
      isRead: true,
      isClaimed: mail.isClaimed,
      expiresAt: mail.expiresAt ?? undefined,
      createdAt: mail.createdAt,
    };
  }

  async markAsRead(playerId: string, mailId: string): Promise<void> {
    const mail = await prisma.mail.findUnique({
      where: { id: mailId },
    });

    if (!mail) {
      throw new NotFoundError(ErrorCodes.MAIL_NOT_FOUND, '邮件不存在');
    }

    if (mail.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权操作此邮件');
    }

    await prisma.mail.update({
      where: { id: mailId },
      data: { isRead: true },
    });
  }

  async claimAttachments(playerId: string, mailId: string): Promise<MailAttachment[]> {
    const mail = await prisma.mail.findUnique({
      where: { id: mailId },
    });

    if (!mail) {
      throw new NotFoundError(ErrorCodes.MAIL_NOT_FOUND, '邮件不存在');
    }

    if (mail.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权操作此邮件');
    }

    if (mail.isClaimed) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '附件已领取');
    }

    const attachments = mail.attachments ? (JSON.parse(mail.attachments) as MailAttachment[]) : null;

    if (!attachments || attachments.length === 0) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '邮件没有附件');
    }

    await prisma.mail.update({
      where: { id: mailId },
      data: { isClaimed: true, isRead: true },
    });

    return attachments;
  }

  async deleteMail(playerId: string, mailId: string): Promise<void> {
    const mail = await prisma.mail.findUnique({
      where: { id: mailId },
    });

    if (!mail) {
      throw new NotFoundError(ErrorCodes.MAIL_NOT_FOUND, '邮件不存在');
    }

    if (mail.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权删除此邮件');
    }

    await prisma.mail.delete({
      where: { id: mailId },
    });
  }

  async sendSystemMail(
    receiverId: string,
    title: string,
    content: string,
    attachments?: MailAttachment[]
  ): Promise<MailInfo> {
    const mail = await prisma.mail.create({
      data: {
        receiverId,
        type: 'SYSTEM',
        title,
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      id: mail.id,
      type: mail.type,
      title: mail.title,
      content: mail.content,
      attachments: mail.attachments ? (JSON.parse(mail.attachments) as MailAttachment[]) : undefined,
      isRead: mail.isRead,
      isClaimed: mail.isClaimed,
      expiresAt: mail.expiresAt ?? undefined,
      createdAt: mail.createdAt,
    };
  }
}

export const mailService = new MailService();
