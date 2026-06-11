import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, requireTenantContext } from '../../middleware/tenant.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { requireScope } from '../../middleware/abac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './entities.controller.js';
import {
  createEntitySchema,
  updateEntitySchema,
  assignManagerSchema,
  entityIdParams,
  listEntitiesQuery,
} from './entities.validation.js';

const router = Router();

router.use(authenticate, resolveTenant, requireTenantContext);

const adminOnly = requireRole('company_admin', 'platform_super_admin');
const canRead = requireRole('company_admin', 'entity_manager', 'platform_super_admin');
const entityScope = requireScope((req) => req.params.id); // ABAC on /:id routes

router.get('/', canRead, validate({ query: listEntitiesQuery }), asyncHandler(controller.list));
router.post('/', adminOnly, validate({ body: createEntitySchema }), asyncHandler(controller.create));
router.get('/:id', canRead, entityScope, validate({ params: entityIdParams }), asyncHandler(controller.getOne));
router.patch(
  '/:id',
  adminOnly,
  validate({ params: entityIdParams, body: updateEntitySchema }),
  asyncHandler(controller.update),
);
router.delete('/:id', adminOnly, validate({ params: entityIdParams }), asyncHandler(controller.remove));
router.post(
  '/:id/assign-manager',
  adminOnly,
  validate({ params: entityIdParams, body: assignManagerSchema }),
  asyncHandler(controller.assignManager),
);

export default router;
