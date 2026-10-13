# WP-17 acceptance checklist: Group end, withdrawal, deferral, timing

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-17 Group end, withdrawal, deferral, timing (UI-PLAN §12.2: TA-05, TA-07, OP-02, SA-02, SA-04, with the SA-09 kinds of CC-04 and WP-06 §2.7.5; done when V19 passes; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Page ids, paths and hosts follow the page list of the UX design draft written in parallel (`WP-17-design.md` §1.3 and §1.5, read on 13 October 2026 at 06:46 IST); the content of this checklist is not yet aligned to that design. Where the design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | Lane branch `ui-revamp-2026-10-12` at b2a6341. The Core modules of the 13 commands, their contracts, bindings, BFF handlers and the pages that carry their forms are the same in the working tree (the uncommitted files are a queue component, its gallery and test, and a staff admin-context helper; none of them touches a WP-17 handler or page). Internal records at 3283bd2 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (TA-04, TA-05, TA-06, TA-07 and the TA task pages under test; set-up through the travel-agent pages); staff http://127.0.0.1:4652 (OP-02 and its task pages, SA-02d, SA-04a, SA-04g, the SA-09 kinds under test; set-up through SA-06, SA-07a, SA-03a) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to the WP-17 design, to the architect's decisions (`WP-17.md`
§3) and to the independent review (LD-13 applies: WP-17 commands change money facts (price) and filing state
(withdrawal stops new filing)) will be recorded here as a table of changed rows, as in `WP-14-acceptance.md` and
`WP-16-acceptance.md`.

## Lessons applied from the WP-01 to WP-16 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per host (A04, A15, A25, A42, A49, A53, A58, A78, A86); the matrix A110 |
| A replay step MUST NOT change the state that later steps observe | WP-16 M-07 | §3 G-2, W-1, F-1, D-6 (each replay sends the accepted content again) |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2 "Refused sends"; every refusal item checks by delta |
| A BFF refusal sends no command; it is tested apart from a direct Core contract test | WP-16 M-06 | A20, A43, A48, A60, A72, A76, A88, A111 |
| A receipt names the command only when the operation's resource, returned id and summary (or a record selected by a returned id) establish it; otherwise "Request recorded"; no accepted time; no result from the address | WP-01 A-04, P-02; WP-03 C-03 and code review R-03; WP-06 D-02; WP-13 L-05; WP-14 K-07 | §0.2 "Receipts" (the per-command table); A03, A49, A78, A97, A105 |
| An accepted command whose recorded result is not the requested effect never shows as a success | WP-15 (class of WP-01 A-04, A-07) | A16, A58, A59, A86 (a refused withdrawal assessment); A63 (a recheck whose rules could not answer) |
| Recorded facts in a receipt come only from stored summary fields and records selected by its ids; later facts are "Current"; another person's receipt opens unchecked | WP-12 J-08, J-09 | §0.2 "Receipts"; A24, A105 |
| No page, status read or receipt instructs anyone to perform an act | WP-07 F-01, F-33 (P0 class fix) | A15, A58, A106 |
| Money facts stay separate; no page adds them unless Core returns the sum; no page computes an amount "due"; unknown is never zero | WP-07 §0.2 "Money"; WP-16 Q-W16-01 | §0.2 "Money"; A22 to A24, A28, A75 |
| A value that a read returns is not shown where its presentation misleads its audience; the truthful fact stays where it is explained | WP-16 M-01, M-02 | A12, A37, A38 (progress words of ended and withdrawn applications) |
| A page shows only facts that a named read returns; each additional read is named; a fact no read returns is qualified or the item is "Partly met" | WP-02 B-06; WP-14 K-14; WP-16 M-03 | §0.1 "Facts no read returns"; §0.2 "Facts"; A23, A32, A33, A44, A60, A78, A86, A91 |
| A page MUST NOT block a command that Core accepts and MUST NOT offer a choice that Core always refuses | WP-07 D-W07-16; WP-10 H-02, H-03 | A13 (§6 Q-13), A28, A71, A80 (the price cause Core always refuses) |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A76, A77 |
| On GET assert the blocker and the absence of the form; a refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A18, A51, A52, A54, A79, A81 |
| No semantic duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A16 (a second withdrawal request after a refused one), A44 (a second forecast), A110 (6) |
| The refusal summary and the submitted values render independently of current eligibility; an unsent block keeps values when the form no longer applies | WP-02 code review R-01, R-03 | A26, A29, A69 |
| A stale comparison shows the unsent value and the current value; it never invents what the person saw before | WP-16 M-09 | A26, A69 |
| Revisions are asserted as advanced on a fresh read, never by a fixed increment | WP-16 M-12 | A03, A68 |
| No BFF handler truncates, slices or drops a field; the largest valid form reaches Core over real HTTP | LD-17; WP-14 K-10; WP-16 PM Q-14 | §0.1 "BFF today"; A20, A72, A111, A112 |
| Optional reads never hide an access change | LD-14 | A33, A113 |
| An outage of the evidence that a consequential form needs removes the form with a notice; optional information degrades | WP-07 F-04; WP-10 H-05; WP-14 K-02 | A10, A93, A113 |
| A list at its read's cap says so; no total, "none" or all-clear beyond the returned slice | WP-08 E-10; WP-14 K-05 | A10, A93 |
| A state is labelled for the fact it establishes | WP-06 D-05; WP-14 K-11 | §0.2 "Words"; A06, A12, A37, A91 |
| A boundary names its owner and route; an action that does not exist gets no notice; a parked policy names the product owner and no date | LD-04; WP-08 Q-W08-03; WP-16 design §2.0 | A21, A28, A75, A80, A83 |
| Audit facts show only as fields recorded on that subject, with time and source | WP-11 I-10; WP-14 K-14 | A70, A107 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" or "Partly met" with its owner | WP-10 H-01; WP-14 K-01; WP-16 A15 | §0.2 "Pass rule"; A36, A80 |
| Proofs follow one ordered recipe with a run tag, a fresh synthetic travel agent and deltas; set-up writes are labelled | WP-02 B-13; WP-14 K-13; WP-16 M-08 | §0.4; §3 |
| Real refusal shapes from the code | WP-06 D-11; WP-10 H-07 | §0.5 |
| One host page per command use; every rendered form action is a registered route; carried test entries leave | CC-12 to CC-20 | A102, A103 |
| A support view shows no target-user action; admin pages answer the support-view page | WP-03 code review R-05; WP14-A89 | A114 |
| Conditions that `lane-ui` cannot show are proven by named tests | WP-01 P-W01 | §3 steps T-*, §5 "Deferred" |
| Copy states no configuration value that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A09, A90, A108 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-16 M-11 | §6 Q-06 to Q-09 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Group; Incident/follow-up), §2.2 (lifecycle, outcome, next action, deferral line), §2.3, §3.1 (estimate and forecast), §3.2 (Group end; Completed case with continuing duty; Unknown external execution), §3.3, §4.1 to §4.4 (Groups; travel-date edit; corrections and pricing; timing alert), §5.3 (manual filing: "removes … ordinary withdrawal options"), §6.1 to §6.3 (Exception; Manual money record), §7.4, §7.5, §8.3, §12 V19 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B14 to B17 (group context, attempts, submission and price, timing notice), B21 (deferral), B23 (no ordinary withdrawal while filing may have occurred), B24 (withdrawal), B25 (group end), B26, B29, B33, B35; B18 (price, withdrawal wait for a formal return), B44 (no generic cancellation) |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-06, AD-13), §3.2 TA-05, TA-07, §3.3 OP-02, §3.4 SA-02, SA-04, SA-09, §4.2 (Group end; Completed case with continuing duty), §5.2 TA-04/TA-05, TA-07, §5.3 OP-02, §5.4 SA-02, SA-04, SA-09, §6 (Group detail, Application case), §7 (K-STD rows), §8 (CMP-01, -03, -07, -08, -09, -10, -12, -13, -14, -16, -24, -25), §10, §11, §12.2 WP-17 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (criterion point 2) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 0cab0de1f44eca96… | §3 rows of the 13 WP-17 commands; §5.1; §5.3; §5.4; §6 CC-02, CC-04, CC-06, CC-15; §6.1 |
| LP | `PLAN.md` (this folder) | SHA-256 8cb2774a01597f50… | §3, §4 (LD-02 to LD-04, LD-07, LD-08, LD-11 to LD-14, LD-17), §7, §9 |
| PR | `PROPOSALS.md` | SHA-256 0547640ae48459e7… | P-02, P-09, P-17 item 3 |
| W3 | `WP-03.md`; `WP-03-acceptance.md` | SHA-256 c6f00aaa4e7c5562…; 13ad0770af3f6c42… | Q-W03-08, Q-W03-09; §6 (U1 close test, U4 "Being checked"); WP03-A18 to A22 (TA-13b), A23, A30 to A32 (TA-05), A95, A102, A105 (TA-07 timing), A106 (carried forms) |
| W6 | `WP-06.md`; `WP-06-design.md` | SHA-256 f116d1e60cbed1af… | D-02, D-05, D-09, D-12; design §2.2.4 (SA-02d), §2.1 group 6, §2.7.5 (SA-09 kinds `deferral`, `price_increase`, `operational_withdrawal`); WP06-A20, A110 |
| W7 | `WP-07.md`; `WP-07-design.md` | SHA-256 eb7ecefe91d4e083… | F-01, F-05, F-07, F-09, F-33; design §1.5 (carried WP-17 sections of OP-02), §2.4.6 (D-W07-15); WP07-A37, A66, A165 |
| W9 | `WP-09.md` | SHA-256 97074922067b5db7… | Q-W09-10 (`purpose=withdraw` on TA-07p); WP09-A08 |
| W11 | `WP-11.md`; `WP-11-design.md` | SHA-256 ac694c837c9c2ac2… | CC-15; I-06; STOP-W11-03; design §1.5 (carried WP-17 forms on SA-04a), §2.1 action panel rows 6 and 8; WP11-A50 |
| W13 | `WP-13.md` | SHA-256 412ff9e096446a8d… | Offering withdrawal versus application withdrawal (words); L-04 |
| W16 | `WP-16.md`; `WP-16-acceptance.md` | SHA-256 523e76257e9bce70…; 659081969aceefd9… | AM-W16-05; STOP-W16-06; M-01 to M-12; Q-W16-08; WP16-A07, A110; §3 V19 split |
| W8–W15 | `WP-08.md` to `WP-15.md` §3 and §4 | internal 3283bd2 | Neutral receipts; one host page per command; LD-14; LD-17; J-08, J-09; K-05, K-11, K-14; TA-10 notices and acknowledgement (WP-08 Q-W08-02); SA-08s (WP-14) |
| W14A, W16A | `WP-14-acceptance.md`; `WP-16-acceptance.md` | SHA-256 341d2c25c392b88d…; 659081969aceefd9… | Format, corrections tables, lessons, §0.5 |
| Code | lane repository | b2a6341 | `src/modules/core/commands/{groups,withdrawal,submission,drafts,common}.ts`; `src/modules/core/{tasks,travel-recheck,derived,controls,staff-views,model,store}.ts`; `src/modules/payments/writers.ts` (`outstandingMoney`); `src/modules/identity/policy.ts` (rows 148 to 219); `src/contracts/core.ts` (commands, `zWireTaCase`, `zWireStaffCase`, `core.ta_group`, `core.admin_group`, `core.admin_queue`, `core.ops_work`); `src/contracts/delivery.ts` (`dlv.notices`); `src/core-api/bindings/core.ts` (lines 437 to 520); `src/apps/edge/core/{group-routes,routes}.ts`; `src/apps/staff/core/{ops,admin}.ts`; `src/apps/shared/core/ta.ts`; `src/apps/shared/pages/groups.ts`; `src/web/route-inventory.ts` (T07, T08, T34, T35, T48, T61, O23, O24, O42, O43, O60, D07, D22, D24, D30, D101, D128); `src/platform/config.ts` (`core.dateCheckEveryMs`, `sweepPageSize`); tests `test/core/{completion-group-end,groups-drafts,withdrawal-dependencies,submission-price,acts}.test.ts`, `test/system/core-pages.test.ts` |

Verified facts of the code at b2a6341 that the items rely on (read by the author):

- **`core.close_group`** (travel agent of the group; policy `group.close`). Input `groupId`; the group revision comes
  from the envelope (`_rev.group`). Order: revision (`stale_revision`); state open (`group_closed`); then the open
  conditions: applications in `draft` or `submitted`, open intake incidents, active import attempts. A refusal is
  `control_blocked` with the first code and a `blockers` list that names every code that applies. Accepted: state
  `closed`, `closed_kind = ordinary`, fact `core.group_closed`; summary `{groupId}` (the same shape as
  `core.create_group`). A withdrawn application keeps its lifecycle (`draft` or `submitted`) and so holds ordinary
  closure until it ends with the group (B25). Completion runs only in tests (LD-04). An accepted live closure needs a
  group with no application, or one whose applications all ended.
- **`core.edit_travel_dates`** (WP-03, TA-13b). Core checks "return on or after start" and "unchanged". It does not
  compare the dates with today (`core.create_group` refuses a start before today). TA-13b sets no minimum date. Effect:
  the material revision of every open application advances (its readiness goes stale); the fact records
  `openApplications`; the task `core.travel_date_recheck` rechecks each open application. Summary `{groupId,
  datesRevision}`. No read previews the affected applications.
- **`core.recheck_travel_dates`** (assigned operator or SuperAdmin, routes O60 and D128). Refusals
  `application_not_open`, `travel_date_recheck_not_pending` (the current dates are checked). Accepted summary
  `{applicationId, result, retryAt}`: `rechecked`, `travel_rule_unknown` (stays pending; a failed country check reruns by
  itself at most 5 times), `historical_or_held`. The staff case read carries `travelRecheck {answer: not_run |
  travel_rule_unknown, codes, retryAt}` while a recheck is pending. Pending answer `travel_date_recheck_pending` /
  `run_travel_recheck`, owner the assigned operator, else a SuperAdmin.
- **Group end** (`tasks.ts` `core.group_end_sweep`, `derived.ts` `groupEndEligibility`). A periodic job (interval
  `core.dateCheckEveryMs`, default 60 minutes) enqueues one sweep a day per open group whose return date is strictly
  before today (Asia/Kolkata); nothing runs while the clock check fails. Reasons that hold an application open:
  `application_not_open`, `group_end_pending`, `service_payment_received`, `operator_work_authorized` (set at
  assignment), `filing_possibly_occurred` (any act), `original_held`, `custody_evidence_missing`, `delivery_pending`,
  `money_outstanding`, `protection_mark_active`. An eligible application gets lifecycle `ended_with_group` (completion
  kind `ended_with_group`, actor the task); an open price increase is superseded. The group closes (`closed_kind =
  group_end`) when nothing is open and intake holds nothing. No command reverses either. `core.admin_group`
  (SuperAdmin, `/admin/groups/:groupId`): group, `today`, `clockHealthy`, items (at most 500) with `eligible` and
  `reasons`. The wire item has no lifecycle (the internal view has one), so a completed and an ended application both
  read `application_not_open`. The codes behind `money_outstanding` are not on the read (STOP-W16-06).
- **Withdrawal** (`commands/withdrawal.ts`): three commands, one assessment. Eligibility refusals record nothing:
  the travel agent's path first `awaiting_formal_return` (assigned) and `hold_assistance_in_progress`; then, for all
  three, `application_not_open`, `outcome_already_recorded`, `protection_mark_active`. The applicant and operational
  paths need business evidence (through the wire: one external reference; a blank reference sends none and fails the
  input check). The operational path needs a reason of 10 to 1,000 characters. Then Core records the request either
  way, with an assessment: `refused` with `filing_possibly_occurred` (an act possibly filed), `withdrawal_cutoff_passed`
  or `declared_cutoff_passed` (filing evidenced), `withdrawal_cutoff_undeclared` (preparation-only, or the offering's
  cut-off is undeclared or unsupported in this release); otherwise `accepted` (a draft is always accepted). Accepted:
  outcome `withdrawn`, an open price increase superseded, a notice `generic_case_update` to the assigned operator. Both
  results: a `withdrawal_decision` notice to the travel agent. The lifecycle does not change. Summary `{applicationId,
  withdrawalId, result, code?}`. The TA case read carries `withdrawal {state, reason_code}` and `withdrawalPreview
  {result, code}` (Core's assessment at read time). The staff case read carries neither.
- **Deferral.** Propose (assigned operator): justification 20 to 2,000 characters, review date after today, lifecycle
  `submitted`, no outcome, no act `authorized` or `filing_unknown`, no open (proposed or approved) deferral
  (`conflict_duplicate` / `deferral_active`). Decide (SuperAdmin): `approve`, `decline` or `extend`; reason 10 to
  1,000; review date optional (default: the proposed date); no expected revision: an approve or decline of a deferral
  that is not `proposed`, or an extend of one that is not `approved`, is `stale_revision`; a review date not after
  today is `date_invalid` at `reviewOn`. Approve and extend: the application revision advances, a `deferral` notice
  with the review date goes to the travel agent, a review task waits for 00:00 IST of the review date. Decline: no
  notice. Core does not check that the application is still open. End (assigned operator, route O43; the SuperAdmin
  policy row has no route): note 1 to 1,000; only an `approved` deferral (else `stale_revision`); a
  `generic_case_update` notice `deferral_ended` to the travel agent. Review due: notices to the assigned operator and
  the approver; `core.ops_work.reviewsDue`; SA-01 `deferralReviewsDue`. An approved deferral blocks readiness, the
  authorization of every external act and the packet release, and nothing else. A proposed one blocks nothing. All
  three return `{applicationId, deferralId}`. The staff case read carries `deferral {deferral_id, state, justification,
  proposed_review_on, review_on}` (no proposer, approver, decision reason or due flag). The TA case read carries no
  deferral; the travel agent's `deferral` notice carries the review date. `core.admin_queue {deferrals}` returns
  application rows only.
- **Price.** Propose (SuperAdmin): cause `mistaken_price` or `material_scope_change`; new price in paise; reason 10 to
  1,000; lifecycle `submitted`; no outcome. `material_scope_change` needs an applied correction id: the wire contract and
  the binding carry no `correctionId` (and no evidence), so Core refuses that cause every time. One open increase at a
  time (`price_increase_open`); the new price must be higher (`not_higher`). Core does not check the service payment.
  Effect: a price record `open`, a `price_change` notice that needs acknowledgement, the application revision advances.
  Summary `{applicationId}` only. Decide (travel agent): `accept` or `decline`; the record is looked up first, then the
  revision, the outcome, the lifecycle, an accepted withdrawal, the editor state (`awaiting_formal_return` while assigned
  or while assistance is in progress), then the record must be an open increase. Accept takes the proposed amount;
  decline keeps the price in effect (B17). Summary `{applicationId, priceRecordId}` (`core.submit` returns
  `priceRecordId` together with `submissionId`). Pending answer: unassigned → travel agent `price_decision_pending` /
  `decide_price_increase`; assigned → operator `price_decision_awaits_return` / `return_to_ta`. TA case read: `prices`
  (kind, cause, state, amount, effective and previous price; no reason), `currentPricePaise`, `submission.
  quoted_price_paise`, `servicePayment`. Staff case read: `price {effectivePricePaise, openIncrease}` (the record id
  only).
- **Forecast** (assigned operator, route O42; the SuperAdmin policy row has no route). Window start on or after the
  submission date, end on or after start (`forecast_window_invalid` at `windowStart`); basis `operator_judgement`,
  `authority_notice` or `external_delay`; note up to 500; lifecycle `submitted`; no outcome; no expected revision (a later
  forecast becomes current; earlier ones stay as history). A timing check posts a `timing_risk` notice to the travel
  agent once per window and dates revision: `threatened` when the expected end is on or after the travel start,
  `elapsed` after the expected end. Summary `{applicationId, forecastId}`. TA and staff case reads: `timing
  {estimate, forecast}` (dates only: no basis, note or time).
- **Held correction** (`core.apply_held_correction`, travel agent route T48 only; no staff route, STOP-W11-03, P-17
  item 3). Core: the correction belongs to the application; revision; state `released_for_reapply`; the role matches
  the correction's kind; the `correct_application` controls; the editor state; the changed values are still the ones the
  correction was made against (`held_correction_conflict`); same-person evidence for identity fields; the stage is not
  held again (`filing_possibly_occurred`). Summary `{applicationId, correctionId}`. TA case read: `released
  [{correction_id, fields}]`. A released correction exists only after an act was authorized, a correction was held and
  evidence of non-filing was recorded: `lane-ui` cannot show it inside the approved writes.
- **Progress** (`model.ts` `deriveProgress`): Core derives "completed" for `ended_with_group` as for `completed`, and
  "delivery_closure_pending" for an open application with any outcome (for example a withdrawn application waiting for
  its group end).
- **BFF today** (replaced by WP-17): TA-07 carries withdrawal, price decision and re-application as disclosures with
  flashes; TA-05 carries "Close the group" (answer `?done=closed`); OP-02 carries forecast, deferral, end, recheck
  and the applicant withdrawal (WP-07 §1.5, relabelled under possible filing by D-W07-15); SA-04a carries the price
  increase, the operational withdrawal, the deferral decision and the recheck (WP-11 CC-15). Handlers slice fields:
  forecast `basisCode` (40); deferral decision `decision` (20) and `reviewOn` (10); price increase `cause` (40) and
  `newPricePaise` (24) (LD-17). Body limits: 4,096 bytes (deferral decision, price increase, operational withdrawal,
  recheck, close, re-application), 8,192 (forecast, deferral proposal, deferral end, applicant withdrawal), 16,384
  (travel agent's withdrawal, price decision). One Devanagari character takes 9 bytes after form encoding, so the
  largest valid reason (1,000 characters), justification or note (2,000) does not fit seven of these forms.
- **Facts no read returns** (each item that needs one is "Partly met" with §6): the review date of a deferral on the
  TA case read (only on the travel agent's notice); the SuperAdmin's reason for a price increase on the TA read; the
  proposed amount on the staff read; the basis, note and time of a forecast on any case read; a withdrawal record or
  preview on the staff read; the lifecycle of an application on the SuperAdmin group-end read.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp17-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06). `syn-ta-2` for isolation only. SuperAdmins: `superadmin-1` (SA1: set-up, the price increase, the
  operational withdrawal, the losing tab of the deferral decision), `superadmin-2` (SA2: approves and extends the
  deferral). Operators: `operator-1` (OP1: the assigned operator of C), `operator-2` (OP2: isolation; never assigned).
  They stand for `syn-superadmin-1`, `-2` and `syn-operator-1`, `-2`. Keyboard-only user. Screen-reader user. Phone
  user (390 px wide). No step suspends a seeded account or changes a seeded offering.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (the design's §7 names the files). `L+T`: both are
  required. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09); the design's word tables govern. Draft copy passes when the page states
  the same facts. Staff boundary notices: "[Action] is unavailable until [policy or evidence]. Owner: [owner].
  [Route]." TA notices: "Owner: TravelMudra." (Q-W16-08). An action that does not exist gets no notice. An unknown value
  shows "Unrecognised: [code]"; an unknown refusal code shows the category text and "Reference code: [code]". No page
  shows a package id or a lane record id.
- **Words (draft).**
  - Lifecycle: "Draft", "Submitted", "Processing completed", "Ended with its group" (meaning line: "It ended with its
    group after the travel return date. TravelMudra did not process it further. This is not a visa result."). Outcome:
    the glossary words (PL §11.2); "Withdrawn" is an outcome, never a lifecycle.
  - Group state: "Open"; "Closed" (`ordinary`); "Closed after the travel return date" (`group_end`) (WP03-A23).
  - Withdrawal: accepted "Withdrawn: no further filing happens"; refused "Withdrawal request recorded and refused:
    [reason]". Reasons: `filing_possibly_occurred` "a filing may have happened"; `withdrawal_cutoff_passed` "the
    government submission is already evidenced"; `declared_cutoff_passed` "the service's declared cut-off has passed";
    `withdrawal_cutoff_undeclared` "this service has no withdrawal cut-off that TravelMudra can apply in this release".
    Requesters (staff): "Travel agent's request", "Applicant's request, recorded by the operator", "Operational
    request, recorded by a SuperAdmin". Never "Cancelled", "Deleted", "Closed", "Completed" or "Refunded" for a
    withdrawn application; never "withdrawn" for a service that is no longer offered (WP-13 words).
  - Deferral (staff): "Proposed: waiting for a SuperAdmin decision"; "Approved: review on [date]"; "Declined"; "Ended".
    Travel agent: "Paused by TravelMudra until a review on [date]" (from the notice only). Never "On hold" without the
    review point, never an SLA.
  - Price: causes "Correction of a mistaken price" (`mistaken_price`), "Change of service scope"
    (`material_scope_change`); record states "Waiting for your decision" (TA) / "Waiting for the travel agent's
    decision" (staff), "Accepted", "Declined: the communicated price stays", "No longer open" (`superseded`).
  - Timing: "Original estimate", "Current forecast (separate from the estimate)"; basis (staff) "Operator's
    judgement", "Notice from the authority", "External delay".
- **Money.** Every amount is a Core field rendered by `money()`. "Quote: ₹[n], fixed at submission" and "Price in
  effect: ₹[n]" are separate rows. No page shows an amount "due", a difference of prices, a total or an all-clear. The
  SuperAdmin enters a new price in rupees; the BFF converts it exactly to paise and refuses a value it cannot convert, at
  the field; it never rounds.
- **Dates and times.** Every time carries "IST". Business dates (travel, review, forecast) show as dates in India time.
  Event time and recorded time both show where a read returns both.
- **Freshness (LD-08).** Every WP-17 read is authoritative: "Read at [time] IST". SA-01 and the monitor counts keep the
  lag form.
- **Facts (K-14).** A page shows only facts that its reads return. A count that cannot be read is "Unavailable", never
  "0". A list at its cap says so. Additional reads (named per item): `dlv.notices` (optional, TA-07 deferral and timing
  notices); `views.audit_subject` (SA-08s links for `deferral`, `withdrawal`, `group`, `forecast`).
- **Receipts.** No accepted time, no command name (P-02, S-08), no result from the address (`?done=` flashes go).
  Another person's receipt address opens unchecked with current authorized facts (J-09). The receipt of each command
  follows this table:

| Command | Summary | Receipt |
|---|---|---|
| `core.close_group` | `{groupId}` (as `core.create_group`) | Neutral "Request recorded"; Current: the group state |
| `core.recheck_travel_dates` | `{applicationId, result, retryAt}` | "Travel-date recheck recorded" with the result words; `travel_rule_unknown` reads "The rules could not answer: the recheck is still pending", never a pass |
| `core.request_withdrawal`, `core.record_applicant_withdrawal`, `core.record_operational_withdrawal` | `{applicationId, withdrawalId, result, code?}` (one of them per surface) | Accepted: "Withdrawal recorded" with "Withdrawn: no further filing happens"; refused: "Withdrawal request recorded" with "Refused: [reason]" |
| `core.propose_deferral`, `core.end_deferral` | `{applicationId, deferralId}` (the same shape on the operator surface) | Neutral "Request recorded"; Current: the deferral state |
| `core.decide_deferral` | `{applicationId, deferralId}` (the only admin command with `deferralId`) | "Deferral decision recorded"; the decision is not in the summary: Current: the deferral state and review date |
| `core.propose_price_increase` | `{applicationId}` | Neutral "Request recorded"; Current: price in effect, "A price change is waiting for the travel agent's decision" |
| `core.decide_price_increase` | `{applicationId, priceRecordId}` | "Price decision recorded" only when the summary has no `submissionId` and the record selected by `priceRecordId` is a decided increase; recorded: "Accepted: ₹[n] is the price in effect" or "Declined: ₹[n] stays" (a decided record does not change later) |
| `core.record_forecast` | `{applicationId, forecastId}` | "Forecast recorded"; Current: the current forecast dates |
| `core.apply_held_correction` | `{applicationId, correctionId}` (the correction commands add `stage`) | "Held correction applied" only when the summary has no `stage` and the TA read no longer lists the correction as released; otherwise "Request recorded" |

- **Replay terms** (as WP-16 §0.2): 1 identical replay; 2 changed-content conflict ("This form was already used with
  different content. Your values are kept: check them and send again."); 3 browser Back (a fresh form with current
  facts; sends nothing); 4 rejected-form refresh (the refused form gets a new key; the corrected send is recorded once);
  5 lost acknowledgement (C4 "Checking the original result", "Check status"; no new send of the same intent). Two more
  belong to the matrix (A110): a business duplicate and a raw stale envelope. A replay step on `lane-ui` MUST NOT
  change what later steps observe.
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request
  [reference] so far". Refusal items check by delta: groups (state, revision), applications (outcome, lifecycle,
  revision), withdrawal records, deferrals, price records, forecasts, notices, operations.
- **Paths (LD-03).** Kept: TA-05 `/ta/groups/:groupId` (section "Closing the group" with the link to TA-05c); TA-13b
  `/ta/groups/:groupId/travel-dates` (WP-03); TA-07 `/ta/applications/:applicationId` (sections `#withdraw`, `#price`,
  `#pending-work`, `#next-action`); OP-02 `/ops/applications/:applicationId`; SA-04a
  `/admin/applications/:applicationId`; SA-02d `/admin/queues/deferrals`; SA-04g `/admin/groups/:groupId` (D30,
  rebuilt). New GET task pages beside the kept POSTs (design §1.3): TA-05c `/ta/groups/:groupId/close` (T08); TA-07w
  `…/withdraw` (T34); TA-07d
  `…/price-decision` (T35); TA-07c `…/corrections/:correctionId/reapply` (T48); OP-02f `/ops/applications/:id/forecast`
  (O42); OP-02d `…/deferral` (O24); OP-02e `…/deferrals/:deferralId/end` (O43); OP-02w `…/applicant-withdrawal` (O23);
  SA-09d `/admin/applications/:id/decide/deferral_approve`, `…/deferral_decline`, `…/deferral_extend` (POST D24; one
  decision per kind page, design §1.3); SA-09p
  `…/decide/price_increase` (D101); SA-09w `…/decide/operational_withdrawal` (D22). The recheck (O60, D128) has no
  input: its host is an in-place form in the "Travel-date recheck" section of OP-02 Work and of SA-04a Overview (design
  §1.5 rows 10, 11). Set-up and observation pages: SA-06 (WP-02); TA-04,
  TA-06, TA-08, TA-09, TA-13a (WP-03); SA-07a, SA-03a, SA-01 (WP-06); OP-01, OP-04 (WP-07); TA-07p (WP-09); TA-10,
  TA-01 notices (WP-03, WP-08); TA-11 (WP-16); SA-08s (WP-14).
- **Pass rule.** WP-17 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the deferred items of §5.
  Recorded, not failed: A80 "Unmet: no request can name the applied correction (surface defect, §6 Q-03)"; A36
  "Unmet: waits for STOP-W11-03 and P-17 item 3" (as WP11-A50); "Partly met" where §0.1 "Facts no read returns" names
  the missing fact (A23, A32, A33, A44, A60, A78, A86, A91). A failed item becomes a finding ranked P0, P1 or P2 with its
  scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01 to WP-03, WP-06, WP-07, WP-09 and WP-11 are integrated (SA-06 creates
  accounts; TA pages create groups and submit; SA-07a records payments; SA-03a assigns; OP-02 starts work; TA-07p
  exists; SA-04a is rebuilt); WP-08 (TA-10) and WP-14 (SA-08s) for observation. Where a package is not integrated, the
  step runs on the existing page and the run record says so.
- **Data hygiene (to be approved, §6 Q-14).** Approved writes per run: Y (created and activated); groups G1, G2, G3;
  drafts A and E; submissions B, C, D, F, H; "Payment received" for C and H; the assignment of C to OP1 and its start
  of work; one price increase on B and its acceptance; one forecast on C; one deferral on C (proposal, approval,
  extension, end); withdrawal requests for A (Y), F (Y), C (OP1) and D (SA1); the change of G2's dates into the past;
  the closure of G3. Refused sends record nothing. The run MUST NOT touch another run's or a seeded group,
  application, offering, ceiling or account. G1 (C) and G2 (H) stay open at the end; later runs exclude them by the run
  tag. Notes, references and reasons carry the run tag. Identifiers stay in the internal run record only.

### 0.3 Synthetic data used by WP-17

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp17-ta-[stamp]`, fresh per run (SA-06) | Every TA step |
| G1 | `wp17-[stamp]-work` in Synthetica; travel start today + 30 days, return today + 40 days | C; the refused closure |
| G2 | `wp17-[stamp]-end` in Synthetica; created with travel start today + 30, return today + 40; changed at V19-2 to start today − 3, return today − 1 | A, B, D, E, F, H; the group end (V19) |
| G3 | `wp17-[stamp]-empty`; no application | The accepted closure |
| A | "SYNDRAFT, ASHA", draft on "SYN Tourist e-visa", never submitted | The travel agent's withdrawal of a draft (always accepted); then ends with G2 |
| B | "SYNPRICE, BINA", submitted on "SYN Tourist e-visa" (₹3,500), unpaid, unassigned | SA1's price increase to ₹4,000 (`mistaken_price`); Y's acceptance in two tabs; then ends with G2 |
| C | "SYNDEFER, CHAND", submitted in G1; "Payment received" (`SYN-W17-[stamp]-PAY-C`); assigned to OP1; work started | Forecast (start today + 5, end today + 32, basis "External delay"); deferral (review today + 7; extended to today + 14; ended); recheck refusal; the applicant's withdrawal request (`SYN-W17-[stamp]-WDR-C`) |
| D | "SYNOPWD, DEV", submitted, unpaid, unassigned | SA1's operational withdrawal request (`SYN-W17-[stamp]-OPS-D`); then ends with G2 |
| E | "SYNEND, ESHA", draft, untouched | Ends with G2 |
| F | "SYNEND, FARAH", submitted, unpaid, unassigned | Y's withdrawal request of a submitted application (either assessment); then ends with G2 |
| H | "SYNSTAY, HARI", submitted; "Payment received" (`SYN-W17-[stamp]-PAY-H`); unassigned | Stays open past G2's return date ("Service payment is recorded as received") |
| Passports, photographs | As WP-14 §0.3 | Intake |
| Reasons, notes, justifications | "WP17 [stamp] …", at least 10 characters (20 for a justification) | Every text field |
| Fixtures (tests, gallery) | A group with an open intake incident and one with a running import; a group closed after its return date with a completed application that keeps an open payment follow-up; every group-end reason, alone and together; 500 group-end items; clock unhealthy; an application assigned with an open price increase; a paid application with an open increase; a superseded increase; a released held correction of each kind and its conflict; an act `authorized` and one `filing_unknown` (withdrawal, deferral and correction cases); a withdrawal preview that changes between load and send; a deferral whose proposed date passed; an approved deferral whose review came due; a deferral of an application withdrawn meanwhile; recheck answers `not_run`, `travel_rule_unknown` with and without `retryAt`, `historical_or_held`; a lost acknowledgement of each command; the largest valid form of each page with Devanagari text | T items and the gallery |

### 0.4 Run recipe (rerunnable; one recipe)

- Run tag `wp17-[yyyymmddhhmm]`. First checks: the harness can create, activate and sign in Y; SA1, SA2, OP1, OP2
  and `syn-ta-2` sign in; "SYN Tourist e-visa" admits Y (TA-03). The run record states the date-check interval of the
  installation (`core.dateCheckEveryMs` in its configuration; no page shows it). Fallback when Y cannot be created:
  `syn-ta-1` with the run-tagged groups, and the run record says so.
- **Withdrawal branch (first check after Setup 1).** Y reads TA-07 of F (submitted, unassigned). Core's preview is
  "accepted" or "refused: `withdrawal_cutoff_undeclared`" (the seeded offering's cut-off support decides). The run
  record names the branch. Both branches are valid results for W-3 to W-5; the accepted path of a submitted
  application then runs as tests (A16 and step T-W) when the branch is "refused".
- Baseline (step P-0): SA-02d rows and SA-01 group 6 lines ("Proposed, to decide", "Reviews due"); OP-01 views of
  OP1 (counts of "Action now" and "Waiting"); the TA-04 and TA-06 row counts of `syn-ta-2`. Every later count check is
  a delta from it.
- Setup (labelled; pages of other packages): Setup 0: SA1 creates and activates Y. Setup 1: Y creates G1, G2 and G3
  (TA-13a); Y creates drafts A and E in G2 (TA-09); Y submits B, D, F and H in G2 and C in G1 (TA-08). Setup 2: SA1
  records "Payment received" for C and H (SA-07a); SA1 assigns C to OP1 (SA-03a); OP1 starts work on C (OP-02).
- Order (§3): P-0, Setup 0, Setup 1, the withdrawal branch, Setup 2, G-1, G-2, W-1, W-2, Q-1 to Q-4, F-1, F-2, D-1 to
  D-6, R-1, W-3 to W-5, V19-1 to V19-6, X-1, then the test steps T-G, T-W, T-Q, T-K, T-F, T-D, T-R, T-V19, T-X, then
  X-2 to X-4. Every harness send uses the fields of a freshly loaded page unless the step says "raw".

### 0.5 Refusal shapes in the code at b2a6341 (category / code)

Every command below also answers `not_found_or_forbidden` / `access_denied` for a caller without its policy action
(the route answers the uniform not-found page first for a person of another surface) and `conflict_operation_key` /
`operation_key_reused` for a reused key with other content. Input refusals are `validation_failed` / `input_invalid`
with the field and Zod's code. A support view runs no command: `/admin` pages and posts answer 409
`support_view_active`; TA pages in a support view show no form. The BFF refusals of the design send no command.

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `core.close_group` | `stale_revision` / `stale_revision` (`_rev.group`); `control_blocked` / `group_closed`; `control_blocked` / `group_has_open_applications`, else `group_intake_incidents_open`, else `attempt_in_progress`, each with `blockers` that name every code that applies (control `group_open`, `exceptionEligible: false`); `stale_revision` on the guarded update |
| `core.edit_travel_dates` (WP-03; asserted for set-up and the WP-17 part) | `input_invalid` on the date format; `stale_revision`; `control_blocked` / `group_closed`; `validation_failed` / `group_dates_invalid` at `travelReturnDate` (return before start) or at `travelStartDate` with code `unchanged`. No refusal for dates in the past |
| `core.recheck_travel_dates` | `control_blocked` / `application_not_open`; `control_blocked` / `travel_date_recheck_not_pending` |
| `core.request_withdrawal` | `input_invalid` on `note` (over 2,000); `stale_revision` (`_rev.application`); `control_blocked` / `awaiting_formal_return`; `control_blocked` / `hold_assistance_in_progress`; `control_blocked` / `application_not_open`; `control_blocked` / `outcome_already_recorded`; `control_blocked` / `protection_mark_active`. Not refusals (accepted command, `result: refused`): `filing_possibly_occurred`, `withdrawal_cutoff_passed`, `declared_cutoff_passed`, `withdrawal_cutoff_undeclared` |
| `core.record_applicant_withdrawal` | `input_invalid` on `evidence` (none: a blank reference), on `evidenceRef` (over 120, the contract) and on `note`; `stale_revision`; `control_blocked` / `withdrawal_evidence_missing`; `application_not_open`; `outcome_already_recorded`; `protection_mark_active`. Assessments as above |
| `core.record_operational_withdrawal` | `input_invalid` on `reason` (10 to 1,000) and `evidence`; `stale_revision`; `control_blocked` / `withdrawal_evidence_missing`; `application_not_open`; `outcome_already_recorded`; `protection_mark_active`. Assessments as above |
| `core.propose_deferral` | `input_invalid` on `justification` (20 to 2,000) and `proposedReviewOn` (format); `stale_revision`; `control_blocked` / `application_not_submitted`; `control_blocked` / `outcome_already_recorded`; `control_blocked` / `filing_possibly_occurred` (an act `authorized` or `filing_unknown`); `validation_failed` / `date_invalid` at `proposedReviewOn` (`not_after_today`); `conflict_duplicate` / `deferral_active` |
| `core.decide_deferral` | `input_invalid` on `decision` (`approve`, `decline`, `extend`), `reason` (10 to 1,000), `reviewOn` (format); `not_found_or_forbidden` / `access_denied` (an unknown deferral); `stale_revision` / `stale_revision` (approve or decline of a deferral that is not `proposed`; extend of one that is not `approved`); `validation_failed` / `date_invalid` at `reviewOn` (`not_after_today`, also when the proposed date applies and has passed); `stale_revision` on the guarded update |
| `core.end_deferral` | `input_invalid` on `note` (1 to 1,000); `not_found_or_forbidden` / `access_denied` (an unknown deferral; not the assigned operator); `stale_revision` / `stale_revision` (the deferral is not `approved`) |
| `core.propose_price_increase` | `input_invalid` on `cause`, `newPricePaise` (digits) and `reason`; `stale_revision`; `control_blocked` / `application_not_submitted`; `control_blocked` / `outcome_already_recorded`; `validation_failed` / `input_invalid` at `correctionId` with code `correction_not_applied` (every `material_scope_change`); `conflict_duplicate` / `price_increase_open`; `validation_failed` / `input_invalid` at `newPricePaise` with code `not_higher`; `control_blocked` / `application_not_submitted` (no price in effect) |
| `core.decide_price_increase` | `input_invalid` on `priceRecordId` and `decision`; `not_found_or_forbidden` / `access_denied` (a record of another application, before the revision); `stale_revision`; `control_blocked` / `outcome_already_recorded`; `application_not_open`; `withdrawal_accepted`; `awaiting_formal_return` (assigned, or assistance in progress); `stale_revision` (the record is no longer an open increase) |
| `core.record_forecast` | `input_invalid` on `windowStart`, `windowEnd`, `basisCode`, `note` (over 500); `control_blocked` / `application_not_submitted`; `control_blocked` / `outcome_already_recorded`; `validation_failed` / `forecast_window_invalid` at `windowStart`; `stale_revision` (a concurrent forecast) |
| `core.apply_held_correction` | `input_invalid` on `correctionId`; `not_found_or_forbidden` / `access_denied` (a correction of another application; a role that the correction's kind does not permit); `stale_revision`; `stale_revision` (not `released_for_reapply`); `control_blocked` with the `correct_application` blockers; `awaiting_formal_return`; `hold_assistance_in_progress`; `stale_revision` / `held_correction_conflict`; the same-person evidence refusals of an identity correction (WP-03 §0.5); `control_blocked` / `filing_possibly_occurred` |
| Asserted as set-up answers (owned elsewhere) | `core.create_group`, `core.submit` (WP-03); `pay.record_service_status` use `record`, `core.assign` (WP-06); `ops.start_work` (WP-07) |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-17 |
|---|---|---|
| TA-05 Group detail | 4650 `/ta/groups/:groupId` (WP-03 page) | Section "Closing the group" (rule, Core's facts, the link to TA-05c); the closure receipt; ended and withdrawn rows; the group closed after its return date |
| TA-05c Close the group | 4650 `/ta/groups/:groupId/close` (new GET beside T08) | Host of `core.close_group` (CC-02) |
| TA-13b Change travel dates | 4650 `/ta/groups/:groupId/travel-dates` (WP-03) | The affected-work part: rows after a change; the past-date consequence (§6 Q-01) |
| TA-04, TA-06 | 4650 (WP-03 pages) | Words of ended and withdrawn rows |
| TA-07 Application workspace | 4650 `/ta/applications/:applicationId` (WP-03 page) | Sections "Withdraw", "Price and timing", "Pending work"; the deferral and ended states; next action |
| TA-07w Withdraw this application | 4650 `…/withdraw` (new GET beside T34) | Host of `core.request_withdrawal` |
| TA-07d Decide on the price change | 4650 `…/price-decision` (new GET beside T35) | Host of `core.decide_price_increase` |
| TA-07c Apply a held correction | 4650 `…/corrections/:correctionId/reapply` (new GET beside T48) | Host of `core.apply_held_correction` |
| OP-02 Application workspace | 4652 `/ops/applications/:applicationId` (WP-07 page) | Work sections "Timing", "Deferral", "Travel-date recheck", "Ending the case" |
| OP-02f, OP-02d, OP-02e, OP-02w | 4652 new GETs beside O42, O24, O43, O23 | Hosts of `core.record_forecast`, `core.propose_deferral`, `core.end_deferral`, `core.record_applicant_withdrawal` |
| OP-02 and SA-04a "Travel-date recheck" | 4652 in-place forms posting O60 and D128 | Host of `core.recheck_travel_dates` per surface |
| SA-02d Deferrals | 4652 `/admin/queues/deferrals` (WP-06 page) | The "Decide" link to SA-09d |
| SA-04a Application (SuperAdmin) | 4652 `/admin/applications/:applicationId` (WP-11 page) | Sections "Price and timing", "Ending the case", "Deferral", "Travel-date recheck" become facts and links |
| SA-09d, SA-09p, SA-09w | 4652 SA-09 kinds `deferral_approve`, `deferral_decline`, `deferral_extend`, `price_increase`, `operational_withdrawal` | Hosts of `core.decide_deferral`, `core.propose_price_increase`, `core.record_operational_withdrawal` |
| SA-04g Group end | 4652 `/admin/groups/:groupId` (D30, kept, rebuilt) | `core.admin_group`: eligibility and reasons per application |
| Set-up and observation pages | SA-06, TA-13a, TA-09, TA-08, SA-07a, SA-03a, SA-01, OP-01, OP-04, TA-07p, TA-10, TA-01, TA-11, SA-08s | Set-up and observation only |

Reads: `core.ta_group` (TA-05); `core.ta_groups` (TA-04); `core.ta_applications` (TA-06); `core.ta_application`
(TA-07 and its task pages); `core.ops_case` (OP-02 and its task pages); `core.ops_work` (OP-01, observation);
`core.admin_case` (SA-04a, SA-09d, SA-09p, SA-09w); `core.admin_queue {deferrals}` (SA-02d);
`core.admin_group` (SA-04g); opt. `dlv.notices` (TA-07 deferral and timing notices); `core.operation` (receipts and
status pages); `views.audit_subject` (SA-08s, observation).

### 1.2 Command coverage (CC §5.1: 13 WP-17 commands; CC-02, CC-04, CC-06, CC-15)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `core.close_group` (CC-02) | `ta.groups.close` (T08) | TA-05c (linked from TA-05 "Closing the group") | A01 to A05, A07 |
| 2 | `core.edit_travel_dates` | `ta.groups.travel_dates` (T07) | TA-13b (WP-03: WP03-A18 to A22; not repeated) | A11 (affected work; past dates) |
| 3 | `core.recheck_travel_dates` | `ops.applications.travel_recheck` (O60); `admin.applications.travel_recheck` (D128) | OP-02 Work and SA-04a Overview, section "Travel-date recheck" (in place) | A61 to A65 |
| 4 | `core.request_withdrawal` | `ta.applications.withdraw` (T34) | TA-07w | A13 to A21 |
| 5 | `core.record_applicant_withdrawal` | `ops.applications.applicant_withdrawal` (O23) | OP-02w | A56 to A60 |
| 6 | `core.record_operational_withdrawal` | `admin.applications.operational_withdrawal` (D22) | SA-09w | A83 to A88 |
| 7 | `core.propose_deferral` | `ops.applications.propose_deferral` (O24) | OP-02d | A46 to A52 |
| 8 | `core.decide_deferral` | `admin.deferrals.decide` (D24) | SA-09d (list on SA-02d) | A66 to A73 |
| 9 | `core.end_deferral` | `ops.applications.end_deferral` (O43) | OP-02e | A53, A54 |
| 10 | `core.propose_price_increase` (CC-04 SA-09 kind) | `admin.applications.price_increase` (D101) | SA-09p | A74 to A82 |
| 11 | `core.decide_price_increase` | `ta.applications.price_decision` (T35) | TA-07d | A22 to A31 |
| 12 | `core.record_forecast` | `ops.applications.forecast` (O42) | OP-02f | A39 to A45 |
| 13 | `core.apply_held_correction` (CC-06) | `ta.applications.reapply_correction` (T48) | TA-07c | A34 to A36 |
| ref | Group end (no command; Core's task) | — | SA-04g; TA-05; TA-07 | A06, A08, A09, A12, A37, A89 to A95 |
| ref | `dlv.acknowledge_notice` | — (WP-08, TA-10) | — | A31 (separate from the price decision) |

All of them also: A96 to A115. Commands outside WP-17 that the proof touches only as set-up or observation:
`iam.create_account`, `iam.approve_account`, `iam.activate_account`; `core.create_group`, `intake.start_individual`,
`core.submit`; `pay.record_service_status`; `core.assign`; `ops.start_work`.

### 1.3 State coverage

S1 does not apply (server-rendered). S5 applies only to the SA-01 and OP-01 counts (observation).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-05, TA-05c | Open with conditions A01, A02; empty A03; ended rows A06; closed after return date A08; S7, support view A10 | — | A02, A05, A07 | A03 | A04 (5) | A04 (4) |
| TA-07 sections | Withdraw states A13; price A22; timing A32; deferral A33; pending work A34; ended A37; withdrawn waiting A38 | — | — | — | — | — |
| TA-07w | Form A14; outcome recorded, assigned A18; stale, support view A19 | A20 | A18, A19 | A15, A16, A17 | A110 | A19 |
| TA-07d | Form A23; assigned A27; paid A28; superseded A29 | A29 | A29 | A24 | A110 | A26 |
| TA-07c | Form, conflict, held again A34 | A34 | A34 | A34 | A110 | A34 |
| OP-02 sections | Timing A39; deferral A46; recheck A61; ending A56 | — | — | — | — | — |
| OP-02f | Form A40; draft, outcome, support view A45 | A43 | A41, A45 | A42 | A110 | — (no revision; A44) |
| OP-02d, OP-02e | Form A47, A53; open deferral A51; hard stops A52 | A48 | A48, A51, A52 | A49, A53 | A110 | A52, A54 |
| OP-02w | Form A56; possible filing A59 | A57 | A57, A60 | A58 | A110 | A60 |
| SA-09d | Form A67; proposed date passed, ended meanwhile A71 | A71 | A71 | A68, A70 | A110 | A69 |
| SA-09p | Form A75; open change A79; assigned, paid A75 | A76, A77 | A77, A79, A80 | A78 | A110 | A81 |
| SA-09w | Form A84; possible filing A87 | A85 | A85, A87 | A86 | A110 | A87 |
| SA-04g | Before date A89; eligible A90; ended A91; future return date A92; clock unhealthy, cap, S7 A93 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-17 shows | Items |
|---|---|---|
| V19 (group-end part; WP-16 the financial follow-up, WP-14 the disclosure part) | Only eligible unpaid, never-worked applications end with the group after the return date; a paid one stays open with its reason; unknown filing, held originals, pending delivery and outstanding money exclude the date path (tests); "Ended with its group" never reads as success; the group stays open while one application is open; a closed group keeps its history | A06, A07, A08, A12, A37, A89 to A95; §3 V19 steps |
| UX §3.2 Group end; BS B25; CC-02 | Ordinary closure names each missing condition; Core decides; a withdrawn application holds closure until it ends | A01 to A05, A09, A38 |
| UX §2.2 deferral line; BS B21 | Operator justification, SuperAdmin approval, TA notice, review point; the deferral pauses only what Core pauses | A33, A46 to A55, A66 to A73 |
| BS B24, B23, B18; UX §5.3 | Three withdrawal paths, one assessment recorded either way; no ordinary withdrawal while filing may have occurred; the TA waits for a formal return | A13 to A21, A56 to A60, A83 to A88 |
| BS B17; UX §4.3 | Prior and proposed price, cause and the TA's choice; a declined mistaken increase keeps the communicated price; paid amounts and refunds stay separate | A22 to A31, A74 to A82 |
| BS B17; UX §3.1, §4.4 | Original estimate and later forecast stay separate; the timing notice reaches the TA | A32, A39 to A45 |
| UX §4.2 Groups (travel-date edit and its recheck); BS B06 | Affected unfiled applications rechecked; filed facts unchanged; recheck answers truthfully | A11, A61 to A65 |
| BS B23 (held correction) | Released correction applied again by the person permitted | A34 to A36 |
| BS B35 | Replay and matrices | A04, A110 |
| V24 | Keyboard, screen reader, phone | A116 to A128 |

## 2. Acceptance checklist

### 2.1 TA-05 Group detail: closing and group end (travel agent)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A01 | Travel agent (Y) | TA-05 of G1 after Setup 2 (§3 G-1) | Read the section "Closing the group". | The B25 rule as text (draft): "A group closes when every application in it has ended and no import or import issue of the group is open. A withdrawn application stays in the group until it ends with the group after the travel return date." Core's two counts with units ("Imports still running: 0 imports"; "Open import issues of this group: 0 issues"; WP-03 U1). No count of open applications computed by the page; no sentence that the group is ready to close or closes on a date. The link "Close the group" → TA-05c shows because the group is open (Q-W03-09); no close form on TA-05. | L | CC-02; BS B25; WP03-A31, A32 |
| WP17-A02 | Travel agent (Y) | TA-05c of G1 (§3 G-1) | Read TA-05c. Select "Close the group". | TA-05c: `h1` "Close the group: [group]"; the rule and Core's facts as A01; the effect (draft) "A closed group stays readable with its history. You cannot add applicants or change its travel dates."; "Close the group", "Cancel" → TA-05. The send is refused (`group_has_open_applications`): TA-05c re-renders at the POST address with an error summary that names every condition in Core's `blockers`, in words: "Some applications of this group are still open. Each ends when its processing completes, or with the group after the travel return date." (and, when present, "Import issues of this group are open." with the issues link, "An import of this group is still running." with the imports link). No code alone. Group revision and state unchanged (delta 0); operations delta 0. | L | CC-02; `groups.ts` `closeGroup`; PL §4.2 (Group end) |
| WP17-A03 | Travel agent (Y) | TA-05 of G3 → TA-05c (§3 G-2) | Follow "Close the group"; select "Close the group". | Accepted: 303 to TA-05; the receipt reads "Request recorded" (the summary has only the group id, as a created group's; §0.2 "Receipts") with "Current: State: Closed". TA-05 then is read only: no "Add applicants", no "Edit travel dates", no close link; the history stays. TA-04 row "Closed". A fresh read shows the group revision advanced. No `?done=closed` flash. | L | CC-02; WP-03 C-03; M-12 class |
| WP17-A04 | Travel agent (Y); harness; test | TA-05c of G3, the Nth time (§3 G-2; test) | (1) Harness: resend the accepted POST (same `_op`). (2) Press Back. (3) Harness raw: a new key with the group's earlier revision. (4) Test: two tabs of TA-05c of one group; tab 2 closes; tab 1 sends. (5) Test: lost acknowledgement. | (1) The same 303 and receipt; one `core.group_closed` fact. (2) TA-05c shows "The group is closed." with no form; nothing sent. (3) `stale_revision`: CMP-14 "Group: open when you opened the page / now Closed"; nothing recorded. (4) As (3). (5) C4 "Checking the original result", "Check status"; no second close offered; the status page links TA-05. | L ((1) to (3)) + T ((4), (5)) | BS B35; §0.2 "Replay terms" |
| WP17-A05 | Test (`group-close` unit and HTTP tests) | TA-05 refusal render | Render each of `group_has_open_applications`, `group_intake_incidents_open`, `attempt_in_progress` alone and all three together; `group_closed`; `stale_revision`; an unknown code; access, session, maintenance and support-view refusals. | Each code has its sentence and link; with several blockers every one shows (not only Core's first code); `group_closed` reads "The group is closed already." with the closed state; unknown: category text and "Reference code: [code]"; access refusals go to the shell (LD-14). The page never decides closure itself: the form shows whenever the group is open. | T | CC-02; Q-W03-09; WP-01 A-08 |
| WP17-A06 | Travel agent (Y) | TA-05 of G2 after the date check (§3 V19-4) | Read the page. | State "Open" (H is still open). "Ended with the group: 5 applications" (WP03-A31 line). Rows A, B, D, E, F show "Ended with its group" as their stage (not "Completed" alone; §6 Q-05) with their outcome as recorded ("Withdrawn" for A, and for D and F when accepted; else "Outcome not recorded"). Row H shows "Submitted" and its next step from Core. No text that the group "finished", "succeeded" or "will close". | L | BS B25; PL §4.2 ("Ended with group", never success); V19 |
| WP17-A07 | Travel agent (Y) | TA-05c of G2 (§3 V19-5) | Select "Close the group". | Refused `group_has_open_applications` as A02; nothing recorded. | L | CC-02; BS B25 |
| WP17-A08 | Test; gallery | TA-05 of a group closed after its return date (`closed_kind = group_end`), with one completed application that keeps an open payment follow-up | Render. | State "Closed after the travel return date"; read only with history; rows with "Ended with its group" or "Processing completed"; the completed row keeps its link, and TA-07 shows the continuing payment facts (WP16-A110); no "Add applicants", "Edit travel dates" or close form. | T + gallery | BS B25 ("closed group may retain … financial follow-up"); V19 |
| WP17-A09 | Travel agent (Y); test | TA-05 of G2 after V19-4; TA-07 of H | Read. | TA-05 states the B25 exclusions as rule text, without a per-application verdict (no TA read returns one): "An application ends with the group only if it was never paid, never assigned to an operator, never sent to the authority, holds no original or pending delivery, and no money is outstanding on it. Other applications stay open until their processing completes." (draft). TA-07 of H shows its own next step from Core (for example "TravelMudra: assign an operator"). No page states the date-check interval. | L + T | BS B25; §0.1 "Facts no read returns"; WP-01 Q-13 |
| WP17-A10 | Test | TA-05 states | The group read unavailable; the closure counts unavailable; a support view; 200 applications (the read's cap). | Unavailable read: S7, never an empty group. A count that cannot be read: "Unavailable", never "0". Support view: the facts, no close form. At 200 rows: "This page lists the first 200 applications of this group." | T | D7; LD-14; K-05 |
| WP17-A11 | Travel agent (Y); test | TA-13b of G2 (§3 V19-2) and TA-05 after it | Change the dates of G2 to start today − 3 and return today − 1. Read TA-05. Test: a return date before today. | WP-03 behaviour as WP03-A19 (not repeated). WP-17 part: after the change TA-05 lists each open application with its recheck state from Core's pending answer ("Being checked", WP-03 U4) until Core records the recheck; the page lists no "affected" set and computes no count. Per §6 Q-01: the design adds a minimum of today to TA-13b's date controls (a browser check only); TA-13b also states before "Save travel dates", on every render (draft): "If the new return date is before today, TravelMudra's next date check ends each application of this group that can end with the group. That cannot be reversed." Core decides: a raw post with past dates is accepted, and the BFF adds no rule of its own. | L + T | PL §5.2 (Edit travel dates); BS B06, B25; §6 Q-01 |
| WP17-A12 | Travel agent (Y); test | TA-04, TA-06 after V19-4; test of the row words | Read the G2 rows. Test: rows of each lifecycle with and without an outcome. | TA-06 rows of A, B, D, E, F: "Ended with its group" (lifecycle words) and the outcome as recorded; never "Completed" alone and never a success tone (§6 Q-05). A withdrawn open application (before V19-4): Outcome "Withdrawn" and the stage "Draft" or "Submitted"; never "Closed" or "Cancelled". TA-04 G2 row "Open" with "[open] open of [total] applications" from Core. | L + T | PL §4.2; BS B21, B25; §6 Q-05 |

### 2.2 TA-07 and TA-07w Withdraw (`core.request_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A13 | Travel agent (Y); test | TA-07 of A, section "Withdraw" (§3 W-1); test: each preview and editor state | Read the section. | From Core's facts only: preview `accepted` and the travel agent may act → link "Withdraw this application" → TA-07w. Assigned and not returned → no withdraw link; the WP-09 link "Ask your operator for a return" → TA-07p `?purpose=withdraw` (WP09-A08). Preview `refused` → CMP-10: the reason in words, the owner and the route (filing possibly occurred: "Owner: your operator"; undeclared cut-off: "Owner: TravelMudra"), no link (§6 Q-13). An outcome recorded → no section, the status row shows the withdrawal (WP-03 rows). Support view: facts, no link. | L (A) + T | PL §5.2 TA-07 (Withdraw application); BS B18, B23, B24; WP09-A08 |
| WP17-A14 | Travel agent (Y) | TA-07w of A (§3 W-1) | Read the page from the top. | `h1` "Withdraw this application: [applicant]"; breadcrumb back to TA-07; "Read at". Scope: application, group, service, stage. Current facts: stage, outcome ("Outcome not recorded"), service payment (TA words), price in effect (none for a draft: "Fixed when you submit"). "TravelMudra's answer now: Accepted" from the preview, with "TravelMudra checks it again when you send." Effect (draft): "No further filing happens. The application, its history, documents and money records are kept. A withdrawal cannot be reversed. The application stays in the group; after the group's travel return date it ends with the group if nothing holds it open." When the service payment is "Recorded as received": "Recording a refund is unavailable in this release. Owner: TravelMudra." (WP16-A07 TA variant). "Note for TravelMudra" optional (up to 2,000). Hidden revision. "Withdraw the application" and "Cancel" → TA-07. No checkbox. | L | BS B24, B25; UX §3.3; WP16-A07 |
| WP17-A15 | Travel agent (Y); harness | TA-07w of A (§3 W-1) | Give a note; send. Harness: resend the same `_op`. | 303 to the host's receipt address (design §1.5); receipt "Withdrawal recorded": "Withdrawn: no further filing happens" (summary `result: accepted`); Current: Outcome "Withdrawn", Stage "Draft", Next per Core. TA-05 of G2 still lists A with "Withdrawn". Y's notices +1 (`withdrawal_decision`, observe TA-10). The receipt gives no instruction to act. The resend: the same 303 and receipt; one withdrawal record. | L | BS B24, B35; WP-07 F-33 |
| WP17-A16 | Travel agent (Y); test | TA-07w of F (§3 W-3, branch "refused"); test: a submitted application before its declared cut-off | Send (live branch); test: the accepted path. | Refused branch: the receipt reads "Withdrawal request recorded" with "Refused: this service has no withdrawal cut-off that TravelMudra can apply in this release" (never "Withdrawn"); Current: outcome unchanged; TA-07 status row "Withdrawal request refused: [reason]"; Y's notices +1. Core records each new request (no duplicate guard is claimed): the section stays as Core's preview allows. Accepted path (test, or live in the "accepted" branch): as A15 with Stage "Submitted". | L (branch) + T | BS B24; WP-15 lesson (accepted command, refused effect); WP-09 G-03 |
| WP17-A17 | Test | TA-07w race | The preview reads accepted at load. Before the send: (a) the application is assigned (fixture); (b) a fact that changes Core's assessment is recorded (fixture: a declared cut-off step on a formally returned case). | (a) Refused `awaiting_formal_return`; nothing recorded; TA-07w re-renders with the note kept and the TA-07p link. (b) Core records `refused` / `declared_cutoff_passed`; the receipt shows the recorded result, never the preview. | T | BS B18, B24; `withdrawal.ts` |
| WP17-A18 | Travel agent (Y); harness; test | TA-07w of A after W-1 (§3 W-2); tests | GET TA-07w of A. Harness: send the saved W-1 envelope with a new key. Test: `awaiting_formal_return` (assigned after load), `hold_assistance_in_progress`, `application_not_open` (ended), `protection_mark_active`. | GET: no form; "This application already has an outcome: Withdrawn. Withdrawing it is not possible." with the link to TA-07. The saved envelope: `outcome_already_recorded`, nothing recorded (withdrawal records delta 0). Each test refusal: TA-07w re-rendered at the POST address with the note kept and Core's reason in words; `awaiting_formal_return` adds the TA-07p `?purpose=withdraw` link. | L (GET, envelope) + T | WP-09 G-05; §0.5 |
| WP17-A19 | Test | TA-07w stale and access | A stale revision (the application changed after load); another TA's application; a support view; a session that ended. | Stale: CMP-14 with the changed facts and the note kept; nothing recorded. Another TA: the uniform not-found page. Support view: no form. Session: sign-in. | T | UX §3.3; LD-14 |
| WP17-A20 | Test (BFF, HTTP) | TA-07w handler | A note of 2,001 characters; the largest valid note (2,000 Devanagari characters) over real HTTP. | 2,001: refused at the field, the note kept whole, no command call. 2,000 Devanagari: the body fits the route limit and reaches Core; accepted (§0.1 "BFF today": 16,384 bytes is too small today). | T | LD-17; WP-16 PM Q-14; M-06 |
| WP17-A21 | Test (`case-words`) | Withdrawal words, both audiences | Every assessment code, requester kind and state; an unknown code. | §0.2 "Words"; `withdrawal_cutoff_undeclared` on TA pages: "Withdrawing a submitted application of this service is unavailable in this release. Owner: TravelMudra."; no TA page says "cancelled", "deleted", "refunded" or "closed" for a withdrawn application; no page uses "withdrawn" for a service that is no longer offered (WP-13). | T | BS B24; WP-13 words; Q-W16-08 |

### 2.3 TA-07 price section and TA-07d Decide on the price change (`core.decide_price_increase`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A22 | Travel agent (Y) | TA-07 of B after Q-1 (§3 Q-2) | Read the action panel and "Price and timing". | Action panel (Core's pending `price_decision_pending`): "Decide on the price change" → TA-07d. Rows: "Quote: ₹3,500, fixed at submission"; "Price in effect: ₹3,500"; "Price change waiting for your decision: ₹4,000 (correction of a mistaken price)"; original estimate; current forecast. No "Amount due", no difference, no total. | L | PL §5.2 TA-07 (Decide price increase); BS B17 |
| WP17-A23 | Travel agent (Y) | TA-07d of B (§3 Q-2) | Read the page from the top. | `h1` "Decide on the price change: [applicant]"; "Read at". Evidence: "Price before the change: ₹3,500" (`previous_price_paise`); "Proposed price: ₹4,000"; cause words; "Service payment: Not recorded yet" (TA words). The SuperAdmin's reason does not show (no TA read returns it): "Partly met" (§6 Q-06). Effects: Accept → "₹4,000 becomes the price in effect." Decline → "TravelMudra keeps the price it communicated: ₹3,500." Radio group "Your decision" (Accept, Decline), none preselected; hidden record id and revision; "Record my decision"; "Cancel" → TA-07. | L | UX §4.3; BS B17; §6 Q-06 |
| WP17-A24 | Travel agent (Y), tab 2 | TA-07d of B (§3 Q-3) | Choose "Accept"; send. | 303 to the host's receipt address (design §1.5); receipt "Price decision recorded" (named per §0.2) with "Accepted: ₹4,000 is the price in effect"; Current: "Quote: ₹3,500, fixed at submission" and "Price in effect: ₹4,000" as two rows; no open change; no "Amount due". TA-11 shows "Price in effect: ₹4,000" (observe WP-16). | L | BS B17; WP-16 Q-W16-01 |
| WP17-A25 | Travel agent (Y); harness | TA-07d after Q-3 (§3 Q-3) | Harness: resend tab 2's POST (same `_op`). Press Back on tab 2. | The same 303 and receipt; one decision (price records delta 0 after the first). Back: TA-07d answers "This price change is decided: Accepted, ₹4,000." with no form. | L | BS B35 |
| WP17-A26 | Travel agent (Y), tab 1 | TA-07d of B, opened before Q-3 (§3 Q-3) | Choose "Decline"; send after tab 2's acceptance. | `stale_revision`: CMP-14 "Your decision: your unsent choice Decline / now Accepted, ₹4,000 in effect"; "Nothing was recorded. This price change is decided."; no form; the unsent choice stays as text. Price records delta 0. | L | UX §3.3; M-09 class |
| WP17-A27 | Test; gallery | TA-07 and TA-07d of an assigned application with an open increase | Render. Send a saved envelope. | TA-07 shows the open change and "You can decide after your operator returns the application to you." with the link to TA-07p; Next from Core ("Your operator: return the application for your price decision"); TA-07d shows the same line and no form; the envelope: `awaiting_formal_return`, nothing recorded. | T + gallery | BS B18; `submission.ts` decide order; §6 Q-04 |
| WP17-A28 | Test; gallery | TA-07d of a paid application ("Recorded as received") with an open increase | Render. | The decision form shows (Core accepts it) with the line "Adjusting an amount you already paid, or a refund, is unavailable in this release. Owner: TravelMudra." No amount due, no difference of ₹500, no "pay the rest" (§6 Q-02). | T + gallery | UX §4.3; BS B17, B29; PL §5.2 (Paid amount adjustment) |
| WP17-A29 | Test (`price-decision` unit and BFF tests) | TA-07d refusals and states | No choice; a record id that is not a price record; a superseded increase (the application was withdrawn or ended); `outcome_already_recorded`; `application_not_open`; `withdrawal_accepted`; a decided record (`stale_revision`); a support view. | No choice: "Choose Accept or Decline." at the field, no command. Superseded: "This price change is no longer open: [the application ended / has an outcome]." with no form. Each Core refusal: its sentence, nothing recorded, the choice kept as unsent text where the form no longer applies. Support view: no form. | T | §0.5; WP-02 R-01, R-03 |
| WP17-A30 | Travel agent (Y); test | TA-07 of B after Q-3, "Price history" | Read. Test: every kind and state. | Oldest first, every record stays: "Quote at submission: ₹3,500"; "Price change proposed: ₹4,000 (correction of a mistaken price): Accepted"; test: "Reduced automatically to ₹[n]" (`reduction_auto`), "Declined: the communicated price stays", "No longer open". No recorder or reason on TA pages. | L + T | BS B17, B33; UX §4.2 |
| WP17-A31 | Travel agent (Y) | TA-10 after Q-1 and Q-3 (observe WP-08) | Read the price-change notice. | The notice "needs your acknowledgement" (Core: `ackRequired`); recording the price decision does not acknowledge it and no page acknowledges it for the travel agent; the decision and the acknowledgement stay two facts (§6 Q-16). | L | UX §4.2 Notices; WP-08 Q-W08-02 |

### 2.4 TA-07 timing, deferral, held correction and ended states

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A32 | Travel agent (Y) | TA-07 of C after F-1 (§3 F-2); TA-01 | Read "Price and timing" and TA-01 "Travel-date notices". | "Original estimate: [dates]" unchanged; "Current forecast: [today + 5] to [today + 32] (separate from the estimate)"; the group's travel dates. Where the optional notices read returns C's `timing_risk` notice: "The current forecast may affect your travel date." with its time. The page compares no dates itself. The forecast's basis does not show (no read returns it: "Partly met", §6 Q-07). TA-01 lists the notice (WP-03). | L | UX §3.1, §4.4; BS B17; WP03-A105 |
| WP17-A33 | Travel agent (Y) | TA-07 of C during the deferral (§3 D-4, D-5) | Read the action panel and status facts. | Next from Core (`deferral_active`): "Your operator: review the deferral" with no TA action. Where the optional notices read returns the `deferral` notice: "Paused by TravelMudra until a review on [date]" with the latest notice's date (today + 14 after D-5); otherwise "Review point: not shown here" ("Partly met", §6 Q-06). No justification, approver or "On hold" without a date. | L | UX §2.2; BS B21; §6 Q-06 |
| WP17-A34 | Test; gallery | TA-07 "Pending work" and TA-07c with a released travel-agent correction | Render; send; render the refusals `held_correction_conflict`, `filing_possibly_occurred`, `awaiting_formal_return`, `stale_revision` (not released), access. | TA-07: "A correction you made while a filing was uncertain was held. Evidence now shows that the filing did not happen. You can apply it again." with the changed field names and a link to TA-07c. TA-07c: the fields, the effect ("Your corrected details become current. TravelMudra checks the identity documents again when an identity detail changes."), "Apply the correction", "Cancel". Accepted: the receipt per §0.2. `held_correction_conflict`: "The details changed after this correction was made. Make the correction again from the current details." with no form. Each refusal records nothing. | T + gallery | BS B23; CC-06; `drafts.ts` CMD-D4 |
| WP17-A35 | Test | TA-07 pending work by owner | A released correction of an operator's assistance entry and of a SuperAdmin correction. | TA-07 offers no re-application; Next from Core names the operator or "TravelMudra". | T | `derived.ts` rule 8 |
| WP17-A36 | — | Staff re-application of a held correction | Record. | "Unmet: waits for STOP-W11-03 and P-17 item 3" (as WP11-A50); no WP-17 staff page posts `core.apply_held_correction`. | T | WP-11 I-06; CC-15 |
| WP17-A37 | Travel agent (Y) | TA-07 of E and F after the date check (§3 V19-5) | Read the page. | Stage "Ended with its group" with its meaning line (§0.2 "Words"); Outcome as recorded; no action panel step and no form (withdraw, price, help or submit); the history keeps every earlier event; Core's progress word shows only beside the lifecycle words (§6 Q-05). | L | BS B25; PL §4.2; V19 |
| WP17-A38 | Travel agent (Y) | TA-07 of A after W-1 (§3 W-1) | Read the status facts. | Outcome "Withdrawn"; Stage "Draft"; Next from Core in words (for example "No step for you. The application ends with its group after the travel return date if nothing holds it open."); no "Completed", "Closed" or "Delivery pending" headline (Core's `delivery_closure_pending` progress for an open application with an outcome shows only as a labelled row, §6 Q-05). | L | BS B24, B25; §6 Q-05 |

### 2.5 OP-02 Timing and OP-02f Record a forecast (`core.record_forecast`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A39 | Operator (OP1) | OP-02 of C, Work, "Timing" (§3 F-1) | Read. | "Original estimate: [dates]"; "Current forecast: none recorded"; the group's travel dates; link "Record a forecast" → OP-02f. No form on OP-02. | L | PL §3.3 OP-02; WP-07 §1.5 |
| WP17-A40 | Operator (OP1) | OP-02f of C (§3 F-1) | Read the page. | `h1` "Record a forecast: [applicant]"; "Read at". Evidence: original estimate; current forecast; travel start and return. Effect (draft): "The travel agent sees the forecast beside the original estimate; the estimate does not change. When the forecast ends on or after the travel start date, TravelMudra posts a travel-date notice to the travel agent. A later forecast becomes the current one; earlier forecasts stay in the history." Fields: window start, window end (dates), basis (radio, three values, none preselected), note (optional, up to 500). "Record the forecast", "Cancel" → OP-02. | L | UX §3.1, §4.4; BS B17 |
| WP17-A41 | Operator (OP1) | OP-02f of C (§3 F-1) | Send an end date before the start date. | Refused `forecast_window_invalid` at the start date: "The forecast must start on or after the submission date and end on or after its start."; values kept; OP-02f re-rendered at the POST address; forecasts delta 0. | L | §0.5 |
| WP17-A42 | Operator (OP1); harness | OP-02f of C (§3 F-1) | Send start today + 5, end today + 32, basis "External delay", a note. Harness: resend the same `_op`. Press Back. | 303 to the host's receipt address (design §1.5); receipt "Forecast recorded"; Current: "Current forecast: [today + 5] to [today + 32]"; original estimate unchanged. The resend: the same receipt; one forecast. Back: a fresh OP-02f showing the current forecast; nothing sent. Y's notices +1 `timing_risk` (`threatened`; observe TA-01, TA-10). | L | BS B17, B35 |
| WP17-A43 | Test (BFF) | OP-02f handler | A basis of 41 characters; a basis outside the three; a note of 501 characters; dates that are not dates; the largest valid form (500 Devanagari characters) over real HTTP. | Each refused at its field with every value kept whole; no `.slice`; no command call. The largest valid form is accepted. | T | LD-17; M-06 |
| WP17-A44 | Test | OP-02f with two tabs | Tab 2 records a forecast; tab 1 records another. | Both accepted (Core has no expected revision); the later is current; the earlier stays as history. OP-02f shows the current forecast at load; no page claims a stale comparison (§6 Q-10). The basis, note and time of the current forecast do not show on OP-02 after the receipt ("Partly met", §6 Q-07). | T | `submission.ts` `recordForecast` |
| WP17-A45 | Test | OP-02f states | A draft; an application with an outcome; an operator not assigned; a read grant; a support view; a SuperAdmin. | Draft: no link; OP-02f "A forecast is recorded after submission." with no form. Outcome: "This application has an outcome. No forecast is recorded." with no form. Not assigned: not-found. Read grant, support view: no form. SuperAdmin: no forecast page (no route; §6 Q-11). | T | §0.5; WP-09 G-05 |

### 2.6 OP-02 Deferral: OP-02d Propose (`core.propose_deferral`) and OP-02e End (`core.end_deferral`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A46 | Operator (OP1) | OP-02 of C, "Deferral", in each state (§3 D-1, D-4, D-6) | Read. | None: "No deferral." and link "Propose a deferral" → OP-02d. Proposed: "Proposed: waiting for a SuperAdmin decision. Review proposed for [date]." Approved: "Approved: review on [date]" and link "End the deferral" → OP-02e. Ended or declined: shown in the history only. The justification shows (staff read). | L | UX §2.2; BS B21 |
| WP17-A47 | Operator (OP1) | OP-02d of C (§3 D-1) | Read the page. | `h1` "Propose a deferral: [applicant]"; Current facts: stage, outcome, external acts (none authorized or uncertain), current forecast. Effect (draft): "A SuperAdmin decides. While an approved deferral is active, readiness, the authorization of external acts and the packet release are paused on this application. Nothing else is paused. When a SuperAdmin approves it, the travel agent gets a notice with the review date." Hard stops: an act authorized or with uncertain filing; an outcome. Fields: justification (20 to 2,000), proposed review date (after today). "Propose the deferral", "Cancel". | L | UX §2.2, §6.3 Exception; BS B21 |
| WP17-A48 | Operator (OP1) | OP-02d of C (§3 D-1) | (1) Send a review date of today. (2) Send a justification of 19 characters. | (1) `date_invalid` at the review date: "Choose a review date after today." (2) Refused at the justification ("Give a justification of at least 20 characters (up to 2,000)."), by the BFF or Core as the design decides. Values kept; deferrals delta 0. | L | §0.5 |
| WP17-A49 | Operator (OP1); harness | OP-02d of C (§3 D-1) | Send a valid justification and review date today + 7. Harness: resend the same `_op`. | 303 to the host's receipt address (design §1.5); receipt "Request recorded" (the summary is the same for proposal and end; §0.2) with Current "Deferral: proposed, review proposed for [today + 7]". One deferral. SA-02d +1 (D-3). | L | BS B21, B35 |
| WP17-A50 | Operator (OP1) | OP-01 during the proposal and the approval (§3 D-2, D-4; observe WP-07) | Read the views. | Proposed: as Core's pending answer (SuperAdmin owns the next step). Approved: C in "Waiting" with the review point (WP07-A165, F-07); not in "Action now"; the navigation count agrees. | L | WP-07 F-07 |
| WP17-A51 | Operator (OP1); harness | OP-02d of C with an open deferral (§3 D-2) | GET OP-02d. Harness raw: the D-1 content with a new key. | GET: no form; "A deferral is already proposed on this application." with a link to the section. Raw: `conflict_duplicate` / `deferral_active`; nothing recorded. | L | WP-09 G-05; §0.5 |
| WP17-A52 | Test | OP-02d hard stops and stale | An act `authorized`; an act `filing_unknown`; an outcome; a draft; a stale revision; a saved envelope after each. | On GET the blocker and no form ("A deferral cannot be proposed while a filing may have happened." with the act's page as route; "… once an outcome is recorded."; "… before submission."); the envelope refused with Core's code; stale: CMP-14; nothing recorded. | T | §0.5; WP-09 G-05 |
| WP17-A53 | Operator (OP1); harness | OP-02e of C (§3 D-6) | Read. Give a note; send. Harness: resend the same `_op`. | `h1` "End the deferral: [applicant]"; Current: "Approved: review on [today + 14]"; Effect: "Readiness, authorization and packet release are no longer paused by this deferral. The travel agent gets a notice that the deferral ended."; note required (1 to 1,000). Accepted: receipt "Request recorded" with Current "Deferral: ended"; Y's notices +1; the resend returns the same receipt. | L | BS B21, B35 |
| WP17-A54 | Operator (OP1); harness; test | OP-02e after D-6 (§3 D-6); tests | GET OP-02e. Harness: the saved D-6 envelope with a new key. Test: a proposed deferral; an empty note; the largest valid note (1,000 Devanagari characters). | GET: no form, "This deferral is not active." Envelope: `stale_revision` ("This deferral is no longer active: it ended or was replaced."), nothing recorded. Proposed: no end link. Empty note: refused at the field. Largest note: accepted over real HTTP (8,192 bytes is too small today). | L (GET, envelope) + T | §0.5; LD-17 |
| WP17-A55 | Test; gallery | A deferral whose review came due | Render OP-01 and OP-02 of the application; the notices of the operator and the approver. | OP-01 lists it under "Deferral reviews due" from `core.ops_work.reviewsDue` with its review date; notices "The review date of the deferral of [applicant] has come." to the assigned operator and the approving SuperAdmin. No page computes "due" from dates. | T + gallery | BS B21 (monitoring); WP07-A165 |

### 2.7 OP-02 Ending the case and OP-02w Record the applicant's withdrawal request (`core.record_applicant_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A56 | Operator (OP1); test | OP-02 of C, "Ending the case" (§3 W-4); test: an act possibly filed | Read. | Normal: link "Record the applicant's withdrawal request" → OP-02w. Possibly filed (test): CMP-10 first "Ordinary withdrawal is unavailable: a filing may have happened. Owner: you (reconcile the act). Route: [the act's page]." and the link "Record the applicant's request only" with "TravelMudra records the request and refuses it as a withdrawal while a filing may have happened." (D-W07-15 kept on the new host). | L + T | WP-07 §2.4.6, F-09; BS B23 |
| WP17-A57 | Operator (OP1) | OP-02w of C (§3 W-4) | Read; send with an empty reference. | Page: `h1` "Record the applicant's withdrawal request: [applicant]"; Current: stage, outcome, payment, external acts, assignment; no assessment preview (the staff read has none; §6 Q-08). Effect (draft): "TravelMudra records the request and assesses it now. It is refused while a filing may have happened, after an evidenced filing or the service's cut-off, or when the service has no cut-off that TravelMudra can apply; otherwise it is accepted. An accepted withdrawal stops new filing and keeps the history, originals, money and remaining duties. It cannot be reversed. The travel agent gets a notice of the result." Fields: "Reference of the applicant's request" (required, up to 120); note (optional, up to 2,000). The empty reference: refused at the field ("Give the reference of the applicant's request."); note kept; nothing recorded. | L | BS B24; UX §3.3 |
| WP17-A58 | Operator (OP1); harness | OP-02w of C (§3 W-4) | Give `SYN-W17-[stamp]-WDR-C` and a note; send. Harness: resend the same `_op`. | 303 to the host's receipt address (design §1.5); receipt per §0.2 with the recorded result (branch): "Withdrawn: no further filing happens" or "Refused: [reason]" (never a success tone for refused). Current: outcome; Stage "Submitted"; the assignment and the service payment ("Received") unchanged; no custody fact appears (the service holds no originals). TA-07 of C shows the withdrawal row; Y's notices +1. One record after the resend. | L | BS B24; WP-07 F-09; WP-15 lesson |
| WP17-A59 | Test | OP-02w under possible filing | Send the request on an application with an act `filing_unknown`. | Accepted command with `result: refused` / `filing_possibly_occurred`; the receipt "Withdrawal request recorded" with "Refused: a filing may have happened"; the protection stays; the outcome and lifecycle unchanged (as WP07-A66). | T | WP-07 F-09; BS B23 |
| WP17-A60 | Test | OP-02w refusals and limits | `application_not_open`; `outcome_already_recorded`; `protection_mark_active`; `stale_revision`; OP2; a reference of 121 characters; the largest valid note (2,000 Devanagari characters). | Each refused with its sentence and values kept, nothing recorded; OP2: not-found; 121: refused at the field by the BFF, kept whole, no command; the largest note accepted over real HTTP (8,192 bytes is too small today). After the receipt the OP-02 page cannot show the withdrawal record ("Partly met", §6 Q-08). | T | §0.5; LD-17 |

### 2.8 Travel-date recheck (`core.recheck_travel_dates`; in place on OP-02 and SA-04a)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A61 | Operator (OP1); SuperAdmin (SA1); harness | OP-02 and SA-04a of C (§3 R-1) | Read. Harness raw: post the recheck on both surfaces. | No "Travel-date recheck" section (Core's `travelRecheck` is null: the dates are checked). The posts: `travel_date_recheck_not_pending` ("The travel dates of this application are already checked."); nothing recorded. | L | §0.5; WP-11 action panel row 8 |
| WP17-A62 | Test; gallery | OP-02 and SA-04a with a pending recheck | Render `not_run`; `travel_rule_unknown` with `retryAt`; `travel_rule_unknown` without `retryAt`. | `not_run`: "TravelMudra rechecks this application against the group's new dates. Readiness, the packet release and external acts wait for it." `travel_rule_unknown` with retry: "The travel-date rules could not answer: [code words]. It runs again by itself at [time] IST." Without retry: "… It does not run again by itself. Run it again when the cause is fixed." with the action → the recheck host. The owner is Core's (assigned operator, else SuperAdmin). | T + gallery | `travel-recheck.ts`; LD-08 |
| WP17-A63 | Test | Recheck results | Send on a pending application with each result. | `rechecked`: receipt "Travel-date recheck recorded" with "Checked against the current travel dates"; Current: the blockers Core reports now. `travel_rule_unknown`: "The rules could not answer: the recheck is still pending" with the retry time, never "passed". `historical_or_held`: "Filed facts stay as they were. Other work waits for the filing evidence." | T | WP-15 lesson; BS B06, B23 |
| WP17-A64 | Test | Recheck access | OP2; a travel agent; a SuperAdmin; a closed application (`application_not_open`). | OP2: not-found. Travel agent: no route on edge. SuperAdmin: allowed (D128). Closed: refused with its sentence; nothing recorded. | T | `policy.ts` `travel_dates.request_recheck` |
| WP17-A65 | Travel agent (Y); test | TA-07 and TA-08 of an application waiting for a recheck (§3 V19-2 if visible; test) | Read. | "Being checked" (WP-03 U4) with no TA action; TA-08 shows Core's reason that submission waits for the recheck; no TA control runs the recheck. | L (if visible) + T | WP-03 U4; PL §5.2 |

### 2.9 SA-02d Deferrals and SA-09d Decide the deferral (`core.decide_deferral`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A66 | SuperAdmin (SA1) | SA-02d and SA-01 group 6 (§3 D-3) | Read. Follow the row's decision links. | SA-02d row C "Proposed: to decide" (+1 from P-0); SA-01 "Proposed, to decide" +1 (lag form). The row links the SA-09d kinds that apply to the state (approve and decline for a proposed deferral; extend for an approved one); the WP-06 `#deferral` link goes. No decision form on SA-02d or SA-04a. | L | WP-06 §2.2.4, §2.7.5; AD-13; CC-04 |
| WP17-A67 | SuperAdmin (SA2) | SA-09d `deferral_approve` of C, tab 2 (§3 D-3) | Read the page. | SA-09 frame: breadcrumb "Applications & groups › Applications › [applicant] › [decision]"; `h1` with the decision and the applicant; "Read at". Scope: the application and the deferral. Evidence: the operator's justification; "Review proposed for [date]". Current: stage, outcome, assignment, external acts, current forecast. The proposer and the time of the proposal show only through the link "History of this deferral" → SA-08s (no case read returns them). Effect (draft): approve: "Readiness, the authorization of external acts and the packet release are paused on this application until the deferral ends. The travel agent gets a notice with the review date. On the review date the operator and you get a reminder."; decline: "Nothing is paused. The travel agent gets no notice." Hard stops: none. Fields: review date (approve, extend) prefilled with the proposed or current date; reason (10 to 1,000). The decision is fixed by the kind page. The send button names the decision; "Cancel". | L | UX §2.2, §6.3; BS B21; PL SA-09 |
| WP17-A68 | SuperAdmin (SA2) | SA-09d `deferral_approve` of C, tab 2 (§3 D-3) | Keep today + 7; give a reason; send. | 303 to the design's receipt host; receipt "Deferral decision recorded"; Current: "Approved: review on [today + 7]". A fresh read shows the application revision advanced. Y's notices +1 (`deferral`). OP-04 of C shows the `deferral_active` blocker (observe WP-07). | L | BS B21 |
| WP17-A69 | SuperAdmin (SA1), tab 1 | SA-09d `deferral_decline` of C, opened before D-3 (§3 D-3) | Give a reason; send after SA2's approval. | `stale_revision`: CMP-14 "Deferral: your unsent decision Decline / now Approved, review on [today + 7]"; the reason kept as unsent text; "Another SuperAdmin already decided this deferral."; nothing recorded (deferrals and notices delta 0). | L | UX §3.3; M-09 class |
| WP17-A70 | SuperAdmin (SA2) | SA-09d `deferral_extend` of C after D-3 (§3 D-5) | Review date today + 14; reason; send. | Only the extend page applies to an approved deferral (approve and decline answer with the state and no form). Accepted: Current "Approved: review on [today + 14]"; Y's notices +1 with the new date; OP-02 shows the new date. SA-08s of the deferral (observe WP-14) shows the recorded fields only (review date, extension, reason, actor, time). | L | BS B21; K-14 |
| WP17-A71 | Test (`deferral-pages`, BFF) | SA-09d refusals and states | A review date of today; approve after the proposed date passed with the field left as prefilled; no decision; a reason of 9 characters; an unknown deferral id; a declined or ended deferral; an application withdrawn after the proposal; a support view. | Today: `date_invalid` at the review date ("Choose a review date after today."). Passed: the same at the prefilled date. A hand-made post without a decision: refused at form level, no command. 9 characters: at the reason. Unknown: not-found. Declined or ended: no form, the state in words. Withdrawn meanwhile: Current shows the outcome and the line "This application has an outcome: [outcome]. TravelMudra still records a decision; if you approve, the travel agent gets a deferral notice." (§6 Q-12); the page does not block what Core accepts. Support view: 409. Each refusal records nothing. | T | §0.5; WP-07 D-W07-16 |
| WP17-A72 | Test (BFF, HTTP) | SA-09d handler | A decision of 21 characters; a review date of 11 characters; the largest valid reason (1,000 Devanagari characters) over real HTTP. | 21 and 11: refused at the field, kept whole, no `.slice`, no command. The largest reason: accepted (4,096 bytes is too small today). | T | LD-17; WP-16 PM Q-14 |
| WP17-A73 | Test | Deferral words and owner | Every state, the pending answers `deferral_proposed` and `deferral_active`, both audiences. | §0.2 "Words"; the TA never sees the justification, proposer or approver; no "SLA", "overdue" or colour-only marker. | T | BS B10, B21 |

### 2.10 SA-04a Price and timing and SA-09p Propose a price increase (`core.propose_price_increase`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A74 | SuperAdmin (SA1) | SA-04a of B, "Price and timing" (§3 Q-1) | Read. | Rows: quote at submission; price in effect; "Price change waiting for the travel agent's decision: none"; service payment (staff words); estimate; forecast. Link "Propose a price increase" → SA-09p. No form on SA-04a (the carried disclosure goes). | L | CC-04, CC-15; AD-13 |
| WP17-A75 | SuperAdmin (SA1) | SA-09p of B (§3 Q-1) | Read the page. | `h1` "Propose a price increase: [applicant]"; Evidence: quote ₹3,500; price in effect ₹3,500; service payment "Not recorded"; editor state (unassigned). Effect (draft): "The travel agent must accept the new price. Until they decide, ₹3,500 stays the price in effect. If they decline, the price they were told stays." Assigned application (test): also "The travel agent can decide only after the operator returns the application." Paid application (test): also "Adjusting a paid amount and refunds are unavailable until the product owner decides them. Owner: product owner." (§6 Q-02). Cause: "Correction of a mistaken price" only; "Change of service scope" shows as a notice, not a choice (A80). Fields: new price in rupees; reason (10 to 1,000). "Propose the price increase", "Cancel". | L + T | UX §4.3; BS B17, B18, B29; §6 Q-02, Q-03 |
| WP17-A76 | Test | SA-09p amount handling | Send "4000", "4000.50", "4,000", "4000.555", "-1", an empty value, a 25-digit value. | Valid rupee values convert exactly to paise (400000, 400050, and the grouped form as the design allows); a value the BFF cannot convert exactly is refused at the field with the typed value kept; no rounding; no `.slice(0, 24)`; Core's `not_higher` is shown as Core answers. | T | LD-17; WP-06 D-09 |
| WP17-A77 | SuperAdmin (SA1) | SA-09p of B (§3 Q-1) | (1) Send ₹3,500 with a valid reason. (2) Send ₹4,000 with the reason "short". | (1) `not_higher` at the new price: "Give a price higher than the price in effect, ₹3,500." (2) Refused at the reason ("Give a reason of at least 10 characters (up to 1,000)."). Values kept; price records delta 0. | L | §0.5 |
| WP17-A78 | SuperAdmin (SA1); harness | SA-09p of B (§3 Q-1) | Send ₹4,000 with a valid reason. Harness: resend the same `_op`. | 303; receipt "Request recorded" (the summary has only the application id); Current: "Price in effect: ₹3,500"; "A price change is waiting for the travel agent's decision". The proposed amount does not show on staff pages after the send (the staff read returns only the record id: "Partly met", §6 Q-06); SA-08s of the application shows the recorded fact. Y's notices +1 (`price_change`, needs acknowledgement). One record after the resend. | L | BS B17; K-14 |
| WP17-A79 | SuperAdmin (SA1); harness | SA-09p of B with the open change (§3 Q-2) | GET SA-09p. Harness raw: the Q-1 content with a new key. | GET: no form; "A price change is already waiting for the travel agent's decision." Raw: `conflict_duplicate` / `price_increase_open`; nothing recorded. | L | WP-09 G-05; §0.5 |
| WP17-A80 | Test; harness | `material_scope_change` | Render SA-09p; harness raw: post `cause=material_scope_change`. | No page offers the choice. The notice (draft): "Proposing a price increase for a change of service scope is unavailable in this release: the request cannot name the applied correction. Owner: engineering." The raw post: `input_invalid` at `correctionId` (`correction_not_applied`), nothing recorded. Recorded "Unmet: no request can name the applied correction (§6 Q-03)". | T | WP-07 D-W07-16; contract `core.propose_price_increase` |
| WP17-A81 | Test | SA-09p refusals and states | `application_not_submitted` (a draft); `outcome_already_recorded`; `stale_revision`; a support view; the largest valid reason (1,000 Devanagari characters) over real HTTP. | On GET for a draft or an application with an outcome: the blocker and no form. Stale: CMP-14. Support view: 409. The largest reason: accepted (4,096 bytes is too small today). Nothing recorded on each refusal. | T | §0.5; LD-17 |
| WP17-A82 | SuperAdmin (SA1) | SA-04a of B after Q-3 (§3 Q-4) | Read. | "Price in effect: ₹4,000"; "Price change waiting …: none"; quote ₹3,500 unchanged. No amount due. | L | BS B17 |

### 2.11 SA-04a Ending the case and SA-09w Record an operational withdrawal request (`core.record_operational_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A83 | SuperAdmin (SA1) | SA-04a of D, "Ending the case" (§3 W-5) | Read. | Link "Record an operational withdrawal request" → SA-09w. Under possible filing (test): CMP-10 first and the link "Record the operational request only" (WP-11 carried rule). The generic cancellation boundary: "Cancelling an application entered in error is unavailable until the product owner decides it. Owner: product owner." with no control. | L + T | PL §5.4 SA-04; BS B24, B44; WP-11 §1.5 |
| WP17-A84 | SuperAdmin (SA1) | SA-09w of D (§3 W-5) | Read the page. | `h1` "Record an operational withdrawal request: [applicant]"; Current: stage, outcome, payment, external acts, assignment; Effect as A57 with "operational request"; "This is a withdrawal request, not a cancellation."; fields: reference (required, up to 120); reason (10 to 1,000). "Record the request", "Cancel". | L | BS B24, B44; PL SA-09 |
| WP17-A85 | SuperAdmin (SA1) | SA-09w of D (§3 W-5) | (1) Send an empty reference. (2) Send the reason "short". | Each refused at its field; values kept; nothing recorded. | L | §0.5 |
| WP17-A86 | SuperAdmin (SA1); harness | SA-09w of D (§3 W-5) | Give `SYN-W17-[stamp]-OPS-D` and a reason; send. Harness: resend. | Receipt per §0.2 with the recorded result (branch); Current facts as A58; Y's notices +1; TA-07 of D shows the withdrawal row. After the receipt, staff pages show the outcome only; the refused record shows through SA-08s of the withdrawal ("Partly met", §6 Q-08). One record after the resend. | L | BS B24 |
| WP17-A87 | Test | SA-09w refusals and possible filing | `application_not_open`; `outcome_already_recorded`; `protection_mark_active`; `stale_revision`; an act `filing_unknown`. | Each eligibility refusal records nothing; stale: CMP-14; possible filing: accepted with `result: refused` / `filing_possibly_occurred` and the receipt as A59. | T | §0.5; BS B23 |
| WP17-A88 | Test (BFF, HTTP) | SA-09w handler | A reference of 121 characters; the largest valid reason (1,000 Devanagari characters) over real HTTP. | 121: refused at the field, kept whole, no command. The largest reason: accepted (4,096 bytes is too small today). | T | LD-17 |

### 2.12 SA-04g Group end (SuperAdmin) and V19

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A89 | SuperAdmin (SA1) | SA-04g of G2 before the date change (§3 V19-1) | Read the page. | `h1` "Group end: [group]"; "Read at"; the group's travel dates and state; "Today in India: [date]"; from `clockHealthy` the line "The clock check passes: date checks can run." (or the paused line of A93). The B25 rule as text. One row per application (name linking SA-04a): A, B, D, E, F: "Stays open: the travel return date [date] has not passed"; H: the same and "Service payment is recorded as received". No promise that an application "will end" on a date. | L | BS B25; `core.admin_group` |
| WP17-A90 | SuperAdmin (SA1) | SA-04g of G2 after V19-2, before the date check (§3 V19-3) | Read. | A, B, D, E, F: "Eligible: ends with the group at TravelMudra's next date check" (no interval stated). H: "Stays open: service payment is recorded as received." No control on the page. | L | BS B25; WP-01 Q-13 |
| WP17-A91 | SuperAdmin (SA1) | SA-04g of G2 after the date check (§3 V19-4) | Read. Open SA-04a of E. | A, B, D, E, F: "No longer open" with the link to SA-04a; SA-04a of E: lifecycle "Ended with its group" and its meaning line (the group-end read returns no lifecycle: "Partly met", §6 Q-09). H unchanged. Group state "Open". | L | V19; §6 Q-09 |
| WP17-A92 | SuperAdmin (SA1) | SA-04g of G1 (§3 V19-6) | Read. | C: "Stays open:" with every reason Core returns: "The travel return date [date] has not passed"; "Service payment is recorded as received"; "An operator was assigned". A withdrawal outcome (W-4) adds no reason and removes none. The row shows all reasons, not only the first. | L | BS B25 |
| WP17-A93 | Test (`group-end-pages`) | SA-04g words and states | Every reason code alone and together; `money_outstanding` with AM-W16-05's sentence; an unknown code; `clockHealthy` false; a group closed (`ordinary`, `group_end`); 500 items (the cap); the read unavailable; a support view. | Each code has its sentence: `filing_possibly_occurred` "A filing may have happened."; `original_held` "An original is held."; `custody_evidence_missing` "Where an original is, is not known."; `delivery_pending` "A delivery is pending or uncertain."; `money_outstanding` "Money is outstanding on this application (an open payment follow-up item, an unused reservation, a government fee paid by TravelMudra and not recovered, or a fee payment whose result is unknown)." (STOP-W16-06: which one applies is not on the read); `protection_mark_active` "A filing-protection mark is active."; `operator_work_authorized` "An operator was assigned."; unknown: "Unrecognised: [code]". Clock: "Group end is paused while TravelMudra's clock check fails. Nothing ends with a group until it passes. Owner: engineering." Closed: the closed kind in words. Cap: "This page lists the first 500 applications of this group." S7 on an unavailable read; 409 in a support view. | T | BS B25, B33; AM-W16-05; K-05 |
| WP17-A94 | Test (Core) | V19 Core behaviour | Run `test/core/completion-group-end.test.ts`. | Pass: "keeps an unpaid application without TravelMudra work open until its group ends"; "ends nothing on the return date and ends eligible applications just after midnight India time; never during clock skew"; "ends only eligible applications page by page, and closes the group only when nothing is open"; "never ends an application whose group still has intake work open; then closes the group with the last application". | T | BS B25; V19 |
| WP17-A95 | SuperAdmin (SA1); test | SA-04g, SA-04a, TA-05 | Look for group-end and closure controls. Test: the route inventory. | No "End now", "Close group", "Force", "Override", "Reopen" or "Restore" control on any staff page; `core.close_group` has no staff route (a travel-agent command only); no page reverses "Ended with its group". | L + T | BS B21, B25; PL §11.1 forbidden labels |

### 2.13 Command results, access and shell on WP-17 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A96 | Travel agent; operator; SuperAdmin | Every WP-17 page | Read the shell. | Environment label; "[TEST]"; rail: TA pages under "Groups" or "Applications" as their entry; OP-02 task pages under "My work"; SA-09d under "Work queues" when opened from SA-02d, else "Applications & groups"; SA-09p, SA-09w, SA-04g under "Applications & groups"; the design's breadcrumbs; one `h1`; "Read at". | L | PL §2.2; LD-08 |
| WP17-A97 | Test | Receipt naming (§0.2 table) | Every result shape each instance can show at a receipt address. | Named only as the table states; otherwise "Request recorded". An edited address never shows another command's title (for example a deferral proposal shown as "Deferral ended", or a group creation shown as a closure). | T | WP-03 C-03, code review R-03; WP-13 L-05 |
| WP17-A98 | Test | Receipt addresses | Open each WP-17 receipt location without a key, with `?done=…`, with another person's key, with a refused key. | No receipt from the address; locations carry `&op=`; another person's key opens unchecked with current authorized facts; a refused key: "Nothing is recorded for request [reference] so far". | T | WP-01 A-04; WP-12 J-09 |
| WP17-A99 | Test | Text map of every code in §0.5 and every assessment code | Unit test against Core's vocabulary. | Each has its sentence in both audiences where it can reach them; unknown: category text and "Reference code: [code]". | T | §0.5 |
| WP17-A100 | Any (live refusals A02, A41, A48, A57, A77, A85) | Re-rendered task pages | Read. | CMP-07 at the field when Core names one; owner or route where one exists; no code alone, "Something went wrong" or "Invalid data"; the refusal re-renders its own task page at the POST address with every value kept; focus moves to the error summary. | L | PL §1.1; CR-01; AC-08 |
| WP17-A101 | Travel agent; operator; SuperAdmin | TA-05, TA-07, OP-02, SA-04a, SA-02d | Look for controls of other roles. | TA pages: no operator or SuperAdmin control. OP pages: no SuperAdmin decision (approve deferral, price increase, operational withdrawal). SA pages: no operator readiness, filing, release or forecast control ("The assigned operator makes this judgment", BS B18). | L | BS B18; UX §2.3 |
| WP17-A102 | Test (`wp17-host-pages`, route inventory) | Every page | Render; collect form actions. | One host page per command use: the only form posting T34 is on TA-07w; T35 on TA-07d; T48 on TA-07c; T08 on TA-05c; O42 on OP-02f; O24 on OP-02d; O43 on OP-02e; O23 on OP-02w; D24 on SA-09d; D101 on SA-09p; D22 on SA-09w; O60 and D128 in the recheck sections of OP-02 and SA-04a. TA-05 and TA-07 hold no WP-17 form; OP-02 and SA-04a hold only the recheck form. Every form action is a registered route. | T | CC-12 to CC-20 |
| WP17-A103 | Test | Carried-form tests | Run the carried-form tests of WP-03 (A106), WP-07 (A37), WP-11 (SA-04a) and WP-06 (A110). | Their WP-17 entries leave: the tests assert that the old disclosures are gone from TA-07, TA-05, OP-02 and SA-04a; the lists hold no other change. | T | LD-02; WP03-A106; WP07-A37 |
| WP17-A104 | Travel agent (Y, `syn-ta-2`); operator (OP2); harness | Isolation (§3 X-1) | `syn-ta-2` opens TA-04 and TA-06. OP2 opens OP-02 and OP-02f, OP-02d, OP-02e, OP-02w of C. Y opens SA-04g, SA-09d and OP-02 addresses. Harness: OP2 posts the forecast of C. | `syn-ta-2`: none of Y's groups or applications (delta 0). OP2 and Y: the uniform not-found page; no fact disclosed; the post records nothing. | L | BS B10 |
| WP17-A105 | SuperAdmin (SA1) | The receipt address of D-3 opened by SA1 after D-6 (§3 X-1) | Open. | Unchecked receipt of another person's operation: "Deferral decision recorded" with Current "Deferral: ended". No instruction to act. | L | WP-12 J-08, J-09 |
| WP17-A106 | Test | Receipts and statuses after later events | Open each WP-17 receipt after a later withdrawal, outcome, extension and group end. | No receipt, status read or page instructs anyone to perform an act ("file", "stop the filing", "pay", "tell the applicant"); historical receipts keep their recorded facts; later facts are "Current". | T | WP-07 F-33 |
| WP17-A107 | SuperAdmin (SA1) | SA-08s of the deferral of C, of the withdrawal of C and of G2 (§3 X-1; observe WP-14) | Read. | Only fields recorded on each subject: `core.deferral_proposed` (proposed review date), `core.deferral_approved` (review date, extension), `core.deferral_ended`; `core.withdrawal_requested` (requester kind, evidence), `core.withdrawal_accepted` or `core.withdrawal_refused` (code, assessment); `core.group_travel_dates_edited` (before, after, open applications); each with recorded time, actor and role. The refused sends of the run left no fact. | L | BS B33; K-14 |
| WP17-A108 | Any | Every WP-17 page | Read all text. | No forbidden label (PL §11.1: "Override", "Force complete", "Cancel import", "Pay now", "Approved" or "Done" as an overall status); "IST" on every time; units on every count; "Synthetic" (CR-08); no package or record id; no configuration value (the date-check interval, the sweep page size). | L | PL §11.1; CR-06 to CR-08 |
| WP17-A109 | Test | Money rendering on WP-17 pages | Render 350000, 400000, 400050 and 0 paise. | Every amount through `money()`: currency in text, Indian grouping, no floating value, tabular figures. | T | CMP-16 |
| WP17-A110 | Test | Replay matrix per command (13) | (1) Identical replay. (2) Same `_op`, changed content. (3) Back after the receipt. (4) Rejected-form refresh. (5) Lost acknowledgement. (6) Business duplicate with a new key. (7) Raw stale envelope. | (1) The original result. (2) `conflict_operation_key`; values kept. (3) A fresh form with current facts, or the closed state. (4) The corrected send recorded once. (5) C4; the status page links the host. (6) Core's own answer: `deferral_active`, `price_increase_open`, `group_closed`, `outcome_already_recorded` (an accepted withdrawal), or a new record where Core has no duplicate guard (a forecast; a withdrawal request after a refused one; a recheck that is still pending). (7) `stale_revision` (CMP-14) where Core checks a revision; the forecast, the recheck and the deferral decision and end, which carry none, answer by state. | T | BS B35; WP-08 Q-W08-15 |
| WP17-A111 | Test (BFF sweep) | Every WP-17 handler | Search the handlers; post each field at its maximum and maximum + 1. | No `.slice`, truncation or dropped field; over-limit input refused at its field with the value kept whole; the handler never sends Core less than the user chose. | T | LD-17 |
| WP17-A112 | Test (HTTP) | The largest valid form of each WP-17 page | Post each with Devanagari text at the maximum lengths over real HTTP: TA-07w note 2,000; OP-02d justification 2,000; OP-02e note 1,000; OP-02w note 2,000 and reference 120; SA-09d, SA-09p, SA-09w reasons 1,000; OP-02f note 500. | Each body fits its route limit and reaches Core; a refusal for size is a failure (§0.1 "BFF today"; §6 Q-15). | T | LD-17; WP-16 PM Q-14 |
| WP17-A113 | Test (HTTP) | TA-07 (optional notices read), OP-02, SA-04a, SA-04g, every task page | (1) The page's required read unavailable. (2) The optional notices read unavailable. (3) Access revoked between two reads. | (1) S7, never an empty page or a form without its facts. (2) TA-07 shows "Notices for this application are unavailable now." in the timing and deferral rows; the rest renders. (3) The shell; no earlier facts (LD-14). | T | LD-14; D7 |
| WP17-A114 | Test | Support views | A support view of Y on TA-05, TA-07 and the TA task pages; of OP1 on OP-02 and its task pages. | Facts only; no withdraw, price, re-apply, close, forecast, deferral or withdrawal form; `/admin` pages 409. | T | SH-R09; WP-03 code review R-05 |
| WP17-A115 | Travel agent; operator; SuperAdmin | Task pages with text fields | Inspect browser storage; read the headers. | No note, reason, justification, reference or amount in browser storage; `no-store`. | L+T | SH-R12 |

### 2.14 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A116 | Keyboard-only user | TA-05c (G-2), TA-07w (W-1), TA-07d (Q-3), OP-02f (F-1), OP-02d (D-1), SA-09d (D-3), SA-09p (Q-1) at 1440 px; TA-07w and TA-07d at 390 px | Use the keyboard only. | The close confirmation, radio groups, date fields, text areas, send and cancel work with Tab, Shift+Tab, Enter, Space, arrows and Escape; the confirmation opens and closes by keyboard. | L | AC-01, AC-12 |
| WP17-A117 | Keyboard-only user | Every WP-17 page at 1440, 390 px and 400% | Tab through. | Focus visible (3:1), never hidden. | L | AC-02 |
| WP17-A118 | Phone user | TA-05, TA-07, TA-07w, TA-07d, OP-02f, OP-02d, SA-09d, SA-04g | 320 px; 1280 px at 400%. | One column; identity, reason, owner and next action first; scope and effect before fields; the primary action at the end, never in a fixed bar; no horizontal scroll (SA-04g rows as cards). | L | AC-04, AC-21 |
| WP17-A119 | Any | TA-07d, SA-09d, SA-09p, OP-02f | Inspect. | The TA-07d decision and the OP-02f basis radio groups are `fieldset` with `legend`, none preselected, the choice kept after a refusal; every input labelled; required stated; date inputs say "Dates are in India time (IST)". | L | AC-05, AC-15 |
| WP17-A120 | Any | States, reasons, withdrawal results, deferral states, "Ended with its group" | Greyscale. | Text and icon for every mark; no colour-only state. | L | AC-06 |
| WP17-A121 | Any | TA-07w, OP-02f, OP-02d, SA-09p | Send with an error. | Focus to the error summary; links to fields; values kept. | L | AC-08 |
| WP17-A122 | Screen-reader user | Receipts; CMP-14 comparisons; boundary notices; SA-04g reasons | Read with a screen reader. | Receipts polite without moving focus; notices are notes, not live regions or errors; the comparison repeats field labels; each SA-04g row reads the applicant, then the result, then each reason. | L | AC-09, AC-13 |
| WP17-A123 | Screen-reader user | Each unavailable action (A13 refused preview, A18 outcome recorded, A27 assigned, A51 open deferral, A79 open change, A80 scope change) | Reach the notice. | Reason, owner and route in reading order; no disabled control without its reason. | L + T | AC-13; UX §7.4 |
| WP17-A124 | Phone user | Every WP-17 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions at least 44 × 44 px. | L+T | AC-10 |
| WP17-A125 | — | Every WP-17 page | Contrast. | Text 4.5:1; non-text and focus 3:1. | L+T | AC-11 |
| WP17-A126 | Any | Long text; reduced motion | A 2,000-character justification; a 400-character applicant name; reduced motion. | Wraps; the full text reachable; no transition with reduced motion. | L | AC-14, AC-20 |
| WP17-A127 | Any | Every WP-17 page | Inspect landmarks and headings. | Landmarks; one `h1`; logical heading order. | L | AC-03 |
| WP17-A128 | Travel agent and SuperAdmin (observation) | TA-07 of A after W-1; TA-05 of G2 and TA-07 of E after V19-4; TA-07 of B after Q-3; SA-04g of G2 after V19-3 | Ask Y "Is application A cancelled, completed, or still in your group?", "What happened to E, and is it a visa result?", "What price applies to B, and did you have to pay more?". Ask SA1 "Why does H not end with the group?" and "When do A, B, D, E and F end?". | The run record reports the answers and the sample size; a wrong answer is a finding. | L | AC-24, AC-26; V24 |

### 2.15 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP17-A129 | Travel agent | TA-05c of G1 with the close refusal (G-1) | L | UX §7.5; AC-01 to AC-28 |
| WP17-A130 | Travel agent | TA-05 of G3 closed, with the receipt (G-2) | L | same |
| WP17-A131 | Travel agent | TA-05 of G2 with ended rows (V19-4) | L | same |
| WP17-A132 | Travel agent | TA-07w of A (W-1) | L | same |
| WP17-A133 | Travel agent | TA-07 of A withdrawn, with the receipt (W-1) | L | same |
| WP17-A134 | Travel agent | TA-07d of B (Q-2) | L | same |
| WP17-A135 | Travel agent | TA-07d of B with CMP-14 (Q-3 tab 1) | L | same |
| WP17-A136 | Travel agent | TA-07 of C with the forecast and the deferral rows (D-4) | L | same |
| WP17-A137 | Travel agent | TA-07 of E ended with its group (V19-5) | L | same |
| WP17-A138 | Travel agent | TA-13b of G2 with the past-date consequence line (V19-2, per §6 Q-01) | L | same |
| WP17-A139 | Operator | OP-02f with the error summary (F-1) | L | same |
| WP17-A140 | Operator | OP-02 of C with the forecast receipt (F-1) | L | same |
| WP17-A141 | Operator | OP-02d with the error summary (D-1) | L | same |
| WP17-A142 | Operator | OP-02e (D-6) | L | same |
| WP17-A143 | Operator | OP-02w with the error summary (W-4) | L | same |
| WP17-A144 | SuperAdmin | SA-02d with the proposed row (D-3) | L | same |
| WP17-A145 | SuperAdmin | SA-09d form (D-3 tab 2) | L | same |
| WP17-A146 | SuperAdmin | SA-09d with CMP-14 (D-3 tab 1) | L | same |
| WP17-A147 | SuperAdmin | SA-09p form and its `not_higher` refusal (Q-1) | L | same |
| WP17-A148 | SuperAdmin | SA-09w form (W-5) | L | same |
| WP17-A149 | SuperAdmin | SA-04g of G2 before and after the date check (V19-3, V19-4) | L | same |
| WP17-A150 | SuperAdmin | Operation status page: accepted (D-3) and "Nothing is recorded" for a refused key (D-2) | L | same |
| WP17-A151 | Gallery | TA-07c with a released correction and its conflict; TA-07d assigned and paid; OP-02 recheck states; SA-04g every reason, clock unhealthy and the cap; TA-05 closed after the return date | L (gallery) | same |

## 3. Proof scenario V19 (group-end part) and the WP-17 journeys

V19 (UX §12): "Completed processing can retain financial/disclosure follow-up; group-end date closure never consumes
unknown filing, held originals, pending delivery or outstanding money." Authority B25, B29. WP-17 proves the
group-end part: which applications end with the group after the return date and which stay open, with their reasons,
and that the pages never present the end as success. WP-16 proves the financial follow-up part (§3 of
`WP-16-acceptance.md`); WP-14 the disclosure part (WP14-A13, A38). Completion runs only in tests (LD-04).

One ordered recipe. "Setup" steps use pages of other packages; "Observe" steps check items other packages own. SA1 =
`superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`, OP2 = `operator-2`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-02d, SA-01; OP1: OP-01; `syn-ta-2`: TA-04, TA-06 | Read. | Baselines of §0.4 recorded. | — | L |
| Setup 0 | SA1: SA-06 | Create and activate Y (or record the fallback). | Y signs in. | — | L |
| Setup 1 | Y: TA-13a, TA-09, TA-08 | Create G1, G2, G3. Create drafts A and E in G2. Submit B, D, F, H in G2 and C in G1. | Three groups; two drafts; five submissions. | — | L |
| Branch | Y: TA-07 of F | Read the withdrawal preview. | "Accepted" or "Refused: undeclared cut-off" recorded as the run's branch. | A13 | L |
| Setup 2 | SA1: SA-07a, SA-03a; OP1: OP-02 | "Payment received" for C and H; assign C to OP1; OP1 starts work on C. | C assigned and worked; H paid. | — | L |
| G-1 | Y: TA-05 of G1 → TA-05c | Read "Closing the group"; follow the link; send "Close the group". | Rule text and Core's counts; TA-05c anatomy; refused with every condition; nothing recorded. | A01, A02, A129 | L |
| G-2 | Y: TA-05 of G3 → TA-05c; harness | Close; resend the same `_op`; Back; raw envelope with the earlier revision. | Neutral receipt, Current "Closed"; the same receipt; no form; CMP-14. | A03, A04 (1) to (3), A130 | L |
| W-1 | Y: TA-07 of A → TA-07w; harness | Read; send with a note; resend the same `_op`. | Receipt "Withdrawal recorded"; Outcome "Withdrawn"; Stage "Draft"; one record; notice +1. | A13 to A15, A38, A132, A133 | L |
| W-2 | Y: TA-07w of A; harness | GET; send the saved W-1 envelope with a new key. | No form; `outcome_already_recorded`; nothing recorded. | A18 | L |
| Q-1 | SA1: SA-04a of B → SA-09p; harness | Read; send ₹3,500; send the reason "short"; send ₹4,000 with a reason; resend. | `not_higher`; reason refused; neutral receipt with the open change; one record; Y's notice +1. | A74, A75, A77, A78, A147 | L |
| Q-2 | SA1: SA-09p of B; harness; Y: TA-07 of B → TA-07d | GET SA-09p; raw duplicate; Y reads TA-07 and TA-07d. | No form; `price_increase_open`; TA-07 price rows; TA-07d anatomy. | A22, A23, A79, A134 | L |
| Q-3 | Y: two tabs of TA-07d of B; harness; TA-10 | Tab 1 opens; tab 2 accepts; harness resends tab 2; Back; tab 1 declines; read TA-10. | Receipt "Price decision recorded: Accepted"; the same on resend; decided state on Back; CMP-14 on tab 1; the notice still needs acknowledgement. | A24 to A26, A30, A31, A135 | L |
| Q-4 | SA1: SA-04a of B; Y: TA-11 (observe WP-16) | Read. | "Price in effect: ₹4,000"; quote ₹3,500; no amount due. | A82 | L |
| F-1 | OP1: OP-02 of C → OP-02f; harness | Read; send an end before the start; send the valid window; resend; Back. | `forecast_window_invalid`; "Forecast recorded"; one forecast; Y's timing notice +1. | A39 to A42, A139, A140 | L |
| F-2 | Y: TA-07 of C; TA-01 | Read. | Estimate unchanged; forecast separate; the timing notice. | A32 | L |
| D-1 | OP1: OP-02 of C → OP-02d; harness | Read; send today; send 19 characters; send valid (today + 7); resend. | `date_invalid`; justification refused; neutral receipt "proposed"; one deferral. | A46 to A49, A141 | L |
| D-2 | OP1: OP-02d; harness; OP-01; status pages | GET; raw duplicate with a new key; read OP-01; open the status page of the refused key and of D-1's key. | No form; `deferral_active`; OP-01 as Core's answer; status pages. | A50, A51, A150 | L |
| D-3 | SA1: SA-02d, SA-01, SA-09d `deferral_decline` tab 1; SA2: SA-09d `deferral_approve` tab 2 | SA1 reads and opens tab 1; SA2 approves (today + 7); SA1 declines in tab 1. | SA-02d and SA-01 +1; receipt "Deferral decision recorded"; CMP-14 for SA1; nothing recorded by SA1. | A66 to A69, A144 to A146 | L |
| D-4 | OP1: OP-01, OP-02, OP-04 (observe); Y: TA-07 of C, TA-10 | Read. | C in "Waiting"; OP-02 "Approved: review on [date]"; `deferral_active` blocker; TA-07 next step; the deferral notice. | A33, A46, A50, A136 | L |
| D-5 | SA2: SA-09d `deferral_extend` of C | Extend to today + 14. | Only the extend page has a form; new review date; Y's notice +1. | A70, A33 | L |
| D-6 | OP1: OP-02e; harness | Read; send a note; resend; GET; saved envelope with a new key. | Neutral receipt "ended"; the same on resend; no form; `stale_revision`. | A53, A54, A142 | L |
| R-1 | OP1: OP-02 of C; SA1: SA-04a of C; harness | Read; raw recheck posts. | No recheck section; `travel_date_recheck_not_pending`; nothing recorded. | A61 | L |
| W-3 | Y: TA-07 of F → TA-07w | Read; send. | Receipt per the branch (accepted or refused assessment). | A13, A14, A16 | L |
| W-4 | OP1: OP-02 of C → OP-02w; harness | Read; send an empty reference; send `SYN-W17-[stamp]-WDR-C`; resend. | Field refusal; receipt per the branch; facts unchanged except the outcome when accepted. | A56 to A58, A143 | L |
| W-5 | SA1: SA-04a of D → SA-09w; harness | Read; empty reference; reason "short"; valid send; resend. | Field refusals; receipt per the branch. | A83 to A86, A148 | L |
| V19-1 | SA1: SA-04g of G2 | Read. | Every row "Stays open: the travel return date [date] has not passed"; H also "Service payment is recorded as received". | A89 | L |
| V19-2 | Setup (labelled): Y: TA-13b of G2; Y: TA-05 | Change G2 to start today − 3, return today − 1 (§6 Q-01, Q-14). If TA-13b's date controls refuse a past date (the design adds `min`), the harness posts the TA-13b form fields raw; the run record says so. Read TA-05. | WP-03 receipt; rows "Being checked" until the recheck records; the past-date line per §6 Q-01. | A11, A65, A138 | L |
| V19-3 | SA1: SA-04g of G2 | Read before the date check. If the date check already ran, record V19-3 as not observable; A90 then runs in the gallery. | A, B, D, E, F eligible; H stays open with its reason; no control. | A90, A149 | L |
| V19-4 | Wait; SA1: SA-04g of G2, SA-04a of E; Y: TA-05 of G2, TA-06, TA-04 | Wait for the next date check (at most the recorded interval); read. | A, B, D, E, F "Ended with its group"; H open; G2 "Open"; no success words. | A06, A12, A91, A131, A149 | L |
| V19-5 | Y: TA-07 of E and F; TA-05 of G2 → TA-05c | Read; send "Close the group". | Ended state with history; refused `group_has_open_applications`. | A07, A37, A137 | L |
| V19-6 | SA1: SA-04g of G1 | Read. | C stays open with every reason Core returns. | A92 | L |
| X-1 | `syn-ta-2`; OP2; Y; SA1; harness | Isolation reads and posts; SA1 opens D-3's receipt address; SA-08s of C's deferral and withdrawal and of G2. | Delta 0; not-found; nothing recorded; unchecked historical receipt; recorded fields only. | A104, A105, A107 | L |
| T-G | Test | Closure refusals, closed-after-return-date group, states, the lost acknowledgement and the two-tab closure. | As the items. | A04 (4), (5), A05, A08, A10 | T |
| T-W | Test | Withdrawal states, race, refusals, BFF, words; the operator's and SuperAdmin's paths under possible filing. | As the items. | A16, A17, A18, A19 to A21, A59, A60, A87, A88 | T |
| T-Q | Test | Assigned and paid cases, refusals, history kinds, amount handling, the scope-change cause. | As the items. | A27 to A30, A75, A76, A80, A81 | T |
| T-K | Test | Held corrections. | As the items. | A34 to A36 | T |
| T-F | Test | Forecast BFF, two tabs, states. | As the items. | A43 to A45 | T |
| T-D | Test | Deferral hard stops, review due, SA-09d refusals and limits, words. | As the items. | A52, A54, A55, A71 to A73 | T |
| T-R | Test | Recheck states, results, access, TA view. | As the items. | A62 to A65 | T |
| T-V19 | Test | Group-end words and states; Core V19 tests; no controls. | As the items. | A93 to A95 | T |
| T-X | Test | A09, A11, A12, A13, A97 to A99, A102, A103, A106, A109 to A115, A123 to A125. | As the items. | as listed | T |
| X-2 | axe | Every page and state visited above. | No serious or critical violation at 1440 and 390 px. | A129 to A150 | L |
| X-3 | axe (gallery) | A151. | As X-2. | A151 | L |
| X-4 | Keyboard-only, screen-reader and phone users; Y; SA1 | During G-2, W-1, Q-2, Q-3, F-1, D-1, D-3, Q-1, V19-3 and V19-4: the accessibility checks, the shell, copy and refusal text, the role checks, the observation questions. | As the items. | A96, A100, A101, A108, A116 to A128 | L |

Proof split. V19 (group-end part) passes when V19-1 to V19-6 pass on `lane-ui` at the integrated WP-17 commit and
T-V19 passes as named tests; with WP-16's V19 (financial follow-up part) and WP-14's disclosure part, V19 is done. If
the date check does not run within the run's window, V19-4 and V19-5 are "Deferred" for that run (the run record
names the interval and the wait) and T-V19 carries the end itself; the run is repeated before sign-off. The journeys
of withdrawal, deferral, price and timing pass when their steps and test steps pass. Recorded, not failed: A80
"Unmet"; A36 "Unmet"; the "Partly met" items of §0.2 "Pass rule". Boundaries stated, not crossed: refunds and paid
amount adjustment (B29, B43), generic cancellation (B44), completion (LD-04). The run record names the `lane-ui` ref,
the run tag, the travel agent, the groups, the withdrawal branch, each test, the identifiers (internal record only)
and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| TA-13b form, receipt, refusals, stale comparison and replay of `core.edit_travel_dates` | WP-03 (WP03-A18 to A22) |
| TA-05 context band, sections, rows; TA-04 list words | WP-03 (WP03-A23, A30 to A33) |
| V19: completed processing keeps financial follow-up | WP-16 (§3 V19 steps; WP16-A18, A24, A32, A110) |
| V19: disclosure follow-up after completion | WP-14 (WP14-A13, A38) |
| "Ask your operator for a return" (`purpose=withdraw`) | WP-09 (WP09-A08) |
| OP-01 views ("Waiting" for an active deferral; reviews due) | WP-07 (WP07-A165; F-07) |
| OP-02 "Ending the case" under possible filing (D-W07-15) on the old host | WP-07 (WP07-A66); kept on OP-02w here (A56, A59) |
| SA-02d list and SA-01 group 6 | WP-06 (WP06-A20; design §2.2.4, §2.1) |
| TA notices and their acknowledgement (TA-10); TA-01 travel-date notices | WP-08 (Q-W08-02); WP-03 |
| SA-04a frame, tabs and the other decisions | WP-11 |
| Staff re-application of held corrections | STOP-W11-03, P-17 item 3 (WP11-A50) |
| The audit pages | WP-14 (SA-08s); used in A107 |
| The price in effect on TA-11 | WP-16 (TA-11); observed in Q-4 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-17 page:

- A control that ends an application with its group, closes a group as a SuperAdmin or operator, reopens a group,
  reverses "Ended with its group" or a withdrawal, or forces completion (BS B21, B24, B25; PL §11.1).
- A generic cancellation control (BS B44): a notice only (A83).
- A refund, paid-amount adjustment or credit control; an amount "due", a price difference or a total (BS B17, B29,
  B43; Q-W16-01).
- A choice that Core always refuses: the price cause "Change of service scope" as a selectable value (A80).
- A withdrawal form for an assigned application that is not returned (the TA-07p route only), or one that presents
  Core's preview as the final result (A13, A17).
- A deferral, timing or price word that invents an SLA, a deadline or an "overdue" state; a page-side "threatened"
  or "due" computed from dates (A32, A55).
- "Completed", "success", "done" or "closed" for an application that ended with its group or was withdrawn (A06, A12,
  A37, A38).
- A forecast that replaces the original estimate (A32, A42).
- A WP-17 form on TA-05 or TA-07, or on OP-02 or SA-04a other than the recheck; a decision form on SA-02d (A102).
- A result from the page address; an accepted time; a named receipt that the operation does not establish (A97, A98).
- A truncated field or a dropped value (LD-17); earlier facts after an access change (LD-14).
- A configuration value (the date-check interval, the sweep page size) in copy (A108).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- The price cause "Change of service scope": "Unmet: no request can name the applied correction" (A80; §6 Q-03).
- Staff re-application of a held correction: "Unmet: waits for STOP-W11-03 and P-17 item 3" (A36).
- "Partly met": the review date of a deferral on TA-07 without the notices read (A33); the SuperAdmin's reason on
  TA-07d and the proposed amount on staff pages (A23, A78); the forecast basis on any page (A32, A44); the withdrawal
  record on staff pages (A60, A86); the lifecycle on SA-04g (A91).

Deferred in WP-17 (the run record lists each as "Deferred"):

- Held corrections (A34, A35): tests and gallery (a released correction needs an authorized act and non-filing
  evidence outside the approved writes).
- Group-end exclusions other than a recorded payment (filing, originals, delivery, money, protection mark, clock):
  tests and gallery (A93, A94).
- The assigned and the paid price-decision cases (A27, A28), the possible-filing withdrawal paths (A56, A59, A87), the
  recheck answers (A62, A63), the review-due state (A55): tests and gallery.
- V19-4 and V19-5 when the date check does not run within the run's window (§3 proof split).

Not in WP-17: the TA-13b form (WP-03); notice acknowledgement (WP-08); OP-01 views (WP-07); payment and money
follow-up pages (WP-06, WP-16); the audit pages (WP-14); the bulk intake pages and intake-issue dismissal (WP-18).

## 6. Questions for the architect (ranked)

PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max through the architect; P2 is
parked as a note. No question below is P0: each has a page answer that keeps Core's behaviour truthful.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Core accepts travel dates in the past on `core.edit_travel_dates` (only `core.create_group` compares the start with today), and TA-13b sets no minimum date and states no consequence. The next date check then ends every eligible application of the group, which no command reverses. | Y types 2025 instead of 2026 in the return date of a group with three unpaid drafts. Within the date-check interval the three drafts read "Ended with its group"; Y must start new intake. Likelihood: low per edit, certain over many edits. Harm: irreversible end of work. The live V19 recipe (V19-2) uses the same path on purpose. | The design's minimum date on TA-13b lowers the likelihood; a raw post (or a browser without the check) still reaches Core. TA-13b states the consequence of a past return date before the send button (A11). Send Core a behaviour proposal: refuse a return date before today on an edit, or require an explicit confirmation field. Until then, approve V19-2 as a labelled set-up write (Q-14). |
| Q-02 | P1 | Core accepts a price increase and its acceptance on an application whose service payment is "received". BS B17 and B29 keep paid amounts, adjustments and refunds unselected; UI-PLAN TA-07 lists "Unpaid case" as the precondition. | SA1 proposes ₹4,000 on a case paid at ₹3,500; Y accepts; TA-11 shows "Price in effect: ₹4,000" beside "Recorded as received". Y cannot tell whether ₹500 is owed, and nobody can record or refund it. Likelihood: medium (mistaken prices happen after payment). Harm: a money dispute with no product path. | Do not block (Core accepts): SA-09p and TA-07d show the paid fact and the boundary notice (A28, A75); no page computes a difference. Ask Max whether a price increase of a paid application is allowed at all; if not, a Core guard is a behaviour proposal. |
| Q-03 | P1 | The wire contract and binding of `core.propose_price_increase` carry no `correctionId` and no evidence, so the cause `material_scope_change` is refused every time (`correction_not_applied`). | An applied correction changes the service scope; SA1 chooses "Change of service scope"; Core refuses whatever SA1 does. Likelihood: certain for that cause. Harm: renewed TA authority for a scope change (B17) cannot be asked through the product. | SA-09p offers only "Correction of a mistaken price" with a notice for the scope change (A80, "Unmet"). Report a surface defect to the orchestrator (contract and binding, as STOP-W11-03), with the correction chosen from the applied corrections of the application. |
| Q-04 | P2 | A price increase on an assigned case waits for a formal return: Core refuses the travel agent's decision (`awaiting_formal_return`), and the operator owns the next step. | Y reads the notice "The price of the application changed", opens TA-07 and finds no decision form. Likelihood: medium. Harm: delay, confusion. | TA-07 and TA-07d say that the decision waits for the operator's return and link TA-07p (A27); SA-09p warns before the send (A75). Decide whether TA-07p gets a `purpose=price` prefill as WP-09 did for withdrawal. |
| Q-05 | P2 | Core derives the common progress "completed" for `ended_with_group` and "delivery_closure_pending" for an open application with any outcome (a withdrawn application waiting for its group end). UI-PLAN §4.2 requires "Ended with group", never success. | TA-06 shows "Completed" for E, which TravelMudra never processed; A shows "Delivery/closure pending" with no delivery. Likelihood: certain. Harm: low to medium (the TA tells the customer the wrong thing). | Show the lifecycle words "Ended with its group" in the stage or progress column where the lifecycle is `ended_with_group`, and Core's progress only as a labelled secondary fact; for a withdrawn open application show the outcome first (A12, A37, A38). A unit test pins the mapping. A Core change of the derivation is a proposal, not needed for WP-17. |
| Q-06 | P2 | Facts that the TA and staff reads do not return: the deferral's review date on the TA case read (only in the `deferral` notice); the SuperAdmin's reason for a price increase on the TA read; the proposed amount on the staff read. | Y sees "Your operator: review the deferral" without the date; Y decides a price change without its reason; SA1 cannot see the amount after proposing it. Likelihood: certain. Harm: low. | TA-07 reads the notices (optional read, LD-14) for the review date (A33); the reason and the amount are "Partly met" (A23, A78). Kind 1 note: adding them to the case reads removes a client-side join of notices and cases (criterion point 2 demonstrated for the review date; not for the reason and the amount). Parked P2. |
| Q-07 | P2 | No read returns a forecast's basis, note or recording time. | Y sees a later forecast without its reason (UX §4.4 asks for the reason); OP1 cannot see which basis is current. Likelihood: certain. Harm: low. | "Partly met" (A32, A44). Kind 1 note: basis, note, recorder and time on `timing.forecast` (criterion point 2 not demonstrated: no join is removed; it adds a fact). Parked P2. |
| Q-08 | P2 | The staff case read has no withdrawal record and no preview. | OP1 records the applicant's request, receives "Refused: …", and later OP-02 shows no trace of the refused request. Likelihood: certain for refused requests. Harm: low (SA-08s holds it). | "Partly met" (A57, A60, A86); link SA-08s of the withdrawal from the receipt. Kind 1 note (the withdrawal row and preview on the staff read). Parked P2. |
| Q-09 | P2 | `core.admin_group` drops the lifecycle from each item (the internal view has it), so ended and completed applications both read `application_not_open`. | SA1 reads SA-04g of a group and cannot tell which applications ended with the group. Likelihood: certain. Harm: low (SA-04a holds it). | "No longer open" with a link (A91). Contract defect note: carry the lifecycle the view already computes. Parked P2. |
| Q-10 | P2 | `core.record_forecast` has no expected revision. | OP1 records a forecast in tab 1 after tab 2 recorded a newer one; tab 1's becomes current without a comparison. Likelihood: low. Harm: low (history kept). | No page-side guard; OP-02f shows the current forecast at load (A44). Parked P2. |
| Q-11 | P2 | The policy allows a SuperAdmin to record a forecast and to end a deferral, but no admin route exists. | OP1 is suspended during a deferral; nobody can end it until C is reassigned. Likelihood: low. Harm: low (reassignment exists). | No page (LD-07: no route, no command use to host). Parked P2 note. |
| Q-12 | P2 | `core.decide_deferral` does not check that the application is still open. | An operator proposes a deferral; Y withdraws the application; SA2 approves; Y gets a deferral notice for a withdrawn application. Likelihood: low. Harm: low. | SA-09d shows the current outcome and the effect line (A71); the page does not block. Defect note to the orchestrator. Parked P2. |
| Q-13 | P2 | When Core's preview refuses a withdrawal, TA-07 shows a boundary and no form, although Core would record the request with a refused assessment. | Y wants a record that they asked to withdraw while a filing may have happened. Likelihood: low. Harm: low. | Keep the boundary (UI-PLAN TA-07 "Unavailable") with the owner and route (A13); record the deliberate deviation from D-W07-16. The operator's and SuperAdmin's paths keep "record the request only" (F-09). |
| Q-14 | P2 | Proof writes (as Q-W16-06). | The run adds three groups and seven applications; G1 (C) and G2 (H) stay open; G2's dates go into the past; the run waits up to the date-check interval. | Approve the writes of §0.2 "Data hygiene" and V19-2. |
| Q-15 | P2 | Body limits below the largest valid form on seven WP-17 routes (§0.1 "BFF today"). | A 1,000-character Devanagari reason on SA-09d is refused for size. Likelihood: low. Harm: low. | Confirm that `WP-16.md` PM Q-14's fix covers the WP-17 routes; A112 tests each. |
| Q-16 | P2 | The `price_change` notice needs acknowledgement apart from the decision. | After accepting on TA-07d, Y still sees "Needs your acknowledgement" on TA-10 for the same change. Likelihood: certain. Harm: low. | Keep the two facts separate (UX §4.2); TA-07d's receipt links TA-10 (A31). Parked P2. |
| Q-17 | P2 | STOP-W16-06: the codes behind `money_outstanding` are not on the group-end read (AM-W16-05). | SA1 reads "Money is outstanding" without knowing which money. Likelihood: certain when money is outstanding. Harm: low. | Use AM-W16-05's sentence (A93); keep STOP-W16-06 as the Kind 1 input it already is. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, travel agent used, group labels, withdrawal branch and identifiers (internal record reference) | |
| Date-check interval of the installation and the wait at V19-4 | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V19 (group-end part) result (steps; tests) | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP17-A01 | | | |
| WP17-A02 | | | |
| WP17-A03 | | | |
| WP17-A04 | | | |
| WP17-A05 | | | |
| WP17-A06 | | | |
| WP17-A07 | | | |
| WP17-A08 | | | |
| WP17-A09 | | | |
| WP17-A10 | | | |
| WP17-A11 | | | |
| WP17-A12 | | | |
| WP17-A13 | | | |
| WP17-A14 | | | |
| WP17-A15 | | | |
| WP17-A16 | | | |
| WP17-A17 | | | |
| WP17-A18 | | | |
| WP17-A19 | | | |
| WP17-A20 | | | |
| WP17-A21 | | | |
| WP17-A22 | | | |
| WP17-A23 | | | |
| WP17-A24 | | | |
| WP17-A25 | | | |
| WP17-A26 | | | |
| WP17-A27 | | | |
| WP17-A28 | | | |
| WP17-A29 | | | |
| WP17-A30 | | | |
| WP17-A31 | | | |
| WP17-A32 | | | |
| WP17-A33 | | | |
| WP17-A34 | | | |
| WP17-A35 | | | |
| WP17-A36 | | | |
| WP17-A37 | | | |
| WP17-A38 | | | |
| WP17-A39 | | | |
| WP17-A40 | | | |
| WP17-A41 | | | |
| WP17-A42 | | | |
| WP17-A43 | | | |
| WP17-A44 | | | |
| WP17-A45 | | | |
| WP17-A46 | | | |
| WP17-A47 | | | |
| WP17-A48 | | | |
| WP17-A49 | | | |
| WP17-A50 | | | |
| WP17-A51 | | | |
| WP17-A52 | | | |
| WP17-A53 | | | |
| WP17-A54 | | | |
| WP17-A55 | | | |
| WP17-A56 | | | |
| WP17-A57 | | | |
| WP17-A58 | | | |
| WP17-A59 | | | |
| WP17-A60 | | | |
| WP17-A61 | | | |
| WP17-A62 | | | |
| WP17-A63 | | | |
| WP17-A64 | | | |
| WP17-A65 | | | |
| WP17-A66 | | | |
| WP17-A67 | | | |
| WP17-A68 | | | |
| WP17-A69 | | | |
| WP17-A70 | | | |
| WP17-A71 | | | |
| WP17-A72 | | | |
| WP17-A73 | | | |
| WP17-A74 | | | |
| WP17-A75 | | | |
| WP17-A76 | | | |
| WP17-A77 | | | |
| WP17-A78 | | | |
| WP17-A79 | | | |
| WP17-A80 | | | |
| WP17-A81 | | | |
| WP17-A82 | | | |
| WP17-A83 | | | |
| WP17-A84 | | | |
| WP17-A85 | | | |
| WP17-A86 | | | |
| WP17-A87 | | | |
| WP17-A88 | | | |
| WP17-A89 | | | |
| WP17-A90 | | | |
| WP17-A91 | | | |
| WP17-A92 | | | |
| WP17-A93 | | | |
| WP17-A94 | | | |
| WP17-A95 | | | |
| WP17-A96 | | | |
| WP17-A97 | | | |
| WP17-A98 | | | |
| WP17-A99 | | | |
| WP17-A100 | | | |
| WP17-A101 | | | |
| WP17-A102 | | | |
| WP17-A103 | | | |
| WP17-A104 | | | |
| WP17-A105 | | | |
| WP17-A106 | | | |
| WP17-A107 | | | |
| WP17-A108 | | | |
| WP17-A109 | | | |
| WP17-A110 | | | |
| WP17-A111 | | | |
| WP17-A112 | | | |
| WP17-A113 | | | |
| WP17-A114 | | | |
| WP17-A115 | | | |
| WP17-A116 | | | |
| WP17-A117 | | | |
| WP17-A118 | | | |
| WP17-A119 | | | |
| WP17-A120 | | | |
| WP17-A121 | | | |
| WP17-A122 | | | |
| WP17-A123 | | | |
| WP17-A124 | | | |
| WP17-A125 | | | |
| WP17-A126 | | | |
| WP17-A127 | | | |
| WP17-A128 | | | |
| WP17-A129 | | | |
| WP17-A130 | | | |
| WP17-A131 | | | |
| WP17-A132 | | | |
| WP17-A133 | | | |
| WP17-A134 | | | |
| WP17-A135 | | | |
| WP17-A136 | | | |
| WP17-A137 | | | |
| WP17-A138 | | | |
| WP17-A139 | | | |
| WP17-A140 | | | |
| WP17-A141 | | | |
| WP17-A142 | | | |
| WP17-A143 | | | |
| WP17-A144 | | | |
| WP17-A145 | | | |
| WP17-A146 | | | |
| WP17-A147 | | | |
| WP17-A148 | | | |
| WP17-A149 | | | |
| WP17-A150 | | | |
| WP17-A151 | | | |
| V19 proof (group-end part) | | | |
