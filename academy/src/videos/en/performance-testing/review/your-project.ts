import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Static testing on your own project",
  scenes: [
    {
      label: "Introduction",
      cues: ["Larkspur was slow in instructive ways. Your own project is slow in its own ways, and the only way to find out how is to run the checks on it."],
      panes: [{ type: "title", kicker: "Lesson 4.4 · Summary", heading: "Static testing on your own project", sub: "You measure, the agent fixes", subAt: 0.4 }],
    },
    {
      label: "Why you run them",
      cues: [
        "An agent could run every command in this lesson. So why run them yourself?",
        "Because reading real output is the skill. You learn what's normal for your code by seeing its numbers.",
        "Because whether a number is acceptable depends on your users, and that's your call.",
        "And because your run is the evidence, when an agent later says it's fixed.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 1, text: "Reading real output is the skill" },
          { at: 2, text: "You own the decision" },
          { at: 3, text: "Your run is the evidence" },
        ],
      }],
    },
    {
      label: "Four questions",
      cues: [
        "The four static questions from chapter two work on almost any stack. How heavy is what we ship?",
        "How many queries does one request run, and does that number grow with the page size?",
        "Does each hot query use an index, or scan a large table?",
        "And what blocks the first render?",
      ],
      panes: [{
        type: "table", cols: ["Question", "On your stack"], widths: ["40%", "60%"],
        rows: [
          { at: 0.3, cells: ["Weight shipped", "Production build, gzipped · size-limit"] },
          { at: 1.2, cells: ["Queries per request", "Query log · assertNumQueries · bullet"] },
          { at: 2.2, cells: ["Index or scan", "EXPLAIN: Seq Scan · Table scan · SCAN"] },
          { at: 3.2, cells: ["Render-blocking", "<script> in <head> without defer"] },
        ],
      }],
    },
    {
      label: "Baseline",
      cues: [
        "Pick one user journey: the page most users land on, and the calls it makes.",
        "Weigh the production build, not the development one. Count the queries for one request, then for a page twice as long.",
        "Explain the top queries, and write it all down in the same table every time. That's your baseline.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run build", kind: "cmd" },
          { at: 1, text: "$ find dist -name '*.js' … | gzip -c | wc -c", kind: "cmd" },
          { at: 1.3, text: "   412.0 KB  dist/assets/index-8f2c.js", kind: "fail-dim" },
          { at: 1.5, text: "    18.4 KB  dist/assets/index-1b9e.css", kind: "dim" },
          { at: 2, text: "# write it down: perf/baseline.md", kind: "out" },
        ],
      }],
    },
    {
      label: "Reading the numbers",
      cues: [
        "Real output is noisier than Larkspur's. Growth matters more than size: queries that double when the page doubles are an N+1.",
        "Scans only matter on large tables. A scan of a forty-row lookup table is normal.",
        "And set first budgets just above today's numbers, so the gate passes now and catches the next regression.",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "Growth beats size", sub: "Queries that grow with the page are an N+1" },
          { at: 1, text: "Scans matter on large tables", sub: "Not on a 40-row lookup table" },
          { at: 2, text: "First budgets: just above today", sub: "Then tighten as fixes land" },
        ],
      }],
    },
    {
      label: "Hand it over",
      cues: [
        "Two agent prompts finish the job. The first maps the four checks onto your stack, as commands you run yourself.",
        "The second fixes one finding on a new branch, and adds a gate that fails if it comes back.",
        "Then you rerun the check yourself, break the fix on purpose to see the gate fail, and review the branch like any other change.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Agent: write perf/STATIC-CHECKS.md", sub: "Commands for your stack · no code changes" },
          { at: 0.6, text: "You: run them, fill perf/baseline.md", sub: "Set budgets, rank findings" },
          { at: 1, text: "Agent: fix one finding, add a gate", sub: "New branch · budgets untouched" },
          { at: 2, text: "You: rerun, break it, review", sub: "Your number is the one that counts" },
        ],
      }],
    },
  ],
});
