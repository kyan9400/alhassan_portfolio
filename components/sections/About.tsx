"use client";

import { Briefcase, Globe2, Languages, MapPin, Sparkles } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Reveal } from "@/components/ui/primitives";

const HIGHLIGHT_ICONS = [MapPin, Briefcase, Globe2, Languages];

export function About() {
  const copy = useCopy();

  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-4">{copy.aboutEyebrow}</p>
              <h2 className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05]">{copy.aboutTitle}</h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted md:text-lg">{copy.aboutBody}</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-3">
              {copy.aboutHighlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                return (
                  <div key={h.label} className="card spotlight card-hover p-4" onPointerMove={trackPointer}>
                    <Icon className="mb-3 h-4 w-4 text-accent" aria-hidden="true" />
                    <p className="text-[11px] uppercase tracking-wider text-muted">{h.label}</p>
                    <p className="mt-1 text-sm font-semibold">{h.value}</p>
                  </div>
                );
              })}
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3 className="mb-8 font-display text-2xl font-semibold text-muted">{copy.ui.aboutStoryTitle}</h3>
            </Reveal>
            <ol className="relative space-y-6 border-s hairline ps-8">
              {copy.ui.aboutStory.map((chapter, i) => (
                <Reveal as="li" key={chapter.label} delay={i * 0.08} className="relative">
                    <span className="absolute -start-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-bg bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">{chapter.label}</p>
                    <p className="mt-3 text-pretty text-lg leading-relaxed md:text-xl">{chapter.body}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.1} className="card mt-12 p-6 md:p-8">
              <p className="mb-5 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                {copy.aboutFocusTitle}
              </p>
              <ul className="flex flex-wrap gap-2">
                {copy.aboutFocusItems.map((item) => (
                  <li key={item} className="tag !text-[13px] !text-text/80">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {copy.credibilityItems.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06} className="card spotlight card-hover p-5" onPointerMove={trackPointer}>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
