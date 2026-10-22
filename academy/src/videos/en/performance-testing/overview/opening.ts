import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Overview",
  scenes: [
    {
      label: "Welcome",
      cues: [
        "Welcome to Performance Testing on Testbench. In this course you'll learn to find what makes software slow, before your users do.",
        "\"The site feels slow\" is a complaint. A number with a cause attached is a finding. This course teaches you to get from one to the other.",
      ],
      panes: [{ type: "title", kicker: "Performance Testing · Chapter 1", heading: "Find what makes software slow", sub: "before your users do", subAt: 0.4 }],
    },
    {
      label: "Four chapters",
      cues: [
        "The course has four chapters. First, an overview: what performance testing measures, and how.",
        "Then static testing: finding problems by reading code, query plans and build output, without running anything.",
        "Then dynamic testing: running the app under realistic traffic and measuring what users feel.",
        "And finally a summary that puts both into a workflow, and into a report people can act on.",
      ],
      panes: [{
        type: "bullets", lead: "Overall → specific → overall",
        items: [
          { at: 0, text: "1 · Overview", sub: "What performance testing measures" },
          { at: 1, text: "2 · Static testing", sub: "Read code, query plans and builds" },
          { at: 2, text: "3 · Dynamic testing", sub: "Run the system and measure it" },
          { at: 3, text: "4 · Summary", sub: "A workflow, a report, a review" },
        ],
      }],
    },
    {
      label: "The practice app",
      cues: [
        "You'll practise on Larkspur Books, a small online bookshop with five thousand books and two hundred thousand orders.",
        "It's slow on purpose. One page of books runs a hundred and one database queries, and on a phone the main image takes almost ten seconds to appear.",
        "By the end of the course you'll have found and fixed every one of those problems, with a number to prove each fix.",
      ],
      panes: [{
        type: "stats", caption: "Larkspur Books · slow on purpose",
        items: [
          { at: 0.2, value: "5,000", label: "books" },
          { at: 0.5, value: "200,000", label: "orders" },
          { at: 1.2, value: "101", label: "queries for one page", tone: "bad" },
          { at: 1.6, value: "9.8 s", label: "until the main image shows", tone: "bad" },
        ],
      }],
    },
    {
      label: "How each page works",
      cues: [
        "Every page works the same way. Watch a short video, like this one.",
        "Then read the lesson below it, at your own pace.",
        "Then do your part of the hands-on exercise: run the checks yourself, and read the numbers.",
        "Hand the implementation to a coding agent. Copy the exercise's prompt, and the agent makes the fix and quotes its output.",
        "Then verify: rerun the same check yourself. The number you see is the one that counts, and the decision is yours.",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "Watch", sub: "A narrated video with captions and chapters" },
          { at: 1, text: "Read", sub: "The lesson, paced for reading" },
          { at: 2, text: "Measure", sub: "Run the checks yourself and read the numbers" },
          { at: 3, text: "Delegate", sub: "The agent implements the fix" },
          { at: 4, text: "Verify", sub: "Rerun the same check, then decide" },
        ],
      }],
    },
  ],
});
