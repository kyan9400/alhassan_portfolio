"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { localeDir, localePath, splitLocale } from "@/lib/i18n";

/** Kept here (not lib/ui-copy.ts) so this last-resort page loads as little code as possible. */
const TEXT = {
  en: {
    title: "Something went wrong — Alhassan Alfarran",
    heading: "Something went wrong.",
    body: "The page failed to load. Please try again — if it keeps happening, the home page is one click away.",
    retry: "Try again",
    home: "Go home"
  },
  ru: {
    title: "Что-то пошло не так — Альхассан Альфарран",
    heading: "Что-то пошло не так.",
    body: "Страница не загрузилась. Попробуйте ещё раз — если ошибка повторяется, главная страница в одном клике.",
    retry: "Попробовать снова",
    home: "На главную"
  },
  ar: {
    title: "حدث خطأ ما — الحسن الفران",
    heading: "حدث خطأ ما.",
    body: "تعذّر تحميل الصفحة. حاول مرة أخرى — وإذا تكرر الخطأ، فالصفحة الرئيسية على بُعد نقرة واحدة.",
    retry: "حاول مرة أخرى",
    home: "الصفحة الرئيسية"
  }
};

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole document, so the app's
 * CSS and fonts are not available: everything here is inline. The language comes from the URL.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const locale = splitLocale(usePathname() ?? "/").locale ?? "en";
  const t = TEXT[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} dir={localeDir(locale)}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          background: "radial-gradient(circle at 20% 10%, #2a1760 0%, transparent 45%), #0a0a0f",
          color: "#ececf3",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center"
        }}
      >
        <title>{t.title}</title>
        <main style={{ maxWidth: 480 }} role="alert">
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>{t.heading}</h1>
          <p style={{ margin: 0, color: "#9698aa", lineHeight: 1.6 }}>
            {t.body}
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 999,
                border: "none",
                background: "#6d28d9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              {t.retry}
            </button>
            {/* A full page load on purpose: the client router may be what failed. */}
            <a
              href={localePath(locale, "/")}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#ececf3",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {t.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
