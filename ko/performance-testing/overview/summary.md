# 1장 · 요약: 개요: 요약

성능 테스트 · 1장: 개요 · 5분

> 강좌의 나머지에서 쓸 용어와 계획.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

## 대본: Overview: summary (0:36)

**0:00 Recap.** Here's what chapter one covered, in four points.

**0:04 Key points.** Every performance test reports latency, throughput and an error rate. Latency is a distribution, so we report percentiles, never the average. Static testing reads what you built. Dynamic testing runs it and measures. And a good plan starts with concrete questions, each with a number to hit.

**0:26 Next.** Next comes static testing: the cheapest tests there are. You'll find three of Larkspur's problems without starting the app at all.

## 강의 본문

You now have the vocabulary for the rest of the course, a running practice app, a baseline and a plan.

## Key points

### 1.1 성능 테스트가 측정하는 것

- Latency is how long one request takes, throughput is how many complete per second, and the error rate is the share that fail.
- Latency is a distribution. Report percentiles: p50 for the typical request, p95 and p99 for the slow tail.
- An average blends fast and slow requests into a number no user experienced. Don't set budgets on averages.
- Write down how you measured (users, duration, endpoint), so the number can be repeated and compared.

### 1.2 정적 테스트와 동적 테스트

- Static testing inspects code, queries, assets and configuration without running the system. It is fast and runs on every change, but it can only find likely problems.
- Dynamic testing runs the system under realistic traffic and measures what users feel. It is slower and needs an environment, but it proves the impact.
- Use static checks to catch known patterns early, and dynamic tests to confirm impact and find what no rule describes.
- Plan with questions first ("can checkout take 50 users at p95 under 300 ms?"), then choose the cheapest test that answers each one.

## Check yourself

1. A dashboard shows an average response time of 140 ms. Why isn't that enough to say the endpoint is fast?
   The average hides the tail. p95 could be several hundred milliseconds, meaning one user in twenty waits much longer. Ask for p95 and p99.
2. Which family of test would you use to check, on every pull request, that no one adds a 600 KB script to the storefront?
   A static check: measure the assets against a budget at build time. It takes seconds and needs no running server.
3. Your static checks all pass. Can you say the app handles 50 users at p95 under 300 ms?
   No. Static checks find known patterns; only a dynamic test under that load can show the p95 users would see.
4. What must you record next to a measured p95 so someone else can repeat it?
   The endpoint, the number of virtual users and the duration, the machine, and the exact command.

## Next

Chapter 2 starts with the cheapest tests there are: the ones that never run your code. You'll turn the budgets in your plan into a check that fails the build, then find three of Larkspur's problems by reading code, query plans and build output.

---

이전: [강의 1.2: 정적 테스트와 동적 테스트](/demo/ko/performance-testing/overview/static-and-dynamic.md)
다음: [2장 · 시작: 정적 테스트](/demo/ko/performance-testing/static.md)
