# 第 2.3 课: 阅读查询计划

性能测试 · 第 2 章: 静态测试 · 25 分钟

> 不执行查询，直接问数据库它会怎样执行；再用合适的索引修复全表扫描。

**学完本课你将能够:**
- 用 EXPLAIN QUERY PLAN 从 SQLite 获取查询计划
- 区分 SCAN 和 SEARCH，并判断什么时候扫描是个问题
- 根据查询的 WHERE 和 ORDER BY 设计索引，以迁移的形式添加，并确认计划已改变

## 文字稿: 阅读查询计划 (1:03)

**0:00 简介.** 查询说明你要什么，数据库决定怎样取到它。这个决定就是查询计划，你不用执行查询就能读到它。

**0:10 获取查询计划.** 这是查询某位顾客最近 20 笔订单的执行计划。 两个警告。SCAN orders 表示要读完全部 20 万行。临时 B 树则表示之后还要对匹配结果排序。

**0:22 SCAN 与 SEARCH.** 没有索引时，SQLite 必须读取 orders 表的每一行，才能找到这位顾客的寥寥几笔订单。 这就是 SCAN 的含义，表每增长一天，它就更慢一分。 索引让邮箱保持有序，就像书后的索引。SQLite 只需向下走几层就能找到对应条目。 使用索引的 SEARCH：只读几页，而不是 20 万行。

**0:46 添加索引.** 先为过滤用的列建索引，再加上排序用的列。以迁移的形式添加。 再运行一次 explain。扫描变成了查找，排序步骤也消失了。 在我们的机器上，订单接口从 11 毫秒降到了 0.1 毫秒。

## 课文

查询说明你要**什么**，数据库决定**怎样**取到它：先读哪张表、是否使用索引、是否需要排序。这个决定就是**查询计划**，每个正经的数据库都能在不执行查询的情况下把它展示给你。阅读查询计划就是 SQL 的静态测试。

## SCAN 与 SEARCH

订单接口要取某位顾客最近的 20 笔订单：

```sql
SELECT id, book_id, total_cents, created_at FROM orders
WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20
```

问问 SQLite 它会怎样执行：

```bash
npm run explain -- "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"
```

```text
QUERY PLAN
└─ SCAN orders   ← full table scan (200,000 rows)
└─ USE TEMP B-TREE FOR ORDER BY
```

两行，两个警告。`SCAN orders` 表示 SQLite 要读完全部 200,000 行，才能找到这位顾客的 13 笔订单。`USE TEMP B-TREE FOR ORDER BY` 表示之后还要在一个临时结构里对匹配结果排序。

> **概念动画: SCAN 与 SEARCH**
>
> 1. 没有索引时，要找出一位顾客的订单，SQLite 必须读取 orders 表的每一行：共 200,000 行。
> 2. 这就是查询计划里 SCAN orders 的含义。表越大，它就越慢。
> 3. 索引让邮箱保持有序，就像书后的索引。SQLite 只需向下走几层就能找到对应条目。
> 4. SEARCH orders USING INDEX：只读几页，而不是 200,000 行，而且几乎不随表增长而变慢。

`SCAN` 并不总是坏事。在第 2.2 课的图书查询中，`SCAN books` 位于 `LIMIT 50` 子查询内，读到 50 行就会停下。而扫描一张 30 行的查找表，比用任何索引都快。要问的问题是：**它会读多少行，多久执行一次？** 在请求路径上对大表做全表扫描就是缺陷，表每增长一天，它就更糟一分。

## 设计索引

索引是某几列的有序副本，每条记录都带有指回原行的指针。按以下顺序选择索引列：

1. **用 `=` 过滤的列**：这里是 `customer_email`。
2. **用于排序的列**：这里是 `created_at`。因为索引已经先按邮箱、再按日期排好序，SQLite 可以直接从中读出最新的 20 条，省掉排序。

```sql
CREATE INDEX idx_orders_email ON orders(customer_email, created_at);
```

第 2.2 课中的评论查询也有同样的问题：`WHERE book_id = ?` 而 `book_id` 上没有索引，意味着要扫描 50,000 条评论。改用 JOIN 之后，它每页只执行一次而不是 50 次，但仍然是一次扫描。

```sql
CREATE INDEX idx_reviews_book ON reviews(book_id);
```

> **索引不是免费的.** 每个索引都会让插入和更新稍慢一点，并占用磁盘空间。为频繁执行的查询或大表上的查询添加索引，检查查询计划确实用上了它们，并删除没人用的索引。

## 动手练习：把两次全表扫描变成索引查找

**动手练习 · 20 分钟.** 目标： 找出 /api/orders 和图书页背后的全表扫描，在迁移中添加索引，并确认两个查询计划和耗时都得到改善。

1. 运行智能体提示词中的两条 `explain` 命令并保存输出。两者都应该以 `full table scan` 结尾。
2. 在应用运行时，先测量，再做任何改动：

   ```bash
   for i in 1 2 3 4 5; do curl -s -o /dev/null -D - "http://localhost:3000/api/orders?email=reader42@larkspur.test" | grep -i server-timing; done
   ```

3. 创建迁移。迁移是 `db/migrations/` 中的 SQL 文件，按文件名顺序应用，并会被记录下来，确保只执行一次：

   ```sql title="db/migrations/001_indexes.sql"
   CREATE INDEX idx_orders_email ON orders(customer_email, created_at);
   CREATE INDEX idx_reviews_book ON reviews(book_id);
   ```

   ```bash
   npm run migrate
   # applied 001_indexes.sql (140 ms)
   ```

4. 再次对两个查询运行 explain。

   ```text
   QUERY PLAN
   └─ SEARCH orders USING INDEX idx_orders_email (customer_email=?)
   ```

   排序步骤也消失了：索引本身就按日期顺序给出行。

![上下两个查询计划。第一个是迁移前，显示 'SCAN orders ← full table scan (200,000 rows)' 和 'USE TEMP B-TREE FOR ORDER BY'。第二个是迁移后，显示 'SEARCH orders USING INDEX idx_orders_email (customer_email=?)'。](screenshot-pending)
*Screenshot (npm run explain): 迁移前后：扫描 200,000 行变成了一次索引查找。*

5. 重启应用并再次测量。在我们的机器上：

   | 接口 | 修复前 | 修复后 |
   | --- | --- | --- |
   | `/api/orders` | 11 ms | 0.1 ms |
   | `/api/books`（已用上 2.2 的 JOIN） | 26 ms | 0.5 ms |

**完成标准**
- Neither plan contains 'full table scan'
- Both plans show SEARCH ... USING INDEX
- `npm run migrate` reports the migration applied, and running it again reports nothing to migrate

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.3, "Reading query plans".

Exercise: Turn two full table scans into index searches
Goal: Find the full table scans behind /api/orders and the books page, add indexes in a migration, and confirm both plans and timings improve.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run explain -- "SELECT id, book_id, total_cents, created_at FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20"` and capture the plan.
2. Run `npm run explain -- "SELECT avg(stars) FROM reviews WHERE book_id = ?"` and capture the plan.
3. Create `db/migrations/001_indexes.sql` with `CREATE INDEX idx_orders_email ON orders(customer_email, created_at);` and `CREATE INDEX idx_reviews_book ON reviews(book_id);`.
4. Run `npm run migrate`.
5. Run both explain commands again and capture the new plans.
6. With the app running, compare the `server-timing` header of /api/orders?email=reader42@larkspur.test and /api/books before and after (restart the app after migrating; take the median of five requests each).

Done when:
- Neither plan contains 'full table scan'
- Both plans show SEARCH ... USING INDEX
- `npm run migrate` reports the migration applied, and running it again reports nothing to migrate

Report back:
- Both plans before and after
- server-timing medians before and after for both endpoints

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/3-query-plans.mdx
```

## 要点

- EXPLAIN QUERY PLAN 显示数据库将如何执行查询，而不真正执行它。所以它是一种静态检查。
- SCAN 读取表中的每一行；SEARCH 利用索引直接跳到匹配的行。在热点路径上对大表做 SCAN 就是缺陷。
- 先为过滤用的列建索引，再加上排序用的列，这样数据库连排序也可以省掉。
- 索引加快读取、拖慢写入。只添加查询真正需要的索引，而不是每列一个。

---

上一页: [第 2.2 课: 代码审查：N+1 查询](/demo/zh/performance-testing/static/n-plus-one.md)
下一页: [第 2.4 课: 资源体积](/demo/zh/performance-testing/static/asset-weight.md)
