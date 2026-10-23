import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "性能测试工作流程",
  scenes: [
    {
      label: "引言",
      cues: ["到目前为止，一切都是手工完成的，而且只做了一次。真实的代码库每天都在变化。那么，每项检查应该在哪里运行？"],
      panes: [{ type: "title", kicker: "第 4.1 课 · 总结", heading: "性能测试工作流程", sub: "快速反馈优先", subAt: 0.4 }],
    },
    {
      label: "流水线",
      cues: [
        "每个拉取请求先运行静态检查：资源预算、查询检查和查询计划。只需几秒钟。",
        "然后改动被构建并部署到预发布环境，在那里运行 Lighthouse 和一个简短的 k6 负载测试。",
        "一旦有阈值未达标，发布就会被拦下，失败信息里带着解释原因的数字。",
        "修复之后，改动才会上线。生产环境监控关注同样的指标，并为下一轮预算提供依据。",
      ],
      panes: [{ type: "concept", scene: "pipeline" }],
    },
    {
      label: "什么在哪里运行",
      cues: [
        "原则是快速反馈优先。在拉取请求上 4 秒内就失败的门禁，作者几乎不费成本就能修复。",
        "长时间的压力测试和浸泡测试应该按计划，在稳定的环境中定期运行，而不是每次改动都跑。",
      ],
      panes: [{
        type: "table", cols: ["阶段", "运行内容", "耗时"], widths: ["30%", "48%", "22%"],
        rows: [
          { at: 0.1, cells: ["每个拉取请求", "预算 · 查询检查 · 查询计划", "几秒"] },
          { at: 0.4, cells: ["发布前", "Lighthouse · 简短的 k6 测试", "几分钟"] },
          { at: 1, cells: ["定期运行", "压力 · 峰值 · 浸泡", "几小时"] },
          { at: 1.4, cells: ["生产环境", "真实用户监控", "持续"] },
        ],
      }],
    },
    {
      label: "门禁实战",
      cues: [
        "在练习中，你会故意撤销自己的一项修复。",
        "静态门禁几秒钟就能发现它，并指出造成问题的文件和体积。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run check:static", kind: "cmd" },
          { at: 1, text: "script        96.2      50   FAIL  (+46.2 KB)", kind: "fail" },
          { at: 1.2, text: "image         57.6     250   pass", kind: "pass" },
          { at: 1.4, text: "1 budget(s) exceeded.", kind: "sum-fail" },
          { at: 1.6, text: "exit code 1 · pull request blocked", kind: "fail-dim" },
        ],
      }],
    },
  ],
});
