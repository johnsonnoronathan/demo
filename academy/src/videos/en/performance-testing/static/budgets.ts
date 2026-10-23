import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Performance budgets",
  scenes: [
    {
      label: "Introduction",
      cues: ["\"Make it fast\" isn't a requirement anyone can test. A performance budget is."],
      panes: [{ type: "title", kicker: "Lesson 2.1 · Static testing", heading: "Performance budgets", sub: "Agree on limits before you measure", subAt: 0.4 }],
    },
    {
      label: "How a budget works",
      cues: [
        "A budget is a limit the team agrees on before measuring. For Larkspur: fifty kilobytes of script, two hundred and fifty of images, three hundred and fifty in total.",
        "Then you measure the current build against each limit.",
        "Anything over its line fails. Larkspur is over on scripts, on images, and in total.",
        "A failed budget is a clear signal. With an exit code of one, it can block a pull request instead of starting a debate.",
      ],
      panes: [{ type: "concept", scene: "budgets" }],
    },
    {
      label: "Three kinds",
      cues: [
        "Budgets come in three kinds. Quantity budgets, like kilobytes or queries per request, can be checked statically, on every change.",
        "Timing budgets, like p95 or Largest Contentful Paint, need a dynamic test.",
        "Start from what users need, then from where you are today, and tighten the budget as you improve.",
      ],
      panes: [{
        type: "table", cols: ["Kind", "Example", "Checked"], widths: ["22%", "50%", "28%"],
        rows: [
          { at: 0.1, cells: ["Quantity", "JS ≤ 50 KB · ≤ 5 queries/request", { chip: "yes", text: "Static" }] },
          { at: 1, cells: ["Timing", "p95 ≤ 300 ms · LCP ≤ 2.5 s", { chip: "warn", text: "Dynamic" }] },
          { at: 1.4, cells: ["Rule-based", "Lighthouse score ≥ 90", { chip: "warn", text: "Dynamic" }] },
        ],
      }],
    },
    {
      label: "Run the check",
      cues: [
        "In the exercise you'll run the budget check and see exactly which files push the page over.",
        "Two files account for almost all of it. Lesson 2.4 fixes them.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run budget", kind: "cmd" },
          { at: 0.3, text: "budget      actual   limit   result", kind: "dim" },
          { at: 0.4, text: "script        96.2      50   FAIL  (+46.2 KB)", kind: "fail" },
          { at: 0.5, text: "stylesheet     0.5      20   pass", kind: "pass" },
          { at: 0.6, text: "image       1043.1     250   FAIL  (+793.1 KB)", kind: "fail" },
          { at: 0.7, text: "total       1139.8     350   FAIL  (+789.8 KB)", kind: "fail" },
          { at: 0.9, text: "3 budget(s) exceeded.", kind: "sum-fail" },
        ],
      }],
    },
  ],
});
