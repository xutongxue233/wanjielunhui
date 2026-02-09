import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../ui';
import { useCombatStore } from '../../stores/combatStore';
import { usePlayerStore } from '../../stores/playerStore';
import type { Combatant, CombatSkill } from '../../data/combat';
import { generateRandomEncounter } from '../../data/combat/enemies';
import { getSkillsByElement } from '../../data/combat/skills';
import './CombatPanel.css';

// 技能按钮组件
const SkillButton: React.FC<{
  skill: CombatSkill;
  currentMp: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ skill, currentMp, isSelected, onSelect }) => {
  const isOnCooldown = skill.currentCooldown > 0;
  const isNotEnoughMp = currentMp < skill.mpCost;
  const isDisabled = isOnCooldown || isNotEnoughMp;

  // 根据技能类型获取边框颜色
  const getSkillBorderColor = () => {
    if (isSelected) return 'border-amber-400';
    if (isDisabled) return 'border-ink-light';
    switch (skill.type) {
      case 'ultimate': return 'border-purple-500/50';
      case 'support': return 'border-green-500/50';
      case 'defense': return 'border-blue-500/50';
      default: return 'border-crimson/50';
    }
  };

  // 根据技能元素获取背景颜色
  const getSkillBgColor = () => {
    if (isSelected) return 'bg-amber-500/20';
    if (isDisabled) return 'bg-ink-dark/50';
    switch (skill.element) {
      case 'fire': return 'bg-red-900/20';
      case 'water': return 'bg-blue-900/20';
      case 'wood': return 'bg-green-900/20';
      case 'metal': return 'bg-gray-700/20';
      case 'earth': return 'bg-yellow-900/20';
      default: return 'bg-ink-medium/30';
    }
  };

  return (
    <motion.button
      className={`skill-slot relative flex flex-col items-center justify-center min-w-[90px] px-3 py-2 rounded-lg border-2 transition-all ${getSkillBorderColor()} ${getSkillBgColor()} ${
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
      } ${isSelected ? 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20' : ''}`}
      onClick={() => !isDisabled && onSelect()}
      whileHover={!isDisabled ? { scale: 1.05 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      disabled={isDisabled}
    >
      {/* 技能名称 */}
      <span className={`text-sm font-medium ${isDisabled ? 'text-text-muted' : 'text-text-primary'}`}>
        {skill.name}
      </span>

      {/* 法力消耗 */}
      <span className={`text-xs mt-1 ${isNotEnoughMp ? 'text-red-400' : 'text-blue-400'}`}>
        {skill.mpCost > 0 ? `${skill.mpCost} MP` : '无消耗'}
      </span>

      {/* 冷却显示 */}
      {isOnCooldown && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-dark/70 rounded-lg">
          <span className="text-lg font-bold text-amber-400">{skill.currentCooldown}</span>
        </div>
      )}

      {/* 技能类型标识 */}
      {skill.type === 'ultimate' && !isOnCooldown && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">!</span>
        </div>
      )}
    </motion.button>
  );
};

// 技能栏组件
const SkillBar: React.FC<{
  skills: CombatSkill[];
  currentMp: number;
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string) => void;
  onBasicAttack: () => void;
}> = ({ skills, currentMp, selectedSkillId, onSelectSkill, onBasicAttack }) => {
  // 基础攻击技能
  const basicAttack: CombatSkill = {
    id: 'basic_attack',
    name: '普通攻击',
    description: '基础攻击',
    type: 'attack',
    element: 'neutral',
    mpCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    damageMultiplier: 1,
    hitCount: 1,
    targetType: 'single',
    effects: [],
  };

  return (
    <div className="skill-bar-container">
      <div className="skill-bar-header">
        <span className="text-xs text-text-muted">技能栏</span>
        <span className="text-xs text-blue-400">MP: {currentMp}</span>
      </div>
      <div className="skill-bar-content">
        {/* 普通攻击按钮 */}
        <SkillButton
          skill={basicAttack}
          currentMp={currentMp}
          isSelected={selectedSkillId === 'basic_attack'}
          onSelect={onBasicAttack}
        />

        {/* 技能按钮 */}
        {skills.map((skill) => (
          <SkillButton
            key={skill.id}
            skill={skill}
            currentMp={currentMp}
            isSelected={selectedSkillId === skill.id}
            onSelect={() => onSelectSkill(skill.id)}
          />
        ))}
      </div>

      {/* 操作提示 */}
      <AnimatePresence>
        {selectedSkillId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="skill-bar-hint"
          >
            <span className="text-amber-400">请选择目标</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 战斗单位卡片
const CombatantCard: React.FC<{
  combatant: Combatant;
  isCurrentActor: boolean;
  isTargetable: boolean;
  onSelect?: () => void;
}> = ({ combatant, isCurrentActor, isTargetable, onSelect }) => {
  const hpPercent = (combatant.hp / combatant.maxHp) * 100;

  return (
    <motion.div
      className={`p-3 rounded-lg border transition-all ${
        !combatant.isAlive
          ? 'bg-ink-dark/30 border-ink-light opacity-50'
          : isCurrentActor
          ? 'bg-amber-500/20 border-amber-500'
          : isTargetable
          ? 'bg-red-500/10 border-red-500/50 cursor-pointer hover:border-red-500'
          : 'bg-ink-medium/30 border-ink-light'
      }`}
      onClick={isTargetable && combatant.isAlive ? onSelect : undefined}
      whileHover={isTargetable ? { scale: 1.02 } : undefined}
      animate={isCurrentActor ? { boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' } : {}}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium ${combatant.isAlive ? 'text-text-primary' : 'text-text-muted'}`}>
          {combatant.name}
        </span>
        {isCurrentActor && (
          <span className="text-xs text-amber-400">行动中</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted w-8">气血</span>
          <div className="flex-1 h-2 bg-ink-medium rounded overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-xs text-text-secondary w-16 text-right">
            {combatant.hp}/{combatant.maxHp}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted w-8">法力</span>
          <div className="flex-1 h-2 bg-ink-medium rounded overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
              animate={{ width: `${(combatant.mp / combatant.maxMp) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-secondary w-16 text-right">
            {combatant.mp}/{combatant.maxMp}
          </span>
        </div>
      </div>

      {combatant.buffs.length > 0 || combatant.debuffs.length > 0 ? (
        <div className="flex gap-1 mt-2 flex-wrap">
          {combatant.buffs.map((buff, i) => (
            <span key={i} className="px-1 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
              {buff.name}({buff.duration})
            </span>
          ))}
          {combatant.debuffs.map((debuff, i) => (
            <span key={i} className="px-1 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
              {debuff.name}({debuff.duration})
            </span>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
};

// 战斗日志
const BattleLogPanel: React.FC = () => {
  const battle = useCombatStore((state) => state.battle);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battle?.logs.length]);

  if (!battle) return null;

  return (
    <div className="h-40 overflow-y-auto bg-ink-dark/30 rounded-lg p-3 text-sm">
      {battle.logs.map((log, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`py-1 border-b border-ink-light/50 ${
            log.actorId === 'system' ? 'text-amber-400' : 'text-text-secondary'
          }`}
        >
          {log.actorId !== 'system' && (
            <span className="text-text-muted">[回合{log.turn}] </span>
          )}
          <span className="text-text-primary">{log.actorName}</span>
          <span className="text-text-secondary"> {log.action}</span>
          {log.targetName && (
            <span className="text-text-secondary"> -{'>'} {log.targetName}</span>
          )}
          {log.damage && (
            <span className={log.isCrit ? 'text-yellow-400' : 'text-red-400'}>
              {' '}{log.isCrit ? '暴击!' : ''}-{log.damage}
            </span>
          )}
          {log.heal && (
            <span className="text-green-400"> +{log.heal}</span>
          )}
        </motion.div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

// 主战斗面板
export const CombatPanel: React.FC = () => {
  const player = usePlayerStore((state) => state.player);
  const addCultivation = usePlayerStore((state) => state.addCultivation);
  const battle = useCombatStore((state) => state.battle);
  const isAutoBattle = useCombatStore((state) => state.isAutoBattle);
  const battleSpeed = useCombatStore((state) => state.battleSpeed);

  const startBattle = useCombatStore((state) => state.startBattle);
  const endBattle = useCombatStore((state) => state.endBattle);
  const executeAIAction = useCombatStore((state) => state.executeAIAction);
  const executeAction = useCombatStore((state) => state.executeAction);
  const toggleAutoBattle = useCombatStore((state) => state.toggleAutoBattle);
  const setBattleSpeed = useCombatStore((state) => state.setBattleSpeed);

  // 当前选中的技能ID
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // 切换自动/手动模式时清除技能选择
  useEffect(() => {
    if (isAutoBattle) {
      setSelectedSkillId(null);
    }
  }, [isAutoBattle]);

  // 战斗胜利时发放奖励
  const rewardClaimedRef = useRef<string | null>(null);
  useEffect(() => {
    if (battle?.phase === 'victory' && battle.rewards && rewardClaimedRef.current !== battle.id) {
      rewardClaimedRef.current = battle.id;
      // 经验转化为修为
      addCultivation(battle.rewards.exp);
    }
  }, [battle?.phase, battle?.id, battle?.rewards, addCultivation]);

  // 自动战斗循环
  useEffect(() => {
    if (!battle || battle.phase !== 'fighting' || !isAutoBattle) return;

    const interval = setInterval(() => {
      executeAIAction();
    }, 1000 / battleSpeed);

    return () => clearInterval(interval);
  }, [battle, isAutoBattle, battleSpeed, executeAIAction]);

  // 开始新战斗
  const handleStartBattle = () => {
    if (!player) return;

    const playerLevel = player.realm.level;
    const playerElement = player.spiritualRoot.elements[0] || 'neutral';

    // 获取玩家技能
    const playerSkills = getSkillsByElement(playerElement as any).map(skill => ({
      ...skill,
      currentCooldown: 0,
    }));

    // 创建玩家战斗单位
    const playerCombatant: Combatant = {
      id: player.id,
      name: player.name,
      isPlayer: true,
      isAlly: true,
      hp: player.attributes.hp,
      maxHp: player.attributes.maxHp,
      mp: player.attributes.mp,
      maxMp: player.attributes.maxMp,
      attack: player.attributes.attack,
      defense: player.attributes.defense,
      speed: player.attributes.speed,
      critRate: player.attributes.critRate,
      critDamage: player.attributes.critDamage,
      element: playerElement,
      skills: playerSkills,
      buffs: [],
      debuffs: [],
      isAlive: true,
      actionGauge: 0,
    };

    // 生成敌人
    const enemies = generateRandomEncounter(playerLevel, 1);

    // 计算奖励
    const totalExp = enemies.reduce((sum, _e) => sum + 30, 0);
    const totalStones = enemies.reduce((sum, _e) => sum + 10, 0);

    startBattle([playerCombatant], enemies, {
      exp: totalExp,
      spiritStones: totalStones,
      items: [],
    });
  };

  // 没有战斗时显示开始按钮
  if (!battle) {
    return (
      <Card title="战斗" className="w-full">
        <div className="text-center py-8">
          <p className="text-text-secondary mb-6">
            与妖兽或其他修士战斗，获取修炼资源和经验。
          </p>
          <Button onClick={handleStartBattle}>
            开始战斗
          </Button>
        </div>
      </Card>
    );
  }

  // 战斗结束
  if (battle.phase === 'victory' || battle.phase === 'defeat') {
    return (
      <Card title={battle.phase === 'victory' ? '战斗胜利' : '战斗失败'} className="w-full">
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-4xl mb-4 ${
              battle.phase === 'victory' ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {battle.phase === 'victory' ? '胜' : '败'}
          </motion.div>

          {battle.phase === 'victory' && battle.rewards && (
            <div className="bg-ink-medium/30 rounded-lg p-4 mb-4">
              <h4 className="text-text-secondary mb-2">战斗奖励</h4>
              <div className="flex justify-center gap-6">
                <div>
                  <span className="text-text-muted">经验: </span>
                  <span className="text-amber-400">+{battle.rewards.exp}</span>
                </div>
                <div>
                  <span className="text-text-muted">灵石: </span>
                  <span className="text-azure-light">+{battle.rewards.spiritStones}</span>
                </div>
              </div>
            </div>
          )}

          <BattleLogPanel />

          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={handleStartBattle}>
              再战一场
            </Button>
            <Button variant="ghost" onClick={() => endBattle(false)}>
              返回
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // 战斗进行中
  return (
    <Card title={`战斗 - 回合 ${battle.turn}`} className="w-full">
      <div className="space-y-4">
        {/* 控制栏 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isAutoBattle ? 'primary' : 'secondary'}
              onClick={toggleAutoBattle}
            >
              {isAutoBattle ? '自动中' : '手动'}
            </Button>
            <div className="battle-speed-group">
              {[1, 2, 3].map((speed) => (
                <button
                  key={speed}
                  className={`battle-speed-btn ${battleSpeed === speed ? 'active' : ''}`}
                  onClick={() => setBattleSpeed(speed as 1 | 2 | 3)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 敌方单位 */}
        <div>
          <h4 className="text-sm text-text-muted mb-2">敌方</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {battle.enemies.map((enemy) => {
              // 手动模式下，当前行动者是我方单位时，敌方存活单位可被选中
              const isPlayerTurn = !isAutoBattle && battle.allies.some(a => a.id === battle.currentActorId);
              // 只有选中了技能后才能选择目标
              const canTarget = isPlayerTurn && enemy.isAlive && selectedSkillId !== null;
              return (
              <CombatantCard
                key={enemy.id}
                combatant={enemy}
                isCurrentActor={battle.currentActorId === enemy.id}
                isTargetable={canTarget}
                onSelect={canTarget ? () => {
                  // 使用选中的技能对该目标发动攻击
                  executeAction(selectedSkillId!, enemy.id);
                  setSelectedSkillId(null);
                } : undefined}
              />
              );
            })}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-ink-light my-2" />

        {/* 我方单位 */}
        <div>
          <h4 className="text-sm text-text-muted mb-2">我方</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {battle.allies.map((ally) => (
              <CombatantCard
                key={ally.id}
                combatant={ally}
                isCurrentActor={battle.currentActorId === ally.id}
                isTargetable={false}
              />
            ))}
          </div>
        </div>

        {/* 技能栏 - 仅手动模式且轮到我方行动时显示 */}
        {!isAutoBattle && battle.allies.some(a => a.id === battle.currentActorId) && (() => {
          const playerCombatant = battle.allies.find(a => a.isPlayer);
          if (!playerCombatant) return null;
          return (
            <SkillBar
              skills={playerCombatant.skills}
              currentMp={playerCombatant.mp}
              selectedSkillId={selectedSkillId}
              onSelectSkill={(skillId) => {
                // 切换技能选择状态
                setSelectedSkillId(selectedSkillId === skillId ? null : skillId);
              }}
              onBasicAttack={() => {
                // 选择普通攻击
                setSelectedSkillId(selectedSkillId === 'basic_attack' ? null : 'basic_attack');
              }}
            />
          );
        })()}

        {/* 战斗日志 */}
        <BattleLogPanel />
      </div>
    </Card>
  );
};
