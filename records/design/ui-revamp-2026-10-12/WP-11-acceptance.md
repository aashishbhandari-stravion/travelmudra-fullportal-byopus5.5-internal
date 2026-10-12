# WP-11 acceptance checklist: Reconciliation and unresolved outcome

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-11 Reconciliation and unresolved outcome (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-11-design.md`, `WP-11.md` §3 and amendments I-01 to I-13 (`WP-11.md` §4.1), and WP-07 F-22 to F-28 and F-33 (`WP-07.md` §4.4, §4.6). See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e1f6ac9 (no change under `src/modules`, `src/contracts`, `src/core-api` or `src/kernel` since e9e96e3; the design read f78e558, the same Core); internal records at e2e0535 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages under test for the WP-11 amendments; set-up otherwise); edge http://127.0.0.1:4650 (travel-agent pages: observation, the amended texts and set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-11-design.md`), the architect's decisions (`WP-11.md` §3), the independent design review (lane
`research/reviews/WP-11-design-review.md`, R-01 to R-13, with amendments I-01 to I-13 in `WP-11.md` §4.1, which bind) and
the WP-07 class fix F-33 (`WP-07.md` §4.6, which replaces F-28 and the instruction sentence of F-01) changed the rows
below. No other row changed. Section 6 is kept as asked; its lead names the answers.

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1, verified facts | Design; `WP-11.md` §3, §4.1; review; `WP-07.md` §4.4, §4.6; `PROPOSALS.md` P-17 | Inputs add the design, the package record, the review and P-17. Facts add: the kind names; SA-04a; intake answers `matched_existing` while the exhausted application is open; `fields` is merged without the declaration's validation; the correction POST's body limit is 4096 bytes |
| §0.2 "Paths", "Personas"; §0.3; §0.4; §3; §1.1 | I-12; Q-W11-01, Q-W11-03, Q-W11-08; design §1.3, §6 | One recipe: the design's §6 (U, W, O; the authorized-reassignment case W; the travel-date change). The travel agent is `syn-ta-2` as the design's §6.2 and the approved proof writes (Q-W11-08) say; no account is created; the run tag and the dated group separate runs; `syn-ta-3` is the isolation reader. Kinds `unresolved_outcome`, `correct_outcome`, `correct_fields`, `protection_mark` (no subject). SA-04 is SA-04a. Applications R, C, F of the first version are U and O; F is dropped (an accepted identity correction runs as a test, design §6.1) |
| A01, A02 | I-13; design §2.7 (AM-W11-11) | Group 15 reads "[n] active protection marks" and links to SA-04l `?owner=superadmin`; the "exhausted" line of group 12 has no link |
| A03, A09, A92, A95 | Q-W11-02 | SA-04l and SA-04d are phase 2 (unit U7), separable: "Deferred" when phase 2 is not built |
| A04 to A08, A117 (new) | Design §2.1; I-10; `WP-11.md` §3 PM Q-04 | SA-04a frame, tabs, action panel and decisions list of the design. History: each subject read is named (application, authorization, assignment, protection mark) and paged; a page shows a recorded fact only where `views.audit_subject` returns it as an explicit recorded field, with its time and source; "Full audit history" links to the audit search filtered on the application; nothing is reconstructed from clock order |
| A11 to A21 | Design §2.2, §2.10, §2.11, §2.12; I-05 | Design titles, sections, states, sentences and receipt lines. Attempts or evidence records unreadable: the incomplete-review notice and no form (not the design's "form shows") |
| A25, A118 (new) | Design §2.6, §6 V11-3, V11-6, T6; F-26 | The travel-date change runs live; the offering suspension by test; the F-26 next-step line |
| A27, A28, A111 | F-22 to F-25; I-11 | Design banners; A28 sends the authorization with the current revisions and basis, so that the outcome blockers decide |
| A29, A35 | Design §6 V11-10, V11-18 | Future owner OP3; the follow-up shows in OP3's incidents |
| A30, A31, A32 | E-16; AM-W11-10 | Design words. The TA history line text of A32 is a checklist addition the design does not list (§6 Q-13) |
| A33, A113 | I-12 | Live: `matched_existing`, no new application; after closure: the exhausted-scope refusal by test (T7), with the S-W11-01 text or the UAT-13 code fallback |
| A36, A37, A41, A43 | I-03, I-04, I-11; design §2.3 | The dependent warning in Effect and in the visible review; "no notice" and "no history line" disclosed; the delivered state keeps the form (warning) and Core decides; downloads read "Sent in full"; A43 "Unmet: waits for Max's decision on P-17 item 4" |
| A45 to A54 | Design §2.4; I-07, I-08, I-09, I-11 | Design words and states; the review is the stage sentence and the recorded line (no before and after list); the live refusal on W uses a chosen document (valid business evidence); an accepted identity correction by test; neutral receipt with the correction reference and stage; Core's actual `fields` behaviour pinned (no "nothing recorded" claim for an undeclared key); a real HTTP test under the new body limit; applied and held duplicates separated |
| A50 | I-06 | The unavailable state with the residual disclosed; "Unmet: waits for STOP-W11-03 and P-17 item 3" |
| A55 to A61, A116 (new), A120 (new) | I-01, I-05; Q-W11-03; design §2.5 | Subjectless page; the mark's facts are required decision evidence; a `possibly_filed` mark is "Unmet: waits for Max's decision on P-17 item 1" with the expected results of option A and option B; no item passes a resolution of a `possibly_filed` mark with any reference |
| A66, A67, A115 (new), A119 (new) | I-02 = F-33; I-09 | No page, status read or receipt instructs anyone to perform an act; tests after evidence, after uncertainty, after one reassignment and after OP1 → OP2 → OP1; the SA-09e receipt is neutral |
| A69 | I-11 | Applied duplicate (`correction_no_change`) separated from held duplicate (a second held correction, G-03) |
| A72 | I-05 | Required decision evidence (SA-09u attempts and evidence records, SA-09m mark facts) removes the form; optional guard information (SA-09o delivery facts) degrades |
| A75 | Design §2.0 | `/admin` pages answer 409 `support_view_active` in a support view |
| A77 | Design §7.2, U6 | Test `oversight-host-pages.test.ts`; the kinds join WP-06's route, so phase 1 adds no inventory row |
| A121 (new) | Q-W11-10 | An active mark on SA-09u is a warning, not a block |
| §0.2 "Copy" | F-22 ("No package id on any page") | Where the design's draft copy cites a STOP id in parentheses, the page shows the sentence without the id |
| §5, §6 lead | Review ranks; `WP-11.md` §3, §4.1 | Pending items and the answers; Q-13 added (P2) |

## Lessons applied from the WP-01 to WP-10 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per decision kind (A23, A41, A53, A61); the matrix A69 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A68; every refusal item says "nothing is recorded" and checks it by delta, except where Core records (A51) |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01; WP-11 I-09 | §0.2 "Receipts"; A66 (three of the four results are neutral) |
| No page, status read or receipt ever instructs anyone to perform an act | WP-07 F-01, F-33 (P0 class fix); WP-09 G-10; WP-11 I-02 | A67, A115 |
| Act-kind words: a provider handoff is a handoff, never a filing; staff and travel-agent sentences by shape | WP-07 F-06, F-20, F-21; WP-10 H-13; AM-W11-13 | §0.2 "Unknown-execution words"; A24, A34 |
| Exhausted reconciliation is a state of its own: Core refuses a change of the application's data with `filing_possibly_occurred`; no form; reason shown | WP-09 G-02 | A46, A49 |
| Reconciliation has no stale-state guard: Core reads the act's live state and the current authority | WP-07 F-10 | A28 (no "changed since" refusal expected for an attempt); SA-09u is guarded by the application revision (A21, A22) |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A03 (SA-04l), A32 (history) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred"; A08, A12, A56 |
| Facts from the audit record show only as explicit recorded fields with source and time, read per subject; nothing is reconstructed from clock order | WP-11 I-10 | A07, A08, A56 |
| Expectations name only states that a read returns | WP-10 H-06 | A50 (a held correction is known only from the receipt summary), A58 |
| A state is labelled for the action it was evaluated for | WP-06 D-05 | A15, A37, A46 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A18, A38, A51 |
| No handler truncates, slices or drops a submitted field or an indexed row; over-limit input is refused at the field with the values kept; a body limit fits the supported form | LD-17 (WP-06 D-10, WP-08 E-04, WP-09 G-07, WP-10 H-04); WP-11 I-08 | A26, A44, A54, A63 |
| Identity values map from the posted form, the same for the same input, so that a replay is the same content | WP-03 C-04; WP-09 Q-W09-04; Q-W11-06 | A53, A54 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered, with no exact-parity claim | WP-07 D-W07-16; WP-03 F-W03-11; WP-10 H-02, H-03 | A16, A37, A46 |
| An outage of the evidence that a consequential decision needs removes the form with an incomplete-review notice; optional guard information may degrade; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-11 I-05 | A15, A56, A72 |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A49, A51 |
| A harness envelope that isolates a guard carries current revisions and basis and valid evidence, so that the earlier guards pass | WP-10 H-07; WP-11 I-11 | A28, A48 |
| Evidence selections start unchecked, and after a refusal they are restored from the posted values | WP-09 G-07 | A48, A84 |
| Reassignment races are covered: the previous operator is refused by access; the new operator acts on Core's facts | WP-09 G-09 | A22, A115, A118 |
| No semantic duplicate guard is claimed where Core has none; a new-key duplicate of a held correction records another held correction | WP-08 Q-W08-15; WP-09 G-03 | A53, A61, A69 |
| Proofs rerun with a run tag; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07 | §0.4; §3 step P-0 (the travel agent is the design's `syn-ta-2`: Q-W11-08 approves no account creation) |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| Optional reads never hide an access change | LD-14 | A72 |
| One host page per command use; forms of later packages stay reachable; every rendered form action is a registered route | CC-12 to CC-15; WP-03 Q-01; WP06-A110 | A77 |
| Copy states no configuration number that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A74; §0.2 "Copy" |
| A boundary of a decided policy never says that an owner still has to decide | LD-04; WP-08 Q-W08-03 | A09, A30 |
| Pending reasons read per (reason, next action) | WP-07 F-13 | A30, A62, A117 |
| UI acceptance is separate from Core enforcement; a decision pending with Max or the orchestrator is recorded "Unmet" or "Partly met", not as a failure | WP-10 H-01, H-08, H-11; WP-11 I-01, I-04, I-06 | §0.2 "Pass rule"; A43, A50, A116 |
| A page predicts no Core outcome; it shows Core's current facts | WP-10 H-10; WP-08 E-05 | A13 (no completion claim), A36 |
| Bans are scoped by fact; a download reads "Sent in full" | WP-08 E-12; WP-11 I-11 | A36, A37, A74 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.2, §2.3, §3.1 steps 6 to 9, §3.2 (Unknown external execution, Dependency, Withdrawn/suspended offering), §3.3, §5.1, §5.3, §5.4, §6.1, §6.2, §6.3 (Exception, Support view, Recovery boundary), §7.4, §7.5, §8.3, §12 V11 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B19, B23, B24, B33, B34, B35; B07, B18, B40 for boundaries |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4, §3.3 OP-04, §3.4 SA-01, SA-04, SA-09, §4.2 (Unknown external execution), §5.3 OP-04, §5.4 SA-01, SA-04, SA-09, §6.4, §7 (K-STD), §8, §10, §11, §12.2 WP-11 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (Kind 1 criterion), §3.2 (Kind 2) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 d2df85471c03d0b6… | §3 rows of the three WP-11 commands, `ops.record_reconciliation_attempt`, `core.apply_held_correction`; §5.1; §6 CC-04, CC-15 |
| LP | `PLAN.md` (this folder) | internal e2e0535 | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-16, LD-17), §8 (S-08), §9 |
| PR | `PROPOSALS.md` | internal e2e0535 | P-02, P-10 b, P-17 (items 1 to 4 and the orchestrator's disposition) |
| W6 | `WP-06.md`; `WP-06-design.md` | SHA-256 a967bc071def9e25…; 327f580c1820bf40… | D-02, §4.2 D-14, D-15; design §2.1 (SA-01 groups 12 and 15), §2.7.1, §2.7.5 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 9821d58d41b2cf99…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3 (Q-W07-02), §4.1 F-01 to F-12, §4.2 F-13, §4.3 F-16 to F-21, §4.4 F-22 to F-28, §4.6 F-33; design §2.8.2; WP07-A65 to A71, A76, A160; §3 V10-5 to V10-8a |
| W8 | `WP-08.md`; `WP-08-design.md` | SHA-256 076ac1b04d9119dc… (§4.3 added since); 7a74a46cc1480906… | §3 (Q-W08-03), §4.1 E-05, E-06, E-12, §4.2 E-13 to E-15, §4.3 E-16, E-17; design §1.5, §2.10 |
| W9 | `WP-09.md`; `WP-09-acceptance.md` | SHA-256 97074922067b5db7…; 921a665b20da281a… | G-01 to G-11; format |
| W10 | `WP-10.md`; `WP-10-acceptance.md` | SHA-256 8915f4fe82061cba…; 53f0298e60cd2203… | H-01 to H-14; format, corrections, lessons |
| W11 | `WP-11-design.md`; `WP-11.md`; lane `research/reviews/WP-11-design-review.md` | SHA-256 c4be246b11d299eb…; d4ebe7528824e811…; 4df136cc9c88f549… | design §0 to §9 (§1.2 Core facts, §1.3 pages, §1.5 commands, §1.6 carried forms, §1.8 amendments, §2.0 to §2.12, §3 interims, §4 hostile states, §6 proof, §7 units and tests, §9 STOP items); record §3 (Q-W11-01 to Q-W11-10, PM Q-04), §4.1 (I-01 to I-13); review R-01 to R-13 |
| CAT | `catalogue/synthetic/catalogue.json` | as at e1f6ac9 | "SYN Tourist e-visa": acts `government_submission` and a separate `government_fee_payment`; `documents.formFields` `travelPurpose` (enum, option `tourism`); `deliveryEvidence.external_outcome_unresolved = none`; `completionEvidence.external_outcome_unresolved = []` |
| Code | lane repository | e1f6ac9 | as the first version: `src/modules/core/commands/acts.ts`, `admin.ts`, `drafts.ts`, `common.ts`; `src/modules/core/corrections.ts`, `controls.ts`, `store.ts`, `writers.ts`, `derived.ts`, `facade.ts`, `intake-writers.ts`; `src/modules/operations/case-work/commands/acts.ts`, `results.ts`; `src/modules/delivery/release.ts`, `evidence.ts`; `src/modules/views/case-projectors.ts`; `src/contracts/core.ts`, `operations-work.ts`, `views-cases.ts`, `views.ts`; `src/core-api/bindings/core.ts`, `allowlists.ts`; `src/kernel/command.ts`; `src/apps/staff/core/admin.ts`, `case.ts`; `src/apps/staff/views/cases.ts`; `src/apps/shared/views/cases.ts`; `src/web/ui/presentation.ts`; `test/delivery/kit.ts` |

Verified facts of the code at e1f6ac9 that the items rely on (read by the author; the design §1.2 and the review agree):

- `core.authorize_unresolved_completion` (SuperAdmin; POST `/admin/applications/:applicationId/unresolved-completion`).
  Wire: `futureOwnerAccountId` (text, at most 40), `reason` (text, at most 1000); `_rev.application`. Core: an `acc_`
  id; a reason of 20 to 1000 characters after trim. Order: policy `outcome.authorize_unresolved`; lock of the
  application and each act; revision (`stale_revision`); an outcome exists (`outcome_already_recorded`); no act
  `filing_unknown`, or an act `authorized` (`act_state_transition_invalid`); a `filing_unknown` act without an attempt
  whose result is `no_information` or `inconclusive` (`reconciliation_attempt_missing`); the future owner is not an
  active, MFA-enrolled operator or SuperAdmin (`validation_failed` / `input_invalid`, field `futureOwnerAccountId`, code
  `not_active_staff`). No control stage runs: a protection mark does not stop it. Effects: TA notice
  `external_outcome_unresolved` (`refiling: not_implied`, no acknowledgement); each `filing_unknown` act →
  `reconciliation_exhausted` with the future owner, decider and reason; fact `core.unresolved_completion_authorized`;
  outcome `external_outcome_unresolved` (dependents evaluated; an open price increase superseded). Lifecycle stays
  `submitted`; the assignment stays; money records and held corrections do not change. Result `{applicationId}`.
- After the decision. `ops.record_reconciliation_attempt` and `ops.record_act_evidence` refuse an exhausted act
  (`act_state_transition_invalid`; the act is not open). `core.authorize_external_act` with current revisions refuses
  (`control_blocked`, first `outcome_already_recorded`, with `reconciliation_exhausted_no_refiling` among the
  blockers); with an older revision it refuses `stale_revision` first (I-11). The assigned operator's
  `ops.record_official_result` keeps the outcome, opens `official_fact_follow_up` owned by the future owner and returns
  `followUp: true`. While the exhausted application is open, an individual intake of the same applicant, service and
  group matches it (`matched_existing`) and creates nothing; after it closes, the key guard refuses
  (`reconciliation_exhausted_no_refiling`).
- `core.correct_from_evidence` (SuperAdmin; POST `/admin/applications/:applicationId/correct-from-evidence`; today's
  `bodyLimit: 4096`). Kind `outcome`: evidence present (field `evidence`, `too_small`); revision; business evidence
  (`business_evidence_required`); open; outcome `issued` or `refused`; target differs (`correction_no_change`); any
  qualifying retrieval of the application by the travel agent, an accepted document email, or a dependent that failed
  because of it (`outcome_correction_not_allowed`). Effect: outcome swapped; fact `core.outcome_corrected` (before,
  after, evidence); dependents evaluated, so a confirmed-unfiled dependent can end `dependency_failed`, after which the
  correction back is refused. No notice; no TA history line. Result `{applicationId}`. Kind `fields`: revision;
  evidence; controls of `correct_application` (`protection_mark_active`, `application_not_open`,
  `correction_historical_after_filing`, `filing_possibly_occurred`); same-person evidence
  (`identity_same_person_evidence_insufficient`); `correction_no_change`; `population_out_of_scope`; key guards. Core
  merges `fields` without the declaration's validation (`validateFormFields` is not called): a well-formed undeclared
  key, an option outside the declared enum or a value over the declared length is recorded (I-07). Stage: applied, or
  held while an act is `authorized` or `filing_unknown`. A held correction becomes `superseded_by_filing` (with a
  post-filing incident) or `released_for_reapply`; a released SuperAdmin correction is re-applicable only through
  `core.apply_held_correction`, which the staff allowlist does not hold; re-entering the values does not clear the
  released row, and Core's pending answer keeps naming it (I-06). Result `{applicationId, correctionId, stage}`, the
  same shape as `core.record_assistance_entry`.
- `core.resolve_protection_mark` (SuperAdmin; POST `/admin/protection-marks/:markId/resolve`): the mark of another
  application (`not_found_or_forbidden`); not active (`stale_revision`); at least one evidence item of any kind; reason
  10 to 1000; no revision; no check of the flags or of a re-entry of lost facts (P-17 item 1). Result `{applicationId,
  markId}`. Only the restore procedure creates a mark (`possibly_filed`, `possibly_paid`, `possibly_released`, restore,
  record time). `views.monitors.activeProtectionMarks` counts marks, not applications (I-13).
- Reads. `core.admin_case`: `acts` without future owner, decider or reason; `mark` (`mark_id` of the earliest active
  mark); no corrections; `operators` (assignable operators). `ops.case_work` (admin surface): `actEvidence`,
  `reconciliationAttempts` (no note), `incidents`. `views.audit_subject` reads one subject (application, authorization,
  assignment, protection mark …) from the fact log, paged (I-10). `views.admin_applications`: `filing=unknown`,
  `owner`.
- Today's pages: as the first version (three forms on the old case page; "Authorise unresolved completion" and the
  completion flash; `fields: {}`; the `.slice` truncations; the identity diff at POST time; the TA history line "Closed
  with the outside result unresolved").

### 0.2 Conventions

- **Personas.** Travel agent: `syn-ta-2` (TA), the design's §6.2 owner of the run's group (Q-W11-08: no account is
  created); `syn-ta-3` for isolation only. Operators: `operator-1` (OP1: O's operator; U and W after the reassignment),
  `operator-2` (OP2: authorizes U and W before the reassignment), `operator-3` (OP3: the future owner). SuperAdmins:
  `superadmin-1` (SA1: set-up and the decisions) and `superadmin-2` (SA2: the second tab or second SuperAdmin of the
  races, and observation). They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`. Keyboard-only user.
  Screen-reader user. Phone user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-11 adds is named in the run record with its file and title. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A71). No page shows a package id or a record id such as "STOP-W11-03"; where the design's draft copy
  cites one in parentheses, the page shows the sentence without it (F-22).
- **Unknown-execution words (staff; design §2.9).** `authorized` "Authorized; execution not yet evidenced" (status
  fact) and the F-33 banner "Authorized by [name] at [time] IST. Execution not yet evidenced. If the act was performed,
  record the evidence. If you cannot tell, mark the execution uncertain."; `filed_evidenced` "Filed (evidence
  recorded)"; `not_filed_evidenced` "Not filed (evidence recorded)"; `filing_unknown` "Execution uncertain: filing
  unknown"; `reconciliation_exhausted` "Reconciliation exhausted: filing unknown". A provider handoff: "Handoff
  authorized; not yet evidenced", "Handed to the provider (evidence recorded)", "Not handed over (evidence recorded)",
  "Handoff uncertain", "Reconciliation exhausted: handoff unknown". Outcome `external_outcome_unresolved`: staff
  "Reconciliation was exhausted. The filing state is unknown and it is never repeated."; travel agent AM-W11-10. No
  page instructs anyone to perform an act (F-33). Elapsed time never changes a state word, and no page shows how long
  ago an act became uncertain: no "not filed", "failed", "expired", "timed out", "abandoned" or "lapsed" for an
  uncertain or exhausted act. The unresolved decision is never "completed", "completion", "closed", "done" or
  "resolved". No page offers "refile", "file again" or "retry" for an application whose filing may have happened.
  "Refiling is never implied" and "is never repeated" are allowed in negation.
- **Correction words.** Applied: the details change now. Held: "recorded and held: the details do not change". Not
  possible: the state sentence of design §2.4. "Correct" never reads as "Override" or "Edit".
- **Protection-mark words.** "Held after a restore". No "restored", "recovered" or "reopened".
- **Delivery words.** A travel agent's download reads "Sent in full on [time] IST", never "Received" (WP-08 E-12).
- **Dates and times.** Every time carries "IST" (AD-10, CR-06).
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `dlv.*`, `views.audit_subject`) shows "Read at
  [time] IST". A projection (`views.admin_applications`, `views.ta_history`) shows the lag form. No age threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact from the audit record shows only where
  the subject read returns it as an explicit recorded field, with its time and source; otherwise "Not shown on this
  page" with the audit link (`WP-11.md` §3 PM Q-04; I-10). A fact read after an operation is labelled "Current". A
  count that a read cannot give shows "Unavailable", never "0" (D7).
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface (A66).
  Otherwise it reads "Request recorded" with the current facts labelled "Current" (WP-06 D-02; I-09). A receipt never
  tells anyone to perform an act (F-33). The polite region announces it.
- **Replay terms** (used by every "Nth time" item; the five terms of the lane):
  1. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope); a double-click on the final button is the same case. Expected: the original result, nothing new.
  2. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form
     (`conflict_operation_key` / `operation_key_reused`); the page re-renders with a new form key, the typed values kept
     and "This form was already used with different content. Your values are kept: check them and send again.";
     nothing recorded.
  3. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. Back sends nothing.
  4. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  5. *Lost acknowledgement* (fixture): 303 to `/admin/operations/<key>` (CMP-13) "Checking the original result" and
     "Check status"; no new send of the same intent is offered there.
  Two more cases belong to the replay matrix (A69), never to a term: a *business duplicate* (a new key with the current
  page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta.
- **Paths (LD-03; design §1.3; WP-06 D-15).** Existing paths and form actions stay. SA-04a
  `/admin/applications/:applicationId?tab=overview|application|acts|delivery` (kept path, rebuilt). Decision kinds on
  WP-06's route: SA-09u `/admin/applications/:applicationId/decide/unresolved_outcome`; SA-09o `…/decide/correct_outcome`;
  SA-09e `…/decide/correct_fields`; SA-09m `…/decide/protection_mark` (no subject: the application's current active
  mark). POSTs unchanged: `/admin/applications/:applicationId/unresolved-completion`, `…/correct-from-evidence` (hidden
  `kind`), `/admin/protection-marks/:markId/resolve`. Phase 2: SA-04l `/admin/applications`, SA-04s `/admin/search`,
  SA-04g `/admin/groups/:groupId`, SA-04d `/admin/applications/:applicationId/delivery`. SA-01 `/admin`. The audit:
  subject pages `/admin/audit/:subjectType/:subjectId`; the audit search filtered on the application. Pages of other
  packages: OP-01, OP-02, OP-04a, OP-04b (WP-07); OP-05, OP-07, TA-07r, TA-10, TA-07x (WP-08); TA-07, TA-09 and the
  group page (WP-03); SA-03a, SA-03c, SA-07a (WP-06).
- **Pass rule.** WP-11 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V11 proof of §3 passes, except the explicitly
  deferred items of §5. Recorded, not failed: A116 "Unmet: waits for Max's decision on P-17 item 1"; A43 "Unmet: waits
  for Max's decision on P-17 item 4"; A50 "Unmet: waits for STOP-W11-03 and P-17 item 3"; A08 and A56 "Partly met"
  until STOP-W11-02 and STOP-W11-01 (P-17 item 2) where the audit read does not return the field. Phase 2 items are
  "Deferred" when phase 2 is not built. A failed item becomes a finding ranked P0, P1 or P2 with its scenario
  (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-02, WP-03, WP-06, WP-07, WP-08, WP-09 and WP-10 are integrated (design §6.1). Where
  one is not, the step runs on the existing page and the run record says so. The processing instance runs.
- **Data hygiene.** WP-11 writes only the approved proof writes (Q-W11-08): one group, three applications, one payment
  record each, three assignments, two reassignments, the authorizations, one filed record, one outcome and its
  correction, one unresolved decision, one later fact, the refused or matched intake, and the travel-date change. It
  MUST NOT change seeded offerings, declarations, launches, ceilings or accounts, MUST NOT suspend or withdraw an
  offering, MUST NOT create an account or a read grant, and MUST NOT run a restore or record a protection mark (B40).
  Notes, references and evidence carry the run tag. Identifiers stay in the internal record only.

### 0.3 Synthetic data used by WP-11

| Item | Value | Use |
|---|---|---|
| Travel agent | TA = `syn-ta-2` (design §6.2) | U, W, O |
| Group | `wp11-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days; later +31/+41 (the rule change) | U, W, O |
| U | "SYN Tourist e-visa"; assigned to OP2, reassigned to OP1; authorized and uncertain before the reassignment | The unresolved path: reconciliation by the new operator, the decision, the later official fact |
| W | "SYN Tourist e-visa"; assigned to OP2, reassigned to OP1 while its act is still `authorized` | The authorized-reassignment case (F-33); then uncertain; the held-stage correction refusal |
| O | "SYN Tourist e-visa"; assigned to OP1; filed; outcome "Refused" with no file | The outcome correction Refused → Issued; the historical correction state |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPELEVEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`). Given names: U "UMESH", W "WAMAN", O "OMKAR" | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Payments | "Payment received" for U, W and O, evidence `SYN-V-[stamp]` | Gate 1 and Gate 2 pass on payment |
| Evidence values | `SYN-PORTAL-O-[stamp]`, `SYN-REF-O-[stamp]`, `SYN-LATER-[stamp]`, `SYN-CORR-[stamp]`; notes and reasons "WP11 [stamp] …" (the unresolved reason at least 20 characters) | Act evidence, attempts, decisions |
| Fixtures (tests only) | An active mark through `recordProtectionMark` or as `test/delivery/kit.ts` does, with each flag combination; a held SuperAdmin correction (as `case-rules.test.ts:316-334` plus an `authorized` act); a document that shows a new identity value; a provider-handoff application; a suspended offering; a dependent linked to an issued upstream; a completed exhausted application | T items |

### 0.4 Run recipe (rerunnable)

- Run tag `wp11-[yyyymmddhhmm]`. First check: the harness can sign in TA, OP1 to OP3, SA1 and SA2, and "SYN Tourist
  e-visa" admits TA (TA-03).
- Baseline (step P-0, before the set-up): OP-01 view counts of OP1 and OP2 (Action now, Waiting, Delivery and
  closure); OP3's incidents count; SA-01 group 12 lines and group 15; TA's TA-10 count. Every later count check is a
  delta from it.
- Setup (labelled "Setup", design §6.2 S1 to S5): TA creates the group and submits U, W and O; SA1 records the payments,
  assigns U and W to OP2 and O to OP1; OP2 starts work and confirms readiness on U and W, OP1 on O; OP2 requests the
  authorization of the government submission for U and W and records "Execution is uncertain" on U; OP1 authorizes O,
  records "Filed" and records the outcome "Refused" with no file.
- Order (§3): P-0, Setup, V11-1 to V11-23 with the lettered additions, then V11-X1 to V11-X3. Data of earlier runs stays
  and is excluded by its tag and group label.

### 0.5 Refusal shapes in the code at e1f6ac9 (category / code)

| Command | Refusals the items assert |
|---|---|
| `core.authorize_unresolved_completion` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; support view); `validation_failed` / `input_invalid` on `reason` (fewer than 20 or more than 1000 characters), `futureOwnerAccountId` (blank or not an account id), `expectedRevision`; `stale_revision` / `stale_revision`; `control_blocked` / `outcome_already_recorded`; `control_blocked` / `act_state_transition_invalid`; `control_blocked` / `reconciliation_attempt_missing`; `validation_failed` / `input_invalid` field `futureOwnerAccountId` code `not_active_staff`; `conflict_operation_key` / `operation_key_reused` |
| `core.correct_from_evidence`, kind `outcome` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `outcome`, `evidence` (`too_small` when the reference is blank; `business_evidence_required` for a statement alone, harness only), `reason`, `expectedRevision`; `stale_revision` / `stale_revision`; `control_blocked` / `outcome_correction_not_allowed`; `validation_failed` / `correction_no_change` |
| `core.correct_from_evidence`, kind `fields` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on identity lengths, field keys (pattern) and values (at most 500), at most 100 keys, `declaredCountry`, `evidenceVersionIds` (more than 4), `evidence`, `reason`; `stale_revision` / `stale_revision`; `control_blocked` with the `correct_application` blockers: `protection_mark_active`, `application_not_open`, `correction_historical_after_filing`, `filing_possibly_occurred`; `control_blocked` / `identity_same_person_evidence_insufficient`; `validation_failed` / `correction_no_change`; `control_blocked` / `population_out_of_scope`; `conflict_duplicate` / `duplicate_open_scope`; `control_blocked` / `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required`. Not refused today: a well-formed undeclared field key, an option outside the declared enum, a value over the declared length (I-07). The BFF body limit (4096 bytes today) refuses a large valid form before Core (I-08) |
| `core.resolve_protection_mark` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; the mark of another application); `validation_failed` / `input_invalid` on `evidence` (blank reference), `reason`, `applicationId`; `stale_revision` / `stale_revision` (not active). No refusal for a `possibly_filed` mark exists today (P-17 item 1) |
| Sent by harness steps, owned elsewhere | `ops.record_reconciliation_attempt`, `ops.record_act_evidence` on an exhausted act: `control_blocked` / `act_state_transition_invalid`; by the previous operator: `not_found_or_forbidden`. `core.authorize_external_act` on U: before the decision `act_already_open`; after it, with current revisions and basis, `outcome_already_recorded` with `reconciliation_exhausted_no_refiling`; with an older revision `stale_revision`. `intake.start_individual` of U's applicant: `matched_existing` while U is open; `reconciliation_exhausted_no_refiling` after U is closed. `dlv.retrieve_document` (admin) while a mark is active: `protection_mark_active`. Any `/admin` page or post in a support view: 409 `support_view_active` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-11 |
|---|---|---|
| SA-04a Application (SuperAdmin) | 4652 `/admin/applications/:id?tab=…` (kept, rebuilt) | Identity band, protected-state banner, status facts, action panel "Next decision", decisions list, four tabs, "Full audit history"; the carried WP-17 forms |
| SA-09u Record the external outcome as unresolved | 4652 `…/decide/unresolved_outcome` | Scope, evidence (acts, evidence records, attempts), effect, hard stops, owner and reason; states; the decision |
| SA-09o Correct the recorded outcome | 4652 `…/decide/correct_outcome` | Outcome now and target; delivery facts (warning); the dependent warning; disclosures; the correction |
| SA-09e Correct application details from evidence | 4652 `…/decide/correct_fields` | Identity, residence and `field.<key>` inputs; evidence; the effect by stage; the correction |
| SA-09m Resolve the protection mark | 4652 `…/decide/protection_mark` | The current mark's facts (required), effect, hard stops; the resolution; the `possibly_filed` case (P-17 item 1) |
| SA-01 Decision inbox | 4652 `/admin` (WP-06 page) | Groups 12 and 15: lines and links (AM-W11-11; I-13) |
| OP-04a, OP-04b, OP-02 | 4652 (WP-07 pages) | Amendments F-22 to F-27 and F-33 as WP-11 V11 shows them |
| OP-05, OP-07, TA-07r, TA-07, TA-10, TA-07x, TA-09 | 4652, 4650 (WP-08, WP-03 pages) | E-16, E-17, AM-W11-10; observation; the intake of the same applicant |
| SA-04l, SA-04s, SA-04g, SA-04d (phase 2) | 4652 (kept paths) | Lists, search, group and SuperAdmin delivery view with the single-file retrieval (Q-W11-02) |
| Old SuperAdmin case page | 4652 | Becomes SA-04a; the four WP-11 forms leave it (A77) |

Read models: SuperAdmin case (`core.admin_case`), Case work (`ops.case_work`), Audit subject (`views.audit_subject`, per
subject), SuperAdmin applications (`views.admin_applications`, projection), Monitors (`views.monitors`), Delivery page
(`dlv.delivery_page`, staff), Packet handovers (`dlv.packet_handovers`), Operator case (`core.ops_case`), TA application
case (`core.ta_application`), TA history (`views.ta_history`, projection), Notices (`dlv.notices`), Operation
(`core.operation`).

### 1.2 Command coverage (CC §5.1: 3 WP-11 commands; CC-15)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `core.authorize_unresolved_completion` | `admin.applications.unresolved_completion` (`…/unresolved-completion`) | SA-09u (kind `unresolved_outcome`) | A11 to A26, A121; consequences A27 to A35, A118 |
| 2 | `core.correct_from_evidence` | `admin.applications.correct_from_evidence` (`…/correct-from-evidence`) | SA-09o (kind `correct_outcome`); SA-09e (kind `correct_fields`) | A36 to A44 (outcome); A45 to A54 (fields) |
| 3 | `core.resolve_protection_mark` | `admin.protection_marks.resolve` (`/admin/protection-marks/:markId/resolve`) | SA-09m (kind `protection_mark`, no subject; CC-04) | A55 to A64, A116, A120 |
| ref | `ops.record_reconciliation_attempt` | `ops.case_work.reconciliation` | OP-04b (WP-07, Q-W07-02) | WP07-A67, A68, A76 and §3 V10-7 to V10-8a own it; WP-11 does not repeat them. WP-11 asserts the amendments F-25, F-26 (A28, A118) and uses it as set-up (§3 V11-9) |

All of them also: A65 (shell), A66 (receipt), A67 and A115 (no instruction to act), A68 (no record for a refusal; lost
acknowledgement), A69 (replay matrix), A70 and A71 (refusal text), A72 (LD-14 and I-05), A73 to A78 (role controls,
copy, read grant and support view, storage, host pages and carried forms, isolation).

UI-PLAN §12.2 names two actions for WP-11: "Record reconciliation evidence" (`ops.record_reconciliation_attempt`, built
in WP-07) and "Record unresolved external outcome" (command 1). The register adds command 2 and command 3 (CC-04).

Commands outside WP-11 that the proof touches only as set-up or observation: `intake.start_individual`, `core.submit`
(WP-03); `core.edit_travel_dates` (carried WP-17 form); `pay.record_service_status`, `core.assign`, `core.reassign`
(WP-06); `ops.start_work`, `ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence`,
`ops.record_reconciliation_attempt` (WP-07); `ops.record_official_result` (WP-08). The byte release
`dlv.retrieve_document` (admin routes) is carried on SA-04d (phase 2, A09).

### 1.3 State coverage

S1 (loading) does not apply: every WP-11 page is server-rendered. S5 applies only to SA-04l and TA-07x (projections).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-09u | Allowed A11 to A14; closed, decided, outcome recorded, execution not recorded, no unknown filing, attempt missing, evidence unreadable A15; mark warning A121 | A17 | A18 | A19, A20 | A23 (5) | A21, A22 |
| SA-09o | Allowed A36; closed, no outcome, not correctable, delivered (warning) A37 | A38 | A37, A38 | A39, A40 | A41 (5) | A41 |
| SA-09e | Open and held stages A45, A46; closed, mark, historical, unresolved A46, A49 | A48, A51 | A48, A51 | A50, A52 | A53 (5) | A53 |
| SA-09m | No mark, allowed A58; facts unreadable A56; `possibly_filed` A116 | A59 | A59 | A59, A60 | A61 (5) | A61 (no revision: the §2.5 C2 state) |
| SA-04a | Open, filing unknown, exhausted, marked, completed, ended with group, S4 A04 to A08, A117 | — | carried WP-17 forms (A06) | — | — | — |
| SA-01 | Groups 12 and 15 A01, A02 | — | — | — | — | — |
| OP-04a, OP-04b, OP-02 | Authorized after reassignment A115; uncertain after reassignment A118; exhausted A27 | — | A28 | — | — | — |
| OP-05, OP-07; TA pages | Follow-up A29; completion rows A30; TA A31 to A33 | — | A33 | A29 (observe) | — | — |
| Phase 2: SA-04l, SA-04d | A03, A09 | — | A09 | A09 | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-11 shows | Items |
|---|---|---|
| V11: a current-authorized user records or reconciles an already attempted act after an assignment or rule change, without an offer of unauthorized new filing; historical evidence remains intact | After the travel-date change and the reassignment OP2 → OP1, OP1 reconciles U and records W's uncertainty; no page tells OP1 to perform W's act and no page offers a new authorization; the SuperAdmin records the unresolved outcome from the attempts; afterwards no attempt, evidence or authorization is accepted; a later official fact opens a follow-up and keeps the outcome; every earlier record stays with its actor and time | A11 to A35, A115, A118; §3 |
| UX §3.2 Unknown external execution: protect possible filed facts | Banners on SA-04a and OP pages; corrections held or refused | A05, A27, A46, A49 |
| UX §3.2: keep proposed corrections separate | A held correction changes no shown detail and says so; the re-apply gap and its residual are disclosed | A46, A50 |
| UX §3.2: show reconciliation evidence, owner and next step | SA-09u and SA-04a list evidence records and attempts and the owner; F-26 names the next step | A05, A12, A118 |
| UX §3.2: never label elapsed time as "not filed" | Sweep test | A34 |
| BS B23: exhausted reconciliation, administrative unresolved outcome, attempts, reason, TA notice, future owner; never safe refiling; B24 prerequisites still apply | SA-09u decision and its effects; no completion claim | A13, A19, A20, A28, A30, A33 |
| BS B23 and V10 (class): authorization is permission, not execution; no blind repeat | F-33 everywhere, after reassignments | A115 |
| BS B19: protected or filed facts remain historical; no latest-write-wins | Corrections refused as historical; reassignment moves the duty, not the history | A22, A35, A49 |
| BS B33: actor, evidence, reason, before and after; required evidence unavailable means no claimed action | Audit facts per subject; evidence outages remove decision forms | A07, A15, A56 |
| BS B34; V15 (part): sole writers; no SuperAdmin filing or readiness privilege | SuperAdmin pages hold no operator control | A10 |
| BS B35 | Replay per kind; the matrix | A23, A41, A53, A61, A69 |
| BS B40; UX §6.3 Recovery boundary | SA-09m resolves a mark only, restores nothing; the `possibly_filed` case waits for Max | A57, A64, A116 |
| V24 (keyboard and phone) | The WP-11 tasks by keyboard and at 390 px | A79 to A90 |

## 2. Acceptance checklist

### 2.1 Oversight: SA-01, SA-04a and the phase 2 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A01 | SuperAdmin (SA1) | SA-01 group 12 "Uncertain external results" at P-0 and at §3 V11-22 | Read the group. Follow its link. | "Acts whose filing is unknown: [n]" links to SA-04l `?filing=unknown`; "Acts closed with reconciliation exhausted: [n]" has no link (no list read; it needs no action). Deltas from P-0 at V11-22: unknown +1 (W), exhausted +1 (U). The filtered list shows W and not U. A count that cannot be read shows "Unavailable", never "0". | L | WP-06 design §2.1 group 12; design §2.7 (AM-W11-11) |
| WP11-A02 | SuperAdmin; test | SA-01 group 15 "Protection marks after a restore" | Read the group (lane: 0). Test: two marks on one application. | The line reads "[n] active protection marks" (the count is of marks, not applications: I-13); with work, it links to SA-04l `?owner=superadmin` with "Held applications show 'Held after a restore' as their reason."; a zero count shows in "Nothing waiting now". Two marks on one application count 2 and the text names marks. | L (count) + T | `derived.ts:498`; design §2.7; I-13; STOP-W11-04 |
| WP11-A03 | SuperAdmin (SA2) | SA-04l saved view "Filing uncertain" (phase 2) | Open the view. Clear it. Open a view that matches nothing. | `h1` "Applications"; projection lag line; saved views All, Waiting on a SuperAdmin, Filing uncertain, Travel-date recheck pending, Payment follow-up open; rows: applicant (link SA-04a), reference, service, progress, Core's reason sentence and owner label, payment status words; "Read the next part of the list" at 200 rows, no total. S2 "No application exists yet."; S3 "No application matches this view." with "Clear the filter". The change announces the result count and keeps focus (AC-16). "Deferred" when phase 2 is not built. | L | design §2.8; Q-W11-02; AC-16, AC-22; LD-08 |
| WP11-A04 | SuperAdmin (SA1) | SA-04a of U, W and O (§3 V11-1, V11-17, V11-21) | Read the frame on each tab. | Breadcrumb "Applications & groups › Applications › [applicant]"; "Read at [time] IST". Identity band: `h1` "[SURNAME], [Given names]"; "Application [reference]"; "Passport ending [last 2 characters]" (the full number only on the Application tab and SA-09e); service; kind (shape words); group; travel agent; operator. Protected-state banner (alert order of design §2.1.1 item 4). Status facts as separate rows: Progress, Outcome, Next, Stage, Editing, External acts (one line per act, §0.2 words), Readiness, Holds, Service payment, Gate exceptions open, Originals (when any), Delivery evidence. Tabs (links, `aria-current="page"`): Overview, Application & documents, External acts, Delivery & originals; then the link "Full audit history". No combined badge; no operator action. | L | UX §2.2, §6.2; PL SA-04; design §2.1.1 |
| WP11-A05 | SuperAdmin (SA1) | SA-04a of U, External acts tab (§3 V11-1, V11-9) | Read the tab. | Context line "The assigned operator performs, records and reconciles external acts. A SuperAdmin reads them here and records the unresolved outcome when the attempts cannot establish the filing." Act block `h3` "Government submission: Execution uncertain: filing unknown"; authorized by [OP2] at [time] IST; reconciliation owner [name now]. Under it from `ops.case_work`: "Evidence records" (result words, references, event time, recorded by, recorded at) and "Reconciliation attempts" (method words, result words, concluded evidence, recorded by, recorded at), with "The notes of the attempts are not shown on staff pages in this release."; no edit or delete control on any row. Banner: "Filing outcome is unknown. Do not repeat the external action. [owner] is reconciling the evidence." No text states how long ago the act became uncertain. Link "Record the external outcome as unresolved" → SA-09u. `ops.case_work` unavailable: "Evidence records and attempts cannot be read now." | L | UX §3.2, §5.3; BS B23, B33; design §2.1.6; STOP-W11-08 |
| WP11-A06 | SuperAdmin; test | SA-04a Overview, section "Decisions on this application", for U, W, O, a marked fixture and a closed fixture | Read the section. | One row per decision kind that applies to Core's facts now, in design order, each with one fact line and a link: "Resolve the protection mark" (mark: "Mark [reference] holds this application.") → SA-09m; assignment and gate rows (WP-06/07); help and flag rows (WP-09); "Record the external outcome as unresolved" (no outcome and an act `filing_unknown`: "[n] act(s) with an unknown filing; [m] reconciliation attempts recorded." or "Attempts: unavailable") → SA-09u; "Correct the recorded outcome" (open, Issued or Refused: "Outcome now: [outcome].") → SA-09o; "Correct details from evidence" (open: "Information version [n].") → SA-09e; the carried WP-17 rows. A closed application: "No decision applies to a closed application." and the mark row only when a mark exists. No row is called "Override". The carried WP-17 forms (price increase, operational withdrawal, deferral, travel-date recheck) keep their markup, fields, action and success flash; a refusal re-renders SA-04a with the error at its form. | L + T | PL SA-04; design §1.6, §2.1.4; CC-15; LD-02 |
| WP11-A07 | SuperAdmin (SA1) | SA-04a of U and O after §3; the audit pages they link to | Follow "Full audit history" and each act's "Audit history of this act". | "Full audit history" opens the audit search filtered on the application (I-10). Each act links to `/admin/audit/authorization/<aut>`; a mark links to `/admin/audit/protection_mark/<pmk>`. Where a WP-11 page shows a fact from the audit record, it reads it from a named subject read (application, authorization, assignment, protection mark), paged, and shows only explicit recorded fields with their time and source (for O: "Outcome corrected: Refused → Issued" with the reference, the SuperAdmin and the time). No page reconstructs a fact from clock order or from the order of reads. | L | BS B33; UX §2.3 ("History"), §7.4 Timeline; I-10; `WP-11.md` §3 PM Q-04 |
| WP11-A08 | SuperAdmin (SA1) | SA-04a of U after the decision and the later fact (§3 V11-18) | Read the status facts, banner, External acts and Delivery & originals. | Outcome "External outcome unresolved" with the staff meaning; banner F-24 "External outcome unresolved: the filing of the government submission could not be established. It is treated as done and never repeated."; act "Reconciliation exhausted: filing unknown"; "Owner of a later official fact:" the recorded future owner where the authorization subject read returns it as a recorded field (with time and source), else "not shown on this page" with the audit link ("Partly met" until STOP-W11-02); every earlier evidence record and attempt still listed; continuing duties: the follow-up incident with its owner OP3. Lifecycle "Submitted"; no "Completed", "Closed" or "Done". | L | UX §2.2, §3.2; BS B23; design §2.1.6, §2.1.7, §3; STOP-W11-02 |
| WP11-A09 | SuperAdmin; test | SA-04d of O (phase 2) and of a marked fixture | Read the page. Retrieve one file with a purpose and a reason. Test: a purpose of 61 characters; a retrieval while a mark is active. | The WP-08 OP-06 renderer in read mode (no operator record form); the completion boundary with WP-08's wording and no control (CC-07; LD-04); per file "Purpose" (select of the closed list, none preselected) and "Reason"; one file only. The purpose is read whole (today `purpose.slice(0, 60)`, LD-17). A refused retrieval re-renders SA-04d with purpose and reason kept and Core's reason (a marked application: files are not released while it is held after a restore). Downloads read "Sent in full". "Deferred" when phase 2 is not built. | L + T | design §2.8; WP-08 design §1.5; `release.ts:202`; PL §7 K-BYTE |
| WP11-A10 | SuperAdmin; harness | SA-04a, SA-09u, SA-09o, SA-09e, SA-09m of U and O | Look for operator controls. Harness as SA1: post a reconciliation attempt, an act evidence record and an authorization on U. | No SuperAdmin page shows a control to authorize an act, record act evidence or an attempt, mark execution uncertain, confirm readiness or record an official result; the readiness row says "The assigned operator makes this judgement." Each harness post is refused as not found or forbidden; nothing is recorded (attempt and evidence counts delta 0). | L | BS B18, B34; UX §2.3, §12 V15 |
| WP11-A117 (new) | Test | SA-04a action panel "Next decision" (`test/unit/web/oversight-reading.test.ts`) | Render for each row condition of design §2.1.3, including a mark together with an inactive operator. | First match of the closed table: mark → "Resolve the protection mark with evidence of what the restore may have lost" → SA-09m; inactive operator → "Reassign" (after the mark row); assign; help; flag; deferral; `held_correction_released` → row 7 (A50); travel recheck; `reconcile_filing` → "Waiting on [operator]: reconcile whether the government submission was filed" with "Open the external acts" and, when SA-09u's guard facts hold, "Record the external outcome as unresolved"; another owner → "Waiting on [owner]: [step]" with "The assigned operator makes this judgement."; `unresolved_known_limitation` → "Not available in this release" with WP-08's sentence, never "Owner not yet decided". The panel states no permission. | T | design §2.1.3; WP-07 F-13; LD-04; BS B18 |

### 2.2 SA-09u Record the external outcome as unresolved (`core.authorize_unresolved_completion`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A11 | SuperAdmin (SA1) | SA-09u of U (§3 V11-10), from SA-04a | Open the page. Read Scope. | The SA-09 frame in UX §7.3 order. Breadcrumb "Applications & groups › Applications › [applicant] › [decision]". `h1` "Record the external outcome as unresolved: [applicant]"; "Read at [time] IST". Scope: Application [reference] · Service · Kind · Travel agent · Operator; "Acts: each act of this application whose filing is unknown: Government submission." No "complete", "completion", "close", "override" or "Authorise" anywhere. | L | UX §6.3; PL SA-09; design §2.2 items 1, 2; Q-W11-01 |
| WP11-A12 | SuperAdmin (SA1) | SA-09u of U, Evidence | Read it. | Per act whose filing is unknown: state words; authorized by [OP2] at [time] IST; reconciliation owner [OP1]; its evidence records (OP2's uncertain record) and attempts (OP1's) as A05, with the notes line; a link → `/admin/audit/authorization/<aut>`. Other acts: one line each. Service payment (WP-06 words); a fee-carrying act in `filing_unknown`: "Payment unknown". No line derives a filing state from time. | L | UX §3.2; BS B23; design §2.2 item 3 |
| WP11-A13 | SuperAdmin (SA1) | SA-09u of U, Effect, Hard stops, Review | Read them. | Changes: "Each act listed in the scope closes as 'Reconciliation exhausted'. Whether it reached the authority stays unknown, and it stays treated as done." · "The application's outcome becomes 'External outcome unresolved'." · "The travel agent receives the notice 'The external outcome could not be confirmed.'" · "The person you name owns any later official fact: when an official result arrives, recording it opens a follow-up that this person owns. The outcome does not change." Unchanged: no act repeated and no new act offered, "Refiling is never implied"; evidence and attempts stay as recorded; money records do not change; "The application is not completed. Completion still needs every requirement TravelMudra lists on Request completion; the completion step is not available in this release."; held corrections stay held and are never applied; a new application for the same applicant and service in this group is not created. Hard stops: "This decision never allows the act to be repeated. …" Review (visible): "When you record it: [acts] close as reconciliation exhausted; the outcome becomes External outcome unresolved; the travel agent is notified; [the chosen person] owns any later official fact; your name, the reason and the time are recorded. It cannot be undone, and the act is never repeated." | L | UX §3.2, §6.3; BS B23, B24; design §2.2 items 4, 5, 7; D-W11-09 |
| WP11-A14 | SuperAdmin (SA1) | SA-09u of U, Your decision | Inspect the fields. | "Owner of any later official fact" `futureOwnerAccountId` (select, required, placeholder "Choose a person", none preselected): one option per active operator "[name] (operator)", then "You ([display name])"; hint "An active operator or SuperAdmin with a second factor. They own the follow-up if an official result arrives later. Other SuperAdmins are not listed here.", linked by `aria-describedby`. "Reason" (textarea, maxlength 1000, hint "At least 20 characters. Name the attempts and why no further attempt can establish the filing. Recorded with the decision and shown in the audit history."). Hidden `_rev.application`. Buttons "Record the unresolved external outcome" (primary, destructive variant) and "Cancel" → SA-04a `?tab=acts`. No confirmation checkbox. | L | design §2.2 items 6, 8; Q-W11-05, Q-W11-07; D-W11-08 |
| WP11-A15 | SuperAdmin; test | SA-09u in each state (first match) | Open the page: (1) closed; (2) decided (U after V11-11); (3) another outcome recorded; (4) an act `authorized` (fixture); (5) no act `filing_unknown`; (6) an act without a qualifying attempt (U at V11-2); (7) `ops.case_work` unavailable (availability failure); (8) an access refusal of that read. | (1) "This application is closed. Its outcome stays as recorded." (2) "Recorded: the external outcome is unresolved. Acts closed as reconciliation exhausted: [acts]." with "Full audit history". (3) "The outcome is already recorded: [outcome]. An unresolved external outcome applies only before an outcome." (4) "[Act] is authorized and what happened is not recorded yet. The assigned operator records the evidence, or that the execution is uncertain, first. Owner: [operator]." (5) "No act of this application has an unknown filing. This decision does not apply." (6) "Each act whose filing is unknown needs at least one reconciliation attempt that found no information or was inconclusive. Missing for: [acts]. Owner: [reconciliation owner], on the act's page." (7) The frame and Scope stay; Evidence reads "The evidence records and reconciliation attempts cannot be read now."; CMP-10 "The review is incomplete: the reconciliation evidence cannot be read now. Try again later. Owner: TravelMudra." (I-05; not the design's "form shows"). (8) The shell access page (LD-14). No form in (1) to (7). | L ((2), (6)) + T | design §2.2 states; I-05; WP-07 F-04; LD-14 |
| WP11-A16 | Test | The SA-09u renderer and `core.authorize_unresolved_completion` | Fixtures: outcome present or not; acts in each state and combination; attempts with each result; `ops.case_work` available or not; future owner active, suspended, without a second factor, a SuperAdmin not listed. Render, then send the form (or a saved envelope) for each fixture. | Where Core accepts and the evidence is readable, the renderer shows the form. Where the read facts show a refusing fact, the renderer shows A15's state and Core refuses with that code. Listed discrepancies (H-02): during an evidence outage Core would accept but the page shows no form (I-05, by design); another SuperAdmin as owner is accepted by Core and not listed (Q-W11-05); an owner suspended after the read is refused at the field. | T | WP-10 H-02, H-03; I-05 |
| WP11-A17 | SuperAdmin (SA1) | SA-09u of U (§3 V11-10) | Choose OP3; enter the reason "Short" and send. Harness: a reason of 1001 characters; a blank owner. | C1 at the reason field "Enter at least 20 characters."; OP3 stays chosen; the 1001-character reason is refused at its field ("Enter at most 1,000 characters.") with the value kept, never cut; the blank owner is refused at the owner field. Nothing is recorded (act states and outcome unchanged). | L | design §2.12; AC-08; LD-17 |
| WP11-A18 | SuperAdmin; harness; test | SA-09u refusals | (1) Harness: a send with U's current revision at V11-2. (2) Test: an act became `authorized` before the send. (3) Test: another outcome recorded with a fresh revision. (4) Harness: a suspended operator's id. (5) Harness: as an operator; as `syn-ta-3`. | (1) The "Attempt missing" sentence, form-level (`reconciliation_attempt_missing`). (2) The "Execution not recorded" sentence (`act_state_transition_invalid`). (3) "The outcome was recorded meanwhile: [outcome]. Nothing was recorded now." with the state and the unsent text (`outcome_already_recorded`). (4) At the owner field: "That person cannot own later official facts now: not an active operator or SuperAdmin with a second factor. Choose another." (`not_active_staff`), the reason kept. (5) Not found; no fact shown. Nothing is recorded in each case (act states, outcome and notice count delta 0). | L ((1), (4), (5)) + T | §0.5; design §2.12 |
| WP11-A19 | SuperAdmin (SA1) | SA-09u receipt (§3 V11-11) | Record the decision with OP3 and a reason of 20 or more characters. | C3 neutral "Request recorded" (the result carries the application only). Current: "Outcome External outcome unresolved"; "Government submission: Reconciliation exhausted: filing unknown"; "No external act is repeated for this application." "Recorded once. …" No accepted time; no "completed", "closed" or "the administrative completion was recorded". Then the "Decided" state. The polite region announces it; focus does not move. | L | CMP-08; WP-06 D-02; design §2.10 |
| WP11-A20 | SuperAdmin; operator; TA | Reads after §3 V11-11 | Read SA-04a, OP-04b, TA-07 and TA-10 of U. | The formerly uncertain act "Reconciliation exhausted"; the outcome recorded; one TA notice (TA-10 count +1 from P-0); OP1 still the assigned operator; lifecycle "Submitted"; evidence records and attempts unchanged in number and content. | L | `acts.ts:194-213`; BS B23 |
| WP11-A21 | SuperAdmin (SA1, second tab) | SA-09u of U (§3 V11-12) | Open SA-09u in a second tab before V11-11. After V11-11 send from it. | CMP-14 "Changed since your review." with "Outcome: Outcome not recorded / External outcome unresolved", the act states (seen / current) and the attempts count; the owner choice and reason kept as unsent values; nothing recorded (one decision fact, one notice). | L | design §2.11, §6 V11-12; BS B19, B35 |
| WP11-A22 | Test | SA-09u opened, then a change before the send | (1) A reassignment. (2) A concluding attempt ("Found it was filed"). (3) A further non-concluding attempt. (4) A new act authorized. | (1) and (2): CMP-14 with the current facts; after (2) a reload shows A15 (5). (3): accepted (no revision change; F-10); no "changed since" refusal expected and no new guard proposed. (4): CMP-14 or the "Execution not recorded" sentence. Nothing recorded except in (3). | T | design §4.3; WP-09 G-09; WP-07 F-10 |
| WP11-A23 | SuperAdmin (SA1); harness | SA-09u, the Nth time | Replay terms 1 to 5 on V11-11. Term 2 changes the owner. Term 3: Back after the receipt. Harness: a new-key send with the current revision. Term 4: A17, then the corrected send. | (1) The same 303 and receipt; one fact; one notice (dedupe key `external_outcome_unresolved:<app>`). (2) Refused as a used form; values kept. (3) Back reloads SA-09u in the "Decided" state, no form; the new-key send is refused `outcome_already_recorded` and records nothing. (4) Recorded once. (5) 303 to `/admin/operations/<key>`; a reopened SA-09u with a new key is refused by the outcome guard once the first committed; no pending mode is needed (no external act). | L+T | design §4.1; PL §7 K-STD; BS B35 |
| WP11-A24 | Test (design T8) | SA-04a, SA-09u, OP-04b, TA-07 of a provider-handoff application, before and after the decision | Render; send the decision. | Handoff words: "Handoff uncertain", "Reconciliation exhausted: handoff unknown"; staff AM-W11-13 "Whether the handoff to the provider happened could not be established. It stays treated as done: the application is never handed over again."; the travel-agent sentence neutral. No text says the application was or was not filed with the authority. | T | design §2.9, AM-W11-13; WP-07 F-06, F-21 |
| WP11-A25 | TA; operator (OP1); test (design T6) | Rule change: travel dates (§3 V11-3, V11-6); offering suspension (test) | TA changes the travel dates to +31/+41 on the group page. OP1 reads OP-04b of U. Test: suspend the offering while an act is `filing_unknown`; the operator records an attempt; SA1 records the decision. | The date change is accepted. The reconciliation form stays on OP-04b of U; Core's travel-date recheck answers "historical or held" for U and never blocks the reconciliation. Test: the attempt and the decision are accepted; OP-04a shows no form with the launch blocker words; no page offers a new act. | L + T | UX §3.2 (Withdrawn/suspended offering); BS B07, B23; design §2.6, §4.3; V11 |
| WP11-A26 | Test | The SA-09u handler | Send an owner id of 41 characters and a reason of 1001 characters. | Every field reaches Core whole; Core's contract refuses at the field; values kept; no `.slice` (today `admin.ts:602`). BFF test with a scripted Core. | T | LD-17; D-W11-06 |
| WP11-A121 (new) | Test | SA-09u while a protection mark is active (fixture) | Render; send the decision. | The Evidence section shows the warning "A post-restore protection mark holds this application. The restore may have lost a record of this filing. Resolve the mark first if its evidence can establish the filing."; the form shows; Core accepts (no control stage). No page blocks it. | T | Q-W11-10; STOP-W11-07; design §2.2 item 3 |

### 2.3 Operator and travel-agent pages in V11

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A115 (new) | Operator (OP1); test | OP-04b, OP-02 and OP-04a of W after the reassignment OP2 → OP1 while W's act is `authorized` (§3 V11-8); receipts and status reads | Read OP-04b, the action panel and the status facts. Test: replay the authorization receipt of W, and read every authorized-state renderer, after evidence, after uncertainty, after one reassignment, and after OP1 → OP2 → OP1. | The F-33 banner: "Authorized by [OP2] at [time] IST. Execution not yet evidenced. If the act was performed, record the evidence. If you cannot tell, mark the execution uncertain." The action-panel step: "Record what happened to the act authorized by [OP2]". Modes "Record external action evidence" and "Execution is uncertain"; no authorization form anywhere (Core `act_already_open`). No page, status read or receipt contains an instruction to perform the act for any viewer, the authorizer included: the F-01 sentence "Perform the act only if it has not been attempted" and the F-28 text are absent; "performed" appears only in the conditional "If the act was performed". The host-page test (A77) asserts it for OP-02, OP-04a and OP-04b. | L+T | `WP-07.md` F-33 (P0 class fix), F-01; I-02; BS B19, B23; UX §12 V10, V11 |
| WP11-A118 (new) | Operators (OP1, OP2); harness | OP-04b of U and OP-04a of U and W after the reassignment (§3 V11-5 to V11-7) | OP2 reloads OP-04b of U and OP-04a of W. OP1 reads OP-04b of U and OP-04a of U for both act kinds. Harness as OP2: a reconciliation attempt on U. Harness as OP1: a new authorization of U's submission. | OP2: SH-02 "Your access changed" on both; the attempt refused for access; nothing recorded. OP1 on OP-04b of U: owner "[OP1] (you)"; the WP-07 sentence; the F-26 line "If the attempts cannot establish the filing, a SuperAdmin may record the outcome as unresolved. That needs at least one attempt that found no information or was inconclusive."; the reconciliation form; OP2's uncertain record listed with OP2's name; the travel-date change neither blocks nor removes the form. OP-04a: no form for the submission ("already authorized … may have happened") nor for the fee act (F-02 reason); the harness authorization refused `act_already_open`; nothing recorded. | L | design §2.6, §6 V11-5 to V11-7; F-26; WP07-A66, A70 (observed) |
| WP11-A27 | Operator (OP1) | OP-04b, OP-04a and OP-02 of U after the decision (§3 V11-13) | Read every tab and both act pages. | OP-04b F-22: "Reconciliation exhausted: a SuperAdmin recorded the outcome 'External outcome unresolved'. Whether the government submission reached the authority could not be established. It stays treated as done: it is never repeated, and no new government submission is offered. If an official result arrives later, record it on Outcome and result file; it opens a follow-up and does not change the outcome." No mode links. OP-04a F-23: "A new government submission is never offered for this application: the filing of an earlier act could not be established (External outcome unresolved). No exception exists for this control." with no owner and no route. OP-02 F-24 banner on every tab; status fact "Reconciliation exhausted: filing unknown". OP2's record and OP1's attempt unchanged. No package id on any page. | L | `WP-07.md` F-22 to F-24; design §2.6 |
| WP11-A28 | Harness (OP1); test | Commands on U after the decision (§3 V11-14) | Re-post the V11-9 reconciliation envelope with a new `_op`. Post an act evidence record from `filing_unknown`. Test: an authorization of the submission with U's current revisions (application, hold, material) and the current basis digest and readiness id; the same with an older revision. | The attempt and the evidence: refused; OP-04b re-renders with F-25 "A SuperAdmin closed this act's reconciliation (External outcome unresolved). Nothing was recorded. Record a later official result on Outcome and result file." and the typed note in the unsent text block (`act_state_transition_invalid`); attempts still one. Test: the current-revision authorization is refused with `outcome_already_recorded` first and `reconciliation_exhausted_no_refiling` among the blockers (I-11); the older revision is refused `stale_revision`. Nothing recorded. No "changed since" refusal is expected for an attempt (F-10). | L + T | §0.5; `WP-07.md` F-25, F-10; I-11 |
| WP11-A29 | Operators (OP1, OP3); SuperAdmin | OP-05 of U; OP3's incidents; SA-04a (§3 V11-18) | OP1 records a later official fact "Issued" with `SYN-LATER-[stamp]` and no file. | Receipt "Later official fact recorded. The outcome stays External outcome unresolved. A follow-up is open." (observe WP-08); the outcome stays; OP-05 item 10 reads E-17. A follow-up incident "A later official fact after an unresolved outcome" owned by OP3 (the future owner) appears on OP3's incidents (+1 from P-0) and on SA-04a continuing duties; no page says that U was issued or that the earlier submission was filed. | L | BS B23; `writers.ts:340-350`; `results.ts:110-123`; E-17 |
| WP11-A30 | Operator (OP1); SuperAdmin | OP-01 row, OP-02 action panel, OP-07 of U after the decision (§3 V11-19) | Read. | OP-07 `no_possible_filing`: "Filing could not be established: recorded as External outcome unresolved" (E-16), never "No filing is in doubt"; the completion boundary in WP-08 words, no control. OP-01 places U by WP-08's mapping of Core's pending answer; never "Owner not yet decided". | L | E-16; LD-04; WP-08 E-05, E-06; WP-07 F-13 |
| WP11-A31 | TA | TA-07 of U after the decision (§3 V11-15) | Read the page. | Outcome "External outcome unresolved" with AM-W11-10: "TravelMudra could not confirm whether its external step reached the authority. It is treated as done: TravelMudra does not file this application again. If an official result arrives later, TravelMudra records it."; the completion sentence of E-16 ("TravelMudra could not confirm whether its external step went through. This is recorded as the outcome."). No submit, file or file-again control; no "Not filed", "Failed", "Refused", "Completed" or "Closed". | L | AM-W11-10; E-16; UX §2.2, §3.2 |
| WP11-A32 | TA; test | TA-10 and TA-07x of U (§3 V11-15) | Read the notice and the history. Test: the history line renderer. | TA-10: one notice for U (+1 from P-0), no acknowledgement, no read marker; text "The external outcome could not be confirmed. TravelMudra does not file this application again." TA-07x, lines with "Recorded [time] IST" and the lag freshness: "Outcome recorded: External outcome unresolved"; the notice line; the decision line in words that claim no closure (today "Closed with the outside result unresolved", `shared/views/cases.ts:102`; the design does not list this text: §6 Q-13). | L+T | AM-W11-10; LD-06, LD-08; UX §2.2 |
| WP11-A33 | TA; test (design T7) | TA-09 of the group (§3 V11-16); test after closure | Start an individual intake of U's applicant (same passport) on "SYN Tourist e-visa". Test: the same after U is completed (harness completion), and in another group. | Live: no new application (application count delta 0); TA-09 shows Core's `matched_existing` result naming U, with no way to create a second application (I-12). Test: after closure, refused `reconciliation_exhausted_no_refiling` with the S-W11-01 text "This applicant has an earlier application for this service in this group whose filing could not be confirmed. TravelMudra does not file it again, so no new application was created." or, until the seam note is accepted, the code under the UAT-13 fallback; another group: Core decides as usual. | L+T | BS B23; I-12; `intake-writers.ts:96-110`; `writers.ts:76-84`; S-W11-01 |
| WP11-A34 | Test | Elapsed-time sweep (`unresolved-outcome.test.ts` and the U5 tests, or the design's names) | Render SA-04a, SA-09u, SA-09e, OP-01 rows, OP-02, OP-04a, OP-04b, OP-07, TA-07, TA-10, TA-07x for acts `authorized`, `filing_unknown`, `reconciliation_exhausted`, of each kind, authorized 1 hour, 30 days and 400 days before. | No "not filed", "failed", "expired", "timed out", "abandoned", "lapsed", "completed", "completion", "closed" or "resolved" for these acts or this outcome; no "[n] days ago"-style age; §0.2 words; no instruction to perform an act (F-33); every `EXTERNAL_ACT_STATES` value has staff and TA words with the code fallback. | T | UX §3.2; BS B23; design §2.0 "Copy"; F-33 |
| WP11-A35 | SuperAdmin; operator | SA-04a and OP-04b of U after §3 V11-18 | Compare with the records of Setup and V11-9. | Every earlier record stays with its original actor and time: OP2's authorization and uncertain record, OP1's attempt, SA1's decision (audit), OP1's later fact. Nothing is edited, merged or hidden; the reassignment shows as an assignment fact. | L | UX §12 V11; BS B19, B33 |

### 2.4 SA-09o Correct the recorded outcome (`core.correct_from_evidence`, kind `outcome`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A36 | SuperAdmin (SA1) | SA-09o of O (§3 V11-21) | Open from SA-04a (Delivery & originals). Read the page. | `h1` "Correct the recorded outcome: [applicant]". Scope: "The outcome of application [reference]: from Refused to Issued, from evidence. Target: the other of Issued and Refused." Evidence: Outcome now; the filed act and its evidence references; result files; downloads by the travel agent ("Sent in full on [time] IST"; opt.); accepted result emails (opt.); "Applications that depend on this one are not listed on this page." Effect, changes: "The outcome becomes Issued now." and (I-03) "Related applications that depend on this outcome are evaluated again: one that is not filed can end as 'Dependency failed', and then this outcome can no longer be corrected here." Unchanged: the earlier outcome stays in the audit history; result files, association and delivery records do not change; the external acts do not change. Disclosures (I-04): "TravelMudra posts no notice to the travel agent for this correction." and "The travel agent's history keeps the earlier outcome line and gets no correction line." Hard stops as design §2.3 item 5. Fields: "Evidence reference" (required, maxlength 120, hint "The reference that shows the correct outcome: the authority's reference or the document number."); "Reason" (at least 10 characters); hidden `kind=outcome`, `outcome=issued`, `_rev.application`. Review (visible): "When you correct it: the outcome becomes Issued now; a related application that is not filed can end as 'Dependency failed', and then this correction cannot be reversed here; the travel agent gets no notice and no history line; the previous outcome, your evidence, reason, name and time are recorded." Button "Correct the outcome to Issued"; "Cancel" → SA-04a `?tab=delivery`. | L | design §2.3; I-03, I-04; PL SA-04; BS B19, B33 |
| WP11-A37 | SuperAdmin; test | SA-09o in each state (first match) | (1) Closed. (2) No outcome. (3) An outcome other than Issued or Refused (U after V11-11). (4) The delivery read shows a download sent in full or an accepted result email (fixture). (5) The delivery read unavailable. (6) A dependent failed because of it (not on the read). | (1) "The application is closed: its outcome is historical. An owned incident is the remedy." No form. (2) "No outcome is recorded yet." No form. (3) "Only Issued and Refused can be corrected here." and, for `external_outcome_unresolved`, "A later official fact is recorded on Outcome and result file and opens a follow-up; the outcome stays." No form (live on U). (4) The form stays with the line "The result was delivered to the travel agent (Sent in full, [time] IST). TravelMudra refuses a correction after a delivery; an owned incident is then the remedy." (I-11: the delivered form stays; Core decides; Core's guard covers any qualifying retrieval of the application, not only result files); a send is refused with CMP-10 "This outcome can no longer be corrected here: the result was delivered, or a related application failed because of it. The remedy is an owned incident. Owner: SuperAdmin." and the unsent text block. (5) The delivery facts read "Unavailable"; the form shows; Core decides (optional guard information, I-05). (6) The form shows; Core refuses as in (4). | L ((3)) + T | design §2.3 states, §2.12; I-05, I-11; WP-10 H-02 |
| WP11-A38 | SuperAdmin (SA1); harness | SA-09o of O (§3 V11-21) | Send with no reference and a short reason. Harness: the same target after the correction with a fresh revision; a statement-only evidence item; a send as an operator. | C1: on the reference "Enter the evidence reference."; on the reason "Enter at least 10 characters."; values kept. Harness: "The outcome is already Issued. Nothing changed." (`correction_no_change`); the statement alone refused at the evidence (`business_evidence_required`); the operator: not found. Nothing is recorded (outcome unchanged; audit facts delta 0). | L | §0.5; design §2.12 |
| WP11-A39 | SuperAdmin (SA1) | SA-09o receipt (§3 V11-21) | Record the correction. | C3 neutral "Request recorded"; "Current: Outcome Issued". No claim about any dependent; no accepted time. | L | design §2.10; WP-06 D-02 |
| WP11-A40 | SuperAdmin; operator; TA | SA-04a, OP-02, OP-05, TA-07 of O after the correction | Read. Open O's audit subject page. | Every page shows the current outcome "Issued". The audit subject page shows the before and after fact ("Refused → Issued") with the reference, the SuperAdmin and the time. No page shows both outcomes as current. | L | BS B19, B33 |
| WP11-A41 | SuperAdmin (SA1, second tab); harness | SA-09o, the Nth time and the race (§3 V11-21) | Send from a tab opened before the correction. Replay terms 1 to 5; term 3: Back after the receipt. | The old tab: CMP-14 "Outcome: Refused / Issued"; evidence and reason kept as unsent values; nothing changed. (1) The original receipt; one fact. (2) Refused as a used form. (3) Back reloads SA-09o with "from Issued to Refused", empty reference and reason: Back sends nothing. (4) Recorded once. (5) The operation page. Business duplicate (new key, same target, fresh revision): `correction_no_change`. Raw stale envelope: `stale_revision`. | L+T | design §4.1, §6 V11-21; PL §7 K-STD |
| WP11-A42 | Test | Dependents of a corrected outcome | Fixture: T depends on E (`needs_tourist_evisa`, required `issued`), T confirmed unfiled; T2 with an `authorized` submission. Correct E from Issued to Refused; then back. | T ends "Dependency failed"; T2 keeps its protection and its owner gets a follow-up (Core's rule); the correction back is refused (`outcome_correction_not_allowed`) and SA-09o shows the CMP-10 of A37 (4). The warning of A36 showed in Effect and in the review before the first send. | T | I-03; `admin.ts:57-69`; `writers.ts:189-225`; P-17 note |
| WP11-A43 | TA | TA-07, TA-10 and TA-07x of O after the correction (§3 V11-21) | Read. | TA-07 shows "Issued". No notice is posted and TA-07x keeps "Outcome recorded: Refused" with no correction line: recorded "Unmet: waits for Max's decision on P-17 item 4" (a notice is Kind 2; the history line needs a criterion exception), not a failure. The page invents no line. SA-09o disclosed both before the send (A36). | L | I-04; BS B21, B33; P-17 item 4 |
| WP11-A44 | Test | The SA-09o handler | Send an `outcome` of 41 characters, a reference of 121 characters and a reason of 1001 characters. | Every field reaches Core whole or is refused at its field with the value kept: no `.slice` (today `admin.ts:613`). BFF test. | T | LD-17; D-W11-06 |

### 2.5 SA-09e Correct application details from evidence (`core.correct_from_evidence`, kind `fields`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A45 | SuperAdmin (SA1) | SA-09e of W (§3 V11-20) | Open from SA-04a (Application & documents). Read the page. | `h1` "Correct application details from evidence: [applicant]". Scope: "Application [reference]: identity details, country of residence, application information. Information version [n]." Evidence: the identity documents of this application (requirement and version reference); the acts and their states; "Corrections held while a filing was uncertain are not listed on this page." Fields prefilled with the exact stored values: surname, given names, date of birth, passport number (mono), issuing country, nationality; country of residence; one `field.<key>` input per declared form field with its kind, required flag, length and options (for "SYN Tourist e-visa": travel purpose, option "Tourism"); fieldset "Evidence" with one checkbox per identity document, never prechecked; "Evidence reference (optional)" (hint "Needed when no document is chosen."); "Reason" (at least 10 characters). Hidden `kind=fields`, `_rev.application`. Button "Record the correction"; "Cancel" → SA-04a `?tab=application`. | L | design §2.4; D-W11-04; Q-W11-04 |
| WP11-A46 | SuperAdmin; test | SA-09e effect and states by Core's facts on the read (first match) | Open the page for: closed; a mark (fixture); filed or packet released (O); reconciliation exhausted (U after V11-11); an act `authorized` or `filing_unknown` (W at V11-20, U before V11-11); open (fixture). | Closed: "The application is closed: its details are historical." Mark: CMP-10 "Corrections are unavailable while a post-restore protection mark holds this application. Owner: SuperAdmin, who resolves the mark with evidence." with a link to SA-09m. Historical: "The application was filed or its packet was released: its details are historical. A correction after filing is an owned incident." Unresolved: "The filing could not be established (External outcome unresolved): the attempted details stay as if filed. No correction applies." No form in these four. Held stage: the form with "A filing may have happened. Your correction is recorded and held: the details do not change while the government submission's filing is unknown. If evidence shows the act was filed, the held correction becomes a post-filing correction incident. If it shows it was not filed, the correction is released to be applied again by a SuperAdmin; applying it again is not available on staff pages in this release." Open stage: the form with "The details change at once. A readiness judgement recorded before the change is out of date; the assigned operator confirms readiness again. The assigned operator is notified. Changed identity details are checked against the chosen document, and the application's identity documents are evaluated again." Both: "The earlier values stay in the history with your evidence and reason." | L (O, U, W) + T | design §2.4 item 4 and states; WP-09 G-02; UX §3.2 |
| WP11-A47 | SuperAdmin (SA1) | SA-09e review and hard stops (§3 V11-20) | Read them before the button. | Hard stops: "A changed identity detail needs an identity document of this application that shows the new values and at least two unchanged details among surname, given names, date of birth and passport number. A statement alone is never enough. The population scope (Indian ordinary passport, resident in India) cannot change." Review (visible): the stage sentence of A46, then "Your name, the evidence, the reason and the time are recorded." (no before and after list on the page). | L | design §2.4 items 5, 7 |
| WP11-A48 | SuperAdmin (SA1); test | SA-09e of W (§3 V11-20); test of an accepted correction | Change the given names to a value not on the passport; tick the passport (valid business evidence); add a reason; send. Test: an open-stage fixture with a document that shows the new value; send it. | Live: refused at the evidence fieldset "The chosen documents do not show the new details with at least two unchanged details of the same person. Choose the document that shows them." (`identity_same_person_evidence_insufficient`; the evidence passes input validation, so the same-person rule decides, I-11); the typed values and the tick stay (G-07); SA-04a still shows the old name; nothing recorded (information version delta 0). Test: accepted; receipt per A66 ("Request recorded"; recorded "Correction [reference]: applied"); Current: the new identity details. | L + T | §0.5; design §2.12, §6 V11-20; I-09, I-11 |
| WP11-A49 | SuperAdmin (SA1); test | SA-09e of U and O on GET (§3 V11-17, V11-21); saved envelopes in a test | Open each page. Test: a saved envelope with a current revision to U after the decision and to O after its filing. | U after the decision: the "Unresolved" state, no form. O: the "Historical" state, no form. Test: Core refuses `filing_possibly_occurred` (U) and `correction_historical_after_filing` (O) with the design's sentences and the state; nothing recorded. | L (GET) + T | WP-09 G-05; design §2.4 states, §2.12 |
| WP11-A50 | Test (design T2) | A held SuperAdmin correction (fixture: an `authorized` act) | Send a correction. Then (a) record the act as filed; (b) instead record it as not filed. Read SA-04a and SA-09e after each; then record the same values again on SA-09e. | Receipt: neutral "Request recorded"; recorded "Correction [reference]: recorded and held. It waits for the filing evidence of [act]."; Current: the unchanged details; the snapshot unchanged; the operator notified. (a) Superseded; a post-filing correction incident on SA-04a continuing duties. (b) Released: SA-04a action panel row 7 "A correction held while a filing was uncertain was released by evidence that it was not filed" with "Unavailable in this release", "Applying a released correction again is not available on staff pages in this release. Record the correction again from evidence if it is still needed." and the residual (I-06): "Recording it again does not clear the released correction: TravelMudra's next step keeps naming it." Recording again is accepted and the pending answer still names the released correction. Recorded "Unmet: waits for STOP-W11-03 and P-17 item 3" (staff route; corrections read), not a failure. | T | I-06, I-09; design §2.1.3 row 7, §2.4; UX §3.2; BS B23 |
| WP11-A51 | SuperAdmin; harness; test | SA-09e refusals and Core's actual `fields` behaviour | Harness or test: residence "GBR"; all values unchanged; an applicant-key change into an occupied scope; into an exhausted scope; a stale revision; five documents ticked. Test: a well-formed undeclared `field.<key>`, an option outside the declared enum, a value over the declared length (harness raw sends; the page never offers them). | Refusals on the re-rendered SA-09e with every value and tick kept, in the design's sentences: `population_out_of_scope`; "Nothing changed: the details already have these values." (`correction_no_change`); `duplicate_open_scope`, `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required` (existing sentences); CMP-14 "Detail / your value / current value"; "Choose at most 4 documents." Nothing is recorded for these. The undeclared key, the outside option and the over-length value: Core records them today (I-07); the test pins that behaviour and the item claims no refusal and no "nothing recorded" for them; the gap is a P-17 Core note. | L (no change, stale) + T | §0.5; design §2.12; I-07; R-07 |
| WP11-A52 | Test | An applied correction on an assigned application with recorded readiness | Send it. Read the operator's notices, OP-02 and OP-01. | One notice to the operator about a SuperAdmin correction; OP-02 readiness "Out of date" (Core's basis moved), with the earlier recorder shown separately; authorization and packet release wait for renewed readiness. A held correction posts the same notice and changes no detail. | T | BS B19; `admin.ts:83-88` |
| WP11-A53 | SuperAdmin; harness; test (design T3) | SA-09e, the Nth time | Replay terms 1 to 5 on an accepted correction (test, applied). Term 3: Back. Business duplicates: a new key with the same values after an applied correction, and after a held correction. | (1) Same 303 and receipt: the identity input maps from the posted values, so the replay is byte equal (no `conflict_operation_key`; D-W11-03). (2) Refused as a used form; values kept. (3) Back reloads SA-09e with the current values and unchecked evidence. (4) Recorded once. (5) The operation page. After an applied correction: `correction_no_change` (or `stale_revision` from a stale tab); nothing recorded. After a held correction: Core records a second held correction (no semantic duplicate guard; G-03); the held effect sentence warned that held corrections are not listed. | L+T | design §4.1; WP-03 C-04; WP-09 G-03; Q-W11-06 |
| WP11-A54 | Test | The SA-09e handler and body limit (real HTTP) | (1) Send a surname of 101 characters, a passport number of 31, five ticked documents, 101 `field.<key>`, a residence of 4 characters. (2) A real HTTP POST of a valid form with every declared field at its maximum length, encoded (non-ASCII and reserved characters), under the new body limit. | (1) Every field and tick reaches Core whole, or Core's contract refuses it at its field with values and ticks kept: no `.slice(0, max)`, no `.slice(0, 4)`; identity mapped from the posted values; `field.<key>` sent (today `fields: {}`). (2) The BFF accepts the body (a bounded limit sized for the supported form envelope, not 4096 bytes) and Core receives every value whole. | T | LD-17; I-08; D-W11-03, D-W11-04, D-W11-06 |

### 2.6 SA-09m Resolve the protection mark (`core.resolve_protection_mark`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A55 | Test (gallery) | SA-04a of a marked application | Render. | Banner first: "Held after a restore: a protection mark holds every guarded action until a SuperAdmin resolves it with evidence." with "Resolve the protection mark" → SA-09m `…/decide/protection_mark`; action panel row 1; decisions row "Mark [reference] holds this application." No "Resolve the incident" text (F-13 class). | T | design §2.1.1, §2.1.3 row 1, §2.1.4 |
| WP11-A56 | Test | SA-09m Scope and Evidence (the mark's facts are required decision evidence) | Render with the mark's audit subject read returning the recorded flags; with it returning no structured flags; with it unavailable. | `h1` "Resolve the protection mark: [applicant]". Scope: "Protection mark [reference] on application [reference]. Engineering records a mark after a restore that lost an interval of records, …". Evidence: what the restore may have lost, as recorded fields of the mark's audit subject read with time and source ("may have been filed: yes / no; paid; released", restore reference, recorded at); the acts (state words), service payment, packet state, readiness; "If the application holds more than one mark, the next one shows here after this one is resolved." When the flags are not returned as recorded fields, or the read is unavailable: CMP-10 "The review is incomplete: the facts of this mark cannot be read on this page. Try again later. Owner: TravelMudra." with the audit link, and no form (I-05; I-01 option B). "Partly met" until STOP-W11-01 where the read is used. | T | I-05, I-01; `WP-11.md` §3 PM Q-04; STOP-W11-01; design §2.5 |
| WP11-A57 | Test | SA-09m Effect, Hard stops, fields for a mark whose flags do not include `possibly_filed` | Render. | Effect: "This mark stops holding the application. Each action it held is checked again under its normal controls: …" Unchanged: "It records no filing, payment or release, and restores no lost record. A fact the restore lost is entered again only through its own page, from evidence." · "Another mark of this application, if any, keeps holding it." Hard stops: "Resolve only with evidence for each thing the restore may have lost: a filing, a government fee payment and a packet release. No other control is passed." Fields: "Evidence reference" (required, maxlength 120), "Reason" (at least 10 characters); hidden `applicationId`; action `/admin/protection-marks/<pmk>/resolve` with the mark of the read. Review: "When you resolve it: the mark ends with your evidence, reason, name and time; the application's actions are checked again under their normal controls." Button "Resolve the protection mark"; "Cancel" → SA-04a. | T | design §2.5 items 4 to 8; BS B40 |
| WP11-A116 (new) | Test | SA-09m for a mark whose flags include `possibly_filed` | Render. Send a resolution with a reference (saved envelope where no form shows). | "Unmet: waits for Max's decision on P-17 item 1" (P0; I-01). Expected under option A (a Core guard): Core refuses the resolution unless the filing facts were entered again or the SuperAdmin records "filed" with its evidence, and SA-09m shows Core's reason, the owner and the route; nothing recorded. Expected under option B (interim on Max's word): no resolution form; boundary notice "Resolving this mark is unavailable until the product owner approves a safe procedure. Owner: product owner."; the mark keeps holding the application. Under either option no item passes a resolution of a `possibly_filed` mark with any reference. WP-11 does not ship SA-09m for this case before Max's answer. | T | I-01; R-01 (P0); P-17 item 1; BS B23, B40 |
| WP11-A58 | Test | SA-09m states | (1) No active mark. (2) A second active mark exists. (3) The application is closed. | (1) "No protection mark holds this application." No form. (2) After the first resolution the page shows the second mark's reference with a fresh, empty form. (3) The form shows when the mark's flags allow it (Core has no lifecycle check). | T | design §2.5 states; Q-W11-03 |
| WP11-A59 | Test (design T1) | SA-09m send | (1) A blank reference; a short reason. (2) Accepted. (3) A second SuperAdmin sends after (2) from an older page. (4) A mark id of another application. (5) As an operator. | (1) At the fields, values kept; nothing recorded. (2) C3 "Protection mark resolved" (named: `markId` is unique to this command); recorded: mark [reference]; Current: "another protection mark holds this application: [reference]" or "no protection mark holds this application." (3) "Mark [posted reference] was resolved since you opened the page. Nothing was recorded now." and the current state; the typed evidence and reason in the unsent text block, never filled into a form for another mark. (4) Shell SH-02. (5) Not found. | T | design §2.5, §2.10, §4.1; F-W11-05 |
| WP11-A60 | Test | After a resolution (a mark without `possibly_filed`) | Read SA-04a, OP-02, OP-04a, a download. | The banner is gone; Core no longer reports `protection_mark_active`; a file release is no longer refused for the mark; no act, payment or release fact was created or changed by the resolution. | T | `controls.ts:299`; `release.ts:202` |
| WP11-A61 | Test | SA-09m, the Nth time | Replay terms 1 to 5. Term 3: Back. New key from the reloaded page. | (1) The original receipt. (2) Refused as a used form. (3) Back reloads SA-09m in its current state. (4) Recorded once. (5) The operation page. New key: `stale_revision` → the §2.5 C2 state; nothing recorded. No revision exists, so this business check is its stale case. | T | design §4.1; PL §7 K-STD |
| WP11-A62 | Test | Operator and travel-agent pages while a mark is active | Render OP-02, OP-01, TA-07 and a TA download. | The owner reads "TravelMudra administration" with a step per (reason, next action) that names the hold after a restore, never "Resolve the incident"; OP-02 shows no form that the mark holds; TA-07 states that files are not released meanwhile; a download is refused with that reason. | T | WP-07 F-13; `shared/delivery/pages.ts:97`; `derived.ts:292` |
| WP11-A63 | Test | The SA-09m handler | Send an `applicationId` of 41 characters, a reference of 121 and a reason of 1001. A refusal with a hidden `applicationId` that does not match the pattern. | Every field reaches Core whole or is refused at its field with the value kept (no `.slice`, today `admin.ts:629`). The refusal re-renders SA-09m from the hidden `applicationId` when it matches the pattern, else the shell page (D-W11-07). | T | LD-17; D-W11-06, D-W11-07 |
| WP11-A64 | — | `lane-ui` | Check SA-01 group 15. | No protection mark exists on `lane-ui` without a restore. A55 to A63, A116 and A120 run as tests and gallery states; the run record says "Not run on lane-ui: no protection mark without a restore (B40; data hygiene)". | L | BS B40; design §6.1 |

### 2.7 Command results, access and shell on WP-11 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A65 | SuperAdmin | Every WP-11 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item "Applications & groups" (SA-04a and the SA-09 kinds), "Home" (SA-01); breadcrumbs of design §1.4; one `h1`; "Read at [time] IST". | L | PL §2.1, §2.2; design §1.4 |
| WP11-A66 | SuperAdmin; harness | Every accepted WP-11 command; edited receipt addresses | Read each receipt. Open edited addresses: SA-09u with an outcome-correction key; SA-09e with an operator's assistance-entry key and with a TA identity-correction key; SA-09m with a decision key; another application's key. | `unresolved` (SA-09u) and `corrected` (SA-09o): neutral "Request recorded" with the Current lines of design §2.10. `corrected` (SA-09e): neutral "Request recorded" with the correction reference and the stage ("applied" / "recorded and held") as recorded facts (I-09); no before or after values. `mark` (SA-09m): "Protection mark resolved". An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time, no actor (S-08 pending). | L+T | WP-06 D-01, D-02; I-09; design §2.10 |
| WP11-A67 | SuperAdmin; test | Receipt addresses of §3 V11-11 and V11-21 opened again after later steps (V11-18a) | Open each address again. | Each receipt keeps what was recorded and shows current facts labelled "Current" ("A follow-up is open" after V11-18). No receipt tells anyone to act; none tells anyone to perform an act (F-33). | L+T | `WP-07.md` F-01, F-33; WP-09 G-10 |
| WP11-A68 | SuperAdmin | Each command with a lost acknowledgement (fixture, design T9); a refused send | Inject the fault. Open the operation page. "Check status". Open a refused key's status page. | 303 to `/admin/operations/<key>`: "Checking the original result" and "Check status"; no new send of the same intent offered there; "Check status" shows the accepted result. A refused send: "Nothing is recorded for request [reference] so far". | T | PL §1.1 UNR; BS B35; design §2.0 |
| WP11-A69 | Harness | Each command | (1) Identical replay. (2) Same key, changed content. (3) Business duplicate. (4) Raw stale envelope. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page. | (1) The original result; nothing new. (2) `conflict_operation_key`. (3) Unresolved: `outcome_already_recorded`; outcome: `correction_no_change`; fields after an applied correction: `correction_no_change`; fields after a held correction: a second held correction is recorded (G-03; separate fixture, never counted as a refusal); mark: `stale_revision`. (4) Unresolved, outcome, fields: `stale_revision` with CMP-14; mark: no revision, the business check decides. (5a) Core evaluates the envelope again against its own revision: the unresolved envelope refused at V11-2 and resent after V11-9 is refused `stale_revision` (the reassignment moved the revision). (5b) Accepted once. A duplicate test uses (3), never (4) or (5a). | T | WP-06 D-12; WP-10 H-07; I-11; PL §7 K-STD |
| WP11-A70 | SuperAdmin; operator; TA | Every refusal reachable on `lane-ui` | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong" or "Invalid data". | L | PL §1.1 REJ, §11.1; CR-01 |
| WP11-A71 | — | Text map of every reason code the WP-11 pages can show | Unit test against Core's vocabulary. | Each code has text in the role's words: `outcome_already_recorded`, `act_state_transition_invalid`, `reconciliation_attempt_missing`, `not_active_staff`, `outcome_correction_not_allowed`, `correction_no_change`, `business_evidence_required`, `protection_mark_active`, `application_not_open`, `correction_historical_after_filing`, `filing_possibly_occurred`, `identity_same_person_evidence_insufficient`, `population_out_of_scope`, `duplicate_open_scope`, `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required`, `held_correction_pending`, `held_correction_released`, `act_already_open`, `completion_check_trigger_unselected`, `stale_revision`, `conflict_operation_key`. Pending reasons read per (reason, next action). `access_denied` renders SH-02 or the uniform not-found page. | T | CR-01; `src/apps/shared/core/shared.ts` |
| WP11-A72 | SuperAdmin | SA-09u, SA-09o, SA-09e, SA-09m, SA-04a (HTTP tests) | (1) `ops.case_work` fails for availability on SA-09u. (2) The mark's facts read fails on SA-09m. (3) `dlv.delivery_page` fails on SA-09o. (4) An audit subject read fails on SA-04a. (5) Separately: revoke access, end the session, close the installation or start a support view between the first read and an optional read. | (1), (2): required decision evidence: the incomplete-review notice and no form (I-05). (3): optional guard information: "Unavailable"; the form shows; Core decides. (4): "Not shown on this page" for that block only. (5): the access page (SH-02, sign-in or maintenance), never the facts read earlier. No page code catches every error around a read. | T | LD-14; I-05; WP-07 F-04 |
| WP11-A73 | TA; operator; SuperAdmin | Every WP-11 page and the TA and operator pages of U, W, O | Look for controls of the other roles. | TA pages: no correction, decision or mark control. Operator pages: no SuperAdmin decision control. SuperAdmin pages: A10. | L | BS B18; UX §2.3 |
| WP11-A74 | SuperAdmin; operator; TA | Every WP-11 page and the amended texts | Read all visible text. | No forbidden label of §11.1 ("Override", "Admin override", "Force", "Force complete", "Reopen system", "Approved" or "Done" as an overall status, "Ready" as a universal state); "Authorise" never; the §0.2 words; no "Owner not yet decided" (LD-04); no package or record id; "Sent in full" for a download; times carry IST; counts name their unit; synthetic data labelled "Synthetic". No configuration number that the page does not read. | L | PL §11.1, §11.2; design §2.0 "Copy"; F-22; WP-08 E-12 |
| WP11-A75 | SuperAdmin; operator (OP3) | Support view (test); operator read grant (test) | Test: in a support view open SA-04a and each SA-09 kind and post each command. Test: an operator with a group read grant opens OP-04b of U and posts an attempt. | Support view: every `/admin` page answers 409 `support_view_active`; no WP-11 page is reachable; nothing recorded. Read grant: the frame and facts, the banner "Read-only access: [purpose], until [date time] IST", "Only the assigned operator takes this step. You can read this application." and no form; the post refused as not found. (No live read grant: Q-W11-08 approves none.) | T | UX §2.3; BS B10; design §2.0 |
| WP11-A76 | SuperAdmin | SA-09u, SA-09o, SA-09e, SA-09m | Inspect browser storage after use. Read the headers. | No reason, reference, identity value, chosen document or owner is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP11-A77 | — | Host-page test `test/unit/web/oversight-host-pages.test.ts` (design §7.2); SA-04a on `lane-ui`; route test | Run the tests. Open SA-04a of U, W and O. | SA-04a fixtures (filing unknown, exhausted, mark, held stage, outcome Refused, closed) hold no form with action `…/unresolved-completion`, `…/correct-from-evidence` or `/admin/protection-marks/…/resolve`, and no form of a WP-06, WP-07 or WP-09 command; the carried WP-17 forms and the links of design §1.6 are present. `…/unresolved-completion` appears as a form action only on SA-09u; `…/correct-from-evidence` only on SA-09o (`kind=outcome`) and SA-09e (`kind=fields`); `/admin/protection-marks/:markId/resolve` only on SA-09m. OP-02, OP-04a and OP-04b contain no instruction to perform an act (A115). The four kinds join WP-06's route `admin.decisions.application`: phase 1 adds no inventory row; every rendered form action is a registered route. | L+T | CC-12 to CC-15; LD-02, LD-07; design §1.5, §7.2, U6 |
| WP11-A78 | `syn-ta-3`; operators | SA pages as operators; TA pages of U as `syn-ta-3`; foreign ids | Open SA-09u of U as OP1; SA-04a as OP2; TA-07 of U as `syn-ta-3`; SA-09m with a resolution POST naming a mark of another application. | Operators: the uniform not-found page or SH-02 (WP-01 rule by surface), never a fact of U. `syn-ta-3`: the uniform not-found page. The foreign mark: shell SH-02. | L | BS B10; UX §2.3 |

### 2.8 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A79 | Keyboard-only SuperAdmin | §3 steps V11-10, V11-11, V11-20, V11-21 at 1440 px; V11-10 at 390 px; SA-04a tabs | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: tabs, decision rows, the owner select, the reason, the identity fields and evidence checkboxes, the outcome correction. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12; design §4.5 |
| WP11-A80 | Keyboard-only user | Every WP-11 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP11-A81 | Phone user | SA-09u, SA-09o, SA-09e, SA-04a | View at 320 px, and at 1280 px with 400% zoom. | One column; no two-dimensional page scrolling; tables of acts, evidence and attempts stack to labelled cards (no nested scroll region for 50 attempts); identity band → banner → action panel → tab links → content; scope and effect before the fields; the primary action at the end of the form, never in a fixed bar. | L | AC-04, AC-21; design §2.0 "Mobile", §4.4 |
| WP11-A82 | Any | Every WP-11 form | Inspect each input. | Visible labels; the owner `select` with its hint by `aria-describedby`, no option preselected; the evidence checkboxes in a `fieldset` with the legend "Evidence", never prechecked; required and optional fields say so. | L | AC-05, AC-15; design §5 |
| WP11-A83 | Any | Act states, the outcome, the banners, correction stages | View in greyscale. | Each state has text; the destructive primary button keeps its text label; no state by colour alone. | L | AC-06 |
| WP11-A84 | Any | Every WP-11 form | Send each form with an error. | Focus moves to the error summary; each link moves to its field; values stay; the chosen owner stays; evidence ticks show what was posted (G-07). | L | AC-08; WP-09 G-07 |
| WP11-A85 | Screen-reader user | Receipts; the banners; the held warning; the blockers | Read with VoiceOver or NVDA. | Receipts announced politely without moving focus; the protected-state banner is plain text in the page flow (no live region); warnings and blockers are read before the form they concern; the unsent text block is not focusable and not a live region. | L | AC-09, AC-16; design §5 |
| WP11-A86 | Screen-reader user | Each unavailable decision (A15, A37, A46, A116) | Focus the decision row or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); a shown `unavailableButton` has `aria-disabled="true"` and its reason; a role-forbidden action is not shown. | L | AC-13; CMP-10 |
| WP11-A87 | Phone user | Every WP-11 page at 390 px | Measure each control. | Every control at least 24 × 24 CSS px; primary actions ("Record the unresolved external outcome", "Correct the outcome to [target]", "Record the correction", "Resolve the protection mark") at least 44 × 44 CSS px; labels part of their targets. | L+T | AC-10 |
| WP11-A88 | — | Every WP-11 page | Measure contrast. | Normal text at least 4.5:1; non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP11-A89 | Any | Long names and texts; reduced motion | Use a 400-character name, references of Core's maximum length, a 1000-character reason. Turn on "reduce motion". | Text wraps anywhere; the `h1` wraps; identity stays visible; no transition plays. | L | AC-14, AC-20; design §4.4 |
| WP11-A90 | SuperAdmin and operator (observation) | SA-04a of U after the decision; OP-02 of U and W | Ask the SuperAdmin "Was U filed?", "Is U completed?", "Can U be filed again?"; ask OP1 on W before V11-8 "Should you perform the submission now?" and on U "What do you do if the authority sends a result?". | The run record reports the answers and the sample size; "not filed", "completed", "yes, refile" or "yes, perform it" is a finding. No pass target. | L | AC-24, AC-26; UX §12 |

### 2.9 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state (no mark on `lane-ui`, A64; an accepted correction runs by test). Phase 2 rows are "Deferred" when phase 2 is
not built.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP11-A91 | SuperAdmin | SA-01 with groups 12 and 15 (V11-22) | L | UX §7.5; AC-01 to AC-28 |
| WP11-A92 | SuperAdmin | SA-04l saved view "Filing uncertain" (phase 2) | L | same |
| WP11-A93 | SuperAdmin | SA-04a of U while uncertain, External acts tab (V11-1) | L | same |
| WP11-A94 | SuperAdmin | SA-04a of U after the decision and the later fact (V11-18) | L | same |
| WP11-A95 | SuperAdmin | SA-04d of O with the retrieval form (phase 2) | L | same |
| WP11-A96 | SuperAdmin | SA-09u of U "Attempt missing", no form (V11-2) | L | same |
| WP11-A97 | SuperAdmin | SA-09u of U allowed (V11-10) | L | same |
| WP11-A98 | SuperAdmin | SA-09u with the reason field error (V11-10) | L | same |
| WP11-A99 | SuperAdmin | SA-09u with the receipt (V11-11) | L | same |
| WP11-A100 | SuperAdmin | SA-09u "Decided", no form (V11-17) | L | same |
| WP11-A101 | SuperAdmin | SA-09o of O allowed (V11-21) | L | same |
| WP11-A102 | SuperAdmin | SA-09o with the error summary (V11-21) | L | same |
| WP11-A103 | SuperAdmin | SA-09o with the receipt (V11-21) | L | same |
| WP11-A104 | SuperAdmin | SA-09e of W, held stage with the form (V11-20) | L | same |
| WP11-A105 | SuperAdmin | SA-09e of U "Unresolved", no form (V11-17) | L | same |
| WP11-A106 | SuperAdmin | SA-09e of O "Historical", no form (V11-21) | L | same |
| WP11-A107 | SuperAdmin | SA-09e of W with the evidence fieldset error (V11-20) | L | same |
| WP11-A108 | SuperAdmin | SA-09e with the receipt (held and applied) | L (gallery) | same |
| WP11-A109 | SuperAdmin | SA-09m allowed (a mark without `possibly_filed`) | L (gallery) | same |
| WP11-A110 | SuperAdmin | SA-09m with the receipt, then the unsent text block of a second SuperAdmin | L (gallery) | same |
| WP11-A111 | Operator | OP-04b of U, exhausted (F-22), no form (V11-13) | L | same |
| WP11-A112 | TA | TA-07 of U with the unresolved outcome (V11-15) | L | same |
| WP11-A113 | TA | TA-09 after the intake of U's applicant (`matched_existing`, V11-16) | L | same |
| WP11-A114 | SuperAdmin | Operation status page of a WP-11 command, accepted and "Nothing is recorded" (A68) | L | same |
| WP11-A119 (new) | Operator | OP-04b of W with the F-33 authorized banner after the reassignment (V11-8) | L | same |
| WP11-A120 (new) | SuperAdmin | SA-09m for a `possibly_filed` mark: option B boundary state, or option A's refusal (A116) | L (gallery) | same |

## 3. Proof scenario V11 (to its boundary)

V11 (UX §12): "Current-authorized user can record/reconcile an already attempted act after assignment/rule changes
without being offered unauthorized new filing; actual historical evidence remains intact." Authority B19, B23, B33,
B34, B35. Also UX §3.2 "Unknown external execution" and UI-PLAN §4.2.

One ordered recipe: the design's §6 (I-12), which keeps the authorized-reassignment case W, with the corrections of
this checklist (F-33 in V11-8; `matched_existing` in V11-16) and lettered additions. "Setup" steps use pages of earlier
packages; they are not the subject under test. "Observe" steps check items other packages own.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01; OP3: incidents; SA1: SA-01; TA: TA-10 | Read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup S1 | TA (TA-09, TA-08) | Create group `wp11-[stamp]` (travel +30/+40) and submit U, W and O on "SYN Tourist e-visa". | Three submitted applications. | — | L |
| Setup S2 | SA1 (SA-07a, SA-03a) | Record "Payment received" for U, W, O (`SYN-V-[stamp]`); assign U and W to OP2, O to OP1. | Paid and assigned. | — | L |
| Setup S3 | OP2, OP1 (OP-02) | OP2 starts work and confirms readiness on U and W; OP1 on O. | Readiness recorded. | — | L |
| Setup S4 | OP2 (OP-04a, OP-04b) | Request authorization of the government submission for U and W. Record "Execution is uncertain" on U: "Portal session ended after submit; no receipt shown". | U uncertain; W authorized (observe WP07-A65). | — | L |
| Setup S5 | OP1 (OP-04a, OP-04b, OP-05) | Authorize O; record "Filed" with `SYN-PORTAL-O-[stamp]`; record the outcome "Refused" with `SYN-REF-O-[stamp]` and no file. | O filed; outcome Refused. | — | L |
| V11-1 | SA1: SA-04a of U | Read Overview and External acts. | Banner with [OP2] reconciling; action panel "Waiting on [OP2]: reconcile whether the government submission was filed"; act "Execution uncertain: filing unknown"; OP2's evidence record; attempts none; no SuperAdmin act form. | A04, A05, A06, A10, A93 | L |
| V11-2 | SA1: SA-09u of U; harness | Read. Harness: a send with U's current revision. | "Attempt missing" with owner [OP2]; scope, evidence, effect and hard stops visible; no form. The harness send refused `reconciliation_attempt_missing`; nothing recorded. | A15 (6), A18 (1), A96 | L |
| V11-3 | TA: group page (Setup, carried WP-17 form) | Change the travel dates to +31/+41. | Accepted. | A25 | L |
| V11-4 | SA1: SA-03c (Setup) | Reassign U and W from OP2 to OP1, each with a reason. | Receipts; SA-04a Operator: OP1. | — | L |
| V11-5 | OP2; harness | Reload OP-04b of U; open OP-04a of W. Harness as OP2: an attempt on U. | SH-02 on both; the attempt refused; nothing recorded. | A118 | L |
| V11-6 | OP1: OP-04b of U | Read. | Owner "[OP1] (you)"; WP-07 sentence; F-26 line; reconciliation form; OP2's record listed; the date change does not block. | A25, A118 | L |
| V11-7 | OP1: OP-04a of U (both act kinds); harness | Read. Harness: a new authorization of U's submission. | No form on both; no "Request authorization" for U; the harness send refused `act_already_open`; nothing recorded. | A118 | L |
| V11-8 | OP1: OP-04b of W | Read. Record "Execution is uncertain" with "Authorized by the previous operator; no record of execution". | F-33 banner and action-panel step; no instruction to perform the act; receipt "Execution recorded as uncertain"; W uncertain. | A115, A119 | L |
| V11-9 | OP1: OP-04b of U (Setup) | Attempt: "Checked the government portal", "Inconclusive", note "WP11 [stamp] …". | Receipt; banner stays; one attempt by OP1; OP2's record unchanged (observe WP07-A67). | A35 | L |
| V11-10 | SA1: SA-09u of U | Read every section. Choose OP3; reason "Short"; send. | The allowed review; the field refusal "Enter at least 20 characters."; OP3 still chosen; nothing recorded. | A11 to A14, A17, A97, A98 | L |
| V11-11 | SA1: SA-09u of U | Enter a reason of 20 or more characters; record. | Neutral receipt with the Current lines; then "Decided". | A19, A20, A99 | L |
| V11-12 | Harness; SA1 second tab | Resend the V11-11 POST (same `_op`). Send from a tab opened before V11-11. | Same 303 and receipt; one TA notice. The second tab: CMP-14 "Outcome: Outcome not recorded / External outcome unresolved"; nothing recorded; reason in the unsent block. | A21, A23 | L |
| V11-13 | OP1: OP-04b, OP-04a of U; OP-02 | Read. | F-22; F-23 with no owner and no route; F-24 on every tab; records unchanged. | A27, A111 | L |
| V11-14 | Harness (OP1) | Re-post the V11-9 reconciliation envelope with a new `_op`; post act evidence. | Refused; F-25 sentence with the unsent note; attempts still one. | A28 | L |
| V11-15 | TA: TA-07, TA-10, TA-07x of U | Read. | AM-W11-10 and E-16 sentences; no submit or file control; the notice (+1); history lines. | A31, A32, A112 | L |
| V11-16 | TA: TA-09 | Start an individual intake for the same applicant (same passport) in `wp11-[stamp]` on "SYN Tourist e-visa". | `matched_existing`: no new application (count delta 0); U named. (The design's "refused `duplicate_open_scope`" is corrected by I-12.) | A33, A113 | L |
| V11-17 | SA1: SA-09e, SA-09o, SA-09u of U | Read. | SA-09e "Unresolved", no form; SA-09o "Only Issued and Refused can be corrected here … follow-up", no form; SA-09u "Decided", no form. | A15 (2), A37 (3), A49, A100, A105 | L |
| V11-18 | OP1: OP-05 of U (Setup); OP3: incidents; SA1: SA-04a of U | Record a later official fact "Issued", `SYN-LATER-[stamp]`. Read. | "Later official fact recorded. The outcome stays External outcome unresolved. A follow-up is open."; outcome unchanged; OP3's incidents +1 with the follow-up of U; SA-04a continuing duties. | A08, A29, A35, A94 | L |
| V11-18a | SA1: receipt address of V11-11 | Open it again. | Recorded facts kept; "Current: … A follow-up is open"; no instruction to act. | A67 | L |
| V11-19 | OP1: OP-07 of U | Read. | E-16 sentence; completion boundary; no control. | A30 | L |
| V11-20 | SA1: SA-09e of W | Read. Change the given names to a value not on the passport; tick the passport; reason; record. | Held-stage effect before the button; refused at the evidence fieldset (`identity_same_person_evidence_insufficient`); values and tick kept; SA-04a shows the old name; nothing recorded. | A45, A46, A47, A48, A104, A107 | L |
| V11-21 | SA1 (two tabs): SA-09e and SA-09o of O; harness | SA-09e: read. SA-09o: read; send without a reference; then evidence `SYN-CORR-[stamp]` and a reason; record. Send from the tab opened before. Harness: replay; the same target with a fresh revision. Press Back. | SA-09e "Historical", no form. SA-09o: scope "from Refused to Issued", the dependent warning in Effect and Review, the two disclosures; C1; then neutral receipt "Current: Outcome Issued"; the old tab CMP-14 (Refused / Issued), nothing changed; replay same receipt; `correction_no_change`; Back sends nothing. O's audit subject page shows the before and after fact. TA-07 of O shows "Issued"; no notice; no history line. | A36, A38, A39, A40, A41, A43, A49, A101 to A103, A106 | L |
| V11-22 | SA1: SA-01 | Read. | Group 12: exhausted +1 (U), unknown +1 (W) from P-0; the "filing unknown" link lists W and not U. | A01, A91 | L |
| V11-23 | axe | Every WP-11 page and the amended pages visited. | No serious or critical violation at 1440 px and 390 px. | A91 to A114, A119, A120 | L |
| V11-X1 | `syn-ta-3`; OP1, OP2; harness | The isolation reads and posts of A10, A73, A78. | Not found or SH-02; nothing recorded. | A10, A73, A78 | L |
| V11-X2 | Test | Design T1 to T9 and the test parts of the items: A02, A06, A15, A16, A18, A22 to A26, A28, A32 to A34, A37, A41, A42, A44, A46, A48 to A63, A66 to A69, A71, A72, A75 to A77, A87, A88, A115, A116, A117, A121. | As the items. | as listed | T |
| V11-X3 | axe (gallery) | A108 to A110, A120. | As V11-23. | A108 to A110, A120 | L |

Proof split: V11 passes when P-0 to V11-23 and V11-X1 pass on `lane-ui` at the integrated WP-11 commit, V11-X2 passes
as named tests and V11-X3 passes on the gallery. Recorded, not failed: A116 "Unmet: waits for Max's decision on P-17
item 1"; A43 "Unmet: waits for Max's decision on P-17 item 4"; A50 "Unmet: waits for STOP-W11-03 and P-17 item 3"; A08
and A56 "Partly met" until STOP-W11-02 and STOP-W11-01 (P-17 item 2) where the audit read does not return the field;
A03, A09, A92, A95 "Deferred" unless phase 2 is built; A64 "Not run on lane-ui". The run record names the `lane-ui`
ref, the run tag, the group, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| "Execution is uncertain" and its protected state | WP-07 (WP07-A65, A66); set-up S4, V11-8 |
| The new operator owns reconciliation after a reassignment; the previous operator is refused | WP-07 (WP07-A70); observed in V11-5, V11-6 |
| The reconciliation form, conclusions and replay (F-10) | WP-07 (WP07-A67, A68, A76); set-up V11-9 |
| A concluded "not filed" returns through readiness | WP-07 (WP07-A69) |
| A second submission after a known filing | WP-07 (WP07-A71) |
| The later official fact form and receipt on OP-05 | WP-08; observed in V11-18 |
| OP-07 completion rows and the boundary | WP-08 (E-05, E-06, E-16); observed in V11-19 |
| Follow-up and post-filing correction incident pages | WP-14 |
| A travel agent's re-application of a held correction | WP-17 |
| A SuperAdmin's or operator's re-application of a held correction | STOP-W11-03; P-17 item 3 (A50) |
| Reassignment (SA-03c) | WP-06; set-up V11-4 |
| The SA-09 frame and registry | WP-06 (D-14, D-15) |
| Restore, reopening and protection-mark creation | Engineering and Max (B40); the `possibly_filed` resolution: Max, P-17 item 1 |
| The TA-09 intake page | WP-03; observed in V11-16 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-11 page:

- An instruction to perform an act, on any page, status read or receipt, for any viewer (F-33).
- A state word derived from elapsed time, or an age of an uncertain act (UX §3.2; BS B23).
- "Completed", "completion", "Closed", "Done" or "Resolved" for the unresolved decision (D-W11-09).
- An offer to refile, file again, retry, pay the government fee again or withdraw ordinarily for an application whose
  filing may have happened (BS B23).
- A SuperAdmin control to authorize an act, record act evidence or an attempt, mark execution uncertain, confirm
  readiness or record an official result (BS B18, B34).
- A correction form where Core's facts make it historical, unresolved or held by a mark (WP-09 G-02).
- An identity change without a chosen document of the application that shows it (BS B19).
- A resolution of a `possibly_filed` protection mark with any reference (I-01); a decision form during an outage of
  its required evidence (I-05).
- "Override", "Admin override", "Force complete", "Reopen system"; a restore or reconstruction control (BS B40).
- A receipt that names a command the operation does not establish, an accepted time, or an instruction to act (D-02;
  P-02; F-33).
- Earlier facts after an optional read was refused for access (LD-14); a truncated field or a dropped row (LD-17).
- A fact reconstructed from clock order, or an audit fact shown without its recorded field, time and source (I-10).
- A package id or a record id in user copy (F-22); "Owner not yet decided" for the completion boundary (LD-04).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- `possibly_filed` mark resolution: "Unmet: waits for Max's decision on P-17 item 1" (A116).
- The travel agent's notice and history line after an outcome correction: "Unmet: waits for Max's decision on P-17
  item 4" (A43).
- Staff display and re-application of held corrections: "Unmet: waits for STOP-W11-03 and P-17 item 3" (A50).
- Mark facts and exhausted-act facts on the staff read: "Partly met" until STOP-W11-01 and STOP-W11-02 (P-17 item 2)
  where the audit read does not return the field (A08, A56).

Deferred in WP-11 (the run record lists each as "Deferred"):

- Phase 2 pages SA-04l, SA-04s, SA-04g, SA-04d when phase 2 is not built (A03, A09, A92, A95; Q-W11-02).
- Live protection marks, held corrections and an accepted identity correction: tests and gallery states only (design
  §6.1; A48, A50, A55 to A64, A108 to A110, A116, A120).
- The exhausted-scope intake refusal after closure and its travel-agent text: test only (A33; S-W11-01).
- The offering-suspension half of the rule change: test only (A25).

Not in WP-11: WP-07 act commands and pages (except the amendments F-22 to F-27 and F-33 that WP-11 asserts); WP-08
OP-05, OP-07, TA-10 pages; incident pages (WP-14); TA re-application, operational withdrawal, price, deferral and
travel-date recheck commands (WP-17); support view, read grants, OP-10 and SA-10 (WP-15).

## 6. Questions for the architect (ranked)

Kept as asked. `WP-11.md` §3 and §4.1 answer: Q-01 → STOP-W11-03 (surface defect, the staff allowlist entry joins the
Core batch) and P-17 item 3 (corrections read: criterion exception), interim I-06 (A50); Q-02 → I-04, P-17 item 4 with
Max (A36, A43); Q-03 → I-03, the warning in Effect and Review, the side effect a P-17 Core note (A36, A42); Q-04 →
`WP-11.md` §3 PM Q-04 interim (audit subject read, recorded fields only) and I-10, STOP-W11-01 and -02 as P-17 item 2,
STOP-W11-08 for the notes (A07, A08, A12, A56); Q-05 → I-01, ranked **P0** by the independent review, P-17 item 1 with
Max, WP-11 not built before his answer (A116); Q-06 → Q-W11-02, phase 2 (U7), separable; Q-07 → F-22 (A27); Q-08 →
Q-W11-05 ("You" added; other SuperAdmins STOP-W11-05, P2); Q-09 → STOP-W11-04 (P2) and the design's group 15 link
(A02); Q-10 open (P2); Q-11 → tests and gallery (A64); Q-12 → I-12 (A33). Q-13 is new (P2).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Held and released corrections have no staff read and no staff route (`core.apply_held_correction` is on the edge allowlist only); Core's pending answer for a released SuperAdmin correction names a SuperAdmin step no page offers. | A SuperAdmin corrects a detail while the filing is uncertain; the receipt says "held"; later evidence shows "not filed"; OP-01 and SA-04a say a SuperAdmin must apply the correction again, but no staff page can, and re-entering it leaves the pending answer naming the released one. Likelihood: low; harm: medium. | A staff route (allowlist and binding in `src/core-api`, not lane-owned) and a corrections read (criterion point 2 not demonstrated: exception needed). Interim: the receipt states "held"; the unavailable state names the gap. |
| Q-02 | P1 | An outcome correction posts no notice and adds no TA history line. | OP1 records "Issued" by mistake; the travel agent tells the traveller; SA1 corrects it to "Refused"; no notice; the history still says "Issued". Likelihood: low; harm: medium to high. | History line: Kind 1 with an exception; notice: Kind 2 for Max. Interim: SA-09o states it before the send. |
| Q-03 | P1 | An outcome correction can end a confirmed-unfiled dependent as "Dependency failed", after which the correction cannot be reversed; SA-09o cannot list dependents. | E is "Issued"; T depends on it; SA1 corrects E to "Refused" from a letter about another applicant; T ends at once and E cannot be corrected back here. Likelihood: low; harm: high for T. | State the rule in the effect statement (A36); a dependents summary needs a criterion exception; the architect decides. |
| Q-04 | P1 | Several decision facts are only in the audit record; attempt notes are on no read. | SA1 resolves a mark without seeing what the restore may have lost; SA2 cannot see who owns U's later facts; SA1 judges "reasonable reconciliation" without OP1's notes. Likelihood: certain; harm: medium. | Use `views.audit_subject` per subject now; the Kind 1 fields later (criterion point 2 demonstrated for the mark and act facts); the notes need a read change. |
| Q-05 | P1 (review: **P0**) | Core resolves a `possibly_filed` mark on any reference, with no check of a re-entry of the lost facts. | After an interval-loss restore, U carries a mark "may have been filed: yes"; SA1 resolves it with a vague reference; OP1 authorizes and files U again. Likelihood: very low; harm: irreversible (a duplicate government filing). | To Max through the orchestrator; the page states the effect and shows the flags. |
| Q-06 | P1 | Scope of SA-04 in WP-11 (detail, list, delivery view with the SuperAdmin retrieval, group, history). | WP-11 builds only the decision pages; Max opens U from SA-01 into the old case page beside the new decision pages. Likelihood: certain if not decided; harm: medium. | Build SA-04a, SA-04l and SA-04d in WP-11; group detail and the full audit page stay with links. |
| Q-07 | P1 | WP-07's `reconciliation_exhausted` banner says a SuperAdmin still has to record the outcome, after it was recorded, and names a package id. | OP1 opens U after the decision, reads that a SuperAdmin must still decide, and asks SA1 again. Likelihood: certain; harm: low to medium. | Amend WP-07's build (A27 wording). |
| Q-08 | P2 | The future-owner list offers operators only; Core accepts an active SuperAdmin; a SuperAdmin owner gets an incident with owner kind `assigned_operator`. | SA1 wants to own U's later fact and cannot choose themself. Likelihood: low. | Operators only; list the discrepancy in A16; note the owner-kind quirk. |
| Q-09 | P2 | SA-01 group 15 has no list of marked applications. | After a restore SA1 sees a count and must search. Likelihood: low. | Link to SA-04l "Waiting on a SuperAdmin" with the reason words; a filter later. |
| Q-10 | P2 | Only the assigned operator records a later official fact; the future owner gets no notice at the decision. | SA1 names OP3; the authority writes to OP3; OP3 cannot record the fact and asks OP1. Likelihood: low. | The SA-09u hint says who records and who owns; note to the orchestrator, parked. |
| Q-11 | P2 | No protection mark can exist on `lane-ui` without a restore; no test sends `core.resolve_protection_mark` today. | SA-09m reaches Max's manual testing without a live state; a Core regression goes unseen. | Tests and gallery; a module test for the command to the Core owner; a `uat.py` restore drill only on Max's request. |
| Q-12 | P2 | The exhausted-scope intake refusal applies only after closure; closure has no product trigger. | — (proof coverage) | Live `matched_existing`; the refusal by test. |
| Q-13 | P2 | The TA history line of the decision reads "Closed with the outside result unresolved" (`src/apps/shared/views/cases.ts:102`); the case is not closed, and the design's word table does not cover this line. | The travel agent reads "Closed" in the history and believes processing ended, while TravelMudra still owns the completion and a later official fact. Likelihood: certain on every such case; harm: low (TA-07 shows the outcome correctly). | Add the line to the WP-11 U5 amendments (or WP-08's history words) with a text that claims no closure, for example "TravelMudra recorded that the external outcome could not be confirmed". |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, group label and identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V11 result (steps; where shown) | |
| Phase 2 built (yes / no) | |
| P-17 decisions in force at the run (items 1 to 4) | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP11-A01 | | | |
| WP11-A02 | | | |
| WP11-A03 | | | |
| WP11-A04 | | | |
| WP11-A05 | | | |
| WP11-A06 | | | |
| WP11-A07 | | | |
| WP11-A08 | | | |
| WP11-A09 | | | |
| WP11-A10 | | | |
| WP11-A11 | | | |
| WP11-A12 | | | |
| WP11-A13 | | | |
| WP11-A14 | | | |
| WP11-A15 | | | |
| WP11-A16 | | | |
| WP11-A17 | | | |
| WP11-A18 | | | |
| WP11-A19 | | | |
| WP11-A20 | | | |
| WP11-A21 | | | |
| WP11-A22 | | | |
| WP11-A23 | | | |
| WP11-A24 | | | |
| WP11-A25 | | | |
| WP11-A26 | | | |
| WP11-A27 | | | |
| WP11-A28 | | | |
| WP11-A29 | | | |
| WP11-A30 | | | |
| WP11-A31 | | | |
| WP11-A32 | | | |
| WP11-A33 | | | |
| WP11-A34 | | | |
| WP11-A35 | | | |
| WP11-A36 | | | |
| WP11-A37 | | | |
| WP11-A38 | | | |
| WP11-A39 | | | |
| WP11-A40 | | | |
| WP11-A41 | | | |
| WP11-A42 | | | |
| WP11-A43 | | | |
| WP11-A44 | | | |
| WP11-A45 | | | |
| WP11-A46 | | | |
| WP11-A47 | | | |
| WP11-A48 | | | |
| WP11-A49 | | | |
| WP11-A50 | | | |
| WP11-A51 | | | |
| WP11-A52 | | | |
| WP11-A53 | | | |
| WP11-A54 | | | |
| WP11-A55 | | | |
| WP11-A56 | | | |
| WP11-A57 | | | |
| WP11-A58 | | | |
| WP11-A59 | | | |
| WP11-A60 | | | |
| WP11-A61 | | | |
| WP11-A62 | | | |
| WP11-A63 | | | |
| WP11-A64 | | | |
| WP11-A65 | | | |
| WP11-A66 | | | |
| WP11-A67 | | | |
| WP11-A68 | | | |
| WP11-A69 | | | |
| WP11-A70 | | | |
| WP11-A71 | | | |
| WP11-A72 | | | |
| WP11-A73 | | | |
| WP11-A74 | | | |
| WP11-A75 | | | |
| WP11-A76 | | | |
| WP11-A77 | | | |
| WP11-A78 | | | |
| WP11-A79 | | | |
| WP11-A80 | | | |
| WP11-A81 | | | |
| WP11-A82 | | | |
| WP11-A83 | | | |
| WP11-A84 | | | |
| WP11-A85 | | | |
| WP11-A86 | | | |
| WP11-A87 | | | |
| WP11-A88 | | | |
| WP11-A89 | | | |
| WP11-A90 | | | |
| WP11-A91 | | | |
| WP11-A92 | | | |
| WP11-A93 | | | |
| WP11-A94 | | | |
| WP11-A95 | | | |
| WP11-A96 | | | |
| WP11-A97 | | | |
| WP11-A98 | | | |
| WP11-A99 | | | |
| WP11-A100 | | | |
| WP11-A101 | | | |
| WP11-A102 | | | |
| WP11-A103 | | | |
| WP11-A104 | | | |
| WP11-A105 | | | |
| WP11-A106 | | | |
| WP11-A107 | | | |
| WP11-A108 | | | |
| WP11-A109 | | | |
| WP11-A110 | | | |
| WP11-A111 | | | |
| WP11-A112 | | | |
| WP11-A113 | | | |
| WP11-A114 | | | |
| WP11-A115 | | | |
| WP11-A116 | | | |
| WP11-A117 | | | |
| WP11-A118 | | | |
| WP11-A119 | | | |
| WP11-A120 | | | |
| WP11-A121 | | | |
| V11 proof (to its boundary) | | | |
