import type { ContentTranslation } from "./index";
import { P50, P95, P99, AVG } from "../../scenes/overview";

const zh: ContentTranslation = {
  courses: {
    "performance-testing": {
      title: "性能测试",
      tagline: "在用户发现之前，找出让软件变慢的原因。",
      summary: "学习从两个方向测试 Web 应用的性能。静态测试不运行任何东西，只检查代码、查询和资源；动态测试运行系统、向它发送流量，并测量用户的实际感受。你会在 Larkspur Books 上练习这两种方法，这是一个故意做得很慢的小型网上书店。",
      audience: "能读懂 JavaScript 和 SQL、会使用终端的开发者和测试人员。不需要性能测试经验。",
      prerequisites: ["Node.js 22.13 或更高版本", "终端和代码编辑器", "Chrome，用于 Lighthouse 和 CPU 分析器", "第 3 章需要 k6（课程也自带一个内置的负载工具）"],
      outcomes: [
        "把“应该很快”变成可测量的预算和阈值",
        "通过阅读代码、查询计划和构建产物，发现 N+1 查询、缺失的索引和过重的资源",
        "用 Lighthouse 在实验室环境中测量页面加载，并解读 Core Web Vitals",
        "用 k6 编写并运行负载、压力、峰值和浸泡测试",
        "在火焰图中定位 CPU 瓶颈，并证明修复有效",
        "把静态和动态检查放进 CI，并报告可据以行动的结果",
        "按事先约定的标准运行验收测试，并记录放行/不放行的决定",
        "在你自己的项目上做静态检查，由智能体实现修复",
      ],
      practiceSummary: "一个用 Node.js 22 写的书店：一个店面页面和三个基于 SQLite 的 JSON 接口。零依赖，故意做得很慢。",
      chapters: {
        overview: { title: "概述", summary: "性能测试测量什么、两类测试方法，以及练习用的应用。" },
        static: { title: "静态测试", summary: "不运行系统，通过检查你构建的东西来发现性能问题。" },
        dynamic: { title: "动态测试", summary: "运行系统、发送流量，测量用户的实际感受。" },
        review: { title: "总结", summary: "把两者结合成一套工作流程，报告结果，进行验收，应用到你自己的项目，并回顾整门课程。" },
      },
    },
    "test-cases": {
      title: "编写测试用例",
      tagline: "写出任何人都能执行、并且能发现缺陷的测试用例。",
      summary: "用六节短课学习测试的基础：什么是测试用例、怎样的测试用例才可靠，用等价类划分和边界值选择输入，覆盖异常路径，把写好的用例变成自动化测试，并让不断增长的测试套件保持健康。",
      audience: "所有测试软件或想学习测试的人：开发者、测试人员、产品人员。不需要测试经验；第 3.1 课会读一点 JavaScript。",
      prerequisites: ["对软件如何出错的好奇心", "Node.js，仅当你想亲自运行第 3.1 课的测试时需要"],
      outcomes: [
        "阅读、编写并手工执行测试用例",
        "把含糊的测试用例改写得具体、可重复",
        "用等价类划分和边界值选择测试输入",
        "覆盖反向用例，并用判定表找出遗漏",
        "用 Arrange、Act、Assert 把测试用例变成自动化测试",
        "用测试金字塔和追溯矩阵组织测试套件",
      ],
      chapters: {
        foundations: { title: "基础", summary: "什么是测试用例，好用例和弱用例的区别在哪里。" },
        design: { title: "设计测试用例", summary: "用等价类、边界值和判定表决定要写哪些用例。" },
        automation: { title: "自动化与规模化", summary: "把用例变成代码，再组织成大家信任的测试套件。" },
      },
    },
  },
  pages: {
    "performance-testing/overview/opening": { title: "概述", description: "这门课程讲什么、如何组织，以及如何使用课堂和其中的智能体提示词。" },
    "performance-testing/overview/what-it-measures": { title: "性能测试测量什么", description: "延迟、吞吐量和错误：每次性能测试都会报告的三个数字，以及为什么延迟要用百分位数来表示。" },
    "performance-testing/overview/static-and-dynamic": { title: "静态测试与动态测试", description: "性能测试的两大类、各自能发现和不能发现什么，以及测试前如何规划要回答的问题。" },
    "performance-testing/overview/summary": { title: "概述：小结", description: "后续课程会用到的术语和计划。" },
    "performance-testing/static/opening": { title: "静态测试", description: "在运行任何东西之前，通过阅读你构建的东西来发现性能问题。" },
    "performance-testing/static/budgets": { title: "性能预算", description: "在测量之前先约定上限，再让检查在每次改动时强制执行。" },
    "performance-testing/static/n-plus-one": { title: "代码审查：N+1 查询", description: "使用数据库的代码中最常见的性能缺陷：如何通过阅读发现它，以及如何消除它。" },
    "performance-testing/static/query-plans": { title: "阅读查询计划", description: "不执行查询，直接问数据库它会怎样执行；再用合适的索引修复全表扫描。" },
    "performance-testing/static/asset-weight": { title: "资源体积", description: "通过称量文件找出页面为什么重，并在不改变用户所见的前提下把它压进预算。" },
    "performance-testing/static/summary": { title: "静态测试：小结", description: "不运行应用就发现了什么，以及静态检查无法告诉你的事。" },
    "performance-testing/dynamic/opening": { title: "动态测试", description: "运行系统、发送流量，测量用户真正感受到的东西。" },
    "performance-testing/dynamic/lighthouse": { title: "用 Lighthouse 做实验室测量", description: "在模拟手机上加载页面，测量用户在什么时候看到什么。" },
    "performance-testing/dynamic/load-testing": { title: "用 k6 做负载测试", description: "模拟一个购物高峰的夜晚，让阈值判断应用是否满足预算。" },
    "performance-testing/dynamic/stress-spike-soak": { title: "压力、峰值与浸泡测试", description: "超出预期负载去找到上限，扛住突发流量，并发现持续数小时的缓慢退化。" },
    "performance-testing/dynamic/bottlenecks": { title: "找到瓶颈", description: "在负载下分析应用、阅读火焰图、修复热点路径，并用同一个测试证明效果。" },
    "performance-testing/dynamic/summary": { title: "动态测试：小结", description: "运行应用之后才知道、仅靠阅读无法发现的事。" },
    "performance-testing/review/opening": { title: "总结", description: "把静态和动态测试结合成日常流程，报告结果，进行验收，应用到你自己的项目，并回顾整门课程。" },
    "performance-testing/review/workflow": { title: "性能测试工作流程", description: "决定什么在哪里运行：每个拉取请求的静态检查、发布前的动态测试，以及生产环境监控。" },
    "performance-testing/review/reporting": { title: "报告结果", description: "把性能结果写清楚，让人能据此做决定，也让别人能重复这个测试。" },
    "performance-testing/review/acceptance": { title: "性能验收", description: "把预算变成验收标准，用一条命令运行验收测试，并做出有人签字的放行/不放行决定。" },
    "performance-testing/review/your-project": { title: "在你自己的项目上做静态测试", description: "亲自在真实代码库上运行课程中的静态检查，读懂数字，设定第一批预算，再把修复交给智能体。" },
    "performance-testing/review/summary": { title: "课程总结", description: "课程涵盖的全部内容汇总在一处，以及接下来可以学什么。" },
    "test-cases/foundations/anatomy": { title: "什么是测试用例？", description: "逐个字段构建一个测试用例，再对着真实的登录页面手工执行它。" },
    "test-cases/foundations/good-cases": { title: "好的测试用例与弱的测试用例", description: "让测试用例值得信赖的五个习惯，以及许多团队采用的 Given、When、Then 写法。" },
    "test-cases/design/partitions": { title: "等价类与边界值", description: "等价类划分和边界值分析：用几个精心挑选的输入代替成千上万个。" },
    "test-cases/design/negative": { title: "超越正常路径", description: "反向用例、极端用例，以及用于组合规则的判定表。" },
    "test-cases/automation/unit-tests": { title: "从测试用例到自动化测试", description: "用 Arrange、Act、Assert 把写好的测试用例变成代码，看边界值测试抓住一个真实的缺陷。" },
    "test-cases/automation/suites": { title: "组织测试套件", description: "测试金字塔、需求追溯，以及如何让不断增长的测试套件保持健康。" },
  },
  scenes: {
    percentiles: {
      title: "延迟是一个分布",
      steps: [
        "每个请求花费的时间都不一样。这里是发往同一个接口的 400 个请求。",
        "按耗时堆叠起来，它们形成一个隆起，右侧拖着长长的尾巴。",
        `中位数 p50 代表典型请求：${P50} 毫秒。一半更快，一半更慢。`,
        `p95 和 p99 描述尾部：${P95} 毫秒和 ${P99} 毫秒。每二十个用户中就有一个至少要等 ${P95} 毫秒。`,
        `平均值 ${AVG} 毫秒不对应任何真实请求，还掩盖了尾部。预算和阈值都使用百分位数。`,
      ],
    },
    "static-vs-dynamic": {
      title: "测试性能的两种方式",
      steps: [
        "静态测试阅读你构建的东西：代码、查询、资源和预算。",
        "什么都不用运行，所以只需几秒，适合放进每个拉取请求。它发现的是可能的问题。",
        "动态测试运行系统并向它发送流量。",
        "它测量用户真正感受到的东西：响应时间、吞吐量和错误。",
      ],
    },
    budgets: {
      title: "预算把“够快”变成通过或失败",
      steps: [
        "预算是团队在测量之前约定的上限：脚本 50 KB、图片 250 KB、总计 350 KB。",
        "然后用当前构建对照每一项上限进行测量。",
        "超过上限的项就失败。Larkspur 在脚本、图片和总体积上都超了。",
        "预算失败是一个清晰的信号。它可以直接拦下拉取请求，而不是引发一场争论。",
      ],
    },
    "n-plus-one": {
      title: "N+1 查询模式",
      steps: [
        "图书接口向数据库请求一页 50 本书。一次查询。",
        "然后它遍历这些书，为每本书查询作者和评分：每本书再多两次查询。",
        "一页就要往返 101 次。每次都很小，加起来却占了大部分响应时间。",
        "一条带 JOIN 的查询只需一次往返就能取回同样的数据。",
      ],
    },
    "query-plan": {
      title: "SCAN 与 SEARCH",
      steps: [
        "没有索引时，要找出一位顾客的订单，SQLite 必须读取 orders 表的每一行：共 200,000 行。",
        "这就是查询计划里 SCAN orders 的含义。表越大，它就越慢。",
        "索引让邮箱保持有序，就像书后的索引。SQLite 只需向下走几层就能找到对应条目。",
        "SEARCH orders USING INDEX：只读几页，而不是 200,000 行，而且几乎不随表增长而变慢。",
      ],
    },
    "asset-treemap": {
      title: "页面体积都去哪了",
      steps: [
        "店面加载的每个文件，按大小等比例绘制。总计 1,140 KB，而预算是 350 KB。",
        "两个文件几乎占了全部：一张以 2400 像素、质量 97 保存的首图，以及一个打包了 420 种语言区域的日期库，而商店只用一种。",
        "换成 1200 像素的导出图和只含英语的区域文件。",
        "从 1,140 KB 降到 59 KB。顾客看到的页面完全一样。",
      ],
    },
    filmstrip: {
      title: "观察页面加载",
      steps: [
        "Lighthouse 在一台模拟的中端手机上、通过慢速网络加载页面，并把过程录下来。",
        "首次内容绘制（FCP）在 4.3 秒：第一段文字出现。在此之前屏幕一片空白，因为一个 600 KB 的脚本阻塞了渲染。",
        "最大内容绘制（LCP）在 9.8 秒：1 MB 的首图终于显示出来。性能得分：64。",
        "修复资源之后，FCP 为 0.8 秒，LCP 为 1.5 秒。得分：100。",
      ],
    },
    "virtual-users": {
      title: "k6 负载测试如何工作",
      steps: [
        "k6 启动虚拟用户。每个用户循环运行你的脚本：浏览、思考、查看订单、思考、打开一本书。",
        "阶段控制同时运行的用户数：30 秒内从 0 增加到 50 个用户，保持一分钟，再逐步减少。",
        "k6 为每个请求计时，并按接口报告百分位数。随着用户增多，图书接口的 p95 不断攀升。",
        "阈值把数字变成通过或失败。图书接口的 p95 是 1.17 秒，上限是 300 毫秒，所以这次运行失败。",
      ],
    },
    "load-shapes": {
      title: "四种负载形态",
      steps: [
        "负载测试：繁忙日子里预期的流量。问题：我们满足预算吗？",
        "压力测试：分阶段不断增加用户。问题：它在哪里崩溃，怎么崩溃？",
        "峰值测试：突然的流量激增，比如刚发出一封邮件通讯。问题：我们能扛住并恢复吗？",
        "浸泡测试：持续数小时的普通负载。问题：随着时间推移，有没有东西泄漏或漂移？",
      ],
    },
    "capacity-knee": {
      title: "找到容量",
      steps: [
        "分阶段增加用户，记录每一阶段的吞吐量和 p95。这些是推荐接口的真实测量结果。",
        "从第一个用户起，吞吐量就稳定在每秒约 58 个请求。这就是上限：更多用户也无法让它更快。",
        "所以多出来的用户只能排队。p95 从 1 个用户时的 25 毫秒涨到 16 个用户时的 532 毫秒。",
        "拐点，即 p95 越过 400 毫秒预算的地方，就是实际容量：在 8 到 16 个用户之间。规划时要远低于它。",
      ],
    },
    flamegraph: {
      title: "阅读火焰图",
      steps: [
        "应用承受负载时，CPU 分析器每秒对调用栈采样大约一千次。",
        "火焰图把这些样本合并起来。宽度是时间占比；每往上一层，就是被下一层调用的函数。",
        "recommend 占了 67% 的样本。在它内部，similarity 和 normalise 在每次请求中都重新解析每本书的标签。",
        "只解析一次标签并保存下来：热点帧缩小了，10 个用户时的吞吐量从每秒 57 个请求提升到 699 个。",
      ],
    },
    pipeline: {
      title: "交付流水线中的性能检查",
      steps: [
        "每个拉取请求先运行静态检查：资源预算、查询检查和查询计划。只需几秒。",
        "然后构建、部署到预发布环境，并运行动态检查：Lighthouse 和一次简短的 k6 负载测试。",
        "阈值失败会阻止发布，失败信息里带着解释原因的数字。",
        "修复后，改动上线。生产监控观察同样的指标，并为下一轮预算提供依据。",
      ],
    },
    "before-after": {
      title: "课程带来了什么变化",
      steps: [
        "之前：Larkspur 的第一批测量结果，每一项都来自一次可以重复的运行。",
        "静态修复之后：一条查询代替 101 条，两个索引，以及更轻的资源。",
        "动态修复之后：图书标签只解析一次，而不是每次请求都解析。",
        "每个结果都注明了产生它的测试。这正是性能报告可信的原因。",
      ],
    },
  },
};

export default zh;
