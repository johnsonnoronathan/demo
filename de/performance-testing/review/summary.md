# Kapitel 4 · Zusammenfassung: Kurszusammenfassung

Performance-Tests · Kapitel 4: Zusammenfassung · 10 Min.

> Alles, was der Kurs behandelt hat, an einem Ort, und wie es weitergeht.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

## Transkript: Course summary (0:54)

**0:00 Recap.** You started with a slow bookshop and a vague complaint. Here's what you can do now.

**0:07 Four chapters.** You can measure: latency as percentiles, throughput, and errors, and write a plan around concrete questions. You can read for performance: budgets, N+1 queries, query plans and asset weight, all in seconds and without a server. You can run and measure: Lighthouse, load, stress, spike and soak tests, and a profile that points at the slow code. And you can make it a routine: gates in CI, and a report that explains every change.

**0:39 Your next step.** Pick one application you work on. Write a one-page plan for it, like the one in lesson one point two. Then add one static gate and one dynamic test this week. Go find what's slow.

## Die Lektion

You started with a slow bookshop and a vague complaint. You end with measured budgets, three static gates, a load test with thresholds, a known capacity, and a report that explains every change.

## The whole course

### 1.1 Was Performance-Tests messen

- Latency is how long one request takes, throughput is how many complete per second, and the error rate is the share that fail.
- Latency is a distribution. Report percentiles: p50 for the typical request, p95 and p99 for the slow tail.
- An average blends fast and slow requests into a number no user experienced. Don't set budgets on averages.
- Write down how you measured (users, duration, endpoint), so the number can be repeated and compared.

### 1.2 Statische und dynamische Tests

- Static testing inspects code, queries, assets and configuration without running the system. It is fast and runs on every change, but it can only find likely problems.
- Dynamic testing runs the system under realistic traffic and measures what users feel. It is slower and needs an environment, but it proves the impact.
- Use static checks to catch known patterns early, and dynamic tests to confirm impact and find what no rule describes.
- Plan with questions first ("can checkout take 50 users at p95 under 300 ms?"), then choose the cheapest test that answers each one.

### 2.1 Performance-Budgets

- A budget is a limit agreed before measuring. It turns "is this fast enough?" into pass or fail.
- Quantity budgets (KB, requests, queries) can be checked statically on every change. Timing budgets (p95, LCP) need a dynamic test.
- Base budgets on user needs and competitors, then on today's numbers so they're achievable. Tighten them as you improve.
- A budget check that fails the build gets fixed. A dashboard that turns red gets ignored.

### 2.2 Code-Review für N+1-Abfragen

- N+1 means one query for a list, then one more per item. The cost grows with the list and hides in fast local databases.
- Statically, it looks like a database call inside a loop or a .map callback. A simple lint rule catches most cases.
- Fix it by fetching everything in one query (JOIN, GROUP BY) or in one batched query (WHERE id IN (...)).
- Count queries per request. A count that grows with the page size is the signature of N+1.

### 2.3 Abfragepläne lesen

- EXPLAIN QUERY PLAN shows how the database will run a query, without running it. That makes it a static check.
- SCAN reads every row of a table; SEARCH uses an index to jump to the matching rows. A SCAN of a large table on a hot path is a bug.
- Index the columns you filter on first, then the columns you sort by, so the database can skip the sort too.
- Indexes speed up reads and slow down writes. Add the ones your queries need, not one per column.

### 2.4 Gewicht der Assets

- Weigh what the page actually loads. A few files are usually most of the weight.
- Ask of each heavy file: is all of it needed, and is it needed now? Libraries often bundle far more than you use.
- A plain <script> in <head> blocks rendering until it downloads and runs. Use defer, or move it.
- Serve images at the size they're displayed, compressed sensibly, and give them width and height.

### 3.1 Labormessung mit Lighthouse

- Lighthouse loads a page on a simulated mid-range phone and slow network, so results are repeatable but pessimistic.
- FCP is when anything appears; LCP is when the main content appears. LCP under 2.5 s counts as good.
- Render-blocking scripts delay FCP; heavy images delay LCP. The static checks predicted both.
- Lab data is for comparing builds. Field data from real users tells you what people actually experience.

### 3.2 Lasttests mit k6

- A virtual user runs your script in a loop. Stages set how many run at once over time.
- Think time (sleep) makes each user behave like a person, so 50 virtual users is close to 50 real shoppers.
- Checks verify each response; thresholds turn the run's percentiles and error rate into pass or fail.
- Tag requests per endpoint so each has its own threshold. A single-threaded server lets one slow endpoint delay all the others.
- Always run a short smoke test first, to prove the script and the app work before you add load.

### 3.3 Stress-, Spike- und Dauertests

- Load tests check expected traffic; stress tests find the breaking point; spike tests check survival and recovery; soak tests find slow drift.
- When throughput stops growing as users increase, you've hit the ceiling. After that, extra users only add waiting time.
- Capacity is the load at which p95 crosses the budget, not the load at which the app crashes.
- In a spike, judge recovery as well as survival: latency and errors should return to normal once the surge ends.
- Soak tests need hours and a watch on memory, connections and latency trend, not just the final percentiles.

### 3.4 Den Engpass finden

- A load test tells you that something is slow; a profile taken under the same load tells you where the time goes.
- First find the saturated resource: CPU at 100% points to code; low CPU with high latency points to waiting on something else.
- In a flame graph, width is time. Look for wide frames near the top that belong to your code.
- Work that repeats the same computation on every request is a classic hot path. Do it once and cache the result.
- Prove a fix by rerunning the exact test that found the problem, on the same machine.

### 4.1 Ein Ablauf für Performance-Tests

- Run cheap static gates on every pull request, dynamic tests before release, and monitoring in production.
- A gate is only useful if it fails the build. Make every check exit non-zero on a breach.
- Keep CI load tests short and their thresholds generous enough for shared runners; run long stress and soak tests on a schedule.
- Feed production numbers back into budgets. The loop is what keeps performance from drifting.

### 4.2 Ergebnisse berichten

- Lead with the answer to the question the test was for, then the evidence.
- Every number needs its conditions: what was tested, with what load, on what machine, with which command.
- Report percentiles and error rates, before and after, from the same test on the same machine.
- A finding states the cause, the impact in user terms, and the recommended next step.
- Say what you didn't test. Limits are part of the result.

### 4.3 Performance-Abnahme

- The method: ask the question, set budgets, take a baseline, test static then dynamic, fix one thing at a time, verify with the same test, then accept and report.
- An acceptance criterion names a metric, a limit and the conditions it's measured under. It is agreed before the test and traces back to a budget.
- Entry criteria decide whether a run counts at all: the right build, seeded data, a quiet machine. A run that misses them is invalid, not failed.
- Any failed criterion means no-go, unless a named person accepts the risk in writing, with an expiry date and a follow-up.
- Never loosen a limit to make a run pass. Changing a criterion is a separate decision, made before the next run.
- The agent implements fixes; you run the acceptance test, read the numbers and sign. The record holds the command, the machine, the commit and every result.

### 4.4 Statische Tests am eigenen Projekt

- The four static questions carry over to any stack: how heavy is what we ship, how many queries per request, does each hot query use an index, and what blocks rendering.
- Run the checks yourself the first time. Reading real output is how you learn what's normal for your codebase, and you're the one who decides what's acceptable.
- Measure one user journey first, not the whole app. A baseline you can repeat beats a survey you can't.
- Queries per request that grow with page size, and full scans of large tables on a request path, are findings on any stack.
- Set first budgets just above today's numbers so the gate passes now and catches the next regression; tighten them as fixes land.
- The agent proposes commands and writes fixes and gates; you run the checks, read the numbers and approve.

## Check yourself

1. A teammate wants to add a nightly 4-hour soak test as a required check on every pull request. What would you suggest instead?
   Keep pull requests to fast static gates (and at most a short load test). Run the soak test on a schedule against a stable environment, and alert on its results.
2. Your load test passes in CI on Monday and fails on Tuesday with no code change. What do you do first?
   Rerun and compare. Shared runners are noisy; check whether the failure reproduces, whether other jobs ran on the same machine, and whether the margin to the threshold is too thin.
3. Name one problem in Larkspur that only static testing found first, and one that only dynamic testing found.
   Static: the N+1 loop, the full table scans or the heavy assets. Dynamic: the CPU hot path in recommendations, which matched no static rule.
4. What makes a performance finding actionable?
   It names the cause and where it is, the impact in user terms with a measured number, the fix, and the evidence someone can check.
5. The acceptance run fails D3 by 20 ms the day before a release. The product owner asks you to raise the limit to 450 ms so it passes. What do you do?
   Don't change the limit to pass the run. Report the failure. If the release can't wait, the product owner can sign a waiver with an expiry date and a follow-up; changing the criterion itself is a separate decision for the next run.
6. An agent reports that it fixed an N+1 in your project and the endpoint now runs 3 queries. How do you accept that?
   Rerun the same check yourself, on the same journey, and compare your number with the one it quoted. Then break the fix locally to see the new gate fail, and review the branch before merging.

## Where to go next

- **Your own app.** Write the one-page plan from lesson 1.2 for something you work on. Pick one static gate and one dynamic test to add this week.
- **Real-user monitoring.** Lab numbers find problems; field numbers decide priorities. Look at what your platform already records before adding anything.
- **Distributed tracing.** When requests cross several services, a trace shows which one the time went to, the way a flame graph does inside one process.
- **Database depth.** Your database's own `EXPLAIN` (PostgreSQL's `EXPLAIN ANALYZE`, MySQL's `EXPLAIN FORMAT=TREE`) and its slow-query log go much further than SQLite's.

> **Reset the practice app.** To run the course again from the start: `git checkout -- academy/practice/larkspur`, delete `db/migrations/001_indexes.sql` if you created it, and run `npm run seed`.

---

Zurück: [Lektion 4.4: Statische Tests am eigenen Projekt](/demo/de/performance-testing/review/your-project.md)
