import { query } from "../db.mjs";

// GET /api/books?page=1 — one page of 50 books with author name and rating.
export function listBooks(params) {
  const page = Math.max(1, Number(params.get("page")) || 1);
  const books = query(
    "SELECT id, title, author_id, price_cents FROM books ORDER BY id LIMIT 50 OFFSET ?"
  ).all((page - 1) * 50);

  for (const book of books) {
    const author = query("SELECT name FROM authors WHERE id = ?").get(book.author_id);
    book.author = author.name;
    const rating = query("SELECT avg(stars) AS avg, count(*) AS n FROM reviews WHERE book_id = ?").get(book.id);
    book.rating = rating.avg ? Math.round(rating.avg * 10) / 10 : null;
    book.reviews = rating.n;
  }
  return { page, books };
}
