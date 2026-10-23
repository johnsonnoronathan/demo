/* Learner progress, kept in this browser only. Shared by the page scripts and the video player. */
export interface VideoProgress { seen: string; pos: number; total: number }
export interface Progress {
  visited: Record<string, number>;
  done: Record<string, number>;
  exercises: Record<string, number>;
  videos: Record<string, VideoProgress>;
  quizzes: Record<string, { answers: number[]; score: number; passed: boolean }>;
}

const KEY = "testbench:progress";

export function load(): Progress {
  const empty: Progress = { visited: {}, done: {}, exercises: {}, videos: {}, quizzes: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...empty, ...JSON.parse(raw) };
  } catch {}
  return empty;
}

export function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** Share of a video's seconds that were actually played (scrubbing past doesn't count). */
export function watched(v: VideoProgress | undefined) {
  if (!v || !v.total) return 0;
  let n = 0;
  for (const c of v.seen) if (c === "1") n++;
  return Math.min(1, n / Math.ceil(v.total));
}
