# 강의 2.3: 쿼리 플랜 읽기

성능 테스트 · 2장: 정적 테스트 · 25분

> 쿼리를 실행하지 않고 데이터베이스에 실행 방법을 묻고, 전체 테이블 스캔을 알맞은 인덱스로 고칩니다.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

**이 강의를 마치면 할 수 있는 것:**
- Get a query plan from SQLite with EXPLAIN QUERY PLAN
- Tell a SCAN from a SEARCH, and know when a scan is a problem
- Design an index for a query's WHERE and ORDER BY, add it as a migration, and confirm the plan changed

## 대본: Reading query plans (1:17)

**0:00 Introduction.** A query says what you want. The database decides how to get it. That decision is the query plan, and you can read it without running the query.

**0:12 Ask for the plan.** Here's the plan for one customer's twenty latest orders. Two warnings. SCAN orders means reading all two hundred thousand rows. And a temporary B-tree means sorting the matches afterwards.

**0:25 SCAN versus SEARCH.** Without an index, SQLite has to read every row of the orders table to find one customer's handful. That's what SCAN means, and it gets slower every day the table grows. An index keeps the emails sorted, like the index at the back of a book. SQLite walks down a few levels to the right entry. SEARCH using an index: a handful of page reads instead of two hundred thousand rows.

**0:56 Add the index.** Index the column you filter on first, then the column you sort by. Add it as a migration. Explain again. The scan has become a search, and the sort step is gone. On our machine, the orders endpoint went from eleven milliseconds to a tenth of a millisecond.

## 강의 본문

A query says **what** you want. The database decides **how** to get it: which table to read first, whether to use an index, whether to sort. That decision is the **query plan**, and every serious database will show it to you without running the query. Reading plans is static testing for SQL.

## SCAN versus SEARCH

The orders endpoint asks for one customer's 20 latest orders:

```sql
SELECT id, book_id, total_cents, created_at FROM orders
WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20
```

Ask SQLite how it would run that:

```bash
npm run explain -- "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"
```

```text
QUERY PLAN
└─ SCAN orders   ← full table scan (200,000 rows)
└─ USE TEMP B-TREE FOR ORDER BY
```

Two warnings in two lines. `SCAN orders` means SQLite will read every one of the 200,000 rows to find one customer's 13. `USE TEMP B-TREE FOR ORDER BY` means it will then sort the matches in a temporary structure.

> **개념 애니메이션: SCAN versus SEARCH**
>
> 1. To find one customer's orders without an index, SQLite has to read every row of the orders table: 200,000 of them.
> 2. That's what SCAN orders means in a query plan. It gets slower as the table grows.
> 3. An index keeps the emails sorted, like the index at the back of a book. SQLite walks down a few levels to the right entry.
> 4. SEARCH orders USING INDEX: a handful of page reads instead of 200,000 rows, and it barely grows with the table.

`SCAN` isn't always bad. In the books query from lesson 2.2, `SCAN books` sits inside a `LIMIT 50` subquery, so it stops after 50 rows. And scanning a 30-row lookup table is faster than any index. The question to ask is: **how many rows will this read, and how often does it run?** A full scan of a large table on a request path is a bug that gets worse every day the table grows.

## Designing the index

An index is a sorted copy of some columns, with a pointer back to each row. Pick its columns in this order:

1. **Columns you filter on with `=`**: here, `customer_email`.
2. **Columns you sort by**: here, `created_at`. Because the index is already sorted by email and then date, SQLite can read the newest 20 straight off it and skip the sort.

```sql
CREATE INDEX idx_orders_email ON orders(customer_email, created_at);
```

The reviews lookup from lesson 2.2 has the same problem: `WHERE book_id = ?` with no index on `book_id` means scanning 50,000 reviews. After the join fix it happens once per page instead of 50 times, but it's still a scan.

```sql
CREATE INDEX idx_reviews_book ON reviews(book_id);
```

> **Indexes aren't free.** Every index makes inserts and updates a little slower and takes disk space. Add indexes for queries that run often or on large tables, check the plan uses them, and drop the ones nothing uses.

## Hands-on: Turn two full table scans into index searches

**실습 · 20분.** 목표: Find the full table scans behind /api/orders and the books page, add indexes in a migration, and confirm both plans and timings improve.

1. Run both `explain` commands from the agent prompt and keep the output. Both should end in `full table scan`.
2. With the app running, measure before you change anything:

   ```bash
   for i in 1 2 3 4 5; do curl -s -o /dev/null -D - "http://localhost:3000/api/orders?email=reader42@larkspur.test" | grep -i server-timing; done
   ```

3. Create the migration. Migrations are SQL files in `db/migrations/`, applied in name order and recorded so they only run once:

   ```sql title="db/migrations/001_indexes.sql"
   CREATE INDEX idx_orders_email ON orders(customer_email, created_at);
   CREATE INDEX idx_reviews_book ON reviews(book_id);
   ```

   ```bash
   npm run migrate
   # applied 001_indexes.sql (140 ms)
   ```

4. Explain both queries again.

   ```text
   QUERY PLAN
   └─ SEARCH orders USING INDEX idx_orders_email (customer_email=?)
   ```

   The sort step is gone too: the index already delivers rows in date order.

![Two query plans one above the other. The first, before the migration, reads 'SCAN orders ← full table scan (200,000 rows)' and 'USE TEMP B-TREE FOR ORDER BY'. The second, after, reads 'SEARCH orders USING INDEX idx_orders_email (customer_email=?)'.](screenshot-pending)
*Screenshot (npm run explain): Before and after the migration: a scan of 200,000 rows becomes an index search.*

5. Restart the app and measure again. On our machine:

   | Endpoint | Before | After |
   | --- | --- | --- |
   | `/api/orders` | 11 ms | 0.1 ms |
   | `/api/books` (with the join from 2.2) | 26 ms | 0.5 ms |

**완료 조건**
- Neither plan contains 'full table scan'
- Both plans show SEARCH ... USING INDEX
- `npm run migrate` reports the migration applied, and running it again reports nothing to migrate

**에이전트 몫: 구현을 맡기기**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.3, "Reading query plans".

Exercise: Turn two full table scans into index searches
Goal: Find the full table scans behind /api/orders and the books page, add indexes in a migration, and confirm both plans and timings improve.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run explain -- "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"` and capture the plan.
2. Run `npm run explain -- "SELECT avg(stars) FROM reviews WHERE book_id = ?"` and capture the plan.
3. Create `db/migrations/001_indexes.sql` with `CREATE INDEX idx_orders_email ON orders(customer_email, created_at);` and `CREATE INDEX idx_reviews_book ON reviews(book_id);`.
4. Run `npm run migrate`.
5. Run both explain commands again and capture the new plans.
6. With the app running, compare the `server-timing` header of /api/orders?email=reader42@larkspur.test and /api/books before and after (restart the app after migrating; take the median of five requests each).

Done when:
- Neither plan contains 'full table scan'
- Both plans show SEARCH ... USING INDEX
- `npm run migrate` reports the migration applied, and running it again reports nothing to migrate

Report back:
- Both plans before and after
- server-timing medians before and after for both endpoints

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/3-query-plans.mdx
```

## 핵심

- EXPLAIN QUERY PLAN shows how the database will run a query, without running it. That makes it a static check.
- SCAN reads every row of a table; SEARCH uses an index to jump to the matching rows. A SCAN of a large table on a hot path is a bug.
- Index the columns you filter on first, then the columns you sort by, so the database can skip the sort too.
- Indexes speed up reads and slow down writes. Add the ones your queries need, not one per column.

---

이전: [강의 2.2: N+1 쿼리 코드 리뷰](/demo/ko/performance-testing/static/n-plus-one.md)
다음: [강의 2.4: 에셋 무게](/demo/ko/performance-testing/static/asset-weight.md)
