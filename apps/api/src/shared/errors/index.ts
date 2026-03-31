import { type ErrorCode, ErrorCodes, ErrorMessages } from './codes.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, statusCode: number, message?: string, details?: unknown) {
    super(message ?? ErrorMessages[code] ?? '未知错误');
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export class BadRequestError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.INVALID_INPUT, message?: string, details?: unknown) {
    super(code, 400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.AUTH_UNAUTHORIZED, message?: string) {
    super(code, 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.AUTH_FORBIDDEN, message?: string) {
    super(code, 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.NOT_FOUND, message?: string) {
    super(code, 404, message);
  }
}

export class ConflictError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.CONFLICT, message?: string) {
    super(code, 409, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message?: string) {
    super(ErrorCodes.RATE_LIMITED, 429, message);
  }
}

export class InternalError extends AppError {
  constructor(code: ErrorCode = ErrorCodes.INTERNAL_ERROR, message?: string) {
    super(code, 500, message);
  }
}

export { ErrorCodes, ErrorMessages, type ErrorCode } from './codes.js';
