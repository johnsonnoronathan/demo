# Plan de clase: Cómo escribir casos de prueba

Los fundamentos de las pruebas, en lecciones breves. Aprende qué es un caso de prueba y qué lo hace fiable, elige entradas con particiones y valores límite, cubre los caminos infelices, convierte un caso escrito en una prueba automatizada y mantén sana una batería de pruebas que crece.

- Tiempo total: 1 h 45 min
- Vídeos: 7 (13:05)
- Cualquiera que pruebe software o quiera hacerlo: desarrolladores, testers, gente de producto. No hace falta experiencia; la lección 3.1 lee un poco de JavaScript.

## Objetivos del curso

- Leer, escribir y ejecutar a mano un caso de prueba
- Reescribir casos vagos para que sean específicos y repetibles
- Elegir entradas de prueba con particiones de equivalencia y valores límite
- Cubrir casos negativos y usar tablas de decisión para encontrar huecos
- Convertir un caso de prueba en una prueba automatizada con Arrange, Act, Assert
- Organizar una batería con la pirámide de pruebas y una matriz de trazabilidad

## Antes de empezar

- Curiosidad por cómo falla el software
- Node.js, solo si quieres ejecutar tú mismo las pruebas de la lección 3.1

## Estructura

1. **Fundamentos** (30 min): Qué es un caso de prueba y qué separa uno bueno de uno débil.
2. **Diseño de casos de prueba** (45 min): Elige qué casos escribir con particiones, límites y tablas de decisión.
3. **Automatizar y escalar** (30 min): Convierte los casos en código y organiza una batería en la que la gente confíe.

## Capítulo 1: Fundamentos

Qué es un caso de prueba y qué separa uno bueno de uno débil. (30 min)

### Lección 1.1: ¿Qué es un caso de prueba? (15 min, ▶ 2:56)

Las partes de un caso de prueba, construido campo a campo y ejecutado a mano contra una página de inicio de sesión real.

/demo/es/test-cases/foundations/anatomy.md

Resultados:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

Ideas clave:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### Lección 1.2: Casos de prueba buenos y débiles (15 min, ▶ 1:55)

Cinco hábitos que hacen fiable un caso de prueba, y la forma Given, When, Then con que muchos equipos los escriben.

/demo/es/test-cases/foundations/good-cases.md

Resultados:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

Ideas clave:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## Capítulo 2: Diseño de casos de prueba

Elige qué casos escribir con particiones, límites y tablas de decisión. (45 min)

### Lección 2.1: Particiones y límites (15 min, ▶ 1:30)

Partición de equivalencia y análisis de valores límite: unas pocas entradas bien elegidas en lugar de miles.

/demo/es/test-cases/design/partitions.md

Resultados:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

Ideas clave:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### Lección 2.2: Más allá del camino feliz (15 min, ▶ 1:28)

Casos negativos, casos extremos y tablas de decisión para reglas que se combinan.

/demo/es/test-cases/design/negative.md

Resultados:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

Ideas clave:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### Lección 2.3: Exploratory testing (15 min, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/es/test-cases/design/exploratory.md

Resultados:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

Ideas clave:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## Capítulo 3: Automatizar y escalar

Convierte los casos en código y organiza una batería en la que la gente confíe. (30 min)

### Lección 3.1: Del caso de prueba a la prueba automatizada (15 min, ▶ 1:28)

Convierte un caso escrito en código con Arrange, Act, Assert, y mira cómo una prueba de límite atrapa un error real.

/demo/es/test-cases/automation/unit-tests.md

Resultados:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

Ideas clave:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### Lección 3.2: Organizar una batería de pruebas (15 min, ▶ 1:42)

La pirámide de pruebas, la trazabilidad a los requisitos y cómo mantener sana una batería que crece.

/demo/es/test-cases/automation/suites.md

Resultados:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

Ideas clave:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
