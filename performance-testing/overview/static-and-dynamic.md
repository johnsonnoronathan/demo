# Lesson 1.2: Static and dynamic testing

Performance Testing · Chapter 1: Overview · 20 min

> The two families of performance tests, what each can and can't find, and how to plan which questions to ask before you test.

**You'll be able to:**
- Explain the difference between static and dynamic performance testing
- Pick the cheaper test that can still answer a given question
- Write a short test plan: questions, budgets, risks and the tests that cover them

## Transcript: Static and dynamic testing (1:13)

**0:00 Introduction.** There are two ways to look for performance problems. You can read what you built, or you can run it and measure.

**0:09 Two families.** Static testing reads artifacts: code, query plans, build output and budgets. Nothing runs, so a static check takes seconds and can gate every pull request. It finds patterns that are known to be slow. Dynamic testing runs the system, and sends it traffic. It measures what users actually feel, finds problems nobody predicted, and proves that a fix worked.

**0:36 Side by side.** Side by side: static testing is cheap and early. Dynamic testing is slower, but it's the only way to see real impact. They work best together. Static checks catch common mistakes cheaply. Dynamic tests confirm the important ones, and find the rest.

**0:54 Start with questions.** Before you pick a tool, write down what you need to know. Good questions name a page or an endpoint, a load, and a number. Then pick the cheapest test that can answer each one. In the exercise, you'll write that plan for Larkspur.

## The lesson

There are two ways to look for performance problems. You can **read** what you built, or you can **run** it and measure. This course calls them static and dynamic testing, and spends a chapter on each.

> **Concept animation: Two ways to test performance**
>
> 1. Static testing reads what you built: code, queries, assets and budgets.
> 2. Nothing runs, so it takes seconds and fits in every pull request. It finds likely problems.
> 3. Dynamic testing runs the system and sends it traffic.
> 4. It measures what users actually feel: response time, throughput and errors.

## Static testing

Static testing inspects artifacts: source code, SQL, build output, configuration, budgets. Nothing is deployed and no traffic is generated, so a static check runs in seconds and can gate every pull request.

It finds **patterns that are known to be slow**: a query inside a loop, a query plan that scans a whole table, a 600 KB script on the critical path. What it can't tell you is how much any of that hurts under real traffic, or find a problem that no rule describes.

## Dynamic testing

Dynamic testing runs the system and measures it: a lab page load with Lighthouse, a load test with k6, a CPU profile taken while traffic flows. It needs a running environment and minutes rather than seconds.

In exchange it reports what users would actually feel, finds problems nobody predicted, and proves that a fix worked.

| | Static | Dynamic |
| --- | --- | --- |
| Looks at | Code, queries, assets, config | The running system |
| Speed | Seconds | Minutes to hours |
| Runs on | Every pull request | Staging, before a release, on a schedule |
| Finds | Known slow patterns | Real impact, unknown problems, capacity |
| Can't | Measure impact | Point to the line of code by itself |
| In this course | Chapter 2 | Chapter 3 |

The two work best together. Static checks catch the common mistakes cheaply; dynamic tests confirm the important ones and find the rest. Chapter 4 wires both into one workflow.

## Start a plan with questions

Before choosing a tool, write down what you need to know. Good questions name a page or endpoint, a load and a number:

- Can the storefront reach Largest Contentful Paint in under 2.5 s on a mid-range phone?
- Does `/api/books` keep p95 under 300 ms with 50 concurrent shoppers?
- How many users can the app serve before p95 passes the budget?
- Does the app stay stable over an hour of ordinary traffic?

Then pick the cheapest test that can answer each question, and note the risks you can already see in the code. That list is a test plan.

> **Test environments.** Dynamic results depend on the machine. Test on something close to production, or compare only runs from the same machine. A laptop is fine for learning and for before/after comparisons; it is not evidence of production capacity.

## Hands-on: Draft a performance test plan for Larkspur

**Hands-on · 15 min.** Goal. Write a one-page plan that lists the questions you'll answer about Larkspur, a budget for each, and whether a static or a dynamic test covers it.

1. Skim the app: `server.mjs`, the three files in `src/routes/`, `public/index.html` and `budget.json`. Don't run anything yet; this is a static read.
2. Create `notes/perf-plan.md` with four headings: **Questions**, **Budgets**, **Risks** and **Tests**.
3. Write at least four questions like the ones above, and give each a budget with a unit.
4. Under **Risks**, list what looks slow and where. Hint: look at what `listBooks` does inside its `for` loop.
5. Under **Tests**, say which tool answers each question. Use this table as a start:

   | Question or risk | Static check | Dynamic test |
   | --- | --- | --- |
   | Page weight | `npm run budget` | Lighthouse |
   | Queries inside loops | `npm run lint:queries` | `x-query-count` under load |
   | Slow lookups | `npm run explain` | k6 load test |
   | Capacity | – | k6 stress test |

![A Markdown file open in an editor with four sections. Questions lists four items such as 'Does /api/books keep p95 under 300 ms with 50 users?'. Budgets gives numbers like 'p95 300 ms' and 'scripts 50 KB gzipped'. Risks cites src/routes/books.mjs line 11. Tests maps each item to a command.](screenshot-pending)
*Screenshot (notes/perf-plan.md): A plan fits on one page. You'll fill in results as the course goes on.*

**Done when**
- notes/perf-plan.md has the four sections
- Every budget is a number with a unit, and every question maps to at least one test
- Risks cite file paths and line numbers

**Agent part: hand over the implementation**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 1.2, "Static and dynamic testing".

Exercise: Draft a performance test plan for Larkspur
Goal: Write a one-page plan that lists the questions you'll answer about Larkspur, a budget for each, and whether a static or a dynamic test covers it.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `README.md`, `server.mjs`, the files in `src/routes/`, `public/index.html` and `budget.json` to learn what the app does.
2. Create `notes/perf-plan.md` with four sections: Questions, Budgets, Risks, Tests.
3. Under Questions, list at least four concrete questions, each naming an endpoint or page and a number of users.
4. Under Budgets, give each question a measurable limit (for example p95 in ms, KB of assets, queries per request).
5. Under Risks, list anything in the code that looks likely to be slow, with file and line, without running the app.
6. Under Tests, map every question and risk to a static check or a dynamic test from this repository (`npm run budget`, `npm run lint:queries`, `npm run explain`, `npm run load`, the k6 scripts in `load/`).

Done when:
- notes/perf-plan.md has the four sections
- Every budget is a number with a unit, and every question maps to at least one test
- Risks cite file paths and line numbers

Report back:
- The Questions and Budgets sections
- The three risks you think are most serious, and why

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/1-overview/2-static-and-dynamic.mdx
```

## Key points

- Static testing inspects code, queries, assets and configuration without running the system. It is fast and runs on every change, but it can only find likely problems.
- Dynamic testing runs the system under realistic traffic and measures what users feel. It is slower and needs an environment, but it proves the impact.
- Use static checks to catch known patterns early, and dynamic tests to confirm impact and find what no rule describes.
- Plan with questions first ("can checkout take 50 users at p95 under 300 ms?"), then choose the cheapest test that answers each one.

---

Previous: [Lesson 1.1: What performance testing measures](/demo/performance-testing/overview/what-it-measures.md)
Next: [Chapter 1 · Summary: Overview: summary](/demo/performance-testing/overview/summary.md)
