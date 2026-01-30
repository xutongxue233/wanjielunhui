import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(128),
  content: z.string().min(1),
  type: z.string().max(32).default('normal'),
  priority: z.number().int().min(0).default(0),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(128).optional(),
  content: z.string().min(1).optional(),
  type: z.string().max(32).optional(),
  priority: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
