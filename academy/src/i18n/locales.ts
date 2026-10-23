/** The site's languages. English is the source; it has no URL prefix. */
export const LOCALES = [
  { code: "en", prefix: "", label: "English", html: "en", speech: "en" },
  { code: "zh", prefix: "zh", label: "简体中文", html: "zh-CN", speech: "zh" },
  { code: "ja", prefix: "ja", label: "日本語", html: "ja", speech: "ja" },
  { code: "ko", prefix: "ko", label: "한국어", html: "ko", speech: "ko" },
  { code: "es", prefix: "es", label: "Español", html: "es", speech: "es" },
  { code: "fr", prefix: "fr", label: "Français", html: "fr", speech: "fr" },
  { code: "de", prefix: "de", label: "Deutsch", html: "de", speech: "de" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export const DEFAULT_LOCALE: Locale = "en";

export function localeInfo(code: Locale) {
  return LOCALES.find((l) => l.code === code)!;
}

/** The path the site is served under: "" at a domain root, "/demo" on GitHub Pages. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A root-relative path with the site's base in front: withBase("/llms.txt"). */
export function withBase(path: string) {
  return BASE + path;
}

/** Site path for a locale: href("zh", "/courses/") → "/zh/courses/" (plus the base). */
export function href(locale: Locale, path: string) {
  const prefix = localeInfo(locale).prefix;
  return withBase(prefix ? `/${prefix}${path}` : path);
}

/** The same page in another language. `path` is the locale-free path. */
export function switchHref(to: Locale, path: string) {
  return href(to, path);
}
