/**
 * 道具数据定义
 * 包含消耗品、材料、任务物品等
 */

import type { ItemEffect } from '../types';

// 物品品质
export type ItemQuality = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 物品类型
export type ItemType = 'consumable' | 'material' | 'equipment' | 'quest' | 'currency';

// 物品效果类型
export type ItemEffectType =
  | 'heal_hp'
  | 'heal_mp'
  | 'add_exp'
  | 'add_cultivation'
  | 'buff_attack'
  | 'buff_defense'
  | 'buff_speed'
  | 'remove_debuff'
  | 'immunity';

// 物品定义接口
export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  quality: ItemQuality;
  stackable: boolean;
  maxStack: number;
  sellPrice: number;
  buyPrice?: number;
  effects?: ItemEffect[];
  icon?: string;
}

// ==================== 消耗品 ====================

export const CONSUMABLE_ITEMS: Record<string, ItemDefinition> = {
  // 恢复类
  healing_pill_small: {
    id: 'healing_pill_small',
    name: '小还丹',
    description: '初级丹药，服用后恢复100点生命值',
    type: 'consumable',
    quality: 'common',
    stackable: true,
    maxStack: 99,
    sellPrice: 10,
    buyPrice: 25,
    effects: [{ type: 'heal_hp', value: 100 }],
  },
  healing_pill_medium: {
    id: 'healing_pill_medium',
    name: '中还丹',
    description: '中级丹药，服用后恢复300点生命值',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 99,
    sellPrice: 30,
    buyPrice: 80,
    effects: [{ type: 'heal_hp', value: 300 }],
  },
  healing_pill_large: {
    id: 'healing_pill_large',
    name: '大还丹',
    description: '高级丹药，服用后恢复800点生命值',
    type: 'consumable',
    quality: 'rare',
    stackable: true,
    maxStack: 99,
    sellPrice: 100,
    buyPrice: 250,
    effects: [{ type: 'heal_hp', value: 800 }],
  },
  mp_pill_small: {
    id: 'mp_pill_small',
    name: '聚灵丹',
    description: '恢复50点灵力',
    type: 'consumable',
    quality: 'common',
    stackable: true,
    maxStack: 99,
    sellPrice: 8,
    buyPrice: 20,
    effects: [{ type: 'heal_mp', value: 50 }],
  },
  mp_pill_medium: {
    id: 'mp_pill_medium',
    name: '凝灵丹',
    description: '恢复150点灵力',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 99,
    sellPrice: 25,
    buyPrice: 60,
    effects: [{ type: 'heal_mp', value: 150 }],
  },

  // 修炼类
  juyuan_pill: {
    id: 'juyuan_pill',
    name: '聚元丹',
    description: '蕴含精纯灵气的丹药，服用后增加500点修为',
    type: 'consumable',
    quality: 'rare',
    stackable: true,
    maxStack: 99,
    sellPrice: 200,
    effects: [{ type: 'add_cultivation', value: 500 }],
  },
  exp_pill: {
    id: 'exp_pill',
    name: '悟道丹',
    description: '开启灵智的丹药，服用后增加1000点经验',
    type: 'consumable',
    quality: 'rare',
    stackable: true,
    maxStack: 99,
    sellPrice: 300,
    effects: [{ type: 'add_exp', value: 1000 }],
  },

  // 战斗辅助
  bixie_talisman: {
    id: 'bixie_talisman',
    name: '辟邪符',
    description: '道家符箓，战斗中使用可免疫一次负面效果',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 20,
    sellPrice: 50,
    effects: [{ type: 'immunity', value: 1, duration: 3 }],
  },
  power_pill: {
    id: 'power_pill',
    name: '狂暴丹',
    description: '短时间内大幅提升攻击力',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 20,
    sellPrice: 40,
    effects: [{ type: 'buff_attack', value: 30, duration: 5 }],
  },
  defense_pill: {
    id: 'defense_pill',
    name: '铁壁丹',
    description: '短时间内大幅提升防御力',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 20,
    sellPrice: 40,
    effects: [{ type: 'buff_defense', value: 30, duration: 5 }],
  },
  speed_pill: {
    id: 'speed_pill',
    name: '疾风丹',
    description: '短时间内大幅提升速度',
    type: 'consumable',
    quality: 'uncommon',
    stackable: true,
    maxStack: 20,
    sellPrice: 40,
    effects: [{ type: 'buff_speed', value: 20, duration: 5 }],
  },
  antidote_pill: {
    id: 'antidote_pill',
    name: '解毒丹',
    description: '清除身上的中毒效果',
    type: 'consumable',
    quality: 'common',
    stackable: true,
    maxStack: 50,
    sellPrice: 15,
    buyPrice: 40,
    effects: [{ type: 'remove_debuff', value: 1 }],
  },

  // 高级恢复丹药
  healing_pill_jindan: {
    id: 'healing_pill_jindan',
    name: '金丹恢复丹',
    description: '金丹期修士专用丹药，服用后恢复2000点生命值',
    type: 'consumable',
    quality: 'epic',
    stackable: true,
    maxStack: 99,
    sellPrice: 300,
    buyPrice: 800,
    effects: [{ type: 'heal_hp', value: 2000 }],
  },
  healing_pill_yuanying: {
    id: 'healing_pill_yuanying',
    name: '元婴恢复丹',
    description: '元婴期修士专用丹药，服用后恢复5000点生命值',
    type: 'consumable',
    quality: 'epic',
    stackable: true,
    maxStack: 99,
    sellPrice: 800,
    buyPrice: 2000,
    effects: [{ type: 'heal_hp', value: 5000 }],
  },
  healing_pill_huashen: {
    id: 'healing_pill_huashen',
    name: '化神恢复丹',
    description: '化神期修士专用丹药，服用后恢复15000点生命值',
    type: 'consumable',
    quality: 'legendary',
    stackable: true,
    maxStack: 99,
    sellPrice: 2500,
    buyPrice: 6000,
    effects: [{ type: 'heal_hp', value: 15000 }],
  },

  // 高级灵力恢复
  mp_pill_jindan: {
    id: 'mp_pill_jindan',
    name: '金丹凝灵丹',
    description: '金丹期修士专用，恢复500点灵力',
    type: 'consumable',
    quality: 'epic',
    stackable: true,
    maxStack: 99,
    sellPrice: 250,
    buyPrice: 600,
    effects: [{ type: 'heal_mp', value: 500 }],
  },
  mp_pill_yuanying: {
    id: 'mp_pill_yuanying',
    name: '元婴凝灵丹',
    description: '元婴期修士专用，恢复1500点灵力',
    type: 'consumable',
    quality: 'epic',
    stackable: true,
    maxStack: 99,
    sellPrice: 700,
    buyPrice: 1800,
    effects: [{ type: 'heal_mp', value: 1500 }],
  },

  // 突破辅助道具
  zhuji_pill: {
    id: 'zhuji_pill',
    name: '筑基丹',
    description: '辅助突破筑基期的珍贵丹药，提升突破成功率20%',
    type: 'consumable',
    quality: 'rare',
    stackable: true,
    maxStack: 10,
    sellPrice: 500,
    buyPrice: 1500,
    effects: [{ type: 'add_cultivation', value: 200 }],
  },
  jindan_pill: {
    id: 'jindan_pill',
    name: '金丹丹',
    description: '辅助凝结金丹的稀世丹药，提升突破成功率15%',
    type: 'consumable',
    quality: 'epic',
    stackable: true,
    maxStack: 10,
    sellPrice: 1500,
    buyPrice: 5000,
    effects: [{ type: 'add_cultivation', value: 500 }],
  },
  yuanying_pill: {
    id: 'yuanying_pill',
    name: '元婴丹',
    description: '辅助元婴突破的无价丹药，提升突破成功率10%',
    type: 'consumable',
    quality: 'legendary',
    stackable: true,
    maxStack: 10,
    sellPrice: 5000,
    buyPrice: 15000,
    effects: [{ type: 'add_cultivation', value: 1000 }],
  },
};

// ==================== 材料 ====================

export const MATERIAL_ITEMS: Record<string, ItemDefinition> = {
  // 货币类
  spirit_stone: {
    id: 'spirit_stone',
    name: '灵石',
    description: '修仙界通用货币，蕴含微弱灵气',
    type: 'currency',
    quality: 'common',
    stackable: true,
    maxStack: 99999,
    sellPrice: 1,
  },

  // 怪物掉落
  wolf_fang: {
    id: 'wolf_fang',
    name: '狼牙',
    description: '锋利的狼牙，可用于装备强化',
    type: 'material',
    quality: 'common',
    stackable: true,
    maxStack: 999,
    sellPrice: 5,
  },
  wolf_pelt: {
    id: 'wolf_pelt',
    name: '狼皮',
    description: '坚韧的狼皮，制作防具的材料',
    type: 'material',
    quality: 'common',
    stackable: true,
    maxStack: 999,
    sellPrice: 8,
  },
  demon_blood: {
    id: 'demon_blood',
    name: '妖血',
    description: '蕴含妖力的血液，炼丹的珍贵材料',
    type: 'material',
    quality: 'uncommon',
    stackable: true,
    maxStack: 999,
    sellPrice: 25,
  },
  demon_core: {
    id: 'demon_core',
    name: '妖核',
    description: '妖兽体内凝结的精华，极为珍贵',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 100,
  },

  // 矿石类
  iron_ore: {
    id: 'iron_ore',
    name: '铁矿石',
    description: '普通铁矿石，锻造的基础材料',
    type: 'material',
    quality: 'common',
    stackable: true,
    maxStack: 999,
    sellPrice: 3,
  },
  xuantie_ore: {
    id: 'xuantie_ore',
    name: '玄铁矿',
    description: '蕴含灵气的铁矿，锻造法器的材料',
    type: 'material',
    quality: 'uncommon',
    stackable: true,
    maxStack: 999,
    sellPrice: 20,
  },

  // 草药类
  lingzhi: {
    id: 'lingzhi',
    name: '灵芝',
    description: '百年灵芝，炼制丹药的常用材料',
    type: 'material',
    quality: 'common',
    stackable: true,
    maxStack: 999,
    sellPrice: 10,
  },
  blood_ginseng: {
    id: 'blood_ginseng',
    name: '血参',
    description: '吸收天地精华的珍贵药材',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 80,
  },

  // 高级材料
  fire_scorpion_venom: {
    id: 'fire_scorpion_venom',
    name: '火蝎毒囊',
    description: '火焰蝎体内的毒囊，蕴含灼热毒素，炼丹的珍贵辅材',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 60,
  },
  snake_gallbladder: {
    id: 'snake_gallbladder',
    name: '蛇胆',
    description: '冥蛇的蛇胆，解毒圣品，也可入药炼丹',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 120,
  },
  dragon_scale: {
    id: 'dragon_scale',
    name: '龙鳞',
    description: '远古巨龙遗落的鳞片，坚硬无比，锻造神兵的顶级材料',
    type: 'material',
    quality: 'legendary',
    stackable: true,
    maxStack: 999,
    sellPrice: 1000,
  },
  phoenix_blood: {
    id: 'phoenix_blood',
    name: '凤凰血',
    description: '传说中凤凰涅槃时遗留的精血，蕴含重生之力',
    type: 'material',
    quality: 'legendary',
    stackable: true,
    maxStack: 999,
    sellPrice: 1500,
  },
  thunder_essence: {
    id: 'thunder_essence',
    name: '天雷精华',
    description: '天劫雷霆凝结而成的精华，蕴含毁灭与新生之力',
    type: 'material',
    quality: 'legendary',
    stackable: true,
    maxStack: 999,
    sellPrice: 2000,
  },
  soul_crystal: {
    id: 'soul_crystal',
    name: '魂晶',
    description: '噬魂蝠体内凝结的灵魂结晶，修炼神识的极品材料',
    type: 'material',
    quality: 'epic',
    stackable: true,
    maxStack: 999,
    sellPrice: 200,
  },
  millennium_tree_heart: {
    id: 'millennium_tree_heart',
    name: '千年树心',
    description: '千年树妖的核心，蕴含浑厚的木属性灵力',
    type: 'material',
    quality: 'epic',
    stackable: true,
    maxStack: 999,
    sellPrice: 250,
  },
  fox_spirit_orb: {
    id: 'fox_spirit_orb',
    name: '狐灵珠',
    description: '九尾妖狐体内的灵珠，蕴含强大的幻术之力',
    type: 'material',
    quality: 'epic',
    stackable: true,
    maxStack: 999,
    sellPrice: 500,
  },
  golden_crab_shell: {
    id: 'golden_crab_shell',
    name: '金甲蟹壳',
    description: '金甲蟹坚硬的甲壳，防御力惊人，是锻造重甲的上等材料',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 80,
  },
  thunder_eagle_feather: {
    id: 'thunder_eagle_feather',
    name: '雷鹰羽',
    description: '雷鹰翎羽，带有雷电之力，制作法器的稀有材料',
    type: 'material',
    quality: 'rare',
    stackable: true,
    maxStack: 999,
    sellPrice: 100,
  },
};

// ==================== 任务物品 ====================

export const QUEST_ITEMS: Record<string, ItemDefinition> = {
  ancient_book: {
    id: 'ancient_book',
    name: '残破古籍',
    description: '记载着神秘功法的古老书籍',
    type: 'quest',
    quality: 'rare',
    stackable: false,
    maxStack: 1,
    sellPrice: 0,
  },
  qingyun_token: {
    id: 'qingyun_token',
    name: '青云令牌',
    description: '青云宗弟子的身份凭证',
    type: 'quest',
    quality: 'uncommon',
    stackable: false,
    maxStack: 1,
    sellPrice: 0,
  },
  village_letter: {
    id: 'village_letter',
    name: '求助信',
    description: '青山村村民的求助信件',
    type: 'quest',
    quality: 'common',
    stackable: false,
    maxStack: 1,
    sellPrice: 0,
  },
};

// ==================== 汇总导出 ====================

export const ALL_ITEMS: Record<string, ItemDefinition> = {
  ...CONSUMABLE_ITEMS,
  ...MATERIAL_ITEMS,
  ...QUEST_ITEMS,
};

// 根据ID获取物品
export function getItemById(id: string): ItemDefinition | undefined {
  return ALL_ITEMS[id];
}

// 根据类型获取物品列表
export function getItemsByType(type: ItemType): ItemDefinition[] {
  return Object.values(ALL_ITEMS).filter(item => item.type === type);
}

// 根据品质获取物品列表
export function getItemsByQuality(quality: ItemQuality): ItemDefinition[] {
  return Object.values(ALL_ITEMS).filter(item => item.quality === quality);
}

// 品质颜色映射
export const QUALITY_COLORS: Record<ItemQuality, string> = {
  common: '#9CA3AF',     // 灰色
  uncommon: '#22C55E',   // 绿色
  rare: '#3B82F6',       // 蓝色
  epic: '#A855F7',       // 紫色
  legendary: '#F59E0B',  // 橙色
};

// 品质中文名
export const QUALITY_NAMES: Record<ItemQuality, string> = {
  common: '普通',
  uncommon: '优秀',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};
