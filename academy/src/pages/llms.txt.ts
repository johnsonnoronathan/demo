import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { loadCourse } from "../lib/course";

/** llms.txt: a plain index of the site for language models and agents. */
export const GET: APIRoute = async () => {
  const lines = [
    "# Testbench",
    "",
    "> Testing tutorials written for people and for agents. Every page below is Markdown. Hands-on exercises include a",
    "> self-contained agent prompt (steps, done-when criteria, what to report) in a ```text block.",
    "",
  ];
  for (const c of await getCollection("courses")) {
    const { lessons } = await loadCourse(c.id);
    lines.push(`## ${c.data.title}`, "", c.data.tagline, "");
    lines.push(`- [Course outline](/${c.id}.md)`, `- [Lesson plan](/${c.id}/plan.md)`, `- [Whole course in one file](/${c.id}/llms-full.txt)`);
    for (const l of lessons) lines.push(`- [${l.label}: ${l.entry.data.title}](${l.mdUrl}): ${l.entry.data.description}`);
    lines.push("");
  }
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
};
