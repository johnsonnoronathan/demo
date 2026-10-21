/* Casebook stage: turns a lesson script into a timeline and draws any moment of it.
 *
 * Everything on the stage is a pure function of the playhead. A pane is built
 * once per scene and then updated with the cue position `p` (cue index plus the
 * fraction through that cue), so seeking, scrubbing and poster frames all use
 * the same code path as playback.
 */
(function () {
  var W = 960, H = 540;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function toggle(node, on) {
    node.classList.toggle("on", !!on);
  }

  /* ---------------------------------------------------------------------- */
  /* Timeline                                                                */
  /* ---------------------------------------------------------------------- */

  // Narration pace: about 155 words a minute, plus a breath between cues.
  function cueDuration(text) {
    var words = text.trim().split(/\s+/).length;
    return Math.max(2.4, words / 2.6 + 0.9);
  }

  var cache = new WeakMap();
  function timeline(lesson) {
    if (cache.has(lesson)) return cache.get(lesson);
    var t = 0, scenes = [], cues = [];
    lesson.scenes.forEach(function (s, si) {
      var start = t, starts = [], durs = [];
      s.cues.forEach(function (text, ci) {
        var d = cueDuration(text);
        starts.push(t);
        durs.push(d);
        cues.push({ scene: si, index: ci, start: t, dur: d, text: text });
        t += d;
      });
      scenes.push({ def: s, index: si, start: start, dur: t - start, cueStarts: starts, cueDurs: durs });
    });
    var tl = { total: t, scenes: scenes, cues: cues };
    cache.set(lesson, tl);
    return tl;
  }

  function sceneAt(tl, t) {
    for (var i = tl.scenes.length - 1; i >= 0; i--) if (t >= tl.scenes[i].start) return tl.scenes[i];
    return tl.scenes[0];
  }

  function cueAt(tl, t) {
    for (var i = tl.cues.length - 1; i >= 0; i--) if (t >= tl.cues[i].start) return i;
    return 0;
  }

  // Cue position inside a scene: 2.5 means halfway through the scene's cue 2.
  function cuePos(scene, t) {
    var local = t;
    for (var i = scene.cueStarts.length - 1; i >= 0; i--) {
      if (local >= scene.cueStarts[i]) {
        return Math.min(i + (local - scene.cueStarts[i]) / scene.cueDurs[i], scene.cueStarts.length);
      }
    }
    return 0;
  }

  // Inverse of cuePos, for poster frames described in cue units.
  function timeOf(tl, sceneIndex, p) {
    var s = tl.scenes[Math.min(sceneIndex, tl.scenes.length - 1)];
    var i = Math.min(Math.floor(p), s.cueStarts.length - 1);
    return s.cueStarts[i] + Math.min(p - i, 1) * s.cueDurs[i] - 0.001;
  }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }

  /* ---------------------------------------------------------------------- */
  /* Syntax colouring for the code pane                                      */
  /* ---------------------------------------------------------------------- */

  var JS_KEYWORDS = /^(export|function|return|if|const|let|import|from|test|expect|toBe|each)$/;
  function tokenize(line, lang) {
    var out = [], m, rest = line;
    if (lang === "gherkin") {
      m = rest.match(/^(\s*)(Feature:|Scenario:|Given|When|Then|And)(.*)$/);
      if (m) {
        if (m[1]) out.push({ t: m[1] });
        out.push({ t: m[2], c: "kw" });
        rest = m[3];
      }
    }
    var re = lang === "js"
      ? /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"`/]+|\/)/g
      : /("(?:[^"\\]|\\.)*")|(\s+)|([^"\s]+)/g;
    while ((m = re.exec(rest))) {
      if (lang === "js") {
        if (m[1]) out.push({ t: m[1], c: "cm" });
        else if (m[2]) out.push({ t: m[2], c: "str" });
        else if (m[3]) out.push({ t: m[3], c: "num" });
        else if (m[4]) out.push({ t: m[4], c: JS_KEYWORDS.test(m[4]) ? "kw" : (/^[A-Z]/.test(m[4]) ? "ty" : null) });
        else out.push({ t: m[0] });
      } else {
        out.push({ t: m[0], c: m[1] ? "str" : null });
      }
    }
    return out;
  }

  function renderTokens(tokens, limit) {
    var html = "", used = 0;
    for (var i = 0; i < tokens.length && used < limit; i++) {
      var piece = tokens[i].t.slice(0, limit - used);
      used += piece.length;
      html += tokens[i].c ? '<span class="tk-' + tokens[i].c + '">' + esc(piece) + "</span>" : esc(piece);
    }
    return html;
  }

  /* ---------------------------------------------------------------------- */
  /* Panes                                                                   */
  /* ---------------------------------------------------------------------- */

  var CHIPS = {
    pass: "Pass", fail: "Fail", yes: "Yes", no: "No", gap: "Gap", warn: "Check",
  };
  function chip(kind, text) {
    return '<span class="chip chip-' + kind + '">' + esc(text || CHIPS[kind] || kind) + "</span>";
  }
  function cellHtml(c) {
    return typeof c === "object" ? chip(c.chip, c.text) : esc(c);
  }

  var panes = {};

  panes.title = function (d) {
    var root = el("div", "pn pn-title");
    var k = root.appendChild(el("div", "rv kicker", esc(d.kicker)));
    var h = root.appendChild(el("h2", "rv", esc(d.heading)));
    var s = root.appendChild(el("p", "rv", esc(d.sub)));
    var rule = root.appendChild(el("div", "rv title-rule"));
    return {
      el: root,
      update: function (p) {
        toggle(k, p >= 0);
        toggle(h, p >= 0);
        toggle(rule, p >= 0.2);
        toggle(s, p >= (d.subAt || 0.3));
      },
    };
  };

  panes.bullets = function (d) {
    var root = el("div", "pn pn-bullets" + (d.check ? " is-check" : ""));
    var formula = [];
    if (d.formula) {
      var f = root.appendChild(el("div", "formula"));
      d.formula.forEach(function (txt, i) {
        if (i) f.appendChild(el("span", "rv arrow", "→"));
        formula.push(f.appendChild(el("span", "rv part", esc(txt))));
      });
    }
    var lead = d.lead ? root.appendChild(el("h3", "rv lead", esc(d.lead))) : null;
    var list = root.appendChild(el("ul", "items"));
    var items = d.items.map(function (it) {
      var li = list.appendChild(el("li", "rv" + (it.dim ? " dim" : ""),
        '<span class="mk"></span><span class="tx"><b>' + esc(it.text) + "</b>" + (it.sub ? "<small>" + esc(it.sub) + "</small>" : "") + "</span>"));
      return { node: li, def: it };
    });
    return {
      el: root,
      update: function (p) {
        formula.forEach(function (n, i) {
          toggle(n, p >= i * 0.3);
          if (n.previousSibling && n.previousSibling.classList) toggle(n.previousSibling, p >= i * 0.3);
        });
        if (lead) toggle(lead, p >= 0);
        var active = -1;
        items.forEach(function (it, i) {
          var on = p >= it.def.at;
          toggle(it.node, on);
          if (on && !it.def.dim) active = i;
        });
        items.forEach(function (it, i) { it.node.classList.toggle("active", i === active); });
      },
    };
  };

  panes.card = function (d) {
    var root = el("div", "pn pn-card" + (d.compact ? " compact" : ""));
    var head = root.appendChild(el("div", "card-head"));
    if (d.tag) head.appendChild(el("span", "tag tag-" + d.tag.kind, esc(d.tag.text)));
    var id = head.appendChild(el("span", "rv cid", esc(d.id)));
    var title = head.appendChild(el("div", "rv ctitle", esc(d.title)));
    var rows = d.fields.map(function (f) {
      var row = root.appendChild(el("div", "field"));
      row.appendChild(el("div", "flabel", esc(f.label)));
      var val = row.appendChild(el("div", "rv fval"));
      var steps = [];
      if (f.list) val.innerHTML = "<ul>" + f.list.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      else if (f.steps) val.innerHTML = "<ol>" + f.steps.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
      else if (f.chip) val.innerHTML = chip(f.chip);
      else if (f.progress) {
        val.innerHTML = '<ol class="progress">' + f.progress.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
        steps = [].slice.call(val.querySelectorAll("li"));
      } else val.textContent = f.value;
      if (f.steps) steps = [].slice.call(val.querySelectorAll("li"));
      var flag = null;
      if (f.flag) flag = row.appendChild(el("div", "rv flag", esc(f.flag.text)));
      return { row: row, val: val, def: f, steps: steps, flag: flag };
    });
    return {
      el: root,
      update: function (p) {
        toggle(id, p >= (d.titleAt || 0));
        toggle(title, p >= (d.titleAt || 0) + 0.1);
        var active = -1;
        rows.forEach(function (r, i) {
          var on = p >= r.def.at;
          toggle(r.val, on);
          r.row.classList.toggle("filled", on);
          if (on) active = i;
          if (r.def.steps) r.steps.forEach(function (s, si) { toggle(s, p >= r.def.at + si * 0.18); });
          if (r.def.progress) r.steps.forEach(function (s, si) {
            s.classList.toggle("done", p >= r.def.marks[si]);
            s.classList.toggle("now", p >= (si ? r.def.marks[si - 1] : 0) && p < r.def.marks[si]);
          });
          if (r.flag) {
            toggle(r.flag, p >= r.def.flag.at);
            r.row.classList.toggle("flagged", p >= r.def.flag.at);
          }
        });
        if (d.focus) rows.forEach(function (r, i) { r.row.classList.toggle("active", i === active); });
      },
    };
  };

  panes.browser = function (d) {
    var root = el("div", "pn pn-browser");
    var bar = root.appendChild(el("div", "bw-bar", "<i></i><i></i><i></i>"));
    var url = bar.appendChild(el("div", "bw-url"));
    var body = root.appendChild(el("div", "bw-body"));
    var form = body.appendChild(el("div", "bw-form"));
    form.appendChild(el("div", "bw-brand", "Larkspur Books"));
    form.appendChild(el("h4", null, esc(d.heading)));
    var inputs = d.fields.map(function (f) {
      var wrap = form.appendChild(el("label", "bw-field", "<span>" + esc(f.label) + "</span>"));
      var box = wrap.appendChild(el("div", "bw-input"));
      return { box: box, def: f };
    });
    var btn = form.appendChild(el("div", "bw-btn", esc(d.button.label)));
    var result = body.appendChild(el("div", "rv bw-result",
      '<div class="bw-brand">Larkspur Books</div><h4>' + esc(d.result.heading) + "</h4><p>" + esc(d.result.text) + "</p>"));
    var lastUrl = -1;
    return {
      el: root,
      update: function (p) {
        var urlChars = Math.round(Math.max(0, Math.min(1, (p - d.urlAt) / 0.45)) * d.url.length);
        if (urlChars !== lastUrl) {
          url.textContent = d.url.slice(0, urlChars);
          lastUrl = urlChars;
        }
        body.classList.toggle("loaded", p >= d.urlAt + 0.5);
        inputs.forEach(function (inp) {
          var f = inp.def;
          var k = Math.max(0, Math.min(1, (p - f.from) / (f.to - f.from)));
          var n = Math.round(k * f.value.length);
          var txt = f.secret ? "•".repeat(n) : f.value.slice(0, n);
          inp.box.innerHTML = esc(txt) + (p >= f.from && p < f.to + 0.05 ? '<span class="caret"></span>' : "");
          inp.box.classList.toggle("focus", p >= f.from && p < f.to + 0.05);
        });
        btn.classList.toggle("pressed", p >= d.button.at && p < d.button.at + 0.35);
        toggle(result, p >= d.result.at);
        form.classList.toggle("gone", p >= d.result.at);
      },
    };
  };

  panes.code = function (d) {
    var root = el("div", "pn pn-code");
    root.appendChild(el("div", "code-tab", '<span class="dot"></span>' + esc(d.file)));
    var pre = root.appendChild(el("div", "code-body"));
    var srcLines = d.code.split("\n");
    var swaps = d.swaps || [];
    var appear = d.appear || [];
    var hidden = {};
    appear.forEach(function (a) { a.lines.forEach(function (n) { hidden[n] = a; }); });
    var lines = srcLines.map(function (text, i) {
      var row = pre.appendChild(el("div", "cl"));
      row.appendChild(el("span", "ln", String(i + 1)));
      var code = row.appendChild(el("span", "cc"));
      return { row: row, code: code, text: text, tokens: tokenize(text, d.lang), shown: null };
    });
    var notes = (d.highlights || []).map(function (h) {
      if (!h.note) return null;
      var n = pre.appendChild(el("div", "rv code-note" + (h.bad ? " bad" : ""), esc(h.note)));
      n.style.setProperty("--line", h.lines[0] - 1);
      return n;
    });
    var typedTotal = srcLines.reduce(function (a, l, i) { return hidden[i + 1] ? a : a + l.length + 1; }, 0);
    return {
      el: root,
      update: function (p) {
        var budget = d.typeTo < 0 ? Infinity : Math.floor(Math.max(0, Math.min(1, p / d.typeTo)) * typedTotal);
        var typing = d.typeTo >= 0 && p < d.typeTo;
        var caretPlaced = false;
        lines.forEach(function (L, i) {
          var n = i + 1, text = L.text, tokens = L.tokens, swapped = false;
          swaps.forEach(function (s) {
            if (s.line === n && p >= s.at) { text = s.text; tokens = tokenize(s.text, d.lang); swapped = true; }
          });
          // limit: characters shown on this line; negative means typing hasn't reached it.
          var limit;
          if (hidden[n]) {
            limit = p >= hidden[n].at ? Infinity : -1;
          } else {
            limit = budget;
            budget -= text.length + 1;
          }
          L.row.classList.toggle("void", limit < 0);
          L.row.classList.toggle("swapped", swapped);
          L.row.classList.toggle("pop", !!hidden[n] && limit === Infinity);
          var showCaret = typing && !caretPlaced && !hidden[n] && limit >= 0 && limit <= text.length;
          var key = (swapped ? "s" : "") + limit + (showCaret ? "c" : "");
          if (key !== L.shown) {
            L.code.innerHTML = (limit < 0 ? "" : renderTokens(tokens, limit)) + (showCaret ? '<span class="caret"></span>' : "");
            L.shown = key;
          }
          if (showCaret) caretPlaced = true;
          var hl = null;
          (d.highlights || []).forEach(function (h) { if (p >= h.at && p < h.until && h.lines.indexOf(n) >= 0) hl = h; });
          L.row.classList.toggle("hl", !!hl);
          L.row.classList.toggle("hl-bad", !!(hl && hl.bad));
          L.row.classList.toggle("hl-good", !!(hl && hl.good));
        });
        pre.classList.toggle("dimmed", lines.some(function (L) { return L.row.classList.contains("hl"); }));
        notes.forEach(function (n, i) {
          if (!n) return;
          var h = d.highlights[i];
          toggle(n, p >= h.at && p < h.until);
        });
      },
    };
  };

  panes.terminal = function (d) {
    var root = el("div", "pn pn-term");
    root.appendChild(el("div", "code-tab", '<span class="dot"></span>Terminal'));
    var body = root.appendChild(el("div", "term-body"));
    var rows = d.lines.map(function (l) {
      return { node: body.appendChild(el("div", "tl tl-" + l.kind, esc(l.text))), def: l };
    });
    var caret = body.appendChild(el("div", "tl tl-cmd", '$ <span class="caret"></span>'));
    return {
      el: root,
      update: function (p) {
        var any = false;
        rows.forEach(function (r) {
          var on = p >= r.def.at && (r.def.until == null || p < r.def.until);
          r.node.hidden = !on;
          any = any || on;
        });
        caret.hidden = false;
        root.classList.toggle("idle", !any);
      },
    };
  };

  panes.table = function (d) {
    var root = el("div", "pn pn-table");
    if (d.caption) root.appendChild(el("div", "tcap", esc(d.caption)));
    var t = root.appendChild(el("table"));
    var cg = "<colgroup>" + (d.widths || []).map(function (w) { return '<col style="width:' + w + '">'; }).join("") + "</colgroup>";
    t.innerHTML = cg + "<thead><tr>" + d.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead>";
    var tb = t.appendChild(el("tbody"));
    var rows = d.rows.map(function (r) {
      var tr = tb.appendChild(el("tr", "rv", r.cells.map(function (c) { return "<td>" + cellHtml(c) + "</td>"; }).join("")));
      return { node: tr, def: r };
    });
    return {
      el: root,
      update: function (p) {
        rows.forEach(function (r) { toggle(r.node, p >= r.def.at); });
        var focus = {};
        (d.focus || []).forEach(function (f) { if (p >= f.at && p < f.until) focus[f.row] = true; });
        var anyFocus = Object.keys(focus).length > 0;
        rows.forEach(function (r, i) {
          r.node.classList.toggle("focus", !!focus[i]);
          r.node.classList.toggle("unfocus", anyFocus && !focus[i]);
        });
      },
    };
  };

  panes.numberline = function (d) {
    var root = el("div", "pn pn-line" + (d.compact ? " compact" : ""));
    root.appendChild(el("h3", "lead", esc(d.heading)));
    var track = root.appendChild(el("div", "nl"));
    var span = d.max - d.min;
    function x(v) { return ((v - d.min + 0.5) / (span + 1)) * 100; }
    var lo = d.valid[0], hi = d.valid[1];
    var bands = [
      { cls: "bad", a: d.min - 0.5, b: lo - 0.5, label: "Too few" },
      { cls: "good", a: lo - 0.5, b: hi + 0.5, label: "Valid · " + lo + " to " + hi },
      { cls: "bad", a: hi + 0.5, b: d.max + 0.5, label: "Too many" },
    ].map(function (b) {
      var n = track.appendChild(el("div", "band band-" + b.cls, "<span>" + esc(b.label) + "</span>"));
      n.style.left = x(b.a) + "%";
      n.style.width = x(b.b) - x(b.a) + "%";
      return n;
    });
    var axis = track.appendChild(el("div", "axis"));
    for (var v = d.min; v <= d.max; v++) {
      var tick = axis.appendChild(el("div", "tick" + (v === lo || v === hi ? " edge" : ""), "<span>" + v + "</span>"));
      tick.style.left = x(v) + "%";
    }
    var pins = d.points.map(function (pt) {
      var ok = pt.v >= lo && pt.v <= hi;
      var n = track.appendChild(el("div", "rv pin " + (ok ? "ok" : "no"),
        '<b>' + pt.v + '</b><em>' + (ok ? "accept" : "reject") + "</em>"));
      n.style.left = x(pt.v) + "%";
      return { node: n, def: pt, label: n.querySelector("em") };
    });
    return {
      el: root,
      update: function (p) {
        var showBands = d.partitionsAt < 0 || p >= d.partitionsAt;
        bands.forEach(function (b, i) {
          b.classList.toggle("on", showBands);
          b.style.transitionDelay = showBands ? i * 0.12 + "s" : "0s";
        });
        pins.forEach(function (pin) {
          toggle(pin.node, p >= pin.def.at);
          var bug = pin.def.bug != null && p >= pin.def.bug;
          pin.node.classList.toggle("bug", bug);
          pin.label.textContent = bug ? "bug!" : (pin.node.classList.contains("ok") ? "accept" : "reject");
        });
      },
    };
  };

  panes.pyramid = function (d) {
    var root = el("div", "pn pn-pyr");
    var stack = root.appendChild(el("div", "pyr"));
    var n = d.layers.length;
    var layers = d.layers.map(function (L, i) {
      var row = stack.appendChild(el("div", "rv pyr-row"));
      var shape = row.appendChild(el("div", "pyr-shape", "<b>" + esc(L.label) + "</b>"));
      // Each band is a slice of one triangle: its top and bottom widths follow the slope.
      var top = (i / n) * 100, bot = ((i + 1) / n) * 100;
      var inset = function (w) { return (100 - w) / 2; };
      var tw = 22 + top * 0.78, bw = 22 + bot * 0.78;
      shape.style.clipPath = "polygon(" + inset(tw) + "% 0, " + (100 - inset(tw)) + "% 0, " + (100 - inset(bw)) + "% 100%, " + inset(bw) + "% 100%)";
      row.appendChild(el("div", "pyr-info", "<b>" + esc(L.count) + " tests</b><small>" + esc(L.sub) + "</small>"));
      return { node: row, def: L };
    });
    var axis = root.appendChild(el("div", "rv pyr-axis", "<span>Slower · more brittle</span><i></i><span>Faster · more precise</span>"));
    return {
      el: root,
      update: function (p) {
        layers.forEach(function (L) { toggle(L.node, p >= L.def.at); });
        toggle(axis, p >= d.axisAt);
      },
    };
  };

  /* ---------------------------------------------------------------------- */
  /* Stage                                                                   */
  /* ---------------------------------------------------------------------- */

  function Stage(host, lesson, opts) {
    opts = opts || {};
    this.lesson = lesson;
    this.tl = timeline(lesson);
    this.host = host;
    this.canvas = el("div", "st-canvas" + (opts.still ? " still" : ""));
    this.canvas.style.width = W + "px";
    this.canvas.style.height = H + "px";
    this.chapter = this.canvas.appendChild(el("div", "st-chapter"));
    this.canvas.appendChild(el("div", "st-mark", "Casebook · Lesson " + lesson.number));
    this.layer = this.canvas.appendChild(el("div", "st-layer"));
    this.caption = this.canvas.appendChild(el("div", "st-caption"));
    host.appendChild(this.canvas);
    this.sceneIndex = -1;
    this.panes = [];
    this.fit();
    var self = this;
    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(function () { self.fit(); });
      this.ro.observe(host);
    }
  }

  Stage.prototype.fit = function () {
    var w = this.host.clientWidth || W, h = this.host.clientHeight || w * H / W;
    var k = Math.min(w / W, h / H);
    var x = (w - W * k) / 2, y = (h - H * k) / 2;
    this.canvas.style.transform = "translate(" + x + "px," + y + "px) scale(" + k + ")";
  };

  Stage.prototype.render = function (t, showCaptions) {
    var tl = this.tl;
    var scene = sceneAt(tl, t);
    if (scene.index !== this.sceneIndex) this.build(scene);
    var p = cuePos(scene, t);
    this.panes.forEach(function (pn) { pn.update(p); });
    var ci = cueAt(tl, t);
    var text = showCaptions ? tl.cues[ci].text : "";
    if (this.caption.textContent !== text) this.caption.textContent = text;
    this.caption.hidden = !text;
    return text;
  };

  Stage.prototype.build = function (scene) {
    var def = scene.def;
    this.sceneIndex = scene.index;
    this.chapter.innerHTML = '<b>' + String(scene.index + 1).padStart(2, "0") + "</b> " + esc(def.label);
    var wrap = el("div", "st-scene layout-" + (def.layout || "full"));
    if (def.cols) wrap.style.gridTemplateColumns = def.cols;
    this.panes = def.panes.map(function (pd) {
      var pn = panes[pd.type](pd);
      wrap.appendChild(pn.el);
      return pn;
    });
    this.layer.innerHTML = "";
    this.layer.appendChild(wrap);
    void wrap.offsetWidth; // commit the hidden state so the first reveals animate
  };

  Stage.prototype.destroy = function () {
    if (this.ro) this.ro.disconnect();
    this.host.innerHTML = "";
  };

  // A still frame for posters and thumbnails.
  function poster(host, lesson) {
    var st = new Stage(host, lesson, { still: true });
    var tl = st.tl;
    var pos = lesson.poster || { scene: 0, p: 1 };
    st.render(timeOf(tl, pos.scene, pos.p), false);
    return st;
  }

  Casebook.timeline = timeline;
  Casebook.cueAt = cueAt;
  Casebook.sceneAt = sceneAt;
  Casebook.fmt = fmt;
  Casebook.esc = esc;
  Casebook.Stage = Stage;
  Casebook.poster = poster;
})();
