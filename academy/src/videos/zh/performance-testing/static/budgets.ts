import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "性能预算",
  scenes: [
    {
      label: "简介",
      cues: ["“让它快一点”不是任何人能测试的需求。性能预算才是。"],
      panes: [{ type: "title", kicker: "第 2.1 课 · 静态测试", heading: "性能预算", sub: "测量之前先约定上限", subAt: 0.4 }],
    },
    {
      label: "预算如何运作",
      cues: [
        "预算是团队在测量之前约定的上限。对 Larkspur 来说：脚本 50 KB，图片 250 KB，总计 350 KB。",
        "然后用当前构建对照每一项上限进行测量。",
        "超过上限的项就失败。Larkspur 在脚本、图片和总体积上都超了。",
        "预算失败是一个清晰的信号。退出码为 1，它就能直接拦下拉取请求，而不是引发一场争论。",
      ],
      panes: [{ type: "concept", scene: "budgets" }],
    },
    {
      label: "三种预算",
      cues: [
        "预算分三种。数量预算，比如 KB 数或每个请求的查询次数，可以在每次改动时静态检查。",
        "时间预算，比如 p95 或最大内容绘制，需要动态测试。",
        "先从用户的需要出发，再参考你现在的水平，随着改进逐步收紧预算。",
      ],
      panes: [{
        type: "table", cols: ["种类", "示例", "如何检查"], widths: ["22%", "50%", "28%"],
        rows: [
          { at: 0.1, cells: ["数量", "JS ≤ 50 KB · 每个请求 ≤ 5 次查询", { chip: "yes", text: "静态" }] },
          { at: 1, cells: ["时间", "p95 ≤ 300 ms · LCP ≤ 2.5 s", { chip: "warn", text: "动态" }] },
          { at: 1.4, cells: ["规则", "Lighthouse 得分 ≥ 90", { chip: "warn", text: "动态" }] },
        ],
      }],
    },
    {
      label: "运行检查",
      cues: [
        "在练习中，你会运行预算检查，看清到底是哪些文件让页面超标。",
        "几乎全部来自两个文件。第 2.4 课会修复它们。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run budget", kind: "cmd" },
          { at: 0.3, text: "budget      actual   limit   result", kind: "dim" },
          { at: 0.4, text: "script        96.2      50   FAIL  (+46.2 KB)", kind: "fail" },
          { at: 0.5, text: "stylesheet     0.5      20   pass", kind: "pass" },
          { at: 0.6, text: "image       1043.1     250   FAIL  (+793.1 KB)", kind: "fail" },
          { at: 0.7, text: "total       1139.8     350   FAIL  (+789.8 KB)", kind: "fail" },
          { at: 0.9, text: "3 budget(s) exceeded.", kind: "sum-fail" },
        ],
      }],
    },
  ],
});
