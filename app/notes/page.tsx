import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedNotes } from "@/lib/notes";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { SITE_URL } from "@/lib/ui-copy";
import { languageAlternates } from "@/lib/seo";
import { NotesIndex } from "@/components/sections/Notes";

const title = "Notes";
const description = "Notes by Alhassan Alfarran, Full-Stack & Python Developer: short write-ups on engineering work.";
const path = "/notes";

// Server metadata is English; the client component keeps the tab title in the visitor's language.
export const metadata: Metadata = NOTES_ENABLED
  ? {
      title,
      description,
      alternates: {
        canonical: path,
        languages: languageAlternates(path),
        types: { "application/rss+xml": [{ url: "/notes/rss.xml", title: "Notes — Alhassan Alfarran" }] }
      },
      openGraph: {
        title: `${title} — Alhassan Alfarran`,
        description,
        url: `${SITE_URL}${path}`,
        type: "website",
        siteName: "Alhassan Alfarran",
        locale: "en_US"
      },
      twitter: { card: "summary_large_image", title: `${title} — Alhassan Alfarran`, description }
    }
  : { robots: { index: false } };

/** 404 until NOTES_ENABLED (lib/notes-config.ts); drafts are never listed. */
export default function NotesPage() {
  if (!NOTES_ENABLED) notFound();
  return <NotesIndex notes={getPublishedNotes()} />;
}
