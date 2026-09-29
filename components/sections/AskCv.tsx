"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { useCopy, useLocale, useLocalePath } from "@/lib/hooks";
import { Bidi } from "@/components/ui/primitives";
import type { Locale } from "@/lib/types";

/** The search code (and the passage index it builds) loads on first interaction, not with the page. */
type Engine = typeof import("@/lib/ask-cv");
let enginePromise: Promise<Engine> | null = null;
function loadEngine() {
  return (enginePromise ??= import("@/lib/ask-cv"));
}

/** Event the command palette sends to focus the question box (after scrolling to it). */
export const ASK_CV_FOCUS_EVENT = "ask-cv:focus";
export const ASK_CV_ID = "ask";

type Row = { id: string; href: string; sourceLabel: string; parts: { text: string; match: boolean }[] };
type Answer = { query: string; locale: Locale; rows: Row[] | null };

/** Delay after the last keystroke before searching as you type. */
const TYPE_DELAY = 220;

/**
 * "Ask my CV": a question box that answers only with passages from the site's own facts (lib/ask-cv.ts).
 * Nothing is generated and nothing leaves the browser. Phones show a single input row until it is used.
 */
export function AskCv() {
  const copy = useCopy();
  const t = copy.ui.askCv;
  const locale = useLocale();
  const lp = useLocalePath();
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [expanded, setExpanded] = useState(false);
  const requestRef = useRef(0);

  const run = useCallback(
    async (text: string) => {
      const q = text.trim();
      const request = ++requestRef.current;
      if (!q) {
        setAnswer(null);
        return;
      }
      const engine = await loadEngine();
      if (request !== requestRef.current) return;
      const result = engine.askCv(locale, q);
      setAnswer({
        query: q,
        locale,
        rows:
          result.status === "ok"
            ? result.results.map(({ passage }) => ({
                id: passage.id,
                href: passage.href,
                sourceLabel: passage.sourceLabel,
                parts: engine.highlight(passage.text, result.terms)
              }))
            : null
      });
    },
    [locale]
  );

  // Search as you type, after a short pause.
  useEffect(() => {
    if (!query.trim()) return;
    const timer = window.setTimeout(() => void run(query), TYPE_DELAY);
    return () => window.clearTimeout(timer);
  }, [query, run]);

  // The command palette's "Ask my CV…" (on this page), or arriving at /{lang}#ask.
  useEffect(() => {
    const focus = () => {
      setExpanded(true);
      void loadEngine();
      inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(ASK_CV_FOCUS_EVENT, focus);
    if (window.location.hash === `#${ASK_CV_ID}`) focus();
    return () => window.removeEventListener(ASK_CV_FOCUS_EVENT, focus);
  }, []);

  const ask = (text: string) => {
    setQuery(text);
    setExpanded(true);
    void run(text);
  };

  const clear = () => {
    setQuery("");
    void run("");
    inputRef.current?.focus();
  };

  // An answer computed for another language (after switching) is not shown.
  const current = answer && answer.locale === locale ? answer : null;
  const open = expanded || Boolean(query);
  const statusText = current ? (current.rows ? t.status.replace("{n}", String(current.rows.length)) : t.noAnswer) : "";

  const examples = (
    <ul className="flex flex-wrap gap-2" aria-label={t.examplesLabel}>
      {t.examples.map((example) => (
        <li key={example}>
          <button
            type="button"
            onClick={() => ask(example)}
            className="min-h-[36px] rounded-full border px-3 py-1.5 text-start text-[13px] text-muted transition-colors [border-color:rgb(var(--line)/var(--line-alpha))] hover:text-text hover:[border-color:rgb(var(--accent)/0.45)] motion-reduce:transition-none"
          >
            <Bidi text={example} />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section id={ASK_CV_ID} aria-labelledby={`${uid}-title`} className="relative scroll-mt-24 py-4 sm:py-10 md:py-14">
      <div className="shell">
        <div className="grid gap-x-8 gap-y-3 border-y hairline py-4 sm:gap-y-5 sm:py-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="max-sm:sr-only">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-ink rtl:tracking-normal">{t.eyebrow}</p>
            <h2 id={`${uid}-title`} className="mt-2 text-balance font-display text-xl font-semibold leading-snug md:text-2xl">
              {t.title}
            </h2>
            <p id={`${uid}-note`} className="mt-2 text-pretty text-sm leading-relaxed text-muted">
              {t.note}
            </p>
          </div>

          <div className="min-w-0">
            <form
              role="search"
              aria-labelledby={`${uid}-title`}
              onSubmit={(e) => {
                e.preventDefault();
                setExpanded(true);
                void run(query);
              }}
              onPointerEnter={() => void loadEngine()}
            >
              <label htmlFor={`${uid}-input`} className="sr-only">
                {t.inputLabel}
              </label>
              <div className="flex items-center gap-2 rounded-2xl border bg-surface/50 px-3 transition-colors [border-color:rgb(var(--line)/0.12)] focus-within:[border-color:rgb(var(--accent)/0.6)] motion-reduce:transition-none sm:px-4">
                <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  id={`${uid}-input`}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={200}
                  value={query}
                  placeholder={t.placeholder}
                  aria-describedby={`${uid}-note`}
                  aria-controls={`${uid}-results`}
                  onFocus={() => {
                    setExpanded(true);
                    void loadEngine();
                  }}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!e.target.value.trim()) void run("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && query) {
                      e.preventDefault();
                      clear();
                    }
                  }}
                  className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-muted/70 max-sm:placeholder:text-[14px]"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clear}
                    aria-label={t.clear}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-text motion-reduce:transition-none"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-accent-ink transition-colors hover:text-text motion-reduce:transition-none"
                >
                  <span className="max-sm:sr-only">{t.submit}</span>
                  <CornerDownLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </button>
              </div>
            </form>

            {/* Phones: the note and the examples appear once the box is used. */}
            <div className={open ? "" : "max-sm:hidden"}>
              <p className="mt-3 text-pretty text-[13px] leading-relaxed text-muted sm:hidden">{t.note}</p>
              {!current ? (
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2 sm:mt-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted rtl:tracking-normal">{t.examplesLabel}</span>
                  {examples}
                </div>
              ) : null}
            </div>

            <div id={`${uid}-results`}>
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={current?.rows ? "mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted rtl:tracking-normal" : "sr-only"}
              >
                {statusText}
              </p>

              {current?.rows ? (
                <ol className="mt-2 border-b hairline">
                  {current.rows.map((row) => (
                    <li key={row.id} className="border-t py-3.5 [border-top-color:rgb(var(--line)/var(--line-alpha))] sm:py-4">
                      <p className="text-pretty text-[15px] leading-relaxed text-text/90 md:text-base">
                        {row.parts.map((part, i) =>
                          part.match ? (
                            <mark key={i} className="rounded-[3px] bg-accent/15 px-0.5 text-text [box-decoration-break:clone]">
                              <Bidi text={part.text} />
                            </mark>
                          ) : (
                            <Bidi key={i} text={part.text} />
                          )
                        )}
                      </p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted rtl:tracking-normal">
                        <span className="min-w-0">
                          <Bidi text={row.sourceLabel} />
                        </span>
                        <Link href={row.href} className="inline-flex min-h-[32px] items-center gap-1 text-accent-ink transition-colors hover:text-text motion-reduce:transition-none">
                          {t.open}
                          <span className="sr-only">: {row.sourceLabel}</span>
                          <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
                        </Link>
                      </p>
                    </li>
                  ))}
                </ol>
              ) : null}

              {current && !current.rows ? (
                <div className="mt-2">
                  <p className="text-pretty text-[15px] leading-relaxed text-text/90" aria-hidden="true">
                    {t.noAnswer}
                  </p>
                  <div className="mt-3">{examples}</div>
                  <Link href={lp("/#contact")} className="text-link mt-4 text-sm">
                    {t.contact}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
