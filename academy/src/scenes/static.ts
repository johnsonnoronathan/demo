import { el, set, fade, span, lerp, rng, fmt, pill, type SceneDef } from "./kit";

/* ---------------------------------------------------------------------------
   Budgets: limits first, then measurements, then pass/fail.
   Numbers are the real output of `npm run budget` on the practice app.
   --------------------------------------------------------------------------- */

export const budgets: SceneDef = {
  title: "A budget turns “fast enough” into pass or fail",
  steps: [
    "A budget is a limit the team agrees on before measuring: 50 KB of script, 250 KB of images, 350 KB in total.",
    "Then measure the current build against each limit.",
    "Anything over its line fails. Larkspur is over on scripts, images and total weight.",
    "A failed budget is a clear signal. It can block a pull request instead of starting a debate.",
  ],
  build(svg) {
    const rows = [
      { label: "Scripts", unit: "KB gz", actual: 96.2, limit: 50 },
      { label: "Stylesheets", unit: "KB gz", actual: 0.5, limit: 20 },
      { label: "Images", unit: "KB", actual: 1043.1, limit: 250 },
      { label: "Total", unit: "KB", actual: 1139.8, limit: 350 },
    ];
    const X0 = 170, X1 = 610;
    el(svg, "text", { x: 30, y: 30, class: "sc-cap" }, "LARKSPUR STOREFRONT · npm run budget");
    const drawn = rows.map((r, i) => {
      const y = 70 + i * 66;
      const scale = (v: number) => X0 + (v / (Math.max(r.actual, r.limit) * 1.08)) * (X1 - X0);
      el(svg, "text", { x: 30, y: y + 20, class: "sc-ink sc-b" }, r.label);
      el(svg, "rect", { x: X0, y: y + 4, width: X1 - X0, height: 24, rx: 5, class: "sc-track" });
      const bar = el(svg, "rect", { x: X0, y: y + 4, width: 0, height: 24, rx: 5, class: "sc-bar" });
      const lx = scale(r.limit);
      const limit = el(svg, "g");
      el(limit, "line", { x1: lx, x2: lx, y1: y - 6, y2: y + 38, class: "sc-limit" });
      el(limit, "text", { x: lx, y: y - 10, "text-anchor": "middle", class: "sc-small sc-muted" }, `limit ${r.limit}`);
      const val = el(svg, "text", { x: X1 + 12, y: y + 21, class: "sc-mono sc-ink" });
      return { ...r, bar, limit, val, w: scale(r.actual) - X0, over: r.actual > r.limit };
    });
    const verdict = pill(svg, 360, 345, "3 of 4 budgets exceeded · exit code 1", "sc-bad-pill");

    return (p) => {
      drawn.forEach((r, i) => {
        fade(r.limit, span(p, i * 0.15, i * 0.15 + 0.4));
        const g = span(p, 1 + i * 0.15, 1.6 + i * 0.15);
        set(r.bar, { width: (r.w * g).toFixed(1) });
        r.val.textContent = g > 0 ? `${fmt(r.actual * g, 1)} ${r.unit}` : "";
        const judged = p >= 2 + i * 0.1;
        r.bar.classList.toggle("sc-bar-bad", judged && r.over);
        r.bar.classList.toggle("sc-bar-good", judged && !r.over);
      });
      fade(verdict, span(p, 3, 3.3));
    };
  },
  height: 370,
};

/* ---------------------------------------------------------------------------
   N+1: a waterfall of 101 queries, then the same data in one.
   --------------------------------------------------------------------------- */

export const nPlusOne: SceneDef = {
  title: "The N+1 query pattern",
  steps: [
    "The books endpoint asks the database for one page of 50 books. One query.",
    "Then it loops over the books and asks for each one's author and rating: two more queries per book.",
    "That's 101 round trips for one page. Each is small; together they're most of the response time.",
    "One query with JOINs fetches the same data in a single trip.",
  ],
  build(svg) {
    el(svg, "text", { x: 20, y: 28, class: "sc-cap" }, "GET /api/books · BEFORE");
    el(svg, "line", { x1: 20, x2: 700, y1: 236, y2: 236, class: "sc-axis" });
    el(svg, "text", { x: 700, y: 252, "text-anchor": "end", class: "sc-tick" }, "time →");
    const first = el(svg, "g");
    el(first, "rect", { x: 20, y: 44, width: 64, height: 12, rx: 3, class: "sc-acc" });
    el(first, "text", { x: 92, y: 54, class: "sc-mono sc-small sc-ink" }, "SELECT … FROM books LIMIT 50");
    const bars = Array.from({ length: 100 }, (_, i) => {
      const x = 86 + i * 6.1;
      return el(svg, "rect", { x, y: 62 + i * 1.66, width: 5.2, height: 3, rx: 1, class: i % 2 ? "sc-warn" : "sc-acc2" });
    });
    const legend = el(svg, "g");
    el(legend, "rect", { x: 380, y: 92, width: 10, height: 10, rx: 2, class: "sc-acc2" });
    el(legend, "text", { x: 396, y: 101, class: "sc-small sc-ink sc-mono" }, "SELECT name FROM authors WHERE id = ?");
    el(legend, "rect", { x: 380, y: 112, width: 10, height: 10, rx: 2, class: "sc-warn" });
    el(legend, "text", { x: 396, y: 121, class: "sc-small sc-ink sc-mono" }, "SELECT avg(stars) … WHERE book_id = ?");
    el(legend, "text", { x: 396, y: 141, class: "sc-small sc-muted" }, "× 50 books");
    const counter = el(svg, "text", { x: 700, y: 30, "text-anchor": "end", class: "sc-mono sc-ink sc-b" });
    const brace = el(svg, "g");
    el(brace, "path", { d: "M 86 230 v 6 h 610 v -6", class: "sc-bad-s", fill: "none", "stroke-width": 2 });
    pill(brace, 390, 214, "101 queries · 59 ms for one page, at rest", "sc-bad-pill");

    const after = el(svg, "g");
    el(after, "text", { x: 20, y: 290, class: "sc-cap" }, "AFTER · ONE QUERY");
    el(after, "rect", { x: 20, y: 302, width: 70, height: 14, rx: 3, class: "sc-good" });
    el(after, "text", { x: 98, y: 313, class: "sc-mono sc-small sc-ink" }, "SELECT … FROM books JOIN authors LEFT JOIN reviews … GROUP BY b.id");
    pill(after, 20, 340, "1 query", "sc-good-pill", "start");

    return (p) => {
      fade(first, span(p, 0, 0.3));
      const shown = Math.round(100 * Math.max(0, Math.min(1, (p - 1) / 0.85)));
      bars.forEach((b, i) => fade(b, i < shown ? 1 : 0));
      fade(legend, span(p, 1, 1.25));
      counter.textContent = p < 0.1 ? "" : `${1 + shown} ${shown ? "queries" : "query"}`;
      fade(brace, span(p, 2, 2.3));
      fade(after, span(p, 3, 3.3));
    };
  },
  height: 360,
};

/* ---------------------------------------------------------------------------
   Query plan: a full scan of 200,000 rows vs a walk down a B-tree index.
   --------------------------------------------------------------------------- */

export const queryPlan: SceneDef = {
  title: "SCAN versus SEARCH",
  steps: [
    "To find one customer's orders without an index, SQLite has to read every row of the orders table: 200,000 of them.",
    "That's what SCAN orders means in a query plan. It gets slower as the table grows.",
    "An index keeps the emails sorted, like the index at the back of a book. SQLite walks down a few levels to the right entry.",
    "SEARCH orders USING INDEX: a handful of page reads instead of 200,000 rows, and it barely grows with the table.",
  ],
  build(svg) {
    const COLS = 24, ROWS = 16, CW = 13, CH = 13, GX = 20, GY = 50;
    el(svg, "text", { x: GX, y: 32, class: "sc-cap" }, "orders · 200,000 ROWS (EACH CELL ≈ 520)");
    const r = rng(5);
    const matches = new Set([57, 203, 318]);
    const cells = Array.from({ length: COLS * ROWS }, (_, i) =>
      el(svg, "rect", { x: GX + (i % COLS) * CW, y: GY + Math.floor(i / COLS) * CH, width: CW - 2, height: CH - 2, rx: 2, class: "sc-cell", "data-n": r() })
    );
    const counter = el(svg, "text", { x: GX, y: GY + ROWS * CH + 22, class: "sc-mono sc-ink" });
    const scan = el(svg, "g");
    el(scan, "rect", { x: GX, y: 290, width: 312, height: 44, rx: 8, class: "sc-codebox" });
    el(scan, "text", { x: GX + 14, y: 317, class: "sc-mono sc-ink" }, "SCAN orders");
    el(scan, "text", { x: GX + 120, y: 317, class: "sc-mono sc-small sc-bad-t" }, "← full table scan");

    // B-tree on the right
    const tree = el(svg, "g");
    el(tree, "text", { x: 380, y: 32, class: "sc-cap" }, "INDEX idx_orders_email");
    const edgeLayer = el(tree, "g"); // drawn first so edges sit behind the nodes
    const node = (x: number, y: number, w: number, label: string) => {
      const g = el(tree, "g");
      const rect = el(g, "rect", { x: x - w / 2, y, width: w, height: 30, rx: 6, class: "sc-node" });
      el(g, "text", { x, y: y + 19, "text-anchor": "middle", class: "sc-mono sc-small sc-ink" }, label);
      return rect;
    };
    const root = node(540, 56, 150, "a… | m… | t…");
    const mids = [[425, "a… f…"], [540, "m… r…"], [655, "t… z…"]].map(([x, l]) => node(x as number, 130, 96, l as string));
    const leaves = [[388, "reader1…"], [462, "reader3…"], [540, "reader42…"], [618, "reader8…"], [692, "reader9…"]].map(([x, l]) =>
      node(x as number, 204, 72, l as string)
    );
    const edges = [
      [540, 86, 425, 130], [540, 86, 540, 130], [540, 86, 655, 130],
      [540, 160, 388, 204], [540, 160, 462, 204], [540, 160, 540, 204], [540, 160, 618, 204], [540, 160, 692, 204],
    ].map(([x1, y1, x2, y2]) => el(edgeLayer, "line", { x1, y1, x2, y2, class: "sc-edge" }));
    const hit = el(tree, "g");
    el(hit, "text", { x: 540, y: 262, "text-anchor": "middle", class: "sc-small sc-ink" }, "reader42@larkspur.test → 13 orders, already sorted by date");
    const search = el(svg, "g");
    el(search, "rect", { x: 380, y: 290, width: 330, height: 44, rx: 8, class: "sc-codebox" });
    el(search, "text", { x: 394, y: 317, class: "sc-mono sc-small sc-ink" }, "SEARCH orders USING INDEX idx_orders_email");

    return (p) => {
      const read = Math.max(0, Math.min(1, p / 0.9));
      const n = Math.round(read * cells.length);
      cells.forEach((c, i) => {
        c.classList.toggle("sc-cell-read", i < n);
        c.classList.toggle("sc-cell-hit", i < n && matches.has(i));
        c.classList.toggle("sc-cell-now", i === n - 1 && read < 1);
      });
      counter.textContent = p < 0.02 ? "" : `rows read: ${fmt(Math.round(read * 200000))}`;
      fade(scan, span(p, 1, 1.3));
      fade(tree, 0.25 + 0.75 * span(p, 1.9, 2.2));
      const step = Math.max(0, (p - 2.1) / 0.8);
      root.classList.toggle("sc-node-hot", step > 0);
      mids.forEach((m, i) => m.classList.toggle("sc-node-hot", i === 1 && step > 0.35));
      leaves.forEach((l, i) => l.classList.toggle("sc-node-hot", i === 2 && step > 0.7));
      edges.forEach((e, i) => e.classList.toggle("sc-edge-hot", (i === 1 && step > 0.35) || (i === 5 && step > 0.7)));
      fade(hit, span(p, 2.8, 3));
      fade(search, span(p, 3, 3.3));
    };
  },
  height: 350,
};

/* ---------------------------------------------------------------------------
   Asset weight: a treemap of what the page downloads, before and after.
   --------------------------------------------------------------------------- */

export const assetTreemap: SceneDef = {
  title: "Where the page weight goes",
  steps: [
    "Every file the storefront loads, drawn to scale by size. 1,140 KB against a 350 KB budget.",
    "Two files are nearly all of it: a hero photo saved at 2400 pixels and quality 97, and a date library bundling 420 locales when the shop uses one.",
    "Swap in the 1200-pixel export and the English-only locale file.",
    "From 1,140 KB to 59 KB. The customer sees the same page.",
  ],
  build(svg) {
    const before = { hero: 1043.1, lib: 95.9, rest: 0.8 };
    const after = { hero: 57.6, lib: 0.6, rest: 0.8 };
    const MAXW = 470, MAXH = 290, X = 20, Y = 40;
    const area0 = before.hero + before.lib + before.rest;
    el(svg, "text", { x: X, y: 26, class: "sc-cap" }, "STOREFRONT ASSETS, AREA = BYTES");
    const budgetSide = Math.sqrt(350 / area0);
    const budget = el(svg, "rect", { x: X, y: Y, width: MAXW * budgetSide, height: MAXH * budgetSide, class: "sc-budget-box" });
    const budgetLabel = el(svg, "text", { x: X + MAXW * budgetSide - 6, y: Y + MAXH * budgetSide - 8, "text-anchor": "end", class: "sc-small sc-muted" }, "350 KB budget");
    const hero = el(svg, "rect", { rx: 4, class: "sc-tm-a" });
    const lib = el(svg, "rect", { rx: 4, class: "sc-tm-b" });
    const rest = el(svg, "rect", { rx: 2, class: "sc-tm-c" });
    const heroT = el(svg, "text", { class: "sc-mono sc-small sc-on" }, "hero.jpg");
    const libT = el(svg, "text", { class: "sc-mono sc-small sc-on" }, "datefmt");

    const lx = 520;
    const legendRows = [
      { name: "hero.jpg → hero-1200.jpg", key: "hero" as const, cls: "sc-tm-a" },
      { name: "datefmt, all locales → en", key: "lib" as const, cls: "sc-tm-b" },
      { name: "app.js + styles.css", key: "rest" as const, cls: "sc-tm-c" },
    ].map((r, i) => {
      const y = 70 + i * 62;
      el(svg, "rect", { x: lx, y: y - 11, width: 12, height: 12, rx: 2, class: r.cls });
      const nameT = el(svg, "text", { x: lx + 20, y, class: "sc-small sc-ink" });
      const val = el(svg, "text", { x: lx + 20, y: y + 20, class: "sc-mono sc-ink sc-b" });
      return { ...r, nameT, val };
    });
    const total = el(svg, "text", { x: lx, y: 290, class: "sc-mono sc-big sc-ink" });
    const totalCap = el(svg, "text", { x: lx, y: 312, class: "sc-small sc-muted" }, "total, budget 350 KB");

    return (p) => {
      const k = span(p, 2.1, 2.9);
      const v = { hero: lerp(before.hero, after.hero, k), lib: lerp(before.lib, after.lib, k), rest: before.rest };
      const sum = v.hero + v.lib + v.rest;
      const side = Math.sqrt(sum / area0);
      const w = MAXW * side, h = MAXH * side;
      const grow = span(p, 0, 0.5);
      const hw = (w * v.hero) / sum;
      set(hero, { x: X, y: Y, width: Math.max(0, hw - 2) * grow, height: h * grow });
      const restH = Math.max(3, (h * v.rest) / (v.lib + v.rest));
      set(lib, { x: X + hw, y: Y, width: Math.max(0, w - hw) * grow, height: Math.max(0, h - restH - 2) * grow });
      set(rest, { x: X + hw, y: Y + h - restH, width: Math.max(0, w - hw) * grow, height: restH * grow });
      set(heroT, { x: X + 10, y: Y + 22 });
      set(libT, { x: X + hw + 8, y: Y + 22 });
      fade(heroT, grow * (hw > 70 ? 1 : 0));
      fade(libT, grow * (w - hw > 60 ? 1 : 0));
      hero.classList.toggle("sc-tm-flag", p >= 1 && p < 2.2);
      lib.classList.toggle("sc-tm-flag", p >= 1.3 && p < 2.2);
      fade(budget, span(p, 0.4, 0.8));
      fade(budgetLabel, span(p, 0.4, 0.8));
      legendRows.forEach((r) => {
        r.nameT.textContent = r.name;
        r.val.textContent = `${fmt(v[r.key], 1)} KB`;
      });
      total.textContent = `${fmt(sum)} KB`;
      total.classList.toggle("sc-bad-t", sum > 350);
      total.classList.toggle("sc-good-t", sum <= 350);
      fade(totalCap, 1);
    };
  },
  height: 350,
};
