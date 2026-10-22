import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Finding the bottleneck",
  scenes: [
    {
      label: "Introduction",
      cues: ["The stress test showed that recommendations stall at about fifty-eight requests per second. Now let's find out why."],
      panes: [{ type: "title", kicker: "Lesson 3.4 · Dynamic testing", heading: "Finding the bottleneck", sub: "Profile under load", subAt: 0.4 }],
    },
    {
      label: "What ran out?",
      cues: [
        "First find which resource ran out. Under the stress test, the Node process sits at a hundred percent of one core.",
        "A pegged core means the code itself is the limit. Time for a CPU profile.",
      ],
      panes: [{
        type: "table", cols: ["Symptom under load", "Likely bottleneck"], widths: ["55%", "45%"],
        rows: [
          { at: 0.1, cells: [{ chip: "fail", text: "Process at 100% of a core" }, "CPU in your code"] },
          { at: 0.3, cells: ["Low CPU, high latency", "Waiting on something else"] },
          { at: 0.5, cells: ["Database CPU high", "Queries"] },
          { at: 0.7, cells: ["Errors before latency", "Limits: connections, memory"] },
        ],
        focus: [{ at: 1, until: 2, row: 0 }],
      }],
    },
    {
      label: "Reading the flame graph",
      cues: [
        "A CPU profiler samples the call stack about a thousand times a second while the app is under load.",
        "A flame graph merges those samples. Width is the share of time. Each layer up is a function called by the one below.",
        "recommend takes two thirds of the samples. Inside it, similarity and normalise re-parse every book's tags on every single request.",
        "Parse the tags once and keep them, and the hot frames shrink.",
      ],
      panes: [{ type: "concept", scene: "flamegraph" }],
    },
    {
      label: "Do it once",
      cues: [
        "The fix: load the catalogue once, normalise each book's tags once into a set, and normalise the target's tags once per request.",
        "Same test, same machine: fifty-seven requests per second became six hundred and ninety-nine. Responses are identical.",
      ],
      panes: [{
        type: "code", file: "src/routes/recommendations.mjs", lang: "js", typeTo: 0.9,
        code: `let cached;
function catalogue() {
  return (cached ??= query("SELECT id, title, tags FROM books").all()
    .map((b) => ({ ...b, tagSet: new Set(normalise(b.tags)) })));
}

const mine = normalise(target.tags); // once per request
const scored = catalogue()
  .map((b) => ({ id: b.id, score: similarity(mine, b.tagSet) }));`,
        highlights: [{ at: 1, until: 2.2, lines: [1, 2, 3, 4, 7], note: "57 → 699 req/s", good: true }],
      }],
    },
  ],
});
