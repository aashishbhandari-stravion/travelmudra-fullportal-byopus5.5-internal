# WP-06 U5 notes: SA-07a service payment of one application (record and correct)

Unit U5 of WP-06. Author: the U5 engineer, 13 October 2026. Input for the architect's integration. U5 commits
nothing. Base: lane commit 101eff1 (U0 `admin-context.ts`, `servicePaymentText`). Binding inputs: `WP-06-design.md`
§1.4 row 7, §1.5, §2.0, §2.6, §2.8 (`recorded`, `corrected`), §2.9, §4.1; `WP-06.md` §3, D-02, D-05, D-09, D-10, D-20;
`WP-16-design.md` §1.8 AM-W16-01, §2.3, §2.9, §2.12 to §2.15; `WP-16.md` M-01, M-03, M-10; PLAN LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/payments/admin.ts` | `applicationPaymentsPage` and its private helpers rewritten. New exports: `EVIDENCE_ROW_LIMIT` (5), `CORRECTION_PAGE`, `SERVICE_PAYMENT_RECEIPT_CODES`, `servicePaymentReceiptExpectations`, `ServicePaymentReceipt`, `ApplicationPaymentsOptions`, `recordStatuses`, `entryProblems`; `EntryFormState` gains `evidenceRows`. `DONE` loses `recorded` and `corrected` (no flash on SA-07a). The other pages of the file are unchanged (`feeTable` kept for SA-07t). |
| `src/apps/staff/payments/routes.ts` | GET `admin.payments.application` reads the receipt (`readReceipt`). POST `admin.payments.record`: new `entryInput` (exported) reads every field whole; `receiptLocation(page, 'recorded' \| 'corrected', key)`; refusal re-render with `restorePath`; `bodyLimit` 8192 → 32,768. Other routes unchanged (`paiseField` kept for the ceiling routes). |
| `scripts/dev/gallery/service-payment.ts` (new) | `servicePaymentGalleryPages()`: 7 pages (`service-payment-new`, `-received`, `-not-received`, `-refused`, `-stale`, `-chain`, `-neutral`). Not registered. |
| `test/unit/web/service-payment-page.test.ts` (new) | 26 tests (page 20, route 6). |
| `test/system/payments-views.test.ts` | Lines 90 and 128: locations allow `&op=<key>`. Line 93: GET the location. Line 94: receipt title "Payment entry recorded" (the flash is gone). Two new assertions after line 128: the `corrected` receipt from real Core. |

## 2. Page (reading order, states)

Receipt (first in `main` after the local tabs) → header (breadcrumb "Money & exposure › Finance › [title]"; `h1`
"Service payment: [title or 'Application [reference]']"; meta Application with copyable reference, Travel agent
→ SA-07t, Application status in lifecycle words, Price in effect or "Not fixed until submitted" (draft) or "Not
available"; "Read at") → status facts (Service payment; Gate 1 for assignment; Gate 2 for the government submission;
Operator work authorized Yes/No/"Not available"; Payment follow-up "[o] open, [c] closed" or "None"; Government fee
records "[n]" or "None") → line "Gate 2 is separate: a Gate 1 exception never passes it." → action panel → completed
line (completed and items open) → "Record a payment entry" → carried "Correct the current entry" → "Payment entries"
(chain) → "Payment follow-up" → "Government fees paid by TravelMudra" → "Money actions not available".

- Gate words: Passed, Blocked, Passed by exception, Not applicable; `unknown` reads "Unavailable". No gate row
  states a conclusion for first work or reassignment (D-05).
- No computed amount: "Due from the travel agent" removed; every money value is a Core field with direction neutral.
- Record form: `recordStatuses` = both statuses (radio, none preselected) when no entry; "payment received" only
  (hidden `status`) when the current status is "not received"; no form otherwise. Evidence rows 0 to 4 (row 0
  visible, rows 1 to 4 in "Add more evidence", open when a row holds a value or a problem). Review list visible
  before the button. Buttons "Record payment entry" / "Record payment received".
- Refusal: error summary (form-level first, then field order) and each problem at its field; Core's evidence row n
  is mapped to the reader's form row through `evidenceRows`. Stale: CMP-14 (Payment status yours/current; Entries
  current). A form the page no longer offers: the refusal, "Your unsent values" read only, a disabled submit with its
  reason, "Review current information".
- Carried correction form: kept with its markup (`confirmDisclosure`, `refusalCallout`), now with the five evidence
  rows and the date hint "Changing only the date is not accepted as a correction now."; a `correction_no_change`
  refusal adds "A different payment date or reason alone is not accepted as a correction now." (D-09).
- D-20 link: "Correct entry #[n]" → `CORRECTION_PAGE` under the entries table only when `ctx.hasPage(CORRECTION_PAGE)`;
  the carried form shows only when that page is not registered (one replaces the other; never a link to a missing page).
- Entries: one row per entry, oldest first: "#[n] Record" / "#[n] Correction of entry #[m]", "Current" or "Replaced
  by entry #[k]" in text; payment date as an India calendar day; "Recorded after operator work".
- Follow-up rows: kind words → SA-07k; "Open" or "Closed" only (M-03); accountable SuperAdmin with "(not active)";
  "Opened [time]". Empty: "No payment follow-up for this application."
- Fees: staff fee words; five Core amounts; `payment_unknown` shows "Not known yet" in paid, liability and
  outstanding (never ₹0); "(as recorded)" on received and outstanding and in the recovered words (M-01); the source
  line (M-10). Notices under the table when the application has fee records: fee exclusion (route → SA-07t) and the
  fee-correction limitation (M-10, "No route in this release."). Always: refund and Accounts notices with "No route in
  this release." and the M-01 recovery sentence. No button, no form for any boundary.

## 3. Receipt codes

| Code | Expectation | Established by | Title | Recorded facts | Current |
|---|---|---|---|---|---|
| `recorded` | `application`, path id; `entryId` `pay_…`, `entryNo` integer, `status` an entry status, `openedException` null or `fex_…`, `closedExceptions` integer ≥ 0 | the entry with `entry_id = entryId` has kind `record` | Payment entry recorded | Entry #n; Status recorded; Amount stated; Evidence (that entry); follow-up items closed | service payment; Gate 1 for assignment; Gate 2; open payment follow-up items |
| `corrected` | as `recorded` | that entry has kind `correction` | Correction recorded | Entry #n, correction of entry #m; status; amount; evidence; follow-up opened (kind words → SA-07k, or "None"); closed | as `recorded` |
| neutral | the operation met the expectation, but the entry is absent or of the other kind (D-02) | — | Request recorded | none | as above |

An unchecked read renders the unchecked receipt. A refusal shows no receipt. No receipt from the address alone.

## 4. Handler (LD-17)

`entryInput` reads every field whole and every `evidence.<n>.<kind|id|note>` row (any index); a row with all three
empty is left out. Refused at the field with nothing sent and every value kept: more than 5 rows (`evidence`
`too_many`); kind > 40, id > 200, note > 200 characters (`too_long`); an amount `paiseFromRupees` cannot read
(`amountPaise`); a date that is not a calendar day (`eventAt`); a reason of 1 to 9 characters or over 1,000; an empty
status; an empty reason on a correction; a forged `kind` (> 16) or `correctsEntryId` (> 64) as form-level. Body limit
32,768 bytes: the largest valid form (5 rows of 200-character id and note, 1,000-character reason, all Devanagari)
encodes to about 28 KB (unit test). Core's field names are kept (`amountPaise`, `eventAt`, `evidence.<n>`), so both
refusals map through one table.

## 5. Decisions within the unit

| Decision | Reason |
|---|---|
| Gate 2 row labelled "Gate 2 for the government submission" | Core's read evaluates Gate 2 for `authorize_government_submission` (D-05 principle: label the fact Core establishes). |
| The `payment_evidence_required` sentence stays the existing one ("…an external reference or a document as evidence. An attestation can only accompany it.") | Same facts as the design's draft sentence; `payments-views.test.ts:84` pins it and is outside the lines assigned. |
| Price in effect only in the header meta, not repeated in the facts | Avoids two copies of one fact; the facts list carries the other money-block rows. |
| Fee notices only when the application has fee records | A fee notice without a fee is noise; refund and Accounts notices always show. |
| Carried form and link are exclusive, switched by registration | No link to a missing page; WP-16 needs no edit of SA-07a to replace the form. |

## 6. Items for U6 and the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Gallery registration | — | `servicePaymentGalleryPages()` is not in `scripts/dev/gallery-pages.ts`. | Register it. |
| Carried-form test (U6, design §7.2) | — | The SA-07a carried correction form exists only while `CORRECTION_PAGE` is not registered; the SA-07a boundaries are notices, not disabled buttons. | Render SA-07a with the inventory's pages; assert the form with `kind=correction` and the notices `#bn-refund`, `#bn-accounts` (and `#bn-fee-exclusion` with a fee). |
| Correction path | P2 | The brief names `/admin/applications/:id/payments/entries/:entryId/correct`; `WP-16-design.md` §1.3 names `/admin/applications/:id/payments/correct`. If WP-16 registers the design's path, SA-07a keeps the carried form and never shows the link. | Settle one path; `CORRECTION_PAGE` in `admin.ts` is the one constant to change. |
| `payments-views.test.ts:116` (U6) | — | Still assigns from the old case page; passes now (form still there). | U6 moves it to SA-03a as design §7.3 says. |
| Gate 2 "Unavailable" | P2 | In the system test, after assignment and a correction to "not received", SA-07a reads "Gate 2 for the government submission: Unavailable" for a TravelMudra-filed application. Core's read maps any evaluator error to `unknown` (`src/modules/payments/queries.ts`, `view`); the cause is not established. WP06-A64 expects a Gate 2 state. | Note for WP-07 (Gate 2); check whether the evaluator refuses the SuperAdmin actor for `authorize_government_submission`. |
| Amount format | P2 | `money()` prints "₹3,500.00"; the WP-06 checklist §0.2 says "₹3,500". | Outside U5's files; parked. |
| Other units' tree state | — | During U5 the static tree test reported `route_without_id` at `src/apps/staff/assignment/routes.ts:175` (U3), not a U5 file. | U3 fixes before integration. |

## 7. Checks run

- `npm run typecheck`: pass (final run; earlier runs showed transient errors in other units' test files).
- `npx eslint --max-warnings=0` on the five U5 files: pass.
- `node --test test/unit/web/service-payment-page.test.ts`: 26 tests, 26 pass.
- `node --test test/unit/web/routes.test.ts test/unit/web/csp.test.ts test/unit/web/components.test.ts`: 95 pass;
  `node --test test/unit/bff.test.ts`: 17 pass.
- `node --test "test/static/**/*.test.ts"`: 74 tests, 73 pass, 1 fail (U3's `assignment/routes.ts:175`, above).
- `TMPDIR=/tmp/w6u5 node --test --test-concurrency=1 --test-global-setup=test/support/global-setup.ts
  test/system/payments-views.test.ts`: 10 tests, 10 pass.
- Gallery pages rendered to text through a scratch script (reading order and copy checked). No browser, axe or
  screenshot run in this unit.
