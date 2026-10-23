import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Asset weight",
  scenes: [
    {
      label: "Introduction",
      cues: ["The budget check said the storefront is over. Now let's find out exactly what makes it heavy."],
      panes: [{ type: "title", kicker: "Lesson 2.4 · Static testing", heading: "Asset weight", sub: "Weigh what the page loads", subAt: 0.4 }],
    },
    {
      label: "Where the weight goes",
      cues: [
        "Here's every file the storefront loads, drawn to scale. One thousand one hundred and forty kilobytes, against a budget of three hundred and fifty.",
        "Two files are nearly all of it: a hero photo saved at camera size, and a date library that bundles four hundred and twenty locales, when the shop uses one.",
        "Swap in the twelve-hundred-pixel export of the photo, and the English-only build of the library.",
        "From one thousand one hundred and forty kilobytes to fifty-nine. The customer sees the same page.",
      ],
      panes: [{ type: "concept", scene: "asset-treemap" }],
    },
    {
      label: "Render-blocking scripts",
      cues: [
        "There's a second problem in the HTML. A plain script tag in the head stops the page from rendering until the script has downloaded and run.",
        "Add defer, and use the English-only file. The browser renders first, and runs the scripts afterwards, in order.",
        "Then point the image at the smaller export, with its width and height.",
      ],
      panes: [{
        type: "code", file: "public/index.html", lang: "text", typeTo: -1,
        code: `<head>
  <link rel="stylesheet" href="/styles.css">
  <script src="/vendor/datefmt-all-locales.js"></script>
  <script src="/app.js"></script>
</head>
<body>
  <img src="/hero.jpg" alt="Shelves of books">`,
        highlights: [
          { at: 0.2, until: 1, lines: [3, 4], note: "blocks rendering", bad: true },
          { at: 1, until: 2, lines: [3, 4], good: true },
          { at: 2, until: 3, lines: [7], good: true },
        ],
        swaps: [
          { at: 1.1, line: 3, text: `  <script src="/vendor/datefmt-en.js" defer></script>` },
          { at: 1.3, line: 4, text: `  <script src="/app.js" defer></script>` },
          { at: 2.1, line: 7, text: `  <img src="/hero-1200.jpg" width="1200" height="600" alt="…">` },
        ],
      }],
    },
    {
      label: "Check again",
      cues: ["Run the budget again. Fifty-nine kilobytes, every budget met, and nothing changed for the customer."],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.05, text: "$ npm run budget", kind: "cmd" },
          { at: 0.2, text: "script         0.9      50   pass", kind: "pass" },
          { at: 0.3, text: "stylesheet     0.5      20   pass", kind: "pass" },
          { at: 0.4, text: "image         57.6     250   pass", kind: "pass" },
          { at: 0.5, text: "total         59.0     350   pass", kind: "pass" },
          { at: 0.7, text: "All budgets met.", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
