import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "找到瓶颈",
  scenes: [
    {
      label: "引言",
      cues: ["压力测试表明，推荐接口卡在每秒约 58 个请求。现在我们来找出原因。"],
      panes: [{ type: "title", kicker: "第 3.4 课 · 动态测试", heading: "找到瓶颈", sub: "在负载下做性能分析", subAt: 0.4 }],
    },
    {
      label: "什么耗尽了？",
      cues: [
        "先找出是哪种资源耗尽了。在压力测试下，Node 进程占满了一个核心的百分之百。",
        "一个核心被占满，说明代码本身就是限制。该做 CPU 分析了。",
      ],
      panes: [{
        type: "table", cols: ["负载下的症状", "可能的瓶颈"], widths: ["55%", "45%"],
        rows: [
          { at: 0.1, cells: [{ chip: "fail", text: "进程占满一个核心的 100%" }, "你代码中的 CPU"] },
          { at: 0.3, cells: ["CPU 低，延迟高", "在等待别的东西"] },
          { at: 0.5, cells: ["数据库 CPU 高", "查询"] },
          { at: 0.7, cells: ["错误先于延迟上升", "限制：连接数、内存"] },
        ],
        focus: [{ at: 1, until: 2, row: 0 }],
      }],
    },
    {
      label: "阅读火焰图",
      cues: [
        "应用承受负载时，CPU 分析器每秒对调用栈采样大约一千次。",
        "火焰图把这些样本合并起来。宽度是时间占比；每往上一层，就是被下一层调用的函数。",
        "recommend 占了三分之二的样本。在它内部，similarity 和 normalise 在每一次请求中都重新解析每本书的标签。",
        "只解析一次标签并保存下来，热点帧就缩小了。",
      ],
      panes: [{ type: "concept", scene: "flamegraph" }],
    },
    {
      label: "只做一次",
      cues: [
        "修复方法：只加载一次图书目录，把每本书的标签一次性规范化到一个 Set 中，并在每次请求中只规范化一次目标图书的标签。",
        "同一个测试，同一台机器：每秒 57 个请求变成了 699 个。响应完全相同。",
      ],
      panes: [{
        type: "code", file: "src/routes/recommendations.mjs", lang: "js", typeTo: 0.9,
        code: `let cached;
function catalogue() {
  return (cached ??= query("SELECT id, title, tags FROM books").all()
    .map((b) => ({ ...b, tagSet: new Set(normalise(b.tags)) })));
}

const mine = normalise(target.tags); // 每次请求一次
const scored = catalogue()
  .map((b) => ({ id: b.id, score: similarity(mine, b.tagSet) }));`,
        highlights: [{ at: 1, until: 2.2, lines: [1, 2, 3, 4, 7], note: "57 → 699 req/s", good: true }],
      }],
    },
  ],
});
