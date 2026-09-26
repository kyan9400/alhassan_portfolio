"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { Building2, Compass, Lightbulb, ShieldAlert } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { useElementScrollProgress } from "@/lib/scroll";
import { Bidi, Reveal } from "@/components/ui/primitives";

/** Metric grid that reads well with 1–4 metrics: an odd count gives the first metric a full row. */
function metricsLayout(count: number) {
  if (count <= 1) return { grid: "grid-cols-1", first: "" };
  if (count === 2) return { grid: "grid-cols-2", first: "" };
  if (count === 3) return { grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-2", first: "col-span-2 sm:col-span-1 lg:col-span-2" };
  return { grid: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-2", first: "" };
}

export function SignatureCase() {
  const copy = useCopy();
  const s = copy.signature;
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useElementScrollProgress(ref, 0.7, 0.6);
  const lineScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const layout = metricsLayout(s.metrics.length);

  // Only what the CV confirms: the endpoint, the two changes, the stack and the ~60% result. The last
  // step is framed as general approach, not as further claims about this project.
  const steps = [
    {
      icon: ShieldAlert,
      title: s.problemTitle,
      body: (
        <p>
          <Bidi text={s.problem} />
        </p>
      )
    },
    {
      icon: Lightbulb,
      title: s.solutionTitle,
      body: (
        <>
          <p>
            <Bidi text={s.solution} />
          </p>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{s.architectureTitle}</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {s.architecture.map((a) => (
              <li key={a.name} className="rounded-xl border border-line/10 bg-surface/50 p-3">
                <p className="text-xs font-semibold text-accent-ink">{a.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  <Bidi text={a.detail} />
                </p>
              </li>
            ))}
          </ol>
        </>
      )
    },
    {
      icon: Compass,
      title: s.lessonsTitle,
      body: (
        <ul className="space-y-2">
          {s.lessons.map((l) => (
            <li key={l} className="flex gap-2.5">
              <span className="inline-block text-accent rtl:-scale-x-100" aria-hidden="true">
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
    <section className="section cv-auto [--cv-h:1800px] md:[--cv-h:1450px] lg:[--cv-h:1100px]" aria-labelledby="signature-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="eyebrow">{s.eyebrow}</p>
                {s.company ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full border border-line/10 bg-surface/60 px-2.5 py-1 text-xs font-medium text-text/80">
                    <Building2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {s.company}
                  </p>
                ) : null}
              </div>
              <h2 id="signature-title" className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] rtl:leading-[1.25]">
                <Bidi text={s.title} />
              </h2>
              <p className="mt-5 text-pretty text-muted md:text-lg">
                <Bidi text={s.summary} />
              </p>
            </Reveal>

            {s.metrics.length > 0 ? (
              <Reveal delay={0.1} className="mt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{s.metricsTitle}</p>
                <dl className={`grid gap-3 ${layout.grid}`}>
                  {s.metrics.map((metric, i) => (
                    <div
                      key={metric.label}
                      className={`card flex flex-col-reverse justify-end p-5 ${i === 0 ? `${layout.first} border-accent/30 shadow-[0_30px_70px_-40px_rgb(var(--glow)/0.7)]` : ""}`}
                    >
                      <dt className="mt-1.5 text-pretty text-xs leading-relaxed text-muted">{metric.label}</dt>
                      <dd className="gradient-text font-display text-4xl font-semibold tracking-tight" dir="ltr">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>

          <div ref={ref} className="relative">
            <div className="absolute bottom-0 start-5 top-0 w-px bg-line/10" aria-hidden="true" />
            <motion.div
              className="absolute start-5 top-0 h-full w-px origin-top bg-gradient-to-b from-violet-500 to-cyan-400 motion-reduce:!transform-none"
              style={{ scaleY: lineScale }}
              aria-hidden="true"
            />
            <ol className="space-y-6 md:space-y-8">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={0.05} className="relative ps-14 md:ps-16">
                  <span className="absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-line/10 bg-card text-accent shadow-lg">
                    <step.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="card p-5 sm:p-6 md:p-7">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
                      <span className="text-accent-ink">0{i + 1}</span> · {step.title}
                    </h3>
                    <div className="mt-3 text-pretty text-[15px] leading-relaxed text-text/85">{step.body}</div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
