# 第 3.1 课: 从测试用例到自动化测试

编写测试用例 · 第 3 章: 自动化与规模化 · 15 分钟

> 用 Arrange、Act、Assert 把写好的测试用例变成代码，看边界值测试抓住一个真实的缺陷。

**学完本课你将能够:**
- 把书面测试用例对应到 Arrange、Act、Assert
- 用测试运行器编写单元测试
- 先看到测试失败，再相信它的通过

## 文字稿: 从测试用例到自动化测试 (1:22)

**0:00 引言.** 手工测试用例是很好的起点。当某项检查需要经常执行时，就把它自动化。我们来把一个测试用例变成代码。

**0:11 被测代码.** 这是优惠码 SAVE10 背后的函数。 它接收订单总额和优惠码，返回新的总额。打九折，但只适用于满二十美元的订单。

**0:22 Arrange、Act、Assert.** 自动化测试就是用代码写成的测试用例。 测试用例的标题变成测试名。 Arrange 负责准备前置条件和测试数据。 Act 执行被测的那一个步骤。 Assert 就是预期结果。我们期望总额是三十六。

**0:42 先红后绿.** 我们把等价类那节课里的边界值用例加进来。恰好二十美元的订单应该享受折扣。 运行测试。 红了。我们期望十八，实际得到二十。函数用的是小于等于。 把它改成小于，再运行一次。 绿了。每一个通过的测试，都是一个会在每次改动时自动执行、只需几毫秒的测试用例。

**1:11 小结.** 总结一下：测试名就是标题，Arrange 是准备，Act 是操作步骤，Assert 是预期结果。 先看到测试失败，再相信它的通过。先红，后绿。

## 课文

自动化测试就是由计算机替你执行的测试用例。两者的对应关系很直接：标题对应测试名，前置条件和测试数据对应 *Arrange*，测试步骤对应 *Act*，预期结果对应 *Assert*。

## 对应关系

| 测试用例字段 | 在代码中 |
| --- | --- |
| 标题 | `test("SAVE10 takes 10% off a $40 order", …)` |
| 前置条件、测试数据 | Arrange：`const total = 40;` |
| 测试步骤 | Act：`applyDiscount(total, "SAVE10")` |
| 预期结果 | Assert：`expect(result).toBe(36)` |
| 状态 | 测试运行器给出的 ✓ 或 ✗ |

## 亲自运行

```text
npm install --save-dev vitest
npx vitest run
```

```js
// discount.test.js
import { test, expect } from "vitest";
import { applyDiscount } from "./discount.js";

test.each([
  [19.99, 19.99],  // 刚好低于边界
  [20, 18],        // 边界值
  [40, 36],        // 有效等价类
])("SAVE10 on $%s gives $%s", (total, expected) => {
  expect(applyDiscount(total, "SAVE10")).toBe(expected);
});

test("unknown codes leave the total alone", () => {
  expect(applyDiscount(40, "SAVE99")).toBe(40);
});
```

`test.each` 把一张输入表（就像第 2.1 课中的那张）变成每行一个测试。

> **提示.** **先看到红色。** 一个你从没见它失败过的测试，可能什么都没在测。故意把代码改坏一次，确认测试会变红。

## Quiz

1. 自动化测试的哪一部分包含预期结果？
   a. Arrange
   b. Act
   c. Assert
   d. import 语句
   Answer: c. expect(...).toBe(...) 就是预期结果，由程序自动检查。
2. 为什么要先看到新测试失败，再让它通过？
   a. 测试运行器要求这样做
   b. 为了证明这个测试能发现缺陷
   c. 失败的测试运行得更快
   d. 为了充实报告
   Answer: b. 如果测试从来没有变红过，它检查的可能并不是你以为的东西。
3. applyDiscount(20, "SAVE10") 返回了 20，但规则是满 $20 就打九折。最可能的缺陷是什么？
   a. 四舍五入
   b. 优惠码检查写错了
   c. 用了 total <= 20 而不是 total < 20
   d. 测试导入了错误的文件
   Answer: c. 当 total <= 20 时提前返回，恰好 $20 的订单就拿不到折扣。边界值测试暴露了这个问题。

## 要点

- 测试名就是标题，Arrange 是准备，Act 是操作步骤，Assert 是预期结果。
- 边界值测试能在几毫秒内让差一错误变红。
- 先看到测试失败一次，再相信它的通过。

---

上一页: [第 2.3 课: Exploratory testing](/demo/zh/test-cases/design/exploratory.md)
下一页: [第 3.2 课: 组织测试套件](/demo/zh/test-cases/automation/suites.md)
