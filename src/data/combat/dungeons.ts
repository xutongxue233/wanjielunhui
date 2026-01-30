import type { Element } from '../../types';
import { ENEMY_TEMPLATES, createEnemyFromTemplate } from './enemies';

// 副本难度
export type DungeonDifficulty = 'normal' | 'hard' | 'nightmare';

// 副本配置
export interface DungeonConfig {
  id: string;
  name: string;
  description: string;
  chapter: number;
  stage: number;
  requiredLevel: number;
  enemyIds: string[];
  enemyLevelBonus: number;
  rewards: {
    exp: number;
    spiritStones: number;
    drops: { itemId: string; chance: number; quantity: number }[];
  };
  sweepCost: number; // 扫荡消耗的体力
  isUnlocked?: boolean;
  isCleared?: boolean;
  stars?: number; // 0-3星评价
}

// 章节配置
export interface ChapterConfig {
  id: number;
  name: string;
  description: string;
  element: Element | 'neutral';
  stages: DungeonConfig[];
}

// 副本数据
export const CHAPTERS: ChapterConfig[] = [
  {
    id: 1,
    name: '青云山脉',
    description: '山林中栖息着各种野兽和低级妖物',
    element: 'wood',
    stages: [
      {
        id: '1-1',
        name: '山脚小径',
        description: '山脚下的小路，偶有野兽出没',
        chapter: 1,
        stage: 1,
        requiredLevel: 1,
        enemyIds: ['wild_boar'],
        enemyLevelBonus: 0,
        rewards: { exp: 20, spiritStones: 5, drops: [] },
        sweepCost: 5,
      },
      {
        id: '1-2',
        name: '密林深处',
        description: '茂密的树林中藏着灵狼',
        chapter: 1,
        stage: 2,
        requiredLevel: 2,
        enemyIds: ['wild_boar', 'spirit_wolf'],
        enemyLevelBonus: 1,
        rewards: { exp: 40, spiritStones: 10, drops: [] },
        sweepCost: 6,
      },
      {
        id: '1-3',
        name: '狼王巢穴',
        description: '灵狼群的栖息地',
        chapter: 1,
        stage: 3,
        requiredLevel: 3,
        enemyIds: ['spirit_wolf', 'spirit_wolf'],
        enemyLevelBonus: 2,
        rewards: { exp: 60, spiritStones: 20, drops: [] },
        sweepCost: 8,
      },
    ],
  },
  {
    id: 2,
    name: '焰火洞窟',
    description: '炽热的洞窟中居住着火属性妖兽',
    element: 'fire',
    stages: [
      {
        id: '2-1',
        name: '洞窟入口',
        description: '洞口热浪滚滚',
        chapter: 2,
        stage: 1,
        requiredLevel: 4,
        enemyIds: ['fire_serpent'],
        enemyLevelBonus: 0,
        rewards: { exp: 80, spiritStones: 30, drops: [] },
        sweepCost: 10,
      },
      {
        id: '2-2',
        name: '熔岩通道',
        description: '流淌着岩浆的通道',
        chapter: 2,
        stage: 2,
        requiredLevel: 5,
        enemyIds: ['fire_serpent', 'fire_serpent'],
        enemyLevelBonus: 1,
        rewards: { exp: 100, spiritStones: 40, drops: [] },
        sweepCost: 12,
      },
      {
        id: '2-3',
        name: '火蛇巢穴',
        description: '火蛇聚集之地',
        chapter: 2,
        stage: 3,
        requiredLevel: 6,
        enemyIds: ['fire_serpent', 'fire_serpent', 'fire_serpent'],
        enemyLevelBonus: 2,
        rewards: { exp: 150, spiritStones: 60, drops: [] },
        sweepCost: 15,
      },
    ],
  },
  {
    id: 3,
    name: '岩石峡谷',
    description: '巨大的岩石傀儡守护着峡谷',
    element: 'earth',
    stages: [
      {
        id: '3-1',
        name: '峡谷入口',
        description: '巨石林立的峡谷',
        chapter: 3,
        stage: 1,
        requiredLevel: 7,
        enemyIds: ['rock_golem'],
        enemyLevelBonus: 0,
        rewards: { exp: 180, spiritStones: 80, drops: [] },
        sweepCost: 18,
      },
      {
        id: '3-2',
        name: '傀儡墓地',
        description: '废弃的傀儡残骸遍布',
        chapter: 3,
        stage: 2,
        requiredLevel: 8,
        enemyIds: ['rock_golem', 'rock_golem'],
        enemyLevelBonus: 1,
        rewards: { exp: 220, spiritStones: 100, drops: [] },
        sweepCost: 20,
      },
      {
        id: '3-3',
        name: '傀儡工坊',
        description: '上古时期制造傀儡的遗址',
        chapter: 3,
        stage: 3,
        requiredLevel: 9,
        enemyIds: ['rock_golem', 'rock_golem', 'wandering_cultivator'],
        enemyLevelBonus: 2,
        rewards: { exp: 300, spiritStones: 150, drops: [] },
        sweepCost: 25,
      },
    ],
  },
];

// 获取副本配置
export function getDungeonById(dungeonId: string): DungeonConfig | null {
  for (const chapter of CHAPTERS) {
    const stage = chapter.stages.find(s => s.id === dungeonId);
    if (stage) return stage;
  }
  return null;
}

// 获取章节配置
export function getChapterById(chapterId: number): ChapterConfig | null {
  return CHAPTERS.find(c => c.id === chapterId) || null;
}

// 生成副本敌人
export function generateDungeonEnemies(dungeon: DungeonConfig): ReturnType<typeof createEnemyFromTemplate>[] {
  return dungeon.enemyIds.map(enemyId => {
    const template = ENEMY_TEMPLATES[enemyId];
    if (!template) {
      return createEnemyFromTemplate(ENEMY_TEMPLATES.wild_boar, dungeon.enemyLevelBonus);
    }
    return createEnemyFromTemplate(template, dungeon.enemyLevelBonus);
  });
}

// 计算扫荡奖励
export function calculateSweepRewards(dungeon: DungeonConfig, times: number): {
  exp: number;
  spiritStones: number;
  items: { itemId: string; quantity: number }[];
} {
  const exp = dungeon.rewards.exp * times;
  const spiritStones = dungeon.rewards.spiritStones * times;
  const items: { itemId: string; quantity: number }[] = [];

  dungeon.rewards.drops.forEach(drop => {
    let totalQuantity = 0;
    for (let i = 0; i < times; i++) {
      if (Math.random() < drop.chance) {
        totalQuantity += drop.quantity;
      }
    }
    if (totalQuantity > 0) {
      items.push({ itemId: drop.itemId, quantity: totalQuantity });
    }
  });

  return { exp, spiritStones, items };
}
