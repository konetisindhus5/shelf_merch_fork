import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { resolveTenant, requireTenantContext } from '../../middleware/tenant.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { objectId } from '../users/users.validation.js';
import * as invoicesService from './invoices.service.js';

const router = Router();

router.use(authenticate, resolveTenant, requireTenantContext);
const canRead = requireRole('company_admin', 'platform_finance_admin', 'platform_super_admin');

router.get(
  '/',
  canRead,
  validate({
    query: z.object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    res.json(await invoicesService.listInvoices({ tenantId: req.tenantId, query: req.query }));
  }),
);

router.get(
  '/:id/pdf',
  canRead,
  validate({ params: z.object({ id: objectId }) }),
  asyncHandler(async (req, res) => {
    await invoicesService.streamInvoicePdf({
      tenantId: req.tenantId,
      invoiceId: req.params.id,
      res,
    });
  }),
);

router.get(
  '/:id',
  canRead,
  validate({ params: z.object({ id: objectId }) }),
  asyncHandler(async (req, res) => {
    res.json(await invoicesService.getInvoice({ tenantId: req.tenantId, invoiceId: req.params.id }));
  }),
);

export default router;
