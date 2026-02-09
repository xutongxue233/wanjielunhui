import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  RealmRunState,
  Room,
  TemporaryTalent,
  RealmReward,
} from '../data/roguelike';
import {
  SECRET_REALMS,
  generateRealmRooms,
  selectRandomTalents,
} from '../data/roguelike';
import type { Combatant, CombatSkill, BattleRewards } from '../data/combat';
import { ENEMY_TEMPLATES, createEnemyFromTemplate, calculateEnemyStats } from '../data/combat/enemies';
import { v4 as uuidv4 } from 'uuid';

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

  // 秘境战斗相关
  startRoomBattle: (
    playerCombatant: Combatant,
    startBattleFn: (allies: Combatant[], enemies: Combatant[], rewards?: BattleRewards) => void
  ) => boolean;
  onBattleEnd: (victory: boolean, playerHp: number, playerMp: number) => void;
  calculateTalentBonuses: () => Record<string, number>;
  applyTalentBonusesToCombatant: (combatant: Combatant) => Combatant;
  generateRealmEnemies: (room: Room) => Combatant[];
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
        const { currentRun } = get();
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

      // 计算临时天赋加成
      calculateTalentBonuses: () => {
        const { currentRun } = get();
        const bonuses: Record<string, number> = {};

        if (!currentRun) return bonuses;

        currentRun.acquiredTalents.forEach(({ talent, stacks }) => {
          talent.effects.forEach(effect => {
            if (effect.type === 'stat_boost' && effect.stat) {
              const key = effect.stat;
              const value = effect.isPercentage ? effect.value * stacks : effect.value * stacks;
              bonuses[key] = (bonuses[key] || 0) + value;
            }
          });
        });

        return bonuses;
      },

      // 将临时天赋效果应用到战斗单位
      applyTalentBonusesToCombatant: (combatant: Combatant) => {
        const bonuses = get().calculateTalentBonuses();
        const modified = { ...combatant };

        // 百分比加成
        if (bonuses.attack) {
          modified.attack = Math.floor(modified.attack * (1 + bonuses.attack / 100));
        }
        if (bonuses.defense) {
          modified.defense = Math.floor(modified.defense * (1 + bonuses.defense / 100));
        }
        if (bonuses.speed) {
          modified.speed = Math.floor(modified.speed * (1 + bonuses.speed / 100));
        }
        if (bonuses.hp) {
          const hpRatio = modified.hp / modified.maxHp;
          modified.maxHp = Math.floor(modified.maxHp * (1 + bonuses.hp / 100));
          modified.hp = Math.floor(modified.maxHp * hpRatio);
        }
        if (bonuses.critRate) {
          modified.critRate = Math.min(1, modified.critRate + bonuses.critRate / 100);
        }
        if (bonuses.critDamage) {
          modified.critDamage = modified.critDamage + bonuses.critDamage / 100;
        }
        if (bonuses.damage_reduction) {
          // 伤害减免作为防御力百分比提升
          modified.defense = Math.floor(modified.defense * (1 + bonuses.damage_reduction / 100));
        }

        return modified;
      },

      // 生成秘境敌人
      generateRealmEnemies: (room: Room) => {
        const { currentRun } = get();
        if (!currentRun || !room.enemies) return [];

        const realm = SECRET_REALMS[currentRun.realmId];
        if (!realm) return [];

        const enemies: Combatant[] = [];

        room.enemies.forEach(enemyId => {
          // 尝试从预设敌人模板中获取
          const template = ENEMY_TEMPLATES[enemyId];
          if (template) {
            // 根据秘境难度和层数调整等级
            const levelBonus = currentRun.currentFloor - 1 + (realm.difficulty - 1) * 2;
            enemies.push(createEnemyFromTemplate(template, levelBonus));
          } else {
            // 如果没有预设模板，生成一个基础敌人
            const baseLevel = realm.difficulty * 2 + currentRun.currentFloor;
            const stats = calculateEnemyStats(baseLevel);

            // 根据房间类型调整属性
            let hpMultiplier = 1.0;
            let attackMultiplier = 1.0;
            let name = '妖兽';

            if (room.type === 'elite') {
              hpMultiplier = 2.0;
              attackMultiplier = 1.5;
              name = '精英妖兽';
            } else if (room.type === 'boss') {
              hpMultiplier = 3.5;
              attackMultiplier = 2.0;
              name = '秘境守护者';
            }

            const basicSkill: CombatSkill = {
              id: 'realm_attack',
              name: '猛击',
              description: '强力攻击',
              type: 'attack',
              element: 'neutral',
              mpCost: 10,
              cooldown: 2,
              currentCooldown: 0,
              damageMultiplier: 1.5,
              hitCount: 1,
              targetType: 'single',
              effects: [],
            };

            const enemy: Combatant = {
              id: uuidv4(),
              name,
              isPlayer: false,
              isAlly: false,
              hp: Math.floor(stats.hp * hpMultiplier),
              maxHp: Math.floor(stats.hp * hpMultiplier),
              mp: stats.mp,
              maxMp: stats.mp,
              attack: Math.floor(stats.attack * attackMultiplier),
              defense: stats.defense,
              speed: stats.speed,
              critRate: 0.05,
              critDamage: 1.5,
              element: 'neutral',
              skills: [basicSkill],
              buffs: [],
              debuffs: [],
              isAlive: true,
              actionGauge: Math.random() * 10,
            };

            enemies.push(enemy);
          }
        });

        return enemies;
      },

      // 启动秘境战斗
      startRoomBattle: (playerCombatant, startBattleFn) => {
        const { currentRun } = get();
        if (!currentRun) return false;

        const currentRoom = currentRun.rooms.find(r => r.id === currentRun.currentRoomId);
        if (!currentRoom) return false;

        // 只有战斗类型房间才能启动战斗
        if (!['combat', 'elite', 'boss'].includes(currentRoom.type)) {
          return false;
        }

        // 已清理的房间不能再战斗
        if (currentRoom.isCleared) {
          return false;
        }

        // 生成敌人
        const enemies = get().generateRealmEnemies(currentRoom);
        if (enemies.length === 0) {
          return false;
        }

        // 应用临时天赋加成到玩家
        const enhancedPlayer = get().applyTalentBonusesToCombatant(playerCombatant);

        // 更新玩家在秘境中的HP/MP状态到战斗单位
        enhancedPlayer.hp = Math.min(enhancedPlayer.maxHp, currentRun.hp);
        enhancedPlayer.mp = Math.min(enhancedPlayer.maxMp, currentRun.mp);

        // 计算战斗奖励
        const realm = SECRET_REALMS[currentRun.realmId];
        const rewardMultiplier = currentRoom.type === 'boss' ? 3 : currentRoom.type === 'elite' ? 2 : 1;

        const rewards: BattleRewards = {
          exp: 50 * realm.difficulty * currentRun.currentFloor * rewardMultiplier,
          spiritStones: 20 * realm.difficulty * currentRun.currentFloor * rewardMultiplier,
          items: [],
        };

        // 启动战斗
        startBattleFn([enhancedPlayer], enemies, rewards);

        return true;
      },

      // 战斗结束回调
      onBattleEnd: (victory, playerHp, playerMp) => {
        set((state) => {
          if (!state.currentRun) return;

          // 更新玩家HP/MP
          state.currentRun.hp = playerHp;
          state.currentRun.mp = playerMp;

          if (victory) {
            // 战斗胜利，清理房间
            const room = state.currentRun.rooms.find(r => r.id === state.currentRun!.currentRoomId);
            if (room && !room.isCleared) {
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

              // Boss房间特殊处理：如果是最后一层的boss，标记秘境完成
              if (room.type === 'boss') {
                const realm = SECRET_REALMS[state.currentRun.realmId];
                if (room.floor === realm.floors) {
                  // 秘境通关，额外奖励
                  state.currentRun.collectedRewards.push(
                    ...realm.rewardPool.filter(r => Math.random() < r.chance)
                  );
                }
              }
            }
          } else {
            // 战斗失败，秘境结束
            // 玩家HP归零，标记需要退出秘境
            state.currentRun.hp = 0;
          }
        });
      },
    })),
    {
      name: 'wanjie-roguelike-storage',
    }
  )
);
