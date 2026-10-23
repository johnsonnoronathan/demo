# 第 4 章 · はじめに: まとめ

パフォーマンステスト · 第 4 章: まとめ · 5 分

> 静的テストと動的テストを日々の流れにまとめ、結果を報告し、受け入れを行い、自分のプロジェクトに適用し、コースを振り返る。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

## 書き起こし: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## レッスン本文

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## この章で得られること

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **概要** (全体): パフォーマンステストが測るもの、2 つのテストの系統、そして練習アプリ。
2. **静的テスト** (個別): 作ったものを実行せずに読んで、パフォーマンスの問題を見つける。
3. **動的テスト** (個別): システムを動かし、トラフィックを流し、ユーザーの体感を測る。
4. **まとめ** (全体): 両方をワークフローにまとめ、結果を報告し、受け入れを行い、自分のプロジェクトに適用し、コース全体を振り返る。

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- レッスン 4.1: [パフォーマンステストのワークフロー](/demo/ja/performance-testing/review/workflow.md) (25 分). どこで何を実行するか：プルリクエストごとの静的ゲート、リリース前の動的テスト、本番での監視。
- レッスン 4.2: [結果を報告する](/demo/ja/performance-testing/review/reporting.md) (20 分). 人が判断でき、他の人がテストを再現できるようにパフォーマンス結果をまとめる。
- レッスン 4.3: [パフォーマンスの受け入れ](/demo/ja/performance-testing/review/acceptance.md) (30 分). 予算を受け入れ基準に変え、1 つのコマンドで受け入れテストを実行し、署名つきの Go / No-Go 判断を下す。
- レッスン 4.4: [自分のプロジェクトで静的テスト](/demo/ja/performance-testing/review/your-project.md) (45 分). コースの静的チェックを実際のコードベースで自分で実行し、数値を読み、最初の予算を決め、修正をエージェントに任せる。
- 第 4 章 · まとめ: [コースのまとめ](/demo/ja/performance-testing/review/summary.md) (10 分). コースで扱ったすべてを一か所に。そして次に進む先。

---

前へ: [第 3 章 · まとめ: 動的テスト：まとめ](/demo/ja/performance-testing/dynamic/summary.md)
次へ: [レッスン 4.1: パフォーマンステストのワークフロー](/demo/ja/performance-testing/review/workflow.md)
