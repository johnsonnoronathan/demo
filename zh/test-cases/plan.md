# 教案: 编写测试用例

用几节短课学习测试的基础：什么是测试用例、怎样的测试用例才可靠，用等价类划分和边界值选择输入，覆盖异常路径，把写好的用例变成自动化测试，并让不断增长的测试套件保持健康。

- 总时长: 1 小时 45 分钟
- 视频: 7 (12:57)
- 所有测试软件或想学习测试的人：开发者、测试人员、产品人员。不需要测试经验；第 3.1 课会读一点 JavaScript。

## 课程目标

- 阅读、编写并手工执行测试用例
- 把含糊的测试用例改写得具体、可重复
- 用等价类划分和边界值选择测试输入
- 覆盖反向用例，并用判定表找出遗漏
- 用 Arrange、Act、Assert 把测试用例变成自动化测试
- 用测试金字塔和追溯矩阵组织测试套件

## 开始之前

- 对软件如何出错的好奇心
- Node.js，仅当你想亲自运行第 3.1 课的测试时需要

## 结构

1. **基础** (30 min): 什么是测试用例，好用例和弱用例的区别在哪里。
2. **设计测试用例** (45 min): 用等价类、边界值和判定表决定要写哪些用例。
3. **自动化与规模化** (30 min): 把用例变成代码，再组织成大家信任的测试套件。

## 第 1 章: 基础

什么是测试用例，好用例和弱用例的区别在哪里。 (30 分钟)

### 第 1.1 课: 什么是测试用例？ (15 分钟, ▶ 2:55)

逐个字段构建一个测试用例，再对着真实的登录页面手工执行它。

/demo/zh/test-cases/foundations/anatomy.md

学习成果:
- 说出测试用例的各个字段及其用途
- 写出足够精确、任何人都能重复执行的测试用例
- 手工执行测试用例并记录结果

要点:
- 一个测试用例只检查一个行为，并有 ID 和清晰的标题。
- 前置条件、测试数据和测试步骤让它可以重复执行。
- 执行前先确定预期结果，执行后记录实际结果。
- 一个写明了精确实际结果的失败用例，已经是半份缺陷报告。

### 第 1.2 课: 好的测试用例与弱的测试用例 (15 分钟, ▶ 1:53)

让测试用例值得信赖的五个习惯，以及许多团队采用的 Given、When、Then 写法。

/demo/zh/test-cases/foundations/good-cases.md

学习成果:
- 发现测试用例中含糊的措辞并加以改写
- 运用五个习惯：原子性、独立性、可重复、具体、可追溯
- 用 Given、When、Then 的形式编写场景

要点:
- 用真实的值和可观察的结果代替含糊的措辞。
- 让每个用例保持原子性、独立、可重复、具体、可追溯。
- Given 是准备，When 是那一个操作，Then 是预期结果。

## 第 2 章: 设计测试用例

用等价类、边界值和判定表决定要写哪些用例。 (45 分钟)

### 第 2.1 课: 等价类与边界值 (15 分钟, ▶ 1:25)

等价类划分和边界值分析：用几个精心挑选的输入代替成千上万个。

/demo/zh/test-cases/design/partitions.md

学习成果:
- 把一个输入范围划分为若干等价类
- 选出边界值及其相邻值
- 把等价类和边界值转化为一组精简的测试用例

要点:
- 把软件应该同等对待的输入归为一组，每组测一个。
- 缺陷往往聚集在边缘：测试每个边界值，以及紧挨着它的外侧值。
- 差一错误（off-by-one）的比较，只有恰好落在边界上的值才能发现。

### 第 2.2 课: 超越正常路径 (15 分钟, ▶ 1:30)

反向用例、极端用例，以及用于组合规则的判定表。

/demo/zh/test-cases/design/negative.md

学习成果:
- 列出输入出错的常见方式
- 编写带有明确预期提示信息的反向用例
- 构建判定表并发现需求中的遗漏

要点:
- 每条正常路径都有不顺利的“兄弟”：空值、格式错误、极端值、时机不对。
- 反向用例检查软件能否得体地失败，并给出清晰的提示。
- 判定表列出所有条件组合，暴露出没有被定义的情况。

### 第 2.3 课: Exploratory testing (15 分钟, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/zh/test-cases/design/exploratory.md

学习成果:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

要点:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## 第 3 章: 自动化与规模化

把用例变成代码，再组织成大家信任的测试套件。 (30 分钟)

### 第 3.1 课: 从测试用例到自动化测试 (15 分钟, ▶ 1:22)

用 Arrange、Act、Assert 把写好的测试用例变成代码，看边界值测试抓住一个真实的缺陷。

/demo/zh/test-cases/automation/unit-tests.md

学习成果:
- 把书面测试用例对应到 Arrange、Act、Assert
- 用测试运行器编写单元测试
- 先看到测试失败，再相信它的通过

要点:
- 测试名就是标题，Arrange 是准备，Act 是操作步骤，Assert 是预期结果。
- 边界值测试能在几毫秒内让差一错误变红。
- 先看到测试失败一次，再相信它的通过。

### 第 3.2 课: 组织测试套件 (15 分钟, ▶ 1:46)

测试金字塔、需求追溯，以及如何让不断增长的测试套件保持健康。

/demo/zh/test-cases/automation/suites.md

学习成果:
- 用测试金字塔平衡测试套件
- 把测试用例追溯到需求，找出遗漏和孤儿用例
- 让测试套件保持健康：命名、不稳定的测试、责任归属

要点:
- 大量快速的单元测试，较少的集成测试，少数几个端到端测试。
- 追溯矩阵能显示没有测试的需求，以及没有对应需求的测试。
- 按行为给测试命名，并尽快修复不稳定的测试，否则大家会学会无视红色。
