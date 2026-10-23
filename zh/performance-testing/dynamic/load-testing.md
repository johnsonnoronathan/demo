# 第 3.2 课: 用 k6 做负载测试

性能测试 · 第 3 章: 动态测试 · 30 分钟

> 模拟一个购物高峰的夜晚，让阈值判断应用是否满足预算。

**学完本课你将能够:**
- 解释虚拟用户、迭代、思考时间和阶段
- 编写带检查、标签和阈值的 k6 脚本
- 读懂 k6 汇总结果，并解释失败的阈值

## 文字稿: 用 k6 做负载测试 (1:21)

**0:00 引言.** 你的计划规定，在 50 个顾客同时购物时，图书接口的 p95 应在 300 毫秒以内。只有负载测试能验证这一点。

**0:09 脚本.** k6 脚本就是 JavaScript。阶段规定运行多少个虚拟用户、运行多久。 阈值规定怎样才算通过：图书接口的 p95 低于 300 毫秒，订单接口低于 200 毫秒。 sleep 加入了思考时间，让每个虚拟用户像一个正在看页面的人，而不是一挺机关枪。

**0:30 负载测试如何工作.** k6 启动虚拟用户。每个用户循环运行你的脚本：浏览、思考、查看订单、思考、打开一本书。 阶段让用户数逐步增加：30 秒内从 0 增加到 50 个用户，保持一分钟，再逐步减少。 k6 为每个请求计时。在第二章的修复之前，随着用户不断涌入，图书接口的 p95 攀升到超过一秒。 阈值把它变成了失败。订单接口也失败了，尽管它单独运行时很快：Node 只在一个线程上运行，慢接口拖住了其他所有请求。

**1:06 修复之后.** 完成静态修复之后，同一个测试通过了，而且绰绰有余。 这回答了计划中关于 50 个用户的问题。但它没有说明应用还能多承受多少用户。那是下一课的内容。

## 课文

你的计划中的预算规定：在 50 个顾客同时购物时，`/api/books` 的 p95 应在 300 ms 以内。只有一种测试能验证这一点：让相当于 50 个顾客的流量经过应用，然后测量。

> **概念动画: k6 负载测试如何工作**
>
> 1. k6 启动虚拟用户。每个用户循环运行你的脚本：浏览、思考、查看订单、思考、打开一本书。
> 2. 阶段控制同时运行的用户数：30 秒内从 0 增加到 50 个用户，保持一分钟，再逐步减少。
> 3. k6 为每个请求计时，并按接口报告百分位数。随着用户增多，图书接口的 p95 不断攀升。
> 4. 阈值把数字变成通过或失败。图书接口的 p95 是 1.17 秒，上限是 300 毫秒，所以这次运行失败。

## 脚本

k6 脚本就是 JavaScript。默认导出的函数是一个虚拟用户的一次**迭代**；`options` 规定运行多少用户、运行多久，以及怎样才算通过。

```js title="load/load.k6.js"
export const options = {
  stages: [
    { duration: "30s", target: 50 }, // 逐步加压
    { duration: "1m", target: 50 },  // 保持：一个繁忙的夜晚
    { duration: "15s", target: 0 },  // 逐步减压
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    "http_req_duration{endpoint:books}": ["p(95)<300"],
    "http_req_duration{endpoint:orders}": ["p(95)<200"],
    "http_req_duration{endpoint:recommendations}": ["p(95)<400"],
  },
};

export default function () {
  group("browse", () => {
    const page = 1 + Math.floor(Math.random() * 20);
    const res = http.get(`${BASE}/api/books?page=${page}`, { tags: { endpoint: "books" } });
    check(res, { "books 200": (r) => r.status === 200 });
  });
  sleep(1); // 思考时间
  // …然后是订单、sleep、带推荐的图书页面、sleep
}
```

负载测试和压力发生器之间的区别，就在于三个细节：

- **思考时间。** 请求之间的 `sleep(1)` 让每个虚拟用户像一个正在阅读页面的人。没有它，50 个虚拟用户发出的流量会远远多于 50 个真人。
- **多样的数据。** 随机的页码、顾客和图书让请求分散到整个数据集中，就像真实流量一样。每次都请求同一行，测到的是缓存，而不是应用。
- **标签。** `tags: { endpoint: "books" }` 让每个接口有自己的百分位数和自己的阈值。

## 检查与阈值

**检查**测试单个响应（“状态码是 200”）并记录结果；它从不中止测试。**阈值**用预算评判整次运行，一旦越线，k6 就会以非零退出码结束。正是这个退出码，让负载测试可以把关发布。

## 汇总结果告诉你什么

下面是对第 2 章修复**之前**的 Larkspur 运行负载测试的结果：

```text
  █ THRESHOLDS

    http_req_duration{endpoint:books}
    ✗ 'p(95)<300' p(95)=1.17s

    http_req_duration{endpoint:orders}
    ✗ 'p(95)<200' p(95)=941.52ms

    http_req_duration{endpoint:recommendations}
    ✗ 'p(95)<400' p(95)=968.7ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%
```

图书接口失败不足为奇。但订单和推荐接口也失败了，尽管它们单独运行时快得多。Node.js 在单线程上运行 JavaScript，而这里的 SQLite 调用是同步的：当一个请求在执行 101 次查询时，其他所有请求都只能排队等待。**一个慢接口拖慢所有接口。** 这是针对单个接口的微基准测试永远发现不了的。

完成第 2 章的修复后，在同一台机器上运行同一个测试：

```text
    ✓ 'p(95)<300' p(95)=10.29ms      books
    ✓ 'p(95)<200' p(95)=8.98ms       orders
    ✓ 'p(95)<400' p(95)=34.33ms      recommendations
    ✓ 'rate<0.01' rate=0.00%
```

每项预算都通过了。这回答了计划中关于 50 个用户的问题。但它没有说明应用最多能承受多少用户，也没有说明突发流量来时会怎样。这些是下一课的问题。

## 动手练习：先运行冒烟测试，再运行负载测试

**动手练习 · 20 分钟.** 目标： 对 Larkspur 运行 load/smoke.k6.js 和 load/load.k6.js，并记录哪些阈值通过。

1. 先做一次**冒烟测试**：1 个用户，运行 30 秒。如果它失败了，说明脚本或应用有问题，这时跑大规模测试只会带来大量困惑。

   ```bash
   k6 run load/smoke.k6.js
   ```

2. 运行负载测试。它需要将近两分钟。

   ```bash
   k6 run load/load.k6.js
   ```

![k6 运行汇总的末尾。THRESHOLDS 部分列出四个阈值，都带有绿色对勾：books 的 p95 约 10 毫秒，orders 的 p95 约 9 毫秒，recommendations 的 p95 约 34 毫秒，失败请求 0.00%。下方是 TOTAL RESULTS，检查通过率 100%，以及按接口列出的 HTTP 请求耗时。](screenshot-pending)
*Screenshot (k6 run load/load.k6.js): 完成第 2 章的修复后，50 个用户下四个阈值全部通过。*

3. 如果你跳过了第 2 章的修复，你的运行结果会像上面“修复前”的输出一样失败。可以试试：`git stash`，重启应用，再运行一次，然后 `git stash pop`。
4. 把结果记录到 `notes/load-test.md`。

没有 k6？可以用内置工具按接口运行同样形态的流量，例如 `npm run load -- --url "http://localhost:3000/api/books?page=1" --vus 50 --duration 60`。它没有思考时间，所以延迟会比 k6 报告的更高。

**完成标准**
- The smoke test passed before the load test ran
- notes/load-test.md lists every threshold with pass or fail and the measured value

**智能体的部分：把实现交给它**

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

## 要点

- 虚拟用户循环运行你的脚本。阶段决定随时间推移同时运行多少个虚拟用户。
- 思考时间（sleep）让每个用户的行为像真人，所以 50 个虚拟用户接近 50 个真实顾客。
- 检查验证每个响应；阈值把整次运行的百分位数和错误率变成通过或失败。
- 按接口给请求打标签，让每个接口有自己的阈值。在单线程服务器上，一个慢接口会拖延其他所有接口。
- 总是先运行一次简短的冒烟测试，在加负载之前证明脚本和应用都能正常工作。

---

上一页: [第 3.1 课: 用 Lighthouse 做实验室测量](/demo/zh/performance-testing/dynamic/lighthouse.md)
下一页: [第 3.3 课: 压力、峰值与浸泡测试](/demo/zh/performance-testing/dynamic/stress-spike-soak.md)
