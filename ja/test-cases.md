# テストケースの書き方

> 誰でも実行でき、バグを見つけるテストケースを書く。

テストの基礎を短いレッスンで。テストケースとは何か、信頼できるテストケースの条件、同値分割と境界値による入力の選び方、異常系の網羅、書いたテストケースの自動テスト化、そして大きくなるテストスイートの健全な保ち方を学びます。

合計時間: 1 時間 45 分

## 第 1 章: 基礎

テストケースとは何か、良いテストケースと弱いテストケースの違い。

- [レッスン 1.1: テストケースとは？](/demo/ja/test-cases/foundations/anatomy.md) (15 分). テストケースの構成要素を項目ごとに組み立て、実際のサインインページに対して手で実行する。
- [レッスン 1.2: 良いテストケース、弱いテストケース](/demo/ja/test-cases/foundations/good-cases.md) (15 分). テストケースを信頼できるものにする 5 つの習慣と、多くのチームが使う Given・When・Then の形。

## 第 2 章: テストケースの設計

同値分割・境界値・デシジョンテーブルで、書くべきケースを選ぶ。

- [レッスン 2.1: 同値分割と境界値](/demo/ja/test-cases/design/partitions.md) (15 分). 同値分割と境界値分析：何千もの入力の代わりに、よく選んだ少数の入力。
- [レッスン 2.2: 正常系の先へ](/demo/ja/test-cases/design/negative.md) (15 分). 異常系、エッジケース、そして条件が組み合わさるルールのためのデシジョンテーブル。
- [レッスン 2.3: Exploratory testing](/demo/ja/test-cases/design/exploratory.md) (15 分). Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

## 第 3 章: 自動化とスケール

ケースをコードにし、信頼されるスイートに整える。

- [レッスン 3.1: テストケースから自動テストへ](/demo/ja/test-cases/automation/unit-tests.md) (15 分). 書いたテストケースを Arrange・Act・Assert でコードにし、境界値テストが本物のバグを捕まえるのを見る。
- [レッスン 3.2: テストスイートを整理する](/demo/ja/test-cases/automation/suites.md) (15 分). テストピラミッド、要件へのトレーサビリティ、そして大きくなるスイートを健全に保つ方法。
