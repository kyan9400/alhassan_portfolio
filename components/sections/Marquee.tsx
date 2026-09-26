"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useCopy } from "@/lib/hooks";

/**
 * Endless strip of where I've worked, then the stack. Duplicated once for a seamless loop.
 * Pauses on hover, and has a pause button (WCAG 2.2.2); reduced-motion users get a still strip.
 * No backdrop blur: over the fixed page background it made the first frame far slower to paint on phones.
 */
export function Marquee() {
  const copy = useCopy();
  const [paused, setPaused] = useState(false);

  const items = [
    ...copy.proofStripItems.map((label) => ({ label, strong: true })),
    ...copy.skillsGroups.flatMap((g) => g.items.slice(0, 3)).map((label) => ({ label, strong: false }))
  ];
  const controlLabel = paused ? copy.ui.marqueePlay : copy.ui.marqueePause;

  return (
    <section aria-label={copy.proofStripLabel} className="group/marquee relative border-y hairline bg-card/40 py-6">
      <div className="marquee-mask flex overflow-hidden" dir="ltr">
        <ul
          className="flex shrink-0 animate-marquee items-center gap-10 pe-10 group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]"
          style={{ "--marquee-duration": "50s", animationPlayState: paused ? "paused" : undefined } as React.CSSProperties}
        >
          {[...items, ...items].map((item, i) => (
            <li
              key={i}
              aria-hidden={i >= items.length || undefined}
              className={`flex items-center gap-10 whitespace-nowrap font-display text-lg font-medium md:text-xl ${item.strong ? "text-text" : "text-muted"}`}
            >
              {item.label}
              <span className="text-accent" aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={controlLabel}
        title={controlLabel}
        className="absolute end-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border hairline bg-bg text-muted transition hover:text-text motion-reduce:hidden sm:end-4"
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
    </section>
  );
}
