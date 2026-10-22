import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "What performance testing measures",
  scenes: [
    {
      label: "Introduction",
      cues: ["Whatever tool you use, a performance test reports three numbers. Let's meet them."],
      panes: [{ type: "title", kicker: "Lesson 1.1 · Overview", heading: "What performance testing measures", sub: "Latency · throughput · errors", subAt: 0.4 }],
    },
    {
      label: "Three numbers",
      cues: [
        "Latency: how long one request takes, in milliseconds.",
        "Throughput: how many requests complete every second.",
        "And the error rate: the share of requests that fail or time out.",
        "They move together. As a system nears its limit, throughput stops rising, latency climbs, and soon after, errors appear.",
      ],
      panes: [{
        type: "bullets", lead: "Every test reports",
        items: [
          { at: 0, text: "Latency", sub: "How long one request takes · ms" },
          { at: 1, text: "Throughput", sub: "Requests completed per second · req/s" },
          { at: 2, text: "Error rate", sub: "Share that fail or time out · %" },
        ],
      }],
    },
    {
      label: "Percentiles",
      cues: [
        "Send the same request four hundred times and you get four hundred different durations.",
        "Stacked by duration, they form a hump, with a long tail of slow requests to the right.",
        "The median, or p50, is the typical request. Half are faster, half are slower.",
        "p95 and p99 describe the tail. One user in twenty waits at least as long as the p95.",
        "The average sits in between and describes no real request. That's why budgets and thresholds use percentiles.",
      ],
      panes: [{ type: "concept", scene: "percentiles" }],
    },
    {
      label: "A first measurement",
      cues: [
        "In the exercise you'll start the practice app and ask it for one page of books. The response says it ran a hundred and one database queries.",
        "Then you'll put it under light load: ten virtual users for twenty seconds.",
        "On our machine that gave sixteen requests per second, with a p95 over a second. Write it down, with the command you ran. That's your baseline.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ curl -s -i localhost:3000/api/books | head -4", kind: "cmd" },
          { at: 0.4, text: "HTTP/1.1 200 OK", kind: "out" },
          { at: 0.5, text: "x-query-count: 101", kind: "fail" },
          { at: 0.6, text: "server-timing: app;dur=60.4", kind: "out" },
          { at: 1.1, text: "$ npm run load -- --url …/api/books --vus 10 --duration 20", kind: "cmd" },
          { at: 1.6, text: "  vus  secs  requests   rps   p50 ms  p95 ms  p99 ms  errors", kind: "dim" },
          { at: 2.0, text: "   10    20       320  16.0      573    1320    2965       0", kind: "out" },
          { at: 2.4, text: "baseline saved to notes/perf-baseline.md", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
