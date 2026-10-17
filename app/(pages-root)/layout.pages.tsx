import type { Metadata, Viewport } from "next";
import { FONT_VARIABLES, PRE_PAINT_SCRIPT } from "@/lib/document";
import { PAGES_REDIRECT_SCRIPT } from "@/lib/pages-redirect";
import { getCopy } from "@/lib/ui-copy";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

/*
 * Root layout of "/" on the static GitHub Pages copy only (lib/base-path.ts). The `.pages.tsx`
 * extension is a page extension in that build alone (next.config.mjs), so on Vercel this route does
 * not exist and proxy.ts redirects "/" instead. Here the redirect runs in the browser, before paint.
 */

const { homeTitle: title, homeDescription: description } = getCopy(DEFAULT_LOCALE).ui.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}${localePath(DEFAULT_LOCALE, "/")}` }
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f"
};

export default function PagesRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning className={FONT_VARIABLES}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PAGES_REDIRECT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
