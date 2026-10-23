import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "Partitions and boundaries",
  "scenes": [
    {
      "label": "Introduction",
      "cues": [
        "Which inputs should you test? In this lesson, two techniques that turn thousands of possible inputs into a handful of good ones."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Lesson 2.1 · Designing test cases",
          "heading": "Partitions and boundaries",
          "sub": "Choose inputs on purpose",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "Too many inputs",
      "cues": [
        "The cart at Larkspur Books lets you order between one and ten copies of a book.",
        "You can't test every possible number. So how do you choose?",
        "Group inputs that the software should treat the same way. These groups are called equivalence partitions."
      ],
      "panes": [
        {
          "type": "numberline",
          "heading": "Quantity field · accepts 1 to 10",
          "min": -2,
          "max": 16,
          "valid": [
            1,
            10
          ],
          "partitionsAt": 2,
          "points": []
        }
      ]
    },
    {
      "label": "One from each group",
      "cues": [
        "There are three partitions here: too few, a valid amount, and too many.",
        "Pick one representative from each. Zero for too few.",
        "Five for valid.",
        "And fifteen for too many. Three test cases cover three behaviors."
      ],
      "panes": [
        {
          "type": "numberline",
          "heading": "Quantity field · accepts 1 to 10",
          "min": -2,
          "max": 16,
          "valid": [
            1,
            10
          ],
          "partitionsAt": -1,
          "points": [
            {
              "at": 1,
              "v": 0
            },
            {
              "at": 2,
              "v": 5
            },
            {
              "at": 3,
              "v": 15
            }
          ]
        }
      ]
    },
    {
      "label": "Bugs live at the edges",
      "cues": [
        "But bugs love edges. A developer might type less-than where they meant less-than-or-equal.",
        "Boundary value analysis tests right at each edge, and just outside it.",
        "Zero and one at the bottom.",
        "Ten and eleven at the top.",
        "The code here says quantity less than ten. Only the test with exactly ten copies catches it."
      ],
      "layout": "stack",
      "panes": [
        {
          "type": "numberline",
          "heading": "Boundaries · test each edge and its neighbor",
          "min": -1,
          "max": 12,
          "valid": [
            1,
            10
          ],
          "partitionsAt": -1,
          "points": [
            {
              "at": 2,
              "v": 0
            },
            {
              "at": 2.4,
              "v": 1
            },
            {
              "at": 3,
              "v": 10,
              "bug": 4
            },
            {
              "at": 3.4,
              "v": 11
            }
          ]
        },
        {
          "type": "code",
          "file": "cart.js",
          "lang": "js",
          "typeTo": 0.9,
          "code": "function isValidQuantity(qty) {\n  return qty >= 1 && qty < 10;\n}",
          "highlights": [
            {
              "at": 4,
              "until": 5,
              "lines": [
                2
              ],
              "note": "Should be qty <= 10",
              "bad": true
            }
          ]
        }
      ]
    },
    {
      "label": "The resulting cases",
      "cues": [
        "Put it together, and you get a compact set of test cases.",
        "Each row has a reason to exist. Nothing is duplicated, and nothing obvious is missed.",
        "Use this whenever an input has a range: ages, prices, name lengths, dates."
      ],
      "panes": [
        {
          "type": "table",
          "caption": "Quantity field · derived test cases",
          "cols": [
            "ID",
            "Quantity",
            "Why",
            "Expected"
          ],
          "widths": [
            "18%",
            "14%",
            "38%",
            "30%"
          ],
          "rows": [
            {
              "at": 0.2,
              "cells": [
                "TC-CART-001",
                "0",
                "Boundary, just below minimum",
                "Rejected"
              ]
            },
            {
              "at": 0.35,
              "cells": [
                "TC-CART-002",
                "1",
                "Boundary, minimum",
                "Accepted"
              ]
            },
            {
              "at": 0.5,
              "cells": [
                "TC-CART-003",
                "5",
                "Valid partition",
                "Accepted"
              ]
            },
            {
              "at": 0.65,
              "cells": [
                "TC-CART-004",
                "10",
                "Boundary, maximum",
                "Accepted"
              ]
            },
            {
              "at": 0.8,
              "cells": [
                "TC-CART-005",
                "11",
                "Boundary, just above maximum",
                "Rejected"
              ]
            },
            {
              "at": 0.95,
              "cells": [
                "TC-CART-006",
                "15",
                "Invalid partition, too many",
                "Rejected"
              ]
            }
          ]
        }
      ]
    }
  ]
});
