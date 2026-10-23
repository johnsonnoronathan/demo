# Lesson 4.2: Reporting results

Performance Testing · Chapter 4: Summary · 20 min

> Write up performance results so that people can make a decision and someone else can repeat the test.

**You'll be able to:**
- Structure a performance report around the question it answers
- Present results with their conditions, so they can be repeated
- Write findings that name a cause, an impact and a next step

## Transcript: Reporting results (1:11)

**0:00 Introduction.** A performance test is finished when someone can act on it. That takes a report: short, in a predictable shape, with every number backed by a test anyone can rerun.

**0:12 What the course changed.** Here are Larkspur's first measurements, each from a run you can repeat. After the static fixes: one query instead of a hundred and one, two indexes, and lighter assets. After the dynamic fix: book tags parsed once, instead of on every request. Every result names the test that produced it. That's what makes a report credible.

**0:38 The shape of a report.** Start with a summary that answers the question the tests were for. Then the setup, so anyone can repeat it, and the results: before and after, same test, same machine. Then one finding per problem, the limits of what you tested, and the next steps.

**0:58 A good finding.** A finding is a small argument: the cause, and exactly where it is, what users feel, with a measured number, the fix, and the evidence someone else can check.

## The lesson

A performance test is finished when someone can act on it. That takes a report: short, in a predictable shape, and with every number backed by a test anyone can rerun.

> **Concept animation: What the course changed**
>
> 1. Before: the first measurements of Larkspur, each from a run you can repeat.
> 2. After the static fixes: one query instead of 101, two indexes, and lighter assets.
> 3. After the dynamic fix: book tags parsed once instead of on every request.
> 4. Each result names the test that produced it. That's what makes a performance report credible.

## The shape of a useful report

1. **Summary.** Answer the question the tests were for, in two or three sentences. "After four fixes, Larkspur meets all its budgets at 50 users. The recommendations endpoint is the first to saturate, at about 700 req/s on the test machine."
2. **Test setup.** Machine, data set, tool versions, the commands. Enough for someone else to reproduce it.
3. **Results.** Before and after, same tests, same machine. Percentiles and error rates, not averages.
4. **Findings.** One per problem: what causes it, what users feel, what to do, and the evidence.
5. **Limits.** What you didn't test: other endpoints, production hardware, real network conditions, longer soaks.
6. **Next steps.** Decisions or follow-up tests, each with an owner if you can.

## Writing findings

A finding is a small argument. Compare:

> The books API is slow.

> **N+1 queries in /api/books.** `listBooks` runs 2 queries per book, 101 per page (`src/routes/books.mjs:11`, `:13`). At 50 users p95 was 1.17 s against a 300 ms budget, and it slowed every other endpoint because the server is single-threaded. Replacing the loop with one joined query and indexing `reviews.book_id` brought p95 to 10 ms in the same k6 test. Evidence: `notes/load-test.md`.

The second names the cause and its location, says what users feel, gives the fix, and points at the evidence. Someone who wasn't there can check every claim.

## Numbers people can trust

- **Same test, same machine** for every before/after pair. If anything else changed, say so.
- **Percentiles and errors together.** A fast p95 with 5% errors is not a success.
- **Ranges, not false precision.** Repeat runs differ by a few percent. "About 700 req/s" is more honest than "698.97".
- **Lab versus field.** Say which numbers came from Lighthouse or a laptop, and which from production.

> **Reports from agents.** When an agent writes a report for you, ask it to cite where each number came from, as the prompt below does. Then spot-check a few against the files. Agents are good at prose and structure; a confident number with no source is the thing to catch.

## Hands-on: Write Larkspur's performance report

**Hands-on · 20 min.** Goal. Turn your notes from the course into a one-page performance report with an answer, a results table, findings and limits.

1. Collect your notes: `perf-baseline.md`, `perf-plan.md`, `lighthouse.md`, `load-test.md`, `capacity.md`.
2. Write `notes/report.md` in the six sections above. Use this results table as a start, filled with **your** numbers:

   | Measure | Test | Before | After |
   | --- | --- | --- | --- |
   | /api/books p95 | mini load, 10 users | 1,320 ms | 12 ms |
   | /api/orders p95 | mini load, 10 users | 205 ms | 5 ms |
   | /api/recommendations p95 | mini load, 10 users | 347 ms | 26 ms |
   | Error rate | k6 load, 50 users | 0% | 0% |
   | LCP | Lighthouse, mobile | 9.8 s | 1.5 s |
   | Page weight | Lighthouse | 1,645 KiB | 68 KiB |

![A Markdown report open in an editor. A short Summary paragraph, a Test setup list, a Results table comparing before and after, and a Findings section whose first entry is titled 'N+1 queries in /api/books' with cause, impact, fix and evidence lines.](screenshot-pending)
*Screenshot (notes/report.md): One page. Every number has a source.*

3. Read it as someone who wasn't there. Could they rerun every test from the Setup section? Could they find the evidence for every finding?

**Done when**
- notes/report.md has all six sections
- Every number is traceable to a notes file or a quoted command output
- Missing measurements are listed under Limits instead of being estimated

**Agent part: hand over the implementation**

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

## Key points

- Lead with the answer to the question the test was for, then the evidence.
- Every number needs its conditions: what was tested, with what load, on what machine, with which command.
- Report percentiles and error rates, before and after, from the same test on the same machine.
- A finding states the cause, the impact in user terms, and the recommended next step.
- Say what you didn't test. Limits are part of the result.

---

Previous: [Lesson 4.1: A performance testing workflow](/demo/performance-testing/review/workflow.md)
Next: [Lesson 4.3: Performance acceptance](/demo/performance-testing/review/acceptance.md)
