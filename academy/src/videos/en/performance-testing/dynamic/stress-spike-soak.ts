import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Stress, spike and soak tests",
  scenes: [
    {
      label: "Introduction",
      cues: ["A load test asks: are we fine at the traffic we expect? The tests in this lesson ask harder questions."],
      panes: [{ type: "title", kicker: "Lesson 3.3 · Dynamic testing", heading: "Stress, spike and soak tests", sub: "Past the expected load", subAt: 0.4 }],
    },
    {
      label: "Four shapes of load",
      cues: [
        "A load test runs the traffic you expect on a busy day, and asks whether you meet the budget.",
        "A stress test keeps adding users in steps, to find where the app breaks, and how.",
        "A spike test sends a sudden surge, like a newsletter going out, and asks whether you survive and recover.",
        "And a soak test runs ordinary traffic for hours, looking for anything that leaks or drifts.",
      ],
      panes: [{ type: "concept", scene: "load-shapes" }],
    },
    {
      label: "Finding capacity",
      cues: [
        "Here is the recommendations endpoint, measured with one, two, four, eight and sixteen users.",
        "Throughput is flat at about fifty-eight requests per second, from the very first user. That's the ceiling.",
        "So extra users only wait in line, and p95 grows with every step: from twenty-five milliseconds to over half a second.",
        "The knee, where p95 crosses the four-hundred-millisecond budget, is the practical capacity: somewhere between eight and sixteen users.",
      ],
      panes: [{ type: "concept", scene: "capacity-knee" }],
    },
    {
      label: "Spikes and soaks",
      cues: [
        "A spike test jumps from five users to a hundred in five seconds.",
        "During the surge, p95 hits five seconds and some requests time out. Afterwards, latency returns to normal. Larkspur recovers.",
        "Soak tests run for hours and watch the trend: memory, connections, and latency creeping up over time.",
      ],
      panes: [{
        type: "table", caption: "Spike test · /api/recommendations", cols: ["Phase", "Users", "p95"], widths: ["40%", "20%", "40%"],
        rows: [
          { at: 0.2, cells: ["Before", "5", "26 ms"] },
          { at: 1, cells: ["During the spike", "100", { chip: "fail", text: "5.3 s · 3.5% timeouts" }] },
          { at: 1.5, cells: ["After", "5", { chip: "pass", text: "28 ms · recovered" }] },
        ],
      }],
    },
  ],
});
