# 第 2 章 · はじめに: 静的テスト

パフォーマンステスト · 第 2 章: 静的テスト · 5 分

> 何も実行する前に、作ったものを読んでパフォーマンスの問題を見つける。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

## 書き起こし: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## レッスン本文

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## この章で得られること

- Turn your plan's budgets into a check that passes or fails the build
- Spot the N+1 query pattern in code, with a linter and by eye, and remove it
- Read a SQLite query plan, recognise a full table scan, and fix it with an index
- Find what makes a page heavy, and cut it below budget
- Know which of these checks belong on every pull request

## What you'll use

| Tool | What it reads | Lesson |
| --- | --- | --- |
| `npm run budget` | The files the storefront loads, measured against `budget.json` | 2.1, 2.4 |
| `npm run lint:queries` | Source files, looking for database calls inside loops | 2.2 |
| `npm run explain` | SQLite's plan for a query, without running it | 2.3 |

All three ship with the practice app and need nothing installed.

## In this chapter

- レッスン 2.1: [パフォーマンス予算](/demo/ja/performance-testing/static/budgets.md) (20 分). 計測の前に上限を決め、変更のたびにチェックで守らせる。
- レッスン 2.2: [N+1 クエリのコードレビュー](/demo/ja/performance-testing/static/n-plus-one.md) (25 分). データベースを使うコードで最も多いパフォーマンスバグ。読んで見つける方法と取り除く方法。
- レッスン 2.3: [クエリプランを読む](/demo/ja/performance-testing/static/query-plans.md) (25 分). クエリを実行せずにデータベースに実行方法を尋ね、全表スキャンを適切なインデックスで直す。
- レッスン 2.4: [アセットの重さ](/demo/ja/performance-testing/static/asset-weight.md) (20 分). ファイルの重さを量ってページが重い原因を見つけ、見た目を変えずに予算内に収める。
- 第 2 章 · まとめ: [静的テスト：まとめ](/demo/ja/performance-testing/static/summary.md) (5 分). アプリを動かさずに見つけたもの、そして静的チェックではわからないこと。

---

前へ: [第 1 章 · まとめ: 概要：まとめ](/demo/ja/performance-testing/overview/summary.md)
次へ: [レッスン 2.1: パフォーマンス予算](/demo/ja/performance-testing/static/budgets.md)
