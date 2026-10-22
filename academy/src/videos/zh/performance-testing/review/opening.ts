import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "总结",
  scenes: [
    {
      label: "引言",
      cues: ["前两章各自深入讲解了一类测试。这一章退后一步，把性能测试变成日常流程。"],
      panes: [{ type: "title", kicker: "第 4 章 · 开篇", heading: "总结", sub: "让它成为日常流程", subAt: 0.4 }],
    },
    {
      label: "你现在的位置",
      cues: [
        "现在，Larkspur 每页只执行 1 次查询，而不是 101 次；多了两个新索引；店面体积只有原来的二十分之一；推荐接口的吞吐量提高到了 12 倍。",
        "这一章确保下一次改动不会悄悄抵消这些成果。",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "1", label: "次查询每页", tone: "good" },
          { at: 0.3, value: "2", label: "个新索引", tone: "good" },
          { at: 0.5, value: "1/20", label: "的页面体积", tone: "good" },
          { at: 0.7, value: "12×", label: "推荐接口吞吐量", tone: "good" },
        ],
      }],
    },
    {
      label: "你将收获什么",
      cues: [
        "你会决定哪些检查在每个拉取请求上运行，哪些在发布前运行，哪些在生产环境中运行。",
        "你会把静态门禁和一个简短的负载测试接入 CI 工作流。",
        "你会写出一份别人能据此行动、也能重复的性能报告。",
        "最后，你会在一处回顾整门课程。",
      ],
      panes: [{
        type: "bullets", lead: "你将收获什么",
        items: [
          { at: 0, text: "什么在哪里运行" },
          { at: 1, text: "CI 中的门禁" },
          { at: 2, text: "能据此行动的报告" },
          { at: 3, text: "课程回顾" },
        ],
      }],
    },
  ],
});
