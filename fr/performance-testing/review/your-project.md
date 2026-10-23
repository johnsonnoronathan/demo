# Leçon 4.4: Tests statiques sur votre propre projet

Tests de performance · Chapitre 4: Synthèse · 45 min

> Lancer vous-même les contrôles statiques du cours sur un vrai code, lire les chiffres, fixer les premiers budgets et confier les corrections à un agent.

*Cette leçon n'est pas encore traduite en fr : vous lisez le texte anglais. Le titre et la navigation sont traduits.*

**Vous saurez:**
- Find the equivalent of each of the course's static checks for your own stack
- Run them yourself on one user journey and record a baseline
- Turn the baseline into first budgets and one gate
- Hand a finding to an agent, then verify its fix with the same command

## Transcription: Static testing on your own project (2:17)

**0:00 Introduction.** Larkspur was slow in instructive ways. Your own project is slow in its own ways, and the only way to find out how is to run the checks on it.

**0:12 Why you run them.** An agent could run every command in this lesson. So why run them yourself? Because reading real output is the skill. You learn what's normal for your code by seeing its numbers. Because whether a number is acceptable depends on your users, and that's your call. And because your run is the evidence, when an agent later says it's fixed.

**0:39 Four questions.** The four static questions from chapter two work on almost any stack. How heavy is what we ship? How many queries does one request run, and does that number grow with the page size? Does each hot query use an index, or scan a large table? And what blocks the first render?

**1:03 Baseline.** Pick one user journey: the page most users land on, and the calls it makes. Weigh the production build, not the development one. Count the queries for one request, then for a page twice as long. Explain the top queries, and write it all down in the same table every time. That's your baseline.

**1:26 Reading the numbers.** Real output is noisier than Larkspur's. Growth matters more than size: queries that double when the page doubles are an N+1. Scans only matter on large tables. A scan of a forty-row lookup table is normal. And set first budgets just above today's numbers, so the gate passes now and catches the next regression.

**1:50 Hand it over.** Two agent prompts finish the job. The first maps the four checks onto your stack, as commands you run yourself. The second fixes one finding on a new branch, and adds a gate that fails if it comes back. Then you rerun the check yourself, break the fix on purpose to see the gate fail, and review the branch like any other change.

## La leçon

Larkspur was built to be slow in instructive ways. Your own project is slow in its own ways, and the only way to find out how is to run the checks on it. This lesson is the bridge: the same four static questions, on a real codebase, with you running the checks and an agent doing the fixing.

## Why you run these yourself

An agent can run every command in this lesson, so why do it by hand? Three reasons:

- **Reading real output is the skill.** Knowing that 90 KB of script is a lot, or that 12 queries for one page is suspicious, comes from having seen the numbers for your own code.
- **You own the decision.** Whether a number is acceptable depends on your users, which an agent doesn't know.
- **Your run is the evidence.** When an agent later says "fixed", you rerun the same command and see it yourself.

Static checks make this cheap: none of them need load, staging or special hardware. Most take seconds.

## Four questions, any stack

Each static check in chapter 2 answers a question that applies to almost any web application. Here's how to ask it on common stacks:

| Question | Larkspur | Your project |
| --- | --- | --- |
| **How heavy is what we ship?** | `npm run budget` | Build for production, then weigh the output (command below). For a gate: [size-limit](https://github.com/ai/size-limit) for JavaScript, or Lighthouse CI's resource-size assertions. |
| **How many queries per request?** | `npm run lint:queries`, `x-query-count` header | Turn on query logging in development and count lines per request. Django: `assertNumQueries` in a test. Rails: the `bullet` gem. Laravel: `Model::preventLazyLoading()`. Hibernate: `hibernate.generate_statistics=true`. Prisma: `log: ['query']`. |
| **Does each hot query use an index?** | `npm run explain`, `npm run check:plans` | PostgreSQL: `EXPLAIN (ANALYZE, BUFFERS)`; look for `Seq Scan` on a large table. MySQL 8: `EXPLAIN FORMAT=TREE`; look for `Table scan`. SQLite: `EXPLAIN QUERY PLAN`; look for `SCAN`. |
| **What blocks the first render?** | the `<script>` tags in `public/index.html` | Look for `<script src>` in the `<head>` without `defer`, `async` or `type="module"`, and for large stylesheets. Lighthouse lists them under "Eliminate render-blocking resources". |

To find the queries worth explaining, start from what actually runs most: PostgreSQL's `pg_stat_statements` sorted by `total_exec_time`, MySQL's slow query log, or simply the query log from one pass through your user journey.

> **EXPLAIN ANALYZE runs the query.** `EXPLAIN ANALYZE` executes the statement to time it. That's fine for `SELECT` on a development database. For anything that writes, use plain `EXPLAIN`, or wrap it in a transaction you roll back.

## Step by step

**1. Pick one user journey.** The page most users land on, and the two or three API calls it makes. A whole-app survey is tempting and rarely finished.

**2. Weigh the production build.** Development builds are unminified and much larger, so their numbers mislead. For a JavaScript front end:

```bash
npm run build
find dist -type f \( -name '*.js' -o -name '*.css' \) | while read -r f; do
  printf '%8.1f KB  %s\n' "$(gzip -c "$f" | wc -c | awk '{print $1/1024}')" "$f"
done | sort -rn | head -15
```

Change `dist` to your build's output folder (`build`, `.next/static`, `public/assets`…). Then look for images over 200 KB: `find dist public -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) -size +200k`.

**3. Count queries per request.** Switch on query logging in development, request one endpoint once, and count the queries it ran. Then request a page with twice as many items. If the count doubles, you have an N+1.

**4. Explain the top queries.** Take the three slowest or most frequent queries from step 3 and run them through your database's `EXPLAIN`. Note every full scan of a table with more than a few thousand rows.

**5. Write it down.** Same format every time, so the next run can be compared with this one:

```md title="perf/baseline.md"
# Static baseline: <journey>, <date>, commit <sha>

| Check | Command | Result | Budget |
| ----- | ------- | ------ | ------ |
| JS shipped (gz) | see STATIC-CHECKS.md §1 | 412 KB | 400 KB |
| Largest image | find … -size +200k | hero.png 1.1 MB | 250 KB |
| Queries, GET /api/products | query log | 52 (grows with page size) | ≤ 5 |
| Plan, orders by customer | EXPLAIN | Seq Scan on orders (1.2M rows) | index search |
| Render-blocking scripts | <head> scan | 2 | 0 |

Findings, largest first:
1. …
```

The numbers above are an example of the shape, not targets.

## Reading real numbers

On Larkspur every problem was planted and obvious. Real output is noisier. Some rules of thumb:

- **Growth beats size.** 8 queries for a page may be fine. 8 queries that become 58 when the page shows 50 more items is not.
- **Scans matter on large tables only.** A `Seq Scan` on a 40-row lookup table is normal and often faster than an index.
- **Weigh against the user's network, not yours.** Your laptop on office Wi-Fi hides what 400 KB of script costs on a mid-range phone. Lesson 3.1 showed what it cost on Larkspur.
- **One finding per cause.** Three slow endpoints that share one unindexed query are one finding, not three.

## From baseline to budget

The first budgets come from the baseline, as in lesson 2.1: just above today's numbers, so the gate passes today and fails on the next regression. Write down the target next to it, the number you'd like to reach once fixes land. Then pick **one** gate to automate first, usually the bundle size or a query-count test, because both are fast, deterministic and easy to explain when they fail.

## Hand fixes to an agent

The division of labour from the rest of the course holds here, with one difference: this is a codebase other people depend on. So the prompts below tell the agent to work on a branch, to ask before adding dependencies, and never to loosen a budget to make a check pass.

**Pratique · 15 min.** Objectif. Have an agent map the course's four static checks onto your repository's stack, as commands you will run yourself.

1. Open your project in a terminal and start a coding agent there.
2. Copy the prompt below. It asks the agent to write `perf/STATIC-CHECKS.md` with the commands for your stack, and not to run anything heavy or change code.
3. Read what it wrote. Does each command make sense for your project? Ask it to explain any you don't understand.

**C'est terminé quand**
- perf/STATIC-CHECKS.md has a command and reading guide for all four questions
- Every command fits this repository's stack, paths and tools
- No application code or configuration changed

**La part de l'agent : déléguez l'implémentation**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Find the static checks for your stack
Goal: Have an agent map the course's four static checks onto your repository's stack, as commands you will run yourself.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Identify the stack from the repository: languages, framework, build tool and its output folder, ORM or database library, and database engine. Quote the files you read.
2. For each of these four questions, give one concrete command or procedure for this repository, preferring tools the project already has: (1) the weight of the production build's scripts, stylesheets and images, gzipped where the server compresses; (2) the number of database queries per request on one endpoint; (3) the query plan of the endpoint's main queries, and how to tell a full scan from an index search on this database; (4) which scripts or stylesheets block the first render.
3. Write `perf/STATIC-CHECKS.md` with one section per question: the command, what it measures, how to read its output, and any setting that must be switched on first (for example query logging in development).
4. If a check needs a new dev dependency, name it and why, and don't install it.
5. Do not run load tests, and do not change application code or configuration. The learner runs the checks.

Done when:
- perf/STATIC-CHECKS.md has a command and reading guide for all four questions
- Every command fits this repository's stack, paths and tools
- No application code or configuration changed

Report back:
- A summary of the stack, with the files that show it
- The four commands, in a table
- Any new dev dependencies the learner would need to approve

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

Now the part only you can do: run each command in `perf/STATIC-CHECKS.md` yourself, on your chosen journey, and fill in `perf/baseline.md` as in step 5. Set the budgets. Rank the findings.

**Pratique · 30 min.** Objectif. Have an agent fix one finding from your baseline and add a gate that would catch it again; then verify it with your own run.

1. Pick the finding you want fixed first, and name it when you paste the prompt below.
2. When the agent reports back, check out its branch and **rerun the finding's check yourself**. Does your number match the one it quoted?
3. Break it on purpose, as in lesson 4.1: undo the fix locally and confirm the new gate fails. Then restore it.
4. Update `perf/baseline.md` with the new number. Review the branch like any other change before it's merged.

**C'est terminé quand**
- The finding's check shows the improvement, before and after quoted from the same command
- The project's existing tests pass
- A gate exists that fails when the problem comes back

**La part de l'agent : déléguez l'implémentation**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 4.4, "Static testing on your own project".

Exercise: Fix one finding and add a gate
Goal: Have an agent fix one finding from your baseline and add a gate that would catch it again; then verify it with your own run.

Project: the learner's own repository, which is your current working directory. Before anything else, read its README and build files to learn the stack.

Steps:
1. Read `perf/baseline.md` and `perf/STATIC-CHECKS.md`. Work on the finding the learner names; if none is named, take the one furthest over its budget, and say which you chose.
2. Create a new branch. Before changing anything, run the finding's check from STATIC-CHECKS.md and quote the output.
3. Find the cause and name the file and line. Make the smallest change that removes it. Keep behaviour the same; run the project's existing tests and quote the result.
4. Run the same check again and quote the output, so before and after come from the same command.
5. Add a gate that fails if this regresses, using the project's existing test or CI setup: for example a test that asserts the number of queries for the endpoint, or a bundle-size limit in CI. Make sure it exits non-zero on a breach.
6. Do not change any budget in perf/baseline.md. Do not push, merge or deploy.

Done when:
- The finding's check shows the improvement, before and after quoted from the same command
- The project's existing tests pass
- A gate exists that fails when the problem comes back

Report back:
- The cause, with file and line
- Before and after output of the check
- The gate you added and how to run it
- The branch name and the list of changed files

Ground rules:
- Work on a new branch. Don't commit to the main branch, push, or deploy unless the learner asks.
- Ask before adding a dependency or changing configuration that production uses.
- Never loosen a budget, threshold or acceptance criterion to make a check pass. If you think one is wrong, say so and stop.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: https://johnsonnoronathan.github.io/demo/performance-testing/review/your-project.md
```

## Points clés

- The four static questions carry over to any stack: how heavy is what we ship, how many queries per request, does each hot query use an index, and what blocks rendering.
- Run the checks yourself the first time. Reading real output is how you learn what's normal for your codebase, and you're the one who decides what's acceptable.
- Measure one user journey first, not the whole app. A baseline you can repeat beats a survey you can't.
- Queries per request that grow with page size, and full scans of large tables on a request path, are findings on any stack.
- Set first budgets just above today's numbers so the gate passes now and catches the next regression; tighten them as fixes land.
- The agent proposes commands and writes fixes and gates; you run the checks, read the numbers and approve.

---

Précédent: [Leçon 4.3: Acceptation des performances](/demo/fr/performance-testing/review/acceptance.md)
Suivant: [Chapitre 4 · Résumé: Synthèse du cours](/demo/fr/performance-testing/review/summary.md)
