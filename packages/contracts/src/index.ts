export interface AuthUserDTO {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUserDTO;
  revision?: number;
  updatedAt?: string;
}

export interface InventoryItemDTO {
  id: string;
  itemId: string;
  name: string;
  type: string;
  quantity: number;
  stackable: boolean;
  slot?: string;
}

export interface InventoryDTO {
  revision: number;
  updatedAt: string;
  spiritStones: number;
  destinyPoints: number;
  items: InventoryItemDTO[];
}

export interface StoryProgressDTO {
  revision: number;
  updatedAt: string;
  chapterId: string;
  nodeId: string;
  completedChapters: string[];
  flags: Record<string, boolean>;
  contentVersion: string;
}

export interface CombatParticipantDTO {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  buffs: string[];
  debuffs: string[];
  isAlive: boolean;
}

export interface CombatSnapshotDTO {
  revision: number;
  updatedAt: string;
  battleId: string;
  mode: 'pve' | 'pvp' | 'story';
  turn: number;
  contentVersion: string;
  allies: CombatParticipantDTO[];
  enemies: CombatParticipantDTO[];
  logsTail: string[];
}

export interface PlayerStateDTO {
  revision: number;
  updatedAt: string;
  playerId: string;
  name: string;
  realm: string;
  realmStage: string;
  combatPower: number;
  inventory: InventoryDTO;
  story: StoryProgressDTO;
}

export interface MarketListingDTO {
  id: string;
  sellerId: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED';
  updatedAt: string;
}

export interface AdminRecentLoginDTO {
  id: string;
  username: string;
  playerName: string;
  realm: string;
  lastLoginAt: string;
}

export interface AdminDashboardDTO {
  onlineCount: number;
  totalUsers: number;
  todayRegistrations: number;
  todayActiveUsers: number;
  recentLogins: AdminRecentLoginDTO[];
}

export interface ContentVersionDTO {
  id: string;
  version: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ROLLED_BACK';
  notes?: string;
  createdAt: string;
  publishedAt?: string;
}

export interface PublishBatchDTO {
  id: string;
  versionId: string;
  summary: string;
  operatorId: string;
  createdAt: string;
}

export interface SocketEventMap {
  'player.state.updated': PlayerStateDTO;
  'player.inventory.updated': InventoryDTO;
  'story.progress.updated': StoryProgressDTO;
  'combat.snapshot.updated': CombatSnapshotDTO;
  'market.listing.updated': MarketListingDTO;
  'admin.dashboard.updated': AdminDashboardDTO;
  'content.version.published': ContentVersionDTO;
}

