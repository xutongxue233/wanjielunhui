import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ErrorCodes } from '../../shared/errors/index.js';
import {
  REALM_CONFIGS, REALM_ORDER, STAGE_ORDER, STAGE_DISPLAY_NAMES,
  ORIGINS, SPIRIT_ROOTS,
  ALCHEMY_RECIPES, ALCHEMY_CAULDRONS,
  ROGUELIKE_DUNGEONS, ROGUELIKE_TALENTS,
} from './content.static-data.js';

// 简单的内存缓存
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5分钟

export class ContentService {
  private cache = new Map<string, CacheEntry<unknown>>();

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
  }

  invalidateCache(): void {
    this.cache.clear();
  }

  // ==================== 敌人 ====================

  async getEnemies(params: {
    minLevel?: number;
    maxLevel?: number;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const { minLevel, maxLevel, type, limit = 20, offset = 0 } = params;

    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;
    if (minLevel !== undefined || maxLevel !== undefined) {
      where.level = {} as Record<string, unknown>;
      if (minLevel !== undefined) (where.level as Record<string, unknown>).gte = minLevel;
      if (maxLevel !== undefined) (where.level as Record<string, unknown>).lte = maxLevel;
    }

    const [data, total] = await Promise.all([
      prisma.enemyTemplate.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { level: 'asc' },
      }),
      prisma.enemyTemplate.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getEnemyById(id: string) {
    const enemy = await prisma.enemyTemplate.findFirst({
      where: {
        OR: [{ id }, { enemyId: id }],
        isActive: true,
      },
    });
    if (!enemy) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '敌人不存在');
    }
    return enemy;
  }

  // ==================== 物品 ====================

  async getItems(params: {
    type?: string;
    rarity?: string;
    limit?: number;
    offset?: number;
  }) {
    const { type, rarity, limit = 20, offset = 0 } = params;

    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;
    if (rarity) where.quality = rarity;

    const [data, total] = await Promise.all([
      prisma.itemTemplate.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.itemTemplate.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getItemById(id: string) {
    const item = await prisma.itemTemplate.findFirst({
      where: {
        OR: [{ id }, { itemId: id }],
        isActive: true,
      },
    });
    if (!item) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '物品不存在');
    }
    return item;
  }

  // ==================== 装备 ====================

  async getEquipments(params: {
    slot?: string;
    quality?: string;
    minLevel?: number;
    maxLevel?: number;
    limit?: number;
    offset?: number;
  }) {
    const { slot, quality, limit = 20, offset = 0 } = params;

    const where: Record<string, unknown> = { isActive: true };
    if (slot) where.slot = slot;
    if (quality) where.quality = quality;

    const [data, total] = await Promise.all([
      prisma.equipmentTemplate.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.equipmentTemplate.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getEquipmentById(id: string) {
    const equipment = await prisma.equipmentTemplate.findFirst({
      where: {
        OR: [{ id }, { equipmentId: id }],
        isActive: true,
      },
    });
    if (!equipment) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '装备不存在');
    }
    return equipment;
  }

  // ==================== 技能 ====================

  async getSkills(params: {
    element?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const { element, type, limit = 20, offset = 0 } = params;

    const where: Record<string, unknown> = { isActive: true };
    if (element) where.element = element;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      prisma.skillTemplate.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.skillTemplate.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getSkillById(id: string) {
    const skill = await prisma.skillTemplate.findFirst({
      where: {
        OR: [{ id }, { skillId: id }],
        isActive: true,
      },
    });
    if (!skill) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '技能不存在');
    }
    return skill;
  }

  // ==================== 副本 ====================

  async getDungeons(params: {
    chapter?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const { chapter, type, limit = 20, offset = 0 } = params;

    const where: Record<string, unknown> = { isActive: true };
    if (chapter) where.chapterId = chapter;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      prisma.dungeonTemplate.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      prisma.dungeonTemplate.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async getDungeonById(id: string) {
    const dungeon = await prisma.dungeonTemplate.findFirst({
      where: {
        OR: [{ id }, { dungeonId: id }],
        isActive: true,
      },
    });
    if (!dungeon) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '副本不存在');
    }
    return dungeon;
  }

  // ==================== 剧情 ====================

  async getStoryChapters() {
    const cacheKey = 'story_chapters';
    const cached = this.getCached<unknown>(cacheKey);
    if (cached) return cached;

    const chapters = await prisma.storyChapter.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        chapterId: true,
        name: true,
        description: true,
        order: true,
        unlockConditions: true,
        rewards: true,
      },
    });

    this.setCache(cacheKey, chapters);
    return chapters;
  }

  async getStoryChapterById(id: string) {
    const chapter = await prisma.storyChapter.findFirst({
      where: {
        OR: [{ id }, { chapterId: id }],
        isActive: true,
      },
      include: {
        nodes: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!chapter) {
      throw new NotFoundError(ErrorCodes.NOT_FOUND, '章节不存在');
    }
    return chapter;
  }

  // ==================== 静态配置数据 ====================

  getRealms() {
    return REALM_ORDER.map((name, index) => ({
      ...REALM_CONFIGS[name],
      order: index,
      stages: STAGE_ORDER.map((stage) => ({
        name: stage,
        displayName: STAGE_DISPLAY_NAMES[stage],
      })),
    }));
  }

  getOrigins() {
    return ORIGINS;
  }

  getSpiritRoots() {
    return SPIRIT_ROOTS;
  }

  getAlchemyRecipes() {
    return ALCHEMY_RECIPES;
  }

  getAlchemyCauldrons() {
    return ALCHEMY_CAULDRONS;
  }

  getRoguelikeDungeons() {
    return ROGUELIKE_DUNGEONS;
  }

  getRoguelikeTalents() {
    return ROGUELIKE_TALENTS;
  }
}

export const contentService = new ContentService();
