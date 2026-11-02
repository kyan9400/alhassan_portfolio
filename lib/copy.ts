import type { Locale } from "@/lib/types";
import { withBasePath } from "@/lib/base-path";

/*
 * Site copy in English, Russian and Arabic.
 * Career facts must match the CV (public/cv/Alhassan_Alfarran_CV_EN1.pdf):
 * commercial development since 2024 (freelance plus three companies); Elektroservis
 * (Apr–Oct 2026) is search with no LLM generation, not RAG; OKKP is MongoDB only, with no
 * RBAC or audit log; Russian is B2. Keep all three locales in sync when editing.
 */

/**
 * Organisation mark next to a role or degree. `monogram` is the typographic fallback (Latin initials
 * in English, Cyrillic in Russian where the name is Russian); `logo` is an optional path to a
 * monochrome logo dropped into public/images/logos/ (e.g. "/images/logos/misis.svg"). None ship yet.
 */
export type OrgMark = { monogram: string; logo?: string };

export type ExperienceItem = {
  period: string;
  /** Ongoing role: gets the "Currently" mark. */
  current?: boolean;
  title: string;
  company: string;
  mark: OrgMark;
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type EducationItem = { period: string; degree: string; school: string; mark: OrgMark };

/**
 * A certification. `verifyUrl` is the public credential link; the "Verify" link renders only when
 * it is set. Leave it empty rather than guessing a URL.
 */
/**
 * A recommendation from someone I have worked with: their own words, published with their permission.
 * `role` and `company` are theirs (e.g. "Head of IT", "Elektroservis"); `linkedin` is an optional
 * profile URL. Add the same person to all three locales (quote translated or kept in the original).
 */
export type Recommendation = { quote: string; name: string; role: string; company: string; linkedin?: string };

export type Certification = { name: string; issuer?: string; year?: string; verifyUrl?: string };

export type CopyDictionary = {
  dir: "ltr" | "rtl";
  /** [About, Services, Projects, GitHub repositories, Skills, Experience] */
  nav: string[];
  navHome: string;
  navContact: string;
  brandMonogram: string;
  brandName: string;
  heroAvailability: string;
  heroEyebrow: string;
  /** Phones only (<640px), when heroEyebrow would push the name + role block past three lines. */
  heroEyebrowShort?: string;
  heroTitle: string;
  heroHeadlineTop: string;
  heroHeadlineFocus: string;
  heroHeadlineBottom: string;
  heroPrimaryCta: string;
  /** Hero secondary button: downloads the CV PDF in the visitor's language. */
  heroSecondaryCta: string;
  heroStats: { value: string; label: string }[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsSubtitle: string;
  projectsEmpty: string;
  githubReposEyebrow: string;
  githubReposTitle: string;
  githubReposDescription: string;
  githubReposViewMore: string;
  githubReposEmpty: string;
  skillsEyebrow: string;
  skillsTitle: string;
  skillsDescription: string;
  skillsGroups: { name: string; items: string[] }[];
  experienceEyebrow: string;
  experienceTitle: string;
  experienceDescription: string;
  /** Newest first: three companies, then freelance. */
  experienceItems: ExperienceItem[];
  education: EducationItem[];
  /** Real items from the EN CV only; the site shows the relevant subset (the full list is in the CV). */
  certifications: Certification[];
  /** Spoken languages with levels (CV page). EN C1, Arabic native, Russian B2. */
  languages: { name: string; level: string }[];
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  contactEmailLabel: string;
  contactCvLabel: string;
  cvDownloads: { code: string; file: string; label: string }[];
  githubLabel: string;
  linkedinLabel: string;
  footerBuiltWith: string;
  languageLabel: string;
  /** The reply-time promise. Show it once only (Contact). */
  heroResponseTime: string;
  proofStripLabel: string;
  /** Company and university names only (muted wordmarks). */
  proofStripItems: string[];
  signature: {
    eyebrow: string;
    company: string;
    title: string;
    summary: string;
    problemTitle: string;
    problem: string;
    solutionTitle: string;
    solution: string;
    architectureTitle: string;
    architecture: { name: string; detail: string }[];
    metricsTitle: string;
    metrics: { value: string; label: string }[];
    /** Before / after bar chart: caption and the two bar labels. Relative scale, no milliseconds. */
    chart: { caption: string; before: string; after: string };
    /** Request-path line: what happens on a cache hit (returns early) and on a miss (goes to the database). */
    path: { hit: string; miss: string };
    lessonsTitle: string;
    lessons: string[];
  };
  howIWork: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; body: string }[];
  };
  skipToContent: string;
  notFoundTitle: string;
  notFoundCta: string;
  // Services section
  servicesEyebrow: string;
  servicesTitle: string;
  /** `proof` is a short "Example: …" link label pointing at the matching project or case study. */
  servicesItems: { title: string; description: string; proof: string }[];
  /** Services button: jumps to #contact with the "freelance" reason preselected. */
  servicesCta: string;
  // Available for work CTA
  availableBody: string;
  // GitHub filters & search
  githubSearchPlaceholder: string;
  // Contact
  contactFormTitle: string;
  contactFormName: string;
  contactFormEmail: string;
  contactFormMessage: string;
  contactFormSend: string;
  contactLocation: string;
  // Navbar & project detail labels
  navCvLabel: string;
  projectProblemLabel: string;
  projectSolutionLabel: string;
  /** Per-project label for `project.result`, chosen by `project.resultLabel`. */
  projectResultLabels: { result: string; status: string; builtIn: string };
  projectLiveDemo: string;
  projectViewGithubLabel: string;
  projectBackLabel: string;
  projectTechStackLabel: string;
  projectWhatItDoesLabel: string;
  /** Recommendations section (before Contact). It renders nothing while `items` is empty. */
  recommendations: {
    eyebrow: string;
    title: string;
    /** Accessible name of the LinkedIn link next to a name; "{name}" is replaced. */
    linkedinLabel: string;
    items: Recommendation[];
  };
  /** "3D web experiences" section. The site list and per-site copy live in lib/web3d.ts. */
  web3d: {
    eyebrow: string;
    title: string;
    description: string;
    /** How the scenes stay fast and accessible: four short points. */
    principles: { title: string; body: string }[];
    /** Accessible name of the principles list. */
    principlesLabel: string;
    stackLabel: string;
    /** Opens a site's live deployment. */
    openSite: string;
    /** Badge on a site whose deployment is not live yet. */
    soonBadge: string;
    /** "Show all" button; the count follows it. */
    showAll: string;
  };
};

/** Course titles are proper names, so they stay in English in every locale. */
const CERTIFICATIONS: Certification[] = [
  { name: "Server-side Development with Node.js, Express and MongoDB", issuer: "Coursera", verifyUrl: "" },
  { name: "Introduction to SQL", issuer: "Coursera, University of Michigan", verifyUrl: "" },
  { name: "Understanding and Visualizing Data with Python", issuer: "Coursera, University of Michigan", verifyUrl: "" },
  { name: "Machine Learning for All", issuer: "Coursera, University of London", verifyUrl: "" },
  { name: "Programming with Google Go Specialization", issuer: "Coursera", verifyUrl: "" }
];

const CV_FILES = {
  en: withBasePath("/cv/Alhassan_Alfarran_CV_EN1.pdf"),
  ru: withBasePath("/cv/Alhassan_Alfarran_CV_RU1.pdf"),
  ar: withBasePath("/cv/Alhassan_Alfarran_CV_AR1.pdf")
};

export const copyByLocale: Record<Locale, CopyDictionary> = {
  en: {
    dir: "ltr",
    nav: ["About", "Services", "Projects", "GitHub", "Skills", "Experience"],
    navHome: "Home",
    navContact: "Contact",
    brandMonogram: "AA",
    brandName: "Alhassan",
    heroAvailability: "Open to offers",
    heroEyebrow: "Full-Stack & Python Developer — Web & AI Systems",
    heroTitle: "Alhassan Alfarran",
    heroHeadlineTop: "Web platforms",
    heroHeadlineFocus: "& AI search,",
    heroHeadlineBottom: "built end to end.",
    heroPrimaryCta: "See my work",
    heroSecondaryCta: "Download CV",
    heroStats: [
      { value: "~60%", label: "lower avg. response time on a critical endpoint" },
      { value: "OKKP", label: "internal system for 9 vehicle depots, as lead developer" },
      { value: "0.18 s", label: "p95 search response over an engineering-document archive" },
      { value: "3", label: "languages · EN C1 · AR · RU" }
    ],
    aboutEyebrow: "About",
    aboutTitle: "Three languages. One full stack.",
    aboutBody:
      "Arabic is my first language and English (C1) my professional one. I studied in Russia — a Bachelor's at Ural Federal University in Yekaterinburg, then a Master's at NUST MISIS in Moscow. I like owning a feature end to end: the data model, the API contract, the interface and the Excel export a non-technical colleague can run on their own.",
    projectsEyebrow: "Selected work",
    projectsTitle: "Projects I've built.",
    projectsSubtitle:
      "Projects from my roles — private code, so you see the architecture — plus open-source prototypes built with AI agents, with live demos.",
    projectsEmpty: "Selected projects will appear here.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "More on GitHub",
    githubReposDescription:
      "Prototypes, experiments and earlier work — hand-picked and grouped by area. Many of the recent ones are prototypes built with AI agents (Claude Code, Codex).",
    githubReposViewMore: "Show more",
    githubReposEmpty: "No repositories to show.",
    skillsEyebrow: "Capabilities",
    skillsTitle: "Stack I reach for.",
    skillsDescription: "What I work with, grouped by layer — from interfaces to delivery.",
    skillsGroups: [
      {
        name: "Frontend",
        items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "Framer Motion"]
      },
      {
        name: "Backend",
        items: ["Python", "FastAPI", "Node.js", "Express", "REST API design", "JWT authentication", "File uploads (Multer)"]
      },
      {
        name: "Search & Documents",
        items: [
          "sentence-transformers",
          "FAISS",
          "Inverted index",
          "Hybrid search",
          "OCR (Tesseract, Poppler)",
          "PDF / Word / Excel parsing",
          "LLM / RAG (prototypes, built with AI agents)"
        ]
      },
      {
        name: "Data & Storage",
        items: ["MongoDB (Mongoose)", "Cloudinary", "SQLite / PostgreSQL (university project)", "pandas & NumPy (university projects)"]
      },
      {
        name: "Delivery & Tools",
        items: ["Git & GitHub", "Docker / Docker Compose (basic)", "GitHub Actions", "Linux (Ubuntu, systemd)", "pytest", "Vercel", "Claude Code · Cursor · Codex"]
      }
    ],
    experienceEyebrow: "Experience",
    experienceTitle: "Where I've worked.",
    experienceDescription:
      "Commercial development since 2024: three companies and freelance work — from an internal system for 9 vehicle depots to search over an engineering-document archive.",
    experienceItems: [
      {
        period: "Apr 2026 — Oct 2026",
        title: "Python Developer",
        company: "Elektroservis",
        mark: { monogram: "E" },
        location: "Remote · civil-law contracts",
        summary: "Built a semantic and full-text search service over an engineering (PTO) documentation archive; accepted by the client.",
        highlights: [
          "An engineer enters a cable mark, document code, equipment designation or a phrase and gets the document, the PDF page (Excel sheet and rows, Word section), a text fragment and the network path.",
          "Hybrid search with no LLM generation: a custom inverted index plus FAISS semantic search on sentence-transformers embeddings (all-MiniLM-L6-v2), behind FastAPI with a plain HTML/JS interface.",
          "Indexed PDF, DOCX, XLSX and RTF files — an archive of ~4.1k files, ~1.5k documents with text — with OCR of selected scanned pages (Tesseract + Poppler).",
          "Speed: code and mark queries from 9–10 s to 1.2–1.7 s, phrase queries from 55–70 s to 2–4 s; 0.18 s p95 after moving to the inverted index.",
          "Quality: 739 automated tests (pytest) and a 104-query control set with top-1/top-5 metrics. Runs as a systemd service on Ubuntu Server.",
          "Built with AI agents (Codex, Cursor, Claude Code): I gathered the requirements, wrote the agent briefs, reviewed the changes and verified them on the production index."
        ],
        stack: ["Python", "FastAPI", "sentence-transformers", "FAISS", "Tesseract OCR", "pytest", "systemd"]
      },
      {
        period: "May 2025 — Dec 2025",
        title: "Full-Stack Developer (lead developer on the project)",
        company: "Avenue Group",
        mark: { monogram: "AG" },
        location: "Moscow · team of 3",
        summary: "Lead developer of OKKP, an internal quality-control web system for a network of 9 vehicle depots.",
        highlights: [
          "Designed the architecture and API and wrote most of the code (~177 of 183 commits in 2025): React 18 + TypeScript (Vite), Node.js / Express 5, MongoDB.",
          "Violations and fines module with server-side filtering and pagination; modules for employees, driver call-backs, a Cloudinary document archive and in-app notifications.",
          "Per-depot KPI tiles and in-browser Excel export (SheetJS) of violations, employees and the depot summary; JWT sign-in.",
          "Deployment with Docker Compose on a Linux server; CI on GitHub Actions."
        ],
        stack: ["React", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Cloudinary", "Docker Compose", "GitHub Actions"]
      },
      {
        period: "Oct 2024 — Jul 2025",
        title: "Full-Stack Web Developer",
        company: "Junzi Tech Solutions",
        mark: { monogram: "JT" },
        summary: "Full-stack features for web applications with Node.js, Express, MongoDB and React.",
        highlights: ["Cut the response time of a critical API endpoint by ~60% with caching and a redesigned database query."],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "2024 — Present",
        current: true,
        title: "Freelance Developer",
        company: "Freelance",
        mark: { monogram: "F" },
        location: "Remote",
        summary: "Web applications for clients, alongside my studies and full-time roles.",
        highlights: ["React / Next.js / TypeScript and Tailwind CSS web applications for clients."],
        stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "Master's — Computer and Information Sciences",
        school: "NUST MISIS, Moscow",
        mark: { monogram: "M" }
      },
      {
        period: "2020 — 2024",
        degree: "Bachelor's — Computer Science",
        school: "Ural Federal University, Yekaterinburg",
        mark: { monogram: "U" }
      }
    ],
    certifications: CERTIFICATIONS,
    languages: [
      { name: "English", level: "C1" },
      { name: "Arabic", level: "Native" },
      { name: "Russian", level: "B2" }
    ],
    contactEyebrow: "Contact",
    contactTitle: "Hiring, or have a project? Let's talk.",
    contactDescription:
      "Hiring for a full-stack or Python role — or planning a web app, an internal tool or search over your documents? Tell me what you need. Telegram is the fastest way to reach me.",
    contactEmailLabel: "Email me",
    contactCvLabel: "Download CV",
    cvDownloads: [
      { code: "EN", label: "English", file: CV_FILES.en },
      { code: "RU", label: "Русский", file: CV_FILES.ru },
      { code: "AR", label: "العربية", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    // Rendered after the footer tagline: "Designed and built by me with Next.js, Tailwind and Framer Motion."
    footerBuiltWith: "with Next.js, Tailwind and Framer Motion",
    languageLabel: "Language",
    heroResponseTime: "I reply within 48 hours — faster on Telegram.",
    proofStripLabel: "Experience and education",
    proofStripItems: ["Elektroservis", "Avenue Group", "Junzi Tech Solutions", "NUST MISIS", "Ural Federal University"],
    signature: {
      eyebrow: "Performance deep dive",
      company: "Junzi Tech Solutions",
      title: "Cutting a critical endpoint's response time by ~60%.",
      summary:
        "Queries first, cache second: I refactored the MongoDB queries behind a critical Node.js / Express endpoint, then cached repeated reads, without changing its response contract.",
      problemTitle: "Problem",
      problem:
        "A critical endpoint in a client web application (Node.js / Express on MongoDB, React front end) was too slow, and the fix had to keep its response contract unchanged.",
      solutionTitle: "Solution",
      solution:
        "I refactored the database queries behind the endpoint and added a caching layer for repeated reads. Validation, error handling and the response contract stayed consistent with the rest of the REST API.",
      architectureTitle: "Architecture",
      architecture: [
        { name: "Client", detail: "React front end." },
        { name: "API", detail: "Node.js / Express endpoint with consistent validation and error handling." },
        { name: "Cache", detail: "Caching layer for repeated reads." },
        { name: "Data", detail: "Refactored MongoDB queries." }
      ],
      metricsTitle: "Result",
      metrics: [{ value: "~60%", label: "lower average response time on a critical API endpoint" }],
      chart: {
        caption: "Average response time, critical endpoint (relative scale)",
        before: "Before",
        after: "After"
      },
      path: { hit: "hit · returns early", miss: "miss" },
      lessonsTitle: "How I approach performance work",
      lessons: [
        "Measure first — the real cost is rarely where you look first.",
        "Fix the query, then cache: a cache on top of a slow query only hides the problem.",
        "Keep the response contract stable, so a performance fix ships like any other change."
      ]
    },
    howIWork: {
      eyebrow: "How I work",
      title: "A small set of habits, applied consistently.",
      description: "No process theatre — just the habits I rely on.",
      items: [
        {
          title: "Code review",
          body: "Small, focused diffs. I comment on intent and trade-offs, not style, and block on correctness and clarity — not taste."
        },
        {
          title: "Definition of done",
          body: "Tested behaviour, visible in production, documented for the next person, no known sharp edges left behind."
        },
        {
          title: "When things break",
          body: "Contain the problem first, then write down honestly what happened. The fix is the easy part — changing the system so it doesn't repeat is the work."
        },
        {
          title: "Documentation",
          body: "A short README per service: what it does, how to run it, where it can break. Updated with the change, not after."
        }
      ]
    },
    skipToContent: "Skip to content",
    notFoundTitle: "Page not found",
    notFoundCta: "Back to home",
    servicesEyebrow: "Services",
    servicesTitle: "What I can build for you.",
    servicesItems: [
      {
        title: "Full-stack web platforms",
        description: "Admin panels and internal tools with authentication, server-side filtering, file uploads and clean REST APIs — like OKKP.",
        proof: "Example: OKKP"
      },
      {
        title: "Document search",
        description: "Search over PDF, Word, Excel and RTF archives: OCR for scans, an inverted index plus semantic search, FastAPI services.",
        proof: "Example: engineering document search"
      },
      {
        title: "Dashboards & reporting",
        description: "KPI tiles, filterable tables and Excel exports your team can use without asking a developer.",
        proof: "Example: OKKP reporting"
      },
      {
        title: "API performance & backend",
        description: "Profiling slow endpoints, caching and query refactoring, consistent validation and error handling.",
        proof: "Example: the ~60% case study"
      },
      {
        title: "Multilingual & RTL interfaces",
        description: "English, Russian and Arabic UIs with real right-to-left layouts, like this site.",
        proof: "Example: Smart Platform (EN / AR)"
      }
    ],
    servicesCta: "Discuss a project",
    availableBody:
      "For teams that need an internal platform, a reporting dashboard or search over their own documents — designed and built end to end, from the database to the UI. Contract or freelance, remote or in Moscow.",
    githubSearchPlaceholder: "Search repositories…",
    contactFormTitle: "Send a message",
    contactFormName: "Your name",
    contactFormEmail: "Your email",
    contactFormMessage: "Your message",
    contactFormSend: "Send message",
    contactLocation: "Moscow · on-site / hybrid / remote",
    navCvLabel: "CV",
    projectProblemLabel: "Problem",
    projectSolutionLabel: "Solution",
    projectResultLabels: { result: "Result", status: "Status", builtIn: "Built in" },
    projectLiveDemo: "Live demo",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "Back to projects",
    projectTechStackLabel: "Tech stack",
    projectWhatItDoesLabel: "What it does",
    recommendations: {
      eyebrow: "Recommendations",
      title: "In their words.",
      linkedinLabel: "{name} on LinkedIn",
      items: []
    },
    web3d: {
      eyebrow: "3D web",
      title: "3D web experiences",
      description:
        "Real-time 3D sites for brands, built performance-first. Every model, shader and particle is made in code — there are no model files to download.",
      principlesLabel: "How the scenes stay fast",
      principles: [
        { title: "Render on demand", body: "A frame is drawn only when something changes, so an idle page costs almost nothing." },
        { title: "Adaptive quality", body: "Resolution and effects scale to the device to keep motion smooth, phones included." },
        { title: "Reduced motion", body: "With reduced motion turned on, scenes settle into a still view that stays fully usable." },
        { title: "Made in code", body: "Geometry, shaders and particles are procedural: nothing to load but the code itself." }
      ],
      stackLabel: "Stack",
      openSite: "Open site",
      soonBadge: "Launching soon",
      showAll: "Show all"
    }
  },
  ru: {
    dir: "ltr",
    nav: ["Обо мне", "Услуги", "Проекты", "GitHub", "Навыки", "Опыт"],
    navHome: "Главная",
    navContact: "Контакты",
    brandMonogram: "АА",
    brandName: "Альхассан",
    heroAvailability: "Открыт к предложениям",
    heroEyebrow: "Full-stack / Python-разработчик — веб- и AI-системы",
    heroEyebrowShort: "Full-stack / Python-разработчик",
    heroTitle: "Альхассан Альфарран",
    heroHeadlineTop: "Веб-платформы",
    heroHeadlineFocus: "и AI-поиск",
    heroHeadlineBottom: "от идеи до продакшена.",
    heroPrimaryCta: "Смотреть проекты",
    heroSecondaryCta: "Скачать резюме",
    heroStats: [
      { value: "~60%", label: "сокращение среднего времени ответа критичного эндпоинта" },
      { value: "OKKP", label: "внутренняя система для 9 автопарков, ведущий разработчик" },
      { value: "0,18 с", label: "p95 ответа поиска по архиву технической документации" },
      { value: "3", label: "языка · EN C1 · AR · RU" }
    ],
    aboutEyebrow: "Обо мне",
    aboutTitle: "Три языка — один стек.",
    aboutBody:
      "Арабский — мой родной язык, английский (C1) — профессиональный. Учился в России: бакалавриат в УрФУ (Екатеринбург), затем магистратура в НИТУ МИСИС (Москва). Мне нравится отвечать за фичу целиком: модель данных, контракт API, интерфейс и Excel-выгрузку, которую сотрудник без технических навыков сделает сам.",
    projectsEyebrow: "Избранное",
    projectsTitle: "Что я сделал.",
    projectsSubtitle:
      "Коммерческие проекты — код закрыт, поэтому показываю архитектуру, — и open-source-прототипы, сделанные с AI-агентами, с онлайн-демо.",
    projectsEmpty: "Здесь появятся избранные проекты.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "Ещё на GitHub",
    githubReposDescription:
      "Прототипы, эксперименты и ранние проекты — отобраны вручную и разложены по направлениям. Многие из недавних — прототипы, сделанные с AI-агентами (Claude Code, Codex).",
    githubReposViewMore: "Показать ещё",
    githubReposEmpty: "Нет репозиториев для показа.",
    skillsEyebrow: "Навыки",
    skillsTitle: "Мой стек.",
    skillsDescription: "С чем я работаю — по слоям, от интерфейсов до поставки.",
    skillsGroups: [
      {
        name: "Фронтенд",
        items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "Framer Motion"]
      },
      {
        name: "Бэкенд",
        items: ["Python", "FastAPI", "Node.js", "Express", "Проектирование REST API", "JWT-аутентификация", "Загрузка файлов (Multer)"]
      },
      {
        name: "Поиск и документы",
        items: [
          "sentence-transformers",
          "FAISS",
          "Инвертированный индекс",
          "Гибридный поиск",
          "OCR (Tesseract, Poppler)",
          "Парсинг PDF / Word / Excel",
          "LLM / RAG (прототипы, сделаны с AI-агентами)"
        ]
      },
      {
        name: "Данные и хранение",
        items: ["MongoDB (Mongoose)", "Cloudinary", "SQLite / PostgreSQL (учебный проект)", "pandas и NumPy (учебные проекты)"]
      },
      {
        name: "Поставка и инструменты",
        items: ["Git и GitHub", "Docker / Docker Compose (базовый)", "GitHub Actions", "Linux (Ubuntu, systemd)", "pytest", "Vercel", "Claude Code · Cursor · Codex"]
      }
    ],
    experienceEyebrow: "Опыт",
    experienceTitle: "Где я работал.",
    experienceDescription:
      "Коммерческая разработка с 2024 года: три компании и фриланс — от внутренней системы для 9 автопарков до поиска по архиву технической документации.",
    experienceItems: [
      {
        period: "Апрель 2026 — октябрь 2026",
        title: "Python-разработчик",
        company: "Электросервис",
        mark: { monogram: "Э" },
        location: "Удалённо · договоры ГПХ",
        summary: "Сделал веб-сервис семантического и полнотекстового поиска по архиву документации ПТО; работа принята заказчиком.",
        highlights: [
          "Инженер вводит марку кабеля, шифр, обозначение оборудования или фразу и получает документ, страницу PDF (лист и строки Excel, раздел Word), фрагмент текста и сетевой путь.",
          "Гибридный поиск без генерации LLM: собственный инвертированный индекс плюс семантический поиск FAISS на эмбеддингах sentence-transformers (all-MiniLM-L6-v2); бэкенд на FastAPI, интерфейс на HTML/JS без фреймворков.",
          "Индексация PDF, DOCX, XLSX и RTF: архив около 4,1 тыс. файлов, около 1,5 тыс. документов с текстом; OCR выбранных страниц сканов (Tesseract + Poppler).",
          "Скорость: запросы по шифрам и маркам — с 9–10 с до 1,2–1,7 с, фразовые — с 55–70 с до 2–4 с; после перехода на инвертированный индекс p95 — 0,18 с.",
          "Качество: 739 автотестов (pytest) и контрольный набор из 104 запросов с метриками top-1/top-5. Работает как служба systemd на Ubuntu Server.",
          "Работал с AI-агентами (Codex, Cursor, Claude Code): собирал требования, писал ТЗ для агентов, ревьюил изменения и проверял их на рабочем индексе."
        ],
        stack: ["Python", "FastAPI", "sentence-transformers", "FAISS", "Tesseract OCR", "pytest", "systemd"]
      },
      {
        period: "Май 2025 — декабрь 2025",
        title: "Fullstack-разработчик (ведущий разработчик проекта)",
        company: "Avenue Group",
        mark: { monogram: "AG" },
        location: "Москва · команда из 3 человек",
        summary: "Ведущий разработчик OKKP —внутренней веб-системы контроля качества для сети из 9 автопарков.",
        highlights: [
          "Спроектировал архитектуру и API и написал большую часть кода (≈177 из 183 коммитов 2025 года): React 18 + TypeScript (Vite), Node.js / Express 5, MongoDB.",
          "Модуль нарушений и штрафов с серверной фильтрацией и пагинацией; модули сотрудников, обзвона водителей, электронного архива (Cloudinary) и внутренних уведомлений.",
          "KPI-карточки по паркам и экспорт в Excel прямо в браузере (SheetJS): нарушения, сотрудники, сводка по паркам; JWT-аутентификация.",
          "Деплой через Docker Compose на Linux-сервере; CI на GitHub Actions."
        ],
        stack: ["React", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Cloudinary", "Docker Compose", "GitHub Actions"]
      },
      {
        period: "Октябрь 2024 — июль 2025",
        title: "Full-stack веб-разработчик",
        company: "Junzi Tech Solutions",
        mark: { monogram: "JT" },
        summary: "Full-stack-функциональность веб-приложений на Node.js, Express, MongoDB и React.",
        highlights: ["Сократил время ответа критичной точки API примерно на 60% (кеширование и переработка запроса к базе)."],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "2024 — сейчас",
        current: true,
        title: "Фриланс-разработчик",
        company: "Фриланс",
        mark: { monogram: "Ф" },
        location: "Удалённо",
        summary: "Веб-приложения для заказчиков — параллельно с учёбой и основной работой.",
        highlights: ["Веб-приложения на React / Next.js / TypeScript и Tailwind CSS для заказчиков."],
        stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "Магистратура — компьютерные и информационные науки",
        school: "НИТУ МИСИС, Москва",
        mark: { monogram: "М" }
      },
      {
        period: "2020 — 2024",
        degree: "Бакалавриат — информатика и вычислительная техника",
        school: "Уральский федеральный университет (УрФУ), Екатеринбург",
        mark: { monogram: "У" }
      }
    ],
    certifications: CERTIFICATIONS,
    languages: [
      { name: "Английский", level: "C1" },
      { name: "Арабский", level: "родной" },
      { name: "Русский", level: "B2" }
    ],
    contactEyebrow: "Контакты",
    contactTitle: "Вакансия или проект? Давайте обсудим.",
    contactDescription:
      "Ищете full-stack- или Python-разработчика — или планируете веб-приложение, внутреннюю систему или поиск по документам? Расскажите, что нужно. Быстрее всего — в Telegram.",
    contactEmailLabel: "Напишите мне",
    contactCvLabel: "Скачать резюме",
    cvDownloads: [
      { code: "EN", label: "Английский", file: CV_FILES.en },
      { code: "RU", label: "Русский", file: CV_FILES.ru },
      { code: "AR", label: "Арабский", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    footerBuiltWith: "Стек сайта: Next.js, Tailwind и Framer Motion",
    languageLabel: "Язык",
    heroResponseTime: "Отвечаю в течение 48 часов, в Telegram — быстрее.",
    proofStripLabel: "Опыт и образование",
    proofStripItems: ["Электросервис", "Avenue Group", "Junzi Tech Solutions", "НИТУ МИСИС", "УрФУ"],
    signature: {
      eyebrow: "Разбор производительности",
      company: "Junzi Tech Solutions",
      title: "Время ответа критичного эндпоинта — на ~60% меньше.",
      summary:
        "Сначала запросы, потом кеш: я переработал запросы к MongoDB за критичным эндпоинтом на Node.js / Express, а затем закешировал повторяющиеся чтения — не меняя контракт ответа.",
      problemTitle: "Задача",
      problem:
        "Критичный эндпоинт клиентского веб-приложения (Node.js / Express на MongoDB, фронтенд на React) отвечал слишком медленно, а исправление не должно было менять его контракт ответа.",
      solutionTitle: "Решение",
      solution:
        "Переработал запросы к базе за эндпоинтом и добавил слой кеширования для повторяющихся чтений. Валидация, обработка ошибок и контракт ответа остались такими же, как во всём REST API.",
      architectureTitle: "Архитектура",
      architecture: [
        { name: "Клиент", detail: "Фронтенд на React." },
        { name: "API", detail: "Эндпоинт на Node.js / Express с единой валидацией и обработкой ошибок." },
        { name: "Кеш", detail: "Слой кеширования для повторяющихся чтений." },
        { name: "Данные", detail: "Переработанные запросы к MongoDB." }
      ],
      metricsTitle: "Результат",
      metrics: [{ value: "~60%", label: "снижение среднего времени ответа критичного эндпоинта API" }],
      chart: {
        caption: "Среднее время ответа критичного эндпоинта (относительная шкала)",
        before: "До",
        after: "После"
      },
      path: { hit: "есть в кеше · ответ сразу", miss: "нет в кеше" },
      lessonsTitle: "Как я подхожу к оптимизации",
      lessons: [
        "Сначала измерить: узкое место редко там, куда смотришь в первую очередь.",
        "Сначала исправить запрос, потом кешировать: кеш поверх медленного запроса лишь прячет проблему.",
        "Держать контракт ответа стабильным, чтобы оптимизация выкатывалась как обычное изменение."
      ]
    },
    howIWork: {
      eyebrow: "Как я работаю",
      title: "Несколько привычек, которым я следую всегда.",
      description: "Без процессного театра — только привычки, на которые я опираюсь.",
      items: [
        {
          title: "Код-ревью",
          body: "Небольшие сфокусированные диффы. Обсуждаю замысел и компромиссы, а не стиль; блокирую мерж из-за ошибок и неясности, а не из-за вкусовщины."
        },
        {
          title: "Definition of Done",
          body: "Поведение покрыто тестами, видно в продакшене и описано для коллег; известных подводных камней не остаётся."
        },
        {
          title: "Когда что-то ломается",
          body: "Сначала локализовать проблему, потом честно разобрать, что произошло. Исправить баг — простая часть; настоящая работа — изменить систему, чтобы он не повторился."
        },
        {
          title: "Документация",
          body: "Короткий README на каждый сервис: что делает, как запустить, где может сломаться. Обновляется вместе с изменением, а не потом."
        }
      ]
    },
    skipToContent: "Перейти к содержимому",
    notFoundTitle: "Страница не найдена",
    notFoundCta: "На главную",
    servicesEyebrow: "Услуги",
    servicesTitle: "Что я могу сделать для вас.",
    servicesItems: [
      {
        title: "Full-stack веб-платформы",
        description: "Админ-панели и внутренние системы с авторизацией, серверной фильтрацией, загрузкой файлов и аккуратным REST API — как OKKP.",
        proof: "Пример: OKKP"
      },
      {
        title: "Поиск по документам",
        description: "Поиск по архивам PDF, Word, Excel и RTF: OCR для сканов, инвертированный индекс плюс семантический поиск, сервисы на FastAPI.",
        proof: "Пример: поиск по технической документации"
      },
      {
        title: "Дашборды и отчётность",
        description: "KPI-карточки, таблицы с фильтрами и выгрузки в Excel, которыми команда пользуется без помощи разработчика.",
        proof: "Пример: отчётность в OKKP"
      },
      {
        title: "Бэкенд и производительность API",
        description: "Поиск медленных эндпоинтов, кеширование и переработка запросов, единая валидация и обработка ошибок.",
        proof: "Пример: кейс с ускорением на ~60%"
      },
      {
        title: "Многоязычные интерфейсы и RTL",
        description: "Английский, русский и арабский, с настоящей вёрсткой справа налево, как на этом сайте.",
        proof: "Пример: Smart Platform (EN / AR)"
      }
    ],
    servicesCta: "Обсудить проект",
    availableBody:
      "Для команд, которым нужна внутренняя платформа, дашборд с отчётностью или поиск по собственным документам, — полный цикл: от базы данных до интерфейса. Контракт или фриланс, удалённо или в Москве.",
    githubSearchPlaceholder: "Поиск по репозиториям…",
    contactFormTitle: "Написать сообщение",
    contactFormName: "Ваше имя",
    contactFormEmail: "Ваш email",
    contactFormMessage: "Сообщение",
    contactFormSend: "Отправить",
    contactLocation: "Москва · офис / гибрид / удалённо",
    navCvLabel: "Резюме",
    projectProblemLabel: "Задача",
    projectSolutionLabel: "Решение",
    projectResultLabels: { result: "Результат", status: "Статус", builtIn: "Под капотом" },
    projectLiveDemo: "Демо",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "Назад к проектам",
    projectTechStackLabel: "Стек",
    projectWhatItDoesLabel: "Что делает",
    recommendations: {
      eyebrow: "Рекомендации",
      title: "Что говорят коллеги.",
      linkedinLabel: "{name} в LinkedIn",
      items: []
    },
    web3d: {
      eyebrow: "3D для веба",
      title: "Интерактивные 3D-сайты",
      description:
        "Сайты для брендов с 3D-графикой в реальном времени, где производительность на первом месте. Все модели, шейдеры и частицы созданы кодом — никаких файлов моделей для загрузки.",
      principlesLabel: "Как сцены остаются быстрыми",
      principles: [
        { title: "Рендер по требованию", body: "Кадр отрисовывается, только когда что-то меняется, поэтому страница в покое почти не нагружает устройство." },
        { title: "Адаптивное качество", body: "Разрешение и эффекты подстраиваются под устройство, чтобы анимация оставалась плавной и на телефонах." },
        { title: "Уменьшение движения", body: "Если в системе включено уменьшение движения, сцена показывается статично и остаётся полностью рабочей." },
        { title: "Всё в коде", body: "Геометрия, шейдеры и частицы процедурные: загружается только сам код." }
      ],
      stackLabel: "Стек",
      openSite: "Открыть сайт",
      soonBadge: "Скоро запуск",
      showAll: "Показать все"
    }
  },
  ar: {
    dir: "rtl",
    nav: ["نبذة", "الخدمات", "المشاريع", "GitHub", "المهارات", "الخبرة"],
    navHome: "الرئيسية",
    navContact: "تواصل",
    // The logo mark stays the Latin initials in every locale: "حا" did not read as initials.
    brandMonogram: "AA",
    brandName: "الحسن",
    heroAvailability: "منفتح على عروض العمل",
    heroEyebrow: "مطوّر Full-Stack وPython — أنظمة الويب والذكاء الاصطناعي",
    heroTitle: "الحسن الفران",
    // The middle line is nowrap: kept short so it fits a 390px phone.
    heroHeadlineTop: "منصات ويب",
    heroHeadlineFocus: "وبحث ذكي",
    heroHeadlineBottom: "من الفكرة حتى الإطلاق.",
    heroPrimaryCta: "شاهد أعمالي",
    heroSecondaryCta: "تحميل السيرة الذاتية",
    heroStats: [
      { value: "~60%", label: "انخفاض متوسط زمن استجابة نقطة نهاية API حرجة" },
      { value: "OKKP", label: "نظام داخلي لـ 9 مرائب مركبات، بصفتي المطوّر الرئيسي" },
      { value: "0.18 ث", label: "زمن استجابة البحث (p95) في أرشيف الوثائق الهندسية" },
      { value: "3", label: "لغات · العربية · الإنجليزية C1 · الروسية" }
    ],
    aboutEyebrow: "نبذة",
    aboutTitle: "ثلاث لغات — وحزمة تقنية واحدة.",
    aboutBody:
      "العربية لغتي الأم، والإنجليزية (C1) لغتي المهنية. درستُ في روسيا: البكالوريوس في جامعة الأورال الفيدرالية في يكاترينبورغ، ثم الماجستير في جامعة MISIS في موسكو. أحبّ أن أتولّى الميزة كاملة: نموذج البيانات، وعقد الواجهة البرمجية، والواجهة، وتصدير Excel يستطيع زميل غير تقني إعداده بنفسه.",
    projectsEyebrow: "أعمال مختارة",
    projectsTitle: "مشاريع بنيتها.",
    projectsSubtitle:
      "مشاريع من عملي — الكود خاص، لذا أعرض البنية — إلى جانب نماذج أولية مفتوحة المصدر بنيتها بمساعدة وكلاء الذكاء الاصطناعي، مع عروض حية.",
    projectsEmpty: "ستُعرض المشاريع المختارة هنا.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "المزيد على GitHub",
    githubReposDescription:
      "نماذج أولية وتجارب وأعمال سابقة — منتقاة بعناية ومصنّفة حسب المجال. كثير من أحدثها نماذج أولية بُنيت بمساعدة وكلاء الذكاء الاصطناعي (Claude Code وCodex).",
    githubReposViewMore: "عرض المزيد",
    githubReposEmpty: "لا توجد مستودعات للعرض.",
    skillsEyebrow: "المهارات",
    skillsTitle: "الأدوات التي أعتمد عليها.",
    skillsDescription: "ما أعمل به، مصنّفاً حسب الطبقة — من الواجهات إلى التسليم.",
    skillsGroups: [
      {
        name: "الواجهات الأمامية",
        items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "Framer Motion"]
      },
      {
        name: "الخدمات الخلفية",
        items: ["Python", "FastAPI", "Node.js", "Express", "تصميم REST API", "مصادقة JWT", "رفع الملفات (Multer)"]
      },
      {
        name: "البحث والمستندات",
        items: [
          "sentence-transformers",
          "FAISS",
          "الفهرس المقلوب",
          "البحث الهجين",
          "OCR (Tesseract وPoppler)",
          "تحليل ملفات PDF / Word / Excel",
          "LLM / RAG (نماذج أولية بُنيت بمساعدة وكلاء الذكاء الاصطناعي)"
        ]
      },
      {
        name: "البيانات والتخزين",
        items: ["MongoDB (Mongoose)", "Cloudinary", "SQLite / PostgreSQL (مشروع جامعي)", "pandas وNumPy (مشاريع جامعية)"]
      },
      {
        name: "التسليم والأدوات",
        items: ["Git وGitHub", "Docker / Docker Compose (مستوى أساسي)", "GitHub Actions", "Linux (Ubuntu وsystemd)", "pytest", "Vercel", "Claude Code · Cursor · Codex"]
      }
    ],
    experienceEyebrow: "الخبرة",
    experienceTitle: "مسيرتي المهنية.",
    experienceDescription:
      "تطوير تجاري منذ 2024: ثلاث شركات وعمل حر — من نظام داخلي لـ 9 مرائب مركبات إلى البحث في أرشيف الوثائق الهندسية.",
    experienceItems: [
      {
        period: "أبريل 2026 — أكتوبر 2026",
        title: "مطوّر Python",
        company: "Elektroservis",
        mark: { monogram: "E" },
        location: "عن بُعد · عقود مدنية",
        summary: "بنيتُ خدمة ويب للبحث الدلالي والنصي الكامل في أرشيف الوثائق الهندسية (قسم PTO)، وقبِلها العميل.",
        highlights: [
          "يُدخل المهندس رمز كابل أو رمز وثيقة أو تسمية معدّة أو عبارة، فيحصل على الوثيقة وصفحة PDF (أو ورقة Excel وصفوفها، أو قسم Word) ومقتطف من النص والمسار الشبكي.",
          "بحث هجين دون توليد نصوص بنماذج LLM: فهرس مقلوب خاص بالمشروع مع بحث دلالي عبر FAISS على تضمينات sentence-transformers ‏(all-MiniLM-L6-v2)، وخلفية FastAPI وواجهة HTML/JS دون أطر عمل.",
          "فهرسة ملفات PDF وDOCX وXLSX وRTF: أرشيف من نحو 4.1 ألف ملف، منها نحو 1.5 ألف وثيقة تحتوي نصاً، مع OCR لصفحات مختارة من المستندات الممسوحة (Tesseract + Poppler).",
          "السرعة: استعلامات الرموز من 9–10 ثوانٍ إلى 1.2–1.7 ثانية، والاستعلامات النصية من 55–70 ثانية إلى 2–4 ثوانٍ؛ وزمن p95 بلغ 0.18 ثانية بعد الانتقال إلى الفهرس المقلوب.",
          "الجودة: 739 اختباراً آلياً (pytest) ومجموعة تحكّم من 104 استعلامات بمقاييس top-1/top-5. تعمل الخدمة عبر systemd على Ubuntu Server.",
          "عملتُ بمساعدة وكلاء الذكاء الاصطناعي (Codex وCursor وClaude Code): جمعتُ المتطلبات وكتبتُ المهام للوكلاء وراجعتُ التغييرات وتحقّقتُ منها على الفهرس الفعلي."
        ],
        stack: ["Python", "FastAPI", "sentence-transformers", "FAISS", "Tesseract OCR", "pytest", "systemd"]
      },
      {
        period: "مايو 2025 — ديسمبر 2025",
        title: "مطوّر Full-Stack (المطوّر الرئيسي للمشروع)",
        company: "Avenue Group",
        mark: { monogram: "AG" },
        location: "موسكو · فريق من 3 أشخاص",
        summary: "المطوّر الرئيسي لنظام OKKP، وهو نظام ويب داخلي لمراقبة الجودة في شبكة من 9 مرائب مركبات.",
        highlights: [
          "صمّمتُ البنية والواجهة البرمجية وكتبتُ معظم الكود (نحو 177 من 183 إيداعاً في 2025): React 18 + TypeScript ‏(Vite)، وNode.js / Express 5، وMongoDB.",
          "وحدة المخالفات والغرامات مع تصفية وترقيم صفحات من جهة الخادم، ووحدات للموظفين ومتابعة اتصالات السائقين وأرشيف وثائق على Cloudinary وإشعارات داخلية.",
          "بطاقات مؤشرات KPI لكل مرأب وتصدير إلى Excel داخل المتصفح (SheetJS) للمخالفات والموظفين وملخّص المرائب، ومصادقة JWT.",
          "النشر عبر Docker Compose على خادم Linux، وCI على GitHub Actions."
        ],
        stack: ["React", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Cloudinary", "Docker Compose", "GitHub Actions"]
      },
      {
        period: "أكتوبر 2024 — يوليو 2025",
        title: "مطوّر ويب Full-Stack",
        company: "Junzi Tech Solutions",
        mark: { monogram: "JT" },
        summary: "ميزات متكاملة لتطبيقات ويب على Node.js وExpress وMongoDB وReact.",
        highlights: ["خفّضتُ زمن استجابة نقطة نهاية API حرجة بنحو 60% (تخزين مؤقت وإعادة تصميم استعلام قاعدة البيانات)."],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "2024 — حتى الآن",
        current: true,
        title: "مطوّر مستقل",
        company: "عمل حر",
        mark: { monogram: "ع" },
        location: "عن بُعد",
        summary: "تطبيقات ويب للعملاء، بالتوازي مع الدراسة والعمل بدوام كامل.",
        highlights: ["تطبيقات ويب على React / Next.js / TypeScript وTailwind CSS للعملاء."],
        stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "ماجستير — علوم الحاسوب والمعلومات",
        school: "الجامعة الوطنية للعلوم والتكنولوجيا MISIS، موسكو",
        mark: { monogram: "M" }
      },
      {
        period: "2020 — 2024",
        degree: "بكالوريوس — علوم الحاسوب",
        school: "جامعة الأورال الفيدرالية، يكاترينبورغ",
        mark: { monogram: "U" }
      }
    ],
    certifications: CERTIFICATIONS,
    languages: [
      { name: "الإنجليزية", level: "C1" },
      { name: "العربية", level: "اللغة الأم" },
      { name: "الروسية", level: "B2" }
    ],
    contactEyebrow: "تواصل",
    contactTitle: "توظيف أو مشروع؟ لنتحدث.",
    contactDescription:
      "تبحث عن مطوّر Full-Stack أو Python — أو تخطّط لتطبيق ويب أو نظام داخلي أو بحث في مستنداتك؟ أخبرني بما تحتاجه. أسرع طريقة للتواصل معي هي Telegram.",
    contactEmailLabel: "راسلني",
    contactCvLabel: "تحميل السيرة الذاتية",
    cvDownloads: [
      { code: "EN", label: "الإنجليزية", file: CV_FILES.en },
      { code: "RU", label: "الروسية", file: CV_FILES.ru },
      { code: "AR", label: "العربية", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    footerBuiltWith: "التقنيات: Next.js وTailwind وFramer Motion",
    languageLabel: "اللغة",
    heroResponseTime: "أردّ خلال 48 ساعة — وأسرع عبر Telegram.",
    proofStripLabel: "الخبرة والتعليم",
    proofStripItems: ["Elektroservis", "Avenue Group", "Junzi Tech Solutions", "جامعة MISIS", "جامعة الأورال الفيدرالية"],
    signature: {
      eyebrow: "تحليل الأداء بالتفصيل",
      company: "Junzi Tech Solutions",
      title: "خفّضت زمن استجابة نقطة نهاية API حرجة بنحو 60%.",
      summary:
        "الاستعلامات أولاً ثم التخزين المؤقت: أعدتُ هيكلة استعلامات MongoDB خلف نقطة نهاية حرجة على Node.js / Express، ثم خزّنتُ القراءات المتكررة مؤقتاً، دون تغيير عقد استجابتها.",
      problemTitle: "المشكلة",
      problem:
        "كانت نقطة نهاية حرجة في تطبيق ويب لأحد العملاء (Node.js / Express على MongoDB، وواجهة أمامية على React) بطيئة، وكان على الإصلاح أن يُبقي عقد استجابتها كما هو.",
      solutionTitle: "الحل",
      solution:
        "أعدت هيكلة استعلامات قاعدة البيانات خلف نقطة النهاية، وأضفت طبقة تخزين مؤقت للقراءات المتكررة. وبقي التحقق من المدخلات ومعالجة الأخطاء وعقد الاستجابة متسقاً مع بقية واجهة REST API.",
      architectureTitle: "البنية",
      architecture: [
        { name: "العميل", detail: "واجهة أمامية مبنية على React." },
        { name: "API", detail: "نقطة نهاية Node.js / Express بتحقق موحّد ومعالجة متسقة للأخطاء." },
        { name: "التخزين المؤقت", detail: "طبقة تخزين مؤقت للقراءات المتكررة." },
        { name: "البيانات", detail: "استعلامات MongoDB مُعاد هيكلتها." }
      ],
      metricsTitle: "النتيجة",
      metrics: [{ value: "~60%", label: "انخفاض في متوسط زمن استجابة نقطة نهاية API حرجة" }],
      chart: {
        caption: "متوسط زمن الاستجابة لنقطة نهاية API حرجة (مقياس نسبي)",
        before: "قبل",
        after: "بعد"
      },
      path: { hit: "موجودة مؤقتاً · رد فوري", miss: "غير موجودة" },
      lessonsTitle: "كيف أتعامل مع تحسين الأداء",
      lessons: [
        "أقيس أولاً — فالتكلفة الحقيقية نادراً ما تكون حيث ننظر أولاً.",
        "أُصلح الاستعلام أولاً ثم أضيف التخزين المؤقت؛ فالتخزين المؤقت فوق استعلام بطيء لا يفعل سوى إخفاء المشكلة.",
        "أحافظ على ثبات عقد الاستجابة، كي يُنشر تحسين الأداء كأي تغيير عادي."
      ]
    },
    howIWork: {
      eyebrow: "كيف أعمل",
      title: "عادات قليلة أطبّقها باستمرار.",
      description: "بلا مظاهر إجرائية — فقط العادات التي أعتمد عليها.",
      items: [
        {
          title: "مراجعة الكود",
          body: "تغييرات صغيرة ومركّزة. أعلّق على الغاية والمفاضلات لا على الأسلوب، وأعترض على الدمج بسبب الأخطاء أو الغموض، لا بسبب الذوق الشخصي."
        },
        {
          title: "تعريف الإنجاز",
          body: "سلوك مُختبَر، ظاهر في بيئة الإنتاج، وموثَّق لمن يأتي بعدي، دون مشكلات معروفة عالقة."
        },
        {
          title: "عندما يتعطّل شيء",
          body: "أحتوي المشكلة أولاً، ثم أوثّق بصدق ما حدث. الإصلاح هو الجزء السهل؛ العمل الحقيقي أن أغيّر النظام كي لا تتكرر."
        },
        {
          title: "التوثيق",
          body: "ملف README قصير لكل خدمة: ماذا تفعل، وكيف تُشغَّل، وأين قد تتعطّل. يُحدَّث مع التغيير لا بعده."
        }
      ]
    },
    skipToContent: "انتقل إلى المحتوى",
    notFoundTitle: "الصفحة غير موجودة",
    notFoundCta: "العودة إلى الرئيسية",
    servicesEyebrow: "الخدمات",
    servicesTitle: "ما يمكنني بناؤه لك.",
    servicesItems: [
      {
        title: "منصات ويب متكاملة",
        description: "لوحات إدارة وأدوات داخلية بمصادقة وتصفية من جهة الخادم ورفع للملفات وواجهات REST API واضحة — مثل OKKP.",
        proof: "مثال: OKKP"
      },
      {
        title: "البحث في المستندات",
        description: "بحث في أرشيفات PDF وWord وExcel وRTF: OCR للمستندات الممسوحة، وفهرس مقلوب مع بحث دلالي، وخدمات على FastAPI.",
        proof: "مثال: البحث في الوثائق الهندسية"
      },
      {
        title: "لوحات مؤشرات وتقارير",
        description: "بطاقات KPI وجداول قابلة للتصفية وتصدير إلى Excel يستخدمها فريقك دون الحاجة إلى مطوّر.",
        proof: "مثال: التقارير في OKKP"
      },
      {
        title: "أداء API والخدمات الخلفية",
        description: "تحليل نقاط النهاية البطيئة، والتخزين المؤقت، وإعادة هيكلة الاستعلامات، وتحقق موحّد ومعالجة متسقة للأخطاء.",
        proof: "مثال: دراسة حالة تحسين الأداء (~60%)"
      },
      {
        title: "واجهات متعددة اللغات ودعم RTL",
        description: "الإنجليزية والروسية والعربية، بتخطيط حقيقي من اليمين إلى اليسار، كما في هذا الموقع.",
        proof: "مثال: Smart Platform (EN / AR)"
      }
    ],
    servicesCta: "لنناقش مشروعك",
    availableBody:
      "للفرق التي تحتاج إلى منصة داخلية أو لوحة تقارير أو بحث في مستنداتها الخاصة — تصميم وتنفيذ متكامل من قاعدة البيانات إلى الواجهة. بعقد أو عمل حر، عن بُعد أو في موسكو.",
    githubSearchPlaceholder: "ابحث في المستودعات…",
    contactFormTitle: "أرسل رسالة",
    contactFormName: "اسمك",
    contactFormEmail: "بريدك الإلكتروني",
    contactFormMessage: "رسالتك",
    contactFormSend: "إرسال الرسالة",
    contactLocation: "موسكو · حضوري / هجين / عن بُعد",
    navCvLabel: "السيرة الذاتية",
    projectProblemLabel: "المشكلة",
    projectSolutionLabel: "الحل",
    projectResultLabels: { result: "النتيجة", status: "الحالة", builtIn: "التفاصيل التقنية" },
    projectLiveDemo: "عرض حيّ",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "العودة إلى المشاريع",
    projectTechStackLabel: "التقنيات",
    projectWhatItDoesLabel: "ماذا يفعل",
    recommendations: {
      eyebrow: "توصيات",
      title: "بكلمات من عملت معهم.",
      linkedinLabel: "{name} على LinkedIn",
      items: []
    },
    web3d: {
      eyebrow: "ويب ثلاثي الأبعاد",
      title: "تجارب ويب ثلاثية الأبعاد",
      description:
        "مواقع للعلامات التجارية برسوميات ثلاثية الأبعاد تعمل في الوقت الفعلي، والأداء فيها أولوية. كل النماذج والمظلّلات والجسيمات مبنية بالكود — فلا توجد ملفات نماذج يلزم تنزيلها.",
      principlesLabel: "كيف تبقى المشاهد سريعة",
      principles: [
        { title: "الرسم عند الحاجة", body: "لا يُرسم إطار جديد إلا عند تغيّر شيء ما، فلا تكاد الصفحة الساكنة تستهلك شيئًا من موارد الجهاز." },
        { title: "جودة متكيّفة", body: "تتكيّف الدقة والمؤثرات مع قدرات الجهاز لتبقى الحركة سلسة، حتى على الهواتف." },
        { title: "تقليل الحركة", body: "عند تفعيل خيار تقليل الحركة في النظام، يظهر المشهد ثابتًا ويبقى قابلًا للاستخدام بالكامل." },
        { title: "كل شيء بالكود", body: "الأشكال والمظلّلات والجسيمات مولّدة برمجيًا، فلا يُحمَّل سوى الكود نفسه." }
      ],
      stackLabel: "التقنيات",
      openSite: "فتح الموقع",
      soonBadge: "يُطلق قريبًا",
      showAll: "عرض الكل"
    }
  }
};
