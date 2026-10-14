# WP-16 acceptance checklist: Money follow-up and history

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-16 Money follow-up and history (UI-PLAN §12.2: TA-11, SA-07 full; done when V09 and V19; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-16-design.md`, the architect's decisions (`WP-16.md` §3) and amendments M-01 to M-12 (`WP-16.md` §4.1), which bind; WP-06 D-20, D-21 (`WP-06.md` §4.6) and WP-07 F-37 (`WP-07.md` §4.9) apply. See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result; where an amendment differs from the design, the amendment governs. |
| Product base | lane branch `ui-revamp-2026-10-12` at b2a6341 (the design read 34e875b, the review b2a6341; the payment module, contract, binding and pages are the same at both). Internal records at 47b4b27 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages for set-up); edge http://127.0.0.1:4650 (TA-11 and the TA-07 "Payment" section under test; set-up through the travel-agent pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-16-design.md`), the architect's decisions (`WP-16.md` §3) and the independent design review (lane
`research/reviews/WP-16-design-review.md`, R-01 to R-12, with amendments M-01 to M-12 in `WP-16.md` §4.1, which bind)
changed the rows below. WP-06 D-20, D-21 and WP-07 F-37 apply too. Rows not listed changed only their page ids, step
references and draft words to the design's. Section 6 is kept as asked; its lead names the answers. Page ids follow
the design (§1.3); the first version's ids map as: SA-07u → **SA-07f** Payment follow-up; SA-07v → **SA-07k** one
item; SA-07o → **SA-07r** change the accountable SuperAdmin. New hosts: **SA-07c** correct the current payment entry,
**SA-07b** the boundary answer page, the TA-07 **"Payment"** section. "Payment-missing follow-up" reads "Payment
follow-up". Items keep their numbers; new items are A98 to A119.

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1 | Design; `WP-16.md` §3, §4.1; review R-01 to R-12; D-20, D-21, F-37 | Inputs add the design, the record, the review and the amendments. Verified facts add: the correction use of `pay.record_service_status` is WP-16's (SA-07c), with its refusal order and the one-correction-per-entry index; an accepted owner change advances the item's revision twice (M-12); `pay.follow_up_list` returns no closing time; government fee records come from the authorization (a reserved record) and from act evidence (M-10) |
| Page ids and words everywhere | Design §1.3, §1.4, §2.14 | The design's page ids, rail members, breadcrumbs and closed word tables |
| §0.2 "Money", "Payment words", "Follow-up words", "Paths", "Pass rule", "Data hygiene" | Design §2.0, §2.14; M-01, M-02, M-08; Q-W16-06, Q-W16-08 | Recovery amounts "as recorded"; unknown amounts "Not known yet"; TA notices "Owner: TravelMudra"; one recipe and its approved writes; recorded items A15 (Unmet) and A03 (Partly met); the OP-10 deferral of A54 goes (OP-10 keeps its grant notice) |
| §0.3, §0.4, §3 | **M-07**, **M-08**; design §6 | One recipe: the fresh-agent recipe of this checklist, extended with the design's correction steps (K-1 to K-4: first correction, date-only refusal, stale retargeting, correction after correction with five evidence rows) and TA-07 checks (T-1). B's corrections are WP-16 steps, not set-up. The rejected-form refresh runs inside F-4 before the accepted change, so FU-A's owner holds for later steps. The design's steps map: V19F-1 to -5 → F-1 to F-5; V19F-7 to -9 → K-2 to K-4; V19F-10, -11 → F-9, T-1; V19F-12 to -16 → V19T; V09W-1, -2, -4 → V09F-2, F-10, V09F-3; V09W-3 (a Gate 2 item) → test (A28) and WP-07 V09-13; V09W-5 to -7 → V09T; V19F-6 (group end) → WP-17 and the Core test of V19T |
| A04, A13, A16, A20 | **M-01** (R-01) | "Received from you and allocated" and "Still to recover" (TA) and "Received and allocated", "Outstanding recovery" (staff) read "(as recorded)" beside their values and in the recovered-state words; the page says that the recovery amount can remain after a payment |
| A05, A06, A111 (new), A112 (new), §5, V09F-1, F-9 | **M-02** (R-02) | No reserved or unknown government-fee row in the travel agent's money history (TA-11); the "With government fees" view counts only shown rows; the TA-07 case page keeps the truthful external uncertainty in its own words |
| A17, A18, A21, F-8 | **M-03** (R-03); the same class on SA-07f | SA-07a shows "Closed" and the item link only; the closing entry and time only on SA-07k. SA-07f closed rows also show "Closed" only: `pay.follow_up_list` returns no closing time (the design's "Closed [time] IST" on SA-07f is corrected here; §6 Q-15) |
| A98 to A110, A113 to A119 (new) | **M-04** (R-04), **M-12** | SA-07c and the TA-07 "Payment" section: anatomy, first correction, correction after correction, stale retargeting, the date-only refusal, closing an earlier item versus opening a new one with the same correction, states, BFF parsing, replay, five evidence rows under the new body limit; axe rows for the new hosts |
| A99 (new) | **M-05** (R-05) | SA-07c always shows the conditional warning; operator work authorization stays a separate fact |
| A37 | **M-06** (R-06) | BFF refusals (whole values kept, field errors, no command call) separated from direct Core contract tests |
| A42, F-4, F-5 | **M-07** (R-07) | The rejected-form refresh runs before the accepted change; F-5 sends nothing that changes the owner |
| A40 | **M-09** (R-09) | "Your unsent choice" beside "Accountable now"; an unavailable choice stays as unsent text; no "you saw" |
| A07, A15, A50, A54 | **M-10** (R-10) | The government-fee correction limitation notice; the dashboard and payment-mutation limitation notice before `/accounts` retires; the TA refund wording reads "unavailable in this release"; fee records come from authorization and act evidence |
| A36, §0.1 | **M-12** (R-12) | An advanced revision and a fresh re-read, never "+1" |
| A16 | Design §2.0 (no notice for an action that does not exist: assistance charges, fee formula, other-mode fees) | The formula notice goes; the separation of price and fee stays |
| A23, A38 | Design §2.5, §2.7 | Design copy for an inactive owner; the eligible-list cap line goes (§6 Q-08 parked) |
| A26 | F-37 (AM-W16-02 b), D-21 | SA-07h and SA-01 group 11 words and links |
| A29, A30 | Design §2.6 item 4; Q-W16-09 | The action panel's branches; the "already received" branch runs live on FU-B2 |
| A44 | `WP-16.md` §3 PM Q-14 (fixed in the build) | The largest valid owner-change form MUST be accepted |
| A47 to A51, A53 | Design §2.8, §2.9; F-37 | Closed-table words and routes; SA-07b anatomy |
| A54 | Q-W16-04; design §2.10 | 303 targets; operators without the grant get not-found; OP-10 keeps its notice (no deferral) |
| A56 | Design §1.4 | Rail members "Finance" and "Payment follow-up" |
| A63 | Design §2.0 (one required read per page; no optional read) | A failed read is S7 on every WP-16 page |
| A01 to A03, A06, A09, A21, A22, A25, A27, A28, A31 to A33, A35, A38, A39, A41, A46, A59, A61, A66, A67, A70, A73, A78 | Design §2.1, §2.5 to §2.7, §2.12 to §2.16, §5 | Design words, states, paging and views |
| §6 lead; Q-15, Q-16 (new) | `WP-16.md` §3 | Answers named; two P2 contradictions found during the alignment |

## Lessons applied from the WP-01 to WP-15 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; A42, A43, A108 |
| A replay step MUST NOT change the state that later steps observe | WP-16 M-07 | A42 (4); §3 F-4, F-5 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A37, A39 to A41, A101, A102, A51 (each checks by delta) |
| A BFF refusal sends no command; it is tested apart from a direct Core contract test | WP-16 M-06 | A37, A106 |
| A receipt names the command only when the operation's resource, returned id and summary establish it; otherwise "Request recorded"; no accepted time; no result from the address | WP-01 A-04, P-02; WP-06 D-02; WP-13 L-05; WP-14 K-07 | §0.2 "Receipts"; A36, A46, A57, A100 |
| Recorded facts in a receipt come only from stored summary fields and records selected by its ids; later facts are "Current"; another person's receipt opens unchecked | WP-12 J-08, J-09 | A36, A57, A58, A100 |
| No page, status read or receipt instructs anyone to perform an act; no page maps a passed gate to a money fact | WP-07 F-01, F-05, F-33 | A06, A12, A109 |
| Money facts stay separate; no page adds them unless Core returns the sum; no page computes an amount "due"; unknown is never zero | WP-07 §0.2 "Money"; WP-16 Q-W16-01 | §0.2 "Money"; A04, A06, A12, A14, A20, A27 |
| A value that cannot change in this release is qualified, and the page says what can make it misleading | WP-16 M-01 | A04, A13, A16 |
| A field a read returns is not shown when its presentation would mislead its audience; the truthful fact stays where it is explained | WP-16 M-02 | A05, A111 |
| A page shows only facts that a named read returns; a fact another read holds is shown there only | WP-02 B-06; WP-14 K-14; WP-16 M-03 | §0.2 "Facts"; A17, A18, A21, A30 |
| A stale comparison shows the unsent value and the current value; it never invents what the person saw before | WP-16 M-09 | A40, A102 |
| A warning covers a race that can change the effect after the page loaded | WP-16 M-05 | A99 |
| Revisions are asserted as advanced on a fresh read, never by a fixed increment | WP-16 M-12 | A36 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A01, A21, A26 |
| A state is labelled for the fact it establishes | WP-06 D-05; WP-14 K-11 | A28, A30 |
| A list at its read's cap says so; no total, "none" or all-clear beyond the slice | WP-14 K-05, K-08 | A06, A22, A25, A112 |
| No BFF handler truncates, slices or drops a field; the largest valid form reaches Core | LD-17; WP-14 K-10, A93; WP-16 PM Q-14 | A37, A44, A106, A107 |
| The refusal summary and the submitted values render independently of the current eligibility; an unsent block keeps values when the form no longer applies | WP-02 code review R-01, R-03 | A40, A41 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses | WP-07 D-W07-16; WP-10 H-02, H-03 | A35, A38, A39, A98 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A29, A101 |
| On GET assert the blocker and the absence of the form; a refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A38, A43 (5a), A105 |
| Proofs follow one ordered recipe with a run tag, a fresh synthetic travel agent and deltas; set-up writes are labelled | WP-02 B-13; WP-14 K-13; WP-16 M-08 | §0.4; §3 |
| Real refusal shapes from the code | WP-06 D-11; WP-10 H-07 | §0.5 |
| One host page per command use; every rendered form action is a registered route; carried test entries leave | CC-12 to CC-19 | A52, A61 |
| A boundary names its owner and route; an action that does not exist gets no notice | LD-04; WP-16 design §2.0, §2.9; M-10 | A15, A16, A47 to A50, A54 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" or "Partly met" with its owner | WP-10 H-01; WP-14 K-01 | §0.2 "Pass rule"; A03, A15 |
| Audit facts show only as fields recorded on that subject | WP-11 I-10; WP-14 K-14 | A45 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-16 M-11 | §6 Q-06 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2 (Payment row), §3.2 (Completed case with continuing duty; Group end), §3.3, §4.2 (Payment history), §6.1, §6.2 (Money & exposure), §6.3 (Manual money record; Support view), §7.4, §7.5, §8.2, §8.3, §10.1, §12 V09, V19 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B25 to B29, B33, B35, B43; B10, B42 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-09, AD-12, AD-13), §1, §2.2, §2.3, §3.2 TA-11, §3.4 SA-07, §5.2, §5.4 SA-07, §6.2, §6.4, §7, §8, §10, §11, §12.2 WP-16, §13.2 B-03, B-04, §13.3 A-03 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (criterion point 2) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 0cab0de1f44eca96… | §3 rows of the five WP-16 commands and `pay.record_service_status`; §5.5; §6 CC-08, CC-19 |
| LP | `PLAN.md` (this folder) | SHA-256 e894486f73af0e59… | §3, §4 (LD-02 to LD-04, LD-07, LD-08, LD-11 to LD-14, LD-17), §7 #13, §8 (S-08) |
| W16 | `WP-16-design.md`; `WP-16.md`; lane `research/reviews/WP-16-design-review.md` | SHA-256 6bf1130ff040fa50…; bd3ebd9001ae8d5c…; 0fec50456589fab8… | design §0 to §9 (§1.2 Core facts, §1.3 pages, §1.4 shell, §1.5 commands, §1.6 forms that leave, §1.8 amendments, §2.0 to §2.16, §3 interims, §4 hostile states, §6 proofs, §7 units and tests, §9 findings, questions, deviations, STOP items); record §3 (Q-W16-01 to -06, PM Q-01 to Q-03, PM Q-14), §4.1 (M-01 to M-12); review R-01 to R-12 |
| W1 | `WP-01.md` | SHA-256 1246143f54f52fa7… | §3 Q-04 (`/accounts`); A-02, A-04, A-08 |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 484725b82b12c296…; 327f580c1820bf40…; 7a1d82e48fde6e93… | §3 PM Q-11; D-02, D-05, D-09, D-10, D-20, D-21; design §2.1 group 11, §2.6; WP06-A63 to A79, A103, A107 to A113, A149, A150 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 fcffd54b723214a6…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | F-01, F-04, F-05, F-21, F-33, F-37; design §2.10; WP07-A79 to A97, A166; §3 V09 |
| W8–W15 | `WP-08.md` to `WP-15.md` §3 and §4 | lane internal 47b4b27 | Neutral receipts; one host page per command; LD-14; LD-17; J-08, J-09; L-05; K-05, K-11, K-14; WP14-A13, A38 |
| W13A, W14A | `WP-13-acceptance.md`; `WP-14-acceptance.md` | SHA-256 e536fd59951b38d5…; 341d2c25c392b88d… | Format, corrections tables, lessons, §0.5 |
| Code | lane repository | b2a6341 (payment code identical to 34e875b) | `src/modules/payments/commands/{follow-up,service-status,common}.ts`; `src/modules/payments/{queries,writers,api,register}.ts`; `migrations/0700_payments.sql` (index `pay_service_entries_correction_uq`); `src/kernel/vocabulary/payments.ts`; `src/contracts/payments.ts`, `define.ts`; `src/core-api/bindings/payments.ts`; `src/modules/identity/policy.ts` (rows 234 to 247); `src/domain/compose.ts` (`activeSuperAdmins`); `src/modules/core/derived.ts` (`groupEndEligibility`; `pendingOnAction` rule 1); `src/modules/core/commands/admin.ts` (`harness.core.check_completion`); `src/apps/staff/payments/{routes,admin}.ts`; `src/apps/shared/pages/payments.ts`, `ta-payments.ts`; `src/apps/shared/server.ts` (route `bodyLimit`); `src/apps/staff/identity.ts` (`accountsPage`); `src/web/route-inventory.ts` (T37, A01, D10, D27, D47 to D51, D102 to D109); tests `test/payments/{follow-up,retries,service-entries,exposure}.test.ts`, `test/system/payments-views.test.ts`, `test/core/completion-group-end.test.ts` |

Verified facts of the code at b2a6341 that the items rely on (read by the author; the design §1.2 and the review
agree unless stated):

- **The five WP-16 commands.** One is served: `pay.reassign_follow_up_owner` (module `commands/follow-up.ts`). Four are
  parked boundaries with no module command: `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`,
  `pay.record_refund`. Their binding (`boundaryDef`) asks the policy, then refuses with the boundary; it records no
  operation, fact or task. Their routes D106 to D109 answer the boundary page with HTTP 409.
- **The correction use of `pay.record_service_status`** (WP-06 §1.5 carried it to WP-16; host SA-07c). Refusal order:
  field checks (`evidence.N.kind` `kind_not_allowed`, `evidence.N.id` `invalid_id`, `reason` `required`,
  `correctsEntryId` `required`, `eventAt` `in_future`; then `payment_evidence_required` for "received" without a
  reference or a document); `stale_revision` on `_rev.payment`; `payment_evidence_not_found` (a document of another
  travel agent); the entry rules (`payment_entry_kind_invalid`, `correction_target_not_current`,
  `correction_no_change`). Core compares the status, the amount and the evidence, not the payment date or the reason
  (P-10 g, WP-06 D-09). A correction always corrects the current entry, which is always the latest; a unique index
  allows one correction per entry. A correction made after operator work was authorized opens a follow-up item owned
  by its recorder (`worked_then_corrected_to_unpaid` for received → not received, otherwise
  `payment_corrected_after_work`). An entry that records "received" closes every open item of the application whose
  cause is a gate exception or an earlier entry, never the item it opens itself. Summary: `entryId`, `entryNo`,
  `status`, `statusRevision`, `openedException`, `closedExceptions`.
- **The owner change.** Input: `exceptionId`, `accountableSuperAdminId`, `reason` (10 to 1,000 characters after trim;
  the wire allows 4,000); expected revision `exception`. Policy action `financial_exception.reassign_owner`:
  SuperAdmin only; a support view runs no command. Checks in this order: the item exists (`access_denied`); the item is
  open (`financial_exception_not_open`); the revision is current (`stale_revision`); the new owner is an active
  SuperAdmin with a second factor and not the current owner (`follow_up_owner_not_eligible`). Effects: the owner
  changes; the fact `pay.financial_exception_owner_changed` records the owner before and after and the reason; a
  `financial_follow_up` notice goes to the new owner (one per exception and revision). The item's revision advances
  more than once in one accepted change (the update and the notice link each raise it; M-12). Result: resource
  `{type: 'financial_exception', id}`, summary `{exceptionId, accountableSuperAdminId}`; no other command returns
  that resource.
- **Follow-up items.** Kinds `work_under_gate1_exception`, `commitment_under_gate2_exception` (owner: the grantor of the
  exception used while unpaid); `payment_corrected_after_work`, `worked_then_corrected_to_unpaid` (owner: the recorder
  of the correction). States `open`, `closed_by_service_entry`. An item survives completion. No write-off state. One
  notice at opening and one per owner change; no schedule.
- **Reads.** `pay.follow_up_list` (filter `open`, `mine`, `closed`, `all`; at most 100 items, oldest first, with
  `more`; exact `openCount`, `mineCount`; per row the item's kind, state, owner, opened time, title, travel-agent
  name, owner name, `ownerActive`, lifecycle; **no closing entry and no closing time**). `pay.follow_up_item` (the
  row with `cause_entry_no`, `nudge_posted`, `closed_at`; the cause entry's status and recorded time; the closing
  entry's number; `currentStatus`; `pricePaise`; `eligibleOwners`: active SuperAdmins with a second factor, at most 50
  read, the current owner removed). `pay.application_payments` (entries with `corrects_entry_id`, event and recorded
  time, recorder, evidence, reason; items **without closing entry or time**; fee rows; gates; `workAuthorized`).
  `pay.ta_payments` (the travel agent's applications, newest first, at most 200, no `more` flag; per application:
  title, lifecycle, price in effect, status, history `{entryNo, status, kind, recordedAt}`, fee rows in every state
  including `reserved` and `payment_unknown` with TA liability, received and allocated, outstanding recovery). Staff
  serves `pay.ta_payments` only in a support view. `views.audit_subject` accepts `financial_exception`. SA-01 group 11
  reads the projection `views.monitors`.
- **Government fee records** are written only by Core's act commands: the authorization writes a `reserved` record
  before any evidence (`reserveExposure`); act evidence writes `tm_paid` (TA liability equal to the paid amount),
  `payment_unknown` or `reserved` again (M-10). No command records, edits or corrects a fee, a liability, a TM-paid
  amount, a receipt, an allocation or a recovery; no writer changes `ta_received_allocated_paise` or
  `outstanding_recovery_paise` in this build.
- **Completion.** Only the test harness completes an application; `core.check_completion` is a deliberate boundary
  (LD-04). `groupEndEligibility` refuses `money_outstanding` for open items, unused reservations, TM-paid fees not
  recovered and fees of unknown payment result (WP-17).
- **Body limits.** The staff server passes the route's `bodyLimit` to Fastify, which counts raw body bytes. Today the
  owner-change POST allows 4,096 bytes; a 1,000-character Devanagari reason is about 9,000 bytes after form encoding.
  `WP-16.md` §3 (PM Q-14) fixes the limit in the build for every reason form and the correction form (M-12: five
  maximum evidence rows).
- **Today's pages** (replaced): `/ta/payments` computes "Amount due", totals and "Nothing is due"; TA-07's
  `taPaymentSummary` shows "Amount due" and infers a work gate; the follow-up list shows "Open for [n] days"; the item
  page computes "Outstanding"; the correction is a disclosure on SA-07a; the reassign handler slices its fields and
  reads its result from `?done=`; boundaries render as disabled buttons; `/accounts` lists seven boundaries.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp16-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06). `syn-ta-2` for isolation only. SuperAdmins: `superadmin-1` (SA1: set-up, correction recorder, first
  owner of the run's items), `superadmin-2` (SA2: second approver of Y's ceiling increase, second tab, new owner of
  FU-A), `superadmin-3` (SA3: appears only as an eligible owner when Core reports SA3 active with a second factor;
  never signed in). Operators: `operator-1` (OP1: assigned A, B and C; the act of C), `operator-2` (OP2: isolation).
  They stand for `syn-superadmin-1` to `-3` and `syn-operator-1`, `-2`. Keyboard-only user. Screen-reader user. Phone
  user (390 px wide). No step suspends a seeded account or changes a seeded travel agent's ceiling.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (design §7.1 names: `money-words.test.ts`,
  `payment-follow-up-pages.test.ts`, `payment-correction.test.ts`, `service-payment-page.test.ts`,
  `ceiling-pages.test.ts`, `bff-payment-follow-up.test.ts`, `payment-history.test.ts`, `money-host-pages.test.ts`,
  `test/system/payment-follow-up.test.ts`, and the existing tests named per item). `L+T`: both are required. "Gallery"
  is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09); the design's §2.9, §2.12 and §2.14 tables govern the words, amended by
  M-01, M-02 and M-10. Draft copy passes when the page states the same facts. Staff boundary notices: "[Action] is
  unavailable until [policy] is decided. Owner: product owner. [Route]." with the reference code. TA notices: "Owner:
  TravelMudra." (Q-W16-08) and no code. An action that does not exist (assistance charges, a fee formula, other-mode
  fees) gets no notice (design §2.0). An unknown value shows "Unrecognised: [code]"; an unknown refusal code shows the
  category text and "Reference code: [code]". No page shows a package id or a lane record id.
- **Money (design §2.0; WP-07 §0.2).** Every amount is a Core field rendered by `money()`. No page shows an amount
  "due", a total, a sum or difference of rows, or an all-clear. "Outstanding recovery" is Core's field name and may be
  a label. The recovery amounts read "(as recorded)" beside their values on TA and staff pages and in the recovered
  states (M-01). Unknown is never zero: a `payment_unknown` fee shows "Not known yet" in its amount cells on staff
  pages; a null price "Not available" ("Fixed when you submit" for a draft).
- **Payment words (design §2.14).** Service payment: staff "Not recorded", "Not received", "Received"; TA "Not recorded
  yet", "Recorded as not received", "Recorded as received" with their meaning lines. Lifecycle: "Draft", "Submitted",
  "Processing completed", "Ended with its group", "Stage not available". Entry kind: staff "Record", "Correction of
  entry #[m]"; TA "Payment entry", "Correction (the earlier entry is kept)". Staff fee states: "Reserved, not paid";
  "Paid by TravelMudra"; "Payment result not known" (with "It cannot be paid again until the act's evidence is
  recorded. Owner: the operator who reconciles the act."); "Partly recovered (as recorded)"; "Recovered (as
  recorded)". TA fee states (only rows with a liability, M-02): "Paid by TravelMudra for you"; "Partly received from
  you (as recorded)"; "Received from you (as recorded)".
- **Follow-up words (design §2.14).** Kinds: "Work under a Gate 1 exception before payment"; "Government commitment
  under a Gate 2 exception before payment"; "Payment entry corrected after operator work"; "Corrected to not received
  after operator work", each with its meaning line. States: "Open"; "Closed by payment entry #[n]" with "A later entry
  recorded payment received. This is not a bank-verified collection." (where the read returns the entry; elsewhere
  "Closed", M-03). Never "Collected", "Settled", "Paid" for a closed item, "Written off", "Released", "Excluded",
  "Override", an age or an SLA.
- **Dates and times.** Every time carries "IST". Event time and recorded time both show where a read returns both.
- **Freshness (LD-08).** Every WP-16 read is authoritative: "Read at [time] IST". SA-01 group 11 (a projection) keeps
  the lag form.
- **Facts (K-14, M-03).** A page shows only facts that its read returns. A fact that another read holds shows on that
  read's page only. A count that cannot be read is "Unavailable", never "0". A list at its cap says so.
- **Receipts (design §2.15).** `corrected` on SA-07a: named "Correction recorded" when the `entries` row with the
  returned `entryId` has `kind = correction`, else "Request recorded"; recorded facts: "Entry #[entryNo], correction
  of entry #[m]", status, amount, evidence, "Payment follow-up opened by this entry: [kind words]" (link SA-07k),
  "Payment follow-up items closed by this entry: [n]"; Current: service payment, gates, open items. `reassigned` on
  SA-07k: named "Accountable SuperAdmin changed" (unique summary key); recorded fact "Accountable SuperAdmin: [name]";
  Current: owner now, state. No accepted time and no command name (P-02, S-08). No receipt from the address (the `DONE`
  flashes go). Another person's receipt address opens unchecked with current authorized facts (J-09).
- **Replay terms** (as WP-13 §0.2): 1 identical replay; 2 changed-content conflict ("This form was already used with
  different content. Your values are kept: check them and send again."); 3 browser Back (a fresh form with current
  facts; sends nothing); 4 rejected-form refresh (the refused form gets a new key; the corrected send is recorded
  once); 5 lost acknowledgement (C4 "Checking the original result", "Check status"; no new send of the same intent).
  Two more cases belong to the matrices (A43, A108): a business duplicate and a raw stale envelope. A replay step on
  `lane-ui` MUST NOT change what later steps observe (M-07).
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request
  [reference] so far". Refusal items check by delta: entries, items (owner, state), `pay.*` facts, notices,
  operations, counted exposure of Y.
- **Paths (LD-03; design §1.3).** Kept, rebuilt: TA-11 `/ta/payments?view=&page=&application=`; SA-07f
  `/admin/queues/financial-follow-up?state=&page=`; SA-07k `/admin/queues/financial-follow-up/:exceptionId` (host of
  the `reassigned` receipt). New GET task pages: SA-07c `/admin/applications/:applicationId/payments/correct` (form
  posts to the kept D27 `/admin/applications/:applicationId/payments` with `kind=correction`); SA-07r
  `/admin/queues/financial-follow-up/:exceptionId/reassign-owner` (beside the kept POST D105). SA-07b: the answer of the
  kept boundary POSTs D106 to D109. Sections and amendments: the TA-07 "Payment" section (`#payment`); SA-07a (WP-06,
  amended by D-20); SA-07h, SA-07t (WP-07, amended by F-37); SA-01 group 11 (D-21). Set-up and observation pages:
  SA-06 (WP-02); TA-08, TA-09 (WP-03); SA-09g, SA-03a (WP-06); SA-07i, SA-09c, OP-02, OP-04a, OP-04b (WP-07); SA-08s
  `/admin/audit/financial_exception/:id` (WP-14); `/admin/notices` (WP-15). `/accounts` is retired with a 303 (A54).
- **Pass rule.** WP-16 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items
  of §5. Recorded, not failed: A15 "Unmet: no Core command records or corrects a government fee fact (D-W16-08; Max's
  end review)"; A03 evidence inspection "Partly met" (STOP-W16-01 parked; criterion point 2 unproven, M-11). A failed
  item becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01 to WP-03, WP-06 and WP-07 are integrated with D-20 and F-37 (SA-06 creates
  accounts; TA pages create and submit; SA-07a records payment entries; SA-09g records Gate 1 exceptions; SA-03a
  assigns; SA-07i and SA-09c raise a ceiling; OP-02, OP-04a and OP-04b start work, confirm readiness, authorize and
  record act evidence); WP-09 U2 (the unsent text block); WP-14 (SA-08s). Where a package is not integrated, the step
  runs on the existing page and the run record says so.
- **Data hygiene (Q-W16-06 as amended by M-08).** Approved writes per run: Y (created and activated), one group,
  applications A, B and C (submitted), A's Gate 1 exception and assignment, B's first payment entry and assignment and
  two corrections (#2, #3), Y's ceiling increase (request and second approval), C's payment entry, assignment, start of
  work, readiness, authorization with a fee and filing evidence with the fee paid, A's later payment entry, and one
  owner change of FU-A. Refused sends record nothing. The run MUST NOT change, close or reassign an item other than
  its own, MUST NOT change a seeded travel agent's ceiling, MUST NOT suspend an account, and posts the boundary routes
  only with the run's ids and made-up ids (A51). FU-B2 stays open at the end; C's exposure stays counted on Y (BS
  B28); later runs exclude both by the run tag. Notes, references and reasons carry the run tag. Identifiers stay in the
  internal run record only.

### 0.3 Synthetic data used by WP-16

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp16-ta-[stamp]`, fresh per run (SA-06); ceiling starts at the default ₹0 | A, B, C; TA-11; TA-07 |
| Group | `wp16-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | A, B, C |
| A | "SYNFOLLOW, ASHA" on "SYN Tourist e-visa" (₹3,500); unpaid; SA1's Gate 1 exception for the assignment; assigned to OP1; later SA2 records "Payment received" (`SYN-W16-[stamp]-PAY-A`) | FU-A (`work_under_gate1_exception`, owner SA1): owner change, two-tab stale case, closed-meanwhile refusal, closure by a record entry; TA-07 "Payment" section unpaid |
| B | "SYNCORRECT, BINA" on "SYN Tourist e-visa"; entry #1 "Payment received" (`SYN-W16-[stamp]-PAY-B`); assigned to OP1; entry #2 corrects #1 to "Not received" (attestation "WP16 [stamp] payment returned by the bank"); entry #3 corrects #2 to "Payment received" with five evidence rows (reference `SYN-W16-[stamp]-UTR-B` and four attestations "WP16 [stamp] bank statement line [k]") | The correction host SA-07c: first correction, date-only refusal, stale retargeting, correction after correction; FU-B (`worked_then_corrected_to_unpaid`, opened by #2, closed by #3) and FU-B2 (`payment_corrected_after_work`, opened by #3, stays open, owner SA1) |
| C | "SYNFEE, CHAND" on "SYN e-visa, fee paid with submission" (₹3,600); "Payment received" (`SYN-W16-[stamp]-PAY-C`); assigned to OP1; work started; readiness; authorization of the government submission with fee ₹1,500; "Filed" with `SYN-W16-[stamp]-PORTAL-C` and fee paid ₹1,500 | V09: a funded commitment on SA-07a, SA-07t and TA-11; the reserved record hidden from TA-11 (M-02); the boundary notices and posts |
| Ceiling of Y | Default ₹0 → ₹5,000 (SA1 requests on SA-07i, SA2 approves on SA-09c) | C's commitment |
| Passports, photographs | As WP-14 §0.3 | Intake |
| Reasons and notes | "WP16 [stamp] …", at least 10 characters | Every reason field |
| Fixtures (tests, gallery) | An item of each kind and state; an owner suspended; an owner without a second factor; no eligible owner; 101 open and 101 closed items; an application completed by the harness with an open item; an application ended with its group; fees in each state; a preparation-only and a provider-filed application; 200 applications of one travel agent; a draft with and without an entry; `workAuthorized` true, false and null; an assignment committed between SA-07c load and send; a chain of three corrections; a lost acknowledgement of each command; a 1,000-character Devanagari reason; five evidence rows at their maximum lengths | T items and the gallery |

### 0.4 Run recipe (rerunnable; one recipe, M-08)

- Run tag `wp16-[yyyymmddhhmm]`. First checks: the harness can create, activate and sign in Y; SA1, SA2, OP1, OP2 and
  `syn-ta-2` sign in; "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission" admit Y (TA-03). Fallback when
  Y cannot be created: A and B run for `syn-ta-1`, C's fee path runs as tests, and the run record says so.
- Baseline (step P-0): SA-07f "Open", "Closed" and "Yours" counts for SA1 and SA2; SA-07h follow-up line; SA-01
  group 11 lines with their freshness; the TA-11 row count of `syn-ta-2`. Every later count check is a delta from it.
- Setup (labelled; pages of other packages): Setup 0 SA1 creates and activates Y. Setup 1 Y submits A, B and C. Setup
  2 SA1 records A's Gate 1 exception and assigns A; SA1 records B's entry #1 and assigns B. Setup 3 SA1 requests Y's
  ceiling increase and SA2 approves it; SA1 records C's payment and assigns C; OP1 starts work on C, confirms
  readiness and requests the authorization with the fee. Setup 4 OP1 records C's filing evidence with the fee paid.
- Order (§3): P-0, Setup 0, F-0a, F-0b, Setup 1, F-0c, Setup 2, K-1 to K-4, Setup 3, V09F-1, Setup 4, V09F-2,
  V09F-3, T-1, F-1 to F-13, then the test steps KT, V09T, V19T, then X-1 to X-4. Every harness send uses the fields of
  a freshly loaded page unless the step says "raw".

### 0.5 Refusal shapes in the code at b2a6341 (category / code)

Every command below also answers `not_found_or_forbidden` / `access_denied` for a caller without its policy action
(an operator or a travel agent: the route answers the uniform not-found page first) and `conflict_operation_key` /
`operation_key_reused` for a reused key with other content. A support view runs no command; its `/admin` pages and
posts answer 409 `support_view_active`. The BFF refusals of design §2.13 send no command (M-06).

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `pay.record_service_status`, use `correction` (SA-07c) | `validation_failed` / `input_invalid` on `evidence.N.kind` (`kind_not_allowed`), `evidence.N.id` (`invalid_id`), `reason` (`required`), `correctsEntryId` (`required`), `eventAt` (`in_future`); `validation_failed` / `payment_evidence_required` (field `evidence`); `stale_revision` / `stale_revision` (`_rev.payment`); `validation_failed` / `payment_evidence_not_found` (`evidence.N.id`); `validation_failed` / `payment_entry_kind_invalid` (no current entry); `validation_failed` / `correction_target_not_current`; `validation_failed` / `correction_no_change` (status, amount and evidence unchanged; the payment date and the reason are not compared). A second correction of one entry: `stale_revision` or the unique index |
| `pay.reassign_follow_up_owner` | `validation_failed` / `input_invalid` on `reason`, `accountableSuperAdminId`, a missing revision; `not_found_or_forbidden` / `access_denied` (unknown item); `control_blocked` / `financial_exception_not_open` (before the revision); `stale_revision` / `stale_revision` (`_rev.exception`); `control_blocked` / `follow_up_owner_not_eligible` |
| `pay.release_reservation` | `unavailable_parked` / `parked_reservation_release` for a SuperAdmin, whatever the ids; 409 SA-07b |
| `pay.exclude_fee` | `unavailable_parked` / `parked_fee_exclusion_record`; 409 SA-07b |
| `pay.write_off` | `unavailable_owner_decision` / `unselected_write_off`; 409 SA-07b |
| `pay.record_refund` | `unavailable_owner_decision` / `unselected_refund`; 409 SA-07b |
| Asserted as set-up answers or effects (owned elsewhere) | `pay.record_service_status` use `record` (WP-06 §0.5); `core.authorize_external_act` with a fee (WP-07): `exposure_ceiling_breach`, `exposure_parked_paid_case_default_ceiling` (not reached: Y's ceiling is set first); a malformed route id: the uniform not-found page |

## 1. Scope

### 1.1 Pages (design §1.3)

| Page | Host and path | Part in WP-16 |
|---|---|---|
| TA-11 Payment history | 4650 `/ta/payments?view=&page=&application=` (kept, rebuilt; rail "Payment history"); 4652 in a support view only | Whole page: views, cards, history, government fee rows with a liability, notices |
| TA-07 "Payment" section | 4650 `/ta/applications/:applicationId#payment` (WP-03 page; section carried to WP-16) | Price in effect, service payment, how to pay, link to the history |
| SA-07a Service payment of one application | 4652 `/admin/applications/:applicationId/payments` (WP-06 page, amended by D-20) | Entry chain and the link "Correct entry #[n]"; follow-up rows; fee table; boundary notices; completed line; money block |
| SA-07c Correct the current payment entry | 4652 `/admin/applications/:applicationId/payments/correct` (new GET) → POST D27 | Host of the correction use of `pay.record_service_status` |
| SA-07f Payment follow-up | 4652 `/admin/queues/financial-follow-up?state=&page=` (kept, rebuilt) | Views, rows, counts, cap, paging, notices |
| SA-07k One follow-up item | 4652 `/admin/queues/financial-follow-up/:exceptionId` (kept, rebuilt) | Facts, cause, action panel, notices, history link, the `reassigned` receipt |
| SA-07r Change the accountable SuperAdmin | 4652 `…/:exceptionId/reassign-owner` (new GET beside POST D105) | Host of `pay.reassign_follow_up_owner` |
| SA-07b Boundary answer | 4652 the answer of D106 to D109 (409) | Reason, owner, route, "Nothing was recorded.", back link |
| SA-07h, SA-07t | 4652 `/admin/finance`, `/admin/finance/tas/:taAccountId` (WP-07 pages, amended by F-37) | Follow-up line and links; release, exclusion and Accounts notices with routes |
| SA-01 group 11 | 4652 `/admin` (WP-06 page, amended by D-21) | Link targets only |
| `/accounts` | 4652 (retired) | 303 by session (A54) |
| Set-up and observation pages | SA-06, TA-08, TA-09, SA-09g, SA-03a, SA-07i, SA-09c, OP-02, OP-04a, OP-04b, SA-08s, `/admin/notices` | Set-up and observation only |

Reads: `pay.ta_payments` (TA-11); the TA-07 reads (`core.ta_application`: service payment, current price, lifecycle);
`pay.application_payments` (SA-07a, SA-07c); `pay.follow_up_list` (SA-07f); `pay.follow_up_item` (SA-07k, SA-07r);
`pay.finance_index` (SA-07h); `pay.ta_finance` (SA-07t); `views.monitors` (SA-01); `views.audit_subject` (SA-08s);
`core.operation` (receipts, status pages). No WP-16 page reads an optional block (design §2.0).

### 1.2 Command coverage (CC §5.1: 5 WP-16 commands; CC-08, CC-19)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `pay.reassign_follow_up_owner` | `admin.follow_up.reassign` (D105) | SA-07r; receipt on SA-07k | A35 to A46 |
| 2 | `pay.release_reservation` | `admin.finance.reservation_release` (D106) | Notice on SA-07t; answer SA-07b | A47, A51 to A53 |
| 3 | `pay.exclude_fee` | `admin.payments.fee_exclusion` (D107) | Notices on SA-07a and SA-07t; SA-07b | A48, A51 to A53 |
| 4 | `pay.write_off` | `admin.follow_up.write_off` (D108) | Notices on SA-07f and SA-07k; SA-07b | A49, A51, A52 |
| 5 | `pay.record_refund` | `admin.payments.refund` (D109) | Notice on SA-07a (TA variant on TA-11); SA-07b | A50 to A52, A07 |
| + | `pay.record_service_status`, use `correction` (WP-06 §1.5 carried; CC-19) | `admin.payments.record` (D27) with `kind=correction` | SA-07c; receipt `corrected` on SA-07a | A98 to A108 |
| ref | `pay.record_service_status`, use `record` | D27 | SA-07a (WP-06; WP06-A63 to A79) | Set-up; closure of FU-A |
| ref | UI-PLAN §12.2 "Record government fee fact" | none | — | A15 (Unmet; D-W16-08) |

All of them also: A56 to A66. Commands outside WP-16 that the proof touches only as set-up or observation:
`iam.create_account`, `iam.approve_account`, `iam.activate_account`; `intake.start_individual`, `core.submit`;
`core.grant_gate_exception`, `core.assign`; `pay.request_ceiling_increase`, `pay.approve_ceiling_increase`,
`ops.start_work`, `ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence`.

### 1.3 State coverage

S1 does not apply (server-rendered). S5 applies only to SA-01 group 11 (A26).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-11 | S2 A01; cards A02 to A05; views, paging, filter, S3 A112; completed, ended, draft, cap, S7 A06; S6 A10; support view A11 | — | — | — | — | — |
| TA-07 "Payment" | Unpaid, received A109; completed, draft, null price A110; external uncertainty kept A111 | — | — | — | — | — |
| SA-07a (WP-16 parts) | Chain A19, A103; fees A13, A14; items A17; completed A18; notices A15, A16, A48, A50 | WP-06 | WP-06 | A100 (`corrected`) | WP-06 | WP-06 |
| SA-07c | Form A98, A99; no entry, support view, completed A105 | A106 | A101, A105 | A100, A103, A104 | A108 | A102 |
| SA-07f | Views, rows A21; counts, cap, paging A22; inactive owner A23; completed A24; S2, S7 A25 | — | — | — | — | — |
| SA-07k | Open A27 to A29; closed A30; notice A31; inactive, completed A32; S6 A34 | — | — | A36 (receipt host) | — | — |
| SA-07r | Form A35; closed, nobody to choose, support view A38 | A37 | A39, A41 | A36 | A42 (5) | A40 |
| SA-07b | A51 | — | A51 | — | — | — |
| `/accounts` | A54 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-16 shows | Items |
|---|---|---|
| V09 (WP-16 part; WP-07 proves the ceiling and authorization part) | C's commitment under a set ceiling is accepted; its facts agree on SA-07a, SA-07t and TA-11; each B28 case is its own notice with reason, owner and route, and no control; the travel agent's money view exposes no internal control | A13, A20, A47, A48, A53, A05, A08; §3 V09F |
| V19 (financial follow-up part; WP-14 disclosure; WP-17 group end) | Items stay open and listed with the lifecycle; they close only by a later "received" entry, also by a correction; a correction can close an earlier item and open a new one; after completion the item stays and the pages say so | A06, A18, A24, A32, A104, A110; §3 V19 steps |
| UX §4.2 Payment history | Price and payment facts, corrections that keep the original, government fee facts with a liability; no Pay now, refund claim, write-off or credit control | A01 to A11, A109 to A112 |
| UX §6.3 Manual money record | Separate facts; the entry corrected stays in view; effects before the fields; Accounts duties as owned follow-up | A12 to A20, A98 to A108 |
| BS B26, B33 | Additive corrections; one correction per entry; the date-only change refused as Core answers | A19, A100 to A104 |
| BS B29 `Payment_Missing_Override` | List with owner; notice to the owner; closure only by a later entry | A21 to A33, A49 |
| BS B27 | Fee, liability, TM-paid, receipt and allocation, outstanding recovery separate | A04, A13, A16, A20 |
| CC-08 | Four notices; no control; routes stay | A47 to A52 |
| AD-12; WP-01 Q-04 | `/accounts` retired | A54 |
| BS B35 | Replay and matrices | A42, A43, A108 |
| V24 | Keyboard, screen reader, phone | A67 to A78 |

## 2. Acceptance checklist

### 2.1 TA-11 Payment history (travel agent)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A01 | Travel agent (Y) | TA-11 right after activation (§3 F-0a) | Open "Payment history" from the rail. | `h1` "Payment history"; lead "The price and the payment status of each application, and government fees TravelMudra paid for you. TravelMudra records payments by hand."; "Read at [time] IST"; the "How to pay" paragraph as text. S2: "No payment record yet. A payment record appears when you create an application." No "0", no total, no all-clear. Rail current item "Payment history". | L | UX §4.2; design §2.1; D7 |
| WP16-A02 | Travel agent (Y) | TA-11 after Setup 1 (§3 F-0c) | Read the cards. | One card per application, newest first: `h3` title linking TA-07; "Reference to quote" (copyable); Stage "Submitted"; "Price in effect: ₹[n]"; "Service payment: Not recorded yet" with its meaning line. Exactly A, B and C. View tabs with counts by Core fields ("All (3 applications)"; "Not recorded as received (3)"; "Recorded as received: None"; "With government fees: None"; "Drafts: None"). No amount due, no total. | L | Design §2.1; `pay.ta_payments` |
| WP16-A03 | Travel agent (Y) | TA-11 of B after K-4 (§3 F-9) | Open "Payment status history of [B's title] (3 entries)". | Oldest first: "Entry #1 · Payment entry · Recorded as received · Recorded [time] IST"; "Entry #2 · Correction (the earlier entry is kept) · Recorded as not received"; "Entry #3 · Correction (the earlier entry is kept) · Recorded as received". Every entry stays. No recorder, evidence, note, reason or amount (the read returns none). Evidence inspection (UX §4.2) is "Partly met" (STOP-W16-01 parked; M-11). | L | UX §4.2; BS B26, B33; design §2.1 item 5 |
| WP16-A04 | Travel agent (Y) | TA-11 of C after Setup 4 (§3 V09F-3) | Read C's government fee table. | "Government fees for this application (separate from the price)": Filing attempt "1"; State "Paid by TravelMudra for you"; "Paid by TravelMudra for you: ₹1,500"; "Received from you and allocated (as recorded): ₹0"; "Still to recover (as recorded): ₹1,500" (M-01). Under the page's notices the recovery notice: "Recording here a payment you make for a government fee is not available yet. The amount under 'Still to recover' can remain after you pay. Owner: TravelMudra." No sum row; price and fee never added. | L | BS B27, B29, B43; M-01; design §2.9 row 5 |
| WP16-A05 | Travel agent (Y); test | TA-11 of C at V09F-1 (fee `reserved`); fixtures of each fee state | Read C. Test: one fee in each state. | M-02: a `reserved` or `payment_unknown` fee shows no row and no word about it ("Not paid yet", "Being confirmed", "Not known yet", reservation, exposure or ceiling); the application does not count in "With government fees" unless another fee of it has a liability; the recovery notice shows only when a shown fee row exists. Rows with a liability show A04's facts; `recovered_partially` and `recovered` read "Partly received from you (as recorded)" and "Received from you (as recorded)". Live at V09F-1: C shows no fee row and "With government fees: None". | L (C) + T | **M-02** (R-02); M-01 |
| WP16-A06 | Test (`payment-history.test.ts`) | TA-11 renderer | Render: no entry; a completed application recorded as not received; an application ended with its group; a draft with and without an entry; an application under a Gate 1 exception; exactly 200 applications; the read unavailable; an unknown status. | No "Amount due", "Due from you", total, sum or all-clear (Q-W16-01). No sentence about work, gates or exceptions. Completed: Stage "Processing completed" and its payment facts as recorded, no extra sentence (V19). Ended: "Ended with its group". Draft: "Price in effect: Fixed when you submit". At 200 rows: "This page lists the 200 most recently created applications. Older applications are not listed here; open them from Applications." and view counts "[n] in the 200 listed" (STOP-W16-04). Unavailable: S7, never an empty list. Unknown: "Unrecognised: [code]". | T | Q-W16-01; D-W16-06; BS B25, B26, B29; WP-07 F-05 |
| WP16-A07 | Travel agent (Y) | TA-11 (every state of the run) | Look for money actions. | No form. No "Pay now", "Pay online", refund, claim, write-off, credit or settle control, enabled or disabled. Notices as text: "Paying online is not part of this service. Pay TravelMudra as agreed and quote the application reference." (excluded scope, no owner line); refunds (M-10): "Recording a refund is unavailable in this release. Owner: TravelMudra." (never "not available in this service"); the recovery notice when a fee row shows. | L | UX §4.2; BS B29, B42, B43; **M-10** |
| WP16-A08 | Travel agent (Y); test | TA-11 and the TA-07 section | Read all text. Test (`money-words.test.ts`, `money-host-pages.test.ts`): every TA word and rendered TA page. | No "exception", "gate", "ceiling", "exposure", "reservation", "follow-up item", "SuperAdmin", staff name, evidence, reason, "Accounts dashboard" or grant. TA-11 uses only `pay.ta_payments`. | L+T | UX §4.2; BS B10, B29; design §2.0 |
| WP16-A09 | Travel agent (Y) | TA-11 → TA-07 of B → TA-11 (§3 F-9) | Select B's title. Press Back. On TA-07 select "Payment history for this application". | TA-07 of B opens; Back returns to TA-11 in the same view and page; the link opens `/ta/payments?application=<B>#app-<B>` with B's history open (D-W16-11). | L | UI-PLAN TA-11 primary; SH-R07; design §2.2 item 4 |
| WP16-A10 | `syn-ta-2`; Y; test | Isolation (§3 F-12) | `syn-ta-2` opens TA-11. Y opens SA-07a of B and SA-07f by address. Test: Y suspended while TA-11 is open. | `syn-ta-2`: none of A, B, C (delta 0). Y: the uniform not-found page. Suspended: signed out with the cause; no earlier facts remain (test "signs a suspended travel agent out of the payments page"; LD-14). | L+T | BS B10; LD-14 |
| WP16-A11 | Test | TA-11 and TA-07 in a support view | SA2 starts a support view of Y; opens TA-11 and TA-07 at staff. | The support-view banner; the same facts; no form except ending the view and signing out; links stay on the TA pages of the support view; every `/admin` page answers 409 `support_view_active`. | T | SH-R09; design §2.1 states |
| WP16-A112 (new) | Travel agent (Y); test | TA-11 views, paging and the `application` filter (§3 F-9) | Open each view; open `?application=<C>`; test: 120 applications; `?page=` beyond the last page; `?application=` of an application not listed; `?view=` unknown. | `view`, `page` and `application` sit in the address (SH-R06); counts by Core fields, zero reads "None"; 50 cards a page; S3 "No application in this view." with "Show all applications"; an application not among the listed rows: "This application is not among the 200 most recently created applications listed here. Open it from Applications."; an invalid value is ignored. Live: "Recorded as received" lists B and C after Setup 4; "With government fees" lists C only. | L+T | Design §1.3, §2.1 items 3 to 5; Q-W16-07; M-02 |

### 2.2 TA-07 "Payment" section (new in this alignment)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A109 (new) | Travel agent (Y) | TA-07 of A and of B (§3 T-1) | Read the "Payment" section. | `h2` "Payment"; CMP-16 rows "Price in effect: ₹3,500" and "Service payment" with the TA words. A: "Not recorded yet", the "How to pay" paragraph with the reference, the link "Payment history for this application". B: "Recorded as received", no "How to pay". Neither shows "Amount due" or a work-gate line (A was assigned under a Gate 1 exception: no gate or exception word; F-05). | L | Design §2.2; F-W16-06; WP-07 F-05 |
| WP16-A110 (new) | Test (`payment-history.test.ts`, TA-07 cases) | TA-07 section | Render: a completed application recorded as not received; a draft with an entry; a draft without an entry; a null price; a support view. | Completed: the section shows its facts (never hidden as "owes nothing"; V19). Draft with an entry: shown; draft without: absent. Null price: "Not available". Support view: no form. No "Amount due" and no gate inference in any case. | T | Design §2.2; D-W16-07 |
| WP16-A111 (new) | Travel agent (Y); test | TA-07 of C at V09F-1 (fee reserved; act authorized, not evidenced); fixture: a fee `payment_unknown` after an uncertain execution | Read TA-07 and TA-11. | TA-11 shows no fee row (A05). TA-07 keeps the truthful external state in the words of its own section (WP-07, WP-10 F-21 TA sentences): at V09F-1 no "Filed" claim; for the uncertain fixture the neutral uncertainty sentence of WP-07/WP-10, with no fee amount and no "payment" claim. | L (C) + T | **M-02**; WP-07 V10-2; WP-10 F-21 |

### 2.3 SA-07a Service payment of one application (WP-16 parts, D-20)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A12 | SuperAdmin (SA1) | SA-07a of C (§3 V09F-2) | Read the page from the top. | Reading order: header with lifecycle words → receipt → status facts and the CMP-16 block (Price in effect; Service payment; "Government fee records: 1"; "Payment follow-up: None"; "Operator work authorized: Yes") → action panel (WP-06) → "Record a payment entry" (WP-06) → "Payment entries" (chain, A19; link "Correct entry #1" → SA-07c) → "Payment follow-up" → "Government fees paid by TravelMudra" → "Money actions not available" (refund and Accounts notices). No correction form on SA-07a. No money fact from a gate row (F-05). "Read at [time] IST". | L | D-20 (AM-W16-01); design §2.3 |
| WP16-A13 | SuperAdmin (SA1) | SA-07a of C at V09F-1 and V09F-2 | Read the fee table each time. | "Attempt 1"; state "Reserved, not paid" then "Paid by TravelMudra"; the five Core amounts: fee ₹1,500; paid by TravelMudra ₹0 then ₹1,500; TA liability ₹0 then ₹1,500; "Received and allocated (as recorded)" ₹0; "Outstanding recovery (as recorded)" ₹0 then ₹1,500 (M-01). Under the table the exclusion notice (A48). | L | BS B27; D-20 (d); **M-01** |
| WP16-A14 | Test (`service-payment-page.test.ts`) | SA-07a fee words | Render each fee state; a fee paid above its reservation; a preparation-only and a provider-filed application; an unknown state. | §0.2 staff words; `payment_unknown`: "Payment result not known" with its owner line and "Not known yet" in the paid, liability and outstanding cells, never ₹0; recovered states with "(as recorded)"; no fee row for a mode without TravelMudra-paid fees ("Government fee records: None"; no inferred Gate 2, funding or payer rule, B27); unknown: "Unrecognised: [code]". The design gives no words for `paid_exceeds_reservation` (§6 Q-16). | T | Design §2.0, §2.14; M-01; BS B27 |
| WP16-A15 | SuperAdmin (SA1); test | SA-07a of C | Look for a way to record or correct a government fee. | No form records, edits or corrects a fee, liability, TM-paid amount, receipt, allocation or recovery (no Core command; D-W16-08). The fee section states the source: "Government fee records come from the operator's authorization (a reserved record) and from the act's evidence (paid, or payment result not known)." and the government-fee correction limitation (M-10): "Correcting a government fee record is unavailable until the product owner decides how a recorded fee may be corrected. Owner: product owner. No route in this release." UI-PLAN "Record government fee fact": "Unmet: no Core command (D-W16-08; Max's end review)". | L | **M-10**; D-W16-08; PL §7, A-03 |
| WP16-A16 | SuperAdmin (SA1) | SA-07a of C "Money actions not available"; SA-07t and SA-07h (observe F-37) | Read the Accounts notice. | Closed-table row 5: "Verifying a bank receipt, allocating it, recording a recovery and adjusting a balance are unavailable until the product owner defines the accounting actions. Counted exposure and outstanding recovery do not decrease in this release. Owner: product owner. No route in this release." with the reference code, and the M-01 sentence that a recovery amount can remain after the travel agent pays. No control. No notice for a fee formula, assistance charges or other-mode fees (no such action exists, design §2.0); the price and the fee stay separate amounts. | L | BS B29, B43; **M-01**; design §2.0, §2.9 |
| WP16-A17 | SuperAdmin (SA1) | SA-07a of B (§3 F-2) and of A (§3 F-8) | Read "Payment follow-up". | One row per item: kind words linking SA-07k; state "Open" or "Closed" (M-03: no closing entry or time on SA-07a; the item page holds them); accountable SuperAdmin ("(not active)" when so); "Opened [time] IST". B: FU-B "Closed", FU-B2 "Open", owner SA1. A after F-7: FU-A "Closed". S2: "No payment follow-up for this application." | L | **M-03** (R-03); BS B29 |
| WP16-A18 | Test | SA-07a of an application completed by the harness with an open item (§3 V19T) | Render. Record "Payment received" (test). Render again. | Meta "Processing completed"; the line "Processing completed. [n] payment follow-up items stay open. Each closes only when a later entry records payment received."; the record form as Core allows; no reopen control. After the entry: the row reads "Closed" (M-03) and SA-07k shows "Closed by payment entry #[n] at [time] IST"; completion and counted exposure unchanged (test "a correction to received after work … closure survives completion and changes nothing else"). | T | D-20 (f); **M-03**; UX §3.2; V19 |
| WP16-A19 | SuperAdmin (SA1); travel agent (Y) | SA-07a of B; TA-11 of B (§3 F-9) | Compare. | SA-07a "Payment entries", oldest first: "#1 Record · Received · Replaced by entry #2"; "#2 Correction of entry #1 · Not received · Replaced by entry #3"; "#3 Correction of entry #2 · Received · Current", each with event and recorded time, recorder, evidence and reason (marks in text). TA-11: the same three entries with TA words, status and recorded time only. No page drops an entry. | L | D-20 (b); BS B26, B33 |
| WP16-A20 | SuperAdmin (SA1); travel agent (Y) | SA-07a of C, SA-07t of Y, TA-11 of C (§3 V09F-2, V09F-3) | Read the three pages. | One funded commitment: SA-07a paid ₹1,500, liability ₹1,500, outstanding recovery (as recorded) ₹1,500; SA-07t ceiling ₹5,000 "Set", "Paid by TravelMudra, not recovered: ₹1,500", unused reservations ₹0, counted ₹1,500 (delta 0 from V09F-1); TA-11 "Paid by TravelMudra for you: ₹1,500", "Still to recover (as recorded): ₹1,500". No page shows another amount. | L | V09; BS B27, B28; M-01 |

### 2.4 SA-07c Correct the current payment entry (`pay.record_service_status`, use `correction`; new in this alignment)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A98 (new) | SuperAdmin (SA1) | SA-07a of B → SA-07c (§3 K-1) | Follow "Correct entry #1". Read. | Breadcrumb "Money & exposure › Finance › [title] › Correct entry #1"; `h1` "Correct entry #1: [title]"; "Read at". Scope ("A correction adds a new entry. Entry #1 stays in the record unchanged. Only the current entry can be corrected, and each entry only once."); "Evidence: entry #1 as recorded" (entry, status, amount, payment date, evidence rows, reason, recorded by and at); Current facts (Service payment; "Operator work authorized: Yes"; open items; gates as WP-06); Effect; Hard stops (date-only and the boundaries); "Your correction": status radio none preselected, amount, date and evidence rows 0 to 4 prefilled from entry #1 (rows 1 to 4 in "Add more evidence"), reason required; hidden `kind=correction`, `correctsEntryId`, `_rev.payment`; Review visible; "Record the correction", "Cancel" → SA-07a. | L | Design §2.4; Q-W16-02; D-W16-12 |
| WP16-A99 (new) | SuperAdmin (SA1); test | SA-07c Effect (§3 K-1); fixtures `workAuthorized` false and null; an assignment committed between load and send | Read the Effect. Test: send after the assignment committed. | Always (M-05): "If operator work is authorized on this application before you send the correction, the correction can open a payment follow-up item, and you are accountable for it." "Operator work authorized: [Yes / No / Not available]" stays a separate Current fact. With Yes (B): also "Operator work was authorized on this application. This correction opens a payment follow-up item, and you are accountable for it." and the kind by status change. The race fixture: accepted; the receipt names the item it opened. | L+T | **M-05** (R-05); design §2.4 item 4, §4.3 |
| WP16-A100 (new) | SuperAdmin (SA1); harness | SA-07c of B (§3 K-2) | Choose "Payment not received", keep the evidence prefilled, add the attestation, give the reason; send. Harness: resend the same `_op`. | 303 to SA-07a; receipt "Correction recorded": "Entry #2, correction of entry #1", status, evidence; "Payment follow-up opened by this entry: Corrected to not received after operator work" (link SA-07k of FU-B); "Payment follow-up items closed by this entry: 0". Current: service payment "Not received"; Gate 1; Gate 2; one open item. The chain marks #1 "Replaced by entry #2" and #2 "Current". The resend: the same 303 and receipt; one entry #2. | L | Design §2.15 `corrected`; BS B26, B29 |
| WP16-A101 (new) | SuperAdmin (SA1) | SA-07c of B, fresh (§3 K-3) | Change only the payment date; send. | Refused `correction_no_change`, form level: "Nothing that TravelMudra compares has changed: give a different status, amount or evidence. A different payment date or reason alone is not accepted as a correction now. Nothing was recorded."; every value kept; SA-07c re-rendered at the POST address; no entry #3. The page does not alter any other value to force acceptance. | L | WP-06 D-09; P-10 g; design §2.12 |
| WP16-A102 (new) | SuperAdmin (SA1), two tabs | SA-07c of B (§3 K-4) | Tab 1 opens SA-07c (targets #2), fills values. Tab 2 records #3 (A103). Tab 1 sends. | CMP-14: "Current entry: you were correcting #2 / now #3 ([status], recorded by, at)"; "Service payment: your chosen status / current"; the line "Your values are kept. They now correct entry #3, the current entry: check them before you send."; the hidden `correctsEntryId` and `_rev.payment` come from the re-read; nothing recorded (entries delta 0). Tab 1 then cancels. | L | Design §2.16; BS B19, B35; M-09 class |
| WP16-A103 (new) | SuperAdmin (SA1); test | SA-07c of B in tab 2 (§3 K-4); test: three corrections in a chain; two corrections of one entry with fresh revisions | Tab 2: choose "Payment received", five evidence rows (reference and four attestations), reason; send. | Accepted: "Entry #3, correction of entry #2". The chain of A19 on SA-07a; TA-11 three entries (A03). Test: entry #4 corrects #3; each entry is corrected once (the second send answers `stale_revision` or the unique index, CMP-14, nothing recorded); SA-07c always targets the current entry. | L+T | Design §4.3 "correction after a correction"; migration index `pay_service_entries_correction_uq` |
| WP16-A104 (new) | SuperAdmin (SA1) | Receipt of K-4; SA-07k of FU-B and of FU-B2 (§3 K-4, F-2) | Read. | The receipt of #3 states both effects of the same correction: "Payment follow-up items closed by this entry: 1" (FU-B, opened by #2) and "Payment follow-up opened by this entry: Payment entry corrected after operator work" (FU-B2, opened by #3, owner SA1). SA-07k of FU-B: "Closed by payment entry #3 at [time] IST. This is not a bank-verified collection." SA-07k of FU-B2: "Open"; the entry that opened it does not close it. | L | `closeExceptionsByEntry`; test "a correction to received after work opens its own exception and closes only the earlier ones…"; design §4.3 |
| WP16-A105 (new) | Test (`payment-correction.test.ts`, `bff-payment-follow-up.test.ts`) | SA-07c states and refusals | No current entry; a support view; a completed application; refusals `payment_evidence_required`, `payment_evidence_not_found`, `kind_not_allowed`, `invalid_id`, `in_future`, `reason` required, `correction_target_not_current`, `payment_entry_kind_invalid`, `conflict_operation_key`; a saved envelope after the entry stopped being current. | No entry: "There is no entry to correct. Record the first payment entry on the service payment page." with the link, no form. Support view: 409. Completed: "Processing of this application is completed. The correction does not restart any work." Each refusal: the §2.12 sentence at its field or form level; SA-07c re-rendered at the POST address with every value kept; a `kind=record` refusal re-renders SA-07a (WP-06). Access refusals: the shell. | T | Design §2.4, §2.12; WP-09 G-05 |
| WP16-A106 (new) | Test (`bff-payment-follow-up.test.ts`) | The correction handler (LD-17) | Send: an amount that is not an amount; a date that is not a date; six evidence rows; a kind of 41, an id of 201 and a note of 201 characters; an empty status; a hidden `kind` of 17 and `correctsEntryId` of 65 characters; a row with only a note; a wholly empty row. | Each refused at its field (form level for the hidden fields) with the §2.13 sentence; every value kept whole; no `.slice`; **no command call**; the wholly empty row omitted, a partly filled row refused at its index. | T | **M-06**; LD-17; design §2.13 |
| WP16-A107 (new) | SuperAdmin (SA1); test | Largest valid correction (§3 K-4; test) | Live: #3 with five evidence rows. Test: five rows at their maximum lengths with a 1,000-character Devanagari reason, over real HTTP. | The body fits the new limit and reaches Core; accepted; every row shows in the entry on SA-07a. A refusal for size is a failure (`WP-16.md` §3 PM Q-14). | L+T | **M-12**; LD-17 |
| WP16-A108 (new) | Test; harness | Correction replay matrix | (1) Identical replay (live in K-2). (2) Same `_op`, changed content. (3) Back after the receipt. (4) Rejected-form refresh after A101 (fixture). (5) Lost acknowledgement. (6) A raw stale envelope with a new key. | (1) One entry, the same receipt. (2) `conflict_operation_key`; values kept. (3) SA-07c targets the new current entry. (4) The corrected send recorded once. (5) C4; the status page links SA-07a. (6) CMP-14. | L (1) + T | BS B35; design §4.1 |

### 2.5 SA-07f Payment follow-up

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A21 | SuperAdmin (SA1) | SA-07f (§3 F-1, F-6, F-8) | Open "Payment follow-up" from the rail member. Change the view; reload; press Back. | Breadcrumb "Money & exposure"; `h1` "Payment follow-up"; the design's lead; "Read at". Views "Open ([n] items)", "Yours ([m] items)", "Closed", "All" with `state` in the address; reload and Back keep it; an unknown value shows "Open". Line "Open items you are accountable for: [m]" with "Show yours" outside the Yours view. Rows: Why (link SA-07k); Application (link SA-07a) and Stage; Travel agent (link SA-07t); Accountable SuperAdmin; "Opened [time] IST"; State "Open" or "Closed" (no closing time: the list read returns none; §6 Q-15). F-1: "Open" P-0 + 2 (FU-A, FU-B2), "Closed" lists FU-B, SA1's "Yours" P-0 + 2. F-6: SA1 P-0 + 1, SA2 P-0 + 1. F-8: "Open" P-0 + 1; "Closed" lists FU-A and FU-B. | L | Design §2.5; **M-03** class; BS B29 |
| WP16-A22 | SuperAdmin (SA1); test | SA-07f counts, cap and paging | Read. Test: 0, 1, 101 open; 101 closed; 60 rows on one view. | "Open" and "Yours" counts are Core's exact counts with "items"; "Closed" and "All" show none. At `more`: Open "This list shows the oldest 100 items of this view. [openCount] items are open in total."; Yours "… [mineCount] items are yours in total." (§6 Q-15); Closed, All "This list shows the oldest 100 items. More exist." 50 rows a page (`page`). No age ("Open for [n] days"), overdue or SLA; no colour-only marker. | L+T | Design §2.5; D-W16-09; K-05 |
| WP16-A23 | Test; gallery | SA-07f with an inactive owner | Render. | The owner cell "Not active: change the accountable SuperAdmin" in text with the attention marker (text and icon). | T + gallery | Design §2.5 item 4 |
| WP16-A24 | Test | SA-07f with an item of an application completed by the harness (§3 V19T) | Render "Open". | The row stays with Stage "Processing completed". | T | V19; test "lists all four kinds…, keeps a completed application…" |
| WP16-A25 | Test | SA-07f states | Each view empty; the read unavailable; access, session, maintenance, support-view refusals. | S2: "No payment follow-up item is open."; "You are accountable for no open item."; "No item has been closed yet."; "No payment follow-up item exists." No success tone or "All done". Unavailable: S7. Refusals: the shell. | T | Design §2.5; D7; LD-14 |
| WP16-A26 | SuperAdmin (SA1) | SA-07h (F-37); SA-01 group 11 (D-21) (§3 F-1, F-6) | Read; follow each link. | SA-07h: "Payment follow-up: [open] items open; [mine] items yours" equal to SA-07f at the same moment, links to SA-07f and `?state=mine`. SA-01 group 11 (projection, lag form; "Unavailable" when null): "Accountable SuperAdmin not active: [k] items" links SA-07f `?state=open`; "Yours: [m] items" when that read is composed. | L | **F-37**; **D-21**; LD-08 |

### 2.6 SA-07k One follow-up item

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A27 | SuperAdmin (SA1) | SA-07k of FU-A (§3 F-2) | Read the page. | `h1` "[Kind words]: [title]"; "Read at". Status facts: State; Why (meaning line); Application (link SA-07a) and Stage; Travel agent (link SA-07t); Accountable SuperAdmin ("(you)" for SA1; "(not active)" when so); "Opened [time] IST"; Cause (A28); "Service payment now" (Current); "Price in effect" as a separate fact, never an amount owed; "Notice to the accountable SuperAdmin: Posted / Not posted". Action panel (A29). Secondary links "Change the accountable SuperAdmin" → SA-07r and "History of this item" → SA-08s. Notices: write-off, Accounts. No computed "Outstanding". | L | Design §2.6; F-W16-01 |
| WP16-A28 | SuperAdmin (SA1); test | SA-07k "Cause" of FU-A and FU-B2 (§3 F-2); test: each kind | Read. | Gate kinds: "A Gate 1 exception was used while the service payment was not recorded as received." (Gate 2 likewise) with the link "Gate exceptions of this application" (STOP-W16-03 parked). Entry kinds: "Payment entry #3 recorded Received at [time] IST" (FU-B2). The Gate 2 kind (design V09W-3) runs as a test here; live it is WP-07 V09-13. | L+T | Design §2.6 item 3; K-11 |
| WP16-A29 | SuperAdmin (SA1) | SA-07k action panel of FU-A and FU-B2 (§3 F-2) | Read both. | FU-A (status "Not recorded"): owner SA1; "Record the payment when it arrives. A later entry that records payment received closes this item." → SA-07a `#record`. FU-B2 (status "Received"): "The current entry already records payment received. This item closes only with a later entry that records payment received: a correction that changes the amount or the evidence. Correct the entry only when it is wrong. Verifying the payment and writing the item off are not available (notices below)." → "Open the service payment page". No suggestion to correct only to close (Q-W16-09). | L | Design §2.6 item 4; Q-W16-09; WP-06 D-09 |
| WP16-A30 | SuperAdmin (SA1) | SA-07k of FU-B (§3 K-4) and of FU-A (§3 F-8) | Read. | State "Closed by payment entry #[n] at [time] IST. This is not a bank-verified collection."; action panel "Closed by payment entry #[n]. Nothing more is recorded for this item."; no link to SA-07r; history link stays. | L | Design §2.6; M-03 |
| WP16-A31 | SuperAdmin (SA2) | SA-07k of FU-A after F-4; `/admin/notices` (observe WP-15) | Read. | "Notice to the accountable SuperAdmin: Posted". SA2's notices are one more than the count read at the start of F-4. No page promises a repeated reminder. | L | BS B29; UX §8.2; AM-W16-04 |
| WP16-A32 | Test; gallery | SA-07k inactive owner; completed application (§3 V19T) | Render. Test: change the owner of the completed application's item. | Inactive: action panel first "The accountable SuperAdmin is not active, so nobody is reminded of this item. Change the accountable SuperAdmin." → SA-07r. Completed: "Processing of this application is completed. This item stays open after completion until a later entry records payment received. No government work restarts."; the owner change accepted. | T + gallery | Design §2.6 items 4, 5; V19 |
| WP16-A33 | Test (`money-words.test.ts`) | Word tables | Every value of the payment vocabularies and lifecycles, both audiences; an unknown value. | §0.2 words; no forbidden word of design §2.0; TA words hold no internal term; unknown "Unrecognised: [code]". | T | Design §2.14, §7.1 U0 |
| WP16-A34 | Operator (OP1); travel agent (Y); SuperAdmin (SA1) | SA-07f, SA-07k, SA-07r, SA-07c addresses (§3 F-12) | Open each; SA1 with a made-up id. | The uniform not-found page each time; no fact disclosed. | L | BS B10 |

### 2.7 SA-07r Change the accountable SuperAdmin (`pay.reassign_follow_up_owner`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A35 | SuperAdmin (SA1) | SA-07r of FU-A (§3 F-3) | Read. | `h1` "Change the accountable SuperAdmin: [kind words], [application]"; Scope; Evidence (State; "Accountable SuperAdmin now: [SA1]"; Opened; Cause; Service payment now); Effect ("The SuperAdmin you choose becomes accountable for this item. TravelMudra posts a notice to them in the same step. … The item still closes only with a later entry that records payment received."); Hard stops; "New accountable SuperAdmin": radio group of Core's `eligibleOwners` in Core order, none preselected (SA2 listed; SA3 only when Core reports SA3 eligible; SA1 not listed); "Reason for the change" (10 to 1,000); hidden `_rev.exception`; Review; "Change the accountable SuperAdmin", "Cancel" → SA-07k. | L | Design §2.7; Q-W16-03 |
| WP16-A36 | SuperAdmin (SA2) | SA-07r of FU-A, tab 2 (§3 F-4) | After the refused first send (A42 (4)), choose SA2, give the reason, send. | 303 to SA-07k; receipt "Accountable SuperAdmin changed", "Accountable SuperAdmin: [SA2]"; Current: owner SA2, state Open. M-12: a fresh read of SA-07k shows the item's revision advanced beyond the value the form carried (no fixed increment asserted). | L | Design §2.15 `reassigned`; **M-12** |
| WP16-A37 | SuperAdmin (SA1); test | SA-07r refusals (§3 F-3) | (1) Live: send with nothing chosen and the reason "short". (2) BFF test: reasons of 1,001 and 4,001 characters; an owner of 65 characters; an owner that is not an account id. (3) Core contract test (direct, bypassing the BFF): a missing or short reason; a missing expected revision. | (1) and (2) BFF refusals (M-06): "Choose a SuperAdmin." and "Give a reason of at least 10 characters (up to 1,000)." at their fields; every value kept whole in the re-render; **no command call** (operations delta 0). (3) `validation_failed` / `input_invalid`; nothing recorded (existing `follow-up.test.ts`). | L (1) + T | **M-06** (R-06); design §2.13 |
| WP16-A38 | Test; gallery | SA-07r states | (1) Closed item. (2) No eligible SuperAdmin. (3) Support view. | (1) No form: "This item is closed by payment entry #[n]. Its accountable SuperAdmin no longer changes." link SA-07k. (2) No form: "Changing the accountable SuperAdmin is unavailable until another SuperAdmin is active and uses an authenticator. Owner: SuperAdmin." with the link "Accounts & access". (3) 409. On GET the blocker shows and no form; a saved envelope after (1) answers `financial_exception_not_open`. | T + gallery | Design §2.7; WP-09 G-05 |
| WP16-A39 | Test | `follow_up_owner_not_eligible` | The chosen SuperAdmin is suspended after the page loaded; raw: the current owner; raw: an operator. | "That SuperAdmin cannot be accountable now: choose an active SuperAdmin who uses an authenticator, other than the current one." at `owner`; the reason kept; the re-read list lacks them, no option selected, and the line "The SuperAdmin you chose cannot be accountable now."; nothing recorded. | T | Design §2.12, §4.3 (b) |
| WP16-A40 | SuperAdmin (SA1, SA2), two tabs | SA-07r of FU-A (§3 F-4) | SA1 tab 1 chooses SA2 and writes a reason. SA2 changes the owner (A36). SA1 sends. | CMP-14 (M-09): "Accountable SuperAdmin: your unsent choice [SA2] / now [SA2]"; "State: open / now open"; "Another change already made [SA2] accountable. Nothing more is needed."; the reason kept; SA2 shown as unsent text, not as a selectable option; no "you saw" row; nothing recorded (owner-changed facts and notices delta 0). | L | **M-09** (R-09); design §2.16 |
| WP16-A41 | SuperAdmin (SA1, SA2) | SA-07r of FU-A while A's payment is recorded (§3 F-7) | SA1 opens SA-07r, chooses SA1, writes a reason. Setup: SA2 records "Payment received" for A. SA1 sends. | "This item was closed by a payment entry since you opened the page. Nothing was changed."; the closed state; no form; the typed reason in the unsent text block (WP-09 U2). | L | Design §2.7, §2.12; WP-02 R-01, R-03 |
| WP16-A42 | SuperAdmin (SA2); harness; test | SA-07r, the Nth time (§3 F-4, F-5) | (1) Resend A36's POST (same `_op`). (2) Same `_op`, another reason. (3) Press Back. (4) Inside F-4, before the accepted change: SA2's first send with a 5-character reason. (5) Test: lost acknowledgement. | (1) The same 303 and receipt; one change, one notice. (2) The conflict sentence; values kept; nothing recorded. (3) SA-07r for SA2: SA2 not offered; SA1 and (when eligible) SA3 offered; no option reads "(you)". (4) M-07: refused by the BFF, new form key; the corrected send is the accepted change of A36, recorded once; FU-A's owner after F-4 is SA2 and stays SA2 until F-7. (5) C4; the status page links SA-07k (`resultHrefOf` maps `financial_exception`). | L ((1) to (4)) + T ((5)) | **M-07** (R-07); BS B35; test "retries replay one change and one notice…" |
| WP16-A43 | Test | Owner-change matrix | (1) Identical replay. (2) Changed content. (3) Business duplicate (new key, current revision, the now-current owner). (4) Raw stale envelope on an open item. (5a) Raw resend after closure. (5b) Corrected submission with another owner. (6) Two changes at one revision. | (1) Original result. (2) `conflict_operation_key`. (3) `follow_up_owner_not_eligible`. (4) `stale_revision` (CMP-14). (5a) `financial_exception_not_open`. (5b) Accepted once. (6) One winner. | T | Design §4.1; `follow-up.ts` order |
| WP16-A44 | Test | Largest valid owner-change form | A 1,000-character Devanagari reason over real HTTP. | Accepted: the new body limit fits it (`WP-16.md` §3 PM Q-14). | T | LD-17; PM Q-14 |
| WP16-A45 | SuperAdmin (SA1) | SA-08s of FU-A (§3 F-8) | Read. | Only recorded fields: `pay.financial_exception_opened`; `pay.financial_exception_owner_changed` (before, after, reason); `pay.financial_exception_closed` (state, closing entry); each with recorded time, actor, role. The refused sends of A37, A40, A41 left no fact. | L | BS B33; K-14 |
| WP16-A46 | Test | Receipt naming (design §2.15) | Every result shape the staff instance can show at a receipt address. | `reassigned`: named only when the resource is `financial_exception`, `exceptionId` equals the path id and `accountableSuperAdminId` is an account id. `corrected`: named only when the returned entry has `kind = correction`. Otherwise "Request recorded". An edited address never shows another command's title. | T | Design §2.15; WP-13 L-05 |

### 2.8 Policy boundaries (CC-08) and the Accounts surface

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A47 | SuperAdmin (SA1) | SA-07t of Y under "Reservations" (F-37) (§3 F-10) | Read. | Row 1: "Releasing an unused reservation is unavailable until the product owner decides when a reservation may be released. Until then it stays counted in this travel agent's exposure, also after the application completes. Owner: product owner." Route "Request a higher ceiling (a second SuperAdmin approves it)." → SA-07i; reference code. No "Release" control, enabled or disabled; no form posts `…/release`. | L | CC-08; F-37; design §2.9 row 1 |
| WP16-A48 | SuperAdmin (SA1) | SA-07a of C and SA-07t of Y under the fee tables (§3 V09F-2) | Read. | Row 2: "Excluding a government fee from counted exposure is unavailable until the product owner decides which payment record excludes a fee. The fee stays counted. Owner: product owner." Route: SA-07a "Open the travel agent's exposure ceiling" → SA-07t; SA-07t as row 1. No control; no form posts `…/exclude`. | L | CC-08; design §2.9 row 2 |
| WP16-A49 | SuperAdmin (SA1) | SA-07k of FU-B2; SA-07f (§3 F-10) | Read. | Row 3: "Writing off a missing payment is unavailable until the product owner decides who may write off and on what evidence. The item stays open. Owner: product owner." Route on SA-07k "A later entry that records payment received closes the item." → SA-07a; none on SA-07f. No control. | L | CC-08; design §2.9 row 3 |
| WP16-A50 | SuperAdmin (SA1) | SA-07a of A and C (§3 F-10) | Read. | Row 4: "Recording a refund is unavailable until the product owner decides refunds. Owner: product owner. No route in this release." No control; no form posts `…/refunds`. The TA variant reads "unavailable in this release" (A07, M-10). | L | CC-08; **M-10** |
| WP16-A51 | SuperAdmin (SA1); harness; test | SA-07b: hand-made POSTs to D106 to D109 (§3 F-10) | Post with the run's ids (C's reservation and fee, FU-B2, A) and with made-up ids. Test: as OP1; in a support view. | Each answers 409 SA-07b: `h1` "[Action name] is unavailable"; CMP-10 reason, "Owner: product owner", the route link, the reference code; "Nothing was recorded."; "Back to [object page]". A made-up id gets the same answer. Deltas 0: operations, `pay.*` facts, counted exposure of Y, FU-B2. OP1: not-found; support view: 409. | L+T | Design §2.8; CC-08; test "answers each deliberate boundary without recording anything" |
| WP16-A52 | Test (`money-host-pages.test.ts`, route inventory) | Every WP-16 and amended page | Render; collect form actions, buttons and links. | D106 to D109 stay registered; no form action, button or link targets `/refunds`, `/fees/<id>/exclude`, `/reservations/<id>/release` or `/write-off`; each notice appears only on the pages of design §2.9 (and TA variants only on TA pages). | T | Design §7.2 (a), (d); CC-08 |
| WP16-A53 | SuperAdmin (SA1) | SA-07a, SA-07t, SA-07f, SA-07k; SA-07t of `syn-ta-1` (§3 F-0b, F-10) | Read the B28 notices. | Each B28 case is its own notice on its object (rows 1, 2, 7); the default-ceiling notice (row 7, WP-07 words) shows for Y at F-0b and for `syn-ta-1`, and not for Y after Setup 3. No page-wide "commitments unavailable" notice; C's commitment was accepted (Setup 3). | L | V09; BS B28, B43 |
| WP16-A54 | SuperAdmin (SA1); test | `/accounts` (§3 F-11) | Open as SA1. Test: as an operator with the accounting grant; as one without; the route inventory; a link sweep. | Q-W16-04: SA1 → 303 to `/admin/finance#decrease`; the operator with the grant → 303 to `/account#accounting-grant` (OP-10 keeps its grant notice, WP-01); an operator without the grant → not-found. Never the old page; no page links `/accounts`. Before the retirement every callout has a home: verification, allocation and recovery, manual adjustment → row 5 (SA-07h, SA-07t, SA-07a, SA-07k); dashboard data and payment-record changes → the dashboard and payment-mutation limitation (M-10): "Accounts dashboard data and changes to payment records by Accounts are unavailable until the product owner defines them. Owner: product owner. No route in this release." on SA-07h; write-off → row 3; refunds → row 4; reservation release → row 1. | L+T | Q-W16-04; **M-10**; WP-01 Q-04; AD-12 |
| WP16-A55 | SuperAdmin (SA1) | SA-07a, SA-07c, SA-07h, SA-07t, SA-07f, SA-07k | Look for any other money control. | No gateway, "Pay now", refund, write-off, assistance-charge, other-mode fee, "Mark collected", "Verify receipt", "Allocate", "Adjust", "Release", "Exclude" or "Reset exposure" control. No "Accounts dashboard". | L | UX §6.3, §10.1; BS B29, B43 |

### 2.9 Command results, access and shell on WP-16 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A56 | SuperAdmin; travel agent | Every WP-16 page | Read the shell. | Environment label; "[TEST]"; rail: SA-07a, SA-07c under Money & exposure member "Finance"; SA-07f, SA-07k, SA-07r member "Payment follow-up"; SA-07b by its object; TA-11 "Payment history"; the design's breadcrumbs; one `h1`; "Read at". | L | Design §1.4 |
| WP16-A57 | Test | SA-07k, SA-07a, TA-11 addresses | Open with `?done=reassigned`, `?done=corrected` and no key; another person's key; a refused key. | No receipt from the address; locations carry `&op=` (D-W16-03); another person's key opens unchecked with current authorized facts; a refused key "Nothing is recorded for request [reference] so far". | T | WP-01 A-04; WP-12 J-09; F-W16-13 |
| WP16-A58 | SuperAdmin (SA2) | A36's receipt address after F-7 (§3 F-13) | Open. | "Accountable SuperAdmin changed", "Accountable SuperAdmin: [SA2]"; Current "Closed by payment entry #1". No instruction to act. | L | WP-07 F-33; WP-12 J-08 |
| WP16-A59 | Test | Text map of every refusal code (design §2.12) | Unit test against Core's vocabulary. | Each has its sentence: the correction codes of §0.5, `follow_up_owner_not_eligible`, `financial_exception_not_open`, `stale_revision`, `operation_key_reused`, the four boundary codes, `parked_accounts_actions`, `excluded_payment_gateway`, `support_view_active`; unknown: category text and "Reference code: [code]". | T | Design §2.12 |
| WP16-A60 | SuperAdmin (SA1) | Every refusal reachable live (A37 (1), A40, A41, A101, A102, A51) | Read. | CMP-07 at the field when one is named; owner or route where one exists; no code alone, "Something went wrong" or "Invalid data"; a refusal re-renders its own task page with values kept. | L | PL §1.1; CR-01 |
| WP16-A61 | Test (`money-host-pages.test.ts`) | Every page | Render; collect form actions. | The only form posting D27 with `kind=correction` is on SA-07c (SA-07a has none); the only form posting `…/reassign-owner` is on SA-07r; the carried-form tests drop their WP-16 entries. | T | Design §7.2 (b), (c); CC-19 |
| WP16-A62 | Travel agent (Y); operator (OP1); SuperAdmin (SA1) | TA-11, TA-07, SA-07 pages | Look for controls of other roles. | TA pages: no SuperAdmin or operator control. SA-07 pages: no operator act, readiness, filing, release, send or completion control. | L | BS B18 |
| WP16-A63 | Test (HTTP) | SA-07a, SA-07c, SA-07f, SA-07k, SA-07r, TA-11 | (1) The page's one read unavailable. (2) An access, session, maintenance or support-view refusal. | (1) S7 ("TravelMudra is unavailable now"), never an empty list or a form without its facts. (2) The shell; no earlier facts (LD-14). | T | Design §2.0; LD-14 |
| WP16-A64 | SuperAdmin; travel agent | TA-11, SA-07c, SA-07r | Inspect browser storage; read the headers. | No reason, reference, amount or name in browser storage; `no-store`. | L+T | SH-R12 |
| WP16-A65 | SuperAdmin; travel agent | Every WP-16 page | Read all text. | None of the forbidden words of design §2.0; "IST" on every time; units on every count; "Synthetic" (CR-08); no package or record id. | L | Design §2.0; PL §11.1 |
| WP16-A66 | Test | Money rendering | Render 150000, 150050, 12345600 and 0 paise. | Every amount through `money()`: currency in text, Indian grouping, no floating value, tabular figures (CMP-16); the format is the component's. | T | CMP-16; design §2.0 |

### 2.10 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP16-A67 | Keyboard-only users | TA-11 (F-9), TA-07 (T-1), SA-07c (K-1 to K-4), SA-07f, SA-07k, SA-07r (F-1 to F-4) at 1440 px; TA-11 and SA-07r at 390 px | Use the keyboard only. | View tabs, paging, history `details`, "Add more evidence", the status and owner radio groups, fields, send and cancel work with Tab, Shift+Tab, Enter, Space, arrows and Escape. | L | AC-01, AC-12 |
| WP16-A68 | Keyboard-only user | Every WP-16 page at 1440, 390 px and 400% | Tab through. | Focus visible (3:1), never hidden. | L | AC-02 |
| WP16-A69 | Phone user | TA-11, TA-07, SA-07a, SA-07c, SA-07f, SA-07k, SA-07r | 320 px; 1280 px at 400%. | One column; cards; facts before details; scope and effect before fields; the primary action at the end, never in a fixed bar; no horizontal scroll. | L | AC-04, AC-21; design §2.0 |
| WP16-A70 | Any | SA-07c, SA-07r | Inspect. | `status` and `owner` are `fieldset` with `legend`, none preselected, the choice kept after a refusal; every input labelled; required stated. | L | AC-05, AC-15; design §5 |
| WP16-A71 | Any | States, kinds, fee states, "Current", "Replaced by", "Not active" | Greyscale. | Text and icon for every mark; no colour-only state. | L | AC-06 |
| WP16-A72 | Any | SA-07c, SA-07r | Send with an error. | Focus to the error summary; links to fields; values kept. | L | AC-08 |
| WP16-A73 | Screen-reader user | Receipts; notices; tables; TA-11 `details` | Read with a screen reader. | Receipts polite without moving focus; notices are notes, not live regions or errors, and no `aria-disabled` money control exists; header cells; the `details` summary names the application ("Payment status history of [title] ([n] entries)"). | L | AC-09, AC-15; design §5 |
| WP16-A74 | Screen-reader user | Each unavailable action (A38 states, A47 to A50, A105 no-entry) | Reach the notice. | Reason, owner and route in reading order; no role-forbidden control. | L | AC-13; SH-R08 |
| WP16-A75 | Phone user | Every WP-16 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions at least 44 × 44 px. | L+T | AC-10 |
| WP16-A76 | — | Every WP-16 page | Contrast. | Text 4.5:1; non-text and focus 3:1. | L+T | AC-11 |
| WP16-A77 | Any | Long reason; long names; reduced motion | A 1,000-character reason; a 400-character name. | Wraps; full forms reachable; no transition with reduced motion. | L | AC-14, AC-20 |
| WP16-A78 | Travel agent and SuperAdmin (observation) | TA-11 after V09F-3; SA-07a of B and SA-07k of FU-B2 after F-8 | Ask Y "Do you owe TravelMudra anything for C, and how sure is that figure?" and "Was B's payment received?". Ask SA1 "Which entry of B is current, and what happened to entry #1?", "Who is accountable for FU-B2, and what closes it?" and "Can you write it off?". | The run record reports answers and sample size; a wrong answer is a finding. | L | AC-24, AC-26 |

### 2.11 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP16-A79 | Travel agent | TA-11 empty (F-0a) | L | UX §7.5; AC-01 to AC-28 |
| WP16-A80 | Travel agent | TA-11 "All" with A, B, C and B's history open (F-9) | L | same |
| WP16-A81 | Travel agent | TA-11 `?application=<C>` with the fee table and the recovery notice (V09F-3, F-9) | L | same |
| WP16-A82 | SuperAdmin | TA-11 in a support view | L (gallery) | same |
| WP16-A83 | SuperAdmin | SA-07a of C with the paid fee row and the notices (V09F-2) | L | same |
| WP16-A84 | SuperAdmin | SA-07a of A with the closed item (F-8) | L | same |
| WP16-A85 | SuperAdmin | SA-07f "Open" (F-1) | L | same |
| WP16-A86 | SuperAdmin | SA-07f "Closed" (F-8) | L | same |
| WP16-A87 | SuperAdmin | SA-07f "Yours" empty | L (gallery) | same |
| WP16-A88 | SuperAdmin | SA-07k of FU-A, open (F-2) | L | same |
| WP16-A89 | SuperAdmin | SA-07k of FU-A, closed (F-8) | L | same |
| WP16-A90 | SuperAdmin | SA-07r form (F-3) | L | same |
| WP16-A91 | SuperAdmin | SA-07r with the error summary (F-3) | L | same |
| WP16-A92 | SuperAdmin | SA-07r with CMP-14 (F-4) | L | same |
| WP16-A93 | SuperAdmin | SA-07r closed meanwhile, with the unsent block (F-7) | L | same |
| WP16-A94 | SuperAdmin | SA-07b, 409 (F-10) | L | same |
| WP16-A95 | SuperAdmin | Gallery: inactive owner; nobody to choose; completed application; every fee state; the cap lines | L (gallery) | same |
| WP16-A96 | SuperAdmin | Operation status page of the owner change: accepted, and "Nothing is recorded" for a refused key (F-5) | L | same |
| WP16-A97 | SuperAdmin | The page `/accounts` leads to (F-11) | L | same |
| WP16-A113 (new) | SuperAdmin | SA-07c form for B with the effect lines (K-1) | L | same |
| WP16-A114 (new) | SuperAdmin | SA-07c after the date-only refusal (K-3) | L | same |
| WP16-A115 (new) | SuperAdmin | SA-07c with CMP-14 (K-4 tab 1) | L | same |
| WP16-A116 (new) | SuperAdmin | SA-07a of B with the three-entry chain and the `corrected` receipt (K-4) | L | same |
| WP16-A117 (new) | SuperAdmin | SA-07k of FU-B2, the "already received" panel (F-2) | L | same |
| WP16-A118 (new) | Travel agent | TA-07 "Payment" section of A and of B (T-1) | L | same |
| WP16-A119 (new) | SuperAdmin | SA-07c: no entry; `workAuthorized` false and null warning variants | L (gallery) | same |

## 3. Proof scenarios V09 (WP-16 part) and V19 (financial follow-up part)

V09 (UX §12): "A funded government-fee commitment shows counted exposure and ceiling; each B28 unresolved reservation
case remains specifically unavailable rather than all commitments blocked." Authority B27 to B29, B43. WP-07 proves
the ceiling, the authorization and the SA-07t part; WP-16 proves the per-application money facts, their agreement, the
travel agent's view without internal controls (M-02) and the CC-08 notices and routes.

V19 (UX §12): "Completed processing can retain financial/disclosure follow-up; group-end date closure never consumes
unknown filing, held originals, pending delivery or outstanding money." Authority B25, B29. WP-16 proves the financial
follow-up part; WP-14 the disclosure part (WP14-A13, A38); WP-17 the group pages. Completion runs only in tests (LD-04).

One ordered recipe (M-08): this checklist's fresh-agent recipe with the design's correction and TA-07 checks. "Setup"
steps use pages of other packages; "Observe" steps check items other packages own. SA1 = `superadmin-1`, SA2 =
`superadmin-2`, OP1 = `operator-1`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-07f, SA-07h, SA-01; SA2: SA-07f "Yours"; `syn-ta-2`: TA-11 | Read. | Baselines of §0.4 recorded. | — | L |
| Setup 0 | SA1: SA-06 | Create and activate Y (or record the fallback). | Y signs in. | — | L |
| F-0a | Y: TA-11 | Read. | S2; no "0" or all-clear. | A01, A79 | L |
| F-0b | SA1: SA-07t of Y (observe) | Read. | Default ₹0; the B28 notices on their objects. | A53 | L |
| Setup 1 | Y: TA-09, TA-08 | Submit A and B ("SYN Tourist e-visa") and C ("SYN e-visa, fee paid with submission") in group `wp16-[stamp]`. | Three submitted. | — | L |
| F-0c | Y: TA-11 | Read. | Three cards, "Not recorded yet", view counts. | A02 | L |
| Setup 2 | SA1: SA-09g, SA-03a, SA-07a | A's Gate 1 exception and assignment to OP1; B's entry #1 "Payment received" (`SYN-W16-[stamp]-PAY-B`) and assignment to OP1. | FU-A open, owner SA1. | — | L |
| K-1 | SA1: SA-07a of B → SA-07c | Read SA-07a; follow "Correct entry #1"; read SA-07c. | Chain "#1 Record · Current"; SA-07c anatomy; "Operator work authorized: Yes"; both effect lines (M-05). | A12, A98, A99, A113 | L |
| K-2 | SA1: SA-07c of B; harness | Correct #1 to "Payment not received" with the attestation and a reason; harness resends the same `_op`. | Receipt "Correction recorded", entry #2, FU-B opened; one entry after the resend. | A100, A108 (1) | L |
| K-3 | SA1: SA-07c of B (fresh) | Change only the payment date; send. | The `correction_no_change` sentence with the date clause; values kept; no entry #3. | A101, A114 | L |
| K-4 | SA1: two tabs of SA-07c of B | Tab 1 opens and fills values (targets #2). Tab 2 records #3: "Payment received", five evidence rows, reason. Tab 1 sends; then cancels. | Tab 2: entry #3; "closed by this entry: 1" (FU-B) and "opened by this entry" (FU-B2, owner SA1); the chain of A19. Tab 1: CMP-14 retargeted to #3; nothing recorded. | A102, A103, A104, A107, A115, A116, A30 | L |
| Setup 3 | SA1: SA-07i; SA2: SA-09c; SA1: SA-07a, SA-03a; OP1: OP-02, OP-04a | Y's ceiling ₹5,000 (request, approval); C "Payment received" (`SYN-W16-[stamp]-PAY-C`); assign C to OP1; OP1 starts work, confirms readiness, requests the authorization with fee ₹1,500. | Accepted (no blanket block); reservation ₹1,500. | A53 | L |
| V09F-1 | SA1: SA-07a of C, SA-07t; Y: TA-11, TA-07 of C | Read. | SA-07a "Reserved, not paid" ₹1,500; SA-07t counted ₹1,500 (unused reservation), ceiling ₹5,000 "Set"; TA-11: no fee row for C, "With government fees: None" (M-02); TA-07 of C: no "Filed" claim. | A05, A13, A111 | L |
| Setup 4 | OP1: OP-04b of C | "Filed" with `SYN-W16-[stamp]-PORTAL-C`, fee paid ₹1,500. | Fee paid. | — | L |
| V09F-2 | SA1: SA-07a of C; SA-07t of Y | Read. | Fee row "Paid by TravelMudra" with the five amounts and "(as recorded)"; source line, fee-correction limitation, exclusion, refund and Accounts notices; no fee form; SA-07t not recovered ₹1,500, unused ₹0, counted ₹1,500. | A12, A13, A15, A16, A20, A48, A83 | L |
| V09F-3 | Y: TA-11 of C | Read. | Fee row with "(as recorded)" labels and the recovery notice; no sum. | A04, A20, A81 | L |
| T-1 | Y: TA-07 of A and of B | Read the "Payment" section. | A: not recorded, how to pay, link; B: received; no "Amount due", no gate words. | A109, A118 | L |
| F-1 | SA1: SA-07f; SA-07h; SA-01 | Read the views; follow the links. | "Open" P-0 + 2 (FU-A, FU-B2); "Closed" lists FU-B with "Closed" only; SA1 "Yours" P-0 + 2; SA-07h equal; SA-01 in the lag form. | A21, A22, A26, A85 | L |
| F-2 | SA1: SA-07k of FU-A and FU-B2; SA-07a of B | Read. | Facts, cause, the two action-panel branches; SA-07a rows "Open"/"Closed" with links only. | A17, A27, A28, A29, A88, A117 | L |
| F-3 | SA1: SA-07r of FU-A | Read; send with nothing chosen and "short". | Anatomy; BFF field errors; no command. | A35, A37 (1), A90, A91 | L |
| F-4 | SA2: `/admin/notices`; SA1 tab 1, SA2 tab 2: SA-07r of FU-A | SA2 reads the notices count. SA1 opens tab 1, chooses SA2, writes a reason. SA2 opens tab 2, sends with a 5-character reason (refused by the BFF), corrects the reason and sends. SA1 sends tab 1. | Tab 2: the refusal, then receipt "Accountable SuperAdmin changed", owner SA2, advanced revision on a fresh read; SA2's notices +1. Tab 1: CMP-14 "your unsent choice / now"; nothing recorded. | A31, A36, A40, A42 (4), A92 | L |
| F-5 | Harness; SA2 | Resend tab 2's accepted POST (same `_op`); the same `_op` with another reason; Back; open the status page of the key and of a refused key. Nothing changes the owner. | Same receipt; the conflict sentence; SA-07r without SA2; status pages. | A42 (1) to (3), A96 | L |
| F-6 | SA1, SA2: SA-07f "Yours"; SA-07h | Read. | SA1 P-0 + 1 (FU-B2); SA2 P-0 + 1 (FU-A); SA-07h equal. | A21, A26 | L |
| F-7 | SA1: SA-07r of FU-A; SA2: SA-07a of A | SA1 opens SA-07r, chooses SA1, writes a reason. Setup: SA2 records A "Payment received" (`SYN-W16-[stamp]-PAY-A`). SA1 sends. | SA2's receipt closes one item (WP06-A75); SA1: the closed-meanwhile answer with the unsent reason; nothing recorded. | A41, A93 | L |
| F-8 | SA1: SA-07k and SA-07r (GET) of FU-A; SA-07f; SA-07a of A; SA-08s of FU-A | Read. | FU-A "Closed by payment entry #1 at [time] IST" on SA-07k only; SA-07r closed state; "Closed" lists FU-A and FU-B; "Open" P-0 + 1; SA-07a row "Closed" with its link; SA-08s three facts. | A17, A21, A30, A38, A45, A84, A86, A89 | L |
| F-9 | Y: TA-11 views and `?application=`, TA-07 of B; SA1: SA-07a of B | Read; open B; Back; follow the TA-07 link. | B's three entries on both pages; views and filter; Back and the link as A09. | A03, A09, A19, A80, A112 | L |
| F-10 | SA1: SA-07t, SA-07a of A and C, SA-07k of FU-B2, SA-07f; harness | Read the notices; post D106 to D109 with the run's and made-up ids. | Notices with reason, owner and route and no control; 409 SA-07b each time; deltas 0. | A47 to A51, A53, A55, A94 | L |
| F-11 | SA1: `/accounts` | Open. | 303 to `/admin/finance#decrease`; the notices in their homes, the dashboard limitation on SA-07h. | A54, A97 | L |
| F-12 | `syn-ta-2`: TA-11; OP1 and Y: SA-07f, SA-07k, SA-07r, SA-07c; harness | Read; post the owner change as OP1. | Delta 0; not-found; nothing recorded. | A10, A34 | L |
| F-13 | SA2 | Open the receipt address of F-4 again. | Historical receipt with "Current: Closed by payment entry #1". | A58 | L |
| KT | Test | SA-07c warning variants and the race; states and refusals; BFF parsing; largest valid form; the correction matrix; the three-entry chain; TA-07 cases; external uncertainty fixture. | As the items. | A99, A103, A105 to A108, A110, A111 | T |
| V09T | Test | Fee states on SA-07a and TA-11; modes without fees; the boundary posts as an operator and in a support view; host-page and inventory checks. | As the items. | A05, A14, A51, A52 | T |
| V19T | Test | An application completed by the harness with an open item: SA-07f, SA-07k, SA-07a, TA-11, TA-07; the owner change; a "Payment received" entry; the existing Core tests `test/core/completion-group-end.test.ts` (an open item survives completion; group end excludes outstanding money). | Item listed and open with "Processing completed"; the completion lines; owner change accepted; the entry closes the item; completion and counted exposure unchanged; Core tests pass. | A06, A18, A24, A32, A110 | T |
| X-1 | Test | The test parts of the items not named above: A08, A11, A22, A23, A25, A28, A33, A37 (2), (3), A38, A39, A42 (5), A43, A44, A46, A54, A57, A59, A61, A63, A64, A66, A75, A76, A112. | As the items. | as listed | T |
| X-2 | axe | Every page and state visited above. | No serious or critical violation at 1440 and 390 px. | A79 to A81, A83 to A86, A88 to A94, A96, A97, A113 to A118 | L |
| X-3 | axe (gallery) | A82, A87, A95, A119. | As X-2. | A82, A87, A95, A119 | L |
| X-4 | Keyboard-only, screen-reader and phone users; Y; SA1 | During F-0c, K-1 to K-4, T-1, F-3, F-4, F-9, V09F-3: the accessibility checks, the shell, copy and refusal text, the role and money-control checks, the observation questions. | As the items. | A07, A56, A60, A62, A65, A67 to A78 | L |

Proof split. V09 (WP-16 part) passes when P-0, the Setup steps, F-0b, V09F-1 to V09F-3 and F-10 pass on `lane-ui` at
the integrated WP-16 commit and V09T passes as named tests; with WP-07's V09 steps V09 is done. V19 (financial part)
passes when K-2, K-4, T-1, F-1, F-2, F-7, F-8 and F-9 pass on `lane-ui` (items open, are listed and owned, and close
only by a later "received" entry, also by a correction that opens its own item) and V19T passes as named tests. Parts
K, KT and X belong to both. Recorded, not failed: A15 "Unmet" (D-W16-08); A03 "Partly met" (STOP-W16-01). Boundaries
stated, not crossed: refund, write-off, reservation release, fee exclusion, Accounts actions (B28, B29, B43);
completion (LD-04). The run record names the `lane-ui` ref, the run tag, the travel agent, the group, each test, the
identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V09: ceiling increase by two SuperAdmins, lowering, authorization with a fee, the breach and the parked paid case at ₹0, SA-07t facts | WP-07 (§3 V09; WP07-A79 to A97, A166) |
| The record use of `pay.record_service_status` on SA-07a; Gate 1 and Gate 2 rows | WP-06 (WP06-A63 to A79, A149, A150) |
| A Gate 2 follow-up item opened live | WP-07 V09-13; here as a test (A28) |
| V19: disclosure follow-up after completion | WP-14 (WP14-A13, A38) |
| V19: group-end closure never consumes outstanding money | WP-17 (group pages, AM-W16-05); Core tests in V19T |
| SA-01 group mechanics; the SA-10 notice page and its link (AM-W16-04) | WP-06; WP-15 |
| The audit pages | WP-14 (SA-08s); used in A45 |
| Operator money summary in OP-02 | WP-07 (AD-09) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-16 page:

- A form, button (enabled or disabled) or link that targets a boundary route (D106 to D109); a "Release", "Exclude",
  "Write off", "Refund", "Mark collected", "Collect", "Settle", "Pay now", credit, assistance-charge or other-mode fee
  control (CC-08; B29, B42, B43).
- A form that records, edits or corrects a government fee, a TA liability, a TM-paid amount, a receipt, an allocation
  or a recovery (D-W16-08).
- A notice for an action that does not exist (assistance charges, a fee formula, other-mode fees) (design §2.0).
- An amount "due", a total, a sum or difference of rows, an unqualified recovery amount or an all-clear (Q-W16-01;
  M-01; D7).
- On TA pages: a reserved or unknown government-fee row (M-02); a ceiling, exposure, reservation, follow-up item,
  gate, exception, staff name, evidence or reason; an Accounts dashboard or grant (B10, B29).
- A sentence that the payment starts, holds or stops work; a money fact drawn from a gate (F-05; F-W16-06).
- A closing entry or time on SA-07a or SA-07f (M-03); an age, "overdue" or an SLA.
- A correction form outside SA-07c; an owner-change form outside SA-07r (CC-19).
- A result from the page address; an accepted time; a named receipt that the operation does not establish.
- A blanket "TravelMudra-funded commitments are blocked" notice (B43).
- A truncated field or dropped row (LD-17); earlier facts after an access change (LD-14).
- The old `/accounts` page; a rail, context or link entry for Accounts (AD-12).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- UI-PLAN "Record government fee fact": "Unmet: no Core command" (A15; D-W16-08; Max's end review).
- Evidence inspection and the corrected-entry number on TA-11: "Partly met" (A03; STOP-W16-01 parked; M-11).

Deferred in WP-16 (the run record lists each as "Deferred"):

- Completed and ended-with-group applications: tests and gallery (A06, A18, A24, A32, A110).
- An inactive owner, nobody to choose, the caps of 100 and 200, fee states other than reserved and paid, the Gate 2
  kind, the race of a correction with an assignment: tests and gallery (approved writes do not suspend accounts).

Not in WP-16: the record form on SA-07a (WP-06); the ceiling pages and Gate 2 (WP-07); group end (WP-17); SA-10, OP-10
and the elevation pages (WP-15); incidents and audit pages (WP-14).

## 6. Questions for the architect (ranked)

Kept as asked, with each answered row reduced to its answer; Q-15 and Q-16 are new. `WP-16.md` §3 and §4.1 answer:
Q-01 → PM Q-01 (no Core command; D-W16-08; Max's end review; A15); Q-02 → PM Q-02 and M-01 ("as recorded" labels and
the notice; A04, A13, A16); Q-03 → M-02 (no reserved or unknown row on TA pages; A05, A111); Q-04 → Q-W16-01 (A06,
A109); Q-05 → Q-W16-04 (303; OP-10 keeps its grant notice; A54); Q-06 → STOP-W16-01, -02 parked, criterion point 2
unproven (M-11); Q-07 → Q-W16-03 (SA-07r); Q-08 → parked P2 (no item); Q-09 → design §6.1 (completion in tests);
Q-10 → Q-W16-09 (A29); Q-11 → Q-W16-06 and M-08 (§0.2 "Data hygiene"); Q-12 → the review ran (LD-13); Q-13 → no
reminder schedule (design §2.6; A31); Q-14 → PM Q-14 (fixed in the build; A44, A107).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | "Record government fee fact" has no Core command. | Answered: D-W16-08. | — |
| Q-02 | P1 | Recovery amounts cannot change while receipt recording is parked. | Answered: M-01. | — |
| Q-03 | P1 | Reserved and unknown fee states on TA pages. | Answered: M-02. | — |
| Q-04 | P1 | Computed due amounts and all-clears on TA pages. | Answered: Q-W16-01. | — |
| Q-05 | P2 | `/accounts` retirement and OP-10. | Answered: Q-W16-04. | — |
| Q-06 | P2 | TA read gaps (group, corrected entry, evidence, event time). | Answered: parked; criterion unproven. | — |
| Q-07 | P2 | Owner-change host page. | Answered: SA-07r. | — |
| Q-08 | P2 | The eligible-owner read takes at most 50 SuperAdmins before removing the current owner. | With 60 SuperAdmins ten names are missing with no message. Likelihood: very low. Harm: low. | Parked P2 note; no item. |
| Q-09 | P2 | Completion only in tests. | Answered: design §6.1. | — |
| Q-10 | P2 | Closing an item whose current entry already records received. | Answered: Q-W16-09. | — |
| Q-11 | P2 | Proof writes. | Answered: Q-W16-06 with M-08. | — |
| Q-12 | P2 | LD-13 review route. | Answered: reviewed. | — |
| Q-13 | P2 | No repeat nudge. | Answered: no schedule. | — |
| Q-14 | P2 | Body limits in bytes against character limits. | Answered: fixed in the build. | — |
| Q-15 | P2 | Design §2.5 shows "Closed [time] IST" on SA-07f rows and the Yours-view cap line with `openCount`. `pay.follow_up_list` returns no closing time, and the Yours total is `mineCount`. | A SuperAdmin reads a closing time the list could only guess, or "40 items in total" on the Yours view when 3 are theirs. Likelihood: certain for every closed row and every capped Yours view. Harm: low (M-03 class). | SA-07f closed rows read "Closed" with the time on SA-07k; the Yours cap line uses `mineCount` (A21, A22). |
| Q-16 | P2 | The design gives no words for `paid_exceeds_reservation`, which the fee read returns. | TravelMudra paid more than reserved; the staff fee row shows no sign of it, though the difference grows counted exposure. Likelihood: low. Harm: low. | Add the staff words "Paid more than reserved: the difference is counted too." to the closed table at the build, or record the omission; A14 accepts either. |

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
| WP16-A98 | | | |
| WP16-A99 | | | |
| WP16-A100 | | | |
| WP16-A101 | | | |
| WP16-A102 | | | |
| WP16-A103 | | | |
| WP16-A104 | | | |
| WP16-A105 | | | |
| WP16-A106 | | | |
| WP16-A107 | | | |
| WP16-A108 | | | |
| WP16-A109 | | | |
| WP16-A110 | | | |
| WP16-A111 | | | |
| WP16-A112 | | | |
| WP16-A113 | | | |
| WP16-A114 | | | |
| WP16-A115 | | | |
| WP16-A116 | | | |
| WP16-A117 | | | |
| WP16-A118 | | | |
| WP16-A119 | | | |
| V09 proof (WP-16 part) | | | |
| V19 proof (financial follow-up part) | | | |
