import { ForbiddenError } from '../utils/errors.js';

/** §6.3 RBAC — what can this role do? */
export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return next(new ForbiddenError(`Requires one of roles: ${allowedRoles.join(', ')}`));
    }
    next();
  };
}
