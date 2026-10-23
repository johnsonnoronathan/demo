# 성능 테스트

> 사용자보다 먼저 소프트웨어를 느리게 만드는 원인을 찾으세요.

웹 애플리케이션의 성능을 양쪽에서 테스트하는 법을 배웁니다. 정적 테스트는 아무것도 실행하지 않고 코드, 쿼리, 에셋을 살펴보고, 동적 테스트는 시스템을 실행해 트래픽을 보내고 사용자가 느끼는 것을 측정합니다. 일부러 느리게 만든 작은 서점 앱 Larkspur Books로 둘 다 연습합니다.

총 시간: 6 시간 50 분

```bash
cd academy/practice/larkspur
npm run seed
npm start   # leave it running in its own terminal; http://localhost:3000
```

## 1장: 개요

성능 테스트가 측정하는 것, 두 가지 테스트 계열, 그리고 연습 앱.

- [1장 · 시작: 개요](/demo/ko/performance-testing/overview.md) (5분). 이 강좌가 다루는 것, 강좌의 구성, 강의실과 에이전트 프롬프트 사용법.
- [강의 1.1: 성능 테스트가 측정하는 것](/demo/ko/performance-testing/overview/what-it-measures.md) (20분). 지연 시간, 처리량, 오류: 모든 성능 테스트가 보고하는 세 숫자와, 지연 시간을 백분위수로 말하는 이유.
- [강의 1.2: 정적 테스트와 동적 테스트](/demo/ko/performance-testing/overview/static-and-dynamic.md) (20분). 두 가지 성능 테스트 계열, 각각이 찾을 수 있는 것과 없는 것, 테스트 전에 던질 질문을 계획하는 법.
- [1장 · 요약: 개요: 요약](/demo/ko/performance-testing/overview/summary.md) (5분). 강좌의 나머지에서 쓸 용어와 계획.

## 2장: 정적 테스트

만든 것을 실행하지 않고 읽어서 성능 문제를 찾습니다.

- [2장 · 시작: 정적 테스트](/demo/ko/performance-testing/static.md) (5분). 아무것도 실행하기 전에, 만든 것을 읽어서 성능 문제를 찾습니다.
- [강의 2.1: 성능 예산](/demo/ko/performance-testing/static/budgets.md) (20분). 측정하기 전에 한도를 정하고, 변경할 때마다 검사가 이를 지키게 합니다.
- [강의 2.2: N+1 쿼리 코드 리뷰](/demo/ko/performance-testing/static/n-plus-one.md) (25분). 데이터베이스를 쓰는 코드에서 가장 흔한 성능 버그, 읽어서 찾는 법과 없애는 법.
- [강의 2.3: 쿼리 플랜 읽기](/demo/ko/performance-testing/static/query-plans.md) (25분). 쿼리를 실행하지 않고 데이터베이스에 실행 방법을 묻고, 전체 테이블 스캔을 알맞은 인덱스로 고칩니다.
- [강의 2.4: 에셋 무게](/demo/ko/performance-testing/static/asset-weight.md) (20분). 파일 무게를 재서 페이지를 무겁게 하는 것을 찾고, 보이는 것은 바꾸지 않은 채 예산 안으로 줄입니다.
- [2장 · 요약: 정적 테스트: 요약](/demo/ko/performance-testing/static/summary.md) (5분). 앱을 실행하지 않고 찾은 것, 그리고 정적 검사로는 알 수 없는 것.

## 3장: 동적 테스트

시스템을 실행하고 트래픽을 보내 사용자가 느끼는 것을 측정합니다.

- [3장 · 시작: 동적 테스트](/demo/ko/performance-testing/dynamic.md) (5분). 시스템을 실행하고 트래픽을 보내, 사용자가 실제로 느끼는 것을 측정합니다.
- [강의 3.1: Lighthouse로 실험실 측정](/demo/ko/performance-testing/dynamic/lighthouse.md) (25분). 시뮬레이션한 휴대폰으로 페이지를 열고, 사용자가 무엇을 언제 보는지 측정합니다.
- [강의 3.2: k6로 부하 테스트](/demo/ko/performance-testing/dynamic/load-testing.md) (30분). 쇼핑객으로 붐비는 저녁을 시뮬레이션하고, 임계값으로 앱이 예산을 지키는지 판정합니다.
- [강의 3.3: 스트레스, 스파이크, 소크 테스트](/demo/ko/performance-testing/dynamic/stress-spike-soak.md) (30분). 예상 부하를 넘어 한계를 찾고, 급증을 견디고, 몇 시간에 걸친 느린 변화를 잡아냅니다.
- [강의 3.4: 병목 찾기](/demo/ko/performance-testing/dynamic/bottlenecks.md) (30분). 부하 중인 앱을 프로파일링하고, 플레임 그래프를 읽고, 핫 패스를 고친 뒤 같은 테스트로 증명합니다.
- [3장 · 요약: 동적 테스트: 요약](/demo/ko/performance-testing/dynamic/summary.md) (5분). 앱을 실행해 보고서야 알게 된 것들.

## 4장: 요약

둘을 하나의 작업 흐름으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌 전체를 돌아봅니다.

- [4장 · 시작: 요약](/demo/ko/performance-testing/review.md) (5분). 정적 테스트와 동적 테스트를 하나의 일상으로 묶고, 결과를 보고하고, 인수 테스트를 하고, 내 프로젝트에 적용하고, 강좌를 돌아봅니다.
- [강의 4.1: 성능 테스트 작업 흐름](/demo/ko/performance-testing/review/workflow.md) (25분). 어디서 무엇을 실행할지 정하기: 풀 리퀘스트마다 정적 게이트, 릴리스 전 동적 테스트, 운영 환경 모니터링.
- [강의 4.2: 결과 보고하기](/demo/ko/performance-testing/review/reporting.md) (20분). 사람들이 결정할 수 있고 다른 사람이 테스트를 반복할 수 있도록 성능 결과를 정리합니다.
- [강의 4.3: 성능 인수 테스트](/demo/ko/performance-testing/review/acceptance.md) (30분). 예산을 인수 기준으로 바꾸고, 명령 하나로 인수 테스트를 실행하고, 서명이 담긴 출시 여부 결정을 내립니다.
- [강의 4.4: 내 프로젝트에서 정적 테스트](/demo/ko/performance-testing/review/your-project.md) (45분). 강좌의 정적 검사를 실제 코드베이스에서 직접 실행하고, 숫자를 읽고, 첫 예산을 정한 뒤 수정은 에이전트에게 맡깁니다.
- [4장 · 요약: 강좌 요약](/demo/ko/performance-testing/review/summary.md) (10분). 강좌에서 다룬 모든 것을 한곳에, 그리고 다음에 갈 곳.
