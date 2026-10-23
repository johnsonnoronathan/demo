# Lesson 2.1: Performance budgets

Performance Testing · Chapter 2: Static testing · 20 min

> Agree on limits before you measure, then let a check enforce them on every change.

**You'll be able to:**
- Explain what a performance budget is and who should agree on it
- Choose budget metrics that can be checked statically and dynamically
- Run an asset budget check and read its result

## Transcript: Performance budgets (1:14)

**0:00 Introduction.** "Make it fast" isn't a requirement anyone can test. A performance budget is.

**0:06 How a budget works.** A budget is a limit the team agrees on before measuring. For Larkspur: fifty kilobytes of script, two hundred and fifty of images, three hundred and fifty in total. Then you measure the current build against each limit. Anything over its line fails. Larkspur is over on scripts, on images, and in total. A failed budget is a clear signal. With an exit code of one, it can block a pull request instead of starting a debate.

**0:39 Three kinds.** Budgets come in three kinds. Quantity budgets, like kilobytes or queries per request, can be checked statically, on every change. Timing budgets, like p95 or Largest Contentful Paint, need a dynamic test. Start from what users need, then from where you are today, and tighten the budget as you improve.

**1:01 Run the check.** In the exercise you'll run the budget check and see exactly which files push the page over. Two files account for almost all of it. Lesson 2.4 fixes them.

## The lesson

"Make it fast" isn't a requirement anyone can test. A **performance budget** is: a limit on a measurable quantity, agreed before anyone measures, that a check can enforce.

> **Concept animation: A budget turns “fast enough” into pass or fail**
>
> 1. A budget is a limit the team agrees on before measuring: 50 KB of script, 250 KB of images, 350 KB in total.
> 2. Then measure the current build against each limit.
> 3. Anything over its line fails. Larkspur is over on scripts, images and total weight.
> 4. A failed budget is a clear signal. It can block a pull request instead of starting a debate.

## Three kinds of budget

| Kind | Examples | Checked |
| --- | --- | --- |
| **Quantity** | JavaScript ≤ 50 KB gzipped, images ≤ 250 KB, ≤ 5 queries per request | Statically, on every build |
| **Timing** | p95 ≤ 300 ms at 50 users, LCP ≤ 2.5 s on a mid-range phone | Dynamically, with Lighthouse or k6 |
| **Rule-based** | Lighthouse performance score ≥ 90, no render-blocking scripts | Dynamically, with Lighthouse |

Quantity budgets are the static ones, and the most useful early on: they can't be argued with, and they catch regressions the moment someone commits them. A timing budget tells you whether users are happy; a quantity budget tells you which change made them unhappy.

## Where the numbers come from

Good budgets come from three places, in this order:

1. **What users need.** Google's Core Web Vitals call an LCP under 2.5 s "good". Studies of web shops put noticeable drop-off at around one second of extra delay.
2. **What competitors do.** If a rival's product page loads in 1.8 s, that's your bar.
3. **Where you are today.** A budget that fails on day one by a factor of ten will be switched off. Start at today's numbers, then ratchet down.

Larkspur's `budget.json` sets quantity limits for the storefront:

```json
{
  "page": "public/index.html",
  "budgets": { "script": 50, "stylesheet": 20, "image": 250, "total": 350 }
}
```

Scripts and stylesheets are measured gzipped, the way browsers download them; images as stored. The check script reads `index.html`, finds every script, stylesheet and image it references, weighs each file, and exits with code 1 if any budget is exceeded. Exit code 1 is what makes a CI job fail.

> **Budgets need an owner.** Agree budgets with whoever owns the product, not only the engineers. When a new feature needs more room, that's a product decision: raise the budget on purpose, or cut something else.

## Hands-on: Run the asset budget and record what fails

**Hands-on · 10 min.** Goal. Run Larkspur's asset budget, identify which files push it over, and add API timing budgets to your plan for chapter 3.

1. Run the check from the practice app folder. It doesn't need the app running.

   ```bash
   npm run budget
   ```

   ```text
   Asset weight for public/index.html

   type        size KB   file
   script         95.9   /vendor/datefmt-all-locales.js
   script          0.3   /app.js
   stylesheet      0.5   /styles.css
   image        1043.1   /hero.jpg

   budget      actual   limit   result
   script        96.2      50   FAIL  (+46.2 KB)
   stylesheet     0.5      20   pass
   image       1043.1     250   FAIL  (+793.1 KB)
   total       1139.8     350   FAIL  (+789.8 KB)

   3 budget(s) exceeded.
   ```

![Terminal showing the asset table and the budget table. Scripts 96.2 KB against 50, images 1043.1 KB against 250 and total 1139.8 KB against 350 are marked FAIL; stylesheets 0.5 KB pass.](screenshot-pending)
*Screenshot (npm run budget): Three of four budgets fail. Two files account for almost all of it.*

2. Check the exit code. `echo $?` prints `1` right after a failed run, which is what stops a CI pipeline.
3. For each failure, name the file responsible. Here it's easy: one script and one image.
4. Add the API timing budgets from the agent prompt to `notes/perf-plan.md`. You'll turn them into k6 thresholds in lesson 3.2.

**Done when**
- You have the budget output and its exit code
- Each failing budget is attributed to a specific file
- notes/perf-plan.md lists both asset and API budgets

**Agent part: hand over the implementation**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.1, "Performance budgets".

Exercise: Run the asset budget and record what fails
Goal: Run Larkspur's asset budget, identify which files push it over, and add API timing budgets to your plan for chapter 3.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `budget.json` and summarise its limits.
2. Run `npm run budget` and capture the full output and the exit code.
3. List each failing budget with how far over it is, and the file or files responsible.
4. Append a 'Budgets' section to `notes/perf-plan.md` (create the file if it doesn't exist) with the asset budgets from budget.json and these API budgets: /api/books p95 300 ms, /api/orders p95 200 ms, /api/recommendations p95 400 ms, all at 50 users, error rate under 1%.
5. Do not change any code or assets yet; lesson 2.4 fixes them.

Done when:
- You have the budget output and its exit code
- Each failing budget is attributed to a specific file
- notes/perf-plan.md lists both asset and API budgets

Report back:
- The budget table from the command output
- The files responsible for each failure, largest first

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/1-budgets.mdx
```

## Key points

- A budget is a limit agreed before measuring. It turns "is this fast enough?" into pass or fail.
- Quantity budgets (KB, requests, queries) can be checked statically on every change. Timing budgets (p95, LCP) need a dynamic test.
- Base budgets on user needs and competitors, then on today's numbers so they're achievable. Tighten them as you improve.
- A budget check that fails the build gets fixed. A dashboard that turns red gets ignored.

---

Previous: [Chapter 2 · Opening: Static testing](/demo/performance-testing/static.md)
Next: [Lesson 2.2: Code review for N+1 queries](/demo/performance-testing/static/n-plus-one.md)
