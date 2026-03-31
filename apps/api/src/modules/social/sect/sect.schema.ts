import { z } from 'zod';

export const createSectSchema = z.object({
  name: z.string().min(2).max(32),
  description: z.string().max(500).optional(),
  joinType: z.enum(['OPEN', 'APPROVAL', 'INVITE_ONLY']).default('APPROVAL'),
  minRealmToJoin: z.string().max(32).optional(),
});

export const updateSectSchema = z.object({
  description: z.string().max(500).optional(),
  notice: z.string().max(500).optional(),
  joinType: z.enum(['OPEN', 'APPROVAL', 'INVITE_ONLY']).optional(),
  minRealmToJoin: z.string().max(32).optional(),
  iconId: z.number().int().positive().optional(),
});

export const sectIdSchema = z.object({
  id: z.string().uuid(),
});

export const sectListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(['totalPower', 'memberCount', 'level', 'createdAt']).default('totalPower'),
});

export const joinSectSchema = z.object({
  message: z.string().max(255).optional(),
});

export type CreateSectInput = z.infer<typeof createSectSchema>;
export type UpdateSectInput = z.infer<typeof updateSectSchema>;
export type SectIdInput = z.infer<typeof sectIdSchema>;
export type SectListQuery = z.infer<typeof sectListQuerySchema>;
export type JoinSectInput = z.infer<typeof joinSectSchema>;
