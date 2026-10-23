# Tests de performance

> Trouvez ce qui ralentit un logiciel avant vos utilisateurs.

Apprenez à tester les performances d'une application web sous deux angles. Les tests statiques examinent le code, les requêtes et les ressources sans rien exécuter. Les tests dynamiques font tourner le système, lui envoient du trafic et mesurent ce que ressentent les utilisateurs. Vous pratiquez les deux sur Larkspur Books, une petite librairie en ligne lente à dessein.

Durée totale: 6 h 50 min

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## Chapitre 1: Vue d'ensemble

Ce que mesure un test de performance, les deux familles de tests et l'application d'entraînement.

- [Chapitre 1 · Ouverture: Vue d'ensemble](/demo/fr/performance-testing/overview.md) (5 min). Ce que couvre ce cours, comment il est construit et comment utiliser la classe et ses prompts pour agents.
- [Leçon 1.1: Ce que mesure un test de performance](/demo/fr/performance-testing/overview/what-it-measures.md) (20 min). Latence, débit et erreurs : les trois chiffres de tout test de performance, et pourquoi la latence s'exprime en percentiles.
- [Leçon 1.2: Tests statiques et dynamiques](/demo/fr/performance-testing/overview/static-and-dynamic.md) (20 min). Les deux familles de tests de performance, ce que chacune peut ou ne peut pas trouver, et comment préparer les questions avant de tester.
- [Chapitre 1 · Résumé: Vue d'ensemble : résumé](/demo/fr/performance-testing/overview/summary.md) (5 min). Le vocabulaire et le plan qui vous serviront pour la suite du cours.

## Chapitre 2: Tests statiques

Trouver les problèmes de performance en examinant ce que vous avez construit, sans l'exécuter.

- [Chapitre 2 · Ouverture: Tests statiques](/demo/fr/performance-testing/static.md) (5 min). Trouver les problèmes de performance en lisant ce que vous avez construit, avant toute exécution.
- [Leçon 2.1: Budgets de performance](/demo/fr/performance-testing/static/budgets.md) (20 min). Se mettre d'accord sur des limites avant de mesurer, puis laisser un contrôle les faire respecter à chaque changement.
- [Leçon 2.2: Revue de code : les requêtes N+1](/demo/fr/performance-testing/static/n-plus-one.md) (25 min). Le bug de performance le plus courant dans le code qui utilise une base de données, comment le trouver en lisant et comment l'éliminer.
- [Leçon 2.3: Lire les plans de requête](/demo/fr/performance-testing/static/query-plans.md) (25 min). Demander à la base comment elle exécuterait une requête, sans l'exécuter, et corriger les parcours complets de table avec le bon index.
- [Leçon 2.4: Le poids des ressources](/demo/fr/performance-testing/static/asset-weight.md) (20 min). Trouver ce qui alourdit une page en pesant ses fichiers, et la faire tenir dans le budget sans changer ce que voient les utilisateurs.
- [Chapitre 2 · Résumé: Tests statiques : résumé](/demo/fr/performance-testing/static/summary.md) (5 min). Ce que vous avez trouvé sans exécuter l'application, et ce que les contrôles statiques ne peuvent pas vous dire.

## Chapitre 3: Tests dynamiques

Faire tourner le système, lui envoyer du trafic et mesurer ce que ressentent les utilisateurs.

- [Chapitre 3 · Ouverture: Tests dynamiques](/demo/fr/performance-testing/dynamic.md) (5 min). Faire tourner le système, lui envoyer du trafic et mesurer ce que ressentent vraiment les utilisateurs.
- [Leçon 3.1: Mesure en laboratoire avec Lighthouse](/demo/fr/performance-testing/dynamic/lighthouse.md) (25 min). Charger la page sur un téléphone simulé et mesurer ce que voit l'utilisateur, et à quel moment.
- [Leçon 3.2: Tests de charge avec k6](/demo/fr/performance-testing/dynamic/load-testing.md) (30 min). Simuler une soirée chargée d'acheteurs et laisser les seuils décider si l'application respecte ses budgets.
- [Leçon 3.3: Tests de stress, de pic et d'endurance](/demo/fr/performance-testing/dynamic/stress-spike-soak.md) (30 min). Dépasser la charge attendue pour trouver le plafond, survivre à un afflux et repérer les dérives lentes sur plusieurs heures.
- [Leçon 3.4: Trouver le goulot d'étranglement](/demo/fr/performance-testing/dynamic/bottlenecks.md) (30 min). Profiler l'application sous charge, lire le flame graph, corriger le chemin critique et le prouver avec le même test.
- [Chapitre 3 · Résumé: Tests dynamiques : résumé](/demo/fr/performance-testing/dynamic/summary.md) (5 min). Ce que l'exécution de l'application vous a appris et que la lecture ne pouvait pas révéler.

## Chapitre 4: Synthèse

Réunir les deux dans une routine, rendre compte des résultats, prononcer l'acceptation, l'appliquer à votre propre projet et revoir tout le cours.

- [Chapitre 4 · Ouverture: Synthèse](/demo/fr/performance-testing/review.md) (5 min). Réunir tests statiques et dynamiques dans une routine, rendre compte des résultats, prononcer l'acceptation, l'appliquer à votre propre projet et revoir le cours.
- [Leçon 4.1: Un processus de tests de performance](/demo/fr/performance-testing/review/workflow.md) (25 min). Décider de ce qui tourne où : contrôles statiques à chaque pull request, tests dynamiques avant la mise en production, surveillance en production.
- [Leçon 4.2: Rendre compte des résultats](/demo/fr/performance-testing/review/reporting.md) (20 min). Rédiger les résultats de performance pour que l'on puisse décider et qu'une autre personne puisse refaire le test.
- [Leçon 4.3: Acceptation des performances](/demo/fr/performance-testing/review/acceptance.md) (30 min). Transformer les budgets en critères d'acceptation, lancer le test d'acceptation en une commande et prendre une décision go/no-go signée.
- [Leçon 4.4: Tests statiques sur votre propre projet](/demo/fr/performance-testing/review/your-project.md) (45 min). Lancer vous-même les contrôles statiques du cours sur un vrai code, lire les chiffres, fixer les premiers budgets et confier les corrections à un agent.
- [Chapitre 4 · Résumé: Synthèse du cours](/demo/fr/performance-testing/review/summary.md) (10 min). Tout ce que le cours a couvert, au même endroit, et la suite.
