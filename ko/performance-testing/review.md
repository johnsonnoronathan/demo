# 4장 · 시작: 요약

성능 테스트 · 4장: 요약 · 5분

> 정적 테스트와 동적 테스트를 하나의 일상으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌를 돌아봅니다.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

## 대본: Summary (1:11)

**0:00 Introduction.** The last two chapters went deep, one family of tests each. This one steps back: it makes performance testing a routine, turns results into a decision, and takes it to your own code.

**0:14 Where you are.** Larkspur now runs one query per page instead of a hundred and one, has two new indexes, a storefront a twentieth of its old weight, and twelve times the throughput on recommendations. This chapter makes sure the next change can't quietly undo any of it.

**0:33 What you'll get.** You'll decide which checks run on every pull request, which before a release, and which in production. You'll wire the static gates and a short load test into a CI workflow. You'll write a performance report that someone else can act on and repeat. You'll run a formal acceptance test against agreed criteria, and make the go or no-go call. You'll run the static checks on your own project, and hand the fixes to an agent. And you'll review the whole course in one place.

## 강의 본문

The last two chapters went deep: one family of tests each. This one steps back. A performance test that runs once finds today's problems; a routine finds tomorrow's before they ship. And a result nobody can read or repeat changes nothing.

## 이 장에서 얻을 것

- Know which checks run on every pull request, which before a release, and which in production
- Wire the static gates and a short load test into a CI workflow
- Write a performance report that someone can act on and repeat
- Run an acceptance test and record a go/no-go decision
- Run the static checks on your own project and hand the fixes to an agent
- Review the whole course and know where to go next

## Where you are

1. **개요** (전체): 성능 테스트가 측정하는 것, 두 가지 테스트 계열, 그리고 연습 앱.
2. **정적 테스트** (개별): 만든 것을 실행하지 않고 읽어서 성능 문제를 찾습니다.
3. **동적 테스트** (개별): 시스템을 실행하고 트래픽을 보내 사용자가 느끼는 것을 측정합니다.
4. **요약** (전체): 둘을 하나의 작업 흐름으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌 전체를 돌아봅니다.

By now Larkspur has one query per page instead of 101, two indexes, a storefront a twentieth of its old weight, and a recommendations endpoint with twelve times the throughput. Every one of those changes has a measurement behind it. This chapter makes sure the next change can't quietly undo them. Then it turns the results into a decision, with a formal acceptance test, and takes the static checks to your own codebase.

## In this chapter

- 강의 4.1: [성능 테스트 작업 흐름](/demo/ko/performance-testing/review/workflow.md) (25분). 어디서 무엇을 실행할지 정하기: 풀 리퀘스트마다 정적 게이트, 릴리스 전 동적 테스트, 운영 환경 모니터링.
- 강의 4.2: [결과 보고하기](/demo/ko/performance-testing/review/reporting.md) (20분). 사람들이 결정할 수 있고 다른 사람이 테스트를 반복할 수 있도록 성능 결과를 정리합니다.
- 강의 4.3: [성능 인수 테스트](/demo/ko/performance-testing/review/acceptance.md) (30분). 예산을 인수 기준으로 바꾸고, 명령 하나로 인수 테스트를 실행하고, 서명이 담긴 출시 여부 결정을 내립니다.
- 강의 4.4: [내 프로젝트에서 정적 테스트](/demo/ko/performance-testing/review/your-project.md) (45분). 강좌의 정적 검사를 실제 코드베이스에서 직접 실행하고, 숫자를 읽고, 첫 예산을 정한 뒤 수정은 에이전트에게 맡깁니다.
- 4장 · 요약: [강좌 요약](/demo/ko/performance-testing/review/summary.md) (10분). 강좌에서 다룬 모든 것을 한곳에, 그리고 다음에 갈 곳.

---

이전: [3장 · 요약: 동적 테스트: 요약](/demo/ko/performance-testing/dynamic/summary.md)
다음: [강의 4.1: 성능 테스트 작업 흐름](/demo/ko/performance-testing/review/workflow.md)
