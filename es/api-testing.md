# API Testing

> Check that an HTTP API answers the way it promises.

A short introduction to testing HTTP APIs. Learn the three things to check on every response (the status code, the shape of the body, and what happens when the request is wrong), try them by hand with curl, then turn them into automated checks that run against your own API.

Tiempo total: 55 min

## Capítulo 1: What to check

Status codes, response shape and error cases, checked by hand with curl.

- [Lección 1.1: What to check in an HTTP API](/demo/es/api-testing/basics/what-to-check.md) (20 min). The three checks for every API response: the status code, the shape of the body, and what happens when the request is wrong.

## Capítulo 2: Checks for your own API

Turn the hand checks into automated tests and run them against your own API.

- [Lección 2.1: Automated checks for your own API](/demo/es/api-testing/own-api/first-checks.md) (35 min). Turn the three hand checks into automated tests with Node's built-in test runner, watch one fail, then apply them to your own API.
