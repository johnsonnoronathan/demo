import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Dynamic testing: summary",
  scenes: [
    {
      label: "Recap",
      cues: ["Here's what running the app taught you that reading it couldn't."],
      panes: [{ type: "title", kicker: "Chapter 3 · Summary", heading: "What running found" }],
    },
    {
      label: "Results",
      cues: [
        "Lighthouse confirmed the asset fixes: the score went from sixty-four to a hundred, and the main image now appears in one and a half seconds instead of ten.",
        "The load test confirmed the query fixes: every threshold passes with fifty shoppers.",
        "And the stress test and profile found a problem no static rule describes. Its fix multiplied throughput by twelve.",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "64 → 100", label: "Lighthouse score", tone: "good" },
          { at: 0.4, value: "9.8 → 1.5 s", label: "Largest Contentful Paint", tone: "good" },
          { at: 1.1, value: "4 of 4", label: "thresholds pass at 50 users", tone: "good" },
          { at: 2.1, value: "57 → 699", label: "recommendations req/s", tone: "good" },
        ],
      }],
    },
    {
      label: "Together",
      cues: [
        "Static testing found three problems and predicted their cost.",
        "Dynamic testing confirmed those predictions, and found the one problem static testing couldn't see.",
        "Neither would have found everything alone. Chapter four turns that into a routine.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Static predicted", sub: "N+1, scans, heavy assets" },
          { at: 1, text: "Dynamic confirmed, and found more", sub: "The CPU hot path" },
          { at: 2, text: "Next: make it a routine", dim: true },
        ],
      }],
    },
  ],
});
