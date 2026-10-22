import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "From test case to automated test",
  "scenes": [
    {
      "label": "Introduction",
      "cues": [
        "Manual test cases are a great start. When a check needs to run often, automate it. Let's turn a test case into code."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Lesson 3.1 · Automating",
          "heading": "From test case to automated test",
          "sub": "Arrange · Act · Assert",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "The code under test",
      "cues": [
        "Here's the function behind the SAVE10 discount code.",
        "It takes an order total and a code, and returns the new total. Ten percent off, but only for orders of twenty dollars or more."
      ],
      "panes": [
        {
          "type": "code",
          "file": "discount.js",
          "lang": "js",
          "typeTo": 1.3,
          "code": "export function applyDiscount(total, code) {\n  if (code !== \"SAVE10\") return total;\n  if (total <= 20) return total;\n  return Math.round(total * 0.9 * 100) / 100;\n}"
        }
      ]
    },
    {
      "label": "Arrange, Act, Assert",
      "cues": [
        "An automated test is a test case written as code.",
        "The test case title becomes the test name.",
        "Arrange sets up the preconditions and test data.",
        "Act performs the one step under test.",
        "Assert is the expected result. We expect the total to be thirty-six."
      ],
      "panes": [
        {
          "type": "code",
          "file": "discount.test.js",
          "lang": "js",
          "typeTo": 0.95,
          "code": "import { test, expect } from \"vitest\";\nimport { applyDiscount } from \"./discount.js\";\n\ntest(\"SAVE10 takes 10% off a $40 order\", () => {\n  // Arrange\n  const total = 40;\n  // Act\n  const result = applyDiscount(total, \"SAVE10\");\n  // Assert\n  expect(result).toBe(36);\n});",
          "highlights": [
            {
              "at": 1,
              "until": 2,
              "lines": [
                4
              ],
              "note": "Title → test name"
            },
            {
              "at": 2,
              "until": 3,
              "lines": [
                5,
                6
              ],
              "note": "Preconditions + test data"
            },
            {
              "at": 3,
              "until": 4,
              "lines": [
                7,
                8
              ],
              "note": "The one step"
            },
            {
              "at": 4,
              "until": 5,
              "lines": [
                9,
                10
              ],
              "note": "Expected result"
            }
          ]
        }
      ]
    },
    {
      "label": "Red, then green",
      "cues": [
        "Let's add our boundary case from the partitions lesson. An order of exactly twenty dollars should get the discount.",
        "Run the tests.",
        "Red. We expected eighteen, but received twenty. The function uses less-than-or-equal.",
        "Change it to less-than, and run again.",
        "Green. Every passing test is a test case that now runs itself, in milliseconds, on every change."
      ],
      "layout": "split",
      "cols": "1.4fr 1fr",
      "panes": [
        {
          "type": "code",
          "file": "discount.js",
          "lang": "js",
          "typeTo": -1,
          "code": "export function applyDiscount(total, code) {\n  if (code !== \"SAVE10\") return total;\n  if (total <= 20) return total;\n  return Math.round(total * 0.9 * 100) / 100;\n}\n\n// discount.test.js\ntest(\"SAVE10 applies at exactly $20\", () => {\n  expect(applyDiscount(20, \"SAVE10\")).toBe(18);\n});",
          "appear": [
            {
              "at": 0.3,
              "lines": [
                7,
                8,
                9,
                10
              ]
            }
          ],
          "swaps": [
            {
              "at": 3.3,
              "line": 3,
              "text": "  if (total < 20) return total;"
            }
          ],
          "highlights": [
            {
              "at": 2.3,
              "until": 3.3,
              "lines": [
                3
              ],
              "bad": true
            },
            {
              "at": 3.3,
              "until": 4,
              "lines": [
                3
              ],
              "good": true
            }
          ]
        },
        {
          "type": "terminal",
          "lines": [
            {
              "at": 1,
              "until": 3,
              "text": "$ npx vitest run",
              "kind": "cmd"
            },
            {
              "at": 1.4,
              "until": 3,
              "text": "✓ SAVE10 takes 10% off a $40 order",
              "kind": "pass"
            },
            {
              "at": 1.6,
              "until": 3,
              "text": "✗ SAVE10 applies at exactly $20",
              "kind": "fail"
            },
            {
              "at": 1.8,
              "until": 3,
              "text": "  Expected: 18",
              "kind": "pass-dim"
            },
            {
              "at": 1.8,
              "until": 3,
              "text": "  Received: 20",
              "kind": "fail-dim"
            },
            {
              "at": 2,
              "until": 3,
              "text": "Tests  1 failed | 1 passed (2)",
              "kind": "sum-fail"
            },
            {
              "at": 3.6,
              "text": "$ npx vitest run",
              "kind": "cmd"
            },
            {
              "at": 3.9,
              "text": "✓ SAVE10 takes 10% off a $40 order",
              "kind": "pass"
            },
            {
              "at": 4,
              "text": "✓ SAVE10 applies at exactly $20",
              "kind": "pass"
            },
            {
              "at": 4.2,
              "text": "Tests  2 passed (2) · 4 ms",
              "kind": "sum-pass"
            }
          ]
        }
      ]
    },
    {
      "label": "Recap",
      "cues": [
        "To recap: the test name is the title, Arrange is the setup, Act is the step, and Assert is the expected result.",
        "Watch a test fail before you trust it to pass. Red, then green."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Recap",
          "check": true,
          "items": [
            {
              "at": 0,
              "text": "Title → name · Arrange · Act · Assert"
            },
            {
              "at": 1,
              "text": "See it fail, then make it pass"
            }
          ]
        }
      ]
    }
  ]
});
