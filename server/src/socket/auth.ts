import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import type { SocketUserData } from './index.js';

export async function verifySocketToken(
  token: string,
  app: FastifyInstance
): Promise<SocketUserData> {
  const decoded = app.jwt.verify<{ userId: string }>(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      player: {
        include: {
          sectMember: true,
        },
      },
    },
  });

  if (!user || !user.player) {
    throw new Error('用户不存在');
  }

  if (user.status === 'BANNED') {
    throw new Error('账号已被封禁');
  }

  return {
    userId: user.id,
    playerId: user.player.id,
    playerName: user.player.name,
    playerRealm: user.player.realm,
    sectId: user.player.sectMember?.sectId,
  };
}
