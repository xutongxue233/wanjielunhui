import type { ItemQuality, Element, EquipmentSlot } from '../../types';

// 装备配方
export interface EquipmentRecipe {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  grade: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  element?: Element;

  // 材料需求
  materials: { itemId: string; quantity: number }[];

  // 制作要求
  requiredLevel: number;
  requiredForgeGrade: number;

  // 制作参数
  baseDuration: number;
  baseSuccessRate: number;

  // 装备属性
  baseStats: {
    attack?: number;
    defense?: number;
    hp?: number;
    mp?: number;
    speed?: number;
    critRate?: number;
    critDamage?: number;
  };

  // 可能的附加属性
  possibleBonuses: {
    attribute: string;
    minValue: number;
    maxValue: number;
    weight: number;
  }[];
}

// 锻造炉
export interface Forge {
  id: string;
  name: string;
  grade: number;
  durability: number;
  maxDurability: number;
  successRateBonus: number;
  qualityBonus: number;
}

// 锻造材料
export const CRAFTING_MATERIALS: Record<string, {
  id: string;
  name: string;
  description: string;
  rarity: ItemQuality;
  type: 'ore' | 'gem' | 'essence' | 'leather' | 'cloth' | 'bone';
}> = {
  iron_ore: {
    id: 'iron_ore',
    name: '铁矿石',
    description: '最基础的金属矿石',
    rarity: 'common',
    type: 'ore',
  },
  spirit_iron: {
    id: 'spirit_iron',
    name: '灵铁',
    description: '蕴含灵气的铁矿',
    rarity: 'uncommon',
    type: 'ore',
  },
  mithril: {
    id: 'mithril',
    name: '秘银',
    description: '轻盈而坚固的神秘金属',
    rarity: 'rare',
    type: 'ore',
  },
  star_iron: {
    id: 'star_iron',
    name: '陨铁',
    description: '从天而降的神秘金属',
    rarity: 'epic',
    type: 'ore',
  },
  divine_gold: {
    id: 'divine_gold',
    name: '神金',
    description: '传说中的神级金属',
    rarity: 'legendary',
    type: 'ore',
  },
  beast_leather: {
    id: 'beast_leather',
    name: '妖兽皮',
    description: '妖兽的皮革',
    rarity: 'common',
    type: 'leather',
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: '龙鳞',
    description: '真龙的鳞片',
    rarity: 'legendary',
    type: 'leather',
  },
  fire_gem: {
    id: 'fire_gem',
    name: '火晶石',
    description: '蕴含火焰之力的宝石',
    rarity: 'rare',
    type: 'gem',
  },
  ice_gem: {
    id: 'ice_gem',
    name: '寒冰石',
    description: '蕴含寒冰之力的宝石',
    rarity: 'rare',
    type: 'gem',
  },
  thunder_gem: {
    id: 'thunder_gem',
    name: '雷晶石',
    description: '蕴含雷电之力的宝石',
    rarity: 'epic',
    type: 'gem',
  },
};

// 装备配方
export const EQUIPMENT_RECIPES: Record<string, EquipmentRecipe> = {
  // 武器
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    description: '普通的铁制长剑',
    slot: 'weapon',
    grade: 'common',
    materials: [
      { itemId: 'iron_ore', quantity: 5 },
      { itemId: 'beast_leather', quantity: 2 },
    ],
    requiredLevel: 1,
    requiredForgeGrade: 1,
    baseDuration: 120,
    baseSuccessRate: 0.9,
    baseStats: { attack: 20 },
    possibleBonuses: [
      { attribute: 'attack', minValue: 5, maxValue: 15, weight: 50 },
      { attribute: 'critRate', minValue: 0.01, maxValue: 0.03, weight: 30 },
    ],
  },

  spirit_sword: {
    id: 'spirit_sword',
    name: '灵剑',
    description: '注入灵气的长剑',
    slot: 'weapon',
    grade: 'uncommon',
    materials: [
      { itemId: 'spirit_iron', quantity: 5 },
      { itemId: 'beast_leather', quantity: 3 },
      { itemId: 'spirit_stone', quantity: 5 },
    ],
    requiredLevel: 3,
    requiredForgeGrade: 2,
    baseDuration: 300,
    baseSuccessRate: 0.75,
    baseStats: { attack: 50, mp: 20 },
    possibleBonuses: [
      { attribute: 'attack', minValue: 10, maxValue: 30, weight: 40 },
      { attribute: 'mp', minValue: 10, maxValue: 30, weight: 30 },
      { attribute: 'critRate', minValue: 0.02, maxValue: 0.05, weight: 20 },
    ],
  },

  fire_blade: {
    id: 'fire_blade',
    name: '炎刃',
    description: '燃烧着烈焰的利刃',
    slot: 'weapon',
    grade: 'rare',
    element: 'fire',
    materials: [
      { itemId: 'mithril', quantity: 5 },
      { itemId: 'fire_gem', quantity: 2 },
      { itemId: 'fire_essence', quantity: 3 },
    ],
    requiredLevel: 8,
    requiredForgeGrade: 3,
    baseDuration: 600,
    baseSuccessRate: 0.5,
    baseStats: { attack: 120 },
    possibleBonuses: [
      { attribute: 'attack', minValue: 30, maxValue: 60, weight: 40 },
      { attribute: 'critDamage', minValue: 0.1, maxValue: 0.3, weight: 30 },
    ],
  },

  // 护甲
  leather_armor: {
    id: 'leather_armor',
    name: '皮甲',
    description: '基础防护装备',
    slot: 'armor',
    grade: 'common',
    materials: [
      { itemId: 'beast_leather', quantity: 8 },
    ],
    requiredLevel: 1,
    requiredForgeGrade: 1,
    baseDuration: 90,
    baseSuccessRate: 0.9,
    baseStats: { defense: 15, hp: 50 },
    possibleBonuses: [
      { attribute: 'defense', minValue: 5, maxValue: 10, weight: 50 },
      { attribute: 'hp', minValue: 20, maxValue: 50, weight: 40 },
    ],
  },

  spirit_robe: {
    id: 'spirit_robe',
    name: '灵纹道袍',
    description: '绣有灵纹的道袍',
    slot: 'armor',
    grade: 'uncommon',
    materials: [
      { itemId: 'spirit_silk', quantity: 5 },
      { itemId: 'spirit_iron', quantity: 2 },
      { itemId: 'spirit_stone', quantity: 3 },
    ],
    requiredLevel: 3,
    requiredForgeGrade: 2,
    baseDuration: 240,
    baseSuccessRate: 0.8,
    baseStats: { defense: 30, hp: 100, mp: 50 },
    possibleBonuses: [
      { attribute: 'defense', minValue: 10, maxValue: 25, weight: 40 },
      { attribute: 'hp', minValue: 30, maxValue: 80, weight: 30 },
      { attribute: 'mp', minValue: 20, maxValue: 50, weight: 30 },
    ],
  },

  // 饰品
  spirit_pendant: {
    id: 'spirit_pendant',
    name: '灵玉佩',
    description: '蕴含灵力的玉佩',
    slot: 'accessory',
    grade: 'uncommon',
    materials: [
      { itemId: 'jade', quantity: 3 },
      { itemId: 'spirit_stone', quantity: 5 },
    ],
    requiredLevel: 2,
    requiredForgeGrade: 1,
    baseDuration: 180,
    baseSuccessRate: 0.8,
    baseStats: { mp: 30 },
    possibleBonuses: [
      { attribute: 'mp', minValue: 10, maxValue: 30, weight: 50 },
      { attribute: 'critRate', minValue: 0.01, maxValue: 0.03, weight: 30 },
    ],
  },

  // 符箓
  fire_talisman: {
    id: 'fire_talisman',
    name: '火符',
    description: '蕴含火焰之力的符箓',
    slot: 'talisman',
    grade: 'rare',
    element: 'fire',
    materials: [
      { itemId: 'talisman_paper', quantity: 1 },
      { itemId: 'cinnabar', quantity: 2 },
      { itemId: 'fire_essence', quantity: 1 },
    ],
    requiredLevel: 5,
    requiredForgeGrade: 2,
    baseDuration: 120,
    baseSuccessRate: 0.6,
    baseStats: { attack: 30 },
    possibleBonuses: [
      { attribute: 'attack', minValue: 15, maxValue: 40, weight: 60 },
    ],
  },
};

// 锻造炉数据
export const FORGES: Record<string, Forge> = {
  basic_forge: {
    id: 'basic_forge',
    name: '简易锻造炉',
    grade: 1,
    durability: 100,
    maxDurability: 100,
    successRateBonus: 0,
    qualityBonus: 0,
  },
  spirit_forge: {
    id: 'spirit_forge',
    name: '灵纹锻造炉',
    grade: 3,
    durability: 300,
    maxDurability: 300,
    successRateBonus: 0.1,
    qualityBonus: 0.1,
  },
  heavenly_forge: {
    id: 'heavenly_forge',
    name: '天火神炉',
    grade: 6,
    durability: 1000,
    maxDurability: 1000,
    successRateBonus: 0.25,
    qualityBonus: 0.2,
  },
};

// 计算附加属性
export function generateBonusStats(recipe: EquipmentRecipe, qualityBonus: number): Record<string, number> {
  const bonusStats: Record<string, number> = {};
  const numBonuses = Math.floor(Math.random() * 3) + 1 + Math.floor(qualityBonus * 2);

  for (let i = 0; i < numBonuses && i < recipe.possibleBonuses.length; i++) {
    const bonus = recipe.possibleBonuses[i];
    const value = bonus.minValue + Math.random() * (bonus.maxValue - bonus.minValue);
    bonusStats[bonus.attribute] = (bonusStats[bonus.attribute] || 0) + value;
  }

  return bonusStats;
}
