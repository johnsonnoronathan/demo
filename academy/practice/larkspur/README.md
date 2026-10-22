# Larkspur Books (practice app)

The system under test for the Testbench **Performance Testing** course. It is a small
bookshop: a storefront page and three JSON endpoints over a SQLite database. It is
**slow on purpose**. Every problem in it is one the course teaches you to find.

Requires Node.js 22.13 or later. No dependencies.

```bash
npm run seed      # build larkspur.db (500 authors, 5,000 books, 50,000 reviews, 200,000 orders)
npm start         # http://localhost:3000
```

| Endpoint | What it does |
| --- | --- |
| `GET /` | Storefront page. `/before.html` is a frozen copy for before/after comparisons. |
| `GET /api/books?page=1` | 50 books with author and rating |
| `GET /api/orders?email=reader42@larkspur.test` | A customer's 20 latest orders |
| `GET /api/recommendations?book_id=7` | Five books that share the most tags |
| `GET /health` | `ok` |

API responses carry `X-Query-Count` (database queries for that request) and `Server-Timing`.

## Tools

| Command | Kind | What it does |
| --- | --- | --- |
| `npm run budget` | static | Weighs the page's assets against `budget.json` |
| `npm run lint:queries` | static | Flags database calls inside loops (possible N+1) |
| `npm run explain -- "<SQL>"` | static | Shows SQLite's query plan without running the query |
| `npm run check:plans` | static | Fails if a query in `hot-queries.sql` would scan a large table |
| `npm run check:static` | static | All three static gates: budget, query lint, query plans |
| `npm run migrate` | – | Applies new `db/migrations/*.sql` files |
| `npm run load -- --url <url> --vus 10 --duration 20` | dynamic | Tiny built-in load generator (use when k6 isn't installed) |
| `k6 run load/load.k6.js` | dynamic | Load test with thresholds. Also `smoke`, `stress`, `spike`, `soak`. |
| `npm run profile` | dynamic | Starts the app with the CPU profiler; Ctrl+C writes `profiles/*.cpuprofile` |

k6: <https://grafana.com/docs/k6/latest/set-up/install-k6/>. Lighthouse runs with `npx lighthouse`.

## Resetting

`npm run seed` rebuilds the database from scratch (and reapplies your migrations).
To undo code changes, use git: `git checkout -- academy/practice/larkspur`.
