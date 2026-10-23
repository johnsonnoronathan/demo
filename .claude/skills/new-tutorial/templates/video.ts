import { defineVideo } from "../../../../video/types";

// Save as academy/src/videos/en/<course>/<chapter>/<slug>.ts ("opening.ts" for an opening).
// Pane timings are in cue units: at: 1.5 is halfway through the second cue of the scene.
export default defineVideo({
  title: "<Page title>",
  scenes: [
    {
      label: "Introduction",
      cues: ["<One or two sentences: the problem this page solves.>"],
      panes: [{ type: "title", kicker: "Lesson <n> · <Chapter>", heading: "<Page title>", sub: "<Short subtitle>", subAt: 0.4 }],
    },
    {
      label: "<Concept>",
      cues: ["<First point.>", "<Second point.>", "<Third point.>"],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "<First point>", sub: "<detail>" },
          { at: 1, text: "<Second point>" },
          { at: 2, text: "<Third point>" },
        ],
      }],
    },
    {
      label: "Your turn",
      cues: ["<What the learner does in the exercise, and what the agent does.>"],
      panes: [{ type: "bullets", check: true, items: [{ at: 0, text: "<You run the check>" }, { at: 0.5, text: "<The agent implements>" }] }],
    },
  ],
});
