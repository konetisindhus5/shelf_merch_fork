import { Notification } from './notification.model.js';
import { getNotificationQueue } from '../../jobs/queues.js';
import { ensureRedisReady } from '../../config/redis.js';
import { logger } from '../../config/logger.js';
import { sendSms } from '../../services/msg91.service.js';

/**
 * §7.12 — delivery handler used by the notification worker.
 * In-app: writes a Notification doc. Email: stub until a provider is configured.
 * SMS: MSG91 when credentials are set; otherwise structured logs (tests/dev).
 */

export async function deliverNotification({
  type,
  tenantId = null,
  userId = null,
  email = null,
  phone = null,
  title,
  body = '',
  link = '',
}) {
  if (userId) {
    await Notification.create({ tenantId, userId, type, title, body, link });
  }
  if (email) {
    logger.info({ to: email, type, title, link }, 'EMAIL (stub — configure EMAIL_PROVIDER_API_KEY for production)');
  }
  if (phone) {
    const message = [title, body, link].filter(Boolean).join(' — ');
    await sendSms(phone, message);
  }
}

/** Enqueue, falling back to immediate delivery when Redis is down. */
export async function notify(payload) {
  try {
    if (!(await ensureRedisReady())) throw new Error('Redis not ready');
    await getNotificationQueue().add(payload.type, payload);
  } catch {
    await deliverNotification(payload).catch((err) =>
      logger.error({ err }, 'Direct notification delivery failed'),
    );
  }
}
