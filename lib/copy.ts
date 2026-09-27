import type { Locale } from "@/lib/types";

/*
 * Site copy in English, Russian and Arabic.
 * Career facts must match the CV (public/cv/Alhassan_Alfarran_CV_EN1.pdf):
 * freelance since 2020 plus three companies, the only performance metric is
 * "~60% lower average response time on a critical endpoint" (Junzi Tech
 * Solutions), Russian is conversational. Keep all three locales in sync when editing.
 */

export type ExperienceItem = {
  period: string;
  title: string;
  company: string;
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type EducationItem = { period: string; degree: string; school: string };

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
  certifications: string[];
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
};

/** Course titles are proper names, so they stay in English in every locale. */
const CERTIFICATIONS = [
  "Server-side Development with Node.js, Express and MongoDB — Coursera",
  "Introduction to SQL — Coursera, University of Michigan",
  "Understanding and Visualizing Data with Python — Coursera, University of Michigan",
  "Machine Learning for All — Coursera, University of London",
  "Programming with Google Go Specialization — Coursera"
];

const CV_FILES = {
  en: "/cv/Alhassan_Alfarran_CV_EN1.pdf",
  ru: "/cv/Alhassan_Alfarran_CV_RU1.pdf",
  ar: "/cv/Alhassan_Alfarran_CV_AR1.pdf"
};

export const copyByLocale: Record<Locale, CopyDictionary> = {
  en: {
    dir: "ltr",
    nav: ["About", "Services", "Projects", "GitHub", "Skills", "Experience"],
    navHome: "Home",
    navContact: "Contact",
    brandMonogram: "AA",
    brandName: "Alhassan",
    heroAvailability: "Available immediately",
    heroEyebrow: "Full-Stack & Python Developer — Web & AI Systems",
    heroTitle: "Alhassan Alfarran",
    heroHeadlineTop: "Web platforms",
    heroHeadlineFocus: "& AI search,",
    heroHeadlineBottom: "built end to end.",
    heroPrimaryCta: "See my work",
    heroSecondaryCta: "Download CV",
    heroStats: [
      { value: "~60%", label: "lower avg. response time on a critical endpoint" },
      { value: "OKKP", label: "platform built from scratch as Chief Full-Stack" },
      { value: "4", label: "open-source tools with live demos" },
      { value: "3", label: "languages · EN C1 · AR · RU" }
    ],
    aboutEyebrow: "About",
    aboutTitle: "Three languages. One full stack.",
    aboutBody:
      "Arabic is my first language and English (C1) my professional one. I studied in Russia — a Bachelor's at Ural Federal University in Yekaterinburg, then a Master's at NUST MISIS in Moscow. I like owning a feature end to end: the data model, the API contract, the permission rules and the Excel export a non-technical colleague can run on their own.",
    projectsEyebrow: "Selected work",
    projectsTitle: "Projects I've built.",
    projectsSubtitle:
      "Projects from my roles — private code, so you see the architecture — plus open-source tools with live demos.",
    projectsEmpty: "Selected projects will appear here.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "More on GitHub",
    githubReposDescription: "Tools, experiments and earlier work — hand-picked and grouped by area.",
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
        items: ["Node.js", "Express", "FastAPI", "Python (async)", "REST API design", "Auth & RBAC", "Audit logging"]
      },
      {
        name: "AI & Search",
        items: ["RAG pipelines", "LLM integration", "sentence-transformers", "FAISS", "Hybrid search", "OCR", "Pandas & NumPy"]
      },
      {
        name: "Data & Storage",
        items: ["PostgreSQL", "MongoDB", "Redis", "SQL", "Cloudinary", "PDF / Word / Excel parsing"]
      },
      {
        name: "Delivery & Tools",
        items: ["Git & GitHub", "Docker", "CI/CD", "GitHub Actions", "Linux", "Kubernetes (basics)", "Vercel", "Jira & Scrum"]
      }
    ],
    experienceEyebrow: "Experience",
    experienceTitle: "Where I've worked.",
    experienceDescription:
      "Freelance since 2020 and three companies — from client projects to a platform built from scratch, and the RAG search I'm building now.",
    experienceItems: [
      {
        period: "Jan 2026 — Present",
        title: "Python / Full-Stack Developer",
        company: "Elektroservis",
        location: "Moscow",
        summary: "Building a document search and RAG system for engineering and technical documentation.",
        highlights: [
          "Built ingestion for PDF, Word and Excel files, with OCR for scanned documents.",
          "Implemented hybrid search — keyword matching plus semantic retrieval (sentence-transformers + FAISS) — to improve answer relevance.",
          "Developed FastAPI ingestion and query pipelines that connect parsing, indexing, retrieval and LLM-assisted answers."
        ],
        stack: ["Python", "FastAPI", "OCR", "sentence-transformers", "FAISS", "LLM"]
      },
      {
        period: "Jan 2025 — Dec 2025",
        title: "Chief Full-Stack Developer",
        company: "Avenue Group",
        location: "Moscow · on-site",
        summary: "Designed and shipped OKKP from scratch — a full-stack operational management platform.",
        highlights: [
          "Architected it end to end: React + TypeScript SPA, Node.js / Express REST API, PostgreSQL + MongoDB.",
          "Built employee management, violation tracking and reporting dashboards with role-based access control and audit logs.",
          "Built Excel exports that let non-technical staff produce audit-ready datasets on their own.",
          "Added secure media uploads (Cloudinary, Multer); owned deployment and production support."
        ],
        stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Cloudinary", "Tailwind CSS"]
      },
      {
        period: "Oct 2024 — Jul 2025",
        title: "Full-Stack Web Developer",
        company: "Junzi Tech Solutions",
        summary: "Delivered full-stack features for client web applications in Agile teams.",
        highlights: [
          "Cut the average response time of a critical API endpoint by ~60% with a caching layer and query refactoring.",
          "Designed REST APIs with consistent validation, error handling and response contracts; reviewed teammates' code and took part in sprint planning."
        ],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "Jan 2020 — Present",
        title: "Full-Stack Developer",
        company: "Freelance",
        location: "Remote",
        summary: "Projects for international clients, alongside my studies and full-time roles.",
        highlights: [
          "React / TypeScript web apps and dashboards; Python / FastAPI backends.",
          "Pathwise — a FastAPI + PostgreSQL application with an async backend.",
          "Owned the full client lifecycle: scoping, estimation, delivery and post-launch support."
        ],
        stack: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "Master's — Computer and Information Sciences",
        school: "NUST MISIS, Moscow"
      },
      {
        period: "2020 — 2024",
        degree: "Bachelor's — Computer Science",
        school: "Ural Federal University, Yekaterinburg"
      }
    ],
    certifications: CERTIFICATIONS,
    contactEyebrow: "Contact",
    contactTitle: "Hiring, or have a project? Let's talk.",
    contactDescription:
      "Hiring for a full-stack, Python or AI role — or planning a web app, a dashboard or AI document search? Tell me what you need. Telegram is the fastest way to reach me.",
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
        description: "Admin panels and internal tools with authentication, role-based access, audit logs and clean REST APIs — like OKKP.",
        proof: "Example: OKKP"
      },
      {
        title: "AI document search",
        description: "RAG over PDF, Word and Excel, OCR for scans, hybrid keyword + semantic search and FastAPI pipelines.",
        proof: "Example: engineering document search (RAG)"
      },
      {
        title: "Dashboards & reporting",
        description: "KPI dashboards, charts and Excel exports your team can use without asking a developer.",
        proof: "Example: client dashboards"
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
    projectWhatItDoesLabel: "What it does"
  },
  ru: {
    dir: "ltr",
    nav: ["Обо мне", "Услуги", "Проекты", "GitHub", "Навыки", "Опыт"],
    navHome: "Главная",
    navContact: "Контакты",
    brandMonogram: "АА",
    brandName: "Альхассан",
    heroAvailability: "Готов приступить сразу",
    heroEyebrow: "Full-stack / Python-разработчик — веб- и AI-системы",
    heroTitle: "Альхассан Альфарран",
    heroHeadlineTop: "Веб-платформы",
    heroHeadlineFocus: "и AI-поиск",
    heroHeadlineBottom: "от идеи до продакшена.",
    heroPrimaryCta: "Смотреть проекты",
    heroSecondaryCta: "Скачать резюме",
    heroStats: [
      { value: "~60%", label: "сокращение среднего времени ответа критичного эндпоинта" },
      { value: "OKKP", label: "платформа с нуля до продакшена" },
      { value: "4", label: "open-source-проекта с онлайн-демо" },
      { value: "3", label: "языка · EN C1 · AR · RU" }
    ],
    aboutEyebrow: "Обо мне",
    aboutTitle: "Три языка — один стек.",
    aboutBody:
      "Арабский — мой родной язык, английский (C1) — профессиональный. Учился в России: бакалавриат в УрФУ (Екатеринбург), затем магистратура в НИТУ МИСИС (Москва). Мне нравится отвечать за фичу целиком: модель данных, контракт API, права доступа и Excel-выгрузку, которую сотрудник без технических навыков сделает сам.",
    projectsEyebrow: "Избранное",
    projectsTitle: "Что я сделал.",
    projectsSubtitle:
      "Коммерческие проекты — код закрыт, поэтому показываю архитектуру, — и open-source-инструменты, которые можно запустить прямо сейчас.",
    projectsEmpty: "Здесь появятся избранные проекты.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "Ещё на GitHub",
    githubReposDescription: "Инструменты, эксперименты и ранние проекты — отобраны вручную и разложены по направлениям.",
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
        items: ["Node.js", "Express", "FastAPI", "Python (async)", "Проектирование REST API", "Авторизация и RBAC", "Журналы аудита"]
      },
      {
        name: "AI и поиск",
        items: ["RAG-пайплайны", "Интеграция LLM", "sentence-transformers", "FAISS", "Гибридный поиск", "OCR", "Pandas и NumPy"]
      },
      {
        name: "Данные и хранение",
        items: ["PostgreSQL", "MongoDB", "Redis", "SQL", "Cloudinary", "Парсинг PDF / Word / Excel"]
      },
      {
        name: "Поставка и инструменты",
        items: ["Git и GitHub", "Docker", "CI/CD", "GitHub Actions", "Linux", "Kubernetes (базовый уровень)", "Vercel", "Jira и Scrum"]
      }
    ],
    experienceEyebrow: "Опыт",
    experienceTitle: "Где я работал.",
    experienceDescription:
      "С 2020 года — фриланс и три компании: от клиентских проектов до платформы, построенной с нуля, и RAG-поиска, над которым работаю сейчас.",
    experienceItems: [
      {
        period: "Январь 2026 — сейчас",
        title: "Python / full-stack разработчик",
        company: "Электросервис",
        location: "Москва",
        summary: "Разрабатываю систему поиска и RAG по технической документации ПТО.",
        highlights: [
          "Реализовал индексацию PDF, Word и Excel, включая сканы через OCR.",
          "Реализовал гибридный поиск: ключевые слова + семантика (sentence-transformers + FAISS) — чтобы ответы были релевантнее.",
          "Разработал на FastAPI пайплайны загрузки и обработки запросов: парсинг, индексация, поиск и ответы с помощью LLM."
        ],
        stack: ["Python", "FastAPI", "OCR", "sentence-transformers", "FAISS", "LLM"]
      },
      {
        period: "Январь 2025 — декабрь 2025",
        title: "Главный full-stack разработчик",
        company: "Avenue Group",
        location: "Москва · офис",
        summary: "С нуля спроектировал и запустил OKKP — full-stack платформу операционного управления.",
        highlights: [
          "Выстроил архитектуру целиком: SPA на React + TypeScript, REST API на Node.js / Express, PostgreSQL + MongoDB.",
          "Сделал модули управления сотрудниками, учёта нарушений и отчётных дашбордов с ролевым доступом и журналом аудита.",
          "Сделал выгрузку в Excel, с которой сотрудники без технической подготовки сами готовят данные для аудита.",
          "Добавил защищённую загрузку медиафайлов (Cloudinary, Multer); отвечал за деплой и поддержку в продакшене."
        ],
        stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Cloudinary", "Tailwind CSS"]
      },
      {
        period: "Октябрь 2024 — июль 2025",
        title: "Full-stack веб-разработчик",
        company: "Junzi Tech Solutions",
        summary: "Разрабатывал full-stack функциональность клиентских веб-приложений в Agile-командах.",
        highlights: [
          "Сократил среднее время ответа критичного эндпоинта API примерно на 60% с помощью слоя кеширования и переработки запросов.",
          "Проектировал REST API с единой валидацией, обработкой ошибок и контрактами ответов; ревьюил код коллег и участвовал в планировании спринтов."
        ],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "Январь 2020 — сейчас",
        title: "Full-stack разработчик",
        company: "Фриланс",
        location: "Удалённо",
        summary: "Проекты для международных клиентов — параллельно с учёбой и основной работой.",
        highlights: [
          "Веб-приложения и дашборды на React / TypeScript, бэкенды на Python / FastAPI.",
          "Pathwise — приложение на FastAPI + PostgreSQL с асинхронным бэкендом.",
          "Полный цикл работы с клиентом: постановка задачи, оценка, разработка и поддержка после запуска."
        ],
        stack: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "Магистратура — компьютерные и информационные науки",
        school: "НИТУ МИСИС, Москва"
      },
      {
        period: "2020 — 2024",
        degree: "Бакалавриат — информатика и вычислительная техника",
        school: "Уральский федеральный университет (УрФУ), Екатеринбург"
      }
    ],
    certifications: CERTIFICATIONS,
    contactEyebrow: "Контакты",
    contactTitle: "Вакансия или проект? Давайте обсудим.",
    contactDescription:
      "Ищете full-stack, Python- или AI-разработчика — или планируете веб-приложение, дашборд или поиск по документам? Расскажите, что нужно. Быстрее всего — в Telegram.",
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
        description: "Админ-панели и внутренние системы с авторизацией, ролевым доступом, журналом аудита и аккуратным REST API — как OKKP.",
        proof: "Пример: OKKP"
      },
      {
        title: "AI-поиск по документам",
        description: "RAG по PDF, Word и Excel, OCR для сканов, гибридный поиск по ключевым словам и смыслу, пайплайны на FastAPI.",
        proof: "Пример: поиск по технической документации (RAG)"
      },
      {
        title: "Дашборды и отчётность",
        description: "KPI-дашборды, графики и выгрузки в Excel, которыми команда пользуется без помощи разработчика.",
        proof: "Пример: клиентские дашборды"
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
    projectWhatItDoesLabel: "Что делает"
  },
  ar: {
    dir: "rtl",
    nav: ["نبذة", "الخدمات", "المشاريع", "GitHub", "المهارات", "الخبرة"],
    navHome: "الرئيسية",
    navContact: "تواصل",
    // The logo mark stays the Latin initials in every locale: "حا" did not read as initials.
    brandMonogram: "AA",
    brandName: "الحسن",
    heroAvailability: "متاح للعمل فوراً",
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
      { value: "OKKP", label: "منصة من الصفر حتى الإنتاج" },
      { value: "4", label: "أدوات مفتوحة المصدر مع عروض حية" },
      { value: "3", label: "لغات · العربية · الإنجليزية C1 · الروسية" }
    ],
    aboutEyebrow: "نبذة",
    aboutTitle: "ثلاث لغات — وحزمة تقنية واحدة.",
    aboutBody:
      "العربية لغتي الأم، والإنجليزية (C1) لغتي المهنية. درستُ في روسيا: البكالوريوس في جامعة الأورال الفيدرالية في يكاترينبورغ، ثم الماجستير في جامعة MISIS في موسكو. أحبّ أن أتولّى الميزة كاملة: نموذج البيانات، وعقد الواجهة البرمجية، وصلاحيات الوصول، وتصدير Excel يستطيع زميل غير تقني إعداده بنفسه.",
    projectsEyebrow: "أعمال مختارة",
    projectsTitle: "مشاريع بنيتها.",
    projectsSubtitle:
      "مشاريع من عملي — الكود خاص، لذا أعرض البنية — إلى جانب أدوات مفتوحة المصدر مع عروض حية.",
    projectsEmpty: "ستُعرض المشاريع المختارة هنا.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "المزيد على GitHub",
    githubReposDescription: "أدوات وتجارب وأعمال سابقة — منتقاة بعناية ومصنّفة حسب المجال.",
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
        items: ["Node.js", "Express", "FastAPI", "Python (async)", "تصميم REST API", "المصادقة وRBAC", "سجلات التدقيق"]
      },
      {
        name: "الذكاء الاصطناعي والبحث",
        items: ["خطوط معالجة RAG", "تكامل LLM", "sentence-transformers", "FAISS", "البحث الهجين", "OCR", "Pandas وNumPy"]
      },
      {
        name: "البيانات والتخزين",
        items: ["PostgreSQL", "MongoDB", "Redis", "SQL", "Cloudinary", "تحليل ملفات PDF / Word / Excel"]
      },
      {
        name: "التسليم والأدوات",
        items: ["Git وGitHub", "Docker", "CI/CD", "GitHub Actions", "Linux", "Kubernetes (أساسيات)", "Vercel", "Jira وScrum"]
      }
    ],
    experienceEyebrow: "الخبرة",
    experienceTitle: "مسيرتي المهنية.",
    experienceDescription:
      "منذ 2020: عمل حر وثلاث شركات — من مشاريع العملاء إلى منصة بنيتها من الصفر، واليوم أنظمة بحث RAG.",
    experienceItems: [
      {
        period: "يناير 2026 — حتى الآن",
        title: "مطوّر Python / Full-Stack",
        company: "Elektroservis",
        location: "موسكو",
        summary: "أبني نظام بحث وRAG للوثائق الهندسية والفنية.",
        highlights: [
          "بنيتُ استقبال ملفات PDF وWord وExcel وفهرستها، مع OCR للمستندات الممسوحة ضوئياً.",
          "نفّذتُ بحثاً هجيناً يجمع بين مطابقة الكلمات المفتاحية والاسترجاع الدلالي (sentence-transformers + FAISS) لرفع دقة الإجابات.",
          "طوّرتُ على FastAPI خطوط معالجة لاستقبال المستندات والاستعلام، تربط التحليل والفهرسة والاسترجاع بإجابات مدعومة بنماذج LLM."
        ],
        stack: ["Python", "FastAPI", "OCR", "sentence-transformers", "FAISS", "LLM"]
      },
      {
        period: "يناير 2025 — ديسمبر 2025",
        title: "كبير مطوري Full-Stack",
        company: "Avenue Group",
        location: "موسكو · من المكتب",
        summary: "صمّمت منصة OKKP وأطلقتها من الصفر — منصة متكاملة لإدارة العمليات.",
        highlights: [
          "صمّمت البنية بالكامل: تطبيق SPA على React + TypeScript، وREST API على Node.js / Express، وقواعد PostgreSQL وMongoDB.",
          "بنيت وحدات إدارة الموظفين وتتبّع المخالفات ولوحات التقارير، مع صلاحيات حسب الأدوار وسجل تدقيق.",
          "بنيتُ تصديراً إلى Excel يتيح للموظفين غير التقنيين إعداد بيانات جاهزة للتدقيق بأنفسهم.",
          "أضفت رفعاً آمناً للوسائط (Cloudinary وMulter)، وتولّيت النشر ودعم بيئة الإنتاج."
        ],
        stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Cloudinary", "Tailwind CSS"]
      },
      {
        period: "أكتوبر 2024 — يوليو 2025",
        title: "مطوّر ويب Full-Stack",
        company: "Junzi Tech Solutions",
        summary: "طوّرت ميزات متكاملة لتطبيقات ويب خاصة بعملاء الشركة ضمن فرق Agile.",
        highlights: [
          "خفّضت متوسط زمن استجابة نقطة نهاية API حرجة بنحو 60% عبر طبقة تخزين مؤقت وإعادة هيكلة الاستعلامات.",
          "صمّمت واجهات REST API بتحقق موحّد من المدخلات ومعالجة متسقة للأخطاء وعقود استجابة ثابتة، وراجعت كود زملائي وشاركت في تخطيط السبرنتات."
        ],
        stack: ["Node.js", "Express", "MongoDB", "React"]
      },
      {
        period: "يناير 2020 — حتى الآن",
        title: "مطوّر Full-Stack",
        company: "عمل حر",
        location: "عن بُعد",
        summary: "مشاريع لعملاء دوليين، بالتوازي مع الدراسة والعمل بدوام كامل.",
        highlights: [
          "تطبيقات ويب ولوحات تحكم على React / TypeScript، وخدمات خلفية على Python / FastAPI.",
          "Pathwise: تطبيق مبني على FastAPI + PostgreSQL بخدمة خلفية غير متزامنة.",
          "إدارة دورة العمل كاملة مع العميل: تحديد النطاق والتقدير والتسليم والدعم بعد الإطلاق."
        ],
        stack: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"]
      }
    ],
    education: [
      {
        period: "2024 — 2026",
        degree: "ماجستير — علوم الحاسوب والمعلومات",
        school: "الجامعة الوطنية للعلوم والتكنولوجيا MISIS، موسكو"
      },
      {
        period: "2020 — 2024",
        degree: "بكالوريوس — علوم الحاسوب",
        school: "جامعة الأورال الفيدرالية، يكاترينبورغ"
      }
    ],
    certifications: CERTIFICATIONS,
    contactEyebrow: "تواصل",
    contactTitle: "توظيف أو مشروع؟ لنتحدث.",
    contactDescription:
      "تبحث عن مطوّر Full-Stack أو Python أو ذكاء اصطناعي — أو تخطّط لتطبيق ويب أو لوحة تحكم أو بحث ذكي في المستندات؟ أخبرني بما تحتاجه. أسرع طريقة للتواصل معي هي Telegram.",
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
        description: "لوحات إدارة وأدوات داخلية بمصادقة وصلاحيات حسب الأدوار وسجلات تدقيق وواجهات REST API واضحة — مثل OKKP.",
        proof: "مثال: OKKP"
      },
      {
        title: "بحث ذكي في المستندات",
        description: "RAG في ملفات PDF وWord وExcel، وOCR للمستندات الممسوحة، وبحث هجين بالكلمات المفتاحية والمعنى، وخطوط معالجة على FastAPI.",
        proof: "مثال: البحث في الوثائق الهندسية (RAG)"
      },
      {
        title: "لوحات مؤشرات وتقارير",
        description: "لوحات KPI ورسوم بيانية وتصدير إلى Excel يستخدمها فريقك دون الحاجة إلى مطوّر.",
        proof: "مثال: لوحات مؤشرات لعميل"
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
    projectWhatItDoesLabel: "ماذا يفعل"
  }
};
