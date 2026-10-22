import type { APIRoute, GetStaticPaths } from "astro";
import { LOCALES, type Locale } from "../i18n/locales";
import { courseEntries, loadCourse } from "../lib/course";
import { lessonToMarkdown } from "../lib/markdown";

/** <course>/llms-full.txt: every page of a course, in order, as one Markdown file. */
export const getStaticPaths = (async () => {
  const out: { params: { route: string }; props: { locale: Locale; courseId: string } }[] = [];
  for (const { code: locale, prefix } of LOCALES)
    for (const c of await courseEntries()) out.push({ params: { route: `${prefix ? prefix + "/" : ""}${c.id}/llms-full` }, props: { locale, courseId: c.id } });
  return out;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { locale, courseId } = props as { locale: Locale; courseId: string };
  const { lessons } = await loadCourse(courseId, locale);
  return new Response(lessons.map((l) => lessonToMarkdown(l, lessons)).join("\n\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
};
