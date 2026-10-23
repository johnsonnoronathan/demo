# 第 3 章 · はじめに: 動的テスト

パフォーマンステスト · 第 3 章: 動的テスト · 5 分

> システムを動かし、トラフィックを流し、ユーザーが実際に感じるものを測る。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

## 書き起こし: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## レッスン本文

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## この章で得られること

- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

## Before you start

Install k6, the load testing tool this chapter uses:

| System | Command |
| --- | --- |
| macOS | `brew install k6` |
| Windows | `winget install k6 --source winget` |
| Debian, Ubuntu | see [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

If you can't install it, every exercise also works with the practice app's built-in tool, `npm run load`. You'll need Chrome for Lighthouse and the profiler.

> **Run tests from a quiet machine.** Close heavy apps before a dynamic test and run the load generator and the app on the same machine only when comparing before with after. Numbers from different machines, or from a busy laptop, aren't comparable.

## In this chapter

- レッスン 3.1: [Lighthouse によるラボ計測](/demo/ja/performance-testing/dynamic/lighthouse.md) (25 分). シミュレーションしたスマートフォンでページを読み込み、ユーザーに何がいつ見えるかを測る。
- レッスン 3.2: [k6 による負荷テスト](/demo/ja/performance-testing/dynamic/load-testing.md) (30 分). 買い物客で賑わう夜をシミュレートし、しきい値でアプリが予算を満たすかを判定する。
- レッスン 3.3: [ストレス・スパイク・ソークテスト](/demo/ja/performance-testing/dynamic/stress-spike-soak.md) (30 分). 想定以上の負荷で天井を見つけ、急増を乗り切り、何時間にもわたるゆっくりした劣化を捉える。
- レッスン 3.4: [ボトルネックを見つける](/demo/ja/performance-testing/dynamic/bottlenecks.md) (30 分). 負荷中のアプリをプロファイルし、フレームグラフを読み、ホットパスを直して同じテストで証明する。
- 第 3 章 · まとめ: [動的テスト：まとめ](/demo/ja/performance-testing/dynamic/summary.md) (5 分). アプリを動かすことで、読むだけではわからなかったこと。

---

前へ: [第 2 章 · まとめ: 静的テスト：まとめ](/demo/ja/performance-testing/static/summary.md)
次へ: [レッスン 3.1: Lighthouse によるラボ計測](/demo/ja/performance-testing/dynamic/lighthouse.md)
