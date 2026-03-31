import type { CombatSkill } from './index';
import type { Element } from '../../types';

// 玩家技能数据
export const PLAYER_SKILLS: Record<string, CombatSkill> = {
  // 基础技能
  basic_punch: {
    id: 'basic_punch',
    name: '基础拳法',
    description: '最基本的攻击方式',
    type: 'attack',
    element: 'neutral',
    mpCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    damageMultiplier: 1.0,
    hitCount: 1,
    targetType: 'single',
    effects: [],
  },

  // 金系技能
  metal_sword_qi: {
    id: 'metal_sword_qi',
    name: '金刚剑气',
    description: '凝聚金属性灵力化为锋利剑气',
    type: 'attack',
    element: 'metal',
    mpCost: 15,
    cooldown: 2,
    currentCooldown: 0,
    damageMultiplier: 1.8,
    hitCount: 1,
    targetType: 'single',
    effects: [],
  },

  metal_thousand_swords: {
    id: 'metal_thousand_swords',
    name: '万剑归宗',
    description: '召唤无数剑气攻击所有敌人',
    type: 'ultimate',
    element: 'metal',
    mpCost: 50,
    cooldown: 5,
    currentCooldown: 0,
    damageMultiplier: 1.5,
    hitCount: 3,
    targetType: 'all',
    effects: [],
  },

  // 金系中级技能
  metal_sword_domain: {
    id: 'metal_sword_domain',
    name: '剑域',
    description: '展开剑气领域，对所有敌人造成持续伤害',
    type: 'attack',
    element: 'metal',
    mpCost: 40,
    cooldown: 4,
    currentCooldown: 0,
    damageMultiplier: 2.0,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'dot', value: 15, duration: 2, statusType: 'burn', chance: 0.4 },
    ],
  },

  // 金系高级技能
  metal_heavenly_sword: {
    id: 'metal_heavenly_sword',
    name: '天剑诀',
    description: '凝聚天地金气化为天剑，一剑斩断因果',
    type: 'ultimate',
    element: 'metal',
    mpCost: 80,
    cooldown: 6,
    currentCooldown: 0,
    damageMultiplier: 4.0,
    hitCount: 1,
    targetType: 'single',
    effects: [],
  },

  // 木系技能
  wood_vine_bind: {
    id: 'wood_vine_bind',
    name: '缠藤术',
    description: '召唤藤蔓缠绕敌人',
    type: 'attack',
    element: 'wood',
    mpCost: 20,
    cooldown: 3,
    currentCooldown: 0,
    damageMultiplier: 1.2,
    hitCount: 1,
    targetType: 'single',
    effects: [
      { type: 'debuff', value: -20, duration: 2, statusType: 'slow', chance: 0.5 },
    ],
  },

  wood_rejuvenation: {
    id: 'wood_rejuvenation',
    name: '回春术',
    description: '以木灵力治愈伤势',
    type: 'support',
    element: 'wood',
    mpCost: 30,
    cooldown: 3,
    currentCooldown: 0,
    damageMultiplier: 2.0,
    hitCount: 1,
    targetType: 'self',
    effects: [],
  },

  // 木系中级技能
  wood_thorns: {
    id: 'wood_thorns',
    name: '万棘丛生',
    description: '召唤漫天荆棘攻击所有敌人并降低速度',
    type: 'attack',
    element: 'wood',
    mpCost: 35,
    cooldown: 4,
    currentCooldown: 0,
    damageMultiplier: 1.8,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'debuff', value: -15, duration: 2, statusType: 'slow', chance: 0.5 },
    ],
  },

  // 木系高级技能
  wood_world_tree: {
    id: 'wood_world_tree',
    name: '世界树降临',
    description: '召唤世界树之力，对所有敌人造成伤害并持续回复自身',
    type: 'ultimate',
    element: 'wood',
    mpCost: 75,
    cooldown: 6,
    currentCooldown: 0,
    damageMultiplier: 2.5,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'hot', value: 50, duration: 3, chance: 1.0 },
    ],
  },

  // 水系技能
  water_ice_arrow: {
    id: 'water_ice_arrow',
    name: '冰箭术',
    description: '凝结寒冰化为利箭',
    type: 'attack',
    element: 'water',
    mpCost: 25,
    cooldown: 2,
    currentCooldown: 0,
    damageMultiplier: 1.3,
    hitCount: 2,
    targetType: 'single',
    effects: [
      { type: 'debuff', value: 0, duration: 1, statusType: 'freeze', chance: 0.2 },
    ],
  },

  water_frozen_world: {
    id: 'water_frozen_world',
    name: '冰封万里',
    description: '释放极寒之力冻结全场',
    type: 'ultimate',
    element: 'water',
    mpCost: 60,
    cooldown: 6,
    currentCooldown: 0,
    damageMultiplier: 2.0,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'debuff', value: 0, duration: 1, statusType: 'freeze', chance: 0.4 },
    ],
  },

  // 水系中级技能
  water_tidal_wave: {
    id: 'water_tidal_wave',
    name: '潮汐术',
    description: '掀起潮汐巨浪冲击所有敌人',
    type: 'attack',
    element: 'water',
    mpCost: 35,
    cooldown: 3,
    currentCooldown: 0,
    damageMultiplier: 1.6,
    hitCount: 1,
    targetType: 'all',
    effects: [],
  },

  // 水系高级技能
  water_absolute_zero: {
    id: 'water_absolute_zero',
    name: '绝对零度',
    description: '将温度降至绝对零度，冻结并粉碎一切',
    type: 'ultimate',
    element: 'water',
    mpCost: 85,
    cooldown: 7,
    currentCooldown: 0,
    damageMultiplier: 3.5,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'debuff', value: 0, duration: 2, statusType: 'freeze', chance: 0.5 },
    ],
  },

  // 火系技能
  fire_fireball: {
    id: 'fire_fireball',
    name: '火球术',
    description: '凝聚火焰形成火球',
    type: 'attack',
    element: 'fire',
    mpCost: 15,
    cooldown: 2,
    currentCooldown: 0,
    damageMultiplier: 1.8,
    hitCount: 1,
    targetType: 'single',
    effects: [
      { type: 'dot', value: 5, duration: 2, statusType: 'burn', chance: 0.3 },
    ],
  },

  fire_meteor: {
    id: 'fire_meteor',
    name: '天火流星',
    description: '召唤天火流星轰击敌阵',
    type: 'ultimate',
    element: 'fire',
    mpCost: 70,
    cooldown: 6,
    currentCooldown: 0,
    damageMultiplier: 2.5,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'dot', value: 10, duration: 3, statusType: 'burn', chance: 0.5 },
    ],
  },

  // 火系中级技能
  fire_explosion: {
    id: 'fire_explosion',
    name: '烈焰爆裂',
    description: '凝聚火焰在目标体内引爆，造成高额伤害',
    type: 'attack',
    element: 'fire',
    mpCost: 35,
    cooldown: 3,
    currentCooldown: 0,
    damageMultiplier: 2.5,
    hitCount: 1,
    targetType: 'single',
    effects: [
      { type: 'dot', value: 12, duration: 2, statusType: 'burn', chance: 0.5 },
    ],
  },

  // 火系高级技能
  fire_nirvana: {
    id: 'fire_nirvana',
    name: '凤凰涅盘',
    description: '以凤凰真火焚烧一切，同时回复自身生命',
    type: 'ultimate',
    element: 'fire',
    mpCost: 90,
    cooldown: 7,
    currentCooldown: 0,
    damageMultiplier: 4.0,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'dot', value: 20, duration: 3, statusType: 'burn', chance: 0.6 },
      { type: 'heal', value: 30, chance: 1.0 },
    ],
  },

  // 土系技能
  earth_rock_armor: {
    id: 'earth_rock_armor',
    name: '岩铠术',
    description: '以土灵力凝结护甲',
    type: 'support',
    element: 'earth',
    mpCost: 25,
    cooldown: 4,
    currentCooldown: 0,
    damageMultiplier: 0,
    hitCount: 1,
    targetType: 'self',
    effects: [
      { type: 'buff', value: 30, duration: 3, statusType: 'defense_up' },
    ],
  },

  earth_quake: {
    id: 'earth_quake',
    name: '地裂术',
    description: '引发大地震动',
    type: 'attack',
    element: 'earth',
    mpCost: 40,
    cooldown: 4,
    currentCooldown: 0,
    damageMultiplier: 1.8,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'debuff', value: 0, duration: 1, statusType: 'stun', chance: 0.25 },
    ],
  },

  // 土系中级技能
  earth_mountain_crush: {
    id: 'earth_mountain_crush',
    name: '搬山术',
    description: '搬动巨岩砸向敌人，造成高额单体伤害',
    type: 'attack',
    element: 'earth',
    mpCost: 35,
    cooldown: 3,
    currentCooldown: 0,
    damageMultiplier: 2.8,
    hitCount: 1,
    targetType: 'single',
    effects: [],
  },

  // 土系高级技能
  earth_domain: {
    id: 'earth_domain',
    name: '厚土领域',
    description: '展开厚土领域，大幅提升防御并对所有敌人造成伤害',
    type: 'ultimate',
    element: 'earth',
    mpCost: 80,
    cooldown: 6,
    currentCooldown: 0,
    damageMultiplier: 2.5,
    hitCount: 1,
    targetType: 'all',
    effects: [
      { type: 'buff', value: 50, duration: 3, statusType: 'defense_up' },
      { type: 'debuff', value: 0, duration: 1, statusType: 'stun', chance: 0.3 },
    ],
  },
};

// 根据元素获取相关技能
export function getSkillsByElement(element: Element): CombatSkill[] {
  return Object.values(PLAYER_SKILLS).filter(skill =>
    skill.element === element || skill.element === 'neutral'
  );
}

// 获取初始技能
export function getStartingSkills(): CombatSkill[] {
  return [
    { ...PLAYER_SKILLS.basic_punch },
  ];
}
