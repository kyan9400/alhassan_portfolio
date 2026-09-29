/**
 * Tests for "Ask my CV" (lib/ask-cv.ts): real questions in English, Russian and Arabic must return a
 * passage from the expected source, and out-of-scope questions must return no answer.
 *
 * Run: node --experimental-strip-types scripts/test-ask-cv.mjs   (npm run test:ask-cv)
 *
 * The library and the site copy are imported as they are; a small resolve hook maps the "@/" path
 * alias (tsconfig "paths") and extensionless imports to the .ts files.
 */
import { register } from "node:module";
import assert from "node:assert/strict";

const root = new URL("../", import.meta.url).href;

const hook = `
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = ${JSON.stringify(root)};
export async function resolve(specifier, context, next) {
  let target = null;
  if (specifier.startsWith("@/")) target = new URL(specifier.slice(2), ROOT).href;
  else if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts") && !/\\.[cm]?[jt]sx?$/.test(specifier)) target = new URL(specifier, context.parentURL).href;
  if (target) {
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      if (existsSync(fileURLToPath(target + ext))) return next(target + ext, context);
    }
  }
  return next(specifier, context);
}
`;
register(`data:text/javascript,${encodeURIComponent(hook)}`, import.meta.url);

const { askCv, highlight, tokenize } = await import("../lib/ask-cv.ts");

/**
 * [locale, question, expectation]. `kinds`: the top result must be one of these passage kinds;
 * `source`: the top result's source label (or, with `anyOf`, one of the top three) must contain it.
 */
const CASES = [
  ["en", "Do you know FastAPI?", { kinds: ["experience", "skills"], anyTextOf: ["FastAPI"] }],
  ["en", "fastapi", { kinds: ["experience", "skills"], anyTextOf: ["FastAPI"] }],
  ["en", "Avenue Group", { source: "Avenue Group" }],
  ["en", "available", { kinds: ["availability"] }],
  ["en", "Tell me about your experience", { kinds: ["experience"] }],
  ["en", "How old are you?", { none: true }],
  ["en", "Are you married?", { none: true }],
  ["en", "What did you build at Avenue Group?", { source: "Avenue Group", anyOf: true }],
  ["en", "What is your English level?", { kinds: ["languages"] }],
  ["en", "Are you available now?", { kinds: ["availability"] }],
  ["en", "How can I contact you on Telegram?", { kinds: ["contact"], anyTextOf: ["@hassan775775"] }],
  ["en", "Where did you study?", { kinds: ["education"] }],
  ["en", "RAG", { anyTextOf: ["RAG"] }],
  ["en", "английский", { kinds: ["languages"] }],
  ["en", "What is your salary expectation?", { none: true }],
  ["en", "Do you need a visa or work permit?", { none: true }],
  ["en", "What is the capital of France?", { none: true }],
  ["ru", "Вы знаете FastAPI?", { kinds: ["experience", "skills"], anyTextOf: ["FastAPI"] }],
  ["ru", "английский", { kinds: ["languages"] }],
  ["ru", "Какой у вас уровень английского?", { kinds: ["languages"] }],
  ["ru", "Что вы сделали в Avenue Group?", { source: "Avenue Group", anyOf: true }],
  ["ru", "Когда вы готовы приступить?", { kinds: ["availability"] }],
  ["ru", "Есть опыт с пайтоном?", { kinds: ["experience", "skills"], anyTextOf: ["Python"] }],
  ["ru", "поиск по документам", { anyTextOf: ["RAG", "поиск"] }],
  ["ru", "Какая зарплата?", { none: true }],
  ["ru", "fastapi", { kinds: ["experience", "skills"], anyTextOf: ["FastAPI"] }],
  ["ru", "Как связаться в телеграме?", { kinds: ["contact"], anyTextOf: ["@hassan775775", "Telegram"] }],
  ["ru", "Нужна ли вам виза?", { none: true }],
  ["ar", "خبرة React", { kinds: ["experience", "skills"], anyTextOf: ["React"] }],
  ["ar", "هل تعرف FastAPI؟", { kinds: ["experience", "skills"], anyTextOf: ["FastAPI"] }],
  ["ar", "ما مستوى لغتك الإنجليزية؟", { kinds: ["languages"] }],
  ["ar", "هل أنت متاح الآن؟", { kinds: ["availability"] }],
  ["ar", "ماذا بنيت في Avenue Group؟", { source: "Avenue Group", anyOf: true }],
  ["ar", "كيف أتواصل معك؟", { kinds: ["contact"] }],
  ["ar", "كم الراتب المتوقع؟", { none: true }],
  ["ar", "خبرة بايثون", { kinds: ["experience", "skills"], anyTextOf: ["Python"] }],
  ["ar", "Avenue Group", { source: "Avenue Group" }],
  ["ar", "هل تحتاج تأشيرة؟", { none: true }]
];

let failed = 0;
for (const [locale, question, expect] of CASES) {
  const answer = askCv(locale, question);
  const top = answer.status === "ok" ? answer.results[0] : undefined;
  const summary = top ? `${top.passage.sourceLabel} | ${top.passage.text.slice(0, 90)}` : "(no answer)";
  try {
    if (expect.none) {
      assert.equal(answer.status, "none", "expected no answer");
    } else {
      assert.equal(answer.status, "ok", "expected an answer");
      const results = answer.results;
      if (expect.kinds) assert.ok(expect.kinds.includes(top.passage.kind), `top kind ${top.passage.kind} not in ${expect.kinds}`);
      if (expect.source) {
        const labels = (expect.anyOf ? results : [top]).map((r) => r.passage.sourceLabel);
        assert.ok(labels.some((l) => l.includes(expect.source)), `no source with "${expect.source}" in ${labels.join(" / ")}`);
      }
      if (expect.anyTextOf) {
        assert.ok(
          results.some((r) => expect.anyTextOf.some((t) => r.passage.text.includes(t))),
          `no result text contains ${expect.anyTextOf.join(" or ")}`
        );
      }
      assert.ok(results.length <= 3, "at most three results");
      // Answers are quoted, never generated: every href is locale-prefixed and every text is non-empty.
      for (const r of results) {
        assert.ok(r.passage.href.startsWith(`/${locale}`), `href ${r.passage.href} is not in /${locale}`);
        assert.ok(r.passage.text.trim().length > 0);
      }
    }
    console.log(`ok    [${locale}] ${question}  →  ${summary}`);
  } catch (error) {
    failed++;
    console.log(`FAIL  [${locale}] ${question}  →  ${summary}\n      ${error.message}`);
  }
}

// Unit checks for the tokenizer and the highlighter.
try {
  assert.deepEqual(tokenize("FastAPI, C1 and ~60%"), ["fastapi", "c1", "and", "60"]);
  assert.deepEqual(tokenize("وExcel"), ["و", "excel"]);
  assert.equal(tokenize("английского")[0], tokenize("английский")[0]);
  assert.equal(tokenize("الخبرة")[0], tokenize("خبرة")[0]);
  // "fastapi" must surface the Elektroservis role or the skills group among its three answers.
  for (const locale of ["en", "ru", "ar"]) {
    const a = askCv(locale, "fastapi");
    assert.ok(
      a.status === "ok" && a.results.some((r) => r.passage.kind === "skills" || /Elektroservis|Электросервис|إلكتروسيرفيس/.test(r.passage.sourceLabel)),
      `[${locale}] fastapi: no skills / Elektroservis passage`
    );
  }
  const parts = highlight("Built FastAPI pipelines.", tokenize("fastapi"));
  assert.deepEqual(parts, [
    { text: "Built ", match: false },
    { text: "FastAPI", match: true },
    { text: " pipelines.", match: false }
  ]);
  assert.equal(parts.map((p) => p.text).join(""), "Built FastAPI pipelines.");
  console.log("ok    tokenizer and highlighter");
} catch (error) {
  failed++;
  console.log(`FAIL  tokenizer / highlighter\n      ${error.message}`);
}

console.log(failed ? `\n${failed} failed` : `\nAll ${CASES.length + 1} checks passed`);
process.exit(failed ? 1 : 0);
