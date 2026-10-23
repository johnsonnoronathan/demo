# Performance Testing

> Find what makes software slow before your users do.

Learn to test a web application's performance from both sides. Static testing inspects code, queries and assets without running anything. Dynamic testing runs the system, puts traffic through it and measures what users feel. You practise both on Larkspur Books, a small bookshop app that is slow on purpose.

Total time: 6 h 50 min

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## Chapter 1: Overview

What performance testing measures, the two families of tests, and the practice app.

- [Chapter 1 · Opening: Overview](/demo/performance-testing/overview.md) (5 min). What this course covers, how it is built, and how to use the classroom and its agent prompts.
- [Lesson 1.1: What performance testing measures](/demo/performance-testing/overview/what-it-measures.md) (20 min). Latency, throughput and errors: the three numbers every performance test reports, and why latency is quoted as percentiles.
- [Lesson 1.2: Static and dynamic testing](/demo/performance-testing/overview/static-and-dynamic.md) (20 min). The two families of performance tests, what each can and can't find, and how to plan which questions to ask before you test.
- [Chapter 1 · Summary: Overview: summary](/demo/performance-testing/overview/summary.md) (5 min). The vocabulary and the plan you'll use for the rest of the course.

## Chapter 2: Static testing

Find performance problems by inspecting what you built, without running it.

- [Chapter 2 · Opening: Static testing](/demo/performance-testing/static.md) (5 min). Find performance problems by reading what you built, before anything runs.
- [Lesson 2.1: Performance budgets](/demo/performance-testing/static/budgets.md) (20 min). Agree on limits before you measure, then let a check enforce them on every change.
- [Lesson 2.2: Code review for N+1 queries](/demo/performance-testing/static/n-plus-one.md) (25 min). The most common performance bug in database-backed code, how to find it by reading, and how to remove it.
- [Lesson 2.3: Reading query plans](/demo/performance-testing/static/query-plans.md) (25 min). Ask the database how it would run a query, without running it, and fix full table scans with the right index.
- [Lesson 2.4: Asset weight](/demo/performance-testing/static/asset-weight.md) (20 min). Find what makes a page heavy by weighing its files, and bring it under budget without changing what users see.
- [Chapter 2 · Summary: Static testing: summary](/demo/performance-testing/static/summary.md) (5 min). What you found without running the app, and what static checks can't tell you.

## Chapter 3: Dynamic testing

Run the system, put traffic through it and measure what users feel.

- [Chapter 3 · Opening: Dynamic testing](/demo/performance-testing/dynamic.md) (5 min). Run the system, put traffic through it, and measure what users actually feel.
- [Lesson 3.1: Lab measurement with Lighthouse](/demo/performance-testing/dynamic/lighthouse.md) (25 min). Load the page on a simulated phone and measure what the user sees, and when.
- [Lesson 3.2: Load testing with k6](/demo/performance-testing/dynamic/load-testing.md) (30 min). Simulate a busy evening of shoppers, and let thresholds decide whether the app meets its budgets.
- [Lesson 3.3: Stress, spike and soak tests](/demo/performance-testing/dynamic/stress-spike-soak.md) (30 min). Push past the expected load to find the ceiling, survive a surge, and catch slow drift over hours.
- [Lesson 3.4: Finding the bottleneck](/demo/performance-testing/dynamic/bottlenecks.md) (30 min). Profile the app while it's under load, read the flame graph, fix the hot path and prove it with the same test.
- [Chapter 3 · Summary: Dynamic testing: summary](/demo/performance-testing/dynamic/summary.md) (5 min). What running the app taught you that reading it couldn't.

## Chapter 4: Summary

Combine both into a workflow, report the results, run acceptance, apply it to your own project, and review the whole course.

- [Chapter 4 · Opening: Summary](/demo/performance-testing/review.md) (5 min). Put static and dynamic testing together into a routine, report the results, run acceptance, apply it to your own project, and review the course.
- [Lesson 4.1: A performance testing workflow](/demo/performance-testing/review/workflow.md) (25 min). Decide what runs where: static gates on every pull request, dynamic tests before release, monitoring in production.
- [Lesson 4.2: Reporting results](/demo/performance-testing/review/reporting.md) (20 min). Write up performance results so that people can make a decision and someone else can repeat the test.
- [Lesson 4.3: Performance acceptance](/demo/performance-testing/review/acceptance.md) (30 min). Turn budgets into acceptance criteria, run the acceptance test with one command, and make a go/no-go decision that someone signs.
- [Lesson 4.4: Static testing on your own project](/demo/performance-testing/review/your-project.md) (45 min). Run the course's static checks on a real codebase yourself, read the numbers, set first budgets, and hand the fixes to an agent.
- [Chapter 4 · Summary: Course summary](/demo/performance-testing/review/summary.md) (10 min). Everything the course covered, in one place, and where to go next.
