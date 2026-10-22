# demo

## Testbench: Performance Testing

[`academy/`](academy/) is an Astro + MDX tutorial site built for people and for agents. Its first course, **Performance Testing**, has four chapters that run overall → specific → overall: Overview, Static testing, Dynamic testing, Summary. Each chapter opens with what you'll get and closes with a summary. Lessons pair animated concept scenes with hands-on exercises, and each exercise has a copyable agent prompt. The course has two views generated from the same source: the **Classroom** and the **Lesson plan**. Every page also has a Markdown twin, indexed in `/llms.txt`.

```bash
cd academy && npm install && npm run dev
```

The exercises run against [`academy/practice/larkspur`](academy/practice/larkspur), a dependency-free Node.js bookshop that is slow on purpose. See [`academy/README.md`](academy/README.md) for the authoring guide.

## Casebook

[`casebook/`](casebook/) is a video-first course on test cases: six narrated lessons across three modules, from writing your first test case to an automated, organized suite. Open `casebook/index.html` in a browser; there is nothing to install or build.

```bash
cd casebook && python3 -m http.server 8811   # or just open index.html
```

| Module | Lessons |
| --- | --- |
| Foundations | 1. What is a test case? · 2. Good test cases, weak test cases |
| Designing test cases | 3. Partitions and boundaries · 4. Beyond the happy path |
| Automating and scaling | 5. From test case to automated test · 6. Organizing a test suite |

**The videos are web-native, not MP4s.** Each lesson's video is a script in [`js/course.js`](casebook/js/course.js): scenes with narration cues and panes (title cards, test case cards, a browser mock, typed code, a terminal, tables, a number line, the test pyramid). The player derives every duration from the narration, and pane timings are written in cue units (`at: 2.5` means halfway through cue 2), so the picture stays in step with the voice. Because each frame is a pure function of the playhead, seeking, chapters, speed changes and poster thumbnails all use the same renderer.

- **Narration** uses the browser's speech synthesis when a voice is available. If a voice runs long, the clock waits at the end of the cue instead of cutting it off. Without a voice, the video plays on its own clock with captions.
- **Player:** chapter-segmented scrubber with hover previews, captions, 0.75–2× speed, full screen, resume from where you left off, and keys (<kbd>Space</kbd>, <kbd>←</kbd>/<kbd>→</kbd>, <kbd>J</kbd>/<kbd>L</kbd>, <kbd>C</kbd>, <kbd>N</kbd>, <kbd>F</kbd>, <kbd>0</kbd>–<kbd>9</kbd>).
- **Supporting material** sits under each video: notes with templates and exercises, a clickable transcript that follows playback, and a three-question quiz with explanations.
- **Progress** is tracked per lesson in `localStorage`: seconds actually watched (scrubbing to the end doesn't count), resume position, and quiz score. A lesson passes when 90% of the video is watched and the quiz is passed, or when you mark it yourself. The course page shows it as a test run: passed, in progress, not started.

To add a lesson, add an entry to `Casebook.course.lessons` and list its id in a module. Lesson ids double as URLs (`index.html#partitions`).

Files: `index.html` (shell), `css/casebook.css`, `js/course.js` (content), `js/stage.js` (timeline and scene panes), `js/player.js` (clock, narration, controls), `js/app.js` (routing, progress, pages). Plain CSS and vanilla JavaScript, no dependencies; fonts from Google Fonts with system fallbacks.

## Skeleton Lab

[`skeletons/index.html`](skeletons/index.html) is a single self-contained page with four loading-skeleton effects. Each one runs on a realistic mini webpage. Open the file in a browser; there is nothing to install or build.

```bash
cd skeletons && python3 -m http.server 8765   # or just open index.html
```

| Effect | Page | What happens | Reveal |
| --- | --- | --- | --- |
| **Pulse and cross-blur** | Birding feed | Bones pulse between full and half opacity (1000 ms, ease-in-out). | Skeleton and content cross-fade with a shared 2 px blur over 400 ms. Both layers share one grid cell, so the swap causes no layout shift. |
| **Synced shimmer sweep** | News article | One 105° highlight band crosses the whole page. Every bone paints the same page-sized gradient, offset by its own position, so the band stays continuous across gaps. | Blocks rise 12 px and unblur from 3 px in reading order, 60 ms apart, on `cubic-bezier(0.22, 1, 0.36, 1)`. |
| **Ripple wave** | Ceramics shop grid | Each bone flashes on a delay of 1.1 ms per pixel of distance from the top-left corner, so a crest rolls diagonally through the grid. | Cards pop in (scale 0.97 → 1, slight overshoot) in the same order the wave travels. |
| **Dot wireframe build** | Generated sales dashboard | A dot field ripples out from the centre. The real DOM is measured and traced in dots: boxes, text lines, table rules and the chart's SVG path. | A scan line moves down and reveals the real UI, fading and sharpening as it passes. |

The toolbar replays all effects. It also has slow motion (½×, ¼×), a **Hold skeleton** switch that keeps every skeleton in its loading state until you turn it off, and a theme toggle. Each effect has a live timeline showing its phases and durations.

All of it is plain CSS and vanilla JavaScript with no dependencies. Fonts come from Google Fonts and fall back to system fonts. With `prefers-reduced-motion: reduce`, skeletons hold still and every swap becomes a 200 ms fade.

### Credits

The patterns and timings are adapted from [transitions.dev](https://github.com/Jakubantalik/transitions.dev) by Jakub Antalik: *Skeleton loader and reveal*, *Texts reveal*, *Shimmer text* and the *UI generation* skill. Durations, distances, blurs and easings follow its motion tokens. The code in this repository is a new implementation, not a copy of that library.
