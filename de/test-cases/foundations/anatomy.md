# Lektion 1.1: Was ist ein Testfall?

Testfälle schreiben · Kapitel 1: Grundlagen · 15 Min.

> Die Teile eines Testfalls, Feld für Feld aufgebaut und dann von Hand gegen eine echte Anmeldeseite ausgeführt.

*Diese Lektion ist noch nicht auf de übersetzt, daher lesen Sie den englischen Text. Titel und Navigation sind übersetzt.*

**Sie werden können:**
- Name the fields of a test case and what each is for
- Write a test case precise enough for anyone to repeat
- Run a test case by hand and record the result

## Transkript: What is a test case? (2:56)

**0:00 Welcome.** Welcome to Writing Test Cases. In this first lesson, we answer one question: what exactly is a test case? By the end, you'll be able to read one, write one, and run one by hand.

**0:15 A definition.** A test case is a written, repeatable check. It says: in this situation, when I do these exact things, this is what should happen. It has three jobs. First, it pins down a single behavior worth checking. Second, it's specific enough that anyone on the team gets the same result. And third, it records the outcome, so you know whether the software passed.

**0:43 Anatomy.** Let's build one together. We're testing the sign-in page of Larkspur Books, a small online bookstore. Every test case gets an ID and a title. The title names the behavior: sign-in succeeds with a valid email and password. Preconditions describe the world before you start. Here, a customer account already exists. Test data lists the exact inputs. Not 'enter a valid email'. We write the actual address and password. Steps are numbered actions, one per line, written so a newcomer could follow them. And the expected result says precisely what should happen. Not 'it works', but the page and the message you'll see.

**1:28 Run it by hand.** Now let's run it by hand. Step one: open the sign-in page. Steps two and three: type the email, then the password, exactly as the test data says. Step four: select Sign in. The page greets us: Welcome back, Ada. That matches the expected result. So we record the actual result, and mark the test case as passed.

**1:55 When a case fails.** One test case rarely travels alone. Here's a small run of three sign-in cases. The second checks that a wrong password is rejected. It passes. The third expects the account to lock after five failed attempts. It didn't lock. That's a failure, and the actual result tells the developer exactly what went wrong. A failed test case isn't bad news. It's the test case doing its job: finding the bug before your customers do.

**2:27 Recap.** Let's recap. A test case checks one behavior, and has an ID and a clear title. Preconditions, test data and steps make it repeatable. The expected result is decided before you run it. The actual result is recorded after. Next, we'll look at what separates a good test case from a weak one. The notes below include a template you can copy.

## Die Lektion

A test case is a written, repeatable check of one behavior. It states the situation, the exact actions, and the result you expect, so anyone can run it and reach the same verdict.

## The fields

| Field | What goes in it |
| --- | --- |
| **ID** | A stable, unique handle such as `TC-LOGIN-001`. Bug reports and test runs refer to it. |
| **Title** | The behavior under test, phrased as an outcome: “Sign-in succeeds with a valid email and password.” |
| **Preconditions** | What must be true before step 1: accounts, settings, data, the page you start on. |
| **Test data** | The literal inputs. Write `ada@larkspur.test`, never “a valid email”. |
| **Steps** | Numbered, one action each, specific enough for a newcomer. |
| **Expected result** | What you will observe if the software is right. Decide it *before* running. |
| **Actual result** | What really happened. Filled in during the run. |
| **Status** | Pass, Fail, Blocked (could not run), or Not run. |

## Template

```text
ID:              TC-<AREA>-<NNN>
Title:           <behavior> when <condition>
Requirement:     REQ-<NN>
Preconditions:   - ...
Test data:       - ...
Steps:           1. ...
                 2. ...
Expected result: ...
Actual result:   (filled in during the run)
Status:          Pass | Fail | Blocked | Not run
```

## Try it

Write a test case for Larkspur Books' **Sign out** link. It should end the session and return the customer to the home page. Check your draft against the fields above: could a colleague who has never seen the site run it without asking you a question?

> **Tipp.** **Fail is useful.** A failed case with a precise actual result (“6th attempt still allowed; no lock”) is half a bug report already.

## Quiz

1. Which expected result is written well?
   a. The login works.
   b. The account page opens with the heading “Welcome back, Ada”.
   c. No errors occur.
   d. The user is happy with the result.
   Answer: b. It names something you can observe and compare. The others leave room for two testers to disagree.
2. When should the expected result be written?
   a. After running the test, from what you saw
   b. Before running the test
   c. Only when the test fails
   d. By the developer after fixing a bug
   Answer: b. If you write it afterwards, you tend to describe whatever happened, and bugs slip through as “expected”.
3. A customer account must exist before step 1. Which field holds that?
   a. Test data
   b. Steps
   c. Preconditions
   d. Actual result
   Answer: c. Preconditions describe the state of the world before you start. Test data lists the inputs you type or send.

## Das Wichtigste

- A test case checks one behavior, with an ID and a clear title.
- Preconditions, test data and steps make it repeatable.
- Decide the expected result before running; record the actual result after.
- A failed test case with a precise actual result is half a bug report.

---

Weiter: [Lektion 1.2: Gute und schwache Testfälle](/demo/de/test-cases/foundations/good-cases.md)
