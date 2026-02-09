import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';
import { useAlchemyStore } from '../stores/alchemyStore';
import { useDiscipleStore } from '../stores/discipleStore';
import { saveApi, type SaveSlot, type SaveData } from './api';

// 获取所有store的状态用于存档
function getStoreStates() {
  const playerState = usePlayerStore.getState();
  const gameState = useGameStore.getState();
  const alchemyState = useAlchemyStore.getState();
  const discipleState = useDiscipleStore.getState();

  return {
    playerData: {
      player: playerState.player,
    },
    gameData: {
      phase: gameState.phase,
      storyProgress: gameState.storyProgress,
      storyHistory: gameState.storyHistory,
      settings: gameState.settings,
    },
    alchemyData: {
      alchemyLevel: alchemyState.alchemyLevel,
      alchemyExp: alchemyState.alchemyExp,
      alchemyExpToNext: alchemyState.alchemyExpToNext,
      currentFurnace: alchemyState.currentFurnace,
      learnedRecipes: alchemyState.learnedRecipes,
      refiningState: alchemyState.refiningState,
      pillInventory: alchemyState.pillInventory,
    },
    discipleData: {
      disciples: discipleState.disciples,
      maxDisciples: discipleState.maxDisciples,
      activeExpeditions: discipleState.activeExpeditions,
    },
    roguelikeData: {
      roguelikeState: gameState.roguelikeState,
    },
  };
}

// 恢复store状态从存档
function restoreStoreStates(saveData: SaveData) {
  const gameStore = useGameStore.getState();

  // 恢复玩家数据
  const playerData = saveData.playerData as { player: unknown };
  if (playerData?.player) {
    usePlayerStore.setState({ player: playerData.player as never });
  }

  // 恢复游戏数据
  const gameData = saveData.gameData as {
    phase?: string;
    storyProgress?: unknown;
    storyHistory?: unknown[];
    settings?: unknown;
  };

  if (gameData) {
    if (gameData.phase) gameStore.setPhase(gameData.phase as never);
    if (gameData.storyProgress) {
      useGameStore.setState({ storyProgress: gameData.storyProgress as never });
    }
    if (gameData.storyHistory) {
      useGameStore.setState({ storyHistory: gameData.storyHistory as never });
    }
    if (gameData.settings) {
      useGameStore.setState({ settings: gameData.settings as never });
    }
  }

  // 恢复炼丹数据
  const alchemyData = saveData.alchemyData as {
    alchemyLevel?: number;
    alchemyExp?: number;
    alchemyExpToNext?: number;
    currentFurnace?: unknown;
    learnedRecipes?: string[];
    refiningState?: unknown;
    pillInventory?: unknown[];
  };

  if (alchemyData && Object.keys(alchemyData).length > 0) {
    const alchemyUpdate: Record<string, unknown> = {};
    if (alchemyData.alchemyLevel !== undefined) alchemyUpdate.alchemyLevel = alchemyData.alchemyLevel;
    if (alchemyData.alchemyExp !== undefined) alchemyUpdate.alchemyExp = alchemyData.alchemyExp;
    if (alchemyData.alchemyExpToNext !== undefined) alchemyUpdate.alchemyExpToNext = alchemyData.alchemyExpToNext;
    if (alchemyData.currentFurnace) alchemyUpdate.currentFurnace = alchemyData.currentFurnace;
    if (alchemyData.learnedRecipes) alchemyUpdate.learnedRecipes = alchemyData.learnedRecipes;
    if (alchemyData.refiningState) alchemyUpdate.refiningState = alchemyData.refiningState;
    if (alchemyData.pillInventory) alchemyUpdate.pillInventory = alchemyData.pillInventory;
    if (Object.keys(alchemyUpdate).length > 0) {
      useAlchemyStore.setState(alchemyUpdate as never);
    }
  }

  // 恢复弟子数据
  const discipleData = saveData.discipleData as {
    disciples?: unknown[];
    maxDisciples?: number;
    activeExpeditions?: unknown[];
  };

  if (discipleData && Object.keys(discipleData).length > 0) {
    const discipleUpdate: Record<string, unknown> = {};
    if (discipleData.disciples) discipleUpdate.disciples = discipleData.disciples;
    if (discipleData.maxDisciples !== undefined) discipleUpdate.maxDisciples = discipleData.maxDisciples;
    if (discipleData.activeExpeditions) discipleUpdate.activeExpeditions = discipleData.activeExpeditions;
    if (Object.keys(discipleUpdate).length > 0) {
      useDiscipleStore.setState(discipleUpdate as never);
    }
  }

  // 恢复轮回数据
  const roguelikeData = saveData.roguelikeData as { roguelikeState?: unknown };
  if (roguelikeData?.roguelikeState) {
    useGameStore.setState({ roguelikeState: roguelikeData.roguelikeState as never });
  }
}

class SaveSyncService {
  private autoSaveInterval: number | null = null;
  private isSaving = false;

  // 获取云存档列表
  async getCloudSaves(): Promise<SaveSlot[]> {
    try {
      return await saveApi.list();
    } catch (error) {
      console.error('Failed to get cloud saves:', error);
      return [];
    }
  }

  // 加载云存档
  async loadCloudSave(slot: number): Promise<boolean> {
    try {
      const saveData = await saveApi.get(slot);
      restoreStoreStates(saveData);
      return true;
    } catch (error) {
      console.error('Failed to load cloud save:', error);
      return false;
    }
  }

  // 保存到云端
  async saveToCloud(slot: number, name?: string): Promise<boolean> {
    if (this.isSaving) return false;

    this.isSaving = true;
    try {
      const player = usePlayerStore.getState().player;
      const states = getStoreStates();

      await saveApi.save(slot, {
        name: name || player?.name || '未命名存档',
        playerData: states.playerData,
        gameData: states.gameData,
        alchemyData: states.alchemyData,
        discipleData: states.discipleData,
        roguelikeData: states.roguelikeData,
        playTime: Math.floor(player?.totalPlayTime || 0),
        checkpoint: `${player?.realm?.displayName || '炼气'} - ${player?.realm?.stage || '初期'}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    } finally {
      this.isSaving = false;
    }
  }

  // 删除云存档
  async deleteCloudSave(slot: number): Promise<boolean> {
    try {
      await saveApi.delete(slot);
      return true;
    } catch (error) {
      console.error('Failed to delete cloud save:', error);
      return false;
    }
  }

  // 启动自动保存
  startAutoSave(intervalSeconds = 60, slot = 1) {
    this.stopAutoSave();

    this.autoSaveInterval = window.setInterval(() => {
      const player = usePlayerStore.getState().player;
      if (player) {
        this.saveToCloud(slot);
      }
    }, intervalSeconds * 1000);
  }

  // 停止自动保存
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // 获取本地存档
  getLocalSave() {
    const playerData = localStorage.getItem('wanjie-player-storage');
    const gameData = localStorage.getItem('wanjie-game-storage');
    const alchemyData = localStorage.getItem('wanjie-alchemy-storage');
    const discipleData = localStorage.getItem('wanjie-disciple-storage');

    if (!playerData && !gameData) return null;

    return {
      playerData: playerData ? JSON.parse(playerData) : null,
      gameData: gameData ? JSON.parse(gameData) : null,
      alchemyData: alchemyData ? JSON.parse(alchemyData) : null,
      discipleData: discipleData ? JSON.parse(discipleData) : null,
    };
  }

  // 检测是否有本地存档
  hasLocalSave(): boolean {
    const local = this.getLocalSave();
    return !!(local?.playerData?.state?.player);
  }

  // 清除本地存档
  clearLocalSave() {
    localStorage.removeItem('wanjie-player-storage');
    localStorage.removeItem('wanjie-game-storage');
  }

  // 上传本地存档到云端
  async uploadLocalToCloud(slot: number): Promise<boolean> {
    const local = this.getLocalSave();
    if (!local) return false;

    try {
      const playerState = local.playerData?.state;
      const gameState = local.gameData?.state;
      const alchemyState = local.alchemyData?.state;
      const discipleState = local.discipleData?.state;

      await saveApi.save(slot, {
        name: playerState?.player?.name || '本地存档',
        playerData: { player: playerState?.player },
        gameData: {
          phase: gameState?.phase,
          storyProgress: gameState?.storyProgress,
          storyHistory: gameState?.storyHistory,
          settings: gameState?.settings,
        },
        alchemyData: alchemyState ? {
          alchemyLevel: alchemyState.alchemyLevel,
          alchemyExp: alchemyState.alchemyExp,
          alchemyExpToNext: alchemyState.alchemyExpToNext,
          currentFurnace: alchemyState.currentFurnace,
          learnedRecipes: alchemyState.learnedRecipes,
          refiningState: alchemyState.refiningState,
          pillInventory: alchemyState.pillInventory,
        } : {},
        discipleData: discipleState ? {
          disciples: discipleState.disciples,
          maxDisciples: discipleState.maxDisciples,
          activeExpeditions: discipleState.activeExpeditions,
        } : {},
        roguelikeData: {
          roguelikeState: gameState?.roguelikeState,
        },
        playTime: Math.floor(playerState?.player?.totalPlayTime || 0),
        checkpoint: `${playerState?.player?.realm?.displayName || '炼气'}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to upload local save:', error);
      return false;
    }
  }
}

export const saveSyncService = new SaveSyncService();
