import { z } from 'zod';

export const updatePlayerSchema = z.object({
  name: z
    .string()
    .min(2, '名称至少2个字符')
    .max(32, '名称最多32个字符')
    .optional(),
  title: z.string().max(64, '称号最多64个字符').optional(),
  avatarId: z.number().int().positive().optional(),
});

export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;

export interface PlayerProfile {
  id: string;
  name: string;
  title: string | null;
  avatarId: number;
  realm: string;
  realmStage: string;
  cultivation: bigint;
  combatPower: bigint;
  pvpRating: number;
  reincarnations: number;
  spiritualRoot: unknown;
  createdAt: Date;
}

export interface PlayerPublicProfile {
  id: string;
  name: string;
  title: string | null;
  avatarId: number;
  realm: string;
  realmStage: string;
  combatPower: bigint;
  pvpRating: number;
}
