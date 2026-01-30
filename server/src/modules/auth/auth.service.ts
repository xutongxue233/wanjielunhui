import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { prisma } from '../../lib/prisma.js';
import config from '../../config/index.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  ErrorCodes,
} from '../../shared/errors/index.js';
import type {
  RegisterInput,
  LoginInput,
  AuthTokens,
  TokenPayload,
  UserResponse,
} from './auth.schema.js';

const SALT_ROUNDS = 12;

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900;

  const value = parseInt(match[1] ?? '0', 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 900;
  }
}

export class AuthService {
  async register(input: RegisterInput): Promise<UserResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.username }, { email: input.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === input.username) {
        throw new ConflictError(ErrorCodes.AUTH_USER_EXISTS, '用户名已存在');
      }
      throw new ConflictError(ErrorCodes.AUTH_USER_EXISTS, '邮箱已被注册');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
      },
    });

    await prisma.player.create({
      data: {
        userId: user.id,
        name: input.username,
        spiritualRoot: JSON.stringify({
          type: 'fire',
          quality: '下品',
          purity: 0.5,
        }),
      },
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(
    input: LoginInput,
    ip?: string,
    signToken: (payload: TokenPayload, options?: { expiresIn?: string }) => string = () => ''
  ): Promise<AuthTokens & { user: UserResponse }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.account }, { email: input.account }],
      },
      include: {
        player: { select: { id: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedError(ErrorCodes.AUTH_INVALID_CREDENTIALS);
    }

    if (user.status === 'BANNED') {
      throw new ForbiddenError(ErrorCodes.AUTH_USER_BANNED, '账号已被封禁');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError(ErrorCodes.AUTH_INVALID_CREDENTIALS);
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      playerId: user.player?.id ?? '',
      email: user.email,
      role: user.role,
    };

    const accessToken = signToken(tokenPayload, { expiresIn: config.jwt.expiresIn });

    const refreshToken = uuid();
    const refreshExpiresIn = parseExpiresIn(config.jwt.refreshExpiresIn);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip ?? null,
        loginCount: { increment: 1 },
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: parseExpiresIn(config.jwt.expiresIn),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async refreshToken(
    refreshToken: string,
    signToken: (payload: TokenPayload, options?: { expiresIn?: string }) => string
  ): Promise<AuthTokens> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError(ErrorCodes.AUTH_INVALID_TOKEN, '无效的刷新令牌');
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError(ErrorCodes.AUTH_TOKEN_EXPIRED, '刷新令牌已过期');
    }

    if (storedToken.user.status === 'BANNED') {
      throw new ForbiddenError(ErrorCodes.AUTH_USER_BANNED, '账号已被封禁');
    }

    const tokenPayload: TokenPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const accessToken = signToken(tokenPayload, { expiresIn: config.jwt.expiresIn });

    const newRefreshToken = uuid();
    const refreshExpiresIn = parseExpiresIn(config.jwt.refreshExpiresIn);

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: storedToken.id } }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: storedToken.user.id,
          expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
        },
      }),
    ]);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: parseExpiresIn(config.jwt.expiresIn),
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(ErrorCodes.AUTH_USER_NOT_FOUND);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
