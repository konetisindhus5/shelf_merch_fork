import * as paymentsService from './payments.service.js';
import { writeAudit } from '../../services/audit.service.js';

export async function createRazorpayOrder(req, res) {
  const result = await paymentsService.createRazorpayOrder({
    tenantId: req.tenantId,
    userId: req.user.userId,
    walletId: req.body.walletId,
    amountInr: req.body.amount,
  });
  writeAudit({
    req,
    action: 'payment.razorpay_order_created',
    entityType: 'Payment',
    entityId: result.paymentId,
    after: { orderId: result.orderId, amount: result.amount },
  });
  res.status(201).json(result);
}

export async function razorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ error: { code: 'MISSING_SIGNATURE', message: 'X-Razorpay-Signature required' } });
  }
  const result = await paymentsService.handleRazorpayWebhook(req.body, signature);
  res.json({ received: true, ...result });
}
