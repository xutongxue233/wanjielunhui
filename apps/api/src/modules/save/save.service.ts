import crypto from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import config from '../../config/index.js';
import { NotFoundError, BadRequestError, ErrorCodes } from '../../shared/errors/index.js';
import { buildPlayerProjectionFromSaveData } from './save.player-projection.js';

interface SaveData {
  name: string;
  playerData: unknown;
  gameData: unknown;
  alchemyData: unknown;
  discipleData: unknown;
  roguelikeData: unknown;
  playTime?: number;
  checkpoint?: string;
}

export class SaveService {
  private generateChecksum(data: SaveData): string {
    const content = JSON.stringify({
      playerData: data.playerData,
      gameData: data.gameData,
      timestamp: Date.now(),
    });
    return crypto.createHmac('sha256', config.security.saveSecretKey).update(content).digest('hex');
  }

  async listSaves(userId: string) {
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    // 玩家不存在时返回空数组，而不是抛出错误
    if (!player) {
      return [];
    }

    const saves = await prisma.gameSave.findMany({
      where: { playerId: player.id },
      select: {
        id: true,
        slot: true,
        name: true,
        playTime: true,
        checkpoint: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { slot: 'asc' },
    });

    return saves;
  }

  async getSave(userId: string, slot: number) {
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND);
    }

    const save = await prisma.gameSave.findUnique({
      where: { playerId_slot: { playerId: player.id, slot } },
    });

    if (!save) {
      throw new NotFoundError(ErrorCodes.SAVE_NOT_FOUND);
    }

    return save;
  }

  async createOrUpdateSave(userId: string, slot: number, data: SaveData) {
    if (slot < 1 || slot > 3) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '存档槽位必须在1-3之间');
    }

    const checksum = this.generateChecksum(data);
    const projection = buildPlayerProjectionFromSaveData(data.playerData, data.roguelikeData);

    // 将对象序列化为 JSON 字符串存储
    const playerDataStr = JSON.stringify(data.playerData);
    const gameDataStr = JSON.stringify(data.gameData);
    const alchemyDataStr = JSON.stringify(data.alchemyData);
    const discipleDataStr = JSON.stringify(data.discipleData);
    const roguelikeDataStr = JSON.stringify(data.roguelikeData);

    const save = await prisma.$transaction(async (tx) => {
      let player = await tx.player.findUnique({
        where: { userId },
      });

      // 玩家不存在时自动创建
      if (!player) {
        player = await tx.player.create({
          data: {
            userId,
            name: projection.name || '无名修士',
            realm: projection.realm || '炼气',
            realmStage: projection.realmStage || '初期',
            spiritualRoot: projection.spiritualRoot || '混沌灵根',
          },
        });
      }

      const playerUpdateData: Prisma.PlayerUpdateInput = {
        lastActiveAt: new Date(),
      };

      if (projection.name !== undefined) playerUpdateData.name = projection.name;
      if (projection.realm !== undefined) playerUpdateData.realm = projection.realm;
      if (projection.realmStage !== undefined) playerUpdateData.realmStage = projection.realmStage;
      if (projection.spiritualRoot !== undefined) playerUpdateData.spiritualRoot = projection.spiritualRoot;
      if (projection.cultivation !== undefined) {
        playerUpdateData.cultivation = projection.cultivation;
        playerUpdateData.totalCultivation =
          projection.cultivation > player.totalCultivation ? projection.cultivation : player.totalCultivation;
      }
      if (projection.health !== undefined) playerUpdateData.health = projection.health;
      if (projection.maxHealth !== undefined) playerUpdateData.maxHealth = projection.maxHealth;
      if (projection.attack !== undefined) playerUpdateData.attack = projection.attack;
      if (projection.defense !== undefined) playerUpdateData.defense = projection.defense;
      if (projection.speed !== undefined) playerUpdateData.speed = projection.speed;
      if (projection.critRate !== undefined) playerUpdateData.critRate = projection.critRate;
      if (projection.critDamage !== undefined) playerUpdateData.critDamage = projection.critDamage;
      if (projection.combatPower !== undefined) playerUpdateData.combatPower = projection.combatPower;
      if (projection.reincarnations !== undefined) playerUpdateData.reincarnations = projection.reincarnations;
      if (projection.destinyPoints !== undefined) playerUpdateData.destinyPoints = projection.destinyPoints;

      await tx.player.update({
        where: { id: player.id },
        data: playerUpdateData,
      });

      return tx.gameSave.upsert({
        where: { playerId_slot: { playerId: player.id, slot } },
        update: {
          name: data.name,
          playerData: playerDataStr,
          gameData: gameDataStr,
          alchemyData: alchemyDataStr,
          discipleData: discipleDataStr,
          roguelikeData: roguelikeDataStr,
          playTime: data.playTime ?? 0,
          checkpoint: data.checkpoint ?? null,
          checksum,
          version: { increment: 1 },
        },
        create: {
          playerId: player.id,
          slot,
          name: data.name,
          playerData: playerDataStr,
          gameData: gameDataStr,
          alchemyData: alchemyDataStr,
          discipleData: discipleDataStr,
          roguelikeData: roguelikeDataStr,
          playTime: data.playTime ?? 0,
          checkpoint: data.checkpoint ?? null,
          checksum,
        },
      });
    });

    return {
      id: save.id,
      slot: save.slot,
      name: save.name,
      version: save.version,
      updatedAt: save.updatedAt,
    };
  }

  async deleteSave(userId: string, slot: number) {
    const player = await prisma.player.findUnique({
      where: { userId },
    });

    if (!player) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND);
    }

    const save = await prisma.gameSave.findUnique({
      where: { playerId_slot: { playerId: player.id, slot } },
    });

    if (!save) {
      throw new NotFoundError(ErrorCodes.SAVE_NOT_FOUND);
    }

    await prisma.gameSave.delete({
      where: { id: save.id },
    });
  }
}

export const saveService = new SaveService();
