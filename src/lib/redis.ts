import { Redis } from 'ioredis';

// ─── Redis Client ─────────────────────────────────────────────────────────────

const getRedisUrl = () => process.env.REDIS_URL || null;

let redis: Redis | null = null;

const redisUrl = getRedisUrl();
if (redisUrl) {
  redis = new Redis(redisUrl, {
    // Prevent hanging connections
    connectTimeout: 5000,
    // Don't block if Redis is temporarily down
    enableOfflineQueue: false,
    // Retry with backoff, max 3 times
    maxRetriesPerRequest: 2,
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    // Log but don't crash — we fall back to in-memory cache
    if ((err as any).code !== 'ECONNREFUSED') {
      console.warn('[Redis] Connection error (will use in-memory fallback):', err.message);
    }
  });

  // Try to connect eagerly so the first request isn't slow
  redis.connect().catch(() => {
    console.warn('[Redis] Could not connect — in-memory cache will be used as fallback.');
  });
}

export { redis };

// ─── In-Memory TTL Cache (fallback when Redis is unavailable) ─────────────────
// A simple Map-based cache with TTL. Not distributed, but significantly faster
// than hitting MongoDB on every request within the same server process.

interface CacheEntry<T> { value: T; expiresAt: number; }

const memCache = new Map<string, CacheEntry<unknown>>();

function memGet<T>(key: string): T | null {
  const entry = memCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { memCache.delete(key); return null; }
  return entry.value;
}

function memSet<T>(key: string, value: T, ttlSeconds: number): void {
  // Evict if cache grows too large (> 500 entries) — keep most recent half
  if (memCache.size > 500) {
    const keys = Array.from(memCache.keys());
    keys.slice(0, 250).forEach(k => memCache.delete(k));
  }
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ─── getOrSetCache ────────────────────────────────────────────────────────────

/**
 * Fetch from Redis, fall back to in-memory cache, then to the fetcher function.
 * Always populates both Redis and the in-memory cache on a cache miss.
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  expirationSeconds: number = 3600
): Promise<T> {

  // 1. Try Redis first (distributed cache — survives process restarts)
  if (redis && redis.status === 'ready') {
    try {
      const cached = await redis.get(key);
      if (cached) return JSON.parse(cached) as T;
    } catch (e) {
      console.warn(`[Redis] GET error for "${key}":`, (e as Error).message);
    }
  }

  // 2. Try in-memory fallback (fast, same process)
  const memHit = memGet<T>(key);
  if (memHit !== null) return memHit;

  // 3. Cache miss — fetch fresh data
  const data = await fetcher();

  if (data !== null && data !== undefined) {
    // Populate in-memory cache immediately
    memSet(key, data, expirationSeconds);

    // Populate Redis in the background (don't await — don't block the response)
    if (redis && redis.status === 'ready') {
      redis.set(key, JSON.stringify(data), 'EX', expirationSeconds).catch(e => {
        console.warn(`[Redis] SET error for "${key}":`, (e as Error).message);
      });
    }
  }

  return data;
}

// ─── invalidateCache ──────────────────────────────────────────────────────────

/**
 * Invalidate one or more cache keys from both Redis and the in-memory cache.
 */
export async function invalidateCache(keys: string | string[]) {
  const keysArray = Array.isArray(keys) ? keys : [keys];
  if (keysArray.length === 0) return;

  // Always clear from in-memory cache immediately
  keysArray.forEach(k => memCache.delete(k));

  // Clear from Redis if available
  if (redis && redis.status === 'ready') {
    try {
      await redis.del(...keysArray);
    } catch (e) {
      console.warn(`[Redis] DEL error for keys [${keysArray.join(', ')}]:`, (e as Error).message);
    }
  }
}
