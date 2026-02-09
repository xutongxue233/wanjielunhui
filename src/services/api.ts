const API_BASE = '/api/v1';

import { useAuthStore } from '../stores/authStore';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { accessToken, refreshToken, updateToken, logout } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Token过期，尝试刷新
  if (response.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        updateToken(refreshData.data.accessToken, refreshData.data.refreshToken);

        // 重试原请求
        headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
        response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        logout();
        throw new Error('登录已过期，请重新登录');
      }
    } catch {
      logout();
      throw new Error('登录已过期，请重新登录');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || '请求失败');
  }

  return data.data;
}

// 认证API
export const authApi = {
  register: (username: string, email: string, password: string) =>
    request<{ id: string; username: string; email: string; role: string }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ username, email, password }) }
    ),

  login: (account: string, password: string) =>
    request<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: { id: string; username: string; email: string; role: string };
    }>('/auth/login', { method: 'POST', body: JSON.stringify({ account, password }) }),

  logout: (refreshToken: string) =>
    request<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  me: () =>
    request<{ id: string; username: string; email: string; role: string }>('/auth/me'),
};

// 存档API
export interface SaveSlot {
  id: string;
  slot: number;
  name: string;
  playTime: number;
  checkpoint?: string;
  updatedAt: string;
  createdAt: string;
}

export interface SaveData {
  id: string;
  slot: number;
  name: string;
  playerData: unknown;
  gameData: unknown;
  alchemyData: unknown;
  discipleData: unknown;
  roguelikeData: unknown;
  playTime: number;
  checkpoint?: string;
  updatedAt: string;
}

export const saveApi = {
  list: () => request<SaveSlot[]>('/save/list'),

  get: (slot: number) => request<SaveData>(`/save/${slot}`),

  save: (
    slot: number,
    data: {
      name: string;
      playerData: unknown;
      gameData: unknown;
      alchemyData: unknown;
      discipleData: unknown;
      roguelikeData: unknown;
      playTime?: number;
      checkpoint?: string;
    }
  ) => request<SaveData>(`/save/${slot}`, { method: 'POST', body: JSON.stringify(data) }),

  delete: (slot: number) => request<void>(`/save/${slot}`, { method: 'DELETE' }),
};

// 玩家API
export const playerApi = {
  getProfile: () => request<unknown>('/player/profile'),

  updateProfile: (data: { name?: string; title?: string }) =>
    request<unknown>('/player/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// 排行榜API
export interface RankingEntry {
  rank: number;
  playerId: string;
  playerName: string;
  realm: string;
  score: number;
}

export const rankingApi = {
  getCombatPower: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(
      `/ranking/combat-power?page=${page}&pageSize=${pageSize}`
    ),

  getRealm: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(
      `/ranking/realm?page=${page}&pageSize=${pageSize}`
    ),

  getReincarnation: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(
      `/ranking/reincarnation?page=${page}&pageSize=${pageSize}`
    ),
};

// 公告API
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: number;
  createdAt: string;
}

export const announcementApi = {
  getList: () => request<Announcement[]>('/ops/announcements'),
};

// 好友API
export interface Friend {
  id: string;
  odId: string;
  friendId: string;
  friendName: string;
  friendRealm: string;
  isOnline: boolean;
  lastOnline?: string;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromPlayerId: string;
  fromPlayerName: string;
  fromPlayerRealm: string;
  message?: string;
  status: string;
  createdAt: string;
}

export const friendApi = {
  list: async () => {
    const result = await request<{ friends: Friend[]; total: number }>('/friend/list');
    return result.friends || [];
  },

  requests: async () => {
    const result = await request<{ requests: FriendRequest[]; total: number }>('/friend/requests');
    return result.requests || [];
  },

  add: (friendId: string, message?: string) =>
    request<void>('/friend/request', { method: 'POST', body: JSON.stringify({ targetId: friendId, message }) }),

  accept: (requestId: string) =>
    request<void>(`/friend/accept/${requestId}`, { method: 'POST' }),

  reject: (requestId: string) =>
    request<void>(`/friend/reject/${requestId}`, { method: 'POST' }),

  remove: (friendId: string) =>
    request<void>(`/friend/${friendId}`, { method: 'DELETE' }),

  search: (keyword: string) =>
    request<{ id: string; name: string; realm: string }[]>(`/player/search?keyword=${encodeURIComponent(keyword)}`),
};

// 宗门API
export interface Sect {
  id: string;
  name: string;
  level: number;
  memberCount: number;
  maxMembers: number;
  totalContribution: number;
  leaderId: string;
  leaderName: string;
  description?: string;
  createdAt: string;
}

export interface SectMember {
  id: string;
  playerId: string;
  playerName: string;
  rank: string;
  contribution: number;
  isOnline: boolean;
  joinedAt: string;
}

export const sectApi = {
  getMySect: () => request<Sect | null>('/sect/my'),

  getMembers: (sectId: string) => request<SectMember[]>(`/sect/${sectId}/members`),

  list: (page = 1, pageSize = 20) =>
    request<{ sects: Sect[]; total: number }>(`/sect/list?page=${page}&pageSize=${pageSize}`),

  create: (name: string, description?: string) =>
    request<Sect>('/sect/create', { method: 'POST', body: JSON.stringify({ name, description }) }),

  join: (sectId: string) =>
    request<void>(`/sect/${sectId}/join`, { method: 'POST' }),

  leave: (sectId: string) => request<void>(`/sect/${sectId}/leave`, { method: 'POST' }),

  contribute: (sectId: string, amount: number) =>
    request<void>(`/sect/${sectId}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) }),
};

// 邮件API
export interface Mail {
  id: string;
  senderId?: string;
  senderName: string;
  title: string;
  content: string;
  isRead: boolean;
  hasAttachment: boolean;
  attachments?: { type: string; itemId?: string; amount: number }[];
  createdAt: string;
  expiresAt?: string;
}

export const mailApi = {
  list: (page = 1, pageSize = 20) =>
    request<{ mails: Mail[]; total: number; unreadCount: number }>(`/mail/list?page=${page}&pageSize=${pageSize}`),

  read: (mailId: string) => request<Mail>(`/mail/${mailId}`),

  claim: (mailId: string) =>
    request<void>(`/mail/${mailId}/claim`, { method: 'POST' }),

  delete: (mailId: string) =>
    request<void>(`/mail/${mailId}`, { method: 'DELETE' }),

  send: (toPlayerId: string, title: string, content: string) =>
    request<void>('/mail/send', { method: 'POST', body: JSON.stringify({ toPlayerId, title, content }) }),
};

// 聊天API
export interface ChatMessage {
  id: string;
  channel: string;
  senderId: string;
  senderName: string;
  senderRealm?: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
}

export const chatApi = {
  getMessages: (channel: string, before?: string, limit = 50) => {
    let url = `/chat/messages?channel=${channel}&limit=${limit}`;
    if (before) url += `&before=${before}`;
    return request<ChatMessage[]>(url);
  },

  send: (channel: string, content: string) =>
    request<ChatMessage>('/chat/send', { method: 'POST', body: JSON.stringify({ channel, content }) }),
};

// 坊市API
export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemRarity: string;
  itemIcon: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export interface ShopItem {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemRarity: string;
  itemIcon: string;
  description: string;
  price: number;
  currency: string;
  stock?: number;
  category: string;
}

export interface MyTrade {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  soldAt?: string;
}

export const marketApi = {
  listings: (page = 1, pageSize = 20, type?: string, search?: string) => {
    let url = `/market/listings?page=${page}&pageSize=${pageSize}`;
    if (type && type !== '全部') url += `&type=${encodeURIComponent(type)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return request<{ listings: MarketListing[]; total: number }>(url);
  },

  buy: (listingId: string, quantity = 1) =>
    request<void>(`/market/buy/${listingId}`, { method: 'POST', body: JSON.stringify({ quantity }) }),

  sell: (itemId: string, price: number, quantity = 1) =>
    request<MarketListing>('/market/list', { method: 'POST', body: JSON.stringify({ itemId, price, quantity }) }),

  cancel: (listingId: string) =>
    request<void>(`/market/cancel/${listingId}`, { method: 'POST' }),

  myListings: () => request<MyTrade[]>('/market/my-listings'),

  myTrades: () => request<MyTrade[]>('/market/history'),

  shop: (category?: string) => {
    let url = '/market/shop';
    if (category && category !== '推荐') url += `?category=${encodeURIComponent(category)}`;
    return request<ShopItem[]>(url);
  },

  shopBuy: (itemId: string, quantity = 1) =>
    request<void>('/market/shop/buy', { method: 'POST', body: JSON.stringify({ itemId, quantity }) }),
};

// PVP API
export interface PvpStats {
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  rank?: number;
  seasonId?: string;
  seasonName?: string;
}

export interface PvpMatch {
  id: string;
  opponentId: string;
  opponentName: string;
  opponentRealm: string;
  result: 'win' | 'lose' | 'draw';
  ratingChange: number;
  createdAt: string;
}

export interface PvpBattleState {
  matchId: string;
  myHp: number;
  myMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  isMyTurn: boolean;
  opponent: {
    id: string;
    name: string;
    realm: string;
  };
  logs: { message: string; type: string }[];
  status: 'ongoing' | 'won' | 'lost';
}

export const pvpApi = {
  stats: () => request<PvpStats>('/pvp/stats'),

  history: (page = 1, pageSize = 10) =>
    request<{ matches: PvpMatch[]; total: number }>(`/pvp/history?page=${page}&pageSize=${pageSize}`),

  rankings: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(`/ranking/pvp?page=${page}&pageSize=${pageSize}`),

  joinQueue: () => request<{ status: string; estimatedWait?: number }>('/pvp/match', { method: 'POST' }),

  leaveQueue: () => request<void>('/pvp/match', { method: 'DELETE' }),

  getBattle: () => request<PvpBattleState | null>('/pvp/battle'),

  action: (action: 'attack' | 'skill' | 'defend') =>
    request<PvpBattleState>('/pvp/battle/action', { method: 'POST', body: JSON.stringify({ action }) }),

  surrender: () => request<void>('/pvp/battle/surrender', { method: 'POST' }),
};

// 扩展排行榜API
export const rankingApiExtended = {
  ...rankingApi,

  getWealth: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(
      `/ranking/wealth?page=${page}&pageSize=${pageSize}`
    ),

  getPvp: (page = 1, pageSize = 50) =>
    request<{ rankings: RankingEntry[]; total: number }>(
      `/ranking/pvp-rating?page=${page}&pageSize=${pageSize}`
    ),

  getMyRank: (type: string) => {
    // 映射前端类型到后端类型
    const typeMap: Record<string, string> = {
      combat: 'combat-power',
      realm: 'realm',
      wealth: 'wealth',
      pvp: 'pvp-rating',
    };
    const backendType = typeMap[type] || type;
    return request<{ rank: number; score: number }>(`/ranking/${backendType}/me`);
  },
};
