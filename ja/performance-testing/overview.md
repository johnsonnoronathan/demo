# 第 1 章 · はじめに: 概要

パフォーマンステスト · 第 1 章: 概要 · 5 分

> このコースで扱う内容、コースの構成、そして教室とエージェント用プロンプトの使い方。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

## 書き起こし: Overview (1:53)

**0:00 Welcome.** Welcome to Performance Testing on Testbench. In this course you'll learn to find what makes software slow, before your users do. "The site feels slow" is a complaint. A number with a cause attached is a finding. This course teaches you to get from one to the other.

**0:20 Four chapters.** The course has four chapters. First, an overview: what performance testing measures, and how. Then static testing: finding problems by reading code, query plans and build output, without running anything. Then dynamic testing: running the app under realistic traffic and measuring what users feel. And finally a summary that puts both into a workflow, and into a report people can act on.

**0:48 The practice app.** You'll practise on Larkspur Books, a small online bookshop with five thousand books and two hundred thousand orders. It's slow on purpose. One page of books runs a hundred and one database queries, and on a phone the main image takes almost ten seconds to appear. By the end of the course you'll have found and fixed every one of those problems, with a number to prove each fix.

**1:17 How each page works.** Every page works the same way. Watch a short video, like this one. Then read the lesson below it, at your own pace. Then do your part of the hands-on exercise: run the checks yourself, and read the numbers. Hand the implementation to a coding agent. Copy the exercise's prompt, and the agent makes the fix and quotes its output. Then verify: rerun the same check yourself. The number you see is the one that counts, and the decision is yours.

## レッスン本文

"The site feels slow" is a complaint. "p95 for `/api/books` is 1.3 seconds against a 300 ms budget, because the endpoint runs 101 queries per request" is a finding someone can fix. This course teaches you to get from the first to the second, reliably.

## この章で得られること

- Know what questions performance testing answers, and which numbers it reports
- Tell static testing from dynamic testing, and know when each one pays off
- Have the practice app running, with a first measurement written down
- Know how to hand a hands-on exercise to a coding agent, and what to check when it reports back

## How the course is built

The course moves from the big picture to specific techniques and back again. Chapter 1 frames the problem. Chapters 2 and 3 each go deep on one family of tests. Chapter 4 puts them together into a workflow and a report.

1. **概要** (全体): パフォーマンステストが測るもの、2 つのテストの系統、そして練習アプリ。
2. **静的テスト** (個別): 作ったものを実行せずに読んで、パフォーマンスの問題を見つける。
3. **動的テスト** (個別): システムを動かし、トラフィックを流し、ユーザーの体感を測る。
4. **まとめ** (全体): 両方をワークフローにまとめ、結果を報告し、受け入れを行い、自分のプロジェクトに適用し、コース全体を振り返る。

Every chapter follows the same shape:

1. **An opening** like this one: what you'll get, and a map of the chapter.
2. **Lessons.** Each mixes concepts and practice. Concepts come with a short **animation** you can play, pause and step through. Hands-on exercises run against the practice app and show **screenshots** of what you should see.
3. **A summary** that collects the chapter's key points and gives you a few questions to check yourself.

## The practice app

Everything you test is **Larkspur Books**, a small bookshop in `academy/practice/larkspur`: a storefront page and three JSON endpoints over a SQLite database of 5,000 books, 50,000 reviews and 200,000 orders. It needs Node.js 22.13 or later and nothing else.

Larkspur is slow on purpose. Each problem in it is one this course teaches you to find, and every number quoted in the lessons comes from a real run against it. Your numbers will differ with your machine; the shape of the results won't.

## Working with an agent

This course teaches you to test performance, and an agent helps you do it. The split is the same in every exercise:

| You | The agent |
| --- | --- |
| Learn the concept: watch, read | |
| Run the checks and tests, read the numbers | |
| | Implement: fixes, scripts, gates, CI configuration |
| | Report back, quoting real command output |
| Verify: rerun the same check and compare | |
| Decide: accept, reject, or set a new budget | |

Each exercise has two parts. **Your part** comes first: the steps you run yourself, with the output you should expect. Then the **agent part**: a prompt you copy into Claude Code or another coding agent, so it makes the changes. The prompt is self-contained: where to work, the steps, how to tell it's done, and what to report. It tells the agent to quote real output instead of estimating, and never to loosen a budget to make a check pass.

When the agent says it's done, rerun the check yourself. The number you see is the one that counts. By the end of the course you'll use the same loop on your own project (lesson 4.4) and finish with a formal acceptance decision (lesson 4.3).

> **Agents can read the whole course.** Every page has a Markdown version (see "For agents" in the page margin), and `/llms.txt` lists them all. Point an agent there when it needs context beyond a single exercise.

## In this chapter

- レッスン 1.1: [パフォーマンステストが測るもの](/demo/ja/performance-testing/overview/what-it-measures.md) (20 分). レイテンシ、スループット、エラー：すべてのパフォーマンステストが報告する 3 つの数値と、レイテンシをパーセンタイルで示す理由。
- レッスン 1.2: [静的テストと動的テスト](/demo/ja/performance-testing/overview/static-and-dynamic.md) (20 分). 2 つのテストの系統、それぞれが見つけられるものと見つけられないもの、テスト前にどんな問いを立てるか。
- 第 1 章 · まとめ: [概要：まとめ](/demo/ja/performance-testing/overview/summary.md) (5 分). このあとのコースで使う用語と計画。

---

次へ: [レッスン 1.1: パフォーマンステストが測るもの](/demo/ja/performance-testing/overview/what-it-measures.md)
