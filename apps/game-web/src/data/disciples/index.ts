import type { Element, SpiritualRoot, Realm } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// 弟子数据结构
export interface Disciple {
  id: string;
  name: string;
  gender: 'male' | 'female';
  portrait: string;

  // 资质
  talent: DiscipleTalent;
  spiritualRoot: SpiritualRoot;

  // 境界与属性
  realm: Realm;
  level: number;
  exp: number;
  expToNext: number;

  // 战斗属性
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;

  // 关系
  loyalty: number;        // 忠诚度 0-100
  relationship: number;   // 好感度 0-100
  mood: number;           // 心情 0-100

  // 技能
  skills: string[];

  // 状态
  status: 'idle' | 'training' | 'expedition' | 'injured';
  currentTask: string | null;
  taskEndTime: number;

  // 来源
  source: 'recruitment' | 'story' | 'rescue' | 'legacy';
  joinedAt: number;
}

// 弟子天赋
export interface DiscipleTalent {
  cultivation: number;    // 修炼天赋 1-100
  combat: number;         // 战斗天赋 1-100
  alchemy: number;        // 炼丹天赋 1-100
  crafting: number;       // 炼器天赋 1-100
  comprehension: number;  // 悟性 1-100
}

// 派遣任务
export interface Expedition {
  id: string;
  name: string;
  description: string;
  type: 'gather' | 'explore' | 'hunt' | 'trade' | 'special';

  // 要求
  minLevel: number;
  minDiscipleCount: number;
  maxDiscipleCount: number;
  requiredTalent?: keyof DiscipleTalent;
  minTalentValue?: number;

  // 时间与奖励
  duration: number;       // 秒
  baseRewards: ExpeditionReward[];
  bonusRewards: ExpeditionReward[];

  // 风险
  dangerLevel: number;    // 1-5
  injuryChance: number;   // 受伤概率
}

export interface ExpeditionReward {
  type: 'item' | 'exp' | 'spirit_stone' | 'recipe' | 'technique';
  itemId?: string;
  quantity: number;
  chance: number;
}

// 弟子名字池
const MALE_NAMES = [
  '云逸', '天行', '玄清', '凌霄', '墨尘', '青云', '风临', '剑心',
  '无涯', '苍穹', '玄武', '白虎', '朱雀', '青龙', '紫霄', '太虚',
];

const FEMALE_NAMES = [
  '若雪', '紫烟', '清荷', '凌波', '月华', '素心', '冰凝', '梦蝶',
  '云裳', '玉萱', '雨薇', '静姝', '婉清', '灵犀', '碧落', '瑶琴',
];

// 生成随机弟子
export function generateRandomDisciple(level: number = 1): Disciple {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const names = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;
  const name = names[Math.floor(Math.random() * names.length)];

  // 生成天赋
  const talent: DiscipleTalent = {
    cultivation: Math.floor(Math.random() * 60) + 20,
    combat: Math.floor(Math.random() * 60) + 20,
    alchemy: Math.floor(Math.random() * 60) + 20,
    crafting: Math.floor(Math.random() * 60) + 20,
    comprehension: Math.floor(Math.random() * 60) + 20,
  };

  // 生成灵根
  const elements: Element[] = ['metal', 'wood', 'water', 'fire', 'earth'];
  const rootElements = elements.filter(() => Math.random() > 0.5);
  if (rootElements.length === 0) {
    rootElements.push(elements[Math.floor(Math.random() * elements.length)]);
  }

  const spiritualRoot: SpiritualRoot = {
    elements: rootElements,
    quality: Math.random() > 0.9 ? 'heavenly' : Math.random() > 0.6 ? 'excellent' : 'ordinary',
    purity: Math.floor(Math.random() * 50) + 30,
  };

  // 基础属性
  const baseHp = 50 + level * 20 + talent.combat;
  const baseAttack = 5 + level * 3 + Math.floor(talent.combat / 10);
  const baseDefense = 3 + level * 2 + Math.floor(talent.combat / 15);
  const baseSpeed = 5 + level + Math.floor(talent.combat / 20);

  return {
    id: uuidv4(),
    name,
    gender,
    portrait: `disciple_${gender}_${Math.floor(Math.random() * 5) + 1}`,

    talent,
    spiritualRoot,

    realm: { name: 'lianqi', stage: 'early', displayName: '炼气初期', level: 1 },
    level,
    exp: 0,
    expToNext: 100 * level,

    hp: baseHp,
    maxHp: baseHp,
    attack: baseAttack,
    defense: baseDefense,
    speed: baseSpeed,

    loyalty: 50 + Math.floor(Math.random() * 30),
    relationship: 30 + Math.floor(Math.random() * 20),
    mood: 60 + Math.floor(Math.random() * 30),

    skills: [],

    status: 'idle',
    currentTask: null,
    taskEndTime: 0,

    source: 'recruitment',
    joinedAt: Date.now(),
  };
}

// 派遣任务数据
export const EXPEDITIONS: Record<string, Expedition> = {
  gather_herbs: {
    id: 'gather_herbs',
    name: '采集灵草',
    description: '前往山林采集炼丹所需的灵草',
    type: 'gather',
    minLevel: 1,
    minDiscipleCount: 1,
    maxDiscipleCount: 3,
    duration: 3600,
    baseRewards: [
      { type: 'item', itemId: 'spirit_grass', quantity: 5, chance: 1.0 },
      { type: 'exp', quantity: 50, chance: 1.0 },
    ],
    bonusRewards: [
      { type: 'item', itemId: 'blood_ginseng', quantity: 1, chance: 0.2 },
      { type: 'item', itemId: 'blue_lotus', quantity: 1, chance: 0.15 },
    ],
    dangerLevel: 1,
    injuryChance: 0.05,
  },

  mine_ore: {
    id: 'mine_ore',
    name: '开采矿石',
    description: '前往矿洞开采炼器所需的矿石',
    type: 'gather',
    minLevel: 2,
    minDiscipleCount: 2,
    maxDiscipleCount: 4,
    duration: 7200,
    baseRewards: [
      { type: 'item', itemId: 'iron_ore', quantity: 10, chance: 1.0 },
      { type: 'spirit_stone', quantity: 20, chance: 1.0 },
      { type: 'exp', quantity: 80, chance: 1.0 },
    ],
    bonusRewards: [
      { type: 'item', itemId: 'spirit_iron', quantity: 2, chance: 0.25 },
      { type: 'item', itemId: 'mithril', quantity: 1, chance: 0.05 },
    ],
    dangerLevel: 2,
    injuryChance: 0.1,
  },

  explore_ruins: {
    id: 'explore_ruins',
    name: '探索遗迹',
    description: '探索上古修士遗留的遗迹',
    type: 'explore',
    minLevel: 5,
    minDiscipleCount: 3,
    maxDiscipleCount: 5,
    duration: 14400,
    baseRewards: [
      { type: 'spirit_stone', quantity: 100, chance: 1.0 },
      { type: 'exp', quantity: 200, chance: 1.0 },
    ],
    bonusRewards: [
      { type: 'recipe', itemId: 'random_recipe', quantity: 1, chance: 0.1 },
      { type: 'technique', itemId: 'random_technique', quantity: 1, chance: 0.05 },
      { type: 'item', itemId: 'ancient_artifact', quantity: 1, chance: 0.08 },
    ],
    dangerLevel: 3,
    injuryChance: 0.2,
  },

  hunt_beasts: {
    id: 'hunt_beasts',
    name: '狩猎妖兽',
    description: '猎杀妖兽获取材料',
    type: 'hunt',
    minLevel: 3,
    minDiscipleCount: 2,
    maxDiscipleCount: 4,
    requiredTalent: 'combat',
    minTalentValue: 40,
    duration: 10800,
    baseRewards: [
      { type: 'item', itemId: 'beast_leather', quantity: 5, chance: 1.0 },
      { type: 'item', itemId: 'beast_blood', quantity: 3, chance: 1.0 },
      { type: 'exp', quantity: 150, chance: 1.0 },
    ],
    bonusRewards: [
      { type: 'item', itemId: 'beast_core', quantity: 1, chance: 0.3 },
      { type: 'item', itemId: 'rare_material', quantity: 1, chance: 0.1 },
    ],
    dangerLevel: 3,
    injuryChance: 0.25,
  },

  secret_realm: {
    id: 'secret_realm',
    name: '秘境探险',
    description: '进入神秘秘境寻宝',
    type: 'special',
    minLevel: 10,
    minDiscipleCount: 3,
    maxDiscipleCount: 5,
    duration: 28800,
    baseRewards: [
      { type: 'spirit_stone', quantity: 500, chance: 1.0 },
      { type: 'exp', quantity: 500, chance: 1.0 },
    ],
    bonusRewards: [
      { type: 'item', itemId: 'secret_realm_treasure', quantity: 1, chance: 0.5 },
      { type: 'technique', itemId: 'rare_technique', quantity: 1, chance: 0.1 },
      { type: 'item', itemId: 'legendary_material', quantity: 1, chance: 0.05 },
    ],
    dangerLevel: 5,
    injuryChance: 0.4,
  },
};

// 计算派遣成功率
export function calculateExpeditionSuccess(
  expedition: Expedition,
  disciples: Disciple[]
): number {
  if (disciples.length < expedition.minDiscipleCount) return 0;

  let baseRate = 0.7;

  // 等级加成
  const avgLevel = disciples.reduce((sum, d) => sum + d.level, 0) / disciples.length;
  const levelBonus = (avgLevel - expedition.minLevel) * 0.03;
  baseRate += Math.max(0, levelBonus);

  // 天赋加成
  if (expedition.requiredTalent) {
    const avgTalent = disciples.reduce(
      (sum, d) => sum + d.talent[expedition.requiredTalent!], 0
    ) / disciples.length;
    baseRate += avgTalent * 0.003;
  }

  // 人数加成
  const countBonus = (disciples.length - expedition.minDiscipleCount) * 0.05;
  baseRate += countBonus;

  // 心情影响
  const avgMood = disciples.reduce((sum, d) => sum + d.mood, 0) / disciples.length;
  baseRate *= (0.5 + avgMood / 200);

  return Math.min(0.95, Math.max(0.1, baseRate));
}

// 计算派遣奖励
export function calculateExpeditionRewards(
  expedition: Expedition,
  disciples: Disciple[],
  success: boolean
): ExpeditionReward[] {
  if (!success) {
    // 失败只获得少量经验
    return [{ type: 'exp', quantity: Math.floor(expedition.baseRewards.find(r => r.type === 'exp')?.quantity || 0) * 0.3, chance: 1 }];
  }

  const rewards: ExpeditionReward[] = [...expedition.baseRewards];

  // 检查额外奖励
  expedition.bonusRewards.forEach(bonus => {
    if (Math.random() < bonus.chance) {
      rewards.push(bonus);
    }
  });

  // 天赋加成奖励数量
  const avgTalent = disciples.reduce((sum, d) => sum + d.talent.comprehension, 0) / disciples.length;
  const bonusMultiplier = 1 + avgTalent / 200;

  return rewards.map(r => ({
    ...r,
    quantity: Math.floor(r.quantity * bonusMultiplier),
  }));
}
