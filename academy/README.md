# Testbench

A tutorial website for software testing, written for people and for agents. Built with Astro and MDX.

Every page has a video, and the written page sits under it as the supplement. The site has two courses:

| Course | Level | Chapters | Pages |
| --- | --- | --- | --- |
| **Writing Test Cases** | Beginner | Foundations · Designing test cases · Automating and scaling | 6 |
| **Performance Testing** | Intermediate | Overview · Static testing · Dynamic testing · Summary | 20 |

```bash
cd academy
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
```

## The site

| Page | URL | What it is |
| --- | --- | --- |
| Home | `/` | What the site is, a sample video, the courses and a suggested learning path |
| Catalog | `/courses/` | Every course with its level, length and video time |
| My learning | `/learning/` | Progress across courses: continue where you left off, completed pages, videos watched, quiz scores |
| For agents | `/agents/` | How agents use the site: prompts, Markdown twins, `llms.txt` |
| Course home | `/<course>/` | Introduction video, course arc, chapters with their videos, outcomes, setup |
| Lesson plan | `/<course>/plan/` | The whole course on one page: goals, schedule, videos, exercises, key points |
| Lesson | `/<course>/<chapter>/<page>/` | Video, transcript, the written lesson, quiz, key points |

The course menu shows a flat marker on every page that has a video: a play glyph and its length. The marker fills in as you watch.

## Languages

The interface is available in seven languages: English, 简体中文, 日本語, 한국어, Español, Français and Deutsch. English URLs have no prefix; the others start with their code (`/zh/`, `/ja/`, `/ko/`, `/es/`, `/fr/`, `/de/`). The language menu in the header keeps you on the same page.

| | Interface | Course and page titles | Lesson text | Videos |
| --- | --- | --- | --- | --- |
| English | ✓ | ✓ | ✓ | ✓ |
| 简体中文 | ✓ | ✓ | ✓ | ✓ |
| 日本語, 한국어, Español, Français, Deutsch | ✓ | ✓ | English, with a notice | English |

Where to find each part:

- **Interface strings:** `src/i18n/ui.ts`. One dictionary per language. A missing key falls back to English.
- **Course metadata, page titles and scene captions:** `src/i18n/content/<locale>.ts`. This file is how a language gets translated titles and navigation before its pages are translated.
- **Full page translations:** `src/content/lessons/<locale>/…`. Use the same file names and frontmatter ids as the English page.
- **Video translations:** `src/videos/<locale>/…`.

A page or video that has not been translated falls back to English.

Agent prompts are always built from the English page. Commands, file names and expected output then match the practice app, whatever language the reader uses.

## Videos

The videos are scripted web videos, not MP4 files. Each one is a TypeScript file in `src/videos/<locale>/<course>/<chapter>/<page>.ts`:

```ts
import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Performance budgets",
  scenes: [
    {
      label: "How a budget works",                // a chapter in the scrubber
      cues: ["A budget is a limit…", "Then you measure…"],  // narration, one caption each
      panes: [{ type: "concept", scene: "budgets" }],
    },
  ],
});
```

- **Timing.** Each cue's duration comes from its narration: words per second, or characters per second for Chinese, Japanese and Korean. Pane timings are written in cue units, so `at: 1.5` means halfway through the second cue. The picture therefore stays in step with the voice in every language.
- **Panes:**
  - `title`, `bullets`, `card`, `stats`
  - `code`, which types out, highlights and swaps lines
  - `terminal` and `table`
  - `browser`, a mock page
  - `numberline` and `pyramid`
  - `concept`, which plays one of the concept scenes from `src/scenes/` inside the video
- **Narration** uses the browser's speech synthesis in the page's language when a voice is available. The clock waits for a voice that runs long. Without a voice, the video plays on its own clock with captions.
- **Player features:**
  - chapters and captions
  - speed from 0.75× to 2×
  - full screen
  - resume where you left off
  - an end card that links to the next page
  - keyboard: <kbd>Space</kbd>, <kbd>←</kbd>/<kbd>→</kbd>, <kbd>J</kbd>/<kbd>L</kbd>, <kbd>C</kbd> (captions), <kbd>N</kbd> (narration), <kbd>F</kbd>, <kbd>0</kbd>–<kbd>9</kbd>
- **Progress.** The player records the seconds you actually watched, so scrubbing to the end doesn't count. The menu markers and My learning read that record.

## Course structure

Courses are defined in `src/content/courses.yaml`.

**Performance Testing** runs overall → specific → overall:

- Each chapter has an **opening** page ("what you'll get" and a map of the chapter), its **lessons**, and a **summary** page.
- The summary gathers every lesson's key points and adds self-check questions.
- Lessons mix concepts, shown as animated scenes, with hands-on exercises that have screenshots.

**Writing Test Cases** is six short lessons. Each one ends with a quiz.

## Built for agents

- **Agent prompts on exercises only.** Every hands-on exercise ends with a **Copy prompt** button. The prompt is built from the exercise's frontmatter in `src/lib/prompt.ts` and stands on its own. It includes:
  - the project path and setup
  - the steps
  - "done when" criteria
  - what to report
  - ground rules: quote real output, stop on errors

  Pages without exercises have no prompt.
- **A Markdown twin of every page.** Add `.md` to a page's URL to get the page as Markdown:
  - the video transcript
  - each scene's numbered steps
  - each screenshot's description
  - each exercise's full prompt
  - the quiz

  HTML pages link to their twin with `<link rel="alternate" type="text/markdown">`.
- **Indexes:**
  - `/llms.txt` indexes every course and page.
  - `/<course>/llms-full.txt` is a whole course in one file.
  - `/<course>/plan.md` is the lesson plan.

## Authoring

Lessons live in `src/content/lessons/<locale>/<course>/<n-chapter>/<n-page>.mdx`. The frontmatter is checked against the schema in `src/content.config.ts`:

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
quiz:                    # graded in the browser, saved with progress
  - { q: "…", options: ["…", "…"], answer: 1, why: "…" }
```

You can use these components in MDX without importing them:

| Component | Use |
| --- | --- |
| `<Scene name="n-plus-one" />` | A concept animation from `src/scenes/` |
| `<Exercise id="fix-n-plus-one">…steps…</Exercise>` | A hands-on tray: goal, your steps, "done when", agent prompt, a done checkbox |
| `<Screenshot alt="…" caption="…" kind="terminal" title="…" />` | A screenshot. With no `src`, it draws a labelled placeholder that shows `alt`. |
| `<Callout type="tip">…</Callout>` | Note, tip or warning |
| `<Outcomes />`, `<ChapterMap />`, `<CourseArc />` | For opening pages |
| `<ChapterRecap />`, `<ChapterRecap scope="course" />`, `<SelfCheck />` | For summary pages |

The quiz, video and transcript are added by the page layout, so you don't place them in MDX.

**Replacing a placeholder screenshot:** put the image in `public/screenshots/` and add `src="/screenshots/name.png"`. Keep `alt`, because agents read it.

**Writing a scene:**

1. Add a `SceneDef` in `src/scenes/` and register it in `src/scenes/index.ts`.
2. Give it a list of captioned steps and a `build(svg)` that returns `draw(p)`.
3. Make `draw` set everything from `p` alone. `p` is the playhead in steps, so 2.5 means halfway through step 3.

Because each frame depends only on `p`, the same scene can play on a lesson page or inside a video.

**Progress** is kept in `localStorage`: visited and completed pages, finished exercises, watched video seconds and quiz scores. See `src/scripts/store.ts`.

## The practice app

[`practice/larkspur`](practice/larkspur) is the system under test for Performance Testing. It is a Node.js 22 bookshop with no dependencies, and it ships with:

- an asset budget
- a query linter
- a query-plan check
- a migration runner
- a small load generator
- k6 scripts
- a reference CI workflow

Every number quoted in the course comes from real runs against it.
