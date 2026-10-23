# Unterrichtsplan: Testfälle schreiben

Die Grundlagen des Testens in kurzen Lektionen. Sie lernen, was ein Testfall ist und was ihn verlässlich macht, wählen Eingaben mit Äquivalenzklassen und Grenzwerten, decken die Fehlerpfade ab, machen aus einem geschriebenen Fall einen automatisierten Test und halten eine wachsende Testsuite gesund.

- Gesamtdauer: 1 Std. 45 Min.
- Videos: 7 (13:05)
- Alle, die Software testen oder es lernen wollen: Entwickler, Tester, Produktleute. Keine Testerfahrung nötig; in Lektion 3.1 wird etwas JavaScript gelesen.

## Kursziele

- Einen Testfall lesen, schreiben und von Hand ausführen
- Vage Testfälle in konkrete, wiederholbare umschreiben
- Testeingaben mit Äquivalenzklassen und Grenzwerten auswählen
- Negativfälle abdecken und Lücken mit Entscheidungstabellen finden
- Einen Testfall mit Arrange, Act, Assert in einen automatisierten Test verwandeln
- Eine Suite mit der Testpyramide und einer Rückverfolgbarkeitsmatrix ordnen

## Bevor Sie anfangen

- Neugier darauf, wie Software kaputtgeht
- Node.js, nur wenn Sie die Tests aus Lektion 3.1 selbst ausführen möchten

## Aufbau

1. **Grundlagen** (30 min): Was ein Testfall ist und was einen guten von einem schwachen unterscheidet.
2. **Testfälle entwerfen** (45 min): Mit Klassen, Grenzwerten und Entscheidungstabellen entscheiden, welche Fälle man schreibt.
3. **Automatisieren und skalieren** (30 min): Fälle in Code verwandeln und eine Suite aufbauen, der man vertraut.

## Kapitel 1: Grundlagen

Was ein Testfall ist und was einen guten von einem schwachen unterscheidet. (30 Min.)

### Lektion 1.1: Was ist ein Testfall? (15 Min., ▶ 2:56)

Die Teile eines Testfalls, Feld für Feld aufgebaut und dann von Hand gegen eine echte Anmeldeseite ausgeführt.

/demo/de/test-cases/foundations/anatomy.md

Lernergebnisse:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

Das Wichtigste:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### Lektion 1.2: Gute und schwache Testfälle (15 Min., ▶ 1:55)

Fünf Gewohnheiten, die einen Testfall verlässlich machen, und die Form Given, When, Then, in der viele Teams sie schreiben.

/demo/de/test-cases/foundations/good-cases.md

Lernergebnisse:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

Das Wichtigste:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## Kapitel 2: Testfälle entwerfen

Mit Klassen, Grenzwerten und Entscheidungstabellen entscheiden, welche Fälle man schreibt. (45 Min.)

### Lektion 2.1: Äquivalenzklassen und Grenzwerte (15 Min., ▶ 1:30)

Äquivalenzklassenbildung und Grenzwertanalyse: wenige gut gewählte Eingaben statt Tausender.

/demo/de/test-cases/design/partitions.md

Lernergebnisse:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

Das Wichtigste:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### Lektion 2.2: Jenseits des Happy Path (15 Min., ▶ 1:28)

Negativfälle, Grenzfälle und Entscheidungstabellen für Regeln, die zusammenwirken.

/demo/de/test-cases/design/negative.md

Lernergebnisse:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

Das Wichtigste:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### Lektion 2.3: Exploratory testing (15 Min., ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/de/test-cases/design/exploratory.md

Lernergebnisse:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

Das Wichtigste:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## Kapitel 3: Automatisieren und skalieren

Fälle in Code verwandeln und eine Suite aufbauen, der man vertraut. (30 Min.)

### Lektion 3.1: Vom Testfall zum automatisierten Test (15 Min., ▶ 1:28)

Einen geschriebenen Testfall mit Arrange, Act, Assert in Code verwandeln und zusehen, wie ein Grenzwerttest einen echten Fehler fängt.

/demo/de/test-cases/automation/unit-tests.md

Lernergebnisse:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

Das Wichtigste:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### Lektion 3.2: Eine Testsuite ordnen (15 Min., ▶ 1:42)

Die Testpyramide, Rückverfolgbarkeit zu Anforderungen und wie eine wachsende Suite gesund bleibt.

/demo/de/test-cases/automation/suites.md

Lernergebnisse:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

Das Wichtigste:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
