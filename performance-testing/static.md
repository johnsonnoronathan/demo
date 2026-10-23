# Chapter 2 · Opening: Static testing

Performance Testing · Chapter 2: Static testing · 5 min

> Find performance problems by reading what you built, before anything runs.

## Transcript: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## The lesson

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## What you'll get

- Turn your plan's budgets into a check that passes or fails the build
- Spot the N+1 query pattern in code, with a linter and by eye, and remove it
- Read a SQLite query plan, recognise a full table scan, and fix it with an index
- Find what makes a page heavy, and cut it below budget
- Know which of these checks belong on every pull request

## What you'll use

| Tool | What it reads | Lesson |
| --- | --- | --- |
| `npm run budget` | The files the storefront loads, measured against `budget.json` | 2.1, 2.4 |
| `npm run lint:queries` | Source files, looking for database calls inside loops | 2.2 |
| `npm run explain` | SQLite's plan for a query, without running it | 2.3 |

All three ship with the practice app and need nothing installed.

## In this chapter

- Lesson 2.1: [Performance budgets](/demo/performance-testing/static/budgets.md) (20 min). Agree on limits before you measure, then let a check enforce them on every change.
- Lesson 2.2: [Code review for N+1 queries](/demo/performance-testing/static/n-plus-one.md) (25 min). The most common performance bug in database-backed code, how to find it by reading, and how to remove it.
- Lesson 2.3: [Reading query plans](/demo/performance-testing/static/query-plans.md) (25 min). Ask the database how it would run a query, without running it, and fix full table scans with the right index.
- Lesson 2.4: [Asset weight](/demo/performance-testing/static/asset-weight.md) (20 min). Find what makes a page heavy by weighing its files, and bring it under budget without changing what users see.
- Chapter 2 · Summary: [Static testing: summary](/demo/performance-testing/static/summary.md) (5 min). What you found without running the app, and what static checks can't tell you.

---

Previous: [Chapter 1 · Summary: Overview: summary](/demo/performance-testing/overview/summary.md)
Next: [Lesson 2.1: Performance budgets](/demo/performance-testing/static/budgets.md)
