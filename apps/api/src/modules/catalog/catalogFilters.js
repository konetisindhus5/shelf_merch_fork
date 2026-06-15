/** Mongo filter for platform catalog/inventory source tabs. */
export function sourceProviderFilter(source) {
  if (source === 'shopify') return { 'source.provider': 'shopify' };
  if (source === 'native') return { 'source.provider': { $nin: ['shopify', 'seed'] } };
  return {};
}

/** Hide demo seed catalog rows from the platform control plane. */
export function excludeSeedProductsFilter() {
  return { 'source.provider': { $ne: 'seed' } };
}

/** Tenant catalog: only super-admin (manual) or Shopify-imported products. */
export function tenantCatalogFilter() {
  return { 'source.provider': { $in: ['manual', 'shopify'] } };
}

export function productSourceLabel(source) {
  return source?.provider === 'shopify' ? 'shopify' : 'native';
}

/** Case-insensitive match on name, SKU, or brand. */
export function productSearchFilter(search) {
  const q = String(search ?? '').trim();
  if (!q) return {};
  const regex = { $regex: q, $options: 'i' };
  return { $or: [{ name: regex }, { sku: regex }, { brand: regex }] };
}
