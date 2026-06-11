import * as authService from './auth.service.js';
import { writeAudit } from '../../services/audit.service.js';

export async function register(req, res) {
  const result = await authService.register({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers['user-agent'] ?? '',
  });
  writeAudit({
    req: { ...req, user: { userId: result.user.id, role: result.user.role }, tenantId: result.user.tenantId },
    action: 'auth.register',
    entityType: 'User',
    entityId: result.user.id,
  });
  res.status(201).json(result);
}

export async function login(req, res) {
  const result = await authService.login({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers['user-agent'] ?? '',
  });
  writeAudit({
    req: { ...req, user: { userId: result.user.id, role: result.user.role }, tenantId: result.user.tenantId },
    action: 'auth.login',
    entityType: 'User',
    entityId: result.user.id,
  });
  res.json(result);
}

export async function refresh(req, res) {
  const result = await authService.refresh({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers['user-agent'] ?? '',
  });
  res.json(result);
}

export async function logout(req, res) {
  await authService.logout({ ...req.body, userId: req.user?.userId });
  res.json({ success: true });
}

export async function forgotPassword(req, res) {
  await authService.forgotPassword(req.body);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
}

export async function resetPassword(req, res) {
  await authService.resetPassword(req.body);
  res.json({ success: true });
}
