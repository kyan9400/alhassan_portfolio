import type { Locale } from "@/lib/types";
import { typographRuDeep } from "@/lib/typograph";

/**
 * Project catalog. English is the source of truth; `localizeProject` overlays the
 * Russian and Arabic text. Work projects are private (NDA), so they carry an
 * architecture diagram and no `github`; open-source projects link to the real repo.
 * Every claim here must match the CV or the repo README — no invented metrics.
 */
export type Project = {
  slug: string;
  title: string;
  kind: "work" | "open-source";
  /** Work projects only, e.g. "Avenue Group". Omit when unknown. */
  company?: string;
  /** One-line context under the title. */
  rolePurpose: string;
  description: string;
  /** Paragraphs separated by a blank line (\n\n). */
  longDescription: string;
  whatItDoes: string[];
  tech: string[];
  /** Exact repo URL. Omitted for private / NDA work. */
  github?: string;
  /** Live demo URL, if any. */
  live?: string;
  /** "/images/projects/<slug>.svg" (diagram) or "/images/projects/<slug>.webp" (screenshot). */
  image: string;
  imageKind: "diagram" | "screenshot";
  problem?: string;
  solution?: string;
  result?: string;
  /**
   * Work (diagram) projects: a simplified architecture, left to right, drawn as HTML on the cards so the
   * labels stay readable at any width (the full SVG diagram is on the case-study page). Stage labels and
   * notes are translated; node names are tech names and stay in Latin script.
   */
  flow?: FlowStage[];
};

export type FlowStage = { label: string; nodes: { name: string; note?: string }[] };

type ProjectText = Pick<Project, "title" | "rolePurpose" | "description" | "longDescription" | "whatItDoes"> &
  Partial<Pick<Project, "company" | "problem" | "solution" | "result" | "flow">>;

export const projects: Project[] = [
  {
    slug: "okkp-platform",
    title: "OKKP Operations Platform",
    kind: "work",
    company: "Avenue Group",
    rolePurpose: "Chief Full-Stack Developer · From scratch",
    description:
      "An operational management platform I designed and shipped from scratch: employee management, violation tracking and reporting dashboards, with role-based access and audit logs.",
    whatItDoes: [
      "Employee management, violation tracking and reporting dashboards",
      "Role-based access control and audit logs across modules",
      "Secure media uploads through Cloudinary and Multer",
      "Excel exports that produce audit-ready datasets without a developer"
    ],
    longDescription:
      "At Avenue Group I was the Chief Full-Stack Developer on OKKP, an operational management platform that started from an empty repository. The goal was one system for the company's day-to-day operations, with clear boundaries between the UI, the business logic and the data layer.\n\nI architected it end to end: a React + TypeScript single-page app, a Node.js / Express REST API, and a data layer on PostgreSQL and MongoDB. On top of that I built the core modules — employee management, violation tracking and reporting dashboards — with role-based access control and audit logs, plus a secure media-upload pipeline on Cloudinary and Multer.\n\nReporting had to work for people who don't write queries, so Excel exports let non-technical staff produce audit-ready datasets on their own. I also owned deployment and production support, and delivered a fully responsive interface in Tailwind CSS.",
    tech: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Cloudinary", "Tailwind CSS"],
    image: "/images/projects/okkp-platform.svg",
    imageKind: "diagram",
    problem:
      "The company needed an operational management platform built from scratch, with clear boundaries between UI, business logic and data.",
    solution:
      "React + TypeScript SPA, Node.js / Express REST API, PostgreSQL + MongoDB, role-based access, audit logs and Cloudinary uploads.",
    result: "Shipped to production; non-technical staff export audit-ready Excel datasets on their own.",
    flow: [
      { label: "Frontend", nodes: [{ name: "React + TypeScript", note: "SPA · dashboards per role" }] },
      { label: "API", nodes: [{ name: "Node.js / Express", note: "REST · RBAC · audit log" }] },
      { label: "Data", nodes: [{ name: "PostgreSQL" }, { name: "MongoDB" }, { name: "Cloudinary", note: "media" }] }
    ]
  },
  {
    slug: "document-intelligence-rag",
    title: "Document Intelligence (RAG)",
    kind: "work",
    company: "Elektroservis",
    rolePurpose: "Current role · RAG document search",
    description:
      "Search and RAG over engineering (PTO) documentation — PDF, Word, Excel and scanned files — with hybrid keyword + semantic retrieval behind a FastAPI service.",
    whatItDoes: [
      "Indexes PDF, Word and Excel files, including scanned documents via OCR",
      "Hybrid search: keyword matching plus semantic retrieval with sentence-transformers + FAISS",
      "FastAPI ingestion and query pipelines",
      "LLM-assisted answers grounded in the retrieved passages"
    ],
    longDescription:
      "Engineering (PTO) documentation is a mix of PDFs, Word files, Excel sheets and scans. My current work at Elektroservis in Moscow is a search and RAG system that makes all of it searchable in one place.\n\nThe ingestion pipeline parses each format and runs scanned documents through OCR before indexing. Retrieval is hybrid: keyword matching catches exact terms, while semantic search — sentence-transformers embeddings in a FAISS index — finds passages that say the same thing in different words. Combining the two is meant to give more relevant answers than either approach alone.\n\nFastAPI pipelines connect parsing, indexing, retrieval and LLM-assisted answers. The system is in active development and the code is private, so the diagram shows the architecture.",
    tech: ["Python", "FastAPI", "OCR", "sentence-transformers", "FAISS", "LLM"],
    image: "/images/projects/document-rag.svg",
    imageKind: "diagram",
    problem:
      "Engineering documents are spread across PDF, Word, Excel and scanned files — a mix that plain keyword search handles poorly.",
    solution:
      "OCR and parsing for every format, hybrid retrieval (sentence-transformers + FAISS), FastAPI pipelines and LLM-assisted answers.",
    result: "In active development; hybrid retrieval chosen to improve answer relevance.",
    flow: [
      { label: "Ingest", nodes: [{ name: "PDF · Word · Excel" }, { name: "OCR", note: "scanned files" }] },
      { label: "Index", nodes: [{ name: "sentence-transformers" }, { name: "FAISS + keyword" }] },
      { label: "Query", nodes: [{ name: "FastAPI", note: "hybrid retrieval" }, { name: "LLM", note: "answer" }] }
    ]
  },
  {
    slug: "ai-dashboard-suite",
    title: "AI-Driven Analytics Dashboards",
    kind: "work",
    company: "Freelance",
    rolePurpose: "Freelance client work · KPI dashboards",
    description:
      "Interactive dashboards for a client that bring several data sources together, with an AI panel that summarises what changed.",
    whatItDoes: [
      "Filterable KPI modules instead of static exports",
      "A Node.js API that brings several data sources together",
      "Trend views that make changes easy to spot",
      "An AI panel with plain-language summaries of what changed"
    ],
    longDescription:
      "A freelance client was working from static exports and one-off spreadsheets, so trends stayed hidden until someone refreshed a report by hand. The goal was interactive dashboards that make KPIs easier to read.\n\nI built a React front end with filterable KPI modules and a Node.js API that brings several data sources together behind one REST interface.\n\nAn AI panel summarises what changed in plain language. It sits beside the numbers rather than in front of them, so the dashboards stay readable and the AI stays an assistant. The code belongs to the client, so the diagram shows the architecture.",
    tech: ["React", "Node.js", "REST API", "LLM"],
    image: "/images/projects/ai-dashboard-suite.svg",
    imageKind: "diagram",
    problem: "Decisions ran on static exports and spreadsheets, so trends surfaced late.",
    solution: "React dashboards with filterable KPIs, a Node.js API over several data sources and an AI summary panel.",
    result: "Filterable KPIs in one place instead of hand-refreshed reports.",
    flow: [
      { label: "Data", nodes: [{ name: "Multiple sources" }] },
      { label: "API", nodes: [{ name: "Node.js", note: "one REST interface" }] },
      { label: "UI", nodes: [{ name: "React", note: "KPI dashboards" }, { name: "LLM", note: "AI summaries" }] }
    ]
  },
  {
    slug: "pulseboard",
    title: "Pulseboard",
    kind: "open-source",
    rolePurpose: "Open source · Uptime & SLO monitoring",
    description:
      "Self-hosted HTTP uptime monitoring with automatic incidents, SLO error budgets, a public status page and Prometheus metrics — all in one container.",
    whatItDoes: [
      "Checks HTTP endpoints on a schedule and records latency and availability",
      "Opens and resolves incidents automatically",
      "SLO error-budget reports for 24-hour, 7-day and 30-day windows",
      "Public status page, typed JSON API, health probes and /metrics"
    ],
    longDescription:
      "Pulseboard is a compact uptime monitor that runs in a single container: the scheduler, API, dashboard and SQLite database need no external services. It checks public HTTP endpoints on a schedule, stores latency and availability, and opens or resolves incidents on its own.\n\nRetained checks become SLO error-budget reports — target, observed uptime, estimated downtime and budget exhaustion over 24 hours, 7 days or 30 days. The same state is available through a responsive dashboard, a read-only public status page that never exposes monitored URLs, a typed JSON API, liveness and readiness probes, and Prometheus-compatible metrics.\n\nThe defaults are deliberately safe: private and reserved networks are blocked, URLs with credentials are rejected, redirects aren't followed, and a single environment variable puts every write behind an API key. The test suite runs on an in-memory HTTP transport and covers incident recovery, SLO math, access control and outbound-target protection.",
    tech: ["Python", "FastAPI", "SQLite", "Docker", "Prometheus"],
    github: "https://github.com/kyan9400/pulseboard",
    live: "https://pulseboard-five-tau.vercel.app/",
    image: "/images/projects/pulseboard.webp",
    imageKind: "screenshot",
    problem: "Uptime checks, incident history and SLO reporting usually mean running several separate services.",
    solution: "One FastAPI service with an async scheduler, SQLite storage, a dashboard, a public status page and Prometheus metrics.",
    result: "Runs with a single docker compose command; MIT-licensed, with CI and a live demo."
  },
  {
    slug: "deployledger",
    title: "DeployLedger",
    kind: "open-source",
    rolePurpose: "Open source · Release operations & DORA metrics",
    description:
      "A self-hosted release-operations control plane: it ingests deployment events, computes DORA metrics and helps decide whether the next release is safe to ship.",
    whatItDoes: [
      "Ingests deployments via API or signed GitHub webhooks, with idempotent writes",
      "Computes the five DORA metrics with daily trends",
      "Keeps an append-only, tamper-evident audit chain",
      "React dashboard with service scoping, an environment matrix and a release feed"
    ],
    longDescription:
      "DeployLedger gives a team one clear, auditable view of delivery speed and change stability. Deployment events arrive through a small REST API or verified GitHub webhooks; idempotency keys make repeated requests safe, and every write lands in an append-only, hash-linked audit chain.\n\nFrom those events it computes the current five-metric DORA model — change lead time, deployment frequency, failed deployment recovery time, change fail rate and deployment rework rate. The React + Vite dashboard shows the window behind each number, per service and environment, and falls back to clearly labelled demo data when no API is connected.\n\nThe project is shaped like a production service: async FastAPI with Pydantic v2, SQLite locally and PostgreSQL in deployment, Prometheus metrics and health probes, HMAC webhook verification, non-root containers with read-only filesystems, Kustomize overlays, an ECS/Fargate Terraform blueprint, runbooks, and CI that tests the code and scans the images.",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Terraform", "Prometheus"],
    github: "https://github.com/kyan9400/deployledger",
    live: "https://deployledger.vercel.app",
    image: "/images/projects/deployledger.webp",
    imageKind: "screenshot",
    problem: "Delivery speed and change stability are hard to judge when deployment data is scattered.",
    solution: "A FastAPI service that ingests deployment events and computes DORA metrics, with a React dashboard and a hash-linked audit chain.",
    result: "Live dashboard on Vercel; self-hostable with Docker Compose, Kustomize or Terraform."
  },
  {
    slug: "gatehouse",
    title: "Gatehouse",
    kind: "open-source",
    rolePurpose: "Open source · Just-in-time access control",
    description:
      "A self-hosted access request and approval control plane: narrowly scoped, short-lived access, with every decision recorded in a verifiable audit chain.",
    whatItDoes: [
      "Engineers request narrowly scoped, short-lived access",
      "Approvers see the risk and policy context before deciding",
      "Every decision is written to a workspace-scoped, hash-linked audit chain",
      "Workspace isolation with requester, approver and admin roles"
    ],
    longDescription:
      "Standing production access creates ambiguity during an incident: who had access, why they needed it, and whether the decision followed policy. Gatehouse answers that with a small, inspectable just-in-time workflow — engineers request narrowly scoped, time-limited access, and approvers review it with the risk and policy context in front of them.\n\nThe backend is async FastAPI with Pydantic validation, SQLite locally and PostgreSQL in production. Correctness is handled explicitly: idempotency keys, optimistic locking, policy-bounded TTLs and safe handling of conflicting decisions. Each workspace keeps its own append-only, hash-linked audit chain.\n\nThe React + TypeScript review desk runs in live or demo mode and works well from the keyboard. Delivery gets the same care: multi-stage non-root images, health and readiness probes, Kustomize overlays, Terraform, and image releases to GHCR.",
    tech: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "Terraform"],
    github: "https://github.com/kyan9400/gatehouse",
    live: "https://gatehouse-nine.vercel.app",
    image: "/images/projects/gatehouse.webp",
    imageKind: "screenshot",
    problem: "With standing production access it's hard to tell who had access, why, and whether policy was followed.",
    solution: "A just-in-time request and approval workflow with policy context, workspace isolation and a hash-linked audit trail.",
    result: "Live demo dashboard and a public FastAPI / OpenAPI demo; self-hostable with Docker Compose."
  },
  {
    slug: "webhook-workbench",
    title: "Webhook Workbench",
    kind: "open-source",
    rolePurpose: "Open source · Webhook debugging in Go",
    description:
      "A private, self-hosted workbench to capture, inspect, verify and safely replay webhooks — one dependency-free Go binary with the UI built in.",
    whatItDoes: [
      "Captures any HTTP method at /inbox/{channel} and shows traffic live",
      "Verifies GitHub, Stripe and generic HMAC-SHA-256 signatures",
      "Replays captured requests safely, with SSRF protection",
      "Redacts secrets before storage; optional bearer-token auth"
    ],
    longDescription:
      "Webhook Workbench captures incoming webhooks on any channel and shows each request's decoded payload, redacted headers and a ready-to-run cURL command. It ships as a single Go binary built on the standard library alone, with the browser interface embedded, and listens only on localhost by default.\n\nSignatures are verified against the exact captured body for GitHub, Stripe (with its five-minute receipt window) and generic HMAC-SHA-256 profiles; the secret is used once and never stored. Captured requests can be replayed to an endpoint of your choice, but conservatively: private, loopback and non-HTTP targets are rejected, DNS is re-checked on connect, redirects are limited, and authorization, cookie and hop-by-hop headers are stripped.\n\nIt keeps a bounded event history in a local JSON snapshot, preserves binary bodies as base64 and exposes a health probe. The Docker setup runs as a non-root user with dropped capabilities and a read-only root filesystem, and the tests cover redaction, signature verification, replay behaviour and SSRF defences.",
    tech: ["Go", "net/http", "Docker", "HMAC-SHA-256"],
    github: "https://github.com/kyan9400/webhook-workbench",
    live: "https://webhook-workbench.vercel.app/",
    image: "/images/projects/webhook-workbench.webp",
    imageKind: "screenshot",
    problem: "Debugging webhooks often means sending real payloads to a third-party inspection service.",
    solution: "A self-hosted Go binary that captures, verifies and safely replays webhooks, redacting secrets before storage.",
    result: "Release binaries with checksums, a hardened Docker setup and a public sandbox demo."
  }
];

/** Russian and Arabic text for every project. Tech names stay in Latin script. */
const translations: Record<string, Record<Exclude<Locale, "en">, ProjectText>> = {
  "okkp-platform": {
    ru: {
      title: "OKKP — платформа операционного управления",
      company: "Avenue Group",
      rolePurpose: "Главный full-stack разработчик · с нуля",
      description:
        "Платформа операционного управления, которую я спроектировал и запустил с нуля: управление сотрудниками, учёт нарушений и отчётные дашборды с ролевым доступом и журналом аудита.",
      whatItDoes: [
        "Управление сотрудниками, учёт нарушений и отчётные дашборды",
        "Ролевой доступ и журнал аудита во всех модулях",
        "Защищённая загрузка медиафайлов через Cloudinary и Multer",
        "Выгрузка в Excel: данные для аудита без участия разработчика"
      ],
      longDescription:
        "В Avenue Group я был главным full-stack разработчиком OKKP — платформы операционного управления, которая начиналась с пустого репозитория. Задача — единая система для повседневной работы компании с чёткими границами между интерфейсом, бизнес-логикой и слоем данных.\n\nАрхитектуру я выстроил целиком: SPA на React + TypeScript, REST API на Node.js / Express, данные в PostgreSQL и MongoDB. Поверх неё — ключевые модули: управление сотрудниками, учёт нарушений и отчётные дашборды с ролевым доступом и журналом аудита, а также защищённая загрузка медиафайлов через Cloudinary и Multer.\n\nОтчётность должна была работать для людей, которые не пишут запросы, поэтому выгрузка в Excel позволяет сотрудникам без технической подготовки самостоятельно собирать данные для аудита. Деплой и поддержка в продакшене тоже были на мне, а интерфейс на Tailwind CSS полностью адаптивный.",
      problem:
        "Компании нужна была платформа операционного управления с нуля — с чёткими границами между интерфейсом, бизнес-логикой и данными.",
      solution:
        "SPA на React + TypeScript, REST API на Node.js / Express, PostgreSQL + MongoDB, ролевой доступ, журнал аудита и загрузка через Cloudinary.",
      result: "Запущена в продакшен; сотрудники сами выгружают данные для аудита в Excel.",
      flow: [
        { label: "Фронтенд", nodes: [{ name: "React + TypeScript", note: "SPA · дашборды по ролям" }] },
        { label: "API", nodes: [{ name: "Node.js / Express", note: "REST · RBAC · аудит" }] },
        { label: "Данные", nodes: [{ name: "PostgreSQL" }, { name: "MongoDB" }, { name: "Cloudinary", note: "медиа" }] }
      ]
    },
    ar: {
      title: "منصة OKKP لإدارة العمليات",
      company: "Avenue Group",
      rolePurpose: "كبير مطوري Full-Stack · من الصفر",
      description:
        "منصة لإدارة العمليات صمّمتها وأطلقتها من الصفر: إدارة الموظفين وتتبّع المخالفات ولوحات التقارير، مع صلاحيات حسب الأدوار وسجل تدقيق.",
      whatItDoes: [
        "إدارة الموظفين وتتبّع المخالفات ولوحات التقارير",
        "صلاحيات حسب الأدوار وسجل تدقيق في جميع الوحدات",
        "رفع آمن للوسائط عبر Cloudinary وMulter",
        "تصدير إلى Excel يُنتج بيانات جاهزة للتدقيق دون تدخّل مطوّر"
      ],
      longDescription:
        "في Avenue Group كنت كبير مطوري Full-Stack في مشروع OKKP، وهو منصة لإدارة العمليات بدأت من مستودع فارغ. كان الهدف نظاماً واحداً للعمل اليومي في الشركة، بحدود واضحة بين الواجهة ومنطق الأعمال وطبقة البيانات.\n\nصمّمت البنية من طرف إلى طرف: تطبيق صفحة واحدة (SPA) مبني بـ React وTypeScript، وREST API مبنية بـ Node.js وExpress، وطبقة بيانات على PostgreSQL وMongoDB. وفوق ذلك بنيت الوحدات الأساسية — إدارة الموظفين وتتبّع المخالفات ولوحات التقارير — مع صلاحيات حسب الأدوار وسجل تدقيق، إضافة إلى مسار آمن لرفع الوسائط عبر Cloudinary وMulter.\n\nكان على التقارير أن تخدم أشخاصاً لا يكتبون استعلامات، لذلك يتيح التصدير إلى Excel للموظفين غير التقنيين إعداد بيانات جاهزة للتدقيق بأنفسهم. وتولّيت أيضاً النشر ودعم بيئة الإنتاج، وقدّمت واجهة متجاوبة بالكامل مبنية بـ Tailwind CSS.",
      problem:
        "احتاجت الشركة إلى منصة لإدارة العمليات تُبنى من الصفر، بحدود واضحة بين الواجهة ومنطق الأعمال والبيانات.",
      solution:
        "تطبيق SPA بـ React + TypeScript، وREST API بـ Node.js / Express، وPostgreSQL + MongoDB، مع صلاحيات حسب الأدوار وسجل تدقيق ورفع للوسائط عبر Cloudinary.",
      result: "أُطلقت في بيئة الإنتاج، ويصدّر الموظفون بيانات التدقيق إلى Excel بأنفسهم.",
      flow: [
        { label: "الواجهة", nodes: [{ name: "React + TypeScript", note: "SPA · لوحات لكل دور" }] },
        { label: "API", nodes: [{ name: "Node.js / Express", note: "REST · صلاحيات · تدقيق" }] },
        { label: "البيانات", nodes: [{ name: "PostgreSQL" }, { name: "MongoDB" }, { name: "Cloudinary", note: "وسائط" }] }
      ]
    }
  },
  "document-intelligence-rag": {
    ru: {
      title: "Поиск по технической документации (RAG)",
      company: "Электросервис",
      rolePurpose: "Текущая работа · RAG-поиск по документации",
      description:
        "Поиск и RAG по документации ПТО — PDF, Word, Excel и сканам — с гибридным поиском по ключевым словам и по смыслу на базе FastAPI.",
      whatItDoes: [
        "Индексирует PDF, Word и Excel, включая сканы через OCR",
        "Гибридный поиск: ключевые слова плюс семантика на sentence-transformers и FAISS",
        "Пайплайны загрузки и запросов на FastAPI",
        "Ответы с помощью LLM на основе найденных фрагментов"
      ],
      longDescription:
        "Документация ПТО — это смесь PDF, файлов Word, таблиц Excel и сканов. Моя текущая работа в «Электросервисе» в Москве — система поиска и RAG, которая позволяет искать по всему этому в одном месте.\n\nПайплайн загрузки разбирает каждый формат и прогоняет сканы через OCR перед индексацией. Поиск гибридный: совпадение по ключевым словам находит точные термины, а семантический поиск — эмбеддинги sentence-transformers в индексе FAISS — находит фрагменты, где то же самое сказано другими словами. Сочетание двух подходов нужно, чтобы ответы были релевантнее, чем у каждого из них по отдельности.\n\nПайплайны на FastAPI связывают парсинг, индексацию, поиск и ответы с помощью LLM. Система в активной разработке, а код закрыт, поэтому здесь показана схема архитектуры.",
      problem:
        "Инженерные документы разбросаны по PDF, Word, Excel и сканам, а обычный поиск по ключевым словам плохо справляется с таким набором.",
      solution:
        "OCR и парсинг всех форматов, гибридный поиск (sentence-transformers + FAISS), пайплайны на FastAPI и ответы с помощью LLM.",
      result: "В активной разработке; гибридный поиск выбран, чтобы повысить релевантность ответов.",
      flow: [
        { label: "Загрузка", nodes: [{ name: "PDF · Word · Excel" }, { name: "OCR", note: "сканы" }] },
        { label: "Индекс", nodes: [{ name: "sentence-transformers" }, { name: "FAISS + keyword" }] },
        { label: "Запрос", nodes: [{ name: "FastAPI", note: "гибридный поиск" }, { name: "LLM", note: "ответ" }] }
      ]
    },
    ar: {
      title: "البحث الذكي في الوثائق (RAG)",
      company: "Elektroservis",
      rolePurpose: "عملي الحالي · بحث RAG في الوثائق",
      description:
        "بحث وRAG في وثائق القسم الفني (PTO) — ملفات PDF وWord وExcel والمستندات الممسوحة ضوئياً — ببحث هجين يجمع بين الكلمات المفتاحية والمعنى عبر خدمة FastAPI.",
      whatItDoes: [
        "فهرسة ملفات PDF وWord وExcel، بما فيها المستندات الممسوحة عبر OCR",
        "بحث هجين: مطابقة الكلمات المفتاحية مع البحث الدلالي بـ sentence-transformers وFAISS",
        "مسارات FastAPI لاستقبال المستندات والاستعلام",
        "إجابات بمساعدة LLM مبنية على المقاطع المسترجَعة"
      ],
      longDescription:
        "وثائق القسم الفني (PTO) خليط من ملفات PDF وWord وجداول Excel ومستندات ممسوحة ضوئياً. وعملي الحالي في Elektroservis بموسكو نظام بحث وRAG يجعل هذا كله قابلاً للبحث في مكان واحد.\n\nيحلّل مسار الاستقبال كل صيغة ويمرّر المستندات الممسوحة عبر OCR قبل الفهرسة. والبحث هجين: مطابقة الكلمات المفتاحية تلتقط المصطلحات الدقيقة، بينما يعثر البحث الدلالي — بتضمينات sentence-transformers وفهرس FAISS — على المقاطع التي تحمل المعنى نفسه بصياغة مختلفة. والغاية من الجمع بينهما إجابات أوثق صلة بالسؤال مما يقدّمه كلٌّ منهما منفرداً.\n\nتربط مسارات FastAPI بين التحليل والفهرسة والاسترجاع والإجابات المدعومة بنماذج LLM. النظام قيد التطوير النشط والكود خاص، لذا يعرض المخطط البنية.",
      problem:
        "الوثائق الهندسية موزّعة بين ملفات PDF وWord وExcel ومستندات ممسوحة، والبحث التقليدي بالكلمات المفتاحية لا يتعامل جيداً مع هذا المزيج.",
      solution:
        "OCR وتحليل لكل الصيغ، وبحث هجين (sentence-transformers + FAISS)، ومسارات FastAPI، وإجابات بمساعدة LLM.",
      result: "قيد التطوير النشط؛ واختير البحث الهجين لرفع صلة الإجابات بالسؤال.",
      flow: [
        { label: "الاستقبال", nodes: [{ name: "PDF · Word · Excel" }, { name: "OCR", note: "المستندات الممسوحة" }] },
        { label: "الفهرسة", nodes: [{ name: "sentence-transformers" }, { name: "FAISS + keyword" }] },
        { label: "الاستعلام", nodes: [{ name: "FastAPI", note: "بحث هجين" }, { name: "LLM", note: "الإجابة" }] }
      ]
    }
  },
  "ai-dashboard-suite": {
    ru: {
      title: "AI-дашборды для аналитики",
      company: "Фриланс",
      rolePurpose: "Фриланс, клиентский проект · KPI-дашборды",
      description:
        "Интерактивные дашборды для клиента, которые сводят данные из нескольких источников, и AI-панель, которая кратко объясняет, что изменилось.",
      whatItDoes: [
        "Фильтруемые KPI-модули вместо статичных выгрузок",
        "API на Node.js, который сводит несколько источников данных",
        "Графики трендов, на которых изменения видны сразу",
        "AI-панель с понятными сводками о том, что изменилось"
      ],
      longDescription:
        "Клиент на фрилансе работал со статичными выгрузками и разовыми таблицами, поэтому тренды оставались незаметными, пока кто-нибудь не обновит отчёт вручную. Нужны были интерактивные дашборды, в которых легко читать KPI.\n\nЯ сделал фронтенд на React с фильтруемыми KPI-модулями и API на Node.js, который сводит несколько источников данных в один REST-интерфейс.\n\nAI-панель простыми словами пересказывает, что изменилось. Она стоит рядом с цифрами, а не поверх них, поэтому дашборды остаются читаемыми, а AI — помощником. Код принадлежит клиенту, поэтому здесь показана схема архитектуры.",
      problem: "Решения принимались по статичным выгрузкам и таблицам, поэтому тренды замечали поздно.",
      solution: "Дашборды на React с фильтруемыми KPI, API на Node.js поверх нескольких источников и AI-панель со сводками.",
      result: "Фильтруемые KPI в одном месте вместо отчётов, которые обновляют вручную.",
      flow: [
        { label: "Данные", nodes: [{ name: "Несколько источников" }] },
        { label: "API", nodes: [{ name: "Node.js", note: "единый REST-интерфейс" }] },
        { label: "UI", nodes: [{ name: "React", note: "KPI-дашборды" }, { name: "LLM", note: "AI-сводки" }] }
      ]
    },
    ar: {
      title: "لوحات تحليلات مدعومة بالذكاء الاصطناعي",
      company: "عمل حر",
      rolePurpose: "عمل حر لعميل · لوحات مؤشرات",
      description:
        "لوحات تفاعلية لأحد العملاء تجمع بيانات من عدة مصادر، مع لوحة ذكاء اصطناعي تلخّص ما تغيّر.",
      whatItDoes: [
        "وحدات مؤشرات أداء قابلة للتصفية بدلاً من الملفات الثابتة",
        "واجهة API بـ Node.js تجمع بيانات عدة مصادر",
        "عروض للاتجاهات تُظهر التغيّرات بسرعة",
        "لوحة ذكاء اصطناعي تلخّص ما تغيّر بلغة بسيطة"
      ],
      longDescription:
        "كان أحد عملائي في العمل الحر يعتمد على ملفات مُصدَّرة ثابتة وجداول متفرقة، فتبقى الاتجاهات مخفية حتى يحدّث أحدهم التقرير يدوياً. وكان المطلوب لوحات تفاعلية تجعل قراءة المؤشرات أسهل.\n\nبنيت واجهة React بوحدات مؤشرات قابلة للتصفية، وواجهة API بـ Node.js تجمع بيانات عدة مصادر خلف واجهة REST واحدة.\n\nأما لوحة الذكاء الاصطناعي فتلخّص ما تغيّر بلغة بسيطة، وتقف إلى جانب الأرقام لا فوقها، فتبقى اللوحات مقروءة ويبقى الذكاء الاصطناعي مساعداً. الكود ملك للعميل، لذا يعرض المخطط البنية.",
      problem: "كانت القرارات تعتمد على ملفات مُصدَّرة وجداول ثابتة، فتُكتشف الاتجاهات متأخرة.",
      solution: "لوحات React بمؤشرات قابلة للتصفية، وواجهة API بـ Node.js فوق عدة مصادر، ولوحة ذكاء اصطناعي للملخصات.",
      result: "مؤشرات قابلة للتصفية في مكان واحد بدلاً من تقارير تُحدَّث يدوياً.",
      flow: [
        { label: "البيانات", nodes: [{ name: "مصادر متعددة" }] },
        { label: "API", nodes: [{ name: "Node.js", note: "واجهة REST واحدة" }] },
        { label: "الواجهة", nodes: [{ name: "React", note: "لوحات المؤشرات" }, { name: "LLM", note: "ملخصات ذكية" }] }
      ]
    }
  },
  pulseboard: {
    ru: {
      title: "Pulseboard",
      rolePurpose: "Open source · мониторинг доступности и SLO",
      description:
        "Мониторинг доступности HTTP-сервисов на собственном сервере: автоматические инциденты, бюджеты ошибок SLO, публичная страница статуса и метрики Prometheus — в одном контейнере.",
      whatItDoes: [
        "Проверяет HTTP-эндпоинты по расписанию и записывает задержку и доступность",
        "Сам открывает и закрывает инциденты",
        "Отчёты по бюджету ошибок SLO за 24 часа, 7 и 30 дней",
        "Публичная страница статуса, типизированный JSON API, health-пробы и /metrics"
      ],
      longDescription:
        "Pulseboard — компактный монитор доступности, который работает в одном контейнере: планировщику, API, дашборду и базе SQLite не нужны внешние сервисы. Он проверяет публичные HTTP-эндпоинты по расписанию, сохраняет задержку и доступность и сам открывает и закрывает инциденты.\n\nИз накопленных проверок строятся отчёты по бюджету ошибок SLO: целевой уровень, фактический аптайм, оценка простоя и исчерпание бюджета за 24 часа, 7 или 30 дней. То же состояние доступно через адаптивный дашборд, публичную страницу статуса только для чтения, которая не раскрывает отслеживаемые URL, типизированный JSON API, пробы liveness и readiness и метрики в формате Prometheus.\n\nНастройки по умолчанию намеренно безопасны: частные и зарезервированные сети заблокированы, URL с учётными данными отклоняются, редиректы не выполняются, а одна переменная окружения закрывает все операции записи API-ключом. Тесты работают на in-memory HTTP-транспорте и покрывают восстановление после инцидентов, расчёт SLO, контроль доступа и защиту исходящих запросов.",
      problem: "Проверки доступности, история инцидентов и отчёты по SLO обычно требуют нескольких отдельных сервисов.",
      solution:
        "Один сервис на FastAPI: асинхронный планировщик, хранилище SQLite, дашборд, публичная страница статуса и метрики Prometheus.",
      result: "Запускается одной командой docker compose; лицензия MIT, CI и живое демо."
    },
    ar: {
      title: "Pulseboard",
      rolePurpose: "مفتوح المصدر · مراقبة التوفّر وأهداف SLO",
      description:
        "مراقبة توفّر خدمات HTTP على خادمك الخاص، مع حوادث تُفتح تلقائياً وميزانيات أخطاء SLO وصفحة حالة عامة ومقاييس Prometheus — في حاوية واحدة.",
      whatItDoes: [
        "يفحص نقاط HTTP وفق جدول زمني ويسجّل زمن الاستجابة والتوفّر",
        "يفتح الحوادث ويغلقها تلقائياً",
        "تقارير ميزانية الأخطاء لأهداف SLO على مدى 24 ساعة و7 أيام و30 يوماً",
        "صفحة حالة عامة وواجهة JSON API مضبوطة الأنواع وفحوص للصحة ومسار ‎/metrics"
      ],
      longDescription:
        "Pulseboard أداة مدمجة لمراقبة التوفّر تعمل في حاوية واحدة: المجدوِل وواجهة API ولوحة التحكم وقاعدة SQLite لا تحتاج إلى أي خدمة خارجية. تفحص نقاط HTTP العامة وفق جدول زمني، وتحفظ زمن الاستجابة والتوفّر، وتفتح الحوادث وتغلقها من تلقاء نفسها.\n\nتتحوّل الفحوص المحفوظة إلى تقارير ميزانية أخطاء لأهداف SLO: الهدف، ونسبة التوفّر الفعلية، وتقدير زمن التوقف، ومدى استنفاد الميزانية على مدى 24 ساعة أو 7 أيام أو 30 يوماً. والحالة نفسها متاحة عبر لوحة تحكم متجاوبة، وصفحة حالة عامة للقراءة فقط لا تكشف الروابط المراقَبة، وواجهة JSON API مضبوطة الأنواع، وفحوص liveness وreadiness، ومقاييس متوافقة مع Prometheus.\n\nالإعدادات الافتراضية آمنة عن قصد: الشبكات الخاصة والمحجوزة محظورة، والروابط التي تتضمن بيانات اعتماد مرفوضة، ولا تُتبَع عمليات إعادة التوجيه، ويكفي متغيّر بيئة واحد لحماية كل عمليات الكتابة بمفتاح API. وتعمل الاختبارات على ناقل HTTP في الذاكرة، وتغطي التعافي من الحوادث وحسابات SLO والتحكم في الوصول وحماية الطلبات الصادرة.",
      problem: "مراقبة التوفّر وسجل الحوادث وتقارير SLO تتطلّب عادةً تشغيل عدة خدمات منفصلة.",
      solution:
        "خدمة FastAPI واحدة بمجدوِل غير متزامن وتخزين SQLite ولوحة تحكم وصفحة حالة عامة ومقاييس Prometheus.",
      result: "تعمل بأمر docker compose واحد؛ برخصة MIT، مع CI وعرض حي."
    }
  },
  deployledger: {
    ru: {
      title: "DeployLedger",
      rolePurpose: "Open source · релизы и метрики DORA",
      description:
        "Сервис управления релизами на собственной инфраструктуре: принимает события деплоя, считает метрики DORA и помогает решить, можно ли безопасно выкатывать следующий релиз.",
      whatItDoes: [
        "Принимает деплои через API или подписанные вебхуки GitHub, запись идемпотентна",
        "Считает пять метрик DORA с дневными трендами",
        "Ведёт журнал аудита на хеш-цепочке, в которой видна любая подмена",
        "Дашборд на React: фильтр по сервисам, матрица окружений и лента релизов"
      ],
      longDescription:
        "DeployLedger даёт команде понятную и проверяемую картину скорости поставки и стабильности изменений. События деплоя приходят через небольшой REST API или проверенные вебхуки GitHub; ключи идемпотентности делают повторные запросы безопасными, а каждая запись попадает в журнал аудита на хеш-цепочке, в который можно только добавлять.\n\nПо этим событиям сервис считает актуальную модель DORA из пяти метрик: время выполнения изменений (lead time), частоту развёртываний, время восстановления после неудачного развёртывания, долю неудачных изменений и долю вынужденных повторных развёртываний. Дашборд на React + Vite показывает, за какое окно посчитано каждое число, по сервисам и окружениям, а без подключённого API переключается на демо-данные с явной пометкой.\n\nПроект устроен как продакшен-сервис: асинхронный FastAPI с Pydantic v2, SQLite локально и PostgreSQL при развёртывании, метрики Prometheus и health-пробы, проверка вебхуков по HMAC, контейнеры без root с файловой системой только для чтения, оверлеи Kustomize, Terraform-шаблон для ECS/Fargate, ранбуки и CI, который тестирует код и сканирует образы.",
      problem: "Трудно оценить скорость поставки и стабильность изменений, когда данные о деплоях разрознены.",
      solution:
        "Сервис на FastAPI принимает события деплоя и считает метрики DORA; к нему — дашборд на React и журнал аудита на хеш-цепочке.",
      result: "Живой дашборд на Vercel; разворачивается через Docker Compose, Kustomize или Terraform."
    },
    ar: {
      title: "DeployLedger",
      rolePurpose: "مفتوح المصدر · عمليات الإصدار ومقاييس DORA",
      description:
        "خدمة لإدارة عمليات الإصدار تعمل على بنيتك الخاصة: تستقبل أحداث النشر، وتحسب مقاييس DORA، وتساعد على تقرير ما إذا كان الإصدار التالي آمناً.",
      whatItDoes: [
        "استقبال عمليات النشر عبر API أو webhooks موقّعة من GitHub، مع كتابة آمنة عند التكرار",
        "حساب مقاييس DORA الخمسة مع اتجاهات يومية",
        "سلسلة تدقيق لا تقبل إلا الإضافة وتكشف أي تلاعب",
        "لوحة React بتصفية حسب الخدمة ومصفوفة للبيئات وسجل للإصدارات"
      ],
      longDescription:
        "يمنح DeployLedger الفريق صورة واضحة وقابلة للتدقيق عن سرعة التسليم واستقرار التغييرات. تصل أحداث النشر عبر REST API صغيرة أو عبر webhooks من GitHub بعد التحقق منها، وتجعل مفاتيح idempotency الطلبات المكرّرة آمنة، وتُسجَّل كل عملية كتابة في سلسلة تدقيق مترابطة بالتجزئة (hash) لا تقبل إلا الإضافة.\n\nومن هذه الأحداث يحسب النموذج الحالي لمقاييس DORA الخمسة: زمن تنفيذ التغيير، وتكرار النشر، وزمن التعافي من النشر الفاشل، ونسبة فشل التغييرات، ونسبة إعادة النشر التصحيحي. وتعرض لوحة React + Vite النافذة الزمنية وراء كل رقم لكل خدمة وبيئة، وتنتقل إلى بيانات تجريبية موسومة بوضوح عند غياب الـ API.\n\nصُمّم المشروع كخدمة إنتاجية: FastAPI غير متزامن مع Pydantic v2، وSQLite محلياً وPostgreSQL عند النشر، ومقاييس Prometheus وفحوص للصحة، والتحقق من webhooks عبر HMAC، وحاويات تعمل دون صلاحيات root وبنظام ملفات للقراءة فقط، وطبقات Kustomize، وقالب Terraform لـ ECS/Fargate، وأدلة تشغيل، وCI يختبر الكود ويفحص الصور.",
      problem: "يصعب تقييم سرعة التسليم واستقرار التغييرات حين تكون بيانات النشر متفرقة.",
      solution:
        "خدمة FastAPI تستقبل أحداث النشر وتحسب مقاييس DORA، مع لوحة React وسلسلة تدقيق مترابطة بالتجزئة.",
      result: "لوحة حيّة على Vercel، وقابلة للاستضافة الذاتية عبر Docker Compose أو Kustomize أو Terraform."
    }
  },
  gatehouse: {
    ru: {
      title: "Gatehouse",
      rolePurpose: "Open source · доступ по принципу just-in-time",
      description:
        "Сервис запросов и согласования доступа на собственной инфраструктуре: узкий и временный доступ, а каждое решение записывается в проверяемый журнал аудита.",
      whatItDoes: [
        "Инженеры запрашивают узкий доступ на ограниченное время",
        "Согласующие видят риски и контекст политик до принятия решения",
        "Каждое решение попадает в журнал аудита на хеш-цепочке своего рабочего пространства",
        "Изоляция рабочих пространств и роли: заявитель, согласующий, администратор"
      ],
      longDescription:
        "Постоянный доступ к продакшену создаёт неясность во время инцидента: у кого был доступ, зачем он понадобился и соответствовало ли решение политике. Gatehouse отвечает на это небольшим и прозрачным процессом выдачи доступа just-in-time: инженер запрашивает узкий доступ на ограниченное время, а согласующий принимает решение, видя риски и контекст политик.\n\nБэкенд — асинхронный FastAPI с валидацией на Pydantic, SQLite локально и PostgreSQL в продакшене. Корректность обеспечена явно: ключи идемпотентности, оптимистичные блокировки, TTL в пределах политики и безопасная обработка конфликтующих решений. У каждого рабочего пространства свой журнал аудита на хеш-цепочке, в который можно только добавлять.\n\nИнтерфейс согласования на React + TypeScript работает в режимах live и demo, им удобно управлять с клавиатуры. Поставка на том же уровне: многоэтапные образы без root, пробы health и readiness, оверлеи Kustomize, Terraform и публикация образов в GHCR.",
      problem: "При постоянном доступе к продакшену трудно понять, у кого был доступ, зачем и по правилам ли он выдан.",
      solution:
        "Процесс запроса и согласования доступа just-in-time с контекстом политик, изоляцией пространств и журналом аудита на хеш-цепочке.",
      result: "Живой демо-дашборд и публичное демо API с OpenAPI; разворачивается через Docker Compose."
    },
    ar: {
      title: "Gatehouse",
      rolePurpose: "مفتوح المصدر · صلاحيات وصول عند الحاجة",
      description:
        "خدمة لطلب صلاحيات الوصول والموافقة عليها تعمل على بنيتك الخاصة: وصول محدود النطاق وقصير الأجل، وكل قرار موثّق في سلسلة تدقيق قابلة للتحقق.",
      whatItDoes: [
        "يطلب المهندسون وصولاً محدود النطاق وقصير الأجل",
        "يرى المعتمِدون المخاطر وسياق السياسات قبل اتخاذ القرار",
        "يُسجَّل كل قرار في سلسلة تدقيق مترابطة بالتجزئة خاصة بكل مساحة عمل",
        "عزل مساحات العمل وثلاثة أدوار: مقدّم الطلب والمعتمِد والمسؤول"
      ],
      longDescription:
        "الوصول الدائم إلى بيئة الإنتاج يخلق غموضاً وقت الحوادث: من كان يملك الوصول، ولماذا احتاجه، وهل اتُّخذ القرار وفق السياسة؟ يجيب Gatehouse عن ذلك بمسار صغير وشفاف لمنح الوصول عند الحاجة (just-in-time): يطلب المهندس وصولاً محدود النطاق لفترة محددة، ويراجع المعتمِد الطلب والمخاطر وسياق السياسة أمامه.\n\nالخلفية مبنية بـ FastAPI غير متزامن مع تحقق Pydantic، وSQLite محلياً وPostgreSQL في الإنتاج. وتُضمن سلامة العمليات بآليات صريحة: مفاتيح idempotency، والقفل المتفائل، ومدد صلاحية تحدّها السياسة، ومعالجة آمنة للقرارات المتعارضة. ولكل مساحة عمل سلسلة تدقيق خاصة بها مترابطة بالتجزئة ولا تقبل إلا الإضافة.\n\nتعمل واجهة المراجعة المبنية بـ React وTypeScript في وضعين حيّ وتجريبي، ويسهل التحكم فيها من لوحة المفاتيح. والتسليم بالعناية نفسها: صور متعددة المراحل تعمل دون root، وفحوص للصحة والجاهزية، وطبقات Kustomize، وTerraform، ونشر الصور على GHCR.",
      problem: "مع الوصول الدائم إلى الإنتاج يصعب معرفة من كان يملك الوصول، ولماذا، وهل مُنح وفق القواعد.",
      solution:
        "مسار لطلب الوصول والموافقة عليه عند الحاجة، مع سياق السياسات وعزل مساحات العمل وسجل تدقيق مترابط بالتجزئة.",
      result: "لوحة تجريبية حيّة وعرض عام لواجهة FastAPI / OpenAPI، وقابلة للاستضافة الذاتية عبر Docker Compose."
    }
  },
  "webhook-workbench": {
    ru: {
      title: "Webhook Workbench",
      rolePurpose: "Open source · отладка вебхуков на Go",
      description:
        "Приватный инструмент на собственном сервере: принимает, показывает, проверяет и безопасно переотправляет вебхуки. Один бинарник на Go без зависимостей со встроенным интерфейсом.",
      whatItDoes: [
        "Принимает запросы любым HTTP-методом на /inbox/{channel} и показывает трафик в реальном времени",
        "Проверяет подписи GitHub, Stripe и произвольные HMAC-SHA-256",
        "Безопасно переотправляет запросы с защитой от SSRF",
        "Скрывает секреты до сохранения; опциональная авторизация по bearer-токену"
      ],
      longDescription:
        "Webhook Workbench принимает входящие вебхуки на любом канале и показывает для каждого запроса декодированное тело, заголовки со скрытыми секретами и готовую команду cURL для воспроизведения. Это один бинарник на Go — только стандартная библиотека, интерфейс встроен внутрь, — и по умолчанию он слушает только localhost.\n\nПодписи проверяются по точному сохранённому телу запроса для профилей GitHub, Stripe (с пятиминутным окном приёма) и произвольного HMAC-SHA-256; секрет используется один раз и нигде не сохраняется. Сохранённые запросы можно переотправить на выбранный адрес, но осторожно: частные, loopback- и не-HTTP-адреса отклоняются, DNS перепроверяется при подключении, число редиректов ограничено, а заголовки авторизации, cookie и hop-by-hop удаляются.\n\nИстория событий ограничена по размеру и хранится в локальном JSON-снимке, бинарные тела сохраняются в base64, есть health-проба. Docker-конфигурация работает без root, со сброшенными capabilities и корневой файловой системой только для чтения; тесты покрывают скрытие секретов, проверку подписей, переотправку и защиту от SSRF.",
      problem: "Для отладки вебхуков часто приходится отправлять реальные данные в сторонний сервис.",
      solution:
        "Бинарник на Go на вашем сервере: принимает, проверяет и безопасно переотправляет вебхуки, скрывая секреты до сохранения.",
      result: "Релизные бинарники с контрольными суммами, защищённая Docker-конфигурация и публичная песочница."
    },
    ar: {
      title: "Webhook Workbench",
      rolePurpose: "مفتوح المصدر · تصحيح webhooks بلغة Go",
      description:
        "أداة خاصة تعمل على خادمك لالتقاط webhooks وفحصها والتحقق منها وإعادة إرسالها بأمان — ملف تنفيذي واحد بلغة Go بلا اعتماديات، والواجهة مدمجة فيه.",
      whatItDoes: [
        "يلتقط طلبات HTTP بأي طريقة على المسار ‎/inbox/{channel}‎ ويعرض الحركة مباشرة",
        "يتحقق من تواقيع GitHub وStripe وتواقيع HMAC-SHA-256 العامة",
        "يعيد إرسال الطلبات بأمان مع حماية من هجمات SSRF",
        "يحجب الأسرار قبل التخزين، مع مصادقة اختيارية برمز Bearer"
      ],
      longDescription:
        "يلتقط Webhook Workbench طلبات webhooks الواردة على أي قناة، ويعرض لكل طلب محتواه بعد فك ترميزه، والترويسات بعد حجب الأسرار، وأمر cURL جاهزاً لإعادة إنتاجه. وهو ملف تنفيذي واحد بلغة Go يعتمد على المكتبة القياسية وحدها، والواجهة مدمجة داخله، ولا يستمع افتراضياً إلا على localhost.\n\nيمكن التحقق من التواقيع مقابل المحتوى الملتقَط نفسه لملفات تعريف GitHub وStripe (مع نافذة استلام مدتها خمس دقائق) وHMAC-SHA-256 العام، ويُستخدم السر مرة واحدة ولا يُخزَّن أبداً. ويمكن إعادة إرسال الطلبات الملتقَطة إلى عنوان تختاره، لكن بحذر: تُرفض العناوين الخاصة وعناوين loopback والعناوين غير HTTP، ويُعاد فحص DNS عند الاتصال، وتُقيَّد عمليات إعادة التوجيه، وتُحذف ترويسات التفويض والكوكيز وhop-by-hop.\n\nيحتفظ بسجل أحداث محدود الحجم في لقطة JSON محلية، ويحفظ المحتوى الثنائي بترميز base64، ويوفّر نقطة لفحص الصحة. ويعمل إعداد Docker دون root، مع إسقاط صلاحيات Linux ونظام ملفات جذري للقراءة فقط، وتغطي الاختبارات حجب الأسرار والتحقق من التواقيع وإعادة الإرسال والحماية من SSRF.",
      problem: "تصحيح webhooks يعني غالباً إرسال بيانات حقيقية إلى خدمة فحص خارجية.",
      solution:
        "ملف تنفيذي بلغة Go على خادمك يلتقط webhooks ويتحقق منها ويعيد إرسالها بأمان، مع حجب الأسرار قبل التخزين.",
      result: "ملفات تنفيذية للإصدارات مع مجاميع تحقق (checksums)، وإعداد Docker محصّن، وبيئة تجريبية عامة."
    }
  }
};

const localizedCache = new Map<string, Project>();

/**
 * Returns the project with its text fields in the requested locale (EN returns `p` unchanged).
 * Results are cached, so the same project and locale always give the same object.
 */
export function localizeProject(p: Project, locale: Locale): Project {
  if (locale === "en") return p;
  const key = `${locale}:${p.slug}`;
  const cached = localizedCache.get(key);
  if (cached) return cached;
  const t = translations[p.slug]?.[locale];
  const merged = t ? { ...p, ...(locale === "ru" ? typographRuDeep(t) : t) } : p;
  localizedCache.set(key, merged);
  return merged;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
