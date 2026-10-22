import type { LessonView } from "./course";

type Exercise = LessonView["entry"]["data"]["exercises"][number];

/**
 * Builds the agent prompt for a hands-on exercise. It has to stand on its own: an agent
 * that never saw the page should know where to work, what to do, how to tell it's done
 * and what to say back.
 */
export function buildPrompt(view: LessonView, ex: Exercise): string {
  const { course } = view;
  const p = course.data.practice;
  const lines = [
    `You are doing a hands-on exercise from the "${course.data.title}" course: ${view.label}, "${view.entry.data.title}".`,
    "",
    `Exercise: ${ex.title}`,
    `Goal: ${ex.goal}`,
    "",
    `Project: ${p.path} (${p.summary})`,
    "Setup, if not done already:",
    ...p.setup.map((s) => `  ${s}`),
    "",
    "Steps:",
    ...ex.agent.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Done when:",
    ...ex.agent.done.map((s) => `- ${s}`),
    "",
    "Report back:",
    ...ex.agent.report.map((s) => `- ${s}`),
    "",
    "Ground rules:",
    `- Work inside ${p.path}. Don't add dependencies unless a step asks for one.`,
    "- Base every number you report on command output you actually ran. Quote it; don't estimate.",
    "- If a step fails or a tool is missing, stop and report the exact error instead of working around it.",
    "",
    `Lesson text, if you need more context: ${view.sourcePath}`,
  ];
  return lines.join("\n");
}
