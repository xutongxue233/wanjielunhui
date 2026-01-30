import crypto from 'node:crypto';
import { prisma } from '../../lib/prisma.js';
import config from '../../config/index.js';
import { NotFoundError, BadRequestError, ErrorCodes } from '../../shared/errors/index.js';

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

    let player = await prisma.player.findUnique({
      where: { userId },
    });

    // 玩家不存在时自动创建
    if (!player) {
      const playerData = data.playerData as { player?: { name?: string; realm?: { id?: string; stage?: string }; spiritualRoot?: { type?: string } } };
      const playerInfo = playerData?.player;

      player = await prisma.player.create({
        data: {
          userId,
          name: playerInfo?.name || '无名修士',
          realm: playerInfo?.realm?.id || '炼气',
          realmStage: playerInfo?.realm?.stage || '初期',
          spiritualRoot: playerInfo?.spiritualRoot?.type || '混沌灵根',
        },
      });
    }

    const checksum = this.generateChecksum(data);

    // 将对象序列化为 JSON 字符串存储
    const playerDataStr = JSON.stringify(data.playerData);
    const gameDataStr = JSON.stringify(data.gameData);
    const alchemyDataStr = JSON.stringify(data.alchemyData);
    const discipleDataStr = JSON.stringify(data.discipleData);
    const roguelikeDataStr = JSON.stringify(data.roguelikeData);

    const save = await prisma.gameSave.upsert({
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
