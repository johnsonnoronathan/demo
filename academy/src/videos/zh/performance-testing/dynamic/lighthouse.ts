import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "用 Lighthouse 做实验室测量",
  scenes: [
    {
      label: "引言",
      cues: ["预算检查预测页面会轻很多。Lighthouse 测量的是，这对拿着手机的人究竟意味着什么。"],
      panes: [{ type: "title", kicker: "第 3.1 课 · 动态测试", heading: "用 Lighthouse 做实验室测量", sub: "手机看到了什么", subAt: 0.4 }],
    },
    {
      label: "观察页面加载",
      cues: [
        "Lighthouse 在一台使用慢速网络的模拟中端手机上加载页面，并把过程录下来。",
        "首次内容绘制在 4.3 秒：在那之前屏幕一片空白，因为一个 600 KB 的脚本阻塞了渲染。",
        "最大内容绘制在 9.8 秒，这时那张 1 MB 的图片终于显示出来。得分是 64。",
        "完成第二章的资源修复之后：首次绘制在 0.8 秒，主图在 1.5 秒。得分是 100。",
      ],
      panes: [{ type: "concept", scene: "filmstrip" }],
    },
    {
      label: "四项指标",
      cues: [
        "最重要的有四项指标。首次内容绘制，是任何内容出现的时刻。最大内容绘制，是主要内容出现的时刻。",
        "总阻塞时间，是脚本让页面无法响应的时长。还有累积布局偏移，是页面加载时跳动的程度。",
      ],
      panes: [{
        type: "table", cols: ["指标", "它标记的时刻", "良好"], widths: ["18%", "60%", "22%"],
        rows: [
          { at: 0.1, cells: ["FCP", "第一段文字或第一张图片出现", "≤ 1.8 s"] },
          { at: 0.5, cells: ["LCP", "主图或主标题出现", "≤ 2.5 s"] },
          { at: 1.1, cells: ["TBT", "脚本阻塞输入", "≤ 200 ms"] },
          { at: 1.5, cells: ["CLS", "布局发生跳动", "≤ 0.1"] },
        ],
      }],
    },
    {
      label: "修复前后",
      cues: [
        "在练习中，你会先测量原始页面的冻结副本，再测量修复后的店面。",
        "记住，实验室数字是用来比较构建的。真实用户的体验属于现场数据，它随每部手机、每种网络而变化。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npx lighthouse@12 localhost:3000/before.html --only-categories=performance", kind: "cmd" },
          { at: 0.4, text: "Performance 64 · FCP 4.3 s · LCP 9.8 s · 1,645 KiB", kind: "fail" },
          { at: 0.6, text: "$ npx lighthouse@12 localhost:3000/ --only-categories=performance", kind: "cmd" },
          { at: 0.9, text: "Performance 100 · FCP 0.8 s · LCP 1.5 s · 68 KiB", kind: "pass" },
        ],
      }],
    },
  ],
});
