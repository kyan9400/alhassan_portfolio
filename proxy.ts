import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_HEADER, isLocale, localePath, splitLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/*
 * Locale routing (see lib/i18n.ts). Every page lives under /en, /ru or /ar.
 *
 * - `?lang=xx` (the old way to pick a language, still in shared links): 308 to the same page under
 *   /xx, without the parameter. Works with or without a language prefix already in the path.
 * - A page URL without a language (/, /cv, /projects/..., /notes...): 307 to the visitor's language:
 *   the NEXT_LOCALE cookie (an explicit choice from the language switcher), else the best supported
 *   language in Accept-Language, else English. 307 (not permanent): the target depends on the visitor.
 * - Anything else passes through. An unsupported language (/de) or unknown path is a 404 from the router
 *   (app/global-not-found.tsx). Under a language prefix, the request carries that language in the
 *   x-site-locale header so the 404 can be shown in it.
 */

/** First path segments of the localized pages. Only these are redirected, so /de stays a 404. */
const PAGE_ROOTS = new Set(["", "cv", "projects", "notes"]);

/** The best supported language in an Accept-Language header ("ru-RU,ru;q=0.9,en;q=0.8" → "ru"). */
function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  return ranked.find((entry): entry is typeof entry & { lang: Locale } => isLocale(entry.lang))?.lang ?? null;
}

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  return fromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { locale: pathLocale, path } = splitLocale(pathname);

  const langParam = searchParams.get("lang");
  if (isLocale(langParam)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    url.pathname = localePath(langParam, path);
    return NextResponse.redirect(url, 308);
  }

  if (pathLocale) {
    // Tells the global 404 (app/global-not-found.tsx, which gets no route params) the page language.
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, pathLocale);
    return NextResponse.next({ request: { headers } });
  }
  if (!PAGE_ROOTS.has(pathname.split("/")[1] ?? "")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = localePath(preferredLocale(request), pathname);
  const response = NextResponse.redirect(url, 307);
  // The target depends on these request headers: shared caches must not hand one visitor's redirect to another.
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    /*
     * Skip Next internals, API routes, Vercel analytics, metadata routes (Open Graph and Twitter images,
     * icons, manifest, sitemap, robots) and any path with a file extension: static files, images, the
     * PDF CVs (/cv/*.pdf) and the RSS feed (/notes/rss.xml).
     */
    "/((?!_next/|_vercel/|api/|.*\\..*|.*opengraph-image|.*twitter-image|icon|apple-icon|manifest|sitemap|robots).*)"
  ]
};
