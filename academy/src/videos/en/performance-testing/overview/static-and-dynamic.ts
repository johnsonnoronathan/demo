import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Static and dynamic testing",
  scenes: [
    {
      label: "Introduction",
      cues: ["There are two ways to look for performance problems. You can read what you built, or you can run it and measure."],
      panes: [{ type: "title", kicker: "Lesson 1.2 · Overview", heading: "Static and dynamic testing", sub: "Read it, or run it", subAt: 0.4 }],
    },
    {
      label: "Two families",
      cues: [
        "Static testing reads artifacts: code, query plans, build output and budgets.",
        "Nothing runs, so a static check takes seconds and can gate every pull request. It finds patterns that are known to be slow.",
        "Dynamic testing runs the system, and sends it traffic.",
        "It measures what users actually feel, finds problems nobody predicted, and proves that a fix worked.",
      ],
      panes: [{ type: "concept", scene: "static-vs-dynamic" }],
    },
    {
      label: "Side by side",
      cues: [
        "Side by side: static testing is cheap and early. Dynamic testing is slower, but it's the only way to see real impact.",
        "They work best together. Static checks catch common mistakes cheaply. Dynamic tests confirm the important ones, and find the rest.",
      ],
      panes: [{
        type: "table", cols: ["", "Static", "Dynamic"], widths: ["22%", "39%", "39%"],
        rows: [
          { at: 0.1, cells: ["Looks at", "Code, queries, assets", "The running system"] },
          { at: 0.3, cells: ["Speed", "Seconds", "Minutes to hours"] },
          { at: 0.5, cells: ["Runs on", "Every pull request", "Staging, schedules"] },
          { at: 0.7, cells: ["Finds", "Known slow patterns", "Real impact, capacity"] },
        ],
      }],
    },
    {
      label: "Start with questions",
      cues: [
        "Before you pick a tool, write down what you need to know.",
        "Good questions name a page or an endpoint, a load, and a number.",
        "Then pick the cheapest test that can answer each one. In the exercise, you'll write that plan for Larkspur.",
      ],
      panes: [{
        type: "bullets", lead: "A plan starts with questions",
        items: [
          { at: 1, text: "Main image within 2.5 s on a phone?" },
          { at: 1.3, text: "/api/books p95 under 300 ms at 50 users?" },
          { at: 1.6, text: "How many users before p95 passes budget?" },
          { at: 1.9, text: "Stable for an hour of ordinary traffic?" },
        ],
      }],
    },
  ],
});
