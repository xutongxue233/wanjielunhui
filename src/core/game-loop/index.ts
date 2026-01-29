import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { getSpiritualRootBonus } from '../../data/origins';

// 游戏主循环配置
const TICK_INTERVAL = 1000; // 1秒一次
const MAX_OFFLINE_HOURS = 48;
const OFFLINE_EFFICIENCY = {
  0: 1.0,      // 0-2小时: 100%
  2: 0.8,      // 2-8小时: 80%
  8: 0.5,      // 8-24小时: 50%
  24: 0.3,     // 24小时+: 30%
};

// 计算修炼速度
export function calculateCultivationSpeed(player: ReturnType<typeof usePlayerStore.getState>['player']): number {
  if (!player) return 0;

  const { attributes, spiritualRoot, techniques, activeTechniqueId } = player;

  // 基础速度
  let speed = attributes.cultivationSpeed;

  // 灵根加成
  const rootBonus = getSpiritualRootBonus(spiritualRoot);
  speed *= (1 + rootBonus);

  // 悟性加成
  const comprehensionBonus = attributes.comprehension / 100;
  speed *= (1 + comprehensionBonus);

  // 功法加成
  if (activeTechniqueId) {
    const technique = techniques.find(t => t.id === activeTechniqueId);
    if (technique) {
      speed *= (1 + technique.cultivationBonus);
    }
  }

  return speed;
}

// 计算离线收益
export function calculateOfflineRewards(
  offlineSeconds: number,
  cultivationSpeed: number
): { cultivation: number; events: string[] } {
  const offlineHours = Math.min(offlineSeconds / 3600, MAX_OFFLINE_HOURS);

  let totalEfficiency = 0;
  let remainingHours = offlineHours;

  // 分段计算效率
  if (remainingHours > 0) {
    const hours = Math.min(remainingHours, 2);
    totalEfficiency += hours * OFFLINE_EFFICIENCY[0];
    remainingHours -= hours;
  }
  if (remainingHours > 0) {
    const hours = Math.min(remainingHours, 6);
    totalEfficiency += hours * OFFLINE_EFFICIENCY[2];
    remainingHours -= hours;
  }
  if (remainingHours > 0) {
    const hours = Math.min(remainingHours, 16);
    totalEfficiency += hours * OFFLINE_EFFICIENCY[8];
    remainingHours -= hours;
  }
  if (remainingHours > 0) {
    totalEfficiency += remainingHours * OFFLINE_EFFICIENCY[24];
  }

  const cultivation = Math.floor(cultivationSpeed * totalEfficiency * 3600);

  // 随机事件（简化版）
  const events: string[] = [];
  const eventChance = offlineHours * 0.05;
  if (Math.random() < eventChance) {
    events.push('你在修炼中感悟到了一丝天地法则。');
  }

  return { cultivation, events };
}

// 游戏主循环 Hook
export function useGameLoop() {
  const player = usePlayerStore((state) => state.player);
  const addCultivation = usePlayerStore((state) => state.addCultivation);
  const updateLastOnline = usePlayerStore((state) => state.updateLastOnline);
  const addPlayTime = usePlayerStore((state) => state.addPlayTime);

  const isPaused = useGameStore((state) => state.isPaused);
  const phase = useGameStore((state) => state.phase);
  const updateLastTickTime = useGameStore((state) => state.updateLastTickTime);

  const lastTickRef = useRef(Date.now());

  // 处理离线收益
  const processOfflineRewards = useCallback(() => {
    if (!player) return null;

    const now = Date.now();
    const offlineSeconds = (now - player.lastOnlineAt) / 1000;

    if (offlineSeconds > 60) { // 超过1分钟才计算离线收益
      const speed = calculateCultivationSpeed(player);
      const rewards = calculateOfflineRewards(offlineSeconds, speed);

      addCultivation(rewards.cultivation);
      updateLastOnline();

      return {
        offlineTime: offlineSeconds,
        cultivation: rewards.cultivation,
        events: rewards.events,
      };
    }

    return null;
  }, [player, addCultivation, updateLastOnline]);

  // 主循环 tick
  const tick = useCallback(() => {
    if (!player || isPaused || phase !== 'playing') return;

    const now = Date.now();
    const deltaTime = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    // 计算修炼获得的修为
    const speed = calculateCultivationSpeed(player);
    const cultivationGain = speed * deltaTime;

    addCultivation(cultivationGain);
    addPlayTime(deltaTime);
    updateLastTickTime();
  }, [player, isPaused, phase, addCultivation, addPlayTime, updateLastTickTime]);

  // 启动游戏循环
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(tick, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [tick, phase]);

  return {
    processOfflineRewards,
    calculateCultivationSpeed: () => player ? calculateCultivationSpeed(player) : 0,
  };
}

// 格式化时间
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}秒`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}天${hours}小时`;
  }
}

// 格式化大数字
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(0);
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + '千';
  } else if (num < 100000000) {
    return (num / 10000).toFixed(1) + '万';
  } else {
    return (num / 100000000).toFixed(2) + '亿';
  }
}
