# Pruebas de rendimiento

> Encuentra lo que hace lento el software antes que tus usuarios.

Aprende a probar el rendimiento de una aplicación web desde los dos lados. Las pruebas estáticas inspeccionan código, consultas y recursos sin ejecutar nada. Las pruebas dinámicas ejecutan el sistema, le envían tráfico y miden lo que sienten los usuarios. Practicarás ambas con Larkspur Books, una pequeña librería en línea lenta a propósito.

Tiempo total: 6 h 50 min

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## Capítulo 1: Visión general

Qué mide una prueba de rendimiento, las dos familias de pruebas y la aplicación de práctica.

- [Capítulo 1 · Apertura: Visión general](/demo/es/performance-testing/overview.md) (5 min). Qué cubre este curso, cómo está construido y cómo usar el aula y sus prompts para agentes.
- [Lección 1.1: Qué mide una prueba de rendimiento](/demo/es/performance-testing/overview/what-it-measures.md) (20 min). Latencia, rendimiento y errores: los tres números que informa toda prueba de rendimiento, y por qué la latencia se expresa en percentiles.
- [Lección 1.2: Pruebas estáticas y dinámicas](/demo/es/performance-testing/overview/static-and-dynamic.md) (20 min). Las dos familias de pruebas de rendimiento, qué puede y qué no puede encontrar cada una, y cómo planificar las preguntas antes de probar.
- [Capítulo 1 · Resumen: Visión general: resumen](/demo/es/performance-testing/overview/summary.md) (5 min). El vocabulario y el plan que usarás en el resto del curso.

## Capítulo 2: Pruebas estáticas

Encuentra problemas de rendimiento inspeccionando lo que construiste, sin ejecutarlo.

- [Capítulo 2 · Apertura: Pruebas estáticas](/demo/es/performance-testing/static.md) (5 min). Encuentra problemas de rendimiento leyendo lo que construiste, antes de que se ejecute nada.
- [Lección 2.1: Presupuestos de rendimiento](/demo/es/performance-testing/static/budgets.md) (20 min). Acuerda los límites antes de medir y deja que una comprobación los haga cumplir en cada cambio.
- [Lección 2.2: Revisión de código: consultas N+1](/demo/es/performance-testing/static/n-plus-one.md) (25 min). El error de rendimiento más común en código con base de datos, cómo encontrarlo leyendo y cómo eliminarlo.
- [Lección 2.3: Leer planes de consulta](/demo/es/performance-testing/static/query-plans.md) (25 min). Pregunta a la base de datos cómo ejecutaría una consulta, sin ejecutarla, y corrige los recorridos completos de tabla con el índice adecuado.
- [Lección 2.4: Peso de los recursos](/demo/es/performance-testing/static/asset-weight.md) (20 min). Encuentra qué hace pesada una página pesando sus archivos, y déjala dentro del presupuesto sin cambiar lo que ven los usuarios.
- [Capítulo 2 · Resumen: Pruebas estáticas: resumen](/demo/es/performance-testing/static/summary.md) (5 min). Lo que encontraste sin ejecutar la aplicación, y lo que las comprobaciones estáticas no pueden decirte.

## Capítulo 3: Pruebas dinámicas

Ejecuta el sistema, envíale tráfico y mide lo que sienten los usuarios.

- [Capítulo 3 · Apertura: Pruebas dinámicas](/demo/es/performance-testing/dynamic.md) (5 min). Ejecuta el sistema, envíale tráfico y mide lo que realmente sienten los usuarios.
- [Lección 3.1: Medición en laboratorio con Lighthouse](/demo/es/performance-testing/dynamic/lighthouse.md) (25 min). Carga la página en un teléfono simulado y mide qué ve el usuario, y cuándo.
- [Lección 3.2: Pruebas de carga con k6](/demo/es/performance-testing/dynamic/load-testing.md) (30 min). Simula una tarde llena de compradores y deja que los umbrales decidan si la aplicación cumple sus presupuestos.
- [Lección 3.3: Pruebas de estrés, pico y resistencia](/demo/es/performance-testing/dynamic/stress-spike-soak.md) (30 min). Supera la carga esperada para encontrar el techo, sobrevivir a un aluvión y detectar la degradación lenta a lo largo de horas.
- [Lección 3.4: Encontrar el cuello de botella](/demo/es/performance-testing/dynamic/bottlenecks.md) (30 min). Perfila la aplicación bajo carga, lee el gráfico de llamas, corrige la ruta caliente y demuéstralo con la misma prueba.
- [Capítulo 3 · Resumen: Pruebas dinámicas: resumen](/demo/es/performance-testing/dynamic/summary.md) (5 min). Lo que te enseñó ejecutar la aplicación y que leerla no podía.

## Capítulo 4: Resumen

Combina ambas en un flujo de trabajo, informa de los resultados, haz la aceptación, aplícalo a tu propio proyecto y repasa todo el curso.

- [Capítulo 4 · Apertura: Resumen](/demo/es/performance-testing/review.md) (5 min). Une las pruebas estáticas y dinámicas en una rutina, informa de los resultados, haz la aceptación, aplícalo a tu propio proyecto y repasa el curso.
- [Lección 4.1: Un flujo de trabajo de pruebas de rendimiento](/demo/es/performance-testing/review/workflow.md) (25 min). Decide qué se ejecuta dónde: controles estáticos en cada pull request, pruebas dinámicas antes de publicar y monitorización en producción.
- [Lección 4.2: Informar de los resultados](/demo/es/performance-testing/review/reporting.md) (20 min). Redacta los resultados de rendimiento para que se pueda decidir con ellos y otra persona pueda repetir la prueba.
- [Lección 4.3: Aceptación de rendimiento](/demo/es/performance-testing/review/acceptance.md) (30 min). Convierte los presupuestos en criterios de aceptación, ejecuta la prueba de aceptación con un comando y toma una decisión de publicar o no que alguien firma.
- [Lección 4.4: Pruebas estáticas en tu propio proyecto](/demo/es/performance-testing/review/your-project.md) (45 min). Ejecuta tú mismo las comprobaciones estáticas del curso en un código real, lee los números, fija los primeros presupuestos y delega las correcciones en un agente.
- [Capítulo 4 · Resumen: Resumen del curso](/demo/es/performance-testing/review/summary.md) (10 min). Todo lo que cubrió el curso, en un solo lugar, y adónde ir después.
