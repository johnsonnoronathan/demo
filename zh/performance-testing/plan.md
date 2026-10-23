# 教案: 性能测试

学习从两个方向测试 Web 应用的性能。静态测试不运行任何东西，只检查代码、查询和资源；动态测试运行系统、向它发送流量，并测量用户的实际感受。你会在 Larkspur Books 上练习这两种方法，这是一个故意做得很慢的小型网上书店。

- 总时长: 6 小时 50 分钟
- 视频: 22 (26:52)
- 能读懂 JavaScript 和 SQL、会使用终端的开发者和测试人员。不需要性能测试经验。
- 练习应用: Larkspur Books, `academy/practice/larkspur`. 一个用 Node.js 22 写的书店：一个店面页面和三个基于 SQLite 的 JSON 接口。零依赖，故意做得很慢。

## 课程目标

- 把“应该很快”变成可测量的预算和阈值
- 通过阅读代码、查询计划和构建产物，发现 N+1 查询、缺失的索引和过重的资源
- 用 Lighthouse 在实验室环境中测量页面加载，并解读 Core Web Vitals
- 用 k6 编写并运行负载、压力、峰值和浸泡测试
- 在火焰图中定位 CPU 瓶颈，并证明修复有效
- 把静态和动态检查放进 CI，并报告可据以行动的结果
- 按事先约定的标准运行验收测试，并记录放行/不放行的决定
- 在你自己的项目上做静态检查，由智能体实现修复

## 开始之前

- Node.js 22.13 或更高版本
- 终端和代码编辑器
- Chrome，用于 Lighthouse 和 CPU 分析器
- 第 3 章需要 k6（课程也自带一个内置的负载工具）

## 结构

1. **概述** (50 min): 性能测试测量什么、两类测试方法，以及练习用的应用。
2. **静态测试** (100 min): 不运行系统，通过检查你构建的东西来发现性能问题。
3. **动态测试** (125 min): 运行系统、发送流量，测量用户的实际感受。
4. **总结** (135 min): 把两者结合成一套工作流程，报告结果，进行验收，应用到你自己的项目，并回顾整门课程。

## 第 1 章: 概述

性能测试测量什么、两类测试方法，以及练习用的应用。 (50 分钟)

### 第 1 章 · 开篇: 概述 (5 分钟, ▶ 1:45)

这门课程讲什么、如何组织，以及如何使用课堂和其中的智能体提示词。

/demo/zh/performance-testing/overview.md

学习成果:
- 了解性能测试回答哪些问题，以及它报告哪些数字
- 分清静态测试和动态测试，知道各自在什么时候最划算
- 让练习应用跑起来，并记下第一次测量结果
- 知道如何把动手练习交给编程智能体，以及它汇报时要检查什么

### 第 1.1 课: 性能测试测量什么 (20 分钟, ▶ 1:26)

延迟、吞吐量和错误：每次性能测试都会报告的三个数字，以及为什么延迟要用百分位数来表示。

/demo/zh/performance-testing/overview/what-it-measures.md

学习成果:
- 说出性能测试报告的三个数字，以及每个数字反映了用户的什么体验
- 读懂 p50、p95 和 p99，并解释为什么平均值会掩盖问题
- 运行练习应用，完成第一次可重复的测量

概念:
- 延迟是一个分布：p50、p95、p99
- 吞吐量和错误率
- 只有可重复的测量才有用

动手练习 · 15 分钟: **搭建 Larkspur 并完成第一次测量**. 让练习应用跑起来，并为 /api/books 记录一条基线：10 个用户下的查询次数、p50、p95 和吞吐量。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 1.1, "What performance testing measures".

Exercise: Set up Larkspur and take a first measurement
Goal: Get the practice app running and record a baseline for /api/books: query count, p50, p95 and throughput at 10 users.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run seed` and confirm it reports 500 authors, 5,000 books, 50,000 reviews and 200,000 orders.
2. Start the app with `npm start` in the background and wait until http://localhost:3000/health returns `ok`.
3. Run `curl -s -i http://localhost:3000/api/books` and note the `x-query-count` and `server-timing` headers.
4. Run `npm run load -- --url http://localhost:3000/api/books --vus 10 --duration 20` and capture the result row.
5. Create `notes/perf-baseline.md` inside the practice app with the date, the command used, and the measured requests/s, p50, p95, p99 and queries per request.
6. Stop the app when you're done.

Done when:
- notes/perf-baseline.md exists and every number in it appears in the command output you captured
- The baseline names the endpoint, the number of virtual users and the duration

Report back:
- The baseline table you wrote
- One sentence on what the query count suggests about the endpoint

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/1-overview/1-what-it-measures.mdx
```

要点:
- 延迟是一个请求花费的时间，吞吐量是每秒完成的请求数，错误率是失败请求所占的比例。
- 延迟是一个分布。要报告百分位数：p50 代表典型请求，p95 和 p99 代表慢速长尾。
- 平均值把快请求和慢请求混在一起，得到一个没有任何用户真正经历过的数字。不要基于平均值设定预算。
- 记下你是如何测量的（用户数、时长、接口），这样数字才能被重复和比较。

### 第 1.2 课: 静态测试与动态测试 (20 分钟, ▶ 1:16)

性能测试的两大类、各自能发现和不能发现什么，以及测试前如何规划要回答的问题。

/demo/zh/performance-testing/overview/static-and-dynamic.md

学习成果:
- 解释静态性能测试和动态性能测试的区别
- 为给定的问题挑选仍能回答它的、成本更低的测试
- 写一份简短的测试计划：问题、预算、风险，以及覆盖它们的测试

概念:
- 静态测试：不运行，只检查
- 动态测试：运行并测量
- 测试计划从问题开始

动手练习 · 15 分钟: **为 Larkspur 起草一份性能测试计划**. 写一份一页纸的计划，列出你要回答的关于 Larkspur 的问题、每个问题的预算，以及由静态测试还是动态测试来覆盖。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 1.2, "Static and dynamic testing".

Exercise: Draft a performance test plan for Larkspur
Goal: Write a one-page plan that lists the questions you'll answer about Larkspur, a budget for each, and whether a static or a dynamic test covers it.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `README.md`, `server.mjs`, the files in `src/routes/`, `public/index.html` and `budget.json` to learn what the app does.
2. Create `notes/perf-plan.md` with four sections: Questions, Budgets, Risks, Tests.
3. Under Questions, list at least four concrete questions, each naming an endpoint or page and a number of users.
4. Under Budgets, give each question a measurable limit (for example p95 in ms, KB of assets, queries per request).
5. Under Risks, list anything in the code that looks likely to be slow, with file and line, without running the app.
6. Under Tests, map every question and risk to a static check or a dynamic test from this repository (`npm run budget`, `npm run lint:queries`, `npm run explain`, `npm run load`, the k6 scripts in `load/`).

Done when:
- notes/perf-plan.md has the four sections
- Every budget is a number with a unit, and every question maps to at least one test
- Risks cite file paths and line numbers

Report back:
- The Questions and Budgets sections
- The three risks you think are most serious, and why

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/1-overview/2-static-and-dynamic.mdx
```

要点:
- 静态测试在不运行系统的情况下检查代码、查询、资源和配置。它速度快，每次改动都能运行，但只能发现可能存在的问题。
- 动态测试在真实流量下运行系统，测量用户的实际感受。它更慢，需要一个环境，但能证明影响有多大。
- 用静态检查及早发现已知模式，用动态测试确认影响，并发现任何规则都描述不了的问题。
- 先用问题来规划（“结账能否在 50 个用户下保持 p95 低于 300 ms？”），再为每个问题选择能回答它的最低成本测试。

### 第 1 章 · 小结: 概述：小结 (5 分钟, ▶ 0:38)

后续课程会用到的术语和计划。

/demo/zh/performance-testing/overview/summary.md

自测:
1. 仪表盘显示平均响应时间为 140 ms。为什么这还不足以说明这个接口很快？
   平均值掩盖了长尾。p95 可能有好几百毫秒，意味着每二十个用户中就有一个要等得久得多。要看 p95 和 p99。
2. 要在每个拉取请求上检查没有人往店面里加入一个 600 KB 的脚本，你会用哪一类测试？
   静态检查：在构建时对照预算测量资源体积。只需几秒钟，不需要运行服务器。
3. 你的静态检查全部通过。你能说应用可以在 50 个用户下保持 p95 低于 300 ms 吗？
   不能。静态检查只能发现已知模式；只有在该负载下进行动态测试，才能显示用户会看到的 p95。
4. 在测得的 p95 旁边必须记录什么，别人才能重复测试？
   接口、虚拟用户数量和持续时间、机器，以及确切的命令。

## 第 2 章: 静态测试

不运行系统，通过检查你构建的东西来发现性能问题。 (1 小时 40 分钟)

### 第 2 章 · 开篇: 静态测试 (5 分钟, ▶ 0:42)

在运行任何东西之前，通过阅读你构建的东西来发现性能问题。

/demo/zh/performance-testing/static.md

学习成果:
- 把计划中的预算变成一项能让构建通过或失败的检查
- 用 linter 和肉眼在代码中发现 N+1 查询模式，并消除它
- 阅读 SQLite 查询计划，识别全表扫描，并用索引修复它
- 找出让页面变重的原因，并把它压到预算以下
- 知道哪些检查应该在每个拉取请求上运行

### 第 2.1 课: 性能预算 (20 分钟, ▶ 1:04)

在测量之前先约定上限，再让检查在每次改动时强制执行。

/demo/zh/performance-testing/static/budgets.md

学习成果:
- 解释什么是性能预算，以及应该由谁来约定
- 选择既能静态检查、也能动态检查的预算指标
- 运行资源预算检查并解读结果

概念:
- 预算把主观意见变成通过或失败
- 预算的种类：数量、时间、规则
- 这些数字从哪里来

动手练习 · 10 分钟: **运行资源预算检查并记录失败项**. 运行 Larkspur 的资源预算检查，找出导致超标的文件，并把 API 时间预算加入你的计划，供第 3 章使用。

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

要点:
- 预算是在测量之前约定的上限。它把“这够快吗？”变成通过或失败。
- 数量预算（KB、请求数、查询数）可以在每次改动时静态检查。时间预算（p95、LCP）需要动态测试。
- 先根据用户需求和竞争对手来定预算，再参考当前数字，确保它可以达成。随着改进逐步收紧。
- 让构建失败的预算检查会被修复；变红的仪表盘只会被忽视。

### 第 2.2 课: 代码审查：N+1 查询 (25 分钟, ▶ 1:03)

使用数据库的代码中最常见的性能缺陷：如何通过阅读发现它，以及如何消除它。

/demo/zh/performance-testing/static/n-plus-one.md

学习成果:
- 在代码中识别 N+1 查询模式
- 用静态检查标记循环中的数据库调用
- 把 N+1 循环改写为一条带 JOIN 的查询，并验证查询次数

概念:
- N+1 查询模式
- 静态发现：包含查询的循环
- 修复：JOIN、批量查询和查询次数响应头

动手练习 · 20 分钟: **找出并消除 /api/books 中的 N+1**. 用查询 linter 找出图书接口中的 N+1，把它改写为一次查询，并证明查询次数从 101 降到 1，而响应不变。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.2, "Code review for N+1 queries".

Exercise: Find and remove the N+1 in /api/books
Goal: Use the query linter to find the N+1 in the books endpoint, rewrite it as one query, and show the query count drop from 101 to 1 with the same response.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run lint:queries` and capture the findings.
2. Start the app (`npm start` in the background), save the current response with `curl -s http://localhost:3000/api/books > /tmp/books-before.json`, and note the `x-query-count` header.
3. Rewrite `listBooks` in `src/routes/books.mjs` so it runs a single query: select the page of 50 books in a subquery, JOIN authors, LEFT JOIN reviews, GROUP BY book, and compute `rating` as avg(stars) rounded to one decimal (null when there are no reviews) and `reviews` as the review count. Keep the response shape: page, books[] with id, title, author_id, price_cents, author, rating, reviews.
4. Restart the app, fetch the endpoint again into /tmp/books-after.json, and compare it with the before file using `node -e` (parse both and deep-compare).
5. Run `npm run lint:queries` again.

Done when:
- `npm run lint:queries` reports no queries inside loops and exits 0
- `x-query-count` for /api/books is 1
- The before and after JSON responses are identical

Report back:
- The new listBooks function
- x-query-count and server-timing before and after
- The result of the JSON comparison

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/2-n-plus-one.mdx
```

要点:
- N+1 指先用一次查询取列表，再为每一项多查一次。代价随列表增长，在快速的本地数据库中很难察觉。
- 从静态角度看，它表现为循环或 .map 回调中的数据库调用。一条简单的 lint 规则就能抓住大多数情况。
- 修复方法是用一次查询取回全部数据（JOIN、GROUP BY），或用一次批量查询（WHERE id IN (...)）。
- 统计每个请求的查询次数。随页面大小增长的查询次数就是 N+1 的特征。

### 第 2.3 课: 阅读查询计划 (25 分钟, ▶ 1:03)

不执行查询，直接问数据库它会怎样执行；再用合适的索引修复全表扫描。

/demo/zh/performance-testing/static/query-plans.md

学习成果:
- 用 EXPLAIN QUERY PLAN 从 SQLite 获取查询计划
- 区分 SCAN 和 SEARCH，并判断什么时候扫描是个问题
- 根据查询的 WHERE 和 ORDER BY 设计索引，以迁移的形式添加，并确认计划已改变

概念:
- SCAN 与 SEARCH
- 选择索引列：先过滤，后排序
- 索引会增加写入开销和占用空间

动手练习 · 20 分钟: **把两次全表扫描变成索引查找**. 找出 /api/orders 和图书页背后的全表扫描，在迁移中添加索引，并确认两个查询计划和耗时都得到改善。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.3, "Reading query plans".

Exercise: Turn two full table scans into index searches
Goal: Find the full table scans behind /api/orders and the books page, add indexes in a migration, and confirm both plans and timings improve.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run explain -- "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"` and capture the plan.
2. Run `npm run explain -- "SELECT avg(stars) FROM reviews WHERE book_id = ?"` and capture the plan.
3. Create `db/migrations/001_indexes.sql` with `CREATE INDEX idx_orders_email ON orders(customer_email, created_at);` and `CREATE INDEX idx_reviews_book ON reviews(book_id);`.
4. Run `npm run migrate`.
5. Run both explain commands again and capture the new plans.
6. With the app running, compare the `server-timing` header of /api/orders?email=reader42@larkspur.test and /api/books before and after (restart the app after migrating; take the median of five requests each).

Done when:
- Neither plan contains 'full table scan'
- Both plans show SEARCH ... USING INDEX
- `npm run migrate` reports the migration applied, and running it again reports nothing to migrate

Report back:
- Both plans before and after
- server-timing medians before and after for both endpoints

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/3-query-plans.mdx
```

要点:
- EXPLAIN QUERY PLAN 显示数据库将如何执行查询，而不真正执行它。所以它是一种静态检查。
- SCAN 读取表中的每一行；SEARCH 利用索引直接跳到匹配的行。在热点路径上对大表做 SCAN 就是缺陷。
- 先为过滤用的列建索引，再加上排序用的列，这样数据库连排序也可以省掉。
- 索引加快读取、拖慢写入。只添加查询真正需要的索引，而不是每列一个。

### 第 2.4 课: 资源体积 (20 分钟, ▶ 1:01)

通过称量文件找出页面为什么重，并在不改变用户所见的前提下把它压进预算。

/demo/zh/performance-testing/static/asset-weight.md

学习成果:
- 找出页面加载的最重的文件，并判断它们是否必要
- 在页面 HTML 中识别阻塞渲染的脚本
- 把页面体积降到预算以下，并用预算检查证明

概念:
- 页面体积都去哪了
- 阻塞渲染的脚本
- 让图片尺寸恰到好处

动手练习 · 15 分钟: **让店面回到预算之内**. 修复 public/index.html 中最重的两个资源和阻塞渲染的脚本，直到 npm run budget 通过，且页面显示的内容不变。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.4, "Asset weight".

Exercise: Bring the storefront under budget
Goal: Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run budget` and note the failing budgets.
2. In `public/index.html` only (leave `public/before.html` untouched), replace `/vendor/datefmt-all-locales.js` with `/vendor/datefmt-en.js`; the page only formats dates in en-US.
3. Add `defer` to both script tags so they no longer block rendering. `app.js` already waits for DOMContentLoaded, and deferred scripts run in order.
4. Replace `/hero.jpg` with `/hero-1200.jpg` and add `width="1200" height="600"` and `fetchpriority="high"` to the img tag.
5. Run `npm run budget` again.
6. Start the app and load http://localhost:3000/ in a browser or with Playwright if available, and confirm the 'Updated <date>' line and the book grid still render. If no browser is available, say so.

Done when:
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

Report back:
- The budget output before and after
- The diff of public/index.html
- How you confirmed the page still renders correctly

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/4-asset-weight.mdx
```

要点:
- 称量页面实际加载的东西。通常少数几个文件就占了大部分体积。
- 对每个重文件问两个问题：全部内容都需要吗？现在就需要吗？库打包的内容往往远超你实际用到的。
- <head> 中的普通 <script> 会阻塞渲染，直到它下载并执行完毕。使用 defer，或者把它移走。
- 按显示尺寸提供图片，合理压缩，并为它们设置 width 和 height。

### 第 2 章 · 小结: 静态测试：小结 (5 分钟, ▶ 0:38)

不运行应用就发现了什么，以及静态检查无法告诉你的事。

/demo/zh/performance-testing/static/summary.md

自测:
1. 一个拉取请求在每个页面都加入了一个 40 KB 的图表库。本章的哪项检查会失败？为什么在那里拦住它是对的？
   资源预算（脚本，50 KB）。它在拉取请求上几秒就能跑完，在改动上线之前，并且能指出是哪个文件造成的。
2. 查询 linter 没有任何发现。这能证明代码中没有 N+1 查询吗？
   不能。它是一种读取源代码中循环的启发式方法。藏在辅助函数后面的查询，或者 ORM 延迟加载关联数据，仍然可能造成 N+1。还要关注每个请求的查询次数。
3. 某个查询计划显示 SCAN countries（240 行）。你应该加索引吗？
   大概不必。扫描 240 行很便宜，而且这张表不会怎么增长。扫描只有在热点路径上的大表或持续增长的表上才要紧。
4. 为什么做完这些静态检查，你仍然无法保证 50 个用户下 p95 低于 300 ms？
   它们能发现已知的慢模式，但不测量负载下的耗时。只有动态测试才能显示用户实际会遇到的延迟。

## 第 3 章: 动态测试

运行系统、发送流量，测量用户的实际感受。 (2 小时 5 分钟)

### 第 3 章 · 开篇: 动态测试 (5 分钟, ▶ 0:59)

运行系统、发送流量，测量用户真正感受到的东西。

/demo/zh/performance-testing/dynamic.md

学习成果:
- 用 Lighthouse 在实验室环境中测量页面加载，读懂 FCP、LCP 和得分
- 编写带阶段、检查和阈值的 k6 负载测试，并读懂它的汇总结果
- 运行压力、峰值和浸泡测试，找出应用的实际容量
- 在负载下分析应用、阅读火焰图，并用数字证明 CPU 修复有效

### 第 3.1 课: 用 Lighthouse 做实验室测量 (25 分钟, ▶ 1:11)

在模拟手机上加载页面，测量用户在什么时候看到什么。

/demo/zh/performance-testing/dynamic/lighthouse.md

学习成果:
- 从命令行对本地页面运行 Lighthouse
- 从用户的角度解释 FCP、LCP、Total Blocking Time 和 Cumulative Layout Shift
- 用一次动态的前后对比测量来确认静态修复

概念:
- 观察页面加载：FCP 与 LCP
- Core Web Vitals 与性能得分
- 实验室数据与现场数据

动手练习 · 15 分钟: **在实验室中测量资源修复的效果**. 对冻结的修复前页面和修复后的店面运行 Lighthouse，比较得分、FCP、LCP 和传输大小。

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

要点:
- Lighthouse 在模拟的中端手机和慢速网络上加载页面，因此结果可重复，但偏悲观。
- FCP 是任何内容出现的时刻；LCP 是主要内容出现的时刻。LCP 低于 2.5 秒算良好。
- 阻塞渲染的脚本会推迟 FCP；过重的图片会推迟 LCP。静态检查已经预测到了这两点。
- 实验室数据用于比较不同构建。来自真实用户的现场数据才告诉你人们实际的体验。

### 第 3.2 课: 用 k6 做负载测试 (30 分钟, ▶ 1:21)

模拟一个购物高峰的夜晚，让阈值判断应用是否满足预算。

/demo/zh/performance-testing/dynamic/load-testing.md

学习成果:
- 解释虚拟用户、迭代、思考时间和阶段
- 编写带检查、标签和阈值的 k6 脚本
- 读懂 k6 汇总结果，并解释失败的阈值

概念:
- k6 负载测试如何工作
- 检查与阈值
- 一个慢接口拖慢所有接口

动手练习 · 20 分钟: **先运行冒烟测试，再运行负载测试**. 对 Larkspur 运行 load/smoke.k6.js 和 load/load.k6.js，并记录哪些阈值通过。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.2, "Load testing with k6".

Exercise: Run a smoke test, then the load test
Goal: Run load/smoke.k6.js and load/load.k6.js against Larkspur and record which thresholds pass.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Check that k6 is installed with `k6 version`. If it isn't, stop and report that; suggest `npm run load` as a fallback.
2. With the app running, run `k6 run load/smoke.k6.js` and confirm all checks pass.
3. Read load/load.k6.js and summarise its stages, think time and thresholds.
4. Run `k6 run load/load.k6.js` (about 2 minutes). For a quicker run, use `k6 run --stage 15s:50 --stage 30s:50 --stage 5s:0 load/load.k6.js` and say that you did.
5. Record each threshold's result and the p95 per endpoint in `notes/load-test.md`, with the command and date.

Done when:
- The smoke test passed before the load test ran
- notes/load-test.md lists every threshold with pass or fail and the measured value

Report back:
- The THRESHOLDS block of the k6 summary
- Whether the app meets the API budgets from your plan, and which chapter 2 fixes made the difference if it does

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/2-load-testing.mdx
```

要点:
- 虚拟用户循环运行你的脚本。阶段决定随时间推移同时运行多少个虚拟用户。
- 思考时间（sleep）让每个用户的行为像真人，所以 50 个虚拟用户接近 50 个真实顾客。
- 检查验证每个响应；阈值把整次运行的百分位数和错误率变成通过或失败。
- 按接口给请求打标签，让每个接口有自己的阈值。在单线程服务器上，一个慢接口会拖延其他所有接口。
- 总是先运行一次简短的冒烟测试，在加负载之前证明脚本和应用都能正常工作。

### 第 3.3 课: 压力、峰值与浸泡测试 (30 分钟, ▶ 1:24)

超出预期负载去找到上限，扛住突发流量，并发现持续数小时的缓慢退化。

/demo/zh/performance-testing/dynamic/stress-spike-soak.md

学习成果:
- 根据问题选择合适的负载形态：负载、压力、峰值或浸泡
- 通过阶梯式压力测试找出接口的容量
- 判断应用在峰值过后能否恢复

概念:
- 四种负载形态
- 吞吐量上限与延迟拐点
- 恢复与漂移

动手练习 · 25 分钟: **找出 /api/recommendations 的容量**. 用阶梯式压力测试和峰值测试，找出 /api/recommendations 从哪里开始无法满足 400 ms 的预算，以及它能否从突发流量中恢复。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.3, "Stress, spike and soak tests".

Exercise: Find the capacity of /api/recommendations
Goal: Use a stepped stress test and a spike test to find where /api/recommendations stops meeting its 400 ms budget, and whether it recovers from a surge.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. With the app running, run `npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --stages 5:1,5:2,5:4,5:8,5:16,5:32` and capture the table.
2. Identify the throughput ceiling (where req/s stops growing) and the first stage whose p95 exceeds 400 ms.
3. If k6 is installed, run `TARGET="/api/recommendations?book_id=7" STEP=10s k6 run load/stress.k6.js` and capture the thresholds and http_req_failed.
4. If k6 is installed, run `TARGET="/api/recommendations?book_id=7" k6 run load/spike.k6.js` and capture the per-phase durations (phase:before, phase:spike, phase:after).
5. Write `notes/capacity.md` with the ceiling, the capacity in users and req/s at the 400 ms budget, and whether p95 in the after phase returned to the before level.

Done when:
- notes/capacity.md states the ceiling in req/s and the capacity in users, both taken from captured output
- The spike result says whether the endpoint recovered, with before and after p95

Report back:
- The stepped load table
- Ceiling, capacity and recovery, each with the number it's based on

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/3-stress-spike-soak.mdx
```

要点:
- 负载测试检查预期流量；压力测试找出崩溃点；峰值测试检查能否扛住并恢复；浸泡测试发现缓慢漂移。
- 当用户增加而吞吐量不再增长时，就到了上限。此后多出来的用户只会增加等待时间。
- 容量是 p95 越过预算时的负载，而不是应用崩溃时的负载。
- 在峰值测试中，既要判断能否扛住，也要判断能否恢复：流量高峰结束后，延迟和错误应回到正常水平。
- 浸泡测试需要数小时，并要关注内存、连接数和延迟的趋势，而不只是最终的百分位数。

### 第 3.4 课: 找到瓶颈 (30 分钟, ▶ 1:07)

在负载下分析应用、阅读火焰图、修复热点路径，并用同一个测试证明效果。

/demo/zh/performance-testing/dynamic/bottlenecks.md

学习成果:
- 判断哪种资源是瓶颈：CPU、数据库、网络还是等待
- 录制 Node.js 应用在负载下的 CPU profile，并以火焰图的形式打开
- 修复 CPU 热点路径，并用同一个负载测试证明改进

概念:
- 阅读火焰图
- 哪种资源饱和了？
- 用同一个测试来证明

动手练习 · 25 分钟: **分析 /api/recommendations 并修复它的热点路径**. 在给 /api/recommendations 施加负载时录制 CPU profile，找出热点函数，去掉重复的工作，并用同一个测试展示吞吐量上限的提升。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.4, "Finding the bottleneck".

Exercise: Profile /api/recommendations and fix its hot path
Goal: Record a CPU profile while loading /api/recommendations, identify the hot functions, remove the repeated work, and show the throughput ceiling rise with the same test.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Stop any running instance of the app. Start it with the profiler: `npm run profile` (in the background).
2. Run `npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --vus 10 --duration 10` and capture the result.
3. Stop the app with SIGINT (Ctrl+C) so it writes `profiles/*.cpuprofile`.
4. Summarise the profile with a short Node script: for each function name, total the sample time where it appears on the stack (inclusive), and print the top 10 as percentages.
5. In `src/routes/recommendations.mjs`, load all books once and cache them with their tags already normalised into a Set; normalise the target's tags once per request; compute similarity against the cached Set. Keep the response identical.
6. Start the app normally, compare the response for book_id=7 and book_id=1234 with the pre-fix responses, and rerun the same load command.

Done when:
- The profile summary names the functions that dominated, with percentages
- Responses for book_id=7 and book_id=1234 are identical before and after the fix
- The same load command shows higher req/s and lower p95 than before the fix

Report back:
- Top functions from the profile, before the fix
- The diff of recommendations.mjs
- Load results before and after

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/4-bottlenecks.mdx
```

要点:
- 负载测试告诉你有东西很慢；在同样负载下采集的 profile 告诉你时间花在了哪里。
- 先找出饱和的资源：CPU 达到 100% 说明问题在代码；CPU 很低而延迟很高，说明在等待别的东西。
- 在火焰图中，宽度就是时间。寻找靠近顶部、属于你自己代码的宽帧。
- 每次请求都重复同样的计算，是典型的热点路径。只算一次，并缓存结果。
- 在同一台机器上重新运行发现问题的那个测试，以此证明修复有效。

### 第 3 章 · 小结: 动态测试：小结 (5 分钟, ▶ 0:50)

运行应用之后才知道、仅靠阅读无法发现的事。

/demo/zh/performance-testing/dynamic/summary.md

自测:
1. Lighthouse 报告你的页面 LCP 为 1.5 秒。一位顾客说页面花了五秒才出来。谁错了？
   很可能谁都没错。Lighthouse 是来自一台模拟设备的实验室数据；顾客的手机、网络和缓存都不一样。要看真实的分布，就用现场数据。
2. 在一次压力测试中，从 4 个用户到 32 个用户，req/s 一直保持在 58，而 p95 从 105 毫秒升到 957 毫秒。这说明了什么？
   58 req/s 就是吞吐量上限。超过它之后，多出来的用户只能排队，所以延迟随等待用户数增长。
3. 一次峰值测试通过了：错误率没有超过 5%。在宣称应用具备韧性之前，还应该看什么？
   恢复情况：峰值过后阶段的延迟和错误率应回到峰值之前的水平。
4. 修复之后，为什么要重新运行同一个负载测试，而不是换一个新的？
   这样唯一变化的就是代码。换了测试、数据集或机器，比较就失去了意义。

## 第 4 章: 总结

把两者结合成一套工作流程，报告结果，进行验收，应用到你自己的项目，并回顾整门课程。 (2 小时 15 分钟)

### 第 4 章 · 开篇: 总结 (5 分钟, ▶ 1:08)

把静态和动态测试结合成日常流程，报告结果，进行验收，把它应用到你自己的项目上，并回顾整门课程。

/demo/zh/performance-testing/review.md

学习成果:
- 知道哪些检查在每个拉取请求上运行，哪些在发布前运行，哪些在生产环境中运行
- 把静态门禁和一个简短的负载测试接入 CI 工作流
- 写出一份别人能据此行动、也能重复的性能报告
- 运行验收测试，并记录放行/不放行的决定
- 在你自己的项目上运行静态检查，并把修复交给智能体
- 回顾整门课程，并知道接下来该学什么

### 第 4.1 课: 性能测试工作流程 (25 分钟, ▶ 1:12)

决定什么在哪里运行：每个拉取请求的静态检查、发布前的动态测试，以及生产环境监控。

/demo/zh/performance-testing/review/workflow.md

学习成果:
- 把每种性能检查放到交付流程中合适的阶段
- 用一条命令运行所有静态门禁，并看到其中一项捕获性能退化
- 改造一个运行静态门禁、Lighthouse 和简短 k6 测试的 CI 工作流

概念:
- 交付流水线中的性能检查
- 快速反馈优先
- 让 CI 中的动态测试保持可信

动手练习 · 20 分钟: **运行门禁，然后看它捕获一次性能退化**. 用一条命令运行所有静态门禁，故意重新引入一次性能退化，看到门禁失败，然后改造参考 CI 工作流。

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

要点:
- 在每个拉取请求上运行低成本的静态门禁，在发布前运行动态测试，在生产环境中进行监控。
- 门禁只有让构建失败才有用。确保每项检查在超出限制时以非零状态退出。
- CI 中的负载测试要短，阈值要足够宽松以适应共享运行器；长时间的压力测试和浸泡测试按计划定期运行。
- 把生产环境的数字反馈到预算中。正是这个闭环让性能不会逐渐劣化。

### 第 4.2 课: 报告结果 (20 分钟, ▶ 1:10)

把性能结果写清楚，让人能据此做决定，也让别人能重复这个测试。

/demo/zh/performance-testing/review/reporting.md

学习成果:
- 围绕报告要回答的问题来组织性能报告
- 连同测量条件一起呈现结果，使其可以重复
- 写出指明原因、影响和下一步的发现

概念:
- 课程带来了哪些改变
- 一份有用报告的结构
- 让人信得过的数字

动手练习 · 20 分钟: **撰写 Larkspur 的性能报告**. 把课程中的笔记整理成一页纸的性能报告，包含结论、结果表、发现和局限。

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

要点:
- 先给出测试要回答的问题的答案，再给出证据。
- 每个数字都需要条件：测试了什么、用了多大负载、在哪台机器上、用了哪条命令。
- 报告百分位数和错误率，前后对比要来自同一台机器上的同一个测试。
- 一条发现要说明原因、以用户视角描述的影响，以及建议的下一步。
- 说明你没有测试什么。局限也是结果的一部分。

### 第 4.3 课: 性能验收 (30 分钟, ▶ 2:42)

把预算变成验收标准，用一条命令运行验收测试，并做出一个有人签字确认的放行/不放行决定。

/demo/zh/performance-testing/review/acceptance.md

学习成果:
- 从提出问题到签字确认，完整遵循性能测试方法
- 写出可测量、事先商定、能追溯到预算的验收标准
- 检查准入标准，运行验收测试，并读懂它的结论
- 做出放行/不放行的决定，处理豁免，并记录签字确认

概念:
- 完整的方法
- 准入标准、验收标准和退出标准
- 放行、不放行和豁免

动手练习 · 30 分钟: **运行 Larkspur 的验收测试，修复失败项，并签字确认**. 亲自运行验收测试，让智能体修复任何失败的标准，用同样的测试验证修复，然后写出带有放行/不放行决定的验收记录。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.3, "Performance acceptance".

Exercise: Run Larkspur's acceptance test, fix what fails, and sign it off
Goal: Run the acceptance test yourself, have an agent fix any failing criterion, verify the fix with the same test, and write the acceptance record with a go/no-go decision.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run accept -- --out notes/acceptance-run.md` and capture the full output and the exit code. Exit code 2 means an entry criterion wasn't met: report which one and stop.
2. If the verdict is ACCEPT, report that and stop: there is nothing to fix.
3. For each FAIL row, find the cause with the course's own tools: `npm run budget`, `npm run lint:queries`, `npm run explain`, `npm run check:plans`, `npm run load`, and `npm run profile` for CPU. Name the file and line responsible.
4. Fix one criterion at a time with the smallest change that addresses the cause. After each fix, run that criterion's own check and quote its output.
5. Do not edit `acceptance.json`, `budget.json`, `hot-queries.sql` or any threshold. If you believe a limit is wrong, say so in your report instead.
6. When every fix is in, run `npm run accept -- --out notes/acceptance-run.md` again and capture the output and exit code.
7. Do not record the Lighthouse criteria M1 and M2 and do not write the sign-off; the learner does both.

Done when:
- `npm run accept` exits 0, or every remaining failure is explained with its cause
- Each change is tied to the criterion it fixes
- acceptance.json, budget.json and all thresholds are unchanged

Report back:
- A table of each criterion: limit, measured before, measured after
- The files you changed for each criterion, with a one-line reason
- The full output of the final acceptance run and its exit code

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/3-acceptance.mdx
```

要点:
- 方法是：提出问题，设定预算，建立基线，先静态后动态地测试，一次只修复一件事，用同样的测试验证，然后验收并报告。
- 一条验收标准要指明一个指标、一个限制，以及测量它的条件。它在测试之前商定，并能追溯到一项预算。
- 准入标准决定一次运行是否算数：正确的构建、已填充的数据、一台空闲的机器。不满足准入标准的运行是无效的，而不是失败的。
- 任何一条标准失败都意味着不放行，除非有一位具名的人书面接受这个风险，并注明到期日期和后续跟进。
- 绝不为了让一次运行通过而放宽限制。修改标准是一个单独的决定，要在下一次运行之前做出。
- 智能体实现修复；你运行验收测试、读懂数字并签字。记录中包含命令、机器、提交和每一项结果。

### 第 4.4 课: 在你自己的项目上做静态测试 (45 分钟, ▶ 2:19)

亲自在真实的代码库上运行课程中的静态检查，读懂数字，设定最初的预算，并把修复交给智能体。

/demo/zh/performance-testing/review/your-project.md

学习成果:
- 为你自己的技术栈找到与课程中每项静态检查对应的做法
- 在一个用户旅程上亲自运行它们，并记录基线
- 把基线变成最初的预算和一道门禁
- 把一条发现交给智能体，然后用同样的命令验证它的修复

概念:
- 四个问题，适用于任何技术栈
- 读懂真实的数字
- 从基线到预算

动手练习 · 15 分钟: **找到适合你的技术栈的静态检查**. 让智能体把课程中的四项静态检查对应到你的仓库所用的技术栈上，写成你将亲自运行的命令。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Find the static checks for your stack
Goal: Have an agent map the course's four static checks onto your repository's stack, as commands you will run yourself.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Identify the stack from the repository: languages, framework, build tool and its output folder, ORM or database library, and database engine. Quote the files you read.
2. For each of these four questions, give one concrete command or procedure for this repository, preferring tools the project already has: (1) the weight of the production build's scripts, stylesheets and images, gzipped where the server compresses; (2) the number of database queries per request on one endpoint; (3) the query plan of the endpoint's main queries, and how to tell a full scan from an index search on this database; (4) which scripts or stylesheets block the first render.
3. Write `perf/STATIC-CHECKS.md` with one section per question: the command, what it measures, how to read its output, and any setting that must be switched on first (for example query logging in development).
4. If a check needs a new dev dependency, name it and why, and don't install it.
5. Do not run load tests, and do not change application code or configuration. The learner runs the checks.

Done when:
- perf/STATIC-CHECKS.md has a command and reading guide for all four questions
- Every command fits this repository's stack, paths and tools
- No application code or configuration changed

Report back:
- A summary of the stack, with the files that show it
- The four commands, in a table
- Any new dev dependencies the learner would need to approve

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

动手练习 · 30 分钟: **修复一条发现并添加一道门禁**. 让智能体修复基线中的一条发现，并添加一道能再次捕获它的门禁；然后用你自己的运行来验证。

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Fix one finding and add a gate
Goal: Have an agent fix one finding from your baseline and add a gate that would catch it again; then verify it with your own run.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Read `perf/baseline.md` and `perf/STATIC-CHECKS.md`. Work on the finding the learner names; if none is named, take the one furthest over its budget, and say which you chose.
2. Create a new branch. Before changing anything, run the finding's check from STATIC-CHECKS.md and quote the output.
3. Find the cause and name the file and line. Make the smallest change that removes it. Keep behaviour the same; run the project's existing tests and quote the result.
4. Run the same check again and quote the output, so before and after come from the same command.
5. Add a gate that fails if this regresses, using the project's existing test or CI setup: for example a test that asserts the number of queries for the endpoint, or a bundle-size limit in CI. Make sure it exits non-zero on a breach.
6. Do not change any budget in perf/baseline.md. Do not push, merge or deploy.

Done when:
- The finding's check shows the improvement, before and after quoted from the same command
- The project's existing tests pass
- A gate exists that fails when the problem comes back

Report back:
- The cause, with file and line
- Before and after output of the check
- The gate you added and how to run it
- The branch name and the list of changed files

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

要点:
- 四个静态问题适用于任何技术栈：我们交付的内容有多重，每个请求执行多少次查询，每条热点查询是否使用了索引，以及什么阻塞了渲染。
- 第一次要亲自运行这些检查。阅读真实的输出，才能了解你的代码库中什么是正常的；而决定什么可以接受的人是你。
- 先测量一个用户旅程，而不是整个应用。一个能重复的基线胜过一次无法重复的全面普查。
- 每个请求的查询数随页面大小增长，以及请求路径上对大表的全表扫描，在任何技术栈上都是发现。
- 把最初的预算设在略高于当前数字的位置，让门禁现在能通过，并能捕获下一次性能退化；随着修复落地再逐步收紧。
- 智能体提出命令，编写修复和门禁；你运行检查、读懂数字并批准。

### 第 4 章 · 小结: 课程总结 (10 分钟, ▶ 0:54)

课程涵盖的全部内容汇总在一处，以及接下来可以学什么。

/demo/zh/performance-testing/review/summary.md

自测:
1. 一位同事想把每晚 4 小时的浸泡测试设为每个拉取请求的必需检查。你会建议怎么做？
   拉取请求上只保留快速的静态门禁（最多再加一个简短的负载测试）。浸泡测试按计划在稳定的环境中定期运行，并对其结果设置告警。
2. 你的负载测试周一在 CI 中通过，周二在没有任何代码改动的情况下失败了。你首先要做什么？
   重新运行并比较。共享运行器噪声很大；检查失败能否复现、同一台机器上是否运行了其他作业，以及与阈值之间的余量是否太小。
3. 说出 Larkspur 中一个由静态测试先发现的问题，以及一个只有动态测试才发现的问题。
   静态：N+1 循环、全表扫描或过重的资源。动态：推荐接口中的 CPU 热点路径，它不符合任何静态规则。
4. 怎样的性能发现才是可据以行动的？
   它指出原因及其位置、以用户视角描述并附有测量数字的影响、修复方法，以及别人可以核实的证据。
5. 发布前一天，验收运行中的 D3 超出上限 20 毫秒。产品负责人要求你把上限提高到 450 毫秒，好让它通过。你怎么做？
   不要为了通过而修改上限。如实报告这次失败。如果发布不能推迟，可以由产品负责人签署一份带有到期日和后续跟进的豁免；修改验收标准本身是另一项决定，从下一次运行开始生效。
6. 智能体报告说，它修复了你项目里的一个 N+1 问题，现在这个接口只运行 3 条查询。你怎么验收？
   在同一个用户旅程上亲自重新运行同一个检查，把你的数字和它引用的数字对比。然后在本地故意撤销修复，确认新加的门禁会失败，最后像审查其他改动一样审查这个分支再合并。
