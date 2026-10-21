/* Casebook course content.
 *
 * Each lesson's video is a script: a list of scenes. A scene has narration cues
 * (spoken and captioned in order) and panes that draw the picture. Pane timings
 * are written in cue units: `at: 2` means "when cue 2 starts", `at: 2.5` means
 * halfway through cue 2. The player derives every duration from the narration,
 * so the visuals stay in step with the voice.
 */
window.Casebook = window.Casebook || {};

Casebook.course = {
  title: "Casebook",
  product: "Larkspur Books",
  modules: [
    { id: "m1", title: "Foundations", lessons: ["anatomy", "good-cases"] },
    { id: "m2", title: "Designing test cases", lessons: ["partitions", "negative"] },
    { id: "m3", title: "Automating and scaling", lessons: ["unit-tests", "suites"] },
  ],
  lessons: {},
};

/* ------------------------------------------------------------------------ */
/* Lesson 1                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons.anatomy = {
  title: "What is a test case?",
  summary: "The parts of a test case, built field by field and then run by hand against a real sign-in page.",
  poster: { scene: 2, p: 5.6 },
  scenes: [
    {
      label: "Welcome",
      cues: [
        "Welcome to Casebook. In this first lesson, we answer one question: what exactly is a test case?",
        "By the end, you'll be able to read one, write one, and run one by hand.",
      ],
      panes: [{ type: "title", kicker: "Lesson 1 · Foundations", heading: "What is a test case?", sub: "Read one. Write one. Run one.", subAt: 1 }],
    },
    {
      label: "A definition",
      cues: [
        "A test case is a written, repeatable check. It says: in this situation, when I do these exact things, this is what should happen.",
        "It has three jobs. First, it pins down a single behavior worth checking.",
        "Second, it's specific enough that anyone on the team gets the same result.",
        "And third, it records the outcome, so you know whether the software passed.",
      ],
      panes: [{
        type: "bullets",
        formula: ["In this situation", "when I do this", "this should happen"],
        items: [
          { at: 1, text: "Checks one behavior" },
          { at: 2, text: "Anyone can repeat it" },
          { at: 3, text: "Records the outcome" },
        ],
      }],
    },
    {
      label: "Anatomy",
      cues: [
        "Let's build one together. We're testing the sign-in page of Larkspur Books, a small online bookstore.",
        "Every test case gets an ID and a title. The title names the behavior: sign-in succeeds with a valid email and password.",
        "Preconditions describe the world before you start. Here, a customer account already exists.",
        "Test data lists the exact inputs. Not 'enter a valid email'. We write the actual address and password.",
        "Steps are numbered actions, one per line, written so a newcomer could follow them.",
        "And the expected result says precisely what should happen. Not 'it works', but the page and the message you'll see.",
      ],
      panes: [{
        type: "card", focus: true,
        id: "TC-LOGIN-001", title: "Sign-in succeeds with a valid email and password", titleAt: 1,
        fields: [
          { at: 2, label: "Preconditions", value: "Customer account ada@larkspur.test exists and is active." },
          { at: 3, label: "Test data", list: ["Email: ada@larkspur.test", "Password: Lark!2026"] },
          { at: 4, label: "Steps", steps: ["Open larkspur.test/sign-in", "Enter the email", "Enter the password", "Select Sign in"] },
          { at: 5, label: "Expected result", value: "Account page opens with the heading “Welcome back, Ada”." },
        ],
      }],
    },
    {
      label: "Run it by hand",
      layout: "split",
      cues: [
        "Now let's run it by hand. Step one: open the sign-in page.",
        "Steps two and three: type the email, then the password, exactly as the test data says.",
        "Step four: select Sign in.",
        "The page greets us: Welcome back, Ada. That matches the expected result.",
        "So we record the actual result, and mark the test case as passed.",
      ],
      panes: [
        {
          type: "browser", url: "larkspur.test/sign-in", urlAt: 0.3, heading: "Sign in to Larkspur Books",
          fields: [
            { label: "Email", value: "ada@larkspur.test", from: 1.05, to: 1.5 },
            { label: "Password", value: "Lark!2026", from: 1.55, to: 1.95, secret: true },
          ],
          button: { label: "Sign in", at: 2.4 },
          result: { at: 3, heading: "Welcome back, Ada", text: "Your orders · Wishlist · Account settings" },
        },
        {
          type: "card", compact: true, focus: true,
          id: "TC-LOGIN-001", title: "Run 1 · today", titleAt: 0,
          fields: [
            { at: 0, label: "Step", progress: ["Open page", "Email", "Password", "Sign in"], marks: [0.3, 1.5, 1.95, 2.4] },
            { at: 4, label: "Actual result", value: "Account page opened: “Welcome back, Ada”." },
            { at: 4.5, label: "Status", chip: "pass" },
          ],
        },
      ],
    },
    {
      label: "When a case fails",
      cues: [
        "One test case rarely travels alone. Here's a small run of three sign-in cases.",
        "The second checks that a wrong password is rejected. It passes.",
        "The third expects the account to lock after five failed attempts. It didn't lock. That's a failure, and the actual result tells the developer exactly what went wrong.",
        "A failed test case isn't bad news. It's the test case doing its job: finding the bug before your customers do.",
      ],
      panes: [{
        type: "table", caption: "Test run · Sign-in · build 418",
        cols: ["ID", "Title", "Actual result", "Status"],
        widths: ["16%", "36%", "34%", "14%"],
        rows: [
          { at: 0.4, cells: ["TC-LOGIN-001", "Sign-in succeeds with a valid email and password", "Account page opened", { chip: "pass" }] },
          { at: 1, cells: ["TC-LOGIN-002", "Sign-in is rejected when the password is wrong", "Error shown, stayed on sign-in", { chip: "pass" }] },
          { at: 2, cells: ["TC-LOGIN-003", "Account locks after 5 failed sign-in attempts", "6th attempt still allowed; no lock", { chip: "fail" }] },
        ],
        focus: [{ at: 1, until: 2, row: 1 }, { at: 2, until: 4, row: 2 }],
      }],
    },
    {
      label: "Recap",
      cues: [
        "Let's recap.",
        "A test case checks one behavior, and has an ID and a clear title.",
        "Preconditions, test data and steps make it repeatable.",
        "The expected result is decided before you run it. The actual result is recorded after.",
        "Next, we'll look at what separates a good test case from a weak one. The notes below include a template you can copy.",
      ],
      panes: [{
        type: "bullets", lead: "Recap", check: true,
        items: [
          { at: 1, text: "One behavior, with an ID and a clear title" },
          { at: 2, text: "Preconditions, test data and steps make it repeatable" },
          { at: 3, text: "Expected result before the run, actual result after" },
          { at: 4, text: "Next: good test cases, weak test cases", dim: true },
        ],
      }],
    },
  ],
  notes: `
<p class="lede">A test case is a written, repeatable check of one behavior. It states the situation, the exact actions, and the result you expect, so anyone can run it and reach the same verdict.</p>
<h3>The fields</h3>
<dl class="fields">
  <dt>ID</dt><dd>A stable, unique handle such as <code>TC-LOGIN-001</code>. Bug reports and test runs refer to it.</dd>
  <dt>Title</dt><dd>The behavior under test, phrased as an outcome: “Sign-in succeeds with a valid email and password.”</dd>
  <dt>Preconditions</dt><dd>What must be true before step 1: accounts, settings, data, the page you start on.</dd>
  <dt>Test data</dt><dd>The literal inputs. Write <code>ada@larkspur.test</code>, never “a valid email”.</dd>
  <dt>Steps</dt><dd>Numbered, one action each, specific enough for a newcomer.</dd>
  <dt>Expected result</dt><dd>What you will observe if the software is right. Decide it <em>before</em> running.</dd>
  <dt>Actual result</dt><dd>What really happened. Filled in during the run.</dd>
  <dt>Status</dt><dd>Pass, Fail, Blocked (could not run), or Not run.</dd>
</dl>
<h3>Template</h3>
<pre class="snippet"><code>ID:              TC-&lt;AREA&gt;-&lt;NNN&gt;
Title:           &lt;behavior&gt; when &lt;condition&gt;
Requirement:     REQ-&lt;NN&gt;
Preconditions:   - ...
Test data:       - ...
Steps:           1. ...
                 2. ...
Expected result: ...
Actual result:   (filled in during the run)
Status:          Pass | Fail | Blocked | Not run</code></pre>
<h3>Try it</h3>
<p>Write a test case for Larkspur Books' <strong>Sign out</strong> link. It should end the session and return the customer to the home page. Check your draft against the fields above: could a colleague who has never seen the site run it without asking you a question?</p>
<aside class="callout"><strong>Fail is useful.</strong> A failed case with a precise actual result (“6th attempt still allowed; no lock”) is half a bug report already.</aside>
`,
  quiz: [
    {
      q: "Which expected result is written well?",
      options: ["The login works.", "The account page opens with the heading “Welcome back, Ada”.", "No errors occur.", "The user is happy with the result."],
      answer: 1,
      why: "It names something you can observe and compare. The others leave room for two testers to disagree.",
    },
    {
      q: "When should the expected result be written?",
      options: ["After running the test, from what you saw", "Before running the test", "Only when the test fails", "By the developer after fixing a bug"],
      answer: 1,
      why: "If you write it afterwards, you tend to describe whatever happened, and bugs slip through as “expected”.",
    },
    {
      q: "A customer account must exist before step 1. Which field holds that?",
      options: ["Test data", "Steps", "Preconditions", "Actual result"],
      answer: 2,
      why: "Preconditions describe the state of the world before you start. Test data lists the inputs you type or send.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Lesson 2                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons["good-cases"] = {
  title: "Good test cases, weak test cases",
  summary: "Five habits that make a test case trustworthy, and the Given, When, Then shape many teams write them in.",
  poster: { scene: 1, p: 3.6 },
  scenes: [
    {
      label: "Introduction",
      cues: [
        "Two people can test the same feature and write very different test cases. In this lesson, we look at what makes one good.",
      ],
      panes: [{ type: "title", kicker: "Lesson 2 · Foundations", heading: "Good test cases, weak test cases", sub: "Five habits and one useful format", subAt: 0.5 }],
    },
    {
      label: "Weak vs strong",
      layout: "split",
      cues: [
        "Here's a weak test case. Test login. Log in with a user. It works.",
        "Which user? Which password? What does 'works' look like? Two testers could run this and disagree on the result.",
        "Here's the same idea, rewritten. The title names one behavior: sign-in is rejected when the password is wrong.",
        "The data is exact, and the expected result is something you can see: an error message, and you stay on the sign-in page.",
      ],
      panes: [
        {
          type: "card", compact: true, tag: { text: "Weak", kind: "fail" },
          id: "TC-?", title: "Test login", titleAt: 0,
          fields: [
            { at: 0.3, label: "Steps", value: "Log in with a user.", flag: { at: 1, text: "Which user? Which password?" } },
            { at: 0.6, label: "Expected result", value: "It works.", flag: { at: 1.4, text: "What would you see?" } },
          ],
        },
        {
          type: "card", compact: true, tag: { text: "Strong", kind: "pass" },
          id: "TC-LOGIN-002", title: "Sign-in is rejected when the password is wrong", titleAt: 2,
          fields: [
            { at: 2.5, label: "Test data", list: ["Email: ada@larkspur.test", "Password: lark2026 (wrong)"] },
            { at: 3, label: "Steps", steps: ["Open the sign-in page", "Enter the email and password", "Select Sign in"] },
            { at: 3.4, label: "Expected result", value: "“Email or password is incorrect” appears. Page stays on sign-in." },
          ],
        },
      ],
    },
    {
      label: "Five habits",
      cues: [
        "Good test cases share five habits.",
        "They're atomic: one behavior per case, so a failure points at one thing.",
        "They're independent: each case sets up its own preconditions, and doesn't rely on another case running first.",
        "They're repeatable: same inputs, same steps, same result, every time.",
        "They're specific: real values, observable outcomes, no 'should work'.",
        "And they're traceable: each one links back to the requirement it checks.",
      ],
      panes: [{
        type: "bullets", lead: "Five habits",
        items: [
          { at: 1, text: "Atomic", sub: "One behavior per case" },
          { at: 2, text: "Independent", sub: "Sets up its own world; any order works" },
          { at: 3, text: "Repeatable", sub: "Same inputs, same result, every time" },
          { at: 4, text: "Specific", sub: "Real values, observable outcomes" },
          { at: 5, text: "Traceable", sub: "Links to the requirement it checks" },
        ],
      }],
    },
    {
      label: "Given, When, Then",
      cues: [
        "Many teams write test cases in a Given, When, Then shape.",
        "Given sets up the world. That's your preconditions and test data.",
        "When is the single action under test.",
        "Then is the expected result. Keep it observable.",
        "This format reads like plain English, and later it can even drive automated tests.",
      ],
      panes: [{
        type: "code", file: "sign-in.feature", lang: "gherkin", typeTo: 0.95,
        code: `Feature: Sign in

  Scenario: Wrong password is rejected
    Given a customer account "ada@larkspur.test" exists
    And its password is "Lark!2026"
    When I sign in with password "lark2026"
    Then I see "Email or password is incorrect"
    And I remain on the sign-in page`,
        highlights: [
          { at: 1, until: 2, lines: [4, 5], note: "Given · preconditions + data" },
          { at: 2, until: 3, lines: [6], note: "When · the one action" },
          { at: 3, until: 4, lines: [7, 8], note: "Then · expected result" },
        ],
      }],
    },
    {
      label: "Recap",
      cues: [
        "To recap: replace vague words with real values and observable results.",
        "Keep each case atomic, independent, repeatable, specific and traceable.",
        "In the next module, we'll stop asking how to write a case, and start asking which cases to write.",
      ],
      panes: [{
        type: "bullets", lead: "Recap", check: true,
        items: [
          { at: 0, text: "Real values, observable results" },
          { at: 1, text: "Atomic · independent · repeatable · specific · traceable" },
          { at: 2, text: "Next: choosing which cases to write", dim: true },
        ],
      }],
    },
  ],
  notes: `
<p class="lede">A good test case gives the same verdict no matter who runs it, and when it fails, it points at one thing.</p>
<h3>Weak words to watch for</h3>
<table class="mini">
  <thead><tr><th>Weak</th><th>Rewrite as</th></tr></thead>
  <tbody>
    <tr><td>“a valid user”</td><td><code>ada@larkspur.test</code> / <code>Lark!2026</code></td></tr>
    <tr><td>“it works”</td><td>“The account page opens with ‘Welcome back, Ada’.”</td></tr>
    <tr><td>“should show an error”</td><td>“‘Email or password is incorrect’ appears under the form.”</td></tr>
    <tr><td>“test the cart”</td><td>One case per behavior: add, remove, change quantity…</td></tr>
  </tbody>
</table>
<h3>The five habits</h3>
<ol>
  <li><strong>Atomic.</strong> One behavior per case. If the title needs “and”, split it.</li>
  <li><strong>Independent.</strong> Never rely on another case running first; set up your own preconditions.</li>
  <li><strong>Repeatable.</strong> Fixed data, fixed steps. Avoid “today’s date” unless you pin it.</li>
  <li><strong>Specific.</strong> Values and observable outcomes, not intentions.</li>
  <li><strong>Traceable.</strong> Reference the requirement, such as <code>REQ-01</code>.</li>
</ol>
<h3>Given, When, Then</h3>
<pre class="snippet"><code>Scenario: Wrong password is rejected
  Given a customer account "ada@larkspur.test" exists
  And its password is "Lark!2026"
  When I sign in with password "lark2026"
  Then I see "Email or password is incorrect"
  And I remain on the sign-in page</code></pre>
<p>Keep exactly one <strong>When</strong> per scenario. Two actions usually means two scenarios.</p>
<h3>Try it</h3>
<p>Rewrite this weak case: <em>“Check that search works.”</em> Pick one behavior (for example, searching “Middlemarch” lists that title first) and write it in Given, When, Then form.</p>
`,
  quiz: [
    {
      q: "A title reads “Add to cart and checkout and apply coupon”. Which habit does it break?",
      options: ["Traceable", "Atomic", "Repeatable", "None, it is fine"],
      answer: 1,
      why: "Three behaviors in one case means a failure doesn't tell you which one broke. Split it into three cases.",
    },
    {
      q: "Case B only passes if case A ran first and created an order. What should change?",
      options: ["Always run A before B", "Merge A and B into one case", "B sets up its own order in its preconditions", "Delete case B"],
      answer: 2,
      why: "Independent cases can run in any order, alone or in parallel. B should create the order it needs.",
    },
    {
      q: "In Given, When, Then, where does the expected result go?",
      options: ["Given", "When", "Then", "Feature"],
      answer: 2,
      why: "Given is the setup, When is the one action, Then is what you expect to observe.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Lesson 3                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons.partitions = {
  title: "Partitions and boundaries",
  summary: "Equivalence partitioning and boundary value analysis: a few well-chosen inputs instead of thousands.",
  poster: { scene: 2, p: 3.8 },
  scenes: [
    {
      label: "Introduction",
      cues: ["Which inputs should you test? In this lesson, two techniques that turn thousands of possible inputs into a handful of good ones."],
      panes: [{ type: "title", kicker: "Lesson 3 · Designing test cases", heading: "Partitions and boundaries", sub: "Choose inputs on purpose", subAt: 0.5 }],
    },
    {
      label: "Too many inputs",
      cues: [
        "The cart at Larkspur Books lets you order between one and ten copies of a book.",
        "You can't test every possible number. So how do you choose?",
        "Group inputs that the software should treat the same way. These groups are called equivalence partitions.",
      ],
      panes: [{
        type: "numberline", heading: "Quantity field · accepts 1 to 10", min: -2, max: 16, valid: [1, 10], partitionsAt: 2,
        points: [],
      }],
    },
    {
      label: "One from each group",
      cues: [
        "There are three partitions here: too few, a valid amount, and too many.",
        "Pick one representative from each. Zero for too few.",
        "Five for valid.",
        "And fifteen for too many. Three test cases cover three behaviors.",
      ],
      panes: [{
        type: "numberline", heading: "Quantity field · accepts 1 to 10", min: -2, max: 16, valid: [1, 10], partitionsAt: -1,
        points: [{ at: 1, v: 0 }, { at: 2, v: 5 }, { at: 3, v: 15 }],
      }],
    },
    {
      label: "Bugs live at the edges",
      layout: "stack",
      cues: [
        "But bugs love edges. A developer might type less-than where they meant less-than-or-equal.",
        "Boundary value analysis tests right at each edge, and just outside it.",
        "Zero and one at the bottom.",
        "Ten and eleven at the top.",
        "The code here says quantity less than ten. Only the test with exactly ten copies catches it.",
      ],
      panes: [
        {
          type: "numberline", heading: "Boundaries · test each edge and its neighbor", min: -1, max: 12, valid: [1, 10], partitionsAt: -1,
          points: [{ at: 2, v: 0 }, { at: 2.4, v: 1 }, { at: 3, v: 10, bug: 4 }, { at: 3.4, v: 11 }],
        },
        {
          type: "code", file: "cart.js", lang: "js", typeTo: 0.9,
          code: `function isValidQuantity(qty) {
  return qty >= 1 && qty < 10;
}`,
          highlights: [{ at: 4, until: 5, lines: [2], note: "Should be qty <= 10", bad: true }],
        },
      ],
    },
    {
      label: "The resulting cases",
      cues: [
        "Put it together, and you get a compact set of test cases.",
        "Each row has a reason to exist. Nothing is duplicated, and nothing obvious is missed.",
        "Use this whenever an input has a range: ages, prices, name lengths, dates.",
      ],
      panes: [{
        type: "table", caption: "Quantity field · derived test cases",
        cols: ["ID", "Quantity", "Why", "Expected"],
        widths: ["18%", "14%", "38%", "30%"],
        rows: [
          { at: 0.2, cells: ["TC-CART-001", "0", "Boundary, just below minimum", "Rejected"] },
          { at: 0.35, cells: ["TC-CART-002", "1", "Boundary, minimum", "Accepted"] },
          { at: 0.5, cells: ["TC-CART-003", "5", "Valid partition", "Accepted"] },
          { at: 0.65, cells: ["TC-CART-004", "10", "Boundary, maximum", "Accepted"] },
          { at: 0.8, cells: ["TC-CART-005", "11", "Boundary, just above maximum", "Rejected"] },
          { at: 0.95, cells: ["TC-CART-006", "15", "Invalid partition, too many", "Rejected"] },
        ],
      }],
    },
  ],
  notes: `
<p class="lede">Equivalence partitioning groups inputs the software should treat alike, so you test one from each group. Boundary value analysis adds the edges of each group, where off-by-one bugs hide.</p>
<h3>Step by step</h3>
<ol>
  <li>Find the rule: <em>quantity must be from 1 to 10</em>.</li>
  <li>List the partitions: below 1 (invalid), 1–10 (valid), above 10 (invalid).</li>
  <li>Pick one representative from each: 0, 5, 15.</li>
  <li>Add each boundary and its neighbor outside: 0 &amp; 1, 10 &amp; 11.</li>
  <li>Remove duplicates. You end with six cases.</li>
</ol>
<h3>Don't forget the other partitions</h3>
<p>Numbers are not the only invalid input. A quantity box can receive <code>-1</code>, <code>2.5</code>, <code>"three"</code>, or nothing at all. Each is its own partition with its own expected message. Lesson 4 covers these.</p>
<pre class="snippet"><code>// The bug from the video
function isValidQuantity(qty) {
  return qty &gt;= 1 &amp;&amp; qty &lt; 10;   // 10 is rejected
}
// Fixed
  return qty &gt;= 1 &amp;&amp; qty &lt;= 10;</code></pre>
<h3>Try it</h3>
<p>A Larkspur gift card can be loaded with $5 to $500, in whole dollars. List the partitions and boundary values, then write the expected result for each.</p>
`,
  quiz: [
    {
      q: "A field accepts ages 18 to 65. Which set covers all the boundaries?",
      options: ["18, 65", "17, 18, 65, 66", "0, 40, 100", "18, 30, 45, 65"],
      answer: 1,
      why: "Each edge plus its neighbor just outside: 17 and 18 at the bottom, 65 and 66 at the top.",
    },
    {
      q: "Why test only one value from the middle of a partition?",
      options: ["The software should treat every value in it the same way", "Middle values never have bugs", "It saves typing", "Testing tools allow one value per partition"],
      answer: 0,
      why: "That's what makes it an equivalence partition. If 5 works, 6 is very unlikely to behave differently.",
    },
    {
      q: "The code says qty < 10 but the rule is 1 to 10. Which test catches it?",
      options: ["Quantity 5", "Quantity 0", "Quantity 10", "Quantity 15"],
      answer: 2,
      why: "Only the exact maximum hits the wrong comparison. 5, 0 and 15 give the same answer either way.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Lesson 4                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons.negative = {
  title: "Beyond the happy path",
  summary: "Negative cases, edge cases, and decision tables for rules that combine.",
  poster: { scene: 2, p: 3.6 },
  scenes: [
    {
      label: "Introduction",
      cues: ["The happy path is the journey where everything goes right. Customers don't always stay on it."],
      panes: [{ type: "title", kicker: "Lesson 4 · Designing test cases", heading: "Beyond the happy path", sub: "Negative cases and decision tables", subAt: 0.5 }],
    },
    {
      label: "Negative cases",
      cues: [
        "Negative test cases check that the software handles bad input and misuse gracefully.",
        "Empty and missing values: a blank email field.",
        "Wrong types and formats: letters in a quantity box, or an email without an at sign.",
        "Extremes: a ten-thousand-character name, or a price of zero.",
        "And bad timing: double-clicking Pay, or a session that expires halfway through checkout.",
      ],
      panes: [{
        type: "bullets", lead: "Where things go wrong",
        items: [
          { at: 1, text: "Empty or missing", sub: "Email field left blank" },
          { at: 2, text: "Wrong type or format", sub: "“three” in Quantity · ada.larkspur.test" },
          { at: 3, text: "Extremes", sub: "10,000-character name · price of $0.00" },
          { at: 4, text: "Bad timing", sub: "Double-click Pay · session expires mid-checkout" },
        ],
      }],
    },
    {
      label: "Decision tables",
      cues: [
        "When rules combine, use a decision table. Here's the discount code SAVE10: ten percent off orders of twenty dollars or more.",
        "List each condition as a column, then every combination as a row.",
        "Valid code, not expired, cart of twenty dollars or more: the discount is applied.",
        "When a single condition fails, the customer should get a clear, different message.",
        "Each row becomes a test case, and gaps in the requirements jump out. What should an expired code on a small cart say? Ask before you test.",
      ],
      panes: [{
        type: "table", caption: "SAVE10 · 10% off orders of $20 or more",
        cols: ["Code known?", "Not expired?", "Cart ≥ $20?", "Expected"],
        widths: ["18%", "18%", "18%", "46%"],
        rows: [
          { at: 1.3, cells: [{ chip: "yes" }, { chip: "yes" }, { chip: "yes" }, "10% off applied"] },
          { at: 1.5, cells: [{ chip: "yes" }, { chip: "yes" }, { chip: "no" }, "“Add $X more to use SAVE10”"] },
          { at: 1.7, cells: [{ chip: "yes" }, { chip: "no" }, { chip: "yes" }, "“This code has expired”"] },
          { at: 1.9, cells: [{ chip: "yes" }, { chip: "no" }, { chip: "no" }, { chip: "gap", text: "Not specified" }] },
          { at: 2.1, cells: [{ chip: "no" }, "–", "–", "“We don't recognise that code”"] },
        ],
        focus: [{ at: 2, until: 3, row: 0 }, { at: 3, until: 4, row: 1 }, { at: 3.5, until: 4, row: 2 }, { at: 4.3, until: 5, row: 3 }],
      }],
    },
    {
      label: "Recap",
      cues: [
        "To recap: for every happy path, ask how it could go wrong.",
        "Check empty values, wrong formats, extremes and bad timing.",
        "And when conditions combine, a decision table finds the cases, and the gaps.",
      ],
      panes: [{
        type: "bullets", lead: "Recap", check: true,
        items: [
          { at: 0, text: "Every happy path has unhappy siblings" },
          { at: 1, text: "Empty · wrong format · extremes · bad timing" },
          { at: 2, text: "Decision tables find cases and gaps" },
        ],
      }],
    },
  ],
  notes: `
<p class="lede">Negative test cases prove the software fails gracefully: a clear message, no crash, no corrupted data. Most real bugs live here.</p>
<h3>A checklist for any input</h3>
<ul>
  <li><strong>Empty:</strong> blank, whitespace only, missing entirely.</li>
  <li><strong>Format:</strong> wrong type, wrong pattern, leading zeros, unexpected characters (<code>' " &lt; &gt;</code>, emoji, accents).</li>
  <li><strong>Size:</strong> zero, negative, huge, very long text.</li>
  <li><strong>Timing:</strong> double submit, back button, expired session, two tabs at once.</li>
  <li><strong>Permissions:</strong> signed out, wrong account, admin-only pages.</li>
</ul>
<h3>Decision tables</h3>
<p>Write each condition as a column and list every combination. With three yes/no conditions you get up to eight rows; collapse rows where one condition decides the outcome on its own (an unknown code fails whatever the cart holds).</p>
<table class="mini">
  <thead><tr><th>Known</th><th>Not expired</th><th>≥ $20</th><th>Expected</th></tr></thead>
  <tbody>
    <tr><td>Y</td><td>Y</td><td>Y</td><td>10% off</td></tr>
    <tr><td>Y</td><td>Y</td><td>N</td><td>“Add $X more…”</td></tr>
    <tr><td>Y</td><td>N</td><td>Y</td><td>“This code has expired”</td></tr>
    <tr><td>Y</td><td>N</td><td>N</td><td><em>Ask the product owner</em></td></tr>
    <tr><td>N</td><td>–</td><td>–</td><td>“We don't recognise that code”</td></tr>
  </tbody>
</table>
<aside class="callout"><strong>A gap is a finding.</strong> When the table shows a combination nobody specified, raise it before testing. That question is cheaper now than a bug later.</aside>
<h3>Try it</h3>
<p>Larkspur offers free delivery for members, or for anyone spending $50 or more, but never to overseas addresses. Build the decision table.</p>
`,
  quiz: [
    {
      q: "Which is a negative test case for the email field?",
      options: ["ada@larkspur.test is accepted", "ada.larkspur.test shows “Enter a valid email”", "The field has a label", "The page loads in under a second"],
      answer: 1,
      why: "It feeds deliberately bad input and checks that the software rejects it clearly.",
    },
    {
      q: "Three yes/no conditions combine. How many rows can the full decision table have?",
      options: ["3", "6", "8", "9"],
      answer: 2,
      why: "Each condition doubles the combinations: 2 × 2 × 2 = 8. Some rows may collapse.",
    },
    {
      q: "A decision table row has no specified outcome. What should you do?",
      options: ["Skip that row", "Decide the outcome yourself", "Ask the product owner before testing", "Mark it as passed"],
      answer: 2,
      why: "It's a gap in the requirements. Raising it is part of testing.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Lesson 5                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons["unit-tests"] = {
  title: "From test case to automated test",
  summary: "Turn a written test case into code with Arrange, Act, Assert, then watch a boundary test catch a real bug.",
  poster: { scene: 3, p: 2.6 },
  scenes: [
    {
      label: "Introduction",
      cues: ["Manual test cases are a great start. When a check needs to run often, automate it. Let's turn a test case into code."],
      panes: [{ type: "title", kicker: "Lesson 5 · Automating", heading: "From test case to automated test", sub: "Arrange · Act · Assert", subAt: 0.5 }],
    },
    {
      label: "The code under test",
      cues: [
        "Here's the function behind the SAVE10 discount code.",
        "It takes an order total and a code, and returns the new total. Ten percent off, but only for orders of twenty dollars or more.",
      ],
      panes: [{
        type: "code", file: "discount.js", lang: "js", typeTo: 1.3,
        code: `export function applyDiscount(total, code) {
  if (code !== "SAVE10") return total;
  if (total <= 20) return total;
  return Math.round(total * 0.9 * 100) / 100;
}`,
      }],
    },
    {
      label: "Arrange, Act, Assert",
      cues: [
        "An automated test is a test case written as code.",
        "The test case title becomes the test name.",
        "Arrange sets up the preconditions and test data.",
        "Act performs the one step under test.",
        "Assert is the expected result. We expect the total to be thirty-six.",
      ],
      panes: [{
        type: "code", file: "discount.test.js", lang: "js", typeTo: 0.95,
        code: `import { test, expect } from "vitest";
import { applyDiscount } from "./discount.js";

test("SAVE10 takes 10% off a $40 order", () => {
  // Arrange
  const total = 40;
  // Act
  const result = applyDiscount(total, "SAVE10");
  // Assert
  expect(result).toBe(36);
});`,
        highlights: [
          { at: 1, until: 2, lines: [4], note: "Title → test name" },
          { at: 2, until: 3, lines: [5, 6], note: "Preconditions + test data" },
          { at: 3, until: 4, lines: [7, 8], note: "The one step" },
          { at: 4, until: 5, lines: [9, 10], note: "Expected result" },
        ],
      }],
    },
    {
      label: "Red, then green",
      layout: "split",
      cols: "1.4fr 1fr",
      cues: [
        "Let's add our boundary case from lesson three. An order of exactly twenty dollars should get the discount.",
        "Run the tests.",
        "Red. We expected eighteen, but received twenty. The function uses less-than-or-equal.",
        "Change it to less-than, and run again.",
        "Green. Every passing test is a test case that now runs itself, in milliseconds, on every change.",
      ],
      panes: [
        {
          type: "code", file: "discount.js", lang: "js", typeTo: -1,
          code: `export function applyDiscount(total, code) {
  if (code !== "SAVE10") return total;
  if (total <= 20) return total;
  return Math.round(total * 0.9 * 100) / 100;
}

// discount.test.js
test("SAVE10 applies at exactly $20", () => {
  expect(applyDiscount(20, "SAVE10")).toBe(18);
});`,
          appear: [{ at: 0.3, lines: [7, 8, 9, 10] }],
          swaps: [{ at: 3.3, line: 3, text: "  if (total < 20) return total;" }],
          highlights: [{ at: 2.3, until: 3.3, lines: [3], bad: true }, { at: 3.3, until: 4, lines: [3], good: true }],
        },
        {
          type: "terminal",
          lines: [
            { at: 1, until: 3, text: "$ npx vitest run", kind: "cmd" },
            { at: 1.4, until: 3, text: "✓ SAVE10 takes 10% off a $40 order", kind: "pass" },
            { at: 1.6, until: 3, text: "✗ SAVE10 applies at exactly $20", kind: "fail" },
            { at: 1.8, until: 3, text: "  Expected: 18", kind: "pass-dim" },
            { at: 1.8, until: 3, text: "  Received: 20", kind: "fail-dim" },
            { at: 2, until: 3, text: "Tests  1 failed | 1 passed (2)", kind: "sum-fail" },
            { at: 3.6, text: "$ npx vitest run", kind: "cmd" },
            { at: 3.9, text: "✓ SAVE10 takes 10% off a $40 order", kind: "pass" },
            { at: 4, text: "✓ SAVE10 applies at exactly $20", kind: "pass" },
            { at: 4.2, text: "Tests  2 passed (2) · 4 ms", kind: "sum-pass" },
          ],
        },
      ],
    },
    {
      label: "Recap",
      cues: [
        "To recap: the test name is the title, Arrange is the setup, Act is the step, and Assert is the expected result.",
        "Watch a test fail before you trust it to pass. Red, then green.",
      ],
      panes: [{
        type: "bullets", lead: "Recap", check: true,
        items: [
          { at: 0, text: "Title → name · Arrange · Act · Assert" },
          { at: 1, text: "See it fail, then make it pass" },
        ],
      }],
    },
  ],
  notes: `
<p class="lede">An automated test is a test case the computer runs for you. The mapping is direct: title to test name, preconditions and data to <em>Arrange</em>, the step to <em>Act</em>, the expected result to <em>Assert</em>.</p>
<h3>The mapping</h3>
<table class="mini">
  <thead><tr><th>Test case field</th><th>In code</th></tr></thead>
  <tbody>
    <tr><td>Title</td><td><code>test("SAVE10 takes 10% off a $40 order", …)</code></td></tr>
    <tr><td>Preconditions, test data</td><td>Arrange: <code>const total = 40;</code></td></tr>
    <tr><td>Steps</td><td>Act: <code>applyDiscount(total, "SAVE10")</code></td></tr>
    <tr><td>Expected result</td><td>Assert: <code>expect(result).toBe(36)</code></td></tr>
    <tr><td>Status</td><td>The runner's ✓ or ✗</td></tr>
  </tbody>
</table>
<h3>Run it yourself</h3>
<pre class="snippet"><code>npm install --save-dev vitest
npx vitest run</code></pre>
<pre class="snippet"><code>// discount.test.js
import { test, expect } from "vitest";
import { applyDiscount } from "./discount.js";

test.each([
  [19.99, 19.99],  // just below the boundary
  [20, 18],        // the boundary
  [40, 36],        // valid partition
])("SAVE10 on $%s gives $%s", (total, expected) =&gt; {
  expect(applyDiscount(total, "SAVE10")).toBe(expected);
});

test("unknown codes leave the total alone", () =&gt; {
  expect(applyDiscount(40, "SAVE99")).toBe(40);
});</code></pre>
<p><code>test.each</code> turns a table of inputs, like the one from lesson 3, into one test per row.</p>
<aside class="callout"><strong>Red first.</strong> A test you have never seen fail might not be testing anything. Break the code on purpose once and confirm the test goes red.</aside>
`,
  quiz: [
    {
      q: "Which part of an automated test holds the expected result?",
      options: ["Arrange", "Act", "Assert", "The import lines"],
      answer: 2,
      why: "expect(...).toBe(...) is the expected result, checked automatically.",
    },
    {
      q: "Why watch a new test fail before making it pass?",
      options: ["It's required by the test runner", "To prove the test can detect the bug", "Failing tests run faster", "To fill the report"],
      answer: 1,
      why: "If the test never goes red, it may not be checking what you think.",
    },
    {
      q: "applyDiscount(20, \"SAVE10\") returned 20, but the rule says $20 or more gets 10% off. What's the likely bug?",
      options: ["Rounding", "The code check is wrong", "It uses total <= 20 instead of total < 20", "The test imports the wrong file"],
      answer: 2,
      why: "Returning early when total <= 20 skips the discount at exactly $20. The boundary test exposes it.",
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Lesson 6                                                                  */
/* ------------------------------------------------------------------------ */
Casebook.course.lessons.suites = {
  title: "Organizing a test suite",
  summary: "The test pyramid, traceability to requirements, and keeping a growing suite healthy.",
  poster: { scene: 1, p: 3.6 },
  scenes: [
    {
      label: "The test pyramid",
      cues: [
        "As test cases pile up, structure matters. A common guide is the test pyramid.",
        "At the base, many fast unit tests. They check small pieces of logic, like applyDiscount.",
        "In the middle, fewer integration tests. They check pieces working together, like the cart saving to the database.",
        "At the top, a handful of end-to-end tests. They drive the real app like a customer would, like our sign-in test case.",
        "Higher tests are slower and more brittle. Keep them few, and save them for the journeys that matter most.",
      ],
      panes: [{
        type: "pyramid",
        layers: [
          { at: 3, label: "End-to-end", sub: "Sign in, check out · seconds each", count: "~10" },
          { at: 2, label: "Integration", sub: "Cart + database · ~100 ms each", count: "~50" },
          { at: 1, label: "Unit", sub: "applyDiscount, isValidQuantity · ~1 ms each", count: "~400" },
        ],
        axisAt: 4,
      }],
    },
    {
      label: "Traceability",
      cues: [
        "Link test cases to requirements. This is a traceability matrix.",
        "Each requirement lists the test cases that check it.",
        "A requirement with no test cases is a gap in your testing.",
        "And a test case with no requirement may be testing something nobody asked for.",
      ],
      panes: [{
        type: "table", caption: "Traceability · Larkspur Books",
        cols: ["Requirement", "Test cases", "Coverage"],
        widths: ["46%", "32%", "22%"],
        rows: [
          { at: 1, cells: ["REQ-01 · Sign in with email and password", "TC-LOGIN-001, 002", { chip: "pass", text: "Covered" }] },
          { at: 1.3, cells: ["REQ-02 · Lock account after 5 failed attempts", "TC-LOGIN-003", { chip: "fail", text: "Failing" }] },
          { at: 1.6, cells: ["REQ-03 · Order 1 to 10 copies", "TC-CART-001 … 006", { chip: "pass", text: "Covered" }] },
          { at: 2, cells: ["REQ-04 · Reset password by email", "—", { chip: "gap", text: "No tests" }] },
          { at: 3, cells: ["—", "TC-UI-019 · Logo spins on hover", { chip: "warn", text: "Orphan" }] },
        ],
        focus: [{ at: 2, until: 3, row: 3 }, { at: 3, until: 4, row: 4 }],
      }],
    },
    {
      label: "Keep it healthy",
      cues: [
        "Finally, keep the suite healthy.",
        "Name tests by behavior, so a failure reads like a bug report.",
        "Fix or remove flaky tests quickly. A test that fails at random teaches everyone to ignore red.",
        "And when a requirement changes, update its test cases in the same change.",
      ],
      panes: [{
        type: "bullets", lead: "Suite hygiene",
        items: [
          { at: 1, text: "Name by behavior", sub: "“Account locks after 5 failed attempts”, not “test3”" },
          { at: 2, text: "No flaky tests", sub: "Random red teaches people to ignore red" },
          { at: 3, text: "Change together", sub: "Requirement and test cases in the same change" },
        ],
      }],
    },
    {
      label: "Course wrap-up",
      cues: [
        "That's the course. You can now write test cases, choose them with partitions and boundaries, cover the unhappy paths, automate them, and organize a suite.",
        "Go find some bugs.",
      ],
      panes: [{ type: "title", kicker: "Course complete", heading: "Go find some bugs.", sub: "Write · design · automate · organize", subAt: 0.6 }],
    },
  ],
  notes: `
<p class="lede">A suite is only useful if people trust it and can find their way around it. Shape it like a pyramid, trace it to requirements, and keep it free of noise.</p>
<h3>The pyramid</h3>
<ul>
  <li><strong>Unit</strong>: one function or class, no network or database. Milliseconds. Hundreds of them.</li>
  <li><strong>Integration</strong>: a few real pieces together, such as the cart and its database. Fewer.</li>
  <li><strong>End-to-end</strong>: the whole app through the browser, like a customer. A handful, for critical journeys.</li>
</ul>
<p>Push each check as low as it can go. The boundary rules from lesson 3 belong in unit tests; “a customer can buy a book” belongs at the top.</p>
<h3>Traceability matrix</h3>
<p>Keep a table of requirement → test cases, or tag tests with requirement IDs and generate it. Review it for two things: requirements with no cases (gaps) and cases with no requirement (orphans).</p>
<h3>Keeping it healthy</h3>
<ul>
  <li><strong>Names:</strong> describe behavior. A failing test name should read like a bug title.</li>
  <li><strong>Flaky tests:</strong> quarantine is a last resort; find the cause (timing, shared data, order dependence) and fix it.</li>
  <li><strong>Ownership:</strong> when a requirement changes, its cases change in the same pull request.</li>
  <li><strong>Prune:</strong> delete cases that duplicate others or test removed features.</li>
</ul>
<aside class="callout"><strong>Where to go next.</strong> Pick one feature you work on, write its traceability table, and fill the first gap you find.</aside>
`,
  quiz: [
    {
      q: "Where should most of your automated tests sit in the pyramid?",
      options: ["End-to-end", "Integration", "Unit", "Spread evenly"],
      answer: 2,
      why: "Unit tests are fast and precise, so they make up the wide base.",
    },
    {
      q: "A requirement has no test cases linked to it. What is that called?",
      options: ["An orphan", "A gap", "A flake", "A regression"],
      answer: 1,
      why: "It's a coverage gap. An orphan is the reverse: a test case with no requirement.",
    },
    {
      q: "A test fails about one run in ten with no code change. What should you do?",
      options: ["Re-run until it passes", "Ignore it", "Find and fix the cause, or remove it", "Add more retries"],
      answer: 2,
      why: "Flaky tests erode trust in the whole suite. Fix the cause (often timing or shared data) or remove the test.",
    },
  ],
};

/* Flat lesson order with module info, used for numbering and next/previous. */
Casebook.order = [];
Casebook.course.modules.forEach(function (m, mi) {
  m.lessons.forEach(function (id) {
    var lesson = Casebook.course.lessons[id];
    lesson.id = id;
    lesson.module = m;
    lesson.moduleIndex = mi;
    lesson.number = Casebook.order.length + 1;
    Casebook.order.push(lesson);
  });
});
