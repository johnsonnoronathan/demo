# 第 2.4 课: 资源体积

性能测试 · 第 2 章: 静态测试 · 20 分钟

> 通过称量文件找出页面为什么重，并在不改变用户所见的前提下把它压进预算。

**学完本课你将能够:**
- 找出页面加载的最重的文件，并判断它们是否必要
- 在页面 HTML 中识别阻塞渲染的脚本
- 把页面体积降到预算以下，并用预算检查证明

## 文字稿: 资源体积 (1:01)

**0:00 简介.** 预算检查说店面超标了。现在来弄清楚，到底是什么让它这么重。

**0:07 体积都去哪了.** 这是店面加载的每个文件，按大小等比例绘制。总共 1,140 KB，而预算是 350 KB。 两个文件几乎占了全部：一张按相机原尺寸保存的首图，以及一个打包了 420 种语言区域的日期库，而商店只用一种。 换成 1200 像素导出的图片，以及只含英语的库文件。 从 1,140 KB 降到 59 KB。顾客看到的页面完全一样。

**0:33 阻塞渲染的脚本.** HTML 里还有第二个问题。head 中的普通 script 标签会让页面停止渲染，直到脚本下载并执行完毕。 加上 defer，并换用只含英语的文件。浏览器会先渲染，之后再按顺序执行脚本。 然后把图片指向更小的导出文件，并加上宽和高。

**0:54 再检查一次.** 再次运行预算检查。59 KB，所有预算都达标，而顾客看到的没有任何变化。

## 课文

第 2.1 课的预算检查发现，店面的体积是 1,140 KB，而预算只有 350 KB。预算失败告诉你**有**东西太大了；称量文件则告诉你**是什么**。

> **概念动画: 页面体积都去哪了**
>
> 1. 店面加载的每个文件，按大小等比例绘制。总计 1,140 KB，而预算是 350 KB。
> 2. 两个文件几乎占了全部：一张以 2400 像素、质量 97 保存的首图，以及一个打包了 420 种语言区域的日期库，而商店只用一种。
> 3. 换成 1200 像素的导出图和只含英语的区域文件。
> 4. 从 1,140 KB 降到 59 KB。顾客看到的页面完全一样。

## 对每个重文件问两个问题

**全部内容都需要吗？** `datefmt-all-locales.js` 能用 420 种语言区域格式化日期，而页面只调用它一次，用的是 `en-US`。同一个库还提供单一区域的构建 `datefmt-en.js`，只有 1.5 KB，而不是 600 KB。这是 Web 上最常见的体积问题：为了一个用途，打包了整个库，或者所有语言区域、图标、polyfill。

**尺寸合适吗？** `hero.jpg` 是 2400 × 1200 像素、JPEG 质量 97，直接从相机或设计工具导出。页面最多只以 1200 像素宽显示它。按显示尺寸、质量 72 导出的 `hero-1200.jpg` 只有 58 KB，而不是 1 MB，在屏幕上看起来毫无差别。

## 阻塞渲染的脚本

体积并不是 HTML 中唯一的静态警告。看看 head 部分：

```html
<script src="/vendor/datefmt-all-locales.js"></script>
<script src="/app.js"></script>
```

`<head>` 中的普通 `<script>` 标签会让浏览器在脚本下载并执行完之前什么都不渲染。在手机网络上加载一个 600 KB 的脚本，就意味着几秒钟的白屏。第 3 章会精确测量是几秒。

加上 `defer`，浏览器就会并行下载脚本、先渲染页面，再按顺序执行它们。`app.js` 本来就会等待 `DOMContentLoaded`，所以不需要改动别的地方。

```html
<script src="/vendor/datefmt-en.js" defer></script>
<script src="/app.js" defer></script>
```

> **为图片设置宽和高.** 为图片加上 `width` 和 `height` 属性。这样浏览器在图片到达之前就能预留空间，下方的文字不会跳动（这种跳动以 Cumulative Layout Shift 来衡量）。在主图上设置 `fetchpriority="high"`，告诉浏览器尽早获取它。

## 动手练习：让店面回到预算之内

**动手练习 · 15 分钟.** 目标： 修复 public/index.html 中最重的两个资源和阻塞渲染的脚本，直到 npm run budget 通过，且页面显示的内容不变。

1. 编辑 `public/index.html`。不要动 `public/before.html`，它是一份冻结的副本，第 3 章要用来对比。

   ```diff
   - <script src="/vendor/datefmt-all-locales.js"></script>
   - <script src="/app.js"></script>
   + <script src="/vendor/datefmt-en.js" defer></script>
   + <script src="/app.js" defer></script>
   ...
   - <img src="/hero.jpg" alt="Shelves of books in warm light">
   + <img src="/hero-1200.jpg" width="1200" height="600" fetchpriority="high" alt="Shelves of books in warm light">
   ```

2. 再次运行预算检查。

   ```text
   budget      actual   limit   result
   script         0.9      50   pass
   stylesheet     0.5      20   pass
   image         57.6     250   pass
   total         59.0     350   pass

   All budgets met.
   ```

![终端显示修复后的预算表：脚本 0.9 KB、样式表 0.5 KB、图片 57.6 KB、总计 59.0 KB，全部标记为 pass，下方是 'All budgets met.'。](screenshot-pending)
*Screenshot (npm run budget): 从 1,140 KB 降到 59 KB。*

3. 打开店面，确认顾客看到的内容没有变化：照片、“Updated”日期行和图书网格都应该还在。

![修复后的 Larkspur 店面，看起来和之前一样：带标题的书架照片、显示今天日期的“Updated”行，以及新书网格。](screenshot-pending)
*Screenshot (localhost:3000): 同样的页面，体积只有原来的二十分之一。*

**完成标准**
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

**智能体的部分：把实现交给它**

```text
You are doing a hands-on exercise from the "Performance Testing" course: Lesson 2.4, "Asset weight".

Exercise: Bring the storefront under budget
Goal: Fix the two heaviest assets and the render-blocking scripts in public/index.html until npm run budget passes, without changing what the page shows.

Project: academy/practice/larkspur (A Node.js 22 bookshop with a storefront and three JSON endpoints over SQLite. No dependencies. Slow on purpose.)
Setup, if not done already:
  cd academy/practice/larkspur
  npm run seed
  npm start   # leave it running in its own terminal; http://localhost:3000

Steps:
1. Run `npm run budget` and note the failing budgets.
2. In `public/index.html` only (leave `public/before.html` untouched), replace `/vendor/datefmt-all-locales.js` with `/vendor/datefmt-en.js`; the page only formats dates in en-US.
3. Add `defer` to both script tags so they no longer block rendering. `app.js` already waits for DOMContentLoaded, and deferred scripts run in order.
4. Replace `/hero.jpg` with `/hero-1200.jpg` and add `width="1200" height="600"` and `fetchpriority="high"` to the img tag.
5. Run `npm run budget` again.
6. Start the app and load http://localhost:3000/ in a browser or with Playwright if available, and confirm the 'Updated <date>' line and the book grid still render. If no browser is available, say so.

Done when:
- `npm run budget` passes all budgets and exits 0
- public/before.html is unchanged
- The page still shows the updated date and the book grid

Report back:
- The budget output before and after
- The diff of public/index.html
- How you confirmed the page still renders correctly

Ground rules:
- Work inside academy/practice/larkspur. Don't add dependencies unless a step asks for one.
- Base every number you report on command output you actually ran. Quote it; don't estimate.
- If a step fails or a tool is missing, stop and report the exact error instead of working around it.

Lesson text, if you need more context: academy/src/content/lessons/en/performance-testing/2-static/4-asset-weight.mdx
```

## 要点

- 称量页面实际加载的东西。通常少数几个文件就占了大部分体积。
- 对每个重文件问两个问题：全部内容都需要吗？现在就需要吗？库打包的内容往往远超你实际用到的。
- <head> 中的普通 <script> 会阻塞渲染，直到它下载并执行完毕。使用 defer，或者把它移走。
- 按显示尺寸提供图片，合理压缩，并为它们设置 width 和 height。

---

上一页: [第 2.3 课: 阅读查询计划](/demo/zh/performance-testing/static/query-plans.md)
下一页: [第 2 章 · 小结: 静态测试：小结](/demo/zh/performance-testing/static/summary.md)
