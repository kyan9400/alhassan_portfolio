"use client";

import { Bot, Briefcase, GraduationCap, Languages, Layers, MapPin, Sparkles, Target } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Bidi, Reveal } from "@/components/ui/primitives";

const HIGHLIGHT_ICONS = [MapPin, Briefcase, GraduationCap, Languages];
const CREDIBILITY_ICONS = [Layers, Target, Bot];

export function About() {
  const copy = useCopy();

  return (
    <section id="about" className="section cv-auto [--cv-h:2450px] md:[--cv-h:1850px] lg:[--cv-h:1550px]">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-4">{copy.aboutEyebrow}</p>
              <h2 className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] rtl:leading-[1.25]">{copy.aboutTitle}</h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted md:text-lg">
                <Bidi text={copy.aboutBody} />
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-3">
              {copy.aboutHighlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                return (
                  <div key={h.label} className="card spotlight card-hover p-4" onPointerMove={trackPointer}>
                    <Icon className="mb-3 h-4 w-4 text-accent" aria-hidden="true" />
                    <p className="text-[11px] uppercase tracking-wider text-muted rtl:tracking-normal">{h.label}</p>
                    {/* "Moscow · on-site / hybrid / remote" → one fact per line, so narrow cards never break mid-phrase. */}
                    <p className="mt-1 text-sm font-semibold leading-snug">
                      {h.value.split(" · ").map((part, j) => (
                        <span key={`${part}-${j}`} className={`block ${j > 0 ? "mt-0.5 font-medium text-text/75" : ""}`}>
                          <Bidi text={part} />
                        </span>
                      ))}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </div>

          <div className="min-w-0">
            <Reveal>
              <h3 className="mb-8 font-display text-2xl font-semibold text-muted">{copy.ui.aboutStoryTitle}</h3>
            </Reveal>
            <ol className="relative space-y-8 border-s border-line/10 ps-8">
              {copy.ui.aboutStory.map((chapter, i) => (
                <Reveal as="li" key={chapter.label} delay={i * 0.08} className="relative">
                  <span className="absolute -start-[42px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-bg bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink rtl:tracking-normal">{chapter.label}</p>
                  <p className="mt-3 text-pretty text-lg leading-relaxed md:text-xl">
                    <Bidi text={chapter.body} />
                  </p>
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
                  // rounded-xl, not a pill: a long focus item can wrap to two lines on phones.
                  <li key={item} className="tag !rounded-xl !text-[13px] !text-text/80">
                    {/* One inline box: .tag is a flex container, which would drop the spaces around <bdi> runs. */}
                    <span>
                      <Bidi text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* 3 columns only where they're wide enough (tablet); stacked rows beside the sticky column on desktop. */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.credibilityItems.map((c, i) => {
                const Icon = CREDIBILITY_ICONS[i % CREDIBILITY_ICONS.length];
                return (
                  <Reveal
                    as="li"
                    key={c.title}
                    delay={i * 0.06}
                    className="card spotlight card-hover flex gap-4 p-5 sm:flex-col lg:flex-row"
                    onPointerMove={trackPointer}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{c.title}</span>
                      <span className="mt-1.5 block text-pretty text-[13px] leading-relaxed text-muted">
                        <Bidi text={c.body} />
                      </span>
                    </span>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
