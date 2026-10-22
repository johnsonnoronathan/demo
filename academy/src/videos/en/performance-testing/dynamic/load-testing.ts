import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Load testing with k6",
  scenes: [
    {
      label: "Introduction",
      cues: ["Your plan says the books endpoint should answer within three hundred milliseconds at p95, with fifty shoppers. Only a load test can check that."],
      panes: [{ type: "title", kicker: "Lesson 3.2 · Dynamic testing", heading: "Load testing with k6", sub: "A busy evening, simulated", subAt: 0.4 }],
    },
    {
      label: "The script",
      cues: [
        "A k6 script is JavaScript. Stages say how many virtual users run, and for how long.",
        "Thresholds say what counts as passing: p95 under three hundred milliseconds for books, under two hundred for orders.",
        "And sleep adds think time, so each virtual user behaves like a person reading a page, not a machine gun.",
      ],
      panes: [{
        type: "code", file: "load/load.k6.js", lang: "js", typeTo: 0.85,
        code: `export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    "http_req_duration{endpoint:books}": ["p(95)<300"],
    "http_req_duration{endpoint:orders}": ["p(95)<200"],
  },
};
export default function () {
  http.get(\`\${BASE}/api/books\`, { tags: { endpoint: "books" } });
  sleep(1); // think time
}`,
        highlights: [
          { at: 0.9, until: 1, lines: [2, 3, 4, 5, 6], note: "stages" },
          { at: 1, until: 2, lines: [7, 8, 9, 10], note: "pass or fail" },
          { at: 2, until: 3, lines: [14], note: "think time", good: true },
        ],
      }],
    },
    {
      label: "How a load test works",
      cues: [
        "k6 starts virtual users. Each one runs your script in a loop: browse, think, check orders, think, open a book.",
        "Stages ramp them up: from zero to fifty users in thirty seconds, hold for a minute, then ramp down.",
        "k6 times every request. Before chapter two's fixes, p95 for books climbed past a second as users piled up.",
        "The threshold turns that into a failure. And orders failed too, although it was fast on its own: Node runs on one thread, so the slow endpoint held up the rest.",
      ],
      panes: [{ type: "concept", scene: "virtual-users" }],
    },
    {
      label: "After the fixes",
      cues: [
        "After the static fixes, the same test passes, with room to spare.",
        "That answers the plan's question for fifty users. It doesn't say how many more the app could take. That's the next lesson.",
      ],
      panes: [{
        type: "terminal", title: "k6 run load/load.k6.js",
        lines: [
          { at: 0.1, text: "█ THRESHOLDS", kind: "dim" },
          { at: 0.25, text: "✓ books           p(95)<300   p(95)=10.29ms", kind: "pass" },
          { at: 0.4, text: "✓ orders          p(95)<200   p(95)=8.98ms", kind: "pass" },
          { at: 0.55, text: "✓ recommendations p(95)<400   p(95)=34.33ms", kind: "pass" },
          { at: 0.7, text: "✓ http_req_failed rate<0.01   rate=0.00%", kind: "pass" },
          { at: 1, text: "all thresholds passed at 50 virtual users", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
