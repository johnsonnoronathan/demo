/* Video panes: each builds its DOM once per scene and returns update(p), where p is the
 * cue position in the scene. Everything is a pure function of p, so seeking, scrubbing
 * and poster frames share one code path with playback.
 */
import type * as T from "./types";
import { scenes as conceptScenes } from "../scenes";

export interface PaneView { el: HTMLElement; update(p: number): void }
interface Ctx { cues: number }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
function el(tag: string, cls?: string | null, html?: string) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
const on = (n: Element, v: boolean) => n.classList.toggle("on", v);
let CHIP: Record<T.Chip, string> = { pass: "Pass", fail: "Fail", yes: "Yes", no: "No", gap: "Gap", warn: "Check" };
/** Default chip labels in the video's language. */
export function setChipLabels(labels?: Partial<Record<T.Chip, string>>) {
  if (labels) CHIP = { ...CHIP, ...labels };
}
const chip = (kind: T.Chip, text?: string) => `<span class="v-chip v-chip-${kind}">${esc(text || CHIP[kind])}</span>`;

/* Syntax colouring ------------------------------------------------------- */
type Tok = { t: string; c?: string };
const JS_KW = /^(export|function|return|if|const|let|import|from|test|expect|toBe|each|for|of|new|await|async|default)$/;
const SQL_KW = /^(SELECT|FROM|WHERE|JOIN|LEFT|ON|GROUP|BY|ORDER|LIMIT|OFFSET|AS|AND|CREATE|INDEX|DESC|EXPLAIN|QUERY|PLAN|count|avg|round)$/i;
function tokenize(line: string, lang: T.CodePane["lang"]): Tok[] {
  const out: Tok[] = [];
  let rest = line, m: RegExpExecArray | RegExpMatchArray | null;
  if (lang === "gherkin") {
    m = rest.match(/^(\s*)(Feature:|Scenario:|Given|When|Then|And)(.*)$/);
    if (m) { if (m[1]) out.push({ t: m[1] }); out.push({ t: m[2], c: "kw" }); rest = m[3]; }
  }
  if (lang === "yaml") {
    m = rest.match(/^(\s*-?\s*)([\w.-]+:)(.*)$/);
    if (m) { out.push({ t: m[1] }); out.push({ t: m[2], c: "kw" }); rest = m[3]; }
  }
  const comment = { js: "//", sql: "--", yaml: "#", text: "#", gherkin: "#" }[lang];
  const ci = rest.indexOf(comment);
  const tail = ci >= 0 && (ci === 0 || /\s/.test(rest[ci - 1])) ? rest.slice(ci) : "";
  if (tail) rest = rest.slice(0, ci);
  const re = /("(?:[^"\\]|\\.)*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"'`]+)/g;
  while ((m = re.exec(rest))) {
    if (m[1]) out.push({ t: m[1], c: "str" });
    else if (m[2]) out.push({ t: m[2], c: "num" });
    else if (m[3]) out.push({ t: m[3], c: (lang === "js" && JS_KW.test(m[3])) || (lang === "sql" && SQL_KW.test(m[3])) ? "kw" : lang === "js" && /^[A-Z]/.test(m[3]) ? "ty" : undefined });
    else out.push({ t: m[0] });
  }
  if (tail) out.push({ t: tail, c: "cm" });
  return out;
}
function renderTokens(tokens: Tok[], limit: number) {
  let html = "", used = 0;
  for (const tk of tokens) {
    if (used >= limit) break;
    const piece = tk.t.slice(0, limit - used);
    used += piece.length;
    html += tk.c ? `<span class="v-tk-${tk.c}">${esc(piece)}</span>` : esc(piece);
  }
  return html;
}

/* Panes ------------------------------------------------------------------ */
const P: { [K in T.Pane["type"]]: (d: Extract<T.Pane, { type: K }>, ctx: Ctx) => PaneView } = {
  title(d) {
    const root = el("div", "v-pn v-title");
    const k = root.appendChild(el("div", "rv v-kicker", esc(d.kicker)));
    const h = root.appendChild(el("h2", "rv", esc(d.heading)));
    const rule = root.appendChild(el("div", "rv v-rule"));
    const s = d.sub ? root.appendChild(el("p", "rv", esc(d.sub))) : null;
    return {
      el: root,
      update(p) {
        on(k, p >= 0); on(h, p >= 0); on(rule, p >= 0.2);
        if (s) on(s, p >= (d.subAt ?? 0.3));
      },
    };
  },

  bullets(d) {
    const root = el("div", "v-pn v-bullets" + (d.check ? " is-check" : ""));
    const formula: HTMLElement[] = [];
    if (d.formula) {
      const f = root.appendChild(el("div", "v-formula"));
      d.formula.forEach((txt, i) => {
        if (i) f.appendChild(el("span", "rv v-arrow", "→"));
        formula.push(f.appendChild(el("span", "rv v-part", esc(txt))));
      });
    }
    const lead = d.lead ? root.appendChild(el("h3", "rv v-lead", esc(d.lead))) : null;
    const list = root.appendChild(el("ul", "v-items"));
    const items = d.items.map((it) => ({
      node: list.appendChild(el("li", "rv" + (it.dim ? " dim" : ""), `<span class="v-mk"></span><span class="v-tx"><b>${esc(it.text)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ""}</span>`)),
      def: it,
    }));
    return {
      el: root,
      update(p) {
        formula.forEach((n, i) => {
          on(n, p >= i * 0.3);
          const prev = n.previousElementSibling;
          if (prev) on(prev, p >= i * 0.3);
        });
        if (lead) on(lead, p >= 0);
        let active = -1;
        items.forEach((it, i) => {
          const v = p >= it.def.at;
          on(it.node, v);
          if (v && !it.def.dim) active = i;
        });
        items.forEach((it, i) => it.node.classList.toggle("active", i === active));
      },
    };
  },

  card(d) {
    const root = el("div", "v-pn v-card" + (d.compact ? " compact" : ""));
    const head = root.appendChild(el("div", "v-card-head"));
    if (d.tag) head.appendChild(el("span", `v-tag v-tag-${d.tag.kind}`, esc(d.tag.text)));
    const id = head.appendChild(el("span", "rv v-cid", esc(d.id)));
    const title = head.appendChild(el("div", "rv v-ctitle", esc(d.title)));
    const rows = d.fields.map((f) => {
      const row = root.appendChild(el("div", "v-field"));
      row.appendChild(el("div", "v-flabel", esc(f.label)));
      const val = row.appendChild(el("div", "rv v-fval"));
      if (f.list) val.innerHTML = "<ul>" + f.list.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul>";
      else if (f.steps) val.innerHTML = "<ol>" + f.steps.map((x) => `<li class="rv">${esc(x)}</li>`).join("") + "</ol>";
      else if (f.chip) val.innerHTML = chip(f.chip);
      else if (f.progress) val.innerHTML = '<ol class="v-progress">' + f.progress.map((x) => `<li>${esc(x)}</li>`).join("") + "</ol>";
      else val.textContent = f.value ?? "";
      const steps = [...val.querySelectorAll("li")];
      const flag = f.flag ? row.appendChild(el("div", "rv v-flag", esc(f.flag.text))) : null;
      return { row, val, def: f, steps, flag };
    });
    return {
      el: root,
      update(p) {
        on(id, p >= (d.titleAt ?? 0));
        on(title, p >= (d.titleAt ?? 0) + 0.1);
        let active = -1;
        rows.forEach((r, i) => {
          const v = p >= r.def.at;
          on(r.val, v);
          r.row.classList.toggle("filled", v);
          if (v) active = i;
          if (r.def.steps) r.steps.forEach((s, si) => on(s, p >= r.def.at + si * 0.18));
          if (r.def.progress && r.def.marks) r.steps.forEach((s, si) => {
            s.classList.toggle("done", p >= r.def.marks![si]);
            s.classList.toggle("now", p >= (si ? r.def.marks![si - 1] : 0) && p < r.def.marks![si]);
          });
          if (r.flag && r.def.flag) {
            on(r.flag, p >= r.def.flag.at);
            r.row.classList.toggle("flagged", p >= r.def.flag.at);
          }
        });
        if (d.focus) rows.forEach((r, i) => r.row.classList.toggle("active", i === active));
      },
    };
  },

  code(d) {
    const root = el("div", "v-pn v-code");
    root.appendChild(el("div", "v-tab", `<span class="v-dot"></span>${esc(d.file)}`));
    const body = root.appendChild(el("div", "v-code-body"));
    const src = d.code.split("\n");
    const hidden: Record<number, { at: number }> = {};
    (d.appear || []).forEach((a) => a.lines.forEach((n) => (hidden[n] = a)));
    const lines = src.map((text, i) => {
      const row = body.appendChild(el("div", "v-cl"));
      row.appendChild(el("span", "v-ln", String(i + 1)));
      const code = row.appendChild(el("span", "v-cc"));
      return { row, code, text, tokens: tokenize(text, d.lang), shown: "" };
    });
    const notes = (d.highlights || []).map((h) => {
      if (!h.note) return null;
      const n = body.appendChild(el("div", "rv v-note" + (h.bad ? " bad" : ""), esc(h.note)));
      n.style.setProperty("--line", String(h.lines[0] - 1));
      return n;
    });
    const total = src.reduce((a, l, i) => (hidden[i + 1] ? a : a + l.length + 1), 0);
    return {
      el: root,
      update(p) {
        let budget = d.typeTo < 0 ? Infinity : Math.floor(Math.max(0, Math.min(1, p / d.typeTo)) * total);
        const typing = d.typeTo >= 0 && p < d.typeTo;
        let caretPlaced = false;
        lines.forEach((L, i) => {
          const n = i + 1;
          let text = L.text, tokens = L.tokens, swapped = false;
          (d.swaps || []).forEach((s) => { if (s.line === n && p >= s.at) { text = s.text; tokens = tokenize(s.text, d.lang); swapped = true; } });
          let limit: number;
          if (hidden[n]) limit = p >= hidden[n].at ? Infinity : -1;
          else { limit = budget; budget -= text.length + 1; }
          L.row.classList.toggle("void", limit < 0);
          L.row.classList.toggle("swapped", swapped);
          L.row.classList.toggle("pop", !!hidden[n] && limit === Infinity);
          const caret = typing && !caretPlaced && !hidden[n] && limit >= 0 && limit <= text.length;
          const key = `${swapped ? "s" : ""}${limit}${caret ? "c" : ""}`;
          if (key !== L.shown) {
            L.code.innerHTML = (limit < 0 ? "" : renderTokens(tokens, limit)) + (caret ? '<span class="v-caret"></span>' : "");
            L.shown = key;
          }
          if (caret) caretPlaced = true;
          let hl: NonNullable<T.CodePane["highlights"]>[number] | null = null;
          (d.highlights || []).forEach((h) => { if (p >= h.at && p < h.until && h.lines.includes(n)) hl = h; });
          L.row.classList.toggle("hl", !!hl);
          L.row.classList.toggle("hl-bad", !!(hl as any)?.bad);
          L.row.classList.toggle("hl-good", !!(hl as any)?.good);
        });
        body.classList.toggle("dimmed", lines.some((L) => L.row.classList.contains("hl")));
        notes.forEach((n, i) => { if (n) { const h = d.highlights![i]; on(n, p >= h.at && p < h.until); } });
      },
    };
  },

  terminal(d) {
    const root = el("div", "v-pn v-term");
    root.appendChild(el("div", "v-tab", `<span class="v-dot"></span>${esc(d.title || "Terminal")}`));
    const body = root.appendChild(el("div", "v-term-body"));
    const rows = d.lines.map((l) => ({ node: body.appendChild(el("div", `v-tl v-tl-${l.kind}`, esc(l.text))), def: l }));
    body.appendChild(el("div", "v-tl v-tl-cmd", '$ <span class="v-caret"></span>'));
    return {
      el: root,
      update(p) {
        rows.forEach((r) => (r.node.hidden = !(p >= r.def.at && (r.def.until == null || p < r.def.until))));
      },
    };
  },

  table(d) {
    const root = el("div", "v-pn v-table");
    if (d.caption) root.appendChild(el("div", "v-tcap", esc(d.caption)));
    const tbl = root.appendChild(el("table"));
    const cg = "<colgroup>" + (d.widths || []).map((w) => `<col style="width:${w}">`).join("") + "</colgroup>";
    tbl.innerHTML = cg + "<thead><tr>" + d.cols.map((c) => `<th>${esc(c)}</th>`).join("") + "</tr></thead>";
    const tb = tbl.appendChild(el("tbody"));
    const rows = d.rows.map((r) => ({
      node: tb.appendChild(el("tr", "rv", r.cells.map((c) => `<td>${typeof c === "object" ? chip(c.chip, c.text) : esc(c)}</td>`).join(""))),
      def: r,
    }));
    return {
      el: root,
      update(p) {
        rows.forEach((r) => on(r.node, p >= r.def.at));
        const focus = new Set((d.focus || []).filter((f) => p >= f.at && p < f.until).map((f) => f.row));
        rows.forEach((r, i) => {
          r.node.classList.toggle("focus", focus.has(i));
          r.node.classList.toggle("unfocus", focus.size > 0 && !focus.has(i));
        });
      },
    };
  },

  concept(d, ctx) {
    const root = el("div", "v-pn v-concept");
    const def = conceptScenes[d.scene];
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 720 ${def?.height ?? 360}`);
    svg.setAttribute("class", "sc-svg");
    root.appendChild(svg);
    if (!def) return { el: root, update() {} };
    const draw = def.build(svg);
    const n = def.steps.length;
    const at = d.at ?? Array.from({ length: ctx.cues }, (_, i) => Math.min(i, n - 1));
    return {
      el: root,
      update(p) {
        const i = Math.max(0, Math.min(at.length - 1, Math.floor(p)));
        const from = at[i];
        const to = i + 1 < at.length ? at[i + 1] : Math.min(n, from + 1);
        const frac = Math.min(1, p - i);
        draw(Math.min(n, from + (to === from ? (p >= at.length ? 1 : 0.999) : (to - from) * frac)));
      },
    };
  },

  stats(d) {
    const root = el("div", "v-pn v-stats");
    if (d.caption) root.appendChild(el("div", "v-tcap", esc(d.caption)));
    const grid = root.appendChild(el("div", "v-stat-grid"));
    const items = d.items.map((it) => ({
      node: grid.appendChild(el("div", `rv v-stat v-stat-${it.tone || "plain"}`, `<b>${esc(it.value)}</b><span>${esc(it.label)}</span>`)),
      def: it,
    }));
    return { el: root, update(p) { items.forEach((it) => on(it.node, p >= it.def.at)); } };
  },

  browser(d) {
    const root = el("div", "v-pn v-browser");
    const bar = root.appendChild(el("div", "v-bw-bar", "<i></i><i></i><i></i>"));
    const url = bar.appendChild(el("div", "v-bw-url"));
    const body = root.appendChild(el("div", "v-bw-body"));
    const form = body.appendChild(el("div", "v-bw-form"));
    form.appendChild(el("div", "v-bw-brand", esc(d.brand)));
    form.appendChild(el("h4", null, esc(d.heading)));
    const inputs = d.fields.map((f) => {
      const wrap = form.appendChild(el("label", "v-bw-field", `<span>${esc(f.label)}</span>`));
      return { box: wrap.appendChild(el("div", "v-bw-input")), def: f };
    });
    const btn = form.appendChild(el("div", "v-bw-btn", esc(d.button.label)));
    const result = body.appendChild(el("div", "rv v-bw-result", `<div class="v-bw-brand">${esc(d.brand)}</div><h4>${esc(d.result.heading)}</h4><p>${esc(d.result.text)}</p>`));
    let lastUrl = -1;
    return {
      el: root,
      update(p) {
        const chars = Math.round(Math.max(0, Math.min(1, (p - d.urlAt) / 0.45)) * d.url.length);
        if (chars !== lastUrl) { url.textContent = d.url.slice(0, chars); lastUrl = chars; }
        body.classList.toggle("loaded", p >= d.urlAt + 0.5);
        inputs.forEach(({ box, def: f }) => {
          const k = Math.max(0, Math.min(1, (p - f.from) / (f.to - f.from)));
          const n = Math.round(k * f.value.length);
          const typing = p >= f.from && p < f.to + 0.05;
          box.innerHTML = esc(f.secret ? "•".repeat(n) : f.value.slice(0, n)) + (typing ? '<span class="v-caret"></span>' : "");
          box.classList.toggle("focus", typing);
        });
        btn.classList.toggle("pressed", p >= d.button.at && p < d.button.at + 0.35);
        on(result, p >= d.result.at);
        form.classList.toggle("gone", p >= d.result.at);
      },
    };
  },

  numberline(d) {
    const L = d.labels ?? { low: "Too few", valid: "Valid", high: "Too many", accept: "accept", reject: "reject", bug: "bug!" };
    const root = el("div", "v-pn v-line");
    root.appendChild(el("h3", "v-line-h", esc(d.heading)));
    const track = root.appendChild(el("div", "v-nl"));
    const span = d.max - d.min;
    const x = (v: number) => ((v - d.min + 0.5) / (span + 1)) * 100;
    const [lo, hi] = d.valid;
    const bands = [
      { cls: "bad", a: d.min - 0.5, b: lo - 0.5, label: L.low },
      { cls: "good", a: lo - 0.5, b: hi + 0.5, label: `${L.valid} · ${lo}–${hi}` },
      { cls: "bad", a: hi + 0.5, b: d.max + 0.5, label: L.high },
    ].map((b) => {
      const n = track.appendChild(el("div", `v-band v-band-${b.cls}`, `<span>${esc(b.label)}</span>`));
      n.style.left = x(b.a) + "%";
      n.style.width = x(b.b) - x(b.a) + "%";
      return n;
    });
    const axis = track.appendChild(el("div", "v-axis"));
    for (let v = d.min; v <= d.max; v++) {
      const tick = axis.appendChild(el("div", "v-tick" + (v === lo || v === hi ? " edge" : ""), `<span>${v}</span>`));
      tick.style.left = x(v) + "%";
    }
    const pins = d.points.map((pt) => {
      const ok = pt.v >= lo && pt.v <= hi;
      const n = track.appendChild(el("div", `rv v-pin ${ok ? "ok" : "no"}`, `<b>${pt.v}</b><em>${esc(ok ? L.accept : L.reject)}</em>`));
      n.style.left = x(pt.v) + "%";
      return { node: n, def: pt, ok, label: n.querySelector("em")! };
    });
    return {
      el: root,
      update(p) {
        const show = d.partitionsAt < 0 || p >= d.partitionsAt;
        bands.forEach((b, i) => { on(b, show); b.style.transitionDelay = show ? i * 0.12 + "s" : "0s"; });
        pins.forEach((pin) => {
          on(pin.node, p >= pin.def.at);
          const bug = pin.def.bug != null && p >= pin.def.bug;
          pin.node.classList.toggle("bug", bug);
          pin.label.textContent = bug ? L.bug : pin.ok ? L.accept : L.reject;
        });
      },
    };
  },

  pyramid(d) {
    const root = el("div", "v-pn v-pyr");
    const stack = root.appendChild(el("div", "v-pyr-stack"));
    const n = d.layers.length;
    const layers = d.layers.map((L, i) => {
      const row = stack.appendChild(el("div", "rv v-pyr-row"));
      const shape = row.appendChild(el("div", "v-pyr-shape", `<b>${esc(L.label)}</b>`));
      const tw = 22 + (i / n) * 78, bw = 22 + ((i + 1) / n) * 78;
      const ins = (w: number) => (100 - w) / 2;
      shape.style.clipPath = `polygon(${ins(tw)}% 0, ${100 - ins(tw)}% 0, ${100 - ins(bw)}% 100%, ${ins(bw)}% 100%)`;
      row.appendChild(el("div", "v-pyr-info", `<b>${esc(L.count)}</b><small>${esc(L.sub)}</small>`));
      return { node: row, def: L };
    });
    const axis = root.appendChild(el("div", "rv v-pyr-axis", `<span>${esc(d.axis[0])}</span><i></i><span>${esc(d.axis[1])}</span>`));
    return {
      el: root,
      update(p) {
        layers.forEach((L) => on(L.node, p >= L.def.at));
        on(axis, p >= d.axisAt);
      },
    };
  },
};

export function buildPane(def: T.Pane, ctx: Ctx): PaneView {
  return (P as any)[def.type](def, ctx);
}
