import { z } from 'zod';

const address = z
  .object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  })
  .partial();

export const createTenantSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, digits, hyphens'),
  adminName: z.string().min(1),
  adminEmail: z.string().email(),
  gstin: z.string().optional().default(''),
  currency: z.string().optional().default('INR'),
});

export const updateTenantSchema = z
  .object({
    name: z.string().min(1),
    logoUrl: z.string(),
    gstin: z.string(),
    billingAddress: address,
  })
  .partial();

export const tenantStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'trial']),
});
