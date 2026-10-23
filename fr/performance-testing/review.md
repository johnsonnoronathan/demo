# Chapitre 4 · Ouverture: Synthèse

Tests de performance · Chapitre 4: Synthèse · 5 min

> Réunir tests statiques et dynamiques dans une routine, rendre compte des résultats, prononcer l'acceptation, l'appliquer à votre propre projet et revoir le cours.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

## Transcription: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## La leçon

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## Ce que vous allez obtenir

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **Vue d'ensemble** (Général): Ce que mesure un test de performance, les deux familles de tests et l'application d'entraînement.
2. **Tests statiques** (Spécifique): Trouver les problèmes de performance en examinant ce que vous avez construit, sans l'exécuter.
3. **Tests dynamiques** (Spécifique): Faire tourner le système, lui envoyer du trafic et mesurer ce que ressentent les utilisateurs.
4. **Synthèse** (Général): Réunir les deux dans une routine, rendre compte des résultats, prononcer l'acceptation, l'appliquer à votre propre projet et revoir tout le cours.

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- Leçon 4.1: [Un processus de tests de performance](/demo/fr/performance-testing/review/workflow.md) (25 min). Décider de ce qui tourne où : contrôles statiques à chaque pull request, tests dynamiques avant la mise en production, surveillance en production.
- Leçon 4.2: [Rendre compte des résultats](/demo/fr/performance-testing/review/reporting.md) (20 min). Rédiger les résultats de performance pour que l'on puisse décider et qu'une autre personne puisse refaire le test.
- Leçon 4.3: [Acceptation des performances](/demo/fr/performance-testing/review/acceptance.md) (30 min). Transformer les budgets en critères d'acceptation, lancer le test d'acceptation en une commande et prendre une décision go/no-go signée.
- Leçon 4.4: [Tests statiques sur votre propre projet](/demo/fr/performance-testing/review/your-project.md) (45 min). Lancer vous-même les contrôles statiques du cours sur un vrai code, lire les chiffres, fixer les premiers budgets et confier les corrections à un agent.
- Chapitre 4 · Résumé: [Synthèse du cours](/demo/fr/performance-testing/review/summary.md) (10 min). Tout ce que le cours a couvert, au même endroit, et la suite.

---

Précédent: [Chapitre 3 · Résumé: Tests dynamiques : résumé](/demo/fr/performance-testing/dynamic/summary.md)
Suivant: [Leçon 4.1: Un processus de tests de performance](/demo/fr/performance-testing/review/workflow.md)
