# Lección 1.1: Qué mide una prueba de rendimiento

Pruebas de rendimiento · Capítulo 1: Visión general · 20 min

> Latencia, rendimiento y errores: los tres números que informa toda prueba de rendimiento, y por qué la latencia se expresa en percentiles.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

**Serás capaz de:**
- Name the three numbers a performance test reports and what each says about users
- Read p50, p95 and p99, and explain why an average hides problems
- Run the practice app and take a first, repeatable measurement

## Transcripción: What performance testing measures (1:31)

**0:00 Introduction.** Whatever tool you use, a performance test reports three numbers. Let's meet them.

**0:06 Three numbers.** Latency: how long one request takes, in milliseconds. Throughput: how many requests complete every second. And the error rate: the share of requests that fail or time out. They move together. As a system nears its limit, throughput stops rising, latency climbs, and soon after, errors appear.

**0:28 Percentiles.** Send the same request four hundred times and you get four hundred different durations. Stacked by duration, they form a hump, with a long tail of slow requests to the right. The median, or p50, is the typical request. Half are faster, half are slower. p95 and p99 describe the tail. One user in twenty waits at least as long as the p95. The average sits in between and describes no real request. That's why budgets and thresholds use percentiles.

**1:03 A first measurement.** In the exercise you'll start the practice app and ask it for one page of books. The response says it ran a hundred and one database queries. Then you'll put it under light load: ten virtual users for twenty seconds. On our machine that gave sixteen requests per second, with a p95 over a second. Write it down, with the command you ran. That's your baseline.

## La lección

A performance test answers questions like "how long do customers wait?" and "how much traffic can we take before that gets worse?". Whatever the tool, the answers come back as three numbers.

| Number | Question it answers | Unit |
| --- | --- | --- |
| **Latency** (response time) | How long does one request take? | milliseconds |
| **Throughput** | How many requests complete per second? | requests per second (req/s) |
| **Error rate** | What share of requests fail or time out? | percent |

They move together. When a system nears its limit, throughput stops rising, latency climbs, and soon after, errors appear. Chapter 3 shows that happening to Larkspur.

## Latency is a distribution

Send the same request a few hundred times and you get a few hundred different durations. Most are close together; a few are much slower, held up by a garbage-collection pause, a cold cache or a busy database. Play the animation to see the shape this makes.

> **Animación de concepto: Latency is a distribution**
>
> 1. Every request takes a different amount of time. Here are 400 requests to the same endpoint.
> 2. Stacked by duration, they form a hump with a long tail to the right.
> 3. The median, p50, is the typical request: 95 ms. Half are faster, half are slower.
> 4. p95 and p99 describe the tail: 371 ms and 556 ms. One user in twenty waits at least 371 ms.
> 5. The average, 133 ms, describes no real request and hides the tail. Budgets and thresholds use percentiles.

Because of that long tail, latency is reported as **percentiles**. The p95 is the duration that 95% of requests beat; 5% are slower. Think of it as the experience of one user in twenty, which on a busy site is a lot of people.

| Statistic | What it tells you | Use it for |
| --- | --- | --- |
| p50 (median) | The typical request | Spotting broad regressions |
| p95 | The slow tail most users will eventually hit | Budgets and test thresholds |
| p99 | The worst regular experience | Systems where the tail matters (checkout, login) |
| max | One outlier | Investigating, never for budgets |
| average | Nothing a real user experienced | Avoid |

The average pulls toward the slow tail but still sits far below it, so it hides the requests people complain about. Every budget and threshold in this course uses percentiles.

## Throughput and errors

Throughput is the rate of completed requests. On its own it says little: 16 req/s is plenty for a small shop and a disaster for a ticket sale. It becomes useful next to latency, as in "16 req/s at p95 under 300 ms".

The error rate keeps the other two honest. A server that fails fast can post great latency numbers. Always check errors before you celebrate a speed-up.

## Measurements you can repeat

A number without its conditions is not a measurement. Record at least:

- the endpoint or page,
- how many virtual users, for how long,
- the machine and whether anything else was running,
- the exact command.

Then you, a teammate or an agent can run it again after a change and compare like with like.

## Hands-on: Set up Larkspur and take a first measurement

**Práctica · 15 min.** Objetivo. Get the practice app running and record a baseline for /api/books: query count, p50, p95 and throughput at 10 users.

1. Build the database. It takes a few seconds and prints what it created.

   ```bash
   cd academy/practice/larkspur
   npm run seed
   ```

2. Start the app in its own terminal and leave it running.

   ```bash
   npm start
   # Larkspur Books on http://localhost:3000
   ```

![The Larkspur Books storefront: a header, a large photo of bookshelves with the heading 'Find your next favourite book', and a grid of new arrivals showing title, author, price and star rating.](screenshot-pending)
*Screenshot (localhost:3000): The storefront you'll test. It loads slowly; chapter 3 explains why.*

3. Ask for one page of books and look at the headers. Larkspur reports how many database queries the request ran and how long the server spent on it.

   ```bash
   curl -s -i http://localhost:3000/api/books | head -4
   ```

   ```text
   HTTP/1.1 200 OK
   content-type: application/json
   x-query-count: 101
   server-timing: app;dur=60.4
   ```

   101 queries for one page of 50 books is worth remembering. Lesson 2.2 explains it.

4. Put it under light load: 10 virtual users for 20 seconds, using the load tool that ships with the app.

   ```bash
   npm run load -- --url http://localhost:3000/api/books --vus 10 --duration 20
   ```

![Terminal output of the mini load tool: one row for 10 virtual users over 20 seconds showing about 16 requests per second, p50 around 570 ms, p95 around 1,300 ms, 0 errors and 101 queries per request.](screenshot-pending)
*Screenshot (npm run load): Your numbers will differ. On our machine: 16 req/s, p50 573 ms, p95 1,320 ms, 101 queries per request.*

5. Write the result to `notes/perf-baseline.md` with the command you ran. You'll compare against it after every fix.

**Está hecho cuando**
- notes/perf-baseline.md exists and every number in it appears in the command output you captured
- The baseline names the endpoint, the number of virtual users and the duration

**Parte del agente: delega la implementación**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 1.1, "What performance testing measures".

Exercise: Set up Larkspur and take a first measurement
Goal: Get the practice app running and record a baseline for /api/books: query count, p50, p95 and throughput at 10 users.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run seed` and confirm it reports 500 authors, 5,000 books, 50,000 reviews and 200,000 orders.
2. Start the app with `npm start` in the background and wait until http://localhost:3000/health returns `ok`.
3. Run `curl -s -i http://localhost:3000/api/books` and note the `x-query-count` and `server-timing` headers.
4. Run `npm run load -- --url http://localhost:3000/api/books --vus 10 --duration 20` and capture the result row.
5. Create `notes/perf-baseline.md` inside the practice app with the date, the command used, and the measured requests/s, p50, p95, p99 and queries per request.
6. Stop the app when you're done.

Done when:
- notes/perf-baseline.md exists and every number in it appears in the command output you captured
- The baseline names the endpoint, the number of virtual users and the duration

Report back:
- The baseline table you wrote
- One sentence on what the query count suggests about the endpoint

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/1-overview/1-what-it-measures.mdx
```

## Ideas clave

- Latency is how long one request takes, throughput is how many complete per second, and the error rate is the share that fail.
- Latency is a distribution. Report percentiles: p50 for the typical request, p95 and p99 for the slow tail.
- An average blends fast and slow requests into a number no user experienced. Don't set budgets on averages.
- Write down how you measured (users, duration, endpoint), so the number can be repeated and compared.

---

Anterior: [Capítulo 1 · Apertura: Visión general](/demo/es/performance-testing/overview.md)
Siguiente: [Lección 1.2: Pruebas estáticas y dinámicas](/demo/es/performance-testing/overview/static-and-dynamic.md)
