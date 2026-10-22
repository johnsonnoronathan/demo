// Acceptance run: checks every automated criterion in acceptance.json, prints the measured
// value next to its limit, and ends with a verdict. Exit code 0 means ACCEPT, 1 means
// REJECT, 2 means an entry criterion wasn't met (the run itself isn't valid).
// Usage: npm run accept                     (the app must be running: npm start)
//        npm run accept -- --out notes/acceptance-run.md   (also write a Markdown record)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { stage } from "./lib/load.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const spec = JSON.parse(readFileSync(join(root, "acceptance.json"), "utf8"));
const argv = process.argv.slice(2);
const out = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : null;
const base = process.env.BASE_URL || "http://localhost:3000";
const fill = (path) => path.replace(/\{(\d+)-(\d+)\}/g, (_, a, b) => String(+a + Math.floor(Math.random() * (b - a + 1))));

const rows = [];
const add = (id, name, measured, limit, result) => {
  rows.push({ id, name, measured, limit, result });
  console.log(`${id.padEnd(4)} ${result.padEnd(7)} ${String(measured).padStart(12)}  ${String(limit).padEnd(10)} ${name}`);
};

// Entry criteria: the run only counts if the app is up and the data is seeded.
try {
  const res = await fetch(`${base}/api/books?page=1`);
  const body = await res.json();
  if (!res.ok || !body.books?.length) throw new Error(`HTTP ${res.status}, ${body.books?.length ?? 0} books`);
} catch (e) {
  console.error(`Entry criterion not met: Larkspur isn't answering at ${base} with seeded data (${e.message}).`);
  console.error("Run `npm run seed`, then `npm start` in another terminal, and try again.");
  process.exit(2);
}

console.log(`Acceptance run: ${spec.release}\n`);
console.log("id   result      measured  limit      criterion");

for (const c of spec.static) {
  let code = 0, text = "";
  try { text = execSync(c.command, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { code = e.status ?? 1; text = (e.stdout || "") + (e.stderr || ""); }
  const last = text.trim().split("\n").filter(Boolean).at(-1) || "";
  add(c.id, c.name, `exit ${code}`, "exit 0", code === 0 ? "PASS" : "FAIL");
  if (code !== 0) console.log(`              ${last}`);
}

const { vus, seconds, warmup } = spec.load;
let requests = 0, errors = 0;
for (const d of spec.dynamic) {
  if (warmup) await stage(() => base + fill(d.path), { sec: warmup, vus: 5 });
  const r = await stage(() => base + fill(d.path), { sec: seconds, vus });
  requests += r.n; errors += r.errors;
  add(d.id, d.name, `${Math.round(r.p95)} ms`, `≤ ${d.p95} ms`, r.p95 <= d.p95 ? "PASS" : "FAIL");
}
const rate = (100 * errors) / Math.max(1, requests);
add(spec.errorRate.id, spec.errorRate.name, `${rate.toFixed(2)} %`, `< ${spec.errorRate.max} %`, rate < spec.errorRate.max ? "PASS" : "FAIL");
for (const m of spec.manual) add(m.id, m.name, "—", m.limit, "RECORD");

const failed = rows.filter((r) => r.result === "FAIL");
const manual = rows.filter((r) => r.result === "RECORD").map((r) => r.id);
const verdict = failed.length ? "REJECT" : "ACCEPT";
console.log(
  failed.length
    ? `\nREJECT: ${failed.length} of ${rows.length - manual.length} automated criteria failed (${failed.map((r) => r.id).join(", ")}).`
    : `\nACCEPT: all ${rows.length - manual.length} automated criteria passed. Record ${manual.join(", ")} from Lighthouse before sign-off.`
);

if (out) {
  let commit = "not a git checkout";
  try { commit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch {}
  const md = [
    `# Acceptance run: ${spec.release}`,
    "",
    `- Date: ${new Date().toISOString()}`,
    `- Commit: ${commit}`,
    `- Machine: ${os.cpus()[0]?.model ?? "unknown CPU"} × ${os.cpus().length}, ${Math.round(os.totalmem() / 2 ** 30)} GB, ${os.platform()} ${os.release()}`,
    `- Node.js: ${process.version}`,
    `- Load: ${vus} users for ${seconds} s per endpoint, after a ${warmup} s warm-up; ${requests} requests in total`,
    `- Command: npm run accept${out ? ` -- --out ${out}` : ""}`,
    "",
    "| ID | Criterion | Limit | Measured | Result |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((r) => `| ${r.id} | ${r.name} | ${r.limit} | ${r.measured} | ${r.result} |`),
    "",
    `**Verdict: ${verdict}**${manual.length ? ` (manual criteria ${manual.join(", ")} still to record)` : ""}`,
    "",
  ].join("\n");
  mkdirSync(dirname(join(root, out)), { recursive: true });
  writeFileSync(join(root, out), md);
  console.log(`Record written to ${out}`);
}
process.exit(failed.length ? 1 : 0);
