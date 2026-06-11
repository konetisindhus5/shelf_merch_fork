/**
 * §4 pricing.service — service fee + GST calculation.
 * Rates mirror the frontend checkout (12% service fee, 18% GST).
 */
export const SERVICE_FEE_RATE = 0.12;
export const GST_RATE = 0.18;

const round2 = (n) => Math.round(n * 100) / 100;

export function computeAmountBreakdown(items) {
  const subtotal = round2(items.reduce((sum, i) => sum + i.unitPriceInr * i.qty, 0));
  const serviceFee = round2(subtotal * SERVICE_FEE_RATE);
  const gst = round2((subtotal + serviceFee) * GST_RATE);
  const total = round2(subtotal + serviceFee + gst);
  return { subtotal, serviceFee, gst, total };
}
