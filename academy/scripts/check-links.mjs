// Link gate: every internal link and asset in the built site must resolve to a file in dist/,
// under the site's base path. Run after a build. A link to a folder without an index.html
// fails here, as it would on GitHub Pages.
// Usage: npm run check:links   (BASE_PATH must match the build, e.g. /demo)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, posix } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");
if (!existsSync(dist)) { console.error("No dist/ folder. Build the site first."); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(dist).filter((f) => f.endsWith(".html"));
const problems = new Map();
let checked = 0;

const resolve = (from, link) => {
  const clean = link.split("#")[0].split("?")[0];
  if (!clean) return null;
  const abs = clean.startsWith("/") ? clean : posix.join(posix.dirname(from), clean);
  if (base && !abs.startsWith(base + "/")) return { escape: true };
  let path = decodeURI(abs.slice(base.length));
  if (path.endsWith("/")) path += "index.html";
  return { file: join(dist, path) };
};

for (const file of pages) {
  const url = "/" + relative(dist, file).replaceAll("\\", "/");
  const from = base + url;
  const html = readFileSync(file, "utf8");
  const links = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/"(?:url|href)":"(\/[^"]*)"/g)].map((m) => m[1]),
  ].filter((l) => !/^(?:[a-z]+:|\/\/|#)/i.test(l));
  for (const link of links) {
    checked++;
    const r = resolve(from, link);
    if (!r) continue;
    const msg = r.escape ? `${link} is outside the base path ${base}/` : existsSync(r.file) ? null : `${link} doesn't exist`;
    if (msg) problems.set(`${url}: ${msg}`, true);
  }
}

if (problems.size) {
  for (const p of problems.keys()) console.log(`FAIL L4  ${p}`);
  console.log(`\n${problems.size} broken link(s) across ${pages.length} pages.`);
  process.exit(1);
}
console.log(`Link check passed: ${checked} links on ${pages.length} pages${base ? ` under ${base}/` : ""}.`);
