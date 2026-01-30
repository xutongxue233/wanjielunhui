import { getRedis } from './redis.js';

export interface CacheOptions {
  ttl?: number;
}

const DEFAULT_TTL = 300;

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  const data = await redis.get(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return data as unknown as T;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  options: CacheOptions = {}
): Promise<void> {
  const redis = getRedis();
  const ttl = options.ttl ?? DEFAULT_TTL;
  const data = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttl > 0) {
    await redis.setex(key, ttl, data);
  } else {
    await redis.set(key, data);
  }
}

export async function cacheDel(key: string): Promise<void> {
  const redis = getRedis();
  await redis.del(key);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const redis = getRedis();
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function cacheExists(key: string): Promise<boolean> {
  const redis = getRedis();
  const exists = await redis.exists(key);
  return exists === 1;
}

export async function cacheIncr(key: string): Promise<number> {
  const redis = getRedis();
  return redis.incr(key);
}

export async function cacheExpire(key: string, ttl: number): Promise<void> {
  const redis = getRedis();
  await redis.expire(key, ttl);
}

export const CacheKeys = {
  playerOnline: (id: string) => `player:online:${id}`,
  ranking: (type: string) => `ranking:${type}`,
  playerRank: (type: string, id: string) => `ranking:${type}:player:${id}`,
  sectMembers: (sectId: string) => `sect:${sectId}:members`,
  pvpMatchPool: () => `pvp:match:pool`,
  session: (userId: string) => `session:${userId}`,
  rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,
};

export const cache = {
  get: cacheGet,
  set: cacheSet,
  del: cacheDel,
  delPattern: cacheDelPattern,
  exists: cacheExists,
  incr: cacheIncr,
  expire: cacheExpire,
  keys: CacheKeys,
};

export default cache;
