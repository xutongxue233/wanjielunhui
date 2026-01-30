import { z } from 'zod';

export const createListingSchema = z.object({
  itemType: z.string().max(32),
  itemId: z.string().max(64),
  itemData: z.record(z.unknown()),
  amount: z.number().int().positive().default(1),
  price: z.number().int().positive(),
  currency: z.string().max(32).default('spiritStones'),
  expiresInDays: z.number().int().min(1).max(30).default(7),
});

export const listingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  itemType: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type ListingQuery = z.infer<typeof listingQuerySchema>;
