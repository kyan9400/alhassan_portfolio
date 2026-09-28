import { create } from "zustand";
import type { Locale } from "@/lib/types";

type PortfolioState = {
  locale: Locale;
  /**
   * False until the saved locale has been read on the client (see hydrateLocale).
   * The server always renders "en"; until this flips, `locale` is that default, not the visitor's choice.
   */
  localeReady: boolean;
  setLocale: (locale: Locale) => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  paletteOpen: boolean;
  /** True once the command palette has been opened; its code is only loaded from then on. */
  paletteUsed: boolean;
  setPaletteOpen: (open: boolean) => void;
  /**
   * A reason another section asks the contact form to preselect (Services → "freelance").
   * Contact applies it once and clears it back to null.
   */
  contactReason: ContactReason | null;
  setContactReason: (reason: ContactReason | null) => void;
};

export type ContactReason = "hiring" | "freelance" | "other";

/** Same key the pre-paint script in app/layout.tsx reads to set <html lang/dir> before first paint. */
const LOCALE_KEY = "locale";

let toastSeq = 0;

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru" || value === "ar";
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  locale: "en",
  localeReady: false,
  setLocale: (locale) => {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
    syncLangParam(locale);
    set({ locale, localeReady: true });
  },
  toast: null,
  // A counter (not Date.now()) so two toasts in the same millisecond still get distinct keys.
  showToast: (message) => set({ toast: { id: ++toastSeq, message } }),
  paletteOpen: false,
  paletteUsed: false,
  setPaletteOpen: (paletteOpen) => set((s) => ({ paletteOpen, paletteUsed: s.paletteUsed || paletteOpen })),
  contactReason: null,
  setContactReason: (contactReason) => set({ contactReason })
}));

/** URL parameter that opens a page in one language (`/?lang=ar`); the hreflang alternates use it (lib/seo.ts). */
const LANG_PARAM = "lang";

function readLangParam(): Locale | null {
  try {
    const value = new URLSearchParams(window.location.search).get(LANG_PARAM);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * A page opened with ?lang= keeps the parameter in step with the language switcher, so the address
 * bar never names a language other than the one shown (a reload or a shared link stays correct).
 * Without the parameter, the URL is left alone.
 */
function syncLangParam(locale: Locale) {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(LANG_PARAM) || url.searchParams.get(LANG_PARAM) === locale) return;
    url.searchParams.set(LANG_PARAM, locale);
    // `null` state: Next.js's patched replaceState copies its own router state into the entry.
    window.history.replaceState(null, "", url);
  } catch {
    /* history unavailable (sandboxed iframe) */
  }
}

/**
 * Restore the locale once on the client, then mark it as ready. Order, the same as the pre-paint
 * script in app/layout.tsx so the <html lang> it set before first paint and the store agree:
 * 1. `?lang=en|ru|ar` in the URL — an explicit choice, so it is saved like a switcher click;
 * 2. the saved choice;
 * 3. a Russian browser gets Russian. This guess is not saved; only an explicit choice is.
 */
export function hydrateLocale() {
  const fromUrl = readLangParam();
  if (fromUrl) {
    try {
      localStorage.setItem(LOCALE_KEY, fromUrl);
    } catch {
      /* storage unavailable: the URL still decides for this page view */
    }
    usePortfolioStore.setState({ locale: fromUrl, localeReady: true });
    return;
  }

  let saved: string | null = null;
  try {
    saved = localStorage.getItem(LOCALE_KEY);
  } catch {
    /* storage unavailable */
  }
  if (!saved && /^ru/i.test(navigator.language || "")) saved = "ru";
  usePortfolioStore.setState(isLocale(saved) ? { locale: saved, localeReady: true } : { localeReady: true });
}
