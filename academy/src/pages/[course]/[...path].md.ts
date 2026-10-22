import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { loadCourse, type LessonView } from "../../lib/course";
import { lessonToMarkdown } from "../../lib/markdown";

export const getStaticPaths = (async () => {
  const out = [];
  for (const c of await getCollection("courses")) {
    const { lessons } = await loadCourse(c.id);
    for (const view of lessons) out.push({ params: { course: c.id, path: view.path.slice(c.id.length + 1) }, props: { view, lessons } });
  }
  return out;
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { view, lessons } = props as { view: LessonView; lessons: LessonView[] };
  return new Response(lessonToMarkdown(view, lessons), { headers: { "content-type": "text/markdown; charset=utf-8" } });
};
