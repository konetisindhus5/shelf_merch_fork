import mongoose from 'mongoose';
import { softDeletePlugin } from '../../plugins/softDelete.plugin.js';

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'IN' },
  },
  { _id: false },
);

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    gstin: { type: String, default: '' },
    billingAddress: { type: addressSchema, default: () => ({}) },
    status: { type: String, enum: ['active', 'suspended', 'trial'], default: 'trial' },
  },
  { timestamps: true },
);

tenantSchema.plugin(softDeletePlugin);

export const Tenant = mongoose.model('Tenant', tenantSchema);
