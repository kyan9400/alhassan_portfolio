import { Inter, Manrope, IBM_Plex_Sans_Arabic } from "next/font/google";

/*
 * Shared by the two documents the app renders: the root layout (app/[lang]/layout.tsx) and the global
 * 404 (app/global-not-found.tsx), which bypasses the layout and so builds its own <html>.
 */

/*
 * Fonts. `subsets` only decides what gets a <link rel="preload">: next/font still self-hosts
 * every unicode-range Google serves (Inter's and Manrope's Cyrillic included), so Russian text
 * keeps both faces without making every first visit pay for Cyrillic and Arabic files up front.
 * Manrope is the display face for English and Russian (Space Grotesk had no Cyrillic).
 * Arabic is loaded on demand (preload: false) and only in the two weights the UI uses.
 */
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Manrope({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false
});

/** Class names that define the font CSS variables; set on <html>. */
export const FONT_VARIABLES = `${body.variable} ${display.variable} ${arabic.variable}`;

/*
 * Runs before first paint:
 * - js: marks that scripts run, so scroll-reveal content may start hidden (see globals.css);
 * - cv-all: a deep link (/en#section) renders every section at once, for an exact landing (.cv-auto);
 * - theme: dark by default, respects a stored "light" choice (no flash).
 * The language is not decided here: it is the URL segment, and the server renders <html lang dir>.
 */
export const PRE_PAINT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");if(location.hash)d.classList.add("cv-all");try{if(localStorage.getItem("theme")!=="light"){d.classList.add("dark")}}catch(e){d.classList.add("dark")}})();`;
