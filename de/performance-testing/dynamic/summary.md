# Kapitel 3 · Zusammenfassung: Dynamische Tests: Zusammenfassung

Performance-Tests · Kapitel 3: Dynamische Tests · 5 Min.

> Was das Ausführen der App gezeigt hat, das das Lesen nicht zeigen konnte.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

## Transkript: Dynamic testing: summary (0:47)

**0:00 Recap.** Here's what running the app taught you that reading it couldn't.

**0:05 Results.** Lighthouse confirmed the asset fixes: the score went from sixty-four to a hundred, and the main image now appears in one and a half seconds instead of ten. The load test confirmed the query fixes: every threshold passes with fifty shoppers. And the stress test and profile found a problem no static rule describes. Its fix multiplied throughput by twelve.

**0:31 Together.** Static testing found three problems and predicted their cost. Dynamic testing confirmed those predictions, and found the one problem static testing couldn't see. Neither would have found everything alone. Chapter four turns that into a routine.

## Die Lektion

You measured the page the way a phone sees it, put a busy evening through the app, found its ceiling and its behaviour in a surge, and used a profile to fix a problem that no static check could see.

## Key points

### 3.1 Labormessung mit Lighthouse

- Lighthouse loads a page on a simulated mid-range phone and slow network, so results are repeatable but pessimistic.
- FCP is when anything appears; LCP is when the main content appears. LCP under 2.5 s counts as good.
- Render-blocking scripts delay FCP; heavy images delay LCP. The static checks predicted both.
- Lab data is for comparing builds. Field data from real users tells you what people actually experience.

### 3.2 Lasttests mit k6

- A virtual user runs your script in a loop. Stages set how many run at once over time.
- Think time (sleep) makes each user behave like a person, so 50 virtual users is close to 50 real shoppers.
- Checks verify each response; thresholds turn the run's percentiles and error rate into pass or fail.
- Tag requests per endpoint so each has its own threshold. A single-threaded server lets one slow endpoint delay all the others.
- Always run a short smoke test first, to prove the script and the app work before you add load.

### 3.3 Stress-, Spike- und Dauertests

- Load tests check expected traffic; stress tests find the breaking point; spike tests check survival and recovery; soak tests find slow drift.
- When throughput stops growing as users increase, you've hit the ceiling. After that, extra users only add waiting time.
- Capacity is the load at which p95 crosses the budget, not the load at which the app crashes.
- In a spike, judge recovery as well as survival: latency and errors should return to normal once the surge ends.
- Soak tests need hours and a watch on memory, connections and latency trend, not just the final percentiles.

### 3.4 Den Engpass finden

- A load test tells you that something is slow; a profile taken under the same load tells you where the time goes.
- First find the saturated resource: CPU at 100% points to code; low CPU with high latency points to waiting on something else.
- In a flame graph, width is time. Look for wide frames near the top that belong to your code.
- Work that repeats the same computation on every request is a classic hot path. Do it once and cache the result.
- Prove a fix by rerunning the exact test that found the problem, on the same machine.

## Static and dynamic, together

Look at where each fix came from. The static checks in chapter 2 found three problems and predicted their cost. The dynamic tests here **confirmed** those predictions (Lighthouse, the load test) and **found what static analysis couldn't** (the CPU hot path). Neither family would have found everything alone. Chapter 4 turns that into a routine.

## Check yourself

1. Lighthouse reports LCP 1.5 s for your page. A customer says it took five seconds. Who's wrong?
   Probably neither. Lighthouse is lab data from one simulated device; the customer's phone, network and cache differ. Use field data to see the real distribution.
2. During a stress test, req/s stays at 58 from 4 users to 32 users while p95 rises from 105 ms to 957 ms. What does that tell you?
   58 req/s is the throughput ceiling. Beyond it, extra users only queue, so latency grows with the number of users waiting.
3. A spike test passes: no errors above 5%. What else should you look at before calling the app resilient?
   Recovery: latency and error rate in the phase after the spike should return to their levels before it.
4. Why rerun the same load test after a fix, rather than a new one?
   So the only thing that changed is the code. A different test, data set or machine would make the comparison meaningless.

---

Zurück: [Lektion 3.4: Den Engpass finden](/demo/de/performance-testing/dynamic/bottlenecks.md)
Weiter: [Kapitel 4 · Einstieg: Zusammenfassung](/demo/de/performance-testing/review.md)
