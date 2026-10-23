# 1장 · 시작: 개요

성능 테스트 · 1장: 개요 · 5분

> 이 강좌가 다루는 것, 강좌의 구성, 강의실과 에이전트 프롬프트 사용법.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

## 대본: Overview (1:53)

**0:00 Welcome.** Welcome to Performance Testing on Testbench. In this course you'll learn to find what makes software slow, before your users do. "The site feels slow" is a complaint. A number with a cause attached is a finding. This course teaches you to get from one to the other.

**0:20 Four chapters.** The course has four chapters. First, an overview: what performance testing measures, and how. Then static testing: finding problems by reading code, query plans and build output, without running anything. Then dynamic testing: running the app under realistic traffic and measuring what users feel. And finally a summary that puts both into a workflow, and into a report people can act on.

**0:48 The practice app.** You'll practise on Larkspur Books, a small online bookshop with five thousand books and two hundred thousand orders. It's slow on purpose. One page of books runs a hundred and one database queries, and on a phone the main image takes almost ten seconds to appear. By the end of the course you'll have found and fixed every one of those problems, with a number to prove each fix.

**1:17 How each page works.** Every page works the same way. Watch a short video, like this one. Then read the lesson below it, at your own pace. Then do your part of the hands-on exercise: run the checks yourself, and read the numbers. Hand the implementation to a coding agent. Copy the exercise's prompt, and the agent makes the fix and quotes its output. Then verify: rerun the same check yourself. The number you see is the one that counts, and the decision is yours.

## 강의 본문

"The site feels slow" is a complaint. "p95 for `/api/books` is 1.3 seconds against a 300 ms budget, because the endpoint runs 101 queries per request" is a finding someone can fix. This course teaches you to get from the first to the second, reliably.

## 이 장에서 얻을 것

- Know what questions performance testing answers, and which numbers it reports
- Tell static testing from dynamic testing, and know when each one pays off
- Have the practice app running, with a first measurement written down
- Know how to hand a hands-on exercise to a coding agent, and what to check when it reports back

## How the course is built

The course moves from the big picture to specific techniques and back again. Chapter 1 frames the problem. Chapters 2 and 3 each go deep on one family of tests. Chapter 4 puts them together into a workflow and a report.

1. **개요** (전체): 성능 테스트가 측정하는 것, 두 가지 테스트 계열, 그리고 연습 앱.
2. **정적 테스트** (개별): 만든 것을 실행하지 않고 읽어서 성능 문제를 찾습니다.
3. **동적 테스트** (개별): 시스템을 실행하고 트래픽을 보내 사용자가 느끼는 것을 측정합니다.
4. **요약** (전체): 둘을 하나의 작업 흐름으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌 전체를 돌아봅니다.

Every chapter follows the same shape:

1. **An opening** like this one: what you'll get, and a map of the chapter.
2. **Lessons.** Each mixes concepts and practice. Concepts come with a short **animation** you can play, pause and step through. Hands-on exercises run against the practice app and show **screenshots** of what you should see.
3. **A summary** that collects the chapter's key points and gives you a few questions to check yourself.

## The practice app

Everything you test is **Larkspur Books**, a small bookshop in `academy/practice/larkspur`: a storefront page and three JSON endpoints over a SQLite database of 5,000 books, 50,000 reviews and 200,000 orders. It needs Node.js 22.13 or later and nothing else.

Larkspur is slow on purpose. Each problem in it is one this course teaches you to find, and every number quoted in the lessons comes from a real run against it. Your numbers will differ with your machine; the shape of the results won't.

## Working with an agent

This course teaches you to test performance, and an agent helps you do it. The split is the same in every exercise:

| You | The agent |
| --- | --- |
| Learn the concept: watch, read | |
| Run the checks and tests, read the numbers | |
| | Implement: fixes, scripts, gates, CI configuration |
| | Report back, quoting real command output |
| Verify: rerun the same check and compare | |
| Decide: accept, reject, or set a new budget | |

Each exercise has two parts. **Your part** comes first: the steps you run yourself, with the output you should expect. Then the **agent part**: a prompt you copy into Claude Code or another coding agent, so it makes the changes. The prompt is self-contained: where to work, the steps, how to tell it's done, and what to report. It tells the agent to quote real output instead of estimating, and never to loosen a budget to make a check pass.

When the agent says it's done, rerun the check yourself. The number you see is the one that counts. By the end of the course you'll use the same loop on your own project (lesson 4.4) and finish with a formal acceptance decision (lesson 4.3).

> **Agents can read the whole course.** Every page has a Markdown version (see "For agents" in the page margin), and `/llms.txt` lists them all. Point an agent there when it needs context beyond a single exercise.

## In this chapter

- 강의 1.1: [성능 테스트가 측정하는 것](/demo/ko/performance-testing/overview/what-it-measures.md) (20분). 지연 시간, 처리량, 오류: 모든 성능 테스트가 보고하는 세 숫자와, 지연 시간을 백분위수로 말하는 이유.
- 강의 1.2: [정적 테스트와 동적 테스트](/demo/ko/performance-testing/overview/static-and-dynamic.md) (20분). 두 가지 성능 테스트 계열, 각각이 찾을 수 있는 것과 없는 것, 테스트 전에 던질 질문을 계획하는 법.
- 1장 · 요약: [개요: 요약](/demo/ko/performance-testing/overview/summary.md) (5분). 강좌의 나머지에서 쓸 용어와 계획.

---

다음: [강의 1.1: 성능 테스트가 측정하는 것](/demo/ko/performance-testing/overview/what-it-measures.md)
