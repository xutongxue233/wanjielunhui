/**
 * 装备数据定义
 * 包含武器、防具、饰品等
 */

import type { ItemQuality } from './items';

// 装备部位
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'accessory' | 'boots';

// 境界要求
export type RealmRequirement =
  | 'none'
  | 'lianqi'    // 练气期
  | 'zhuji'     // 筑基期
  | 'jindan'    // 金丹期
  | 'yuanying'  // 元婴期
  | 'huashen';  // 化神期

// 装备属性加成
export interface EquipmentStats {
  attack?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  speed?: number;
  critRate?: number;      // 百分比
  critDamage?: number;    // 百分比
  spiritualPower?: number;
}

// 装备定义接口
export interface EquipmentDefinition {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  quality: ItemQuality;
  level: number;
  realmRequirement: RealmRequirement;
  baseStats: EquipmentStats;
  maxEnhanceLevel: number;
  enhanceStatsPerLevel: EquipmentStats;
  sellPrice: number;
  icon?: string;
  setId?: string;  // 套装ID
}

// ==================== 武器 ====================

export const WEAPONS: Record<string, EquipmentDefinition> = {
  wooden_sword: {
    id: 'wooden_sword',
    name: '木剑',
    description: '练习用的木制剑，虽然简陋但胜在轻便',
    slot: 'weapon',
    quality: 'common',
    level: 1,
    realmRequirement: 'none',
    baseStats: { attack: 10 },
    maxEnhanceLevel: 5,
    enhanceStatsPerLevel: { attack: 2 },
    sellPrice: 10,
  },
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    description: '普通的铁制长剑，坚固耐用',
    slot: 'weapon',
    quality: 'uncommon',
    level: 5,
    realmRequirement: 'lianqi',
    baseStats: { attack: 25, speed: 3 },
    maxEnhanceLevel: 10,
    enhanceStatsPerLevel: { attack: 4 },
    sellPrice: 50,
  },
  qingfeng_sword: {
    id: 'qingfeng_sword',
    name: '清风剑',
    description: '青云宗制式法剑，灌注有清风之力，挥舞时带起阵阵微风',
    slot: 'weapon',
    quality: 'rare',
    level: 10,
    realmRequirement: 'zhuji',
    baseStats: { attack: 50, speed: 10, critRate: 3 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { attack: 6, speed: 1 },
    sellPrice: 200,
  },
  xuantie_blade: {
    id: 'xuantie_blade',
    name: '玄铁刀',
    description: '以玄铁锻造的重刀，威力惊人',
    slot: 'weapon',
    quality: 'rare',
    level: 15,
    realmRequirement: 'zhuji',
    baseStats: { attack: 70, critDamage: 15 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { attack: 8 },
    sellPrice: 300,
  },
  demon_blade: {
    id: 'demon_blade',
    name: '噬魂刃',
    description: '以妖兽精魂锻造的邪器，攻击时有概率吸取敌人生命',
    slot: 'weapon',
    quality: 'epic',
    level: 25,
    realmRequirement: 'jindan',
    baseStats: { attack: 120, critRate: 8, critDamage: 25 },
    maxEnhanceLevel: 20,
    enhanceStatsPerLevel: { attack: 12, critRate: 0.5 },
    sellPrice: 800,
  },
  azure_spirit_sword: {
    id: 'azure_spirit_sword',
    name: '青灵剑',
    description: '蕴含青木之气的灵剑，与使用者心意相通',
    slot: 'weapon',
    quality: 'epic',
    level: 30,
    realmRequirement: 'jindan',
    baseStats: { attack: 100, spiritualPower: 30, mp: 100 },
    maxEnhanceLevel: 20,
    enhanceStatsPerLevel: { attack: 10, spiritualPower: 3 },
    sellPrice: 1000,
  },
  yuanying_soul_sword: {
    id: 'yuanying_soul_sword',
    name: '元婴魂剑',
    description: '以元婴之力淬炼的神兵，剑身环绕元神之力，挥动间可斩裂虚空',
    slot: 'weapon',
    quality: 'epic',
    level: 40,
    realmRequirement: 'yuanying',
    baseStats: { attack: 200, critRate: 10, critDamage: 30, spiritualPower: 40 },
    maxEnhanceLevel: 25,
    enhanceStatsPerLevel: { attack: 18, critRate: 0.8 },
    sellPrice: 2500,
  },
  huashen_void_blade: {
    id: 'huashen_void_blade',
    name: '虚空裂天刃',
    description: '以化神期强者的法则之力锻造，可斩断天地法则，威力无穷',
    slot: 'weapon',
    quality: 'legendary',
    level: 55,
    realmRequirement: 'huashen',
    baseStats: { attack: 400, critRate: 15, critDamage: 50, spiritualPower: 60 },
    maxEnhanceLevel: 30,
    enhanceStatsPerLevel: { attack: 30, critRate: 1, critDamage: 3 },
    sellPrice: 6000,
  },
};

// ==================== 防具 ====================

export const ARMORS: Record<string, EquipmentDefinition> = {
  cloth_robe: {
    id: 'cloth_robe',
    name: '布衣',
    description: '普通的棉布衣服，聊胜于无',
    slot: 'armor',
    quality: 'common',
    level: 1,
    realmRequirement: 'none',
    baseStats: { defense: 5, hp: 50 },
    maxEnhanceLevel: 5,
    enhanceStatsPerLevel: { defense: 1, hp: 10 },
    sellPrice: 8,
  },
  leather_armor: {
    id: 'leather_armor',
    name: '皮甲',
    description: '兽皮制成的轻甲，提供基础防护',
    slot: 'armor',
    quality: 'common',
    level: 3,
    realmRequirement: 'none',
    baseStats: { defense: 10, hp: 80 },
    maxEnhanceLevel: 8,
    enhanceStatsPerLevel: { defense: 2, hp: 15 },
    sellPrice: 20,
  },
  qingyun_robe: {
    id: 'qingyun_robe',
    name: '青云袍',
    description: '青云宗弟子标准道袍，以特殊丝绸织就，轻便且防御力不俗',
    slot: 'armor',
    quality: 'uncommon',
    level: 8,
    realmRequirement: 'lianqi',
    baseStats: { defense: 20, hp: 150, mp: 30 },
    maxEnhanceLevel: 12,
    enhanceStatsPerLevel: { defense: 3, hp: 20 },
    sellPrice: 100,
  },
  wolf_hide_armor: {
    id: 'wolf_hide_armor',
    name: '狼皮战甲',
    description: '以妖狼皮革制成的战甲，坚韧异常',
    slot: 'armor',
    quality: 'rare',
    level: 12,
    realmRequirement: 'zhuji',
    baseStats: { defense: 40, hp: 250, speed: 5 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { defense: 5, hp: 30 },
    sellPrice: 250,
  },
  xuantie_armor: {
    id: 'xuantie_armor',
    name: '玄铁甲',
    description: '以玄铁锻造的重甲，防御力极强',
    slot: 'armor',
    quality: 'rare',
    level: 18,
    realmRequirement: 'zhuji',
    baseStats: { defense: 60, hp: 400 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { defense: 8, hp: 50 },
    sellPrice: 400,
  },
  spirit_silk_robe: {
    id: 'spirit_silk_robe',
    name: '灵丝法袍',
    description: '以灵蚕丝编织的法袍，极大增强灵力运转',
    slot: 'armor',
    quality: 'epic',
    level: 25,
    realmRequirement: 'jindan',
    baseStats: { defense: 50, hp: 300, mp: 150, spiritualPower: 25 },
    maxEnhanceLevel: 20,
    enhanceStatsPerLevel: { defense: 6, mp: 20, spiritualPower: 3 },
    sellPrice: 800,
  },
  yuanying_dragon_armor: {
    id: 'yuanying_dragon_armor',
    name: '元婴龙鳞甲',
    description: '以龙鳞锻造的战甲，坚不可摧，蕴含龙族威压',
    slot: 'armor',
    quality: 'epic',
    level: 40,
    realmRequirement: 'yuanying',
    baseStats: { defense: 100, hp: 800, mp: 200, speed: 10 },
    maxEnhanceLevel: 25,
    enhanceStatsPerLevel: { defense: 12, hp: 80 },
    sellPrice: 2500,
  },
  huashen_celestial_robe: {
    id: 'huashen_celestial_robe',
    name: '化神天衣',
    description: '以天地法则之力编织的仙衣，可抵御万法侵蚀，近乎无敌',
    slot: 'armor',
    quality: 'legendary',
    level: 55,
    realmRequirement: 'huashen',
    baseStats: { defense: 200, hp: 2000, mp: 500, spiritualPower: 50 },
    maxEnhanceLevel: 30,
    enhanceStatsPerLevel: { defense: 20, hp: 150, spiritualPower: 5 },
    sellPrice: 6000,
  },
};

// ==================== 头盔 ====================

export const HELMETS: Record<string, EquipmentDefinition> = {
  cloth_hat: {
    id: 'cloth_hat',
    name: '布帽',
    description: '普通的布制帽子',
    slot: 'helmet',
    quality: 'common',
    level: 1,
    realmRequirement: 'none',
    baseStats: { defense: 2, hp: 20 },
    maxEnhanceLevel: 5,
    enhanceStatsPerLevel: { hp: 5 },
    sellPrice: 5,
  },
  leather_cap: {
    id: 'leather_cap',
    name: '皮帽',
    description: '兽皮制成的帽子',
    slot: 'helmet',
    quality: 'common',
    level: 3,
    realmRequirement: 'none',
    baseStats: { defense: 5, hp: 40 },
    maxEnhanceLevel: 8,
    enhanceStatsPerLevel: { defense: 1, hp: 8 },
    sellPrice: 12,
  },
  qingyun_crown: {
    id: 'qingyun_crown',
    name: '青云冠',
    description: '青云宗弟子佩戴的道冠',
    slot: 'helmet',
    quality: 'uncommon',
    level: 8,
    realmRequirement: 'lianqi',
    baseStats: { defense: 10, hp: 80, spiritualPower: 5 },
    maxEnhanceLevel: 12,
    enhanceStatsPerLevel: { defense: 2, hp: 12 },
    sellPrice: 60,
  },
  iron_helmet: {
    id: 'iron_helmet',
    name: '铁盔',
    description: '铁质头盔，坚固可靠',
    slot: 'helmet',
    quality: 'rare',
    level: 15,
    realmRequirement: 'zhuji',
    baseStats: { defense: 25, hp: 150 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { defense: 4, hp: 20 },
    sellPrice: 180,
  },
  yuanying_spirit_crown: {
    id: 'yuanying_spirit_crown',
    name: '元婴灵冠',
    description: '以灵玉雕琢的冠冕，可增强神识感知范围，辅助元婴修炼',
    slot: 'helmet',
    quality: 'epic',
    level: 40,
    realmRequirement: 'yuanying',
    baseStats: { defense: 50, hp: 400, spiritualPower: 30, mp: 150 },
    maxEnhanceLevel: 25,
    enhanceStatsPerLevel: { defense: 6, hp: 40, spiritualPower: 4 },
    sellPrice: 2000,
  },
  huashen_dao_crown: {
    id: 'huashen_dao_crown',
    name: '化神道冠',
    description: '蕴含大道法则的道冠，佩戴者可感知天地法则变化',
    slot: 'helmet',
    quality: 'legendary',
    level: 55,
    realmRequirement: 'huashen',
    baseStats: { defense: 100, hp: 1000, spiritualPower: 60, mp: 300 },
    maxEnhanceLevel: 30,
    enhanceStatsPerLevel: { defense: 10, hp: 80, spiritualPower: 6 },
    sellPrice: 5000,
  },
};

// ==================== 鞋子 ====================

export const BOOTS: Record<string, EquipmentDefinition> = {
  cloth_shoes: {
    id: 'cloth_shoes',
    name: '布鞋',
    description: '普通的布制鞋子',
    slot: 'boots',
    quality: 'common',
    level: 1,
    realmRequirement: 'none',
    baseStats: { speed: 3 },
    maxEnhanceLevel: 5,
    enhanceStatsPerLevel: { speed: 1 },
    sellPrice: 5,
  },
  leather_boots: {
    id: 'leather_boots',
    name: '皮靴',
    description: '兽皮制成的靴子，轻便耐穿',
    slot: 'boots',
    quality: 'common',
    level: 3,
    realmRequirement: 'none',
    baseStats: { speed: 6, defense: 3 },
    maxEnhanceLevel: 8,
    enhanceStatsPerLevel: { speed: 1 },
    sellPrice: 15,
  },
  swift_boots: {
    id: 'swift_boots',
    name: '疾风靴',
    description: '灌注风之灵力的靴子，穿上后身轻如燕',
    slot: 'boots',
    quality: 'rare',
    level: 12,
    realmRequirement: 'zhuji',
    baseStats: { speed: 20, defense: 8 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { speed: 3 },
    sellPrice: 200,
  },
  cloud_treading_boots: {
    id: 'cloud_treading_boots',
    name: '踏云靴',
    description: '传说中的法宝，穿上后可踏云而行',
    slot: 'boots',
    quality: 'epic',
    level: 25,
    realmRequirement: 'jindan',
    baseStats: { speed: 40, defense: 15, mp: 50 },
    maxEnhanceLevel: 20,
    enhanceStatsPerLevel: { speed: 5, defense: 2 },
    sellPrice: 600,
  },
  yuanying_wind_boots: {
    id: 'yuanying_wind_boots',
    name: '元婴御风靴',
    description: '以风之法则锻造的灵靴，穿上后可御风飞行，速度极快',
    slot: 'boots',
    quality: 'epic',
    level: 40,
    realmRequirement: 'yuanying',
    baseStats: { speed: 70, defense: 30, mp: 100 },
    maxEnhanceLevel: 25,
    enhanceStatsPerLevel: { speed: 8, defense: 3 },
    sellPrice: 2000,
  },
  huashen_void_boots: {
    id: 'huashen_void_boots',
    name: '化神虚空靴',
    description: '可踏破虚空瞬移的神靴，速度快到连光都无法追及',
    slot: 'boots',
    quality: 'legendary',
    level: 55,
    realmRequirement: 'huashen',
    baseStats: { speed: 130, defense: 60, mp: 200, critRate: 5 },
    maxEnhanceLevel: 30,
    enhanceStatsPerLevel: { speed: 12, defense: 5 },
    sellPrice: 5500,
  },
};

// ==================== 饰品 ====================

export const ACCESSORIES: Record<string, EquipmentDefinition> = {
  wooden_pendant: {
    id: 'wooden_pendant',
    name: '木制挂坠',
    description: '简单的木制饰品',
    slot: 'accessory',
    quality: 'common',
    level: 1,
    realmRequirement: 'none',
    baseStats: { hp: 30 },
    maxEnhanceLevel: 5,
    enhanceStatsPerLevel: { hp: 5 },
    sellPrice: 5,
  },
  jade_pendant: {
    id: 'jade_pendant',
    name: '玉佩',
    description: '温润的玉石挂件，能聚拢灵气',
    slot: 'accessory',
    quality: 'uncommon',
    level: 5,
    realmRequirement: 'lianqi',
    baseStats: { spiritualPower: 10, mp: 30 },
    maxEnhanceLevel: 10,
    enhanceStatsPerLevel: { spiritualPower: 2 },
    sellPrice: 50,
  },
  spirit_ring: {
    id: 'spirit_ring',
    name: '储灵戒',
    description: '可以储存灵力的戒指，关键时刻能救命',
    slot: 'accessory',
    quality: 'rare',
    level: 12,
    realmRequirement: 'zhuji',
    baseStats: { spiritualPower: 25, mp: 100 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { spiritualPower: 4, mp: 15 },
    sellPrice: 200,
  },
  blood_jade_bracelet: {
    id: 'blood_jade_bracelet',
    name: '血玉手镯',
    description: '血玉制成的手镯，能增强生命力',
    slot: 'accessory',
    quality: 'rare',
    level: 15,
    realmRequirement: 'zhuji',
    baseStats: { hp: 300, defense: 10 },
    maxEnhanceLevel: 15,
    enhanceStatsPerLevel: { hp: 40 },
    sellPrice: 250,
  },
  phoenix_feather: {
    id: 'phoenix_feather',
    name: '凤凰羽',
    description: '传说中凤凰遗落的羽毛，蕴含重生之力',
    slot: 'accessory',
    quality: 'epic',
    level: 30,
    realmRequirement: 'jindan',
    baseStats: { hp: 500, mp: 200, critRate: 5 },
    maxEnhanceLevel: 20,
    enhanceStatsPerLevel: { hp: 60, mp: 25 },
    sellPrice: 1200,
  },
  yuanying_soul_jade: {
    id: 'yuanying_soul_jade',
    name: '元婴魂玉',
    description: '蕴含元婴修士毕生修为的灵玉，可大幅增强灵力与神识',
    slot: 'accessory',
    quality: 'epic',
    level: 40,
    realmRequirement: 'yuanying',
    baseStats: { hp: 800, mp: 400, spiritualPower: 50, critRate: 8 },
    maxEnhanceLevel: 25,
    enhanceStatsPerLevel: { hp: 80, mp: 40, spiritualPower: 5 },
    sellPrice: 2500,
  },
  huashen_dao_seal: {
    id: 'huashen_dao_seal',
    name: '化神道印',
    description: '化神期强者以法则之力凝结的道印，佩戴者可借助法则之力战斗',
    slot: 'accessory',
    quality: 'legendary',
    level: 55,
    realmRequirement: 'huashen',
    baseStats: { hp: 1500, mp: 800, spiritualPower: 80, critRate: 12, critDamage: 30 },
    maxEnhanceLevel: 30,
    enhanceStatsPerLevel: { hp: 120, mp: 60, spiritualPower: 8 },
    sellPrice: 6000,
  },
};

// ==================== 汇总导出 ====================

export const ALL_EQUIPMENT: Record<string, EquipmentDefinition> = {
  ...WEAPONS,
  ...ARMORS,
  ...HELMETS,
  ...BOOTS,
  ...ACCESSORIES,
};

// 根据ID获取装备
export function getEquipmentById(id: string): EquipmentDefinition | undefined {
  return ALL_EQUIPMENT[id];
}

// 根据部位获取装备列表
export function getEquipmentBySlot(slot: EquipmentSlot): EquipmentDefinition[] {
  return Object.values(ALL_EQUIPMENT).filter(eq => eq.slot === slot);
}

// 计算强化后的属性
export function getEnhancedStats(equipment: EquipmentDefinition, enhanceLevel: number): EquipmentStats {
  const result: EquipmentStats = { ...equipment.baseStats };
  const enhance = equipment.enhanceStatsPerLevel;

  for (const key of Object.keys(enhance) as (keyof EquipmentStats)[]) {
    if (enhance[key] && result[key] !== undefined) {
      result[key] = (result[key] || 0) + (enhance[key] || 0) * enhanceLevel;
    } else if (enhance[key]) {
      result[key] = (enhance[key] || 0) * enhanceLevel;
    }
  }

  return result;
}

// 部位中文名
export const SLOT_NAMES: Record<EquipmentSlot, string> = {
  weapon: '武器',
  armor: '护甲',
  helmet: '头盔',
  boots: '鞋子',
  accessory: '饰品',
};

// 境界要求中文名
export const REALM_NAMES: Record<RealmRequirement, string> = {
  none: '无要求',
  lianqi: '练气期',
  zhuji: '筑基期',
  jindan: '金丹期',
  yuanying: '元婴期',
  huashen: '化神期',
};
