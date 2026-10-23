# 강의 1.2: 좋은 테스트 케이스, 약한 테스트 케이스

테스트 케이스 작성법 · 1장: 기초 · 15분

> 테스트 케이스를 믿을 수 있게 만드는 다섯 가지 습관과, 많은 팀이 쓰는 Given, When, Then 형식.

*이 강의는 아직 ko로 번역되지 않아 영어 본문을 보여 드립니다. 제목과 탐색은 번역되어 있습니다.*

**이 강의를 마치면 할 수 있는 것:**
- Spot vague wording in a test case and rewrite it
- Apply five habits: atomic, independent, repeatable, specific, traceable
- Write a scenario in Given, When, Then form

## 대본: Good test cases, weak test cases (1:55)

**0:00 Introduction.** Two people can test the same feature and write very different test cases. In this lesson, we look at what makes one good.

**0:10 Weak vs strong.** Here's a weak test case. Test login. Log in with a user. It works. Which user? Which password? What does 'works' look like? Two testers could run this and disagree on the result. Here's the same idea, rewritten. The title names one behavior: sign-in is rejected when the password is wrong. The data is exact, and the expected result is something you can see: an error message, and you stay on the sign-in page.

**0:42 Five habits.** Good test cases share five habits. They're atomic: one behavior per case, so a failure points at one thing. They're independent: each case sets up its own preconditions, and doesn't rely on another case running first. They're repeatable: same inputs, same steps, same result, every time. They're specific: real values, observable outcomes, no 'should work'. And they're traceable: each one links back to the requirement it checks.

**1:13 Given, When, Then.** Many teams write test cases in a Given, When, Then shape. Given sets up the world. That's your preconditions and test data. When is the single action under test. Then is the expected result. Keep it observable. This format reads like plain English, and later it can even drive automated tests.

**1:37 Recap.** To recap: replace vague words with real values and observable results. Keep each case atomic, independent, repeatable, specific and traceable. In the next module, we'll stop asking how to write a case, and start asking which cases to write.

## 강의 본문

A good test case gives the same verdict no matter who runs it, and when it fails, it points at one thing.

## Weak words to watch for

| Weak | Rewrite as |
| --- | --- |
| “a valid user” | `ada@larkspur.test` / `Lark!2026` |
| “it works” | “The account page opens with ‘Welcome back, Ada’.” |
| “should show an error” | “‘Email or password is incorrect’ appears under the form.” |
| “test the cart” | One case per behavior: add, remove, change quantity… |

## The five habits

1. **Atomic.** One behavior per case. If the title needs “and”, split it.
2. **Independent.** Never rely on another case running first; set up your own preconditions.
3. **Repeatable.** Fixed data, fixed steps. Avoid “today’s date” unless you pin it.
4. **Specific.** Values and observable outcomes, not intentions.
5. **Traceable.** Reference the requirement, such as `REQ-01`.

## Given, When, Then

```gherkin
Scenario: Wrong password is rejected
  Given a customer account "ada@larkspur.test" exists
  And its password is "Lark!2026"
  When I sign in with password "lark2026"
  Then I see "Email or password is incorrect"
  And I remain on the sign-in page
```

Keep exactly one **When** per scenario. Two actions usually means two scenarios.

## Try it

Rewrite this weak case: *“Check that search works.”* Pick one behavior (for example, searching “Middlemarch” lists that title first) and write it in Given, When, Then form.

## Quiz

1. A title reads “Add to cart and checkout and apply coupon”. Which habit does it break?
   a. Traceable
   b. Atomic
   c. Repeatable
   d. None, it is fine
   Answer: b. Three behaviors in one case means a failure doesn't tell you which one broke. Split it into three cases.
2. Case B only passes if case A ran first and created an order. What should change?
   a. Always run A before B
   b. Merge A and B into one case
   c. B sets up its own order in its preconditions
   d. Delete case B
   Answer: c. Independent cases can run in any order, alone or in parallel. B should create the order it needs.
3. In Given, When, Then, where does the expected result go?
   a. Given
   b. When
   c. Then
   d. Feature
   Answer: c. Given is the setup, When is the one action, Then is what you expect to observe.

## 핵심

- Replace vague words with real values and observable results.
- Keep each case atomic, independent, repeatable, specific and traceable.
- Given is the setup, When is the one action, Then is the expected result.

---

이전: [강의 1.1: 테스트 케이스란?](/demo/ko/test-cases/foundations/anatomy.md)
다음: [강의 2.1: 분할과 경계](/demo/ko/test-cases/design/partitions.md)
