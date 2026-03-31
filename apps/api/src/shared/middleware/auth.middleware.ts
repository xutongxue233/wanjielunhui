import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { UnauthorizedError, ErrorCodes } from '../../shared/errors/index.js';
import type { TokenPayload } from '../../modules/auth/auth.schema.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }
}

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError(ErrorCodes.AUTH_INVALID_TOKEN);
  }
}

export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    // ignore
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    await authenticate(request, _reply);

    const user = request.user;
    if (!user || !roles.includes(user.role)) {
      throw new UnauthorizedError(ErrorCodes.AUTH_FORBIDDEN, '权限不足');
    }
  };
}

async function authMiddlewarePlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', authenticate);
  fastify.decorate('optionalAuth', optionalAuth);
  fastify.decorate('requireRole', requireRole);
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate;
    optionalAuth: typeof optionalAuth;
    requireRole: typeof requireRole;
  }
}

export default fp(authMiddlewarePlugin, {
  name: 'auth-middleware',
});
