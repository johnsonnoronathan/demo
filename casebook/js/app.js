/* Casebook app: routing, progress, the course page and the lesson page. */
(function () {
  var esc = Casebook.esc, fmt = Casebook.fmt;
  var order = Casebook.order;
  var lessons = Casebook.course.lessons;
  var view = document.getElementById("view");
  var KEY = "casebook.v1";

  /* ---------------------------------------------------------------------- */
  /* Progress, kept in this browser only                                     */
  /* ---------------------------------------------------------------------- */

  var store = (function () {
    var data = { lessons: {}, prefs: {}, last: null };
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) data = Object.assign(data, JSON.parse(raw));
    } catch (e) { /* storage blocked: progress lasts for this visit */ }
    var timer = 0;
    function save() {
      clearTimeout(timer);
      timer = setTimeout(flush, 400);
    }
    function flush() {
      clearTimeout(timer);
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
    }
    return {
      data: data,
      save: save,
      flush: flush,
      lesson: function (id) {
        return data.lessons[id] || (data.lessons[id] = { seen: "", pos: 0, quiz: null, done: false });
      },
      reset: function () {
        data.lessons = {};
        data.last = null;
        flush();
      },
    };
  })();

  function seenArray(rec) {
    return rec.seen.split("").map(function (c) { return c === "1" ? 1 : 0; });
  }
  function watchedFraction(lesson) {
    var rec = store.lesson(lesson.id);
    var total = Math.ceil(Casebook.timeline(lesson).total);
    var n = 0;
    for (var i = 0; i < total; i++) if (rec.seen[i] === "1") n++;
    return n / total;
  }
  function status(lesson) {
    var rec = store.data.lessons[lesson.id];
    if (!rec) return "todo";
    if (rec.done) return "done";
    if (rec.pos > 0 || rec.seen.indexOf("1") >= 0 || rec.quiz) return "progress";
    return "todo";
  }
  var STATUS = {
    done: { glyph: "✓", label: "Passed" },
    progress: { glyph: "◐", label: "In progress" },
    todo: { glyph: "○", label: "Not started" },
  };
  function statusChip(lesson) {
    var s = status(lesson);
    return '<span class="status status-' + s + '"><span aria-hidden="true">' + STATUS[s].glyph + "</span> " + STATUS[s].label + "</span>";
  }
  function nextUp() {
    var last = store.data.last && lessons[store.data.last];
    if (last && status(last) !== "done") return last;
    for (var i = 0; i < order.length; i++) if (status(order[i]) !== "done") return order[i];
    return null;
  }
  function counts() {
    var c = { done: 0, progress: 0, todo: 0 };
    order.forEach(function (l) { c[status(l)]++; });
    return c;
  }
  function maybeComplete(lesson) {
    var rec = store.lesson(lesson.id);
    if (rec.done) return;
    if (watchedFraction(lesson) >= 0.9 && rec.quiz && rec.quiz.passed) {
      rec.done = true;
      store.save();
      toast("Lesson " + lesson.number + " passed. Nice work.");
      return true;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Small UI helpers                                                        */
  /* ---------------------------------------------------------------------- */

  var toastEl = document.getElementById("toast");
  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("on");
      setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 3200);
  }

  function totalSeconds() {
    return order.reduce(function (a, l) { return a + Casebook.timeline(l).total; }, 0);
  }

  var themeBtn = document.getElementById("theme");
  function currentTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function syncTheme() {
    var dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.dataset.mode = dark ? "dark" : "light";
  }
  if (store.data.prefs.theme) document.documentElement.setAttribute("data-theme", store.data.prefs.theme);
  themeBtn.addEventListener("click", function () {
    var nextTheme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    store.data.prefs.theme = nextTheme;
    store.save();
    syncTheme();
  });
  syncTheme();

  /* ---------------------------------------------------------------------- */
  /* Course page                                                             */
  /* ---------------------------------------------------------------------- */

  var stills = [];
  var player = null;

  function teardown() {
    stills.forEach(function (s) { s.destroy(); });
    stills = [];
    if (player) {
      player.destroy();
      player = null;
    }
    store.flush();
  }

  function renderHome() {
    document.title = "Casebook";
    var up = nextUp();
    var c = counts();
    var started = c.done + c.progress > 0;
    var heroLesson = up || order[0];
    var allDone = !up;
    var pct = Math.round((c.done / order.length) * 100);

    var html =
      '<section class="hero wrap">' +
        '<div class="hero-copy">' +
          '<p class="eyebrow">Video course · ' + order.length + " lessons · " + Math.round(totalSeconds() / 60) + " minutes</p>" +
          "<h1>Write test cases that find bugs.</h1>" +
          '<p class="hero-sub">Short narrated videos take you from your first written test case to an automated, organized suite. Each lesson adds notes to keep and a three-question check.</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary btn-lg" href="#' + heroLesson.id + '">' +
              (allDone ? "Rewatch lesson 1" : started ? "Continue · Lesson " + heroLesson.number : "Start lesson 1") + "</a>" +
            '<a class="btn btn-lg" href="#syllabus">See all lessons</a>' +
          "</div>" +
          '<div class="runner" aria-label="Course progress">' +
            '<div class="runner-line"><span class="runner-k">course run</span>' +
              '<span class="r-pass">✓ ' + c.done + " passed</span>" +
              '<span class="r-prog">◐ ' + c.progress + " in progress</span>" +
              '<span class="r-todo">○ ' + c.todo + " not started</span></div>" +
            '<div class="runner-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '">' +
              order.map(function (l) { return '<i class="rb-' + status(l) + '" title="Lesson ' + l.number + ": " + esc(l.title) + '"></i>'; }).join("") +
            "</div>" +
          "</div>" +
        "</div>" +
        '<a class="hero-poster" href="#' + heroLesson.id + '" aria-label="Play lesson ' + heroLesson.number + ": " + esc(heroLesson.title) + '">' +
          '<div class="poster-frame" data-still="' + heroLesson.id + '"></div>' +
          '<span class="poster-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' +
          '<span class="poster-meta"><b>' + (allDone ? "Lesson 1" : (started ? "Up next · " : "") + "Lesson " + heroLesson.number) + "</b> " +
            esc(heroLesson.title) + " · " + fmt(Casebook.timeline(heroLesson).total) + "</span>" +
        "</a>" +
      "</section>" +
      '<section class="syllabus wrap" id="syllabus">' +
        '<div class="sec-head"><h2>Syllabus</h2><p>Every lesson is a video first. Notes and a quiz sit underneath it.</p></div>' +
        Casebook.course.modules.map(function (m, mi) {
          var ls = m.lessons.map(function (id) { return lessons[id]; });
          var done = ls.filter(function (l) { return status(l) === "done"; }).length;
          return '<div class="module">' +
            '<div class="module-head"><span class="module-n">Module ' + (mi + 1) + "</span><h3>" + esc(m.title) + '</h3><span class="module-count">' + done + " of " + ls.length + " passed</span></div>" +
            '<ol class="lesson-list">' + ls.map(function (l) {
              var tl = Casebook.timeline(l);
              var w = Math.round(watchedFraction(l) * 100);
              return '<li><a class="lesson-row" href="#' + l.id + '">' +
                '<span class="thumb"><span class="poster-frame" data-still="' + l.id + '"></span><span class="thumb-time">' + fmt(tl.total) + "</span>" +
                  (w > 0 ? '<span class="thumb-bar" style="--w:' + w + '%"></span>' : "") + "</span>" +
                '<span class="lr-body"><span class="lr-n">Lesson ' + l.number + "</span>" +
                  '<span class="lr-title">' + esc(l.title) + "</span>" +
                  '<span class="lr-sum">' + esc(l.summary) + "</span>" +
                  '<span class="lr-meta">' + tl.scenes.length + " chapters · notes · " + l.quiz.length + "-question quiz</span></span>" +
                '<span class="lr-status">' + statusChip(l) + "</span>" +
              "</a></li>";
            }).join("") + "</ol>" +
          "</div>";
        }).join("") +
      "</section>" +
      '<section class="wrap reset-row">' +
        "<p>Progress is saved in this browser only.</p>" +
        '<div class="reset-box"><button type="button" class="btn btn-ghost" id="reset">Reset progress</button></div>' +
      "</section>";

    view.innerHTML = html;
    mountStills();

    var box = view.querySelector(".reset-box");
    view.querySelector("#reset").addEventListener("click", function () {
      box.innerHTML = '<span class="confirm-q">Clear all watch history and quiz scores?</span>' +
        '<button type="button" class="btn btn-danger" id="reset-yes">Clear progress</button>' +
        '<button type="button" class="btn btn-ghost" id="reset-no">Keep it</button>';
      box.querySelector("#reset-yes").addEventListener("click", function () {
        store.reset();
        toast("Progress cleared.");
        render();
      });
      box.querySelector("#reset-no").addEventListener("click", function () { render(); });
    });
  }

  function mountStills() {
    [].forEach.call(view.querySelectorAll("[data-still]"), function (host) {
      stills.push(Casebook.poster(host, lessons[host.dataset.still]));
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Lesson page                                                             */
  /* ---------------------------------------------------------------------- */

  function renderLesson(lesson) {
    document.title = lesson.title + " · Casebook";
    store.data.last = lesson.id;
    store.save();
    var rec = store.lesson(lesson.id);
    var tl = Casebook.timeline(lesson);
    var idx = order.indexOf(lesson);
    var prev = order[idx - 1], next = order[idx + 1];
    var prefs = store.data.prefs;

    view.innerHTML =
      '<div class="lesson wrap">' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#">Course</a><span>/</span>Module ' + (lesson.moduleIndex + 1) + " · " + esc(lesson.module.title) + "<span>/</span>Lesson " + lesson.number + "</nav>" +
        '<div class="lesson-grid">' +
          '<div class="lg-player"><div id="player"></div></div>' +
          '<div class="lg-head">' +
            '<div class="lh-title"><h1>' + esc(lesson.title) + "</h1>" +
              '<p class="lh-meta"><span id="lh-status">' + statusChip(lesson) + "</span><span>" + fmt(tl.total) + " video</span><span id=\"lh-watched\"></span></p></div>" +
            '<div class="lh-actions">' +
              '<button type="button" class="btn" id="mark"></button>' +
              (next ? '<a class="btn btn-primary" href="#' + next.id + '">Next lesson <span aria-hidden="true">→</span></a>' : '<a class="btn btn-primary" href="#">Back to course</a>') +
            "</div>" +
          "</div>" +
          '<aside class="lg-rail">' +
            '<div class="rail-block"><h2 class="rail-h">In this video</h2><ol class="chapters">' +
              tl.scenes.map(function (s, i) {
                return '<li><button type="button" data-ch="' + i + '"><span class="ch-n">' + String(i + 1).padStart(2, "0") + '</span><span class="ch-t">' + esc(s.def.label) + '</span><span class="ch-time">' + fmt(s.start) + "</span></button></li>";
              }).join("") + "</ol></div>" +
            '<div class="rail-block"><h2 class="rail-h">Course</h2><ol class="mini-lessons">' +
              order.map(function (l) {
                var s = status(l);
                return '<li><a href="#' + l.id + '"' + (l === lesson ? ' aria-current="page"' : "") + '><span class="ml-g status-' + s + '" aria-label="' + STATUS[s].label + '">' + STATUS[s].glyph + '</span><span>' + l.number + ". " + esc(l.title) + "</span></a></li>";
              }).join("") + "</ol></div>" +
          "</aside>" +
          '<div class="lg-tabs">' +
            '<div class="tabs" role="tablist">' +
              '<button type="button" role="tab" id="tab-notes" aria-controls="panel-notes">Notes</button>' +
              '<button type="button" role="tab" id="tab-transcript" aria-controls="panel-transcript">Transcript</button>' +
              '<button type="button" role="tab" id="tab-quiz" aria-controls="panel-quiz">Quiz <span class="tab-badge" id="quiz-badge"></span></button>' +
            "</div>" +
            '<section class="panel prose" role="tabpanel" id="panel-notes" aria-labelledby="tab-notes"><p class="panel-kicker">Notes to go with the video</p>' + lesson.notes + "</section>" +
            '<section class="panel" role="tabpanel" id="panel-transcript" aria-labelledby="tab-transcript"><ol class="transcript" id="transcript">' +
              tl.cues.map(function (c, i) {
                var head = c.index === 0 ? '<li class="tr-chap">' + esc(lesson.scenes[c.scene].label) + "</li>" : "";
                return head + '<li><button type="button" data-cue="' + i + '"><span class="tr-time">' + fmt(c.start) + "</span><span>" + esc(c.text) + "</span></button></li>";
              }).join("") + "</ol></section>" +
            '<section class="panel" role="tabpanel" id="panel-quiz" aria-labelledby="tab-quiz"></section>' +
          "</div>" +
        "</div>" +
        '<nav class="pager">' +
          (prev ? '<a href="#' + prev.id + '"><small>Previous</small>' + esc(prev.title) + "</a>" : "<span></span>") +
          (next ? '<a class="pg-next" href="#' + next.id + '"><small>Next</small>' + esc(next.title) + "</a>" : '<a class="pg-next" href="#"><small>Finished</small>Back to the course</a>') +
        "</nav>" +
      "</div>";

    var chapterBtns = [].slice.call(view.querySelectorAll("[data-ch]"));
    var cueBtns = [].slice.call(view.querySelectorAll("[data-cue]"));
    var transcript = view.querySelector("#transcript");
    var transcriptPanel = view.querySelector("#panel-transcript");
    var saveTimer = 0;

    player = new Casebook.Player(view.querySelector("#player"), lesson, {
      startAt: rec.pos,
      watched: seenArray(rec),
      rate: prefs.rate,
      captions: prefs.captions,
      narrate: prefs.narrate,
      next: next,
      onTime: function (t, now) {
        rec.pos = t >= tl.total - 1 ? 0 : t;
        if (now) store.save();
        else if (!saveTimer) saveTimer = setTimeout(function () { saveTimer = 0; store.save(); }, 2000);
      },
      onWatch: function (arr) {
        var s = "";
        for (var i = 0; i < arr.length; i++) s += arr[i] ? "1" : "0";
        rec.seen = s;
        updateMeta();
      },
      onChapter: function (i) {
        chapterBtns.forEach(function (b, bi) {
          b.classList.toggle("current", bi === i);
          if (bi === i) b.setAttribute("aria-current", "step");
          else b.removeAttribute("aria-current");
        });
        markSeenChapters();
      },
      onCue: function (i) {
        cueBtns.forEach(function (b, bi) { b.classList.toggle("current", bi === i); });
        var b = cueBtns[i];
        if (b && !transcriptPanel.hidden && player && player.playing) {
          var top = b.offsetTop - transcript.offsetTop;
          transcript.scrollTo({ top: Math.max(0, top - 80), behavior: "smooth" });
        }
      },
      onEnded: function () {
        if (maybeComplete(lesson)) updateMeta();
        else if (!rec.quiz || !rec.quiz.passed) toast("Video finished. Take the quiz to pass the lesson.");
      },
      onQuiz: function () { selectTab("quiz", true); },
      onPrefs: function (p) {
        Object.assign(prefs, p);
        store.save();
      },
    });

    Casebook.player = player; // handy from the console and in tests

    chapterBtns.forEach(function (b) {
      b.addEventListener("click", function () { player.seekChapter(Number(b.dataset.ch)); player.root.focus({ preventScroll: true }); });
    });
    cueBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        player.seek(tl.cues[Number(b.dataset.cue)].start + 0.001);
        if (!player.playing) player.play();
      });
    });

    function markSeenChapters() {
      var seen = seenArray(rec);
      tl.scenes.forEach(function (s, i) {
        var from = Math.floor(s.start), to = Math.ceil(s.start + s.dur), n = 0;
        for (var k = from; k < to; k++) if (seen[k]) n++;
        chapterBtns[i].classList.toggle("seen", n / Math.max(1, to - from) > 0.9);
      });
    }

    var markBtn = view.querySelector("#mark");
    function updateMeta() {
      var w = Math.round(watchedFraction(lesson) * 100);
      view.querySelector("#lh-watched").textContent = w ? w + "% watched" : "";
      view.querySelector("#lh-status").innerHTML = statusChip(lesson);
      markBtn.textContent = rec.done ? "✓ Passed" : "Mark as passed";
      markBtn.classList.toggle("btn-done", rec.done);
      markBtn.setAttribute("aria-pressed", rec.done);
      var badge = view.querySelector("#quiz-badge");
      badge.textContent = rec.quiz ? rec.quiz.score + "/" + lesson.quiz.length : lesson.quiz.length + " q";
      badge.classList.toggle("ok", !!(rec.quiz && rec.quiz.passed));
      var mini = view.querySelector('.mini-lessons a[aria-current] .ml-g');
      var s = status(lesson);
      mini.className = "ml-g status-" + s;
      mini.textContent = STATUS[s].glyph;
      markSeenChapters();
    }
    markBtn.addEventListener("click", function () {
      rec.done = !rec.done;
      store.save();
      updateMeta();
      toast(rec.done ? "Lesson " + lesson.number + " marked as passed." : "Lesson " + lesson.number + " is back in progress.");
    });

    // Tabs
    var tabs = ["notes", "transcript", "quiz"];
    function selectTab(name, scroll) {
      tabs.forEach(function (n) {
        var on = n === name;
        view.querySelector("#tab-" + n).setAttribute("aria-selected", on);
        view.querySelector("#tab-" + n).tabIndex = on ? 0 : -1;
        view.querySelector("#panel-" + n).hidden = !on;
      });
      prefs.tab = name;
      store.save();
      if (scroll) view.querySelector(".tabs").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    tabs.forEach(function (n, i) {
      var t = view.querySelector("#tab-" + n);
      t.addEventListener("click", function () { selectTab(n); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        var nn = tabs[(i + d + tabs.length) % tabs.length];
        selectTab(nn);
        view.querySelector("#tab-" + nn).focus();
      });
    });
    selectTab(tabs.indexOf(prefs.tab) >= 0 ? prefs.tab : "notes");

    renderQuiz(lesson, view.querySelector("#panel-quiz"), function () {
      maybeComplete(lesson);
      updateMeta();
    });
    updateMeta();
    player.root.focus({ preventScroll: true });
  }

  function renderQuiz(lesson, panel, onChange) {
    var rec = store.lesson(lesson.id);
    var qs = lesson.quiz;
    var graded = !!rec.quiz;
    var answers = rec.quiz ? rec.quiz.answers.slice() : qs.map(function () { return -1; });

    function draw() {
      var html = '<form class="quiz" novalidate>' +
        '<p class="panel-kicker">Check your understanding · pass with ' + (qs.length - 1) + " of " + qs.length + "</p>";
      qs.forEach(function (q, qi) {
        var right = answers[qi] === q.answer;
        html += '<fieldset class="q' + (graded ? (right ? " q-right" : " q-wrong") : "") + '"><legend><span class="q-n">' + (qi + 1) + "</span>" + esc(q.q) + "</legend>";
        q.options.forEach(function (o, oi) {
          var id = "q-" + lesson.id + "-" + qi + "-" + oi;
          var cls = graded ? (oi === q.answer ? " is-answer" : (oi === answers[qi] ? " is-picked" : "")) : "";
          html += '<label class="opt' + cls + '" for="' + id + '"><input type="radio" id="' + id + '" name="q' + qi + '" value="' + oi + '"' +
            (answers[qi] === oi ? " checked" : "") + (graded ? " disabled" : "") + "><span>" + esc(o) + "</span></label>";
        });
        if (graded) html += '<p class="why"><b>' + (right ? "Correct." : "Not quite.") + "</b> " + esc(q.why) + "</p>";
        html += "</fieldset>";
      });
      if (graded) {
        var passed = rec.quiz.passed;
        html += '<div class="quiz-result ' + (passed ? "ok" : "no") + '"><b>' + rec.quiz.score + " of " + qs.length + " correct.</b> " +
          (passed ? "Quiz passed." : "You need " + (qs.length - 1) + " to pass. Rewatch the chapters above, then try again.") +
          '<button type="button" class="btn" id="retake">Try again</button></div>';
      } else {
        html += '<div class="quiz-foot"><button type="submit" class="btn btn-primary" id="check">Check answers</button><span class="quiz-hint" id="quiz-hint"></span></div>';
      }
      html += "</form>";
      panel.innerHTML = html;
      var form = panel.querySelector("form");
      form.addEventListener("change", function (e) {
        if (e.target.name) answers[Number(e.target.name.slice(1))] = Number(e.target.value);
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var missing = answers.indexOf(-1);
        if (missing >= 0) {
          panel.querySelector("#quiz-hint").textContent = "Answer question " + (missing + 1) + " first.";
          return;
        }
        var score = qs.filter(function (q, i) { return answers[i] === q.answer; }).length;
        rec.quiz = { answers: answers.slice(), score: score, passed: score >= qs.length - 1 };
        graded = true;
        store.save();
        draw();
        onChange();
        if (!rec.done) toast(rec.quiz.passed ? "Quiz passed: " + score + " of " + qs.length + "." : score + " of " + qs.length + ". Have another go.");
      });
      var retake = panel.querySelector("#retake");
      if (retake) retake.addEventListener("click", function () {
        graded = false;
        answers = qs.map(function () { return -1; });
        draw();
      });
    }
    draw();
  }

  /* ---------------------------------------------------------------------- */
  /* Routing: #<lesson-id> opens a lesson, anything else shows the course    */
  /* ---------------------------------------------------------------------- */

  var lastRoute = null;
  function render() {
    var id = location.hash.slice(1);
    var lesson = lessons[id];
    var route = lesson ? id : "home";
    teardown();
    if (lesson) {
      renderLesson(lesson);
      if (lastRoute !== route) window.scrollTo(0, 0);
    } else {
      renderHome();
      if (id === "syllabus") {
        var s = document.getElementById("syllabus");
        if (s) s.scrollIntoView();
      } else if (lastRoute && lastRoute !== "home") window.scrollTo(0, 0);
    }
    lastRoute = route;
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("pagehide", function () { store.flush(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (player) player.pause();
      store.flush();
    }
  });
  render();
})();
