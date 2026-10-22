/* Turns a lesson into plain Markdown for agents and other tools.
 *
 * Components become their text equivalent: the video becomes its transcript, a scene
 * becomes its numbered steps, a screenshot becomes its description, an exercise keeps its
 * steps and gains the full agent prompt. Nothing visual is lost that a reader without
 * eyes would need.
 */
import { scenes } from "../scenes";
import { translations } from "../i18n/content";
import { buildPrompt } from "./prompt";
import { chapterLessons, type LessonView } from "./course";
import { t, formatClock } from "../i18n/ui";
import { timeline } from "../video/timeline";

function attrs(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of src.matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

const quote = (text: string) => text.trim().split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n");

export function transcript(view: LessonView) {
  if (!view.video) return "";
  const tl = timeline(view.video);
  const L = view.locale;
  return [
    `## ${t(L, "lesson.transcript")}: ${view.video.title} (${formatClock(tl.total)})`,
    "",
    ...tl.scenes.map((s) => `**${formatClock(s.start)} ${s.def.label}.** ${s.def.cues.join(" ")}`).flatMap((p) => [p, ""]),
  ].join("\n");
}

export function lessonToMarkdown(view: LessonView, all: LessonView[]): string {
  const L = view.locale;
  const d = view.entry.data;
  let body = view.entry.body ?? "";

  body = body.replace(/^import .*$/gm, "");

  body = body.replace(/<Scene\s+([^>]*?)\/>/g, (_, a) => {
    const name = attrs(a).name;
    const def = scenes[name];
    if (!def) return "";
    const tr = translations[L]?.scenes?.[name];
    const steps = tr?.steps?.length === def.steps.length ? tr.steps : def.steps;
    return quote(`**${t(L, "scene.kicker")}: ${tr?.title ?? def.title}**\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  });

  body = body.replace(/<Screenshot\s+([\s\S]*?)\/>/g, (_, a) => {
    const { alt, caption, src, title } = attrs(a);
    const where = title ? ` (${title})` : "";
    return `![${alt}](${src ?? "screenshot-pending"})\n*Screenshot${where}: ${caption ?? alt}*`;
  });

  body = body.replace(/<Callout\s*([^>]*)>([\s\S]*?)<\/Callout>/g, (_, a, inner) => {
    const { type = "note", title } = attrs(a);
    return quote(`**${title ?? t(L, `callout.${type as "note"}`)}.** ${inner.trim()}`);
  });

  body = body.replace(/<Exercise\s+id="([^"]+)"\s*>([\s\S]*?)<\/Exercise>/g, (_, id, inner) => {
    const ex = d.exercises.find((e) => e.id === id) ?? view.en.data.exercises.find((e) => e.id === id);
    if (!ex) return inner;
    return [
      `**${t(L, "ex.kicker", { n: ex.minutes })}.** ${t(L, "ex.goal")} ${ex.goal}`,
      "",
      inner.trim(),
      "",
      `**${t(L, "ex.doneWhen")}**`,
      ...ex.agent.done.map((x) => `- ${x}`),
      "",
      `**${t(L, "agent.title")}**`,
      "",
      "```text",
      buildPrompt(view, ex.id),
      "```",
    ].join("\n");
  });

  body = body.replace(/<Outcomes[^>]*\/>/g, () => `## ${t(L, "course.opening")}\n\n${d.outcomes.map((o) => `- ${o}`).join("\n")}`);

  body = body.replace(/<ChapterMap\s*\/>/g, () =>
    chapterLessons(all, view.chapter.id)
      .filter((l) => l !== view)
      .map((l) => `- ${l.label}: [${l.title}](${l.mdUrl}) (${t(L, "lesson.min", { n: l.entry.data.minutes })}). ${l.description}`)
      .join("\n")
  );

  body = body.replace(/<ChapterRecap\s*([^>]*)\/>/g, (_, a) =>
    (attrs(a).scope === "course" ? all : chapterLessons(all, view.chapter.id))
      .filter((l) => l.entry.data.kind === "lesson")
      .map((l) => `### ${l.number} ${l.title}\n\n${l.entry.data.keyPoints.map((k) => `- ${k}`).join("\n")}`)
      .join("\n\n")
  );

  body = body.replace(/<SelfCheck\s*\/>/g, () => d.check.map((c, i) => `${i + 1}. ${c.q}\n   ${c.a}`).join("\n"));

  body = body.replace(/<CourseArc\s*\/>/g, () =>
    view.course.chapters.map((c, i) => `${i + 1}. **${c.title}**${c.role ? ` (${t(L, c.role === "overall" ? "course.role.overall" : "course.role.specific")})` : ""}: ${c.summary}`).join("\n")
  );

  const i = all.indexOf(view);
  const prev = all[i - 1], next = all[i + 1];
  const head = [
    `# ${view.label}: ${view.title}`,
    "",
    `${view.course.title} · ${t(L, "course.chapter", { n: view.chapterNumber })}: ${view.chapter.title} · ${t(L, "lesson.min", { n: d.minutes })}`,
    "",
    `> ${view.description}`,
  ];
  if (view.fallback && L !== "en") head.push("", `*${t(L, "lesson.fallback", { lang: L })}*`);
  if (d.kind === "lesson" && d.outcomes.length) head.push("", `**${t(L, "lesson.youWill")}:**`, ...d.outcomes.map((o) => `- ${o}`));
  const quiz = d.quiz.length ? d.quiz : view.en.data.quiz;
  const foot: string[] = [];
  if (quiz.length) foot.push("## Quiz", "", ...quiz.map((q, n) => `${n + 1}. ${q.q}\n${q.options.map((o, oi) => `   ${String.fromCharCode(97 + oi)}. ${o}`).join("\n")}\n   Answer: ${String.fromCharCode(97 + q.answer)}. ${q.why}`), "");
  if (d.kind === "lesson" && d.keyPoints.length) foot.push(`## ${t(L, "lesson.keyPoints")}`, "", ...d.keyPoints.map((k) => `- ${k}`), "");
  foot.push("---", "");
  if (prev) foot.push(`${t(L, "lesson.prev")}: [${prev.label}: ${prev.title}](${prev.mdUrl})`);
  if (next) foot.push(`${t(L, "lesson.next")}: [${next.label}: ${next.title}](${next.mdUrl})`);

  return [...head, "", transcript(view), `## ${t(L, "lesson.readIntro")}`, "", body.replace(/\n{3,}/g, "\n\n").trim(), "", ...foot, ""].join("\n");
}
