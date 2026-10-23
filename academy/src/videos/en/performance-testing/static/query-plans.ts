import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "Reading query plans",
  scenes: [
    {
      label: "Introduction",
      cues: ["A query says what you want. The database decides how to get it. That decision is the query plan, and you can read it without running the query."],
      panes: [{ type: "title", kicker: "Lesson 2.3 · Static testing", heading: "Reading query plans", sub: "SCAN versus SEARCH", subAt: 0.4 }],
    },
    {
      label: "Ask for the plan",
      cues: [
        "Here's the plan for one customer's twenty latest orders.",
        "Two warnings. SCAN orders means reading all two hundred thousand rows. And a temporary B-tree means sorting the matches afterwards.",
      ],
      panes: [{
        type: "terminal", title: "npm run explain",
        lines: [
          { at: 0.1, text: "$ npm run explain -- \"SELECT … FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20\"", kind: "cmd" },
          { at: 0.5, text: "QUERY PLAN", kind: "out" },
          { at: 1, text: "└─ SCAN orders   ← full table scan (200,000 rows)", kind: "fail" },
          { at: 1.4, text: "└─ USE TEMP B-TREE FOR ORDER BY", kind: "fail-dim" },
        ],
      }],
    },
    {
      label: "SCAN versus SEARCH",
      cues: [
        "Without an index, SQLite has to read every row of the orders table to find one customer's handful.",
        "That's what SCAN means, and it gets slower every day the table grows.",
        "An index keeps the emails sorted, like the index at the back of a book. SQLite walks down a few levels to the right entry.",
        "SEARCH using an index: a handful of page reads instead of two hundred thousand rows.",
      ],
      panes: [{ type: "concept", scene: "query-plan" }],
    },
    {
      label: "Add the index",
      layout: "split",
      cols: "1fr 1.25fr",
      cues: [
        "Index the column you filter on first, then the column you sort by. Add it as a migration.",
        "Explain again. The scan has become a search, and the sort step is gone.",
        "On our machine, the orders endpoint went from eleven milliseconds to a tenth of a millisecond.",
      ],
      panes: [
        {
          type: "code", file: "db/migrations/001_indexes.sql", lang: "sql", typeTo: 0.8,
          code: `CREATE INDEX idx_orders_email
  ON orders(customer_email, created_at);

CREATE INDEX idx_reviews_book
  ON reviews(book_id);`,
        },
        {
          type: "terminal",
          lines: [
            { at: 0.6, text: "$ npm run migrate", kind: "cmd" },
            { at: 0.9, text: "applied 001_indexes.sql (162 ms)", kind: "pass" },
            { at: 1.1, text: "$ npm run explain -- \"…orders…\"", kind: "cmd" },
            { at: 1.4, text: "└─ SEARCH orders USING INDEX", kind: "pass" },
            { at: 1.5, text: "   idx_orders_email (customer_email=?)", kind: "pass-dim" },
            { at: 2.2, text: "orders: 11 ms → 0.1 ms", kind: "sum-pass" },
          ],
        },
      ],
    },
  ],
});
