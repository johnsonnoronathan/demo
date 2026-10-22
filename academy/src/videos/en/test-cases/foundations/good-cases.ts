import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "Good test cases, weak test cases",
  "scenes": [
    {
      "label": "Introduction",
      "cues": [
        "Two people can test the same feature and write very different test cases. In this lesson, we look at what makes one good."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Lesson 1.2 · Foundations",
          "heading": "Good test cases, weak test cases",
          "sub": "Five habits and one useful format",
          "subAt": 0.5
        }
      ]
    },
    {
      "label": "Weak vs strong",
      "cues": [
        "Here's a weak test case. Test login. Log in with a user. It works.",
        "Which user? Which password? What does 'works' look like? Two testers could run this and disagree on the result.",
        "Here's the same idea, rewritten. The title names one behavior: sign-in is rejected when the password is wrong.",
        "The data is exact, and the expected result is something you can see: an error message, and you stay on the sign-in page."
      ],
      "layout": "split",
      "panes": [
        {
          "type": "card",
          "compact": true,
          "tag": {
            "text": "Weak",
            "kind": "fail"
          },
          "id": "TC-?",
          "title": "Test login",
          "titleAt": 0,
          "fields": [
            {
              "at": 0.3,
              "label": "Steps",
              "value": "Log in with a user.",
              "flag": {
                "at": 1,
                "text": "Which user? Which password?"
              }
            },
            {
              "at": 0.6,
              "label": "Expected result",
              "value": "It works.",
              "flag": {
                "at": 1.4,
                "text": "What would you see?"
              }
            }
          ]
        },
        {
          "type": "card",
          "compact": true,
          "tag": {
            "text": "Strong",
            "kind": "pass"
          },
          "id": "TC-LOGIN-002",
          "title": "Sign-in is rejected when the password is wrong",
          "titleAt": 2,
          "fields": [
            {
              "at": 2.5,
              "label": "Test data",
              "list": [
                "Email: ada@larkspur.test",
                "Password: lark2026 (wrong)"
              ]
            },
            {
              "at": 3,
              "label": "Steps",
              "steps": [
                "Open the sign-in page",
                "Enter the email and password",
                "Select Sign in"
              ]
            },
            {
              "at": 3.4,
              "label": "Expected result",
              "value": "“Email or password is incorrect” appears. Page stays on sign-in."
            }
          ]
        }
      ]
    },
    {
      "label": "Five habits",
      "cues": [
        "Good test cases share five habits.",
        "They're atomic: one behavior per case, so a failure points at one thing.",
        "They're independent: each case sets up its own preconditions, and doesn't rely on another case running first.",
        "They're repeatable: same inputs, same steps, same result, every time.",
        "They're specific: real values, observable outcomes, no 'should work'.",
        "And they're traceable: each one links back to the requirement it checks."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Five habits",
          "items": [
            {
              "at": 1,
              "text": "Atomic",
              "sub": "One behavior per case"
            },
            {
              "at": 2,
              "text": "Independent",
              "sub": "Sets up its own world; any order works"
            },
            {
              "at": 3,
              "text": "Repeatable",
              "sub": "Same inputs, same result, every time"
            },
            {
              "at": 4,
              "text": "Specific",
              "sub": "Real values, observable outcomes"
            },
            {
              "at": 5,
              "text": "Traceable",
              "sub": "Links to the requirement it checks"
            }
          ]
        }
      ]
    },
    {
      "label": "Given, When, Then",
      "cues": [
        "Many teams write test cases in a Given, When, Then shape.",
        "Given sets up the world. That's your preconditions and test data.",
        "When is the single action under test.",
        "Then is the expected result. Keep it observable.",
        "This format reads like plain English, and later it can even drive automated tests."
      ],
      "panes": [
        {
          "type": "code",
          "file": "sign-in.feature",
          "lang": "gherkin",
          "typeTo": 0.95,
          "code": "Feature: Sign in\n\n  Scenario: Wrong password is rejected\n    Given a customer account \"ada@larkspur.test\" exists\n    And its password is \"Lark!2026\"\n    When I sign in with password \"lark2026\"\n    Then I see \"Email or password is incorrect\"\n    And I remain on the sign-in page",
          "highlights": [
            {
              "at": 1,
              "until": 2,
              "lines": [
                4,
                5
              ],
              "note": "Given · preconditions + data"
            },
            {
              "at": 2,
              "until": 3,
              "lines": [
                6
              ],
              "note": "When · the one action"
            },
            {
              "at": 3,
              "until": 4,
              "lines": [
                7,
                8
              ],
              "note": "Then · expected result"
            }
          ]
        }
      ]
    },
    {
      "label": "Recap",
      "cues": [
        "To recap: replace vague words with real values and observable results.",
        "Keep each case atomic, independent, repeatable, specific and traceable.",
        "In the next module, we'll stop asking how to write a case, and start asking which cases to write."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Recap",
          "check": true,
          "items": [
            {
              "at": 0,
              "text": "Real values, observable results"
            },
            {
              "at": 1,
              "text": "Atomic · independent · repeatable · specific · traceable"
            },
            {
              "at": 2,
              "text": "Next: choosing which cases to write",
              "dim": true
            }
          ]
        }
      ]
    }
  ]
});
