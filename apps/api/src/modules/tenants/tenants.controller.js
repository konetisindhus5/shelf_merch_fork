import * as tenantsService from './tenants.service.js';
import { signAccessToken } from '../auth/auth.service.js';
import { writeAudit } from '../../services/audit.service.js';
import { ForbiddenError } from '../../utils/errors.js';
import { env } from '../../config/env.js';

const IMPERSONATION_TTL = '15m';

export async function create(req, res) {
  const { tenant, admin, inviteToken } = await tenantsService.createTenant(req.body);
  writeAudit({ req, action: 'tenant.create', entityType: 'Tenant', entityId: tenant._id, after: tenant.toObject() });
  res.status(201).json({
    tenant,
    admin: { id: String(admin._id), email: admin.email, status: admin.status },
    ...(env.NODE_ENV !== 'production' ? { inviteToken } : {}),
  });
}

export async function me(req, res) {
  res.json(await tenantsService.getTenant(req.tenantId));
}

export async function updateMe(req, res) {
  const { before, after } = await tenantsService.updateTenant(req.tenantId, req.body);
  writeAudit({ req, action: 'tenant.update', entityType: 'Tenant', entityId: req.tenantId, before, after: after.toObject() });
  res.json(after);
}

export async function list(req, res) {
  res.json(await tenantsService.listTenants({ status: req.query.status }));
}

export async function getOne(req, res) {
  res.json(await tenantsService.getTenant(req.params.id));
}

export async function setStatus(req, res) {
  const tenant = await tenantsService.setTenantStatus(req.params.id, req.body.status);
  writeAudit({ req, action: 'tenant.set_status', entityType: 'Tenant', entityId: tenant._id, after: { status: tenant.status } });
  res.json(tenant);
}

/** §6.4 — start impersonation: issue a 15-min token scoped to the target tenant. */
export async function impersonate(req, res) {
  const tenant = await tenantsService.getTenant(req.params.tenantId);

  const impersonation = { isImpersonating: true, originalUserId: req.user.userId };
  const accessToken = signAccessToken(
    { _id: req.user.userId },
    {
      tenantId: tenant._id,
      role: req.user.role,
      scopeType: 'platform',
      scopeId: null,
      assignedEntityIds: [],
    },
    impersonation,
    { expiresIn: IMPERSONATION_TTL },
  );

  writeAudit({
    req,
    action: 'impersonation.start',
    entityType: 'Tenant',
    entityId: tenant._id,
    after: { reason: req.body.reason, reasonCategory: req.body.reasonCategory },
  });

  res.json({
    accessToken,
    expiresIn: IMPERSONATION_TTL,
    tenant: { id: String(tenant._id), name: tenant.name, slug: tenant.slug },
  });
}

/** §6.4 — end impersonation. Access tokens are stateless, so this is an
 *  audited acknowledgement; the short-lived token expires on its own. */
export async function endImpersonation(req, res) {
  if (!req.impersonation?.isImpersonating) {
    throw new ForbiddenError('Not currently impersonating');
  }
  writeAudit({ req, action: 'impersonation.end', entityType: 'Tenant', entityId: req.tenantId });
  res.json({ ok: true });
}
