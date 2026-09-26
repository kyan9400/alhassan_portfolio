/**
 * Captures live-demo screenshots for the portfolio and writes optimized WebP files.
 *
 *   featured projects -> public/images/projects/<slug>.webp   (1440x900 viewport, 1600px wide, q80)
 *   repository grid   -> public/repo-screenshots/<repo>.webp   (1280x800 viewport, 1200px wide, q78)
 *
 * Only the hand-curated list below is captured (it mirrors the curated order in lib/github.ts).
 *
 * Usage (from the repo root):
 *   npm run capture:repos                     # everything
 *   npm run capture:repos -- --featured       # featured projects only
 *   npm run capture:repos -- --repos          # repository grid only
 *   npm run capture:repos -- leasequeue gatehouse   # just these names
 *
 * Requires: `npx playwright install chromium`. Set CHROMIUM_PATH to use a specific Chrome/Chromium binary.
 * sharp is already installed as a dependency of Next.js.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/*
 * Seeded demo data. Some sandboxes are empty most of the time (they reset when the Vercel instance
 * scales down), which makes for a screenshot of an empty state. For those, the app's own read
 * endpoints are answered from the fixtures below with Playwright's request interception: the page
 * renders realistic data, and nothing is written to, or sent from, the live demo.
 * Addresses use the documentation ranges (RFC 5737); names are fictional.
 */
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

const WORKBENCH_EVENTS = [
  {
    id: "evt_7f3a2c91d4",
    channel: "github",
    method: "POST",
    path: "/inbox/github",
    query: "",
    contentType: "application/json",
    size: 1832,
    receivedAt: minutesAgo(0.7),
    preview: "pull_request · opened · #128",
    remoteAddress: "203.0.113.24",
    truncated: false,
    bodyEncoding: "utf8",
    headers: {
      "Content-Type": ["application/json"],
      "User-Agent": ["GitHub-Hookshot/7c1f5e0"],
      "X-GitHub-Event": ["pull_request"],
      "X-GitHub-Delivery": ["5c8f2a10-6b1e-11ef-9a3b-3f4d2e7a9c10"],
      "X-Hub-Signature-256": ["sha256=4f1c9b2e7d0a6c3f8e1b5d9a2c7e4f60b3a8d1c5e9f2a7b4c6d0e3f1a8b5c2d9"],
      Authorization: ["[REDACTED]"]
    },
    body: JSON.stringify({
      action: "opened",
      number: 128,
      pull_request: {
        title: "Add a retry budget to the payments worker",
        user: { login: "maya-chen" },
        head: { ref: "feat/retry-budget" },
        base: { ref: "main" },
        draft: false
      },
      repository: { full_name: "acme/payments" }
    })
  },
  {
    id: "evt_2b9e41c7a0",
    channel: "stripe",
    method: "POST",
    path: "/inbox/stripe",
    query: "",
    contentType: "application/json",
    size: 2416,
    receivedAt: minutesAgo(3),
    preview: "payment_intent.succeeded · 149.90 USD",
    remoteAddress: "198.51.100.17",
    truncated: false,
    bodyEncoding: "utf8",
    headers: { "Content-Type": ["application/json"], "Stripe-Signature": ["t=1727350000,v1=[REDACTED]"] },
    body: JSON.stringify({ id: "evt_3Q1xYz", type: "payment_intent.succeeded", data: { object: { amount: 14990, currency: "usd" } } })
  },
  {
    id: "evt_c41d8e2f93",
    channel: "orders",
    method: "POST",
    path: "/inbox/orders",
    query: "",
    contentType: "application/json",
    size: 96,
    receivedAt: minutesAgo(7),
    preview: "order.created · ord_2048",
    remoteAddress: "203.0.113.51",
    truncated: false,
    bodyEncoding: "utf8",
    headers: { "Content-Type": ["application/json"] },
    body: JSON.stringify({ event: "order.created", id: "ord_2048", amount: 149.9, currency: "USD" })
  },
  {
    id: "evt_9a07b3d15e",
    channel: "deploys",
    method: "POST",
    path: "/inbox/deploys",
    query: "env=production",
    contentType: "application/json",
    size: 412,
    receivedAt: minutesAgo(12),
    preview: "deployment.finished · api · production",
    remoteAddress: "198.51.100.40",
    truncated: false,
    bodyEncoding: "utf8",
    headers: { "Content-Type": ["application/json"] },
    body: JSON.stringify({ event: "deployment.finished", service: "api", environment: "production", status: "success" })
  },
  {
    id: "evt_5e6f0a8b21",
    channel: "github",
    method: "POST",
    path: "/inbox/github",
    query: "",
    contentType: "application/json",
    size: 5120,
    receivedAt: minutesAgo(18),
    preview: "push · main · 3 commits",
    remoteAddress: "203.0.113.24",
    truncated: false,
    bodyEncoding: "utf8",
    headers: { "Content-Type": ["application/json"], "X-GitHub-Event": ["push"] },
    body: JSON.stringify({ ref: "refs/heads/main", commits: 3 })
  },
  {
    id: "evt_d82c6f4a07",
    channel: "stripe",
    method: "POST",
    path: "/inbox/stripe",
    query: "",
    contentType: "application/json",
    size: 1988,
    receivedAt: minutesAgo(26),
    preview: "invoice.paid · in_1Q8",
    remoteAddress: "198.51.100.17",
    truncated: false,
    bodyEncoding: "utf8",
    headers: { "Content-Type": ["application/json"], "Stripe-Signature": ["t=1727348800,v1=[REDACTED]"] },
    body: JSON.stringify({ id: "evt_3Q0aBc", type: "invoice.paid" })
  }
];

const LEASEQUEUE_STATS = { queued: 12, running: 3, retry: 2, completed: 148, dead: 1, cancelled: 0, total: 166, oldestPendingSeconds: 47 };
const LEASEQUEUE_JOBS = [
  ["running", "charge_payment", 1, 5, 10, 0.1, "worker-a1"],
  ["running", "send_invoice_email", 1, 3, 0, 0.2, "worker-b2"],
  ["running", "sync_inventory", 2, 5, 5, 0.4, "worker-a1"],
  ["retry", "deliver_webhook", 3, 5, 0, 1.2, null],
  ["retry", "generate_report", 2, 4, -5, 2.5, null],
  ["queued", "resize_image", 0, 3, 0, 0.3, null],
  ["queued", "send_invoice_email", 0, 3, 0, 0.5, null],
  ["queued", "rebuild_search_index", 0, 2, -10, 1, null],
  ["completed", "charge_payment", 1, 5, 10, 3, null],
  ["dead", "deliver_webhook", 5, 5, 0, 9, null]
].map(([status, task, attempt, maxAttempts, priority, mins, leaseOwner], i) => ({
  id: `job_01J8Z${(0x3f2a9 + i * 7919).toString(16).toUpperCase()}QK4M7`,
  status,
  task,
  queue: "default",
  attempt,
  maxAttempts,
  priority,
  leaseOwner,
  payload: { tenant: "acme", attempt },
  createdAt: minutesAgo(mins + 1),
  updatedAt: minutesAgo(mins)
}));

const json = (body) => ({ status: 200, contentType: "application/json", body: JSON.stringify(body) });

const SEEDS = {
  "webhook-workbench": {
    async routes(page) {
      await page.route(/\/api\/events\/[^/?]+$/, (route) => {
        const id = new URL(route.request().url()).pathname.split("/").pop();
        const event = WORKBENCH_EVENTS.find((e) => e.id === id);
        return event ? route.fulfill(json(event)) : route.fulfill({ status: 404, body: "" });
      });
      await page.route(/\/api\/events(\?.*)?$/, (route) =>
        route.request().method() === "GET" ? route.fulfill(json({ events: WORKBENCH_EVENTS })) : route.abort()
      );
    },
    // Open the newest event, so the detail pane shows its decoded payload.
    async after(page) {
      await page.locator(".event-card").first().click();
      await page.waitForTimeout(800);
    }
  },
  leasequeue: {
    async routes(page) {
      await page.route(/\/api\/stats$/, (route) => route.fulfill(json(LEASEQUEUE_STATS)));
      await page.route(/\/api\/jobs\?/, (route) =>
        route.request().method() === "GET" ? route.fulfill(json({ jobs: LEASEQUEUE_JOBS, count: LEASEQUEUE_JOBS.length })) : route.abort()
      );
    }
  },
  gatehouse: {
    // The headline's -0.075em tracking in Fraunces nearly closes the word gaps ("Grantaccess
    // withevidence.") at capture size. Same fix as proposed for the gatehouse repo itself.
    css: "h1{letter-spacing:-.035em!important;word-spacing:.04em}"
  }
};

const FEATURED = {
  outDir: path.join(ROOT, "public", "images", "projects"),
  viewport: { width: 1440, height: 900 },
  // Rendered at 2x and downscaled to 1600px so text stays crisp on large / retina cards.
  deviceScaleFactor: 2,
  width: 1600,
  quality: 80,
  // Note: the pulseboard sandbox is usually empty (no monitors); the committed pulseboard.webp is a
  // 1440x900 crop of docs/pulseboard-dashboard.png from the kyan9400/pulseboard repo instead.
  // Pass names explicitly (e.g. `-- deployledger gatehouse`) to avoid overwriting it.
  items: [
    { name: "pulseboard", url: "https://pulseboard-five-tau.vercel.app/" },
    { name: "deployledger", url: "https://deployledger.vercel.app" },
    { name: "gatehouse", url: "https://gatehouse-nine.vercel.app" },
    { name: "webhook-workbench", url: "https://webhook-workbench.vercel.app/" }
  ]
};

const REPOS = {
  outDir: path.join(ROOT, "public", "repo-screenshots"),
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  width: 1200,
  quality: 78,
  items: [
    { name: "leasequeue", url: "https://leasequeue.vercel.app/" },
    { name: "stockroom-ledger", url: "https://stockroom-ledger.vercel.app/" },
    { name: "incident-canvas", url: "https://kyan9400.github.io/incident-canvas/" },
    { name: "access-verdict", url: "https://kyan9400.github.io/access-verdict/" },
    { name: "togglebench", url: "https://kyan9400.github.io/togglebench/" },
    { name: "retry-lab", url: "https://kyan9400.github.io/retry-lab/" },
    { name: "repo-vitals", url: "https://kyan9400.github.io/repo-vitals/" },
    { name: "my-gpt", url: "https://kyan9400.github.io/my-gpt/" },
    { name: "green-api-max-chat", url: "https://green-api-max-chat-nine.vercel.app" },
    // alkajal2 (https://alkajal2.vercel.app) currently serves the default Next.js starter page,
    // so it is skipped and shown as a text-only card. Re-enable once the deployment is fixed.
    // { name: "alkajal2", url: "https://alkajal2.vercel.app" },
    { name: "sehati-client", url: "https://mellifluous-strudel-16e4ee.netlify.app" }
  ]
};

const HIDE_OVERLAYS_CSS = `
  [id*="cookie" i], [class*="cookie-banner" i], [class*="cookieBanner" i], [class*="cookie-consent" i],
  [id*="consent" i], [class*="consent-banner" i], #onetrust-banner-sdk, .cc-window, .cky-consent-container,
  nextjs-portal, [data-nextjs-toast], #__next-build-watcher, vercel-live-feedback { display: none !important; }
  html { scroll-behavior: auto !important; }
`;

/** Matches lib/repoScreenshot.ts sanitization. */
function safeFileName(name) {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, "_");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function isCheckpoint(page) {
  const title = await page.title().catch(() => "");
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 400) ?? "").catch(() => "");
  return /security checkpoint|verifying your browser|just a moment/i.test(`${title} ${text}`);
}

async function load(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    // Some demos keep a socket / polling open; fall back to the load event.
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
  }
  // Vercel Security Checkpoint: wait up to 20s for it to clear, then retry once.
  for (let i = 0; i < 20 && (await isCheckpoint(page)); i++) await sleep(1000);
  if (await isCheckpoint(page)) {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    for (let i = 0; i < 20 && (await isCheckpoint(page)); i++) await sleep(1000);
  }
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.addStyleTag({ content: HIDE_OVERLAYS_CSS }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await sleep(2000);
  if (await isCheckpoint(page)) throw new Error("blocked by a bot checkpoint");
}

async function capture(browser, group, item) {
  const context = await browser.newContext({
    viewport: group.viewport,
    deviceScaleFactor: group.deviceScaleFactor,
    colorScheme: "dark",
    reducedMotion: "reduce",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();
  const seed = SEEDS[item.name];
  try {
    if (seed?.routes) await seed.routes(page);
    await load(page, item.url);
    if (seed?.css) await page.addStyleTag({ content: seed.css });
    if (seed?.after) await seed.after(page);
    if (seed) await sleep(1000);
    const png = await page.screenshot({ type: "png" });
    const file = path.join(group.outDir, `${safeFileName(item.name)}.webp`);
    await sharp(png)
      .resize({ width: group.width, withoutEnlargement: true })
      .webp({ quality: group.quality, effort: 6 })
      .toFile(file);
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`ok   ${item.name.padEnd(20)} -> ${path.relative(ROOT, file)} (${kb} KB)`);
    return true;
  } catch (err) {
    console.error(`skip ${item.name.padEnd(20)} ${err?.message || err}`);
    return false;
  } finally {
    await context.close();
  }
}

const args = process.argv.slice(2);
const names = args.filter((a) => !a.startsWith("--"));
const groups = [];
if (!args.includes("--repos")) groups.push(FEATURED);
if (!args.includes("--featured")) groups.push(REPOS);

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
});

const failed = [];
for (const group of groups) {
  fs.mkdirSync(group.outDir, { recursive: true });
  for (const item of group.items) {
    if (names.length && !names.includes(item.name)) continue;
    if (!(await capture(browser, group, item))) failed.push(item.name);
  }
}

await browser.close();
console.log(failed.length ? `Done with failures: ${failed.join(", ")}` : "Done.");
if (failed.length) process.exitCode = 1;
