# Effect 1: Pulse and cross-blur

## When

The default. One request fills a region: feed or list rows, cards, a settings panel, a profile header, an inbox, comment threads. It is calm and cheap, because it only animates opacity, so it suits places that load often.

## What it does

- **Loading:** every bone breathes from opacity 1 to 0.5 and back, at 1000 ms per breath, `ease-in-out`.
- **Reveal:** the skeleton fades out and blurs to 2 px while the content fades in and sharpens from 2 px, over 400 ms `ease-in-out`. Both layers share one grid cell, so nothing moves.

## Markup

Put the root class on the region. Each row (or card) is one `.sk-swap` holding its skeleton; the content joins it when data arrives.

```html
<ul class="feed sk-pulse is-loading" aria-busy="true">
  <li class="feed-row sk-swap">
    <div class="sk-skeleton row-layout" aria-hidden="true">
      <span class="sk-bone sk-round" style="width:40px;height:40px"></span>
      <span class="sk-stack" style="gap:9px;padding-top:4px">
        <span class="sk-bone sk-line" style="width:62%"></span>
        <span class="sk-bone sk-line" style="width:88%"></span>
        <span class="sk-bone sk-line" style="width:38%"></span>
      </span>
    </div>
  </li>
  <!-- repeat for the number of rows that fill the first viewport -->
</ul>
```

Here `row-layout` stands for the project's own row layout class (the grid or flex that places avatar, text and thumbnail). Reuse it on both the skeleton and the content so they line up.

## Wiring (vanilla)

```js
import { reveal } from "./skeleton.js";

const list = document.querySelector(".feed");
const items = await loadFeed();

const slots = [...list.querySelectorAll(".sk-swap")];
items.forEach((item, i) => {
  let slot = slots[i];
  if (!slot) { slot = document.createElement("li"); slot.className = "feed-row sk-swap"; list.append(slot); }
  const content = document.createElement("div");
  content.className = "sk-content row-layout";
  content.innerHTML = renderRow(item);              // the project's existing row markup
  slot.append(content);
});
slots.slice(items.length).forEach((s) => s.remove());

await reveal(list);                                 // adds .is-revealed, waits 400 ms
list.querySelectorAll(".sk-skeleton").forEach((s) => s.remove());
list.classList.remove("is-loading");
```

If the project renders rows by replacing `innerHTML` of the whole list, keep that, but build each row as `<li class="sk-swap"><div class="sk-skeleton">…</div><div class="sk-content">…</div></li>` in the same render. Then call `reveal()`. The skeleton has to be in the DOM in the same frame for the cross-fade to have something to fade from.

## Tuning

| Want | Change |
| --- | --- |
| Quieter pulse | Raise the 0.5 in `@keyframes sk-pulse` to 0.65 |
| Debug in slow motion | `--sk-slow: 4` on the root |

Leave the 400 ms reveal and the 2 px blur as they are; they read as one motion together.
