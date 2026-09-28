"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { copyByLocale } from "@/lib/copy";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Bidi, Reveal } from "@/components/ui/primitives";
import type { Locale } from "@/lib/types";

const SCRIPTS: Locale[] = ["en", "ru", "ar"];

/**
 * The first name in the three scripts I work in. Each carries its own lang/dir; only the one in the
 * page's language is read out, the other two are decorative.
 */
function NameInThreeScripts() {
  const locale = usePortfolioStore((s) => s.locale);
  return (
    <p className="flex flex-wrap items-baseline gap-x-[0.35em] gap-y-1 font-display text-[clamp(2rem,5.4vw,4.5rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
      {SCRIPTS.map((l, i) => {
        const current = l === locale;
        return (
          <span key={l} className="inline-flex items-baseline gap-x-[0.35em]" aria-hidden={current ? undefined : true}>
            <span
              lang={l}
              dir={l === "ar" ? "rtl" : "ltr"}
              className={`${current ? "text-text" : "text-muted/45"} ${l === "ar" ? "font-arabic tracking-normal" : ""} ${l === "ru" ? "tracking-[-0.015em]" : ""}`}
            >
              {copyByLocale[l].brandName}
            </span>
            {/* Trailing separator, so a wrapped line never starts with it. */}
            {i < SCRIPTS.length - 1 ? (
              <span className="text-line/20" aria-hidden="true">
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </p>
  );
}

export function About() {
  const copy = useCopy();
  const how = copy.howIWork;
  const howId = useId();
  // Phones: the four habits start as titles only; "Show details" reveals the explanations.
  const [howOpen, setHowOpen] = useState(false);

  return (
    <section id="about" className="section cv-auto [--cv-h:1600px] sm:[--cv-h:2100px] md:[--cv-h:1650px] lg:[--cv-h:1350px]">
      <div className="shell">
        <Reveal className="mb-12 md:mb-16">
          <NameInThreeScripts />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-4">{copy.aboutEyebrow}</p>
              <h2 className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] rtl:leading-[1.25]">{copy.aboutTitle}</h2>
              <p className="mt-6 text-pretty text-base leading-relaxed text-muted md:text-lg">
                <Bidi text={copy.aboutBody} />
              </p>
            </Reveal>
          </div>

          <div className="min-w-0">
            <Reveal>
              <h3 className="mb-8 font-display text-2xl font-semibold text-muted">{copy.ui.aboutStoryTitle}</h3>
            </Reveal>
            <ol className="relative space-y-7 border-s border-line/10 ps-8 md:space-y-8">
              {copy.ui.aboutStory.map((chapter, i) => (
                <Reveal as="li" key={chapter.label} delay={i * 0.08} className="relative">
                  {/* Outline mono numeral on the rail. */}
                  <span
                    className="absolute -start-[45px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-line/25 bg-bg font-mono text-[11px] font-medium text-muted"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink rtl:tracking-normal">{chapter.label}</p>
                  <p className="mt-2.5 text-pretty text-[17px] leading-relaxed md:text-xl">
                    <Bidi text={chapter.body} />
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {/* How I work: four habits as one compact strip. */}
        <Reveal className="mt-12 border-t hairline pt-8 sm:mt-16 sm:pt-10 md:mt-24">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <h3 className="font-display text-xl font-semibold md:text-2xl">{how.eyebrow}</h3>
            <p className="text-pretty text-sm text-muted md:text-base">{how.description}</p>
          </div>
          <ol id={howId} className={`mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 ${howOpen ? "" : "max-sm:mt-6 max-sm:gap-y-3"}`}>
            {how.items.map((step, i) => (
              <li key={step.title} className="min-w-0">
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-muted" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="font-semibold">{step.title}</span>
                </p>
                <p className={`mt-2 text-pretty text-sm leading-relaxed text-muted ${howOpen ? "" : "max-sm:hidden"}`}>{step.body}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setHowOpen((o) => !o)}
            aria-expanded={howOpen}
            aria-controls={howId}
            className="mt-4 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-accent-ink transition-colors hover:text-text sm:hidden"
          >
            {howOpen ? copy.ui.hideDetails : copy.ui.showDetails}
            <ChevronDown className={`h-4 w-4 transition-transform ${howOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
