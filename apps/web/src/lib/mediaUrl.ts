/** Normalize upload paths for same-origin assets; leave external URLs untouched. */
export function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const path = url.replace(/^https?:\/\/[^/]+/i, "");
  return path.startsWith("/") ? path : `/${path}`;
}

/** Route remote mask images through the API proxy so canvas tinting can read pixels. */
export function mediaUrlForCanvas(url?: string): string {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return "";
  if (!resolved.startsWith("http://") && !resolved.startsWith("https://")) return resolved;
  if (typeof window !== "undefined") {
    try {
      if (new URL(resolved).origin === window.location.origin) return resolved;
    } catch {
      /* use proxy */
    }
  }
  return `/api/v1/media/proxy?url=${encodeURIComponent(resolved)}`;
}
