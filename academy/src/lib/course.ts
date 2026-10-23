import { getCollection, type CollectionEntry } from "astro:content";
import { href, type Locale } from "../i18n/locales";
import { t } from "../i18n/ui";
import { translations } from "../i18n/content";
import { videoFor } from "../videos";
import { durationOf } from "../video/timeline";
import type { VideoDef } from "../video/types";

export type CourseEntry = CollectionEntry<"courses">;
export type Lesson = CollectionEntry<"lessons">;
type CourseData = CourseEntry["data"];

/** A course's metadata in one language, with English filling any gaps. */
export interface CourseInfo extends Omit<CourseData, "chapters"> {
  id: string;
  locale: Locale;
  chapters: ChapterInfo[];
}
export interface ChapterInfo {
  id: string;
  title: string;
  role?: "overall" | "specific";
  summary: string;
}

/** One page of a course in one language, with everything a page needs to place it. */
export interface LessonView {
  /** Stable across languages: "performance-testing/static/n-plus-one". */
  key: string;
  locale: Locale;
  /** The entry to render: the translation if there is one, otherwise English. */
  entry: Lesson;
  /** True when no translation exists and `entry` is the English page. */
  fallback: boolean;
  /** The English page, the source of truth for agent prompts. */
  en: Lesson;
  course: CourseInfo;
  /** The course in English, for agent prompts, which stay in English in every language. */
  courseEn: CourseInfo;
  chapter: ChapterInfo;
  chapterNumber: number;
  /** "2.3" for lessons, "2" for openings and summaries. */
  number: string;
  label: string;
  title: string;
  description: string;
  /** Locale-free path, e.g. "performance-testing/static/n-plus-one". */
  path: string;
  url: string;
  mdUrl: string;
  sourcePath: string;
  video: VideoDef | null;
  videoLocale: Locale | null;
  videoSeconds: number;
}

const KIND_ORDER = { opening: 0, lesson: 1, summary: 2 } as const;

function localeOf(entry: Lesson) {
  return entry.id.split("/")[0] as Locale;
}

export async function courseEntries() {
  return (await getCollection("courses")).sort((a, b) => a.data.order - b.data.order);
}

export function localizeCourse(entry: CourseEntry, locale: Locale): CourseInfo {
  const tr = translations[locale]?.courses?.[entry.id] ?? {};
  const d = entry.data;
  return {
    ...d,
    id: entry.id,
    locale,
    title: tr.title ?? d.title,
    tagline: tr.tagline ?? d.tagline,
    summary: tr.summary ?? d.summary,
    audience: tr.audience ?? d.audience,
    prerequisites: tr.prerequisites ?? d.prerequisites,
    outcomes: tr.outcomes ?? d.outcomes,
    practice: d.practice && { ...d.practice, summary: tr.practiceSummary ?? d.practice.summary },
    chapters: d.chapters.map((c) => ({ ...c, title: tr.chapters?.[c.id]?.title ?? c.title, summary: tr.chapters?.[c.id]?.summary ?? c.summary })),
  };
}

const cache = new Map<string, Promise<{ course: CourseInfo; lessons: LessonView[] }>>();

export function loadCourse(id: string, locale: Locale) {
  const k = `${id}:${locale}`;
  if (!cache.has(k)) cache.set(k, build(id, locale));
  return cache.get(k)!;
}

async function build(id: string, locale: Locale) {
  const entry = (await courseEntries()).find((c) => c.id === id);
  if (!entry) throw new Error(`Unknown course ${id}`);
  const course = localizeCourse(entry, locale);
  const courseEn = localizeCourse(entry, "en");
  const all = (await getCollection("lessons")).filter((l) => l.data.course === id);
  const english = all.filter((l) => localeOf(l) === "en");
  const translated = new Map(all.filter((l) => localeOf(l) === locale).map((l) => [`${l.data.chapter}/${l.data.slug}`, l]));
  const pages = translations[locale]?.pages ?? {};
  const views: LessonView[] = [];

  course.chapters.forEach((chapter, ci) => {
    const inChapter = english
      .filter((l) => l.data.chapter === chapter.id)
      .sort((a, b) => KIND_ORDER[a.data.kind] - KIND_ORDER[b.data.kind] || a.data.order - b.data.order);
    let n = 0;
    for (const en of inChapter) {
      const chapterNumber = ci + 1;
      const d = en.data;
      const isLesson = d.kind === "lesson";
      if (isLesson) n++;
      const number = isLesson ? `${chapterNumber}.${n}` : String(chapterNumber);
      const tr = locale === "en" ? en : translated.get(`${d.chapter}/${d.slug}`);
      const shown = tr ?? en;
      const path = d.kind === "opening" ? `${id}/${chapter.id}` : `${id}/${chapter.id}/${d.slug}`;
      const key = `${id}/${chapter.id}/${d.slug || "opening"}`;
      const meta = pages[key];
      const label =
        d.kind === "lesson" ? t(locale, "lesson.kicker", { n: number }) : t(locale, d.kind === "opening" ? "lesson.opening" : "lesson.summary", { n: chapterNumber });
      const v = videoFor(locale, id, chapter.id, d.slug || "opening");
      views.push({
        key,
        locale,
        entry: shown,
        fallback: !tr,
        en,
        course,
        courseEn,
        chapter,
        chapterNumber,
        number,
        label,
        title: tr ? tr.data.title : meta?.title ?? d.title,
        description: tr ? tr.data.description : meta?.description ?? d.description,
        path,
        url: href(locale, `/${path}/`),
        mdUrl: href(locale, `/${path}.md`),
        sourcePath: `academy/${shown.filePath}`,
        video: v?.video ?? null,
        videoLocale: v?.locale ?? null,
        videoSeconds: v ? durationOf(v.video) : 0,
      });
    }
  });
  return { course, lessons: views };
}

/** Which locales have the full text of a course (every page translated). */
export async function fullLocales(id: string) {
  const all = (await getCollection("lessons")).filter((l) => l.data.course === id);
  const count = (loc: string) => all.filter((l) => localeOf(l) === loc).length;
  const total = count("en");
  return [...new Set(all.map(localeOf))].filter((loc) => count(loc) === total) as Locale[];
}

export function chapterLessons(lessons: LessonView[], chapterId: string) {
  return lessons.filter((l) => l.chapter.id === chapterId);
}

/** A chapter's landing page: its opening when it has one, otherwise its first lesson. */
export function chapterUrl(lessons: LessonView[], chapterId: string) {
  return chapterLessons(lessons, chapterId)[0]?.url;
}

export function neighbours(lessons: LessonView[], current: LessonView) {
  const i = lessons.indexOf(current);
  return { prev: lessons[i - 1], next: lessons[i + 1] };
}

export function totalMinutes(lessons: LessonView[]) {
  return lessons.reduce((a, l) => a + l.entry.data.minutes, 0);
}

export function totalVideo(lessons: LessonView[]) {
  return lessons.reduce((a, l) => a + l.videoSeconds, 0);
}
