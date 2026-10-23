import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Exploratory testing",
  scenes: [
    {
      label: "Introduction",
      cues: [
        "Scripted test cases check what you already expect. Exploratory testing looks for what nobody thought to write down.",
        "You design the next test while you run the current one, and each result tells you where to look next.",
      ],
      panes: [
        {
          type: "title",
          kicker: "Lesson 2.3 · Designing test cases",
          heading: "Exploratory testing",
          sub: "Charters, time boxes and session notes",
          subAt: 0.5,
        },
      ],
    },
    {
      label: "Charters",
      cues: [
        "Exploring is not clicking around. Each session starts with a charter: one sentence that gives it a mission.",
        "The target is the feature you'll explore, as narrow as you can make it.",
        "The resources are what you bring: unusual data, a second tab, a slow network.",
        "And the information is what you want to learn, such as how errors are reported.",
      ],
      panes: [
        {
          type: "bullets",
          lead: "Explore target with resources to discover information",
          items: [
            { at: 1, text: "Target", sub: "The Larkspur discount code field" },
            { at: 2, text: "Resources", sub: "Expired, misspelled and pasted codes" },
            { at: 3, text: "Information", sub: "How errors are reported" },
          ],
        },
      ],
    },
    {
      label: "Time box",
      cues: [
        "Choose the length of the session before you start, for example sixty minutes, and stop when the time is up.",
        "Stay on the charter. When you spot something outside it, write it down and carry on. It may become the next session's charter.",
      ],
      panes: [
        {
          type: "bullets",
          lead: "During the session",
          items: [
            { at: 0, text: "Fix the time box before you start", sub: "for example, 60 minutes" },
            { at: 1, text: "Stay on the charter", sub: "note side issues, don't chase them" },
          ],
        },
      ],
    },
    {
      label: "Session notes",
      cues: [
        "Notes turn exploring into evidence. Keep them as you go. These findings are an example, not a real run.",
        "Covered lists what you tried, so a reviewer can see the gaps.",
        "Bugs are problems you could reproduce, like a pasted code with a trailing space being rejected.",
        "Questions are gaps in the requirements. Should codes be case-insensitive? Nobody said.",
        "And follow-up ideas are leads you didn't chase because they were off-charter.",
      ],
      panes: [
        {
          type: "card",
          focus: true,
          id: "SESSION",
          title: "Discount code errors · example notes",
          titleAt: 0,
          fields: [
            { at: 1, label: "Covered", list: ["Expired code", "Misspelled codes", "Pasted code with trailing space"] },
            { at: 2, label: "Bugs", list: ["Trailing space: rejected as unknown"] },
            { at: 3, label: "Questions", list: ["Case-insensitive codes? Not specified"] },
            { at: 4, label: "Follow-up ideas", list: ["Delivery estimate changes with a code"] },
          ],
        },
      ],
    },
    {
      label: "Debrief",
      cues: [
        "After the session, go through the notes with someone and agree what each finding means.",
        "A bug gets reported and, once fixed, becomes a scripted test case. A question goes to the requirement's owner. A follow-up idea becomes a new charter.",
      ],
      panes: [
        {
          type: "table",
          caption: "From findings to next steps",
          cols: ["Finding", "Next step"],
          widths: ["35%", "65%"],
          rows: [
            { at: 1, cells: ["Bug", "Report it, then add a scripted test case"] },
            { at: 1.4, cells: ["Question", "Ask the requirement's owner"] },
            { at: 1.8, cells: ["Follow-up idea", "Write a new charter"] },
          ],
        },
      ],
    },
    {
      label: "Recap",
      cues: [
        "To recap: give every session a charter with one mission.",
        "Time-box it, and keep notes as you go.",
        "Then debrief, and turn what you found into test cases, questions and new charters.",
      ],
      panes: [
        {
          type: "bullets",
          lead: "Recap",
          check: true,
          items: [
            { at: 0, text: "One charter, one mission" },
            { at: 1, text: "Time box and session notes" },
            { at: 2, text: "Findings become cases, questions and charters" },
          ],
        },
      ],
    },
  ],
});
