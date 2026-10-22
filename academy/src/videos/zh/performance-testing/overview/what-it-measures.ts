import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "性能测试测量什么",
  scenes: [
    {
      label: "引言",
      cues: ["无论用什么工具，性能测试都会报告三个数字。我们来认识一下它们。"],
      panes: [{ type: "title", kicker: "第 1.1 课 · 概述", heading: "性能测试测量什么", sub: "延迟 · 吞吐量 · 错误", subAt: 0.4 }],
    },
    {
      label: "三个数字",
      cues: [
        "延迟：一个请求要花多长时间，单位是毫秒。",
        "吞吐量：每秒能完成多少个请求。",
        "还有错误率：失败或超时的请求所占的比例。",
        "这三个数字会一起变化。当系统接近极限时，吞吐量不再上升，延迟开始攀升，紧接着就会出现错误。",
      ],
      panes: [{
        type: "bullets", lead: "每次测试都会报告",
        items: [
          { at: 0, text: "延迟", sub: "一个请求花费的时间 · ms" },
          { at: 1, text: "吞吐量", sub: "每秒完成的请求数 · req/s" },
          { at: 2, text: "错误率", sub: "失败或超时的比例 · %" },
        ],
      }],
    },
    {
      label: "百分位数",
      cues: [
        "把同一个请求发送 400 次，你会得到 400 个不同的耗时。",
        "按耗时堆叠起来，它们会形成一个驼峰，右侧拖着一条由慢请求组成的长尾。",
        "中位数，也就是 p50，代表典型请求。一半比它快，一半比它慢。",
        "p95 和 p99 描述的是长尾。每二十个用户中，就有一个要等待至少 p95 那么久。",
        "平均值落在中间，却不对应任何真实的请求。所以预算和阈值都使用百分位数。",
      ],
      panes: [{ type: "concept", scene: "percentiles" }],
    },
    {
      label: "第一次测量",
      cues: [
        "在练习中，你会启动练习应用，请求一页图书。响应显示它执行了 101 次数据库查询。",
        "然后给它施加轻量负载：10 个虚拟用户，持续 20 秒。",
        "在我们的机器上，结果是每秒 16 个请求，p95 超过 1 秒。把它连同你运行的命令一起记下来，这就是你的基线。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ curl -s -i localhost:3000/api/books | head -4", kind: "cmd" },
          { at: 0.4, text: "HTTP/1.1 200 OK", kind: "out" },
          { at: 0.5, text: "x-query-count: 101", kind: "fail" },
          { at: 0.6, text: "server-timing: app;dur=60.4", kind: "out" },
          { at: 1.1, text: "$ npm run load -- --url …/api/books --vus 10 --duration 20", kind: "cmd" },
          { at: 1.6, text: "  vus  secs  requests   rps   p50 ms  p95 ms  p99 ms  errors", kind: "dim" },
          { at: 2.0, text: "   10    20       320  16.0      573    1320    2965       0", kind: "out" },
          { at: 2.4, text: "baseline saved to notes/perf-baseline.md", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
