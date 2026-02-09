import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { GamePhase, GameSettings, StoryProgress, RoguelikeState } from '../types';
import { STORY_CHAPTERS, checkChapterUnlock } from '../data/stories';
import type { ChapterReward } from '../data/stories';
import { usePlayerStore } from './playerStore';
import { getItemById } from '../data/items';

interface StoryEntry {
  id: string;
  content: string;
  isChoice?: boolean;
  choiceText?: string;
}

interface StoryDisplayState {
  displayedText: string;
  isCompleted: boolean;
}

// 章节完成回调类型
type ChapterCompleteCallback = (rewards: ChapterReward[]) => void;

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
  resetStoryProgress: () => void;

  // 章节管理
  startChapter: (chapterId: string) => void;
  getUnlockedChapters: (realmLevel: number) => string[];
  canStartChapter: (chapterId: string, realmLevel: number) => boolean;
  getChapterRewards: (chapterId: string) => ChapterReward[];

  // 剧情历史记录
  storyHistory: StoryEntry[];
  addStoryEntry: (entry: StoryEntry) => void;
  clearStoryHistory: () => void;

  // 剧情显示状态
  storyDisplayState: StoryDisplayState;
  setStoryDisplayState: (state: Partial<StoryDisplayState>) => void;

  // 章节完成回调
  chapterCompleteCallback: ChapterCompleteCallback | null;
  setChapterCompleteCallback: (callback: ChapterCompleteCallback | null) => void;

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

const initialStoryDisplayState: StoryDisplayState = {
  displayedText: '',
  isCompleted: false,
};

export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      phase: 'title',
      lastTickTime: Date.now(),
      isPaused: false,
      storyProgress: initialStoryProgress,
      storyHistory: [],
      storyDisplayState: initialStoryDisplayState,
      roguelikeState: initialRoguelikeState,
      settings: initialSettings,
      chapterCompleteCallback: null,

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
          // 清除显示状态，准备新节点
          state.storyDisplayState = { displayedText: '', isCompleted: false };
        });
      },

      completeChapter: (chapterId) => {
        const chapter = STORY_CHAPTERS.find(ch => ch.id === chapterId);
        set((state) => {
          if (!state.storyProgress.completedChapters.includes(chapterId)) {
            state.storyProgress.completedChapters.push(chapterId);
          }
        });

        // 发放章节奖励
        if (chapter && chapter.rewards.length > 0) {
          const playerStore = usePlayerStore.getState();
          for (const reward of chapter.rewards) {
            switch (reward.type) {
              case 'item': {
                const itemDef = getItemById(reward.target);
                if (itemDef) {
                  playerStore.addItem({
                    item: {
                      id: itemDef.id,
                      name: itemDef.name,
                      description: itemDef.description,
                      type: itemDef.type,
                      quality: itemDef.quality,
                      stackable: itemDef.stackable,
                      maxStack: itemDef.maxStack,
                      effects: itemDef.effects,
                    },
                    quantity: reward.value,
                  });
                }
                break;
              }
              case 'cultivation':
                playerStore.addCultivation(reward.value);
                break;
              case 'attribute':
                playerStore.modifyAttribute(reward.target as any, reward.value);
                break;
            }
          }
        }

        // 触发章节完成回调
        const callback = get().chapterCompleteCallback;
        if (callback && chapter) {
          callback(chapter.rewards);
        }
      },

      setStoryFlag: (key, value) => {
        set((state) => {
          state.storyProgress.flags[key] = value;
        });
      },

      getStoryFlag: (key) => {
        return get().storyProgress.flags[key];
      },

      resetStoryProgress: () => {
        set((state) => {
          state.storyProgress = { ...initialStoryProgress, flags: {} };
          state.storyHistory = [];
          state.storyDisplayState = initialStoryDisplayState;
        });
      },

      // 章节管理方法
      startChapter: (chapterId) => {
        const chapter = STORY_CHAPTERS.find(ch => ch.id === chapterId);
        if (chapter) {
          set((state) => {
            state.storyProgress.currentChapterId = chapterId;
            state.storyProgress.currentNodeId = chapter.startNodeId;
            state.storyHistory = [];
            state.storyDisplayState = { displayedText: '', isCompleted: false };
          });
        }
      },

      getUnlockedChapters: (realmLevel) => {
        const flags = get().storyProgress.flags;
        return STORY_CHAPTERS
          .filter(chapter => checkChapterUnlock(chapter, flags, realmLevel))
          .map(ch => ch.id);
      },

      canStartChapter: (chapterId, realmLevel) => {
        const flags = get().storyProgress.flags;
        const chapter = STORY_CHAPTERS.find(ch => ch.id === chapterId);
        if (!chapter) return false;
        return checkChapterUnlock(chapter, flags, realmLevel);
      },

      getChapterRewards: (chapterId) => {
        const chapter = STORY_CHAPTERS.find(ch => ch.id === chapterId);
        return chapter?.rewards || [];
      },

      addStoryEntry: (entry) => {
        set((state) => {
          state.storyHistory.push(entry);
        });
      },

      clearStoryHistory: () => {
        set((state) => {
          state.storyHistory = [];
        });
      },

      setStoryDisplayState: (newState) => {
        set((state) => {
          state.storyDisplayState = { ...state.storyDisplayState, ...newState };
        });
      },

      setChapterCompleteCallback: (callback) => {
        set((state) => {
          // 注意：回调函数不会被持久化
          state.chapterCompleteCallback = callback as any;
        });
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
          state.storyHistory = [];
          state.storyDisplayState = initialStoryDisplayState;
          state.isPaused = false;
        });
      },
    })),
    {
      name: 'wanjie-game-storage',
      partialize: (state) => ({
        // 只持久化需要保存的状态，排除回调函数
        phase: state.phase,
        lastTickTime: state.lastTickTime,
        isPaused: state.isPaused,
        storyProgress: state.storyProgress,
        storyHistory: state.storyHistory,
        storyDisplayState: state.storyDisplayState,
        roguelikeState: state.roguelikeState,
        settings: state.settings,
      }),
    }
  )
);
