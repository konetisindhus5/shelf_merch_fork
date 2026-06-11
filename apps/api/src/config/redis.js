import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

let connection = null;

/** Lazy shared Redis connection (BullMQ requires maxRetriesPerRequest: null). */
export function getRedis() {
  if (!connection) {
    connection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      connectTimeout: 3_000,
    });
    connection.on('error', (err) => logger.error({ err: err.message }, 'Redis error'));
  }
  return connection;
}

/** Returns true when Redis is reachable; never blocks longer than `timeoutMs`. */
export async function ensureRedisReady(timeoutMs = 3_000) {
  const redis = getRedis();
  if (redis.status === 'ready') return true;
  try {
    await Promise.race([
      redis.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connect timeout')), timeoutMs),
      ),
    ]);
    return redis.status === 'ready';
  } catch {
    return false;
  }
}

export async function closeRedis() {
  if (connection) {
    await connection.quit().catch(() => {});
    connection = null;
  }
}
