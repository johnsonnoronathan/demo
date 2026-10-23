# 교안: 성능 테스트

웹 애플리케이션의 성능을 양쪽에서 테스트하는 법을 배웁니다. 정적 테스트는 아무것도 실행하지 않고 코드, 쿼리, 에셋을 살펴보고, 동적 테스트는 시스템을 실행해 트래픽을 보내고 사용자가 느끼는 것을 측정합니다. 일부러 느리게 만든 작은 서점 앱 Larkspur Books로 둘 다 연습합니다.

- 총 시간: 6 시간 50 분
- 동영상: 22 (28:22)
- JavaScript와 SQL을 읽을 수 있고 터미널을 쓸 줄 아는 개발자와 테스터. 성능 테스트 경험은 필요 없습니다.
- 연습 앱: Larkspur Books, `academy/practice/larkspur`. Node.js 22로 만든 서점 앱. 스토어프런트와 SQLite 위의 JSON 엔드포인트 3개. 의존성 없음. 일부러 느립니다.

## 강좌 목표

- '빨라야 한다'를 측정 가능한 예산과 임계값으로 바꾸기
- 코드, 쿼리 플랜, 빌드를 읽어 N+1 쿼리, 누락된 인덱스, 무거운 에셋 찾기
- Lighthouse로 페이지 로드를 실험실에서 측정하고 Core Web Vitals 읽기
- k6로 부하, 스트레스, 스파이크, 소크 테스트를 작성하고 실행하기
- 플레임 그래프에서 CPU 병목을 찾고 수정을 증명하기
- 정적·동적 검사를 CI에 넣고, 실행 가능한 결과 보고하기
- 합의된 기준으로 인수 테스트를 실행하고 출시 여부 결정을 기록하기
- 내 프로젝트에 정적 검사를 적용하고, 수정 구현은 에이전트에게 맡기기

## 시작하기 전에

- Node.js 22.13 이상
- 터미널과 코드 편집기
- Lighthouse와 CPU 프로파일러용 Chrome
- 3장용 k6 (내장된 대체 부하 도구도 있습니다)

## 구성

1. **개요** (50 min): 성능 테스트가 측정하는 것, 두 가지 테스트 계열, 그리고 연습 앱.
2. **정적 테스트** (100 min): 만든 것을 실행하지 않고 읽어서 성능 문제를 찾습니다.
3. **동적 테스트** (125 min): 시스템을 실행하고 트래픽을 보내 사용자가 느끼는 것을 측정합니다.
4. **요약** (135 min): 둘을 하나의 작업 흐름으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌 전체를 돌아봅니다.

## 1장: 개요

성능 테스트가 측정하는 것, 두 가지 테스트 계열, 그리고 연습 앱. (50 분)

### 1장 · 시작: 개요 (5분, ▶ 1:53)

이 강좌가 다루는 것, 강좌의 구성, 강의실과 에이전트 프롬프트 사용법.

/demo/ko/performance-testing/overview.md

학습 성과:
- Know what questions performance testing answers, and which numbers it reports
- Tell static testing from dynamic testing, and know when each one pays off
- Have the practice app running, with a first measurement written down
- Know how to hand a hands-on exercise to a coding agent, and what to check when it reports back

### 강의 1.1: 성능 테스트가 측정하는 것 (20분, ▶ 1:31)

지연 시간, 처리량, 오류: 모든 성능 테스트가 보고하는 세 숫자와, 지연 시간을 백분위수로 말하는 이유.

/demo/ko/performance-testing/overview/what-it-measures.md

학습 성과:
- Name the three numbers a performance test reports and what each says about users
- Read p50, p95 and p99, and explain why an average hides problems
- Run the practice app and take a first, repeatable measurement

개념:
- Latency as a distribution: p50, p95, p99
- Throughput and error rate
- A measurement is only useful if you can repeat it

실습 · 15분: **Set up Larkspur and take a first measurement**. Get the practice app running and record a baseline for /api/books: query count, p50, p95 and throughput at 10 users.

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

핵심:
- Latency is how long one request takes, throughput is how many complete per second, and the error rate is the share that fail.
- Latency is a distribution. Report percentiles: p50 for the typical request, p95 and p99 for the slow tail.
- An average blends fast and slow requests into a number no user experienced. Don't set budgets on averages.
- Write down how you measured (users, duration, endpoint), so the number can be repeated and compared.

### 강의 1.2: 정적 테스트와 동적 테스트 (20분, ▶ 1:13)

두 가지 성능 테스트 계열, 각각이 찾을 수 있는 것과 없는 것, 테스트 전에 던질 질문을 계획하는 법.

/demo/ko/performance-testing/overview/static-and-dynamic.md

학습 성과:
- Explain the difference between static and dynamic performance testing
- Pick the cheaper test that can still answer a given question
- Write a short test plan: questions, budgets, risks and the tests that cover them

개념:
- Static testing: inspect without running
- Dynamic testing: run and measure
- A test plan starts with questions

실습 · 15분: **Draft a performance test plan for Larkspur**. Write a one-page plan that lists the questions you'll answer about Larkspur, a budget for each, and whether a static or a dynamic test covers it.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 1.2, "Static and dynamic testing".

Exercise: Draft a performance test plan for Larkspur
Goal: Write a one-page plan that lists the questions you'll answer about Larkspur, a budget for each, and whether a static or a dynamic test covers it.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `README.md`, `server.mjs`, the files in `src/routes/`, `public/index.html` and `budget.json` to learn what the app does.
2. Create `notes/perf-plan.md` with four sections: Questions, Budgets, Risks, Tests.
3. Under Questions, list at least four concrete questions, each naming an endpoint or page and a number of users.
4. Under Budgets, give each question a measurable limit (for example p95 in ms, KB of assets, queries per request).
5. Under Risks, list anything in the code that looks likely to be slow, with file and line, without running the app.
6. Under Tests, map every question and risk to a static check or a dynamic test from this repository (`npm run budget`, `npm run lint:queries`, `npm run explain`, `npm run load`, the k6 scripts in `load/`).

Done when:
- notes/perf-plan.md has the four sections
- Every budget is a number with a unit, and every question maps to at least one test
- Risks cite file paths and line numbers

Report back:
- The Questions and Budgets sections
- The three risks you think are most serious, and why

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/1-overview/2-static-and-dynamic.mdx
```

핵심:
- Static testing inspects code, queries, assets and configuration without running the system. It is fast and runs on every change, but it can only find likely problems.
- Dynamic testing runs the system under realistic traffic and measures what users feel. It is slower and needs an environment, but it proves the impact.
- Use static checks to catch known patterns early, and dynamic tests to confirm impact and find what no rule describes.
- Plan with questions first ("can checkout take 50 users at p95 under 300 ms?"), then choose the cheapest test that answers each one.

### 1장 · 요약: 개요: 요약 (5분, ▶ 0:36)

강좌의 나머지에서 쓸 용어와 계획.

/demo/ko/performance-testing/overview/summary.md

자가 점검:
1. A dashboard shows an average response time of 140 ms. Why isn't that enough to say the endpoint is fast?
   The average hides the tail. p95 could be several hundred milliseconds, meaning one user in twenty waits much longer. Ask for p95 and p99.
2. Which family of test would you use to check, on every pull request, that no one adds a 600 KB script to the storefront?
   A static check: measure the assets against a budget at build time. It takes seconds and needs no running server.
3. Your static checks all pass. Can you say the app handles 50 users at p95 under 300 ms?
   No. Static checks find known patterns; only a dynamic test under that load can show the p95 users would see.
4. What must you record next to a measured p95 so someone else can repeat it?
   The endpoint, the number of virtual users and the duration, the machine, and the exact command.

## 2장: 정적 테스트

만든 것을 실행하지 않고 읽어서 성능 문제를 찾습니다. (1 시간 40 분)

### 2장 · 시작: 정적 테스트 (5분, ▶ 0:49)

아무것도 실행하기 전에, 만든 것을 읽어서 성능 문제를 찾습니다.

/demo/ko/performance-testing/static.md

학습 성과:
- Turn your plan's budgets into a check that passes or fails the build
- Spot the N+1 query pattern in code, with a linter and by eye, and remove it
- Read a SQLite query plan, recognise a full table scan, and fix it with an index
- Find what makes a page heavy, and cut it below budget
- Know which of these checks belong on every pull request

### 강의 2.1: 성능 예산 (20분, ▶ 1:14)

측정하기 전에 한도를 정하고, 변경할 때마다 검사가 이를 지키게 합니다.

/demo/ko/performance-testing/static/budgets.md

학습 성과:
- Explain what a performance budget is and who should agree on it
- Choose budget metrics that can be checked statically and dynamically
- Run an asset budget check and read its result

개념:
- Budgets turn opinions into pass or fail
- Kinds of budget: quantity, timing, rule-based
- Where the numbers come from

실습 · 10분: **Run the asset budget and record what fails**. Run Larkspur's asset budget, identify which files push it over, and add API timing budgets to your plan for chapter 3.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.1, "Performance budgets".

Exercise: Run the asset budget and record what fails
Goal: Run Larkspur's asset budget, identify which files push it over, and add API timing budgets to your plan for chapter 3.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read `budget.json` and summarise its limits.
2. Run `npm run budget` and capture the full output and the exit code.
3. List each failing budget with how far over it is, and the file or files responsible.
4. Append a 'Budgets' section to `notes/perf-plan.md` (create the file if it doesn't exist) with the asset budgets from budget.json and these API budgets: /api/books p95 300 ms, /api/orders p95 200 ms, /api/recommendations p95 400 ms, all at 50 users, error rate under 1%.
5. Do not change any code or assets yet; lesson 2.4 fixes them.

Done when:
- You have the budget output and its exit code
- Each failing budget is attributed to a specific file
- notes/perf-plan.md lists both asset and API budgets

Report back:
- The budget table from the command output
- The files responsible for each failure, largest first

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/1-budgets.mdx
```

핵심:
- A budget is a limit agreed before measuring. It turns "is this fast enough?" into pass or fail.
- Quantity budgets (KB, requests, queries) can be checked statically on every change. Timing budgets (p95, LCP) need a dynamic test.
- Base budgets on user needs and competitors, then on today's numbers so they're achievable. Tighten them as you improve.
- A budget check that fails the build gets fixed. A dashboard that turns red gets ignored.

### 강의 2.2: N+1 쿼리 코드 리뷰 (25분, ▶ 1:14)

데이터베이스를 쓰는 코드에서 가장 흔한 성능 버그, 읽어서 찾는 법과 없애는 법.

/demo/ko/performance-testing/static/n-plus-one.md

학습 성과:
- Recognise the N+1 query pattern in code
- Use a static check to flag database calls inside loops
- Rewrite an N+1 loop as a single query with joins, and verify the query count

개념:
- The N+1 query pattern
- Finding it statically: loops that contain queries
- Fixing it: joins, batching, and the query count header

실습 · 20분: **Find and remove the N+1 in /api/books**. Use the query linter to find the N+1 in the books endpoint, rewrite it as one query, and show the query count drop from 101 to 1 with the same response.

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

핵심:
- N+1 means one query for a list, then one more per item. The cost grows with the list and hides in fast local databases.
- Statically, it looks like a database call inside a loop or a .map callback. A simple lint rule catches most cases.
- Fix it by fetching everything in one query (JOIN, GROUP BY) or in one batched query (WHERE id IN (...)).
- Count queries per request. A count that grows with the page size is the signature of N+1.

### 강의 2.3: 쿼리 플랜 읽기 (25분, ▶ 1:17)

쿼리를 실행하지 않고 데이터베이스에 실행 방법을 묻고, 전체 테이블 스캔을 알맞은 인덱스로 고칩니다.

/demo/ko/performance-testing/static/query-plans.md

학습 성과:
- Get a query plan from SQLite with EXPLAIN QUERY PLAN
- Tell a SCAN from a SEARCH, and know when a scan is a problem
- Design an index for a query's WHERE and ORDER BY, add it as a migration, and confirm the plan changed

개념:
- SCAN versus SEARCH
- Choosing index columns: filter first, then sort
- Indexes cost writes and space

실습 · 20분: **Turn two full table scans into index searches**. Find the full table scans behind /api/orders and the books page, add indexes in a migration, and confirm both plans and timings improve.

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

핵심:
- EXPLAIN QUERY PLAN shows how the database will run a query, without running it. That makes it a static check.
- SCAN reads every row of a table; SEARCH uses an index to jump to the matching rows. A SCAN of a large table on a hot path is a bug.
- Index the columns you filter on first, then the columns you sort by, so the database can skip the sort too.
- Indexes speed up reads and slow down writes. Add the ones your queries need, not one per column.

### 강의 2.4: 에셋 무게 (20분, ▶ 1:15)

파일 무게를 재서 페이지를 무겁게 하는 것을 찾고, 보이는 것은 바꾸지 않은 채 예산 안으로 줄입니다.

/demo/ko/performance-testing/static/asset-weight.md

학습 성과:
- Find the heaviest files a page loads and judge whether they're needed
- Recognise render-blocking scripts in a page's HTML
- Cut page weight below budget and prove it with the budget check

개념:
- Where the page weight goes
- Render-blocking scripts
- Right-sizing images

실습 · 15분: **Bring the storefront under budget**. Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.4, "Asset weight".

Exercise: Bring the storefront under budget
Goal: Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run budget` and note the failing budgets.
2. In `public/index.html` only (leave `public/before.html` untouched), replace `/vendor/datefmt-all-locales.js` with `/vendor/datefmt-en.js`; the page only formats dates in en-US.
3. Add `defer` to both script tags so they no longer block rendering. `app.js` already waits for DOMContentLoaded, and deferred scripts run in order.
4. Replace `/hero.jpg` with `/hero-1200.jpg` and add `width="1200" height="600"` and `fetchpriority="high"` to the img tag.
5. Run `npm run budget` again.
6. Start the app and load http://localhost:3000/ in a browser or with Playwright if available, and confirm the 'Updated <date>' line and the book grid still render. If no browser is available, say so.

Done when:
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

Report back:
- The budget output before and after
- The diff of public/index.html
- How you confirmed the page still renders correctly

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/4-asset-weight.mdx
```

핵심:
- Weigh what the page actually loads. A few files are usually most of the weight.
- Ask of each heavy file: is all of it needed, and is it needed now? Libraries often bundle far more than you use.
- A plain <script> in <head> blocks rendering until it downloads and runs. Use defer, or move it.
- Serve images at the size they're displayed, compressed sensibly, and give them width and height.

### 2장 · 요약: 정적 테스트: 요약 (5분, ▶ 0:41)

앱을 실행하지 않고 찾은 것, 그리고 정적 검사로는 알 수 없는 것.

/demo/ko/performance-testing/static/summary.md

자가 점검:
1. A pull request adds a 40 KB charting library to every page. Which check from this chapter fails, and why is that the right place to catch it?
   The asset budget (script, 50 KB). It runs in seconds on the pull request, before the change ships, and names the file responsible.
2. The query linter reports no findings. Does that prove the code has no N+1 queries?
   No. It's a heuristic that reads loops in source text. A query behind a helper function, or an ORM loading relations lazily, can still cause N+1. Watch the query count per request too.
3. A plan shows SCAN countries (240 rows). Should you add an index?
   Probably not. Scanning 240 rows is cheap and the table won't grow much. Scans matter on large or growing tables on hot paths.
4. Why do these static checks still leave you unable to promise p95 under 300 ms at 50 users?
   They find known slow patterns but don't measure time under load. Only a dynamic test can show the latency users would see.

## 3장: 동적 테스트

시스템을 실행하고 트래픽을 보내 사용자가 느끼는 것을 측정합니다. (2 시간 5 분)

### 3장 · 시작: 동적 테스트 (5분, ▶ 1:01)

시스템을 실행하고 트래픽을 보내, 사용자가 실제로 느끼는 것을 측정합니다.

/demo/ko/performance-testing/dynamic.md

학습 성과:
- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

### 강의 3.1: Lighthouse로 실험실 측정 (25분, ▶ 1:17)

시뮬레이션한 휴대폰으로 페이지를 열고, 사용자가 무엇을 언제 보는지 측정합니다.

/demo/ko/performance-testing/dynamic/lighthouse.md

학습 성과:
- Run Lighthouse from the command line against a local page
- Explain FCP, LCP, Total Blocking Time and Cumulative Layout Shift in user terms
- Confirm a static fix with a dynamic before-and-after measurement

개념:
- Watching a page load: FCP and LCP
- Core Web Vitals and the performance score
- Lab data versus field data

실습 · 15분: **Measure the asset fixes in the lab**. Run Lighthouse against the frozen before page and the fixed storefront, and compare score, FCP, LCP and transfer size.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.1, "Lab measurement with Lighthouse".

Exercise: Measure the asset fixes in the lab
Goal: Run Lighthouse against the frozen before page and the fixed storefront, and compare score, FCP, LCP and transfer size.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Make sure the app is running on port 3000.
2. Run `npx lighthouse@12 http://localhost:3000/before.html --only-categories=performance --output=json --output-path=./notes/lh-before.json --chrome-flags="--headless=new"`. If Chrome isn't found, set CHROME_PATH to a Chrome or Chromium binary and retry; if none exists, stop and report that.
3. Run the same command for http://localhost:3000/ with output `./notes/lh-after.json`.
4. From each JSON file, extract categories.performance.score and the numericValue of first-contentful-paint, largest-contentful-paint, total-blocking-time, cumulative-layout-shift and total-byte-weight.
5. Write a before/after table to `notes/lighthouse.md`.

Done when:
- Both JSON reports exist in notes/
- notes/lighthouse.md has a table with score, FCP, LCP, TBT, CLS and total bytes for both pages

Report back:
- The before/after table
- Which static finding from chapter 2 explains each improvement

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/1-lab-measurement.mdx
```

핵심:
- Lighthouse loads a page on a simulated mid-range phone and slow network, so results are repeatable but pessimistic.
- FCP is when anything appears; LCP is when the main content appears. LCP under 2.5 s counts as good.
- Render-blocking scripts delay FCP; heavy images delay LCP. The static checks predicted both.
- Lab data is for comparing builds. Field data from real users tells you what people actually experience.

### 강의 3.2: k6로 부하 테스트 (30분, ▶ 1:26)

쇼핑객으로 붐비는 저녁을 시뮬레이션하고, 임계값으로 앱이 예산을 지키는지 판정합니다.

/demo/ko/performance-testing/dynamic/load-testing.md

학습 성과:
- Explain virtual users, iterations, think time and stages
- Write a k6 script with checks, tags and thresholds
- Read a k6 summary and explain a failed threshold

개념:
- How a k6 load test works
- Checks versus thresholds
- One slow endpoint slows the others

실습 · 20분: **Run a smoke test, then the load test**. Run load/smoke.k6.js and load/load.k6.js against Larkspur and record which thresholds pass.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.2, "Load testing with k6".

Exercise: Run a smoke test, then the load test
Goal: Run load/smoke.k6.js and load/load.k6.js against Larkspur and record which thresholds pass.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Check that k6 is installed with `k6 version`. If it isn't, stop and report that; suggest `npm run load` as a fallback.
2. With the app running, run `k6 run load/smoke.k6.js` and confirm all checks pass.
3. Read load/load.k6.js and summarise its stages, think time and thresholds.
4. Run `k6 run load/load.k6.js` (about 2 minutes). For a quicker run, use `k6 run --stage 15s:50 --stage 30s:50 --stage 5s:0 load/load.k6.js` and say that you did.
5. Record each threshold's result and the p95 per endpoint in `notes/load-test.md`, with the command and date.

Done when:
- The smoke test passed before the load test ran
- notes/load-test.md lists every threshold with pass or fail and the measured value

Report back:
- The THRESHOLDS block of the k6 summary
- Whether the app meets the API budgets from your plan, and which chapter 2 fixes made the difference if it does

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/2-load-testing.mdx
```

핵심:
- A virtual user runs your script in a loop. Stages set how many run at once over time.
- Think time (sleep) makes each user behave like a person, so 50 virtual users is close to 50 real shoppers.
- Checks verify each response; thresholds turn the run's percentiles and error rate into pass or fail.
- Tag requests per endpoint so each has its own threshold. A single-threaded server lets one slow endpoint delay all the others.
- Always run a short smoke test first, to prove the script and the app work before you add load.

### 강의 3.3: 스트레스, 스파이크, 소크 테스트 (30분, ▶ 1:31)

예상 부하를 넘어 한계를 찾고, 급증을 견디고, 몇 시간에 걸친 느린 변화를 잡아냅니다.

/demo/ko/performance-testing/dynamic/stress-spike-soak.md

학습 성과:
- Choose the right load shape for a question: load, stress, spike or soak
- Find an endpoint's capacity from a stepped stress test
- Judge whether an app recovers after a spike

개념:
- Four shapes of load
- Throughput ceiling and the latency knee
- Recovery and drift

실습 · 25분: **Find the capacity of /api/recommendations**. Use a stepped stress test and a spike test to find where /api/recommendations stops meeting its 400 ms budget, and whether it recovers from a surge.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.3, "Stress, spike and soak tests".

Exercise: Find the capacity of /api/recommendations
Goal: Use a stepped stress test and a spike test to find where /api/recommendations stops meeting its 400 ms budget, and whether it recovers from a surge.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. With the app running, run `npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --stages 5:1,5:2,5:4,5:8,5:16,5:32` and capture the table.
2. Identify the throughput ceiling (where req/s stops growing) and the first stage whose p95 exceeds 400 ms.
3. If k6 is installed, run `TARGET="/api/recommendations?book_id=7" STEP=10s k6 run load/stress.k6.js` and capture the thresholds and http_req_failed.
4. If k6 is installed, run `TARGET="/api/recommendations?book_id=7" k6 run load/spike.k6.js` and capture the per-phase durations (phase:before, phase:spike, phase:after).
5. Write `notes/capacity.md` with the ceiling, the capacity in users and req/s at the 400 ms budget, and whether p95 in the after phase returned to the before level.

Done when:
- notes/capacity.md states the ceiling in req/s and the capacity in users, both taken from captured output
- The spike result says whether the endpoint recovered, with before and after p95

Report back:
- The stepped load table
- Ceiling, capacity and recovery, each with the number it's based on

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/3-stress-spike-soak.mdx
```

핵심:
- Load tests check expected traffic; stress tests find the breaking point; spike tests check survival and recovery; soak tests find slow drift.
- When throughput stops growing as users increase, you've hit the ceiling. After that, extra users only add waiting time.
- Capacity is the load at which p95 crosses the budget, not the load at which the app crashes.
- In a spike, judge recovery as well as survival: latency and errors should return to normal once the surge ends.
- Soak tests need hours and a watch on memory, connections and latency trend, not just the final percentiles.

### 강의 3.4: 병목 찾기 (30분, ▶ 1:12)

부하 중인 앱을 프로파일링하고, 플레임 그래프를 읽고, 핫 패스를 고친 뒤 같은 테스트로 증명합니다.

/demo/ko/performance-testing/dynamic/bottlenecks.md

학습 성과:
- Decide which resource is the bottleneck: CPU, database, network or waiting
- Record a CPU profile of a Node.js app under load and open it as a flame graph
- Fix a CPU hot path and prove the improvement with the same load test

개념:
- Reading a flame graph
- Which resource is saturated?
- Prove it with the same test

실습 · 25분: **Profile /api/recommendations and fix its hot path**. Record a CPU profile while loading /api/recommendations, identify the hot functions, remove the repeated work, and show the throughput ceiling rise with the same test.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.4, "Finding the bottleneck".

Exercise: Profile /api/recommendations and fix its hot path
Goal: Record a CPU profile while loading /api/recommendations, identify the hot functions, remove the repeated work, and show the throughput ceiling rise with the same test.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Stop any running instance of the app. Start it with the profiler: `npm run profile` (in the background).
2. Run `npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --vus 10 --duration 10` and capture the result.
3. Stop the app with SIGINT (Ctrl+C) so it writes `profiles/*.cpuprofile`.
4. Summarise the profile with a short Node script: for each function name, total the sample time where it appears on the stack (inclusive), and print the top 10 as percentages.
5. In `src/routes/recommendations.mjs`, load all books once and cache them with their tags already normalised into a Set; normalise the target's tags once per request; compute similarity against the cached Set. Keep the response identical.
6. Start the app normally, compare the response for book_id=7 and book_id=1234 with the pre-fix responses, and rerun the same load command.

Done when:
- The profile summary names the functions that dominated, with percentages
- Responses for book_id=7 and book_id=1234 are identical before and after the fix
- The same load command shows higher req/s and lower p95 than before the fix

Report back:
- Top functions from the profile, before the fix
- The diff of recommendations.mjs
- Load results before and after

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/4-bottlenecks.mdx
```

핵심:
- A load test tells you that something is slow; a profile taken under the same load tells you where the time goes.
- First find the saturated resource: CPU at 100% points to code; low CPU with high latency points to waiting on something else.
- In a flame graph, width is time. Look for wide frames near the top that belong to your code.
- Work that repeats the same computation on every request is a classic hot path. Do it once and cache the result.
- Prove a fix by rerunning the exact test that found the problem, on the same machine.

### 3장 · 요약: 동적 테스트: 요약 (5분, ▶ 0:47)

앱을 실행해 보고서야 알게 된 것들.

/demo/ko/performance-testing/dynamic/summary.md

자가 점검:
1. Lighthouse reports LCP 1.5 s for your page. A customer says it took five seconds. Who's wrong?
   Probably neither. Lighthouse is lab data from one simulated device; the customer's phone, network and cache differ. Use field data to see the real distribution.
2. During a stress test, req/s stays at 58 from 4 users to 32 users while p95 rises from 105 ms to 957 ms. What does that tell you?
   58 req/s is the throughput ceiling. Beyond it, extra users only queue, so latency grows with the number of users waiting.
3. A spike test passes: no errors above 5%. What else should you look at before calling the app resilient?
   Recovery: latency and error rate in the phase after the spike should return to their levels before it.
4. Why rerun the same load test after a fix, rather than a new one?
   So the only thing that changed is the code. A different test, data set or machine would make the comparison meaningless.

## 4장: 요약

둘을 하나의 작업 흐름으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌 전체를 돌아봅니다. (2 시간 15 분)

### 4장 · 시작: 요약 (5분, ▶ 1:11)

정적 테스트와 동적 테스트를 하나의 일상으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌를 돌아봅니다.

/demo/ko/performance-testing/review.md

학습 성과:
- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

### 강의 4.1: 성능 테스트 작업 흐름 (25분, ▶ 1:10)

어디서 무엇을 실행할지 정하기: 풀 리퀘스트마다 정적 게이트, 릴리스 전 동적 테스트, 운영 환경 모니터링.

/demo/ko/performance-testing/review/workflow.md

학습 성과:
- Place each kind of performance check at the right stage of delivery
- Run all static gates with one command, and see one catch a regression
- Adapt a CI workflow that runs static gates, Lighthouse and a short k6 test

개념:
- Performance checks in the delivery pipeline
- Fast feedback first
- Keeping dynamic tests trustworthy in CI

실습 · 20분: **Run the gates, then watch one catch a regression**. Run all static gates with one command, deliberately reintroduce a regression to see a gate fail, then adapt the reference CI workflow.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.1, "A performance testing workflow".

Exercise: Run the gates, then watch one catch a regression
Goal: Run all static gates with one command, deliberately reintroduce a regression to see a gate fail, then adapt the reference CI workflow.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run check:static` and capture the output and exit code. If any gate fails, list which and why, and stop here.
2. Reintroduce a regression on a scratch basis: in `public/index.html`, change `/vendor/datefmt-en.js` back to `/vendor/datefmt-all-locales.js`.
3. Run `npm run check:static` again and capture which gate fails and its message.
4. Revert the change with `git checkout -- public/index.html` (or by hand if the file isn't committed) and confirm `npm run check:static` passes again.
5. Read `ci/perf.yml`. Write `notes/ci.md` describing what each job does, what makes it fail, and what you'd change for a team's own repository (paths, branches, thresholds). Do not create files under .github/ unless asked.

Done when:
- check:static passes before and after the experiment, and failed during it
- notes/ci.md explains each job and its failure conditions

Report back:
- The failing gate's output during the regression
- Your notes on adapting ci/perf.yml

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/1-workflow.mdx
```

핵심:
- Run cheap static gates on every pull request, dynamic tests before release, and monitoring in production.
- A gate is only useful if it fails the build. Make every check exit non-zero on a breach.
- Keep CI load tests short and their thresholds generous enough for shared runners; run long stress and soak tests on a schedule.
- Feed production numbers back into budgets. The loop is what keeps performance from drifting.

### 강의 4.2: 결과 보고하기 (20분, ▶ 1:11)

사람들이 결정할 수 있고 다른 사람이 테스트를 반복할 수 있도록 성능 결과를 정리합니다.

/demo/ko/performance-testing/review/reporting.md

학습 성과:
- Structure a performance report around the question it answers
- Present results with their conditions, so they can be repeated
- Write findings that name a cause, an impact and a next step

개념:
- What the course changed
- The shape of a useful report
- Numbers people can trust

실습 · 20분: **Write Larkspur's performance report**. Turn your notes from the course into a one-page performance report with an answer, a results table, findings and limits.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.2, "Reporting results".

Exercise: Write Larkspur's performance report
Goal: Turn your notes from the course into a one-page performance report with an answer, a results table, findings and limits.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Read everything in `notes/` (baseline, plan, lighthouse, load test, capacity). If a file is missing, list it as missing; do not invent its numbers.
2. Create `notes/report.md` with these sections: Summary (2 to 3 sentences answering whether Larkspur meets its budgets), Test setup (machine, tools and versions, commands), Results (a before/after table with p95 per endpoint, throughput, error rate, LCP and page weight), Findings (one per problem found: cause, user impact, fix, evidence), Limits (what wasn't tested), Next steps.
3. Every number in the report must come from a file in notes/ or from a command you run now; cite which.

Done when:
- notes/report.md has all six sections
- Every number is traceable to a notes file or a quoted command output
- Missing measurements are listed under Limits instead of being estimated

Report back:
- The Summary and Results sections
- Any numbers you couldn't source

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/2-reporting.mdx
```

핵심:
- Lead with the answer to the question the test was for, then the evidence.
- Every number needs its conditions: what was tested, with what load, on what machine, with which command.
- Report percentiles and error rates, before and after, from the same test on the same machine.
- A finding states the cause, the impact in user terms, and the recommended next step.
- Say what you didn't test. Limits are part of the result.

### 강의 4.3: 성능 인수 테스트 (30분, ▶ 2:42)

예산을 인수 기준으로 바꾸고, 명령 하나로 인수 테스트를 실행하고, 서명이 담긴 출시 여부 결정을 내립니다.

/demo/ko/performance-testing/review/acceptance.md

학습 성과:
- Follow the performance testing method from question to sign-off
- Write acceptance criteria that are measurable, agreed in advance and traceable to a budget
- Check entry criteria, run an acceptance test and read its verdict
- Make a go/no-go decision, handle a waiver, and record the sign-off

개념:
- The method, end to end
- Entry, acceptance and exit criteria
- Go, no-go and waivers

실습 · 30분: **Run Larkspur's acceptance test, fix what fails, and sign it off**. Run the acceptance test yourself, have an agent fix any failing criterion, verify the fix with the same test, and write the acceptance record with a go/no-go decision.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.3, "Performance acceptance".

Exercise: Run Larkspur's acceptance test, fix what fails, and sign it off
Goal: Run the acceptance test yourself, have an agent fix any failing criterion, verify the fix with the same test, and write the acceptance record with a go/no-go decision.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run accept -- --out notes/acceptance-run.md` and capture the full output and the exit code. Exit code 2 means an entry criterion wasn't met: report which one and stop.
2. If the verdict is ACCEPT, report that and stop: there is nothing to fix.
3. For each FAIL row, find the cause with the course's own tools: `npm run budget`, `npm run lint:queries`, `npm run explain`, `npm run check:plans`, `npm run load`, and `npm run profile` for CPU. Name the file and line responsible.
4. Fix one criterion at a time with the smallest change that addresses the cause. After each fix, run that criterion's own check and quote its output.
5. Do not edit `acceptance.json`, `budget.json`, `hot-queries.sql` or any threshold. If you believe a limit is wrong, say so in your report instead.
6. When every fix is in, run `npm run accept -- --out notes/acceptance-run.md` again and capture the output and exit code.
7. Do not record the Lighthouse criteria M1 and M2 and do not write the sign-off; the learner does both.

Done when:
- `npm run accept` exits 0, or every remaining failure is explained with its cause
- Each change is tied to the criterion it fixes
- acceptance.json, budget.json and all thresholds are unchanged

Report back:
- A table of each criterion: limit, measured before, measured after
- The files you changed for each criterion, with a one-line reason
- The full output of the final acceptance run and its exit code

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/4-summary/3-acceptance.mdx
```

핵심:
- The method: ask the question, set budgets, take a baseline, test static then dynamic, fix one thing at a time, verify with the same test, then accept and report.
- An acceptance criterion names a metric, a limit and the conditions it's measured under. It is agreed before the test and traces back to a budget.
- Entry criteria decide whether a run counts at all: the right build, seeded data, a quiet machine. A run that misses them is invalid, not failed.
- Any failed criterion means no-go, unless a named person accepts the risk in writing, with an expiry date and a follow-up.
- Never loosen a limit to make a run pass. Changing a criterion is a separate decision, made before the next run.
- The agent implements fixes; you run the acceptance test, read the numbers and sign. The record holds the command, the machine, the commit and every result.

### 강의 4.4: 내 프로젝트에서 정적 테스트 (45분, ▶ 2:17)

강좌의 정적 검사를 실제 코드베이스에서 직접 실행하고, 숫자를 읽고, 첫 예산을 정한 뒤 수정은 에이전트에게 맡깁니다.

/demo/ko/performance-testing/review/your-project.md

학습 성과:
- Find the equivalent of each of the course's static checks for your own stack
- Run them yourself on one user journey and record a baseline
- Turn the baseline into first budgets and one gate
- Hand a finding to an agent, then verify its fix with the same command

개념:
- Four questions, any stack
- Reading real numbers
- From baseline to budget

실습 · 15분: **Find the static checks for your stack**. Have an agent map the course's four static checks onto your repository's stack, as commands you will run yourself.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Find the static checks for your stack
Goal: Have an agent map the course's four static checks onto your repository's stack, as commands you will run yourself.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Identify the stack from the repository: languages, framework, build tool and its output folder, ORM or database library, and database engine. Quote the files you read.
2. For each of these four questions, give one concrete command or procedure for this repository, preferring tools the project already has: (1) the weight of the production build's scripts, stylesheets and images, gzipped where the server compresses; (2) the number of database queries per request on one endpoint; (3) the query plan of the endpoint's main queries, and how to tell a full scan from an index search on this database; (4) which scripts or stylesheets block the first render.
3. Write `perf/STATIC-CHECKS.md` with one section per question: the command, what it measures, how to read its output, and any setting that must be switched on first (for example query logging in development).
4. If a check needs a new dev dependency, name it and why, and don't install it.
5. Do not run load tests, and do not change application code or configuration. The learner runs the checks.

Done when:
- perf/STATIC-CHECKS.md has a command and reading guide for all four questions
- Every command fits this repository's stack, paths and tools
- No application code or configuration changed

Report back:
- A summary of the stack, with the files that show it
- The four commands, in a table
- Any new dev dependencies the learner would need to approve

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

실습 · 30분: **Fix one finding and add a gate**. Have an agent fix one finding from your baseline and add a gate that would catch it again; then verify it with your own run.

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Fix one finding and add a gate
Goal: Have an agent fix one finding from your baseline and add a gate that would catch it again; then verify it with your own run.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Read `perf/baseline.md` and `perf/STATIC-CHECKS.md`. Work on the finding the learner names; if none is named, take the one furthest over its budget, and say which you chose.
2. Create a new branch. Before changing anything, run the finding's check from STATIC-CHECKS.md and quote the output.
3. Find the cause and name the file and line. Make the smallest change that removes it. Keep behaviour the same; run the project's existing tests and quote the result.
4. Run the same check again and quote the output, so before and after come from the same command.
5. Add a gate that fails if this regresses, using the project's existing test or CI setup: for example a test that asserts the number of queries for the endpoint, or a bundle-size limit in CI. Make sure it exits non-zero on a breach.
6. Do not change any budget in perf/baseline.md. Do not push, merge or deploy.

Done when:
- The finding's check shows the improvement, before and after quoted from the same command
- The project's existing tests pass
- A gate exists that fails when the problem comes back

Report back:
- The cause, with file and line
- Before and after output of the check
- The gate you added and how to run it
- The branch name and the list of changed files

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

핵심:
- The four static questions carry over to any stack: how heavy is what we ship, how many queries per request, does each hot query use an index, and what blocks rendering.
- Run the checks yourself the first time. Reading real output is how you learn what's normal for your codebase, and you're the one who decides what's acceptable.
- Measure one user journey first, not the whole app. A baseline you can repeat beats a survey you can't.
- Queries per request that grow with page size, and full scans of large tables on a request path, are findings on any stack.
- Set first budgets just above today's numbers so the gate passes now and catches the next regression; tighten them as fixes land.
- The agent proposes commands and writes fixes and gates; you run the checks, read the numbers and approve.

### 4장 · 요약: 강좌 요약 (10분, ▶ 0:54)

강좌에서 다룬 모든 것을 한곳에, 그리고 다음에 갈 곳.

/demo/ko/performance-testing/review/summary.md

자가 점검:
1. A teammate wants to add a nightly 4-hour soak test as a required check on every pull request. What would you suggest instead?
   Keep pull requests to fast static gates (and at most a short load test). Run the soak test on a schedule against a stable environment, and alert on its results.
2. Your load test passes in CI on Monday and fails on Tuesday with no code change. What do you do first?
   Rerun and compare. Shared runners are noisy; check whether the failure reproduces, whether other jobs ran on the same machine, and whether the margin to the threshold is too thin.
3. Name one problem in Larkspur that only static testing found first, and one that only dynamic testing found.
   Static: the N+1 loop, the full table scans or the heavy assets. Dynamic: the CPU hot path in recommendations, which matched no static rule.
4. What makes a performance finding actionable?
   It names the cause and where it is, the impact in user terms with a measured number, the fix, and the evidence someone can check.
5. The acceptance run fails D3 by 20 ms the day before a release. The product owner asks you to raise the limit to 450 ms so it passes. What do you do?
   Don't change the limit to pass the run. Report the failure. If the release can't wait, the product owner can sign a waiver with an expiry date and a follow-up; changing the criterion itself is a separate decision for the next run.
6. An agent reports that it fixed an N+1 in your project and the endpoint now runs 3 queries. How do you accept that?
   Rerun the same check yourself, on the same journey, and compare your number with the one it quoted. Then break the fix locally to see the new gate fail, and review the branch before merging.
