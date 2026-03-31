import { prisma } from '../../../lib/prisma.js';
import { BadRequestError, ErrorCodes } from '../../../shared/errors/index.js';
import type { ChatMessage, SendMessageInput } from './chat.types.js';
import { CHAT_CONFIG } from './chat.types.js';
import type { ChatChannel } from '@prisma/client';

export class ChatService {
  async getMessages(
    channel: string,
    before?: string,
    limit: number = CHAT_CONFIG.MESSAGE_LIMIT
  ): Promise<ChatMessage[]> {
    const where: Record<string, unknown> = { channel: channel as ChatChannel };

    if (before) {
      where.createdAt = { lt: new Date(before) };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, CHAT_CONFIG.MESSAGE_LIMIT),
    });

    return messages.map((m) => ({
      id: m.id,
      channel: m.channel,
      senderId: m.senderId,
      senderName: m.senderName,
      senderRealm: m.senderRealm,
      content: m.content,
      isSystem: false,
      createdAt: m.createdAt,
    }));
  }

  async sendMessage(
    playerId: string,
    input: SendMessageInput
  ): Promise<ChatMessage> {
    if (input.content.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      throw new BadRequestError(
        ErrorCodes.INVALID_INPUT,
        `消息长度不能超过 ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} 字符`
      );
    }

    if (input.content.trim().length === 0) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '消息内容不能为空');
    }

    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const message = await prisma.chatMessage.create({
      data: {
        channel: input.channel as ChatChannel,
        senderId: playerId,
        senderName: player.name,
        senderRealm: player.realm,
        content: input.content.trim(),
      },
    });

    return {
      id: message.id,
      channel: message.channel,
      senderId: message.senderId,
      senderName: message.senderName,
      senderRealm: message.senderRealm,
      content: message.content,
      isSystem: false,
      createdAt: message.createdAt,
    };
  }
}

export const chatService = new ChatService();
