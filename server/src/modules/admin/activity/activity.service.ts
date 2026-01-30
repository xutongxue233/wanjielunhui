import { prisma } from '../../../lib/prisma.js';
import { NotFoundError, BadRequestError, ErrorCodes } from '../../../shared/errors/index.js';
import type { CreateActivityInput } from './activity.schema.js';

export interface ActivityInfo {
  id: string;
  name: string;
  description: string;
  type: string;
  config: Record<string, unknown>;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface ActivityProgressInfo {
  activityId: string;
  playerId: string;
  progress: Record<string, unknown>;
  rewards: Record<string, unknown> | null;
}

export class ActivityService {
  async getActiveActivities(): Promise<ActivityInfo[]> {
    const now = new Date();
    const activities = await prisma.activity.findMany({
      where: {
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
      orderBy: { startAt: 'asc' },
    });

    return activities.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      type: a.type,
      config: a.config as Record<string, unknown>,
      startAt: a.startAt,
      endAt: a.endAt,
      isActive: a.isActive,
      createdAt: a.createdAt,
    }));
  }

  async getActivityProgress(playerId: string, activityId: string): Promise<ActivityProgressInfo | null> {
    const progress = await prisma.activityProgress.findUnique({
      where: { activityId_playerId: { activityId, playerId } },
    });

    if (!progress) return null;

    return {
      activityId: progress.activityId,
      playerId: progress.playerId,
      progress: progress.progress as Record<string, unknown>,
      rewards: progress.rewards as Record<string, unknown> | null,
    };
  }

  async claimActivityReward(playerId: string, activityId: string): Promise<{ rewards: Record<string, unknown> }> {
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity || !activity.isActive) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '活动不存在或已结束');
    }

    const progress = await prisma.activityProgress.findUnique({
      where: { activityId_playerId: { activityId, playerId } },
    });

    if (!progress) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '未参与该活动');
    }

    if (progress.rewards) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '奖励已领取');
    }

    const config = activity.config as { rewards?: Record<string, unknown> };
    const rewards = config.rewards ?? {};

    await prisma.activityProgress.update({
      where: { id: progress.id },
      data: { rewards },
    });

    return { rewards };
  }

  async createActivity(input: CreateActivityInput): Promise<ActivityInfo> {
    const activity = await prisma.activity.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        config: input.config,
        startAt: input.startAt,
        endAt: input.endAt,
        isActive: true,
      },
    });

    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      type: activity.type,
      config: activity.config as Record<string, unknown>,
      startAt: activity.startAt,
      endAt: activity.endAt,
      isActive: activity.isActive,
      createdAt: activity.createdAt,
    };
  }
}

export const activityService = new ActivityService();
