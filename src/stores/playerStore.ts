import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  Player,
  PlayerAttributes,
  Realm,
  SpiritualRoot,
  OriginType,
  Equipment,
  EquipmentSlot,
  InventoryItem,
  Technique,
  Skill,
} from '../types';
import { createInitialRealm, getCultivationRequirement, getNextRealm } from '../data/realms';
import { ORIGINS, generateSpiritualRoot, getSpiritualRootBonus } from '../data/origins';
import { v4 as uuidv4 } from 'uuid';

interface PlayerState {
  player: Player | null;
  isCreatingCharacter: boolean;

  // 角色创建
  createCharacter: (name: string, gender: 'male' | 'female', origin: OriginType) => void;

  // 修炼相关
  addCultivation: (amount: number) => void;
  attemptBreakthrough: () => { success: boolean; message: string };

  // 属性相关
  modifyAttribute: <K extends keyof PlayerAttributes>(key: K, value: number) => void;
  healPlayer: (amount: number) => void;
  restoreMp: (amount: number) => void;

  // 装备相关
  equipItem: (equipment: Equipment) => void;
  unequipItem: (slot: EquipmentSlot) => void;

  // 背包相关
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string, quantity: number) => void;

  // 功法相关
  learnTechnique: (technique: Technique) => void;
  setActiveTechnique: (techniqueId: string) => void;

  // 技能相关
  learnSkill: (skill: Skill) => void;

  // 时间相关
  updateLastOnline: () => void;
  addPlayTime: (seconds: number) => void;

  // 存档相关
  resetPlayer: () => void;
}

// 创建初始属性
function createInitialAttributes(origin: OriginType, spiritualRoot: SpiritualRoot): PlayerAttributes {
  const originConfig = ORIGINS[origin];
  const rootBonus = getSpiritualRootBonus(spiritualRoot);

  const base: PlayerAttributes = {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 10,
    defense: 5,
    speed: 10,
    critRate: 0.05,
    critDamage: 1.5,

    cultivation: 0,
    maxCultivation: getCultivationRequirement(createInitialRealm()),
    cultivationSpeed: 1 * (1 + rootBonus),
    comprehension: 10,
    luck: 10,
    karma: 0,
    lifespan: 50,
    maxLifespan: 150,
  };

  // 应用开局加成
  if (originConfig.startingBonus.attributes) {
    for (const [key, value] of Object.entries(originConfig.startingBonus.attributes)) {
      if (key in base && typeof value === 'number') {
        (base as Record<string, number>)[key] += value;
      }
    }
  }

  return base;
}

// 创建初始玩家
function createPlayer(name: string, gender: 'male' | 'female', origin: OriginType): Player {
  const originConfig = ORIGINS[origin];
  const spiritualRootBonus = originConfig.startingBonus.spiritualRootBonus || 0;
  const spiritualRoot = generateSpiritualRoot(spiritualRootBonus);

  return {
    id: uuidv4(),
    name,
    gender,
    origin,

    realm: createInitialRealm(),
    spiritualRoot,
    attributes: createInitialAttributes(origin, spiritualRoot),

    techniques: [],
    activeTechniqueId: null,
    skills: [],

    equipment: {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory: null,
      talisman: null,
    },
    inventory: [],

    createdAt: Date.now(),
    lastOnlineAt: Date.now(),
    totalPlayTime: 0,
  };
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    immer((set, get) => ({
      player: null,
      isCreatingCharacter: false,

      createCharacter: (name, gender, origin) => {
        set((state) => {
          state.player = createPlayer(name, gender, origin);
          state.isCreatingCharacter = false;
        });
      },

      addCultivation: (amount) => {
        set((state) => {
          if (!state.player) return;
          state.player.attributes.cultivation += amount;
        });
      },

      attemptBreakthrough: () => {
        const { player } = get();
        if (!player) {
          return { success: false, message: '角色不存在' };
        }

        const { cultivation, maxCultivation } = player.attributes;
        if (cultivation < maxCultivation) {
          return { success: false, message: '修为不足，无法突破' };
        }

        const nextRealm = getNextRealm(player.realm);
        if (!nextRealm) {
          return { success: false, message: '已达最高境界' };
        }

        // 计算突破成功率
        const baseRate = 0.5;
        const comprehensionBonus = player.attributes.comprehension * 0.005;
        const luckBonus = player.attributes.luck * 0.003;
        const successRate = Math.min(0.95, baseRate + comprehensionBonus + luckBonus);

        const roll = Math.random();
        const success = roll < successRate;

        set((state) => {
          if (!state.player) return;

          if (success) {
            state.player.realm = nextRealm;
            state.player.attributes.cultivation = 0;
            state.player.attributes.maxCultivation = getCultivationRequirement(nextRealm);

            // 属性提升
            state.player.attributes.maxHp *= 1.5;
            state.player.attributes.hp = state.player.attributes.maxHp;
            state.player.attributes.maxMp *= 1.3;
            state.player.attributes.mp = state.player.attributes.maxMp;
            state.player.attributes.attack *= 1.4;
            state.player.attributes.defense *= 1.3;
          } else {
            // 突破失败，损失部分修为
            state.player.attributes.cultivation = Math.floor(cultivation * 0.8);
          }
        });

        return {
          success,
          message: success
            ? `突破成功！你已进入${nextRealm.displayName}！`
            : '突破失败，修为倒退。',
        };
      },

      modifyAttribute: (key, value) => {
        set((state) => {
          if (!state.player) return;
          (state.player.attributes as Record<string, number>)[key] += value;
        });
      },

      healPlayer: (amount) => {
        set((state) => {
          if (!state.player) return;
          state.player.attributes.hp = Math.min(
            state.player.attributes.maxHp,
            state.player.attributes.hp + amount
          );
        });
      },

      restoreMp: (amount) => {
        set((state) => {
          if (!state.player) return;
          state.player.attributes.mp = Math.min(
            state.player.attributes.maxMp,
            state.player.attributes.mp + amount
          );
        });
      },

      equipItem: (equipment) => {
        set((state) => {
          if (!state.player) return;
          state.player.equipment[equipment.slot] = equipment;
        });
      },

      unequipItem: (slot) => {
        set((state) => {
          if (!state.player) return;
          state.player.equipment[slot] = null;
        });
      },

      addItem: (item) => {
        set((state) => {
          if (!state.player) return;

          const existing = state.player.inventory.find(
            (i) => i.item.id === item.item.id
          );

          if (existing && item.item.stackable) {
            existing.quantity += item.quantity;
          } else {
            state.player.inventory.push(item);
          }
        });
      },

      removeItem: (itemId, quantity) => {
        set((state) => {
          if (!state.player) return;

          const index = state.player.inventory.findIndex(
            (i) => i.item.id === itemId
          );

          if (index !== -1) {
            state.player.inventory[index].quantity -= quantity;
            if (state.player.inventory[index].quantity <= 0) {
              state.player.inventory.splice(index, 1);
            }
          }
        });
      },

      learnTechnique: (technique) => {
        set((state) => {
          if (!state.player) return;
          if (!state.player.techniques.find((t) => t.id === technique.id)) {
            state.player.techniques.push(technique);
          }
        });
      },

      setActiveTechnique: (techniqueId) => {
        set((state) => {
          if (!state.player) return;
          state.player.activeTechniqueId = techniqueId;
        });
      },

      learnSkill: (skill) => {
        set((state) => {
          if (!state.player) return;
          if (!state.player.skills.find((s) => s.id === skill.id)) {
            state.player.skills.push(skill);
          }
        });
      },

      updateLastOnline: () => {
        set((state) => {
          if (!state.player) return;
          state.player.lastOnlineAt = Date.now();
        });
      },

      addPlayTime: (seconds) => {
        set((state) => {
          if (!state.player) return;
          state.player.totalPlayTime += seconds;
        });
      },

      resetPlayer: () => {
        set((state) => {
          state.player = null;
        });
      },
    })),
    {
      name: 'wanjie-player-storage',
    }
  )
);
