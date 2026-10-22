import { el, set, fade, span, lerp, rng, fmt, pill, type SceneDef } from "./kit";

/* ---------------------------------------------------------------------------
   Percentiles: 400 requests fall into a latency histogram; p50/p95/p99 and the
   misleading average are marked.
   --------------------------------------------------------------------------- */

// Log-normal sample around a 95 ms median, the shape real latency usually has.
const sample = (() => {
  const r = rng(11);
  const out: number[] = [];
  for (let i = 0; i < 400; i++) {
    const z = Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
    out.push(Math.exp(Math.log(95) + 0.72 * z));
  }
  return out;
})();
const sorted = [...sample].sort((a, b) => a - b);
const pct = (q: number) => sorted[Math.floor((q / 100) * sorted.length)];
const P50 = Math.round(pct(50)), P95 = Math.round(pct(95)), P99 = Math.round(pct(99));
const AVG = Math.round(sample.reduce((a, b) => a + b, 0) / sample.length);

export const percentiles: SceneDef = {
  title: "Latency is a distribution",
  steps: [
    "Every request takes a different amount of time. Here are 400 requests to the same endpoint.",
    "Stacked by duration, they form a hump with a long tail to the right.",
    `The median, p50, is the typical request: ${P50} ms. Half are faster, half are slower.`,
    `p95 and p99 describe the tail: ${P95} ms and ${P99} ms. One user in twenty waits at least ${P95} ms.`,
    `The average, ${AVG} ms, describes no real request and hides the tail. Budgets and thresholds use percentiles.`,
  ],
  build(svg) {
    const X0 = 50, X1 = 700, BASE = 300, MAX = 800, BIN = 20;
    const bins = MAX / BIN;
    const x = (ms: number) => X0 + (Math.min(ms, MAX - 1) / MAX) * (X1 - X0);
    const bw = (X1 - X0) / bins;
    const counts = new Array(bins).fill(0);
    const stackIndex = sample.map((ms) => counts[Math.floor(Math.min(ms, MAX - 1) / BIN)]++);
    const h = Math.min(6, 230 / Math.max(...counts));

    el(svg, "line", { x1: X0, x2: X1, y1: BASE + 0.5, y2: BASE + 0.5, class: "sc-axis" });
    for (let ms = 0; ms <= MAX; ms += 100) {
      el(svg, "line", { x1: x(ms), x2: x(ms), y1: BASE, y2: BASE + 5, class: "sc-axis" });
      el(svg, "text", { x: x(ms), y: BASE + 20, "text-anchor": "middle", class: "sc-tick" }, ms === MAX ? "800+ ms" : String(ms));
    }
    el(svg, "text", { x: X0, y: 24, class: "sc-cap" }, "REQUESTS BY DURATION");

    const tail = el(svg, "rect", { x: x(P95), y: 40, width: X1 - x(P95), height: BASE - 40, class: "sc-zone-bad" });
    const tailLabel = el(svg, "text", { x: X1 - 6, y: 56, "text-anchor": "end", class: "sc-note-bad" }, "the slowest 5%");

    const dots = sample.map((ms, i) => {
      const b = Math.floor(Math.min(ms, MAX - 1) / BIN);
      const node = el(svg, "rect", { x: X0 + b * bw + 1.5, width: bw - 3, height: h - 1, rx: 1, class: "sc-dot" });
      return { node, ty: BASE - (stackIndex[i] + 1) * h, delay: (i / sample.length) * 0.78 };
    });

    const marker = (ms: number, label: string, cls: string, y: number) => {
      const g = el(svg, "g");
      el(g, "line", { x1: x(ms), x2: x(ms), y1: y + 10, y2: BASE, class: cls + "-s", "stroke-width": 2 });
      pill(g, x(ms), y, label, cls + "-pill");
      return g;
    };
    const m50 = marker(P50, `p50 ${P50} ms`, "sc-acc", 70);
    const m95 = marker(P95, `p95 ${P95} ms`, "sc-bad", 70);
    const m99 = marker(P99, `p99 ${P99} ms`, "sc-bad", 104);
    const avg = el(svg, "g");
    el(avg, "line", { x1: x(AVG), x2: x(AVG), y1: 150, y2: BASE, class: "sc-warn-s", "stroke-width": 2, "stroke-dasharray": "5 4" });
    pill(avg, x(AVG) + 6, 140, `average ${AVG} ms`, "sc-warn-pill", "start");

    return (p) => {
      for (const d of dots) {
        const t = span(p, d.delay, d.delay + 0.22);
        set(d.node, { y: lerp(20, d.ty, t).toFixed(1) });
        fade(d.node, Math.min(1, t * 3));
      }
      const tailOn = span(p, 1.2, 1.6) * (1 - span(p, 2, 2.3)) + span(p, 3, 3.3);
      fade(tail, tailOn * 0.9);
      fade(tailLabel, span(p, 1.2, 1.6) * (1 - span(p, 2, 2.3)));
      fade(m50, span(p, 2, 2.3));
      fade(m95, span(p, 3, 3.3));
      fade(m99, span(p, 3.3, 3.6));
      fade(avg, span(p, 4, 4.3));
    };
  },
};

/* ---------------------------------------------------------------------------
   Static vs dynamic: a magnifier reads artifacts; then traffic runs through a
   live system and produces measurements.
   --------------------------------------------------------------------------- */

export const staticVsDynamic: SceneDef = {
  title: "Two ways to test performance",
  steps: [
    "Static testing reads what you built: code, queries, assets and budgets.",
    "Nothing runs, so it takes seconds and fits in every pull request. It finds likely problems.",
    "Dynamic testing runs the system and sends it traffic.",
    "It measures what users actually feel: response time, throughput and errors.",
  ],
  build(svg) {
    // Left: static
    const left = el(svg, "g");
    el(left, "rect", { x: 10, y: 10, width: 340, height: 340, rx: 14, class: "sc-panel" });
    el(left, "text", { x: 30, y: 40, class: "sc-cap" }, "STATIC · INSPECT");
    const cards = [
      { x: 30, y: 60, title: "books.mjs", lines: ["for (book of books)", "  query(…).get()"], flag: "N+1" },
      { x: 190, y: 60, title: "orders query", lines: ["WHERE email = ?", "SCAN orders"], flag: "scan" },
      { x: 30, y: 170, title: "index.html", lines: ["all-locales.js", "96 KB gzipped"], flag: "heavy" },
      { x: 190, y: 170, title: "budget.json", lines: ["script ≤ 50 KB", "image ≤ 250 KB"], flag: "fails" },
    ].map((c) => {
      const g = el(left, "g");
      const box = el(g, "rect", { x: c.x, y: c.y, width: 140, height: 92, rx: 8, class: "sc-card" });
      el(g, "text", { x: c.x + 12, y: c.y + 22, class: "sc-mono sc-ink sc-b" }, c.title);
      c.lines.forEach((l, i) => el(g, "text", { x: c.x + 12, y: c.y + 46 + i * 17, class: "sc-mono sc-small sc-muted" }, l));
      const flag = pill(g, c.x + 124, c.y, c.flag, "sc-bad-pill", "end");
      return { ...c, box, flag };
    });
    const lens = el(left, "g", { class: "sc-lens" });
    el(lens, "circle", { cx: 0, cy: 0, r: 30 });
    el(lens, "line", { x1: 21, y1: 21, x2: 42, y2: 42 });
    const quick = pill(left, 180, 300, "seconds · no server · every PR", "sc-acc-pill");

    // Right: dynamic
    const right = el(svg, "g");
    el(right, "rect", { x: 370, y: 10, width: 340, height: 340, rx: 14, class: "sc-panel" });
    el(right, "text", { x: 390, y: 40, class: "sc-cap" }, "DYNAMIC · RUN AND MEASURE");
    const users = [90, 150, 210].map((y) => {
      const g = el(right, "g");
      el(g, "circle", { cx: 410, cy: y - 8, r: 8, class: "sc-user" });
      el(g, "path", { d: `M 396 ${y + 14} q 14 -16 28 0`, class: "sc-user" });
      return y;
    });
    el(right, "rect", { x: 570, y: 96, width: 110, height: 104, rx: 10, class: "sc-card" });
    el(right, "text", { x: 625, y: 130, "text-anchor": "middle", class: "sc-ink sc-b" }, "Larkspur");
    el(right, "text", { x: 625, y: 150, "text-anchor": "middle", class: "sc-small sc-muted" }, "Node · SQLite");
    const dbg = el(right, "g");
    el(dbg, "ellipse", { cx: 625, cy: 176, rx: 22, ry: 6, class: "sc-dbtop" });
    const dots = Array.from({ length: 9 }, (_, i) => ({ node: el(right, "circle", { r: 4.5, class: "sc-req" }), lane: i % 3, phase: i / 9 }));
    const readouts = el(right, "g");
    pill(readouts, 450, 262, "p95 1,320 ms", "sc-bad-pill");
    pill(readouts, 560, 262, "16 req/s", "sc-acc-pill");
    pill(readouts, 650, 262, "0% errors", "sc-good-pill");
    el(readouts, "text", { x: 540, y: 310, "text-anchor": "middle", class: "sc-small sc-muted" }, "/api/books with 10 users");

    return (p) => {
      // Lens visits each card during step 0, then rests.
      const k = Math.min(3, Math.max(0, (p - 0.05) * 4.2));
      const i = Math.floor(k), f = span(k - i, 0.15, 0.85);
      const a = cards[i], b = cards[Math.min(3, i + 1)];
      const lx = lerp(a.x + 70, b.x + 70, i < 3 ? f : 0), ly = lerp(a.y + 50, b.y + 50, i < 3 ? f : 0);
      set(lens, { transform: `translate(${lx} ${ly})` });
      fade(lens, 1 - span(p, 1.6, 2));
      cards.forEach((c, ci) => {
        const seen = (p - 0.05) * 4.2 >= ci + 0.6;
        c.box.classList.toggle("sc-card-hot", seen && p < 2);
        fade(c.flag, seen ? 1 : 0);
      });
      fade(quick, span(p, 1, 1.3));
      fade(left, 1 - 0.55 * span(p, 2, 2.3));
      fade(right, 0.35 + 0.65 * span(p, 1.8, 2.1));
      const flowing = p >= 2;
      for (const d of dots) {
        const t = flowing ? (p * 1.6 + d.phase) % 1 : 0;
        const y = users[d.lane];
        const out = t < 0.5;
        const u = out ? t / 0.5 : (t - 0.5) / 0.5;
        set(d.node, { cx: out ? lerp(428, 566, u) : lerp(566, 428, u), cy: lerp(y, 148, out ? u : 1 - u) });
        d.node.classList.toggle("sc-req-back", !out);
        fade(d.node, flowing ? 1 : 0);
      }
      fade(readouts, span(p, 3, 3.3));
    };
  },
};
