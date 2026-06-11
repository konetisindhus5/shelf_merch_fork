import { parse } from 'csv-parse/sync';
import { Contact } from '../contacts/contact.model.js';
import { ImportJob } from './importJob.model.js';
import { ImportMapping, DEFAULT_MAPPING } from './importMapping.model.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * §7.7 CSV import worker logic. Pure function of (tenantId, jobId) so it can
 * run from the BullMQ worker process or inline as a fallback.
 */
export async function processCsvImport({ tenantId, jobId }) {
  const job = await ImportJob.findOne({ _id: jobId, tenantId }).select('+csv');
  if (!job) throw new Error(`Import job ${jobId} not found`);

  job.status = 'processing';
  await job.save();

  try {
    const mappingDoc = await ImportMapping.findOne({ tenantId, source: 'csv' });
    const mapping = mappingDoc?.mapping ?? DEFAULT_MAPPING;

    const rows = parse(job.csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    const errors = [];
    const seenEmails = new Set();
    let validCount = 0;

    for (const [index, row] of rows.entries()) {
      const rowNum = index + 2; // 1-based + header row
      const name = row[mapping.name]?.trim();
      const email = row[mapping.email]?.trim().toLowerCase();

      if (!name) {
        errors.push({ row: rowNum, message: 'Missing name' });
        continue;
      }
      if (!email || !EMAIL_RE.test(email)) {
        errors.push({ row: rowNum, message: `Invalid email "${email ?? ''}"` });
        continue;
      }
      if (seenEmails.has(email)) {
        errors.push({ row: rowNum, message: `Duplicate email "${email}" within file — skipped` });
        continue;
      }
      seenEmails.add(email);

      await Contact.updateOne(
        { tenantId, email },
        {
          $set: {
            name,
            phone: row[mapping.phone]?.trim() ?? '',
            department: row[mapping.department]?.trim() ?? '',
            employeeCode: row[mapping.employeeCode]?.trim() ?? '',
            source: 'csv',
          },
          $setOnInsert: { tenantId, email },
        },
        { upsert: true },
      );
      validCount += 1;
    }

    job.totalRows = rows.length;
    job.validCount = validCount;
    job.errorCount = errors.length;
    job.errors = errors.slice(0, 100); // cap stored errors
    job.status = 'done';
    job.csv = undefined;
    await job.save();

    if (mappingDoc) {
      mappingDoc.lastImportAt = new Date();
      await mappingDoc.save();
    }
    return job;
  } catch (err) {
    job.status = 'failed';
    job.errors = [{ row: 0, message: err.message }];
    await job.save();
    throw err;
  }
}
