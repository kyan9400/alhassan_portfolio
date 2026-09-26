/**
 * Russian typography: a one-letter preposition or conjunction ("в", "с", "и", "к", "о", "у", "а", "я")
 * is glued to the next word with a no-break space, so it never dangles at the end of a line.
 * The lookbehind (not a consumed group) lets consecutive short words chain: "и в Москве".
 */
const RU_SHORT_WORD = /(?<=^|[\s(«„"])([вксиоуаяВКСИОУАЯ]) (?=\S)/g;

export function typographRu(text: string): string {
  return text.replace(RU_SHORT_WORD, "$1 ");
}

/** Keys whose values are identifiers or paths, never prose. */
const SKIP_KEYS = new Set(["file", "code", "dir", "slug", "image", "github", "live", "imageKind", "kind"]);

/** Applies `typographRu` to every string in a copy object (arrays and nested objects included). */
export function typographRuDeep<T>(value: T): T {
  if (typeof value === "string") return typographRu(value) as T;
  if (Array.isArray(value)) return value.map((item) => typographRuDeep(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, SKIP_KEYS.has(key) ? item : typographRuDeep(item)])
    ) as T;
  }
  return value;
}
