"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Lightbulb, ShieldAlert, Wrench } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { Reveal } from "@/components/ui/primitives";

export function SignatureCase() {
  const copy = useCopy();
  const s = copy.signature;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = [
    { icon: ShieldAlert, title: s.problemTitle, body: <p>{s.problem}</p> },
    {
      icon: Wrench,
      title: s.constraintsTitle,
      body: (
        <ul className="space-y-2">
          {s.constraints.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      )
    },
    {
      icon: Lightbulb,
      title: s.solutionTitle,
      body: (
        <>
          <p>{s.solution}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {s.architecture.map((a) => (
              <div key={a.name} className="rounded-xl border hairline bg-surface/50 p-3">
                <p className="text-xs font-semibold text-accent-ink">{a.name}</p>
                <p className="mt-1 text-[13px] text-muted">{a.detail}</p>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      icon: CheckCircle2,
      title: s.lessonsTitle,
      body: (
        <ul className="space-y-2">
          {s.lessons.map((l) => (
            <li key={l} className="flex gap-2">
              <span className="text-accent" aria-hidden="true">→</span>
              {l}
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <section className="section" aria-labelledby="signature-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-4">{s.eyebrow}</p>
              <h2 id="signature-title" className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05]">
                {s.title}
              </h2>
              <p className="mt-5 text-muted md:text-lg">{s.summary}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 grid grid-cols-2 gap-3">
              {s.metrics.map((m) => (
                <div key={m.label} className="card p-5">
                  <p className="gradient-text font-display text-4xl font-semibold tracking-tight">{m.value}</p>
                  <p className="mt-1 text-xs text-muted">{m.label}</p>
                </div>
              ))}
            </Reveal>
          </div>

          <div ref={ref} className="relative">
            <div className="absolute bottom-0 start-5 top-0 w-px bg-line/10" aria-hidden="true" />
            <motion.div
              className="absolute start-5 top-0 h-full w-px origin-top bg-gradient-to-b from-violet-500 to-cyan-400"
              style={{ scaleY: lineScale }}
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={0.05} className="relative ps-16">
                    <span className="absolute start-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border hairline bg-card text-accent shadow-lg">
                      <step.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="card p-6 md:p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        0{i + 1} · {step.title}
                      </p>
                      <div className="mt-3 text-[15px] leading-relaxed text-text/85">{step.body}</div>
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
