import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const file = fileURLToPath(new URL("../larkspur.db", import.meta.url));
if (!existsSync(file)) {
  console.error("larkspur.db not found. Run `npm run seed` first.");
  process.exit(1);
}
export const db = new DatabaseSync(file);

// Every statement goes through query(), so each response can report how many
// queries it ran in the X-Query-Count header.
let count = 0;
const cache = new Map();
export function query(sql) {
  let stmt = cache.get(sql);
  if (!stmt) cache.set(sql, (stmt = db.prepare(sql)));
  return {
    get: (...args) => (count++, stmt.get(...args)),
    all: (...args) => (count++, stmt.all(...args)),
    run: (...args) => (count++, stmt.run(...args)),
  };
}
export function resetQueryCount() { count = 0; }
export function queryCount() { return count; }
