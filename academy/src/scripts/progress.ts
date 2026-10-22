/* Learner progress in the page. Markup opts in with data attributes, so pages stay static:
 *   body[data-lesson]                  this page is a lesson; mark it visited
 *   [data-progress-link="path"]        a link to a lesson; gets is-visited / is-done
 *   [data-video-key="key"]             a video marker; filled as the video is watched
 *   [data-progress-exercise="key"]     an exercise checkbox
 *   [data-complete="path"]             the "mark complete" button
 *   [data-chapter-progress="p1 p2…"]   a progress meter over those lessons
 *   [data-continue="p1 p2…"]           a link that goes to the first unfinished lesson
 */
import { load, save, watched } from "./store";

const state = load();

const lesson = document.body.dataset.lesson;
if (lesson) {
  state.visited[lesson] = Date.now();
  save(state);
}

function paint() {
  const s = load();
  Object.assign(state, s);
  document.querySelectorAll<HTMLElement>("[data-progress-link]").forEach((a) => {
    const p = a.dataset.progressLink!;
    a.classList.toggle("is-done", !!state.done[p]);
    a.classList.toggle("is-visited", !!state.visited[p] && !state.done[p]);
  });
  document.querySelectorAll<HTMLElement>("[data-video-key]").forEach((m) => {
    const w = watched(state.videos[m.dataset.videoKey!]);
    m.style.setProperty("--watched", String(w));
    m.classList.toggle("is-watched", w >= 0.9);
    m.classList.toggle("is-started", w > 0 && w < 0.9);
  });
  document.querySelectorAll<HTMLElement>("[data-chapter-progress]").forEach((m) => {
    const paths = m.dataset.chapterProgress!.split(" ");
    const n = paths.filter((p) => state.done[p]).length;
    m.style.setProperty("--done", String(n / paths.length));
    const label = m.querySelector<HTMLElement>(".cp-label");
    if (label) label.textContent = (label.dataset.tpl ?? "{done}/{total}").replace("{done}", String(n)).replace("{total}", String(paths.length));
  });
  document.querySelectorAll<HTMLAnchorElement>("[data-continue]").forEach((a) => {
    const paths = a.dataset.continue!.split(" ");
    const next = paths.find((p) => !state.done[p]);
    const started = paths.some((p) => state.visited[p]);
    if (next && started) {
      const link = document.querySelector<HTMLAnchorElement>(`[data-progress-link="${next}"]`);
      if (link) a.href = link.href;
      a.textContent = a.dataset.lContinue ?? a.textContent;
    } else if (!next) {
      a.textContent = a.dataset.lReview ?? a.textContent;
    }
  });
  document.querySelectorAll<HTMLButtonElement>("[data-complete]").forEach((b) => {
    const done = !!state.done[b.dataset.complete!];
    b.setAttribute("aria-pressed", String(done));
    b.textContent = (done ? b.dataset.lDone : b.dataset.lMark) ?? "";
  });
}

document.querySelectorAll<HTMLInputElement>("[data-progress-exercise]").forEach((box) => {
  const key = box.dataset.progressExercise!;
  box.checked = !!state.exercises[key];
  box.addEventListener("change", () => {
    const s = load();
    if (box.checked) s.exercises[key] = Date.now();
    else delete s.exercises[key];
    save(s);
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-complete]").forEach((b) => {
  b.addEventListener("click", () => {
    const s = load();
    const p = b.dataset.complete!;
    if (s.done[p]) delete s.done[p];
    else s.done[p] = Date.now();
    save(s);
    paint();
  });
});

document.addEventListener("tb:progress", paint);
paint();
