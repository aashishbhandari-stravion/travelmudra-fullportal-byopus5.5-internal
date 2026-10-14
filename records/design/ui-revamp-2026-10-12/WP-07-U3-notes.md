# WP-07 U3 notes: OP-03 return and flag

Unit U3 of WP-07. Author: the U3 engineer, 13 October 2026. Input for the architect's integration, unit U7 (wiring)
and the WP-09 build (U4 edits this unit's file). U3 commits nothing; the architect integrates. Base: lane commit
101eff1 with the uncommitted WP-07 U0 files. Binding inputs: `WP-07-design.md` §2.0, §2.3, §2.6, §2.11 to §2.13,
§7.1 (U3 row); `WP-07.md` §3 and §4.1 to §4.12 (F-14, F-15, F-33 apply here); `WP-09-design.md` §2.6, §3.1;
`WP-09.md` §3 (Q-W09-06).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/work/return-flag.ts` (new) | OP-03r and OP-03f pages, two GET routes, the two POST routes (moved copies of `ops.applications.return` and `ops.applications.flag`), receipts, refusal tables, re-render. |
| `scripts/dev/gallery/return-flag.ts` (new) | 10 gallery pages, `returnFlagGalleryPages()`; fixtures for the tests (problem report, return and flag holds, evidence, models, receipts). Not registered. |
| `test/unit/web/return-flag.test.ts` (new) | 31 tests (pages, states, labels, effect by lifecycle, receipts, refusals, gallery pages). |
| `test/unit/bff-return-flag.test.ts` (new) | 12 tests (routes against a scripted Core). |

No other file changed. The old copies in `src/apps/staff/core/ops.ts` stay (U7 removes them).

## 2. Pages and states

Both pages use `decisionPage` (CMP-25) with prefix `return` or `flag`. Order: receipt or unsent block → header
(breadcrumb, h1, "Read at", identifying facts) → Scope (lead, protected-state banner, status facts) → Evidence →
Effect → Your decision → visible review → buttons. No tabs.

Frame items 1 to 5 (design §2.3) are built in this file from `reading.ts`: header meta in the staff order (application
reference with copy, "Passport ending NN" with a hidden "number", service, kind, group, travel agent with "account
suspended", operator "You" or the name); banner from `protectedStateItems` (F-33 words); status facts `frameFacts`
(Progress, Outcome, Next from `actionPanelReading`, Stage, Editing, External acts, Readiness, Holds, Originals when
read, Delivery evidence when Core lists it).

| Page | States, first match | Form |
|---|---|---|
| OP-03r `/ops/applications/:id/return` | `support_view`; `not_assigned` ("Only the assigned operator takes this step. You can read this application."); `closed`; `with_ta` (draft: "They submit it when it is ready"; submitted: "They hand it back when it is corrected"); `return_open`; `not_editable`; `form` | `note` (textarea, 4 rows, maxlength 2000), `resolveProblemHoldId` (only while a problem report is open; optional; "Keep it open"; options "Reported [time] IST: [first 60 characters]"; never preselected), hidden `_rev.application` |
| OP-03f `/ops/applications/:id/flag` | `support_view`; `not_assigned`; `closed`; `flag_open` (waiting; or answered with the link "Resolve the flag"); `assistance` (known gap sentence); `with_ta`; `not_editable`; `form` | `note` (textarea, 4 rows, maxlength 2000) |

Return label by Core's editing state: "Return for TA review" while `assistance_in_progress`, else "Return to TA". h1
"Return to the travel agent: [applicant]" or "Return for the travel agent’s review: [applicant]". No text reads "Submit
for TA" (test).

Effect by lifecycle (F-14): approved help on a draft — "The travel agent reviews what you entered and submits it
themselves. Help never confirms or submits for them."; approved help on a submitted case — "The travel agent reviews
what you entered and hands the application back to you." and "You confirm readiness again before any filing
authorization or packet release."; ordinary submitted — design §2.6.1 text; ordinary draft — "submits it". Both
approved-help variants add "The approved help ends with this return." (Core marks the help `fulfilled`,
`holds.ts`).

Possibly filed (authorized, filing unknown, reconciliation exhausted): the form stays (D-W07-16) with the warning above
the fields; the effect and the receipt repeat that corrections are held.

Flag evidence: Core's gate blockers of the offers (`checklistBlockers`, gate codes only; the hidden fee act stays
hidden, F-02) as "[Gate words]. It stops [actions]."; readiness recorded by the previous operator (readiness
exception route); exception records on file; open holds. No line states a payment fact (F-05).

## 3. Routes (exported by `returnFlagRoutes()`)

| Route id | Method, path | Action | Command | Body limit |
|---|---|---|---|---|
| `ops.applications.return_form` (new) | GET `/ops/applications/:applicationId/return` | `operator.formal_return` | — | — |
| `ops.applications.return` (moved) | POST same path | `operator.formal_return` | `core.formal_return` | 32,768 |
| `ops.applications.flag_form` (new) | GET `/ops/applications/:applicationId/flag` | `operator.flag` | — | — |
| `ops.applications.flag` (moved) | POST same path | `operator.flag` | `core.flag` | 32,768 |

The body limit holds the largest valid note (2,000 characters at up to nine bytes each once form-encoded) plus the
other fields. The POSTs send every value whole: `inputRefusal` refuses input the contract does not take at its field
before any command (the old handler cut `resolveProblemHoldId` to 40 characters; the moved copy does not). Accepted:
303 to `…/return?done=returned&op=<key>` or `…/flag?done=flagged&op=<key>`. Refused: the page again at the POST address,
read now, every typed value kept, a new `_op`, `restorePath` = the GET page. Lost answer: 303 to
`/ops/operations/<key>` (shell default). `?from=applications` is kept on links when `/ops/applications` is served.

Reads: OP-03r `core.ops_case`, opt. `ops.case_work`, opt. `doc.application_evidence`; OP-03f `core.ops_case`, opt.
`ops.case_work`. All optional reads go through `optionalView`.

## 4. Receipt codes

| Code | Page | Expectation | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|
| `returned` | OP-03r | `application`, path id, `holdId` matches `ret_` id | "Returned to the travel agent" (one title for both labels, F-15) | the note and "Returned on" from the hold selected by the id | editing state; readiness; "corrections: Held until the act is reconciled" while possibly filed |
| `flagged` | OP-03f | `application`, path id, `holdId` matches `flg_` id | "Request recorded" (neutral: a resolution also answers a `flg_` id) | — | flag (open and waiting, answered, resolved) |

An edited address with the other page's code shows no receipt; another application's operation reads unchecked
(tests).

## 5. Decisions made in U3 (deviations for the record)

| ID | Decision | Reason |
|---|---|---|
| D-U3-01 | OP-03r also reads opt. `doc.application_evidence`; OP-03f also reads opt. `ops.case_work`. | Design evidence items need them: "documents needing the travel agent" (§2.6.1 item 3) and the Gate 1 first-work blocker, which lives in `caseWork.offers.startWork` (§2.6.2 item 3). |
| D-U3-02 | The banner and the status facts sit in the Scope block; the identifying facts are the header meta. | `decisionPage` owns the h1 and has no slot between header and scope; the identity band would add a second h1. |
| D-U3-03 | Refusal sentences of the closed table: missing note "Write what the travel agent must do." / "Write what needs a decision."; too long "Use at most 2,000 characters. Nothing was shortened: shorten it and send again."; `hold_not_applicable` (return) "The application cannot be returned in its current state. Nothing was recorded."; `control_blocked`/`hold_not_applicable` (flag) "A flag is possible only on an assigned application in ordinary work. No flag was sent."; `conflict_duplicate` "A flag is already open. No second flag was sent."; a chosen report no longer open (stale) "The problem report you chose is no longer open. Nothing was recorded."; others: category title, Core sentence, reference code. | Design §2.6 and §2.13 name the states, not every sentence. Draft copy (CR-09). |
| D-U3-04 | A refusal after which the page has no form shows the reason and "Your unsent values" read only (WP-06 pattern). | A refusal keeps what was sent. |
| D-U3-05 | The stale comparison rows: Editing and Open holds ("As this page showed …" / current), and the chosen problem report ("No longer open" / "Still open"). | No read carries the values the reader saw; nothing is shown as unknown. |
| D-U3-06 | Status fact "Next" reads "You: [step]" for the viewer's own step. | Design "You — [step]"; same meaning, plain punctuation. |

## 6. Hooks for WP-09 (U4 fills them; no WP-09 content is built here)

- `returnPage(…, { resolve })`: preselects a problem report only when the value equals an open `prb_` hold (tested). The
  GET route does not read `?resolve=` yet; WP-09 U4 adds the query read with the OP-02 link "Return to TA (closes the
  report)".
- `returnEvidence`: shows "Help request: [state]" only. WP-09 adds the request note, the information version and the
  history link.
- `returnReceiptBlock`: the current facts list. WP-09 adds "Help request: Ended".
- `returnEffect`: WP-09 may add "This ends the approved assistance, whether or not you entered information."
- `FLAG_KNOWN_GAP` repeats the text of `KNOWN_GAP_FIRST_WORK` in `reading.ts`, which is not exported. WP-09 U4 exports
  it and uses it here.

## 7. Items for U7 and the architect

1. **U7 wiring.** Register `returnFlagRoutes()` in `src/apps/staff/instance.ts`. Remove the old POSTs
   `ops.applications.return` and `ops.applications.flag` from `src/apps/staff/core/ops.ts` (same ids and paths) and the
   return and flag forms of the old case page (`caseActions`). Add two GET entries to `src/web/route-inventory.ts`:
   `/ops/applications/:applicationId/return` (`ops.applications.return_form`, `operator.formal_return`) and
   `/ops/applications/:applicationId/flag` (`ops.applications.flag_form`, `operator.flag`); audience and support-view
   flag as O03 (`op_asg`, `op_grant`; the pages show a reader without the assignment no form). POST rows O13 and O14
   stay.
2. **U7 system tests.** `test/system/core-pages.test.ts:289-297, 360`: read the return form from GET OP-03r; location
   `…/return?done=returned&op=…`. The flag's and return's carried-form entries leave the WP-07 carried-form test.
3. **Gallery.** Register `returnFlagGalleryPages()` in `scripts/dev/gallery-pages.ts` (10 pages).
4. **P2: one frame helper.** OP-03 builds frame items 1 to 5 itself (`frameHeader`, `banner`, `frameFacts`). When U2's
   frame lands, one shared helper avoids two wordings of the status facts.
5. **P1 for the Product Manager's alignment.** Checklist rows differ from the design, which governs: A39 (choices
   plus a required "Why", composed into one note) — the design has one `note` field; A44 ("Decision needed" prefilled,
   "Affected action", receipt "Flagged to a SuperAdmin") — the design has one `note` field and a neutral receipt
   (§2.11); A42 (1) wording "Say why the travel agent must correct it." — U3 uses "Write what the travel agent must
   do." to match the field label. Scenario: a live check of A39 or A44 fails against the built page. Likelihood: high
   at the V-proof run.

## 8. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree, 0 errors at the last run). |
| `npx eslint` on the four files | Clean. |
| `node --test test/unit/web/return-flag.test.ts test/unit/bff-return-flag.test.ts` | 43 pass (31 + 12). |
| `node --test "test/static/**/*.test.ts"` | 74 pass. The first run failed the policy scanner (`route_without_id`: route ids must be literals); fixed. |
| Local render of the 10 gallery pages (scratch script, product CSP, Playwright + axe) | Light and dark at the gallery viewports and 320 px: no horizontal overflow, no CSP violation, no script error, no serious or critical axe violation. |

Not run: `npm run test:ui` (the pages are not registered in the gallery), system tests (the routes are not wired).
