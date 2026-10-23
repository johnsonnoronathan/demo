// Larkspur Books: a small bookshop API and storefront. Slow on purpose.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { resetQueryCount, queryCount } from "./src/db.mjs";
import { listBooks } from "./src/routes/books.mjs";
import { listOrders } from "./src/routes/orders.mjs";
import { recommend } from "./src/routes/recommendations.mjs";

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC = fileURLToPath(new URL("./public", import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const routes = { "/api/books": listBooks, "/api/orders": listOrders, "/api/recommendations": recommend };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const handler = routes[url.pathname];
  if (handler) {
    const started = performance.now();
    resetQueryCount();
    try {
      const body = JSON.stringify(handler(url.searchParams));
      res.writeHead(200, {
        "content-type": "application/json",
        "x-query-count": String(queryCount()),
        "server-timing": `app;dur=${(performance.now() - started).toFixed(1)}`,
      });
      res.end(body);
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(err.message || err) }));
    }
    return;
  }
  if (url.pathname === "/health") return res.end("ok");

  const path = normalize(join(PUBLIC, url.pathname === "/" ? "index.html" : url.pathname));
  if (!path.startsWith(PUBLIC)) return res.writeHead(403).end();
  try {
    const data = await readFile(path);
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => console.log(`Larkspur Books on http://localhost:${PORT}`));

// Exit cleanly on Ctrl+C. A clean exit is what lets `node --cpu-prof` write its profile.
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => process.exit(0));
