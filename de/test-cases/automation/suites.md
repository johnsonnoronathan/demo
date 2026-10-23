# Lektion 3.2: Eine Testsuite ordnen

Testfälle schreiben · Kapitel 3: Automatisieren und skalieren · 15 Min.

> Die Testpyramide, Rückverfolgbarkeit zu Anforderungen und wie eine wachsende Suite gesund bleibt.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

**Sie werden können:**
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

## Transkript: Organizing a test suite (1:42)

**0:00 Introduction.** A suite of test cases is only useful if people can find, trust and run it. Let's organize one.

**0:08 The test pyramid.** As test cases pile up, structure matters. A common guide is the test pyramid. At the base, many fast unit tests. They check small pieces of logic, like applyDiscount. In the middle, fewer integration tests. They check pieces working together, like the cart saving to the database. At the top, a handful of end-to-end tests. They drive the real app like a customer would, like our sign-in test case. Higher tests are slower and more brittle. Keep them few, and save them for the journeys that matter most.

**0:47 Traceability.** Link test cases to requirements. This is a traceability matrix. Each requirement lists the test cases that check it. A requirement with no test cases is a gap in your testing. And a test case with no requirement may be testing something nobody asked for.

**1:07 Keep it healthy.** Finally, keep the suite healthy. Name tests by behavior, so a failure reads like a bug report. Fix or remove flaky tests quickly. A test that fails at random teaches everyone to ignore red. And when a requirement changes, update its test cases in the same change.

**1:29 Course wrap-up.** That's the course. You can now write test cases, choose them with partitions and boundaries, cover the unhappy paths, automate them, and organize a suite. Go find some bugs.

## Die Lektion

A suite is only useful if people trust it and can find their way around it. Shape it like a pyramid, trace it to requirements, and keep it free of noise.

## The pyramid

- **Unit**: one function or class, no network or database. Milliseconds. Hundreds of them.
- **Integration**: a few real pieces together, such as the cart and its database. Fewer.
- **End-to-end**: the whole app through the browser, like a customer. A handful, for critical journeys.

Push each check as low as it can go. The boundary rules from lesson 2.1 belong in unit tests; “a customer can buy a book” belongs at the top.

## Traceability matrix

Keep a table of requirement → test cases, or tag tests with requirement IDs and generate it. Review it for two things: requirements with no cases (gaps) and cases with no requirement (orphans).

## Keeping it healthy

- **Names:** describe behavior. A failing test name should read like a bug title.
- **Flaky tests:** quarantine is a last resort; find the cause (timing, shared data, order dependence) and fix it.
- **Ownership:** when a requirement changes, its cases change in the same pull request.
- **Prune:** delete cases that duplicate others or test removed features.

> **Tipp.** **Where to go next.** Pick one feature you work on, write its traceability table, and fill the first gap you find.

## Quiz

1. Where should most of your automated tests sit in the pyramid?
   a. End-to-end
   b. Integration
   c. Unit
   d. Spread evenly
   Answer: c. Unit tests are fast and precise, so they make up the wide base.
2. A requirement has no test cases linked to it. What is that called?
   a. An orphan
   b. A gap
   c. A flake
   d. A regression
   Answer: b. It's a coverage gap. An orphan is the reverse: a test case with no requirement.
3. A test fails about one run in ten with no code change. What should you do?
   a. Re-run until it passes
   b. Ignore it
   c. Find and fix the cause, or remove it
   d. Add more retries
   Answer: c. Flaky tests erode trust in the whole suite. Fix the cause (often timing or shared data) or remove the test.

## Das Wichtigste

- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.

---

Zurück: [Lektion 3.1: Vom Testfall zum automatisierten Test](/demo/de/test-cases/automation/unit-tests.md)
