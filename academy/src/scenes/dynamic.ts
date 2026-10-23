import { el, set, fade, span, lerp, fmt, pill, type SceneDef } from "./kit";

/* ---------------------------------------------------------------------------
   Filmstrip: what Lighthouse sees while the page loads, before and after.
   Numbers are from real Lighthouse 12 runs (mobile profile) on the practice app.
   --------------------------------------------------------------------------- */

export const filmstrip: SceneDef = {
  title: "Watching a page load",
  steps: [
    "Lighthouse loads the page on a simulated mid-range phone with a slow connection, and films it.",
    "First Contentful Paint at 4.3 s: the first text appears. Until then the screen is blank, because a 600 KB script blocks rendering.",
    "Largest Contentful Paint at 9.8 s: the 1 MB hero photo finally shows. Performance score: 64.",
    "After the asset fixes, FCP is 0.8 s and LCP is 1.5 s. Score: 100.",
  ],
  build(svg) {
    const X0 = 70, X1 = 700, T = 10.5;
    const x = (s: number) => X0 + (s / T) * (X1 - X0);
    const frames = [0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10];
    const strip = (y: number, fcp: number, lcp: number, label: string) => {
      const g = el(svg, "g");
      el(g, "text", { x: 20, y: y - 10, class: "sc-cap" }, label);
      const cells = frames.map((t) => {
        const fx = x(t) - 26;
        const f = el(g, "g");
        el(f, "rect", { x: fx, y, width: 52, height: 92, rx: 5, class: "sc-phone" });
        const head = el(f, "rect", { x: fx + 5, y: y + 6, width: 42, height: 6, rx: 2, class: "sc-skel" });
        const img = el(f, "rect", { x: fx + 5, y: y + 16, width: 42, height: 30, rx: 2, class: "sc-photo" });
        const text = el(f, "g");
        [52, 60, 68, 76].forEach((ly, i) => el(text, "rect", { x: fx + 5, y: y + ly, width: i % 2 ? 30 : 42, height: 4, rx: 2, class: "sc-skel" }));
        fade(head, t >= fcp ? 1 : 0);
        fade(text, t >= fcp ? 1 : 0);
        fade(img, t >= lcp ? 1 : 0);
        return f;
      });
      return { g, cells };
    };
    el(svg, "line", { x1: X0 - 30, x2: X1, y1: 318, y2: 318, class: "sc-axis" });
    for (let s = 0; s <= 10; s += 2) el(svg, "text", { x: x(s), y: 336, "text-anchor": "middle", class: "sc-tick" }, `${s} s`);

    const before = strip(46, 4.3, 9.8, "BEFORE");
    const after = strip(196, 0.8, 1.5, "AFTER");
    const mark = (s: number, y1: number, y2: number, label: string, cls: string, anchor: "start" | "middle" | "end" = "middle") => {
      const g = el(svg, "g");
      el(g, "line", { x1: x(s), x2: x(s), y1, y2, class: cls + "-s", "stroke-width": 2 });
      pill(g, x(s) + (anchor === "start" ? -6 : anchor === "end" ? 6 : 0), y1 - 4, label, cls + "-pill", anchor);
      return g;
    };
    const fcp = mark(4.3, 34, 146, "FCP 4.3 s", "sc-warn");
    const lcp = mark(9.8, 34, 146, "LCP 9.8 s", "sc-bad", "end");
    const fcp2 = mark(0.8, 184, 296, "FCP 0.8 s", "sc-good", "end");
    const lcp2 = mark(1.5, 184, 296, "LCP 1.5 s", "sc-good", "start");
    const s1 = pill(svg, 90, 36, "score 64", "sc-bad-pill", "start");
    const s2 = pill(svg, 300, 186, "score 100", "sc-good-pill", "start");

    return (p) => {
      before.cells.forEach((c, i) => fade(c, span(p, i * 0.09, i * 0.09 + 0.2)));
      fade(fcp, span(p, 1, 1.3));
      fade(lcp, span(p, 2, 2.3));
      fade(s1, span(p, 2.4, 2.7));
      fade(after.g, span(p, 3, 3.2));
      after.cells.forEach((c, i) => fade(c, span(p, 3 + i * 0.05, 3.15 + i * 0.05)));
      fade(fcp2, span(p, 3.4, 3.6));
      fade(lcp2, span(p, 3.5, 3.7));
      fade(s2, span(p, 3.7, 3.9));
    };
  },
  height: 350,
};

/* ---------------------------------------------------------------------------
   Virtual users: the k6 loop, the ramp, the measured p95 against a threshold.
   --------------------------------------------------------------------------- */

export const virtualUsers: SceneDef = {
  title: "How a k6 load test works",
  steps: [
    "k6 starts virtual users. Each one runs your script in a loop: browse, think, check orders, think, open a book.",
    "Stages control how many run at once: ramp from 0 to 50 users in 30 seconds, hold for a minute, ramp down.",
    "k6 times every request and reports percentiles per endpoint. As users pile up, p95 for the books endpoint climbs.",
    "Thresholds turn the numbers into pass or fail. Books p95 is 1.17 s against a 300 ms limit, so the run fails.",
  ],
  build(svg) {
    // Left: VUs over time
    const L0 = 50, L1 = 330, B = 300, TOP = 70, DUR = 105;
    const lx = (s: number) => L0 + (s / DUR) * (L1 - L0);
    const ly = (v: number) => B - (v / 50) * (B - TOP);
    el(svg, "text", { x: 20, y: 30, class: "sc-cap" }, "VIRTUAL USERS");
    el(svg, "line", { x1: L0, x2: L1, y1: B, y2: B, class: "sc-axis" });
    el(svg, "line", { x1: L0, x2: L0, y1: TOP - 10, y2: B, class: "sc-axis" });
    [0, 25, 50].forEach((v) => el(svg, "text", { x: L0 - 8, y: ly(v) + 4, "text-anchor": "end", class: "sc-tick" }, String(v)));
    [0, 30, 90, 105].forEach((s) => el(svg, "text", { x: lx(s), y: B + 18, "text-anchor": "middle", class: "sc-tick" }, `${s}s`));
    const stages = [[0, 0], [30, 50], [90, 50], [105, 0]] as const;
    const vuPath = el(svg, "path", { d: "M " + stages.map(([s, v]) => `${lx(s)} ${ly(v)}`).join(" L "), class: "sc-acc-s sc-thick", fill: "none" });
    const vuLen = 600;
    vuPath.setAttribute("stroke-dasharray", String(vuLen));
    const stageLabels = el(svg, "g");
    el(stageLabels, "text", { x: lx(15), y: ly(25) - 14, "text-anchor": "end", class: "sc-small sc-muted" }, "ramp");
    el(stageLabels, "text", { x: lx(60), y: ly(50) - 10, "text-anchor": "middle", class: "sc-small sc-muted" }, "hold 50");

    // Right top: a virtual user's loop
    const loop = el(svg, "g");
    el(loop, "text", { x: 390, y: 30, class: "sc-cap" }, "ONE VIRTUAL USER");
    const steps = ["GET /api/books", "sleep 1s", "GET /api/orders", "sleep 1s", "GET /api/recs", "sleep 1s"];
    const cx = 545, cy = 175, R = 105;
    el(loop, "circle", { cx, cy, r: R, class: "sc-orbit" });
    const nodes = steps.map((label, i) => {
      const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + R * Math.cos(a), ny = cy + R * Math.sin(a);
      const g = el(loop, "g");
      const rect = el(g, "rect", { x: nx - 58, y: ny - 14, width: 116, height: 28, rx: 14, class: label.startsWith("GET") ? "sc-node" : "sc-node-quiet" });
      el(g, "text", { x: nx, y: ny + 4.5, "text-anchor": "middle", class: "sc-mono sc-small sc-ink" }, label);
      return { rect, a };
    });
    const runner = el(loop, "circle", { r: 7, class: "sc-acc" });

    // Right: p95 chart
    const chart = el(svg, "g");
    const R0 = 400, R1 = 700, RT = 60;
    const ry = (ms: number) => B - (Math.min(ms, 1400) / 1400) * (B - RT);
    const rx = (s: number) => R0 + (s / DUR) * (R1 - R0);
    el(chart, "text", { x: 390, y: 30, class: "sc-cap" }, "p95 · /api/books");
    el(chart, "line", { x1: R0, x2: R1, y1: B, y2: B, class: "sc-axis" });
    [0, 500, 1000].forEach((v) => el(chart, "text", { x: R0 - 8, y: ry(v) + 4, "text-anchor": "end", class: "sc-tick" }, `${v}`));
    el(chart, "line", { x1: R0, x2: R1, y1: ry(300), y2: ry(300), class: "sc-limit" });
    el(chart, "text", { x: R1, y: ry(300) - 6, "text-anchor": "end", class: "sc-small sc-muted" }, "threshold 300 ms");
    const pts: [number, number][] = [];
    for (let s = 0; s <= DUR; s += 3) {
      const vus = s < 30 ? (s / 30) * 50 : s < 90 ? 50 : 50 * (1 - (s - 90) / 15);
      pts.push([s, 90 + Math.pow(vus / 50, 1.6) * 1080 + Math.sin(s * 1.7) * 40 * (vus / 50)]);
    }
    const p95 = el(chart, "path", { d: "M " + pts.map(([s, ms]) => `${rx(s)} ${ry(ms)}`).join(" L "), class: "sc-bad-s sc-thick", fill: "none", "stroke-dasharray": "900" });
    const results = el(svg, "g");
    pill(results, 20, 334, "✗ books p(95)<300 · got 1.17 s", "sc-bad-pill", "start");
    pill(results, 268, 334, "✗ orders p(95)<200 · got 942 ms", "sc-bad-pill", "start");
    pill(results, 530, 334, "✓ failed rate<1% · 0.00%", "sc-good-pill", "start");

    return (p) => {
      const t = p * 0.9;
      const k = ((t % 1) + 1) % 1;
      const a = k * Math.PI * 2 - Math.PI / 2;
      set(runner, { cx: cx + R * Math.cos(a), cy: cy + R * Math.sin(a) });
      const active = Math.floor(k * steps.length);
      nodes.forEach((n, i) => n.rect.classList.toggle("sc-node-hot", i === active));
      fade(loop, 1 - span(p, 1.85, 2.1));
      fade(chart, span(p, 2, 2.3));
      vuPath.setAttribute("stroke-dashoffset", String(vuLen * (1 - Math.max(span(p, 1, 1.9), p >= 2 ? 1 : 0))));
      fade(stageLabels, span(p, 1.5, 1.8));
      p95.setAttribute("stroke-dashoffset", String(900 * (1 - span(p, 2.1, 2.95))));
      fade(results, span(p, 3, 3.3));
    };
  },
  height: 350,
};

/* ---------------------------------------------------------------------------
   Load shapes: load, stress, spike and soak profiles.
   --------------------------------------------------------------------------- */

export const loadShapes: SceneDef = {
  title: "Four shapes of load",
  steps: [
    "Load test: the traffic you expect on a busy day. Question: do we meet the budget?",
    "Stress test: keep adding users in steps. Question: where does it break, and how?",
    "Spike test: a sudden surge, like a newsletter going out. Question: do we survive it and recover?",
    "Soak test: ordinary load for hours. Question: does anything leak or drift over time?",
  ],
  build(svg) {
    const shapes: { title: string; q: string; pts: [number, number][] }[] = [
      { title: "Load", q: "Meet the budget?", pts: [[0, 0], [0.25, 0.55], [0.85, 0.55], [1, 0]] },
      { title: "Stress", q: "Where does it break?", pts: [[0, 0], [0.04, 0.15], [0.2, 0.15], [0.24, 0.32], [0.4, 0.32], [0.44, 0.5], [0.6, 0.5], [0.64, 0.72], [0.8, 0.72], [0.84, 0.95], [1, 0.95]] },
      { title: "Spike", q: "Survive and recover?", pts: [[0, 0.12], [0.3, 0.12], [0.36, 0.95], [0.6, 0.95], [0.66, 0.12], [1, 0.12]] },
      { title: "Soak", q: "Leak or drift?", pts: [[0, 0], [0.06, 0.4], [1, 0.4]] },
    ];
    const cells = shapes.map((s, i) => {
      const gx = 20 + (i % 2) * 350, gy = 14 + Math.floor(i / 2) * 170;
      const g = el(svg, "g");
      const bg = el(g, "rect", { x: gx, y: gy, width: 330, height: 156, rx: 12, class: "sc-panel" });
      el(g, "text", { x: gx + 18, y: gy + 30, class: "sc-ink sc-b sc-h" }, s.title);
      el(g, "text", { x: gx + 312, y: gy + 30, "text-anchor": "end", class: "sc-small sc-muted" }, s.q);
      const X0 = gx + 18, X1 = gx + 312, Y0 = gy + 138, Y1 = gy + 50;
      el(g, "line", { x1: X0, x2: X1, y1: Y0, y2: Y0, class: "sc-axis" });
      const d = "M " + s.pts.map(([px, py]) => `${lerp(X0, X1, px)} ${lerp(Y0, Y1, py)}`).join(" L ");
      el(g, "path", { d: d + ` L ${X1} ${Y0} L ${X0} ${Y0} Z`, class: "sc-area" });
      const line = el(g, "path", { d, class: "sc-acc-s sc-thick", fill: "none", "stroke-dasharray": "700" });
      el(g, "text", { x: X1, y: Y0 + 14, "text-anchor": "end", class: "sc-tick" }, i === 3 ? "hours →" : "minutes →");
      return { g, bg, line };
    });
    return (p) => {
      cells.forEach((c, i) => {
        const on = span(p, i, i + 0.7);
        c.line.setAttribute("stroke-dashoffset", String(700 * (1 - on)));
        fade(c.g, p >= i ? 1 : 0.35);
        c.bg.classList.toggle("sc-panel-hot", p >= i && p < i + 1);
      });
    };
  },
  height: 356,
};

/* ---------------------------------------------------------------------------
   Capacity knee: throughput flattens, p95 bends upward.
   Real measurements of /api/recommendations (after chapter 2's fixes) with the
   course's mini load tool.
   --------------------------------------------------------------------------- */

const KNEE = [
  { vus: 1, rps: 56.0, p95: 25 },
  { vus: 2, rps: 58.2, p95: 46 },
  { vus: 4, rps: 60.8, p95: 105 },
  { vus: 8, rps: 55.2, p95: 286 },
  { vus: 16, rps: 58.6, p95: 532 },
];

export const capacityKnee: SceneDef = {
  title: "Finding capacity",
  steps: [
    "Add users in steps and record throughput and p95 at each one. These are real measurements of the recommendations endpoint.",
    "Throughput is flat at about 58 requests per second from the first user. That's the ceiling: more users can't make it go faster.",
    "So extra users only wait in line. p95 climbs from 25 ms with one user to 532 ms with sixteen.",
    "The knee, where p95 crosses the 400 ms budget, is the practical capacity: somewhere between 8 and 16 users. Plan to stay well below it.",
  ],
  build(svg) {
    const X0 = 70, X1 = 650, B = 300, T = 50;
    const step = (X1 - X0) / KNEE.length;
    const cx = (i: number) => X0 + step * (i + 0.5);
    const yr = (rps: number) => B - (rps / 120) * (B - T);
    const yl = (ms: number) => B - (ms / 600) * (B - T);
    el(svg, "line", { x1: X0, x2: X1, y1: B, y2: B, class: "sc-axis" });
    el(svg, "text", { x: X0 - 10, y: T - 18, class: "sc-cap", "text-anchor": "start" }, "REQ/S (BARS) · p95 (LINE)");
    [0, 60, 120].forEach((v) => el(svg, "text", { x: X0 - 8, y: yr(v) + 4, "text-anchor": "end", class: "sc-tick" }, String(v)));
    [0, 200, 400, 600].forEach((v) => el(svg, "text", { x: X1 + 8, y: yl(v) + 4, class: "sc-tick" }, `${v} ms`));
    const safe = el(svg, "rect", { x: X0, y: T, width: cx(3) + step * 0.5 - X0, height: B - T, class: "sc-zone-good" });
    const safeLabel = el(svg, "text", { x: X0 + 8, y: T + 18, class: "sc-small sc-good-t" }, "within budget");
    const bars = KNEE.map((k, i) => {
      el(svg, "text", { x: cx(i), y: B + 18, "text-anchor": "middle", class: "sc-tick" }, `${k.vus} VU`);
      const r = el(svg, "rect", { x: cx(i) - 22, width: 44, rx: 4, class: "sc-bar-soft" });
      const t = el(svg, "text", { x: cx(i), y: B - 8, "text-anchor": "middle", class: "sc-small sc-mono sc-on" }, String(k.rps));
      return { r, t, k };
    });
    const ceiling = el(svg, "g");
    el(ceiling, "line", { x1: X0, x2: X1, y1: yr(58), y2: yr(58), class: "sc-limit" });
    el(ceiling, "text", { x: X1 - 4, y: yr(58) - 6, "text-anchor": "end", class: "sc-small sc-muted" }, "ceiling ≈ 58 req/s");
    const line = el(svg, "path", { d: "M " + KNEE.map((k, i) => `${cx(i)} ${yl(k.p95)}`).join(" L "), class: "sc-bad-s sc-thick", fill: "none", "stroke-dasharray": "900" });
    const dots = KNEE.map((k, i) => {
      const g = el(svg, "g");
      el(g, "circle", { cx: cx(i), cy: yl(k.p95), r: 5, class: "sc-bad" });
      el(g, "text", { x: cx(i) + (i === KNEE.length - 1 ? -10 : 8), y: yl(k.p95) - 9, "text-anchor": i === KNEE.length - 1 ? "end" : "start", class: "sc-small sc-mono sc-bad-t" }, `${fmt(k.p95)} ms`);
      return g;
    });
    const budget = el(svg, "g");
    el(budget, "line", { x1: X0, x2: X1, y1: yl(400), y2: yl(400), class: "sc-limit sc-limit-bad" });
    el(budget, "text", { x: X0 + 6, y: yl(400) - 6, class: "sc-small sc-bad-t" }, "p95 budget 400 ms");
    const knee = pill(svg, cx(3) + step * 0.5, yl(400) - 40, "knee", "sc-warn-pill");

    return (p) => {
      bars.forEach((b, i) => {
        const g = span(p, i * 0.14, i * 0.14 + 0.3);
        const h = (B - yr(b.k.rps)) * g;
        set(b.r, { y: B - h, height: h });
        fade(b.t, g);
      });
      fade(ceiling, span(p, 1, 1.3));
      line.setAttribute("stroke-dashoffset", String(900 * (1 - span(p, 1.9, 2.6))));
      dots.forEach((d, i) => fade(d, span(p, 2 + i * 0.1, 2.2 + i * 0.1)));
      fade(budget, span(p, 3, 3.3));
      fade(knee, span(p, 3.2, 3.5));
      fade(safe, span(p, 3.3, 3.6) * 0.9);
      fade(safeLabel, span(p, 3.3, 3.6));
    };
  },
  height: 330,
};

/* ---------------------------------------------------------------------------
   Flame graph: samples become a flame graph; the hot path is found and fixed.
   Widths are from a real CPU profile of the practice app under load.
   --------------------------------------------------------------------------- */

interface Frame { name: string; x: number; w: number; d: number; hot?: boolean; after?: number }

const FRAMES: Frame[] = [
  { name: "(root)", x: 0, w: 100, d: 0 },
  { name: "http: handle request", x: 0, w: 68.5, d: 1, hot: true, after: 26 },
  { name: "(idle)", x: 68.5, w: 21, d: 1 },
  { name: "(gc)", x: 89.5, w: 9.3, d: 1 },
  { name: "recommend", x: 0, w: 66.9, d: 2, hot: true, after: 24 },
  { name: "similarity", x: 0, w: 35.6, d: 3, hot: true, after: 8 },
  { name: "all · 5,000 rows", x: 35.6, w: 11.1, d: 3, after: 0 },
  { name: "sort, filter, map", x: 46.7, w: 20.2, d: 3, after: 16 },
  { name: "normalise", x: 0, w: 27.4, d: 4, hot: true, after: 0 },
  { name: "split · map · filter", x: 0, w: 19, d: 5, hot: true, after: 0 },
];

export const flamegraph: SceneDef = {
  title: "Reading a flame graph",
  steps: [
    "A CPU profiler samples the call stack about a thousand times a second while the app is under load.",
    "A flame graph merges those samples. Width is the share of time; each layer up is a function called by the one below.",
    "recommend takes 67% of the samples. Inside it, similarity and normalise re-parse every book's tags on every request.",
    "Parse the tags once and keep them: the hot frames shrink, and throughput at 10 users rises from 57 to 699 requests per second.",
  ],
  build(svg) {
    const X0 = 20, X1 = 700, H = 30, BASE = 300;
    const fx = (pct: number) => X0 + (pct / 100) * (X1 - X0);
    el(svg, "text", { x: X0, y: 28, class: "sc-cap" }, "CPU PROFILE · /api/recommendations UNDER LOAD");

    // Step 0: individual samples as thin stacks.
    const samples = el(svg, "g");
    const depthOf = (i: number) => {
      const r = (i * 37) % 100;
      return r < 19 ? 6 : r < 27 ? 5 : r < 36 ? 4 : r < 47 ? 4 : r < 67 ? 4 : r < 68 ? 2 : r < 89 ? 2 : 2;
    };
    const cols = Array.from({ length: 60 }, (_, i) => {
      const g = el(samples, "g");
      const n = depthOf(i);
      for (let d = 0; d < n; d++) el(g, "rect", { x: X0 + i * 11.3, y: BASE - (d + 1) * H + 2, width: 9, height: H - 4, rx: 2, class: d >= 2 && n >= 4 ? "sc-fl-hot" : "sc-fl" });
      return g;
    });

    const flames = el(svg, "g");
    const frames = FRAMES.map((f) => {
      const g = el(flames, "g");
      const r = el(g, "rect", { y: BASE - (f.d + 1) * H + 1, height: H - 2, rx: 3, class: "sc-fl" });
      const t = el(g, "text", { y: BASE - f.d * H - 10, class: "sc-mono sc-small sc-on" });
      return { f, r, t };
    });
    const callout = pill(svg, fx(33), 52, "recommend 67% → similarity 36% → normalise 27%", "sc-bad-pill");
    const result = pill(svg, X1, 52, "57 → 699 req/s", "sc-good-pill", "end");

    return (p) => {
      fade(samples, span(p, 0, 0.3) * (1 - span(p, 1, 1.3)));
      cols.forEach((c, i) => fade(c, p >= (i / cols.length) * 0.8 ? 1 : 0));
      fade(flames, span(p, 1, 1.3));
      const fix = span(p, 3, 3.7);
      // After the fix the hot frames shrink in place; widths keep their left edges.
      for (const { f, r, t } of frames) {
        const w = f.after != null ? lerp(f.w, f.after, fix) : f.w;
        const x = f.d === 3 && f.name.startsWith("sort") ? lerp(f.x, 8, fix) : f.x;
        const grow = span(p, 1 + f.d * 0.1, 1.4 + f.d * 0.1);
        set(r, { x: fx(x), width: Math.max(0, fx(x + w * grow) - fx(x) - 2) });
        r.classList.toggle("sc-fl-hot", !!f.hot && p >= 2 && p < 3.6);
        t.textContent = (fx(x + w) - fx(x)) > f.name.length * 7.2 + 50 ? `${f.name} ${fmt(w, 1)}%` : (fx(x + w) - fx(x)) > f.name.length * 7.2 + 8 ? f.name : "";
        set(t, { x: fx(x) + 6 });
        fade(t, grow);
      }
      fade(callout, span(p, 2, 2.3) * (1 - span(p, 3, 3.2)));
      fade(result, span(p, 3.6, 3.9));
    };
  },
  height: 320,
};
