import { prisma } from '../../../lib/prisma.js';

export class AdminMarketService {
  async getListings(page: number, pageSize: number) {
    const [listings, total] = await Promise.all([
      prisma.marketListing.findMany({
        include: { seller: { select: { name: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.marketListing.count(),
    ]);

    return {
      listings: listings.map((l) => ({
        id: l.id,
        sellerId: l.sellerId,
        sellerName: l.seller.name,
        itemType: l.itemType,
        itemId: l.itemId,
        amount: l.amount,
        price: Number(l.price),
        currency: l.currency,
        status: l.status,
        expiresAt: l.expiresAt,
        createdAt: l.createdAt,
      })),
      total,
    };
  }

  async getTrades(page: number, pageSize: number) {
    const [trades, total] = await Promise.all([
      prisma.tradeLog.findMany({
        include: { buyer: { select: { name: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tradeLog.count(),
    ]);

    const sellerIds = trades.map((t) => t.sellerId).filter((id): id is string => id !== null);
    const sellers = await prisma.player.findMany({
      where: { id: { in: sellerIds } },
      select: { id: true, name: true },
    });
    const sellerMap = new Map(sellers.map((s) => [s.id, s.name]));

    return {
      trades: trades.map((t) => ({
        id: t.id,
        sellerId: t.sellerId,
        sellerName: t.sellerId ? sellerMap.get(t.sellerId) : undefined,
        buyerId: t.buyerId,
        buyerName: t.buyer.name,
        itemType: t.itemType,
        itemId: t.itemId,
        amount: t.amount,
        price: Number(t.price),
        currency: t.currency,
        fee: Number(t.fee),
        createdAt: t.createdAt,
      })),
      total,
    };
  }

  async cancelListing(id: string): Promise<void> {
    await prisma.marketListing.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeListings, totalTrades, todayTrades, feeSum] = await Promise.all([
      prisma.marketListing.count({ where: { status: 'ACTIVE' } }),
      prisma.tradeLog.count(),
      prisma.tradeLog.findMany({
        where: { createdAt: { gte: today } },
        select: { price: true },
      }),
      prisma.tradeLog.aggregate({ _sum: { fee: true } }),
    ]);

    const todayVolume = todayTrades.reduce((sum, t) => sum + Number(t.price), 0);
    const totalFees = Number(feeSum._sum.fee ?? 0);

    return { activeListings, totalTrades, todayVolume, totalFees };
  }
}

export const adminMarketService = new AdminMarketService();
