/** Full-page design detail for a product published to a shop. */
export function shopDesignPath(shopId: string, collectionId: string, productIndex = 0) {
  const base = `/app/shops/${encodeURIComponent(shopId)}/designs/${encodeURIComponent(collectionId)}`;
  return productIndex > 0 ? `${base}?p=${productIndex}` : base;
}
