# Lektion 3.1: Labormessung mit Lighthouse

Performance-Tests · Kapitel 3: Dynamische Tests · 25 Min.

> Die Seite auf einem simulierten Smartphone laden und messen, was der Nutzer wann sieht.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

**Sie werden können:**
- Run Lighthouse from the command line against a local page
- Explain FCP, LCP, Total Blocking Time and Cumulative Layout Shift in user terms
- Confirm a static fix with a dynamic before-and-after measurement

## Transkript: Lab measurement with Lighthouse (1:17)

**0:00 Introduction.** The budget check predicted a much lighter page. Lighthouse measures what that means for someone on a phone.

**0:08 Watching a page load.** Lighthouse loads the page on a simulated mid-range phone with a slow connection, and films it. First Contentful Paint at four point three seconds: until then, the screen is blank, because a six-hundred-kilobyte script blocks rendering. Largest Contentful Paint at nine point eight seconds, when the one-megabyte photo finally shows. The score is sixty-four. After the asset fixes from chapter two: first paint at zero point eight seconds, the main image at one point five. The score is a hundred.

**0:42 Four metrics.** Four metrics matter most. First Contentful Paint, when anything appears. Largest Contentful Paint, when the main content appears. Total Blocking Time, how long scripts keep the page from responding. And Cumulative Layout Shift, how much the page jumps while it loads.

**1:00 Before and after.** In the exercise you'll measure a frozen copy of the original page, and then the fixed storefront. Remember that lab numbers are for comparing builds. What real users experience is field data, and it varies with every phone and network.

## Die Lektion

The budget check said the storefront got 20 times lighter. That's a prediction. Lighthouse measures what it actually means for someone on a phone.

## Watching a page load

Lighthouse opens the page in Chrome, simulates a mid-range phone on a slow 4G connection (4× slower CPU, about 1.6 Mbit/s, 150 ms round trips), records every frame, and reports when key moments happened.

> **Konzept-Animation: Watching a page load**
>
> 1. Lighthouse loads the page on a simulated mid-range phone with a slow connection, and films it.
> 2. First Contentful Paint at 4.3 s: the first text appears. Until then the screen is blank, because a 600 KB script blocks rendering.
> 3. Largest Contentful Paint at 9.8 s: the 1 MB hero photo finally shows. Performance score: 64.
> 4. After the asset fixes, FCP is 0.8 s and LCP is 1.5 s. Score: 100.

| Metric | The moment it marks | Good |
| --- | --- | --- |
| **First Contentful Paint** (FCP) | The first text or image appears | ≤ 1.8 s |
| **Largest Contentful Paint** (LCP) | The biggest element, usually the main image or heading, appears | ≤ 2.5 s |
| **Total Blocking Time** (TBT) | How long scripts kept the page from responding to input | ≤ 200 ms |
| **Cumulative Layout Shift** (CLS) | How much the layout jumped while loading | ≤ 0.1 |

LCP, CLS and a responsiveness metric (Interaction to Next Paint) are Google's **Core Web Vitals**. The performance score from 0 to 100 is a weighted blend of the lab metrics. It's convenient for a headline, but budgets should name the metric, not the score.

## What changed and why

| | Before | After |
| --- | --- | --- |
| Performance score | 64 | 100 |
| First Contentful Paint | 4.3 s | 0.8 s |
| Largest Contentful Paint | 9.8 s | 1.5 s |
| Total transfer | 1,645 KiB | 68 KiB |

Each improvement traces back to a static finding from chapter 2. FCP moved because the 600 KB script no longer blocks rendering. LCP moved because the hero image is a twentieth of the size. The transfer size is bigger than the budget check's 1,140 KB because the practice server doesn't compress responses, so the browser downloads the raw script.

## Lab data and field data

Lighthouse is **lab data**: one simulated device, one network, every time. That's what makes it good for comparing two builds. It isn't what real users experience. Their phones, networks and caches vary, and they interact with the page. **Field data** (real-user monitoring, or Chrome's CrUX report for public sites) tells you that. Use the lab to find and verify fixes; use the field to decide what to fix.

## Hands-on: Measure the asset fixes in the lab

**Praxis · 15 Min..** Ziel. Run Lighthouse against the frozen before page and the fixed storefront, and compare score, FCP, LCP and transfer size.

1. With the app running, measure the frozen copy of the original page:

   ```bash
   npx lighthouse@12 http://localhost:3000/before.html --only-categories=performance --view
   ```

   `--view` opens the HTML report when it's done.

![A Lighthouse report with an orange performance score of 64. Metrics: First Contentful Paint 4.3 s and Largest Contentful Paint 9.8 s in red, Total Blocking Time 20 ms and Cumulative Layout Shift 0 in green. Below, a filmstrip of blank frames until about 4 seconds.](screenshot-pending)
*Screenshot (Lighthouse report · before.html): The original page: blank for over four seconds on a mid-range phone.*

2. Measure the fixed storefront:

   ```bash
   npx lighthouse@12 http://localhost:3000/ --only-categories=performance --view
   ```

![A Lighthouse report with a green performance score of 100. First Contentful Paint 0.8 s, Largest Contentful Paint 1.5 s, Total Blocking Time 0 ms and Cumulative Layout Shift 0, all green.](screenshot-pending)
*Screenshot (Lighthouse report · /): After chapter 2's asset fixes.*

3. Open **Opportunities** in the before report. "Eliminate render-blocking resources" and "Properly size images" are the two static findings from lesson 2.4, now with a time cost attached.
4. Record both runs in `notes/lighthouse.md`. Run each page two or three times: lab results vary a little between runs, so compare medians.

**Fertig, wenn**
- Both JSON reports exist in notes/
- notes/lighthouse.md has a table with score, FCP, LCP, TBT, CLS and total bytes for both pages

**Teil des Agenten: die Umsetzung übergeben**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 3.1, "Lab measurement with Lighthouse".

Exercise: Measure the asset fixes in the lab
Goal: Run Lighthouse against the frozen before page and the fixed storefront, and compare score, FCP, LCP and transfer size.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Make sure the app is running on port 3000.
2. Run `npx lighthouse@12 http://localhost:3000/before.html --only-categories=performance --output=json --output-path=./notes/lh-before.json --chrome-flags="--headless=new"`. If Chrome isn't found, set CHROME_PATH to a Chrome or Chromium binary and retry; if none exists, stop and report that.
3. Run the same command for http://localhost:3000/ with output `./notes/lh-after.json`.
4. From each JSON file, extract categories.performance.score and the numericValue of first-contentful-paint, largest-contentful-paint, total-blocking-time, cumulative-layout-shift and total-byte-weight.
5. Write a before/after table to `notes/lighthouse.md`.

Done when:
- Both JSON reports exist in notes/
- notes/lighthouse.md has a table with score, FCP, LCP, TBT, CLS and total bytes for both pages

Report back:
- The before/after table
- Which static finding from chapter 2 explains each improvement

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/3-dynamic/1-lab-measurement.mdx
```

## Das Wichtigste

- Lighthouse loads a page on a simulated mid-range phone and slow network, so results are repeatable but pessimistic.
- FCP is when anything appears; LCP is when the main content appears. LCP under 2.5 s counts as good.
- Render-blocking scripts delay FCP; heavy images delay LCP. The static checks predicted both.
- Lab data is for comparing builds. Field data from real users tells you what people actually experience.

---

Zurück: [Kapitel 3 · Einstieg: Dynamische Tests](/demo/de/performance-testing/dynamic.md)
Weiter: [Lektion 3.2: Lasttests mit k6](/demo/de/performance-testing/dynamic/load-testing.md)
