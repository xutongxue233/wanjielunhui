import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ConflictError, ErrorCodes } from '../../shared/errors/index.js';
import type { UpdatePlayerInput, PlayerProfile, PlayerPublicProfile } from './player.schema.js';

export class PlayerService {
  async getProfile(userId: string): Promise<PlayerProfile> {
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND);
    }

    return {
      id: player.id,
      name: player.name,
      title: player.title,
      avatarId: player.avatarId,
      realm: player.realm,
      realmStage: player.realmStage,
      cultivation: player.cultivation,
      combatPower: player.combatPower,
      pvpRating: player.pvpRating,
      reincarnations: player.reincarnations,
      spiritualRoot: player.spiritualRoot,
      createdAt: player.createdAt,
    };
  }

  async getPublicProfile(playerId: string): Promise<PlayerPublicProfile> {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND);
    }

    return {
      id: player.id,
      name: player.name,
      title: player.title,
      avatarId: player.avatarId,
      realm: player.realm,
      realmStage: player.realmStage,
      combatPower: player.combatPower,
      pvpRating: player.pvpRating,
    };
  }

  async updateProfile(userId: string, input: UpdatePlayerInput): Promise<PlayerProfile> {
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND);
    }

    if (input.name && input.name !== player.name) {
      const existing = await prisma.player.findFirst({
        where: { name: input.name },
      });
      if (existing) {
        throw new ConflictError(ErrorCodes.ALREADY_EXISTS, '该名称已被使用');
      }
    }

    const updated = await prisma.player.update({
      where: { userId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.avatarId !== undefined ? { avatarId: input.avatarId } : {}),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      title: updated.title,
      avatarId: updated.avatarId,
      realm: updated.realm,
      realmStage: updated.realmStage,
      cultivation: updated.cultivation,
      combatPower: updated.combatPower,
      pvpRating: updated.pvpRating,
      reincarnations: updated.reincarnations,
      spiritualRoot: updated.spiritualRoot,
      createdAt: updated.createdAt,
    };
  }

  async syncData(userId: string, data: {
    realm?: string;
    realmStage?: string;
    cultivation?: bigint;
    combatPower?: bigint;
    health?: number;
    maxHealth?: number;
    attack?: number;
    defense?: number;
    speed?: number;
    spiritStones?: bigint;
    destinyPoints?: number;
    reincarnations?: number;
  }): Promise<void> {
    await prisma.player.update({
      where: { userId },
      data: {
        ...data,
        lastActiveAt: new Date(),
      },
    });
  }
}

export const playerService = new PlayerService();
