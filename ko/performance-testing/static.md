# 2장 · 시작: 정적 테스트

성능 테스트 · 2장: 정적 테스트 · 5분

> 아무것도 실행하기 전에, 만든 것을 읽어서 성능 문제를 찾습니다.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

## 대본: Static testing (0:49)

**0:00 Introduction.** Chapter two is about the cheapest performance tests you will ever run: the ones that never start your code.

**0:08 What you'll get.** By the end of this chapter, you'll turn budgets into a check that fails the build, spot the N+1 query pattern, with a linter and by eye, read a query plan, and fix a full table scan with an index, and find what makes a page heavy, then cut it below budget.

**0:32 Your tools.** You'll use three tools that ship with the practice app. None of them needs a server. The trade-off: a static check finds what looks slow. It can't tell you how slow it is under load. That's chapter three's job.

## 강의 본문

Static tests are the cheapest performance tests you will ever run. They read code, query plans and build output, so they need no server, no traffic and no test environment. They take seconds, which means they can run on every change, long before anyone notices a slowdown.

The trade-off: a static check only finds problems that look like something already known to be slow. It tells you a query will scan 200,000 rows, not how many seconds that costs at 50 users. That's chapter 3's job. In this chapter you'll find three of Larkspur's problems without starting the app at all, then confirm each fix with one quick request.

## 이 장에서 얻을 것

- Turn your plan's budgets into a check that passes or fails the build
- Spot the N+1 query pattern in code, with a linter and by eye, and remove it
- Read a SQLite query plan, recognise a full table scan, and fix it with an index
- Find what makes a page heavy, and cut it below budget
- Know which of these checks belong on every pull request

## What you'll use

| Tool | What it reads | Lesson |
| --- | --- | --- |
| `npm run budget` | The files the storefront loads, measured against `budget.json` | 2.1, 2.4 |
| `npm run lint:queries` | Source files, looking for database calls inside loops | 2.2 |
| `npm run explain` | SQLite's plan for a query, without running it | 2.3 |

All three ship with the practice app and need nothing installed.

## In this chapter

- 강의 2.1: [성능 예산](/demo/ko/performance-testing/static/budgets.md) (20분). 측정하기 전에 한도를 정하고, 변경할 때마다 검사가 이를 지키게 합니다.
- 강의 2.2: [N+1 쿼리 코드 리뷰](/demo/ko/performance-testing/static/n-plus-one.md) (25분). 데이터베이스를 쓰는 코드에서 가장 흔한 성능 버그, 읽어서 찾는 법과 없애는 법.
- 강의 2.3: [쿼리 플랜 읽기](/demo/ko/performance-testing/static/query-plans.md) (25분). 쿼리를 실행하지 않고 데이터베이스에 실행 방법을 묻고, 전체 테이블 스캔을 알맞은 인덱스로 고칩니다.
- 강의 2.4: [에셋 무게](/demo/ko/performance-testing/static/asset-weight.md) (20분). 파일 무게를 재서 페이지를 무겁게 하는 것을 찾고, 보이는 것은 바꾸지 않은 채 예산 안으로 줄입니다.
- 2장 · 요약: [정적 테스트: 요약](/demo/ko/performance-testing/static/summary.md) (5분). 앱을 실행하지 않고 찾은 것, 그리고 정적 검사로는 알 수 없는 것.

---

이전: [1장 · 요약: 개요: 요약](/demo/ko/performance-testing/overview/summary.md)
다음: [강의 2.1: 성능 예산](/demo/ko/performance-testing/static/budgets.md)
