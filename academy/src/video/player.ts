/* <tb-video>: a clock, narration and controls around a scripted stage.
 *
 * The clock is the source of truth. Narration uses the browser's speech synthesis
 * when it has a voice for the page's language: each cue is spoken as the playhead
 * enters it, and if the voice runs long the clock waits at the cue's end instead of
 * cutting it off. Without a voice, the video plays on its clock with captions.
 */
import type { VideoDef } from "./types";
import { timeline, sceneAt, cueAt, cuePos, type Timeline } from "./timeline";
import { buildPane, setChipLabels, type PaneView } from "./panes";
import { load, save } from "../scripts/store";

const W = 960, H = 540;
const RATES = [0.75, 1, 1.25, 1.5, 2];
const fmt = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, "0")}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.6 4.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 4v6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  voice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h4l5-4v13l-5-4H4z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  cc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 10.2a2.3 2.3 0 1 0 0 3.6M17 10.2a2.3 2.3 0 1 0 0 3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

interface Data {
  key: string;
  video: VideoDef;
  speech: string;
  mark: string;
  next?: { title: string; href: string };
  s: Record<string, string>;
  chips?: Record<string, string>;
}

function pickVoice(lang: string) {
  if (!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(lang.toLowerCase()));
  if (!voices.length) return null;
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online|premium|enhanced/i.test(v.name) ? 4 : 0) + (/google|samantha|daniel|aria|jenny|xiaoxiao|kyoko|yuna/i.test(v.name) ? 2 : 0) + (v.localService ? 0 : 1);
  return voices.sort((a, b) => score(b) - score(a))[0];
}

class TbVideo extends HTMLElement {
  private d!: Data;
  private tl!: Timeline;
  private t = 0;
  private rate = 1;
  private captions = true;
  private narrate = true;
  private playing = false;
  private started = false;
  private voice: SpeechSynthesisVoice | null = null;
  private speakingCue = -1;
  private speechStarted = false;
  private speechQueuedAt = 0;
  private heldSince = 0;
  private last = 0;
  private raf = 0;
  private sceneIndex = -1;
  private panes: PaneView[] = [];
  private lastCue = -1;
  private seen: number[] = [];
  private saveTimer = 0;
  private ui: Record<string, HTMLElement> = {};
  private canvas!: HTMLElement;
  private segs: { node: HTMLElement; fill: HTMLElement; start: number; dur: number }[] = [];

  connectedCallback() {
    if (this.d) return;
    const raw = this.querySelector("script.vid-data")?.textContent;
    if (!raw) return;
    this.d = JSON.parse(raw);
    this.tl = timeline(this.d.video);
    const prefs = this.prefs();
    this.rate = prefs.rate ?? 1;
    this.captions = prefs.captions ?? true;
    this.narrate = prefs.narrate ?? true;
    const rec = load().videos[this.d.key];
    if (rec) {
      this.seen = [...rec.seen].map((c) => (c === "1" ? 1 : 0));
      if (rec.pos > 0.5 && rec.pos < this.tl.total - 1) this.t = rec.pos;
    }
    this.voice = pickVoice(this.d.speech);
    if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", () => { this.voice = pickVoice(this.d.speech); this.sync(); });
    this.build();
    this.render();
    this.sync();
  }

  disconnectedCallback() {
    this.pause();
  }

  private s(key: string, vars: Record<string, string> = {}) {
    return (this.d.s[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  }

  private prefs(): { rate?: number; captions?: boolean; narrate?: boolean } {
    try { return JSON.parse(localStorage.getItem("testbench:video-prefs") || "{}"); } catch { return {}; }
  }
  private setPref(p: object) {
    try { localStorage.setItem("testbench:video-prefs", JSON.stringify({ ...this.prefs(), ...p })); } catch {}
  }

  /* DOM ------------------------------------------------------------------ */
  private build() {
    const s = this.s.bind(this);
    this.tabIndex = 0;
    this.setAttribute("aria-label", s("video.label", { title: this.d.video.title }));
    const wrap = document.createElement("div");
    wrap.className = "vid";
    wrap.innerHTML = `
      <div class="vid-screen">
        <div class="vid-stage"><div class="vid-canvas"><div class="vid-chapter"></div><div class="vid-mark"></div><div class="vid-layer"></div><div class="vid-caption"></div></div></div>
        <button class="vid-big" type="button"><span class="vid-big-icon">${ICON.play}</span><span class="vid-big-label"></span></button>
        <div class="vid-end" hidden></div>
      </div>
      <div class="vid-ccbar" aria-hidden="true"></div>
      <div class="vid-controls">
        <div class="vid-scrub" role="slider" tabindex="0" aria-label="${esc(s("video.seek"))}" aria-valuemin="0" aria-valuemax="${Math.round(this.tl.total)}"><div class="vid-tip" hidden></div></div>
        <div class="vid-row">
          <button class="vid-btn vid-play" type="button">${ICON.play}</button>
          <span class="vid-time"></span>
          <span class="vid-chap"></span>
          <span class="vid-spacer"></span>
          <button class="vid-btn vid-rate" type="button" title="${esc(s("video.speed"))}" aria-label="${esc(s("video.speed"))}">1×</button>
          <button class="vid-btn vid-voice" type="button">${ICON.voice}</button>
          <button class="vid-btn vid-cc" type="button" title="${esc(s("video.captions"))}" aria-label="${esc(s("video.captions"))}">${ICON.cc}</button>
          <button class="vid-btn vid-full" type="button" title="${esc(s("video.fullscreen"))}" aria-label="${esc(s("video.fullscreen"))}">${ICON.full}</button>
        </div>
      </div>`;
    this.appendChild(wrap);
    const q = (sel: string) => wrap.querySelector<HTMLElement>(sel)!;
    this.ui = {
      stage: q(".vid-stage"), big: q(".vid-big"), bigLabel: q(".vid-big-label"), end: q(".vid-end"), ccbar: q(".vid-ccbar"),
      scrub: q(".vid-scrub"), tip: q(".vid-tip"), play: q(".vid-play"), time: q(".vid-time"), chap: q(".vid-chap"),
      rate: q(".vid-rate"), voice: q(".vid-voice"), cc: q(".vid-cc"), full: q(".vid-full"),
      chapter: q(".vid-chapter"), mark: q(".vid-mark"), layer: q(".vid-layer"), caption: q(".vid-caption"),
    };
    this.canvas = q(".vid-canvas");
    this.ui.mark.textContent = this.d.mark;

    this.segs = this.tl.scenes.map((sc) => {
      const node = document.createElement("div");
      node.className = "vid-seg";
      node.style.flexGrow = String(sc.dur);
      node.innerHTML = '<i class="vid-seen"></i><i class="vid-fill"></i>';
      this.ui.scrub.insertBefore(node, this.ui.tip);
      return { node, fill: node.lastElementChild as HTMLElement, start: sc.start, dur: sc.dur };
    });

    this.ui.big.addEventListener("click", () => { this.toggle(); this.focus({ preventScroll: true }); });
    this.ui.play.addEventListener("click", () => this.toggle());
    this.ui.stage.addEventListener("click", () => this.toggle());
    this.ui.rate.addEventListener("click", () => this.setRate(RATES[(RATES.indexOf(this.rate) + 1) % RATES.length]));
    this.ui.voice.addEventListener("click", () => this.setNarrate(!this.narrate));
    this.ui.cc.addEventListener("click", () => this.setCaptions(!this.captions));
    this.ui.full.addEventListener("click", () => this.fullscreen());

    const scrub = this.ui.scrub;
    let dragging = false, wasPlaying = false;
    const timeAt = (e: PointerEvent) => {
      const r = scrub.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * this.tl.total;
    };
    scrub.addEventListener("pointerdown", (e) => {
      dragging = true; wasPlaying = this.playing;
      if (wasPlaying) this.pause();
      scrub.setPointerCapture(e.pointerId);
      this.seek(timeAt(e));
    });
    scrub.addEventListener("pointermove", (e) => {
      const t = timeAt(e);
      this.ui.tip.hidden = false;
      this.ui.tip.innerHTML = `<b>${fmt(t)}</b> ${esc(sceneAt(this.tl, t).def.label)}`;
      const r = scrub.getBoundingClientRect();
      this.ui.tip.style.left = Math.max(60, Math.min(r.width - 60, e.clientX - r.left)) + "px";
      if (dragging) this.seek(t);
    });
    scrub.addEventListener("pointerleave", () => { if (!dragging) this.ui.tip.hidden = true; });
    const end = () => { if (!dragging) return; dragging = false; this.ui.tip.hidden = true; if (wasPlaying) this.play(); };
    scrub.addEventListener("pointerup", end);
    scrub.addEventListener("pointercancel", end);

    document.addEventListener("keydown", (e) => this.key(e));
    let idle = 0;
    this.addEventListener("pointermove", () => {
      this.classList.remove("idle");
      clearTimeout(idle);
      idle = window.setTimeout(() => { if (this.playing) this.classList.add("idle"); }, 2600);
    });
    document.addEventListener("fullscreenchange", () => { this.classList.toggle("is-full", document.fullscreenElement === this); this.fit(); });

    // Chapter and transcript links anywhere on the page.
    document.querySelectorAll<HTMLElement>("[data-video-chapter]").forEach((b) =>
      b.addEventListener("click", () => { this.seek(this.tl.scenes[Number(b.dataset.videoChapter)].start + 0.001); this.play(); this.scrollIntoView({ behavior: "smooth", block: "center" }); })
    );
    document.querySelectorAll<HTMLElement>("[data-video-cue]").forEach((b) =>
      b.addEventListener("click", () => { this.seek(this.tl.cues[Number(b.dataset.videoCue)].start + 0.001); this.play(); })
    );

    new ResizeObserver(() => this.fit()).observe(this.ui.stage);
    this.fit();
    window.addEventListener("pagehide", () => this.persist());
  }

  private fit() {
    const w = this.ui.stage.clientWidth || W, h = this.ui.stage.clientHeight || (w * H) / W;
    const k = Math.min(w / W, h / H);
    this.canvas.style.transform = `translate(${(w - W * k) / 2}px, ${(h - H * k) / 2}px) scale(${k})`;
    this.classList.toggle("narrow", this.clientWidth < 600);
  }

  /* Rendering -------------------------------------------------------------- */
  private buildScene(index: number) {
    const def = this.tl.scenes[index].def;
    this.sceneIndex = index;
    this.ui.chapter.innerHTML = `<b>${String(index + 1).padStart(2, "0")}</b> ${esc(def.label)}`;
    const wrap = document.createElement("div");
    wrap.className = `vid-scene layout-${def.layout || "full"}`;
    if (def.cols) wrap.style.gridTemplateColumns = def.cols;
    setChipLabels(this.d.chips);
    this.panes = def.panes.map((pd) => {
      const pv = buildPane(pd, { cues: def.cues.length });
      wrap.appendChild(pv.el);
      return pv;
    });
    this.ui.layer.replaceChildren(wrap);
    void wrap.offsetWidth; // commit hidden state so the first reveals animate
  }

  private render() {
    const t = this.t, tl = this.tl;
    const sc = sceneAt(tl, t);
    if (sc.index !== this.sceneIndex) this.buildScene(sc.index);
    const p = cuePos(sc, t);
    this.panes.forEach((pn) => pn.update(p));
    const ci = cueAt(tl, t);
    const text = this.captions ? tl.cues[ci].text : "";
    if (this.ui.caption.textContent !== text) { this.ui.caption.textContent = text; this.ui.ccbar.textContent = text; }
    this.ui.caption.hidden = !text;
    for (const s of this.segs) {
      s.fill.style.transform = `scaleX(${Math.max(0, Math.min(1, (t - s.start) / s.dur))})`;
      let n = 0;
      for (let i = Math.floor(s.start); i < Math.ceil(s.start + s.dur); i++) if (this.seen[i]) n++;
      s.node.classList.toggle("seen", n / Math.max(1, Math.ceil(s.dur)) > 0.9);
    }
    this.ui.time.textContent = `${fmt(t)} / ${fmt(tl.total)}`;
    this.ui.scrub.setAttribute("aria-valuenow", String(Math.round(t)));
    this.ui.scrub.setAttribute("aria-valuetext", `${fmt(t)} / ${fmt(tl.total)}`);
    this.ui.chap.textContent = sc.def.label;
    if (ci !== this.lastCue) {
      this.lastCue = ci;
      document.querySelectorAll<HTMLElement>("[data-video-cue]").forEach((b) => b.classList.toggle("current", Number(b.dataset.videoCue) === ci));
      document.querySelectorAll<HTMLElement>("[data-video-chapter]").forEach((b) => b.classList.toggle("current", Number(b.dataset.videoChapter) === sc.index));
    }
  }

  private sync() {
    const u = this.ui, s = this.s.bind(this);
    u.play.innerHTML = this.playing ? ICON.pause : ICON.play;
    u.play.setAttribute("aria-label", this.playing ? s("video.pause") : s("video.play"));
    u.rate.textContent = this.rate + "×";
    u.cc.setAttribute("aria-pressed", String(this.captions));
    const speak = !!this.voice;
    (u.voice as HTMLButtonElement).disabled = !speak;
    u.voice.setAttribute("aria-pressed", String(speak && this.narrate));
    u.voice.title = speak ? s("video.narration") : s("video.noVoice");
    u.voice.setAttribute("aria-label", u.voice.title);
    this.classList.toggle("playing", this.playing);
    this.classList.toggle("started", this.started);
    const ended = this.t >= this.tl.total - 0.01;
    u.big.hidden = this.playing || ended || this.started;
    u.bigLabel.textContent = this.t > 0.05 ? s("video.resume", { t: fmt(this.t) }) : s("video.playFor", { t: fmt(this.tl.total) });
  }

  /* Narration -------------------------------------------------------------- */
  private speak(ci: number, from = 0) {
    if (!this.narrate || !this.voice) return;
    speechSynthesis.cancel();
    const text = this.tl.cues[ci].text;
    const cjk = /[぀-ヿ㐀-鿿가-힯]/.test(text);
    const parts = cjk ? [...text] : text.split(/\s+/);
    const start = Math.floor(from * parts.length);
    if (start >= parts.length - 1) return;
    const u = new SpeechSynthesisUtterance(parts.slice(start).join(cjk ? "" : " "));
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = this.rate;
    this.speakingCue = ci;
    this.speechStarted = false;
    this.speechQueuedAt = performance.now();
    u.onstart = () => (this.speechStarted = true);
    u.onend = u.onerror = () => { if (this.speakingCue === ci) this.speakingCue = -1; };
    speechSynthesis.speak(u);
  }
  private hush() {
    this.speakingCue = -1;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  private speakHere() {
    const ci = cueAt(this.tl, this.t), cue = this.tl.cues[ci];
    this.speak(ci, (this.t - cue.start) / cue.dur);
  }

  /* Clock ------------------------------------------------------------------ */
  play() {
    if (this.playing) return;
    if (this.t >= this.tl.total - 0.01) this.seek(0);
    this.playing = this.started = true;
    this.ui.end.hidden = true;
    this.last = performance.now();
    this.speakHere();
    const tick = (now: number) => {
      if (!this.playing) return;
      this.step(now);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
    this.sync();
  }

  private step(now: number) {
    const dt = Math.max(0, Math.min(0.25, (now - this.last) / 1000));
    this.last = now;
    const tl = this.tl;
    const ci = cueAt(tl, this.t), cue = tl.cues[ci];
    let next = this.t + dt * this.rate;
    const end = cue.start + cue.dur;
    // Hold at the end of a cue while its narration is still speaking.
    if (next >= end && this.speakingCue === ci && this.narrate) {
      if (!this.heldSince) this.heldSince = now;
      const stalled = !this.speechStarted && now - this.speechQueuedAt > 1500;
      if (now - this.heldSince < 6000 && !stalled) next = end - 0.0005;
      else this.speakingCue = -1;
    } else if (next < end) this.heldSince = 0;
    this.seen[Math.floor(this.t)] = 1;
    if (next >= tl.total) {
      this.t = tl.total;
      this.pause();
      this.render();
      this.ended();
      return;
    }
    const nci = cueAt(tl, next);
    this.t = next;
    if (nci !== ci) { this.heldSince = 0; this.speak(nci, 0); }
    this.render();
    if (!this.saveTimer) this.saveTimer = window.setTimeout(() => { this.saveTimer = 0; this.persist(); }, 2000);
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.hush();
    this.sync();
    this.persist();
  }

  toggle() {
    this.playing ? this.pause() : this.play();
  }

  seek(t: number) {
    this.t = Math.max(0, Math.min(this.tl.total, t));
    this.heldSince = 0;
    if (this.t < this.tl.total) this.ui.end.hidden = true;
    this.render();
    if (this.playing) this.speakHere();
    this.sync();
  }

  private persist() {
    const store = load();
    let seen = "";
    for (let i = 0; i < Math.ceil(this.tl.total); i++) seen += this.seen[i] ? "1" : "0";
    store.videos[this.d.key] = { seen, pos: this.t >= this.tl.total - 1 ? 0 : this.t, total: this.tl.total };
    save(store);
    document.dispatchEvent(new CustomEvent("tb:progress"));
  }

  private ended() {
    const s = this.s.bind(this);
    const n = this.d.next;
    this.ui.end.hidden = false;
    this.ui.end.innerHTML = `<div class="vid-end-card"><p class="vid-end-kicker">${esc(s("video.done"))}</p><h3>${esc(this.d.video.title)}</h3><div class="vid-end-actions">
      <a class="vid-ebtn vid-ebtn-primary" href="#lesson">${esc(s("video.readOn"))}</a>
      ${n ? `<a class="vid-ebtn" href="${esc(n.href)}">${esc(s("video.nextLesson", { title: n.title }))}</a>` : ""}
      <button type="button" class="vid-ebtn vid-ebtn-ghost" data-act="replay">${ICON.replay} ${esc(s("video.replay"))}</button></div></div>`;
    this.ui.end.querySelector('[data-act="replay"]')!.addEventListener("click", () => { this.seek(0); this.play(); });
    this.sync();
    this.persist();
  }

  /* Settings ----------------------------------------------------------------- */
  private setRate(r: number) { this.rate = r; if (this.playing) this.speakHere(); this.sync(); this.setPref({ rate: r }); }
  private setCaptions(v: boolean) { this.captions = v; this.render(); this.sync(); this.setPref({ captions: v }); }
  private setNarrate(v: boolean) { this.narrate = v; if (!v) this.hush(); else if (this.playing) this.speakHere(); this.sync(); this.setPref({ narrate: v }); }
  private fullscreen() {
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
    this.requestFullscreen?.().catch(() => {});
  }

  private key(e: KeyboardEvent) {
    const tg = e.target as HTMLElement;
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable) return;
    if (!this.contains(tg) && tg !== document.body && tg !== document.documentElement) return;
    if (/^(BUTTON|A|SUMMARY)$/.test(tg.tagName) && (e.key === " " || e.key === "Enter")) return;
    // Only the video nearest the top of the viewport answers page-level keys.
    if (!this.contains(tg) && document.querySelector("tb-video") !== this) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const map: Record<string, () => void> = {
      " ": () => this.toggle(), k: () => this.toggle(),
      ArrowRight: () => this.seek(this.t + 5), ArrowLeft: () => this.seek(this.t - 5),
      l: () => this.seek(this.t + 10), j: () => this.seek(this.t - 10),
      c: () => this.setCaptions(!this.captions), n: () => this.setNarrate(!this.narrate), f: () => this.fullscreen(),
      Home: () => this.seek(0), End: () => this.seek(this.tl.total),
    };
    const fn = map[k] ?? (/^[0-9]$/.test(k) ? () => this.seek((this.tl.total * Number(k)) / 10) : null);
    if (fn) { e.preventDefault(); fn(); }
  }
}

if (!customElements.get("tb-video")) customElements.define("tb-video", TbVideo);
