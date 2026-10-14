# WP-16 design review: money follow-up and history

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-16 holds
commands that change money facts and their ownership: a payment correction that opens or closes a follow-up item in a
SuperAdmin's name, and the change of the accountable SuperAdmin; so a Codex design review applies).
Product base: lane repository at 34e875b (WP-01, WP-20, WP-02 and the first WP-03 units integrated). WP-06 to WP-15 are
designed or in design and not yet built; this design depends on their units named in §1.7 and amends three of them
(§1.8). This document writes no product code. Paths in `file:line` form are relative to the lane repository at 34e875b
unless they start with `REC/` (`internal/records/`) or `RM` (lane `research/route-map.md`). Code is read as committed
(`git show 34e875b:<path>`); the working tree was not read.

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 34e875b. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Five register commands (COMMAND-COVERAGE §3, §5.1, §6 CC-08): `pay.reassign_follow_up_owner` (served)
  and the four money boundaries `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`, `pay.record_refund`
  (always refused). WP-16 also owns the correction use of `pay.record_service_status` (WP-06 §1.5 carried it here),
  the TA-07 "Payment" section (WP-03 §1.5 carried it here) and the rehoming of the `/accounts` notices (WP-01 Q-04).
  Pages: TA-11 Payment history; SA-07 completed: payment follow-up list, one item, change of its accountable
  SuperAdmin, correction of the current payment entry, the boundary answer page; amendments to SA-07a (WP-06) and
  SA-07h, SA-07t (WP-07). Proofs: V09 (the part WP-07 does not cover) and V19 (financial part).
- **Page model.** One host page per command use. The correction leaves the SA-07a disclosure for a task page SA-07c
  on a new path that posts to the kept POST path. The owner change leaves the item page for a task page SA-07r on its
  POST path. The four boundaries are policy boundary notices (reason, owner, route) on the page of their object and
  never a control, also not a disabled button (CC-08). Their POST routes stay registered and answer the boundary page
  SA-07b (409, nothing recorded). Every form keeps its action, hidden inputs (`kind`, `correctsEntryId`,
  `_rev.payment`, `_rev.exception`) and field names.
- **Money rule.** Every amount comes from a Core field. No page shows an "amount due", a total, a sum of rows or an
  "outstanding" amount that Core did not name (F-W16-01, F-W16-02; WP-06 F-W06-07; WP-07 CMP-16). Unknown is never
  zero: a fee whose payment result is unknown shows "Not known yet", not ₹0.00. No page maps a passed gate to a money
  fact (WP-07 F-05): the TA-07 "work gate" inference goes (F-W16-06).
- **V19 financial part.** A completed application keeps its open follow-up item, listed with "Processing completed";
  the item closes only with a later entry that records payment received, shown as "Closed by payment entry #n", never
  as collected or settled. The group-end exclusion for outstanding money stays Core's (`money_outstanding`); the
  timer path is proven by the existing Core tests; WP-17 owns the group pages.
- **Findings worked (§9.1).** A computed "Outstanding" ledger on the item page; computed TA totals and "Amount due";
  boundaries as disabled buttons without owner or route; LD-17 truncation in the reassign handler; a correction inside
  a disclosure with no view of the entry it replaces; TA-07 hides money facts of a completed unpaid application; a fee
  recovery that never decreases with no notice; unknown fee amounts shown as ₹0.00; flash receipts from the address.
- **STOP items (§9.4).** No P0. No Kind 2. Kind 1 P2: TA evidence reference and correction link on the history; group
  on TA payment rows; cause reference on the follow-up item; a `more` flag on TA payments; which money is outstanding
  on the group-end view. Defect notes P2: an unreadable payment record read as "unrecorded" on the item; an unbounded
  entries read against a contract maximum.
- **Top questions (§9.2).** Q-W16-01 no computed "Amount due" or totals on TA pages (changes the DESIGN.md "Travel
  agent payment" paragraph). Q-W16-02 the correction task page. Q-W16-03 the owner-change task page and its receipt
  host. Q-W16-04 `/accounts` retirement (through the advisor, LD-16). Q-W16-05 notices only, no disabled control, for
  the money boundaries. Q-W16-06 proof writes.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…, checked) | §2.2 (Payment row), §2.3, §3.2 (Group end; Completed case with continuing duty), §3.3, §4.1, §4.2 (Payment history), §6.1, §6.2 (Money & exposure), §6.3 (Manual money record; Exception), §7.4 (Policy boundary notice, Operation receipt, Timeline), §8.3, §10.1 (both tables), §12 V09, V19 |
| `BUILD_SPEC.md` r2 (SHA-256 4a6fd90657b0723f…, checked) | B25, B26, B27, B28, B29, B33, B35, B42, B43 |
| `UI-PLAN.md` (SHA-256 75256bfd7e6d929a…) | §1, §2.2, §3.2 TA-11, §3.4 SA-07, SA-09, §5.2 TA-11, §5.4 SA-07, §6.2, §6.4, §7 (rows Record service payment, Correct payment record, Record government fee fact), §8 (CMP-01, CMP-08, CMP-10, CMP-14, CMP-16, CMP-20, CMP-25), §10, §11, §12.2 WP-16, §13.2 B-03, B-04, §13.3 A-03 |
| `DECISIONS-2026-10-10.md` | §3.1 (Kind 1 criterion), §3.2 (Kind 2 gate) |
| `SURFACE-INVENTORY-2026-10-10.md` | §2.4 RM-T8, RM-A8; CMD-69, CMD-70 (SuperAdmin fee fact rejected), CMD-71; §5 groups D, F |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-07, LD-08, LD-12 to LD-17), §7, §8; `PROPOSALS.md` (P-02, P-10 b, g, P-14); `COMMAND-COVERAGE.md` §3, §5.1, §5.3, §5.5, §6 (CC-08), §6.1; `WP-01.md` Q-04; `WP-01-design.md` §2.2, §2.3; `WP-03-design.md` §1.5, §2.7, §3.4; `WP-06.md` (D-01 to D-19); `WP-06-design.md` §1.4, §1.5, §2.0, §2.6, §2.8–§2.10, §7; `WP-07.md` (F-01 to F-36); `WP-07-design.md` §1.4, §1.5, §2.0, §2.10, §2.11, §6, §7; `WP-12.md` to `WP-14.md` §3–§4; `WP-14-design.md` (structure); `REPO/DESIGN.md` |
| Route map (RM) | §1 items 1, 7; §2.2 rows T37, A01, D10, D27, D30, D47, D102–D109; §3.2 rows of the `pay.*` commands and queries |
| Code (pages, routes) | `src/apps/staff/payments/routes.ts` (all), `src/apps/staff/payments/admin.ts` (all), `src/apps/shared/pages/payments.ts` (all), `src/apps/shared/ta-payments.ts`, `src/apps/shared/core/ta.ts:300-320`, `src/apps/staff/identity.ts:328-383`, `src/apps/staff/core/admin.ts:383-405`, `src/apps/shared/common-routes.ts:33-85`, `src/web/ui/money.ts`, `src/apps/staff/instance.ts:51-64` |
| Code (contracts, bindings) | `src/contracts/payments.ts` (all), `src/contracts/define.ts:29-32`, `src/core-api/bindings/payments.ts:100-290`, `src/kernel/vocabulary/payments.ts` |
| Code (Core behaviour only) | `src/modules/payments/commands/{service-status,follow-up,common}.ts`, `src/modules/payments/queries.ts`, `src/modules/payments/writers.ts`, `src/modules/payments/store.ts` (queries and orders), `migrations/0700_payments.sql` (constraints), `src/modules/core/commands/{assignment,acts}.ts` (where follow-up items open), `src/modules/core/derived.ts:245-265` (group-end eligibility), `src/modules/core/staff-views.ts:288-303`, `src/domain/compose.ts:440-455` (eligible owners), `src/modules/identity/policy.ts:243-244` |
| Tests that pin the pages | §7.3 |

### 1.2 Money follow-up and history as Core holds them (facts)

| Fact | Where Core holds it | What the pages must respect |
|---|---|---|
| Service payment entries | Append-only (`pay_service_entries`); `entry_no` per application; kinds `record`, `correction`; a correction names `corrects_entry_id`; a unique index allows one correction per entry (`0700_payments.sql:107`); the newest entry becomes current (`service-status.ts:123-126`) | The original entry is always shown; a correction never replaces it on a page |
| Entry rules | First entry: `record`. A later `record` only when the current status is `not_received` and the new one is `payment_received`. Every other change is a `correction` of the current entry that changes the status, the amount or the evidence (`service-status.ts:100-111`); the payment date and the reason are not compared (P-10 g, WP-06 D-09). Order of refusals: field checks, then `stale_revision` on `_rev.payment`, then document evidence, then the entry rules | The correction page states these rules before the fields; the refusal sentences follow this order |
| Follow-up items (financial exceptions) | Kinds: `work_under_gate1_exception` (a Gate 1 exception used at assignment or at first work while the payment is not received, `assignment.ts:90-93, 389-390`), `commitment_under_gate2_exception` (an authorization under a Gate 2 exception while unpaid, `acts.ts:156-160`), `payment_corrected_after_work`, `worked_then_corrected_to_unpaid` (a correction after operator work, `service-status.ts:144-148`). Accountable: the grantor of the exception, or the recorder of the correction. One notice to the accountable SuperAdmin (`writers.ts:404-411`) | The kind words say what happened; the owner is a named SuperAdmin |
| Closure | Only a later entry that records `payment_received` closes open items caused before it (`writers.ts:419-434`); the entry that opened an item never closes it; state `closed_by_service_entry`, never "collected" (`vocabulary/payments.ts:35-42`). No write-off and no Accounts collection exist (B29 parked) | "Closed by payment entry #n"; "This is not a bank-verified collection" |
| Completion | Completion does not wait for an open item; the item survives it (`test/core/completion-group-end.test.ts:94-103`). A payment entry may be recorded in any lifecycle (`service-status.ts:7-8`) | "Processing completed" beside an open item; the record form stays reachable |
| Group end | An application with open items, an unused reservation remainder, a TravelMudra-paid fee not recovered or a fee payment of unknown result has `money_outstanding` and never ends with the group (`derived.ts:262-263`; `writers.ts:447-455`) | WP-17 shows the reason; WP-16 does not restate the rule as a page rule |
| Owner change | `pay.reassign_follow_up_owner` (`follow-up.ts`): refused `financial_exception_not_open` when closed, then `stale_revision` on `_rev.exception`, then `follow_up_owner_not_eligible` when the target is not an active SuperAdmin with a second factor or is the current owner; posts a notice to the new owner (dedupe per revision); result resource `financial_exception`, summary `exceptionId`, `accountableSuperAdminId` | The form offers only Core's `eligibleOwners` (active, second factor, current owner excluded, at most 50, `compose.ts:446-455`) |
| Boundaries | The four boundary commands are refused at `authorize` with `unavailable_parked` (`parked_reservation_release`, `parked_fee_exclusion_record`) or `unavailable_owner_decision` (`unselected_write_off`, `unselected_refund`); nothing is recorded; a reader who may not see the boundary gets not-found (`bindings/payments.ts:104-130, 157-173`) | No form and no control; the POST answer page names reason, owner and route |
| Government fees | One fee per logical effect; states `reserved`, `tm_paid`, `payment_unknown`, `recovered_partially`, `recovered`; amounts `fee_amount_paise`, `tm_paid_paise`, `ta_liability_paise`, `ta_received_allocated_paise`, `outstanding_recovery_paise` are Core's. Nothing lowers counted exposure or outstanding recovery in this build (`writers.ts:18-22`) | Amounts from Core only; a `payment_unknown` fee shows "Not known yet"; the recovery boundary is stated |
| TA payment read | `pay.ta_payments`: the TA's applications with a payment record, newest first, at most 200, no `more` flag; per entry only `entryNo`, `status`, `kind`, `recordedAt`; fees with TA liability, received and allocated, outstanding recovery; never the recorder, evidence, reason, ceiling or exposure (`queries.ts:276-302`) | TA-11 states only these facts; the cap line at 200 |
| Staff reads | `pay.application_payments`, `pay.follow_up_list` (open, mine, closed, all; at most 100 with `more`; `openCount`, `mineCount`), `pay.follow_up_item` (row, `cause_entry_no`, `nudge_posted`, `closed_at`, `currentStatus`, `pricePaise`, `causeEntry`, `closingEntry`, `eligibleOwners`). All read authoritative tables, never a projection (`queries.ts:1-3`) | Freshness "Read at [time] IST" on every WP-16 page |

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| TA-11 | Payment history | `/ta/payments?view=&page=&application=` | Kept, rebuilt (`ta.payments`; edge, and staff in a support view) | `pay.ta_payments` |
| TA-07 (section) | Application workspace, section "Payment" (`id="payment"`) | `/ta/applications/:applicationId` | Section rebuilt (carried to WP-16 by WP-03 §1.5) | the TA-07 reads (`core.ta_application`: `servicePayment`, `currentPricePaise`, `lifecycle`) |
| SA-07a | Service payment of one application (WP-06 page) | `/admin/applications/:applicationId/payments` | Amended (AM-W16-01): correction link, entry chain, follow-up rows, fee table, boundary notices, completed line | `pay.application_payments` |
| SA-07c | Correct the current payment entry | `/admin/applications/:applicationId/payments/correct`; form → POST D27 `/admin/applications/:applicationId/payments` | **New** (`admin.payments.correct_form`, action `payment.record_service_status`, resolve `application`) | `pay.application_payments` |
| SA-07f | Payment follow-up | `/admin/queues/financial-follow-up?state=open\|mine\|closed\|all&page=` | Kept, rebuilt (`admin.follow_up.list`) | `pay.follow_up_list` |
| SA-07k | One follow-up item | `/admin/queues/financial-follow-up/:exceptionId` | Kept, rebuilt (`admin.follow_up.item`); receipt host of the owner change | `pay.follow_up_item` |
| SA-07r | Change the accountable SuperAdmin | `/admin/queues/financial-follow-up/:exceptionId/reassign-owner` (GET beside POST D105) | **New** (`admin.follow_up.reassign_form`, action `financial_exception.reassign_owner`, resolve `financial_exception`) | `pay.follow_up_item` |
| SA-07b | Boundary answer | the four POST paths D106–D109 (no GET) | Rebuilt answer page (today `boundaryPage`, `admin.ts:604-613`) | none |
| SA-07h, SA-07t | Finance; exposure ceiling of one travel agent (WP-07 pages) | `/admin/finance`, `/admin/finance/tas/:taAccountId` | Amended (AM-W16-02): notices from the closed table; follow-up links | as WP-07 |
| (A01) | Accounts | `/accounts` | Retired per Q-W16-04 after its notices are rehomed (§2.10) | `iam.accounts_surface` (today) |

Each new GET route validates its ids with zod (`zWireId('app')`, `zWireId('fex')`); a parse failure is the uniform 404.
SA-07c answers the uniform 404 when Core has no payment record of the application (`bindings/payments.ts`, `notFound`).
Query values: `state` ∈ {`open`, `mine`, `closed`, `all`} (an unknown value is ignored and `open` applies, as today,
`routes.ts:208-209`); TA-11 `view` ∈ {`all`, `not_received`, `received`, `fees`, `drafts`}; `page` is a positive
integer below 100; `application` is `zWireId('app')` (an invalid value is ignored). All values are enumerated or
opaque ids (SH-R06).

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| TA-11 | TA: Payment history `/ta/payments` | "Payment history"; with `application`: "Payment history › [applicant or title]" |
| TA-07 section | as TA-07 (WP-03) | — |
| SA-07a, SA-07c | SuperAdmin: Money & exposure, member "Finance" `/admin/finance` | "Money & exposure › Finance › [application title]" / "… › Correct entry #[n]" |
| SA-07f, SA-07k, SA-07r | Money & exposure, member "Payment follow-up" `/admin/queues/financial-follow-up` | "Money & exposure › Payment follow-up" / "… › [kind words]" / "… › [kind words] › Change the accountable SuperAdmin" |
| SA-07b | the object's member: Finance (release, exclusion, refund) or Payment follow-up (write-off) | "Money & exposure › [member]" |

Navigation counts do not change: neither member of Money & exposure has a count today (RM §4), and SA-01 group 11
(WP-06) counts the open items. A support view never reaches `/admin` pages (409 `support_view_active`); it reaches
TA-11 and TA-07 of the viewed travel agent, read only.

### 1.5 The WP-16 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `pay.record_service_status`, use `correction` (WP-06 §1.5 carried) | `admin.payments.record` (`/admin/applications/:applicationId/payments`, D27) | **SA-07c** (moved from the SA-07a disclosure, `admin.ts:243-258`) | `kind` = `correction` (hidden), `correctsEntryId` (hidden), `status` (radio, none preselected), `amount`, `eventDate`, `evidence.<n>.kind\|id\|note` (n = 0…4, WP-06 D-10), `reason` | `payment` | A refusal of a post with `kind = correction` re-renders SA-07c at the POST address, `restorePath` = SA-07c, every value kept; a post with `kind = record` keeps WP-06's SA-07a re-render. Success unchanged from WP-06: `receiptLocation('/admin/applications/<id>/payments', 'corrected', key)`. Parsing §2.13 |
| 2 | `pay.reassign_follow_up_owner` | `admin.follow_up.reassign` (`/admin/queues/financial-follow-up/:exceptionId/reassign-owner`, D105) | **SA-07r** (moved from the item page section, `admin.ts:564-574`) | `owner` (radio), `reason` | `exception` | Parsing §2.13 (no slicing); refusal re-renders SA-07r; success `receiptLocation('/admin/queues/financial-follow-up/<id>', 'reassigned', key)` |
| 3 | `pay.release_reservation` | `admin.finance.reservation_release` (D106) | No host form. Notice on SA-07t | — | — | Answer SA-07b (409) |
| 4 | `pay.exclude_fee` | `admin.payments.fee_exclusion` (D107) | No host form. Notices on SA-07a and SA-07t fee tables | — | — | SA-07b |
| 5 | `pay.write_off` | `admin.follow_up.write_off` (D108) | No host form. Notices on SA-07f and SA-07k | — | — | SA-07b |
| 6 | `pay.record_refund` | `admin.payments.refund` (D109) | No host form. Notice on SA-07a (TA variant on TA-11) | — | — | SA-07b |

Done codes: `corrected` (SA-07a, WP-06's code, refined in §2.15), `reassigned` (SA-07k). The record use of row 1 stays
WP-06's. Each command use has exactly one host page, so a refusal always re-renders the page it came from. UI-PLAN
§12.2 also names "Record government fee fact" for WP-16: Core has no such command (inventory CMD-70, rejected by the
architect of 10 October 2026 as a Kind 2 change); fee records stay read only (D-W16-08).

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Correction (`confirmDisclosure`, `admin.ts:243-258`) | SA-07a | "Correct entry #[n]" → SA-07c, in the entries section, when a current entry exists |
| Owner change (`admin.ts:564-574`) | SA-07k | "Change the accountable SuperAdmin" → SA-07r, in the action panel |
| Disabled boundary buttons (`unavailableActions`, `pages/payments.ts:174-179`) on SA-07a, SA-07t, the follow-up list and item | Every page | CMP-10 notices from the closed table (§2.9); no control |
| Accounts boundaries (`identity.ts:328-344`) | `/accounts` | SA-07h "How exposure decreases" and the other notices of §2.9; OP-10 keeps its grant notice (WP-01) |
| `taPaymentSummary` with "Amount due" and the work-gate line (`ta.ts:310-319`, `money.ts:137-163`) | TA-07 | `taPaymentSection` (§2.2) |

Carried on WP-16 pages: none. After WP-16 no WP-16 form remains carried on any page: the WP-06 carried-form test
(`carried-forms-wp06.test.ts`) drops its correction and boundary entries; the WP-07 carried-form test drops
`pay.reassign_follow_up_owner` and the boundary entries.

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`,
`readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`; `unavailableButton` is not used, Q-W16-05), CMP-12
(`freshness`), CMP-13 (operation status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage`, CMP-01
`actionPanel`, `statusFacts`. WP-06 U5: SA-07a. WP-07 U0: CMP-16 `moneyPanel`, CMP-20 `savedViewTabs`; WP-07 U6:
SA-07h, SA-07t, `ceiling-pages.ts`. WP-09 U2: the unsent text block (a form that no longer applies). Existing:
`dataTable`, `summaryList`, `choiceGroup`, `textField`, `textareaField`, `selectField`, `disclosure`, `identifier`,
`timeAt`, `money`.

New modules (no new `src/web/ui/` component): `src/apps/shared/pages/money-words.ts` (closed word tables of §2.9 and
§2.14, both audiences), `src/apps/staff/payments/follow-up-pages.ts`, `src/apps/staff/payments/correction-page.ts`,
`src/apps/staff/payments/boundary-page.ts`, `src/apps/shared/pages/payment-history.ts` (TA-11 and the TA-07 section).

Dependency: WP-16 builds after WP-02 U0, WP-03 (TA-07), WP-06 U5 (SA-07a), WP-07 U0 and U6 (CMP-16, CMP-20, SA-07h,
SA-07t) and WP-09 U2 are integrated (PLAN §3 order). WP-16 MUST NOT build a second money panel, view-tab component or
decision frame.

### 1.8 Amendments to designed packages

Each binds the build of the named package if it is not built yet; otherwise the WP-16 unit named in §7.1 applies it.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W16-01 | WP-06 §2.6 SA-07a; §1.5 carried rows; §2.8 row `corrected` | P1 | (a) The carried correction disclosure is replaced by the link "Correct entry #[n]" → SA-07c (§1.6). (b) Entries table: one row per entry, oldest first, every entry kept; column "Entry" reads "#[n] Record" or "#[n] Correction of entry #[m]" (from `corrects_entry_id`); a row whose entry a later correction names reads "Replaced by entry #[k]" (the inverse of the same Core relation); the row whose `entry_id` equals `state.current_entry_id` reads "Current"; marks are text, not colour. (c) "Payment-missing follow-up" table becomes "Payment follow-up" with the kind words of §2.14, state words, accountable SuperAdmin, opened time; each row links SA-07k. (d) Government fees table: staff fee words; the five Core amounts; a `payment_unknown` row shows "Not known yet" in the paid, liability and outstanding cells; under the table the fee-exclusion notice of §2.9. (e) The "Not available in this release" section is replaced by the refund and Accounts notices of §2.9; no disabled button. (f) Meta "Application status" uses the lifecycle words of §2.14 ("Processing completed"); when the application is completed and an item is open: "Processing completed. [n] payment follow-up items stay open. Each closes only when a later entry records payment received." (g) The money facts block uses CMP-16 rows: Price in effect; Service payment; Government fee records "[n]"; Payment follow-up "[o] open, [c] closed" (counts of Core rows by Core state). (h) The `corrected` receipt follows §2.15 |
| AM-W16-02 | WP-07 §2.10.1 SA-07h items 4 and 6; §2.10.2 SA-07t items 4 and 8; §1.5 last two rows | P1 | (a) The release and exclusion notices and "How exposure decreases" take the words, owner and route of the closed table (§2.9); the release and exclusion notices gain the route "Request a higher ceiling" → SA-07i (CC-08 needs a route). (b) SA-07h item 4 reads "Payment follow-up: [open] items open; [mine] items yours" with links SA-07f and SA-07f `?state=mine`. (c) The default-ceiling notice keeps WP-07's words; the table registers it as its row 7. (d) WP-07 V09-16 (fee-exclusion notice on SA-07a) is met by AM-W16-01 (d) when WP-06 builds it; otherwise it moves to V09W-1 |
| AM-W16-03 | WP-06 §2.1 SA-01 group 11 | P2 | The line "Accountable SuperAdmin not active: [k] items" links SA-07f `?state=open`; a new line "Yours: [m] items" from `pay.finance_index.followUp.mine` when that read is already composed (opt.), linking `?state=mine` |
| AM-W16-04 | WP-15 SA-10 (not yet designed) | P2 | The notice kind `financial_follow_up` links its item SA-07k from `params.exceptionId`; its text "A payment follow-up item needs your attention" (`delivery/pages.ts:186`) becomes "You are accountable for a payment follow-up item of [application]." when the notice read names the application; WP-15 design input |
| AM-W16-05 | WP-17 group pages (not yet designed) | P2 | The staff sentence of `money_outstanding` on the group-end view: "Money is outstanding on this application (an open payment follow-up item, an unused reservation, a government fee paid by TravelMudra and not recovered, or a fee payment whose result is unknown)." Which of them applies needs STOP-W16-06; WP-17 design input |

## 2. Page specifications

### 2.0 Rules common to every WP-16 page

- **Freshness (LD-08).** Every WP-16 read is authoritative (`queries.ts:1-3`): CMP-12 "Read at [time] IST". No
  projection, no lag line, no page age threshold.
- **Page states.** S1: pages are rendered complete by the server; no skeleton. S6 and S7: the SH-02 pages of WP-01
  (uniform 404 without object facts; Core unreachable: "TravelMudra is unavailable now"; maintenance: the status
  document). Each page lists its own S2 to S5 states. Every WP-16 page has one required read, so a failed read is S7,
  never an empty list.
- **Optional reads (LD-14).** None in WP-16 pages. The SA-07a amendments add no read.
- **Command results.** ACC: 303 to the receipt location of §1.5; CMP-08 first in `main`; its title first in the
  document title. A receipt names a result only when `core.operation` returns the expected resource and the summary
  test of §2.15; otherwise it is neutral ("Request recorded", WP-06 D-02). Recorded facts come only from the operation
  summary and from records selected by the ids it returns; every later read is labelled "Current". REJ: the task page
  re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07 focused, every
  typed value and choice kept (LD-17), sentences from §2.12. C5: CMP-14 (§2.16). UNR: 303 to `/admin/operations/<key>`;
  no new submission of the same intent is offered; `resultHrefOf` gains `financial_exception` → SA-07k (§7.1 U5).
- **Access refusals.** `unauthenticated`, `not_found_or_forbidden`, `maintenance` and `unavailable_dependency`
  answers reach the shell (`answer`, `pages/payments.ts:142-150`): typed values are lost and the page says nothing
  about the object (B10). Every other refusal re-renders.
- **K rules.** Both forms: K-STD. A form carries one `_op` from page load; a browser resend reuses it; a re-render
  after a refusal issues a new `_op` (a refused command records nothing, B35).
- **Core decides.** No Core read returns an offer for these two commands. A page shows the correction form when
  `state.current_entry_id ≠ null`, and the owner-change form when the item's `state = open` and `eligibleOwners` is not
  empty: facts mappings; Core decides at the command.
- **Money (CMP-16 rule).** Every amount is a Core field rendered with `money(…)`, direction `neutral`. No page renders
  "due", "owed", "amount due", "outstanding" as a page label for a computed amount, a total, a sum of rows or a
  difference. "Outstanding recovery" is Core's field name (`outstanding_recovery_paise`) and may appear as its label.
  Unknown is never zero: a `payment_unknown` fee shows "Not known yet" in its amount cells; a null price shows "Not
  available" ("Fixed when you submit" for a draft); a null lifecycle "Stage not available".
- **No money policy invented (B28, B29, B43; UX §10.1).** No page says or implies that a reservation is released, a
  fee excluded, a payment written off, refunded or collected, or that a follow-up is settled. No page infers a release
  or exclusion from payment, time or completion. No page offers or names a control for assistance charges, a fee
  formula or other-mode fees (B-04): no action exists for them, so no notice is shown.
- **Names.** A page names an account only from the read that returns the name (`names`, `ownerName`,
  `eligibleOwners`, `taName`). Otherwise: "Not available" with the copyable `identifier`. TA pages never name a staff
  account.
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic" (CR-08).
  Forbidden on WP-16 pages: "Pay now", "Refund" or "Write off" as a button or link label, "Credit", "Collected",
  "Settled", "Paid" for a closed item, "Released" or "Excluded" for a reservation or fee state, "Override" (also
  `Payment_Missing_Override`), "Amount due", "Due from you", "Total", "Something went wrong". TA words never contain
  "exception", "gate", "ceiling", "exposure", "reservation", "follow-up item" or "SuperAdmin". All copy is draft
  (CR-09).
- **Mobile (< 768 px).** One column; tables become labelled cards; facts before details; task pages put scope and
  effect before the fields; the primary action is at the end of the form, never in a fixed bar (UX §7.3).

### 2.1 TA-11 Payment history `/ta/payments`

Purpose: account for each service: price, service payment fact, government fee and recovery facts; corrections keep
the original entries (UX §4.1 last row, §4.2; UI-PLAN TA-11). Read only.

1. Header: `h1` "Payment history"; lead "The price and the payment status of each application, and government fees
   TravelMudra paid for you. TravelMudra records payments by hand." Freshness "Read at [time] IST".
2. "How to pay" paragraph (text, not a control): "Pay TravelMudra as agreed and quote the application reference with
   each payment. This page changes when TravelMudra records the payment."
3. View tabs (CMP-20, GET links, `?view=`): "All" ([n] applications); "Not recorded as received" (rows with `status` ∈
   {`unrecorded`, `not_received`} and `lifecycle ≠ draft`); "Recorded as received" (`status = payment_received`);
   "With government fees" (rows with at least one fee); "Drafts" (`lifecycle = draft`). Each count is the number of
   listed rows by Core fields; zero reads "None". At the cap the counts read "[n] in the 200 listed".
4. Cap line, when the read returns 200 rows: "This page lists the 200 most recently created applications. Older
   applications are not listed here; open them from Applications." (STOP-W16-04.)
5. One card per application (`article`, `id="app-<applicationId>"`), Core order (newest first), 50 cards per page
   (`?page=`, display paging over the one read):
   - `h3` the application title as a link to TA-07 (`/ta/applications/<id>`); "Reference to quote:" `identifier`
     with copy (today's test pins it, `payments-views.test.ts:104`).
   - Facts (definition list, separate rows, UX §2.2): Stage (§2.14 TA lifecycle words); Price in effect (`pricePaise`;
     "Fixed when you submit" for a draft; "Not available" when null otherwise); Service payment (TA words and meaning
     line; "Last change [time] IST" from the last history entry when one exists).
   - Government fees (when `fees` is not empty): a table "Government fees for this application (separate from the
     price)": Filing attempt; State (TA fee words); Paid by TravelMudra for you (`ta_liability_paise`); Received from
     you and allocated (`ta_received_allocated_paise`); Still to recover (`outstanding_recovery_paise`). A
     `payment_unknown` row shows "Not known yet" in the three amount cells. No sum row.
   - `details` "Payment status history ([n] entries)": a table, oldest first (Core order): Entry #[entryNo]; Status
     (TA words); "Correction (the earlier entry is kept)" when `kind = correction`; Recorded [time] IST. With
     `application` in the address the `details` is open.
6. Policy boundary notices (CMP-10, TA variants of §2.9): paying online; refunds; and, when any listed fee exists,
   the recovery notice.

| State | Copy |
|---|---|
| S2 no row | "No payment record yet. A payment record appears when you create an application." |
| S3 a view with no row | "No application in this view." + "Show all applications" |
| `application` not among the rows | "This application is not among the 200 most recently created applications listed here. Open it from Applications." |
| Completed or ended application | Stage "Processing completed" or "Ended with its group"; the payment facts as recorded; no extra sentence |
| Support view (staff origin) | The same page, read only, with the support-view banner (WP-01); links go to the TA pages of the support view |

Removed: the totals "Due from you now", "Service payments not yet recorded", "Government fees TravelMudra paid for
you" (`pages/payments.ts:304-314`); per-application "Amount due" and "Payment due for this application"
(`:282-291`); the fee sums (`:246-256`); the "Payment due" and "Payment recorded or nothing due" sections, which sort by
a computed "due" (`:306-308`). Q-W16-01.

Mobile: cards stack; facts before the fee table; the history stays in its `details`.

### 2.2 TA-07 section "Payment" (`id="payment"`)

Rendered by `taPaymentSection(ctx, v)` from `payment-history.ts`; TA-07 (WP-03) calls it in its section order. Shown
for every application that is not a draft, and for a draft whose `servicePayment ≠ unrecorded` (a draft with approved
help can have an entry). The anchor `#payment` stays (WP-03 U2).

1. `h2` "Payment".
2. CMP-16 rows: Price in effect (`currentPricePaise`; "Not available" when null); Service payment (TA words and
   meaning line of §2.14).
3. When `servicePayment ≠ payment_received`: the "How to pay" paragraph of §2.1 item 2 with the reference `identifier`.
4. Link "Payment history for this application" → `/ta/payments?application=<id>#app-<id>` (when `hasPage`).

Removed: "Amount due" and the work-gate line of `taPaymentSummary` (`ta.ts:311-317`; `money.ts:137-163`): the gate
state `excepted` was inferred from the pending reason and the editor state (`ta.ts:311`), a page mapping of a gate to a
money fact (WP-07 F-05). The rule "a closed application without a recorded payment owes nothing here" (`ta.ts:312-313`)
is removed: a completed application whose payment is not recorded shows its facts (V19). The action panel (WP-03 §3.2
item 2) keeps its Core-driven step.

### 2.3 SA-07a Service payment of one application (WP-06 page, amended)

WP-06 §2.6 stays the specification, with AM-W16-01. Reading order after the amendment: header (meta with lifecycle
words) → receipt (`recorded`, `corrected`) → status facts and CMP-16 money block → action panel (WP-06) → completed line
(AM-W16-01 f) → "Record a payment entry" (WP-06) → `h2` "Payment entries" (table of AM-W16-01 b; the link
"Correct entry #[n]" → SA-07c under the table when a current entry exists and the page is not in a support view) →
`h2` "Payment follow-up" (AM-W16-01 c) → `h2` "Government fees paid by TravelMudra" (AM-W16-01 d) → `h2` "Money actions not
available" (refund and Accounts notices).

| State (added by WP-16) | Copy |
|---|---|
| No entry yet | No correction link; the entries table empty state stays WP-06's ("No payment entry yet. 'Not recorded' is not the same as received.") |
| Completed, item open | AM-W16-01 (f) line |
| `workAuthorized = null` | Status fact "Operator work authorized: Not available" (never "No") |

### 2.4 SA-07c Correct the current payment entry `/admin/applications/:applicationId/payments/correct`

Purpose: record an additive correction of the current entry, with the entry it replaces in view and its effects
stated before the fields (UX §6.3 Manual money record; UX §7.4 Review and confirm). CMP-25 frame.

1. Header: breadcrumb; `h1` "Correct entry #[n]: [application title or 'Application [reference]']"; freshness.
2. `h2` "Scope": "This application's service payment record. A correction adds a new entry. Entry #[n] stays in the
   record unchanged. Only the current entry can be corrected, and each entry only once."
3. `h2` "Evidence: entry #[n] as recorded": Entry ("#[n] Record" or "#[n] Correction of entry #[m]"); Status recorded;
   Amount stated ("Not stated"); Payment date as the evidence states it ("Not stated"); Evidence (one line per row:
   kind words, `identifier`, note); Reason ("None given"); Recorded by [name] at [time] IST; "Recorded after operator
   work" when `work_authorized_at_entry`. Then, labelled "Current": Service payment; Operator work authorized (Yes /
   No / "Not available"); Open payment follow-up items "[n]" (links SA-07k); Gate 1 and Gate 2 rows as WP-06 §2.6.
4. `h2` "Effect on this application" (from Core facts read now; Core decides at submit):
   - "The new entry becomes the current payment status. Entry #[n] stays in the record and on every page."
   - "Gate exceptions recorded while entry #[n] was current can no longer be used. A new decision is needed for
     them."
   - `workAuthorized = true`: "Operator work was authorized on this application. This correction opens a payment
     follow-up item, and you are accountable for it. A change from received to not received opens 'Corrected to not
     received after operator work'; any other change opens 'Payment entry corrected after operator work'."
     `workAuthorized = null`: "Whether operator work was authorized cannot be read now. If it was, this correction
     opens a payment follow-up item, and you are accountable for it." `false`: no line.
   - "When the new entry records payment received, it closes this application's open payment follow-up items that
     earlier events opened. An item this correction opens stays open."
   - Lifecycle `completed`: "Processing of this application is completed. The correction does not restart any work."
   - "The receipt states what TravelMudra recorded."
5. `h2` "Hard stops": "Entries are never edited or deleted. A correction must change the status, the amount or the
   evidence. A different payment date or reason alone is not accepted as a correction now." (interim D-09; §3)
   "Refunds, write-offs and receipt verification are not available here (see the notices on the service payment
   page)."
6. `h2` "Your correction": line "Pre-filled from entry #[n] as recorded. Change what is wrong." Fields: "Corrected
   payment status" (`status`, radio `payment_received` "Payment received" / `not_received` "Payment not received",
   none preselected, hint "Entry #[n] records: [status]."); "Amount stated by the evidence" (`amount`, ₹ prefix,
   `inputmode decimal`, prefilled from `amount_paise`, hint as WP-06 `entryFields`); "Date of payment as the evidence
   states it" (`eventDate`, date, prefilled from `event_at` as an IST calendar date; hint "Changing only the date is
   not accepted as a correction now."); evidence rows 0…4 (row 0 visible, rows 1–4 in a native `details` "Add more
   evidence", prefilled from the entry's evidence in order); "Reason for the correction" (`reason`, textarea, 3 rows,
   maxlength 1000, required, hint "At least 10 characters. Kept with the entry and shown in the audit history.").
   Hidden: `kind` = `correction`, `correctsEntryId` = `state.current_entry_id`, `_rev.payment` = `status_revision`.
7. Review (visible, never inside `details`): "When you record the correction: entry #[n] stays unchanged; a new entry
   with your values becomes the current payment status; your name, the reason and the time are recorded[; a payment
   follow-up item opens in your name (when `workAuthorized` is true)]."
8. Buttons "Record the correction" (primary); "Cancel" → SA-07a.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| No entry | `state.current_entry_id = null` | "There is no entry to correct. Record the first payment entry on the service payment page." Link SA-07a `#record`. No form |
| C3 `corrected` | — | Receipt on SA-07a (§2.15) |
| C2 | — | §2.12; every value kept |
| C5 `stale_revision` | another entry was recorded meanwhile | CMP-14 (§2.16); the form now targets the new current entry |

### 2.5 SA-07f Payment follow-up `/admin/queues/financial-follow-up`

Purpose: keep each payment follow-up item owned across applications, also after completion (UX §6.2 Money &
exposure, `Payment_Missing_Override` list; BS B29).

1. Header: breadcrumb "Money & exposure"; `h1` "Payment follow-up"; lead "Work or a government commitment went ahead
   while the service payment was not recorded as received, or a payment entry was corrected after operator work. Each
   item stays open, also after its application's processing is completed, until a later entry records payment
   received." Freshness.
2. View tabs (CMP-20, `?state=`): "Open ([openCount] items)", "Yours ([mineCount] items)", "Closed", "All". The counts
   are Core's (`openCount`, `mineCount`); the closed and all views have no count.
3. When `mineCount > 0` and the view is not "Yours": line "Open items you are accountable for: [mineCount]" with the
   link "Show yours".
4. Table (labelled cards on mobile), Core order (oldest first), 50 rows a page over the one read: Why (kind words,
   link SA-07k); Application (title link → SA-07a; `identifier`) and Stage (lifecycle words); Travel agent (`taName`,
   link SA-07t); Accountable SuperAdmin (`ownerName`; when open and `ownerActive = false`: text "Not active: change
   the accountable SuperAdmin" with the attention marker, text and icon); Opened [time] IST; State (state words;
   closed rows "Closed [time] IST").
5. Cap line when `more = true`: open and yours views "This list shows the oldest 100 items of this view. [openCount]
   items are open in total."; closed and all views "This list shows the oldest 100 items. More exist."
6. Notices (§2.9): write-off; Accounts actions.

| State | Copy |
|---|---|
| S2 open view empty | "No payment follow-up item is open." (no success tone, no "All done") |
| S2 yours empty | "You are accountable for no open item." |
| S2 closed empty | "No item has been closed yet." |
| S2 all empty | "No payment follow-up item exists." |
| Row, lifecycle `completed` | Stage "Processing completed"; the row stays while the item is open |

Removed: the "Open for [n] days" age computed from server time (`admin.ts:90-93, 525`; D-W16-09).

### 2.6 SA-07k One follow-up item `/admin/queues/financial-follow-up/:exceptionId`

1. Header: breadcrumb; `h1` "[Kind words]: [application title or 'Application [reference]']"; freshness.
2. Receipt (`reassigned`, §2.15).
3. Status facts (separate rows): State ("Open" / "Closed by payment entry #[closingEntry.entry_no] at [closed_at] IST.
   This is not a bank-verified collection."); Why (kind meaning, §2.14); Application (link SA-07a) and Stage
   (lifecycle words); Travel agent (link SA-07t); Accountable SuperAdmin (`ownerName`; "(not active)" when
   `ownerActive = false`; "(you)" when it is the viewer); Opened [time] IST; Cause (entry kinds: "Payment entry
   #[cause_entry_no] recorded [status words] at [causeEntry.recorded_at] IST"; gate kinds: "A Gate [1/2] exception was
   used while the service payment was not recorded as received" with the link "Gate exceptions of this application" →
   the application's SuperAdmin case page (its section "Gate exceptions") when `hasPage`, STOP-W16-03); Service payment now (`currentStatus`,
   labelled "Current"); Price in effect (`pricePaise`, "Not available" when null) — a separate fact, never an amount
   owed; Notice to the accountable SuperAdmin ("Posted" / "Not posted", `nudge_posted`).
4. Action panel (CMP-01), first match:
   - Open and `ownerActive = false`: owner "SuperAdmin"; "The accountable SuperAdmin is not active, so nobody is
     reminded of this item. Change the accountable SuperAdmin." Action "Change the accountable SuperAdmin" → SA-07r.
   - Open and `currentStatus ≠ payment_received`: owner "[ownerName]"; "Record the payment when it arrives. A later
     entry that records payment received closes this item." Action "Record a payment entry" → SA-07a `#record`.
   - Open and `currentStatus = payment_received`: owner "[ownerName]"; "The current entry already records payment
     received. This item closes only with a later entry that records payment received: a correction that changes the
     amount or the evidence. Correct the entry only when it is wrong. Verifying the payment and writing the item off
     are not available (notices below)." Action "Open the service payment page" → SA-07a (Q-W16-09).
   - Closed: no action; "Closed by payment entry #[n]. Nothing more is recorded for this item."
5. Line when open and the lifecycle is `completed`: "Processing of this application is completed. This item stays
   open after completion until a later entry records payment received. No government work restarts."
6. Secondary link (open only): "Change the accountable SuperAdmin" → SA-07r (when the first action rule did not
   already show it). "History of this item" → `/admin/audit/financial_exception/<id>` when `hasPage` (owner changes are
   facts `pay.financial_exception_owner_changed`).
7. Notices (§2.9): write-off; Accounts actions.

| State | Copy |
|---|---|
| S4 `ownerName = null` | "Not available" with the `identifier` |
| S4 `lifecycle = null` | "Stage not available" |
| C3 `reassigned` | Receipt; Current owner |

Removed: the computed ledger "Outstanding: Service price not recorded as received [₹]" (`admin.ts:556-562`,
F-W16-01); the reassign form (moved to SA-07r); "Shown in this list and the SuperAdmin's follow-up panel"
(`admin.ts:591`, F-W16-12); the age in days.

### 2.7 SA-07r Change the accountable SuperAdmin `/admin/queues/financial-follow-up/:exceptionId/reassign-owner`

CMP-25 frame.

1. Header: breadcrumb; `h1` "Change the accountable SuperAdmin: [kind words], [application]"; freshness.
2. `h2` "Scope": "This payment follow-up item only. [Kind words] · Application [reference] · Travel agent [name]."
3. `h2` "Evidence": State; Accountable SuperAdmin now ([ownerName], "not active" when `ownerActive = false`); Opened
   [time] IST; Cause (as SA-07k); Service payment now.
4. `h2` "Effect": "The SuperAdmin you choose becomes accountable for this item. TravelMudra posts a notice to them in
   the same step. The item moves to their 'Yours' view. Nothing else changes: the item's kind, cause and state and
   the payment records stay as they are. The item still closes only with a later entry that records payment
   received."
5. `h2` "Hard stops": "Only an active SuperAdmin who uses an authenticator can be accountable. This change does not
   close the item, write it off or change its cause."
6. `h2` "Your decision": "New accountable SuperAdmin" (`owner`, radio group of `eligibleOwners` in Core order; the
   viewer's option reads "[name] (you)"; none preselected); "Reason for the change" (`reason`, textarea, 3 rows,
   maxlength 1000, hint "At least 10 characters. Kept with the record and shown in the audit history."). Hidden
   `_rev.exception` = `row.revision`.
7. Review (visible): "When you change it: [the chosen SuperAdmin] becomes accountable for this item and gets a notice.
   Your name, the reason and the time are recorded."
8. Buttons "Change the accountable SuperAdmin" (primary); "Cancel" → SA-07k.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| Closed | `row.state ≠ open` | "This item is closed by payment entry #[n]. Its accountable SuperAdmin no longer changes." Link SA-07k. No form |
| Nobody to choose | `eligibleOwners` empty | CMP-10: "Changing the accountable SuperAdmin is unavailable until another SuperAdmin is active and uses an authenticator. Owner: SuperAdmin." Link "Accounts & access" (SA-06a). No form |
| C3 `reassigned` | — | 303 to SA-07k with the receipt |
| C2 | — | §2.12; the reason kept; the choice kept when it is still among `eligibleOwners` |
| Form no longer applies | `financial_exception_not_open` | The closed state; the unsent text block (WP-09 U2) holds the typed reason, read only |
| C5 | `stale_revision` | CMP-14 (§2.16) |

### 2.8 SA-07b Boundary answer (POST answer of D106–D109)

The four boundary routes stay registered (CC-08). A hand-made POST reaches Core, which refuses it at `authorize`
(nothing is recorded); the handler answers this page with the category's status (409), as today (`routes.ts:77-85`).

1. Header: breadcrumb as §1.4; `h1` "[Action name] is unavailable".
2. CMP-10 from the closed table (§2.9): reason sentence, "Owner: [owner]", the route link, the staff reference code.
3. Line "Nothing was recorded." (today's sentence; `payments-views.test.ts:178`).
4. Link "Back to [object page title]" → SA-07t, SA-07a or SA-07k (today's `back`).

An `unavailable_dependency` refusal or any other refusal reaches the shell or `ctx.respond` as today. A reader who may
not see the boundary gets the uniform 404 from Core (`payments-views.test.ts:184-185`).

### 2.9 Policy boundary notices (closed table, `money-words.ts`)

Template (UI-PLAN §11.3; DESIGN `boundaryNotice`): "[Action] is unavailable until [policy] is decided. Owner:
[owner]. [Route]." Staff notices show the reference code; TA notices do not. A notice is a note, not an error, and no
control precedes it (Q-W16-05).

| # | Code | Command (route) | Action name | Staff sentence | Owner | Staff route | Placement | TA variant |
|---|---|---|---|---|---|---|---|---|
| 1 | `parked_reservation_release` | `pay.release_reservation` (D106) | Releasing an unused reservation | "Releasing an unused reservation is unavailable until the product owner decides when a reservation may be released. Until then it stays counted in this travel agent's exposure, also after the application completes." | product owner | "Request a higher ceiling (a second SuperAdmin approves it)." → SA-07i | SA-07t under the reservations table | none |
| 2 | `parked_fee_exclusion_record` | `pay.exclude_fee` (D107) | Excluding a government fee from counted exposure | "Excluding a government fee from counted exposure is unavailable until the product owner decides which payment record excludes a fee. The fee stays counted." | product owner | SA-07t: as row 1; SA-07a: "Open the travel agent's exposure ceiling" → SA-07t | SA-07a and SA-07t under the fee tables | none |
| 3 | `unselected_write_off` | `pay.write_off` (D108) | Writing off a missing payment | "Writing off a missing payment is unavailable until the product owner decides who may write off and on what evidence. The item stays open." | product owner | "A later entry that records payment received closes the item." → SA-07a of the item's application (SA-07k); none on SA-07f | SA-07f below the table; SA-07k item 7 | none |
| 4 | `unselected_refund` | `pay.record_refund` (D109) | Recording a refund | "Recording a refund is unavailable until the product owner decides refunds." | product owner | "No route in this release." | SA-07a | "Refunds are not available in this service. Owner: TravelMudra." (TA-11) |
| 5 | `parked_accounts_actions` | none (B29) | Verifying, allocating and recovering payments | "Verifying a bank receipt, allocating it, recording a recovery and adjusting a balance are unavailable until the product owner defines the accounting actions. Counted exposure and outstanding recovery do not decrease in this release." | product owner | "No route in this release." | SA-07h "How exposure decreases"; SA-07t; SA-07a; SA-07k | When a listed fee exists: "Recording here a payment you make for a government fee is not available yet. The amount under 'Still to recover' stays after you pay. Owner: TravelMudra." (TA-11) |
| 6 | `excluded_payment_gateway` | none (B42) | Paying online | — | — | — | — | "Paying online is not part of this service. Pay TravelMudra as agreed and quote the application reference." (no owner line: excluded scope) |
| 7 | `exposure_parked_paid_case_default_ceiling` | (WP-07: OP-04a refusal) | Committing a government fee for a paid application at the default ₹0 ceiling | WP-07 §2.7.3 and §2.10.2 words, unchanged | product owner | WP-07 | SA-07t, OP-04a (WP-07) | none |

Rows 1, 2 and 7 are the three B28 cases (UI-PLAN B-03): each sits on its own object and is never a page-wide notice
that blocks every commitment (V09). `PAY_MESSAGES` keeps its keys; the boundary entries take their sentences from
this table, so one source holds the words. The OP-10 grant notice (WP-01) keeps its words; they agree with row 5.

### 2.10 The Accounts page `/accounts` (A01)

After WP-16 every one of its seven callouts (`identity.ts:328-344`) has a home: bank verification, allocation and
recovery, manual adjustment and dashboard data → row 5 (SA-07h, SA-07t, SA-07a, SA-07k; OP-10 for the operator with
the grant); write-off → row 3; refunds → row 4; reservation release → row 1. LD-02 then retires the route with a
decision (WP-01 Q-04). Recommendation (Q-W16-04): keep the path and answer 303 — a session that holds the `admin`
surface to `/admin/finance#decrease`, any other session to `/account#accounting-grant` — so bookmarks keep working
(LD-03) and no page shows an area AD-12 says does not exist. The route id, action and surface stay; the handler no
longer reads `iam.accounts_surface`.

### 2.11 Where the remaining rules are

§2.12 to §2.16 hold the refusal sentences, the input parsing, the closed word tables, the receipt facts and the stale
comparisons of every WP-16 page.

### 2.12 Refusal sentences (closed table, staff audience)

Category plus code selects the sentence; `fieldErrors` select by field. Core's field names map to the form's:
`amountPaise` → `amount`, `eventAt` → `eventDate`, `accountableSuperAdminId` → `owner`.

| Form | Category / code (field) | Sentence | Where |
|---|---|---|---|
| correction | `validation_failed` / `correction_no_change` | "Nothing that TravelMudra compares has changed: give a different status, amount or evidence. A different payment date or reason alone is not accepted as a correction now. Nothing was recorded." | form-level |
| correction | `validation_failed` / `correction_target_not_current` | "Entry #[n] is no longer the current entry: entry #[m] was recorded since you opened the page. Check it, then correct it if it is wrong." (re-read) | form-level |
| correction | `validation_failed` / `payment_entry_kind_invalid` | "There is no current entry to correct. Record a payment entry on the service payment page." | form-level |
| correction | `validation_failed` / `payment_evidence_required` (`evidence`) | "A correction that records payment received needs a bank or payment reference, or a document of this travel agent, as evidence. An attestation alone is not enough." | evidence fieldset |
| correction | `validation_failed` / `payment_evidence_not_found` (`evidence.<n>.id`) | "This document is not one of this travel agent's documents." | the row |
| correction | `validation_failed` / `input_invalid` (`evidence.<n>.kind`: `kind_not_allowed`; `evidence.<n>.id`: `invalid_id`) | "Choose a bank or payment reference, a document or an attestation." / "Enter a document version reference (it starts with dov_)." | the row |
| correction | `validation_failed` / `input_invalid` (`eventAt`: `in_future`) | "The payment date cannot be in the future." | `eventDate` |
| correction | `validation_failed` / `input_invalid` (`reason`: `required`) | "Give a reason of at least 10 characters." | `reason` |
| owner change | `control_blocked` / `follow_up_owner_not_eligible` | "That SuperAdmin cannot be accountable now: choose an active SuperAdmin who uses an authenticator, other than the current one." | `owner` |
| owner change | `control_blocked` / `financial_exception_not_open` | "This item was closed by a payment entry since you opened the page. Nothing was changed." | form-level (closed state) |
| owner change | `validation_failed` (`reason`) | "Give a reason of at least 10 characters (up to 1,000)." | `reason` |
| both | `stale_revision` | CMP-14 (§2.16) | — |
| both | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| both | `not_found_or_forbidden`, `unauthenticated`, `maintenance`, `unavailable_dependency` | Shell (§2.0) | — |
| both | unknown code | Category text + "Reference code: [code]" | form-level |

### 2.13 Input parsing in the handlers (LD-17)

Every field is read whole. Input over a limit is refused at its field with every value kept; the command is not
sent. The record handler is WP-06's (D-10 already reads every evidence row); WP-16 U3 checks it for the correction
use and fixes the reassign handler (today `field()` slices `owner` to 64 and `reason` to 4000, `routes.ts:70, 225`).

| Field | Rule | BFF refusal (field) |
|---|---|---|
| `owner` | `zWireId('acc')` | "Choose a SuperAdmin." |
| `reason` (owner change, correction) | trim; 10–1000 | "Give a reason of at least 10 characters (up to 1,000)." |
| `amount` | empty → left out; `paiseFromRupees`; text that is not an amount → refused (today it passes through, sliced to 40) | "Enter the amount in rupees, for example 3,500 or 3,500.50." |
| `eventDate` | empty → left out; `YYYY-MM-DD` → IST instant; other text → refused | "Enter the date as a calendar date." |
| `evidence.<n>.*` | every indexed row (any digits); a row with empty kind, id and note is left out; more than 5 rows → refused; kind > 40, id > 200, note > 200 characters → refused (never cut) | "Give at most 5 pieces of evidence." / "Up to [k] characters." |
| `status` | sent as posted when non-empty (Core checks the closed set); empty → refused | "Choose the corrected status." |
| `kind`, `correctsEntryId` | hidden; over 16 or 64 characters → form-level refusal (a forged value) | form-level |

### 2.14 Closed word tables (`money-words.ts`)

| Set | Value | Staff words | TA words |
|---|---|---|---|
| Service payment | `unrecorded` | "Not recorded" | "Not recorded yet" — "TravelMudra has not recorded your payment yet." |
| | `not_received` | "Not received" | "Recorded as not received" — "TravelMudra recorded that your payment has not arrived." |
| | `payment_received` | "Received" | "Recorded as received" — "TravelMudra recorded your payment." (pinned, `payments-views.test.ts:101`) |
| Lifecycle | `draft`, `submitted`, `completed`, `ended_with_group`, null | "Draft", "Submitted", "Processing completed", "Ended with its group", "Stage not available" | same |
| Follow-up kind | `work_under_gate1_exception` | "Work under a Gate 1 exception before payment" — "A Gate 1 exception was used for an assignment or for the operator's first work while the service payment was not recorded as received." | not shown |
| | `commitment_under_gate2_exception` | "Government commitment under a Gate 2 exception before payment" — "A government fee or submission was authorized under a Gate 2 exception while the service payment was not recorded as received." | not shown |
| | `payment_corrected_after_work` | "Payment entry corrected after operator work" — "A payment entry was corrected after operator work was authorized on this application." | not shown |
| | `worked_then_corrected_to_unpaid` | "Corrected to not received after operator work" — "The payment was corrected from received to not received after operator work was authorized." | not shown |
| Follow-up state | `open`, `closed_by_service_entry` | "Open"; "Closed by payment entry #[n]" — "A later entry recorded payment received. This is not a bank-verified collection." | not shown |
| Fee state | `reserved` | "Reserved, not paid" | "Not paid yet" |
| | `tm_paid` | "Paid by TravelMudra" | "Paid by TravelMudra for you" |
| | `payment_unknown` | "Payment result not known" — "It cannot be paid again until the act's evidence is recorded. Owner: the operator who reconciles the act." | "Being confirmed" |
| | `recovered_partially`, `recovered` | "Partly recovered", "Recovered" | "Partly received from you", "Received from you" |
| Reservation | `reserved`, `converted_to_paid` | "Reserved", "Converted to paid (any unused part stays counted)" | not shown |
| Entry kind | `record`, `correction` | "Record", "Correction of entry #[m]" | "Payment entry", "Correction (the earlier entry is kept)" |

An unknown value shows "Unrecognised: [code]" (UAT-13 fallback) and never a success word.

### 2.15 Receipt facts per command (CMP-08)

| Done | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `corrected` (refines WP-06 §2.8) | SA-07a | `application`, path id | `entryId` matches `^pay_`; `entryNo` is an integer; `status` ∈ entry statuses; `openedException` is null or matches `^fex_`; `closedExceptions` is an integer ≥ 0 | the `entries` row with `entry_id = entryId` has `kind = correction` (else neutral "Request recorded") | "Correction recorded" | "Entry #[entryNo], correction of entry #[m]"; status; amount stated; evidence (that row); "Payment follow-up opened by this entry: [kind words]" (link SA-07k; from the `exceptions` row with that id) when `openedException ≠ null`; "Payment follow-up items closed by this entry: [closedExceptions]" | Service payment; Gate 1; Gate 2; open follow-up items |
| `reassigned` | SA-07k | `financial_exception`, path id | `exceptionId` equals the path id; `accountableSuperAdminId` matches `^acc_` | unique summary key | "Accountable SuperAdmin changed" | "Accountable SuperAdmin: [name]" — the name of `accountableSuperAdminId` from `ownerName` when it is the current owner, else from `eligibleOwners`, else "Not available" with the `identifier` | Accountable SuperAdmin now; State |

No receipt shows an accepted time or a command name (P-02, P-10 b pending; S-08). A receipt whose check fails reads
unchecked (WP-01 A-04). The old address flashes (`DONE`, `admin.ts:63-71`) go: no receipt fact comes from the address.

### 2.16 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| SA-07c correction | `_rev.payment` (and `correction_target_not_current`) | Current entry (you were correcting #[n] / now #[m], its status, recorded by, at); Service payment (your chosen status / current status). The line "Your values are kept. They now correct entry #[m], the current entry: check them before you send." The hidden `correctsEntryId` and `_rev.payment` come from the re-read |
| SA-07r owner change | `_rev.exception` | Accountable SuperAdmin (your choice / now); State (open / now). When the current owner equals your choice: "Another change already made [name] accountable. Nothing more is needed." The reason stays |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Command identity (P-10 b, S-08) | `corrected` by the entry kind; `reassigned` by its unique summary key | `commandName` confirms; titles unchanged |
| Date-only correction (P-10 g; WP-06 D-09) | The hard-stop sentence, the date hint and the `correction_no_change` clause | Remove the three; Core accepts a date change |
| TA history evidence and correction link (STOP-W16-01) | Status and date only; "Correction (the earlier entry is kept)" | "Correction of entry #[m]"; the bank or payment reference the TA quoted (never notes or the recorder) |
| Group on TA payment rows (STOP-W16-02) | No group filter; TA-07 shows the group | View "By group" |
| Cause of a gate-kind item (STOP-W16-03) | Link to the application's gate exceptions and the item history | "Gate 1 exception [reference], granted by [name] at [time] IST, used at [time] IST" |
| More TA payment rows (STOP-W16-04) | Cap line at exactly 200 rows | Cap line only when Core says `more` |
| Which money is outstanding (STOP-W16-06; WP-17) | Core's `money_outstanding` sentence | The specific money |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 34e875b already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Owner change | Same `_op`, same content (double click, browser resend) | K-STD replay: the same 303 to SA-07k and the same receipt; one change, one notice | None | Yes (receipt new) |
| Owner change | Same `_op`, other content | `conflict_operation_key`; §2.12; values kept | None | Partly (generic) |
| Owner change | New `_op` from a stale page (second tab), same choice | Core checks the state, then the revision: `stale_revision` → CMP-14 with "Another change already made [name] accountable"; no second change, no second notice | None | Partly (generic sentence) |
| Owner change | Fresh page after the change, same person | Not possible from the page (the current owner is not in `eligibleOwners`); a hand-made post → `follow_up_owner_not_eligible` at the field | None | Partly |
| Owner change | Fresh page, another person | A second, legitimate change: one more fact and one more notice | One fact per accepted change | Yes |
| Correction | Same `_op` | Replay; the same `corrected` receipt; one entry | None | Yes |
| Correction | New `_op` from a stale page | `stale_revision` → CMP-14 targeting the new current entry; values kept | None | Partly |
| Correction | Fresh page, the values of the entry unchanged | `correction_no_change` → §2.12; nothing recorded | None | Partly (generic) |
| Correction | Two corrections of the same entry (two tabs, fresh revisions in both) | The first wins; the second is refused `stale_revision` (revision guard) or by the unique index on `corrects_entry_id` → CMP-14 | None | Partly |
| Boundary POST | Any number of posts | 409 SA-07b each time; nothing recorded | None | Yes (words new) |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | The task page at the POST address, CMP-07 focused | Every typed value; the owner choice while still eligible | — |
| The item closed meanwhile (owner change) | SA-07r closed state with the unsent text block | The typed reason, read only | The form |
| Access lost (SuperAdmin suspended; support view opened in another tab) | Sign-in, or the support-view shell answer (409) for `/admin` | — | Typed values (B10) |
| Core unreachable before a command | SH-02 "TravelMudra is unavailable now" | — | The form |
| Answer lost | Operation page (CMP-13); "Check status" | — | No new submission offered |
| Maintenance | The status document (503) | — | The form; nothing replayed |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Nth identical owner reassignment** | §4.1 owner-change rows: one change per accepted command; the stale tab learns who is accountable now; the current owner is never offered | Partly |
| **Reassignment to an inactive account** | (a) Not offered: `eligibleOwners` holds only active SuperAdmins with a second factor. (b) The chosen SuperAdmin is suspended between load and submit: `follow_up_owner_not_eligible` at `owner`; the reason kept; the re-read list lacks them, so no option is selected and the line "The SuperAdmin you chose cannot be accountable now." shows. (c) The current owner becomes inactive: SA-07f marks the row; SA-07k puts "Change the accountable SuperAdmin" first; SA-01 group 11 counts it. (d) No other eligible SuperAdmin: SA-07r has no form and names the route (Accounts & access). (e) An owner whose second factor was reset is still `ownerActive` (role and status only) but cannot be chosen again: P2 note STOP-W16-08 | Partly ((a) yes; (b) generic sentence; (c) list only) |
| **Follow-up after completion** | An item opened before completion stays open and listed with "Processing completed"; SA-07k states that no work restarts; recording "payment received" on the completed application closes it (Core allows entries in any lifecycle). A correction on a completed application with operator work opens a new item; SA-07c states it before the fields; the receipt names it. No page says "settled", "collected" or "reopened" | Partly (lifecycle words; no completion line) |
| **A reservation unresolved** | After "Not filed" the fee returns to `reserved` and the reservation stays counted (WP-07 V09-15); after a payment below the reservation, the unused part stays counted; after completion both stay. SA-07t shows "Reserved" or "Converted to paid (any unused part stays counted)" with the release notice (row 1) and its ceiling route; the fee row of SA-07a shows the exclusion notice (row 2). A `payment_unknown` fee shows "Not known yet" amounts (staff and TA) and the operator owner. No page infers a release from time, payment or completion. The application never ends with its group (`money_outstanding`) | Partly (disabled buttons; ₹0.00 for unknown) |
| **A correction after a correction** | Entry #3 corrects #2, which corrected #1: SA-07a lists #1 "Replaced by entry #2", #2 "Correction of entry #1, replaced by entry #3", #3 "Correction of entry #2, Current"; each entry can be corrected once (unique index); SA-07c always targets the current entry; TA-11 lists three entries with the correction words; a follow-up item opened by #2 is closed by #3 only when #3 records payment received; an item opened by #3 stays open | Partly (no "replaced by", no "current" marker) |
| **Correction racing an assignment** | Core lets one order win (`payments/follow-up.test.ts:108`). SA-07c's effect text reads `workAuthorized` at page load; when the assignment commits first, the correction opens an item that the page did not announce; the receipt states what was recorded ("Payment follow-up opened by this entry") | Partly (no receipt facts) |
| **Payment recorded while SA-07r is open** | The item closes; the owner change answers `financial_exception_not_open` → closed state and the unsent reason | Partly |
| **Access revoked mid-page** | SuperAdmin suspended: the next request goes to sign-in; nothing written. A support view opened in another tab: `/admin` pages answer the 409 support-view page with its end form. TA suspended: `/ta/payments` → sign-in with `next` (`payments-views.test.ts:354-363`). A SuperAdmin's support view ended in another tab: the next staff `/ta/payments` read is refused and the shell answers; no earlier TA facts stay (LD-14) | Yes |
| **200 payment entries** | SA-07a lists every entry in one table (no paging, no truncation) with the "Current" marker and a link "Go to the current entry" at the top of the section; TA-11 lists every entry inside the card's `details`. The contract allows 1,000 entries while the store reads without a limit: a 1,001st entry fails the whole read (STOP-W16-07, P2) | Yes (list); P2 note |
| **200 applications on TA-11** | 50 cards a page; view counts; the cap line at 200 rows (no `more` flag, STOP-W16-04) | No (one long page; no cap line) |
| **100+ open items** | SA-07f: 50 rows a page over the one read; the cap line with Core's `openCount` | Partly ("Only the oldest 100 items are shown.") |
| **An item whose current entry already records received** | SA-07k states Core's closure rule and the Accounts and write-off boundaries; it does not recommend a correction made only to close the item (Q-W16-09) | No |
| **A SuperAdmin presses "Write off"** | No such control exists on any page; a hand-made POST answers SA-07b (409) and records nothing | Partly (disabled button present) |

### 4.4 Device and environment

JavaScript off: every page works (plain forms; view tabs and paging are GET links; evidence rows 1–4 inside a native
`details`). 320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: radios, links and fields in
reading order; the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-16

- One `h1` per page; frame and task parts `h2`; TA-11 cards `h3` (AC-03).
- Radio groups (`status`, `owner`) are `fieldset` with a `legend`; none preselected; after a refusal the chosen value
  is kept (AC-15).
- Status words, "Current", "Replaced by", "Not active" and fee states are text with an icon, never colour only
  (AC-06). Amounts use tabular figures with the currency in text (CMP-16).
- Policy boundary notices are notes (`section` with a heading or a paragraph group), not live regions and not errors.
  No `aria-disabled` control is rendered for a money boundary.
- View tabs are a `nav` list of links with `aria-current="page"` (CMP-20).
- Receipts are announced politely without moving focus (AC-09).
- The TA-11 `details` summary names the application: "Payment status history of [title] ([n] entries)", so it is
  distinguishable out of context (WCAG 2.4.6).

## 6. Proofs on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone). At the WP-16 proof it holds the
  integrated WP-02, WP-03 and WP-06 to WP-15 pages (package order; inference). Synthetic data only.
- Accounts: syn-ta-1; syn-operator-1 (OP1); syn-superadmin-1 (SA1), syn-superadmin-2 (SA2), syn-superadmin-3 (SA3).
  Sign-in through the LD-11 harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px. Seeded data
  is not changed (no seeded account is suspended on `lane-ui`).
- Completion is reachable only through the labelled harness of the system tests (LD-04; WP-08 V17-5, WP-14 §6.1), and
  the group-end timer needs a return date in the past: both run as tests.
- Fee facts need the WP-07 V09 and V10 flows. Fact to check first: SA-07h lists the latest WP-07 run's travel agent X
  (`wp07-ta-[stamp]`) with counted exposure; its applications P (unused reservation after "Not filed"), U
  (`commitment_under_gate2_exception` owned by SA2) and W (fee paid ₹1,000) exist. Otherwise setup B runs.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W16-06)

Run tag `wp16-[yyyymmddhhmm]`.

- Setup A (every run): syn-ta-1 creates group `wp16-[stamp]` in Synthetica (travel +30/+40 days) and submits three
  applications on "SYN Tourist e-visa" (₹3,500): G ("Syngate, Asha"), C ("Syncorr, Dev"), R ("Synrest, Ravi"), with
  unique synthetic passports. SA1: for G, the Gate 1 exception for assignment (SA-09g) and the assignment to OP1
  (SA-03a), which opens `work_under_gate1_exception` owned by SA1; for C, "Payment received" with evidence
  `SYN-UTR-[stamp]` (SA-07a), then the assignment to OP1 (operator work authorized). R stays unpaid and unassigned.
- Setup B (only when X is absent): WP-07 §6.2 setup and steps V09-4, -6, -8, -15, V10-1, -2, -5 to -8 as setup.

### 6.3 V19, financial part

V19 (UX §12): "Completed processing can retain financial/disclosure follow-up; group-end date closure never consumes
unknown filing, held originals, pending delivery or outstanding money" (B25, B29). WP-16 proves the financial
follow-up; WP-14 the disclosure part; WP-12 the originals; WP-17 the group pages.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V19F-1 | SA1, SA-07f | Read "Open" and "Yours" | G's item "Work under a Gate 1 exception before payment", Stage "Submitted", Accountable SA1, "Opened [time] IST", no age in days; counts with units; write-off and Accounts notices with "Owner: product owner"; no button or disabled control for write-off | L |
| V19F-2 | SA1, SA-07k of G's item | Read | Separate facts; Price in effect as a fact, no "Outstanding" or "due" amount; action panel "Record the payment when it arrives…" → SA-07a `#record`; cause line with the gate-exceptions link | L |
| V19F-3 | SA1, SA-07r | Choose SA2; reason | Scope, evidence, effect and hard stops before the fields; receipt on SA-07k "Accountable SuperAdmin changed", "Accountable SuperAdmin: SA2"; SA2's SA-07f "Yours" lists the item; SA2's notices list one follow-up notice | L |
| V19F-4 | Harness | Resend the V19F-3 POST (same `_op`); then post SA2 again from the stale SA-07r page with a new `_op` | Same 303 and receipt; then 409 CMP-14 "Accountable SuperAdmin: your choice SA2 / now SA2" and "Another change already made SA2 accountable"; one owner change in the item's history | L |
| V19F-5 | SA2, SA-07r | Read | SA2 (the owner now) is not offered; SA1 and SA3 are; no option reads "(you)" | L |
| V19F-6 | SA1, `/admin/groups/<group>` (WP-17 page or today's page) | Read | G: "Ends with the group: No", reasons include "Money is outstanding."; R: no and only the return date reason — R is the narrow unpaid, unworked case | L |
| V19F-7 | SA1, SA-07c for C | Correct entry #1 to "Payment not received", evidence `SYN-BOUNCE-[stamp]`, reason | Before the fields: entry #1 in full; the effect "This correction opens a payment follow-up item, and you are accountable for it"; receipt on SA-07a "Correction recorded", "Entry #2, correction of entry #1", "Payment follow-up opened by this entry: Corrected to not received after operator work"; entry #1 "Replaced by entry #2" | L |
| V19F-8 | SA1, SA-07c for C (fresh page) | Change only the payment date | 422 with the `correction_no_change` sentence including the date clause; values kept; no entry #3 | L |
| V19F-9 | SA1, two tabs of SA-07c for C | Tab 1: correct #2 to "Payment received" with `SYN-UTR2-[stamp]`; then send tab 2 | Tab 1: receipt "Payment follow-up items closed by this entry: 1"; SA-07k of C's item "Closed by payment entry #3… not a bank-verified collection"; tab 2: CMP-14 "you were correcting entry #2 / now entry #3", values kept, targeting #3 | L |
| V19F-10 | syn-ta-1, TA-11 | Read "All", "Not recorded as received", `?application=<C>` | G and R "Not recorded yet" with Price in effect ₹3,500 as a separate row; C "Recorded as received" with three history entries and the correction words; no total, no "Amount due", no item, kind, owner name or evidence reference; the online-payment and refund notices | L |
| V19F-11 | syn-ta-1, TA-07 of G | Read the Payment section | Price in effect; Service payment "Not recorded yet"; how-to-pay line; link to its payment history; no "Amount due", no work-gate line | L |
| V19F-12 | Test (harness completion) | Complete G with its item open | SA-07f row "Processing completed", item open; SA-07k completion line; SA-07a meta "Processing completed" and the AM-W16-01 (f) line; TA-11 G "Processing completed" and "Not recorded yet"; TA-07 Payment section present | T |
| V19F-13 | Test | Record "Payment received" on the completed G | Item "Closed by payment entry #1"; lifecycle stays completed; no work offer reappears | T |
| V19F-14 | Test (existing Core) | `test/core/completion-group-end.test.ts` "refuses completion of an issued electronic case until…" (an open financial exception survives completion, lines 94-103) and "ends only eligible applications page by page…" (outstanding money excluded, line 158) | Unchanged; pass | T |
| V19F-15 | Test | SA3 suspended between SA-07r load and submit | `follow_up_owner_not_eligible` at `owner`; reason kept; nothing recorded | T |
| V19F-16 | Test | Owner of an open item suspended | SA-07f row "Not active"; SA-07k first action → SA-07r; SA-01 group 11 line | T |

### 6.4 V09, the part WP-07 does not cover

V09 (UX §12): "A funded government-fee commitment shows counted exposure and ceiling; each B28 unresolved reservation
case remains specifically unavailable rather than all commitments blocked" (B27–B29, B43). WP-07 V09-1 to V09-18 prove
the ceiling, the reservation at authorization, the parked paid case at ₹0, the non-overridable breach, lowering and
the unused reservation after "Not filed". WP-16 proves the boundary notices as notices on their objects, the boundary
answers, and that the TA's money view never exposes the internal controls.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V09W-1 | SA1, SA-07a for W | Read | Fee row "Paid by TravelMudra": expected ₹1,000, paid ₹1,000, TA liability ₹1,000, received and allocated ₹0.00, outstanding recovery ₹1,000 (Core fields); under the table the fee-exclusion notice (row 2) with owner and route; the refund and Accounts notices; no button, no disabled control | L |
| V09W-2 | SA1, SA-07t for X | Read | P's reservation "Reserved" with its unused amount counted; the release notice (row 1) with its ceiling route; no page-wide "commitments unavailable" notice (the ceiling is set) | L |
| V09W-3 | SA1, SA-07a for U; SA-07k | Read | "Government commitment under a Gate 2 exception before payment", accountable SA2, open | L |
| V09W-4 | X, TA-11 | Read | W: "Paid by TravelMudra for you ₹1,000", "Received from you and allocated ₹0.00", "Still to recover ₹1,000" and the TA recovery notice; P: fee "Not paid yet"; no ceiling, exposure, reservation or follow-up word anywhere | L |
| V09W-5 | Test (`payments-views.test.ts` boundary case, updated) | Hand-made POST to each of the four boundary routes with a valid CSRF token | 409 SA-07b: "[Action] is unavailable until…", "Owner: product owner", route, "Nothing was recorded."; operation and fact counts unchanged; an operator gets not-found | T |
| V09W-6 | Test (§7.2 host test) | Render every WP-16 and amended page | No form action or control under the four boundary paths; each notice on its object page only | T |
| V09W-7 | Test | A `payment_unknown` fee | SA-07a and SA-07t "Not known yet" amounts with the operator owner; TA-11 "Being confirmed" with "Not known yet" | T |
| V-A | axe | TA-11, TA-07, SA-07a, SA-07c, SA-07f, SA-07k, SA-07r, SA-07h, SA-07t | No violation at 1440 px and 390 px | L |

### 6.5 Proof split

V19 (financial part) passes when V19F-1 to -11 and V-A pass on `lane-ui` and V19F-12 to -16 pass as tests. V09 (WP-16
part) passes when V09W-1 to -4 pass on `lane-ui` and V09W-5 to -7 pass as tests; with WP-07's V09 steps V09 is done.
Boundaries stated, not crossed: write-off, refund, reservation release, fee exclusion, Accounts actions (B28, B29,
B43); completion (LD-04).

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U4 in parallel. Phase C: U5. The architect registers gallery modules in
`scripts/dev/gallery-pages.ts` (and removes the `taPaymentSummary` sample), applies the `/accounts` decision in
`src/apps/staff/identity.ts` (one route block, coordinated with WP-15) and edits `DESIGN.md` once at the end (the "Travel
agent payment" paragraph and the money-boundary rule, Q-W16-01, Q-W16-05).

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Money words and notices** | New `src/apps/shared/pages/money-words.ts` (§2.9, §2.12, §2.14; `moneyBoundary(code, audience, routes)` over CMP-10); `src/apps/shared/pages/payments.ts` (boundary sentences from the table; presentation tables re-exported; `unavailableActions`, `taPaymentsPage`, `serviceDue`, `feesDue`, `TA_STATUS_TEXT` deleted; `answer`, `paiseFromRupees`, `instantFromDate`, `amount`, `inr` kept) | New `test/unit/web/money-words.test.ts` (every value of the payment vocabularies and `LIFECYCLE_STATES` has words in both audiences; every boundary row has reason, owner and, for staff, a route or "No route in this release"; no word holds a forbidden term of §2.0; TA words hold none of the internal terms) | — |
| **U1 Follow-up pages** | New `src/apps/staff/payments/follow-up-pages.ts` (SA-07f, SA-07k, SA-07r; `reassigned` expectation) | New `test/unit/web/payment-follow-up-pages.test.ts` (views and counts; cap lines; completed rows; inactive owner first; no computed amount; closed words; SA-07r states in order; no preselected owner; the current owner absent) | `scripts/dev/gallery/payment-follow-up.ts` |
| **U2 Service payment, correction, boundary page** | New `src/apps/staff/payments/correction-page.ts` (SA-07c); new `src/apps/staff/payments/boundary-page.ts` (SA-07b); `src/apps/staff/payments/admin.ts` (AM-W16-01 in `applicationPaymentsPage`; AM-W16-02 notices in `financeIndexPage`, `taFinancePage`; `followUpPage`, `followUpItemPage`, `boundaryPage`, the correction disclosure, `DONE` removed) | New `test/unit/web/payment-correction.test.ts` (prefill; no preselected status; effect lines by `workAuthorized` true/false/null; no-entry state; hidden fields); extend `test/unit/web/service-payment-page.test.ts` (WP-06: entry chain marks; fee "Not known yet"; notices without controls; completed line) and `test/unit/web/ceiling-pages.test.ts` (WP-07: notice words and routes) | extend `scripts/dev/gallery/service-payment.ts` |
| **U3 Routes** | `src/apps/staff/payments/routes.ts` (GET `admin.payments.correct_form`, `admin.follow_up.reassign_form`; follow-up GETs on U1; record handler: correction refusal re-renders SA-07c, LD-17 check; reassign handler: §2.13 parsing, SA-07r re-render, receipt location SA-07k; boundary handler on SA-07b) | New `test/unit/bff-payment-follow-up.test.ts` (each §2.13 refusal keeps values and sends no command; a 1,500-character reason refused, never cut; six evidence rows refused; correction refusal re-renders SA-07c, record refusal SA-07a; same `_op` resend answers the same 303; stale → CMP-14; `financial_exception_not_open` → closed state with the unsent block; `not_found_or_forbidden` → shell; boundary → 409 SA-07b) | — |
| **U4 TA-11 and the TA-07 section** | New `src/apps/shared/pages/payment-history.ts` (TA-11; `taPaymentSection`); `src/apps/shared/ta-payments.ts` (`view`, `page`, `application`); the TA-07 renderer (one call site, `ta.ts:310-319` at 34e875b or its WP-03 successor); `src/web/ui/money.ts` (`taPaymentSummary` removed) | New `test/unit/web/payment-history.test.ts` (no total and no "Amount due"; views by Core fields; cap line at 200; 50 per page; `application` filter and its absent state; `payment_unknown` "Not known yet"; history words; reference identifier; support-view rendering has no form); TA-07 section cases (completed unpaid shows facts; draft with an entry; no work-gate line) | `scripts/dev/gallery/payment-history.ts` |
| **U5 Wiring and system tests** | `src/web/route-inventory.ts` (two GET rows); `src/apps/shared/common-routes.ts` (`financial_exception` result page; shared file, the architect coordinates) | `test/unit/web/routes.test.ts`; new `test/unit/web/money-host-pages.test.ts` (§7.2); new `test/system/payment-follow-up.test.ts` (V19F-12, -13, -15, -16; V09W-7); the system tests of §7.3 | — |

U0 owns `money-words.ts` and `pages/payments.ts`; U1 `follow-up-pages.ts`; U2 `correction-page.ts`,
`boundary-page.ts`, `admin.ts`; U3 `routes.ts`; U4 `payment-history.ts`, `ta-payments.ts`, the TA-07 call site and
`money.ts`; U5 the wiring files. No two units edit one file. Test file names carry no package or proof identifier.

### 7.2 Host-page and boundary test

`test/unit/web/money-host-pages.test.ts` renders TA-11 (each view), the TA-07 section, SA-07a (no entry; one entry;
three entries in a chain; completed with an open item; a `payment_unknown` fee), SA-07c, SA-07f (each view), SA-07k
(open, closed, inactive owner, completed), SA-07r, SA-07b (four codes), SA-07h and SA-07t, and asserts: (a) no
rendered form action and no button or link targets `/refunds`, `/fees/<id>/exclude`, `/reservations/<id>/release` or
`/write-off`; (b) the only form posting to `/admin/applications/<id>/payments` with `kind=correction` is on SA-07c, and
SA-07a has none; (c) the only form posting to `…/reassign-owner` is on SA-07r; (d) each boundary row appears on the
pages of §2.9 and on no TA page except its TA variant; (e) with fixture amounts chosen so that no two sum to a third,
no rendered amount is a sum or difference of two fixture amounts (no page arithmetic); (f) TA renderers contain none
of the internal terms of §2.0. The system step V09W-5 repeats (a) for the POST answers.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/payments-views.test.ts:96-110` | TA page "TravelMudra recorded your payment"; the reference identifier; no other raw reference | Kept (TA words of §2.14 keep the sentence; the identifier stays; anchors are attributes, not text) |
| `test/system/payments-views.test.ts:120-128` | Correction posted from the SA-07a GET; `location === …/payments?done=corrected` | GET SA-07c; allow `&op=<key>` |
| `test/system/payments-views.test.ts:134-146` | "Corrected to unpaid after work"; "You are accountable for one open item"; finance "Payment-missing follow-up (1 open)"; "Payment entry #2" | "Corrected to not received after operator work"; "Open items you are accountable for: 1" (§2.5 item 3); the SA-07h words of AM-W16-02 (b); "Payment entry #2 recorded" |
| `test/system/payments-views.test.ts:147-150` | Reassign posted from the item GET; 303 | GET SA-07r; location SA-07k `?done=reassigned&op=` |
| `test/system/payments-views.test.ts:156-157` | "By payment entry #3" | "Closed by payment entry #3" |
| `test/system/payments-views.test.ts:169-178` | Boundary texts ("Refunds are not decided", "Excluding a fee…is not decided", "Releasing an unused reservation is not decided", "write off a missing payment") | The §2.9 sentences; 409 and "Nothing was recorded" kept |
| `test/system/flows.test.ts:91-110` | `/accounts` answers 200 for the SuperAdmin and the operator with the grant; brand link `/accounts` | Per Q-W16-04: 303 to `/admin/finance#decrease` and `/account#accounting-grant`; the grant notice assertions on `/account` stay |
| `test/unit/web/routes.test.ts` | Inventory rows | Two new GET rows |
| `test/unit/web/carried-forms-wp06.test.ts`, `carried-forms-wp07.test.ts` | Correction disclosure, boundary notices, the follow-up link | Entries removed |
| `scripts/dev/gallery-pages.ts` | `taPaymentSummary` sample with `due` | Removed (architect) |

Stay valid: `test/payments/*.test.ts` (Core), `test/core/completion-group-end.test.ts`, `test/identity/accounts.test.ts`,
`payments-views.test.ts:309-370` (paths, roles, support view, suspended TA), `test/unit/nav-counts.test.ts`.

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `pay.reassign_follow_up_owner` | SA-07 (follow-up list and item); WP-16 | SA-07r `/admin/queues/financial-follow-up/:id/reassign-owner` (GET beside D105); receipt on SA-07k; WP-16 |
| `pay.record_service_status` | SA-07; WP-06; note "Same command corrects an entry (WP-16)" | SA-07a (record, WP-06); SA-07c `/admin/applications/:id/payments/correct` (correction, WP-16; posts to the kept path with `kind=correction`) |
| `pay.release_reservation` | SA-07 (TA exposure: reservations); WP-16 | Notice row 1 on SA-07t; POST answer SA-07b (409); no form; WP-16 |
| `pay.exclude_fee` | SA-07 (per-application money facts); WP-16 | Notice row 2 on SA-07a and SA-07t; SA-07b; WP-16 |
| `pay.write_off` | SA-07 (follow-up item); WP-16 | Notice row 3 on SA-07f and SA-07k; SA-07b; WP-16 |
| `pay.record_refund` | SA-07 (per-application money facts); WP-16 | Notice row 4 on SA-07a (TA variant on TA-11); SA-07b; WP-16 |

Proposed §6 disposition CC-19: "The correction leaves the SA-07a disclosure for SA-07c; the owner change leaves the
item page for SA-07r. The four money boundaries are notices with reason, owner and route on the page of their object
and never a control, also not a disabled button; their POST routes stay and answer SA-07b. `accounts.home` is retired
per Q-W16-04 after its notices are rehomed." §5.1 counts unchanged (WP-16: 5).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W16-01 | P1 | The follow-up item shows a ledger "Outstanding: Service price not recorded as received [₹]" computed from the price and the status (`admin.ts:556-562`) | An item of kind "payment entry corrected after operator work" whose current entry records received but with an amount corrected: the page shows no outstanding amount, while an item on an application with a partly paid, "not received" entry shows the full price as outstanding; a SuperAdmin chases the TA for the wrong amount | Price and status as separate facts (§2.6) |
| F-W16-02 | P1 | TA page totals "Due from you now", per-application "Amount due", fee sums, sections sorted by a computed "due" (`pages/payments.ts:231-256, 282-314`) | A TA with 40 submitted applications reads "Service payments not yet recorded ₹1,40,000", a sum Core never recorded; one disputed "not received" entry with a stated amount still adds the full price | Facts per application; views by Core status (§2.1; Q-W16-01) |
| F-W16-03 | P1 | Boundaries rendered as disabled buttons with a reason but no owner or route (`unavailableActions`, `pages/payments.ts:174-179`; `admin.ts:297-304, 451, 454, 540-543, 600`) | A SuperAdmin tabs to a disabled "Write off this missing payment", reads it as a permission they lack and asks another SuperAdmin to do it | Notices only (§2.9; Q-W16-05) |
| F-W16-04 | P1 | LD-17: the reassign handler slices `owner` (64) and `reason` (4000) (`routes.ts:70, 225`); the record handler reads evidence rows 0–1 and slices (`:51-61`, WP-06 D-10) | A pasted 1,200-character reason is cut silently and the record differs from what the SuperAdmin wrote | §2.13 |
| F-W16-05 | P1 | The correction is a disclosure on SA-07a with no view of the entry it replaces, no completion statement and no date rule (`admin.ts:243-258`) | The SuperAdmin corrects only the date, gets a generic refusal and retries three times; or corrects after work without noticing that an item opens in their name | SA-07c (§2.4; Q-W16-02) |
| F-W16-06 | P1 | TA-07 hides the Payment section for a completed application without a recorded payment ("owes nothing here", `ta.ts:312-313`) and infers the work gate as `excepted` (`:311`) | An application worked under a Gate 1 exception completes unpaid: the TA sees no payment fact on TA-07 and believes nothing is owed | `taPaymentSection` (§2.2) |
| F-W16-07 | P1 | The TA fee "Received from you" stays ₹0 and "Still to recover" never decreases (Accounts parked, `writers.ts:18-22`), with no notice | A TA pays the ₹1,000 fee by bank transfer; the page still shows ₹1,000 to recover a month later; the TA pays again | TA notice row 5 (§2.9) |
| F-W16-08 | P2 | A `payment_unknown` fee shows ₹0.00 amounts (TA and SuperAdmin) | The TA reads "Paid by TravelMudra for you ₹0.00" while the payment may have happened | "Not known yet" (§2.0) |
| F-W16-09 | P2 | "Open for [n] days" computed from server time (`admin.ts:90-93, 525`) | Two pages computed at different times disagree | Opened time only (D-W16-09) |
| F-W16-10 | P2 | `/accounts` renders seven callouts of an area AD-12 says does not exist (`identity.ts:328-344`) | A SuperAdmin bookmarks "Accounts" and looks there for collections | Rehomed notices; Q-W16-04 |
| F-W16-11 | P2 | Kind words "Work started before payment: An operator was assigned under a service payment exception…" (`pages/payments.ts:37`) miss the first-work case | An item opened at the operator's first work reads as an assignment that did not happen | §2.14 |
| F-W16-12 | P2 | "Shown in this list and the SuperAdmin's follow-up panel" (`admin.ts:591`): no such panel exists | — | "Posted" / "Not posted" |
| F-W16-13 | P1 | Receipts from the address only (`DONE` flashes, `admin.ts:63-71`): "The accountable SuperAdmin was changed and notified." on any `?done=reassigned` | A copied address shows a change that did not happen | CMP-08 (§2.15) |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W16-01 | P1 | TA pages show no computed "Amount due" and no totals; the price in effect and the service payment status stay separate facts; DESIGN.md "Travel agent payment" (lines 93-94) changes accordingly | F-W16-02; a partly paid entry recorded "not received" with ₹1,000 stated shows ₹3,500 due | Yes (WP-06 F-W06-07 and WP-07 CMP-16 class). The WP-03 docket sentence "your payment of ₹[price]" (`ta-reading.ts:112`) MAY stay: it names the price, not a computed amount |
| Q-W16-02 | P1 | The correction on its own task page SA-07c (new GET path, form to the kept POST path); status not preselected; the other fields prefilled from the current entry | F-W16-05 | Yes |
| Q-W16-03 | P1 | The owner change on SA-07r (GET beside D105) with its receipt on SA-07k | A receipt on SA-07r would show the form again and invite a second change | Yes |
| Q-W16-04 | P2 | Retire `/accounts`: keep the path and answer 303 (SuperAdmin → `/admin/finance#decrease`; operator with the grant → `/account#accounting-grant`), or the uniform not-found as advisor decision A01 did for operator Services | F-W16-10 | Route to the advisor (LD-16: a view-level choice inside the lane); recommend the 303 |
| Q-W16-05 | P1 | Money boundaries as notices only, without a disabled control; DESIGN.md "boundaryNotice with unavailableButton" gains the exception "an action no user can take in this release shows the notice only" | F-W16-03; UI-PLAN SA-07 "these controls MUST NOT appear"; UX §7.4 "use an informational state instead of presenting forbidden actions" | Yes |
| Q-W16-06 | P1 | Proof writes on `lane-ui` (§6.2): one group and three applications per run, one Gate 1 exception, two assignments, one payment, two corrections, one owner change; reuse of WP-07's travel agent X or its setup | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only; no seeded account suspended |
| Q-W16-07 | P2 | TA-11 views by Core status and display paging of 50 | 200 cards on a phone | Yes |
| Q-W16-08 | P2 | TA notice owners read "Owner: TravelMudra" (WP-03 convention), staff notices "Owner: product owner" | A TA does not know who the product owner is | Yes |
| Q-W16-09 | P2 | For an open item whose current entry already records received, SA-07k states Core's closure rule and the boundaries, and does not suggest a correction made only to close it | A SuperAdmin adds a cosmetic correction to clear their list; the record then holds an entry made for the list, not for the payment | Yes; note to Max's end review (the item closes only with Accounts collection or write-off, both parked, B29) |
| Q-W16-10 | P2 | `?application=` on TA-11 serves "open application money detail" (UI-PLAN TA-11 primary) instead of a new route | A new route would need a per-application read that does not exist | Yes (D-W16-11) |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W16-01 | New GET task pages SA-07c (new path) and SA-07r (beside D105) | New routes and inventory entries; actions and fields unchanged |
| D-W16-02 | The correction form leaves SA-07a; the owner-change form leaves SA-07k | Host pages change; system tests change their GET source |
| D-W16-03 | Success locations carry `&op=`; the owner-change receipt is on SA-07k; the `DONE` flashes go | Locations change |
| D-W16-04 | Correction evidence rows `evidence.<n>.*` for n = 0…4 (WP-06 D-10) | Names unchanged |
| D-W16-05 | Money boundaries: notices only, no disabled control; the POST answer page rebuilt (409 kept) | Display; route behaviour unchanged |
| D-W16-06 | TA-11: no totals and no "Amount due"; views and paging in the address | Address state (closed values) |
| D-W16-07 | The TA-07 Payment section shows for every non-draft application and a draft with an entry | Display |
| D-W16-08 | UI-PLAN §12.2 "Record government fee fact" is not built: no Core command (CMD-70 rejected as Kind 2); fee records read only; UI-PLAN A-03 does not apply | None |
| D-W16-09 | "Open for [n] days" removed; opened time only | Display |
| D-W16-10 | `/accounts` per Q-W16-04 | Handler change |
| D-W16-11 | TA-11 "application money detail" is the `application` filter of the same page | Address state |
| D-W16-12 | The correction's status radio is not preselected while amount, date and evidence are prefilled | Display |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W16-01 | Kind 1 with a criterion exception (P2) | On `pay.ta_payments.history[]`: the entry the correction replaces (`correctsEntryNo`), the payment date as the evidence states it, and the external payment reference (never notes, document ids or the recorder) | UX §4.2 Payment history "Inspect evidence/history"; the TA can match a recorded entry with the transfer they made | 1. Facts exist (`pay_service_entries`). 2. Fails: it removes no client join, computation or round trip; needs Max's exception, like P-05, P-13 and P-18 (2). 3. Same scope. 4. Field additions | Status and date only; correction words without a number. Parked |
| STOP-W16-02 | Kind 1 (P2) | Group id and label on `pay.ta_payments.applications[]` | UI-PLAN TA-11 filter by group | 1. Facts exist. 2. Removes a client join with `core.ta_applications`. 3, 4 hold | No group filter; TA-07 shows the group |
| STOP-W16-03 | Kind 1 (P2) | On `pay.follow_up_item.row`: `cause_ref` (the gate exception id) with its grantor and use time | SA-07k cause; UX §6.1 "duty/reason" | 1. Facts exist (`cause_ref`, `core_gate_exceptions`). 2. Removes a trip to the audit page | Link to the gate exceptions and the item history |
| STOP-W16-04 | Kind 1 (P2) | A `more` flag on `pay.ta_payments` (the read stops at 200, `queries.ts:291`) | D7 caps; the cap line | Facts exist | Cap line at exactly 200 rows |
| STOP-W16-05 | Defect note (P2) | `pay.follow_up_item.currentStatus` reads `unrecorded` when the payment read returns nothing (`bindings/payments.ts`, `?? 'unrecorded'`) | Unknown never zero | — | Unreachable in practice (an item implies a payment row); note to the Core task |
| STOP-W16-06 | Kind 1 (P2; WP-17 input) | The codes of `outstandingMoney` (`open_financial_exception`, `exposure_reserved`, `tm_paid_unrecovered`, `fee_payment_unknown`) on the group-end view items | V19: which money holds an application open past its group's end | 1. Core computes them (`writers.ts:447-455`). 2. Removes a guess. 3, 4 hold | Core's "Money is outstanding." (AM-W16-05) |
| STOP-W16-07 | Defect note (P2) | `pay.application_payments` entries, exceptions and fees are read without a limit while the contract caps them at 1,000; a 1,001st row fails the whole read | "200 payment entries" class | — | S7 page at 1,001 rows; note to the Core task |
| STOP-W16-08 | Note (P2) | `ownerActive` checks role and status but not the second factor, while eligibility needs it | An owner whose second factor was reset reads as active but cannot be chosen again | — | Note only |

No STOP item blocks the WP-16 main path. No P0 item is open in this design. No Kind 2 change is requested. The P2 items
are parked as notes; STOP-W16-06 goes to the WP-17 design as input.
