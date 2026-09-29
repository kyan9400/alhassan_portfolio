import { getPublishedNotes } from "@/lib/notes";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { SITE_URL } from "@/lib/ui-copy";
import { DEFAULT_LOCALE, localePath } from "@/lib/i18n";

/** Built once at build time, like the pages it lists. */
export const dynamic = "force-static";

function escapeXml(text: string) {
  return text.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] ?? c);
}

/** RSS 2.0 feed of published notes in every language, each linking to its own-language URL (drafts never appear). 404 until NOTES_ENABLED (lib/notes-config.ts). */
export function GET() {
  if (!NOTES_ENABLED) return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const notes = getPublishedNotes();
  const items = notes
    .map((n) => {
      const url = `${SITE_URL}${localePath(n.lang, `/notes/${n.slug}`)}`;
      return `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${n.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(n.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notes — Alhassan Alfarran</title>
    <link>${SITE_URL}${localePath(DEFAULT_LOCALE, "/notes")}</link>
    <atom:link href="${SITE_URL}/notes/rss.xml" rel="self" type="application/rss+xml" />
    <description>Short write-ups on engineering work by Alhassan Alfarran, Full-Stack &amp; Python Developer.</description>
${notes[0] ? `    <lastBuildDate>${new Date(`${notes[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
