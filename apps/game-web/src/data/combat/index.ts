import type { Element, BaseAttributes } from '../../types';
import { ELEMENT_OVERCOMES } from '../origins';

export type StatusResistanceMap = Partial<Record<string, number>>;

// 战斗单位接口
export interface Combatant {
  id: string;
  name: string;
  isPlayer: boolean;
  isAlly: boolean;

  // 战斗属性
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;

  // 元素属性
  element: Element | 'neutral';

  // 技能
  skills: CombatSkill[];

  // 状态效果
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
  statusResistances?: StatusResistanceMap;

  // 战斗状态
  isAlive: boolean;
  actionGauge: number;  // 行动条
}

// 战斗技能
export interface CombatSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'support' | 'ultimate';
  element: Element | 'neutral';

  mpCost: number;
  cooldown: number;
  currentCooldown: number;

  // 伤害/效果
  damageMultiplier: number;
  hitCount: number;
  targetType: 'single' | 'all' | 'self' | 'random';

  effects: SkillEffectConfig[];
}

export interface SkillEffectConfig {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'dot' | 'hot';
  value: number;
  duration?: number;
  chance?: number;
  statusType?: string;
}

// 状态效果
export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff';
  duration: number;

  // 效果
  statModifier?: Partial<BaseAttributes>;
  dotDamage?: number;
  hotHeal?: number;

  // 特殊效果
  isStun?: boolean;
  isPoison?: boolean;
  isBurn?: boolean;
  isFreeze?: boolean;
}

// 战斗日志
export interface BattleLog {
  turn: number;
  actorId: string;
  actorName: string;
  action: string;
  targetId?: string;
  targetName?: string;
  damage?: number;
  heal?: number;
  isCrit?: boolean;
  effects?: string[];
}

// 战斗状态
export interface BattleState {
  id: string;
  turn: number;
  phase: 'preparing' | 'fighting' | 'victory' | 'defeat';

  allies: Combatant[];
  enemies: Combatant[];

  turnOrder: string[];
  currentActorId: string | null;

  logs: BattleLog[];

  rewards?: BattleRewards;
}

export interface BattleRewards {
  exp: number;
  spiritStones: number;
  items: { itemId: string; quantity: number }[];
}

const STATUS_EFFECT_LABELS: Record<string, string> = {
  attack_up: '攻击提升',
  attack_down: '攻击下降',
  defense_up: '防御提升',
  defense_down: '防御下降',
  speed_up: '速度提升',
  speed_down: '速度下降',
  slow: '迟缓',
  stun: '眩晕',
  freeze: '冻结',
  burn: '灼烧',
  poison: '中毒',
};

type CombatStatKey = 'attack' | 'defense' | 'speed';

function isControlEffect(effect: StatusEffect): boolean {
  return Boolean(effect.isStun || effect.isFreeze);
}

function normalizeStatusResistance(value: number | undefined): number {
  if (value === undefined) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

// 五行相克伤害倍率
export function getElementMultiplier(attackElement: Element | 'neutral', defendElement: Element | 'neutral'): number {
  if (attackElement === 'neutral' || defendElement === 'neutral') {
    return 1.0;
  }

  // 相克关系：攻击方克制防守方
  if (ELEMENT_OVERCOMES[attackElement] === defendElement) {
    return 1.5; // 克制加成50%
  }

  // 被克制
  if (ELEMENT_OVERCOMES[defendElement] === attackElement) {
    return 0.7; // 被克制减少30%
  }

  return 1.0;
}

function getStatusModifier(statusType: string | undefined, value: number): Partial<BaseAttributes> | undefined {
  if (!statusType) return undefined;

  switch (statusType) {
    case 'attack_up':
      return { attack: Math.abs(value) };
    case 'attack_down':
      return { attack: -Math.abs(value) };
    case 'defense_up':
      return { defense: Math.abs(value) };
    case 'defense_down':
      return { defense: -Math.abs(value) };
    case 'speed_up':
      return { speed: Math.abs(value) };
    case 'speed_down':
    case 'slow':
      return { speed: -Math.abs(value) };
    default:
      return undefined;
  }
}

function getStatusEffectName(effect: SkillEffectConfig): string {
  if (effect.statusType && STATUS_EFFECT_LABELS[effect.statusType]) {
    return STATUS_EFFECT_LABELS[effect.statusType];
  }

  switch (effect.type) {
    case 'buff':
      return '增益';
    case 'debuff':
      return '减益';
    case 'dot':
      return '持续伤害';
    case 'hot':
      return '持续治疗';
    default:
      return '状态';
  }
}

export function getEffectiveCombatStat(combatant: Combatant, stat: CombatStatKey): number {
  const baseValue = combatant[stat];
  const buffModifier = combatant.buffs.reduce((total, buff) => total + (buff.statModifier?.[stat] ?? 0), 0);
  const debuffModifier = combatant.debuffs.reduce((total, debuff) => total + (debuff.statModifier?.[stat] ?? 0), 0);
  const finalValue = baseValue * (1 + (buffModifier + debuffModifier) / 100);

  return Math.max(1, Math.floor(finalValue));
}

export function createStatusEffectFromSkillEffect(effect: SkillEffectConfig): StatusEffect | null {
  if (!['buff', 'debuff', 'dot', 'hot'].includes(effect.type)) {
    return null;
  }

  return {
    id: effect.statusType || `${effect.type}_${effect.value}_${effect.duration ?? 2}`,
    name: getStatusEffectName(effect),
    type: effect.type === 'buff' || effect.type === 'hot' ? 'buff' : 'debuff',
    duration: effect.duration ?? 2,
    statModifier: getStatusModifier(effect.statusType, effect.value),
    dotDamage: effect.type === 'dot' ? effect.value : undefined,
    hotHeal: effect.type === 'hot' ? effect.value : undefined,
    isStun: effect.statusType === 'stun',
    isFreeze: effect.statusType === 'freeze',
    isBurn: effect.statusType === 'burn',
    isPoison: effect.statusType === 'poison',
  };
}

export function getStatusResistance(combatant: Combatant, effect: StatusEffect): number {
  if (!combatant.statusResistances) {
    return 0;
  }

  const keys = new Set<string>([effect.id]);

  if (effect.isFreeze) keys.add('freeze');
  if (effect.isStun) keys.add('stun');
  if (effect.isBurn) keys.add('burn');
  if (effect.isPoison) keys.add('poison');

  let resistance = 0;
  keys.forEach((key) => {
    resistance = Math.max(resistance, normalizeStatusResistance(combatant.statusResistances?.[key]));
  });

  return resistance;
}

// 计算伤害
export function calculateDamage(
  attacker: Combatant,
  defender: Combatant,
  skill: CombatSkill
): { damage: number; isCrit: boolean; elementBonus: number } {
  const effectiveAttack = getEffectiveCombatStat(attacker, 'attack');
  const effectiveDefense = getEffectiveCombatStat(defender, 'defense');

  // 基础伤害
  let baseDamage = effectiveAttack * skill.damageMultiplier;

  // 防御减免
  const defenseReduction = effectiveDefense / (effectiveDefense + 100 + effectiveAttack * 0.5);
  baseDamage *= (1 - defenseReduction);

  // 元素克制
  const elementBonus = getElementMultiplier(skill.element, defender.element);
  baseDamage *= elementBonus;

  // 暴击判定
  const isCrit = Math.random() < attacker.critRate;
  if (isCrit) {
    baseDamage *= attacker.critDamage;
  }

  // 随机浮动 (0.9-1.1)
  baseDamage *= 0.9 + Math.random() * 0.2;

  return {
    damage: Math.max(1, Math.floor(baseDamage)),
    isCrit,
    elementBonus,
  };
}

// 计算治疗量
export function calculateHeal(
  healer: Combatant,
  _target: Combatant,
  skill: CombatSkill
): number {
  let baseHeal = getEffectiveCombatStat(healer, 'attack') * skill.damageMultiplier;

  // 随机浮动
  baseHeal *= 0.95 + Math.random() * 0.1;

  return Math.floor(baseHeal);
}

// 计算行动顺序
export function calculateTurnOrder(combatants: Combatant[]): string[] {
  const alive = combatants.filter(c => c.isAlive);

  // 按速度排序
  alive.sort((a, b) => {
    const speedA = getEffectiveCombatStat(a, 'speed') + a.actionGauge;
    const speedB = getEffectiveCombatStat(b, 'speed') + b.actionGauge;
    return speedB - speedA;
  });

  return alive.map(c => c.id);
}

// 应用状态效果
export function applyStatusEffect(target: Combatant, effect: StatusEffect): void {
  const list = effect.type === 'buff' ? target.buffs : target.debuffs;

  // 检查是否已有相同效果
  const existingIndex = list.findIndex(e => e.id === effect.id);
  if (existingIndex >= 0) {
    list[existingIndex] = {
      ...list[existingIndex],
      ...effect,
      duration: Math.max(list[existingIndex].duration, effect.duration),
    };
  } else {
    list.push({ ...effect });
  }
}

// 处理回合开始的状态效果
export function processStatusEffects(combatant: Combatant): { damage: number; heal: number; logs: string[] } {
  let totalDamage = 0;
  let totalHeal = 0;
  const logs: string[] = [];

  // 处理DOT伤害
  combatant.debuffs.forEach(debuff => {
    if (debuff.dotDamage) {
      totalDamage += debuff.dotDamage;
      logs.push(`${debuff.name}造成${debuff.dotDamage}点伤害`);
    }
  });

  // 处理HOT治疗
  combatant.buffs.forEach(buff => {
    if (buff.hotHeal) {
      totalHeal += buff.hotHeal;
      logs.push(`${buff.name}恢复${buff.hotHeal}点生命`);
    }
  });

  // 减少持续时间
  combatant.buffs = combatant.buffs.filter(b => {
    b.duration--;
    return b.duration > 0;
  });

  combatant.debuffs = combatant.debuffs.filter(d => {
    if (isControlEffect(d)) {
      return true;
    }
    d.duration--;
    return d.duration > 0;
  });

  return { damage: totalDamage, heal: totalHeal, logs };
}

// 检查是否被控制
export function isStunned(combatant: Combatant): boolean {
  return combatant.debuffs.some(d => d.isStun || d.isFreeze);
}

export function consumeControlEffects(combatant: Combatant): void {
  combatant.debuffs = combatant.debuffs.filter((debuff) => {
    if (!isControlEffect(debuff)) {
      return true;
    }

    debuff.duration--;
    return debuff.duration > 0;
  });
}

function getSkillStatusIds(skill: CombatSkill): string[] {
  return skill.effects
    .filter((effect) => effect.type === 'debuff' || effect.type === 'dot')
    .map((effect) => effect.statusType || `${effect.type}_${effect.value}_${effect.duration ?? 2}`);
}

function shouldUseHostileStatusSkill(skill: CombatSkill, enemies: Combatant[]): boolean {
  const aliveEnemies = enemies.filter((enemy) => enemy.isAlive);
  const statusIds = getSkillStatusIds(skill);

  if (aliveEnemies.length === 0 || statusIds.length === 0) {
    return false;
  }

  return aliveEnemies.some((enemy) =>
    statusIds.some((statusId) => !enemy.debuffs.some((debuff) => debuff.id === statusId))
  );
}

// AI选择技能
export function selectSkillAI(actor: Combatant, _allies: Combatant[], enemies: Combatant[]): {
  skill: CombatSkill;
  target: Combatant;
} {
  // 过滤可用技能
  const availableSkills = actor.skills.filter(s =>
    s.currentCooldown === 0 && actor.mp >= s.mpCost
  );

  if (availableSkills.length === 0) {
    // 使用普通攻击
    const basicAttack: CombatSkill = {
      id: 'basic_attack',
      name: '普通攻击',
      description: '基础攻击',
      type: 'attack',
      element: actor.element,
      mpCost: 0,
      cooldown: 0,
      currentCooldown: 0,
      damageMultiplier: 1,
      hitCount: 1,
      targetType: 'single',
      effects: [],
    };

    const target = selectTargetAI(enemies.filter(e => e.isAlive));
    return { skill: basicAttack, target };
  }

  // 简单AI逻辑
  // 1. 如果生命值低，优先使用治疗技能
  const hpPercent = actor.hp / actor.maxHp;
  if (hpPercent < 0.3) {
    const healSkill = availableSkills.find(s => s.type === 'support');
    if (healSkill) {
      return { skill: healSkill, target: actor };
    }
  }

  // 2. 如果有大招且敌人较多，使用群攻
  const aliveEnemies = enemies.filter(e => e.isAlive);
  if (aliveEnemies.length >= 2) {
    const aoeSkill = availableSkills.find(s => s.targetType === 'all');
    if (aoeSkill) {
      return { skill: aoeSkill, target: aliveEnemies[0] };
    }
  }

  // 3. 优先补上尚未生效的减益/持续伤害，避免 debuff 技能在单体战里永远不用
  const hostileStatusSkills = availableSkills
    .filter((skill) => shouldUseHostileStatusSkill(skill, aliveEnemies))
    .sort((a, b) => {
      if (a.targetType === 'all' && b.targetType !== 'all') return -1;
      if (a.targetType !== 'all' && b.targetType === 'all') return 1;
      return b.effects.length - a.effects.length;
    });
  if (hostileStatusSkills.length > 0) {
    const target = selectTargetAI(aliveEnemies);
    return { skill: hostileStatusSkills[0], target };
  }

  // 4. 默认使用伤害最高的技能
  const attackSkills = availableSkills.filter(s => s.type === 'attack' || s.type === 'ultimate');
  if (attackSkills.length > 0) {
    attackSkills.sort((a, b) => b.damageMultiplier - a.damageMultiplier);
    const target = selectTargetAI(aliveEnemies);
    return { skill: attackSkills[0], target };
  }

  // 5. 使用任意可用技能
  const target = selectTargetAI(aliveEnemies);
  return { skill: availableSkills[0], target };
}

// AI选择目标
export function selectTargetAI(enemies: Combatant[]): Combatant {
  const alive = enemies.filter(e => e.isAlive);
  if (alive.length === 0) {
    return enemies[0];
  }

  // 优先攻击生命值最低的目标
  alive.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp));
  return alive[0];
}

// 导出子模块
export * from './enemies';
export * from './dungeons';
export * from './storyDungeons';
