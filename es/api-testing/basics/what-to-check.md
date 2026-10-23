# Lección 1.1: What to check in an HTTP API

API Testing · Capítulo 1: What to check · 20 min

> The three checks for every API response: the status code, the shape of the body, and what happens when the request is wrong.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

**Serás capaz de:**
- Say which status code a request should get, and spot one that doesn't fit
- Check the shape of a JSON body: its fields and their types
- List the error cases for an endpoint and what each should return
- Run all three checks by hand with curl

## Transcripción: What to check in an HTTP API (1:42)

**0:00 Introduction.** An API is a promise: send this request, get that answer. In this lesson, the three checks that tell you whether the promise holds.

**0:10 Status codes.** Every response starts with a three-digit status code. It's the server's own summary of what happened. Two hundreds mean it worked. Four hundreds mean the client's request was wrong: a bad id, a missing login, something that doesn't exist. Five hundreds mean the server itself failed. A bad request should never cause one.

**0:34 Response shape.** A two hundred only says the server thinks it worked. The body is what the client actually uses. So check the content type says JSON, that every field the client relies on is there, and that each one has the right type. A price should be a number, not a string.

**0:57 Error cases.** Most bugs hide in the requests nobody planned for. For each endpoint, ask what can be wrong with the request. A book that doesn't exist should get a four oh four. An id that isn't a number at all should get a four hundred, with a message that says what was wrong.

**1:20 Try it with curl.** With the lesson's tiny server running, send one request of each kind with curl. Each line shows the body, then the status code and content type. All three answers fit their requests. Write down what you expect before you run each one: that's what turns reading output into a test.

## La lección

An API is a promise: send this request, get that answer. Testing it means checking that the promise holds, for good requests and bad ones. This lesson covers the three checks you make on every response, and you'll try them by hand.

## A tiny API to practise on

You need an API to point the checks at. This one has a single endpoint, `GET /books/:id`, and needs nothing but Node.js. Save it as `server.mjs`:

```js title="server.mjs"
// server.mjs: a tiny API to practise on. Run: node server.mjs
import { createServer } from "node:http";

const books = { 1: { id: 1, title: "Dune", price: 9.99 } };

createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  const m = req.url.match(/^\/books\/([^/]+)$/);
  if (!m) return send(404, { error: "not found" });
  if (!/^\d+$/.test(m[1])) return send(400, { error: "id must be a number" });
  const book = books[m[1]];
  if (!book) return send(404, { error: "not found" });
  send(200, book);
}).listen(3000, () => console.log("listening on http://localhost:3000"));
```

Start it with `node server.mjs` and leave it running in its own terminal.

## Status codes

Every HTTP response starts with a three-digit status code. It is the server's one-line summary of what happened, and clients make decisions on it before they read the body.

The first digit is the family:

| Family | Means | Common ones |
| --- | --- | --- |
| 2xx | It worked | 200 OK, 201 Created, 204 No Content |
| 4xx | The client's request was wrong | 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Content |
| 5xx | The server failed | 500 Internal Server Error, 503 Service Unavailable |

The check is simple: for this request, is this the right code? A 200 for a missing book is wrong. So is a 500 for a typo in the URL.

## Response shape

A 200 only says the server thinks it worked. The body is what the client actually uses, so check its shape too:

- **The content type** says JSON when the body is JSON.
- **The fields** the client relies on are all there.
- **Their types** are right: a price is a number, not the string `"9.99"`.

Check shape, not exact values, unless the value is the point of the test. A check that the title is a string survives a change of test data; a check that it equals `"Dune"` doesn't.

## Error cases

Most bugs hide in the requests nobody planned for. For each endpoint, ask what can be wrong with the request:

- **Missing:** the thing doesn't exist (`/books/999`).
- **Malformed:** the input isn't valid at all (`/books/abc`).
- **Not allowed:** no login, or someone else's data (401, 403), if the API has accounts.

Each should get a 4xx code and a body that says what was wrong. A 500 for any of them is a bug: the client sent something bad, and the server fell over instead of saying so.

## Try it

With the server running, send one request of each kind. The `-w` option prints the status code and content type after the body:

```bash
curl -s -w '  %{http_code} %{content_type}\n' http://localhost:3000/books/1
curl -s -w '  %{http_code} %{content_type}\n' http://localhost:3000/books/999
curl -s -w '  %{http_code} %{content_type}\n' http://localhost:3000/books/abc
```

You should see:

```text
{"id":1,"title":"Dune","price":9.99}  200 application/json
{"error":"not found"}  404 application/json
{"error":"id must be a number"}  400 application/json
```

For each line, check all three things: is the code right for the request, does the body have the shape you expect, and does each error say what went wrong? Then answer the quiz below.

> **Write down what you expect first.** Before you run each request, write the status code and body you expect. Comparing afterwards is a test; reading the output and nodding is not.

## Quiz

1. GET /books/abc, where ids are numbers, returns 500 Internal Server Error. What's wrong?
   a. Nothing: the request was bad, so an error is right
   b. The server should answer 400: the client sent a bad id, and the server should say so instead of crashing
   c. It should return 200 with an empty body
   d. It should return 404, because no book is called abc
   Answer: b. The request is wrong, so a 4xx is right, and 400 says exactly that. A 500 means the server itself failed, which tells the client nothing it can fix. 404 is defensible for a missing book, but abc is not a valid id at all.
2. An endpoint returns 200 and the body {"id": "1", "title": "Dune"}. Your app adds the price to a total. Which check finds the problem?
   a. The status code check
   b. A shape check that price is present and is a number
   c. Checking that the response arrived quickly
   d. None: a 200 means it worked
   Answer: b. The status is fine, so only a shape check catches that price is missing. It would also catch that id is a string, not a number.
3. Which list of requests covers the error cases for GET /books/:id best?
   a. /books/1, /books/2, /books/3
   b. /books/1, /books/999, /books/abc
   c. /books/1 three times
   d. /books/999 only
   Answer: b. One that exists, one that doesn't, and one that isn't a valid id: three different behaviours. Three valid ids test the same behaviour three times.

## Ideas clave

- Check the status code first: it is the API's own summary of what happened, and clients act on it.
- A 200 with the wrong body is still a bug. Check that the fields you rely on are there and have the right types.
- Every endpoint has error cases: something missing, something malformed. Each should get a 4xx with a readable error, never a 500.
- A 500 means the server broke. A bad request from the client should never cause one.

---

Siguiente: [Lección 2.1: Automated checks for your own API](/demo/es/api-testing/own-api/first-checks.md)
