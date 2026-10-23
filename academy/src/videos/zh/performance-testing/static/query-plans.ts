import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "阅读查询计划",
  scenes: [
    {
      label: "简介",
      cues: ["查询说明你要什么，数据库决定怎样取到它。这个决定就是查询计划，你不用执行查询就能读到它。"],
      panes: [{ type: "title", kicker: "第 2.3 课 · 静态测试", heading: "阅读查询计划", sub: "SCAN 与 SEARCH", subAt: 0.4 }],
    },
    {
      label: "获取查询计划",
      cues: [
        "这是查询某位顾客最近 20 笔订单的执行计划。",
        "两个警告。SCAN orders 表示要读完全部 20 万行。临时 B 树则表示之后还要对匹配结果排序。",
      ],
      panes: [{
        type: "terminal", title: "npm run explain",
        lines: [
          { at: 0.1, text: "$ npm run explain -- \"SELECT … FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 20\"", kind: "cmd" },
          { at: 0.5, text: "QUERY PLAN", kind: "out" },
          { at: 1, text: "└─ SCAN orders   ← full table scan (200,000 rows)", kind: "fail" },
          { at: 1.4, text: "└─ USE TEMP B-TREE FOR ORDER BY", kind: "fail-dim" },
        ],
      }],
    },
    {
      label: "SCAN 与 SEARCH",
      cues: [
        "没有索引时，SQLite 必须读取 orders 表的每一行，才能找到这位顾客的寥寥几笔订单。",
        "这就是 SCAN 的含义，表每增长一天，它就更慢一分。",
        "索引让邮箱保持有序，就像书后的索引。SQLite 只需向下走几层就能找到对应条目。",
        "使用索引的 SEARCH：只读几页，而不是 20 万行。",
      ],
      panes: [{ type: "concept", scene: "query-plan" }],
    },
    {
      label: "添加索引",
      layout: "split",
      cols: "1fr 1.25fr",
      cues: [
        "先为过滤用的列建索引，再加上排序用的列。以迁移的形式添加。",
        "再运行一次 explain。扫描变成了查找，排序步骤也消失了。",
        "在我们的机器上，订单接口从 11 毫秒降到了 0.1 毫秒。",
      ],
      panes: [
        {
          type: "code", file: "db/migrations/001_indexes.sql", lang: "sql", typeTo: 0.8,
          code: `CREATE INDEX idx_orders_email
  ON orders(customer_email, created_at);

CREATE INDEX idx_reviews_book
  ON reviews(book_id);`,
        },
        {
          type: "terminal",
          lines: [
            { at: 0.6, text: "$ npm run migrate", kind: "cmd" },
            { at: 0.9, text: "applied 001_indexes.sql (162 ms)", kind: "pass" },
            { at: 1.1, text: "$ npm run explain -- \"…orders…\"", kind: "cmd" },
            { at: 1.4, text: "└─ SEARCH orders USING INDEX", kind: "pass" },
            { at: 1.5, text: "   idx_orders_email (customer_email=?)", kind: "pass-dim" },
            { at: 2.2, text: "orders: 11 ms → 0.1 ms", kind: "sum-pass" },
          ],
        },
      ],
    },
  ],
});
