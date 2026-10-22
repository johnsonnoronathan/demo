// Static check: weighs every asset the page references and compares it with budget.json.
// Nothing is served or run; it reads files from disk.
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const { page, budgets } = JSON.parse(readFileSync(join(root, "budget.json"), "utf8"));
const html = readFileSync(join(root, page), "utf8");
const publicDir = dirname(join(root, page));

const assets = [];
for (const [, src] of html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)) assets.push({ type: "script", src });
for (const [, href] of html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)) assets.push({ type: "stylesheet", src: href });
for (const [, src] of html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) assets.push({ type: "image", src });

const kb = (n) => n / 1024;
const totals = { script: 0, stylesheet: 0, image: 0 };
console.log(`Asset weight for ${page}\n`);
console.log("type        size KB   file");
for (const a of assets) {
  const file = join(publicDir, a.src);
  const size = a.type === "image" ? statSync(file).size : gzipSync(readFileSync(file)).length;
  totals[a.type] += size;
  console.log(`${a.type.padEnd(11)} ${kb(size).toFixed(1).padStart(7)}   ${a.src}`);
}

let failed = 0;
console.log("\nbudget      actual   limit   result");
const total = totals.script + totals.stylesheet + totals.image;
for (const [type, limit] of Object.entries(budgets)) {
  const actual = kb(type === "total" ? total : totals[type] || 0);
  const ok = actual <= limit;
  if (!ok) failed++;
  console.log(`${type.padEnd(11)} ${actual.toFixed(1).padStart(6)}  ${String(limit).padStart(6)}   ${ok ? "pass" : "FAIL  (+" + (actual - limit).toFixed(1) + " KB)"}`);
}
console.log(failed ? `\n${failed} budget(s) exceeded.` : "\nAll budgets met.");
process.exit(failed ? 1 : 0);
