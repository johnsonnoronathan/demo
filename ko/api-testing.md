# API Testing

> Check that an HTTP API answers the way it promises.

A short introduction to testing HTTP APIs. Learn the three things to check on every response (the status code, the shape of the body, and what happens when the request is wrong), try them by hand with curl, then turn them into automated checks that run against your own API.

총 시간: 55 분

## 1장: What to check

Status codes, response shape and error cases, checked by hand with curl.

- [강의 1.1: What to check in an HTTP API](/demo/ko/api-testing/basics/what-to-check.md) (20분). The three checks for every API response: the status code, the shape of the body, and what happens when the request is wrong.

## 2장: Checks for your own API

Turn the hand checks into automated tests and run them against your own API.

- [강의 2.1: Automated checks for your own API](/demo/ko/api-testing/own-api/first-checks.md) (35분). Turn the three hand checks into automated tests with Node's built-in test runner, watch one fail, then apply them to your own API.
