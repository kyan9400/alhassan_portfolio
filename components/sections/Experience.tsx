"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useCopy } from "@/lib/hooks";
import { Reveal, SectionHeader } from "@/components/ui/primitives";

export function Experience() {
  const copy = useCopy();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHeader eyebrow={copy.experienceEyebrow} title={copy.experienceTitle} description={copy.experienceDescription} />
        <ol ref={ref} className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-2 start-[7px] top-2 w-px bg-line/10 md:start-1/2" aria-hidden="true" />
          <motion.div
            className="absolute start-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-violet-500 to-cyan-400 md:start-1/2"
            style={{ scaleY: scrollYProgress }}
            aria-hidden="true"
          />
          {copy.experienceItems.map((item, i) => (
            <Reveal as="li" key={`${item.company}-${item.period}`} delay={0.05} className={`relative mb-10 ps-10 md:w-1/2 md:ps-0 ${i % 2 === 0 ? "md:pe-12" : "md:ms-auto md:ps-12"}`}>
              <span
                className={`absolute start-0 top-6 h-[15px] w-[15px] rounded-full border-[3px] border-bg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_0_4px_rgb(var(--accent)/0.2)] ${
                  i % 2 === 0 ? "md:-end-[7.5px] md:start-auto" : "md:-start-[7.5px]"
                }`}
                aria-hidden="true"
              />
              <div className="card card-hover p-6">
                <p className="font-display text-sm font-semibold text-accent-ink">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.company}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-text/80">{item.impact}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
