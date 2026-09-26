"use client";

import { Bot, Code2, Container, Database, Server, Wrench } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Reveal, SectionHeader } from "@/components/ui/primitives";

// Frontend, Backend, AI & Search, Data & Storage, Delivery & Tools; extra groups fall back to Wrench.
const ICONS = [Code2, Server, Bot, Database, Container];

/**
 * Bento spans for any number of groups on the 6-column desktop grid: rows of three, with the
 * remainder absorbed by rows of two at the top (5 → 2+3, 4 → 2+2, 7 → 2+2+3).
 * On the 2-column tablet grid an odd last card takes the full row.
 */
function spanFor(index: number, count: number) {
  const remainder = count % 3;
  const wideCount = count === 1 ? 1 : remainder === 1 ? 4 : remainder === 2 ? 2 : 0;
  const lg = count === 1 ? "lg:col-span-6" : index < wideCount ? "lg:col-span-3" : "lg:col-span-2";
  const sm = count % 2 === 1 && index === count - 1 ? "sm:col-span-2" : "";
  return `${sm} ${lg}`;
}

export function Skills() {
  const copy = useCopy();
  const groups = copy.skillsGroups;

  return (
    <section id="skills" className="section cv-auto [--cv-h:1580px] md:[--cv-h:1150px] lg:[--cv-h:930px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {groups.map((group, i) => {
            const Icon = ICONS[i] ?? Wrench;
            return (
              <Reveal key={group.name} delay={i * 0.06} className={spanFor(i, groups.length)}>
                <div className="card spotlight card-hover group h-full p-5 sm:p-6" onPointerMove={trackPointer}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug">{group.name}</h3>
                    <span className="font-display text-xs font-semibold tabular-nums text-muted" aria-hidden="true">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line/10 bg-surface/60 px-3 py-1.5 text-[13px] text-text/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-text"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
