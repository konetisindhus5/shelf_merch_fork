import * as tenantsService from './tenants.service.js';
import { writeAudit } from '../../services/audit.service.js';
import { env } from '../../config/env.js';

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
