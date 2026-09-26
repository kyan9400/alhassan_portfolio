import type { Locale } from "@/lib/types";

/*
 * Site copy in English, Russian and Arabic.
 * Career facts must match the CV (public/cv/Alhassan_Alfarran_CV_EN1.pdf):
 * four roles since 2020, the only performance metric is "~60% lower average
 * response time on a critical endpoint" (Junzi Tech Solutions), Russian is
 * conversational. Keep all three locales in sync when editing.
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
  /** [About, Services, Projects, Repositories, Skills, Experience] */
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
  heroSecondaryCta: string;
  heroStats: { value: string; label: string }[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  aboutHighlights: { label: string; value: string }[];
  aboutFocusTitle: string;
  aboutFocusItems: string[];
  systemMapEyebrow: string;
  systemMapTitle: string;
  systemMapDescription: string;
  mapLayers: { label: string; detail: string }[];
  flowLabel: string;
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
  /** Four roles, newest first. */
  experienceItems: ExperienceItem[];
  education: EducationItem[];
  /** Real items from the EN CV only. */
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
  heroResponseTime: string;
  proofStripLabel: string;
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
  servicesItems: { title: string; description: string }[];
  // Available for work CTA
  availableBody: string;
  // Credibility highlights
  credibilityItems: { title: string; body: string }[];
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
  projectResultLabel: string;
  projectLiveDemo: string;
  projectViewGithubLabel: string;
  projectBackLabel: string;
  projectTechStackLabel: string;
  projectWhatItDoesLabel: string;
};

/** Course titles are proper names, so they stay in English in every locale. */
const CERTIFICATIONS = [
  "Full-Stack Web Development with Angular — Coursera, HKUST",
  "Server-side Development with Node.js, Express and MongoDB — Coursera",
  "Introduction to SQL — Coursera, University of Michigan",
  "Understanding and Visualizing Data with Python — Coursera, University of Michigan",
  "Machine Learning for All — Coursera, University of London",
  "Programming with Google Go Specialization — Coursera",
  "JavaScript Algorithms and Data Structures — freeCodeCamp",
  "Data Visualization — freeCodeCamp",
  "ICDL — International Computer Driving Licence"
];

const CV_FILES = {
  en: "/cv/Alhassan_Alfarran_CV_EN1.pdf",
  ru: "/cv/Alhassan_Alfarran_CV_RU1.pdf",
  ar: "/cv/Alhassan_Alfarran_CV_AR1.pdf"
};

export const copyByLocale: Record<Locale, CopyDictionary> = {
  en: {
    dir: "ltr",
    nav: ["About", "Services", "Projects", "Repositories", "Skills", "Experience"],
    navHome: "Home",
    navContact: "Contact",
    brandMonogram: "AA",
    brandName: "Alhassan",
    heroAvailability: "Available immediately",
    heroEyebrow: "Software Engineer — Web & AI Systems",
    heroTitle: "Alhassan Alfarran",
    heroHeadlineTop: "I build web & AI",
    heroHeadlineFocus: "systems",
    heroHeadlineBottom: "that actually ship.",
    heroPrimaryCta: "See my work",
    heroSecondaryCta: "Get in touch",
    heroStats: [
      { value: "2020", label: "First client project" },
      { value: "4", label: "Engineering roles" },
      { value: "MSc", label: "NUST MISIS" },
      { value: "3", label: "Languages" }
    ],
    aboutEyebrow: "About",
    aboutTitle: "An engineer who thinks in systems.",
    aboutBody:
      "I'm a Moscow-based software engineer who works across the whole stack: React and TypeScript interfaces, Node.js and FastAPI services, PostgreSQL and MongoDB — and the AI layer on top: OCR, embeddings and hybrid search. I care about clean boundaries between UI, services and AI, and about features that hold up in real workflows, not just in demos.",
    aboutHighlights: [
      { label: "Based in", value: "Moscow · on-site / hybrid / remote" },
      { label: "Experience", value: "Since 2020 · 4 roles" },
      { label: "Education", value: "MSc · NUST MISIS" },
      { label: "Languages", value: "EN C1 · AR native · RU conversational" }
    ],
    aboutFocusTitle: "Currently focused on",
    aboutFocusItems: [
      "RAG and hybrid search over technical documents",
      "FastAPI ingestion and query pipelines",
      "OCR for scans, PDF, Word and Excel",
      "Clear, simple React + TypeScript interfaces",
      "Clean contracts between UI, API and AI layers"
    ],
    systemMapEyebrow: "How I build",
    systemMapTitle: "A clear map of how I build systems.",
    systemMapDescription: "Most of what I ship comes down to four layers with clear boundaries between them.",
    mapLayers: [
      { label: "UI Layer", detail: "React + TypeScript interfaces — responsive and easy to scan." },
      { label: "API Layer", detail: "Node.js / Express and FastAPI services with explicit contracts." },
      { label: "Data Layer", detail: "PostgreSQL and MongoDB models for day-to-day work and reporting." },
      { label: "AI Layer", detail: "OCR, embeddings and hybrid search, with LLM-assisted answers." }
    ],
    flowLabel: "data flows top to bottom",
    projectsEyebrow: "Selected work",
    projectsTitle: "Projects I've built.",
    projectsSubtitle:
      "Work projects from real jobs — the code is under NDA, so you get the architecture — plus open-source tools you can run today.",
    projectsEmpty: "Selected projects will appear here.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "More on GitHub",
    githubReposDescription: "Tools, experiments and earlier work — hand-picked and grouped by area.",
    githubReposViewMore: "Show more",
    githubReposEmpty: "No repositories to show.",
    skillsEyebrow: "Capabilities",
    skillsTitle: "Stack I reach for.",
    skillsDescription: "The tools I use day to day — across interfaces, services, data, AI search and delivery.",
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
      "Four roles since 2020 — from client projects to a platform built from scratch, and RAG search today.",
    experienceItems: [
      {
        period: "Jan 2026 — Present",
        title: "Python / Full-Stack Developer",
        company: "Elektroservis",
        location: "Moscow",
        summary: "Building a document search and RAG system for engineering (PTO) documentation.",
        highlights: [
          "Indexing PDF, Word and Excel files — including scanned documents via OCR.",
          "Hybrid search that combines keyword matching with semantic retrieval (sentence-transformers + FAISS) to improve answer relevance.",
          "FastAPI ingestion and query pipelines connecting parsing, indexing, retrieval and LLM-assisted answers."
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
          "Added secure media uploads (Cloudinary, Multer) and Excel exports that let non-technical staff produce audit-ready datasets; owned deployment and production support."
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
          "Designed REST APIs with consistent validation, error handling and response contracts.",
          "Took part in code reviews and sprint planning."
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
    contactTitle: "Let's build something meaningful.",
    contactDescription:
      "Hiring for a full-stack, Python or AI role? Planning a web app, a dashboard or an AI search tool? Tell me what you need — I usually reply within 48 hours.",
    contactEmailLabel: "Email me",
    contactCvLabel: "Download CV",
    cvDownloads: [
      { code: "EN", label: "English", file: CV_FILES.en },
      { code: "RU", label: "Русский", file: CV_FILES.ru },
      { code: "AR", label: "العربية", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    footerBuiltWith: "Built with Next.js, Tailwind and Framer Motion",
    languageLabel: "Language",
    heroResponseTime: "Usually replies within 48 hours",
    proofStripLabel: "Experience at",
    proofStripItems: ["Elektroservis", "Avenue Group · OKKP", "Junzi Tech Solutions", "Freelance since 2020", "Open source"],
    signature: {
      eyebrow: "Signature case study",
      company: "Junzi Tech Solutions",
      title: "Cutting a critical endpoint's response time by ~60%.",
      summary:
        "At Junzi Tech Solutions I optimised a critical API endpoint in a client web application. A caching layer and refactored database queries cut its average response time by about 60%.",
      problemTitle: "Problem",
      problem:
        "A critical endpoint in a client web application — a Node.js / Express API on MongoDB, with a React front end — needed a lower response time.",
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
      description: "No process theatre — just the patterns I actually rely on.",
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
        description: "Admin panels and internal tools with authentication, role-based access, audit logs and clean REST APIs — like OKKP."
      },
      {
        title: "AI document search",
        description: "RAG over PDF, Word and Excel, OCR for scans, hybrid keyword + semantic search and FastAPI pipelines."
      },
      {
        title: "Dashboards & reporting",
        description: "KPI dashboards, charts and Excel exports your team can use without asking a developer."
      },
      {
        title: "API performance & backend",
        description: "Profiling slow endpoints, caching and query refactoring, consistent validation and error handling."
      }
    ],
    availableBody: "On-site or hybrid in Moscow, or remote. I build full-stack web apps, dashboards and AI-powered tools.",
    credibilityItems: [
      {
        title: "End-to-end delivery",
        body: "Frontend, backend, database, authentication, dashboards, deployment and documentation — one person who owns the whole path."
      },
      {
        title: "Business-first engineering",
        body: "I build systems that solve real operational problems, not just good-looking interfaces."
      },
      {
        title: "Practical AI",
        body: "Hands-on RAG, OCR and hybrid search built for real documents and real workflows."
      }
    ],
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
    projectResultLabel: "Result",
    projectLiveDemo: "Live demo",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "Back to projects",
    projectTechStackLabel: "Tech stack",
    projectWhatItDoesLabel: "What it does"
  },
  ru: {
    dir: "ltr",
    nav: ["Обо мне", "Услуги", "Проекты", "Репозитории", "Навыки", "Опыт"],
    navHome: "Главная",
    navContact: "Контакты",
    brandMonogram: "АА",
    brandName: "Альхассан",
    heroAvailability: "Готов приступить сразу",
    heroEyebrow: "Software Engineer — веб- и AI-системы",
    heroTitle: "Альхассан Альфарран",
    heroHeadlineTop: "Создаю веб- и",
    heroHeadlineFocus: "AI-системы,",
    heroHeadlineBottom: "которые работают.",
    heroPrimaryCta: "Смотреть проекты",
    heroSecondaryCta: "Связаться",
    heroStats: [
      { value: "2020", label: "Первый клиент" },
      { value: "4", label: "Инженерные роли" },
      { value: "МИСИС", label: "Магистратура" },
      { value: "3", label: "Языка" }
    ],
    aboutEyebrow: "Обо мне",
    aboutTitle: "Инженер с системным мышлением.",
    aboutBody:
      "Я инженер-программист из Москвы и работаю по всему стеку: интерфейсы на React и TypeScript, сервисы на Node.js и FastAPI, PostgreSQL и MongoDB — и AI-слой поверх них: OCR, эмбеддинги и гибридный поиск. Для меня важны чёткие границы между UI, сервисами и AI и функции, которые выдерживают реальную работу, а не только демо.",
    aboutHighlights: [
      { label: "Локация", value: "Москва · офис / гибрид / удалённо" },
      { label: "Опыт", value: "С 2020 года · 4 роли" },
      { label: "Образование", value: "Магистратура · НИТУ МИСИС" },
      { label: "Языки", value: "EN C1 · AR — родной · RU — разговорный" }
    ],
    aboutFocusTitle: "Сейчас в фокусе",
    aboutFocusItems: [
      "RAG и гибридный поиск по технической документации",
      "Пайплайны загрузки и запросов на FastAPI",
      "OCR для сканов, PDF, Word и Excel",
      "Простые и понятные интерфейсы на React + TypeScript",
      "Чёткие контракты между UI, API и AI-слоем"
    ],
    systemMapEyebrow: "Подход",
    systemMapTitle: "Как устроены системы, которые я строю.",
    systemMapDescription: "Почти всё, что я делаю, сводится к четырём слоям с чёткими границами между ними.",
    mapLayers: [
      { label: "Слой UI", detail: "Интерфейсы на React + TypeScript — адаптивные и понятные с первого взгляда." },
      { label: "Слой API", detail: "Сервисы на Node.js / Express и FastAPI с явными контрактами." },
      { label: "Слой данных", detail: "Модели PostgreSQL и MongoDB для повседневной работы и отчётности." },
      { label: "Слой AI", detail: "OCR, эмбеддинги и гибридный поиск с ответами на основе LLM." }
    ],
    flowLabel: "данные идут сверху вниз",
    projectsEyebrow: "Избранное",
    projectsTitle: "Проекты, которые я сделал.",
    projectsSubtitle:
      "Проекты с моих мест работы: код под NDA, поэтому я показываю архитектуру. А ещё open-source инструменты, которые можно запустить уже сегодня.",
    projectsEmpty: "Здесь появятся избранные проекты.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "Ещё на GitHub",
    githubReposDescription: "Инструменты, эксперименты и ранние проекты — отобраны вручную и разложены по направлениям.",
    githubReposViewMore: "Показать ещё",
    githubReposEmpty: "Нет репозиториев для показа.",
    skillsEyebrow: "Навыки",
    skillsTitle: "Мой стек.",
    skillsDescription: "Инструменты, с которыми я работаю каждый день: интерфейсы, сервисы, данные, AI-поиск и поставка.",
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
      "Четыре роли с 2020 года — от проектов для клиентов до платформы, построенной с нуля, и RAG-поиска сегодня.",
    experienceItems: [
      {
        period: "Январь 2026 — сейчас",
        title: "Python / full-stack разработчик",
        company: "Электросервис",
        location: "Москва",
        summary: "Строю систему поиска и RAG по технической документации ПТО.",
        highlights: [
          "Индексация PDF, Word и Excel, включая сканы через OCR.",
          "Гибридный поиск: ключевые слова плюс семантика (sentence-transformers + FAISS), чтобы ответы были релевантнее.",
          "Пайплайны загрузки и запросов на FastAPI: парсинг, индексация, поиск и ответы с помощью LLM."
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
          "Добавил защищённую загрузку медиафайлов (Cloudinary, Multer) и выгрузку в Excel, с которой сотрудники без технической подготовки сами готовят данные для аудита; отвечал за деплой и поддержку в продакшене."
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
          "Проектировал REST API с единой валидацией, обработкой ошибок и контрактами ответов.",
          "Участвовал в код-ревью и планировании спринтов."
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
    contactTitle: "Давайте сделаем что-то стоящее.",
    contactDescription:
      "Ищете разработчика в команду — full-stack, Python или AI? Планируете веб-приложение, дашборд или AI-поиск? Расскажите, что нужно, — обычно отвечаю в течение 48 часов.",
    contactEmailLabel: "Напишите мне",
    contactCvLabel: "Скачать резюме",
    cvDownloads: [
      { code: "EN", label: "Английский", file: CV_FILES.en },
      { code: "RU", label: "Русский", file: CV_FILES.ru },
      { code: "AR", label: "Арабский", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    footerBuiltWith: "Сделано на Next.js, Tailwind и Framer Motion",
    languageLabel: "Язык",
    heroResponseTime: "Обычно отвечаю в течение 48 часов",
    proofStripLabel: "Опыт работы",
    proofStripItems: ["Электросервис", "Avenue Group · OKKP", "Junzi Tech Solutions", "Фриланс с 2020 года", "Проекты с открытым кодом"],
    signature: {
      eyebrow: "Ключевой кейс",
      company: "Junzi Tech Solutions",
      title: "Время ответа критичного эндпоинта — на ~60% меньше.",
      summary:
        "В Junzi Tech Solutions я оптимизировал критичный эндпоинт API клиентского веб-приложения. Слой кеширования и переработанные запросы к базе сократили его среднее время ответа примерно на 60%.",
      problemTitle: "Задача",
      problem:
        "Критичному эндпоинту клиентского веб-приложения — API на Node.js / Express с MongoDB и фронтендом на React — нужно было отвечать быстрее.",
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
      description: "Без процессного театра — только то, на что я действительно опираюсь.",
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
        description: "Админ-панели и внутренние системы с авторизацией, ролевым доступом, журналом аудита и аккуратным REST API — как OKKP."
      },
      {
        title: "AI-поиск по документам",
        description: "RAG по PDF, Word и Excel, OCR для сканов, гибридный поиск по ключевым словам и смыслу, пайплайны на FastAPI."
      },
      {
        title: "Дашборды и отчётность",
        description: "KPI-дашборды, графики и выгрузки в Excel, которыми команда пользуется без помощи разработчика."
      },
      {
        title: "Бэкенд и производительность API",
        description: "Поиск медленных эндпоинтов, кеширование и переработка запросов, единая валидация и обработка ошибок."
      }
    ],
    availableBody: "Офис или гибрид в Москве, либо удалённо. Делаю full-stack веб-приложения, дашборды и инструменты с AI.",
    credibilityItems: [
      {
        title: "Разработка от начала до конца",
        body: "Фронтенд, бэкенд, база данных, авторизация, дашборды, деплой и документация — один человек отвечает за весь путь."
      },
      {
        title: "Инженерия под задачи бизнеса",
        body: "Строю системы, которые решают реальные операционные задачи, а не просто красиво выглядят."
      },
      {
        title: "Прикладной AI",
        body: "Практический опыт с RAG, OCR и гибридным поиском по реальным документам и в реальных процессах."
      }
    ],
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
    projectResultLabel: "Результат",
    projectLiveDemo: "Демо",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "Назад к проектам",
    projectTechStackLabel: "Стек",
    projectWhatItDoesLabel: "Что делает"
  },
  ar: {
    dir: "rtl",
    nav: ["نبذة", "الخدمات", "المشاريع", "المستودعات", "المهارات", "الخبرة"],
    navHome: "الرئيسية",
    navContact: "تواصل",
    // The logo mark stays the Latin initials in every locale: "حا" did not read as initials.
    brandMonogram: "AA",
    brandName: "الحسن",
    heroAvailability: "متاح للعمل فوراً",
    heroEyebrow: "مهندس برمجيات — أنظمة الويب والذكاء الاصطناعي",
    heroTitle: "الحسن الفران",
    heroHeadlineTop: "أبني أنظمة ويب",
    heroHeadlineFocus: "وذكاء اصطناعي",
    heroHeadlineBottom: "تعمل فعلاً.",
    heroPrimaryCta: "شاهد أعمالي",
    heroSecondaryCta: "تواصل معي",
    heroStats: [
      { value: "2020", label: "أول مشروع لعميل" },
      { value: "4", label: "أدوار هندسية" },
      { value: "ماجستير", label: "جامعة MISIS" },
      { value: "3", label: "لغات" }
    ],
    aboutEyebrow: "نبذة",
    aboutTitle: "مهندس يفكّر بمنطق الأنظمة.",
    aboutBody:
      "مهندس برمجيات مقيم في موسكو، أعمل على كامل الحزمة التقنية: واجهات React وTypeScript، وخدمات Node.js وFastAPI، وقواعد بيانات PostgreSQL وMongoDB، وفوقها طبقة الذكاء الاصطناعي: التعرّف الضوئي على النصوص (OCR) والتضمينات والبحث الهجين. يهمّني أن تكون الحدود واضحة بين الواجهة والخدمات والذكاء الاصطناعي، وأن تصمد الميزات في سير العمل الحقيقي لا في العروض التجريبية فقط.",
    aboutHighlights: [
      { label: "الموقع", value: "موسكو · حضوري / هجين / عن بُعد" },
      { label: "الخبرة", value: "منذ 2020 · 4 أدوار" },
      { label: "التعليم", value: "ماجستير · جامعة MISIS" },
      { label: "اللغات", value: "العربية (الأم) · الإنجليزية C1 · الروسية (محادثة)" }
    ],
    aboutFocusTitle: "أعمل حالياً على",
    aboutFocusItems: [
      "RAG والبحث الهجين في الوثائق التقنية",
      "مسارات FastAPI لاستقبال المستندات والاستعلام",
      "OCR للمستندات الممسوحة وملفات PDF وWord وExcel",
      "واجهات React + TypeScript بسيطة وواضحة",
      "عقود واضحة بين الواجهة وAPI وطبقة الذكاء الاصطناعي"
    ],
    systemMapEyebrow: "المنهج",
    systemMapTitle: "خريطة واضحة لطريقة بنائي للأنظمة.",
    systemMapDescription: "معظم ما أبنيه يتكوّن من أربع طبقات بحدود واضحة بينها.",
    mapLayers: [
      { label: "طبقة الواجهة", detail: "واجهات React + TypeScript متجاوبة وسهلة القراءة." },
      { label: "طبقة API", detail: "خدمات Node.js / Express وFastAPI بعقود صريحة." },
      { label: "طبقة البيانات", detail: "نماذج PostgreSQL وMongoDB للعمل اليومي والتقارير." },
      { label: "طبقة الذكاء الاصطناعي", detail: "OCR وتضمينات وبحث هجين، مع إجابات بمساعدة LLM." }
    ],
    flowLabel: "تتدفق البيانات من الأعلى إلى الأسفل",
    projectsEyebrow: "أعمال مختارة",
    projectsTitle: "مشاريع بنيتها.",
    projectsSubtitle:
      "مشاريع من عملي الفعلي — الكود خاضع لاتفاقية عدم إفصاح، لذا أعرض البنية — إلى جانب أدوات مفتوحة المصدر يمكنك تشغيلها اليوم.",
    projectsEmpty: "ستُعرض المشاريع المختارة هنا.",
    githubReposEyebrow: "GitHub",
    githubReposTitle: "المزيد على GitHub",
    githubReposDescription: "أدوات وتجارب وأعمال سابقة — منتقاة بعناية ومصنّفة حسب المجال.",
    githubReposViewMore: "عرض المزيد",
    githubReposEmpty: "لا توجد مستودعات للعرض.",
    skillsEyebrow: "المهارات",
    skillsTitle: "الأدوات التي أعتمد عليها.",
    skillsDescription: "الأدوات التي أعمل بها يومياً: الواجهات والخدمات والبيانات والبحث الذكي والتسليم.",
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
        items: ["مسارات RAG", "تكامل LLM", "sentence-transformers", "FAISS", "البحث الهجين", "OCR", "Pandas وNumPy"]
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
      "أربعة أدوار منذ 2020 — من مشاريع العملاء إلى منصة بنيتها من الصفر، واليوم أنظمة بحث RAG.",
    experienceItems: [
      {
        period: "يناير 2026 — حتى الآن",
        title: "مطوّر Python / Full-Stack",
        company: "Elektroservis",
        location: "موسكو",
        summary: "أبني نظام بحث وRAG لوثائق القسم الفني الهندسي (PTO).",
        highlights: [
          "فهرسة ملفات PDF وWord وExcel، بما فيها المستندات الممسوحة ضوئياً عبر OCR.",
          "بحث هجين يجمع بين الكلمات المفتاحية والبحث الدلالي (sentence-transformers + FAISS) لرفع دقة الإجابات.",
          "مسارات FastAPI لاستقبال المستندات والاستعلام، تربط التحليل والفهرسة والاسترجاع بإجابات مدعومة بنماذج LLM."
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
          "صمّمت البنية من طرف إلى طرف: تطبيق SPA بـ React + TypeScript، وREST API بـ Node.js / Express، وقواعد PostgreSQL وMongoDB.",
          "بنيت وحدات إدارة الموظفين وتتبّع المخالفات ولوحات التقارير، مع صلاحيات حسب الأدوار وسجل تدقيق.",
          "أضفت رفعاً آمناً للوسائط (Cloudinary وMulter) وتصديراً إلى Excel يتيح للموظفين غير التقنيين إعداد بيانات جاهزة للتدقيق، وتولّيت النشر ودعم بيئة الإنتاج."
        ],
        stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "MongoDB", "Cloudinary", "Tailwind CSS"]
      },
      {
        period: "أكتوبر 2024 — يوليو 2025",
        title: "مطوّر ويب Full-Stack",
        company: "Junzi Tech Solutions",
        summary: "طوّرت ميزات متكاملة لتطبيقات ويب خاصة بعملاء الشركة ضمن فرق Agile.",
        highlights: [
          "خفّضت متوسط زمن استجابة نقطة API حرجة بنحو 60% عبر طبقة تخزين مؤقت وإعادة هيكلة الاستعلامات.",
          "صمّمت واجهات REST API بتحقق موحّد من المدخلات ومعالجة متسقة للأخطاء وعقود استجابة ثابتة.",
          "شاركت في مراجعة الكود وتخطيط السبرنتات."
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
          "تطبيقات ويب ولوحات تحكم بـ React / TypeScript، وخدمات خلفية بـ Python / FastAPI.",
          "Pathwise: تطبيق مبني بـ FastAPI + PostgreSQL بخدمة خلفية غير متزامنة.",
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
    contactTitle: "لنبنِ معاً شيئاً ذا قيمة.",
    contactDescription:
      "تبحث عن مطوّر Full-Stack أو Python أو ذكاء اصطناعي لفريقك؟ أو تخطط لتطبيق ويب أو لوحة تحكم أو أداة بحث ذكية؟ أخبرني بما تحتاجه — أردّ عادةً خلال 48 ساعة.",
    contactEmailLabel: "راسلني",
    contactCvLabel: "تحميل السيرة الذاتية",
    cvDownloads: [
      { code: "EN", label: "الإنجليزية", file: CV_FILES.en },
      { code: "RU", label: "الروسية", file: CV_FILES.ru },
      { code: "AR", label: "العربية", file: CV_FILES.ar }
    ],
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    footerBuiltWith: "مبني بـ Next.js وTailwind وFramer Motion",
    languageLabel: "اللغة",
    heroResponseTime: "أردّ عادةً خلال 48 ساعة",
    proofStripLabel: "خبرة في",
    proofStripItems: ["Elektroservis", "Avenue Group · OKKP", "Junzi Tech Solutions", "عمل حر منذ 2020", "مفتوح المصدر"],
    signature: {
      eyebrow: "دراسة الحالة الأبرز",
      company: "Junzi Tech Solutions",
      title: "خفّضت زمن استجابة نقطة API حرجة بنحو 60%.",
      summary:
        "في Junzi Tech Solutions حسّنت نقطة API حرجة في تطبيق ويب لأحد العملاء، فخفّضت طبقة تخزين مؤقت وإعادة هيكلة استعلامات قاعدة البيانات متوسط زمن استجابتها بنحو 60%.",
      problemTitle: "المشكلة",
      problem:
        "نقطة حرجة في تطبيق ويب لأحد العملاء — واجهة API مبنية بـ Node.js / Express وMongoDB، مع واجهة أمامية بـ React — كانت تحتاج إلى زمن استجابة أقل.",
      solutionTitle: "الحل",
      solution:
        "أعدت هيكلة استعلامات قاعدة البيانات خلف النقطة، وأضفت طبقة تخزين مؤقت للقراءات المتكررة. وبقي التحقق من المدخلات ومعالجة الأخطاء وعقد الاستجابة متسقاً مع بقية واجهة REST API.",
      architectureTitle: "البنية",
      architecture: [
        { name: "العميل", detail: "واجهة أمامية مبنية بـ React." },
        { name: "API", detail: "نقطة Node.js / Express بتحقق موحّد ومعالجة متسقة للأخطاء." },
        { name: "التخزين المؤقت", detail: "طبقة تخزين مؤقت للقراءات المتكررة." },
        { name: "البيانات", detail: "استعلامات MongoDB مُعاد هيكلتها." }
      ],
      metricsTitle: "النتيجة",
      metrics: [{ value: "~60%", label: "انخفاض في متوسط زمن استجابة نقطة API حرجة" }],
      lessonsTitle: "كيف أتعامل مع تحسين الأداء",
      lessons: [
        "القياس أولاً — فالتكلفة الحقيقية نادراً ما تكون حيث تنظر أولاً.",
        "أصلح الاستعلام أولاً ثم أضف التخزين المؤقت؛ فالتخزين فوق استعلام بطيء يخفي المشكلة فقط.",
        "أحافظ على ثبات عقد الاستجابة، كي يُنشر تحسين الأداء كأي تغيير عادي."
      ]
    },
    howIWork: {
      eyebrow: "كيف أعمل",
      title: "عادات قليلة أطبّقها باستمرار.",
      description: "بلا مظاهر إجرائية — فقط ما أعتمد عليه فعلاً.",
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
        description: "لوحات إدارة وأدوات داخلية بمصادقة وصلاحيات حسب الأدوار وسجلات تدقيق وواجهات REST API واضحة — مثل OKKP."
      },
      {
        title: "بحث ذكي في المستندات",
        description: "RAG في ملفات PDF وWord وExcel، وOCR للمستندات الممسوحة، وبحث هجين بالكلمات المفتاحية والمعنى، ومسارات FastAPI."
      },
      {
        title: "لوحات مؤشرات وتقارير",
        description: "لوحات KPI ورسوم بيانية وتصدير إلى Excel يستخدمها فريقك دون الحاجة إلى مطوّر."
      },
      {
        title: "أداء API والخدمات الخلفية",
        description: "تحليل النقاط البطيئة، والتخزين المؤقت، وإعادة هيكلة الاستعلامات، وتحقق موحّد ومعالجة متسقة للأخطاء."
      }
    ],
    availableBody: "حضورياً أو بنظام هجين في موسكو، أو عن بُعد. أبني تطبيقات ويب متكاملة ولوحات تحكم وأدوات مدعومة بالذكاء الاصطناعي.",
    credibilityItems: [
      {
        title: "تسليم من البداية إلى النهاية",
        body: "واجهات أمامية وخدمات خلفية وقواعد بيانات ومصادقة ولوحات تحكم ونشر وتوثيق — شخص واحد مسؤول عن المسار كله."
      },
      {
        title: "هندسة في خدمة الأعمال",
        body: "أبني أنظمة تحل مشكلات تشغيلية حقيقية، لا مجرد واجهات جميلة."
      },
      {
        title: "ذكاء اصطناعي عملي",
        body: "خبرة عملية في RAG وOCR والبحث الهجين، مبنية لمستندات حقيقية وسير عمل حقيقي."
      }
    ],
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
    projectResultLabel: "النتيجة",
    projectLiveDemo: "عرض حيّ",
    projectViewGithubLabel: "GitHub",
    projectBackLabel: "العودة إلى المشاريع",
    projectTechStackLabel: "التقنيات",
    projectWhatItDoesLabel: "ماذا يفعل"
  }
};
