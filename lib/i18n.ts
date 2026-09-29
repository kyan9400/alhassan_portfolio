import type { Locale } from "@/lib/types";

/*
 * Locale routing. Every page lives under its language: /en, /ru, /ar (app/[lang]/). The language is
 * part of the URL, so the server renders <html lang dir> and the copy for it directly; there is no
 * client-side language state to restore. proxy.ts sends unprefixed URLs to the right language.
 * Shared by the server (layouts, metadata, proxy) and the client (links, language switcher).
 */

export const LOCALES = ["en", "ru", "ar"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";

/** Cookie that remembers an explicit language choice (the switcher sets it; proxy.ts reads it). */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Request header proxy.ts sets to the URL's language, for the global 404 (it gets no route params). */
export const LOCALE_HEADER = "x-site-locale";

/** Open Graph locale per language. */
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", ru: "ru_RU", ar: "ar_AR" };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru" || value === "ar";
}

/** The [lang] route param as a Locale. An unknown one only reaches rendering for the 404 page, in English. */
export function routeLocale(lang: string): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * A site path in one language. `path` is the language-neutral path: "/", "/cv", "/projects/x",
 * "/#contact". Home is "/en" (no trailing slash); a home hash becomes "/en#contact".
 */
export function localePath(locale: Locale, path: string): string {
  if (path === "/" || path === "") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Splits "/ru/projects/x" into { locale: "ru", path: "/projects/x" }; locale is null without a prefix. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (match && isLocale(match[1])) return { locale: match[1], path: match[2] || "/" };
  return { locale: null, path: pathname || "/" };
}
