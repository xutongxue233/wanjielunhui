const API_BASE = '/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || '请求失败');
  }

  return data.data;
}

export const authApi = {
  login: (account: string, password: string) =>
    request<{ accessToken: string; refreshToken: string; user: { id: string; username: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ account, password }) }
    ),
};

export const dashboardApi = {
  getStats: () =>
    request<DashboardStats>('/admin/dashboard/stats'),
  getSystemStatus: () =>
    request<SystemStatus>('/admin/dashboard/system'),
};

export const userApi = {
  getList: (page = 1, pageSize = 20, search?: string) =>
    request<UserListResponse>(`/admin/users?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  ban: (id: string) =>
    request<void>(`/admin/users/${id}/ban`, { method: 'POST' }),
  unban: (id: string) =>
    request<void>(`/admin/users/${id}/unban`, { method: 'POST' }),
};

export const announcementApi = {
  getAll: (page = 1, pageSize = 20) =>
    request<{ announcements: Announcement[]; total: number }>(`/admin/announcements?page=${page}&pageSize=${pageSize}`),
  create: (data: CreateAnnouncementInput) =>
    request<Announcement>('/admin/announcements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateAnnouncementInput>) =>
    request<Announcement>(`/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/admin/announcements/${id}`, { method: 'DELETE' }),
};

export const activityApi = {
  getAll: (page = 1, pageSize = 20) =>
    request<{ activities: Activity[]; total: number }>(`/admin/activities?page=${page}&pageSize=${pageSize}`),
  create: (data: CreateActivityInput) =>
    request<Activity>('/admin/activities', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateActivityInput>) =>
    request<Activity>(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/admin/activities/${id}`, { method: 'DELETE' }),
};

export interface DashboardStats {
  onlineCount: number;
  totalUsers: number;
  todayRegistrations: number;
  todayActiveUsers: number;
  recentLogins: RecentLogin[];
}

export interface RecentLogin {
  id: string;
  username: string;
  playerName: string;
  realm: string;
  lastLoginAt: string;
}

export interface SystemStatus {
  uptime: number;
  uptimeFormatted: string;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    percentage: number;
  };
  version: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  player?: {
    name: string;
    realm: string;
    realmStage: string;
    combatPower: bigint;
  };
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  isActive: boolean;
  startAt: string;
  endAt?: string;
  createdAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  type?: string;
  priority?: number;
  startAt?: string;
  endAt?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
}

export interface CreateActivityInput {
  name: string;
  description: string;
  type: string;
  config: Record<string, unknown>;
  startAt: string;
  endAt: string;
}

export interface GameSave {
  id: string;
  slot: number;
  name: string;
  playTime: number;
  version: number;
  checkpoint: string | null;
  createdAt: string;
  updatedAt: string;
  player: {
    name: string;
    realm: string;
    realmStage: string;
    username: string;
  };
}

export interface GameSaveDetail extends GameSave {
  playerData: string;
  gameData: string;
  alchemyData: string;
  discipleData: string;
  roguelikeData: string;
  checksum: string;
}

export interface SaveStats {
  totalSaves: number;
  recentSaves: number;
  avgPlayTime: number;
}

export const saveApi = {
  getList: (page = 1, pageSize = 20, search?: string) =>
    request<{ saves: GameSave[]; total: number; page: number; pageSize: number }>(
      `/admin/saves?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    ),
  getById: (id: string) =>
    request<GameSaveDetail>(`/admin/saves/${id}`),
  delete: (id: string) =>
    request<void>(`/admin/saves/${id}`, { method: 'DELETE' }),
  getStats: () =>
    request<SaveStats>('/admin/saves/stats'),
};

// 排行榜API
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

export const rankingApi = {
  getList: (type: string, page = 1, pageSize = 50) =>
    request<{ entries: RankingEntry[]; total: number; type: string }>(`/admin/ranking/${type}?page=${page}&pageSize=${pageSize}`),
  syncAll: () =>
    request<{ synced: number }>('/admin/ranking/sync', { method: 'POST' }),
  rebuild: (type: string) =>
    request<void>(`/admin/ranking/${type}/rebuild`, { method: 'POST' }),
};

// 好友API
export interface FriendRelation {
  id: string;
  playerId: string;
  playerName: string;
  playerRealm: string;
  friendId: string;
  friendName: string;
  friendRealm: string;
  intimacy: number;
  createdAt: string;
}

export const friendApi = {
  getList: (page = 1, pageSize = 20, search?: string) =>
    request<{ relations: FriendRelation[]; total: number }>(`/admin/friends?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  delete: (id: string) =>
    request<void>(`/admin/friends/${id}`, { method: 'DELETE' }),
  getStats: () =>
    request<{ totalRelations: number; avgFriends: number }>('/admin/friends/stats'),
};

// 门派API
export interface SectInfo {
  id: string;
  name: string;
  description?: string;
  notice?: string;
  iconId: number;
  level: number;
  memberCount: number;
  maxMembers: number;
  totalPower: number;
  joinType: string;
  founderId: string;
  createdAt: string;
}

export interface SectMemberInfo {
  id: string;
  playerId: string;
  playerName: string;
  playerRealm: string;
  role: string;
  combatPower: number;
  contribution: number;
  joinedAt: string;
}

export const sectApi = {
  getList: (page = 1, pageSize = 20, search?: string) =>
    request<{ sects: SectInfo[]; total: number }>(`/admin/sects?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  getMembers: (sectId: string) =>
    request<{ members: SectMemberInfo[] }>(`/admin/sects/${sectId}/members`),
  disband: (sectId: string) =>
    request<void>(`/admin/sects/${sectId}`, { method: 'DELETE' }),
  kickMember: (sectId: string, playerId: string) =>
    request<void>(`/admin/sects/${sectId}/members/${playerId}`, { method: 'DELETE' }),
  getStats: () =>
    request<{ totalSects: number; totalMembers: number; avgMembers: number }>('/admin/sects/stats'),
};

// 聊天API
export interface ChatMessage {
  id: string;
  channel: string;
  senderId: string;
  senderName: string;
  senderRealm: string;
  content: string;
  createdAt: string;
}

export const chatApi = {
  getList: (channel: string, page = 1, pageSize = 50) =>
    request<{ messages: ChatMessage[]; total: number }>(`/admin/chat?channel=${channel}&page=${page}&pageSize=${pageSize}`),
  delete: (id: string) =>
    request<void>(`/admin/chat/${id}`, { method: 'DELETE' }),
  clearChannel: (channel: string) =>
    request<void>(`/admin/chat/channel/${channel}`, { method: 'DELETE' }),
  getStats: () =>
    request<{ totalMessages: number; todayMessages: number }>('/admin/chat/stats'),
};

// 交易市场API
export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  itemType: string;
  itemId: string;
  amount: number;
  price: number;
  currency: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface TradeLog {
  id: string;
  sellerId?: string;
  sellerName?: string;
  buyerId: string;
  buyerName: string;
  itemType: string;
  itemId: string;
  amount: number;
  price: number;
  currency: string;
  fee: number;
  createdAt: string;
}

export const marketApi = {
  getListings: (page = 1, pageSize = 20) =>
    request<{ listings: MarketListing[]; total: number }>(`/admin/market/listings?page=${page}&pageSize=${pageSize}`),
  getTrades: (page = 1, pageSize = 20) =>
    request<{ trades: TradeLog[]; total: number }>(`/admin/market/trades?page=${page}&pageSize=${pageSize}`),
  cancelListing: (id: string) =>
    request<void>(`/admin/market/listings/${id}`, { method: 'DELETE' }),
  getStats: () =>
    request<{ activeListings: number; totalTrades: number; todayVolume: number; totalFees: number }>('/admin/market/stats'),
};

// PVP API
export interface PvpMatch {
  id: string;
  playerId: string;
  playerName: string;
  opponentId: string;
  opponentName: string;
  result: string;
  playerRatingChange: number;
  opponentRatingChange: number;
  duration: number;
  seasonId: number;
  createdAt: string;
}

export interface PvpSeason {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  rewards: Record<string, unknown>;
}

export const pvpApi = {
  getMatches: (page = 1, pageSize = 20) =>
    request<{ matches: PvpMatch[]; total: number }>(`/admin/pvp/matches?page=${page}&pageSize=${pageSize}`),
  getSeasons: () =>
    request<{ seasons: PvpSeason[] }>('/admin/pvp/seasons'),
  createSeason: (data: { name: string; startAt: string; endAt: string; rewards: Record<string, unknown> }) =>
    request<PvpSeason>('/admin/pvp/seasons', { method: 'POST', body: JSON.stringify(data) }),
  activateSeason: (id: number) =>
    request<void>(`/admin/pvp/seasons/${id}/activate`, { method: 'POST' }),
  endSeason: (id: number) =>
    request<void>(`/admin/pvp/seasons/${id}/end`, { method: 'POST' }),
  getStats: () =>
    request<{ totalMatches: number; todayMatches: number; activeQueue: number; currentSeason: string }>('/admin/pvp/stats'),
};
