import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "报告结果",
  scenes: [
    {
      label: "引言",
      cues: ["只有当有人能据此行动时，一次性能测试才算完成。这需要一份报告：简短、结构可预期，每个数字都有任何人都能重新运行的测试作为支撑。"],
      panes: [{ type: "title", kicker: "第 4.2 课 · 总结", heading: "报告结果", sub: "让人信得过的数字", subAt: 0.4 }],
    },
    {
      label: "课程带来了哪些改变",
      cues: [
        "这是 Larkspur 最初的测量结果，每一项都来自一次可以重复的运行。",
        "静态修复之后：1 次查询代替 101 次，两个索引，更轻的资源。",
        "动态修复之后：图书标签只解析一次，而不是每个请求都解析。",
        "每个结果都注明了产生它的测试。正是这一点让报告可信。",
      ],
      panes: [{ type: "concept", scene: "before-after" }],
    },
    {
      label: "报告的结构",
      cues: [
        "先写摘要，回答测试要回答的问题。",
        "然后是测试环境，让任何人都能重复；再是结果：修复前后，同样的测试，同一台机器。",
        "接着每个问题写一条发现，说明测试的局限，以及下一步。",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "摘要", sub: "用两句话给出答案" },
          { at: 1, text: "测试环境", sub: "机器、工具、命令" },
          { at: 1.4, text: "结果", sub: "修复前后，百分位数和错误率" },
          { at: 2, text: "发现", sub: "原因、影响、修复、证据" },
          { at: 2.3, text: "局限与下一步" },
        ],
      }],
    },
    {
      label: "一条好的发现",
      cues: [
        "一条发现就是一个小小的论证：原因，以及它的确切位置；",
        "用户的感受，并附上测量数字；",
        "修复方法，以及别人可以核实的证据。",
      ],
      panes: [{
        type: "card", focus: true, id: "发现 1", title: "/api/books 中的 N+1 查询", titleAt: 0,
        fields: [
          { at: 0.3, label: "原因", value: "listBooks 每本书执行 2 次查询，每页共 101 次（books.mjs:11、:13）" },
          { at: 1, label: "影响", value: "50 个用户时 p95 为 1.17 s，预算为 300 ms；拖慢了所有接口" },
          { at: 2, label: "修复", value: "一条联接查询，再为 reviews.book_id 建立索引" },
          { at: 2.4, label: "证据", value: "同一个 k6 测试中 p95 为 10 ms · notes/load-test.md" },
        ],
      }],
    },
  ],
});
