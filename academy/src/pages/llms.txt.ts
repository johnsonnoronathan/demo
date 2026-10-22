import type { APIRoute } from "astro";
import { LOCALES, href, localeInfo } from "../i18n/locales";
import { courseEntries, loadCourse, fullLocales } from "../lib/course";

/** llms.txt: a plain index of the site for language models and agents. */
export const GET: APIRoute = async () => {
  const lines = [
    "# Testbench",
    "",
    "> Video tutorials on software testing, written for people and for agents. Every page below is Markdown and",
    "> starts with its video's transcript. Hands-on exercises include a self-contained agent prompt (steps, done-when",
    "> criteria, what to report) in a ```text block. Agent prompts are always in English.",
    "",
    `Languages: ${LOCALES.map((l) => `${l.label} (${l.prefix ? "/" + l.prefix + "/" : "/"})`).join(", ")}.`,
    "",
  ];
  for (const c of await courseEntries()) {
    const { course, lessons } = await loadCourse(c.id, "en");
    const full = await fullLocales(c.id);
    lines.push(`## ${course.title}`, "", course.tagline, "");
    lines.push(`- [Course outline](/${c.id}.md)`, `- [Lesson plan](/${c.id}/plan.md)`, `- [Whole course in one file](/${c.id}/llms-full.txt)`);
    for (const l of lessons) lines.push(`- [${l.label}: ${l.title}](${l.mdUrl}): ${l.description}`);
    const others = full.filter((f) => f !== "en");
    if (others.length) {
      lines.push("", `Full text also in: ${others.map((f) => `${localeInfo(f).label} ([outline](${href(f, `/${c.id}.md`)}), [one file](${href(f, `/${c.id}/llms-full.txt`)}))`).join(", ")}.`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
};
