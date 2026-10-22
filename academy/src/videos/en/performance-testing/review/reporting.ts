import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Reporting results",
  scenes: [
    {
      label: "Introduction",
      cues: ["A performance test is finished when someone can act on it. That takes a report: short, in a predictable shape, with every number backed by a test anyone can rerun."],
      panes: [{ type: "title", kicker: "Lesson 4.2 · Summary", heading: "Reporting results", sub: "Numbers people can trust", subAt: 0.4 }],
    },
    {
      label: "What the course changed",
      cues: [
        "Here are Larkspur's first measurements, each from a run you can repeat.",
        "After the static fixes: one query instead of a hundred and one, two indexes, and lighter assets.",
        "After the dynamic fix: book tags parsed once, instead of on every request.",
        "Every result names the test that produced it. That's what makes a report credible.",
      ],
      panes: [{ type: "concept", scene: "before-after" }],
    },
    {
      label: "The shape of a report",
      cues: [
        "Start with a summary that answers the question the tests were for.",
        "Then the setup, so anyone can repeat it, and the results: before and after, same test, same machine.",
        "Then one finding per problem, the limits of what you tested, and the next steps.",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "Summary", sub: "The answer, in two sentences" },
          { at: 1, text: "Test setup", sub: "Machine, tools, commands" },
          { at: 1.4, text: "Results", sub: "Before and after, percentiles and errors" },
          { at: 2, text: "Findings", sub: "Cause, impact, fix, evidence" },
          { at: 2.3, text: "Limits and next steps" },
        ],
      }],
    },
    {
      label: "A good finding",
      cues: [
        "A finding is a small argument: the cause, and exactly where it is,",
        "what users feel, with a measured number,",
        "the fix, and the evidence someone else can check.",
      ],
      panes: [{
        type: "card", focus: true, id: "FINDING 1", title: "N+1 queries in /api/books", titleAt: 0,
        fields: [
          { at: 0.3, label: "Cause", value: "listBooks runs 2 queries per book, 101 per page (books.mjs:11, :13)" },
          { at: 1, label: "Impact", value: "p95 1.17 s at 50 users against a 300 ms budget; slowed every endpoint" },
          { at: 2, label: "Fix", value: "One joined query, plus an index on reviews.book_id" },
          { at: 2.4, label: "Evidence", value: "p95 10 ms in the same k6 test · notes/load-test.md" },
        ],
      }],
    },
  ],
});
