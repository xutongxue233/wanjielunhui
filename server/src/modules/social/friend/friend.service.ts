import { prisma } from '../../../lib/prisma.js';
import { getRedis } from '../../../lib/redis.js';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  ErrorCodes,
} from '../../../shared/errors/index.js';
import type {
  FriendInfo,
  FriendRequestInfo,
  FriendListResponse,
  FriendRequestListResponse,
} from './friend.types.js';

export class FriendService {
  private async isPlayerOnline(playerId: string): Promise<boolean> {
    const redis = getRedis();
    const exists = await redis.exists(`player:online:${playerId}`);
    return exists === 1;
  }

  async sendFriendRequest(
    senderId: string,
    targetId: string,
    message?: string
  ): Promise<FriendRequestInfo> {
    if (senderId === targetId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '不能添加自己为好友');
    }

    const targetPlayer = await prisma.player.findUnique({
      where: { id: targetId },
    });

    if (!targetPlayer) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '目标玩家不存在');
    }

    const existingFriend = await prisma.friend.findUnique({
      where: {
        playerId_friendId: {
          playerId: senderId,
          friendId: targetId,
        },
      },
    });

    if (existingFriend) {
      throw new ConflictError(ErrorCodes.ALREADY_FRIENDS, '已经是好友了');
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId: targetId, status: 'PENDING' },
          { senderId: targetId, receiverId: senderId, status: 'PENDING' },
        ],
      },
    });

    if (existingRequest) {
      throw new ConflictError(ErrorCodes.ALREADY_EXISTS, '已有待处理的好友请求');
    }

    const sender = await prisma.player.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '发送者不存在');
    }

    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: targetId,
        message,
      },
    });

    return {
      id: request.id,
      senderId: sender.id,
      senderName: sender.name,
      senderRealm: sender.realm,
      senderAvatarId: sender.avatarId,
      message: request.message ?? undefined,
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  async getFriendRequests(playerId: string): Promise<FriendRequestListResponse> {
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: playerId,
        status: 'PENDING',
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      requests: requests.map((req) => ({
        id: req.id,
        senderId: req.sender.id,
        senderName: req.sender.name,
        senderRealm: req.sender.realm,
        senderAvatarId: req.sender.avatarId,
        message: req.message ?? undefined,
        status: req.status,
        createdAt: req.createdAt,
      })),
      total: requests.length,
    };
  }

  async acceptFriendRequest(playerId: string, requestId: string): Promise<void> {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '好友请求不存在');
    }

    if (request.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权处理此请求');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '请求已被处理');
    }

    await prisma.$transaction([
      prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      }),
      prisma.friend.create({
        data: {
          playerId: request.receiverId,
          friendId: request.senderId,
        },
      }),
      prisma.friend.create({
        data: {
          playerId: request.senderId,
          friendId: request.receiverId,
        },
      }),
    ]);
  }

  async rejectFriendRequest(playerId: string, requestId: string): Promise<void> {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '好友请求不存在');
    }

    if (request.receiverId !== playerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '无权处理此请求');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '请求已被处理');
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async getFriendList(playerId: string): Promise<FriendListResponse> {
    const friendRecords = await prisma.friend.findMany({
      where: { playerId },
      include: {
        friend: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const friends: FriendInfo[] = await Promise.all(
      friendRecords.map(async (record) => {
        const isOnline = await this.isPlayerOnline(record.friend.id);
        return {
          id: record.id,
          playerId: record.friend.id,
          name: record.friend.name,
          realm: record.friend.realm,
          realmStage: record.friend.realmStage,
          avatarId: record.friend.avatarId,
          title: record.friend.title ?? undefined,
          combatPower: Number(record.friend.combatPower),
          isOnline,
          intimacy: record.intimacy,
          remark: record.remark ?? undefined,
          createdAt: record.createdAt,
        };
      })
    );

    friends.sort((a, b) => {
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      return b.intimacy - a.intimacy;
    });

    return {
      friends,
      total: friends.length,
    };
  }

  async deleteFriend(playerId: string, friendId: string): Promise<void> {
    const friend = await prisma.friend.findUnique({
      where: {
        playerId_friendId: {
          playerId,
          friendId,
        },
      },
    });

    if (!friend) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '好友关系不存在');
    }

    await prisma.$transaction([
      prisma.friend.delete({
        where: {
          playerId_friendId: {
            playerId,
            friendId,
          },
        },
      }),
      prisma.friend.delete({
        where: {
          playerId_friendId: {
            playerId: friendId,
            friendId: playerId,
          },
        },
      }),
    ]);
  }

  async updateFriendRemark(
    playerId: string,
    friendId: string,
    remark?: string
  ): Promise<void> {
    const friend = await prisma.friend.findUnique({
      where: {
        playerId_friendId: {
          playerId,
          friendId,
        },
      },
    });

    if (!friend) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '好友关系不存在');
    }

    await prisma.friend.update({
      where: {
        playerId_friendId: {
          playerId,
          friendId,
        },
      },
      data: { remark },
    });
  }
}

export const friendService = new FriendService();
