import * as usersService from './users.service.js';
import { writeAudit } from '../../services/audit.service.js';
import { env } from '../../config/env.js';

export async function invite(req, res) {
  const { user, inviteToken } = await usersService.inviteUser({ tenantId: req.tenantId, ...req.body });
  writeAudit({ req, action: 'user.invite', entityType: 'User', entityId: user._id, after: { email: user.email, role: req.body.role } });
  res.status(201).json({
    id: String(user._id),
    email: user.email,
    status: user.status,
    // Exposed in non-production so the flow is testable before email lands in Phase 7.
    ...(env.NODE_ENV !== 'production' ? { inviteToken } : {}),
  });
}

export async function acceptInvite(req, res) {
  const user = await usersService.acceptInvite(req.body);
  writeAudit({
    req: { ...req, tenantId: user.tenantId, user: { userId: user._id, role: '' } },
    action: 'user.accept_invite',
    entityType: 'User',
    entityId: user._id,
  });
  res.json({ success: true, email: user.email });
}

export async function list(req, res) {
  res.json(await usersService.listUsers({ tenantId: req.tenantId }));
}

export async function changeRole(req, res) {
  const { before, after } = await usersService.changeRole({
    tenantId: req.tenantId,
    userId: req.params.id,
    ...req.body,
  });
  writeAudit({ req, action: 'user.change_role', entityType: 'RoleAssignment', entityId: after._id, before, after });
  res.json({ success: true, role: after.role, scopeType: after.scopeType });
}
