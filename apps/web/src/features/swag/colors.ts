import type { UiCollection, UiProduct } from "@/services/mappers";
import { resolveColorHex } from "@/lib/colorMap";
import { curatedColorSwatches, productVariantSwatches } from "@/lib/variantColors";

const SWAG_COLORS: [string, string][] = [
  ["Black", "#1c1c1c"],
  ["Blue", "#2b54d6"],
  ["Brown", "#7a4a25"],
  ["Green", "#15784c"],
  ["Gray", "#9a9a9a"],
  ["Navy", "#1c2a52"],
  ["Orange", "#f59e0b"],
  ["Pink", "#f4aacb"],
  ["Purple", "#7a3fb0"],
  ["Red", "#d33b30"],
  ["White", "#ffffff"],
  ["Yellow", "#f5d000"],
];
const SWAG_COLOR_HEX: Record<string, string> = Object.fromEntries(SWAG_COLORS);

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  hoodie:
    "A comfortable fleece hoodie built for everyday wear. Features a soft interior, adjustable drawstring hood, and kangaroo pocket. Durable construction holds up wash after wash — ideal for corporate gifting, team swag, and employee recognition.",
  tee: "A premium cotton tee with a relaxed fit and smooth hand-feel. Reinforced shoulders and tear-away label make it perfect for branded decoration and bulk gifting programs.",
  bottle:
    "Insulated stainless steel bottle keeps drinks cold for 24 hours or hot for 12. Leak-proof lid and powder-coated finish stand up to daily use.",
  mug: "Glossy ceramic mug with a comfortable C-handle. Microwave and dishwasher safe — a classic choice for desk-side branding.",
  pack: "Structured backpack with padded straps and multiple compartments. Built for commuters and everyday carry with room for a laptop.",
  cap: "Structured twill cap with adjustable closure. Pre-curved visor and breathable panels for all-day comfort.",
  note: "Hard-cover notebook with rounded corners and elastic closure. Acid-free pages ready for notes, sketches, or meeting prep.",
  power:
    "Compact power bank with fast-charge USB-C output. Slim profile slips into a pocket or laptop sleeve.",
  pillow:
    "Memory foam neck pillow with washable cover. Lightweight and travel-ready for road warriors and remote teams.",
  bag: "Organic canvas tote with reinforced handles. Spacious main compartment for groceries, events, or conference swag.",
};

function isHexColor(s: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(String(s || ""));
}

export function swagColorHex(name: string): string {
  return SWAG_COLOR_HEX[name] || "#9a9a9a";
}

/** Default garment tint for swag mockups — always white, never a catalog variant hex. */
export const DEFAULT_MOCKUP_TINT_HEX = SWAG_COLOR_HEX.White;

export function productColorHex(p: UiProduct, name: string): string {
  if (p?.colorHexByName?.[name]) return p.colorHexByName[name];
  const fromVariant = p?.variants?.find((v) => v.color === name)?.colorHex;
  if (fromVariant) return resolveColorHex(name, fromVariant);
  if (isHexColor(name)) return name;
  return resolveColorHex(name) || swagColorHex(name);
}

export function productColorNames(p: UiProduct): string[] {
  return productVariantSwatches(p).map((c) => c.name);
}

export function collectionProductColorNames(col: UiCollection, p: UiProduct): string[] {
  return curatedColorSwatches(productVariantSwatches(p), col?.preferredColors).map((c) => c.name);
}

export function productDescription(p: UiProduct): string {
  return (
    PRODUCT_DESCRIPTIONS[p?.g] ||
    "Premium branded merchandise ready for your collection. High-quality materials and professional decoration."
  );
}
