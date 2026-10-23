-- Queries on request paths. `npm run check:plans` fails if any of them would
-- scan a large table. Add a query here whenever you add one to a route.
SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20;
SELECT name FROM authors WHERE id = ?;
SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?;
SELECT id, tags FROM books WHERE id = ?;
