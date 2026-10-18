// Loads the post named in ?slug= and renders it into <main id="post">.
// The JSON looks like:
// { "title": "...", "author": { "name": "...", "avatar": "/img/..." }, "date": "2026-09-30",
//   "readingMinutes": 6, "cover": { "src": "/img/...", "alt": "...", "caption": "..." },
//   "paragraphs": ["...", "..."] }
(async function () {
  const slug = new URLSearchParams(location.search).get("slug") || "first-frost";
  const main = document.getElementById("post");

  try {
    const res = await fetch(`/api/posts/${encodeURIComponent(slug)}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();

    main.innerHTML = `
      <h1 class="post-title">${esc(post.title)}</h1>
      <div class="byline">
        <img class="avatar" src="${post.author.avatar}" alt="">
        <span>By <strong>${esc(post.author.name)}</strong> · ${formatDate(post.date)} · ${post.readingMinutes} min read</span>
      </div>
      <figure class="cover">
        <img src="${post.cover.src}" alt="${esc(post.cover.alt)}">
        <figcaption>${esc(post.cover.caption)}</figcaption>
      </figure>
      <div class="post-body">
        ${post.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>`;
    document.title = `${post.title} – Field Notes`;
  } catch (err) {
    console.error(err);
    main.innerHTML = `<p class="error">Sorry, this post couldn't be loaded. Please try again later.</p>`;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
})();
