import { chapterLessons, totalMinutes, formatMinutes, type LessonView, type Course } from "./course";
import { buildPrompt } from "./prompt";
import { scenes } from "../scenes";

/** The lesson plan as Markdown: the same facts as the plan page, for agents and for pasting. */
export function planToMarkdown(course: Course, lessons: LessonView[], site = ""): string {
  const d = course.data;
  const out: string[] = [
    `# Lesson plan: ${d.title}`,
    "",
    `${d.summary}`,
    "",
    `- Total time: ${formatMinutes(totalMinutes(lessons))}`,
    `- Audience: ${d.audience}`,
    `- Practice app: ${d.practice.name} at \`${d.practice.path}\`. ${d.practice.summary}`,
    "",
    "## Course goals",
    "",
    ...d.outcomes.map((o) => `- ${o}`),
    "",
    "## Prerequisites",
    "",
    ...d.prerequisites.map((p) => `- ${p}`),
    "",
    "## Structure",
    "",
    ...d.chapters.map((c, i) => `${i + 1}. **${c.title}** (${c.role}, ${chapterLessons(lessons, c.id).reduce((a, l) => a + l.entry.data.minutes, 0)} min): ${c.summary}`),
    "",
  ];
  d.chapters.forEach((c, i) => {
    const ls = chapterLessons(lessons, c.id);
    out.push(`## Chapter ${i + 1}: ${c.title}`, "", `${c.summary} (${formatMinutes(totalMinutes(ls))}, ${c.role})`, "");
    for (const l of ls) {
      const e = l.entry.data;
      out.push(`### ${l.label}: ${e.title} (${e.minutes} min)`, "", e.description, "", `Classroom page: ${site}${l.mdUrl}`, "");
      if (e.outcomes.length) out.push("Outcomes:", ...e.outcomes.map((o) => `- ${o}`), "");
      if (e.concepts.length)
        out.push("Concepts:", ...e.concepts.map((k) => `- ${k.title}${k.scene && scenes[k.scene] ? ` (animation: ${scenes[k.scene].title})` : ""}`), "");
      for (const ex of e.exercises) {
        out.push(`Hands-on: **${ex.title}** (${ex.minutes} min). ${ex.goal}`, "", "```text", buildPrompt(l, ex), "```", "");
      }
      if (e.keyPoints.length) out.push("Key points:", ...e.keyPoints.map((k) => `- ${k}`), "");
      if (e.check.length) out.push("Self-check:", ...e.check.map((q, n) => `${n + 1}. ${q.q}\n   Answer: ${q.a}`), "");
    }
  });
  return out.join("\n");
}
