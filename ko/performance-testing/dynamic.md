# 3장 · 시작: 동적 테스트

성능 테스트 · 3장: 동적 테스트 · 5분

> 시스템을 실행하고 트래픽을 보내, 사용자가 실제로 느끼는 것을 측정합니다.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

## 대본: Dynamic testing (1:01)

**0:00 Introduction.** Chapter two found problems by reading. Chapter three finds them by running: loading the page the way a phone would, and sending the app the traffic of a busy evening.

**0:12 What you'll get.** You'll measure page load in the lab with Lighthouse, and read what the numbers mean for a phone. You'll write a load test with k6, and let thresholds decide whether the app meets its budgets. You'll push past the expected load to find the app's capacity, and check it survives a surge. And you'll profile the app under load, read a flame graph, and prove a fix with numbers.

**0:43 Before you start.** You'll need k6, a free load testing tool. If you can't install it, every exercise also works with the practice app's built-in load tool. And run tests from a quiet machine. Numbers from a busy laptop, or from two different machines, aren't comparable.

## 강의 본문

Chapter 2 found problems by reading. This chapter finds them by running: loading the page the way a phone would, sending the app the traffic of a busy evening, then more traffic until it bends, and finally looking inside the process while it struggles.

Dynamic tests cost more than static ones. They need the app running, they take minutes, and their numbers depend on the machine. In return they answer the questions static checks can't: how slow, for how many users, and why.

## 이 장에서 얻을 것

- Measure page load in the lab with Lighthouse and read FCP, LCP and the score
- Write a k6 load test with stages, checks and thresholds, and read its summary
- Run stress, spike and soak tests, and find the app's practical capacity
- Profile the app under load, read a flame graph, and prove a CPU fix with numbers

## Before you start

Install k6, the load testing tool this chapter uses:

| System | Command |
| --- | --- |
| macOS | `brew install k6` |
| Windows | `winget install k6 --source winget` |
| Debian, Ubuntu | see [grafana.com/docs/k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) |

If you can't install it, every exercise also works with the practice app's built-in tool, `npm run load`. You'll need Chrome for Lighthouse and the profiler.

> **Run tests from a quiet machine.** Close heavy apps before a dynamic test and run the load generator and the app on the same machine only when comparing before with after. Numbers from different machines, or from a busy laptop, aren't comparable.

## In this chapter

- 강의 3.1: [Lighthouse로 실험실 측정](/demo/ko/performance-testing/dynamic/lighthouse.md) (25분). 시뮬레이션한 휴대폰으로 페이지를 열고, 사용자가 무엇을 언제 보는지 측정합니다.
- 강의 3.2: [k6로 부하 테스트](/demo/ko/performance-testing/dynamic/load-testing.md) (30분). 쇼핑객으로 붐비는 저녁을 시뮬레이션하고, 임계값으로 앱이 예산을 지키는지 판정합니다.
- 강의 3.3: [스트레스, 스파이크, 소크 테스트](/demo/ko/performance-testing/dynamic/stress-spike-soak.md) (30분). 예상 부하를 넘어 한계를 찾고, 급증을 견디고, 몇 시간에 걸친 느린 변화를 잡아냅니다.
- 강의 3.4: [병목 찾기](/demo/ko/performance-testing/dynamic/bottlenecks.md) (30분). 부하 중인 앱을 프로파일링하고, 플레임 그래프를 읽고, 핫 패스를 고친 뒤 같은 테스트로 증명합니다.
- 3장 · 요약: [동적 테스트: 요약](/demo/ko/performance-testing/dynamic/summary.md) (5분). 앱을 실행해 보고서야 알게 된 것들.

---

이전: [2장 · 요약: 정적 테스트: 요약](/demo/ko/performance-testing/static/summary.md)
다음: [강의 3.1: Lighthouse로 실험실 측정](/demo/ko/performance-testing/dynamic/lighthouse.md)
