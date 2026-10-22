import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "静态测试",
  scenes: [
    {
      label: "简介",
      cues: ["第二章讲的是你能做的最便宜的性能测试：那些根本不用启动代码的测试。"],
      panes: [{ type: "title", kicker: "第 2 章 · 开篇", heading: "静态测试", sub: "在运行任何东西之前发现问题", subAt: 0.4 }],
    },
    {
      label: "你将收获什么",
      cues: [
        "学完本章，你能把预算变成一项会让构建失败的检查，",
        "用 linter 和肉眼发现 N+1 查询模式，",
        "读懂查询计划，并用索引修复全表扫描，",
        "还能找出让页面变重的原因，把它压到预算以下。",
      ],
      panes: [{
        type: "bullets", lead: "你将收获什么",
        items: [
          { at: 0, text: "能让构建通过或失败的预算" },
          { at: 1, text: "发现并消除 N+1 查询" },
          { at: 2, text: "读懂并修复查询计划" },
          { at: 3, text: "体积在预算之内的页面" },
        ],
      }],
    },
    {
      label: "你的工具",
      cues: [
        "你会用到三个随练习应用提供的工具，都不需要服务器。",
        "代价是：静态检查只能发现看起来慢的东西，却说不出在负载下到底有多慢。那是第三章的任务。",
      ],
      panes: [{
        type: "table", cols: ["工具", "读取内容", "课"], widths: ["36%", "46%", "18%"],
        rows: [
          { at: 0.2, cells: ["npm run budget", "资源大小对照 budget.json", "2.1、2.4"] },
          { at: 0.4, cells: ["npm run lint:queries", "执行查询的循环", "2.2"] },
          { at: 0.6, cells: ["npm run explain", "SQLite 的查询计划", "2.3"] },
        ],
      }],
    },
  ],
});
