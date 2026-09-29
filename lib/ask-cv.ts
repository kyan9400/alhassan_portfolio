import type { Locale } from "@/lib/types";
import { getCopy, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, TELEGRAM_HANDLE } from "@/lib/ui-copy";
import { localizeProject, projects } from "@/lib/projects";
import { localePath } from "@/lib/i18n";

/*
 * "Ask my CV": retrieval over the site's own facts, entirely in the browser. There is no model and no
 * network: a question is tokenized, expanded with a small alias map (cross-lingual names and common
 * intents), and scored with BM25 against passages built from lib/copy.ts, lib/ui-copy.ts and
 * lib/projects.ts. An answer is always one of those passages, verbatim, with its source.
 *
 * Loaded on demand by components/sections/AskCv.tsx (dynamic import). Everything here is pure, so
 * scripts/test-ask-cv.mjs runs it under `node --experimental-strip-types`.
 */

/** One quotable fact. `text` is shown as is; `href` is locale-prefixed. */
export type Passage = {
  id: string;
  text: string;
  sourceLabel: string;
  href: string;
  kind: PassageKind;
};

export type PassageKind =
  | "experience"
  | "education"
  | "certification"
  | "skills"
  | "languages"
  | "availability"
  | "contact"
  | "about"
  | "project"
  | "case-study";

export type AskResult = { passage: Passage; score: number };

/** "ok": up to three passages, best first. "none": nothing in the CV answers it (or it is out of scope). */
export type AskAnswer = { status: "ok"; results: AskResult[]; terms: string[] } | { status: "none"; terms: string[] };

// ─── Text normalisation and tokens ───────────────────────────────────────────────────────────────

/**
 * A token is a run of one script: Latin letters and digits ("fastapi", "c1", "60"), Cyrillic, or
 * Arabic (with its combining marks). Splitting by script also separates the Arabic "و" (and) glued to
 * a Latin name, as in "وExcel".
 */
const TOKEN = /[\p{Script=Latin}\p{Nd}]+|\p{Script=Cyrillic}+|[\p{Script=Arabic}ً-ٰٟـ]+/gu;

/** Invisible characters the typography pass inserts (word joiner, soft hyphen, bidi marks). */
const INVISIBLE = /[­​-‏⁠‪-‮]/g;

function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[ً-ٰٟـ]/g, "") // Arabic diacritics and tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

const EN_KEEP = /(?:ss|us|is|os|as)$/;

function stemLatin(t: string): string {
  if (/\d/.test(t) || t.length <= 4) return t;
  let s = t;
  if (s.endsWith("ies") && s.length > 5) s = `${s.slice(0, -3)}y`;
  else if (s.endsWith("s") && !EN_KEEP.test(s)) s = s.slice(0, -1);
  if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("ed")) s = s.slice(0, -2);
  if (s.length > 4 && s.endsWith("e")) s = s.slice(0, -1);
  return s;
}

/** Common Russian endings, longest first. A light stemmer: it only has to treat query and passage alike. */
const RU_ENDINGS = [
  "иями", "ями", "ами", "ого", "его", "ому", "ему", "ыми", "ими", "ешь", "ишь", "ете", "ите",
  "ой", "ей", "ий", "ый", "ая", "яя", "ое", "ее", "ые", "ие", "ую", "юю", "ах", "ях", "ом", "ем",
  "ам", "ям", "ов", "ев", "ет", "ит", "ут", "ют", "ат", "ят", "ал", "ил", "ял", "ла", "ли", "ло", "ть",
  "а", "я", "о", "е", "ы", "и", "у", "ю", "ь", "й"
];

function stemCyrillic(t: string): string {
  let s = t;
  if (s.length > 5 && (s.endsWith("ся") || s.endsWith("сь"))) s = s.slice(0, -2);
  for (const end of RU_ENDINGS) {
    if (s.endsWith(end) && s.length - end.length >= 3) return s.slice(0, -end.length);
  }
  return s;
}

/** The article "ال" and the clitics و / ب / ف / ل / ك in front of it; a bare و or ب only when the rest is long. */
const AR_PREFIXES = ["وال", "بال", "فال", "كال", "لل", "ال"];
const AR_SUFFIXES = ["يات", "ات", "ون", "ين", "ان", "يه", "ها", "هم", "كم", "نا", "ه", "ك", "ي"];

function stemArabic(t: string): string {
  let s = t;
  const article = AR_PREFIXES.find((p) => s.startsWith(p) && s.length - p.length >= 2);
  if (article) s = s.slice(article.length);
  else if ((s.startsWith("و") || s.startsWith("ب")) && s.length >= 5) s = s.slice(1);
  const suffix = AR_SUFFIXES.find((x) => s.endsWith(x) && s.length - x.length >= 3);
  if (suffix) s = s.slice(0, -suffix.length);
  return s;
}

/** Normalises and stems one token (the script decides the stemmer). */
export function stem(raw: string): string {
  const t = normalizeToken(raw);
  if (/\p{Script=Cyrillic}/u.test(t)) return stemCyrillic(t);
  if (/\p{Script=Arabic}/u.test(t)) return stemArabic(t);
  return stemLatin(t);
}

/** Token stems of a text, in order. */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const m of text.replace(INVISIBLE, "").matchAll(TOKEN)) {
    const s = stem(m[0]);
    if (s) out.push(s);
  }
  return out;
}

/** Question words and fillers in the three languages; they never decide an answer. */
const STOPWORDS = new Set(
  tokenize(
    [
      "a an the and or of to in on at for with from by about is are was were be been am do does did done",
      "you your yours i me my we our it its this that these those what which who whom how why when where",
      "have has had can could would should will shall any some there tell please much many know",
      "ты вы тебя вас тебе вам твой ваш твои ваши у в во на и или ли что чем как какой какая какие каков",
      "про для где когда есть был была были с со по о об а но же мне меня я мы это этот эта кто скажите расскажите",
      "знаешь знаете умеешь умеете можешь можете",
      "هل ما ماذا من في على عن الى إلى مع أنت انت انتم لديك عندك كم أي اي هو هي ذلك تلك هذا هذه كيف متى",
      "أين تعرف تعرفين تستطيع يمكنك لك لي"
    ].join(" ")
  )
);

// ─── Alias map ──────────────────────────────────────────────────────────────────────────────────

/**
 * Each group joins spellings of one thing across English, Russian and Arabic. A query that contains
 * any entry (a word or a phrase) is expanded with the group's `expand` words (as plain terms) and its
 * `tag` (an intent that passages of one kind carry, e.g. "#lang" on the languages passage).
 * `refuse` groups are topics the CV does not cover (salary, visa…): they always answer "none".
 */
type AliasGroup = { terms: string[]; expand?: string[]; tag?: string; refuse?: boolean };

const ALIAS_GROUPS: AliasGroup[] = [
  // Technologies (cross-script names)
  { terms: ["python", "пайтон", "питон", "питоне", "بايثون", "بايثن"], expand: ["python"] },
  { terms: ["react", "reactjs", "реакт", "реакте", "رياكت", "ريأكت"], expand: ["react"] },
  { terms: ["fastapi", "фастапи", "فاست"], expand: ["fastapi"] },
  { terms: ["typescript", "ts", "тайпскрипт", "تايب سكريبت", "تايبسكريبت"], expand: ["typescript"] },
  { terms: ["javascript", "js", "джаваскрипт", "جافاسكريبت"], expand: ["javascript"] },
  { terms: ["node", "nodejs", "нода", "ноде", "نود"], expand: ["node"] },
  { terms: ["next", "nextjs", "некст"], expand: ["next"] },
  { terms: ["postgres", "postgresql", "постгрес", "postgre", "بوستجرس"], expand: ["postgresql"] },
  { terms: ["mongo", "mongodb", "монго", "مونغو"], expand: ["mongodb"] },
  { terms: ["sql", "database", "databases", "бд", "база данных", "базы данных", "قاعدة بيانات", "قواعد بيانات"], expand: ["sql", "postgresql", "mongodb"] },
  { terms: ["docker", "докер", "دوكر"], expand: ["docker"] },
  { terms: ["kubernetes", "k8s", "кубернетес", "كوبرنيتس"], expand: ["kubernetes"] },
  { terms: ["go", "golang", "гоу", "جو"], expand: ["go"] },
  { terms: ["excel", "эксель", "ексель", "إكسل", "اكسل"], expand: ["excel"] },
  { terms: ["ocr", "распознавание", "сканы", "التعرف الضوئي"], expand: ["ocr"] },
  { terms: ["cache", "caching", "redis", "кэш", "кеш", "кэширование", "تخزين مؤقت"], expand: ["cache", "caching", "redis", "кэш", "кэширован", "مؤقت"] },
  {
    terms: ["rag", "раг", "retrieval", "document search", "поиск по документам", "поиск по документации", "بحث في المستندات", "البحث في الوثائق", "semantic search", "семантический поиск"],
    expand: ["rag", "faiss", "retrieval"]
  },
  {
    terms: ["ai", "ии", "ml", "llm", "нейросеть", "нейросети", "machine learning", "машинное обучение", "ذكاء اصطناعي", "الذكاء الاصطناعي", "تعلم الآلة"],
    expand: ["ai", "llm", "rag", "ии", "ذكاء"]
  },
  {
    terms: ["performance", "faster", "speed", "latency", "optimize", "optimization", "optimised", "производительность", "скорость", "ускорил", "ускорение", "оптимизация", "أداء", "سرعة", "تحسين"],
    expand: ["60", "response", "cache"],
    tag: "#perf"
  },

  // Companies, schools, projects
  { terms: ["elektroservis", "electroservice", "электросервис", "электросервисе", "إلكتروسيرفيس"], expand: ["elektroservis", "электросервис"] },
  { terms: ["avenue", "авеню", "أفينيو"], expand: ["avenue"] },
  { terms: ["junzi", "джунзи", "جونزي"], expand: ["junzi"] },
  { terms: ["okkp", "оккп", "окпп"], expand: ["okkp"] },
  { terms: ["freelance", "freelancer", "фриланс", "фрилансер", "عمل حر", "مستقل"], expand: ["freelance", "фриланс", "حر"] },
  { terms: ["misis", "мисис", "ميسيس"], expand: ["misis", "мисис"] },
  { terms: ["urfu", "ural", "урфу", "урал", "уральский", "الأورال", "الاورال"], expand: ["ural", "урал", "اورال"] },

  // Intents
  {
    terms: [
      "experience", "work history", "career", "worked", "job", "jobs", "employer", "employers", "companies",
      "опыт", "опыта", "стаж", "карьера", "работал", "работали", "компании", "работодатель",
      "خبرة", "خبرات", "خبرتك", "مسيرة", "مسيرتك", "عملت", "شركات"
    ],
    tag: "#exp"
  },
  {
    terms: [
      "education", "degree", "university", "study", "studied", "master", "masters", "bachelor", "graduate",
      "образование", "учились", "учился", "университет", "вуз", "магистратура", "магистр", "бакалавр", "диплом",
      "تعليم", "التعليم", "جامعة", "دراسة", "درست", "ماجستير", "بكالوريوس", "شهادة جامعية"
    ],
    tag: "#edu"
  },
  {
    terms: ["certificate", "certificates", "certification", "certifications", "course", "courses", "coursera", "сертификат", "сертификаты", "курсы", "شهادات", "دورات"],
    tag: "#cert"
  },
  {
    terms: [
      "skills", "skill", "stack", "tech stack", "technologies", "technology", "tools", "toolkit",
      "навыки", "навык", "стек", "технологии", "инструменты", "умеете",
      "مهارات", "مهاراتك", "تقنيات", "التقنيات", "أدوات", "ادوات"
    ],
    tag: "#skills"
  },
  {
    terms: [
      "language", "languages", "level", "proficiency", "english", "arabic", "russian", "speak", "speaks", "fluent", "fluency", "ielts", "toefl",
      "язык", "языки", "языков", "английский", "английского", "английским", "арабский", "русский", "уровень", "говорите",
      "لغة", "لغات", "اللغات", "لغتك", "الإنجليزية", "الانجليزية", "إنجليزي", "انجليزي", "العربية", "الروسية", "تتحدث", "مستوى"
    ],
    tag: "#lang"
  },
  {
    terms: [
      "available", "availability", "start", "now", "notice", "hire", "hiring", "full-time", "fulltime", "contract", "relocate", "open to work",
      "доступен", "доступны", "свободен", "свободны", "приступить", "готовы", "готов", "сейчас", "трудоустройство", "занятость", "вакансия",
      "متاح", "متاحة", "متى", "الآن", "فورا", "فوراً", "التوظيف", "توظيف", "دوام"
    ],
    tag: "#avail"
  },
  {
    terms: [
      "where", "based", "location", "located", "city", "moscow", "remote", "remotely", "onsite", "on-site", "hybrid",
      "где", "город", "москва", "москве", "удаленно", "удалённо", "офис", "гибрид",
      "أين", "اين", "موسكو", "مدينة", "عن بعد", "هجين"
    ],
    tag: "#loc"
  },
  {
    terms: [
      "contact", "reach", "email", "e-mail", "mail", "telegram", "tg", "phone", "linkedin", "github", "message", "write",
      "связаться", "связь", "контакт", "контакты", "почта", "почту", "телеграм", "телеграмм", "телеграме", "написать", "линкедин",
      "تواصل", "التواصل", "أتواصل", "نتواصل", "أراسلك", "اراسلك", "أكلمك", "بريد", "إيميل", "ايميل", "تيليجرام", "تلغرام", "تليجرام", "اتصال", "راسلني"
    ],
    tag: "#contact"
  },
  {
    terms: ["know", "familiar", "proficient", "used", "знаете", "знаешь", "владеете", "умеете", "работали с", "تعرف", "تجيد", "تتقن", "استخدمت"],
    tag: "#skills"
  },
  {
    terms: ["build", "built", "make", "made", "create", "created", "ship", "shipped", "сделали", "сделал", "построили", "создали", "разработали", "بنيت", "صنعت", "أنجزت", "طورت"],
    expand: ["built", "shipped", "designed", "спроектировал", "разработал", "запустил", "بنيت", "صممت", "بنيتُ"]
  },
  { terms: ["projects", "project", "portfolio", "проекты", "проект", "портфолио", "مشاريع", "مشروع", "المشاريع"], tag: "#proj" },

  // Out of scope: the CV does not answer these, so neither does the box.
  {
    terms: [
      "salary", "salaries", "compensation", "wage", "wages", "pay", "paid", "expected salary",
      "зарплата", "зарплату", "зарплаты", "зп", "оклад", "вилка", "доход", "ставка",
      "راتب", "الراتب", "رواتب", "أجر", "الأجر", "اجر"
    ],
    refuse: true
  },
  {
    terms: [
      "visa", "visas", "permit", "work permit", "citizenship", "citizen", "residency", "residence", "sponsorship", "sponsor",
      "виза", "визу", "разрешение", "гражданство", "гражданин", "внж", "рвп", "патент",
      "تأشيرة", "تاشيرة", "فيزا", "إقامة", "اقامة", "جنسية", "الجنسية", "تصريح عمل"
    ],
    refuse: true
  },
  {
    terms: ["age", "old", "married", "religion", "возраст", "женат", "религия", "عمرك", "متزوج", "الدين"],
    refuse: true
  }
];

type CompiledAlias = { phrases: string[][]; expand: string[]; tag?: string; refuse: boolean };

const COMPILED_ALIASES: CompiledAlias[] = ALIAS_GROUPS.map((g) => ({
  phrases: g.terms.map((t) => tokenize(t)).filter((p) => p.length > 0),
  expand: (g.expand ?? []).flatMap((t) => tokenize(t)),
  tag: g.tag,
  refuse: Boolean(g.refuse)
}));

function containsPhrase(tokens: string[], phrase: string[]): boolean {
  if (phrase.length === 1) return tokens.includes(phrase[0]);
  for (let i = 0; i + phrase.length <= tokens.length; i++) {
    if (phrase.every((p, j) => tokens[i + j] === p)) return true;
  }
  return false;
}

/** Query weights: words typed get 1, alias expansions 0.7, intent tags 1.5. */
const W_QUERY = 1;
const W_EXPAND = 0.7;
const W_TAG = 1.5;
const W_INTENT_WORD = 0.6;
const W_TAG_MIXED = 0.35;

/** A meaningful word of the question and everything that counts as matching it (itself, its aliases, its intent tag). */
export type QueryWord = { token: string; variants: Set<string> };

export type AnalyzedQuery = {
  weights: Map<string, number>;
  /** Non-stopword words of the question, for the coverage check. */
  words: QueryWord[];
  refuse: boolean;
  /** Stems to highlight in the answers. */
  terms: string[];
};

/** Terms of a question with their weights, and whether it is out of scope. */
export function analyzeQuery(query: string): AnalyzedQuery {
  const tokens = tokenize(query);
  const weights = new Map<string, number>();
  const put = (term: string, w: number) => weights.set(term, Math.max(weights.get(term) ?? 0, w));
  const variants = new Map<string, Set<string>>();
  for (const t of tokens) if (!variants.has(t)) variants.set(t, new Set([t]));
  let refuse = false;
  for (const alias of COMPILED_ALIASES) {
    const matched = alias.phrases.filter((p) => containsPhrase(tokens, p));
    if (matched.length === 0) continue;
    if (alias.refuse) refuse = true;
    alias.expand.forEach((t) => put(t, W_EXPAND));
    if (alias.tag) put(alias.tag, W_TAG);
    for (const phrase of matched) {
      for (const t of phrase) {
        const set = variants.get(t);
        alias.expand.forEach((e) => set?.add(e));
        if (alias.tag) set?.add(alias.tag);
      }
    }
  }
  const terms: string[] = [];
  const words: QueryWord[] = [];
  for (const t of tokens) {
    if (STOPWORDS.has(t) || terms.includes(t)) continue;
    const own = variants.get(t) ?? new Set([t]);
    // An intent word ("based", "study") is represented by its tag; its literal form weighs less, so
    // "role-based" does not outrank the location passage.
    put(t, [...own].some((v) => v.startsWith("#")) ? W_INTENT_WORD : W_QUERY);
    terms.push(t);
    words.push({ token: t, variants: own });
  }
  // "React experience": the named thing decides and the intent only breaks ties. Intent tags keep their
  // full weight only when the question is all intent ("what is your English level?").
  if (words.some((w) => ![...w.variants].some((v) => v.startsWith("#")))) {
    for (const [t, w] of weights) if (t.startsWith("#")) weights.set(t, w * W_TAG_MIXED);
  }
  // Expansions are highlighted too (e.g. "английский" marks "English").
  for (const [t] of weights) if (!t.startsWith("#") && !terms.includes(t)) terms.push(t);
  return { weights, words, refuse, terms };
}

// ─── Knowledge base ─────────────────────────────────────────────────────────────────────────────

/** Tags each passage kind carries, matched by the intent groups above. */
const KIND_TAGS: Record<PassageKind, string[]> = {
  experience: [],
  education: ["#edu"],
  certification: ["#cert"],
  skills: ["#skills"],
  languages: ["#lang"],
  availability: ["#avail", "#loc"],
  contact: ["#contact"],
  about: [],
  project: ["#proj"],
  "case-study": ["#perf"]
};

type IndexedPassage = Passage & { tokens: Map<string, number>; length: number };
type Index = { passages: IndexedPassage[]; df: Map<string, number>; avgLength: number };

/** "Jan 2025 — Dec 2025" → "2025"; "Jan 2026 — Present" → "2026 — Present"; "2020 — 2024" → "2020–2024". */
function shortPeriod(period: string): string {
  const [from = "", to = ""] = period.split(/\s*[—–-]\s*/);
  const y1 = from.match(/\d{4}/)?.[0];
  const y2 = to.match(/\d{4}/)?.[0];
  if (!y1) return period;
  if (!y2) return to.trim() ? `${y1} — ${to.trim()}` : y1;
  return y1 === y2 ? y1 : `${y1}–${y2}`;
}

/**
 * Every quotable passage for one locale. Texts are the site's own strings, unchanged; `meta` (company,
 * role, stack…) is indexed but not shown, so "Avenue Group" finds a highlight that doesn't name it.
 */
export function buildPassages(locale: Locale): (Passage & { meta: string })[] {
  const copy = getCopy(locale);
  const ui = copy.ui;
  const href = (path: string) => localePath(locale, path);
  const out: (Passage & { meta: string })[] = [];
  const add = (kind: PassageKind, id: string, text: string, sourceLabel: string, path: string, meta = "") => {
    if (text.trim()) out.push({ id, kind, text, sourceLabel, href: href(path), meta });
  };

  const comma = locale === "ar" ? "، " : ", ";
  copy.experienceItems.forEach((item, i) => {
    const label = `${copy.experienceEyebrow} · ${item.company}${comma}${shortPeriod(item.period)}`;
    const meta = `${item.company} ${item.title} ${item.location ?? ""}`;
    // Only the summary carries the "#exp" intent, so "tell me about your experience" lists the roles.
    add("experience", `exp-${i}-summary`, `${item.title} — ${item.summary}`, label, "/#experience", `${meta} #exp`);
    item.highlights.forEach((h, j) => add("experience", `exp-${i}-${j}`, h, label, "/#experience", meta));
  });

  copy.education.forEach((e, i) =>
    add("education", `edu-${i}`, `${e.degree} — ${e.school}${comma}${e.period}`, ui.educationTitle, "/#experience")
  );
  copy.certifications.forEach((c, i) =>
    add("certification", `cert-${i}`, c.issuer ? `${c.name} — ${c.issuer}` : c.name, ui.certificationsTitle, "/#experience")
  );

  copy.skillsGroups.forEach((g, i) =>
    add("skills", `skills-${i}`, `${g.name}: ${g.items.join(" · ")}`, `${copy.skillsEyebrow} · ${g.name}`, "/#skills")
  );

  add("languages", "languages", copy.languages.map((l) => `${l.name} — ${l.level}`).join(" · "), ui.cv.languages, "/cv");
  add("about", "about", copy.aboutBody, copy.aboutEyebrow, "/#about");

  add("availability", "availability", ui.availabilityLine, ui.askCv.sources.availability, "/#contact", copy.contactLocation);
  add("availability", "available-body", copy.availableBody, ui.askCv.sources.availability, "/#services");
  add("about", "currently", `${ui.currentlyLabel}: ${ui.currentlyValue}`, copy.aboutEyebrow, "/#about", "#avail");

  add(
    "contact",
    "contact-channels",
    [`${ui.telegramLabel}: ${TELEGRAM_HANDLE}`, `Email: ${CONTACT_EMAIL}`, `GitHub: ${GITHUB_URL.replace(/^https:\/\//, "")}`, `LinkedIn: ${LINKEDIN_URL.replace(/^https:\/\/www\./, "")}`].join(" · "),
    ui.askCv.sources.contact,
    "/#contact",
    "telegram email mail github linkedin"
  );
  add("contact", "contact-reply", copy.heroResponseTime, ui.askCv.sources.contact, "/#contact");
  add("contact", "contact-description", copy.contactDescription, ui.askCv.sources.contact, "/#contact");

  const sig = copy.signature;
  const caseLabel = `${sig.eyebrow} · ${sig.company}`;
  add("case-study", "case-summary", sig.summary, caseLabel, "/#case-study", `${sig.company} ${sig.title}`);
  add("case-study", "case-problem", sig.problem, caseLabel, "/#case-study", sig.company);
  add("case-study", "case-solution", sig.solution, caseLabel, "/#case-study", sig.company);
  sig.metrics.forEach((m, i) => add("case-study", `case-metric-${i}`, `${m.value} ${m.label}`, caseLabel, "/#case-study", sig.company));

  for (const base of projects) {
    const p = localizeProject(base, locale);
    const label = `${copy.nav[2]} · ${p.title}`;
    const path = `/projects/${p.slug}`;
    const meta = `${p.title} ${p.company ?? ""} ${p.tech.join(" ")}`;
    add("project", `${p.slug}-description`, p.description, label, path, meta);
    p.whatItDoes.forEach((w, j) => add("project", `${p.slug}-does-${j}`, w, label, path, p.title));
    if (p.problem) add("project", `${p.slug}-problem`, p.problem, label, path, p.title);
    if (p.solution) add("project", `${p.slug}-solution`, p.solution, label, path, p.title);
    if (p.result) add("project", `${p.slug}-result`, p.result, label, path, p.title);
  }

  return out;
}

const indexCache: Partial<Record<Locale, Index>> = {};

function getIndex(locale: Locale): Index {
  const cached = indexCache[locale];
  if (cached) return cached;
  const df = new Map<string, number>();
  const passages: IndexedPassage[] = buildPassages(locale).map(({ meta, ...passage }) => {
    // `meta` may carry extra intent tags ("#exp"), which are kept as they are.
    const metaTags = meta.match(/#[a-z]+/g) ?? [];
    const all = [...tokenize(passage.text), ...tokenize(meta.replace(/#[a-z]+/g, " ")), ...KIND_TAGS[passage.kind], ...metaTags];
    const tokens = new Map<string, number>();
    for (const t of all) tokens.set(t, (tokens.get(t) ?? 0) + 1);
    for (const t of tokens.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return { ...passage, tokens, length: all.length };
  });
  const avgLength = passages.reduce((sum, p) => sum + p.length, 0) / Math.max(1, passages.length);
  return (indexCache[locale] = { passages, df, avgLength });
}

// ─── Retrieval ──────────────────────────────────────────────────────────────────────────────────

/**
 * A mild prior: CV entries (roles, skills, education…) answer "do you know X" better than a single
 * project bullet that merely mentions X, so they win near-ties.
 */
const KIND_PRIOR: Partial<Record<PassageKind, number>> = { experience: 1.2, skills: 1.2, project: 0.9 };

const K1 = 1.2;
const B = 0.75;
/** The best passage must score at least this much, or the answer is "none". */
export const MIN_SCORE = 1.2;
/** Share of the question's meaningful words a passage must cover. */
const MIN_COVERAGE = 0.5;
/** Other passages are kept only while they score at least this share of the best one. */
const RELATIVE_CUTOFF = 0.5;
const MAX_RESULTS = 3;

/** Answers a question from the CV passages of one locale. */
export function askCv(locale: Locale, query: string): AskAnswer {
  const { weights, words, refuse, terms } = analyzeQuery(query);
  if (refuse || weights.size === 0) return { status: "none", terms };

  const { passages, df, avgLength } = getIndex(locale);
  const n = passages.length;
  const scored: AskResult[] = [];
  for (const p of passages) {
    let score = 0;
    for (const [term, w] of weights) {
      const tf = p.tokens.get(term);
      if (!tf) continue;
      const d = df.get(term) ?? 0;
      const idf = Math.log(1 + (n - d + 0.5) / (d + 0.5));
      score += w * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * p.length) / avgLength)));
    }
    if (score <= 0) continue;
    // At least half of the question's words (or their aliases) must be in the passage, so an intent
    // alone ("do you know…" → skills) never answers a question about something the CV lacks.
    const covered = words.filter((w) => [...w.variants].some((v) => p.tokens.has(v))).length;
    if (words.length > 0 && covered / words.length < MIN_COVERAGE) continue;
    score *= KIND_PRIOR[p.kind] ?? 1;
    scored.push({ passage: stripIndex(p), score });
  }
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;
  if (best < MIN_SCORE) return { status: "none", terms };

  const results: AskResult[] = [];
  const seen = new Set<string>();
  for (const r of scored) {
    if (results.length >= MAX_RESULTS || r.score < best * RELATIVE_CUTOFF) break;
    // The same text can appear twice (a project and its experience entry): quote it once.
    if (seen.has(r.passage.text)) continue;
    seen.add(r.passage.text);
    results.push(r);
  }
  return { status: "ok", results, terms };
}

function stripIndex(p: IndexedPassage): Passage {
  return { id: p.id, text: p.text, sourceLabel: p.sourceLabel, href: p.href, kind: p.kind };
}

/** Splits `text` into plain and matched runs: a word is marked when its stem is one of `terms`. */
export function highlight(text: string, terms: readonly string[]): { text: string; match: boolean }[] {
  const wanted = new Set(terms);
  const parts: { text: string; match: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (!wanted.has(stem(m[0].replace(INVISIBLE, "")))) continue;
    if (start > last) parts.push({ text: text.slice(last, start), match: false });
    parts.push({ text: m[0], match: true });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts;
}
