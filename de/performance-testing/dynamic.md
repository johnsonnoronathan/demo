# Kapitel 3 · Einstieg: Dynamische Tests

Performance-Tests · Kapitel 3: Dynamische Tests · 5 Min.

> Das System laufen lassen, Last darauf schicken und messen, was Nutzer wirklich spüren.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

## Transkript: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## Die Lektion

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## Was Sie mitnehmen

- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

## Before you start

Install k6, the load testing tool this chapter uses:

| System | Command |
| --- | --- |
| macOS | `brew install k6` |
| Windows | `winget install k6 --source winget` |
| Debian, Ubuntu | see [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

If you can't install it, every exercise also works with the practice app's built-in tool, `npm run load`. You'll need Chrome for Lighthouse and the profiler.

> **Run tests from a quiet machine.** Close heavy apps before a dynamic test and run the load generator and the app on the same machine only when comparing before with after. Numbers from different machines, or from a busy laptop, aren't comparable.

## In this chapter

- Lektion 3.1: [Labormessung mit Lighthouse](/demo/de/performance-testing/dynamic/lighthouse.md) (25 Min.). Die Seite auf einem simulierten Smartphone laden und messen, was der Nutzer wann sieht.
- Lektion 3.2: [Lasttests mit k6](/demo/de/performance-testing/dynamic/load-testing.md) (30 Min.). Einen geschäftigen Abend voller Kunden simulieren und Schwellenwerte entscheiden lassen, ob die App ihre Budgets einhält.
- Lektion 3.3: [Stress-, Spike- und Dauertests](/demo/de/performance-testing/dynamic/stress-spike-soak.md) (30 Min.). Über die erwartete Last hinausgehen, um die Obergrenze zu finden, einen Ansturm zu überstehen und schleichende Verschlechterung über Stunden zu erkennen.
- Lektion 3.4: [Den Engpass finden](/demo/de/performance-testing/dynamic/bottlenecks.md) (30 Min.). Die App unter Last profilieren, den Flame Graph lesen, den heißen Pfad beheben und es mit demselben Test belegen.
- Kapitel 3 · Zusammenfassung: [Dynamische Tests: Zusammenfassung](/demo/de/performance-testing/dynamic/summary.md) (5 Min.). Was das Ausführen der App gezeigt hat, das das Lesen nicht zeigen konnte.

---

Zurück: [Kapitel 2 · Zusammenfassung: Statische Tests: Zusammenfassung](/demo/de/performance-testing/static/summary.md)
Weiter: [Lektion 3.1: Labormessung mit Lighthouse](/demo/de/performance-testing/dynamic/lighthouse.md)
