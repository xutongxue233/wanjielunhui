import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, ErrorCodes, InternalError } from '../shared/errors/index.js';
import { ZodError, type ZodIssue } from 'zod';
import logger from '../lib/logger.js';

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send(error.toJSON());
      }

      if (error instanceof ZodError) {
        const details = (error.issues as ZodIssue[]).map((e: ZodIssue) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        const appError = new AppError(ErrorCodes.VALIDATION_ERROR, 400, '数据验证失败', details);
        return reply.status(400).send(appError.toJSON());
      }

      if ('statusCode' in error && typeof error.statusCode === 'number') {
        const statusCode = error.statusCode as number;
        if (statusCode === 429) {
          const appError = new AppError(ErrorCodes.RATE_LIMITED, 429);
          return reply.status(429).send(appError.toJSON());
        }
        return reply.status(statusCode).send({
          success: false,
          error: {
            code: ErrorCodes.UNKNOWN,
            message: error.message,
          },
        });
      }

      logger.error(error, 'Unhandled error');
      const internalError = new InternalError();
      return reply.status(500).send(internalError.toJSON());
    }
  );

  fastify.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(404).send({
      success: false,
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: '请求的资源不存在',
      },
    });
  });
}

export default fp(errorHandlerPlugin, {
  name: 'error-handler',
});
