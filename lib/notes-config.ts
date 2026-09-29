import { getAllNotes, getPublishedNotes, type NoteMeta } from "@/lib/notes";

/*
 * Notes switch — the one place that decides whether /notes exists.
 *
 * NOTES_ENABLED is true once at least MIN_PUBLISHED_NOTES posts are published (`draft: false` in
 * content/notes/*.mdx). A section with a single post looks abandoned, so until then:
 *   - /{lang}/notes, /{lang}/notes/<slug> and /notes/rss.xml answer 404;
 *   - no link to /notes appears in the navbar, the command palette or the footer
 *     (the root layout passes the flag to AppChrome, which shares it through useNotesEnabled());
 *   - the sitemap lists no notes.
 * Publishing the second post (flip `draft` to false, or add a file) turns all of it on at the next
 * build; there is nothing else to change.
 *
 * Drafts (`draft: true`) are never published, whatever the flag: they are not listed, not in RSS or
 * the sitemap, and not routable in production. In `next dev` a draft opens at /{lang}/notes/<slug> for
 * proofreading (only by typing the URL; nothing links to it).
 */
export const MIN_PUBLISHED_NOTES = 2;

export const NOTES_ENABLED = getPublishedNotes().length >= MIN_PUBLISHED_NOTES;

/** Drafts are readable by URL only in development. */
export const SHOW_DRAFTS = process.env.NODE_ENV === "development";

/** Posts that get a page: published ones when notes are enabled, plus drafts while developing. */
export function getRoutableNotes(): NoteMeta[] {
  return getAllNotes().filter((n) => (n.draft ? SHOW_DRAFTS : NOTES_ENABLED || SHOW_DRAFTS));
}
