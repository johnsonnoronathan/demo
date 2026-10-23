# 第 4.1 课: 性能测试工作流程

性能测试 · 第 4 章: 总结 · 25 分钟

> 决定什么在哪里运行：每个拉取请求的静态检查、发布前的动态测试，以及生产环境监控。

**学完本课你将能够:**
- 把每种性能检查放到交付流程中合适的阶段
- 用一条命令运行所有静态门禁，并看到其中一项捕获性能退化
- 改造一个运行静态门禁、Lighthouse 和简短 k6 测试的 CI 工作流

## 文字稿: 性能测试工作流程 (1:12)

**0:00 引言.** 到目前为止，一切都是手工完成的，而且只做了一次。真实的代码库每天都在变化。那么，每项检查应该在哪里运行？

**0:11 流水线.** 每个拉取请求先运行静态检查：资源预算、查询检查和查询计划。只需几秒钟。 然后改动被构建并部署到预发布环境，在那里运行 Lighthouse 和一个简短的 k6 负载测试。 一旦有阈值未达标，发布就会被拦下，失败信息里带着解释原因的数字。 修复之后，改动才会上线。生产环境监控关注同样的指标，并为下一轮预算提供依据。

**0:43 什么在哪里运行.** 原则是快速反馈优先。在拉取请求上 4 秒内就失败的门禁，作者几乎不费成本就能修复。 长时间的压力测试和浸泡测试应该按计划，在稳定的环境中定期运行，而不是每次改动都跑。

**1:01 门禁实战.** 在练习中，你会故意撤销自己的一项修复。 静态门禁几秒钟就能发现它，并指出造成问题的文件和体积。

## 课文

第 2 章和第 3 章中的一切都是手工完成的，而且只做了一次。真实的代码库每天都在变化。问题在于每项检查应该在哪里运行，才能让问题快速、低成本地暴露出来。

> **概念动画: 交付流水线中的性能检查**
>
> 1. 每个拉取请求先运行静态检查：资源预算、查询检查和查询计划。只需几秒。
> 2. 然后构建、部署到预发布环境，并运行动态检查：Lighthouse 和一次简短的 k6 负载测试。
> 3. 阈值失败会阻止发布，失败信息里带着解释原因的数字。
> 4. 修复后，改动上线。生产监控观察同样的指标，并为下一轮预算提供依据。

## 什么在哪里运行

| 阶段 | 运行内容 | 耗时 | 能捕获 |
| --- | --- | --- | --- |
| 每个拉取请求 | 静态门禁：预算、查询检查、查询计划 | 几秒 | 已知的慢模式，在评审之前 |
| 发布前，在预发布环境 | Lighthouse、对照预算的简短 k6 负载测试 | 几分钟 | 用户可感知的性能退化 |
| 定期运行（每晚、每周） | 压力、峰值和浸泡测试 | 最长几小时 | 容量和缓慢劣化 |
| 生产环境 | 真实用户监控、服务器指标 | 持续 | 实验室无法复现的问题 |

原则是**快速反馈优先**。在拉取请求上 4 秒内就失败的静态门禁，作者几乎不费成本就能修复。同样的问题如果由每晚的浸泡测试发现，要付出一天的代价；如果由客户发现，代价就大得多。

## 一条命令运行静态门禁

练习应用把它的静态门禁打包成了一个脚本：

```bash
npm run check:static
```

```text
budget      actual   limit   result
script         0.9      50   pass
…
All budgets met.
No queries inside loops found.
pass  SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY …
pass  SELECT name FROM authors WHERE id = ?
pass  SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?
pass  SELECT id, tags FROM books WHERE id = ?

All 4 query plans use indexes.
```

`check:plans` 是新增的：它会对 `hot-queries.sql` 中列出的每条查询执行 explain，如果有任何查询会扫描 1,000 行或以上的表，就判定失败。它把第 2.3 课变成了一道门禁。代价是要养成一个习惯：每当你在路由中添加一条查询，也要把它加到这个文件里。

## CI 中的动态测试

`ci/perf.yml` 是一个参考用的 GitHub Actions 工作流，包含两个作业。**Static** 运行三道门禁。**Dynamic** 启动应用，按照 `lighthouserc.json` 运行 Lighthouse CI（LCP 低于 2.5 s，页面体积低于 350 KB），并运行一个 70 秒版本的 k6 负载测试。

```yaml title="ci/perf.yml（节选）"
  dynamic:
    needs: static
    steps:
      # …检出代码、安装 Node、填充数据、启动应用…
      - name: Lighthouse
        run: npx @lhci/cli@0.15.1 autorun
      - uses: grafana/setup-k6-action@v1
      - name: Load test (short)
        run: k6 run --stage 20s:50 --stage 40s:50 --stage 10s:0 load/load.k6.js
```

> **共享的 CI 运行器噪声很大.** CI 机器是共享的，每次运行的情况都不一样。CI 中的负载测试要保持简短，对照预算时要留出一些余量，把单次失败当作重新运行并查看的理由，而不是确凿的证据。容量数字应该在专用的、接近生产的环境中测得。

## 形成闭环

生产环境监控关注的是与测试相同的指标：每个接口的 p95、错误率、来自真实用户的 LCP。当真实流量增长或形态发生变化时，这些数字会告诉你需要修订预算，而预算又驱动下一轮测试。

## 动手练习：运行门禁，然后看它捕获一次性能退化

**动手练习 · 20 分钟.** 目标： 用一条命令运行所有静态门禁，故意重新引入一次性能退化，看到门禁失败，然后改造参考 CI 工作流。

1. 运行所有静态门禁：

   ```bash
   npm run check:static; echo "exit $?"
   ```

2. 故意撤销你的一项修复。在 `public/index.html` 中，把日期库重新指向包含所有语言区域的文件，然后再次运行门禁。

![资源预算检查失败的终端输出：script 为 96.2 KB，限制为 50 KB，标记为 FAIL，超出 +46.2 KB，随后是“1 budget(s) exceeded.”和退出码 1。后续门禁没有运行。](screenshot-pending)
*Screenshot (npm run check:static): 性能退化在几秒钟内就被捕获，并指出了造成它的文件和体积。*

3. 撤销这次改动，确认门禁再次通过。
4. 阅读 `ci/perf.yml`，写下要在你自己的仓库中使用它需要做哪些修改：工作目录、触发运行的分支，以及它的阈值是否适合你的 CI 运行器。

**完成标准**
- check:static passes before and after the experiment, and failed during it
- notes/ci.md explains each job and its failure conditions

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.1, "A performance testing workflow".

Exercise: Run the gates, then watch one catch a regression
Goal: Run all static gates with one command, deliberately reintroduce a regression to see a gate fail, then adapt the reference CI workflow.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run check:static` and capture the output and exit code. If any gate fails, list which and why, and stop here.
2. Reintroduce a regression on a scratch basis: in `public/index.html`, change `/vendor/datefmt-en.js` back to `/vendor/datefmt-all-locales.js`.
3. Run `npm run check:static` again and capture which gate fails and its message.
4. Revert the change with `git checkout -- public/index.html` (or by hand if the file isn't committed) and confirm `npm run check:static` passes again.
5. Read `ci/perf.yml`. Write `notes/ci.md` describing what each job does, what makes it fail, and what you'd change for a team's own repository (paths, branches, thresholds). Do not create files under .github/ unless asked.

Done when:
- check:static passes before and after the experiment, and failed during it
- notes/ci.md explains each job and its failure conditions

Report back:
- The failing gate's output during the regression
- Your notes on adapting ci/perf.yml

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/1-workflow.mdx
```

## 要点

- 在每个拉取请求上运行低成本的静态门禁，在发布前运行动态测试，在生产环境中进行监控。
- 门禁只有让构建失败才有用。确保每项检查在超出限制时以非零状态退出。
- CI 中的负载测试要短，阈值要足够宽松以适应共享运行器；长时间的压力测试和浸泡测试按计划定期运行。
- 把生产环境的数字反馈到预算中。正是这个闭环让性能不会逐渐劣化。

---

上一页: [第 4 章 · 开篇: 总结](/demo/zh/performance-testing/review.md)
下一页: [第 4.2 课: 报告结果](/demo/zh/performance-testing/review/reporting.md)
