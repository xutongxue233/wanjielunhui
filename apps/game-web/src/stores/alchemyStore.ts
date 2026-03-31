import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Pill,
  Furnace,
  AlchemyState,
} from '../data/alchemy';
import {
  PILL_RECIPES,
  FURNACES,
  calculateSuccessRate,
  calculatePillQuality,
  QUALITY_MULTIPLIERS,
} from '../data/alchemy';
import { usePlayerStore } from './playerStore';

interface AlchemyStore {
  // 炼丹状态
  alchemyLevel: number;
  alchemyExp: number;
  alchemyExpToNext: number;

  // 当前丹炉
  currentFurnace: Furnace;

  // 已学配方
  learnedRecipes: string[];

  // 炼制状态
  refiningState: AlchemyState;

  // 丹药库存
  pillInventory: Pill[];

  // 操作
  startRefining: (recipeId: string, comprehension: number, luck: number) => boolean;
  completeRefining: () => Pill | null;
  cancelRefining: () => void;

  learnRecipe: (recipeId: string) => void;
  upgradeFurnace: (furnaceId: string) => void;

  addAlchemyExp: (exp: number) => void;
  usePill: (pillId: string) => Pill | null;
}

function calculateExpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export const useAlchemyStore = create<AlchemyStore>()(
  persist(
    immer((set, get) => ({
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

      startRefining: (recipeId, _comprehension, _luck) => {
        const { alchemyLevel, currentFurnace, learnedRecipes, refiningState } = get();

        if (refiningState.isRefining) return false;
        if (!learnedRecipes.includes(recipeId)) return false;

        const recipe = PILL_RECIPES[recipeId];
        if (!recipe) return false;

        if (alchemyLevel < recipe.requiredLevel) return false;
        if (currentFurnace.grade < recipe.requiredFurnaceGrade) return false;

        // 检查背包中是否有足够的材料
        const playerState = usePlayerStore.getState();
        const inventory = playerState.player?.inventory || [];
        for (const mat of recipe.materials) {
          const owned = inventory.find(i => i.item.id === mat.itemId);
          if (!owned || owned.quantity < mat.quantity) {
            return false;
          }
        }

        // 扣除材料
        for (const mat of recipe.materials) {
          playerState.removeItem(mat.itemId, mat.quantity);
        }

        const duration = recipe.baseDuration * (1 - currentFurnace.speedBonus);
        const now = Date.now();

        set((state) => {
          state.refiningState = {
            isRefining: true,
            currentRecipeId: recipeId,
            progress: 0,
            startTime: now,
            endTime: now + duration * 1000,
          };
        });

        return true;
      },

      completeRefining: () => {
        const { refiningState, currentFurnace, alchemyLevel } = get();

        if (!refiningState.isRefining || !refiningState.currentRecipeId) return null;

        const recipe = PILL_RECIPES[refiningState.currentRecipeId];
        if (!recipe) return null;

        const successRate = calculateSuccessRate(recipe, currentFurnace, alchemyLevel, 10);
        const isSuccess = Math.random() < successRate;

        set((state) => {
          state.refiningState = {
            isRefining: false,
            currentRecipeId: null,
            progress: 0,
            startTime: 0,
            endTime: 0,
          };

          // 消耗丹炉耐久
          state.currentFurnace.durability -= 1;
        });

        if (!isSuccess) {
          get().addAlchemyExp(Math.floor(recipe.baseDuration / 10));
          return null;
        }

        const quality = calculatePillQuality(recipe, currentFurnace, alchemyLevel, 10);
        const qualityMultiplier = QUALITY_MULTIPLIERS[quality];

        const pill: Pill = {
          id: uuidv4(),
          recipeId: recipe.id,
          name: recipe.name,
          quality,
          effects: recipe.effects.map(e => ({
            ...e,
            value: Math.floor(e.value * qualityMultiplier),
          })),
          qualityMultiplier,
        };

        set((state) => {
          state.pillInventory.push(pill);
        });

        get().addAlchemyExp(Math.floor(recipe.baseDuration / 5) * (1 + qualityMultiplier));

        return pill;
      },

      cancelRefining: () => {
        set((state) => {
          state.refiningState = {
            isRefining: false,
            currentRecipeId: null,
            progress: 0,
            startTime: 0,
            endTime: 0,
          };
        });
      },

      learnRecipe: (recipeId) => {
        set((state) => {
          if (!state.learnedRecipes.includes(recipeId)) {
            state.learnedRecipes.push(recipeId);
          }
        });
      },

      upgradeFurnace: (furnaceId) => {
        const furnace = FURNACES[furnaceId];
        if (furnace) {
          set((state) => {
            state.currentFurnace = { ...furnace };
          });
        }
      },

      addAlchemyExp: (exp) => {
        set((state) => {
          state.alchemyExp += exp;

          while (state.alchemyExp >= state.alchemyExpToNext) {
            state.alchemyExp -= state.alchemyExpToNext;
            state.alchemyLevel += 1;
            state.alchemyExpToNext = calculateExpToNext(state.alchemyLevel);
          }
        });
      },

      usePill: (pillId) => {
        const { pillInventory } = get();
        const pillIndex = pillInventory.findIndex(p => p.id === pillId);

        if (pillIndex === -1) return null;

        const pill = pillInventory[pillIndex];

        set((state) => {
          state.pillInventory.splice(pillIndex, 1);
        });

        return pill;
      },
    })),
    {
      name: 'wanjie-alchemy-storage',
    }
  )
);
