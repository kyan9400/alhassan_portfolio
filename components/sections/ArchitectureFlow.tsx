"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { FlowStage } from "@/lib/projects";

/*
 * A project's architecture as live HTML, not a scaled-down picture: labels stay 11–13px at every card
 * width and follow the locale. Narrow cards stack the stages as rows (top to bottom); wide cards lay them
 * out as columns (start to end). Featured cards switch at md, the others at lg, and `layout="rows"` never
 * switches (the phone view of a case-study page). Every class set is written out in full for Tailwind.
 */
const LAYOUT = {
  // The featured card's media area is large (it stretches beside the text), so its flow is set larger.
  featured: {
    root: "md:flex-row md:items-stretch md:gap-0",
    stage: "md:min-w-0 md:flex-1 md:flex-col md:justify-start md:gap-2.5",
    label: "md:w-auto md:pt-0 md:text-[11px]",
    nodes: "md:flex-col md:flex-nowrap md:gap-2",
    node: "md:rounded-2xl md:px-3.5 md:py-3",
    module: "md:px-3 md:py-2",
    modules: "md:flex-col",
    colsPad: "md:pt-11",
    name: "md:block md:text-sm lg:text-[15px]",
    sep: "md:hidden",
    note: "md:mt-1 md:block md:text-xs",
    rows: "md:hidden",
    cols: "hidden md:flex"
  },
  card: {
    root: "lg:flex-row lg:items-stretch lg:gap-0",
    stage: "lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-start lg:gap-2",
    label: "lg:w-auto lg:pt-0",
    nodes: "lg:flex-col lg:flex-nowrap",
    node: "lg:px-2.5 lg:py-2",
    module: "",
    modules: "",
    colsPad: "lg:pt-9",
    name: "lg:block",
    sep: "lg:hidden",
    note: "lg:mt-0.5 lg:block lg:text-[11px]",
    rows: "lg:hidden",
    cols: "hidden lg:flex"
  },
  rows: {
    root: "",
    stage: "",
    label: "",
    nodes: "",
    node: "",
    module: "",
    modules: "",
    colsPad: "",
    name: "",
    sep: "",
    note: "",
    rows: "",
    cols: "hidden"
  }
} as const;

/** One accent per stage (violet → blue → cyan). Light theme: neutral node borders, the tone stays on the label. */
const TONES = [
  { label: "text-violet-700 dark:text-violet-300", node: "dark:border-violet-500/30", dot: "bg-violet-500" },
  { label: "text-blue-700 dark:text-blue-300", node: "dark:border-blue-500/30", dot: "bg-blue-500" },
  { label: "text-cyan-700 dark:text-cyan-300", node: "dark:border-cyan-500/35", dot: "bg-cyan-400" }
];

/** Data-flow lines: accent in the light theme, cyan in the dark one (cyan = data flow / live). */
const CONNECTOR = "text-accent/70 dark:text-cyan-300/80";

/** Sets data-inview on the root while it is on screen, so the flow dashes only animate then. */
function useInViewAttr() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export function ArchitectureFlow({
  stages,
  featured = false,
  layout
}: {
  stages: FlowStage[];
  featured?: boolean;
  /** "rows" keeps the stacked (top to bottom) layout at every width. */
  layout?: "rows";
}) {
  const L = layout === "rows" ? LAYOUT.rows : featured ? LAYOUT.featured : LAYOUT.card;
  const { ref, inView } = useInViewAttr();

  return (
    <div ref={ref} data-inview={inView} className={`relative flex w-full flex-col gap-1 ${L.root}`}>
      {stages.map((stage, i) => {
        const tone = TONES[Math.min(i, TONES.length - 1)];
        const main = stage.nodes.filter((n) => !n.module);
        const modules = stage.nodes.filter((n) => n.module);
        return (
          <Fragment key={`${stage.label}-${i}`}>
            <div className={`flex items-start gap-3 ${L.stage}`}>
              <p
                className={`w-[4.75rem] shrink-0 pt-[7px] text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] rtl:tracking-normal ${tone.label} ${L.label}`}
              >
                {stage.label}
              </p>
              <div className={`flex min-w-0 flex-1 flex-wrap gap-1.5 ${L.nodes}`}>
                {main.map((node) => (
                  <div
                    key={node.name}
                    className={`rounded-xl border border-line/25 bg-card/90 px-2.5 py-1.5 text-[12px] leading-snug shadow-[0_8px_24px_-18px_rgb(0_0_0/0.6)] transition-colors duration-500 group-hover:border-accent/40 ${tone.node} ${L.node}`}
                  >
                    <span className={`font-semibold text-text ${L.name}`}>
                      <span className={`me-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full align-middle ${tone.dot}`} />
                      <bdi>{node.name}</bdi>
                    </span>
                    {node.note ? (
                      <>
                        <span className={`text-muted ${L.sep}`}> · </span>
                        <span className={`text-muted ${L.note}`}>
                          <bdi>{node.note}</bdi>
                        </span>
                      </>
                    ) : null}
                  </div>
                ))}
                {modules.length ? (
                  // The stage's sub-parts (e.g. API modules): smaller chips, grouped under the main node.
                  <ul className={`flex flex-wrap gap-1.5 ${L.modules}`}>
                    {modules.map((node) => (
                      <li
                        key={node.name}
                        className={`rounded-lg border border-line/20 bg-surface/70 px-2 py-1 text-[11px] font-medium leading-snug text-text/85 ${L.module}`}
                      >
                        <bdi>{node.name}</bdi>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {i < stages.length - 1 ? (
              <>
                {/* Rows: a dashed line down to the next stage, with the edge label beside it. */}
                <div className={`flex items-center gap-2 ps-[5.35rem] ${CONNECTOR} ${L.rows}`}>
                  <span className="flex flex-col items-center">
                    <span className="flow-dash h-4 w-px" />
                    <ChevronDown className="-mt-1.5 h-3.5 w-3.5" strokeWidth={2.25} />
                  </span>
                  {stage.edge ? <span className="font-mono text-[10px] leading-tight text-muted">{stage.edge}</span> : null}
                </div>
                {/* Columns: a dashed line start → end between stages, the edge label under it. */}
                <div
                  className={`shrink-0 flex-col items-center justify-start gap-1.5 px-1 ${stage.edge ? "w-16" : "w-7"} ${CONNECTOR} ${L.colsPad} ${L.cols}`}
                >
                  <span className="flex w-full items-center">
                    <span className="flow-dash flow-dash-x h-px flex-1" />
                    <ChevronRight className="-ms-1.5 h-3.5 w-3.5 shrink-0 rtl:rotate-180" strokeWidth={2.25} />
                  </span>
                  {stage.edge ? (
                    <span className="text-center font-mono text-[10px] leading-tight text-muted">
                      {stage.edge.split(" · ").map((part) => (
                        <span key={part} className="block">
                          {part}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
              </>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
