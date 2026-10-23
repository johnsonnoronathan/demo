# 第 1.1 课: 性能测试测量什么

性能测试 · 第 1 章: 概述 · 20 分钟

> 延迟、吞吐量和错误：每次性能测试都会报告的三个数字，以及为什么延迟要用百分位数来表示。

**学完本课你将能够:**
- 说出性能测试报告的三个数字，以及每个数字反映了用户的什么体验
- 读懂 p50、p95 和 p99，并解释为什么平均值会掩盖问题
- 运行练习应用，完成第一次可重复的测量

## 文字稿: 性能测试测量什么 (1:26)

**0:00 引言.** 无论用什么工具，性能测试都会报告三个数字。我们来认识一下它们。

**0:07 三个数字.** 延迟：一个请求要花多长时间，单位是毫秒。 吞吐量：每秒能完成多少个请求。 还有错误率：失败或超时的请求所占的比例。 这三个数字会一起变化。当系统接近极限时，吞吐量不再上升，延迟开始攀升，紧接着就会出现错误。

**0:30 百分位数.** 把同一个请求发送 400 次，你会得到 400 个不同的耗时。 按耗时堆叠起来，它们会形成一个驼峰，右侧拖着一条由慢请求组成的长尾。 中位数，也就是 p50，代表典型请求。一半比它快，一半比它慢。 p95 和 p99 描述的是长尾。每二十个用户中，就有一个要等待至少 p95 那么久。 平均值落在中间，却不对应任何真实的请求。所以预算和阈值都使用百分位数。

**1:04 第一次测量.** 在练习中，你会启动练习应用，请求一页图书。响应显示它执行了 101 次数据库查询。 然后给它施加轻量负载：10 个虚拟用户，持续 20 秒。 在我们的机器上，结果是每秒 16 个请求，p95 超过 1 秒。把它连同你运行的命令一起记下来，这就是你的基线。

## 课文

性能测试回答的是这样的问题：“顾客要等多久？”以及“在体验变差之前，我们能承受多少流量？”。无论用什么工具，答案都以三个数字的形式给出。

| 数字 | 回答的问题 | 单位 |
| --- | --- | --- |
| **延迟**（响应时间） | 一个请求要花多长时间？ | 毫秒 |
| **吞吐量** | 每秒完成多少个请求？ | 每秒请求数（req/s） |
| **错误率** | 有多大比例的请求失败或超时？ | 百分比 |

这三个数字会一起变化。当系统接近极限时，吞吐量不再上升，延迟开始攀升，紧接着就会出现错误。第 3 章会展示 Larkspur 上发生的这一过程。

## 延迟是一个分布

把同一个请求发送几百次，你会得到几百个不同的耗时。大多数彼此接近；少数会慢得多，原因可能是垃圾回收暂停、缓存未预热或数据库繁忙。播放动画，看看它们形成的形状。

> **概念动画: 延迟是一个分布**
>
> 1. 每个请求花费的时间都不一样。这里是发往同一个接口的 400 个请求。
> 2. 按耗时堆叠起来，它们形成一个隆起，右侧拖着长长的尾巴。
> 3. 中位数 p50 代表典型请求：95 毫秒。一半更快，一半更慢。
> 4. p95 和 p99 描述尾部：371 毫秒和 556 毫秒。每二十个用户中就有一个至少要等 371 毫秒。
> 5. 平均值 133 毫秒不对应任何真实请求，还掩盖了尾部。预算和阈值都使用百分位数。

由于存在这条长尾，延迟要用**百分位数**来报告。p95 是 95% 的请求都能快于它的耗时；另外 5% 更慢。可以把它理解为每二十个用户中有一个人的体验，而在繁忙的网站上，这是很多人。

| 统计量 | 它告诉你什么 | 用途 |
| --- | --- | --- |
| p50（中位数） | 典型请求 | 发现大范围的性能退化 |
| p95 | 大多数用户迟早会遇到的慢速长尾 | 预算和测试阈值 |
| p99 | 经常出现的最差体验 | 长尾很重要的系统（结账、登录） |
| max | 一个离群值 | 用于排查，绝不用于预算 |
| 平均值 | 没有任何真实用户经历过的东西 | 避免使用 |

平均值会被慢速长尾拉高，但仍然远低于长尾本身，因此它会掩盖那些让人抱怨的请求。本课程中的每个预算和阈值都使用百分位数。

## 吞吐量和错误

吞吐量是已完成请求的速率。单独看它说明不了什么：16 req/s 对一个小店来说绰绰有余，对一场门票抢购来说却是灾难。只有和延迟放在一起才有意义，比如“16 req/s 时 p95 低于 300 ms”。

错误率让另外两个数字保持可信。一台快速失败的服务器可以交出很漂亮的延迟数字。在庆祝提速之前，一定要先检查错误。

## 可重复的测量

没有测量条件的数字算不上测量。至少要记录：

- 接口或页面，
- 多少个虚拟用户、持续多长时间，
- 所用的机器，以及当时是否有其他程序在运行，
- 确切的命令。

这样，你自己、同事或智能体就能在改动之后再次运行，并在相同条件下进行比较。

## 动手练习：搭建 Larkspur 并完成第一次测量

**动手练习 · 15 分钟.** 目标： 让练习应用跑起来，并为 /api/books 记录一条基线：10 个用户下的查询次数、p50、p95 和吞吐量。

1. 构建数据库。只需几秒钟，完成后会打印创建的内容。

   ```bash
   cd academy/practice/larkspur
   npm run seed
   ```

2. 在单独的终端中启动应用，并让它保持运行。

   ```bash
   npm start
   # Larkspur Books on http://localhost:3000
   ```

![Larkspur Books 店面：页眉，一张大幅书架照片，标题为“Find your next favourite book”，下方是新书网格，显示书名、作者、价格和星级评分。](screenshot-pending)
*Screenshot (localhost:3000): 你将要测试的店面。它加载得很慢，第 3 章会解释原因。*

3. 请求一页图书并查看响应头。Larkspur 会报告该请求执行了多少次数据库查询，以及服务器在它上面花了多长时间。

   ```bash
   curl -s -i http://localhost:3000/api/books | head -4
   ```

   ```text
   HTTP/1.1 200 OK
   content-type: application/json
   x-query-count: 101
   server-timing: app;dur=60.4
   ```

   一页 50 本书要执行 101 次查询，这一点值得记住。第 2.2 课会解释它。

4. 施加轻量负载：使用应用自带的负载工具，让 10 个虚拟用户运行 20 秒。

   ```bash
   npm run load -- --url http://localhost:3000/api/books --vus 10 --duration 20
   ```

![迷你负载工具的终端输出：一行结果，10 个虚拟用户运行 20 秒，约每秒 16 个请求，p50 约 570 ms，p95 约 1,300 ms，0 个错误，每个请求 101 次查询。](screenshot-pending)
*Screenshot (npm run load): 你的数字会有所不同。在我们的机器上：16 req/s，p50 573 ms，p95 1,320 ms，每个请求 101 次查询。*

5. 把结果连同你运行的命令写入 `notes/perf-baseline.md`。之后每次修复，你都要和它进行比较。

**完成标准**
- notes/perf-baseline.md exists and every number in it appears in the command output you captured
- The baseline names the endpoint, the number of virtual users and the duration

**智能体的部分：把实现交给它**

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

## 要点

- 延迟是一个请求花费的时间，吞吐量是每秒完成的请求数，错误率是失败请求所占的比例。
- 延迟是一个分布。要报告百分位数：p50 代表典型请求，p95 和 p99 代表慢速长尾。
- 平均值把快请求和慢请求混在一起，得到一个没有任何用户真正经历过的数字。不要基于平均值设定预算。
- 记下你是如何测量的（用户数、时长、接口），这样数字才能被重复和比较。

---

上一页: [第 1 章 · 开篇: 概述](/demo/zh/performance-testing/overview.md)
下一页: [第 1.2 课: 静态测试与动态测试](/demo/zh/performance-testing/overview/static-and-dynamic.md)
