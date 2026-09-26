"use client";

import { Bot, Code2, Container, Server, Wrench } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { Reveal, SectionHeader } from "@/components/ui/primitives";

const ICONS = [Code2, Server, Bot, Container, Wrench];
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export function Skills() {
  const copy = useCopy();

  return (
    <section id="skills" className="section">
      <div className="shell">
        <SectionHeader eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {copy.skillsGroups.map((group, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={group.name} delay={i * 0.06} className={`${SPANS[i] ?? "lg:col-span-2"} ${i === copy.skillsGroups.length - 1 && i % 2 === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                <div className="card spotlight card-hover group h-full p-6" onPointerMove={trackPointer}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border hairline bg-surface/60 px-3 py-1.5 text-[13px] text-text/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-text"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
