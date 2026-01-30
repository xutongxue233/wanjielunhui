import type { RankingType } from '@prisma/client';

export interface RankingEntry {
  rank: number;
  playerId: string;
  playerName: string;
  playerRealm: string;
  playerTitle?: string;
  avatarId: number;
  score: number;
  sectName?: string;
}

export interface RankingListResponse {
  type: RankingType;
  entries: RankingEntry[];
  total: number;
  page: number;
  pageSize: number;
  updatedAt: Date;
}

export interface PlayerRankResponse {
  type: RankingType;
  rank: number | null;
  score: number;
  totalPlayers: number;
}

export interface AroundRankingResponse {
  type: RankingType;
  myRank: number | null;
  myScore: number;
  entries: RankingEntry[];
}

export interface RankingUpdateData {
  playerId: string;
  type: RankingType;
  score: bigint;
  snapshot: RankingSnapshot;
}

export interface RankingSnapshot {
  name: string;
  realm: string;
  realmStage: string;
  title?: string;
  avatarId: number;
  sectName?: string;
  combatPower: number;
}

export const RANKING_CONFIG = {
  CACHE_TTL: 60,
  PAGE_SIZE_DEFAULT: 20,
  PAGE_SIZE_MAX: 100,
  AROUND_COUNT: 5,
  REDIS_KEY_PREFIX: 'ranking',
} as const;

export const RANKING_TYPES: RankingType[] = [
  'COMBAT_POWER',
  'REALM',
  'REINCARNATION',
  'PVP_RATING',
  'WEALTH',
  'SECT',
];
