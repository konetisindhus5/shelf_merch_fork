import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, requireTenantContext } from '../../middleware/tenant.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { requireScope } from '../../middleware/abac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { idempotency } from '../../middleware/idempotency.middleware.js';
import * as controller from './campaigns.controller.js';
import {
  createCampaignSchema,
  updateCampaignSchema,
  importRecipientsSchema,
  allocateCreditsSchema,
  campaignIdParams,
} from './campaigns.validation.js';
import { Campaign } from './campaign.model.js';

const router = Router();
router.use(authenticate, resolveTenant, requireTenantContext);

const canManage = requireRole('company_admin', 'entity_manager', 'platform_super_admin');
const entityScope = requireScope(async (req) => {
  const c = await Campaign.findOne({ _id: req.params.id, tenantId: req.tenantId }).select('entityId');
  return c?.entityId ?? null;
});

router.get('/', canManage, asyncHandler(controller.list));
router.post('/', canManage, validate({ body: createCampaignSchema }), asyncHandler(controller.create));
router.get('/:id', canManage, entityScope, validate({ params: campaignIdParams }), asyncHandler(controller.getOne));
router.patch(
  '/:id',
  canManage,
  entityScope,
  validate({ params: campaignIdParams, body: updateCampaignSchema }),
  asyncHandler(controller.update),
);
router.post(
  '/:id/recipients/import',
  canManage,
  entityScope,
  validate({ params: campaignIdParams, body: importRecipientsSchema }),
  asyncHandler(controller.importRecipients),
);
router.post(
  '/:id/allocate-credits',
  canManage,
  entityScope,
  validate({ params: campaignIdParams, body: allocateCreditsSchema }),
  asyncHandler(controller.allocateCredits),
);
router.post(
  '/:id/launch',
  canManage,
  entityScope,
  idempotency({ required: true }),
  validate({ params: campaignIdParams }),
  asyncHandler(controller.launch),
);
router.post(
  '/:id/close',
  canManage,
  entityScope,
  validate({ params: campaignIdParams }),
  asyncHandler(controller.close),
);
router.get(
  '/:id/report',
  canManage,
  entityScope,
  validate({ params: campaignIdParams }),
  asyncHandler(controller.report),
);

export default router;
