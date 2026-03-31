import type { FastifyInstance } from 'fastify';
import { contentController } from './content.controller.js';

export async function contentRoutes(fastify: FastifyInstance) {
  // ==================== 敌人 ====================
  fastify.get('/enemies', {
    schema: {
      description: '获取敌人列表',
      tags: ['游戏内容'],
      querystring: {
        type: 'object',
        properties: {
          minLevel: { type: 'integer', description: '最小等级' },
          maxLevel: { type: 'integer', description: '最大等级' },
          type: { type: 'string', description: '敌人类型' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
    handler: contentController.getEnemies.bind(contentController),
  });

  fastify.get('/enemies/:id', {
    schema: {
      description: '获取单个敌人详情',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getEnemyById.bind(contentController),
  });

  // ==================== 物品 ====================
  fastify.get('/items', {
    schema: {
      description: '获取物品列表',
      tags: ['游戏内容'],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', description: '物品类型' },
          rarity: { type: 'string', description: '稀有度' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
    handler: contentController.getItems.bind(contentController),
  });

  fastify.get('/items/:id', {
    schema: {
      description: '获取单个物品详情',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getItemById.bind(contentController),
  });

  // ==================== 装备 ====================
  fastify.get('/equipments', {
    schema: {
      description: '获取装备列表',
      tags: ['游戏内容'],
      querystring: {
        type: 'object',
        properties: {
          slot: { type: 'string', description: '装备槽位' },
          quality: { type: 'string', description: '装备品质' },
          minLevel: { type: 'integer', description: '最小等级' },
          maxLevel: { type: 'integer', description: '最大等级' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
    handler: contentController.getEquipments.bind(contentController),
  });

  fastify.get('/equipments/:id', {
    schema: {
      description: '获取单个装备详情',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getEquipmentById.bind(contentController),
  });

  // ==================== 技能 ====================
  fastify.get('/skills', {
    schema: {
      description: '获取技能列表',
      tags: ['游戏内容'],
      querystring: {
        type: 'object',
        properties: {
          element: { type: 'string', description: '元素属性' },
          type: { type: 'string', description: '技能类型' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
    handler: contentController.getSkills.bind(contentController),
  });

  fastify.get('/skills/:id', {
    schema: {
      description: '获取单个技能详情',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getSkillById.bind(contentController),
  });

  // ==================== 副本 ====================
  fastify.get('/dungeons', {
    schema: {
      description: '获取副本列表',
      tags: ['游戏内容'],
      querystring: {
        type: 'object',
        properties: {
          chapter: { type: 'string', description: '关联章节' },
          type: { type: 'string', description: '副本类型' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
    handler: contentController.getDungeons.bind(contentController),
  });

  fastify.get('/dungeons/:id', {
    schema: {
      description: '获取单个副本详情',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getDungeonById.bind(contentController),
  });

  // ==================== 剧情 ====================
  fastify.get('/story/chapters', {
    schema: {
      description: '获取所有剧情章节概要',
      tags: ['游戏内容'],
    },
    handler: contentController.getStoryChapters.bind(contentController),
  });

  fastify.get('/story/chapters/:id', {
    schema: {
      description: '获取章节详情（含所有节点）',
      tags: ['游戏内容'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: contentController.getStoryChapterById.bind(contentController),
  });

  // ==================== 炼丹 ====================
  fastify.get('/alchemy/recipes', {
    schema: {
      description: '获取所有炼丹配方',
      tags: ['游戏内容'],
    },
    handler: contentController.getAlchemyRecipes.bind(contentController),
  });

  fastify.get('/alchemy/cauldrons', {
    schema: {
      description: '获取所有丹炉',
      tags: ['游戏内容'],
    },
    handler: contentController.getAlchemyCauldrons.bind(contentController),
  });

  // ==================== 境界/出身/灵根 ====================
  fastify.get('/realms', {
    schema: {
      description: '获取所有境界配置',
      tags: ['游戏内容'],
    },
    handler: contentController.getRealms.bind(contentController),
  });

  fastify.get('/origins', {
    schema: {
      description: '获取所有出身配置',
      tags: ['游戏内容'],
    },
    handler: contentController.getOrigins.bind(contentController),
  });

  fastify.get('/spirit-roots', {
    schema: {
      description: '获取所有灵根配置',
      tags: ['游戏内容'],
    },
    handler: contentController.getSpiritRoots.bind(contentController),
  });

  // ==================== 秘境 ====================
  fastify.get('/roguelike/dungeons', {
    schema: {
      description: '获取所有秘境',
      tags: ['游戏内容'],
    },
    handler: contentController.getRoguelikeDungeons.bind(contentController),
  });

  fastify.get('/roguelike/talents', {
    schema: {
      description: '获取所有秘境天赋',
      tags: ['游戏内容'],
    },
    handler: contentController.getRoguelikeTalents.bind(contentController),
  });
}

export default contentRoutes;
