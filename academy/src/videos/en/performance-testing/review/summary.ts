import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Course summary",
  scenes: [
    {
      label: "Recap",
      cues: ["You started with a slow bookshop and a vague complaint. Here's what you can do now."],
      panes: [{ type: "title", kicker: "Course summary", heading: "Performance Testing, in review" }],
    },
    {
      label: "Four chapters",
      cues: [
        "You can measure: latency as percentiles, throughput, and errors, and write a plan around concrete questions.",
        "You can read for performance: budgets, N+1 queries, query plans and asset weight, all in seconds and without a server.",
        "You can run and measure: Lighthouse, load, stress, spike and soak tests, and a profile that points at the slow code.",
        "And you can make it a routine: gates in CI, and a report that explains every change.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Measure", sub: "Percentiles, throughput, errors, a plan" },
          { at: 1, text: "Read", sub: "Budgets, N+1, query plans, asset weight" },
          { at: 2, text: "Run", sub: "Lighthouse, k6, profiles" },
          { at: 3, text: "Routine", sub: "CI gates and reports" },
        ],
      }],
    },
    {
      label: "Your next step",
      cues: [
        "Pick one application you work on. Write a one-page plan for it, like the one in lesson one point two.",
        "Then add one static gate and one dynamic test this week. Go find what's slow.",
      ],
      panes: [{ type: "title", kicker: "Your next step", heading: "Go find what's slow.", sub: "One plan · one gate · one test", subAt: 1 }],
    },
  ],
});
