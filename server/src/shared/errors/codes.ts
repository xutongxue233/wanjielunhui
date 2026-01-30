export const ErrorCodes = {
  UNKNOWN: 'UNKNOWN_ERROR',

  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_USER_EXISTS: 'AUTH_USER_EXISTS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_USER_BANNED: 'AUTH_USER_BANNED',

  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  NOT_FOUND: 'NOT_FOUND',
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  SAVE_NOT_FOUND: 'SAVE_NOT_FOUND',
  SECT_NOT_FOUND: 'SECT_NOT_FOUND',
  MAIL_NOT_FOUND: 'MAIL_NOT_FOUND',
  LISTING_NOT_FOUND: 'LISTING_NOT_FOUND',

  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  ALREADY_FRIENDS: 'ALREADY_FRIENDS',
  ALREADY_IN_SECT: 'ALREADY_IN_SECT',

  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INSUFFICIENT_ITEMS: 'INSUFFICIENT_ITEMS',

  RATE_LIMITED: 'RATE_LIMITED',

  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  REDIS_ERROR: 'REDIS_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.UNKNOWN]: '未知错误',

  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: '用户名或密码错误',
  [ErrorCodes.AUTH_INVALID_TOKEN]: '无效的令牌',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: '令牌已过期',
  [ErrorCodes.AUTH_UNAUTHORIZED]: '未授权访问',
  [ErrorCodes.AUTH_FORBIDDEN]: '禁止访问',
  [ErrorCodes.AUTH_USER_EXISTS]: '用户已存在',
  [ErrorCodes.AUTH_USER_NOT_FOUND]: '用户不存在',
  [ErrorCodes.AUTH_USER_BANNED]: '账号已被封禁',

  [ErrorCodes.VALIDATION_ERROR]: '数据验证失败',
  [ErrorCodes.INVALID_INPUT]: '无效的输入',

  [ErrorCodes.NOT_FOUND]: '资源不存在',
  [ErrorCodes.PLAYER_NOT_FOUND]: '玩家不存在',
  [ErrorCodes.SAVE_NOT_FOUND]: '存档不存在',
  [ErrorCodes.SECT_NOT_FOUND]: '门派不存在',
  [ErrorCodes.MAIL_NOT_FOUND]: '邮件不存在',
  [ErrorCodes.LISTING_NOT_FOUND]: '商品不存在',

  [ErrorCodes.CONFLICT]: '资源冲突',
  [ErrorCodes.ALREADY_EXISTS]: '已存在',
  [ErrorCodes.ALREADY_FRIENDS]: '已经是好友',
  [ErrorCodes.ALREADY_IN_SECT]: '已加入门派',

  [ErrorCodes.INSUFFICIENT_FUNDS]: '灵石不足',
  [ErrorCodes.INSUFFICIENT_ITEMS]: '物品不足',

  [ErrorCodes.RATE_LIMITED]: '请求过于频繁，请稍后再试',

  [ErrorCodes.INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCodes.DATABASE_ERROR]: '数据库错误',
  [ErrorCodes.REDIS_ERROR]: '缓存服务错误',
};
