// Static check: asks SQLite how it would run a query, without running it.
// Usage: npm run explain -- "SELECT ... WHERE customer_email = ?"
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const sql = process.argv.slice(2).join(" ").trim();
if (!sql) {
  console.error('Usage: npm run explain -- "SELECT ..."');
  process.exit(2);
}
const db = new DatabaseSync(fileURLToPath(new URL("../larkspur.db", import.meta.url)), { readOnly: true });
const rows = db.prepare("EXPLAIN QUERY PLAN " + sql).all(...Array((sql.match(/\?/g) || []).length).fill(null));

// Point out full scans of real tables, with their size, so they're easy to spot.
const tables = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((t) => t.name));
function note(detail) {
  const m = detail.match(/^SCAN (\w+)$/);
  if (!m || !tables.has(m[1])) return "";
  const { n } = db.prepare(`SELECT count(*) AS n FROM "${m[1]}"`).get();
  return `   ← full table scan (${n.toLocaleString("en-US")} rows)`;
}

const depth = new Map([[0, 0]]);
console.log("QUERY PLAN");
for (const r of rows) {
  const d = (depth.get(r.parent) ?? 0) + 1;
  depth.set(r.id, d);
  console.log(`${"   ".repeat(d - 1)}└─ ${r.detail}${note(r.detail)}`);
}
