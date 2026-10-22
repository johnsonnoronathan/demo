// A tiny load generator for when k6 isn't installed. It runs virtual users in a loop
// and reports throughput, latency percentiles, errors and queries per request.
// Usage: npm run load -- --url http://localhost:3000/api/books --vus 20 --duration 20
//        npm run load -- --url ... --stages 10:10,10:40,10:80   (seconds:vus, one stage after another)
import { stage } from "./lib/load.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).join(" ").split("--").filter(Boolean).map((p) => {
    const [k, ...v] = p.trim().split(/\s+/);
    return [k, v.join(" ")];
  })
);
const url = args.url || "http://localhost:3000/api/books";
const stages = args.stages
  ? args.stages.split(",").map((s) => s.split(":").map(Number)).map(([sec, vus]) => ({ sec, vus }))
  : [{ sec: Number(args.duration) || 20, vus: Number(args.vus) || 10 }];

console.log(`Target ${url}\n`);
console.log("  vus   secs   requests    rps      p50 ms    p95 ms    p99 ms    max ms   errors   queries/req");
for (const s of stages) {
  const r = await stage(url, s);
  const f = (n, w = 9) => n.toFixed(0).padStart(w);
  console.log(`${f(r.vus, 5)} ${f(r.sec, 6)} ${f(r.n, 10)} ${r.rps.toFixed(1).padStart(7)} ${f(r.p50)} ${f(r.p95)} ${f(r.p99)} ${f(r.max)} ${f(r.errors, 8)} ${r.qpr.toFixed(1).padStart(13)}`);
}
