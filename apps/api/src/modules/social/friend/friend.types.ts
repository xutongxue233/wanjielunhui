export interface FriendInfo {
  id: string;
  playerId: string;
  name: string;
  realm: string;
  realmStage: string;
  avatarId: number;
  title?: string;
  combatPower: number;
  isOnline: boolean;
  intimacy: number;
  remark?: string;
  createdAt: Date;
}

export interface FriendRequestInfo {
  id: string;
  senderId: string;
  senderName: string;
  senderRealm: string;
  senderAvatarId: number;
  message?: string;
  status: string;
  createdAt: Date;
}

export interface FriendListResponse {
  friends: FriendInfo[];
  total: number;
}

export interface FriendRequestListResponse {
  requests: FriendRequestInfo[];
  total: number;
}
