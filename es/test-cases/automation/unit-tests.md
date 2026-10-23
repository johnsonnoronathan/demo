# Lección 3.1: Del caso de prueba a la prueba automatizada

Cómo escribir casos de prueba · Capítulo 3: Automatizar y escalar · 15 min

> Convierte un caso escrito en código con Arrange, Act, Assert, y mira cómo una prueba de límite atrapa un error real.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

**Serás capaz de:**
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

## Transcripción: From test case to automated test (1:28)

**0:00 Introduction.** Manual test cases are a great start. When a check needs to run often, automate it. Let's turn a test case into code.

**0:10 The code under test.** Here's the function behind the SAVE10 discount code. It takes an order total and a code, and returns the new total. Ten percent off, but only for orders of twenty dollars or more.

**0:24 Arrange, Act, Assert.** An automated test is a test case written as code. The test case title becomes the test name. Arrange sets up the preconditions and test data. Act performs the one step under test. Assert is the expected result. We expect the total to be thirty-six.

**0:46 Red, then green.** Let's add our boundary case from the partitions lesson. An order of exactly twenty dollars should get the discount. Run the tests. Red. We expected eighteen, but received twenty. The function uses less-than-or-equal. Change it to less-than, and run again. Green. Every passing test is a test case that now runs itself, in milliseconds, on every change.

**1:13 Recap.** To recap: the test name is the title, Arrange is the setup, Act is the step, and Assert is the expected result. Watch a test fail before you trust it to pass. Red, then green.

## La lección

An automated test is a test case the computer runs for you. The mapping is direct: title to test name, preconditions and data to *Arrange*, the step to *Act*, the expected result to *Assert*.

## The mapping

| Test case field | In code |
| --- | --- |
| Title | `test("SAVE10 takes 10% off a $40 order", …)` |
| Preconditions, test data | Arrange: `const total = 40;` |
| Steps | Act: `applyDiscount(total, "SAVE10")` |
| Expected result | Assert: `expect(result).toBe(36)` |
| Status | The runner's ✓ or ✗ |

## Run it yourself

```text
npm install --save-dev vitest
npx vitest run
```

```js
// discount.test.js
import { test, expect } from "vitest";
import { applyDiscount } from "./discount.js";

test.each([
  [19.99, 19.99],  // just below the boundary
  [20, 18],        // the boundary
  [40, 36],        // valid partition
])("SAVE10 on $%s gives $%s", (total, expected) => {
  expect(applyDiscount(total, "SAVE10")).toBe(expected);
});

test("unknown codes leave the total alone", () => {
  expect(applyDiscount(40, "SAVE99")).toBe(40);
});
```

`test.each` turns a table of inputs, like the one from lesson 2.1, into one test per row.

> **Consejo.** **Red first.** A test you have never seen fail might not be testing anything. Break the code on purpose once and confirm the test goes red.

## Quiz

1. Which part of an automated test holds the expected result?
   a. Arrange
   b. Act
   c. Assert
   d. The import lines
   Answer: c. expect(...).toBe(...) is the expected result, checked automatically.
2. Why watch a new test fail before making it pass?
   a. It's required by the test runner
   b. To prove the test can detect the bug
   c. Failing tests run faster
   d. To fill the report
   Answer: b. If the test never goes red, it may not be checking what you think.
3. applyDiscount(20, "SAVE10") returned 20, but the rule says $20 or more gets 10% off. What's the likely bug?
   a. Rounding
   b. The code check is wrong
   c. It uses total <= 20 instead of total < 20
   d. The test imports the wrong file
   Answer: c. Returning early when total <= 20 skips the discount at exactly $20. The boundary test exposes it.

## Ideas clave

- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

---

Anterior: [Lección 2.3: Exploratory testing](/demo/es/test-cases/design/exploratory.md)
Siguiente: [Lección 3.2: Organizar una batería de pruebas](/demo/es/test-cases/automation/suites.md)
