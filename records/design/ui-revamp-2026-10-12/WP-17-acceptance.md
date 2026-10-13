# WP-17 acceptance checklist: Group end, withdrawal, deferral, timing

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-17 Group end, withdrawal, deferral, timing (UI-PLAN §12.2: TA-05, TA-07, OP-02, SA-02, SA-04, with the SA-09 kinds of CC-04 and CC-21; done when V19 (group-end part) passes; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-17-design.md`, the architect's decisions (`WP-17.md` §3), amendments O-01 to O-13 (`WP-17.md` §4.1, which bind), the amendments D-23, F-39, I-17, G-12, E-30 and the orchestrator's P-21 dispositions (`PROPOSALS.md`, internal 1c98aaf). See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result; where an amendment differs from the design, the amendment governs. |
| Product base | Lane branch `ui-revamp-2026-10-12` at b2a6341 (the design and the review read b2a6341). Internal records at 1c98aaf |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (TA-04, TA-05, TA-05c, TA-06, TA-07, TA-07d, TA-07w, TA-07c, TA-13b under test; set-up through the travel-agent pages); staff http://127.0.0.1:4652 (OP-02 and its task pages, SA-02d, SA-04a, SA-04g, the SA-09 kinds under test; set-up through SA-06, SA-07a, SA-03a, OP-02, OP-04) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-17-design.md`), the architect's decisions (`WP-17.md` §3) and the independent design review (lane
`research/reviews/WP-17-design-review.md`, R-01 to R-13, with amendments O-01 to O-13 in `WP-17.md` §4.1, which bind)
changed the rows below. The amendments D-23 (WP-06), F-39 (WP-07), I-17 (WP-11), G-12 (WP-09) and E-30 (WP-08) apply
as O-06 corrects their words. The orchestrator's P-21 dispositions apply (item 1 a Core defect in the Core batch; item
2 policy to Max; item 3a a surface repair in the Core batch; item 3b parked, the admin end-deferral surface is the
route; item 4 exceptions to Max). Rows not listed changed only their page ids, step references and draft words to the
design's. Section 6 is kept as asked; its lead names the answers. Items keep their numbers; new items are A152 to A168.
The first version's steps map to the design's §6 steps (O-12): G-1 → V19G-1, V19G-2; G-2 → V19G-7, V19G-7a; W-1 →
V19G-3, V19G-3a; W-2 → V19G-3b; Q-1 to Q-4 → V19G-10a to V19G-10e; F-1, F-2 → V19G-10f, V19G-10g; D-1 to D-6 →
V19G-10h to V19G-10n; R-1 → V19G-10q; W-3 → V19G-10r; W-4 → V19G-9 (on W, under possible filing); W-5 → V19G-10s;
V19-1 → V19G-6; V19-2 → V19G-10u; V19-3 to V19-6 → V19G-10v to V19G-10x. The first version's groups G1, G2, G3 and
applications A to H are replaced by the design's groups and applications D, U, W, with C as a lettered addition (§0.3).

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1 | Design; `WP-17.md` §3, §4.1; review R-01 to R-13; D-23, F-39, I-17, G-12, E-30; P-21 dispositions | Inputs add the design, the record, the review, the amendments and P-21. Verified facts corrected: `timing_risk` is posted with `ackRequired: false` (O-07); the staff deferral read returns only an open deferral, so an ended one leaves the read (O-05); deferral decisions carry no expected revision (O-11); an approved deferral holds readiness, authorization and packet release until it is ended (O-06) |
| A11, A152 (new), A153 (new), A138 | **O-01** (R-01, P0); PM Q-01; P-21 item 1 | A past travel date sends nothing until a BFF-only acknowledgement of the exact dates is given after a review that states what the next date check ends; tests for a missing acknowledgement, changed dates, a stale revision, replay and future dates sent directly; the live step acknowledges; a raw post without the acknowledgement is refused by the BFF; Core's own refusal is "Unmet: waits for P-21 item 1" (a Core defect in the Core batch) |
| §0.2 "Money", A75 to A78, A76, A147, A168 (new) | **O-02** (R-02); Q-W17-03 | Paise throughout (`400000` for ₹4,000; the field stays `newPricePaise`); over-limit input refused whole; the proposed amount shown converted to rupees in a review before the send |
| A22 to A30, A154 (new) | **O-03** (R-03) | "Decline the increase; keep the current price ₹[current]"; the original quote labelled separately; a fixture with a reduction between proposal and decision |
| A34, A165 (new) | **O-04** (R-04); P-21 item 4 | The held values are not available on TA-07c; `held_correction_conflict` (category stale) routes to the conflict explanation; "cannot be applied to the current details"; readable values Unmet pending P-21 item 4 |
| A46, A53, A54, A71, A162 (new) | **O-05** (R-05) | With no open deferral the pages say "No deferral is currently open" (no invented history); verified receipts and POST refusal rendering kept apart; no early absence check blocks replay |
| §0.2 "Words", A33, A46, A47, A50, A53, A66, A67, A73, A159 (new) | **O-06** (R-06); D-23, F-39, E-30 as corrected | "Review on [date]; readiness, authorization and packet release remain held until the deferral is ended." everywhere |
| A32, A40, A42 | **O-07** (R-07) | No acknowledgement promise for `timing_risk`; the items assert the recorded flag |
| §0.2 "Receipts", A49, A53, A68, A97, A105, A160 (new) | **O-08** (R-08) | "Request recorded" for the shared deferral summary (proposal, decision, end) and for every unchecked receipt; tests with proposal and end keys at the decision receipt address and with another actor's key |
| A54, A112 | **O-09** (R-09) | OP-02e in the body-limit set; a real HTTP maximum-input test |
| A04, A18, A51, A79 | **O-10** (R-10) | An unchanged saved envelope with a new key is a stale test (`stale_revision`); a fresh-revision duplicate is a separate test (`outcome_already_recorded`, `deferral_active`, `price_increase_open`, `group_closed`) |
| A01, A13, A33, A66, A69, A70 | **O-11** (R-11); G-12; D-23 | A01 admits the design's qualified listed-row line; TA-07's aside always links TA-07w and the return link sits on TA-07w; A33 asks for no notices read; SA-02d links from the row's pending reason; deferral decisions carry no expected revision, a state-based refusal is not CMP-14, and competing extensions can both succeed |
| §0.3, §0.4, §3, §5, A89 to A95, A155 to A158 (new) | **O-12** (R-12); design §6; Q-W17-06 | One recipe: the design's V19G steps with a fresh travel agent per run and lettered additions; isolated fixtures for each V19 exclusion (possible filing, held original, pending delivery, outstanding money) with UI assertions; no waiver of V19's exclusions or of the live end; the intake test cited by its assertion |
| §1.2, A159 to A164 (new), §5, §6 | **O-13** (R-13); P-21 items 2, 3b | Items for the admin end-deferral surface on SA-04a (no Core change); the Kind 2 and policy items recorded "Unmet" pending P-21 |
| Page ids, paths, hosts and words everywhere | Design §1.3, §1.5, §2.0 to §2.15 (T1 to T9) | TA-05c, TA-07d, TA-07w, TA-07c, OP-02f, OP-02d, OP-02e, OP-02w, SA-09d kinds `deferral_approve`, `deferral_decline`, `deferral_extend`, SA-09p, SA-09w, SA-04g; the recheck in place on OP-02 and SA-04a; receipts on the task pages; "Ended with the group (not an outcome)"; the T1 to T9 word tables |
| A02, A05, A06, A09, A14 to A16, A21, A23, A25, A29, A30, A37, A38, A41, A45, A48, A56 to A61, A63, A67, A75, A77, A83, A84, A89 to A93, A108 | Design §2.1 to §2.14 | The design's anatomy, states, refusal sentences and words |
| §6 lead; Q-18 (new) | `WP-17.md` §3, §4.1; P-21 dispositions | Answers named; Q-18 asks for the writes of the lettered additions |

## Lessons applied from the WP-01 to WP-16 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per host (A04, A15, A25, A42, A49, A53, A58, A78, A86, A160); the matrix A110 |
| An unchanged saved envelope reaches the revision check first; a duplicate guard is tested with a fresh revision | WP-17 O-10 | A04, A18, A51, A79 |
| A replay step MUST NOT change the state that later steps observe | WP-16 M-07 | §3 V19G-3a, V19G-7a, V19G-10f, V19G-10n (each replay sends the accepted content again) |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2 "Refused sends"; every refusal item checks by delta |
| A BFF refusal sends no command; it is tested apart from a direct Core contract test | WP-16 M-06 | A11, A20, A43, A48, A60, A72, A76, A88, A111, A152 |
| A receipt names the command only when the operation's resource, returned id and summary (or a record selected by a returned id) establish it; otherwise "Request recorded"; an unchecked receipt is neutral; no accepted time; no result from the address | WP-01 A-04, P-02; WP-03 C-03; WP-06 D-02; WP-14 K-07; WP-17 O-08 | §0.2 "Receipts"; A03, A49, A53, A68, A78, A97, A105, A160 |
| An accepted command whose recorded result is not the requested effect never shows as a success | WP-15 (class of WP-01 A-04, A-07) | A16, A58, A59, A86 (a refused withdrawal assessment); A63 (a recheck whose rules could not answer) |
| A page asserts only what a read returns after the event; a missing record is "not currently open", never an invented history | WP-17 O-05 | A46, A53, A54, A71, A162 |
| A word for a hold never implies that it ends by itself | WP-17 O-06 | §0.2 "Words"; A33, A47, A53, A67, A73 |
| A notice's acknowledgement is asserted from its recorded flag, never promised | WP-17 O-07 | A32, A42 |
| No page, status read or receipt instructs anyone to perform an act | WP-07 F-01, F-33 (P0 class fix) | A15, A58, A106 |
| Money facts stay separate; no page adds them unless Core returns the sum; no page computes an amount "due"; amounts in a test use the unit of the field | WP-07 §0.2 "Money"; WP-16 Q-W16-01; WP-17 O-02 | §0.2 "Money"; A22 to A24, A28, A75, A76 |
| A choice is named by the fact it keeps, never by an earlier value it may not keep | WP-17 O-03 | A23, A24, A29, A30, A154 |
| A value that a read returns is not shown where its presentation misleads its audience | WP-16 M-01, M-02 | A06, A12, A37, A38 (words of ended and withdrawn applications) |
| A page shows only facts that a named read returns; a fact no read returns is qualified, "Partly met" or "Unmet" | WP-02 B-06; WP-14 K-14; WP-16 M-03 | §0.1 "Facts no read returns"; A23, A32, A33, A34, A44, A60, A78, A86, A91, A165 |
| A page MUST NOT block a command that Core accepts and MUST NOT offer a choice that Core always refuses | WP-07 D-W07-16; WP-10 H-02, H-03 | A13, A28, A71, A80 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A76, A77 |
| On GET assert the blocker and the absence of the form; a refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A18, A51, A52, A54, A79, A81 |
| No semantic duplicate guard is claimed where Core has none | WP-08 Q-W08-15; WP-09 G-03 | A16, A44, A70, A110 (6) |
| The refusal summary and the submitted values render independently of current eligibility; an unsent block keeps values when the form no longer applies | WP-02 code review R-01, R-03 | A18, A26, A29, A54, A69 |
| A stale comparison shows the unsent value and the current value; a state-based refusal is not a stale comparison | WP-16 M-09; WP-17 O-11 | A26, A69 |
| Revisions are asserted as advanced on a fresh read, never by a fixed increment | WP-16 M-12 | A03, A68 |
| No BFF handler truncates, slices or drops a field; the largest valid form reaches Core over real HTTP | LD-17; WP-16 PM Q-14; WP-17 O-09 | §0.1 "BFF today"; A20, A54, A72, A111, A112 |
| An irreversible effect from a typing error needs a review and an exact acknowledgement before the send | WP-17 O-01 | A11, A152 |
| Optional reads never hide an access change | LD-14 | A10, A113 |
| A list at its read's cap says so; no total, "none" or all-clear beyond the returned slice | WP-08 E-10; WP-14 K-05 | A01, A10, A93 |
| A state is labelled for the fact it establishes | WP-06 D-05; WP-14 K-11 | §0.2 "Words"; A06, A12, A37, A91 |
| A boundary names its owner and route; an action that does not exist gets no notice | LD-04; WP-08 Q-W08-03; WP-16 design §2.0 | A21, A28, A75, A80, A83 |
| Audit facts show only as fields recorded on that subject, with time and source | WP-11 I-10; WP-14 K-14 | A70, A107 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" or "Partly met" with its owner | WP-10 H-01; WP-14 K-01; WP-16 A15 | §0.2 "Pass rule"; A36, A80, A153, A163 to A165 |
| A scenario's defining states are proven by isolated fixtures with UI assertions; no general deferral waives them | WP-17 O-12 | A155 to A158; §3 proof split |
| Proofs follow one ordered recipe (the design's, with a fresh travel agent per run and lettered additions), with a run tag and deltas; set-up writes are labelled | WP-02 B-13; WP-14 K-13; WP-16 M-08; WP-17 O-12 | §0.4; §3 |
| Real refusal shapes from the code | WP-06 D-11; WP-10 H-07 | §0.5 |
| One host page per command use; every rendered form action is a registered route; carried test entries leave | CC-12 to CC-21 | A102, A103 |
| A support view shows no target-user action; admin pages answer the support-view page | WP-03 code review R-05; WP14-A89 | A114 |
| Copy states no configuration value that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A09, A90, A108 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-16 M-11 | §6 Q-06 to Q-09 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2 (deferral line; next action), §2.3, §3.1, §3.2 (Group end; Completed case with continuing duty; Unknown external execution), §3.3, §4.1 to §4.4, §5.3, §6.1 to §6.3, §7.4, §7.5, §8.3, §12 V19 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B06, B14 to B17, B18, B21, B23, B24, B25, B26, B29, B33, B35, B44 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-06, AD-13), §3.2 TA-05, TA-07, §3.3 OP-02, §3.4 SA-02, SA-04, SA-09, §4.2, §5.2 to §5.4, §6, §7, §8, §10, §11, §12.2 WP-17 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (criterion point 2), §3.2 |
| W17 | `WP-17-design.md`; `WP-17.md`; lane `research/reviews/WP-17-design-review.md` | SHA-256 eb14f3d6d6b48776…; 6d58fb1321c59794…; ef85dc80b9e6ecad… | design §0 to §9 (§1.2 Core facts, §1.3 pages, §1.5 commands, §1.6 forms that leave, §1.8 amendments, §2.0 to §2.15, §3 interims, §4 hostile states, §6 proof, §7 units and tests, §9 findings, questions, deviations, STOP items); record §3 (Q-W17-01 to -09, PM Q-01 to -03), §4.1 (O-01 to O-13); review R-01 to R-13 |
| AM | `WP-06.md` §4.8 (D-23); `WP-07.md` §4.12 (F-39); `WP-08.md` §4.10 (E-30); `WP-09.md` §4.2 (G-12); `WP-11.md` §4.6 (I-17) | SHA-256 879fb2ad057f1d59…; 2024be9a4ab63838…; 3cad004c02b69eff…; 8f97ddb3f9826391…; 635116c36360fbac… | The amendments, with O-06's words |
| PR | `PROPOSALS.md`; lane `output/proposals/P-21-wp17-timing-withdrawal.md` | SHA-256 1ef7bd9a4eb98a85…; cb923fff269d1e1b… | P-21 items 1 to 4 and the orchestrator's disposition (internal 1c98aaf); P-02; P-17 item 3 |
| CC | `COMMAND-COVERAGE.md` | SHA-256 8dd78a291b0ea06b… | §3 rows of the 13 WP-17 commands; §6 CC-02, CC-04, CC-06, CC-15, CC-21 |
| LP | `PLAN.md` | SHA-256 8cb2774a01597f50… | §3, §4 (LD-02 to LD-04, LD-07, LD-08, LD-11 to LD-14, LD-17), §7, §9 |
| W3 | `WP-03.md`; `WP-03-acceptance.md` | SHA-256 c6f00aaa4e7c5562…; 13ad0770af3f6c42… | Q-W03-09; WP03-A18 to A23, A30 to A32, A95, A102, A105, A106 |
| W6, W7, W9, W11, W13, W16 | `WP-06.md`, `WP-07.md`, `WP-09.md`, `WP-11.md`, `WP-13.md`, `WP-16.md` and their checklists | internal 1c98aaf | D-02, D-05, D-09, D-12, WP06-A20, A110; F-01, F-05, F-07, F-09, F-33, D-W07-15, WP07-A37, A66, A165; Q-W09-10, WP09-A08; CC-15, I-06, STOP-W11-03, WP11-A50; WP-13 words; AM-W16-05, STOP-W16-06, Q-W16-08, WP16-A07, A110 |
| W14A, W16A | `WP-14-acceptance.md`; `WP-16-acceptance.md` | SHA-256 341d2c25c392b88d…; 659081969aceefd9… | Format, corrections tables, lessons, §0.5 |
| Code | lane repository | b2a6341 | As the first version: `src/modules/core/commands/{groups,withdrawal,submission,drafts,common}.ts`; `src/modules/core/{tasks,travel-recheck,derived,controls,staff-views,model,store}.ts`; `src/modules/payments/writers.ts` (`outstandingMoney`); `src/modules/identity/policy.ts`; `src/contracts/core.ts`; `src/contracts/delivery.ts`; `src/core-api/bindings/core.ts`; `src/core-api/allowlists.ts`; `src/apps/edge/core/{group-routes,routes}.ts`; `src/apps/staff/core/{ops,admin}.ts`; `src/apps/shared/core/ta.ts`; `src/apps/shared/pages/groups.ts`; `src/web/route-inventory.ts`; `src/platform/config.ts`; tests `test/core/{completion-group-end,groups-drafts,withdrawal-dependencies,submission-price,acts}.test.ts`, `test/system/core-pages.test.ts` |

Verified facts of the code at b2a6341 that the items rely on (read by the author; the design §1.2 and the review agree
unless stated):

- **`core.close_group`** (the owning travel agent). Input `groupId`; `_rev.group`. Order: revision; `group_closed`;
  then every open condition together (`group_has_open_applications`, `group_intake_incidents_open`,
  `attempt_in_progress`), the first as the error code and all in `blockers`. Accepted: `closed_kind = ordinary`; summary
  `{groupId}` (as `core.create_group`). A withdrawn application keeps its lifecycle and holds closure until it ends.
- **`core.edit_travel_dates`** (WP-03, TA-13b). Core checks "return on or after start" and "unchanged" only; it does
  not compare the dates with today (P-21 item 1: a Core defect in the Core batch). The lane's interim (O-01): a browser
  minimum and a BFF-only acknowledgement of the exact past dates after a review; the acknowledgement is never sent to
  Core. Effect: every open application's material revision advances; a recheck task runs; summary `{groupId,
  datesRevision}`.
- **`core.recheck_travel_dates`** (assigned operator or SuperAdmin; routes O60, D128). Refusals `application_not_open`,
  `travel_date_recheck_not_pending`. Summary `{applicationId, result, retryAt}`. Staff case read `travelRecheck` while a
  recheck is pending.
- **Group end.** A periodic job (`core.dateCheckEveryMs`, default 60 minutes) enqueues one sweep a day per open group
  whose return date is before today (IST), never while the clock check fails. Reasons that hold an application open:
  `application_not_open`, `group_end_pending`, `service_payment_received`, `operator_work_authorized`,
  `filing_possibly_occurred` (any authorization), `original_held`, `custody_evidence_missing`, `delivery_pending`,
  `money_outstanding`, `protection_mark_active`. Intake work holds only the group closure, not the ending of
  applications. `core.admin_group` items carry no lifecycle.
- **Withdrawal.** Eligibility refusals record nothing (TA: `awaiting_formal_return`, `hold_assistance_in_progress`
  first; all: `application_not_open`, `outcome_already_recorded`, `protection_mark_active`; a blank reference fails the
  contract at field `evidence`). Otherwise Core records the request with an assessment (`accepted`; or `refused` with
  `filing_possibly_occurred`, `withdrawal_cutoff_passed`, `declared_cutoff_passed`, `withdrawal_cutoff_undeclared`).
  Every path advances the application revision. The TA read carries `withdrawal` and `withdrawalPreview`; the staff
  read carries neither.
- **Deferral.** Propose (assigned operator; revision; guards as §0.5). Decide (SuperAdmin; **no expected revision**;
  approve and decline need `proposed`, extend needs `approved`, else `stale_revision`; two extensions of one approved
  deferral both succeed, the later date stands). End (policy: assigned operator or SuperAdmin; the binding and the staff
  allowlist exist; today only the operator route O43; WP-17 adds the admin surface on SA-04a, O-13). An approved
  deferral holds readiness, authorization of external acts and packet release **until it is ended**; nothing ends it
  by itself, also not an outcome (P-21 item 3b parked). The staff read returns only an open (proposed or approved)
  deferral (`openDeferral`): an ended or declined deferral leaves the read (O-05). All three commands return
  `{applicationId, deferralId}`. The travel agent's `deferral` notice carries the review date; the TA case read carries
  no deferral.
- **Price.** Propose (SuperAdmin; field `newPricePaise` in paise; cause `mistaken_price` only through the wire, P-21
  item 3a; one open increase; higher than the price in effect; no payment check, P-21 item 2). Decide (travel agent;
  accept takes the proposed amount; **decline keeps the current price in effect**, also a reduction applied while the
  increase was open, O-03). Summaries `{applicationId}` and `{applicationId, priceRecordId}`.
- **Forecast** (assigned operator; route O42). No expected revision. The timing check posts a `timing_risk` notice
  with **`ackRequired: false`** (O-07). Summary `{applicationId, forecastId}`. No read returns the basis.
- **Held correction** (TA route T48 only). `held_correction_conflict` has category `stale_revision` (O-04). No read
  returns the held values (P-21 item 4).
- **BFF today** (replaced by WP-17): the carried forms on TA-05, TA-07, OP-02 and SA-04a; six field slices (LD-17);
  results from `?done=` flashes; body limits of 4,096, 8,192 and 16,384 bytes, below the largest valid Devanagari input
  on seven routes, among them OP-02e (O-09).
- **Facts no read returns** (each item that needs one is "Partly met" or "Unmet" with §6): the deferral review date on
  the TA case read (the notice holds it, STOP-W17-01); the SuperAdmin's reason on the TA read; the proposed amount on
  the staff read; the forecast basis on any read (P-21 item 4); the held-correction values (P-21 item 4); a withdrawal
  record on the staff read; the lifecycle on the group-end read; an ended or declined deferral on the staff read.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp17-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06; O-12). `syn-ta-2` for isolation only. SuperAdmins: `superadmin-1` (SA1: set-up, the price increase,
  the operational withdrawal, the admin end of a deferral, the losing decline tab), `superadmin-2` (SA2: approves and
  extends). Operators: `operator-1` (OP1: the assigned operator of W and C), `operator-2` (OP2: isolation and the
  read-grant view). They stand for `syn-superadmin-1`, `-2` and `syn-operator-1`, `-2`. Keyboard-only user.
  Screen-reader user. Phone user (390 px wide). No step suspends a seeded account or changes a seeded offering.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (design §7 names: `timing-words.test.ts`,
  `group-close.test.ts`, `application-decisions.test.ts`, `operator-timing.test.ts`, `decision-kinds.test.ts`,
  `timing-decisions.test.ts`, `group-end-status.test.ts`, `bff-timing-forms.test.ts`, `timing-host-pages.test.ts`,
  `test/system/group-end-view.test.ts`, and the existing tests named per item). `L+T`: both are required. "Gallery" is
  the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09); the design's §2.11 (T1 to T9), §2.13 and §2.14 tables govern, as O-03,
  O-04, O-05 and O-06 correct them. Draft copy passes when the page states the same facts. TA boundary notices end
  "Owner: TravelMudra." (Q-W16-08). An unknown value shows "Unrecognised: [code]"; an unknown refusal code shows the
  category text and "Reference code: [code]". Forbidden on WP-17 pages (design §2.0): "Cancel" as the name of a
  withdrawal, "Undo", "Reopen", "Delete", "Expired" or "Late" for a passed date, "Overdue" (except Core's "review due"),
  "Approved" for a price, "Something went wrong", "Override", "Force close". No page shows a package or record id.
- **Words.**
  - Lifecycle `ended_with_group`: "Ended with the group (not an outcome)"; it is never called an outcome, a success or a
    completion of processing. Pending `group_end_pending`: owner "TravelMudra", "Ends with the group after the travel
    return date".
  - Group closed kinds (T9): `ordinary` "You closed this group. Its history is kept." (TA) / "Closed by the travel
    agent" (staff); `group_end` "Closed after the travel return date. Applications that were still open and eligible
    ended with the group. Nothing was deleted."
  - Withdrawal (T1): TA `accepted` "Withdrawn. No further filing happens."; refused "Refused: a filing may have happened,
    so the application stays protected until your operator checks it." / "Refused: the application was already filed
    with the authority." / "Refused: this service cannot be withdrawn after submission." / "Refused: the service's
    withdrawal deadline has passed."; staff words of T1.
  - Deferral (O-06, everywhere: OP-02, SA-04a, SA-02d, SA-09d, OP-01 banner of F-39, the `deferral` notice of E-30,
    T2): proposed "Proposed: a SuperAdmin decides"; approved "Review on [date]; readiness, authorization and packet
    release remain held until the deferral is ended."; no page says that filing "waits until" a date or that a deferral
    ends by itself. With no open deferral: "No deferral is currently open" (O-05).
  - Price (T3, as O-03 corrects): TA kinds "Quoted when you submitted", "Lower price applied", "New price proposed";
    states "In effect", "Waits for your decision", "You accepted it", "You declined it; the current price stayed",
    "Lapsed: the application ended". The choice reads "Decline the increase; keep the current price ₹[current]".
  - Group-end reasons (T5): `group_end_pending` "The travel return date has not passed yet"; `application_not_open`
    "No longer open: completed or ended"; `service_payment_received` "The service payment is recorded as received";
    `operator_work_authorized` "TravelMudra work was authorized on it"; `filing_possibly_occurred` "An external act was
    authorized for it (filed, not filed or unknown)"; `original_held` "A physical original is held";
    `custody_evidence_missing` "An original's holder is uncertain"; `delivery_pending` "A result email is queued, sending
    or uncertain"; `money_outstanding` AM-W16-05's sentence; `protection_mark_active` "A protection mark from a system
    restore holds it".
  - Recheck results (T8): "Rechecked against the current dates"; "The rules still cannot answer: the recheck stays
    pending"; "Not rechecked: a filing may have happened, so the filed facts stay as they were".
- **Money (O-02).** Every amount is a Core field rendered by `money()`; no difference, total or amount due. SA-09p takes
  the new price in paise in the field `newPricePaise` (Q-W17-03): digits only, for example `400000` for ₹4,000. The page
  shows the price in effect in rupees and paise. Before the command is sent, a review shows the entered amount
  converted ("New price: ₹4,000 (400000 paise)"); nothing reaches Core until the SuperAdmin confirms from the review. A
  value that is not digits is refused at the field with the value kept; a value over the contract limit is refused whole
  at the field (never cut); nothing is rounded.
- **Dates and times.** Every date reads "[d Month yyyy]" with "(IST)" once per block; times carry "IST".
- **Freshness (LD-08).** Every WP-17 read is authoritative: "Read at [time] IST". SA-01 and OP-01 counts keep their
  forms.
- **Facts (K-14).** A page shows only facts that its reads return. A count that cannot be read is "Unavailable", never
  "0". A list at its cap says so. Additional reads (named per item): `core.ta_groups` (opt., TA-05c counts);
  `pay.application_payments` (opt., SA-09p); `ops.case_work` (opt., OP-02w, SA-09w); `core.ops_work` (OP-01);
  `views.audit_subject` (SA-08s).
- **Receipts (design §2.13 as O-08 corrects).** No accepted time, no command name (P-02, S-08), no result from the
  address (`?done=` flashes go). An unchecked receipt (another actor's operation key) reads "Request recorded" with
  current authorized facts only. Recorded facts come only from the summary and records selected by its ids; later
  facts are "Current".

| Command | Host | Summary | Receipt |
|---|---|---|---|
| `core.close_group` | TA-05 | `{groupId}` (as `core.create_group`) | "Request recorded"; Current: "Group closed (You closed this group)" or "Group open" |
| `core.request_withdrawal`, `core.record_applicant_withdrawal`, `core.record_operational_withdrawal` | TA-07w, OP-02w, SA-09w | `{applicationId, withdrawalId, result, code?}` | "Application withdrawn" (`accepted`) / "Withdrawal request recorded: refused" with the reason (T1 by audience) |
| `core.decide_price_increase` | TA-07d | `{applicationId, priceRecordId}` (no `submissionId`; the record selected is decided) | "Price decision recorded": "You accepted ₹[amount]" or "You declined the increase; the current price ₹[effective] stayed" (O-03) |
| `core.propose_price_increase` | SA-09p | `{applicationId}` | "Request recorded"; Current: "Price increase open, waiting for the travel agent" |
| `core.apply_held_correction` | TA-07c | `{applicationId, correctionId}` (no `stage`; equals the path id) | "Held correction applied" |
| `core.record_forecast` | OP-02f | `{applicationId, forecastId}` | "Forecast recorded"; Current: the current forecast |
| `core.propose_deferral`, `core.decide_deferral`, `core.end_deferral` (operator and SuperAdmin) | OP-02d; SA-09d; OP-02e and SA-04a | `{applicationId, deferralId}` (shared) | "Request recorded" (O-08); Current: the open deferral's state words, or "No deferral is currently open" |
| `core.recheck_travel_dates` | OP-02, SA-04a (top of the tab) | `{applicationId, result, retryAt}` | "Travel-date recheck run" with T8 words |

- **Replay terms** (as WP-16 §0.2): 1 identical replay; 2 changed-content conflict ("This form was already used with
  different content. Your values are kept: check them and send again."); 3 browser Back (a fresh page with current
  facts; sends nothing); 4 rejected-form refresh (a new key; the corrected send is recorded once); 5 lost
  acknowledgement (C4 "Checking the original result", "Check status"). Two more belong to the matrix (A110): a business
  duplicate with a fresh revision and a raw stale envelope (O-10). A replay step on `lane-ui` MUST NOT change what later
  steps observe.
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request
  [reference] so far". Refusal items check by delta: groups, applications (outcome, lifecycle, revision), withdrawal
  records, deferrals, price records, forecasts, notices, operations.
- **Paths (LD-03; design §1.3).** Kept, amended: TA-05 `/ta/groups/:groupId`; TA-13b `…/travel-dates`; TA-07
  `/ta/applications/:applicationId`; OP-02 `/ops/applications/:applicationId?tab=work`; SA-04a
  `/admin/applications/:applicationId`; SA-02d `/admin/queues/deferrals`; SA-04g `/admin/groups/:groupId`. New GET task
  pages beside the kept POSTs: TA-05c `/ta/groups/:groupId/close` (T08); TA-07d `…/price-decision` (T35); TA-07w
  `…/withdraw` (T34); TA-07c `…/corrections/:correctionId/reapply` (T48); OP-02f `/ops/applications/:id/forecast`
  (O42); OP-02d `…/deferral` (O24); OP-02e `…/deferrals/:deferralId/end` (O43); OP-02w `…/applicant-withdrawal` (O23).
  SA-09 kinds on WP-06's route `/admin/applications/:id/decide/:kind`: `deferral_approve`, `deferral_decline`,
  `deferral_extend` (POST D24 with the hidden BFF-only `applicationId`), `price_increase` (D101),
  `operational_withdrawal` (D22). The recheck stays in place on OP-02 Work and SA-04a Overview (O60, D128). The admin
  end of a deferral (O-13): a new registered admin route that sends `core.end_deferral`, hosted on SA-04a (path and id
  as the build names them).
- **Pass rule.** WP-17 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the deferred items of §5.
  Recorded, not failed: A153 "Unmet: waits for P-21 item 1"; A164 "Unmet: waits for P-21 item 2"; A80 "Unmet: waits for
  P-21 item 3a"; A163 "Unmet: waits for P-21 item 3b"; A165 "Unmet: waits for P-21 item 4"; A36 "Unmet: waits for
  STOP-W11-03 and P-17 item 3"; "Partly met" where §0.1 "Facts no read returns" names the missing fact (A23, A32, A33,
  A44, A60, A78, A86, A91). The V19 exclusion fixtures (A155 to A158) and the live group end (V19G-10w) are never
  deferred. A failed item becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01 to WP-03 (with the WP-03 fixes of O-01), WP-06 to WP-09 and WP-11 are
  integrated (SA-06, TA pages, SA-07a, SA-03a, OP-02, OP-04, TA-07p, SA-04a); WP-08 (TA-10) and WP-14 (SA-08s) for
  observation; WP-13 (`changed-terms.ts`) for TA-07d. Where a package is not integrated, the step runs on the existing
  page and the run record says so.
- **Data hygiene (Q-W17-06; §6 Q-18 for the lettered additions).** Approved writes per run (design §6.2 with a fresh
  travel agent, O-12): Y (created and activated); groups G and G0; D (draft, then withdrawn); U (submitted); W (submitted,
  paid, assigned to OP1, work started, readiness, the authorization of its government submission, its execution
  recorded as uncertain); the applicant's withdrawal request of W; the closure of G0; the change of G's dates into the
  past (Q-W17-06, with the O-01 acknowledgement). Lettered additions (pending §6 Q-18): C (submitted, paid, assigned to
  OP1, work started); one forecast on C; two deferrals on C (the first proposed, approved, extended and ended by OP1; the
  second proposed, approved and ended by SA1 on SA-04a); the price increase of U and its acceptance; Y's withdrawal
  request of U; SA1's operational withdrawal request of C. Refused sends record nothing. The run MUST NOT touch another
  run's or a seeded group, application, offering, ceiling or account. G (W, C) stays open at the end; later runs exclude
  it by the run tag. Notes, references and reasons carry the run tag. Identifiers stay in the internal record only.

### 0.3 Synthetic data used by WP-17 (design §6.2, with a fresh travel agent and lettered additions)

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp17-ta-[stamp]`, fresh per run (SA-06) | Every TA step |
| G | `wp17-[stamp]` in Synthetica; travel start today + 30, return today + 40; changed at V19G-10u to start today − 3, return today − 1 (acknowledged, O-01) | D, U, W, C; closure refusals; the live group end |
| G0 | `wp17e-[stamp]`; no application | The accepted closure |
| D | "SYNDRAFT, MIRA", draft on "SYN Tourist e-visa"; withdrawn by Y at V19G-3 | Withdrawal of a draft (always accepted); ends with G |
| U | "SYNUNPAID, RAVI", submitted (₹3,500 = 350000 paise), unpaid, unassigned | SA1's price increase to `400000` paise; Y's decision in two tabs; Y's withdrawal request (branch); ends with G |
| W | "SYNWORK, ASHA", submitted; SA1 records "Payment received" (`SYN-UTR-[stamp]`); assigned to OP1; work started; readiness; authorization of the government submission; execution recorded as uncertain | TA-07w with the operator; OP-02w "Record the applicant's request only" (`SYN-LETTER-[stamp]`, refused); OP-02d possible-filing state; stays open after the group end |
| C (lettered addition) | "SYNDEFER, CHAND", submitted in G; "Payment received" (`SYN-W17-[stamp]-PAY-C`); assigned to OP1; work started | Forecast (today + 5 to today + 32, basis "An external delay"); deferral 1 (review today + 7; extended to today + 14; ended on OP-02e); deferral 2 (review today + 10; ended on SA-04a); recheck refusal; SA1's operational withdrawal request (`SYN-W17-[stamp]-OPS-C`, branch); stays open after the group end |
| Passports, photographs | As WP-14 §0.3 | Intake |
| Reasons, notes, justifications | "WP17 [stamp] …", at least 10 characters (20 for a justification) | Every text field |
| Fixtures (tests, gallery) | As the first version, plus: one isolated fixture per V19 exclusion (an unpaid, never-assigned application in a group past its return date with exactly one of: an external-act authorization; a held original; a queued result email; an open payment follow-up item), each beside a control application with nothing held; a catalogue reduction between a price proposal and its decision; two SuperAdmins extending one approved deferral; a deferral approved after an outcome; an approved deferral of a completed application with no operator; a past-date edit without, with a changed and with an exact acknowledgement | T items and the gallery |

### 0.4 Run recipe (rerunnable; one recipe, O-12)

- Run tag `wp17-[yyyymmddhhmm]`. First checks: the harness can create, activate and sign in Y; SA1, SA2, OP1, OP2
  and `syn-ta-2` sign in; "SYN Tourist e-visa" admits Y (TA-03). The run record states the date-check interval of the
  installation (from its configuration; no page shows it).
- **Withdrawal branch (first check after Setup 1).** Y reads TA-07w of U: Core's check now is "accepts" or "refuses:
  this service cannot be withdrawn after submission" (the seeded offering's cut-off support decides). The run record
  names the branch. Both are valid results for V19G-10r and V19G-10s; the other branch runs as tests (A16, A59).
- Baseline (step P-0): SA-02d rows and SA-01 group 6 lines; OP-01 views of OP1; the TA-04 and TA-06 row counts of
  `syn-ta-2`. Every later count check is a delta from it.
- Setup (labelled; pages of other packages): Setup 0: SA1 creates and activates Y. Setup 1: Y creates G and G0
  (TA-13a); Y creates D (TA-09); Y submits U, W and C (TA-08). Setup 2: SA1 records "Payment received" for W and C
  (SA-07a) and assigns both to OP1 (SA-03a); OP1 starts work on W and C (OP-02); OP1 records readiness on W, requests the
  authorization of W's government submission and records W's execution as uncertain (OP-04).
- Order (§3): P-0, Setup 0, Setup 1, the withdrawal branch, Setup 2, V19G-1 to V19G-10, V19G-10a to V19G-10x, X-1, the
  test steps V19G-11 to V19G-15 and V19G-11a to V19G-11d, T-1 to T-9, then V-A, X-2, X-3. Every harness send uses the
  fields of a freshly loaded page unless the step says "raw". The run does not end before V19G-10w passes: if the date
  check has not run, the run waits for it.

### 0.5 Refusal shapes in the code at b2a6341 (category / code)

Every command below also answers `not_found_or_forbidden` / `access_denied` for a caller without its policy action (the
route answers the uniform not-found page first for a person of another surface) and `conflict_operation_key` /
`operation_key_reused` for a reused key with other content. Input refusals are `validation_failed` / `input_invalid`
with the field and Zod's code. A support view runs no command: `/admin` pages and posts answer 409
`support_view_active`; TA task pages in a support view show no form. The BFF refusals of design §2.12 and the TA-13b
acknowledgement (O-01) send no command.

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `core.close_group` | `stale_revision` / `stale_revision` (`_rev.group`); `control_blocked` / `group_closed`; `control_blocked` / `group_has_open_applications`, else `group_intake_incidents_open`, else `attempt_in_progress`, each with `blockers` that name every code that applies; `stale_revision` on the guarded update |
| `core.edit_travel_dates` (WP-03; the O-01 interim) | BFF: a past date without the acknowledgement of the exact dates → the review, no command. Core: `input_invalid` on the date format; `stale_revision`; `control_blocked` / `group_closed`; `validation_failed` / `group_dates_invalid` at `travelReturnDate` or at `travelStartDate` with code `unchanged`. No Core refusal for past dates (A153) |
| `core.recheck_travel_dates` | `control_blocked` / `application_not_open`; `control_blocked` / `travel_date_recheck_not_pending` |
| `core.request_withdrawal` | `input_invalid` on `note`; `stale_revision`; `control_blocked` / `awaiting_formal_return`; `hold_assistance_in_progress`; `application_not_open`; `outcome_already_recorded`; `protection_mark_active`. Not refusals (accepted command, `result: refused`): `filing_possibly_occurred`, `withdrawal_cutoff_passed`, `declared_cutoff_passed`, `withdrawal_cutoff_undeclared` |
| `core.record_applicant_withdrawal` | `input_invalid` on `evidence` (a blank reference), on `evidenceRef` (over 120) and on `note`; `stale_revision`; `application_not_open`; `outcome_already_recorded`; `protection_mark_active`. Assessments as above |
| `core.record_operational_withdrawal` | `input_invalid` on `reason` (10 to 1,000) and `evidence`; `stale_revision`; `application_not_open`; `outcome_already_recorded`; `protection_mark_active`. Assessments as above |
| `core.propose_deferral` | `input_invalid` on `justification` (20 to 2,000) and `proposedReviewOn`; `stale_revision`; `control_blocked` / `application_not_submitted`; `outcome_already_recorded`; `filing_possibly_occurred`; `validation_failed` / `date_invalid` at `proposedReviewOn` (`not_after_today`); `conflict_duplicate` / `deferral_active` |
| `core.decide_deferral` | `input_invalid` on `decision`, `reason` (10 to 1,000), `reviewOn`; `not_found_or_forbidden` / `access_denied` (an unknown deferral); `stale_revision` / `stale_revision` (approve or decline of a deferral that is not `proposed`; extend of one that is not `approved`; no expected revision exists); `validation_failed` / `date_invalid` at `reviewOn` (`not_after_today`) |
| `core.end_deferral` (operator route O43; the admin route of O-13) | `input_invalid` on `note` (1 to 1,000); `not_found_or_forbidden` / `access_denied` (an unknown deferral; an operator not assigned); `stale_revision` / `stale_revision` (the deferral is not `approved`) |
| `core.propose_price_increase` | `input_invalid` on `cause`, `newPricePaise` (digits; over 24 digits by the contract) and `reason`; `stale_revision`; `control_blocked` / `application_not_submitted`; `outcome_already_recorded`; `input_invalid` at `correctionId` (`correction_not_applied`, every `material_scope_change`); `conflict_duplicate` / `price_increase_open`; `input_invalid` at `newPricePaise` (`not_higher`) |
| `core.decide_price_increase` | `input_invalid` on `priceRecordId` and `decision`; `access_denied` (a record of another application, before the revision); `stale_revision`; `control_blocked` / `outcome_already_recorded`; `application_not_open`; `withdrawal_accepted`; `awaiting_formal_return`; `stale_revision` (the record is no longer an open increase) |
| `core.record_forecast` | `input_invalid` on `windowStart`, `windowEnd`, `basisCode`, `note`; `control_blocked` / `application_not_submitted`; `outcome_already_recorded`; `validation_failed` / `forecast_window_invalid` at `windowStart`; `stale_revision` (a concurrent forecast) |
| `core.apply_held_correction` | `input_invalid` on `correctionId`; `access_denied`; `stale_revision`; `stale_revision` (not `released_for_reapply`); `control_blocked` with the `correct_application` blockers; `awaiting_formal_return`; `hold_assistance_in_progress`; `stale_revision` / `held_correction_conflict`; the same-person evidence refusals; `control_blocked` / `filing_possibly_occurred` |
| Asserted as set-up answers (owned elsewhere) | `core.create_group`, `core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06); `ops.start_work`, `ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence` (WP-07) |

## 1. Scope

### 1.1 Pages (design §1.3)

| Page | Host and path | Part in WP-17 |
|---|---|---|
| TA-05 Group | 4650 `/ta/groups/:groupId` (WP-03 page, amended) | "Closing the group" (rule, Core's facts, the qualified listed-row line, the link to TA-05c); row and closed words; the closure receipt |
| TA-05c Close the group | 4650 `/ta/groups/:groupId/close` (new GET beside T08) | Host of `core.close_group` |
| TA-13b Change the travel dates | 4650 `…/travel-dates` (WP-03 page; WP-03 fixes) | The past-date review and acknowledgement (O-01); effect text |
| TA-04, TA-06 | 4650 (WP-03 pages) | Words of ended and withdrawn rows |
| TA-07 Application | 4650 `/ta/applications/:applicationId` (WP-03 page, amended) | Status rows, action panel rows, "Price and timing", "Waiting for your decision", the aside link "Withdraw this application" |
| TA-07d, TA-07w, TA-07c | 4650 new GETs beside T35, T34, T48 | Hosts of `core.decide_price_increase`, `core.request_withdrawal`, `core.apply_held_correction` |
| OP-02 Work | 4652 `/ops/applications/:applicationId?tab=work` (WP-07 page, F-39) | Sections "Travel-date recheck" (in-place form), "Timing", "Deferral", "Ending the case" |
| OP-02f, OP-02d, OP-02e, OP-02w | 4652 new GETs beside O42, O24, O43, O23 | Hosts of `core.record_forecast`, `core.propose_deferral`, `core.end_deferral` (operator), `core.record_applicant_withdrawal` |
| SA-02d Deferrals | 4652 `/admin/queues/deferrals` (WP-06 page, D-23) | Row words and links |
| SA-04a Application | 4652 `/admin/applications/:applicationId` (WP-11 page, I-17) | Sections "Deferral" (with the admin end, O-13), "Travel-date recheck" (in-place admin form), "Ending the case", "Price and timing"; Decisions list rows |
| SA-09d, SA-09p, SA-09w | 4652 SA-09 kinds `deferral_approve`, `deferral_decline`, `deferral_extend`, `price_increase`, `operational_withdrawal` | Hosts of `core.decide_deferral`, `core.propose_price_increase`, `core.record_operational_withdrawal` |
| SA-04g Group | 4652 `/admin/groups/:groupId` (D30; I-17 d) | `core.admin_group`: group-end status and reasons |
| Set-up and observation pages | SA-06, TA-13a, TA-09, TA-08, SA-07a, SA-03a, SA-01, OP-01, OP-04, TA-07p, TA-10, TA-01, TA-11, SA-08s | Set-up and observation only |

Reads: `core.ta_group`, opt. `core.ta_groups` (TA-05, TA-05c, TA-13b); `core.ta_applications` (TA-06);
`core.ta_application` (TA-07 and its task pages); `core.ops_case` (OP-02 and its task pages); opt. `ops.case_work`
(OP-02w, SA-09w); `core.ops_work` (OP-01); `core.admin_case` (SA-04a, SA-09 kinds); opt. `pay.application_payments`
(SA-09p); `core.admin_queue {deferrals}` (SA-02d); `core.admin_group` (SA-04g); `core.operation` (receipts, status
pages); `views.audit_subject` (SA-08s, observation).

### 1.2 Command coverage (CC §5.1: 13 WP-17 commands; CC-02, CC-04, CC-06, CC-21)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `core.close_group` | `ta.groups.close` (T08) | TA-05c (linked from TA-05) | A01 to A05, A07 |
| 2 | `core.edit_travel_dates` | `ta.groups.travel_dates` (T07) | TA-13b (WP-03; WP03-A18 to A22 not repeated) | A11, A152, A153 |
| 3 | `core.recheck_travel_dates` | `ops.applications.travel_recheck` (O60); `admin.applications.travel_recheck` (D128) | OP-02 Work and SA-04a Overview, in place | A61 to A65 |
| 4 | `core.request_withdrawal` | `ta.applications.withdraw` (T34) | TA-07w | A13 to A21 |
| 5 | `core.record_applicant_withdrawal` | `ops.applications.applicant_withdrawal` (O23) | OP-02w | A56 to A60 |
| 6 | `core.record_operational_withdrawal` | `admin.applications.operational_withdrawal` (D22) | SA-09w | A83 to A88 |
| 7 | `core.propose_deferral` | `ops.applications.propose_deferral` (O24) | OP-02d | A46 to A52 |
| 8 | `core.decide_deferral` | `admin.deferrals.decide` (D24) | SA-09d kinds (links on SA-02d, SA-04a) | A66 to A73 |
| 9 | `core.end_deferral` | `ops.applications.end_deferral` (O43); the new admin route (O-13) | OP-02e; SA-04a | A53, A54, A159 to A162 |
| 10 | `core.propose_price_increase` | `admin.applications.price_increase` (D101) | SA-09p | A74 to A82 |
| 11 | `core.decide_price_increase` | `ta.applications.price_decision` (T35) | TA-07d | A22 to A31, A154 |
| 12 | `core.record_forecast` | `ops.applications.forecast` (O42) | OP-02f | A39 to A45 |
| 13 | `core.apply_held_correction` | `ta.applications.reapply_correction` (T48) | TA-07c | A34 to A36 |
| ref | Group end (Core's task; no command) | — | SA-04g; TA-05; TA-07 | A06, A08, A09, A12, A37, A89 to A95, A155 to A158 |
| ref | P-21 Kind 2, policy and exception items | — | — | A153, A163 to A165 |

All of them also: A96 to A115. Commands outside WP-17 that the proof touches only as set-up or observation:
`iam.create_account`, `iam.approve_account`, `iam.activate_account`; `core.create_group`, `intake.start_individual`,
`core.submit`; `pay.record_service_status`; `core.assign`; `ops.start_work`, `ops.record_readiness`,
`core.authorize_external_act`, `ops.record_act_evidence`.

### 1.3 State coverage

S1 does not apply (server-rendered). S5 applies only to the SA-01 and OP-01 counts (observation).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-05, TA-05c | Open with conditions A01, A02; group-end line A09; empty A03; ended rows A06; closed after the return date A08; S7, support view, cap A10 | — | A02, A04 (4), A05, A07 | A03 | A04 (6) | A04 (3) |
| TA-13b (WP-17 part) | Past-date review A11 | A152 | A152 | A11 | A152 | A152 |
| TA-07 | Aside link A13; price A22; timing A32; deferral A33; pending work A34; ended A37; withdrawn and waiting A38 | — | — | — | — | — |
| TA-07w | Form A14; with the operator, refused now A13; outcome recorded A18; support view A19 | A20 | A17, A18 | A15, A16 | A110 | A18, A19 |
| TA-07d | Form A23; with the operator A27; paid A28; nothing waits, superseded A29 | A29 | A29 | A24, A154 | A110 | A26 |
| TA-07c | Form, conflict, held again, with the operator A34 | — | A34 | A34 | A110 | A34 |
| OP-02 Work | Timing A39; deferral A46; recheck A61, A62; ending A56 | — | A61 | A63 | — | — |
| OP-02f | Form A40; draft, outcome, read grant A45 | A43 | A41, A45 | A42 | A110 | — (no revision; A44) |
| OP-02d, OP-02e | Form A47, A53; open deferral A51; possible filing A52; no open deferral A54 | A48 | A48, A51, A52, A54 | A49, A53 | A110 | A51, A52, A54 |
| OP-02w | Form A57; possible filing A56 | A57 | A58, A60 | A58 | A110 | A60 |
| SA-09d | Form A67; wrong state, no deferral, outcome warning A71 | A71 | A69, A71 | A68, A70 | A110 | — (state-based, A69) |
| SA-09p | Form and review A75; open increase A79; with the operator, paid A75 | A76, A77 | A77, A79, A80 | A78 | A110 | A81 |
| SA-09w | Form A84; possible filing A83 | A85 | A85, A87 | A86 | A110 | A87 |
| SA-04a deferral end | Section A159; after an outcome or completion A161 | A162 | A162 | A160 | A110 | — (state-based, A162) |
| SA-04g | Before the date A89; eligible A90; ended A91; reasons A92; clock, cap, S7 A93; exclusions A155 to A158 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-17 shows | Items |
|---|---|---|
| V19 (group-end part; WP-16 the financial follow-up, WP-14 the disclosure part, WP-12 originals) | Only unpaid, never-worked applications end after the return date (D, U live); W and C stay open with their reasons; each exclusion (possible filing, held original, pending delivery, outstanding money) holds an isolated fixture open, with UI assertions; "Ended with the group (not an outcome)" never reads as success; the group stays open while one application is open | A06, A07, A08, A09, A12, A37, A89 to A95, A155 to A158; §3 |
| UX §3.2 Group end; BS B25; CC-02 | Closure on TA-05c names each missing condition; Core decides; a withdrawn application holds closure until it ends | A01 to A05, A09, A38 |
| UX §4.2 travel-date edit; BS B06; O-01 | A past date needs a review and an exact acknowledgement; affected applications are rechecked | A11, A152, A153 |
| UX §2.2 deferral line; BS B21 | Justification, SuperAdmin approval, TA notice, review point; the hold stays until the deferral is ended; the admin end exists | A33, A46 to A55, A66 to A73, A159 to A163 |
| BS B24, B23, B18; UX §5.3 | Three withdrawal paths, one assessment recorded either way; no ordinary withdrawal while filing may have occurred; the TA waits for a formal return | A13 to A21, A56 to A60, A83 to A88 |
| BS B17; UX §4.3 | Quote, current price and proposed price; the TA's choice keeps the current price on decline; paid amounts and refunds stay separate | A22 to A31, A74 to A82, A154, A164 |
| BS B17; UX §3.1, §4.4 | Estimate and forecast stay separate; the timing notice is recorded without an acknowledgement request | A32, A39 to A45 |
| BS B23 (held correction) | Released correction applied by the TA; values not on the page | A34 to A36, A165 |
| BS B35 | Replay and matrices | A04, A110 |
| V24 | Keyboard, screen reader, phone | A116 to A128 |

## 2. Acceptance checklist

### 2.1 TA-05 and TA-05c: closing and group end (travel agent)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A01 | Travel agent (Y) | TA-05 of G after Setup 2 (§3 V19G-1) | Read the section "Closing the group". | `h2`; the rule text (WP-03 `CLOSE_RULE`); Core's two facts with units ("Imports still running: 0 imports"; "Open import issues of this group: None"); when a listed row has pending `group_end_pending`, the design's line "[n] of the applications listed wait for the travel return date. TravelMudra ends each of them with the group on the day after [return date] (IST), when it is unpaid and has no TravelMudra work. Until then the group cannot close." (counted from listed rows by Core's pending reason; "At least [n] …" at the 200-row cap); the link "Close the group" → TA-05c (secondary, never the page's primary action). No close form and no "can close" verdict on TA-05. | L | CC-02; design §2.1; **O-11** |
| WP17-A02 | Travel agent (Y) | TA-05c of G (§3 V19G-2) | Read; select "Close the group". | `h1` "Close [group]"; "What closing means" ("A closed group takes no new applications, no imports and no change of travel dates. Nothing is deleted… A closed group cannot be opened again."); "What TravelMudra checks when you close it" (three checks; Core's facts; "Applications still open: 3 of 3 applications" from this group's `core.ta_groups` row, or the listed-row count when the row is absent; "TravelMudra checks again when you close the group."); the review line; "Close the group" (destructive) and "Cancel". Refused: CMP-07 "The group was not closed" with one item per blocker code, in the design's §2.14 words; the facts re-read; the form stays; group revision and state unchanged; operations delta 0. | L | Design §2.2, §2.14; BS B25 |
| WP17-A03 | Travel agent (Y) | TA-05c of G0 (§3 V19G-7) | Select "Close the group". | 303 to TA-05; receipt "Request recorded" with "Current: Group closed (You closed this group)"; TA-05 shows the closed sentence, no close link, no "Add applicants", no "Edit travel dates"; TA-13b of G0 shows "The group is closed. Its travel dates cannot change."; TA-04 row "Closed". A fresh read shows the group revision advanced. No `?done=closed`. | L | Design §2.1 item 4, §2.13; O-08 |
| WP17-A04 | Travel agent (Y); harness; test | TA-05c of G0, the Nth time (§3 V19G-7a; test) | (1) Harness: resend the accepted POST (same `_op`). (2) Press Back. (3) Harness raw: the unchanged saved envelope with a new key. (4) Harness raw: a new key with the group's current revision. (5) Test: two tabs of one group; tab 2 closes; tab 1 sends. (6) Test: lost acknowledgement. | (1) The same 303 and receipt; one `core.group_closed` fact. (2) TA-05c Closed state, no form; nothing sent. (3) `stale_revision`: CMP-14 rows (Travel dates; Applications listed); nothing recorded. (4) `group_closed`: the Closed state with "This group was closed meanwhile."; nothing recorded (O-10). (5) As (3) for tab 1. (6) C4; no second close offered; the status page links TA-05. | L ((1) to (4)) + T ((5), (6)) | BS B35; **O-10**; design §2.2 |
| WP17-A05 | Test (`group-close.test.ts`) | TA-05c refusal render | Each blocker code alone and all three together; `group_closed`; `stale_revision`; an unknown code; access, session, maintenance and support-view refusals. | One summary item per blocker in the design's §2.14 words (not only Core's first code); `group_closed` → Closed state; CMP-14 for stale; unknown: category text and "Reference code: [code]"; access refusals reach the shell (LD-14). The form shows whenever the group is open (Core decides, Q-W03-09). | T | Design §2.2, §2.14; CC-02 |
| WP17-A06 | Travel agent (Y) | TA-05 of G after the date check (§3 V19G-10w) | Read. | State "Open" (W and C are open). Rows D and U: "Ended with the group (not an outcome)" with their outcome as recorded (D "Withdrawn"; U "Withdrawn" or "Outcome not recorded" by the branch); rows W and C: their stage and Core's next step. "Ended with the group: 2 applications" (WP03-A31). No text that the group finished, succeeded or will close. | L | BS B25; design §2.1 item 3; V19 |
| WP17-A07 | Travel agent (Y) | TA-05c of G after the date check (§3 V19G-10x) | Select "Close the group". | Refused `group_has_open_applications` as A02; nothing recorded. | L | CC-02; BS B25 |
| WP17-A08 | Test (`test/system/group-end-view.test.ts`, V19G-12); gallery | TA-05 of a group closed after its return date (`closed_kind = group_end`) | Render. | "Closed after the travel return date. Applications that were still open and eligible ended with the group. Nothing was deleted."; rows "Ended with the group (not an outcome)"; read only with history; no close link, no "Add applicants", no "Edit travel dates". A completed application with an open payment follow-up keeps its row (WP16-A110). | T + gallery | BS B25; design §2.1 item 4 |
| WP17-A09 | Travel agent (Y) | TA-05 of G after V19G-3 (§3 V19G-4) | Read D's row and the closing section. | D's row: owner "TravelMudra", next "Ends with the group after the travel return date" (never "Nothing to do"); the A01 line "1 of the applications listed wait for the travel return date…". No per-application group-end verdict for W, U or C (no TA read returns one); no date-check interval stated. | L | Design §2.1 items 2, 3; WP-01 Q-13 |
| WP17-A10 | Test | TA-05 and TA-05c states | The group read unavailable; the closure counts unavailable; the optional `core.ta_groups` read unavailable or without the row; a support view; 200 listed applications. | S7 on the group read; "Unavailable", never "0", for a count; without the `core.ta_groups` row: "[o] of the [n] listed applications are still open" ("At least …" at the cap); support view: facts, no link or form; at 200: "This list shows at most 200 applications." and "Closing the group checks every application, also those not listed." | T | D7; LD-14; K-05; design §2.1, §2.2 |
| WP17-A11 | Travel agent (Y); harness | TA-13b of G (§3 V19G-10u) | Enter start today − 3 and return today − 1 (the date controls carry Core's today as a minimum; the harness posts the TA-13b fields as the page names them, labelled set-up). Read the review. Give the acknowledgement of the exact dates. Send. Read TA-05. | First send: no command (operations delta 0; group revision unchanged); the review page states the exact dates, "Today (IST) is [date]", and what the next date check ends ("Each open application of this group that is unpaid and has no TravelMudra work ends with the group. This cannot be reversed."), with an acknowledgement for these dates (never prechecked; BFF-only, never sent to Core). After the acknowledgement: Core accepts; receipt "Travel dates changed" (WP03-A19); TA-05 rows show "Being checked" until Core records the recheck. | L | **O-01** (R-01, P0); PM Q-01; Q-W17-06 |
| WP17-A12 | Travel agent (Y); test | TA-04, TA-06 after V19G-10w; test of the row words | Read the G rows. Test: rows of each lifecycle with and without an outcome. | TA-06 rows of D and U: "Ended with the group (not an outcome)" and the outcome as recorded; never "Completed" alone and never a success tone (§6 Q-05). A withdrawn open application: outcome "Withdrawn" and the stage; never "Closed" or "Cancelled". TA-04 G row "Open" with "[open] open of [total] applications" from Core. | L + T | Design §2.1 item 3; BS B21, B25 |

### 2.2 TA-07 and TA-07w Withdraw (`core.request_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A13 | Travel agent (Y); test | TA-07 aside of D (§3 V19G-3), of W (§3 V19G-8); test: each state | Read the aside. Follow the link on W. | "Withdraw this application" → TA-07w shows for every open application with no outcome, outside a support view, whatever Core's preview says (G-12). On TA-07w of W (assigned): "This application is with your operator. To withdraw it, ask your operator to return it to you first." and the link "Ask your operator for a return" → TA-07p `?purpose=withdraw` (WP-09; the link is on TA-07w, not on TA-07); no form. Refused preview (test): the reason in T1 words with its owner line (`filing_possibly_occurred` "Owner: your operator, who checks whether the filing happened."; cut-off codes "Owner: TravelMudra."); no form (Q-W17-04). An application with an outcome: no link; the status row shows the withdrawal. | L (D, W) + T | **O-11**; **G-12**; design §2.4 item 5, §2.6 |
| WP17-A14 | Travel agent (Y) | TA-07w of D (§3 V19G-3) | Read the page from the top. | `h1` "Withdraw [applicant]"; meta; "Read at". "What withdrawing means" (records and checks the request; if accepted no further filing, history, documents, originals and money records kept, cannot be reversed); for an unpaid application with no TravelMudra work: "It stays in the group until the day after the travel return date, then ends with the group."; for a submitted one the refund line "A payment you made is not refunded by a withdrawal. Refunds are not decided here. Owner: TravelMudra." "TravelMudra's check now": "If you request it now, TravelMudra accepts it." and "TravelMudra checks again when you send the request." Note (optional, up to 2,000); review line; "Withdraw the application" (destructive); "Cancel". | L | Design §2.6; BS B24, B25 |
| WP17-A15 | Travel agent (Y); harness | TA-07w of D (§3 V19G-3, V19G-3a) | Give a note; send. Harness: resend the same `_op`. Press Back. | 303 to TA-07w; receipt "Application withdrawn" with "Withdrawn. No further filing happens." Current: outcome, stage "Draft". TA-07 of D: Withdrawal row "Withdrawn. No further filing happens."; Group end row "This application ends with the group after the travel return date: unpaid, with no TravelMudra work."; action panel owner "TravelMudra", no action. Y's notices +1 (`withdrawal_decision`). No instruction to act. Resend: the same receipt; one request record. Back: the Withdrawn state, no form. | L | BS B24, B35; WP-07 F-33; design §2.6, §2.13 |
| WP17-A16 | Travel agent (Y); test | TA-07w of U (§3 V19G-10r, by branch); test: the other branch and a hand-made post | Send (accepted branch) or read (refused branch). | Accepted branch: as A15 with stage "Submitted" and the refund line shown before the form. Refused branch: no form (Q-W17-04); in the test a hand-made post records a refused request: receipt "Withdrawal request recorded: refused" with "Refused: this service cannot be withdrawn after submission." (never "withdrawn"); TA-07 row "Your withdrawal request was refused: …"; the "Earlier request refused" line on TA-07w. Core records each new request; no duplicate guard is claimed. | L (branch) + T | BS B24; WP-15 lesson; design §2.6, §4.1 |
| WP17-A17 | Test | TA-07w race | Preview accepted at load; before the send (a) the application is assigned; (b) a fact changes Core's assessment (a declared cut-off step on a formally returned case). | (a) `awaiting_formal_return`: "This application went to your operator meanwhile. Ask for a return to withdraw it." with the With-the-operator state and the unsent text block; nothing recorded. (b) Core records `refused` / `declared_cutoff_passed`; the receipt shows the recorded result, never the preview. | T | Design §2.6, §2.14 |
| WP17-A18 | Travel agent (Y); harness; test | TA-07w of D after V19G-3 (§3 V19G-3b); tests | (a) GET TA-07w of D. (b) Harness raw: the unchanged saved V19G-3 envelope with a new key. (c) Harness raw: a new key with D's current revision. Test: `awaiting_formal_return`, `hold_assistance_in_progress`, `application_not_open`, `protection_mark_active`. | (a) Withdrawn state, no form. (b) `stale_revision`: CMP-14 (Stage, Editing, TravelMudra's check now) with the note in its field; nothing recorded. (c) `outcome_already_recorded`: the Withdrawn state and the unsent text block with the note; nothing recorded (withdrawal records delta 0). Tests: each re-renders TA-07w with Core's reason and the note kept; `protection_mark_active` reads the design's restore sentence. | L ((a) to (c)) + T | **O-10**; WP-09 G-05; design §2.6 |
| WP17-A19 | Test | TA-07w stale and access | The application changed after load; another TA's application; a support view; a session that ended. | Stale: CMP-14 with the note kept; nothing recorded. Another TA: the uniform not-found page. Support view: items 2 to 4 and "Read-only view: the travel agent takes this step."; no form. Session: sign-in. | T | UX §3.3; LD-14; design §2.0 |
| WP17-A20 | Test (BFF, HTTP) | TA-07w handler | A note of 2,001 characters; the largest valid note (2,000 Devanagari characters) over real HTTP. | 2,001: sent unchanged, refused at the field by the contract, the note kept whole. 2,000 Devanagari: the body fits the route limit (24,576 bytes) and reaches Core; accepted. | T | LD-17; Q-W17-09 |
| WP17-A21 | Test (`timing-words.test.ts`) | T1 words, both audiences | Every assessment code and state; an unknown code. | Design T1 words; no TA page says "cancelled", "deleted", "refunded", "closed" or "completed" for a withdrawn application; no page uses "withdrawn" for a service that is no longer offered (WP-13); unknown: "Unrecognised: [code]". | T | Design §2.11 T1; WP-13 words |

### 2.3 TA-07 price section and TA-07d Decide on the price change (`core.decide_price_increase`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A22 | Travel agent (Y) | TA-07 of U after V19G-10a (§3 V19G-10c) | Read the action panel, the status rows and "Price and timing". | Action panel (Core's `decide_price_increase`): "Decide on the new price: accept it or keep the current price." → TA-07d. Status row "Price change": "A new price waits for your decision". "Price and timing": "Quoted at submission ₹3,500"; "Price in effect ₹3,500"; "Proposed new price ₹4,000 (price correction)" with the link "Decide on the price change". No "Amount due", difference or total. | L | Design §2.4; **O-03** |
| WP17-A23 | Travel agent (Y) | TA-07d of U (§3 V19G-10c) | Read the page from the top. | `h1` "Price change: [applicant]"; "The change": "Price you were quoted at submission: ₹3,500" (labelled separately), "Price in effect now: ₹3,500", "Proposed new price: ₹4,000", "Why: TravelMudra corrects a mistake in the published price." The SuperAdmin's reason does not show ("Partly met", §6 Q-06). "Your decision" radio, none preselected: "Accept the new price" (hint "The price in effect becomes ₹4,000. A payment you already made does not change; TravelMudra records payments separately.") and "Decline the increase; keep the current price ₹3,500" (hint "The price in effect stays ₹3,500. TravelMudra honours the price it communicated."). Review line; "What this page cannot do: Refunds and payment adjustments are not decided here. Owner: TravelMudra."; "Record my decision"; "Cancel". | L | **O-03**; design §2.5; UX §4.3 |
| WP17-A24 | Travel agent (Y), tab 2 | TA-07d of U (§3 V19G-10d) | Choose "Accept the new price"; send. | 303 to TA-07d; receipt "Price decision recorded": "You accepted ₹4,000"; Current: "Price in effect ₹4,000"; the quote ₹3,500 stays labelled as the quote; then the Nothing-waits state. TA-11 shows "Price in effect: ₹4,000" (observe WP-16). No amount due. | L | BS B17; design §2.13 |
| WP17-A25 | Travel agent (Y); harness | TA-07d after V19G-10d | Harness: resend tab 2's POST (same `_op`). Press Back on tab 2. | The same receipt; one decision. Back: "No price change waits for your decision." with the price records table; no form. | L | BS B35; design §2.5 |
| WP17-A26 | Travel agent (Y), tab 1 | TA-07d of U, opened before V19G-10d | Choose "Decline the increase…"; send after tab 2's acceptance. | `stale_revision`: CMP-14 "Price change: your choice Decline / now Accepted"; "Price in effect: ₹4,000"; no form and "This price change was decided meanwhile: You accepted it."; nothing recorded. | L | Design §2.5, §2.15 |
| WP17-A27 | Test; gallery | TA-07 and TA-07d of an assigned application with an open increase | Render. Send a saved envelope. | TA-07: owner "Your operator", "A new price waits for your decision. Your operator returns the application to you first."; TA-07d With-the-operator state, no form; the envelope: `awaiting_formal_return`, nothing recorded. | T + gallery | BS B18; design §2.4, §2.5 |
| WP17-A28 | Test; gallery | TA-07d of a paid application with an open increase | Render. | The form shows (Core accepts it); the accept hint names that a payment made does not change; the "What this page cannot do" line shows; no difference of prices, no "pay the rest" (A164). | T + gallery | UX §4.3; BS B17, B29; P-21 item 2 |
| WP17-A29 | Test (`application-decisions.test.ts`, BFF) | TA-07d refusals and states | No choice; a record id not a price record; a superseded increase; `outcome_already_recorded`, `withdrawal_accepted`, `application_not_open`; `awaiting_formal_return`; a support view. | No choice: "Choose whether to accept the new price or keep the current price." at the radio group, no command. Ended: "This application ended meanwhile. The price stays ₹[current]. Your decision was not recorded." Assigned meanwhile: the With-the-operator state with "Your decision was not recorded." Outcome on GET: "This application has the outcome [words]. No price change waits for a decision. The price in effect stays ₹[current]." Support view: no form. Each records nothing; the choice kept as unsent text where the form no longer applies. | T | Design §2.5, §2.14; O-03 |
| WP17-A30 | Travel agent (Y); test | TA-07 of U after V19G-10d, "Price records"; test: every kind and state | Read. | Oldest first by `seq_no`, every record stays, T3 TA words with O-03: "Quoted when you submitted · In effect"; "New price proposed · Price correction · You accepted it"; columns amount and "Price in effect after it" from Core's fields; test: "Lower price applied", "You declined it; the current price stayed", "Lapsed: the application ended". No arithmetic, no recorder, no reason. | L + T | Design §2.4 item 3, §2.11 T3; **O-03** |
| WP17-A31 | Travel agent (Y) | TA-10 after V19G-10a and V19G-10d (observe WP-08) | Read the price-change notice. | The notice needs acknowledgement (Core: `ackRequired`); the decision does not acknowledge it; TA-10n links TA-07d, which shows the decided state (E-30; STOP-W17-14). | L | UX §4.2; E-30 |
| WP17-A154 (new) | Test (`submission-price.test.ts` and `application-decisions.test.ts`) | TA-07d with a reduction between proposal and decision | Quote 350000; increase proposed 400000; a catalogue reduction to 300000 recorded while open. Render; decline; accept (separate fixtures). | TA-07d: quote ₹3,500, "Price in effect now: ₹3,000", proposed ₹4,000; the decline choice reads "Decline the increase; keep the current price ₹3,000". Decline: price in effect ₹3,000; receipt "You declined the increase; the current price ₹3,000 stayed" (never "the quoted price ₹3,500"). Accept: ₹4,000. Core test "takes an increase decided after a reduction at the decision…" passes. | T | **O-03** (R-03) |

### 2.4 TA-07 timing, deferral, held correction and ended states

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A32 | Travel agent (Y) | TA-07 of C after V19G-10f (§3 V19G-10g); TA-01; TA-10 | Read. | "Original estimate: [dates]" ("an estimate, not a guarantee") unchanged; "Current forecast: [today + 5] to [today + 32]" with "A forecast is TravelMudra's current expectation. Your original estimated window stays as it was."; the basis does not show ("Partly met", A165). TA-01 and TA-10 list the `timing_risk` notice ("The current forecast may affect your travel dates."); its recorded flag reads `ackRequired: false`: no "Needs your acknowledgement", no acknowledgement control, and no page promises one. | L | UX §3.1, §4.4; **O-07**; design §2.4 item 3 |
| WP17-A33 | Travel agent (Y) | TA-07 of C during deferral 1 (§3 V19G-10l) | Read the status rows and the action panel. | Deferral row from Core's pending reason only (no notices read): proposed "The operator proposed to wait before filing. TravelMudra decides."; approved "Readiness, authorization and packet release remain held until the deferral is ended. The review date is in your notice." Action panel owner "Your operator", no action. TA-10's `deferral` notice reads "Review on [date]; readiness, authorization and packet release remain held until the deferral is ended." (E-30 with O-06). No justification, approver, "waits until" or "On hold" without that sentence. | L | **O-06**; **O-11**; design §2.4 item 1; STOP-W17-01 |
| WP17-A34 | Test; gallery | TA-07 "Waiting for your decision" and TA-07c with a released TA correction | Render; send; render `held_correction_conflict`, `filing_possibly_occurred`, `awaiting_formal_return`, `stale_revision` (applied in another tab), identity evidence codes, a path id not released. | TA-07: "A held correction of [field words] can be applied now." with the link. TA-07c: "What happened"; "What it changes: Details: [field words]. The held values are not available on this page." (no History claim); "Effect"; "Apply the correction". Accepted: receipt "Held correction applied" on TA-07c's path. `held_correction_conflict` (category `stale_revision`) → the conflict explanation (not CMP-14): "The details this correction changes were changed in another way since. TravelMudra did not apply it: it cannot be applied to the current details. Check the application and correct it again if needed." with the design's residual line; no form. `filing_possibly_occurred`: "A filing may have happened again, so the correction stays held. Nothing changed." Not released: uniform 404. Each refusal records nothing. | T + gallery | **O-04** (R-04); design §2.7 |
| WP17-A35 | Test | TA-07 pending work by owner | A released correction of an operator's assistance entry and of a SuperAdmin correction. | No re-application offered on TA-07; Next names the operator or "TravelMudra". | T | `derived.ts` rule 8 |
| WP17-A36 | — | Staff re-application of a held correction | Record. | "Unmet: waits for STOP-W11-03 and P-17 item 3" (as WP11-A50); no WP-17 staff page posts `core.apply_held_correction`. | T | WP-11 I-06; STOP-W17-08 |
| WP17-A37 | Travel agent (Y) | TA-07 of D and U after the date check (§3 V19G-10x) | Read. | Lifecycle "Ended with the group (not an outcome)"; outcome as recorded; no action panel step and no form or aside link (withdraw, price, help, submit); history kept. | L | BS B25; design §2.4 item 1 |
| WP17-A38 | Travel agent (Y) | TA-07 of D after V19G-3 | Read. | Outcome "Withdrawn"; stage "Draft"; Group end row and the action panel as A15; no "Completed", "Closed" or "Delivery pending" headline (Core's progress shows only as a labelled row, §6 Q-05). | L | BS B24, B25; design §2.4 |

### 2.5 OP-02 Timing and OP-02f Record a forecast (`core.record_forecast`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A39 | Operator (OP1) | OP-02 Work of C, "Timing" (§3 V19G-10f) | Read. | "Original estimated window: [start] to [end] (IST), an estimate, not a guarantee"; "No later forecast"; link "Record a forecast" → OP-02f. No form on OP-02. | L | F-39; design §2.8.1 item 2 |
| WP17-A40 | Operator (OP1) | OP-02f of C (§3 V19G-10f) | Read. | `h1` "Record a forecast: [applicant]"; "Now" (estimate, forecast, travel dates); "Effect": "The forecast is recorded beside the original estimated window, which never changes. The earlier forecast stays in the history. TravelMudra tells the travel agent when the forecast puts the travel dates at risk." (no acknowledgement promise, O-07); fields "Expected from", "Expected by" (hint with the submission date), "What the forecast rests on" (radio, three values, none preselected), "Note (optional)"; review; "Record the forecast"; "Cancel". | L | **O-07**; design §2.8.2 |
| WP17-A41 | Operator (OP1) | OP-02f of C (§3 V19G-10f) | Send an end date before the start date. | `forecast_window_invalid` at "Expected from": "The forecast must start on or after the submission date ([date]) and end on or after its start."; values kept; re-rendered at the POST address; forecasts delta 0. | L | Design §2.14 |
| WP17-A42 | Operator (OP1); harness | OP-02f of C (§3 V19G-10f) | Send start today + 5, end today + 32, "An external delay", a note. Harness: resend. Back. | 303 to OP-02f; receipt "Forecast recorded"; Current: "Current forecast: [today + 5] to [today + 32]"; estimate unchanged. Resend: same receipt; one forecast. Back: a fresh page with the current forecast. Y's notices +1 `timing_risk` (`threatened`), recorded with `ackRequired: false`. | L | BS B17, B35; **O-07** |
| WP17-A43 | Test (BFF) | OP-02f handler | Basis empty; basis of 41 characters; a basis outside the three; a note of 501 characters; dates that are not dates; the largest valid note (500 Devanagari) over real HTTP. | Empty basis: "Choose what the forecast rests on." (BFF, no command). Empty date: "Enter the date." Other values sent whole and refused by Core's contract at the field; values kept; no `.slice`. Largest form accepted. | T | LD-17; design §2.12 |
| WP17-A44 | Test | OP-02f with two tabs | Tab 2 records; tab 1 records another. | Both accepted (no expected revision); the later is current; no stale comparison claimed (Q-W17-08). The basis of the current forecast does not show after the receipt ("Partly met", A165). | T | Design §4.1 |
| WP17-A45 | Test | OP-02f states | A draft; an outcome; a read-grant reader (OP2 with a grant); a support view; a SuperAdmin. | Draft or outcome: "A forecast applies only to a submitted application with no outcome." with no form. Read grant: the frame and "Only the assigned operator takes this step. You can read this application." with no form. Support view: no form. SuperAdmin: no forecast page (no route; §6 Q-11). | T | Design §2.0, §2.8.2 |

### 2.6 OP-02 Deferral: OP-02d Propose (`core.propose_deferral`) and OP-02e End (`core.end_deferral`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A46 | Operator (OP1) | OP-02 Work of C, "Deferral", in each state (§3 V19G-10i, V19G-10l, V19G-10n) | Read. | No open deferral: "No deferral is currently open." and "Propose a deferral" → OP-02d. Proposed: "Proposed: a SuperAdmin decides", proposed review date, justification. Approved: "Review on [date]; readiness, authorization and packet release remain held until the deferral is ended." and "End the deferral" → OP-02e (also after an outcome). The F-39 banner uses the same sentence. | L | **O-05**; **O-06**; F-39; design §2.8.1 item 3 |
| WP17-A47 | Operator (OP1) | OP-02d of C (§3 V19G-10i) | Read. | `h1` "Propose a deferral: [applicant]"; "What a deferral does": "An approved deferral holds readiness, filing authorization and the packet release until it is ended. Reconciliation, results and delivery go on. It is not a refusal and not a completion. A SuperAdmin decides; the travel agent is told the review date when it is approved. On the review date you and the approving SuperAdmin are reminded; nothing ends by itself."; facts; fields "Why the application should wait" (20 to 2,000; hint that the travel agent does not read it), "Proposed review date"; review; "Propose the deferral". | L | **O-06**; design §2.8.3 |
| WP17-A48 | Operator (OP1) | OP-02d of C (§3 V19G-10i) | (1) Review date today. (2) A justification of 19 characters. | (1) `date_invalid`: "Choose a date after today (IST)." (2) Refused at the justification (BFF or Core). Values kept; deferrals delta 0. | L | Design §2.8.3, §2.14 |
| WP17-A49 | Operator (OP1); harness | OP-02d of C (§3 V19G-10i) | Send a valid justification and today + 7. Harness: resend. | 303 to OP-02d; receipt "Request recorded" (shared summary, O-08) with Current "Proposed: a SuperAdmin decides"; one deferral. SA-02d +1 (V19G-10k). | L | **O-08**; BS B21 |
| WP17-A50 | Operator (OP1) | OP-01 (§3 V19G-10j, V19G-10l; observe WP-07) | Read the views. | Proposed: as Core's pending answer (SuperAdmin owns the next step). Approved: C in "Waiting" with "Review on [date]; …" (F-07, F-39 as O-06 corrects); not in "Action now". | L | WP-07 F-07; **O-06** |
| WP17-A51 | Operator (OP1); harness | OP-02d of C with the open deferral (§3 V19G-10j) | (a) GET OP-02d. (b) Harness raw: the unchanged saved V19G-10i envelope with a new key. (c) Harness raw: a new key with C's current revision. | (a) "A deferral is already proposed." with the section link; no form. (b) `stale_revision`: CMP-14 (Stage, External acts, Deferral) with the values in their fields; nothing recorded. (c) `conflict_duplicate` / `deferral_active`: the Open-deferral state and the unsent text block; nothing recorded. | L | **O-10**; WP-09 G-05 |
| WP17-A52 | Operator (OP1); test | OP-02d of W (§3 V19G-10h); tests | GET OP-02d of W. Tests: `filing_possibly_occurred` raised after load, an outcome, a draft, stale. | W: CMP-10 "Proposing a deferral is unavailable while a filing may have happened. Owner: you (reconcile the act)." with the act link; no form. Tests: each GET shows its state and no form; a post answers Core's code with the unsent text block; nothing recorded. | L (W) + T | Design §2.8.3 |
| WP17-A53 | Operator (OP1); harness | OP-02e of C, deferral 1 (§3 V19G-10n) | Read; give a note; send; resend. | `h1` "End the deferral: [applicant]"; "Review on [today + 14]; readiness, authorization and packet release remain held until the deferral is ended."; justification; Effect "Readiness, filing authorization and the packet release no longer wait for this deferral. Every other check still applies. The travel agent is told that the deferral ended."; note required (1 to 1,000). Accepted: receipt "Request recorded" with Current "No deferral is currently open" (the read no longer returns the ended deferral; no "Ended" claim); Y's notices +1; the resend reconciles to the same receipt. | L | **O-05**; **O-08**; design §2.8.4 |
| WP17-A54 | Operator (OP1); harness; test | OP-02e after V19G-10n; tests | GET OP-02e of the ended deferral. Harness raw: the saved V19G-10n envelope with a new key. Test: a proposed deferral; an empty note; the largest valid note (1,000 Devanagari characters) over real HTTP. | GET: "No deferral is currently open." with the link to OP-02; no form (no invented history). Saved envelope: `stale_revision` → "This deferral is not open now. Nothing was recorded." with the unsent note (no state claimed). Proposed: "This deferral is proposed and waits for a SuperAdmin…" with no form. Empty note: "Give a reason." Largest note: the body fits the sized limit and reaches Core (the 8,192-byte limit is too small today). | L (GET, envelope) + T | **O-05**; **O-09**; LD-17 |
| WP17-A55 | Test; gallery | An approved deferral whose review came due | Render OP-01, OP-02, OP-02e; the notices. | OP-01 "Deferral reviews due" from `core.ops_work.reviewsDue`; OP-02e "Review date reached" only when OP-01's read lists it; notices to the assigned operator and the approver; the hold stays until ended; no "overdue". | T + gallery | BS B21; design §2.8.4 |

### 2.7 OP-02 Ending the case and OP-02w Record the applicant's withdrawal request (`core.record_applicant_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A56 | Operator (OP1) | OP-02 Work of W and of C, "Ending the case" (§3 V19G-9) | Read both. | W (act uncertain): CMP-10 first "Ordinary withdrawal is unavailable: a filing may have happened. Owner: you (reconcile the act)." and the link "Record the applicant's request only" → OP-02w. C: "Record the applicant's withdrawal request" → OP-02w. | L | WP-07 §2.4.6, F-09; design §2.8.1 item 4 |
| WP17-A57 | Operator (OP1) | OP-02w of W (§3 V19G-9) | Read; send with an empty reference. | `h1` "Record the applicant's request only"; the boundary first and "TravelMudra records the request and refuses it as a withdrawal while a filing may have happened."; "What happens"; fields "Reference of the applicant's request" (required, up to 120), note; "Record the request" (secondary under protection). No preview (the staff read has none). Empty reference: "Enter the reference of the applicant's own request: a letter, a message or a form." at the field; note kept; nothing recorded. | L | Design §2.8.5, §2.14 |
| WP17-A58 | Operator (OP1); harness | OP-02w of W (§3 V19G-9, V19G-10) | Give `SYN-LETTER-[stamp]`; send. Harness: resend the same `_op`. | 303 to OP-02w; receipt "Withdrawal request recorded: refused" with "Refused: a filing may have happened"; W has no outcome; the protection stays; Y's notices list the refusal. Resend: the same receipt; one request record. | L | WP-07 F-09; design §6.3 V19G-9, V19G-10 |
| WP17-A59 | Test | OP-02w accepted and cut-off branches | An application with no act: accepted; each cut-off code. | Accepted: "Application withdrawn"; the assignment, payment and custody facts unchanged; stage "Submitted". Cut-off codes: "Withdrawal request recorded: refused" with the staff T1 words. | T | BS B24; design §2.13 |
| WP17-A60 | Test | OP-02w refusals, limits and access | `application_not_open`; `outcome_already_recorded`; `protection_mark_active`; `stale_revision`; OP2; a SuperAdmin; a reference of 121 characters; the largest valid note over real HTTP. | Each refusal with its sentence, values kept, nothing recorded; `protection_mark_active` CMP-10 with owner SuperAdmin; OP2 and a SuperAdmin: no form (Core's policy names the assigned operator); 121: refused at the field, kept whole; the largest note accepted (24,576 bytes). After the receipt, OP-02 cannot show the withdrawal record ("Partly met", §6 Q-08). | T | Design §2.8.5; LD-17 |

### 2.8 Travel-date recheck (`core.recheck_travel_dates`; in place on OP-02 and SA-04a)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A61 | Operator (OP1); SuperAdmin (SA1); harness | OP-02 Work and SA-04a Overview of C (§3 V19G-10q) | Read. Harness raw: post the recheck on both surfaces. | No "Travel-date recheck" section (Core's `travelRecheck` is null). Each post: the refusal at the top of the tab, outside the section's show condition: "No recheck is pending now: the current travel dates are already checked."; nothing recorded. | L | F-W17-04; design §2.8.1, §2.14 |
| WP17-A62 | Test; gallery | OP-02 and SA-04a with a pending recheck | Render `not_run`; `travel_rule_unknown` with and without `retryAt`. | The section `#travel-recheck`: facts, "Readiness, the packet release and external acts wait until the recheck passes.", "Runs again by itself at [time] IST" when set; "Run the recheck now" (assigned operator; SuperAdmin also with no operator). | T + gallery | Design §2.8.1 item 1, §2.9 item 2 |
| WP17-A63 | Test | Recheck results | Send on a pending application with each result. | Receipt "Travel-date recheck run" at the top of the tab with T8 words; `travel_rule_unknown` never reads as a pass. | T | WP-15 lesson; design §2.11 T8, §2.13 |
| WP17-A64 | Test | Recheck access | OP2; a travel agent; a SuperAdmin; a closed application. | OP2: not-found. Travel agent: no route. SuperAdmin: allowed. Closed: refused with its sentence; nothing recorded. | T | `policy.ts` |
| WP17-A65 | Travel agent (Y); test | TA-07 and TA-08 while a recheck is pending (§3 V19G-10u, if visible; test) | Read. | "Being checked" (WP-03 U4); TA-08 shows Core's reason; no TA control runs the recheck. | L (if visible) + T | WP-03 U4 |

### 2.9 SA-02d Deferrals and SA-09d deferral kinds (`core.decide_deferral`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A66 | SuperAdmin (SA1) | SA-02d and SA-01 group 6 (§3 V19G-10k, V19G-10l) | Read. Follow the links. | Lead: "A deferral holds readiness, authorization and packet release until it is ended. It is not a refusal and not a completion." (D-23 as O-06 corrects). Row C, column "Deferral" from the row's pending reason only: "Proposed: to decide" (`deferral_proposed`) with "Decide" → SA-09d `deferral_approve`; after approval "Approved: waits for its review" (`deferral_active`) with "Open" → SA-04a `#deferral` (the row carries no deferral state, STOP-W17-10); any other code: Core's sentence. SA-01 +1 "Proposed, to decide" with the same link. | L | **D-23**; **O-11**; **O-06** |
| WP17-A67 | SuperAdmin (SA2) | SA-09d `deferral_approve` of C, tab 2 (§3 V19G-10k) | Read. | `h1` "Decide the proposed deferral: [applicant]"; Scope ("Deferral [reference], proposed by the assigned operator"); Evidence (justification verbatim, proposed review date, stage, outcome, external acts, forecast); Effect (approve): "The application waits; readiness, filing authorization and the packet release are held until the operator ends the deferral. On the review date the operator and you are reminded; nothing ends by itself. The travel agent is told the review date…"; Hard stops; "Review date" prefilled with the proposed date; "Reason for your decision" (10 to 1,000); hidden `decision = approve` and BFF-only `applicationId`; "Approve the deferral"; "Cancel" → SA-04a `#deferral`. The `deferral_decline` page shows "The deferral does not start. Work goes on as before. The travel agent is not told." | L | **O-06**; design §2.10.1 |
| WP17-A68 | SuperAdmin (SA2) | SA-09d `deferral_approve` of C (§3 V19G-10k) | Keep today + 7; reason; send. | Receipt "Request recorded" (O-08) with Current "Review on [today + 7]; readiness, authorization and packet release remain held until the deferral is ended."; a fresh read shows the application revision advanced; Y's notices +1 (`deferral`); OP-04 of C shows `deferral_active` (observe WP-07). | L | **O-08**; BS B21 |
| WP17-A69 | SuperAdmin (SA1), tab 1 | SA-09d `deferral_decline` of C, opened before the approval (§3 V19G-10k) | Give a reason; send after SA2's approval. | Core checks the state, not a revision: `stale_revision` → not CMP-14: "This deferral was approved since you opened the page. Your decision was not recorded."; the state that applies now (approved, with the link to `deferral_extend`); the unsent text block with the reason; deferrals and notices delta 0. | L | **O-11**; design §2.10.1 |
| WP17-A70 | SuperAdmin (SA2); test | SA-09d `deferral_extend` of C (§3 V19G-10m); test: competing extensions | Review date today + 14; reason; send. Test: two SuperAdmins extend one approved deferral from pages loaded at the same state. | Live: receipt "Request recorded"; Current "Review on [today + 14]; …"; Y's notices +1 with the new date; OP-02 shows the new date; SA-08s of the deferral shows the recorded fields only. Test: both extensions are accepted (the state stays `approved`); the later review date stands; a TA notice per distinct date; no page claims that the second was refused. | L + T | **O-11** (R-11); BS B21; K-14 |
| WP17-A71 | Test (`decision-kinds.test.ts`, BFF) | SA-09d states and refusals | No open deferral; the wrong state for a kind; review date today; the proposed date passed with the prefilled field; reason of 9 characters; a hand-made post without a decision; an unknown deferral id; an application with an outcome; a deferral ended or declined meanwhile; a support view. | No open deferral (GET): "No deferral is currently open." with a link to SA-04a, no form. Wrong state: "This deferral is [proposed / approved]." with the link to the kind that applies, no form. Dates: "Choose a review date after today (IST)." Reason: "Give a reason of at least 10 characters (up to 1,000)." No decision: form-level, no command. Outcome: the warning above the fields, the form shows (Q-W17-05). Ended or declined meanwhile (POST): "This deferral is not open now. Your decision was not recorded." with the unsent reason (no state invented, O-05). Support view: 409. Nothing recorded on each refusal. | T | **O-05**; design §2.10.1 |
| WP17-A72 | Test (BFF, HTTP) | SA-09d handler | A decision of 21 characters; a review date of 11 characters; the largest valid reason (1,000 Devanagari) over real HTTP. | Sent whole and refused at the field or form level; no `.slice`. The largest reason fits the sized limit (16,384 bytes) and reaches Core. | T | LD-17; Q-W17-09 |
| WP17-A73 | Test (`timing-words.test.ts`) | Deferral words and owners | Every state, the pending answers, both audiences; the notice words of E-30. | O-06's sentence for an approved deferral everywhere; "No deferral is currently open" for none; the TA never sees the justification, proposer or approver; no "waits until", SLA, "overdue" (except Core's review due) or colour-only marker. | T | **O-06**; design §2.11 T2, T7 |

### 2.10 SA-04a Price and timing and SA-09p Propose a price increase (`core.propose_price_increase`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A74 | SuperAdmin (SA1) | SA-04a of U, "Price and timing" (§3 V19G-10a) | Read. | Price in effect; no open increase; link "Propose a price increase" → SA-09p (submitted, no outcome, no open increase). No form on SA-04a. | L | I-17; design §2.9 item 4 |
| WP17-A75 | SuperAdmin (SA1); test | SA-09p of U (§3 V19G-10a); tests: assigned, paid | Read. | `h1` "Propose a price increase: [applicant]"; Scope "Cause: a mistake in the published price."; Evidence "Price in effect ₹3,500 (350000 paise)", open increase none, service payment (opt.), Editing; Effect (decline keeps the current price; an assigned application waits for the return; an outcome lapses the increase); Hard stops ("A payment already made is not adjusted; refunds are not decided (owner: product owner)."); "New price in paise" (`newPricePaise`, hint "₹1 = 100 paise. The price in effect is ₹3,500, which is 350000 paise. Enter the full new price, not the difference."); "Reason for the increase"; then the review with the converted amount (A78). Paid (test): the boundary sentence above. | L + T | **O-02**; Q-W17-03; design §2.10.2 |
| WP17-A76 | Test (BFF, `timing-decisions.test.ts`) | SA-09p amount handling | `400000`; `400050`; `4000.50`; `4,000`; `-1`; empty; a 25-digit value. | `400000` → review "New price: ₹4,000 (400000 paise)"; `400050` → "₹4,000.50 (400050 paise)"; `4000.50`, `4,000`, `-1` → "Enter the price in paise as digits only, for example 400000 for ₹4,000." at the field, value kept, no command; empty → "Enter the new price in paise."; 25 digits → refused whole at the field (never cut to 24), kept whole. No rounding. | T | **O-02**; LD-17 |
| WP17-A77 | SuperAdmin (SA1) | SA-09p of U (§3 V19G-10a) | (1) `350000` with a valid reason, confirmed from the review. (2) `400000` with the reason "short". | (1) `not_higher`: "The new price must be higher than the price in effect (₹3,500, 350000 paise)." (2) Refused at the reason. Values kept; price records delta 0. | L | **O-02**; design §2.10.2 |
| WP17-A78 | SuperAdmin (SA1); harness | SA-09p of U (§3 V19G-10a) | Enter `400000` and a reason; read the review; confirm. Harness: resend the confirmed POST. | Review (nothing sent): "New price: ₹4,000 (400000 paise)" beside "Price in effect: ₹3,500". Confirmed: receipt "Request recorded" with Current "Price increase open, waiting for the travel agent"; the proposed amount does not show on staff pages after the send ("Partly met", §6 Q-06); Y's notices +1 (`price_change`). Resend: one record. | L | **O-02**; O-08 |
| WP17-A79 | SuperAdmin (SA1); harness | SA-09p of U with the open increase (§3 V19G-10b) | (a) GET. (b) Harness raw: the unchanged saved V19G-10a envelope with a new key. (c) Harness raw: a new key with U's current revision. | (a) "A price increase is already open: the travel agent decides." No form. (b) `stale_revision`: CMP-14 (Price in effect, open increase, Editing) with values kept; nothing recorded. (c) `price_increase_open`: the Open-increase state and the unsent text block; nothing recorded. | L | **O-10**; WP-09 G-05 |
| WP17-A80 | Test; harness | `material_scope_change` | Render SA-09p; raw post with that cause. | No page offers the choice (hidden `cause = mistaken_price`). Raw post: `input_invalid` at `correctionId`, nothing recorded. "Unmet: waits for P-21 item 3a" (surface repair in the Core batch). | T | P-21 item 3a; STOP-W17-07 |
| WP17-A81 | Test | SA-09p states | A draft; an outcome; a stale revision; a support view; the largest valid reason over real HTTP. | Draft: "A price increase applies only to a submitted application…"; outcome: "… Its price no longer changes."; no form; stale: CMP-14; support view: 409; largest reason accepted (16,384 bytes). | T | Design §2.10.2; LD-17 |
| WP17-A82 | SuperAdmin (SA1) | SA-04a of U after V19G-10d (§3 V19G-10e) | Read. | "Price in effect ₹4,000"; no open increase; quote ₹3,500 labelled as the quote. | L | BS B17 |

### 2.11 SA-04a Ending the case and SA-09w Record an operational withdrawal request (`core.record_operational_withdrawal`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A83 | SuperAdmin (SA1); test | SA-04a of C, "Ending the case" (§3 V19G-10s); test: possible filing | Read. | Link "Record an operational withdrawal request" → SA-09w; under possible filing (test) "Record the operational request only" after the boundary; the generic cancellation boundary as text with owner product owner and no control. | L + T | Design §2.9 item 3; BS B24, B44 |
| WP17-A84 | SuperAdmin (SA1) | SA-09w of C (§3 V19G-10s) | Read. | `h1` "Record an operational withdrawal request: [applicant]"; Evidence (stage, outcome, external acts, service payment); Effect (accepted and refused, design §2.10.3); Hard stops ("A withdrawal never overrides a possible filing or a passed cut-off. It records no refund."); "Evidence reference" (required, up to 120); "Reason" (10 to 1,000); "Record the request". | L | Design §2.10.3 |
| WP17-A85 | SuperAdmin (SA1) | SA-09w of C (§3 V19G-10s) | (1) Empty reference. (2) Reason "short". | (1) "Enter the reference of the operational reason." at the field. (2) At the reason. Values kept; nothing recorded. | L | Design §2.10.3 |
| WP17-A86 | SuperAdmin (SA1); harness | SA-09w of C (§3 V19G-10s) | Give `SYN-W17-[stamp]-OPS-C` and a reason; send; resend. | Receipt by result (branch): "Application withdrawn" or "Withdrawal request recorded: refused" with the staff reason; Current facts; Y's notices +1; TA-07 of C shows the withdrawal row. The refused record shows afterwards only on SA-08s ("Partly met", §6 Q-08). One record after the resend. | L | BS B24; design §2.13 |
| WP17-A87 | Test | SA-09w refusals and possible filing | `application_not_open`; `outcome_already_recorded`; `protection_mark_active` (CMP-10 with the SA-09m link); `stale_revision`; an act `filing_unknown`. | Eligibility refusals record nothing; stale: CMP-14; possible filing: accepted with `result: refused` and the receipt as A58. | T | Design §2.10.3 |
| WP17-A88 | Test (BFF, HTTP) | SA-09w handler | A reference of 121 characters; the largest valid reason over real HTTP. | 121: refused at the field, kept whole. Largest reason accepted (16,384 bytes). | T | LD-17 |

### 2.12 SA-04g Group end (SuperAdmin) and V19

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A89 | SuperAdmin (SA1) | SA-04g of G (§3 V19G-6) | Read. | Header facts (dates, state words, "Today (IST)", clock check); lead "After the travel return date, TravelMudra ends each open application that is unpaid, has no TravelMudra work and no open duty. It never ends one with an external act, a held original, a pending email or outstanding money. Nothing is deleted."; table "Group end status": D "No" — "The travel return date has not passed yet"; U "No" — the same; W "No" — that, "The service payment is recorded as received", "TravelMudra work was authorized on it", "An external act was authorized for it (filed, not filed or unknown)"; C "No" — return date, payment, work. No generic sentence. | L | Design §2.9 item 5, §6.3 V19G-6 |
| WP17-A90 | SuperAdmin (SA1) | SA-04g of G after V19G-10u, before the date check (§3 V19G-10v) | Read. If the date check already ran, record V19G-10v as not observable and run A90 in the gallery. | D, U: "Ends with the group: Yes, after [return date]"; W, C: "No" with their reasons (the return-date reason gone). No control; no interval stated. | L | Design §2.9 item 5 |
| WP17-A91 | SuperAdmin (SA1) | SA-04g of G after the date check (§3 V19G-10w) | Read. Open SA-04a of D. | D, U: "No longer open: completed or ended" (the read carries no lifecycle; "Partly met", §6 Q-09); SA-04a of D: "Ended with the group (not an outcome)". W, C unchanged. Group "Open". | L | V19; design §2.9 item 5 |
| WP17-A92 | SuperAdmin (SA1); test (`group-end-status.test.ts`) | SA-04g with W and C after V19G-10w (live read) and fixtures | Read; render. | Every reason Core returns shows, one line each, not only the first; a withdrawal outcome adds no reason and removes none. | L + T | BS B25 |
| WP17-A93 | Test (`group-end-status.test.ts`) | SA-04g words and states | Each T5 code; an unknown code; `clockHealthy` false; closed groups; 500 items; the read unavailable; a support view. | T5 words (§0.2 "Words"; `money_outstanding` AM-W16-05, STOP-W16-06); unknown "Unrecognised: [code]"; clock: "The clock disagrees with the database: TravelMudra ends nothing until it agrees."; closed kinds in T9 words; cap "This list shows 500 applications. More may exist."; S7; 409 in a support view. | T | Design §2.9, §2.11 T5 |
| WP17-A94 | Test (Core) | V19 Core behaviour | Run `test/core/completion-group-end.test.ts`. | Pass, cited by assertion: "keeps an unpaid application without TravelMudra work open until its group ends"; "ends nothing on the return date and ends eligible applications just after midnight India time; never during clock skew"; "ends only eligible applications page by page, and closes the group only when nothing is open"; and the intake test, whose title reads "never ends an application whose group still has intake work open…" while it asserts that the application **ends** and intake work keeps only the **group** open, then the group closes after the intake issue is disposed (the run record cites the assertion; the title correction to "ends the application while intake work keeps the group open; closes the group once the intake work is disposed" is proposed with the WP-17 tests, S-06). | T | BS B25; **O-12** |
| WP17-A95 | SuperAdmin (SA1); test | SA-04g, SA-04a, TA-05 | Look for group-end controls. Test: route inventory. | No "End now", "Close group", "Force", "Override", "Reopen" or "Restore" control on a staff page; `core.close_group` has no staff route; no page reverses an ended application. | L + T | BS B21, B25 |
| WP17-A155 (new) | Test (`test/system/group-end-view.test.ts`) | Isolated exclusion: possible filing | A group past its return date with X (unpaid, never assigned, one external-act authorization written by the fixture, nothing else) and a control application with nothing held; run the sweep. | The control ends; X stays open; Core's eligibility for X lists exactly `filing_possibly_occurred`; SA-04g row X "No" with exactly "An external act was authorized for it (filed, not filed or unknown)"; TA-05 row X not "Ended with the group"; TA-07 of X open; the group open. The test fails if the filing protection is removed. | T | **O-12** (R-12); BS B25 |
| WP17-A156 (new) | Test | Isolated exclusion: held original | As A155 with one held original only. | X open; exactly `original_held`; SA-04g "A physical original is held"; UI as A155. | T | **O-12**; BS B25, B30 |
| WP17-A157 (new) | Test | Isolated exclusion: pending delivery | As A155 with one queued result email only (and a variant with an uncertain email). | X open; exactly `delivery_pending`; SA-04g "A result email is queued, sending or uncertain"; UI as A155. | T | **O-12**; BS B25 |
| WP17-A158 (new) | Test | Isolated exclusion: outstanding money | As A155 with one open payment follow-up item only (and variants for an unused reservation, a TravelMudra-paid fee not recovered and a fee payment result unknown, each alone). | X open; exactly `money_outstanding`; SA-04g AM-W16-05's sentence; UI as A155. | T | **O-12**; BS B25, B29 |

### 2.13 SA-04a admin end of a deferral (O-13) and the P-21 items

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A159 (new) | SuperAdmin (SA1) | SA-04a of C, "Deferral", deferral 2 approved (§3 V19G-10p) | Read. | "Review on [today + 10]; readiness, authorization and packet release remain held until the deferral is ended."; justification; "Extend the deferral" → `deferral_extend`; the end control "End the deferral" with the effect sentence of A53 and a required note (1 to 1,000); its form posts a registered admin route that sends `core.end_deferral` (no Core change: policy, binding and staff allowlist exist); the only form posting that route. The line "The assigned operator ends it." of the design goes. | L | **O-13** (R-13); **O-06**; P-21 item 3b |
| WP17-A160 (new) | SuperAdmin (SA1); harness | SA-04a of C (§3 V19G-10p) | Give a note; end; resend the same `_op`. | Receipt "Request recorded" (shared summary) with Current "No deferral is currently open"; SA-02d row C gone (delta to P-0); Y's notices +1 (`deferral_ended`); OP-02 of C "No deferral is currently open". Resend: the same receipt; one end. | L | **O-13**; **O-05**; **O-08** |
| WP17-A161 (new) | Test | Admin end after an outcome and after completion | An approved deferral of an application withdrawn (outcome) and one of a completed application with no operator assigned (harness). | SA-04a offers the end in both (the operator cannot after completion); accepted; the SA-02d row and the deferral monitor count clear. | T | **O-13**; STOP-W17-06 (c) |
| WP17-A162 (new) | Test (BFF, HTTP) | Admin end refusals and limits | A proposed deferral; the saved envelope after the end; an empty note; the largest valid note (1,000 Devanagari) over real HTTP; an operator posting the admin route; a support view. | Proposed: no end control (the decide links show). Saved envelope: `stale_revision` → "This deferral is not open now. Nothing was recorded." with the unsent note. Empty note: at the field. Largest note: accepted. Operator: uniform not-found. Support view: 409. Nothing recorded on each refusal. | T | **O-05**; LD-17 |
| WP17-A163 (new) | — | A deferral approved, extended or kept open after an outcome | Record. | Pages warn (A71) and SA-04a ends it (A160, A161). Core refusing a post-outcome deferral decision or ending a deferral on an outcome: "Unmet: waits for P-21 item 3b" (parked as a Kind 2 candidate by the orchestrator). The Core test of V19G-13 pins today's behaviour. | T | P-21 item 3b; **O-13** |
| WP17-A164 (new) | — | A price increase on an application recorded as paid | Record. | Pages show the boundary and no difference (A28, A75). Core refusing it, or a selected adjustment process: "Unmet: waits for P-21 item 2" (policy with Max; recommendation refuse). | — | P-21 item 2 |
| WP17-A165 (new) | — | The forecast basis on the TA and staff reads; the held-correction values on TA-07c | Record. | Interim words stand (A32, A34, A44). "Unmet: waits for P-21 item 4" (criterion exceptions with Max). | — | P-21 item 4; **O-04** |
| WP17-A152 (new) | Test (BFF, HTTP; WP-03 fixes) | TA-13b past-date acknowledgement | (1) Past dates, no acknowledgement. (2) Acknowledgement given for other dates (the dates changed after the review). (3) A stale group revision. (4) Same `_op` after acceptance; a resend of the acknowledged form. (5) Future dates sent directly. (6) A raw post with past dates and no acknowledgement field. (7) The binding input. | (1) The review; no command (operations delta 0). (2) A new review for the new dates; no command. (3) CMP-14 (WP03-A21); no command. (4) The same receipt; one date change. (5) No review; one command (WP03-A19). (6) Refused by the BFF; no command. (7) The acknowledgement never reaches Core (no such field in the contract). | T | **O-01**; WP03-A19 to A22 |
| WP17-A153 (new) | Test (Core contract) | Core's own answer to a past-date edit | A direct `core.edit_travel_dates` with a past return date. | Accepted today. "Unmet: waits for P-21 item 1" (a Core defect in the Core batch, P0, failing test first; the lane's browser minimum and acknowledgement stay until it is integrated). | T | P-21 item 1; **O-01** |

### 2.14 Command results, access and shell on WP-17 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A96 | Travel agent; operator; SuperAdmin | Every WP-17 page | Read the shell. | Environment label; "[TEST]"; rail and breadcrumbs of design §1.4 (TA-05, TA-05c, TA-13b under Groups; TA-07 and its task pages under Applications by origin; OP-02 pages under My work; SA-09 kinds and SA-04g under Applications & groups; SA-02d under Work queues); one `h1`; "Read at". | L | Design §1.4; LD-08 |
| WP17-A97 | Test (`bff-timing-forms.test.ts`) | Receipt naming (§0.2 table) | Every result shape at every WP-17 receipt address; the proposal key and the end key at the SA-09d receipt address; another actor's key at each named host (TA-07w, TA-07d, TA-07c, OP-02f, OP-02w, SA-09w). | Named only as the table states. Proposal and end keys at the decision address: "Request recorded". Another actor's key: "Request recorded" with current authorized facts only (O-08). An edited address never shows another command's title. | T | **O-08** (R-08); WP-03 C-03 |
| WP17-A98 | Test | Receipt addresses | Without a key; with `?done=…`; with a refused key. | No receipt from the address; locations carry `&op=`; a refused key: "Nothing is recorded for request [reference] so far". | T | WP-01 A-04 |
| WP17-A99 | Test (`timing-words.test.ts`) | Text map of every code in §0.5 and every assessment code | Unit test against Core's vocabulary. | Each has its sentence per audience (design §2.14); unknown: category text and "Reference code: [code]". | T | §0.5 |
| WP17-A100 | Any (live refusals A02, A41, A48, A57, A77, A85) | Re-rendered task pages | Read. | CMP-07 at the field when Core names one; the task page at the POST address with every value kept; focus to the error summary; no code alone or "Something went wrong". | L | PL §1.1; AC-08 |
| WP17-A101 | Travel agent; operator; SuperAdmin | TA-05, TA-07, OP-02, SA-04a, SA-02d | Look for controls of other roles. | TA pages: no staff control. OP pages: no SuperAdmin decision. SA pages: no operator readiness, filing, release or forecast control. | L | BS B18; UX §2.3 |
| WP17-A102 | Test (`timing-host-pages.test.ts`, route inventory) | Every page | Render; collect form actions. | The only form posting each of the fourteen POST paths of design §1.5 and the admin end route is on its host (T08 TA-05c; T35 TA-07d; T34 TA-07w; T48 TA-07c; O42 OP-02f; O24 OP-02d; O43 OP-02e; O23 OP-02w; O60 OP-02 Work; D128 and the admin end route SA-04a; D24 SA-09d kinds; D101 SA-09p; D22 SA-09w); no TA page posts `/withdraw`, `/price-decision` or `/reapply` outside its task page; no page renders "withdrawn" for a refused request; no TA page names a deferral date it did not read; no amount is a sum or difference; eight new GET rows and one new admin POST row in the inventory. | T | CC-21; design §7.2; O-13 |
| WP17-A103 | Test | Carried-form tests | Run the carried-form tests of WP-03, WP-06, WP-07 and WP-11. | Their WP-17 entries leave (design §1.6); the report-problem count per WP-09; the recheck stays as OP-02's and SA-04a's own form. | T | LD-02; design §1.6, §7.3 |
| WP17-A104 | Travel agent (Y, `syn-ta-2`); operators (OP1, OP2); harness | Isolation (§3 X-1) | `syn-ta-2` opens TA-04 and TA-06. OP2 opens OP-02 of C and its task pages. Y opens SA-04g and OP-02 addresses. Harness: OP2 posts the forecast of C. | `syn-ta-2`: none of Y's groups or applications. OP2 (no grant): not-found; with a read grant (test): facts and "Only the assigned operator takes this step." with no form. Y: not-found. The post records nothing. | L + T | BS B10; design §2.0 |
| WP17-A105 | SuperAdmin (SA1) | The receipt address of V19G-10k (SA2's approval) opened by SA1 after V19G-10n (§3 X-1) | Open. | Unchecked: "Request recorded" with current authorized facts only (Current "No deferral is currently open" or the current open deferral). No named decision, no instruction to act. | L | **O-08**; WP-12 J-09 |
| WP17-A106 | Test | Receipts and statuses after later events | Open each WP-17 receipt after a later withdrawal, outcome, extension, end and group end. | No receipt or page instructs anyone to perform an act; historical receipts keep their recorded facts; later facts are "Current". | T | WP-07 F-33 |
| WP17-A107 | SuperAdmin (SA1) | SA-08s of C's deferrals, of W's withdrawal request and of G (§3 X-1; observe WP-14) | Read. | Only fields recorded on each subject (deferral proposed, approved with review date and extension, ended; withdrawal requested with requester kind and evidence, refused with code and assessment; group dates edited with before, after, open applications), with time, actor and role. The refused sends left no fact. | L | BS B33; K-14 |
| WP17-A108 | Any | Every WP-17 page | Read all text. | No forbidden word of §0.2 "Copy"; "IST" on every time; units on every count; "Synthetic" (CR-08); no package or record id; no configuration value. | L | Design §2.0; PL §11.1 |
| WP17-A109 | Test | Money rendering | Render 350000, 400000, 400050, 300000 and 0 paise. | Every amount through `money()`; paise counts read "[n] paise" where shown. | T | CMP-16; design §5 |
| WP17-A110 | Test | Replay matrix per command (13 and the admin end) | (1) Identical replay. (2) Same `_op`, changed content. (3) Back. (4) Rejected-form refresh. (5) Lost acknowledgement. (6) Business duplicate with a fresh revision. (7) Raw unchanged envelope with a new key. | (1) The original result. (2) `conflict_operation_key`; values kept. (3) A fresh page. (4) Recorded once. (5) C4; the status page links the host. (6) Core's own answer (`deferral_active`, `price_increase_open`, `group_closed`, `outcome_already_recorded`) or a new record where Core has no guard (a forecast; a withdrawal request after a refused one; a pending recheck; a second extension). (7) `stale_revision` where Core checks a revision; the forecast, the recheck and the deferral decision and end answer by state. | T | BS B35; **O-10** |
| WP17-A111 | Test (BFF sweep) | Every WP-17 handler | Search the handlers; post each field at its maximum and maximum + 1. | No `.slice`; over-limit input refused at its field with the value kept whole; never less than the user chose. | T | LD-17 |
| WP17-A112 | Test (HTTP) | The largest valid form of each WP-17 page | Devanagari at the maximum over real HTTP: TA-07w note 2,000; OP-02d justification 2,000; OP-02e note 1,000; OP-02w note 2,000 and reference 120; SA-09d, SA-09p, SA-09w reasons 1,000; the SA-04a end note 1,000; OP-02f note 500. | Each body fits its sized limit (design §2.12 with OP-02e and the admin end added) and reaches Core; a refusal for size is a failure. | T | **O-09**; Q-W17-09 |
| WP17-A113 | Test (HTTP) | Every WP-17 page | (1) The required read unavailable. (2) An optional read unavailable (`core.ta_groups`, `pay.application_payments`, `ops.case_work`). (3) Access revoked between two reads. | (1) S7. (2) "Unavailable" in place of that read's facts, and for a decision page the line "[What] cannot be read now. TravelMudra checks it when you record the decision." with the form. (3) The shell; no earlier facts. | T | LD-14; design §2.0 |
| WP17-A114 | Test | Support views | A support view of Y on TA-05, TA-05c and the TA task pages; of OP1 on OP-02 and its task pages. | Facts with "Read-only view: the travel agent takes this step." and no form; staff task pages show no form; `/admin` 409. | T | Design §2.0 |
| WP17-A115 | Travel agent; operator; SuperAdmin | Task pages with text fields | Inspect browser storage; read the headers. | No note, reason, justification, reference, amount or acknowledgement in browser storage; `no-store`. | L+T | SH-R12 |

### 2.15 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP17-A116 | Keyboard-only user | TA-05c (V19G-2), TA-07w (V19G-3), TA-07d (V19G-10d), OP-02f (V19G-10f), OP-02d (V19G-10i), SA-09d (V19G-10k), SA-09p with its review (V19G-10a), TA-13b review (V19G-10u) at 1440 px; TA-07w, TA-07d at 390 px | Use the keyboard only. | Radio groups, date fields, text areas, the acknowledgement, send and cancel work with Tab, Shift+Tab, Enter, Space and arrows; no confirm dialog. | L | AC-01, AC-12 |
| WP17-A117 | Keyboard-only user | Every WP-17 page at 1440, 390 px and 400% | Tab through. | Focus visible (3:1), never hidden. | L | AC-02 |
| WP17-A118 | Phone user | TA-05, TA-05c, TA-07, TA-07w, TA-07d, OP-02f, OP-02d, SA-09d, SA-04g | 320 px; 1280 px at 400%. | One column; scope, facts and effect before fields; the primary action at the end, never in a fixed bar; SA-04g rows as labelled cards; no horizontal scroll. | L | AC-04, AC-21 |
| WP17-A119 | Any | TA-07d, OP-02f, TA-13b review | Inspect. | The TA-07d decision and the OP-02f basis radio groups are `fieldset` with `legend`, none preselected, the choice kept after a refusal; the acknowledgement is a labelled checkbox naming the dates, never prechecked; SA-09d's hidden decision is named by the button; every input labelled; date hints name IST. | L | AC-05, AC-15; design §5 |
| WP17-A120 | Any | States, reasons, withdrawal results, deferral states, "Ended with the group (not an outcome)" | Greyscale. | Text and icon for every mark; no colour-only state. | L | AC-06 |
| WP17-A121 | Any | TA-07w, OP-02f, OP-02d, SA-09p | Send with an error. | Focus to the error summary; links to fields; values kept. | L | AC-08 |
| WP17-A122 | Screen-reader user | Receipts; CMP-14 comparisons; state-based refusals; boundary notices; SA-04g rows | Read with a screen reader. | Receipts polite without moving focus; the unsent text block is a `blockquote` with a heading, not a live region; notices are notes; each SA-04g row reads applicant, result, then each reason. | L | AC-09, AC-13; design §5 |
| WP17-A123 | Screen-reader user | Each unavailable action (A13 refused preview and W, A18 outcome, A27 assigned, A51 open deferral, A52 W possible filing, A79 open increase, A80 scope change) | Reach the notice. | Reason, owner and route in reading order; no disabled control without its reason. | L + T | AC-13; UX §7.4 |
| WP17-A124 | Phone user | Every WP-17 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions at least 44 × 44 px. | L+T | AC-10 |
| WP17-A125 | — | Every WP-17 page | Contrast. | Text 4.5:1; non-text and focus 3:1. | L+T | AC-11 |
| WP17-A126 | Any | Long text; reduced motion | A 2,000-character justification; a 400-character applicant name; reduced motion. | Wraps; the full text reachable; no transition with reduced motion. | L | AC-14, AC-20 |
| WP17-A127 | Any | Every WP-17 page | Inspect landmarks and headings. | Landmarks; one `h1`; task parts `h2`; logical order. | L | AC-03 |
| WP17-A128 | Travel agent and SuperAdmin (observation) | TA-07 of D after V19G-3; TA-05 of G and TA-07 of D after V19G-10x; TA-07 of U after V19G-10d; SA-04g after V19G-10v | Ask Y "Is D cancelled, completed or still in your group?", "What happened to D after the trip, and is it a visa result?", "What price applies to U, and what would 'decline' have kept?". Ask SA1 "Why do W and C not end with the group?". | The run record reports the answers and the sample size; a wrong answer is a finding. | L | AC-24, AC-26; V24 |

### 2.16 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP17-A129 | Travel agent | TA-05c of G with the close refusal (V19G-2) | L | UX §7.5; AC-01 to AC-28 |
| WP17-A130 | Travel agent | TA-05 of G0 closed, with the receipt (V19G-7) | L | same |
| WP17-A131 | Travel agent | TA-05 of G with ended rows (V19G-10w) | L | same |
| WP17-A132 | Travel agent | TA-07w of D (V19G-3) | L | same |
| WP17-A133 | Travel agent | TA-07w of D with the receipt (V19G-3) | L | same |
| WP17-A134 | Travel agent | TA-07d of U (V19G-10c) | L | same |
| WP17-A135 | Travel agent | TA-07d of U with CMP-14 (V19G-10d tab 1) | L | same |
| WP17-A136 | Travel agent | TA-07 of C with the forecast and the deferral row (V19G-10l) | L | same |
| WP17-A137 | Travel agent | TA-07 of D ended with the group (V19G-10x) | L | same |
| WP17-A138 | Travel agent | TA-13b review with the past-date acknowledgement (V19G-10u) | L | same |
| WP17-A139 | Operator | OP-02f with the error summary (V19G-10f) | L | same |
| WP17-A140 | Operator | OP-02f with the receipt (V19G-10f) | L | same |
| WP17-A141 | Operator | OP-02d with the error summary (V19G-10i) | L | same |
| WP17-A142 | Operator | OP-02e and its "No deferral is currently open" state (V19G-10n) | L | same |
| WP17-A143 | Operator | OP-02w of W "request only" with the error summary (V19G-9) | L | same |
| WP17-A144 | SuperAdmin | SA-02d with the proposed row (V19G-10k) | L | same |
| WP17-A145 | SuperAdmin | SA-09d `deferral_approve` (V19G-10k tab 2) | L | same |
| WP17-A146 | SuperAdmin | SA-09d `deferral_decline` with the state-based refusal and the unsent block (V19G-10k tab 1) | L | same |
| WP17-A147 | SuperAdmin | SA-09p form and its `not_higher` refusal (V19G-10a) | L | same |
| WP17-A148 | SuperAdmin | SA-09w (V19G-10s) | L | same |
| WP17-A149 | SuperAdmin | SA-04g before and after the date check (V19G-6, V19G-10w) | L | same |
| WP17-A150 | SuperAdmin | Operation status page: accepted and "Nothing is recorded" for a refused key (V19G-10j) | L | same |
| WP17-A151 | Gallery | TA-07c and its conflict; TA-07d assigned and paid; OP-02 recheck states; SA-04g every reason, clock and cap; TA-05 closed after the return date; SA-09d outcome warning | L (gallery) | same |
| WP17-A166 (new) | SuperAdmin | SA-04a of C with the admin end-deferral surface (V19G-10p) | L | same |
| WP17-A167 (new) | Travel agent | TA-07w of W, With-the-operator state (V19G-8) | L | same |
| WP17-A168 (new) | SuperAdmin; operator | SA-09p review with the converted amount (V19G-10a); OP-02d of W possible-filing state (V19G-10h) | L | same |

## 3. Proof scenario V19 (group-end part) and the WP-17 journeys (one recipe, O-12)

V19 (UX §12): "Completed processing can retain financial/disclosure follow-up; group-end date closure never consumes
unknown filing, held originals, pending delivery or outstanding money." Authority B25, B29. WP-17 proves the group-end
part; WP-16 the financial follow-up part; WP-14 the disclosure part; WP-12 the originals part. Completion runs only in
tests (LD-04).

One recipe: the design's §6 steps (V19G-1 to V19G-15, V-A) with a fresh travel agent per run, and lettered additions
for the journeys and the live group end (Q-W17-06; §6 Q-18). "Setup" steps use pages of other packages; "Observe" steps
check items other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`, OP2 = `operator-2`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-02d, SA-01; OP1: OP-01; `syn-ta-2`: TA-04, TA-06 | Read. | Baselines of §0.4. | — | L |
| Setup 0 | SA1: SA-06 | Create and activate Y. | Y signs in. | — | L |
| Setup 1 | Y: TA-13a, TA-09, TA-08 | Create G and G0; create D; submit U, W, C. | Two groups; one draft; three submissions. | — | L |
| Branch | Y: TA-07w of U | Read Core's check now. | The run's branch recorded. | A14 | L |
| Setup 2 | SA1: SA-07a, SA-03a; OP1: OP-02, OP-04 | Payments for W and C; assign both to OP1; start work; W: readiness, authorization of the government submission, execution uncertain. | W protected; C worked. | — | L |
| V19G-1 | Y: TA-05 of G | Read. | Rule; facts; link; no form; no verdict. | A01 | L |
| V19G-2 | Y: TA-05c of G | Read; close. | Refused with every condition; form stays; nothing recorded. | A02, A129 | L |
| V19G-3 | Y: TA-07 of D → TA-07w | Read; withdraw with a note. | Aside link; anatomy; "Application withdrawn"; TA-07 rows and panel. | A13 to A15, A38, A132, A133 | L |
| V19G-3a | Harness; Y | Resend the same `_op`; Back. | Same receipt; Withdrawn state. | A15 | L |
| V19G-3b | Y; harness | GET TA-07w; unchanged envelope with a new key; fresh-revision new key. | Withdrawn state; `stale_revision` CMP-14; `outcome_already_recorded` with the unsent note. | A18 | L |
| V19G-4 | Y: TA-05 of G | Read. | D's row and the group-end line. | A09 | L |
| V19G-5 | Y: TA-05c of G | Close again. | Refused (a withdrawn draft is still open). | A02 | L |
| V19G-6 | SA1: SA-04g of G | Read. | Every row "No" with its reasons in T5 words. | A89, A149 | L |
| V19G-7 | Y: TA-05c of G0 | Close. | Neutral receipt on TA-05; closed sentence; TA-13b closed. | A03, A130 | L |
| V19G-7a | Harness; Y | Resend; Back; unchanged envelope with a new key; fresh-revision new key. | Same receipt; Closed state; CMP-14; "closed meanwhile". | A04 (1) to (4) | L |
| V19G-8 | Y: TA-07w of W | Read. | With-the-operator state; the return link on TA-07w; no form. | A13, A167 | L |
| V19G-9 | OP1: OP-02 of W and of C → OP-02w of W | Read; empty reference; record `SYN-LETTER-[stamp]`. | Boundary first; field refusal; "Withdrawal request recorded: refused"; W no outcome. | A56 to A58, A143 | L |
| V19G-10 | Harness | Resend V19G-9's POST. | Same receipt; one record. | A58 | L |
| V19G-10a | SA1: SA-04a of U → SA-09p; harness | Read; `350000` (confirmed); reason "short"; `400000` read the review and confirm; resend. | `not_higher`; reason refused; review "₹4,000 (400000 paise)"; neutral receipt; one record; Y's notice +1. | A74, A75, A77, A78, A147, A168 | L |
| V19G-10b | SA1; harness | GET SA-09p; unchanged envelope with a new key; fresh-revision new key. | No form; CMP-14; `price_increase_open`. | A79 | L |
| V19G-10c | Y: TA-07 of U → TA-07d | Read. | Price rows; TA-07d anatomy with the current-price decline. | A22, A23, A134 | L |
| V19G-10d | Y: two tabs of TA-07d; harness; TA-10 | Tab 1 opens; tab 2 accepts; resend; Back; tab 1 declines; read TA-10. | "You accepted ₹4,000"; same receipt; Nothing-waits; CMP-14; the notice still needs acknowledgement. | A24 to A26, A30, A31, A135 | L |
| V19G-10e | SA1: SA-04a of U; Y: TA-11 (observe) | Read. | Price in effect ₹4,000; quote labelled. | A82 | L |
| V19G-10f | OP1: OP-02 of C → OP-02f; harness | Read; end before start; valid window; resend; Back. | `forecast_window_invalid`; "Forecast recorded"; one forecast; `timing_risk` +1 with `ackRequired: false`. | A39 to A42, A139, A140 | L |
| V19G-10g | Y: TA-07 of C; TA-01; TA-10 | Read. | Estimate and forecast separate; the notice without an acknowledgement request. | A32 | L |
| V19G-10h | OP1: OP-02d of W | Read. | Possible-filing state; no form. | A52, A168 | L |
| V19G-10i | OP1: OP-02d of C; harness | Read; today; 19 characters; valid (today + 7); resend. | `date_invalid`; justification refused; neutral receipt; one deferral. | A46 to A49, A141 | L |
| V19G-10j | OP1; harness; OP-01; status pages | GET OP-02d; unchanged envelope with a new key; fresh-revision new key; OP-01; status pages of a refused key and of V19G-10i's key. | No form; CMP-14; `deferral_active`; OP-01 as Core's answer; status pages. | A50, A51, A150 | L |
| V19G-10k | SA1: SA-02d, SA-01, SA-09d `deferral_decline` (tab 1); SA2: SA-09d `deferral_approve` (tab 2) | SA1 opens tab 1; SA2 approves (today + 7); SA1 declines. | SA-02d and SA-01 +1; neutral receipt; state-based refusal for SA1. | A66 to A69, A144 to A146 | L |
| V19G-10l | OP1: OP-01, OP-02, OP-04 (observe); Y: TA-07 of C, TA-10 | Read. | "Waiting"; O-06 sentence; `deferral_active`; TA-07 deferral row; the notice. | A33, A46, A50, A66, A136 | L |
| V19G-10m | SA2: SA-09d `deferral_extend` of C | Extend to today + 14. | Neutral receipt; new date; Y's notice +1. | A70 | L |
| V19G-10n | OP1: OP-02e; harness | Read; end with a note; resend; GET; saved envelope with a new key. | Neutral receipt "No deferral is currently open"; same on resend; GET "No deferral is currently open"; `stale_revision` with no invented state. | A46, A53, A54, A142 | L |
| V19G-10o | OP1: OP-02d of C; SA2: SA-09d `deferral_approve` | Deferral 2: propose (review today + 10); approve. | Deferral 2 approved. | A49, A68 | L |
| V19G-10p | SA1: SA-04a of C; harness | Read; end deferral 2 with a note; resend. | The admin end surface; neutral receipt; SA-02d row gone; OP-02 "No deferral is currently open". | A159, A160, A166 | L |
| V19G-10q | OP1: OP-02 of C; SA1: SA-04a of C; harness | Read; raw recheck posts. | No section; refusal at the top of the tab; nothing recorded. | A61 | L |
| V19G-10r | Y: TA-07w of U | Accepted branch: send with a note. Refused branch: read the Refused-now state only (the hand-made post is a test). | Accepted: "Application withdrawn". Refused: no form, the reason and its owner line. | A16 | L |
| V19G-10s | SA1: SA-04a of C → SA-09w; harness | Read; empty reference; reason "short"; valid send; resend. | Field refusals; receipt by the branch. | A83 to A86, A148 | L |
| V19G-10u | Setup (labelled, Q-W17-06): Y: TA-13b of G; harness; Y: TA-05 | Post start today − 3 and return today − 1; read the review; acknowledge the exact dates; send; read TA-05. | No command before the acknowledgement; then "Travel dates changed"; rows "Being checked". | A11, A65, A138 | L |
| V19G-10v | SA1: SA-04g of G | Read before the date check. | D, U "Yes, after [return date]"; W, C "No" with their reasons. | A90 | L |
| V19G-10w | Wait; SA1: SA-04g of G, SA-04a of D; Y: TA-05 of G, TA-06, TA-04 | Wait for the next date check (at most the recorded interval); read. | D, U "Ended with the group (not an outcome)"; W, C open with every reason; G open; no success words. | A06, A12, A91, A92, A131, A149 | L |
| V19G-10x | Y: TA-07 of D and U; TA-05c of G | Read; close. | Ended state with history; refused `group_has_open_applications`. | A07, A37, A137 | L |
| X-1 | `syn-ta-2`; OP2; Y; SA1; harness | Isolation reads and posts; SA1 opens SA2's V19G-10k receipt address; SA-08s of C's deferrals, W's request and G. | Delta 0; not-found; nothing recorded; neutral unchecked receipt; recorded fields only. | A104, A105, A107 | L |
| V19G-11 | Test (Core) | `completion-group-end.test.ts`, cited by assertion. | Pass. | A94 | T |
| V19G-11a to V19G-11d | Test (system) | The four isolated exclusion fixtures with their control applications. | Each stays open with exactly its reason; UI assertions pass. | A155 to A158 | T |
| V19G-12 | Test (system) | D and U ended by the test clock; a group closed after the return date; an open increase lapsed. | Rows, SA-04g and TA-07d words. | A08, A37 | T |
| V19G-13 | Test | Approve a proposed deferral after an accepted withdrawal. | Core accepts (today's behaviour); SA-09d warning; SA-04a line. | A71, A163 | T |
| V19G-14 | Test | Decide a deferral after it ended. | State-based refusal; unsent reason. | A71 | T |
| V19G-15 | Test | A price decision posted after the withdrawal. | "This application ended meanwhile. The price stays ₹3,500." | A29 | T |
| T-1 | Test | Closure refusals, states, the two-tab closure, lost acknowledgement. | As the items. | A04 (5), (6), A05, A10 | T |
| T-2 | Test | Past-date acknowledgement and Core's answer. | As the items. | A152, A153 | T |
| T-3 | Test | Withdrawal states, race, refusals, BFF, words; staff branches. | As the items. | A13, A16, A17, A18, A19 to A21, A59, A60, A87, A88 | T |
| T-4 | Test | Price: assigned, paid, refusals, records, the reduction fixture, amounts, scope cause, states. | As the items. | A27 to A30, A75, A76, A80, A81, A154 | T |
| T-5 | Test | Held corrections; timing; forecast BFF, two tabs, states. | As the items. | A34 to A36, A43 to A45 | T |
| T-6 | Test | Deferral hard stops, OP-02e limits, review due, SA-09d states and limits, competing extensions, words; the admin end after an outcome and its refusals. | As the items. | A52, A54, A55, A70, A71 to A73, A161, A162 | T |
| T-7 | Test | Recheck states, results, access. | As the items. | A62 to A65 | T |
| T-8 | Test | SA-04g words and states; no controls. | As the items. | A92, A93, A95 | T |
| T-9 | Test; record | A12, A97 to A99, A102, A103, A104 (read grant), A106, A109 to A115, A123 to A125; record A164 and A165 as Unmet. | As the items. | as listed, A164, A165 | T |
| V-A | axe | Every page and state visited above (design V-A with the WP-17 additions). | No serious or critical violation at 1440 and 390 px. | A129 to A150, A166 to A168 | L |
| X-2 | axe (gallery) | A151. | As V-A. | A151 | L |
| X-3 | Keyboard-only, screen-reader and phone users; Y; SA1 | During V19G-2, V19G-3, V19G-10a, V19G-10d, V19G-10f, V19G-10i, V19G-10k, V19G-10u, V19G-10v and V19G-10x: the accessibility checks, the shell, copy and refusal text, the role checks, the observation questions. | As the items. | A96, A100, A101, A108, A116 to A128 | L |

Proof split. V19 (group-end part) passes when V19G-1 to V19G-10, V19G-10u to V19G-10x and V-A pass on `lane-ui` at
the integrated WP-17 commit, and V19G-11, V19G-11a to V19G-11d and V19G-12 to V19G-15 pass as named tests. The four
exclusion fixtures and the live end (V19G-10w) are never waived: if the date check does not run within the run's
window, the run waits, and V19 is not signed off before V19G-10w passes. With WP-16's financial part, WP-14's
disclosure part and WP-12's originals part, V19 is done. The journeys of withdrawal, deferral, price and timing pass
when their steps and test steps pass. Recorded, not failed: the "Unmet" and "Partly met" items of §0.2 "Pass rule".
Boundaries stated, not crossed: refunds and paid-amount adjustment (B29, B43), generic cancellation (B44), completion
(LD-04). The run record names the `lane-ui` ref, the run tag, the travel agent, the groups, the withdrawal branch, each
test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| TA-13b form, receipt, refusals, stale comparison and replay of `core.edit_travel_dates` | WP-03 (WP03-A18 to A22); the O-01 interim in the WP-03 fixes (asserted here in A11, A152) |
| TA-05 context band, sections, rows; TA-04 list words | WP-03 (WP03-A23, A30 to A33) |
| V19: completed processing keeps financial follow-up | WP-16 (§3 V19 steps; WP16-A18, A24, A32, A110) |
| V19: disclosure follow-up after completion | WP-14 (WP14-A13, A38) |
| V19: originals | WP-12 |
| "Ask your operator for a return" (`purpose=withdraw`), now on TA-07w | WP-09 (WP09-A08, G-12) |
| OP-01 views ("Waiting" for an active deferral; reviews due); the OP-02 banner | WP-07 (WP07-A165; F-07; F-39 with O-06) |
| SA-02d list frame and SA-01 group 6 | WP-06 (WP06-A20; D-23 with O-06) |
| TA notices and their acknowledgement (TA-10); TA-01 travel-date notices | WP-08 (Q-W08-02; E-30 with O-06, O-07); WP-03 |
| SA-04a frame, tabs and the other decisions | WP-11 (I-17) |
| Staff re-application of held corrections | STOP-W11-03, P-17 item 3 (WP11-A50) |
| The audit pages | WP-14 (SA-08s); used in A107 |
| The price in effect on TA-11 | WP-16; observed in V19G-10e |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-17 page:

- A control that ends an application with its group, closes a group as staff, reopens a group, reverses an ended
  application or a withdrawal, or forces completion (BS B21, B24, B25).
- A generic cancellation control (BS B44): a notice only (A83).
- A refund, paid-amount adjustment or credit control; an amount "due", a price difference or a total (BS B17, B29).
- A choice that Core always refuses: the price cause "Change of service scope" (A80).
- A decline choice or receipt that names the original quote as the price kept (O-03).
- A withdrawal form for an assigned application that is not returned (TA-07w shows the TA-07p link only), or a preview
  presented as the final result (A13, A17).
- A deferral word that implies a hold ends by itself or on a date ("waits until", "deferred until", "expires"); a
  page-side "due" or "threatened" computed from dates; an acknowledgement promise for `timing_risk` (O-06, O-07).
- A history the read does not return (an ended deferral's state, held values) (O-04, O-05).
- "Completed", "success", "done" or "closed" for an application that ended with the group or was withdrawn.
- A forecast that replaces the original estimate.
- A WP-17 form outside its host (A102); a decision form on SA-02d.
- A past-date travel-date send without the exact acknowledgement (O-01).
- A result from the page address; an accepted time; a named receipt that the operation does not establish, or a named
  receipt for another actor's operation (O-08).
- A truncated field or a dropped value (LD-17); earlier facts after an access change (LD-14).
- A configuration value in copy (A108).

Recorded as pending, not as failures (§0.2 "Pass rule"): A153 (P-21 item 1), A164 (P-21 item 2), A80 (P-21 item 3a),
A163 (P-21 item 3b), A165 (P-21 item 4), A36 (STOP-W11-03, P-17 item 3); "Partly met": A23, A32, A33, A44, A60, A78,
A86, A91.

Deferred in WP-17 (the run record lists each as "Deferred"): held corrections (A34, A35), the assigned and paid price
cases (A27, A28), the possible-filing paths of OP-02w on a non-protected branch and SA-09w (A59, A87), the recheck
answers (A62, A63), the review-due state (A55), the admin end after completion (A161): tests and gallery. Not
deferrable: the V19 exclusion fixtures (A155 to A158) and the live end (V19G-10w).

Not in WP-17: the TA-13b form itself (WP-03); notice acknowledgement (WP-08); OP-01 views (WP-07); payment and money
follow-up pages (WP-06, WP-16); the audit pages (WP-14); the bulk intake pages (WP-18).

## 6. Questions for the architect (ranked)

Kept as asked, with each answered row reduced to its answer. `WP-17.md` §3, §4.1 and the P-21 dispositions answer:
Q-01 → PM Q-01, O-01 (the lane's review and acknowledgement, A11, A152) and P-21 item 1 (a Core defect in the Core
batch, P0; A153); Q-02 → P-21 item 2 (policy to Max, recommendation refuse; interim boundary, A164); Q-03 → P-21 item 3a
(surface repair in the Core batch; A80); Q-04 → design §2.4, §2.5 (TA-07 and TA-07d state the wait for the return; no
prefill decided); Q-05 → design §2.1 item 3, §2.4 item 1 ("Ended with the group (not an outcome)"); Q-06, Q-07 → STOP-W17-01
parked P2 and P-21 item 4 (exceptions to Max; A165); Q-08, Q-09 → parked P2; Q-10 → Q-W17-08 (accepted); Q-11 → O-13
(the admin end surface on SA-04a; no SuperAdmin forecast page); Q-12 → Q-W17-05 (warning, Core decides) and P-21 item
3b (parked; A163); Q-13 → Q-W17-04 (no form); Q-14 → Q-W17-06 (approved, also the past-date move); Q-15 → Q-W17-09 and
O-09; Q-16 → STOP-W17-14 (parked; E-30 links TA-07d); Q-17 → STOP-W17-11 (with STOP-W16-06). Q-18 is new.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Past travel dates on an edit. | Answered: O-01; P-21 item 1. | — |
| Q-02 | P1 | Price increase on a paid application. | Answered: P-21 item 2 (with Max). | — |
| Q-03 | P1 | `correctionId` missing on the price proposal. | Answered: P-21 item 3a. | — |
| Q-04 | P2 | Price decision waits for a formal return. | Answered: design §2.4, §2.5. | — |
| Q-05 | P2 | Progress words of ended and withdrawn applications. | Answered: design words; Core's derivation unchanged. | — |
| Q-06 | P2 | TA review date, SuperAdmin reason, proposed amount not on the reads. | Answered: parked; P-21 item 4 for the exceptions. | — |
| Q-07 | P2 | Forecast basis on no read. | Answered: P-21 item 4. | — |
| Q-08 | P2 | No withdrawal record on the staff read. | Answered: parked P2. | — |
| Q-09 | P2 | No lifecycle on the group-end read. | Answered: parked P2. | — |
| Q-10 | P2 | Forecast without an expected revision. | Answered: Q-W17-08. | — |
| Q-11 | P2 | SuperAdmin forecast and end without routes. | Answered: O-13 (admin end built); forecast parked. | — |
| Q-12 | P2 | A deferral decided after an outcome. | Answered: Q-W17-05; P-21 item 3b. | — |
| Q-13 | P2 | TA withdrawal with a refused preview. | Answered: Q-W17-04. | — |
| Q-14 | P2 | Proof writes. | Answered: Q-W17-06. | — |
| Q-15 | P2 | Body limits. | Answered: Q-W17-09; O-09. | — |
| Q-16 | P2 | Price-change notice acknowledgement after the decision. | Answered: STOP-W17-14 parked. | — |
| Q-17 | P2 | Money codes on the group-end read. | Answered: STOP-W17-11. | — |
| Q-18 | P2 | The lettered additions write beyond design §6.2's approved set: C with its payment, assignment and start of work; one forecast; two deferrals (one ended on OP-02e, one on SA-04a); the price increase of U and its acceptance; Y's withdrawal request of U; SA1's operational withdrawal request of C. | Without them the price, forecast, deferral, admin-end and operational-withdrawal journeys run only as tests, and C (paid, worked, open) cannot show live that a worked application stays open after the group end. Likelihood: certain. Harm: low (synthetic, run-tagged; C stays open in G). | Approve the writes of §0.2 "Data hygiene" (synthetic only). |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, travel agent used, group labels, withdrawal branch and identifiers (internal record reference) | |
| Date-check interval of the installation and the wait at V19G-10w | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V19 (group-end part) result (steps; tests; exclusion fixtures) | |
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
| WP17-A152 | | | |
| WP17-A153 | | | |
| WP17-A154 | | | |
| WP17-A155 | | | |
| WP17-A156 | | | |
| WP17-A157 | | | |
| WP17-A158 | | | |
| WP17-A159 | | | |
| WP17-A160 | | | |
| WP17-A161 | | | |
| WP17-A162 | | | |
| WP17-A163 | | | |
| WP17-A164 | | | |
| WP17-A165 | | | |
| WP17-A166 | | | |
| WP17-A167 | | | |
| WP17-A168 | | | |
| V19 proof (group-end part) | | | |
