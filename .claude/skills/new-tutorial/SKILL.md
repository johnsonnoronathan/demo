---
name: new-tutorial
description: Add a course, chapter, page, video or translation to the Testbench tutorial site in academy/, following academy/STANDARD.md and passing `npm run check`. Use this skill whenever someone asks to write, add, extend, translate or fix a tutorial, course, lesson, chapter, quiz, exercise or lesson video in this repository, or to turn notes, docs or an outline into a Testbench course, even if they never say "skill" or "standard".
---

# Adding a tutorial to Testbench

Testbench is one site. A new tutorial is **content**: a course entry, MDX pages and video scripts. It is never a new site, page template, component or stylesheet. The rules are in `academy/STANDARD.md`; `npm run check` enforces the checked ones. This skill is the order of work that gets a course through both.

## Before you write

1. Read `academy/STANDARD.md` in full. Every rule ID you'll see in a check failure is explained there.
2. Read one finished example of each page kind, so your pages match the house style:
   - opening: `academy/src/content/lessons/en/performance-testing/2-static/0-opening.mdx`
   - lesson with an exercise: `academy/src/content/lessons/en/performance-testing/2-static/1-budgets.mdx`
   - lesson with a quiz: `academy/src/content/lessons/en/test-cases/2-design/1-partitions.mdx`
   - summary: `academy/src/content/lessons/en/performance-testing/2-static/9-summary.mdx`
   - video: `academy/src/videos/en/performance-testing/static/budgets.ts` and the pane types in `academy/src/video/types.ts`
3. Agree the outline with the person you're working for: audience, level, 3 or more outcomes, chapters, and for each lesson the concept it teaches and how the learner checks it (exercise or quiz). Don't write pages before the outline is agreed.

## Order of work

1. **Course entry.** Add the course to `academy/src/content/courses.yaml`. Give it the next free `order`. Add `practice:` only if the course ships a practice project; otherwise every exercise uses `target: own`.
2. **Pages.** One MDX file per page under `academy/src/content/lessons/en/<course>/<n-chapter>/`. Start from `templates/lesson.mdx` (and `opening.mdx`, `summary.mdx` if chapters have roles). File names start with the order: `0-opening.mdx`, `1-<slug>.mdx`, `9-summary.mdx`.
3. **Videos.** One script per page under `academy/src/videos/en/<course>/<chapter>/<slug>.ts` (`opening.ts` for openings). Start from `templates/video.ts`. Write the narration first; the timing follows from it.
4. **Check early and often.** Run `npm run check:content` in `academy/` after every few files. It takes seconds and names the rule and file for each problem.
5. **Full check.** Run `npm run check` (content, build, links, layout in a browser). Fix every failure. Don't stop at the first one; rerun until it passes.
6. **Pull request.** Commit on a branch and open a pull request. Fill in the review checklist in the template honestly, with an R rule unchecked if you aren't sure it holds.

## Writing the pages

- **The learner/agent split (P5, R4).** Inside `<Exercise id="…">` write the learner's numbered steps: run the check, read the output (show the expected output in a code block), decide. The `agent:` block in frontmatter is what the agent does: implement, then report with quoted output. Always include a step forbidding the agent from loosening any limit. The learner's last step is to rerun the check themselves.
- **Validation (P4, R1).** Every lesson ends with something the learner can verify: an exercise with "done when", or a quiz whose questions test the method. Explain every quiz answer in `why`.
- **Real numbers (R3).** Never invent a measurement. Run the command and paste the output. If you can't run it, write the step without a number and tell the person you're working for.
- **Only the site's components (L2).** `Scene`, `Exercise`, `Screenshot`, `Callout`, `Outcomes`, `ChapterMap`, `CourseArc`, `ChapterRecap`, `SelfCheck`. No HTML, styles, imports or root-relative links. HTML is fine inside fenced code blocks.
- **Screenshots (P6).** Use `<Screenshot alt="…" caption="…" kind="terminal|browser|editor" title="…" />` without `src` until a real image exists; it draws a labelled placeholder. Write the alt as a description someone could check the image against.
- **Concept animations.** Reuse a registered scene from `academy/src/scenes/index.ts` if one fits. A new scene is a code change to the site, not content: propose it in an issue instead of adding it in a course pull request.

## Writing the videos

- First scene: a `title` pane with `kicker: "Lesson <n> · <chapter>"`, the page title as `heading`, and a short `sub`.
- One idea per scene; the scene `label` becomes a chapter in the player. Two to five cues per scene.
- Pane timings are in **cue units**: `at: 1.5` means halfway through the second cue. Every value is between 0 and the scene's number of cues (V2).
- Narrate what the picture shows, in the order it appears. Terminal panes show real output (R6).

## Translating

Copy the English file to the same path under the locale (`lessons/zh/…`, `videos/zh/…`) and translate the words only. Keep every id, order, slug, minutes, `agent:` block, quiz answer index, component, cue count and timing (T1–T3); the check compares them with English. Add the page's title and description to `academy/src/i18n/content/<locale>.ts`.

## Never

- Never edit `academy/src/components`, `layouts`, `views`, `styles`, `video` or `scripts/check-*.mjs` as part of adding a course. If the course needs a change there, stop and propose it separately.
- Never relax a check, skip one, or delete content to make `npm run check` pass. Fix the content.
- Never invent numbers, output or screenshots.
