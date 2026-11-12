import type { Locale } from "@/lib/types";
import { typographArDeep, typographRuDeep } from "@/lib/typograph";

/**
 * Project catalog. English is the source of truth; `localizeProject` overlays the
 * Russian and Arabic text. Work projects are private (employer NDA, or client-owned code
 * for freelance work, see `codeNote`), so they carry an architecture diagram and no
 * `github`; open-source projects link to the real repo.
 * Every claim here must match the CV or the repo README — no invented metrics.
 */
export type Project = {
  slug: string;
  title: string;
  kind: "work" | "open-source";
  /** Work projects only, e.g. "Avenue Group". Omit when unknown. */
  company?: string;
  /**
   * Year the work started, for the project archive: the role's dates for work projects, the repo's
   * GitHub creation year for open source. Omit when it is not known (the archive then shows "—").
   */
  year?: number;
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
   * Which label goes in front of `result`: "result" for shipped work, "status" for work in
   * progress, "builtIn" for open source. Localized in `copy.projectResultLabels`.
   */
  resultLabel?: ProjectResultLabel;
  /**
   * Work projects only: why the code is private. "nda" = employer NDA (`ui.privateCode`,
   * `ui.diagramNote`); "client" = the code belongs to a freelance client
   * (`ui.privateCodeClient`, `ui.diagramNoteClient`).
   */
  codeNote?: "nda" | "client";
  /**
   * Work (diagram) projects: a simplified architecture, left to right, drawn as HTML on the cards so the
   * labels stay readable at any width (the full SVG diagram is on the case-study page). Stage labels and
   * notes are translated; node names are tech names and stay in Latin script.
   */
  flow?: FlowStage[];
};

/**
 * One stage of a card's architecture flow. `module` nodes are the smaller sub-parts of the stage
 * (e.g. the API's domain modules), drawn as compact chips. `edge` labels the connector to the next stage.
 */
export type FlowStage = { label: string; nodes: { name: string; note?: string; module?: boolean }[]; edge?: string };

export type ProjectResultLabel = "result" | "status" | "builtIn";

type ProjectText = Pick<Project, "title" | "rolePurpose" | "description" | "longDescription" | "whatItDoes"> &
  Partial<Pick<Project, "company" | "problem" | "solution" | "result" | "flow">>;

export const projects: Project[] = [
  {
    slug: "okkp-platform",
    year: 2025,
    title: "OKKP Operations Platform",
    kind: "work",
    company: "Avenue Group",
    rolePurpose: "Lead developer on the project · 2025",
    description:
      "An internal quality-control web system for a network of 9 vehicle depots. I designed the architecture and API and wrote most of the code: violations and fines, employees, a document archive and Excel export.",
    whatItDoes: [
      "Violations and fines module with server-side filtering (name, department, type, status, depot, period) and pagination",
      "Employee profiles with photo, contract and questionnaire uploads; driver call-backs; in-app notifications",
      "Document archive on Cloudinary with a local-disk fallback",
      "Per-depot KPI tiles and in-browser Excel export (SheetJS)"
    ],
    longDescription:
      "At Avenue Group I was the lead developer on OKKP, an internal quality-control web system for a network of 9 vehicle depots, in a team of three. I designed the architecture and the API and wrote most of the code (~177 of 183 commits in 2025 across the project's three repositories).\n\nThe stack is a React 18 + TypeScript single-page app (Vite, Tailwind CSS), a Node.js / Express 5 REST API and MongoDB (Mongoose). The core is the violations and fines module: server-side filtering by name, department, type, status, depot and period, pagination, photo and video attachments, and deletion confirmed by password. Around it sit modules for employees, driver call-backs, a document archive on Cloudinary with a local-disk fallback, and in-app notifications. Sign-in uses JWT (bcrypt), by email or phone.\n\nThe home page shows KPI tiles per depot, and violations, employees, driver calls and the depot summary export to Excel right in the browser. Deployment is Docker Compose (MongoDB + API) on a Linux server behind a reverse proxy, with CI on GitHub Actions.",
    tech: ["React", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Cloudinary", "SheetJS", "Docker Compose", "Tailwind CSS"],
    image: "/images/projects/okkp-platform.svg",
    imageKind: "diagram",
    problem:
      "Avenue Group's 9 vehicle depots needed one internal system to record violations and fines, keep employee records and produce reports without a developer.",
    solution:
      "A React + TypeScript SPA on a Node.js / Express API and MongoDB, with server-side filtering, a Cloudinary document archive, JWT sign-in and in-browser Excel export, deployed with Docker Compose and CI on GitHub Actions.",
    result: "Deployed on the company's Linux server; staff filter violations and export reports to Excel on their own.",
    resultLabel: "result",
    codeNote: "nda",
    flow: [
      { label: "Frontend", nodes: [{ name: "React + TypeScript", note: "SPA · Vite · Tailwind" }], edge: "REST · JWT" },
      {
        label: "API",
        nodes: [
          { name: "Node.js / Express 5", note: "REST API" },
          { name: "Auth · JWT", module: true },
          { name: "Employees", module: true },
          { name: "Violations", module: true },
          { name: "Call-backs", module: true },
          { name: "Archive", module: true }
        ],
        edge: "documents · media"
      },
      {
        label: "Data",
        nodes: [
          { name: "MongoDB", note: "Mongoose" },
          { name: "Cloudinary", note: "media · local fallback" }
        ]
      }
    ]
  },
  {
    slug: "document-intelligence-rag",
    year: 2026,
    title: "Engineering Document Search",
    kind: "work",
    company: "Elektroservis",
    rolePurpose: "Python developer · Apr–Oct 2026 · semantic + full-text search",
    description:
      "Semantic and full-text search over an engineering-documentation archive of ~4.1k PDF, DOCX, XLSX and RTF files: a custom inverted index plus FAISS on sentence-transformers, behind a FastAPI service. No LLM generation.",
    whatItDoes: [
      "Finds a cable mark, document code, equipment designation or phrase and returns the document, page (or sheet and rows), fragment and network path",
      "Hybrid search: a custom inverted index plus FAISS semantic search on sentence-transformers (all-MiniLM-L6-v2)",
      "Detects scans automatically and OCRs selected pages with Tesseract + Poppler",
      "Reliability labels — exact match, needs review, partial match — and one result per document"
    ],
    longDescription:
      "Elektroservis keeps its engineering (PTO) documentation in a network archive of about 4.1k PDF, DOCX, XLSX and RTF files, about 1.5k of them with text. From April to October 2026, under civil-law contracts, I built a search service over it: an engineer types a cable mark, a document code, an equipment designation or a phrase and gets the document, the PDF page (or Excel sheet and rows, Word section), a text fragment and the network path. Documents never leave the company network.\n\nSearch is hybrid, with no LLM generation: a custom inverted index over words and designations, plus FAISS semantic search on sentence-transformers embeddings (all-MiniLM-L6-v2). Designations are matched by general rules: look-alike Latin and Cyrillic letters, spaces and hyphens do not break a match, while numbers and marks are never substituted. Scans are detected automatically and selected pages go through Tesseract + Poppler OCR. The backend is FastAPI, the interface is plain HTML/JS, and it runs as a systemd service on Ubuntu Server with an atomic index swap and rollback.\n\nCode and mark queries went from 9–10 s to 1.2–1.7 s and phrase queries from 55–70 s to 2–4 s; after the move to the inverted index, p95 is 0.18 s on 55 control queries. Quality is held by 739 pytest tests and a 104-query control set with top-1/top-5 metrics. I built it with AI agents (Codex, Cursor, Claude Code): I gathered the requirements, wrote the agent briefs, reviewed the changes and checked them on the production index. The client accepted the work in September 2026. The code is private, so the diagram shows the architecture.",
    tech: ["Python", "FastAPI", "FAISS", "sentence-transformers", "Tesseract OCR", "pytest", "systemd"],
    image: "/images/projects/document-rag.svg",
    imageKind: "diagram",
    problem:
      "Engineers searched a network archive of PDF, Word, Excel and RTF files and scans by hand. Designations such as cable marks and document codes must match exactly, while phrases need meaning-based search.",
    solution:
      "A custom inverted index for exact designations plus FAISS semantic search, OCR for scans and reliability labels on every result; FastAPI backend, plain HTML/JS interface, deployed as a systemd service.",
    result: "Accepted by the client in September 2026: 0.18 s p95, 739 tests and a 104-query control set.",
    resultLabel: "result",
    codeNote: "nda",
    flow: [
      { label: "Ingest", nodes: [{ name: "PDF · DOCX · XLSX · RTF" }, { name: "OCR", note: "Tesseract · scans" }] },
      { label: "Index", nodes: [{ name: "Inverted index", note: "words · designations" }, { name: "sentence-transformers" }, { name: "FAISS" }] },
      { label: "Query", nodes: [{ name: "FastAPI", note: "hybrid ranking" }, { name: "HTML / JS", note: "search UI" }] }
    ]
  },
  {
    slug: "ledgerline",
    year: 2026,
    title: "Ledgerline",
    kind: "open-source",
    rolePurpose: "Open-source platform, built with Claude Code · Payments platform built like a bank's",
    description:
      "A payments platform where money is never created, lost or moved twice — a double-entry ledger on an event log, card payments and payouts as sagas, an outbox into Kafka, in-line fraud scoring, ClickHouse analytics, a gRPC merchants' API, and OpenTelemetry tracing, all proven by breaking it on purpose.",
    whatItDoes: [
      "A double-entry ledger in Kotlin and Spring Boot on an append-only event log in PostgreSQL, with idempotent writes, no overdraft under any concurrency, and an audit that recomputes the books",
      "Card payments, refunds and payouts to a misbehaving simulated bank as state machines and sagas; every change reaches Kafka through a transactional outbox",
      "Fraud scored in line by a LightGBM model on features kept from Kafka, measured against a simulator's hidden truth; analytics in ClickHouse that agree with the ledger to the kopeck",
      "A gRPC API, signed webhooks and a TypeScript SDK for merchants; traces that follow a payment through the outbox, the worker and webhooks; SLO alerts proven to fire by injecting each fault"
    ],
    longDescription:
      "Ledgerline is an open-source payments platform I built with Claude Code to show what a bank's core needs: money that is never created, lost or moved twice, even when everything around it fails. A double-entry ledger in Kotlin and Spring Boot keeps an append-only event log in PostgreSQL; balances are projections rebuilt from it, every write is idempotent, and an audit recomputes the books. Card payments, refunds and payouts run as state machines and sagas on top of it, and every change reaches Kafka through a transactional outbox.\n\nIt is proven by breaking it while a client keeps paying: services, PostgreSQL and Kafka killed, networks cut, answers cut off mid-way. Over 11 chaos scenarios and 40,461 requests (4,188 of them sent twice at once), a checker found nothing lost and nothing done twice. Load tests found the hot spots: the ledger does about 430 transfers a second on one CPU, shedding the excess instead of falling over.\n\nA LightGBM model on real-time features from Kafka caught 88% of fraud at 0.7% false declines against 37% for tuned rules, measured against a simulator's hidden truth; ClickHouse analytics agree with the ledger to the kopeck. Merchants get a gRPC API, signed webhooks and a TypeScript SDK: with the service killed mid-payment, all 1,085 changes still reached the example shop. Traces follow a payment through the outbox, the worker and webhooks, and every alert was proven to fire by injecting the fault it watches.",
    tech: ["Kotlin", "Spring Boot", "PostgreSQL", "Kafka", "ClickHouse", "gRPC", "Python", "LightGBM", "Vue", "OpenTelemetry", "Grafana"],
    github: "https://github.com/kyan9400/ledgerline",
    live: "https://ledgerline.149-36-1-90.sslip.io",
    image: "/images/projects/ledgerline.webp",
    imageKind: "screenshot",
    problem:
      "Payment systems are judged by the day things fail: a lost answer, a dead database or a duplicate request must never create money, lose it or move it twice, and demos rarely show that.",
    solution:
      "A double-entry ledger on an event log, sagas that never guess, idempotency everywhere and an outbox into Kafka, then chaos runs, load tests, a fraud model and alerts, each measured instead of assumed.",
    result:
      "Nothing lost or done twice over 11 chaos scenarios and 40,461 requests; fraud caught 88% vs 37% for rules; ~430 ledger transfers/s on one CPU; every alert proven to fire; a live demo and CI.",
    resultLabel: "builtIn"
  },
  {
    slug: "depotwin",
    year: 2026,
    title: "Depotwin",
    kind: "open-source",
    rolePurpose: "Open-source platform, built with Claude Code · Live digital twin of a vehicle fleet",
    description:
      "A live 3D digital twin of 240 simulated vehicles in Moscow — a Go and NATS JetStream pipeline into TimescaleDB, failure models that warn of breakdowns days ahead, a local-LLM copilot over read-only queries, and an offline-first driver app.",
    whatItDoes: [
      "Simulates 240 vans, trucks and minibuses on the real Moscow road network (OpenStreetMap) in Go, with faults injected and a ground truth the running system never sees",
      "Streams the readings through NATS JetStream into TimescaleDB, to a 3D twin (React, MapLibre, three.js) over WebSockets, live or replayed",
      "Predicts overheating and dead batteries days ahead with LightGBM; a local LLM (Qwen 3.5 9B) answers questions in English, Russian or Arabic through fixed read-only queries",
      "An Expo (React Native) driver app that works offline; Prometheus and Grafana, unit-tested alert rules and a k6 load test in production"
    ],
    longDescription:
      "Depotwin is an open-source platform I built with Claude Code to show a real-time system end to end, measured against a ground truth. A Go simulator drives 240 vans, trucks and minibuses on the Moscow road network from OpenStreetMap, reports like GPS trackers do, and injects faults: fuel theft, failing thermostats and batteries, GPS spoofing, night use. What really happened is published apart, so detectors can be scored without seeing it.\n\nReadings flow through NATS JetStream into TimescaleDB (13.4 million replayed with no gaps or repeats across restarts) and out to a 3D twin built with React, MapLibre and three.js. A FastAPI alerter finds faults as they happen, and LightGBM models on daily features warn of breakdowns: on unseen fleets they caught 156 of 157 overheating failures 4.5 days ahead, against 3.0 days for threshold rules, with fewer false alarms. A copilot on a local Qwen 3.5 9B can only call seven validated, read-only queries and shows the data behind each answer; it answered 17 of 18 held-out questions correctly.\n\nDrivers use an Expo app that queues shifts, inspections and defect reports with photos offline and syncs them in order without duplicates; defects reach the twin at once. Prometheus and Grafana watch every stage, alert rules are unit-tested, and a k6 load test found where the API broke; after the fixes it serves 200 requests a second with no errors while 200 live viewers stay connected.",
    tech: ["Go", "Python", "TypeScript", "NATS JetStream", "TimescaleDB", "FastAPI", "React", "three.js", "Expo", "LightGBM", "Prometheus"],
    github: "https://github.com/kyan9400/depotwin",
    live: "https://depotwin.149-36-1-90.sslip.io",
    image: "/images/projects/depotwin.webp",
    imageKind: "screenshot",
    problem:
      "Fleet dashboards show where vehicles are, but not what is about to break, and their alerts and predictions are rarely checked against what actually happened.",
    solution:
      "A streaming pipeline to a live 3D twin, failure models scored against the threshold rules on unseen fleets, an LLM copilot limited to read-only queries, and an offline-first driver app, all measured against a hidden ground truth.",
    result:
      "Overheating caught 4.5 days ahead (rules: 3.0) with fewer false alarms; 17 of 18 held-out copilot questions right; 200 requests/s with no errors under load; a live demo and CI for every part.",
    resultLabel: "builtIn"
  },
  {
    slug: "clearhire",
    year: 2026,
    title: "Clearhire",
    kind: "open-source",
    rolePurpose: "Open-source platform, built with Claude Code · AI recruiting with evidence",
    description:
      "An AI recruiting platform that checks CVs against each requirement of a vacancy and shows the CV line behind every verdict — blind screening, a local LLM that must cite its sources, and an audit log anchored on a blockchain.",
    whatItDoes: [
      "Reads CVs in PDF, Word, scans and photos (Tesseract OCR), in English and Russian, into skills, dated roles, languages and degrees",
      "Ranks candidates by unmet must-haves first, then requirement score, then similarity, with the quote behind every verdict",
      "Blind screening before the model sees the text; a local LLM (Qwen 3.5 9B) writes summaries and answers that must cite the CV",
      "Angular console, Next.js careers site and NestJS Telegram bot over one FastAPI API; audit log anchored in a Solidity contract; Helm chart tested on kind in CI"
    ],
    longDescription:
      "Clearhire is an open-source recruiting platform I built with Claude Code to show a whole AI product, from reading a CV to deployment. A candidate can check a CV against a role before applying and see each requirement found or not, with the line of the CV that shows it; recruiters get the same reading, ranked.\n\nThe backend is Python: CVs in PDF, Word or scans go through Tesseract OCR into a profile with dated roles and evidence for each skill, pgvector embeddings power hybrid search, and a C++ skill matcher has a pure-Python fallback. Ranking uses the requirements, not one similarity number. Personal details are replaced before the embedding model reads the text, a local Qwen 3.5 9B writes summaries where uncited sentences are dropped, and every decision goes into a SHA-256 chained audit log whose Merkle roots are anchored hourly in a Solidity contract.\n\nIt is measured on a generated set of 312 CVs and 39 vacancies with known answers: nDCG@10 0.972 against 0.603 for embeddings alone, skills read with F1 0.997, and identical scores in all 486 blind-mode swaps of gender, origin and age. The demo runs live with Docker Compose on a GPU server, and a Helm chart is tested end to end on kind in GitHub Actions.",
    tech: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Angular", "Next.js", "NestJS", "Solidity", "Kubernetes"],
    github: "https://github.com/kyan9400/clearhire",
    live: "https://149-36-1-90.sslip.io",
    image: "/images/projects/clearhire.webp",
    imageKind: "screenshot",
    problem:
      "Screening tools rank CVs by one similarity score that nobody can explain, can be swayed by names and age, and leave no record a candidate or an auditor could check.",
    solution:
      "Requirement-level checks with the CV quote behind each verdict, blind screening before any model, an LLM that may only explain with citations, and a tamper-evident audit log anchored on a chain.",
    result:
      "nDCG@10 0.972 on 312 synthetic CVs (embeddings alone: 0.603); identical scores in all 486 blind-mode swaps; a live demo, and CI covering Python, three front ends, the contract and a Kubernetes end-to-end run.",
    resultLabel: "builtIn"
  },
  {
    slug: "lumen-search",
    year: 2026,
    title: "Lumen Search",
    kind: "open-source",
    rolePurpose: "Open-source prototype, built with AI agents · Hybrid document search (RAG)",
    description:
      "Hybrid document search with citations over PDF, Word, Excel and scanned pages, in English and Russian — BM25 plus multilingual embeddings in FAISS, OCR and a FastAPI service.",
    whatItDoes: [
      "Parses PDF, Word, Excel, Markdown and HTML; scanned pages go through Tesseract OCR in English and Russian",
      "Chunks by section and spreadsheet row, so every result cites a page, a law article or a row",
      "Hybrid retrieval: BM25 and multilingual-e5 embeddings in FAISS, fused by rank, with optional cross-encoder reranking",
      "FastAPI service with a Redis cache, answers with numbered sources, and a demo that runs in the browser"
    ],
    longDescription:
      "Lumen Search is an open-source prototype I built with AI agents, on the same theme as my document-search work: one search over PDFs, Word files, Excel sheets and scans, where every answer shows exactly where it came from. It indexes eight public documents — NIST and OWASP security guidance in English, the Russian personal data law in Russian, and two scans that only OCR can read.\n\nParsing follows each document's structure — PDF bookmarks and numbered headings, Word heading styles, one spreadsheet row per record — so results cite a page and section, an article of a law, or a sheet and row. Retrieval runs BM25 over Snowball-stemmed English and Russian words next to multilingual-e5 embeddings in FAISS, fuses the two rankings, and can rerank the top results with a multilingual cross-encoder.\n\nQuality is measured on 62 hand-labelled questions: hybrid search puts a correct passage in the top five for 75.8% of them, and reranking raises that to 83.9%; the README also says where it is weak. The service starts with one docker compose command, and the live demo runs the same search in the browser with a 66 MB int8 model, while CI checks the JavaScript port against the Python code.",
    tech: ["Python", "FastAPI", "FAISS", "sentence-transformers", "Tesseract OCR", "Redis", "Docker"],
    github: "https://github.com/kyan9400/lumen-search",
    live: "https://kyan9400.github.io/lumen-search/",
    image: "/images/projects/lumen-search.webp",
    imageKind: "screenshot",
    problem:
      "Documents arrive as a mix of PDFs, Word files, spreadsheets and scans; plain keyword search misses paraphrases and can't say where an answer came from.",
    solution:
      "Structure-aware parsing with OCR, BM25 and embedding retrieval fused by rank, optional reranking, and citations down to the page, article or spreadsheet row.",
    result:
      "83.9% of 62 labelled questions get a correct passage in the top five after reranking. Live demo in the browser; tests on three Python versions and a Docker smoke test in CI.",
    resultLabel: "builtIn"
  },
  {
    slug: "pulseboard",
    year: 2026,
    title: "Pulseboard",
    kind: "open-source",
    rolePurpose: "Open-source prototype, built with AI agents · Uptime & SLO monitoring",
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
    result:
      "Tests cover incident recovery, SLO math, access control and SSRF protection. Live demo; one docker compose command.",
    resultLabel: "builtIn"
  },
  {
    slug: "deployledger",
    year: 2026,
    title: "DeployLedger",
    kind: "open-source",
    rolePurpose: "Open-source prototype, built with AI agents · Release operations & DORA metrics",
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
    result:
      "Computes all five DORA metrics from deployment events, with a tamper-evident audit chain. Live demo; CI tests the code and scans the images.",
    resultLabel: "builtIn"
  },
  {
    slug: "gatehouse",
    year: 2026,
    title: "Gatehouse",
    kind: "open-source",
    rolePurpose: "Open-source prototype, built with AI agents · Just-in-time access control",
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
    result: "Idempotency keys, optimistic locking and a hash-linked audit chain per workspace. Live demo and public OpenAPI.",
    resultLabel: "builtIn"
  },
  {
    slug: "webhook-workbench",
    year: 2026,
    title: "Webhook Workbench",
    kind: "open-source",
    rolePurpose: "Open-source prototype, built with AI agents · Webhook debugging in Go",
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
    result:
      "Tests cover redaction, signature checks, replay and SSRF defences. Checksummed release binaries; live sandbox.",
    resultLabel: "builtIn"
  }
];

/** Russian and Arabic text for every project. Tech names stay in Latin script. */
const translations: Record<string, Record<Exclude<Locale, "en">, ProjectText>> = {
  "okkp-platform": {
    ru: {
      title: "OKKP — внутренняя система контроля качества",
      company: "Avenue Group",
      rolePurpose: "Ведущий разработчик проекта · 2025",
      description:
        "Внутренняя веб-система контроля качества для сети из 9 автопарков. Я спроектировал архитектуру и API и написал большую часть кода: нарушения и штрафы, сотрудники, электронный архив и выгрузка в Excel.",
      whatItDoes: [
        "Модуль нарушений и штрафов: серверная фильтрация (ФИО, отдел, тип, статус, парк, период) и пагинация",
        "Карточки сотрудников с загрузкой фото, договоров и анкет; обзвон водителей; внутренние уведомления",
        "Электронный архив документов в Cloudinary с откатом на локальный диск",
        "KPI-карточки по паркам и экспорт в Excel прямо в браузере (SheetJS)"
      ],
      longDescription:
        "В Avenue Group я был ведущим разработчиком OKKP — внутренней веб-системы контроля качества для сети из 9 автопарков; в команде было три человека. Я спроектировал архитектуру и API и написал большую часть кода (≈177 из 183 коммитов 2025 года в трёх репозиториях проекта).\n\nСтек: SPA на React 18 + TypeScript (Vite, Tailwind CSS), REST API на Node.js / Express 5 и MongoDB (Mongoose). Основа — модуль нарушений и штрафов: серверная фильтрация по ФИО, отделу, типу, статусу, парку и периоду, пагинация, вложения фото и видео, удаление с подтверждением паролем. Вокруг него — модули сотрудников, обзвона водителей, электронного архива документов (Cloudinary с откатом на локальный диск) и внутренних уведомлений. Вход — JWT (bcrypt), по email или телефону.\n\nНа главной странице — KPI-карточки по паркам, а нарушения, сотрудники, обзвон водителей и сводка по паркам выгружаются в Excel прямо в браузере. Деплой — Docker Compose (MongoDB + API) на Linux-сервере за reverse proxy, CI — на GitHub Actions.",
      problem:
        "Сети из 9 автопарков Avenue Group нужна была единая внутренняя система: учёт нарушений и штрафов, данные сотрудников и отчёты без участия разработчика.",
      solution:
        "SPA на React + TypeScript поверх API на Node.js / Express и MongoDB: серверная фильтрация, архив документов в Cloudinary, JWT-аутентификация и выгрузка в Excel в браузере; деплой через Docker Compose, CI на GitHub Actions.",
      result: "Развёрнута на Linux-сервере компании; сотрудники сами фильтруют нарушения и выгружают отчёты в Excel.",
      flow: [
        { label: "Фронтенд", nodes: [{ name: "React + TypeScript", note: "SPA · Vite · Tailwind" }], edge: "REST · JWT" },
        {
          label: "API",
          nodes: [
            { name: "Node.js / Express 5", note: "REST API" },
            { name: "Авторизация · JWT", module: true },
            { name: "Сотрудники", module: true },
            { name: "Нарушения", module: true },
            { name: "Обзвон", module: true },
            { name: "Архив", module: true }
          ],
          edge: "документы · медиа"
        },
        {
          label: "Данные",
          nodes: [
            { name: "MongoDB", note: "Mongoose" },
            { name: "Cloudinary", note: "медиа · локальный откат" }
          ]
        }
      ]
    },
    ar: {
      title: "OKKP — نظام داخلي لمراقبة الجودة",
      company: "Avenue Group",
      rolePurpose: "المطوّر الرئيسي للمشروع · 2025",
      description:
        "نظام ويب داخلي لمراقبة الجودة في شبكة من 9 مرائب مركبات. صمّمتُ البنية والواجهة البرمجية وكتبتُ معظم الكود: المخالفات والغرامات، والموظفون، وأرشيف الوثائق، والتصدير إلى Excel.",
      whatItDoes: [
        "وحدة المخالفات والغرامات: تصفية من جهة الخادم (الاسم، القسم، النوع، الحالة، المرأب، الفترة) وترقيم الصفحات",
        "ملفات الموظفين مع رفع الصور والعقود والاستبيانات، ومتابعة اتصالات السائقين، وإشعارات داخلية",
        "أرشيف وثائق على Cloudinary مع بديل على القرص المحلي",
        "بطاقات مؤشرات KPI لكل مرأب وتصدير إلى Excel داخل المتصفح (SheetJS)"
      ],
      longDescription:
        "في Avenue Group كنتُ المطوّر الرئيسي لنظام OKKP، وهو نظام ويب داخلي لمراقبة الجودة في شبكة من 9 مرائب مركبات، ضمن فريق من ثلاثة أشخاص. صمّمتُ البنية والواجهة البرمجية وكتبتُ معظم الكود (نحو 177 من 183 إيداعاً في 2025 عبر مستودعات المشروع الثلاثة).\n\nالتقنيات: تطبيق صفحة واحدة على React 18 + TypeScript ‏(Vite وTailwind CSS)، وREST API على Node.js / Express 5، وقاعدة MongoDB ‏(Mongoose). وجوهر النظام وحدة المخالفات والغرامات: تصفية من جهة الخادم حسب الاسم والقسم والنوع والحالة والمرأب والفترة، وترقيم الصفحات، ومرفقات الصور والفيديو، وحذف يتطلّب تأكيداً بكلمة المرور. وحولها وحدات للموظفين ومتابعة اتصالات السائقين وأرشيف الوثائق (Cloudinary مع بديل على القرص المحلي) والإشعارات الداخلية. والدخول عبر JWT ‏(bcrypt) بالبريد الإلكتروني أو الهاتف.\n\nتعرض الصفحة الرئيسية بطاقات KPI لكل مرأب، وتُصدَّر المخالفات والموظفون واتصالات السائقين وملخّص المرائب إلى Excel داخل المتصفح مباشرة. والنشر عبر Docker Compose ‏(MongoDB + API) على خادم Linux خلف reverse proxy، وCI على GitHub Actions.",
      problem:
        "احتاجت شبكة مرائب Avenue Group التسعة إلى نظام داخلي واحد لتسجيل المخالفات والغرامات وحفظ بيانات الموظفين وإعداد التقارير دون تدخّل مطوّر.",
      solution:
        "تطبيق SPA على React + TypeScript فوق API على Node.js / Express وMongoDB، مع تصفية من جهة الخادم وأرشيف وثائق على Cloudinary ومصادقة JWT وتصدير إلى Excel داخل المتصفح؛ والنشر عبر Docker Compose وCI على GitHub Actions.",
      result: "يعمل على خادم Linux الخاص بالشركة، ويصفّي الموظفون المخالفات ويصدّرون التقارير إلى Excel بأنفسهم.",
      flow: [
        { label: "الواجهة", nodes: [{ name: "React + TypeScript", note: "SPA · Vite · Tailwind" }], edge: "REST · JWT" },
        {
          label: "API",
          nodes: [
            { name: "Node.js / Express 5", note: "REST API" },
            { name: "المصادقة · JWT", module: true },
            { name: "الموظفون", module: true },
            { name: "المخالفات", module: true },
            { name: "الاتصالات", module: true },
            { name: "الأرشيف", module: true }
          ],
          edge: "مستندات · وسائط"
        },
        {
          label: "البيانات",
          nodes: [
            { name: "MongoDB", note: "Mongoose" },
            { name: "Cloudinary", note: "وسائط · بديل محلي" }
          ]
        }
      ]
    }
  },
  "document-intelligence-rag": {
    ru: {
      title: "Поиск по технической документации",
      company: "Электросервис",
      rolePurpose: "Python-разработчик · апрель–октябрь 2026 · семантический и полнотекстовый поиск",
      description:
        "Семантический и полнотекстовый поиск по архиву документации ПТО — около 4,1 тыс. файлов PDF, DOCX, XLSX и RTF: собственный инвертированный индекс плюс FAISS на sentence-transformers, сервис на FastAPI. Без генерации LLM.",
      whatItDoes: [
        "Находит марку кабеля, шифр, обозначение оборудования или фразу и возвращает документ, страницу (или лист и строки), фрагмент и сетевой путь",
        "Гибридный поиск: собственный инвертированный индекс плюс семантический поиск FAISS на sentence-transformers (all-MiniLM-L6-v2)",
        "Сканы определяются автоматически; выбранные страницы проходят OCR (Tesseract + Poppler)",
        "Метки надёжности — «Точное совпадение», «Требуется проверка», «Совпадает частично» — и один результат на документ"
      ],
      longDescription:
        "Документация ПТО «Электросервиса» хранится в сетевом архиве: около 4,1 тыс. файлов PDF, DOCX, XLSX и RTF, из них около 1,5 тыс. — с текстом. С апреля по октябрь 2026 года по договорам ГПХ я сделал сервис поиска по нему: инженер вводит марку кабеля, шифр, обозначение оборудования или фразу и получает документ, страницу PDF (лист и строки Excel, раздел Word), фрагмент текста и сетевой путь. Документы не покидают сеть компании.\n\nПоиск гибридный, без генерации LLM: собственный инвертированный индекс по словам и обозначениям плюс семантический поиск FAISS на эмбеддингах sentence-transformers (all-MiniLM-L6-v2). Обозначения сравниваются по общим правилам: латиница и кириллица одинакового начертания, пробелы и дефисы не мешают совпадению, а номера и марки не подменяются. Сканы определяются автоматически, выбранные страницы проходят OCR (Tesseract + Poppler). Бэкенд — FastAPI, интерфейс — HTML/JS без фреймворков; сервис работает как служба systemd на Ubuntu Server с атомарной заменой индекса и откатом.\n\nЗапросы по шифрам и маркам ускорились с 9–10 с до 1,2–1,7 с, фразовые — с 55–70 с до 2–4 с; после перехода на инвертированный индекс p95 — 0,18 с на 55 контрольных запросах. Качество держат 739 тестов pytest и контрольный набор из 104 запросов с метриками top-1/top-5. Делал с AI-агентами (Codex, Cursor, Claude Code): собирал требования, писал ТЗ для агентов, ревьюил изменения и проверял их на рабочем индексе. Работа принята заказчиком в сентябре 2026 года. Код закрыт, поэтому здесь показана схема архитектуры.",
      problem:
        "Инженеры искали по сетевому архиву PDF, Word, Excel, RTF и сканов вручную. Обозначения — марки кабелей, шифры — должны совпадать точно, а фразам нужен поиск по смыслу.",
      solution:
        "Собственный инвертированный индекс для точных обозначений плюс семантический поиск FAISS, OCR для сканов и метки надёжности у каждого результата; бэкенд на FastAPI, интерфейс на HTML/JS, служба systemd.",
      result: "Принято заказчиком в сентябре 2026 года: p95 — 0,18 с, 739 тестов и контрольный набор из 104 запросов.",
      flow: [
        { label: "Загрузка", nodes: [{ name: "PDF · DOCX · XLSX · RTF" }, { name: "OCR", note: "Tesseract · сканы" }] },
        { label: "Индекс", nodes: [{ name: "Инвертированный индекс", note: "слова · обозначения" }, { name: "sentence-transformers" }, { name: "FAISS" }] },
        { label: "Запрос", nodes: [{ name: "FastAPI", note: "гибридное ранжирование" }, { name: "HTML / JS", note: "интерфейс поиска" }] }
      ]
    },
    ar: {
      title: "البحث في الوثائق الهندسية",
      company: "Elektroservis",
      rolePurpose: "مطوّر Python · أبريل–أكتوبر 2026 · بحث دلالي ونصي كامل",
      description:
        "بحث دلالي ونصي كامل في أرشيف الوثائق الهندسية — نحو 4.1 ألف ملف PDF وDOCX وXLSX وRTF: فهرس مقلوب خاص بالمشروع مع FAISS على sentence-transformers، خلف خدمة FastAPI. دون توليد نصوص بنماذج LLM.",
      whatItDoes: [
        "يعثر على رمز كابل أو رمز وثيقة أو تسمية معدّة أو عبارة، ويعيد الوثيقة والصفحة (أو الورقة والصفوف) والمقتطف والمسار الشبكي",
        "بحث هجين: فهرس مقلوب خاص بالمشروع مع بحث دلالي عبر FAISS على sentence-transformers ‏(all-MiniLM-L6-v2)",
        "يكتشف المستندات الممسوحة تلقائياً ويمرّر صفحات مختارة عبر OCR ‏(Tesseract + Poppler)",
        "تسميات موثوقية — تطابق تام، يحتاج إلى مراجعة، تطابق جزئي — ونتيجة واحدة لكل وثيقة"
      ],
      longDescription:
        "تحفظ Elektroservis وثائقها الهندسية (قسم PTO) في أرشيف شبكي من نحو 4.1 ألف ملف PDF وDOCX وXLSX وRTF، منها نحو 1.5 ألف تحتوي نصاً. ومن أبريل إلى أكتوبر 2026، بموجب عقود مدنية، بنيتُ خدمة بحث فيه: يكتب المهندس رمز كابل أو رمز وثيقة أو تسمية معدّة أو عبارة، فيحصل على الوثيقة وصفحة PDF (أو ورقة Excel وصفوفها، أو قسم Word) ومقتطف من النص والمسار الشبكي. ولا تغادر الوثائق شبكة الشركة.\n\nالبحث هجين ودون توليد نصوص بنماذج LLM: فهرس مقلوب خاص بالمشروع للكلمات والتسميات، مع بحث دلالي عبر FAISS على تضمينات sentence-transformers ‏(all-MiniLM-L6-v2). وتُطابَق التسميات بقواعد عامة: الحروف اللاتينية والكيريلية المتشابهة والمسافات والشرطات لا تمنع التطابق، بينما لا تُستبدل الأرقام والرموز أبداً. وتُكتشف المستندات الممسوحة تلقائياً وتمرّ صفحات مختارة منها عبر OCR ‏(Tesseract + Poppler). الخلفية على FastAPI والواجهة HTML/JS دون أطر عمل، وتعمل الخدمة عبر systemd على Ubuntu Server مع استبدال ذرّي للفهرس وإمكانية التراجع.\n\nانخفض زمن استعلامات الرموز من 9–10 ثوانٍ إلى 1.2–1.7 ثانية، والاستعلامات النصية من 55–70 ثانية إلى 2–4 ثوانٍ، وبعد الانتقال إلى الفهرس المقلوب بلغ زمن p95 ‏0.18 ثانية على 55 استعلام تحكّم. وتحفظ الجودةَ 739 اختبار pytest ومجموعة تحكّم من 104 استعلامات بمقاييس top-1/top-5. بنيتُه بمساعدة وكلاء الذكاء الاصطناعي (Codex وCursor وClaude Code): جمعتُ المتطلبات وكتبتُ المهام للوكلاء وراجعتُ التغييرات وتحقّقتُ منها على الفهرس الفعلي. وقبِل العميل العمل في سبتمبر 2026. الكود خاص، لذا يعرض المخطط البنية.",
      problem:
        "كان المهندسون يبحثون يدوياً في أرشيف شبكي من ملفات PDF وWord وExcel وRTF والمستندات الممسوحة. ويجب أن تتطابق التسميات — رموز الكابلات والوثائق — تطابقاً تاماً، بينما تحتاج العبارات إلى بحث بالمعنى.",
      solution:
        "فهرس مقلوب خاص بالمشروع للتسميات الدقيقة مع بحث دلالي عبر FAISS، وOCR للمستندات الممسوحة، وتسمية موثوقية لكل نتيجة؛ وخلفية FastAPI وواجهة HTML/JS وخدمة systemd.",
      result: "قبِله العميل في سبتمبر 2026: زمن p95 بلغ 0.18 ثانية، و739 اختباراً، ومجموعة تحكّم من 104 استعلامات.",
      flow: [
        { label: "الاستقبال", nodes: [{ name: "PDF · DOCX · XLSX · RTF" }, { name: "OCR", note: "Tesseract · المستندات الممسوحة" }] },
        { label: "الفهرسة", nodes: [{ name: "الفهرس المقلوب", note: "الكلمات · التسميات" }, { name: "sentence-transformers" }, { name: "FAISS" }] },
        { label: "الاستعلام", nodes: [{ name: "FastAPI", note: "ترتيب هجين" }, { name: "HTML / JS", note: "واجهة البحث" }] }
      ]
    }
  },
  ledgerline: {
    ru: {
      title: "Ledgerline",
      rolePurpose: "Open-source-платформа, сделана с Claude Code · Платёжная платформа, устроенная как банковская",
      description:
        "Платёжная платформа, в которой деньги никогда не создаются, не теряются и не проводятся дважды: двойная запись на журнале событий, карточные платежи и выплаты как саги, outbox в Kafka, проверка на мошенничество в потоке, аналитика в ClickHouse, gRPC API для мерчантов и трассировка OpenTelemetry — всё доказано намеренными сбоями.",
      whatItDoes: [
        "Леджер с двойной записью на Kotlin и Spring Boot поверх неизменяемого журнала событий в PostgreSQL: идемпотентные операции, никакого ухода в минус при любой конкуренции и аудит, пересчитывающий книги",
        "Карточные платежи, возвраты и выплаты в смоделированный ненадёжный банк — конечные автоматы и саги; каждое изменение попадает в Kafka через транзакционный outbox",
        "Мошенничество оценивает в потоке модель LightGBM на признаках из Kafka, измеренная по скрытой разметке симулятора; аналитика в ClickHouse сходится с леджером до копейки",
        "gRPC API, подписанные вебхуки и SDK на TypeScript для мерчантов; трассы, идущие за платежом через outbox, воркер и вебхуки; SLO-оповещения, проверенные внесением каждой неисправности"
      ],
      longDescription:
        "Ledgerline — open-source-платёжная платформа, которую я сделал с Claude Code, чтобы показать, что нужно ядру банка: деньги никогда не создаются, не теряются и не проводятся дважды, даже когда всё вокруг ломается. Леджер с двойной записью на Kotlin и Spring Boot ведёт неизменяемый журнал событий в PostgreSQL; остатки — проекции, восстанавливаемые из него, каждая запись идемпотентна, а аудит пересчитывает книги. Карточные платежи, возвраты и выплаты работают поверх него как конечные автоматы и саги, а каждое изменение попадает в Kafka через транзакционный outbox.\n\nЭто доказано сбоями под нагрузкой: сервисы, PostgreSQL и Kafka убиваются, сеть рвётся, ответы обрываются на середине, а клиент продолжает платить. В 11 сценариях хаоса и 40 461 запросе (4 188 из них отправлены дважды одновременно) проверка не нашла ни потерь, ни двойных проводок. Нагрузочные тесты нашли узкие места: леджер проводит около 430 переводов в секунду на одном ядре и отклоняет лишнее, а не падает.\n\nМодель LightGBM на признаках из Kafka в реальном времени поймала 88% мошенничества при 0,7% ложных отказов против 37% у настроенных правил, по скрытой разметке симулятора; аналитика в ClickHouse сходится с леджером до копейки. Мерчанты получают gRPC API, подписанные вебхуки и SDK на TypeScript: когда сервис убили посреди платежа, все 1 085 изменений всё равно дошли до тестового магазина. Трассы идут за платежом через outbox, воркер и вебхуки, а каждое оповещение проверено внесением той неисправности, за которой оно следит.",
      problem:
        "Платёжные системы проверяет день сбоя: потерянный ответ, упавшая база или повторный запрос не должны создать деньги, потерять их или провести дважды — а демо редко это показывают.",
      solution:
        "Леджер с двойной записью на журнале событий, саги, которые никогда не гадают, идемпотентность везде и outbox в Kafka, а затем хаос-тесты, нагрузочные тесты, модель мошенничества и оповещения — всё измерено, а не предположено.",
      result:
        "Ни потерь, ни двойных проводок в 11 сценариях хаоса и 40 461 запросе; мошенничество поймано на 88% против 37% у правил; ~430 переводов/с на одном ядре; каждое оповещение проверено; онлайн-демо и CI."
    },
    ar: {
      title: "Ledgerline",
      rolePurpose: "منصة مفتوحة المصدر، بُنيت باستخدام Claude Code · منصة مدفوعات مبنية كأنظمة البنوك",
      description:
        "منصة مدفوعات لا تُخلق فيها الأموال ولا تضيع ولا تُنقل مرتين: دفتر قيد مزدوج على سجل أحداث، ومدفوعات البطاقات والتحويلات كمعاملات Saga، وصندوق صادر (outbox) إلى Kafka، وفحص احتيال فوري، وتحليلات في ClickHouse، وواجهة gRPC للتجار، وتتبّع OpenTelemetry، وكل ذلك مُثبت بإحداث الأعطال عمداً.",
      whatItDoes: [
        "دفتر قيد مزدوج بلغة Kotlin وSpring Boot على سجل أحداث لا يُعدَّل في PostgreSQL، بعمليات كتابة متساوية الأثر (idempotent)، ودون سحب على المكشوف مهما تزامنت الطلبات، ومراجعة تعيد حساب الدفاتر",
        "مدفوعات البطاقات والاستردادات والتحويلات إلى بنك محاكى غير موثوق كآلات حالة ومعاملات Saga؛ وكل تغيير يصل إلى Kafka عبر صندوق صادر في المعاملة نفسها",
        "يقيّم نموذج LightGBM الاحتيال فورياً بخصائص مأخوذة من Kafka، مقيساً على الحقيقة المخفية لمحاكٍ؛ وتحليلات ClickHouse تطابق الدفتر حتى آخر كوبيك",
        "واجهة gRPC وwebhooks موقّعة وSDK بلغة TypeScript للتجار؛ وتتبّع يلاحق الدفعة عبر الصندوق الصادر والعامل الخلفي والـwebhooks؛ وتنبيهات SLO ثبت أنها تعمل بإحداث كل عطل"
      ],
      longDescription:
        "Ledgerline منصة مدفوعات مفتوحة المصدر بنيتُها باستخدام Claude Code لأعرض ما يحتاجه قلب نظام بنكي: أموال لا تُخلق ولا تضيع ولا تُنقل مرتين، حتى حين يتعطل كل ما حولها. يحفظ دفتر القيد المزدوج المكتوب بـKotlin وSpring Boot سجل أحداث لا يُعدَّل في PostgreSQL؛ والأرصدة إسقاطات يعاد بناؤها منه، وكل عملية كتابة متساوية الأثر، وتعيد المراجعة حساب الدفاتر. وتعمل فوقه مدفوعات البطاقات والاستردادات والتحويلات كآلات حالة ومعاملات Saga، ويصل كل تغيير إلى Kafka عبر صندوق صادر في المعاملة نفسها.\n\nوقد أُثبت ذلك بإحداث الأعطال بينما يواصل عميل الدفع: إيقاف الخدمات وPostgreSQL وKafka قسراً، وقطع الشبكة، وقطع الردود في منتصفها. وعبر 11 سيناريو فوضى و40,461 طلباً (أُرسل 4,188 منها مرتين في آن واحد) لم يجد المدقق شيئاً ضاع ولا شيئاً نُفّذ مرتين. وكشفت اختبارات الحمل نقاط الاختناق: ينفّذ الدفتر نحو 430 تحويلاً في الثانية على نواة واحدة، ويرفض الفائض بدل أن ينهار.\n\nالتقط نموذج LightGBM المبني على خصائص فورية من Kafka ‏88% من الاحتيال مع 0.7% فقط من الرفض الخاطئ، مقابل 37% للقواعد المضبوطة، مقيساً على الحقيقة المخفية للمحاكي؛ وتطابق تحليلات ClickHouse الدفتر حتى آخر كوبيك. ويحصل التجار على واجهة gRPC وwebhooks موقّعة وSDK بلغة TypeScript: وحين أُوقفت الخدمة في منتصف الدفع، وصلت جميع التغييرات الـ1,085 إلى المتجر التجريبي. ويلاحق التتبّع الدفعة عبر الصندوق الصادر والعامل الخلفي والـwebhooks، وثبت عمل كل تنبيه بإحداث العطل الذي يراقبه.",
      problem:
        "تُختبر أنظمة الدفع يوم الأعطال: رد ضائع أو قاعدة بيانات متوقفة أو طلب مكرر يجب ألا يخلق أموالاً أو يضيعها أو ينقلها مرتين، ونادراً ما تُظهر العروض ذلك.",
      solution:
        "دفتر قيد مزدوج على سجل أحداث، ومعاملات Saga لا تخمّن أبداً، وتساوي الأثر في كل مكان، وصندوق صادر إلى Kafka، ثم اختبارات فوضى وحمل ونموذج احتيال وتنبيهات، كلها مقيسة لا مفترضة.",
      result:
        "لا شيء ضاع ولا شيء نُفّذ مرتين عبر 11 سيناريو فوضى و40,461 طلباً؛ التقاط 88% من الاحتيال مقابل 37% للقواعد؛ نحو 430 تحويلاً/ث على نواة واحدة؛ كل تنبيه ثبت عمله؛ عرض حيّ وتكامل مستمر."
    }
  },
  depotwin: {
    ru: {
      title: "Depotwin",
      rolePurpose: "Open-source-платформа, сделана с Claude Code · Цифровой двойник автопарка в реальном времени",
      description:
        "Живой 3D-цифровой двойник 240 смоделированных машин в Москве: конвейер на Go и NATS JetStream в TimescaleDB, модели отказов, предупреждающие о поломках за дни, копилот на локальной LLM поверх запросов только на чтение и приложение водителя, работающее без сети.",
      whatItDoes: [
        "Моделирует на Go 240 фургонов, грузовиков и микроавтобусов на реальной дорожной сети Москвы (OpenStreetMap) с неисправностями и эталонной разметкой, которую работающая система не видит",
        "Передаёт показания через NATS JetStream в TimescaleDB и по WebSocket в 3D-двойник (React, MapLibre, three.js), в реальном времени или в повторе",
        "Предсказывает перегрев и разряд аккумулятора за дни с помощью LightGBM; локальная LLM (Qwen 3.5 9B) отвечает на вопросы на русском, английском и арабском через фиксированные запросы только на чтение",
        "Приложение водителя на Expo (React Native) работает без сети; в эксплуатации — Prometheus и Grafana, правила оповещений с тестами и нагрузочный тест k6"
      ],
      longDescription:
        "Depotwin — open-source-платформа, которую я сделал с Claude Code, чтобы показать систему реального времени целиком и измерить её по эталонной разметке. Симулятор на Go ведёт 240 фургонов, грузовиков и микроавтобусов по дорожной сети Москвы из OpenStreetMap, отправляет показания, как GPS-трекеры, и вносит неисправности: слив топлива, отказ термостата и аккумулятора, подмену GPS, ночные поездки. Что произошло на самом деле, публикуется отдельно, поэтому детекторы оцениваются, не видя этого.\n\nПоказания идут через NATS JetStream в TimescaleDB (13,4 млн записей в повторе — без пропусков и дублей при перезапусках) и дальше в 3D-двойник на React, MapLibre и three.js. Сервис оповещений на FastAPI находит неисправности по мере появления, а модели LightGBM на дневных признаках предупреждают о поломках: на незнакомых автопарках они заметили 156 из 157 перегревов за 4,5 дня до отказа против 3,0 дня у пороговых правил и с меньшим числом ложных тревог. Копилот на локальной Qwen 3.5 9B может вызывать только семь проверяемых запросов на чтение и показывает данные за каждым ответом; на 17 из 18 отложенных вопросов он ответил верно.\n\nВодители пользуются приложением на Expo: смены, осмотры и сообщения о неисправностях с фото копятся без сети и уходят по порядку без дублей, а неисправность сразу видна в двойнике. Prometheus и Grafana следят за каждым этапом, правила оповещений покрыты тестами, а нагрузочный тест k6 нашёл, где API ломался; после исправлений он выдерживает 200 запросов в секунду без ошибок при 200 подключённых зрителях.",
      problem:
        "Панели автопарка показывают, где машины, но не то, что вот-вот сломается, а их оповещения и прогнозы редко сверяют с тем, что произошло на самом деле.",
      solution:
        "Потоковый конвейер в живой 3D-двойник, модели отказов, сравнённые с пороговыми правилами на незнакомых автопарках, LLM-копилот только с запросами на чтение и приложение водителя, работающее без сети, — всё измерено по скрытой эталонной разметке.",
      result:
        "Перегрев замечен за 4,5 дня (правила: 3,0) с меньшим числом ложных тревог; 17 из 18 отложенных вопросов к копилоту — верно; 200 запросов в секунду без ошибок под нагрузкой; онлайн-демо и CI для каждой части."
    },
    ar: {
      title: "Depotwin",
      rolePurpose: "منصة مفتوحة المصدر، بُنيت باستخدام Claude Code · توأم رقمي حيّ لأسطول مركبات",
      description:
        "توأم رقمي حيّ ثلاثي الأبعاد لـ240 مركبة محاكاة في موسكو: مسار بيانات بلغة Go وNATS JetStream إلى TimescaleDB، ونماذج أعطال تنبّه إلى الأعطال قبل وقوعها بأيام، ومساعد بنموذج لغوي محلي عبر استعلامات للقراءة فقط، وتطبيق للسائقين يعمل دون اتصال.",
      whatItDoes: [
        "يحاكي بلغة Go ‏240 شاحنة صغيرة وشاحنة وحافلة صغيرة على شبكة طرق موسكو الحقيقية (OpenStreetMap)، مع أعطال مدسوسة وحقيقة مرجعية لا يراها النظام العامل",
        "ينقل القراءات عبر NATS JetStream إلى TimescaleDB، ثم عبر WebSocket إلى توأم ثلاثي الأبعاد (React وMapLibre وthree.js)، مباشرةً أو بإعادة التشغيل",
        "يتنبأ بارتفاع حرارة المحرك وتلف البطارية قبل أيام باستخدام LightGBM؛ ويجيب نموذج لغوي محلي (Qwen 3.5 9B) عن الأسئلة بالعربية والروسية والإنجليزية عبر استعلامات ثابتة للقراءة فقط",
        "تطبيق للسائقين بـExpo ‏(React Native) يعمل دون اتصال؛ وفي التشغيل: Prometheus وGrafana وقواعد تنبيه مختبَرة واختبار حمل بـk6"
      ],
      longDescription:
        "Depotwin منصة مفتوحة المصدر بنيتُها باستخدام Claude Code لأعرض نظاماً آنياً كاملاً مقيساً على حقيقة مرجعية. يقود محاكٍ مكتوب بلغة Go ‏240 شاحنة صغيرة وشاحنة وحافلة صغيرة على شبكة طرق موسكو من OpenStreetMap، ويرسل القراءات كما تفعل أجهزة تتبّع GPS، ويدسّ أعطالاً: سرقة الوقود، وتلف منظِّم الحرارة والبطارية، وتزييف موقع GPS، والقيادة ليلاً. وما حدث فعلاً يُنشر على حدة، فتُقيَّم أنظمة الكشف دون أن تراه.\n\nتمرّ القراءات عبر NATS JetStream إلى TimescaleDB (‏13.4 مليون قراءة أُعيد تشغيلها دون فجوات أو تكرار رغم إعادة التشغيل) ومنها إلى توأم ثلاثي الأبعاد مبني بـReact وMapLibre وthree.js. وتكتشف خدمة تنبيهات على FastAPI الأعطال لحظة وقوعها، وتنبّه نماذج LightGBM المبنية على خصائص يومية إلى الأعطال قبل وقوعها: على أساطيل لم ترها من قبل التقطت 156 من 157 عطلاً بارتفاع الحرارة قبل 4.5 يوم، مقابل 3.0 أيام لقواعد العتبات، وبإنذارات كاذبة أقل. ولا يستطيع المساعد المبني على Qwen 3.5 9B المحلي إلا استدعاء سبعة استعلامات مُتحقَّق منها للقراءة فقط، ويعرض البيانات وراء كل إجابة؛ وأجاب إجابة صحيحة عن 17 من 18 سؤالاً محجوزاً للاختبار.\n\nويستخدم السائقون تطبيقاً بـExpo يحفظ الورديات والفحوص وبلاغات الأعطال مع الصور دون اتصال، ثم يرسلها بالترتيب دون تكرار، فيظهر العطل في التوأم فوراً. ويراقب Prometheus وGrafana كل مرحلة، وقواعد التنبيه مختبَرة، وكشف اختبار الحمل بـk6 أين كانت الواجهة البرمجية تنهار؛ وبعد الإصلاحات تخدم 200 طلب في الثانية دون أخطاء مع بقاء 200 مشاهد متصلين.",
      problem:
        "تعرض لوحات الأساطيل مواقع المركبات، لكنها لا تعرض ما يوشك أن يتعطل، ونادراً ما تُقارَن تنبيهاتها وتوقعاتها بما حدث فعلاً.",
      solution:
        "مسار بيانات متدفق إلى توأم حيّ ثلاثي الأبعاد، ونماذج أعطال مقارَنة بقواعد العتبات على أساطيل جديدة، ومساعد بنموذج لغوي يقتصر على استعلامات القراءة، وتطبيق للسائقين يعمل دون اتصال، وكل ذلك مقيس على حقيقة مرجعية مخفية.",
      result:
        "التُقط ارتفاع الحرارة قبل 4.5 يوم (القواعد: 3.0) بإنذارات كاذبة أقل؛ و17 من 18 سؤالاً محجوزاً أجاب عنها المساعد بشكل صحيح؛ و200 طلب في الثانية دون أخطاء تحت الحمل؛ وعرض حيّ وتكامل مستمر لكل جزء."
    }
  },
  clearhire: {
    ru: {
      title: "Clearhire",
      rolePurpose: "Open-source-платформа, сделана с Claude Code · AI-найм с доказательствами",
      description:
        "AI-платформа для найма: проверяет резюме по каждому требованию вакансии и показывает строку резюме за каждым выводом — слепой отбор, локальная LLM, обязанная ссылаться на источник, и журнал аудита, закреплённый в блокчейне.",
      whatItDoes: [
        "Читает резюме в PDF, Word, сканах и фото (OCR Tesseract) на русском и английском: навыки, должности с датами, языки и образование",
        "Ранжирует кандидатов сначала по невыполненным обязательным требованиям, затем по баллу и сходству, с цитатой за каждым выводом",
        "Слепой отбор до того, как модель видит текст; локальная LLM (Qwen 3.5 9B) пишет сводки и ответы, обязанные ссылаться на резюме",
        "Консоль на Angular, сайт вакансий на Next.js и Telegram-бот на NestJS поверх одного API на FastAPI; журнал аудита в смарт-контракте на Solidity; Helm-чарт проверяется на kind в CI"
      ],
      longDescription:
        "Clearhire — open-source-платформа для найма, которую я сделал с Claude Code, чтобы показать AI-продукт целиком, от разбора резюме до развёртывания. Кандидат может проверить резюме по вакансии до отклика и увидеть по каждому требованию, найдено ли оно и какая строка резюме это показывает; рекрутер видит то же самое, уже в рейтинге.\n\nБэкенд на Python: резюме в PDF, Word или сканах проходят через OCR Tesseract и превращаются в профиль с датированными должностями и доказательствами навыков, эмбеддинги в pgvector дают гибридный поиск, а навыки ищет матчер на C++ с запасной реализацией на Python. Рейтинг строится по требованиям, а не по одному числу сходства. Персональные данные заменяются до того, как текст прочитает модель эмбеддингов; локальная Qwen 3.5 9B пишет сводки, из которых удаляются предложения без ссылок; каждое решение попадает в журнал аудита со сцеплением SHA-256, а корни дерева Меркла раз в час закрепляются в смарт-контракте на Solidity.\n\nКачество измерено на сгенерированном наборе из 312 резюме и 39 вакансий с известными ответами: nDCG@10 0,972 против 0,603 у одних эмбеддингов, навыки извлекаются с F1 0,997, а во всех 486 слепых заменах пола, происхождения и возраста баллы не меняются. Демо работает на GPU-сервере в Docker Compose, а Helm-чарт проверяется сквозным тестом на kind в GitHub Actions.",
      problem:
        "Инструменты отбора ранжируют резюме по одному числу сходства, которое никто не может объяснить, на него влияют имя и возраст, и не остаётся записи, которую мог бы проверить кандидат или аудитор.",
      solution:
        "Проверка по каждому требованию с цитатой из резюме, слепой отбор до любой модели, LLM, которая может только объяснять со ссылками, и журнал аудита, защищённый от подмены и закреплённый в блокчейне.",
      result:
        "nDCG@10 0,972 на 312 синтетических резюме (одни эмбеддинги — 0,603); одинаковые баллы во всех 486 слепых заменах; живое демо и CI для Python, трёх фронтендов, контракта и сквозного теста в Kubernetes."
    },
    ar: {
      title: "Clearhire",
      rolePurpose: "منصة مفتوحة المصدر بُنيت بمساعدة Claude Code · توظيف بالذكاء الاصطناعي مع الأدلة",
      description:
        "منصة توظيف بالذكاء الاصطناعي تتحقق من السيرة الذاتية مقابل كل متطلب في الوظيفة وتُظهر السطر الذي يدعم كل حكم، مع فرز يُخفي البيانات الشخصية، ونموذج لغوي محلي ملزم بذكر مصادره، وسجل تدقيق مثبّت على سلسلة كتل.",
      whatItDoes: [
        "يقرأ السير الذاتية بصيغ PDF وWord والمستندات الممسوحة والصور (Tesseract OCR) بالإنجليزية والروسية: المهارات والوظائف بتواريخها واللغات والشهادات",
        "يرتّب المرشحين أولاً حسب المتطلبات الإلزامية غير المستوفاة، ثم حسب الدرجة والتشابه، مع الاقتباس الذي يدعم كل حكم",
        "فرز يُخفي البيانات الشخصية قبل أن يرى النموذج النص، ونموذج لغوي محلي (Qwen 3.5 9B) يكتب ملخصات وإجابات ملزمة بالاستشهاد بالسيرة الذاتية",
        "لوحة تحكم بـAngular وموقع وظائف بـNext.js وبوت تيليغرام بـNestJS فوق واجهة FastAPI واحدة، وسجل تدقيق في عقد ذكي بـSolidity، ومخطط Helm يُختبر على kind في CI"
      ],
      longDescription:
        "Clearhire منصة توظيف مفتوحة المصدر بنيتُها بمساعدة Claude Code لأعرض منتج ذكاء اصطناعي كاملاً، من قراءة السيرة الذاتية إلى النشر. يستطيع المرشح فحص سيرته الذاتية مقابل الوظيفة قبل التقديم ليرى لكل متطلب هل وُجد، وأي سطر من سيرته يثبته؛ ويرى مسؤول التوظيف القراءة نفسها مرتّبةً.\n\nالواجهة الخلفية بلغة Python: تمرّ السير الذاتية بصيغ PDF وWord والممسوحة عبر Tesseract OCR وتتحول إلى ملف بوظائف مؤرخة وأدلة على كل مهارة، وتتيح التضمينات في pgvector بحثاً هجيناً، ويبحث مطابِق بلغة C++ عن المهارات مع بديل بلغة Python. يعتمد الترتيب على المتطلبات لا على رقم تشابه واحد. تُستبدل البيانات الشخصية قبل أن يقرأ نموذج التضمين النص، ويكتب نموذج Qwen 3.5 9B المحلي ملخصات تُحذف منها كل جملة بلا استشهاد، ويُسجَّل كل قرار في سجل تدقيق مترابط بـSHA-256 تُثبَّت جذور شجرة ميركل الخاصة به كل ساعة في عقد ذكي بـSolidity.\n\nقيست الجودة على مجموعة مولَّدة من 312 سيرة ذاتية و39 وظيفة بإجابات معروفة: بلغ nDCG@10 0.972 مقابل 0.603 للتضمينات وحدها، واستُخرجت المهارات بمقياس F1 بلغ 0.997، ولم تتغير الدرجات في أيٍّ من 486 تبديلاً للجنس والأصل والعمر في الوضع المخفي. يعمل العرض الحي على خادم GPU عبر Docker Compose، ويُختبر مخطط Helm اختباراً شاملاً على kind في GitHub Actions.",
      problem:
        "ترتّب أدوات الفرز السير الذاتية برقم تشابه واحد لا يستطيع أحد تفسيره، وقد يتأثر بالاسم والعمر، ولا تترك سجلاً يمكن للمرشح أو المدقق التحقق منه.",
      solution:
        "فحص كل متطلب مع اقتباس من السيرة الذاتية، وفرز يُخفي البيانات الشخصية قبل أي نموذج، ونموذج لغوي لا يُسمح له إلا بالشرح مع الاستشهاد، وسجل تدقيق يكشف أي تلاعب ومثبّت على سلسلة كتل.",
      result:
        "بلغ nDCG@10 0.972 على 312 سيرة ذاتية اصطناعية (0.603 للتضمينات وحدها)، ودرجات متطابقة في جميع التبديلات الـ486 في الوضع المخفي، وعرض حي، وCI يغطي Python وثلاث واجهات أمامية والعقد واختباراً شاملاً على Kubernetes."
    }
  },
  "lumen-search": {
    ru: {
      title: "Lumen Search",
      rolePurpose: "Open-source-прототип, сделан с AI-агентами · гибридный поиск по документам (RAG)",
      description:
        "Гибридный поиск со ссылками на источник по PDF, Word, Excel и сканам на английском и русском: BM25 и многоязычные эмбеддинги в FAISS, OCR и сервис на FastAPI.",
      whatItDoes: [
        "Разбирает PDF, Word, Excel, Markdown и HTML; сканы проходят через OCR Tesseract на английском и русском",
        "Делит текст по разделам и строкам таблиц, поэтому каждый результат указывает страницу, статью закона или строку",
        "Гибридный поиск: BM25 и эмбеддинги multilingual-e5 в FAISS, объединённые по рангам, с переранжированием кросс-энкодером",
        "Сервис на FastAPI с кешем Redis, ответы с пронумерованными источниками и демо, которое работает прямо в браузере"
      ],
      longDescription:
        "Lumen Search — open-source-прототип, который я сделал с AI-агентами на ту же тему, что и мой рабочий поиск по документации: единый поиск по PDF, файлам Word, таблицам Excel и сканам, где у каждого ответа видно, откуда он взят. В индексе восемь открытых документов: рекомендации NIST и OWASP по безопасности на английском, закон о персональных данных на русском и два скана, которые можно прочитать только через OCR.\n\nРазбор повторяет структуру документа — закладки PDF и нумерованные заголовки, стили заголовков Word, одна строка таблицы на запись, — поэтому результат ссылается на страницу и раздел, статью закона или лист и строку. Поиск идёт двумя способами: BM25 по словам английского и русского, приведённым к основе стеммером Snowball, и эмбеддинги multilingual-e5 в FAISS; два ранжирования объединяются, а лучшие результаты можно переранжировать многоязычным кросс-энкодером.\n\nКачество измерено на 62 вопросах с ручной разметкой: гибридный поиск находит верный фрагмент в первой пятёрке для 75,8% вопросов, а с переранжированием — для 83,9%; в README честно описаны и слабые места. Сервис запускается одной командой docker compose, а живое демо выполняет тот же поиск в браузере с int8-моделью на 66 МБ; CI проверяет, что JavaScript-версия совпадает с кодом на Python.",
      problem:
        "Документы приходят вперемешку — PDF, Word, таблицы и сканы, а обычный поиск по ключевым словам не находит перефразированное и не показывает, откуда взят ответ.",
      solution:
        "Разбор с учётом структуры и OCR, поиск BM25 и по эмбеддингам с объединением по рангам, переранжирование и ссылки вплоть до страницы, статьи или строки таблицы.",
      result:
        "Для 83,9% из 62 размеченных вопросов верный фрагмент попадает в первую пятёрку после переранжирования. Живое демо в браузере; тесты на трёх версиях Python и проверка Docker-образа в CI."
    },
    ar: {
      title: "Lumen Search",
      rolePurpose: "نموذج أولي مفتوح المصدر بُني بمساعدة وكلاء الذكاء الاصطناعي · بحث هجين في المستندات (RAG)",
      description:
        "بحث هجين يذكر مصدر كل نتيجة في ملفات PDF وWord وExcel والصفحات الممسوحة ضوئياً، بالإنجليزية والروسية: BM25 وتضمينات متعددة اللغات في FAISS، وOCR، وخدمة FastAPI.",
      whatItDoes: [
        "يحلّل ملفات PDF وWord وExcel وMarkdown وHTML، وتمرّ الصفحات الممسوحة عبر Tesseract OCR بالإنجليزية والروسية",
        "يقسّم النص حسب الأقسام وصفوف الجداول، فتشير كل نتيجة إلى صفحة أو مادة من القانون أو صف",
        "بحث هجين: BM25 مع تضمينات multilingual-e5 في FAISS يُدمجان حسب الترتيب، مع إعادة ترتيب اختيارية بنموذج cross-encoder",
        "خدمة FastAPI مع تخزين مؤقت في Redis، وإجابات بمصادر مرقّمة، وعرض تجريبي يعمل داخل المتصفح"
      ],
      longDescription:
        "Lumen Search نموذج أولي مفتوح المصدر بنيتُه بمساعدة وكلاء الذكاء الاصطناعي، في موضوع عملي نفسه على البحث في الوثائق: بحث واحد في ملفات PDF وWord وجداول Excel والمستندات الممسوحة، تُظهر فيه كل إجابة مصدرها بدقة. ويضم الفهرس ثمانية مستندات عامة: إرشادات NIST وOWASP الأمنية بالإنجليزية، وقانون البيانات الشخصية الروسي بالروسية، ومستندين ممسوحين لا يمكن قراءتهما إلا عبر OCR.\n\nيتبع التحليل بنية كل مستند — إشارات PDF المرجعية والعناوين المرقّمة، وأنماط العناوين في Word، وصفاً واحداً من الجدول لكل سجل — فتُحيل النتيجة إلى صفحة وقسم، أو مادة من القانون، أو ورقة وصف. ويجري البحث بطريقتين: BM25 على كلمات إنجليزية وروسية مردودة إلى جذورها بأداة Snowball، وتضمينات multilingual-e5 في FAISS، ثم يُدمج الترتيبان، ويمكن إعادة ترتيب أفضل النتائج بنموذج cross-encoder متعدد اللغات.\n\nوالجودة مقيسة على 62 سؤالاً صُنّفت يدوياً: يضع البحث الهجين مقطعاً صحيحاً بين أول خمس نتائج في 75.8% من الأسئلة، وترفع إعادة الترتيب النسبة إلى 83.9%، ويذكر ملف README نقاط الضعف أيضاً. تعمل الخدمة بأمر docker compose واحد، ويشغّل العرض الحيّ البحث نفسه داخل المتصفح بنموذج int8 حجمه 66 ميغابايت، ويتحقق CI من تطابق نسخة JavaScript مع كود Python.",
      problem:
        "تصل المستندات خليطاً من ملفات PDF وWord والجداول والمستندات الممسوحة، والبحث التقليدي بالكلمات المفتاحية لا يجد الصياغات المختلفة ولا يبيّن مصدر الإجابة.",
      solution:
        "تحليل يراعي بنية المستند مع OCR، وبحث BM25 وبحث بالتضمينات يُدمجان حسب الترتيب، وإعادة ترتيب اختيارية، وإحالات تصل إلى الصفحة أو المادة أو صف الجدول.",
      result:
        "يحصل 83.9% من 62 سؤالاً مصنّفاً على مقطع صحيح بين أول خمس نتائج بعد إعادة الترتيب. عرض حيّ في المتصفح، واختبارات على ثلاثة إصدارات من Python وفحص لصورة Docker في CI."
    }
  },
  pulseboard: {
    ru: {
      title: "Pulseboard",
      rolePurpose: "Open-source-прототип, сделан с AI-агентами · мониторинг доступности и SLO",
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
      result:
        "Тесты покрывают восстановление после инцидентов, расчёт SLO, контроль доступа и защиту от SSRF. Живое демо; запуск одной командой docker compose."
    },
    ar: {
      title: "Pulseboard",
      rolePurpose: "نموذج أولي مفتوح المصدر بُني بمساعدة وكلاء الذكاء الاصطناعي · مراقبة التوفّر وأهداف SLO",
      description:
        "مراقبة توفّر خدمات HTTP على خادمك الخاص، مع حوادث تُفتح تلقائياً وميزانيات أخطاء SLO وصفحة حالة عامة ومقاييس Prometheus — في حاوية واحدة.",
      whatItDoes: [
        "يفحص نقاط نهاية HTTP وفق جدول زمني ويسجّل زمن الاستجابة والتوفّر",
        "يفتح الحوادث ويغلقها تلقائياً",
        "تقارير ميزانية الأخطاء لأهداف SLO على مدى 24 ساعة و7 أيام و30 يوماً",
        "صفحة حالة عامة وواجهة JSON API مضبوطة الأنواع وفحوص للصحة ومسار ‎/metrics"
      ],
      longDescription:
        "Pulseboard أداة مدمجة لمراقبة التوفّر تعمل في حاوية واحدة: المجدوِل وواجهة API ولوحة التحكم وقاعدة SQLite لا تحتاج إلى أي خدمة خارجية. تفحص نقاط نهاية HTTP العامة وفق جدول زمني، وتحفظ زمن الاستجابة والتوفّر، وتفتح الحوادث وتغلقها من تلقاء نفسها.\n\nتتحوّل الفحوص المحفوظة إلى تقارير ميزانية أخطاء لأهداف SLO: الهدف، ونسبة التوفّر الفعلية، وتقدير زمن التوقف، ومدى استنفاد الميزانية على مدى 24 ساعة أو 7 أيام أو 30 يوماً. والحالة نفسها متاحة عبر لوحة تحكم متجاوبة، وصفحة حالة عامة للقراءة فقط لا تكشف الروابط المراقَبة، وواجهة JSON API مضبوطة الأنواع، وفحوص liveness وreadiness، ومقاييس متوافقة مع Prometheus.\n\nالإعدادات الافتراضية آمنة عن قصد: الشبكات الخاصة والمحجوزة محظورة، والروابط التي تتضمن بيانات اعتماد مرفوضة، ولا تُتبَع عمليات إعادة التوجيه، ويكفي متغيّر بيئة واحد لحماية كل عمليات الكتابة بمفتاح API. وتعمل الاختبارات على ناقل HTTP في الذاكرة، وتغطي التعافي من الحوادث وحسابات SLO والتحكم في الوصول وحماية الطلبات الصادرة.",
      problem: "مراقبة التوفّر وسجل الحوادث وتقارير SLO تتطلّب عادةً تشغيل عدة خدمات منفصلة.",
      solution:
        "خدمة FastAPI واحدة بمجدوِل غير متزامن وتخزين SQLite ولوحة تحكم وصفحة حالة عامة ومقاييس Prometheus.",
      result:
        "تغطي الاختبارات التعافي من الحوادث وحسابات SLO والتحكم في الوصول والحماية من SSRF. عرض حيّ، ويعمل بأمر docker compose واحد."
    }
  },
  deployledger: {
    ru: {
      title: "DeployLedger",
      rolePurpose: "Open-source-прототип, сделан с AI-агентами · релизы и метрики DORA",
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
      result:
        "Считает все пять метрик DORA по событиям деплоя и ведёт журнал аудита, в котором видна любая подмена. Живое демо; CI тестирует код и сканирует образы."
    },
    ar: {
      title: "DeployLedger",
      rolePurpose: "نموذج أولي مفتوح المصدر بُني بمساعدة وكلاء الذكاء الاصطناعي · عمليات الإصدار ومقاييس DORA",
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
      result:
        "يحسب مقاييس DORA الخمسة كلها من أحداث النشر، مع سلسلة تدقيق تكشف أي تلاعب. عرض حيّ، وCI يختبر الكود ويفحص الصور."
    }
  },
  gatehouse: {
    ru: {
      title: "Gatehouse",
      rolePurpose: "Open-source-прототип, сделан с AI-агентами · доступ по принципу just-in-time",
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
      result:
        "Ключи идемпотентности, оптимистичные блокировки и журнал аудита на хеш-цепочке для каждого рабочего пространства. Живое демо и публичный OpenAPI."
    },
    ar: {
      title: "Gatehouse",
      rolePurpose: "نموذج أولي مفتوح المصدر بُني بمساعدة وكلاء الذكاء الاصطناعي · صلاحيات وصول عند الحاجة",
      description:
        "خدمة لطلب صلاحيات الوصول والموافقة عليها تعمل على بنيتك الخاصة: وصول محدود النطاق وقصير الأجل، وكل قرار موثّق في سلسلة تدقيق قابلة للتحقق.",
      whatItDoes: [
        "يطلب المهندسون وصولاً محدود النطاق وقصير الأجل",
        "يرى المعتمِدون المخاطر وسياق السياسات قبل اتخاذ القرار",
        "يُسجَّل كل قرار في سلسلة تدقيق مترابطة بالتجزئة خاصة بكل مساحة عمل",
        "عزل مساحات العمل وثلاثة أدوار: مقدّم الطلب والمعتمِد والمسؤول"
      ],
      longDescription:
        "الوصول الدائم إلى بيئة الإنتاج يخلق غموضاً وقت الحوادث: من كان يملك الوصول، ولماذا احتاجه، وهل اتُّخذ القرار وفق السياسة؟ يجيب Gatehouse عن ذلك بمسار صغير وشفاف لمنح الوصول عند الحاجة (just-in-time): يطلب المهندس وصولاً محدود النطاق لفترة محددة، ويراجع المعتمِد الطلب والمخاطر وسياق السياسة أمامه.\n\nالخلفية مبنية على FastAPI غير متزامن مع تحقق Pydantic، وSQLite محلياً وPostgreSQL في الإنتاج. وتُضمن سلامة العمليات بآليات صريحة: مفاتيح idempotency، والقفل المتفائل، ومدد صلاحية تحدّها السياسة، ومعالجة آمنة للقرارات المتعارضة. ولكل مساحة عمل سلسلة تدقيق خاصة بها مترابطة بالتجزئة ولا تقبل إلا الإضافة.\n\nتعمل واجهة المراجعة المبنية على React وTypeScript في وضعين حيّ وتجريبي، ويسهل التحكم فيها من لوحة المفاتيح. والتسليم بالعناية نفسها: صور متعددة المراحل تعمل دون root، وفحوص للصحة والجاهزية، وطبقات Kustomize، وTerraform، ونشر الصور على GHCR.",
      problem: "مع الوصول الدائم إلى الإنتاج يصعب معرفة من كان يملك الوصول، ولماذا، وهل مُنح وفق القواعد.",
      solution:
        "مسار لطلب الوصول والموافقة عليه عند الحاجة، مع سياق السياسات وعزل مساحات العمل وسجل تدقيق مترابط بالتجزئة.",
      result: "مفاتيح idempotency وقفل متفائل وسلسلة تدقيق مترابطة بالتجزئة لكل مساحة عمل. عرض حيّ وواجهة OpenAPI عامة."
    }
  },
  "webhook-workbench": {
    ru: {
      title: "Webhook Workbench",
      rolePurpose: "Open-source-прототип, сделан с AI-агентами · отладка вебхуков на Go",
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
      result:
        "Тесты покрывают скрытие секретов, проверку подписей, переотправку и защиту от SSRF. Релизные бинарники с контрольными суммами; публичная песочница."
    },
    ar: {
      title: "Webhook Workbench",
      rolePurpose: "نموذج أولي مفتوح المصدر بُني بمساعدة وكلاء الذكاء الاصطناعي · تصحيح webhooks بلغة Go",
      description:
        "أداة خاصة تعمل على خادمك لالتقاط webhooks وفحصها والتحقق منها وإعادة إرسالها بأمان — ملف تنفيذي واحد بلغة Go بلا اعتماديات، والواجهة مدمجة فيه.",
      whatItDoes: [
        "يلتقط طلبات HTTP بأي طريقة على المسار ‎/inbox/{channel}‎ ويعرض الحركة مباشرة",
        "يتحقق من تواقيع GitHub وStripe وتواقيع HMAC-SHA-256 العامة",
        "يعيد إرسال الطلبات بأمان مع حماية من هجمات SSRF",
        "يحجب الأسرار قبل التخزين، مع مصادقة اختيارية برمز Bearer"
      ],
      longDescription:
        "يلتقط Webhook Workbench طلبات webhooks الواردة على أي قناة، ويعرض لكل طلب محتواه بعد فك ترميزه، والترويسات بعد حجب الأسرار، وأمر cURL جاهزاً لإعادة إنتاجه. وهو ملف تنفيذي واحد بلغة Go يعتمد على المكتبة القياسية وحدها، والواجهة مدمجة داخله، ولا يستمع افتراضياً إلا على localhost.\n\nيمكن التحقق من التواقيع مقابل المحتوى الملتقَط نفسه لملفات تعريف GitHub وStripe (مع نافذة استلام مدتها خمس دقائق) وHMAC-SHA-256 العام، ويُستخدم السر مرة واحدة ولا يُخزَّن أبداً. ويمكن إعادة إرسال الطلبات الملتقَطة إلى عنوان تختاره، لكن بحذر: تُرفض العناوين الخاصة وعناوين loopback والعناوين غير HTTP، ويُعاد فحص DNS عند الاتصال، وتُقيَّد عمليات إعادة التوجيه، وتُحذف ترويسات التفويض والكوكيز وhop-by-hop.\n\nيحتفظ بسجل أحداث محدود الحجم في لقطة JSON محلية، ويحفظ المحتوى الثنائي بترميز base64، ويوفّر نقطة نهاية لفحص الصحة. ويعمل إعداد Docker دون root، مع إسقاط صلاحيات Linux ونظام ملفات جذري للقراءة فقط، وتغطي الاختبارات حجب الأسرار والتحقق من التواقيع وإعادة الإرسال والحماية من SSRF.",
      problem: "تصحيح webhooks يعني غالباً إرسال بيانات حقيقية إلى خدمة فحص خارجية.",
      solution:
        "ملف تنفيذي بلغة Go على خادمك يلتقط webhooks ويتحقق منها ويعيد إرسالها بأمان، مع حجب الأسرار قبل التخزين.",
      result:
        "تغطي الاختبارات حجب الأسرار والتحقق من التواقيع وإعادة الإرسال والحماية من SSRF. ملفات تنفيذية للإصدارات مع مجاميع تحقق (checksums)، وبيئة تجريبية حيّة."
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
  const merged = t ? { ...p, ...(locale === "ru" ? typographRuDeep(t) : typographArDeep(t)) } : p;
  localizedCache.set(key, merged);
  return merged;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
