// skeleton-loaders effect 4: dot wireframe build. No dependencies.
// ES module. Loading it with <script type="module"> also sets window.SkeletonLoaders.createDotWireframe.
//
//   const wf = createDotWireframe(target);   // target: the container the result renders into
//   wf.wait();                                // request pending: a dot field ripples out and idles
//   // ...result arrives, render it inside target...
//   await wf.reveal(contentEl);               // traces contentEl's real DOM in dots, then scans it in
//   wf.destroy();                             // on unmount
//
// While waiting, `target` needs a size (give it a min-height near the result's height).
// Call reveal() in the same frame the content mounts (useLayoutEffect in React), because
// reveal() hides the content first; a later call lets the finished UI flash for a frame.
// Colours come from --sk-gen-ink / --sk-gen-line / --sk-gen-strong / --sk-gen-surface / --sk-gen-font.
//
// Texts mode (createDotWireframe(target, { texts: true, done: "Report ready" })) adds generation
// texts around the element: an agent log (left), the motion CSS being written (right) and a step
// line above it. The side panels are placed only where the page is empty; otherwise they drop to a
// strip under the element, or to the step line alone.

const TAU = Math.PI * 2;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x, d = dx(t);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(clamp01(t));
  };
}
const easeDraw = bezier(0.16, 1, 0.3, 1);   // drawing
const easeSmooth = bezier(0.22, 1, 0.36, 1); // reveal (--ease-smooth-out)

function linePts(x0, y0, x1, y1, gap) {
  const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / gap));
  const out = new Float32Array((n + 1) * 2);
  for (let i = 0; i <= n; i++) {
    out[i * 2] = x0 + ((x1 - x0) * i) / n;
    out[i * 2 + 1] = y0 + ((y1 - y0) * i) / n;
  }
  return out;
}

// Rounded rect as dots, clockwise from the top centre.
function rrPts(x, y, w, h, r, gap) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const q = (r * Math.PI) / 2;
  const segs = [
    ["L", x + w / 2, y, x + w - r, y], ["A", x + w - r, y + r, -90],
    ["L", x + w, y + r, x + w, y + h - r], ["A", x + w - r, y + h - r, 0],
    ["L", x + w - r, y + h, x + r, y + h], ["A", x + r, y + h - r, 90],
    ["L", x, y + h - r, x, y + r], ["A", x + r, y + r, 180],
    ["L", x + r, y, x + w / 2, y],
  ].map((s) => ({ s, len: s[0] === "L" ? Math.hypot(s[3] - s[1], s[4] - s[2]) : q }));
  const total = segs.reduce((a, s) => a + s.len, 0);
  const n = Math.max(4, Math.round(total / gap));
  const out = new Float32Array(n * 2);
  let si = 0, acc = 0;
  for (let i = 0; i < n; i++) {
    const d = (i * total) / n;
    while (si < segs.length - 1 && d > acc + segs[si].len) acc += segs[si++].len;
    const { s, len } = segs[si], f = len ? (d - acc) / len : 0;
    if (s[0] === "L") {
      out[i * 2] = s[1] + (s[3] - s[1]) * f;
      out[i * 2 + 1] = s[2] + (s[4] - s[2]) * f;
    } else {
      const a = ((s[3] + 90 * f) * Math.PI) / 180;
      out[i * 2] = s[1] + r * Math.cos(a);
      out[i * 2 + 1] = s[2] + r * Math.sin(a);
    }
  }
  return out;
}

// An SVG path (e.g. a chart line) sampled in screen space.
function pathPts(path, ox, oy, gap) {
  const m = path.getScreenCTM();
  if (!m || typeof path.getTotalLength !== "function") return new Float32Array(0);
  const len = path.getTotalLength(), step = gap / (Math.hypot(m.a, m.b) || 1);
  const n = Math.max(1, Math.floor(len / step)), out = new Float32Array((n + 1) * 2);
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength(Math.min(len, i * step));
    out[i * 2] = m.a * p.x + m.c * p.y + m.e - ox;
    out[i * 2 + 1] = m.b * p.x + m.d * p.y + m.f - oy;
  }
  return out;
}

const alphaOf = (c) => {
  if (!c || c === "transparent") return 0;
  const n = c.match(/[\d.]+/g);
  return n && n.length > 3 ? parseFloat(n[3]) : 1;
};

function dotRun(g, pts, from, to, r) {
  for (let i = from; i < to; i++) {
    const x = pts[i * 2], y = pts[i * 2 + 1];
    g.moveTo(x + r, y);
    g.arc(x, y, r, 0, TAU);
  }
}


// ---------------------------------------------------------------------------------------------
// Texts mode helpers
// ---------------------------------------------------------------------------------------------
const DEFAULT_STEPS = ["Planning layout", "Drawing structure", "Writing styles", "Adding motion"];
const TOKEN_LINES = [
  "/* motion tokens */",
  ":root {",
  "  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);",
  "  --dur-fast: 250ms;",
  "  --dur-slow: 400ms;",
  "  --stagger: 40ms;",
  "}",
];
const SPIN = "|/-\\";
const pad = (n, w = 2) => String(n).padStart(w, "0");
const esc = (s) => s.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
const selectorOf = (el) => el.tagName.toLowerCase() + (el.classList && el.classList[0] ? `.${el.classList[0]}` : "");
const hexOf = (c) => {
  const n = (c || "").match(/[\d.]+/g);
  if (!n || n.length < 3) return c;
  const [r, g, b, a = 1] = n.map(Number);
  if (a < 1) return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)} / ${+a.toFixed(2)})`;
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
};

// The element's own radius, fills, rules and type, on the motion token scale: one rule per selector.
function ruleLines(parts, title) {
  const out = ["", `/* ${title}: build-in */`];
  const seen = new Set();
  let n = 0;
  for (const p of parts) {
    const i = p.info;
    if (!i || !i.el || seen.has(i.label)) continue;
    seen.add(i.label);
    const cs = getComputedStyle(i.el), decl = [];
    const r = parseFloat(cs.borderTopLeftRadius);
    if (r) decl.push(`border-radius: ${Math.round(r)}px;`);
    if (i.kind === "rule") decl.push(`border-bottom: ${cs.borderBottomWidth} solid ${hexOf(cs.borderBottomColor)};`);
    else if (i.kind === "text") decl.push(`font: ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight === "normal" ? "1.4" : cs.lineHeight} …;`, `color: ${hexOf(cs.color)};`);
    else if (alphaOf(cs.backgroundColor) > 0.02) decl.push(`background: ${hexOf(cs.backgroundColor)};`);
    else if (parseFloat(cs.borderTopWidth) > 0) decl.push(`border: ${cs.borderTopWidth} solid ${hexOf(cs.borderTopColor)};`);
    // Short lines, so they fit a 250 px panel without clipping.
    if (i.kind === "media" || /^(BUTTON|A)$/.test(i.el.tagName)) decl.push("transition: scale var(--dur-fast)", "  var(--ease-out);");
    else decl.push("transition: opacity var(--dur-slow)", "  var(--ease-out);");
    if (n && i.kind !== "media") decl.push(`transition-delay: calc(var(--stagger) * ${n});`);
    out.push(`${i.label} {`, ...decl.map((d) => `  ${d}`), "}");
    if (++n >= 7) break;
  }
  return out;
}

export function createDotWireframe(target, options = {}) {
  const o = {
    bleed: 22, gap: 4.6, grid: 14, traceMs: 1500, scanMs: 800, maxParts: 90, labels: true,
    texts: false, steps: DEFAULT_STEPS, done: "Ready", code: null, title: null, ...options,
  };
  const B = o.bleed;
  if (getComputedStyle(target).position === "static") target.style.position = "relative";
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  Object.assign(cv.style, { position: "absolute", left: `${-B}px`, top: `${-B}px`, zIndex: "2", pointerEvents: "none" });
  target.appendChild(cv);
  const g = cv.getContext("2d");

  let raf = 0, finish = null, content = null, saved = null, t0 = 0, ret = null;
  let W = 0, H = 0, tw = 0, th = 0, outline = null, parts = [];
  let fx = new Float32Array(0), fy = fx, fd = fx, lit = fx, maxD = 0;

  const slow = () => parseFloat(getComputedStyle(target).getPropertyValue("--sk-slow")) || 1;

  // Colours are resolved through a probe inside the canvas (fallback content: styled, never
  // rendered), so light-dark(), var() and color-mix() values reach the canvas as plain rgb().
  // Re-read at most every 250 ms, which also picks up a theme switch mid-run.
  const probe = document.createElement("span");
  cv.appendChild(probe);
  const COLOR_TOKENS = [
    ["ink", "--sk-gen-ink", "rgba(128, 128, 128, 0.3)"], ["line", "--sk-gen-line", "#8a909c"],
    ["strong", "--sk-gen-strong", "#363c48"], ["surface", "--sk-gen-surface", "#ffffff"],
  ];
  let cached = null, cachedAt = -Infinity;
  const tokens = (force) => {
    const now = performance.now();
    if (!force && cached && now - cachedAt < 250) return cached;
    const out = {};
    for (const [key, name, fallback] of COLOR_TOKENS) {
      probe.style.color = `var(${name}, ${fallback})`;
      out[key] = getComputedStyle(probe).color || fallback;
    }
    out.font = getComputedStyle(target).getPropertyValue("--sk-gen-font").trim() || "ui-monospace, monospace";
    cached = out; cachedAt = now;
    return out;
  };
  const clear = () => g.clearRect(0, 0, W || cv.width, H || cv.height);

  function measure(contentEl) {
    const tr = target.getBoundingClientRect();
    tw = tr.width; th = tr.height; W = Math.ceil(tw + B * 2); H = Math.ceil(th + B * 2);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = `${W}px`; cv.style.height = `${H}px`;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ox = tr.left - B, oy = tr.top - B;
    const boxOf = (el) => { const r = el.getBoundingClientRect(); return [r.left - ox, r.top - oy, r.width, r.height]; };

    // The outline follows the content (or the target while waiting).
    const oe = contentEl || target, ob = boxOf(oe);
    const radius = parseFloat(getComputedStyle(oe).borderTopLeftRadius) || parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
    outline = { pts: rrPts(ob[0], ob[1], ob[2], ob[3], radius, o.gap), box: ob };

    // Parts: boxes with a fill or full border, bottom rules, text lines, SVG text and paths, in document order.
    parts = [];
    if (contentEl) {
      const add = (pts, box, info) => { if (pts.length >= 4) parts.push({ pts, box, info }); };
      // A text piece that continues the previous line joins it (adjacent JSX text nodes like
      // {"+"}{6.4}{"%"}, or inline elements), so a line of text traces as one line, not dashes.
      const addText = (x0, x1, top, h, el) => {
        const last = parts[parts.length - 1], cy = top + h / 2;
        if (last && last.text && Math.abs(last.text.cy - cy) < 3 && x0 >= last.text.x0 - 1 && x0 - last.text.x1 <= 6) {
          last.text.x1 = Math.max(last.text.x1, x1);
          last.text.h = Math.max(last.text.h, h);
        } else {
          parts.push({ text: { x0, x1, cy, top, h }, info: { kind: "text", label: selectorOf(el), el } });
        }
      };
      const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n && parts.length < o.maxParts; n = walker.nextNode()) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (!n.data.trim() || !n.parentElement || n.parentElement.closest("svg, [data-sk-skip]")) continue;
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) {
            if (r.width >= 1) addText(r.left - ox, r.right - ox, r.top - oy, r.height, n.parentElement);
          }
          continue;
        }
        if (n.closest("[data-sk-skip]")) continue;
        if (n instanceof SVGElement) {
          const tag = n.tagName.toLowerCase();
          if (tag === "path" && (n.hasAttribute("data-sk-trace") || getComputedStyle(n).fill === "none")) add(pathPts(n, ox, oy, o.gap), boxOf(n), { kind: "path", label: selectorOf(n) });
          else if (tag === "text") { const b = boxOf(n), y = b[1] + b[3] / 2; add(linePts(b[0], y, b[0] + b[2], y, o.gap), b, { kind: "text", label: "svg text" }); }
          continue;
        }
        const cs = getComputedStyle(n), b = boxOf(n);
        if (b[2] < 2 || b[3] < 2 || cs.display === "none" || cs.visibility === "hidden") continue;
        if (b[2] * b[3] > 0.6 * ob[2] * ob[3]) continue; // backgrounds of the whole thing
        const edge = (side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== "none";
        const media = /^(IMG|VIDEO|CANVAS|INPUT|BUTTON|TEXTAREA|SELECT)$/.test(n.tagName);
        if (alphaOf(cs.backgroundColor) > 0.02 || (edge("Top") && edge("Left")) || media) {
          add(rrPts(b[0], b[1], b[2], b[3], parseFloat(cs.borderTopLeftRadius) || 0, o.gap), b, { kind: media ? "media" : "box", label: selectorOf(n), el: n });
        } else if (edge("Bottom")) {
          const y = b[1] + b[3] - 0.5;
          add(linePts(b[0], y, b[0] + b[2], y, o.gap), [b[0], y - 1, b[2], 2], { kind: "rule", label: selectorOf(n), el: n });
        }
      }
      // Merged text pieces become dotted lines through their vertical centre.
      parts = parts.filter((p) => !p.text || p.text.x1 - p.text.x0 >= 3).map((p) => {
        if (!p.text) return p;
        const { x0, x1, cy, top, h } = p.text;
        return { pts: linePts(x0, cy, x1, cy, o.gap), box: [x0, top, x1 - x0, h], info: p.info };
      });
    }

    // Dot field inside the target, each dot's distance from the centre.
    const G = o.grid, x0 = B + 8, y0 = B + 8, x1 = B + tw - 8, y1 = B + th - 8;
    const cols = Math.max(1, Math.floor((x1 - x0) / G) + 1), rows = Math.max(1, Math.floor((y1 - y0) / G) + 1);
    const sx = x0 + (x1 - x0 - (cols - 1) * G) / 2, sy = y0 + (y1 - y0 - (rows - 1) * G) / 2;
    const cx = B + tw / 2, cy = B + th / 2, N = th > 16 && tw > 16 ? cols * rows : 0;
    fx = new Float32Array(N); fy = new Float32Array(N); fd = new Float32Array(N); lit = new Float32Array(N); maxD = 0;
    for (let r = 0, i = 0; r < rows && N; r++) {
      for (let c = 0; c < cols; c++, i++) {
        const x = sx + c * G, y = sy + r * G, d = Math.hypot(x - cx, y - cy);
        fx[i] = x; fy[i] = y; fd[i] = d; if (d > maxD) maxD = d;
      }
    }
  }

  function twinkle(rate) {
    for (let i = 0; i < lit.length; i++) lit[i] *= 0.9;
    if (lit.length && Math.random() < rate) for (let j = 0; j < 2; j++) lit[(Math.random() * lit.length) | 0] = 1;
  }

  function drawField(c, alpha, R) {
    g.globalAlpha = alpha;
    g.fillStyle = c.ink; g.beginPath();
    for (let i = 0; i < fx.length; i++) {
      let r = 0.95;
      if (R !== undefined) { const k = (R - fd[i]) / 60; if (k <= 0) continue; if (k < 1) r *= k; }
      g.moveTo(fx[i] + r, fy[i]); g.arc(fx[i], fy[i], r, 0, TAU);
    }
    g.fill();
    g.fillStyle = c.strong; g.beginPath();
    for (let i = 0; i < fx.length; i++) {
      let l = lit[i];
      if (R !== undefined) { const k = R - fd[i]; if (k <= 0) continue; if (k < 36) l = Math.max(l, 1 - k / 36); }
      if (l < 0.15) continue;
      const r = 0.8 + 0.7 * l;
      g.moveTo(fx[i] + r, fy[i]); g.arc(fx[i], fy[i], r, 0, TAU);
    }
    g.fill();
    g.globalAlpha = 1;
  }

  function drawTrace(c, u) {
    const R = 1.05, P = parts.length, O = outline.pts, ON = O.length / 2;
    const op = easeDraw(clamp01(u / 0.34)), half = Math.ceil(ON / 2), k = Math.min(half, Math.round(op * half));
    const heads = [];
    let current = -1;
    g.fillStyle = c.line; g.beginPath();
    dotRun(g, O, 0, k, R);                       // the outline grows from the top centre both ways
    dotRun(g, O, Math.max(k, ON - k), ON, R);
    if (op < 1 && k > 0) heads.push([O, k - 1], [O, ON - k]);
    for (let i = 0; i < P; i++) {                // parts start in document order
      const s = 0.16 + (P > 1 ? (0.62 * i) / (P - 1) : 0);
      const p = easeDraw(clamp01((u - s) / 0.2));
      if (p <= 0) break;
      const pts = parts[i].pts, m = Math.max(1, Math.round((p * pts.length) / 2));
      dotRun(g, pts, 0, m, R);
      if (p < 1) { current = i; heads.push([pts, m - 1]); }
    }
    g.fill();
    if (heads.length) {
      g.fillStyle = c.strong; g.beginPath();
      for (const [pts, i] of heads) dotRun(g, pts, i, i + 1, 1.8);
      g.fill();
    }
    const hs = easeDraw(clamp01((op - 0.5) / 0.3));  // corner handles
    if (hs > 0) {
      const [x, y, w, h] = outline.box, s = 5 * hs;
      g.fillStyle = c.surface; g.strokeStyle = c.strong; g.lineWidth = 1;
      for (const [hx, hy] of [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]) {
        g.fillRect(hx - s / 2, hy - s / 2, s, s); g.strokeRect(hx - s / 2, hy - s / 2, s, s);
      }
    }
    const box = current >= 0 ? parts[current].box : op < 1 ? outline.box : null;  // reticle
    if (box && o.labels) {
      const r = ret || box.slice();
      for (let j = 0; j < 4; j++) r[j] += (box[j] - r[j]) * 0.28;
      ret = r;
      const [x, y, w, h] = r, X = x - 4, Y = y - 4, Wd = w + 8, Hd = h + 8, a = Math.min(7, Wd / 3, Hd / 3);
      g.strokeStyle = c.strong; g.lineWidth = 1.2; g.lineCap = "round"; g.beginPath();
      g.moveTo(X, Y + a); g.lineTo(X, Y); g.lineTo(X + a, Y);
      g.moveTo(X + Wd - a, Y); g.lineTo(X + Wd, Y); g.lineTo(X + Wd, Y + a);
      g.moveTo(X + Wd, Y + Hd - a); g.lineTo(X + Wd, Y + Hd); g.lineTo(X + Wd - a, Y + Hd);
      g.moveTo(X + a, Y + Hd); g.lineTo(X, Y + Hd); g.lineTo(X, Y + Hd - a);
      g.stroke();
      const label = `${Math.round(x - B)}, ${Math.round(y - B)} · ${Math.round(w)}×${Math.round(h)}`;
      g.font = `500 8.5px ${c.font}`; g.fillStyle = c.strong; g.textBaseline = "alphabetic";
      const lx = Math.max(2, Math.min(X, W - g.measureText(label).width - 2));
      g.fillText(label, lx, Y - 4 < 10 ? Y + Hd + 11 : Y - 4);
    }
  }

  function drawScan(c, y) {
    const grad = g.createLinearGradient(0, y - 28, 0, y);
    grad.addColorStop(0, "rgba(128, 128, 128, 0)"); grad.addColorStop(1, c.ink);
    g.fillStyle = grad; g.fillRect(B, y - 28, tw, 28);
    g.fillStyle = c.strong; g.beginPath();
    for (let x = B - 12; x <= B + tw + 12; x += 4) { g.moveTo(x + 1, y); g.arc(x, y, 1, 0, TAU); }
    g.fill();
  }

  function drawLabels(c, tag, size, step) {
    g.font = `500 9px ${c.font}`; g.fillStyle = c.strong; g.textBaseline = "alphabetic"; g.textAlign = "left";
    if (step) {
      // Texts mode: the step line takes the tag's place, with a pulsing dot while it works.
      const r = step.done ? 2.6 : 2.6 * (0.65 + 0.35 * Math.sin(performance.now() / 160));
      g.beginPath(); g.arc(B + 3, B - 11, r, 0, TAU); g.fill();
      g.font = `500 10px ${c.font}`;
      g.fillText(step.text, B + 11, B - 8);
      g.font = `500 9px ${c.font}`;
    } else if (o.labels) {
      g.fillText(tag, B, B - 8);
    }
    if (size && o.labels) {
      g.textAlign = "right";
      g.fillText(`${Math.round(tw * size)} × ${Math.round(th * size)}`, B + tw, B - 8);
      g.textAlign = "left";
    }
  }


  // ------------------------------------------------------------------ texts mode panels
  const tx = { layer: null, log: null, css: null, mode: null, logLines: [], code: [], typed: 0, rate: 110, last: 0, html: {}, run: 0 };

  // Where the page is empty: beside the element (both sides), else under it, else nowhere.
  function placement() {
    const tr = target.getBoundingClientRect();
    let L = 0, R = window.innerWidth, T = 0, Bt = window.innerHeight;
    for (let a = target.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        const r = a.getBoundingClientRect();
        L = Math.max(L, r.left); R = Math.min(R, r.right); T = Math.max(T, r.top); Bt = Math.min(Bt, r.bottom);
      }
    }
    const free = (x, y) => {
      if (x < L || x > R || y < T || y > Bt) return false;
      const hit = document.elementFromPoint(x, y);
      return !hit || hit === document.documentElement || hit === document.body || hit.contains(target);
    };
    const GAP = 24, w = Math.min(250, tr.left - L - GAP - 8, R - tr.right - GAP - 8);
    const ys = [tr.top + 12, tr.top + tr.height / 2, tr.bottom - 12];
    if (w >= 170 && ys.every((y) => free(tr.left - GAP - w / 2, y) && free(tr.right + GAP + w / 2, y))) return { mode: "side", w, gap: GAP };
    // Under: side by side when there is width for it, else stacked (log above CSS) at full width.
    const stacked = tr.width < 520, y0 = tr.bottom + 30, hh = stacked ? 150 : 112;
    if (y0 + hh <= Bt && [y0 + 8, y0 + hh - 8].every((y) => free(tr.left + tr.width * 0.25, y) && free(tr.left + tr.width * 0.75, y))) return { mode: "under", stacked, hh };
    return { mode: null };
  }

  function panel(align, withFoot) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      display: "flex", flexDirection: "column", gap: "4px", minHeight: "0", overflow: "hidden", whiteSpace: "pre",
      textAlign: align, font: `9px/1.6 ${tokens().font}`, letterSpacing: "0.02em", color: "var(--sk-gen-line, #8a909c)",
    });
    const head = document.createElement("div");
    head.style.cssText = "flex:none;padding-bottom:4px;letter-spacing:0.08em;color:var(--sk-gen-strong, #363c48);border-bottom:1px dotted var(--sk-gen-line, #8a909c);";
    const body = document.createElement("div");
    body.style.cssText = "flex:1;min-height:0;overflow:hidden;";
    el.append(head, body);
    let foot = null;
    if (withFoot) {
      foot = document.createElement("div");
      foot.style.cssText = "flex:none;padding-top:4px;letter-spacing:0.08em;color:var(--sk-gen-strong, #363c48);opacity:0.7;border-top:1px dotted var(--sk-gen-line, #8a909c);";
      el.append(foot);
    }
    return { el, head, body, foot };
  }

  function textsOpen(code) {
    textsRemove();
    tx.run++;                    // a new set of panels: stale removal timers leave it alone
    const place = placement();
    tx.mode = place.mode;
    tx.logLines = []; tx.code = code; tx.typed = 0; tx.rate = 110; tx.last = performance.now(); tx.html = {};
    if (!tx.mode) return;
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    Object.assign(layer.style, { position: "absolute", inset: "0", zIndex: "2", pointerEvents: "none", opacity: "0", transition: "opacity 300ms ease-out" });
    tx.log = panel("right", false);
    tx.css = panel("left", true);
    if (tx.mode === "side") {
      Object.assign(tx.log.el.style, { position: "absolute", top: "0", bottom: "0", right: `calc(100% + ${place.gap}px)`, width: `${place.w}px` });
      Object.assign(tx.css.el.style, { position: "absolute", top: "0", bottom: "0", left: `calc(100% + ${place.gap}px)`, width: `${place.w}px` });
      layer.append(tx.log.el, tx.css.el);
    } else {
      const strip = document.createElement("div");
      Object.assign(strip.style, {
        position: "absolute", left: "0", right: "0", top: "calc(100% + 30px)", height: `${place.hh}px`, display: "grid",
        gridTemplateColumns: place.stacked ? "1fr" : "1fr 1fr", gridTemplateRows: place.stacked ? "1fr 1fr" : "1fr", gap: place.stacked ? "10px" : "24px",
      });
      tx.log.el.style.textAlign = "left";
      strip.append(tx.log.el, tx.css.el);
      layer.append(strip);
    }
    target.appendChild(layer);
    tx.layer = layer;
    tx.cols = Math.floor(tx.log.el.clientWidth / 5.4);   // characters that fit a log line at 9px mono
    requestAnimationFrame(() => { if (tx.layer === layer) layer.style.opacity = "1"; });
  }

  function setHTML(key, node, html) {
    if (tx.html[key] === html) return;
    tx.html[key] = html;
    node.innerHTML = html;
    if (key.endsWith("body")) node.scrollTop = node.scrollHeight;  // newest lines stay in view
  }

  // One frame of the texts: header, log lines, typed CSS with a caret, footer.
  function textsFrame(now, head, finishing) {
    if (!tx.layer) return;
    const dt = Math.min(100, now - tx.last) / slow();
    tx.last = now;
    const full = tx.code.join("\n");
    tx.typed = Math.min(full.length, tx.typed + (tx.rate * dt) / 1000);
    setHTML("loghead", tx.log.head, esc(head));
    setHTML("logbody", tx.log.body, tx.logLines.map((l) => {
      const line = typeof l === "function" ? l() : l;
      return Array.isArray(line) ? `<div>${esc(line[0])}<span style="color:var(--sk-gen-strong, #363c48)">${esc(line[1])}</span></div>` : `<div>${esc(line)}</div>`;
    }).join(""));
    const shown = full.slice(0, Math.floor(tx.typed)).split("\n");
    const caret = Math.floor(now / 450) % 2 ? "&nbsp;" : "▍";
    setHTML("cssbody", tx.css.body, shown.map((ln, i) => {
      const t = ln.trim(), strong = t.startsWith("/*") || t.endsWith("{") || t === "}";
      const text = strong ? `<span style="color:var(--sk-gen-strong, #363c48)">${esc(ln)}</span>` : esc(ln);
      return `<div>${text}${i === shown.length - 1 ? caret : ""}</div>`;
    }).join(""));
    const writing = tx.typed < full.length && !finishing;
    setHTML("csshead", tx.css.head, esc(`MOTION.CSS // ${pad(Math.round(tx.typed / 3.6), 4)} TOKENS`));
    setHTML("cssfoot", tx.css.foot, esc(`${Math.round(tx.rate / 3.6)} TOK/S · ${shown.length} LINES · ${writing ? "WRITING" : "READY"}`));
  }

  function textsFade() { if (tx.layer) tx.layer.style.opacity = "0"; }
  function textsRemove() { if (tx.layer) tx.layer.remove(); tx.layer = null; tx.mode = null; }

  const stepFor = (phase, u) => {
    const s = o.steps.length ? o.steps : DEFAULT_STEPS, n = s.length;
    if (phase === "wait") return { text: s[0] };
    if (phase === "trace") return { text: s[Math.min(n - 1, 1 + Math.floor(u * Math.max(1, n - 2)))] };
    return u < 0.6 ? { text: s[n - 1] } : { text: o.done, done: true };
  };
  const partLine = (i, p) => {
    const info = parts[i].info || {}, b = parts[i].box;
    const kind = (info.kind || "part").toUpperCase().padEnd(5).slice(0, 5);
    const label = (info.label || "").slice(0, 13).padEnd(13);
    const size = `${Math.round(b[2])}×${Math.round(b[3])}`.padStart(8);
    const bar = p >= 1 ? " [ ok ] " : " " + "█".repeat(Math.round(p * 6)).padEnd(6, "░") + " ";
    if (tx.cols && tx.cols < 40) return [`${pad(i + 1)} ${kind}${size}`, bar];   // narrow strip: drop the selector
    return [`${pad(i + 1)} ${kind} ${label}${size}`, bar];
  };
  const partStart = (i, P) => 0.16 + (P > 1 ? (0.62 * i) / (P - 1) : 0);
  const titleOf = (el) => (o.title || target.getAttribute("aria-label") || (el.querySelector("h1, h2, h3, h4, caption") || {}).textContent || "component").trim().slice(0, 32);

  // The reveal drives these inline; put back whatever the content had before.
  const DRIVEN = ["opacity", "clip-path", "filter", "transition"];
  function restoreContent() {
    if (!content || !saved) return;
    for (const [p, v, pr] of saved) v ? content.style.setProperty(p, v, pr) : content.style.removeProperty(p);
    saved = null;
  }

  function stop() {
    cancelAnimationFrame(raf); raf = 0;
    const f = finish; finish = null; if (f) f();
  }

  const api = {
    // Request pending: dot field ripples out from the centre, then idles with a few lit dots.
    wait() {
      stop(); clear();
      if (reducedMotion()) return;
      measure(null); ret = null; t0 = performance.now(); tokens(true);
      const S = slow();
      if (o.texts) {
        textsOpen(o.code ? o.code.slice() : TOKEN_LINES.slice());
        const clock = () => `${((performance.now() - t0) / S / 1000).toFixed(2)}`;
        tx.logLines = ["00.00  POST   request sent", () => `${clock().padStart(5, "0")}  MODEL  thinking ${SPIN[Math.floor(performance.now() / 120) % 4]}`];
      }
      const tick = (now) => {
        const t = (now - t0) / S;
        twinkle(0.6); clear();
        drawField(tokens(), 1, easeDraw(clamp01(t / 800)) * (maxD + 60));
        drawLabels(tokens(), `FIELD  ${(t / 1000).toFixed(2)}s`, 0, o.texts ? stepFor("wait") : null);
        if (o.texts) textsFrame(now, "AGENT.LOG // WAITING", false);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    },

    // Result rendered: trace contentEl's own structure, then reveal it behind a scan line.
    reveal(contentEl) {
      cancelAnimationFrame(raf); raf = 0;
      restoreContent();   // a reveal still running on this or another element
      content = contentEl;
      saved = DRIVEN.map((p) => [p, content.style.getPropertyValue(p), content.style.getPropertyPriority(p)]);
      content.style.opacity = "0";
      return new Promise((resolve) => {
        finish = resolve;
        if (reducedMotion()) {
          clear();
          content.style.transition = "opacity 200ms linear";
          void content.offsetWidth;
          content.style.opacity = "1";
          setTimeout(() => { restoreContent(); const f = finish; finish = null; if (f) f(); }, 200);
          return;
        }
        measure(content); ret = null; tokens(true);
        const S = slow(), T = o.traceMs * S, V = o.scanMs * S, start = performance.now(), base = t0 || start;
        const P = parts.length;
        const ui = content.style;
        if (o.texts) {
          if (!tx.layer) textsOpen(o.code ? o.code.slice() : TOKEN_LINES.slice());
          const at = ((start - base) / S / 1000).toFixed(2).padStart(5, "0");
          tx.logLines = tx.logLines.filter((l) => typeof l === "string");
          tx.logLines.push(`${at}  MODEL  done`, `${at}  DATA   result received`, `${at}  DOM    ${P} parts measured`);
          if (!o.code) tx.code = tx.code.concat(ruleLines(parts, titleOf(content)));
          // Finish typing by the end of the trace.
          tx.rate = Math.max(110, ((tx.code.join("\n").length - tx.typed) * 1000) / (o.traceMs * 0.95));
        }
        const run = tx.run;
        let shownParts = 0;
        const tick = (now) => {
          const e = now - start, c = tokens(), clock = `${((now - base) / S / 1000).toFixed(2)}s`;
          clear();
          if (e < T) {
            const u = e / T, idx = Math.min(P, Math.max(0, Math.floor(((u - 0.16) / 0.62) * (P - 1)) + 1));
            twinkle(0.25);
            drawField(c, 0.75);
            drawTrace(c, u);
            drawLabels(c, `TRACE ${String(idx).padStart(2, "0")}/${P}  ${clock}`, easeDraw(clamp01(u / 0.34)), o.texts ? stepFor("trace", u) : null);
            if (o.texts) {
              while (shownParts < P && u >= partStart(shownParts, P)) {
                const i = shownParts++;
                tx.logLines.push(() => partLine(i, easeDraw(clamp01((((performance.now() - start) / T) - partStart(i, P)) / 0.2))));
              }
              textsFrame(now, `AGENT.LOG // PARTS ${pad(shownParts)}/${pad(P)}`, false);
            }
          } else if (e < T + V) {
            const v = (e - T) / V, k = easeSmooth(v), sy = k * (th + 8);
            ui.opacity = String(Math.min(1, v * 2.4));
            ui.clipPath = `inset(0 0 ${Math.max(0, th - sy).toFixed(1)}px 0)`;
            ui.filter = k < 0.995 ? `blur(${((1 - k) * 3).toFixed(2)}px)` : "";
            g.save(); g.beginPath(); g.rect(0, B + sy, W, H); g.clip();
            drawField(c, 0.75 * (1 - v));
            drawTrace(c, 1);
            g.restore();
            drawScan(c, B + sy);
            drawLabels(c, `SCAN  ${clock}`, 1, o.texts ? stepFor("scan", v) : null);
            if (o.texts) {
              textsFrame(now, `AGENT.LOG // PARTS ${pad(P)}/${pad(P)} · DONE`, true);
              if (v > 0.55) textsFade();
            }
          } else {
            clear(); restoreContent(); raf = 0;
            if (o.texts) { textsFade(); setTimeout(() => { if (tx.run === run) textsRemove(); }, 320); }
            const f = finish; finish = null; if (f) f();
            return;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    },

    // Stop now and show whatever is in the target as it is.
    cancel() { stop(); clear(); restoreContent(); tx.run++; textsRemove(); },

    destroy() { api.cancel(); cv.remove(); },
  };
  return api;
}

if (typeof window !== "undefined") {
  window.SkeletonLoaders = Object.assign(window.SkeletonLoaders || {}, { createDotWireframe });
}
