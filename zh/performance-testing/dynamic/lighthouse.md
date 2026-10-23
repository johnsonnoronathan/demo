# 第 3.1 课: 用 Lighthouse 做实验室测量

性能测试 · 第 3 章: 动态测试 · 25 分钟

> 在模拟手机上加载页面，测量用户在什么时候看到什么。

**学完本课你将能够:**
- 从命令行对本地页面运行 Lighthouse
- 从用户的角度解释 FCP、LCP、Total Blocking Time 和 Cumulative Layout Shift
- 用一次动态的前后对比测量来确认静态修复

## 文字稿: 用 Lighthouse 做实验室测量 (1:11)

**0:00 引言.** 预算检查预测页面会轻很多。Lighthouse 测量的是，这对拿着手机的人究竟意味着什么。

**0:08 观察页面加载.** Lighthouse 在一台使用慢速网络的模拟中端手机上加载页面，并把过程录下来。 首次内容绘制在 4.3 秒：在那之前屏幕一片空白，因为一个 600 KB 的脚本阻塞了渲染。 最大内容绘制在 9.8 秒，这时那张 1 MB 的图片终于显示出来。得分是 64。 完成第二章的资源修复之后：首次绘制在 0.8 秒，主图在 1.5 秒。得分是 100。

**0:35 四项指标.** 最重要的有四项指标。首次内容绘制，是任何内容出现的时刻。最大内容绘制，是主要内容出现的时刻。 总阻塞时间，是脚本让页面无法响应的时长。还有累积布局偏移，是页面加载时跳动的程度。

**0:54 修复前后.** 在练习中，你会先测量原始页面的冻结副本，再测量修复后的店面。 记住，实验室数字是用来比较构建的。真实用户的体验属于现场数据，它随每部手机、每种网络而变化。

## 课文

预算检查说店面页面轻了 20 倍。但那只是预测。Lighthouse 测量的是这对拿着手机的人究竟意味着什么。

## 观察页面加载

Lighthouse 在 Chrome 中打开页面，模拟一台使用慢速 4G 网络的中端手机（CPU 慢 4 倍、约 1.6 Mbit/s、往返 150 ms），录下每一帧，并报告关键时刻发生的时间。

> **概念动画: 观察页面加载**
>
> 1. Lighthouse 在一台模拟的中端手机上、通过慢速网络加载页面，并把过程录下来。
> 2. 首次内容绘制（FCP）在 4.3 秒：第一段文字出现。在此之前屏幕一片空白，因为一个 600 KB 的脚本阻塞了渲染。
> 3. 最大内容绘制（LCP）在 9.8 秒：1 MB 的首图终于显示出来。性能得分：64。
> 4. 修复资源之后，FCP 为 0.8 秒，LCP 为 1.5 秒。得分：100。

| 指标 | 它标记的时刻 | 良好 |
| --- | --- | --- |
| **首次内容绘制**（FCP） | 第一段文字或第一张图片出现 | ≤ 1.8 s |
| **最大内容绘制**（LCP） | 最大的元素出现，通常是主图或主标题 | ≤ 2.5 s |
| **总阻塞时间**（TBT） | 脚本让页面无法响应输入的时长 | ≤ 200 ms |
| **累积布局偏移**（CLS） | 加载过程中布局跳动的程度 | ≤ 0.1 |

LCP、CLS 和一项响应性指标（Interaction to Next Paint）构成了 Google 的 **Core Web Vitals**。0 到 100 的性能得分是各项实验室指标的加权组合。它适合当作标题数字，但预算应该写明具体指标，而不是得分。

## 变化了什么，为什么

| | 修复前 | 修复后 |
| --- | --- | --- |
| 性能得分 | 64 | 100 |
| 首次内容绘制 | 4.3 s | 0.8 s |
| 最大内容绘制 | 9.8 s | 1.5 s |
| 总传输量 | 1,645 KiB | 68 KiB |

每一项改进都能追溯到第 2 章的一个静态发现。FCP 提前，是因为那个 600 KB 的脚本不再阻塞渲染。LCP 提前，是因为首图只有原来的二十分之一大。传输量比预算检查得出的 1,140 KB 还大，是因为练习服务器不压缩响应，浏览器下载的是未压缩的脚本。

## 实验室数据与现场数据

Lighthouse 提供的是**实验室数据**：每次都是同一台模拟设备、同一种网络。正因如此，它很适合比较两个构建。但它并不是真实用户的体验。用户的手机、网络和缓存各不相同，而且他们会与页面交互。**现场数据**（真实用户监控，或公开网站的 Chrome CrUX 报告）才能告诉你这些。用实验室数据发现并验证修复；用现场数据决定修什么。

## 动手练习：在实验室中测量资源修复的效果

**动手练习 · 15 分钟.** 目标： 对冻结的修复前页面和修复后的店面运行 Lighthouse，比较得分、FCP、LCP 和传输大小。

1. 在应用运行时，测量原始页面的冻结副本：

   ```bash
   npx lighthouse@12 http://localhost:3000/before.html --only-categories=performance --view
   ```

   `--view` 会在完成后打开 HTML 报告。

![一份 Lighthouse 报告，橙色的性能得分为 64。指标：首次内容绘制 4.3 秒、最大内容绘制 9.8 秒，均为红色；总阻塞时间 20 毫秒、累积布局偏移 0，均为绿色。下方是一条胶片视图，直到约 4 秒都是空白帧。](screenshot-pending)
*Screenshot (Lighthouse 报告 · before.html): 原始页面：在中端手机上空白超过四秒。*

2. 测量修复后的店面：

   ```bash
   npx lighthouse@12 http://localhost:3000/ --only-categories=performance --view
   ```

![一份 Lighthouse 报告，绿色的性能得分为 100。首次内容绘制 0.8 秒、最大内容绘制 1.5 秒、总阻塞时间 0 毫秒、累积布局偏移 0，全部为绿色。](screenshot-pending)
*Screenshot (Lighthouse 报告 · /): 完成第 2 章的资源修复之后。*

3. 在修复前的报告中打开 **Opportunities**。“Eliminate render-blocking resources”和“Properly size images”正是第 2.4 课的两个静态发现，现在还附上了它们的时间成本。
4. 把两次运行记录到 `notes/lighthouse.md`。每个页面运行两到三次：实验室结果在多次运行之间会略有波动，所以要比较中位数。

**完成标准**
- Both JSON reports exist in notes/
- notes/lighthouse.md has a table with score, FCP, LCP, TBT, CLS and total bytes for both pages

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.1, "Lab measurement with Lighthouse".

Exercise: Measure the asset fixes in the lab
Goal: Run Lighthouse against the frozen before page and the fixed storefront, and compare score, FCP, LCP and transfer size.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Make sure the app is running on port 3000.
2. Run `npx lighthouse@12 http://localhost:3000/before.html --only-categories=performance --output=json --output-path=./notes/lh-before.json --chrome-flags="--headless=new"`. If Chrome isn't found, set CHROME_PATH to a Chrome or Chromium binary and retry; if none exists, stop and report that.
3. Run the same command for http://localhost:3000/ with output `./notes/lh-after.json`.
4. From each JSON file, extract categories.performance.score and the numericValue of first-contentful-paint, largest-contentful-paint, total-blocking-time, cumulative-layout-shift and total-byte-weight.
5. Write a before/after table to `notes/lighthouse.md`.

Done when:
- Both JSON reports exist in notes/
- notes/lighthouse.md has a table with score, FCP, LCP, TBT, CLS and total bytes for both pages

Report back:
- The before/after table
- Which static finding from chapter 2 explains each improvement

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/1-lab-measurement.mdx
```

## 要点

- Lighthouse 在模拟的中端手机和慢速网络上加载页面，因此结果可重复，但偏悲观。
- FCP 是任何内容出现的时刻；LCP 是主要内容出现的时刻。LCP 低于 2.5 秒算良好。
- 阻塞渲染的脚本会推迟 FCP；过重的图片会推迟 LCP。静态检查已经预测到了这两点。
- 实验室数据用于比较不同构建。来自真实用户的现场数据才告诉你人们实际的体验。

---

上一页: [第 3 章 · 开篇: 动态测试](/demo/zh/performance-testing/dynamic.md)
下一页: [第 3.2 课: 用 k6 做负载测试](/demo/zh/performance-testing/dynamic/load-testing.md)
