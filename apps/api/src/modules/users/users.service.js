import crypto from 'node:crypto';
import { User } from './user.model.js';
import { RoleAssignment } from '../roles/roleAssignment.model.js';
import { hashPassword } from '../auth/auth.service.js';
import { ApiError, ConflictError, NotFoundError } from '../../utils/errors.js';
import { logger } from '../../config/logger.js';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Creates an invited user + role assignment and returns the invite token.
 * Reused by /users/invite and /entities/:id/assign-manager.
 */
export async function inviteUser(
  { tenantId, name, email, phone = '', role, scopeType = 'tenant', scopeId = null, assignedEntityIds = [] },
  session = null,
) {
  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail }).session(session);

  if (user && String(user.tenantId) !== String(tenantId)) {
    throw new ConflictError('This email is already registered to another workspace');
  }

  const inviteToken = crypto.randomBytes(32).toString('hex');

  if (!user) {
    [user] = await User.create(
      [
        {
          tenantId,
          name,
          email: normalizedEmail,
          phone,
          status: 'invited',
          inviteTokenHash: sha256(inviteToken),
          inviteTokenExpiresAt: new Date(Date.now() + INVITE_TTL_MS),
        },
      ],
      session ? { session } : {},
    );
  } else if (user.status === 'invited') {
    user.inviteTokenHash = sha256(inviteToken);
    user.inviteTokenExpiresAt = new Date(Date.now() + INVITE_TTL_MS);
    await user.save({ session });
  }

  const existingAssignment = await RoleAssignment.findOne({ userId: user._id, tenantId }).session(session);
  if (!existingAssignment) {
    await RoleAssignment.create(
      [{ tenantId, userId: user._id, role, scopeType, scopeId, assignedEntityIds }],
      session ? { session } : {},
    );
  } else if (scopeType === 'entity' && scopeId) {
    // Entity manager picking up another department.
    if (!existingAssignment.assignedEntityIds.map(String).includes(String(scopeId))) {
      existingAssignment.assignedEntityIds.push(scopeId);
      await existingAssignment.save({ session });
    }
  }

  // MVP email stub (Phase 7 wires a real provider).
  logger.info({ email: normalizedEmail, inviteToken }, 'User invited (email stub)');

  return { user, inviteToken };
}

export async function acceptInvite({ token, password }) {
  const user = await User.findOne({
    inviteTokenHash: sha256(token),
    inviteTokenExpiresAt: { $gt: new Date() },
    status: 'invited',
  }).select('+inviteTokenHash');
  if (!user) throw new ApiError(400, 'Invalid or expired invite token', 'INVALID_INVITE_TOKEN');

  user.passwordHash = await hashPassword(password);
  user.status = 'active';
  user.inviteTokenHash = null;
  user.inviteTokenExpiresAt = null;
  await user.save();

  const { Entity } = await import('../entities/entity.model.js');
  await Entity.updateMany(
    { tenantId: user.tenantId, managerUserId: user._id },
    { managerInvitePending: false },
  );

  return user;
}

export async function listUsers({ tenantId }) {
  const users = await User.find({ tenantId }).sort({ createdAt: 1 }).lean();
  const assignments = await RoleAssignment.find({ tenantId }).lean();
  const byUser = new Map(assignments.map((a) => [String(a.userId), a]));
  return users.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    status: u.status,
    lastLoginAt: u.lastLoginAt,
    role: byUser.get(String(u._id))?.role ?? null,
    scopeType: byUser.get(String(u._id))?.scopeType ?? null,
    assignedEntityIds: (byUser.get(String(u._id))?.assignedEntityIds ?? []).map(String),
  }));
}

export async function changeRole({ tenantId, userId, role, scopeType, scopeId = null, assignedEntityIds = [] }) {
  const user = await User.findOne({ _id: userId, tenantId });
  if (!user) throw new NotFoundError('User not found');

  const before = await RoleAssignment.findOne({ userId, tenantId }).lean();
  const after = await RoleAssignment.findOneAndUpdate(
    { userId, tenantId },
    { role, scopeType, scopeId, assignedEntityIds },
    { new: true, upsert: true },
  ).lean();

  return { before, after };
}
