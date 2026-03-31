import { z } from 'zod';

export const pvpActionSchema = z.object({
  actionType: z.enum(['attack', 'skill', 'defend', 'item']),
  skillId: z.string().optional(),
  itemId: z.string().optional(),
});

export const pvpHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  seasonId: z.coerce.number().int().optional(),
});

export type PvpActionInput = z.infer<typeof pvpActionSchema>;
export type PvpHistoryQuery = z.infer<typeof pvpHistoryQuerySchema>;
