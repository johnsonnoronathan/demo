import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "A performance testing workflow",
  scenes: [
    {
      label: "Introduction",
      cues: ["Everything so far was done by hand, once. A real codebase changes every day. So where should each check run?"],
      panes: [{ type: "title", kicker: "Lesson 4.1 · Summary", heading: "A performance testing workflow", sub: "Fast feedback first", subAt: 0.4 }],
    },
    {
      label: "The pipeline",
      cues: [
        "Every pull request runs the static checks first: the asset budget, the query linter and the query plans. They take seconds.",
        "Then the change is built and deployed to staging, where Lighthouse and a short k6 load test run.",
        "A failed threshold stops the release, and the failure message carries the numbers that explain why.",
        "Once it's fixed, the change ships. Production monitoring watches the same metrics, and informs the next budgets.",
      ],
      panes: [{ type: "concept", scene: "pipeline" }],
    },
    {
      label: "What runs where",
      cues: [
        "The rule is fast feedback first. A gate that fails in four seconds on a pull request costs the author nothing to fix.",
        "Long stress and soak tests belong on a schedule, against a stable environment, not on every change.",
      ],
      panes: [{
        type: "table", cols: ["Stage", "Runs", "Takes"], widths: ["30%", "48%", "22%"],
        rows: [
          { at: 0.1, cells: ["Every pull request", "Budget · query lint · plans", "seconds"] },
          { at: 0.4, cells: ["Before release", "Lighthouse · short k6 test", "minutes"] },
          { at: 1, cells: ["On a schedule", "Stress · spike · soak", "hours"] },
          { at: 1.4, cells: ["Production", "Real-user monitoring", "always"] },
        ],
      }],
    },
    {
      label: "A gate in action",
      cues: [
        "In the exercise you'll undo one of your fixes on purpose.",
        "The static gates catch it in seconds, and name the file and the size that caused it.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run check:static", kind: "cmd" },
          { at: 1, text: "script        96.2      50   FAIL  (+46.2 KB)", kind: "fail" },
          { at: 1.2, text: "image         57.6     250   pass", kind: "pass" },
          { at: 1.4, text: "1 budget(s) exceeded.", kind: "sum-fail" },
          { at: 1.6, text: "exit code 1 · pull request blocked", kind: "fail-dim" },
        ],
      }],
    },
  ],
});
