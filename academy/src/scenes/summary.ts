import { el, set, fade, span, lerp, pill, type SceneDef } from "./kit";

/* ---------------------------------------------------------------------------
   Pipeline: static checks gate every PR; dynamic checks gate the release.
   --------------------------------------------------------------------------- */

export const pipeline: SceneDef = {
  title: "Performance checks in the delivery pipeline",
  steps: [
    "Every pull request runs the static checks first: asset budget, query lint and query plans. They take seconds.",
    "Then it builds, deploys to staging and runs the dynamic checks: Lighthouse and a short k6 load test.",
    "A failed threshold stops the release, and the failure message carries the numbers that explain why.",
    "Once fixed, the change ships. Production monitoring watches the same metrics and informs the next budgets.",
  ],
  build(svg) {
    const stages = [
      { t: "Pull request", s: "" },
      { t: "Static", s: "budget · lint · plans" },
      { t: "Build", s: "" },
      { t: "Staging", s: "" },
      { t: "Dynamic", s: "Lighthouse · k6" },
      { t: "Release", s: "" },
      { t: "Monitor", s: "real users" },
    ];
    const Y = 150, gap = 100, X0 = 60;
    const cx = (i: number) => X0 + i * gap;
    el(svg, "line", { x1: cx(0), x2: cx(6), y1: Y, y2: Y, class: "sc-track-line" });
    const nodes = stages.map((st, i) => {
      const g = el(svg, "g");
      const r = el(g, "rect", { x: cx(i) - 44, y: Y - 24, width: 88, height: 48, rx: 10, class: "sc-node" });
      el(g, "text", { x: cx(i), y: Y + 5, "text-anchor": "middle", class: "sc-ink sc-b sc-small" }, st.t);
      if (st.s) el(g, "text", { x: cx(i), y: Y + 44, "text-anchor": "middle", class: "sc-small sc-muted" }, st.s);
      const mark = el(g, "text", { x: cx(i) + 36, y: Y - 28, "text-anchor": "middle", class: "sc-b" });
      return { r, mark };
    });
    el(svg, "line", { x1: cx(0), x2: cx(6), y1: Y - 46, y2: Y - 46, class: "sc-track-line", "stroke-dasharray": "2 6" });
    const token = el(svg, "circle", { r: 8, cy: Y - 46, class: "sc-acc" });
    const staticNote = pill(svg, cx(1), Y + 72, "✓ 4 s", "sc-good-pill");
    const fail = el(svg, "g");
    pill(fail, cx(4), Y + 86, "✗ books p(95)<300 · got 1.17 s", "sc-bad-pill");
    el(fail, "text", { x: cx(4), y: Y + 116, "text-anchor": "middle", class: "sc-small sc-bad-t" }, "release blocked");
    const loop = el(svg, "g");
    el(loop, "path", { d: `M ${cx(6)} ${Y - 26} C ${cx(6)} 30, ${cx(1)} 30, ${cx(1)} ${Y - 26}`, class: "sc-acc-s", fill: "none", "stroke-width": 2, "stroke-dasharray": "6 5" });
    el(loop, "text", { x: (cx(1) + cx(6)) / 2, y: 52, "text-anchor": "middle", class: "sc-small sc-muted" }, "real-user numbers set the next budgets");

    // Token position along the stages, as a function of p.
    const at = (p: number) => {
      if (p < 1) return lerp(0, 1, span(p, 0.1, 0.8));
      if (p < 2) return lerp(1, 4, span(p, 1.05, 1.9));
      if (p < 3) return 4;
      return lerp(4, 6, span(p, 3.1, 3.7));
    };

    return (p) => {
      const pos = at(p);
      set(token, { cx: lerp(cx(Math.floor(pos)), cx(Math.ceil(pos)), pos - Math.floor(pos)) });
      const blocked = p >= 2 && p < 3;
      token.classList.toggle("sc-bad", blocked);
      nodes.forEach((n, i) => {
        const passed = pos > i + 0.01 || (i === 6 && pos >= 6);
        const failing = i === 4 && p >= 2 && p < 3;
        n.r.classList.toggle("sc-node-ok", passed && !failing && i > 0);
        n.r.classList.toggle("sc-node-bad", failing);
        n.mark.textContent = failing ? "✗" : passed && i > 0 && i !== 2 && i !== 3 ? "✓" : "";
        n.mark.setAttribute("class", failing ? "sc-b sc-bad-t" : "sc-b sc-good-t");
      });
      fade(staticNote, span(p, 0.8, 1));
      fade(fail, span(p, 2, 2.3) * (1 - span(p, 3, 3.2)));
      fade(loop, span(p, 3.6, 3.9));
    };
  },
  height: 300,
};

/* ---------------------------------------------------------------------------
   Before and after: the course's measured results, side by side.
   --------------------------------------------------------------------------- */

const RESULTS = [
  { label: "/api/books p95", before: 1320, after: 12, unit: "ms", phase: 1 },
  { label: "/api/orders p95", before: 205, after: 5, unit: "ms", phase: 1 },
  { label: "Largest Contentful Paint", before: 9.8, after: 1.5, unit: "s", phase: 1 },
  { label: "Page weight", before: 1645, after: 68, unit: "KiB", phase: 1 },
  { label: "/api/recommendations p95", before: 347, after: 26, unit: "ms", phase: 2 },
];

export const beforeAfter: SceneDef = {
  title: "What the course changed",
  steps: [
    "Before: the first measurements of Larkspur, each from a run you can repeat.",
    "After the static fixes: one query instead of 101, two indexes, and lighter assets.",
    "After the dynamic fix: book tags parsed once instead of on every request.",
    "Each result names the test that produced it. That's what makes a performance report credible.",
  ],
  build(svg) {
    const X0 = 230, X1 = 600;
    el(svg, "text", { x: 20, y: 26, class: "sc-cap" }, "LARKSPUR · 10 VIRTUAL USERS, LIGHTHOUSE MOBILE");
    const rows = RESULTS.map((r, i) => {
      const y = 52 + i * 56;
      el(svg, "text", { x: 20, y: y + 22, class: "sc-ink sc-small sc-b" }, r.label);
      const before = el(svg, "rect", { x: X0, y: y + 6, height: 14, rx: 3, class: "sc-bar-soft" });
      const after = el(svg, "rect", { x: X0, y: y + 24, height: 14, rx: 3, class: "sc-good" });
      const bt = el(svg, "text", { x: X0, y: y + 18, class: "sc-mono sc-small sc-muted" });
      const at = el(svg, "text", { x: X0, y: y + 36, class: "sc-mono sc-small sc-good-t" });
      const ratio = el(svg, "text", { x: 700, y: y + 36, "text-anchor": "end", class: "sc-mono sc-b sc-good-t" }, `${Math.round(r.before / r.after)}× better`);
      return { r, before, after, bt, at, ratio };
    });
    const f = (v: number, unit: string) => (unit === "s" ? `${v.toFixed(1)} s` : `${Math.round(v).toLocaleString("en-US")} ${unit}`);
    return (p) => {
      rows.forEach(({ r, before, after, bt, at, ratio }, i) => {
        const gb = span(p, i * 0.1, i * 0.1 + 0.4);
        set(before, { width: (X1 - X0) * gb });
        bt.textContent = f(r.before, r.unit);
        set(bt, { x: X0 + (X1 - X0) * gb + 8 });
        fade(bt, gb);
        const ga = span(p, r.phase + i * 0.08, r.phase + 0.5 + i * 0.08);
        const w = Math.max(3, (X1 - X0) * (r.after / r.before));
        set(after, { width: w * ga });
        at.textContent = f(r.after, r.unit);
        set(at, { x: X0 + w + 8 });
        fade(at, ga);
        fade(ratio, span(p, 3 + i * 0.08, 3.3 + i * 0.08));
      });
    };
  },
  height: 330,
};
