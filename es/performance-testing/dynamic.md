# Capítulo 3 · Apertura: Pruebas dinámicas

Pruebas de rendimiento · Capítulo 3: Pruebas dinámicas · 5 min

> Ejecuta el sistema, envíale tráfico y mide lo que realmente sienten los usuarios.

*Esta lección aún no está traducida al es, así que estás leyendo el texto en inglés. El título y la navegación sí están traducidos.*

## Transcripción: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## La lección

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## Lo que obtendrás

- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

## Before you start

Install k6, the load testing tool this chapter uses:

| System | Command |
| --- | --- |
| macOS | `brew install k6` |
| Windows | `winget install k6 --source winget` |
| Debian, Ubuntu | see [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

If you can't install it, every exercise also works with the practice app's built-in tool, `npm run load`. You'll need Chrome for Lighthouse and the profiler.

> **Run tests from a quiet machine.** Close heavy apps before a dynamic test and run the load generator and the app on the same machine only when comparing before with after. Numbers from different machines, or from a busy laptop, aren't comparable.

## In this chapter

- Lección 3.1: [Medición en laboratorio con Lighthouse](/demo/es/performance-testing/dynamic/lighthouse.md) (25 min). Carga la página en un teléfono simulado y mide qué ve el usuario, y cuándo.
- Lección 3.2: [Pruebas de carga con k6](/demo/es/performance-testing/dynamic/load-testing.md) (30 min). Simula una tarde llena de compradores y deja que los umbrales decidan si la aplicación cumple sus presupuestos.
- Lección 3.3: [Pruebas de estrés, pico y resistencia](/demo/es/performance-testing/dynamic/stress-spike-soak.md) (30 min). Supera la carga esperada para encontrar el techo, sobrevivir a un aluvión y detectar la degradación lenta a lo largo de horas.
- Lección 3.4: [Encontrar el cuello de botella](/demo/es/performance-testing/dynamic/bottlenecks.md) (30 min). Perfila la aplicación bajo carga, lee el gráfico de llamas, corrige la ruta caliente y demuéstralo con la misma prueba.
- Capítulo 3 · Resumen: [Pruebas dinámicas: resumen](/demo/es/performance-testing/dynamic/summary.md) (5 min). Lo que te enseñó ejecutar la aplicación y que leerla no podía.

---

Anterior: [Capítulo 2 · Resumen: Pruebas estáticas: resumen](/demo/es/performance-testing/static/summary.md)
Siguiente: [Lección 3.1: Medición en laboratorio con Lighthouse](/demo/es/performance-testing/dynamic/lighthouse.md)
