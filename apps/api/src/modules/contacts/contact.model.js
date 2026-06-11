import mongoose from 'mongoose';
import { tenantScopePlugin } from '../../plugins/tenantScope.plugin.js';
import { softDeletePlugin } from '../../plugins/softDelete.plugin.js';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Sender', 'Member', 'Non-Member'],
      default: 'Member',
    },
    department: { type: String, default: '' },
    employeeCode: { type: String, default: '' },
    source: { type: String, enum: ['manual', 'csv', 'hris'], default: 'manual' },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'IN' },
    },
  },
  { timestamps: true },
);

contactSchema.plugin(tenantScopePlugin);
contactSchema.plugin(softDeletePlugin);
contactSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const Contact = mongoose.model('Contact', contactSchema);
