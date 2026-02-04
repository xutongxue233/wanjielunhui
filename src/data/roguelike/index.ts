import { v4 as uuidv4 } from 'uuid';

// 秘境配置
export interface SecretRealm {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  floors: number;
  requiredLevel: number;

  // 生成规则
  roomPool: RoomType[];
  enemyPool: string[];
  rewardPool: RealmReward[];
  talentPool: string[];

  // 入场限制
  dailyLimit: number;
  entryCost: { type: string; amount: number };
}

// 房间类型
export type RoomType = 'combat' | 'treasure' | 'rest' | 'shop' | 'event' | 'boss' | 'elite';

// 房间配置
export interface Room {
  id: string;
  type: RoomType;
  floor: number;
  position: number;
  connections: string[];
  isCleared: boolean;
  isCurrent: boolean;

  // 房间内容
  enemies?: string[];
  rewards?: RealmReward[];
  event?: RealmEvent;
  shop?: ShopItem[];
}

// 奖励
export interface RealmReward {
  type: 'item' | 'spirit_stone' | 'exp' | 'talent' | 'technique';
  itemId?: string;
  quantity: number;
  chance: number;
}

// 临时天赋
export interface TemporaryTalent {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  // 效果
  effects: TalentEffect[];

  // 可叠加
  stackable: boolean;
  maxStacks: number;
}

export interface TalentEffect {
  type: 'stat_boost' | 'skill_enhance' | 'special';
  stat?: string;
  value: number;
  isPercentage: boolean;
}

// 事件
export interface RealmEvent {
  id: string;
  name: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  outcomes: EventOutcome[];
}

export interface EventOutcome {
  type: 'reward' | 'damage' | 'heal' | 'buff' | 'debuff' | 'nothing';
  value?: number;
  itemId?: string;
  chance: number;
}

// 商店物品
export interface ShopItem {
  itemId: string;
  name: string;
  price: number;
  currency: 'spirit_stone' | 'realm_coin';
  stock: number;
}

// 秘境运行状态
export interface RealmRunState {
  realmId: string;
  currentFloor: number;
  rooms: Room[];
  currentRoomId: string | null;

  // 玩家状态
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  // 获得的临时天赋
  acquiredTalents: { talent: TemporaryTalent; stacks: number }[];

  // 收集的奖励
  collectedRewards: RealmReward[];

  // 秘境货币
  realmCoins: number;

  // 统计
  enemiesKilled: number;
  roomsCleared: number;
  startTime: number;
}

// 预设秘境
export const SECRET_REALMS: Record<string, SecretRealm> = {
  spirit_cave: {
    id: 'spirit_cave',
    name: '灵气洞府',
    description: '一处充满灵气的上古洞府，适合初入修仙界的修士探索。',
    difficulty: 1,
    floors: 5,
    requiredLevel: 1,
    roomPool: ['combat', 'combat', 'combat', 'treasure', 'rest', 'event'],
    enemyPool: ['wild_boar', 'spirit_wolf'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 50, chance: 1.0 },
      { type: 'item', itemId: 'spirit_grass', quantity: 5, chance: 0.8 },
      { type: 'item', itemId: 'healing_pill', quantity: 2, chance: 0.5 },
    ],
    talentPool: ['attack_boost', 'defense_boost', 'speed_boost'],
    dailyLimit: 3,
    entryCost: { type: 'spirit_stone', amount: 10 },
  },

  fire_domain: {
    id: 'fire_domain',
    name: '炎火秘境',
    description: '被火焰笼罩的危险秘境，蕴含珍贵的火属性材料。',
    difficulty: 2,
    floors: 8,
    requiredLevel: 5,
    roomPool: ['combat', 'combat', 'elite', 'treasure', 'shop', 'event', 'rest'],
    enemyPool: ['fire_serpent', 'flame_wolf', 'fire_elemental'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 200, chance: 1.0 },
      { type: 'item', itemId: 'fire_essence', quantity: 3, chance: 0.6 },
      { type: 'item', itemId: 'fire_gem', quantity: 1, chance: 0.3 },
    ],
    talentPool: ['fire_mastery', 'burn_immunity', 'attack_boost', 'crit_boost'],
    dailyLimit: 2,
    entryCost: { type: 'spirit_stone', amount: 50 },
  },

  ancient_ruins: {
    id: 'ancient_ruins',
    name: '上古遗迹',
    description: '上古大能陨落之地，危机四伏但宝藏无数。',
    difficulty: 4,
    floors: 12,
    requiredLevel: 15,
    roomPool: ['combat', 'elite', 'elite', 'treasure', 'shop', 'event', 'rest', 'boss'],
    enemyPool: ['ancient_guardian', 'spirit_puppet', 'wandering_cultivator'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 1000, chance: 1.0 },
      { type: 'technique', itemId: 'random_technique', quantity: 1, chance: 0.1 },
      { type: 'item', itemId: 'ancient_artifact', quantity: 1, chance: 0.2 },
    ],
    talentPool: ['all_stats', 'double_reward', 'life_steal', 'invincibility'],
    dailyLimit: 1,
    entryCost: { type: 'spirit_stone', amount: 200 },
  },

  chaos_void: {
    id: 'chaos_void',
    name: '混沌虚空',
    description: '传说中的终极秘境，只有最强者才能生还。',
    difficulty: 5,
    floors: 20,
    requiredLevel: 30,
    roomPool: ['combat', 'elite', 'elite', 'boss', 'treasure', 'shop', 'event'],
    enemyPool: ['chaos_beast', 'void_walker', 'fallen_immortal'],
    rewardPool: [
      { type: 'spirit_stone', quantity: 5000, chance: 1.0 },
      { type: 'item', itemId: 'chaos_essence', quantity: 1, chance: 0.3 },
      { type: 'technique', itemId: 'immortal_technique', quantity: 1, chance: 0.05 },
    ],
    talentPool: ['chaos_power', 'immortal_body', 'time_stop', 'reality_warp'],
    dailyLimit: 1,
    entryCost: { type: 'spirit_stone', amount: 1000 },
  },
};

// 临时天赋数据
export const TEMPORARY_TALENTS: Record<string, TemporaryTalent> = {
  attack_boost: {
    id: 'attack_boost',
    name: '力量激增',
    description: '攻击力提升20%',
    rarity: 'common',
    effects: [{ type: 'stat_boost', stat: 'attack', value: 20, isPercentage: true }],
    stackable: true,
    maxStacks: 5,
  },
  defense_boost: {
    id: 'defense_boost',
    name: '铁壁',
    description: '防御力提升20%',
    rarity: 'common',
    effects: [{ type: 'stat_boost', stat: 'defense', value: 20, isPercentage: true }],
    stackable: true,
    maxStacks: 5,
  },
  speed_boost: {
    id: 'speed_boost',
    name: '疾风',
    description: '速度提升15%',
    rarity: 'common',
    effects: [{ type: 'stat_boost', stat: 'speed', value: 15, isPercentage: true }],
    stackable: true,
    maxStacks: 5,
  },
  crit_boost: {
    id: 'crit_boost',
    name: '致命一击',
    description: '暴击率提升10%',
    rarity: 'rare',
    effects: [{ type: 'stat_boost', stat: 'critRate', value: 10, isPercentage: false }],
    stackable: true,
    maxStacks: 3,
  },
  fire_mastery: {
    id: 'fire_mastery',
    name: '火焰掌控',
    description: '火属性伤害提升30%',
    rarity: 'rare',
    effects: [{ type: 'skill_enhance', stat: 'fire_damage', value: 30, isPercentage: true }],
    stackable: true,
    maxStacks: 3,
  },
  burn_immunity: {
    id: 'burn_immunity',
    name: '烈焰之体',
    description: '免疫燃烧效果',
    rarity: 'rare',
    effects: [{ type: 'special', value: 1, isPercentage: false }],
    stackable: false,
    maxStacks: 1,
  },
  life_steal: {
    id: 'life_steal',
    name: '吸血',
    description: '造成伤害的15%转化为生命',
    rarity: 'epic',
    effects: [{ type: 'special', value: 15, isPercentage: true }],
    stackable: true,
    maxStacks: 3,
  },
  all_stats: {
    id: 'all_stats',
    name: '全面强化',
    description: '所有属性提升10%',
    rarity: 'epic',
    effects: [
      { type: 'stat_boost', stat: 'attack', value: 10, isPercentage: true },
      { type: 'stat_boost', stat: 'defense', value: 10, isPercentage: true },
      { type: 'stat_boost', stat: 'speed', value: 10, isPercentage: true },
      { type: 'stat_boost', stat: 'hp', value: 10, isPercentage: true },
    ],
    stackable: true,
    maxStacks: 3,
  },
  double_reward: {
    id: 'double_reward',
    name: '双倍奖励',
    description: '获得的奖励翻倍',
    rarity: 'legendary',
    effects: [{ type: 'special', value: 2, isPercentage: false }],
    stackable: false,
    maxStacks: 1,
  },
  invincibility: {
    id: 'invincibility',
    name: '金刚不坏',
    description: '受到的伤害降低50%',
    rarity: 'legendary',
    effects: [{ type: 'stat_boost', stat: 'damage_reduction', value: 50, isPercentage: true }],
    stackable: false,
    maxStacks: 1,
  },
  chaos_power: {
    id: 'chaos_power',
    name: '混沌之力',
    description: '攻击力和暴击伤害提升100%',
    rarity: 'legendary',
    effects: [
      { type: 'stat_boost', stat: 'attack', value: 100, isPercentage: true },
      { type: 'stat_boost', stat: 'critDamage', value: 100, isPercentage: true },
    ],
    stackable: false,
    maxStacks: 1,
  },
};

// 生成秘境房间
export function generateRealmRooms(realm: SecretRealm): Room[] {
  const rooms: Room[] = [];

  for (let floor = 1; floor <= realm.floors; floor++) {
    const roomsPerFloor = floor === realm.floors ? 1 : Math.min(3, Math.floor(floor / 2) + 2);

    for (let pos = 0; pos < roomsPerFloor; pos++) {
      // 选择房间类型
      let roomType: RoomType;
      if (floor === realm.floors) {
        roomType = 'boss';
      } else if (floor === 1 && pos === 0) {
        roomType = 'combat';
      } else {
        roomType = realm.roomPool[Math.floor(Math.random() * realm.roomPool.length)];
      }

      const room: Room = {
        id: uuidv4(),
        type: roomType,
        floor,
        position: pos,
        connections: [],
        isCleared: false,
        isCurrent: floor === 1 && pos === 0,
      };

      // 根据类型生成内容
      if (roomType === 'combat' || roomType === 'elite' || roomType === 'boss') {
        const enemyCount = roomType === 'boss' ? 1 : roomType === 'elite' ? 2 : Math.floor(Math.random() * 2) + 1;
        room.enemies = [];
        for (let i = 0; i < enemyCount; i++) {
          room.enemies.push(realm.enemyPool[Math.floor(Math.random() * realm.enemyPool.length)]);
        }
      }

      if (roomType === 'treasure') {
        room.rewards = realm.rewardPool.filter(r => Math.random() < r.chance);
      }

      if (roomType === 'shop') {
        room.shop = generateShopItems(realm.difficulty);
      }

      rooms.push(room);
    }
  }

  // 生成连接
  for (let floor = 1; floor < realm.floors; floor++) {
    const currentFloorRooms = rooms.filter(r => r.floor === floor);
    const nextFloorRooms = rooms.filter(r => r.floor === floor + 1);

    currentFloorRooms.forEach(room => {
      const connectionCount = Math.min(nextFloorRooms.length, Math.floor(Math.random() * 2) + 1);
      const shuffled = [...nextFloorRooms].sort(() => Math.random() - 0.5);
      room.connections = shuffled.slice(0, connectionCount).map(r => r.id);
    });
  }

  return rooms;
}

// 生成商店物品
function generateShopItems(difficulty: number): ShopItem[] {
  const items: ShopItem[] = [
    { itemId: 'healing_pill', name: '疗伤丹', price: 20 * difficulty, currency: 'realm_coin', stock: 3 },
    { itemId: 'spirit_recovery_pill', name: '回灵丹', price: 15 * difficulty, currency: 'realm_coin', stock: 3 },
    { itemId: 'power_pill', name: '蛮力丹', price: 50 * difficulty, currency: 'realm_coin', stock: 1 },
  ];

  if (difficulty >= 3) {
    items.push({
      itemId: 'random_talent',
      name: '天赋宝箱',
      price: 100 * difficulty,
      currency: 'realm_coin',
      stock: 1,
    });
  }

  return items;
}

// 随机选择天赋
export function selectRandomTalents(talentIds: string[], count: number = 3): TemporaryTalent[] {
  const available = talentIds
    .map(id => TEMPORARY_TALENTS[id])
    .filter(t => t !== undefined);

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
