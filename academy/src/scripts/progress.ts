/* Learner progress, kept in this browser.
 * Pages opt in with data attributes, so the markup stays static and readable:
 *   body[data-lesson]                  this page is a lesson; mark it visited
 *   [data-progress-link="path"]        a link to a lesson; gets is-visited / is-done
 *   [data-progress-exercise="key"]     an exercise checkbox
 *   [data-complete="path"]             the "mark complete" button
 *   [data-chapter-progress="p1 p2…"]   a progress meter over those lessons
 *   [data-continue="p1 p2…"]           a link that goes to the first unfinished lesson
 */
interface Progress {
  visited: Record<string, number>;
  done: Record<string, number>;
  exercises: Record<string, number>;
}
const KEY = "testbench:progress";

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { visited: {}, done: {}, exercises: {}, ...JSON.parse(raw) };
  } catch {}
  return { visited: {}, done: {}, exercises: {} };
}
const state = load();
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

const lesson = document.body.dataset.lesson;
if (lesson) {
  state.visited[lesson] = Date.now();
  save();
}

function paint() {
  document.querySelectorAll<HTMLElement>("[data-progress-link]").forEach((a) => {
    const p = a.dataset.progressLink!;
    a.classList.toggle("is-done", !!state.done[p]);
    a.classList.toggle("is-visited", !!state.visited[p] && !state.done[p]);
  });
  document.querySelectorAll<HTMLElement>("[data-chapter-progress]").forEach((m) => {
    const paths = m.dataset.chapterProgress!.split(" ");
    const n = paths.filter((p) => state.done[p]).length;
    m.style.setProperty("--done", String(n / paths.length));
    const label = m.querySelector(".cp-label");
    if (label) label.textContent = `${n} of ${paths.length} done`;
  });
  document.querySelectorAll<HTMLAnchorElement>("[data-continue]").forEach((a) => {
    const paths = a.dataset.continue!.split(" ");
    const next = paths.find((p) => !state.done[p]);
    const started = paths.some((p) => state.visited[p]);
    if (next && started) {
      // Reuse the page's own link to that lesson, so the URL is always one the site built.
      const link = document.querySelector<HTMLAnchorElement>(`[data-progress-link="${next}"]`);
      a.href = link ? link.href : `/${next}/`;
      a.textContent = a.dataset.continueLabel ?? "Continue";
    } else if (!next) {
      a.textContent = "Review the course";
    }
  });
  document.querySelectorAll<HTMLButtonElement>("[data-complete]").forEach((b) => {
    const done = !!state.done[b.dataset.complete!];
    b.setAttribute("aria-pressed", String(done));
    b.textContent = done ? "✓ Completed" : "Mark this page complete";
  });
}

document.querySelectorAll<HTMLInputElement>("[data-progress-exercise]").forEach((box) => {
  const key = box.dataset.progressExercise!;
  box.checked = !!state.exercises[key];
  box.addEventListener("change", () => {
    if (box.checked) state.exercises[key] = Date.now();
    else delete state.exercises[key];
    save();
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-complete]").forEach((b) => {
  b.addEventListener("click", () => {
    const p = b.dataset.complete!;
    if (state.done[p]) delete state.done[p];
    else state.done[p] = Date.now();
    save();
    paint();
  });
});

paint();
