import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  Disciple,
  ExpeditionReward,
} from '../data/disciples';
import {
  generateRandomDisciple,
  EXPEDITIONS,
  calculateExpeditionSuccess,
  calculateExpeditionRewards,
} from '../data/disciples';

interface ActiveExpedition {
  expeditionId: string;
  discipleIds: string[];
  startTime: number;
  endTime: number;
}

interface DiscipleStore {
  // 弟子列表
  disciples: Disciple[];
  maxDisciples: number;

  // 招募候选
  recruitCandidates: Disciple[];
  lastRecruitRefresh: number;

  // 活动中的派遣
  activeExpeditions: ActiveExpedition[];

  // 操作
  addDisciple: (disciple: Disciple) => boolean;
  removeDisciple: (discipleId: string) => void;
  recruitDisciple: (candidateId: string) => boolean;
  refreshRecruitCandidates: () => void;

  // 弟子管理
  trainDisciple: (discipleId: string) => void;
  healDisciple: (discipleId: string) => void;
  updateDiscipleMood: (discipleId: string, change: number) => void;
  addDiscipleExp: (discipleId: string, exp: number) => void;

  // 派遣
  startExpedition: (expeditionId: string, discipleIds: string[]) => boolean;
  completeExpedition: (expeditionId: string) => { success: boolean; rewards: ExpeditionReward[] } | null;
  cancelExpedition: (expeditionId: string) => void;

  // 获取
  getIdleDisciples: () => Disciple[];
  getDiscipleById: (id: string) => Disciple | undefined;
}

export const useDiscipleStore = create<DiscipleStore>()(
  persist(
    immer((set, get) => ({
      disciples: [],
      maxDisciples: 10,
      recruitCandidates: [],
      lastRecruitRefresh: 0,
      activeExpeditions: [],

      addDisciple: (disciple) => {
        const { disciples, maxDisciples } = get();
        if (disciples.length >= maxDisciples) return false;

        set((state) => {
          state.disciples.push(disciple);
        });
        return true;
      },

      removeDisciple: (discipleId) => {
        set((state) => {
          state.disciples = state.disciples.filter(d => d.id !== discipleId);
        });
      },

      recruitDisciple: (candidateId) => {
        const { recruitCandidates, disciples, maxDisciples } = get();
        if (disciples.length >= maxDisciples) return false;

        const candidate = recruitCandidates.find(c => c.id === candidateId);
        if (!candidate) return false;

        set((state) => {
          state.disciples.push(candidate);
          state.recruitCandidates = state.recruitCandidates.filter(c => c.id !== candidateId);
        });
        return true;
      },

      refreshRecruitCandidates: () => {
        const candidates: Disciple[] = [];
        const count = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
          candidates.push(generateRandomDisciple(Math.floor(Math.random() * 5) + 1));
        }

        set((state) => {
          state.recruitCandidates = candidates;
          state.lastRecruitRefresh = Date.now();
        });
      },

      trainDisciple: (discipleId) => {
        set((state) => {
          const disciple = state.disciples.find(d => d.id === discipleId);
          if (disciple && disciple.status === 'idle') {
            disciple.status = 'training';
            disciple.currentTask = 'training';
            disciple.taskEndTime = Date.now() + 3600000; // 1小时
          }
        });
      },

      healDisciple: (discipleId) => {
        set((state) => {
          const disciple = state.disciples.find(d => d.id === discipleId);
          if (disciple && disciple.status === 'injured') {
            disciple.status = 'idle';
            disciple.hp = disciple.maxHp;
          }
        });
      },

      updateDiscipleMood: (discipleId, change) => {
        set((state) => {
          const disciple = state.disciples.find(d => d.id === discipleId);
          if (disciple) {
            disciple.mood = Math.max(0, Math.min(100, disciple.mood + change));
          }
        });
      },

      addDiscipleExp: (discipleId, exp) => {
        set((state) => {
          const disciple = state.disciples.find(d => d.id === discipleId);
          if (disciple) {
            disciple.exp += exp;
            while (disciple.exp >= disciple.expToNext) {
              disciple.exp -= disciple.expToNext;
              disciple.level += 1;
              disciple.expToNext = Math.floor(disciple.expToNext * 1.5);

              // 属性提升
              disciple.maxHp += 20;
              disciple.hp = disciple.maxHp;
              disciple.attack += 3;
              disciple.defense += 2;
              disciple.speed += 1;
            }
          }
        });
      },

      startExpedition: (expeditionId, discipleIds) => {
        const { disciples } = get();
        const expedition = EXPEDITIONS[expeditionId];

        if (!expedition) return false;
        if (discipleIds.length < expedition.minDiscipleCount) return false;
        if (discipleIds.length > expedition.maxDiscipleCount) return false;

        // 检查弟子是否可用
        const availableDisciples = disciples.filter(
          d => discipleIds.includes(d.id) && d.status === 'idle'
        );
        if (availableDisciples.length !== discipleIds.length) return false;

        // 检查等级要求
        if (availableDisciples.some(d => d.level < expedition.minLevel)) return false;

        const now = Date.now();
        const activeExp: ActiveExpedition = {
          expeditionId,
          discipleIds,
          startTime: now,
          endTime: now + expedition.duration * 1000,
        };

        set((state) => {
          state.activeExpeditions.push(activeExp);
          discipleIds.forEach(id => {
            const disciple = state.disciples.find(d => d.id === id);
            if (disciple) {
              disciple.status = 'expedition';
              disciple.currentTask = expeditionId;
              disciple.taskEndTime = activeExp.endTime;
            }
          });
        });

        return true;
      },

      completeExpedition: (expeditionId) => {
        const { disciples, activeExpeditions } = get();
        const activeExp = activeExpeditions.find(e => e.expeditionId === expeditionId);

        if (!activeExp) return null;
        if (Date.now() < activeExp.endTime) return null;

        const expedition = EXPEDITIONS[expeditionId];
        const expDisciples = disciples.filter(d => activeExp.discipleIds.includes(d.id));

        const successRate = calculateExpeditionSuccess(expedition, expDisciples);
        const success = Math.random() < successRate;
        const rewards = calculateExpeditionRewards(expedition, expDisciples, success);

        set((state) => {
          // 移除活动派遣
          state.activeExpeditions = state.activeExpeditions.filter(
            e => e.expeditionId !== expeditionId
          );

          // 更新弟子状态
          activeExp.discipleIds.forEach(id => {
            const disciple = state.disciples.find(d => d.id === id);
            if (disciple) {
              // 检查受伤
              if (Math.random() < expedition.injuryChance * (success ? 0.5 : 1)) {
                disciple.status = 'injured';
                disciple.hp = Math.floor(disciple.maxHp * 0.3);
              } else {
                disciple.status = 'idle';
              }
              disciple.currentTask = null;
              disciple.taskEndTime = 0;

              // 心情变化
              disciple.mood += success ? 10 : -15;
              disciple.mood = Math.max(0, Math.min(100, disciple.mood));

              // 忠诚度变化
              if (success) {
                disciple.loyalty = Math.min(100, disciple.loyalty + 2);
              }
            }
          });
        });

        // 分配经验
        const expReward = rewards.find(r => r.type === 'exp');
        if (expReward) {
          activeExp.discipleIds.forEach(id => {
            get().addDiscipleExp(id, Math.floor(expReward.quantity / activeExp.discipleIds.length));
          });
        }

        return { success, rewards };
      },

      cancelExpedition: (expeditionId) => {
        set((state) => {
          const activeExp = state.activeExpeditions.find(e => e.expeditionId === expeditionId);
          if (activeExp) {
            state.activeExpeditions = state.activeExpeditions.filter(
              e => e.expeditionId !== expeditionId
            );

            activeExp.discipleIds.forEach(id => {
              const disciple = state.disciples.find(d => d.id === id);
              if (disciple) {
                disciple.status = 'idle';
                disciple.currentTask = null;
                disciple.taskEndTime = 0;
                disciple.mood -= 10;
              }
            });
          }
        });
      },

      getIdleDisciples: () => {
        return get().disciples.filter(d => d.status === 'idle');
      },

      getDiscipleById: (id) => {
        return get().disciples.find(d => d.id === id);
      },
    })),
    {
      name: 'wanjie-disciple-storage',
    }
  )
);
