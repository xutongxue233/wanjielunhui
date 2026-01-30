import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, '用户名至少2个字符')
    .max(32, '用户名最多32个字符')
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文'),
  email: z.string().email('邮箱格式不正确'),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .max(128, '密码最多128个字符'),
});

export const loginSchema = z.object({
  account: z.string().min(1, '请输入用户名或邮箱'),
  password: z.string().min(1, '请输入密码'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, '请提供刷新令牌'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export interface TokenPayload {
  userId: string;
  playerId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}
