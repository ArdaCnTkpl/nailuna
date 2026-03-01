/**
 * Central SEO config – base URL, site name, default images.
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://nailuna.app).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nailuna.app";
export const SITE_NAME = "Nailuna";
export const SITE_DESCRIPTION =
  "AI-powered nail design studio. Upload your photo, describe your style, and get realistic nail designs in seconds. Try Nailuna for free.";
export const SITE_KEYWORDS = [
  "AI nail design",
  "nail art",
  "nail simulator",
  "virtual nail try on",
  "nail design app",
  "Nailuna",
  "manicure",
  "nail salon",
  "custom nail art",
];
export const TWITTER_HANDLE = ""; // e.g. "@nailuna" if you have one
export const OG_IMAGE_PATH = "/og.png"; // add a 1200x630 image to public/og.png for best results

export function fullUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
