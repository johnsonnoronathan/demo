/* Casebook player: a clock, narration and controls around a Stage.
 *
 * The clock is the source of truth. Narration uses the browser's speech
 * synthesis when it has a voice: each cue is spoken as the playhead enters it,
 * and if the voice runs long the clock waits at the cue's end instead of
 * cutting it off. Without a voice, the video plays on the clock with captions.
 */
(function () {
  var fmt = Casebook.fmt, esc = Casebook.esc;
  var RATES = [0.75, 1, 1.25, 1.5, 2];

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.6 4.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M4 4v6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    voice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h4l5-4v13l-5-4H4z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    cc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 10.2a2.3 2.3 0 1 0 0 3.6M17 10.2a2.3 2.3 0 1 0 0 3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  function pickVoice() {
    if (!("speechSynthesis" in window)) return null;
    var voices = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    if (!voices.length) return null;
    var score = function (v) {
      return (/natural|neural|online/i.test(v.name) ? 4 : 0) + (/google|samantha|daniel|aria|jenny|guy/i.test(v.name) ? 2 : 0) +
        (/en-(US|GB)/i.test(v.lang) ? 1 : 0) + (v.localService ? 0 : 1);
    };
    return voices.sort(function (a, b) { return score(b) - score(a); })[0];
  }

  function Player(root, lesson, opts) {
    this.opts = opts || {};
    this.lesson = lesson;
    this.tl = Casebook.timeline(lesson);
    this.t = Math.min(this.opts.startAt || 0, this.tl.total - 0.5);
    if (this.t < 0) this.t = 0;
    this.rate = this.opts.rate || 1;
    this.captions = this.opts.captions !== false;
    this.narrate = this.opts.narrate !== false;
    this.playing = false;
    this.voice = pickVoice();
    this.speakingCue = -1;
    this.heldSince = 0;
    this.lastCue = -1;
    this.lastChapter = -1;
    this.watched = this.opts.watched || [];
    this.build(root);
    this.render();
    var self = this;
    if ("speechSynthesis" in window && !this.voice) {
      this.onVoices = function () { self.voice = pickVoice(); self.syncButtons(); };
      speechSynthesis.addEventListener("voiceschanged", this.onVoices);
    }
  }

  Player.prototype.build = function (root) {
    var self = this;
    var tl = this.tl;
    root.classList.add("player");
    root.tabIndex = 0;
    root.setAttribute("aria-label", "Video: " + this.lesson.title + ". Space to play or pause.");
    root.innerHTML =
      '<div class="pl-screen">' +
        '<div class="pl-stage"></div>' +
        '<button class="pl-big" type="button"><span class="pl-big-icon">' + ICON.play + '</span><span class="pl-big-label"></span></button>' +
        '<div class="pl-end" hidden></div>' +
        '<div class="pl-ccbar" aria-hidden="true"></div>' +
        '<div class="pl-controls">' +
          '<div class="pl-scrub" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0"><div class="pl-tip" hidden></div></div>' +
          '<div class="pl-row">' +
            '<button class="pl-btn pl-play" type="button" aria-label="Play">' + ICON.play + '</button>' +
            '<span class="pl-time"></span>' +
            '<span class="pl-chap"></span>' +
            '<span class="pl-spacer"></span>' +
            '<button class="pl-btn pl-rate" type="button" aria-label="Playback speed">1×</button>' +
            '<button class="pl-btn pl-voice" type="button" aria-label="Narration">' + ICON.voice + '</button>' +
            '<button class="pl-btn pl-cc" type="button" aria-label="Captions">' + ICON.cc + '</button>' +
            '<button class="pl-btn pl-full" type="button" aria-label="Full screen">' + ICON.full + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    this.root = root;
    var q = function (s) { return root.querySelector(s); };
    this.stage = new Casebook.Stage(q(".pl-stage"), this.lesson);
    this.ui = {
      big: q(".pl-big"), ccbar: q(".pl-ccbar"), bigLabel: q(".pl-big-label"), end: q(".pl-end"), controls: q(".pl-controls"),
      scrub: q(".pl-scrub"), tip: q(".pl-tip"), play: q(".pl-play"), time: q(".pl-time"), chap: q(".pl-chap"),
      rate: q(".pl-rate"), voice: q(".pl-voice"), cc: q(".pl-cc"), full: q(".pl-full"),
    };
    this.ui.scrub.setAttribute("aria-valuemax", Math.round(tl.total));

    // Chapter segments, sized by duration, with a fill each.
    this.segs = tl.scenes.map(function (s) {
      var seg = document.createElement("div");
      seg.className = "pl-seg";
      seg.style.flexGrow = s.dur;
      seg.innerHTML = '<i class="pl-seen"></i><i class="pl-fill"></i>';
      self.ui.scrub.insertBefore(seg, self.ui.tip);
      return { node: seg, fill: seg.lastChild, scene: s };
    });

    this.ui.big.addEventListener("click", function () { self.toggle(); root.focus({ preventScroll: true }); });
    this.ui.play.addEventListener("click", function () { self.toggle(); });
    q(".pl-stage").addEventListener("click", function () { self.toggle(); });
    this.ui.rate.addEventListener("click", function () {
      self.setRate(RATES[(RATES.indexOf(self.rate) + 1) % RATES.length]);
    });
    this.ui.voice.addEventListener("click", function () { self.setNarrate(!self.narrate); });
    this.ui.cc.addEventListener("click", function () { self.setCaptions(!self.captions); });
    this.ui.full.addEventListener("click", function () { self.fullscreen(); });

    // Scrubbing with mouse, touch or pen.
    var scrub = this.ui.scrub, dragging = false, wasPlaying = false;
    var timeFromEvent = function (e) {
      var r = scrub.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * tl.total;
    };
    scrub.addEventListener("pointerdown", function (e) {
      dragging = true;
      wasPlaying = self.playing;
      if (wasPlaying) self.pause(true);
      scrub.setPointerCapture(e.pointerId);
      self.seek(timeFromEvent(e));
    });
    scrub.addEventListener("pointermove", function (e) {
      var t = timeFromEvent(e);
      var sc = Casebook.sceneAt(tl, t);
      self.ui.tip.hidden = false;
      self.ui.tip.innerHTML = "<b>" + fmt(t) + "</b> " + esc(sc.def.label);
      var r = scrub.getBoundingClientRect();
      var x = Math.max(60, Math.min(r.width - 60, e.clientX - r.left));
      self.ui.tip.style.left = x + "px";
      if (dragging) self.seek(t);
    });
    scrub.addEventListener("pointerleave", function () { if (!dragging) self.ui.tip.hidden = true; });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false;
      self.ui.tip.hidden = true;
      if (wasPlaying) self.play();
    };
    scrub.addEventListener("pointerup", endDrag);
    scrub.addEventListener("pointercancel", endDrag);

    this.onKey = function (e) { self.key(e); };
    document.addEventListener("keydown", this.onKey);

    // Hide the controls while playing and the pointer is still.
    var idleTimer = 0;
    var wake = function () {
      root.classList.remove("idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { if (self.playing) root.classList.add("idle"); }, 2600);
    };
    root.addEventListener("pointermove", wake);
    root.addEventListener("focusin", wake);
    this.wake = wake;

    this.onFsChange = function () { root.classList.toggle("is-full", document.fullscreenElement === root); self.stage.fit(); };
    document.addEventListener("fullscreenchange", this.onFsChange);
    this.syncButtons();
  };

  Player.prototype.key = function (e) {
    // Shortcuts work from the player or the page itself, never while typing or on other controls.
    var tg = e.target;
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable) return;
    if (!this.root.contains(tg) && tg !== document.body && tg !== document.documentElement) return;
    if (/^(BUTTON|A)$/.test(tg.tagName) && (e.key === " " || e.key === "Enter")) return;
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key, handled = true;
    if (k === " " || k === "k") this.toggle();
    else if (k === "ArrowRight") this.seek(this.t + 5);
    else if (k === "ArrowLeft") this.seek(this.t - 5);
    else if (k === "l") this.seek(this.t + 10);
    else if (k === "j") this.seek(this.t - 10);
    else if (k === "c") this.setCaptions(!this.captions);
    else if (k === "n") this.setNarrate(!this.narrate);
    else if (k === "f") this.fullscreen();
    else if (k === "Home") this.seek(0);
    else if (k === "End") this.seek(this.tl.total);
    else if (/^[0-9]$/.test(k)) this.seek((this.tl.total * Number(k)) / 10);
    else handled = false;
    if (handled) e.preventDefault();
  };

  Player.prototype.canSpeak = function () { return !!this.voice; };

  Player.prototype.syncButtons = function () {
    var u = this.ui;
    u.play.innerHTML = this.playing ? ICON.pause : ICON.play;
    u.play.setAttribute("aria-label", this.playing ? "Pause" : "Play");
    u.rate.textContent = this.rate + "×";
    u.cc.setAttribute("aria-pressed", this.captions);
    var speak = this.canSpeak();
    u.voice.disabled = !speak;
    u.voice.setAttribute("aria-pressed", speak && this.narrate);
    u.voice.title = speak ? "Narration (n)" : "No speech voice in this browser. Captions carry the narration.";
    u.cc.title = "Captions (c)";
    u.full.title = "Full screen (f)";
    u.rate.title = "Playback speed";
    this.root.classList.toggle("playing", this.playing);
    var started = this.t > 0.05;
    var ended = this.t >= this.tl.total - 0.01;
    // The big button invites the first play; after that the picture stays clear when paused.
    u.big.hidden = this.playing || ended || this.started;
    u.bigLabel.textContent = started ? "Resume from " + fmt(this.t) : "Play · " + fmt(this.tl.total);
  };

  Player.prototype.render = function () {
    var tl = this.tl, t = this.t;
    var text = this.stage.render(t, this.captions);
    // Small players get captions at reading size under the picture instead of scaled down inside it.
    var narrow = this.root.clientWidth < 600;
    if (narrow !== this.narrow) { this.narrow = narrow; this.root.classList.toggle("narrow", narrow); }
    if (this.ui.ccbar.textContent !== text) this.ui.ccbar.textContent = text;
    var self = this;
    this.segs.forEach(function (s) {
      var k = Math.max(0, Math.min(1, (t - s.scene.start) / s.scene.dur));
      s.fill.style.transform = "scaleX(" + k + ")";
      var seen = 0, from = Math.floor(s.scene.start), to = Math.ceil(s.scene.start + s.scene.dur);
      for (var i = from; i < to; i++) if (self.watched[i]) seen++;
      s.node.classList.toggle("seen", seen / Math.max(1, to - from) > 0.9);
    });
    this.ui.time.textContent = fmt(t) + " / " + fmt(tl.total);
    this.ui.scrub.setAttribute("aria-valuenow", Math.round(t));
    this.ui.scrub.setAttribute("aria-valuetext", fmt(t) + " of " + fmt(tl.total));
    var scene = Casebook.sceneAt(tl, t);
    this.ui.chap.textContent = scene.def.label;
    var ci = Casebook.cueAt(tl, t);
    if (ci !== this.lastCue) {
      this.lastCue = ci;
      if (this.opts.onCue) this.opts.onCue(ci);
    }
    if (scene.index !== this.lastChapter) {
      this.lastChapter = scene.index;
      if (this.opts.onChapter) this.opts.onChapter(scene.index);
    }
  };

  /* Narration ------------------------------------------------------------ */

  Player.prototype.speak = function (ci, fromFraction) {
    if (!this.narrate || !this.canSpeak()) return;
    speechSynthesis.cancel();
    var words = this.tl.cues[ci].text.split(/\s+/);
    var start = Math.floor((fromFraction || 0) * words.length);
    if (start >= words.length - 1) return;
    var u = new SpeechSynthesisUtterance(words.slice(start).join(" "));
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = this.rate;
    var self = this;
    this.speakingCue = ci;
    this.speechStarted = false;
    this.speechQueuedAt = performance.now();
    u.onstart = function () { self.speechStarted = true; };
    u.onend = u.onerror = function () { if (self.speakingCue === ci) self.speakingCue = -1; };
    speechSynthesis.speak(u);
  };

  Player.prototype.hush = function () {
    this.speakingCue = -1;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  };

  Player.prototype.speakFromHere = function () {
    var ci = Casebook.cueAt(this.tl, this.t), cue = this.tl.cues[ci];
    this.speak(ci, (this.t - cue.start) / cue.dur);
  };

  /* Clock ---------------------------------------------------------------- */

  Player.prototype.play = function () {
    if (this.playing) return;
    if (this.t >= this.tl.total - 0.01) this.seek(0);
    this.playing = true;
    this.started = true;
    this.ui.end.hidden = true;
    this.last = performance.now();
    this.speakFromHere();
    var self = this;
    var tick = function (now) {
      if (!self.playing) return;
      self.step(now);
      self.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
    this.syncButtons();
    this.wake();
  };

  Player.prototype.step = function (now) {
    var dt = Math.min(0.25, (now - this.last) / 1000);
    this.last = now;
    var tl = this.tl;
    var ci = Casebook.cueAt(tl, this.t), cue = tl.cues[ci];
    var next = this.t + dt * this.rate;
    var end = cue.start + cue.dur;

    // Hold at the end of a cue while its narration is still speaking.
    if (next >= end && this.speakingCue === ci && this.narrate) {
      if (!this.heldSince) this.heldSince = now;
      var neverStarted = !this.speechStarted && now - this.speechQueuedAt > 1500;
      if (now - this.heldSince < 6000 && !neverStarted) {
        next = end - 0.0005;
      } else {
        this.speakingCue = -1;
      }
    } else if (next < end) {
      this.heldSince = 0;
    }

    var whole = Math.floor(this.t);
    if (!this.watched[whole]) {
      this.watched[whole] = 1;
      if (this.opts.onWatch) this.opts.onWatch(this.watched);
    }

    if (next >= tl.total) {
      this.t = tl.total;
      this.pause(true);
      this.render();
      this.ended();
      return;
    }
    var nci = Casebook.cueAt(tl, next);
    this.t = next;
    if (nci !== ci) {
      this.heldSince = 0;
      this.speak(nci, 0);
    }
    this.render();
    if (this.opts.onTime) this.opts.onTime(this.t);
  };

  Player.prototype.pause = function (quiet) {
    if (!this.playing) return;
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.hush();
    this.syncButtons();
    if (!quiet && this.opts.onTime) this.opts.onTime(this.t, true);
  };

  Player.prototype.toggle = function () {
    if (this.playing) this.pause();
    else this.play();
  };

  Player.prototype.seek = function (t) {
    this.t = Math.max(0, Math.min(this.tl.total, t));
    this.heldSince = 0;
    if (this.t < this.tl.total) this.ui.end.hidden = true;
    this.render();
    if (this.playing) this.speakFromHere();
    this.syncButtons();
    if (this.opts.onTime) this.opts.onTime(this.t, true);
  };

  Player.prototype.seekChapter = function (i) {
    this.seek(this.tl.scenes[i].start + 0.001);
    if (!this.playing) this.play();
  };

  Player.prototype.ended = function () {
    var u = this.ui, self = this;
    u.end.hidden = false;
    var next = this.opts.next;
    u.end.innerHTML =
      '<div class="pl-end-card"><p class="pl-end-kicker">Video complete</p><h3>' + esc(this.lesson.title) + "</h3>" +
      '<div class="pl-end-actions">' +
        '<button type="button" class="btn btn-primary" data-act="quiz">Take the quiz</button>' +
        (next ? '<a class="btn" href="#' + next.id + '">Next: ' + esc(next.title) + "</a>" : "") +
        '<button type="button" class="btn btn-ghost" data-act="replay">' + ICON.replay + " Replay</button>" +
      "</div></div>";
    u.end.querySelector('[data-act="replay"]').addEventListener("click", function () { self.seek(0); self.play(); });
    u.end.querySelector('[data-act="quiz"]').addEventListener("click", function () { if (self.opts.onQuiz) self.opts.onQuiz(); });
    this.syncButtons();
    if (this.opts.onTime) this.opts.onTime(this.t, true);
    if (this.opts.onEnded) this.opts.onEnded();
  };

  /* Settings ------------------------------------------------------------- */

  Player.prototype.setRate = function (r) {
    this.rate = r;
    if (this.playing) this.speakFromHere();
    this.syncButtons();
    if (this.opts.onPrefs) this.opts.onPrefs({ rate: r });
  };

  Player.prototype.setCaptions = function (on) {
    this.captions = on;
    this.render();
    this.syncButtons();
    if (this.opts.onPrefs) this.opts.onPrefs({ captions: on });
  };

  Player.prototype.setNarrate = function (on) {
    this.narrate = on;
    if (!on) this.hush();
    else if (this.playing) this.speakFromHere();
    this.syncButtons();
    if (this.opts.onPrefs) this.opts.onPrefs({ narrate: on });
  };

  Player.prototype.fullscreen = function () {
    var root = this.root;
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); return; }
    if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
  };

  Player.prototype.destroy = function () {
    this.pause(true);
    this.stage.destroy();
    document.removeEventListener("fullscreenchange", this.onFsChange);
    document.removeEventListener("keydown", this.onKey);
    if (this.onVoices) speechSynthesis.removeEventListener("voiceschanged", this.onVoices);
  };

  Casebook.Player = Player;
})();
