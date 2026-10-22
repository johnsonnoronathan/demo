// Static gate: explains every query in hot-queries.sql and fails on full scans of large tables.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LARGE = 1000; // rows; scanning a table smaller than this is fine
const root = new URL("..", import.meta.url);
const db = new DatabaseSync(fileURLToPath(new URL("larkspur.db", root)), { readOnly: true });
const sqlText = readFileSync(fileURLToPath(new URL("hot-queries.sql", root)), "utf8").replace(/--.*$/gm, "");
const queries = sqlText.split(";").map((q) => q.replace(/\s+/g, " ").trim()).filter(Boolean);

let failed = 0;
for (const sql of queries) {
  const params = Array((sql.match(/\?/g) || []).length).fill(null);
  const plan = db.prepare("EXPLAIN QUERY PLAN " + sql).all(...params);
  const scans = plan
    .map((r) => r.detail.match(/^SCAN (\w+)$/))
    .filter(Boolean)
    .map(([, table]) => ({ table, rows: db.prepare(`SELECT count(*) AS n FROM "${table}"`).get().n }))
    .filter((s) => s.rows >= LARGE);
  if (scans.length) failed++;
  console.log(`${scans.length ? "FAIL" : "pass"}  ${sql.slice(0, 90)}${sql.length > 90 ? "…" : ""}`);
  for (const s of scans) console.log(`      full table scan of ${s.table} (${s.rows.toLocaleString("en-US")} rows)`);
}
console.log(failed ? `\n${failed} of ${queries.length} queries scan a large table.` : `\nAll ${queries.length} query plans use indexes.`);
process.exit(failed ? 1 : 0);
