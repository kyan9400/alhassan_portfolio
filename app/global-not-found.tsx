import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppChrome } from "@/components/app/AppChrome";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { FONT_VARIABLES, PRE_PAINT_SCRIPT } from "@/lib/document";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { getCopy } from "@/lib/ui-copy";
import { DEFAULT_LOCALE, LOCALE_HEADER, isLocale, localeDir } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import "./globals.css";

/*
 * 404 for every URL no route matches: an unknown language (/de), an unknown slug (/ru/projects/nope,
 * the [lang] routes set dynamicParams = false) or any other path. It replaces the root layout, so it
 * builds the same document itself (fonts, theme script, chrome). The language is the URL's prefix,
 * passed by proxy.ts in a request header; without one (/de, /foo) the page is English.
 */

async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = getCopy(await requestLocale());
  return { title: `${copy.notFoundTitle} — ${copy.ui.meta.nameSuffix}` };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  return (
    <html lang={locale} dir={localeDir(locale)} suppressHydrationWarning className={FONT_VARIABLES}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      </head>
      <body>
        <AppChrome locale={locale} notesEnabled={NOTES_ENABLED}>
          <NotFoundContent />
        </AppChrome>
      </body>
    </html>
  );
}
