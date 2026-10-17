// Static GitHub Pages build: sets GH_PAGES=1, runs `next build`, adds .nojekyll and vercel.json to out/.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
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

// without this, Pages (Jekyll) hides the _next/ folder
writeFileSync("out/.nojekyll", "");
// the gh-pages branch is a built static copy: tell Vercel's Git integration not to try to deploy it
writeFileSync("out/vercel.json", JSON.stringify({ git: { deploymentEnabled: false } }) + "\n");
JSON.parse(readFileSync("out/vercel.json", "utf8"));
console.log("GitHub Pages build ready in out/");
