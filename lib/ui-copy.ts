import { copyByLocale } from "@/lib/copy";
import { typographArDeep, typographRuDeep } from "@/lib/typograph";
import type { Locale } from "@/lib/types";

/** Strings for the UI chrome and interactions. Career facts live in copy.ts. */
type UiCopy = {
  greeting: { morning: string; afternoon: string; evening: string; night: string };
  heroIntro: string;
  heroScroll: string;
  currentlyLabel: string;
  currentlyValue: string;
  aboutStoryTitle: string;
  aboutStory: { label: string; body: string }[];
  nextProject: string;
  prevProject: string;
  allProjects: string;
  command: {
    open: string;
    placeholder: string;
    sections: string;
    actions: string;
    copyEmail: string;
    toggleTheme: string;
    downloadCv: string;
    /** Opens the /cv page. */
    openCv: string;
    empty: string;
  };
  toastEmailCopied: string;
  toastEasterEgg: string;
  copyEmail: string;
  copyTelegram: string;
  telegramLabel: string;
  form: {
    sending: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    /** Shown in the inline error box, followed by the email address, copy button and mail link. */
    error: string;
    required: string;
    invalidEmail: string;
    reasonLabel: string;
    reasons: { hiring: string; freelance: string; other: string };
    messagePlaceholder: string;
    openMailApp: string;
    tooFast: string;
  };
  footerLocalTime: string;
  footerBackToTop: string;
  footerTagline: string;
  cursorView: string;
  cursorOpen: string;
  cursorHi: string;
  notFoundJoke: string;
  // Projects
  caseStudyCta: string;
  privateCode: string;
  /** Freelance work whose code belongs to the client (not an NDA): short badge. */
  privateCodeClient: string;
  /** Phones: toggle that expands a compact open-source project row into the full card. */
  showDetails: string;
  hideDetails: string;
  workProject: string;
  openSource: string;
  workProjectsTitle: string;
  openSourceTitle: string;
  /** Employer projects: the code is under NDA. */
  diagramNote: string;
  /** Freelance projects (`codeNote: "client"`): the code belongs to the client. */
  diagramNoteClient: string;
  liveBadge: string;
  /** Used as `${name} ${previewAlt}`. */
  previewAlt: string;
  overview: string;
  // Navigation
  menuOpen: string;
  menuClose: string;
  primaryNav: string;
  languageNames: Record<Locale, string>;
  city: string;
  // Experience
  educationTitle: string;
  certificationsTitle: string;
  /** Experience: toggle for the bullets beyond the first two. */
  showMore: string;
  showLess: string;
  stackLabel: string;
  // Repositories
  viewAllRepos: string;
  repoFilterLabel: string;
  repoCategories: { all: string; platform: string; backend: string; ai: string; frontend: string };
  /** Short label for the email button in the phone contact bar. */
  emailShort: string;
  /** Accessible name of the phone contact bar. */
  contactBarLabel: string;
  errorPage: { title: string; body: string; retry: string; home: string };
  availabilityLine: string;
  /** Case-study pages: the full diagram scrolls sideways on phones. */
  diagram: { region: string; swipe: string; openFull: string };
  /** Closing call to action at the end of every case study. */
  projectCta: { eyebrow: string; title: string; body: string; contact: string };
  /** Localized document titles; the server metadata stays English. */
  meta: { homeTitle: string; nameSuffix: string };
  /** Certifications: link to the public credential, shown only when a URL is set. */
  verify: string;
  /** /projects/archive: every project and curated repository in one table. */
  archive: {
    eyebrow: string;
    title: string;
    description: string;
    /** Link from the Projects and GitHub sections. */
    linkLabel: string;
    metaTitle: string;
    columns: { year: string; project: string; context: string; stack: string; links: string };
    context: { job: string; freelance: string; openSource: string };
    caseStudy: string;
    /** Screen-reader text for the "—" shown when a year is not known. */
    unknownYear: string;
  };
  /** /cv: the printable one-page CV. */
  cv: {
    metaTitle: string;
    toolbarLabel: string;
    downloadPdf: string;
    print: string;
    summary: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    certifications: string;
    languages: string;
    contacts: string;
    portfolio: string;
  };
  /** Desktop side navigation on the home page (accessible name of the <nav>). */
  sectionRail: { label: string };
  /** Footer disclosure: how the site is built. `body` is prose; `source` labels the repository link. */
  colophon: { summary: string; items: { title: string; body: string }[]; source: string };
  /** /notes (only linked when NOTES_ENABLED, see lib/notes-config.ts). */
  notes: {
    navLabel: string;
    eyebrow: string;
    title: string;
    description: string;
    metaTitle: string;
    /** `{n}` = minutes. Keys are Intl.PluralRules categories; `other` is the fallback. */
    readingTime: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
    toc: string;
    previous: string;
    next: string;
    back: string;
    rss: string;
  };
};

const LANGUAGE_NAMES: Record<Locale, string> = { en: "English", ru: "Русский", ar: "العربية" };

export const uiCopy: Record<Locale, UiCopy> = {
  en: {
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      night: "Hello, night owl"
    },
    heroIntro:
      "Full-stack & Python developer in Moscow: React + TypeScript up front, Node.js or FastAPI behind it. In 2025 I built the OKKP operations platform from scratch as Chief Full-Stack Developer at Avenue Group.",
    heroScroll: "Scroll to explore",
    currentlyLabel: "Currently",
    currentlyValue: "building RAG search with FastAPI & FAISS at Elektroservis",
    aboutStoryTitle: "The short story.",
    aboutStory: [
      {
        label: "Where it started",
        body: "In 2020 I took on my first freelance clients — scoping, estimating, delivering and supporting the work myself."
      },
      {
        label: "Building with real teams",
        body: "At Avenue Group I designed and shipped the OKKP platform from scratch as Chief Full-Stack Developer, from architecture to deployment and production support."
      },
      {
        label: "Where I am now",
        body: "Today I build RAG search over engineering documents at Elektroservis in Moscow — FastAPI, OCR, sentence-transformers and FAISS — with a Master's from NUST MISIS (2024–2026) behind me."
      }
    ],
    nextProject: "Next project",
    prevProject: "Previous project",
    allProjects: "All projects",
    command: {
      open: "Quick menu",
      placeholder: "Type a command or jump to…",
      sections: "Sections",
      actions: "Actions",
      copyEmail: "Copy email address",
      toggleTheme: "Toggle light / dark",
      downloadCv: "Download CV",
      openCv: "Open CV page",
      empty: "Nothing found."
    },
    toastEmailCopied: "Email copied — talk soon!",
    toastEasterEgg: "You found the secret. You clearly pay attention to detail — let's work together.",
    copyEmail: "Copy email",
    copyTelegram: "Copy Telegram handle",
    telegramLabel: "Telegram",
    form: {
      sending: "Sending…",
      successTitle: "Message received!",
      successBody: "Thank you for reaching out. I'll reply within 48 hours.",
      sendAnother: "Send another",
      error: "Your message couldn't be sent. Nothing you typed is lost — you can also email me directly:",
      required: "Please fill in this field.",
      invalidEmail: "Please enter a valid email.",
      reasonLabel: "What is this about?",
      reasons: { hiring: "Hiring for a role", freelance: "Freelance project", other: "Something else" },
      messagePlaceholder: "Tell me about the role or project…",
      openMailApp: "Open email app",
      tooFast: "Too many messages in a short time. Please email me directly instead:"
    },
    footerLocalTime: "My local time",
    footerBackToTop: "Back to top",
    // Rendered as `${footerTagline} ${footerBuiltWith}.`
    footerTagline: "Designed and built by me",
    cursorView: "View",
    cursorOpen: "Open",
    cursorHi: "Hi!",
    notFoundJoke: "This page went to production without a test. Let's get you somewhere real.",
    caseStudyCta: "Read case study",
    privateCode: "Private code · NDA",
    privateCodeClient: "Private code · client-owned",
    showDetails: "Show details",
    hideDetails: "Hide details",
    workProject: "Work project",
    openSource: "Open source",
    workProjectsTitle: "Work projects",
    openSourceTitle: "Open-source projects",
    diagramNote: "The code is private (NDA), so this diagram shows the architecture I built.",
    diagramNoteClient: "The code belongs to the client, so this diagram shows the architecture I built.",
    liveBadge: "Live",
    previewAlt: "preview",
    overview: "Overview",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    primaryNav: "Primary navigation",
    languageNames: LANGUAGE_NAMES,
    city: "Moscow",
    educationTitle: "Education",
    certificationsTitle: "Certifications",
    showMore: "More",
    showLess: "Less",
    stackLabel: "Stack",
    viewAllRepos: "View all repositories",
    repoFilterLabel: "Filter repositories",
    repoCategories: {
      all: "All",
      platform: "Platform & DevOps",
      backend: "Backend",
      ai: "AI & ML",
      frontend: "Frontend"
    },
    emailShort: "Email",
    contactBarLabel: "Quick contact",
    errorPage: {
      title: "Something went wrong",
      body: "This page didn't load as expected. Try again, or head back to the home page.",
      retry: "Try again",
      home: "Back to home"
    },
    availabilityLine: "Available immediately · Moscow on-site/hybrid or remote · full-time or contract",
    diagram: {
      region: "Architecture diagram",
      swipe: "Swipe sideways to see the whole diagram",
      openFull: "Open full size"
    },
    projectCta: {
      eyebrow: "What's next",
      title: "Hiring for a full-stack, Python or AI role — or need something like this built? Let's talk.",
      body: "I'm available immediately — on-site or hybrid in Moscow, or remote; full-time or contract. I reply within 48 hours — faster on Telegram.",
      contact: "Get in touch"
    },
    meta: {
      homeTitle: "Alhassan Alfarran — Full-Stack & Python Developer, Moscow",
      nameSuffix: "Alhassan Alfarran"
    },
    verify: "Verify",
    archive: {
      eyebrow: "Archive",
      title: "Every project, in one table.",
      description:
        "Work, freelance and open-source projects plus the hand-picked GitHub repositories — by year, context and stack.",
      linkLabel: "Full project archive",
      metaTitle: "Project archive",
      columns: { year: "Year", project: "Project", context: "Context", stack: "Stack", links: "Links" },
      context: { job: "Work", freelance: "Freelance", openSource: "Open source" },
      caseStudy: "Case study",
      unknownYear: "Year not specified"
    },
    cv: {
      metaTitle: "CV",
      toolbarLabel: "CV actions",
      downloadPdf: "Download PDF",
      print: "Print",
      summary: "Summary",
      experience: "Experience",
      projects: "Selected projects",
      skills: "Skills",
      education: "Education",
      certifications: "Certifications",
      languages: "Languages",
      contacts: "Contacts",
      portfolio: "Portfolio"
    },
    sectionRail: { label: "Page sections" },
    colophon: {
      summary: "How this site is built",
      items: [
        {
          title: "Stack",
          body: "Next.js (App Router) and React, styled with Tailwind CSS and animated with Framer Motion. The contact form sends email through Resend; the site is hosted on Vercel."
        },
        {
          title: "Three languages, one layout",
          body: "English, Russian and Arabic share one URL and one set of components. The layout uses logical CSS properties (start/end instead of left/right), so Arabic mirrors right to left without separate styles. A small script sets the language and text direction before the first paint, so nothing flips after loading, and the Arabic font is only downloaded when Arabic text is on screen."
        },
        {
          title: "Performance and accessibility",
          body: "Sections below the first screen skip rendering until you scroll near them, and the quick menu loads on first use. Everything works from the keyboard, with a skip link and visible focus, and animations switch off when your system asks for reduced motion."
        }
      ],
      source: "Source code on GitHub"
    },
    notes: {
      navLabel: "Notes",
      eyebrow: "Notes",
      title: "Notes on building software.",
      description: "Short write-ups on engineering work: architecture, tooling and lessons from real projects.",
      metaTitle: "Notes",
      readingTime: { one: "{n} min read", other: "{n} min read" },
      toc: "On this page",
      previous: "Previous note",
      next: "Next note",
      back: "All notes",
      rss: "RSS feed"
    }
  },
  ru: {
    greeting: {
      morning: "Доброе утро",
      afternoon: "Добрый день",
      evening: "Добрый вечер",
      night: "Привет, полуночник"
    },
    heroIntro:
      "Full-stack / Python-разработчик из Москвы: React и TypeScript на фронтенде, Node.js или FastAPI на бэкенде. В 2025 году в Avenue Group с нуля построил платформу OKKP как главный full-stack разработчик.",
    heroScroll: "Листайте дальше",
    currentlyLabel: "Сейчас",
    currentlyValue: "строю RAG-поиск на FastAPI и FAISS в «Электросервисе»",
    aboutStoryTitle: "Коротко обо мне.",
    aboutStory: [
      {
        label: "С чего всё началось",
        body: "В 2020 году я взял первые заказы на фрилансе: сам ставил задачу, оценивал сроки, разрабатывал и поддерживал результат."
      },
      {
        label: "Работа в командах",
        body: "В Avenue Group как главный full-stack разработчик я с нуля спроектировал и запустил платформу OKKP — от архитектуры до деплоя и поддержки в продакшене."
      },
      {
        label: "Где я сейчас",
        body: "Сейчас в «Электросервисе» в Москве строю RAG-поиск по технической документации на FastAPI, OCR, sentence-transformers и FAISS; за плечами — магистратура НИТУ МИСИС (2024–2026)."
      }
    ],
    nextProject: "Следующий проект",
    prevProject: "Предыдущий проект",
    allProjects: "Все проекты",
    command: {
      open: "Быстрое меню",
      placeholder: "Введите команду или раздел…",
      sections: "Разделы",
      actions: "Действия",
      copyEmail: "Скопировать email",
      toggleTheme: "Светлая / тёмная тема",
      downloadCv: "Скачать резюме",
      openCv: "Открыть резюме на сайте",
      empty: "Ничего не найдено."
    },
    toastEmailCopied: "Email скопирован — до связи!",
    toastEasterEgg: "Вы нашли секрет. Похоже, вы внимательны к деталям — давайте работать вместе.",
    copyEmail: "Скопировать email",
    copyTelegram: "Скопировать ник в Telegram",
    telegramLabel: "Telegram",
    form: {
      sending: "Отправка…",
      successTitle: "Сообщение получено!",
      successBody: "Спасибо, что написали. Отвечу в течение 48 часов.",
      sendAnother: "Отправить ещё",
      error: "Не удалось отправить сообщение. Текст сохранён — можно написать мне напрямую на почту:",
      required: "Заполните это поле.",
      invalidEmail: "Введите корректный email.",
      reasonLabel: "Тема обращения",
      reasons: { hiring: "Вакансия", freelance: "Проект на фрилансе", other: "Другое" },
      messagePlaceholder: "Расскажите о вакансии или проекте…",
      openMailApp: "Открыть почтовое приложение",
      tooFast: "Слишком много сообщений за короткое время. Напишите мне напрямую на почту:"
    },
    footerLocalTime: "Моё местное время",
    footerBackToTop: "Наверх",
    footerTagline: "Спроектировал и сделал сам.",
    cursorView: "Смотреть",
    cursorOpen: "Открыть",
    cursorHi: "Привет!",
    notFoundJoke: "Эта страница ушла в прод без тестов. Давайте вернёмся туда, где всё работает.",
    caseStudyCta: "Читать кейс",
    privateCode: "Закрытый код · NDA",
    privateCodeClient: "Закрытый код · принадлежит клиенту",
    showDetails: "Подробнее",
    hideDetails: "Свернуть",
    workProject: "Коммерческий проект",
    openSource: "Open source",
    workProjectsTitle: "Коммерческие проекты",
    openSourceTitle: "Open-source проекты",
    diagramNote: "Код закрыт (NDA), поэтому здесь схема архитектуры, которую я построил.",
    diagramNoteClient: "Код принадлежит клиенту, поэтому здесь схема архитектуры, которую я построил.",
    liveBadge: "Онлайн",
    previewAlt: "— превью",
    overview: "Обзор",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    primaryNav: "Основная навигация",
    languageNames: LANGUAGE_NAMES,
    city: "Москва",
    educationTitle: "Образование",
    certificationsTitle: "Сертификаты",
    showMore: "Ещё",
    showLess: "Свернуть",
    stackLabel: "Стек",
    viewAllRepos: "Все репозитории",
    repoFilterLabel: "Фильтр репозиториев",
    repoCategories: {
      all: "Все",
      platform: "Платформа и DevOps",
      backend: "Бэкенд",
      ai: "AI и ML",
      frontend: "Фронтенд"
    },
    emailShort: "Почта",
    contactBarLabel: "Быстрая связь",
    errorPage: {
      title: "Что-то пошло не так",
      body: "Страница загрузилась не так, как нужно. Попробуйте ещё раз или вернитесь на главную.",
      retry: "Попробовать снова",
      home: "На главную"
    },
    availabilityLine: "Готов приступить сразу · Москва: офис или гибрид, либо удалённо · полная занятость или контракт",
    diagram: {
      region: "Схема архитектуры",
      swipe: "Листайте в сторону, чтобы увидеть всю схему",
      openFull: "Открыть в полном размере"
    },
    projectCta: {
      eyebrow: "Что дальше",
      title: "Ищете full-stack, Python- или AI-разработчика — или нужно сделать что-то похожее? Давайте обсудим.",
      body: "Готов приступить сразу: офис или гибрид в Москве, либо удалённо; полная занятость или контракт. Отвечаю в течение 48 часов, в Telegram — быстрее.",
      contact: "Связаться"
    },
    meta: {
      homeTitle: "Альхассан Альфарран — Full-stack / Python-разработчик, Москва",
      nameSuffix: "Альхассан Альфарран"
    },
    verify: "Проверить",
    archive: {
      eyebrow: "Архив",
      title: "Все проекты в одной таблице.",
      description:
        "Коммерческие, фриланс- и open-source-проекты, а также отобранные репозитории GitHub — по годам, контексту и стеку.",
      linkLabel: "Полный архив проектов",
      metaTitle: "Архив проектов",
      columns: { year: "Год", project: "Проект", context: "Контекст", stack: "Стек", links: "Ссылки" },
      context: { job: "Работа", freelance: "Фриланс", openSource: "Open source" },
      caseStudy: "Кейс",
      unknownYear: "Год не указан"
    },
    cv: {
      metaTitle: "Резюме",
      toolbarLabel: "Действия с резюме",
      downloadPdf: "Скачать PDF",
      print: "Печать",
      summary: "О себе",
      experience: "Опыт работы",
      projects: "Избранные проекты",
      skills: "Навыки",
      education: "Образование",
      certifications: "Сертификаты",
      languages: "Языки",
      contacts: "Контакты",
      portfolio: "Портфолио"
    },
    sectionRail: { label: "Разделы страницы" },
    colophon: {
      summary: "Как устроен этот сайт",
      items: [
        {
          title: "Стек",
          body: "Next.js (App Router) и React, стили на Tailwind CSS, анимации на Framer Motion. Форма обратной связи отправляет письма через Resend, сайт размещён на Vercel."
        },
        {
          title: "Три языка, одна вёрстка",
          body: "Английская, русская и арабская версии открываются по одному адресу и собраны из одних и тех же компонентов. В вёрстке используются логические CSS-свойства (start/end вместо left/right), поэтому арабская версия отражается справа налево без отдельных стилей. Небольшой скрипт выставляет язык и направление текста ещё до первой отрисовки, так что после загрузки ничего не перескакивает, а арабский шрифт загружается, только когда на экране есть арабский текст."
        },
        {
          title: "Скорость и доступность",
          body: "Секции ниже первого экрана не отрисовываются, пока страница не прокручена до них, а быстрое меню загружается при первом открытии. Всем можно пользоваться с клавиатуры — есть ссылка для перехода к содержимому и заметный фокус, — а анимации отключаются, если в системе включено уменьшение движения."
        }
      ],
      source: "Исходный код на GitHub"
    },
    notes: {
      navLabel: "Заметки",
      eyebrow: "Заметки",
      title: "Заметки о разработке.",
      description: "Короткие разборы инженерной работы: архитектура, инструменты и выводы из реальных проектов.",
      metaTitle: "Заметки",
      readingTime: { other: "{n} мин чтения" },
      toc: "Содержание",
      previous: "Предыдущая заметка",
      next: "Следующая заметка",
      back: "Все заметки",
      rss: "RSS-лента"
    }
  },
  ar: {
    greeting: {
      morning: "صباح الخير",
      afternoon: "مساء الخير",
      evening: "مساء الخير",
      night: "أهلاً يا ساهر الليل"
    },
    heroIntro:
      "مطوّر Full-Stack وPython في موسكو: React وTypeScript في الواجهة، وNode.js أو FastAPI في الخلفية. في 2025 بنيتُ منصة OKKP من الصفر بصفتي كبير مطوري Full-Stack في Avenue Group.",
    heroScroll: "مرّر للاستكشاف",
    currentlyLabel: "حالياً",
    currentlyValue: "أبني نظام بحث RAG باستخدام FastAPI وFAISS في Elektroservis",
    aboutStoryTitle: "القصة باختصار.",
    aboutStory: [
      {
        label: "البداية",
        body: "في عام 2020 بدأت العمل مع أول عملائي كمطوّر مستقل: أحدّد النطاق وأقدّر الجهد وأسلّم العمل وأدعمه بنفسي."
      },
      {
        label: "العمل مع فرق حقيقية",
        body: "في Avenue Group صمّمت منصة OKKP وأطلقتها من الصفر بصفتي كبير مطوري Full-Stack، من البنية حتى النشر والدعم في بيئة الإنتاج."
      },
      {
        label: "أين أنا الآن",
        body: "أبني اليوم في Elektroservis بموسكو بحث RAG في الوثائق الهندسية باستخدام FastAPI وOCR وsentence-transformers وFAISS، بعد دراسة الماجستير في جامعة MISIS (2024–2026)."
      }
    ],
    nextProject: "المشروع التالي",
    prevProject: "المشروع السابق",
    allProjects: "كل المشاريع",
    command: {
      open: "القائمة السريعة",
      placeholder: "اكتب أمراً أو انتقل إلى…",
      sections: "الأقسام",
      actions: "إجراءات",
      copyEmail: "نسخ البريد الإلكتروني",
      toggleTheme: "تبديل الوضع الفاتح / الداكن",
      downloadCv: "تحميل السيرة الذاتية",
      openCv: "فتح صفحة السيرة الذاتية",
      empty: "لا توجد نتائج."
    },
    toastEmailCopied: "تم نسخ البريد — نتحدث قريباً!",
    toastEasterEgg: "لقد وجدت السرّ. من الواضح أنك تهتم بالتفاصيل — لنعمل معاً.",
    copyEmail: "نسخ البريد",
    copyTelegram: "نسخ معرّف Telegram",
    telegramLabel: "Telegram",
    form: {
      sending: "جارٍ الإرسال…",
      successTitle: "وصلتني رسالتك!",
      successBody: "شكراً لتواصلك. سأردّ خلال 48 ساعة.",
      sendAnother: "إرسال رسالة أخرى",
      error: "تعذّر إرسال الرسالة. ما كتبته لم يُفقد — ويمكنك أيضاً مراسلتي مباشرة عبر البريد:",
      required: "يرجى تعبئة هذا الحقل.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      reasonLabel: "موضوع الرسالة",
      reasons: { hiring: "عرض وظيفة", freelance: "مشروع عمل حر", other: "موضوع آخر" },
      messagePlaceholder: "أخبرني عن الوظيفة أو المشروع…",
      openMailApp: "فتح تطبيق البريد",
      tooFast: "رسائل كثيرة خلال وقت قصير. راسلني مباشرة عبر البريد بدلاً من ذلك:"
    },
    footerLocalTime: "توقيتي المحلي",
    footerBackToTop: "العودة إلى الأعلى",
    footerTagline: "صمّمته وبنيته بنفسي.",
    cursorView: "عرض",
    cursorOpen: "فتح",
    cursorHi: "أهلاً!",
    notFoundJoke: "هذه الصفحة وصلت إلى الإنتاج دون اختبار. لنعدك إلى صفحة تعمل.",
    caseStudyCta: "اقرأ دراسة الحالة",
    privateCode: "كود خاص · NDA",
    privateCodeClient: "كود خاص · ملك للعميل",
    showDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",
    workProject: "مشروع عمل",
    openSource: "مفتوح المصدر",
    workProjectsTitle: "مشاريع العمل",
    openSourceTitle: "مشاريع مفتوحة المصدر",
    diagramNote: "الكود خاص (NDA)، لذا يوضّح هذا المخطط البنية التي بنيتها.",
    diagramNoteClient: "الكود ملك للعميل، لذا يوضّح هذا المخطط البنية التي بنيتها.",
    liveBadge: "مباشر",
    previewAlt: "— معاينة",
    overview: "نظرة عامة",
    menuOpen: "فتح القائمة",
    menuClose: "إغلاق القائمة",
    primaryNav: "التنقل الرئيسي",
    languageNames: LANGUAGE_NAMES,
    city: "موسكو",
    educationTitle: "التعليم",
    certificationsTitle: "الشهادات",
    showMore: "المزيد",
    showLess: "أقل",
    stackLabel: "التقنيات",
    viewAllRepos: "عرض كل المستودعات",
    repoFilterLabel: "تصفية المستودعات",
    repoCategories: {
      all: "الكل",
      platform: "المنصات وDevOps",
      backend: "الخدمات الخلفية",
      ai: "الذكاء الاصطناعي",
      frontend: "الواجهات الأمامية"
    },
    emailShort: "البريد",
    contactBarLabel: "تواصل سريع",
    errorPage: {
      title: "حدث خطأ غير متوقع",
      body: "لم تُحمَّل هذه الصفحة كما ينبغي. جرّب مرة أخرى أو عُد إلى الصفحة الرئيسية.",
      retry: "إعادة المحاولة",
      home: "العودة إلى الرئيسية"
    },
    availabilityLine: "متاح فوراً · حضورياً أو بنظام هجين في موسكو أو عن بُعد · دوام كامل أو بعقد",
    diagram: {
      region: "مخطط البنية",
      swipe: "مرّر أفقياً لرؤية المخطط كاملاً",
      openFull: "فتح بالحجم الكامل"
    },
    projectCta: {
      eyebrow: "الخطوة التالية",
      title: "تبحث عن مطوّر Full-Stack أو Python أو ذكاء اصطناعي — أو تحتاج إلى بناء شيء مشابه؟ لنتحدث.",
      body: "متاح فوراً — حضورياً أو بنظام هجين في موسكو، أو عن بُعد؛ بدوام كامل أو بعقد. أردّ خلال 48 ساعة — وأسرع عبر Telegram.",
      contact: "تواصل معي"
    },
    meta: {
      homeTitle: "الحسن الفران — مطوّر Full-Stack وPython، موسكو",
      nameSuffix: "الحسن الفران"
    },
    verify: "تحقّق",
    archive: {
      eyebrow: "الأرشيف",
      title: "كل المشاريع في جدول واحد.",
      description:
        "مشاريع العمل والعمل الحر والمشاريع مفتوحة المصدر، إلى جانب مستودعات GitHub المختارة — حسب السنة والسياق والتقنيات.",
      linkLabel: "الأرشيف الكامل للمشاريع",
      metaTitle: "أرشيف المشاريع",
      columns: { year: "السنة", project: "المشروع", context: "السياق", stack: "التقنيات", links: "الروابط" },
      context: { job: "عمل", freelance: "عمل حر", openSource: "مفتوح المصدر" },
      caseStudy: "دراسة الحالة",
      unknownYear: "السنة غير محددة"
    },
    cv: {
      metaTitle: "السيرة الذاتية",
      toolbarLabel: "إجراءات السيرة الذاتية",
      downloadPdf: "تحميل PDF",
      print: "طباعة",
      summary: "نبذة",
      experience: "الخبرة",
      projects: "مشاريع مختارة",
      skills: "المهارات",
      education: "التعليم",
      certifications: "الشهادات",
      languages: "اللغات",
      contacts: "التواصل",
      portfolio: "الموقع"
    },
    sectionRail: { label: "أقسام الصفحة" },
    colophon: {
      summary: "كيف بُني هذا الموقع",
      items: [
        {
          title: "التقنيات",
          body: "Next.js (App Router) وReact، مع Tailwind CSS للتنسيق وFramer Motion للحركة. يُرسل نموذج التواصل الرسائل عبر Resend، والموقع مستضاف على Vercel."
        },
        {
          title: "ثلاث لغات وتصميم واحد",
          body: "النسخ الإنجليزية والروسية والعربية على الرابط نفسه وتستخدم المكوّنات نفسها. يعتمد التصميم على خصائص CSS المنطقية (start/end بدلاً من left/right)، فتنعكس النسخة العربية من اليمين إلى اليسار دون أنماط منفصلة. ويحدّد سكربت صغير لغة الصفحة واتجاه النص قبل أول عرض لها، فلا ينقلب شيء بعد التحميل، ولا يُنزَّل الخط العربي إلا عند ظهور نص عربي على الشاشة."
        },
        {
          title: "الأداء وسهولة الوصول",
          body: "لا تُعرض الأقسام الواقعة أسفل الشاشة الأولى إلا عند الاقتراب منها، ولا تُحمَّل القائمة السريعة إلا عند أول استخدام لها. يمكن استخدام كل شيء من لوحة المفاتيح، مع رابط للانتقال مباشرة إلى المحتوى وتركيز ظاهر، وتتوقف الحركة إذا طلب نظامك تقليلها."
        }
      ],
      source: "الكود المصدري على GitHub"
    },
    notes: {
      navLabel: "ملاحظات",
      eyebrow: "ملاحظات",
      title: "ملاحظات عن تطوير البرمجيات.",
      description: "كتابات قصيرة عن العمل الهندسي: البنية والأدوات والدروس المستفادة من مشاريع حقيقية.",
      metaTitle: "ملاحظات",
      readingTime: {
        one: "قراءة في دقيقة واحدة",
        two: "قراءة في دقيقتين",
        few: "قراءة في {n} دقائق",
        many: "قراءة في {n} دقيقة",
        other: "قراءة في {n} دقيقة"
      },
      toc: "المحتويات",
      previous: "الملاحظة السابقة",
      next: "الملاحظة التالية",
      back: "كل الملاحظات",
      rss: "خلاصة RSS"
    }
  }
};

export const CONTACT_EMAIL = "kyan775909@gmail.com";
export const GITHUB_URL = "https://github.com/kyan9400";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alhassan-alfarran-880b00246/";
export const TELEGRAM_URL = "https://t.me/hassan775775";
export const TELEGRAM_HANDLE = "@hassan775775";

/** Used when NEXT_PUBLIC_SITE_URL is unset or not an absolute http(s) URL. cv-src/render.mjs reads this line. */
export const DEFAULT_SITE_URL = "https://alhassan-portfolio-sigma.vercel.app";

/** Absolute origin without a trailing slash, from NEXT_PUBLIC_SITE_URL (e.g. "https://example.com"); inlined at build time. */
function resolveSiteUrl(value: string | undefined): string {
  if (!value?.trim()) return DEFAULT_SITE_URL;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return DEFAULT_SITE_URL;
    return `${url.protocol}//${url.host}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** The canonical origin: metadata, sitemap, robots, OG images, JSON-LD, RSS and the CV page all use it. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
/** SITE_URL without the scheme, for display ("example.com"). */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

function buildCopy(locale: Locale) {
  const copy = { ...copyByLocale[locale], ui: uiCopy[locale] };
  // Russian and Arabic get no-break spaces where a line must not break (see lib/typograph.ts).
  if (locale === "ru") return typographRuDeep(copy);
  if (locale === "ar") return typographArDeep(copy);
  return copy;
}

type BuiltCopy = ReturnType<typeof buildCopy>;
const copyCache: Partial<Record<Locale, BuiltCopy>> = {};

/** Copy for one locale; built once per locale and then reused (a stable object). */
export function getCopy(locale: Locale): BuiltCopy {
  return (copyCache[locale] ??= buildCopy(locale));
}

export type Copy = ReturnType<typeof getCopy>;
