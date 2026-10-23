# 강의 4.3: 성능 인수 테스트

성능 테스트 · 4장: 요약 · 30분

> 예산을 인수 기준으로 바꾸고, 명령 하나로 인수 테스트를 실행하고, 서명이 담긴 출시 여부 결정을 내립니다.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

**이 강의를 마치면 할 수 있는 것:**
- Follow the performance testing method from question to sign-off
- Write acceptance criteria that are measurable, agreed in advance and traceable to a budget
- Check entry criteria, run an acceptance test and read its verdict
- Make a go/no-go decision, handle a waiver, and record the sign-off

## 대본: Performance acceptance (2:42)

**0:00 Introduction.** Finding and fixing problems isn't the end. A release needs a decision: go, or no-go. That's acceptance.

**0:07 The method.** Every lesson in this course is one step of the same method. First, ask the questions the tests must answer. Set budgets before you measure. They become the acceptance criteria. Take a baseline, then test: static checks first, then lab and load tests. Fix one cause at a time. That's the step to hand to an agent. Verify by rerunning the same test yourself. Then accept, report, and guard it with gates.

**0:40 Acceptance criteria.** An acceptance criterion is a budget with its conditions. Not, the API should be fast. But: the books endpoint's p95 is at most 300 milliseconds, with 50 users, under one percent errors, measured with npm run accept. It's measurable, it states its conditions, it's agreed before the test, and it traces back to a budget.

**1:03 Entry and exit.** Entry criteria decide whether a run counts at all: the right build, seeded data, a quiet machine. Miss one, and the run is invalid, not failed. Exit criteria decide when you're done: every criterion passes or has a signed waiver, and the record is saved.

**1:23 Before.** Here's the acceptance test on Larkspur as it was before the course. All three static gates fail. The books endpoint's p95 is over thirteen seconds at 50 users. Six of seven automated criteria fail. Verdict: reject, with exit code one.

**1:41 After.** After the four fixes from chapters two and three: same command, same machine. Every gate passes. Books is down to 64 milliseconds, orders 17, recommendations 125. Recommendations passes, but it's the closest to its limit. That goes in the report, even though it passed.

**2:00 Go or no-go.** If every criterion passes, it's a go. Sign the record. If any fails, it's no-go. Fix it, and rerun the whole test. If the release can't wait, a named person can sign a waiver, with an expiry date and a follow-up. And never loosen a limit to make a run pass. Changing a criterion is a separate decision, for the next run.

**2:28 Your turn.** In the exercise, you run the acceptance test yourself. If anything fails, an agent fixes it, without touching the limits. Then you rerun it, record Lighthouse, and make the call. Go, or no-go.

## 강의 본문

Chapters 2 and 3 found problems and fixed them. A release needs one more thing: a decision. **Acceptance** is where the measurements meet the budgets agreed at the start, and someone says go or no-go.

## The method, end to end

Every lesson in this course is one step of the same method. Here it is in order, with who does what:

| Step | What happens | Who | Lesson |
| --- | --- | --- | --- |
| 1. Ask | Write the questions the tests must answer, and the user journeys they cover | You | 1.2 |
| 2. Set budgets | Agree on limits before measuring; they become the acceptance criteria | You and the team | 2.1, 3.2 |
| 3. Baseline | Measure the current build with the tools you'll use for acceptance | You | 1.1 |
| 4. Test, static first | Static checks in seconds, then lab and load tests | You | 2.x, 3.x |
| 5. Fix | One cause at a time, smallest change | Agent | 2.2 to 3.4 |
| 6. Verify | Rerun the same test on the same machine; your run is the evidence | You | every exercise |
| 7. Accept and report | Compare with the criteria, decide, sign, write it up | You | 4.2, this lesson |
| 8. Guard | Gates in CI, monitoring in production, so it stays accepted | Agent sets up, you review | 4.1 |

Steps 5 and 6 are where an agent saves you time without taking the decision away from you. It writes the fix and quotes its output. You rerun the check, and the number you see is the one that counts.

## Acceptance criteria

A budget is a limit. An **acceptance criterion** adds the conditions under which the limit is checked:

> The API should be fast.

> **D1.** `/api/books` p95 ≤ 300 ms with 50 concurrent users, error rate under 1%, measured with `npm run accept` on the test machine.

A good criterion is:

- **Measurable.** It names a metric and a number, and a tool that produces that number.
- **Conditional.** It says under what load, on what device or machine, with what data.
- **Agreed in advance.** It's written down before the test runs, by the people who'll live with the result.
- **Traceable.** It points back to a budget and to the user need behind it.

Larkspur's criteria live in `acceptance.json`, next to `budget.json`:

```json title="acceptance.json (excerpt)"
"dynamic": [
  { "id": "D1", "name": "/api/books p95 at 50 users", "path": "/api/books?page={1-20}", "p95": 300 },
  { "id": "D2", "name": "/api/orders p95 at 50 users", "path": "/api/orders?email=reader{0-19999}@larkspur.test", "p95": 200 },
  { "id": "D3", "name": "/api/recommendations p95 at 50 users", "path": "/api/recommendations?book_id={1-5000}", "p95": 400 }
],
"errorRate": { "id": "D4", "name": "Error rate across all requests", "max": 1 },
```

There are ten criteria in all: three static gates (S1 to S3), four dynamic ones (D1 to D4), and two that need Lighthouse in a real browser (M1, M2), which you record by hand.

## Entry and exit criteria

**Entry criteria** decide whether a run counts at all. If one isn't met, the run is invalid, not failed, and you fix the setup instead of the code.

- The build under test is the one you mean to release: note its commit.
- The data is seeded to production-like size (here, `npm run seed`).
- The app is running, warmed up, and nothing else heavy is running on the machine.
- The tools and their versions are the ones in the plan.

`npm run accept` checks the ones it can: if Larkspur isn't answering with seeded data, it stops with exit code 2 before measuring anything.

**Exit criteria** decide when acceptance is finished: every criterion passes, or each failure has a signed waiver; the manual criteria are recorded; and the acceptance record is saved where the team can find it.

## Running the acceptance test

Here is the first run, on Larkspur as it was before the course:

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

And after the four fixes from chapters 2 and 3, same command, same machine:

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

Read it row by row, not just the last line. D3 passes at 125 ms, but that's the closest to its limit of any criterion, and the capacity test in lesson 3.3 showed recommendations is the first endpoint to saturate. That belongs in the report even though it passed.

![Terminal showing the acceptance table: S1 to S3 PASS with exit 0, D1 64 ms, D2 17 ms and D3 125 ms all PASS against limits of 300, 200 and 400 ms, D4 error rate 0.00% PASS, M1 and M2 marked RECORD, and the line 'ACCEPT: all 7 automated criteria passed.'](screenshot-pending)
*Screenshot (npm run accept): Every row is a criterion with its limit. The verdict is the last line, and the exit code says the same thing to CI.*

## Go, no-go and waivers

| Result | Decision |
| --- | --- |
| Every criterion passes | **Go.** Sign the record. |
| A criterion fails | **No-go.** Fix it, then run the whole acceptance test again, not just the failed row. |
| A criterion fails, but the release can't wait | **Waiver.** A named person accepts the risk in writing, with an expiry date and a follow-up ticket. It's still recorded as a failure. |
| An entry criterion isn't met | **No result.** Fix the setup and run again. |

One rule matters more than the rest: **never change a limit to make a run pass.** If the team decides a limit was wrong, that's a separate decision, recorded with its reason, and it applies from the next run. The agent prompt below says the same thing to the agent.

> **A waiver is a debt.** A waiver with no expiry becomes the new budget without anyone deciding it should be. Give every waiver an owner and a date, and check it at the next acceptance run.

## The acceptance record

`npm run accept -- --out notes/acceptance-run.md` writes the measured part: date, commit, machine, Node.js version, load settings, every criterion and the verdict. You add what only you can:

```md title="notes/acceptance.md"
# Performance acceptance: Larkspur storefront and API

Run record: notes/acceptance-run.md (commit, machine and command are in it)

| ID | Criterion | Limit | Measured | Result |
| -- | --------- | ----- | -------- | ------ |
| M1 | LCP, Lighthouse mobile | ≤ 2.5 s | … | … |
| M2 | Lighthouse performance score | ≥ 90 | … | … |

Waivers: none
Risks noted: recommendations is the first endpoint to saturate (lesson 3.3)

Decision: GO / NO-GO
Signed: <name>, <role>, <date>
```

## Hands-on: Run Larkspur's acceptance test, fix what fails, and sign it off

**실습 · 30분.** 목표: Run the acceptance test yourself, have an agent fix any failing criterion, verify the fix with the same test, and write the acceptance record with a go/no-go decision.

1. Check the entry criteria: `npm run seed`, then `npm start` in its own terminal. Close anything heavy on your machine.
2. Run the acceptance test yourself and keep the record:

   ```bash
   npm run accept -- --out notes/acceptance-run.md
   echo $?
   ```

3. Read every row. Which criteria fail, by how much, and which is closest to its limit even if it passes?
4. If anything fails, copy the agent prompt below. The agent fixes one criterion at a time and is not allowed to touch the limits.
5. When the agent reports back, **run step 2 again yourself.** Compare your numbers with the ones it quoted. They should agree within a few percent.
6. Run Lighthouse as in lesson 3.1 and record M1 and M2.
7. Write `notes/acceptance.md` from the template above, and make the call: go or no-go. Sign it.

**완료 조건**
- `npm run accept` exits 0, or every remaining failure is explained with its cause
- Each change is tied to the criterion it fixes
- acceptance.json, budget.json and all thresholds are unchanged

**에이전트 몫: 구현을 맡기기**

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

## 핵심

- The method: ask the question, set budgets, take a baseline, test static then dynamic, fix one thing at a time, verify with the same test, then accept and report.
- An acceptance criterion names a metric, a limit and the conditions it's measured under. It is agreed before the test and traces back to a budget.
- Entry criteria decide whether a run counts at all: the right build, seeded data, a quiet machine. A run that misses them is invalid, not failed.
- Any failed criterion means no-go, unless a named person accepts the risk in writing, with an expiry date and a follow-up.
- Never loosen a limit to make a run pass. Changing a criterion is a separate decision, made before the next run.
- The agent implements fixes; you run the acceptance test, read the numbers and sign. The record holds the command, the machine, the commit and every result.

---

이전: [강의 4.2: 결과 보고하기](/demo/ko/performance-testing/review/reporting.md)
다음: [강의 4.4: 내 프로젝트에서 정적 테스트](/demo/ko/performance-testing/review/your-project.md)
