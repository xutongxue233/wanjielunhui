import type { SectJoinType, SectRole } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import { getRedis } from '../../../lib/redis.js';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ErrorCodes,
} from '../../../shared/errors/index.js';
import type {
  SectInfo,
  SectMemberInfo,
  SectListResponse,
  SectDetailResponse,
  SectApplicationInfo,
} from './sect.types.js';
import type { CreateSectInput, UpdateSectInput } from './sect.schema.js';

const SECT_CREATION_COST = 10000n;

export class SectService {
  private async isPlayerOnline(playerId: string): Promise<boolean> {
    const redis = getRedis();
    const exists = await redis.exists(`player:online:${playerId}`);
    return exists === 1;
  }

  async createSect(playerId: string, input: CreateSectInput): Promise<SectInfo> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { sectMember: true },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    if (player.sectMember) {
      throw new ConflictError(ErrorCodes.ALREADY_IN_SECT, '已加入门派，无法创建');
    }

    if (player.spiritStones < SECT_CREATION_COST) {
      throw new BadRequestError(ErrorCodes.INSUFFICIENT_FUNDS, '灵石不足');
    }

    const existingSect = await prisma.sect.findUnique({
      where: { name: input.name },
    });

    if (existingSect) {
      throw new ConflictError(ErrorCodes.ALREADY_EXISTS, '门派名称已存在');
    }

    const [sect] = await prisma.$transaction([
      prisma.sect.create({
        data: {
          name: input.name,
          description: input.description,
          joinType: input.joinType as SectJoinType,
          minRealmToJoin: input.minRealmToJoin,
          founderId: playerId,
          totalPower: player.combatPower,
        },
      }),
      prisma.player.update({
        where: { id: playerId },
        data: { spiritStones: { decrement: SECT_CREATION_COST } },
      }),
    ]);

    await prisma.sectMember.create({
      data: {
        sectId: sect.id,
        playerId,
        role: 'LEADER',
      },
    });

    return {
      id: sect.id,
      name: sect.name,
      description: sect.description ?? undefined,
      notice: sect.notice ?? undefined,
      iconId: sect.iconId,
      level: sect.level,
      experience: Number(sect.experience),
      fund: Number(sect.fund),
      joinType: sect.joinType,
      minRealmToJoin: sect.minRealmToJoin ?? undefined,
      memberCount: sect.memberCount,
      maxMembers: sect.maxMembers,
      totalPower: Number(sect.totalPower),
      founderId: sect.founderId,
      founderName: player.name,
      createdAt: sect.createdAt,
    };
  }

  async getSectList(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'totalPower'
  ): Promise<SectListResponse> {
    const orderBy: Record<string, 'desc' | 'asc'> = {};
    orderBy[sortBy] = 'desc';

    const [sects, total] = await Promise.all([
      prisma.sect.findMany({
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.sect.count(),
    ]);

    return {
      sects: sects.map((sect) => ({
        id: sect.id,
        name: sect.name,
        description: sect.description ?? undefined,
        notice: sect.notice ?? undefined,
        iconId: sect.iconId,
        level: sect.level,
        experience: Number(sect.experience),
        fund: Number(sect.fund),
        joinType: sect.joinType,
        minRealmToJoin: sect.minRealmToJoin ?? undefined,
        memberCount: sect.memberCount,
        maxMembers: sect.maxMembers,
        totalPower: Number(sect.totalPower),
        founderId: sect.founderId,
        createdAt: sect.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getSectDetail(sectId: string): Promise<SectDetailResponse> {
    const sect = await prisma.sect.findUnique({
      where: { id: sectId },
      include: {
        members: {
          include: {
            player: true,
          },
          orderBy: [{ role: 'asc' }, { contribution: 'desc' }],
        },
      },
    });

    if (!sect) {
      throw new NotFoundError(ErrorCodes.SECT_NOT_FOUND, '门派不存在');
    }

    const members: SectMemberInfo[] = await Promise.all(
      sect.members.map(async (m) => ({
        id: m.id,
        playerId: m.player.id,
        playerName: m.player.name,
        playerRealm: m.player.realm,
        playerRealmStage: m.player.realmStage,
        avatarId: m.player.avatarId,
        combatPower: Number(m.player.combatPower),
        role: m.role,
        contribution: Number(m.contribution),
        isOnline: await this.isPlayerOnline(m.player.id),
        joinedAt: m.joinedAt,
      }))
    );

    return {
      id: sect.id,
      name: sect.name,
      description: sect.description ?? undefined,
      notice: sect.notice ?? undefined,
      iconId: sect.iconId,
      level: sect.level,
      experience: Number(sect.experience),
      fund: Number(sect.fund),
      joinType: sect.joinType,
      minRealmToJoin: sect.minRealmToJoin ?? undefined,
      memberCount: sect.memberCount,
      maxMembers: sect.maxMembers,
      totalPower: Number(sect.totalPower),
      founderId: sect.founderId,
      createdAt: sect.createdAt,
      members,
    };
  }

  async joinSect(playerId: string, sectId: string, message?: string): Promise<void> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { sectMember: true },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    if (player.sectMember) {
      throw new ConflictError(ErrorCodes.ALREADY_IN_SECT, '已加入门派');
    }

    const sect = await prisma.sect.findUnique({
      where: { id: sectId },
    });

    if (!sect) {
      throw new NotFoundError(ErrorCodes.SECT_NOT_FOUND, '门派不存在');
    }

    if (sect.memberCount >= sect.maxMembers) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '门派成员已满');
    }

    if (sect.joinType === 'INVITE_ONLY') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '该门派仅限邀请加入');
    }

    if (sect.joinType === 'OPEN') {
      await prisma.$transaction([
        prisma.sectMember.create({
          data: {
            sectId,
            playerId,
            role: 'MEMBER',
          },
        }),
        prisma.sect.update({
          where: { id: sectId },
          data: {
            memberCount: { increment: 1 },
            totalPower: { increment: player.combatPower },
          },
        }),
      ]);
    } else {
      const existingApp = await prisma.sectApplication.findUnique({
        where: {
          sectId_playerId: { sectId, playerId },
        },
      });

      if (existingApp) {
        throw new ConflictError(ErrorCodes.ALREADY_EXISTS, '已提交过申请');
      }

      await prisma.sectApplication.create({
        data: {
          sectId,
          playerId,
          message,
        },
      });
    }
  }

  async getApplications(
    playerId: string,
    sectId: string
  ): Promise<SectApplicationInfo[]> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权查看');
    }

    if (!['LEADER', 'ELDER'].includes(member.role)) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '权限不足');
    }

    const applications = await prisma.sectApplication.findMany({
      where: { sectId, status: 'PENDING' },
      include: {
        // We need to fetch player info separately since the schema doesn't have a relation
      },
      orderBy: { createdAt: 'desc' },
    });

    const playerIds = applications.map((app) => app.playerId);
    const players = await prisma.player.findMany({
      where: { id: { in: playerIds } },
    });
    const playerMap = new Map(players.map((p) => [p.id, p]));

    return applications.map((app) => {
      const player = playerMap.get(app.playerId);
      return {
        id: app.id,
        playerId: app.playerId,
        playerName: player?.name ?? '未知',
        playerRealm: player?.realm ?? '炼气',
        avatarId: player?.avatarId ?? 1,
        combatPower: Number(player?.combatPower ?? 0),
        message: app.message ?? undefined,
        createdAt: app.createdAt,
      };
    });
  }

  async approveApplication(
    playerId: string,
    sectId: string,
    applicantId: string
  ): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权操作');
    }

    if (!['LEADER', 'ELDER'].includes(member.role)) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '权限不足');
    }

    const application = await prisma.sectApplication.findUnique({
      where: { sectId_playerId: { sectId, playerId: applicantId } },
    });

    if (!application || application.status !== 'PENDING') {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '申请不存在或已处理');
    }

    const sect = await prisma.sect.findUnique({ where: { id: sectId } });
    if (!sect || sect.memberCount >= sect.maxMembers) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '门派成员已满');
    }

    const applicant = await prisma.player.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '申请者不存在');
    }

    await prisma.$transaction([
      prisma.sectApplication.update({
        where: { id: application.id },
        data: { status: 'APPROVED' },
      }),
      prisma.sectMember.create({
        data: {
          sectId,
          playerId: applicantId,
          role: 'MEMBER',
        },
      }),
      prisma.sect.update({
        where: { id: sectId },
        data: {
          memberCount: { increment: 1 },
          totalPower: { increment: applicant.combatPower },
        },
      }),
    ]);
  }

  async rejectApplication(
    playerId: string,
    sectId: string,
    applicantId: string
  ): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权操作');
    }

    if (!['LEADER', 'ELDER'].includes(member.role)) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '权限不足');
    }

    await prisma.sectApplication.updateMany({
      where: { sectId, playerId: applicantId, status: 'PENDING' },
      data: { status: 'REJECTED' },
    });
  }

  async updateSect(
    playerId: string,
    sectId: string,
    input: UpdateSectInput
  ): Promise<SectInfo> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId || member.role !== 'LEADER') {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '仅掌门可修改门派信息');
    }

    const sect = await prisma.sect.update({
      where: { id: sectId },
      data: {
        description: input.description,
        notice: input.notice,
        joinType: input.joinType as SectJoinType | undefined,
        minRealmToJoin: input.minRealmToJoin,
        iconId: input.iconId,
      },
    });

    return {
      id: sect.id,
      name: sect.name,
      description: sect.description ?? undefined,
      notice: sect.notice ?? undefined,
      iconId: sect.iconId,
      level: sect.level,
      experience: Number(sect.experience),
      fund: Number(sect.fund),
      joinType: sect.joinType,
      minRealmToJoin: sect.minRealmToJoin ?? undefined,
      memberCount: sect.memberCount,
      maxMembers: sect.maxMembers,
      totalPower: Number(sect.totalPower),
      founderId: sect.founderId,
      createdAt: sect.createdAt,
    };
  }

  async promoteMember(
    playerId: string,
    sectId: string,
    targetId: string,
    newRole: SectRole
  ): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId || member.role !== 'LEADER') {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '仅掌门可晋升成员');
    }

    if (newRole === 'LEADER') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '不能直接晋升为掌门');
    }

    const target = await prisma.sectMember.findUnique({
      where: { playerId: targetId },
    });

    if (!target || target.sectId !== sectId) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '目标成员不存在');
    }

    await prisma.sectMember.update({
      where: { playerId: targetId },
      data: { role: newRole },
    });
  }

  async kickMember(
    playerId: string,
    sectId: string,
    targetId: string
  ): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
    });

    if (!member || member.sectId !== sectId) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权操作');
    }

    if (!['LEADER', 'ELDER'].includes(member.role)) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '权限不足');
    }

    const target = await prisma.sectMember.findUnique({
      where: { playerId: targetId },
      include: { player: true },
    });

    if (!target || target.sectId !== sectId) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '目标成员不存在');
    }

    if (target.role === 'LEADER') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '不能踢出掌门');
    }

    if (member.role === 'ELDER' && target.role === 'ELDER') {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权踢出同级成员');
    }

    await prisma.$transaction([
      prisma.sectMember.delete({ where: { playerId: targetId } }),
      prisma.sect.update({
        where: { id: sectId },
        data: {
          memberCount: { decrement: 1 },
          totalPower: { decrement: target.player.combatPower },
        },
      }),
    ]);
  }

  async leaveSect(playerId: string, sectId: string): Promise<void> {
    const member = await prisma.sectMember.findUnique({
      where: { playerId },
      include: { player: true },
    });

    if (!member || member.sectId !== sectId) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '未加入该门派');
    }

    if (member.role === 'LEADER') {
      throw new BadRequestError(
        ErrorCodes.INVALID_INPUT,
        '掌门不能直接离开，请先转让掌门职位'
      );
    }

    await prisma.$transaction([
      prisma.sectMember.delete({ where: { playerId } }),
      prisma.sect.update({
        where: { id: sectId },
        data: {
          memberCount: { decrement: 1 },
          totalPower: { decrement: member.player.combatPower },
        },
      }),
    ]);
  }
}

export const sectService = new SectService();
