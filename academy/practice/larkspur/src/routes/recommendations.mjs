import { query } from "../db.mjs";

// GET /api/recommendations?book_id=7 — five books that share the most tags.
export function recommend(params) {
  const id = Number(params.get("book_id")) || 1;
  const target = query("SELECT id, tags FROM books WHERE id = ?").get(id);
  if (!target) return { book_id: id, recommendations: [] };
  const all = query("SELECT id, title, tags FROM books").all();

  const scored = all
    .filter((b) => b.id !== id)
    .map((b) => ({ id: b.id, title: b.title, score: similarity(target.tags, b.tags) }))
    .sort((a, b) => b.score - a.score);
  return { book_id: id, recommendations: scored.slice(0, 5) };
}

// Jaccard similarity of two comma-separated tag lists.
function similarity(a, b) {
  const left = normalise(a);
  const right = normalise(b);
  let shared = 0;
  for (const tag of left) if (right.includes(tag)) shared++;
  const union = new Set([...left, ...right]).size;
  return union ? shared / union : 0;
}

function normalise(tags) {
  return tags
    .split(",")
    .map((t) => t.trim().toLowerCase().normalize("NFKD"))
    .filter((t, i, list) => t && list.indexOf(t) === i)
    .sort();
}
