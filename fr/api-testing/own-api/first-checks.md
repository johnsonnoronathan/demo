# Leçon 2.1: Automated checks for your own API

API Testing · Chapitre 2: Checks for your own API · 35 min

> Turn the three hand checks into automated tests with Node's built-in test runner, watch one fail, then apply them to your own API.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

**Vous saurez:**
- Write an API check that asserts status code, content type and body shape
- Cover an endpoint's error cases with one test each
- See a check fail on purpose before trusting it to pass
- Have an agent write checks for your own API, then verify them with your own run

## Transcription: Automated checks for your own API (1:51)

**0:00 Introduction.** Checking an API by hand works once. In this lesson, you write the same checks as tests that run every time the code changes.

**0:10 One test per behaviour.** Each hand check becomes one test. Node has a test runner built in, so you need nothing extra. The test sends the request with fetch. Then it asserts the status code and the content type. And then the shape: each field is there, with the right type. Not the exact values, so the test survives new test data.

**0:36 Run it.** Two more tests cover the error cases: a missing book, and an id that isn't a number. Run them with node dash dash test. Three passes, no failures, and an exit code of zero, which is what CI looks at.

**0:53 Red first.** Green ticks only mean something if the tests can go red. So break the API on purpose. Delete the line that answers four hundred for a bad id, and run the tests again. Now the bad id gets a four oh four, and the matching test fails. The runner says why: four oh four, not four hundred. Put the line back, and it passes again. Never change the test to four oh four just to make it green.

**1:27 Your turn.** Now do the same on your own API. You pick one endpoint and write down what each request should return. The agent writes the tests on a branch and reports every failure as a finding. Then you run the tests yourself, break the endpoint once to see them go red, and decide what each failure means.

## La leçon

In lesson 1.1 you checked an API by hand: send a request, read the status and the body, compare with what you expected. That works once. An automated check does the same comparison every time the code changes, in a fraction of a second.

## One test per behaviour

Each hand check from lesson 1.1 becomes one test. The test sends the request, then asserts the three things: status code, content type and shape.

Node.js has a test runner built in, so you need nothing extra. Save this next to `server.mjs` from lesson 1.1:

```js title="books.test.mjs"
// books.test.mjs: run with  node --test
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.API_URL ?? "http://localhost:3000";

test("GET /books/1 returns the book", async () => {
  const res = await fetch(`${BASE}/books/1`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /application\/json/);
  const book = await res.json();
  assert.equal(typeof book.id, "number");
  assert.equal(typeof book.title, "string");
  assert.equal(typeof book.price, "number");
});

test("GET /books/999 is a 404 with an error message", async () => {
  const res = await fetch(`${BASE}/books/999`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(typeof body.error, "string");
});

test("GET /books/abc is a 400, not a 500", async () => {
  const res = await fetch(`${BASE}/books/abc`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(typeof body.error, "string");
});
```

Three things to notice:

- **One behaviour per test.** When one fails, its name says which promise broke.
- **Shape, not exact values.** The first test checks that `price` is a number, not that it is 9.99.
- **The base URL comes from `API_URL`.** The same file can run against your laptop, a staging server or CI.

## Run it

With `node server.mjs` running in another terminal:

```bash
node --test --test-reporter=spec books.test.mjs
```

The output, with the timings removed (they change on every run):

```text
✔ GET /books/1 returns the book
✔ GET /books/999 is a 404 with an error message
✔ GET /books/abc is a 400, not a 500
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
```

The exit code is 0, which is what CI looks at. Check it with `echo $?` straight after the run.

## Red first

Three green ticks only mean something if the tests can go red. So break the API on purpose and watch.

In `server.mjs`, delete the line that answers 400 (`if (!/^\d+$/.test(m[1])) …`). Restart the server and run the tests again. Now `/books/abc` falls through to the lookup and gets a 404:

```text
✔ GET /books/1 returns the book
✔ GET /books/999 is a 404 with an error message
✖ GET /books/abc is a 400, not a 500
ℹ tests 3
ℹ suites 0
ℹ pass 2
ℹ fail 1
```

Further down, the runner says why: `404 !== 400`, the actual value first and the expected second. The exit code is 1. Put the line back, restart, and the tests pass again.

> **Don't loosen the check.** When a test fails, the tempting fix is to change `400` to `404` in the test. Only do that if you agree the API's answer is the right one. Otherwise the failure is a bug report, and the API is what needs fixing.

## Hands-on: checks for your own API

Now the same three kinds of test, on an API you work on. An agent writes the tests; you choose the endpoint, run them and decide what a failure means.

**Pratique · 25 min.** Objectif. One endpoint of your API has automated checks for its status codes, response shape and error cases, and you have run them yourself.

1. Pick one endpoint of your API that returns one item by id. Write down, before anything runs, what each of these should return: an id that exists, an id that doesn't, and an id that isn't valid.
2. Open your project in a terminal, start a coding agent there, and paste the prompt below. Name your endpoint when you paste it.
3. When the agent reports back, check out its branch, start your API, and **run the tests yourself** with the command it gave you.

   ```bash
   API_URL=http://localhost:<port> <the test command the agent gave you>
   ```

4. Read the output. Do the test names match the three behaviours you wrote down in step 1? Does your pass and fail count match the one the agent quoted?
5. Break the endpoint on purpose, as in "Red first", and confirm that the matching test goes red. Then restore it.
6. For each failure the agent reported, decide: is the API wrong, or was your expectation wrong? Record the decision. Change a test's expectation only in the second case.

**C'est terminé quand**
- The endpoint has at least three tests: success, missing and malformed
- The tests read the base URL from API_URL
- The tests ran against the running API, with the output quoted

**La part de l'agent : déléguez l'implémentation**

```text
You are doing a hands-on exercise from the "API Testing" course: Lesson 2.1, "Automated checks for your own API".

Exercise: Write checks for one endpoint of your API
Goal: One endpoint of your API has automated checks for its status codes, response shape and error cases, and you have run them yourself.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Identify how the API is built and started from the repository (framework, start command, port), and whether it already has a test runner. Quote the files you read.
2. Work on the endpoint the learner names. If none is named, pick one read endpoint (a GET that returns one item by id) and say which you chose.
3. Create a new branch. Write API tests for that endpoint using the project's existing test runner, or Node's built-in node:test with fetch if it has none. Read the base URL from an API_URL environment variable with a sensible local default.
4. Write one test per behaviour: the success case (assert the status code, the content type, and that each field the client uses is present with the right type), a missing item, and a malformed input. Use the status codes the API documents; if it documents none, use 404 for missing and 400 or 422 for malformed, and say so.
5. Start the API and run the tests. Quote the full output and the exit code.
6. If a test fails, do not change the test's expected status or shape to make it pass. Report the failure as a finding, with the request, the expected and actual response, and the line in the API that causes it. Fix the API only if the learner asked you to.
7. Do not push, merge or deploy, and do not add dependencies without asking.

Done when:
- The endpoint has at least three tests: success, missing and malformed
- The tests read the base URL from API_URL
- The tests ran against the running API, with the output quoted

Report back:
- The command to start the API and the command to run the tests
- The full test output and exit code, quoted
- Every failure, as request, expected response and actual response
- The branch name and the list of changed files

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/api-testing/own-api/first-checks.md
```

## Points clés

- An API test is the hand check written down: send the request, then assert the status, the content type and the shape of the body.
- Write one test per behaviour: the happy path, then each error case. A failing test's name then tells you which promise broke.
- Read the base URL from an environment variable, so the same tests run against your laptop, a staging server or CI.
- Break the API on purpose once and watch the test go red. A test you've never seen fail may not be checking anything.
- A failing check is information. Fix the API, or agree that the expectation was wrong, but never loosen the check just to make it pass.

---

Précédent: [Leçon 1.1: What to check in an HTTP API](/demo/fr/api-testing/basics/what-to-check.md)
