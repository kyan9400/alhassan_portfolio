import fs from "node:fs";
import path from "node:path";

/** Preferred first: WebP is several times smaller than a PNG capture of the same page. */
const EXTENSIONS = [".webp", ".png"] as const;

const SCREENSHOT_DIR = path.join(process.cwd(), "public", "repo-screenshots");

/** Matches `scripts/capture-repo-screenshots.mjs` filename sanitization. */
export function repoScreenshotBasename(repoName: string): string {
  return String(repoName).replace(/[^a-zA-Z0-9._-]/g, "_");
}

/** Phone-width captures (390 px wide) live one level down: public/repo-screenshots/mobile/<name>.webp. */
const MOBILE_SUBDIR = "mobile";

const cachedFiles = new Map<string, Set<string>>();

/**
 * Files in `public/repo-screenshots/` (or in one subfolder of it, e.g. "mobile"). One directory read per
 * folder per production server process (fresh on every call in dev).
 */
function listScreenshots(subdir = ""): Set<string> {
  const cached = cachedFiles.get(subdir);
  if (cached && process.env.NODE_ENV === "production") return cached;
  let files: Set<string>;
  try {
    files = new Set(fs.readdirSync(path.join(SCREENSHOT_DIR, subdir)));
  } catch {
    files = new Set();
  }
  cachedFiles.set(subdir, files);
  return files;
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

/**
 * `publicPath` (e.g. "/repo-screenshots/skybloom-3d.webp", or the phone capture
 * "/repo-screenshots/mobile/skybloom-3d.webp") when that file is committed under `public/repo-screenshots/`,
 * otherwise `undefined`, so a path can be written down before its image exists.
 */
export function existingRepoScreenshot(publicPath: string): string | undefined {
  const match = /^\/repo-screenshots\/(?:([^/]+)\/)?([^/]+)$/.exec(publicPath);
  if (!match) return undefined;
  const [, subdir = "", file] = match;
  if (subdir && subdir !== MOBILE_SUBDIR) return undefined;
  return listScreenshots(subdir).has(file) ? publicPath : undefined;
}
