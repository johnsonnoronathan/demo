import { chapterLessons, totalMinutes, totalVideo, type LessonView, type CourseInfo } from "./course";
import { buildPrompt } from "./prompt";
import { t, formatMinutes, formatClock } from "../i18n/ui";

/** The lesson plan as Markdown: the same facts as the plan page, for agents and for pasting. */
export function planToMarkdown(course: CourseInfo, lessons: LessonView[]): string {
  const L = course.locale;
  const out: string[] = [
    `# ${t(L, "plan.eyebrow")}: ${course.title}`,
    "",
    course.summary,
    "",
    `- ${t(L, "plan.totalTime")}: ${formatMinutes(L, totalMinutes(lessons))}`,
    `- ${t(L, "course.facts.videos")}: ${lessons.filter((l) => l.video).length} (${formatClock(totalVideo(lessons))})`,
    `- ${course.audience}`,
    ...(course.practice ? [`- ${t(L, "course.facts.app")}: ${course.practice.name}, \`${course.practice.path}\`. ${course.practice.summary}`] : []),
    "",
    `## ${t(L, "plan.goals")}`,
    "",
    ...course.outcomes.map((o) => `- ${o}`),
    "",
    `## ${t(L, "course.before")}`,
    "",
    ...course.prerequisites.map((p) => `- ${p}`),
    "",
    `## ${t(L, "plan.structure")}`,
    "",
    ...course.chapters.map((c, i) => `${i + 1}. **${c.title}** (${totalMinutes(chapterLessons(lessons, c.id))} min): ${c.summary}`),
    "",
  ];
  course.chapters.forEach((c, i) => {
    const ls = chapterLessons(lessons, c.id);
    out.push(`## ${t(L, "course.chapter", { n: i + 1 })}: ${c.title}`, "", `${c.summary} (${formatMinutes(L, totalMinutes(ls))})`, "");
    for (const l of ls) {
      const e = l.entry.data;
      out.push(`### ${l.label}: ${l.title} (${t(L, "lesson.min", { n: e.minutes })}${l.video ? `, ▶ ${formatClock(l.videoSeconds)}` : ""})`, "", l.description, "", l.mdUrl, "");
      if (e.outcomes.length) out.push(`${t(L, "plan.outcomes")}:`, ...e.outcomes.map((o) => `- ${o}`), "");
      if (e.concepts.length) out.push(`${t(L, "plan.concepts")}:`, ...e.concepts.map((k) => `- ${k.title}`), "");
      for (const ex of e.exercises) out.push(`${t(L, "ex.kicker", { n: ex.minutes })}: **${ex.title}**. ${ex.goal}`, "", "```text", buildPrompt(l, ex.id), "```", "");
      if (e.keyPoints.length) out.push(`${t(L, "plan.keyPoints")}:`, ...e.keyPoints.map((k) => `- ${k}`), "");
      if (e.check.length) out.push(`${t(L, "plan.selfCheck")}:`, ...e.check.map((q, n) => `${n + 1}. ${q.q}\n   ${q.a}`), "");
    }
  });
  return out.join("\n");
}
