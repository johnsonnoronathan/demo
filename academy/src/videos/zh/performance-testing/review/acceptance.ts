import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "性能验收",
  scenes: [
    {
      label: "引言",
      cues: ["发现并修复问题还不是终点。一次发布需要一个决定：放行，还是不放行。这就是验收。"],
      panes: [{ type: "title", kicker: "第 4.3 课 · 总结", heading: "性能验收", sub: "从测量结果到决定", subAt: 0.4 }],
    },
    {
      label: "方法",
      cues: [
        "这门课的每一节课都是同一个方法中的一步。首先，提出测试必须回答的问题。",
        "在测量之前设定预算。它们会成为验收标准。",
        "建立基线，然后测试：先做静态检查，再做实验室测试和负载测试。",
        "一次只修复一个原因。这一步可以交给智能体。",
        "亲自重新运行同样的测试来验证。然后验收、报告，再用门禁守护成果。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "提问", sub: "问题和用户旅程 · 你" },
          { at: 1, text: "设定预算", sub: "在测量之前商定 · 你和团队" },
          { at: 2, text: "建立基线，然后测试", sub: "先静态，后动态 · 你" },
          { at: 3, text: "修复", sub: "一次一个原因 · 智能体" },
          { at: 4, text: "验证、验收、守护", sub: "同样的测试，你的运行，你的决定" },
        ],
      }],
    },
    {
      label: "验收标准",
      cues: [
        "验收标准就是带上条件的预算。不是说：API 应该很快。",
        "而是：在 50 个用户下，图书接口的 p95 不超过 300 毫秒，错误率低于百分之一，用 npm run accept 测量。",
        "它可以测量，写明了条件，在测试之前商定，并且能追溯到一项预算。",
      ],
      panes: [{
        type: "table", cols: ["ID", "标准", "限制"], widths: ["12%", "60%", "28%"],
        rows: [
          { at: 1, cells: ["S1–S3", "静态门禁：预算、查询检查、查询计划", "exit 0"] },
          { at: 1.3, cells: ["D1", "50 个用户下 /api/books 的 p95", "≤ 300 ms"] },
          { at: 1.5, cells: ["D2", "50 个用户下 /api/orders 的 p95", "≤ 200 ms"] },
          { at: 1.7, cells: ["D3", "/api/recommendations 的 p95", "≤ 400 ms"] },
          { at: 1.9, cells: ["D4", "错误率，所有请求", "< 1 %"] },
          { at: 2.2, cells: ["M1、M2", "LCP 和得分，Lighthouse", "≤ 2.5 s · ≥ 90"] },
        ],
      }],
    },
    {
      label: "准入与退出",
      cues: [
        "准入标准决定一次运行是否算数：正确的构建、已填充的数据、一台空闲的机器。少了一条，这次运行就是无效的，而不是失败的。",
        "退出标准决定何时完成：每一条标准都通过，或者有已签字的豁免，并且记录已经保存。",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "准入：这次运行算数吗？", sub: "正确的提交 · 已填充数据 · 应用已预热 · 机器空闲" },
          { at: 1, text: "退出：完成了吗？", sub: "全部通过，或有书面豁免 · 记录已保存" },
        ],
      }],
    },
    {
      label: "修复前",
      cues: [
        "这是在课程开始之前的 Larkspur 上运行的验收测试。",
        "三道静态门禁全部失败。在 50 个用户下，图书接口的 p95 超过了 13 秒。",
        "七条自动化标准中有六条失败。结论：拒绝，退出码为 1。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run accept", kind: "cmd" },
          { at: 1, text: "S1   FAIL   exit 1   asset budget", kind: "fail" },
          { at: 1.1, text: "S2   FAIL   exit 1   no queries inside loops", kind: "fail" },
          { at: 1.2, text: "S3   FAIL   exit 1   no full scans", kind: "fail" },
          { at: 1.4, text: "D1   FAIL   13246 ms   ≤ 300 ms   /api/books", kind: "fail" },
          { at: 1.6, text: "D2   FAIL     797 ms   ≤ 200 ms   /api/orders", kind: "fail" },
          { at: 1.8, text: "D3   FAIL    1109 ms   ≤ 400 ms   /api/recommendations", kind: "fail" },
          { at: 1.9, text: "D4   PASS    0.00 %    < 1 %      error rate", kind: "pass" },
          { at: 2.2, text: "REJECT: 6 of 7 automated criteria failed.", kind: "sum-fail" },
        ],
      }],
    },
    {
      label: "修复后",
      cues: [
        "经过第 2 章和第 3 章的四项修复之后：同样的命令，同一台机器。",
        "每一道门禁都通过了。图书接口降到了 64 毫秒，订单 17 毫秒，推荐 125 毫秒。",
        "推荐接口通过了，但它离限制最近。即使通过了，这一点也要写进报告。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run accept", kind: "cmd" },
          { at: 1, text: "S1–S3  PASS   exit 0   static gates", kind: "pass" },
          { at: 1.3, text: "D1   PASS     64 ms   ≤ 300 ms   /api/books", kind: "pass" },
          { at: 1.5, text: "D2   PASS     17 ms   ≤ 200 ms   /api/orders", kind: "pass" },
          { at: 1.7, text: "D3   PASS    125 ms   ≤ 400 ms   /api/recommendations", kind: "pass" },
          { at: 1.8, text: "D4   PASS   0.00 %    < 1 %      error rate", kind: "pass" },
          { at: 2, text: "ACCEPT: all 7 automated criteria passed.", kind: "sum-pass" },
        ],
      }],
    },
    {
      label: "放行还是不放行",
      cues: [
        "如果每一条标准都通过，就放行。在记录上签字。",
        "如果有任何一条失败，就不放行。修复它，然后重新运行整个测试。",
        "如果发布不能等，可以由一位具名的人签署豁免，并注明到期日期和后续跟进。",
        "还有，绝不为了让一次运行通过而放宽限制。修改标准是一个单独的决定，留给下一次运行。",
      ],
      panes: [{
        type: "table", cols: ["结果", "决定"], widths: ["45%", "55%"],
        rows: [
          { at: 0.1, cells: ["每一条标准都通过", { chip: "pass", text: "放行" }] },
          { at: 1, cells: ["有一条标准失败", { chip: "fail", text: "不放行" }] },
          { at: 2, cells: ["失败，但发布不能等", { chip: "warn", text: "豁免" }] },
          { at: 3, cells: ["放宽限制以求通过", { chip: "no", text: "绝不" }] },
        ],
      }],
    },
    {
      label: "轮到你了",
      cues: [
        "在练习中，你亲自运行验收测试。如果有任何失败，由智能体来修复，而且不能改动限制。",
        "然后你重新运行它，记录 Lighthouse 的结果，并做出决定：放行，还是不放行。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "你运行 npm run accept", sub: "并阅读每一行" },
          { at: 0.5, text: "智能体修复失败项", sub: "限制保持不变" },
          { at: 1, text: "你重新运行，记录 M1 和 M2，并签字", sub: "notes/acceptance.md" },
        ],
      }],
    },
  ],
});
