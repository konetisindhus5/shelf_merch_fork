import mongoose from 'mongoose';

// Not tenant-guard-scoped: platform actions may have tenantId null, and the
// platform audit viewer queries across tenants.
const auditLogSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true },
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actorRole: { type: String, default: '' },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    before: { type: Object, default: null },
    after: { type: Object, default: null },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    impersonation: {
      isImpersonating: { type: Boolean, default: false },
      originalUserId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ tenantId: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
