import { prisma } from '../../../lib/prisma.js';

export class DashboardService {
  async getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalUsers,
      todayRegistrations,
      todayActiveUsers,
      recentLogins,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.player.count({
        where: { lastActiveAt: { gte: todayStart } },
      }),
      prisma.user.findMany({
        where: { lastLoginAt: { not: null } },
        orderBy: { lastLoginAt: 'desc' },
        take: 5,
        include: {
          player: { select: { name: true, realm: true } },
        },
      }),
    ]);

    return {
      totalUsers,
      todayRegistrations,
      todayActiveUsers,
      onlineCount: todayActiveUsers,
      recentLogins: recentLogins.map((u) => ({
        id: u.id,
        username: u.username,
        playerName: u.player?.name ?? u.username,
        realm: u.player?.realm ?? '未创建角色',
        lastLoginAt: u.lastLoginAt,
      })),
    };
  }

  async getSystemStatus() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      uptime,
      uptimeFormatted: this.formatUptime(uptime),
      memoryUsage: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      },
      version: '1.0.0',
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  }
}

export const dashboardService = new DashboardService();
