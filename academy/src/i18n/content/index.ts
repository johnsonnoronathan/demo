import type { Locale } from "../locales";

/** Translated course metadata and page titles. Full page translations live in
 *  src/content/lessons/<locale>/…; this covers languages whose pages aren't translated yet,
 *  so navigation, catalog and titles are still in the reader's language. */
export interface CourseTranslation {
  title?: string;
  tagline?: string;
  summary?: string;
  audience?: string;
  prerequisites?: string[];
  outcomes?: string[];
  practiceSummary?: string;
  chapters?: Record<string, { title?: string; summary?: string }>;
}
export interface ContentTranslation {
  courses?: Record<string, CourseTranslation>;
  /** Keyed by "course/chapter/slug" ("…/opening" for openings). */
  pages?: Record<string, { title: string; description?: string }>;
  /** Concept animation captions, keyed by scene name. */
  scenes?: Record<string, { title: string; steps: string[] }>;
}

const modules = import.meta.glob<{ default: ContentTranslation }>("./*.ts", { eager: true });
export const translations: Partial<Record<Locale, ContentTranslation>> = Object.fromEntries(
  Object.entries(modules)
    .filter(([p]) => !p.endsWith("index.ts"))
    .map(([p, m]) => [p.match(/\.\/(\w+)\.ts$/)![1], m.default])
);
