# WP-16 acceptance checklist: Money follow-up and history

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-16 Money follow-up and history (UI-PLAN §12.2: TA-11, SA-07 full; done when V09 and V19; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at 34e875b. The payment module, its contract, its binding and its pages have no change in the working tree (last commits: module 6050f2f, contract and binding 3796a6b, pages 5280b9c). Internal records at 3b06d34 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages for set-up); edge http://127.0.0.1:4650 (TA-11 under test; set-up through the travel-agent pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to the WP-16 design, to the architect's decisions (`WP-16.md` §3)
and to an independent review, if the architect orders one under LD-13 (§6 Q-12), will be recorded here as a table of
changed rows, as in `WP-13-acceptance.md` and `WP-14-acceptance.md`.

## Lessons applied from the WP-01 to WP-14 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; A42 (the Nth time), A43 (the matrix) |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A37, A39, A40, A41, A51 (each checks "nothing is recorded" by delta) |
| A receipt names the command only when the operation's resource, returned id and summary establish it, with a complete distinguishing summary signature; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time; no result from the address | WP-01 A-04, P-02; WP-06 D-02; WP-11 I-09; WP-13 L-05; WP-14 K-07 | §0.2 "Receipts"; A36, A46, A57 |
| Recorded facts in a receipt come only from stored summary fields; facts read after the operation are "Current"; another person's receipt opens as the unchecked receipt with current authorized facts | WP-12 J-08, J-09 | A36, A57, A58 |
| No page, status read or receipt instructs anyone to perform an act; a historical receipt keeps the historical fact | WP-07 F-01, F-33 (P0 class fix); WP-09 G-10 | A58; A06 (no sentence says that payment starts or stops work) |
| No page maps a passed gate to a money fact (and no page maps a money fact to a work consequence) | WP-07 F-05 | A06, A12 |
| Money facts stay separate; no page adds them into one figure unless Core returns the sum; no page computes an amount "due" | WP-07 §0.2 "Money" | §0.2 "Money"; A04, A06, A12, A20, A27 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2 "Freshness"; A01, A21, A26 |
| A page shows only facts that a named read returns; a missing fact is qualified, "Unavailable" or "Partly met"; a known gap is shown, not designed around | WP-02 B-06; WP-06 D-03, D-04; WP-14 K-14 | §0.2 "Facts"; A03, A15, A16, A27 |
| A state is labelled for the fact it establishes, never for a fact it does not | WP-06 D-05; WP-14 K-11 | §0.2 "Follow-up words"; A28, A30 |
| A list at its read's cap says so; no total, "none" or "all" beyond the returned slice; no all-clear from a capped or unknown list | WP-08 E-10; WP-14 K-05, K-08, K-09 | A06, A22, A25, A38 (4) |
| No BFF handler truncates, slices or drops a field; over-limit input is refused at the field with the values kept; the largest valid form reaches Core | LD-17; WP-12 J-06; WP-14 K-10, WP14-A93 | A37, A44 |
| The refusal summary and the submitted values render independently of the current eligibility; where the form no longer applies an "unsent" block keeps them | WP-02 code review R-01, R-03 | A41 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered | WP-07 D-W07-16; WP-10 H-02, H-03; WP-12 J-04 | A35, A38, A39 |
| No semantic duplicate guard is claimed where Core has none | WP-08 Q-W08-15; WP-09 G-03 | A43 (3) (Core's eligibility rule answers the duplicate) |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A38, A43 (5a) |
| A harness envelope that isolates a guard carries current revisions, so that the earlier guards pass | WP-10 H-07; WP-11 I-11 | A43 |
| An outage of the evidence that a consequential form needs removes the form with a notice; optional information degrades; access refusals are a separate test | WP-07 F-04; WP-10 H-05; LD-14 | A63 |
| Optional reads never hide an access change | LD-14 | A10, A63 |
| Proofs follow one ordered recipe with a run tag, a fresh synthetic travel agent and deltas from a recorded baseline; set-up writes are labelled | WP-02 B-13; WP-07 PM Q-07; WP-12 J-13; WP-14 K-13 | §0.4; §3 |
| Real refusal shapes from the code | WP-06 D-11; WP-10 H-07 | §0.5 |
| One host page per command use; every rendered form action is a registered route; carried test entries leave with the old pages | CC-12 to CC-18; WP06-A110 | A52, A61 |
| A boundary of an undecided policy names the product owner and no date; a boundary of a decided policy never says that an owner still has to decide | LD-04; WP-08 Q-W08-03 | A47 to A50, A54 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" or "Partly met" with its owner, not as a WP-16 failure | WP-10 H-01; WP-12 J-01; WP-14 K-01 | §0.2 "Pass rule"; A15 |
| Audit facts show only as fields recorded on that subject, with time and source | WP-11 I-10; WP-14 K-14 | A45 |
| A page predicts no Core outcome; it shows Core's current facts and effects | WP-10 H-10; WP-08 E-05 | A29, A35 |
| Copy states no configuration value that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A65 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-14 K-16 | §6 Q-06 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Incident/follow-up), §2.2 (Payment row), §3.2 (Completed case with continuing duty; Group end), §3.3, §4.2 (Payment history), §6.1, §6.2 (Money & exposure), §6.3 (Manual money record; Support view), §7.4, §7.5, §8.2, §8.3, §10.1, §12 V09, V19 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B25 to B29, B33, B35, B43; B10, B42 for boundaries |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-09, AD-12, AD-13), §1.1 to §1.4, §2.2, §2.3, §3.2 TA-11, §3.4 SA-07, §5.2 TA-11, §5.4 SA-07, §6.2, §6.4, §7 (rows Record service payment, Correct payment record, Record government fee fact), §8, §10, §11, §12.2 WP-16, §13.2 B-03, B-04, §13.3 A-03 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (criterion point 2 for Kind 1) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 c4c53b06f7d2fc52… | §3 rows of the five WP-16 commands; §5.1 WP-16; §5.3; §5.5 (the four parked-boundary routes); §6 CC-08 |
| LP | `PLAN.md` (this folder) | SHA-256 e894486f73af0e59… | §3, §4 (LD-02 to LD-04, LD-07, LD-08, LD-11 to LD-14, LD-17), §7 #13 (the Accounts area), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 0547640ae48459e7… | P-02, P-10 (g), P-14 |
| W1 | `WP-01.md` | SHA-256 1246143f54f52fa7… | §3 Q-04 (`/accounts` kept until WP-16 moves its content, then retired); A-02, A-04, A-08 |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 adec73b3322fd726…; 327f580c1820bf40…; 7a1d82e48fde6e93… | §3 (PM Q-11: correction built on SA-07a), D-02, D-05, D-09, D-10; design §2.1 group 11, §2.6 (SA-07a); WP06-A63 to A79, A103, A107 to A113, A149, A150 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 2e58a2765a680113…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | F-01, F-04, F-05, F-08, F-33; design §2.10 (SA-07h, SA-07t, SA-07l, SA-07i), §1.6 rows left to WP-16; WP07-A79 to A97, A166; §3 V09 (the ceiling part), §5 "Not in WP-07" |
| W8–W14 | `WP-08.md` to `WP-14.md` §3 and §4 | SHA-256 7a0c15231350b09f…, 97074922067b5db7…, 75baf8518b9edaf5…, edbea91a683da1c2…, aea7f10624c10b40…, 412ff9e096446a8d…, 60995cbab907636b… | Neutral receipts (D-02, G-01, I-09, K-07); one host page per command (CC-12 to CC-18); LD-14; LD-17 (E-04, G-07, H-04, J-06, K-10); J-08, J-09; L-05; K-05, K-11, K-14; WP14-A13, A38 (disclosure follow-up after completion) |
| W13A, W14A | `WP-13-acceptance.md`; `WP-14-acceptance.md` | SHA-256 e536fd59951b38d5…; 341d2c25c392b88d… | Format, corrections tables, lessons, §0.5 |
| Code | lane repository | 34e875b | `src/modules/payments/commands/follow-up.ts`, `service-status.ts`, `common.ts`; `src/modules/payments/queries.ts`, `writers.ts`, `api.ts`, `register.ts`; `src/kernel/vocabulary/payments.ts`; `src/contracts/payments.ts`, `define.ts`; `src/core-api/bindings/payments.ts`; `src/modules/identity/policy.ts` (rows 234 to 247); `src/domain/compose.ts` (`activeSuperAdmins`); `src/modules/core/derived.ts` (`groupEndEligibility`, `pendingOnAction` rule 1); `src/modules/core/commands/admin.ts` (`harness.core.check_completion`); `src/apps/staff/payments/routes.ts`, `admin.ts`; `src/apps/shared/pages/payments.ts`, `ta-payments.ts`; `src/apps/staff/identity.ts` (`accountsPage`); `src/web/route-inventory.ts` (T37, A01, D10, D27, D47 to D51, D102 to D109); tests `test/payments/follow-up.test.ts`, `retries.test.ts`, `service-entries.test.ts`, `exposure.test.ts`, `test/system/payments-views.test.ts` |

Verified facts of the code at 34e875b that the items rely on (read by the author):

- **The five WP-16 commands.** One is served: `pay.reassign_follow_up_owner` (module `commands/follow-up.ts`). Four are
  parked boundaries with no module command: `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`,
  `pay.record_refund`. Their binding (`boundaryDef`) asks the policy and then refuses with the boundary; it records no
  operation, fact or task. Their routes D106 to D109 answer the boundary page with HTTP 409 and "Nothing was recorded."
  Today no form posts them; the pages show them as disabled buttons.
- **The owner change.** Input: `exceptionId`, `accountableSuperAdminId`, `reason` (10 to 1,000 characters after trim;
  the wire allows 4,000); expected revision `exception` in the envelope. Policy action
  `financial_exception.reassign_owner`: SuperAdmin only; a support view runs no command. Checks in this order: the item
  exists (`access_denied`); the item is open (`financial_exception_not_open`); the revision is current
  (`stale_revision`); the new owner is a SuperAdmin, active, with a second factor, and not the current owner
  (`follow_up_owner_not_eligible`). Effects: the owner changes; the revision rises by one; the fact
  `pay.financial_exception_owner_changed` records the owner before and after and the reason; a `financial_follow_up`
  notice goes to the new owner (one per exception and revision). The item's kind, cause and state never change.
  Result: resource `{type: 'financial_exception', id}`, summary `{exceptionId, accountableSuperAdminId}`. No other
  command returns a `financial_exception` resource. No `privilegedElevation`.
- **Follow-up items** (`pay_financial_exceptions`). Kinds: `work_under_gate1_exception` and
  `commitment_under_gate2_exception` (a gate exception used while the service payment is not recorded as received;
  owner: the SuperAdmin who granted the exception); `payment_corrected_after_work` and `worked_then_corrected_to_unpaid`
  (a correction after operator work was authorized; owner: the SuperAdmin who recorded the correction). One item per
  (application, kind, cause). States: `open`, `closed_by_service_entry`. A later entry that records
  `payment_received` closes every open item of the application whose cause is a gate exception or an earlier entry;
  the entry that opened an item never closes it. An item survives completion. No write-off state exists. The owner gets
  one notice at opening and one at each owner change; no schedule repeats it.
- **Reads.** `pay.follow_up_list` (filter `open`, `mine`, `closed`, `all`; at most 100 items, oldest first, with
  `more`; exact `openCount` and `mineCount`; per row: kind, state, owner, opened time, application, travel agent,
  application title, travel-agent name, owner name, `ownerActive`, application lifecycle). `pay.follow_up_item` (the
  row with the cause entry number, `nudge_posted`, `closed_at`; the cause entry's status and recorded time; the closing
  entry's number; the application's current payment status and price in effect; `eligibleOwners`: active SuperAdmins
  with a second factor, at most 50 read, the current owner removed). `pay.application_payments` (WP-06: entries with
  `corrects_entry_id`, event and recorded time, recorder, evidence, reason; follow-up items; government fee rows;
  gates). `pay.finance_index.followUp` (the same exact counts). `pay.ta_finance` (WP-07). `pay.ta_payments` (the
  travel agent's own applications, newest first, at most 200, **no "more" flag**; per application: title, lifecycle,
  price in effect (null for a draft), current status, history `{entryNo, status, kind, recordedAt}` and fee rows
  `{attempt, state, TA liability, received and allocated, outstanding recovery}`; **not returned**: an entry's amount,
  evidence, recorder, reason, event time or corrected entry; a fee's amount, TM-paid amount or "paid above the
  reservation" flag; the group). Staff serves `pay.ta_payments` only in a support view of the travel agent.
  `views.audit_subject` accepts subject type `financial_exception`. SA-01 group 11 reads the projection
  `views.monitors.unpaidOverrides`.
- **Government fee facts** are written only inside Core's act commands: authorization (`reserveExposure`: state
  `reserved`) and act evidence (`recordTmFeePaid`: `tm_paid`, TA liability equal to the paid amount;
  `recordFeePaymentUnknown`; `recordFeeNotPaid`). No command lets a SuperAdmin record, edit or correct a fee, a TA
  liability, a TM-paid amount, a receipt, an allocation or a recovery. No writer changes
  `ta_received_allocated_paise` or `outstanding_recovery_paise` in this build: the states `recovered_partially` and
  `recovered` exist only in fixtures, and "outstanding recovery" equals the TA liability for every paid fee.
- **Corrections.** A correction always corrects the current entry, which is always the latest entry
  (`correction_target_not_current` otherwise). Entries are never edited or deleted.
- **Completion.** Only the test harness completes an application (`harness.core.check_completion`);
  `core.check_completion` is a deliberate boundary (LD-04, CC-07). Core's pending answer for a completed application is
  "none", so no pending answer carries an open follow-up. `groupEndEligibility` refuses `money_outstanding` for an open
  follow-up, an unused reservation remainder, a TM-paid fee not recovered or a fee payment whose result is unknown
  (WP-17 proves the group-end part).
- **Today's pages** (replaced by WP-16). `/ta/payments` computes "Amount due", a "Due from you now" total and a green
  "Nothing is due" callout from the price and the status; it places a completed unpaid application under "Payment
  recorded or nothing due"; it says "Work on the application starts once it is recorded."; it shows reserved and
  unknown fee states ("Not paid yet", "Being confirmed") and "Received from you" without the Accounts boundary. The
  staff follow-up list shows "Open for [n] days" and a check-icon empty state. The item page computes "Outstanding:
  Service price not recorded as received". The owner-change handler slices `owner` to 64 and `reason` to 4,000
  characters, and the result comes from `?done=reassigned`. `/accounts` lists seven boundaries; WP-01 Q-04 keeps it
  only until WP-16 moves them.
- **Body limit (by reading, not executed).** The staff server passes the route's `bodyLimit` to Fastify, which counts
  the raw body bytes. The owner-change POST has 4,096 bytes. A valid 1,000-character reason in a non-Latin script
  (Devanagari: three bytes per character, nine after form encoding) is about 9,000 bytes, so today it is refused for
  size before Core sees it (A44; §6 Q-14).

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp16-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06 at set-up). `syn-ta-2` for isolation only. SuperAdmins: `superadmin-1` (SA1: set-up, first owner of the
  run's items), `superadmin-2` (SA2: second approver of Y's ceiling increase, second tab, new owner), `superadmin-3`
  (SA3: appears only as an eligible owner; never signed in). Operators: `operator-1` (OP1: assigned A, B and C; the act
  of C), `operator-2` (OP2: isolation). They stand for `syn-superadmin-1` to `-3` and `syn-operator-1`, `-2`.
  Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends a seeded account or changes a
  seeded travel agent's ceiling.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (existing titles are named per item; the design names the
  new ones). `L+T`: both are required. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']. [Route]." Core's reasons show in words; a code shows only
  as the UAT-13 fallback (A59). No page shows a package id or a lane record id.
- **Money** (WP-07 §0.2). Amounts show in rupees ("₹1,500"; paise only when not zero; Indian digit grouping). The
  service price, the service payment status, a government fee, the TM-paid amount, the TA liability, the amount
  received and allocated, the outstanding recovery and counted exposure are separate facts. No page adds them into one
  figure unless Core returns the sum. No page computes an amount "due", an outstanding service amount, a total across
  applications or travel agents, or an all-clear such as "Nothing is due" (§6 Q-04).
- **Payment words (draft; the design governs the words, the facts stay).** Service payment status: `unrecorded` "Not
  recorded yet"; `payment_received` "Recorded as received"; `not_received` "Recorded as not received". Entry kind:
  "Record", "Correction". Lifecycle: "Draft", "Submitted", "Processing completed", "Ended with its group" (never
  success, deletion or cancellation). TA fee words: §6 Q-03. SuperAdmin fee words: `reserved` "Reserved: not paid yet;
  counted against the ceiling"; `tm_paid` "Paid by TravelMudra"; `payment_unknown` "Payment result unknown: it is not
  paid again until resolved"; `recovered_partially` "Partly recovered (as recorded)"; `recovered` "Recovered (as
  recorded)".
- **Follow-up words (draft).** Kinds: `work_under_gate1_exception` "Gate 1 exception used before payment";
  `commitment_under_gate2_exception` "Government commitment under a Gate 2 exception before payment";
  `payment_corrected_after_work` "Payment entry corrected after work"; `worked_then_corrected_to_unpaid` "Corrected to
  not received after work". States: `open` "Open"; `closed_by_service_entry` "Closed by payment entry [n]" with "This
  is not a bank-verified collection." Owner: "Accountable SuperAdmin: [name]", "[name] (not active)". Never
  "Collected", "Paid" or "Settled" for an item, "Written off", "Resolved", "Overdue", an age ("Open for [n] days") or
  an SLA.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time both show where a read
  returns both (SuperAdmin entries); TA-11 shows the recorded time only (the read returns no event time).
- **Freshness (LD-08).** `pay.*` reads are authoritative: "Read at [time] IST". SA-01 group 11 is a projection: the
  lag form ("Up to date when read at …", "Behind by [n] s when read at …", "Freshness unavailable").
- **Facts (K-14).** A page shows only facts that a named read returns. A fact that no read returns is qualified ("Not
  shown on this page") or the item is "Partly met". A fact read after an operation is "Current". A count that cannot be
  read is "Unavailable", never "0". A list at its cap says so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the recorded facts
  come from the operation's stored summary; facts read afterwards are labelled "Current"; "Recorded once. Sending the
  same form again does not repeat it."; no accepted time and no actor (P-02, S-08). The owner change is named
  "Accountable SuperAdmin changed" because only it returns a `financial_exception` resource with summary keys exactly
  `{exceptionId, accountableSuperAdminId}` (A46). No receipt or success line comes from the address (`?done=` goes).
  Another person who opens the receipt address gets the unchecked receipt with current authorized facts (J-09). The
  polite region announces it.
- **Replay terms** (the five terms of the lane, as WP-13 §0.2): 1 identical replay (same `_op`, same fields, raw
  envelope; a double-click is the same case); 2 changed-content conflict (same `_op`, one field changed:
  `conflict_operation_key` / `operation_key_reused`, values kept, "This form was already used with different content.
  Your values are kept: check them and send again."); 3 browser Back (reloads the page with a fresh form and current
  facts; sends nothing); 4 rejected-form refresh (no operation record; a new key; the corrected send is recorded once);
  5 lost acknowledgement (fixture: C4 "Checking the original result" and "Check status"; no new send of the same
  intent). Two more cases belong to the matrix (A43): a business duplicate (new key, current page's facts) and a raw
  stale envelope (new key, an older page's revision).
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request
  [reference] so far". Every refusal item checks by delta: the item's owner and revision, `pay.*` facts, notices of the
  candidate owner, payment entries, fee rows, counted exposure of Y.
- **Paths (LD-03).** Kept and rebuilt: TA-11 `/ta/payments` (rail "Payment history"); SA-07u
  `/admin/queues/financial-follow-up?state=` (follow-up list); SA-07v `/admin/queues/financial-follow-up/:exceptionId`
  (follow-up item). New: SA-07o "Change the accountable SuperAdmin", a GET page beside the kept POST
  `/admin/queues/financial-follow-up/:exceptionId/reassign-owner` (the design names the path; §6 Q-07). Pages of other
  packages that WP-16 completes or observes: SA-07a `/admin/applications/:applicationId/payments` (WP-06; WP-16 rebuilds
  its fee, follow-up and boundary sections), SA-07h `/admin/finance` and SA-07t `/admin/finance/tas/:taAccountId`
  (WP-07), SA-07i and SA-09c (WP-07), SA-09g and SA-03a (WP-06), SA-06 (WP-02), TA-07 and TA-08 (WP-03), OP-02,
  OP-04a, OP-04b (WP-07), SA-08s `/admin/audit/financial_exception/:id` (WP-14), `/admin/notices` (WP-15, existing
  page). Kept boundary POST routes with no form: D106 `…/reservations/:reservationId/release`, D107
  `/admin/applications/:applicationId/fees/:feeId/exclude`, D108 `…/financial-follow-up/:exceptionId/write-off`, D109
  `/admin/applications/:applicationId/refunds`. Retired: `/accounts` (A54). An item names the page; the run record
  names the path used.
- **Pass rule.** WP-16 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items
  of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". Recorded, not failed:
  A15 "Unmet: no Core command records or corrects a government fee fact (§6 Q-01)"; A03 evidence inspection "Partly
  met" (§6 Q-06); the OP-10 part of A54 "Deferred to WP-15" while OP-10 is not built (§6 Q-05). An item that the
  architect marks "partly met" by a recorded decision passes with that note. A failed item becomes a finding ranked P0,
  P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01 to WP-03, WP-06 and WP-07 are integrated: SA-06 creates accounts; TA pages
  create and submit; SA-07a records and corrects payment entries; SA-09g records Gate 1 exceptions; SA-03a assigns;
  SA-07i and SA-09c raise a ceiling; OP-02, OP-04a and OP-04b start work, confirm readiness, authorize and record act
  evidence. WP-14's SA-08s shows subject histories. Where a package is not integrated, the step runs on the existing
  page and the run record says so.
- **Data hygiene (§6 Q-11).** WP-16 writes only: Y (created and activated), one group, applications A, B and C, A's
  Gate 1 exception and assignment, B's payment entry, assignment and correction, Y's ceiling increase (request and
  second approval), C's payment entry, assignment, start of work, readiness, authorization with a fee and filing
  evidence with the fee paid, A's later payment entry, and the owner change of A's item. It MUST NOT change, close or
  reassign a follow-up item other than the run's own, MUST NOT change a seeded travel agent's ceiling, MUST NOT suspend
  an account, and MUST NOT post a boundary route with an id of another run except the made-up ids of A51. B's item stays
  open at the end; C's exposure stays counted on Y (BS B28). Later runs exclude both by the run tag. Notes, references
  and reasons carry the run tag. Identifiers stay in the internal run record only.

### 0.3 Synthetic data used by WP-16

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp16-ta-[stamp]`, fresh per run (SA-06); ceiling starts at the default ₹0 | A, B, C; TA-11 |
| Group | `wp16-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | A, B, C |
| A | Applicant "SYNFOLLOW, ASHA" on "SYN Tourist e-visa" (₹3,500); unpaid; SA1 records a Gate 1 exception for the assignment and assigns OP1; later SA2 records "Payment received" (`SYN-W16-[stamp]-PAY-A`) | Item FU-A (`work_under_gate1_exception`, owner SA1): the owner change, the two-tab stale case, the closed-item refusal, the closure by a payment entry |
| B | Applicant "SYNCORRECT, BINA" on "SYN Tourist e-visa"; "Payment received" (`SYN-W16-[stamp]-PAY-B`); assigned to OP1; then corrected to "Not received" (attestation "WP16 [stamp] payment returned by the bank", reason "WP16 [stamp] bank returned the transfer") | Item FU-B (`worked_then_corrected_to_unpaid`, owner SA1, stays open); a correction that keeps the original on SA-07a and TA-11; the write-off boundary |
| C | Applicant "SYNFEE, CHAND" on "SYN e-visa, fee paid with submission" (₹3,600; the government submission carries the fee TravelMudra pays); "Payment received" (`SYN-W16-[stamp]-PAY-C`); assigned to OP1; work started; readiness confirmed; authorization of the government submission with fee ₹1,500; "Filed" with `SYN-W16-[stamp]-PORTAL-C` and fee paid ₹1,500 | V09: a funded commitment on SA-07a, SA-07t and TA-11; the fee-exclusion and reservation-release notices; the boundary posts |
| Ceiling of Y | Default ₹0 → ₹5,000 (SA1 requests on SA-07i, SA2 approves on SA-09c) | C's commitment |
| Passports, photographs | As WP-14 §0.3: `td3Lines` of a `SyntheticPassport`, number "S" + seven digits new to the run; `plainPng` at least 350 × 350 px | Intake |
| Reasons and notes | "WP16 [stamp] …", at least 10 characters | Every reason field |
| Fixtures (tests, gallery) | An item of each kind and state; an owner suspended; an owner without a second factor; no eligible owner; 50 eligible SuperAdmins; 101 open items and 101 closed items; an application completed by the harness with an open item; an application ended with its group; fees in each state and one paid above its reservation; a preparation-only and a provider-filed application; 200 applications of one travel agent; a draft; a lost acknowledgement of the owner change; a 1,000-character reason in Devanagari | T items and the gallery |

### 0.4 Run recipe (rerunnable)

- Run tag `wp16-[yyyymmddhhmm]`. First checks: the harness can create, activate and sign in Y; SA1, SA2, OP1, OP2 and
  `syn-ta-2` sign in; "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission" admit Y (TA-03). Fallback when
  the harness cannot create Y: A and B run for `syn-ta-1`, C's fee path runs as tests (no seeded ceiling changes; WP-07
  PM Q-07), and the run record says so.
- Baseline (step P-0, before the set-up): SA-07u "Open" and "Yours" counts of SA1 and SA2; SA-07h follow-up line;
  SA-01 group 11 lines with their freshness; SA2's notices count on `/admin/notices`; the TA-11 row count of
  `syn-ta-2`. Every later count check is a delta from it.
- Setup (labelled "Setup"; through the integrated pages of other packages; not the subject under test): Setup 0 SA1
  creates and activates Y. Setup 1 Y creates the group and submits A, B and C. Setup 2 SA1 records A's Gate 1
  exception and assigns A; SA1 records B's payment, assigns B, corrects B to "Not received". Setup 3 SA1 requests Y's
  ceiling increase and SA2 approves it; SA1 records C's payment and assigns C; OP1 starts work on C, confirms
  readiness and requests the authorization with the fee. Setup 4 OP1 records C's filing evidence with the fee paid.
  Each set-up step names its page in §3.
- Order (§3): P-0, Setup 0, F-0a, F-0b, Setup 1, F-0c, Setup 2, Setup 3, V09F-1, Setup 4, V09F-2, V09F-3, F-1 to F-13,
  then the test steps V09F-4, V19F-1, V19F-2, then X-1 to X-4. Every harness send uses the fields of a freshly loaded
  page unless the step says "raw". A raw envelope is built from a page loaded earlier in the run and named in the run
  record.

### 0.5 Refusal shapes in the code at 34e875b (category / code)

Every command below also answers `not_found_or_forbidden` / `access_denied` for a caller without its policy action
(an operator or a travel agent: the route answers the uniform not-found page first) and `conflict_operation_key` /
`operation_key_reused` for a reused key with other content. A support view runs no command; its `/admin` pages and
posts answer 409 `support_view_active`.

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `pay.reassign_follow_up_owner` | `validation_failed` / `input_invalid` on `reason` (missing, shorter than 10 or longer than 1,000 characters after trim; longer than 4,000 at the contract), `accountableSuperAdminId` (not an account id), a missing `_rev.exception`; `not_found_or_forbidden` / `access_denied` (unknown item); `control_blocked` / `financial_exception_not_open` (checked before the revision); `stale_revision` / `stale_revision` (expected revision `exception`; also a lost race at the update); `control_blocked` / `follow_up_owner_not_eligible` (not a SuperAdmin, not active, no second factor, or the current owner) |
| `pay.release_reservation` | `unavailable_parked` / `parked_reservation_release` (boundary `parked`) for a SuperAdmin, whatever the ids; HTTP 409 boundary page |
| `pay.exclude_fee` | `unavailable_parked` / `parked_fee_exclusion_record` (boundary `parked`); HTTP 409 |
| `pay.write_off` | `unavailable_owner_decision` / `unselected_write_off` (boundary `owner_decision`); HTTP 409 |
| `pay.record_refund` | `unavailable_owner_decision` / `unselected_refund` (boundary `owner_decision`); HTTP 409 |
| Asserted as set-up answers or effects (owned elsewhere) | `pay.record_service_status` (WP-06 §0.5): its receipt states "follow-ups closed by this entry: [n]" (A and the follow-up closure); `core.authorize_external_act` with a fee (WP-07): `exposure_ceiling_breach`, `exposure_parked_paid_case_default_ceiling` (not reached in this run: Y's ceiling is set first); a malformed route id (`fex_`, `exr_`, `gfe_`, `app_`): the uniform not-found page |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-16 |
|---|---|---|
| TA-11 Payment history | 4650 `/ta/payments` (kept, rebuilt; rail "Payment history"); 4652 in a support view only | Whole page: per-application money facts, payment history with corrections, government fee liability, boundaries |
| SA-07a Money facts of one application | 4652 `/admin/applications/:applicationId/payments` (WP-06 page) | Rebuilt sections: government fees, payment-missing follow-up of the application, boundaries (refund, Accounts, fee correction); the V19 line. The header, the gates and the record and correction forms stay WP-06's (WP06-A63 to A79) |
| SA-07u Payment-missing follow-up | 4652 `/admin/queues/financial-follow-up?state=` (kept, rebuilt) | The list (`Payment_Missing_Override`, BS B29): views, rows, counts, cap, states |
| SA-07v Follow-up item | 4652 `/admin/queues/financial-follow-up/:exceptionId` (kept, rebuilt) | Facts, cause, closing route, notice, history link, write-off boundary |
| SA-07o Change the accountable SuperAdmin | 4652 new GET beside POST `…/:exceptionId/reassign-owner` (design names the path; §6 Q-07) | Host of `pay.reassign_follow_up_owner` |
| SA-07h Finance, SA-07t Exposure of one travel agent | 4652 `/admin/finance`, `/admin/finance/tas/:taAccountId` (WP-07 pages) | Only: the follow-up links and counts (WP07-A79); the reservation notice's three parts (CC-08); observation of V09 |
| SA-01 Decision inbox | 4652 `/admin` (WP-06 page) | Only: the group 11 link target |
| Boundary answer | 4652 the answer of D106 to D109 (409) | CC-08: reason, owner, route, "Nothing was recorded." |
| `/accounts` | 4652 (retired) | WP-01 Q-04: its boundaries move to SA-07 and OP-10; the route is retired (A54) |
| Pages of other packages | SA-06 (WP-02); TA-07, TA-08 (WP-03); SA-09g, SA-03a (WP-06); SA-07i, SA-09c, OP-02, OP-04a, OP-04b (WP-07); SA-08s (WP-14); `/admin/notices` (WP-15) | Set-up and observation only |

Reads (each named; K-14): `pay.ta_payments` (TA-11); `pay.application_payments` (SA-07a); `pay.follow_up_list`
(SA-07u); `pay.follow_up_item` (SA-07v, SA-07o); `pay.finance_index` (SA-07h); `pay.ta_finance` (SA-07t);
`views.monitors` (SA-01 group 11); `views.audit_subject` (SA-08s); `core.operation` (receipts and the status page).

### 1.2 Command coverage (CC §5.1: 5 WP-16 commands; CC-08)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `pay.reassign_follow_up_owner` | `admin.follow_up.reassign` (`/admin/queues/financial-follow-up/:exceptionId/reassign-owner`) | SA-07o | A35 to A46 |
| 2 | `pay.release_reservation` (parked boundary) | `admin.finance.reservation_release` (D106) | Notice on SA-07t "Reservations"; no form | A47, A51 to A53 |
| 3 | `pay.exclude_fee` (parked boundary) | `admin.payments.fee_exclusion` (D107) | Notice on SA-07a fee section; no form | A48, A51 to A53 |
| 4 | `pay.write_off` (owner-decision boundary) | `admin.follow_up.write_off` (D108) | Notice on SA-07v and SA-07u; no form | A49, A51, A52 |
| 5 | `pay.record_refund` (owner-decision boundary) | `admin.payments.refund` (D109) | Notice on SA-07a; no form | A50, A51, A52 |
| ref | `pay.record_service_status` (record and correction) | `admin.payments.record` | SA-07a (WP-06; WP06-A63 to A79, A149, A150) | Set-up of A and B; A19, A29 |
| ref | UI-PLAN §12.2 "Record government fee fact" | none (no Core command) | — | A15 ("Unmet", §6 Q-01) |

All of them also: A56 to A66. UI-PLAN §12.2 "Correct payment record" is built in WP-06 (`WP-06.md` §3 PM Q-11); WP-16
checks only how corrections read on SA-07a and TA-11 (A03, A19). Commands outside WP-16 that the proof touches only as
set-up or observation: `iam.create_account`, `iam.approve_account`, `iam.activate_account` (WP-02);
`intake.start_individual`, `core.submit` (WP-03); `core.grant_gate_exception`, `core.assign`,
`pay.record_service_status` (WP-06); `pay.request_ceiling_increase`, `pay.approve_ceiling_increase`, `ops.start_work`,
`ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence` (WP-07).

### 1.3 State coverage

S1 (loading) does not apply: every page is server-rendered. S5 applies only to SA-01 group 11 (A26).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-11 | S2 A01; rows A02 to A05; completed, ended with group, draft, cap, S7 A06; S6 A10; support view A11 | — | — | — | — | — |
| SA-07a (WP-16 sections) | Fee states A13, A14; no fee row A14; items A17; completed A18; boundaries A15, A16, A48, A50 | WP-06 | WP-06 | WP-06 | WP-06 | WP-06 |
| SA-07u | Views A21; counts and cap A22; owner not active A23; completed A24; S2, S7, refusals A25 | — | — | — | — | — |
| SA-07v | Open A27 to A29; closed A30; notice A31; not active, completed A32; S6 A34 | — | — | — | — | — |
| SA-07o | Form A35; closed, no eligible owner, support view, list cap A38 | A37 | A39, A41 | A36 | A42 (5) | A40 |
| Boundary answer | A51 | — | A51 | — | — | — |
| `/accounts` | Retired A54 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-16 shows | Items |
|---|---|---|
| V09 (WP-16 part): "A funded government-fee commitment shows counted exposure and ceiling; each B28 unresolved reservation case remains specifically unavailable rather than all commitments blocked" (B27 to B29, B43). WP-07 proves the ceiling, the authorization and the SA-07t part | C's commitment under a set ceiling is accepted; its fee facts agree on SA-07a, SA-07t and TA-11; each B28 case is its own notice with reason, owner and route, and no form; no page blocks every funded commitment | A13, A20, A47, A48, A53; §3 V09F |
| V19 (financial follow-up part): "Completed processing can retain financial/disclosure follow-up" (B25, B29). WP-14 proves the disclosure part; WP-17 the group-end part | An item stays open and listed after completion; the pages say "Processing completed. Financial follow-up remains open."; the owner change and the closing entry still work; completion and counted exposure do not change | A06, A18, A24, A32; §3 V19F |
| UX §4.2 Payment history | Per-application price and payment facts, authorized government-fee facts, corrections that keep the original; no Pay now, refund claim, write-off or credit control; no Accounts dashboard or grant | A01 to A11 |
| UX §6.3 Manual money record; UI-PLAN SA-07 | Separate money facts; original entries kept; Accounts duties as owned follow-up; unavailable actions as notices | A12 to A20, A27 to A30, A55 |
| BS B29 `Payment_Missing_Override`; nudge; survives completion; write-off unselected | List across applications with owner; notice to the owner; closure by a later entry only | A21 to A33, A49 |
| BS B27 separate tracking | Fee, TA liability, TM-paid, receipt and allocation, outstanding recovery as separate facts | A04, A13, A16, A20 |
| BS B26, B33 corrections preserve originals | Entry 1 stays beside its correction on SA-07a and TA-11 | A03, A19 |
| CC-08 | Four notices with reason, owner and route; no form control; routes stay registered | A47 to A52 |
| AD-12; WP-01 Q-04 | `/accounts` retired after its notices have homes | A54 |
| BS B35 | Replay and the matrix of the owner change | A42, A43 |
| V24 | Keyboard, screen reader and phone | A67 to A78 |

## 2. Acceptance checklist

### 2.1 TA-11 Payment history (travel agent)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A01 | Travel agent (Y) | TA-11 right after activation (§3 F-0a) | Open "Payment history" from the rail. | `h1` "Payment history"; lead "Money facts for each of your applications: the service price, the payment TravelMudra recorded, and government fees TravelMudra paid for you."; "Read at [time] IST". S2: "You have no applications yet. A payment record starts when you create an application." No "0", no total, no "Nothing is due" callout. Rail current item "Payment history". | L | UX §4.2; PL TA-11; D7 |
| WP16-A02 | Travel agent (Y) | TA-11 after Setup 1 (§3 F-0c) | Read the rows. | One row per application (a card on a phone), newest first: title "[given names surname] · [service]" linking TA-07; reference (copyable); "Application: Submitted"; "Service price in effect: ₹[n]"; "Service payment: Not recorded yet". Exactly A, B and C. No amount "due", no total, no row of another travel agent. | L | PL TA-11 (Blocks); UX §2.2 (Payment); `pay.ta_payments` |
| WP16-A03 | Travel agent (Y) | TA-11 of B (§3 F-9) | Open B's payment history. | "Service payment: Recorded as not received". History, oldest first: "Entry 1 · Record · Recorded as received · recorded [time] IST"; "Entry 2 · Correction · Recorded as not received · recorded [time] IST". Entry 1 stays listed: the correction keeps the original. The page does not say which entry a correction corrects (the read does not return it). No recorder, evidence, note, reason or amount of an entry (the read returns none). Evidence inspection (UX §4.2 "Inspect evidence/history") is "Partly met": history yes, evidence not shown (§6 Q-06). | L | UX §4.2; BS B26, B33; `pay.ta_payments.history` |
| WP16-A04 | Travel agent (Y) | TA-11 of C after Setup 4 (§3 V09F-3) | Read C's government fee block. | Block "Government fees (separate from the service price)": "Attempt 1: TravelMudra paid this government fee for you"; "You owe TravelMudra for it: ₹1,500" (TA liability); "Received and allocated (as recorded by TravelMudra Accounts): ₹0"; "Outstanding (as recorded): ₹1,500"; beside them the boundary "Recording a payment you make for a government fee is unavailable until the Accounts process is decided. Owner: product owner." (§6 Q-02). The service price and the fee are never added into one figure. | L | BS B27, B29, B43; UX §4.2, §6.3; §6 Q-02 |
| WP16-A05 | Travel agent (Y); test | TA-11 of C at V09F-1 (fee reserved, not paid); fixtures of each fee state | Read C. Test: one fee in each state `reserved`, `payment_unknown`, `tm_paid`, `recovered_partially`, `recovered`. | As §6 Q-03 recommends: a fee with no TA liability (`reserved`, `payment_unknown`) shows no fee row and no sentence about it (no "reserved", "not paid yet", "unknown", "being confirmed", "exposure" or "ceiling"). A fee with a liability shows A04's facts with its state words; `recovered_partially` and `recovered` say "(as recorded by TravelMudra Accounts)". Live at V09F-1: C shows no government fee row. | L (C) + T | §6 Q-03; WP-10 F-21 (neutral travel-agent words) |
| WP16-A06 | Test | TA-11 renderer and word map | Render: a submitted application with no entry; a completed application with "not received"; an application ended with its group; a draft; an application assigned under a Gate 1 exception; 200 applications; the read unavailable; an unknown status value. | Each row states recorded facts only. No "Amount due", "Due from you now", "Payment due", "Nothing is due", "Payment recorded or nothing due", total or all-clear (§6 Q-04). No sentence says that work starts, waits or stops because of the payment (a Gate 1 exception lets work go ahead, BS B26; F-05). Completed: "Application: Processing completed" with "Service payment: Recorded as not received", never "Paid", "Settled" or "Closed" for the payment (V19). Ended with its group: those words, never success or deletion (B25). Draft: "Price fixed when you submit". At 200 rows: "This list shows your newest 200 applications. Older applications may exist." (the read returns no "more" flag). Unavailable: S7 with "Try again", never an empty list or "0". Unknown status: "Reference code: [code]". | T | §6 Q-04; BS B25, B26, B29; D7; WP-14 K-05 |
| WP16-A07 | Travel agent (Y) | TA-11 (every state of the run) | Look for money actions. | No form on the page. No "Pay now", "Pay online", "Request a refund", "Claim", "Write off", "Credit" or "Settle" control, enabled or disabled. Two notices as text in the page flow: "Paying online is not part of this service. Pay TravelMudra as agreed and quote the application reference." (excluded, B42) and "Recording a refund is unavailable until the product owner decides a refund policy. Owner: product owner." (B29, B43). | L | UX §4.2; PL TA-11 (States); BS B29, B42, B43; §11.3 |
| WP16-A08 | Travel agent (Y); test | TA-11 | Read all text. Test: render with every field of the view model filled. | No ceiling, counted exposure, reservation, B28 notice, follow-up item, accountable SuperAdmin, staff name, evidence, reason, "Accounts dashboard" or grant shows. The page uses no read other than `pay.ta_payments`. | L+T | UX §4.2 ("must not expose an undecided Accounts dashboard or internal financial grants"); BS B10, B29 |
| WP16-A09 | Travel agent (Y) | TA-11 → TA-07 of B (§3 F-9) | Select B's title. Press Back. Open "All your payments" on TA-07. | TA-07 of B opens; Back returns to TA-11 at the same place; TA-07's link opens TA-11. | L | PL TA-11 (Primary); SH-R07 |
| WP16-A10 | `syn-ta-2`; Y; test | Isolation (§3 F-12) | `syn-ta-2` opens TA-11. Y opens SA-07a of B and SA-07u by address. Test: Y is suspended while TA-11 is open. | `syn-ta-2`: none of A, B, C (row count delta 0 from P-0). Y: the uniform not-found page (SH-02) for each staff address. Suspended (test "signs a suspended travel agent out of the payments page"): signed out to sign-in with the cause; no earlier facts remain (LD-14). | L + T | BS B10; LD-14; SH-R04 |
| WP16-A11 | Test | TA-11 in a support view | SA2 starts a support view of Y and opens TA-11 at staff. | Banner "Read-only view for [Y]"; the facts of A02 to A04; no form except "Exit support view" and sign-out; every `/admin` page answers 409 `support_view_active` (test "shows the viewed travel agent's payments in a support view, read only, and no SuperAdmin payment page"). | T | SH-R09; UX §6.3 (Support view) |

### 2.2 SA-07a Money facts of one application (WP-16 sections)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A12 | SuperAdmin (SA1) | SA-07a of C (§3 V09F-2) | Read the page from the top. | WP-06 parts as WP06-A63, A64 (header, service payment, gates, entries, forms; not repeated here). WP-16 sections follow the entries, in this order: "Government fees (TravelMudra-filed work)"; "Payment-missing follow-up of this application"; "Not available in this release" (A15, A16, A50, and the fee-exclusion notice of A48). Money facts (CMP-16) are separate labelled rows; no figure adds the service price and a government fee; no money fact comes from a gate row (F-05). "Read at [time] IST". | L | PL SA-07 (Blocks); UX §6.3 (Manual money record); CMP-16; WP-07 F-05 |
| WP16-A13 | SuperAdmin (SA1) | SA-07a of C at V09F-1 and at V09F-2 | Read the fee table each time. | One row per attempt, "Attempt 1": state words (V09F-1 "Reserved: not paid yet; counted against the ceiling"; V09F-2 "Paid by TravelMudra"); "Government fee: ₹1,500"; "Paid by TravelMudra: ₹0" then "₹1,500"; "Owed by the travel agent: ₹0" then "₹1,500"; "Received and allocated (Accounts): ₹0"; "Outstanding recovery (as recorded): ₹0" then "₹1,500". The Accounts boundary beside the last two (A16). The fee-exclusion notice under the table (WP07-A94 (a), A48). | L | BS B27; UX §6.3; `pay.application_payments.fees` |
| WP16-A14 | Test | SA-07a fee words | Render each fee state; a fee paid above its reservation; a preparation-only and a provider-filed application; an unknown state. | Each state has the §0.2 words. Above the reservation: "Paid more than reserved: the difference is counted too." A service mode with no TravelMudra-paid fee: "No government fee is recorded for this application." (no inferred Gate 2, funding or payer rule, B27). Unknown: "Reference code: [code]". | T | BS B27, B28 |
| WP16-A15 | SuperAdmin (SA1); test | SA-07a of C | Look for a way to record, edit or correct a government fee. | No form records, edits or corrects a fee, a TA liability, a TM-paid amount, a receipt, an allocation or a recovery: Core has no such command. The fee section says: "Government fee records come from the operator's evidence of the fee act. Correcting one is unavailable in this release. Owner: product owner." UI-PLAN §12.2 "Record government fee fact" is recorded "Unmet: no Core command (§6 Q-01)". | L | CC §3 (no fee command); PL §7, A-03; §6 Q-01 |
| WP16-A16 | SuperAdmin (SA1) | SA-07a of C, fee section | Read the boundaries of the section. | "Recording a bank receipt or a recovery against a government fee is unavailable until the Accounts process is decided. Owner: product owner." (`parked_accounts_actions`). "No formula links the service price and the government fee in this release: they stay separate amounts. Owner: product owner." (B43 formula). No control for either. | L | BS B29, B43; PL §5.4 SA-07 (row "Record government fee and TM-paid facts") |
| WP16-A17 | SuperAdmin (SA1) | SA-07a of B (§3 F-2) and of A (§3 F-8) | Read "Payment-missing follow-up of this application". | One row per item: kind words linking SA-07v; state; accountable SuperAdmin (with "(not active)" when so); "Opened [time] IST"; for a closed item "Closed by payment entry [n] at [time] IST" (WP06-A75 words kept). B: one open row, "Corrected to not received after work", owner SA1. A after F-7: one row "Closed by payment entry 1". S2: "No payment-missing follow-up for this application." | L | BS B29; UX §6.2 (Money & exposure) |
| WP16-A18 | Test | SA-07a of an application completed by the harness with an open item (§3 V19F-1) | Render. Record "Payment received" (test). Render again. | Lifecycle "Processing completed"; the line "Processing completed. Financial follow-up remains open." above the open row; the record form shows as Core allows (a payment entry may arrive in any lifecycle); no reopen or processing control. After the entry: "Closed by payment entry [n]"; the completion fact and counted exposure are unchanged (test "a correction to received after work … closure survives completion and changes nothing else"). | T | UX §3.2 (Completed case with continuing duty), §8.2; BS B25, B29; V19 |
| WP16-A19 | SuperAdmin (SA1); travel agent (Y) | SA-07a of B; TA-11 of B (§3 F-9) | Compare the two pages. | SA-07a: entry 1 "Record · Received" marked "Corrected by entry 2"; entry 2 "Correction of entry 1 · Not received" with reason, evidence, recorder, event time (when given) and recorded time (WP06-A71, A72 words). TA-11: the same two entries with status, kind and recorded time only (A03). Neither page drops entry 1. | L | BS B26, B33; UX §4.2, §6.3 |
| WP16-A20 | SuperAdmin (SA1); travel agent (Y) | SA-07a of C, SA-07t of Y, TA-11 of C (§3 V09F-2, V09F-3) | Read the three pages. | They state the same funded commitment. SA-07a: paid by TravelMudra ₹1,500, owed by the travel agent ₹1,500. SA-07t (WP07-A81): ceiling ₹5,000 "Set"; "Paid by TravelMudra, not recovered: ₹1,500"; unused reservations ₹0; counted exposure ₹1,500 (delta 0 from V09F-1, where the ₹1,500 was an unused reservation). TA-11: "You owe TravelMudra for it: ₹1,500". No page shows another amount. | L | V09; BS B27, B28 |

### 2.3 SA-07u Payment-missing follow-up list

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A21 | SuperAdmin (SA1) | SA-07u (§3 F-1, F-6) | Open the list from the rail member or from SA-07h. Change the view; reload; press Back. | Breadcrumb "Money & exposure › Payment-missing follow-up"; `h1` "Payment-missing follow-up"; lead "Applications where work or a government commitment went ahead without a payment recorded as received, or where a payment entry was corrected after work. An item stays open, also after the application completes, until a later entry records payment received."; "Read at [time] IST". Views "Open ([n])" (default), "Yours ([m])", "Closed", "All", with `state` in the address (SH-R06); reload and Back keep the view; an unknown value shows "Open". Rows: Why (kind words, link SA-07v); Application (title link SA-07a; lifecycle words); Travel agent (link SA-07t); Accountable SuperAdmin; "Opened [time] IST". F-1: FU-A and FU-B in "Open" with owner SA1; "Open" and SA1's "Yours" are P-0 + 2. F-6: SA1's "Yours" P-0 + 1, SA2's P-0 + 1. | L | PL SA-07 (`Payment_Missing_Override` list); BS B29; UX §6.2; `pay.follow_up_list` |
| WP16-A22 | SuperAdmin (SA1); test | SA-07u counts and cap | Read the counts. Test: 0, 1 and 101 open items; 101 closed items. | "Open" and "Yours" counts come from the read's exact counts, with the unit ("[n] items"). "Closed" and "All" show no count (the read returns none). At the cap: Open "The oldest 100 are shown. [n] items are open."; Closed and All "The oldest 100 are shown. More items exist." No total or "none" beyond the read. No age ("Open for [n] days"), "overdue" or SLA wording. No colour-only marker. | L+T | WP-14 K-05, K-08; CR-03, CR-07; AC-06 |
| WP16-A23 | Test; gallery | SA-07u with an owner who is not active (suspended SuperAdmin fixture) | Render. | Owner cell "[name] (not active)" in text. Above the table: "[k] of the items shown have an owner who is not active. Change their owner on each item." only when such rows are in the shown slice; at the cap the line says "of the items shown". | T + gallery | BS B29; test "flags an inactive owner; the owner change needs an active SuperAdmin with a second factor…" |
| WP16-A24 | Test | SA-07u with an item of an application completed by the harness (§3 V19F-1) | Render the Open view. | The row stays listed with "Processing completed" for the application; completion removes no row from the list. | T | V19; test "lists all four kinds across travel agents, keeps a completed application, counts the accountable SuperAdmin's own items" |
| WP16-A25 | Test | SA-07u states | Each view empty; the list read unavailable; an access, session, maintenance or support-view refusal. | S2: Open "No payment-missing follow-up item is open."; Yours "No open item names you as the accountable SuperAdmin."; Closed "No item is closed yet."; All "No payment-missing follow-up item exists." No check icon or success styling. Unavailable: S7 with "Try again", never an empty table or "0". Refusals: the shell (SH-02, sign-in, maintenance, 409 in a support view) (LD-14). | T | D7; LD-14; PL §1.3 |
| WP16-A26 | SuperAdmin (SA1) | SA-07h "Payment-missing follow-up" section (WP07-A79); SA-01 group 11 (WP-06 design §2.1) (§3 F-1, F-6) | Read both. Follow each link. | SA-07h "[open] items open; [mine] for which you are accountable." equals SA-07u's "Open" and "Yours" at the same moment (same authoritative counts); the links open SA-07u with `state=open` and `state=mine`. SA-01 group 11 is a projection: its lines carry the lag form, may differ from SA-07u while behind, and read "Unavailable" when null; its link opens SA-07u. | L | WP06 design §2.1 group 11; WP07-A79; LD-08 |

### 2.4 SA-07v Follow-up item

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A27 | SuperAdmin (SA1) | SA-07v of FU-B (§3 F-2) | Read the page from the top. | Breadcrumb "Money & exposure › Payment-missing follow-up › [kind words]"; `h1` "[kind words]: [applicant]"; reference (copyable); "Read at [time] IST". Facts in order: State; Application (title link SA-07a; lifecycle words); Travel agent (link SA-07t); Accountable SuperAdmin; Service payment now (status words); Service price in effect (₹, or "Not fixed: draft"); Cause (A28); "Opened [time] IST"; Notice to the accountable SuperAdmin (A31); Closed (closed items only). Then "How this item closes" (A29); the link "Change the accountable SuperAdmin" → SA-07o (open items only); the write-off notice (A49); "History of this item" → SA-08s. No outstanding amount computed from the price and the status (§0.2 Money). | L | PL SA-07; UX §6.3; `pay.follow_up_item` |
| WP16-A28 | SuperAdmin (SA1); test | SA-07v "Cause" of FU-A and FU-B (§3 F-2); test: each kind | Read. | Gate kinds: "A Gate 1 exception was used while the service payment was not recorded as received." / "A Gate 2 exception was used for a government commitment while the service payment was not recorded as received." Entry kinds: "Payment entry [n] ([status words], recorded [time] IST) was recorded after operator work was authorized." No cause sentence says "work started" for a Gate 1 exception that an assignment used. | L+T | WP-14 K-11; `cause_entry_no`, `causeEntry` |
| WP16-A29 | SuperAdmin (SA1); test | SA-07v "How this item closes" of FU-B (§3 F-2); test: an open `payment_corrected_after_work` item while the status is "Recorded as received" | Read. | Status not received or not recorded: "A later entry that records 'Payment received' closes this item." with the link "Record the service payment" → SA-07a record form. Status received: "A later correction that records 'Payment received' closes this item. Core accepts a correction only when it changes the status, the amount or the evidence." with the link to SA-07a's correction form (§6 Q-10). The page never says "Collect", "Mark paid" or "Settle", and never changes an entry to force closure. | L+T | BS B29; `closeExceptionsByEntry`; WP06-A70 (`correction_no_change`); WP-06 D-09 |
| WP16-A30 | SuperAdmin (SA1) | SA-07v of FU-A after F-7 (§3 F-8) | Read. | State "Closed by payment entry 1 ([time] IST)" with "This is not a bank-verified collection."; no "How this item closes"; no link to SA-07o; the history link stays. | L | BS B29; `FIN_EXCEPTION_STATES` |
| WP16-A31 | SuperAdmin (SA2) | SA-07v of FU-A after F-4; `/admin/notices` of SA2 (observe WP-15) (§3 F-4) | Read the notice line. Open SA2's notices. | SA-07v: "Notice to the accountable SuperAdmin: Posted". SA2's notices are one more than the count read at the start of F-4, with the follow-up notice (today "A payment follow-up item needs your attention."; WP-15 governs the notice page). No page promises a repeated reminder or a schedule (§6 Q-13). | L | BS B29 (nudge); UX §8.2 |
| WP16-A32 | Test; gallery | SA-07v with an owner who is not active; with an item of an application completed by the harness (§3 V19F-1) | Render. Test: change the owner of the completed application's item. | Not active: "The accountable SuperAdmin is not active. Change the owner so that an active SuperAdmin is accountable." with the link to SA-07o. Completed: "Processing completed. Financial follow-up remains open."; the owner change is offered and accepted; nothing reopens processing. | T + gallery | BS B29; UX §3.2, §8.2; V19 |
| WP16-A33 | Test | SA-07u and SA-07v word maps | Render every kind, state, status and lifecycle; an unknown value. | §0.2 words. Never "Collected", "Paid" or "Settled" for an item, "Written off", "Resolved", "Overdue" or an age. Unknown: "Reference code: [code]". | T | BS B29; K-11 |
| WP16-A34 | Operator (OP1); travel agent (Y); SuperAdmin (SA1) | SA-07u, SA-07v, SA-07o addresses (§3 F-12) | OP1 and Y open each address. SA1 opens SA-07v with a made-up `fex_` id. | The uniform not-found page (SH-02) each time; no fact disclosed. | L | BS B10; test "keeps every payment and audit page from the wrong role, the wrong travel agent and a support view" |

### 2.5 SA-07o Change the accountable SuperAdmin (`pay.reassign_follow_up_owner`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A35 | SuperAdmin (SA1) | SA-07o of FU-A from SA-07v (§3 F-3) | Read the page. | `h1` "Change the accountable SuperAdmin: [kind words]". Scope: the item (kind, application, travel agent, opened). Evidence: "Accountable now: [SA1]" ("(not active)" when so); "Notice posted: yes / no". "New accountable SuperAdmin": a radio group of Core's eligible SuperAdmins (active, with a second factor, not the current owner), none preselected; SA2 listed, SA3 listed only when Core reports SA3 active with a second factor, SA1 not listed. "Reason" (required; the hint "10 to 1,000 characters"). Effect before the button: "The new owner becomes accountable for this item and gets a notice. The previous owner is no longer accountable. The item's kind, cause and state and the application do not change. Nothing is paid, collected or written off." Hidden `_rev.exception`. Button "Change the accountable SuperAdmin"; "Cancel" → SA-07v. | L | PL SA-07; CC §3 (`admin.follow_up.reassign`); BS B29 |
| WP16-A36 | SuperAdmin (SA2) | SA-07o of FU-A, tab 2 (§3 F-4) | Choose SA2. Reason "WP16 [stamp] takes over the follow-up". Send. | 303 to SA-07v; receipt "Accountable SuperAdmin changed" with "New owner: [SA2]" (from the summary); Current: owner SA2, "Notice to the accountable SuperAdmin: Posted". Kind, cause and state unchanged. SA2's notices +1 (A31). No accepted time, no actor. | L | `follow-up.ts`; §0.2 "Receipts" |
| WP16-A37 | SuperAdmin (SA1); harness; test | SA-07o field refusals (§3 F-3) | (1) Send with nothing chosen and the reason "short". (2) Test or harness: a reason of 1,001 characters; a reason of 4,001 characters; an owner value of 65 characters; no `_rev.exception`. | (1) C1 error summary: "Choose the new accountable SuperAdmin." and "Give a reason of at least 10 characters."; the reason kept; nothing sent. (2) Each value reaches Core whole and is refused at its field ("Give a reason of at most 1,000 characters."; "Choose one of the SuperAdmins listed."); no `.slice`; values kept; the missing revision refused, never filled in. Nothing recorded: owner, revision, `pay.*` facts and notices delta 0. | L (1) + T (2) | LD-17; §0.5 |
| WP16-A38 | Test; gallery | SA-07o states | (1) The item is closed. (2) No eligible SuperAdmin (the others are suspended or have no second factor). (3) A support view. (4) The eligible list holds 49 or 50 names (fixture). | (1) No form: "This item was closed by payment entry [n] at [time] IST. Its owner does not change." (2) No form: "No other active SuperAdmin with a second factor can own this item. Owner: SuperAdmin. Route: Accounts & access." with a link to SA-06. (3) 409 `support_view_active`. (4) "Not every SuperAdmin may be listed." (§6 Q-08). On GET the page asserts the blocker and shows no form; a saved envelope sent after (1) is refused `financial_exception_not_open`. | T + gallery | §0.5; SH-R08, SH-R09; WP-09 G-05 |
| WP16-A39 | Test | SA-07o `follow_up_owner_not_eligible` | The chosen SuperAdmin is suspended, or loses the second factor, after the page loaded. Raw: the current owner's id. Raw: an operator's account id. | SA-07o re-renders with "That SuperAdmin cannot own this item now. Choose another active SuperAdmin with a second factor." at the owner field; the reason kept; the list read again; nothing recorded. | T | §0.5; test "flags an inactive owner; the owner change needs an active SuperAdmin with a second factor, the current revision and an open item…" |
| WP16-A40 | SuperAdmin (SA1, SA2), two tabs | SA-07o of FU-A (§3 F-4) | SA1 opens SA-07o, chooses SA2 and writes a reason. SA2 changes the owner (A36). SA1 sends. | Tab 1: CMP-14 "Changed since you opened this page": "Accountable now: [SA2] (you saw [SA1])"; SA1's choice and reason kept as unsent values; "Review current information". Nothing recorded from tab 1 (owner-changed facts +0, notices +0). | L | CMP-14; BS B19, B35 |
| WP16-A41 | SuperAdmin (SA1, SA2) | SA-07o of FU-A while A's payment is recorded (§3 F-7) | SA1 opens SA-07o, chooses SA1, writes a reason. Setup: SA2 records "Payment received" for A on SA-07a. SA1 sends. | Refused `financial_exception_not_open`: "This item was closed by a payment entry after you opened the page. Its owner does not change. Nothing was recorded." The closed facts show as Current; no form; the typed reason stays in an unsent block. | L | §0.5 (state checked before the revision); WP-02 R-01, R-03 |
| WP16-A42 | SuperAdmin (SA2); harness; test | SA-07o, the Nth time (§3 F-5) | Replay terms 1 to 5 on the accepted change of A36. | (1) The same 303 and receipt; one owner-changed fact; one notice. (2) Refused as a used form; values kept; nothing recorded. (3) Back reloads SA-07o with current facts: SA2 is the owner and is not listed. (4) After A37 (1), the corrected send is recorded once. (5) Test: C4 "Checking the original result" and "Check status"; no new send offered; the status page links SA-07v (`resultHrefOf` maps `financial_exception`). | L ((1) to (4)) + T ((5)) | BS B35; test "retries replay one change and one notice; other content with the key is refused; a lost acknowledgement replays once; two changes at one revision leave one winner (50 races)" |
| WP16-A43 | Test | Replay matrix | (1) Identical replay. (2) Changed content. (3) Business duplicate: a new key, the current revision, the now-current owner. (4) Raw stale envelope: a new key, an older revision, an open item. (5a) Raw resend after the item closed. (5b) Corrected submission from a fresh page with another owner. (6) Two changes at one revision. | (1) The original result. (2) `conflict_operation_key`. (3) `follow_up_owner_not_eligible`; no second change (Core's eligibility rule answers; no other duplicate guard is claimed). (4) `stale_revision` (CMP-14). (5a) `financial_exception_not_open`. (5b) Accepted once. (6) One winner; the other `stale_revision`. | T | BS B35; `follow-up.ts` check order; WP-10 H-07 |
| WP16-A44 | Test | SA-07o largest valid form | Send a 1,000-character reason in Devanagari (three bytes per character in UTF-8, nine after form encoding) with the other fields, over real HTTP. | The body fits the route's body limit and reaches Core; accepted. A refusal for size is a finding (the handler refuses input that Core accepts). | T | LD-17; WP14-A93 |
| WP16-A45 | SuperAdmin (SA1) | SA-08s of FU-A (`/admin/audit/financial_exception/[id]`) (§3 F-8) | Read the history. | Only fields recorded on the subject (K-14): `pay.financial_exception_opened` (kind, cause, state, accountable SuperAdmin, payment status at opening); `pay.financial_exception_owner_changed` (owner before and after; the reason); `pay.financial_exception_closed` (state, closing entry). Each with recorded time, actor and role. The refused sends of A37, A40 and A41 left no fact. | L | BS B33; WP-14 K-14 |
| WP16-A46 | Test | Receipt naming | Unit test over every command result shape the staff instance can show at a receipt address. | Only `pay.reassign_follow_up_owner` returns resource `financial_exception` with summary keys exactly `{exceptionId, accountableSuperAdminId}`: that receipt is named. Any other shape reads "Request recorded". An edited address with another operation's key never shows "Accountable SuperAdmin changed". | T | WP-13 L-05; WP-01 A-04 |

### 2.6 Policy boundaries (CC-08) and the Accounts surface

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A47 | SuperAdmin (SA1) | SA-07t of Y, "Reservations" (observe WP07-A94 (c)) (§3 F-10) | Read the reservation notice. | The notice has three parts: reason ("Who may release an unused reservation is not decided, so unused reservations stay counted."), owner ("Owner: product owner."), route ("Route: none in this release. A ceiling increase by two SuperAdmins allows further commitments."). No "Release" button, enabled or disabled; no form posts `…/reservations/:reservationId/release`. | L | CC-08; BS B28, B43; PL §11.3 |
| WP16-A48 | SuperAdmin (SA1) | SA-07a of C, fee section (observe WP07-A94 (a)) (§3 V09F-2) | Read the fee-exclusion notice. | Reason (which payment record excludes a fee is not decided), "Owner: product owner.", "Route: none in this release." No "Exclude" control; no form posts `…/fees/:feeId/exclude`. | L | CC-08; BS B28, B43 |
| WP16-A49 | SuperAdmin (SA1) | SA-07v of FU-B; SA-07u (§3 F-10) | Read the write-off notice. | "Writing off a missing payment is unavailable until the product owner decides who may write off and on what evidence. Owner: product owner. Route: this item closes when a later entry records 'Payment received' (see How this item closes)." No "Write off" control; no form posts `…/write-off`. | L | CC-08; BS B29, B43 |
| WP16-A50 | SuperAdmin (SA1) | SA-07a of A and of C (§3 F-10) | Read the refund notice. | "Recording a refund is unavailable until the product owner decides a refund policy. Owner: product owner. Route: none in this release." No "Refund" control; no form posts `…/refunds`. | L | CC-08; BS B26, B29, B43 |
| WP16-A51 | SuperAdmin (SA1); harness; test | Hand-made POSTs to the four boundary routes (§3 F-10) | With a valid form token, post the release of C's reservation, the exclusion of C's fee, the write-off of FU-B and a refund of A; then each with a made-up id. Test: the same as OP1 and in a support view. | Each answers 409 with the boundary page: the reason in words, "Owner: product owner.", "Nothing was recorded." and a link back to its page. A made-up id gets the same answer and discloses nothing. Deltas 0: operations, `pay.*` facts, counted exposure of Y, FU-B's state and owner. OP1: the uniform not-found page. Support view: 409 `support_view_active`. | L+T | CC-08; CC §5.5; WP07-A95; test "answers each deliberate boundary without recording anything" |
| WP16-A52 | Test (route inventory; the host-pages test) | Route inventory and every rendered SA-07 and TA-11 page | Run the inventory test. Render every page in every state and collect the form actions. | D106 to D109 stay registered with their commands (`admin.finance.reservation_release`, `admin.payments.fee_exclusion`, `admin.follow_up.write_off`, `admin.payments.refund`). No rendered form action posts any of them. No disabled button stands for them: each is a notice in the page flow. | T | CC-08; LD-03; CC-12 to CC-18 |
| WP16-A53 | SuperAdmin (SA1) | SA-07a, SA-07t, SA-07u, SA-07v; SA-07t of `syn-ta-1` (observe WP07-A94 (b)) (§3 F-0b, F-10) | Read the B28 and B29 notices together. | Each parked case is its own notice where it applies: fee exclusion in the fee section; reservation release under the reservations; the default-ceiling case only for a travel agent at the default ₹0 (present for Y at F-0b and for `syn-ta-1`; absent for Y after Setup 3). No page says that all TravelMudra-funded commitments are blocked; C's commitment was accepted under the set ceiling (Setup 3). | L | V09; BS B28, B43; UX §6.3, §10.1 |
| WP16-A54 | SuperAdmin (SA1); test | `/accounts` (§3 F-11) | Open `/accounts`. Test: as an operator with an accounting grant and as one without; the route inventory; a page sweep for links. | The old Accounts page is retired (WP-01 Q-04): SA1 gets the answer the design decides (§6 Q-05 recommends 303 to SA-07h "How exposure decreases"), never the old page. Each of its seven boundaries has a home that shows it: bank receipt verification, allocation and recovery, manual adjustment (SA-07a fee section, A16; "How exposure decreases" on SA-07h and SA-07t, WP07-A93); dashboard data and payment-record changes (SA-07h); write-off (A49); refunds (A50); releasing reserved exposure (A47). An operator with an accounting grant finds the B29 notice on OP-10 (WP-15; "Deferred to WP-15" while OP-10 is not built, §6 Q-05). No page links `/accounts`; no rail or context entry exists for Accounts (AD-12). | L+T | WP-01 Q-04; PLAN §7 #13; AD-12; BS B29 |
| WP16-A55 | SuperAdmin (SA1) | SA-07a, SA-07h, SA-07t, SA-07u, SA-07v | Look for any other money control. | No gateway, "Pay now", refund, write-off, assistance-charge, other-mode fee, "Mark collected", "Verify receipt", "Allocate", "Adjust", "Release", "Exclude" or "Reset exposure" control. Accounts duties show as owned follow-up and as notices (UX §6.3). No "Accounts dashboard" destination. | L | UX §6.3, §10.1; BS B29, B43; PL B-04 |

### 2.7 Command results, access and shell on WP-16 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A56 | SuperAdmin; travel agent | Every WP-16 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Money & exposure" for SA-07u, SA-07v, SA-07o and SA-07a opened from the rail; "Payment history" for TA-11; breadcrumbs; one `h1`; freshness per §0.2. | L | PL §2.1, §2.2; WP01-A05, A07 |
| WP16-A57 | Test | SA-07v, SA-07a and TA-11 addresses | Open with `?done=reassigned`, `?done=recorded` and no operation key; with another person's operation key; with a refused key. | No receipt or success line from the address (today's `doneFlash` goes). Another person's key: the unchecked receipt with current authorized facts (J-09). A refused key: "Nothing is recorded for request [reference] so far". | T | WP-01 A-04; WP-12 J-09 |
| WP16-A58 | SuperAdmin (SA2) | A36's receipt address opened after F-7 (§3 F-13) | Open it. | The receipt keeps "Accountable SuperAdmin changed" and "New owner: [SA2]"; facts read now are "Current: Closed by payment entry 1". No instruction to act. | L | WP-07 F-33; WP-09 G-10; WP-12 J-08 |
| WP16-A59 | Test | Text map of every reason code WP-16 pages show | Unit test against Core's vocabulary. | Each has its sentence: `financial_exception_not_open`, `follow_up_owner_not_eligible`, `stale_revision`, `operation_key_reused`, `input_invalid` on `reason` and `accountableSuperAdminId`, `parked_reservation_release`, `parked_fee_exclusion_record`, `unselected_write_off`, `unselected_refund`, `parked_accounts_actions`, `excluded_payment_gateway`, `support_view_active`. An unknown code shows the category text and "Reference code: [code]". | T | UAT-13; §0.5 |
| WP16-A60 | SuperAdmin (SA1) | Every refusal reachable live (A37 (1), A40, A41, A51) | Read each message. | CMP-07 at the field when Core names one; the owner or route where one exists; never a code alone, "Something went wrong" or "Invalid data". A field refusal re-renders SA-07o with values kept, never the shell. | L | PL §1.1; CR-01 |
| WP16-A61 | Test (host-pages test) | Every page of the staff and edge instances | Render each and collect the form actions. | The owner-change POST appears as a form action only on SA-07o (not on SA-07v, SA-07u or SA-07a). No WP-16 page holds another WP-16 form. The carried test entries for the old item page's form are removed. | T | CC-12 to CC-18; §6 Q-07 |
| WP16-A62 | Travel agent (Y); operator (OP1); SuperAdmin (SA1) | TA-11; SA-07 pages | Look for controls of other roles. | TA-11: no SuperAdmin or operator control. SA-07 pages: no operator act, readiness, filing, release, send or completion control (WP06-A109 kept). | L | BS B18; PL SH-R08 |
| WP16-A63 | Test (HTTP) | SA-07v, SA-07o, SA-07a, TA-11 | (1) The required read unavailable (availability failure). (2) An access, session, maintenance or support-view refusal between the page's reads. | (1) SA-07o: no form, "This step cannot be prepared now: the follow-up item cannot be read. Try again later. Owner: TravelMudra."; SA-07v, SA-07a, TA-11: S7. (2) The shell (SH-02, sign-in, maintenance, 409), never earlier facts (LD-14). | T | LD-14; WP-07 F-04 |
| WP16-A64 | SuperAdmin; travel agent | TA-11 and SA-07o | Inspect browser storage after use; read the headers. | No reason, payment reference, amount or name in `localStorage`, `sessionStorage` or IndexedDB; signed-in pages send `no-store`. | L+T | SH-R12 |
| WP16-A65 | SuperAdmin; travel agent | Every WP-16 page | Read all visible text. | No "Pay now", "Collected", "Settled", "Written off", "Overdue", "Something went wrong", "Accounts dashboard"; every time with "IST"; every count with its unit; "Synthetic" where data is synthetic (CR-08); no package or lane record id; no configuration number the page does not read. | L | PL §11.1; CR-01 to CR-09 |
| WP16-A66 | Test | Money rendering | Render 150000 paise, 150050 paise, 12345600 paise and 0 paise. | "₹1,500", "₹1,500.50", "₹1,23,456", "₹0"; no floating-point value; currency in text, tabular numerals (CMP-16). | T | WP-07 §0.2 "Money"; CMP-16 |

### 2.8 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A67 | Keyboard-only travel agent and SuperAdmin | TA-11 (F-9), SA-07u, SA-07v, SA-07o (F-1 to F-4) at 1440 px; TA-11 and SA-07o at 390 px | Use the keyboard only. | Views, history disclosure, links, the owner radio group, the reason, send and cancel work with Tab, Shift+Tab, Enter, Space, arrow keys in the radio group, and Escape. | L | AC-01, AC-12 |
| WP16-A68 | Keyboard-only user | Every WP-16 page at 1440 px, 390 px and 400% zoom | Tab through. | Focus visible (3:1), never hidden by a bar or panel. | L | AC-02 |
| WP16-A69 | Phone user | TA-11, SA-07a, SA-07u, SA-07v, SA-07o | 320 px; 1280 px at 400%. | One column; TA-11 per-application cards with the status first; SA-07u rows stack as labelled rows; SA-07o scope and effect before the fields; the primary action at the end, never in a fixed bar; no horizontal page scroll. | L | AC-04, AC-21; PL TA-11 and SA-07 (Mobile) |
| WP16-A70 | Any | SA-07o and every view control | Inspect. | The owner radio group is a `fieldset` with a `legend`, none preselected; every input has a visible label; required and optional stated. | L | AC-05, AC-15 |
| WP16-A71 | Any | States, kinds, fee states, "(not active)" | Greyscale. | Text for every state; no colour-only marker. | L | AC-06 |
| WP16-A72 | Any | SA-07o | Send with an error. | Focus moves to the error summary; each link moves to its field; values kept. | L | AC-08 |
| WP16-A73 | Screen-reader user | Receipts; notices; tables | Read with a screen reader. | Receipts announced politely without moving focus; boundary notices in the page flow; table header cells; amounts read with the currency; the history disclosure states its state. | L | AC-09, AC-15 |
| WP16-A74 | Screen-reader user | Each unavailable action (A38 states, A47 to A50) | Focus the notice or its region. | The reason, owner and route are exposed in reading order; no role-forbidden action shows as a control. | L | AC-13; SH-R08 |
| WP16-A75 | Phone user | Every WP-16 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions at least 44 × 44 px. | L+T | AC-10 |
| WP16-A76 | — | Every WP-16 page | Contrast. | Text 4.5:1; non-text and focus 3:1. | L+T | AC-11 |
| WP16-A77 | Any | Long reason; long names; reduced motion | A 1,000-character reason; a 400-character applicant name. | Wraps; shortened table text has a full form reachable by keyboard and touch; no transition with reduced motion. | L | AC-14, AC-20 |
| WP16-A78 | Travel agent and SuperAdmin (observation) | TA-11 after V09F-3; SA-07v of FU-B after F-8 | Ask Y "Do you owe TravelMudra anything for C, and what?" and "Was B's payment received?". Ask SA1 "Who is accountable for B's item, and what closes it?" and "Can you write it off?". | The run record reports the answers and the sample size; a wrong answer is a finding. No pass target. | L | AC-24, AC-26 |

### 2.9 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP16-A79 | Travel agent | TA-11 empty (F-0a) | L | UX §7.5; AC-01 to AC-28 |
| WP16-A80 | Travel agent | TA-11 with A, B and C, B's history open (F-9) | L | same |
| WP16-A81 | Travel agent | TA-11 of C with the government fee block (V09F-3) | L | same |
| WP16-A82 | SuperAdmin | TA-11 in a support view | L (gallery) | same |
| WP16-A83 | SuperAdmin | SA-07a of C with the paid fee row and the notices (V09F-2) | L | same |
| WP16-A84 | SuperAdmin | SA-07a of A with the closed item (F-8) | L | same |
| WP16-A85 | SuperAdmin | SA-07u "Open" with rows (F-1) | L | same |
| WP16-A86 | SuperAdmin | SA-07u "Closed" (F-8) | L | same |
| WP16-A87 | SuperAdmin | SA-07u "Yours" empty | L (gallery) | same |
| WP16-A88 | SuperAdmin | SA-07v of FU-B, open (F-2) | L | same |
| WP16-A89 | SuperAdmin | SA-07v of FU-A, closed (F-8) | L | same |
| WP16-A90 | SuperAdmin | SA-07o form (F-3) | L | same |
| WP16-A91 | SuperAdmin | SA-07o with the error summary (F-3) | L | same |
| WP16-A92 | SuperAdmin | SA-07o with CMP-14 (F-4) | L | same |
| WP16-A93 | SuperAdmin | SA-07o after the closed-item refusal (F-7) | L | same |
| WP16-A94 | SuperAdmin | Boundary answer page, 409 (F-10) | L | same |
| WP16-A95 | SuperAdmin | Gallery: owner not active; no eligible owner; completed application; every fee state; the cap lines | L (gallery) | same |
| WP16-A96 | SuperAdmin | Operation status page of the owner change: accepted, and "Nothing is recorded" for a refused key (F-5) | L | same |
| WP16-A97 | SuperAdmin | The `/accounts` answer, or the page it leads to (F-11) | L | same |

## 3. Proof scenarios V09 (WP-16 part) and V19 (financial follow-up part)

V09 (UX §12): "A funded government-fee commitment shows counted exposure and ceiling; each B28 unresolved reservation
case remains specifically unavailable rather than all commitments blocked." Authority B27 to B29, B43. WP-07 proves
the ceiling, the two-SuperAdmin increase, the authorization and the SA-07t part (WP-07 §3 V09). WP-16 proves the
per-application money facts of a funded commitment, their agreement across SA-07a, SA-07t and TA-11, and the CC-08
notices and routes.

V19 (UX §12): "Completed processing can retain financial/disclosure follow-up; group-end date closure never consumes
unknown filing, held originals, pending delivery or outstanding money." Authority B25, B29. WP-16 proves the financial
follow-up part. WP-14 proves the disclosure part (WP14-A13, A38). WP-17 proves the group-end part. No page or harness
step on `lane-ui` completes an application (`core.check_completion` is a deliberate boundary; the completion command is
test-harness only), so the completed-application steps are tests and gallery states (§6 Q-09).

One ordered recipe (§0.4). "Setup" steps use pages of other packages; they are not the subject under test. "Observe"
steps check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-07u, SA-07h, SA-01; SA2: SA-07u "Yours", `/admin/notices`; `syn-ta-2`: TA-11 | Read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup 0 | SA1: SA-06 | Create and activate Y `wp16-ta-[stamp]` (or record the fallback). | Y signs in through the harness. | — | L |
| F-0a | Y: TA-11 | Read. | S2; no "0", total or all-clear. | A01, A79 | L |
| F-0b | SA1: SA-07t of Y (observe WP-07) | Read. | "Ceiling: ₹0 (default)"; nothing counted; the three B28 notices, each specific. | A53 | L |
| Setup 1 | Y: TA-09, TA-08 | Create group `wp16-[stamp]`; submit A and B on "SYN Tourist e-visa" and C on "SYN e-visa, fee paid with submission". | Three submitted applications. | — | L |
| F-0c | Y: TA-11 | Read. | A, B and C, each "Not recorded yet", with the price in effect; no amount due. | A02 | L |
| Setup 2 | SA1: SA-09g, SA-03a, SA-07a | Record A's Gate 1 exception for the assignment; assign A to OP1. Record B "Payment received" (`SYN-W16-[stamp]-PAY-B`); assign B to OP1; correct B to "Not received" with the attestation and reason of §0.3. | FU-A (`work_under_gate1_exception`) and FU-B (`worked_then_corrected_to_unpaid`), both owned by SA1. | — | L |
| Setup 3 | SA1: SA-07i; SA2: SA-09c; SA1: SA-07a, SA-03a; OP1: OP-02, OP-04a | Request Y's ceiling ₹5,000 with a reason; SA2 approves; record C "Payment received" (`SYN-W16-[stamp]-PAY-C`); assign C to OP1; OP1 starts work, confirms readiness and requests the authorization of the government submission with fee ₹1,500. | The authorization is accepted (no blanket block); a reservation of ₹1,500. | A53 | L |
| V09F-1 | SA1: SA-07a of C, SA-07t of Y; Y: TA-11 | Read. | SA-07a: "Reserved: not paid yet; counted against the ceiling", ₹1,500, paid ₹0, owed ₹0. SA-07t: ceiling ₹5,000 "Set"; counted ₹1,500 as an unused reservation. TA-11: no government fee row for C (§6 Q-03). | A05, A13 | L |
| Setup 4 | OP1: OP-04b of C | Record "Filed" with `SYN-W16-[stamp]-PORTAL-C` and fee paid ₹1,500. | The act is filed; the fee is paid. | — | L |
| V09F-2 | SA1: SA-07a of C; SA-07t of Y | Read. | SA-07a: "Paid by TravelMudra"; fee ₹1,500; paid ₹1,500; owed ₹1,500; received and allocated ₹0; outstanding ₹1,500; the Accounts, formula, fee-correction and fee-exclusion notices; no fee form. SA-07t: not recovered ₹1,500, unused ₹0, counted ₹1,500 (delta 0 from V09F-1). | A12, A13, A15, A16, A20, A48, A83 | L |
| V09F-3 | Y: TA-11 of C | Read. | "You owe TravelMudra for it: ₹1,500"; received and allocated ₹0 and outstanding ₹1,500 "as recorded", with the Accounts boundary; no total. | A04, A20, A81 | L |
| F-1 | SA1: SA-07u; SA-07h; SA-01 | Read "Open" and "Yours"; follow the SA-07h and SA-01 links. | FU-A and FU-B listed, owner SA1; "Open" and SA1's "Yours" P-0 + 2; SA-07h equal to SA-07u; SA-01 group 11 in the lag form. | A21, A22, A26, A85 | L |
| F-2 | SA1: SA-07v of FU-A and of FU-B; SA-07a of B | Read. | Facts, cause words, the closing route with its link, the notice "Posted", the history link; SA-07a lists FU-B. | A17, A27, A28, A29, A88 | L |
| F-3 | SA1: SA-07o of FU-A | Read. Send with nothing chosen and the reason "short". | The anatomy of A35; C1 for both fields; nothing sent. | A35, A37, A90, A91 | L |
| F-4 | SA2: `/admin/notices`; SA1 (tab 1) and SA2 (tab 2): SA-07o of FU-A | SA2 reads the notices count. SA1 opens the page, chooses SA2 and writes a reason. SA2 chooses SA2 and sends ("WP16 [stamp] takes over the follow-up"). SA1 sends. | Tab 2: receipt "Accountable SuperAdmin changed", Current owner SA2, notice posted; SA2's notices +1 from the count read at the start of the step. Tab 1: CMP-14; nothing recorded. | A31, A36, A40, A92 | L |
| F-5 | Harness; SA2 | Replay terms 1 to 4 on tab 2's change; open the operation status page of its key and of a refused key. | One change, one notice; the used-form refusal; Back without SA2 in the list; the status pages. | A42, A96 | L |
| F-6 | SA1, SA2: SA-07u "Yours"; SA-07h | Read. | SA1 "Yours" P-0 + 1 (FU-B); SA2 "Yours" P-0 + 1 (FU-A); SA-07h equal. | A21, A26 | L |
| F-7 | SA1: SA-07o of FU-A; SA2: SA-07a of A | SA1 opens the page, chooses SA1, writes a reason. Setup: SA2 records A "Payment received" (`SYN-W16-[stamp]-PAY-A`). SA1 sends. | SA2's receipt says one follow-up closed by the entry (WP06-A75). SA1: `financial_exception_not_open` sentence, unsent reason kept, nothing recorded. | A41, A93 | L |
| F-8 | SA1: SA-07v and SA-07o (GET) of FU-A; SA-07u "Closed" and "Open"; SA-07a of A; SA-08s of FU-A | Read. | FU-A "Closed by payment entry 1", no owner change; SA-07o shows the closed state and no form; "Closed" lists FU-A; "Open" P-0 + 1; SA-07a of A shows the closed row and the refund notice; SA-08s lists the three recorded facts. | A17, A30, A38 (1), A45, A84, A86, A89 | L |
| F-9 | Y: TA-11, TA-07 of B; SA1: SA-07a of B | Read B's history; open B; press Back. | B: entry 1 kept beside the correction on both pages; A "Recorded as received"; Back returns to TA-11. | A03, A09, A19, A80 | L |
| F-10 | SA1: SA-07t of Y, SA-07a of A and C, SA-07v of FU-B, SA-07u; harness | Read the notices. Post the four boundary routes with the run's ids and with made-up ids. | Each notice with reason, owner and route, no control; each post 409 with "Nothing was recorded."; deltas 0 (counted exposure of Y, FU-B, `pay.*` facts, operations). | A47, A48, A49, A50, A51, A53, A55, A94 | L |
| F-11 | SA1: `/accounts`; SA-07h | Open `/accounts`; follow the answer. | The retired answer of A54; the boundaries in their homes. | A54, A97 | L |
| F-12 | `syn-ta-2`: TA-11; OP1 and Y: SA-07u, SA-07v, SA-07o; harness | Read. The harness posts the owner change as OP1. | `syn-ta-2` row count delta 0; not-found pages; the post refused; nothing recorded. | A10, A34 | L |
| F-13 | SA2 | Open the receipt address of F-4 again. | The historical receipt with "Current: Closed by payment entry 1". | A58 | L |
| V09F-4 | Test | Fee states and modes on SA-07a and TA-11; the boundary posts as an operator and in a support view; route inventory. | As the items. | A05, A14, A51, A52 | T |
| V19F-1 | Test | An application completed by the harness with an open item: SA-07u, SA-07v, SA-07a, TA-11; the owner change; a "Payment received" entry. | The item stays listed and open with "Processing completed"; "Processing completed. Financial follow-up remains open."; the owner change accepted; the entry closes the item; the completion fact and counted exposure unchanged. | A06, A18, A24, A32 | T |
| V19F-2 | Test | The same application on TA-11 and the follow-up words. | No "Nothing is due", "Paid" or "Settled"; the payment status as recorded. | A06, A33 | T |
| X-1 | Test | The test parts of the items not named above: A08, A11, A22, A23, A25, A37 (2), A38, A39, A42 (5), A43, A44, A46, A54, A57, A59, A61, A63, A64, A66, A75, A76. | As the items. | as listed | T |
| X-2 | axe | Every page and state visited above. | No serious or critical violation at 1440 px and 390 px. | A79 to A81, A83 to A86, A88 to A94, A96, A97 | L |
| X-3 | axe (gallery) | A82, A87, A95. | As X-2. | A82, A87, A95 | L |
| X-4 | Keyboard-only, screen-reader and phone users; Y; SA1 | During F-0c, F-3, F-4, F-9, V09F-3: the accessibility checks, the shell, the copy and refusal text, the role and money-control checks, the observation questions. | As the items. | A07, A56, A60, A62, A65, A67 to A78 | L |

Proof split. V09 (WP-16 part) passes when P-0, the Setup steps, F-0b, V09F-1 to V09F-3 and F-10 pass on `lane-ui` at
the integrated WP-16 commit and V09F-4 passes as named tests. V19 (financial follow-up part) passes when F-1, F-2,
F-7, F-8 and F-9 pass on `lane-ui` (an item survives, is listed with its application's lifecycle, keeps its owner and
closes only by a later entry) and V19F-1 and V19F-2 pass as named tests. Part X belongs to both. Recorded, not failed:
A15 "Unmet: no Core command (§6 Q-01)"; A03 evidence inspection "Partly met" (§6 Q-06); the OP-10 part of A54
"Deferred to WP-15" (§6 Q-05). Boundaries stated, not crossed: refund, write-off, reservation release, fee exclusion,
Accounts actions, the price-versus-fee formula (B28, B29, B43). The run record names the `lane-ui` ref, the run tag,
the travel agent used, the group, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V09: ceiling increase by two SuperAdmins, lowering, authorization with a fee, the breach and the parked paid case at ₹0, SA-07t facts | WP-07 (§3 V09; WP07-A79 to A97, A166) |
| Payment entry record and correction on SA-07a; follow-up opened by a correction; closure words | WP-06 (WP06-A63 to A79, A149, A150; §3 V06) |
| V19: disclosure follow-up after completion | WP-14 (WP14-A13, A38) |
| V19: group-end date closure never consumes unknown filing, held originals, pending delivery or outstanding money | WP-17 (`groupEndEligibility`, `money_outstanding`) |
| SA-01 group mechanics (group 11 counts) | WP-06 (WP06-A05 to A09); the link target here (A26) |
| The notice page of a SuperAdmin (the nudge) and OP-10's accounting-grant notice | WP-15 (CC-03); observed here (A31, A54) |
| The audit pages | WP-14 (SA-08a, SA-08s); used here (A45) |
| Operator money summary in OP-02 | WP-07 (AD-09) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-16 page:

- A form that posts a boundary route (D106 to D109); a "Release", "Exclude", "Write off", "Refund", "Mark collected",
  "Collect", "Settle", "Pay now", credit, assistance-charge or other-mode fee control, enabled or disabled (CC-08;
  B29, B42, B43).
- A form that records, edits or corrects a government fee, a TA liability, a TM-paid amount, a receipt, an allocation
  or a recovery (no Core command; §6 Q-01).
- A control that lowers counted exposure (B28).
- An amount "due", an outstanding service amount, a total across applications or travel agents, or an all-clear ("Nothing
  is due", "Nothing to follow up") from computed, capped or unknown facts (§6 Q-04; D7; K-05).
- A follow-up item shown as collected, paid, settled, written off or resolved; an age, "overdue" or an SLA (B29;
  CR-03).
- On TA-11: a ceiling, counted exposure, reservation, B28 notice, follow-up item, staff identity, evidence or reason;
  an Accounts dashboard or grant; a reserved or unknown fee state (§6 Q-03) (B10, B29).
- A sentence that the payment starts, holds or stops work; a money fact drawn from a gate (B26; F-05).
- A result from the page address; an accepted time; a named receipt that the operation does not establish.
- A blanket "TravelMudra-funded commitments are blocked" message (B43).
- A truncated field or a dropped value (LD-17); earlier facts after an access change (LD-14).
- The old `/accounts` page; a rail, context or link entry for Accounts (AD-12).
- An operator money control (AD-09).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- UI-PLAN "Record government fee fact": "Unmet: no Core command" (A15; §6 Q-01).
- Evidence inspection on TA-11: "Partly met" (A03; §6 Q-06).
- The B29 notice on OP-10 for an accounting-grant holder: "Deferred to WP-15" while OP-10 is not built (A54; §6 Q-05).

Deferred in WP-16 (the run record lists each as "Deferred"):

- Completed and ended-with-group applications: tests and gallery (A06, A18, A24, A32; §6 Q-09).
- An owner who is not active, no eligible owner, the eligible-list cap, fee states other than reserved and paid, the
  caps of 100 and 200: tests and gallery (approved writes do not suspend accounts).

Not in WP-16: the payment entry forms (WP-06); the ceiling pages and Gate 2 (WP-07); group end (WP-17); SA-10, OP-10
and the elevation pages (WP-15); incidents and audit pages (WP-14).

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | UI-PLAN §12.2 lists "Record government fee fact" for WP-16 (also §7 and assumption A-03: the SuperAdmin enters the fee, TA liability and TM-paid facts on SA-07). Core has no such command: fee facts come only from the operator's authorization and act evidence, and nothing corrects them. | OP1 records C's fee paid as ₹1,500 when the portal charged ₹1,050. Y's liability reads ₹1,500 on TA-11 and Y's counted exposure stays ₹1,500 for good (B28: it never decreases); no SuperAdmin page can correct the record. Likelihood: low per case, certain over volume. Harm: a wrong debt shown to the travel agent and an overstated exposure. | Build no fee form in WP-16 (no command to post; LD-07). SA-07a states the source of fee records and the boundary "Correcting one is unavailable in this release. Owner: product owner." (A15). Record "Unmet" and send the gap to Max through the orchestrator as a possible Kind 2 (a fee-record correction command with evidence). Note A-03 as superseded by Core. |
| Q-02 | P1 | No path records a receipt or a recovery in this build (Accounts parked, B29), so "received and allocated" stays ₹0 and "outstanding recovery" equals the liability for every paid fee. | Y pays TravelMudra ₹1,500 for C's fee by bank transfer. TA-11 keeps "Outstanding ₹1,500" for months; Y disputes the debt and has no way to see that the page cannot record the payment. Likelihood: certain for each paid fee once the travel agent pays. Harm: medium (trust, support load). | Keep both values (B27 tracks them) but label them "as recorded by TravelMudra Accounts", and put the B29 boundary beside them on TA-11 and SA-07a: "Recording a payment you make for a government fee is unavailable until the Accounts process is decided. Owner: product owner." (A04, A16). |
| Q-03 | P1 | Which government fee states TA-11 shows. Today `reserved` reads "Not paid yet" and `payment_unknown` reads "Being confirmed": they show the travel agent an internal reservation and a filing uncertainty. | OP1 authorizes C's submission with the fee. Before any filing, Y sees "Attempt 1: Not paid yet" and asks whether Y must pay; or, after an uncertain execution, Y sees "Being confirmed" and concludes that the filing happened. Likelihood: certain for each funded case. Harm: low to medium (wrong conclusions; WP-10 F-21 asks for neutral travel-agent words). | Show a fee row only when the read's TA liability is above zero (`tm_paid`, `recovered_partially`, `recovered`); show no row and no sentence for `reserved` and `payment_unknown` (no liability exists yet) (A05). |
| Q-04 | P1 | Today's TA page computes "Amount due", a "Due from you now" total and a green "Nothing is due" from the price and the status, and says "Work on the application starts once it is recorded." | B is completed with payment corrected to "Not received" and an open follow-up. TA-11 places B under "Payment recorded or nothing due" and shows "Nothing is due", while TravelMudra follows the payment up. Or A was assigned under a Gate 1 exception and the page tells Y that work has not started. Likelihood: certain for every completed unpaid case and every exception case. Harm: medium (the travel agent is told something false about money). | No derived "due" amount, total or all-clear (WP-07 money rule); per application the price in effect and the recorded status only; government fee liability and outstanding recovery as Core returns them (A04); no work-consequence sentence (A06). |
| Q-05 | P2 | `/accounts` retirement (WP-01 Q-04: WP-16 moves its content to SA-07 and OP-10, then retires it). OP-10 belongs to WP-15. | WP-16 integrates before WP-15. An operator with an accounting grant opens a bookmark of `/accounts` and gets the not-found page; nothing tells them that Accounts actions are unavailable. Likelihood: low. Harm: low. | Retire `/accounts` in WP-16 after SA-07 shows each of its boundaries (A54). Answer: 303 to SA-07h "How exposure decreases" for a SuperAdmin, 303 to OP-10 for an operator with the grant, the uniform not-found page for anyone else (LD-03: same purpose, new home). WP-15 adds the B29 notice to OP-10; until then the OP-10 part is "Deferred to WP-15". |
| Q-06 | P2 | `pay.ta_payments` returns no group (UI-PLAN TA-11 filters by group), no corrected-entry reference, no evidence and no event time (UX §4.2 "Inspect evidence/history"). | Y wants the payments of one group, or the bank reference TravelMudra recorded for B's payment, and cannot find them on TA-11. Likelihood: medium. Harm: low (TA-07 names the group; staff hold the evidence). | Build TA-11 on the facts returned: history yes, evidence "Partly met" (A03); no group filter in WP-16; each row links its application. A Kind 1 request (group, evidence reference of the travel agent's own entries) only with evidence of need: criterion point 2 is not demonstrated now. |
| Q-07 | P2 | Host page of the owner change: a task page SA-07o (as SA-07l and SA-07i in WP-07) or the form on SA-07v (as close on the incident page in WP-14). | Both the old item page and a new page carry the form, with different words; a refusal re-renders the wrong one. Likelihood: low. Harm: low. | SA-07o as a GET page beside the kept POST; SA-07v keeps facts and a link (one host page per command, CC-12 to CC-18). This checklist assumes SA-07o; if the design keeps the form on SA-07v, the observable results stay. |
| Q-08 | P2 | The eligible-owner read takes at most 50 active SuperAdmins with a second factor and then removes the current owner. | With 60 SuperAdmins the radio list omits ten names with no message. Likelihood: very low (three seeded SuperAdmins). Harm: low. | Say "Not every SuperAdmin may be listed." when the list holds 49 or 50 names (A38 (4)); parked P2 note to the orchestrator. |
| Q-09 | P2 | V19's completed-application part cannot run on `lane-ui`: no page or harness step completes an application (deliberate boundary, LD-04; the completion command is test-harness only). | The live proof never shows an item on a completed application. Likelihood: certain. Harm: low (tests cover the read and the pages). | Accept tests and gallery states for V19F-1 and V19F-2, as WP-14 did for V13D-14. |
| Q-10 | P2 | A `payment_corrected_after_work` item opened while the status stays "received" closes only by a later correction that records "Payment received" and changes the status, the amount or the evidence (`correction_no_change` otherwise). | SA1 corrects B's evidence reference after work; an item opens. To close it, a SuperAdmin must make another correction that changes something, for example adds an evidence row, only to close the item. Likelihood: medium. Harm: low (the item stays open and owned; no data is lost). | SA-07v states Core's rule exactly and links the correction form (A29); the page never alters an entry to force closure. Parked P2 note to the orchestrator. |
| Q-11 | P2 | Proof writes: a fresh travel agent, a ceiling increase on Y, C's filing evidence with a paid fee, an owner change, and FU-B left open at the end. | Each rerun adds one travel agent with ₹1,500 counted exposure for good and one open follow-up item on `lane-ui`. Likelihood: certain per run. Harm: low (synthetic, tagged, excluded by deltas). | Approve as WP-07 (proof writes) and WP-14 (Q-W14-06) did; checks by deltas; seeded travel agents and ceilings untouched. |
| Q-12 | P2 | LD-13 review route. WP-16's one served command changes who is accountable for a money follow-up; the four boundaries change nothing. | Without a design review, a defect in the money pages (for example a computed "due" amount) reaches code review only. Likelihood: low. Harm: medium. | Give the design and this set one Codex review before code (money state, LD-13), or record the reason for code review only. |
| Q-13 | P2 | BS B29 says that Accounts' reconciliation responsibility nudges the accountable SuperAdmin while the item stays open. Core posts one notice at opening and one per owner change; nothing repeats it. | FU-B stays open for months; SA1 forgets it; nobody is reminded. Likelihood: medium. Harm: low (the list, SA-07h and SA-01 group 11 keep it visible). | No schedule (UX §8.2 forbids new reminder schedules without scope authority). SA-07v shows "Notice posted"; the list and the counts keep it visible. Parked P2. |
| Q-14 | P2 | Body limits of reason forms count bytes, while Core's reason limit counts characters (§0.1 "Body limit"). The owner-change POST allows 4,096 bytes; a valid 1,000-character reason in Devanagari needs about 9,000. The same class may hold for other reason forms of the lane (for example the ceiling forms at 4,096 bytes). | SA1 writes a 600-character reason in Hindi on SA-07o; the server answers "too large" before Core, and the typed reason is lost. Likelihood: low on `lane-ui` (synthetic English text), medium in use. Harm: low to medium (a valid entry refused; LD-17 class: a handler refuses what Core accepts). | Fix the class, not the case: each reason form's body limit fits Core's character limit at nine bytes per character plus the other fields; A44 tests the owner change with real HTTP; the architect checks the other packages' reason forms in one sweep (as LD-17's sweep). |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, travel agent used, group label and identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V09 (WP-16 part) result (steps; where shown) | |
| V19 (financial follow-up part) result (steps; tests) | |
| Answers in force to §6 Q-01 to Q-14 | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP16-A01 | | | |
| WP16-A02 | | | |
| WP16-A03 | | | |
| WP16-A04 | | | |
| WP16-A05 | | | |
| WP16-A06 | | | |
| WP16-A07 | | | |
| WP16-A08 | | | |
| WP16-A09 | | | |
| WP16-A10 | | | |
| WP16-A11 | | | |
| WP16-A12 | | | |
| WP16-A13 | | | |
| WP16-A14 | | | |
| WP16-A15 | | | |
| WP16-A16 | | | |
| WP16-A17 | | | |
| WP16-A18 | | | |
| WP16-A19 | | | |
| WP16-A20 | | | |
| WP16-A21 | | | |
| WP16-A22 | | | |
| WP16-A23 | | | |
| WP16-A24 | | | |
| WP16-A25 | | | |
| WP16-A26 | | | |
| WP16-A27 | | | |
| WP16-A28 | | | |
| WP16-A29 | | | |
| WP16-A30 | | | |
| WP16-A31 | | | |
| WP16-A32 | | | |
| WP16-A33 | | | |
| WP16-A34 | | | |
| WP16-A35 | | | |
| WP16-A36 | | | |
| WP16-A37 | | | |
| WP16-A38 | | | |
| WP16-A39 | | | |
| WP16-A40 | | | |
| WP16-A41 | | | |
| WP16-A42 | | | |
| WP16-A43 | | | |
| WP16-A44 | | | |
| WP16-A45 | | | |
| WP16-A46 | | | |
| WP16-A47 | | | |
| WP16-A48 | | | |
| WP16-A49 | | | |
| WP16-A50 | | | |
| WP16-A51 | | | |
| WP16-A52 | | | |
| WP16-A53 | | | |
| WP16-A54 | | | |
| WP16-A55 | | | |
| WP16-A56 | | | |
| WP16-A57 | | | |
| WP16-A58 | | | |
| WP16-A59 | | | |
| WP16-A60 | | | |
| WP16-A61 | | | |
| WP16-A62 | | | |
| WP16-A63 | | | |
| WP16-A64 | | | |
| WP16-A65 | | | |
| WP16-A66 | | | |
| WP16-A67 | | | |
| WP16-A68 | | | |
| WP16-A69 | | | |
| WP16-A70 | | | |
| WP16-A71 | | | |
| WP16-A72 | | | |
| WP16-A73 | | | |
| WP16-A74 | | | |
| WP16-A75 | | | |
| WP16-A76 | | | |
| WP16-A77 | | | |
| WP16-A78 | | | |
| WP16-A79 | | | |
| WP16-A80 | | | |
| WP16-A81 | | | |
| WP16-A82 | | | |
| WP16-A83 | | | |
| WP16-A84 | | | |
| WP16-A85 | | | |
| WP16-A86 | | | |
| WP16-A87 | | | |
| WP16-A88 | | | |
| WP16-A89 | | | |
| WP16-A90 | | | |
| WP16-A91 | | | |
| WP16-A92 | | | |
| WP16-A93 | | | |
| WP16-A94 | | | |
| WP16-A95 | | | |
| WP16-A96 | | | |
| WP16-A97 | | | |
| V09 proof (WP-16 part) | | | |
| V19 proof (financial follow-up part) | | | |
