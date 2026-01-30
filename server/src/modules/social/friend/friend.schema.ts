import { z } from 'zod';

export const sendFriendRequestSchema = z.object({
  targetId: z.string().uuid(),
  message: z.string().max(255).optional(),
});

export const friendRequestIdSchema = z.object({
  id: z.string().uuid(),
});

export const friendIdSchema = z.object({
  id: z.string().uuid(),
});

export const updateRemarkSchema = z.object({
  remark: z.string().max(32).optional(),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
export type FriendRequestIdInput = z.infer<typeof friendRequestIdSchema>;
export type FriendIdInput = z.infer<typeof friendIdSchema>;
export type UpdateRemarkInput = z.infer<typeof updateRemarkSchema>;
