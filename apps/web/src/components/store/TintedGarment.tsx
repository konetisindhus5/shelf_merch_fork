import type { CSSProperties } from "react";

/**
 * Recolours a neutral (white garment + soft shadows on transparent background)
 * PNG to `hex` using CSS layering — no canvas. Shared by the print-area editor
 * (base image) and the customer storefront (mask image).
 *
 * Layer A fills the garment shape with the flat colour (the PNG used as a CSS
 * mask). Layer B is the PNG itself with `mix-blend-mode: multiply`, so the
 * garment's shading darkens the colour realistically. `isolation: isolate`
 * keeps the blend local to this element. Falls back to a plain <img> when no
 * hex/src is provided.
 */
export function TintedGarment({
  src,
  hex,
  alt = "",
  style,
}: {
  src?: string;
  hex?: string;
  alt?: string;
  style?: CSSProperties;
}) {
  if (!src) {
    return (
      <div style={{ display: "grid", placeItems: "center", color: "var(--ink-3)", fontSize: 12, ...style }}>
        No image
      </div>
    );
  }
  if (!hex) {
    return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain", ...style }} />;
  }
  return (
    <div style={{ position: "relative", isolation: "isolate", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hex,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
