# demo

## Testbench

**Live site:** https://johnsonnoronathan.github.io/demo/

[`academy/`](academy/) is a tutorial website for software testing, built with Astro and MDX for people and for agents. Every page has a video, with the written lesson underneath as the supplement.

It has two courses:

- **Writing Test Cases**: 6 lessons for beginners, each ending with a quiz.
- **Performance Testing**: 22 pages in four chapters that run overall → specific → overall: Overview, Static testing, Dynamic testing, Summary. It takes you from the concepts to a formal acceptance test with a go/no-go decision. You then apply the static checks to your own project: you run the checks and verify, and a coding agent implements the fixes.

The site's other pages:

- a catalog of the courses
- a **My learning** page that tracks watched video time, completed pages and quiz scores
- a page for agents

The interface is available in seven languages: English, Chinese, Japanese, Korean, Spanish, French and German. The courses and their videos are fully translated in English and Simplified Chinese. The other five languages have translated titles and navigation, with the lesson text in English.

```bash
cd academy && npm install && npm run dev
```

Performance Testing's exercises run against [`academy/practice/larkspur`](academy/practice/larkspur), a dependency-free Node.js bookshop that is slow on purpose. Each exercise has a copyable agent prompt, and every page has a Markdown twin indexed in `/llms.txt`. See [`academy/README.md`](academy/README.md) for how the site works and how to author pages and videos.

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
