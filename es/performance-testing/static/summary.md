# Capítulo 2 · Resumen: Pruebas estáticas: resumen

Pruebas de rendimiento · Capítulo 2: Pruebas estáticas · 5 min

> Lo que encontraste sin ejecutar la aplicación, y lo que las comprobaciones estáticas no pueden decirte.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

## Transcripción: Static testing: summary (0:41)

**0:00 Recap.** Without generating any traffic, you found and fixed three problems.

**0:05 Results.** A hundred and one queries per page became one. Two full table scans became index searches. And the storefront went from over a megabyte to fifty-nine kilobytes. Each check took seconds.

**0:19 The limits.** But every fix came from a known pattern. None of these checks told you how the app behaves with fifty shoppers, how long a phone shows a blank screen, or what the processor is doing. And one endpoint, recommendations, didn't trigger a single warning. It's slow anyway. That's chapter three.

## La lección

Without generating any traffic, you found and fixed three problems: 101 queries per page, two full table scans, and a page twenty times heavier than it needed to be. Each check takes seconds, and each would have caught its problem in the pull request that introduced it.

## Key points

### 2.1 Presupuestos de rendimiento

- A budget is a limit agreed before measuring. It turns "is this fast enough?" into pass or fail.
- Quantity budgets (KB, requests, queries) can be checked statically on every change. Timing budgets (p95, LCP) need a dynamic test.
- Base budgets on user needs and competitors, then on today's numbers so they're achievable. Tighten them as you improve.
- A budget check that fails the build gets fixed. A dashboard that turns red gets ignored.

### 2.2 Revisión de código: consultas N+1

- N+1 means one query for a list, then one more per item. The cost grows with the list and hides in fast local databases.
- Statically, it looks like a database call inside a loop or a .map callback. A simple lint rule catches most cases.
- Fix it by fetching everything in one query (JOIN, GROUP BY) or in one batched query (WHERE id IN (...)).
- Count queries per request. A count that grows with the page size is the signature of N+1.

### 2.3 Leer planes de consulta

- EXPLAIN QUERY PLAN shows how the database will run a query, without running it. That makes it a static check.
- SCAN reads every row of a table; SEARCH uses an index to jump to the matching rows. A SCAN of a large table on a hot path is a bug.
- Index the columns you filter on first, then the columns you sort by, so the database can skip the sort too.
- Indexes speed up reads and slow down writes. Add the ones your queries need, not one per column.

### 2.4 Peso de los recursos

- Weigh what the page actually loads. A few files are usually most of the weight.
- Ask of each heavy file: is all of it needed, and is it needed now? Libraries often bundle far more than you use.
- A plain <script> in <head> blocks rendering until it downloads and runs. Use defer, or move it.
- Serve images at the size they're displayed, compressed sensibly, and give them width and height.

## What static testing didn't tell you

Every fix in this chapter was guided by a pattern: a loop with a query, a scan in a plan, a heavy file. None of them told you how the app behaves when 50 people shop at once, how long the page takes to appear on a phone, or what happens to the CPU. And `/api/recommendations` didn't trigger a single static warning. It's slow anyway, as chapter 3 will show.

## Check yourself

1. A pull request adds a 40 KB charting library to every page. Which check from this chapter fails, and why is that the right place to catch it?
   The asset budget (script, 50 KB). It runs in seconds on the pull request, before the change ships, and names the file responsible.
2. The query linter reports no findings. Does that prove the code has no N+1 queries?
   No. It's a heuristic that reads loops in source text. A query behind a helper function, or an ORM loading relations lazily, can still cause N+1. Watch the query count per request too.
3. A plan shows SCAN countries (240 rows). Should you add an index?
   Probably not. Scanning 240 rows is cheap and the table won't grow much. Scans matter on large or growing tables on hot paths.
4. Why do these static checks still leave you unable to promise p95 under 300 ms at 50 users?
   They find known slow patterns but don't measure time under load. Only a dynamic test can show the latency users would see.

---

Anterior: [Lección 2.4: Peso de los recursos](/demo/es/performance-testing/static/asset-weight.md)
Siguiente: [Capítulo 3 · Apertura: Pruebas dinámicas](/demo/es/performance-testing/dynamic.md)
