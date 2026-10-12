/*
 * "3D Web Experiences": the real-time 3D sites shown in the home section (components/sections/Web3d.tsx).
 * This file is the ONE place to edit the list. It has no runtime imports (type-only), so
 * scripts/capture-repo-screenshots.mjs can load it as well (`npm run capture:repos -- --web3d`).
 *
 * Per site:
 * - `live` is the deployed URL. It is only linked once `liveStatus` is "live"; until then the card shows a
 *   "launching soon" badge and opens the repository instead.
 * - `screenshot` is the public path of the capture: the file lives at `public<screenshot>`, i.e.
 *   public/repo-screenshots/<slug>.webp (the same folder and naming as the repository grid). The section
 *   only uses it when the file exists (checked on the server, lib/repoScreenshot.ts); otherwise the card
 *   shows a gradient placeholder in the site's `palette`.
 * - `mobileScreenshot` is the public path of the phone capture (390 px wide, WebP):
 *   public/repo-screenshots/mobile/<slug>.webp. On phones the card shows it instead of the desktop
 *   capture, and from `sm` it appears as a small phone frame over the desktop one. Optional in practice:
 *   when the file is missing the card simply keeps the desktop capture (same server check).
 * - `kind` and `description` are written in all three languages (Russian and Arabic are not machine output:
 *   keep them in sync by hand when editing).
 * - `icon` names the placeholder glyph (mapped to a lucide icon in the section component).
 */
import type { Locale } from "@/lib/types";

type Localized = Record<Locale, string>;

export type Web3dIcon = "towers" | "coffee" | "sparkles" | "orb" | "building" | "watch" | "rocket" | "globe" | "audio" | "dna" | "car";

export type Web3dSite = {
  /** Repository name on GitHub (kyan9400/<slug>) and the screenshot basename. */
  slug: string;
  name: string;
  kind: Localized;
  description: Localized;
  live: string;
  /** "pending" while the deployment is in progress: the live URL is not linked yet. */
  liveStatus: "live" | "pending";
  repo: string;
  /** Public path of the screenshot (file: public/repo-screenshots/<slug>.webp). May not exist yet. */
  screenshot: string;
  /** Public path of the phone capture (file: public/repo-screenshots/mobile/<slug>.webp). May not exist yet. */
  mobileScreenshot: string;
  /** Placeholder gradient: two hex colours (scene glow, then rim light). */
  palette: [string, string];
  icon: Web3dIcon;
};

/** A site with `kind` and `description` already resolved to one language (done on the server). */
export type Web3dSiteView = Omit<Web3dSite, "kind" | "description"> & { kind: string; description: string };

const GITHUB = "https://github.com/kyan9400";

/** Shared stack of every site in the section. Names of tools: never translated. */
export const WEB3D_STACK = ["Next.js", "React Three Fiber", "Three.js", "GLSL", "GSAP"] as const;

/** Repo, expected Vercel URL and screenshot paths follow from the slug. */
function site(slug: string, data: Omit<Web3dSite, "slug" | "live" | "liveStatus" | "repo" | "screenshot" | "mobileScreenshot"> & Partial<Pick<Web3dSite, "live" | "liveStatus">>): Web3dSite {
  return {
    slug,
    live: `https://${slug}.vercel.app`,
    liveStatus: "live",
    repo: `${GITHUB}/${slug}`,
    screenshot: `/repo-screenshots/${slug}.webp`,
    mobileScreenshot: `/repo-screenshots/mobile/${slug}.webp`,
    ...data
  };
}

/** In display order (sites with a screenshot are moved ahead of placeholders, keeping this order within each group). */
export const WEB3D_SITES: Web3dSite[] = [
  site("skybloom-3d", {
    name: "Skybloom",
    icon: "towers",
    palette: ["#10b981", "#f59e0b"],
    kind: { en: "Eco-city developer", ru: "Девелопер эко-города", ar: "مطوّر مدينة بيئية" },
    description: {
      en: "Glass towers rise from the ground as you scroll, greenery spreads across them and the light shifts from day to dusk.",
      ru: "При прокрутке из земли вырастают стеклянные башни, их оплетает зелень, а дневной свет сменяется закатным.",
      ar: "مع التمرير تنبثق أبراج زجاجية من الأرض، وتنتشر النباتات على واجهاتها، ويتحوّل الضوء من النهار إلى الغسق."
    }
  }),
  site("qahwa-house-3d", {
    name: "Qahwa House",
    icon: "coffee",
    palette: ["#b45309", "#fbbf24"],
    kind: { en: "Specialty coffee house", ru: "Кофейня спешелти", ar: "مقهى قهوة مختصة" },
    description: {
      en: "A 3D cup with a live pour, rising steam particles and coffee beans in orbit.",
      ru: "3D-чашка, в которую в реальном времени льётся кофе, с частицами пара и кофейными зёрнами на орбите.",
      ar: "فنجان ثلاثي الأبعاد تُسكب فيه القهوة مباشرةً، مع جسيمات بخار متصاعدة وحبوب بنّ تدور حوله."
    }
  }),
  site("bloom-studio-3d", {
    name: "Bloom Studio",
    icon: "sparkles",
    palette: ["#ec4899", "#a78bfa"],
    kind: { en: "Beauty & nail studio", ru: "Студия красоты и маникюра", ar: "استوديو تجميل وعناية بالأظافر" },
    description: {
      en: "An iridescent polish bottle that the colour picker repaints in real time with a thin-film shader.",
      ru: "Флакон лака с перламутровым переливом: выбранный цвет перекрашивает его на лету с помощью шейдера тонкой плёнки.",
      ar: "زجاجة طلاء أظافر بلمعة قزحية، يعيد منتقي الألوان تلوينها فورًا عبر مظلّل الأغشية الرقيقة (thin-film)."
    }
  }),
  site("nova-ai-3d", {
    live: "https://nova-ai-3d-xi.vercel.app",
    name: "Nova AI",
    icon: "orb",
    palette: ["#FFD60A", "#C8CBD2"],
    kind: { en: "AI assistant SaaS", ru: "SaaS-сервис с ИИ-ассистентом", ar: "منصة SaaS لمساعد ذكي" },
    description: {
      en: "A GPU particle “mind” orb that reacts to the cursor and to what you type.",
      ru: "Сфера-«разум» из частиц на GPU, которая откликается на движение курсора и на ввод текста.",
      ar: "كرة «عقل» من الجسيمات تُحسب على GPU، وتتفاعل مع حركة المؤشر ومع ما تكتبه."
    }
  }),
  site("dubai-horizon-3d", {
    name: "Horizon Tower",
    icon: "building",
    palette: ["#0ea5e9", "#f97316"],
    kind: { en: "Luxury real estate", ru: "Элитная недвижимость", ar: "عقارات فاخرة" },
    description: {
      en: "A procedural tower with a floor selector, a day/night toggle and a sun-angle slider.",
      ru: "Процедурная башня с выбором этажа, переключением дня и ночи и ползунком высоты солнца.",
      ar: "برج مولّد برمجيًا مع اختيار الطابق، والتبديل بين الليل والنهار، وشريط للتحكم في زاوية الشمس."
    }
  }),
  site("aurum-watch-3d", {
    name: "Aurum",
    icon: "watch",
    palette: ["#ca8a04", "#94a3b8"],
    kind: { en: "Watch configurator", ru: "Конфигуратор часов", ar: "أداة لتخصيص الساعات" },
    description: {
      en: "A procedural watch with case, strap and dial pickers and an exploded view.",
      ru: "Процедурные часы с выбором корпуса, ремешка и циферблата и разнесённым видом деталей.",
      ar: "ساعة مولّدة برمجيًا مع اختيار الهيكل والسوار والميناء، وعرض مفكَّك لمكوّناتها."
    }
  }),
  site("orbit-voyages-3d", {
    name: "Orbit Voyages",
    icon: "rocket",
    palette: ["#ef4444", "#3b82f6"],
    kind: { en: "Space tourism", ru: "Космический туризм", ar: "سياحة فضائية" },
    description: {
      en: "A scroll-driven flight from Earth to Mars, past planets drawn with procedural shaders.",
      ru: "Полёт от Земли к Марсу, управляемый прокруткой, мимо планет, нарисованных процедурными шейдерами.",
      ar: "رحلة من الأرض إلى المريخ يقودها التمرير، بين كواكب مرسومة بمظلّلات إجرائية."
    }
  }),
  site("terra-trek-3d", {
    name: "Terra Trek",
    icon: "globe",
    palette: ["#14b8a6", "#38bdf8"],
    kind: { en: "Travel agency", ru: "Туристическое агентство", ar: "وكالة سفر" },
    description: {
      en: "An interactive globe with glowing flight arcs between destinations.",
      ru: "Интерактивный глобус со светящимися дугами перелётов между направлениями.",
      ar: "كرة أرضية تفاعلية تربط الوجهات بأقواس طيران متوهّجة."
    }
  }),
  site("echo-fest-3d", {
    name: "Echo Fest",
    icon: "audio",
    palette: ["#d946ef", "#22d3ee"],
    kind: { en: "Music festival", ru: "Музыкальный фестиваль", ar: "مهرجان موسيقي" },
    description: {
      en: "An audio-reactive 3D tunnel built on the Web Audio API.",
      ru: "3D-туннель, который реагирует на музыку, построенный на Web Audio API.",
      ar: "نفق ثلاثي الأبعاد يتفاعل مع الموسيقى، مبني على Web Audio API."
    }
  }),
  site("helix-labs-3d", {
    name: "Helix Labs",
    icon: "dna",
    palette: ["#06b6d4", "#84cc16"],
    kind: { en: "Biotech clinic", ru: "Биотехнологическая клиника", ar: "عيادة تقنيات حيوية" },
    description: {
      en: "An instanced DNA helix that unwinds to reveal the clinic’s services.",
      ru: "Спираль ДНК на инстансинге: раскручиваясь, она открывает услуги клиники.",
      ar: "حلزون DNA مرسوم بتقنية instancing، ينفكّ تدريجيًا ليكشف خدمات العيادة."
    }
  }),
  site("apex-3d-site", {
    name: "Apex Motors",
    icon: "car",
    palette: ["#dc2626", "#64748b"],
    liveStatus: "live",
    kind: { en: "Car brand", ru: "Автомобильный бренд", ar: "علامة سيارات" },
    description: {
      en: "A real-time 3D showroom for a performance car brand.",
      ru: "3D-шоурум в реальном времени для бренда спортивных автомобилей.",
      ar: "صالة عرض ثلاثية الأبعاد تعمل في الوقت الفعلي لعلامة سيارات رياضية."
    }
  })
];
