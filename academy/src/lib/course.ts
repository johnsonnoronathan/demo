import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Course = CollectionEntry<"courses">;
export type Lesson = CollectionEntry<"lessons">;
export type Chapter = Course["data"]["chapters"][number];

/** A lesson plus everything a page needs to place it in the course. */
export interface LessonView {
  entry: Lesson;
  course: Course;
  chapter: Chapter;
  chapterNumber: number;
  /** "2.3" for lessons, "2" for openings and summaries. */
  number: string;
  /** "Lesson 2.3", "Chapter 2 opening", "Chapter 2 summary". */
  label: string;
  path: string; // URL path without trailing slash
  url: string;
  mdUrl: string;
  sourcePath: string; // repo-relative path of the MDX file
}

const KIND_ORDER = { opening: 0, lesson: 1, summary: 2 } as const;

export async function loadCourse(id: string) {
  const course = await getEntry("courses", id);
  if (!course) throw new Error(`Unknown course ${id}`);
  const all = (await getCollection("lessons")).filter((l) => l.data.course === id);
  const chapters = course.data.chapters;
  const views: LessonView[] = [];
  chapters.forEach((chapter, ci) => {
    const inChapter = all
      .filter((l) => l.data.chapter === chapter.id)
      .sort((a, b) => KIND_ORDER[a.data.kind] - KIND_ORDER[b.data.kind] || a.data.order - b.data.order);
    let n = 0;
    for (const entry of inChapter) {
      const chapterNumber = ci + 1;
      const isLesson = entry.data.kind === "lesson";
      if (isLesson) n++;
      const number = isLesson ? `${chapterNumber}.${n}` : String(chapterNumber);
      const label = isLesson
        ? `Lesson ${number}`
        : `Chapter ${chapterNumber} ${entry.data.kind === "opening" ? "opening" : "summary"}`;
      const path = entry.data.kind === "opening" ? `${id}/${chapter.id}` : `${id}/${chapter.id}/${entry.data.slug}`;
      views.push({
        entry, course, chapter, chapterNumber, number, label, path,
        url: `/${path}/`,
        mdUrl: `/${path}.md`,
        sourcePath: `academy/${entry.filePath}`,
      });
    }
  });
  return { course, lessons: views };
}

export function chapterLessons(lessons: LessonView[], chapterId: string) {
  return lessons.filter((l) => l.chapter.id === chapterId);
}

export function neighbours(lessons: LessonView[], current: LessonView) {
  const i = lessons.indexOf(current);
  return { prev: lessons[i - 1], next: lessons[i + 1] };
}

export function totalMinutes(lessons: LessonView[]) {
  return lessons.reduce((a, l) => a + l.entry.data.minutes, 0);
}

export function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
