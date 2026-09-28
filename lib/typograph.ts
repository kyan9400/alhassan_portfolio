/**
 * Typography passes for Russian and Arabic copy. All rules only swap spaces for no-break
 * spaces (U+00A0) or add an invisible word joiner (U+2060); the visible text never changes.
 */

const NBSP = " ";
const WORD_JOINER = "⁠";

/** A dash never starts a line: the space before "—" / "–" becomes a no-break space. */
const SPACE_BEFORE_DASH = / (?=[—–])/g;

/**
 * Russian: a one-letter preposition or conjunction ("в", "с", "и", "к", "о", "у", "а", "я")
 * is glued to the next word with a no-break space, so it never dangles at the end of a line.
 * The lookbehind (not a consumed group) lets consecutive short words chain: "и в Москве".
 */
const RU_SHORT_WORD = /(?<=^|[\s(«„"])([вксиоуаяВКСИОУАЯ]) (?=\S)/g;

/**
 * "веб- и AI-системы": the hanging "веб-" stays on the line with "и". Runs after RU_SHORT_WORD,
 * which has already turned "и " into "и" + NBSP, hence the lookahead on [\s ].
 */
const RU_HANGING_PREFIX = /(?<=(?:^|[\s(«„"])[А-ЯЁа-яё]+-) (?=[иа][\s ])/g;

/**
 * Short compounds that must not break at their hyphen ("full-stack", "open-source",
 * "sentence-transformers", "AI-системы"). A word joiner after the hyphen keeps the word whole
 * and, unlike U+2011, does not break Ctrl-F or copy-paste of the visible text.
 */
const UNBREAKABLE_HYPHEN = /(?<=(?:^|[\s(«„"/])(?:[Ff]ull|[Oo]pen|sentence|AI))-(?=[\p{L}])/gu;

export function typographRu(text: string): string {
  return text
    .replace(SPACE_BEFORE_DASH, NBSP)
    .replace(RU_SHORT_WORD, `$1${NBSP}`)
    .replace(RU_HANGING_PREFIX, NBSP)
    .replace(UNBREAKABLE_HYPHEN, `-${WORD_JOINER}`);
}

/**
 * Arabic: the attached preposition "بـ" never ends a line apart from the (Latin) name that
 * follows it ("بـ React"), and a dash never starts a line.
 */
const AR_ATTACHED_PREPOSITION = /(?<=^|\s)(بـ|لـ|كـ) (?=\S)/g;

export function typographAr(text: string): string {
  return text.replace(SPACE_BEFORE_DASH, NBSP).replace(AR_ATTACHED_PREPOSITION, `$1${NBSP}`);
}

/**
 * Keys whose values are identifiers, paths or document titles, never flowing prose.
 * `meta` holds the <title> strings: no-break spaces there only make tab titles harder to read.
 */
const SKIP_KEYS = new Set(["file", "code", "dir", "slug", "image", "github", "live", "imageKind", "kind", "meta", "resultLabel", "codeNote", "verifyUrl", "logo", "monogram", "year", "href"]);

function deep<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((item) => deep(item, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, SKIP_KEYS.has(key) ? item : deep(item, fn)])
    ) as T;
  }
  return value;
}

/** Applies `typographRu` to every string in a copy object (arrays and nested objects included). */
export function typographRuDeep<T>(value: T): T {
  return deep(value, typographRu);
}

/** Applies `typographAr` to every string in a copy object (arrays and nested objects included). */
export function typographArDeep<T>(value: T): T {
  return deep(value, typographAr);
}
