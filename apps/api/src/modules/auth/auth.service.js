import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { User } from '../users/user.model.js';
import { RoleAssignment } from '../roles/roleAssignment.model.js';
import { RefreshToken } from './refreshToken.model.js';
import { ApiError, UnauthorizedError } from '../../utils/errors.js';

const BCRYPT_ROUNDS = 12;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const hashPassword = (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function signAccessToken(user, roleAssignment, impersonation = null) {
  const payload = {
    sub: String(user._id),
    tenantId: roleAssignment.tenantId ? String(roleAssignment.tenantId) : null,
    role: roleAssignment.role,
    scopeType: roleAssignment.scopeType,
    scopeId: roleAssignment.scopeId ? String(roleAssignment.scopeId) : null,
    assignedEntityIds: (roleAssignment.assignedEntityIds ?? []).map(String),
    ...(impersonation ? { impersonation } : {}),
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
}

async function issueRefreshToken(userId, { ip = '', userAgent = '' } = {}) {
  const token = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({
    userId,
    tokenHash: sha256(token),
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });
  return token;
}

export async function getPrimaryRoleAssignment(userId) {
  const assignment = await RoleAssignment.findOne({ userId }).sort({ createdAt: 1 });
  if (!assignment) throw new ApiError(403, 'User has no role assignment', 'NO_ROLE');
  return assignment;
}

function publicUser(user, roleAssignment) {
  return {
    id: String(user._id),
    tenantId: user.tenantId ? String(user.tenantId) : null,
    name: user.name,
    email: user.email,
    role: roleAssignment.role,
    scopeType: roleAssignment.scopeType,
    assignedEntityIds: (roleAssignment.assignedEntityIds ?? []).map(String),
  };
}

export async function login({ email, password, ip, userAgent }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.passwordHash) throw new UnauthorizedError('Invalid email or password');
  if (user.status === 'suspended') throw new UnauthorizedError('Account suspended');
  if (user.status === 'invited') {
    throw new ApiError(403, 'Invite not yet accepted — set your password first', 'INVITE_PENDING');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Invalid email or password');

  const roleAssignment = await getPrimaryRoleAssignment(user._id);
  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken: signAccessToken(user, roleAssignment),
    refreshToken: await issueRefreshToken(user._id, { ip, userAgent }),
    user: publicUser(user, roleAssignment),
  };
}

export async function refresh({ refreshToken, ip, userAgent }) {
  const stored = await RefreshToken.findOne({ tokenHash: sha256(refreshToken) });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const user = await User.findOne({ _id: stored.userId });
  if (!user || user.status !== 'active') throw new UnauthorizedError('Invalid refresh token');

  // Rotate: revoke the old token, issue a new pair.
  stored.revokedAt = new Date();
  await stored.save();

  const roleAssignment = await getPrimaryRoleAssignment(user._id);
  return {
    accessToken: signAccessToken(user, roleAssignment),
    refreshToken: await issueRefreshToken(user._id, { ip, userAgent }),
    user: publicUser(user, roleAssignment),
  };
}

export async function logout({ refreshToken, everywhere = false, userId = null }) {
  if (everywhere && userId) {
    await RefreshToken.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() });
    return;
  }
  if (refreshToken) {
    await RefreshToken.updateOne({ tokenHash: sha256(refreshToken) }, { revokedAt: new Date() });
  }
}

export async function forgotPassword({ email }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  // Always behave identically whether or not the email exists.
  if (!user) return;

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = sha256(token);
  user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // MVP: email provider lands in Phase 7 — log the link for now.
  logger.info({ email: user.email, resetToken: token }, 'Password reset requested (email stub)');
}

export async function resetPassword({ token, newPassword }) {
  const user = await User.findOne({
    passwordResetTokenHash: sha256(token),
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordResetTokenHash');
  if (!user) throw new ApiError(400, 'Invalid or expired reset token', 'INVALID_RESET_TOKEN');

  user.passwordHash = await hashPassword(newPassword);
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  await user.save();
  await logout({ everywhere: true, userId: user._id });
}
