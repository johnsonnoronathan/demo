# 性能测试

> 在用户发现之前，找出让软件变慢的原因。

学习从两个方向测试 Web 应用的性能。静态测试不运行任何东西，只检查代码、查询和资源；动态测试运行系统、向它发送流量，并测量用户的实际感受。你会在 Larkspur Books 上练习这两种方法，这是一个故意做得很慢的小型网上书店。

总时长: 6 小时 50 分钟

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## 第 1 章: 概述

性能测试测量什么、两类测试方法，以及练习用的应用。

- [第 1 章 · 开篇: 概述](/demo/zh/performance-testing/overview.md) (5 分钟). 这门课程讲什么、如何组织，以及如何使用课堂和其中的智能体提示词。
- [第 1.1 课: 性能测试测量什么](/demo/zh/performance-testing/overview/what-it-measures.md) (20 分钟). 延迟、吞吐量和错误：每次性能测试都会报告的三个数字，以及为什么延迟要用百分位数来表示。
- [第 1.2 课: 静态测试与动态测试](/demo/zh/performance-testing/overview/static-and-dynamic.md) (20 分钟). 性能测试的两大类、各自能发现和不能发现什么，以及测试前如何规划要回答的问题。
- [第 1 章 · 小结: 概述：小结](/demo/zh/performance-testing/overview/summary.md) (5 分钟). 后续课程会用到的术语和计划。

## 第 2 章: 静态测试

不运行系统，通过检查你构建的东西来发现性能问题。

- [第 2 章 · 开篇: 静态测试](/demo/zh/performance-testing/static.md) (5 分钟). 在运行任何东西之前，通过阅读你构建的东西来发现性能问题。
- [第 2.1 课: 性能预算](/demo/zh/performance-testing/static/budgets.md) (20 分钟). 在测量之前先约定上限，再让检查在每次改动时强制执行。
- [第 2.2 课: 代码审查：N+1 查询](/demo/zh/performance-testing/static/n-plus-one.md) (25 分钟). 使用数据库的代码中最常见的性能缺陷：如何通过阅读发现它，以及如何消除它。
- [第 2.3 课: 阅读查询计划](/demo/zh/performance-testing/static/query-plans.md) (25 分钟). 不执行查询，直接问数据库它会怎样执行；再用合适的索引修复全表扫描。
- [第 2.4 课: 资源体积](/demo/zh/performance-testing/static/asset-weight.md) (20 分钟). 通过称量文件找出页面为什么重，并在不改变用户所见的前提下把它压进预算。
- [第 2 章 · 小结: 静态测试：小结](/demo/zh/performance-testing/static/summary.md) (5 分钟). 不运行应用就发现了什么，以及静态检查无法告诉你的事。

## 第 3 章: 动态测试

运行系统、发送流量，测量用户的实际感受。

- [第 3 章 · 开篇: 动态测试](/demo/zh/performance-testing/dynamic.md) (5 分钟). 运行系统、发送流量，测量用户真正感受到的东西。
- [第 3.1 课: 用 Lighthouse 做实验室测量](/demo/zh/performance-testing/dynamic/lighthouse.md) (25 分钟). 在模拟手机上加载页面，测量用户在什么时候看到什么。
- [第 3.2 课: 用 k6 做负载测试](/demo/zh/performance-testing/dynamic/load-testing.md) (30 分钟). 模拟一个购物高峰的夜晚，让阈值判断应用是否满足预算。
- [第 3.3 课: 压力、峰值与浸泡测试](/demo/zh/performance-testing/dynamic/stress-spike-soak.md) (30 分钟). 超出预期负载去找到上限，扛住突发流量，并发现持续数小时的缓慢退化。
- [第 3.4 课: 找到瓶颈](/demo/zh/performance-testing/dynamic/bottlenecks.md) (30 分钟). 在负载下分析应用、阅读火焰图、修复热点路径，并用同一个测试证明效果。
- [第 3 章 · 小结: 动态测试：小结](/demo/zh/performance-testing/dynamic/summary.md) (5 分钟). 运行应用之后才知道、仅靠阅读无法发现的事。

## 第 4 章: 总结

把两者结合成一套工作流程，报告结果，进行验收，应用到你自己的项目，并回顾整门课程。

- [第 4 章 · 开篇: 总结](/demo/zh/performance-testing/review.md) (5 分钟). 把静态和动态测试结合成日常流程，报告结果，进行验收，把它应用到你自己的项目上，并回顾整门课程。
- [第 4.1 课: 性能测试工作流程](/demo/zh/performance-testing/review/workflow.md) (25 分钟). 决定什么在哪里运行：每个拉取请求的静态检查、发布前的动态测试，以及生产环境监控。
- [第 4.2 课: 报告结果](/demo/zh/performance-testing/review/reporting.md) (20 分钟). 把性能结果写清楚，让人能据此做决定，也让别人能重复这个测试。
- [第 4.3 课: 性能验收](/demo/zh/performance-testing/review/acceptance.md) (30 分钟). 把预算变成验收标准，用一条命令运行验收测试，并做出一个有人签字确认的放行/不放行决定。
- [第 4.4 课: 在你自己的项目上做静态测试](/demo/zh/performance-testing/review/your-project.md) (45 分钟). 亲自在真实的代码库上运行课程中的静态检查，读懂数字，设定最初的预算，并把修复交给智能体。
- [第 4 章 · 小结: 课程总结](/demo/zh/performance-testing/review/summary.md) (10 分钟). 课程涵盖的全部内容汇总在一处，以及接下来可以学什么。
