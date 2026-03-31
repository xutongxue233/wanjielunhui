// 秘境系统种子数据
// 从前端 src/data/roguelike/index.ts 迁移

export const roguelikeDungeonsData = [
  {
    dungeonId: 'misty_forest',
    name: '迷雾森林',
    description: '被浓雾笼罩的神秘森林，据说深处藏有上古遗迹',
    difficulty: 1,
    maxFloors: 10,
    config: JSON.stringify({
      element: 'wood',
      minLevel: 5,
      enemyPool: ['spirit_wolf', 'wild_boar', 'fire_serpent'],
      bossPool: ['rock_golem'],
      eventPool: ['treasure_chest', 'healing_spring', 'mysterious_merchant'],
    }),
    unlockConditions: JSON.stringify({ requiredLevel: 5 }),
  },
  {
    dungeonId: 'flame_cavern',
    name: '炎魔洞窟',
    description: '炽热的地下洞窟，火属性妖兽横行',
    difficulty: 2,
    maxFloors: 15,
    config: JSON.stringify({
      element: 'fire',
      minLevel: 10,
      enemyPool: ['fire_serpent', 'fire_scorpion', 'flame_demon'],
      bossPool: ['golden_crab', 'thunder_eagle'],
      eventPool: ['treasure_chest', 'healing_spring', 'mysterious_merchant', 'forge'],
    }),
    unlockConditions: JSON.stringify({ requiredLevel: 10 }),
  },
  {
    dungeonId: 'thunder_peak',
    name: '雷霆之巅',
    description: '终年雷电交加的山峰，蕴含无尽雷霆之力',
    difficulty: 3,
    maxFloors: 20,
    config: JSON.stringify({
      element: 'metal',
      minLevel: 18,
      enemyPool: ['thunder_eagle', 'jindan_cultivator', 'golden_puppet'],
      bossPool: ['yuanying_elder', 'sky_wolf'],
      eventPool: ['treasure_chest', 'healing_spring', 'mysterious_merchant', 'forge', 'ancient_altar'],
    }),
    unlockConditions: JSON.stringify({ requiredLevel: 18 }),
  },
  {
    dungeonId: 'shura_realm',
    name: '修罗界',
    description: '远古修罗界的碎片空间，充斥着无尽杀戮',
    difficulty: 4,
    maxFloors: 25,
    config: JSON.stringify({
      element: 'fire',
      minLevel: 25,
      enemyPool: ['shura_warrior', 'shura_general', 'flame_demon', 'golden_puppet'],
      bossPool: ['shura_king', 'nine_tail_fox'],
      eventPool: ['treasure_chest', 'healing_spring', 'mysterious_merchant', 'forge', 'ancient_altar', 'blood_pool'],
    }),
    unlockConditions: JSON.stringify({ requiredLevel: 25 }),
  },
  {
    dungeonId: 'chaos_void',
    name: '混沌虚空',
    description: '连接混沌与现实的裂隙空间',
    difficulty: 5,
    maxFloors: 30,
    config: JSON.stringify({
      element: 'neutral',
      minLevel: 32,
      enemyPool: ['chaos_beast', 'void_rift_beast', 'fallen_immortal', 'sky_demon'],
      bossPool: ['huashen_demon_lord', 'ancient_dragon', 'chaos_demon_god'],
      eventPool: ['treasure_chest', 'healing_spring', 'mysterious_merchant', 'forge', 'ancient_altar', 'blood_pool', 'chaos_rift'],
    }),
    unlockConditions: JSON.stringify({ requiredLevel: 32 }),
  },
];

export const roguelikeTalentsData = [
  // 攻击天赋
  {
    talentId: 'power_surge',
    name: '力量涌动',
    description: '攻击力提升10%',
    tier: 1,
    effects: JSON.stringify([{ type: 'stat_bonus', stat: 'attack', value: 0.1, isPercentage: true }]),
    exclusiveWith: null,
  },
  {
    talentId: 'critical_eye',
    name: '致命之眼',
    description: '暴击率提升5%',
    tier: 1,
    effects: JSON.stringify([{ type: 'stat_bonus', stat: 'critRate', value: 0.05, isPercentage: false }]),
    exclusiveWith: null,
  },
  {
    talentId: 'berserker',
    name: '狂暴',
    description: '攻击力提升25%，但防御力降低10%',
    tier: 2,
    effects: JSON.stringify([
      { type: 'stat_bonus', stat: 'attack', value: 0.25, isPercentage: true },
      { type: 'stat_bonus', stat: 'defense', value: -0.1, isPercentage: true },
    ]),
    exclusiveWith: JSON.stringify(['iron_wall']),
  },

  // 防御天赋
  {
    talentId: 'tough_skin',
    name: '坚韧皮肤',
    description: '防御力提升10%',
    tier: 1,
    effects: JSON.stringify([{ type: 'stat_bonus', stat: 'defense', value: 0.1, isPercentage: true }]),
    exclusiveWith: null,
  },
  {
    talentId: 'iron_wall',
    name: '铁壁',
    description: '防御力提升25%，但速度降低10%',
    tier: 2,
    effects: JSON.stringify([
      { type: 'stat_bonus', stat: 'defense', value: 0.25, isPercentage: true },
      { type: 'stat_bonus', stat: 'speed', value: -0.1, isPercentage: true },
    ]),
    exclusiveWith: JSON.stringify(['berserker']),
  },
  {
    talentId: 'hp_boost',
    name: '生命强化',
    description: '最大生命值提升15%',
    tier: 1,
    effects: JSON.stringify([{ type: 'stat_bonus', stat: 'maxHp', value: 0.15, isPercentage: true }]),
    exclusiveWith: null,
  },

  // 辅助天赋
  {
    talentId: 'swift_feet',
    name: '疾风步',
    description: '速度提升15%',
    tier: 1,
    effects: JSON.stringify([{ type: 'stat_bonus', stat: 'speed', value: 0.15, isPercentage: true }]),
    exclusiveWith: null,
  },
  {
    talentId: 'treasure_hunter',
    name: '寻宝者',
    description: '掉落率提升20%',
    tier: 2,
    effects: JSON.stringify([{ type: 'drop_bonus', value: 0.2 }]),
    exclusiveWith: null,
  },
  {
    talentId: 'exp_boost',
    name: '经验加成',
    description: '经验获取提升30%',
    tier: 2,
    effects: JSON.stringify([{ type: 'exp_bonus', value: 0.3 }]),
    exclusiveWith: null,
  },
  {
    talentId: 'life_steal',
    name: '生命窃取',
    description: '攻击时恢复5%伤害值的生命',
    tier: 3,
    effects: JSON.stringify([{ type: 'life_steal', value: 0.05 }]),
    exclusiveWith: null,
  },
];
