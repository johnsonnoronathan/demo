# 교안: 테스트 케이스 작성법

짧은 강의로 배우는 테스트의 기초. 테스트 케이스란 무엇이고 믿을 만한 케이스의 조건은 무엇인지, 동등 분할과 경계값으로 입력을 고르는 법, 비정상 경로 다루기, 작성한 케이스를 자동 테스트로 바꾸기, 커지는 테스트 스위트를 건강하게 유지하기를 배웁니다.

- 총 시간: 1 시간 45 분
- 동영상: 7 (13:05)
- 소프트웨어를 테스트하거나 테스트하고 싶은 누구나: 개발자, 테스터, 프로덕트 담당자. 테스트 경험은 필요 없으며, 3.1강에서 JavaScript를 조금 읽습니다.

## 강좌 목표

- 테스트 케이스를 읽고, 쓰고, 손으로 실행하기
- 모호한 테스트 케이스를 구체적이고 반복 가능하게 고쳐 쓰기
- 동등 분할과 경계값으로 테스트 입력 고르기
- 비정상 케이스를 다루고 결정 테이블로 빈틈 찾기
- Arrange, Act, Assert로 테스트 케이스를 자동 테스트로 바꾸기
- 테스트 피라미드와 추적 매트릭스로 스위트 정리하기

## 시작하기 전에

- 소프트웨어가 어떻게 망가지는지에 대한 호기심
- Node.js (3.1강의 테스트를 직접 실행할 때만)

## 구성

1. **기초** (30 min): 테스트 케이스란 무엇이며, 좋은 케이스와 약한 케이스는 어떻게 다른가.
2. **테스트 케이스 설계** (45 min): 분할, 경계값, 결정 테이블로 어떤 케이스를 쓸지 고릅니다.
3. **자동화와 확장** (30 min): 케이스를 코드로 바꾸고, 사람들이 믿는 스위트로 정리합니다.

## 1장: 기초

테스트 케이스란 무엇이며, 좋은 케이스와 약한 케이스는 어떻게 다른가. (30 분)

### 강의 1.1: 테스트 케이스란? (15분, ▶ 2:56)

테스트 케이스의 구성 요소를 항목별로 만들고, 실제 로그인 페이지에 대해 손으로 실행합니다.

/demo/ko/test-cases/foundations/anatomy.md

학습 성과:
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

핵심:
- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

### 강의 1.2: 좋은 테스트 케이스, 약한 테스트 케이스 (15분, ▶ 1:55)

테스트 케이스를 믿을 수 있게 만드는 다섯 가지 습관과, 많은 팀이 쓰는 Given, When, Then 형식.

/demo/ko/test-cases/foundations/good-cases.md

학습 성과:
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

핵심:
- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

## 2장: 테스트 케이스 설계

분할, 경계값, 결정 테이블로 어떤 케이스를 쓸지 고릅니다. (45 분)

### 강의 2.1: 분할과 경계 (15분, ▶ 1:30)

동등 분할과 경계값 분석: 수천 개의 입력 대신 잘 고른 몇 개.

/demo/ko/test-cases/design/partitions.md

학습 성과:
- Divide an input range into equivalence partitions
- Pick boundary values and their neighbors
- Turn partitions and boundaries into a compact set of test cases

핵심:
- Group inputs the software should treat the same way, and test one from each group.
- Bugs cluster at edges: test each boundary and the value just outside it.
- An off-by-one comparison is only caught by the exact boundary value.

### 강의 2.2: 정상 경로 너머 (15분, ▶ 1:28)

비정상 케이스, 극단 케이스, 그리고 조건이 결합하는 규칙을 위한 결정 테이블.

/demo/ko/test-cases/design/negative.md

학습 성과:
- List the usual ways input goes wrong
- Write negative test cases with clear expected messages
- Build a decision table and spot gaps in requirements

핵심:
- Every happy path has unhappy siblings: empty, wrong format, extremes, bad timing.
- Negative cases check that the software fails gracefully, with a clear message.
- Decision tables list every combination of conditions and expose unspecified ones.

### 강의 2.3: Exploratory testing (15분, ▶ 2:06)

Learn without a script: steer a time-boxed session with a charter, keep session notes, and turn what you find into test cases.

/demo/ko/test-cases/design/exploratory.md

학습 성과:
- Write a charter that gives an exploratory session one clear mission
- Run a time-boxed session and keep notes someone else can read
- Turn findings from a session into bugs, questions and new test cases

핵심:
- Exploratory testing is designing and running tests at the same time, learning as you go.
- A charter names a target, the resources you'll use and the information you want: one mission per session.
- Session notes record what you covered, what you found and what you'd explore next, so the session can be reviewed.
- Good findings become scripted test cases, so the next run doesn't depend on memory.

## 3장: 자동화와 확장

케이스를 코드로 바꾸고, 사람들이 믿는 스위트로 정리합니다. (30 분)

### 강의 3.1: 테스트 케이스에서 자동 테스트로 (15분, ▶ 1:28)

작성한 테스트 케이스를 Arrange, Act, Assert로 코드로 바꾸고, 경계값 테스트가 진짜 버그를 잡는 것을 봅니다.

/demo/ko/test-cases/automation/unit-tests.md

학습 성과:
- Map a written test case onto Arrange, Act, Assert
- Write a unit test with a test runner
- Watch a test fail before trusting it to pass

핵심:
- The test name is the title, Arrange is the setup, Act is the step, Assert is the expected result.
- A boundary test turns an off-by-one bug red in milliseconds.
- See a test fail once before you trust it to pass.

### 강의 3.2: 테스트 스위트 정리하기 (15분, ▶ 1:42)

테스트 피라미드, 요구사항 추적, 그리고 커지는 스위트를 건강하게 유지하기.

/demo/ko/test-cases/automation/suites.md

학습 성과:
- Balance a suite with the test pyramid
- Trace test cases to requirements and find gaps and orphans
- Keep a suite healthy: names, flaky tests, ownership

핵심:
- Many fast unit tests, fewer integration tests, a handful of end-to-end tests.
- A traceability matrix shows requirements with no tests and tests with no requirement.
- Name tests by behavior and fix flaky tests quickly, or people learn to ignore red.
