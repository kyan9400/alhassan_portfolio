import type { Metadata } from "next";
import { SITE_URL, getCopy } from "@/lib/ui-copy";
import { LOCALES, DEFAULT_LOCALE, OG_LOCALES, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/** JSON-LD node ids shared by the root layout (where they are defined) and every page that points at them. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * hreflang alternates for a translated page: every language has its own URL (/en/cv, /ru/cv, /ar/cv,
 * see lib/i18n.ts). English is the x-default. `path` is the language-neutral path ("/", "/cv").
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = localePath(locale, path);
  languages["x-default"] = localePath(DEFAULT_LOCALE, path);
  return languages;
}

/** `alternates` for a translated page in `locale`: canonical is the page's own language URL. */
export function localeAlternates(locale: Locale, path: string) {
  return { canonical: localePath(locale, path), languages: languageAlternates(path) };
}

/**
 * The site-wide Open Graph image (app/[lang]/opengraph-image.tsx). A page that sets its own openGraph
 * replaces the layout's, which drops the file-based image, so such pages name it explicitly. A
 * page with its own opengraph-image file (case studies) passes `siteImage: false` instead.
 */
export function siteOgImage(locale: Locale) {
  return {
    url: `${localePath(locale, "/")}/opengraph-image`,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Alhassan Alfarran — Full-Stack & Python Developer. Moscow · Available immediately"
  };
}

/**
 * Metadata for a translated page in `locale`: title (the layout template adds the name), description,
 * canonical + hreflang alternates, and Open Graph / Twitter in the same language. Page-level
 * openGraph/twitter replace the layout's objects, so they carry the full title.
 */
export function localizedPageMetadata(
  locale: Locale,
  path: string,
  {
    title,
    description,
    type = "website",
    siteImage = true
  }: { title: string; description: string; type?: "website" | "article" | "profile"; siteImage?: boolean }
): Metadata {
  const fullTitle = `${title} — ${getCopy(locale).ui.meta.nameSuffix}`;
  const images = siteImage ? { images: [siteOgImage(locale)] } : {};
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${localePath(locale, path)}`,
      type,
      siteName: "Alhassan Alfarran",
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      ...images
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...images }
  };
}

/** Serializes JSON-LD for a <script type="application/ld+json">; `<` is escaped so content can never close the tag. */
export function jsonLdHtml(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
