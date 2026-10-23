# 第 4.2 课: 报告结果

性能测试 · 第 4 章: 总结 · 20 分钟

> 把性能结果写清楚，让人能据此做决定，也让别人能重复这个测试。

**学完本课你将能够:**
- 围绕报告要回答的问题来组织性能报告
- 连同测量条件一起呈现结果，使其可以重复
- 写出指明原因、影响和下一步的发现

## 文字稿: 报告结果 (1:10)

**0:00 引言.** 只有当有人能据此行动时，一次性能测试才算完成。这需要一份报告：简短、结构可预期，每个数字都有任何人都能重新运行的测试作为支撑。

**0:14 课程带来了哪些改变.** 这是 Larkspur 最初的测量结果，每一项都来自一次可以重复的运行。 静态修复之后：1 次查询代替 101 次，两个索引，更轻的资源。 动态修复之后：图书标签只解析一次，而不是每个请求都解析。 每个结果都注明了产生它的测试。正是这一点让报告可信。

**0:38 报告的结构.** 先写摘要，回答测试要回答的问题。 然后是测试环境，让任何人都能重复；再是结果：修复前后，同样的测试，同一台机器。 接着每个问题写一条发现，说明测试的局限，以及下一步。

**0:56 一条好的发现.** 一条发现就是一个小小的论证：原因，以及它的确切位置； 用户的感受，并附上测量数字； 修复方法，以及别人可以核实的证据。

## 课文

只有当有人能据此行动时，一次性能测试才算完成。这需要一份报告：简短、结构可预期，并且每个数字都有任何人都能重新运行的测试作为支撑。

> **概念动画: 课程带来了什么变化**
>
> 1. 之前：Larkspur 的第一批测量结果，每一项都来自一次可以重复的运行。
> 2. 静态修复之后：一条查询代替 101 条，两个索引，以及更轻的资源。
> 3. 动态修复之后：图书标签只解析一次，而不是每次请求都解析。
> 4. 每个结果都注明了产生它的测试。这正是性能报告可信的原因。

## 一份有用报告的结构

1. **摘要**。用两三句话回答测试要回答的问题。“经过四项修复，Larkspur 在 50 个用户下满足了全部预算。推荐接口最先饱和，在测试机器上约为 700 req/s。”
2. **测试环境**。机器、数据集、工具版本和命令。足以让别人复现。
3. **结果**。修复前后，同样的测试，同一台机器。使用百分位数和错误率，而不是平均值。
4. **发现**。每个问题一条：原因是什么、用户感受到什么、该怎么做，以及证据。
5. **局限**。你没有测试的内容：其他接口、生产硬件、真实网络条件、更长时间的浸泡测试。
6. **下一步**。需要做的决定或后续测试，尽可能为每一项指定负责人。

## 撰写发现

一条发现就是一个小小的论证。比较一下：

> 图书 API 很慢。

> **/api/books 中的 N+1 查询**。`listBooks` 每本书执行 2 次查询，每页共 101 次（`src/routes/books.mjs:11`、`:13`）。在 50 个用户下，p95 为 1.17 s，而预算是 300 ms；而且由于服务器是单线程的，它拖慢了所有其他接口。把循环换成一条联接查询，并为 `reviews.book_id` 建立索引后，在同一个 k6 测试中 p95 降到了 10 ms。证据：`notes/load-test.md`。

第二条指出了原因及其位置，说明了用户的感受，给出了修复方法，并指向了证据。即使当时不在场的人，也能核实其中的每一个论断。

## 让人信得过的数字

- 每一组前后对比都要用**同样的测试、同一台机器**。如果还有其他改动，要说明。
- **百分位数和错误率一起看**。p95 很快但错误率为 5%，不算成功。
- **给出范围，而不是虚假的精确**。重复运行的结果会相差几个百分点。“约 700 req/s”比“698.97”更诚实。
- **实验室与现场**。说明哪些数字来自 Lighthouse 或笔记本电脑，哪些来自生产环境。

> **来自智能体的报告.** 让智能体为你撰写报告时，要求它注明每个数字的来源，就像下面的提示词那样。然后对照文件抽查几个数字。智能体擅长行文和结构；真正需要警惕的，是一个言之凿凿却没有来源的数字。

## 动手练习：撰写 Larkspur 的性能报告

**动手练习 · 20 分钟.** 目标： 把课程中的笔记整理成一页纸的性能报告，包含结论、结果表、发现和局限。

1. 收集你的笔记：`perf-baseline.md`、`perf-plan.md`、`lighthouse.md`、`load-test.md`、`capacity.md`。
2. 按照上面的六个部分撰写 `notes/report.md`。可以从这张结果表开始，填入**你自己的**数字：

   | 指标 | 测试 | 修复前 | 修复后 |
   | --- | --- | --- | --- |
   | /api/books p95 | 迷你负载工具，10 个用户 | 1,320 ms | 12 ms |
   | /api/orders p95 | 迷你负载工具，10 个用户 | 205 ms | 5 ms |
   | /api/recommendations p95 | 迷你负载工具，10 个用户 | 347 ms | 26 ms |
   | 错误率 | k6 负载测试，50 个用户 | 0% | 0% |
   | LCP | Lighthouse，移动端 | 9.8 s | 1.5 s |
   | 页面体积 | Lighthouse | 1,645 KiB | 68 KiB |

![编辑器中打开的一份 Markdown 报告。一段简短的 Summary，一个 Test setup 列表，一张对比修复前后的 Results 表，以及一个 Findings 部分，其第一条标题为“N+1 queries in /api/books”，包含原因、影响、修复和证据几行。](screenshot-pending)
*Screenshot (notes/report.md): 一页纸。每个数字都有来源。*

3. 以一个不在场的人的身份读一遍。他们能根据“测试环境”部分重新运行每一个测试吗？能为每一条发现找到证据吗？

**完成标准**
- notes/report.md has all six sections
- Every number is traceable to a notes file or a quoted command output
- Missing measurements are listed under Limits instead of being estimated

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.2, "Reporting results".

Exercise: Write Larkspur's performance report
Goal: Turn your notes from the course into a one-page performance report with an answer, a results table, findings and limits.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read everything in `notes/` (baseline, plan, lighthouse, load test, capacity). If a file is missing, list it as missing; do not invent its numbers.
2. Create `notes/report.md` with these sections: Summary (2 to 3 sentences answering whether Larkspur meets its budgets), Test setup (machine, tools and versions, commands), Results (a before/after table with p95 per endpoint, throughput, error rate, LCP and page weight), Findings (one per problem found: cause, user impact, fix, evidence), Limits (what wasn't tested), Next steps.
3. Every number in the report must come from a file in notes/ or from a command you run now; cite which.

Done when:
- notes/report.md has all six sections
- Every number is traceable to a notes file or a quoted command output
- Missing measurements are listed under Limits instead of being estimated

Report back:
- The Summary and Results sections
- Any numbers you couldn't source

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/2-reporting.mdx
```

## 要点

- 先给出测试要回答的问题的答案，再给出证据。
- 每个数字都需要条件：测试了什么、用了多大负载、在哪台机器上、用了哪条命令。
- 报告百分位数和错误率，前后对比要来自同一台机器上的同一个测试。
- 一条发现要说明原因、以用户视角描述的影响，以及建议的下一步。
- 说明你没有测试什么。局限也是结果的一部分。

---

上一页: [第 4.1 课: 性能测试工作流程](/demo/zh/performance-testing/review/workflow.md)
下一页: [第 4.3 课: 性能验收](/demo/zh/performance-testing/review/acceptance.md)
