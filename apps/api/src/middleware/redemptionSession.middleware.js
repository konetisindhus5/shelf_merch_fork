import { Recipient } from '../modules/campaigns/recipient.model.js';
import { verifyRedemptionSession } from '../modules/redemptions/redemptions.service.js';
import { ApiError, UnauthorizedError } from '../utils/errors.js';

/**
 * Phase 5 — after OTP verify, catalog/submit require the short-lived session JWT.
 * Ensures the Bearer token belongs to the recipient for this redemption link.
 */
export async function requireRedemptionSession(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const sessionToken = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!sessionToken) return next(new UnauthorizedError('Redemption session token required'));

    const payload = verifyRedemptionSession(sessionToken);
    const recipient = await Recipient.findOne({ redemptionToken: req.params.token }).setOptions({
      skipTenantGuard: true,
    });
    if (!recipient) return next(new ApiError(404, 'Invalid redemption link', 'NOT_FOUND'));
    if (String(recipient._id) !== String(payload.sub)) {
      return next(new UnauthorizedError('Session does not match this redemption link'));
    }
    if (recipient.redemptionStatus !== 'verified' && recipient.redemptionStatus !== 'redeemed' && recipient.redemptionStatus !== 'order_created') {
      return next(new ApiError(403, 'Complete OTP verification first', 'NOT_VERIFIED'));
    }

    req.redemptionRecipient = recipient;
    req.tenantId = recipient.tenantId;
    next();
  } catch (err) {
    next(err);
  }
}
