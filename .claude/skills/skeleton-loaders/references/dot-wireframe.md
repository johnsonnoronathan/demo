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
- **Wait for fonts before revealing** if the result uses web fonts (`await document.fonts.ready`). Text lines are measured from the rendered text. The React hook in `react.md` already does this.
- **Write the markup normally.** Text pieces that sit next to each other on one line (adjacent JSX text nodes like `{sign}{value}%`, or inline elements) are merged and traced as one line, so don't restructure the user's JSX for the trace.
- **Colours:** the `--sk-gen-*` tokens in `skeleton.css` follow the page's `color-scheme`, like the bones (see install step 3 in SKILL.md). The runtime resolves them through the browser, so `light-dark()`, `var()` and `color-mix()` values all work. Keep them neutral greys close to the project's text colours, and let the real UI bring the colour.

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

## Texts mode

The same build, narrated: generation texts appear around the element while it is drawn. Use it for showcase moments where the "an agent built this" story is the point: launch pages, demos, onboarding and product videos. For a generated result inside a busy app screen, use the plain build. It is a stylistic choice, so ask before adding the texts.

```js
const wf = createDotWireframe(card, {
  texts: true,
  steps: ["Reading the brief", "Picking components", "Writing styles", "Adding motion"],
  done: "Pricing card ready",
});
wf.wait();
// …result rendered inside card…
await wf.reveal(content);
```

| Text | Where | What it shows |
| --- | --- | --- |
| Agent log | Left of the element | `AGENT.LOG // PARTS 12/33`. While waiting: the request and the model "thinking" with a clock. Then one line per traced part: number, type (BOX, TEXT, RULE, PATH, MEDIA), selector, size, and a progress bar that ends in `[ ok ]`. |
| Motion CSS | Right of the element | `MOTION.CSS // 0300 TOKENS`. Motion tokens are typed while waiting, then one rule per selector with the element's real radius, fill, rule or type and the transition it would get, typed at a steady rate with a caret. The footer shows tokens per second, line count and WRITING / READY. |
| Step line | The label row above the element | One step at a time with a pulsing dot: `steps` in turn, then `done` during the scan. |

| Option | Default | Notes |
| --- | --- | --- |
| `texts` | `false` | Turns the texts on. |
| `steps` | `["Planning layout", "Drawing structure", "Writing styles", "Adding motion"]` | Write them for the product, for example "Reading the brief", "Picking components". |
| `done` | `"Ready"` | The last step, shown as the UI comes in. Name the result: "Invite modal ready". |
| `code` | derived | An array of lines to type in the CSS panel instead of the derived rules. Keep it under about 60 lines. |
| `title` | derived | The name in the CSS comment; otherwise the target's `aria-label` or the result's first heading. |

**Placement.** The texts are drawn only where the page is empty, checked inside the nearest clipping ancestor and the viewport with `document.elementFromPoint` when `wait()` runs (or `reveal()`, if `wait()` was skipped):

1. **Beside**: the log on the left and the CSS on the right, when at least ~200 px of empty space is free on both sides.
2. **Under**: one strip under the element with the log and the CSS side by side, when about 140 px below it is empty. Under elements narrower than 520 px they stack, log above CSS, and need about 180 px.
3. **Steps only**: otherwise just the step line above the element.

So the texts degrade on their own on narrow screens and in dense layouts. For the full version, centre the element in a section with empty space on either side, and call `wait()` when it is in view. The panels are `aria-hidden`, take no pointer input and are removed after the reveal. Under reduced motion nothing is drawn, the same as the plain build.
