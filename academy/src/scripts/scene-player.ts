import { scenes } from "../scenes";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Plays a concept scene: autoplays once when scrolled into view, pauses when it leaves. */
class TbScene extends HTMLElement {
  private draw!: (p: number) => void;
  private p = 0;
  private n = 1;
  private durations: number[] = [];
  private playing = false;
  private played = false;
  /** Before the first play, show the finished picture so the page is complete at rest. */
  private poster = true;
  private raf = 0;
  private last = 0;
  private io?: IntersectionObserver;

  connectedCallback() {
    const def = scenes[this.dataset.scene!];
    const svg = this.querySelector<SVGSVGElement>(".scene-stage svg");
    if (!def || !svg || this.draw) return;
    this.n = def.steps.length;
    // Long captions get more time; the pace is roughly reading speed.
    const captions = [...this.querySelectorAll("[data-caption]")].map((c) => c.textContent ?? "");
    this.durations = captions.map((s) => {
      const cjk = (s.match(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g) || []).length;
      const ms = cjk > s.length * 0.3 ? cjk * 220 + 1400 : s.split(/\s+/).length * 330 + 1400;
      return Math.min(9000, Math.max(3600, ms));
    });
    this.draw = def.build(svg);
    this.classList.add("is-ready");
    this.render();

    this.querySelector(".scene-play")!.addEventListener("click", () => this.toggle());
    this.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((b) =>
      b.addEventListener("click", () => this.jump(Number(b.dataset.step)))
    );
    this.querySelector(".scene-stage")!.addEventListener("click", () => this.toggle());

    this.io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          if (!this.played && !reduced()) this.play();
        } else if (this.playing) {
          this.pause();
        }
      },
      { threshold: [0, 0.5] }
    );
    this.io.observe(this);
  }

  disconnectedCallback() {
    this.io?.disconnect();
    cancelAnimationFrame(this.raf);
  }

  private render() {
    this.draw(this.poster ? this.n : this.p);
    const step = Math.min(this.n - 1, Math.floor(this.p));
    this.querySelectorAll<HTMLElement>("[data-step]").forEach((b, i) => {
      const fill = i < step ? 1 : i > step ? 0 : this.p >= this.n ? 1 : this.p - step;
      b.style.setProperty("--fill", String(fill));
      b.toggleAttribute("aria-current", i === step);
    });
    this.querySelectorAll<HTMLElement>("[data-caption]").forEach((c, i) => c.classList.toggle("is-current", i === step));
    this.querySelector(".scene-count")!.textContent = `${step + 1} / ${this.n}`;
    const ended = this.p >= this.n;
    this.dataset.state = this.playing ? "playing" : ended ? "ended" : "paused";
    this.querySelector(".scene-play")!.setAttribute("aria-label", (this.playing ? this.dataset.lPause : ended ? this.dataset.lReplay : this.dataset.lPlay) ?? "");
  }

  private tick = (now: number) => {
    if (!this.playing) return;
    // rAF timestamps can trail performance.now() slightly, so clamp to keep p moving forward.
    const dt = Math.max(0, Math.min(100, now - this.last));
    this.last = now;
    const step = Math.min(this.n - 1, Math.floor(this.p));
    this.p = Math.min(this.n, this.p + dt / this.durations[step]);
    if (this.p >= this.n) this.playing = false;
    this.render();
    if (this.playing) this.raf = requestAnimationFrame(this.tick);
  };

  play() {
    if (reduced()) return this.stepForward();
    this.poster = false;
    if (this.p >= this.n) this.p = 0;
    this.playing = this.played = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
    this.render();
  }

  pause() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.render();
  }

  toggle() {
    this.playing ? this.pause() : this.play();
  }

  /** Reduced motion: each press shows the next step's finished state, no tweening. */
  private stepForward() {
    if (this.poster) {
      this.poster = false;
      this.p = 0.999;
      return this.render();
    }
    const step = Math.floor(this.p);
    this.p = this.p >= this.n ? 0.999 : Math.min(this.n, step + 1.999);
    if (this.p > this.n) this.p = this.n;
    this.render();
  }

  jump(i: number) {
    this.played = true;
    this.poster = false;
    if (reduced()) {
      this.p = i + 0.999;
      this.render();
      return;
    }
    this.p = i;
    this.play();
  }
}

if (!customElements.get("tb-scene")) customElements.define("tb-scene", TbScene);
