// Static check: flags database calls made inside loops, the usual shape of an N+1 query.
// It is a heuristic: it reads source text and tracks which lines sit inside a loop body.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const LOOP = /\b(for\s*\(|while\s*\(|\.forEach\(|\.map\(|\.flatMap\(|\.reduce\()/;
const QUERY = /\bquery\(|\.prepare\(|\.(get|all|run)\(/;

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(m?js|ts)$/.test(name) ? [p] : [];
  });
}

const target = process.argv[2] || "src";
let findings = 0;
for (const file of files(target)) {
  const lines = readFileSync(file, "utf8").split("\n");
  const loops = []; // open loops: the brace depth where each started
  let depth = 0;
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, "");
    const loop = code.match(LOOP);
    const inLoop = loops.length > 0 || (loop && QUERY.test(code.slice(loop.index + loop[0].length)));
    if (inLoop && QUERY.test(code)) {
      findings++;
      console.log(`${relative(process.cwd(), file)}:${i + 1}  query inside a loop (possible N+1)\n    ${line.trim()}`);
    }
    const start = depth;
    for (const ch of code) {
      if (ch === "{" || ch === "(") depth++;
      if (ch === "}" || ch === ")") depth--;
    }
    // A loop whose body stays open past this line is tracked until its depth closes again.
    while (loops.length && depth <= loops[loops.length - 1]) loops.pop();
    if (loop && depth > start) loops.push(start);
  });
}
console.log(findings ? `\n${findings} possible N+1 pattern(s).` : "No queries inside loops found.");
process.exit(findings ? 1 : 0);
