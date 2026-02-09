import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  Player,
  PlayerAttributes,
  SpiritualRoot,
  OriginType,
  Equipment,
  EquipmentSlot,
  InventoryItem,
  Technique,
  Skill,
} from '../types';
import { createInitialRealm, getCultivationRequirement, getNextRealm, REALM_CONFIGS } from '../data/realms';
import { ORIGINS, generateSpiritualRoot, getSpiritualRootBonus } from '../data/origins';
import { v4 as uuidv4 } from 'uuid';

interface PlayerState {
  player: Player | null;
  isCreatingCharacter: boolean;
  isPlayerDead: boolean;  // 玩家是否死亡

  // 角色创建
  createCharacter: (name: string, gender: 'male' | 'female', origin: OriginType) => void;

  // 修炼相关
  addCultivation: (amount: number) => void;
  attemptBreakthrough: () => { success: boolean; message: string };

  // 寿元相关
  consumeLifespan: (years: number) => { isDead: boolean; remaining: number };
  checkLifespanWarning: () => { isWarning: boolean; percentage: number };
  reincarnate: () => void;  // 转世重生

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
        (base as unknown as Record<string, number>)[key] += value;
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
      isPlayerDead: false,

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

        // 计算突破成功率，从当前境界配置读取基础突破率
        const baseRate = REALM_CONFIGS[player.realm.name].breakthroughBaseRate;
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

            // 属性提升：区分小阶段突破和大境界突破
            const isMajorBreakthrough = player.realm.stage === 'peak';
            if (isMajorBreakthrough) {
              // 大境界突破：属性大幅提升，寿元大幅增加
              state.player.attributes.maxHp *= 1.8;
              state.player.attributes.hp = state.player.attributes.maxHp;
              state.player.attributes.maxMp *= 1.6;
              state.player.attributes.mp = state.player.attributes.maxMp;
              state.player.attributes.attack *= 1.7;
              state.player.attributes.defense *= 1.5;
              state.player.attributes.speed = Math.floor(state.player.attributes.speed * 1.3);
              // 大境界突破增加寿元上限
              state.player.attributes.maxLifespan += 100;
              state.player.attributes.lifespan += 50;
            } else {
              // 小阶段突破：属性小幅提升，寿元小幅增加
              state.player.attributes.maxHp *= 1.12;
              state.player.attributes.hp = state.player.attributes.maxHp;
              state.player.attributes.maxMp *= 1.10;
              state.player.attributes.mp = state.player.attributes.maxMp;
              state.player.attributes.attack *= 1.10;
              state.player.attributes.defense *= 1.08;
              state.player.attributes.speed = Math.floor(state.player.attributes.speed * 1.05);
              // 小阶段突破增加少量寿元
              state.player.attributes.maxLifespan += 20;
              state.player.attributes.lifespan += 10;
            }
          } else {
            // 突破失败，损失部分修为
            state.player.attributes.cultivation = Math.floor(cultivation * 0.8);
            // 突破失败消耗寿元：大境界5年，小阶段1年
            const isMajorBreakthrough = player.realm.stage === 'peak';
            const lifespanCost = isMajorBreakthrough ? 5 : 1;
            state.player.attributes.lifespan = Math.max(0, state.player.attributes.lifespan - lifespanCost);
            // 检查是否寿元耗尽
            if (state.player.attributes.lifespan <= 0) {
              state.isPlayerDead = true;
            }
          }
        });

        // 计算寿元消耗量用于返回消息
        const isMajorBreakthroughAttempt = player.realm.stage === 'peak';
        const lifespanCostForMessage = isMajorBreakthroughAttempt ? 5 : 1;
        const playerDied = !success && player.attributes.lifespan - lifespanCostForMessage <= 0;

        return {
          success,
          message: success
            ? `突破成功！你已进入${nextRealm.displayName}！`
            : playerDied
              ? `突破失败，寿元耗尽，道消身陨...`
              : `突破失败，修为倒退，损耗${lifespanCostForMessage}年寿元。`,
        };
      },

      // 消耗寿元
      consumeLifespan: (years) => {
        const { player } = get();
        if (!player) {
          return { isDead: true, remaining: 0 };
        }

        const newLifespan = Math.max(0, player.attributes.lifespan - years);
        const isDead = newLifespan <= 0;

        set((state) => {
          if (!state.player) return;
          state.player.attributes.lifespan = newLifespan;
          if (isDead) {
            state.isPlayerDead = true;
          }
        });

        return { isDead, remaining: newLifespan };
      },

      // 检查寿元警告
      checkLifespanWarning: () => {
        const { player } = get();
        if (!player) {
          return { isWarning: false, percentage: 100 };
        }

        const percentage = (player.attributes.lifespan / player.attributes.maxLifespan) * 100;
        const isWarning = percentage < 20;

        return { isWarning, percentage };
      },

      // 转世重生
      reincarnate: () => {
        set((state) => {
          if (!state.player) return;
          // 重置角色到初始状态，但保留一些记忆
          const origin = state.player.origin;
          const newPlayer = createPlayer(state.player.name, state.player.gender, origin);
          // 转世保留部分悟性加成
          newPlayer.attributes.comprehension = Math.floor(state.player.attributes.comprehension * 0.1) + 10;
          // 转世保留部分气运
          newPlayer.attributes.luck = Math.floor(state.player.attributes.luck * 0.1) + 10;
          state.player = newPlayer;
          state.isPlayerDead = false;
        });
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
          // 如果该槽位已有装备，先移除旧装备属性
          const oldEquipment = state.player.equipment[equipment.slot];
          if (oldEquipment && oldEquipment.baseStats) {
            const oldStats = oldEquipment.baseStats;
            if (oldStats.attack) state.player.attributes.attack -= oldStats.attack;
            if (oldStats.defense) state.player.attributes.defense -= oldStats.defense;
            if (oldStats.hp) {
              state.player.attributes.maxHp -= oldStats.hp;
              state.player.attributes.hp = Math.min(state.player.attributes.hp, state.player.attributes.maxHp);
            }
            if (oldStats.mp) {
              state.player.attributes.maxMp -= oldStats.mp;
              state.player.attributes.mp = Math.min(state.player.attributes.mp, state.player.attributes.maxMp);
            }
            if (oldStats.speed) state.player.attributes.speed -= oldStats.speed;
            if (oldStats.critRate) state.player.attributes.critRate -= oldStats.critRate;
            if (oldStats.critDamage) state.player.attributes.critDamage -= oldStats.critDamage;
          }
          // 应用新装备属性
          const newStats = equipment.baseStats;
          if (newStats) {
            if (newStats.attack) state.player.attributes.attack += newStats.attack;
            if (newStats.defense) state.player.attributes.defense += newStats.defense;
            if (newStats.hp) {
              state.player.attributes.maxHp += newStats.hp;
              state.player.attributes.hp = Math.min(state.player.attributes.hp + newStats.hp, state.player.attributes.maxHp);
            }
            if (newStats.mp) {
              state.player.attributes.maxMp += newStats.mp;
              state.player.attributes.mp = Math.min(state.player.attributes.mp + newStats.mp, state.player.attributes.maxMp);
            }
            if (newStats.speed) state.player.attributes.speed += newStats.speed;
            if (newStats.critRate) state.player.attributes.critRate += newStats.critRate;
            if (newStats.critDamage) state.player.attributes.critDamage += newStats.critDamage;
          }
          state.player.equipment[equipment.slot] = equipment;
        });
      },

      unequipItem: (slot) => {
        set((state) => {
          if (!state.player) return;
          // 移除装备时减去属性加成
          const oldEquipment = state.player.equipment[slot];
          if (oldEquipment && oldEquipment.baseStats) {
            const oldStats = oldEquipment.baseStats;
            if (oldStats.attack) state.player.attributes.attack -= oldStats.attack;
            if (oldStats.defense) state.player.attributes.defense -= oldStats.defense;
            if (oldStats.hp) {
              state.player.attributes.maxHp -= oldStats.hp;
              state.player.attributes.hp = Math.min(state.player.attributes.hp, state.player.attributes.maxHp);
            }
            if (oldStats.mp) {
              state.player.attributes.maxMp -= oldStats.mp;
              state.player.attributes.mp = Math.min(state.player.attributes.mp, state.player.attributes.maxMp);
            }
            if (oldStats.speed) state.player.attributes.speed -= oldStats.speed;
            if (oldStats.critRate) state.player.attributes.critRate -= oldStats.critRate;
            if (oldStats.critDamage) state.player.attributes.critDamage -= oldStats.critDamage;
          }
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
