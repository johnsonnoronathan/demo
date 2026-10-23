// Builds larkspur.db: 500 authors, 5,000 books, 50,000 reviews, 200,000 orders.
// The data is random but seeded, so every learner gets the same numbers.
import { DatabaseSync } from "node:sqlite";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../larkspur.db", import.meta.url));
rmSync(file, { force: true });
const db = new DatabaseSync(file);

let s = 42; // mulberry32
const rand = () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (a) => a[Math.floor(rand() * a.length)];

const first = ["Ada", "Grace", "Alan", "Mary", "Ursula", "Octavia", "Italo", "Toni", "Jorge", "Clarice", "Haruki", "Chimamanda", "Wislawa", "Kazuo", "Zadie", "Orhan"];
const last = ["Lovelace", "Hopper", "Shelley", "Le Guin", "Butler", "Calvino", "Morrison", "Borges", "Lispector", "Murakami", "Adichie", "Szymborska", "Ishiguro", "Smith", "Pamuk", "Woolf"];
const words = ["River", "Glass", "Winter", "Lantern", "Orchard", "Salt", "Paper", "Harbor", "Ember", "Meadow", "Silent", "Northern", "Hidden", "Last", "Small", "Golden", "Long", "Quiet", "Iron", "Blue"];
const nouns = ["Garden", "Library", "Season", "Letters", "Map", "Island", "House", "Clock", "Archive", "Atlas", "Bridge", "Lighthouse", "Kingdom", "Notebook", "Road", "Choir"];
const tags = ["mystery", "history", "poetry", "science", "travel", "romance", "fantasy", "essays", "biography", "crime", "nature", "philosophy", "food", "art", "classics", "sci-fi", "humor", "memoir", "children", "politics"];

db.exec(`
  CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
  CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id),
                      price_cents INTEGER NOT NULL, tags TEXT NOT NULL);
  CREATE TABLE reviews (id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES books(id), stars INTEGER NOT NULL);
  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_email TEXT NOT NULL, book_id INTEGER NOT NULL,
                       total_cents INTEGER NOT NULL, created_at TEXT NOT NULL);
`);

db.exec("BEGIN");
const ia = db.prepare("INSERT INTO authors (id, name) VALUES (?, ?)");
for (let i = 1; i <= 500; i++) ia.run(i, `${pick(first)} ${pick(last)}`);
const ib = db.prepare("INSERT INTO books (id, title, author_id, price_cents, tags) VALUES (?, ?, ?, ?, ?)");
for (let i = 1; i <= 5000; i++) {
  const t = new Set([pick(tags), pick(tags), pick(tags)]);
  ib.run(i, `The ${pick(words)} ${pick(nouns)}`, 1 + Math.floor(rand() * 500), 799 + Math.floor(rand() * 2400), [...t].join(","));
}
const ir = db.prepare("INSERT INTO reviews (book_id, stars) VALUES (?, ?)");
for (let i = 0; i < 50000; i++) ir.run(1 + Math.floor(rand() * 5000), 1 + Math.floor(rand() * 5));
const io = db.prepare("INSERT INTO orders (customer_email, book_id, total_cents, created_at) VALUES (?, ?, ?, ?)");
for (let i = 0; i < 200000; i++) {
  const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
  const month = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
  io.run(`reader${Math.floor(rand() * 20000)}@larkspur.test`, 1 + Math.floor(rand() * 5000), 799 + Math.floor(rand() * 4000), `2026-${month}-${day}`);
}
db.exec("COMMIT");
db.close();
console.log("Seeded larkspur.db: 500 authors, 5,000 books, 50,000 reviews, 200,000 orders.");
