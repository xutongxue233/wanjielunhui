import { Combatant, CombatSkill } from './index';
import type { Element } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// 敌人模板
export interface EnemyTemplate {
  id: string;
  name: string;
  description: string;
  element: Element | 'neutral';
  level: number;

  // 基础属性倍率
  hpMultiplier: number;
  attackMultiplier: number;
  defenseMultiplier: number;
  speedMultiplier: number;

  // 技能列表
  skills: CombatSkill[];

  // 掉落
  expReward: number;
  spiritStoneReward: number;
  dropTable: { itemId: string; chance: number; quantity: number }[];
}

// 预设敌人模板
export const ENEMY_TEMPLATES: Record<string, EnemyTemplate> = {
  wild_boar: {
    id: 'wild_boar',
    name: '野猪',
    description: '山林中常见的野兽',
    element: 'earth',
    level: 1,
    hpMultiplier: 1.0,
    attackMultiplier: 0.8,
    defenseMultiplier: 0.5,
    speedMultiplier: 0.7,
    skills: [],
    expReward: 10,
    spiritStoneReward: 2,
    dropTable: [
      { itemId: 'beast_meat', chance: 0.8, quantity: 1 },
      { itemId: 'beast_bone', chance: 0.3, quantity: 1 },
    ],
  },

  spirit_wolf: {
    id: 'spirit_wolf',
    name: '灵狼',
    description: '吸收了天地灵气的狼妖',
    element: 'wood',
    level: 3,
    hpMultiplier: 1.2,
    attackMultiplier: 1.2,
    defenseMultiplier: 0.8,
    speedMultiplier: 1.3,
    skills: [
      {
        id: 'wolf_claw',
        name: '狼爪',
        description: '锋利的爪击',
        type: 'attack',
        element: 'wood',
        mpCost: 10,
        cooldown: 2,
        currentCooldown: 0,
        damageMultiplier: 1.5,
        hitCount: 2,
        targetType: 'single',
        effects: [],
      },
    ],
    expReward: 30,
    spiritStoneReward: 8,
    dropTable: [
      { itemId: 'wolf_fang', chance: 0.5, quantity: 1 },
      { itemId: 'spirit_essence', chance: 0.2, quantity: 1 },
    ],
  },

  fire_serpent: {
    id: 'fire_serpent',
    name: '火蛇',
    description: '浑身燃烧着烈焰的妖蛇',
    element: 'fire',
    level: 5,
    hpMultiplier: 1.0,
    attackMultiplier: 1.5,
    defenseMultiplier: 0.6,
    speedMultiplier: 1.5,
    skills: [
      {
        id: 'fire_breath',
        name: '火焰吐息',
        description: '喷射烈焰',
        type: 'attack',
        element: 'fire',
        mpCost: 15,
        cooldown: 3,
        currentCooldown: 0,
        damageMultiplier: 2.0,
        hitCount: 1,
        targetType: 'all',
        effects: [
          { type: 'dot', value: 10, duration: 2, statusType: 'burn', chance: 0.3 },
        ],
      },
    ],
    expReward: 60,
    spiritStoneReward: 20,
    dropTable: [
      { itemId: 'fire_essence', chance: 0.4, quantity: 1 },
      { itemId: 'serpent_scale', chance: 0.6, quantity: 2 },
    ],
  },

  rock_golem: {
    id: 'rock_golem',
    name: '岩石傀儡',
    description: '由灵石凝聚而成的傀儡',
    element: 'earth',
    level: 8,
    hpMultiplier: 2.0,
    attackMultiplier: 1.3,
    defenseMultiplier: 2.0,
    speedMultiplier: 0.5,
    skills: [
      {
        id: 'rock_smash',
        name: '岩石粉碎',
        description: '以巨大的石拳砸向敌人',
        type: 'attack',
        element: 'earth',
        mpCost: 20,
        cooldown: 4,
        currentCooldown: 0,
        damageMultiplier: 3.0,
        hitCount: 1,
        targetType: 'single',
        effects: [],
      },
    ],
    expReward: 100,
    spiritStoneReward: 50,
    dropTable: [
      { itemId: 'earth_crystal', chance: 0.5, quantity: 1 },
      { itemId: 'golem_core', chance: 0.2, quantity: 1 },
    ],
  },

  wandering_cultivator: {
    id: 'wandering_cultivator',
    name: '散修',
    description: '游荡的修士',
    element: 'neutral',
    level: 10,
    hpMultiplier: 1.5,
    attackMultiplier: 1.5,
    defenseMultiplier: 1.2,
    speedMultiplier: 1.2,
    skills: [
      {
        id: 'sword_qi',
        name: '剑气',
        description: '凝聚剑意化为剑气',
        type: 'attack',
        element: 'metal',
        mpCost: 25,
        cooldown: 2,
        currentCooldown: 0,
        damageMultiplier: 2.0,
        hitCount: 1,
        targetType: 'single',
        effects: [],
      },
      {
        id: 'minor_healing',
        name: '小回春术',
        description: '恢复少量生命',
        type: 'support',
        element: 'wood',
        mpCost: 30,
        cooldown: 4,
        currentCooldown: 0,
        damageMultiplier: 1.5,
        hitCount: 1,
        targetType: 'self',
        effects: [],
      },
    ],
    expReward: 150,
    spiritStoneReward: 80,
    dropTable: [
      { itemId: 'spirit_stone', chance: 1.0, quantity: 10 },
      { itemId: 'technique_fragment', chance: 0.1, quantity: 1 },
    ],
  },
};

// 根据玩家境界计算敌人基础属性
export function calculateEnemyStats(level: number): {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
} {
  const baseHp = 50 + level * 30;
  const baseMp = 30 + level * 15;
  const baseAttack = 10 + level * 5;
  const baseDefense = 5 + level * 3;
  const baseSpeed = 10 + level * 2;

  return {
    hp: baseHp,
    mp: baseMp,
    attack: baseAttack,
    defense: baseDefense,
    speed: baseSpeed,
  };
}

// 从模板创建敌人实例
export function createEnemyFromTemplate(template: EnemyTemplate, levelBonus: number = 0): Combatant {
  const effectiveLevel = template.level + levelBonus;
  const stats = calculateEnemyStats(effectiveLevel);

  return {
    id: uuidv4(),
    name: template.name,
    isPlayer: false,
    isAlly: false,

    hp: Math.floor(stats.hp * template.hpMultiplier),
    maxHp: Math.floor(stats.hp * template.hpMultiplier),
    mp: Math.floor(stats.mp),
    maxMp: Math.floor(stats.mp),
    attack: Math.floor(stats.attack * template.attackMultiplier),
    defense: Math.floor(stats.defense * template.defenseMultiplier),
    speed: Math.floor(stats.speed * template.speedMultiplier),
    critRate: 0.05,
    critDamage: 1.5,

    element: template.element,
    skills: template.skills.map(s => ({ ...s, currentCooldown: 0 })),
    buffs: [],
    debuffs: [],

    isAlive: true,
    actionGauge: Math.random() * 10,
  };
}

// 生成随机遭遇
export function generateRandomEncounter(playerLevel: number, difficulty: number = 1): Combatant[] {
  const templateKeys = Object.keys(ENEMY_TEMPLATES);

  // 根据玩家等级筛选合适的敌人
  const suitableTemplates = templateKeys.filter(key => {
    const template = ENEMY_TEMPLATES[key];
    return template.level <= playerLevel + 5 && template.level >= playerLevel - 3;
  });

  if (suitableTemplates.length === 0) {
    suitableTemplates.push('wild_boar');
  }

  // 生成1-3个敌人
  const enemyCount = Math.min(3, Math.ceil(Math.random() * difficulty + 1));
  const enemies: Combatant[] = [];

  for (let i = 0; i < enemyCount; i++) {
    const templateKey = suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)];
    const template = ENEMY_TEMPLATES[templateKey];
    const levelBonus = Math.floor(Math.random() * 3) - 1;
    enemies.push(createEnemyFromTemplate(template, levelBonus));
  }

  return enemies;
}
