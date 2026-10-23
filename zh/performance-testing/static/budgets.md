# 第 2.1 课: 性能预算

性能测试 · 第 2 章: 静态测试 · 20 分钟

> 在测量之前先约定上限，再让检查在每次改动时强制执行。

**学完本课你将能够:**
- 解释什么是性能预算，以及应该由谁来约定
- 选择既能静态检查、也能动态检查的预算指标
- 运行资源预算检查并解读结果

## 文字稿: 性能预算 (1:04)

**0:00 简介.** “让它快一点”不是任何人能测试的需求。性能预算才是。

**0:06 预算如何运作.** 预算是团队在测量之前约定的上限。对 Larkspur 来说：脚本 50 KB，图片 250 KB，总计 350 KB。 然后用当前构建对照每一项上限进行测量。 超过上限的项就失败。Larkspur 在脚本、图片和总体积上都超了。 预算失败是一个清晰的信号。退出码为 1，它就能直接拦下拉取请求，而不是引发一场争论。

**0:32 三种预算.** 预算分三种。数量预算，比如 KB 数或每个请求的查询次数，可以在每次改动时静态检查。 时间预算，比如 p95 或最大内容绘制，需要动态测试。 先从用户的需要出发，再参考你现在的水平，随着改进逐步收紧预算。

**0:52 运行检查.** 在练习中，你会运行预算检查，看清到底是哪些文件让页面超标。 几乎全部来自两个文件。第 2.4 课会修复它们。

## 课文

“让它快一点”不是任何人能测试的需求。**性能预算**才是：对一个可测量的量设定上限，在任何人测量之前约定好，并由检查来强制执行。

> **概念动画: 预算把“够快”变成通过或失败**
>
> 1. 预算是团队在测量之前约定的上限：脚本 50 KB、图片 250 KB、总计 350 KB。
> 2. 然后用当前构建对照每一项上限进行测量。
> 3. 超过上限的项就失败。Larkspur 在脚本、图片和总体积上都超了。
> 4. 预算失败是一个清晰的信号。它可以直接拦下拉取请求，而不是引发一场争论。

## 三种预算

| 种类 | 示例 | 如何检查 |
| --- | --- | --- |
| **数量** | JavaScript gzip 后 ≤ 50 KB，图片 ≤ 250 KB，每个请求 ≤ 5 次查询 | 静态检查，每次构建都运行 |
| **时间** | 50 个用户下 p95 ≤ 300 ms，中端手机上 LCP ≤ 2.5 s | 动态检查，用 Lighthouse 或 k6 |
| **规则** | Lighthouse 性能得分 ≥ 90，没有阻塞渲染的脚本 | 动态检查，用 Lighthouse |

数量预算属于静态预算，也是早期最有用的：它们无可争辩，而且在有人提交退化的那一刻就能抓住它。时间预算告诉你用户是否满意；数量预算告诉你是哪次改动让他们不满意。

## 这些数字从哪里来

好的预算按以下顺序来自三个地方：

1. **用户需要什么。** Google 的 Core Web Vitals 把 2.5 s 以内的 LCP 评为“良好”。针对网店的研究表明，额外延迟约一秒时，流失就会变得明显。
2. **竞争对手做到了什么。** 如果对手的商品页 1.8 s 就能加载完，那就是你的标准。
3. **你现在在哪里。** 第一天就超出十倍的预算会被直接关掉。从当前数字出发，再逐步收紧。

Larkspur 的 `budget.json` 为店面设定了数量上限：

```json
{
  "page": "public/index.html",
  "budgets": { "script": 50, "stylesheet": 20, "image": 250, "total": 350 }
}
```

脚本和样式表按 gzip 后的大小测量，与浏览器下载时一致；图片按存储大小测量。检查脚本读取 `index.html`，找出其中引用的每个脚本、样式表和图片，逐一称重，只要有任何预算超标就以退出码 1 退出。正是退出码 1 让 CI 任务失败。

> **预算需要负责人.** 要和产品负责人一起约定预算，而不只是工程师。当新功能需要更多空间时，这是一个产品决策：要么有意识地提高预算，要么削减别的东西。

## 动手练习：运行资源预算检查并记录失败项

**动手练习 · 10 分钟.** 目标： 运行 Larkspur 的资源预算检查，找出导致超标的文件，并把 API 时间预算加入你的计划，供第 3 章使用。

1. 在练习应用的目录下运行检查。不需要启动应用。

   ```bash
   npm run budget
   ```

   ```text
   Asset weight for public/index.html

   type        size KB   file
   script         95.9   /vendor/datefmt-all-locales.js
   script          0.3   /app.js
   stylesheet      0.5   /styles.css
   image        1043.1   /hero.jpg

   budget      actual   limit   result
   script        96.2      50   FAIL  (+46.2 KB)
   stylesheet     0.5      20   pass
   image       1043.1     250   FAIL  (+793.1 KB)
   total       1139.8     350   FAIL  (+789.8 KB)

   3 budget(s) exceeded.
   ```

![终端显示资源表和预算表。脚本 96.2 KB（上限 50）、图片 1043.1 KB（上限 250）和总计 1139.8 KB（上限 350）标记为 FAIL；样式表 0.5 KB 通过。](screenshot-pending)
*Screenshot (npm run budget): 四项预算中有三项失败，几乎全部来自两个文件。*

2. 检查退出码。失败运行后立即执行 `echo $?` 会打印 `1`，正是它让 CI 流水线停下来。
3. 为每一项失败指出对应的文件。这里很简单：一个脚本和一张图片。
4. 把智能体提示词中的 API 时间预算添加到 `notes/perf-plan.md`。你会在第 3.2 课把它们变成 k6 阈值。

**完成标准**
- You have the budget output and its exit code
- Each failing budget is attributed to a specific file
- notes/perf-plan.md lists both asset and API budgets

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.1, "Performance budgets".

Exercise: Run the asset budget and record what fails
Goal: Run Larkspur's asset budget, identify which files push it over, and add API timing budgets to your plan for chapter 3.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `budget.json` and summarise its limits.
2. Run `npm run budget` and capture the full output and the exit code.
3. List each failing budget with how far over it is, and the file or files responsible.
4. Append a 'Budgets' section to `notes/perf-plan.md` (create the file if it doesn't exist) with the asset budgets from budget.json and these API budgets: /api/books p95 300 ms, /api/orders p95 200 ms, /api/recommendations p95 400 ms, all at 50 users, error rate under 1%.
5. Do not change any code or assets yet; lesson 2.4 fixes them.

Done when:
- You have the budget output and its exit code
- Each failing budget is attributed to a specific file
- notes/perf-plan.md lists both asset and API budgets

Report back:
- The budget table from the command output
- The files responsible for each failure, largest first

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/1-budgets.mdx
```

## 要点

- 预算是在测量之前约定的上限。它把“这够快吗？”变成通过或失败。
- 数量预算（KB、请求数、查询数）可以在每次改动时静态检查。时间预算（p95、LCP）需要动态测试。
- 先根据用户需求和竞争对手来定预算，再参考当前数字，确保它可以达成。随着改进逐步收紧。
- 让构建失败的预算检查会被修复；变红的仪表盘只会被忽视。

---

上一页: [第 2 章 · 开篇: 静态测试](/demo/zh/performance-testing/static.md)
下一页: [第 2.2 课: 代码审查：N+1 查询](/demo/zh/performance-testing/static/n-plus-one.md)
