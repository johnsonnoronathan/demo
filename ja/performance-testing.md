# パフォーマンステスト

> ユーザーより先に、ソフトウェアを遅くしている原因を見つける。

Web アプリケーションのパフォーマンスを両面からテストする方法を学びます。静的テストは何も実行せずにコード・クエリ・アセットを調べ、動的テストはシステムを動かしてトラフィックを流し、ユーザーの体感を測ります。練習には、わざと遅く作られた小さな書店アプリ Larkspur Books を使います。

合計時間: 6 時間 50 分

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## 第 1 章: 概要

パフォーマンステストが測るもの、2 つのテストの系統、そして練習アプリ。

- [第 1 章 · はじめに: 概要](/demo/ja/performance-testing/overview.md) (5 分). このコースで扱う内容、コースの構成、そして教室とエージェント用プロンプトの使い方。
- [レッスン 1.1: パフォーマンステストが測るもの](/demo/ja/performance-testing/overview/what-it-measures.md) (20 分). レイテンシ、スループット、エラー：すべてのパフォーマンステストが報告する 3 つの数値と、レイテンシをパーセンタイルで示す理由。
- [レッスン 1.2: 静的テストと動的テスト](/demo/ja/performance-testing/overview/static-and-dynamic.md) (20 分). 2 つのテストの系統、それぞれが見つけられるものと見つけられないもの、テスト前にどんな問いを立てるか。
- [第 1 章 · まとめ: 概要：まとめ](/demo/ja/performance-testing/overview/summary.md) (5 分). このあとのコースで使う用語と計画。

## 第 2 章: 静的テスト

作ったものを実行せずに読んで、パフォーマンスの問題を見つける。

- [第 2 章 · はじめに: 静的テスト](/demo/ja/performance-testing/static.md) (5 分). 何も実行する前に、作ったものを読んでパフォーマンスの問題を見つける。
- [レッスン 2.1: パフォーマンス予算](/demo/ja/performance-testing/static/budgets.md) (20 分). 計測の前に上限を決め、変更のたびにチェックで守らせる。
- [レッスン 2.2: N+1 クエリのコードレビュー](/demo/ja/performance-testing/static/n-plus-one.md) (25 分). データベースを使うコードで最も多いパフォーマンスバグ。読んで見つける方法と取り除く方法。
- [レッスン 2.3: クエリプランを読む](/demo/ja/performance-testing/static/query-plans.md) (25 分). クエリを実行せずにデータベースに実行方法を尋ね、全表スキャンを適切なインデックスで直す。
- [レッスン 2.4: アセットの重さ](/demo/ja/performance-testing/static/asset-weight.md) (20 分). ファイルの重さを量ってページが重い原因を見つけ、見た目を変えずに予算内に収める。
- [第 2 章 · まとめ: 静的テスト：まとめ](/demo/ja/performance-testing/static/summary.md) (5 分). アプリを動かさずに見つけたもの、そして静的チェックではわからないこと。

## 第 3 章: 動的テスト

システムを動かし、トラフィックを流し、ユーザーの体感を測る。

- [第 3 章 · はじめに: 動的テスト](/demo/ja/performance-testing/dynamic.md) (5 分). システムを動かし、トラフィックを流し、ユーザーが実際に感じるものを測る。
- [レッスン 3.1: Lighthouse によるラボ計測](/demo/ja/performance-testing/dynamic/lighthouse.md) (25 分). シミュレーションしたスマートフォンでページを読み込み、ユーザーに何がいつ見えるかを測る。
- [レッスン 3.2: k6 による負荷テスト](/demo/ja/performance-testing/dynamic/load-testing.md) (30 分). 買い物客で賑わう夜をシミュレートし、しきい値でアプリが予算を満たすかを判定する。
- [レッスン 3.3: ストレス・スパイク・ソークテスト](/demo/ja/performance-testing/dynamic/stress-spike-soak.md) (30 分). 想定以上の負荷で天井を見つけ、急増を乗り切り、何時間にもわたるゆっくりした劣化を捉える。
- [レッスン 3.4: ボトルネックを見つける](/demo/ja/performance-testing/dynamic/bottlenecks.md) (30 分). 負荷中のアプリをプロファイルし、フレームグラフを読み、ホットパスを直して同じテストで証明する。
- [第 3 章 · まとめ: 動的テスト：まとめ](/demo/ja/performance-testing/dynamic/summary.md) (5 分). アプリを動かすことで、読むだけではわからなかったこと。

## 第 4 章: まとめ

両方をワークフローにまとめ、結果を報告し、受け入れを行い、自分のプロジェクトに適用し、コース全体を振り返る。

- [第 4 章 · はじめに: まとめ](/demo/ja/performance-testing/review.md) (5 分). 静的テストと動的テストを日々の流れにまとめ、結果を報告し、受け入れを行い、自分のプロジェクトに適用し、コースを振り返る。
- [レッスン 4.1: パフォーマンステストのワークフロー](/demo/ja/performance-testing/review/workflow.md) (25 分). どこで何を実行するか：プルリクエストごとの静的ゲート、リリース前の動的テスト、本番での監視。
- [レッスン 4.2: 結果を報告する](/demo/ja/performance-testing/review/reporting.md) (20 分). 人が判断でき、他の人がテストを再現できるようにパフォーマンス結果をまとめる。
- [レッスン 4.3: パフォーマンスの受け入れ](/demo/ja/performance-testing/review/acceptance.md) (30 分). 予算を受け入れ基準に変え、1 つのコマンドで受け入れテストを実行し、署名つきの Go / No-Go 判断を下す。
- [レッスン 4.4: 自分のプロジェクトで静的テスト](/demo/ja/performance-testing/review/your-project.md) (45 分). コースの静的チェックを実際のコードベースで自分で実行し、数値を読み、最初の予算を決め、修正をエージェントに任せる。
- [第 4 章 · まとめ: コースのまとめ](/demo/ja/performance-testing/review/summary.md) (10 分). コースで扱ったすべてを一か所に。そして次に進む先。
