import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "等价类与边界值",
  "scenes": [
    {
      "label": "引言",
      "cues": [
        "应该测试哪些输入？这节课介绍两种技术，把成千上万种可能的输入，变成少数几个好输入。"
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "第 2.1 课 · 设计测试用例",
          "heading": "等价类与边界值",
          "sub": "有目的地选择输入",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "输入太多",
      "cues": [
        "在 Larkspur Books 的购物车里，一本书可以订购一到十本。",
        "你不可能把每个数字都测一遍。那该怎么选呢？",
        "把软件应该同等对待的输入归为一组。这些组就叫等价类。"
      ],
      "panes": [
        {
          "type": "numberline",
          "heading": "数量字段 · 接受 1 到 10",
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
      "label": "每组选一个",
      "cues": [
        "这里有三个等价类：太少、数量有效、太多。",
        "每个等价类选一个代表值。太少的，选零。",
        "有效的，选五。",
        "太多的，选十五。三个测试用例覆盖三种行为。"
      ],
      "panes": [
        {
          "type": "numberline",
          "heading": "数量字段 · 接受 1 到 10",
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
      "label": "缺陷藏在边缘",
      "cues": [
        "但缺陷偏爱边缘。开发者本想写小于等于，却可能写成了小于。",
        "边界值分析就是在每个边界上测一次，再在紧挨着它的外侧测一次。",
        "下限是零和一。",
        "上限是十和十一。",
        "这里的代码写的是数量小于十。只有恰好订购十本的测试才能发现它。"
      ],
      "layout": "stack",
      "panes": [
        {
          "type": "numberline",
          "heading": "边界值 · 测试每个边界及其相邻值",
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
              "note": "应该是 qty <= 10",
              "bad": true
            }
          ]
        }
      ]
    },
    {
      "label": "得出的用例",
      "cues": [
        "把这些放在一起，就得到一组精简的测试用例。",
        "每一行都有存在的理由。没有重复，也没有遗漏明显的情况。",
        "只要输入有范围，就可以用这个方法：年龄、价格、姓名长度、日期。"
      ],
      "panes": [
        {
          "type": "table",
          "caption": "数量字段 · 推导出的测试用例",
          "cols": [
            "ID",
            "数量",
            "理由",
            "预期结果"
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
                "边界值，刚好低于最小值",
                "拒绝"
              ]
            },
            {
              "at": 0.35,
              "cells": [
                "TC-CART-002",
                "1",
                "边界值，最小值",
                "接受"
              ]
            },
            {
              "at": 0.5,
              "cells": [
                "TC-CART-003",
                "5",
                "有效等价类",
                "接受"
              ]
            },
            {
              "at": 0.65,
              "cells": [
                "TC-CART-004",
                "10",
                "边界值，最大值",
                "接受"
              ]
            },
            {
              "at": 0.8,
              "cells": [
                "TC-CART-005",
                "11",
                "边界值，刚好高于最大值",
                "拒绝"
              ]
            },
            {
              "at": 0.95,
              "cells": [
                "TC-CART-006",
                "15",
                "无效等价类，太多",
                "拒绝"
              ]
            }
          ]
        }
      ]
    }
  ]
});
