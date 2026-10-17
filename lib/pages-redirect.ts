import { BASE_PATH } from "@/lib/base-path";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, PAGE_ROOTS } from "@/lib/i18n";

/*
 * proxy.ts's locale redirects for the static GitHub Pages copy (lib/base-path.ts), which has no server.
 * Runs in <head> of every page of that build: the root page (app/(pages-root)/), the language pages
 * (app/[lang]/layout.tsx) and the 404 page (app/global-not-found.tsx), which Pages serves for every
 * unknown URL:
 *
 * - `?lang=xx`: the same page under /xx, without the parameter.
 * - A page URL without a language (/, /cv, /projects/..., /notes...): the visitor's language: the
 *   NEXT_LOCALE cookie (an explicit choice from the language switcher), else the first supported
 *   language in navigator.languages, else English.
 * - Anything else stays as it is (a language page, or a real 404).
 *
 * location.replace, so the language-less URL does not stay in the history. Without scripts the root
 * page still links to every language.
 */
export const PAGES_REDIRECT_SCRIPT = `(function(){try{
var base=${JSON.stringify(BASE_PATH)},locales=${JSON.stringify(LOCALES)},roots=${JSON.stringify(PAGE_ROOTS)};
var url=new URL(location.href),path=url.pathname;
if(path.indexOf(base)===0)path=path.slice(base.length)||"/";
var first=path.split("/")[1]||"",lang=url.searchParams.get("lang");
if(locales.indexOf(lang)>=0){url.searchParams.delete("lang");if(locales.indexOf(first)>=0)path=path.slice(first.length+1)||"/"}
else{if(locales.indexOf(first)>=0||roots.indexOf(first)<0)return;
var saved=null;document.cookie.split(";").forEach(function(c){var kv=c.trim().split("=");if(kv[0]==="${LOCALE_COOKIE}"&&locales.indexOf(kv[1])>=0)saved=kv[1]});lang=saved;
var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
for(var i=0;!lang&&i<langs.length;i++){var tag=String(langs[i]||"").toLowerCase().split("-")[0];if(locales.indexOf(tag)>=0)lang=tag}
lang=lang||${JSON.stringify(DEFAULT_LOCALE)}}
var target=base+"/"+lang+(path==="/"?"":path);if(target.slice(-1)!=="/")target+="/";
location.replace(target+url.search+url.hash)}catch(e){}})();`;
