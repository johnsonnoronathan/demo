# レッスン 2.1: 同値分割と境界値

テストケースの書き方 · 第 2 章: テストケースの設計 · 15 分

> 同値分割と境界値分析：何千もの入力の代わりに、よく選んだ少数の入力。

*このレッスンはまだjaに翻訳されていないため、英語の本文を表示しています。タイトルとナビゲーションは翻訳済みです。*

**このレッスンでできるようになること:**
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

## 書き起こし: Partitions and boundaries (1:30)

**0:00 Introduction.** Which inputs should you test? In this lesson, two techniques that turn thousands of possible inputs into a handful of good ones.

**0:09 Too many inputs.** The cart at Larkspur Books lets you order between one and ten copies of a book. You can't test every possible number. So how do you choose? Group inputs that the software should treat the same way. These groups are called equivalence partitions.

**0:29 One from each group.** There are three partitions here: too few, a valid amount, and too many. Pick one representative from each. Zero for too few. Five for valid. And fifteen for too many. Three test cases cover three behaviors.

**0:46 Bugs live at the edges.** But bugs love edges. A developer might type less-than where they meant less-than-or-equal. Boundary value analysis tests right at each edge, and just outside it. Zero and one at the bottom. Ten and eleven at the top. The code here says quantity less than ten. Only the test with exactly ten copies catches it.

**1:12 The resulting cases.** Put it together, and you get a compact set of test cases. Each row has a reason to exist. Nothing is duplicated, and nothing obvious is missed. Use this whenever an input has a range: ages, prices, name lengths, dates.

## レッスン本文

Equivalence partitioning groups inputs the software should treat alike, so you test one from each group. Boundary value analysis adds the edges of each group, where off-by-one bugs hide.

## Step by step

1. Find the rule: *quantity must be from 1 to 10*.
2. List the partitions: below 1 (invalid), 1–10 (valid), above 10 (invalid).
3. Pick one representative from each: 0, 5, 15.
4. Add each boundary and its neighbor outside: 0 & 1, 10 & 11.
5. Remove duplicates. You end with six cases.

## Don't forget the other partitions

Numbers are not the only invalid input. A quantity box can receive `-1`, `2.5`, `"three"`, or nothing at all. Each is its own partition with its own expected message. Lesson 2.2 covers these.

```js
// The bug from the video
function isValidQuantity(qty) {
  return qty >= 1 && qty < 10;   // 10 is rejected
}
// Fixed
  return qty >= 1 && qty <= 10;
```

## Try it

A Larkspur gift card can be loaded with $5 to $500, in whole dollars. List the partitions and boundary values, then write the expected result for each.

## Quiz

1. A field accepts ages 18 to 65. Which set covers all the boundaries?
   a. 18, 65
   b. 17, 18, 65, 66
   c. 0, 40, 100
   d. 18, 30, 45, 65
   Answer: b. Each edge plus its neighbor just outside: 17 and 18 at the bottom, 65 and 66 at the top.
2. Why test only one value from the middle of a partition?
   a. The software should treat every value in it the same way
   b. Middle values never have bugs
   c. It saves typing
   d. Testing tools allow one value per partition
   Answer: a. That's what makes it an equivalence partition. If 5 works, 6 is very unlikely to behave differently.
3. The code says qty < 10 but the rule is 1 to 10. Which test catches it?
   a. Quantity 5
   b. Quantity 0
   c. Quantity 10
   d. Quantity 15
   Answer: c. Only the exact maximum hits the wrong comparison. 5, 0 and 15 give the same answer either way.

## 要点

- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

---

前へ: [レッスン 1.2: 良いテストケース、弱いテストケース](/demo/ja/test-cases/foundations/good-cases.md)
次へ: [レッスン 2.2: 正常系の先へ](/demo/ja/test-cases/design/negative.md)
