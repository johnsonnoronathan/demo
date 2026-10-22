import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "概述：小结",
  scenes: [
    {
      label: "回顾",
      cues: ["下面用四点回顾第 1 章的内容。"],
      panes: [{ type: "title", kicker: "第 1 章 · 小结", heading: "概述四要点" }],
    },
    {
      label: "要点",
      cues: [
        "每次性能测试都会报告延迟、吞吐量和错误率。",
        "延迟是一个分布，所以我们报告百分位数，绝不用平均值。",
        "静态测试阅读你构建的东西，动态测试运行它并进行测量。",
        "好的计划从具体的问题开始，每个问题都有一个要达到的数字。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "延迟、吞吐量、错误率" },
          { at: 1, text: "用百分位数，不用平均值" },
          { at: 2, text: "静态靠读，动态靠跑" },
          { at: 3, text: "先定问题，再选工具" },
        ],
      }],
    },
    {
      label: "下一章",
      cues: [
        "接下来是静态测试：成本最低的一类测试。",
        "你会在完全不启动应用的情况下，找出 Larkspur 的三个问题。",
      ],
      panes: [{
        type: "bullets", lead: "下一章 · 第 2 章",
        items: [
          { at: 0.2, text: "会让构建失败的预算" },
          { at: 0.4, text: "N+1 查询" },
          { at: 0.6, text: "查询计划" },
          { at: 0.8, text: "资源体积" },
        ],
      }],
    },
  ],
});
