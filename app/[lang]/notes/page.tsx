import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedNotes } from "@/lib/notes";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { getCopy } from "@/lib/ui-copy";
import { localizedPageMetadata } from "@/lib/seo";
import { routeLocale } from "@/lib/i18n";
import { NotesIndex } from "@/components/sections/Notes";

type PageParams = { params: Promise<{ lang: string }> };

/**
 * The list is translated (its chrome), so it has a URL per language with hreflang alternates. Every
 * language lists every post, each marked with its own language; a post lives at /{post.lang}/notes/<slug>.
 */
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  if (!NOTES_ENABLED) return { robots: { index: false } };
  const locale = routeLocale((await params).lang);
  const { notes, meta } = getCopy(locale).ui;
  const base = localizedPageMetadata(locale, "/notes", { title: notes.metaTitle, description: notes.description });
  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: { "application/rss+xml": [{ url: "/notes/rss.xml", title: `${notes.metaTitle} — ${meta.nameSuffix}` }] }
    }
  };
}

/** 404 until NOTES_ENABLED (lib/notes-config.ts); drafts are never listed. */
export default function NotesPage() {
  if (!NOTES_ENABLED) notFound();
  return <NotesIndex notes={getPublishedNotes()} />;
}
