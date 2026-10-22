import type { LessonView } from "./course";

/**
 * Builds the agent prompt for a hands-on exercise. It has to stand on its own: an agent
 * that never saw the page should know where to work, what to do, how to tell it's done
 * and what to say back. Prompts are always in English, built from the English page, so
 * an agent gets the same instructions whatever language the learner reads.
 */
export function buildPrompt(view: LessonView, exerciseId: string): string {
  const course = view.courseEn;
  const ex = view.en.data.exercises.find((e) => e.id === exerciseId);
  if (!ex) throw new Error(`Exercise ${exerciseId} not found in ${view.en.filePath}`);
  const p = course.practice;
  const lines = [
    `You are doing a hands-on exercise from the "${course.title}" course: ${view.en.data.kind === "lesson" ? `Lesson ${view.number}` : `Chapter ${view.chapterNumber}`}, "${view.en.data.title}".`,
    "",
    `Exercise: ${ex.title}`,
    `Goal: ${ex.goal}`,
    "",
    ...(p ? [`Project: ${p.path} (${p.summary})`, "Setup, if not done already:", ...p.setup.map((s) => `  ${s}`), ""] : []),
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
    ...(p ? [`- Work inside ${p.path}. Don't add dependencies unless a step asks for one.`] : []),
    "- Base every number you report on command output you actually ran. Quote it; don't estimate.",
    "- If a step fails or a tool is missing, stop and report the exact error instead of working around it.",
    "",
    `Lesson text, if you need more context: academy/${view.en.filePath}`,
  ];
  return lines.join("\n");
}
