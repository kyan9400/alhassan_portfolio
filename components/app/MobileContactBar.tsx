"use client";

import { useEffect, useState } from "react";
import { Download, Mail } from "lucide-react";
import { useCopy, useCvDownload } from "@/lib/hooks";
import { CONTACT_EMAIL, TELEGRAM_URL } from "@/lib/ui-copy";
import { trackEvent } from "@/lib/analytics";
import { TelegramIcon } from "@/components/ui/primitives";

/**
 * Phones only (below md): a bottom bar with Telegram, the CV and email, one tap away anywhere on the
 * home page. It appears once #hero has scrolled away and hides while #contact is on screen (which
 * has the same actions, larger).
 */
export function MobileContactBar() {
  const copy = useCopy();
  const { ui } = copy;
  const cv = useCvDownload();
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contact");
    if (!hero || !contact || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        else setContactVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const shown = !heroVisible && !contactVisible;
  const item =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold text-text transition-colors active:bg-surface";

  return (
    <nav
      aria-label={ui.contactBarLabel}
      // `inert` while hidden: off-screen links must not be reachable with Tab or a screen reader.
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t hairline bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 md:hidden print:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex h-14 items-stretch gap-1 py-1">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("telegram_click", { source: "bar" })}
          className={item}
        >
          <TelegramIcon className="h-5 w-5 text-accent" />
          {ui.telegramLabel}
        </a>
        <a href={cv.href} download type="application/pdf" onClick={cv.onClick} className={item}>
          <Download className="h-5 w-5" aria-hidden="true" />
          {copy.navCvLabel}
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} className={item}>
          <Mail className="h-5 w-5" aria-hidden="true" />
          {ui.emailShort}
        </a>
      </div>
    </nav>
  );
}
