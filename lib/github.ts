import { publicPathForRepoScreenshot } from "@/lib/repoScreenshot";

const GITHUB_USER = "kyan9400";
const REPO_BASE = `https://github.com/${GITHUB_USER}`;
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=updated`;
const API_TIMEOUT_MS = 5000;

export type RepoCategory = "platform" | "backend" | "ai" | "frontend";

export type GithubRepo = {
  name: string;
  displayName: string;
  description: string | null;
  html_url: string;
  /** A live demo only — GitHub "homepage" values that point back to github.com (e.g. a releases page) are dropped. */
  homepage?: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  category: RepoCategory;
  /** `/repo-screenshots/<name>.webp|png` when a capture is committed; otherwise the UI renders a text-only card. */
  previewImage?: string;
  /** Russian and Arabic translations of `description` (the English one is the source). */
  descriptionI18n?: { ru?: string; ar?: string };
};

export type GithubReposResult = { ok: true; repos: GithubRepo[] } | { ok: false };

type CuratedRepo = {
  name: string;
  displayName: string;
  category: RepoCategory;
  description: string;
  ru?: string;
  ar?: string;
  language: string;
  homepage?: string;
  topics: string[];
  /** Last known star count, used when the API is unavailable. */
  stars: number;
};

/*
 * Hand-curated, ORDERED showcase. Baked from `gh repo view kyan9400/<name>` so the section renders
 * complete even when the GitHub API is rate-limited or down. The four repos featured as projects
 * (pulseboard, deployledger, gatehouse, webhook-workbench) are intentionally not listed here.
 *
 * Order: the strongest live apps first, led by backend, AI and frontend work (the site's focus is web
 * and AI systems); platform tooling after them. getGithubRepos() then moves every repo that has a
 * screenshot ahead of the text-only ones, keeping this order within each group.
 *
 * Curated copy is authoritative (it was reviewed). `ru` / `ar` translate the description; the API only
 * refreshes star counts, and fills a description/topics only where the curated entry has none.
 */
const CURATED: CuratedRepo[] = [
  {
    name: "stockroom-ledger",
    displayName: "Stockroom Ledger",
    category: "backend",
    language: "Python",
    homepage: "https://stockroom-ledger.vercel.app/",
    description: "Transactional inventory operations with audited cycle counts, idempotent writes, and optimistic concurrency.",
    ru: "Складской учёт на транзакциях: инвентаризации с журналом аудита, идемпотентная запись и оптимистичные блокировки.",
    ar: "عمليات مخزون قائمة على المعاملات، مع جرد دوري موثّق وكتابة آمنة عند التكرار وتحكم متفائل في التزامن.",
    topics: ["fastapi", "react", "typescript", "docker", "optimistic-locking", "audit-log", "inventory"],
    stars: 0
  },
  {
    name: "my-gpt",
    displayName: "MyGPT",
    category: "ai",
    language: "Python",
    homepage: "https://kyan9400.github.io/my-gpt/",
    description:
      "Readable character-level transformer with reproducible training, safe checkpoints, and an interactive causal-attention explorer.",
    ru: "Понятный трансформер на уровне символов: воспроизводимое обучение, безопасные чекпоинты и интерактивный просмотр каузального внимания.",
    ar: "نموذج Transformer مقروء على مستوى الحروف، بتدريب قابل للتكرار ونقاط حفظ آمنة وأداة تفاعلية لاستكشاف الانتباه السببي.",
    topics: ["transformer", "pytorch", "language-model", "deep-learning", "gradio", "machine-learning"],
    stars: 0
  },
  {
    name: "leasequeue",
    displayName: "LeaseQueue",
    category: "backend",
    language: "Python",
    homepage: "https://leasequeue.vercel.app/",
    description: "Durable background jobs with atomic leases, retries, idempotency, and dead-letter recovery.",
    ru: "Надёжные фоновые задачи: атомарная аренда, повторы, идемпотентность и восстановление из очереди dead-letter.",
    ar: "مهام خلفية موثوقة مع حجز ذرّي وإعادة محاولة وidempotency واستعادة المهام الفاشلة من قائمة dead-letter.",
    topics: ["fastapi", "python", "task-queue", "background-jobs", "idempotency", "retries", "dead-letter-queue"],
    stars: 0
  },
  {
    name: "access-verdict",
    displayName: "Access Verdict",
    category: "backend",
    language: "TypeScript",
    homepage: "https://kyan9400.github.io/access-verdict/",
    description: "Explainable authorization policy workbench with deny-first evaluation, decision traces, and executable scenarios.",
    ru: "Инструмент для политик авторизации с объяснимыми решениями: сначала запрет, трассировка решений и исполняемые сценарии.",
    ar: "بيئة عمل لسياسات التفويض بقرارات قابلة للتفسير: الرفض أولاً، وتتبّع كل قرار، وسيناريوهات قابلة للتنفيذ.",
    topics: ["authorization", "rbac", "abac", "policy-engine", "security", "react", "typescript"],
    stars: 0
  },
  {
    name: "smart-platform",
    displayName: "Smart Platform",
    category: "frontend",
    language: "TypeScript",
    homepage: "https://smart-platform-ten.vercel.app",
    description:
      "Bilingual (EN/AR) Next.js marketing site for Kingdom Vision Equipment Rental, a heavy and light equipment rental company in Riyadh, Saudi Arabia.",
    ru: "Двуязычный (EN/AR) сайт на Next.js для Kingdom Vision Equipment Rental — компании по аренде тяжёлой и лёгкой техники в Эр-Рияде.",
    ar: "موقع تعريفي ثنائي اللغة (الإنجليزية والعربية) مبني بـ Next.js لشركة Kingdom Vision لتأجير المعدات الثقيلة والخفيفة في الرياض.",
    topics: ["nextjs", "react", "typescript", "tailwindcss", "i18n", "rtl"],
    stars: 0
  },
  {
    name: "retry-lab",
    displayName: "Retry Lab",
    category: "backend",
    language: "TypeScript",
    homepage: "https://kyan9400.github.io/retry-lab/",
    description: "An interactive simulator for comparing retry, backoff, and jitter strategies.",
    ru: "Интерактивный симулятор для сравнения стратегий повторов, backoff и jitter.",
    ar: "محاكٍ تفاعلي لمقارنة استراتيجيات إعادة المحاولة والتراجع (backoff) والتشويش العشوائي (jitter).",
    topics: ["retry", "backoff", "reliability", "distributed-systems", "simulation", "react", "typescript"],
    stars: 0
  },
  {
    name: "incident-canvas",
    displayName: "Incident Canvas",
    category: "platform",
    language: "TypeScript",
    homepage: "https://kyan9400.github.io/incident-canvas/",
    description: "Local-first incident postmortem workspace with a searchable archive, response metrics, and portable reports.",
    ru: "Local-first пространство для разбора инцидентов: архив с поиском, метрики реагирования и переносимые отчёты.",
    ar: "مساحة عمل محلية أولاً لتحليل الحوادث بعد وقوعها، مع أرشيف قابل للبحث ومقاييس للاستجابة وتقارير قابلة للنقل.",
    topics: ["incident-response", "postmortem", "sre", "local-first", "react", "typescript"],
    stars: 1
  },
  {
    name: "togglebench",
    displayName: "ToggleBench",
    category: "platform",
    language: "TypeScript",
    homepage: "https://kyan9400.github.io/togglebench/",
    description: "Deterministic feature-flag targeting and rollout workbench with explainable decisions.",
    ru: "Детерминированный таргетинг и раскатка фича-флагов с объяснимыми решениями.",
    ar: "بيئة عمل حتمية لاستهداف مفاتيح الميزات (feature flags) وطرحها التدريجي، بقرارات قابلة للتفسير.",
    topics: ["feature-flags", "progressive-delivery", "rollout", "developer-tools", "react", "typescript"],
    stars: 0
  },
  {
    name: "repo-vitals",
    displayName: "Repo Vitals",
    category: "platform",
    language: "TypeScript",
    homepage: "https://kyan9400.github.io/repo-vitals/",
    description: "Transparent GitHub portfolio health check with shareable Markdown and JSON evidence reports.",
    ru: "Прозрачная проверка GitHub-портфолио с отчётами в Markdown и JSON, которыми можно поделиться.",
    ar: "فحص شفاف لملف GitHub، مع تقارير أدلة بصيغتي Markdown وJSON قابلة للمشاركة.",
    topics: ["github-api", "developer-tools", "audit", "open-source", "react", "typescript"],
    stars: 0
  },
  {
    name: "sehati-client",
    displayName: "Sehati Client",
    category: "frontend",
    language: "TypeScript",
    homepage: "https://mellifluous-strudel-16e4ee.netlify.app",
    description:
      "Front-end for Sehati, a clinic management system: React + TypeScript single-page app with Tailwind CSS and dashboard, patients, appointments, doctors and settings pages (UI prototype with mock data).",
    ru: "Фронтенд Sehati — системы управления клиникой: SPA на React + TypeScript и Tailwind CSS с дашбордом, пациентами, записями, врачами и настройками (прототип интерфейса на тестовых данных).",
    ar: "الواجهة الأمامية لنظام Sehati لإدارة العيادات: تطبيق صفحة واحدة بـ React + TypeScript وTailwind CSS، بصفحات للوحة التحكم والمرضى والمواعيد والأطباء والإعدادات (نموذج أولي ببيانات تجريبية).",
    topics: ["react", "typescript", "tailwindcss", "dashboard", "clinic-management"],
    stars: 0
  },
  {
    name: "green-api-max-chat",
    displayName: "GREEN-API MAX Chat",
    category: "frontend",
    language: "TypeScript",
    homepage: "https://green-api-max-chat-nine.vercel.app",
    // The GitHub description is in Russian; the curated copy is used instead.
    description: "MAX messenger web chat on GREEN-API (React + TypeScript): send and receive messages.",
    ru: "Веб-чат для мессенджера MAX на GREEN-API (React + TypeScript): отправка и получение сообщений.",
    ar: "دردشة ويب لتطبيق MAX عبر GREEN-API (React + TypeScript): إرسال الرسائل واستقبالها.",
    topics: ["react", "typescript", "green-api", "messaging"],
    stars: 0
  },
  {
    name: "file-finder-mcp",
    displayName: "File Finder MCP",
    category: "ai",
    language: "Python",
    description: "Bounded, ranked local file discovery for Model Context Protocol clients.",
    ru: "Поиск локальных файлов с ограничениями и ранжированием для клиентов Model Context Protocol.",
    ar: "بحث محدود ومرتّب في الملفات المحلية لعملاء Model Context Protocol.",
    topics: ["model-context-protocol", "mcp-server", "file-search", "developer-tools", "python"],
    stars: 0
  },
  {
    name: "opsmind",
    displayName: "OpsMind",
    category: "ai",
    language: "TypeScript",
    description: "AI-powered operations & knowledge platform: Next.js, Node.js, PostgreSQL, Python RAG, Docker, CI/CD.",
    ru: "Платформа операций и базы знаний с AI: Next.js, Node.js, PostgreSQL, RAG на Python, Docker, CI/CD.",
    ar: "منصة للعمليات والمعرفة مدعومة بالذكاء الاصطناعي: Next.js وNode.js وPostgreSQL وRAG بلغة Python وDocker وCI/CD.",
    topics: ["rag", "nextjs", "nodejs", "postgresql", "python", "docker"],
    stars: 0
  },
  {
    name: "micrograd-plus",
    displayName: "Micrograd+",
    category: "ai",
    language: "Python",
    description:
      "Small autograd engine with computation-graph visualization and optimizers, built to learn neural networks from first principles.",
    ru: "Небольшой движок автодифференцирования с визуализацией графа вычислений и оптимизаторами — чтобы разобраться в нейросетях с основ.",
    ar: "محرك صغير للاشتقاق التلقائي مع تصوير لمخطط الحساب ومُحسِّنات، بُني لفهم الشبكات العصبية من أساسها.",
    topics: ["autograd", "neural-networks", "machine-learning", "education", "python"],
    stars: 0
  },
  {
    name: "oktoberfest-ai",
    displayName: "Oktoberfest AI",
    category: "ai",
    language: "Python",
    description: "News/RSS sentiment analyzer (HuggingFace, Matplotlib, Excel export).",
    ru: "Анализ тональности новостей и RSS (HuggingFace, Matplotlib, выгрузка в Excel).",
    ar: "محلّل لمشاعر الأخبار وخلاصات RSS (HuggingFace وMatplotlib وتصدير إلى Excel).",
    topics: ["sentiment-analysis", "nlp", "huggingface", "transformers", "rss", "python"],
    stars: 0
  },
  {
    name: "tampertrail",
    displayName: "TamperTrail",
    category: "backend",
    language: "Go",
    description: "Tamper-evident JSONL audit trails with streaming verification and authenticated checkpoints.",
    ru: "Журналы аудита в JSONL, в которых видна любая подмена: потоковая проверка и подписанные контрольные точки.",
    ar: "سجلات تدقيق بصيغة JSONL تكشف أي تلاعب، مع تحقق متدفق ونقاط تفتيش موثّقة.",
    topics: ["audit-log", "tamper-evident", "hmac", "security", "cli", "golang"],
    stars: 0
  },
  {
    name: "sehati-server",
    displayName: "Sehati API",
    category: "backend",
    language: "JavaScript",
    description: "Backend API for Sehati, a clinic management platform: Node.js / Express 5 with MongoDB (Mongoose) and JWT-based login.",
    ru: "Бэкенд API для Sehati — платформы управления клиникой: Node.js / Express 5, MongoDB (Mongoose) и вход по JWT.",
    ar: "واجهة API خلفية لمنصة Sehati لإدارة العيادات: Node.js / Express 5 مع MongoDB (Mongoose) وتسجيل دخول عبر JWT.",
    topics: ["nodejs", "express", "mongodb", "mongoose", "jwt", "rest-api"],
    stars: 0
  },
  {
    name: "resto-pro",
    displayName: "Resto Pro",
    category: "frontend",
    language: "TypeScript",
    description:
      "Restaurant online-ordering monorepo: Next.js menu, cart and checkout with an Express + Prisma API and a realtime kitchen dashboard.",
    ru: "Монорепозиторий онлайн-заказов для ресторана: меню, корзина и оформление на Next.js, API на Express + Prisma и дашборд кухни в реальном времени.",
    ar: "مستودع موحّد لطلبات المطاعم عبر الإنترنت: قائمة وسلة ودفع بـ Next.js، وواجهة API بـ Express + Prisma، ولوحة مطبخ لحظية.",
    topics: ["nextjs", "express", "prisma", "postgresql", "typescript"],
    stars: 0
  },
  {
    name: "alkajal2",
    displayName: "Al-Sami Contracting",
    category: "frontend",
    language: "TypeScript",
    // No `homepage`: https://alkajal2.vercel.app currently serves the default Next.js starter page, so
    // the card links to the repository instead of showing a "Live" badge. Restore it once redeployed.
    description: "Arabic RTL landing page for Al-Sami Contracting & Equipment Rental, built with Next.js 16, React 19, TypeScript and Tailwind CSS 4.",
    ru: "Лендинг на арабском (RTL) для Al-Sami Contracting & Equipment Rental на Next.js 16, React 19, TypeScript и Tailwind CSS 4.",
    ar: "صفحة هبوط عربية (RTL) لشركة السامي للمقاولات وتأجير المعدات، مبنية بـ Next.js 16 وReact 19 وTypeScript وTailwind CSS 4.",
    topics: ["nextjs", "react", "typescript", "tailwindcss", "rtl", "landing-page"],
    stars: 0
  },
  {
    name: "schema-sentry",
    displayName: "Schema Sentry",
    category: "platform",
    language: "Python",
    description: "Detect unsafe SQL migrations and scan only changed files in pull-request CI.",
    ru: "Находит небезопасные SQL-миграции и в CI для pull request проверяет только изменённые файлы.",
    ar: "يكشف ترحيلات SQL غير الآمنة، ويفحص الملفات المتغيّرة فقط في CI لطلبات الدمج.",
    topics: ["sql", "postgresql", "migrations", "github-actions", "sarif", "static-analysis", "python"],
    stars: 0
  },
  {
    name: "openapi-impact",
    displayName: "OpenAPI Impact",
    category: "platform",
    language: "Python",
    description: "Detect breaking changes between OpenAPI specifications in local development and CI.",
    ru: "Находит несовместимые изменения между спецификациями OpenAPI — локально и в CI.",
    ar: "يكشف التغييرات الكاسرة بين مواصفات OpenAPI أثناء التطوير المحلي وفي CI.",
    topics: ["openapi", "api", "ci", "github-actions", "cli", "python"],
    stars: 0
  },
  {
    name: "git-hotspots",
    displayName: "Git Hotspots",
    category: "platform",
    language: "Go",
    description: "Rank high-risk files from Git history and track risk-score changes against a baseline.",
    ru: "Ранжирует рискованные файлы по истории Git и отслеживает изменение оценки риска относительно базовой линии.",
    ar: "يرتّب الملفات الأعلى خطورة من سجل Git، ويتتبّع تغيّر درجة الخطورة مقارنة بخط أساس.",
    topics: ["git", "static-analysis", "code-quality", "technical-debt", "continuous-integration", "cli", "golang"],
    stars: 0
  },
  {
    name: "slo-forge",
    displayName: "SLO Forge",
    category: "platform",
    language: "Go",
    description:
      "SLO-as-code compiler for Prometheus burn-rate alerts, Prometheus Operator resources, Grafana dashboards, and reviewable error budgets.",
    ru: "Компилятор SLO-as-code: алерты по burn rate для Prometheus, ресурсы Prometheus Operator, дашборды Grafana и бюджеты ошибок, удобные для ревью.",
    ar: "مترجم لأهداف SLO ككود: تنبيهات معدّل الاستهلاك لـ Prometheus، وموارد Prometheus Operator، ولوحات Grafana، وميزانيات أخطاء قابلة للمراجعة.",
    topics: ["slo", "sre", "prometheus", "grafana", "observability", "platform-engineering", "golang"],
    stars: 0
  },
  {
    name: "platform-blueprint",
    displayName: "Platform Blueprint",
    category: "platform",
    language: "HCL",
    description: "GitOps reference platform with Flux, Flagger canaries, Kubernetes policy, observability, and Terraform EKS.",
    ru: "Эталонная GitOps-платформа: Flux, канареечные релизы Flagger, политики Kubernetes, наблюдаемость и Terraform для EKS.",
    ar: "منصة GitOps مرجعية: Flux، وإصدارات Canary عبر Flagger، وسياسات Kubernetes، والمراقبة، وTerraform لـ EKS.",
    topics: ["gitops", "fluxcd", "flagger", "kyverno", "terraform", "prometheus", "platform-engineering"],
    stars: 0
  }
];


type ApiRepo = { stars: number; description: string | null; topics: string[] };

/** Live demo URL, or undefined for empty values and links back to github.com (releases pages etc.). */
function liveHomepage(value: string | undefined | null): string | undefined {
  const url = value?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return undefined;
  try {
    if (new URL(url).hostname === "github.com") return undefined;
  } catch {
    return undefined;
  }
  return url;
}

/**
 * One request for all of the user's repos (82 public today, 100 per page), cached for an hour.
 * Returns null on any failure — the caller then serves the curated data unchanged.
 */
async function fetchApiRepos(): Promise<Map<string, ApiRepo> | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "alhassan-portfolio (+https://github.com/kyan9400)"
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(API_URL, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(API_TIMEOUT_MS)
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;

    const byName = new Map<string, ApiRepo>();
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const repo = item as Record<string, unknown>;
      if (typeof repo.name !== "string") continue;
      byName.set(repo.name.toLowerCase(), {
        stars: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
        description: typeof repo.description === "string" && repo.description.trim() ? repo.description.trim() : null,
        topics: Array.isArray(repo.topics) ? repo.topics.filter((t): t is string => typeof t === "string") : []
      });
    }
    return byName;
  } catch {
    return null;
  }
}

/**
 * The curated repository showcase, in display order. Always `{ ok: true }`: the GitHub API only
 * enriches the baked-in data (stars; description/topics where missing), so the section never
 * shows an "unavailable" state. Uses `GITHUB_TOKEN` when set (5,000 req/h instead of 60).
 */
export async function getGithubRepos(): Promise<GithubReposResult> {
  const live = await fetchApiRepos();

  const repos = CURATED.map((curated): GithubRepo => {
    const api = live?.get(curated.name.toLowerCase());
    return {
      name: curated.name,
      displayName: curated.displayName,
      description: curated.description || api?.description || null,
      html_url: `${REPO_BASE}/${curated.name}`,
      homepage: liveHomepage(curated.homepage),
      language: curated.language || null,
      stargazers_count: api ? Math.max(api.stars, 0) : curated.stars,
      topics: curated.topics.length > 0 ? curated.topics : (api?.topics ?? []),
      category: curated.category,
      previewImage: publicPathForRepoScreenshot(curated.name),
      descriptionI18n: curated.ru || curated.ar ? { ru: curated.ru, ar: curated.ar } : undefined
    };
  });

  // Repos with a screenshot first (a stable sort keeps the curated order within each group), so the
  // section never opens on text-only cards.
  repos.sort((a, b) => Number(Boolean(b.previewImage)) - Number(Boolean(a.previewImage)));

  return { ok: true, repos };
}
