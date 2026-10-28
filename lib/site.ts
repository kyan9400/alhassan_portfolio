import type { Locale } from "@/lib/types";

/*
 * Site-wide constants with no runtime imports, so client components can use them without pulling
 * every language's copy into the bundle. cv-src/render.mjs reads CONTACT_EMAIL and DEFAULT_SITE_URL here.
 */

export const CONTACT_EMAIL = "kyan775909@gmail.com";
export const GITHUB_URL = "https://github.com/kyan9400";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alhassan-alfarran-880b00246/";
export const TELEGRAM_URL = "https://t.me/hassan_9400";
export const TELEGRAM_HANDLE = "@hassan_9400";

/** Short brand name per language (same values as `brandName` in lib/copy.ts). */
export const BRAND_NAMES: Record<Locale, string> = { en: "Alhassan", ru: "Альхассан", ar: "الحسن" };

/** Used when NEXT_PUBLIC_SITE_URL is unset or not an absolute http(s) URL. */
export const DEFAULT_SITE_URL = "https://alhassan-portfolio-sigma.vercel.app";

/** Absolute origin without a trailing slash, from NEXT_PUBLIC_SITE_URL (e.g. "https://example.com"); inlined at build time. */
export function resolveSiteUrl(value: string | undefined): string {
  if (!value?.trim()) return DEFAULT_SITE_URL;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return DEFAULT_SITE_URL;
    return `${url.protocol}//${url.host}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** The canonical origin: metadata, sitemap, robots, OG images, JSON-LD, RSS and the CV page all use it. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
/** SITE_URL without the scheme, for display ("example.com"). */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
