/**
 * 剧情专属副本配置
 * 与剧情章节对应的战斗关卡
 */

import type { DungeonConfig } from './dungeons';

// 剧情副本配置
export interface StoryDungeonConfig extends Omit<DungeonConfig, 'chapter'> {
  chapter: number | string;  // 可以是数字章节或'story'标识
  storyChapter: number;      // 对应剧情章节
  storyNodeId: string;       // 对应剧情节点ID
  isBoss: boolean;           // 是否是Boss战
  dialogueBefore?: string;   // 战斗前对话
  dialogueAfter?: string;    // 战斗后对话
}

// ==================== 第二章副本 ====================

export const CHAPTER_2_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_2_1: {
    id: 'story_2_1',
    name: '青云考核',
    description: '青云宗入门考核的实战比试环节',
    chapter: 'story',
    stage: 1,
    requiredLevel: 3,
    enemyIds: ['qingyun_disciple'],
    enemyLevelBonus: 0,
    rewards: {
      exp: 100,
      spiritStones: 50,
      drops: [
        { itemId: 'healing_pill_small', chance: 1.0, quantity: 3 },
      ],
    },
    sweepCost: 10,
    storyChapter: 2,
    storyNodeId: 'chapter_2_combat_test',
    isBoss: false,
    dialogueBefore: '考核长老：「这是实战比试，点到为止，开始吧！」',
    dialogueAfter: '考核长老：「不错，你通过了考核。」',
  },
};

// ==================== 第三章副本 ====================

export const CHAPTER_3_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_3_1: {
    id: 'story_3_1',
    name: '妖狼巢穴',
    description: '追踪妖狼至其巢穴，遭遇妖狼群',
    chapter: 'story',
    stage: 1,
    requiredLevel: 4,
    enemyIds: ['small_demon_wolf', 'small_demon_wolf'],
    enemyLevelBonus: 0,
    rewards: {
      exp: 80,
      spiritStones: 30,
      drops: [
        { itemId: 'wolf_fang', chance: 0.8, quantity: 2 },
        { itemId: 'wolf_pelt', chance: 0.5, quantity: 1 },
      ],
    },
    sweepCost: 15,
    storyChapter: 3,
    storyNodeId: 'chapter_3_wolf_encounter',
    isBoss: false,
    dialogueBefore: '你发现了妖狼的巢穴，两只小妖狼发现了你，龇牙咆哮着扑了过来！',
    dialogueAfter: '击败了这两只小妖狼，你继续深入巢穴...',
  },

  story_3_2: {
    id: 'story_3_2',
    name: '妖狼王之战',
    description: '与妖狼王的最终决战',
    chapter: 'story',
    stage: 2,
    requiredLevel: 5,
    enemyIds: ['demon_wolf_king'],
    enemyLevelBonus: 0,
    rewards: {
      exp: 300,
      spiritStones: 100,
      drops: [
        { itemId: 'demon_core', chance: 0.5, quantity: 1 },
        { itemId: 'demon_blood', chance: 1.0, quantity: 2 },
        { itemId: 'qingfeng_sword', chance: 0.3, quantity: 1 },
      ],
    },
    sweepCost: 20,
    storyChapter: 3,
    storyNodeId: 'chapter_3_boss_battle',
    isBoss: true,
    dialogueBefore: '妖狼王发出震天怒吼：「竟敢闯入本王的领地，找死！」',
    dialogueAfter: '妖狼王倒下了，村民失踪之谜终于真相大白。',
  },
};

// ==================== 第四章副本（预留） ====================

export const CHAPTER_4_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_4_1: {
    id: 'story_4_1',
    name: '魔修袭击',
    description: '魔修突袭青云宗，你必须迎战！',
    chapter: 'story',
    stage: 1,
    requiredLevel: 8,
    enemyIds: ['demon_cultivator', 'demon_cultivator', 'demon_cultivator'],
    enemyLevelBonus: 0,
    rewards: {
      exp: 400,
      spiritStones: 150,
      drops: [
        { itemId: 'demon_blood', chance: 0.8, quantity: 2 },
        { itemId: 'bixie_talisman', chance: 0.5, quantity: 1 },
      ],
    },
    sweepCost: 25,
    storyChapter: 4,
    storyNodeId: 'chapter_4_demon_attack',
    isBoss: false,
    dialogueBefore: '三名魔修弟子拦住了你的去路：「青云宗的小辈，受死吧！」',
    dialogueAfter: '击退了魔修弟子，但你感觉到更强大的气息正在逼近...',
  },

  story_4_2: {
    id: 'story_4_2',
    name: '魔修长老',
    description: '面对魔修长老的终极挑战',
    chapter: 'story',
    stage: 2,
    requiredLevel: 10,
    enemyIds: ['demon_elder'],
    enemyLevelBonus: 0,
    rewards: {
      exp: 800,
      spiritStones: 300,
      drops: [
        { itemId: 'demon_core', chance: 1.0, quantity: 1 },
        { itemId: 'xuantie_armor', chance: 0.3, quantity: 1 },
        { itemId: 'spirit_ring', chance: 0.2, quantity: 1 },
      ],
    },
    sweepCost: 30,
    storyChapter: 4,
    storyNodeId: 'chapter_4_boss_battle',
    isBoss: true,
    dialogueBefore: '魔修长老：「有点意思，让本座亲自动手送你上路！」',
    dialogueAfter: '魔修长老被击败，这次危机暂时解除了...',
  },
};

// ==================== 第五章副本 ====================

export const CHAPTER_5_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_5_1: {
    id: 'story_5_1',
    name: '血影再战',
    description: '与宿敌血影的元婴对决',
    chapter: 'story',
    stage: 1,
    requiredLevel: 13,
    enemyIds: ['xueying'],
    enemyLevelBonus: 2,
    rewards: {
      exp: 1200,
      spiritStones: 500,
      drops: [
        { itemId: 'demon_blood', chance: 1.0, quantity: 3 },
        { itemId: 'blood_sword_fragment', chance: 0.4, quantity: 1 },
      ],
    },
    sweepCost: 35,
    storyChapter: 5,
    storyNodeId: 'chapter_5_xueying_battle',
    isBoss: false,
    dialogueBefore: '血影：「又见面了，这次可没人来救你了！」',
    dialogueAfter: '血影负伤遁逃，但他的威胁仍然笼罩着正道修仙界...',
  },

  story_5_2: {
    id: 'story_5_2',
    name: '守护镇魔铜镜',
    description: '阻止魔修化神期强者破坏镇魔铜镜',
    chapter: 'story',
    stage: 2,
    requiredLevel: 15,
    enemyIds: ['demon_huashen'],
    enemyLevelBonus: 3,
    rewards: {
      exp: 2000,
      spiritStones: 800,
      drops: [
        { itemId: 'demon_core', chance: 1.0, quantity: 2 },
        { itemId: 'zhenmo_shard', chance: 0.3, quantity: 1 },
        { itemId: 'huashen_essence', chance: 0.2, quantity: 1 },
      ],
    },
    sweepCost: 45,
    storyChapter: 5,
    storyNodeId: 'chapter_5_boss_battle',
    isBoss: true,
    dialogueBefore: '魔修化神：「小辈，凭你也想挡住本座？螳臂当车！」',
    dialogueAfter: '借助师父的护身剑意和苏瑶的配合，你们将魔修击退，镇魔铜镜安然无恙。',
  },
};

// ==================== 汇总导出 ====================

export const ALL_STORY_DUNGEONS: Record<string, StoryDungeonConfig> = {
  ...CHAPTER_2_DUNGEONS,
  ...CHAPTER_3_DUNGEONS,
  ...CHAPTER_4_DUNGEONS,
  ...CHAPTER_5_DUNGEONS,
};

// 根据ID获取剧情副本
export function getStoryDungeonById(id: string): StoryDungeonConfig | undefined {
  return ALL_STORY_DUNGEONS[id];
}

// 根据章节获取副本列表
export function getStoryDungeonsByChapter(chapter: number): StoryDungeonConfig[] {
  return Object.values(ALL_STORY_DUNGEONS).filter(d => d.storyChapter === chapter);
}

// 根据剧情节点ID获取副本
export function getStoryDungeonByNodeId(nodeId: string): StoryDungeonConfig | undefined {
  return Object.values(ALL_STORY_DUNGEONS).find(d => d.storyNodeId === nodeId);
}

// 获取章节的Boss战
export function getChapterBossDungeon(chapter: number): StoryDungeonConfig | undefined {
  return Object.values(ALL_STORY_DUNGEONS).find(d => d.storyChapter === chapter && d.isBoss);
}
