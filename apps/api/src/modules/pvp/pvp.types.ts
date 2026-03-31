import type { PvpResult } from '@prisma/client';

export interface PvpPlayerInfo {
  playerId: string;
  playerName: string;
  realm: string;
  avatarId: number;
  combatPower: number;
  pvpRating: number;
}

export interface PvpMatchInfo {
  id: string;
  player: PvpPlayerInfo;
  opponent: PvpPlayerInfo;
  result: PvpResult;
  playerRatingChange: number;
  opponentRatingChange: number;
  duration: number;
  seasonId: number;
  createdAt: Date;
}

export interface PvpMatchResult {
  matchId: string;
  winnerId: string | null;
  result: PvpResult;
  playerRatingChange: number;
  opponentRatingChange: number;
  rewards?: PvpReward[];
}

export interface PvpReward {
  type: string;
  itemId?: string;
  amount: number;
}

export interface PvpSeasonInfo {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  rewards: Record<string, unknown>;
}

export interface MatchPoolEntry {
  playerId: string;
  rating: number;
  joinedAt: number;
}

export const PVP_CONFIG = {
  MATCH_TIMEOUT_MS: 30000,
  RATING_RANGE_INITIAL: 100,
  RATING_RANGE_INCREMENT: 50,
  RATING_RANGE_MAX: 500,
  TURN_TIMEOUT_MS: 30000,
  BASE_RATING_CHANGE: 25,
  K_FACTOR: 32,
} as const;
