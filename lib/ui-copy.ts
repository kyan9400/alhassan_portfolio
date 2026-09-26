import { copyByLocale } from "@/lib/copy";
import { typographRuDeep } from "@/lib/typograph";
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
    empty: string;
  };
  toastEmailCopied: string;
  toastEasterEgg: string;
  copyEmail: string;
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
  workProject: string;
  openSource: string;
  workProjectsTitle: string;
  openSourceTitle: string;
  diagramNote: string;
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
  /** Phones show a few certifications first; followed by the total count in brackets. */
  showAllCertifications: string;
  stackLabel: string;
  // Repositories
  viewAllRepos: string;
  repoFilterLabel: string;
  repoCategories: { all: string; platform: string; backend: string; ai: string; frontend: string };
  // Marquee (proof strip) pause control, WCAG 2.2.2
  marqueePause: string;
  marqueePlay: string;
  errorPage: { title: string; body: string; retry: string; home: string };
  availabilityLine: string;
  /** Case-study pages: the full diagram scrolls sideways on phones. */
  diagram: { region: string; swipe: string; openFull: string };
  /** Closing call to action at the end of every case study. */
  projectCta: { eyebrow: string; title: string; body: string; contact: string };
  /** Accessible name of the "How I build / How I work" tab list. */
  approachTabsLabel: string;
  /** Localized document titles; the server metadata stays English. */
  meta: { homeTitle: string; nameSuffix: string };
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
      "I'm Alhassan — a Moscow-based software engineer who turns messy workflows into clear, reliable web and AI products.",
    heroScroll: "Scroll to explore",
    currentlyLabel: "Currently",
    currentlyValue: "building RAG search with FastAPI & FAISS at Elektroservis",
    aboutStoryTitle: "The short story.",
    aboutStory: [
      {
        label: "Where it started",
        body: "In 2020 I took on my first freelance clients while starting a Bachelor's in Computer Science at Ural Federal University — and learned fast that software is only as good as the problem it solves."
      },
      {
        label: "Building with real teams",
        body: "At Avenue Group I designed and shipped the OKKP platform from scratch as Chief Full-Stack Developer. At Junzi Tech Solutions I cut a critical endpoint's average response time by about 60%."
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
      empty: "Nothing found."
    },
    toastEmailCopied: "Email copied — talk soon!",
    toastEasterEgg: "You found the secret. You clearly pay attention to detail — let's work together.",
    copyEmail: "Copy email",
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
    footerTagline: "Designed & built with care.",
    cursorView: "View",
    cursorOpen: "Open",
    cursorHi: "Hi!",
    notFoundJoke: "This page went to production without a test. Let's get you somewhere real.",
    caseStudyCta: "Read case study",
    privateCode: "Private code · NDA",
    workProject: "Work project",
    openSource: "Open source",
    workProjectsTitle: "Work projects",
    openSourceTitle: "Open-source projects",
    diagramNote: "The code is private (NDA), so this diagram shows the architecture I built.",
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
    showAllCertifications: "Show all certifications",
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
    marqueePause: "Pause the moving strip",
    marqueePlay: "Play the moving strip",
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
      title: "Hiring for a full-stack, Python or AI role? Let's talk.",
      body: "I'm available immediately — on-site or hybrid in Moscow, or remote; full-time or contract. I usually reply within 48 hours.",
      contact: "Get in touch"
    },
    approachTabsLabel: "How I build and how I work",
    meta: {
      homeTitle: "Alhassan Alfarran — Software Engineer (Web & AI Systems)",
      nameSuffix: "Alhassan Alfarran"
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
      "Я Альхассан — инженер-программист из Москвы. Превращаю запутанные процессы в понятные и надёжные веб- и AI-продукты.",
    heroScroll: "Листайте дальше",
    currentlyLabel: "Сейчас",
    currentlyValue: "строю RAG-поиск на FastAPI и FAISS в «Электросервисе»",
    aboutStoryTitle: "Коротко обо мне.",
    aboutStory: [
      {
        label: "С чего всё началось",
        body: "В 2020 году я взял первые заказы на фрилансе — параллельно с бакалавриатом по информатике в УрФУ — и быстро понял: программа ценна ровно настолько, насколько она решает реальную задачу."
      },
      {
        label: "Работа в командах",
        body: "В Avenue Group как главный full-stack разработчик я с нуля спроектировал и запустил платформу OKKP. В Junzi Tech Solutions сократил среднее время ответа критичного эндпоинта примерно на 60%."
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
      empty: "Ничего не найдено."
    },
    toastEmailCopied: "Email скопирован — до связи!",
    toastEasterEgg: "Вы нашли секрет. Похоже, вы внимательны к деталям — давайте работать вместе.",
    copyEmail: "Скопировать email",
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
    footerTagline: "Спроектировано и сделано с душой.",
    cursorView: "Смотреть",
    cursorOpen: "Открыть",
    cursorHi: "Привет!",
    notFoundJoke: "Эта страница ушла в прод без тестов. Давайте вернёмся туда, где всё работает.",
    caseStudyCta: "Читать кейс",
    privateCode: "Закрытый код · NDA",
    workProject: "Рабочий проект",
    openSource: "Open source",
    workProjectsTitle: "Рабочие проекты",
    openSourceTitle: "Open-source проекты",
    diagramNote: "Код закрыт (NDA), поэтому здесь схема архитектуры, которую я построил.",
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
    showAllCertifications: "Показать все сертификаты",
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
    marqueePause: "Остановить бегущую строку",
    marqueePlay: "Запустить бегущую строку",
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
      title: "Ищете full-stack, Python или AI-разработчика? Давайте обсудим.",
      body: "Готов приступить сразу: офис или гибрид в Москве, либо удалённо; полная занятость или контракт. Обычно отвечаю в течение 48 часов.",
      contact: "Связаться"
    },
    approachTabsLabel: "Как я строю системы и как работаю",
    meta: {
      homeTitle: "Альхассан Альфарран — Software Engineer (веб- и AI-системы)",
      nameSuffix: "Альхассан Альфарран"
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
      "أنا الحسن، مهندس برمجيات في موسكو. أحوّل سير العمل المعقّد إلى منتجات ويب وذكاء اصطناعي واضحة وموثوقة.",
    heroScroll: "مرّر للاستكشاف",
    currentlyLabel: "حالياً",
    currentlyValue: "أبني بحث RAG بـ FastAPI وFAISS في Elektroservis",
    aboutStoryTitle: "القصة باختصار.",
    aboutStory: [
      {
        label: "البداية",
        body: "في عام 2020 بدأت العمل مع أول عملائي كمطوّر مستقل، بالتزامن مع دراسة البكالوريوس في علوم الحاسوب بجامعة الأورال الفيدرالية — وتعلّمت سريعاً أن قيمة البرمجيات تُقاس بالمشكلة التي تحلّها."
      },
      {
        label: "العمل مع فرق حقيقية",
        body: "في Avenue Group صمّمت منصة OKKP وأطلقتها من الصفر بصفتي كبير مطوري Full-Stack. وفي Junzi Tech Solutions خفّضت متوسط زمن استجابة نقطة API حرجة بنحو 60%."
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
      empty: "لا توجد نتائج."
    },
    toastEmailCopied: "تم نسخ البريد — نتحدث قريباً!",
    toastEasterEgg: "لقد وجدت السرّ. من الواضح أنك تهتم بالتفاصيل — لنعمل معاً.",
    copyEmail: "نسخ البريد",
    telegramLabel: "تيليغرام",
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
    footerTagline: "صُمّم وبُني بعناية.",
    cursorView: "عرض",
    cursorOpen: "فتح",
    cursorHi: "أهلاً!",
    notFoundJoke: "هذه الصفحة وصلت إلى الإنتاج دون اختبار. لنعدك إلى صفحة تعمل.",
    caseStudyCta: "اقرأ دراسة الحالة",
    privateCode: "كود خاص · NDA",
    workProject: "مشروع عمل",
    openSource: "مفتوح المصدر",
    workProjectsTitle: "مشاريع العمل",
    openSourceTitle: "مشاريع مفتوحة المصدر",
    diagramNote: "الكود خاص (NDA)، لذا يوضّح هذا المخطط البنية التي بنيتها.",
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
    showAllCertifications: "عرض كل الشهادات",
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
    marqueePause: "إيقاف الشريط المتحرك",
    marqueePlay: "تشغيل الشريط المتحرك",
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
      title: "تبحث عن مطوّر Full-Stack أو Python أو ذكاء اصطناعي؟ لنتحدث.",
      body: "متاح فوراً — حضورياً أو بنظام هجين في موسكو، أو عن بُعد؛ بدوام كامل أو بعقد. أردّ عادةً خلال 48 ساعة.",
      contact: "تواصل معي"
    },
    approachTabsLabel: "كيف أبني الأنظمة وكيف أعمل",
    meta: {
      homeTitle: "الحسن الفران — مهندس برمجيات (أنظمة الويب والذكاء الاصطناعي)",
      nameSuffix: "الحسن الفران"
    }
  }
};

export const CONTACT_EMAIL = "kyan775909@gmail.com";
export const GITHUB_URL = "https://github.com/kyan9400";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alhassan-alfarran-880b00246/";
export const TELEGRAM_URL = "https://t.me/hassan775775";
export const TELEGRAM_HANDLE = "@hassan775775";
export const SITE_URL = "https://alhassan-portfolio-sigma.vercel.app";

function buildCopy(locale: Locale) {
  const copy = { ...copyByLocale[locale], ui: uiCopy[locale] };
  // Russian gets no-break spaces after one-letter words (see lib/typograph.ts).
  return locale === "ru" ? typographRuDeep(copy) : copy;
}

type BuiltCopy = ReturnType<typeof buildCopy>;
const copyCache: Partial<Record<Locale, BuiltCopy>> = {};

/** Copy for one locale; built once per locale and then reused (a stable object). */
export function getCopy(locale: Locale): BuiltCopy {
  return (copyCache[locale] ??= buildCopy(locale));
}

export type Copy = ReturnType<typeof getCopy>;
