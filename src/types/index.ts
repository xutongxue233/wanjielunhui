// ==================== 基础类型 ====================

// 五行元素
export type Element = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

// 灵根品质
export type SpiritualRootQuality = 'mortal' | 'ordinary' | 'excellent' | 'heavenly' | 'chaos';

// 物品品质
export type ItemQuality = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

// 功法品级
export type TechniqueGrade = 'mortal' | 'yellow' | 'profound' | 'earth' | 'heaven' | 'immortal';

// ==================== 境界系统 ====================

export type RealmStage = 'early' | 'middle' | 'late' | 'peak';

export type RealmName =
  | 'lianqi'    // 炼气
  | 'zhuji'     // 筑基
  | 'jindan'    // 金丹
  | 'yuanying'  // 元婴
  | 'huashen'   // 化神
  | 'heti'      // 合体
  | 'dacheng'   // 大乘
  | 'dujie'     // 渡劫
  | 'xianren';  // 仙人

export interface Realm {
  name: RealmName;
  stage: RealmStage;
  displayName: string;
  level: number;  // 1-36 (9境界 x 4阶段)
}

// ==================== 灵根系统 ====================

export interface SpiritualRoot {
  elements: Element[];
  quality: SpiritualRootQuality;
  purity: number;  // 0-100
  special?: string;  // 特殊灵根名称
}

// ==================== 属性系统 ====================

export interface BaseAttributes {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  critDamage: number;
}

export interface CultivationAttributes {
  cultivation: number;      // 当前修为
  maxCultivation: number;   // 突破所需修为
  cultivationSpeed: number; // 修炼速度(每秒)
  comprehension: number;    // 悟性
  luck: number;             // 气运
  karma: number;            // 业力
  lifespan: number;         // 当前寿元
  maxLifespan: number;      // 最大寿元
}

export interface PlayerAttributes extends BaseAttributes, CultivationAttributes {}

// ==================== 功法系统 ====================

export interface Technique {
  id: string;
  name: string;
  description: string;
  grade: TechniqueGrade;
  element: Element | 'neutral';
  cultivationBonus: number;  // 修炼速度加成百分比
  requirements: TechniqueRequirement[];
  skills: string[];  // 技能ID列表
  maxLevel: number;
  currentLevel: number;
}

export interface TechniqueRequirement {
  type: 'realm' | 'element' | 'attribute' | 'item';
  value: string | number;
}

// ==================== 技能系统 ====================

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'support' | 'passive';
  element: Element | 'neutral';
  mpCost: number;
  cooldown: number;
  damage: number;
  effects: SkillEffect[];
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'dot' | 'hot';
  target: 'self' | 'enemy' | 'ally' | 'all_enemies' | 'all_allies';
  value: number;
  duration?: number;
}

// ==================== 物品系统 ====================

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'material' | 'equipment' | 'quest' | 'currency';
  quality: ItemQuality;
  stackable: boolean;
  maxStack: number;
  effects?: ItemEffect[];
}

export interface ItemEffect {
  type: string;
  value: number;
  duration?: number;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
}

// ==================== 装备系统 ====================

export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'talisman';

export interface Equipment extends Item {
  slot: EquipmentSlot;
  baseStats: Partial<BaseAttributes>;
  bonusStats: BonusStat[];
  enhanceLevel: number;
  maxEnhanceLevel: number;
  requirements: EquipmentRequirement[];
}

export interface BonusStat {
  attribute: keyof BaseAttributes;
  value: number;
  isPercentage: boolean;
}

export interface EquipmentRequirement {
  type: 'realm' | 'attribute';
  value: string | number;
}

// ==================== 玩家数据 ====================

export interface Player {
  id: string;
  name: string;
  gender: 'male' | 'female';
  origin: OriginType;

  realm: Realm;
  spiritualRoot: SpiritualRoot;
  attributes: PlayerAttributes;

  techniques: Technique[];
  activeTechniqueId: string | null;
  skills: Skill[];

  equipment: Record<EquipmentSlot, Equipment | null>;
  inventory: InventoryItem[];

  createdAt: number;
  lastOnlineAt: number;
  totalPlayTime: number;
}

// ==================== 开局背景 ====================

export type OriginType = 'village_orphan' | 'fallen_clan' | 'reincarnation';

export interface Origin {
  type: OriginType;
  name: string;
  description: string;
  startingBonus: OriginBonus;
  startingStory: string;
}

export interface OriginBonus {
  attributes?: Partial<PlayerAttributes>;
  items?: { itemId: string; quantity: number }[];
  techniques?: string[];
  spiritualRootBonus?: number;
}

// ==================== 游戏状态 ====================

export type GamePhase = 'title' | 'character_creation' | 'playing' | 'paused';

export interface GameState {
  phase: GamePhase;
  currentPlayer: Player | null;
  lastTickTime: number;
  isPaused: boolean;
}

// ==================== 剧情系统 ====================

export interface StoryNode {
  id: string;
  type: 'dialogue' | 'choice' | 'battle' | 'reward' | 'narration';
  speaker?: string;
  content: string;
  choices?: StoryChoice[];
  nextNodeId?: string;
  conditions?: StoryCondition[];
  effects?: StoryEffect[];
}

export interface StoryChoice {
  text: string;
  nextNodeId: string;
  conditions?: StoryCondition[];
  effects?: StoryEffect[];
}

export interface StoryCondition {
  type: 'realm' | 'attribute' | 'item' | 'flag';
  key: string;
  operator: '>' | '<' | '==' | '>=' | '<=' | '!=';
  value: string | number | boolean;
}

export interface StoryEffect {
  type: 'add_item' | 'remove_item' | 'modify_attribute' | 'set_flag' | 'start_battle';
  target: string;
  value: string | number | boolean;
}

export interface StoryProgress {
  currentChapterId: string;
  currentNodeId: string;
  completedChapters: string[];
  flags: Record<string, boolean | number | string>;
}

// ==================== 轮回系统 ====================

export interface RoguelikeState {
  reincarnationCount: number;
  destinyPoints: number;
  permanentBonuses: PermanentBonus[];
  unlockedTalents: string[];
  achievements: string[];
}

export interface PermanentBonus {
  id: string;
  type: 'attribute' | 'cultivation_speed' | 'breakthrough_rate' | 'starting_item';
  value: number;
  source: string;
}

// ==================== 存档系统 ====================

export interface GameSave {
  version: string;
  timestamp: number;
  player: Player;
  storyProgress: StoryProgress;
  roguelikeState: RoguelikeState;
  settings: GameSettings;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  autoSaveInterval: number;
}
