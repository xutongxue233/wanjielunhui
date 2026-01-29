import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import {
  SecretRealm,
  RealmRunState,
  Room,
  TemporaryTalent,
  RealmReward,
  SECRET_REALMS,
  TEMPORARY_TALENTS,
  generateRealmRooms,
  selectRandomTalents,
} from '../../data/roguelike';

// 永久天赋节点
export interface PermanentTalentNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  effects: { stat: string; valuePerLevel: number }[];
  requires: string[];
}

interface RoguelikeStore {
  // 轮回数据
  reincarnationCount: number;
  destinyPoints: number;
  totalDestinyPointsEarned: number;

  // 永久天赋
  permanentTalents: Record<string, PermanentTalentNode>;

  // 当前秘境运行
  currentRun: RealmRunState | null;

  // 每日进入次数
  dailyEntries: Record<string, number>;
  lastResetDate: string;

  // 秘境操作
  enterRealm: (realmId: string, playerHp: number, playerMp: number) => boolean;
  exitRealm: (completed: boolean) => { destinyPoints: number; rewards: RealmReward[] };
  moveToRoom: (roomId: string) => void;
  clearCurrentRoom: () => void;

  // 天赋操作
  selectTalent: (talent: TemporaryTalent) => void;
  getTalentChoices: () => TemporaryTalent[];

  // 永久天赋
  upgradePermanentTalent: (talentId: string) => boolean;
  getPermanentStatBonus: (stat: string) => number;

  // 轮回
  reincarnate: (bonusDestinyPoints: number) => void;

  // 工具方法
  checkDailyReset: () => void;
  getCurrentRoom: () => Room | null;
  getAvailableRooms: () => Room[];
}

const PERMANENT_TALENTS: Record<string, PermanentTalentNode> = {
  cultivation_speed: {
    id: 'cultivation_speed',
    name: '修炼加速',
    description: '每级提升修炼速度5%',
    cost: 10,
    maxLevel: 10,
    currentLevel: 0,
    effects: [{ stat: 'cultivationSpeed', valuePerLevel: 5 }],
    requires: [],
  },
  base_hp: {
    id: 'base_hp',
    name: '气血强化',
    description: '每级提升基础气血3%',
    cost: 8,
    maxLevel: 10,
    currentLevel: 0,
    effects: [{ stat: 'maxHp', valuePerLevel: 3 }],
    requires: [],
  },
  base_attack: {
    id: 'base_attack',
    name: '攻击强化',
    description: '每级提升基础攻击3%',
    cost: 8,
    maxLevel: 10,
    currentLevel: 0,
    effects: [{ stat: 'attack', valuePerLevel: 3 }],
    requires: [],
  },
  breakthrough_rate: {
    id: 'breakthrough_rate',
    name: '悟道天赋',
    description: '每级提升突破成功率2%',
    cost: 15,
    maxLevel: 5,
    currentLevel: 0,
    effects: [{ stat: 'breakthroughRate', valuePerLevel: 2 }],
    requires: ['cultivation_speed'],
  },
  starting_resources: {
    id: 'starting_resources',
    name: '福缘深厚',
    description: '每级转世时额外获得初始资源',
    cost: 20,
    maxLevel: 5,
    currentLevel: 0,
    effects: [{ stat: 'startingResources', valuePerLevel: 10 }],
    requires: ['base_hp', 'base_attack'],
  },
  destiny_gain: {
    id: 'destiny_gain',
    name: '天命加持',
    description: '每级提升天命点获取10%',
    cost: 25,
    maxLevel: 5,
    currentLevel: 0,
    effects: [{ stat: 'destinyPointGain', valuePerLevel: 10 }],
    requires: ['breakthrough_rate'],
  },
};

export const useRoguelikeStore = create<RoguelikeStore>()(
  persist(
    immer((set, get) => ({
      reincarnationCount: 0,
      destinyPoints: 0,
      totalDestinyPointsEarned: 0,
      permanentTalents: { ...PERMANENT_TALENTS },
      currentRun: null,
      dailyEntries: {},
      lastResetDate: new Date().toDateString(),

      enterRealm: (realmId, playerHp, playerMp) => {
        get().checkDailyReset();

        const realm = SECRET_REALMS[realmId];
        if (!realm) return false;

        const { dailyEntries } = get();
        const entries = dailyEntries[realmId] || 0;
        if (entries >= realm.dailyLimit) return false;

        const rooms = generateRealmRooms(realm);

        set((state) => {
          state.currentRun = {
            realmId,
            currentFloor: 1,
            rooms,
            currentRoomId: rooms.find(r => r.floor === 1 && r.position === 0)?.id || null,
            hp: playerHp,
            maxHp: playerHp,
            mp: playerMp,
            maxMp: playerMp,
            acquiredTalents: [],
            collectedRewards: [],
            realmCoins: 0,
            enemiesKilled: 0,
            roomsCleared: 0,
            startTime: Date.now(),
          };
          state.dailyEntries[realmId] = entries + 1;
        });

        return true;
      },

      exitRealm: (completed) => {
        const { currentRun, permanentTalents } = get();
        if (!currentRun) return { destinyPoints: 0, rewards: [] };

        const realm = SECRET_REALMS[currentRun.realmId];

        // 计算天命点
        let destinyPoints = currentRun.roomsCleared * 5;
        if (completed) {
          destinyPoints += realm.difficulty * 50;
        }

        // 天命点加成
        const destinyGainBonus = get().getPermanentStatBonus('destinyPointGain');
        destinyPoints = Math.floor(destinyPoints * (1 + destinyGainBonus / 100));

        const rewards = [...currentRun.collectedRewards];

        set((state) => {
          state.destinyPoints += destinyPoints;
          state.totalDestinyPointsEarned += destinyPoints;
          state.currentRun = null;
        });

        return { destinyPoints, rewards };
      },

      moveToRoom: (roomId) => {
        set((state) => {
          if (!state.currentRun) return;

          const currentRoom = state.currentRun.rooms.find(r => r.id === state.currentRun!.currentRoomId);
          if (!currentRoom || !currentRoom.connections.includes(roomId)) return;

          state.currentRun.rooms.forEach(r => {
            r.isCurrent = r.id === roomId;
          });
          state.currentRun.currentRoomId = roomId;

          const newRoom = state.currentRun.rooms.find(r => r.id === roomId);
          if (newRoom) {
            state.currentRun.currentFloor = newRoom.floor;
          }
        });
      },

      clearCurrentRoom: () => {
        set((state) => {
          if (!state.currentRun) return;

          const room = state.currentRun.rooms.find(r => r.id === state.currentRun!.currentRoomId);
          if (!room || room.isCleared) return;

          room.isCleared = true;
          state.currentRun.roomsCleared++;

          // 收集奖励
          if (room.rewards) {
            state.currentRun.collectedRewards.push(...room.rewards);
          }

          // 增加秘境货币
          state.currentRun.realmCoins += 10 + room.floor * 5;

          // 战斗房间增加击杀数
          if (room.enemies) {
            state.currentRun.enemiesKilled += room.enemies.length;
          }
        });
      },

      selectTalent: (talent) => {
        set((state) => {
          if (!state.currentRun) return;

          const existing = state.currentRun.acquiredTalents.find(t => t.talent.id === talent.id);
          if (existing) {
            if (talent.stackable && existing.stacks < talent.maxStacks) {
              existing.stacks++;
            }
          } else {
            state.currentRun.acquiredTalents.push({ talent, stacks: 1 });
          }
        });
      },

      getTalentChoices: () => {
        const { currentRun } = get();
        if (!currentRun) return [];

        const realm = SECRET_REALMS[currentRun.realmId];
        return selectRandomTalents(realm.talentPool, 3);
      },

      upgradePermanentTalent: (talentId) => {
        const { destinyPoints, permanentTalents } = get();
        const talent = permanentTalents[talentId];

        if (!talent) return false;
        if (talent.currentLevel >= talent.maxLevel) return false;

        const cost = talent.cost * (talent.currentLevel + 1);
        if (destinyPoints < cost) return false;

        // 检查前置
        for (const reqId of talent.requires) {
          const req = permanentTalents[reqId];
          if (!req || req.currentLevel === 0) return false;
        }

        set((state) => {
          state.destinyPoints -= cost;
          state.permanentTalents[talentId].currentLevel++;
        });

        return true;
      },

      getPermanentStatBonus: (stat) => {
        const { permanentTalents } = get();
        let total = 0;

        Object.values(permanentTalents).forEach(talent => {
          talent.effects.forEach(effect => {
            if (effect.stat === stat) {
              total += effect.valuePerLevel * talent.currentLevel;
            }
          });
        });

        return total;
      },

      reincarnate: (bonusDestinyPoints) => {
        set((state) => {
          state.reincarnationCount++;
          state.destinyPoints += bonusDestinyPoints;
          state.totalDestinyPointsEarned += bonusDestinyPoints;
          state.currentRun = null;
        });
      },

      checkDailyReset: () => {
        const today = new Date().toDateString();
        const { lastResetDate } = get();

        if (today !== lastResetDate) {
          set((state) => {
            state.dailyEntries = {};
            state.lastResetDate = today;
          });
        }
      },

      getCurrentRoom: () => {
        const { currentRun } = get();
        if (!currentRun) return null;
        return currentRun.rooms.find(r => r.id === currentRun.currentRoomId) || null;
      },

      getAvailableRooms: () => {
        const { currentRun } = get();
        if (!currentRun) return [];

        const currentRoom = currentRun.rooms.find(r => r.id === currentRun.currentRoomId);
        if (!currentRoom || !currentRoom.isCleared) return [];

        return currentRun.rooms.filter(r => currentRoom.connections.includes(r.id));
      },
    })),
    {
      name: 'wanjie-roguelike-storage',
    }
  )
);
