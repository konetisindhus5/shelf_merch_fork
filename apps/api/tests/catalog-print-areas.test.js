import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { connectTestDb, clearTestDb, disconnectTestDb } from './setup.js';
import { createApp } from '../src/app.js';
import { Tenant } from '../src/modules/tenants/tenant.model.js';
import { User } from '../src/modules/users/user.model.js';
import { RoleAssignment } from '../src/modules/roles/roleAssignment.model.js';
import { CatalogProduct } from '../src/modules/catalog/catalogProduct.model.js';
import { signAccessToken } from '../src/modules/auth/auth.service.js';

let app;
let catalogToken;
let supportToken;
let product;

async function makeUser(tenantDoc, role, scopeType) {
  const user = await User.create({
    tenantId: tenantDoc?._id ?? null,
    name: `${role} user`,
    email: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.io`,
    status: 'active',
  });
  const assignment = await RoleAssignment.create({
    tenantId: tenantDoc?._id ?? null,
    userId: user._id,
    role,
    scopeType,
  });
  return signAccessToken(user, assignment);
}

beforeAll(async () => {
  await connectTestDb();
  app = createApp();
});
afterAll(disconnectTestDb);

beforeEach(async () => {
  await clearTestDb();
  catalogToken = await makeUser(null, 'platform_catalog_admin', 'platform');
  const tenant = await Tenant.create({ name: 'Rubix', slug: 'rubix' });
  supportToken = await makeUser(tenant, 'company_admin', 'tenant');
  product = await CatalogProduct.create({
    sku: `SM-TEE-${Date.now()}`,
    name: 'Core Cotton Tee',
    category: 'Apparel',
    basePriceInr: 499,
  });
});

const area = (over = {}) => ({
  key: 'front',
  label: 'Front',
  mockupImageUrl: '/uploads/platform/product/abc.png',
  box: { xPct: 25, yPct: 30, widthPct: 50, heightPct: 40 },
  maxWidthCm: 28,
  maxHeightCm: 35,
  dpi: 300,
  methods: ['dtf', 'screen_print'],
  ...over,
});

describe('platform product print areas (POD placeholders)', () => {
  it('saves print-area geometry and derives printableAreas from labels', async () => {
    const res = await request(app)
      .put(`/api/v1/platform/products/${product._id}/print-areas`)
      .set('Authorization', `Bearer ${catalogToken}`)
      .send({ printAreas: [area(), area({ key: 'back', label: 'Back' })] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].box.widthPct).toBe(50);

    const reloaded = await CatalogProduct.findById(product._id);
    expect(reloaded.printAreas).toHaveLength(2);
    expect(reloaded.printableAreas).toEqual(['Front', 'Back']);
  });

  it('rejects out-of-range box percentages (400 validation)', async () => {
    const res = await request(app)
      .put(`/api/v1/platform/products/${product._id}/print-areas`)
      .set('Authorization', `Bearer ${catalogToken}`)
      .send({ printAreas: [area({ box: { xPct: 10, yPct: 10, widthPct: 150, heightPct: 40 } })] });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('forbids a tenant role from writing print areas (403)', async () => {
    const res = await request(app)
      .put(`/api/v1/platform/products/${product._id}/print-areas`)
      .set('Authorization', `Bearer ${supportToken}`)
      .send({ printAreas: [area()] });
    expect(res.status).toBe(403);
  });
});
