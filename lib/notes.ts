import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/types";

/*
 * Notes (a small blog). Each post is content/notes/<slug>.mdx and starts with a YAML-style block:
 *
 *   ---
 *   title: How the RAG search ranks documents
 *   description: One sentence for the list, RSS and search results.
 *   date: 2026-10-01
 *   lang: en            # en | ru | ar — the language the post is written in
 *   draft: false        # true = never published (see lib/notes-config.ts)
 *   ---
 *
 * The block is flat `key: value` pairs, so it is parsed here without a YAML dependency. The MDX
 * compiler skips it (remark-frontmatter, next.config.mjs). Server-only: this module reads the disk.
 */

export type NoteHeading = { depth: 2 | 3; text: string; id: string };

export type NoteMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  lang: Locale;
  draft: boolean;
  /** Whole minutes, at least 1. */
  readingMinutes: number;
  headings: NoteHeading[];
};

const NOTES_DIR = path.join(process.cwd(), "content", "notes");
const WORDS_PER_MINUTE = 200;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFrontmatter(source: string, file: string): { data: Record<string, string>; body: string } {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`[notes] ${file}: missing frontmatter block`);
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) throw new Error(`[notes] ${file}: cannot read frontmatter line "${trimmed}"`);
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    // Inline comments only when unquoted; quoted values keep everything between the quotes.
    const quoted = /^(["'])(.*)\1$/.exec(value);
    value = quoted ? quoted[2] : value.replace(/\s+#.*$/, "");
    data[key] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

/** Plain text of a markdown heading: inline code, emphasis and links reduced to their text. */
function plainHeading(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|~~)(.+?)\1/g, "$2")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Heading id: lowercase, letters and digits of any script kept (Cyrillic and Arabic headings get
 * readable anchors), everything else collapsed to "-". `seen` numbers repeats ("setup", "setup-1").
 * The MDX heading components (mdx-components.tsx) run the same function in the same order.
 */
export function headingId(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/** h2/h3 outside fenced code, in document order. */
function extractHeadings(body: string): NoteHeading[] {
  const seen = new Map<string, number>();
  const headings: NoteHeading[] = [];
  let fence: string | null = null;
  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = plainHeading(match[2]);
    const id = headingId(text, seen);
    if (match[1].length === 2 || match[1].length === 3) headings.push({ depth: match[1].length as 2 | 3, text, id });
  }
  return headings;
}

function readingMinutes(body: string): number {
  const text = body
    .replace(/^\s*(import|export)\s.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\-[\]()!|]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "ru" || value === "ar";
}

function readNote(file: string): NoteMeta {
  const slug = file.replace(/\.mdx$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`[notes] ${file}: file names must be kebab-case (a-z, 0-9, -)`);
  const { data, body } = parseFrontmatter(fs.readFileSync(path.join(NOTES_DIR, file), "utf8"), file);

  const { title, description, date, lang = "en", draft = "false" } = data;
  if (!title) throw new Error(`[notes] ${file}: "title" is required`);
  if (!description) throw new Error(`[notes] ${file}: "description" is required`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || Number.isNaN(Date.parse(date))) {
    throw new Error(`[notes] ${file}: "date" must be YYYY-MM-DD`);
  }
  if (!isLocale(lang)) throw new Error(`[notes] ${file}: "lang" must be en, ru or ar`);
  if (draft !== "true" && draft !== "false") throw new Error(`[notes] ${file}: "draft" must be true or false`);

  return {
    slug,
    title,
    description,
    date,
    lang,
    draft: draft === "true",
    readingMinutes: readingMinutes(body),
    headings: extractHeadings(body)
  };
}

let cache: NoteMeta[] | null = null;

/** Every note, drafts included, newest first. A missing folder means no notes. */
export function getAllNotes(): NoteMeta[] {
  if (cache) return cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".mdx"));
  } catch {
    files = [];
  }
  const notes = files.map(readNote).sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
  // Re-read on every call in development, so new posts and frontmatter edits show up without a restart.
  if (process.env.NODE_ENV === "production") cache = notes;
  return notes;
}

/** Notes that are published: everything with `draft: false`. Drafts never appear here in any environment. */
export function getPublishedNotes(): NoteMeta[] {
  return getAllNotes().filter((n) => !n.draft);
}
