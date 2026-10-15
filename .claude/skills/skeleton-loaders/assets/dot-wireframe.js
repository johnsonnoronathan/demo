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

export function createDotWireframe(target, options = {}) {
  const o = { bleed: 22, gap: 4.6, grid: 14, traceMs: 1500, scanMs: 800, maxParts: 90, labels: true, ...options };
  const B = o.bleed;
  if (getComputedStyle(target).position === "static") target.style.position = "relative";
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  Object.assign(cv.style, { position: "absolute", left: `${-B}px`, top: `${-B}px`, zIndex: "2", pointerEvents: "none" });
  target.appendChild(cv);
  const g = cv.getContext("2d");

  let raf = 0, finish = null, content = null, t0 = 0, ret = null;
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
      const add = (pts, box) => { if (pts.length >= 4) parts.push({ pts, box }); };
      // A text piece that continues the previous line joins it (adjacent JSX text nodes like
      // {"+"}{6.4}{"%"}, or inline elements), so a line of text traces as one line, not dashes.
      const addText = (x0, x1, top, h) => {
        const last = parts[parts.length - 1], cy = top + h / 2;
        if (last && last.text && Math.abs(last.text.cy - cy) < 3 && x0 >= last.text.x0 - 1 && x0 - last.text.x1 <= 6) {
          last.text.x1 = Math.max(last.text.x1, x1);
          last.text.h = Math.max(last.text.h, h);
        } else {
          parts.push({ text: { x0, x1, cy, top, h } });
        }
      };
      const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n && parts.length < o.maxParts; n = walker.nextNode()) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (!n.data.trim() || !n.parentElement || n.parentElement.closest("svg, [data-sk-skip]")) continue;
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) {
            if (r.width >= 1) addText(r.left - ox, r.right - ox, r.top - oy, r.height);
          }
          continue;
        }
        if (n.closest("[data-sk-skip]")) continue;
        if (n instanceof SVGElement) {
          const tag = n.tagName.toLowerCase();
          if (tag === "path" && (n.hasAttribute("data-sk-trace") || getComputedStyle(n).fill === "none")) add(pathPts(n, ox, oy, o.gap), boxOf(n));
          else if (tag === "text") { const b = boxOf(n), y = b[1] + b[3] / 2; add(linePts(b[0], y, b[0] + b[2], y, o.gap), b); }
          continue;
        }
        const cs = getComputedStyle(n), b = boxOf(n);
        if (b[2] < 2 || b[3] < 2 || cs.display === "none" || cs.visibility === "hidden") continue;
        if (b[2] * b[3] > 0.6 * ob[2] * ob[3]) continue; // backgrounds of the whole thing
        const edge = (side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== "none";
        if (alphaOf(cs.backgroundColor) > 0.02 || (edge("Top") && edge("Left")) || /^(IMG|VIDEO|CANVAS|INPUT|BUTTON|TEXTAREA|SELECT)$/.test(n.tagName)) {
          add(rrPts(b[0], b[1], b[2], b[3], parseFloat(cs.borderTopLeftRadius) || 0, o.gap), b);
        } else if (edge("Bottom")) {
          const y = b[1] + b[3] - 0.5;
          add(linePts(b[0], y, b[0] + b[2], y, o.gap), [b[0], y - 1, b[2], 2]);
        }
      }
      // Merged text pieces become dotted lines through their vertical centre.
      parts = parts.filter((p) => !p.text || p.text.x1 - p.text.x0 >= 3).map((p) => {
        if (!p.text) return p;
        const { x0, x1, cy, top, h } = p.text;
        return { pts: linePts(x0, cy, x1, cy, o.gap), box: [x0, top, x1 - x0, h] };
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

  function drawLabels(c, tag, size) {
    if (!o.labels) return;
    g.font = `500 9px ${c.font}`; g.fillStyle = c.strong; g.textBaseline = "alphabetic"; g.textAlign = "left";
    g.fillText(tag, B, B - 8);
    if (size) {
      g.textAlign = "right";
      g.fillText(`${Math.round(tw * size)} × ${Math.round(th * size)}`, B + tw, B - 8);
      g.textAlign = "left";
    }
  }

  function restoreContent() {
    if (!content) return;
    for (const p of ["opacity", "clip-path", "filter", "transition"]) content.style.removeProperty(p);
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
      const tick = (now) => {
        const t = (now - t0) / S;
        twinkle(0.6); clear();
        drawField(tokens(), 1, easeDraw(clamp01(t / 800)) * (maxD + 60));
        drawLabels(tokens(), `FIELD  ${(t / 1000).toFixed(2)}s`);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    },

    // Result rendered: trace contentEl's own structure, then reveal it behind a scan line.
    reveal(contentEl) {
      cancelAnimationFrame(raf); raf = 0;
      content = contentEl;
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
        const tick = (now) => {
          const e = now - start, c = tokens(), clock = `${((now - base) / S / 1000).toFixed(2)}s`;
          clear();
          if (e < T) {
            const u = e / T, idx = Math.min(P, Math.max(0, Math.floor(((u - 0.16) / 0.62) * (P - 1)) + 1));
            twinkle(0.25);
            drawField(c, 0.75);
            drawTrace(c, u);
            drawLabels(c, `TRACE ${String(idx).padStart(2, "0")}/${P}  ${clock}`, easeDraw(clamp01(u / 0.34)));
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
            drawLabels(c, `SCAN  ${clock}`, 1);
          } else {
            clear(); restoreContent(); raf = 0;
            const f = finish; finish = null; if (f) f();
            return;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    },

    // Stop now and show whatever is in the target as it is.
    cancel() { stop(); clear(); restoreContent(); },

    destroy() { api.cancel(); cv.remove(); },
  };
  return api;
}

if (typeof window !== "undefined") {
  window.SkeletonLoaders = Object.assign(window.SkeletonLoaders || {}, { createDotWireframe });
}
