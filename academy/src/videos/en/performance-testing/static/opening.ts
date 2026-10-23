import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Static testing",
  scenes: [
    {
      label: "Introduction",
      cues: ["Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code."],
      panes: [{ type: "title", kicker: "Chapter 2 · Opening", heading: "Static testing", sub: "Find problems before anything runs", subAt: 0.4 }],
    },
    {
      label: "What you'll get",
      cues: [
        "By the end of this chapter, you'll turn budgets into a check that fails the build,",
        "spot the N+1 query pattern, with a linter and by eye,",
        "read a query plan, and fix a full table scan with an index,",
        "and find what makes a page heavy, then cut it below budget.",
      ],
      panes: [{
        type: "bullets", lead: "What you'll get",
        items: [
          { at: 0, text: "Budgets that pass or fail the build" },
          { at: 1, text: "N+1 queries, found and removed" },
          { at: 2, text: "Query plans, read and fixed" },
          { at: 3, text: "A page under its weight budget" },
        ],
      }],
    },
    {
      label: "Your tools",
      cues: [
        "You'll use three tools that ship with the practice app. None of them needs a server.",
        "The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.",
      ],
      panes: [{
        type: "table", cols: ["Tool", "Reads", "Lesson"], widths: ["36%", "46%", "18%"],
        rows: [
          { at: 0.2, cells: ["npm run budget", "Asset sizes vs budget.json", "2.1, 2.4"] },
          { at: 0.4, cells: ["npm run lint:queries", "Loops that run queries", "2.2"] },
          { at: 0.6, cells: ["npm run explain", "SQLite's query plan", "2.3"] },
        ],
      }],
    },
  ],
});
