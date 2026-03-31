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
    enemyIds: ['yuanying_elder'],
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
    enemyIds: ['huashen_demon_lord'],
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

// ==================== 第六章副本 ====================

export const CHAPTER_6_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_6_1: {
    id: 'story_6_1',
    name: '前殿守阵傀儡',
    description: '闯入云隐秘境前殿后，被沉睡的古代傀儡拦截',
    chapter: 'story',
    stage: 1,
    requiredLevel: 14,
    enemyIds: ['golden_puppet', 'golden_puppet'],
    enemyLevelBonus: -20,
    rewards: {
      exp: 2600,
      spiritStones: 1000,
      drops: [
        { itemId: 'iron_ore', chance: 1.0, quantity: 5 },
        { itemId: 'golem_core', chance: 0.5, quantity: 1 },
      ],
    },
    sweepCost: 50,
    storyChapter: 6,
    storyNodeId: 'ch6_first_battle',
    isBoss: false,
    dialogueBefore: '两尊金甲傀儡在前殿中苏醒，古老灵核同时亮起，拦住了所有闯入者。',
    dialogueAfter: '前殿守阵傀儡被击溃，星图与档案库的入口终于显现。',
  },

  story_6_2: {
    id: 'story_6_2',
    name: '雷海守盘者',
    description: '镇界星盘前最后的古代守护者',
    chapter: 'story',
    stage: 2,
    requiredLevel: 15,
    enemyIds: ['thunder_puppet'],
    enemyLevelBonus: -24,
    rewards: {
      exp: 3600,
      spiritStones: 1500,
      drops: [
        { itemId: 'thunder_essence', chance: 0.5, quantity: 1 },
        { itemId: 'golem_core', chance: 0.6, quantity: 2 },
      ],
    },
    sweepCost: 60,
    storyChapter: 6,
    storyNodeId: 'ch6_second_battle',
    isBoss: true,
    dialogueBefore: '镇界星盘前，雷海守盘者缓缓抬头，整座中枢殿都随之响起雷鸣。',
    dialogueAfter: '雷海守盘者倒下，镇界星盘与补天卷残篇终于落入你手中。',
  },
};

// ==================== 第七章副本 ====================

export const CHAPTER_7_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_7_1: {
    id: 'story_7_1',
    name: '北荒断桥',
    description: '与修罗大将争夺断桥锚点的控制权',
    chapter: 'story',
    stage: 1,
    requiredLevel: 15,
    enemyIds: ['shura_general'],
    enemyLevelBonus: -19,
    rewards: {
      exp: 4500,
      spiritStones: 1800,
      drops: [
        { itemId: 'shura_blood', chance: 0.6, quantity: 1 },
        { itemId: 'demon_core', chance: 0.5, quantity: 1 },
      ],
    },
    sweepCost: 70,
    storyChapter: 7,
    storyNodeId: 'ch7_first_battle',
    isBoss: false,
    dialogueBefore: '北荒断桥尽头，修罗大将拖着血焰长戟现身，战场气息骤然一沉。',
    dialogueAfter: '修罗大将被斩落断桥，第一处镇界锚终于得到喘息之机。',
  },

  story_7_2: {
    id: 'story_7_2',
    name: '观星台裂隙魔将',
    description: '在天衡观星台阻止镇域级魔将接管界缝',
    chapter: 'story',
    stage: 2,
    requiredLevel: 16,
    enemyIds: ['jiuyou_demon_general'],
    enemyLevelBonus: -27,
    rewards: {
      exp: 6200,
      spiritStones: 2400,
      drops: [
        { itemId: 'soul_crystal', chance: 0.5, quantity: 2 },
        { itemId: 'demon_blood', chance: 0.8, quantity: 3 },
      ],
    },
    sweepCost: 85,
    storyChapter: 7,
    storyNodeId: 'ch7_final_battle',
    isBoss: true,
    dialogueBefore: '观星台下方的裂隙被彻底撕开，九幽魔将自黑焰中缓步升空。',
    dialogueAfter: '魔将坠回裂隙，观星台重新与镇界星盘完成了短暂共鸣。',
  },
};

// ==================== 第八章副本 ====================

export const CHAPTER_8_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_8_1: {
    id: 'story_8_1',
    name: '镜湖裂隙',
    description: '镜湖湖底裂开的第一道虚空断层，必须先击溃冲出的裂隙兽',
    chapter: 'story',
    stage: 1,
    requiredLevel: 16,
    enemyIds: ['void_rift_beast'],
    enemyLevelBonus: -28,
    rewards: {
      exp: 7200,
      spiritStones: 2800,
      drops: [
        { itemId: 'soul_crystal', chance: 0.6, quantity: 2 },
        { itemId: 'chaos_essence', chance: 0.08, quantity: 1 },
      ],
    },
    sweepCost: 90,
    storyChapter: 8,
    storyNodeId: 'ch8_first_battle',
    isBoss: false,
    dialogueBefore: '湖底裂隙骤然张开，虚空裂隙兽踏着破碎空间扑来，整条下潜通道都在剧烈震颤。',
    dialogueAfter: '裂隙兽炸散成暗银碎光，镜湖阵心深处的逆钥与守门意志终于暴露出来。',
  },

  story_8_2: {
    id: 'story_8_2',
    name: '天关守门意志',
    description: '被逆界引强行牵落人间的仙界守卫，正在将镜湖改写成真正的界门门轴',
    chapter: 'story',
    stage: 2,
    requiredLevel: 17,
    enemyIds: ['immortal_guard'],
    enemyLevelBonus: -27,
    rewards: {
      exp: 8600,
      spiritStones: 3400,
      drops: [
        { itemId: 'phoenix_blood', chance: 0.18, quantity: 1 },
        { itemId: 'thunder_essence', chance: 0.35, quantity: 1 },
        { itemId: 'soul_crystal', chance: 0.7, quantity: 3 },
      ],
    },
    sweepCost: 100,
    storyChapter: 8,
    storyNodeId: 'ch8_final_battle',
    isBoss: true,
    dialogueBefore: '金色守卫自镜湖最深处抬剑，半轮门阙投影在他身后徐徐展开，整片湖底都像被旧日天关重新审视。',
    dialogueAfter: '守门意志终被击退，逆钥崩裂，镜湖重新从界门边缘被拉回人间。',
  },
};

// ==================== 第九章副本 ====================

export const CHAPTER_9_DUNGEONS: Record<string, StoryDungeonConfig> = {
  story_9_1: {
    id: 'story_9_1',
    name: '残城巡狩者',
    description: '天关残城中的旧律巡狩者已经把远征队识别为越界者，必须先清掉它们的警讯链',
    chapter: 'story',
    stage: 1,
    requiredLevel: 17,
    enemyIds: ['fallen_immortal'],
    enemyLevelBonus: -20,
    rewards: {
      exp: 9800,
      spiritStones: 3900,
      drops: [
        { itemId: 'soul_crystal', chance: 0.7, quantity: 3 },
        { itemId: 'thunder_essence', chance: 0.2, quantity: 1 },
      ],
    },
    sweepCost: 110,
    storyChapter: 9,
    storyNodeId: 'ch9_first_battle',
    isBoss: false,
    dialogueBefore: '残城城门的黑影里，巡狩者已把你们判定为越界者，旧律铭文正在整片废墙上同步亮起。',
    dialogueAfter: '巡狩者崩散后，法诏库周围的警讯链终于断开，你们得以抢在残城全面苏醒前继续深入。',
  },

  story_9_2: {
    id: 'story_9_2',
    name: '法诏库裁定者',
    description: '被错误总令唤醒的天道执行者，正在以残城全部卷宗为依据重判人间的开门资格',
    chapter: 'story',
    stage: 2,
    requiredLevel: 18,
    enemyIds: ['dao_enforcer'],
    enemyLevelBonus: -29,
    rewards: {
      exp: 12000,
      spiritStones: 5000,
      drops: [
        { itemId: 'phoenix_blood', chance: 0.25, quantity: 1 },
        { itemId: 'thunder_essence', chance: 0.45, quantity: 1 },
        { itemId: 'soul_crystal', chance: 0.8, quantity: 4 },
      ],
    },
    sweepCost: 125,
    storyChapter: 9,
    storyNodeId: 'ch9_final_battle',
    isBoss: true,
    dialogueBefore: '法诏库深处的长阶尽头，天道执行者已接管残城裁定权，周围卷宗正一页页替它补完审判依据。',
    dialogueAfter: '执行者崩散后，整座法诏库终于停止自我裁定，那道被篡改过的总令也留下了第一块真正能追查的碎片。',
  },
};

// ==================== 汇总导出 ====================

export const ALL_STORY_DUNGEONS: Record<string, StoryDungeonConfig> = {
  ...CHAPTER_2_DUNGEONS,
  ...CHAPTER_3_DUNGEONS,
  ...CHAPTER_4_DUNGEONS,
  ...CHAPTER_5_DUNGEONS,
  ...CHAPTER_6_DUNGEONS,
  ...CHAPTER_7_DUNGEONS,
  ...CHAPTER_8_DUNGEONS,
  ...CHAPTER_9_DUNGEONS,
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
