import { prisma } from '../../../lib/prisma.js';

export class SaveService {
  async getList(page: number, pageSize: number, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { player: { name: { contains: search } } },
            { player: { user: { username: { contains: search } } } },
          ],
        }
      : {};

    const [saves, total] = await Promise.all([
      prisma.gameSave.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          player: {
            select: {
              name: true,
              realm: true,
              realmStage: true,
              user: {
                select: { username: true },
              },
            },
          },
        },
      }),
      prisma.gameSave.count({ where }),
    ]);

    return {
      saves: saves.map((s) => ({
        id: s.id,
        slot: s.slot,
        name: s.name,
        playTime: s.playTime,
        version: s.version,
        checkpoint: s.checkpoint,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        player: {
          name: s.player.name,
          realm: s.player.realm,
          realmStage: s.player.realmStage,
          username: s.player.user.username,
        },
      })),
      total,
      page,
      pageSize,
    };
  }

  async getById(id: string) {
    const save = await prisma.gameSave.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            name: true,
            realm: true,
            realmStage: true,
            user: { select: { username: true } },
          },
        },
      },
    });

    if (!save) return null;

    return {
      id: save.id,
      slot: save.slot,
      name: save.name,
      playTime: save.playTime,
      version: save.version,
      checkpoint: save.checkpoint,
      playerData: save.playerData,
      gameData: save.gameData,
      alchemyData: save.alchemyData,
      discipleData: save.discipleData,
      roguelikeData: save.roguelikeData,
      checksum: save.checksum,
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
      player: {
        name: save.player.name,
        realm: save.player.realm,
        realmStage: save.player.realmStage,
        username: save.player.user.username,
      },
    };
  }

  async delete(id: string) {
    await prisma.gameSave.delete({ where: { id } });
  }

  async getStats() {
    const [totalSaves, recentSaves, avgPlayTime] = await Promise.all([
      prisma.gameSave.count(),
      prisma.gameSave.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.gameSave.aggregate({
        _avg: { playTime: true },
      }),
    ]);

    return {
      totalSaves,
      recentSaves,
      avgPlayTime: Math.round(avgPlayTime._avg.playTime || 0),
    };
  }
}

export const saveService = new SaveService();
