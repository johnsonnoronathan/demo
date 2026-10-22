import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { loadCourse } from "../../lib/course";
import { lessonToMarkdown } from "../../lib/markdown";

export const getStaticPaths = (async () => (await getCollection("courses")).map((c) => ({ params: { course: c.id } }))) satisfies GetStaticPaths;

/** Every page of the course, in order, as one Markdown file. */
export const GET: APIRoute = async ({ params }) => {
  const { lessons } = await loadCourse(params.course!);
  const body = lessons.map((l) => lessonToMarkdown(l, lessons)).join("\n\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
