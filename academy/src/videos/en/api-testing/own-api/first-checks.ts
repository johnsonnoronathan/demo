import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Automated checks for your own API",
  scenes: [
    {
      label: "Introduction",
      cues: ["Checking an API by hand works once. In this lesson, you write the same checks as tests that run every time the code changes."],
      panes: [{ type: "title", kicker: "Lesson 2.1 · Checks for your own API", heading: "Automated checks for your own API", sub: "From curl to node --test", subAt: 0.5 }],
    },
    {
      label: "One test per behaviour",
      cues: [
        "Each hand check becomes one test. Node has a test runner built in, so you need nothing extra.",
        "The test sends the request with fetch.",
        "Then it asserts the status code and the content type.",
        "And then the shape: each field is there, with the right type. Not the exact values, so the test survives new test data.",
      ],
      panes: [{
        type: "code",
        file: "books.test.mjs",
        lang: "js",
        typeTo: 0.8,
        code: "const BASE = process.env.API_URL ?? \"http://localhost:3000\";\n\ntest(\"GET /books/1 returns the book\", async () => {\n  const res = await fetch(`${BASE}/books/1`);\n  assert.equal(res.status, 200);\n  assert.match(res.headers.get(\"content-type\"), /application\\/json/);\n  const book = await res.json();\n  assert.equal(typeof book.id, \"number\");\n  assert.equal(typeof book.title, \"string\");\n  assert.equal(typeof book.price, \"number\");\n});",
        highlights: [
          { at: 1, until: 2, lines: [4] },
          { at: 2, until: 3, lines: [5, 6], note: "status and content type" },
          { at: 3, until: 4, lines: [8, 9, 10], note: "shape, not values", good: true },
        ],
      }],
    },
    {
      label: "Run it",
      cues: [
        "Two more tests cover the error cases: a missing book, and an id that isn't a number.",
        "Run them with node dash dash test. Three passes, no failures, and an exit code of zero, which is what CI looks at.",
      ],
      panes: [{
        type: "terminal",
        title: "node --test",
        lines: [
          { at: 1, text: "$ node --test --test-reporter=spec books.test.mjs", kind: "cmd" },
          { at: 1.2, text: "✔ GET /books/1 returns the book", kind: "pass" },
          { at: 1.35, text: "✔ GET /books/999 is a 404 with an error message", kind: "pass" },
          { at: 1.5, text: "✔ GET /books/abc is a 400, not a 500", kind: "pass" },
          { at: 1.7, text: "ℹ tests 3", kind: "dim" },
          { at: 1.75, text: "ℹ pass 3", kind: "sum-pass" },
          { at: 1.8, text: "ℹ fail 0", kind: "dim" },
        ],
      }],
    },
    {
      label: "Red first",
      cues: [
        "Green ticks only mean something if the tests can go red. So break the API on purpose.",
        "Delete the line that answers four hundred for a bad id, and run the tests again.",
        "Now the bad id gets a four oh four, and the matching test fails. The runner says why: four oh four, not four hundred.",
        "Put the line back, and it passes again. Never change the test to four oh four just to make it green.",
      ],
      panes: [{
        type: "terminal",
        title: "node --test, with the 400 line deleted",
        lines: [
          { at: 1, text: "$ node --test --test-reporter=spec books.test.mjs", kind: "cmd" },
          { at: 1.4, text: "✔ GET /books/1 returns the book", kind: "pass-dim" },
          { at: 1.6, text: "✔ GET /books/999 is a 404 with an error message", kind: "pass-dim" },
          { at: 2, text: "✖ GET /books/abc is a 400, not a 500", kind: "fail" },
          { at: 2.2, text: "ℹ pass 2", kind: "dim" },
          { at: 2.25, text: "ℹ fail 1", kind: "sum-fail" },
          { at: 2.5, text: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:", kind: "out" },
          { at: 2.6, text: "404 !== 400", kind: "fail" },
        ],
      }],
    },
    {
      label: "Your turn",
      cues: [
        "Now do the same on your own API. You pick one endpoint and write down what each request should return.",
        "The agent writes the tests on a branch and reports every failure as a finding.",
        "Then you run the tests yourself, break the endpoint once to see them go red, and decide what each failure means.",
      ],
      panes: [{
        type: "bullets",
        check: true,
        items: [
          { at: 0, text: "You pick the endpoint and the expected answers" },
          { at: 1, text: "The agent writes the tests" },
          { at: 2, text: "You run them, break it once, and decide" },
        ],
      }],
    },
  ],
});
