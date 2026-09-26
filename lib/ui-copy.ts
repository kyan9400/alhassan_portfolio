import { copyByLocale } from "@/lib/copy";
import type { Locale } from "@/lib/types";

/** Strings for the redesigned UI. Only restates facts already in copy.ts. */
type UiCopy = {
  greeting: { morning: string; afternoon: string; evening: string; night: string };
  heroIntro: string;
  heroScroll: string;
  currentlyLabel: string;
  currentlyValue: string;
  aboutStoryTitle: string;
  aboutStory: { label: string; body: string }[];
  processEyebrow: string;
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
  form: {
    sending: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    error: string;
    required: string;
    invalidEmail: string;
  };
  footerLocalTime: string;
  footerBackToTop: string;
  footerTagline: string;
  cursorView: string;
  cursorOpen: string;
  notFoundJoke: string;
};

export const uiCopy: Record<Locale, UiCopy> = {
  en: {
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      night: "Hello, night owl"
    },
    heroIntro: "I'm Alhassan — a software & DevOps engineer who turns messy problems into calm, reliable products.",
    heroScroll: "Scroll to explore",
    currentlyLabel: "Currently",
    currentlyValue: "building AI-native web systems",
    aboutStoryTitle: "The short story.",
    aboutStory: [
      {
        label: "Where it started",
        body: "In 2020 I began shipping web products end-to-end as a freelance engineer — and learned fast that software is only as good as the problem it solves."
      },
      {
        label: "What drives me",
        body: "The moment a slow, messy process becomes simple: a dashboard that answers the real question, a search that finds the right page, a release that just works."
      },
      {
        label: "Where I am now",
        body: "I build web, AI and delivery systems — from interfaces to APIs to pipelines — working remotely from Moscow in English, Russian and Arabic."
      }
    ],
    processEyebrow: "Process",
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
    form: {
      sending: "Sending…",
      successTitle: "Message received!",
      successBody: "Thank you for reaching out. I'll reply within 48 hours.",
      sendAnother: "Send another",
      error: "Something went wrong. Please email me directly.",
      required: "Please fill in this field.",
      invalidEmail: "Please enter a valid email."
    },
    footerLocalTime: "My local time",
    footerBackToTop: "Back to top",
    footerTagline: "Designed & built with care.",
    cursorView: "View",
    cursorOpen: "Open",
    notFoundJoke: "This page went to production without a test. Let's get you somewhere real."
  },
  ru: {
    greeting: {
      morning: "Доброе утро",
      afternoon: "Добрый день",
      evening: "Добрый вечер",
      night: "Доброй ночи"
    },
    heroIntro: "Я Альхасан — software и DevOps-инженер. Превращаю запутанные задачи в спокойные и надёжные продукты.",
    heroScroll: "Листайте дальше",
    currentlyLabel: "Сейчас",
    currentlyValue: "строю AI-native веб-системы",
    aboutStoryTitle: "Коротко обо мне.",
    aboutStory: [
      {
        label: "С чего всё началось",
        body: "В 2020 году я начал делать веб-продукты от идеи до релиза как фриланс-инженер — и быстро понял: софт хорош ровно настолько, насколько он решает реальную задачу."
      },
      {
        label: "Что меня драйвит",
        body: "Момент, когда медленный и запутанный процесс становится простым: дашборд отвечает на главный вопрос, поиск находит нужную страницу, релиз просто работает."
      },
      {
        label: "Где я сейчас",
        body: "Строю веб-, AI- и delivery-системы — от интерфейсов до API и пайплайнов. Работаю удалённо из Москвы на английском, русском и арабском."
      }
    ],
    processEyebrow: "Процесс",
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
    toastEasterEgg: "Вы нашли секрет. Вы явно внимательны к деталям — давайте работать вместе.",
    copyEmail: "Скопировать email",
    form: {
      sending: "Отправка…",
      successTitle: "Сообщение получено!",
      successBody: "Спасибо, что написали. Отвечу в течение 48 часов.",
      sendAnother: "Отправить ещё",
      error: "Что-то пошло не так. Напишите мне на почту напрямую.",
      required: "Заполните это поле.",
      invalidEmail: "Введите корректный email."
    },
    footerLocalTime: "Моё местное время",
    footerBackToTop: "Наверх",
    footerTagline: "Спроектировано и сделано с любовью.",
    cursorView: "Смотреть",
    cursorOpen: "Открыть",
    notFoundJoke: "Эта страница ушла в прод без тестов. Давайте вернёмся туда, где всё работает."
  },
  ar: {
    greeting: {
      morning: "صباح الخير",
      afternoon: "مساء الخير",
      evening: "مساء الخير",
      night: "أهلاً يا ساهر الليل"
    },
    heroIntro: "أنا الحسن — مهندس برمجيات وDevOps، أحوّل المشكلات المعقّدة إلى منتجات هادئة وموثوقة.",
    heroScroll: "مرّر للاستكشاف",
    currentlyLabel: "حالياً",
    currentlyValue: "أبني أنظمة ويب مدعومة بالذكاء الاصطناعي",
    aboutStoryTitle: "القصة باختصار.",
    aboutStory: [
      {
        label: "البداية",
        body: "في عام 2020 بدأت بتطوير منتجات ويب كاملة كمهندس مستقل — وتعلّمت سريعاً أن قيمة البرمجيات تُقاس بمدى حلّها للمشكلة الحقيقية."
      },
      {
        label: "ما يحفّزني",
        body: "اللحظة التي تصبح فيها عملية بطيئة ومربكة بسيطة: لوحة تحكم تجيب عن السؤال الحقيقي، بحث يجد الصفحة الصحيحة، وإصدار يعمل ببساطة."
      },
      {
        label: "أين أنا الآن",
        body: "أبني أنظمة الويب والذكاء الاصطناعي والتسليم — من الواجهات إلى الـ API إلى خطوط النشر — وأعمل عن بُعد من موسكو بالعربية والإنجليزية والروسية."
      }
    ],
    processEyebrow: "طريقة العمل",
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
    form: {
      sending: "جارٍ الإرسال…",
      successTitle: "تم استلام رسالتك!",
      successBody: "شكراً لتواصلك. سأرد خلال 48 ساعة.",
      sendAnother: "إرسال رسالة أخرى",
      error: "حدث خطأ ما. راسلني مباشرة عبر البريد.",
      required: "يرجى تعبئة هذا الحقل.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح."
    },
    footerLocalTime: "توقيتي المحلي",
    footerBackToTop: "العودة للأعلى",
    footerTagline: "صُمّم وبُني بعناية.",
    cursorView: "عرض",
    cursorOpen: "فتح",
    notFoundJoke: "هذه الصفحة وصلت إلى الإنتاج بدون اختبار. دعنا نعيدك إلى مكان حقيقي."
  }
};

export const CONTACT_EMAIL = "kyan775909@gmail.com";
export const GITHUB_URL = "https://github.com/kyan9400";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alhassan-alfarran-880b00246/";
export const SITE_URL = "https://alhassan-portfolio-sigma.vercel.app";

export function getCopy(locale: Locale) {
  return { ...copyByLocale[locale], ui: uiCopy[locale] };
}

export type Copy = ReturnType<typeof getCopy>;
