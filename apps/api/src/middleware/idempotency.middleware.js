import { IdempotencyKey } from '../modules/system/idempotencyKey.model.js';
import { ApiError } from '../utils/errors.js';

/**
 * §3.5 — replayed Idempotency-Key returns the cached response instead of
 * re-executing. Keys are scoped per tenant+user. A concurrent duplicate
 * request (key reserved but response not yet stored) gets a 409.
 */
export function idempotency({ required = false } = {}) {
  return async (req, res, next) => {
    const key = req.headers['idempotency-key'];
    if (!key) {
      if (required) {
        return next(new ApiError(400, 'Idempotency-Key header is required', 'IDEMPOTENCY_KEY_REQUIRED'));
      }
      return next();
    }

    const scope = { key, tenantId: req.tenantId ?? null, userId: req.user?.userId ?? null };

    const existing = await IdempotencyKey.findOne(scope);
    if (existing) {
      if (existing.response === null) {
        return next(new ApiError(409, 'Request with this Idempotency-Key is still in progress', 'IDEMPOTENT_REPLAY_IN_FLIGHT'));
      }
      res.set('Idempotent-Replay', 'true');
      return res.status(existing.statusCode).json(existing.response);
    }

    try {
      await IdempotencyKey.create({ ...scope, method: req.method, path: req.originalUrl });
    } catch (err) {
      if (err.code === 11000) {
        return next(new ApiError(409, 'Duplicate request in flight', 'IDEMPOTENT_REPLAY_IN_FLIGHT'));
      }
      return next(err);
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      // Cache only successful outcomes; failures may be retried with the same key.
      if (res.statusCode < 400) {
        IdempotencyKey.updateOne(scope, { statusCode: res.statusCode, response: payload }).catch(() => {});
      } else {
        IdempotencyKey.deleteOne(scope).catch(() => {});
      }
      return originalJson(payload);
    };
    next();
  };
}
