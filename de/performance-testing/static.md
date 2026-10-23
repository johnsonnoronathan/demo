# Kapitel 2 · Einstieg: Statische Tests

Performance-Tests · Kapitel 2: Statische Tests · 5 Min.

> Performance-Probleme finden, indem man das Gebaute liest, bevor irgendetwas läuft.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

## Transkript: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## Die Lektion

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## Was Sie mitnehmen

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

- Lektion 2.1: [Performance-Budgets](/demo/de/performance-testing/static/budgets.md) (20 Min.). Grenzen vereinbaren, bevor gemessen wird, und sie bei jeder Änderung automatisch prüfen lassen.
- Lektion 2.2: [Code-Review für N+1-Abfragen](/demo/de/performance-testing/static/n-plus-one.md) (25 Min.). Der häufigste Performance-Fehler in Code mit Datenbank: wie man ihn beim Lesen findet und wie man ihn beseitigt.
- Lektion 2.3: [Abfragepläne lesen](/demo/de/performance-testing/static/query-plans.md) (25 Min.). Die Datenbank fragen, wie sie eine Abfrage ausführen würde, ohne sie auszuführen, und Full Table Scans mit dem passenden Index beheben.
- Lektion 2.4: [Gewicht der Assets](/demo/de/performance-testing/static/asset-weight.md) (20 Min.). Herausfinden, was eine Seite schwer macht, indem man ihre Dateien wiegt, und sie ins Budget bringen, ohne dass Nutzer etwas merken.
- Kapitel 2 · Zusammenfassung: [Statische Tests: Zusammenfassung](/demo/de/performance-testing/static/summary.md) (5 Min.). Was Sie gefunden haben, ohne die App zu starten, und was statische Prüfungen nicht sagen können.

---

Zurück: [Kapitel 1 · Zusammenfassung: Überblick: Zusammenfassung](/demo/de/performance-testing/overview/summary.md)
Weiter: [Lektion 2.1: Performance-Budgets](/demo/de/performance-testing/static/budgets.md)
