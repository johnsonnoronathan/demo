import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Overview: summary",
  scenes: [
    {
      label: "Recap",
      cues: ["Here's what chapter one covered, in four points."],
      panes: [{ type: "title", kicker: "Chapter 1 · Summary", heading: "Overview, in four points" }],
    },
    {
      label: "Key points",
      cues: [
        "Every performance test reports latency, throughput and an error rate.",
        "Latency is a distribution, so we report percentiles, never the average.",
        "Static testing reads what you built. Dynamic testing runs it and measures.",
        "And a good plan starts with concrete questions, each with a number to hit.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Latency, throughput, error rate" },
          { at: 1, text: "Percentiles, not averages" },
          { at: 2, text: "Static reads, dynamic runs" },
          { at: 3, text: "Questions first, then tools" },
        ],
      }],
    },
    {
      label: "Next",
      cues: [
        "Next comes static testing: the cheapest tests there are.",
        "You'll find three of Larkspur's problems without starting the app at all.",
      ],
      panes: [{
        type: "bullets", lead: "Next · Chapter 2",
        items: [
          { at: 0.2, text: "Budgets that fail the build" },
          { at: 0.4, text: "N+1 queries" },
          { at: 0.6, text: "Query plans" },
          { at: 0.8, text: "Asset weight" },
        ],
      }],
    },
  ],
});
