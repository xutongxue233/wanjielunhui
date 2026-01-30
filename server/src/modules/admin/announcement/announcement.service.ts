import { prisma } from '../../../lib/prisma.js';
import { NotFoundError, ErrorCodes } from '../../../shared/errors/index.js';
import type { CreateAnnouncementInput, UpdateAnnouncementInput } from './announcement.schema.js';

export interface AnnouncementInfo {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  isActive: boolean;
  startAt: Date;
  endAt?: Date;
  createdAt: Date;
}

export class AnnouncementService {
  async createAnnouncement(input: CreateAnnouncementInput): Promise<AnnouncementInfo> {
    const announcement = await prisma.announcement.create({
      data: {
        title: input.title,
        content: input.content,
        type: input.type,
        priority: input.priority,
        startAt: input.startAt ?? new Date(),
        endAt: input.endAt ?? null,
      },
    });

    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      isActive: announcement.isActive,
      startAt: announcement.startAt,
      endAt: announcement.endAt ?? undefined,
      createdAt: announcement.createdAt,
    };
  }

  async getActiveAnnouncements(): Promise<AnnouncementInfo[]> {
    const now = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        startAt: { lte: now },
        OR: [{ endAt: null }, { endAt: { gte: now } }],
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.type,
      priority: a.priority,
      isActive: a.isActive,
      startAt: a.startAt,
      endAt: a.endAt ?? undefined,
      createdAt: a.createdAt,
    }));
  }

  async getAllAnnouncements(page: number = 1, pageSize: number = 20): Promise<{ announcements: AnnouncementInfo[]; total: number }> {
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.announcement.count(),
    ]);

    return {
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        type: a.type,
        priority: a.priority,
        isActive: a.isActive,
        startAt: a.startAt,
        endAt: a.endAt ?? undefined,
        createdAt: a.createdAt,
      })),
      total,
    };
  }

  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<AnnouncementInfo> {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '公告不存在');
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: input.title,
        content: input.content,
        type: input.type,
        priority: input.priority,
        isActive: input.isActive,
        startAt: input.startAt,
        endAt: input.endAt ?? null,
      },
    });

    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      isActive: announcement.isActive,
      startAt: announcement.startAt,
      endAt: announcement.endAt ?? undefined,
      createdAt: announcement.createdAt,
    };
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await prisma.announcement.delete({ where: { id } });
  }
}

export const announcementService = new AnnouncementService();
