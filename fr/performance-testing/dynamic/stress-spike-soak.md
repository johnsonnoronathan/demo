# Leçon 3.3: Tests de stress, de pic et d'endurance

Tests de performance · Chapitre 3: Tests dynamiques · 30 min

> Dépasser la charge attendue pour trouver le plafond, survivre à un afflux et repérer les dérives lentes sur plusieurs heures.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

**Vous saurez:**
- Choose the right load shape for a question: load, stress, spike or soak
- Find an endpoint's capacity from a stepped stress test
- Judge whether an app recovers after a spike

## Transcription: Stress, spike and soak tests (1:31)

**0:00 Introduction.** A load test asks: are we fine at the traffic we expect? The tests in this lesson ask harder questions.

**0:09 Four shapes of load.** A load test runs the traffic you expect on a busy day, and asks whether you meet the budget. A stress test keeps adding users in steps, to find where the app breaks, and how. A spike test sends a sudden surge, like a newsletter going out, and asks whether you survive and recover. And a soak test runs ordinary traffic for hours, looking for anything that leaks or drifts.

**0:39 Finding capacity.** Here is the recommendations endpoint, measured with one, two, four, eight and sixteen users. Throughput is flat at about fifty-eight requests per second, from the very first user. That's the ceiling. So extra users only wait in line, and p95 grows with every step: from twenty-five milliseconds to over half a second. The knee, where p95 crosses the four-hundred-millisecond budget, is the practical capacity: somewhere between eight and sixteen users.

**1:10 Spikes and soaks.** A spike test jumps from five users to a hundred in five seconds. During the surge, p95 hits five seconds and some requests time out. Afterwards, latency returns to normal. Larkspur recovers. Soak tests run for hours and watch the trend: memory, connections, and latency creeping up over time.

## La leçon

A load test answers "are we fine at the traffic we expect?". The tests in this lesson ask harder questions, and each uses a different shape of traffic over time.

> **Animation de concept: Four shapes of load**
>
> 1. Load test: the traffic you expect on a busy day. Question: do we meet the budget?
> 2. Stress test: keep adding users in steps. Question: where does it break, and how?
> 3. Spike test: a sudden surge, like a newsletter going out. Question: do we survive it and recover?
> 4. Soak test: ordinary load for hours. Question: does anything leak or drift over time?

| Test | Shape | Question | Typical length |
| --- | --- | --- | --- |
| Load | Ramp to expected traffic, hold | Do we meet the budget? | 5–30 min |
| Stress | Add users in steps until it breaks | Where's the limit, and how does it fail? | 10–30 min |
| Spike | Jump from low to very high, then back | Do we survive a surge and recover? | 5–15 min |
| Soak | Ordinary load, held | Does anything leak or drift? | Hours |

## Finding capacity

After chapter 2, the load test passes. So how much more can Larkspur take? Step up the users on the slowest endpoint, recommendations, and record throughput and latency at each step.

> **Animation de concept: Finding capacity**
>
> 1. Add users in steps and record throughput and p95 at each one. These are real measurements of the recommendations endpoint.
> 2. Throughput is flat at about 58 requests per second from the first user. That's the ceiling: more users can't make it go faster.
> 3. So extra users only wait in line. p95 climbs from 25 ms with one user to 532 ms with sixteen.
> 4. The knee, where p95 crosses the 400 ms budget, is the practical capacity: somewhere between 8 and 16 users. Plan to stay well below it.

Two things happen, and they're the same thing seen from two sides. **Throughput stops growing**: the endpoint can do about 58 requests per second no matter how many users ask. And because requests can't be served any faster, **extra users only queue**: p95 rises in proportion to the number of users waiting.

The point where p95 crosses the budget is the **practical capacity**. It's well before the point where the app crashes or returns errors, and it's the number to plan with. Here: between 8 and 16 users, at about 58 requests per second.

A stress test with k6 adds users in steps until well past that point, to see **how** the app fails:

```text
    ✗ 'p(95)<300' p(95)=1.02s
    ✓ 'rate<0.01' rate=0.59%
    ✗ status is 200
      ↳  99% — ✓ 4489 / ✗ 27
```

At 80 users, 27 requests waited longer than k6's 10-second timeout. Larkspur doesn't crash; it just makes people wait until they give up. Graceful in one sense, terrible in another.

## Spikes and recovery

A spike test jumps from 5 to 100 users in five seconds, holds, then drops back. The interesting number is what happens **after**:

| Phase | p95 |
| --- | --- |
| Before (5 users) | 26 ms |
| During the spike (100 users) | 5.3 s, with 3.5% of requests timing out |
| After (5 users again) | 28 ms |

Larkspur recovers fully once the surge passes. Many systems don't: queues stay full, connection pools stay exhausted, caches were evicted, or autoscaling arrives after the spike has gone. A spike test that only checks survival misses that.

## Soak tests

Some problems only show up over time: a cache that never evicts, a connection that's never returned, a log file filling a disk. A soak test runs ordinary load for hours and watches the **trend**: is p95 at hour three the same as at minute five? Is memory flat? `load/soak.k6.js` runs 15 users for 30 minutes; set `DURATION=5m` for a rehearsal. Watch the server's memory while it runs (`top`, Activity Monitor or Task Manager).

## Hands-on: Find the capacity of /api/recommendations

**Pratique · 25 min.** Objectif. Use a stepped stress test and a spike test to find where /api/recommendations stops meeting its 400 ms budget, and whether it recovers from a surge.

1. Step through increasing load with the built-in tool. Each stage runs five seconds.

   ```bash
   npm run load -- --url "http://localhost:3000/api/recommendations?book_id=7" --stages 5:1,5:2,5:4,5:8,5:16,5:32
   ```

![A table with one row per stage: 1, 2, 4, 8, 16 and 32 virtual users. The requests-per-second column stays between about 55 and 61 throughout, while p95 rises from about 25 ms to 46, 105, 286, 532 and 957 ms.](screenshot-pending)
*Screenshot (npm run load, stepped): Throughput is flat; p95 grows with every step. The budget is crossed between 8 and 16 users.*

2. Find the ceiling (where req/s stops growing) and the capacity (the last stage with p95 under 400 ms).
3. With k6, run the stepped stress test and the spike test against the same endpoint:

   ```bash
   TARGET="/api/recommendations?book_id=7" STEP=10s k6 run load/stress.k6.js
   TARGET="/api/recommendations?book_id=7" k6 run load/spike.k6.js
   ```

![k6 spike test summary. Thresholds for phase:before and phase:after pass with p95 around 26 to 28 ms; phase:spike fails with p95 around 5.3 s. The failed request rate is about 3.5%.](screenshot-pending)
*Screenshot (k6 run load/spike.k6.js): It survives the spike badly and recovers fully.*

4. Write `notes/capacity.md`. Lesson 3.4 finds out why the ceiling is so low.

**C'est terminé quand**
- notes/capacity.md states the ceiling in req/s and the capacity in users, both taken from captured output
- The spike result says whether the endpoint recovered, with before and after p95

**La part de l'agent : déléguez l'implémentation**

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

## Points clés

- Load tests check expected traffic; stress tests find the breaking point; spike tests check survival and recovery; soak tests find slow drift.
- When throughput stops growing as users increase, you've hit the ceiling. After that, extra users only add waiting time.
- Capacity is the load at which p95 crosses the budget, not the load at which the app crashes.
- In a spike, judge recovery as well as survival: latency and errors should return to normal once the surge ends.
- Soak tests need hours and a watch on memory, connections and latency trend, not just the final percentiles.

---

Précédent: [Leçon 3.2: Tests de charge avec k6](/demo/fr/performance-testing/dynamic/load-testing.md)
Suivant: [Leçon 3.4: Trouver le goulot d'étranglement](/demo/fr/performance-testing/dynamic/bottlenecks.md)
