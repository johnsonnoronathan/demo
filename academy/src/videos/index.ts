import type { VideoDef } from "../video/types";
import type { Locale } from "../i18n/locales";

/* Video scripts live at src/videos/<locale>/<course>/<chapter>/<page>.ts, where <page> is
   the lesson's slug, or "opening" for a chapter opening. A missing translation falls back
   to the English script. */
const modules = import.meta.glob<{ default: VideoDef }>("./*/*/*/*.ts", { eager: true });

const byKey = new Map<string, VideoDef>();
for (const [path, mod] of Object.entries(modules)) {
  const [, locale, course, chapter, file] = path.match(/^\.\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\.ts$/)!;
  byKey.set(`${locale}/${course}/${chapter}/${file}`, mod.default);
}

export function videoFor(locale: Locale, course: string, chapter: string, page: string): { video: VideoDef; locale: Locale } | null {
  const own = byKey.get(`${locale}/${course}/${chapter}/${page}`);
  if (own) return { video: own, locale };
  const en = byKey.get(`en/${course}/${chapter}/${page}`);
  return en ? { video: en, locale: "en" } : null;
}
