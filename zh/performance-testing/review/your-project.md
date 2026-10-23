# 第 4.4 课: 在你自己的项目上做静态测试

性能测试 · 第 4 章: 总结 · 45 分钟

> 亲自在真实的代码库上运行课程中的静态检查，读懂数字，设定最初的预算，并把修复交给智能体。

**学完本课你将能够:**
- 为你自己的技术栈找到与课程中每项静态检查对应的做法
- 在一个用户旅程上亲自运行它们，并记录基线
- 把基线变成最初的预算和一道门禁
- 把一条发现交给智能体，然后用同样的命令验证它的修复

## 文字稿: 在你自己的项目上做静态测试 (2:19)

**0:00 引言.** Larkspur 慢得很有教学意义。你自己的项目会以它自己的方式变慢，而要弄清楚是怎么慢的，唯一的办法就是在它上面运行这些检查。

**0:12 为什么要亲自运行.** 智能体可以运行本课中的每一条命令。那为什么还要亲自运行？ 因为阅读真实的输出就是这项技能本身。看过自己代码的数字，你才知道什么是正常的。 因为一个数字是否可以接受取决于你的用户，这由你来判断。 还因为当智能体之后说已经修好了，你的运行结果就是证据。

**0:41 四个问题.** 第 2 章的四个静态问题几乎适用于任何技术栈。我们交付的内容有多重？ 一个请求执行多少次查询？这个数字会随页面大小增长吗？ 每条热点查询是使用了索引，还是扫描了一张大表？ 还有，是什么阻塞了首次渲染？

**1:03 基线.** 选一个用户旅程：用户最常进入的页面，以及它发出的调用。 称量生产构建，而不是开发构建。统计一个请求的查询数，再统计一个两倍长的页面的查询数。 Explain 最主要的查询，每次都用同一张表把结果全部记下来。这就是你的基线。

**1:26 读懂数字.** 真实的输出比 Larkspur 的噪声更大。增长比大小更重要：页面翻倍时查询数也翻倍，那就是 N+1。 只有大表上的扫描才要紧。扫描一张四十行的查找表很正常。 最初的预算要设在略高于当前数字的位置，让门禁现在能通过，并能捕获下一次性能退化。

**1:50 交给智能体.** 两段智能体提示词完成剩下的工作。第一段把四项检查对应到你的技术栈上，写成由你亲自运行的命令。 第二段在一个新分支上修复一条发现，并添加一道门禁，问题再出现时就会失败。 然后你亲自重新运行检查，故意弄坏修复来看门禁失败，并像审查其他任何改动一样审查这个分支。

## 课文

Larkspur 是有意做得很慢的，慢得很有教学意义。你自己的项目也会以它自己的方式变慢，而要弄清楚是怎么慢的，唯一的办法就是在它上面运行这些检查。本课就是一座桥梁：同样的四个静态问题，用在真实的代码库上，由你运行检查，由智能体负责修复。

## 为什么要亲自运行

智能体可以运行本课中的每一条命令，那为什么还要手工来做？有三个理由：

- **阅读真实的输出就是这项技能本身**。知道 90 KB 的脚本已经很多，或者一个页面执行 12 次查询值得怀疑，这种判断来自亲眼见过你自己代码的数字。
- **决定权在你**。一个数字是否可以接受取决于你的用户，而智能体并不了解他们。
- **你的运行结果就是证据**。当智能体之后说“修好了”，你重新运行同样的命令，亲眼看到结果。

静态检查让这件事的成本很低：它们都不需要负载、预发布环境或特殊硬件。大多数只需几秒钟。

## 四个问题，适用于任何技术栈

第 2 章中的每项静态检查都回答了一个几乎适用于任何 Web 应用的问题。下面是在常见技术栈上提出这些问题的方法：

| 问题 | Larkspur | 你的项目 |
| --- | --- | --- |
| **我们交付的内容有多重？** | `npm run budget` | 构建生产版本，然后称量输出（命令见下文）。作为门禁：JavaScript 用 [size-limit](https://github.com/ai/size-limit)，或者用 Lighthouse CI 的资源体积断言。 |
| **每个请求执行多少次查询？** | `npm run lint:queries`、`x-query-count` 响应头 | 在开发环境中打开查询日志，统计每个请求对应的行数。Django：在测试中使用 `assertNumQueries`。Rails：`bullet` gem。Laravel：`Model::preventLazyLoading()`。Hibernate：`hibernate.generate_statistics=true`。Prisma：`log: ['query']`。 |
| **每条热点查询都使用了索引吗？** | `npm run explain`、`npm run check:plans` | PostgreSQL：`EXPLAIN (ANALYZE, BUFFERS)`；查找大表上的 `Seq Scan`。MySQL 8：`EXPLAIN FORMAT=TREE`；查找 `Table scan`。SQLite：`EXPLAIN QUERY PLAN`；查找 `SCAN`。 |
| **什么阻塞了首次渲染？** | `public/index.html` 中的 `<script>` 标签 | 查找 `<head>` 中没有 `defer`、`async` 或 `type="module"` 的 `<script src>`，以及体积较大的样式表。Lighthouse 会把它们列在“Eliminate render-blocking resources”（消除阻塞渲染的资源）下。 |

要找出值得 explain 的查询，就从实际运行最多的开始：PostgreSQL 中按 `total_exec_time` 排序的 `pg_stat_statements`、MySQL 的慢查询日志，或者干脆用走一遍用户旅程得到的查询日志。

> **EXPLAIN ANALYZE 会执行查询.** `EXPLAIN ANALYZE` 会真正执行语句来计时。对开发数据库上的 `SELECT` 来说这没有问题。对任何会写入数据的语句，请使用普通的 `EXPLAIN`，或者把它放进一个最后回滚的事务中。

## 分步操作

**1. 选一个用户旅程**。用户最常进入的页面，以及它发出的两三个 API 调用。对整个应用做全面普查很诱人，但很少能做完。

**2. 称量生产构建**。开发构建没有压缩，体积大得多，它们的数字会误导你。对于 JavaScript 前端：

```bash
npm run build
find dist -type f \( -name '*.js' -o -name '*.css' \) | while read -r f; do
  printf '%8.1f KB  %s\n' "$(gzip -c "$f" | wc -c | awk '{print $1/1024}')" "$f"
done | sort -rn | head -15
```

把 `dist` 换成你的构建输出目录（`build`、`.next/static`、`public/assets`…）。然后查找超过 200 KB 的图片：`find dist public -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) -size +200k`。

**3. 统计每个请求的查询数**。在开发环境中打开查询日志，请求某个接口一次，统计它执行了多少次查询。然后请求一个条目数加倍的页面。如果查询数也翻倍了，你就遇到了 N+1。

**4. Explain 最主要的查询**。从第 3 步中取出最慢或最频繁的三条查询，用你的数据库的 `EXPLAIN` 运行它们。记下每一次对超过几千行的表的全表扫描。

**5. 把它写下来**。每次都用同样的格式，这样下一次运行就能和这一次比较：

```md title="perf/baseline.md"
# 静态基线：<用户旅程>，<日期>，提交 <sha>

| 检查 | 命令 | 结果 | 预算 |
| ---- | ---- | ---- | ---- |
| 交付的 JS（gz） | 见 STATIC-CHECKS.md §1 | 412 KB | 400 KB |
| 最大的图片 | find … -size +200k | hero.png 1.1 MB | 250 KB |
| 查询数，GET /api/products | 查询日志 | 52（随页面大小增长） | ≤ 5 |
| 查询计划，按客户查订单 | EXPLAIN | orders 上的 Seq Scan（1.2M 行） | 索引查找 |
| 阻塞渲染的脚本 | <head> 扫描 | 2 | 0 |

发现，从最严重的开始：
1. …
```

上面的数字只是示范格式，并不是目标。

## 读懂真实的数字

在 Larkspur 上，每个问题都是刻意埋下的，一目了然。真实的输出噪声更大。下面是一些经验法则：

- **增长比大小更重要**。一个页面执行 8 次查询也许没问题。但页面多显示 50 个条目时，8 次变成了 58 次，那就有问题了。
- **只有大表上的扫描才要紧**。在一张 40 行的查找表上做 `Seq Scan` 很正常，而且往往比走索引更快。
- **以用户的网络来衡量，而不是你的**。你在办公室 Wi-Fi 上用笔记本电脑，看不出 400 KB 的脚本在中端手机上的代价。第 3.1 课展示了它在 Larkspur 上的代价。
- **一个原因对应一条发现**。三个慢接口如果共用一条没有索引的查询，那就是一条发现，而不是三条。

## 从基线到预算

最初的预算来自基线，就像第 2.1 课那样：略高于当前的数字，让门禁今天能通过，并在下一次性能退化时失败。在旁边写下目标值，也就是修复落地后你希望达到的数字。然后挑选**一道**门禁先自动化，通常是包体积或查询数测试，因为两者都快速、确定，而且失败时容易解释。

## 把修复交给智能体

课程其余部分的分工在这里依然适用，只有一个区别：这是一个别人也依赖的代码库。所以下面的提示词要求智能体在分支上工作，添加依赖前先询问，并且绝不为了让检查通过而放宽预算。

**动手练习 · 15 分钟.** 目标： 让智能体把课程中的四项静态检查对应到你的仓库所用的技术栈上，写成你将亲自运行的命令。

1. 在终端中打开你的项目，并在那里启动一个编程智能体。
2. 复制下面的提示词。它要求智能体写出 `perf/STATIC-CHECKS.md`，其中包含适合你的技术栈的命令，并且不运行任何繁重的任务，也不修改代码。
3. 阅读它写的内容。每条命令对你的项目来说都说得通吗？对任何你不理解的命令，让它解释一下。

**完成标准**
- perf/STATIC-CHECKS.md has a command and reading guide for all four questions
- Every command fits this repository's stack, paths and tools
- No application code or configuration changed

**智能体的部分：把实现交给它**

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

接下来是只有你能做的部分：在你选定的用户旅程上，亲自运行 `perf/STATIC-CHECKS.md` 中的每一条命令，并像第 5 步那样填写 `perf/baseline.md`。设定预算。给发现排出优先级。

**动手练习 · 30 分钟.** 目标： 让智能体修复基线中的一条发现，并添加一道能再次捕获它的门禁；然后用你自己的运行来验证。

1. 选出你想最先修复的发现，并在粘贴下面的提示词时指明它。
2. 智能体汇报后，检出它的分支，**亲自重新运行这条发现对应的检查**。你的数字和它引用的数字一致吗？
3. 像第 4.1 课那样故意把它弄坏：在本地撤销修复，确认新的门禁会失败。然后再恢复。
4. 用新的数字更新 `perf/baseline.md`。在合并之前，像审查其他任何改动一样审查这个分支。

**完成标准**
- The finding's check shows the improvement, before and after quoted from the same command
- The project's existing tests pass
- A gate exists that fails when the problem comes back

**智能体的部分：把实现交给它**

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

## 要点

- 四个静态问题适用于任何技术栈：我们交付的内容有多重，每个请求执行多少次查询，每条热点查询是否使用了索引，以及什么阻塞了渲染。
- 第一次要亲自运行这些检查。阅读真实的输出，才能了解你的代码库中什么是正常的；而决定什么可以接受的人是你。
- 先测量一个用户旅程，而不是整个应用。一个能重复的基线胜过一次无法重复的全面普查。
- 每个请求的查询数随页面大小增长，以及请求路径上对大表的全表扫描，在任何技术栈上都是发现。
- 把最初的预算设在略高于当前数字的位置，让门禁现在能通过，并能捕获下一次性能退化；随着修复落地再逐步收紧。
- 智能体提出命令，编写修复和门禁；你运行检查、读懂数字并批准。

---

上一页: [第 4.3 课: 性能验收](/demo/zh/performance-testing/review/acceptance.md)
下一页: [第 4 章 · 小结: 课程总结](/demo/zh/performance-testing/review/summary.md)
