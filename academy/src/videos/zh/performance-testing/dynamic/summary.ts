import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "动态测试：小结",
  scenes: [
    {
      label: "回顾",
      cues: ["来看看运行应用让你学到了哪些仅靠阅读学不到的东西。"],
      panes: [{ type: "title", kicker: "第 3 章 · 小结", heading: "运行发现了什么" }],
    },
    {
      label: "结果",
      cues: [
        "Lighthouse 证实了资源修复的效果：得分从 64 升到 100，主图现在 1.5 秒就出现，而不是 10 秒。",
        "负载测试证实了查询修复的效果：50 个顾客时，每个阈值都通过了。",
        "而压力测试和性能分析发现了一个任何静态规则都描述不了的问题。修复它让吞吐量提升到了十二倍。",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "64 → 100", label: "Lighthouse 得分", tone: "good" },
          { at: 0.4, value: "9.8 → 1.5 s", label: "最大内容绘制", tone: "good" },
          { at: 1.1, value: "4 / 4", label: "50 个用户时通过的阈值", tone: "good" },
          { at: 2.1, value: "57 → 699", label: "推荐接口 req/s", tone: "good" },
        ],
      }],
    },
    {
      label: "相辅相成",
      cues: [
        "静态测试发现了三个问题，并预测了它们的代价。",
        "动态测试证实了这些预测，还发现了静态测试看不到的那个问题。",
        "两者单独使用都无法发现所有问题。第四章会把它们变成日常流程。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "静态测试做出预测", sub: "N+1、全表扫描、过重的资源" },
          { at: 1, text: "动态测试加以证实，并发现更多", sub: "CPU 热点路径" },
          { at: 2, text: "下一步：变成日常流程", dim: true },
        ],
      }],
    },
  ],
});
