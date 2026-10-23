import type { APIRoute, GetStaticPaths } from "astro";
import { LOCALES, type Locale } from "../i18n/locales";
import { courseEntries, loadCourse, chapterLessons, totalMinutes } from "../lib/course";
import { lessonToMarkdown } from "../lib/markdown";
import { planToMarkdown } from "../lib/plan";
import { t, formatMinutes } from "../i18n/ui";

type Props = { kind: "lesson" | "plan" | "course"; locale: Locale; courseId: string; path?: string };

export const getStaticPaths = (async () => {
  const out: { params: { route: string }; props: Props }[] = [];
  for (const { code: locale, prefix } of LOCALES) {
    const pre = prefix ? `${prefix}/` : "";
    for (const c of await courseEntries()) {
      out.push({ params: { route: `${pre}${c.id}` }, props: { kind: "course", locale, courseId: c.id } });
      out.push({ params: { route: `${pre}${c.id}/plan` }, props: { kind: "plan", locale, courseId: c.id } });
      const { lessons } = await loadCourse(c.id, locale);
      for (const l of lessons) out.push({ params: { route: `${pre}${l.path}` }, props: { kind: "lesson", locale, courseId: c.id, path: l.path } });
    }
  }
  return out;
}) satisfies GetStaticPaths;

const md = (body: string) => new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });

export const GET: APIRoute = async ({ props }) => {
  const p = props as Props;
  const { course, lessons } = await loadCourse(p.courseId, p.locale);
  if (p.kind === "lesson") return md(lessonToMarkdown(lessons.find((l) => l.path === p.path)!, lessons));
  if (p.kind === "plan") return md(planToMarkdown(course, lessons));
  const L = p.locale;
  const lines = [`# ${course.title}`, "", `> ${course.tagline}`, "", course.summary, "", `${t(L, "plan.totalTime")}: ${formatMinutes(L, totalMinutes(lessons))}`, ""];
  if (course.practice) lines.push("```bash", ...course.practice.setup, "```", "");
  course.chapters.forEach((c, i) => {
    lines.push(`## ${t(L, "course.chapter", { n: i + 1 })}: ${c.title}`, "", c.summary, "");
    for (const l of chapterLessons(lessons, c.id)) lines.push(`- [${l.label}: ${l.title}](${l.mdUrl}) (${t(L, "lesson.min", { n: l.entry.data.minutes })}). ${l.description}`);
    lines.push("");
  });
  return md(lines.join("\n"));
};
