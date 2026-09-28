import { SITE_URL } from "@/lib/ui-copy";

/** JSON-LD node ids shared by the root layout (where they are defined) and every page that points at them. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * hreflang alternates for a page. The language is client-side state, not a path segment, so every
 * language lives at the same URL; `?lang=ru` / `?lang=ar` open it in that language (read before first
 * paint in app/layout.tsx and by hydrateLocale() in store/portfolioStore.ts). English is the plain URL
 * and the x-default.
 */
export function languageAlternates(path: string): Record<string, string> {
  return {
    en: path,
    ru: `${path}?lang=ru`,
    ar: `${path}?lang=ar`,
    "x-default": path
  };
}

/** Serializes JSON-LD for a <script type="application/ld+json">; `<` is escaped so content can never close the tag. */
export function jsonLdHtml(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
