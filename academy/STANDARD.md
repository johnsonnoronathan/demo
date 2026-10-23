# The Testbench tutorial standard

Every course on Testbench meets this standard. It exists so that a new tutorial can't break the site's layout, and so that every course teaches the same way: a learner watches, reads, measures, hands the implementation to an agent, verifies the result, and decides.

The rules come in two kinds:

- **Checked rules** have an ID such as `P3`. `npm run check` enforces them and names the ID when one fails. A pull request that fails a checked rule can't be merged.
- **Review rules** are marked **R**. A person checks them during review, using the checklist in the pull request template.

## How a course is built

A course is three things in the repository. Nothing else is needed: no new pages, components or styles.

| Part | Where | What it holds |
| --- | --- | --- |
| Course entry | `src/content/courses.yaml` | Title, level, audience, outcomes, chapters, and the practice project if there is one |
| Pages | `src/content/lessons/<locale>/<course>/<n-chapter>/<n-page>.mdx` | One file per page: frontmatter for the facts, Markdown for the lesson |
| Videos | `src/videos/<locale>/<course>/<chapter>/<page>.ts` | One script per page, with narration cues and on-screen panes |

Translations are optional. They go in the same places under another locale, plus titles in `src/i18n/content/<locale>.ts`.

## Course rules

| ID | Rule |
| --- | --- |
| C1 | The course entry has an id, title, tagline, summary, audience, a level (beginner, intermediate or advanced), at least 3 outcomes and at least 2 chapters. No two courses share an `order`. |
| C2 | Every chapter has at least one lesson, and no two pages in a chapter share an `order`. |
| C3 | Either every chapter has a `role` (`overall` or `specific`) or none does. If they do, the course runs overall → specific → overall, and every chapter has an **opening** page (what you'll get) and a **summary** page. A course without roles is a plain sequence of lessons; it needs no openings or summaries, and a chapter may hold a single lesson. |
| C4 | Course text (tagline, summary, audience, chapter summaries) states no counts of lessons, pages or chapters, such as "six short lessons". The site shows the real counts; a written one goes stale with the next lesson. |
| R1 | **Learning, method, validation.** The course teaches the concepts, shows the method as steps the learner can repeat, and ends with a way to verify the result: an acceptance test, a self-check, or a quiz that tests the method, not trivia. |
| R2 | **Real projects.** A course that teaches a practice skill ends by applying it to the learner's own work (an exercise with `target: own`), not only to the practice app. |

## Page rules

| ID | Rule |
| --- | --- |
| P1 | Frontmatter is valid YAML. `kind` is `opening`, `lesson` or `summary`. An opening has `slug: ""` and `order: 0`. Other slugs are lowercase words joined by hyphens. Each page is unique. |
| P2 | Every page has a title, a description of at most 200 characters, and positive `minutes`. A lesson has 2 to 6 outcomes and at least 2 key points. |
| P3 | **Every page has a video**: `src/videos/en/<course>/<chapter>/<slug>.ts`, or `opening.ts` for an opening. |
| P4 | **Every lesson can be checked.** A lesson has a hands-on exercise, or a quiz of at least 2 questions, each with an explanation (`why`). A summary has at least 2 self-check questions (`check`). |
| P5 | **The learner/agent split.** Each exercise appears exactly once in the body as `<Exercise id="…">` with numbered steps inside: the learner's part. Its frontmatter `agent` block has at least 2 steps, a "done when" and a "report back": the agent's part. A course without a practice app uses `target: own`. |
| P6 | A concept doesn't need an animation; `scene` is optional. Every scene a page names is registered in `src/scenes/index.ts`. Every `<Screenshot>` has an `alt` of at least 20 characters that says what the image shows, because agents read it. A screenshot with `src` points at a file in `public/`. |
| R3 | **Real numbers.** Every *measurement* in a lesson (a latency, a size, a count from a tool) comes from a run someone can repeat, with the command shown. Suggested values (a 60-minute time box) and illustrations (a sample date) are fine, labelled as examples. |
| R4 | **The agent implements; the learner decides.** The learner's steps include running the check and reading its output. The agent prompt never lets the agent loosen a budget, threshold or criterion to make a check pass. After the agent reports, the learner reruns the check. For a judgement skill with no check to rerun (exploratory testing, writing a test plan), the learner produces the judgement, the agent turns it into artifacts (bug reports, automated tests), and the learner reviews them against criteria stated in the exercise. |
| R5 | **Pacing for reading.** Short paragraphs, one idea each. A concept comes before the exercise that uses it. A lesson takes 10 to 45 minutes. |

## Video rules

| ID | Rule |
| --- | --- |
| V1 | The script loads, belongs to an existing page, has at least 2 scenes, and opens with a `title` pane. Every scene has a label (it becomes a chapter in the scrubber) and at least one cue. |
| V2 | Every pane timing (`at`, `until`, `subAt`…) is in cue units and lies between 0 and the scene's number of cues. A cue is at most 320 characters, so its caption fits. Concept panes name a registered scene. |
| V3 | A video runs between 20 seconds and 10 minutes. Duration comes from the narration, so write the cues and the length follows. |
| V4 | A title card that names a lesson number (`Lesson 2.3`, `第 2.3 课`) names this page's actual number: chapter position, then position among the chapter's lessons. Insert a lesson and the check tells you which cards to renumber. |
| R6 | **Narration and picture agree.** Nothing appears on screen before the narration mentions it. Terminal panes show real output. You may shorten it to fit (drop lines, cut a stack trace) as long as you change no line you keep. Timings that differ on every run can be left out. |

## Translation rules

English is the source. A translation may cover some pages and not others; untranslated pages fall back to English with a notice.

| ID | Rule |
| --- | --- |
| T1 | A translated page has an English page with the same course, chapter and slug, and keeps its kind, order, minutes, exercise ids, `agent` blocks (prompts stay in English), quiz answers, concept scenes and number of checks. |
| T2 | A translated page uses the same components, in the same order and with the same ids. |
| T3 | A translated video keeps the English video's scenes, cue counts, pane types and timings. Only the words change. |
| T4 | Titles in `src/i18n/content/<locale>.ts` refer to pages that exist. A translation never has more course outcomes or prerequisites than the English. Missing translations are warnings, not failures: an untranslated page title, outcome or prerequisite shows in English. Add new outcomes at the end of the list, so existing translations stay aligned. |

## Layout safety

These rules protect the site's layout, so a new course looks like every other course on every screen.

| ID | Rule |
| --- | --- |
| L1 | No level-1 headings (`# …`) in a page; the page title is the only h1. |
| L2 | No raw HTML, inline styles, scripts or imports in a page. Use Markdown and the site's components: `Scene`, `Exercise`, `Screenshot`, `Callout`, `Outcomes`, `ChapterMap`, `CourseArc`, `ChapterRecap`, `SelfCheck`. HTML inside code blocks is fine. |
| L3 | No root-relative links (`](/…)`) in a page; they break under the site's base path. |
| L4 | In the built site, every internal link and asset resolves to a file (`npm run check:links`). |
| L5 | Every page opens in a real browser at phone (390 px) and desktop (1280 px) width with no sideways scrolling, no script errors, no failed requests, exactly one h1, and a video on every lesson page (`npm run check:layout`). |

If a course needs something the components can't do, propose a new component in an issue first. Don't add one inside a course.

## Running the checks

```bash
cd academy
npm run check          # all of the below, in order
npm run check:content  # C, P, V, T, L1–L3: seconds, no build needed
npm run build:pages    # the site, as GitHub Pages serves it
BASE_PATH=/demo npm run check:links    # L4
BASE_PATH=/demo npm run check:layout   # L5: about a minute
```

The same checks run on every pull request (`.github/workflows/academy-checks.yml`). When a pull request is merged into `main`, the site is rebuilt and published.

## Contributing

| Change | Proposal issue first? |
| --- | --- |
| A new course, or a new chapter | **Yes.** Agree the outline before writing pages. |
| A new lesson in an existing chapter, a fix, a translation | No. Open a pull request and explain it there. |

1. For a new course or chapter, open a "Propose a tutorial" issue with the audience, outcomes and chapter outline, and wait for a maintainer's yes.
2. Branch from `main` and write the change, with Claude Code or another agent if you like. The `new-tutorial` skill in `.claude/skills/` walks an agent through this standard.
3. Run `npm run check` until it passes. Open a pull request against `main` and fill in the review checklist. Mark a review rule that doesn't apply as "n/a" with a reason, rather than leaving it unticked.
4. Keep the branch mergeable: GitHub doesn't run the checks on a pull request with a merge conflict. Merge `main` into your branch to resolve one.
5. A maintainer checks the R rules and merges. The site publishes itself.

### Extending an existing course

- Give the new page the next free `order` in its chapter, or renumber the files after it. Lesson numbers come from position, so `npm run check` (V4) lists every video title card that needs a new number.
- Don't write counts of lessons, pages or chapters in prose, such as "six short lessons". The site computes and shows them, and a hard-coded count goes stale with the next lesson.
- New course outcomes go at the end of the list (T4). Translations are optional; untranslated items show in English.
- Either YAML style is fine in frontmatter: block lists (`- item`) or one-line flow lists (`["a", "b"]`). Match the file you're editing.

Feedback on any page is one click away: every lesson has a **Suggest an improvement** link that opens an issue for that page. Good suggestions become changes to a course, or to this standard.
