import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Lab measurement with Lighthouse",
  scenes: [
    {
      label: "Introduction",
      cues: ["The budget check predicted a much lighter page. Lighthouse measures what that means for someone on a phone."],
      panes: [{ type: "title", kicker: "Lesson 3.1 · Dynamic testing", heading: "Lab measurement with Lighthouse", sub: "What a phone sees", subAt: 0.4 }],
    },
    {
      label: "Watching a page load",
      cues: [
        "Lighthouse loads the page on a simulated mid-range phone with a slow connection, and films it.",
        "First Contentful Paint at four point three seconds: until then, the screen is blank, because a six-hundred-kilobyte script blocks rendering.",
        "Largest Contentful Paint at nine point eight seconds, when the one-megabyte photo finally shows. The score is sixty-four.",
        "After the asset fixes from chapter two: first paint at zero point eight seconds, the main image at one point five. The score is a hundred.",
      ],
      panes: [{ type: "concept", scene: "filmstrip" }],
    },
    {
      label: "Four metrics",
      cues: [
        "Four metrics matter most. First Contentful Paint, when anything appears. Largest Contentful Paint, when the main content appears.",
        "Total Blocking Time, how long scripts keep the page from responding. And Cumulative Layout Shift, how much the page jumps while it loads.",
      ],
      panes: [{
        type: "table", cols: ["Metric", "The moment it marks", "Good"], widths: ["18%", "60%", "22%"],
        rows: [
          { at: 0.1, cells: ["FCP", "The first text or image appears", "≤ 1.8 s"] },
          { at: 0.5, cells: ["LCP", "The main image or heading appears", "≤ 2.5 s"] },
          { at: 1.1, cells: ["TBT", "Scripts block input", "≤ 200 ms"] },
          { at: 1.5, cells: ["CLS", "The layout jumps", "≤ 0.1"] },
        ],
      }],
    },
    {
      label: "Before and after",
      cues: [
        "In the exercise you'll measure a frozen copy of the original page, and then the fixed storefront.",
        "Remember that lab numbers are for comparing builds. What real users experience is field data, and it varies with every phone and network.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npx lighthouse@12 localhost:3000/before.html --only-categories=performance", kind: "cmd" },
          { at: 0.4, text: "Performance 64 · FCP 4.3 s · LCP 9.8 s · 1,645 KiB", kind: "fail" },
          { at: 0.6, text: "$ npx lighthouse@12 localhost:3000/ --only-categories=performance", kind: "cmd" },
          { at: 0.9, text: "Performance 100 · FCP 0.8 s · LCP 1.5 s · 68 KiB", kind: "pass" },
        ],
      }],
    },
  ],
});
