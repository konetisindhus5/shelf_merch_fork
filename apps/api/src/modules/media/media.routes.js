import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { env } from '../../config/env.js';
import { LOCAL_UPLOAD_DIR } from '../../services/storage.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function allowedRemotePrefixes() {
  const bucket = env.S3_BUCKET_NAME;
  const region = env.AWS_REGION;
  const prefixes = [];
  if (bucket && region) {
    prefixes.push(`https://s3.${region}.amazonaws.com/${bucket}/`);
    prefixes.push(`https://${bucket}.s3.${region}.amazonaws.com/`);
  }
  if (env.S3_PUBLIC_BASE_URL) {
    prefixes.push(`${env.S3_PUBLIC_BASE_URL.replace(/\/$/, '')}/`);
  }
  if (env.R2_ENDPOINT && env.R2_BUCKET) {
    prefixes.push(`${env.R2_ENDPOINT.replace(/\/$/, '')}/${env.R2_BUCKET}/`);
  }
  return prefixes;
}

function isAllowedRemoteUrl(raw) {
  return allowedRemotePrefixes().some((prefix) => raw.startsWith(prefix));
}

const router = Router();

/** Same-origin proxy so the browser can canvas-tint remote mask PNGs (S3/R2). */
router.get(
  '/proxy',
  asyncHandler(async (req, res) => {
    const raw = req.query.url;
    if (!raw || typeof raw !== 'string') throw new ApiError(400, 'url query param required', 'URL_REQUIRED');

    if (raw.startsWith('/uploads/')) {
      const rel = raw.slice('/uploads/'.length).replaceAll('/', path.sep);
      const file = path.normalize(path.join(LOCAL_UPLOAD_DIR, rel));
      if (!file.startsWith(LOCAL_UPLOAD_DIR)) throw new ApiError(403, 'path not allowed', 'PATH_DENIED');
      const buf = await fs.readFile(file);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(buf);
    }

    let target;
    try {
      target = new URL(raw);
    } catch {
      throw new ApiError(400, 'invalid url', 'INVALID_URL');
    }
    if (!['http:', 'https:'].includes(target.protocol) || !isAllowedRemoteUrl(raw)) {
      throw new ApiError(403, 'url not allowed', 'URL_DENIED');
    }

    const upstream = await fetch(raw);
    if (!upstream.ok) throw new ApiError(502, 'upstream fetch failed', 'UPSTREAM_ERROR');
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buf);
  }),
);

export default router;
