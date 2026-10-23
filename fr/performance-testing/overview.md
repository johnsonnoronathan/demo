# Chapitre 1 · Ouverture: Vue d'ensemble

Tests de performance · Chapitre 1: Vue d'ensemble · 5 min

> Ce que couvre ce cours, comment il est construit et comment utiliser la classe et ses prompts pour agents.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

## Transcription: Overview (1:53)

**0:00 Welcome.** Welcome to Performance Testing on Testbench. In this course you'll learn to find what makes software slow, before your users do. "The site feels slow" is a complaint. A number with a cause attached is a finding. This course teaches you to get from one to the other.

**0:20 Four chapters.** The course has four chapters. First, an overview: what performance testing measures, and how. Then static testing: finding problems by reading code, query plans and build output, without running anything. Then dynamic testing: running the app under realistic traffic and measuring what users feel. And finally a summary that puts both into a workflow, and into a report people can act on.

**0:48 The practice app.** You'll practise on Larkspur Books, a small online bookshop with five thousand books and two hundred thousand orders. It's slow on purpose. One page of books runs a hundred and one database queries, and on a phone the main image takes almost ten seconds to appear. By the end of the course you'll have found and fixed every one of those problems, with a number to prove each fix.

**1:17 How each page works.** Every page works the same way. Watch a short video, like this one. Then read the lesson below it, at your own pace. Then do your part of the hands-on exercise: run the checks yourself, and read the numbers. Hand the implementation to a coding agent. Copy the exercise's prompt, and the agent makes the fix and quotes its output. Then verify: rerun the same check yourself. The number you see is the one that counts, and the decision is yours.

## La leçon

"The site feels slow" is a complaint. "p95 for `/api/books` is 1.3 seconds against a 300 ms budget, because the endpoint runs 101 queries per request" is a finding someone can fix. This course teaches you to get from the first to the second, reliably.

## Ce que vous allez obtenir

- Know what questions performance testing answers, and which numbers it reports
- Tell static testing from dynamic testing, and know when each one pays off
- Have the practice app running, with a first measurement written down
- Know how to hand a hands-on exercise to a coding agent, and what to check when it reports back

## How the course is built

The course moves from the big picture to specific techniques and back again. Chapter 1 frames the problem. Chapters 2 and 3 each go deep on one family of tests. Chapter 4 puts them together into a workflow and a report.

1. **Vue d'ensemble** (Général): Ce que mesure un test de performance, les deux familles de tests et l'application d'entraînement.
2. **Tests statiques** (Spécifique): Trouver les problèmes de performance en examinant ce que vous avez construit, sans l'exécuter.
3. **Tests dynamiques** (Spécifique): Faire tourner le système, lui envoyer du trafic et mesurer ce que ressentent les utilisateurs.
4. **Synthèse** (Général): Réunir les deux dans une routine, rendre compte des résultats, prononcer l'acceptation, l'appliquer à votre propre projet et revoir tout le cours.

Every chapter follows the same shape:

1. **An opening** like this one: what you'll get, and a map of the chapter.
2. **Lessons.** Each mixes concepts and practice. Concepts come with a short **animation** you can play, pause and step through. Hands-on exercises run against the practice app and show **screenshots** of what you should see.
3. **A summary** that collects the chapter's key points and gives you a few questions to check yourself.

## The practice app

Everything you test is **Larkspur Books**, a small bookshop in `academy/practice/larkspur`: a storefront page and three JSON endpoints over a SQLite database of 5,000 books, 50,000 reviews and 200,000 orders. It needs Node.js 22.13 or later and nothing else.

Larkspur is slow on purpose. Each problem in it is one this course teaches you to find, and every number quoted in the lessons comes from a real run against it. Your numbers will differ with your machine; the shape of the results won't.

## Working with an agent

This course teaches you to test performance, and an agent helps you do it. The split is the same in every exercise:

| You | The agent |
| --- | --- |
| Learn the concept: watch, read | |
| Run the checks and tests, read the numbers | |
| | Implement: fixes, scripts, gates, CI configuration |
| | Report back, quoting real command output |
| Verify: rerun the same check and compare | |
| Decide: accept, reject, or set a new budget | |

Each exercise has two parts. **Your part** comes first: the steps you run yourself, with the output you should expect. Then the **agent part**: a prompt you copy into Claude Code or another coding agent, so it makes the changes. The prompt is self-contained: where to work, the steps, how to tell it's done, and what to report. It tells the agent to quote real output instead of estimating, and never to loosen a budget to make a check pass.

When the agent says it's done, rerun the check yourself. The number you see is the one that counts. By the end of the course you'll use the same loop on your own project (lesson 4.4) and finish with a formal acceptance decision (lesson 4.3).

> **Agents can read the whole course.** Every page has a Markdown version (see "For agents" in the page margin), and `/llms.txt` lists them all. Point an agent there when it needs context beyond a single exercise.

## In this chapter

- Leçon 1.1: [Ce que mesure un test de performance](/demo/fr/performance-testing/overview/what-it-measures.md) (20 min). Latence, débit et erreurs : les trois chiffres de tout test de performance, et pourquoi la latence s'exprime en percentiles.
- Leçon 1.2: [Tests statiques et dynamiques](/demo/fr/performance-testing/overview/static-and-dynamic.md) (20 min). Les deux familles de tests de performance, ce que chacune peut ou ne peut pas trouver, et comment préparer les questions avant de tester.
- Chapitre 1 · Résumé: [Vue d'ensemble : résumé](/demo/fr/performance-testing/overview/summary.md) (5 min). Le vocabulaire et le plan qui vous serviront pour la suite du cours.

---

Suivant: [Leçon 1.1: Ce que mesure un test de performance](/demo/fr/performance-testing/overview/what-it-measures.md)
