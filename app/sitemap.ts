import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { getPublishedNotes } from "@/lib/notes";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { SITE_URL } from "@/lib/ui-copy";
import { languageAlternates } from "@/lib/seo";
import { LOCALES, localePath } from "@/lib/i18n";

type Entry = MetadataRoute.Sitemap[number];

/**
 * A translated page: one entry per language (/en/cv, /ru/cv, /ar/cv), each listing all three plus
 * x-default as absolute hreflang alternates (lib/seo.ts).
 */
function translated(path: string, extra: Omit<Entry, "url" | "alternates">): Entry[] {
  const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, `${SITE_URL}${href}`]));
  return LOCALES.map((locale) => ({ url: `${SITE_URL}${localePath(locale, path)}`, ...extra, alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Notes are listed only once the section is live; drafts never (getPublishedNotes excludes them).
  // A post exists in one language only, at /{lang}/notes/<slug>, so it has no alternates.
  const notes: MetadataRoute.Sitemap = NOTES_ENABLED
    ? [
        ...translated("/notes", { changeFrequency: "weekly", priority: 0.6 }),
        ...getPublishedNotes().map((n) => ({
          url: `${SITE_URL}${localePath(n.lang, `/notes/${n.slug}`)}`,
          lastModified: n.date,
          changeFrequency: "yearly" as const,
          priority: 0.5
        }))
      ]
    : [];

  return [
    ...translated("/", { changeFrequency: "monthly", priority: 1 }),
    ...translated("/cv", { changeFrequency: "monthly", priority: 0.8 }),
    ...translated("/projects/archive", { changeFrequency: "monthly", priority: 0.6 }),
    ...projects.flatMap((p) => translated(`/projects/${p.slug}`, { changeFrequency: "yearly", priority: 0.7 })),
    ...notes
  ];
}
