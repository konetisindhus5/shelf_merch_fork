import { ForbiddenError } from '../utils/errors.js';
import { PLATFORM_ROLES } from '../modules/roles/roleAssignment.model.js';

/**
 * Sets req.tenantId for every downstream query (§6.3).
 * - Tenant users: always their own tenantId — header overrides are ignored.
 * - Platform users: tenantId comes from an impersonation token (preferred,
 *   §6.4) — the impersonated tenantId is baked into the JWT itself.
 */
export function resolveTenant(req, _res, next) {
  const isPlatform = PLATFORM_ROLES.includes(req.user.role);

  if (!isPlatform) {
    if (!req.user.tenantId) {
      return next(new ForbiddenError('User has no tenant'));
    }
    req.tenantId = req.user.tenantId;
    return next();
  }

  // Platform user: tenant context only exists while impersonating.
  req.tenantId = req.user.tenantId ?? null;
  next();
}

/** For tenant-scoped routes that platform users may not hit without impersonating. */
export function requireTenantContext(req, _res, next) {
  if (!req.tenantId) {
    return next(new ForbiddenError('This route requires a tenant context'));
  }
  next();
}

/** §6.4 — sensitive actions are disabled while impersonating. */
export function blockDuringImpersonation(req, _res, next) {
  if (req.impersonation?.isImpersonating) {
    return next(new ForbiddenError('Disabled during impersonation'));
  }
  next();
}
