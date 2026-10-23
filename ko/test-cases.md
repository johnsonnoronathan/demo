# 테스트 케이스 작성법

> 누구나 실행할 수 있고 버그를 찾아내는 테스트 케이스를 쓰세요.

짧은 강의로 배우는 테스트의 기초. 테스트 케이스란 무엇이고 믿을 만한 케이스의 조건은 무엇인지, 동등 분할과 경계값으로 입력을 고르는 법, 비정상 경로 다루기, 작성한 케이스를 자동 테스트로 바꾸기, 커지는 테스트 스위트를 건강하게 유지하기를 배웁니다.

총 시간: 1 시간 45 분

## 1장: 기초

테스트 케이스란 무엇이며, 좋은 케이스와 약한 케이스는 어떻게 다른가.

- [강의 1.1: 테스트 케이스란?](/demo/ko/test-cases/foundations/anatomy.md) (15분). 테스트 케이스의 구성 요소를 항목별로 만들고, 실제 로그인 페이지에 대해 손으로 실행합니다.
- [강의 1.2: 좋은 테스트 케이스, 약한 테스트 케이스](/demo/ko/test-cases/foundations/good-cases.md) (15분). 테스트 케이스를 믿을 수 있게 만드는 다섯 가지 습관과, 많은 팀이 쓰는 Given, When, Then 형식.

## 2장: 테스트 케이스 설계

분할, 경계값, 결정 테이블로 어떤 케이스를 쓸지 고릅니다.

- [강의 2.1: 분할과 경계](/demo/ko/test-cases/design/partitions.md) (15분). 동등 분할과 경계값 분석: 수천 개의 입력 대신 잘 고른 몇 개.
- [강의 2.2: 정상 경로 너머](/demo/ko/test-cases/design/negative.md) (15분). 비정상 케이스, 극단 케이스, 그리고 조건이 결합하는 규칙을 위한 결정 테이블.
- [강의 2.3: Exploratory testing](/demo/ko/test-cases/design/exploratory.md) (15분). Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

## 3장: 자동화와 확장

케이스를 코드로 바꾸고, 사람들이 믿는 스위트로 정리합니다.

- [강의 3.1: 테스트 케이스에서 자동 테스트로](/demo/ko/test-cases/automation/unit-tests.md) (15분). 작성한 테스트 케이스를 Arrange, Act, Assert로 코드로 바꾸고, 경계값 테스트가 진짜 버그를 잡는 것을 봅니다.
- [강의 3.2: 테스트 스위트 정리하기](/demo/ko/test-cases/automation/suites.md) (15분). 테스트 피라미드, 요구사항 추적, 그리고 커지는 스위트를 건강하게 유지하기.
