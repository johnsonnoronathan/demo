// skeleton-loaders runtime helpers for effects 1-3. No dependencies.
// ES module. Loading it with <script type="module"> also sets window.SkeletonLoaders for classic scripts
// that run after it (it cannot be loaded as a classic script itself).
//
//   import { syncSweep, syncRipple, reveal, restart } from "./skeleton.js";
//
// The effects themselves are CSS (skeleton.css). This file only:
//   - measures bone positions for the synced sweep and the ripple wave,
//   - adds .is-revealed at the right moment and resolves when the reveal is over,
//   - restarts the loading animation from frame 0 (for retries and replays).

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const slowFactor = (el) => parseFloat(getComputedStyle(el).getPropertyValue("--sk-slow")) || 1;

function watch(root, measure) {
  let raf = 0;
  const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
  const ro = new ResizeObserver(run);
  ro.observe(root);
  measure();
  return { update: measure, disconnect: () => { cancelAnimationFrame(raf); ro.disconnect(); } };
}

// Effect 2. Gives every bone its offset inside `root` so one gradient spans them all,
// and numbers the .sk-swap blocks in document (reading) order for the staggered rise.
// Call after the skeleton is in the DOM; call update() if bones are added later.
export function syncSweep(root) {
  return watch(root, () => {
    const r = root.getBoundingClientRect();
    root.style.setProperty("--sk-cw", r.width.toFixed(1));
    root.style.setProperty("--sk-ch", r.height.toFixed(1));
    root.querySelectorAll(".sk-skeleton .sk-bone").forEach((b) => {
      const br = b.getBoundingClientRect();
      b.style.setProperty("--sk-bx", (br.left - r.left).toFixed(1));
      b.style.setProperty("--sk-by", (br.top - r.top).toFixed(1));
    });
    root.querySelectorAll(".sk-swap").forEach((el, i) => el.style.setProperty("--sk-i", i));
  });
}

// Effect 3. Distance of each bone from the root's top-left corner (drives the wave delay),
// and the order of the .sk-swap items by distance (drives the pop-in stagger).
export function syncRipple(root) {
  return watch(root, () => {
    const r = root.getBoundingClientRect();
    const dist = (el) => {
      const b = el.getBoundingClientRect();
      return Math.hypot(b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top);
    };
    root.querySelectorAll(".sk-skeleton .sk-bone").forEach((b) => b.style.setProperty("--sk-d", dist(b).toFixed(0)));
    [...root.querySelectorAll(".sk-swap")]
      .map((el) => [el, dist(el)])
      .sort((a, b) => a[1] - b[1])
      .forEach(([el], i) => el.style.setProperty("--sk-i", i));
  });
}

// How long the reveal takes for this root, in ms (matches skeleton.css).
export function revealDuration(root) {
  if (reducedMotion()) return 200;
  const n = Math.max(1, root.querySelectorAll(".sk-swap").length);
  let ms = 400;                                            // .sk-pulse
  if (root.classList.contains("sk-sweep")) ms = (n - 1) * 60 + 500;
  if (root.classList.contains("sk-ripple")) ms = (n - 1) * 70 + 560;
  return ms * slowFactor(root);
}

// Call once the real content is in the DOM (inside .sk-content, still at opacity 0).
// Resolves when the reveal has finished: then remove the skeleton layers and .is-loading.
export function reveal(root) {
  void root.offsetWidth; // commit the hidden content's start state so the transition runs
  root.classList.add("is-revealed");
  root.setAttribute("aria-busy", "false");
  return new Promise((resolve) => setTimeout(resolve, revealDuration(root)));
}

// Back to the loading state from frame 0 without animating the reveal in reverse.
export function restart(root) {
  root.classList.add("is-resetting");
  root.classList.remove("is-revealed", "is-loading");
  void root.offsetWidth;
  root.classList.remove("is-resetting");
  root.classList.add("is-loading");
  root.setAttribute("aria-busy", "true");
}

if (typeof window !== "undefined") {
  window.SkeletonLoaders = Object.assign(window.SkeletonLoaders || {}, { syncSweep, syncRipple, reveal, restart, revealDuration });
}
