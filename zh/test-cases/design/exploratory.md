# 第 2.3 课: Exploratory testing

编写测试用例 · 第 2 章: 设计测试用例 · 15 分钟

> Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

*这节课还没有翻译成zh，下面是英文原文。标题和导航已翻译。*

**学完本课你将能够:**
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

## 文字稿: Exploratory testing (2:06)

**0:00 Introduction.** Scripted test cases check what you already expect. Exploratory testing looks for what nobody thought to write down. You design the next test while you run the current one, and each result tells you where to look next.

**0:16 Charters.** Exploring is not clicking around. Each session starts with a charter: one sentence that gives it a mission. The target is the feature you'll explore, as narrow as you can make it. The resources are what you bring: unusual data, a second tab, a slow network. And the information is what you want to learn, such as how errors are reported.

**0:43 Time box.** Choose the length of the session before you start, for example sixty minutes, and stop when the time is up. Stay on the charter. When you spot something outside it, write it down and carry on. It may become the next session's charter.

**1:02 Session notes.** Notes turn exploring into evidence. Keep them as you go. These findings are an example, not a real run. Covered lists what you tried, so a reviewer can see the gaps. Bugs are problems you could reproduce, like a pasted code with a trailing space being rejected. Questions are gaps in the requirements. Should codes be case-insensitive? Nobody said. And follow-up ideas are leads you didn't chase because they were off-charter.

**1:34 Debrief.** After the session, go through the notes with someone and agree what each finding means. A bug gets reported and, once fixed, becomes a scripted test case. A question goes to the requirement's owner. A follow-up idea becomes a new charter.

**1:51 Recap.** To recap: give every session a charter with one mission. Time-box it, and keep notes as you go. Then debrief, and turn what you found into test cases, questions and new charters.

## 课文

Scripted test cases check what you already expect. Exploratory testing finds what nobody thought to write down: you design the next test while you run the current one, and each result tells you where to look next.

Exploring is not clicking around. It has a mission, a time limit and a written record, so someone else can see what was covered and trust the result.

## A charter gives the session a mission

A charter is one sentence that says what this session is for. A common template is:

> Explore **target** with **resources** to discover **information**.

- **Target:** the feature or area, as narrow as you can make it.
- **Resources:** the data, tools or tricks you'll bring, such as unusual inputs, a second browser tab, or a slow network.
- **Information:** the kind of thing you want to learn, such as how errors are reported or whether totals stay correct.

For example: *Explore the Larkspur discount code field with expired, misspelled and pasted codes to discover how errors are reported.*

A charter that says only "test the checkout" is too wide to finish. One that lists exact steps is a scripted test case, not a charter.

## Time-box the session

Choose the length of the session before you start, for example 60 minutes, and stop when it ends. A fixed time box keeps sessions comparable and stops one interesting thread from eating the day.

Stay on the charter. When you notice something outside it, write it down and carry on. It may become the next session's charter.

## Keep session notes

Notes are what turn exploring into evidence. Keep them as you go, not afterwards. A simple template:

```text
Charter:   Explore the discount code field with expired, misspelled
           and pasted codes to discover how errors are reported
Tester:    Ada
Start:     <date and time>    Time box: 60 minutes
Setup:     Signed in as a member, cart over $20, Chrome

Covered:
- Expired code SAVE10-2024
- Misspelled codes (SAVE01, save10)
- Code pasted with a trailing space

Bugs:
- Pasted code with a trailing space is rejected as unknown

Questions:
- Should codes be case-insensitive? Not in the requirements

Follow-up ideas:
- Delivery estimate changes when a code is applied: new charter?
```

The example findings above are illustrations, not results from a real run.

- **Covered** shows what you tried, so a reviewer can see the gaps.
- **Bugs** are problems you could reproduce. Report each one with its steps.
- **Questions** are gaps in the requirements, just like the unspecified row in a decision table.
- **Follow-up ideas** are leads you didn't chase because they were off-charter.

## Debrief, then write the cases down

After the session, spend a few minutes going through the notes with someone: a teammate, a lead or the product owner. Agree what each finding means and what happens next.

Then turn the findings into lasting work. A bug becomes a report and, once it's fixed, a scripted test case that guards against it returning. A question goes to whoever owns the requirement. A follow-up idea becomes a new charter.

> **提示.** **Exploring and scripting work together.** Scripted cases check the behaviour you know about on every run. Exploratory sessions look for the behaviour you don't know about yet. Each good session adds a few scripted cases to the suite.

## Try it

Write a charter for a 30-minute session on the Larkspur sign-in page, using the template above. Then list three things you'd try in the session and one question you'd expect to raise.

## Quiz

1. Which is the best charter for one exploratory session?
   a. Test the checkout
   b. Explore the discount code field with expired, misspelled and pasted codes to discover how errors are reported
   c. Make sure there are no bugs in Larkspur
   d. Click around the site for an hour
   Answer: b. It names a target, the resources (kinds of codes) and the information wanted. The others give no mission, so nobody can tell when the session is done or what it covered.
2. Halfway through a session on the discount field, you notice the delivery estimate looks wrong. What should you do?
   a. Switch to the delivery estimate for the rest of the session
   b. Ignore it, it's off-charter
   c. Write it in your notes as an issue or follow-up idea, then return to the charter
   d. End the session early
   Answer: c. The charter keeps the session focused. Noting the side issue means it isn't lost, and it can become the charter for a later session.
3. Your session found that pasting a code with a trailing space rejects it. What should happen to that finding after the debrief?
   a. Nothing, exploratory findings are informal
   b. Report the bug, and add a scripted test case so the behaviour is checked on every run
   c. Rerun the same session every week instead
   d. Delete it from the notes once it's reported
   Answer: b. Exploration finds the problem; a written test case keeps it found. Without one, catching a regression depends on someone happening to explore the same path again.

## 要点

- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

---

上一页: [第 2.2 课: 超越正常路径](/demo/zh/test-cases/design/negative.md)
下一页: [第 3.1 课: 从测试用例到自动化测试](/demo/zh/test-cases/automation/unit-tests.md)
