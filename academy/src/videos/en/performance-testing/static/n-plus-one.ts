import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Code review for N+1 queries",
  scenes: [
    {
      label: "Introduction",
      cues: ["Here's the most common performance bug in database-backed code, and how to find it just by reading."],
      panes: [{ type: "title", kicker: "Lesson 2.2 · Static testing", heading: "Code review for N+1 queries", sub: "The bug that hides in a loop", subAt: 0.4 }],
    },
    {
      label: "Read the code",
      cues: [
        "This is the books endpoint. It fetches one page of fifty books in a single query.",
        "Then it loops over the books. Inside the loop, it asks the database for each book's author,",
        "and for each book's rating. That's two more queries for every book on the page.",
      ],
      panes: [{
        type: "code", file: "src/routes/books.mjs", lang: "js", typeTo: 0.9,
        code: `export function listBooks(params) {
  const books = query(
    "SELECT id, title, author_id FROM books LIMIT 50"
  ).all();

  for (const book of books) {
    book.author = query("SELECT name FROM authors WHERE id = ?")
      .get(book.author_id).name;
    book.rating = query("SELECT avg(stars) FROM reviews WHERE book_id = ?")
      .get(book.id);
  }
  return books;
}`,
        highlights: [
          { at: 1, until: 2, lines: [6, 7, 8], note: "query inside a loop" },
          { at: 2, until: 3, lines: [9, 10], note: "× 50 books", bad: true },
        ],
      }],
    },
    {
      label: "On a timeline",
      cues: [
        "On a timeline it looks like this. One query for the list,",
        "then a hundred small queries, one after another.",
        "A hundred and one round trips for one page. Each one is quick, but together they're most of the response time.",
        "One query with joins fetches exactly the same data in a single trip.",
      ],
      panes: [{ type: "concept", scene: "n-plus-one" }],
    },
    {
      label: "Find it, fix it",
      cues: [
        "The pattern is easy to spot statically: a database call inside a loop. The practice app ships with a small linter that finds it.",
        "In the exercise you'll rewrite the loop as one query, and watch the query count drop from a hundred and one to one, with an identical response.",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run lint:queries", kind: "cmd" },
          { at: 0.3, text: "src/routes/books.mjs:11  query inside a loop (possible N+1)", kind: "fail" },
          { at: 0.4, text: "src/routes/books.mjs:13  query inside a loop (possible N+1)", kind: "fail" },
          { at: 0.6, text: "2 possible N+1 pattern(s).", kind: "sum-fail" },
          { at: 1.1, text: "$ curl -s -i localhost:3000/api/books | grep x-query-count", kind: "cmd" },
          { at: 1.4, text: "x-query-count: 1", kind: "pass" },
          { at: 1.6, text: "$ npm run lint:queries", kind: "cmd" },
          { at: 1.8, text: "No queries inside loops found.", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
