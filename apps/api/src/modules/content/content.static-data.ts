// 静态游戏配置数据，从前端 src/data/ 同步而来
// 这些数据没有对应的数据库表，直接以JSON形式提供给客户端

// ==================== 境界配置 ====================

export const REALM_ORDER = [
  'lianqi', 'zhuji', 'jindan', 'yuanying',
  'huashen', 'heti', 'dacheng', 'dujie', 'xianren',
] as const;

export const STAGE_ORDER = ['early', 'middle', 'late', 'peak'] as const;

export const STAGE_DISPLAY_NAMES: Record<string, string> = {
  early: '初期',
  middle: '中期',
  late: '后期',
  peak: '大圆满',
};

export const REALM_CONFIGS: Record<string, {
  name: string;
  displayName: string;
  baseLifespan: number;
  attributeMultiplier: number;
  breakthroughBaseRate: number;
  description: string;
}> = {
  lianqi: {
    name: 'lianqi',
    displayName: '炼气',
    baseLifespan: 150,
    attributeMultiplier: 1,
    breakthroughBaseRate: 0.8,
    description: '引气入体，感应天地灵气，踏入修仙之门。',
  },
  zhuji: {
    name: 'zhuji',
    displayName: '筑基',
    baseLifespan: 300,
    attributeMultiplier: 2,
    breakthroughBaseRate: 0.6,
    description: '筑就道基，脱胎换骨，真正踏入修仙者行列。',
  },
  jindan: {
    name: 'jindan',
    displayName: '金丹',
    baseLifespan: 500,
    attributeMultiplier: 5,
    breakthroughBaseRate: 0.4,
    description: '凝结金丹，法力大增，可御剑飞行。',
  },
  yuanying: {
    name: 'yuanying',
    displayName: '元婴',
    baseLifespan: 1000,
    attributeMultiplier: 12,
    breakthroughBaseRate: 0.3,
    description: '元婴出窍，神识大成，已是一方强者。',
  },
  huashen: {
    name: 'huashen',
    displayName: '化神',
    baseLifespan: 2000,
    attributeMultiplier: 30,
    breakthroughBaseRate: 0.2,
    description: '化神归真，天人感应，可窥探天道法则。',
  },
  heti: {
    name: 'heti',
    displayName: '合体',
    baseLifespan: 5000,
    attributeMultiplier: 80,
    breakthroughBaseRate: 0.15,
    description: '天人合一，掌控法则，移山倒海不在话下。',
  },
  dacheng: {
    name: 'dacheng',
    displayName: '大乘',
    baseLifespan: 10000,
    attributeMultiplier: 200,
    breakthroughBaseRate: 0.12,
    description: '大道将成，距离飞升仅一步之遥。',
  },
  dujie: {
    name: 'dujie',
    displayName: '渡劫',
    baseLifespan: 20000,
    attributeMultiplier: 500,
    breakthroughBaseRate: 0.15,
    description: '天劫降临，渡过则飞升成仙，失败则形神俱灭。',
  },
  xianren: {
    name: 'xianren',
    displayName: '仙人',
    baseLifespan: -1, // Infinity 无法序列化，用 -1 表示无限
    attributeMultiplier: 2000,
    breakthroughBaseRate: 1,
    description: '超脱轮回，长生不死，真正的仙人。',
  },
};

// ==================== 出身配置 ====================

export const ORIGINS = [
  {
    type: 'village_orphan',
    name: '山村孤儿',
    description: '你自幼父母双亡，被山村中的老猎户收养。一日在山中采药时，偶然发现一处隐秘山洞，得到一本残缺的修仙功法，从此踏上了修仙之路。',
    startingBonus: {
      attributes: { luck: 15, comprehension: 10 },
      items: [
        { itemId: 'broken_technique_manual', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 10 },
        { itemId: 'healing_pill_low', quantity: 5 },
      ],
      techniques: ['basic_qi_gathering'],
    },
    startingStory: 'story_village_orphan_start',
  },
  {
    type: 'fallen_clan',
    name: '家族余孤',
    description: '你本是修仙世家的嫡系子弟，却因家族遭逢大难而流落凡间。父亲临终前将家传功法和一枚神秘玉佩交给了你，嘱咐你有朝一日重振家族荣光。',
    startingBonus: {
      attributes: { comprehension: 20, karma: 10 },
      items: [
        { itemId: 'clan_technique_manual', quantity: 1 },
        { itemId: 'mysterious_jade_pendant', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 50 },
        { itemId: 'healing_pill_medium', quantity: 3 },
      ],
      techniques: ['clan_breathing_technique'],
      spiritualRootBonus: 10,
    },
    startingStory: 'story_fallen_clan_start',
  },
  {
    type: 'reincarnation',
    name: '转世重修',
    description: '你前世是一位修为通天的大能，却在渡劫时遭人暗算而陨落。凭借着一丝残魂转世重生，虽然前世记忆被封印，但骨子里的道韵犹存，修炼起来事半功倍。',
    startingBonus: {
      attributes: { comprehension: 20, cultivationSpeed: 0.3 },
      items: [
        { itemId: 'sealed_memory_fragment', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 20 },
        { itemId: 'reincarnation_pill', quantity: 1 },
      ],
      techniques: ['forgotten_breathing_technique'],
      spiritualRootBonus: 20,
    },
    startingStory: 'story_reincarnation_start',
  },
];

// ==================== 灵根配置 ====================

export const SPIRIT_ROOTS = {
  qualities: [
    { key: 'mortal', name: '凡俗', bonus: 0 },
    { key: 'ordinary', name: '普通', bonus: 0.1 },
    { key: 'excellent', name: '优秀', bonus: 0.3 },
    { key: 'heavenly', name: '天灵根', bonus: 0.6 },
    { key: 'chaos', name: '混沌灵根', bonus: 1.0 },
  ],
  elements: [
    { key: 'metal', name: '金' },
    { key: 'wood', name: '木' },
    { key: 'water', name: '水' },
    { key: 'fire', name: '火' },
    { key: 'earth', name: '土' },
  ],
  specialRoots: [
    { key: 'ice', name: '冰灵根', elements: ['water'], bonus: 0.4, description: '水之极致，寒冰之体。' },
    { key: 'thunder', name: '雷灵根', elements: ['metal', 'wood'], bonus: 0.5, description: '金木交融，引动天雷。' },
    { key: 'wind', name: '风灵根', elements: ['wood'], bonus: 0.4, description: '木之灵动，御风而行。' },
    { key: 'yin_yang', name: '阴阳灵根', elements: ['water', 'fire'], bonus: 0.8, description: '水火相济，阴阳调和。' },
    { key: 'void', name: '虚空灵根', elements: [], bonus: 1.0, description: '无中生有，虚空造化。极其罕见的特殊灵根。' },
  ],
};

// ==================== 炼丹配方 ====================

export const ALCHEMY_RECIPES = [
  {
    id: 'qi_gathering_pill', name: '聚气丹', description: '凝聚天地灵气，加速修炼',
    grade: 'low', element: 'neutral',
    materials: [{ itemId: 'spirit_grass', quantity: 3 }, { itemId: 'morning_dew', quantity: 2 }],
    requiredLevel: 1, requiredFurnaceGrade: 1, baseDuration: 60, baseSuccessRate: 0.8, baseOutput: 3,
    effects: [{ type: 'add_cultivation', value: 100 }],
  },
  {
    id: 'healing_pill', name: '疗伤丹', description: '治愈伤势，恢复气血',
    grade: 'low', element: 'wood',
    materials: [{ itemId: 'blood_ginseng', quantity: 2 }, { itemId: 'spirit_grass', quantity: 2 }],
    requiredLevel: 1, requiredFurnaceGrade: 1, baseDuration: 45, baseSuccessRate: 0.85, baseOutput: 5,
    effects: [{ type: 'heal_hp', value: 200 }],
  },
  {
    id: 'spirit_recovery_pill', name: '回灵丹', description: '恢复法力',
    grade: 'low', element: 'water',
    materials: [{ itemId: 'blue_lotus', quantity: 2 }, { itemId: 'spirit_water', quantity: 1 }],
    requiredLevel: 2, requiredFurnaceGrade: 1, baseDuration: 50, baseSuccessRate: 0.8, baseOutput: 4,
    effects: [{ type: 'heal_mp', value: 150 }],
  },
  {
    id: 'foundation_pill', name: '筑基丹', description: '稳固根基，突破必备',
    grade: 'medium', element: 'earth',
    materials: [{ itemId: 'earth_essence', quantity: 3 }, { itemId: 'century_ginseng', quantity: 1 }, { itemId: 'spirit_stone', quantity: 10 }],
    requiredLevel: 5, requiredFurnaceGrade: 2, baseDuration: 300, baseSuccessRate: 0.5, baseOutput: 1,
    effects: [{ type: 'breakthrough_bonus', value: 0.2 }],
  },
  {
    id: 'power_pill', name: '蛮力丹', description: '临时大幅提升攻击力',
    grade: 'medium', element: 'fire',
    materials: [{ itemId: 'fire_essence', quantity: 2 }, { itemId: 'tiger_bone', quantity: 1 }, { itemId: 'beast_blood', quantity: 3 }],
    requiredLevel: 4, requiredFurnaceGrade: 2, baseDuration: 180, baseSuccessRate: 0.6, baseOutput: 2,
    effects: [{ type: 'buff_attack', value: 50, duration: 300 }],
  },
  {
    id: 'golden_core_pill', name: '金丹', description: '凝结金丹的辅助圣药',
    grade: 'high', element: 'metal',
    materials: [{ itemId: 'golden_essence', quantity: 5 }, { itemId: 'thousand_year_ginseng', quantity: 1 }, { itemId: 'dragon_blood', quantity: 1 }, { itemId: 'high_spirit_stone', quantity: 5 }],
    requiredLevel: 10, requiredFurnaceGrade: 4, baseDuration: 1800, baseSuccessRate: 0.3, baseOutput: 1,
    effects: [{ type: 'breakthrough_bonus', value: 0.5 }, { type: 'add_cultivation', value: 10000 }],
  },
  {
    id: 'longevity_pill', name: '驻颜丹', description: '延长寿元',
    grade: 'high', element: 'wood',
    materials: [{ itemId: 'life_fruit', quantity: 1 }, { itemId: 'thousand_year_ginseng', quantity: 2 }, { itemId: 'phoenix_feather', quantity: 1 }],
    requiredLevel: 12, requiredFurnaceGrade: 5, baseDuration: 3600, baseSuccessRate: 0.2, baseOutput: 1,
    effects: [{ type: 'extend_lifespan', value: 100 }],
  },
  {
    id: 'root_cleansing_pill', name: '洗髓丹', description: '净化灵根，提升资质',
    grade: 'supreme', element: 'neutral',
    materials: [{ itemId: 'chaos_essence', quantity: 1 }, { itemId: 'nine_leaf_clover', quantity: 1 }, { itemId: 'immortal_spring_water', quantity: 1 }, { itemId: 'supreme_spirit_stone', quantity: 10 }],
    requiredLevel: 20, requiredFurnaceGrade: 7, baseDuration: 7200, baseSuccessRate: 0.1, baseOutput: 1,
    effects: [{ type: 'purify_root', value: 10 }],
  },
  {
    id: 'jindan_recovery_pill', name: '金丹恢复丹', description: '金丹期修士专用的恢复丹药',
    grade: 'medium', element: 'wood',
    materials: [{ itemId: 'blood_ginseng', quantity: 3 }, { itemId: 'golden_essence', quantity: 1 }, { itemId: 'spirit_grass', quantity: 5 }],
    requiredLevel: 6, requiredFurnaceGrade: 3, baseDuration: 300, baseSuccessRate: 0.6, baseOutput: 3,
    effects: [{ type: 'heal_hp', value: 2000 }],
  },
  {
    id: 'yuanying_recovery_pill', name: '元婴恢复丹', description: '元婴期修士专用的恢复丹药',
    grade: 'high', element: 'wood',
    materials: [{ itemId: 'thousand_year_ginseng', quantity: 1 }, { itemId: 'blood_ginseng', quantity: 5 }, { itemId: 'spirit_water', quantity: 3 }],
    requiredLevel: 10, requiredFurnaceGrade: 4, baseDuration: 600, baseSuccessRate: 0.4, baseOutput: 2,
    effects: [{ type: 'heal_hp', value: 5000 }],
  },
  {
    id: 'huashen_recovery_pill', name: '化神恢复丹', description: '化神期修士专用的恢复丹药，蕴含浑厚生命力',
    grade: 'high', element: 'wood',
    materials: [{ itemId: 'thousand_year_ginseng', quantity: 2 }, { itemId: 'life_fruit', quantity: 1 }, { itemId: 'earth_essence', quantity: 3 }],
    requiredLevel: 14, requiredFurnaceGrade: 5, baseDuration: 1200, baseSuccessRate: 0.3, baseOutput: 2,
    effects: [{ type: 'heal_hp', value: 15000 }],
  },
  {
    id: 'yuanying_breakthrough_pill', name: '元婴丹', description: '辅助元婴突破的珍贵丹药',
    grade: 'high', element: 'neutral',
    materials: [{ itemId: 'golden_essence', quantity: 3 }, { itemId: 'dragon_blood', quantity: 1 }, { itemId: 'thousand_year_ginseng', quantity: 2 }],
    requiredLevel: 12, requiredFurnaceGrade: 5, baseDuration: 2400, baseSuccessRate: 0.25, baseOutput: 1,
    effects: [{ type: 'breakthrough_bonus', value: 0.3 }, { type: 'add_cultivation', value: 5000 }],
  },
  {
    id: 'huashen_breakthrough_pill', name: '化神丹', description: '辅助化神期突破的极品丹药',
    grade: 'supreme', element: 'fire',
    materials: [{ itemId: 'phoenix_feather', quantity: 1 }, { itemId: 'golden_essence', quantity: 5 }, { itemId: 'dragon_blood', quantity: 2 }],
    requiredLevel: 16, requiredFurnaceGrade: 6, baseDuration: 3600, baseSuccessRate: 0.15, baseOutput: 1,
    effects: [{ type: 'breakthrough_bonus', value: 0.4 }, { type: 'add_cultivation', value: 20000 }],
  },
  {
    id: 'heti_breakthrough_pill', name: '合体丹', description: '辅助合体期突破的仙品丹药',
    grade: 'supreme', element: 'neutral',
    materials: [{ itemId: 'chaos_essence', quantity: 1 }, { itemId: 'dragon_blood', quantity: 3 }, { itemId: 'phoenix_feather', quantity: 2 }],
    requiredLevel: 20, requiredFurnaceGrade: 7, baseDuration: 5400, baseSuccessRate: 0.1, baseOutput: 1,
    effects: [{ type: 'breakthrough_bonus', value: 0.5 }, { type: 'add_cultivation', value: 80000 }],
  },
  {
    id: 'medium_juyuan_pill', name: '中品聚元丹', description: '蕴含浓郁灵气，大幅增加修为',
    grade: 'medium', element: 'neutral',
    materials: [{ itemId: 'earth_essence', quantity: 2 }, { itemId: 'spirit_grass', quantity: 5 }, { itemId: 'century_ginseng', quantity: 1 }],
    requiredLevel: 8, requiredFurnaceGrade: 3, baseDuration: 240, baseSuccessRate: 0.55, baseOutput: 2,
    effects: [{ type: 'add_cultivation', value: 5000 }],
  },
  {
    id: 'high_juyuan_pill', name: '上品聚元丹', description: '蕴含磅礴灵气，极大增加修为',
    grade: 'high', element: 'neutral',
    materials: [{ itemId: 'golden_essence', quantity: 3 }, { itemId: 'thousand_year_ginseng', quantity: 1 }, { itemId: 'earth_essence', quantity: 5 }],
    requiredLevel: 14, requiredFurnaceGrade: 5, baseDuration: 1200, baseSuccessRate: 0.3, baseOutput: 1,
    effects: [{ type: 'add_cultivation', value: 50000 }],
  },
  {
    id: 'defense_supreme_pill', name: '金刚丹', description: '大幅提升防御力的高级丹药',
    grade: 'high', element: 'earth',
    materials: [{ itemId: 'earth_essence', quantity: 5 }, { itemId: 'golden_essence', quantity: 2 }, { itemId: 'tiger_bone', quantity: 3 }],
    requiredLevel: 10, requiredFurnaceGrade: 4, baseDuration: 600, baseSuccessRate: 0.4, baseOutput: 2,
    effects: [{ type: 'buff_defense', value: 100, duration: 600 }],
  },
  {
    id: 'speed_supreme_pill', name: '疾风丹', description: '大幅提升速度的高级丹药',
    grade: 'high', element: 'wood',
    materials: [{ itemId: 'century_ginseng', quantity: 2 }, { itemId: 'blue_lotus', quantity: 5 }, { itemId: 'beast_blood', quantity: 3 }],
    requiredLevel: 10, requiredFurnaceGrade: 4, baseDuration: 600, baseSuccessRate: 0.4, baseOutput: 2,
    effects: [{ type: 'buff_speed', value: 50, duration: 600 }],
  },
];

// ==================== 丹炉 ====================

export const ALCHEMY_CAULDRONS = [
  { id: 'basic_furnace', name: '铁制丹炉', grade: 1, durability: 100, maxDurability: 100, successRateBonus: 0, qualityBonus: 0, speedBonus: 0 },
  { id: 'bronze_furnace', name: '青铜丹炉', grade: 2, durability: 200, maxDurability: 200, successRateBonus: 0.05, qualityBonus: 0.05, speedBonus: 0.1 },
  { id: 'spirit_furnace', name: '灵纹丹炉', grade: 3, durability: 500, maxDurability: 500, successRateBonus: 0.1, qualityBonus: 0.1, speedBonus: 0.2 },
  { id: 'earth_fire_furnace', name: '地火丹炉', grade: 5, durability: 1000, maxDurability: 1000, successRateBonus: 0.2, qualityBonus: 0.15, speedBonus: 0.3 },
  { id: 'nine_dragon_furnace', name: '九龙神炉', grade: 8, durability: 5000, maxDurability: 5000, successRateBonus: 0.4, qualityBonus: 0.3, speedBonus: 0.5 },
];

// ==================== 秘境 ====================

export const ROGUELIKE_DUNGEONS = [
  {
    id: 'spirit_cave', name: '灵气洞府',
    description: '一处充满灵气的上古洞府，适合初入修仙界的修士探索。',
    difficulty: 1, floors: 5, requiredLevel: 1,
    roomPool: ['combat', 'combat', 'combat', 'treasure', 'rest', 'event'],
    enemyPool: ['wild_boar', 'spirit_wolf'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 50, chance: 1.0 },
      { type: 'item', itemId: 'spirit_grass', quantity: 5, chance: 0.8 },
      { type: 'item', itemId: 'healing_pill', quantity: 2, chance: 0.5 },
    ],
    talentPool: ['attack_boost', 'defense_boost', 'speed_boost'],
    dailyLimit: 3, entryCost: { type: 'spirit_stone', amount: 10 },
  },
  {
    id: 'fire_domain', name: '炎火秘境',
    description: '被火焰笼罩的危险秘境，蕴含珍贵的火属性材料。',
    difficulty: 2, floors: 8, requiredLevel: 5,
    roomPool: ['combat', 'combat', 'elite', 'treasure', 'shop', 'event', 'rest'],
    enemyPool: ['fire_serpent', 'flame_wolf', 'fire_elemental'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 200, chance: 1.0 },
      { type: 'item', itemId: 'fire_essence', quantity: 3, chance: 0.6 },
      { type: 'item', itemId: 'fire_gem', quantity: 1, chance: 0.3 },
    ],
    talentPool: ['fire_mastery', 'burn_immunity', 'attack_boost', 'crit_boost'],
    dailyLimit: 2, entryCost: { type: 'spirit_stone', amount: 50 },
  },
  {
    id: 'demon_abyss', name: '魔渊深处',
    description: '通往魔界的裂隙，阴气森森，强大的魔物潜伏其中，金丹期以上修士的试炼之地。',
    difficulty: 3, floors: 10, requiredLevel: 10,
    roomPool: ['combat', 'combat', 'elite', 'treasure', 'shop', 'event', 'rest', 'boss'],
    enemyPool: ['dark_serpent', 'soul_bat', 'fire_scorpion', 'golden_crab', 'jindan_cultivator'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 500, chance: 1.0 },
      { type: 'item', itemId: 'demon_core', quantity: 1, chance: 0.4 },
      { type: 'item', itemId: 'soul_crystal', quantity: 1, chance: 0.3 },
      { type: 'item', itemId: 'snake_gallbladder', quantity: 1, chance: 0.3 },
    ],
    talentPool: ['attack_boost', 'defense_boost', 'crit_boost', 'life_steal', 'all_stats'],
    dailyLimit: 2, entryCost: { type: 'spirit_stone', amount: 100 },
  },
  {
    id: 'ancient_ruins', name: '上古遗迹',
    description: '上古大能陨落之地，危机四伏但宝藏无数。',
    difficulty: 4, floors: 12, requiredLevel: 15,
    roomPool: ['combat', 'elite', 'elite', 'treasure', 'shop', 'event', 'rest', 'boss'],
    enemyPool: ['ancient_guardian', 'spirit_puppet', 'wandering_cultivator'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 1000, chance: 1.0 },
      { type: 'technique', itemId: 'random_technique', quantity: 1, chance: 0.1 },
      { type: 'item', itemId: 'ancient_artifact', quantity: 1, chance: 0.2 },
    ],
    talentPool: ['all_stats', 'double_reward', 'life_steal', 'invincibility'],
    dailyLimit: 1, entryCost: { type: 'spirit_stone', amount: 200 },
  },
  {
    id: 'chaos_void', name: '混沌虚空',
    description: '传说中的终极秘境，只有最强者才能生还。',
    difficulty: 5, floors: 20, requiredLevel: 30,
    roomPool: ['combat', 'elite', 'elite', 'boss', 'treasure', 'shop', 'event'],
    enemyPool: ['chaos_beast', 'void_walker', 'fallen_immortal'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 5000, chance: 1.0 },
      { type: 'item', itemId: 'chaos_essence', quantity: 1, chance: 0.3 },
      { type: 'technique', itemId: 'immortal_technique', quantity: 1, chance: 0.05 },
    ],
    talentPool: ['chaos_power', 'immortal_body', 'time_stop', 'reality_warp'],
    dailyLimit: 1, entryCost: { type: 'spirit_stone', amount: 1000 },
  },
];

// ==================== 秘境天赋 ====================

export const ROGUELIKE_TALENTS = [
  { id: 'attack_boost', name: '力量激增', description: '攻击力提升20%', rarity: 'common', effects: [{ type: 'stat_boost', stat: 'attack', value: 20, isPercentage: true }], stackable: true, maxStacks: 5 },
  { id: 'defense_boost', name: '铁壁', description: '防御力提升20%', rarity: 'common', effects: [{ type: 'stat_boost', stat: 'defense', value: 20, isPercentage: true }], stackable: true, maxStacks: 5 },
  { id: 'speed_boost', name: '疾风', description: '速度提升15%', rarity: 'common', effects: [{ type: 'stat_boost', stat: 'speed', value: 15, isPercentage: true }], stackable: true, maxStacks: 5 },
  { id: 'crit_boost', name: '致命一击', description: '暴击率提升10%', rarity: 'rare', effects: [{ type: 'stat_boost', stat: 'critRate', value: 10, isPercentage: false }], stackable: true, maxStacks: 3 },
  { id: 'fire_mastery', name: '火焰掌控', description: '火属性伤害提升30%', rarity: 'rare', effects: [{ type: 'skill_enhance', stat: 'fire_damage', value: 30, isPercentage: true }], stackable: true, maxStacks: 3 },
  { id: 'burn_immunity', name: '烈焰之体', description: '免疫燃烧效果', rarity: 'rare', effects: [{ type: 'special', value: 1, isPercentage: false }], stackable: false, maxStacks: 1 },
  { id: 'life_steal', name: '吸血', description: '造成伤害的15%转化为生命', rarity: 'epic', effects: [{ type: 'special', value: 15, isPercentage: true }], stackable: true, maxStacks: 3 },
  { id: 'all_stats', name: '全面强化', description: '所有属性提升10%', rarity: 'epic', effects: [{ type: 'stat_boost', stat: 'attack', value: 10, isPercentage: true }, { type: 'stat_boost', stat: 'defense', value: 10, isPercentage: true }, { type: 'stat_boost', stat: 'speed', value: 10, isPercentage: true }, { type: 'stat_boost', stat: 'hp', value: 10, isPercentage: true }], stackable: true, maxStacks: 3 },
  { id: 'double_reward', name: '双倍奖励', description: '获得的奖励翻倍', rarity: 'legendary', effects: [{ type: 'special', value: 2, isPercentage: false }], stackable: false, maxStacks: 1 },
  { id: 'invincibility', name: '金刚不坏', description: '受到的伤害降低50%', rarity: 'legendary', effects: [{ type: 'stat_boost', stat: 'damage_reduction', value: 50, isPercentage: true }], stackable: false, maxStacks: 1 },
  { id: 'chaos_power', name: '混沌之力', description: '攻击力和暴击伤害提升100%', rarity: 'legendary', effects: [{ type: 'stat_boost', stat: 'attack', value: 100, isPercentage: true }, { type: 'stat_boost', stat: 'critDamage', value: 100, isPercentage: true }], stackable: false, maxStacks: 1 },
];
