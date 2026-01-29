import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import {
  BattleState,
  Combatant,
  CombatSkill,
  BattleLog,
  BattleRewards,
  calculateDamage,
  calculateHeal,
  calculateTurnOrder,
  processStatusEffects,
  isStunned,
  selectSkillAI,
  applyStatusEffect,
  StatusEffect,
} from '../../data/combat';

interface CombatState {
  battle: BattleState | null;
  isAutoBattle: boolean;
  battleSpeed: 1 | 2 | 3;

  // 战斗控制
  startBattle: (allies: Combatant[], enemies: Combatant[], rewards?: BattleRewards) => void;
  endBattle: (victory: boolean) => void;

  // 回合控制
  nextTurn: () => void;
  executeAction: (skillId: string, targetId: string) => void;
  executeAIAction: () => void;

  // 设置
  toggleAutoBattle: () => void;
  setBattleSpeed: (speed: 1 | 2 | 3) => void;

  // 工具方法
  getCombatantById: (id: string) => Combatant | null;
  getAvailableTargets: (skill: CombatSkill) => Combatant[];
}

export const useCombatStore = create<CombatState>()(
  immer((set, get) => ({
    battle: null,
    isAutoBattle: true,
    battleSpeed: 1,

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
      });
    },

    endBattle: (victory) => {
      set((state) => {
        if (state.battle) {
          state.battle.phase = victory ? 'victory' : 'defeat';
          state.battle.logs.push({
            turn: state.battle.turn,
            actorId: 'system',
            actorName: '系统',
            action: victory ? '战斗胜利！' : '战斗失败...',
          });
        }
      });
    },

    nextTurn: () => {
      const { battle } = get();
      if (!battle || battle.phase !== 'fighting') return;

      set((state) => {
        if (!state.battle) return;

        // 获取所有存活单位
        const allCombatants = [...state.battle.allies, ...state.battle.enemies];
        const aliveCombatants = allCombatants.filter(c => c.isAlive);

        // 检查战斗结束
        const aliveAllies = state.battle.allies.filter(c => c.isAlive);
        const aliveEnemies = state.battle.enemies.filter(c => c.isAlive);

        if (aliveEnemies.length === 0) {
          state.battle.phase = 'victory';
          return;
        }
        if (aliveAllies.length === 0) {
          state.battle.phase = 'defeat';
          return;
        }

        // 更新回合顺序
        state.battle.turnOrder = calculateTurnOrder(aliveCombatants);
        state.battle.currentActorId = state.battle.turnOrder[0] || null;
        state.battle.turn++;

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
          // 使用普通攻击
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
          // 治疗技能
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
          // 攻击技能
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
            if (effect.type === 'debuff' && effect.statusType) {
              const chance = effect.chance || 1;
              if (Math.random() < chance) {
                const statusEffect: StatusEffect = {
                  id: effect.statusType,
                  name: effect.statusType,
                  type: 'debuff',
                  duration: effect.duration || 2,
                  dotDamage: effect.type === 'dot' ? effect.value : undefined,
                };
                targets.forEach(t => applyStatusEffect(t, statusEffect));
              }
            }
          });
        }
      });

      // 自动进入下一回合
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
  }))
);
