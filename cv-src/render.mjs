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
// Uses the Playwright dev dependency. Falls back to installed Chrome or Edge when
// Playwright's own Chromium build is not downloaded (`npx playwright install chromium`).

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const targets = {
  ru: {
    source: path.join(here, "ru.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_RU1.pdf"),
    footer: "Альхассан Альфарран · резюме · kyan775909@gmail.com · +7 919 399 97 49",
    dir: "ltr"
  },
  en: {
    source: path.join(here, "en.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_EN1.pdf"),
    footer: "Alhassan Alfarran · CV · kyan775909@gmail.com · +7 919 399 97 49",
    dir: "ltr"
  },
  ar: {
    source: path.join(here, "ar.html"),
    output: path.join(root, "public", "cv", "Alhassan_Alfarran_CV_AR1.pdf"),
    footer: "الحسن الفران · السيرة الذاتية · <bdi>kyan775909@gmail.com</bdi> · <bdi>+7 919 399 97 49</bdi>",
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
    await page.goto(pathToFileURL(target.source).href, { waitUntil: "load" });
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

    console.log(`CV written: ${path.relative(root, target.output)}`);
  }
} finally {
  await browser.close();
}
