/* Scene kit: tiny helpers for drawing concept animations in SVG.
 *
 * A scene is a list of captioned steps and a build() that draws into an SVG and returns
 * draw(p). `p` is the playhead in steps: 2.5 means halfway through step 2 (0-based).
 * draw must set everything from p alone, so play, pause, jumping to a step and the
 * reduced-motion still frames are all the same call.
 */

export interface SceneDef {
  title: string;
  steps: string[];
  /** viewBox height; width is always 720. */
  height?: number;
  build(svg: SVGSVGElement): (p: number) => void;
}

export const W = 720;
const NS = "http://www.w3.org/2000/svg";
type Attrs = Record<string, string | number | undefined>;

export function el<K extends keyof SVGElementTagNameMap>(
  parent: Element,
  tag: K,
  attrs: Attrs = {},
  text?: string
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  set(node, attrs);
  if (text != null) node.textContent = text;
  parent.appendChild(node);
  return node;
}

export function set(node: Element, attrs: Attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined) node.removeAttribute(k);
    else node.setAttribute(k, String(v));
  }
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Eased 0..1 progress of p through the window [a, b]. */
export const span = (p: number, a: number, b: number) => ease((p - a) / (b - a));
/** Fade helper: sets opacity from a 0..1 value and hides fully transparent nodes from AT. */
export function fade(node: Element, o: number) {
  node.setAttribute("opacity", o.toFixed(3));
  node.setAttribute("visibility", o <= 0.001 ? "hidden" : "visible");
}

/** Deterministic random numbers, so every viewer sees the same picture. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** A rounded label pill: rect + text, returned as a group you can fade. */
export function pill(parent: Element, x: number, y: number, text: string, cls = "sc-pill", anchor: "start" | "middle" | "end" = "middle") {
  const g = el(parent, "g", { class: cls });
  const w = text.length * 7.1 + 18;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  el(g, "rect", { x: left, y: y - 12, width: w, height: 24, rx: 12 });
  el(g, "text", { x: left + w / 2, y: y + 4.5, "text-anchor": "middle" }, text);
  return g;
}
