# Chapitre 3 · Ouverture: Tests dynamiques

Tests de performance · Chapitre 3: Tests dynamiques · 5 min

> Faire tourner le système, lui envoyer du trafic et mesurer ce que ressentent vraiment les utilisateurs.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

## Transcription: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## La leçon

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## Ce que vous allez obtenir

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

- Leçon 3.1: [Mesure en laboratoire avec Lighthouse](/demo/fr/performance-testing/dynamic/lighthouse.md) (25 min). Charger la page sur un téléphone simulé et mesurer ce que voit l'utilisateur, et à quel moment.
- Leçon 3.2: [Tests de charge avec k6](/demo/fr/performance-testing/dynamic/load-testing.md) (30 min). Simuler une soirée chargée d'acheteurs et laisser les seuils décider si l'application respecte ses budgets.
- Leçon 3.3: [Tests de stress, de pic et d'endurance](/demo/fr/performance-testing/dynamic/stress-spike-soak.md) (30 min). Dépasser la charge attendue pour trouver le plafond, survivre à un afflux et repérer les dérives lentes sur plusieurs heures.
- Leçon 3.4: [Trouver le goulot d'étranglement](/demo/fr/performance-testing/dynamic/bottlenecks.md) (30 min). Profiler l'application sous charge, lire le flame graph, corriger le chemin critique et le prouver avec le même test.
- Chapitre 3 · Résumé: [Tests dynamiques : résumé](/demo/fr/performance-testing/dynamic/summary.md) (5 min). Ce que l'exécution de l'application vous a appris et que la lecture ne pouvait pas révéler.

---

Précédent: [Chapitre 2 · Résumé: Tests statiques : résumé](/demo/fr/performance-testing/static/summary.md)
Suivant: [Leçon 3.1: Mesure en laboratoire avec Lighthouse](/demo/fr/performance-testing/dynamic/lighthouse.md)
