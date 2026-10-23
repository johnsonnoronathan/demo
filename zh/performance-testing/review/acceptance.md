# 第 4.3 课: 性能验收

性能测试 · 第 4 章: 总结 · 30 分钟

> 把预算变成验收标准，用一条命令运行验收测试，并做出一个有人签字确认的放行/不放行决定。

**学完本课你将能够:**
- 从提出问题到签字确认，完整遵循性能测试方法
- 写出可测量、事先商定、能追溯到预算的验收标准
- 检查准入标准，运行验收测试，并读懂它的结论
- 做出放行/不放行的决定，处理豁免，并记录签字确认

## 文字稿: 性能验收 (2:42)

**0:00 引言.** 发现并修复问题还不是终点。一次发布需要一个决定：放行，还是不放行。这就是验收。

**0:08 方法.** 这门课的每一节课都是同一个方法中的一步。首先，提出测试必须回答的问题。 在测量之前设定预算。它们会成为验收标准。 建立基线，然后测试：先做静态检查，再做实验室测试和负载测试。 一次只修复一个原因。这一步可以交给智能体。 亲自重新运行同样的测试来验证。然后验收、报告，再用门禁守护成果。

**0:40 验收标准.** 验收标准就是带上条件的预算。不是说：API 应该很快。 而是：在 50 个用户下，图书接口的 p95 不超过 300 毫秒，错误率低于百分之一，用 npm run accept 测量。 它可以测量，写明了条件，在测试之前商定，并且能追溯到一项预算。

**1:00 准入与退出.** 准入标准决定一次运行是否算数：正确的构建、已填充的数据、一台空闲的机器。少了一条，这次运行就是无效的，而不是失败的。 退出标准决定何时完成：每一条标准都通过，或者有已签字的豁免，并且记录已经保存。

**1:21 修复前.** 这是在课程开始之前的 Larkspur 上运行的验收测试。 三道静态门禁全部失败。在 50 个用户下，图书接口的 p95 超过了 13 秒。 七条自动化标准中有六条失败。结论：拒绝，退出码为 1。

**1:37 修复后.** 经过第 2 章和第 3 章的四项修复之后：同样的命令，同一台机器。 每一道门禁都通过了。图书接口降到了 64 毫秒，订单 17 毫秒，推荐 125 毫秒。 推荐接口通过了，但它离限制最近。即使通过了，这一点也要写进报告。

**1:58 放行还是不放行.** 如果每一条标准都通过，就放行。在记录上签字。 如果有任何一条失败，就不放行。修复它，然后重新运行整个测试。 如果发布不能等，可以由一位具名的人签署豁免，并注明到期日期和后续跟进。 还有，绝不为了让一次运行通过而放宽限制。修改标准是一个单独的决定，留给下一次运行。

**2:26 轮到你了.** 在练习中，你亲自运行验收测试。如果有任何失败，由智能体来修复，而且不能改动限制。 然后你重新运行它，记录 Lighthouse 的结果，并做出决定：放行，还是不放行。

## 课文

第 2 章和第 3 章发现了问题并修复了它们。一次发布还需要一样东西：一个决定。**验收**就是把测量结果与一开始商定的预算放在一起比较，然后由某个人说放行或不放行。

## 完整的方法

这门课的每一节课都是同一个方法中的一步。下面按顺序列出，并注明由谁来做：

| 步骤 | 做什么 | 谁来做 | 课程 |
| --- | --- | --- | --- |
| 1. 提问 | 写下测试必须回答的问题，以及它们覆盖的用户旅程 | 你 | 1.2 |
| 2. 设定预算 | 在测量之前商定限制；它们会成为验收标准 | 你和团队 | 2.1、3.2 |
| 3. 基线 | 用验收时会用到的工具测量当前构建 | 你 | 1.1 |
| 4. 测试，静态优先 | 先做几秒钟就能完成的静态检查，再做实验室测试和负载测试 | 你 | 2.x、3.x |
| 5. 修复 | 一次一个原因，改动尽量小 | 智能体 | 2.2 至 3.4 |
| 6. 验证 | 在同一台机器上重新运行同样的测试；你的运行结果就是证据 | 你 | 每个练习 |
| 7. 验收并报告 | 与标准比较，做出决定，签字，写成报告 | 你 | 4.2、本课 |
| 8. 守护 | CI 中的门禁、生产环境中的监控，让它保持验收通过的状态 | 智能体搭建，你来审查 | 4.1 |

第 5 步和第 6 步是智能体既能帮你节省时间、又不会拿走你决定权的地方。它写出修复，并引用它的输出。你重新运行检查，你看到的数字才算数。

## 验收标准

预算是一个限制。**验收标准**在此基础上加上了检查这个限制的条件：

> API 应该很快。

> **D1.** 在 50 个并发用户下，`/api/books` 的 p95 ≤ 300 ms，错误率低于 1%，在测试机器上用 `npm run accept` 测量。

一条好的标准应该是：

- **可测量的**。它指明一个指标和一个数字，以及产生这个数字的工具。
- **有条件的**。它说明在多大负载下、在什么设备或机器上、用什么数据。
- **事先商定的**。它在测试运行之前就写下来，由将要承担结果的人一起商定。
- **可追溯的**。它能指回一项预算，以及预算背后的用户需求。

Larkspur 的标准保存在 `acceptance.json` 中，就在 `budget.json` 旁边：

```json title="acceptance.json（节选）"
"dynamic": [
  { "id": "D1", "name": "/api/books p95 at 50 users", "path": "/api/books?page={1-20}", "p95": 300 },
  { "id": "D2", "name": "/api/orders p95 at 50 users", "path": "/api/orders?email=reader{0-19999}@larkspur.test", "p95": 200 },
  { "id": "D3", "name": "/api/recommendations p95 at 50 users", "path": "/api/recommendations?book_id={1-5000}", "p95": 400 }
],
"errorRate": { "id": "D4", "name": "Error rate across all requests", "max": 1 },
```

一共有十条标准：三道静态门禁（S1 至 S3），四条动态标准（D1 至 D4），以及两条需要在真实浏览器中用 Lighthouse 测量的标准（M1、M2），由你手工记录。

## 准入标准和退出标准

**准入标准**决定一次运行是否算数。如果有一条没有满足，这次运行就是无效的，而不是失败的，你要修正的是测试环境，而不是代码。

- 被测的构建就是你打算发布的那个：记下它的提交。
- 数据已填充到接近生产环境的规模（这里用 `npm run seed`）。
- 应用正在运行、已经预热，机器上没有运行其他繁重的任务。
- 工具及其版本与计划中的一致。

`npm run accept` 会检查它能检查的那些：如果 Larkspur 没有响应，或者没有填充数据，它会在测量任何东西之前以退出码 2 停止。

**退出标准**决定验收何时完成：每一条标准都通过，或者每一项失败都有已签字的豁免；手工标准已经记录；验收记录已经保存在团队能找到的地方。

## 运行验收测试

这是第一次运行，对象是课程开始之前的 Larkspur：

```text
id   result      measured  limit      criterion
S1   FAIL          exit 1  exit 0     Asset budget: script 50, stylesheet 20, image 250, total 350 KB
              3 budget(s) exceeded.
S2   FAIL          exit 1  exit 0     No queries inside loops
              2 possible N+1 pattern(s).
S3   FAIL          exit 1  exit 0     No full scans of large tables on request paths
              2 of 4 queries scan a large table.
D1   FAIL        13246 ms  ≤ 300 ms   /api/books p95 at 50 users
D2   FAIL          797 ms  ≤ 200 ms   /api/orders p95 at 50 users
D3   FAIL         1109 ms  ≤ 400 ms   /api/recommendations p95 at 50 users
D4   PASS          0.00 %  < 1 %      Error rate across all requests
M1   RECORD             —  ≤ 2.5 s    LCP on a simulated mid-range phone (Lighthouse)
M2   RECORD             —  ≥ 90       Lighthouse performance score

REJECT: 6 of 7 automated criteria failed (S1, S2, S3, D1, D2, D3).
```

而在第 2 章和第 3 章的四项修复之后，同样的命令，同一台机器：

```text
S1   PASS          exit 0  exit 0     Asset budget: script 50, stylesheet 20, image 250, total 350 KB
S2   PASS          exit 0  exit 0     No queries inside loops
S3   PASS          exit 0  exit 0     No full scans of large tables on request paths
D1   PASS           64 ms  ≤ 300 ms   /api/books p95 at 50 users
D2   PASS           17 ms  ≤ 200 ms   /api/orders p95 at 50 users
D3   PASS          125 ms  ≤ 400 ms   /api/recommendations p95 at 50 users
D4   PASS          0.00 %  < 1 %      Error rate across all requests

ACCEPT: all 7 automated criteria passed. Record M1, M2 from Lighthouse before sign-off.
```

要逐行阅读，而不只是看最后一行。D3 以 125 ms 通过，但它是所有标准中离限制最近的一条，而且第 3.3 课的容量测试表明，推荐接口是最先饱和的接口。即使它通过了，这一点也应该写进报告。

![显示验收表格的终端：S1 至 S3 以 exit 0 通过（PASS），D1 为 64 ms、D2 为 17 ms、D3 为 125 ms，对照 300、200 和 400 ms 的限制全部通过，D4 错误率 0.00% 通过，M1 和 M2 标记为 RECORD，最后一行是“ACCEPT: all 7 automated criteria passed.”](screenshot-pending)
*Screenshot (npm run accept): 每一行都是一条标准及其限制。结论在最后一行，退出码向 CI 传达同样的信息。*

## 放行、不放行和豁免

| 结果 | 决定 |
| --- | --- |
| 每一条标准都通过 | **放行**。在记录上签字。 |
| 有一条标准失败 | **不放行**。修复它，然后重新运行整个验收测试，而不只是失败的那一行。 |
| 有一条标准失败，但发布不能等 | **豁免**。由一位具名的人书面接受这个风险，并注明到期日期和一个后续跟进的工单。它仍然记为失败。 |
| 有一条准入标准没有满足 | **没有结果**。修正测试环境，然后重新运行。 |

有一条规则比其他所有规则都重要：**绝不为了让一次运行通过而修改限制**。如果团队认为某个限制定错了，那是一个单独的决定，要连同理由一起记录，并从下一次运行开始生效。下面的智能体提示词也对智能体说了同样的话。

> **豁免是一笔债.** 没有到期日期的豁免会变成新的预算，而没有人决定过要这样。给每一项豁免指定负责人和日期，并在下一次验收运行时检查它。

## 验收记录

`npm run accept -- --out notes/acceptance-run.md` 会写下测量的部分：日期、提交、机器、Node.js 版本、负载设置、每一条标准以及结论。你来补充只有你能写的内容：

```md title="notes/acceptance.md"
# 性能验收：Larkspur 店面和 API

运行记录：notes/acceptance-run.md（其中包含提交、机器和命令）

| ID | 标准 | 限制 | 实测 | 结果 |
| -- | ---- | ---- | ---- | ---- |
| M1 | LCP，Lighthouse 移动端 | ≤ 2.5 s | … | … |
| M2 | Lighthouse 性能得分 | ≥ 90 | … | … |

豁免：无
已记录的风险：推荐接口是最先饱和的接口（第 3.3 课）

决定：放行 / 不放行
签字：<姓名>，<角色>，<日期>
```

## 动手练习：运行 Larkspur 的验收测试，修复失败项，并签字确认

**动手练习 · 30 分钟.** 目标： 亲自运行验收测试，让智能体修复任何失败的标准，用同样的测试验证修复，然后写出带有放行/不放行决定的验收记录。

1. 检查准入标准：运行 `npm run seed`，然后在单独的终端中运行 `npm start`。关闭机器上任何繁重的程序。
2. 亲自运行验收测试，并保存记录：

   ```bash
   npm run accept -- --out notes/acceptance-run.md
   echo $?
   ```

3. 阅读每一行。哪些标准失败了，差多少？哪一条即使通过了，也离限制最近？
4. 如果有任何失败，复制下面的智能体提示词。智能体一次修复一条标准，并且不允许改动限制。
5. 智能体汇报后，**亲自再运行一次第 2 步**。把你的数字和它引用的数字比较一下，两者应该相差不超过几个百分点。
6. 像第 3.1 课那样运行 Lighthouse，记录 M1 和 M2。
7. 按照上面的模板写出 `notes/acceptance.md`，然后做出决定：放行还是不放行。签上你的名字。

**完成标准**
- `npm run accept` exits 0, or every remaining failure is explained with its cause
- Each change is tied to the criterion it fixes
- acceptance.json, budget.json and all thresholds are unchanged

**智能体的部分：把实现交给它**

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

## 要点

- 方法是：提出问题，设定预算，建立基线，先静态后动态地测试，一次只修复一件事，用同样的测试验证，然后验收并报告。
- 一条验收标准要指明一个指标、一个限制，以及测量它的条件。它在测试之前商定，并能追溯到一项预算。
- 准入标准决定一次运行是否算数：正确的构建、已填充的数据、一台空闲的机器。不满足准入标准的运行是无效的，而不是失败的。
- 任何一条标准失败都意味着不放行，除非有一位具名的人书面接受这个风险，并注明到期日期和后续跟进。
- 绝不为了让一次运行通过而放宽限制。修改标准是一个单独的决定，要在下一次运行之前做出。
- 智能体实现修复；你运行验收测试、读懂数字并签字。记录中包含命令、机器、提交和每一项结果。

---

上一页: [第 4.2 课: 报告结果](/demo/zh/performance-testing/review/reporting.md)
下一页: [第 4.4 课: 在你自己的项目上做静态测试](/demo/zh/performance-testing/review/your-project.md)
