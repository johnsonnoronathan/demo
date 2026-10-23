// Content gate: checks every course, page, video and translation against STANDARD.md.
// Each problem names the rule it breaks (C = course, P = page, V = video, T = translation,
// L = layout safety), so the fix can be looked up. Exit code 1 if any rule fails.
// Usage: npm run check:content
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const errors = [];
const warnings = [];
const fail = (rule, where, msg) => errors.push(`${rule}  ${where}: ${msg}`);
const warn = (rule, where, msg) => warnings.push(`${rule}  ${where}: ${msg}`);

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
    : [];

// TypeScript modules (videos, scenes, timing, translations) load through Vite, as in the build.
const vite = await createServer({ root, logLevel: "error", appType: "custom", server: { middlewareMode: true, hmr: false } });
const load = (file) => vite.ssrLoadModule("/" + relative(root, file).replaceAll("\\", "/"));
let scenes, durationOf, LOCALES, translations;
try {
  ({ scenes } = await load(join(root, "src/scenes/index.ts")));
  ({ durationOf } = await load(join(root, "src/video/timeline.ts")));
  ({ LOCALES } = await load(join(root, "src/i18n/locales.ts")));
  ({ translations } = await load(join(root, "src/i18n/content/index.ts")));
} catch (e) {
  await vite.close();
  console.error(`Couldn't load the site's modules: ${e.message}`);
  process.exit(1);
}
const locales = LOCALES.map((l) => l.code);

/* Courses ---------------------------------------------------------------- */
const courses = parseYaml(readFileSync(join(root, "src/content/courses.yaml"), "utf8"));
const courseById = new Map(courses.map((c) => [c.id, c]));
const LEVELS = ["beginner", "intermediate", "advanced"];
for (const c of courses) {
  const at = `courses.yaml#${c.id}`;
  for (const k of ["id", "title", "tagline", "summary", "audience"]) if (!c[k]) fail("C1", at, `missing ${k}`);
  if (!LEVELS.includes(c.level)) fail("C1", at, `level must be one of ${LEVELS.join(", ")}`);
  if (!(c.outcomes?.length >= 3)) fail("C1", at, "needs at least 3 outcomes");
  if (!(c.chapters?.length >= 2)) fail("C1", at, "needs at least 2 chapters");
  const roles = (c.chapters ?? []).map((ch) => ch.role).filter(Boolean);
  if (roles.length && roles.length !== c.chapters.length) fail("C3", at, "either every chapter has a role (overall/specific) or none does");
}
const orders = courses.map((c) => c.order);
if (new Set(orders).size !== orders.length) fail("C1", "courses.yaml", "two courses share the same order");

/* Pages ------------------------------------------------------------------ */
const ALLOWED_TAGS = new Set(["Scene", "Exercise", "Screenshot", "Callout", "Outcomes", "ChapterMap", "CourseArc", "ChapterRecap", "SelfCheck", "kbd", "br"]);
const lessonsDir = join(root, "src/content/lessons");

function readPage(file) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { file, error: "no frontmatter block" };
  try {
    return { file, data: parseYaml(m[1]) ?? {}, body: m[2] };
  } catch (e) {
    return { file, error: `frontmatter isn't valid YAML: ${e.message.split("\n")[0]}` };
  }
}
/** Prose only: fenced code blocks and inline code removed, so examples can't trip the rules. */
const prose = (body) => body.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, "").replace(/`[^`\n]*`/g, "");
/** The page's component skeleton: tag names and ids, in order. Translations must keep it. */
const skeleton = (body) => [...prose(body).matchAll(/<([A-Z]\w*)\b([^>]*)>/g)].map(([, tag, attrs]) => `${tag}${attrs.match(/\b(?:id|name)="([^"]+)"/)?.[1] ? ":" + attrs.match(/\b(?:id|name)="([^"]+)"/)[1] : ""}`);
const pageName = (d) => (d.kind === "opening" ? "opening" : d.slug);

const pages = walk(lessonsDir).filter((f) => f.endsWith(".mdx")).map(readPage);
const en = new Map(); // "course/chapter/page" → English page
for (const p of pages) {
  const rel = relative(lessonsDir, p.file);
  p.rel = rel;
  p.locale = rel.split(/[\\/]/)[0];
  if (p.error) { fail("P1", rel, p.error); continue; }
  if (!locales.includes(p.locale)) { fail("T1", rel, `"${p.locale}" isn't a site language`); continue; }
  p.key = `${p.data.course}/${p.data.chapter}/${pageName(p.data)}`;
  if (p.locale === "en") {
    if (en.has(p.key)) fail("P1", rel, `duplicates ${relative(lessonsDir, en.get(p.key).file)}`);
    en.set(p.key, p);
  }
}

for (const p of pages.filter((p) => p.locale === "en" && !p.error)) {
  const { data: d, body, rel } = p;
  const course = courseById.get(d.course);
  if (!course) { fail("P1", rel, `course "${d.course}" isn't in courses.yaml`); continue; }
  const chapter = course.chapters.find((c) => c.id === d.chapter);
  if (!chapter) { fail("P1", rel, `chapter "${d.chapter}" isn't a chapter of ${d.course}`); continue; }
  if (!["opening", "lesson", "summary"].includes(d.kind)) fail("P1", rel, "kind must be opening, lesson or summary");
  if (d.kind === "opening" && (d.slug !== "" || d.order !== 0)) fail("P1", rel, 'an opening has slug "" and order 0');
  if (d.kind !== "opening" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug ?? "")) fail("P1", rel, "slug must be lowercase words joined by hyphens");
  if (!d.title) fail("P2", rel, "missing title");
  if (!d.description) fail("P2", rel, "missing description");
  else if (d.description.length > 200) fail("P2", rel, `description is ${d.description.length} characters; keep it to 200`);
  if (!(d.minutes > 0)) fail("P2", rel, "minutes must be a positive number");
  if (d.kind === "lesson" && !((d.outcomes?.length ?? 0) >= 2 && d.outcomes.length <= 6)) fail("P2", rel, "a lesson has 2 to 6 outcomes");
  if (d.kind === "lesson" && !((d.keyPoints?.length ?? 0) >= 2)) fail("P2", rel, "a lesson has at least 2 key points");

  // P4 validation: every lesson lets the learner check themselves.
  const exercises = d.exercises ?? [];
  const quiz = d.quiz ?? [];
  if (d.kind === "lesson" && !exercises.length && quiz.length < 2) fail("P4", rel, "a lesson needs a hands-on exercise or a quiz of at least 2 questions");
  if (d.kind === "summary" && (d.check?.length ?? 0) < 2) fail("P4", rel, "a summary needs at least 2 self-check questions (check:)");
  for (const [i, q] of quiz.entries()) {
    if (!(q.options?.length >= 2) || !(q.answer >= 0 && q.answer < q.options.length)) fail("P4", rel, `quiz question ${i + 1}: answer must point at one of its options`);
    if (!q.why) fail("P4", rel, `quiz question ${i + 1}: explain the answer in why`);
  }

  // P5 exercises: the learner's part in the body, the agent's part in frontmatter.
  const used = [...prose(body).matchAll(/<Exercise\s+id="([^"]+)"/g)].map((m) => m[1]);
  for (const ex of exercises) {
    const n = used.filter((u) => u === ex.id).length;
    if (n !== 1) fail("P5", rel, `exercise "${ex.id}" must appear exactly once as <Exercise id="${ex.id}"> (found ${n})`);
    const a = ex.agent ?? {};
    if (!(a.steps?.length >= 2)) fail("P5", rel, `exercise "${ex.id}": the agent prompt needs at least 2 steps`);
    if (!(a.done?.length >= 1)) fail("P5", rel, `exercise "${ex.id}": say when it's done (agent.done)`);
    if (!(a.report?.length >= 1)) fail("P5", rel, `exercise "${ex.id}": say what to report (agent.report)`);
    if (ex.target !== "own" && !course.practice) fail("P5", rel, `exercise "${ex.id}": the course has no practice app, so set target: own`);
    const steps = [...prose(body).matchAll(new RegExp(`<Exercise\\s+id="${ex.id}"[^>]*>([\\s\\S]*?)</Exercise>`, "g"))][0]?.[1] ?? "";
    if (!/^\s*1\.\s/m.test(steps)) fail("P5", rel, `exercise "${ex.id}": the learner's part needs numbered steps inside <Exercise>`);
  }
  for (const id of used) if (!exercises.some((e) => e.id === id)) fail("P5", rel, `<Exercise id="${id}"> has no matching exercise in frontmatter`);

  // P6 scenes and screenshots.
  for (const c of d.concepts ?? []) if (c.scene && !scenes[c.scene]) fail("P6", rel, `concept scene "${c.scene}" isn't registered in src/scenes/index.ts`);
  for (const [, name] of prose(body).matchAll(/<Scene\s+name="([^"]+)"/g)) if (!scenes[name]) fail("P6", rel, `<Scene name="${name}"> isn't registered in src/scenes/index.ts`);
  for (const [tag] of prose(body).matchAll(/<Screenshot\b[^>]*\/?>/g)) {
    const alt = tag.match(/\balt="([^"]*)"/)?.[1] ?? "";
    if (alt.trim().length < 20) fail("P6", rel, "every <Screenshot> needs an alt of at least 20 characters describing what it shows (agents read it)");
    const src = tag.match(/\bsrc="([^"]*)"/)?.[1];
    if (src && !existsSync(join(root, "public", src))) fail("P6", rel, `screenshot ${src} isn't in public/`);
  }

  // P3 every page has a video.
  if (!existsSync(join(root, "src/videos/en", d.course, d.chapter, `${pageName(d)}.ts`))) fail("P3", rel, `no video at src/videos/en/${d.course}/${d.chapter}/${pageName(d)}.ts`);
}

// Pages on every page, for every language: layout safety.
for (const p of pages.filter((p) => !p.error)) {
  const text = prose(p.body);
  if (/^# /m.test(text)) fail("L1", p.rel, "don't use a level-1 heading; the page title is the h1");
  for (const [, tag] of text.matchAll(/<\/?([A-Za-z][\w.]*)\b/g)) if (!ALLOWED_TAGS.has(tag)) fail("L2", p.rel, `<${tag}> isn't allowed; use Markdown or one of the site's components`);
  if (/\bstyle=|<style|<script|import\s+[\w{]/.test(text)) fail("L2", p.rel, "no inline styles, scripts or imports in a page");
  if (/\]\(\/(?!\/)|href="\/(?!\/)/.test(text)) fail("L3", p.rel, "no root-relative links in a page; they break under the site's base path");
}

// Chapter structure: courses with roles open and close every chapter.
for (const c of courses) {
  for (const ch of c.chapters ?? []) {
    const inChapter = [...en.values()].filter((p) => p.data.course === c.id && p.data.chapter === ch.id);
    const at = `${c.id}/${ch.id}`;
    if (!inChapter.length) { fail("C2", at, "chapter has no pages"); continue; }
    if (!inChapter.some((p) => p.data.kind === "lesson")) fail("C2", at, "chapter has no lessons");
    if (ch.role) {
      if (!inChapter.some((p) => p.data.kind === "opening")) fail("C3", at, "chapter needs an opening page (what you'll get)");
      if (!inChapter.some((p) => p.data.kind === "summary")) fail("C3", at, "chapter needs a summary page");
    }
    const ords = inChapter.map((p) => p.data.order);
    if (new Set(ords).size !== ords.length) fail("C2", at, "two pages share the same order");
  }
}

/* Videos ----------------------------------------------------------------- */
const videosDir = join(root, "src/videos");
const videos = new Map(); // "locale/course/chapter/page" → VideoDef
for (const f of walk(videosDir).filter((f) => f.endsWith(".ts") && relative(videosDir, f).split(/[\\/]/).length === 4)) {
  const rel = relative(videosDir, f).replaceAll("\\", "/");
  try {
    videos.set(rel.replace(/\.ts$/, ""), (await load(f)).default);
  } catch (e) {
    fail("V1", `videos/${rel}`, `doesn't load: ${e.message.split("\n")[0]}`);
  }
}
const atsOf = (pane) => {
  const list = [];
  const visit = (v) => {
    if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) (["at", "until", "subAt", "titleAt", "axisAt"].includes(k) && typeof x === "number" ? list.push(x) : visit(x));
  };
  visit(pane);
  return list;
};
for (const [key, v] of videos) {
  const at = `videos/${key}.ts`;
  const [locale, course, chapter, page] = key.split("/");
  if (!locales.includes(locale)) fail("T1", at, `"${locale}" isn't a site language`);
  if (!en.has(`${course}/${chapter}/${page}`)) fail("V1", at, "no English page for this video (file name must be the page's slug, or opening)");
  if (!v?.title || !Array.isArray(v.scenes)) { fail("V1", at, "export default defineVideo({ title, scenes })"); continue; }
  if (v.scenes.length < 2) fail("V1", at, "a video needs at least 2 scenes");
  if (v.scenes[0]?.panes?.[0]?.type !== "title") fail("V1", at, "the first scene opens with a title pane");
  for (const [i, s] of v.scenes.entries()) {
    const where = `${at} scene ${i + 1}`;
    if (!s.label) fail("V1", where, "every scene has a label (it's a chapter in the scrubber)");
    if (!(s.cues?.length >= 1)) { fail("V1", where, "every scene has at least one cue"); continue; }
    for (const c of s.cues) if (c.length > 320) fail("V2", where, `a cue is ${c.length} characters; split it so the caption fits (max 320)`);
    for (const pane of s.panes ?? []) {
      for (const a of atsOf(pane)) if (a < 0 || a > s.cues.length) fail("V2", where, `${pane.type} pane has at: ${a}, outside 0–${s.cues.length} (cue units)`);
      if (pane.type === "concept" && !scenes[pane.scene]) fail("V2", where, `concept scene "${pane.scene}" isn't registered`);
    }
  }
  const secs = durationOf(v);
  if (secs < 20 || secs > 600) fail("V3", at, `runs ${Math.round(secs)} s; keep a video between 20 s and 10 min`);
}

/* Translations ----------------------------------------------------------- */
const pick = (d) => JSON.stringify({ kind: d.kind, order: d.order, slug: d.slug, minutes: d.minutes, ex: (d.exercises ?? []).map((e) => ({ id: e.id, target: e.target, agent: e.agent })), quiz: (d.quiz ?? []).map((q) => [q.options?.length, q.answer]), scenes: (d.concepts ?? []).map((c) => c.scene ?? null), check: d.check?.length ?? 0 });
for (const p of pages.filter((p) => p.locale !== "en" && !p.error)) {
  const src = en.get(p.key);
  if (!src) { fail("T1", p.rel, "no English page with the same course, chapter and slug"); continue; }
  if (pick(p.data) !== pick(src.data)) fail("T1", p.rel, "must keep the English page's kind, order, slug, minutes, exercise ids and agent blocks, quiz answers, concept scenes and number of checks");
  if (JSON.stringify(skeleton(p.body)) !== JSON.stringify(skeleton(src.body))) fail("T2", p.rel, "must use the same components, in the same order and with the same ids, as the English page");
}
const shape = (v) => JSON.stringify(v.scenes.map((s) => [s.cues?.length, (s.panes ?? []).map((p) => [p.type, atsOf(p)])]));
for (const [key, v] of videos) {
  const [locale, ...rest] = key.split("/");
  if (locale === "en" || !v?.scenes) continue;
  const src = videos.get(["en", ...rest].join("/"));
  if (src && shape(v) !== shape(src)) fail("T3", `videos/${key}.ts`, "must keep the English video's scenes, cue counts, pane types and timings");
}
for (const [locale, tr] of Object.entries(translations)) {
  for (const k of Object.keys(tr.pages ?? {})) if (!en.has(k)) fail("T4", `i18n/content/${locale}.ts`, `pages["${k}"] matches no page`);
  for (const k of en.keys()) if (!tr.pages?.[k] && !pages.some((p) => p.locale === locale && p.key === k)) warn("T4", `i18n/content/${locale}.ts`, `no title for ${k}; navigation shows English`);
  for (const [id, c] of Object.entries(tr.courses ?? {})) {
    const course = courseById.get(id);
    if (!course) { fail("T4", `i18n/content/${locale}.ts`, `course "${id}" doesn't exist`); continue; }
    if (c.outcomes && c.outcomes.length !== course.outcomes.length) fail("T4", `i18n/content/${locale}.ts`, `${id}: ${c.outcomes.length} outcomes, English has ${course.outcomes.length}`);
  }
}

await vite.close();
const counts = `${courses.length} courses, ${en.size} English pages, ${pages.length - en.size} translated pages, ${videos.size} videos`;
for (const w of warnings) console.log(`warn ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`FAIL ${e}`);
  console.log(`\n${errors.length} problem(s) in ${counts}. See STANDARD.md for each rule.`);
  process.exit(1);
}
console.log(`Content check passed: ${counts}${warnings.length ? `, ${warnings.length} warning(s)` : ""}.`);
