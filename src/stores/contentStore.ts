/**
 * 游戏内容数据Store - 管理从API获取的游戏数据
 * 支持离线回退到静态数据
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { contentApi } from '../services/contentApi';

// 数据类型引用 - 使用已有的类型
import type { ItemDefinition } from '../data/items';
import type { EquipmentDefinition } from '../data/equipment';
import type { CombatSkill } from '../data/combat';
import type { RealmConfig } from '../data/realms';
import type { PillRecipe, Furnace } from '../data/alchemy';
import type { TemporaryTalent, SecretRealm } from '../data/roguelike';
import type { ChapterConfig } from '../data/combat/dungeons';

// 加载状态类型
type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

// 数据类别
type ContentCategory =
  | 'enemies'
  | 'items'
  | 'equipments'
  | 'skills'
  | 'dungeons'
  | 'alchemyRecipes'
  | 'alchemyCauldrons'
  | 'realms'
  | 'origins'
  | 'roguelikeDungeons'
  | 'roguelikeTalents';

interface ContentState {
  // 数据
  enemies: Record<string, unknown>;
  items: Record<string, ItemDefinition>;
  equipments: Record<string, EquipmentDefinition>;
  skills: Record<string, CombatSkill>;
  dungeons: ChapterConfig[];
  alchemyRecipes: Record<string, PillRecipe>;
  alchemyCauldrons: Record<string, Furnace>;
  realms: Record<string, RealmConfig>;
  origins: Record<string, unknown>;
  roguelikeDungeons: Record<string, SecretRealm>;
  roguelikeTalents: Record<string, TemporaryTalent>;

  // 加载状态
  loadingStatus: Record<ContentCategory, LoadStatus>;
  lastLoadTime: number;

  // 操作
  loadEnemies: () => Promise<void>;
  loadItems: () => Promise<void>;
  loadEquipments: () => Promise<void>;
  loadSkills: () => Promise<void>;
  loadDungeons: () => Promise<void>;
  loadAlchemyRecipes: () => Promise<void>;
  loadAlchemyCauldrons: () => Promise<void>;
  loadRealms: () => Promise<void>;
  loadOrigins: () => Promise<void>;
  loadRoguelikeDungeons: () => Promise<void>;
  loadRoguelikeTalents: () => Promise<void>;
  loadAll: () => Promise<void>;

  // 查询辅助
  getEnemyById: (id: string) => unknown | undefined;
  getItemById: (id: string) => ItemDefinition | undefined;
  getEquipmentById: (id: string) => EquipmentDefinition | undefined;
  getSkillById: (id: string) => CombatSkill | undefined;

  // 状态查询
  isAllLoaded: () => boolean;
  getLoadProgress: () => { loaded: number; total: number };
}

// 将数组转为Record的辅助函数
function arrayToRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  const result: Record<string, T> = {};
  for (const item of arr) {
    result[item.id] = item;
  }
  return result;
}

const ALL_CATEGORIES: ContentCategory[] = [
  'enemies', 'items', 'equipments', 'skills', 'dungeons',
  'alchemyRecipes', 'alchemyCauldrons', 'realms', 'origins',
  'roguelikeDungeons', 'roguelikeTalents',
];

const initialLoadingStatus: Record<ContentCategory, LoadStatus> = {
  enemies: 'idle',
  items: 'idle',
  equipments: 'idle',
  skills: 'idle',
  dungeons: 'idle',
  alchemyRecipes: 'idle',
  alchemyCauldrons: 'idle',
  realms: 'idle',
  origins: 'idle',
  roguelikeDungeons: 'idle',
  roguelikeTalents: 'idle',
};

export const useContentStore = create<ContentState>()(
  persist(
    immer((set, get) => ({
      enemies: {},
      items: {},
      equipments: {},
      skills: {},
      dungeons: [],
      alchemyRecipes: {},
      alchemyCauldrons: {},
      realms: {},
      origins: {},
      roguelikeDungeons: {},
      roguelikeTalents: {},
      loadingStatus: { ...initialLoadingStatus },
      lastLoadTime: 0,

      loadEnemies: async () => {
        set(state => { state.loadingStatus.enemies = 'loading'; });
        try {
          const data = await contentApi.getEnemies();
          set(state => {
            state.enemies = arrayToRecord(data as { id: string }[]);
            state.loadingStatus.enemies = 'loaded';
          });
        } catch {
          // 离线回退
          const { ENEMY_TEMPLATES } = await import('../data/combat/enemies');
          set(state => {
            state.enemies = { ...ENEMY_TEMPLATES };
            state.loadingStatus.enemies = 'loaded';
          });
        }
      },

      loadItems: async () => {
        set(state => { state.loadingStatus.items = 'loading'; });
        try {
          const data = await contentApi.getItems();
          set(state => {
            state.items = arrayToRecord(data as ItemDefinition[]);
            state.loadingStatus.items = 'loaded';
          });
        } catch {
          const { ALL_ITEMS } = await import('../data/items');
          set(state => {
            state.items = { ...ALL_ITEMS };
            state.loadingStatus.items = 'loaded';
          });
        }
      },

      loadEquipments: async () => {
        set(state => { state.loadingStatus.equipments = 'loading'; });
        try {
          const data = await contentApi.getEquipments();
          set(state => {
            state.equipments = arrayToRecord(data as EquipmentDefinition[]);
            state.loadingStatus.equipments = 'loaded';
          });
        } catch {
          const { ALL_EQUIPMENT } = await import('../data/equipment');
          set(state => {
            state.equipments = { ...ALL_EQUIPMENT };
            state.loadingStatus.equipments = 'loaded';
          });
        }
      },

      loadSkills: async () => {
        set(state => { state.loadingStatus.skills = 'loading'; });
        try {
          const data = await contentApi.getSkills();
          set(state => {
            state.skills = arrayToRecord(data as CombatSkill[]);
            state.loadingStatus.skills = 'loaded';
          });
        } catch {
          const { PLAYER_SKILLS } = await import('../data/combat/skills');
          set(state => {
            state.skills = { ...PLAYER_SKILLS };
            state.loadingStatus.skills = 'loaded';
          });
        }
      },

      loadDungeons: async () => {
        set(state => { state.loadingStatus.dungeons = 'loading'; });
        try {
          const data = await contentApi.getDungeons();
          set(state => {
            state.dungeons = data as ChapterConfig[];
            state.loadingStatus.dungeons = 'loaded';
          });
        } catch {
          const { CHAPTERS } = await import('../data/combat/dungeons');
          set(state => {
            state.dungeons = [...CHAPTERS];
            state.loadingStatus.dungeons = 'loaded';
          });
        }
      },

      loadAlchemyRecipes: async () => {
        set(state => { state.loadingStatus.alchemyRecipes = 'loading'; });
        try {
          const data = await contentApi.getAlchemyRecipes();
          set(state => {
            state.alchemyRecipes = arrayToRecord(data as PillRecipe[]);
            state.loadingStatus.alchemyRecipes = 'loaded';
          });
        } catch {
          const { PILL_RECIPES } = await import('../data/alchemy');
          set(state => {
            state.alchemyRecipes = { ...PILL_RECIPES };
            state.loadingStatus.alchemyRecipes = 'loaded';
          });
        }
      },

      loadAlchemyCauldrons: async () => {
        set(state => { state.loadingStatus.alchemyCauldrons = 'loading'; });
        try {
          const data = await contentApi.getAlchemyCauldrons();
          set(state => {
            state.alchemyCauldrons = arrayToRecord(data as Furnace[]);
            state.loadingStatus.alchemyCauldrons = 'loaded';
          });
        } catch {
          const { FURNACES } = await import('../data/alchemy');
          set(state => {
            state.alchemyCauldrons = { ...FURNACES };
            state.loadingStatus.alchemyCauldrons = 'loaded';
          });
        }
      },

      loadRealms: async () => {
        set(state => { state.loadingStatus.realms = 'loading'; });
        try {
          const data = await contentApi.getRealms();
          const record: Record<string, RealmConfig> = {};
          for (const item of data as RealmConfig[]) {
            record[item.name] = item;
          }
          set(state => {
            state.realms = record;
            state.loadingStatus.realms = 'loaded';
          });
        } catch {
          const { REALM_CONFIGS } = await import('../data/realms');
          set(state => {
            state.realms = { ...REALM_CONFIGS };
            state.loadingStatus.realms = 'loaded';
          });
        }
      },

      loadOrigins: async () => {
        set(state => { state.loadingStatus.origins = 'loading'; });
        try {
          const data = await contentApi.getOrigins();
          set(state => {
            state.origins = arrayToRecord(data as { id: string }[]);
            state.loadingStatus.origins = 'loaded';
          });
        } catch {
          const { ORIGINS } = await import('../data/origins');
          set(state => {
            state.origins = { ...ORIGINS } as Record<string, unknown>;
            state.loadingStatus.origins = 'loaded';
          });
        }
      },

      loadRoguelikeDungeons: async () => {
        set(state => { state.loadingStatus.roguelikeDungeons = 'loading'; });
        try {
          const data = await contentApi.getRoguelikeDungeons();
          set(state => {
            state.roguelikeDungeons = arrayToRecord(data as SecretRealm[]);
            state.loadingStatus.roguelikeDungeons = 'loaded';
          });
        } catch {
          const { SECRET_REALMS } = await import('../data/roguelike');
          set(state => {
            state.roguelikeDungeons = { ...SECRET_REALMS };
            state.loadingStatus.roguelikeDungeons = 'loaded';
          });
        }
      },

      loadRoguelikeTalents: async () => {
        set(state => { state.loadingStatus.roguelikeTalents = 'loading'; });
        try {
          const data = await contentApi.getRoguelikeTalents();
          set(state => {
            state.roguelikeTalents = arrayToRecord(data as TemporaryTalent[]);
            state.loadingStatus.roguelikeTalents = 'loaded';
          });
        } catch {
          const { TEMPORARY_TALENTS } = await import('../data/roguelike');
          set(state => {
            state.roguelikeTalents = { ...TEMPORARY_TALENTS };
            state.loadingStatus.roguelikeTalents = 'loaded';
          });
        }
      },

      loadAll: async () => {
        const store = get();
        await Promise.all([
          store.loadEnemies(),
          store.loadItems(),
          store.loadEquipments(),
          store.loadSkills(),
          store.loadDungeons(),
          store.loadAlchemyRecipes(),
          store.loadAlchemyCauldrons(),
          store.loadRealms(),
          store.loadOrigins(),
          store.loadRoguelikeDungeons(),
          store.loadRoguelikeTalents(),
        ]);
        set(state => { state.lastLoadTime = Date.now(); });
      },

      // 查询辅助
      getEnemyById: (id) => get().enemies[id],
      getItemById: (id) => get().items[id],
      getEquipmentById: (id) => get().equipments[id],
      getSkillById: (id) => get().skills[id],

      // 状态查询
      isAllLoaded: () => {
        const status = get().loadingStatus;
        return ALL_CATEGORIES.every(cat => status[cat] === 'loaded');
      },

      getLoadProgress: () => {
        const status = get().loadingStatus;
        const loaded = ALL_CATEGORIES.filter(cat => status[cat] === 'loaded').length;
        return { loaded, total: ALL_CATEGORIES.length };
      },
    })),
    {
      name: 'wanjie-content-cache',
      partialize: (state) => ({
        enemies: state.enemies,
        items: state.items,
        equipments: state.equipments,
        skills: state.skills,
        dungeons: state.dungeons,
        alchemyRecipes: state.alchemyRecipes,
        alchemyCauldrons: state.alchemyCauldrons,
        realms: state.realms,
        origins: state.origins,
        roguelikeDungeons: state.roguelikeDungeons,
        roguelikeTalents: state.roguelikeTalents,
        lastLoadTime: state.lastLoadTime,
      }),
    }
  )
);
