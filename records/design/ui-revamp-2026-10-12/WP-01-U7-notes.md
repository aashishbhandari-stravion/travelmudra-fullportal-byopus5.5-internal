# WP-01 U7: test coverage for the "Not proven" items of the acceptance run (notes)

Lane `ui-revamp-2026-10-12`, 13 October 2026. Implementer: Claude (Sonnet 5.5) subagent. The architect
integrates and commits. Scope: tests only. No file under `src/` or `migrations/` changed, and no existing
file changed. Basis: the working tree of the lane at the time of the run (it holds the uncommitted
work of other engineers).

## 1. New files

| File | Kind | Tests |
|---|---|---|
| `test/unit/web/access-states.test.ts` | BFF in front of a scripted core | 8 |
| `test/system/sign-in-states.test.ts` | three instances, real core | 5 |
| `test/ui/status-axe.test.ts` | browser (Chromium, axe) | 34 (1 + 4 sweeps with 28 page checks + 1) |

## 2. Map from item to test

| Item | File | Test title (describe > it) |
|---|---|---|
| A15 | access-states | "a person with two contexts" > "lists both contexts and marks the current one; a switch changes the rail and the landing link, and changes nothing at core"; "opens a page of the first context by its address while the second context is active"; "gives a person with one context no selector, and no page of a context they do not hold" |
| A23 | access-states | "a sign-out whose acknowledgement is lost" > "signs this browser out at once and reads no session on the next page load"; "does the same when core refuses the sign-out for capacity: ..." |
| A31 | sign-in-states | "a code request for a travel agent address" > "gets one answer for an active, an unknown, a suspended and a pending account, and only the active account is mailed" |
| A37 part 2 | sign-in-states | "a mail provider that refuses a sign-in code after issuance" > "answers the eligible and the unknown address alike before and after the failure; the failure shows only in the mail task's records" |
| A56 | sign-in-states | "a travel agent's address change completed in one of two browsers" > "lands the browser that completed it on sign-in with the new-address notice, the other on the generic session-ended notice, and sends the old address nothing" |
| A66 (T part) | sign-in-states | "a code request for a staff address" > "gets one answer for an active, an unknown and a suspended account, mails only the active one, and the suspended account signs in again once restored" |
| A70 | access-states | "the account page when its read fails" > "shows an error state with no account fact for every failure of the read, never \"Not set up\""; "shows no account page for a refusal either: ..." |
| A85 | access-states | "the operation status page read again after the original resolved" > "reads the same reference at the same address, shows the final result, and puts it first after the heading" |
| A128 | status-axe | "status documents" > the four sweeps "desktop 1440px, light/dark" and "mobile 390px, light/dark" (7 documents each: maintenance for the travel agent, operations and administration surfaces, and four other status documents); "every maintenance document shows its state, the environment label and no way to act" |
| V23 B4 | sign-in-states | "a projection outage" > "lets a travel agent sign out and sign in again: identity does not depend on a projection" |

What each test proves, beyond its title:

- A15. Fixture: a scripted core answers a session with the surfaces `ops` and `admin`. The selector lists
  both, marks the current one and links each landing page. Rail and brand link follow the page's context.
  Core receives no command and the same session token on every read. `/home` gives the same landing page
  before and after (no active context is kept). A session with one surface gets no selector and a 404
  no-access page for the other context.
- A23. The sign-out command answers `outcome_unknown`. The test asserts: 303 to `?signed_out=1`,
  `Clear-Site-Data: "cache"`, the cookie gone, one `iam.sign_out` with scope `this`, the "You are signed
  out." notice, no private text, and a next page load that sends core no token and redirects to sign-in
  without a session-ended notice.
- A31 and A66. The setup uses the SuperAdmin pages (create account, suspend, restore) and restores the
  accounts in a `finally` block. The test compares status, location, cookie names and the normalized code
  page of each answer. It counts mail tasks (+1) and decoy challenges (+3 for travel agents), waits for
  the one mail of the active address as the positive control, and asserts that the other addresses have no
  mail. Staff: the suspended operator signs in with both codes after the restore.
- A37 part 2. Core restarts with `mail.transport_failed` armed once for `ta_sign_in_otp`. The test asserts
  equal answers for the eligible and the unknown address before and after the refusal. It asserts that
  the code's mail state becomes `failed` with its delivery copy wiped, that the mail task finished with
  result `failed`, that no mail reached the mailbox, and that the code page mentions no mail failure.
- A56. Two sessions of one account. After the change the completing browser gets
  `/sign-in?email_changed=1` and the exact notice. The other browser gets
  `/sign-in?session_ended=1&next=...` and exactly the generic notice, with no reason. The old address
  gets the unknown-address answer and no mail task.
- A70. Whole-read failures of `iam.account_page` (five categories) give the product's own error page for
  the category, its HTTP status, and no account fact. A control read of an account without an
  authenticator shows "Not set up", so the assertions can fail.
- A85. The "Check status" link names the same address. The reload reads core again and shows "Request
  recorded". No element opens and no text appears between the heading and the status region, in both
  states. No `autofocus`, empty polite region.
- A128. All maintenance documents have zero serious or critical axe violations at 1440 and 390 px in
  both colour schemes. The run printed no diagnostic for minor or moderate violations, so their count is 0.
- V23 B4. Core restarts with `projector.stall` armed for every projector. The test waits for the health
  state `degraded`. Then the travel agent signs out, and the old token is replayed from another browser to
  prove that core ended the session. A new sign-in succeeds while the views are still behind.

## 3. How each test was checked to fail

I copied the working tree to a scratch directory (outside the repository), seeded one defect per copy
and ran the new file there. Result: every defect failed the named tests. The product files in the
repository are unchanged.

| Seeded defect (scratch copy only) | Tests that failed |
|---|---|
| The sign-out route no longer clears the cookie | both A23 tests |
| The account route catches a failed read and renders "Not set up" | both A70 tests |
| The BFF lets a session open only its first surface | the first two A15 tests |
| A paragraph is inserted between the heading and the operation status region | the A85 test |
| A suspended account gets a validation refusal at code request | the A31 test and the A66 test |
| The email-change redirect no longer carries the `email_changed` marker | the A56 test |
| The mail task does not record a `failed` result | the A37 part 2 test (timeout after 60 s) |
| `iam.sign_out` is marked privileged (refused while the audit record is behind) | the V23 B4 test, at the replay of the old token |
| `iam.request_ta_otp` is marked privileged | the V23 B4 test, at the new sign-in |
| axe configuration | a control page with a missing image alternative and low contrast gives `image-alt` (critical) and `color-contrast` (serious) with the same tags |

Not seeded: the second-browser half of A56 (the `session_ended` marker comes from the BFF session gate,
and the exact location is asserted), the staff variant of the A128 pages (same sweep, same assertions).

The first run of V23 B4 did not catch the privileged sign-out. The reason: the BFF always clears the
cookie for scope `this`, so the page looked signed out whatever core answered. The replay of the old
token closes that gap.

## 4. Results

| Check | Result |
|---|---|
| `npm run typecheck` | The new files have no error. The run shows 7 errors in files of other engineers (`src/apps/shared/core/ta.ts`, `test/unit/web/ta-home.test.ts`, `test/unit/web/applications-list.test.ts`). |
| `npx eslint` on the three files | clean |
| `node --test test/unit/web/access-states.test.ts` | 8 of 8 |
| `TMPDIR=/tmp/w1u7 node --test --test-concurrency=1 --test-global-setup=test/support/global-setup.ts test/system/sign-in-states.test.ts` | 5 of 5 (about 50 s) |
| `node --test --test-concurrency=1 test/unit/web/access-states.test.ts test/ui/status-axe.test.ts` (the way `test:ui` runs its files) | 42 of 42 |

## 5. Findings and notes for the architect

| ID | Rank | Item | Finding and scenario |
|---|---|---|---|
| U7-1 | P2 | A37 part 2 | The acceptance row says "a failed mail task with its reason category". The product records a definite provider refusal as a finished task (`succeeded`, result `mailState: failed`) and sets the code's mail state to `failed`. `last_error_category` stays empty, because a refusal is a result and not an exception. Scenario: an operator looks for a failed task with a category and finds none. Proposal: reword the row to "the code's mail state is `failed` and the task result says so". No product change. |
| U7-2 | P2 | V23 B4, A23 | A plain sign-out always shows "You are signed out." and clears the cookie, also when core refused the command or did not answer. The session then lives at core until idle expiry (travel agent 30 minutes, staff 15 minutes). Scenario: a person signs out on a shared computer during a core outage; nothing reaches the browser, but a token copied earlier still works. The design chooses this (route comment, and the accepted A23 text). "Sign out everywhere" says "unconfirmed" in this case; the plain sign-out does not. Test coverage: the V23 B4 test replays the old token after a successful sign-out. |
| U7-3 | note | A85 | The "updates in place" branch of the row has no product behaviour: "Check status" reloads the page. The test covers the reload branch only. A100 stays "Not proven" until a page updates a result in place. |
| U7-4 | note | A15 | No synthetic account holds two contexts, so no system test is possible. The test uses a scripted core and states the fixture in its title. |
| U7-5 | note | A31, A66 | The setup uses `/admin/accounts/new`, `/admin/accounts/:id/suspend` and `/restore` with the field `reason`, as `test/system/ported-pages.test.ts` does. Another engineer rewrites the account pages in this tree (`src/apps/staff/accounts/`, untracked). If a form action or field name changes, both tests fail in their setup, not in their assertions. |
| U7-6 | note | all system tests | The tests add no sign-in code, enrolment code, authenticator key or session token to any output. Codes are read in memory by the existing helpers. The V23 B4 test holds one session token in memory for the replay and never prints it. |
