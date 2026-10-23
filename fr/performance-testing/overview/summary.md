# Chapitre 1 · Résumé: Vue d'ensemble : résumé

Tests de performance · Chapitre 1: Vue d'ensemble · 5 min

> Le vocabulaire et le plan qui vous serviront pour la suite du cours.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

## Transcription: Overview: summary (0:36)

**0:00 Recap.** Here's what chapter one covered, in four points.

**0:04 Key points.** Every performance test reports latency, throughput and an error rate. Latency is a distribution, so we report percentiles, never the average. Static testing reads what you built. Dynamic testing runs it and measures. And a good plan starts with concrete questions, each with a number to hit.

**0:26 Next.** Next comes static testing: the cheapest tests there are. You'll find three of Larkspur's problems without starting the app at all.

## La leçon

You now have the vocabulary for the rest of the course, a running practice app, a baseline and a plan.

## Key points

### 1.1 Ce que mesure un test de performance

- Latency is how long one request takes, throughput is how many complete per second, and the error rate is the share that fail.
- Latency is a distribution. Report percentiles: p50 for the typical request, p95 and p99 for the slow tail.
- An average blends fast and slow requests into a number no user experienced. Don't set budgets on averages.
- Write down how you measured (users, duration, endpoint), so the number can be repeated and compared.

### 1.2 Tests statiques et dynamiques

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

Précédent: [Leçon 1.2: Tests statiques et dynamiques](/demo/fr/performance-testing/overview/static-and-dynamic.md)
Suivant: [Chapitre 2 · Ouverture: Tests statiques](/demo/fr/performance-testing/static.md)
