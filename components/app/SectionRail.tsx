"use client";

import { usePathname } from "next/navigation";
import { SECTION_IDS, useActiveSection, useCopy, useSections } from "@/lib/hooks";
import { scrollToId } from "./SmoothScroll";

/**
 * Desktop section navigation on the home page: a slim column of hairline ticks fixed to the inline-end
 * edge (right in LTR, left in RTL), vertically centred. The tick of the section in view is longer and
 * in the accent colour (aria-current="location"); a section's name appears beside its tick on hover or
 * keyboard focus. It shares the navbar's active-section logic (useActiveSection).
 *
 * - lg+ only: phones and tablets have the navbar menu instead.
 * - Hidden (and out of the tab order, `inert`) while the hero is the active section.
 * - It sits in the page gutter: the ticks are at most 16px wide and 4px from the edge below xl, where
 *   the shell's 24px padding is the only gutter, and 20px from the edge from xl, where the gutter is
 *   64px+ (1280) and 144px (1440). Labels only show while the rail is being used.
 * - Transitions are CSS and are dropped for reduced motion (motion-reduce:).
 */
export function SectionRail() {
  const copy = useCopy();
  const sections = useSections();
  const pathname = usePathname();
  const active = useActiveSection(SECTION_IDS, pathname);
  const hidden = active === "hero";

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <nav
      aria-label={copy.ui.sectionRail.label}
      inert={hidden}
      aria-hidden={hidden || undefined}
      className={`fixed end-1 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 motion-reduce:transition-none lg:block xl:end-5 print:hidden ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <ul className="flex flex-col items-end">
        {sections
          .filter((s) => s.id !== "hero")
          .map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  aria-current={isActive ? "location" : undefined}
                  className="group/item relative flex h-7 w-6 items-center justify-end rounded-md outline-offset-2 focus-visible:outline-2"
                >
                  {/* The name (also the link's accessible name): visible while the item is hovered or keyboard-focused. */}
                  <span
                    className={`pointer-events-none absolute end-full me-2 whitespace-nowrap rounded-full border hairline bg-card/90 px-2.5 py-1 text-[11px] font-medium opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-200 motion-reduce:transition-none group-hover/item:opacity-100 group-focus-visible/item:opacity-100 ${
                      isActive ? "text-text" : "text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`block rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                      isActive ? "h-[2px] w-4 bg-accent" : "h-px w-2 bg-muted/50 group-hover/item:w-3 group-hover/item:bg-text/80 group-focus-visible/item:w-3"
                    }`}
                  />
                </a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
