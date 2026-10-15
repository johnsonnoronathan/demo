# React and Next.js wiring

The CSS and the measuring helpers work unchanged in React. The one difference is **who owns the classes**. `reveal()` and `restart()` toggle classes imperatively, and React rewrites `className` on its next render, which would hide the content again. So in React, derive the root's classes from a phase held in state. Use the hook below for effects 1–3 and `useDotWireframe` for effect 4.

In Next.js, put these in `"use client"` components. Import `skeleton.css` globally (`app/layout.tsx` or `pages/_app.tsx`), not as a CSS module, so the `sk-` class names stay unhashed.

## Contents

- `useSkeletonPhase`: the shared lifecycle for effects 1–3
- Effect 1 example: a list
- Effect 3 example: a product grid with SWR
- Effect 2 example: an article page
- `useDotWireframe`: effect 4

## useSkeletonPhase (effects 1–3)

```jsx
// lib/skeleton/useSkeletonPhase.js
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { revealDuration } from "./skeleton.js";

// loading ──(data)──▶ mounting ──(next layout pass)──▶ revealing ──(reveal time)──▶ done
const CLASSES = {
  loading: "is-loading",
  mounting: "is-loading",            // content is in the DOM at opacity 0
  revealing: "is-loading is-revealed",
  done: "is-revealed",
};

export function useSkeletonPhase(ready, rootRef, { sync } = {}) {
  const [phase, setPhase] = useState(ready ? "done" : "loading");
  const syncRef = useRef(null);

  // Nothing to show any more (e.g. a new key with no cached data): back to the skeleton.
  // Background revalidation keeps `ready` true, so it never brings the skeleton back.
  useEffect(() => { if (!ready) setPhase("loading"); }, [ready]);
  useEffect(() => { if (ready && phase === "loading") setPhase("mounting"); }, [ready, phase]);

  // Effects 2 and 3: measure the bones while the skeleton is on screen.
  const measuring = Boolean(sync) && phase !== "done";
  useLayoutEffect(() => {
    if (!measuring || !rootRef.current) return;
    syncRef.current = sync(rootRef.current);
    return () => { syncRef.current?.disconnect(); syncRef.current = null; };
  }, [measuring, sync, rootRef]);

  // The content has mounted hidden: commit that start state, then flip to revealed in the same frame.
  useLayoutEffect(() => {
    if (phase !== "mounting") return;
    syncRef.current?.update();                 // rank items that only exist as content
    void rootRef.current?.offsetWidth;
    setPhase("revealing");
  }, [phase, rootRef]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const t = setTimeout(() => setPhase("done"), revealDuration(rootRef.current));
    return () => clearTimeout(t);
  }, [phase, rootRef]);

  // Until the effect above catches up, never render content for data that is gone.
  const current = ready ? phase : "loading";
  return {
    phase: current,
    className: CLASSES[current],
    showSkeleton: current !== "done",
    showContent: current !== "loading",
    busy: current !== "done",
  };
}
```

Pass `sync` as a module-level function (`syncSweep`, `syncRipple`), not an inline arrow, so the layout effect doesn't re-run on every render.

## Effect 1 example: a list

```jsx
"use client";
import { useRef } from "react";
import { useSkeletonPhase } from "@/lib/skeleton/useSkeletonPhase";

const ROWS = 5;

export function NotificationList({ items }) {          // items: undefined while loading
  const ref = useRef(null);
  const sk = useSkeletonPhase(items !== undefined, ref);
  const count = sk.showContent ? items.length : ROWS;

  return (
    <ul ref={ref} className={`notification-list sk-pulse ${sk.className}`} aria-busy={sk.busy}>
      {Array.from({ length: count }, (_, i) => (
        // Slots are keyed by position so skeleton and content share one element through the swap.
        <li key={i} className="sk-swap">
          {sk.showSkeleton && i < ROWS && <RowSkeleton />}
          {sk.showContent && <NotificationRow className="sk-content" item={items[i]} />}
        </li>
      ))}
    </ul>
  );
}

function RowSkeleton() {
  return (
    <div className="sk-skeleton notification-row-layout" aria-hidden="true">
      <span className="sk-bone sk-round" style={{ width: 36, height: 36 }} />
      <span className="sk-stack" style={{ gap: 9, paddingTop: 4 }}>
        <span className="sk-bone sk-line" style={{ width: "64%" }} />
        <span className="sk-bone sk-line" style={{ width: "40%" }} />
      </span>
    </div>
  );
}
```

- The content component must accept `className` and put `sk-content` on its outermost element, which must be the direct child of the `.sk-swap`.
- Slots are keyed by position (`key={i}`), which is right for display-only rows. If rows hold local state (an open menu, a text input) and the list can reorder, key the content by `item.id` inside the slot. Re-keying the slot itself would remount the skeleton mid-swap and the images after it.

## Effect 3 example: a product grid with SWR

```jsx
"use client";
import { useRef } from "react";
import useSWR from "swr";
import { syncRipple } from "@/lib/skeleton/skeleton.js";
import { useSkeletonPhase } from "@/lib/skeleton/useSkeletonPhase";
import styles from "./ProductGrid.module.css";

const CARDS = 8;

export function ProductGrid() {
  const { data, error, mutate } = useSWR("/api/products", fetcher);
  const ref = useRef(null);
  const sk = useSkeletonPhase(data !== undefined, ref, { sync: syncRipple });

  if (error) return <ErrorState onRetry={() => mutate()} />;
  const count = sk.showContent ? data.length : CARDS;

  return (
    <ul ref={ref} className={`${styles.grid} sk-ripple ${sk.className}`} aria-busy={sk.busy}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="sk-swap">
          {sk.showSkeleton && i < CARDS && (
            <div className={`sk-skeleton ${styles.card}`} aria-hidden="true">
              <span className="sk-bone" style={{ width: "100%", aspectRatio: "1", borderRadius: 10 }} />
              <span style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingTop: 6 }}>
                <span className="sk-bone sk-line" style={{ width: "58%" }} />
                <span className="sk-bone sk-line" style={{ width: "18%" }} />
              </span>
            </div>
          )}
          {sk.showContent && <ProductCard className={`sk-content ${styles.card}`} product={data[i]} />}
        </li>
      ))}
    </ul>
  );
}
```

`styles.card` is a layout class, which is fine on the skeleton container. The image's own class (`styles.image`) stays off the image bone.

## Effect 2 example: an article page

```jsx
"use client";
import { useRef } from "react";
import { syncSweep } from "@/lib/skeleton/skeleton.js";
import { useSkeletonPhase } from "@/lib/skeleton/useSkeletonPhase";

export function Article({ post }) {                       // post: undefined while loading
  const ref = useRef(null);
  const sk = useSkeletonPhase(post !== undefined, ref, { sync: syncSweep });
  const show = sk.showContent, skel = sk.showSkeleton;

  return (
    <article ref={ref} className={`article sk-sweep ${sk.className}`} aria-busy={sk.busy}>
      <div className="sk-swap">
        {skel && <div className="sk-skeleton sk-stack" aria-hidden="true">
          <span className="sk-bone" style={{ height: 20, width: "92%" }} />
          <span className="sk-bone" style={{ height: 20, width: "56%" }} />
        </div>}
        {show && <h1 className="sk-content article-title">{post.title}</h1>}
      </div>
      <div className="sk-swap">
        {skel && <div className="sk-skeleton" aria-hidden="true">
          <span className="sk-bone" style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 10 }} />
        </div>}
        {show && <img className="sk-content article-cover" src={post.cover} alt="" width={1600} height={900} />}
      </div>
      <div className="sk-swap">
        {skel && <div className="sk-skeleton sk-stack" aria-hidden="true" style={{ gap: 15, paddingTop: 8 }}>
          {["100%", "97%", "99%", "62%"].map((w, i) => <span key={i} className="sk-bone sk-line" style={{ width: w }} />)}
        </div>}
        {show && <div className="sk-content article-body" dangerouslySetInnerHTML={{ __html: post.html }} />}
      </div>
    </article>
  );
}
```

## useDotWireframe (effect 4)

```jsx
// lib/skeleton/useDotWireframe.js
import { useLayoutEffect, useRef, useState } from "react";
import { createDotWireframe } from "./dot-wireframe.js";

// status: "idle" | "pending" | "done" | "error"; `result` changes when a new result renders.
// Returns { building }: true while the request runs AND while the result is traced and scanned
// in, so the trigger can stay disabled and aria-busy set until the card is fully there.
export function useDotWireframe(targetRef, contentRef, { status, result, labels = true }) {
  const wf = useRef(null);
  const [revealing, setRevealing] = useState(false);

  useLayoutEffect(() => {
    wf.current = createDotWireframe(targetRef.current, { labels });
    return () => { wf.current.destroy(); wf.current = null; };
  }, [targetRef, labels]);

  useLayoutEffect(() => {
    if (status === "pending") wf.current?.wait();
    if (status === "error") wf.current?.cancel();
  }, [status]);

  // Layout effect: reveal() must hide the new content before the browser paints it.
  useLayoutEffect(() => {
    const el = contentRef.current, w = wf.current;
    if (status !== "done" || !result || !el || !w) return;
    let live = true;
    const run = () => w.reveal(el).then(() => { if (live) setRevealing(false); });
    setRevealing(true);
    if (document.fonts?.status === "loading") {
      // Text lines are measured from the rendered text: wait for web fonts, hidden meanwhile.
      el.style.opacity = "0";
      document.fonts.ready.then(() => { if (live) run(); });
    } else {
      run();
    }
    return () => { live = false; setRevealing(false); };
  }, [status, result, contentRef]);

  return { building: status === "pending" || revealing };
}
```

```jsx
"use client";
import { useRef, useState } from "react";
import { useDotWireframe } from "@/lib/skeleton/useDotWireframe";

const FIELD_HEIGHT = 320; // about a typical result's height, never more

export function SummaryCard() {
  const [state, setState] = useState({ status: "idle", summary: null });
  const [fieldHeight, setFieldHeight] = useState(FIELD_HEIGHT);
  const targetRef = useRef(null);
  const contentRef = useRef(null);
  const { building } = useDotWireframe(targetRef, contentRef, { status: state.status, result: state.summary });

  async function generate() {
    // Regenerate keeps the current card's height, so the area doesn't collapse while waiting.
    setFieldHeight(state.status === "done" ? targetRef.current.offsetHeight : FIELD_HEIGHT);
    setState({ status: "pending", summary: null });
    try {
      const res = await fetch("/api/summarize", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: "done", summary: await res.json() });
    } catch (error) {
      setState({ status: "error", summary: null, error });
    }
  }

  return (
    <>
      <button onClick={generate} disabled={building}>
        {building ? "Generating…" : state.summary ? "Regenerate" : "Generate summary"}
      </button>
      <section
        ref={targetRef}
        className="summary-card"
        style={{ minHeight: state.status === "pending" ? fieldHeight : undefined }}
        aria-busy={building}
      >
        {state.status === "error" && <p className="summary-error">Something went wrong. Please try again.</p>}
        {state.summary && <div ref={contentRef}>{/* KPI tiles, insights, table */}</div>}
      </section>
    </>
  );
}
```

- The canvas is appended inside the target outside React's control. React leaves nodes it didn't create alone, so this is safe. Don't render the target conditionally, or the canvas goes with it.
- `min-height` while pending gives the dot field room. Keep it at or under a typical result's height, so the card never shrinks when the result lands.
- The labels sit in the 22 px above the target. Leave about 20 px of space there, or pass `labels: false`.
- Write the result's JSX as you normally would. Adjacent text pieces on one line (for example `{sign}{value}%`) are traced as a single line.
- In React Strict Mode (development), the hook creates, destroys and recreates the canvas once on mount. That's expected.
