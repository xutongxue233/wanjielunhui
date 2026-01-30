import { prisma } from '../../../lib/prisma.js';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ErrorCodes,
} from '../../../shared/errors/index.js';
import type { ListingInfo, ListingListResponse, TradeLogInfo } from './market.types.js';
import type { CreateListingInput, ListingQuery } from './market.schema.js';
import { MARKET_CONFIG } from './market.types.js';

export class MarketService {
  async createListing(
    sellerId: string,
    input: CreateListingInput
  ): Promise<ListingInfo> {
    const seller = await prisma.player.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '玩家不存在');
    }

    const activeListings = await prisma.marketListing.count({
      where: { sellerId, status: 'ACTIVE' },
    });

    if (activeListings >= MARKET_CONFIG.MAX_LISTINGS_PER_PLAYER) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '上架数量已达上限');
    }

    const listingFee = BigInt(Math.floor(input.price * MARKET_CONFIG.LISTING_FEE_RATE));
    if (seller.spiritStones < listingFee) {
      throw new BadRequestError(ErrorCodes.INSUFFICIENT_FUNDS, '灵石不足以支付上架费');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + input.expiresInDays);

    const [listing] = await prisma.$transaction([
      prisma.marketListing.create({
        data: {
          sellerId,
          itemType: input.itemType,
          itemId: input.itemId,
          itemData: input.itemData,
          amount: input.amount,
          price: BigInt(input.price),
          currency: input.currency,
          expiresAt,
        },
      }),
      prisma.player.update({
        where: { id: sellerId },
        data: { spiritStones: { decrement: listingFee } },
      }),
    ]);

    return {
      id: listing.id,
      sellerId: listing.sellerId,
      sellerName: seller.name,
      itemType: listing.itemType,
      itemId: listing.itemId,
      itemData: listing.itemData as Record<string, unknown>,
      amount: listing.amount,
      price: Number(listing.price),
      currency: listing.currency,
      status: listing.status,
      expiresAt: listing.expiresAt,
      createdAt: listing.createdAt,
    };
  }

  async getListings(query: ListingQuery): Promise<ListingListResponse> {
    const where: Record<string, unknown> = { status: 'ACTIVE' };

    if (query.itemType) {
      where.itemType = query.itemType;
    }
    if (query.minPrice !== undefined) {
      where.price = { ...((where.price as object) ?? {}), gte: BigInt(query.minPrice) };
    }
    if (query.maxPrice !== undefined) {
      where.price = { ...((where.price as object) ?? {}), lte: BigInt(query.maxPrice) };
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[query.sortBy] = query.sortOrder;

    const [listings, total] = await Promise.all([
      prisma.marketListing.findMany({
        where,
        include: {
          seller: { select: { name: true } },
        },
        orderBy,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.marketListing.count({ where }),
    ]);

    return {
      listings: listings.map((l) => ({
        id: l.id,
        sellerId: l.sellerId,
        sellerName: l.seller.name,
        itemType: l.itemType,
        itemId: l.itemId,
        itemData: l.itemData as Record<string, unknown>,
        amount: l.amount,
        price: Number(l.price),
        currency: l.currency,
        status: l.status,
        expiresAt: l.expiresAt,
        createdAt: l.createdAt,
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async buyListing(buyerId: string, listingId: string): Promise<TradeLogInfo> {
    const listing = await prisma.marketListing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      throw new NotFoundError(ErrorCodes.LISTING_NOT_FOUND, '商品不存在');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '商品已下架');
    }

    if (listing.expiresAt < new Date()) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '商品已过期');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '不能购买自己的商品');
    }

    const buyer = await prisma.player.findUnique({
      where: { id: buyerId },
    });

    if (!buyer) {
      throw new NotFoundError(ErrorCodes.PLAYER_NOT_FOUND, '买家不存在');
    }

    if (buyer.spiritStones < listing.price) {
      throw new BadRequestError(ErrorCodes.INSUFFICIENT_FUNDS, '灵石不足');
    }

    const fee = BigInt(Math.floor(Number(listing.price) * MARKET_CONFIG.TAX_RATE));
    const sellerReceives = listing.price - fee;

    const [tradeLog] = await prisma.$transaction([
      prisma.tradeLog.create({
        data: {
          sellerId: listing.sellerId,
          buyerId,
          listingId: listing.id,
          itemType: listing.itemType,
          itemId: listing.itemId,
          itemData: listing.itemData,
          amount: listing.amount,
          price: listing.price,
          currency: listing.currency,
          fee,
        },
      }),
      prisma.marketListing.update({
        where: { id: listingId },
        data: { status: 'SOLD', soldAt: new Date() },
      }),
      prisma.player.update({
        where: { id: buyerId },
        data: { spiritStones: { decrement: listing.price } },
      }),
      prisma.player.update({
        where: { id: listing.sellerId },
        data: { spiritStones: { increment: sellerReceives } },
      }),
    ]);

    return {
      id: tradeLog.id,
      sellerId: tradeLog.sellerId,
      buyerId: tradeLog.buyerId,
      itemType: tradeLog.itemType,
      itemId: tradeLog.itemId,
      amount: tradeLog.amount,
      price: Number(tradeLog.price),
      currency: tradeLog.currency,
      fee: Number(tradeLog.fee),
      createdAt: tradeLog.createdAt,
    };
  }

  async cancelListing(sellerId: string, listingId: string): Promise<void> {
    const listing = await prisma.marketListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundError(ErrorCodes.LISTING_NOT_FOUND, '商品不存在');
    }

    if (listing.sellerId !== sellerId) {
      throw new ForbiddenError(ErrorCodes.AUTH_FORBIDDEN, '无权取消此商品');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestError(ErrorCodes.INVALID_INPUT, '商品已下架');
    }

    await prisma.marketListing.update({
      where: { id: listingId },
      data: { status: 'CANCELLED' },
    });
  }

  async getTradeHistory(
    playerId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ trades: TradeLogInfo[]; total: number }> {
    const [trades, total] = await Promise.all([
      prisma.tradeLog.findMany({
        where: {
          OR: [{ buyerId: playerId }, { sellerId: playerId }],
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tradeLog.count({
        where: {
          OR: [{ buyerId: playerId }, { sellerId: playerId }],
        },
      }),
    ]);

    return {
      trades: trades.map((t) => ({
        id: t.id,
        sellerId: t.sellerId,
        buyerId: t.buyerId,
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

  async getMyListings(sellerId: string): Promise<ListingInfo[]> {
    const listings = await prisma.marketListing.findMany({
      where: { sellerId },
      include: { seller: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return listings.map((l) => ({
      id: l.id,
      sellerId: l.sellerId,
      sellerName: l.seller.name,
      itemType: l.itemType,
      itemId: l.itemId,
      itemData: l.itemData as Record<string, unknown>,
      amount: l.amount,
      price: Number(l.price),
      currency: l.currency,
      status: l.status,
      expiresAt: l.expiresAt,
      createdAt: l.createdAt,
    }));
  }
}

export const marketService = new MarketService();
