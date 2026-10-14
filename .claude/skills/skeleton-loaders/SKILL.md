---
name: skeleton-loaders
description: Add polished skeleton loading states to web pages and apps (vanilla JS or React/Next.js). Placeholder "bones" animate while data loads, then the real content is revealed without layout shift. Bundles four tuned effects and a guide for choosing between them. Pulse + cross-blur suits rows and cards. A page-synced shimmer sweep suits articles and whole pages. A ripple wave suits grids. A dot-wireframe "AI is building this" reveal suits generated results. Use this skill whenever the user mentions skeleton screens or loaders, loading placeholders, shimmer, replacing a spinner, a page that is blank, flashes or jumps while data loads, layout shift on load, or loading states for lists, grids, articles, dashboards or feeds. Also use it when an AI-generated result should feel like it is being built, even if the user never says "skeleton".
---

# Skeleton loaders

A skeleton is a placeholder in the shape of the content that is on its way. Done well, it does three things: it reserves the space so nothing jumps, it shows that something is happening, and it hands over to the real content smoothly. This skill bundles four effects, already tuned and tested, so you choose one and wire it in rather than inventing timings.

| # | Effect | Root class | Runtime | Reference |
| --- | --- | --- | --- | --- |
| 1 | Pulse and cross-blur | `sk-pulse` | CSS (`reveal()` helper optional) | [references/pulse.md](references/pulse.md) |
| 2 | Synced shimmer sweep | `sk-sweep` | CSS + `syncSweep()` | [references/sweep.md](references/sweep.md) |
| 3 | Ripple wave | `sk-ripple` | CSS + `syncRipple()` | [references/ripple.md](references/ripple.md) |
| 4 | Dot wireframe build | none | `createDotWireframe()` (canvas) | [references/dot-wireframe.md](references/dot-wireframe.md) |

Bundled files: [assets/skeleton.css](assets/skeleton.css) (tokens, shared layer rules, effects 1–3, reduced motion), [assets/skeleton.js](assets/skeleton.js) (measuring and reveal helpers for effects 1–3), [assets/dot-wireframe.js](assets/dot-wireframe.js) (effect 4). For React or Next.js, also read [references/react.md](references/react.md).

## Workflow

1. **Read how the data loads.** Find the fetch (fetch/SWR/React Query/server action/LLM call), the typical wait, and what shows today (a spinner, a blank area, content that jumps in). Also note which parts of the UI don't depend on the data: headings, filters, nav. Those keep rendering immediately.
2. **Decide whether it needs a skeleton** (next section).
3. **Pick the effect** with the table below.
4. **Build the skeleton from the real component's layout**, following the layout rules.
5. **Wire the states**: loading, reveal, then done. Use the effect's reference file, plus `references/react.md` for React.
6. **Check it** against the checklist at the end.
7. **Tell the user** in two or three sentences which effect you used and why, and what they might tune (for example, the number of skeleton cards).

## Does it need a skeleton?

- **Usually under ~300 ms:** a skeleton would only flash. Either leave it out, or add `sk-delayed` to the root so the bones stay invisible for the first 300 ms while the space is still reserved.
- **~300 ms to ~10 s:** a skeleton is the right tool.
- **Longer than ~10 s, or unknown:** use a skeleton plus honest status text ("Still working…", a step name, or progress). A pulse alone starts to look frozen after a few seconds.
- **Background refreshes** (SWR revalidation, polling, pagination with data already on screen): keep showing the current content. Only the first load, or a load for a new key with nothing to show, gets a skeleton. Swapping visible data back to grey bars reads as data loss.
- **Button actions and form submits** get a pending state on the control, not a skeleton.

## Choosing the effect

| Situation | Effect |
| --- | --- |
| One request fills a region: list rows, cards, a panel, a profile header, an inbox, comments | **1 Pulse and cross-blur** (the default) |
| A whole content page loads: article, docs page, product detail, first load of a route | **2 Synced shimmer sweep** |
| Many items with the same shape in a grid: catalogue, gallery, thumbnails, marketplace, file browser | **3 Ripple wave** |
| An AI feature returns UI (a generated report, card, chart or component), or a demo or launch moment | **4 Dot wireframe build** |

- **Unsure?** Use 1. It is calm, cheap (opacity only) and fits anywhere.
- **A site can mix effects,** one per region. A shop might use 3 on the catalogue, 2 on product pages and 1 for the reviews list. Don't stack two effects on the same region.
- **Effect 2's sweep is only worth it over a large area.** For one small widget, use 1.
- **Effect 3 needs a real grid.** In a single-column list the wave just reads as a slow pulse; use 1.
- **Effect 4 is a moment, not a loading state.** It idles while the request runs, then spends about 2.3 s tracing and scanning *after* the data arrives, so it delays the result on purpose. Use it on one element at a time, never on things that load often (route changes, list rows) or on small elements (under ~120 px). When you use it, tell the user about the 2.3 s cost.

## Layout rules

These rules make the difference between a skeleton that looks designed and one that looks broken. Each one exists because breaking it produces a visible bug.

- **Mirror the real layout.** Use the same container, grid, gaps and padding, with bones where the text lines, images, avatars and buttons will be. Reuse the component's own *layout* classes (grid, card wrapper, padding) for the skeleton's containers, so the skeleton follows the layout when it changes.
- **Never put content-styling classes on bones.** Use `sk-bone`, `sk-line` and `sk-round` plus inline sizes. A bone that also carries `card-image` or `tile` inherits that class's background and stops looking like a bone. This exact bug turned up while building these effects.
- **The skeleton must never be taller than the content.** Each skeleton and its content share one grid cell (`.sk-swap`), and the cell takes the height of the taller layer. A content layer that is taller is fine, because the content fills that space when it arrives. A skeleton that is taller leaves a gap that snaps shut after the reveal. So:
  - For text, use as many line bones as the real text takes at the most common width, or fewer when unsure.
  - For media, use the same `aspect-ratio` or fixed size as the real media.
  - Bone lines are shorter than text lines (10–11 px against a ~22–26 px line height). Match the line count, not the height.
- **Keep static chrome real.** Headings, tabs, filters and nav that don't depend on the data render normally. Only data regions get bones.
- **Count:** render about what fills the first viewport or one page of results (typically 4–8 rows or 6–8 cards), not 20.
- **Vary line widths** (roughly 55–95 %), and make the last line of a paragraph clearly shorter, so the skeleton reads as text and not as a table.
- **Accessibility:** give the skeleton layer `aria-hidden="true"` and put no real text in it. Set `aria-busy="true"` on the region while loading and `"false"` after. Animations stop under `prefers-reduced-motion` (handled in `skeleton.css` and `dot-wireframe.js`). Keep that block.

## Wiring the states

Effects 1–3 share one lifecycle:

```
loading ─▶ data arrives ─▶ content mounts in .sk-content (opacity 0) ─▶ .is-revealed ─▶ after the reveal: remove skeleton layers + .is-loading
root: effect class + .is-loading + aria-busy=true          root: + .is-revealed                 root: effect class + .is-revealed
```

```html
<ul class="product-grid sk-ripple is-loading" aria-busy="true">
  <li class="sk-swap">
    <div class="sk-skeleton" aria-hidden="true">…bones…</div>
    <!-- when data arrives: <div class="sk-content">…real card…</div> -->
  </li>
</ul>
```

- **Vanilla:** `reveal(root)` from `skeleton.js` commits the hidden start state, adds `.is-revealed`, and resolves when the reveal is over. Then remove the `.sk-skeleton` layers and `.is-loading`. `restart(root)` goes back to loading from frame 0, for retries.
- **React:** don't call `reveal()` or `restart()`. They toggle classes imperatively, and React overwrites `className` on the next render, which hides the content again. Derive the classes from a phase in state instead; `references/react.md` has a drop-in hook.
- **Errors:** replace the skeleton with the error state directly, without a reveal animation. On retry, go back to loading.
- **Item count differs from the skeleton count:** put the first items into the existing slots. Append extra items as `.sk-swap` slots that have only content; they reveal in the stagger. Remove slots that aren't needed.

## Installing the assets

1. Copy the files you need from `assets/` into the project (for example `src/lib/skeleton/` or `public/vendor/`). Keep them as they are. The durations, distances and easings are tuned together, so change only the tokens.
2. Load `skeleton.css` **globally** once. The `sk-` classes must not be hashed, so don't import the file as a CSS module. In Next.js, import it from `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages Router), or `@import` it from the global stylesheet.
3. Map the tokens to the project's theme. Set `--sk-bone` one step darker than the surface the bones sit on, and `--sk-bone-hi` one step lighter. If the project switches dark mode with a class (for example Tailwind's `.dark`), copy the dark values to that selector, because the bundled file uses `prefers-color-scheme` and `[data-theme="dark"]`.
4. Import the helpers only in client code. They touch `window` and the DOM; in Next.js, use them in a `"use client"` component inside effects.

## Checklist

- Look at the loading state and the reveal with the network throttled, or with a temporary artificial delay, in light and dark. If you can't run a browser, say so and list what the user should look at.
- Nothing below the region moves at the reveal (see the height rule).
- Under reduced motion the bones hold still and the reveal is a 200 ms fade.
- A background refresh does not bring the skeleton back.
- The spinner or blank state that was replaced is fully removed, along with its now-unused CSS.
- No new dependencies were added; the bundled files have none.

## Credits

The patterns and timings are adapted from [transitions.dev](https://github.com/Jakubantalik/transitions.dev) by Jakub Antalik: its skeleton loader and reveal, texts reveal and UI generation. The code in `assets/` is a new implementation.
