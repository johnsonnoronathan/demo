# Effect 4: Dot wireframe build

## When

An AI feature hands back UI: a generated report, summary card, chart, dashboard or component. Also launch pages, demos and onboarding moments. It tells the story of the system building the result, and because the drawing is measured from the real DOM, the outlines land exactly where the content appears.

Don't use it for:
- things that load often (route changes, list rows)
- small elements (under ~120 px)
- several elements at once

It deliberately spends about 2.3 s *after* the data arrives (1500 ms trace + 800 ms scan), so tell the user about that trade-off.

## What it does

- **`wait()`, while the request is pending:** a dot field (14 px grid) ripples out from the centre of the target over about 800 ms, then idles with a few dots twinkling. A small `FIELD 1.23s` label counts the wait above the top-left corner.
- **`reveal(content)`, when the result is rendered:**
  - The content is hidden and its structure is traced in dots, in document order. That covers boxes with a fill or full border, bottom rules, every text line, SVG text, and unfilled SVG paths such as chart lines.
  - The outline grows from the top centre, corner handles pop in, and a reticle with a coordinate readout follows the part being drawn.
  - Then a scan line moves down. Above it the real UI appears, fading in and sharpening from a 3 px blur on `cubic-bezier(0.22, 1, 0.36, 1)`, while the drawing is wiped away.
- **Reduced motion:** nothing is drawn, and the content fades in over 200 ms.

## API

```js
import { createDotWireframe } from "./dot-wireframe.js";

const wf = createDotWireframe(target, { labels: true });  // appends an aria-hidden canvas to target
wf.wait();                                // request started
await wf.reveal(contentEl);               // result rendered inside target; resolves when fully in
wf.cancel();                              // stop now, show the content as it is (errors, aborts)
wf.destroy();                             // cancel and remove the canvas (unmount)
```

| Option | Default | Notes |
| --- | --- | --- |
| `labels` | `true` | The FIELD/TRACE/SCAN tag, size label and reticle readout. Set `false` for a quieter look or when the 22 px above the target is crowded. |
| `traceMs` / `scanMs` | `1500` / `800` | Keep the total between ~1.6 and ~3.6 s. |
| `maxParts` | `90` | Lower it (~40) for very busy content, so the trace reads as a sequence. |
| `bleed` | `22` | Space around the target for labels and handles. The canvas overflows the target by this much, so the target's ancestors shouldn't clip it with `overflow: hidden` closer than that. |

Mark a child `data-sk-skip` to leave it out of the trace (a live chart canvas, a video, decoration). Mark an SVG path `data-sk-trace` to trace it even if it has a fill.

## Requirements

- **The target needs a size while waiting.** Before the result exists it is often empty, so give it a `min-height` close to the result's height while pending, and drop it when the result renders. The field fills whatever box the target has.
- **Call `reveal()` in the same frame the content mounts.** In React that means `useLayoutEffect`; in vanilla JS, right after inserting the HTML. It hides the content first, so a later call lets the finished UI flash for one frame.
- **Wait for fonts before revealing** if the result uses web fonts (`await document.fonts.ready`). Text lines are measured from the rendered text.
- **Colours:** set `--sk-gen-ink`, `--sk-gen-line`, `--sk-gen-strong` and `--sk-gen-surface` (from `skeleton.css`) on `:root` or the target. Keep them neutral greys close to the project's text colours, and let the real UI bring the colour.

## Wiring (vanilla)

```js
import { createDotWireframe } from "./dot-wireframe.js";

const target = document.querySelector("#summary");      // a card container
const wf = createDotWireframe(target);

button.addEventListener("click", async () => {
  target.querySelector(".summary-content")?.remove();   // drop the previous result, keep the canvas
  target.style.minHeight = "320px";
  target.setAttribute("aria-busy", "true");
  wf.wait();
  try {
    const summary = await generateSummary();
    const content = document.createElement("div");
    content.className = "summary-content";
    content.innerHTML = renderSummary(summary);
    target.append(content);
    target.style.minHeight = "";
    await document.fonts.ready;
    await wf.reveal(content);
  } catch (err) {
    wf.cancel();
    showError(target, err);
  } finally {
    target.setAttribute("aria-busy", "false");
  }
});
```

The canvas lives inside `target`, so never clear the target with `innerHTML = ""` or `replaceChildren()`. Remove only the previous content element.
