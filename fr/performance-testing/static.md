# Chapitre 2 · Ouverture: Tests statiques

Tests de performance · Chapitre 2: Tests statiques · 5 min

> Trouver les problèmes de performance en lisant ce que vous avez construit, avant toute exécution.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

## Transcription: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## La leçon

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## Ce que vous allez obtenir

- Turn your plan's budgets into a check that passes or fails the build
- Spot the N+1 query pattern in code, with a linter and by eye, and remove it
- Read a SQLite query plan, recognise a full table scan, and fix it with an index
- Find what makes a page heavy, and cut it below budget
- Know which of these checks belong on every pull request

## What you'll use

| Tool | What it reads | Lesson |
| --- | --- | --- |
| `npm run budget` | The files the storefront loads, measured against `budget.json` | 2.1, 2.4 |
| `npm run lint:queries` | Source files, looking for database calls inside loops | 2.2 |
| `npm run explain` | SQLite's plan for a query, without running it | 2.3 |

All three ship with the practice app and need nothing installed.

## In this chapter

- Leçon 2.1: [Budgets de performance](/demo/fr/performance-testing/static/budgets.md) (20 min). Se mettre d'accord sur des limites avant de mesurer, puis laisser un contrôle les faire respecter à chaque changement.
- Leçon 2.2: [Revue de code : les requêtes N+1](/demo/fr/performance-testing/static/n-plus-one.md) (25 min). Le bug de performance le plus courant dans le code qui utilise une base de données, comment le trouver en lisant et comment l'éliminer.
- Leçon 2.3: [Lire les plans de requête](/demo/fr/performance-testing/static/query-plans.md) (25 min). Demander à la base comment elle exécuterait une requête, sans l'exécuter, et corriger les parcours complets de table avec le bon index.
- Leçon 2.4: [Le poids des ressources](/demo/fr/performance-testing/static/asset-weight.md) (20 min). Trouver ce qui alourdit une page en pesant ses fichiers, et la faire tenir dans le budget sans changer ce que voient les utilisateurs.
- Chapitre 2 · Résumé: [Tests statiques : résumé](/demo/fr/performance-testing/static/summary.md) (5 min). Ce que vous avez trouvé sans exécuter l'application, et ce que les contrôles statiques ne peuvent pas vous dire.

---

Précédent: [Chapitre 1 · Résumé: Vue d'ensemble : résumé](/demo/fr/performance-testing/overview/summary.md)
Suivant: [Leçon 2.1: Budgets de performance](/demo/fr/performance-testing/static/budgets.md)
