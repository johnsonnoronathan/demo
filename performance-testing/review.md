# Chapter 4 · Opening: Summary

Performance Testing · Chapter 4: Summary · 5 min

> Put static and dynamic testing together into a routine, report the results, run acceptance, apply it to your own project, and review the course.

## Transcript: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## The lesson

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## What you'll get

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **Overview** (Overall): What performance testing measures, the two families of tests, and the practice app.
2. **Static testing** (Specific): Find performance problems by inspecting what you built, without running it.
3. **Dynamic testing** (Specific): Run the system, put traffic through it and measure what users feel.
4. **Summary** (Overall): Combine both into a workflow, report the results, run acceptance, apply it to your own project, and review the whole course.

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- Lesson 4.1: [A performance testing workflow](/demo/performance-testing/review/workflow.md) (25 min). Decide what runs where: static gates on every pull request, dynamic tests before release, monitoring in production.
- Lesson 4.2: [Reporting results](/demo/performance-testing/review/reporting.md) (20 min). Write up performance results so that people can make a decision and someone else can repeat the test.
- Lesson 4.3: [Performance acceptance](/demo/performance-testing/review/acceptance.md) (30 min). Turn budgets into acceptance criteria, run the acceptance test with one command, and make a go/no-go decision that someone signs.
- Lesson 4.4: [Static testing on your own project](/demo/performance-testing/review/your-project.md) (45 min). Run the course's static checks on a real codebase yourself, read the numbers, set first budgets, and hand the fixes to an agent.
- Chapter 4 · Summary: [Course summary](/demo/performance-testing/review/summary.md) (10 min). Everything the course covered, in one place, and where to go next.

---

Previous: [Chapter 3 · Summary: Dynamic testing: summary](/demo/performance-testing/dynamic/summary.md)
Next: [Lesson 4.1: A performance testing workflow](/demo/performance-testing/review/workflow.md)
