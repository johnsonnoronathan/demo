# Performance-Tests

> Finden Sie heraus, was Software langsam macht, bevor Ihre Nutzer es merken.

Lernen Sie, die Performance einer Webanwendung von beiden Seiten zu testen. Statische Tests untersuchen Code, Abfragen und Assets, ohne etwas auszuführen. Dynamische Tests lassen das System laufen, schicken Last darauf und messen, was Nutzer spüren. Beides üben Sie an Larkspur Books, einer kleinen Buchhandlungs-App, die absichtlich langsam ist.

Gesamtdauer: 6 Std. 50 Min.

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## Kapitel 1: Überblick

Was Performance-Tests messen, die zwei Testfamilien und die Übungs-App.

- [Kapitel 1 · Einstieg: Überblick](/demo/de/performance-testing/overview.md) (5 Min.). Was dieser Kurs behandelt, wie er aufgebaut ist und wie Sie den Kursraum und seine Agenten-Prompts nutzen.
- [Lektion 1.1: Was Performance-Tests messen](/demo/de/performance-testing/overview/what-it-measures.md) (20 Min.). Latenz, Durchsatz und Fehler: die drei Zahlen, die jeder Performance-Test liefert, und warum man Latenz in Perzentilen angibt.
- [Lektion 1.2: Statische und dynamische Tests](/demo/de/performance-testing/overview/static-and-dynamic.md) (20 Min.). Die zwei Familien von Performance-Tests, was jede finden kann und was nicht, und wie man vor dem Testen die richtigen Fragen plant.
- [Kapitel 1 · Zusammenfassung: Überblick: Zusammenfassung](/demo/de/performance-testing/overview/summary.md) (5 Min.). Das Vokabular und der Plan für den Rest des Kurses.

## Kapitel 2: Statische Tests

Performance-Probleme finden, indem man das Gebaute untersucht, ohne es auszuführen.

- [Kapitel 2 · Einstieg: Statische Tests](/demo/de/performance-testing/static.md) (5 Min.). Performance-Probleme finden, indem man das Gebaute liest, bevor irgendetwas läuft.
- [Lektion 2.1: Performance-Budgets](/demo/de/performance-testing/static/budgets.md) (20 Min.). Grenzen vereinbaren, bevor gemessen wird, und sie bei jeder Änderung automatisch prüfen lassen.
- [Lektion 2.2: Code-Review für N+1-Abfragen](/demo/de/performance-testing/static/n-plus-one.md) (25 Min.). Der häufigste Performance-Fehler in Code mit Datenbank: wie man ihn beim Lesen findet und wie man ihn beseitigt.
- [Lektion 2.3: Abfragepläne lesen](/demo/de/performance-testing/static/query-plans.md) (25 Min.). Die Datenbank fragen, wie sie eine Abfrage ausführen würde, ohne sie auszuführen, und Full Table Scans mit dem passenden Index beheben.
- [Lektion 2.4: Gewicht der Assets](/demo/de/performance-testing/static/asset-weight.md) (20 Min.). Herausfinden, was eine Seite schwer macht, indem man ihre Dateien wiegt, und sie ins Budget bringen, ohne dass Nutzer etwas merken.
- [Kapitel 2 · Zusammenfassung: Statische Tests: Zusammenfassung](/demo/de/performance-testing/static/summary.md) (5 Min.). Was Sie gefunden haben, ohne die App zu starten, und was statische Prüfungen nicht sagen können.

## Kapitel 3: Dynamische Tests

Das System laufen lassen, Last darauf schicken und messen, was Nutzer spüren.

- [Kapitel 3 · Einstieg: Dynamische Tests](/demo/de/performance-testing/dynamic.md) (5 Min.). Das System laufen lassen, Last darauf schicken und messen, was Nutzer wirklich spüren.
- [Lektion 3.1: Labormessung mit Lighthouse](/demo/de/performance-testing/dynamic/lighthouse.md) (25 Min.). Die Seite auf einem simulierten Smartphone laden und messen, was der Nutzer wann sieht.
- [Lektion 3.2: Lasttests mit k6](/demo/de/performance-testing/dynamic/load-testing.md) (30 Min.). Einen geschäftigen Abend voller Kunden simulieren und Schwellenwerte entscheiden lassen, ob die App ihre Budgets einhält.
- [Lektion 3.3: Stress-, Spike- und Dauertests](/demo/de/performance-testing/dynamic/stress-spike-soak.md) (30 Min.). Über die erwartete Last hinausgehen, um die Obergrenze zu finden, einen Ansturm zu überstehen und schleichende Verschlechterung über Stunden zu erkennen.
- [Lektion 3.4: Den Engpass finden](/demo/de/performance-testing/dynamic/bottlenecks.md) (30 Min.). Die App unter Last profilieren, den Flame Graph lesen, den heißen Pfad beheben und es mit demselben Test belegen.
- [Kapitel 3 · Zusammenfassung: Dynamische Tests: Zusammenfassung](/demo/de/performance-testing/dynamic/summary.md) (5 Min.). Was das Ausführen der App gezeigt hat, das das Lesen nicht zeigen konnte.

## Kapitel 4: Zusammenfassung

Beides zu einem Ablauf verbinden, Ergebnisse berichten, die Abnahme durchführen, es auf das eigene Projekt anwenden und den ganzen Kurs wiederholen.

- [Kapitel 4 · Einstieg: Zusammenfassung](/demo/de/performance-testing/review.md) (5 Min.). Statische und dynamische Tests zu einer Routine verbinden, Ergebnisse berichten, die Abnahme durchführen, es auf das eigene Projekt anwenden und den Kurs wiederholen.
- [Lektion 4.1: Ein Ablauf für Performance-Tests](/demo/de/performance-testing/review/workflow.md) (25 Min.). Entscheiden, was wo läuft: statische Prüfungen bei jedem Pull Request, dynamische Tests vor dem Release, Monitoring in Produktion.
- [Lektion 4.2: Ergebnisse berichten](/demo/de/performance-testing/review/reporting.md) (20 Min.). Performance-Ergebnisse so aufschreiben, dass andere entscheiden und den Test wiederholen können.
- [Lektion 4.3: Performance-Abnahme](/demo/de/performance-testing/review/acceptance.md) (30 Min.). Budgets in Abnahmekriterien übersetzen, den Abnahmetest mit einem Befehl ausführen und eine unterschriebene Go/No-Go-Entscheidung treffen.
- [Lektion 4.4: Statische Tests am eigenen Projekt](/demo/de/performance-testing/review/your-project.md) (45 Min.). Die statischen Prüfungen des Kurses selbst an echtem Code ausführen, die Zahlen lesen, erste Budgets setzen und die Korrekturen einem Agenten übergeben.
- [Kapitel 4 · Zusammenfassung: Kurszusammenfassung](/demo/de/performance-testing/review/summary.md) (10 Min.). Alles, was der Kurs behandelt hat, an einem Ort, und wie es weitergeht.
