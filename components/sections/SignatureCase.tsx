"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CornerDownLeft } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { Bidi, Reveal } from "@/components/ui/primitives";

/** Tech under each request-path node (Client, API, Cache, Data). Names of tools: never translated. */
const PATH_TECH = ["React", "Express", "", "MongoDB"];
/** Index of the cache node in copy.signature.architecture. */
const CACHE = 2;

/**
 * Before / after bars on a relative scale (the only confirmed number is ~60%): "Before" is full width,
 * "After" shrinks to 40% when it scrolls into view. Transform only, so reduced motion shows the end state.
 */
function BeforeAfterBars() {
  const copy = useCopy();
  const { chart } = copy.signature;
  const rtl = copy.dir === "rtl";

  return (
    <figure className="mt-8">
      <div className="space-y-3" aria-hidden="true">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-medium text-muted">{chart.before}</span>
          <span className="block h-3 rounded-full bg-text/20" />
        </div>
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3">
          <span className="text-xs font-medium text-muted">{chart.after}</span>
          <span className="block h-3 rounded-full bg-text/[0.06]">
            <motion.span
              className="block h-full rounded-full bg-accent"
              style={{ originX: rtl ? 1 : 0 }}
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0.4 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">{chart.caption}</figcaption>
    </figure>
  );
}

/** Client → API → Cache → Data as one line; a cache hit returns early, a miss goes on to MongoDB. */
function RequestPath() {
  const copy = useCopy();
  const s = copy.signature;

  return (
    <ol className="mt-5 flex flex-col gap-0 sm:flex-row sm:items-stretch" aria-label={s.architectureTitle}>
      {s.architecture.map((node, i) => {
        const cache = i === CACHE;
        return (
          <Fragment key={node.name}>
            {i > 0 ? (
              // A connector between two nodes: down on phones, start → end from sm. The miss label sits on the last one.
              <li aria-hidden="true" className="flex items-center gap-2 py-1 ps-5 text-accent/70 dark:text-cyan-300/80 sm:flex-col sm:justify-center sm:gap-1 sm:px-1.5 sm:py-0">
                <ArrowRight className="h-3.5 w-3.5 shrink-0 rotate-90 sm:rotate-0 sm:rtl:rotate-180" strokeWidth={2.25} />
                {i === CACHE + 1 ? <span className="font-mono text-[10px] leading-none text-muted">{s.path.miss}</span> : null}
              </li>
            ) : null}
            <li
              className={`min-w-0 rounded-xl border px-3 py-2.5 sm:flex-1 ${
                cache ? "border-cyan-600/40 bg-cyan-500/[0.06] dark:border-cyan-400/40" : "border-line/20 bg-card/60"
              }`}
            >
              <p className={`text-sm font-semibold ${cache ? "text-cyan-700 dark:text-cyan-300" : ""}`}>{node.name}</p>
              {PATH_TECH[i] ? (
                <p className="mt-0.5 font-mono text-[11px] text-muted" dir="ltr">
                  <span className="rtl:block rtl:text-right">{PATH_TECH[i]}</span>
                </p>
              ) : null}
              {cache ? (
                <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-cyan-700 dark:text-cyan-300">
                  <CornerDownLeft className="mt-px h-3 w-3 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
                  {s.path.hit}
                </p>
              ) : null}
              <span className="sr-only">: {node.detail}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

export function SignatureCase() {
  const copy = useCopy();
  const s = copy.signature;
  const metric = s.metrics[0];

  const steps = [
    {
      title: s.problemTitle,
      body: (
        <p>
          <Bidi text={s.problem} />
        </p>
      )
    },
    {
      title: s.solutionTitle,
      body: (
        <>
          <p>
            <Bidi text={s.solution} />
          </p>
          <RequestPath />
        </>
      )
    },
    {
      title: s.lessonsTitle,
      body: (
        <ul className="space-y-2">
          {s.lessons.map((l) => (
            <li key={l} className="flex gap-2.5">
              <span className="inline-block text-accent-ink rtl:-scale-x-100" aria-hidden="true">
                →
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <section
      id="case-study"
      className="section cv-auto scroll-mt-24 [--cv-h:1900px] md:[--cv-h:1500px] lg:[--cv-h:1150px]"
      aria-labelledby="signature-title"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="eyebrow">{s.eyebrow}</p>
                {s.company ? (
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-text/80">
                    <Building2 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    {s.company}
                  </p>
                ) : null}
              </div>
              <h2 id="signature-title" className="text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.08] rtl:leading-[1.3]">
                <Bidi text={s.title} />
              </h2>
              <p className="mt-5 text-pretty text-muted md:text-lg">
                <Bidi text={s.summary} />
              </p>
            </Reveal>

            {metric ? (
              <Reveal delay={0.1} className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{s.metricsTitle}</p>
                {/* The number is the hero of the section: one of the three gradient accents on the page. */}
                <p className="mt-1 font-display text-[clamp(5rem,12vw,10rem)] font-semibold leading-[0.95] tracking-[-0.04em] tabular-nums">
                  <bdi className="gradient-text">{metric.value}</bdi>
                </p>
                <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted">
                  <Bidi text={metric.label} />
                </p>
                <BeforeAfterBars />
              </Reveal>
            ) : null}
          </div>

          <ol className="border-b hairline">
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={0.05}
                className="border-t py-7 [border-top-color:rgb(var(--line)/var(--line-alpha))] md:py-9"
              >
                <h3 className="flex items-baseline gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
                  <span className="font-mono text-sm font-normal tracking-normal text-accent-ink">0{i + 1}</span>
                  {step.title}
                </h3>
                <div className="mt-4 text-pretty text-[15px] leading-relaxed text-text/85 md:text-base">{step.body}</div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
