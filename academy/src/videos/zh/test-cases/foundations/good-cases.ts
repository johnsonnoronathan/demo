import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "好的测试用例与弱的测试用例",
  "scenes": [
    {
      "label": "引言",
      "cues": [
        "两个人测试同一个功能，写出的测试用例可能截然不同。这节课我们来看看，什么样的测试用例才算好。"
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "第 1.2 课 · 基础",
          "heading": "好的测试用例与弱的测试用例",
          "sub": "五个习惯和一种实用的格式",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "弱用例与强用例",
      "cues": [
        "这是一个弱的测试用例。测试登录。用一个用户登录。能用。",
        "哪个用户？什么密码？“能用”是什么样子？两名测试人员执行它，可能会得出不同的结论。",
        "这是同一个想法改写后的版本。标题只写一个行为：密码错误时登录被拒绝。",
        "数据是确切的，预期结果是看得见的：出现一条错误提示，并且停留在登录页面。"
      ],
      "layout": "split",
      "panes": [
        {
          "type": "card",
          "compact": true,
          "tag": {
            "text": "弱",
            "kind": "fail"
          },
          "id": "TC-?",
          "title": "测试登录",
          "titleAt": 0,
          "fields": [
            {
              "at": 0.3,
              "label": "测试步骤",
              "value": "用一个用户登录。",
              "flag": {
                "at": 1,
                "text": "哪个用户？什么密码？"
              }
            },
            {
              "at": 0.6,
              "label": "预期结果",
              "value": "能用。",
              "flag": {
                "at": 1.4,
                "text": "你会看到什么？"
              }
            }
          ]
        },
        {
          "type": "card",
          "compact": true,
          "tag": {
            "text": "强",
            "kind": "pass"
          },
          "id": "TC-LOGIN-002",
          "title": "密码错误时登录被拒绝",
          "titleAt": 2,
          "fields": [
            {
              "at": 2.5,
              "label": "测试数据",
              "list": [
                "邮箱：ada@larkspur.test",
                "密码：lark2026（错误）"
              ]
            },
            {
              "at": 3,
              "label": "测试步骤",
              "steps": [
                "打开登录页面",
                "输入邮箱和密码",
                "点击“登录”"
              ]
            },
            {
              "at": 3.4,
              "label": "预期结果",
              "value": "出现“邮箱或密码不正确”。页面停留在登录页。"
            }
          ]
        }
      ]
    },
    {
      "label": "五个习惯",
      "cues": [
        "好的测试用例都有五个共同的习惯。",
        "原子性：每个用例只测一个行为，失败时只指向一个问题。",
        "独立：每个用例自己准备前置条件，不依赖其他用例先执行。",
        "可重复：同样的输入、同样的步骤，每次都得到同样的结果。",
        "具体：真实的值、可观察的结果，不写“应该能用”。",
        "可追溯：每个用例都能对应回它所检查的需求。"
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "五个习惯",
          "items": [
            {
              "at": 1,
              "text": "原子性",
              "sub": "每个用例一个行为"
            },
            {
              "at": 2,
              "text": "独立",
              "sub": "自己准备环境；任何顺序都能执行"
            },
            {
              "at": 3,
              "text": "可重复",
              "sub": "同样的输入，每次同样的结果"
            },
            {
              "at": 4,
              "text": "具体",
              "sub": "真实的值，可观察的结果"
            },
            {
              "at": 5,
              "text": "可追溯",
              "sub": "对应到它所检查的需求"
            }
          ]
        }
      ]
    },
    {
      "label": "Given、When、Then",
      "cues": [
        "许多团队用 Given、When、Then 的形式来写测试用例。",
        "Given 负责准备环境，也就是前置条件和测试数据。",
        "When 是被测的那一个操作。",
        "Then 是预期结果，要写得可以观察。",
        "这种格式读起来就像日常语言，以后还能直接驱动自动化测试。"
      ],
      "panes": [
        {
          "type": "code",
          "file": "sign-in.feature",
          "lang": "gherkin",
          "typeTo": 0.95,
          "code": "Feature: 登录\n\n  Scenario: 错误的密码被拒绝\n    Given 存在客户账户 \"ada@larkspur.test\"\n    And 它的密码是 \"Lark!2026\"\n    When 我使用密码 \"lark2026\" 登录\n    Then 我看到 \"邮箱或密码不正确\"\n    And 我仍停留在登录页面",
          "highlights": [
            {
              "at": 1,
              "until": 2,
              "lines": [
                4,
                5
              ],
              "note": "Given · 前置条件 + 数据"
            },
            {
              "at": 2,
              "until": 3,
              "lines": [
                6
              ],
              "note": "When · 那一个操作"
            },
            {
              "at": 3,
              "until": 4,
              "lines": [
                7,
                8
              ],
              "note": "Then · 预期结果"
            }
          ]
        }
      ]
    },
    {
      "label": "小结",
      "cues": [
        "总结一下：用真实的值和可观察的结果代替含糊的措辞。",
        "让每个用例保持原子性、独立、可重复、具体、可追溯。",
        "下一章，我们不再问怎么写用例，而是开始问：应该写哪些用例。"
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "小结",
          "check": true,
          "items": [
            {
              "at": 0,
              "text": "真实的值，可观察的结果"
            },
            {
              "at": 1,
              "text": "原子性 · 独立 · 可重复 · 具体 · 可追溯"
            },
            {
              "at": 2,
              "text": "下一步：选择要写哪些用例",
              "dim": true
            }
          ]
        }
      ]
    }
  ]
});
