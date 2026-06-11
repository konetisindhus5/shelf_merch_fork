import { Worker } from 'bullmq';
import { getRedis } from '../config/redis.js';
import { logger } from '../config/logger.js';
import { processCsvImport } from '../modules/imports/imports.service.js';

export function startCsvImportWorker() {
  const worker = new Worker(
    'csv-import',
    async (job) => {
      logger.info({ jobId: job.data.jobId }, 'CSV import started');
      await processCsvImport(job.data);
      logger.info({ jobId: job.data.jobId }, 'CSV import finished');
    },
    { connection: getRedis(), concurrency: 2 },
  );
  worker.on('failed', (job, err) => logger.error({ jobId: job?.data?.jobId, err }, 'CSV import failed'));
  return worker;
}
