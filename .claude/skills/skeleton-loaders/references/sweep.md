# Effect 2: Synced shimmer sweep

## When

A whole content page or a large content area loads in one payload: an article, a docs page, a product detail page, the first load of a route. It isn't worth it for a single small widget (use effect 1).

## What it does

- **Loading:** one 105° highlight band crosses the entire root every 1500 ms (`linear`). Every bone paints the *same* root-sized gradient, offset by the bone's own position, so the band reads as one light passing over the whole layout. Without the offset it restarts inside each bar.
- **Reveal:** blocks rise in reading order. Each block's content moves up 12 px and sharpens from 3 px blur over 500 ms `cubic-bezier(0.22, 1, 0.36, 1)`, 60 ms after the block before it. Its skeleton fades out over 240 ms on the same delay.

`syncSweep(root)` measures the bone offsets (`--sk-bx`, `--sk-by`, `--sk-cw`, `--sk-ch`) and numbers the `.sk-swap` blocks in document order (`--sk-i`). It re-measures on resize. Browsers without `@property` show static bones, which is an acceptable fallback.

## Markup

Make each data-dependent block (headline, dek, byline, hero image, each paragraph) its own `.sk-swap`, in reading order. Static chrome (site header, nav, breadcrumbs) stays real and outside the blocks.

```html
<article class="post sk-sweep is-loading" aria-busy="true">
  <div class="sk-swap">
    <div class="sk-skeleton sk-stack" aria-hidden="true">
      <span class="sk-bone" style="height:20px;width:92%"></span>
      <span class="sk-bone" style="height:20px;width:58%"></span>
    </div>
  </div>
  <div class="sk-swap">
    <div class="sk-skeleton" aria-hidden="true">
      <span class="sk-bone" style="width:100%;aspect-ratio:16/9;border-radius:10px"></span>
    </div>
  </div>
  <div class="sk-swap">
    <div class="sk-skeleton sk-stack" aria-hidden="true" style="gap:15px;padding-top:8px">
      <span class="sk-bone sk-line" style="width:100%"></span>
      <span class="sk-bone sk-line" style="width:97%"></span>
      <span class="sk-bone sk-line" style="width:61%"></span>
    </div>
  </div>
</article>
```

Line bones for body text: space them so each bone sits on one text line. For text at 16 px / 1.6 line height (25.6 px per line) with 10–11 px bones, use a gap of about 15 px and `padding-top` of about 8 px. Use as many lines as the real paragraph takes at the most common width; when the real length is unknown, use 3.

## Wiring (vanilla)

```js
import { syncSweep, reveal } from "./skeleton.js";

const post = document.querySelector(".post");
const sync = syncSweep(post);                  // right after the skeleton is in the DOM

const data = await loadPost(slug);
const blocks = post.querySelectorAll(".sk-swap");
fillBlock(blocks[0], `<h1 class="sk-content title">${escape(data.title)}</h1>`);
fillBlock(blocks[1], `<img class="sk-content cover" src="${data.cover}" alt="">`);
fillBlock(blocks[2], `<div class="sk-content body">${data.html}</div>`);

await reveal(post);                            // (blocks - 1) × 60 + 500 ms
post.querySelectorAll(".sk-skeleton").forEach((s) => s.remove());
post.classList.remove("is-loading");
sync.disconnect();

function fillBlock(block, html) { block.insertAdjacentHTML("beforeend", html); }
```

Give images explicit dimensions or an `aspect-ratio` that matches their bone. Otherwise the image renders at 0 px tall until it decodes, and the reveal shows an empty block.

If the body is one HTML blob of unknown length, make the body a single `.sk-swap` with about 6–8 line bones. The content will be taller, which is allowed.

## Tuning

| Want | Change |
| --- | --- |
| Softer band | Use a `--sk-bone-hi` closer to `--sk-bone` |
| Slower pass | `1500ms` in `.sk-sweep.is-loading` (keep it at or under 2000 ms) |
| Debug | `--sk-slow: 4` |
