// Static GitHub Pages build: sets GH_PAGES=1, runs `next build`, adds .nojekyll and vercel.json to out/.
import { spawnSync } from "node:child_process";
import { copyFileSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: { ...process.env, GH_PAGES: "1" },
});
if (result.status !== 0) process.exit(result.status ?? 1);

// Client navigation prefetches flat files like en/cv/__next.$d$lang.cv.__PAGE__.txt. On Windows, next
// export writes them as nested folders (en/cv/__next.$d$lang/cv/__PAGE__.txt), so every prefetch 404s.
// Move them to the flat names; on Linux and macOS there is nothing to move.
function flattenSegments(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      flattenSegments(full);
      continue;
    }
    for (const file of readdirSync(full, { recursive: true, withFileTypes: true })) {
      if (!file.isFile()) continue;
      const source = path.join(file.parentPath, file.name);
      const flat = [entry.name, ...path.relative(full, source).split(path.sep)].join(".");
      renameSync(source, path.join(dir, flat));
    }
    rmSync(full, { recursive: true });
  }
}
flattenSegments("out");

// The generated images (OG, Twitter, apple-touch icon) are exported without an extension, which Pages
// serves as application/octet-stream, so link previews may show no image. Give each a .png copy and
// point the <meta>/<link> tags and the manifest at it. The RSC payload (length-prefixed rows) stays as built.
const IMAGES = new Set(["opengraph-image", "twitter-image", "apple-icon"]);
const allFiles = readdirSync("out", { recursive: true, withFileTypes: true })
  .filter((f) => f.isFile())
  .map((f) => path.join(f.parentPath, f.name));
for (const f of allFiles) if (IMAGES.has(path.basename(f))) copyFileSync(f, `${f}.png`);
const toPng = (s) => s.replace(/\/(opengraph-image|twitter-image|apple-icon)(?=[?"'])/g, "/$1.png");
for (const f of allFiles.filter((f) => /\.(html|webmanifest)$/.test(f))) {
  const src = readFileSync(f, "utf8");
  const next = f.endsWith(".html") ? src.replace(/<(?:meta|link)\b[^>]*>/g, toPng) : toPng(src);
  if (next !== src) writeFileSync(f, next);
}

// without this, Pages (Jekyll) hides the _next/ folder
writeFileSync("out/.nojekyll", "");
// the gh-pages branch is a built static copy: tell Vercel's Git integration not to try to deploy it
writeFileSync("out/vercel.json", JSON.stringify({ git: { deploymentEnabled: false } }) + "\n");
JSON.parse(readFileSync("out/vercel.json", "utf8"));
console.log("GitHub Pages build ready in out/");
