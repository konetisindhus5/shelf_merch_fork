import { Queue } from 'bullmq';
import { ensureRedisReady, getRedis } from '../config/redis.js';
import { logger } from '../config/logger.js';
import { processCsvImport } from '../modules/imports/imports.service.js';

let csvImportQueue = null;
let notificationQueue = null;

function makeQueue(name) {
  return new Queue(name, { connection: getRedis() });
}

export function getCsvImportQueue() {
  if (!csvImportQueue) csvImportQueue = makeQueue('csv-import');
  return csvImportQueue;
}

export function getNotificationQueue() {
  if (!notificationQueue) notificationQueue = makeQueue('notifications');
  return notificationQueue;
}

/**
 * Enqueue a CSV import; if Redis is unreachable, degrade to inline
 * processing so dev environments without a worker still function.
 */
export async function enqueueCsvImport({ tenantId, jobId }) {
  try {
    if (!(await ensureRedisReady())) throw new Error('Redis not ready');
    await getCsvImportQueue().add('import', { tenantId: String(tenantId), jobId: String(jobId) });
  } catch (err) {
    logger.warn({ err: err.message }, 'Redis unavailable — processing CSV import inline');
    setImmediate(() =>
      processCsvImport({ tenantId, jobId }).catch((e) =>
        logger.error({ err: e }, 'Inline CSV import failed'),
      ),
    );
  }
}
