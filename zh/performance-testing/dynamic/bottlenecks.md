# 第 3.4 课: 找到瓶颈

性能测试 · 第 3 章: 动态测试 · 30 分钟

> 在负载下分析应用、阅读火焰图、修复热点路径，并用同一个测试证明效果。

**学完本课你将能够:**
- 判断哪种资源是瓶颈：CPU、数据库、网络还是等待
- 录制 Node.js 应用在负载下的 CPU profile，并以火焰图的形式打开
- 修复 CPU 热点路径，并用同一个负载测试证明改进

## 文字稿: 找到瓶颈 (1:07)

**0:00 引言.** 压力测试表明，推荐接口卡在每秒约 58 个请求。现在我们来找出原因。

**0:07 什么耗尽了？.** 先找出是哪种资源耗尽了。在压力测试下，Node 进程占满了一个核心的百分之百。 一个核心被占满，说明代码本身就是限制。该做 CPU 分析了。

**0:20 阅读火焰图.** 应用承受负载时，CPU 分析器每秒对调用栈采样大约一千次。 火焰图把这些样本合并起来。宽度是时间占比；每往上一层，就是被下一层调用的函数。 recommend 占了三分之二的样本。在它内部，similarity 和 normalise 在每一次请求中都重新解析每本书的标签。 只解析一次标签并保存下来，热点帧就缩小了。

**0:48 只做一次.** 修复方法：只加载一次图书目录，把每本书的标签一次性规范化到一个 Set 中，并在每次请求中只规范化一次目标图书的标签。 同一个测试，同一台机器：每秒 57 个请求变成了 699 个。响应完全相同。

## 课文

压力测试表明，推荐接口卡在每秒约 58 个请求。但它没有说明原因。要知道原因，就得在同样的负载下查看进程内部。

## 哪种资源饱和了？

每个请求都会消耗一些 CPU、等待数据库或磁盘，并等待网络。在负载下，其中某一项会最先耗尽。在做性能分析之前先检查一下：

| 负载下的症状 | 可能的瓶颈 | 用什么查看 |
| --- | --- | --- |
| 应用进程占满约 100% 的一个核心 | 你代码中的 CPU | CPU profile |
| CPU 低，延迟高 | 等待：数据库、锁、其他服务 | 查询日志、链路追踪 |
| 数据库 CPU 高 | 查询 | 查询计划（第 2.3 课） |
| 错误先于延迟上升 | 限制：连接数、文件句柄、内存 | 服务器日志、指标 |

运行压力测试，并在 `top` 或活动监视器中观察 Node 进程：它占满了一个核心的 100%。Node 在单线程上运行你的 JavaScript，所以一个核心被占满，就意味着代码本身就是限制。该做 CPU 分析了。

## 阅读火焰图

> **概念动画: 阅读火焰图**
>
> 1. 应用承受负载时，CPU 分析器每秒对调用栈采样大约一千次。
> 2. 火焰图把这些样本合并起来。宽度是时间占比；每往上一层，就是被下一层调用的函数。
> 3. recommend 占了 67% 的样本。在它内部，similarity 和 normalise 在每次请求中都重新解析每本书的标签。
> 4. 只解析一次标签并保存下来：热点帧缩小了，10 个用户时的吞吐量从每秒 57 个请求提升到 699 个。

`npm run profile` 会用 Node 内置的采样分析器启动应用。负载运行期间，它每秒大约记录一千次调用栈。应用退出时，它会写出一个 `.cpuprofile` 文件，你可以在 Chrome DevTools 中打开它（Performance 面板，然后点 **Load profile**），也可以把它拖到 [speedscope.app](https://www.speedscope.app) 上。

火焰图要从下往上读。每一条是一个函数；它上面的条是它调用的函数。**宽度就是时间。** 寻找属于你自己代码的宽条：

| 函数 | 样本占比 | 它在做什么 |
| --- | --- | --- |
| `recommend` | 67% | 整个接口 |
| `similarity` | 36% | 把目标图书与 5,000 本书逐一比较 |
| `normalise` | 27% | 对标签字符串做拆分、去空白、转小写和排序 |
| `all` | 11% | 每次请求都从 SQLite 加载全部 5,000 本书 |

下面是 `similarity` 和 `normalise` 所在的代码：

```js title="src/routes/recommendations.mjs"
function similarity(a, b) {
  const left = normalise(a);   // 同样的目标标签，被重新解析 5,000 次
  const right = normalise(b);  // 每本书的标签，每次请求都重新解析
  // …
}
```

这里面严格来说没有什么错误。它只是一遍又一遍地做同样的工作：每次请求中目标图书的标签被规范化 5,000 次，而每本书的标签在每次请求中都要重新规范化，尽管图书很少变化。没有任何静态检查标记它，因为这里没有可以匹配的慢模式，只有大量的重复。

## 修复：只做一次

只加载一次图书目录，把每本书的标签一次性规范化到一个 `Set` 中，并在每次请求中只规范化一次目标图书的标签：

```js title="src/routes/recommendations.mjs (after)"
let cached;
function catalogue() {
  return (cached ??= query("SELECT id, title, tags FROM books").all()
    .map((b) => ({ ...b, tagSet: new Set(normalise(b.tags)) })));
}

export function recommend(params) {
  // …
  const mine = normalise(target.tags);
  const scored = catalogue()
    .filter((b) => b.id !== id)
    .map((b) => ({ id: b.id, title: b.title, score: similarity(mine, b.tagSet) }))
  // …
}
```

> **缓存是一个决定.** 这个缓存永不过期，对练习应用来说没问题，但对会上新书的真实书店来说是错的。在生产环境中，要定时刷新它，或在图书目录变化时刷新，并在代码里写明这一点。

| 同一个测试，10 个用户 | 修复前 | 修复后 |
| --- | --- | --- |
| 吞吐量 | 57 req/s | 699 req/s |
| p95 | 347 ms | 26 ms |
| 32 个用户时的 p95 | 957 ms | 77 ms |

## 动手练习：分析 /api/recommendations 并修复它的热点路径

**动手练习 · 25 分钟.** 目标： 在给 /api/recommendations 施加负载时录制 CPU profile，找出热点函数，去掉重复的工作，并用同一个测试展示吞吐量上限的提升。

1. 如果应用正在运行，先停止它，然后用分析器启动它，并在第二个终端中施加负载：

   ```bash
   npm run profile
   npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --vus 10 --duration 10
   ```

2. 在应用的终端中按 Ctrl+C。应用会正常退出，正是这次正常退出让分析器写出 `profiles/CPU.….cpuprofile`。（如果用 `kill -9` 杀掉进程，就不会写出 profile。）
3. 在 Chrome DevTools 中打开 profile：**Performance** 面板，**Load profile**，然后切换到 bottom-up 视图或火焰图视图。

![Chrome DevTools 的 Performance 面板，以火焰图显示已加载的 CPU profile。重复出现的调用栈以 recommend 为底，上面叠着 similarity 和 normalise，占据了大部分宽度，顶部是对 split、map 和 filter 的短调用。](screenshot-pending)
*Screenshot (DevTools · Performance · CPU.cpuprofile): recommend → similarity → normalise，一遍又一遍。*

4. 保存当前的响应，应用修复，正常重启后进行比较：

   ```bash
   curl -s "http://localhost:3000/api/recommendations?book_id=7" > /tmp/rec-before.json
   ```

5. 重新运行第 1 步中完全相同的负载命令，并与你在第 3.3 课得到的数字比较。

![迷你负载工具针对 /api/recommendations、10 个虚拟用户的两行结果。修复前：约每秒 57 个请求，p95 约 347 毫秒。修复后：约每秒 699 个请求，p95 约 26 毫秒。](screenshot-pending)
*Screenshot (npm run load): 同一个测试，同一台机器：吞吐量提升到十二倍。*

**完成标准**
- The profile summary names the functions that dominated, with percentages
- Responses for book_id=7 and book_id=1234 are identical before and after the fix
- The same load command shows higher req/s and lower p95 than before the fix

**智能体的部分：把实现交给它**

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

## 要点

- 负载测试告诉你有东西很慢；在同样负载下采集的 profile 告诉你时间花在了哪里。
- 先找出饱和的资源：CPU 达到 100% 说明问题在代码；CPU 很低而延迟很高，说明在等待别的东西。
- 在火焰图中，宽度就是时间。寻找靠近顶部、属于你自己代码的宽帧。
- 每次请求都重复同样的计算，是典型的热点路径。只算一次，并缓存结果。
- 在同一台机器上重新运行发现问题的那个测试，以此证明修复有效。

---

上一页: [第 3.3 课: 压力、峰值与浸泡测试](/demo/zh/performance-testing/dynamic/stress-spike-soak.md)
下一页: [第 3 章 · 小结: 动态测试：小结](/demo/zh/performance-testing/dynamic/summary.md)
