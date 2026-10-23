# Plan de cours: Écrire des cas de test

Les fondamentaux du test, en courtes leçons. Découvrez ce qu'est un cas de test et ce qui le rend fiable, choisissez les entrées avec les partitions et les valeurs limites, couvrez les chemins d'erreur, transformez un cas écrit en test automatisé et gardez en bonne santé une suite qui grandit.

- Durée totale: 1 h 45 min
- Vidéos: 7 (13:05)
- Toute personne qui teste du logiciel ou veut s'y mettre : développeurs, testeurs, équipes produit. Aucune expérience nécessaire ; la leçon 3.1 lit un peu de JavaScript.

## Objectifs du cours

- Lire, écrire et exécuter un cas de test à la main
- Réécrire des cas vagues pour les rendre précis et reproductibles
- Choisir les entrées de test avec les classes d'équivalence et les valeurs limites
- Couvrir les cas négatifs et repérer les trous avec des tables de décision
- Transformer un cas de test en test automatisé avec Arrange, Act, Assert
- Organiser une suite avec la pyramide des tests et une matrice de traçabilité

## Avant de commencer

- De la curiosité pour la façon dont les logiciels cassent
- Node.js, seulement pour exécuter vous-même les tests de la leçon 3.1

## Structure

1. **Fondamentaux** (30 min): Ce qu'est un cas de test, et ce qui distingue un bon cas d'un cas faible.
2. **Concevoir des cas de test** (45 min): Choisir quels cas écrire avec les partitions, les limites et les tables de décision.
3. **Automatiser et passer à l'échelle** (30 min): Transformer les cas en code, puis organiser une suite digne de confiance.

## Chapitre 1: Fondamentaux

Ce qu'est un cas de test, et ce qui distingue un bon cas d'un cas faible. (30 min)

### Leçon 1.1: Qu'est-ce qu'un cas de test ? (15 min, ▶ 2:56)

Les parties d'un cas de test, construit champ par champ puis exécuté à la main sur une vraie page de connexion.

/demo/fr/test-cases/foundations/anatomy.md

Acquis:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

Points clés:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### Leçon 1.2: Bons et mauvais cas de test (15 min, ▶ 1:55)

Cinq habitudes qui rendent un cas de test fiable, et la forme Given, When, Then qu'adoptent beaucoup d'équipes.

/demo/fr/test-cases/foundations/good-cases.md

Acquis:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

Points clés:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## Chapitre 2: Concevoir des cas de test

Choisir quels cas écrire avec les partitions, les limites et les tables de décision. (45 min)

### Leçon 2.1: Partitions et limites (15 min, ▶ 1:30)

Classes d'équivalence et analyse des valeurs limites : quelques entrées bien choisies au lieu de milliers.

/demo/fr/test-cases/design/partitions.md

Acquis:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

Points clés:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### Leçon 2.2: Au-delà du chemin heureux (15 min, ▶ 1:28)

Cas négatifs, cas extrêmes et tables de décision pour les règles qui se combinent.

/demo/fr/test-cases/design/negative.md

Acquis:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

Points clés:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### Leçon 2.3: Exploratory testing (15 min, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/fr/test-cases/design/exploratory.md

Acquis:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

Points clés:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## Chapitre 3: Automatiser et passer à l'échelle

Transformer les cas en code, puis organiser une suite digne de confiance. (30 min)

### Leçon 3.1: Du cas de test au test automatisé (15 min, ▶ 1:28)

Transformer un cas de test écrit en code avec Arrange, Act, Assert, et voir un test aux limites attraper un vrai bug.

/demo/fr/test-cases/automation/unit-tests.md

Acquis:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

Points clés:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### Leçon 3.2: Organiser une suite de tests (15 min, ▶ 1:42)

La pyramide des tests, la traçabilité vers les exigences et une suite qui grandit en restant saine.

/demo/fr/test-cases/automation/suites.md

Acquis:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

Points clés:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
