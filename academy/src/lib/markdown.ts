/* Turns a lesson's MDX into plain Markdown for agents and other tools.
 *
 * Components become their text equivalent: a scene becomes its numbered steps, a
 * screenshot becomes its description, an exercise keeps its steps and gains the full
 * agent prompt. Nothing visual is lost that a reader without eyes would need.
 */
import { scenes } from "../scenes";
import { buildPrompt } from "./prompt";
import { chapterLessons, type LessonView } from "./course";

function attrs(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of src.matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

const quote = (text: string) => text.trim().split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n");

export function lessonToMarkdown(view: LessonView, all: LessonView[], site = ""): string {
  const d = view.entry.data;
  let body = view.entry.body ?? "";

  body = body.replace(/^import .*$/gm, "");

  body = body.replace(/<Scene\s+([^>]*?)\/>/g, (_, a) => {
    const def = scenes[attrs(a).name];
    if (!def) return "";
    return quote(`**Concept animation: ${def.title}**\n\n${def.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  });

  body = body.replace(/<Screenshot\s+([\s\S]*?)\/>/g, (_, a) => {
    const { alt, caption, src, title } = attrs(a);
    const where = title ? ` (${title})` : "";
    return `![${alt}](${src ?? "screenshot-pending"})\n*Screenshot${where}: ${caption ?? alt}*`;
  });

  body = body.replace(/<Callout\s*([^>]*)>([\s\S]*?)<\/Callout>/g, (_, a, inner) => {
    const { type = "note", title } = attrs(a);
    const label = title ?? { note: "Note", tip: "Tip", warn: "Watch out" }[type as "note"];
    return quote(`**${label}.** ${inner.trim()}`);
  });

  body = body.replace(/<Exercise\s+id="([^"]+)"\s*>([\s\S]*?)<\/Exercise>/g, (_, id, inner) => {
    const ex = d.exercises.find((e) => e.id === id);
    if (!ex) return inner;
    return [
      `**Hands-on · ${ex.minutes} min.** Goal: ${ex.goal}`,
      "",
      inner.trim(),
      "",
      "**Done when**",
      ...ex.agent.done.map((x) => `- ${x}`),
      "",
      "**Agent prompt** (copy it into a coding agent to run this exercise):",
      "",
      "```text",
      buildPrompt(view, ex),
      "```",
    ].join("\n");
  });

  body = body.replace(/<Outcomes[^>]*\/>/g, () => `## What you'll get\n\n${d.outcomes.map((o) => `- ${o}`).join("\n")}`);

  body = body.replace(/<ChapterMap\s*\/>/g, () =>
    chapterLessons(all, view.chapter.id)
      .filter((l) => l !== view)
      .map((l) => `- ${l.label}: [${l.entry.data.title}](${site}${l.mdUrl}) (${l.entry.data.minutes} min). ${l.entry.data.description}`)
      .join("\n")
  );

  body = body.replace(/<ChapterRecap\s*([^>]*)\/>/g, (_, a) =>
    (attrs(a).scope === "course" ? all : chapterLessons(all, view.chapter.id))
      .filter((l) => l.entry.data.kind === "lesson")
      .map((l) => `### ${l.number} ${l.entry.data.title}\n\n${l.entry.data.keyPoints.map((k) => `- ${k}`).join("\n")}`)
      .join("\n\n")
  );

  body = body.replace(/<SelfCheck\s*\/>/g, () => d.check.map((c, i) => `${i + 1}. ${c.q}\n   Answer: ${c.a}`).join("\n"));

  body = body.replace(/<CourseArc\s*\/>/g, () =>
    view.course.data.chapters.map((c, i) => `${i + 1}. **${c.title}** (${c.role}): ${c.summary}`).join("\n")
  );

  const i = all.indexOf(view);
  const prev = all[i - 1], next = all[i + 1];
  const head = [
    `# ${view.label}: ${d.title}`,
    "",
    `Course: ${view.course.data.title} · Chapter ${view.chapterNumber}: ${view.chapter.title} · ${d.minutes} min`,
    "",
    `> ${d.description}`,
  ];
  if (d.kind === "lesson" && d.outcomes.length) head.push("", "**You'll be able to:**", ...d.outcomes.map((o) => `- ${o}`));
  const foot: string[] = [];
  if (d.kind === "lesson" && d.keyPoints.length) foot.push("## Key points", "", ...d.keyPoints.map((k) => `- ${k}`), "");
  foot.push("---", "");
  if (prev) foot.push(`Previous: [${prev.label}: ${prev.entry.data.title}](${site}${prev.mdUrl})`);
  if (next) foot.push(`Next: [${next.label}: ${next.entry.data.title}](${site}${next.mdUrl})`);

  return [...head, "", body.replace(/\n{3,}/g, "\n\n").trim(), "", ...foot, ""].join("\n");
}
