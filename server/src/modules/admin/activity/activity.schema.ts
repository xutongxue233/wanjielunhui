import { z } from 'zod';

export const createActivitySchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(500),
  type: z.string().max(32),
  config: z.record(z.unknown()),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
