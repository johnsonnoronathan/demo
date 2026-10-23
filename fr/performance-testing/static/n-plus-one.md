# Leçon 2.2: Revue de code : les requêtes N+1

Tests de performance · Chapitre 2: Tests statiques · 25 min

> Le bug de performance le plus courant dans le code qui utilise une base de données, comment le trouver en lisant et comment l'éliminer.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

**Vous saurez:**
- Recognise the N+1 query pattern in code
- Use a static check to flag database calls inside loops
- Rewrite an N+1 loop as a single query with joins, and verify the query count

## Transcription: Code review for N+1 queries (1:14)

**0:00 Introduction.** Here's the most common performance bug in database-backed code, and how to find it just by reading.

**0:07 Read the code.** This is the books endpoint. It fetches one page of fifty books in a single query. Then it loops over the books. Inside the loop, it asks the database for each book's author, and for each book's rating. That's two more queries for every book on the page.

**0:29 On a timeline.** On a timeline it looks like this. One query for the list, then a hundred small queries, one after another. A hundred and one round trips for one page. Each one is quick, but together they're most of the response time. One query with joins fetches exactly the same data in a single trip.

**0:53 Find it, fix it.** The pattern is easy to spot statically: a database call inside a loop. The practice app ships with a small linter that finds it. In the exercise you'll rewrite the loop as one query, and watch the query count drop from a hundred and one to one, with an identical response.

## La leçon

Here is the books endpoint that the storefront calls. Read it before reading on; the problem is visible.

```js title="src/routes/books.mjs"
export function listBooks(params) {
  const page = Math.max(1, Number(params.get("page")) || 1);
  const books = query(
    "SELECT id, title, author_id, price_cents FROM books ORDER BY id LIMIT 50 OFFSET ?"
  ).all((page - 1) * 50);

  for (const book of books) {
    const author = query("SELECT name FROM authors WHERE id = ?").get(book.author_id);
    book.author = author.name;
    const rating = query("SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?").get(book.id);
    book.rating = rating.avg ? Math.round(rating.avg * 10) / 10 : null;
    book.reviews = rating.n;
  }
  return { page, books };
}
```

## The N+1 pattern

One query fetches the list. Then the loop runs two more queries **for every item**. With 50 books that's 1 + 50 × 2 = 101 queries for one page.

> **Animation de concept: The N+1 query pattern**
>
> 1. The books endpoint asks the database for one page of 50 books. One query.
> 2. Then it loops over the books and asks for each one's author and rating: two more queries per book.
> 3. That's 101 round trips for one page. Each is small; together they're most of the response time.
> 4. One query with JOINs fetches the same data in a single trip.

Each query is cheap on its own, which is why N+1 survives code review and local testing: on a laptop with 10 rows, nobody notices. It grows with the page size and the data, and on a real network every query adds a round trip. ORMs make it easy to write by accident, because `book.author.name` can quietly run a query.

## Finding it statically

The shape is distinctive: a database call **inside a loop body**. That's easy to check without running anything. Larkspur includes a small linter that does exactly this:

```bash
npm run lint:queries
```

```text
src/routes/books.mjs:11  query inside a loop (possible N+1)
    const author = query("SELECT name FROM authors WHERE id = ?").get(book.author_id);
src/routes/books.mjs:13  query inside a loop (possible N+1)
    const rating = query("SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?").get(book.id);

2 possible N+1 pattern(s).
```

It's a heuristic. It reads source text and tracks loop bodies, so it can miss a query hidden behind a helper function and can flag a loop that only ever runs once. Treat each finding as a question for code review. Real projects use the same idea at a larger scale: ORM-specific lint rules, or a test that fails if an endpoint runs more than N queries.

## Fixing it

Ask the database for everything in one go. SQL is built for this: join the authors, aggregate the reviews, and group by book.

```js title="src/routes/books.mjs (after)"
export function listBooks(params) {
  const page = Math.max(1, Number(params.get("page")) || 1);
  const books = query(`
    SELECT b.id, b.title, b.author_id, b.price_cents, a.name AS author,
           round(avg(r.stars), 1) AS rating, count(r.id) AS reviews
    FROM (SELECT * FROM books ORDER BY id LIMIT 50 OFFSET ?) AS b
    JOIN authors a ON a.id = b.author_id
    LEFT JOIN reviews r ON r.book_id = b.id
    GROUP BY b.id
    ORDER BY b.id`).all((page - 1) * 50);
  return { page, books };
}
```

When a join isn't practical (the data lives in another service, say), **batch** instead: collect the IDs and fetch them in one `WHERE id IN (...)` query. Either way the query count stops depending on the page size.

| | Queries per request | Server time, one request |
| --- | --- | --- |
| Before | 101 | 60 ms |
| After the join | 1 | 26 ms |

Better, but 26 ms for 50 rows is still slow. The join reads the reviews table in a way that needs an index. That's lesson 2.3.

## Hands-on: Find and remove the N+1 in /api/books

**Pratique · 20 min.** Objectif. Use the query linter to find the N+1 in the books endpoint, rewrite it as one query, and show the query count drop from 101 to 1 with the same response.

1. Run `npm run lint:queries`. You should get the two findings above.
2. Start the app and save the current response, so you can prove the fix changes nothing visible:

   ```bash
   curl -s http://localhost:3000/api/books > /tmp/books-before.json
   curl -s -i http://localhost:3000/api/books | grep -i -E "x-query-count|server-timing"
   ```

3. Replace `listBooks` with the single-query version, restart the app, and fetch again into `/tmp/books-after.json`.
4. Compare the two files. They should be identical:

   ```bash
   node -e 'const a=require("/tmp/books-before.json"),b=require("/tmp/books-after.json");console.log(JSON.stringify(a)===JSON.stringify(b)?"identical":"DIFFERENT")'
   ```

![Terminal showing x-query-count: 1 and server-timing around 26 ms for /api/books, the word 'identical' from the comparison, and 'No queries inside loops found.' from the linter.](screenshot-pending)
*Screenshot (curl and lint:queries): One query, same response, linter clean.*

5. Run `npm run lint:queries` again. It should report nothing and exit 0.

**C'est terminé quand**
- `npm run lint:queries` reports no queries inside loops and exits 0
- `x-query-count` for /api/books is 1
- The before and after JSON responses are identical

**La part de l'agent : déléguez l'implémentation**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.2, "Code review for N+1 queries".

Exercise: Find and remove the N+1 in /api/books
Goal: Use the query linter to find the N+1 in the books endpoint, rewrite it as one query, and show the query count drop from 101 to 1 with the same response.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run lint:queries` and capture the findings.
2. Start the app (`npm start` in the background), save the current response with `curl -s http://localhost:3000/api/books > /tmp/books-before.json`, and note the `x-query-count` header.
3. Rewrite `listBooks` in `src/routes/books.mjs` so it runs a single query: select the page of 50 books in a subquery, JOIN authors, LEFT JOIN reviews, GROUP BY book, and compute `rating` as avg(stars) rounded to one decimal (null when there are no reviews) and `reviews` as the review count. Keep the response shape: page, books[] with id, title, author_id, price_cents, author, rating, reviews.
4. Restart the app, fetch the endpoint again into /tmp/books-after.json, and compare it with the before file using `node -e` (parse both and deep-compare).
5. Run `npm run lint:queries` again.

Done when:
- `npm run lint:queries` reports no queries inside loops and exits 0
- `x-query-count` for /api/books is 1
- The before and after JSON responses are identical

Report back:
- The new listBooks function
- x-query-count and server-timing before and after
- The result of the JSON comparison

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/2-n-plus-one.mdx
```

## Points clés

- N+1 means one query for a list, then one more per item. The cost grows with the list and hides in fast local databases.
- Statically, it looks like a database call inside a loop or a .map callback. A simple lint rule catches most cases.
- Fix it by fetching everything in one query (JOIN, GROUP BY) or in one batched query (WHERE id IN (...)).
- Count queries per request. A count that grows with the page size is the signature of N+1.

---

Précédent: [Leçon 2.1: Budgets de performance](/demo/fr/performance-testing/static/budgets.md)
Suivant: [Leçon 2.3: Lire les plans de requête](/demo/fr/performance-testing/static/query-plans.md)
