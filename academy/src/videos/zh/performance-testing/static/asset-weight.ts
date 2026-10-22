import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "资源体积",
  scenes: [
    {
      label: "简介",
      cues: ["预算检查说店面超标了。现在来弄清楚，到底是什么让它这么重。"],
      panes: [{ type: "title", kicker: "第 2.4 课 · 静态测试", heading: "资源体积", sub: "称量页面加载的东西", subAt: 0.4 }],
    },
    {
      label: "体积都去哪了",
      cues: [
        "这是店面加载的每个文件，按大小等比例绘制。总共 1,140 KB，而预算是 350 KB。",
        "两个文件几乎占了全部：一张按相机原尺寸保存的首图，以及一个打包了 420 种语言区域的日期库，而商店只用一种。",
        "换成 1200 像素导出的图片，以及只含英语的库文件。",
        "从 1,140 KB 降到 59 KB。顾客看到的页面完全一样。",
      ],
      panes: [{ type: "concept", scene: "asset-treemap" }],
    },
    {
      label: "阻塞渲染的脚本",
      cues: [
        "HTML 里还有第二个问题。head 中的普通 script 标签会让页面停止渲染，直到脚本下载并执行完毕。",
        "加上 defer，并换用只含英语的文件。浏览器会先渲染，之后再按顺序执行脚本。",
        "然后把图片指向更小的导出文件，并加上宽和高。",
      ],
      panes: [{
        type: "code", file: "public/index.html", lang: "text", typeTo: -1,
        code: `<head>
  <link rel="stylesheet" href="/styles.css">
  <script src="/vendor/datefmt-all-locales.js"></script>
  <script src="/app.js"></script>
</head>
<body>
  <img src="/hero.jpg" alt="Shelves of books">`,
        highlights: [
          { at: 0.2, until: 1, lines: [3, 4], note: "阻塞渲染", bad: true },
          { at: 1, until: 2, lines: [3, 4], good: true },
          { at: 2, until: 3.1, lines: [7], good: true },
        ],
        swaps: [
          { at: 1.1, line: 3, text: `  <script src="/vendor/datefmt-en.js" defer></script>` },
          { at: 1.3, line: 4, text: `  <script src="/app.js" defer></script>` },
          { at: 2.1, line: 7, text: `  <img src="/hero-1200.jpg" width="1200" height="600" alt="…">` },
        ],
      }],
    },
    {
      label: "再检查一次",
      cues: ["再次运行预算检查。59 KB，所有预算都达标，而顾客看到的没有任何变化。"],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.05, text: "$ npm run budget", kind: "cmd" },
          { at: 0.2, text: "script         0.9      50   pass", kind: "pass" },
          { at: 0.3, text: "stylesheet     0.5      20   pass", kind: "pass" },
          { at: 0.4, text: "image         57.6     250   pass", kind: "pass" },
          { at: 0.5, text: "total         59.0     350   pass", kind: "pass" },
          { at: 0.7, text: "All budgets met.", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
