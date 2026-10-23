import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "在你自己的项目上做静态测试",
  scenes: [
    {
      label: "引言",
      cues: ["Larkspur 慢得很有教学意义。你自己的项目会以它自己的方式变慢，而要弄清楚是怎么慢的，唯一的办法就是在它上面运行这些检查。"],
      panes: [{ type: "title", kicker: "第 4.4 课 · 总结", heading: "在你自己的项目上做静态测试", sub: "你来测量，智能体来修复", subAt: 0.4 }],
    },
    {
      label: "为什么要亲自运行",
      cues: [
        "智能体可以运行本课中的每一条命令。那为什么还要亲自运行？",
        "因为阅读真实的输出就是这项技能本身。看过自己代码的数字，你才知道什么是正常的。",
        "因为一个数字是否可以接受取决于你的用户，这由你来判断。",
        "还因为当智能体之后说已经修好了，你的运行结果就是证据。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 1, text: "阅读真实的输出就是这项技能" },
          { at: 2, text: "决定权在你" },
          { at: 3, text: "你的运行结果就是证据" },
        ],
      }],
    },
    {
      label: "四个问题",
      cues: [
        "第 2 章的四个静态问题几乎适用于任何技术栈。我们交付的内容有多重？",
        "一个请求执行多少次查询？这个数字会随页面大小增长吗？",
        "每条热点查询是使用了索引，还是扫描了一张大表？",
        "还有，是什么阻塞了首次渲染？",
      ],
      panes: [{
        type: "table", cols: ["问题", "在你的技术栈上"], widths: ["40%", "60%"],
        rows: [
          { at: 0.3, cells: ["交付的体积", "生产构建，gzip 压缩后 · size-limit"] },
          { at: 1.2, cells: ["每个请求的查询数", "查询日志 · assertNumQueries · bullet"] },
          { at: 2.2, cells: ["索引还是扫描", "EXPLAIN：Seq Scan · Table scan · SCAN"] },
          { at: 3.2, cells: ["阻塞渲染", "<head> 中没有 defer 的 <script>"] },
        ],
      }],
    },
    {
      label: "基线",
      cues: [
        "选一个用户旅程：用户最常进入的页面，以及它发出的调用。",
        "称量生产构建，而不是开发构建。统计一个请求的查询数，再统计一个两倍长的页面的查询数。",
        "Explain 最主要的查询，每次都用同一张表把结果全部记下来。这就是你的基线。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.2, text: "$ npm run build", kind: "cmd" },
          { at: 1, text: "$ find dist -name '*.js' … | gzip -c | wc -c", kind: "cmd" },
          { at: 1.3, text: "   412.0 KB  dist/assets/index-8f2c.js", kind: "fail-dim" },
          { at: 1.5, text: "    18.4 KB  dist/assets/index-1b9e.css", kind: "dim" },
          { at: 2, text: "# write it down: perf/baseline.md", kind: "out" },
        ],
      }],
    },
    {
      label: "读懂数字",
      cues: [
        "真实的输出比 Larkspur 的噪声更大。增长比大小更重要：页面翻倍时查询数也翻倍，那就是 N+1。",
        "只有大表上的扫描才要紧。扫描一张四十行的查找表很正常。",
        "最初的预算要设在略高于当前数字的位置，让门禁现在能通过，并能捕获下一次性能退化。",
      ],
      panes: [{
        type: "bullets",
        items: [
          { at: 0, text: "增长比大小更重要", sub: "随页面增长的查询就是 N+1" },
          { at: 1, text: "大表上的扫描才要紧", sub: "40 行的查找表上不算" },
          { at: 2, text: "最初的预算：略高于当前", sub: "随着修复落地再收紧" },
        ],
      }],
    },
    {
      label: "交给智能体",
      cues: [
        "两段智能体提示词完成剩下的工作。第一段把四项检查对应到你的技术栈上，写成由你亲自运行的命令。",
        "第二段在一个新分支上修复一条发现，并添加一道门禁，问题再出现时就会失败。",
        "然后你亲自重新运行检查，故意弄坏修复来看门禁失败，并像审查其他任何改动一样审查这个分支。",
      ],
      panes: [{
        type: "bullets", check: true,
        items: [
          { at: 0, text: "智能体：写出 perf/STATIC-CHECKS.md", sub: "适合你的技术栈的命令 · 不改代码" },
          { at: 0.6, text: "你：运行它们，填写 perf/baseline.md", sub: "设定预算，给发现排序" },
          { at: 1, text: "智能体：修复一条发现，添加一道门禁", sub: "新分支 · 预算保持不变" },
          { at: 2, text: "你：重新运行，故意弄坏，审查", sub: "你的数字才算数" },
        ],
      }],
    },
  ],
});
