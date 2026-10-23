import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "静态测试：小结",
  scenes: [
    {
      label: "回顾",
      cues: ["没有产生任何流量，你就发现并修复了三个问题。"],
      panes: [{ type: "title", kicker: "第 2 章 · 小结", heading: "靠阅读发现了什么" }],
    },
    {
      label: "成果",
      cues: [
        "每页 101 次查询变成了 1 次。",
        "两次全表扫描变成了索引查找。",
        "店面从超过 1 MB 降到了 59 KB。每项检查只花了几秒。",
      ],
      panes: [{
        type: "stats",
        items: [
          { at: 0.1, value: "101 → 1", label: "每页查询次数", tone: "good" },
          { at: 1.1, value: "2 → 0", label: "全表扫描", tone: "good" },
          { at: 2.1, value: "1,140 → 59 KB", label: "页面体积", tone: "good" },
          { at: 2.6, value: "几秒", label: "每项检查，无需服务器", tone: "accent" },
        ],
      }],
    },
    {
      label: "局限",
      cues: [
        "但每一次修复都来自已知的模式。这些检查都没有告诉你，有 50 位顾客同时购物时应用表现如何，",
        "手机要白屏多久，或者处理器在忙什么。",
        "还有一个接口，recommendations，没有触发任何警告。它照样很慢。这就是第三章的内容。",
      ],
      panes: [{
        type: "bullets", lead: "静态测试无法告诉你的",
        items: [
          { at: 0, text: "负载下到底有多慢" },
          { at: 1, text: "手机上实际看到什么" },
          { at: 2, text: "没有规则能描述的问题" },
        ],
      }],
    },
  ],
});
