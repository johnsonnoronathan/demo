# Effect 3: Ripple wave

## When

Many items of the same shape in a grid: shop catalogues, image galleries, video thumbnails, template marketplaces, file browsers, tile dashboards. Each new infinite-scroll batch can be its own root, so the wave starts at the top of the batch. In a one-column list the wave reads as a slow pulse; use effect 1 there.

## What it does

- **Loading:** each bone flashes to `--sk-bone-hi` on a delay of 1.1 ms per pixel of distance from the root's top-left corner. The result is a crest that rolls diagonally through the grid every 1800 ms.
- **Reveal:** items pop in, nearest first. Each content layer goes from 8 px down, scale 0.97 and 2 px blur to rest: transform over 560 ms with a slight overshoot (`cubic-bezier(0.34, 1.36, 0.64, 1)`), opacity and blur over 420 ms with `cubic-bezier(0.22, 1, 0.36, 1)`, 70 ms apart.

`syncRipple(root)` writes each bone's distance (`--sk-d`) and each item's rank by distance (`--sk-i`), and re-measures on resize.

## Markup

The grid itself is the root; each item is a `.sk-swap`. Reuse the project's grid and card *wrapper* classes. Give the image bone the same aspect ratio as the real image.

```html
<ul class="product-grid sk-ripple is-loading" aria-busy="true">
  <li class="sk-swap">
    <div class="sk-skeleton card-layout" aria-hidden="true">
      <span class="sk-bone" style="width:100%;aspect-ratio:1;border-radius:10px"></span>
      <span style="display:flex;justify-content:space-between;gap:8px;padding-top:6px">
        <span class="sk-bone sk-line" style="width:58%"></span>
        <span class="sk-bone sk-line" style="width:18%"></span>
      </span>
      <span class="sk-bone sk-line" style="width:44%;margin-top:6px"></span>
    </div>
  </li>
  <!-- 6–8 items: what fills the first viewport -->
</ul>
```

Don't put the card's image class (e.g. `card-image`, `thumb`, `tile`) on the image bone. Those classes usually set a background, which overrides the bone colour and freezes the wave on that bone.

## Wiring (vanilla)

```js
import { syncRipple, reveal } from "./skeleton.js";

const grid = document.querySelector(".product-grid");
const sync = syncRipple(grid);

const products = await loadProducts();
const slots = [...grid.querySelectorAll(".sk-swap")];
products.forEach((p, i) => {
  let slot = slots[i];
  if (!slot) { slot = document.createElement("li"); slot.className = "sk-swap"; grid.append(slot); }
  slot.insertAdjacentHTML("beforeend", `<article class="sk-content card-layout">${renderCard(p)}</article>`);
});
slots.slice(products.length).forEach((s) => s.remove());
sync.update();                                  // rank any extra items for the stagger

await reveal(grid);                             // (items - 1) × 70 + 560 ms
grid.querySelectorAll(".sk-skeleton").forEach((s) => s.remove());
grid.classList.remove("is-loading");
sync.disconnect();
```

With a very large first page (say 24 items), the stagger adds up: 23 × 70 ms is 1.6 s before the last item settles. Reveal the first viewport's worth of items as above, and render the rest directly as plain items, or cap the stagger by setting `--sk-i` no higher than about 8.

## Tuning

| Want | Change |
| --- | --- |
| Faster wave | Lower `1.1ms` in `.sk-ripple.is-loading .sk-skeleton .sk-bone` |
| No overshoot | Swap `--sk-ease-bounce` for `--sk-ease-smooth-out` on the transform |
| Debug | `--sk-slow: 4` |
