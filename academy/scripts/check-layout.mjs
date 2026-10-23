// Layout gate: opens every built page in a real browser at phone and desktop width and fails
// on anything that breaks the layout for a reader: sideways scrolling, script errors, failed
// requests, a missing or duplicate title, or a lesson without its video.
// Usage: npm run check:layout   (after a build; BASE_PATH must match the build)
import { createServer } from "node:http";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");
const only = process.argv[2]; // optional: check only paths containing this text
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".md": "text/markdown", ".txt": "text/plain", ".json": "application/json" };

const server = createServer((req, res) => {
  let path = decodeURI(new URL(req.url, "http://x").pathname);
  if (!path.startsWith(base + "/")) { res.writeHead(404).end(); return; }
  path = path.slice(base.length);
  if (path.endsWith("/")) path += "index.html";
  const file = join(dist, path);
  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
}).listen(0);
const origin = `http://localhost:${server.address().port}`;

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const urls = walk(dist)
  .filter((f) => f.endsWith("index.html"))
  .map((f) => `${base}/${relative(dist, f).replaceAll("\\", "/").replace(/index\.html$/, "")}`)
  .filter((u) => !only || u.includes(only));

const problems = [];
const browser = await chromium.launch();
for (const [width, height, label] of [[390, 844, "phone"], [1280, 860, "desktop"]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  // Fonts come from Google; the check is about our layout, so skip them.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const queue = [...urls];
  await Promise.all(Array.from({ length: 4 }, async () => {
    const page = await ctx.newPage();
    let current = "";
    page.on("pageerror", (e) => problems.push(`${label} ${current}: script error: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text() + (m.location()?.url ?? ""))) problems.push(`${label} ${current}: console error: ${m.text()}`); });
    page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(origin)) problems.push(`${label} ${current}: ${r.status()} ${r.url().slice(origin.length)}`); });
    while (queue.length) {
      current = queue.shift();
      await page.goto(origin + current, { waitUntil: "load" });
      const r = await page.evaluate((w) => {
        const wide = [...document.querySelectorAll("body *")].filter((el) => {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.right <= w + 1) return false;
          // Content inside a horizontal scroller is fine: tables and code scroll on purpose.
          for (let p = el.parentElement; p; p = p.parentElement) if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowX) && p.getBoundingClientRect().right <= w + 1) return false;
          return true;
        });
        const name = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "");
        return {
          scroll: document.documentElement.scrollWidth,
          wide: wide.slice(0, 3).map(name),
          h1: document.querySelectorAll("h1").length,
          lesson: !!document.querySelector("[data-lesson]"),
          video: !!document.querySelector("tb-video"),
        };
      }, width);
      if (r.scroll > width) problems.push(`${label} ${current}: page scrolls sideways (${r.scroll}px wide at ${width}px)${r.wide.length ? `; widest: ${r.wide.join(", ")}` : ""}`);
      if (r.h1 !== 1) problems.push(`${label} ${current}: ${r.h1} h1 headings; a page has exactly one`);
      if (r.lesson && !r.video) problems.push(`${label} ${current}: lesson page without a video`);
    }
    await page.close();
  }));
  await ctx.close();
}
await browser.close();
server.close();

if (problems.length) {
  for (const p of [...new Set(problems)]) console.log(`FAIL L5  ${p}`);
  console.log(`\n${new Set(problems).size} layout problem(s) on ${urls.length} pages.`);
  process.exit(1);
}
console.log(`Layout check passed: ${urls.length} pages at phone and desktop width.`);
