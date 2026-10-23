# レッスン 2.2: 正常系の先へ

テストケースの書き方 · 第 2 章: テストケースの設計 · 15 分

> 異常系、エッジケース、そして条件が組み合わさるルールのためのデシジョンテーブル。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

**このレッスンでできるようになること:**
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

## 書き起こし: Beyond the happy path (1:28)

**0:00 Introduction.** The happy path is the journey where everything goes right. Customers don't always stay on it.

**0:07 Negative cases.** Negative test cases check that the software handles bad input and misuse gracefully. Empty and missing values: a blank email field. Wrong types and formats: letters in a quantity box, or an email without an at sign. Extremes: a ten-thousand-character name, or a price of zero. And bad timing: double-clicking Pay, or a session that expires halfway through checkout.

**0:34 Decision tables.** When rules combine, use a decision table. Here's the discount code SAVE10: ten percent off orders of twenty dollars or more. List each condition as a column, then every combination as a row. Valid code, not expired, cart of twenty dollars or more: the discount is applied. When a single condition fails, the customer should get a clear, different message. Each row becomes a test case, and gaps in the requirements jump out. What should an expired code on a small cart say? Ask before you test.

**1:12 Recap.** To recap: for every happy path, ask how it could go wrong. Check empty values, wrong formats, extremes and bad timing. And when conditions combine, a decision table finds the cases, and the gaps.

## レッスン本文

Negative test cases prove the software fails gracefully: a clear message, no crash, no corrupted data. Most real bugs live here.

## A checklist for any input

- **Empty:** blank, whitespace only, missing entirely.
- **Format:** wrong type, wrong pattern, leading zeros, unexpected characters (`' " < >`, emoji, accents).
- **Size:** zero, negative, huge, very long text.
- **Timing:** double submit, back button, expired session, two tabs at once.
- **Permissions:** signed out, wrong account, admin-only pages.

## Decision tables

Write each condition as a column and list every combination. With three yes/no conditions you get up to eight rows; collapse rows where one condition decides the outcome on its own (an unknown code fails whatever the cart holds).

| Known | Not expired | ≥ $20 | Expected |
| --- | --- | --- | --- |
| Y | Y | Y | 10% off |
| Y | Y | N | “Add $X more…” |
| Y | N | Y | “This code has expired” |
| Y | N | N | *Ask the product owner* |
| N | – | – | “We don't recognise that code” |

> **ヒント.** **A gap is a finding.** When the table shows a combination nobody specified, raise it before testing. That question is cheaper now than a bug later.

## Try it

Larkspur offers free delivery for members, or for anyone spending $50 or more, but never to overseas addresses. Build the decision table.

## Quiz

1. Which is a negative test case for the email field?
   a. ada@larkspur.test is accepted
   b. ada.larkspur.test shows “Enter a valid email”
   c. The field has a label
   d. The page loads in under a second
   Answer: b. It feeds deliberately bad input and checks that the software rejects it clearly.
2. Three yes/no conditions combine. How many rows can the full decision table have?
   a. 3
   b. 6
   c. 8
   d. 9
   Answer: c. Each condition doubles the combinations: 2 × 2 × 2 = 8. Some rows may collapse.
3. A decision table row has no specified outcome. What should you do?
   a. Skip that row
   b. Decide the outcome yourself
   c. Ask the product owner before testing
   d. Mark it as passed
   Answer: c. It's a gap in the requirements. Raising it is part of testing.

## 要点

- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

---

前へ: [レッスン 2.1: 同値分割と境界値](/demo/ja/test-cases/design/partitions.md)
次へ: [レッスン 2.3: Exploratory testing](/demo/ja/test-cases/design/exploratory.md)
