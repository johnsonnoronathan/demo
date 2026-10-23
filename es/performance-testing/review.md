# Capítulo 4 · Apertura: Resumen

Pruebas de rendimiento · Capítulo 4: Resumen · 5 min

> Une las pruebas estáticas y dinámicas en una rutina, informa de los resultados, haz la aceptación, aplícalo a tu propio proyecto y repasa el curso.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

## Transcripción: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## La lección

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## Lo que obtendrás

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **Visión general** (General): Qué mide una prueba de rendimiento, las dos familias de pruebas y la aplicación de práctica.
2. **Pruebas estáticas** (Específico): Encuentra problemas de rendimiento inspeccionando lo que construiste, sin ejecutarlo.
3. **Pruebas dinámicas** (Específico): Ejecuta el sistema, envíale tráfico y mide lo que sienten los usuarios.
4. **Resumen** (General): Combina ambas en un flujo de trabajo, informa de los resultados, haz la aceptación, aplícalo a tu propio proyecto y repasa todo el curso.

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- Lección 4.1: [Un flujo de trabajo de pruebas de rendimiento](/demo/es/performance-testing/review/workflow.md) (25 min). Decide qué se ejecuta dónde: controles estáticos en cada pull request, pruebas dinámicas antes de publicar y monitorización en producción.
- Lección 4.2: [Informar de los resultados](/demo/es/performance-testing/review/reporting.md) (20 min). Redacta los resultados de rendimiento para que se pueda decidir con ellos y otra persona pueda repetir la prueba.
- Lección 4.3: [Aceptación de rendimiento](/demo/es/performance-testing/review/acceptance.md) (30 min). Convierte los presupuestos en criterios de aceptación, ejecuta la prueba de aceptación con un comando y toma una decisión de publicar o no que alguien firma.
- Lección 4.4: [Pruebas estáticas en tu propio proyecto](/demo/es/performance-testing/review/your-project.md) (45 min). Ejecuta tú mismo las comprobaciones estáticas del curso en un código real, lee los números, fija los primeros presupuestos y delega las correcciones en un agente.
- Capítulo 4 · Resumen: [Resumen del curso](/demo/es/performance-testing/review/summary.md) (10 min). Todo lo que cubrió el curso, en un solo lugar, y adónde ir después.

---

Anterior: [Capítulo 3 · Resumen: Pruebas dinámicas: resumen](/demo/es/performance-testing/dynamic/summary.md)
Siguiente: [Lección 4.1: Un flujo de trabajo de pruebas de rendimiento](/demo/es/performance-testing/review/workflow.md)
