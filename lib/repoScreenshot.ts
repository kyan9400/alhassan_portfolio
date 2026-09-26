import fs from "node:fs";
import path from "node:path";

/** Preferred first: WebP is several times smaller than a PNG capture of the same page. */
const EXTENSIONS = [".webp", ".png"] as const;

const SCREENSHOT_DIR = path.join(process.cwd(), "public", "repo-screenshots");

/** Matches `scripts/capture-repo-screenshots.mjs` filename sanitization. */
export function repoScreenshotBasename(repoName: string): string {
  return String(repoName).replace(/[^a-zA-Z0-9._-]/g, "_");
}

let cachedFiles: Set<string> | null = null;

/** One directory read per production server process (fresh on every call in dev). */
function listScreenshots(): Set<string> {
  if (cachedFiles && process.env.NODE_ENV === "production") return cachedFiles;
  try {
    cachedFiles = new Set(fs.readdirSync(SCREENSHOT_DIR));
  } catch {
    cachedFiles = new Set();
  }
  return cachedFiles;
}

/**
 * Public URL of a committed capture under `public/repo-screenshots/` (`<name>.webp` or `<name>.png`),
 * or `undefined` so the UI renders a text-only card.
 */
export function publicPathForRepoScreenshot(repoName: string): string | undefined {
  const safe = repoScreenshotBasename(repoName);
  const files = listScreenshots();
  for (const ext of EXTENSIONS) {
    if (files.has(`${safe}${ext}`)) return `/repo-screenshots/${safe}${ext}`;
  }
  return undefined;
}
