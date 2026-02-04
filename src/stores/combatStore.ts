import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  BattleState,
  Combatant,
  CombatSkill,
  BattleRewards,
  StatusEffect,
} from '../data/combat';
import {
  calculateDamage,
  calculateHeal,
  calculateTurnOrder,
  processStatusEffects,
  isStunned,
  selectSkillAI,
  applyStatusEffect,
} from '../data/combat';
import { getDungeonById, generateDungeonEnemies, calculateSweepRewards, CHAPTERS } from '../data/combat/dungeons';
import { getSkillsByElement } from '../data/combat/skills';

// 副本进度
export interface DungeonProgress {
  dungeonId: string;
  isCleared: boolean;
  bestStars: number; // 0-3
  clearCount: number;
}

interface CombatState {
  battle: BattleState | null;
  isAutoBattle: boolean;
  battleSpeed: 1 | 2 | 3;
  selectedSkillId: string | null;

  // 副本进度
  dungeonProgress: Record<string, DungeonProgress>;
  currentDungeonId: string | null;

  // 体力系统
  stamina: number;
  maxStamina: number;
  lastStaminaUpdate: number;

  // 战斗控制
  startBattle: (allies: Combatant[], enemies: Combatant[], rewards?: BattleRewards) => void;
  startDungeonBattle: (dungeonId: string, playerCombatant: Combatant) => void;
  endBattle: (victory: boolean) => void;

  // 回合控制
  nextTurn: () => void;
  executeAction: (skillId: string, targetId: string) => void;
  executeAIAction: () => void;
  selectSkill: (skillId: string | null) => void;

  // 副本系统
  sweepDungeon: (dungeonId: string, times: number) => { exp: number; spiritStones: number; items: { itemId: string; quantity: number }[] } | null;
  isDungeonUnlocked: (dungeonId: string) => boolean;
  getDungeonProgress: (dungeonId: string) => DungeonProgress | null;

  // 体力
  consumeStamina: (amount: number) => boolean;
  restoreStamina: (amount: number) => void;
  updateStamina: () => void;

  // 设置
  toggleAutoBattle: () => void;
  setBattleSpeed: (speed: 1 | 2 | 3) => void;

  // 工具方法
  getCombatantById: (id: string) => Combatant | null;
  getAvailableTargets: (skill: CombatSkill) => Combatant[];
  getPlayerSkills: (element: string) => CombatSkill[];
}

const STAMINA_REGEN_INTERVAL = 5 * 60 * 1000; // 5分钟恢复1点体力

export const useCombatStore = create<CombatState>()(
  persist(
    immer((set, get) => ({
      battle: null,
      isAutoBattle: true,
      battleSpeed: 1,
      selectedSkillId: null,
      dungeonProgress: {},
      currentDungeonId: null,
      stamina: 100,
      maxStamina: 100,
      lastStaminaUpdate: Date.now(),

      startBattle: (allies, enemies, rewards) => {
        const allCombatants = [...allies, ...enemies];
        const turnOrder = calculateTurnOrder(allCombatants);

        set((state) => {
          state.battle = {
            id: uuidv4(),
            turn: 1,
            phase: 'fighting',
            allies,
            enemies,
            turnOrder,
            currentActorId: turnOrder[0] || null,
            logs: [{
              turn: 0,
              actorId: 'system',
              actorName: '系统',
              action: '战斗开始！',
            }],
            rewards,
          };
          state.selectedSkillId = null;
        });
      },

      startDungeonBattle: (dungeonId, playerCombatant) => {
        const dungeon = getDungeonById(dungeonId);
        if (!dungeon) return;

        const enemies = generateDungeonEnemies(dungeon);
        const rewards: BattleRewards = {
          exp: dungeon.rewards.exp,
          spiritStones: dungeon.rewards.spiritStones,
          items: [],
        };

        // 计算掉落
        dungeon.rewards.drops.forEach(drop => {
          if (Math.random() < drop.chance) {
            rewards.items.push({ itemId: drop.itemId, quantity: drop.quantity });
          }
        });

        set((state) => {
          state.currentDungeonId = dungeonId;
        });

        get().startBattle([playerCombatant], enemies, rewards);
      },

      endBattle: (victory) => {
        const { currentDungeonId } = get();

        set((state) => {
          if (state.battle) {
            state.battle.phase = victory ? 'victory' : 'defeat';
            state.battle.logs.push({
              turn: state.battle.turn,
              actorId: 'system',
              actorName: '系统',
              action: victory ? '战斗胜利！' : '战斗失败...',
            });

            // 更新副本进度
            if (victory && currentDungeonId) {
              const existingProgress = state.dungeonProgress[currentDungeonId];
              const player = state.battle.allies.find(a => a.isPlayer);
              const hpPercent = player ? player.hp / player.maxHp : 0;

              // 计算星级评价
              let stars = 1;
              if (hpPercent >= 0.7) stars = 3;
              else if (hpPercent >= 0.3) stars = 2;

              state.dungeonProgress[currentDungeonId] = {
                dungeonId: currentDungeonId,
                isCleared: true,
                bestStars: Math.max(existingProgress?.bestStars || 0, stars),
                clearCount: (existingProgress?.clearCount || 0) + 1,
              };
            }
          }
        });
      },

      nextTurn: () => {
        const { battle } = get();
        if (!battle || battle.phase !== 'fighting') return;

        set((state) => {
          if (!state.battle) return;

          const allCombatants = [...state.battle.allies, ...state.battle.enemies];
          const aliveCombatants = allCombatants.filter(c => c.isAlive);

          // 检查战斗结束
          const aliveAllies = state.battle.allies.filter(c => c.isAlive);
          const aliveEnemies = state.battle.enemies.filter(c => c.isAlive);

          if (aliveEnemies.length === 0) {
            state.battle.phase = 'victory';
            state.battle.logs.push({
              turn: state.battle.turn,
              actorId: 'system',
              actorName: '系统',
              action: '战斗胜利！',
            });
            return;
          }
          if (aliveAllies.length === 0) {
            state.battle.phase = 'defeat';
            state.battle.logs.push({
              turn: state.battle.turn,
              actorId: 'system',
              actorName: '系统',
              action: '战斗失败...',
            });
            return;
          }

          // 从当前行动顺序中移除已行动的角色，选择下一个
          const currentIndex = state.battle.turnOrder.indexOf(state.battle.currentActorId || '');
          const nextIndex = currentIndex + 1;

          if (nextIndex >= state.battle.turnOrder.length) {
            // 所有人都行动过了，进入下一回合
            state.battle.turnOrder = calculateTurnOrder(aliveCombatants);
            state.battle.currentActorId = state.battle.turnOrder[0] || null;
            state.battle.turn++;
          } else {
            // 当前回合内，下一个角色行动
            // 确保下一个角色还活着
            let validNextIndex = nextIndex;
            while (validNextIndex < state.battle.turnOrder.length) {
              const nextActorId = state.battle.turnOrder[validNextIndex];
              const nextActor = aliveCombatants.find(c => c.id === nextActorId);
              if (nextActor && nextActor.isAlive) {
                state.battle.currentActorId = nextActorId;
                break;
              }
              validNextIndex++;
            }
            // 如果剩余的都死了，进入下一回合
            if (validNextIndex >= state.battle.turnOrder.length) {
              state.battle.turnOrder = calculateTurnOrder(aliveCombatants);
              state.battle.currentActorId = state.battle.turnOrder[0] || null;
              state.battle.turn++;
            }
          }

          // 处理当前行动者的状态效果
          const currentActor = aliveCombatants.find(c => c.id === state.battle!.currentActorId);
          if (currentActor) {
            const effectResult = processStatusEffects(currentActor);

            if (effectResult.damage > 0) {
              currentActor.hp = Math.max(0, currentActor.hp - effectResult.damage);
              if (currentActor.hp === 0) {
                currentActor.isAlive = false;
              }
            }

            if (effectResult.heal > 0) {
              currentActor.hp = Math.min(currentActor.maxHp, currentActor.hp + effectResult.heal);
            }

            effectResult.logs.forEach(log => {
              state.battle!.logs.push({
                turn: state.battle!.turn,
                actorId: currentActor.id,
                actorName: currentActor.name,
                action: log,
              });
            });

            // 减少技能冷却
            currentActor.skills.forEach(skill => {
              if (skill.currentCooldown > 0) {
                skill.currentCooldown--;
              }
            });
          }
        });
      },

      executeAction: (skillId, targetId) => {
        const { battle } = get();
        if (!battle || battle.phase !== 'fighting' || !battle.currentActorId) return;

        set((state) => {
          if (!state.battle) return;

          const allCombatants = [...state.battle.allies, ...state.battle.enemies];
          const actor = allCombatants.find(c => c.id === state.battle!.currentActorId);
          const target = allCombatants.find(c => c.id === targetId);

          if (!actor || !target) return;

          // 检查是否被控制
          if (isStunned(actor)) {
            state.battle.logs.push({
              turn: state.battle.turn,
              actorId: actor.id,
              actorName: actor.name,
              action: '无法行动！',
            });
            return;
          }

          // 获取技能
          let skill = actor.skills.find(s => s.id === skillId);
          if (!skill || skill.currentCooldown > 0 || actor.mp < skill.mpCost) {
            skill = {
              id: 'basic_attack',
              name: '普通攻击',
              description: '',
              type: 'attack',
              element: actor.element,
              mpCost: 0,
              cooldown: 0,
              currentCooldown: 0,
              damageMultiplier: 1,
              hitCount: 1,
              targetType: 'single',
              effects: [],
            };
          }

          // 消耗法力
          actor.mp -= skill.mpCost;

          // 设置冷却
          if (skill.cooldown > 0) {
            const actualSkill = actor.skills.find(s => s.id === skillId);
            if (actualSkill) {
              actualSkill.currentCooldown = skill.cooldown;
            }
          }

          // 根据技能类型执行
          if (skill.type === 'support') {
            const healAmount = calculateHeal(actor, target, skill);
            target.hp = Math.min(target.maxHp, target.hp + healAmount);

            state.battle.logs.push({
              turn: state.battle.turn,
              actorId: actor.id,
              actorName: actor.name,
              action: `使用${skill.name}`,
              targetId: target.id,
              targetName: target.name,
              heal: healAmount,
            });
          } else {
            const targets = skill.targetType === 'all'
              ? (actor.isAlly ? state.battle.enemies : state.battle.allies).filter(c => c.isAlive)
              : [target];

            for (let hit = 0; hit < skill.hitCount; hit++) {
              targets.forEach(t => {
                const result = calculateDamage(actor, t, skill!);
                t.hp = Math.max(0, t.hp - result.damage);

                if (t.hp === 0) {
                  t.isAlive = false;
                }

                state.battle!.logs.push({
                  turn: state.battle!.turn,
                  actorId: actor.id,
                  actorName: actor.name,
                  action: `使用${skill!.name}`,
                  targetId: t.id,
                  targetName: t.name,
                  damage: result.damage,
                  isCrit: result.isCrit,
                });
              });
            }

            // 应用技能效果
            skill.effects.forEach(effect => {
              if ((effect.type === 'debuff' || effect.type === 'dot') && effect.statusType) {
                const chance = effect.chance || 1;
                if (Math.random() < chance) {
                  const statusEffect: StatusEffect = {
                    id: effect.statusType,
                    name: effect.statusType,
                    type: 'debuff',
                    duration: effect.duration || 2,
                    dotDamage: effect.type === 'dot' ? effect.value : undefined,
                    isStun: effect.statusType === 'stun',
                    isFreeze: effect.statusType === 'freeze',
                    isBurn: effect.statusType === 'burn',
                    isPoison: effect.statusType === 'poison',
                  };
                  targets.forEach(t => applyStatusEffect(t, statusEffect));
                }
              }
            });
          }

          state.selectedSkillId = null;
        });

        get().nextTurn();
      },

      executeAIAction: () => {
        const { battle } = get();
        if (!battle || battle.phase !== 'fighting' || !battle.currentActorId) return;

        const allCombatants = [...battle.allies, ...battle.enemies];
        const actor = allCombatants.find(c => c.id === battle.currentActorId);

        if (!actor) return;

        const allies = actor.isAlly ? battle.allies : battle.enemies;
        const enemies = actor.isAlly ? battle.enemies : battle.allies;

        const { skill, target } = selectSkillAI(actor, allies, enemies);
        get().executeAction(skill.id, target.id);
      },

      selectSkill: (skillId) => {
        set((state) => {
          state.selectedSkillId = skillId;
        });
      },

      sweepDungeon: (dungeonId, times) => {
        const dungeon = getDungeonById(dungeonId);
        const progress = get().dungeonProgress[dungeonId];

        if (!dungeon || !progress?.isCleared) return null;

        const totalCost = dungeon.sweepCost * times;
        if (!get().consumeStamina(totalCost)) return null;

        const rewards = calculateSweepRewards(dungeon, times);

        set((state) => {
          const existing = state.dungeonProgress[dungeonId];
          if (existing) {
            existing.clearCount += times;
          }
        });

        return rewards;
      },

      isDungeonUnlocked: (dungeonId) => {
        const dungeon = getDungeonById(dungeonId);
        if (!dungeon) return false;

        // 第一关永远解锁
        if (dungeon.chapter === 1 && dungeon.stage === 1) return true;

        // 检查前一关是否通关
        const prevStage = dungeon.stage - 1;
        if (prevStage >= 1) {
          const prevId = `${dungeon.chapter}-${prevStage}`;
          return get().dungeonProgress[prevId]?.isCleared || false;
        }

        // 检查前一章最后一关
        const prevChapter = CHAPTERS.find(c => c.id === dungeon.chapter - 1);
        if (prevChapter) {
          const lastStage = prevChapter.stages[prevChapter.stages.length - 1];
          return get().dungeonProgress[lastStage.id]?.isCleared || false;
        }

        return false;
      },

      getDungeonProgress: (dungeonId) => {
        return get().dungeonProgress[dungeonId] || null;
      },

      consumeStamina: (amount) => {
        const { stamina } = get();
        if (stamina < amount) return false;

        set((state) => {
          state.stamina -= amount;
        });
        return true;
      },

      restoreStamina: (amount) => {
        set((state) => {
          state.stamina = Math.min(state.maxStamina, state.stamina + amount);
        });
      },

      updateStamina: () => {
        const { lastStaminaUpdate, stamina, maxStamina } = get();
        const now = Date.now();
        const elapsed = now - lastStaminaUpdate;
        const regenAmount = Math.floor(elapsed / STAMINA_REGEN_INTERVAL);

        if (regenAmount > 0 && stamina < maxStamina) {
          set((state) => {
            state.stamina = Math.min(maxStamina, stamina + regenAmount);
            state.lastStaminaUpdate = now;
          });
        }
      },

      toggleAutoBattle: () => {
        set((state) => {
          state.isAutoBattle = !state.isAutoBattle;
        });
      },

      setBattleSpeed: (speed) => {
        set((state) => {
          state.battleSpeed = speed;
        });
      },

      getCombatantById: (id) => {
        const { battle } = get();
        if (!battle) return null;

        const allCombatants = [...battle.allies, ...battle.enemies];
        return allCombatants.find(c => c.id === id) || null;
      },

      getAvailableTargets: (skill) => {
        const { battle } = get();
        if (!battle || !battle.currentActorId) return [];

        const allCombatants = [...battle.allies, ...battle.enemies];
        const actor = allCombatants.find(c => c.id === battle.currentActorId);

        if (!actor) return [];

        if (skill.targetType === 'self') {
          return [actor];
        }

        if (skill.type === 'support') {
          return (actor.isAlly ? battle.allies : battle.enemies).filter(c => c.isAlive);
        }

        return (actor.isAlly ? battle.enemies : battle.allies).filter(c => c.isAlive);
      },

      getPlayerSkills: (element) => {
        return getSkillsByElement(element as any);
      },
    })),
    {
      name: 'wanjie-combat-storage',
      partialize: (state) => ({
        dungeonProgress: state.dungeonProgress,
        stamina: state.stamina,
        maxStamina: state.maxStamina,
        lastStaminaUpdate: state.lastStaminaUpdate,
        isAutoBattle: state.isAutoBattle,
        battleSpeed: state.battleSpeed,
      }),
    }
  )
);
