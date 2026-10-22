// The load loop shared by `npm run load` and `npm run accept`: virtual users request
// in a loop for a fixed time, and every request is timed.

export function pct(sorted, p) {
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] : 0;
}

/** Runs `vus` users for `sec` seconds. `url` is a string, or a function returning one per request. */
export async function stage(url, { sec, vus }) {
  const next = typeof url === "function" ? url : () => url;
  const end = performance.now() + sec * 1000;
  const lat = [];
  let errors = 0, queries = 0;
  const vu = async () => {
    while (performance.now() < end) {
      const t = performance.now();
      try {
        const res = await fetch(next());
        await res.arrayBuffer();
        if (!res.ok) errors++;
        queries += Number(res.headers.get("x-query-count")) || 0;
      } catch {
        errors++;
      }
      lat.push(performance.now() - t);
    }
  };
  await Promise.all(Array.from({ length: vus }, vu));
  lat.sort((a, b) => a - b);
  return { vus, sec, n: lat.length, rps: lat.length / sec, p50: pct(lat, 50), p95: pct(lat, 95), p99: pct(lat, 99), max: lat.at(-1) || 0, errors, qpr: queries / Math.max(1, lat.length) };
}
