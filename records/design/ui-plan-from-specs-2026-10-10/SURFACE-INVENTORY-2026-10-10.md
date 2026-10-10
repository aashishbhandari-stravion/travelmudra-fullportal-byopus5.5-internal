# Surface inventory: the UI plan's read models and commands against the product API

Date: 10 October 2026. Author: the architect session (sole decision authority for this plan). Authorized by Max
on 10 October 2026 (`DECISIONS-2026-10-10.md` §4). Status: inventory, not a plan. No code was changed.

## 0. Purpose, inputs and method

Purpose: for every read model and every command of the UI plan, say whether the product's API already serves
it (Exists), serves part of it (Partial) or does not serve it (Missing), and which bucket a gap falls in:

- **View only**: the pages can be built on the API as it is. No Core change.
- **Kind 1 projection**: a new read model over facts Core already holds. Allowed under the six-point criterion
  of `DECISIONS-2026-10-10.md` §3.1.
- **Kind 2 command**: a new command or new behavior. One-way door. Gate of `DECISIONS-2026-10-10.md` §3.2.
  Default answer: no.
- **Kernel or owner policy**: the kernel is off limits; an owner decision is needed first.

Inputs:

| Input | Where | Version |
|---|---|---|
| UI plan read models (33) and commands (72) | `UI-PLAN.md` §6 and §7 | `internal` commit 43d3906 |
| Bulk read models (5) and per-page actions | `BULK-UPLOAD-UI-PLAN.md` §3 and §2 | `internal` commit 43d3906 |
| Product code | `src/core-api/**`, `src/contracts/*.ts`, `src/apps/**`, `src/modules/**`, `src/kernel/vocabulary/*.ts` | product `main` at 102e4c9 (accepted build 7be21b1 plus docs and `uat.py`) |

Method: a read-only survey agent (Claude Sonnet) listed the Core API from the contracts, the allowlists and the
bindings, and the edge and staff routes by running `edgeRoutes()` and `staffRoutes()` in a Node process with
no server, database or network. Result: 8 Core transport endpoints, 144 commands (6 of them deliberate
boundaries that always refuse), 83 queries, 3 byte-release routes, 74 edge routes, 217 staff routes. The
architect joined that list with the plan rows and checked each contested row in the code. Every `file:line`
below is relative to the product repository root at 102e4c9.

Prior evidence, not repeated here: the independent review of 8 October 2026 scored UI alignment with the UX
specification at 64.3% (main) and 50.0% (bulk) at 7be21b1
(`records/diary/2026-10-08-independent-architecture-and-ui-review.md`). That score measured page behavior.
This inventory measures the API under the pages.

Limits: runtime behavior was not exercised. Policy decisions (`src/modules/*/policy`) were not read; the
"who may" statements repeat the route inventory and the command comments. The private contract (foundation
record §21) was not compared. Test files were not read.

## 1. Summary

| Set | Rows | Exists | Partial | Missing |
|---|---|---|---|---|
| Read models, main plan (§2.1 to §2.4) | 33 | 29 | 4 | 0 |
| Read models, bulk (§2.5) | 5 | 1 | 3 | 1 |
| Commands, main plan and bulk (§3) | 72 | 61 | 6 | 5 |
| **Total plan rows** | **110** | **91** | **13** | **6** |

Buckets of the 19 Partial and Missing rows:

| Bucket | Rows | Which |
|---|---|---|
| View only | 7 | RM-O6, RM-B2, RM-B5, CMD-19, CMD-24, CMD-28, CMD-41 (RM-S3 also has a View interim) |
| Kind 1 projection candidate | 4 | RM-O9, RM-A1, RM-B1, RM-S3 (if the interim fails UAT) |
| Kind 2 command | 8 | CMD-16, CMD-25, CMD-44, CMD-48, CMD-50, CMD-55 (owner part), CMD-70, RM-B4 |
| Kernel or owner policy | 0 | none; CMD-44 and CMD-48 carry an owner decision already taken (OD §2, §3) |

Two counts matter more than the row scores:

1. **The plan asks for nothing the kernel does not permit.** No row needs a kernel change.
2. **The code has 57 commands that no plan command row names** (§5). 53 of them are served commands; 4 are
   parked boundaries. The 8 October review measured how much of the specification the UI serves. This
   is the reverse direction: how much of the product the plan would hide. The rewrite MUST give each served
   command a page or Max MUST decide to hide it.

## 2. Read models

Columns: plan read model (UI-PLAN §6 or BULK §3) with the pages that need it; the Core queries that serve it
with the binding that registers each; status; bucket; note. "BFF" means the edge or staff instance composes
the page from more than one Core read.

### 2.1 Shared (4)

| ID | Plan read model | Pages | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| RM-S1 | Session context | SH-01, all | `iam.session` (`core-api/bindings/identity.ts:171`), `iam.account_page` (`identity.ts:19x`) | Exists | View | Role, display name, support-view marker and accounting grant come from these two reads. |
| RM-S2 | Scoped search | SH-01 | `views.search` (`bindings/views-cases.ts:94`): `rows, next, asOf` | Exists | View | Projection with `asOf{asOfSeq,healthy,lagMs}`. The text is never logged. |
| RM-S3 | Recent operations | all pages that send commands | `core.operation {operationKey}` (`bindings/kernel.ts:29`): one key at a time; `operationId` is in the accepted envelope only | Partial | View (interim); Kind 1 if the interim fails | Core holds every operation record but serves no "my recent operations" list. Interim: the BFF keeps the keys of the session's recent posts and looks each one up. A list projection would meet criterion points 1, 3, 4 (facts exist, same scope, subject-named); point 2 holds only when UAT shows the interim fails after a refresh. |
| RM-S4 | Notices | SH-01, TA-01, TA-10, OP-10 | `dlv.notices` (`bindings/delivery.ts:242`), `dlv.notice` (`:246`) | Exists | View | Notices carry `acknowledgedAt` and `revision`; there is no read marker (see CMD-16). |

### 2.2 Travel agent (9)

| ID | Plan read model | Pages | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| RM-T1 | TA attention | TA-01 | BFF composition in `apps/shared/attention.ts` (`TA_ATTENTION`) over `core.ta_applications`, `dlv.delivery_facts`, `dlv.notices`, `intake.incidents` | Exists | View | Each count is its page's own rule, so the landing and the page agree. Bounded by the view row limit (200 or 500). |
| RM-T2 | Offering catalogue | TA-02, TA-03, BU-P01, BU-P02 | `cat.selectable_offerings` (`bindings/catalogue.ts:56`), `cat.offering_display` (`:65`) | Exists | View | The display carries cost, fee statement, estimate, documents, process and what stops selection. |
| RM-T3 | Group list | TA-04 | `core.ta_groups` (`bindings/core.ts:318`): `today, groups, countries` | Exists | View | `today` is the India date; use it for the new-group form. |
| RM-T4 | Group detail | TA-05, BU-P01 | `core.ta_group` (`core.ts:329`): `group, applications, closure{openIncidents, activeAttempts}`; `intake.group_page` (`bindings/intake.ts:227`) | Exists | View | What stops closing is a fact of the view (`closure`), not a UI inference (D4). |
| RM-T5 | Application list | TA-06 | `core.ta_applications` (`core.ts:346`); filtered and paged: `views.ta_applications` (`views-cases.ts:87`) with `asOf` | Exists | View | Two reads serve one page family: authoritative for action-needed, projection for filters and search. |
| RM-T6 | Application case (TA scope) | TA-07, TA-08, BU-P10 | `core.ta_application` (`core.ts:352`), `doc.application_evidence`, `dlv.delivery_facts` (`delivery.ts:225`), `views.ta_history` (`views-cases.ts:126`) | Exists | View | Four reads per case page today (`apps/shared/core/ta.ts`). A composed case read is a Kind 1 candidate only if measured latency on a P0 page justifies it (criterion point 2). |
| RM-T7 | Draft intake | TA-09 | `intake.start_page` (`intake.ts:234`): `groupRevision, offerings, challenge, documentMaxBytes, spreadsheetMaxBytes`; the draft itself: `core.ta_application` with `editor_state` | Exists | View | The individual form creates the application(s) in one command (CMD-8). The draft is then edited with CMD-9. |
| RM-T8 | TA payment history | TA-11 | `pay.ta_payments` (`bindings/payments.ts:2xx`) | Exists | View | Status and date of each entry only, by design. |
| RM-T9 | Account | TA-12 | `iam.account_page`, `iam.email_change_page` (`bindings/identity-admin.ts:121`) | Exists | View | |

### 2.3 Operator (9)

| ID | Plan read model | Pages | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| RM-O1 | Assigned work queue | OP-01 | `core.ops_work` (`core.ts:356`): `items, reviewsDue`; plus `ops.incidents`, `dlv.packet_handovers` (`delivery.ts:233`) for the docket | Exists | View | The projection `views.ops_work` is allowlisted and bound but unused (survey gap 5). The rewrite SHOULD either use it for filters or leave it; it MUST NOT add a third list. |
| RM-O2 | Operator case | OP-02, OP-03 | `core.ops_case` (`core.ts:376`), `ops.case_work` (`bindings/operations-work.ts:229`), `doc.application_evidence`, `dlv.delivery_page` (`delivery.ts:203`) | Exists | View | Read-grant scope: grant rows arrive through the work list; the case view returns no offers for a reader without assignment. The "Read-only grant" badge is a view fact, not a UI rule. |
| RM-O3 | Readiness checklist | OP-02, OP-04 | `ops.case_work.caseWork` (work steps, readiness, `basisDigest`) | Exists | View | Work steps exist as facts (`ops.record_work_step`) but no plan command records them (§5). |
| RM-O4 | External action | OP-04 | `ops.case_work.caseWork` (authorizations, act evidence, reconciliation attempts) | Exists | View | Results closed in `kernel/vocabulary/operations.ts:18-30`. |
| RM-O5 | Outcome and artifact | OP-05 | `ops.official_result_form` (`operations-work.ts:256`): `outcomes, artifactTypes, offer`; `ops.case_work`; `ops.incident` (`:248`) | Exists | View | |
| RM-O6 | Send preview | OP-06 | `dlv.delivery_page.page` (`delivery.ts:203`): files with `available`/`denyCode`, `emails[]`, `notices[]`, `handovers[]`, and the `boundaries` field (`contracts/delivery.ts:129`) | Partial | View (read side) | Everything a preview needs is readable. The send itself is a boundary (CMD-44). The page MUST show the boundary as the view reports it, not infer a send is possible. |
| RM-O7 | Completion prerequisites | OP-07 | `core.ops_case.case.completion[]` (`contracts/core.ts:205, 273`): prerequisites `outcome, no_possible_filing, artifact, originals, delivery, declared_completion, not_group_end_case` | Exists | View | The read exists. The trigger does not (CMD-48). |
| RM-O8 | Owned incidents | OP-08 | `ops.incidents` (`operations-work.ts:235`), `ops.incident` (`:248`) | Exists | View | Owned or named as reviewer. |
| RM-O9 | Originals register | OP-09 | `ops.case_work.caseWork.originals[]` per application only | Partial | Kind 1 candidate | Core holds every original (`ops.record_original_*`) but serves them per case. An operator-wide register over assigned applications meets criterion points 1, 3, 4 and removes a client-side join across N case reads (point 2). Interim View: OP-09 lists originals from the work list's case reads; acceptable only for small assigned sets. |

### 2.4 SuperAdmin (11)

| ID | Plan read model | Pages | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| RM-A1 | Decision inbox | SA-01 | `core.admin_queue {kind}` (`core.ts:415`) one kind per call (assistance, flags, deferrals); `core.assignment_queue` (`:386`); `ops.admin_incidents` (`operations-work.ts:241`); `pay.finance_index.requests`; `iam.admin_elevations`; `cat.admin_impact_index`; `intake.admin_incidents` | Partial | Kind 1 candidate; View interim | Seven reads for one inbox. The navigation counts already compose four of them (`attention.ts`). A single "decisions waiting" projection meets points 1, 3, 4 and removes a sequence of round trips on a P0 page (point 2). Interim View: the BFF composes, as the counts do today. |
| RM-A2 | SuperAdmin work queue | SA-02 | `views.admin_applications` (`views-cases.ts:112`): filters `taAccountId, offeringId, serviceMode, progress, pendingOwner, openFinancialException`; `asOf` | Exists | View | |
| RM-A3 | Assignment candidate | SA-03 | `core.assignment_queue` (`core.ts:386`): `rows, operators`; `core.assignment_plan` (`:392`): exact plan with per-item availability, nothing assigned | Exists | View | The plan preview is a read; the confirm is CMD-56. |
| RM-A4 | Oversight | SA-04 | `core.admin_case` (`core.ts:380`): `case, operators`; `views.admin_applications`; `intake.admin_attempts`; `views.audit_subject` (`bindings/views.ts:81`) | Exists | View | |
| RM-A5 | Offering administration | SA-05 | `cat.admin_index` (`bindings/catalogue-admin.ts:340`), `cat.admin_offering`, `cat.admin_declaration`, `cat.admin_baseline`, `cat.admin_preview`, `cat.admin_publication`, `cat.admin_impact_index`, `cat.admin_assessment`, `cat.public_site_status`, `ops.launch_overview` (`:500`), `ops.launch_offering` | Exists | View | The code's offering lifecycle (draft, bind, preview, publish, launch plan, approve launch, expand scope) is richer than SA-05 describes. See §5 group E. |
| RM-A6 | Accounts and grants | SA-06 | `iam.admin_accounts` (`identity-admin.ts:147`), `iam.admin_account`, `iam.operator_duties`, `iam.admin_elevations`, `iam.admin_grants` | Exists | View | `auditOk` on elevations and grants is an audit-health flag the page MUST show (second-person actions refuse while audit is unhealthy). |
| RM-A7 | Support view | SA-06 | Command `iam.start_support_view` (`identity-admin.ts:111`) and `iam.end_support_view`; then the TA queries marked "staff only in a support view" are served read-only on the staff instance | Exists | View | The plan models this as a read model. The code models it as a recorded command that opens a read-only scope. The pages are the TA pages on the staff instance. |
| RM-A8 | Money and exposure | SA-07 | `pay.finance_index`, `pay.ta_finance`, `pay.application_payments`, `pay.follow_up_list`, `pay.follow_up_item`, `pay.ceiling_change` (`bindings/payments.ts`) | Exists | View | `auditHealthy` on `pay.ta_finance` gates the second-person approval. |
| RM-A9 | Incident and audit | SA-08 | `ops.admin_incidents` (`operations-work.ts:241`), `ops.incident`; `views.audit_search` (`views.ts:58`) with projection judgement; `views.audit_subject` (`:81`) from the fact log | Exists | View | |
| RM-A10 | Reporting health | SA-01, SA-08 | `views.projections` (`views.ts:118`), `views.monitors`, `views.monitoring_queue` (`views-cases.ts:13x`), `views.measures` (`views.ts:103`) | Exists | View | `views.monitors.pendingBoundary` counts the cases waiting on the two boundaries (`contracts/views-cases.ts:66`). SA-01 SHOULD show it. |
| RM-A11 | Gate decision context | SA-09 | `core.admin_case.case.gateExceptions[]` (`contracts/core.ts:322`) | Exists | View | |

### 2.5 Bulk upload (5)

| ID | Plan read model | Pages | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| RM-B1 | Import attempt | BU-P04, BU-P05, BU-P08, BU-P09, TA-05 | `intake.attempt_page {attemptId, page}` (`bindings/intake.ts:2xx`): `attempt{state, stateCode, rowsTotal, rowsTerminal, rowsAccepted, rowsIncident, chainNo, revision}`, `rows[]` 100 per page, `questions, services, files, chain`; `intake.group_page` | Partial | Kind 1 candidate (counts); View (as-of) | BULK §4.2 asks for counts per outcome. The view has four counts; failed, excluded, superseded and routed rows are hidden inside `rowsTerminal` (survey gap 1, P1). Row states exist as facts (`kernel/vocabulary/intake.ts`), so per-state counts in the attempt view meet criterion points 1 to 4; points 5 and 6 are implementation duties. This is the strongest Kind 1 case in the inventory. Until then the page MUST show "Unavailable" for those counts (D7), never a subtraction. As-of: authoritative read; the BFF stamps the read time (View). |
| RM-B2 | Source interpretation | BU-P03 | `intake.attempt_page.questions[]` with options (`select_tab, header_row, column_mapping, service_label, date_order, row_pattern_mixed, systematic_fault, correction_match_confirm`), `files[]` | Partial | View | Questions, scope and blocking are served. "Discovered counts" and "representative values" per column were not found as view fields; BU-P03 MUST render what the question options carry and mark the rest unavailable. If representative values are needed, that is a Kind 1 question with an unknown source (the parsed sheet lives in Core's temporary space); not recommended. |
| RM-B3 | Intake issue detail | BU-P06 | `intake.incident_page` (`intake.ts:308`); `intake.row_page` (`intake.ts:2xx`): `row, files, services, incidents, matched` | Exists | View | Owner kind `ta` or `superadmin` is a view fact. |
| RM-B4 | Correction preview | BU-P07 | none. A corrected sheet starts a new attempt in the chain (`intake.correction_upload`); the match question `correction_match_confirm` is answered per attempt; rows end as `corrected`, `correction_refused`, `untouched_by_correction`, `superseded_by_correction` | Missing | Kind 2 if kept as a preview | A before/after preview that is computed but not applied is new behavior (a held, un-applied correction plan over a parsed sheet in the sandbox), not a projection of recorded facts. View alternative: BU-P07 shows the chain result after processing, with the match question as the only decision point. The architect recommends the View alternative. |
| RM-B5 | Import review queue | BU-P10, BU-P05 | `intake.attempt_page.rows[].services[]{applicationId, outcome}` joined with `core.ta_applications` or `views.ta_applications {groupId, progress}` | Partial | View; Kind 1 if latency fails | The filter facts (needs TA attention, ready for review, submitted, awaiting another owner) are the application list's facts. The BFF joins row outcomes to applications. A projection would meet points 1, 3, 4; point 2 only if the join fails on large imports. |

### 2.6 Cross-cutting: freshness

UI-PLAN rule D4/D6 asks every read model for an as-of time. In the code, 10 of 83 queries carry a full
freshness marker (the projections: `asOf{asOfSeq,healthy,lagMs}` or `computedAt`), 8 carry a partial one and
65 carry none (survey Table E). The 65 are authoritative reads: they are current at the read transaction.
Classification: **View only**. The BFF stamps the read time on authoritative views and shows the projection's
own `asOf` and `healthy` on projected views. No Core change. The page MUST label the two differently ("read
at" against "as of sequence, N s behind").

## 3. Commands

Columns: plan command row (UI-PLAN §7; bulk rows from BULK §2), actor and K rule as the plan states them; the
Core command(s) with their binding; status; bucket; note. A byte release is cited by its `/v1/bytes/<route>`.

| ID | Plan command | Actor, K | Code | Status | Bucket | Note |
|---|---|---|---|---|---|---|
| CMD-1 | Request sign-in code | TA, K-OTP | `iam.request_ta_otp` (`bindings/identity.ts:100`); bot check `altcha` | Exists | View | PD §5 names Turnstile. The code uses ALTCHA server-side, fail-closed. A provider swap is Core and edge configuration, not UI. |
| CMD-2 | Verify sign-in code | TA, K-OTP | `iam.verify_ta_otp` (`identity.ts:110`); issues `sessionToken` once, never on replay | Exists | View | |
| CMD-3 | Staff sign-in | Op, SA, K-OTP | `iam.request_staff_otp` (`:105`), `iam.staff_sign_in` (`:119`) code plus TOTP | Exists | View | |
| CMD-4 | Enrol MFA factor | Op, SA, K-STD | `iam.open_enrolment` (`:128`), `iam.staff_enrol` (`:140`) | Exists | View | |
| CMD-5 | Sign out | Any, K-STD | `iam.sign_out {scope}` (`:144`) | Exists | View | |
| CMD-6 | Create group | TA, K-STD | `core.create_group` (`bindings/core.ts:449`) | Exists | View | |
| CMD-7 | Edit group travel dates | TA, K-STD | `core.edit_travel_dates` (`core.ts:450`) | Exists | View | |
| CMD-8 | Create draft application | TA, K-STD | `intake.start_individual {groupId, applicant, offeringIds, files}` (`bindings/intake.ts:62`) | Exists | View | One command creates the application(s) from the applicant form, the chosen offerings and staged files. TA-09 MUST be shaped as that one submit, not as "create empty, then fill". |
| CMD-9 | Save draft section | TA, K-STD | `core.edit_draft {applicationId, fields, nationality, passportType, declaredCountry}` (`core.ts:458`) | Exists | View | One edit command; a "section" is a subset of `fields`. |
| CMD-10 | Upload document | TA; Op (artifact), K-STD | `doc.upload_for_application` (`intake.ts:85`), `doc.replace_version` (`:89`); operator artifact `ops.record_artifact` (`operations-work.ts:304`) | Exists | View | Staging first: `POST /v1/uploads` streams the bytes; the command names the staged ref. |
| CMD-11 | Submit application | TA, K-STD | `core.submit {applicationId, confirmations, quotedPricePaise, estimateStart, estimateEnd}` (`core.ts:454`) | Exists | View | TA-08 MUST carry the confirmations and the quoted price it shows; Core rechecks them. |
| CMD-12 | Request help | TA, K-STD | `core.request_assistance` (`core.ts:466`) | Exists | View | |
| CMD-13 | Report a problem | TA, K-STD | `core.report_problem` (`:467`), creates a hold | Exists | View | |
| CMD-14 | Decide price increase | TA, K-STD | `core.decide_price_increase` (`:470`) | Exists | View | |
| CMD-15 | Acknowledge notice | TA, K-STD | `dlv.acknowledge_notice` (`delivery.ts:158`) | Exists | View | Refused for a notice that asks no acknowledgement. |
| CMD-16 | Mark notice read | Any, K-STD | none; notices carry `acknowledgedAt` only (`contracts/delivery.ts:91`) | Missing | Kind 2 (default no) | A persisted read marker is a new fact. Recommendation: drop the row. "Unread" on the page means "asks for acknowledgement and has none". A per-browser marker is View only and MUST NOT claim to be a record. |
| CMD-17 | Request withdrawal | TA; Op; SA, K-STD | `core.request_withdrawal` (`:469`); `core.record_applicant_withdrawal` (`:498`); `core.record_operational_withdrawal` (`:517`) | Exists | View | Three commands, one per actor and evidence shape. |
| CMD-18 | Retrieve result file | TA, K-BYTE (`B46 BOUNDARY` in the plan) | `POST /v1/bytes/dlv.retrieve_document` with `subjectKind: document_version`; an official-result version is recorded as the artifact that holds it (`modules/delivery/release.ts:160`); release check, then stream; `/end` reports the browser leg | Exists | View | The plan's boundary marker on download is wrong. Download needs a recorded release check, not a send. The denial codes are view facts (`dlv.delivery_page.files[].denyCode`). |
| CMD-19 | Start email change; verify current-address code; verify new-address code | TA, K-OTP | `iam.start_email_change` (`identity-admin.ts:73`), `iam.confirm_email_change {emailChangeId, proof, code}` (`:84`), `iam.cancel_email_change` (`:94`) | Partial | View | The code confirms in one step with a proof and a code; the plan describes two verification steps. TA-12 adopts the code's shape and adds Cancel. |
| CMD-20 | Upload source workbook | TA, K-STD | `POST /v1/uploads` purpose `spreadsheet`, then `intake.start_bulk {upload}` (`intake.ts:66`) | Exists | View | Format and size are refused at edge before Core sees a byte (`apps/shared/uploads.ts`). |
| CMD-21 | Read source | TA, K-STD | `intake.start_bulk` (`intake.ts:66`); discovery and preflight run as Core tasks after accept | Exists | View | The result arrives through the attempt state. BU-P02 and BU-P03 MUST reload or poll the attempt view, never assume. |
| CMD-22 | Answer mapping question | TA, K-STD | `intake.answer_question {attemptId, questionId, optionCode, optionRef}` (`intake.ts:70`) | Exists | View | |
| CMD-23 | Choose service for scope | TA, K-STD | `intake.answer_question` with a `service_label` question | Exists | View | |
| CMD-24 | Start import | TA, K-BATCH | none as a separate command. Answering the last blocking question enqueues parse and plan (`modules/intake/commands/answer-question.ts:159-169`) | Partial | View | An explicit "Start import" confirm step would be Kind 2 (a new wait state). Recommendation: View only. BU-P03's Start button submits the last answer and says so. |
| CMD-25 | Retry eligible failures | TA, K-BATCH | none. `intake.resume` resumes only `paused_actor_revoked` (`commands/resume.ts:40`); `intake.correction_upload` re-runs rows through the chain | Missing | Kind 2 (default no) | A retry of failed rows in place is new behavior. The code's answer to a failed row is a corrected sheet (chain) with the Nth identical retry resolved to the same effect (`modules/intake/rows.ts:3, 128`). Recommendation: BU-P08 offers "Correct this import", not "Retry". |
| CMD-26 | Abandon intake issue | TA, K-STD | `intake.dispose_incident` (`intake.ts:79`) as TA | Exists | View | |
| CMD-27 | Read revised source | TA, K-STD | `intake.correction_upload {attemptId, refetch, upload, altcha}` (`intake.ts:74`) | Exists | View | |
| CMD-28 | Apply corrections | TA, K-BATCH | applied by processing of the correction attempt; the only decision is the `correction_match_confirm` question | Partial | View | See RM-B4. A separate apply step is Kind 2. Recommendation: View only. |
| CMD-29 | Check operation status | Any, read | `core.operation {operationKey}` (`kernel.ts:29`): `accepted`, `in_progress`, `no_record_yet`, `not_recorded`; page `/<surface>/operations/:operationKey` | Exists | View | See RM-S3 for the list form. |
| CMD-30 | Confirm readiness | Op, K-STD | `ops.record_readiness {applicationId, basisDigest, note}` (`operations-work.ts:286`) | Exists | View | The basis digest binds readiness to what the operator saw (D4). |
| CMD-31 | Save assistance entry | Op, K-STD | `core.record_assistance_entry` (`core.ts:483`) | Exists | View | |
| CMD-32 | Return for TA review | Op, K-STD | `core.formal_return {applicationId, note, resolveProblemHoldId}` (`core.ts:478`) | Exists | View | Same command as CMD-33. |
| CMD-33 | Return to TA | Op, K-STD | `core.formal_return` | Exists | View | The plan has two rows for one command. Merge them in the rewrite. |
| CMD-34 | Flag to SuperAdmin | Op, K-STD | `core.flag` (`:481`) | Exists | View | |
| CMD-35 | Request deferral | Op, K-STD | `core.propose_deferral` (`:496`) | Exists | View | |
| CMD-36 | Authorize external action | Op, K-EXT | `core.authorize_external_act {applicationId, actKind, readinessId, basisDigest, confirmIrreversible, ...}` (`core.ts:488`) | Exists | View | `confirmIrreversible` is an input, so the page's K-EXT confirmation is a real field, not decoration. |
| CMD-37 | Record external action evidence | Op, K-EXT | `ops.record_act_evidence {authorizationId, fromState, result, evidence 1..5, eventAt, feePaidPaise}` (`operations-work.ts:292`) | Exists | View | Results: `filed_evidenced`, `not_filed_evidenced`, `filing_unknown` (`kernel/vocabulary/operations.ts:18`). |
| CMD-38 | Mark execution uncertain | Op, K-STD | `ops.record_act_evidence` with `result: filing_unknown` | Exists | View | Not a separate command. |
| CMD-39 | Record reconciliation evidence | Reconciliation owner, K-STD | `ops.record_reconciliation_attempt {method, result, evidence, note, conclude, feePaidPaise}` (`:296`) | Exists | View | Methods and results closed (`operations.ts:26, 30`). `conclude` records the act evidence in the same command. |
| CMD-40 | Release packet (`B46 BOUNDARY`, OC-09); Record packet handover | Op, K-BYTE; K-STD | `core.release_packet {applicationId, packetId}` (`core.ts:492`) is a served command, not a boundary; `ops.request_packet_build` (`operations-work.ts:291`) builds; `dlv.record_handover` (`delivery.ts:159`) | Exists | View | OC-09 is answered by the code: packet release is a recorded command by the assigned operator; the TA then downloads through the byte release. The plan's boundary marker is wrong. |
| CMD-41 | Record provider handoff; record provider filing evidence | Op, K-STD | `dlv.record_direct_external` (`delivery.ts:169`); `ops.record_act_evidence`; reconciliation method `provider_contact` | Partial | View | "Provider" is not a code concept. The code records a direct external delivery and act evidence. OP-04 uses those names. |
| CMD-42 | Record outcome | Op, K-STD | `ops.record_official_result {outcome, evidence, eventAt, artifact}` (`:300`); cancelled path `core.record_outcome` (`:353`) | Exists | View | |
| CMD-43 | Confirm artifact association | Scoped reviewer, K-STD | `ops.confirm_artifact_association` (`:30x`); reject: `ops.reject_artifact_association` (`:310`) | Exists | View | OP-05 MUST offer both confirm and reject. |
| CMD-44 | Send result | `B46 BOUNDARY`, K-EXT | `dlv.queue_document_email` is a deliberate boundary (`delivery.ts:175`): Core answers the boundary, nothing runs. Only a labelled harness queues `mail.deliver`. Production has no mail transport. | Missing (boundary) | Kind 2 | OD §2 (10 Oct: applies to Opus) decided the policy: the assigned operator sends through Send result with Core rechecks. Building it is a Core behavior change plus a production transport (PD): a Kind 2 proposal with its own lane. The UI rewrite shows the boundary until then. |
| CMD-45 | Record delivery evidence | Op, K-STD | `dlv.record_handover`, `dlv.record_direct_external` | Exists | View | Evidence 1 to 5 items. |
| CMD-46 | Record manual email | Op, K-STD | `dlv.record_manual_email` (`delivery.ts:165`), never system-verified | Exists | View | |
| CMD-47 | Open association incident | server; Op on contradiction, K-STD | automatic on a failed association; `ops.open_incident {kind, applicationId, ...}` (`operations-work.ts:325`) | Exists | View | |
| CMD-48 | Request completion | `B46 BOUNDARY`, K-STD | `core.check_completion` is a deliberate boundary (`delivery.ts:176`) | Missing (boundary) | Kind 2 | OD §3 decided the policy: explicit completion request; Core owns the invariant; no force or auto complete. The prerequisites view exists (RM-O7); `core.authorize_unresolved_completion` exists (CMD-59). The trigger command is a Kind 2 proposal. Residual (DECISIONS §1.3): an unassigned case is assigned first (SA-03). |
| CMD-49 | Record incident evidence; record correction and notice; close incident | Incident owner, K-STD | `ops.record_incident_evidence` (`:318`), `ops.post_disclosure_notice` (`:315`), `ops.resolve_incident` (`:321`) then `ops.close_incident` (`:324`) | Exists | View | Two steps: resolve with evidence, then close. The plan's one "Close" row maps to both. |
| CMD-50 | Block document version | Incident owner, K-STD | none. Protection marks are made by Core; the only command is `core.resolve_protection_mark` (`contracts/core.ts:148`). A wrong-recipient release opens a disclosure incident (`ops.report_wrong_recipient`, `:31x`) | Missing | Kind 2 (default no) | A manual block on a version is a new fact with document-handling effect. Recommendation: drop the row; OP-08 offers "Report wrong recipient" and the incident flow. |
| CMD-51 | Record original receipt; movement; holder uncertain; owner receipt | Op, K-STD | `ops.record_original_receipt` (`:33x`), `ops.record_original_movement {kind, parts, toHolder, uncertainty, possessionAttested, evidence}` (`:34x`), `ops.record_original_return` (`:346`), `ops.link_original` (`:340`) | Exists | View | "Holder uncertain" is the `uncertainty` field of a movement. Return is allowed only under an owner-approved return policy of every linked declaration. |
| CMD-52 | Decide help request | SA, K-STD | `core.decide_assistance` (`core.ts:509`) | Exists | View | |
| CMD-53 | Dismiss intake issue | SA, K-STD | `intake.dispose_incident` as SuperAdmin, reason required | Exists | View | |
| CMD-54 | Decide deferral | SA, K-STD | `core.decide_deferral` (`:513`) | Exists | View | |
| CMD-55 | Assign reviewer; assign incident owner | SA, K-STD | `ops.assign_incident_reviewer` (`operations-work.ts:328`). Owner: set when the incident opens (`ownerKind, ownerAccountId`, `contracts/operations-work.ts:146`); no change command | Partial | View (reviewer); Kind 2 for an owner change (default no) | Recommendation: SA-08 assigns a reviewer. An owner change is proposed only if UAT shows an orphaned incident. |
| CMD-56 | Assign operator | SA, K-BATCH | `core.assign` (`core.ts:501`); `core.assign_selection {mode, items, operators, plan}` (`:503`) after `core.assignment_plan` preview | Exists | View | The plan preview and the confirm are two calls; the confirm carries the plan it previewed. |
| CMD-57 | Reassign operator | SA, K-STD | `core.reassign` (`:502`) | Exists | View | |
| CMD-58 | Record exceptional correction | SA, K-STD | `core.correct_from_evidence {kind, outcome, evidenceRef, identityChanges, fields, reason}` (`:52x`) | Exists | View | |
| CMD-59 | Record unresolved external outcome | SA, K-STD | `core.authorize_unresolved_completion {applicationId, futureOwnerAccountId, reason}` (`contracts/core.ts:134`), served | Exists | View | Evidence for RF-07: the command records an authorization that names a future owner. It is not a boundary and does not complete the case. The plan's reading stands. |
| CMD-60 | Publish offering values | SA, K-STD | `cat.edit_baseline` (`catalogue-admin.ts:239`), `cat.preview_baseline` (`:278`), `cat.publish_baseline` (`:279`); declarations: `cat.preview_declaration` (`:267`), `cat.publish_declaration` (`:271`) | Exists | View | |
| CMD-61 | Record structural approval | SA, K-STD | `cat.record_owner_approval` (`:259`) | Exists | View | |
| CMD-62 | Record existing-work treatment | SA, K-BATCH | `ops.record_existing_work_treatment {offeringId, fields}` (`:316`) | Exists | View | One command per offering; the batch effect is inside Core. |
| CMD-63 | Launch; suspend; lift suspension; withdraw offering | SA, K-STD | `ops.approve_launch` (`:305`), `ops.suspend_offering` (`:313`), `ops.lift_suspension` (`:319`), `ops.withdraw_offering` (`:323`, irreversible acknowledgement) | Exists | View | `ops.record_launch_plan` and `ops.expand_launch_scope` precede and follow launch; no plan row (§5). |
| CMD-64 | Create account | SA, K-STD / K-2P | `iam.create_account` (`identity-admin.ts:95`); second person: `iam.approve_account` (`:99`) | Exists | View | |
| CMD-65 | Change account status | SA, K-STD | `iam.approve_account`, `iam.decline_account`, `iam.activate_account`, `iam.suspend_account {acknowledgeLastSuperAdmin}`, `iam.restore_account` (`:99-103`) | Exists | View | |
| CMD-66 | Request elevation; approve elevation | SA, K-2P | `iam.request_elevation` (`:105`), `iam.approve_elevation` (`:107`), `iam.decline_elevation` (`:108`) | Exists | View | SA-06 MUST offer decline. |
| CMD-67 | Reset credentials | SA, K-STD | `iam.reset_credentials` (`:104`) | Exists | View | |
| CMD-68 | Grant read access; revoke read access | SA, K-STD | `iam.create_group_read_grant {granteeAccountId, groupId, purpose, validUntil}` (`:109`), `iam.revoke_grant` (`:110`) | Exists | View | |
| CMD-69 | Record service payment; correct payment record | SA, K-STD | `pay.record_service_status {kind, status, correctsEntryId, amountPaise, evidence, eventAt}` (`payments.ts:144`) | Exists | View | Correction is the same command with `correctsEntryId`. |
| CMD-70 | Record government fee fact | SA, K-STD | no SuperAdmin fee command. Fee facts enter through the operator's act evidence (`feePaidPaise`, CMD-37, CMD-39). `pay.exclude_fee` is a parked boundary. Fee records are read in `pay.ta_finance.fees` | Partial | Kind 2 (default no) | Recommendation: SA-07 shows fee records read-only. A SuperAdmin fee entry or correction is a Kind 2 proposal tied to the parked fee exclusion. |
| CMD-71 | Lower ceiling; request increase; approve increase | SA, K-STD / K-2P | `pay.lower_ceiling` (`:149`), `pay.request_ceiling_increase` (`:150`), `pay.approve_ceiling_increase` (`:151`, refused while audit is unhealthy), `pay.decline_ceiling_increase` (`:154`) | Exists | View | `expectedCeilingBasis` is an input: the page carries the basis it displayed. |
| CMD-72 | Record gate exception | SA, K-STD | `core.grant_gate_exception {gate, action, reason}` (`core.ts:507`); `core.revoke_gate_exception` (`:508`) | Exists | View | SA-09 MUST offer revoke. |

### 3.1 Bulk per-page actions (BULK §2)

The bulk pages reuse the command rows above. The mapping is given once so the rewrite does not invent a
second vocabulary.

| Page | Plan actions | Command rows | Status |
|---|---|---|---|
| BU-P01 | Choose entry mode; choose group; create group | CMD-6 | Exists |
| BU-P02 | Choose source; enter URL; choose file; Read source | CMD-20, CMD-21 | Exists |
| BU-P03 | Answer question; choose worksheet or header; choose service; do not use column; Start import | CMD-22, CMD-23, CMD-24 | Partial (CMD-24, View) |
| BU-P04 | View results; check status | CMD-29 | Exists |
| BU-P05 | Switch view; filter; select; review; correct; next issue | reads only (RM-B1, RM-B5) | Partial (RM-B1 counts) |
| BU-P06 | Replace document; choose service; correct mapping; report a problem; request help; abandon issue | CMD-10, CMD-23, CMD-22, CMD-13, CMD-12, CMD-26 | Exists |
| BU-P07 | Provide revised source; open affected item; apply corrections; review current version | CMD-27, CMD-28 | Partial (RM-B4 Missing, View alternative) |
| BU-P08 | Check result; retry eligible failures; history | CMD-29, CMD-25 | Missing (CMD-25, Kind 2 default no) |
| BU-P09 | Open import | reads only | Exists |
| BU-P10 | Submit; back to import; next application | CMD-11 | Exists |

## 4. Core change requests that fall out of the inventory

Ranked. Each Kind 1 item is a candidate until a reviewer checks the six points on a written proposal.
Each Kind 2 item needs the §3.2 gate; the default is no.

| # | Rank | Item | Kind | Why it ranks here | Scenario if not done |
|---|---|---|---|---|---|
| 1 | P1 | Per-state row counts in the intake attempt view (RM-B1) | Kind 1 | Facts exist; BULK §4.2 is a P0 page; today the page cannot show rejected or pending without subtraction, which D7 forbids. | A travel agent imports 800 rows and reads "Unavailable" for rejected and pending until processing ends; the only way to count rejected rows is to page through them 100 at a time. |
| 2 | P1 | Send result (CMD-44) and Request completion (CMD-48) | Kind 2, two proposals | Policy decided (OD §2, §3). Each is a new behavior plus, for the send, a production transport (PD). Own lane each. Not a UI item. | Until built, OP-06 and OP-07 show the boundary and the monitors count the cases waiting on it (`pendingBoundary`). |
| 3 | P2 | SuperAdmin decision inbox projection (RM-A1) | Kind 1 | Seven reads on the P0 landing. The BFF interim works today for the counts. | SA-01 renders in seven round trips; acceptable at current volumes, measured before a proposal. |
| 4 | P2 | Operator originals register (RM-O9) | Kind 1 | Facts exist per case; a cross-case register removes an N-read join. | OP-09 lists originals only for the cases on the work list's first page. |
| 5 | P2 | Recent operations list (RM-S3) | Kind 1, conditional | Only if UAT shows the per-browser interim fails after a refresh on a P0 page. | A travel agent refreshes after a lost acknowledgement and cannot find the receipt without the key. |
| 6 | P2 | Import review queue projection (RM-B5) | Kind 1, conditional | Only if the BFF join fails on large imports. | BU-P10 "next application" pauses on a 1,000-row import. |
| Rejected by the architect (recorded, not proposed) | | Mark notice read (CMD-16), Retry eligible failures (CMD-25), Block document version (CMD-50), incident owner change (CMD-55), SuperAdmin fee fact (CMD-70), Correction preview (RM-B4), explicit Start import (CMD-24) and Apply step (CMD-28) | Kind 2 | Each is "the UI is easier this way" or adds a wait state the code resolves otherwise. Max MAY reopen any of them with a §3.2 proposal. | |

## 5. Code commands with no plan command row (57)

The plan was written from the specifications. The code serves 53 commands, and carries 4 parked boundaries,
that no plan command row names. The rewrite MUST place each served command on a page, or Max MUST decide to
hide it. Hiding a served command is a product decision, not a UI choice. Grouped by what a page would
naturally carry. Group A lists the commands that §3 already attaches to a plan row in a note; they still need
their own acceptance line in the rewrite.

| Group | Commands | Count | Likely home |
|---|---|---|---|
| A. Counterparts already noted under a plan row | `iam.decline_elevation` (CMD-66), `pay.decline_ceiling_increase` (CMD-71), `core.revoke_gate_exception` (CMD-72), `iam.cancel_email_change` (CMD-19), `iam.start_support_view` and `iam.end_support_view` (RM-A7), `ops.resolve_incident` (CMD-49), `ops.reject_artifact_association` (CMD-43), `ops.request_packet_build` (CMD-40), `ops.report_wrong_recipient` (CMD-50), `ops.link_original` (CMD-51) | 11 | the page of the plan row named |
| B. Travel-agent case capabilities | `core.close_group`, `core.correct_identity`, `core.hand_back`, `core.decide_transition`, `core.link_dependency`, `core.unlink_dependency`, `core.apply_held_correction`, `doc.associate`, `doc.resolve_extraction`, `doc.confirm_classification`, `intake.abandon`, `intake.resume` | 12 | TA-05, TA-07, TA-09; document version page; BU-P05 |
| C. Operator work capabilities | `ops.start_work`, `ops.record_work_step`, `ops.withdraw_readiness`, `core.record_forecast`, `core.end_deferral`, `core.recheck_travel_dates`, `core.resolve_hold`, `ops.record_effort_sample`, `dlv.manual_resend` | 9 | OP-02, OP-04, OP-06 |
| D. SuperAdmin capabilities | `iam.set_accounting_grant`, `doc.requeue_check`, `doc.requeue_bulk`, `core.respond_flag`, `core.propose_price_increase`, `core.resolve_protection_mark`, `pay.reassign_follow_up_owner`, `ops.classify_failure`, `ops.record_launch_plan`, `ops.expand_launch_scope` | 10 | SA-02, SA-04, SA-05, SA-06, SA-07, SA-08; documents queue |
| E. Catalogue authoring | `cat.create_country`, `cat.set_country_listing`, `cat.create_offering`, `cat.draft_declaration`, `cat.request_impact_recheck`, `cat.retire_offering`, `cat.bind_declaration`, `cat.retire_declaration_draft`, `cat.assign_impact_reviewer`, `cat.decide_impact_items`, `cat.approve_transition` | 11 | SA-05 and its sub-pages (`/admin/catalogue/**`) |
| F. Deliberate boundaries, parked (correct that the plan has no row) | `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`, `pay.record_refund` | 4 | SA-07 shows the boundary as Core answers it |

Count check: 11 + 12 + 9 + 10 + 11 + 4 = 57. Of the 144 commands, 87 are named by a plan command row (85
served and the 2 B46 boundaries CMD-44 and CMD-48) and 57 are not (53 served and the 4 parked boundaries).

Note on `dlv.manual_resend` (group C): resend is allowed from a `failed` send only; an `uncertain` send
refuses it (`contracts/delivery.ts:83`). This is consistent with OD §4 (uncertain is not success; no automatic
resend). OD §4 also asks for a privileged authorization path for resend under ambiguity; no such command
exists. If Max wants it, it is a Kind 2 proposal.

## 6. Effect on the open items of the plan

| Item | Effect of the inventory |
|---|---|
| OC-09 (packet release owner, `B46 BOUNDARY` in UI-PLAN §13.1) | Answered by the code: `core.release_packet` is a served command of the assigned operator; download is a recorded byte release. No owner choice remains. Proposed disposition: close; Max confirms. |
| RF-07 (P1, disputed: SuperAdmin records `external_outcome_unresolved` on SA-04) | `core.authorize_unresolved_completion` is a served command that records an authorization naming a future owner. It is not a boundary and does not complete the case. The plan's reading stands; the reviewer's B46 concern does not apply. Proposed disposition: close as "plan correct"; Max confirms. |
| OC-10 | Not touched by the API surface. Remains Max's. |
| B46 (closed by OD §2, §3) | Two Kind 2 proposals (§4 item 2). The UI shows the boundaries until built. |
| Plan rows marked `B46 BOUNDARY` on download (CMD-18) and release (CMD-40) | Marker wrong; both exist. Correct the plan in the rewrite pass, not now. |

## 7. What was not checked

- Runtime behavior, tests and the UAT installations. The survey ran handlers only with a recording stand-in.
- Policy modules (`src/modules/*/policy`): who may run each command at runtime. The actor columns repeat the
  route inventory and the command comments.
- The private contract (foundation record §21) against the code.
- The exact view fields of `intake.attempt_page` for BU-P03 (RM-B2): the questions and options were read; a
  field-by-field check against BULK §4.3 was not done.
- The 8 October page-behavior score is not re-measured here.
