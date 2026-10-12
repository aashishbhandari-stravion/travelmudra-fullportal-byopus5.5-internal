# WP-11 acceptance checklist: Reconciliation and unresolved outcome

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-11 Reconciliation and unresolved outcome (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | First version, written before the WP-11 design and its independent review. Not run. Where the design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e1f6ac9 (no change under `src/modules`, `src/contracts`, `src/core-api` or `src/kernel` since e9e96e3); internal records at 31603d1 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages under test for the states after the decision; set-up otherwise); edge http://127.0.0.1:4650 (travel-agent pages: observation and set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. When the design (`WP-11-design.md`), the architect's decisions (`WP-11.md`) and
the independent review change a row, a corrections table goes here in the WP-09 and WP-10 format.

## Lessons applied from the WP-01 to WP-10 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per decision kind (A23, A41, A53, A61); the matrix A69 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A68; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01 | §0.2 "Receipts"; A66 (three of the four results are neutral) |
| No receipt or status read tells anyone to act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01 (P0 class fix); WP-09 G-10 | A67 |
| Act-kind words: a provider handoff is a handoff, never a filing; staff and travel-agent sentences by shape | WP-07 F-06, F-20, F-21; WP-10 H-13 | §0.2 "Unknown-execution words"; A24, A34 |
| Exhausted reconciliation is a state of its own: Core refuses a change of the application's data with `filing_possibly_occurred`; no form; reason and owner shown | WP-09 G-02 | A46, A49 |
| Reconciliation has no stale-state guard: Core reads the act's live state and the current authority | WP-07 F-10 | A28 (no "changed since" refusal expected for an attempt); SA-09u is guarded by the application revision only (A21) |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A03 (SA-04l), A32 (history) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred"; A08, A12, A56; Q-04 |
| Expectations name only states that a read returns | WP-10 H-06 | A50 (a held correction is known only from the receipt summary), A58 |
| A state is labelled for the action it was evaluated for | WP-06 D-05 | A15, A37, A46 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A18, A38, A51 |
| No handler truncates, slices or drops a submitted field or an indexed row; over-limit input is refused at the field with the values kept | LD-17 (WP-06 D-10, WP-08 E-04, WP-09 G-07, WP-10 H-04) | A26, A44, A54, A63 |
| Identity values map from the posted form, the same for the same input, so that a replay is the same content | WP-03 C-04; WP-09 Q-W09-04 | A53, A54 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered, with no exact-parity claim | WP-07 D-W07-16; WP-03 F-W03-11; WP-10 H-02, H-03 | A16, A37, A46 |
| An outage of the evidence that a consequential review needs removes the form with an incomplete-review notice; access refusals are a separate test | WP-07 F-04; WP-10 H-05 | A15, A56, A72 |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A49, A51 |
| Evidence selections start unchecked, and after a refusal they are restored from the posted values | WP-09 G-07 | A48, A84 |
| Reassignment races are covered: the previous operator is refused by access; the new operator acts on Core's facts | WP-09 G-09 | A22; §3 V11-4 |
| No semantic duplicate guard is claimed where Core has none | WP-08 Q-W08-15; WP-09 G-03 | A53, A61 |
| Proofs rerun with a run tag and a fresh synthetic travel agent; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| Optional reads never hide an access change | LD-14 | A72 |
| One host page per command; forms of later packages stay reachable; every rendered form action is a registered route | CC-12 to CC-14; WP-03 Q-01; WP06-A110 | A77 |
| Copy states no configuration number that the page does not read | WP-01 Q-13 | A74 |
| A boundary of a decided policy never says that an owner still has to decide | LD-04; WP-08 Q-W08-03 | A09, A30 |
| Pending reasons read per (reason, next action) | WP-07 F-13 | A30, A62 |
| Kind 1 notes record whether criterion point 2 is demonstrated; no proposal is raised without it | WP-09 G-11 | §6 Q-01, Q-03, Q-04 |
| UI acceptance is separate from Core enforcement; a decision pending with Max or the orchestrator is recorded "Unmet" or "Partly met", not as a failure | WP-10 H-01, H-08, H-11 | §0.2 "Pass rule"; A43, A50, A60 |
| A page predicts no Core outcome; it shows Core's current facts | WP-10 H-10; WP-08 E-05 | A13 (no completion claim), A36 |
| Bans are scoped by fact | WP-08 E-12 | A74 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.2, §2.3, §3.1 steps 6 to 9, §3.2 (Unknown external execution, Dependency), §3.3, §5.1, §5.3, §5.4, §6.1, §6.3 (Exception, Support view, Recovery boundary), §7.4, §7.5, §8.3, §12 V11 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B19, B23, B24, B33, B34, B35; B18, B40 for boundaries |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4, §3.3 OP-04, §3.4 SA-01, SA-04, SA-09, §4.2 (Unknown external execution), §5.3 OP-04, §5.4 SA-01, SA-04, SA-09, §6.4, §7 (K-STD; rows Record reconciliation evidence, Record exceptional correction, Record unresolved external outcome), §8, §10, §11, §12.2 WP-11 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (Kind 1 criterion), §3.2 (Kind 2) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 16c0ca08e3fa8643… | §3 rows `core.authorize_unresolved_completion`, `core.correct_from_evidence`, `core.resolve_protection_mark`, `ops.record_reconciliation_attempt`, `core.apply_held_correction`; §5.1 WP-11 (3 commands); §5.3; §5.4 (admin case page → SA-09); §6 CC-04; §6.1 |
| LP | `PLAN.md` (this folder) | SHA-256 44733f6be225e795… | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-16, LD-17), §9 |
| W6 | `WP-06.md`; `WP-06-design.md` | SHA-256 a967bc071def9e25…; 327f580c1820bf40… | D-02; design §2.1 (SA-01 groups 12 and 15), §2.7.1 (SA-09 frame and registry), §2.7.5 (WP-11 kinds `unresolved_completion`, `correct_outcome`, `correct_fields`, `protection_mark`), §2.8, §2.9 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 5064e0c66680b9e8…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3 (Q-W07-02: reconciliation built in WP-07), §4.1 F-01, F-03, F-04, F-06, F-09 to F-12, §4.2 F-13, §4.3 F-16 to F-21; design §2.8.2 (act banners); WP07-A65 to A71, A76, A160; §3 V10-5 to V10-8 |
| W8 | `WP-08.md`; `WP-08-design.md` | SHA-256 076ac1b04d9119dc…; 7a74a46cc1480906… | §3 (Q-W08-03 boundary wording), §4.1 E-05, E-06, E-12, §4.2 E-13 to E-15; design §1.5 (SA delivery view and SuperAdmin single-file retrieval carried to WP-11), §2.10, receipt `result` with `followUp` |
| W9 | `WP-09.md`; `WP-09-acceptance.md` | SHA-256 97074922067b5db7…; 921a665b20da281a… | §3 (Q-W09-04), §4.1 G-01 to G-11; format, §0.2, §0.5 |
| W10 | `WP-10.md`; `WP-10-acceptance.md` | SHA-256 8915f4fe82061cba…; 53f0298e60cd2203… | §4.1 H-01 to H-14 (F-21 shape sentences through `WP-07.md` §4.3); format, corrections, lessons, §0.5 |
| PR | `PROPOSALS.md` | SHA-256 6543659b63c71253… | P-02, P-10 b, P-13 (criterion point 2 exceptions), P-15 |
| CAT | `catalogue/synthetic/catalogue.json` | as at e1f6ac9 | "SYN Tourist e-visa" declaration: acts `government_submission` and a separate `government_fee_payment`; form field `travelPurpose` (enum `tourism`); `deliveryEvidence.external_outcome_unresolved = none`; `completionEvidence.external_outcome_unresolved = []` |
| Code | lane repository | e1f6ac9 | `src/modules/core/commands/acts.ts` (`core.authorize_unresolved_completion`), `admin.ts` (`core.correct_from_evidence`, `core.resolve_protection_mark`), `drafts.ts` (`core.apply_held_correction`), `common.ts`; `src/modules/core/corrections.ts`, `controls.ts` (stages 3, 6, 7, 8), `store.ts` (`changeStageOf`, `activeMark`), `writers.ts` (`recordOutcome`, `recordOutcomeFromEvidence`, `setApplicantKey`, `recordExternalActEvidence`), `derived.ts` (`pendingOnAction`, `completionEvidence`, `monitorCounts`), `facade.ts` (`recordProtectionMark`), `staff-views.ts`; `src/modules/operations/case-work/commands/acts.ts`, `results.ts`; `src/modules/delivery/release.ts`; `src/modules/views/case-projectors.ts` (`historyLine`); `src/platform/restore-scope.ts`; `src/contracts/core.ts`, `operations-work.ts`, `views-cases.ts`, `views.ts`, `queries.ts`; `src/core-api/bindings/core.ts`, `allowlists.ts`; `src/kernel/command.ts`, `vocabulary/external-acts.ts`, `vocabulary/operations.ts`; `src/apps/staff/core/admin.ts`, `case.ts`; `src/apps/staff/views/cases.ts`; `src/apps/shared/views/cases.ts`; `src/web/route-inventory.ts`; `src/web/ui/presentation.ts`; `test/delivery/kit.ts` |

Verified facts of the code at e1f6ac9 that the items rely on (read by the author; the design review checks the rest):

- `core.authorize_unresolved_completion` (SuperAdmin; route `admin.applications.unresolved_completion`, POST
  `/admin/applications/:applicationId/unresolved-completion`). Wire input: `futureOwnerAccountId` (text, at most 40),
  `reason` (text, at most 1000); the binding adds `_rev.application`. Core input: an `acc_` id, a reason of 20 to 1000
  characters after trim, the expected revision. Order of checks: policy `outcome.authorize_unresolved` (SuperAdmin);
  lock of the application and of each of its authorizations; revision (`stale_revision`); an outcome is recorded
  (`outcome_already_recorded`); no act is `filing_unknown`, or any act is `authorized` (`act_state_transition_invalid`);
  each `filing_unknown` act has at least one reconciliation attempt with result `no_information` or `inconclusive`
  (`reconciliation_attempt_missing`); the future owner is an active, MFA-enrolled operator or SuperAdmin
  (`validation_failed` / `input_invalid`, field `futureOwnerAccountId`, code `not_active_staff`). Effects in one
  transaction: a TA notice `external_outcome_unresolved` (`{refiling: not_implied}`, no acknowledgement); each unknown
  act becomes `reconciliation_exhausted` with the future owner, the deciding SuperAdmin, the reason and the notice; the
  fact `core.unresolved_completion_authorized`; the outcome `external_outcome_unresolved` (dependents are evaluated
  again; an open price increase is superseded). There is no lifecycle, protection-mark, launch, custody or money check.
  Core does not complete the application: the lifecycle stays `submitted` and the assignment stays. Result: the
  application only (`{applicationId}`). After it, Core's pending answer for the synthetic e-visa is owner
  `unresolved_known_limitation`, reason `completion_check_trigger_unselected`, follow-up the assigned operator.
- After the decision. An act in `reconciliation_exhausted` is not open: `ops.record_reconciliation_attempt` and
  `ops.record_act_evidence` refuse it (`act_state_transition_invalid`). `core.authorize_external_act` refuses
  (`control_blocked`, first `outcome_already_recorded`, with `reconciliation_exhausted_no_refiling` among the blockers).
  The assigned operator's `ops.record_official_result` after the unresolved outcome keeps the outcome, opens the
  incident `official_fact_follow_up` owned by the future owner and returns `followUp: true`. The applicant-key guard
  refuses a new application of the same applicant, group and offering (`reconciliation_exhausted_no_refiling`) only
  when no open application holds that key; while the exhausted application is open, an individual intake matches it
  (`matched_existing`) and creates no new application.
- `core.correct_from_evidence` (SuperAdmin; route `admin.applications.correct_from_evidence`, POST
  `/admin/applications/:applicationId/correct-from-evidence`, discriminated by `kind`). Wire: `outcome` {`outcome` text
  40, `evidenceRef` at most 120, `reason` at most 1000}; `fields` {`identityChanges` (surname and given names at most
  100, date of birth 10, nationality and issuing country 3, passport number 30), `fields` (at most 100 keys, values at
  most 500), `declaredCountry` (3), `evidenceVersionIds` (at most 4 `dov_` ids), `evidenceRef`, `reason`}. The binding
  sends the reference as one `external_reference` (none when blank) plus the document versions. Core: reason 10 to
  1000 characters; at least one evidence item (`input_invalid`, field `evidence`); revision (`stale_revision`).
  Kind `outcome`: business evidence (`input_invalid`, field `evidence`, code `business_evidence_required`); lifecycle
  `draft` or `submitted` and outcome `issued` or `refused` (else `outcome_correction_not_allowed`); the same outcome
  (`validation_failed` / `correction_no_change`); any travel-agent retrieval or an accepted document email
  (`outcome_correction_not_allowed`); a dependent that ended `dependency_failed` (`outcome_correction_not_allowed`).
  Effect: the outcome and its time change; fact `core.outcome_corrected` with before, after and evidence; dependents are
  evaluated again, so a confirmed-unfiled dependent whose required outcome is no longer met can end `dependency_failed`.
  No notice is posted and the TA history allowlist has no line for it. Result: `{applicationId}`. Kind `fields`: the
  controls of `correct_application` (stage 3 `protection_mark_active`; stage 6 `application_not_open`; stage 8
  `correction_historical_after_filing` when an act is filed, a packet is released or the application is closed, and
  `filing_possibly_occurred` after an exhausted reconciliation); same-person evidence for each changed identity field
  (`identity_same_person_evidence_insufficient`); `correction_no_change`; `population_out_of_scope`; then the stage rule:
  applied, or held (`held_filing_unknown`) while an act is `authorized` or `filing_unknown`. An applicant-key change runs
  the key guard (`duplicate_open_scope`, `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required`).
  An applied correction writes a new snapshot, moves the material revision (a recorded readiness goes out of date),
  re-evaluates identity documents and checks possible duplicates. A held correction leaves the snapshot unchanged; a
  later filing makes it `superseded_by_filing` with a `post_filing_correction` incident; a later "not filed" makes it
  `released_for_reapply`. A released SuperAdmin correction is re-applicable only by a SuperAdmin through
  `core.apply_held_correction`, which the staff surface does not allow (edge allowlist only); Core's pending answer is
  then owner SuperAdmin, reason `held_correction_released`, next action `reapply_correction`. Core does not check form
  field keys against the declaration. With an assigned operator, Core posts the operator a notice `generic_case_update`
  `{event: superadmin_correction}`. Result: `{applicationId, correctionId, stage}`, the same shape as
  `core.record_assistance_entry` on the staff surface.
- `core.resolve_protection_mark` (SuperAdmin; route `admin.protection_marks.resolve`, POST
  `/admin/protection-marks/:markId/resolve`). Wire: `markId` (path), `applicationId` (hidden, text 40), `evidenceRef`,
  `reason`. Core: policy `protection_mark.resolve` on the application; a mark of another application
  (`not_found_or_forbidden` / `access_denied`); a mark that is not active (`stale_revision`); at least one evidence item
  of any kind; reason 10 to 1000. No revision; no check of the mark's flags, of the acts, of payments or of releases.
  Effect: the mark is resolved (by, at, reason, evidence); the application revision moves; fact
  `core.protection_mark_resolved`. Result: `{applicationId, markId}`; no other command returns `markId`. Only the restore
  procedure after an interval-loss restore creates a mark (`sys.record_protection_mark`, engineering); a mark carries
  `possibly_filed`, `possibly_paid`, `possibly_released`, the restore and the record time. While a mark is active, stage
  3 blocks every controlled action of the application except `record_outcome`, `complete` and `end_with_group`; file
  releases are refused `protection_mark_active`; Core's pending answer is owner SuperAdmin, reason
  `protection_mark_active`, next action `resolve_incident`. No test in the repository sends this command.
- Reads. `core.admin_case`: `acts` (kind, state, fee, authorized by and at, reconciliation owner), with no future owner,
  deciding SuperAdmin or reason; `mark` (`mark_id` of the first active mark only); no corrections; `completion` rows;
  `identityEvidence` (at most 20); `formFields`; `operators` (assignable operators; no SuperAdmin). `ops.case_work`
  (readable on the admin surface): `actEvidence` with references, `reconciliationAttempts` (method, result, recorded by
  and at, concluded evidence; no note), `incidents`. `views.audit_subject` (SuperAdmin, the fact log): facts with before
  and after, for example the mark's flags, the future owner of an unresolved decision, an outcome correction and a
  field correction. `views.admin_applications`: filters `filing=unknown` and `owner` (pending owner kind).
  `views.monitors`: `filingUnknownActs`, `exhaustedActs`, `activeProtectionMarks`.
- Today's pages. The old SuperAdmin case page carries the three forms (`admin.ts:308-354`): "Authorise unresolved
  completion" with the flash "The administrative completion was recorded" (a completion claim); the outcome correction;
  the field correction with identity and residence only (the handler sends `fields: {}`); the mark resolution, whose
  success goes to the assignment queue. The handlers cut `futureOwnerAccountId`, `outcome` and the mark's
  `applicationId` at 40 characters, cut identity values at their maximum and read only four evidence ticks, and compute
  the identity change against a read made at POST time (`identityChangesOf`), so an identical replay after acceptance
  becomes different content. The TA history line reads "Closed with the outside result unresolved"
  (`src/apps/shared/views/cases.ts:102`). WP-07 design §2.8.2 gives `reconciliation_exhausted` the banner "A SuperAdmin
  records the unresolved outcome (WP-11)."

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp11-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation only. Operators: `operator-1` (OP1: authorizes R and C), `operator-2`
  (OP2: R after the reassignment; the future owner), `operator-3` (OP3: holds a group read grant of the run's group).
  SuperAdmins: `superadmin-1` (SA1: set-up and the decisions) and `superadmin-2` (SA2: the second SuperAdmin of the
  races, and observation). They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`. Keyboard-only user.
  Screen-reader user. Phone user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-11 adds is named in the run record with its file and title.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A71).
- **Unknown-execution words (staff).** WP-07 design §2.8.2 governs the act banners, with the WP-11 amendment of A27.
  Act states: `authorized` "Authorized; execution not yet evidenced"; `filing_unknown` "Execution uncertain";
  `reconciliation_exhausted` "Reconciliation exhausted"; `filed_evidenced` "Filed (evidence recorded)";
  `not_filed_evidenced` "Not filed (evidence recorded)". A provider handoff uses handoff words (WP-07 F-06, F-21): "Handoff
  uncertain", "The handoff could not be confirmed". Outcome `external_outcome_unresolved`: "External outcome
  unresolved". Elapsed time never changes a state word: no "not filed", "failed", "expired", "timed out", "abandoned"
  or "lapsed" for an uncertain or exhausted act. The unresolved decision is never "completed", "closed", "done" or
  "resolved". No page offers "refile", "file again", "retry the filing" or "submit again" for an application whose
  filing may have happened.
- **Correction words.** "Applied" (the details changed now); "Held until the filing is reconciled" (recorded; the
  details shown are unchanged); "Not possible: [reason]". A correction shows its fields as "[label]: [before] → [after]"
  where a read returns both. "Correct" never reads as "Override" or "Edit".
- **Protection-mark words.** "Held after a restore". A mark's flags: "may have been filed during the interval the
  restore lost", "may have been paid", "may have been released". No "restored", "recovered" or "reopened".
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time are both shown where a
  read returns both.
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `dlv.*`, `doc.*`, `views.audit_subject`) shows "Read
  at [time] IST". A projection (`views.admin_applications`, `views.ta_history`) shows "Up to date when read at [time]
  IST", "Behind by [n] s when read at [time] IST" or "Freshness unavailable". No page applies a client-side age
  threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit says
  so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface, or when a
  read by the returned id establishes it (A66). Otherwise it reads "Request recorded" with the current facts labelled
  "Current" (WP-06 D-02). A receipt states what was recorded and Core's current next step; it never repeats an
  instruction from the past (F-01 class). The polite region announces it.
- **Replay terms** (used by every "Nth time" item; the five terms of the lane):
  1. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope); a double-click on the final button is the same case. Expected: the original result, nothing new.
  2. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form
     (`conflict_operation_key` / `operation_key_reused`); the page re-renders with a new form key, the typed values kept
     and "This form was already used with different content. Your values are kept: check them and send again.";
     nothing recorded.
  3. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. Back sends nothing. A send from that page is a new request; Core's own check decides it.
  4. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  5. *Lost acknowledgement* (fixture): C4 (CMP-13) "Checking the original result" and "Check status"; no new send of
     the same intent is offered there.
  Two more cases belong to the replay matrix (A69), never to a term: a *business duplicate* (a new key with the current
  page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta where a list, a count or a fact could change.
- **Paths (LD-03; WP-06 design §2.7.5).** Existing paths and form actions stay. Decision pages on the SA-09 frame:
  SA-09u `/admin/applications/:applicationId/decide/unresolved_completion`; SA-09o `…/decide/correct_outcome`; SA-09e
  `…/decide/correct_fields`; SA-09m `…/decide/protection_mark/:markId`. POSTs unchanged:
  `/admin/applications/:applicationId/unresolved-completion`, `…/correct-from-evidence` (hidden `kind` `outcome` or
  `fields`), `/admin/protection-marks/:markId/resolve`. Oversight (SA-04, existing paths): SA-04l
  `/admin/applications`; SA-04 `/admin/applications/:applicationId`; SA-04d `/admin/applications/:applicationId/delivery`.
  SA-01 `/admin`. Pages of other packages: OP-01, OP-02, OP-04a, OP-04b (`record=reconciliation`) (WP-07); OP-05,
  OP-07, TA-07r, TA-10, TA-07x (WP-08); TA-07, TA-08, TA-09 (WP-03); SA-03c, SA-06, SA-07a (WP-06). An item names the
  page; the run record names the path used.
- **Pass rule.** WP-11 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V11 proof of §3 passes, except the explicitly
  deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". An item
  whose result waits for a decision of §6 that only Max, the orchestrator or a Core change can give is recorded "Unmet:
  waits for [decision]" or "Partly met" with that reference, not as a failure (H-01 class). An item that the architect
  marks "partly met" by a recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2
  with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 and WP-08 are integrated (TA-09 creates drafts;
  TA-08 submits; SA-06 creates accounts and read grants; SA-07a records payments; SA-03a assigns and SA-03c reassigns;
  the SA-09 frame of WP-06; OP-02 starts work and records readiness; OP-04a authorizes; OP-04b records "Execution is
  uncertain", act evidence and reconciliation attempts; OP-05 records an official result and a later official fact;
  OP-07, TA-10 and TA-07x exist). Where one is not integrated, the step runs on the existing page and the run record says
  so. The processing instance of `lane-ui` runs. The harness can create, activate and sign in a new synthetic travel
  agent, and "SYN Tourist e-visa" admits it (checked first, §0.4).
- **Data hygiene.** WP-11 MUST NOT change seeded offerings, declarations, launches, listings, ceilings or accounts, MUST
  NOT create an offering, MUST NOT suspend or withdraw an offering (the rule-change case runs as a test), and MUST NOT
  run a restore or record a protection mark on `lane-ui` (BS B40: engineering and Max hold restore authority). Each run
  creates its own travel agent Y, group and applications, with notes, references and evidence that carry the run tag.
  Synthetic documents only, generated in memory; passport numbers are new in every run. The run record keeps identifiers
  (travel agent, applications, authorizations, attempts, corrections, incidents, operation references) in the internal
  record only.

### 0.3 Synthetic data used by WP-11

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp11-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06); ceiling stays at the default ₹0 | Every application of the run |
| Group | `wp11-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | R, C, F |
| R | "SYN Tourist e-visa" (`syn_tourist_evisa`), TravelMudra files; applicant RAVI | The V11 subject: authorized, uncertain, reassigned, reconciled without a conclusion, unresolved outcome, later official fact |
| C | "SYN Tourist e-visa"; applicant CHITRA | Filed, outcome "Issued" with no file; the outcome correction; the historical correction refusal |
| F | "SYN Tourist e-visa"; applicant FARAH; a draft whose typed given names are "FARA" while its passport shows "FARAH" | The identity correction from evidence on a draft. If TA-09 does not keep a typed spelling that differs from the passport, F runs as the fixture of A48 and the run record says so |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPELEVEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; rendered with `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`). Given names: R "RAVI", C "CHITRA", F "FARAH" | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Travel purpose | "tourism" (the only declared option) | Intake |
| Payments | "Payment received" for R and C, evidence reference `SYN-V11-[stamp]-[letter]` | Gate 1 and Gate 2 pass on payment; no exception is used |
| Evidence values | External references `SYN-V11-[stamp]-[letter]-[n]`; notes and reasons "WP11 [stamp] …" (a reason of the unresolved decision is at least 20 characters) | Act evidence, attempts, decisions, corrections |
| Fixtures (tests only) | An active protection mark inserted as `test/delivery/kit.ts` does; a held SuperAdmin correction on an uncertain act; a provider-handoff application; a suspended offering; a dependent T linked to an issued upstream | A24, A25, A42, A50, A55 to A64 |

### 0.4 Run recipe (rerunnable)

- Run tag `wp11-[yyyymmddhhmm]`. First check: the harness can sign in Y, and "SYN Tourist e-visa" admits Y (TA-03).
  Fallback when it does not: `syn-ta-1` with a run-tagged group (no other change to `syn-ta-1`), recorded in the run
  record.
- Baseline (step P-0, before the set-up): the OP-01 view counts of OP1 and OP2 (Action now, Waiting, Delivery and
  closure); OP2's incidents count; SA-01 group 12 lines ("Acts whose filing is unknown", "Acts closed with
  reconciliation exhausted") and group 15; the row count of SA-04l with `filing=unknown` (or "200 or more"); Y's TA-10
  count right after its activation. Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages): SA1 creates and activates Y. Y creates the
  group and the drafts R, C and F on TA-09. SA1 grants OP3 read access to the group. The rest of the set-up is in the
  steps of §3 where it is needed.
- Order (§3): P-0, Setup, Part V (V11-1 to V11-12, the unresolved outcome), Part C (outcome correction), Part F
  (identity correction), Part X (isolation, tests, axe). Data of earlier runs stays and is excluded by its tag.

### 0.5 Refusal shapes in the code at e1f6ac9 (category / code)

| Command | Refusals the items assert |
|---|---|
| `core.authorize_unresolved_completion` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; unknown application; support view); `validation_failed` / `input_invalid` with field `reason` (fewer than 20 or more than 1000 characters), `futureOwnerAccountId` (not an account id), `expectedRevision` (no `_rev.application`); `stale_revision` / `stale_revision` (the page's revision; the race of the act update); `control_blocked` / `outcome_already_recorded`; `control_blocked` / `act_state_transition_invalid` (no act with an unknown filing, or an act still authorized); `control_blocked` / `reconciliation_attempt_missing`; `validation_failed` / `input_invalid` field `futureOwnerAccountId` code `not_active_staff`; `conflict_operation_key` / `operation_key_reused` |
| `core.correct_from_evidence`, kind `outcome` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `outcome`, `evidence` (none), `reason`, `expectedRevision`; `stale_revision` / `stale_revision`; `validation_failed` / `input_invalid` field `evidence` code `business_evidence_required` (harness only: the page sends an external reference); `control_blocked` / `outcome_correction_not_allowed` (closed; outcome not `issued` or `refused`; a retrieval or an accepted document email exists; a dependent ended `dependency_failed`); `validation_failed` / `correction_no_change` |
| `core.correct_from_evidence`, kind `fields` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on identity lengths, field keys and values, `declaredCountry`, `evidenceVersionIds` (more than 4; not `dov_`), `evidence` (none), `reason`; `stale_revision` / `stale_revision`; `control_blocked` with the `correct_application` blockers (first code first): `protection_mark_active`, `application_not_open`, `correction_historical_after_filing`, `filing_possibly_occurred`; `control_blocked` / `identity_same_person_evidence_insufficient`; `validation_failed` / `correction_no_change`; `control_blocked` / `population_out_of_scope`; `conflict_duplicate` / `duplicate_open_scope`; `control_blocked` / `reconciliation_exhausted_no_refiling` or `later_attempt_declaration_required` (an applicant-key change) |
| `core.resolve_protection_mark` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; the mark of another application); `validation_failed` / `input_invalid` on `evidence` (no reference), `reason`, `applicationId`; `stale_revision` / `stale_revision` (the mark is not active: resolved before, or a race). No revision and no business refusal exist |
| Sent by harness steps, owned elsewhere | `ops.record_reconciliation_attempt` and `ops.record_act_evidence` on an exhausted act: `control_blocked` / `act_state_transition_invalid`; by the previous operator: `not_found_or_forbidden` / `access_denied`. `core.authorize_external_act` on R: while uncertain `control_blocked` / `act_already_open`; after the decision `control_blocked` / `outcome_already_recorded` with `reconciliation_exhausted_no_refiling`. `intake.start_individual` of R's applicant while R is open: no new application (`matched_existing`). `dlv.retrieve_document` (admin) while a mark is active: refused `protection_mark_active` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-11 |
|---|---|---|
| SA-09u Record the unresolved external outcome | 4652 `/admin/applications/:id/decide/unresolved_completion` (new GET on the SA-09 frame) | Scope, the reconciliation evidence, effect, hard stops, future owner and reason; the states with no form; the decision |
| SA-09o Correct the outcome | 4652 `…/decide/correct_outcome` (new GET) | The recorded outcome, the delivery facts that stop a correction, the effect on dependents; the correction |
| SA-09e Correct details from evidence | 4652 `…/decide/correct_fields` (new GET) | Identity, residence and declared form fields with evidence; the effect by stage (applied, held, not possible); the correction |
| SA-09m Resolve a protection mark | 4652 `…/decide/protection_mark/:markId` (new GET) | The mark's facts, the effect, evidence and reason; the resolution |
| SA-04 Application (oversight) | 4652 `/admin/applications/:id` (existing path, rebuilt) | OP-02 layout without operator actions; the protected-state banner; acts, evidence and attempts; the decision entry points; history from the audit record; carried forms of later packages |
| SA-04l Applications | 4652 `/admin/applications` (existing path) | The filter "Filing uncertain" and the rows that lead to SA-04 |
| SA-04d Delivery view (SuperAdmin) | 4652 `/admin/applications/:id/delivery` (existing path; carried to WP-11 by WP-08 design §1.5) | Boundary wording; no completion control; the SuperAdmin's single-file retrieval with purpose and reason (Q-06 decides whether WP-11 rebuilds it) |
| SA-01 Decision inbox | 4652 `/admin` (WP-06 page) | Groups 12 and 15: counts and their routes |
| OP-04b, OP-02, OP-01, OP-05, OP-07 of R | 4652 (WP-07 and WP-08 pages) | The exhausted state (WP-11 amendment of the WP-07 banner, A27); observation of the later official fact and completion |
| TA-07, TA-10, TA-07x, TA-09 | 4650 (WP-03 and WP-08 pages) | Observation of the unresolved outcome, the notice, the history line text (WP-11 copy fix), the intake of the same applicant |
| Old SuperAdmin case page | 4652 | Only: the WP-11 forms leave it; it becomes SA-04 (A77) |

Read models: SuperAdmin case (`core.admin_case`), Case work (`ops.case_work`), Audit subject (`views.audit_subject`),
SuperAdmin applications (`views.admin_applications`, projection), Monitors (`views.monitors`), Delivery page
(`dlv.delivery_page`, staff), Operator case (`core.ops_case`), TA application case (`core.ta_application`), TA history
(`views.ta_history`, projection), Notices (`dlv.notices`), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 3 WP-11 commands)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `core.authorize_unresolved_completion` | `admin.applications.unresolved_completion` (`…/unresolved-completion`) | SA-09u (UI-PLAN "Record unresolved external outcome"; SA-09 kind of AD-13) | A11 to A26; consequences A27 to A35 |
| 2 | `core.correct_from_evidence` | `admin.applications.correct_from_evidence` (`…/correct-from-evidence`) | SA-09o (kind `outcome`); SA-09e (kind `fields`) (UI-PLAN "Record exceptional correction") | A36 to A44 (outcome); A45 to A54 (fields) |
| 3 | `core.resolve_protection_mark` | `admin.protection_marks.resolve` (`/admin/protection-marks/:markId/resolve`) | SA-09m (decision kind of CC-04) | A55 to A64 |
| ref | `ops.record_reconciliation_attempt` | `ops.case_work.reconciliation` | OP-04b `record=reconciliation` (built in WP-07, Q-W07-02) | WP07-A67, A68, A76 and §3 V10-7 to V10-8a own it; WP-11 does not repeat them. WP-11 asserts only its state after an exhausted reconciliation (A27, A28) and uses it as set-up (§3 V11-5) |

All of them also: A65 (shell), A66 (receipt checked against the operation), A67 (no instruction to act), A68 (no record
for a refusal; lost acknowledgement), A69 (replay matrix), A70 and A71 (refusal text), A72 (LD-14), A73 to A78 (role
controls, copy, read grant and support view, storage, host pages and carried forms, isolation).

UI-PLAN §12.2 names two actions for WP-11. "Record reconciliation evidence" is `ops.record_reconciliation_attempt`,
built in WP-07. "Record unresolved external outcome" is command 1. The register adds command 2 (no WP command list names
it; WP-11 is the first package that builds SA-04) and command 3 (CC-04).

Commands outside WP-11 that the proofs touch only as set-up or observation: `iam.create_account`,
`iam.activate_account`, `iam.create_group_read_grant` (WP-02, WP-15); `intake.start_individual`, `core.edit_draft`,
`core.submit` (WP-03); `pay.record_service_status`, `core.assign`, `core.reassign` (WP-06); `ops.start_work`,
`ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence`, `ops.record_reconciliation_attempt`
(WP-07); `ops.record_official_result` (WP-08). The byte release `dlv.retrieve_document` (admin routes) is carried on
SA-04d (A09).

### 1.3 State coverage

S1 (loading) does not apply: every WP-11 page is server-rendered. S5 applies only to SA-04l and TA-07x (projections).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-09u | Allowed A11 to A14; no attempt, act still authorized, no uncertain act, outcome recorded A15; evidence read unavailable A15, A72 | A17 | A18 | A19, A20 | A23 (5) | A21, A22 |
| SA-09o | Allowed A36; outcome not correctable, result received, delivery read unavailable A37 | A38 | A38 | A39, A40 | A41 (5) | A41 |
| SA-09e | Applied (open) A45; held A46, A49; exhausted A49; historical A49; protection mark A46; closed A46 | A48, A51 | A48, A51 | A48, A50 | A53 (5) | A53 |
| SA-09m | Active mark A56; mark not active A58; mark facts unavailable A56 | A59 | A59 | A59, A60 | A61 (5) | A61 (no revision: business check) |
| SA-04 | Uncertain A05; exhausted A08; marked A06, A62; S4 A72 | — | — | — | — | — |
| SA-04l | Filtered list, empty, no match, at the row limit, lag A03 | — | — | — | — | — |
| SA-01 | Groups 12 and 15 with work, none, unavailable A01, A02 | — | — | — | — | — |
| OP-04b, OP-02, OP-05, OP-07 of R | Exhausted A27; refusals A28; follow-up A29; completion rows A30 | — | A28 | A29 (observe) | — | — |
| TA-07, TA-10, TA-07x, TA-09 | Unresolved outcome A31; notice and history A32; same applicant A33 | — | A33 | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-11 shows | Items |
|---|---|---|
| V11: a current-authorized user records or reconciles an already attempted act after an assignment or rule change, without an offer of unauthorized new filing; actual historical evidence remains intact | After R's reassignment, OP2 (not OP1) reconciles (WP-07, observed); no page offers a new submission; the SuperAdmin records the unresolved outcome from the recorded attempts; afterwards no attempt, no evidence and no authorization is accepted, a later official fact opens a follow-up and keeps the outcome, and every earlier record stays with its actor and time. Rule change: by test | A11 to A35; §3 Part V |
| UX §3.2 Unknown external execution: protect possible filed facts | Banners on SA-04, SA-09e and OP-04b; corrections held or refused, never applied over a possible filing | A05, A27, A46, A49, A50 |
| UX §3.2: keep proposed corrections separate | A held correction changes no shown detail and says so; its later display and re-application wait for Q-01 | A46, A50; Q-01 |
| UX §3.2: show reconciliation evidence, owner and next step | SA-09u and SA-04 list each attempt, the reconciliation owner and Core's next step; after the decision the future owner | A05, A08, A12 |
| UX §3.2: never label elapsed time as "not filed" | A sweep over every renderer of an uncertain or exhausted act | A34 |
| BS B23: exhausted reconciliation, administrative unresolved outcome, attempts, reason, TA notice, future owner; never safe refiling; B24 prerequisites still apply | SA-09u decision and its effects; no completion claim; completion rows as Core reports | A13, A19, A20, A28, A30, A33 |
| BS B19: filed, protected, released or completed facts remain historical; no latest-write-wins | Corrections refused as historical; the stage rule; reassignment moves the reconciliation duty | A22, A35, A49 |
| BS B33: actor, evidence, reason and before and after with each consequential fact; required evidence unavailable means no claimed action | SA-04 history; evidence outages remove the decision form | A07, A15, A56 |
| BS B34: sole writers | Core records each decision; only the assigned operator records attempts; no SuperAdmin act or reconciliation control | A10, A28 |
| BS B35: atomicity and retry | Replay terms per kind; the matrix | A23, A41, A53, A61, A69 |
| BS B40 and UX §6.3 Recovery boundary: no restore or reopen control; after a restore, evidenced re-entry through existing commands | SA-09m resolves a mark only; it restores nothing | A57, A64; §5 |
| V15 (part): no SuperAdmin filing or readiness privilege | SA pages hold no operator control | A10 |
| V24 (keyboard and phone) | The WP-11 tasks by keyboard and at 390 px | A79 to A90 |

## 2. Acceptance checklist

### 2.1 Oversight: SA-01, SA-04l, SA-04 and SA-04d

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A01 | SuperAdmin (SA2) | SA-01 group 12 "Uncertain external results" at P-0, after §3 V11-1 and after V11-6 | Read the group. Follow its route. | The lines "Acts whose filing is unknown: [n]" and "Acts closed with reconciliation exhausted: [n]" from `views.monitors`, each with its unit. Deltas from P-0: +1 unknown after V11-1; −1 unknown and +1 exhausted after V11-6. The route "Applications with an uncertain filing" opens SA-04l with the filter "Filing uncertain" applied. A count that cannot be read shows "Unavailable" with "This count cannot be read now.", never "0". | L | UX §6.2 Home; PL SA-01; WP-06 design §2.1 group 12 |
| WP11-A02 | SuperAdmin; test | SA-01 group 15 "Protection marks after a restore" | Read the group (lane: count 0). Test: one active mark (fixture). | The line "[n] applications held by a protection mark". With a mark, the group offers a route to the marked applications as Q-09 decides (for example SA-04l filtered on "Waiting on a SuperAdmin", where each row names "Held after a restore"), or states that no list exists yet. A zero count shows in "Nothing waiting now". | L (count) + T | WP-06 design §2.1 group 15; `views-cases.ts` (`activeProtectionMarks`); Q-09 |
| WP11-A03 | SuperAdmin (SA2) | SA-04l with "Filing uncertain" (§3 V11-1) | Apply the filter. Clear it. Apply a filter that matches nothing. | The rows come from `views.admin_applications` with `filingUnknown`: applicant, service, mode words, common progress, outcome or "Outcome not recorded", Core's pending owner and reason in words; each row links to SA-04. R is listed. The page shows the lag freshness of the projection, never "Read at". At 200 rows it says "This list shows at most 200 applications" and claims no total. "No application has an uncertain filing" (S2) differs from "No application matches these filters" with "Clear filters" (S3). The filter change announces the result count and keeps focus (AC-16). | L | UX §6.2; PL SA-04; AC-16, AC-22; LD-08; `views-cases.ts` |
| WP11-A04 | SuperAdmin (SA2) | SA-04 of R, C and F | Read the page from the top. | The OP-02 layout without operator actions (UI-PLAN SA-04): identity band (applicant, masked identity cue, application reference, country, service, mode words, travel agent, assigned operator); status facts as separate labelled rows (common progress, lifecycle, outcome, filing and external act, readiness, payment, custody, delivery, next owner and action from Core's pending answer); no combined badge. The readiness and filing rows say "The assigned operator makes this judgment." "Read at [time] IST". | L | UX §2.2, §2.3, §6.2; PL SA-04; BS B18 |
| WP11-A05 | SuperAdmin (SA2) | SA-04 of R while its filing is uncertain (§3 V11-1, V11-5) | Read the banner and the External acts section. | Above the sections: "Possibly filed: treated as filed until reconciled. The government submission may have reached the authority at any time after it was authorized. No ordinary withdrawal, refiling or correction applies until its evidence is recorded." (draft; B23). The act row: "Government submission · Execution uncertain · Authorized [time] IST by OP1 · Reconciliation owner: [name now]". Below it, from `ops.case_work`: the evidence records (result, references, event and recorded time, recorded by) and each reconciliation attempt (method, what was found, recorded by, recorded at IST, concluded evidence or "None"). Core's next step in words ("The assigned operator reconciles the filing"). No text derives "not filed" from the time elapsed (A34). | L | UX §3.2 (Unknown external execution), §5.3; BS B23; `contracts/operations-work.ts` (`reconciliationAttempts`) |
| WP11-A06 | SuperAdmin; test | SA-04 "Decisions" section of R, C, F and a marked fixture | Read the section. | One entry per WP-11 decision kind, each a link to its SA-09 page with Core's facts as its state: "Record the unresolved external outcome" (available, or the reason of A15); "Correct the outcome" (A37); "Correct details from evidence" (A46); "Resolve the protection mark" with the banner "Held after a restore" (A55). SA-04 itself holds no form of these commands (A77). The carried forms of later packages stay with their markup, fields, action and success redirect (price increase, operational withdrawal, deferral decision, travel-date recheck: WP-17). | L + T (mark) | PL SA-04 ("each via SA-09"); AD-13; CC-04; LD-02; WP06-A110 |
| WP11-A07 | SuperAdmin (SA2) | SA-04 history of R, C and F after §3 | Open the history (section or the audit subject page, as the design decides). | Lines from the audit record (`views.audit_subject`), oldest first: actor, event time and recorded time, evidence references, reason where recorded; an original entry and its correction both (for C: "Outcome recorded: Issued" and "Outcome corrected: Issued → Refused" with the reference); for F: "Given names: FARA → FARAH" with the evidence; for R: the authorization, the uncertain record, each attempt, the unresolved decision with its future owner. Nothing replaces an earlier line. A link to the full audit (SA-08). A history read that fails shows "Unavailable" for the history only. | L | UX §6.2, §7.4 Timeline; BS B33; PL SA-04 ("full history"); Q-04 |
| WP11-A08 | SuperAdmin (SA2) | SA-04 of R after the decision (§3 V11-7, V11-11) | Read the status facts, the banner, the acts and the history. | Outcome "External outcome unresolved" with "TravelMudra could not confirm whether the submission reached the authority. Refiling is never implied."; the act "Reconciliation exhausted"; the future owner, the deciding SuperAdmin, the time and the reason (from the audit record; "Unavailable" when it cannot be read); every earlier evidence record and attempt still listed. After V11-11: the follow-up incident with its owner (the future owner) and state. Lifecycle stays "Submitted"; no text says "Completed", "Closed" or "Done". | L | UX §2.2, §3.2; BS B23; Q-04 |
| WP11-A09 | SuperAdmin; test | SA-04d of C (if WP-11 rebuilds it, Q-06) and of a marked fixture | Read the page. Retrieve one file with a purpose and a reason. Test: retrieve while a mark is active. | The boundary block uses the WP-08 §2.10 wording; no completion control; no "Owner not yet decided" (LD-04). The single-file retrieval offers the purposes "Evidence for a correction", "Evidence of a payment", "A disclosure incident" (the closed list `ADMIN_BYTE_PURPOSES`, none preselected) and a required reason; one file only, no selection. Each retrieval rechecks the file now (K-BYTE); a refusal names Core's reason (for a marked application: "After a restore, this application is held until a SuperAdmin checks it. Its files are not released meanwhile."). | L + T | WP-08 design §1.5 (carried to WP-11); `contracts/delivery.ts`; `release.ts:202`; PL §7 K-BYTE |
| WP11-A10 | SuperAdmin; harness | SA-04, SA-09u, SA-09o, SA-09e, SA-09m and SA-04d of R and C | Look for operator controls. Harness as SA1: post a reconciliation attempt, an act evidence record and an authorization on R. | No SuperAdmin page shows a control to authorize an act, record act evidence, record a reconciliation attempt, mark execution uncertain, confirm readiness or record an official result. Each harness post is refused as not found or forbidden; nothing is recorded (attempt and evidence counts delta 0). | L | BS B18, B34; UX §2.3, §12 V15; PL SA-04 |

### 2.2 SA-09u Record the unresolved external outcome (`core.authorize_unresolved_completion`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A11 | SuperAdmin (SA1) | SA-09u of R (§3 V11-6), from SA-04 and from an SA-04l row | Open the page. Read Scope. | The SA-09 frame (WP-06 §2.7.1) in UX §7.3 order: Scope → Evidence → Effect → Hard stops → Your decision → Review → buttons. `h1` "Record the unresolved external outcome: [applicant]"; freshness "Read at [time] IST". Scope: "Application [reference] · [service] · Travel agent [name]. Decision: record that reasonable reconciliation of the government submission is exhausted, and record the outcome 'External outcome unresolved'." No word "complete", "close" or "override" in the title or the button. | L | UX §6.3; PL SA-09 (kind "authorize external_outcome_unresolved completion"), SA-04; AD-13; WP-06 design §2.7.5 |
| WP11-A12 | SuperAdmin (SA1) | SA-09u of R, section Evidence | Read it. | For each act whose filing is unknown: kind words; "Authorized [time] IST by [OP1]"; "Recorded as uncertain [time] IST by [OP1]" with the statement's references; "Reconciliation owner now: [OP2]"; the attempts table (method, what was found, recorded by, recorded at IST, concluded evidence) with "[n] attempts" in words. Acts in other states are listed with their state. The notes of the attempts show only if a read returns them; otherwise the page says "The notes of each attempt are not shown on this page." (Q-04). No line says or implies "not filed" from the time elapsed. | L | UX §3.2 ("Show reconciliation evidence, owner and next step"); BS B23; `ops.case_work`; Q-04 |
| WP11-A13 | SuperAdmin (SA1) | SA-09u of R, Effect, Hard stops, Review | Read them. | Effect: "This decision records: each act listed above becomes 'Reconciliation exhausted'; the outcome becomes 'External outcome unresolved'; the travel agent is sent a notice that no refiling is implied; the future owner you name owns the follow-up of any later official fact." "It does not: say that the application was filed or not filed; complete the application (completion is a separate step with its own checks); change the assignment; change any evidence or attempt recorded; change money facts (a reserved or possibly paid government fee stays as Payment Records shows it)." "After it: no new filing, government fee payment or ordinary withdrawal of this application is possible; corrections of its details are not possible; the assigned operator records a later official fact on Outcome and result file, which opens a follow-up and leaves this outcome unchanged." Hard stops: "No decision on this page permits refiling." Current completion rows from Core, labelled "Now", with no prediction of the completion after the decision (H-10). Review (visible): "When you record this: [n] acts become 'Reconciliation exhausted'; the outcome becomes 'External outcome unresolved'; the travel agent is notified; your name, the reason and the time are recorded." | L | UX §3.2, §6.3; BS B23, B24; PL §4.2 (Exhausted), SA-04 row; `acts.ts:171-215`; WP-10 H-10 |
| WP11-A14 | SuperAdmin (SA1) | SA-09u of R, Your decision | Inspect the fields. | "Future owner of any later official fact" (required; radios or a select with a visible label; no preselection; the active operators Core lists, by name); hint "This person owns the follow-up that a later official fact opens." "Reason" (required, textarea, maxlength 1000), hint "At least 20 characters. Recorded with the decision and shown in the audit history." Hidden `_rev.application` only. Buttons "Record the unresolved outcome" (primary, destructive variant; the page is the confirmation) and "Cancel" → SA-04. | L | UX §7.4 (Review and confirm); `acts.ts:170`; `contracts/core.ts:134`; Q-08 |
| WP11-A15 | SuperAdmin; test | SA-09u in each state (first match) | Open the page in each state: (1) outcome recorded; (2) no act with an unknown filing; (3) an act still authorized (fixture); (4) an uncertain act with no attempt that found nothing (§3 V11-2); (5) `ops.case_work` unavailable (availability failure); (6) an access refusal of an optional read. | (1) "An outcome is recorded: [label]. There is nothing to decide here." No form. (2) "No act of this application has an unknown filing. There is nothing to decide here." No form. (3) "The [act] is authorized and its execution is not evidenced yet. The assigned operator records what happened first. Owner: [operator]." No form. (4) CMP-10 "Recording the unresolved outcome is unavailable until each act with an unknown filing has a recorded reconciliation attempt. Owner: [reconciliation owner], on the act page." with the route to OP-04b. No form. (5) The frame and Scope stay; Evidence reads "The reconciliation evidence cannot be read now."; CMP-10 "The review is incomplete: the reconciliation evidence cannot be read now. Try again later. Owner: TravelMudra."; no form (F-04 class). (6) The shell access page (SH-02, sign-in or maintenance), never the facts read earlier (LD-14). | L ((1), (4)) + T | `acts.ts:183-189`; WP-07 F-04; WP-10 H-05; LD-14 |
| WP11-A16 | Test | The actual SA-09u renderer and `core.authorize_unresolved_completion` | Fixtures: outcome present or not; acts in each state and combination; attempts with each result; `ops.case_work` available or not; future owner active, suspended, without MFA, a SuperAdmin. Render, then send the form (or a saved envelope where no form shows) for each fixture. | Where Core accepts, the renderer shows the form. Where the read facts show a refusing fact, the renderer shows the state of A15 and no form, and Core refuses with that code. The test lists the known discrepancies and asserts each (H-02): a future owner who is a SuperAdmin is accepted by Core but is not in the page's list (Q-08); an owner who became inactive after the read is refused at the field. No fixture where Core accepts renders without a form, except the evidence outage of A15 (5). | T | WP-10 H-02, H-03; WP-07 D-W07-16 |
| WP11-A17 | SuperAdmin (SA1) | SA-09u of R (§3 V11-6) | Send with no future owner and a reason of 12 characters. Then send with a reason of 1001 characters (harness). | C1: the error summary links to "Future owner: choose who owns the follow-up." and "Reason: write at least 20 characters."; the typed reason stays; the over-long reason is refused at the field with the value kept, never cut. Nothing is recorded (act states and outcome unchanged). | L | AC-08; CMP-07; LD-17; `common.ts` (`zLongReason`) |
| WP11-A18 | SuperAdmin; harness; test | SA-09u refusals | (1) Harness: a send with R's current revision before any attempt (§3 V11-2). (2) Test: a send after an act became authorized again on another kind. (3) Test: a send after the outcome was recorded by another SuperAdmin with a fresh revision. (4) Harness: a future owner id of a suspended operator. (5) Harness: as an operator; as `syn-ta-2`. | (1) "Each act with an unknown filing needs a recorded reconciliation attempt first." with the owner and route (`reconciliation_attempt_missing`). (2) "An act of this application is authorized and its execution is not evidenced yet." (`act_state_transition_invalid`). (3) "An outcome is already recorded: [label]." (`outcome_already_recorded`). (4) At the field: "Choose an active operator." (`not_active_staff`), the reason kept. (5) Not found; no fact shown. Nothing is recorded in each case (act states, outcome and notice count delta 0). | L ((1), (4), (5)) + T | §0.5; `acts.ts:183-193` |
| WP11-A19 | SuperAdmin (SA1) | SA-09u receipt (§3 V11-6) | Record the decision. Read the receipt. | C3 receipt "Request recorded" (neutral: the result carries the application only, D-02). Current, labelled "Current": outcome "External outcome unresolved"; each act "Reconciliation exhausted"; future owner [name] (from the audit record, or "Unavailable"); lifecycle "Submitted"; Core's pending owner and reason in WP-08 words. "Recorded once. Sending the same form again does not repeat it." No accepted time. No text says "completed", "closed", "done" or "the administrative completion was recorded". The polite region announces it; focus does not move. | L | CMP-08; WP-06 D-02; P-02; BS B23; `admin.ts:50` (today's flash, replaced) |
| WP11-A20 | SuperAdmin; operator; TA | Reads after §3 V11-6 | Read SA-04, OP-04b, OP-02, TA-07 and TA-10 of R. | Core's effects as read: each formerly uncertain act "Reconciliation exhausted"; outcome recorded; the TA notice listed on TA-10 (Y's count +1 from P-0); OP2 stays the assigned operator; lifecycle "Submitted" (no completion); the evidence records and attempts unchanged in number and content. | L | `acts.ts:194-213`; BS B23 |
| WP11-A21 | SuperAdmins (SA1, SA2) | SA-09u of R in two sessions (§3 V11-6) | Both open the page. SA1 records. SA2 sends with a different owner. | SA2: C5 (CMP-14) "Changed since your review." with the changed facts (outcome now "External outcome unresolved"; acts "Reconciliation exhausted"), SA2's chosen owner and reason kept as unsent values; a reload shows "An outcome is recorded" and no form. Nothing more is recorded (one decision fact; one notice). | L | UX §3.3; BS B19, B35; `acts.ts:182` |
| WP11-A22 | Test | SA-09u opened, then a change before the send | (1) A reassignment of R (OP2 → OP1). (2) The operator records a concluding attempt "Filing found" with a reference. (3) The operator records a further attempt that finds nothing. | (1) and (2): C5 with the current facts (the new operator; the act "Filed (evidence recorded)"); nothing recorded. After (2) a reload shows A15 (2). (3): accepted: an attempt that does not conclude moves no revision; the decision rests on Core's current facts. No "changed since" refusal is expected for (3) and no new guard is proposed (WP-07 F-10). | T | WP-09 G-09; WP-07 F-10; `acts.ts` (operations: no Core call for a non-concluding attempt); `writers.ts` (`recordExternalActEvidence` moves the revision) |
| WP11-A23 | SuperAdmin (SA1); harness | SA-09u, the Nth time | Replay terms 1 to 5 on the decision of §3 V11-6. Term 2 changes the future owner. Term 3: press Back after the receipt; harness: a new-key send with the current revision from the reloaded SA-04. Term 4: A17's refusal, then the corrected send. | (1) The original receipt; one decision fact, one notice, one outcome. (2) Refused as a used form; owner and reason kept; nothing recorded. (3) Back reloads SA-09u with "An outcome is recorded" and no form; the new-key send is refused `outcome_already_recorded` and records nothing. (4) Recorded once. (5) C4; no new send is offered there; "Check status" shows the accepted result. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP11-A24 | Test | SA-09u, SA-04, OP-04b and TA-07 of a provider-handoff application whose handoff is uncertain, before and after the decision (fixture H) | Render. Send the decision. | Handoff words throughout (WP-07 F-06, F-21; WP-10 H-13): "The handoff to the declared provider could not be confirmed"; no text says that the application was or was not filed with the authority. The decision is accepted as for R. The TA sentence is neutral (F-21). | T | UX §3.2 (Third-party filed); `WP-07.md` F-06, F-20, F-21 |
| WP11-A25 | Test | Rule change: the offering of an uncertain application is suspended (with an existing-work treatment) or withdrawn (fixture) | The operator records an attempt; the SuperAdmin records the decision; the operator requests a new authorization. | The attempt and the decision are accepted (no launch control applies to them); the new authorization is refused with Core's launch reason; no page offers it. The pages state the offering's state as a fact and do not hide the reconciliation. | T | UX §3.2 (Withdrawn/suspended offering: "reconciliation … remain governed by their normal checks"), §6.3; BS B07; V11 ("after … rule changes") |
| WP11-A26 | Test | The SA-09u handler (`admin.applications.unresolved_completion`) | Send a future owner id of 41 characters, a reason of 1001 characters, and both with surrounding spaces. | The handler sends every field whole: no `.slice`; an over-limit value is refused at its field with the value kept; Core's own validation decides the rest. A BFF test with a scripted Core asserts the exact input Core receives. | T | LD-17; `admin.ts:601-603` (today's `.slice(0, 40)`) |

### 2.3 After the decision: operator and travel-agent pages (V11)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A27 | Operator (OP2) | OP-04b and OP-02 of R after the decision (§3 V11-8) | Read every tab and the act page. | The exhausted banner (WP-11 amendment of WP-07 design §2.8.2, AM-W11-01): "Reconciliation exhausted: TravelMudra could not confirm whether the government submission reached the authority. The outcome 'External outcome unresolved' is recorded. Refiling is never implied. A later official fact is recorded on Outcome and result file and opens a follow-up." No text "A SuperAdmin records the unresolved outcome", and no package id in user copy. No reconciliation, evidence, uncertain or authorization form; the act history (authorization, uncertain record, attempts) stays listed. OP-02 "Ending the case": ordinary withdrawal unavailable with its reason. A link "Record a later official fact" → OP-05. | L | UX §3.2; BS B23; WP-07 design §2.8.2; Q-07 |
| WP11-A28 | Harness as OP2 and OP1 | Commands on R after the decision (§3 V11-8) | As OP2: a reconciliation attempt; an act evidence record; a new authorization of the submission (envelope with the earlier readiness and digest). As OP1: a reconciliation attempt. | OP2's attempt and evidence: refused "That change of the act's state is not allowed: reconciliation is exhausted." (`act_state_transition_invalid`); the authorization: refused with "An outcome is already recorded." and "Reconciliation was exhausted; refiling is never implied." (`outcome_already_recorded`, `reconciliation_exhausted_no_refiling`). OP1: refused by access (SH-02 or not found). Nothing is recorded (attempt, evidence and authorization counts delta 0). No "changed since" comparison is expected for an attempt (F-10). | L | §0.5; WP-07 F-10; `acts.ts` (operations) `:57-64`; `controls.ts:335` |
| WP11-A29 | Operator (OP2); SuperAdmin | OP-05, OP-02 incidents and SA-04 of R (§3 V11-11) | OP2 records a later official fact "Issued" with `SYN-V11-[stamp]-R-RES` and no file. Read OP-05, OP2's incidents, SA-04. | Observe WP-08: the receipt "Later official fact recorded" (`followUp: true`); the outcome stays "External outcome unresolved". WP-11 asserts: a follow-up incident (kind words "A later official fact after an unresolved outcome") owned by the future owner OP2 appears on OP2's incidents (count +1 from P-0) and on SA-04; no page says that the outcome changed to "Issued" or that the earlier submission was filed. | L | BS B23 ("A later official fact appends owned follow-up"); `writers.ts:340-350`; `results.ts:110-123`; WP-08 design receipt table (`result`, `followUp`) |
| WP11-A30 | Operator (OP2); SuperAdmin | OP-01 row, OP-02 action panel and OP-07 of R after the decision | Read. | OP-01 places R by WP-08's mapping of Core's pending answer (`unresolved_known_limitation`, `completion_check_trigger_unselected`); the words never read "Owner not yet decided" (LD-04; Q-W08-03). OP-07 lists Core's completion rows (no possible filing: met; delivery and declared completion as Core reports for this outcome) and the completion boundary in WP-08 words; no completion is claimed and no control forces it. | L | LD-04; WP-08 E-05, E-06; WP-07 F-13 class; `derived.ts:423`; `presentation.ts:173` |
| WP11-A31 | TA (Y) | TA-07 of R after the decision (§3 V11-9) | Read the page. | Outcome "External outcome unresolved" with "TravelMudra could not confirm whether your application reached the authority. TravelMudra does not file it again. If the authority later sends a result, TravelMudra follows it up." (draft). Common progress as Core reports. No "Not filed", "Failed", "Refused", "Completed" or "Closed"; no control to file again, apply again for this application, or withdraw it as an ordinary withdrawal. | L | UX §2.2, §3.2, §4.4; BS B21, B23; `presentation.ts:129` |
| WP11-A32 | TA (Y) | TA-10 and TA-07x of R (§3 V11-9) | Read the notice and the history. | TA-10: one notice for R (count +1 from P-0), linked to R, no acknowledgement and no read marker; its text says that TravelMudra could not confirm the result and does not file the application again. TA-07x, each line with "Recorded [time] IST" and the lag freshness: the decision line reads "TravelMudra recorded that the outside result could not be confirmed" (WP-11 copy fix of `shared/views/cases.ts:102`; never "Closed"); "Outcome recorded: External outcome unresolved"; the notice line. | L+T | LD-06, LD-08; UX §2.2 ("completed means normal processing ended"); `case-projectors.ts` (`unresolved_completion_authorized`) |
| WP11-A33 | TA (Y); test | TA-09 of the group, adding RAVI again for "SYN Tourist e-visa" (§3 V11-10); test after R is closed | Start the individual intake with R's passport. Test: the same after R is completed (harness completion check) and in another group. | Live (R open): no new application is created (application count delta 0); TA-09 states that RAVI already has this service in this group, with a link to R (`matched_existing`), and offers no way to create a second one. Test: after R is closed, the same intake is refused "This applicant's earlier application for this service in this group could not be confirmed as filed or not filed. A new application for it is not possible." (`reconciliation_exhausted_no_refiling`); in another group, Core decides as usual. | L+T | BS B23 ("never grants safe refiling"); `writers.ts:76-84`; `intake-writers.ts:96-110`; Q-12 |
| WP11-A34 | Test | Elapsed-time sweep (`test/unit/web/unresolved-outcome-sweep.test.ts`, or the design's name) | Render SA-04, SA-04l rows, SA-09u, SA-09e, OP-01 rows, OP-02, OP-04b, OP-07, TA-07, TA-10 and TA-07x for an act `authorized`, `filing_unknown` and `reconciliation_exhausted`, of each act kind, with authorization times 1 hour, 30 days and 400 days old. | No rendered text contains "not filed", "failed", "expired", "timed out", "abandoned", "lapsed", "no longer pending", or (before a completion) "completed" or "closed" for these acts or for the unresolved outcome; act-kind words follow §0.2; every `EXTERNAL_ACT_STATES` value has staff and TA words with the code fallback. | T | UX §3.2 ("never label elapsed time as 'not filed'"); BS B23; PL §4.2 (Corrections); WP-10 H-13 |
| WP11-A35 | SuperAdmin; operator | SA-04 and OP-04b of R after §3 V11-11 | Compare with the records of V11-1 to V11-5. | Every earlier record stays with its original actor and time: the authorization by OP1, the uncertain record by OP1, the attempts by OP2, the decision by SA1, the later official fact by OP2. Nothing is edited, merged or hidden; the reassignment shows as an assignment fact, not as a change of who did what. | L | UX §12 V11 ("actual historical evidence remains intact"); BS B19, B33 |

### 2.4 SA-09o Correct the outcome (`core.correct_from_evidence`, kind `outcome`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A36 | SuperAdmin (SA1) | SA-09o of C (§3 V11-C2) | Open from SA-04. Read the page from the top. | `h1` "Correct the outcome: [applicant]". Scope: "Recorded outcome: Issued. Correction: Refused." Evidence: when and by whom the outcome was recorded and its evidence references (from the audit record; "Unavailable" when it cannot be read); delivery facts from the delivery read: "Downloads sent in full: none", "Document emails accepted: none". Effect: "This corrects the recorded outcome from Issued to Refused. Related applications that depend on this outcome are evaluated again: one that is not filed can end as 'Dependency failed', and then this outcome can no longer be corrected here. Result files and their eligibility do not change." and the travel-agent line that Q-02 decides (meanwhile the truthful "TravelMudra sends the travel agent no notice of this correction."). Hard stop: "After the travel agent received the result (a download sent in full or an accepted document email), the outcome is corrected through an owned incident, not here." Fields: "Evidence reference" (required, the reference that shows the correct outcome), "Reason" (required, at least 10 characters); hidden `kind=outcome`, `outcome=refused`, `_rev.application`. Button "Correct the outcome to Refused". | L | PL SA-04 (Exceptional correction), §7; BS B19, B33; `admin.ts:51-70`; Q-02, Q-03 |
| WP11-A37 | SuperAdmin; test | SA-09o in each state (first match) | (1) Application closed. (2) Outcome none, `external_outcome_unresolved` (R after V11-6), `prepared_and_handed_over`, `withdrawn`, `dependency_failed` or `cancelled`. (3) A download sent in full or an accepted document email (fixture). (4) The delivery read unavailable. (5) A dependent ended `dependency_failed` (not on the read; fixture). | (1) "This application is closed. Its outcome stays as recorded; an owned incident is the remedy." No form. (2) "Only an issued or refused outcome can be corrected here. Recorded outcome: [label]." No form (live on R). (3) CMP-10 "Correcting the outcome is unavailable: the travel agent already received the result. Owner: [assigned operator or SuperAdmin], through an incident." No form. (4) Delivery facts "Unavailable"; the form shows with "The delivery facts cannot be read now. TravelMudra checks them when you send." (H-03 pattern: a guard fact, not the decision's evidence). (5) The form shows; Core refuses (`outcome_correction_not_allowed`) and the re-rendered page names the reason (a listed discrepancy, H-02). | L ((2)) + T | `admin.ts:52-60`; WP-10 H-02, H-03 |
| WP11-A38 | SuperAdmin (SA1); harness | SA-09o of C | Send with no reference and a short reason. Harness: the same outcome (`refused` after the correction) with a fresh revision; an evidence item that is only an attestation; a send as an operator. | C1: "Evidence reference: enter the reference that shows the correct outcome." and "Reason: write at least 10 characters."; values kept. Harness: "The outcome is already Refused. Nothing changed." (`correction_no_change`); "The correction needs an external reference or a document; a statement alone is not enough." (`business_evidence_required`); the operator: not found. Nothing is recorded (outcome unchanged; audit facts delta 0). | L | §0.5; `admin.ts:50-54` |
| WP11-A39 | SuperAdmin (SA1) | SA-09o receipt (§3 V11-C2) | Record the correction. | C3 "Request recorded" (neutral: the result carries the application only). Current: outcome "Refused"; "Related applications are evaluated again by Core" only as a fixed statement of the rule, never as a claim about a dependent. No accepted time. Polite announcement. | L | CMP-08; WP-06 D-02 |
| WP11-A40 | SuperAdmin; operator; TA | SA-04, OP-02, OP-05 and TA-07 of C after the correction (§3 V11-C3) | Read. | Every page shows the current outcome "Refused". SA-04 history keeps "Outcome recorded: Issued" and adds "Outcome corrected: Issued → Refused" with the reference, the SuperAdmin and the time. No page shows both outcomes as current. | L | BS B19 ("No latest-write-wins"), B33 |
| WP11-A41 | SuperAdmins (SA1, SA2); harness | SA-09o, the Nth time and the race | SA2 opens SA-09o of C before SA1's correction and sends after it. Replay terms 1 to 5 on SA1's correction; term 3: Back after the receipt. | SA2: C5 with the current outcome "Refused"; SA2's reference and reason kept as unsent values; nothing recorded. (1) The original receipt; one correction fact. (2) Refused as a used form. (3) Back reloads SA-09o with "Recorded outcome: Refused. Correction: Issued", empty reference and reason fields and no preselected value: Back sends nothing, and a new correction needs new evidence and a new reason. (4) Recorded once. (5) C4. Business duplicate (harness, new key, `refused`, fresh revision): `correction_no_change`. Raw stale envelope: `stale_revision`. | L+T | PL §7 K-STD; BS B35 |
| WP11-A42 | Test | Dependents of a corrected outcome | Fixture: T depends on E (`needs_tourist_evisa`, required `issued`), T confirmed unfiled; a second dependent T2 with an authorized submission. Correct E from Issued to Refused. Then try to correct E back to Issued. | T ends "Dependency failed"; T2 keeps its filing protection and its owner gets a follow-up (Core's rule); the reverse correction is refused (`outcome_correction_not_allowed`) and SA-09o names the reason. SA-09o shows the dependency effect sentence of A36 before the send. | T | UX §3.2 (Dependency); `admin.ts:57-60, 69`; `writers.ts` (`evaluateDependents`); Q-03 |
| WP11-A43 | TA (Y); test | TA-07, TA-10 and TA-07x of C after the correction | Read. | TA-07 shows "Refused". The notice and the history line follow Q-02: until it is decided, the history keeps "Outcome recorded: Issued" and shows no correction line, and no notice is posted; the item is recorded "Unmet: waits for Q-02", not as a failure. The page invents no line. | L | BS B21, B33; `case-projectors.ts` (no line for `core.outcome_corrected`); Q-02 |
| WP11-A44 | Test | The SA-09o handler | Send an `outcome` of 41 characters, a reference of 121 characters, a reason of 1001 characters. | Every field reaches Core whole or is refused at its field with the value kept: no `.slice` (today `outcome.slice(0, 40)`). BFF test with a scripted Core. | T | LD-17; `admin.ts:611-613` |

### 2.5 SA-09e Correct details from evidence (`core.correct_from_evidence`, kind `fields`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A45 | SuperAdmin (SA1) | SA-09e of F (§3 V11-F1) | Open from SA-04. Read the page. | `h1` "Correct details from evidence: [applicant]". "Change only what is wrong." Fields with the current values: surname, given names, date of birth, passport number, issuing country, nationality; country of residence; each declared form field of the governing declaration with its options (for "SYN Tourist e-visa": travel purpose, "Tourism"). "Identity evidence": a fieldset with one checkbox per identity document of this application ("Passport of this application"), all unchecked. "Evidence reference" (optional when a document is chosen; required otherwise) and "Reason" (required, at least 10 characters). Hint: "A changed identity detail needs a chosen document of this application that shows the new value and two unchanged details." Hidden `kind=fields`, `_rev.application`. Button "Correct the details". | L | UX §2.3 (SuperAdmin: evidence-based exceptional correction); PL SA-04, §7; `admin.ts:72-89`; `corrections.ts` (same-person rule) |
| WP11-A46 | SuperAdmin; test | SA-09e effect by stage (computed from the read facts; Core decides) | Open the page in each state: open; an act authorized or uncertain (R, §3 V11-3); reconciliation exhausted (R, V11-7); filed (C, V11-C2); packet released; closed; an active mark (fixture). | Open: "Your change applies now." With an assigned operator also: "The assigned operator is told, and a recorded readiness must be confirmed again." Possibly filed: a warning above the form: "A filing may have happened. Your correction is recorded and held, not applied, until the filing is reconciled. The details shown do not change." The form shows. Exhausted: "Corrections are not possible: TravelMudra could not confirm whether the application was filed, and its facts stay as if filed." No form (G-02 class). Filed, released or closed: "Corrections are not possible: the application was filed, its packet was released, or it is closed. A correction after filing is an owned incident. Owner: the assigned operator or a SuperAdmin." No form. Active mark: "Corrections are unavailable while the application is held after a restore. Owner: SuperAdmin, who resolves the mark with evidence." with the route to SA-09m. No form. | L (R, C) + T | `controls.ts:118, 348-353, 477-478`; `store.ts` (`changeStageOf`); WP-09 G-02; UX §3.2 |
| WP11-A47 | SuperAdmin (SA1) | SA-09e review (§3 V11-F1) | Change the given names. Read the review before the button. | The visible review lists each changed field as "Given names: FARA → FARAH" and the chosen evidence; unchanged fields are not listed. It states the effect of the current stage (A46). | L | UX §7.4 (Review and confirm); PL SA-04 ("Correction with before/after") |
| WP11-A48 | SuperAdmin (SA1); TA (Y) | SA-09e of F, then TA-09 and TA-07 of F (§3 V11-F1) | Send the changed given names with no document chosen and no reference. Then choose the passport, add `SYN-V11-[stamp]-F-1` and a reason, and send. | First send: C2 "The chosen documents do not show that this is the same person. Choose the document of this application that shows the new details." (`identity_same_person_evidence_insufficient`); the typed values stay; the evidence checkboxes show what was posted (none) (G-07); nothing recorded (snapshot version delta 0). Second send: C3 "Request recorded" (neutral); recorded: "Correction [reference]: applied"; Current: given names "FARAH". TA-09 and TA-07 of F show "FARAH" and Core's evidence result for the passport (no identity conflict). | L | §0.5; WP-09 G-07; `corrections.ts:63-100` |
| WP11-A49 | SuperAdmin (SA1); test | SA-09e of R and C on GET (§3 V11-3, V11-7, V11-C2); saved envelopes in a test | Open each page. Test: send a saved envelope with a current revision to R after the decision and to C after its filing. | R before the decision: the held warning and the form (A46). R after the decision: the exhausted statement and no form. C: the historical statement and no form. Test: Core refuses `filing_possibly_occurred` (R) and `correction_historical_after_filing` (C); nothing recorded. | L (GET) + T | WP-09 G-05; `controls.ts:348-353` |
| WP11-A50 | Test | A held SuperAdmin correction (fixture: an act `filing_unknown`) | Send a correction. Then (a) record the act as filed; (b) instead record it as not filed. Read SA-04, SA-09e, OP-02 and SA-01 after each. | The receipt: "Request recorded"; recorded (from the summary): "Correction [reference]: held until the filing is reconciled. The details shown are unchanged."; Current: the unchanged details. (a) Core supersedes the held correction and opens a post-filing correction incident (WP-14 owns the incident pages); SA-04 shows the incident. (b) Core releases it for SuperAdmin re-application and its pending answer becomes "SuperAdmin: apply the held correction". The pages show that pending answer in words; the display of held and released corrections and the re-application route follow Q-01; until Q-01 is decided the item is recorded "Unmet: waits for Q-01" (no staff read lists held corrections; the staff surface does not allow `core.apply_held_correction`). | T | UX §3.2 ("Keep proposed corrections separate"); BS B23; `corrections.ts:120-150`; `writers.ts:285-293, 308-330`; `derived.ts:316-323`; Q-01 |
| WP11-A51 | SuperAdmin; harness; test | SA-09e refusals | Harness or test: residence "GBR" (`population_out_of_scope`); all values unchanged (`correction_no_change`); an applicant-key change into an occupied scope (`duplicate_open_scope`); into the scope of an exhausted application (`reconciliation_exhausted_no_refiling`); a stale revision; a field key outside the declaration (harness); five identity documents chosen. | Each refusal in words on the re-rendered SA-09e, with the typed values and the posted evidence ticks kept: "This applicant is outside the population the service accepts." / "Nothing changed. The saved details are shown." / "Another open application already has this applicant for this service in this group." / "An earlier application for this applicant could not be confirmed as filed or not filed; this change is not possible." / C5 with the changed details / the undeclared key is never offered by the page; Core's answer re-rendered for the harness send / "Choose at most 4 documents." at the field. Nothing is recorded (snapshot version and correction count delta 0). | L (no change, stale) + T | §0.5; WP-06 D-09; `corrections.ts:123-127`; `writers.ts:69-96` |
| WP11-A52 | Test | An applied correction on an assigned application with recorded readiness | Send the correction. Read OP-10 of the operator, OP-02 and OP-01. | The operator receives one notice "A SuperAdmin corrected this application's details" (`superadmin_correction`); OP-02 readiness reads "Out of date" (Core's basis moved), with the earlier judgement's recorder shown separately; any authorization or packet release waits for renewed readiness (Core's controls). A held correction posts the same notice and changes no detail. | T | BS B19 ("Assigned unfiled correction pauses filing/packet release until … renewed readiness"); `admin.ts:83-88` |
| WP11-A53 | SuperAdmin (SA1); harness | SA-09e, the Nth time (§3 V11-F1) | Replay terms 1 to 5 on the accepted correction of F. Term 3: Back after the receipt. Business duplicate: a new key with the same values from the reloaded page. | (1) The original receipt and one correction: the identity input maps from the posted values (WP-03 C-04), so the replay is the same content, never a conflict. (2) Refused as a used form; values kept. (3) Back reloads SA-09e with the current values ("FARAH") and unchecked evidence. (4) Recorded once. (5) C4. Business duplicate: "Nothing changed. The saved details are shown." (`correction_no_change`); nothing recorded. No semantic duplicate guard is claimed beyond Core's no-change rule (G-03). | L+T | WP-03 C-04; WP-09 Q-W09-04, G-03; PL §7 K-STD |
| WP11-A54 | Test | The SA-09e handler | Send a surname of 101 characters, a passport number of 31, five ticked documents, 101 form fields, a residence of 4 characters; and unchanged identity values beside one changed value. | Every field and every tick reaches Core whole, or is refused at its field with the values and ticks kept: no `.slice(0, max)`, no `.slice(0, 4)` (LD-17). The handler maps the identity input from the posted values, with no read at POST time; unchanged values are no change in Core. Declared form fields are sent (today `fields: {}`). BFF test with a scripted Core. | T | LD-17; `case.ts:409-420` (`identityChangesOf`); `admin.ts:615-621` |

### 2.6 SA-09m Resolve a protection mark (`core.resolve_protection_mark`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A55 | Test (gallery state for review) | SA-04 of a marked application; SA-09m | Render SA-04 with an active mark. Follow the link. | SA-04 shows first: "Held after a restore. A post-restore protection mark holds this application until a SuperAdmin resolves it with evidence." with the link "Review and resolve the mark" → `…/decide/protection_mark/[mark]`. Core's pending answer reads "TravelMudra administration: resolve the hold after a restore", never "Resolve the incident" (F-13 class). | T | `case.ts:236-249`; `derived.ts:292`; WP-07 F-13 |
| WP11-A56 | Test | SA-09m Scope and Evidence | Render with the mark's facts readable and with that read unavailable. | `h1` "Resolve the protection mark: [applicant]". Scope: "Protection mark [reference] · Restore [reference] · Recorded [time] IST". Evidence: "During the interval the restore lost, this application may have been filed: Yes / No; may have been paid: Yes / No; may have been released: Yes / No." from the mark's recorded facts (Q-04: `views.audit_subject` of the mark, or a Core read); the acts, the packet state and the payment status now. When the mark's facts cannot be read: CMP-10 "The review is incomplete: the facts of the mark cannot be read now. Try again later. Owner: TravelMudra." and no form (F-04 class). | T | UX §6.3 (Recovery boundary); BS B40; `facade.ts:181-194`; Q-04 |
| WP11-A57 | Test | SA-09m Effect, Hard stops, fields | Render. | Effect: "After you resolve it, the hold after the restore ends for this application. The assigned operator's actions and file releases are checked by their usual controls again." "Resolving records no filing, payment or release, and restores no fact the restore lost." With "may have been filed: Yes": the sentence Q-05 decides (meanwhile: "A filing may have happened during the lost interval and is not in the record. Resolve only with evidence of what happened."). Hard stop: "No page restores data or reopens the system." Fields: "Evidence reference" (required) and "Reason" (required, at least 10 characters); hidden `applicationId`. Button "Resolve the protection mark". | T | UX §6.3; BS B23, B40; Q-05 |
| WP11-A58 | Test | SA-09m states | (1) The mark was resolved before. (2) The mark id belongs to another application. (3) A second active mark exists. (4) The application is closed. | (1) and (2): "No active protection mark with this reference holds this application." with links to SA-04 and to the mark's audit record; no form; no fact of another application. (3) After one mark is resolved, SA-04 shows the next active mark. (4) The form shows (Core has no lifecycle check). | T | `admin.ts:153-160`; `store.ts:505-509` |
| WP11-A59 | Test | SA-09m send | (1) No reference; a short reason. (2) Accepted. (3) A second SuperAdmin sends after (2) from an older page. (4) Harness as an operator. | (1) C1 with values kept; nothing recorded. (2) C3 "Protection mark resolved" (named: only this command returns `markId` on the staff surface); recorded: mark [reference]; Current: "No active protection mark" (or the next one), Core's pending answer. (3) "This mark is no longer active: it was resolved since you opened the page." (`stale_revision`); nothing recorded. (4) Not found. | T | §0.5; CMP-08; WP-06 D-02 |
| WP11-A60 | Test | After the resolution | Read SA-04, OP-02, OP-04a, SA-04d of the application. | The hold banner is gone; Core's controls no longer report `protection_mark_active`; a file release is no longer refused for the mark; no act, payment or release fact was created or changed by the resolution. Q-05's decision on a possibly filed mark is recorded; until then this item is recorded "Partly met: waits for Q-05" for the possibly-filed case. | T | `controls.ts:299`; `release.ts:202`; Q-05 |
| WP11-A61 | Test | SA-09m, the Nth time | Replay terms 1 to 5. Term 3: Back. Business duplicate: a new key from the reloaded page. | (1) The original receipt. (2) Refused as a used form. (3) Back reloads SA-09m with A58 (1) and no form. (4) Recorded once. (5) C4. Business duplicate: `stale_revision` (the mark is not active); nothing recorded. The command carries no revision, so its stale case is this business check. | T | PL §7 K-STD; BS B35 |
| WP11-A62 | Test | Operator and travel-agent pages while a mark is active | Render OP-02, OP-01, TA-07 and the TA download. | OP-02 action panel: "Held after a restore: a SuperAdmin resolves the hold. Your actions wait until then." (per reason and next action); OP-01 places it by Core's owner (SuperAdmin); TA-07: "TravelMudra is checking this application after a system restore. Files are not released meanwhile." (draft); a download is refused with that reason. No "Resolve the incident" text. | T | WP-07 F-13; `shared/delivery/pages.ts:97`; `derived.ts:292` |
| WP11-A63 | Test | The SA-09m handler | Send an `applicationId` of 41 characters, a reference of 121 characters and a reason of 1001 characters. | Every field reaches Core whole or is refused at its field with the value kept: no `.slice` (today `applicationId.slice(0, 40)`). | T | LD-17; `admin.ts:628-630` |
| WP11-A64 | — | `lane-ui` | Check SA-01 group 15 and the monitors. | No protection mark exists on `lane-ui` without a restore. A55 to A63 run as tests and gallery states; the run record says "Not run on lane-ui: no protection mark without a restore (BS B40; data hygiene)". No step runs a restore. | L | BS B40; §0.2 "Data hygiene"; Q-11 |

### 2.7 Command results, access and shell on WP-11 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A65 | SuperAdmin | Every WP-11 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item "Applications & groups" (SA-04, SA-04l, SA-04d, SA-09 kinds) or "Home" (SA-01); breadcrumb "Applications › [applicant] › [decision]"; one `h1`; the freshness line of §0.2. | L | PL §2.1, §2.2; WP01-A07 |
| WP11-A66 | SuperAdmin; harness | Every accepted WP-11 command; edited receipt addresses | Read each receipt. Open edited addresses: the SA-09u done code with the key of an outcome correction; the SA-09e done code with the key of an operator's assistance entry; the SA-09m done code with a decision key; the key of another application's operation. | Naming rules (D-02): unresolved decision `{applicationId}` → "Request recorded"; outcome correction `{applicationId}` → "Request recorded"; field correction `{applicationId, correctionId, stage}` (the same shape as `core.record_assistance_entry`) → "Request recorded" with the recorded line from `stage`; mark `{applicationId, markId}` → "Protection mark resolved". Receipt facts never come from the done code alone. An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; W1 A-04; WP-09 G-01; P-10 b |
| WP11-A67 | SuperAdmin; test | Receipt addresses of §3 V11-6, V11-C2 and V11-F1 opened again after later steps (V11-12) | Open each address again. | Each receipt keeps what was recorded and shows current facts labelled "Current" (after V11-11: "Current: a follow-up of a later official fact is open"). No receipt tells anyone to act from an older state: no "record an attempt", "correct the outcome" or "apply the correction" once Core's facts no longer offer it. | L+T | `WP-07.md` F-01; WP-09 G-10 |
| WP11-A68 | SuperAdmin | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no record: "Nothing is recorded for request [reference] so far"; the refusal and any stale comparison show only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08; WP06-A104 |
| WP11-A69 | Harness | Each command of §1.2 | (1) Identical replay. (2) Same key, changed content. (3) Business duplicate: new key, current page's facts. (4) Raw stale envelope: new key, older revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page. | (1) The original result; no second decision, notice, correction or resolution. (2) `conflict_operation_key`; nothing recorded. (3) Unresolved: `outcome_already_recorded`; outcome: `correction_no_change`; fields: `correction_no_change`; mark: `stale_revision`. (4) Unresolved, outcome and fields: `stale_revision` with CMP-14; mark: no revision, so the business check decides. (5a) The refused key has no record, so Core evaluates the envelope again against its own revision: an unresolved envelope refused for a missing attempt (V11-2) and resent after V11-5 is refused `stale_revision` only if the revision moved (the reassignment of V11-4 moved it), else accepted; a field envelope refused for missing evidence is decided again by Core. (5b) The form of a freshly loaded page carries the current revision and is accepted once. A duplicate test uses (3), never (4) or (5a). | T | WP-06 D-12; WP-10 H-07; PL §7 K-STD; BS B35 |
| WP11-A70 | SuperAdmin; operator; TA | Every refusal reachable on `lane-ui` in §2.1 to §2.6 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP11-A71 | — | Text map of every reason code the WP-11 pages can show | Check the map against Core's vocabulary (unit test). | Each code has text in the role's words: `outcome_already_recorded`, `act_state_transition_invalid`, `reconciliation_attempt_missing`, `not_active_staff`, `outcome_correction_not_allowed`, `correction_no_change`, `business_evidence_required`, `protection_mark_active`, `application_not_open`, `correction_historical_after_filing`, `filing_possibly_occurred`, `identity_same_person_evidence_insufficient`, `population_out_of_scope`, `duplicate_open_scope`, `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required`, `held_correction_pending`, `held_correction_released`, `act_already_open`, `completion_check_trigger_unselected`, `stale_revision`, `conflict_operation_key`. The pending reasons `filing_possibly_occurred`, `protection_mark_active`, `held_correction_released` and `completion_check_trigger_unselected` read per (reason, next action) (F-13 class). `access_denied` renders SH-02 or the uniform not-found page, never a text. | T | CR-01; SC §3.4 (UAT-13); `src/apps/shared/core/shared.ts` |
| WP11-A72 | SuperAdmin | SA-09u, SA-09o, SA-09e, SA-09m, SA-04 (HTTP tests) | (1) Let `ops.case_work` fail for availability on SA-09u. (2) Let the mark facts read fail on SA-09m. (3) Let `dlv.delivery_page` fail on SA-09o. (4) Let `views.audit_subject` fail on SA-04 history. (5) Separately: revoke access, end the session, close the installation or start a support view between the page's first read and an optional read. | (1) and (2): the incomplete-review notice and no form (F-04 class). (3): "Unavailable" for the delivery facts; the form shows; Core decides (H-03). (4): "Unavailable" for the history only. (5): the page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. No page code catches every error around a read. | T | LD-14; `WP-07.md` F-04; `WP-10.md` H-03, H-05 |
| WP11-A73 | TA; operator; SuperAdmin | Every WP-11 page and the TA and operator pages of R, C and F | Look for controls of the other roles. | TA pages: no correction, decision or mark control. Operator pages: no unresolved-outcome decision, outcome correction, SuperAdmin field correction or mark resolution control (an operator's own assistance entry stays WP-09's). SuperAdmin pages: A10. | L | BS B18; UX §2.3; PL §11.1 |
| WP11-A74 | SuperAdmin; operator; TA | Every WP-11 page and the amended texts | Read all visible text. | No forbidden label of §11.1 ("Override", "Admin override", "Force complete", "Reopen system", "Approved" or "Done" as an overall status, "Ready" as a universal state). The words of §0.2 for unknown execution, corrections and marks. No "Owner not yet decided" or "not decided" for the completion boundary (LD-04). "Completed" only for a Core completion. Times carry IST; counts name their unit; synthetic data carries the synthetic label. No page states a configuration number that it does not read (row limits, retry counts). | L | PL §11.1, §11.2; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; WP-08 E-12 |
| WP11-A75 | Operator (OP3); SuperAdmin in a support view (test) | OP-02 and OP-04b of R with the group read grant; SA pages in a support view | Read the pages. Harness: post an attempt as OP3. Test: in a support view, open the SA-09 kinds and post each command. | Read grant: the frame and facts, the banner "Read-only access: [purpose], until [date time] IST", "Only the assigned operator takes this step. You can read this application." and no form; the post refused as not found. Support view: no decision form renders; each post is refused with the support-view refusal; nothing is recorded. | L (grant) + T | UX §2.3; BS B10; PL SH-R09, SH-R10 |
| WP11-A76 | SuperAdmin | SA-09u, SA-09o, SA-09e, SA-09m | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No reason, evidence reference, identity value, chosen document or future owner is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12; UX §3.3 |
| WP11-A77 | — | The decision kinds and the former host (host-page test, `test/unit/web/superadmin-decision-host-pages.test.ts` or the design's name) | Run the test. On `lane-ui` open SA-04 of R, C and F. Run the route test. | `/admin/applications/:id/unresolved-completion` appears as a form action only on SA-09u; `…/correct-from-evidence` only on SA-09o (`kind=outcome`) and SA-09e (`kind=fields`); `/admin/protection-marks/:markId/resolve` only on SA-09m. The old SuperAdmin case page (now SA-04) holds none of them and links instead. The WP-17 carried forms keep their markup, fields, action and success redirect. Four new GET routes are in the inventory (or the design's registry entries of WP-06's `…/decide/:kind` routes); every rendered form action is a registered route. | L+T | CC-04, CC-12; LD-02; LD-07; WP-06 design §2.7.5; WP06-A110 |
| WP11-A78 | `syn-ta-2`; operators; SuperAdmin | SA pages as an operator; TA pages of R as `syn-ta-2`; foreign ids | Open SA-09u of R as OP2; SA-04 as OP1; TA-07 of R as `syn-ta-2`; SA-09m with a mark id of another application; SA-09u with an application id of another travel agent's case (as SuperAdmin it exists: the page reads it). | Operators: the uniform not-found page or SH-02 (as WP-01 decides by surface), never a fact of R. `syn-ta-2`: the uniform not-found page. The foreign mark: A58 (2). No fact of R, C or F shows to a reader without access. | L | BS B10; UX §2.3 |

### 2.8 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP11-A79 | Keyboard-only SuperAdmin | §3 steps V11-6, V11-C2, V11-F1 at 1440 px; V11-6 at 390 px; SA-04l filter | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: the future owner choice, the reason, the outcome correction, the identity fields and the evidence checkboxes, the filter. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP11-A80 | Keyboard-only user | Every WP-11 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP11-A81 | Phone user | SA-09u, SA-09o, SA-09e, SA-04 and SA-04l | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The attempts table, the history and the list scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. On the decision pages scope, evidence and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3; PL SA-09 (Mobile) |
| WP11-A82 | Any | Every WP-11 form | Inspect each input. | Each input has a visible label; the future owner choice and the identity evidence sit in fieldsets with legends and none is preselected; required fields say that they are required; optional fields say "optional". | L | AC-05, AC-15 |
| WP11-A83 | Any | Act states, the unresolved outcome, the hold banner, correction stages | View in greyscale. | Each state has text. No state is shown by colour alone. | L | AC-06 |
| WP11-A84 | Any | Every WP-11 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay; the chosen owner stays chosen; the evidence ticks show what was posted (G-07). | L | AC-08; CMP-07; WP-09 G-07 |
| WP11-A85 | Screen-reader user | Receipts; the hold banner; the possibly-filed warning; the blockers of A15, A37, A46 | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. Banners, warnings and blockers are read before the form they concern. | L | AC-09, AC-16 |
| WP11-A86 | Screen-reader user | Each unavailable decision (A15 (1), (4); A37 (2); A46 exhausted and historical) | Focus the entry on SA-04 or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); an unavailable entry link or button has `aria-disabled="true"` and its reason; a role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP11-A87 | Phone user | Every WP-11 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Record the unresolved outcome", "Correct the outcome to [label]", "Correct the details", "Resolve the protection mark") are at least 44 × 44 CSS px. Radio and checkbox labels are part of their targets. | L+T | AC-10 |
| WP11-A88 | — | Every WP-11 page | Measure contrast of text, focus, state text and banners. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP11-A89 | Any | Long names and texts; reduced motion | Use a 60-character surname and given names, references of Core's maximum length, a 1000-character reason and a long operator name. Turn on "reduce motion". | Names, references and reasons wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP11-A90 | SuperAdmin and operator (observation) | SA-04 of R after the decision; OP-02 of R | Ask the SuperAdmin "Was R filed?", "Is R completed?", "Can R be filed again?"; ask the operator "What do you do if the authority sends a result for R?". | The run record reports the answers and the sample size; an answer "not filed", "completed" or "yes, refile", or no answer to the last question, is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.9 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-11 uses synthetic data only. Rows marked "gallery" run on the design gallery state because no
protection mark exists on `lane-ui` (A64). The amended texts on TA-07, OP-02 and TA-07x are covered by the axe rows of
their own packages; the V11 run records their counts as an observation, except A111 to A113.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP11-A91 | SuperAdmin | SA-01 with groups 12 and 15 (after V11-1) | L | UX §7.5; AC-01 to AC-28 |
| WP11-A92 | SuperAdmin | SA-04l with "Filing uncertain", R listed (A03) | L | same |
| WP11-A93 | SuperAdmin | SA-04 of R while uncertain: banner, acts, attempts, Decisions (A05, A06) | L | same |
| WP11-A94 | SuperAdmin | SA-04 of R after the decision and the later fact (A08) | L | same |
| WP11-A95 | SuperAdmin | SA-04d of C with the retrieval form (A09; if WP-11 rebuilds it) | L | same |
| WP11-A96 | SuperAdmin | SA-09u of R with no attempt: the blocker, no form (A15 (4)) | L | same |
| WP11-A97 | SuperAdmin | SA-09u of R allowed: the full review (A11 to A14) | L | same |
| WP11-A98 | SuperAdmin | SA-09u with the error summary (A17) | L | same |
| WP11-A99 | SuperAdmin | SA-09u with the receipt (A19) | L | same |
| WP11-A100 | SuperAdmin | SA-09u after the decision: "An outcome is recorded", no form (A15 (1)) | L | same |
| WP11-A101 | SuperAdmin | SA-09o of C allowed (A36) | L | same |
| WP11-A102 | SuperAdmin | SA-09o with the error summary (A38) | L | same |
| WP11-A103 | SuperAdmin | SA-09o with the receipt (A39) | L | same |
| WP11-A104 | SuperAdmin | SA-09e of R while uncertain: the held warning and the form (A46) | L | same |
| WP11-A105 | SuperAdmin | SA-09e of R after the decision: the exhausted statement, no form (A49) | L | same |
| WP11-A106 | SuperAdmin | SA-09e of C: the historical statement, no form (A49) | L | same |
| WP11-A107 | SuperAdmin | SA-09e of F with the error summary (A48) | L | same |
| WP11-A108 | SuperAdmin | SA-09e of F with the receipt (A48) | L | same |
| WP11-A109 | SuperAdmin | SA-09m allowed (A56, A57) | L (gallery) | same |
| WP11-A110 | SuperAdmin | SA-09m with the receipt (A59) | L (gallery) | same |
| WP11-A111 | Operator | OP-04b of R: the amended exhausted banner, no form (A27) | L | same |
| WP11-A112 | TA | TA-07 of R with the unresolved outcome (A31) | L | same |
| WP11-A113 | TA | TA-09 after the intake of R's applicant (A33) | L | same |
| WP11-A114 | SuperAdmin | Operation status page of a WP-11 command, accepted and "Nothing is recorded" (A68) | L | same |

## 3. Proof scenario V11 (to its boundary)

V11 (UX §12): "Current-authorized user can record/reconcile an already attempted act after assignment/rule changes
without being offered unauthorized new filing; actual historical evidence remains intact." Authority B19, B23, B33,
B34, B35. Also UX §3.2 "Unknown external execution" and UI-PLAN §4.2 (Unknown external execution).

One ordered recipe (§0.4) serves the proof. "Setup" steps use pages of earlier packages; they are not the subject
under test. "Observe" steps check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 =
`operator-1`, OP2 = `operator-2`, OP3 = `operator-3`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01 and incidents; SA2: SA-01, SA-04l | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06, grant page); Y (TA-09) | Create and activate Y. Y creates the group and the drafts R, C and F (F with typed given names "FARA"). SA1 grants OP3 read access to the group. | Y active; three drafts; Y's TA-10 count read (baseline). If TA-09 does not keep "FARA", the run record says so and Part F runs as the test of A48. | — | L |
| Setup-2 | Y (TA-08); SA1 (SA-07a, SA-03a) | Y submits R and C. SA1 records "Payment received" for each and assigns both to OP1. | Two submitted, paid, assigned applications; F stays a draft. | — | L |
| Setup-3 | OP1 (OP-02, OP-04a) | Start work on R and C; confirm readiness; request authorization of the government submission of each. | Two acts "Authorized; execution not yet evidenced" (WP-07). | — | L |
| V11-1 | OP1 (OP-04b) (Setup); SA2: SA-01, SA-04l, SA-04 of R | OP1 records "Execution is uncertain" on R with "WP11 [stamp] portal session ended after submit". SA2 reads. | Observe WP07-A65. SA-01 group 12 unknown +1; SA-04l "Filing uncertain" lists R; SA-04 of R: the possibly-filed banner, the act row, the uncertain record. | A01, A03, A04, A05 | L |
| V11-2 | SA1: SA-09u of R; harness | Open SA-09u. Harness as SA1: a send with R's current revision (taken from SA-09e's form). | The blocker "needs a recorded reconciliation attempt" with owner OP1 and the route to OP-04b; no form. The harness send is refused `reconciliation_attempt_missing`; nothing recorded (act state and outcome unchanged). | A15 (4), A18 (1), A96 | L |
| V11-3 | SA1: SA-09e of R | Open. Read. Do not send. | The held warning ("Your correction is recorded and held, not applied, until the filing is reconciled") and the form. | A46, A49, A104 | L |
| V11-4 | SA1 (SA-03c) (Setup); OP1, OP2: OP-04b of R; harness | SA1 reassigns R to OP2 with "WP11 [stamp] workload". OP1 reloads OP-04b of R. OP2 opens it. Harness as OP1: a reconciliation attempt. Harness as OP2: a new authorization of the submission. | Observe WP07-A66, A70: OP1 SH-02; OP2 "Reconciliation owner: OP2 (you)", the attempt form, no authorization form. OP1's attempt refused by access; OP2's authorization refused `act_already_open`; nothing recorded. | — (observe) | L |
| V11-5 | OP2 (OP-04b) (Setup) | Record "Checked the government portal: No information" and "Contacted the authority: Inconclusive", each with a note "WP11 [stamp] …". | Observe WP07-A67: two attempts; the act stays "Execution uncertain". | — | L |
| V11-6 | SA1 and SA2: SA-09u of R; harness | Both open SA-09u. Read every section. SA1 sends with no owner and a 12-character reason; then records with future owner OP2 and "WP11 [stamp] portal and authority checks found no record either way". SA2 sends from the older page. Harness: replay of SA1's request; a new-key send with the current revision. | The review of A11 to A14 with the two attempts; C1 with values kept; then "Request recorded" with Current facts; SA2: C5, nothing recorded; the replay returns the same receipt; the new key refused `outcome_already_recorded`. SA-01: unknown −1, exhausted +1. | A11 to A14, A17, A19, A21, A23, A97 to A99 | L |
| V11-7 | SA2: SA-04, SA-09u, SA-09o, SA-09e of R | Read. | SA-04: outcome, "Reconciliation exhausted", future owner OP2, decision facts, attempts intact. SA-09u: "An outcome is recorded", no form. SA-09o: "Only an issued or refused outcome can be corrected here", no form. SA-09e: the exhausted statement, no form. | A08, A15 (1), A37 (2), A49, A94, A100, A105 | L |
| V11-8 | OP2: OP-02, OP-04b, OP-01, OP-07 of R; harness | Read. Harness as OP2: an attempt; an act evidence record; an authorization. | The amended exhausted banner; no form; Core's pending words; completion rows and the LD-04 boundary. Each harness send refused (`act_state_transition_invalid`; `outcome_already_recorded` with `reconciliation_exhausted_no_refiling`); nothing recorded. | A20, A27, A28, A30, A111 | L |
| V11-9 | Y: TA-07, TA-10, TA-07x of R | Read. | The outcome sentence; one notice (+1 from P-0) without acknowledgement; the history lines with the corrected decision text; no "not filed", "completed" or "closed". | A31, A32, A112 | L |
| V11-10 | Y: TA-09 of the group | Start an individual intake of RAVI (R's passport) for "SYN Tourist e-visa". | No new application (count delta 0); the existing application R named with a link; no way to create a second one. | A33, A113 | L |
| V11-11 | OP2: OP-05 of R (Setup); OP2: incidents; SA2: SA-04 of R | Record a later official fact "Issued" with `SYN-V11-[stamp]-R-RES` and no file. Read. | Observe WP-08: "Later official fact recorded"; the outcome stays "External outcome unresolved". A follow-up incident owned by OP2 (incidents +1 from P-0) on OP2's list and on SA-04. | A29, A35 | L |
| V11-12 | SA1: receipt address of V11-6; OP2: OP-04b of R | Open the receipt again. Compare OP-04b with V11-1 to V11-5. | The receipt keeps its recorded facts and shows "Current: a follow-up of a later official fact is open"; no instruction. Every earlier record stays with its actor and time. | A35, A67 | L |
| V11-C1 | OP1: OP-04b, OP-05 of C (Setup) | Record C's evidence "Filed" with `SYN-V11-[stamp]-C-ACT`. Record the official result "Issued" with `SYN-V11-[stamp]-C-RES` and no file. | C "Filed (evidence recorded)"; outcome "Issued"; no file, so no download. | — | L |
| V11-C2 | SA1 and SA2: SA-09e and SA-09o of C; harness | SA1 opens SA-09e (read only). SA1 and SA2 open SA-09o. SA1 sends with no reference; then records "Refused" with `SYN-V11-[stamp]-C-COR` and "WP11 [stamp] the authority's letter states a refusal". SA2 sends from the older page. Harness: replay; the same outcome with a fresh revision. SA1 presses Back. | SA-09e: the historical statement, no form. SA-09o: the review of A36; C1; then "Request recorded", Current "Refused"; SA2: C5; the replay returns the same receipt; `correction_no_change`; Back reloads with "Correction: Issued" and empty fields. Nothing extra recorded. | A36, A38, A39, A41, A49, A101 to A103, A106 | L |
| V11-C3 | SA2: SA-04 of C; OP1: OP-02 of C; Y: TA-07, TA-07x of C | Read. | "Refused" everywhere; SA-04 history before and after; TA history and notice per Q-02. | A07, A40, A43 | L |
| V11-F1 | SA1: SA-09e of F; harness; Y: TA-09, TA-07 of F | Change given names to "FARAH" and send with no document. Then choose the passport, add `SYN-V11-[stamp]-F-1` and "WP11 [stamp] the passport shows FARAH", and send. Harness: replay; a new-key send with the same values from the reloaded page. SA1 presses Back. | C2 `identity_same_person_evidence_insufficient` with values kept and no tick; then "Request recorded", recorded "applied", Current "FARAH"; the replay returns the same receipt (no conflict); the new key "Nothing changed"; Back reloads with "FARAH". Y sees "FARAH" and the passport's evidence result. | A45, A47, A48, A53, A107, A108 | L |
| V11-X1 | `syn-ta-2`; OP1, OP2, OP3; SA2 | Open TA-07 of R as `syn-ta-2`; SA pages of R as OP1 and OP2; OP pages of R as OP3; SA pages for operator controls; foreign ids. Harness: the isolation posts of §2. | Not found or SH-02; read-only for OP3; no SuperAdmin operator control; nothing recorded. | A10, A73, A75, A78 | L |
| V11-X2 | Test | A02 (mark), A06 (mark), A09 (mark), A15 to A16, A18 (2), (3), A22, A24, A25, A26, A32 (text), A33 (closed), A34, A37, A42, A44, A46 (fixtures), A49 (envelopes), A50, A51, A52, A54 to A63, A66, A67, A68, A69, A71, A72, A75 (support view), A76, A77, A87, A88. | As the items. | as listed | T |
| V11-X3 | axe | The pages in the states of A91 to A114. | No serious or critical violation at 1440 px and 390 px. | A91 to A114 | L |

Proof split: V11 passes when V11-1 to V11-12, V11-C1 to V11-C3, V11-F1, V11-X1 and V11-X3 pass on `lane-ui` at the
integrated WP-11 commit and V11-X2 passes as named tests. The rule-change half of V11 ("after … rule changes") is
proven by A25 as a test, because WP-11 MUST NOT suspend or withdraw a seeded offering on `lane-ui`. Recorded, not
failed: the display and re-application of held corrections (A50, "Unmet: waits for Q-01"); the travel agent's view of
an outcome correction (A43, "Unmet: waits for Q-02"); the possibly-filed mark case (A60, "Partly met: waits for Q-05");
the live protection mark (A64, "Not run on lane-ui"). The run record names the `lane-ui` ref, the run tag, Y's
identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V11: "Execution is uncertain" and its protected state (no repeat, no fee payment, no ordinary withdrawal) | WP-07 (WP07-A65, A66; §3 V10-5, V10-5a, V10-5d); observed in V11-1, V11-4 |
| V11: the new operator records and reconciles an act the previous operator authorized; the previous operator is refused | WP-07 (WP07-A70; §3 V10-6); observed in V11-4 |
| V11: the reconciliation attempt form, its conclusions and its replay (no stale-state guard) | WP-07 (WP07-A67, A68, A76; F-10; §3 V10-7 to V10-8a); set-up in V11-5 |
| V11: a concluded "not filed" returns through readiness before a fresh authorization | WP-07 (WP07-A69, test) |
| V11: a second submission after a known filing is a parked boundary | WP-07 (WP07-A71) |
| The later official fact form and its receipt on OP-05 | WP-08 (OP-05; design receipt `result` with `followUp`); observed in V11-11 |
| OP-07 completion rows and the completion boundary | WP-08 (E-05, E-06, E-14; LD-04); observed in V11-8 |
| The follow-up and post-filing correction incident pages (OP-08, SA-08) | WP-14 |
| A travel agent's re-application of a held correction (TA-07 pending work) | WP-17 (`core.apply_held_correction`, CC-06) |
| A SuperAdmin's or an operator's re-application of a held correction | No staff route (Q-01) |
| The operator's notice list (OP-10) | WP-15 |
| Reassignment (SA-03c) and its preview | WP-06; set-up in V11-4 |
| The SA-09 frame and registry | WP-06 (design §2.7.1, §2.7.5) |
| Restore, reopening and protection-mark creation | Engineering and Max (BS B40); no page |
| The TA-09 intake page and its matched-existing result | WP-03; observed in V11-10 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-11 page:

- A state word derived from elapsed time: "not filed", "failed", "expired", "timed out", "abandoned" or "lapsed" for an
  act that is authorized, uncertain or exhausted (UX §3.2; BS B23).
- "Completed", "Closed", "Done" or "Resolved" for the unresolved decision, or any claim that it completed the
  application (UX §2.2; BS B23, B24).
- An offer to refile, file again, retry the filing, pay the government fee again or withdraw ordinarily for an
  application whose filing may have happened (BS B23).
- A SuperAdmin control that authorizes an act, records act evidence or a reconciliation attempt, marks execution
  uncertain, confirms readiness or records an official result (BS B18, B34; UX §2.3).
- A correction applied over a possible filing, or a form for a correction that Core treats as historical or
  unresolved (BS B19, B23; WP-09 G-02).
- An identity change without a chosen document of the application that shows it (BS B19).
- A single "Override", "Admin override", "Force complete" or "Reopen system" control (PL §11.1; UX §6.3).
- A restore, reconstruction or reopen control; any text that says a protection mark restores lost facts (BS B40).
- A receipt that names a command the operation does not establish, an accepted time, or an instruction to act from an
  older state (D-02; P-02; F-01).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A truncated field or a dropped indexed row (LD-17).
- A decision form during an outage of the evidence the decision rests on (F-04 class).
- A page that blocks a command Core accepts, outside the outage rule (H-03).
- "Owner not yet decided" or "not decided" for the completion boundary (LD-04).
- A package id ("WP-11") or a writer name ("Core") in user copy (CR-05).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- Display and re-application of held and released corrections on staff pages: "Unmet: waits for Q-01".
- The travel agent's notice and history line for an outcome correction: "Unmet: waits for Q-02".
- The possibly-filed protection mark rule: "Partly met: waits for Q-05".

Deferred in WP-11 (each item says where it lands; the run record lists them as "Deferred"):

- Live protection-mark items: tests and gallery states only (A55 to A64; Q-11).
- A live held correction: no correctable field exists on a submitted "SYN Tourist e-visa" without identity evidence
  that differs from the snapshot; test only (A50).
- The exhausted-scope intake refusal after closure: test only, because completion has no product trigger (A33; Q-12).
- The rule-change case of V11: test only (A25).
- SA-04 group detail and the full audit page: as Q-06 decides.

Not in WP-11 (later or earlier packages):

- `ops.record_reconciliation_attempt`, `ops.record_act_evidence`, `core.authorize_external_act`, OP-04a and OP-04b
  forms: WP-07.
- `ops.record_official_result` and OP-05, OP-07, TA-07r, TA-10: WP-08.
- Incident pages and their commands: WP-14.
- `core.apply_held_correction` on TA-07, `core.record_operational_withdrawal`, `core.propose_price_increase`,
  `core.decide_deferral`, `core.recheck_travel_dates`: WP-17.
- Support view, read grants, OP-10 and SA-10: WP-15.

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Held and released corrections have no staff read and no staff route. `core.admin_case` returns no corrections. Core lets a SuperAdmin (and an operator, for an assistance entry) re-apply a released correction through `core.apply_held_correction`, but the staff allowlist does not include it (`allowlists.ts:43` is the edge list). Core's pending answer for a released SuperAdmin correction is "SuperAdmin / `held_correction_released` / `reapply_correction`", and pending rule 8 ranks above the act and readiness rules. | SA1 corrects a detail of an application from evidence while its filing is uncertain; the receipt says "held". No page shows it later. OP2 then records "No filing found". Core releases the correction for SuperAdmin re-application. OP-01 and SA-04 now say that a SuperAdmin must apply a held correction, and Core's stage 8 refuses a new authorization (`held_correction_released`), but no staff page lists the correction or offers the action. SA1 types the same values again through SA-09e: the authorization block clears, yet the pending answer still names the SuperAdmin until the released row is re-applied, which no page can do. Likelihood: low (a correction during an uncertain filing that ends "not filed"); harm: medium (a case with a wrong owner and a hidden proposed correction; UX §3.2 "keep proposed corrections separate" unmet). | Two parts to the orchestrator: (a) a staff route for `core.apply_held_correction` (allowlist and binding in `src/core-api`, which the lane does not own; Core already serves the command for both staff roles); (b) a read of held and released corrections (fields, kind, state, held on which act) on `core.admin_case` and `core.ops_case`. Part (b) is a new exposure, not a removed join: criterion point 2 is not demonstrated, so it needs Max's exception as P-05 and P-13 item 1 did (WP-09 G-11). Interim: the receipt states "held"; SA-04 shows Core's pending answer in words with "The held correction cannot be shown or applied on this page yet."; A50 is "Unmet". Related: WP-09 STOP-W09-03 (parked P2) asked for a corrections list; this scenario raises it to P1. |
| Q-02 | P1 | An outcome correction posts no notice and adds no TA history line (`admin.ts:61-70`; the history allowlist has no line for `core.outcome_corrected`). | OP1 records "Issued" for C by mistake. Y reads "Issued" on TA-07 and tells the traveller. SA1 corrects C to "Refused". Y receives no notice; TA-07x still says "Outcome recorded: Issued" with no later line. Y finds the change only by opening TA-07 again. Likelihood: low (a wrong outcome before the result reached the travel agent); harm: medium to high (a traveller acts on a wrong result). | A history line is a Kind 1 change in the views projector (criterion point 1 holds; point 2 is not a join removal, so it needs the exception route of P-05); a notice is a new Core behaviour, Kind 2 for Max. Route both to the orchestrator as one note. Interim: SA-09o states the truth before the send ("TravelMudra sends the travel agent no notice of this correction."); A43 is "Unmet". |
| Q-03 | P1 | An outcome correction evaluates dependents again and can end a confirmed-unfiled dependent as `dependency_failed`; then the correction cannot be reversed. SA-09o cannot list dependents: the staff read returns only the application's own upstream rows, not its dependents. | E is "Issued"; Y linked T (transit) to E; T is not filed. SA1 corrects E to "Refused" from a letter that later proves to concern another applicant. T ends "Dependency failed" at once, and E's correction can no longer be undone here. Likelihood: low; harm: high for T (an outcome that ends its processing). | Show the rule in the effect statement now (A36). Ask for a dependents summary on `core.admin_case` (count and states, no upstream facts beyond the SuperAdmin's scope): criterion point 2 is not demonstrated (no join removed), so the architect decides whether to request Max's exception; if not, the effect sentence is the accepted mitigation and A42 proves the rule. |
| Q-04 | P1 | Several decision facts are only in the audit record: the mark's flags, restore and time; the deciding SuperAdmin, reason and future owner of an unresolved decision; the before and after of corrections; who recorded an outcome and with which evidence. The notes of reconciliation attempts are on no read at all (`ops_reconciliation_attempts.note`). | SA1 opens SA-09m and sees only a mark id; SA1 cannot tell whether the lost interval may hold a filing. SA2 opens SA-04 of R after the decision and cannot see who decided or who owns a later fact. SA1 judges "reasonable reconciliation" without reading what OP2 checked. Likelihood: certain for every such decision; harm: medium (decisions without their evidence; UX §3.2 "show reconciliation evidence, owner and next step"). | Use `views.audit_subject` (SuperAdmin, authoritative fact log, served today) on SA-09m, SA-09o, SA-04 and SA-04 history; no Core change. A Kind 1 field on `core.admin_case` would remove that client-side join (criterion point 2 demonstrated; SA-09 is P0) and can follow later. The attempt notes need a read change (an `ops.case_work` field): point 2 not demonstrated; raise it with Q-01 (b) as one exception request. Meanwhile SA-09u says that the notes are not shown (A12). |
| Q-05 | P1 | Core resolves a protection mark on any one evidence reference and checks neither the mark's flags nor whether the facts lost in the interval were entered again. After resolution, stage 3 no longer blocks a new authorization. | After an interval-loss restore, R carries a mark "may have been filed: yes" because OP1 submitted R during the lost interval; the authorization record is lost. SA1 resolves the mark with a vague reference. OP1 sees R as ready, requests a new authorization and files R a second time with the authority. Likelihood: very low (an interval-loss restore and a lost filing); harm: high and irreversible (a duplicate government filing). | Record it for Max through the orchestrator as a Core behaviour note (Kind 2 if a guard is wanted, for example "a possibly-filed mark resolves only with act evidence recorded first"); the lane proposes no guard itself (G-03 class) but the rank is P1 because the harm is irreversible. The page states the effect plainly (A57) and shows the flags (Q-04). B40 makes restore decisions Max's and engineering's. |
| Q-06 | P1 | Scope of SA-04 in WP-11. Earlier packages deferred to "SA-04, WP-11": the SuperAdmin case page (WP-06, WP-07, WP-09 designs), the SuperAdmin delivery view and its single-file retrieval with purpose and reason (WP-08 design §1.5), and the "SA-04 oversight rebuild (search, full history, correction from evidence, unresolved completion)" (`WP-06-acceptance.md` §5). UI-PLAN SA-04 also has group detail. | WP-11 builds only the four SA-09 kinds. Max opens R from SA-01 and lands on the old case page in the old layout, beside new decision pages; the SuperAdmin retrieval stays on an unrebuilt view; SA-04's history is missing. Likelihood: certain if not decided; harm: medium (mixed layouts; V11's "historical evidence remains intact" not visible to the SuperAdmin). | WP-11 builds SA-04 (application detail and history), SA-04l (filters, including "Filing uncertain") and SA-04d (it owns the carried retrieval). Group detail and the full audit page stay as they are with links (P2), or move to WP-17 or WP-14. Record the split in `WP-11.md`. |
| Q-07 | P1 | WP-07 design §2.8.2 gives `reconciliation_exhausted` the banner "Reconciliation exhausted. Refiling is never implied. A SuperAdmin records the unresolved outcome (WP-11)." An act reaches that state only through the SuperAdmin's decision, which records the outcome in the same transaction. | OP2 opens R after V11-6, reads that a SuperAdmin still has to record the outcome, and asks SA1 to do it again; or OP2 waits. The text also shows a package id to users. Likelihood: certain on every exhausted case; harm: low to medium (confusion, a wasted escalation). | Amend WP-07's build as AM-W11-01 (A27 wording), the way WP-10 amended WP-07 (F-16 to F-21). WP-07 is not built yet. |
| Q-08 | P2 | The future-owner list comes from `operators` (assignable operators); Core also accepts an active, MFA-enrolled SuperAdmin. A SuperAdmin future owner gets the follow-up incident with owner kind `assigned_operator` (`writers.ts:343-347`). | SA1 wants to own R's later fact personally and cannot choose themself. Likelihood: low. | Offer operators only and list the discrepancy in the parity test (A16); a SuperAdmin list needs a read. Note the owner-kind quirk to the orchestrator (P2, parked). |
| Q-09 | P2 | SA-01 group 15 counts active marks but no list or filter shows which applications they hold (`views.admin_applications` has no mark filter). | After a restore, SA1 sees "3 applications held by a protection mark" and has to search. Likelihood: low (restores are rare). | Link group 15 to SA-04l filtered on "Waiting on a SuperAdmin", where each row names "Held after a restore" (Core's pending reason); a dedicated filter is a Kind 1 note, parked. |
| Q-10 | P2 | Only the assigned operator records a later official fact (`requireAssigned`). A future owner who is not assigned cannot record it, and the decision posts no notice to the future owner. | SA1 names OP3 as future owner; the authority writes to OP3 months later; OP3 cannot record the fact and must ask OP2. Likelihood: low. | SA-09u's hint states who records a later fact ("the assigned operator records it; the future owner owns the follow-up it opens"). Note to the orchestrator, parked. |
| Q-11 | P2 | No protection mark can exist on `lane-ui` without a restore, and a restore is outside the lane's authority (BS B40; `uat.py` has no restore drill). No test in the repository sends `core.resolve_protection_mark`. | The SA-09m page reaches Max's manual testing without a live state; a Core regression in the command goes unseen. Likelihood: certain (live); low (regression). | Tests and gallery states (A55 to A64). Propose to the orchestrator a module test for the command (Core owner) and, if Max wants a live drill, a `uat.py` restore-drill proposal (orchestrator owns `uat.py`). |
| Q-12 | P2 | `reconciliation_exhausted_no_refiling` on intake applies only after the exhausted application is closed; while it is open, intake matches it (`matched_existing`). Closure has no product trigger (LD-04), so the live proof cannot show the refusal. | — (proof coverage) | A33 asserts the live "no new application" and proves the closed case by test. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, Y's identifier and other identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V11 result (steps; where shown) | |
| Decisions in force at the run (Q-01 to Q-07) | |
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
| V11 proof (to its boundary) | | | |
