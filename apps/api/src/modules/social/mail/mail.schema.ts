import { z } from 'zod';

export const sendMailSchema = z.object({
  receiverId: z.string().uuid(),
  title: z.string().min(1).max(64),
  content: z.string().min(1).max(1000),
  attachments: z
    .array(
      z.object({
        type: z.string(),
        itemId: z.string(),
        amount: z.number().int().positive(),
      })
    )
    .optional(),
});

export const mailIdSchema = z.object({
  id: z.string().uuid(),
});

export const mailListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  unreadOnly: z.coerce.boolean().default(false),
});

export type SendMailInput = z.infer<typeof sendMailSchema>;
export type MailIdInput = z.infer<typeof mailIdSchema>;
export type MailListQuery = z.infer<typeof mailListQuerySchema>;
