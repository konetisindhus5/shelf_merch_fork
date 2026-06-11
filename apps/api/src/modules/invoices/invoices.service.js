import PDFDocument from 'pdfkit';
import { Invoice } from './invoice.model.js';
import { Payment } from '../payments/payment.model.js';
import { Tenant } from '../tenants/tenant.model.js';
import { NotFoundError } from '../../utils/errors.js';
import { getPagination, paginatedResponse } from '../../utils/pagination.js';

const GST_RATE = 18;
const HSN_WALLET_FUNDING = '998314';

async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments({}).setOptions({ skipTenantGuard: true });
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
}

/** §7.11 — GST invoice for a succeeded wallet-funding payment. */
export async function createInvoiceForPayment({ tenantId, payment }) {
  const existing = await Invoice.findOne({ paymentId: payment._id, tenantId });
  if (existing) return existing;

  const tenant = await Tenant.findById(tenantId);
  const totalInr = payment.amount;
  const taxable = Math.round((totalInr / (1 + GST_RATE / 100)) * 100) / 100;
  const gstAmount = Math.round((totalInr - taxable) * 100) / 100;

  return Invoice.create({
    tenantId,
    invoiceNumber: await nextInvoiceNumber(),
    paymentId: payment._id,
    lineItems: [
      {
        description: 'Merchandise wallet funding (B2B SaaS)',
        hsnCode: HSN_WALLET_FUNDING,
        quantity: 1,
        unitPrice: taxable,
        gstRate: GST_RATE,
        amount: taxable,
      },
    ],
    totalAmount: totalInr,
    gstAmount,
    senderGstin: '', // platform GSTIN — set when ShelfMerch entity is registered
    receiverGstin: tenant?.gstin ?? '',
    status: 'paid',
  });
}

export async function listInvoices({ tenantId, query }) {
  const { page, limit, skip } = getPagination(query);
  const filter = { tenantId };
  const [items, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Invoice.countDocuments(filter),
  ]);
  return paginatedResponse(items, total, { page, limit });
}

export async function getInvoice({ tenantId, invoiceId }) {
  const invoice = await Invoice.findOne({ _id: invoiceId, tenantId });
  if (!invoice) throw new NotFoundError('Invoice not found');
  return invoice;
}

/** Stream a GST-compliant PDF to the HTTP response. */
export async function streamInvoicePdf({ tenantId, invoiceId, res }) {
  const invoice = await getInvoice({ tenantId, invoiceId });
  const tenant = await Tenant.findById(tenantId);
  const payment = await Payment.findOne({ _id: invoice.paymentId, tenantId });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoice.invoiceNumber}.pdf"`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`);
  doc.text(`Payment Ref: ${payment?.providerRefId ?? '—'}`);
  doc.moveDown();

  doc.text('Bill To:');
  doc.text(tenant?.name ?? 'Customer');
  if (invoice.receiverGstin) doc.text(`GSTIN: ${invoice.receiverGstin}`);
  doc.moveDown();

  doc.text('Description', 50, doc.y, { continued: true, width: 200 });
  doc.text('HSN', 250, doc.y - doc.currentLineHeight(), { continued: true, width: 60 });
  doc.text('Qty', 310, doc.y - doc.currentLineHeight(), { continued: true, width: 40 });
  doc.text('Rate', 350, doc.y - doc.currentLineHeight(), { continued: true, width: 80 });
  doc.text('Amount', 430, doc.y - doc.currentLineHeight());
  doc.moveDown(0.5);

  for (const line of invoice.lineItems) {
    doc.text(line.description, 50, doc.y, { width: 190 });
    const y = doc.y - doc.currentLineHeight();
    doc.text(line.hsnCode, 250, y);
    doc.text(String(line.quantity), 310, y);
    doc.text(`₹${line.unitPrice.toFixed(2)}`, 350, y);
    doc.text(`₹${line.amount.toFixed(2)}`, 430, y);
    doc.moveDown(0.3);
  }

  doc.moveDown();
  doc.text(`Taxable Amount: ₹${(invoice.totalAmount - invoice.gstAmount).toFixed(2)}`);
  doc.text(`CGST @ 9%: ₹${(invoice.gstAmount / 2).toFixed(2)}`);
  doc.text(`SGST @ 9%: ₹${(invoice.gstAmount / 2).toFixed(2)}`);
  doc.text(`Total (incl. GST): ₹${invoice.totalAmount.toFixed(2)}`, { bold: true });

  doc.end();
}
