"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole document, so the app's
 * CSS, fonts and locale store are not available: everything here is inline and English-only.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
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
        <title>Something went wrong — Alhassan Alfarran</title>
        <main style={{ maxWidth: 480 }} role="alert">
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Something went wrong.</h1>
          <p style={{ margin: 0, color: "#9698aa", lineHeight: 1.6 }}>
            The page failed to load. Please try again — if it keeps happening, the home page is one click away.
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
              Try again
            </button>
            {/* A full page load on purpose: the client router may be what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
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
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
