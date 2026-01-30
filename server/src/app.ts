import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import config from './config/index.js';
import errorHandler from './plugins/errorHandler.js';
import authMiddleware from './shared/middleware/auth.middleware.js';
import { authRoutes } from './modules/auth/index.js';
import { playerRoutes } from './modules/player/index.js';
import { saveRoutes } from './modules/save/index.js';
import { rankingRoutes } from './modules/ranking/index.js';
import { friendRoutes } from './modules/social/friend/index.js';
import { mailRoutes } from './modules/social/mail/index.js';
import { sectRoutes } from './modules/social/sect/index.js';
import { marketRoutes } from './modules/trade/market/index.js';
import { pvpRoutes } from './modules/pvp/index.js';
import { announcementRoutes, adminAnnouncementRoutes } from './modules/admin/announcement/index.js';
import { activityRoutes, adminActivityRoutes } from './modules/admin/activity/index.js';
import { adminDashboardRoutes } from './modules/admin/dashboard/index.js';
import { adminUserRoutes } from './modules/admin/user/index.js';
import { adminSaveRoutes } from './modules/admin/save/index.js';
import { adminMailRoutes } from './modules/admin/mail/index.js';
import { adminRankingRoutes } from './modules/admin/ranking/index.js';
import { adminFriendRoutes } from './modules/admin/friend/index.js';
import { adminSectRoutes } from './modules/admin/sect/index.js';
import { adminChatRoutes } from './modules/admin/chat/index.js';
import { adminMarketRoutes } from './modules/admin/market/index.js';
import { adminPvpRoutes } from './modules/admin/pvp/index.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
  });

  await app.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await app.register(cookie);

  await app.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: '请求过于频繁，请稍后再试',
      },
    }),
  });

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: '万界轮回 API',
        description: '万界轮回游戏后端API文档',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${config.server.port}`,
          description: '开发服务器',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  await app.register(errorHandler);
  await app.register(authMiddleware);

  // API路由
  await app.register(authRoutes, { prefix: `${config.server.apiPrefix}/auth` });
  await app.register(playerRoutes, { prefix: `${config.server.apiPrefix}/player` });
  await app.register(saveRoutes, { prefix: `${config.server.apiPrefix}/save` });
  await app.register(rankingRoutes, { prefix: `${config.server.apiPrefix}/ranking` });
  await app.register(friendRoutes, { prefix: `${config.server.apiPrefix}/friend` });
  await app.register(mailRoutes, { prefix: `${config.server.apiPrefix}/mail` });
  await app.register(sectRoutes, { prefix: `${config.server.apiPrefix}/sect` });
  await app.register(marketRoutes, { prefix: `${config.server.apiPrefix}/market` });
  await app.register(pvpRoutes, { prefix: `${config.server.apiPrefix}/pvp` });
  await app.register(announcementRoutes, { prefix: `${config.server.apiPrefix}/ops` });
  await app.register(activityRoutes, { prefix: `${config.server.apiPrefix}/ops` });
  await app.register(adminAnnouncementRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminActivityRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminDashboardRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminUserRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminSaveRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminMailRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminRankingRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminFriendRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminSectRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminChatRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminMarketRoutes, { prefix: `${config.server.apiPrefix}/admin` });
  await app.register(adminPvpRoutes, { prefix: `${config.server.apiPrefix}/admin` });

  app.get('/health', async () => {
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    };
  });

  app.get('/', async () => {
    return {
      success: true,
      data: {
        name: '万界轮回 API',
        version: '1.0.0',
        docs: '/docs',
      },
    };
  });

  return app;
}

export default buildApp;
