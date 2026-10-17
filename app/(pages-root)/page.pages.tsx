import { BASE_PATH } from "@/lib/base-path";
import { getCopy } from "@/lib/ui-copy";
import { DEFAULT_LOCALE, LOCALES, localePath } from "@/lib/i18n";

/**
 * "/" on the static Pages copy: the layout's script sends the visitor to their language at once; these
 * plain links are the fallback (scripts off, or a browser that blocks the redirect).
 */
export default function PagesRootPage() {
  const { languageNames } = getCopy(DEFAULT_LOCALE).ui;
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 py-24">
      <nav aria-label="Language" className="flex flex-wrap items-center justify-center gap-3">
        {LOCALES.map((locale) => (
          <a key={locale} href={`${BASE_PATH}${localePath(locale, "/")}/`} hrefLang={locale} lang={locale} className="btn-ghost">
            {languageNames[locale]}
          </a>
        ))}
      </nav>
    </main>
  );
}
