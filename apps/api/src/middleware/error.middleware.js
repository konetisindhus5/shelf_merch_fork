import { ApiError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { code: err.code ?? 'ERROR', message: err.message, details: err.details },
    });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Malformed id' } });
  }
  if (err?.code === 11000) {
    return res.status(409).json({
      error: { code: 'DUPLICATE', message: 'A record with this value already exists' },
    });
  }

  logger.error({ err, path: req.originalUrl }, 'Unhandled error');
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal server error' } });
}
