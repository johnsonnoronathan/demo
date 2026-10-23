# Capítulo 2 · Apertura: Pruebas estáticas

Pruebas de rendimiento · Capítulo 2: Pruebas estáticas · 5 min

> Encuentra problemas de rendimiento leyendo lo que construiste, antes de que se ejecute nada.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

## Transcripción: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## La lección

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## Lo que obtendrás

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

- Lección 2.1: [Presupuestos de rendimiento](/demo/es/performance-testing/static/budgets.md) (20 min). Acuerda los límites antes de medir y deja que una comprobación los haga cumplir en cada cambio.
- Lección 2.2: [Revisión de código: consultas N+1](/demo/es/performance-testing/static/n-plus-one.md) (25 min). El error de rendimiento más común en código con base de datos, cómo encontrarlo leyendo y cómo eliminarlo.
- Lección 2.3: [Leer planes de consulta](/demo/es/performance-testing/static/query-plans.md) (25 min). Pregunta a la base de datos cómo ejecutaría una consulta, sin ejecutarla, y corrige los recorridos completos de tabla con el índice adecuado.
- Lección 2.4: [Peso de los recursos](/demo/es/performance-testing/static/asset-weight.md) (20 min). Encuentra qué hace pesada una página pesando sus archivos, y déjala dentro del presupuesto sin cambiar lo que ven los usuarios.
- Capítulo 2 · Resumen: [Pruebas estáticas: resumen](/demo/es/performance-testing/static/summary.md) (5 min). Lo que encontraste sin ejecutar la aplicación, y lo que las comprobaciones estáticas no pueden decirte.

---

Anterior: [Capítulo 1 · Resumen: Visión general: resumen](/demo/es/performance-testing/overview/summary.md)
Siguiente: [Lección 2.1: Presupuestos de rendimiento](/demo/es/performance-testing/static/budgets.md)
