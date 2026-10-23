# レッスン 2.4: アセットの重さ

パフォーマンステスト · 第 2 章: 静的テスト · 20 分

> ファイルの重さを量ってページが重い原因を見つけ、見た目を変えずに予算内に収める。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

**このレッスンでできるようになること:**
- Find the heaviest files a page loads and judge whether they're needed
- Recognise render-blocking scripts in a page's HTML
- Cut page weight below budget and prove it with the budget check

## 書き起こし: Asset weight (1:15)

**0:00 Introduction.** The budget check said the storefront is over. Now let's find out exactly what makes it heavy.

**0:07 Where the weight goes.** Here's every file the storefront loads, drawn to scale. One thousand one hundred and forty kilobytes, against a budget of three hundred and fifty. Two files are nearly all of it: a hero photo saved at camera size, and a date library that bundles four hundred and twenty locales, when the shop uses one. Swap in the twelve-hundred-pixel export of the photo, and the English-only build of the library. From one thousand one hundred and forty kilobytes to fifty-nine. The customer sees the same page.

**0:44 Render-blocking scripts.** There's a second problem in the HTML. A plain script tag in the head stops the page from rendering until the script has downloaded and run. Add defer, and use the English-only file. The browser renders first, and runs the scripts afterwards, in order. Then point the image at the smaller export, with its width and height.

**1:08 Check again.** Run the budget again. Fifty-nine kilobytes, every budget met, and nothing changed for the customer.

## レッスン本文

Lesson 2.1's budget check found the storefront at 1,140 KB against a 350 KB budget. A budget failure tells you **that** something is too big. Weighing the files tells you **what**.

> **概念アニメーション: Where the page weight goes**
>
> 1. Every file the storefront loads, drawn to scale by size. 1,140 KB against a 350 KB budget.
> 2. Two files are nearly all of it: a hero photo saved at 2400 pixels and quality 97, and a date library bundling 420 locales when the shop uses one.
> 3. Swap in the 1200-pixel export and the English-only locale file.
> 4. From 1,140 KB to 59 KB. The customer sees the same page.

## Ask two questions of every heavy file

**Is all of it needed?** `datefmt-all-locales.js` formats dates in 420 locales. The page calls it once, in `en-US`. The same library ships a single-locale build, `datefmt-en.js`, at 1.5 KB instead of 600 KB. This is the most common weight problem on the web: a whole library, or every locale, icon or polyfill, shipped for one use.

**Is it the right size?** `hero.jpg` is 2400 × 1200 pixels at JPEG quality 97, saved straight from a camera or design tool. The page displays it at most 1200 pixels wide. An export at the display size and quality 72, `hero-1200.jpg`, is 58 KB instead of 1 MB, and looks the same on screen.

## Render-blocking scripts

Weight isn't the only static warning in the HTML. Look at the head:

```html
<script src="/vendor/datefmt-all-locales.js"></script>
<script src="/app.js"></script>
```

A plain `<script>` tag in `<head>` stops the browser from rendering anything until the script has downloaded and run. With a 600 KB script on a phone connection, that's seconds of blank screen. Chapter 3 measures exactly how many.

Add `defer` and the browser downloads the scripts in parallel, renders the page, then runs them in order. `app.js` already waits for `DOMContentLoaded`, so nothing else has to change.

```html
<script src="/vendor/datefmt-en.js" defer></script>
<script src="/app.js" defer></script>
```

> **Width and height on images.** Give images `width` and `height` attributes. The browser can then reserve the space before the image arrives, so the text below it doesn't jump (that jump is measured as Cumulative Layout Shift). `fetchpriority="high"` on the main image tells the browser to fetch it early.

## Hands-on: Bring the storefront under budget

**ハンズオン · 15 分.** 目標： Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

1. Edit `public/index.html`. Leave `public/before.html` alone; it's a frozen copy for comparisons in chapter 3.

   ```diff
   - <script src="/vendor/datefmt-all-locales.js"></script>
   - <script src="/app.js"></script>
   + <script src="/vendor/datefmt-en.js" defer></script>
   + <script src="/app.js" defer></script>
   ...
   - <img src="/hero.jpg" alt="Shelves of books in warm light">
   + <img src="/hero-1200.jpg" width="1200" height="600" fetchpriority="high" alt="Shelves of books in warm light">
   ```

2. Run the budget check again.

   ```text
   budget      actual   limit   result
   script         0.9      50   pass
   stylesheet     0.5      20   pass
   image         57.6     250   pass
   total         59.0     350   pass

   All budgets met.
   ```

![Terminal showing the budget table after the fix: script 0.9 KB, stylesheet 0.5 KB, image 57.6 KB and total 59.0 KB, all marked pass, followed by 'All budgets met.'](screenshot-pending)
*Screenshot (npm run budget): From 1,140 KB to 59 KB.*

3. Open the storefront and check nothing changed for the customer: the photo, the "Updated" date line and the book grid should all be there.

![The Larkspur storefront after the fix. It looks the same as before: the bookshelf photo with the heading, an 'Updated' line with today's date, and the grid of new arrivals.](screenshot-pending)
*Screenshot (localhost:3000): Same page, a twentieth of the weight.*

**完了の条件**
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

**エージェントの担当：実装を任せる**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.4, "Asset weight".

Exercise: Bring the storefront under budget
Goal: Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run budget` and note the failing budgets.
2. In `public/index.html` only (leave `public/before.html` untouched), replace `/vendor/datefmt-all-locales.js` with `/vendor/datefmt-en.js`; the page only formats dates in en-US.
3. Add `defer` to both script tags so they no longer block rendering. `app.js` already waits for DOMContentLoaded, and deferred scripts run in order.
4. Replace `/hero.jpg` with `/hero-1200.jpg` and add `width="1200" height="600"` and `fetchpriority="high"` to the img tag.
5. Run `npm run budget` again.
6. Start the app and load http://localhost:3000/ in a browser or with Playwright if available, and confirm the 'Updated <date>' line and the book grid still render. If no browser is available, say so.

Done when:
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

Report back:
- The budget output before and after
- The diff of public/index.html
- How you confirmed the page still renders correctly

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/4-asset-weight.mdx
```

## 要点

- Weigh what the page actually loads. A few files are usually most of the weight.
- Ask of each heavy file: is all of it needed, and is it needed now? Libraries often bundle far more than you use.
- A plain <script> in <head> blocks rendering until it downloads and runs. Use defer, or move it.
- Serve images at the size they're displayed, compressed sensibly, and give them width and height.

---

前へ: [レッスン 2.3: クエリプランを読む](/demo/ja/performance-testing/static/query-plans.md)
次へ: [第 2 章 · まとめ: 静的テスト：まとめ](/demo/ja/performance-testing/static/summary.md)
