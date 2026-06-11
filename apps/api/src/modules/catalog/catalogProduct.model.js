import mongoose from 'mongoose';

// Platform-wide master catalog — intentionally NOT tenant-scoped (§5.3).
const catalogProductSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    group: { type: String, default: '' }, // icon group, e.g. "tee", "mug", "hoodie"
    basePriceInr: { type: Number, required: true },
    variants: [
      {
        color: String,
        size: String,
        sku: String,
        stock: { type: Number, default: 0 },
      },
    ],
    imageUrls: { type: [String], default: [] },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
    status: { type: String, enum: ['active', 'discontinued'], default: 'active' },
  },
  { timestamps: true },
);

export const CatalogProduct = mongoose.model('CatalogProduct', catalogProductSchema);
