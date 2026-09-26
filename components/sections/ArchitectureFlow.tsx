"use client";

import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { FlowStage } from "@/lib/projects";

/*
 * A project's architecture as live HTML, not a scaled-down picture: labels stay 11–13px at every card
 * width and follow the locale. Narrow cards stack the stages as rows (top to bottom); wide cards lay them
 * out as columns (start to end). Featured cards switch at md, the others at lg, so every class set below
 * is written out in full for Tailwind.
 */
const LAYOUT = {
  // The featured card's media area is large (it stretches beside the text), so its flow is set larger.
  featured: {
    root: "md:flex-row md:items-stretch md:gap-3",
    stage: "md:min-w-0 md:flex-1 md:flex-col md:justify-center md:gap-2.5",
    label: "md:w-auto md:pt-0 md:text-[11px]",
    nodes: "md:flex-col md:flex-nowrap md:gap-2",
    node: "md:rounded-2xl md:px-3.5 md:py-3",
    name: "md:block md:text-sm lg:text-[15px]",
    sep: "md:hidden",
    note: "md:mt-1 md:block md:text-xs",
    connector: "md:ps-0 md:self-center",
    arrow: "md:h-4 md:w-4 md:rotate-0 md:rtl:rotate-180"
  },
  card: {
    root: "lg:flex-row lg:items-stretch lg:gap-2",
    stage: "lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-center lg:gap-2",
    label: "lg:w-auto lg:pt-0",
    nodes: "lg:flex-col lg:flex-nowrap",
    node: "lg:px-2.5 lg:py-2",
    name: "lg:block",
    sep: "lg:hidden",
    note: "lg:mt-0.5 lg:block lg:text-[11px]",
    connector: "lg:ps-0 lg:self-center",
    arrow: "lg:rotate-0 lg:rtl:rotate-180"
  }
} as const;

/** One accent per stage, in the site's violet → blue → cyan order. */
const TONES = [
  { label: "text-violet-700 dark:text-violet-300", node: "border-violet-500/25", dot: "bg-violet-500" },
  { label: "text-blue-700 dark:text-blue-300", node: "border-blue-500/25", dot: "bg-blue-500" },
  { label: "text-cyan-700 dark:text-cyan-300", node: "border-cyan-500/30", dot: "bg-cyan-400" }
];

export function ArchitectureFlow({ stages, featured = false }: { stages: FlowStage[]; featured?: boolean }) {
  const L = featured ? LAYOUT.featured : LAYOUT.card;

  return (
    <div className={`relative flex w-full flex-col gap-1 ${L.root}`}>
      {stages.map((stage, i) => {
        const tone = TONES[Math.min(i, TONES.length - 1)];
        return (
          <Fragment key={`${stage.label}-${i}`}>
            <div className={`flex items-start gap-3 ${L.stage}`}>
              <p
                className={`w-[4.75rem] shrink-0 pt-[7px] text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] rtl:tracking-normal ${tone.label} ${L.label}`}
              >
                {stage.label}
              </p>
              <div className={`flex min-w-0 flex-1 flex-wrap gap-1.5 ${L.nodes}`}>
                {stage.nodes.map((node) => (
                  <div
                    key={node.name}
                    className={`rounded-xl border bg-card/90 px-2.5 py-1.5 text-[12px] leading-snug shadow-[0_8px_24px_-18px_rgb(0_0_0/0.6)] transition-colors duration-500 group-hover:border-accent/40 ${tone.node} ${L.node}`}
                  >
                    <span className={`font-semibold text-text ${L.name}`}>
                      <span className={`me-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full align-middle ${tone.dot}`} />
                      <bdi>{node.name}</bdi>
                    </span>
                    {node.note ? (
                      <>
                        <span className={`text-muted ${L.sep}`}> · </span>
                        <span className={`text-muted ${L.note}`}>{node.note}</span>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {i < stages.length - 1 ? (
              // Rows: a down arrow under the node column. Columns: a start → end arrow between stages.
              <div className={`flex ps-[5.5rem] text-cyan-600/80 dark:text-cyan-300/80 ${L.connector}`}>
                <ArrowRight className={`h-3.5 w-3.5 shrink-0 rotate-90 ${L.arrow}`} strokeWidth={2.25} />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
