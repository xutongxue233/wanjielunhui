import { z } from 'zod';

export const rankingTypeSchema = z.enum([
  'COMBAT_POWER',
  'REALM',
  'REINCARNATION',
  'PVP_RATING',
  'WEALTH',
  'SECT',
]);

export const getRankingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type RankingTypeInput = z.infer<typeof rankingTypeSchema>;
export type GetRankingQuery = z.infer<typeof getRankingQuerySchema>;
