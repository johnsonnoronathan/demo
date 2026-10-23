# 강의 4.1: 성능 테스트 작업 흐름

성능 테스트 · 4장: 요약 · 25분

> 어디서 무엇을 실행할지 정하기: 풀 리퀘스트마다 정적 게이트, 릴리스 전 동적 테스트, 운영 환경 모니터링.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

**이 강의를 마치면 할 수 있는 것:**
- Place each kind of performance check at the right stage of delivery
- Run all static gates with one command, and see one catch a regression
- Adapt a CI workflow that runs static gates, Lighthouse and a short k6 test

## 대본: A performance testing workflow (1:10)

**0:00 Introduction.** Everything so far was done by hand, once. A real codebase changes every day. So where should each check run?

**0:09 The pipeline.** Every pull request runs the static checks first: the asset budget, the query linter and the query plans. They take seconds. Then the change is built and deployed to staging, where Lighthouse and a short k6 load test run. A failed threshold stops the release, and the failure message carries the numbers that explain why. Once it's fixed, the change ships. Production monitoring watches the same metrics, and informs the next budgets.

**0:40 What runs where.** The rule is fast feedback first. A gate that fails in four seconds on a pull request costs the author nothing to fix. Long stress and soak tests belong on a schedule, against a stable environment, not on every change.

**0:57 A gate in action.** In the exercise you'll undo one of your fixes on purpose. The static gates catch it in seconds, and name the file and the size that caused it.

## 강의 본문

Everything in chapters 2 and 3 was done by hand, once. A real codebase changes every day. The question is where each check runs, so that problems surface quickly and cheaply.

> **개념 애니메이션: Performance checks in the delivery pipeline**
>
> 1. Every pull request runs the static checks first: asset budget, query lint and query plans. They take seconds.
> 2. Then it builds, deploys to staging and runs the dynamic checks: Lighthouse and a short k6 load test.
> 3. A failed threshold stops the release, and the failure message carries the numbers that explain why.
> 4. Once fixed, the change ships. Production monitoring watches the same metrics and informs the next budgets.

## What runs where

| Stage | Runs | Takes | Catches |
| --- | --- | --- | --- |
| Every pull request | Static gates: budget, query lint, query plans | Seconds | Known slow patterns, before review |
| Before release, on staging | Lighthouse, a short k6 load test against budgets | Minutes | Regressions in what users feel |
| On a schedule (nightly, weekly) | Stress, spike and soak tests | Up to hours | Capacity and drift |
| Production | Real-user monitoring, server metrics | Always | What the lab can't reproduce |

The rule is **fast feedback first**. A static gate that fails in 4 seconds on a pull request costs the author nothing to fix. The same problem found by a nightly soak test costs a day; found by customers, much more.

## One command for the static gates

The practice app bundles its static gates into one script:

```bash
npm run check:static
```

```text
budget      actual   limit   result
script         0.9      50   pass
…
All budgets met.
No queries inside loops found.
pass  SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY …
pass  SELECT name FROM authors WHERE id = ?
pass  SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?
pass  SELECT id, tags FROM books WHERE id = ?

All 4 query plans use indexes.
```

`check:plans` is new: it explains every query listed in `hot-queries.sql` and fails if any would scan a table of 1,000 rows or more. It turns lesson 2.3 into a gate. The cost is a habit: when you add a query to a route, add it to the file.

## Dynamic tests in CI

`ci/perf.yml` is a reference GitHub Actions workflow with two jobs. **Static** runs the three gates. **Dynamic** starts the app, runs Lighthouse CI against `lighthouserc.json` (LCP under 2.5 s, page weight under 350 KB), and a 70-second version of the k6 load test.

```yaml title="ci/perf.yml (excerpt)"
  dynamic:
    needs: static
    steps:
      # …checkout, Node, seed, start the app…
      - name: Lighthouse
        run: npx @lhci/cli@0.15.1 autorun
      - uses: grafana/setup-k6-action@v1
      - name: Load test (short)
        run: k6 run --stage 20s:50 --stage 40s:50 --stage 10s:0 load/load.k6.js
```

> **Shared CI runners are noisy.** CI machines are shared and vary from run to run. Keep load tests in CI short, compare against budgets with some headroom, and treat a single failure as a reason to rerun and look, not as proof. Capacity numbers belong on a dedicated, production-like environment.

## Close the loop

Production monitoring watches the same metrics your tests use: p95 per endpoint, error rate, LCP from real users. When real traffic grows or changes shape, those numbers tell you to revise the budgets, and the budgets drive the next round of tests.

## Hands-on: Run the gates, then watch one catch a regression

**실습 · 20분.** 목표: Run all static gates with one command, deliberately reintroduce a regression to see a gate fail, then adapt the reference CI workflow.

1. Run all the static gates:

   ```bash
   npm run check:static; echo "exit $?"
   ```

2. Undo one of your fixes on purpose. In `public/index.html`, point the date library back at the all-locales file, and run the gates again.

![Terminal output where the asset budget fails: script 96.2 KB against a 50 KB limit marked FAIL with +46.2 KB, followed by '1 budget(s) exceeded.' and exit code 1. The later gates don't run.](screenshot-pending)
*Screenshot (npm run check:static): The regression is caught in seconds, with the file and the size that caused it.*

3. Revert the change and confirm the gates pass again.
4. Read `ci/perf.yml` and write down what you'd change to use it in your own repository: working directory, the branch it runs on, and whether its thresholds fit your CI runners.

**완료 조건**
- check:static passes before and after the experiment, and failed during it
- notes/ci.md explains each job and its failure conditions

**에이전트 몫: 구현을 맡기기**

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

## 핵심

- Run cheap static gates on every pull request, dynamic tests before release, and monitoring in production.
- A gate is only useful if it fails the build. Make every check exit non-zero on a breach.
- Keep CI load tests short and their thresholds generous enough for shared runners; run long stress and soak tests on a schedule.
- Feed production numbers back into budgets. The loop is what keeps performance from drifting.

---

이전: [4장 · 시작: 요약](/demo/ko/performance-testing/review.md)
다음: [강의 4.2: 결과 보고하기](/demo/ko/performance-testing/review/reporting.md)
