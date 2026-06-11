import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, requireTenantContext } from '../../middleware/tenant.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { objectId } from '../users/users.validation.js';
import * as controller from './tenants.controller.js';
import { createTenantSchema, updateTenantSchema, tenantStatusSchema } from './tenants.validation.js';

// Tenant-facing routes: /api/v1/tenants
export const tenantsRouter = Router();
tenantsRouter.use(authenticate, resolveTenant);

tenantsRouter.post(
  '/',
  requireRole('platform_super_admin'),
  validate({ body: createTenantSchema }),
  asyncHandler(controller.create),
);
tenantsRouter.get('/me', requireTenantContext, asyncHandler(controller.me));
tenantsRouter.patch(
  '/me',
  requireTenantContext,
  requireRole('company_admin'),
  validate({ body: updateTenantSchema }),
  asyncHandler(controller.updateMe),
);

// Platform control plane: /api/v1/platform/tenants
export const platformTenantsRouter = Router();
platformTenantsRouter.use(authenticate, resolveTenant, requireRole('platform_super_admin', 'platform_support_agent', 'platform_readonly_auditor'));

platformTenantsRouter.get('/', asyncHandler(controller.list));
platformTenantsRouter.get('/:id', validate({ params: z.object({ id: objectId }) }), asyncHandler(controller.getOne));
platformTenantsRouter.patch(
  '/:id/status',
  requireRole('platform_super_admin'),
  validate({ params: z.object({ id: objectId }), body: tenantStatusSchema }),
  asyncHandler(controller.setStatus),
);
