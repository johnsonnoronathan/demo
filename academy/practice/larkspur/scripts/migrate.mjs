// Applies every db/migrations/*.sql file that hasn't run yet, in name order.
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../db/migrations/", import.meta.url));
const db = new DatabaseSync(fileURLToPath(new URL("../larkspur.db", import.meta.url)));
db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
const done = new Set(db.prepare("SELECT name FROM schema_migrations").all().map((r) => r.name));

const pending = readdirSync(dir).filter((f) => f.endsWith(".sql") && !done.has(f)).sort();
for (const name of pending) {
  const started = performance.now();
  db.exec("BEGIN");
  db.exec(readFileSync(dir + name, "utf8"));
  db.prepare("INSERT INTO schema_migrations VALUES (?, datetime('now'))").run(name);
  db.exec("COMMIT");
  console.log(`applied ${name} (${(performance.now() - started).toFixed(0)} ms)`);
}
console.log(pending.length ? `${pending.length} migration(s) applied.` : "Nothing to migrate.");
