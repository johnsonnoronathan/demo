document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("updated").textContent =
    "Updated " + DateFmt.format(Date.now(), "MMMM DD, YYYY", "en-US");
  const res = await fetch("/api/books?page=1");
  const { books } = await res.json();
  document.getElementById("books").innerHTML = books
    .map((b) => `<li><b>${b.title}</b><span>${b.author}</span><span>$${(b.price_cents / 100).toFixed(2)} · ★ ${b.rating ?? "–"}</span></li>`)
    .join("");
});
