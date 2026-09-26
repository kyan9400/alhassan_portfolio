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
};

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
    set({ locale, localeReady: true });
  },
  toast: null,
  // A counter (not Date.now()) so two toasts in the same millisecond still get distinct keys.
  showToast: (message) => set({ toast: { id: ++toastSeq, message } }),
  paletteOpen: false,
  paletteUsed: false,
  setPaletteOpen: (paletteOpen) => set((s) => ({ paletteOpen, paletteUsed: s.paletteUsed || paletteOpen }))
}));

/** Restore the saved locale once on the client, then mark the locale as ready. */
export function hydrateLocale() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(LOCALE_KEY);
  } catch {
    /* storage unavailable */
  }
  usePortfolioStore.setState(isLocale(saved) ? { locale: saved, localeReady: true } : { localeReady: true });
}
