// Renders an HTML CV source from cv-src/ into the PDF served from public/cv/.
//
//   node cv-src/render.mjs          -> cv-src/ru.html -> public/cv/Alhassan_Alfarran_CV_RU1.pdf
//   node cv-src/render.mjs ru       (same)
//   node cv-src/render.mjs en       -> cv-src/en.html -> public/cv/Alhassan_Alfarran_CV_EN1.pdf
//   node cv-src/render.mjs ar       -> cv-src/ar.html -> public/cv/Alhassan_Alfarran_CV_AR1.pdf
//   node cv-src/render.mjs all      (all three)
//
// Keep the three sources in sync: same facts, same links (LinkedIn: .../alhassan-alfarran-880b00246/).
//
// The sources use placeholders filled in here, so the email and the site address live in one place:
//   {{CONTACT_EMAIL}}  CONTACT_EMAIL from lib/ui-copy.ts
//   {{SITE_URL}}       NEXT_PUBLIC_SITE_URL if set (e.g. `node --env-file=.env.local cv-src/render.mjs all`),
//                      otherwise DEFAULT_SITE_URL from lib/ui-copy.ts
//   {{SITE_HOST}}      SITE_URL without the scheme
//
// Uses the Playwright dev dependency. Falls back to installed Chrome or Edge when
// Playwright's own Chromium build is not downloaded (`npx playwright install chromium`).

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

// Constants are read from the TypeScript source (a plain string match), so there is no second copy to keep in sync.
const uiCopySource = readFileSync(path.join(root, "lib", "ui-copy.ts"), "utf8");
function readConstant(name) {
  const match = uiCopySource.match(new RegExp(`export const ${name} = "([^"]+)"`));
  if (!match) throw new Error(`${name} not found in lib/ui-copy.ts`);
  return match[1];
}

// Same rule as resolveSiteUrl() in lib/ui-copy.ts: an absolute http(s) URL, reduced to its origin.
function resolveSiteUrl(value, fallback) {
  if (!value?.trim()) return fallback;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
}

const CONTACT_EMAIL = readConstant("CONTACT_EMAIL");
const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, readConstant("DEFAULT_SITE_URL"));
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
const placeholders = { CONTACT_EMAIL, SITE_URL, SITE_HOST };

/** Fills {{NAME}} placeholders; an unknown one stops the render instead of printing braces into the PDF. */
function fill(html, file) {
  return html.replace(/\{\{([A-Z_]+)\}\}/g, (_, name) => {
    if (!(name in placeholders)) throw new Error(`Unknown placeholder {{${name}}} in ${file}`);
    return placeholders[name];
  });
}

const targets = {
  ru: {
    source: path.join(here, "ru.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_RU1.pdf"),
    footer: `Альхассан Альфарран · резюме · ${CONTACT_EMAIL} · +7 919 399 97 49`,
    dir: "ltr"
  },
  en: {
    source: path.join(here, "en.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_EN1.pdf"),
    footer: `Alhassan Alfarran · CV · ${CONTACT_EMAIL} · +7 919 399 97 49`,
    dir: "ltr"
  },
  ar: {
    source: path.join(here, "ar.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_AR1.pdf"),
    footer: `الحسن الفران · السيرة الذاتية · <bdi>${CONTACT_EMAIL}</bdi> · <bdi>+7 919 399 97 49</bdi>`,
    dir: "rtl"
  }
};

const requested = process.argv[2] ?? "ru";
const locales = requested === "all" ? Object.keys(targets) : [requested];

for (const locale of locales) {
  if (!targets[locale]) {
    console.error(`Unknown CV locale "${locale}". Available: ${Object.keys(targets).join(", ")}, all`);
    process.exit(1);
  }
}

const footerTemplate = (target) => `
  <div dir="${target.dir}" style="width:100%; padding:0 13mm; font-family:'Segoe UI', Tahoma, Arial, sans-serif; font-size:7pt; color:#8a8698; display:flex; justify-content:space-between;">
    <span>${target.footer}</span>
    <span dir="ltr"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

// Prefer Playwright's own Chromium; fall back to a locally installed Chrome / Edge
// so the CV can be rebuilt without downloading a browser.
async function launchBrowser() {
  const attempts = [{}, { channel: "chrome" }, { channel: "msedge" }];
  let lastError;
  for (const options of attempts) {
    try {
      return await chromium.launch(options);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const browser = await launchBrowser();

try {
  for (const locale of locales) {
    const target = targets[locale];
    const page = await browser.newPage();
    // The sources reference no local files, so the filled HTML is loaded directly.
    await page.setContent(fill(readFileSync(target.source, "utf8"), path.basename(target.source)), { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });

    await page.pdf({
      path: target.output,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: footerTemplate(target),
      margin: { top: "13mm", right: "13mm", bottom: "15mm", left: "13mm" }
    });
    await page.close();

    console.log(`CV written: ${path.relative(root, target.output)} (${SITE_HOST})`);
  }
} finally {
  await browser.close();
}
