# 教案: API Testing

A short introduction to testing HTTP APIs. Learn the three things to check on every response (the status code, the shape of the body, and what happens when the request is wrong), try them by hand with curl, then turn them into automated checks that run against your own API.

- 总时长: 55 分钟
- 视频: 2 (3:33)
- Developers and testers who have used a terminal and can read a little JavaScript. No previous API testing experience needed.

## 课程目标

- Read an HTTP response and say whether its status code fits the request
- Check the shape of a JSON response, not only that one came back
- Choose error cases for an endpoint and say what each should return
- Write automated API checks with Node's built-in test runner
- Apply the checks to your own API, with an agent implementing the fixes

## 开始之前

- Node.js 22 or later
- curl
- An HTTP API of your own to test, for lesson 2.1

## 结构

1. **What to check** (20 min): Status codes, response shape and error cases, checked by hand with curl.
2. **Checks for your own API** (35 min): Turn the hand checks into automated tests and run them against your own API.

## 第 1 章: What to check

Status codes, response shape and error cases, checked by hand with curl. (20 分钟)

### 第 1.1 课: What to check in an HTTP API (20 分钟, ▶ 1:42)

The three checks for every API response: the status code, the shape of the body, and what happens when the request is wrong.

/demo/zh/api-testing/basics/what-to-check.md

学习成果:
- Say which status code a request should get, and spot one that doesn't fit
- Check the shape of a JSON body: its fields and their types
- List the error cases for an endpoint and what each should return
- Run all three checks by hand with curl

概念:
- Status codes
- Response shape
- Error cases

要点:
- Check the status code first: it is the API's own summary of what happened, and clients act on it.
- A 200 with the wrong body is still a bug. Check that the fields you rely on are there and have the right types.
- Every endpoint has error cases: something missing, something malformed. Each should get a 4xx with a readable error, never a 500.
- A 500 means the server broke. A bad request from the client should never cause one.

## 第 2 章: Checks for your own API

Turn the hand checks into automated tests and run them against your own API. (35 分钟)

### 第 2.1 课: Automated checks for your own API (35 分钟, ▶ 1:51)

Turn the three hand checks into automated tests with Node's built-in test runner, watch one fail, then apply them to your own API.

/demo/zh/api-testing/own-api/first-checks.md

学习成果:
- Write an API check that asserts status code, content type and body shape
- Cover an endpoint's error cases with one test each
- See a check fail on purpose before trusting it to pass
- Have an agent write checks for your own API, then verify them with your own run

概念:
- One test per behaviour
- Red first

动手练习 · 25 分钟: **Write checks for one endpoint of your API**. One endpoint of your API has automated checks for its status codes, response shape and error cases, and you have run them yourself.

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

要点:
- An API test is the hand check written down: send the request, then assert the status, the content type and the shape of the body.
- Write one test per behaviour: the happy path, then each error case. A failing test's name then tells you which promise broke.
- Read the base URL from an environment variable, so the same tests run against your laptop, a staging server or CI.
- Break the API on purpose once and watch the test go red. A test you've never seen fail may not be checking anything.
- A failing check is information. Fix the API, or agree that the expectation was wrong, but never loosen the check just to make it pass.
