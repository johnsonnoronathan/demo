import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Dynamic testing",
  scenes: [
    {
      label: "Introduction",
      cues: ["Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening."],
      panes: [{ type: "title", kicker: "Chapter 3 · Opening", heading: "Dynamic testing", sub: "Run it. Load it. Measure it.", subAt: 0.4 }],
    },
    {
      label: "What you'll get",
      cues: [
        "You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone.",
        "You'll write a load test with k6, and let thresholds decide whether the app meets its budgets.",
        "You'll push past the expected load to find the app's capacity, and check it survives a surge.",
        "And you'll profile the app under load, read a flame graph, and prove a fix with numbers.",
      ],
      panes: [{
        type: "bullets", lead: "What you'll get",
        items: [
          { at: 0, text: "Lab page loads with Lighthouse" },
          { at: 1, text: "Load tests with k6 and thresholds" },
          { at: 2, text: "Stress, spike and soak tests" },
          { at: 3, text: "Profiles and flame graphs" },
        ],
      }],
    },
    {
      label: "Before you start",
      cues: [
        "You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool.",
        "And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ brew install k6        # or winget install k6", kind: "cmd" },
          { at: 0.4, text: "$ k6 version", kind: "cmd" },
          { at: 0.6, text: "k6 v1.3.0", kind: "pass" },
          { at: 0.8, text: "$ npm run load -- --help   # the built-in fallback", kind: "dim" },
        ],
      }],
    },
  ],
});
