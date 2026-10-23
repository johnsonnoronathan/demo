import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "What to check in an HTTP API",
  scenes: [
    {
      label: "Introduction",
      cues: ["An API is a promise: send this request, get that answer. In this lesson, the three checks that tell you whether the promise holds."],
      panes: [{ type: "title", kicker: "Lesson 1.1 · What to check", heading: "What to check in an HTTP API", sub: "Status, shape and errors", subAt: 0.5 }],
    },
    {
      label: "Status codes",
      cues: [
        "Every response starts with a three-digit status code. It's the server's own summary of what happened.",
        "Two hundreds mean it worked.",
        "Four hundreds mean the client's request was wrong: a bad id, a missing login, something that doesn't exist.",
        "Five hundreds mean the server itself failed. A bad request should never cause one.",
      ],
      panes: [{
        type: "bullets",
        lead: "The first digit is the family",
        items: [
          { at: 1, text: "2xx · it worked", sub: "200 OK, 201 Created" },
          { at: 2, text: "4xx · the request was wrong", sub: "400 Bad Request, 404 Not Found" },
          { at: 3, text: "5xx · the server failed", sub: "500 Internal Server Error" },
        ],
      }],
    },
    {
      label: "Response shape",
      cues: [
        "A two hundred only says the server thinks it worked. The body is what the client actually uses.",
        "So check the content type says JSON,",
        "that every field the client relies on is there,",
        "and that each one has the right type. A price should be a number, not a string.",
      ],
      panes: [{
        type: "code",
        file: "GET /books/1",
        lang: "js",
        typeTo: 0.6,
        code: "{\n  \"id\": 1,\n  \"title\": \"Dune\",\n  \"price\": 9.99\n}",
        highlights: [
          { at: 2, until: 3, lines: [2, 3, 4], note: "every field is there" },
          { at: 3, until: 4, lines: [4], note: "price is a number", good: true },
        ],
      }],
    },
    {
      label: "Error cases",
      cues: [
        "Most bugs hide in the requests nobody planned for. For each endpoint, ask what can be wrong with the request.",
        "A book that doesn't exist should get a four oh four.",
        "An id that isn't a number at all should get a four hundred, with a message that says what was wrong.",
      ],
      panes: [{
        type: "table",
        caption: "GET /books/:id · one request per behaviour",
        cols: ["Request", "Behaviour", "Expected"],
        widths: ["34%", "33%", "33%"],
        rows: [
          { at: 0.5, cells: ["/books/1", "Exists", "200 + the book"] },
          { at: 1, cells: ["/books/999", "Missing", "404 + error"] },
          { at: 2, cells: ["/books/abc", "Malformed", "400 + error"] },
        ],
      }],
    },
    {
      label: "Try it with curl",
      cues: [
        "With the lesson's tiny server running, send one request of each kind with curl.",
        "Each line shows the body, then the status code and content type.",
        "All three answers fit their requests. Write down what you expect before you run each one: that's what turns reading output into a test.",
      ],
      panes: [{
        type: "terminal",
        title: "curl",
        lines: [
          { at: 0.5, text: "$ curl -s -w '  %{http_code} %{content_type}\\n' http://localhost:3000/books/1", kind: "cmd" },
          { at: 1, text: "{\"id\":1,\"title\":\"Dune\",\"price\":9.99}  200 application/json", kind: "out" },
          { at: 1.3, text: "$ curl … http://localhost:3000/books/999", kind: "cmd" },
          { at: 1.5, text: "{\"error\":\"not found\"}  404 application/json", kind: "out" },
          { at: 1.7, text: "$ curl … http://localhost:3000/books/abc", kind: "cmd" },
          { at: 1.9, text: "{\"error\":\"id must be a number\"}  400 application/json", kind: "out" },
        ],
      }],
    },
  ],
});
