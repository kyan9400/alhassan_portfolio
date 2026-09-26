"use client";

import { useCopy } from "@/lib/hooks";

/** Endless strip of proof points + the stack. Duplicated once for a seamless loop. */
export function Marquee() {
  const copy = useCopy();
  const tech = copy.skillsGroups.flatMap((g) => g.items.slice(0, 3));
  const items = [...copy.proofStripItems, ...tech];

  return (
    <section aria-label={copy.proofStripLabel} className="relative border-y hairline bg-card/30 py-6 backdrop-blur-sm">
      <div className="marquee-mask flex overflow-hidden" dir="ltr">
        <ul className="flex shrink-0 animate-marquee items-center gap-10 pe-10 hover:[animation-play-state:paused]" style={{ "--marquee-duration": "50s" } as React.CSSProperties}>
          {[...items, ...items].map((item, i) => (
            <li key={i} aria-hidden={i >= items.length} className="flex items-center gap-10 whitespace-nowrap font-display text-lg font-medium text-muted md:text-xl">
              {item}
              <span className="text-accent" aria-hidden="true">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
