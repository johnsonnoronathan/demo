# 指導案: テストケースの書き方

テストの基礎を短いレッスンで。テストケースとは何か、信頼できるテストケースの条件、同値分割と境界値による入力の選び方、異常系の網羅、書いたテストケースの自動テスト化、そして大きくなるテストスイートの健全な保ち方を学びます。

- 合計時間: 1 時間 45 分
- 動画: 7 (13:05)
- ソフトウェアをテストする人、これからテストしたい人：開発者、テスター、プロダクト担当者。テストの経験は不要です。レッスン 3.1 では少し JavaScript を読みます。

## コースの目標

- テストケースを読み、書き、手で実行する
- 曖昧なテストケースを具体的で再現可能なものに書き直す
- 同値分割と境界値でテスト入力を選ぶ
- 異常系を網羅し、デシジョンテーブルで抜けを見つける
- Arrange・Act・Assert でテストケースを自動テストにする
- テストピラミッドとトレーサビリティマトリクスでスイートを整理する

## 始める前に

- ソフトウェアがどう壊れるかへの好奇心
- Node.js（レッスン 3.1 のテストを自分で動かす場合のみ）

## 構成

1. **基礎** (30 min): テストケースとは何か、良いテストケースと弱いテストケースの違い。
2. **テストケースの設計** (45 min): 同値分割・境界値・デシジョンテーブルで、書くべきケースを選ぶ。
3. **自動化とスケール** (30 min): ケースをコードにし、信頼されるスイートに整える。

## 第 1 章: 基礎

テストケースとは何か、良いテストケースと弱いテストケースの違い。 (30 分)

### レッスン 1.1: テストケースとは？ (15 分, ▶ 2:56)

テストケースの構成要素を項目ごとに組み立て、実際のサインインページに対して手で実行する。

/demo/ja/test-cases/foundations/anatomy.md

学習成果:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

要点:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### レッスン 1.2: 良いテストケース、弱いテストケース (15 分, ▶ 1:55)

テストケースを信頼できるものにする 5 つの習慣と、多くのチームが使う Given・When・Then の形。

/demo/ja/test-cases/foundations/good-cases.md

学習成果:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

要点:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## 第 2 章: テストケースの設計

同値分割・境界値・デシジョンテーブルで、書くべきケースを選ぶ。 (45 分)

### レッスン 2.1: 同値分割と境界値 (15 分, ▶ 1:30)

同値分割と境界値分析：何千もの入力の代わりに、よく選んだ少数の入力。

/demo/ja/test-cases/design/partitions.md

学習成果:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

要点:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### レッスン 2.2: 正常系の先へ (15 分, ▶ 1:28)

異常系、エッジケース、そして条件が組み合わさるルールのためのデシジョンテーブル。

/demo/ja/test-cases/design/negative.md

学習成果:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

要点:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### レッスン 2.3: Exploratory testing (15 分, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/ja/test-cases/design/exploratory.md

学習成果:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

要点:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## 第 3 章: 自動化とスケール

ケースをコードにし、信頼されるスイートに整える。 (30 分)

### レッスン 3.1: テストケースから自動テストへ (15 分, ▶ 1:28)

書いたテストケースを Arrange・Act・Assert でコードにし、境界値テストが本物のバグを捕まえるのを見る。

/demo/ja/test-cases/automation/unit-tests.md

学習成果:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

要点:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### レッスン 3.2: テストスイートを整理する (15 分, ▶ 1:42)

テストピラミッド、要件へのトレーサビリティ、そして大きくなるスイートを健全に保つ方法。

/demo/ja/test-cases/automation/suites.md

学習成果:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

要点:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
