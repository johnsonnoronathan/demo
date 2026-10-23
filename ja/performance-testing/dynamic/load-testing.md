# レッスン 3.2: k6 による負荷テスト

パフォーマンステスト · 第 3 章: 動的テスト · 30 分

> 買い物客で賑わう夜をシミュレートし、しきい値でアプリが予算を満たすかを判定する。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

**このレッスンでできるようになること:**
- Explain virtual users, iterations, think time and stages
- Write a k6 script with checks, tags and thresholds
- Read a k6 summary and explain a failed threshold

## 書き起こし: Load testing with k6 (1:26)

**0:00 Introduction.** Your plan says the books endpoint should answer within three hundred milliseconds at p95, with fifty shoppers. Only a load test can check that.

**0:10 The script.** A k6 script is JavaScript. Stages say how many virtual users run, and for how long. Thresholds say what counts as passing: p95 under three hundred milliseconds for books, under two hundred for orders. And sleep adds think time, so each virtual user behaves like a person reading a page, not a machine gun.

**0:34 How a load test works.** k6 starts virtual users. Each one runs your script in a loop: browse, think, check orders, think, open a book. Stages ramp them up: from zero to fifty users in thirty seconds, hold for a minute, then ramp down. k6 times every request. Before chapter two's fixes, p95 for books climbed past a second as users piled up. The threshold turns that into a failure. And orders failed too, although it was fast on its own: Node runs on one thread, so the slow endpoint held up the rest.

**1:11 After the fixes.** After the static fixes, the same test passes, with room to spare. That answers the plan's question for fifty users. It doesn't say how many more the app could take. That's the next lesson.

## レッスン本文

The budgets from your plan say `/api/books` should answer within 300 ms at p95 with 50 shoppers. Only one kind of test can check that: put 50 shoppers' worth of traffic through the app and measure.

> **概念アニメーション: How a k6 load test works**
>
> 1. k6 starts virtual users. Each one runs your script in a loop: browse, think, check orders, think, open a book.
> 2. Stages control how many run at once: ramp from 0 to 50 users in 30 seconds, hold for a minute, ramp down.
> 3. k6 times every request and reports percentiles per endpoint. As users pile up, p95 for the books endpoint climbs.
> 4. Thresholds turn the numbers into pass or fail. Books p95 is 1.17 s against a 300 ms limit, so the run fails.

## The script

k6 scripts are JavaScript. The default function is one **iteration** of one virtual user; `options` says how many users run, for how long, and what counts as passing.

```js title="load/load.k6.js"
export const options = {
  stages: [
    { duration: "30s", target: 50 }, // ramp up
    { duration: "1m", target: 50 },  // hold: a busy evening
    { duration: "15s", target: 0 },  // ramp down
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
  sleep(1); // think time
  // …then orders, sleep, a book page with recommendations, sleep
}
```

Three details make the difference between a load test and a stress generator:

- **Think time.** `sleep(1)` between requests makes each virtual user behave like a person reading a page. Without it, 50 virtual users send far more traffic than 50 people would.
- **Varied data.** Random pages, customers and books spread requests across the data, the way real traffic does. Asking for the same row every time measures the cache, not the app.
- **Tags.** `tags: { endpoint: "books" }` gives each endpoint its own percentiles and its own threshold.

## Checks and thresholds

A **check** tests one response ("status is 200") and records the result; it never stops the test. A **threshold** judges the whole run against a budget, and makes k6 exit with a non-zero code when it's crossed. That exit code is what lets a load test gate a release.

## What the summary tells you

Here's the load test against Larkspur as it was **before** chapter 2's fixes:

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

Books failing is no surprise. But orders and recommendations failed too, even though on their own they were much faster. Node.js runs JavaScript on a single thread, and SQLite calls here are synchronous: while one request runs 101 queries, every other request waits its turn. **One slow endpoint slows them all.** That's a finding a per-endpoint microbenchmark would never show.

After chapter 2's fixes, the same test on the same machine:

```text
    ✓ 'p(95)<300' p(95)=10.29ms      books
    ✓ 'p(95)<200' p(95)=8.98ms       orders
    ✓ 'p(95)<400' p(95)=34.33ms      recommendations
    ✓ 'rate<0.01' rate=0.00%
```

Every budget passes. That answers the plan's question for 50 users. It doesn't say how many users the app could take, or what happens in a rush. Those are the next lesson's questions.

## Hands-on: Run a smoke test, then the load test

**ハンズオン · 20 分.** 目標： Run load/smoke.k6.js and load/load.k6.js against Larkspur and record which thresholds pass.

1. Start with a **smoke test**: one user for 30 seconds. If this fails, the script or the app is broken, and a big test would only produce big confusion.

   ```bash
   k6 run load/smoke.k6.js
   ```

2. Run the load test. It takes just under two minutes.

   ```bash
   k6 run load/load.k6.js
   ```

![The end of a k6 run summary. A THRESHOLDS section lists four thresholds with green check marks: books p95 about 10 ms, orders p95 about 9 ms, recommendations p95 about 34 ms, and failed requests 0.00%. Below it, TOTAL RESULTS with checks at 100% and HTTP request durations per endpoint.](screenshot-pending)
*Screenshot (k6 run load/load.k6.js): After chapter 2's fixes, all four thresholds pass at 50 users.*

3. If you skipped chapter 2's fixes, your run will fail like the "before" output above. Try it: `git stash`, restart the app, run again, then `git stash pop`.
4. Record the results in `notes/load-test.md`.

No k6? Run the same traffic shape per endpoint with the built-in tool, for example `npm run load -- --url "http://localhost:3000/api/books?page=1" --vus 50 --duration 60`. It has no think time, so expect higher latency than k6 reports.

**完了の条件**
- The smoke test passed before the load test ran
- notes/load-test.md lists every threshold with pass or fail and the measured value

**エージェントの担当：実装を任せる**

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

- A virtual user runs your script in a loop. Stages set how many run at once over time.
- Think time (sleep) makes each user behave like a person, so 50 virtual users is close to 50 real shoppers.
- Checks verify each response; thresholds turn the run's percentiles and error rate into pass or fail.
- Tag requests per endpoint so each has its own threshold. A single-threaded server lets one slow endpoint delay all the others.
- Always run a short smoke test first, to prove the script and the app work before you add load.

---

前へ: [レッスン 3.1: Lighthouse によるラボ計測](/demo/ja/performance-testing/dynamic/lighthouse.md)
次へ: [レッスン 3.3: ストレス・スパイク・ソークテスト](/demo/ja/performance-testing/dynamic/stress-spike-soak.md)
