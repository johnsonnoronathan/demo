import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "Beyond the happy path",
  "scenes": [
    {
      "label": "Introduction",
      "cues": [
        "The happy path is the journey where everything goes right. Customers don't always stay on it."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Lesson 2.2 · Designing test cases",
          "heading": "Beyond the happy path",
          "sub": "Negative cases and decision tables",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "Negative cases",
      "cues": [
        "Negative test cases check that the software handles bad input and misuse gracefully.",
        "Empty and missing values: a blank email field.",
        "Wrong types and formats: letters in a quantity box, or an email without an at sign.",
        "Extremes: a ten-thousand-character name, or a price of zero.",
        "And bad timing: double-clicking Pay, or a session that expires halfway through checkout."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Where things go wrong",
          "items": [
            {
              "at": 1,
              "text": "Empty or missing",
              "sub": "Email field left blank"
            },
            {
              "at": 2,
              "text": "Wrong type or format",
              "sub": "“three” in Quantity · ada.larkspur.test"
            },
            {
              "at": 3,
              "text": "Extremes",
              "sub": "10,000-character name · price of $0.00"
            },
            {
              "at": 4,
              "text": "Bad timing",
              "sub": "Double-click Pay · session expires mid-checkout"
            }
          ]
        }
      ]
    },
    {
      "label": "Decision tables",
      "cues": [
        "When rules combine, use a decision table. Here's the discount code SAVE10: ten percent off orders of twenty dollars or more.",
        "List each condition as a column, then every combination as a row.",
        "Valid code, not expired, cart of twenty dollars or more: the discount is applied.",
        "When a single condition fails, the customer should get a clear, different message.",
        "Each row becomes a test case, and gaps in the requirements jump out. What should an expired code on a small cart say? Ask before you test."
      ],
      "panes": [
        {
          "type": "table",
          "caption": "SAVE10 · 10% off orders of $20 or more",
          "cols": [
            "Code known?",
            "Not expired?",
            "Cart ≥ $20?",
            "Expected"
          ],
          "widths": [
            "18%",
            "18%",
            "18%",
            "46%"
          ],
          "rows": [
            {
              "at": 1.3,
              "cells": [
                {
                  "chip": "yes"
                },
                {
                  "chip": "yes"
                },
                {
                  "chip": "yes"
                },
                "10% off applied"
              ]
            },
            {
              "at": 1.5,
              "cells": [
                {
                  "chip": "yes"
                },
                {
                  "chip": "yes"
                },
                {
                  "chip": "no"
                },
                "“Add $X more to use SAVE10”"
              ]
            },
            {
              "at": 1.7,
              "cells": [
                {
                  "chip": "yes"
                },
                {
                  "chip": "no"
                },
                {
                  "chip": "yes"
                },
                "“This code has expired”"
              ]
            },
            {
              "at": 1.9,
              "cells": [
                {
                  "chip": "yes"
                },
                {
                  "chip": "no"
                },
                {
                  "chip": "no"
                },
                {
                  "chip": "gap",
                  "text": "Not specified"
                }
              ]
            },
            {
              "at": 2.1,
              "cells": [
                {
                  "chip": "no"
                },
                "–",
                "–",
                "“We don't recognise that code”"
              ]
            }
          ],
          "focus": [
            {
              "at": 2,
              "until": 3,
              "row": 0
            },
            {
              "at": 3,
              "until": 4,
              "row": 1
            },
            {
              "at": 3.5,
              "until": 4,
              "row": 2
            },
            {
              "at": 4.3,
              "until": 5,
              "row": 3
            }
          ]
        }
      ]
    },
    {
      "label": "Recap",
      "cues": [
        "To recap: for every happy path, ask how it could go wrong.",
        "Check empty values, wrong formats, extremes and bad timing.",
        "And when conditions combine, a decision table finds the cases, and the gaps."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Recap",
          "check": true,
          "items": [
            {
              "at": 0,
              "text": "Every happy path has unhappy siblings"
            },
            {
              "at": 1,
              "text": "Empty · wrong format · extremes · bad timing"
            },
            {
              "at": 2,
              "text": "Decision tables find cases and gaps"
            }
          ]
        }
      ]
    }
  ]
});
