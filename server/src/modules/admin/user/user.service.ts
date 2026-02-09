import { prisma } from '../../../lib/prisma.js';
import type { UserStatus } from '@prisma/client';

export class UserService {
  async getList(page: number, pageSize: number, search?: string) {
    const where = search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          player: {
            select: { name: true, realm: true, realmStage: true, combatPower: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        status: u.status,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
        createdAt: u.createdAt,
        player: u.player ? {
          name: u.player.name,
          realm: u.player.realm,
          realmStage: u.player.realmStage,
          combatPower: Number(u.player.combatPower),
        } : null,
      })),
      total,
      page,
      pageSize,
    };
  }

  async updateStatus(id: string, status: UserStatus) {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
    });
    return user;
  }

  async updateRole(id: string, role: 'PLAYER' | 'GM' | 'ADMIN') {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return user;
  }
}

export const userService = new UserService();
