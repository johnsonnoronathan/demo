import type { VideoDef, VideoScene } from "./types";

export interface Cue { scene: number; index: number; start: number; dur: number; text: string }
export interface SceneSpan { def: VideoScene; index: number; start: number; dur: number; cueStarts: number[]; cueDurs: number[] }
export interface Timeline { total: number; scenes: SceneSpan[]; cues: Cue[] }

const CJK = /[぀-ヿ㐀-鿿가-힯]/g;

/** Narration pace: about 155 words a minute, or about 4.5 CJK characters a second. */
export function cueDuration(text: string) {
  const cjk = (text.match(CJK) || []).length;
  if (cjk > text.length * 0.3) return Math.max(2.4, cjk / 4.5 + 0.9);
  const words = text.trim().split(/\s+/).length;
  return Math.max(2.4, words / 2.6 + 0.9);
}

export function timeline(video: VideoDef): Timeline {
  let t = 0;
  const scenes: SceneSpan[] = [];
  const cues: Cue[] = [];
  video.scenes.forEach((def, si) => {
    const start = t, cueStarts: number[] = [], cueDurs: number[] = [];
    def.cues.forEach((text, ci) => {
      const d = cueDuration(text);
      cueStarts.push(t);
      cueDurs.push(d);
      cues.push({ scene: si, index: ci, start: t, dur: d, text });
      t += d;
    });
    scenes.push({ def, index: si, start, dur: t - start, cueStarts, cueDurs });
  });
  return { total: t, scenes, cues };
}

export function sceneAt(tl: Timeline, t: number) {
  for (let i = tl.scenes.length - 1; i >= 0; i--) if (t >= tl.scenes[i].start) return tl.scenes[i];
  return tl.scenes[0];
}

export function cueAt(tl: Timeline, t: number) {
  for (let i = tl.cues.length - 1; i >= 0; i--) if (t >= tl.cues[i].start) return i;
  return 0;
}

/** Cue position inside a scene: 2.5 means halfway through the scene's cue 2. */
export function cuePos(scene: SceneSpan, t: number) {
  for (let i = scene.cueStarts.length - 1; i >= 0; i--) {
    if (t >= scene.cueStarts[i]) return Math.min(i + (t - scene.cueStarts[i]) / scene.cueDurs[i], scene.cueStarts.length);
  }
  return 0;
}

export function durationOf(video: VideoDef) {
  return timeline(video).total;
}
