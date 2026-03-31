import type { ListingStatus } from '@prisma/client';

export interface ListingInfo {
  id: string;
  sellerId: string;
  sellerName: string;
  itemType: string;
  itemId: string;
  itemData: Record<string, unknown>;
  amount: number;
  price: number;
  currency: string;
  status: ListingStatus;
  expiresAt: Date;
  createdAt: Date;
}

export interface ListingListResponse {
  listings: ListingInfo[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TradeLogInfo {
  id: string;
  sellerId: string | null;
  buyerId: string;
  itemType: string;
  itemId: string;
  amount: number;
  price: number;
  currency: string;
  fee: number;
  createdAt: Date;
}

export const MARKET_CONFIG = {
  TAX_RATE: 0.05,
  LISTING_FEE_RATE: 0.01,
  MAX_LISTINGS_PER_PLAYER: 20,
} as const;
