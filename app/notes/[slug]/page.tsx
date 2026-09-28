import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoutableNotes } from "@/lib/notes-config";
import { SITE_URL } from "@/lib/ui-copy";
import { PERSON_ID, WEBSITE_ID, jsonLdHtml } from "@/lib/seo";
import { createHeadingComponents } from "@/mdx-components";
import { NotePost } from "@/components/sections/Notes";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Only routable notes are prerendered (lib/notes-config.ts): published posts once NOTES_ENABLED, drafts
 * in development only. Every other slug, drafts in production included, is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutableNotes().map((n) => ({ slug: n.slug }));
}

function findNote(slug: string) {
  const notes = getRoutableNotes();
  const index = notes.findIndex((n) => n.slug === slug);
  return index === -1 ? null : { notes, index, note: notes[index] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = findNote(slug);
  if (!found) return { title: "Note not found", robots: { index: false } };
  const { note } = found;
  const path = `/notes/${note.slug}`;
  return {
    title: note.title,
    description: note.description,
    // A note is written in one language, so it has no hreflang alternates.
    alternates: { canonical: path },
    robots: note.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${note.title} — Alhassan Alfarran`,
      description: note.description,
      url: `${SITE_URL}${path}`,
      type: "article",
      publishedTime: note.date,
      authors: [SITE_URL],
      siteName: "Alhassan Alfarran",
      locale: { en: "en_US", ru: "ru_RU", ar: "ar_AR" }[note.lang]
    },
    twitter: { card: "summary_large_image", title: `${note.title} — Alhassan Alfarran`, description: note.description }
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const found = findNote(slug);
  if (!found) notFound();
  const { notes, index, note } = found;

  // Official @next/mdx dynamic import (node_modules/next/dist/docs/01-app/02-guides/mdx.md).
  const { default: Post } = await import(`@/content/notes/${note.slug}.mdx`);

  // `notes` is newest first: the previous (older) post is the next item, the newer one the item before.
  const older = notes[index + 1] ?? null;
  const newer = notes[index - 1] ?? null;
  const url = `${SITE_URL}/notes/${note.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    inLanguage: note.lang,
    url,
    mainEntityOfPage: url,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    ...(note.headings.length ? { articleSection: note.headings.filter((h) => h.depth === 2).map((h) => h.text) } : {})
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />
      <NotePost
        note={note}
        previous={older && { slug: older.slug, title: older.title, lang: older.lang }}
        next={newer && { slug: newer.slug, title: newer.title, lang: newer.lang }}
      >
        <Post components={createHeadingComponents()} />
      </NotePost>
    </>
  );
}
