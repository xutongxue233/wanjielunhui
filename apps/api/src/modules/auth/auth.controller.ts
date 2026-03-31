import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  type RegisterInput,
  type LoginInput,
  type RefreshTokenInput,
  type TokenPayload,
} from './auth.schema.js';

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const input = registerSchema.parse(request.body) as RegisterInput;
    const user = await authService.register(input);

    return reply.status(201).send({
      success: true,
      data: user,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body) as LoginInput;
    const ip = request.ip;

    const signToken = (payload: TokenPayload, options?: { expiresIn?: string }) => {
      return request.server.jwt.sign(payload, options);
    };

    const result = await authService.login(input, ip, signToken);

    return reply.send({
      success: true,
      data: result,
    });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const input = refreshTokenSchema.parse(request.body) as RefreshTokenInput;

    const signToken = (payload: TokenPayload, options?: { expiresIn?: string }) => {
      return request.server.jwt.sign(payload, options);
    };

    const tokens = await authService.refreshToken(input.refreshToken, signToken);

    return reply.send({
      success: true,
      data: tokens,
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken?: string };

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    return reply.send({
      success: true,
      data: { message: '登出成功' },
    });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const user = await authService.getCurrentUser(userId);

    return reply.send({
      success: true,
      data: user,
    });
  }
}

export const authController = new AuthController();
