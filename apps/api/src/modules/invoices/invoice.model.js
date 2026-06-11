import mongoose from 'mongoose';
import { tenantScopePlugin } from '../../plugins/tenantScope.plugin.js';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    lineItems: [
      {
        description: String,
        hsnCode: String,
        quantity: Number,
        unitPrice: Number,
        gstRate: Number,
        amount: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    senderGstin: { type: String, default: '' },
    receiverGstin: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'issued', 'paid'], default: 'issued' },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

invoiceSchema.plugin(tenantScopePlugin);

export const Invoice = mongoose.model('Invoice', invoiceSchema);
