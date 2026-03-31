import type { MailType } from '@prisma/client';

export interface MailAttachment {
  type: string;
  itemId: string;
  amount: number;
}

export interface MailInfo {
  id: string;
  senderId?: string;
  senderName?: string;
  type: MailType;
  title: string;
  content: string;
  attachments?: MailAttachment[];
  isRead: boolean;
  isClaimed: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface MailListResponse {
  mails: MailInfo[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}

export interface MailDetailResponse extends MailInfo {
  receiverId: string;
}
