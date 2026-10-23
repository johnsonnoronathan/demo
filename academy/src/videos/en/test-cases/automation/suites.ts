import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "Organizing a test suite",
  "scenes": [
    {
      "label": "Introduction",
      "cues": ["A suite of test cases is only useful if people can find, trust and run it. Let's organize one."],
      "panes": [{ "type": "title", "kicker": "Lesson 3.2 · Automating", "heading": "Organizing a test suite", "sub": "Pyramid · traceability · upkeep", "subAt": 0.5 }]
    },
    {
      "label": "The test pyramid",
      "cues": [
        "As test cases pile up, structure matters. A common guide is the test pyramid.",
        "At the base, many fast unit tests. They check small pieces of logic, like applyDiscount.",
        "In the middle, fewer integration tests. They check pieces working together, like the cart saving to the database.",
        "At the top, a handful of end-to-end tests. They drive the real app like a customer would, like our sign-in test case.",
        "Higher tests are slower and more brittle. Keep them few, and save them for the journeys that matter most."
      ],
      "panes": [
        {
          "type": "pyramid",
          "layers": [
            {
              "at": 3,
              "label": "End-to-end",
              "sub": "Sign in, check out · seconds each",
              "count": "~10"
            },
            {
              "at": 2,
              "label": "Integration",
              "sub": "Cart + database · ~100 ms each",
              "count": "~50"
            },
            {
              "at": 1,
              "label": "Unit",
              "sub": "applyDiscount, isValidQuantity · ~1 ms each",
              "count": "~400"
            }
          ],
          "axisAt": 4,
          "axis": [
            "Slower · more brittle",
            "Faster · more precise"
          ]
        }
      ]
    },
    {
      "label": "Traceability",
      "cues": [
        "Link test cases to requirements. This is a traceability matrix.",
        "Each requirement lists the test cases that check it.",
        "A requirement with no test cases is a gap in your testing.",
        "And a test case with no requirement may be testing something nobody asked for."
      ],
      "panes": [
        {
          "type": "table",
          "caption": "Traceability · Larkspur Books",
          "cols": [
            "Requirement",
            "Test cases",
            "Coverage"
          ],
          "widths": [
            "46%",
            "32%",
            "22%"
          ],
          "rows": [
            {
              "at": 1,
              "cells": [
                "REQ-01 · Sign in with email and password",
                "TC-LOGIN-001, 002",
                {
                  "chip": "pass",
                  "text": "Covered"
                }
              ]
            },
            {
              "at": 1.3,
              "cells": [
                "REQ-02 · Lock account after 5 failed attempts",
                "TC-LOGIN-003",
                {
                  "chip": "fail",
                  "text": "Failing"
                }
              ]
            },
            {
              "at": 1.6,
              "cells": [
                "REQ-03 · Order 1 to 10 copies",
                "TC-CART-001 … 006",
                {
                  "chip": "pass",
                  "text": "Covered"
                }
              ]
            },
            {
              "at": 2,
              "cells": [
                "REQ-04 · Reset password by email",
                "—",
                {
                  "chip": "gap",
                  "text": "No tests"
                }
              ]
            },
            {
              "at": 3,
              "cells": [
                "—",
                "TC-UI-019 · Logo spins on hover",
                {
                  "chip": "warn",
                  "text": "Orphan"
                }
              ]
            }
          ],
          "focus": [
            {
              "at": 2,
              "until": 3,
              "row": 3
            },
            {
              "at": 3,
              "until": 4,
              "row": 4
            }
          ]
        }
      ]
    },
    {
      "label": "Keep it healthy",
      "cues": [
        "Finally, keep the suite healthy.",
        "Name tests by behavior, so a failure reads like a bug report.",
        "Fix or remove flaky tests quickly. A test that fails at random teaches everyone to ignore red.",
        "And when a requirement changes, update its test cases in the same change."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Suite hygiene",
          "items": [
            {
              "at": 1,
              "text": "Name by behavior",
              "sub": "“Account locks after 5 failed attempts”, not “test3”"
            },
            {
              "at": 2,
              "text": "No flaky tests",
              "sub": "Random red teaches people to ignore red"
            },
            {
              "at": 3,
              "text": "Change together",
              "sub": "Requirement and test cases in the same change"
            }
          ]
        }
      ]
    },
    {
      "label": "Course wrap-up",
      "cues": [
        "That's the course. You can now write test cases, choose them with partitions and boundaries, cover the unhappy paths, automate them, and organize a suite.",
        "Go find some bugs."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Course complete",
          "heading": "Go find some bugs.",
          "sub": "Write · design · automate · organize",
          "subAt": 0.6
        }
      ]
    }
  ]
});
