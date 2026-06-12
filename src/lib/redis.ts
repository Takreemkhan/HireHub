import { Redis } from 'ioredis';

// To use Redis caching, set REDIS_URL in your .env.local file.
// We highly recommend Upstash (https://upstash.com/) for serverless Next.js apps.
// Create a free database, copy the "ioredis" URL, and add it:
// REDIS_URL="redis://default:xxxxxx@xxxxxx.upstash.io:32410"

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return null;
};

const redisUrl = getRedisUrl();

export const redis = redisUrl ? new Redis(redisUrl) : null;

/**
 * Helper to fetch from cache or execute a fallback function if cache misses or Redis is disabled
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  expirationSeconds: number = 3600
): Promise<T> {
  if (!redis) {
    // Redis is not configured, just fetch the data
    return fetcher();
  }

  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
  } catch (error) {
    console.error(`Redis cache GET error for key ${key}:`, error);
  }

  // Cache miss or error, fetch fresh data
  const data = await fetcher();

  if (data !== null && data !== undefined) {
    try {
      await redis.set(key, JSON.stringify(data), 'EX', expirationSeconds);
    } catch (error) {
      console.error(`Redis cache SET error for key ${key}:`, error);
    }
  }

  return data;
}

/**
 * Helper to invalidate cache keys
 */
export async function invalidateCache(keys: string | string[]) {
  if (!redis) return;

  const keysArray = Array.isArray(keys) ? keys : [keys];
  if (keysArray.length === 0) return;

  try {
    await redis.del(...keysArray);
  } catch (error) {
    console.error(`Redis cache DEL error for keys ${keysArray.join(', ')}:`, error);
  }
}
