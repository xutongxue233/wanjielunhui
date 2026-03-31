export interface ChatMessage {
  id: string;
  channel: string;
  senderId: string;
  senderName: string;
  senderRealm?: string;
  content: string;
  isSystem: boolean;
  createdAt: Date;
}

export interface SendMessageInput {
  channel: string;
  content: string;
}

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  CHANNELS: ['world', 'sect', 'private'] as const,
  MESSAGE_LIMIT: 50,
};
