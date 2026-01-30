import type { Realm, RealmName, RealmStage } from '../../types';

// 境界显示名称
export const REALM_DISPLAY_NAMES: Record<RealmName, string> = {
  lianqi: '炼气',
  zhuji: '筑基',
  jindan: '金丹',
  yuanying: '元婴',
  huashen: '化神',
  heti: '合体',
  dacheng: '大乘',
  dujie: '渡劫',
  xianren: '仙人',
};

export const STAGE_DISPLAY_NAMES: Record<RealmStage, string> = {
  early: '初期',
  middle: '中期',
  late: '后期',
  peak: '大圆满',
};

// 境界顺序
export const REALM_ORDER: RealmName[] = [
  'lianqi', 'zhuji', 'jindan', 'yuanying',
  'huashen', 'heti', 'dacheng', 'dujie', 'xianren'
];

export const STAGE_ORDER: RealmStage[] = ['early', 'middle', 'late', 'peak'];

// 境界配置数据
export interface RealmConfig {
  name: RealmName;
  displayName: string;
  baseLifespan: number;           // 基础寿元
  cultivationMultiplier: number;  // 修为需求倍率
  attributeMultiplier: number;    // 属性倍率
  breakthroughBaseRate: number;   // 基础突破率
  description: string;
}

export const REALM_CONFIGS: Record<RealmName, RealmConfig> = {
  lianqi: {
    name: 'lianqi',
    displayName: '炼气',
    baseLifespan: 150,
    cultivationMultiplier: 1,
    attributeMultiplier: 1,
    breakthroughBaseRate: 0.8,
    description: '引气入体，感应天地灵气，踏入修仙之门。',
  },
  zhuji: {
    name: 'zhuji',
    displayName: '筑基',
    baseLifespan: 300,
    cultivationMultiplier: 3,
    attributeMultiplier: 2,
    breakthroughBaseRate: 0.6,
    description: '筑就道基，脱胎换骨，真正踏入修仙者行列。',
  },
  jindan: {
    name: 'jindan',
    displayName: '金丹',
    baseLifespan: 500,
    cultivationMultiplier: 9,
    attributeMultiplier: 5,
    breakthroughBaseRate: 0.4,
    description: '凝结金丹，法力大增，可御剑飞行。',
  },
  yuanying: {
    name: 'yuanying',
    displayName: '元婴',
    baseLifespan: 1000,
    cultivationMultiplier: 27,
    attributeMultiplier: 12,
    breakthroughBaseRate: 0.3,
    description: '元婴出窍，神识大成，已是一方强者。',
  },
  huashen: {
    name: 'huashen',
    displayName: '化神',
    baseLifespan: 2000,
    cultivationMultiplier: 81,
    attributeMultiplier: 30,
    breakthroughBaseRate: 0.2,
    description: '化神归真，天人感应，可窥探天道法则。',
  },
  heti: {
    name: 'heti',
    displayName: '合体',
    baseLifespan: 5000,
    cultivationMultiplier: 243,
    attributeMultiplier: 80,
    breakthroughBaseRate: 0.15,
    description: '天人合一，掌控法则，移山倒海不在话下。',
  },
  dacheng: {
    name: 'dacheng',
    displayName: '大乘',
    baseLifespan: 10000,
    cultivationMultiplier: 729,
    attributeMultiplier: 200,
    breakthroughBaseRate: 0.1,
    description: '大道将成，距离飞升仅一步之遥。',
  },
  dujie: {
    name: 'dujie',
    displayName: '渡劫',
    baseLifespan: 20000,
    cultivationMultiplier: 2187,
    attributeMultiplier: 500,
    breakthroughBaseRate: 0.05,
    description: '天劫降临，渡过则飞升成仙，失败则形神俱灭。',
  },
  xianren: {
    name: 'xianren',
    displayName: '仙人',
    baseLifespan: Infinity,
    cultivationMultiplier: 10000,
    attributeMultiplier: 2000,
    breakthroughBaseRate: 1,
    description: '超脱轮回，长生不死，真正的仙人。',
  },
};

// 每个小境界的修为需求基数
export const BASE_CULTIVATION_REQUIREMENT = 100;

// 增长系数 - 每个小境界需求是上一个的1.5倍
export const CULTIVATION_GROWTH_RATE = 1.5;

// 计算某个境界阶段的修为需求
// 使用指数增长公式，确保每个阶段需求都比前一个高
export function getCultivationRequirement(realm: Realm): number {
  const level = getRealmLevel(realm);
  // 需求 = 基数 * 增长率^(等级-1)
  // 这样 level 1 = 100, level 2 = 150, level 3 = 225...
  return Math.floor(BASE_CULTIVATION_REQUIREMENT * Math.pow(CULTIVATION_GROWTH_RATE, level - 1));
}

// 计算境界等级 (1-36)
export function getRealmLevel(realm: Realm): number {
  const realmIndex = REALM_ORDER.indexOf(realm.name);
  const stageIndex = STAGE_ORDER.indexOf(realm.stage);
  return realmIndex * 4 + stageIndex + 1;
}

// 根据等级获取境界
export function getRealmFromLevel(level: number): Realm {
  const clampedLevel = Math.max(1, Math.min(36, level));
  const realmIndex = Math.floor((clampedLevel - 1) / 4);
  const stageIndex = (clampedLevel - 1) % 4;

  const name = REALM_ORDER[realmIndex];
  const stage = STAGE_ORDER[stageIndex];

  return {
    name,
    stage,
    displayName: `${REALM_DISPLAY_NAMES[name]}${STAGE_DISPLAY_NAMES[stage]}`,
    level: clampedLevel,
  };
}

// 获取下一个境界
export function getNextRealm(current: Realm): Realm | null {
  const currentLevel = getRealmLevel(current);
  if (currentLevel >= 36) return null;
  return getRealmFromLevel(currentLevel + 1);
}

// 获取境界颜色
export function getRealmColor(realm: RealmName): string {
  const colors: Record<RealmName, string> = {
    lianqi: '#9CA3AF',
    zhuji: '#60A5FA',
    jindan: '#FBBF24',
    yuanying: '#A78BFA',
    huashen: '#F472B6',
    heti: '#34D399',
    dacheng: '#F97316',
    dujie: '#EF4444',
    xianren: '#FFD700',
  };
  return colors[realm];
}

// 创建初始境界
export function createInitialRealm(): Realm {
  return getRealmFromLevel(1);
}
