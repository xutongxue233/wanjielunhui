import type { ItemQuality, Element } from '../../types';

// 丹药配方
export interface PillRecipe {
  id: string;
  name: string;
  description: string;
  grade: 'low' | 'medium' | 'high' | 'supreme' | 'immortal';
  element: Element | 'neutral';

  // 材料需求
  materials: { itemId: string; quantity: number }[];

  // 制作要求
  requiredLevel: number;          // 炼丹等级要求
  requiredFurnaceGrade: number;   // 丹炉品级要求

  // 制作参数
  baseDuration: number;           // 基础炼制时间(秒)
  baseSuccessRate: number;        // 基础成功率
  baseOutput: number;             // 基础产出数量

  // 丹药效果
  effects: PillEffect[];
}

export interface PillEffect {
  type: 'heal_hp' | 'heal_mp' | 'buff_attack' | 'buff_defense' | 'buff_speed' |
        'add_cultivation' | 'breakthrough_bonus' | 'extend_lifespan' | 'purify_root';
  value: number;
  duration?: number;  // 持续时间(秒)，0表示永久
}

// 丹药实例
export interface Pill {
  id: string;
  recipeId: string;
  name: string;
  quality: 'low' | 'medium' | 'high' | 'perfect' | 'transcendent';
  effects: PillEffect[];
  qualityMultiplier: number;
}

// 丹炉
export interface Furnace {
  id: string;
  name: string;
  grade: number;                  // 品级 1-9
  durability: number;
  maxDurability: number;
  successRateBonus: number;       // 成功率加成
  qualityBonus: number;           // 品质加成
  speedBonus: number;             // 速度加成
}

// 炼丹状态
export interface AlchemyState {
  isRefining: boolean;
  currentRecipeId: string | null;
  progress: number;               // 0-100
  startTime: number;
  endTime: number;
}

// 丹药配方数据
export const PILL_RECIPES: Record<string, PillRecipe> = {
  // 低级丹药
  qi_gathering_pill: {
    id: 'qi_gathering_pill',
    name: '聚气丹',
    description: '凝聚天地灵气，加速修炼',
    grade: 'low',
    element: 'neutral',
    materials: [
      { itemId: 'spirit_grass', quantity: 3 },
      { itemId: 'morning_dew', quantity: 2 },
    ],
    requiredLevel: 1,
    requiredFurnaceGrade: 1,
    baseDuration: 60,
    baseSuccessRate: 0.8,
    baseOutput: 3,
    effects: [
      { type: 'add_cultivation', value: 100 },
    ],
  },

  healing_pill: {
    id: 'healing_pill',
    name: '疗伤丹',
    description: '治愈伤势，恢复气血',
    grade: 'low',
    element: 'wood',
    materials: [
      { itemId: 'blood_ginseng', quantity: 2 },
      { itemId: 'spirit_grass', quantity: 2 },
    ],
    requiredLevel: 1,
    requiredFurnaceGrade: 1,
    baseDuration: 45,
    baseSuccessRate: 0.85,
    baseOutput: 5,
    effects: [
      { type: 'heal_hp', value: 200 },
    ],
  },

  spirit_recovery_pill: {
    id: 'spirit_recovery_pill',
    name: '回灵丹',
    description: '恢复法力',
    grade: 'low',
    element: 'water',
    materials: [
      { itemId: 'blue_lotus', quantity: 2 },
      { itemId: 'spirit_water', quantity: 1 },
    ],
    requiredLevel: 2,
    requiredFurnaceGrade: 1,
    baseDuration: 50,
    baseSuccessRate: 0.8,
    baseOutput: 4,
    effects: [
      { type: 'heal_mp', value: 150 },
    ],
  },

  // 中级丹药
  foundation_pill: {
    id: 'foundation_pill',
    name: '筑基丹',
    description: '稳固根基，突破必备',
    grade: 'medium',
    element: 'earth',
    materials: [
      { itemId: 'earth_essence', quantity: 3 },
      { itemId: 'century_ginseng', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 10 },
    ],
    requiredLevel: 5,
    requiredFurnaceGrade: 2,
    baseDuration: 300,
    baseSuccessRate: 0.5,
    baseOutput: 1,
    effects: [
      { type: 'breakthrough_bonus', value: 0.2 },
    ],
  },

  power_pill: {
    id: 'power_pill',
    name: '蛮力丹',
    description: '临时大幅提升攻击力',
    grade: 'medium',
    element: 'fire',
    materials: [
      { itemId: 'fire_essence', quantity: 2 },
      { itemId: 'tiger_bone', quantity: 1 },
      { itemId: 'beast_blood', quantity: 3 },
    ],
    requiredLevel: 4,
    requiredFurnaceGrade: 2,
    baseDuration: 180,
    baseSuccessRate: 0.6,
    baseOutput: 2,
    effects: [
      { type: 'buff_attack', value: 50, duration: 300 },
    ],
  },

  // 高级丹药
  golden_core_pill: {
    id: 'golden_core_pill',
    name: '金丹',
    description: '凝结金丹的辅助圣药',
    grade: 'high',
    element: 'metal',
    materials: [
      { itemId: 'golden_essence', quantity: 5 },
      { itemId: 'thousand_year_ginseng', quantity: 1 },
      { itemId: 'dragon_blood', quantity: 1 },
      { itemId: 'high_spirit_stone', quantity: 5 },
    ],
    requiredLevel: 10,
    requiredFurnaceGrade: 4,
    baseDuration: 1800,
    baseSuccessRate: 0.3,
    baseOutput: 1,
    effects: [
      { type: 'breakthrough_bonus', value: 0.5 },
      { type: 'add_cultivation', value: 10000 },
    ],
  },

  longevity_pill: {
    id: 'longevity_pill',
    name: '驻颜丹',
    description: '延长寿元',
    grade: 'high',
    element: 'wood',
    materials: [
      { itemId: 'life_fruit', quantity: 1 },
      { itemId: 'thousand_year_ginseng', quantity: 2 },
      { itemId: 'phoenix_feather', quantity: 1 },
    ],
    requiredLevel: 12,
    requiredFurnaceGrade: 5,
    baseDuration: 3600,
    baseSuccessRate: 0.2,
    baseOutput: 1,
    effects: [
      { type: 'extend_lifespan', value: 100 },
    ],
  },

  // 至尊丹药
  root_cleansing_pill: {
    id: 'root_cleansing_pill',
    name: '洗髓丹',
    description: '净化灵根，提升资质',
    grade: 'supreme',
    element: 'neutral',
    materials: [
      { itemId: 'chaos_essence', quantity: 1 },
      { itemId: 'nine_leaf_clover', quantity: 1 },
      { itemId: 'immortal_spring_water', quantity: 1 },
      { itemId: 'supreme_spirit_stone', quantity: 10 },
    ],
    requiredLevel: 20,
    requiredFurnaceGrade: 7,
    baseDuration: 7200,
    baseSuccessRate: 0.1,
    baseOutput: 1,
    effects: [
      { type: 'purify_root', value: 10 },
    ],
  },

  // 中高级丹药配方
  jindan_recovery_pill: {
    id: 'jindan_recovery_pill',
    name: '金丹恢复丹',
    description: '金丹期修士专用的恢复丹药',
    grade: 'medium',
    element: 'wood',
    materials: [
      { itemId: 'blood_ginseng', quantity: 3 },
      { itemId: 'golden_essence', quantity: 1 },
      { itemId: 'spirit_grass', quantity: 5 },
    ],
    requiredLevel: 6,
    requiredFurnaceGrade: 3,
    baseDuration: 300,
    baseSuccessRate: 0.6,
    baseOutput: 3,
    effects: [
      { type: 'heal_hp', value: 2000 },
    ],
  },

  yuanying_recovery_pill: {
    id: 'yuanying_recovery_pill',
    name: '元婴恢复丹',
    description: '元婴期修士专用的恢复丹药',
    grade: 'high',
    element: 'wood',
    materials: [
      { itemId: 'thousand_year_ginseng', quantity: 1 },
      { itemId: 'blood_ginseng', quantity: 5 },
      { itemId: 'spirit_water', quantity: 3 },
    ],
    requiredLevel: 10,
    requiredFurnaceGrade: 4,
    baseDuration: 600,
    baseSuccessRate: 0.4,
    baseOutput: 2,
    effects: [
      { type: 'heal_hp', value: 5000 },
    ],
  },

  huashen_recovery_pill: {
    id: 'huashen_recovery_pill',
    name: '化神恢复丹',
    description: '化神期修士专用的恢复丹药，蕴含浑厚生命力',
    grade: 'high',
    element: 'wood',
    materials: [
      { itemId: 'thousand_year_ginseng', quantity: 2 },
      { itemId: 'life_fruit', quantity: 1 },
      { itemId: 'earth_essence', quantity: 3 },
    ],
    requiredLevel: 14,
    requiredFurnaceGrade: 5,
    baseDuration: 1200,
    baseSuccessRate: 0.3,
    baseOutput: 2,
    effects: [
      { type: 'heal_hp', value: 15000 },
    ],
  },

  yuanying_breakthrough_pill: {
    id: 'yuanying_breakthrough_pill',
    name: '元婴丹',
    description: '辅助元婴突破的珍贵丹药',
    grade: 'high',
    element: 'neutral',
    materials: [
      { itemId: 'golden_essence', quantity: 3 },
      { itemId: 'dragon_blood', quantity: 1 },
      { itemId: 'thousand_year_ginseng', quantity: 2 },
    ],
    requiredLevel: 12,
    requiredFurnaceGrade: 5,
    baseDuration: 2400,
    baseSuccessRate: 0.25,
    baseOutput: 1,
    effects: [
      { type: 'breakthrough_bonus', value: 0.3 },
      { type: 'add_cultivation', value: 5000 },
    ],
  },

  huashen_breakthrough_pill: {
    id: 'huashen_breakthrough_pill',
    name: '化神丹',
    description: '辅助化神期突破的极品丹药',
    grade: 'supreme',
    element: 'fire',
    materials: [
      { itemId: 'phoenix_feather', quantity: 1 },
      { itemId: 'golden_essence', quantity: 5 },
      { itemId: 'dragon_blood', quantity: 2 },
    ],
    requiredLevel: 16,
    requiredFurnaceGrade: 6,
    baseDuration: 3600,
    baseSuccessRate: 0.15,
    baseOutput: 1,
    effects: [
      { type: 'breakthrough_bonus', value: 0.4 },
      { type: 'add_cultivation', value: 20000 },
    ],
  },

  heti_breakthrough_pill: {
    id: 'heti_breakthrough_pill',
    name: '合体丹',
    description: '辅助合体期突破的仙品丹药',
    grade: 'supreme',
    element: 'neutral',
    materials: [
      { itemId: 'chaos_essence', quantity: 1 },
      { itemId: 'dragon_blood', quantity: 3 },
      { itemId: 'phoenix_feather', quantity: 2 },
    ],
    requiredLevel: 20,
    requiredFurnaceGrade: 7,
    baseDuration: 5400,
    baseSuccessRate: 0.1,
    baseOutput: 1,
    effects: [
      { type: 'breakthrough_bonus', value: 0.5 },
      { type: 'add_cultivation', value: 80000 },
    ],
  },

  medium_juyuan_pill: {
    id: 'medium_juyuan_pill',
    name: '中品聚元丹',
    description: '蕴含浓郁灵气，大幅增加修为',
    grade: 'medium',
    element: 'neutral',
    materials: [
      { itemId: 'earth_essence', quantity: 2 },
      { itemId: 'spirit_grass', quantity: 5 },
      { itemId: 'century_ginseng', quantity: 1 },
    ],
    requiredLevel: 8,
    requiredFurnaceGrade: 3,
    baseDuration: 240,
    baseSuccessRate: 0.55,
    baseOutput: 2,
    effects: [
      { type: 'add_cultivation', value: 5000 },
    ],
  },

  high_juyuan_pill: {
    id: 'high_juyuan_pill',
    name: '上品聚元丹',
    description: '蕴含磅礴灵气，极大增加修为',
    grade: 'high',
    element: 'neutral',
    materials: [
      { itemId: 'golden_essence', quantity: 3 },
      { itemId: 'thousand_year_ginseng', quantity: 1 },
      { itemId: 'earth_essence', quantity: 5 },
    ],
    requiredLevel: 14,
    requiredFurnaceGrade: 5,
    baseDuration: 1200,
    baseSuccessRate: 0.3,
    baseOutput: 1,
    effects: [
      { type: 'add_cultivation', value: 50000 },
    ],
  },

  defense_supreme_pill: {
    id: 'defense_supreme_pill',
    name: '金刚丹',
    description: '大幅提升防御力的高级丹药',
    grade: 'high',
    element: 'earth',
    materials: [
      { itemId: 'earth_essence', quantity: 5 },
      { itemId: 'golden_essence', quantity: 2 },
      { itemId: 'tiger_bone', quantity: 3 },
    ],
    requiredLevel: 10,
    requiredFurnaceGrade: 4,
    baseDuration: 600,
    baseSuccessRate: 0.4,
    baseOutput: 2,
    effects: [
      { type: 'buff_defense', value: 100, duration: 600 },
    ],
  },

  speed_supreme_pill: {
    id: 'speed_supreme_pill',
    name: '疾风丹',
    description: '大幅提升速度的高级丹药',
    grade: 'high',
    element: 'wood',
    materials: [
      { itemId: 'century_ginseng', quantity: 2 },
      { itemId: 'blue_lotus', quantity: 5 },
      { itemId: 'beast_blood', quantity: 3 },
    ],
    requiredLevel: 10,
    requiredFurnaceGrade: 4,
    baseDuration: 600,
    baseSuccessRate: 0.4,
    baseOutput: 2,
    effects: [
      { type: 'buff_speed', value: 50, duration: 600 },
    ],
  },
};

// 材料数据
export const ALCHEMY_MATERIALS: Record<string, {
  id: string;
  name: string;
  description: string;
  rarity: ItemQuality;
  element?: Element;
}> = {
  spirit_grass: {
    id: 'spirit_grass',
    name: '灵草',
    description: '最基础的炼丹材料',
    rarity: 'common',
  },
  morning_dew: {
    id: 'morning_dew',
    name: '晨露',
    description: '清晨第一缕阳光下的露水',
    rarity: 'common',
  },
  blood_ginseng: {
    id: 'blood_ginseng',
    name: '血参',
    description: '带有血红色纹路的人参',
    rarity: 'uncommon',
    element: 'wood',
  },
  blue_lotus: {
    id: 'blue_lotus',
    name: '青莲',
    description: '生长在灵泉中的莲花',
    rarity: 'uncommon',
    element: 'water',
  },
  spirit_water: {
    id: 'spirit_water',
    name: '灵泉水',
    description: '富含灵气的泉水',
    rarity: 'common',
    element: 'water',
  },
  earth_essence: {
    id: 'earth_essence',
    name: '地髓精华',
    description: '大地深处凝结的精华',
    rarity: 'rare',
    element: 'earth',
  },
  century_ginseng: {
    id: 'century_ginseng',
    name: '百年人参',
    description: '生长百年的灵参',
    rarity: 'rare',
    element: 'wood',
  },
  fire_essence: {
    id: 'fire_essence',
    name: '火髓',
    description: '地火凝结的精华',
    rarity: 'rare',
    element: 'fire',
  },
  tiger_bone: {
    id: 'tiger_bone',
    name: '妖虎骨',
    description: '妖虎的骨骼',
    rarity: 'uncommon',
  },
  beast_blood: {
    id: 'beast_blood',
    name: '妖兽血',
    description: '妖兽的血液',
    rarity: 'common',
  },
  golden_essence: {
    id: 'golden_essence',
    name: '金精',
    description: '金属性的极致精华',
    rarity: 'epic',
    element: 'metal',
  },
  thousand_year_ginseng: {
    id: 'thousand_year_ginseng',
    name: '千年人参',
    description: '生长千年的神级灵参',
    rarity: 'epic',
    element: 'wood',
  },
  dragon_blood: {
    id: 'dragon_blood',
    name: '龙血',
    description: '真龙的血液',
    rarity: 'legendary',
  },
  life_fruit: {
    id: 'life_fruit',
    name: '生命之果',
    description: '蕴含生命本源的神果',
    rarity: 'legendary',
    element: 'wood',
  },
  phoenix_feather: {
    id: 'phoenix_feather',
    name: '凤凰羽',
    description: '凤凰脱落的羽毛',
    rarity: 'legendary',
    element: 'fire',
  },
  chaos_essence: {
    id: 'chaos_essence',
    name: '混沌精华',
    description: '混沌之力的结晶',
    rarity: 'mythic',
  },
  nine_leaf_clover: {
    id: 'nine_leaf_clover',
    name: '九叶仙草',
    description: '传说中的仙草',
    rarity: 'mythic',
  },
  immortal_spring_water: {
    id: 'immortal_spring_water',
    name: '仙泉水',
    description: '仙界流落的泉水',
    rarity: 'mythic',
    element: 'water',
  },
};

// 丹炉数据
export const FURNACES: Record<string, Furnace> = {
  basic_furnace: {
    id: 'basic_furnace',
    name: '铁制丹炉',
    grade: 1,
    durability: 100,
    maxDurability: 100,
    successRateBonus: 0,
    qualityBonus: 0,
    speedBonus: 0,
  },
  bronze_furnace: {
    id: 'bronze_furnace',
    name: '青铜丹炉',
    grade: 2,
    durability: 200,
    maxDurability: 200,
    successRateBonus: 0.05,
    qualityBonus: 0.05,
    speedBonus: 0.1,
  },
  spirit_furnace: {
    id: 'spirit_furnace',
    name: '灵纹丹炉',
    grade: 3,
    durability: 500,
    maxDurability: 500,
    successRateBonus: 0.1,
    qualityBonus: 0.1,
    speedBonus: 0.2,
  },
  earth_fire_furnace: {
    id: 'earth_fire_furnace',
    name: '地火丹炉',
    grade: 5,
    durability: 1000,
    maxDurability: 1000,
    successRateBonus: 0.2,
    qualityBonus: 0.15,
    speedBonus: 0.3,
  },
  nine_dragon_furnace: {
    id: 'nine_dragon_furnace',
    name: '九龙神炉',
    grade: 8,
    durability: 5000,
    maxDurability: 5000,
    successRateBonus: 0.4,
    qualityBonus: 0.3,
    speedBonus: 0.5,
  },
};

// 计算炼丹成功率
export function calculateSuccessRate(
  recipe: PillRecipe,
  furnace: Furnace,
  alchemyLevel: number,
  comprehension: number
): number {
  let rate = recipe.baseSuccessRate;

  // 丹炉加成
  rate += furnace.successRateBonus;

  // 等级加成
  const levelBonus = (alchemyLevel - recipe.requiredLevel) * 0.02;
  rate += Math.max(0, levelBonus);

  // 悟性加成
  rate += comprehension * 0.002;

  return Math.min(0.95, Math.max(0.05, rate));
}

// 计算丹药品质
// baseChance越高，获得高品质丹药的概率越大
export function calculatePillQuality(
  _recipe: PillRecipe,
  furnace: Furnace,
  alchemyLevel: number,
  luck: number
): Pill['quality'] {
  const baseChance = Math.min(0.95, 0.5 + furnace.qualityBonus + (alchemyLevel * 0.02) + (luck * 0.005));
  const roll = Math.random();

  // threshold越低，高品质区间越大
  const threshold = 1 - baseChance;
  if (roll < threshold * 0.3) return 'low';
  if (roll < threshold * 0.6) return 'medium';
  if (roll < threshold + (1 - threshold) * 0.4) return 'high';
  if (roll < threshold + (1 - threshold) * 0.7) return 'perfect';
  return 'transcendent';
}

// 品质倍率
export const QUALITY_MULTIPLIERS: Record<Pill['quality'], number> = {
  low: 0.7,
  medium: 1.0,
  high: 1.3,
  perfect: 1.6,
  transcendent: 2.0,
};
