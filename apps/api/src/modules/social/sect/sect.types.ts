import type { SectJoinType, SectRole } from '@prisma/client';

export interface SectInfo {
  id: string;
  name: string;
  description?: string;
  notice?: string;
  iconId: number;
  level: number;
  experience: number;
  fund: number;
  joinType: SectJoinType;
  minRealmToJoin?: string;
  memberCount: number;
  maxMembers: number;
  totalPower: number;
  founderId: string;
  founderName?: string;
  createdAt: Date;
}

export interface SectMemberInfo {
  id: string;
  playerId: string;
  playerName: string;
  playerRealm: string;
  playerRealmStage: string;
  avatarId: number;
  combatPower: number;
  role: SectRole;
  contribution: number;
  isOnline: boolean;
  joinedAt: Date;
}

export interface SectListResponse {
  sects: SectInfo[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SectDetailResponse extends SectInfo {
  members: SectMemberInfo[];
}

export interface SectApplicationInfo {
  id: string;
  playerId: string;
  playerName: string;
  playerRealm: string;
  avatarId: number;
  combatPower: number;
  message?: string;
  createdAt: Date;
}
