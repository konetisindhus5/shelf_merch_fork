import mongoose from 'mongoose';
import { Tenant } from './tenant.model.js';
import { inviteUser } from '../users/users.service.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

/** Platform-only: create tenant + first company_admin (invited). */
export async function createTenant({ name, slug, adminName, adminEmail, gstin = '', currency = 'INR' }) {
  const existing = await Tenant.findOne({ slug: slug.toLowerCase() });
  if (existing) throw new ConflictError(`Slug "${slug}" is already taken`);

  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const [tenant] = await Tenant.create([{ name, slug, gstin, currency }], { session });
      const { user, inviteToken } = await inviteUser(
        {
          tenantId: tenant._id,
          name: adminName,
          email: adminEmail,
          role: 'company_admin',
          scopeType: 'tenant',
        },
        session,
      );
      result = { tenant, admin: user, inviteToken };
    });
    return result;
  } finally {
    await session.endSession();
  }
}

export async function getTenant(tenantId) {
  const tenant = await Tenant.findOne({ _id: tenantId });
  if (!tenant) throw new NotFoundError('Tenant not found');
  return tenant;
}

export async function updateTenant(tenantId, patch) {
  const before = await getTenant(tenantId);
  const after = await Tenant.findOneAndUpdate({ _id: tenantId }, patch, { new: true });
  return { before: before.toObject(), after };
}

export async function listTenants({ status } = {}) {
  const filter = status ? { status } : {};
  return Tenant.find(filter).sort({ createdAt: -1 });
}

export async function setTenantStatus(tenantId, status) {
  const before = await getTenant(tenantId);
  before.status = status; // simple enum, not a state machine per spec
  await before.save();
  return before;
}
