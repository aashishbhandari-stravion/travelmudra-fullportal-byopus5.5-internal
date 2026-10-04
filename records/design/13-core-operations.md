# TravelMudra Core and Operations case-work design (design record 13)

Owner: design phase, module design for Core and Operations case work. The orchestrator owns integration and decisions. Date: 2026-10-04. Status: **revision 2** (consolidated after the 2026-10-04 design review; ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`). Contract record 01 revision 2 governs; every change request of Section 8 now carries its disposition, and the review fixes are marked "rev 2" with the finding id.
Authority, in order: `internal/records/BUILD_SPEC.md` (B01–B47); architecture brief revision 2 (`design/00-architecture-brief.md`); `ENGINEERING_OVERRIDES.md`; foundation contract `design/01-foundation-contract.md` (binding). This record adds module detail. It does not change record 01. Each place where this module needs a change to record 01 is a numbered contract change request (CCR) in Section 8.

Scope: Core (B03, B11 effects, B16–B25) and Operations case work (B13, B18, B19, B21–B25, B30, B33 classification, B34 failure classification). Launch control (B07) is an Operations responsibility, but it is outside this record; this record only consumes `operations.launchDecision`.

## 0. Conventions and noted conflicts

### 0.1 Notation

| Term | Meaning |
|---|---|
| `P1`–`P5` | Standard command prefix (Section 3.0.1). Every command runs it before its specific checks. |
| `I-std` | Standard idempotency behaviour (Section 3.0.2). |
| `L` | Contract lock order (01 §4.1): `sys_installation` → `iam_accounts` (ascending id) → `cat_offerings` → `ops_offering_controls` → `core_groups` → `core_applications` (ascending id) → `pay_application_state` → `pay_ta_exposure` → other rows by primary key. |
| own / asg / rev / SA | Policy relations of 01 §5.3: owning TA, current assigned operator, incident owner or reviewer, SuperAdmin. |
| `(+)` | A column or rule that this record adds as detail to a table that 01 already names. A `(+)` addition does not contradict 01. |
| `[CCR-nn]` | The item needs the contract change request nn (Section 8). |
| Level U / I / M | Test level: unit (pure, no database); integration over a real persisted PostgreSQL 16 database (per-file template clone, 01 §10.1); multi-process (several concurrent database clients or server processes, fault points, process crash). |

### 0.2 Conflicts and gaps found (named, not silently resolved)

| ID | Where | Conflict | Treatment |
|---|---|---|---|
| K-01 | Task statement: "integration over real persisted SQLite" | EO-01, brief revision 2 and record 01 replace SQLite with PostgreSQL 16. | This record follows PostgreSQL. Level I means real persisted PostgreSQL. |
| K-02 | 01 §3.8 `ops_original_movements`: "`return` unavailable while recipient-evidence policy is PARKED" | B24 says a physical original holds completion "until operator/SuperAdmin records owner receipt"; B41 requires a test of "partial original return"; B30 parks the recipient-evidence policy. | Return mechanics are built and are available only when the governing declaration declares a recipient-evidence policy. No real declaration has one, so real routes stay unavailable. Synthetic test declarations exercise the mechanics. CCR-15, OD-C2. |
| K-03 | 01 §7.1 `dependency_failed` row: dependent "confirmed unfiled (no act ever `authorized` …)" | B23: positive non-execution evidence returns the case through current rules. An act that moved `authorized` → `not_filed_evidenced` is confirmed unfiled. | Confirmed unfiled = every government-submission and provider-handoff act is absent or `not_filed_evidenced`, and no act is open. CCR-05. |
| K-04 | 01 §2.21 task `ops.deferral_review_due` (owner operations) | Deferrals are Core rows (01 §3.5, B21). A task record step that writes Core state belongs to Core. | Rename to `core.deferral_review_due`. CCR-06. |
| K-05 | 01 §1.1 logical effect key `govfee:<application>:<government attempt no>` with `government_attempt_no` = count of evidenced submissions | A fee act authorized after the submission of the same attempt would get a different key and a second reservation. | Store `attempt_ordinal` on the authorization. CCR-03 — **resolved in contract revision 2** (01 §1.1, §7.4). |
| K-06 | 01 §2.14 launch effect row for `assign` | Reassignment is duty transfer. B07 says reconciliation, original return and incidents continue under suspension. A `hold` on reassignment would strand those duties with a suspended operator. | New controlled action `reassign`: launch stage not applied; Gate 1 applies (01 I-02). CCR-04. |
| K-07 | 01 §2.24 actor kinds; §7.11 harness commands | `engineering` actors may not write business facts, but the B46 harness writes a completion fact. | New actor kind `harness`, test and `local_test` only. CCR-07. |

No other conflict between the brief and the spec was found in this scope.

## 1. Responsibilities

### 1.1 What this module owns

| Area | Owner module | Owns (sole writer) | Rules |
|---|---|---|---|
| Groups | Core | `core_groups`: one TA, one country, travel dates on the declared `Asia/Kolkata` basis, closure | B03, B06, B25 |
| Applications | Core | `core_applications`, snapshots, governing ids, duplicate scope, later same-service attempts, editor sub-state, lifecycle, outcome, completion | B03, B16, B18, B19, B21, B24, B25 |
| Corrections | Core | `core_corrections`: all-or-nothing corrections by stage, held corrections while filing is unknown | B16, B19, B23 |
| Submission and price | Core | `core_submissions`, `core_price_records`, `core_forecasts` [CCR-01] | B17 |
| Assistance and assignment | Core | `core_assistance_requests`, `core_assignments`, duty transfer orchestration | B11, B18, B19 |
| Holds | Core | `core_holds` (problem report, formal return, flag) | B18 |
| Control acceptance | Core | `core_gate_exceptions`, the single control evaluator (01 §8) | B20, B26, B27 |
| Action authorization | Core | `core_action_authorizations` (external acts, act state), `core_packet_releases` [CCR-02] | B23, B04 |
| Dependencies, deferral, withdrawal | Core | `core_dependencies`, `core_deferrals`, `core_withdrawals` | B21, B22, B24 |
| Completion | Core | `core_completions`; completion evidence evaluation; the pending boundary of B46 | B21, B24, B46 |
| Group end | Core | `core.group_end_sweep`; declared date basis and timer | B25 |
| Operator case work | Operations | `ops_work_steps`, `ops_readiness` | B18, B19 |
| External-act evidence | Operations | `ops_act_evidence`, `ops_reconciliation_attempts` | B23 |
| Official artifacts | Operations | `ops_artifacts`, association rules, eligibility | B13 |
| Incidents | Operations | `ops_incidents` (association, disclosure, operational, custody, post-filing correction) | B13, B34 |
| Physical originals | Operations | `ops_originals`, `ops_original_parts` (+), `ops_original_links`, `ops_original_movements` | B30 |
| Failure classification | Operations | `ops_failure_classifications` (local / shared / unresolved) | B34, B36, B33 |

### 1.2 Explicit non-responsibilities

| Owner | Does | This module uses |
|---|---|---|
| Identity & Access | Accounts, roles, sessions, MFA, grants, suspension, the access policy. | `identity.getAccount`, `policy.authorize`, `policy.scope`. This module never changes an account. |
| Catalogue | Declarations, baselines, bindings, publication, impact items, transition approval. | `currentGoverning`, `getDeclaration`, `getBaseline`, `bindingStatus`, `impactFor`. Catalogue calls `core.applyBaselinePriceReduction`. |
| Operations launch control (separate record) | Launch, suspension, offering withdrawal, existing-work treatment. | `operations.launchDecision` inside the control evaluator. |
| Intake | Attempts, rows, mapping questions, intake incidents. | Intake calls `core.acceptIntakeProposals` and `core.applyIntakeCorrection` (rev 2, record 14 CCR-06). Core reads `intake.groupClosureBlockers` (rev 2, record 14 CCR-09). Bulk intake never submits, assigns or files (B14). |
| Document Processing | Versions, safety, extraction, applicant-document association, validity verdicts. | `requirementEvidence`, `evidenceFingerprint`, `extractionProposal`, `artifactExtraction`, `getVersionForRelease`, `blockVersion`, `registerVersion`, `reevaluateForApplication` (rev 2: called in every transaction that changes applicant identity fields). Documents calls `core.noteEvidenceChanged`; `operations.evaluateArtifactAssociation` runs as a Documents settled listener registered in `compose.ts` (rev 2, BND-13). |
| Payment Records | Service payment status, fees, exposure, ceilings, financial exceptions. | `servicePayment`, `reserveExposure`, `recordTmFeePaid`, `recordFeePaymentUnknown`, `recordFeeNotPaid` (rev 2), `openFinancialException`, `outstandingMoney`. This module never writes a payment status. |
| TA Delivery | Byte releases, emails, notices, packets, handovers. | `postNotice`, `deliveryEvidence`, `requestPacketBuild` and `markPacketReleased` [CCR-13]. Delivery calls `core.recordOutcomeFromEvidence` for a packet handover. |
| Derived Views | Lists, queues, progress copies, measures (B32). | This module appends the facts that measures need. Guards never read views (B35). |
| Kernel | Runner, facts, tasks, admission, clock, blobs. | All commands run through `runCommand`; all tasks through the task protocol. |

This module MUST NOT send email, start a delivery send, call a worker, or start a completion check from any product route or task (B46).

## 2. Tables owned

Every table follows 01 §3.1 conventions: id `CHECK` per prefix, `timestamptz` from the injected clock (no `DEFAULT now()`), `bigint` paise, closed-set `CHECK`s, `revision` on every mutable aggregate, foreign keys `ON DELETE RESTRICT`. Personal data lives only in snapshot `data`, hold/correction notes and fact before/after images. It never enters task payloads, operation summaries or diagnostics.

### 2.1 Core tables

#### `core_groups`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `group_id` | text | no | PK `grp_` |
| `ta_account_id` | text | no | FK `iam_accounts`; immutable |
| `country_id` | text | no | FK `cat_countries`; immutable |
| `label` | text | no | TA text, 1–120 chars |
| `travel_start_date` | date | no | local date, `Asia/Kolkata` |
| `travel_return_date` | date | no | `CHECK (travel_return_date >= travel_start_date)` |
| `date_basis` (+) | text | no | `CHECK (date_basis = 'Asia/Kolkata')`; declared basis (B25) |
| `dates_revision` (+) | bigint | no | starts 1; +1 on every travel-date edit |
| `state` | text | no | `open`, `closed` |
| `closed_kind` | text | yes | `ordinary`, `group_end`; `CHECK ((state = 'open') = (closed_kind IS NULL))` |
| `closed_at` | timestamptz | yes | |
| `closed_by` (+) | text | yes | `acc_…` or `tsk_…` |
| `created_by` (+) | text | no | FK account |
| `created_at` (+) | timestamptz | no | |
| `revision` | bigint | no | |

Guards: immutable-column trigger on `ta_account_id`, `country_id`, `date_basis`. Index `(ta_account_id)`; partial index `(travel_return_date) WHERE state = 'open'` (sweep). Drafts lock the group `FOR SHARE`; closure and date edits lock it `FOR UPDATE`.

#### `core_applications`

All columns of 01 §3.5, plus:

| Column | Type | Null | Meaning |
|---|---|---|---|
| `dates_checked_revision` (+) | bigint | no | group `dates_revision` last rechecked for this application (B06). Lower than the group value ⇒ blocker `travel_date_recheck_pending`. Set at creation to the group value. |
| `later_attempt_of` (+) | text | yes | FK `core_applications`; the closed prior application of the same scope (B03) |
| `withdrawal_id` (+) | text | yes | FK `core_withdrawals`; set with outcome `withdrawn` |

Additional checks (+): `CHECK ((outcome IS NULL) = (outcome_at IS NULL))`; `CHECK (lifecycle <> 'submitted' OR submission_id IS NOT NULL)`; `CHECK (lifecycle <> 'draft' OR submission_id IS NULL)`; `CHECK ((editor_state = 'unassigned') = (active_assignment_id IS NULL))`; `CHECK (outcome <> 'withdrawn' OR withdrawal_id IS NOT NULL)`. Guards of 01 §3.5 apply unchanged (`core_applications_open_scope_uq`, immutable columns, indexes). Add index `(group_id, offering_id, applicant_key) WHERE lifecycle IN ('completed','ended_with_group')` for the later-attempt check.

`ApplicantData` (zod, stored in `core_applicant_snapshots.data`): `identity { surname, givenNames, dateOfBirth (YYYY-MM-DD), nationality (ISO alpha-3), passportNumber, issuingCountry (alpha-3), passportType }`, `residence { declaredCountry (alpha-3) }`, `fields` (declaration-declared form fields; keys from `decl/1 documents.formFields`). Identity fields are exactly the five B19 fields plus `passportType`; `nationality`, `passportType` and `residence.declaredCountry` MAY be absent on a draft. Population scope (B02; rev 2, COV-06 / record 14 CCR-07): `create_draft` is refused with `population_out_of_scope` **only on positive out-of-scope evidence** (a present value ≠ `IND`/`ordinary`); an absent value creates the draft (B14) and blocks `submit` and every later controlled action with `population_declaration_missing` until the TA supplies it. No default value is inferred.

#### `core_applicant_snapshots`

Columns of 01 §3.5 plus `cause` (+) (`created`, `draft_edit`, `identity_correction`, `assistance_entry`, `after_return`, `submitted_unassigned`, `superadmin_evidence`, `intake`, `transition`), `correction_id` (+) (FK, nullable). Guards: `UNIQUE (application_id, version_no)`, `UNIQUE (application_id) WHERE is_current`. A new version and the old version's `is_current = false` commit together.

#### `core_submissions`

Columns of 01 §3.5 plus:

| Column | Type | Null | Meaning |
|---|---|---|---|
| `submitted_local_date` (+) | date | no | `calendar.dateOf(now)` |
| `confirmation` (+) | jsonb | no | `[{ code, state: 'present' \| 'not_required', textVersion }]` from `decl/1 authority.confirmationItems`; truthful record (B17) |
| `snapshot_id` (+) | text | no | snapshot at submission |
| `evidence_fingerprint` (+) | bytea | no | `documents.evidenceFingerprint` at submission |
| `estimate_window_start` (+) | date | no | submitted local date + baseline `processingEstimate.minDays` |
| `estimate_window_end` (+) | date | no | submitted local date + `maxDays` |
| `via` (+) | text | no | `direct`, `after_assistance` |
| `launch_decision_id` (+) | text | yes | launch record evaluated |

`confirmation_present` (01) is `true` for every row: the submit command refuses an absent required confirmation, so a row never claims a confirmation that did not happen. Absence is shown on the application page as "not given" while no submission row exists. Guard: `UNIQUE (application_id)`.

#### `core_price_records`

Columns of 01 §3.5 plus `seq_no` (+) (int, `UNIQUE (application_id, seq_no)`; 1 = quoted), `previous_price_paise` (+), `baseline_id` (+) (for `reduction_auto`), `correction_id` (+) (for `material_scope_change`), `reason` (+), `evidence` (+) jsonb, `proposed_by` (+), `decided_at` (+), `notice_id` (+).

Guards: `UNIQUE (application_id) WHERE kind = 'increase_proposed' AND state = 'open'`; (+) `UNIQUE (application_id, baseline_id) WHERE kind = 'reduction_auto'` (Nth impact-task run cannot reduce twice). The current effective price is `effective_price_paise` of the highest `seq_no` row whose state is `effective`, `accepted` or `declined`. Order uses `seq_no`, never time.

| `kind` / `state` | `effective_price_paise` |
|---|---|
| `quoted` / `effective` | quoted price |
| `reduction_auto` / `effective` | new lower price |
| `increase_proposed` / `open` | unchanged previous price (row excluded from "current") |
| `increase_proposed` / `accepted` | proposed amount |
| `increase_proposed` / `declined` | previous (communicated) price |

#### `core_forecasts` [CCR-01]

| Column | Type | Null | Meaning |
|---|---|---|---|
| `forecast_id` | text | no | PK `fcs_` |
| `application_id` | text | no | FK |
| `seq_no` | int | no | `UNIQUE (application_id, seq_no)` |
| `window_start`, `window_end` | date | no | `CHECK (window_end >= window_start)` |
| `basis_code` | text | no | `operator_judgement`, `authority_notice`, `external_delay` |
| `note` | text | yes | ≤ 500 chars |
| `recorded_by`, `recorded_at` | text, timestamptz | no | |
| `is_current` | boolean | no | `UNIQUE (application_id) WHERE is_current` |

The original estimated window in `core_submissions` never changes (B17).

#### `core_assistance_requests`

Columns of 01 plus `request_note` (+), `requested_at` (+), `decided_at` (+), `decision_reason` (+), `assignment_id` (+), `fulfilled_at` (+). Guard: `UNIQUE (application_id) WHERE state IN ('requested','approved')`. `fulfilled` is set by the formal return that ends `assistance_in_progress`.

#### `core_assignments`

Columns of 01 plus `predecessor_assignment_id` (+), `batch_operation_id` (+) (FK `sys_operations`, selection or round robin), `gate_exception_id` (+), `transferred` (+) jsonb (duty ids moved at end: holds, authorization ids, incident ids). Guard: `UNIQUE (application_id) WHERE state = 'active'`.

#### `core_gate_exceptions`

As 01 §3.5 and §8.5, unchanged.

#### `core_holds`

Columns of 01 plus `ta_account_id` (+), `response_note` (+), `responded_by` (+), `responded_at` (+) (flag only), `revision` (+). Guard: `UNIQUE (application_id, kind) WHERE state = 'open'`. Closing rules: `problem_reported` and `flagged_to_superadmin` close only by the assigned operator; `returned_to_ta` closes only by the TA (`hand_back`, `submit`) or by approved assistance (Section 3.4).

#### `core_corrections`

Columns of 01 plus:

| Column | Type | Null | Meaning |
|---|---|---|---|
| `state` (+) | text | no | `applied`, `held_filing_unknown`, `released_for_reapply`, `superseded_by_filing`, `reapplied` |
| `fields` (+) | text[] | no | changed field paths |
| `snapshot_before_id`, `snapshot_after_id` (+) | text | yes | `snapshot_after_id` NULL while held |
| `reason` (+) | text | yes | required for `superadmin_evidence` |
| `held_on_authorization_id` (+) | text | yes | open act that caused the hold |
| `incident_id` (+) | text | yes | `post_filing_correction` incident when superseded |
| `revision` (+) | bigint | no | |

A correction is all-or-nothing in one transaction with the current revision, evidence, before/after and actual actor (B16, B19).

#### `core_withdrawals`

Columns of 01 plus `requested_at` (+), `actor_role` (+), `reason` (+), `cutoff_assessment` (+) jsonb (closed codes and act states considered), `notice_id` (+). Guard: `UNIQUE (application_id) WHERE state = 'accepted'`. A `refused` row records a received request that the assessment refused (Section 3.12).

#### `core_action_authorizations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `authorization_id` | text | no | PK `aut_` |
| `application_id` | text | no | FK |
| `act_kind` | text | no | `government_submission`, `government_fee_payment`, `provider_handoff` |
| `act_state` | text | no | 01 §2.12 |
| `attempt_ordinal` (+) | int | no | [CCR-03, accepted]; 1 in this build; the logical effect key uses it (01 §1.1) |
| `carries_fee` (+, rev 2) | boolean | no | true iff `act_kind = core.feeCarryingAct(governing declaration)` (01 §7.4, MON-01) |
| `logical_effect_key` (+) | text | yes | `govfee:<app>:<attempt_ordinal>`; set iff `carries_fee` |
| `government_attempt_no` | int | no | value of the application column at authorization (informational; never part of a key) |
| `authorized_by` | text | no | operator account (actor) |
| `assignment_id` | text | no | active assignment at authorization |
| `readiness_id` | text | no | readiness judgement used |
| `readiness_basis` | text | no | `valid` or `gex_…` |
| `gate1_basis` | text | no | from the active assignment |
| `gate2_basis` | text | no | `payment_received`, `gex_…`, `not_applicable`, `same_attempt` (+) (rev 2, MON-03: only when another act of the same attempt is `authorized`, `filing_unknown`, `filed_evidenced` or `reconciliation_exhausted`, that is, a commitment may have happened; never when every earlier act is `not_filed_evidenced`) |
| `governing_declaration_id`, `governing_baseline_id`, `governing_binding_id` | text | no | snapshot |
| `snapshot_id` (+) | text | no | applicant snapshot used |
| `submission_id` (+) | text | no | TA authority/confirmation record |
| `renewed_authority_refs` (+) | jsonb | no | accepted price-increase and transition ids since submission |
| `evidence_set` (+) | jsonb | no | sorted `{requirementType, versionId}` list |
| `evidence_set_sha256` | bytea | no | Section 3.9 |
| `reservation_id` | text | yes | Payments reservation |
| `fee_amount_paise` | bigint | yes | |
| `launch_decision_id` (+) | text | yes | |
| `reconciliation_owner_id` | text | no | current assigned operator; follows reassignment |
| `future_owner_id` (+) | text | yes | set at `reconciliation_exhausted` |
| `exhausted_by`, `exhausted_reason`, `unresolved_notice_id` (+) | text | yes | B23 administrative completion record |
| `authorized_at`, `state_changed_at` | timestamptz | no | |
| `protected_from_seq` (+) | bigint | no | fact seq of `core.external_act_authorized` |
| `revision` | bigint | no | |

Guards: `UNIQUE (application_id, act_kind) WHERE act_state IN ('authorized','filing_unknown')`; act-state transitions only by conditional `UPDATE … WHERE act_state = $from`.

#### `core_packet_releases` [CCR-02]

| Column | Type | Null | Meaning |
|---|---|---|---|
| `packet_release_id` | text | no | PK `prl_` |
| `application_id` | text | no | `UNIQUE (application_id)`: one release; released facts stay historical |
| `packet_id` | text | no | FK `dlv_packets` |
| `packet_sha256` | bytea | no | |
| `assignment_id`, `readiness_id`, `readiness_basis` | text | no | as authorization |
| `governing_*`, `evidence_fingerprint` | text / bytea | no | |
| `released_by`, `released_at` | text, timestamptz | no | |

#### `core_dependencies`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `dependency_id` | text | no | PK `dep_` |
| `dependent_application_id` | text | no | FK |
| `upstream_application_id` | text | no | rev 2 (BND-05): the upstream is always an application **in the same group** (COV-08 interim, OD-R2-06); the former `upstream_kind = 'external_evidence'` is removed because it invented dependent-government-result evidence (B44, B22) |
| `relationship_code` | text | no | from the dependent's `decl/1 dependencies` |
| `required_outcome` | text | no | outcome value |
| `required_artifact_type` | text | yes | declared type |
| `conditioned_actions` (+) | text[] | no | controlled actions the relationship conditions |
| `state` | text | no | `waiting`, `met`, `unmet_missing_evidence`, `failed_incompatible`, `unlinked` (+) |
| `met_artifact_version_id` (+) | text | yes | exact verified version at `met` |
| `ta_account_id` (+) | text | no | writer enforces equality on both sides |
| `linked_by`, `linked_at` (+) | text, timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (dependent_application_id, relationship_code) WHERE state <> 'unlinked'`; `CHECK (dependent_application_id <> upstream_application_id)`; cycle check in the writer (bounded walk, depth ≤ 16).

#### `core_deferrals`

Columns of 01 plus `decided_at` (+), `decision_reason` (+), `ended_by`, `ended_at`, `end_reason` (+), `review_due_at` (+). Guard: `UNIQUE (application_id) WHERE state IN ('proposed','approved')`.

#### `core_transitions`, `core_protection_marks`

As 01 §3.5. Commands in Section 3.19.

#### `core_completions`

Columns of 01 plus `outcome` (+), `basis` (+) jsonb (evidence status per prerequisite with ids), `actor_kind` (+) (`harness`, `system_task`), `actor_ref` (+). Guard: `UNIQUE (application_id)`.

### 2.2 Operations case-work tables

| Table | PK | Columns | Guards |
|---|---|---|---|
| `ops_work_steps` | `step_id` (`wki_`) | `application_id`, `assignment_id` (+), `step_code` (declared `progressMapping` code, or reserved `_work_started`, `_packet_build_requested`), `state` (`started`, `done`, `looped`), `note` (≤ 500), `recorded_by`, `recorded_at` | `UNIQUE (assignment_id) WHERE step_code = '_work_started'` |
| `ops_readiness` | `readiness_id` | 01 columns + `note` (+), `superseded_by` (+), `withdrawn_at` (+), `revision` (+). `basis` holds ids, revisions and digests only. | `UNIQUE (application_id) WHERE state = 'current'` |
| `ops_act_evidence` | `evidence_id` (`xev_`) | `authorization_id`, `application_id` (+), `from_state` (+), `result` (`filed_evidenced`, `not_filed_evidenced`, `filing_unknown`), `evidence` jsonb, `fee_paid_paise` (+), `event_at` (+), `recorded_by`, `recorded_at` | append-only by writer |
| `ops_reconciliation_attempts` | `attempt_id` (`rca_`) | `authorization_id`, `application_id` (+), `method` (`portal_check`, `authority_contact`, `provider_contact`, `payment_statement_check`, `other`), `result` (`no_information`, `inconclusive`, `filed_found`, `not_filed_found`), `evidence` (+), `note` (+), `concluded_evidence_id` (+), `recorded_by`, `recorded_at` | append-only |
| `ops_artifacts` | `artifact_id` | `uploaded_for_application_id` (+, immutable), `application_id` (associated application; NULL until verified), `document_version_id` (+ `UNIQUE`), `artifact_type`, `source` (+) (`operator_upload`, `provider_relay`), `association_status`, `association_metadata`, `eligibility` (`eligible`, `withheld_pending_review` [CCR-12], `withheld_wrong`, `blocked`, `noncurrent`), `replaced_by`, `incident_id` (+), `recorded_by` (+), `recorded_at` (+), `revision` | `UNIQUE (application_id, artifact_type) WHERE eligibility = 'eligible'`; release reads `FOR SHARE`; block, replace and confirm `FOR UPDATE` |
| `ops_incidents` | `incident_id` | `kind`, `state`, `dedupe_key` (+ `UNIQUE`), `ta_account_id`, `group_id`, `application_id`, `document_version_id`, `artifact_id`, `country_id` (+), `owner_kind` (`assigned_operator`, `superadmin`, `reviewer`), `owner_account_id`, `reviewer_account_id` (+), `candidate_application_ids`, `affected` (+) jsonb (release ids, email send ids, recipient account ids, owning TA id), `required_evidence` (+) text[], `evidence` (+) jsonb, `notice_ids` (+) jsonb, `resolution_note` (+), `opened_by`, `opened_at`, `resolved_by`, `resolved_at`, `closed_by`, `closed_at` (+), `resolution_evidence`, `revision` [CCR-11] | resolve requires every `required_evidence` code satisfied |
| `ops_originals` | `original_id` | `group_id`, `ta_account_id`, `item_key` (+; rev 2, REC-20/SEC-09: `passport:<applicant key>` with the **plain** applicant key, a PD column of this owner table; never an HMAC or other secret-derived value, so the once-only guard survives a restore with new secrets; other items `<item type>:<TA-supplied label>`), `description` (≤ 200), `holder_kind` (`tm_office`, `tm_person`, `courier`, `authority`, `ta`, `unknown`), `holder_ref` (+), `location` (≤ 200), `uncertainty` (≤ 500; required when any part is `unknown`), `state` (derived aggregate of parts), `recorded_by` (+), `recorded_at` (+), `revision` | `UNIQUE (group_id, item_key)`: each original recorded once |
| `ops_original_parts` (+) [CCR-15] | (`original_id`, `part_no`) | `label`, `state` (`expected`, `received`, `held`, `in_transit`, `returned`, `unknown`), `holder_kind`, `holder_ref`, `location`, `revision` | item-level receipt and partial movement |
| `ops_original_links` | (`original_id`, `application_id`) | `linked_by` (+), `linked_at` (+) | writer refuses another group, a preparation-only application, and a non-physical declaration |
| `ops_original_movements` | `movement_id` | `original_id`, `kind` (`receipt`, `partial_movement`, `holder_update`, `return`), `parts` int[], `from_holder` jsonb, `to_holder` jsonb, `recipient` (+) jsonb (return only), `possession_attested` (+) boolean, `evidence`, `actor_id`, `recorded_at`, `event_at` (+) | append-only |
| `ops_failure_classifications` | `classification_id` | `subject_type` (`incident`, `task`, `intake_attempt`, `application`), `subject_id`, `scope`, `origin_component` (+), `country_id`, `evidence`, `reason` (+), `recorded_by`, `recorded_at` (+), `is_current` (+), `supersedes` (+) | `UNIQUE (subject_type, subject_id) WHERE is_current`; `CHECK (scope <> 'shared' OR origin_component IS NOT NULL)`; `CHECK (scope <> 'local' OR country_id IS NOT NULL OR subject_type = 'application')` |

### 2.3 Derived values (computed at use; never stored as authority)

#### 2.3.1 Readiness basis fingerprint

`core.readinessBasis(application)` = SHA-256 over canonical JSON of: `material_revision`, `hold_revision`, `documents.evidenceFingerprint`, governing ids, `catalogue.impactFor` state and item ids, dependency states and `met_artifact_version_id`s, group `travel_start_date`, `travel_return_date`, `dates_revision` and the application's `dates_checked_revision`, latest act state per kind, active protection mark flag (01 §7.3), plus [CCR-14]: count of `held_filing_unknown`/`released_for_reapply` corrections, open `material_scope_change` price record id, and for `preparation_only` the current built packet id and `sha256`. Derived validity follows 01 §7.3 unchanged.

#### 2.3.2 Confirmed unfiled (B22, B23) [CCR-05]

An application is confirmed unfiled when every `government_submission` and `provider_handoff` authorization is `not_filed_evidenced`, or none exists, and no authorization of any kind is `authorized`, `filing_unknown` or `reconciliation_exhausted`.

#### 2.3.3 Pending on action (B21, B22, B46)

`core.pendingOnAction` evaluates rules in order; the first match wins. It reads authoritative rows only.

| # | Condition | `ownerKind` (account) | `reasonCode` | `nextActionCode` |
|---|---|---|---|---|
| 1 | lifecycle closed | `none` | — | `none` |
| 2 | active protection mark | `superadmin` | `protection_mark_active` | `resolve_incident` |
| 3 | active assignment and operator not `active` | `superadmin` | `assigned_operator_inactive` | `assign_operator` |
| 4 | editor `returned_to_ta` | `ta` | `hold_returned_to_ta` | `correct_after_return` |
| 5 | open price increase, editor `unassigned` | `ta` | `price_decision_pending` [CCR-09] | `decide_price_increase` |
| 6 | open price increase, editor assigned | `assigned_operator` | `price_decision_awaits_return` | `return_to_ta` [CCR-17] |
| 7 | transition `awaiting_ta_authority` | as rows 5–6 | `transition_pending` | `decide_transition` [CCR-17] |
| 8 | correction `released_for_reapply` | originator role (TA if editor permits, else operator) | `held_correction_released` | `reapply_correction` [CCR-17] |
| 9 | open `flg` hold without response | `superadmin` | `hold_flagged_to_superadmin` | `respond_to_flag` |
| 10 | open `flg` hold with response, or open `prb` hold | `assigned_operator` | `hold_flagged_to_superadmin` / `hold_problem_reported` | `resolve_problem_report` |
| 11 | assistance `requested` | `superadmin` | `assistance_requested` | `decide_assistance` |
| 12 | assistance `approved`, unassigned | `superadmin` | `assistance_approved` | `assign_operator` |
| 13 | lifecycle `draft`, editor `assistance_in_progress` | `assigned_operator` | `hold_assistance_in_progress` | `start_operator_work` |
| 14 | lifecycle `draft`, outcome NULL | `ta` | `draft_incomplete` | `complete_draft` |
| 15 | submitted, unassigned, outcome NULL | `superadmin` | `gate1_payment_not_received` if unpaid, else `awaiting_assignment` | `assign_operator` |
| 16 | act `authorized` | `assigned_operator` | `act_authorized` | `record_external_evidence` |
| 17 | act `filing_unknown` | `assigned_operator` | `filing_possibly_occurred` | `reconcile_filing` |
| 18 | outcome NULL, deferral `proposed` | `superadmin` | `deferral_proposed` | `review_deferral` |
| 19 | outcome NULL, deferral `approved` | `assigned_operator` | `deferral_active` | `review_deferral` |
| 20 | outcome NULL, dependency not `met` and conditioning the next action | unassigned ⇒ `superadmin`; assigned ⇒ `assigned_operator`; upstream application in external wait ⇒ `external_party` with follow-up = the dependent's owner | `dependency_outcome_unmet` / `dependency_evidence_missing` | `await_dependency` / `supply_dependency_evidence` |
| 21 | submission or handoff `filed_evidenced`, outcome NULL | `external_party` (follow-up = assigned operator) | `awaiting_external_result` | `await_external_result` |
| 22 | outcome NULL, operator work not started | `assigned_operator` | `operator_work_not_started` | `start_operator_work` |
| 23 | outcome NULL, readiness not `valid` | `assigned_operator` | readiness code | `record_readiness` / `reconfirm_readiness` |
| 24 | outcome NULL, readiness `valid` | `assigned_operator` | `ready` | `authorize_external_act` / `release_packet` |
| 25 | packet released, no handover | `assigned_operator` | `packet_released` | `record_delivery` |
| 26 | outcome set, artifact needed and not eligible | owner of the artifact incident | `artifact_not_eligible` | `resolve_incident` |
| 27 | outcome set, original part not returned | `assigned_operator` (or `superadmin` if unassigned) | `parked_custody_route_policy` when return unavailable, else `original_held` | `return_original` |
| 28 | outcome set, unpaid, no operator work ever authorized | `system` (follow-up `superadmin`) | `group_end_pending` [CCR-09] | `completion_check_pending` |
| 29 | outcome set, required delivery evidence missing | `unresolved_known_limitation` (follow-up assigned operator or `superadmin`) | `delivery_send_trigger_unselected`, or `uncertain_email_handling_unselected` when the only send is `uncertain` | `record_delivery` |
| 30 | outcome set, all completion evidence present | `unresolved_known_limitation` (follow-up assigned operator, or `superadmin` if unassigned) | `completion_check_trigger_unselected` | `completion_check_pending` |

An acknowledgement-required notice that the TA has not acknowledged adds a secondary TA item `acknowledge_notice` to the page. It does not replace the primary row. Financial follow-up and incidents are listed separately; they never move the primary owner (B29).

#### 2.3.4 Completion evidence (B24, B46)

`core.completionEvidence(application)` returns one status per prerequisite. The harness check (Section 3.14) and the pages use the same function.

| # | Prerequisite | Satisfied when | Blocker code |
|---|---|---|---|
| E1 | Outcome | `outcome IS NOT NULL` | `outcome_missing` [CCR-09] |
| E2 | No possible filing open | no act `authorized` or `filing_unknown`; `reconciliation_exhausted` only with outcome `external_outcome_unresolved` | `filing_possibly_occurred` |
| E3 | Artifact validity | if `decl.deliveryEvidence[outcome]` is `tm_held_electronic`: one eligible artifact of the declared type with a current, unblocked, canonical, integrity-verified version; no `bytes_integrity` or `wrong_recipient_disclosure` block on it | `artifact_not_eligible`, `document_blocked`, `bytes_unavailable` |
| E4 | Physical originals | `operations.custodyState`: `heldOriginals = 0` and `uncertain = 0` across every original linked to the application | `original_held` [CCR-09], `custody_evidence_missing` |
| E5 | Delivery evidence | per `decl.deliveryEvidence[outcome]`: `tm_held_electronic` ⇒ a document email send in state `accepted` or `synthetic_accepted` to the owning TA account whose version list includes the E3 version, plus a posted `result_available` web notice for the application. A TA retrieval does not count. A `manual_operator_email` record does not count (01 OD-02). `direct_external` ⇒ a `direct_external` handover record. `packet` ⇒ a `packet` handover record. `none` ⇒ satisfied. Undeclared or `unresolved` ⇒ blocker. | `delivery_evidence_missing` [CCR-09], `declaration_item_unresolved` |
| E6 | Declared completion evidence | each item of `decl.completionEvidence[outcome]` (`COMPLETION_EVIDENCE_CODES`, 01 §9.2: `ta_outcome_notice_posted`) present | `completion_evidence_missing` [CCR-09], `declaration_item_unresolved` |
| E7 (rev 2, MON-09) | Not a B25 group-end case | NOT (payment status ≠ `payment_received` AND `operator_work_ever_authorized = false`). Such an application stays open until its group's travel return date and ends only through `core.group_end_sweep` (B25) | `group_end_pending` |

Not prerequisites: open financial exceptions and fee recovery (B29); open operational incidents alone (B24); dependency state. Payment status matters only through E7.

## 3. Commands

### 3.0 Common rules

#### 3.0.1 Standard prefix P1–P5

| Step | Action | Failure |
|---|---|---|
| P1 | Runner steps 1–4d (01 §4.2): parse input, actor kind, operation-key lookup (replay or `conflict_operation_key`), actor re-check (account `active`, role unchanged, session valid, staff MFA). | `validation_failed`, `not_found_or_forbidden`, `unauthenticated`, `conflict_operation_key` |
| P2 | `policy.authorize(tx, actor, action, resource)` for every touched resource. Malformed or foreign ids ⇒ the same result. | `not_found_or_forbidden` |
| P3 | Lock guard rows in order `L`. Each command lists its locks. | `conflict_retry_exhausted` after bounded retry |
| P4 | Compare each expected revision the actor saw (`_rev`, and where listed `_hrev` = `hold_revision`, `_mrev` = `material_revision`). | `stale_revision` |
| P5 | `requireControls(tx, { action, … })` when the command maps to a controlled action (01 §8). If every blocker is a deliberate-boundary code, the category is that boundary's `unavailable_*`; otherwise `control_blocked` with all blockers. | `control_blocked`, `unavailable_parked`, `unavailable_known_limitation`, `unavailable_owner_decision` |

#### 3.0.2 Standard idempotency `I-std`

| Case | Result |
|---|---|
| Nth retry, same key, same content | Replay of the recorded summary, re-authorized under current read access. Handler not re-run. No new fact, task or notice. |
| Same key, different content | `conflict_operation_key`; nothing written. |
| Lost acknowledgement | Client sees `outcome_unknown`; the page instructs "resubmit the same form"; the same key replays or runs once. |
| New key, same business effect | The command's business guard decides (listed per command). A new key never bypasses it. |
| 40001 / 40P01 | Whole command retried with the same key and content (new ids, new `now`). Exhaustion ⇒ `conflict_retry_exhausted`, nothing written. |
| Rejected command | No operation row, no fact, no task, no notice. |

#### 3.0.3 Concurrency classes

| Class | Mechanism | Loser outcome |
|---|---|---|
| CC-A | application row `FOR UPDATE` + revision | waits, then re-evaluates; usually `stale_revision` or `control_blocked` |
| CC-G | group row `FOR UPDATE` (writer) vs `FOR SHARE` (readers) | serialized; reader re-evaluates |
| CC-P | `pay_application_state` `FOR UPDATE` (Payments entry) vs `FOR SHARE` (gate readers) | gate uses the committed status; exception basis goes stale |
| CC-X | `pay_ta_exposure` `FOR UPDATE` inside `reserveExposure` | serialized per TA across all groups |
| CC-U | partial unique index (named per command) | `conflict_duplicate` with existing ref when readable |
| CC-S | conditional `UPDATE … WHERE state = $from` + `requireAffected` | `stale_revision` |

#### 3.0.4 Notices, reasons and evidence

- Notices are web notices posted through `delivery.postNotice` in the same transaction with a dedupe key `<kind>:<subject id>[:<discriminator>]`. A notice never carries document bytes and is not a document email (B46). Staff notices use the same writer with a staff recipient.
- Reasoned SuperAdmin commands require `_reason` of at least 10 characters; it is stored in `fact.reason`.
- Evidence rules (B20, B33): an `EvidenceRef` of kind `document_version` MUST name a version in the application's group with `currency = current` and safety `passed`. `attestation` records a person's statement; it never alone satisfies a check that says "evidence required". Required evidence that is unavailable means the command is refused, not accepted with a gap.

### 3.1 Groups

#### CMD-G1 `core.create_group`

| Aspect | Specification |
|---|---|
| Actor / action | TA; `group.create` |
| Input | `countryId`, `label`, `travelStartDate`, `travelReturnDate` (LocalDate) |
| Checks | 1 P1–P2. 2 Country `listing_state = 'listed'` (Catalogue) ⇒ else `validation_failed` / `country_not_listed` [CCR-09]. 3 Dates valid ISO, `return >= start`, `start >= calendar.dateOf(now)` ⇒ else `validation_failed` / `group_dates_invalid`. |
| Writes | `core_groups` (`open`, `date_basis = 'Asia/Kolkata'`, `dates_revision = 1`). |
| Facts | `core.group_created` (after: country, dates, label, date basis). |
| Tasks / notices | none |
| Errors | `validation_failed`, `not_found_or_forbidden` |
| Concurrency | `I-std`. No duplicate guard: one TA may hold several groups for one country (separate trips). |

#### CMD-G2 `core.edit_travel_dates`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `group.edit_travel_dates` |
| Input | `groupId`, `_rev`, `travelStartDate`, `travelReturnDate` |
| Checks | 1 P1–P2. 2 Lock group `FOR UPDATE`, then every open application of the group `FOR UPDATE` (ascending id). 3 P4 group revision. 4 Group `open` ⇒ else `control_blocked` / `group_closed`. 5 Dates valid and changed. 6 Protection marks do not block a group fact; affected applications keep their own blockers. |
| Writes | Group dates, `dates_revision + 1`, `revision + 1`. Each open application: `material_revision + 1`, `revision + 1`. `dates_checked_revision` is not changed, so stage 11 reports `travel_date_recheck_pending` until the recheck task runs (B06). |
| Facts | `core.group_travel_dates_edited` (before/after dates, `dates_revision`, count of affected open applications). |
| Tasks / notices | `core.travel_date_recheck` dedupe `core.travel_date_recheck:<grp>:<dates_revision>`. |
| Errors | `stale_revision`, `control_blocked`, `validation_failed` |
| Concurrency | CC-G vs authorization and packet release (they lock the group `FOR SHARE`). Authorization first ⇒ the act is historical; the edit then changes only the open readiness basis. Edit first ⇒ the authorization sees changed `material_revision` (`stale_revision`) and `travel_date_recheck_pending`. Filed and protected facts are never rewritten (I-04 of 01). |

#### CMD-G3 `core.close_group`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `group.close` |
| Input | `groupId`, `_rev` |
| Checks | 1 P1–P2. 2 Lock group `FOR UPDATE`; lock open applications `FOR SHARE`. 3 P4. 4 Group `open`. 5 No application in `draft`/`submitted` ⇒ else `control_blocked` / `group_has_open_applications` [CCR-09]. 6 `intake.groupClosureBlockers` (rev 2, record 14 CCR-09): `openIncidents = 0` ⇒ else `group_intake_incidents_open`; `activeAttempts = 0` ⇒ else `attempt_in_progress` (an active attempt can still create drafts). |
| Writes | `state = 'closed'`, `closed_kind = 'ordinary'`, `closed_at`, `closed_by`. |
| Facts | `core.group_closed` |
| Errors | `stale_revision`, `control_blocked` |
| Concurrency | CC-G vs `core.create_draft` (share): a draft committed first makes step 5 fail; closure committed first makes the draft fail `group_closed`. |

### 3.2 Drafts, editing and identity corrections

#### CMD-D1 `core.create_draft` (rev 2: internal acceptance function, no TA route)

Rev 2 (record 14 CCR-06, BND-11, B14): `core.create_draft` is the internal acceptance function inside `core.acceptIntakeProposals`. The TA's individual form goes through `intake.start_individual` (record 14 C-I1), which calls `core.acceptIntakeProposals` with the same checks below; bulk rows use the same writer. There is no separate TA route that creates a draft, so every draft has an intake attempt and passes the same Document Processing and Core acceptance. The applicant key is set through `setApplicantKey` (Section 3.2.2).

| Aspect | Specification |
|---|---|
| Actor / action | TA owner of the group through `intake.start_individual` (`intake.start` + `application.create_draft` semantics), or the intake task acting for the origin TA |
| Input | `groupId`, `offeringId`, `applicant: ApplicantData`, optional `laterAttemptOf: ApplicationId`, `freshIntakeConfirmed: boolean` |
| Checks | 1 P1–P2. 2 Locks: offering head `FOR SHARE`, offering controls `FOR SHARE`, group `FOR SHARE`. 3 P5 `create_draft` (launch refuse rows; current head declaration and binding; group open; population scope). 4 Offering country = group country ⇒ else `validation_failed` / `offering_country_mismatch` [CCR-09]. 5 Applicant identity fields present and normalized; applicant key computed (01 I-08). 6 Later-attempt rule (B03): if a closed application exists for (group, offering, applicant key), then `laterAttemptOf` MUST name the most recent one, `freshIntakeConfirmed` MUST be true, the prior lifecycle MUST be `completed`, and no prior act may be `reconciliation_exhausted` (`reconciliation_exhausted_no_refiling`); otherwise `control_blocked` / `later_attempt_declaration_required` [CCR-09]. 7 Duplicate open scope: `core_applications_open_scope_uq`. |
| Writes | `core_applications` (`draft`, `unassigned`, governing ids from `catalogue.currentGoverning`, `admitted_launch_id`, `created_via = 'form'`, revisions 1, `dates_checked_revision` = group value, `later_attempt_of`). Snapshot version 1. `payments.ensureApplicationState`. Nothing is copied from the prior attempt: no submission, price, authority, readiness or association (B03). |
| Facts | `core.draft_created` (after: offering, governing ids, applicant data, `later_attempt_of`). |
| Errors | `control_blocked`, `conflict_duplicate` (`duplicate_open_scope`, existing ref), `validation_failed` |
| Concurrency | CC-U on the open-scope index, including the empty-scope race (01 T-F13). Offering suspension (`ops_offering_controls` update) serializes with step 2. |

#### Writer `core.acceptIntakeProposals` (called by Intake; rev 2, record 14 CCR-06, replaces the singular writer)

Signature: contract 01 §6.4. One call per row with one proposal per offering. Core locks every offering head ascending, then the offering controls, then the group (share), and runs CMD-D1 steps 2–7 per offering under the actor of the calling command or task (Intake's task already re-checked the origin TA, 01 §4.6). Results per offering: `created` (with `snapshotVersionNo`); `matched_existing` when the open-scope index hits (no overwrite and no document association to the existing application, B16); `refused` with `later_attempt_declaration_required` when a closed application exists for the scope (bulk intake never declares a later attempt; Intake opens an incident; the individual form MAY carry the declaration fields of CMD-D1). Writes and facts as CMD-D1 with `created_via = 'intake'` (form: `'form'`), `intake_row_id`, plus `documents.associateFromProposal` per document. When a proposal's governing tuple differs from the locked head, Core calls `catalogue.noteGoverningBehindHead` (rev 2: record 14 CCR-08 rejected in favour of this hook). Bulk intake never creates a submission, assistance request or assignment (B14, B17).

#### Writer `core.applyIntakeCorrection` (rev 2, record 14 CCR-06b)

Locks the application `FOR UPDATE`; requires lifecycle `draft` with editor `unassigned` or `returned_to_ta` (else `correction_target_not_draft`) and the current snapshot `version_no = expectedSnapshotVersionNo` (else `stale_target_revision`). Identity-field changes are refused with `identity_change_requires_evidence` (they go through CMD-D3 and its same-person evidence rule, B19). All changes and document replacements of the row apply together or none (B16). Writes a snapshot (`cause = 'intake'`), `core_corrections` (`draft_other`), `material_revision + 1`. Fact `core.draft_edited`.

#### 3.2.2 Applicant-key writer `setApplicantKey` (rev 2, MON-04)

Every path that sets or changes `core_applications.applicant_key` goes through this one Core writer: CMD-D1 / `acceptIntakeProposals`, CMD-D3, CMD-A3, CMD-SA1 and any identity change after an intake incident. Under the application lock and with the offering head and group locked as in CMD-D1, it applies: (1) the open-scope unique index (`conflict_duplicate` / `duplicate_open_scope`); (2) the later-attempt rule of CMD-D1 step 6 for the **target** scope: if a closed application exists for (group, offering, new key), the command MUST carry `laterAttemptOf` = the most recent closed application of that scope and `freshIntakeConfirmed = true`, the prior lifecycle MUST be `completed`, else `control_blocked` / `later_attempt_declaration_required`; corrections (D3, A3, SA1) never carry that declaration, so a re-key into a closed scope is always refused there and the TA starts fresh intake instead; (3) the no-refiling bar: any application of the target scope with a `reconciliation_exhausted` act ⇒ `control_blocked` / `reconciliation_exhausted_no_refiling`, always. In the same transaction it calls `documents.reevaluateForApplication` (record 14 CCR-12).

#### CMD-D2 `core.edit_draft` (TA application information)

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.edit_draft` |
| Input | `applicationId`, `_rev`, `changes` (non-identity snapshot fields only) |
| Checks | 1 P1–P2. 2 Lock application `FOR UPDATE`. 3 P4. 4 P5 `correct_application`: protection mark; lifecycle open; editor `unassigned` or `returned_to_ta` (assigned and not returned ⇒ `awaiting_formal_return`; `assistance_in_progress` ⇒ `hold_assistance_in_progress`). 5 `changes` touch no identity field ⇒ else `validation_failed` / `identity_field_requires_correction` [CCR-09]. 6 Field schema from `decl/1 documents.formFields`. 7 Stage rule (Section 3.2.1). |
| Writes | Applied: new snapshot, `core_corrections` (kind `draft_other` on a draft, `submitted_unassigned`, or `after_return`; state `applied`), `material_revision + 1`, `revision + 1`. Held: `core_corrections` state `held_filing_unknown`, no snapshot change. |
| Facts | `core.draft_edited` (draft) or `core.correction_accepted` (submitted); held ⇒ `core.correction_held` [CCR-08]. |
| Errors | `stale_revision`, `control_blocked`, `validation_failed` |
| Concurrency | CC-A. No latest-write-wins: two TA tabs with the same `_rev` ⇒ one wins, the other `stale_revision` (B19). |

#### CMD-D3 `core.correct_identity`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.correct_identity` |
| Input | `applicationId`, `_rev`, `identityChanges` (subset of the five B19 fields), `evidenceVersionIds[]` (1–4), `explanation` (≤ 1000) |
| Checks | 1–4 as CMD-D2. 5 Same-person evidence rule (interim, OD-C1): (a) each evidence version is in the application's group, `current`, processed, and positively associated with this application under an identity requirement type; (b) for each changed field, the current extraction verdict of at least one evidence version (status `extracted`, or a manual resolution) equals the new normalized value; (c) continuity: one evidence verdict shows at least two of the five fields unchanged from the current snapshot, or a second evidence version shows the old values; any failure ⇒ `control_blocked` / `identity_same_person_evidence_insufficient` [CCR-09]. Attestation never satisfies (a)–(c). 6 Rev 2 (MON-04): a key change goes through `setApplicantKey` (Section 3.2.2): open-scope index, later-attempt rule for the target scope and the no-refiling bar. 7 Stage rule (Section 3.2.1). |
| Writes | As CMD-D2 with kind `draft_identity` / `submitted_unassigned` / `after_return`; `applicant_key` changes only through `setApplicantKey`; `documents.reevaluateForApplication` in the same transaction (rev 2, record 14 CCR-12). |
| Facts | `core.applicant_identity_corrected` (before/after of changed fields, evidence refs). Held ⇒ `core.correction_held`. |
| Errors | `control_blocked`, `conflict_duplicate`, `stale_revision`, `validation_failed` |
| Concurrency | CC-A; CC-U on the open-scope index when the key changes. |

#### 3.2.1 Correction stage rule (B19, B23)

| Application state | Rule for any correction command (D2, D3, A3, SA1) |
|---|---|
| draft | Applied. Identity fields need the same-person evidence rule. |
| submitted, unassigned | Applied. `material_revision + 1` invalidates any readiness basis. |
| assigned, not returned | TA refused (`awaiting_formal_return`). Only assistance entry (A3) or SuperAdmin evidence correction (SA1) apply. Readiness becomes `stale_basis`; filing and packet release pause until accepted evidence and renewed readiness. |
| any act `authorized` or `filing_unknown` | Held: row `held_filing_unknown`, snapshot unchanged (B23). |
| government submission or provider handoff `filed_evidenced`, packet released, or lifecycle closed | Refused: `control_blocked` / `correction_historical_after_filing` [CCR-09]. The page offers the operator path "open post-filing correction incident" (IN1). |

Held-correction resolution runs inside `core.recordExternalActEvidence`: `filed_evidenced` ⇒ every held correction of the application becomes `superseded_by_filing` and one `post_filing_correction` incident [CCR-11] opens (owner: assigned operator); `not_filed_evidenced` ⇒ `released_for_reapply` (pending row 8). Fact `core.correction_hold_resolved` [CCR-08].

#### CMD-D4 `core.apply_held_correction`

| Aspect | Specification |
|---|---|
| Actor / action | The role now permitted for the correction kind: TA for `draft_*`/`submitted_unassigned`/`after_return` (editor permits), asg for `assistance_entry`, SA for `superadmin_evidence`; the action of the original kind |
| Input | `correctionId`, `_rev` |
| Checks | 1 P1–P2. 2 Lock application, then correction `FOR UPDATE`. 3 P4. 4 Correction state `released_for_reapply` (CC-S). 5 For every changed field, the current snapshot value equals the correction's `before` value ⇒ else `stale_revision` / `held_correction_conflict` [CCR-09]. 6 All checks of the original command again (controls, evidence rule, stage rule). |
| Writes | New snapshot; correction `reapplied`, `snapshot_after_id`; `material_revision + 1`. |
| Facts | `core.correction_accepted` or `core.applicant_identity_corrected`, and `core.correction_hold_resolved`. |
| Errors | `stale_revision`, `control_blocked` |

#### CMD-D5 `core.link_dependency` / CMD-D6 `core.unlink_dependency`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.link_dependency` [CCR-10] |
| Input | `dependentApplicationId`, `_rev`, `relationshipCode`, `upstreamApplicationId` (rev 2: the `external_evidence` upstream kind is removed, BND-05) |
| Checks | 1 P1–P2 on the dependent and the upstream (the TA must read both; another TA's application is `not_found_or_forbidden`). 2 Lock both applications ascending. 3 P4. 4 Editor permits TA (as CMD-D2). 5 `relationshipCode` declared in the dependent's `decl/1 dependencies.relations` ⇒ else `control_blocked` / `dependency_undeclared` [CCR-09]. 6 Upstream offering `service_code = upstreamServiceCode` and `applicantRelation` match the declaration (`same_applicant` ⇒ equal applicant key). 7 Rev 2 (COV-08 interim, OD-R2-06): upstream in the **same group** as the dependent ⇒ else `control_blocked` / `dependency_undeclared` (B03 one country per group; cross-group or cross-country dependencies await the owner decision). 8 Cycle walk ⇒ `dependency_cycle` [CCR-09]. 9 Upstream `preparation_only` where a government result is required ⇒ `unavailable_parked` / `parked_preparation_dependency_evidence` [CCR-09] (B44). A relationship that would need external (non-application) evidence of a government result is not declarable (`parked_dependency_external_evidence`, B44). 10 Unique per relationship. |
| Writes | `core_dependencies` (`waiting`); immediate evaluation (Section 3.11.3) when the upstream already has an outcome; dependent `material_revision + 1`. Unlink (D6): only while the dependent is confirmed unfiled and the editor permits the TA; state `unlinked`. |
| Facts | `core.dependency_linked` / `core.dependency_unlinked` [CCR-08]; `core.dependency_state_changed` on evaluation. |
| Errors | `control_blocked`, `conflict_duplicate`, `unavailable_parked`, `not_found_or_forbidden` |
| Concurrency | CC-A on both rows in ascending order; CC-U on the relationship index. |

### 3.3 Submission, price, estimate and forecast (B17)

#### CMD-S1 `core.submit`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.submit` |
| Input | `applicationId`, `_rev`, `confirmations: [{ code, textVersion }]`, `quotedPricePaise` (as displayed), `estimateWindow` (as displayed) |
| Checks | 1 P1–P2. 2 Locks: offering head share, offering controls share, group share, application `FOR UPDATE`. 3 P4. 4 P5 `submit`: protection mark; launch (`submit` row; I-12 of 01); declaration and binding; lifecycle `draft` and group open; editor `unassigned` or `returned_to_ta` (else `awaiting_formal_return`); declared submit-time validations; impact resolved; travel recheck current. 5 Every confirmation item that `decl/1 authority.confirmationItems` marks required is present with the current `textVersion` ⇒ else `validation_failed` / `ta_confirmation_absent` [CCR-09]; an old `textVersion` ⇒ `stale_revision`. `authority` unresolved ⇒ `declaration_item_unresolved`. 6 Price: the governing baseline price equals `quotedPricePaise` ⇒ else `stale_revision` / `price_changed` [CCR-09]. 7 Estimate: baseline `processingEstimate { minDays, maxDays }` declared ⇒ else `declaration_item_unresolved`; computed window equals the displayed window ⇒ else `stale_revision`. 8 `UNIQUE (application_id)` on submissions. No payment check: price and window start independently of payment (B17). |
| Writes | `core_submissions` (confirmation items recorded exactly as given, `not_required` for declared optional items, snapshot id, evidence fingerprint, window in `Asia/Kolkata` local dates). `core_price_records` seq 1 `quoted`/`effective`. Application: `lifecycle = 'submitted'`, `submission_id`, `revision + 1`. If editor was `returned_to_ta` (assisted draft): close the `ret` hold, `editor_state = 'assigned'` (the assistance assignment survives, B18), `hold_revision + 1`, assistance request `fulfilled` if not already. |
| Facts | `core.submitted` (confirmation items, window, governing ids), `core.price_quoted`; `core.handed_back` when a hold closed. |
| Tasks / notices | `core.timing_risk_check` dedupe `core.timing_risk_check:<app>:submission`. Staff notice to the assigned operator when one exists. |
| Errors | `stale_revision`, `control_blocked`, `validation_failed`, `unavailable_*` (launch boundary codes) |
| Concurrency | `I-std`. New key after success ⇒ `control_blocked` / `application_not_draft` (unique index backstop). Suspension or withdrawal of the offering vs submit: `ops_offering_controls` share vs update; whichever commits first decides. Baseline publication vs submit: offering head share vs update; the submit sees either the old governing baseline with its price or a new impact item (`catalogue_impact_unknown`). |

#### CMD-S2 `core.propose_price_increase`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `price.propose_increase` [CCR-10] |
| Input | `applicationId`, `_rev`, `cause` (`mistaken_price` \| `material_scope_change`), `newPricePaise`, `correctionId` (required for `material_scope_change`), `evidence[]`, `_reason` |
| Checks | 1 P1–P2. 2 Lock application. 3 P4. 4 Lifecycle `submitted`, outcome NULL ⇒ else `control_blocked`. 5 `newPricePaise >` current effective price. 6 `material_scope_change`: `correctionId` names an `applied` correction of this application ⇒ else `validation_failed`. 7 No open increase (CC-U) ⇒ `conflict_duplicate` / `price_increase_open` [CCR-09]. |
| Writes | `core_price_records` `increase_proposed`/`open` (next `seq_no`, `previous_price_paise`, `effective_price_paise` = previous). |
| Facts | `core.price_increase_proposed` |
| Tasks / notices | TA notice `price_change`, `ack_required = true` (the TA must decide), dedupe `price_change:<pri>`. |
| Errors | `control_blocked`, `conflict_duplicate`, `validation_failed`, `stale_revision` |
| Concurrency | CC-A + CC-U. Paid amounts are never touched (no Payments write). |

Effect on filing: an open `mistaken_price` increase blocks nothing (the TA's authority covers the communicated price). An open `material_scope_change` increase blocks authorization and packet release with `renewed_authority_pending` [CCR-09]; a declined one blocks them with `renewed_authority_declined` [CCR-09] (OD-C3).

#### CMD-S3 `core.decide_price_increase`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.decide_price_increase` |
| Input | `applicationId`, `priceRecordId`, `_rev`, `decision` (`accept` \| `decline`) |
| Checks | 1 P1–P2. 2 Lock application, then price record. 3 P4. 4 Editor `unassigned` or `returned_to_ta` ⇒ else `control_blocked` / `awaiting_formal_return` (B18: price-authority actions wait for formal return). 5 Record `open` (CC-S). |
| Writes | `accept` ⇒ `accepted`, `effective_price_paise = amount_paise`. `decline` ⇒ `declined`, `effective_price_paise = previous_price_paise` (a declined mistaken increase honours the communicated price). `decided_by`, `decided_at`. |
| Facts | `core.price_increase_accepted` / `core.price_increase_declined` |
| Errors | `control_blocked`, `stale_revision` |
| Concurrency | CC-A; CC-S on the record. Notice acknowledgement is a separate Delivery fact. |

#### Writer `core.applyBaselinePriceReduction` (called by `catalogue.impact_recheck`)

Locks application `FOR UPDATE`, then `pay_application_state` `FOR SHARE`. Applies only when lifecycle is `submitted`, the payment status is not `payment_received` ("unpaid", I-C4), and the new baseline price is lower than the current effective price. Writes `reduction_auto`/`effective` (unique per baseline). Fact `core.price_reduced`. TA notice `price_change`, `ack_required = false`. Returns `reduced`, `not_applicable_paid` (no write; the page shows `unselected_refund`), or `not_lower`. An open increase keeps its proposed amount.

#### CMD-S4 `core.record_forecast`

| Aspect | Specification |
|---|---|
| Actor / action | asg or SA; `forecast.record` [CCR-10] |
| Input | `applicationId`, `windowStart`, `windowEnd`, `basisCode`, `note` |
| Checks | 1 P1–P2. 2 Lock application `FOR SHARE`, previous current forecast `FOR UPDATE`. 3 Lifecycle `submitted`, outcome NULL. 4 `windowEnd >= windowStart >= submitted_local_date` ⇒ else `validation_failed` / `forecast_window_invalid` [CCR-09]. |
| Writes | Previous current forecast `is_current = false`; new forecast `is_current`. |
| Facts | `core.forecast_recorded` [CCR-08] |
| Tasks | `core.timing_risk_check` dedupe `core.timing_risk_check:<app>:<fcs>` |
| Concurrency | CC-U on `is_current`. The estimate is guidance, not an SLA (B17); pages label it so. |

### 3.4 Assistance (B18)

#### CMD-A1 `core.request_assistance`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.request_assistance` |
| Input | `applicationId`, `_rev`, `note` (≤ 2000) |
| Checks | 1 P1–P2. 2 Locks: offering share, controls share, group share, application `FOR UPDATE`. 3 P4. 4 P5 `request_assistance`: protection, launch, binding, lifecycle open, outcome NULL, editor `unassigned` or `returned_to_ta`. 5 No open request (CC-U) ⇒ `conflict_duplicate` / `assistance_request_open` [CCR-09]. |
| Writes | `core_assistance_requests` `requested`. No submission is created or implied (B17). |
| Facts | `core.assistance_requested` |
| Tasks / notices | Staff notice to the SuperAdmin queue (recipient: each active SuperAdmin, dedupe `assist:<ast>:<acc>`). |
| Concurrency | CC-A + CC-U. |

#### CMD-A2 `core.decide_assistance`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `assistance.decide` |
| Input | `assistanceId`, `_rev` (application), `decision` (`approve` \| `decline`), `_reason` |
| Checks | 1 P1–P2. 2 Lock application, then request. 3 P4. 4 Request `requested` (CC-S); application open. |
| Writes | `decline` ⇒ `declined`. `approve` with no active assignment ⇒ `approved` (waits in the assignment queue). `approve` with an active assignment (case `returned_to_ta`) ⇒ `approved`, `assignment_id` = active, `editor_state = 'assistance_in_progress'`, the `ret` hold closes with resolution `assistance_approved`, `hold_revision + 1`. |
| Facts | `core.assistance_approved` / `core.assistance_declined` |
| Tasks / notices | TA notice `assistance_decision` (`ack_required = false`). Staff notice to the operator on in-place approval. |
| Concurrency | CC-A; CC-S on the request. Approval is not assignment and not payment (B26). |

#### CMD-A3 `core.record_assistance_entry`

| Aspect | Specification |
|---|---|
| Actor / action | asg; `operator.assistance_entry` |
| Input | `applicationId`, `_rev`, `changes` (any snapshot fields), `evidenceVersionIds[]` (identity changes), `explanation` |
| Checks | 1 P1–P2. 2 Locks as CMD-A1. 3 P4. 4 P5 `assistance_entry`: editor `assistance_in_progress`; launch; assignment Gate 1 basis present. 5 Identity fields ⇒ same-person evidence rule (CMD-D3 step 5) and `setApplicantKey` on a key change (rev 2, MON-04). 6 Stage rule 3.2.1. |
| Writes | Snapshot; `core_corrections` kind `assistance_entry`; `material_revision + 1`. Operator document uploads go through Documents with source `operator_assistance_upload`; Documents calls `requireControls(assistance_entry)`. |
| Facts | `core.assistance_entry_recorded` |
| Concurrency | CC-A. This is the sole operator information-entry path (B18). |

### 3.5 Assignment and reassignment (B18, B19, B26, B11)

#### CMD-AS1 `core.assign`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `assignment.assign` |
| Input | `applicationId`, `_rev`, `operatorAccountId`, optional `gateExceptionId`, optional `_reason` |
| Checks | 1 P1–P2. 2 Locks: `iam_accounts` actor and target operator (ascending, share); offering share; controls share; group share; application `FOR UPDATE`; `pay_application_state` share. 3 P4. 4 Target operator: role `operator`, status `active`, MFA enrolled ⇒ else `control_blocked` / `operator_not_assignable`. 5 P5 `assign`: protection; launch; binding; lifecycle `submitted` with no active assignment, or `draft`/`submitted` with an `approved` assistance request; `already_assigned`; outcome NULL (`outcome_already_recorded`); no accepted withdrawal; Gate 1 = `payment_received`, or the named Gate 1 exception passes freshness (01 §8.5). |
| Writes | `core_assignments` (`initial` or `assistance`, `gate1_basis_kind`, `gate1_basis_ref`). Application: `active_assignment_id`, `assigned_operator_id`, `editor_state` (`assigned` or `assistance_in_progress`), `operator_work_ever_authorized = true`, `revision + 1`. Assistance request `assignment_id`. Exception consumed (CC-S). If an exception was consumed and the status is not `payment_received`: `payments.openFinancialException(work_under_gate1_exception, causeRef = gex id, accountable = actor)`. |
| Facts | `core.operator_assigned`, `core.gate_exception_consumed`; Payments facts. |
| Tasks / notices | Staff notice to the operator, dedupe `assign:<asg>`. |
| Errors | `control_blocked`, `stale_revision`, `conflict_duplicate` (active-assignment index), `not_found_or_forbidden` |
| Concurrency | Two SAs: CC-A then CC-U ⇒ one active assignment; the other `already_assigned` (01 T-F16). Payment correction vs assign: CC-P; a correction committed first changes `status_revision`, so a granted exception is `gate_exception_stale`. |

#### CMD-AS2 `core.assign_selection` (selection and SuperAdmin-initiated round robin) [CCR-21]

| Aspect | Specification |
|---|---|
| Actor / action | SA; `assignment.assign` on each application |
| Input | `mode` (`selection` \| `round_robin`), `items: [{ applicationId, _rev, gateExceptionId? }]` (1–50, in the order shown on the preview), `operators: AccountId[]` (`selection`: exactly 1; `round_robin`: 2–20 in the chosen order), `plan: [{ applicationId, operatorId }]` (as previewed) |
| Checks | 1 P1–P2 for each application. 2 Plan check: `selection` ⇒ every pair uses `operators[0]`; `round_robin` ⇒ `plan[i].operatorId = operators[i mod n]` in item order ⇒ else `validation_failed` / `round_robin_plan_mismatch` [CCR-09]; more than 50 items ⇒ `validation_failed` / `assignment_batch_too_large` [CCR-09]. 3 Locks: operator accounts ascending (share); distinct offering heads, controls and groups ascending (share); applications ascending (`FOR UPDATE`); payment states ascending (share). 4 Per item, CMD-AS1 steps 3–5. |
| Writes | Per passing item: CMD-AS1 writes with `batch_operation_id`. A failing item writes nothing and is reported with its blocker codes. If no item passes, the command is rejected (`control_blocked`, per-item blockers) and writes nothing. |
| Facts | Per assigned item `core.operator_assigned` (after includes `mode`). |
| Errors | `validation_failed`, `control_blocked` |
| Concurrency | One transaction, one operation key. Nth retry replays the per-item summary. A competing single assignment makes that item `already_assigned` on retry; the rotation of the other items does not shift (the plan is explicit). No task, timer or event assigns anything; assignment only follows an explicit SuperAdmin confirmation of a rendered plan (B19, B42). No group-level assignment exists. |

#### CMD-AS3 `core.reassign`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `assignment.reassign` |
| Input | `applicationId`, `_rev`, `toOperatorAccountId`, optional `gateExceptionId`, `_reason` (required) |
| Checks | 1 P1–P2. 2 Locks as CMD-AS1. 3 P4. 4 Active assignment exists; target ≠ current; target assignable. 5 P5 `reassign` [CCR-04]: protection; lifecycle open; Gate 1 re-evaluated (01 I-02). The launch stage is not applied: reassignment transfers duties and starts no new work (B07). |
| Writes | Old assignment `ended`, `ended_reason = 'reassigned'`, `transferred` (open hold ids, open and exhausted authorization ids, incident ids). New assignment `reassignment`, `predecessor_assignment_id`. Application `assigned_operator_id`, `active_assignment_id`, `revision + 1`. Every authorization of the application in `authorized`, `filing_unknown`: `reconciliation_owner_id` := new operator. `operations.transferApplicationDuties(from, to, applicationId)` [CCR-13]: incidents of this application owned by the old operator move to the new operator. Readiness rows are not changed; their derived validity becomes `previous_operator` (B19). Originals, custody holders and act states are not changed. Gate 1 exception and financial exception as CMD-AS1. |
| Facts | `core.assignment_ended`, `core.operator_reassigned` (old/new operator, acting SA, time, reason, transferred ids), `ops.incident_assigned` per moved incident. |
| Tasks / notices | Staff notices to old and new operator. Tasks acting for the old operator cancel as `cancelled_revoked` at their next prepare (01 §5.5). |
| Errors | `control_blocked`, `stale_revision`, `not_found_or_forbidden` |
| Concurrency | CC-A. Old operator's in-flight command: if it commits first, its effect stands and is transferred; if the reassignment commits first, the old operator gets `not_found_or_forbidden` (relation `asg` ended). Old links, operation-result lookups and pages are denied from the commit (B10). |

Operator suspension (B11): Identity suspends the account only. The assignment stays `active`; pending row 3 shows `assigned_operator_inactive` to the SuperAdmin queue until CMD-AS3. TA suspension preserves applications; no hold is inferred (I-C5); Delivery's release check denies the inactive recipient.

### 3.6 Assigned-editor holds (B18)

#### CMD-H1 `core.report_problem`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.report_problem` |
| Input | `applicationId`, `note` (≤ 2000) |
| Checks | 1 P1–P2. 2 Lock application. 3 Lifecycle open; editor `assigned` or `assistance_in_progress`, no open `ret` ⇒ else `control_blocked` / `hold_not_applicable` [CCR-09]. 4 No open `prb` (CC-U) ⇒ `conflict_duplicate` / `problem_report_open` [CCR-09]. |
| Writes | `core_holds` `prb` open; `hold_revision + 1`; `revision + 1`. Nothing else: no snapshot, document, association, price, withdrawal or confirmation write (B18). |
| Facts | `core.problem_reported` |
| Tasks / notices | Staff notice to the assigned operator. |
| Concurrency | No `_rev` is required: a report is valid against any revision. Vs authorization: CC-A. If the hold commits first, authorization and packet release are blocked (`hold_problem_reported`). If the authorization commits first, the act stays authorized and protected; the operator handles the report. |

#### CMD-H2 `core.formal_return`

| Aspect | Specification |
|---|---|
| Actor / action | asg; `operator.formal_return` |
| Input | `applicationId`, `_rev`, `note` (what the TA must do), optional `resolveProblemHoldId` |
| Checks | 1 P1–P2. 2 Lock application. 3 P4. 4 Editor `assigned` or `assistance_in_progress`; lifecycle open; no open `ret`. |
| Writes | `ret` hold open; `editor_state = 'returned_to_ta'`; optional `prb` close (resolution `returned`); assistance request `fulfilled` when ending assistance; `hold_revision + 1`. The assignment stays with the same operator. |
| Facts | `core.formal_return` (+ `core.problem_resolved`) |
| Tasks / notices | TA notice `return_for_correction` (`ack_required = false`). |
| Concurrency | CC-A. Returning while an act is open is allowed; TA corrections are then held (3.2.1). |

#### CMD-H3 `core.hand_back`

| Aspect | Specification |
|---|---|
| Actor / action | TA owner; `application.hand_back` |
| Input | `applicationId`, `_rev` |
| Checks | 1 P1–P2. 2 Lock application. 3 P4. 4 Editor `returned_to_ta`; lifecycle `submitted` (a returned draft uses CMD-S1). |
| Writes | `ret` closed; `editor_state = 'assigned'`; `hold_revision + 1`. Readiness becomes `stale_basis`; the same operator MUST reconfirm (B18). |
| Facts | `core.handed_back` |
| Tasks / notices | Staff notice to the operator. |

#### CMD-H4 `core.flag` / CMD-H5 `core.respond_flag` / CMD-H6 `core.resolve_hold`

| Aspect | `core.flag` | `core.respond_flag` | `core.resolve_hold` |
|---|---|---|---|
| Actor / action | asg; `operator.flag` | SA; `flag.respond` | asg; `operator.resolve_hold` |
| Input | `applicationId`, `note` | `holdId`, `responseNote`, `_reason` | `holdId`, `resolutionNote` |
| Checks | editor `assigned`; no open `flg` (CC-U ⇒ `conflict_duplicate`) | hold `flg` open and `responded_at IS NULL` (CC-S) ⇒ else `control_blocked` / `flag_already_responded` [CCR-09] | hold open; kind `prb` or `flg` (`ret` ⇒ `control_blocked` / `hold_not_operator_closable` [CCR-09]); `flg` needs a response (`flag_response_missing` [CCR-09]) |
| Writes | `flg` open; `hold_revision + 1` | response fields; hold `revision + 1` (application `hold_revision` unchanged) | hold `resolved`; `hold_revision + 1` |
| Facts | `core.flagged_to_superadmin` | `core.flag_responded` [CCR-08] | `core.problem_resolved` / `core.flag_resolved` |
| Notices | SA queue staff notice | staff notice to the operator | TA notice `generic_case_update` for `prb` |

A SuperAdmin response never closes the hold, never records readiness and never files (B18). Every hold open or close increments `hold_revision`; the operator must reconfirm readiness afterwards.

### 3.7 Operator work and readiness (B18, B19)

#### CMD-O1 `ops.start_work` / CMD-O2 `ops.record_work_step`

| Aspect | `ops.start_work` | `ops.record_work_step` |
|---|---|---|
| Actor / action | asg; `operator.start_work` | asg; `operator.record_work_step` [CCR-10] |
| Input | `applicationId` | `applicationId`, `stepCode`, `state`, `note` |
| Checks | P5 `start_operator_work` (protection, launch hold, binding, lifecycle open, editor `assigned`/`assistance_in_progress`, assignment Gate 1 basis); unique `_work_started` per assignment ⇒ `conflict_duplicate` / `work_already_started` [CCR-09] | work started (`operator_work_not_started`); `stepCode` in `decl/1 progressMapping` ⇒ else `validation_failed` / `step_undeclared` [CCR-09]; P5 `start_operator_work` |
| Writes | `ops_work_steps` `_work_started` | `ops_work_steps` row |
| Facts | `ops.operator_work_started` | `ops.work_step_recorded` |

Local steps change no application information (B18) and may loop or overlap (B21). Each new assignment needs its own `_work_started` (B32 stage events).

#### CMD-O3 `ops.record_readiness`

| Aspect | Specification |
|---|---|
| Actor / action | asg; `operator.record_readiness` |
| Input | `applicationId`, `_rev`, `_hrev`, `_mrev`, `basisDigest` (fingerprint displayed), `note` |
| Checks | 1 P1–P2. 2 Locks: offering share, controls share, group share, application `FOR SHARE`, current readiness `FOR UPDATE`. 3 P4 (all three). 4 Work started for the active assignment ⇒ else `operator_work_not_started`. 5 P5 `record_readiness`: protection, launch, binding, lifecycle `submitted`, outcome NULL, editor `assigned` with no open hold, mandatory validations (documents, identity, population, dependency for the next action), impact resolved, travel recheck current, no `renewed_authority_*` blocker, no active deferral. 6 `preparation_only`: a `built` packet exists and its `built_from` equals the current evidence set ⇒ else `packet_not_built` / `packet_stale` [CCR-09]. 7 Live `core.readinessBasis` = `basisDigest` ⇒ else `stale_revision` / `readiness_basis_changed` [CCR-09]. |
| Writes | Previous `current` ⇒ `superseded`, `superseded_by`; new `current` with `assignment_id`, operator, fingerprint, basis. |
| Facts | `ops.readiness_recorded` |
| Errors | `control_blocked`, `stale_revision`, `conflict_duplicate` |
| Concurrency | CC-U `UNIQUE (application_id) WHERE state = 'current'`. Any later change to the basis makes it `stale_basis` at use; no invalidation write is needed (01 §7.3). A SuperAdmin has no route or action to record readiness. |

#### CMD-O4 `ops.withdraw_readiness`

Actor: asg who recorded it (`operator.withdraw_readiness`). Checks: readiness `current` (CC-S), recorded by the actor, actor still assigned. Writes `withdrawn`, `withdrawn_at`. Fact `ops.readiness_withdrawn`.

### 3.8 Gate exceptions (B20, B26, B27, B19)

#### CMD-GX1 `core.grant_gate_exception`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `gate_exception.grant` |
| Input | `applicationId`, `_rev`, `gate`, `action` (01 §8.5 action key), `_reason` (≥ 10) |
| Checks | 1 P1–P2. 2 Locks: application `FOR UPDATE`, `pay_application_state` share. 3 P4. 4 Application open. 5 Eligibility (01 §8.5): the gate currently blocks that action (stage 12 only) ⇒ else `control_blocked` / `gate_not_blocking`; Gate 2 only for `travelmudra_filed` and only while no commitment of the current attempt may have happened (rev 2, MON-03: every earlier act of the attempt absent or `not_filed_evidenced`; the evaluator's predicate); readiness gate only when validity = `previous_operator` ⇒ else `gate_exception_not_eligible`. 6 No `granted` exception for (application, gate, action) (CC-U). |
| Writes | `core_gate_exceptions` `granted` with `basis` and `expires_at = now + gates.exceptionTtlMs`. |
| Facts | `core.gate_exception_granted` (gate, action, basis, reason) |
| Tasks / notices | Staff notice to the assigned operator, if any. |
| Concurrency | CC-U. Granting asserts no payment, confirmation, readiness or external fact and forces no execution (B20). |

#### CMD-GX2 `core.revoke_gate_exception`

SA; `gate_exception.revoke`; `_reason`. CC-S `granted` → `revoked`. Fact `core.gate_exception_revoked`.

### 3.9 External acts (B23, B27, B28)

#### CMD-X1 `core.authorize_external_act`

| Aspect | Specification |
|---|---|
| Actor / action | asg; `operator.authorize_external_act` |
| Input | `applicationId`, `actKind`, `_rev`, `_hrev`, `_mrev`, `readinessId`, optional `readinessExceptionId`, optional `gate2ExceptionId`, `feeAmountPaise` (required iff `actKind` is the declaration's fee-carrying act, 01 §7.4), `basisDigest` (evidence set digest displayed), `confirmIrreversible: true` |
| Checks | 1 P1–P2. 2 Locks: offering head share, controls share, group share, application `FOR UPDATE`, `pay_application_state` share; `pay_ta_exposure` `FOR UPDATE` inside `reserveExposure`. 3 P4 (three revisions). 4 Mode applicability: `travelmudra_filed` ⇒ `government_submission` or `government_fee_payment`, and rev 2 (MON-01): `government_fee_payment` only when `core.feeCarryingAct(decl) = 'government_fee_payment'` (else `control_blocked` / `fee_act_not_declared`); `third_party_filed` ⇒ `provider_handoff`, and the declaration names an approved provider route with an owner-approval record ⇒ else `unavailable_parked` / `provider_route_unapproved`; `preparation_only` ⇒ `service_mode_not_applicable`. 5 Repeat rule: an act of this kind already `filed_evidenced` ⇒ `unavailable_parked` / `parked_repeat_external_act` [CCR-09] (OD-C4); any act `reconciliation_exhausted` ⇒ `reconciliation_exhausted_no_refiling`. 6 P5 `authorize_*`: protection; launch (`hold` under suspension hold or non-continuing withdrawal); binding; lifecycle `submitted`, outcome NULL, no accepted withdrawal; editor `assigned`, no hold; stage 8 `act_already_open`, `fee_payment_unknown`; stage 10 mandatory validations incl. `bytes_unavailable` and dependency prerequisites conditioning this action; stage 11 impact and travel recheck; `renewed_authority_pending`/`_declined`; `deferral_active` [CCR-09]; operator work started; stage 12 Gate 2 unless a commitment of the current attempt may have happened (rev 2, MON-03; 01 §2.11): `payment_received`, or the Gate 2 exception passes freshness and the readiness gate (`valid`, or the readiness exception for `previous_operator`). 7 `evidence_set_sha256` = SHA-256(canonical `{ snapshotId, documents.evidenceFingerprint, governing ids, readinessId, submissionId }`) equals `basisDigest` ⇒ else `stale_revision` / `authorization_basis_changed` [CCR-09]. 8 Fee-carrying act (rev 2, MON-01; 01 §7.4): `carries_fee = (actKind = core.feeCarryingAct(decl))`, where `decl.financialConditions.governmentFee = { payer: 'travelmudra', timing }` makes the fee act carry the fee for `timing = 'separate_act'` and the submission act for `timing = 'with_submission'`; `'no_government_fee'` ⇒ no act carries a fee. If `carries_fee`: `feeAmountPaise > 0`; `logical_effect_key = govfee:<app>:<attempt_ordinal>`; `payments.reserveExposure(…, servicePaymentStatus)` ⇒ may throw `control_blocked` / `exposure_ceiling_breach` (non-overridable, also after a Gate 2 exception) or `exposure_parked_paid_case_default_ceiling` (`unavailable_parked`). `governmentFee` unresolved ⇒ `declaration_item_unresolved`. A `feeAmountPaise` on an act that does not carry the fee ⇒ `validation_failed`. 9 Open-act partial unique index (CC-U). |
| Writes | `core_action_authorizations` `authorized` with every durable-acceptance field: actor (`authorized_by`, `assignment_id`), scope (`act_kind`, `attempt_ordinal`, `logical_effect_key`, `fee_amount_paise`), governing evidence (governing ids, `snapshot_id`, `evidence_set`, digest), authorization (`submission_id`, `renewed_authority_refs`, gate bases, readiness basis, `launch_decision_id`), protection (`protected_from_seq`), reconciliation owner (= actor). Exceptions consumed. Gate 2 exception with status not `payment_received` ⇒ `payments.openFinancialException(commitment_under_gate2_exception)`. Reservation (Payments). Application `revision + 1`. |
| Facts | `core.external_act_authorized` (after: all fields above); `core.gate_exception_consumed`; `pay.exposure_reserved`, `pay.financial_exception_opened`. |
| Tasks / notices | none. No task performs the act (B35); the operator acts manually. |
| Errors | `control_blocked`, `unavailable_parked`, `stale_revision`, `conflict_duplicate`, `outcome_unknown` |
| Concurrency | Authorization and reservation commit together or not at all (B28); a fault before commit leaves no authorization, no reservation and no consumed exception (01 T-F19). Nth retry replays; Payments reuses the reservation by logical effect key. New key for the same act ⇒ `act_already_open`. Lost acknowledgement: the page states "Not confirmed. Do not perform the act. Resubmit this form." A failed commit means no authorized act (B23). Competing mutators: withdrawal, holds, reassignment, travel-date edit (CC-A/CC-G); payment entry (CC-P); ceiling change and other authorizations of the same TA in any group (CC-X); baseline publication (offering head). |

Attempt ordinal [CCR-03, accepted with edit]: `attempt_ordinal = 1` for every act of the application's single government attempt (a repeat act after `filed_evidenced` is unavailable, step 5); a fresh authorization after `not_filed_evidenced` keeps the ordinal and reuses the reservation of the same logical effect. Gate 2 basis (rev 2, MON-03): `gate2_basis = 'same_attempt'` only when another act of the attempt is `authorized`, `filing_unknown`, `filed_evidenced` or `reconciliation_exhausted` (a government commitment may have happened); when every earlier act of the attempt is `not_filed_evidenced`, stage 12 evaluates Gate 2 again (current `payment_received` or a fresh Gate 2 exception).

#### CMD-X2 `ops.record_act_evidence`

| Aspect | Specification |
|---|---|
| Actor / action | asg who is the `reconciliation_owner_id`; `operator.record_act_evidence` |
| Input | `applicationId`, `authorizationId`, `fromState`, `result` (`filed_evidenced` \| `not_filed_evidenced` \| `filing_unknown`), `evidence[]`, optional `eventAt`, `feePaidPaise` (required for the fee-carrying act with `filed_evidenced`, rev 2) |
| Checks | 1 P1–P2. 2 Locks: application `FOR UPDATE`, authorization (CC-S on `fromState`). 3 Actor = `reconciliation_owner_id` ⇒ else `not_found_or_forbidden`. 4 Transition allowed: `authorized` → any of the three; `filing_unknown` → `filed_evidenced` / `not_filed_evidenced` ⇒ else `control_blocked` / `act_state_transition_invalid` [CCR-09]. 5 Evidence sufficiency: `filed_evidenced` and `not_filed_evidenced` need at least one `external_reference` or `document_version` (3.0.4); `filing_unknown` needs at least an `attestation`; else `control_blocked` / `act_evidence_insufficient` [CCR-09]. 6 Fee-carrying act (`carries_fee`, any kind; rev 2, MON-01) with `filed_evidenced`: `feePaidPaise > 0` (the exact government amount TM paid, B27). |
| Writes | `ops_act_evidence`. `core.recordExternalActEvidence`: act state, `state_changed_at`, `revision + 1`; `government_submission` `filed_evidenced` ⇒ application `government_attempt_no + 1`. Rev 2 (MON-01, BND-09, record 15 CCR-15-02): for the act with `carries_fee = true`, whatever its kind: `filed_evidenced` ⇒ `payments.recordTmFeePaid` (TA liability = paid amount); `filing_unknown` ⇒ `payments.recordFeePaymentUnknown`; `not_filed_evidenced` ⇒ `payments.recordFeeNotPaid` (fee back to `reserved`, reservation reusable). Held corrections resolved (3.2.1). |
| Facts | `ops.act_evidence_recorded`, `core.external_act_state_changed`, Payments facts, `core.correction_hold_resolved`, `ops.incident_opened` (post-filing correction). |
| Concurrency | CC-S on act state: two evidence records race ⇒ one wins, the other `stale_revision`. Timeout, payment, handoff, courier receipt, reassignment and elapsed time never change act state; only this command and CMD-X3/X4 do (B23). Known receipt is filing even if progress stalls. |

#### CMD-X3 `ops.record_reconciliation_attempt`

| Aspect | Specification |
|---|---|
| Actor / action | reconciliation owner (asg); `operator.record_reconciliation` |
| Input | `applicationId`, `authorizationId`, `method`, `result`, `evidence[]`, `note`, optional `conclude` (`filed_evidenced` \| `not_filed_evidenced`) |
| Checks | 1 P1–P2. 2 Locks as CMD-X2. 3 Act `authorized` or `filing_unknown`. 4 `result` `filed_found`/`not_filed_found` requires `conclude` with the matching value and CMD-X2 evidence sufficiency. |
| Writes | `ops_reconciliation_attempts`; with `conclude`, the CMD-X2 writes in the same transaction and `concluded_evidence_id`. |
| Facts | `ops.reconciliation_attempt_recorded` (+ CMD-X2 facts) |
| Concurrency | CC-S on act state when concluding. |

#### CMD-X4 `core.authorize_unresolved_completion`

| Aspect | Specification |
|---|---|
| Actor / action | SA; `outcome.authorize_unresolved` |
| Input | `applicationId`, `_rev`, `futureOwnerAccountId`, `_reason` (≥ 20) |
| Checks | 1 P1–P2. 2 Lock application, then all its authorizations. 3 P4. 4 Outcome NULL. 5 At least one act `filing_unknown`; no act `authorized` ⇒ else `control_blocked` / `act_state_transition_invalid`. 6 Each `filing_unknown` act has ≥ 1 reconciliation attempt with result `no_information` or `inconclusive` ⇒ else `control_blocked` / `reconciliation_attempt_missing` [CCR-09]. 7 Future owner: active operator or SuperAdmin with MFA. |
| Writes | Every `filing_unknown` act ⇒ `reconciliation_exhausted`, `future_owner_id`, `exhausted_by`, `exhausted_reason`, `unresolved_notice_id`. Outcome `external_outcome_unresolved`, `outcome_at`. Dependents are not failed (I-C3). |
| Facts | `core.unresolved_completion_authorized` (attempt ids, reason, future owner), `core.external_act_state_changed`, `core.outcome_recorded` |
| Tasks / notices | TA notice `external_outcome_unresolved` (`ack_required = false`; states that the government result is unknown and that no refiling is implied). |
| Concurrency | CC-A. The outcome never grants refiling: later same-service attempts and new authorizations are refused (`reconciliation_exhausted_no_refiling`). B24 completion prerequisites still apply (E4–E6). A later official fact follows CMD-OC1's follow-up path. |

### 3.10 Preparation-only packet and handover (B04)

| Command | Actor / action | Checks (after P1–P4) | Writes / facts / notices |
|---|---|---|---|
| CMD-P1 `ops.request_packet_build` | asg; `operator.build_packet` | mode `preparation_only` (`service_mode_not_applicable`); P5 `start_operator_work`; editor `assigned`; every mandatory requirement `satisfied` (stage 10 codes); no packet `building` (Delivery unique) | `delivery.requestPacketBuild(applicationId, versionIds, requestedBy)` [CCR-13] enqueues `delivery.build_packet` (on behalf of the operator); `ops_work_steps` `_packet_build_requested`; fact `ops.work_step_recorded` |
| CMD-P2 `core.release_packet` | asg; `operator.release_packet` | Locks as CMD-X1 (no exposure). P5 `release_packet`: protection, launch, binding, lifecycle `submitted`, outcome NULL, editor `assigned` and no hold, mandatory validations, impact, `renewed_authority_*`, `deferral_active`, readiness gate (`valid` or `previous_operator` exception). Packet `built`, `built_from` equals the current evidence set (`packet_stale`), packet `sha256` equals the one in the readiness basis. `UNIQUE (application_id)` on releases. | `core_packet_releases`; `delivery.markPacketReleased(packetId)` [CCR-13]; exception consumed; facts `core.packet_released` [CCR-08], `core.gate_exception_consumed`; TA notice `generic_case_update` (`params.kind = 'packet_available'`) |
| Handover (Delivery `dlv.record_handover`, kind `packet`) | asg (Delivery command) | Delivery evidence: TA retrieval record or a recorded physical handover to the owning TA | Delivery calls `core.recordOutcomeFromEvidence('prepared_and_handed_over')`; fact `core.outcome_recorded` |

Rules: the packet goes only to the owning TA (B04, B31). Preparation-only holds no originals (CMD-OR1 refuses) and claims no government result (CMD-OC1 refuses). A packet handover never satisfies a dependency that requires a government result (B22). Rev 2 (COV-03, BND-10): CMD-P1 and CMD-P2 are the only build and release commands; Delivery's former `dlv.build_packet` and `dlv.release_packet` do not exist; Delivery owns the build task, the packet bytes, `dlv_packets` state and handover records. Rev 2 (BND-03): ordinary withdrawal of a **submitted** preparation-only application is unavailable before and after packet release while the offering's cut-off is unresolved (`withdrawal_cutoff_undeclared`, B24, B44); packet release is not a cut-off; post-handover policy stays `parked_preparation_post_handover`.

### 3.11 Outcomes and dependencies (B21, B22)

#### CMD-OC1 `ops.record_official_result`

| Aspect | Specification |
|---|---|
| Actor / action | asg; `operator.record_outcome` |
| Input | `applicationId`, `_rev`, `outcome` (`issued` \| `refused`), `evidence[]` (≥ 1 `external_reference` or `document_version`), `eventAt`, optional `artifact { blobId, artifactType }` |
| Checks | 1 P1–P2. 2 Lock application. 3 P4. 4 Mode: `travelmudra_filed` needs a `government_submission` act `filed_evidenced`; `third_party_filed` needs `provider_handoff` `filed_evidenced`; an act still `authorized`/`filing_unknown` ⇒ `control_blocked` / `filing_not_evidenced` [CCR-09] (record the filing evidence first; the result itself MAY be that evidence); `preparation_only` ⇒ `service_mode_not_applicable`. 5 Outcome NULL; or outcome `external_outcome_unresolved` ⇒ follow-up path. 6 Evidence sufficiency (3.0.4). 7 Artifact: type declared in `decl/1 outcomeEvidence.artifactTypes` (rev 2, contract 01 §9.2). |
| Writes | Normal path: `core.recordOutcomeFromEvidence` (outcome, `outcome_at`, `revision + 1`, dependent evaluation 3.11.3). Artifact: `documents.registerVersion(source = operator_artifact_upload, group of the application)` and `ops_artifacts` (`pending_review`, `withheld_pending_review`). Follow-up path: outcome unchanged; artifact recorded; `operations.openIncident(official_fact_follow_up, owner = future_owner_id, dedupe = official_fact:<aut>:<xev or art>)`. |
| Facts | `core.outcome_recorded`, `ops.artifact_recorded`, `doc.version_registered`, `ops.incident_opened` |
| Tasks / notices | none. The result-delivery notice and document email belong to the B46 delivery-send boundary; this command posts neither. The TA sees the outcome on its application page. |
| Concurrency | CC-A; outcome set once (conditional `WHERE outcome IS NULL`). |

#### CMD-OC2 `core.record_outcome` (`cancelled` only)

asg; `operator.record_outcome`. Available only when `decl/1 cancellation` declares a path that is supported, which for a declared path requires an owner approval listing the item (rev 2, BND-04; contract 01 §9.2 G); otherwise `unavailable_parked` / `cancellation_undeclared` (B21, B44: no invented cancellation eligibility). Checks: outcome NULL; confirmed unfiled or declared evidence that the authority cancelled; evidence per the declared path. Writes outcome `cancelled`; dependent evaluation. Fact `core.outcome_recorded`.

#### 3.11.3 Dependency evaluation (internal, in the transaction that changes an upstream)

Triggers: an outcome recorded on an upstream (`recordOutcomeFromEvidence`, CMD-OC2, withdrawal acceptance, `dependency_failed` cascade); rev 2 (MON-06): an outcome **corrected** on an upstream (CMD-SA1), in the same transaction and under the same locks; an artifact becoming eligible or ineligible on an upstream (`core.noteUpstreamArtifactChanged` [CCR-13], called by Operations); link creation (CMD-D5).

1. Read the dependent set without locks. Lock the upstream and every dependent application `FOR UPDATE` in ascending id order. Re-read the dependency rows under lock. If the set changed, raise a serialization failure (the runner retries the whole command).
2. For each `waiting`/`unmet_missing_evidence` dependency, and (rev 2, MON-06) for each `met` dependency when the trigger is an outcome correction or an artifact change:

| Upstream condition | New state | Dependent effect |
|---|---|---|
| outcome = `required_outcome`, and either no artifact required or an eligible artifact of `required_artifact_type` exists | `met`, `met_artifact_version_id` = exact version | readiness basis changes |
| outcome = `required_outcome`, required artifact missing or not eligible | `unmet_missing_evidence` | not terminal; owner per pending row 20 (B22) |
| outcome final and ≠ `required_outcome` (`issued`, `refused`, `withdrawn`, `cancelled`, `dependency_failed`, `prepared_and_handed_over`) | `failed_incompatible` | dependent confirmed unfiled (2.3.2), outcome NULL, no accepted withdrawal ⇒ outcome `dependency_failed` in the same transaction, then evaluate its own dependents (depth ≤ 16). Otherwise (filed, filing unknown, exhausted) ⇒ no outcome; protection and reconciliation continue; owner = assigned operator, or SuperAdmin when unassigned. |
| outcome `external_outcome_unresolved` | unchanged (`waiting`) | not final for dependencies (I-C3) |
| rev 2 (MON-06): stored `met`, upstream outcome corrected to a final incompatible outcome | `failed_incompatible` | dependent confirmed unfiled ⇒ outcome `dependency_failed`; dependent filed or filing unknown ⇒ protection kept and an owned `official_fact_follow_up` incident opens (owner: assigned operator, else SuperAdmin) |
| rev 2 (MON-06): stored `met`, required artifact no longer eligible | `unmet_missing_evidence` | not terminal; owner per pending row 20 |

3. Facts: `core.dependency_state_changed` per changed row; `core.outcome_recorded` per `dependency_failed`.

Siblings without a declared relationship are never evaluated (B22: shared capacity or originals do not propagate outcomes). The control evaluator re-derives dependency prerequisites from authoritative upstream rows at every use; the stored state is for display and the guard order only.

#### Writer `core.recordOutcomeFromEvidence` (called by Operations and Delivery)

Locks the application `FOR UPDATE`. Requires outcome NULL (conditional update). `issued`/`refused` require the evidenced act of CMD-OC1 step 4. `prepared_and_handed_over` requires mode `preparation_only`, a `core_packet_releases` row and a handover record id in the evidence. Writes outcome and runs 3.11.3. Fact `core.outcome_recorded`.

### 3.12 Withdrawal and cut-offs (B24, B23, B18)

| Aspect | `core.request_withdrawal` (W1) | `core.record_applicant_withdrawal` (W2) | `core.record_operational_withdrawal` (W3) |
|---|---|---|---|
| Actor / action | TA owner; `application.request_withdrawal` | asg; `operator.record_applicant_withdrawal` | SA; `withdrawal.record_operational` |
| Input | `applicationId`, `_rev`, `note` | + `evidence[]` (applicant request through the operator) | + `evidence[]`, `_reason` |
| Eligibility (rejected, nothing written) | editor `unassigned` or `returned_to_ta` (else `awaiting_formal_return`); protection mark; lifecycle open; outcome NULL | evidence sufficiency ⇒ else `withdrawal_evidence_missing` [CCR-09]; outcome NULL | evidence + reason; outcome NULL |

Common steps after eligibility: lock application `FOR UPDATE`; P4; then the assessment, recorded either way:

| Assessment | Result |
|---|---|
| Any act `authorized`, `filing_unknown` or `reconciliation_exhausted` | refused `filing_possibly_occurred` (B23: no ordinary withdrawal while filing may have occurred) |
| Lifecycle `draft` | accepted (no external act can exist on a draft; I-C1) |
| `travelmudra_filed` and electronic custody: `government_submission` `filed_evidenced` | refused `withdrawal_cutoff_passed` (evidenced government-portal submission, B24) |
| Rev 2 (BND-03): `preparation_only` (any packet state), or any other offering whose `decl/1 controls.withdrawalCutoff` is undeclared, `unresolved` (`parked_prep_only_cutoff`) or not owner-approved | refused `withdrawal_cutoff_undeclared` (category `unavailable_parked` when it is the only blocker; B24, B44). After packet release the page additionally names `parked_preparation_post_handover` |
| Other offering: declared cut-off evidence recorded (act evidence or work step of the declared kind) | refused `declared_cutoff_passed` |
| otherwise | accepted |

| Result | Writes | Facts | Notices |
|---|---|---|---|
| accepted | `core_withdrawals` `accepted` (CC-U); application outcome `withdrawn`, `withdrawal_id`, `outcome_at`; lifecycle unchanged; 3.11.3 for dependents | `core.withdrawal_requested`, `core.withdrawal_accepted`, `core.outcome_recorded` | TA `withdrawal_decision`; staff notice to the assigned operator |
| refused | `core_withdrawals` `refused` with `reason_code` and `cutoff_assessment` | `core.withdrawal_requested`, `core.withdrawal_refused` | TA `withdrawal_decision` |

A refused assessment is an accepted command: the request is a real fact and is kept (B33). Accepted withdrawal stops new filing (stage 6 `withdrawal_accepted` blocks every authorization; no gate exception overrides it, so payment cannot force it, B07). It preserves history, originals, money and remaining duties; no command reverses it (SA1 refuses `withdrawn`). After a cut-off, a remedy is an owned incident (IN1), not an ordinary withdrawal. Concurrency: withdrawal vs authorization both lock the application `FOR UPDATE`; whichever commits first decides; `UNIQUE … WHERE state = 'accepted'` backs the race.

### 3.13 Deferral (B21)

| Command | Actor / action | Checks (after P1–P4) | Writes / facts / tasks / notices |
|---|---|---|---|
| CMD-DF1 `core.propose_deferral` | asg; `operator.propose_deferral` | lifecycle `submitted`; outcome NULL; no open act (`filing_possibly_occurred`); justification ≥ 20 chars; `proposedReviewOn > today` (Asia/Kolkata); unique open deferral (CC-U) | `core_deferrals` `proposed`; `core.deferral_proposed`; SA queue staff notice |
| CMD-DF2 `core.decide_deferral` | SA; `deferral.decide` | deferral `proposed` (`approve`/`decline`) or `approved` (`extend`); `reviewOn > today`; `_reason` | `approve`/`extend` ⇒ `approved`, `review_on`, TA notice `deferral` (`ack_required = false`), task `core.deferral_review_due` [CCR-06] with `notBefore` = 00:00 Asia/Kolkata on `review_on`, dedupe `core.deferral_review_due:<dfr>:<review_on>`; `decline` ⇒ `declined`. Facts `core.deferral_approved` / `core.deferral_declined` |
| CMD-DF3 `core.end_deferral` | asg or SA; `deferral.end` [CCR-10] | deferral `approved` (CC-S) | `ended`; `core.deferral_ended`; TA notice `generic_case_update` |

An approved deferral blocks authorization and packet release with `deferral_active` (consistency guard: the case cannot be both deferred and filed). It blocks nothing else. Monitoring: pending rows 18–19 and the unowned-wait queue (Section 4.3).

### 3.14 Completion: evidence and the B46 pending boundary

No product route, event or task starts a completion check (B46). The evidence (2.3.4) and the pending rows 28–30 are built. The check exists only as a harness command.

#### CMD-C1 `core.check_completion` (harness only)

| Aspect | Specification |
|---|---|
| Actor / action | `harness` actor [CCR-07]; registered only when `env ∈ {test, local_test}`; command name in facts `harness.core.check_completion`; `completion.check` stays `unavailable_known_limitation` for every product actor |
| Input | `applicationId`, `_rev` |
| Checks | 1 Locks: application `FOR UPDATE`; artifacts `FOR SHARE`; `pay_application_state` `FOR SHARE`. 2 P4. 3 Lifecycle open. 4 E1–E7 (2.3.4; E7 rev 2, MON-09), all blockers collected ⇒ `control_blocked`. |
| Writes | `core_completions` (`completed`, outcome, `basis` with evidence ids, `actor_kind = 'harness'`); application `lifecycle = 'completed'`, `completion_id`, `editor_state = 'unassigned'`; active assignment `ended` (`ended_reason = 'completed'`). |
| Facts | `core.completion_checked` (evidence ids per prerequisite), `core.completed`, `core.assignment_ended` |
| Concurrency | CC-U `core_completions UNIQUE(application_id)`; conditional lifecycle update. Open incidents and financial exceptions survive completion (B25, B29). |

### 3.15 Official artifacts and association (B13)

| Command | Actor / action | Checks (after P1–P4) | Writes / facts |
|---|---|---|---|
| CMD-AR1 `ops.record_artifact` | asg (open application) or incident owner/reviewer with `incidentId` (also after completion); `operator.record_artifact` | mode ≠ `preparation_only`; `artifactType` declared; optional `replacesArtifactId` names an artifact of the same application and type, locked `FOR UPDATE` | `documents.registerVersion`; `ops_artifacts` `pending_review` / `withheld_pending_review`; replaced artifact ⇒ `noncurrent`, `replaced_by` (earlier eligibility ends at commit). Facts `ops.artifact_recorded`, `ops.artifact_eligibility_changed`; `core.noteUpstreamArtifactChanged` |
| Writer `operations.evaluateArtifactAssociation` [CCR-13, accepted with edit] | rev 2 (BND-13): registered in `compose.ts` as a Documents **settled listener**; Documents' `doc.parse` record step notifies it for every version with `purpose = 'official_result'` in the same transaction (no import cycle). It also runs when such a version settles as `extraction_failed`, `safety_rejected` or `check_exhausted` | see automatic rule below; **fail closed**: whenever the rule cannot run (no extraction, failed tool, no candidate data) or does not verify, the artifact stays `pending_review`/`conflict` and an owned `artifact_association` incident opens in the same transaction | verified ⇒ `association_status = 'verified'`, `application_id` set, `eligibility = 'eligible'`, metadata; else `pending_review`/`conflict` and `openIncident(artifact_association)`. Facts `ops.artifact_association_confirmed` or `ops.incident_opened` |
| CMD-AR2 `ops.confirm_artifact_association` | incident owner or reviewer (rev); `incident.work` | incident open; artifact `pending_review`/`conflict` (CC-S); `chosenApplicationId` ∈ candidates ∪ {uploaded-for}; chosen application in the artifact version's group (else `validation_failed` / `artifact_cross_group` [CCR-09]); `verified { surname, passportNumber, type }` all true; no other eligible artifact of the type (else `artifact_type_already_eligible` [CCR-09]; use replacement) | artifact verified/eligible with manual-basis metadata (reviewer id, fields checked, extraction verdict id); incident `resolved` with that evidence. Facts `ops.artifact_association_confirmed`, `ops.incident_resolved`, `core.noteUpstreamArtifactChanged` |
| CMD-AR3 `ops.reject_artifact_association` | same | artifact not `blocked` | `association_status = 'rejected'`, `eligibility = 'withheld_wrong'`; incident `awaiting_evidence`. Fact `ops.artifact_eligibility_changed` |
| CMD-AR4 `ops.assign_incident_reviewer` | SA; `incident.assign_reviewer` | incident open; the incident's application has no active assignment or its operator is inactive (B13); reviewer is an active MFA operator; `_reason` | `reviewer_account_id`, `owner_kind = 'reviewer'`, `assigned`. Fact `ops.incident_assigned`. The reviewer gets relation `rev` only: artifact and minimal candidate identifiers; no Gate 1, no case action, no filing authority (01 I-07) |
| Review copy (rev 2, SEC-02) | incident owner, named reviewer, or the assigned operator of `uploaded_for_application_id`; `document.retrieve_for_review` | artifact `pending_review`/`conflict`, not `blocked`/`noncurrent`; no `wrong_recipient_disclosure`/`bytes_integrity` incident on the version | Delivery `dlv.retrieve_for_review` streams the version through `checkRelease` channel `staff_review` (01 §6.9); one `dlv_releases` row per copy with the incident id. This is how the reviewer looks at the artifact before CMD-AR2 attests surname, passport number and type; it is never TA delivery or completion evidence |

Automatic association rule `assoc/1` (all MUST hold; stored in `association_metadata` with rule version, extraction verdict id, version `sha256`, per-field match booleans and the candidate ids evaluated):

Inputs (rev 2, BND-13): `documents.artifactExtraction(version)` returns `{ status, passportNumberCandidates[], nameTokens[], mrz? }` from the `artifact_tokens` plan (record 14 §5.6); B13 requires extracted matching **name and passport number**, so the rule uses exactly those.

1. The artifact extraction status is `extracted` (the job ran and returned at least one passport-number candidate); otherwise secondary review.
2. Classified type equals the declared `artifact_type` (declared in `decl/1 outcomeEvidence.artifactTypes`).
3. Candidate set = applications of the same TA and offering whose current snapshot passport number equals a `passportNumberCandidates` entry (issuing country taken from the candidate's applicant key, or from `mrz.issuingState` when an MRZ was read and then it MUST match), lifecycle open, with a `government_submission` or `provider_handoff` act `filed_evidenced`, and no eligible artifact of this type.
4. Exactly one candidate, and it is `uploaded_for_application_id`.
5. Every normalized surname token and every given-name token of the candidate snapshot is present in `nameTokens` (or, with an MRZ, equals the MRZ name fields).
6. No contradictory strong identifier: a second, different passport-number candidate that matches another open application of the TA, or an MRZ date of birth or nationality that differs from the snapshot, fails the rule.

Any failure ⇒ secondary review: incident `artifact_association`, owner = assigned operator of the uploaded-for application, or SuperAdmin when none is active (dedupe `artifact_association:<art>`). Final delivery uses only this stored metadata; no new OCR or LLM run is made at release (B13). `issued` with a missing or wrong artifact keeps the outcome, withholds delivery (E3) and keeps next action `resolve_incident` (pending row 26).

### 3.16 Wrong-recipient disclosure (B13)

| Command | Actor / action | Checks (after P1–P4) | Writes / facts / notices |
|---|---|---|---|
| CMD-DS1 `ops.report_wrong_recipient` | asg of the application through which the release happened, or SA; `incident.report_disclosure` [CCR-10] | `documentVersionId` and `throughApplicationId`; evidence names Delivery records (release ids, email send ids) of that version whose recipient is not entitled; records exist (else `incident_evidence_insufficient` [CCR-09]); locks: artifact and version `FOR UPDATE` | incident `wrong_recipient_disclosure` (dedupe `disclosure:<dov>`), `affected` = the named release ids, email ids, recipient TA ids and the owning TA id, `required_evidence = ['correction', 'notice:<each affected TA>']`, owner = assigned operator of `throughApplicationId` or SA; `documents.blockVersion`; artifact `eligibility = 'blocked'`. Facts `ops.incident_opened`, `doc.version_blocked`, `ops.artifact_eligibility_changed`. Known retrieval and recipient records stay unchanged (Delivery rows are append-only) |
| CMD-DS2 `ops.post_disclosure_notice` | incident owner or SA; `incident.work` | recipient TA ∈ `affected`; variant `deletion_request` (wrong recipient) or `disclosure_information` (owning TA) | `delivery.postNotice(disclosure_correction, params = { incidentId, variant, releaseRefs })`, `ack_required = true` for `deletion_request`; `notice_ids` appended. Fact `ops.incident_evidence_recorded`. Message codes say "please delete"; they never say "recalled" or "removed" (no recall claim, B13, B45) |
| CMD-DS3 `ops.record_incident_evidence` | owner, reviewer or SA; `incident.work` | evidence refs valid (3.0.4) | `evidence` appended; state `awaiting_evidence` ⇄ `assigned`. Fact `ops.incident_evidence_recorded` |
| CMD-DS4 `ops.resolve_incident` / `ops.close_incident` | owner or SA; `incident.resolve` | every `required_evidence` code satisfied: `correction` = an eligible replacement artifact on the misassociated application, or an `AR3` rejection plus evidence that no artifact is owed; `notice:<ta>` = a posted notice id to that TA ⇒ else `control_blocked` / `incident_evidence_insufficient`. Allowed after application completion | `resolved` (then `closed`). Facts `ops.incident_resolved` / `ops.incident_closed` |

Applicant, regulator and legal notices have no command. The incident page shows them as `unavailable_owner_decision` / `compliance_notice_unselected` [CCR-09] (B13). A blocked version stays blocked; a correction always uses a new version.

### 3.17 Physical originals (B30, B24)

| Command | Actor / action | Checks (after P1–P4) | Writes / facts |
|---|---|---|---|
| CMD-OR1 `ops.record_original_receipt` | asg; `operator.record_custody` | application custody path `physical` declared (`custody_path_not_declared` [CCR-09]); mode ≠ `preparation_only` (`preparation_only_holds_no_originals` [CCR-09]); lifecycle open; `itemKey` unique in group (CC-U ⇒ `conflict_duplicate` / `original_already_recorded`); `parts[]` ≥ 1; `receivedParts ⊆ parts`; `possessionAttested = true` by the actor (scan, parcel label or courier receipt alone is refused: `custody_evidence_missing`) | `ops_originals`, `ops_original_parts` (received ⇒ `held` with holder; others `expected`), link to the application, movement `receipt`. Fact `ops.original_received` |
| CMD-OR2 `ops.link_original` | asg of the target application; `operator.record_custody` | same group; target declares physical path; not preparation-only; every existing link's application is assigned to the actor ⇒ else `unavailable_parked` / `parked_custody_route_policy` (cross-operator shared items, B30) | `ops_original_links`. Fact `ops.original_linked` [CCR-08]. A link grants no view of another operator's application |
| CMD-OR3 `ops.record_original_movement` | asg of every linked application; `operator.record_custody` | kind `receipt` (further parts; `possessionAttested`), `partial_movement` (subset of parts to `courier`/`authority`/`tm_person`/`tm_office`), `holder_update`; `toHolder.kind = 'unknown'` requires `uncertainty` text; loss or damage marking has no option (PARKED) | movement row; part states and holders; aggregate state; holder `unknown` ⇒ `openIncident(custody_discrepancy)`. Fact `ops.original_moved` |
| CMD-OR4 `ops.record_original_return` | asg of every linked application; `operator.record_custody` | rev 2 (CCR-15 accepted with edit): every linked application's governing declaration has a **supported, owner-approved** `originals.returnPolicy` (01 §9.2), and, when more than one application is linked, its `sharedItemReturn = 'all_linked_applications'` ⇒ else `unavailable_parked` / `parked_custody_route_policy`; recipient = owning TA account (B31 recipient rule); evidence kinds match the declared policy; parts ⊆ held parts | movement `return`, `recipient`; returned parts `returned`; remaining parts keep their hold (partial return). Fact `ops.original_returned` |

`operations.custodyState(application)`: `heldOriginals` = parts not `returned` across linked originals (states `received`, `held`, `in_transit`, `expected` after any receipt); `uncertain` = parts `unknown`; `returnAvailable` = the CMD-OR4 availability check. Assignment, reassignment, withdrawal or closure of one application never changes custody rows or another application's duty (B19, B30).

### 3.18 Operational incidents and failure classification (B34, B36, B33)

| Command | Actor / action | Checks | Writes / facts |
|---|---|---|---|
| CMD-IN1 `ops.open_incident` | asg (application-scoped kinds `operational_failure`, `custody_discrepancy`, `post_filing_correction`) or SA (any kind incl. `country_defect`); `incident.open` [CCR-10] | scope refs readable by the actor; kind allowed for the actor | `ops_incidents` `open` (dedupe `manual:<inc>`); for `operational_failure`/`country_defect` an initial classification `unresolved`. Facts `ops.incident_opened`, `ops.failure_classified` |
| CMD-IN2 `ops.classify_failure` | SA; `failure.classify` [CCR-10] | `scope = 'shared'` requires `originComponent` ∈ shared capabilities (`passport`, `upload`, `authentication`, `payment_check`, `configuration`, `kernel`, `worker_runner`, `database`) and evidence naming that component; evidence that only shows a shared host or a shared process interruption is refused (`failure_scope_evidence_missing` [CCR-09]); `scope = 'local'` requires `countryId` (country-origin defects stay local even when they interrupted the shared process, B36); `unresolved` needs only a reason | new current classification; old `is_current = false`. Fact `ops.failure_classified` |
| CMD-EF1 `ops.record_effort_sample` (rev 2, COV-10, record 15 CCR-15-15) | asg for `party = 'operator'` on its own work (`operator.record_effort_sample`); SA for `party ∈ {ta, partner}` observations (`effort.record_observation`, `_reason`) | application readable by the actor; `step_code` ∈ declared `progressMapping` codes or `_whole_case`; exactly one of `minutes` (0–10 000) or `missing_reason` (`not_measured`, `party_declined`, `not_observable`); `sampling_basis`, `source` closed values | `ops_effort_samples` row (append-only); fact `ops.effort_sample_recorded`. Feeds measure M-06 with sample size and missing share (B32); missing effort is never zero |

Classification is evidence for measures and launch decisions. It gates nothing automatically. Projection outage (B33): Core and Operations commands read only authoritative tables, so case processing continues while a projector is stalled; queue pages fall back to authoritative queries and show a "projection lagging" banner.

### 3.19 SuperAdmin evidence correction, transitions and protection marks

| Command | Actor / action | Checks (after P1–P4) | Writes / facts |
|---|---|---|---|
| CMD-SA1 `core.correct_from_evidence` | SA; `application.correct_from_evidence` | `_reason`; ≥ 1 non-attestation evidence; field changes follow the stage rule 3.2.1 and, for identity fields, the same-person rule; the same validations as the TA path (no bypass). Outcome correction: outcome present; from and to ∈ {`issued`, `refused`}; lifecycle open; no accepted or synthetic-accepted email and no artifact retrieval for the application; no dependent failed by the old outcome ⇒ else `control_blocked` / `outcome_correction_not_allowed` [CCR-09] (then an owned incident). Rev 2 (MON-06): an accepted outcome correction runs dependency evaluation 3.11.3 for every dependent in the same transaction, including dependencies stored `met`. `withdrawn`, `dependency_failed`, `external_outcome_unresolved` and `prepared_and_handed_over` are never corrected | snapshot + correction `superadmin_evidence`, `material_revision + 1`; or outcome update with before/after. Facts `core.superadmin_evidence_correction` / `core.outcome_corrected`. Staff notice to the assigned operator (readiness must be reconfirmed). The SA never records readiness or files |
| CMD-SA2 `core.decide_transition` | TA owner; `application.decide_transition` | transition `awaiting_ta_authority`; editor permits TA (else `awaiting_formal_return`); no open act (held otherwise, B23) | `applied` ⇒ governing ids switch, snapshot cause `transition`, `material_revision + 1`; `declined` ⇒ item stays an owned hold. Facts `core.structural_transition_applied` / `core.continuation_recorded` |
| CMD-SA3 `core.resolve_protection_mark` | SA; `protection_mark.resolve` | mark `active`; evidence; `_reason`; installation open | `resolved`. Fact `core.protection_mark_resolved` |

### 3.20 Writers exported to other owners

| Writer | Caller | Contract |
|---|---|---|
| `core.acceptIntakeProposals` (rev 2, record 14 CCR-06) | Intake | Section 3.2 |
| `core.applyIntakeCorrection` (rev 2) | Intake | Section 3.2 |
| `core.noteEvidenceChanged` | Documents | lock application; `material_revision + 1`, `revision + 1`. The calling Documents command's fact records the cause (rev 2: no `external_evidence` dependencies exist) |
| `core.recordContinuation` (rev 2, record 12 CCR-07, COV-09) | Catalogue (`catalogue.impact_recheck`, C13) | lock application; conditional on governing = `from`, lifecycle open, no act `authorized`/`filing_unknown`/`reconciliation_exhausted`; set governing = `to`, `material_revision + 1`; fact `core.continuation_recorded`. Invariant: `core_submissions` and every `core_price_records` row stay unchanged — the quoted price fixed at submission is kept (B17); only `reduction_auto` and an accepted increase change the effective price |
| `core.openStructuralTransition` (rev 2) | Catalogue (C14) | lock application; same conditions; `core_transitions` `applied` (fact `core.structural_transition_applied`) or `awaiting_ta_authority` (fact `core.structural_transition_proposed`, TA notice); CMD-SA2 decline appends `core.structural_transition_declined`; price invariant as above |
| `core.proposePriceIncrease` (rev 2) | Catalogue (recheck, `mistaken_price` publications) | writer form of CMD-S2 (cause `mistaken_price` only); returns `already_open` on the open-increase index and `not_higher` when the price is not higher; TA notice `ack_required = true` |
| `core.setApplicantKey` (rev 2, MON-04) | Core internal (D1, D3, A3, SA1, intake correction) | Section 3.2.2 |
| `core.recordExternalActEvidence` | Operations (CMD-X2, X3) | Section 3.9 |
| `core.recordOutcomeFromEvidence` | Operations, Delivery | Section 3.11 |
| `core.noteUpstreamArtifactChanged` [CCR-13] | Operations | re-run 3.11.3 for dependents of that application |
| `core.applyBaselinePriceReduction` | Catalogue | Section 3.3 |
| `core.recordProtectionMark` | `tm restore mark` (engineering) | 01 §6.4 unchanged |
| `operations.openIncident` | Core, Documents, Delivery | idempotent by `dedupe_key` (unique column) |
| `operations.transferApplicationDuties` [CCR-13] | Core (CMD-AS3) | moves incidents owned by the old operator for that application; facts `ops.incident_assigned` |
| `operations.evaluateArtifactAssociation` [CCR-13] | Documents (`doc.parse` record) | Section 3.15 |

Queries exported (CoreApi additions [CCR-13]; rev 2 per 01 §6.4): `completionEvidence(tx, id)` (2.3.4, E1–E7), `groupEndEligibility` (5.1), `pendingOnAction` (2.3.3), `currentPrice(tx, id)`, `estimateAndForecast(tx, id)`, `operatorDuties(tx, accountId)` (record 11 CCR-09), `openApplicationsForOffering(tx, offeringId, afterId, limit)` (record 12 CCR-07), `applicantIdentity(tx, id)` (record 14 CCR-06c), pure `feeCarryingAct(decl)`. OperationsApi uses 01 §6.7 plus `custodyState` as defined in 3.17 and `incidentsOwnedBy(tx, accountId)` (record 11 CCR-09).

## 4. Queries, pages and routes

All routes follow 01 §12: server-rendered, `noindex`, `Cache-Control: no-store`; every `POST` carries session, CSRF, Origin check, `_op`, and the `_rev` fields listed per command; every route declares its `Action` and resource resolver. Pages compute availability with the `can*` helpers in a read transaction; a page result never authorizes (01 §8.1). Every unavailable control is rendered as a disabled control with its reason message (closed code), never hidden silently. `not_found_or_forbidden` uses the single 404 page.

### 4.1 TA surface (`/ta`)

| Path | Method | Action / authorization | Shows |
|---|---|---|---|
| `/ta/groups` | GET | `group.read` list, scope TA | own groups: country, label, travel dates with "dates in India time (Asia/Kolkata)", state, open application count |
| `/ta/groups/new`, `/ta/groups` | GET, POST | `group.create` | form → CMD-G1 |
| `/ta/groups/:groupId` | GET | `group.read` own | group header; applications with progress meaning, outcome, pending owner/action; close availability (`group_has_open_applications`, `group_intake_incidents_open`); group-end basis text: "Unpaid applications with no TravelMudra work end with the group after the return date" |
| `/ta/groups/:groupId/travel-dates` | POST | `group.edit_travel_dates` | CMD-G2 |
| `/ta/groups/:groupId/close` | POST | `group.close` | CMD-G3 |
| `/ta/groups/:groupId/applications/new` | GET | `application.create_draft` | individual form: selectable offerings only (`canSelectOffering`); later-attempt declaration fields shown only when a closed prior exists. Rev 2 (B14, BND-11): the form posts to `POST /ta/groups/:groupId/intake/individual` (`intake.start_individual`, record 14 C-I1), which calls `core.acceptIntakeProposals`; there is no `POST /ta/groups/:groupId/applications` route |
| `/ta/applications` | GET | `application.read` list, scope TA | own applications (search via the same predicate) |
| `/ta/applications/:id` | GET | `application.read` own | lifecycle, outcome, progress meaning, pending owner/action (2.3.3); editor sub-state with the TA's permitted actions (01 §2.9); submission record with each confirmation item as given, or "Authority/consent confirmation: not given" before submission; price history: quoted, current effective, open increase, reductions; "Price reduction after payment: adjustment/refund decision unavailable (`unselected_refund`)"; original estimated window and, separately, the current forecast, both labelled "guidance, not a guarantee"; timing notices; holds; assistance state; withdrawal record; dependencies with states and owners; documents metadata; eligible artifacts; delivery evidence panel with B46 states (`delivery_send_trigger_unselected`, `completion_check_trigger_unselected`, `uncertain_email_handling_unselected`); TA history projection |
| `/ta/applications/:id/edit`, `…/identity-correction` | GET/POST | `application.edit_draft`, `application.correct_identity` | CMD-D2, CMD-D3; disabled with `awaiting_formal_return` on an assigned case |
| `/ta/applications/:id/submit` | GET/POST | `application.submit` | confirm page: price, window, declared confirmation items with text version; CMD-S1 |
| `/ta/applications/:id/request-assistance` | POST | `application.request_assistance` | CMD-A1 |
| `/ta/applications/:id/report-problem` | POST | `application.report_problem` | CMD-H1; the page states "A report changes no application data" |
| `/ta/applications/:id/hand-back` | POST | `application.hand_back` | CMD-H3 |
| `/ta/applications/:id/request-withdrawal` | POST | `application.request_withdrawal` | CMD-W1; shows the cut-off assessment preview |
| `/ta/applications/:id/price-increases/:priceRecordId/decide` | POST | `application.decide_price_increase` | CMD-S3 |
| `/ta/applications/:id/dependencies`, `…/dependencies/:dependencyId/unlink` | POST | `application.link_dependency` | CMD-D5/D6 |
| `/ta/applications/:id/corrections/:correctionId/reapply` | POST | per kind | CMD-D4 |
| `/ta/applications/:id/transitions/:transitionId/decide` | POST | `application.decide_transition` | CMD-SA2 |

### 4.2 Operator surface (`/ops`)

| Path | Method | Action / authorization | Shows |
|---|---|---|---|
| `/ops/work` | GET | `application.read` list, scope operator | assigned applications ordered by pending reason; incidents owned or reviewed; deferral reviews due |
| `/ops/applications/:id` | GET | `application.read` asg or grant | case page: snapshot, documents, readiness validity with basis comparison, holds, acts with state and a protection banner "Possibly filed: treat as filed until reconciled", reconciliation attempts, Gate status (pass/blocked only), exposure result codes (no TA-wide figures), dependencies, deferral, custody parts and holders, artifacts and eligibility, incidents, B46 boundary panel; owning-TA-suspended indicator. A group-read grantee sees the read-only parts and no command controls |
| `/ops/applications/:id/start-work`, `…/work-steps` | POST | `operator.start_work`, `operator.record_work_step` | CMD-O1, O2 |
| `/ops/applications/:id/readiness`, `…/readiness/:readinessId/withdraw` | POST | `operator.record_readiness`, `operator.withdraw_readiness` | CMD-O3, O4 |
| `/ops/applications/:id/assistance-entry` | GET/POST | `operator.assistance_entry` | CMD-A3 |
| `/ops/applications/:id/formal-return`, `…/flag`, `…/holds/:holdId/resolve` | POST | `operator.formal_return`, `operator.flag`, `operator.resolve_hold` | CMD-H2, H4, H6 |
| `/ops/applications/:id/acts` | GET/POST | `operator.authorize_external_act` | confirm page lists the durable-acceptance fields and the evidence digest; CMD-X1. After commit the page states "Authorized: permission only, not evidence of filing" |
| `/ops/applications/:id/acts/:authorizationId/evidence`, `…/reconciliation` | POST | `operator.record_act_evidence`, `operator.record_reconciliation` | CMD-X2, X3 |
| `/ops/applications/:id/official-result`, `…/outcome`, `…/artifacts` | POST | `operator.record_outcome`, `operator.record_artifact` | CMD-OC1, OC2 (disabled `cancellation_undeclared`), AR1 |
| `/ops/applications/:id/applicant-withdrawal` | POST | `operator.record_applicant_withdrawal` | CMD-W2 |
| `/ops/applications/:id/deferrals`, `…/deferrals/:id/end` | POST | `operator.propose_deferral`, `deferral.end` | CMD-DF1, DF3 |
| `/ops/applications/:id/forecast` | POST | `forecast.record` | CMD-S4 |
| `/ops/applications/:id/packet/build`, `…/packet/release` | POST | `operator.build_packet`, `operator.release_packet` | CMD-P1, P2 |
| `/ops/applications/:id/originals`, `/ops/originals/:originalId/link`, `…/movements`, `…/return` | POST | `operator.record_custody` | CMD-OR1–OR4; return disabled with `parked_custody_route_policy` unless declared |
| `/ops/applications/:id/disclosure` | POST | `incident.report_disclosure` | CMD-DS1 |
| `/ops/incidents`, `/ops/incidents/:id` | GET | `incident.read` asg or rev | incident, required evidence checklist, notices posted, "Applicant/regulator/legal notices: unavailable (`compliance_notice_unselected`)"; reviewer view shows the artifact and minimal candidate identifiers only |
| `/ops/incidents/:id/confirm-association`, `…/reject-association`, `…/evidence`, `…/notices`, `…/resolve`, `…/close` | POST | `incident.work`, `incident.resolve` | CMD-AR2, AR3, DS2–DS4 |
| `/ops/incidents` (create) | POST | `incident.open` | CMD-IN1 |

### 4.3 SuperAdmin surface (`/admin`)

| Path | Method | Action | Shows |
|---|---|---|---|
| `/admin/queues/assignment` | GET | `queue.read` | from authoritative tables: submitted unassigned (pending row 15), approved assistance awaiting assignment (row 12), inactive assigned operator (row 3); per row Gate 1 status, launch effect, protection mark, since (fact seq), TA, offering |
| `/admin/applications/:id/assign`, `/admin/applications/:id/reassign` | POST | `assignment.assign`, `assignment.reassign` | CMD-AS1, AS3 |
| `/admin/assignments/selection/preview` | GET | `assignment.assign` | rendered explicit plan for `selection` or `round_robin` (items in queue order, operators in chosen order) with per-item availability; new `_op` per rendered plan |
| `/admin/assignments/selection` | POST | `assignment.assign` | CMD-AS2 |
| `/admin/queues/assistance`, `/admin/assistance/:assistanceId/decide` | GET, POST | `queue.read`, `assistance.decide` | CMD-A2 |
| `/admin/queues/flags`, `/admin/holds/:holdId/respond` | GET, POST | `queue.read`, `flag.respond` | CMD-H5 |
| `/admin/applications/:id/gate-exceptions`, `/admin/gate-exceptions/:gexId/revoke` | POST | `gate_exception.*` | CMD-GX1/2; the form shows which gate blocks which action and the 01 §8.5 non-effects |
| `/admin/applications/:id/price-increases` | POST | `price.propose_increase` | CMD-S2 |
| `/admin/applications/:id/correct-from-evidence` | POST | `application.correct_from_evidence` | CMD-SA1 |
| `/admin/applications/:id/operational-withdrawal` | POST | `withdrawal.record_operational` | CMD-W3 |
| `/admin/applications/:id/unresolved-completion` | POST | `outcome.authorize_unresolved` | CMD-X4 |
| `/admin/queues/deferrals`, `/admin/deferrals/:id/decide` | GET, POST | `queue.read`, `deferral.decide` | CMD-DF2 |
| `/admin/incidents`, `/admin/incidents/:id/reviewer` | GET, POST | `incident.read`, `incident.assign_reviewer` | CMD-AR4, IN1 |
| `/admin/failures/:subjectType/:subjectId/classify` | POST | `failure.classify` | CMD-IN2 |
| `/admin/queues/monitoring` | GET | `queue.read` | B32 monitors from authoritative tables: unowned waits (pending owner `superadmin` older than a display threshold), filing unknown and exhausted acts, travel-date risk notices, custody parts `unknown`, open artifact/disclosure incidents, deferral reviews due, B46 pending boundary counts |
| `/admin/groups/:groupId` | GET | `group.read` | group end status per application (5.1 reasons), date basis, clock health, last sweep task state |
| `/admin/applications/:id` | GET | `application.read` SA | full case view; link to SuperAdmin-only full audit (`audit.read_full`) |
| `/admin/applications/:id/protection-marks/:markId/resolve` | POST | `protection_mark.resolve` | CMD-SA3 |

No admin route records readiness, authorizes an act, records act evidence or starts a completion check. `/admin/applications/:id` shows "Completion check: trigger and owner unselected (known limitation)" in place of a button.

## 5. Internal tasks and timers

All tasks below have effect class `none` (database only), so the record step is safe to re-run. Each prepare step re-checks current state under lock; none acts on behalf of a person, so permission re-check is the state re-check. Backoff base 5 s, maximum 10 min. Terminal failure appends `sys.task_failed_terminal` and shows on `/admin/queues/monitoring` with the failure owner. No task performs a government action, payment, delivery send or completion check.

### 5.1 `core.group_end_sweep` (B25)

| Aspect | Specification |
|---|---|
| Timer source | Periodic job `group_end_enqueue` (01 §10.8): daily at 02:00 Asia/Kolkata and at process start. Clock: injected `Clock`; date basis `BusinessCalendar('Asia/Kolkata')`; the `clock_check` job gates it. |
| Enqueue | One SERIALIZABLE transaction: skip entirely while clock health is `degraded`; for each open group with `travel_return_date < calendar.dateOf(now)`, `enqueueTask` dedupe `core.group_end_sweep:<grp>:<today>`. |
| Prepare | Clock health `ok` (else `failed_retryable`, code `clock_unhealthy` [CCR-09]); group still `open` and `calendar.dateOf(now) > travel_return_date` (strictly after) else `cancelled_obsolete`. |
| Record | Rev 2 (REC-13): payload `{ groupId, today, afterApplicationId \| null, page }`. Lock group `FOR UPDATE`; lock up to 200 open applications with `application_id > afterApplicationId` `FOR UPDATE` ascending. For each, `groupEndEligibility` under lock: lifecycle open; payment status ≠ `payment_received`; `operator_work_ever_authorized = false`; no act ever authorized; `custodyState` held and uncertain = 0; no pending delivery record (`queued`/`sending`/`uncertain` email); `payments.outstandingMoney = false`; no active protection mark. Eligible ⇒ `core_completions` (`ended_with_group`, basis = reasons evaluated), lifecycle `ended_with_group`, fact `core.ended_with_group`. Ineligible ⇒ untouched (reason codes in the result). A full page (200 rows) enqueues the continuation `…:<today>:p<page+1>` with `afterApplicationId` = the last id of this page; a short page ends the chain, so continuations per day are bounded by ⌈open applications / 200⌉. In that final page's transaction, after re-counting open applications under the group lock: if none is open and `intake.groupClosureBlockers` is (0, 0), group `closed`, `closed_kind = 'group_end'`, fact `core.group_closed`. |
| Retry | max 5; failure owner SuperAdmin queue. Nth run: already-ended applications are not open, so nothing repeats; completion unique index backs it. |
| Forbidden | Never ends an application with filing unknown, held original, pending delivery or outstanding money; never deletes; never records an outcome. |

### 5.2 `core.travel_date_recheck` (B06, B17)

Enqueued by CMD-G2 with dedupe on `dates_revision`. Prepare: group `dates_revision` equals the payload value, else `cancelled_obsolete` (a newer task covers it). Record: lock open applications ascending (batches of 200). For each: if any act is open or exhausted, or a submission/handoff is `filed_evidenced`, or a packet is released ⇒ set `dates_checked_revision` and record `historical_or_held` (filed facts stay historical; B23 hold); otherwise evaluate `documents.requirementEvidence` with the new dates (date-dependent validity checks) and set `dates_checked_revision`. Fact `core.travel_dates_rechecked` [CCR-08] per application with result codes. Enqueue `core.timing_risk_check` per submitted application. Validity failures surface through the evaluator to the derived owner.

### 5.3 `core.timing_risk_check` (B17)

Sources: CMD-S1, CMD-S4, 5.2, and a daily periodic job `timing_risk_enqueue` [CCR-18] for submitted applications with outcome NULL. Record: expected window end = current forecast end, else the original estimate end. Threatened when expected end ≥ `travel_start_date`. Elapsed when `calendar.dateOf(now) >` expected end and outcome is NULL. For each condition post TA notice `timing_risk` (`ack_required = false`: no TA decision is defined for timing alone; a needed decision goes through formal return) with dedupe `timing_risk:<app>:<window ref>:<dates_revision>:<condition>`, and append `core.timing_risk_recorded`. No numeric lead time is invented.

### 5.4 `core.deferral_review_due` [CCR-06]

Enqueued by CMD-DF2 with `notBefore`. Prepare: deferral `approved` and `review_on` equals the payload, else obsolete. Record: set `review_due_at`; staff notices to the assigned operator and the approving SuperAdmin (dedupe per deferral and date); fact `core.deferral_review_due` [CCR-08]. A periodic job `deferral_review_enqueue` re-enqueues missed reviews after downtime.

## 6. Deliberate boundaries in this scope

| Boundary | Spec | Visible as | Code / category |
|---|---|---|---|
| Completion-check trigger and owner, incl. unassigned cases | B46 KNOWN_LIMITATION | pending rows 29–30; completion evidence panel; harness-only CMD-C1 | `completion_check_trigger_unselected` / `unavailable_known_limitation` |
| Delivery send trigger | B46 | pending row 29; E5 status | `delivery_send_trigger_unselected` |
| Uncertain email handling | B46 | E5 status when the only send is `uncertain` | `uncertain_email_handling_unselected` |
| Manual operator email as completion evidence | 01 OD-02 | E5 lists it as "recorded, not counted" | `completion_check_trigger_unselected` |
| Original return recipient-evidence policy, shared-item return priority, cross-operator visibility, loss/damage, assignment suitability | B30 PARKED | CMD-OR2/OR4 disabled; no loss/damage option | `parked_custody_route_policy` / `unavailable_parked` |
| Generic cancellation | B44 PARKED, B21 | CMD-OC2 disabled unless declared | `cancellation_undeclared` / `unavailable_parked` |
| Provider handoff route | B04, B15, B42, B44 | CMD-X1 provider kind disabled | `provider_route_unapproved` / `unavailable_parked` |
| Preparation-only post-handover/cut-off and dependent-government-result evidence | B44 PARKED | rev 2 (BND-03): ordinary withdrawal of a submitted application refused before and after release (`withdrawal_cutoff_undeclared`); dependency link to a preparation-only or external upstream refused (BND-05) | `parked_preparation_post_handover`, `parked_preparation_dependency_evidence` |
| Country-specific unknown-filing recovery | B44 PARKED | only CMD-X4 is offered after reconciliation; no refiling | `reconciliation_exhausted_no_refiling` |
| Repeat external act in one application | OD-C4 | CMD-X1 disabled after `filed_evidenced` | `parked_repeat_external_act` / `unavailable_parked` |
| Exposure release, fee-exclusion record, paid case at default ₹0 | B28, B43 PARKED | CMD-X1 blocker list | `exposure_parked_paid_case_default_ceiling`, `parked_reservation_release` |
| Refund/adjustment after a paid price reduction; write-off; assistance charging | B29, B43 unselected | price panel text; financial follow-up list | `unselected_refund`, `unselected_write_off` |
| Applicant, regulator and legal notices | B13 | incident page | `compliance_notice_unselected` / `unavailable_owner_decision` |
| Autonomous and group assignment | B19, B42 EXCLUDED | no route, task or event; only CMD-AS1/AS2 | — (absence tested) |
| Automatic deletion | B42 EXCLUDED | group end retains history | — (absence tested) |
| Estimate as SLA | B17 | "guidance, not a guarantee" label | — |
| TA eligibility and fraud policy | B08 unselected | suspended TA: no inferred hold; indicator only | — |
| Declined material-scope increase | OD-C3 | authorization blocked | `renewed_authority_declined` |
| Same-person evidence definition | OD-C1 | interim rule; message names the evidence missing | `identity_same_person_evidence_insufficient` |

## 7. Test plan

Levels per 0.1. "Persisted" lists rows and facts asserted in the database. "Forbidden" lists effects asserted absent (rows, facts, tasks, notices, mail, state changes). Every I and M test runs against a real PostgreSQL 16 database; fault points are those of 01 §4.11.

| # | Test | Rules | Level | Persisted (asserted) | Forbidden (asserted absent) |
|---|---|---|---|---|---|
| T-CO01 | Create group: listed country, valid dates, `date_basis = 'Asia/Kolkata'` | B03, B25 | I | group row; `core.group_created` | group for an unlisted country |
| T-CO02 | Sibling independence: two applications of one applicant in one group; correct one, record outcome on one | B03, B41 | I | only the target's snapshot, correction and outcome rows | any write to the sibling; association of a version into another group |
| T-CO03 | N=8 concurrent `create_draft` on an empty scope with distinct keys | B03, B35, B41 | M | exactly one application, one snapshot, one `core.draft_created` | second application; orphan snapshot or payment state |
| T-CO04 | Later same-service attempt: prior open ⇒ duplicate; prior completed without declaration ⇒ refused; with declaration ⇒ new application with fresh governing ids; prior exhausted ⇒ refused; rev 2 (MON-04): re-keying an existing draft into a closed scope through CMD-D3, CMD-A3 or CMD-SA1 ⇒ `later_attempt_declaration_required`; into a scope with a `reconciliation_exhausted` act ⇒ always refused | B03, B23, B25 | I | new row with `later_attempt_of`; no copied rows | submission/price/readiness/authorization copied from the prior; a key change into a closed scope |
| T-CO05 | Intake proposal for a closed scope | B03, B16 | I | `refused` result; no application | silent new draft |
| T-CO06 | `edit_draft` with stale `_rev`; two tabs race | B19, B35 | I/M | one snapshot version; `stale_revision` for the loser | latest-write-wins second snapshot |
| T-CO07 | Identity correction on a draft: no evidence, mismatching evidence, valid evidence, key collision | B19, B15 | I | valid ⇒ new snapshot, key change, `core.applicant_identity_corrected` with evidence refs | snapshot change on refused paths; attestation-only success |
| T-CO08 | Identity correction by stage: submitted unassigned, assigned (TA refused), after return, filing unknown (held), not filed (released, reapply), filed (superseded + incident), closed (refused) | B19, B23, B16 | I | correction states per stage; `post_filing_correction` incident | snapshot change while held; change to filed authorization rows |
| T-CO09 | Submit: confirmations recorded as given; absent required item refused; price and window from governing baseline; no payment needed | B17 | I | submission row with confirmation items, window dates, quoted price record | submission on refusal; payment entry; confirmation `present` not given by the TA |
| T-CO10 | Submit Nth retry, same key different content, lost ack (`command.lose_ack`) | B35, B41 | I | one submission, one price record, one fact set | duplicate rows, facts or tasks |
| T-CO11 | Submit under suspension (continue/hold/missing) and under withdrawal; concurrent suspend vs submit | B07, B41 | M | allow/hold/refuse per 01 §2.14; one consistent outcome | submission after an effective withdrawal |
| T-CO12 | Baseline reduction to unpaid vs paid application; impact task run twice | B17 | I | one `reduction_auto` for unpaid; `core.price_reduced`; TA notice | reduction for paid; second reduction row; any `pay_*` write |
| T-CO13 | Mistaken-price increase: filing not blocked; decline keeps communicated price; accept raises; second open proposal refused; TA decision refused on assigned case | B17, B18 | I | price record states and effective prices | payment entry change; decision while assigned and not returned |
| T-CO14 | Material-scope increase blocks authorization pending and after decline | B17 | I | blocker codes; no authorization | authorization row |
| T-CO15 | Forecast recorded; original window unchanged; timing notice once per window and dates revision | B17 | I | forecast row; one `timing_risk` notice; `core.timing_risk_recorded` | change to `core_submissions` window; second notice on task re-run; `ack_required = true` |
| T-CO16 | Assistance: request, decline, approve, assign blocked by Gate 1, assign with exception, entry, formal return, TA submit | B18, B17, B26 | I | assistance states; assignment `assistance` survives submit; financial exception; submission by the TA only | submission before TA submit; operator entry outside `assistance_in_progress` |
| T-CO17 | Bulk intake creates drafts only | B14, B17 | I | drafts | submission, assignment, assistance, authorization rows |
| T-CO18 | Two SuperAdmins assign one application concurrently | B19, B41 | M | one active assignment, one `core.operator_assigned` | second active assignment; second exception consumption |
| T-CO19 | Selection and round robin: mixed eligibility, plan mismatch, Nth retry, competing single assign | B19, B42 | I | per-item results; facts only for assigned items | assignment by any task or timer (registry scan); shifted rotation |
| T-CO20 | Payment correction vs assignment concurrently; exception stale after status change | B26, B41 | M | serialized result; `gate_exception_stale` | assignment on a stale basis |
| T-CO21 | Gate 1 vs Gate 2: Gate 1 exception does not satisfy Gate 2; Gate 2 at first commitment; `same_attempt` for the second act only while the first act may have committed; single consumption; rev 2 (MON-03): fee act `not_filed_evidenced`, payment corrected to `not_received`, then the submission authorization is blocked `gate2_payment_not_received` and a Gate 2 exception is grantable | B20, B26, B27, B41 | I | gate bases on authorizations; `commitment_under_gate2_exception` | Gate 2 passed by a Gate 1 exception; payment status change by an exception; `same_attempt` after a not-filed first act |
| T-CO22 | Reassignment: duties transfer, old operator denied on page, command, operation lookup and task; readiness `previous_operator`; readiness exception only then; originals unchanged | B19, B10, B11, B41 | I | `reconciliation_owner_id`, incident owners, `transferred`; facts | old operator effect after commit; custody row change; act state change |
| T-CO23 | Operator suspended: pending `assigned_operator_inactive`; assignment kept until reassign | B11 | I | pending owner; active assignment row | assignment ended by suspension |
| T-CO24 | TA problem report on an assigned case | B18, B41 | I | `prb` hold; `hold_revision + 1`; blocks authorization and packet release | snapshot, association, document, price, withdrawal or submission change |
| T-CO25 | TA actions on assigned not-returned case: edit, submit, withdraw, price decision, assistance | B18 | I | `awaiting_formal_return` | any write |
| T-CO26 | Formal return keeps operator; TA corrects; hand back; readiness reconfirmation required | B18, B19 | I | same `assigned_operator_id`; `stale_basis` until new readiness | authorization with old readiness |
| T-CO27 | Flag: SA response; only the operator closes; SA has no readiness or authorization route (route registry and policy) | B18 | U/I | hold response fields | hold closed by SA; readiness or act by an SA actor |
| T-CO28 | Problem report vs authorization race | B18, B35 | M | either act then hold, or hold and no act | act authorized after a committed hold |
| T-CO29 | Readiness: requirements; derived validity after document, travel date, hold, impact and dependency changes | B18, B19, B06 | I | readiness rows; validity per change | readiness accepted on a stale digest |
| T-CO30 | Authorization durable acceptance; fault `command.before_commit` | B23, B28 | I | all fields of 2.1 on success | after fault: authorization, reservation, consumed exception, facts |
| T-CO31 | Authorizations for one TA in two groups concurrently; breach after Gate 2 exception; paid case at default ₹0 | B28, B41 | M | reservations ≤ ceiling; aggregate equals sum | breach reservation; release of any reservation |
| T-CO32 | Authorization Nth retry, new key same act, lost ack | B35, B23 | I | one authorization, one reservation | second open act |
| T-CO33 | Act evidence: attestation-only filed refused; filed with receipt; fee paid; not filed then fresh authorization reuses reservation; filing unknown protections | B23, B28 | I | act states, `government_attempt_no`, Payments conversion; blockers on withdrawal, dependency failure, group end, corrections | second reservation; ordinary withdrawal while unknown |
| T-CO34 | Time advance, reassignment and courier records do not change act state | B23 | I | act state unchanged | any act-state fact |
| T-CO35 | Unresolved completion; later same-service attempt refused; later official result opens follow-up | B23 | I | exhausted acts, outcome, TA notice, follow-up incident | outcome change by the later result; new authorization |
| T-CO36 | Repeat filing after `filed_evidenced` unavailable | B23, OD-C4 | I | `parked_repeat_external_act` | second act row |
| T-CO37 | Provider handoff unavailable; with a synthetic test route the handoff is not filing | B04, B15 | I | handoff act `filed_evidenced` | change to `government_attempt_no`; real provider call |
| T-CO38 | Preparation-only shape: build (CMD-P1), readiness with packet, release once (CMD-P2 writes `core_packet_releases` and Delivery marks the packet `released`), handover through TA, outcome; originals and official result refused; rev 2 (BND-03): withdrawal of the submitted application refused `withdrawal_cutoff_undeclared` before and after release; draft withdrawal accepted | B04, B24, B41 | I | packet release row; outcome `prepared_and_handed_over` | original rows; government outcome; second release; `core_withdrawals.accepted` for a submitted preparation-only application; any route named `dlv.release_packet` |
| T-CO39 | Dependencies: missing evidence unmet with owner; incompatible final upstream fails only confirmed-unfiled dependent; filed dependent keeps protection; packet handover never satisfies a government result; undeclared sibling unaffected; rev 2: an upstream in another group is refused (COV-08 interim); no external-evidence upstream exists (BND-05); an outcome correction `issued → refused` turns a `met` dependency into `failed_incompatible` and fails a confirmed-unfiled dependent (MON-06) | B22, B44, B41 | I | dependency states; `dependency_failed` in the same transaction | terminal failure for missing evidence; sibling change; a dependency met by the TA's own upload |
| T-CO40 | Upstream outcome vs dependent authorization concurrently | B22, B35 | M | consistent committed state | deadlock exhaustion |
| T-CO41 | Cancellation undeclared | B21, B44 | I | `cancellation_undeclared` | outcome `cancelled` |
| T-CO42 | Withdrawal matrix (W1–W3, all assessment rows) | B24, B18, B23 | I | accepted/refused rows; outcome `withdrawn`; originals, money and duties unchanged | reversal; refused request erased; withdrawal while filing possible |
| T-CO43 | Withdrawal vs authorization race | B24, B35 | M | one winner | both accepted |
| T-CO44 | Deferral flow; authorization blocked while active; review task re-run | B21 | I | deferral states, TA notice, review task once per date | authorization while active; duplicate notices |
| T-CO45 | No product path starts completion: route registry, task kinds, event handlers | B46 | U | — | any product route/task/event naming completion or delivery send |
| T-CO46 | Harness completion for electronic `issued`: missing email, TA download only, manual email only, `uncertain` email, held original, artifact block, open operational incident only, open financial exception; rev 2 (MON-09): an unpaid, never-assigned withdrawn draft before the return date ⇒ `group_end_pending` | B24, B25, B46, B29, B30 | I | completion only when E1–E7 hold; exception rows survive | completion on any failing case |
| T-CO47 | Direct external delivery record satisfies E5 truthfully | B24, B31 | I | completion basis cites the direct record | claim of a TravelMudra-held result |
| T-CO48 | Group end date boundary: return date D; FakeClock at D 23:59 IST vs D+1 00:01 IST (UTC 18:29/18:31); clock skew > limit | B25, B41 | I | ended only after the boundary; skew ⇒ no sweep | ending on day D; ending during skew |
| T-CO49 | Group end eligibility matrix and group closure; rev 2 (REC-13): 350 open applications where the first 200 by id are ineligible ⇒ applications 201–350 that are eligible end the same day, and the continuation chain stops after the short page | B25, B35 | I | `ended_with_group` rows for eligible only; group closed only when all closed and `groupClosureBlockers` = (0, 0) | ending with filing unknown, held original, pending delivery, outstanding money, paid, worked; deletion of any row; more than ⌈n/200⌉ continuations per day |
| T-CO50 | Group end vs concurrent draft/submit/assign | B25, B35 | M | consistent result | draft in a closed group; ended application with an assignment |
| T-CO51 | Group end crash after record before acknowledgement (`task.after_effect`, process kill) and Nth run | B25, B35 | M | one completion per application | duplicate completion or facts |
| T-CO52 | TA `close_group` with open applications or intake incidents | B25 | I | refusal codes | group closed |
| T-CO53 | Travel-date edit: material revision bump, readiness stale, recheck pending until task, filed authorization unchanged, timing notice | B06, B17 | I | revisions; `core.travel_dates_rechecked`; notice | change to filed act rows |
| T-CO54 | Automatic association: match; stored metadata used at release | B13 | I | verified artifact with metadata | new parse or extraction task at release |
| T-CO55 | Missing/conflicting/multiple candidates: incident to operator; unassigned ⇒ SA reviewer without filing authority | B13 | I | incident owner/reviewer; reviewer view limited | reviewer authorization, Gate 1 or case command success |
| T-CO56 | Replacement invalidates earlier eligibility | B13, B12 | I | old `noncurrent` | release of the old version |
| T-CO57 | `issued` with missing artifact | B13, B21 | I | outcome kept; pending row 26 | completion; delivery release |
| T-CO58 | Wrong-recipient disclosure: block; retrieval denied through web retrieval, bulk selection, document email, operator view, group-read grant view, support view; notices to all affected TAs; resolution needs evidence; resolution after completion | B13, B41, B10 | I | block rows, incident, notices, preserved release rows | bytes released after block; recall wording; resolution without evidence |
| T-CO59 | Compliance notices unavailable | B13 | I | page code | any applicant/regulator notice |
| T-CO60 | Original receipt once; courier/scan evidence alone refused; partial movement; unknown holder needs uncertainty; cross-operator link parked; preparation-only refused | B30 | I | original, parts, movements, discrepancy incident | second item for the same key; possession from a courier receipt |
| T-CO61 | Partial original return with a synthetic test declaration; real declaration refused | B30, B24, B41 | I | partial return keeps hold (E4 fails); full return clears E4 | return under a real declaration |
| T-CO62 | One application's withdrawal and closure keep another's custody duty | B30, B24 | I | sibling E4 still failing | custody change by withdrawal |
| T-CO63 | Failure classification: shared needs origin component; hosting-only evidence refused; country-origin defect local | B34, B36 | I | classification rows | `shared` without origin evidence |
| T-CO64 | Access matrix over every route in Section 4: other TA, unassigned operator, after reassignment, suspended, group-read grant (read only), support view (no commands) | B10, B41 | I | `not_found_or_forbidden` and the 404 page | any write or byte release |
| T-CO65 | Projector stalled (`projector.stall`): commands and queue pages work from authoritative tables | B33 | I | accepted commands; banner | guard reading a `view_` table (instrumented) |
| T-CO66 | Fact shape for each command: actor, reason (SA), evidence, before/after; reasonless SA command refused | B33 | I | fact columns | fact without actor; accepted without reason |
| T-CO67 | Daily timing check: elapsed window without outcome notifies once | B17 | I | one notice | repeat notice |
| T-CO68 | Launch holds: assign, start work, readiness, authorization held under suspension hold; reconciliation, evidence, outcome, custody, incidents, reassignment continue | B07 | I | allowed commands' rows | held commands' rows |
| T-CO69 | Payment corrected to unpaid after assignment: work continues (interim of owner decision OD-R2-02; the test changes if the owner requires Gate 1 at work start); Gate 2 still required at commitment; financial exception by Payments | B26, B29 | I | exception row | assignment ended; Gate 2 skipped |
| T-CO70 | Electronic and physical shapes end to end with synthetic declarations | B04, B24, B30, B41 | I | full fact sequence per shape | real external effect; non-synthetic data |
| T-CO71 | Rev 2 (MON-01): fee timing `with_submission` — the submission authorization reserves exposure; `filed_evidenced` with `feePaidPaise` records `tm_paid` and TA liability; `filing_unknown` ⇒ fee `payment_unknown`; `not_filed_evidenced` ⇒ fee `reserved` and the fresh authorization reuses the reservation; a `government_fee_payment` authorization is refused `fee_act_not_declared`; same for `no_government_fee` | B27, B28, B35 | I | `carries_fee`, one reservation, fee states, liability | a second reservation; a fee act without a declared fee |
| T-CO72 | Rev 2 (MON-02, COV-02): fee act authorized after the evidenced submission of the same attempt uses `govfee:<app>:1`; not-filed fee then re-authorization ⇒ one reservation row | B28 | I | one reservation, key with ordinal 1 | a key with `government_attempt_no` |
| T-CO73 | Rev 2 (BND-13): an artifact upload that `doc.parse` cannot read (`extraction_failed`) opens an owned `artifact_association` incident through the settled listener; a matching artifact (passport-number candidate + all name tokens, one candidate) is verified without a person | B13 | I | incident or verified artifact | artifact `pending_review` with no incident |
| T-CO74 | Rev 2 (COV-06): a draft from a form without residence or nationality is created; `submit` blocks with `population_declaration_missing`; a positive non-IND value refuses the draft | B02, B14 | I | draft row; blocker | inferred population value |
| T-CO75 | Rev 2 (COV-09): impact recheck with `continue_on_head` and `mistaken_price` calls `recordContinuation` and `proposePriceIncrease`; the quoted price and price records are unchanged by the continuation | B06, B17 | I | governing ids switched; open increase; facts | change of `core_submissions.quoted_price_paise` |
| T-CO76 | Rev 2 (REC-20): restore with new secrets, then `ops.record_original_receipt` of the same passport in the same group ⇒ `original_already_recorded` | B30, B40 | I/M | one original row | second original row |

## 8. Contract change requests

Each request names the exact change to record 01 and the reason. None changes a business rule. The orchestrator decides; until a request is accepted, the implementation of the dependent item waits or uses the noted interim.

| # | Proposed change to record 01 | Reason | Disposition (rev 2) |
|---|---|---|---|
| CCR-01 | Add id prefix `fcs` (forecast), table `core_forecasts` (Section 2.1 of this record) to §1.2 and §3.5; subject type `forecast` to §2.23; action `forecast.record` (asg, SA) to §5.2/§5.3. | B17 requires a later forecast shown separately from the original estimated window; 01 has no place for it. | Accepted (01 §1.2, §3.5) |
| CCR-02 | Add id prefix `prl`, table `core_packet_releases` to §1.2 and §3.5; subject type `packet_release`; command `core.release_packet` to §6.4; Delivery writer `markPacketReleased(tx, packetId, packetReleaseId)` to §6.9. | B04/B18/B19: packet release is a readiness-gated Core acceptance that must record its basis durably; `core_action_authorizations` holds only external acts. | Accepted; Core is the only release owner (01 §3.5, §6.4, §6.9; COV-03) |
| CCR-03 | §1.1 logical effect key: replace `<government attempt no>` with `<attempt ordinal>`; add column `core_action_authorizations.attempt_ordinal int NOT NULL`; rule: the fee and submission authorizations of one attempt share the ordinal; a fresh authorization after `not_filed_evidenced` keeps it. Add `gate2_basis` value `same_attempt`. | With the current definition a fee act authorized after the evidenced submission of the same attempt gets a new key and a second reservation (B28 "once per logical effect"). | Accepted with edit: `same_attempt` only while a commitment may have happened (01 §1.1, §2.11; MON-03) |
| CCR-04 | Add controlled action `reassign` to §2.11 `CONTROLLED_ACTIONS`; §2.14 launch row: `reassign` = `allow` in every column; §8.3 row: stages 3, 6 (open), 12 (Gate 1) only; §2.11 Gate 1 guards `assign` and `reassign`, exception action key `assign` for both. | B07: reconciliation, original return and incidents continue under suspension; a launch `hold` on reassignment would strand duties of a suspended operator (B11). | Accepted (01 §2.11, §2.14, §8.3) |
| CCR-05 | §7.1 `dependency_failed` row: replace "no act ever `authorized`, `filing_unknown`, `filed_evidenced` or `reconciliation_exhausted`" with the definition in 2.3.2 of this record. Add: `external_outcome_unresolved` is not a final upstream outcome for dependency evaluation. | B23: positive non-execution evidence confirms non-filing; B22 needs a final incompatible outcome, and an unresolved result is not one. | Accepted (01 §7.1) |
| CCR-06 | §2.21: rename task kind `ops.deferral_review_due` to `core.deferral_review_due`, owner `core`, failure owner SuperAdmin. | Deferrals are Core rows (B21; 01 §3.5). A record step writing Core state must be Core's. | Accepted (01 §2.21) |
| CCR-07 | §2.24: add actor kind `harness` (label required; allowed only when `env ∈ {test, local_test}`; configuration refuses it in `production`); facts carry `actor_kind = 'harness'` and `command_name` prefixed `harness.`. `sys_facts.actor_kind` CHECK updated. | B46 needs a labelled direct invocation of the completion check; `engineering` actors may not write business facts (01 §2.24). | Accepted (01 §2.24, §7.11) |
| CCR-08 | §2.22 add fact types: `core.forecast_recorded`, `core.packet_released`, `core.correction_held`, `core.correction_hold_resolved`, `core.flag_responded`, `core.dependency_unlinked`, `core.travel_dates_rechecked`, `core.deferral_review_due`, `ops.original_linked`. | New facts of this record (B17, B04, B23, B18, B22, B06, B21, B30). | Accepted (01 §2.22) |
| CCR-09 | §8.4 add reason codes: `act_evidence_insufficient`, `act_state_transition_invalid`, `act_authorized`, `artifact_cross_group`, `artifact_type_already_eligible`, `assignment_batch_too_large`, `assistance_approved`, `assistance_request_open`, `assistance_requested`, `authorization_basis_changed`, `awaiting_assignment`, `awaiting_external_result`, `clock_unhealthy`, `completion_evidence_missing`, `compliance_notice_unselected`, `correction_historical_after_filing`, `country_not_listed`, `custody_path_not_declared`, `deferral_active`, `deferral_proposed`, `delivery_evidence_missing`, `dependency_cycle`, `dependency_undeclared`, `draft_incomplete`, `failure_scope_evidence_missing`, `filing_not_evidenced`, `flag_already_responded`, `flag_response_missing`, `forecast_window_invalid`, `group_dates_invalid`, `group_end_pending`, `group_has_open_applications`, `group_intake_incidents_open`, `held_correction_conflict`, `held_correction_released`, `hold_not_applicable`, `hold_not_operator_closable`, `identity_field_requires_correction`, `identity_same_person_evidence_insufficient`, `incident_evidence_insufficient`, `later_attempt_declaration_required`, `offering_country_mismatch`, `operator_work_not_started`, `original_already_recorded`, `original_held`, `outcome_correction_not_allowed`, `outcome_missing`, `packet_not_built`, `packet_released`, `packet_stale`, `parked_preparation_dependency_evidence`, `parked_preparation_post_handover`, `parked_repeat_external_act`, `preparation_only_holds_no_originals`, `price_changed`, `price_decision_awaits_return`, `price_decision_pending`, `price_increase_open`, `problem_report_open`, `readiness_basis_changed`, `ready`, `reconciliation_attempt_missing`, `renewed_authority_declined`, `renewed_authority_pending`, `round_robin_plan_mismatch`, `step_undeclared`, `ta_confirmation_absent`, `withdrawal_evidence_missing`, `work_already_started`. Stage placement in §8.2: `deferral_active`, `operator_work_not_started` ⇒ stage 6; `renewed_authority_pending`/`_declined`, `packet_not_built`, `packet_stale` ⇒ stage 10; `correction_historical_after_filing` ⇒ stage 8. Boundary codes (`parked_*`, `compliance_notice_unselected`) carry their boundary category. | Closed set (01 §2.20, §8.4) needs every code this module returns. | Accepted (01 §8.2, §8.4) |
| CCR-10 | §5.2/§5.3 add actions: `price.propose_increase` (SA), `forecast.record` (asg, SA), `application.link_dependency` (TA own when editor permits), `deferral.end` (asg, SA), `operator.record_work_step` (asg), `incident.open` (asg for application-scoped kinds, SA), `incident.report_disclosure` (asg, SA), `failure.classify` (SA). `incident.work` additionally permits `ops.record_artifact` for the incident owner or reviewer when an `incidentId` is supplied. | Commands of this record need a policy action each (01 T-F02). | Accepted (01 §5.2, §5.3) |
| CCR-11 | §2.17 add `OPS_INCIDENT_KINDS` value `post_filing_correction`; §3.8 `ops_incidents` columns as Section 2.2 of this record, in particular `dedupe_key text UNIQUE NOT NULL`, `reviewer_account_id`, `country_id`, `affected`, `required_evidence`, `notice_ids`. | `operations.openIncident` is idempotent by dedupe key (01 §6.7) but 01 lists no unique column; `PolicyRelations.incident` returns `reviewerAccountId` with no column; B19 needs an owned incident for corrections that arrive after filing. | Accepted (01 §2.17, §3.8) |
| CCR-12 | §3.8 `ops_artifacts.eligibility`: replace `withheld_missing` with `withheld_pending_review`; add columns `uploaded_for_application_id` (immutable), `document_version_id UNIQUE`; `application_id` nullable until verified. `withheld_missing` stays a derived application-level status in `artifactEligibility`. | A row exists only when an artifact exists, so "missing" cannot be a row state; a pending artifact needs a non-eligible state; the uploaded-for and associated applications differ under secondary review (B13). | Accepted (01 §3.8) |
| CCR-13 | §6.4 CoreApi add `noteUpstreamArtifactChanged`, `completionEvidence`, `currentPrice`, `estimateAndForecast`; §6.7 OperationsApi add writers `transferApplicationDuties`, `evaluateArtifactAssociation`; §6.9 DeliveryApi add `requestPacketBuild`, `markPacketReleased`; §6.6: Documents' `doc.parse` record step calls `operations.evaluateArtifactAssociation` for `operator_artifact_upload` versions; §6.11 add these cross-owner rows. | Cross-owner calls of Sections 3.5, 3.10, 3.11, 3.15. | Accepted with edit: artifact association runs as a Documents settled listener and fails closed (01 §6.6, §6.7; BND-13) |
| CCR-14 | §7.3 fingerprint inputs: add `dates_revision` and `dates_checked_revision`, held/released correction count, open `material_scope_change` price record id, and for `preparation_only` the current built packet id and `sha256`. | Readiness must go stale when a recheck is pending, a correction is held, renewed authority is open, or the packet changes (B06, B17, B19, B04). | Accepted (01 §7.3) |
| CCR-15 | §3.8: add `ops_original_parts`; replace the `ops_original_movements` note with: "`return` is available only when every linked application's governing declaration declares `originals.returnRecipientEvidence`, and `originals.sharedItemReturn` when more than one application is linked; otherwise `unavailable_parked` / `parked_custody_route_policy`". §9.2 `originals` gains these two keys (default `{ "unresolved": … }`). | K-02: B24 and B41 need recorded owner receipt and a tested partial return; B30 parks the policy. Declaration gating keeps every real route unavailable and lets synthetic declarations prove mechanics. See OD-C2. | Accepted with edit: one owner-gated key `originals.returnPolicy` (01 §3.8, §9.2) |
| CCR-16 | §9.2 `decl/1` detail keys read by Core: `authority.confirmationItems[{code, required, textVersion}]`; `financialConditions.feeTiming` (`separate_act` \| `with_submission`); `controls.withdrawalCutoff` (`evidenceKind`); `documents.formFields`; `progressMapping[].stepCode`; `dependencies[{relationshipCode, upstreamOfferingId \| 'external', applicantRelation, requiredOutcome, requiredArtifactType, conditionedActions}]`; `outcomeEvidence.artifactTypes`; `deliveryEvidence[outcome]` (`tm_held_electronic` \| `direct_external` \| `packet` \| `none`); `completionEvidence[outcome][]`; `cancellation`; baseline `processingEstimate {minDays, maxDays}`. Each key MAY be `{ "unresolved": … }`. | Core decisions of this record must read declared values, never defaults (B05). Catalogue design owns the schema detail. | Accepted with edit: normative schema in 01 §9.2; no external upstream; fee timing inside `governmentFee` (COV-01) |
| CCR-17 | §2.8 `NEXT_ACTIONS` add `return_to_ta`, `decide_transition`, `reapply_correction`. | Pending rows 6–8 (B18: price-authority actions wait for formal return). | Accepted (01 §2.8) |
| CCR-18 | §4.9 `PERIODIC_JOBS` add `timing_risk_enqueue` (daily, Asia/Kolkata). | B17 timing notices as time passes without an outcome. | Accepted (01 §4.9) |
| CCR-19 | §2.14 launch table: state that `reconciliation`, `record_act_evidence`, `record_outcome`, custody commands, incidents and `reassign` are `allow`. | Makes B07's continuing duties explicit for this module's commands. | Accepted (01 §2.14) |
| CCR-20 | Table detail values (register in vocabulary files for T-F05): `core_corrections.state`; `core_dependencies.state` adds `unlinked`; `core_price_records.seq_no`; `core_groups.dates_revision`, `date_basis`; `core_applications.dates_checked_revision`, `later_attempt_of`, `withdrawal_id`; `core_holds.revision`; `ops_originals.holder_kind`; `ops_failure_classifications.origin_component` closed set. | Closed-set checks and guard registry completeness (01 T-F05). | Accepted (01 §3.5) |
| CCR-21 | §6.4 command list add: `core.assign_selection`, `core.record_assistance_entry`, `core.propose_price_increase`, `core.record_forecast`, `core.link_dependency`, `core.unlink_dependency`, `core.apply_held_correction`, `core.end_deferral`, `core.release_packet`; §6.7 add `ops.record_work_step`, `ops.request_packet_build`, `ops.record_artifact`, `ops.reject_artifact_association`, `ops.post_disclosure_notice`, `ops.close_incident`, `ops.link_original`, `ops.open_incident`. | Command registry is closed (01 §4.2). | Accepted (01 §6.4, §6.7) |

## 9. Owner-decision candidates (genuine) and recorded interpretations

### 9.1 Owner-decision candidates (B47)

None blocks this module's other work. Each has a safe interim behaviour that is implemented and visible.

**OD-C1 — What is "clear same-person evidence" for identity-field corrections?**
- Spec: B19 "Draft TA correction of legal name, date of birth, nationality, passport number or issuing country needs clear same-person evidence." B15: "strong-identifier conflict and same-name ambiguity remain unresolved, never name-only/probabilistic merge."
- Why unknowable: the spec names the requirement, not the evidence standard. A passport renewal, a name change by marriage and a typing error need different proof; the choice is an identity and fraud judgement (B08 eligibility/fraud policy is unselected).
- Interim: CMD-D3 step 5 (associated identity document whose extracted values match the new values, plus continuity of at least two unchanged fields or a second document showing the old values). Attestation never suffices. Refusals name the missing element.
- Independent work: all other corrections and the whole module.

**OD-C2 — May an operator or SuperAdmin record owner receipt of a returned original while the recipient-evidence policy is PARKED?**
- Spec: B24 "A physical original holds completion until operator/SuperAdmin records owner receipt." B30 "record … return/recipient evidence … PARKED route policy includes shared-item return priority, assignment suitability, recipient evidence … affected steps remain unavailable until bounded/settled." B41 "partial original return".
- Contradiction: B24 and B41 assume returns are recorded; B30 makes the return step unavailable until the recipient-evidence policy is settled. Choosing either reading sets a custody/legal-duty policy.
- Interim: return is available only under a declared recipient-evidence policy (CCR-15). No real declaration has one, so every physical application with a received original stays open with `parked_custody_route_policy`. Tests prove the mechanics with synthetic declarations.
- Independent work: receipt, partial movements, uncertainty, completion evidence for electronic routes.

**OD-C3 — What happens when the TA declines a price increase caused by a material scope change?**
- Spec: B17 "increase requires renewed TA authority, and a declined mistaken-price increase honors the communicated price … Changed service/material scope needs fresh intake or renewed authority as applicable."
- Why unknowable: the spec defines the declined outcome only for a mistaken price. For a scope change, honouring the old price for the new scope, reverting the scope, or requiring fresh intake are different money and service commitments.
- Interim: authorization and packet release are blocked with `renewed_authority_declined`; the TA can withdraw or the operator can return the case; no price or scope is inferred.
- Independent work: all other price paths.

**OD-C4 — Is a second government submission or fee payment within one application ever permitted (for example an authority-requested resubmission)?**
- Spec: B19 "Filed, protected, released or completed facts remain historical; externally permitted remedy or owned incident is separate." B23 "No blind repeat payment/filing." B32 measures "repeat external act" quality. B44 parks country-specific unknown-filing recovery.
- Why unknowable: the spec allows an "externally permitted remedy" but defines no evidence, authority or money rule for a repeat act, and a repeat fee would create a second TA exposure.
- Interim: after `filed_evidenced`, a new act of the same kind is `unavailable_parked` / `parked_repeat_external_act`; the operator opens an owned incident (IN1). A later same-service attempt after completion still follows B03.
- Independent work: all first-attempt filing, reconciliation and unresolved completion.

### 9.2 Recorded interpretations (not escalated; promote to an owner decision if the owner disagrees)

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| I-C1 | Withdrawal of a draft | A draft can have no external act, so no evidenced cut-off can have passed; draft withdrawal skips the cut-off assessment. | B24, B25 ("unworked withdrawal") |
| I-C2 | Preparation-only withdrawal | **Withdrawn in revision 2 (BND-03, COV-07).** It made packet release an undeclared cut-off. Replacement: contract 01 I-16 — a submitted application whose offering has no supported withdrawal cut-off is refused `withdrawal_cutoff_undeclared`; draft withdrawal (I-C1) stays available. | B24, B44 |
| I-C3 | `external_outcome_unresolved` and dependencies | Not a final upstream outcome; dependents keep waiting with an owner. | B22, B23 ("a later official fact appends owned follow-up") |
| I-C4 | "Unpaid" for automatic price reduction | Current service payment status ≠ `payment_received`. | B17, B26 |
| I-C5 | Suspended TA | Applications continue; no hold is inferred; delivery to the suspended recipient is denied by the release check. | B11, B08 (fraud policy unselected) |
| I-C6 | Submission confirmation | Submission requires each declared required confirmation item; the record stores exactly what was given. Before submission the page shows "not given". | B17 ("after … actual authority/consent confirmation"; "record … truthfully") |
| I-C7 | Price decisions on assigned cases | Wait for formal return, like other price-authority actions; the operator owns the return step. | B18 |
| I-C8 | Timing notices | `ack_required = false`; a needed TA decision goes through formal return. No numeric lead time is invented. | B17 |
| I-C9 | Active deferral | Blocks authorization and packet release as a consistency guard; it is not a gate and has no exception. | B21, B20 |
| I-C10 | Cross-group dependencies | **Changed in revision 2 (COV-08).** Interim: upstream and dependent in the same group only (record 12 schema, 01 §9.2). Whether a cross-group or cross-country relationship may condition an outcome is owner decision OD-R2-06 (B03 vs B22). | B03, B22 |
| I-C11 | Disclosure notices | Both the owning TA and every wrong-recipient TA are "affected TAs"; notices are web notices with no recall claim. | B13, B31 |
| I-C12 | Result-delivery web notice | `result_available` is part of the B46 delivery send; Core and Operations do not post it when recording an outcome. | B24, B46 |
| I-C13 | Operator work start | Each assignment records `_work_started` before readiness, giving B32 a stage event. | B18, B32 |
