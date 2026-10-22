import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Static testing: summary",
  scenes: [
    {
      label: "Recap",
      cues: ["Without generating any traffic, you found and fixed three problems."],
      panes: [{ type: "title", kicker: "Chapter 2 · Summary", heading: "What reading found" }],
    },
    {
      label: "Results",
      cues: [
        "A hundred and one queries per page became one.",
        "Two full table scans became index searches.",
        "And the storefront went from over a megabyte to fifty-nine kilobytes. Each check took seconds.",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "101 → 1", label: "queries per page", tone: "good" },
          { at: 1.1, value: "2 → 0", label: "full table scans", tone: "good" },
          { at: 2.1, value: "1,140 → 59 KB", label: "page weight", tone: "good" },
          { at: 2.6, value: "seconds", label: "per check, no server", tone: "accent" },
        ],
      }],
    },
    {
      label: "The limits",
      cues: [
        "But every fix came from a known pattern. None of these checks told you how the app behaves with fifty shoppers,",
        "how long a phone shows a blank screen, or what the processor is doing.",
        "And one endpoint, recommendations, didn't trigger a single warning. It's slow anyway. That's chapter three.",
      ],
      panes: [{
        type: "bullets", lead: "What static testing can't tell you",
        items: [
          { at: 0, text: "How slow it is under load" },
          { at: 1, text: "What a phone actually sees" },
          { at: 2, text: "Problems no rule describes" },
        ],
      }],
    },
  ],
});
