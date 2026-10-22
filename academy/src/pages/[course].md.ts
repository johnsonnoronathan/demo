import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { loadCourse, chapterLessons, totalMinutes, formatMinutes } from "../lib/course";

export const getStaticPaths = (async () => (await getCollection("courses")).map((c) => ({ params: { course: c.id } }))) satisfies GetStaticPaths;

/** The course outline: what an agent reads first. */
export const GET: APIRoute = async ({ params }) => {
  const { course, lessons } = await loadCourse(params.course!);
  const d = course.data;
  const lines = [
    `# ${d.title}`,
    "",
    `> ${d.tagline}`,
    "",
    d.summary,
    "",
    `Total time: ${formatMinutes(totalMinutes(lessons))}. Practice app: \`${d.practice.path}\`.`,
    `Lesson plan: /${course.id}/plan.md · Whole course in one file: /${course.id}/llms-full.txt`,
    "",
    "## Setup",
    "",
    "```bash",
    ...d.practice.setup,
    "```",
    "",
  ];
  d.chapters.forEach((c, i) => {
    lines.push(`## Chapter ${i + 1}: ${c.title} (${c.role})`, "", c.summary, "");
    for (const l of chapterLessons(lessons, c.id)) {
      const ex = l.entry.data.exercises.length ? ` · ${l.entry.data.exercises.length} hands-on with agent prompt` : "";
      lines.push(`- [${l.label}: ${l.entry.data.title}](${l.mdUrl}) (${l.entry.data.minutes} min${ex}). ${l.entry.data.description}`);
    }
    lines.push("");
  });
  return new Response(lines.join("\n"), { headers: { "content-type": "text/markdown; charset=utf-8" } });
};
