import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Verifies the access JWT and attaches req.user with the roleAssignment
 * snapshot baked into the token (§6.2).
 */
export function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new UnauthorizedError('Missing access token'));

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = {
      userId: payload.sub,
      tenantId: payload.tenantId ?? null,
      role: payload.role,
      scopeType: payload.scopeType,
      scopeId: payload.scopeId ?? null,
      assignedEntityIds: payload.assignedEntityIds ?? [],
    };
    req.impersonation = payload.impersonation ?? { isImpersonating: false, originalUserId: null };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token'));
  }
}
