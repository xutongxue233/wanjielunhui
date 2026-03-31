import { useEffect, useMemo } from 'react';
import { calculateCultivationSpeed } from '../../core/game-loop';
import { useAlchemyStore } from '../../stores/alchemyStore';
import { useCombatStore } from '../../stores/combatStore';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useRoguelikeStore } from '../../stores/roguelikeStore';
import { FURNACES } from '../../data/alchemy';
import { getEffectiveCombatStat } from '../../data/combat';
import {
  ENEMY_TEMPLATES,
  STORY_ENEMY_TEMPLATES,
  calculateEnemyStats,
} from '../../data/combat/enemies';
import { getRealmFromLevel } from '../../data/realms';
import { STORY_CHAPTERS } from '../../data/stories';
import type { Element, OriginType } from '../../types';
import type { EnemyTemplate } from '../../data/combat/enemies';

const STORAGE_KEYS = [
  'wanjie-player-storage',
  'wanjie-game-storage',
  'wanjie-combat-storage',
  'wanjie-alchemy-storage',
  'wanjie-roguelike-storage',
  'wanjie-content-cache',
];

interface AutomationParams {
  enabled: boolean;
  fresh: boolean;
  origin?: OriginType;
  chapter?: string;
  node?: string;
  element?: Element;
  encounterIds: string[];
  boost: boolean;
  forceProc: boolean;
}

function getAutomationParams(): AutomationParams {
  if (typeof window === 'undefined') {
    return { enabled: false, fresh: false, encounterIds: [], boost: false, forceProc: false };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedOrigin = params.get('origin');
  const origin = requestedOrigin && ['village_orphan', 'fallen_clan', 'reincarnation'].includes(requestedOrigin)
    ? requestedOrigin as OriginType
    : undefined;
  const requestedElement = params.get('element');
  const element = requestedElement && ['metal', 'wood', 'water', 'fire', 'earth'].includes(requestedElement)
    ? requestedElement as Element
    : undefined;
  const chapter = params.get('chapter') || undefined;
  const node = params.get('node') || undefined;
  const encounterIds = (params.get('encounter') || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return {
    enabled: params.has('autotest'),
    fresh: params.get('fresh') === '1',
    origin,
    chapter,
    node,
    element,
    encounterIds,
    boost: params.get('boost') === '1',
    forceProc: params.get('forceproc') === '1',
  };
}

function getActiveText(selector: string): string | null {
  const element = document.querySelector(selector);
  return element?.textContent?.trim() || null;
}

function getVisibleButtons(): string[] {
  return Array.from(document.querySelectorAll('button'))
    .map((button) => button.textContent?.trim() || '')
    .filter(Boolean)
    .slice(0, 12);
}

function resetAutomationState() {
  STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));

  usePlayerStore.getState().resetPlayer();
  useGameStore.getState().resetGame();
  useGameStore.getState().resetStoryProgress();
  useCombatStore.setState({
    battle: null,
    selectedSkillId: null,
    currentDungeonId: null,
  });
  useAlchemyStore.setState({
    alchemyLevel: 1,
    alchemyExp: 0,
    alchemyExpToNext: 100,
    currentFurnace: { ...FURNACES.basic_furnace },
    learnedRecipes: ['qi_gathering_pill', 'healing_pill'],
    refiningState: {
      isRefining: false,
      currentRecipeId: null,
      progress: 0,
      startTime: 0,
      endTime: 0,
    },
    pillInventory: [],
  });
  useRoguelikeStore.getState().resetRoguelike();
}

function bootstrapAutomationPlayer(origin: OriginType = 'reincarnation') {
  const gameStore = useGameStore.getState();
  const playerStore = usePlayerStore.getState();

  if (!playerStore.player) {
    gameStore.resetStoryProgress();
    playerStore.createCharacter('自动化道友', 'male', origin);
  }

  gameStore.setPaused(false);
  gameStore.setPhase('playing');
}

function applyAutomationElement(element: Element) {
  const playerStore = usePlayerStore.getState();
  if (!playerStore.player) {
    return;
  }

  usePlayerStore.setState({
    player: {
      ...playerStore.player,
      spiritualRoot: {
        ...playerStore.player.spiritualRoot,
        elements: [element],
      },
    },
  });
}

function getAutomationEncounterTemplates(encounterIds: string[]): EnemyTemplate[] {
  return encounterIds
    .map((id) => ENEMY_TEMPLATES[id] || STORY_ENEMY_TEMPLATES[id])
    .filter((template): template is EnemyTemplate => Boolean(template));
}

function getEncounterBoostProfile(encounterIds: string[]) {
  const templates = getAutomationEncounterTemplates(encounterIds);
  if (templates.length === 0) {
    return null;
  }

  const scaledEnemies = templates.map((template) => {
    const stats = calculateEnemyStats(template.level);
    return {
      level: template.level,
      hp: Math.floor(stats.hp * template.hpMultiplier),
      mp: Math.floor(stats.mp),
      attack: Math.floor(stats.attack * template.attackMultiplier),
      defense: Math.floor(stats.defense * template.defenseMultiplier),
      speed: Math.floor(stats.speed * template.speedMultiplier),
    };
  });

  const maxLevel = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.level), 18);
  const maxHp = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.hp), 0);
  const maxAttack = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.attack), 0);
  const maxDefense = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.defense), 0);
  const maxSpeed = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.speed), 0);
  const maxMp = scaledEnemies.reduce((current, enemy) => Math.max(current, enemy.mp), 0);

  return {
    realmLevel: Math.max(18, maxLevel + 1),
    hp: Math.max(900, Math.round(maxAttack * 5), Math.round(maxHp * 0.4)),
    mp: Math.max(320, Math.round(maxMp * 2.2)),
    attack: Math.max(120, Math.round(maxAttack * 0.7), Math.round(maxDefense * 4)),
    defense: Math.max(68, Math.round(maxAttack * 0.25), Math.round(maxDefense * 1.6)),
    speed: Math.max(52, Math.min(90, Math.round(maxSpeed * 0.92))),
  };
}

function applyAutomationBoost(encounterIds: string[] = []) {
  const playerStore = usePlayerStore.getState();
  if (!playerStore.player) {
    return;
  }

  const encounterBoost = getEncounterBoostProfile(encounterIds);
  const boostedRealmLevel = Math.max(
    playerStore.player.realm.level,
    encounterBoost?.realmLevel ?? 18
  );
  usePlayerStore.setState({
    player: {
      ...playerStore.player,
      realm: getRealmFromLevel(boostedRealmLevel),
      attributes: {
        ...playerStore.player.attributes,
        // 仅用于自动回归，确保剧情战与高阶固定敌阵都能稳定覆盖。
        hp: encounterBoost?.hp ?? 900,
        maxHp: encounterBoost?.hp ?? 900,
        mp: encounterBoost?.mp ?? 320,
        maxMp: encounterBoost?.mp ?? 320,
        attack: encounterBoost?.attack ?? 120,
        defense: encounterBoost?.defense ?? 68,
        speed: encounterBoost?.speed ?? 52,
        critRate: Math.max(playerStore.player.attributes.critRate, 0.35),
        critDamage: Math.max(playerStore.player.attributes.critDamage, 1.8),
      },
    },
  });
}

function applyAutomationScenario(chapterId?: string, nodeId?: string) {
  if (!chapterId) {
    return;
  }

  const chapter = STORY_CHAPTERS.find((entry) => entry.id === chapterId);
  const playerStore = usePlayerStore.getState();

  if (!chapter || !playerStore.player) {
    return;
  }

  const completedChapters = STORY_CHAPTERS
    .filter((entry) => entry.order < chapter.order)
    .map((entry) => entry.id);

  const unlockFlags = completedChapters.reduce<Record<string, boolean>>((flags, completedChapterId) => {
    flags[`${completedChapterId}_completed`] = true;
    return flags;
  }, {});

  const requiredRealmLevel = chapter.unlockConditions.reduce((maxLevel, condition) => {
    if (condition.type === 'realm' && condition.key === 'level') {
      return Math.max(maxLevel, Number(condition.value) || maxLevel);
    }
    return maxLevel;
  }, 1);

  usePlayerStore.setState({
    player: {
      ...playerStore.player,
      realm: getRealmFromLevel(requiredRealmLevel),
    },
  });

  const gameState = useGameStore.getState();
  useGameStore.setState({
    storyProgress: {
      ...gameState.storyProgress,
      currentChapterId: chapter.id,
      currentNodeId: nodeId || chapter.startNodeId,
      completedChapters,
      flags: {
        ...unlockFlags,
      },
    },
    storyHistory: [],
    storyDisplayState: { displayedText: '', isCompleted: false },
  });

  useGameStore.getState().setPhase('playing');
}

function buildReadableState(): string {
  const playerState = usePlayerStore.getState();
  const gameState = useGameStore.getState();
  const combatState = useCombatStore.getState();
  const alchemyState = useAlchemyStore.getState();
  const roguelikeState = useRoguelikeStore.getState();

  const player = playerState.player;
  const battle = combatState.battle;

  return JSON.stringify({
    screenModel: 'panel-based-ui',
    note: '该游戏为面板式文字修仙界面，无二维坐标系。',
    phase: gameState.phase,
    ui: {
      nav: getActiveText('.bottom-nav-item.active .bottom-nav-label'),
      gameTab: getActiveText('.game-tabs-nav .tab-xian.active'),
      visibleButtons: getVisibleButtons(),
    },
    player: player ? {
      name: player.name,
      realm: player.realm.displayName,
      cultivation: {
        current: Math.round(player.attributes.cultivation),
        required: Math.round(player.attributes.maxCultivation),
        speedPerSecond: Number(calculateCultivationSpeed(player).toFixed(2)),
      },
      hp: Math.round(player.attributes.hp),
      maxHp: Math.round(player.attributes.maxHp),
      mp: Math.round(player.attributes.mp),
      maxMp: Math.round(player.attributes.maxMp),
      totalPlayTime: Math.round(player.totalPlayTime),
      activeTechniqueId: player.activeTechniqueId,
      inventoryPreview: player.inventory.slice(0, 6).map((entry) => ({
        id: entry.item.id,
        name: entry.item.name,
        quantity: entry.quantity,
      })),
    } : null,
    story: {
      chapterId: gameState.storyProgress.currentChapterId,
      nodeId: gameState.storyProgress.currentNodeId,
      completedChapters: gameState.storyProgress.completedChapters,
      flags: gameState.storyProgress.flags,
    },
    storyBattle: gameState.storyBattleState ? {
      chapterId: gameState.storyBattleState.chapterId,
      nodeId: gameState.storyBattleState.nodeId,
      nextNodeId: gameState.storyBattleState.nextNodeId,
    } : null,
    combat: battle ? {
      phase: battle.phase,
      turn: battle.turn,
      currentActorId: battle.currentActorId,
      selectedSkillId: combatState.selectedSkillId,
      allies: battle.allies.map((unit) => ({
        id: unit.id,
        name: unit.name,
        hp: Math.round(unit.hp),
        maxHp: Math.round(unit.maxHp),
        mp: Math.round(unit.mp),
        maxMp: Math.round(unit.maxMp),
        attack: Math.round(unit.attack),
        defense: Math.round(unit.defense),
        speed: Math.round(unit.speed),
        statusResistances: unit.statusResistances || null,
        effectiveStats: {
          attack: getEffectiveCombatStat(unit, 'attack'),
          defense: getEffectiveCombatStat(unit, 'defense'),
          speed: getEffectiveCombatStat(unit, 'speed'),
        },
        buffs: unit.buffs.map((buff) => ({
          id: buff.id,
          name: buff.name,
          duration: buff.duration,
          statModifier: buff.statModifier || null,
          hotHeal: buff.hotHeal || 0,
        })),
        debuffs: unit.debuffs.map((debuff) => ({
          id: debuff.id,
          name: debuff.name,
          duration: debuff.duration,
          statModifier: debuff.statModifier || null,
          dotDamage: debuff.dotDamage || 0,
          isStun: Boolean(debuff.isStun),
          isFreeze: Boolean(debuff.isFreeze),
        })),
        isAlive: unit.isAlive,
      })),
      enemies: battle.enemies.map((unit) => ({
        id: unit.id,
        name: unit.name,
        hp: Math.round(unit.hp),
        maxHp: Math.round(unit.maxHp),
        attack: Math.round(unit.attack),
        defense: Math.round(unit.defense),
        speed: Math.round(unit.speed),
        statusResistances: unit.statusResistances || null,
        effectiveStats: {
          attack: getEffectiveCombatStat(unit, 'attack'),
          defense: getEffectiveCombatStat(unit, 'defense'),
          speed: getEffectiveCombatStat(unit, 'speed'),
        },
        buffs: unit.buffs.map((buff) => ({
          id: buff.id,
          name: buff.name,
          duration: buff.duration,
          statModifier: buff.statModifier || null,
          hotHeal: buff.hotHeal || 0,
        })),
        debuffs: unit.debuffs.map((debuff) => ({
          id: debuff.id,
          name: debuff.name,
          duration: debuff.duration,
          statModifier: debuff.statModifier || null,
          dotDamage: debuff.dotDamage || 0,
          isStun: Boolean(debuff.isStun),
          isFreeze: Boolean(debuff.isFreeze),
        })),
        isAlive: unit.isAlive,
      })),
      logsTail: battle.logs.slice(-8),
    } : null,
    alchemy: {
      level: alchemyState.alchemyLevel,
      refining: alchemyState.refiningState.isRefining,
      learnedRecipes: alchemyState.learnedRecipes,
      pillCount: alchemyState.pillInventory.length,
    },
    exploration: roguelikeState.currentRun ? {
      realmId: roguelikeState.currentRun.realmId,
      floor: roguelikeState.currentRun.currentFloor,
      currentRoomId: roguelikeState.currentRun.currentRoomId,
      roomsCleared: roguelikeState.currentRun.roomsCleared,
    } : null,
    automation: {
      enabled: window.__WANJIE_AUTOMATION_BOOTSTRAPPED__ === true,
      forceProc: window.__WANJIE_AUTOMATION_FORCE_PROC__ === true,
      encounter: window.__WANJIE_AUTOMATION_ENCOUNTER__ || [],
    },
  }, null, 2);
}

export const AutomationBridge: React.FC = () => {
  const params = useMemo(getAutomationParams, []);

  useEffect(() => {
    if (!params.enabled) {
      return;
    }

    if (params.fresh || !window.__WANJIE_AUTOMATION_BOOTSTRAPPED__) {
      resetAutomationState();
      bootstrapAutomationPlayer(params.origin || 'reincarnation');
      if (params.element) {
        applyAutomationElement(params.element);
      }
      applyAutomationScenario(params.chapter, params.node);
      if (params.boost) {
        applyAutomationBoost(params.encounterIds);
      }
      window.__WANJIE_AUTOMATION_BOOTSTRAPPED__ = true;
    }
  }, [params.boost, params.chapter, params.element, params.enabled, params.encounterIds, params.fresh, params.node, params.origin]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.__WANJIE_AUTOMATION_FORCE_PROC__ = params.enabled && params.forceProc;
    window.__WANJIE_AUTOMATION_ENCOUNTER__ = params.enabled ? params.encounterIds : [];

    return () => {
      delete window.__WANJIE_AUTOMATION_FORCE_PROC__;
      delete window.__WANJIE_AUTOMATION_ENCOUNTER__;
    };
  }, [params.enabled, params.encounterIds, params.forceProc]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.__WANJIE_ORIGINAL_DATE_NOW__) {
      window.__WANJIE_ORIGINAL_DATE_NOW__ = Date.now.bind(Date);
    }
    if (window.__WANJIE_TIME_OFFSET__ === undefined) {
      window.__WANJIE_TIME_OFFSET__ = 0;
    }

    if (params.enabled) {
      Date.now = () => window.__WANJIE_ORIGINAL_DATE_NOW__!() + (window.__WANJIE_TIME_OFFSET__ || 0);
    }

    window.render_game_to_text = buildReadableState;
    window.advanceTime = async (ms: number) => {
      const deltaMs = Math.max(0, Number(ms) || 0);

      if (params.enabled) {
        window.__WANJIE_TIME_OFFSET__ = (window.__WANJIE_TIME_OFFSET__ || 0) + deltaMs;
      }

      const deltaSeconds = deltaMs / 1000;
      const gameStore = useGameStore.getState();
      const playerStore = usePlayerStore.getState();
      const player = playerStore.player;

      if (player && gameStore.phase === 'playing' && !gameStore.isPaused && deltaSeconds > 0) {
        playerStore.addCultivation(calculateCultivationSpeed(player) * deltaSeconds);
        playerStore.addPlayTime(deltaSeconds);
        playerStore.updateLastOnline();
        gameStore.updateLastTickTime();
      }

      const alchemyStore = useAlchemyStore.getState();
      if (
        alchemyStore.refiningState.isRefining &&
        Date.now() >= alchemyStore.refiningState.endTime
      ) {
        alchemyStore.completeRefining();
      }

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
    };

    return () => {
      Date.now = window.__WANJIE_ORIGINAL_DATE_NOW__ || Date.now;
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [params.enabled]);

  return null;
};
