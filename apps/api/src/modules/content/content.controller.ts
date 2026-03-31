import type { FastifyRequest, FastifyReply } from 'fastify';
import { contentService } from './content.service.js';

export class ContentController {
  // ==================== 敌人 ====================

  async getEnemies(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      minLevel?: string;
      maxLevel?: string;
      type?: string;
      limit?: string;
      offset?: string;
    };

    const result = await contentService.getEnemies({
      minLevel: query.minLevel ? parseInt(query.minLevel, 10) : undefined,
      maxLevel: query.maxLevel ? parseInt(query.maxLevel, 10) : undefined,
      type: query.type,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });

    return reply.send({ success: true, data: result });
  }

  async getEnemyById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const enemy = await contentService.getEnemyById(id);
    return reply.send({ success: true, data: enemy });
  }

  // ==================== 物品 ====================

  async getItems(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      type?: string;
      rarity?: string;
      limit?: string;
      offset?: string;
    };

    const result = await contentService.getItems({
      type: query.type,
      rarity: query.rarity,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });

    return reply.send({ success: true, data: result });
  }

  async getItemById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const item = await contentService.getItemById(id);
    return reply.send({ success: true, data: item });
  }

  // ==================== 装备 ====================

  async getEquipments(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      slot?: string;
      quality?: string;
      minLevel?: string;
      maxLevel?: string;
      limit?: string;
      offset?: string;
    };

    const result = await contentService.getEquipments({
      slot: query.slot,
      quality: query.quality,
      minLevel: query.minLevel ? parseInt(query.minLevel, 10) : undefined,
      maxLevel: query.maxLevel ? parseInt(query.maxLevel, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });

    return reply.send({ success: true, data: result });
  }

  async getEquipmentById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const equipment = await contentService.getEquipmentById(id);
    return reply.send({ success: true, data: equipment });
  }

  // ==================== 技能 ====================

  async getSkills(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      element?: string;
      type?: string;
      limit?: string;
      offset?: string;
    };

    const result = await contentService.getSkills({
      element: query.element,
      type: query.type,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });

    return reply.send({ success: true, data: result });
  }

  async getSkillById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const skill = await contentService.getSkillById(id);
    return reply.send({ success: true, data: skill });
  }

  // ==================== 副本 ====================

  async getDungeons(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      chapter?: string;
      type?: string;
      limit?: string;
      offset?: string;
    };

    const result = await contentService.getDungeons({
      chapter: query.chapter,
      type: query.type,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });

    return reply.send({ success: true, data: result });
  }

  async getDungeonById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const dungeon = await contentService.getDungeonById(id);
    return reply.send({ success: true, data: dungeon });
  }

  // ==================== 剧情 ====================

  async getStoryChapters(_request: FastifyRequest, reply: FastifyReply) {
    const chapters = await contentService.getStoryChapters();
    return reply.send({ success: true, data: chapters });
  }

  async getStoryChapterById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const chapter = await contentService.getStoryChapterById(id);
    return reply.send({ success: true, data: chapter });
  }

  // ==================== 炼丹 ====================

  async getAlchemyRecipes(_request: FastifyRequest, reply: FastifyReply) {
    const recipes = contentService.getAlchemyRecipes();
    return reply.send({ success: true, data: recipes });
  }

  async getAlchemyCauldrons(_request: FastifyRequest, reply: FastifyReply) {
    const cauldrons = contentService.getAlchemyCauldrons();
    return reply.send({ success: true, data: cauldrons });
  }

  // ==================== 境界/出身/灵根 ====================

  async getRealms(_request: FastifyRequest, reply: FastifyReply) {
    const realms = contentService.getRealms();
    return reply.send({ success: true, data: realms });
  }

  async getOrigins(_request: FastifyRequest, reply: FastifyReply) {
    const origins = contentService.getOrigins();
    return reply.send({ success: true, data: origins });
  }

  async getSpiritRoots(_request: FastifyRequest, reply: FastifyReply) {
    const spiritRoots = contentService.getSpiritRoots();
    return reply.send({ success: true, data: spiritRoots });
  }

  // ==================== 秘境 ====================

  async getRoguelikeDungeons(_request: FastifyRequest, reply: FastifyReply) {
    const dungeons = contentService.getRoguelikeDungeons();
    return reply.send({ success: true, data: dungeons });
  }

  async getRoguelikeTalents(_request: FastifyRequest, reply: FastifyReply) {
    const talents = contentService.getRoguelikeTalents();
    return reply.send({ success: true, data: talents });
  }
}

export const contentController = new ContentController();
