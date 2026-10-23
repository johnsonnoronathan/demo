# Chapter 3 · Opening: Dynamic testing

Performance Testing · Chapter 3: Dynamic testing · 5 min

> Run the system, put traffic through it, and measure what users actually feel.

## Transcript: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## The lesson

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## What you'll get

- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

## Before you start

Install k6, the load testing tool this chapter uses:

| System | Command |
| --- | --- |
| macOS | `brew install k6` |
| Windows | `winget install k6 --source winget` |
| Debian, Ubuntu | see [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

If you can't install it, every exercise also works with the practice app's built-in tool, `npm run load`. You'll need Chrome for Lighthouse and the profiler.

> **Run tests from a quiet machine.** Close heavy apps before a dynamic test and run the load generator and the app on the same machine only when comparing before with after. Numbers from different machines, or from a busy laptop, aren't comparable.

## In this chapter

- Lesson 3.1: [Lab measurement with Lighthouse](/demo/performance-testing/dynamic/lighthouse.md) (25 min). Load the page on a simulated phone and measure what the user sees, and when.
- Lesson 3.2: [Load testing with k6](/demo/performance-testing/dynamic/load-testing.md) (30 min). Simulate a busy evening of shoppers, and let thresholds decide whether the app meets its budgets.
- Lesson 3.3: [Stress, spike and soak tests](/demo/performance-testing/dynamic/stress-spike-soak.md) (30 min). Push past the expected load to find the ceiling, survive a surge, and catch slow drift over hours.
- Lesson 3.4: [Finding the bottleneck](/demo/performance-testing/dynamic/bottlenecks.md) (30 min). Profile the app while it's under load, read the flame graph, fix the hot path and prove it with the same test.
- Chapter 3 · Summary: [Dynamic testing: summary](/demo/performance-testing/dynamic/summary.md) (5 min). What running the app taught you that reading it couldn't.

---

Previous: [Chapter 2 · Summary: Static testing: summary](/demo/performance-testing/static/summary.md)
Next: [Lesson 3.1: Lab measurement with Lighthouse](/demo/performance-testing/dynamic/lighthouse.md)
