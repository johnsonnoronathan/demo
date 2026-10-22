import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "从测试用例到自动化测试",
  "scenes": [
    {
      "label": "引言",
      "cues": [
        "手工测试用例是很好的起点。当某项检查需要经常执行时，就把它自动化。我们来把一个测试用例变成代码。"
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "第 3.1 课 · 自动化",
          "heading": "从测试用例到自动化测试",
          "sub": "Arrange · Act · Assert",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "被测代码",
      "cues": [
        "这是优惠码 SAVE10 背后的函数。",
        "它接收订单总额和优惠码，返回新的总额。打九折，但只适用于满二十美元的订单。"
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
      "label": "Arrange、Act、Assert",
      "cues": [
        "自动化测试就是用代码写成的测试用例。",
        "测试用例的标题变成测试名。",
        "Arrange 负责准备前置条件和测试数据。",
        "Act 执行被测的那一个步骤。",
        "Assert 就是预期结果。我们期望总额是三十六。"
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
              "note": "标题 → 测试名"
            },
            {
              "at": 2,
              "until": 3,
              "lines": [
                5,
                6
              ],
              "note": "前置条件 + 测试数据"
            },
            {
              "at": 3,
              "until": 4,
              "lines": [
                7,
                8
              ],
              "note": "那一个步骤"
            },
            {
              "at": 4,
              "until": 5,
              "lines": [
                9,
                10
              ],
              "note": "预期结果"
            }
          ]
        }
      ]
    },
    {
      "label": "先红后绿",
      "cues": [
        "我们把等价类那节课里的边界值用例加进来。恰好二十美元的订单应该享受折扣。",
        "运行测试。",
        "红了。我们期望十八，实际得到二十。函数用的是小于等于。",
        "把它改成小于，再运行一次。",
        "绿了。每一个通过的测试，都是一个会在每次改动时自动执行、只需几毫秒的测试用例。"
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
      "label": "小结",
      "cues": [
        "总结一下：测试名就是标题，Arrange 是准备，Act 是操作步骤，Assert 是预期结果。",
        "先看到测试失败，再相信它的通过。先红，后绿。"
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "小结",
          "check": true,
          "items": [
            {
              "at": 0,
              "text": "标题 → 测试名 · Arrange · Act · Assert"
            },
            {
              "at": 1,
              "text": "先看它失败，再让它通过"
            }
          ]
        }
      ]
    }
  ]
});
