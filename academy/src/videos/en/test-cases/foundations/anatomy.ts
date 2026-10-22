import { defineVideo } from "../../../../video/types";

export default defineVideo({
  "title": "What is a test case?",
  "scenes": [
    {
      "label": "Welcome",
      "cues": [
        "Welcome to Writing Test Cases. In this first lesson, we answer one question: what exactly is a test case?",
        "By the end, you'll be able to read one, write one, and run one by hand."
      ],
      "panes": [
        {
          "type": "title",
          "kicker": "Lesson 1.1 · Foundations",
          "heading": "What is a test case?",
          "sub": "Read one. Write one. Run one.",
          "subAt": 1
        }
      ]
    },
    {
      "label": "A definition",
      "cues": [
        "A test case is a written, repeatable check. It says: in this situation, when I do these exact things, this is what should happen.",
        "It has three jobs. First, it pins down a single behavior worth checking.",
        "Second, it's specific enough that anyone on the team gets the same result.",
        "And third, it records the outcome, so you know whether the software passed."
      ],
      "panes": [
        {
          "type": "bullets",
          "formula": [
            "In this situation",
            "when I do this",
            "this should happen"
          ],
          "items": [
            {
              "at": 1,
              "text": "Checks one behavior"
            },
            {
              "at": 2,
              "text": "Anyone can repeat it"
            },
            {
              "at": 3,
              "text": "Records the outcome"
            }
          ]
        }
      ]
    },
    {
      "label": "Anatomy",
      "cues": [
        "Let's build one together. We're testing the sign-in page of Larkspur Books, a small online bookstore.",
        "Every test case gets an ID and a title. The title names the behavior: sign-in succeeds with a valid email and password.",
        "Preconditions describe the world before you start. Here, a customer account already exists.",
        "Test data lists the exact inputs. Not 'enter a valid email'. We write the actual address and password.",
        "Steps are numbered actions, one per line, written so a newcomer could follow them.",
        "And the expected result says precisely what should happen. Not 'it works', but the page and the message you'll see."
      ],
      "panes": [
        {
          "type": "card",
          "focus": true,
          "id": "TC-LOGIN-001",
          "title": "Sign-in succeeds with a valid email and password",
          "titleAt": 1,
          "fields": [
            {
              "at": 2,
              "label": "Preconditions",
              "value": "Customer account ada@larkspur.test exists and is active."
            },
            {
              "at": 3,
              "label": "Test data",
              "list": [
                "Email: ada@larkspur.test",
                "Password: Lark!2026"
              ]
            },
            {
              "at": 4,
              "label": "Steps",
              "steps": [
                "Open larkspur.test/sign-in",
                "Enter the email",
                "Enter the password",
                "Select Sign in"
              ]
            },
            {
              "at": 5,
              "label": "Expected result",
              "value": "Account page opens with the heading “Welcome back, Ada”."
            }
          ]
        }
      ]
    },
    {
      "label": "Run it by hand",
      "cues": [
        "Now let's run it by hand. Step one: open the sign-in page.",
        "Steps two and three: type the email, then the password, exactly as the test data says.",
        "Step four: select Sign in.",
        "The page greets us: Welcome back, Ada. That matches the expected result.",
        "So we record the actual result, and mark the test case as passed."
      ],
      "layout": "split",
      "panes": [
        {
          "type": "browser",
          "url": "larkspur.test/sign-in",
          "urlAt": 0.3,
          "heading": "Sign in to Larkspur Books",
          "fields": [
            {
              "label": "Email",
              "value": "ada@larkspur.test",
              "from": 1.05,
              "to": 1.5
            },
            {
              "label": "Password",
              "value": "Lark!2026",
              "from": 1.55,
              "to": 1.95,
              "secret": true
            }
          ],
          "button": {
            "label": "Sign in",
            "at": 2.4
          },
          "result": {
            "at": 3,
            "heading": "Welcome back, Ada",
            "text": "Your orders · Wishlist · Account settings"
          },
          "brand": "Larkspur Books"
        },
        {
          "type": "card",
          "compact": true,
          "focus": true,
          "id": "TC-LOGIN-001",
          "title": "Run 1 · today",
          "titleAt": 0,
          "fields": [
            {
              "at": 0,
              "label": "Step",
              "progress": [
                "Open page",
                "Email",
                "Password",
                "Sign in"
              ],
              "marks": [
                0.3,
                1.5,
                1.95,
                2.4
              ]
            },
            {
              "at": 4,
              "label": "Actual result",
              "value": "Account page opened: “Welcome back, Ada”."
            },
            {
              "at": 4.5,
              "label": "Status",
              "chip": "pass"
            }
          ]
        }
      ]
    },
    {
      "label": "When a case fails",
      "cues": [
        "One test case rarely travels alone. Here's a small run of three sign-in cases.",
        "The second checks that a wrong password is rejected. It passes.",
        "The third expects the account to lock after five failed attempts. It didn't lock. That's a failure, and the actual result tells the developer exactly what went wrong.",
        "A failed test case isn't bad news. It's the test case doing its job: finding the bug before your customers do."
      ],
      "panes": [
        {
          "type": "table",
          "caption": "Test run · Sign-in · build 418",
          "cols": [
            "ID",
            "Title",
            "Actual result",
            "Status"
          ],
          "widths": [
            "16%",
            "36%",
            "34%",
            "14%"
          ],
          "rows": [
            {
              "at": 0.4,
              "cells": [
                "TC-LOGIN-001",
                "Sign-in succeeds with a valid email and password",
                "Account page opened",
                {
                  "chip": "pass"
                }
              ]
            },
            {
              "at": 1,
              "cells": [
                "TC-LOGIN-002",
                "Sign-in is rejected when the password is wrong",
                "Error shown, stayed on sign-in",
                {
                  "chip": "pass"
                }
              ]
            },
            {
              "at": 2,
              "cells": [
                "TC-LOGIN-003",
                "Account locks after 5 failed sign-in attempts",
                "6th attempt still allowed; no lock",
                {
                  "chip": "fail"
                }
              ]
            }
          ],
          "focus": [
            {
              "at": 1,
              "until": 2,
              "row": 1
            },
            {
              "at": 2,
              "until": 4,
              "row": 2
            }
          ]
        }
      ]
    },
    {
      "label": "Recap",
      "cues": [
        "Let's recap.",
        "A test case checks one behavior, and has an ID and a clear title.",
        "Preconditions, test data and steps make it repeatable.",
        "The expected result is decided before you run it. The actual result is recorded after.",
        "Next, we'll look at what separates a good test case from a weak one. The notes below include a template you can copy."
      ],
      "panes": [
        {
          "type": "bullets",
          "lead": "Recap",
          "check": true,
          "items": [
            {
              "at": 1,
              "text": "One behavior, with an ID and a clear title"
            },
            {
              "at": 2,
              "text": "Preconditions, test data and steps make it repeatable"
            },
            {
              "at": 3,
              "text": "Expected result before the run, actual result after"
            },
            {
              "at": 4,
              "text": "Next: good test cases, weak test cases",
              "dim": true
            }
          ]
        }
      ]
    }
  ]
});
