"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Rss } from "lucide-react";
import { useCopy, useDocumentTitle } from "@/lib/hooks";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Bidi } from "@/components/ui/primitives";
import { Footer } from "@/components/app/Footer";
import type { Locale } from "@/lib/types";

/** What the client needs about a note (NoteMeta from lib/notes.ts, minus nothing it can't serialize). */
export type NoteSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  lang: Locale;
  draft: boolean;
  readingMinutes: number;
  headings: { depth: 2 | 3; text: string; id: string }[];
};

type NoteLink = Pick<NoteSummary, "slug" | "title" | "lang">;

const DATE_LOCALES: Record<Locale, string> = { en: "en-GB", ru: "ru-RU", ar: "ar-u-nu-latn" };

/** Same CSS-only entrance as the case studies and the archive. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

function formatDate(date: string, locale: Locale) {
  // Dates are calendar days (YYYY-MM-DD): format in UTC so no time zone moves them.
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`)
  );
}

function formatReadingTime(forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }, minutes: number, locale: Locale) {
  const rule = new Intl.PluralRules(locale).select(minutes);
  return (forms[rule] ?? forms.other).replace("{n}", String(minutes));
}

function NoteMetaLine({ note, locale }: { note: Pick<NoteSummary, "date" | "readingMinutes" | "lang">; locale: Locale }) {
  const copy = useCopy();
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-muted">
      <time dateTime={note.date}>{formatDate(note.date, locale)}</time>
      <span aria-hidden="true">·</span>
      <span>{formatReadingTime(copy.ui.notes.readingTime, note.readingMinutes, locale)}</span>
      {note.lang !== locale ? (
        <>
          <span aria-hidden="true">·</span>
          <span lang={note.lang}>{copy.ui.languageNames[note.lang]}</span>
        </>
      ) : null}
    </p>
  );
}

/** /notes: every published note, newest first, as hairline rows. */
export function NotesIndex({ notes }: { notes: NoteSummary[] }) {
  const copy = useCopy();
  const n = copy.ui.notes;
  const locale = usePortfolioStore((s) => s.locale);
  const localeReady = usePortfolioStore((s) => s.localeReady);
  useDocumentTitle(localeReady ? `${n.metaTitle} — ${copy.ui.meta.nameSuffix}` : null);

  return (
    <main className="pb-10 pt-28 md:pt-36">
      <div className="shell max-w-4xl">
        <div className="fade-in">
          <Link href="/" className="btn-ghost group !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {copy.ui.errorPage.home}
          </Link>
        </div>

        <header className="mt-10 max-w-3xl">
          <p className="eyebrow fade-in" style={delay(60)}>
            {n.eyebrow}
          </p>
          <h1 className="fade-in mt-5 text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] rtl:leading-[1.25]" style={delay(100)}>
            {n.title}
          </h1>
          <p className="fade-in mt-5 text-pretty text-base leading-relaxed text-muted md:text-lg" style={delay(160)}>
            <Bidi text={n.description} />
          </p>
          <a href="/notes/rss.xml" className="text-link fade-in mt-6 min-h-[44px] text-[13px]" style={delay(200)}>
            <Rss className="h-3.5 w-3.5" aria-hidden="true" />
            {n.rss}
          </a>
        </header>

        <ol className="fade-in mt-10 border-t hairline md:mt-14" style={delay(240)}>
          {notes.map((note) => (
            <li key={note.slug} className="border-b hairline">
              <Link href={`/notes/${note.slug}`} className="group block py-7 md:py-8">
                <NoteMetaLine note={note} locale={locale} />
                {/* Title and summary in the post's own language and direction. */}
                <div lang={note.lang} dir={note.lang === "ar" ? "rtl" : "ltr"}>
                  <h2 className="mt-3 text-balance text-xl font-semibold leading-snug text-text transition-colors group-hover:text-accent-ink md:text-2xl">
                    {note.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted">{note.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <Footer className="mt-24" />
      </div>
    </main>
  );
}

/**
 * /notes/<slug>: the chrome around one post (translated with the site), with the post itself rendered
 * on the server from MDX and passed in as `children`. The article carries the post's own language and
 * direction, which may differ from the interface language.
 */
export function NotePost({
  note,
  previous,
  next,
  children
}: {
  note: NoteSummary;
  /** The older post. */
  previous: NoteLink | null;
  /** The newer post. */
  next: NoteLink | null;
  children: React.ReactNode;
}) {
  const copy = useCopy();
  const n = copy.ui.notes;
  const locale = usePortfolioStore((s) => s.locale);
  const localeReady = usePortfolioStore((s) => s.localeReady);
  useDocumentTitle(localeReady ? `${note.title} — ${copy.ui.meta.nameSuffix}` : null);
  const postDir = note.lang === "ar" ? "rtl" : "ltr";

  return (
    <main className="pb-10 pt-28 md:pt-36">
      <div className="shell max-w-3xl">
        <div className="fade-in">
          <Link href="/notes" className="btn-ghost group !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {n.back}
          </Link>
        </div>

        <article className="mt-10">
          <header>
            <div className="fade-in" style={delay(60)}>
              <NoteMetaLine note={note} locale={locale} />
            </div>
            <h1
              lang={note.lang}
              dir={postDir}
              className="fade-in mt-4 text-balance text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] rtl:leading-[1.3]"
              style={delay(100)}
            >
              {note.title}
            </h1>
            <p lang={note.lang} dir={postDir} className="fade-in mt-5 text-pretty text-lg leading-relaxed text-muted" style={delay(160)}>
              {note.description}
            </p>
          </header>

          {note.headings.length > 1 ? (
            <nav aria-label={n.toc} className="fade-in mt-10 border-y hairline py-5" style={delay(200)}>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted rtl:tracking-normal">{n.toc}</p>
              <ol lang={note.lang} dir={postDir} className="mt-3 space-y-1.5 text-[14px]">
                {note.headings.map((h) => (
                  <li key={h.id} className={h.depth === 3 ? "ps-4" : undefined}>
                    <a href={`#${h.id}`} className="text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-text hover:decoration-current">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div lang={note.lang} dir={postDir} className="fade-in mt-4" style={delay(240)}>
            {children}
          </div>
        </article>

        {previous || next ? (
          <nav aria-label={n.eyebrow} className="mt-16 grid gap-3 border-t hairline pt-8 sm:grid-cols-2">
            {previous ? (
              <Link href={`/notes/${previous.slug}`} className="group rounded-2xl border hairline p-5 transition-colors hover:border-accent/40">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
                  <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                  {n.previous}
                </span>
                <span lang={previous.lang} className="mt-2 block font-display text-base font-semibold text-text group-hover:text-accent-ink">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link href={`/notes/${next.slug}`} className="group rounded-2xl border hairline p-5 text-end transition-colors hover:border-accent/40">
                <span className="flex items-center justify-end gap-1.5 text-[12px] font-medium text-muted">
                  {n.next}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </span>
                <span lang={next.lang} className="mt-2 block font-display text-base font-semibold text-text group-hover:text-accent-ink">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <Footer className="mt-24" />
      </div>
    </main>
  );
}
