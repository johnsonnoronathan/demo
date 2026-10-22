import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { loadCourse } from "../../lib/course";
import { planToMarkdown } from "../../lib/plan";

export const getStaticPaths = (async () => (await getCollection("courses")).map((c) => ({ params: { course: c.id } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const { course, lessons } = await loadCourse(params.course!);
  return new Response(planToMarkdown(course, lessons), { headers: { "content-type": "text/markdown; charset=utf-8" } });
};
