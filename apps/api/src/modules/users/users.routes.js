import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, requireTenantContext, blockDuringImpersonation } from '../../middleware/tenant.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './users.controller.js';
import { inviteUserSchema, acceptInviteSchema, changeRoleSchema, objectId } from './users.validation.js';
import { z } from 'zod';

const router = Router();

// Public — invited user sets their password.
router.post('/accept-invite', validate({ body: acceptInviteSchema }), asyncHandler(controller.acceptInvite));

router.use(authenticate, resolveTenant, requireTenantContext);

router.get('/', requireRole('company_admin', 'platform_super_admin'), asyncHandler(controller.list));
router.post(
  '/invite',
  requireRole('company_admin', 'platform_super_admin'),
  validate({ body: inviteUserSchema }),
  asyncHandler(controller.invite),
);
router.patch(
  '/:id/role',
  requireRole('company_admin'),
  blockDuringImpersonation, // §6.4 — role changes are blocked while impersonating
  validate({ params: z.object({ id: objectId }), body: changeRoleSchema }),
  asyncHandler(controller.changeRole),
);

export default router;
