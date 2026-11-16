// Responsive, compressed images served by the /img route of the server
// (resized + converted to WebP with sharp, then cached on disk).

export const REMOTE_IMAGE_PREFIX = "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/";

/** Widths the server is allowed to produce (keeps the cache small). */
export const IMAGE_WIDTHS = [320, 480, 640, 828, 1080, 1280, 1600, 1920];

export function canOptimize(src?: string): boolean {
  return !!src && (src.startsWith("/images/") || src.startsWith(REMOTE_IMAGE_PREFIX));
}

/** URL of a resized version of `src` (or `src` itself when it can't be optimised). */
export function optimized(src: string, width: number): string {
  if (!canOptimize(src)) return src;
  return `/img?w=${width}&src=${encodeURIComponent(src)}`;
}

/** `srcset` attribute value for the given widths. */
export function srcSet(src: string, widths: number[]): string | undefined {
  if (!canOptimize(src)) return undefined;
  return widths.map(w => `${optimized(src, w)} ${w}w`).join(", ");
}

/**
 * Props to spread on an <img>: src + srcSet + sizes.
 * Note: browsers multiply `sizes` by the screen density, so we never list widths above 1600 px
 * (a 4x phone would otherwise download desktop-sized photos).
 */
export function responsive(src: string, widths: number[], sizes: string) {
  const fallback = widths[Math.min(1, widths.length - 1)];
  return { src: optimized(src, fallback), srcSet: srcSet(src, widths), sizes };
}
