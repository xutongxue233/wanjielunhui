// 敌人模板种子数据
// 从前端 src/data/combat/enemies.ts 迁移

function enemyType(level: number): string {
  if (level >= 30) return 'BOSS';
  if (level >= 15) return 'ELITE';
  return 'NORMAL';
}

interface EnemyData {
  enemyId: string;
  name: string;
  description: string;
  type: string;
  level: number;
  element: string;
  hpMultiplier: number;
  attackMultiplier: number;
  defenseMultiplier: number;
  speedMultiplier: number;
  skills: string;
  expReward: number;
  spiritStoneReward: number;
  dropTable: string;
}

function e(
  id: string,
  name: string,
  description: string,
  element: string,
  level: number,
  hp: number,
  atk: number,
  def: number,
  spd: number,
  skills: object[],
  expReward: number,
  spiritStoneReward: number,
  dropTable: object[],
): EnemyData {
  return {
    enemyId: id,
    name,
    description,
    type: enemyType(level),
    level,
    element,
    hpMultiplier: hp,
    attackMultiplier: atk,
    defenseMultiplier: def,
    speedMultiplier: spd,
    skills: JSON.stringify(skills),
    expReward,
    spiritStoneReward,
    dropTable: JSON.stringify(dropTable),
  };
}

export const enemyTemplatesData: EnemyData[] = [
  // ==================== 剧情专属敌人 ====================
  e('qingyun_disciple', '青云弟子', '青云宗外门弟子，负责考核新人', 'wood', 3,
    1.0, 0.8, 0.8, 1.0,
    [
      { id: 'basic_sword', name: '基础剑法', description: '青云宗入门剑法', type: 'attack', element: 'metal', mpCost: 8, cooldown: 2, currentCooldown: 0, damageMultiplier: 1.2, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'defense_stance', name: '防御姿态', description: '进入防御姿态，提升防御力', type: 'defense', element: 'neutral', mpCost: 10, cooldown: 4, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 20, duration: 2, statusType: 'defense_up' }] },
    ],
    50, 30, []),

  e('small_demon_wolf', '小妖狼', '妖狼王的手下，身形敏捷', 'neutral', 4,
    0.8, 0.9, 0.5, 1.3,
    [
      { id: 'bite', name: '撕咬', description: '锋利的獠牙撕咬敌人', type: 'attack', element: 'neutral', mpCost: 5, cooldown: 2, currentCooldown: 0, damageMultiplier: 1.3, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'howl', name: '嚎叫', description: '凄厉的嚎叫降低敌人防御', type: 'support', element: 'neutral', mpCost: 8, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'all', effects: [{ type: 'debuff', value: 10, duration: 3, statusType: 'defense_down', chance: 0.6 }] },
    ],
    40, 15,
    [{ itemId: 'wolf_fang', chance: 0.4, quantity: 1 }, { itemId: 'wolf_pelt', chance: 0.3, quantity: 1 }]),

  e('demon_wolf_king', '妖狼王', '统领狼群的妖兽，凶残狡诈', 'neutral', 6,
    2.5, 1.5, 1.2, 1.1,
    [
      { id: 'savage_bite', name: '狂暴撕咬', description: '凶猛的连续撕咬', type: 'attack', element: 'neutral', mpCost: 15, cooldown: 3, currentCooldown: 0, damageMultiplier: 1.8, hitCount: 2, targetType: 'single', effects: [] },
      { id: 'summon_wolves', name: '召唤狼群', description: '召唤狼群协同攻击', type: 'attack', element: 'neutral', mpCost: 20, cooldown: 5, currentCooldown: 0, damageMultiplier: 0.8, hitCount: 3, targetType: 'random', effects: [] },
      { id: 'bloodthirst', name: '嗜血狂化', description: '进入狂化状态，大幅提升攻击力', type: 'support', element: 'neutral', mpCost: 25, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 40, duration: 3, statusType: 'attack_up' }] },
    ],
    200, 80,
    [{ itemId: 'wolf_fang', chance: 1.0, quantity: 3 }, { itemId: 'demon_blood', chance: 0.8, quantity: 1 }, { itemId: 'demon_core', chance: 0.3, quantity: 1 }]),

  e('demon_cultivator', '魔修弟子', '修炼魔功的邪道修士', 'neutral', 8,
    1.2, 1.3, 0.9, 1.1,
    [
      { id: 'demon_qi_blast', name: '魔气冲击', description: '释放腐蚀性的魔气攻击', type: 'attack', element: 'neutral', mpCost: 15, cooldown: 3, currentCooldown: 0, damageMultiplier: 1.6, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 8, duration: 2, statusType: 'poison', chance: 0.4 }] },
      { id: 'blood_drain', name: '吸血术', description: '吸取敌人生命恢复自身', type: 'attack', element: 'neutral', mpCost: 20, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.2, hitCount: 1, targetType: 'single', effects: [{ type: 'heal', value: 30, chance: 1.0 }] },
    ],
    120, 50,
    [{ itemId: 'demon_blood', chance: 0.5, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 20 }]),

  e('demon_elder', '魔修长老', '魔道高手，修为深厚，手段残忍', 'neutral', 12,
    3.0, 2.0, 1.5, 1.0,
    [
      { id: 'demon_flame', name: '魔焰', description: '释放黑色魔焰焚烧敌人', type: 'attack', element: 'fire', mpCost: 25, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 15, duration: 3, statusType: 'burn', chance: 0.5 }] },
      { id: 'soul_devour', name: '灵魂吞噬', description: '吞噬敌人灵魂造成巨大伤害', type: 'ultimate', element: 'neutral', mpCost: 50, cooldown: 6, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'demon_barrier', name: '魔障', description: '召唤魔障抵御攻击', type: 'defense', element: 'neutral', mpCost: 30, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 50, duration: 3, statusType: 'defense_up' }] },
    ],
    500, 200,
    [{ itemId: 'demon_core', chance: 0.8, quantity: 1 }, { itemId: 'demon_blood', chance: 1.0, quantity: 3 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 100 }]),

  // ==================== 入门级敌人 ====================
  e('wild_rabbit', '野兔', '温顺的山林小兽', 'wood', 0, 0.6, 0.4, 0.3, 1.0, [], 5, 1, [{ itemId: 'beast_meat', chance: 0.5, quantity: 1 }]),
  e('wild_chicken', '野鸡', '林间觅食的禽类', 'wood', 0, 0.5, 0.5, 0.2, 0.8, [], 5, 1, [{ itemId: 'feather', chance: 0.6, quantity: 1 }]),
  e('wild_boar', '野猪', '山林中常见的野兽', 'earth', 1, 0.8, 0.6, 0.4, 0.6, [], 10, 2, [{ itemId: 'beast_meat', chance: 0.8, quantity: 1 }, { itemId: 'beast_bone', chance: 0.3, quantity: 1 }]),

  e('spirit_wolf', '灵狼', '吸收了天地灵气的狼妖', 'wood', 2,
    1.0, 0.9, 0.6, 1.2,
    [{ id: 'wolf_claw', name: '狼爪', description: '锋利的爪击', type: 'attack', element: 'wood', mpCost: 10, cooldown: 3, currentCooldown: 0, damageMultiplier: 1.3, hitCount: 1, targetType: 'single', effects: [] }],
    30, 8,
    [{ itemId: 'wolf_fang', chance: 0.5, quantity: 1 }, { itemId: 'spirit_essence', chance: 0.2, quantity: 1 }]),

  e('fire_serpent', '火蛇', '浑身燃烧着烈焰的妖蛇', 'fire', 4,
    0.9, 1.0, 0.5, 1.3,
    [{ id: 'fire_breath', name: '火焰吐息', description: '喷射烈焰', type: 'attack', element: 'fire', mpCost: 15, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.5, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 5, duration: 2, statusType: 'burn', chance: 0.3 }] }],
    60, 20,
    [{ itemId: 'fire_essence', chance: 0.4, quantity: 1 }, { itemId: 'serpent_scale', chance: 0.6, quantity: 2 }]),

  e('rock_golem', '岩石傀儡', '由灵石凝聚而成的傀儡', 'earth', 8,
    2.0, 1.3, 2.0, 0.5,
    [{ id: 'rock_smash', name: '岩石粉碎', description: '以巨大的石拳砸向敌人', type: 'attack', element: 'earth', mpCost: 20, cooldown: 4, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'single', effects: [] }],
    100, 50,
    [{ itemId: 'earth_crystal', chance: 0.5, quantity: 1 }, { itemId: 'golem_core', chance: 0.2, quantity: 1 }]),

  e('wandering_cultivator', '散修', '游荡的修士', 'neutral', 10,
    1.5, 1.5, 1.2, 1.2,
    [
      { id: 'sword_qi', name: '剑气', description: '凝聚剑意化为剑气', type: 'attack', element: 'metal', mpCost: 25, cooldown: 2, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'minor_healing', name: '小回春术', description: '恢复少量生命', type: 'support', element: 'wood', mpCost: 30, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.5, hitCount: 1, targetType: 'self', effects: [] },
    ],
    150, 80,
    [{ itemId: 'spirit_stone', chance: 1.0, quantity: 10 }, { itemId: 'technique_fragment', chance: 0.1, quantity: 1 }]),

  // ==================== 金丹期敌人 ====================
  e('fire_scorpion', '火焰蝎', '浑身燃烧着赤焰的巨蝎', 'fire', 13,
    1.3, 1.4, 1.1, 1.0,
    [
      { id: 'fire_sting', name: '烈焰尾刺', description: '以灼热的尾刺攻击敌人', type: 'attack', element: 'fire', mpCost: 20, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.2, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 20, duration: 3, statusType: 'burn', chance: 0.5 }] },
      { id: 'venom_spray', name: '毒液喷射', description: '喷射灼热毒液', type: 'attack', element: 'fire', mpCost: 25, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.5, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 15, duration: 2, statusType: 'defense_down', chance: 0.4 }] },
    ],
    250, 120,
    [{ itemId: 'fire_scorpion_venom', chance: 0.5, quantity: 1 }, { itemId: 'fire_essence', chance: 0.3, quantity: 1 }]),

  e('golden_crab', '金甲蟹', '身披金色甲壳的巨型螃蟹', 'metal', 15,
    2.5, 1.2, 2.5, 0.6,
    [
      { id: 'iron_clamp', name: '铁钳夹击', description: '以坚硬的蟹钳夹击敌人', type: 'attack', element: 'metal', mpCost: 20, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 2, targetType: 'single', effects: [] },
      { id: 'golden_shell', name: '金甲护体', description: '激发甲壳之力', type: 'defense', element: 'metal', mpCost: 30, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 60, duration: 3, statusType: 'defense_up' }] },
    ],
    300, 150,
    [{ itemId: 'golden_crab_shell', chance: 0.5, quantity: 1 }, { itemId: 'iron_ore', chance: 0.8, quantity: 3 }]),

  e('thunder_eagle', '雷鹰', '翱翔于雷云之间的妖禽', 'metal', 17,
    1.0, 1.8, 0.8, 2.0,
    [
      { id: 'thunder_dive', name: '雷电俯冲', description: '携带雷电从高空俯冲', type: 'attack', element: 'metal', mpCost: 25, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.8, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'chain_lightning', name: '连锁闪电', description: '释放连锁雷电', type: 'attack', element: 'metal', mpCost: 35, cooldown: 5, currentCooldown: 0, damageMultiplier: 1.5, hitCount: 1, targetType: 'all', effects: [] },
    ],
    350, 180,
    [{ itemId: 'thunder_eagle_feather', chance: 0.5, quantity: 1 }, { itemId: 'spirit_essence', chance: 0.3, quantity: 2 }]),

  e('jindan_cultivator', '金丹散修', '已凝结金丹的散修高手', 'neutral', 18,
    2.0, 1.8, 1.5, 1.3,
    [
      { id: 'golden_core_blast', name: '金丹爆发', description: '引动金丹之力释放强大攻击', type: 'attack', element: 'neutral', mpCost: 30, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'sword_rain', name: '万剑归宗', description: '操控飞剑形成剑雨', type: 'ultimate', element: 'metal', mpCost: 50, cooldown: 6, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'all', effects: [] },
      { id: 'golden_core_shield', name: '金丹护罩', description: '以金丹之力形成护罩', type: 'defense', element: 'neutral', mpCost: 35, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 40, duration: 3, statusType: 'defense_up' }] },
    ],
    400, 200,
    [{ itemId: 'spirit_stone', chance: 1.0, quantity: 50 }, { itemId: 'healing_pill_jindan', chance: 0.3, quantity: 1 }, { itemId: 'jindan_pill', chance: 0.05, quantity: 1 }]),

  // ==================== 元婴期敌人 ====================
  e('dark_serpent', '冥蛇', '栖息于幽冥之地的巨蛇', 'water', 19,
    1.5, 1.6, 1.2, 1.5,
    [
      { id: 'venom_fang', name: '冥毒噬咬', description: '以浸透冥毒的獠牙攻击', type: 'attack', element: 'water', mpCost: 30, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 30, duration: 3, statusType: 'poison', chance: 0.6 }] },
      { id: 'serpent_coil', name: '蛇缠', description: '以巨大的身躯缠绕敌人', type: 'support', element: 'water', mpCost: 40, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'single', effects: [{ type: 'debuff', value: 30, duration: 2, statusType: 'speed_down', chance: 0.7 }] },
    ],
    500, 250,
    [{ itemId: 'snake_gallbladder', chance: 0.4, quantity: 1 }, { itemId: 'demon_blood', chance: 0.6, quantity: 2 }]),

  e('soul_bat', '噬魂蝠', '以吞噬灵魂为食的妖蝠', 'neutral', 21,
    1.2, 2.0, 0.8, 1.8,
    [
      { id: 'soul_drain', name: '噬魂术', description: '吞噬敌人灵魂', type: 'attack', element: 'neutral', mpCost: 35, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.8, hitCount: 1, targetType: 'single', effects: [{ type: 'heal', value: 40, chance: 1.0 }] },
      { id: 'sonic_screech', name: '灵魂尖啸', description: '发出撕裂灵魂的尖啸', type: 'attack', element: 'neutral', mpCost: 45, cooldown: 5, currentCooldown: 0, damageMultiplier: 1.8, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 20, duration: 2, statusType: 'attack_down', chance: 0.4 }] },
    ],
    600, 300,
    [{ itemId: 'soul_crystal', chance: 0.4, quantity: 1 }, { itemId: 'demon_core', chance: 0.3, quantity: 1 }]),

  e('millennium_treant', '千年树妖', '修炼千年的古树成精', 'wood', 23,
    3.5, 1.5, 2.0, 0.5,
    [
      { id: 'root_bind', name: '根系缠绕', description: '从地下伸出根系缠绕所有敌人', type: 'attack', element: 'wood', mpCost: 35, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.8, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 2, statusType: 'speed_down', chance: 0.5 }] },
      { id: 'life_absorption', name: '生机汲取', description: '汲取大地生机恢复自身', type: 'support', element: 'wood', mpCost: 40, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'self', effects: [{ type: 'hot', value: 50, duration: 3, chance: 1.0 }] },
      { id: 'ancient_slam', name: '古木横扫', description: '以巨大的枝干横扫敌人', type: 'attack', element: 'wood', mpCost: 30, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'single', effects: [] },
    ],
    750, 400,
    [{ itemId: 'millennium_tree_heart', chance: 0.3, quantity: 1 }, { itemId: 'lingzhi', chance: 0.8, quantity: 3 }, { itemId: 'blood_ginseng', chance: 0.4, quantity: 1 }]),

  e('yuanying_elder', '元婴老怪', '已凝结元婴的老怪物', 'neutral', 24,
    3.0, 2.2, 1.8, 1.2,
    [
      { id: 'yuanying_strike', name: '元婴出窍', description: '元婴离体发动毁灭性攻击', type: 'ultimate', element: 'neutral', mpCost: 60, cooldown: 6, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'spatial_tear', name: '空间裂斩', description: '撕裂空间造成范围伤害', type: 'attack', element: 'neutral', mpCost: 45, cooldown: 4, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'all', effects: [] },
      { id: 'spirit_shield', name: '元神护体', description: '以元神之力形成护盾', type: 'defense', element: 'neutral', mpCost: 40, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 60, duration: 3, statusType: 'defense_up' }] },
    ],
    1000, 500,
    [{ itemId: 'spirit_stone', chance: 1.0, quantity: 200 }, { itemId: 'demon_core', chance: 0.6, quantity: 2 }, { itemId: 'yuanying_pill', chance: 0.03, quantity: 1 }]),

  // ==================== 化神期敌人 ====================
  e('sky_wolf', '天狼', '传说中的天狼星降临化身', 'metal', 25,
    2.5, 2.2, 1.5, 1.6,
    [
      { id: 'celestial_fang', name: '天狼噬', description: '以天狼之牙撕裂一切', type: 'attack', element: 'metal', mpCost: 40, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'howling_storm', name: '天狼啸月', description: '仰天长啸引发天地异变', type: 'attack', element: 'metal', mpCost: 55, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 20, duration: 2, statusType: 'defense_down', chance: 0.5 }] },
      { id: 'wolf_fury', name: '狂暴本能', description: '激发天狼血脉', type: 'support', element: 'neutral', mpCost: 35, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 50, duration: 3, statusType: 'attack_up' }] },
    ],
    1200, 600,
    [{ itemId: 'wolf_fang', chance: 1.0, quantity: 5 }, { itemId: 'demon_core', chance: 0.5, quantity: 2 }]),

  e('nine_tail_fox', '九尾妖狐', '修炼数千年的妖狐', 'fire', 27,
    2.0, 2.5, 1.2, 1.8,
    [
      { id: 'fox_fire', name: '狐火焚天', description: '释放九尾妖火焚烧敌人', type: 'attack', element: 'fire', mpCost: 50, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 40, duration: 3, statusType: 'burn', chance: 0.6 }] },
      { id: 'illusion', name: '幻术迷心', description: '施展幻术迷惑敌人', type: 'support', element: 'neutral', mpCost: 45, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 3, statusType: 'attack_down', chance: 0.5 }, { type: 'debuff', value: 20, duration: 3, statusType: 'speed_down', chance: 0.5 }] },
      { id: 'charm_strike', name: '魅影连击', description: '化出分身进行连续攻击', type: 'attack', element: 'fire', mpCost: 55, cooldown: 4, currentCooldown: 0, damageMultiplier: 1.8, hitCount: 3, targetType: 'random', effects: [] },
    ],
    1500, 800,
    [{ itemId: 'fox_spirit_orb', chance: 0.3, quantity: 1 }, { itemId: 'demon_blood', chance: 0.8, quantity: 3 }, { itemId: 'phoenix_blood', chance: 0.05, quantity: 1 }]),

  e('fallen_immortal', '堕落仙人', '曾经的仙界存在', 'neutral', 29,
    3.0, 2.8, 2.0, 1.3,
    [
      { id: 'immortal_strike', name: '仙诀残影', description: '施展残留的仙家手段', type: 'ultimate', element: 'neutral', mpCost: 70, cooldown: 6, currentCooldown: 0, damageMultiplier: 5.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'corruption_wave', name: '堕落之波', description: '释放腐化之力侵蚀所有敌人', type: 'attack', element: 'neutral', mpCost: 55, cooldown: 4, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 35, duration: 3, statusType: 'poison', chance: 0.5 }] },
      { id: 'fallen_barrier', name: '仙界残垣', description: '残留的仙界屏障', type: 'defense', element: 'neutral', mpCost: 50, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 80, duration: 3, statusType: 'defense_up' }] },
    ],
    2000, 1000,
    [{ itemId: 'spirit_stone', chance: 1.0, quantity: 500 }, { itemId: 'phoenix_blood', chance: 0.1, quantity: 1 }]),

  e('huashen_demon_lord', '化神魔尊', '化神期的魔道至尊', 'fire', 30,
    4.0, 3.0, 2.5, 1.2,
    [
      { id: 'demon_domain', name: '魔域降临', description: '展开魔域，对所有敌人造成毁灭性打击', type: 'ultimate', element: 'fire', mpCost: 80, cooldown: 7, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 30, duration: 3, statusType: 'attack_down', chance: 0.6 }] },
      { id: 'hellfire', name: '地狱业火', description: '召唤地狱业火焚烧一切', type: 'attack', element: 'fire', mpCost: 60, cooldown: 4, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 50, duration: 3, statusType: 'burn', chance: 0.7 }] },
      { id: 'demon_regeneration', name: '魔体再生', description: '魔尊的恢复能力', type: 'support', element: 'neutral', mpCost: 50, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'hot', value: 80, duration: 3, chance: 1.0 }] },
    ],
    2500, 1200,
    [{ itemId: 'demon_core', chance: 1.0, quantity: 3 }, { itemId: 'demon_blood', chance: 1.0, quantity: 5 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 800 }]),

  // ==================== 修罗场敌人 ====================
  e('shura_warrior', '修罗战士', '修罗场中的基础战士', 'fire', 25, 1.8, 2.0, 1.4, 1.3,
    [
      { id: 'shura_slash', name: '修罗斩', description: '以修罗之力斩出凌厉一击', type: 'attack', element: 'fire', mpCost: 35, cooldown: 3, currentCooldown: 0, damageMultiplier: 2.8, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'blood_frenzy', name: '血怒', description: '进入狂暴状态', type: 'support', element: 'fire', mpCost: 30, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 35, duration: 3, statusType: 'attack_up' }] },
    ],
    1100, 550, [{ itemId: 'shura_blood', chance: 0.4, quantity: 1 }, { itemId: 'fire_essence', chance: 0.5, quantity: 2 }]),

  e('shura_general', '修罗将军', '修罗军团的统领', 'fire', 26, 2.5, 2.3, 1.8, 1.2,
    [
      { id: 'shura_storm', name: '修罗风暴', description: '掀起血色风暴', type: 'attack', element: 'fire', mpCost: 50, cooldown: 4, currentCooldown: 0, damageMultiplier: 2.2, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 35, duration: 3, statusType: 'burn', chance: 0.5 }] },
      { id: 'war_cry', name: '战吼', description: '发出震慑敌人的战吼', type: 'support', element: 'neutral', mpCost: 40, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'all', effects: [{ type: 'debuff', value: 20, duration: 3, statusType: 'attack_down', chance: 0.6 }, { type: 'debuff', value: 15, duration: 3, statusType: 'defense_down', chance: 0.6 }] },
      { id: 'execute', name: '处决', description: '对单一目标发动致命一击', type: 'attack', element: 'fire', mpCost: 45, cooldown: 4, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'single', effects: [] },
    ],
    1400, 700, [{ itemId: 'shura_blood', chance: 0.6, quantity: 1 }, { itemId: 'demon_core', chance: 0.4, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 300 }]),

  e('flame_demon', '炎魔', '由炼狱业火凝聚而成的恐怖存在', 'fire', 26, 2.0, 2.5, 1.3, 1.4,
    [
      { id: 'inferno_blast', name: '地狱火焰', description: '释放地狱之火', type: 'attack', element: 'fire', mpCost: 45, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 45, duration: 3, statusType: 'burn', chance: 0.7 }] },
      { id: 'flame_wave', name: '炎浪', description: '释放火焰波动', type: 'attack', element: 'fire', mpCost: 55, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 30, duration: 2, statusType: 'burn', chance: 0.5 }] },
    ],
    1300, 650, [{ itemId: 'fire_essence', chance: 0.8, quantity: 3 }, { itemId: 'demon_blood', chance: 0.5, quantity: 2 }]),

  e('golden_puppet', '金甲傀儡', '以金属灵材炼制的战斗傀儡', 'metal', 27, 3.0, 2.0, 2.8, 0.7,
    [
      { id: 'metal_fist', name: '金刚重拳', description: '以坚硬的金属拳头重击', type: 'attack', element: 'metal', mpCost: 40, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.2, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'iron_defense', name: '铁壁', description: '激发金属护甲', type: 'defense', element: 'metal', mpCost: 50, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 70, duration: 3, statusType: 'defense_up' }] },
      { id: 'shockwave', name: '金属震波', description: '释放金属能量震波', type: 'attack', element: 'metal', mpCost: 60, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 20, duration: 2, statusType: 'speed_down', chance: 0.5 }] },
    ],
    1500, 750, [{ itemId: 'iron_ore', chance: 1.0, quantity: 5 }, { itemId: 'golem_core', chance: 0.5, quantity: 1 }, { itemId: 'golden_crab_shell', chance: 0.3, quantity: 1 }]),

  e('shura_king', '修罗王', '修罗界的至高霸主', 'fire', 28, 4.0, 2.8, 2.2, 1.3,
    [
      { id: 'shura_domain', name: '修罗领域', description: '展开修罗领域', type: 'ultimate', element: 'fire', mpCost: 75, cooldown: 6, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 3, statusType: 'defense_down', chance: 0.6 }] },
      { id: 'blood_sacrifice', name: '血祭', description: '以血为引发动致命攻击', type: 'attack', element: 'fire', mpCost: 55, cooldown: 4, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'single', effects: [{ type: 'heal', value: 50, chance: 1.0 }] },
      { id: 'king_wrath', name: '王者之怒', description: '激发王者之力', type: 'support', element: 'fire', mpCost: 50, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 50, duration: 3, statusType: 'attack_up' }, { type: 'buff', value: 30, duration: 3, statusType: 'speed_up' }] },
    ],
    2200, 1100, [{ itemId: 'shura_blood', chance: 1.0, quantity: 3 }, { itemId: 'demon_core', chance: 0.7, quantity: 2 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 600 }, { itemId: 'huashen_pill', chance: 0.03, quantity: 1 }]),

  // ==================== 合体期敌人 ====================
  e('ancient_dragon', '远古巨龙', '沉睡万年的远古巨龙', 'fire', 31, 5.0, 3.0, 3.0, 1.0,
    [
      { id: 'dragon_breath', name: '龙息吐息', description: '喷吐毁灭性的龙息', type: 'ultimate', element: 'fire', mpCost: 80, cooldown: 5, currentCooldown: 0, damageMultiplier: 4.5, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 60, duration: 3, statusType: 'burn', chance: 0.8 }] },
      { id: 'tail_sweep', name: '龙尾横扫', description: '以巨大的龙尾横扫', type: 'attack', element: 'neutral', mpCost: 50, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'all', effects: [] },
      { id: 'dragon_scales', name: '龙鳞护体', description: '激发龙鳞之力', type: 'defense', element: 'earth', mpCost: 60, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 100, duration: 3, statusType: 'defense_up' }] },
    ],
    3000, 1500, [{ itemId: 'dragon_scale', chance: 0.3, quantity: 1 }, { itemId: 'demon_core', chance: 0.8, quantity: 3 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1000 }]),

  e('thunder_puppet', '天雷傀儡', '以天雷之力驱动的上古傀儡', 'metal', 31, 4.0, 2.8, 3.5, 0.9,
    [
      { id: 'thunder_fist', name: '雷霆重拳', description: '以雷电灌注的铁拳轰击', type: 'attack', element: 'metal', mpCost: 50, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'lightning_field', name: '雷电领域', description: '展开雷电力场', type: 'attack', element: 'metal', mpCost: 70, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.5, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 2, statusType: 'speed_down', chance: 0.6 }] },
      { id: 'thunder_shield', name: '雷盾', description: '以天雷之力凝成护盾', type: 'defense', element: 'metal', mpCost: 55, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 100, duration: 3, statusType: 'defense_up' }] },
    ],
    3000, 1500, [{ itemId: 'thunder_essence', chance: 0.2, quantity: 1 }, { itemId: 'golem_core', chance: 0.6, quantity: 2 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1000 }]),

  e('jiuyou_demon_general', '九幽魔将', '来自九幽地狱的魔族将领', 'water', 32, 4.5, 3.2, 2.5, 1.4,
    [
      { id: 'nether_slash', name: '幽冥斩', description: '以九幽之力劈出致命一刀', type: 'attack', element: 'water', mpCost: 55, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.8, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 50, duration: 3, statusType: 'poison', chance: 0.5 }] },
      { id: 'ghost_army', name: '召唤阴兵', description: '召唤九幽阴兵围攻', type: 'ultimate', element: 'water', mpCost: 85, cooldown: 6, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 2, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 2, statusType: 'attack_down', chance: 0.5 }] },
      { id: 'nether_armor', name: '幽冥战甲', description: '以阴气凝聚的战甲护体', type: 'support', element: 'water', mpCost: 50, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 80, duration: 3, statusType: 'defense_up' }, { type: 'buff', value: 40, duration: 3, statusType: 'attack_up' }] },
    ],
    3500, 1800, [{ itemId: 'soul_crystal', chance: 0.5, quantity: 2 }, { itemId: 'demon_blood', chance: 0.8, quantity: 4 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1200 }]),

  e('chaos_beast', '混沌兽', '诞生于混沌之中的太古异兽', 'neutral', 32, 5.5, 3.0, 2.8, 1.1,
    [
      { id: 'chaos_claw', name: '混沌利爪', description: '以蕴含混沌之力的利爪撕裂', type: 'attack', element: 'neutral', mpCost: 55, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 2, targetType: 'single', effects: [] },
      { id: 'chaos_roar', name: '混沌咆哮', description: '发出震碎虚空的咆哮', type: 'attack', element: 'neutral', mpCost: 75, cooldown: 5, currentCooldown: 0, damageMultiplier: 2.8, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 20, duration: 2, statusType: 'defense_down', chance: 0.6 }] },
      { id: 'chaos_devour', name: '混沌吞噬', description: '吞噬天地灵气恢复自身', type: 'support', element: 'neutral', mpCost: 60, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'hot', value: 100, duration: 3, chance: 1.0 }] },
    ],
    3500, 1800, [{ itemId: 'chaos_essence', chance: 0.1, quantity: 1 }, { itemId: 'demon_core', chance: 0.8, quantity: 3 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1200 }]),

  // ==================== 大乘期敌人 ====================
  e('sky_demon', '天魔', '来自魔界深渊的天魔', 'neutral', 33, 4.0, 3.5, 2.0, 1.5,
    [
      { id: 'heart_demon', name: '心魔入侵', description: '入侵敌人心境', type: 'ultimate', element: 'neutral', mpCost: 90, cooldown: 6, currentCooldown: 0, damageMultiplier: 5.0, hitCount: 1, targetType: 'single', effects: [{ type: 'debuff', value: 30, duration: 3, statusType: 'attack_down', chance: 0.7 }] },
      { id: 'fear_wave', name: '恐惧之波', description: '释放恐惧波动', type: 'attack', element: 'neutral', mpCost: 65, cooldown: 4, currentCooldown: 0, damageMultiplier: 2.8, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 2, statusType: 'defense_down', chance: 0.5 }, { type: 'debuff', value: 20, duration: 2, statusType: 'speed_down', chance: 0.5 }] },
      { id: 'demon_feast', name: '恐惧盛宴', description: '吞噬敌人的恐惧', type: 'attack', element: 'neutral', mpCost: 55, cooldown: 4, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'single', effects: [{ type: 'heal', value: 60, chance: 1.0 }] },
    ],
    4000, 2000, [{ itemId: 'soul_crystal', chance: 0.5, quantity: 2 }, { itemId: 'demon_core', chance: 1.0, quantity: 3 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1500 }]),

  e('immortal_guard', '仙界守卫', '仙界派遣的守卫', 'metal', 33, 4.5, 3.3, 3.5, 1.2,
    [
      { id: 'immortal_sword', name: '仙剑斩', description: '以仙器长剑劈出蕴含仙力的剑气', type: 'attack', element: 'metal', mpCost: 60, cooldown: 3, currentCooldown: 0, damageMultiplier: 3.8, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'golden_barrier', name: '金光结界', description: '展开金色结界', type: 'defense', element: 'metal', mpCost: 65, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 130, duration: 3, statusType: 'defense_up' }] },
      { id: 'divine_judgment', name: '天罚', description: '以仙界权柄降下天罚', type: 'ultimate', element: 'metal', mpCost: 90, cooldown: 6, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 25, duration: 2, statusType: 'attack_down', chance: 0.5 }] },
    ],
    4500, 2200, [{ itemId: 'thunder_essence', chance: 0.2, quantity: 1 }, { itemId: 'dragon_scale', chance: 0.15, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1500 }]),

  e('heti_powerhouse', '合体期大能', '达到合体期的绝世强者', 'neutral', 34, 5.0, 3.5, 3.0, 1.3,
    [
      { id: 'heaven_earth_merge', name: '天地合一', description: '融合天地之力发动毁灭一击', type: 'ultimate', element: 'neutral', mpCost: 100, cooldown: 7, currentCooldown: 0, damageMultiplier: 6.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'law_suppression', name: '法则镇压', description: '以法则之力镇压所有敌人', type: 'attack', element: 'neutral', mpCost: 75, cooldown: 5, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 30, duration: 3, statusType: 'defense_down', chance: 0.6 }] },
      { id: 'dao_protection', name: '大道护身', description: '以大道之力护体', type: 'defense', element: 'neutral', mpCost: 70, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 120, duration: 3, statusType: 'defense_up' }] },
    ],
    5000, 2500, [{ itemId: 'spirit_stone', chance: 1.0, quantity: 2000 }, { itemId: 'dragon_scale', chance: 0.2, quantity: 1 }, { itemId: 'phoenix_blood', chance: 0.15, quantity: 1 }]),

  e('ancient_demon_dragon', '太古妖龙', '太古时代遗留的妖龙', 'fire', 34, 6.0, 3.5, 3.2, 1.0,
    [
      { id: 'ancient_dragon_breath', name: '太古龙息', description: '喷吐蕴含太古之力的龙息', type: 'ultimate', element: 'fire', mpCost: 95, cooldown: 6, currentCooldown: 0, damageMultiplier: 5.5, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 70, duration: 3, statusType: 'burn', chance: 0.8 }] },
      { id: 'dragon_claw_strike', name: '龙爪撕裂', description: '以巨大龙爪撕裂目标', type: 'attack', element: 'fire', mpCost: 65, cooldown: 3, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 2, targetType: 'single', effects: [] },
      { id: 'ancient_scales', name: '太古龙鳞', description: '太古龙鳞硬化', type: 'defense', element: 'earth', mpCost: 70, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 140, duration: 3, statusType: 'defense_up' }, { type: 'hot', value: 80, duration: 3, chance: 1.0 }] },
    ],
    5500, 2800, [{ itemId: 'dragon_scale', chance: 0.4, quantity: 2 }, { itemId: 'phoenix_blood', chance: 0.1, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 2000 }]),

  e('void_rift_beast', '虚空裂隙兽', '从虚空裂隙中诞生的异界生物', 'neutral', 34, 3.5, 4.0, 1.8, 2.0,
    [
      { id: 'void_tear', name: '虚空撕裂', description: '撕裂空间造成巨大伤害', type: 'attack', element: 'neutral', mpCost: 60, cooldown: 3, currentCooldown: 0, damageMultiplier: 4.2, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'spatial_storm', name: '空间风暴', description: '引发空间风暴', type: 'attack', element: 'neutral', mpCost: 80, cooldown: 5, currentCooldown: 0, damageMultiplier: 3.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 30, duration: 2, statusType: 'speed_down', chance: 0.6 }] },
      { id: 'void_blink', name: '虚空闪现', description: '遁入虚空', type: 'support', element: 'neutral', mpCost: 50, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 60, duration: 3, statusType: 'speed_up' }] },
    ],
    5000, 2500, [{ itemId: 'soul_crystal', chance: 0.4, quantity: 2 }, { itemId: 'chaos_essence', chance: 0.08, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 1800 }]),

  e('dacheng_cultivator', '大乘期修士', '大道将成的绝世强者', 'neutral', 34, 5.0, 3.8, 3.0, 1.3,
    [
      { id: 'dao_strike', name: '大道一击', description: '以大道之力发动毁灭性打击', type: 'ultimate', element: 'neutral', mpCost: 100, cooldown: 7, currentCooldown: 0, damageMultiplier: 6.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'heaven_pressure', name: '天威镇压', description: '以天威之力镇压所有敌人', type: 'attack', element: 'neutral', mpCost: 80, cooldown: 5, currentCooldown: 0, damageMultiplier: 3.2, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 30, duration: 3, statusType: 'defense_down', chance: 0.6 }, { type: 'debuff', value: 20, duration: 2, statusType: 'attack_down', chance: 0.5 }] },
      { id: 'dao_barrier', name: '道法护体', description: '以道法凝成护体屏障', type: 'defense', element: 'neutral', mpCost: 70, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 120, duration: 3, statusType: 'defense_up' }] },
    ],
    5500, 2800, [{ itemId: 'spirit_stone', chance: 1.0, quantity: 2000 }, { itemId: 'dragon_scale', chance: 0.2, quantity: 1 }, { itemId: 'dacheng_pill', chance: 0.03, quantity: 1 }]),

  // ==================== 渡劫期敌人 ====================
  e('tribulation_guardian', '天劫守护者', '天道降下的守护者', 'metal', 35, 5.0, 4.0, 3.0, 1.5,
    [
      { id: 'divine_thunder', name: '天雷灭世', description: '召唤天雷轰击所有敌人', type: 'ultimate', element: 'metal', mpCost: 100, cooldown: 6, currentCooldown: 0, damageMultiplier: 5.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 80, duration: 3, statusType: 'burn', chance: 0.8 }] },
      { id: 'judgment_bolt', name: '天道审判', description: '以天道之力审判目标', type: 'attack', element: 'metal', mpCost: 80, cooldown: 4, currentCooldown: 0, damageMultiplier: 4.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'thunder_armor', name: '雷甲护体', description: '以天雷之力形成护甲', type: 'defense', element: 'metal', mpCost: 70, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 150, duration: 3, statusType: 'defense_up' }] },
    ],
    8000, 4000, [{ itemId: 'thunder_essence', chance: 0.3, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 3000 }, { itemId: 'dragon_scale', chance: 0.2, quantity: 1 }]),

  e('dao_enforcer', '天道执行者', '天道意志的化身', 'neutral', 35, 5.5, 4.2, 3.5, 1.4,
    [
      { id: 'dao_annihilation', name: '天道湮灭', description: '以天道之力湮灭一切', type: 'ultimate', element: 'neutral', mpCost: 110, cooldown: 7, currentCooldown: 0, damageMultiplier: 6.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'law_chains', name: '法则锁链', description: '以法则之力束缚所有敌人', type: 'attack', element: 'neutral', mpCost: 85, cooldown: 5, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 30, duration: 2, statusType: 'speed_down', chance: 0.7 }, { type: 'debuff', value: 25, duration: 2, statusType: 'attack_down', chance: 0.5 }] },
      { id: 'dao_shield', name: '天道庇护', description: '获得天道庇护', type: 'defense', element: 'neutral', mpCost: 75, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 160, duration: 3, statusType: 'defense_up' }] },
    ],
    9000, 4500, [{ itemId: 'thunder_essence', chance: 0.4, quantity: 1 }, { itemId: 'phoenix_blood', chance: 0.2, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 3500 }]),

  e('tribulation_thunder_avatar', '劫雷化身', '天劫雷霆凝聚而成的意识体', 'metal', 35, 4.5, 4.5, 2.5, 1.8,
    [
      { id: 'nine_heaven_thunder', name: '九天雷罚', description: '引动九天之雷降下雷罚', type: 'ultimate', element: 'metal', mpCost: 100, cooldown: 6, currentCooldown: 0, damageMultiplier: 5.5, hitCount: 3, targetType: 'random', effects: [{ type: 'dot', value: 90, duration: 2, statusType: 'burn', chance: 0.7 }] },
      { id: 'thunder_chain', name: '连环雷击', description: '释放连环雷电', type: 'attack', element: 'metal', mpCost: 75, cooldown: 4, currentCooldown: 0, damageMultiplier: 3.5, hitCount: 1, targetType: 'all', effects: [] },
      { id: 'thunder_body', name: '雷体化身', description: '化为纯粹雷电之体', type: 'support', element: 'metal', mpCost: 60, cooldown: 5, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'buff', value: 60, duration: 3, statusType: 'attack_up' }, { type: 'buff', value: 40, duration: 3, statusType: 'speed_up' }] },
    ],
    8500, 4200, [{ itemId: 'thunder_essence', chance: 0.5, quantity: 2 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 3000 }]),

  // ==================== 仙人期敌人 ====================
  e('tribulation_demon_king', '渡劫魔君', '正在渡劫的魔道至强者', 'fire', 36, 6.0, 4.5, 3.5, 1.3,
    [
      { id: 'demon_tribulation', name: '魔劫天降', description: '引动天劫与魔力融合', type: 'ultimate', element: 'fire', mpCost: 120, cooldown: 7, currentCooldown: 0, damageMultiplier: 7.0, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'annihilation_wave', name: '灭世魔波', description: '释放灭世级别的魔气波动', type: 'attack', element: 'fire', mpCost: 90, cooldown: 5, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 100, duration: 3, statusType: 'burn', chance: 0.7 }] },
      { id: 'demon_king_rebirth', name: '魔君重生', description: '魔君的不死之力', type: 'support', element: 'neutral', mpCost: 80, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'hot', value: 150, duration: 3, chance: 1.0 }, { type: 'buff', value: 50, duration: 3, statusType: 'attack_up' }] },
    ],
    12000, 6000, [{ itemId: 'thunder_essence', chance: 0.5, quantity: 1 }, { itemId: 'phoenix_blood', chance: 0.3, quantity: 1 }, { itemId: 'dragon_scale', chance: 0.3, quantity: 1 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 5000 }]),

  e('fallen_true_immortal', '堕落真仙', '曾经飞升仙界的真仙', 'neutral', 36, 7.0, 4.8, 3.8, 1.5,
    [
      { id: 'immortal_technique', name: '仙术残章', description: '施展残留的仙界神通', type: 'ultimate', element: 'neutral', mpCost: 130, cooldown: 7, currentCooldown: 0, damageMultiplier: 7.5, hitCount: 1, targetType: 'single', effects: [] },
      { id: 'celestial_wave', name: '仙威震慑', description: '释放仙人之威', type: 'attack', element: 'neutral', mpCost: 95, cooldown: 5, currentCooldown: 0, damageMultiplier: 4.0, hitCount: 1, targetType: 'all', effects: [{ type: 'debuff', value: 35, duration: 3, statusType: 'attack_down', chance: 0.6 }, { type: 'debuff', value: 30, duration: 3, statusType: 'defense_down', chance: 0.6 }] },
      { id: 'immortal_body', name: '仙体不朽', description: '激发仙体之力', type: 'support', element: 'neutral', mpCost: 90, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'hot', value: 200, duration: 3, chance: 1.0 }, { type: 'buff', value: 50, duration: 3, statusType: 'defense_up' }] },
    ],
    15000, 8000, [{ itemId: 'phoenix_blood', chance: 0.4, quantity: 1 }, { itemId: 'dragon_scale', chance: 0.4, quantity: 1 }, { itemId: 'thunder_essence', chance: 0.5, quantity: 2 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 8000 }]),

  e('chaos_demon_god', '混沌魔神', '太古时代的混沌魔神', 'fire', 36, 8.0, 5.0, 4.0, 1.2,
    [
      { id: 'chaos_destruction', name: '混沌灭世', description: '释放混沌本源之力', type: 'ultimate', element: 'neutral', mpCost: 150, cooldown: 7, currentCooldown: 0, damageMultiplier: 8.0, hitCount: 1, targetType: 'all', effects: [{ type: 'dot', value: 120, duration: 3, statusType: 'burn', chance: 0.8 }] },
      { id: 'chaos_flame', name: '混沌魔焰', description: '燃烧混沌之火', type: 'attack', element: 'fire', mpCost: 100, cooldown: 4, currentCooldown: 0, damageMultiplier: 5.0, hitCount: 1, targetType: 'single', effects: [{ type: 'dot', value: 100, duration: 3, statusType: 'burn', chance: 0.8 }] },
      { id: 'chaos_rebirth', name: '混沌再生', description: '以混沌之力再生', type: 'support', element: 'neutral', mpCost: 100, cooldown: 6, currentCooldown: 0, damageMultiplier: 0, hitCount: 0, targetType: 'self', effects: [{ type: 'hot', value: 250, duration: 3, chance: 1.0 }, { type: 'buff', value: 60, duration: 3, statusType: 'attack_up' }, { type: 'buff', value: 80, duration: 3, statusType: 'defense_up' }] },
    ],
    20000, 10000, [{ itemId: 'chaos_essence', chance: 0.3, quantity: 1 }, { itemId: 'phoenix_blood', chance: 0.5, quantity: 1 }, { itemId: 'dragon_scale', chance: 0.5, quantity: 2 }, { itemId: 'thunder_essence', chance: 0.5, quantity: 2 }, { itemId: 'spirit_stone', chance: 1.0, quantity: 10000 }]),
];
