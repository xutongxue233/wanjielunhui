import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { GamePhase, GameSettings, StoryProgress, RoguelikeState } from '../types';

interface GameState {
  // 游戏阶段
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;

  // 游戏时间
  lastTickTime: number;
  updateLastTickTime: () => void;

  // 暂停状态
  isPaused: boolean;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;

  // 剧情进度
  storyProgress: StoryProgress;
  setCurrentNode: (chapterId: string, nodeId: string) => void;
  completeChapter: (chapterId: string) => void;
  setStoryFlag: (key: string, value: boolean | number | string) => void;
  getStoryFlag: (key: string) => boolean | number | string | undefined;

  // 轮回状态
  roguelikeState: RoguelikeState;
  addDestinyPoints: (amount: number) => void;
  unlockTalent: (talentId: string) => void;
  incrementReincarnation: () => void;

  // 设置
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;

  // 重置
  resetGame: () => void;
}

const initialStoryProgress: StoryProgress = {
  currentChapterId: 'prologue',
  currentNodeId: 'start',
  completedChapters: [],
  flags: {},
};

const initialRoguelikeState: RoguelikeState = {
  reincarnationCount: 0,
  destinyPoints: 0,
  permanentBonuses: [],
  unlockedTalents: [],
  achievements: [],
};

const initialSettings: GameSettings = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  textSpeed: 'normal',
  autoSaveInterval: 60,
};

export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      phase: 'title',
      lastTickTime: Date.now(),
      isPaused: false,
      storyProgress: initialStoryProgress,
      roguelikeState: initialRoguelikeState,
      settings: initialSettings,

      setPhase: (phase) => {
        set((state) => {
          state.phase = phase;
        });
      },

      updateLastTickTime: () => {
        set((state) => {
          state.lastTickTime = Date.now();
        });
      },

      togglePause: () => {
        set((state) => {
          state.isPaused = !state.isPaused;
        });
      },

      setPaused: (paused) => {
        set((state) => {
          state.isPaused = paused;
        });
      },

      setCurrentNode: (chapterId, nodeId) => {
        set((state) => {
          state.storyProgress.currentChapterId = chapterId;
          state.storyProgress.currentNodeId = nodeId;
        });
      },

      completeChapter: (chapterId) => {
        set((state) => {
          if (!state.storyProgress.completedChapters.includes(chapterId)) {
            state.storyProgress.completedChapters.push(chapterId);
          }
        });
      },

      setStoryFlag: (key, value) => {
        set((state) => {
          state.storyProgress.flags[key] = value;
        });
      },

      getStoryFlag: (key) => {
        return get().storyProgress.flags[key];
      },

      addDestinyPoints: (amount) => {
        set((state) => {
          state.roguelikeState.destinyPoints += amount;
        });
      },

      unlockTalent: (talentId) => {
        set((state) => {
          if (!state.roguelikeState.unlockedTalents.includes(talentId)) {
            state.roguelikeState.unlockedTalents.push(talentId);
          }
        });
      },

      incrementReincarnation: () => {
        set((state) => {
          state.roguelikeState.reincarnationCount += 1;
        });
      },

      updateSettings: (newSettings) => {
        set((state) => {
          state.settings = { ...state.settings, ...newSettings };
        });
      },

      resetGame: () => {
        set((state) => {
          state.phase = 'title';
          state.storyProgress = initialStoryProgress;
          state.isPaused = false;
        });
      },
    })),
    {
      name: 'wanjie-game-storage',
    }
  )
);
