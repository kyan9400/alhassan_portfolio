"use client";

import { motion } from "framer-motion";
import { BarChart3, Bot, Globe, Layers, LayoutDashboard } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Reveal, SectionHeader } from "@/components/ui/primitives";

const ICONS = [LayoutDashboard, Bot, BarChart3, Globe];
// Bento spans for the 4 services on large screens.
const SPANS = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

export function Services() {
  const copy = useCopy();

  return (
    <section id="services" className="section">
      <div className="shell">
        <SectionHeader eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} description={copy.availableBody} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {copy.servicesItems.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={s.title} delay={i * 0.06} className={`${SPANS[i] ?? "lg:col-span-3"}`}>
                <article className="card spotlight card-hover group h-full overflow-hidden p-7 md:p-8" onPointerMove={trackPointer}>
                  <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-accent ring-1 ring-accent/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{s.description}</p>
                  <span className="pointer-events-none absolute -bottom-6 -end-2 font-display text-[7rem] font-bold leading-none text-text/[0.03] transition-colors duration-500 group-hover:text-accent/10" aria-hidden="true">
                    0{i + 1}
                  </span>
                </article>
              </Reveal>
            );
          })}

          {/* How I build: the 4 layers as a live stack */}
          <Reveal className="sm:col-span-2 lg:col-span-6">
            <article className="card overflow-hidden p-7 md:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="eyebrow mb-4">
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.systemMapEyebrow}
                  </p>
                  <h3 className="text-2xl font-semibold md:text-3xl">{copy.systemMapTitle}</h3>
                  <p className="mt-4 text-muted">{copy.systemMapDescription}</p>
                </div>
                <ol className="space-y-3">
                  {copy.mapLayers.map((layer, i) => (
                    <motion.li
                      key={layer.label}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-center gap-4 rounded-2xl border hairline bg-surface/50 p-4 transition hover:border-accent/40 hover:bg-accent/5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-sm font-bold text-white">
                        L{i + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{layer.label}</p>
                        <p className="text-sm text-muted">{layer.detail}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Habits — interactive process steps */}
        <div className="mt-24">
          <SectionHeader eyebrow={copy.howIWork.eyebrow} title={copy.howIWork.title} description={copy.howIWork.description} />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {copy.howIWork.items.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="card spotlight card-hover group h-full p-6" onPointerMove={trackPointer}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="font-display text-sm font-semibold text-accent">0{i + 1}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent transition-all duration-700 group-hover:from-accent rtl:bg-gradient-to-l" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
