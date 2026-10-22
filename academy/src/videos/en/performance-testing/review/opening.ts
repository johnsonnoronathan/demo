import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Summary",
  scenes: [
    {
      label: "Introduction",
      cues: ["The last two chapters went deep, one family of tests each. This one steps back, and makes performance testing a routine."],
      panes: [{ type: "title", kicker: "Chapter 4 · Opening", heading: "Summary", sub: "Make it a routine", subAt: 0.4 }],
    },
    {
      label: "Where you are",
      cues: [
        "Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations.",
        "This chapter makes sure the next change can't quietly undo any of it.",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "1", label: "query per page", tone: "good" },
          { at: 0.3, value: "2", label: "new indexes", tone: "good" },
          { at: 0.5, value: "1/20", label: "of the page weight", tone: "good" },
          { at: 0.7, value: "12×", label: "recommendations throughput", tone: "good" },
        ],
      }],
    },
    {
      label: "What you'll get",
      cues: [
        "You'll decide which checks run on every pull request, which before a release, and which in production.",
        "You'll wire the static gates and a short load test into a CI workflow.",
        "You'll write a performance report that someone else can act on and repeat.",
        "And you'll review the whole course in one place.",
      ],
      panes: [{
        type: "bullets", lead: "What you'll get",
        items: [
          { at: 0, text: "What runs where" },
          { at: 1, text: "Gates in CI" },
          { at: 2, text: "Reports people can act on" },
          { at: 3, text: "The course in review" },
        ],
      }],
    },
  ],
});
