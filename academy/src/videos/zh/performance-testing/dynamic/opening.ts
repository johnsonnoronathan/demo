import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "动态测试",
  scenes: [
    {
      label: "引言",
      cues: ["第二章通过阅读发现问题。第三章则通过运行来发现问题：像手机那样加载页面，再给应用发送一个繁忙夜晚的流量。"],
      panes: [{ type: "title", kicker: "第 3 章 · 开篇", heading: "动态测试", sub: "运行它，加压它，测量它。", subAt: 0.4 }],
    },
    {
      label: "你将学到什么",
      cues: [
        "你会用 Lighthouse 在实验室里测量页面加载，并读懂这些数字对手机用户意味着什么。",
        "你会用 k6 编写负载测试，让阈值来判断应用是否满足预算。",
        "你会超出预期负载去找出应用的容量，并检查它能否扛住突发流量。",
        "你还会在负载下分析应用、阅读火焰图，并用数字证明修复有效。",
      ],
      panes: [{
        type: "bullets", lead: "你将学到什么",
        items: [
          { at: 0, text: "用 Lighthouse 在实验室测量页面加载" },
          { at: 1, text: "用 k6 和阈值做负载测试" },
          { at: 2, text: "压力、峰值与浸泡测试" },
          { at: 3, text: "性能分析与火焰图" },
        ],
      }],
    },
    {
      label: "开始之前",
      cues: [
        "你需要 k6，一个免费的负载测试工具。如果装不了，每个练习也都可以用练习应用自带的负载工具完成。",
        "另外，要在空闲的机器上运行测试。来自繁忙笔记本电脑或两台不同机器的数字，是没有可比性的。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ brew install k6        # or winget install k6", kind: "cmd" },
          { at: 0.4, text: "$ k6 version", kind: "cmd" },
          { at: 0.6, text: "k6 v1.3.0", kind: "pass" },
          { at: 0.8, text: "$ npm run load -- --help   # the built-in fallback", kind: "dim" },
        ],
      }],
    },
  ],
});
