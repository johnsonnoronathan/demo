# Testbench

Testing tutorials written for people and for agents. Built with Astro and MDX.

The first course is **Performance Testing**: 4 chapters, 20 pages and about five and a half hours. It has 13 concept animations and 12 hands-on exercises, all run against a practice app that is slow on purpose.

```bash
cd academy
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
```

## Two views of one course

| View | URL | For |
| --- | --- | --- |
| **Classroom** | `/performance-testing/` and its lesson pages | Learning in order: animations, hands-on exercises, progress |
| **Lesson plan** | `/performance-testing/plan/` | Seeing the whole course at once: goals, schedule, outcomes, key points, exercises and self-checks per lesson |

Both are generated from the same MDX files, so they can't drift apart. The plan reads each lesson's frontmatter; the classroom renders its body.

## Course structure

The course runs **overall → specific → overall**:

1. **Overview** (overall): what performance testing measures; static versus dynamic; a test plan
2. **Static testing** (specific): budgets, N+1 queries, query plans, asset weight
3. **Dynamic testing** (specific): Lighthouse, k6 load tests, stress/spike/soak tests, profiling
4. **Summary** (overall): a CI workflow, reporting, the whole-course recap

Every chapter has an **opening** page ("what you'll get", plus a map of the chapter), its **lessons**, and a **summary** page. The summary gathers every lesson's key points automatically and adds self-check questions. Each lesson mixes concepts, illustrated by an animated scene, with a hands-on exercise that has screenshots.

## Built for agents

- **Agent prompts on exercises only.** Every hands-on exercise ends with a **Copy prompt** button. The prompt is assembled from the exercise's frontmatter (`src/lib/prompt.ts`) and stands on its own: the project path and setup, steps, "done when" criteria, what to report, and ground rules (quote real output, stop on errors). Pages without exercises have no prompt.
- **A Markdown twin of every page.** `/performance-testing/static/n-plus-one.md` is the lesson as Markdown. Each scene becomes its numbered steps, each screenshot its description, and each exercise keeps its full prompt. HTML pages link to their twin with `<link rel="alternate" type="text/markdown">`.
- **`/llms.txt`** indexes every course and page. `/performance-testing/llms-full.txt` is the whole course in one file. `/performance-testing/plan.md` is the lesson plan.

## Authoring

Lessons live in `src/content/lessons/<course>/<n-chapter>/<n-page>.mdx`. The frontmatter is checked against the schema in `src/content.config.ts`:

```yaml
title: "Code review for N+1 queries"
course: performance-testing
chapter: static          # a chapter id from src/content/courses.yaml
kind: lesson             # opening | lesson | summary
order: 2                 # position within the chapter
slug: n-plus-one         # URL segment; empty for openings
minutes: 25
description: "One sentence, shown under the title and in maps."
outcomes: [...]          # "You'll be able to…"
concepts:                # listed in the lesson plan
  - title: "The N+1 query pattern"
    scene: n-plus-one    # optional: a scene from src/scenes
keyPoints: [...]         # shown at the end, and collected by the chapter summary
exercises:
  - id: fix-n-plus-one
    title: "Find and remove the N+1 in /api/books"
    minutes: 20
    goal: "…"
    agent: { steps: [...], done: [...], report: [...] }
check:                   # self-check questions, on summary pages
  - { q: "…", a: "…" }
```

Components are available in MDX without importing:

| Component | Use |
| --- | --- |
| `<Scene name="n-plus-one" />` | A concept animation from `src/scenes/` |
| `<Exercise id="fix-n-plus-one">…steps…</Exercise>` | A hands-on tray: goal, your steps, "done when", agent prompt, a done checkbox |
| `<Screenshot alt="…" caption="…" kind="terminal" title="…" />` | A screenshot. With no `src`, it draws a labelled placeholder that shows `alt`. |
| `<Callout type="tip">…</Callout>` | Note, tip or warning |
| `<Outcomes />`, `<ChapterMap />`, `<CourseArc />` | For opening pages |
| `<ChapterRecap />`, `<ChapterRecap scope="course" />`, `<SelfCheck />` | For summary pages |

**Replacing a placeholder screenshot:** put the image in `public/screenshots/` and add `src="/screenshots/name.png"`. Keep `alt`, because agents read it.

**Writing a scene:** add a `SceneDef` in `src/scenes/` and register it in `src/scenes/index.ts`. A scene is a list of captioned steps plus `build(svg)`, which returns `draw(p)`. `p` is the playhead in steps (2.5 means halfway through step 3), and `draw` must set everything from `p` alone. Scenes autoplay once when scrolled into view and pause when they leave it. Before the first play they show their finished picture. With reduced motion they never autoplay, and the play button steps through finished states.

**Progress** is kept in `localStorage` (visited pages, completed pages, finished exercises). Markup opts in with `data-progress-*` attributes; see `src/scripts/progress.ts`.

## The practice app

[`practice/larkspur`](practice/larkspur) is the system under test: a Node.js 22 bookshop with no dependencies. Its README lists the tools it ships with: asset budget, query linter, query-plan check, migration runner, a small load generator, k6 scripts, and a reference CI workflow. Every number quoted in the course comes from real runs against it.
