import { defineVideo } from "../../../../video/types";

export default defineVideo({
  title: "代码审查：N+1 查询",
  scenes: [
    {
      label: "简介",
      cues: ["这是使用数据库的代码中最常见的性能缺陷，我们来看看怎样只靠阅读就发现它。"],
      panes: [{ type: "title", kicker: "第 2.2 课 · 静态测试", heading: "代码审查：N+1 查询", sub: "藏在循环里的缺陷", subAt: 0.4 }],
    },
    {
      label: "阅读代码",
      cues: [
        "这是图书接口。它用一次查询取回一页 50 本书。",
        "然后遍历这些书。在循环里，它向数据库查询每本书的作者，",
        "还有每本书的评分。页面上的每本书都要多两次查询。",
      ],
      panes: [{
        type: "code", file: "src/routes/books.mjs", lang: "js", typeTo: 0.9,
        code: `export function listBooks(params) {
  const books = query(
    "SELECT id, title, author_id FROM books LIMIT 50"
  ).all();

  for (const book of books) {
    book.author = query("SELECT name FROM authors WHERE id = ?")
      .get(book.author_id).name;
    book.rating = query("SELECT avg(stars) FROM reviews WHERE book_id = ?")
      .get(book.id);
  }
  return books;
}`,
        highlights: [
          { at: 1, until: 2, lines: [6, 7, 8], note: "循环中的查询" },
          { at: 2, until: 3, lines: [9, 10], note: "× 50 本书", bad: true },
        ],
      }],
    },
    {
      label: "放到时间线上",
      cues: [
        "放到时间线上是这样的。一次查询取列表，",
        "然后是一百次小查询，一个接一个。",
        "一页就要往返 101 次。每次都很快，加起来却占了大部分响应时间。",
        "一条带 JOIN 的查询只需一次往返，就能取回完全相同的数据。",
      ],
      panes: [{ type: "concept", scene: "n-plus-one" }],
    },
    {
      label: "发现并修复",
      cues: [
        "这种模式很容易静态发现：循环中的数据库调用。练习应用自带一个小 linter，专门找它。",
        "在练习中，你会把循环改写成一次查询，看着查询次数从 101 降到 1，而响应完全相同。",
      ],
      panes: [{
        type: "terminal",
        lines: [
          { at: 0.1, text: "$ npm run lint:queries", kind: "cmd" },
          { at: 0.3, text: "src/routes/books.mjs:11  query inside a loop (possible N+1)", kind: "fail" },
          { at: 0.4, text: "src/routes/books.mjs:13  query inside a loop (possible N+1)", kind: "fail" },
          { at: 0.6, text: "2 possible N+1 pattern(s).", kind: "sum-fail" },
          { at: 1.1, text: "$ curl -s -i localhost:3000/api/books | grep x-query-count", kind: "cmd" },
          { at: 1.4, text: "x-query-count: 1", kind: "pass" },
          { at: 1.6, text: "$ npm run lint:queries", kind: "cmd" },
          { at: 1.8, text: "No queries inside loops found.", kind: "sum-pass" },
        ],
      }],
    },
  ],
});
