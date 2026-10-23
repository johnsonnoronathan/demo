import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Performance acceptance",
  scenes: [
    {
      label: "Introduction",
      cues: ["Finding and fixing problems isn't the end. A release needs a decision: go, or no-go. That's acceptance."],
      panes: [{ type: "title", kicker: "Lesson 4.3 · Summary", heading: "Performance acceptance", sub: "From measurements to a decision", subAt: 0.4 }],
    },
    {
      label: "The method",
      cues: [
        "Every lesson in this course is one step of the same method. First, ask the questions the tests must answer.",
        "Set budgets before you measure. They become the acceptance criteria.",
        "Take a baseline, then test: static checks first, then lab and load tests.",
        "Fix one cause at a time. That's the step to hand to an agent.",
        "Verify by rerunning the same test yourself. Then accept, report, and guard it with gates.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Ask", sub: "Questions and user journeys · you" },
          { at: 1, text: "Set budgets", sub: "Agreed before measuring · you and the team" },
          { at: 2, text: "Baseline, then test", sub: "Static first, then dynamic · you" },
          { at: 3, text: "Fix", sub: "One cause at a time · agent" },
          { at: 4, text: "Verify, accept, guard", sub: "Same test, your run, your decision" },
        ],
      }],
    },
    {
      label: "Acceptance criteria",
      cues: [
        "An acceptance criterion is a budget with its conditions. Not, the API should be fast.",
        "But: the books endpoint's p95 is at most 300 milliseconds, with 50 users, under one percent errors, measured with npm run accept.",
        "It's measurable, it states its conditions, it's agreed before the test, and it traces back to a budget.",
      ],
      panes: [{
        type: "table", cols: ["ID", "Criterion", "Limit"], widths: ["12%", "60%", "28%"],
        rows: [
          { at: 1, cells: ["S1–S3", "Static gates: budget, query lint, plans", "exit 0"] },
          { at: 1.3, cells: ["D1", "/api/books p95 at 50 users", "≤ 300 ms"] },
          { at: 1.5, cells: ["D2", "/api/orders p95 at 50 users", "≤ 200 ms"] },
          { at: 1.7, cells: ["D3", "/api/recommendations p95", "≤ 400 ms"] },
          { at: 1.9, cells: ["D4", "Error rate, all requests", "< 1 %"] },
          { at: 2.2, cells: ["M1, M2", "LCP and score, Lighthouse", "≤ 2.5 s · ≥ 90"] },
        ],
      }],
    },
    {
      label: "Entry and exit",
      cues: [
        "Entry criteria decide whether a run counts at all: the right build, seeded data, a quiet machine. Miss one, and the run is invalid, not failed.",
        "Exit criteria decide when you're done: every criterion passes or has a signed waiver, and the record is saved.",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "Entry: does the run count?", sub: "Right commit · seeded data · app warmed up · quiet machine" },
          { at: 1, text: "Exit: are we done?", sub: "All pass, or waived in writing · record saved" },
        ],
      }],
    },
    {
      label: "Before",
      cues: [
        "Here's the acceptance test on Larkspur as it was before the course.",
        "All three static gates fail. The books endpoint's p95 is over thirteen seconds at 50 users.",
        "Six of seven automated criteria fail. Verdict: reject, with exit code one.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run accept", kind: "cmd" },
          { at: 1, text: "S1   FAIL   exit 1   asset budget", kind: "fail" },
          { at: 1.1, text: "S2   FAIL   exit 1   no queries inside loops", kind: "fail" },
          { at: 1.2, text: "S3   FAIL   exit 1   no full scans", kind: "fail" },
          { at: 1.4, text: "D1   FAIL   13246 ms   ≤ 300 ms   /api/books", kind: "fail" },
          { at: 1.6, text: "D2   FAIL     797 ms   ≤ 200 ms   /api/orders", kind: "fail" },
          { at: 1.8, text: "D3   FAIL    1109 ms   ≤ 400 ms   /api/recommendations", kind: "fail" },
          { at: 1.9, text: "D4   PASS    0.00 %    < 1 %      error rate", kind: "pass" },
          { at: 2.2, text: "REJECT: 6 of 7 automated criteria failed.", kind: "sum-fail" },
        ],
      }],
    },
    {
      label: "After",
      cues: [
        "After the four fixes from chapters two and three: same command, same machine.",
        "Every gate passes. Books is down to 64 milliseconds, orders 17, recommendations 125.",
        "Recommendations passes, but it's the closest to its limit. That goes in the report, even though it passed.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run accept", kind: "cmd" },
          { at: 1, text: "S1–S3  PASS   exit 0   static gates", kind: "pass" },
          { at: 1.3, text: "D1   PASS     64 ms   ≤ 300 ms   /api/books", kind: "pass" },
          { at: 1.5, text: "D2   PASS     17 ms   ≤ 200 ms   /api/orders", kind: "pass" },
          { at: 1.7, text: "D3   PASS    125 ms   ≤ 400 ms   /api/recommendations", kind: "pass" },
          { at: 1.8, text: "D4   PASS   0.00 %    < 1 %      error rate", kind: "pass" },
          { at: 2, text: "ACCEPT: all 7 automated criteria passed.", kind: "sum-pass" },
        ],
      }],
    },
    {
      label: "Go or no-go",
      cues: [
        "If every criterion passes, it's a go. Sign the record.",
        "If any fails, it's no-go. Fix it, and rerun the whole test.",
        "If the release can't wait, a named person can sign a waiver, with an expiry date and a follow-up.",
        "And never loosen a limit to make a run pass. Changing a criterion is a separate decision, for the next run.",
      ],
      panes: [{
        type: "table", cols: ["Result", "Decision"], widths: ["45%", "55%"],
        rows: [
          { at: 0.1, cells: ["Every criterion passes", { chip: "pass", text: "Go" }] },
          { at: 1, cells: ["A criterion fails", { chip: "fail", text: "No-go" }] },
          { at: 2, cells: ["Fails, release can't wait", { chip: "warn", text: "Waiver" }] },
          { at: 3, cells: ["Loosen the limit to pass", { chip: "no", text: "Never" }] },
        ],
      }],
    },
    {
      label: "Your turn",
      cues: [
        "In the exercise, you run the acceptance test yourself. If anything fails, an agent fixes it, without touching the limits.",
        "Then you rerun it, record Lighthouse, and make the call. Go, or no-go.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "You run npm run accept", sub: "and read every row" },
          { at: 0.5, text: "The agent fixes what fails", sub: "limits untouched" },
          { at: 1, text: "You rerun, record M1 and M2, and sign", sub: "notes/acceptance.md" },
        ],
      }],
    },
  ],
});
