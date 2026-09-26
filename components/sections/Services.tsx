"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowDown, BarChart3, Bot, Gauge, Layers, LayoutDashboard, ListChecks } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Bidi, Reveal, SectionHeader } from "@/components/ui/primitives";

const ICONS = [LayoutDashboard, Bot, BarChart3, Gauge];
// Bento spans for the 4 services on large screens.
const SPANS = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

export function Services() {
  const copy = useCopy();

  return (
    <section id="services" className="section cv-auto [--cv-h:2200px] md:[--cv-h:1720px] lg:[--cv-h:1600px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} description={copy.availableBody} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {copy.servicesItems.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={s.title} delay={i * 0.06} className={SPANS[i] ?? "lg:col-span-3"}>
                <article className="card spotlight card-hover group h-full overflow-hidden p-6 sm:p-7 md:p-8" onPointerMove={trackPointer}>
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-accent ring-1 ring-accent/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 md:mb-10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-muted">
                    <Bidi text={s.description} />
                  </p>
                  {/* In the top corner beside the icon, so it never sits behind the text. */}
                  <span
                    className="pointer-events-none absolute end-6 top-5 font-display text-5xl font-bold leading-none text-text/[0.06] transition-colors duration-500 group-hover:text-accent/20 sm:end-7 sm:top-6 md:end-8 md:top-7"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </article>
              </Reveal>
            );
          })}

          <Reveal className="sm:col-span-2 lg:col-span-6">
            <ApproachTabs />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;
const panelVariants: Variants = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.07, delayChildren: 0.05 } }
};
const itemVariants: Variants = {
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }
};

/**
 * "How I build" (the 4 system layers) and "How I work" (habits) in one card with two tabs,
 * instead of two stacked blocks. WAI-ARIA tabs pattern: roving tabindex, arrow keys
 * (mirrored in RTL), Home/End, automatic activation.
 */
function ApproachTabs() {
  const copy = useCopy();
  const baseId = useId();
  const [active, setActive] = useState(0);
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -15% 0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs = [
    { key: "build", label: copy.systemMapEyebrow, icon: Layers },
    { key: "work", label: copy.howIWork.eyebrow, icon: ListChecks }
  ];
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = copy.dir === "rtl" ? -1 : 1;
    let next: number;
    if (e.key === "ArrowRight") next = i + step;
    else if (e.key === "ArrowLeft") next = i - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    next = (next + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const stateFor = (i: number) => (inView && active === i ? "show" : "hide");

  return (
    <article ref={cardRef} className="card overflow-hidden p-5 sm:p-7 md:p-10">
      <div
        className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div role="tablist" aria-label={copy.ui.approachTabsLabel} className="relative inline-flex max-w-full gap-1 rounded-full border border-line/10 bg-surface/60 p-1">
        {tabs.map((t, i) => {
          const selected = active === i;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(i)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5 ${
                selected ? "text-white" : "text-muted hover:text-text"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-pill`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 shadow-[0_8px_24px_-10px_rgb(124_58_237/0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              ) : null}
              <t.icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel 1 — How I build: four layers, top to bottom. */}
      <div
        role="tabpanel"
        id={panelId(0)}
        aria-labelledby={tabId(0)}
        hidden={active !== 0}
        tabIndex={0}
        className="relative mt-8 rounded-2xl md:mt-10"
      >
        <motion.div
          initial="hide"
          animate={stateFor(0)}
          variants={panelVariants}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-balance text-2xl font-semibold md:text-3xl">{copy.systemMapTitle}</h3>
            <p className="mt-4 text-pretty text-muted">{copy.systemMapDescription}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-muted">
              <ArrowDown className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {copy.flowLabel}
            </p>
          </motion.div>
          <ol className="space-y-3">
            {copy.mapLayers.map((layer, i) => (
              <motion.li
                key={layer.label}
                variants={itemVariants}
                className="relative flex items-center gap-4 rounded-2xl border border-line/10 bg-surface/50 p-3 transition-colors hover:border-accent/40 hover:bg-accent/5 sm:p-4"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-sm font-bold text-white">
                  L{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{layer.label}</p>
                  <p className="text-pretty text-sm text-muted">
                    <Bidi text={layer.detail} />
                  </p>
                </div>
                {/* Connector to the next layer, through the gap: data flows top to bottom. */}
                {i < copy.mapLayers.length - 1 ? (
                  <span
                    className="absolute start-[31.5px] top-full h-[13px] w-px bg-gradient-to-b from-violet-500 to-cyan-400 sm:start-[35.5px]"
                    aria-hidden="true"
                  />
                ) : null}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* Panel 2 — How I work: habits. */}
      <div
        role="tabpanel"
        id={panelId(1)}
        aria-labelledby={tabId(1)}
        hidden={active !== 1}
        tabIndex={0}
        className="relative mt-8 rounded-2xl md:mt-10"
      >
        <motion.div
          initial="hide"
          animate={stateFor(1)}
          variants={panelVariants}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-balance text-2xl font-semibold md:text-3xl">{copy.howIWork.title}</h3>
            <p className="mt-4 text-pretty text-muted">{copy.howIWork.description}</p>
          </motion.div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {copy.howIWork.items.map((step, i) => (
              <motion.li
                key={step.title}
                variants={itemVariants}
                className="group rounded-2xl border border-line/10 bg-surface/50 p-5 transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-sm font-semibold text-accent">0{i + 1}</span>
                  <span
                    className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent transition-colors duration-700 group-hover:from-accent rtl:bg-gradient-to-l"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-semibold">{step.title}</p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </article>
  );
}
