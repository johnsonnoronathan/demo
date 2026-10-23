# Kapitel 4 · Einstieg: Zusammenfassung

Performance-Tests · Kapitel 4: Zusammenfassung · 5 Min.

> Statische und dynamische Tests zu einer Routine verbinden, Ergebnisse berichten, die Abnahme durchführen, es auf das eigene Projekt anwenden und den Kurs wiederholen.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

## Transkript: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## Die Lektion

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## Was Sie mitnehmen

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **Überblick** (Überblick): Was Performance-Tests messen, die zwei Testfamilien und die Übungs-App.
2. **Statische Tests** (Vertiefung): Performance-Probleme finden, indem man das Gebaute untersucht, ohne es auszuführen.
3. **Dynamische Tests** (Vertiefung): Das System laufen lassen, Last darauf schicken und messen, was Nutzer spüren.
4. **Zusammenfassung** (Überblick): Beides zu einem Ablauf verbinden, Ergebnisse berichten, die Abnahme durchführen, es auf das eigene Projekt anwenden und den ganzen Kurs wiederholen.

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- Lektion 4.1: [Ein Ablauf für Performance-Tests](/demo/de/performance-testing/review/workflow.md) (25 Min.). Entscheiden, was wo läuft: statische Prüfungen bei jedem Pull Request, dynamische Tests vor dem Release, Monitoring in Produktion.
- Lektion 4.2: [Ergebnisse berichten](/demo/de/performance-testing/review/reporting.md) (20 Min.). Performance-Ergebnisse so aufschreiben, dass andere entscheiden und den Test wiederholen können.
- Lektion 4.3: [Performance-Abnahme](/demo/de/performance-testing/review/acceptance.md) (30 Min.). Budgets in Abnahmekriterien übersetzen, den Abnahmetest mit einem Befehl ausführen und eine unterschriebene Go/No-Go-Entscheidung treffen.
- Lektion 4.4: [Statische Tests am eigenen Projekt](/demo/de/performance-testing/review/your-project.md) (45 Min.). Die statischen Prüfungen des Kurses selbst an echtem Code ausführen, die Zahlen lesen, erste Budgets setzen und die Korrekturen einem Agenten übergeben.
- Kapitel 4 · Zusammenfassung: [Kurszusammenfassung](/demo/de/performance-testing/review/summary.md) (10 Min.). Alles, was der Kurs behandelt hat, an einem Ort, und wie es weitergeht.

---

Zurück: [Kapitel 3 · Zusammenfassung: Dynamische Tests: Zusammenfassung](/demo/de/performance-testing/dynamic/summary.md)
Weiter: [Lektion 4.1: Ein Ablauf für Performance-Tests](/demo/de/performance-testing/review/workflow.md)
