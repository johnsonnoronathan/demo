# Lesson plan: Writing Test Cases

The foundations of testing, in short lessons. Learn what a test case is and what makes one trustworthy, choose inputs with partitions and boundaries, cover the unhappy paths, explore without a script, turn a written case into an automated test, and keep a growing suite healthy.

- Total time: 1 h 45 min
- Videos: 7 (13:05)
- Anyone who tests software or wants to: developers, testers, product people. No previous testing experience needed; lesson 3.1 reads a little JavaScript.

## Course goals

- Read, write and run a test case by hand
- Rewrite vague test cases into specific, repeatable ones
- Choose test inputs with equivalence partitions and boundary values
- Cover negative cases and use decision tables to find gaps
- Turn a test case into an automated test with Arrange, Act, Assert
- Organise a suite with the test pyramid and a traceability matrix

## Before you start

- Curiosity about how software breaks
- Node.js, only if you want to run lesson 3.1's tests yourself

## Structure

1. **Foundations** (30 min): What a test case is, and what separates a good one from a weak one.
2. **Designing test cases** (45 min): Choose which cases to write with partitions, boundaries and decision tables.
3. **Automating and scaling** (30 min): Turn cases into code, then organise a suite that people trust.

## Chapter 1: Foundations

What a test case is, and what separates a good one from a weak one. (30 min)

### Lesson 1.1: What is a test case? (15 min, ▶ 2:56)

The parts of a test case, built field by field and then run by hand against a real sign-in page.

/demo/test-cases/foundations/anatomy.md

Outcomes:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

Key points:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### Lesson 1.2: Good test cases, weak test cases (15 min, ▶ 1:55)

Five habits that make a test case trustworthy, and the Given, When, Then shape many teams write them in.

/demo/test-cases/foundations/good-cases.md

Outcomes:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

Key points:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## Chapter 2: Designing test cases

Choose which cases to write with partitions, boundaries and decision tables. (45 min)

### Lesson 2.1: Partitions and boundaries (15 min, ▶ 1:30)

Equivalence partitioning and boundary value analysis: a few well-chosen inputs instead of thousands.

/demo/test-cases/design/partitions.md

Outcomes:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

Key points:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### Lesson 2.2: Beyond the happy path (15 min, ▶ 1:28)

Negative cases, edge cases, and decision tables for rules that combine.

/demo/test-cases/design/negative.md

Outcomes:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

Key points:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### Lesson 2.3: Exploratory testing (15 min, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/test-cases/design/exploratory.md

Outcomes:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

Key points:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## Chapter 3: Automating and scaling

Turn cases into code, then organise a suite that people trust. (30 min)

### Lesson 3.1: From test case to automated test (15 min, ▶ 1:28)

Turn a written test case into code with Arrange, Act, Assert, then watch a boundary test catch a real bug.

/demo/test-cases/automation/unit-tests.md

Outcomes:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

Key points:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### Lesson 3.2: Organizing a test suite (15 min, ▶ 1:42)

The test pyramid, traceability to requirements, and keeping a growing suite healthy.

/demo/test-cases/automation/suites.md

Outcomes:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

Key points:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
