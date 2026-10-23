import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "课程总结",
  scenes: [
    {
      label: "回顾",
      cues: ["你从一个缓慢的书店和一句含糊的抱怨开始。来看看你现在能做什么。"],
      panes: [{ type: "title", kicker: "课程总结", heading: "性能测试全景回顾" }],
    },
    {
      label: "四个章节",
      cues: [
        "你会测量：用百分位数表示延迟，还有吞吐量和错误，并围绕具体问题写出计划。",
        "你会通过阅读发现性能问题：预算、N+1 查询、查询计划和资源体积，几秒钟就能完成，而且不需要服务器。",
        "你会运行并测量：Lighthouse，负载、压力、峰值和浸泡测试，以及能指出慢代码的性能分析。",
        "你还能把它变成日常流程：CI 中的门禁，以及一份解释每项改动的报告。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "测量", sub: "百分位数、吞吐量、错误、计划" },
          { at: 1, text: "阅读", sub: "预算、N+1、查询计划、资源体积" },
          { at: 2, text: "运行", sub: "Lighthouse、k6、性能分析" },
          { at: 3, text: "日常流程", sub: "CI 门禁和报告" },
        ],
      }],
    },
    {
      label: "你的下一步",
      cues: [
        "挑一个你正在开发的应用，像第 1.2 课那样，为它写一份一页纸的计划。",
        "然后在这周加上一道静态门禁和一个动态测试。去找出慢在哪里吧。",
      ],
      panes: [{ type: "title", kicker: "你的下一步", heading: "去找出慢在哪里。", sub: "一份计划 · 一道门禁 · 一个测试", subAt: 1 }],
    },
  ],
});
