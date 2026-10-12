# WP-11 design review: reconciliation and unresolved outcome

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-11
holds commands that close the filing state of an external act, record an outcome, change application data and lift a
post-restore hold, so a Codex design review applies).
Product base: lane repository at f78e558 (WP-01 shell and result components, WP-20 public site, WP-02 U0 decision and
panel components, WP-03 U0 bands and evidence rows). WP-06, WP-07, WP-08, WP-09 and WP-10 are designed and not built;
this design depends on their units named in §1.7. This document writes no product code. Paths in `file:line` form are
relative to the lane repository at f78e558 unless they start with `REC/` (`internal/records/`) or `RM` (lane
`research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at f78e558. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Three register commands (COMMAND-COVERAGE §3, §5.1): `core.authorize_unresolved_completion` (SA-09 kind
  `unresolved_outcome`), `core.correct_from_evidence` in its two shapes (SA-09 kinds `correct_outcome` and
  `correct_fields`), `core.resolve_protection_mark` (SA-09 kind `protection_mark`, CC-04). The SuperAdmin application
  page SA-04a is rebuilt on its kept path in the OP-02 layout without operator actions: every earlier package left it
  "Not rebuilt (SA-04, WP-11)". The operator side of V11 (record and reconcile an attempted act after an assignment or
  rule change) stays on WP-07's OP-04 pages; WP-11 extends them with seven text and table amendments (F-22 to F-28)
  and does not redesign them. SA-01 groups 12 and 15 get their links. The SA-04 read pages (list, search, group,
  SuperAdmin delivery view) are a separable phase 2 (Q-W11-02).
- **What Core does (facts, §1.2).** The unresolved decision closes every act in `filing_unknown` as
  `reconciliation_exhausted`, records the outcome `external_outcome_unresolved`, posts the travel agent a notice and
  stores a future owner of later official facts. It does **not** complete the application (UI-PLAN SA-04 says it
  does: deviation D-W11-09). A field correction is applied, or held unchanged while an act is authorized or its filing
  is unknown, and refused once reconciliation is exhausted or the application is filed, released or closed. An outcome
  correction swaps Issued and Refused only, before any delivery. A protection mark resolution has no revision guard;
  a second resolution answers `stale_revision`.
- **Page model.** SA-04a `/admin/applications/:id?tab=overview|application|acts|delivery` (kept path, rebuilt). Four
  kinds on WP-06's route `/admin/applications/:id/decide/:kind`, none with a subject (D-W11-02). The POST paths, form
  actions, hidden inputs and field names stay. Two protocol changes: the field correction maps identity input from the
  posted values (D-W11-03, the WP-03 C-04 and WP-09 D-W09-05 class), and it offers the served `fields` shape as
  `field.<key>` inputs (D-W11-04). No handler truncates input (LD-17, D-W11-06).
- **Findings worked (§9.1).** WP-07 tells the reader of an exhausted act that "A SuperAdmin records the unresolved
  outcome" after it was recorded; WP-08 shows the travel agent "No filing is in doubt" after an unresolved outcome
  (Core reports the prerequisite met); WP-07 tells a new operator after a reassignment to "perform the act only if it
  has not been attempted", which that operator cannot know; the correction handler reads Core at POST time (replay
  drift); five LD-17 truncations; the mark refusal loses the typed evidence; the unresolved form shows no attempts, no
  owner and no effect; UI-PLAN claims a completion that Core does not record.
- **STOP items (§9.4).** No P0. Three P1: STOP-W11-01 (Kind 1) the mark's facts on the staff read; STOP-W11-02
  (Kind 1) the future owner, decider, reason and time of an exhausted act on the staff read; STOP-W11-03 (API surface
  defect plus Kind 1) `core.apply_held_correction` is on the edge allowlist only, so a released SuperAdmin or operator
  correction has no route although Core names a staff owner for it, and held corrections are not on the staff read.
  Five P2 notes.
- **Top questions (§9.2).** Q-W11-01 kind name `unresolved_outcome`; Q-W11-02 phase 2 SA-04 read pages in WP-11;
  Q-W11-03 mark kind without subject; Q-W11-04 `field.<key>` on the field correction; Q-W11-05 future-owner options;
  Q-W11-06 deterministic identity mapping; Q-W11-08 proof writes on `lane-ui`.
- **Proof (§6).** V11 on `lane-ui` with synthetic data: an uncertain act reconciled by the new operator after a
  reassignment and a travel-date change, the unresolved decision, the historical records intact, no new filing on any
  page for any role, a later official fact as a follow-up, and the outcome correction. Protection marks and held
  corrections run as tests (no product path creates them on `lane-ui`).

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.1, §2.2 (outcome and filing rows), §2.3, §3.1 steps 6–9, §3.2 (unknown external execution; completed case with continuing duty), §3.3, §5.1, §5.3 (manual filing), §5.4, §6.1, §6.2, §6.3 (exception, recovery boundary), §7.4, §8.3, §10.1, §12 V10, V11 |
| `BUILD_SPEC.md` r2 | B19, B20, B23, B24, B33, B34, B35, B40 |
| `UI-PLAN.md` | §1, §3.3 OP-04, §3.4 SA-01, SA-04, SA-09, §5.3 OP-04, §5.4 SA-01, SA-04, SA-09, §6, §7, §8, §10, §11, §12.2 WP-11, §13 |
| `DECISIONS-2026-10-10.md` | §1.3, §1.5, §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-14, LD-17), §7, §8 (S-06, S-08); `PROPOSALS.md`; `COMMAND-COVERAGE.md` §3, §5, §6, §6.1; `WP-02.md` (CMP-25); `WP-06.md` §3, §4 (D-02, D-08, D-10); `WP-06-design.md` §1.2–§1.6, §2.0, §2.1, §2.7; `WP-07.md` §3, §4 (F-01 to F-21); `WP-07-design.md` §1, §2.0, §2.3, §2.4.2, §2.4.5, §2.4.6, §2.7, §2.8, §2.11, §4, §6; `WP-08.md` §3, §4 (E-01 to E-15); `WP-08-design.md` §1.2, §1.5, §2.1, §2.4, §2.11; `WP-09.md` (G-01 to G-11); `WP-09-design.md` §1.4–§1.6, §2.0, §2.10, §7, §9; `WP-10.md` (H-01 to H-14); `WP-10-design.md` §1.8, §2.0, §2.9, §2.11.1; `REPO/DESIGN.md` |
| Route map (RM) | §1; §2 rows D11, D12, D21, D23, D26, D30, D73, D118, O17 to O20; §2.3 D08; §3.1 `core.admin_case`, `ops.case_work`, `views.admin_applications`, `views.monitors`; §3.2 the three commands |
| Code (read models, commands, guards) | Pages: `src/apps/staff/core/admin.ts:40-55, 209-355, 400-460, 598-635`, `src/apps/staff/core/case.ts:230-275, 375-420`, `src/apps/staff/views/cases.ts`, `src/apps/shared/core/shared.ts` (`CORE_MESSAGES`), `src/apps/shared/delivery/pages.ts:170-195`, `src/apps/shared/pages/intake.ts:80-120`, `src/web/ui/presentation.ts:106-135`, `src/web/ui/decision.ts`, `src/web/ui/shell.ts` (`SURFACE_CONFIG.admin`). Contracts: `src/contracts/core.ts:50-55, 91, 134-148, 189-205, 286-345`; `src/contracts/operations-work.ts:60-70, 166-204`; `src/contracts/views-cases.ts:40-125`. API surface: `src/core-api/allowlists.ts:37-90`; `src/core-api/bindings/core.ts:118-135, 255-305, 437-440, 476, 518-528`; `src/core-api/server.ts:395-405`. Core behaviour only: `src/modules/core/commands/acts.ts:160-215`, `src/modules/core/commands/admin.ts:1-167`, `src/modules/core/commands/drafts.ts:150-200`, `src/modules/core/corrections.ts`, `src/modules/core/controls.ts:100-120, 290-360, 470-520`, `src/modules/core/derived.ts:160-200, 280-425`, `src/modules/core/store.ts:340-365, 418-421, 495-516`, `src/modules/core/writers.ts:70-90, 140-160, 270-352`, `src/modules/core/facade.ts:180-195`, `src/modules/operations/case-work/commands/acts.ts`, `src/modules/operations/case-work/commands/results.ts:95-125`, `src/modules/identity/api.ts:106-111`, `src/modules/identity/policy.ts:190-211`, `src/kernel/vocabulary/external-acts.ts`, `src/kernel/command.ts:248-262` |
| Tests that pin the pages | §7.3 |

### 1.2 What Core does (facts the pages rest on)

| Command | Input (wire, `src/contracts/core.ts`) | Guards, in Core's order | Effects | Result summary |
|---|---|---|---|---|
| `core.authorize_unresolved_completion` (`acts.ts:169-215`; policy `outcome.authorize_unresolved`: SuperAdmin) | `applicationId`, `futureOwnerAccountId` (`text(40)`), `reason` (`text(1000)`; Core: 20 to 1000 characters after trim, `zLongReason`); `_rev.application` → `expectedRevision` | Locks the application and each act; revision (`stale_revision`); no outcome (`control_blocked/outcome_already_recorded`); at least one act `filing_unknown` and no act `authorized` (`control_blocked/act_state_transition_invalid`); every `filing_unknown` act has an attempt whose result is `no_information` or `inconclusive` (`control_blocked/reconciliation_attempt_missing`); the future owner is an active operator or SuperAdmin with a second factor (`validation_failed`, field `futureOwnerAccountId`, `not_active_staff`). No control stage runs: a protection mark does not stop it | Posts the travel agent the notice `external_outcome_unresolved` (`refiling: not_implied`, no acknowledgement); every `filing_unknown` act → `reconciliation_exhausted` with the future owner, the decider and the reason; fact `core.unresolved_completion_authorized`; outcome `external_outcome_unresolved` (`recordOutcome`: an open price increase is superseded, dependents are evaluated). Lifecycle stays Submitted. Money records do not change. Held corrections stay held | `{ applicationId }` only |
| `core.correct_from_evidence`, kind `outcome` (`admin.ts:41-71`; policy `application.correct_from_evidence`: SuperAdmin) | `kind`, `applicationId`, `outcome` (`text(40)`), `evidenceRef` (`text(120)`), `reason` (10 to 1000) | Evidence present (Core's input parse, `kernel/command.ts:251-252`: field `evidence`, `too_small`, when the reference is blank); revision; business evidence (field `evidence`, `business_evidence_required`); open lifecycle; current outcome Issued or Refused; target differs (`validation_failed/correction_no_change`); no retrieval and no accepted result email; no dependent failed because of it (all three `control_blocked/outcome_correction_not_allowed`). No control stage runs | Outcome swapped; fact `core.outcome_corrected` with before and after and the evidence; dependents evaluated again. No notice | `{ applicationId }` only |
| `core.correct_from_evidence`, kind `fields` (`admin.ts:72-95`) | `kind`, `applicationId`, `identityChanges` (surname, given names ≤100; date of birth ≤10; nationality, issuing country ≤3; passport number ≤30; no passport type), `fields` (≤100 keys, values ≤500), `declaredCountry` (≤3), `evidenceVersionIds` (≤4), `evidenceRef`, `reason` | Revision; business evidence; controls stages 3, 6, 7, 8 (`protection_mark_active`; `application_not_open`; `correction_historical_after_filing` when filed, packet released or closed; `filing_possibly_occurred` when reconciliation is exhausted); same-person evidence for a changed identity detail (`identity_same_person_evidence_insufficient`); a change exists (`correction_no_change`); population scope (`population_out_of_scope`); an applicant-key change meets the key guards (`duplicate_open_scope`, `reconciliation_exhausted_no_refiling`, `later_attempt_declaration_required`) | Stage rule (`corrections.ts:36-45`): applied (new information version; readiness basis changes; identity documents evaluated again) or **held** unchanged while an act is `authorized` or `filing_unknown`. The assigned operator gets a notice. A held correction becomes `superseded_by_filing` with a post-filing incident on filed evidence, or `released_for_reapply` on non-filing evidence (`writers.ts:286-327`) | `{ applicationId, correctionId, stage }` |
| `core.resolve_protection_mark` (`admin.ts:143-165`; policy `protection_mark.resolve`: SuperAdmin) | `markId`, `applicationId` (`text(40)`), `evidenceRef` (required), `reason` (10 to 1000) | The mark belongs to the application (else `not_found_or_forbidden`); the mark is still active (else `stale_revision`). No application revision | Mark `resolved` with the evidence, reason, actor and time; application revision +1; fact `core.protection_mark_resolved` | `{ applicationId, markId }` |

Related facts:

- **Reconciliation** (`ops.record_reconciliation_attempt`, WP-07 OP-04b): the actor MUST be the assigned operator
  (`requireAssigned`); the act MUST be open (`authorized` or `filing_unknown`). No control stage runs, so a suspended
  offering, a travel-date change or a catalogue change does not stop it. The live act state is used; the form posts
  no `fromState` (WP-07 F-10).
- **After exhaustion.** Authorization of any act is refused `reconciliation_exhausted_no_refiling` (`controls.ts:335`).
  An official result recorded later opens an `official_fact_follow_up` incident owned by the future owner and keeps
  the outcome (`writers.ts:340-350`). A new application for the same applicant, service and group is refused
  `duplicate_open_scope` while this one is open, and `reconciliation_exhausted_no_refiling` after it closes
  (`writers.ts:73-84`). Completion treats an exhausted act as no possible filing only under this outcome
  (`derived.ts:173-176`); the completion step itself stays the deliberate boundary (LD-04, CMD-48).
- **Marks.** Engineering records a mark after an interval-loss restore (`facade.ts:180-195`, B40) with
  `possibly_filed`, `possibly_paid`, `possibly_released` and the restore id. An application can hold several marks
  (one per restore); Core reports the earliest active one. A mark holds every guarded action with stage 3
  (`controls.ts:102-119`: assignment, reassignment, work, readiness, authorization, packet release, byte release,
  withdrawal, corrections) and makes the SuperAdmin the pending owner (`derived.ts:292`). The staff read carries only
  `mark_id` (`bindings/core.ts:288`; STOP-W11-01).
- **Staff read gaps.** The act row has no future owner, decider, reason or exhaustion time (`contracts/core.ts:307-310`;
  STOP-W11-02). The attempt row has no note (`operations-work.ts:180-183`). The staff read has no held or released
  corrections (STOP-W11-03).

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry. "opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| SA-04a | Application (SuperAdmin) | `/admin/applications/:applicationId?tab=overview\|application\|acts\|delivery` | Kept (`admin.applications.detail`), rebuilt; tabs by query value (D-W11-01) | `core.admin_case`; opt. `ops.case_work`; opt. `dlv.packet_handovers` (as today, for the staff reading); opt. `doc.application_evidence` (Application tab only); opt. `pay.application_payments` (Overview only, gate rows as WP-06 SA-07a) |
| SA-09u | Decision: record the external outcome as unresolved | `/admin/applications/:applicationId/decide/unresolved_outcome` | Kind added to WP-06 route `admin.decisions.application` | `core.admin_case`; opt. `ops.case_work` |
| SA-09o | Decision: correct the recorded outcome | `…/decide/correct_outcome` | Kind added | `core.admin_case`; opt. `ops.case_work`; opt. `dlv.delivery_page` |
| SA-09e | Decision: correct application details from evidence | `…/decide/correct_fields` | Kind added | `core.admin_case` |
| SA-09m | Decision: resolve the protection mark | `…/decide/protection_mark` | Kind added (no subject: the application's current active mark, D-W11-02) | `core.admin_case`; opt. `ops.case_work` |
| OP-04a, OP-04b, OP-02 | WP-07 operator pages | as WP-07 | WP-07 pages; WP-11 amendments F-22 to F-28 (§1.8, §2.6) | as WP-07 |
| OP-05, OP-07, TA-07r | WP-08 pages | as WP-08 | WP-08 pages; amendments E-16, E-17 (§1.8) | as WP-08 |
| SA-01 | Decision inbox (WP-06 page) | `/admin` | WP-06 page; groups 12 and 15 lines and links (§2.7) | as WP-06 |
| SA-04l, SA-04s | Applications; Search (phase 2) | `/admin/applications`, `/admin/search` | Kept, rebuilt in phase 2 (Q-W11-02) | `views.admin_applications`; `views.search` |
| SA-04g | Group (phase 2) | `/admin/groups/:groupId` | Kept, rebuilt in phase 2 | `core.admin_group` |
| SA-04d | Delivery (SuperAdmin, phase 2) | `/admin/applications/:applicationId/delivery` | Kept, rebuilt in phase 2 | `dlv.delivery_page`; `core.admin_case` |

The SA-09 route already validates `applicationId` (`zWireId('app')`) and `kind` (a closed enumeration); WP-11 adds
four values. A parse failure is the uniform 404. The `tab` value of SA-04a is a closed set; an unknown value is ignored
and `overview` applies (SH-R06). `from` is not used on SuperAdmin pages.

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| SA-04a | Applications & groups › Applications `/admin/applications` | "Applications & groups › Applications › [applicant]" |
| SA-09u, SA-09o, SA-09e, SA-09m | Applications & groups `/admin/applications` | "Applications & groups › Applications › [applicant] › [decision]"; the applicant links to SA-04a |
| SA-04l, SA-04s, SA-04g, SA-04d | Applications & groups | "Applications & groups › Applications" (› "[group label]" / "› [applicant] › Delivery") |

No rail change. The SA-09 kinds of earlier packages keep their own `current` (WP-06: Work queues; WP-07: Money &
exposure). The SA-04a "History" item is a link to the full audit subject page `/admin/audit/application/<id>`
(SA-08, D-W11-10), not a tab: a SuperAdmin's history is the full audit (UX §2.3 row "History").

### 1.5 The WP-11 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `core.authorize_unresolved_completion` | `admin.applications.unresolved_completion` (`/admin/applications/:applicationId/unresolved-completion`) | **SA-09u** (moved from the SA-04a "Ending the case" disclosure) | `futureOwnerAccountId` (select), `reason` | `application` | Every field read whole (LD-17: no `slice(0, 40)`); success `receiptLocation('/admin/applications/<id>/decide/unresolved_outcome', 'unresolved', key)`; refusal re-renders SA-09u with both values |
| 2 | `core.correct_from_evidence` (kind `outcome`) | `admin.applications.correct_from_evidence` (`/admin/applications/:applicationId/correct-from-evidence`) | **SA-09o** (moved from the SA-04a "Outcome" disclosure) | `kind`=`outcome` (hidden), `outcome` (hidden, the target), `evidenceRef`, `reason` | `application` | The handler maps a posted `kind` other than `fields` to the outcome shape (as today) and re-renders SA-09o; `outcome` read whole; success `receiptLocation('…/decide/correct_outcome', 'corrected', key)` |
| 3 | `core.correct_from_evidence` (kind `fields`) | same route | **SA-09e** (moved from the SA-04a disclosure "Correct details from evidence") | `kind`=`fields` (hidden), `surname`, `givenNames`, `dateOfBirth`, `passportNumber`, `issuingCountry`, `nationality`, `declaredCountry`, `field.<key>` (new, D-W11-04), `evidence.<dov id>`=`yes`, `evidenceRef`, `reason` | `application` | Identity input mapped from the posted values with no read at POST time (D-W11-03); every tick and every `field.<key>` read (no `slice(0, 4)`); success `receiptLocation('…/decide/correct_fields', 'corrected', key)`; refusal re-renders SA-09e with every typed value and every tick |
| 4 | `core.resolve_protection_mark` | `admin.protection_marks.resolve` (`/admin/protection-marks/:markId/resolve`) | **SA-09m** (moved from the SA-04a banner disclosure) | `applicationId` (hidden; a contract field), `evidenceRef`, `reason` | — (Core has none) | `applicationId` read whole; success `receiptLocation('/admin/applications/<id>/decide/protection_mark', 'mark', key)` with `<id>` from the result resource; refusal re-renders SA-09m from the hidden `applicationId` when it matches the application id pattern, else today's answer (the shell page) (D-W11-07) |

Each command has exactly one host page for each use (CC-12 to CC-14), so a refusal re-renders the page it came from.
The receipt codes keep today's names (`unresolved`, `corrected`, `mark`); each host page has its own expectation.

### 1.6 Forms that leave pages, and carried forms

Forms that leave SA-04a (today the old case page, `admin.ts:308-355`): the unresolved disclosure, the outcome
correction disclosure, the field correction disclosure and the mark disclosure. SA-04a keeps the facts and links:
"Record the external outcome as unresolved" (External acts tab and Decisions list), "Correct the recorded outcome"
(Delivery & originals tab), "Correct details from evidence" (Application & documents tab), "Resolve the protection
mark" (banner and action panel).

Carried on SA-04a (LD-07: a served command keeps its page; each keeps its markup, fields, action and `?done=` flash
until its package rebuilds it). A unit test lists them by action path (§7.2).

| Command (route) | Owner | Place on SA-04a |
|---|---|---|
| `core.propose_price_increase` (`admin.applications.price_increase`) | WP-17 | Application & documents, section "Price and timing" (today `admin.ts:288-295` inside `timingSection`) |
| `core.record_operational_withdrawal` (`admin.applications.operational_withdrawal`) | WP-17 | Overview, section "Ending the case". While an act is possibly filed the section shows CMP-10 first: "Ordinary withdrawal is unavailable: a filing may have happened." and the carried form under the trigger "Record the operational request only" (WP-07 §2.4.6 pattern, D-W07-15) |
| `core.decide_deferral` (`admin.deferrals.decide`) | WP-17 | Overview, section "Deferral" |
| `core.recheck_travel_dates` (`admin.applications.travel_recheck`) | WP-17 | Overview, section "Travel-date recheck" (when Core reports it pending) |
| Links of WP-06, WP-07, WP-09 (SA-03a, SA-03c, SA-09g, SA-09r, Gate 2, readiness kinds, SA-09h, SA-09f) | WP-06, WP-07, WP-09 | Overview, Decisions list (§2.1.4); gate exceptions table with "Revoke" links |
| SuperAdmin single-file retrieval with purpose and reason (`admin.delivery.retrieve`, `.packet_retrieve`) | WP-11 phase 2 (SA-04d) | The old SuperAdmin delivery view, linked from Delivery & originals; unchanged until phase 2 |

The carried WP-17 POST handlers stay in `src/apps/staff/core/admin.ts`; their refusal re-render calls the SA-04a
renderer that U1 exports (`oversightAgain(ctx, state)`), so a refused price proposal still shows its error at its
form.

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07, CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12, CMP-13, CMP-14. WP-02 U0: CMP-25
`decisionPage`, CMP-01 `actionPanel`, `statusFacts`, `objectTabs`. WP-03 U0: CMP-02 `evidenceRows`, CMP-11
`identityBand`. WP-06 U0: `admin-context.ts` (SuperAdmin header meta and status facts), CMP-06 `queueTable`; WP-06 U4:
the SA-09 registry and routes. WP-07 U0: `src/apps/staff/work/reading.ts` (act state words, owner labels, possibly
filed set) and `frame.ts` (protected-state banner, status fact builders). WP-08 U0: `src/apps/shared/delivery/words.ts`
(completion sentences). WP-09 U2: `postedIdentity(fields)` and the unsent text block. WP-10 U0: the shape words.

Dependency: WP-11 builds after WP-06 (U0, U4, U6), WP-07 (U0, U2, U4), WP-08 (U0, U1, U2, U3), WP-09 (U2, U5) and
WP-10 (U0) are integrated. WP-11 MUST NOT build a second decision frame, banner, band or word table. Where it needs a
new word, it adds a row to the owner's closed table (§1.8, unit U5).

### 1.8 Amendments to designed packages

Found while designing WP-11. Each binds the build of the named package if it is not built yet; otherwise WP-11 U5
applies it. The architect records them in the package records (WP-07.md §4.4, WP-08.md §4.3), as WP-09 and WP-10 did.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W11-01 → **F-22** | WP-07 §2.8.2 OP-04b banner of `reconciliation_exhausted` | P1 | Replace "Reconciliation exhausted. Refiling is never implied. A SuperAdmin records the unresolved outcome (WP-11)." by: "Reconciliation exhausted: a SuperAdmin recorded the outcome 'External outcome unresolved'. Whether the [act] reached the authority could not be established. It stays treated as done: it is never repeated, and no new [act] is offered. If an official result arrives later, record it on Outcome and result file; it opens a follow-up and does not change the outcome." The act state `reconciliation_exhausted` exists only after that decision (`acts.ts:198-213`). |
| AM-W11-02 → **F-23** | WP-07 §2.7.2 OP-04a state "Reconciliation exhausted"; §2.4.2 checklist row; §2.13 | P1 | Text: "A new [act] is never offered for this application: the filing of an earlier act could not be established (External outcome unresolved). No exception exists for this control." No owner and no route (no person can lift it; "Owner: SuperAdmin" implied one could). Checklist row status "No exception exists for this control". |
| AM-W11-03 → **F-24** | WP-07 §2.3 frame item 4 and item 5; §2.8.1 state words | P1 | Protected-state banner item for an act in `reconciliation_exhausted` (every tab, `warning`): "External outcome unresolved: the filing of the [act] could not be established. It is treated as done and never repeated." Status fact words: "Reconciliation exhausted: filing unknown" (by shape, §2.9). |
| AM-W11-04 → **F-25** | WP-07 §2.8.6 OP-04b refusals | P2 | `control_blocked/act_state_transition_invalid` on the reconciliation or evidence form when the re-read act is `reconciliation_exhausted`: "A SuperAdmin closed this act's reconciliation (External outcome unresolved). Nothing was recorded. Record a later official result on Outcome and result file." The typed note shows in the unsent text block. |
| AM-W11-05 → **F-26** | WP-07 §2.8.2 OP-04b banner of `filing_unknown` | P1 | Add the next step (UX §3.2 "owner and next step"): "If the attempts cannot establish the filing, a SuperAdmin may record the outcome as unresolved. That needs at least one attempt that found no information or was inconclusive." |
| AM-W11-06 → **F-27** | WP-07 §2.4.2 group "Holds and open decisions" route column | P2 | `reconciliation_exhausted_no_refiling` routes nowhere ("No exception exists for this control"); `held_correction_released` routes to SA-04a for a SuperAdmin correction, with the STOP-W11-03 line. |
| AM-W11-07 → **F-28** | WP-07 §2.8.2 OP-04b banner of `authorized`; §2.4.5 action panel row 2; F-01 instruction | P1 | By viewer. Viewer = `authorized_by`: the F-01 text stays ("Perform the act only if it has not been attempted. If you attempted it, record the evidence now, or mark the execution uncertain."). Viewer ≠ `authorized_by` (a reassignment): "Authorized by [name] at [time] IST. It may have been performed. You did not request this authorization: do not perform the act under it. Record what you can establish: the evidence, or that the execution is uncertain." Action panel row 2 step: "Record what happened to the act [name] authorized". No text tells a non-authorizer to perform the act (B23: reassignment proves neither filing nor non-filing; V11 "without being offered unauthorized new filing"). Test with an authorization replayed after reassignment (extends F-01's tests). |
| AM-W11-08 → **E-16** | WP-08 §2.4 OP-07 and §2.11 TA-07r, prerequisite `no_possible_filing` met form | P1 | When `outcome = external_outcome_unresolved`: staff "Filing could not be established: recorded as External outcome unresolved"; travel agent "TravelMudra could not confirm whether its external step went through. This is recorded as the outcome." Never "No filing is in doubt" for this outcome (Core reports the prerequisite met, `derived.ts:175`). By shape for a provider handoff (WP-10 §2.11.1). |
| AM-W11-09 → **E-17** | WP-08 §2.1 OP-05 item 10 | P2 | "External outcome unresolved: recorded by a SuperAdmin after the reconciliation attempts could not establish the filing. A later official fact opens a follow-up owned by the person the SuperAdmin named, and does not change the outcome." |
| AM-W11-10 | WP-03 TA-07 status fact "Outcome" (`outcomePresentation` meaning for the travel agent); WP-08 TA-10 `noticeText` | P2 | Travel agent meaning of `external_outcome_unresolved`: "TravelMudra could not confirm whether its external step reached the authority. It is treated as done: TravelMudra does not file this application again. If an official result arrives later, TravelMudra records it." Notice text unchanged ("The external outcome could not be confirmed."), plus "TravelMudra does not file this application again." The staff meaning keeps the current text. |
| AM-W11-11 | WP-06 §2.1 SA-01 groups 12 and 15 | P2 | §2.7. |
| AM-W11-12 | WP-06 §2.7.5 kind table | P2 | Kinds `unresolved_outcome` (was `unresolved_completion`), `correct_outcome`, `correct_fields`, `protection_mark` (no subject; was subject `pmk`). |
| AM-W11-13 | WP-10 §2.11.1 shape sentences | P2 | Exhausted provider handoff: staff "Whether the handoff to the provider happened could not be established. It stays treated as done: the application is never handed over again."; travel agent neutral (AM-W11-10). |

## 2. Page specifications

### 2.0 Rules common to every WP-11 page

- **Freshness (LD-08).** Every WP-11 read is authoritative. Pages show CMP-12 "Read at [time] IST". No page applies an
  age threshold. No page shows how long ago an act became uncertain, and no text derives a filing state from time
  (UX §3.2: elapsed time is never "not filed").
- **Page states.** S1: pages render complete on the server. S6, S7: SH-02 pages of WP-01 (uniform 404 with no object
  facts; neutral "TravelMudra is unavailable now"; "Nothing was sent, so nothing changed" only after a proven
  refusal). Each page lists its own states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure shows "Unavailable" in place of the
  facts of that read. Every other refusal reaches the shell. No page code catches every error. When a decision page
  needs an optional read to show a state, and the read is unavailable, the form shows and Core decides (WP-09
  Q-W09-07 rule), with the line "[What] cannot be read now. TravelMudra checks it when you record the decision."
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>`; CMP-08 first in `main`; its title first
  in the document title. A receipt names a result only when `core.operation` returns the expected resource id and the
  command-specific summary fields (§2.10); every later read is labelled "Current". Otherwise it is neutral ("Request
  recorded"; WP-06 D-02; S-08 pending). REJ: the host page re-rendered at the POST address with `restorePath` = the GET
  page, the category's status, CMP-07 focused, every typed value kept; sentences from §2.12; an unknown code shows the
  category text plus "Reference code: [code]". When the refusal shows that the form no longer applies, the page shows
  the new state and the WP-09 unsent text block. A field refusal from the contract (`validation_failed/input_invalid`
  with `too_big` or `too_small`, `src/core-api/server.ts:398-403`) shows at its field. C5: CMP-14 (§2.11). UNR: 303 to
  `/admin/operations/<key>` (CMP-13); no page offers a new submission of the same intent while it is unresolved.
- **K rules.** All three commands: K-STD. A form carries one `_op` from page load; a browser resend reuses it; a
  re-render after a refusal issues a new `_op`. A deliberately new decision (after a refusal) is a new operation.
- **Core decides.** A decision page removes its form only for a state that Core's guard decides from facts the page
  reads (§2.2 to §2.5 state tables name the guard). Every other case shows the form and Core decides. No page computes
  a permission.
- **No input truncation (LD-17).** Every handler reads every field whole and every indexed or ticked row. Input over a
  contract limit is sent unchanged and Core's contract refuses it at the field; the page keeps the values. A handler
  never sends Core less than the user chose.
- **Copy.** UI-PLAN §11. Every time carries "IST". Synthetic data shows "Synthetic" (CR-08). Forbidden on WP-11 pages:
  "Completed" or "completion" for the unresolved decision (it records an outcome, D-W11-09); "Authorise" (spelling);
  "Override", "Force", "Admin override"; "not filed", "lapsed", "timed out" or "expired" for an uncertain act; "refile",
  "file again", "retry" as an offer; "Resolved" for an unresolved outcome; "Something went wrong". The words "refiling
  is never implied" and "is never repeated" are allowed in negation. All copy is draft (CR-09).
- **Support view.** `/admin` pages answer 409 `support_view_active` in a support view (RM §1 item 4); no WP-11 page is
  reachable there. The operator pages keep WP-07's rule.
- **Mobile (< 768 px).** One column. SA-04a: identity band → protected-state banner → action panel → tab links
  (wrapping) → content. The SA-09 pages are full-screen task pages: scope and effect before the fields; the primary
  action at the end of the form, never in a fixed bar. Tables of acts, evidence and attempts stack to labelled cards.

### 2.1 SA-04a Application (SuperAdmin) `/admin/applications/:applicationId`

Purpose: authorized oversight of one application, its history and the bounded decisions a SuperAdmin may record
(UX §6.2 "Applications & groups"; UI-PLAN SA-04: "application or group detail in the OP-02 layout without operator
actions → full history → decision entry points").

#### 2.1.1 Frame (every tab)

1. Breadcrumb (§1.4); freshness.
2. Receipt (carried WP-17 `?done=` flashes until WP-17; no WP-11 receipt lands here).
3. Identity band (CMP-11 through WP-06 `admin-context.ts`): `h1` "[SURNAME], [Given names]"; "Application [reference]"
   (`identifier` with copy). Meta: "Passport ending [last 2 characters]" (masked; the full number only on the
   Application tab and SA-09e, the task contexts); Service; Kind (shape words, WP-10); Group (link SA-04g); Travel
   agent ("account suspended" when `taSuspended`); Operator (name, or "Not assigned"); "Synthetic" when synthetic.
4. Protected-state banner: WP-07 `frame.ts` builder with AM-W11-03 (every tab; alert order): protection mark ("Held
   after a restore: a protection mark holds every guarded action until a SuperAdmin resolves it with evidence." +
   link "Resolve the protection mark" → SA-09m); `filing_unknown` (WP-07 fixed sentence); `authorized`;
   `reconciliation_exhausted` (F-24); open problem report, return, flag; deferral; travel-date recheck.
5. Status facts (`statusFacts`): Progress; Outcome ("Outcome not recorded"; for `external_outcome_unresolved` the
   staff meaning, §2.9); Next ("[owner]: [step]", the staff reading); Stage; Editing; External acts (one line per
   act, §2.9 words); Readiness (validity words; "recorded by [operator] at [time] IST" from opt. `ops.case_work`);
   Holds; Service payment (`servicePayment` words of WP-06, link "Service payment" → SA-07a); Gate exceptions open
   ("[n] open" or "None open"); Originals (only when any); Delivery evidence (from the `delivery` prerequisite).
6. Action panel (CMP-01) "Next decision" (§2.1.3).
7. Tabs (`objectTabs`, links): Overview `?tab=overview` (default), Application & documents `?tab=application`,
   External acts `?tab=acts`, Delivery & originals `?tab=delivery`; then the link "Full audit history" →
   `/admin/audit/application/<id>`. The current tab has `aria-current="page"`.

#### 2.1.2 Overview tab

1. Section "Decisions on this application" (`id="decisions"`, §2.1.4).
2. Section "Assignment" (WP-06 facts and links: "Operator: [name]" / "No operator assigned"; "Assign an operator" →
   SA-03a or "Reassign" → SA-03c).
3. Section "Gate exceptions" (WP-06/07 read-only table with "Revoke" per granted row → SA-09r; links to the Gate 1,
   Gate 2 and readiness kinds when Core's facts show the gate).
4. Section "Holds" (read-only table; links to SA-09f for an unanswered flag and to SA-09h for an open help request).
5. Carried sections (§1.6): "Deferral", "Travel-date recheck", "Ending the case".

#### 2.1.3 Action panel "Next decision" (closed table, first match)

Facts: Core's pending answer (`pending.ownerKind`, `reasonCode`, `nextActionCode`) through the staff reading. The
panel states no permission.

| # | Condition (Core facts) | Owner shown | Step | Blocker type | Action |
|---|---|---|---|---|---|
| 1 | `reasonCode = protection_mark_active` | You (SuperAdmins) | "Resolve the protection mark with evidence of what the restore may have lost" | "A SuperAdmin decision can resolve it" | "Resolve the protection mark" → SA-09m |
| 2 | `reasonCode = assigned_operator_inactive` | You | "Reassign: the assigned operator is not active" | "A SuperAdmin decision can resolve it" | "Reassign" → SA-03c. With an act in `authorized` or `filing_unknown`, the line "The new operator owns the reconciliation of [act]." |
| 3 | `nextActionCode = assign_operator` | You | the WP-06 step words | Gate 1 → "A SuperAdmin decision can resolve it" | "Assign an operator" → SA-03a |
| 4 | `nextActionCode = decide_assistance` | You | "Decide the help request" | — | "Approve help" → SA-09h `assistance_approve`; secondary "Decline help" |
| 5 | `nextActionCode = respond_to_flag` | You | "Respond to the operator's flag" | — | "Respond to the flag" → SA-09f |
| 6 | `nextActionCode = review_deferral`, `reasonCode = deferral_proposed` | You | "Decide the proposed deferral" | — | "Go to the deferral" (`#deferral`, carried WP-17) |
| 7 | `reasonCode = held_correction_released`, owner `superadmin` | You | "A correction held while a filing was uncertain was released by evidence that it was not filed" | "Unavailable in this release" | none. Line: "Applying a released correction again is not available on staff pages in this release (STOP-W11-03). Record the correction again from evidence if it is still needed." + link "Correct details from evidence" → SA-09e |
| 8 | `nextActionCode = run_travel_recheck`, owner `superadmin` | You | the step words | — | "Go to the recheck" (`#travel-recheck`, carried WP-17) |
| 9 | `nextActionCode = reconcile_filing` | "[operator]" (assigned operator) | "Waiting on [operator]: reconcile whether the [act] was filed" | "Another person owns this step" | none; secondary "Open the external acts" (`?tab=acts`). When §2.2's guard facts hold: secondary "Record the external outcome as unresolved" → SA-09u |
| 10 | owner is not a SuperAdmin | the WP-07 owner label | "Waiting on [owner]: [step]" | "Another person owns this step" | none. Line for an operator step: "The assigned operator makes this judgement." (UI-PLAN SA-04, B18) |
| 11 | owner `unresolved_known_limitation` | "Not available in this release" | Core's sentence (WP-08 owner "product owner" for the completion and send boundaries) | "Policy unavailable" | none |

#### 2.1.4 Decisions list

One row per decision kind that applies to the application's facts now, in this order; each row: the decision, one
fact line, a link to its page. A row shows by Core facts on the read (the decision page shows the full state).

| Decision | Shown when (Core facts) | Fact line | Link |
|---|---|---|---|
| Resolve the protection mark | `mark ≠ null` | "Mark [reference] holds this application." | SA-09m |
| Assign / Reassign | open; WP-06 rule | WP-06 | SA-03a / SA-03c |
| Gate exceptions | open; WP-06/07 rules | WP-06/07 | SA-09g, Gate 2, readiness kinds |
| Help request, flag response | an open request; an unanswered flag | WP-09 | SA-09h, SA-09f |
| Record the external outcome as unresolved | `outcome = null` and an act in `filing_unknown` | "[n] act(s) with an unknown filing; [m] reconciliation attempts recorded." (`ops.case_work`, opt.; "Attempts: unavailable") | SA-09u |
| Correct the recorded outcome | open and `outcome` ∈ {`issued`, `refused`} | "Outcome now: [outcome]." | SA-09o |
| Correct details from evidence | open | "Information version [n]." | SA-09e |
| Deferral, price increase, operational withdrawal | as today | carried WP-17 | anchors |

No row is called "Override". A closed application shows "No decision applies to a closed application." and the
mark row only when a mark exists.

#### 2.1.5 Application & documents tab

Applicant facts with full identifiers (task context), information version, country of residence, passport type;
documents (CMP-02 `evidenceRows`, staff words; opt. `doc.application_evidence`; "Documents cannot be read now.");
identity documents an identity correction may rest on (`identityEvidence`, names and versions); Related applications
(WP-10 table); "Price and timing" (as today without "Amount due"; the carried WP-17 price disclosure); link "Correct
details from evidence" → SA-09e (open applications).

#### 2.1.6 External acts tab

1. Context line by shape (WP-07 §2.5.2): "The assigned operator performs, records and reconciles external acts. A
   SuperAdmin reads them here and records the unresolved outcome when the attempts cannot establish the filing."
2. One `h3` block per act, in Core's order: "[Act words]: [state words]" (§2.9); authorized by [name] at [time] IST;
   government fee reserved [₹] (fee-carrying act); reconciliation owner [name]. For `reconciliation_exhausted`: "Owner
   of a later official fact: not shown on this page (STOP-W11-02)", link "Audit history of this act" →
   `/admin/audit/authorization/<aut>`.
3. Under each act, from opt. `ops.case_work`: "Evidence records" table (`actEvidence` rows of this act: result words,
   references (kind and reference), event time, recorded by, recorded at) and "Reconciliation attempts" table
   (`reconciliationAttempts` rows of this act: method words, result words, concluded evidence (link to its row),
   recorded by, recorded at). Line under the attempts: "The notes of the attempts are not shown on staff pages in this
   release." (The note is stored with the attempt, not in its fact, so the audit page does not show it either;
   STOP-W11-08.) Every row stays
   as recorded; no row has an edit or delete control (B33, V11). When `ops.case_work` is unavailable: "Evidence
   records and attempts cannot be read now."
4. Link "Record the external outcome as unresolved" → SA-09u (when an act is in `filing_unknown` and no outcome).
5. Packet panel (preparation only, WP-10 words, read only).
6. Empty state: "No external act is authorized for this application."

#### 2.1.7 Delivery & originals tab

Outcome (status words; link "Correct the recorded outcome" → SA-09o when Issued or Refused and open); result files
(`caseWork.artifacts`, WP-08 §2.11 words, read only); completion prerequisites (WP-08 words with E-16; the completion
boundary CMP-10 of WP-08 §2.10, no control, CC-07); continuing duties (open incidents of this application with links
to `/admin/incidents/<id>`); originals (read only); link "Open the delivery view" → SA-04d (phase 2) or the old
SuperAdmin delivery view.

#### 2.1.8 States

| State | Condition | Copy and controls |
|---|---|---|
| Open, no possible filing | default | as above |
| Filing unknown | an act `filing_unknown` | Banner (WP-07 fixed sentence with the owner); panel row 9; Decisions row "Record the external outcome as unresolved" |
| Exhausted | an act `reconciliation_exhausted` | Banner F-24; Outcome "External outcome unresolved"; Decisions: no unresolved row, no field-correction offer state (SA-09e shows why) |
| Held by a mark | `mark ≠ null` | Banner first; panel row 1 |
| Completed | `lifecycle = completed` | `h2` "Processing completed" beside the outcome row; continuing duties listed; no decision rows except the mark |
| Ended with the group | `lifecycle = ended_with_group` | "This application ended with its group after the travel return date. This is not an outcome." |
| S4 `ops.case_work` unavailable | — | Readiness detail, evidence records, attempts, files: "Unavailable"; Decisions row line "Attempts: unavailable" |
| S4 `dlv.packet_handovers` unavailable | — | The staff reading uses Core's pending answer alone (as today) |
| Carried C2 (WP-17 forms) | refusal | The section's error at its form (re-render through `oversightAgain`) |

### 2.2 SA-09u Record the external outcome as unresolved, kind `unresolved_outcome`

Reads `core.admin_case`; opt. `ops.case_work` (evidence records and attempts).

1. Header: breadcrumb; `h1` "Record the external outcome as unresolved: [applicant]"; freshness.
2. `h2` "Scope": Application [reference] · Service · Kind (shape words) · Travel agent · Operator. "Acts: each act of
   this application whose filing is unknown: [act words, one per line]."
3. `h2` "Evidence":
   - Per act whose filing is unknown: state words; authorized by [name] at [time] IST; reconciliation owner [name];
     its evidence records and reconciliation attempts (tables as §2.1.6 item 3, with its line on the notes). Link
     per act → `/admin/audit/authorization/<aut>`.
   - Other acts of the application (one line each, state words).
   - Service payment (WP-06 words). Government fee: for a fee-carrying act in `filing_unknown`, "Payment unknown".
   - When `mark ≠ null`: warning line "A post-restore protection mark holds this application. The restore may have
     lost a record of this filing. Resolve the mark first if its evidence can establish the filing." Core does not
     stop the decision for a mark (§1.2; STOP-W11-07 note).
4. `h2` "Effect of this decision":
   - Changes: "Each act listed in the scope closes as 'Reconciliation exhausted'. Whether it reached the authority
     stays unknown, and it stays treated as done." · "The application's outcome becomes 'External outcome
     unresolved'." · "The travel agent receives the notice 'The external outcome could not be confirmed.'" · "The
     person you name owns any later official fact: when an official result arrives, recording it opens a follow-up
     that this person owns. The outcome does not change."
   - Unchanged: "No act is repeated, and no new external act is offered for this application. Refiling is never
     implied." · "Evidence records and reconciliation attempts stay exactly as recorded." · "Money records do not
     change: a government fee whose payment is unknown stays unknown and stays counted." · "The application is not
     completed. Completion still needs every requirement TravelMudra lists on Request completion; the completion
     step is not available in this release." · "Corrections held while the filing was unknown stay held and are never
     applied." · "A new application for the same applicant and service in this group is refused."
5. `h2` "Hard stops": "This decision never allows the act to be repeated. It is possible only while no act is
   authorized without recorded execution, and only after each act whose filing is unknown has at least one
   reconciliation attempt that found no information or was inconclusive."
6. `h2` "Your decision":
   - "Owner of any later official fact" `futureOwnerAccountId` (select, required, none preselected, placeholder
     "Choose a person"): one option per `operators` entry ("[name] (operator)"), then "You ([display name])" with the
     viewer's account id (D-W11-08). Hint: "An active operator or SuperAdmin with a second factor. They own the
     follow-up if an official result arrives later. Other SuperAdmins are not listed here." (STOP-W11-05.)
   - "Reason" `reason` (textarea, 4 rows, maxlength 1000, hint "At least 20 characters. Name the attempts and why no
     further attempt can establish the filing. Recorded with the decision and shown in the audit history.").
   - Hidden `_rev.application`.
7. Review (visible): "When you record it: [acts] close as reconciliation exhausted; the outcome becomes External
   outcome unresolved; the travel agent is notified; [the chosen person, filled by the script when one is chosen;
   'the person you choose' without it] owns any later official fact; your name, the reason and the time are recorded.
   It cannot be undone, and the act is never repeated."
8. Buttons "Record the unresolved external outcome" (primary, `destructive` variant: the page is the confirmation;
   WP-06 revoke precedent); "Cancel" → SA-04a `?tab=acts`. No confirmation checkbox (Q-W11-07; WP-10 Q-W10-08).

| State (first match) | Condition (Core facts) | Copy and controls |
|---|---|---|
| Closed | `lifecycle` ∉ {`draft`, `submitted`} | "This application is closed. Its outcome stays as recorded." No form |
| Decided | `outcome = external_outcome_unresolved` | "Recorded: the external outcome is unresolved. Acts closed as reconciliation exhausted: [acts]." Link "Full audit history". No form |
| Outcome recorded | `outcome ≠ null` | "The outcome is already recorded: [outcome]. An unresolved external outcome applies only before an outcome." No form (Core: `outcome_already_recorded`) |
| Execution not recorded | an act `authorized` | "[Act] is authorized and what happened is not recorded yet. The assigned operator records the evidence, or that the execution is uncertain, first. Owner: [operator]." No form (Core: `act_state_transition_invalid`) |
| No unknown filing | no act `filing_unknown` | "No act of this application has an unknown filing. This decision does not apply." No form |
| Attempt missing | `ops.case_work` read; an act in `filing_unknown` has no attempt with result `no_information` or `inconclusive` | "Each act whose filing is unknown needs at least one reconciliation attempt that found no information or was inconclusive. Missing for: [acts]. Owner: [reconciliation owner], on the act's page." No form (Core: `reconciliation_attempt_missing`) |
| Attempts unreadable | `ops.case_work` unavailable | The form shows with "The reconciliation attempts cannot be read now. TravelMudra checks them when you record the decision." |
| Allowed | otherwise | Items 6 to 8 |
| C3 `unresolved` | — | Receipt (§2.10); then "Decided" |
| C2 | — | §2.12; the owner choice and the reason kept |
| C5 | `stale_revision` | CMP-14 (§2.11) |

### 2.3 SA-09o Correct the recorded outcome, kind `correct_outcome`

Reads `core.admin_case`; opt. `ops.case_work` (result files); opt. `dlv.delivery_page` (downloads and emails).

1. `h1` "Correct the recorded outcome: [applicant]".
2. Scope: "The outcome of application [reference]: from [current outcome] to [target], from evidence. Target: the other
   of Issued and Refused."
3. Evidence: Outcome now; the filed act and its evidence references (the act evidence row of the filed act); result
   files (type, association, delivery words); downloads of the result by the travel agent ("Sent in full on [time] IST"
   rows, opt.); result emails accepted by the provider (opt.); "Applications that depend on this one are not listed on
   this page."
4. Effect: changes "The outcome becomes [target] now." · "Applications that depend on this outcome are evaluated again."
   Unchanged "The earlier outcome stays in the audit history with your evidence and reason." · "Result files, their
   association and their delivery records do not change." · "TravelMudra posts no notice for this correction." · "The
   external acts and their evidence do not change."
5. Hard stops: "Only Issued and Refused can be corrected, and only before the travel agent received the result in
   full, before a result email was accepted, and while no related application failed because of this outcome. After
   that the remedy is an owned incident (Incidents & audit)."
6. Your decision: "Evidence reference" `evidenceRef` (required; maxlength 120; hint "The reference that shows the
   correct outcome: the authority's reference or the document number."); "Reason" `reason` (hint "At least 10
   characters."); hidden `kind`=`outcome`, `outcome`=[target], `_rev.application`.
7. Review: "When you correct it: the outcome becomes [target] now; the previous outcome, your evidence, reason, name and
   time are recorded."
8. Buttons "Correct the outcome to [target]" (primary); "Cancel" → SA-04a `?tab=delivery`.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| Closed | not open | "The application is closed: its outcome is historical. An owned incident is the remedy." No form |
| No outcome | `outcome = null` | "No outcome is recorded yet." No form |
| Not correctable here | `outcome` ∉ {`issued`, `refused`} | "Only Issued and Refused can be corrected here." For `external_outcome_unresolved` add: "A later official fact is recorded on Outcome and result file and opens a follow-up; the outcome stays." No form |
| Delivered (warning only) | opt. delivery read shows a result download sent in full or an accepted result email | Line above the fields: "The result was delivered to the travel agent ([fact], [time] IST). TravelMudra refuses a correction after a delivery; an owned incident is then the remedy." The form shows; Core decides (the read is not Core's exact guard) |
| Allowed | otherwise | items 6 to 8 |
| C3 `corrected` | — | Receipt (§2.10) |
| C2 | `outcome_correction_not_allowed` | CMP-10 "This outcome can no longer be corrected here: the result was delivered, or a related application failed because of it. The remedy is an owned incident. Owner: SuperAdmin." Link "Incidents". Unsent text block |
| C2 | `correction_no_change` | "The outcome is already [target]. Nothing changed." (re-read state) |
| C2 | `validation_failed`, field `evidence` (`too_small` or `business_evidence_required`) | On `evidenceRef`: "Enter the evidence reference." |
| C5 | `stale_revision` | CMP-14: Outcome (you saw / current) |

### 2.4 SA-09e Correct application details from evidence, kind `correct_fields`

Reads `core.admin_case`.

1. `h1` "Correct application details from evidence: [applicant]".
2. Scope: "Application [reference]: identity details, country of residence[, application information]. Information
   version [snapshotVersionNo]."
3. Evidence: identity documents of this application (`identityEvidence`: requirement name and version reference); the
   external acts and their states (one line each); "Corrections held while a filing was uncertain are not listed on
   this page." (STOP-W11-03).
4. Effect, by the stage that Core's facts on the read show (the page states it; Core decides at the command):
   - No act possibly filed, nothing filed, packet not released: "The details change at once. A readiness judgement
     recorded before the change is out of date; the assigned operator confirms readiness again. The assigned operator is
     notified. Changed identity details are checked against the chosen document, and the application's identity
     documents are evaluated again."
   - An act `authorized` or `filing_unknown`: **"A filing may have happened. Your correction is recorded and held: the
     details do not change while the [act]'s filing is unknown. If evidence shows the act was filed, the held correction
     becomes a post-filing correction incident. If it shows it was not filed, the correction is released to be applied
     again by a SuperAdmin; applying it again is not available on staff pages in this release (STOP-W11-03)."** (B23
     "hold proposed corrections separately"; UX §3.2.)
   - Unchanged (both): "The earlier values stay in the history with your evidence and reason."
5. Hard stops: "A changed identity detail needs an identity document of this application that shows the new values
   and at least two unchanged details among surname, given names, date of birth and passport number. A statement alone
   is never enough. The population scope (Indian ordinary passport, resident in India) cannot change."
6. Your decision:
   - Identity: `surname`, `givenNames`, `dateOfBirth` (date), `passportNumber` (mono), `issuingCountry`, `nationality`
     (three-letter codes): prefilled with the exact stored values (no case change, so an unchanged value posts byte
     equal). Hint: "Change only what is wrong."
   - `declaredCountry` (three-letter code, prefilled).
   - Application information: one input `field.<key>` per `formFields` entry (kind, required, `maxLength`, options as
     declared; prefilled from `applicant.fields`); absent when the declaration has none (D-W11-04).
   - "Evidence": one checkbox `evidence.<dov id>` value `yes` per `identityEvidence` entry ("[Requirement] of this
     application, version [reference]"), never prechecked on a fresh form, restored from the posted values after a
     refusal (WP-09 G-07); "Evidence reference (optional)" `evidenceRef` (hint "Needed when no document is chosen.").
   - "Reason" `reason` (hint "At least 10 characters.").
   - Hidden `kind`=`fields`, `_rev.application`.
7. Review: the stage sentence of item 4, then "Your name, the evidence, the reason and the time are recorded."
8. Buttons "Record the correction" (primary); "Cancel" → SA-04a `?tab=application`.

The handler (D-W11-03) maps each posted identity field to `identityChanges` exactly as posted (trimmed; issuing country
and nationality upper-cased, as today), omits an absent or empty field (the form cannot clear an identity detail, as
today), maps every ticked `evidence.<dov id>` to `evidenceVersionIds` in posted order, maps every `field.<key>` to
`fields`, and sends `declaredCountry` when posted. It reads nothing from Core at POST time. An identical resend of the
same operation is then byte equal and replays (WP-09 D-W09-05; WP-03 C-04). The engineer confirms by a failing test
first that Core treats unchanged values as no change for this command (`corrections.ts:126-128` computes changed
paths; `requireSamePersonEvidence` returns early with no changed identity field). If Core refuses them, the unit keeps
a diff and the architect raises a replay-defect proposal.

| State (first match) | Condition (Core facts on the read) | Copy and controls |
|---|---|---|
| Closed | not open | "The application is closed: its details are historical." No form (Core: `correction_historical_after_filing` / `application_not_open`) |
| Held by a mark | `mark ≠ null` | CMP-10 "Corrections are unavailable while a post-restore protection mark holds this application. Owner: SuperAdmin, who resolves the mark with evidence." Link SA-09m. No form (Core stage 3) |
| Historical | a `government_submission` or `provider_handoff` act `filed_evidenced`, or `packet.state = released` | "The application was filed or its packet was released: its details are historical. A correction after filing is an owned incident." No form (Core: `correction_historical_after_filing`) |
| Unresolved | an act `reconciliation_exhausted` | "The filing could not be established (External outcome unresolved): the attempted details stay as if filed. No correction applies." No form (Core: `filing_possibly_occurred`) |
| Held stage | an act `authorized` or `filing_unknown` | Form with the held effect and review (item 4) |
| Open stage | otherwise | Form |
| C3 `corrected` | — | Receipt by `stage` (§2.10) |
| C2 | §2.12 | Field or fieldset errors; every value and tick kept |
| C5 | `stale_revision` | CMP-14: a table "Detail / your value / current value" for each field the user changed; inputs keep the typed values |

### 2.5 SA-09m Resolve the protection mark, kind `protection_mark`

Reads `core.admin_case` (the current active mark: `mark.mark_id`); opt. `ops.case_work` (acts' evidence).

1. `h1` "Resolve the protection mark: [applicant]".
2. Scope: "Protection mark [reference] on application [reference]. Engineering records a mark after a restore that lost
   an interval of records, for an application that may have been filed, paid or released in that interval. A mark holds
   every guarded action of the application." (B40.)
3. Evidence: "What the restore may have lost: not shown on this page (STOP-W11-01). Read the mark's audit history."
   Link → `/admin/audit/protection_mark/<pmk>`. The application's external acts (state words), service payment,
   packet state, readiness. Line: "If the application holds more than one mark, the next one shows here after this
   one is resolved."
4. Effect: changes "This mark stops holding the application. Each action it held is checked again under its normal
   controls: assignment, readiness, authorization, packet release, document release, gate decisions, withdrawal and
   corrections." Unchanged "It records no filing, payment or release, and restores no lost record. A fact the restore
   lost is entered again only through its own page, from evidence (B40)." · "Another mark of this application, if any,
   keeps holding it."
5. Hard stops: "Resolve only with evidence for each thing the restore may have lost: a filing, a government fee
   payment and a packet release. No other control is passed."
6. Your decision: "Evidence reference" `evidenceRef` (required, maxlength 120, hint "The reference of what you checked,
   for example the authority's portal record or a payment statement."); "Reason" `reason` (hint "At least 10
   characters."); hidden `applicationId` (the path id). The form action is `/admin/protection-marks/<pmk>/resolve` with
   the mark of the read.
7. Review: "When you resolve it: the mark ends with your evidence, reason, name and time; the application's actions are
   checked again under their normal controls."
8. Buttons "Resolve the protection mark" (primary); "Cancel" → SA-04a.

| State | Condition | Copy and controls |
|---|---|---|
| No mark | `mark = null` | "No protection mark holds this application." No form |
| Allowed | `mark ≠ null` | Items 6 to 8 |
| C3 `mark` | — | Receipt (§2.10); then the current state: "Another protection mark holds this application: [reference]." with a fresh form, or "No protection mark holds this application now." |
| C2 `stale_revision` | the posted mark is no longer active | "Mark [posted reference] was resolved since you opened the page. Nothing was recorded now." Then the current state. The typed evidence and reason show in the unsent text block and MUST NOT fill a form for another mark (evidence for one restore is not evidence for another) |
| C2 `not_found_or_forbidden` | the mark is not this application's | Shell SH-02 (LD-14) |
| C2 field | `evidence` (blank reference), `reason` | On the field; values kept |

### 2.6 OP-04 and OP-02 in V11 (WP-07 pages; amendments F-22 to F-28)

WP-11 does not redesign the act pages. The V11 behaviour on them, with the amendments of §1.8:

| Situation | Page | Required behaviour |
|---|---|---|
| Act `authorized` by OP2; reassigned to OP1 | OP-04b for OP1 | Owner "[OP1] (you)"; F-28 banner (no instruction to perform); modes "Record external action evidence" and "Execution is uncertain"; no "Request authorization" form anywhere (Core: `act_already_open`) |
| Act `filing_unknown`; reassigned | OP-04b for OP1 | WP-07 fixed sentence with the new owner; F-26 next-step line; reconciliation form; OP2's earlier records listed unchanged |
| Rule change: travel dates changed, offering suspended, catalogue change | OP-04b; OP-04a | Reconciliation offered (Core runs no control on it). OP-04a shows no form: `act_already_open`, plus the new blocker words. Travel dates no longer judge a possibly-filed application (`travelDatesHistorical`, `controls.ts:516-523`): Core's automatic recheck records "historical or held" for it (`travel-recheck.ts:66-68`); until it runs, the page shows Core's pending recheck fact as read, and the recheck never blocks the reconciliation |
| Separate fee act while the submission's filing is unknown | OP-04a `act=government_fee_payment` | No form; Max's decision Q-W07-07 (F-02) |
| After the unresolved decision | OP-02 (every tab), OP-04a, OP-04b | F-24 banner; F-23 OP-04a state; F-22 OP-04b banner; no mode links; records and attempts unchanged |
| Hand-made reconciliation post after exhaustion | OP-04b re-render | F-25 |

### 2.7 SA-01 and the travel agent side

- **SA-01 (WP-06 page), AM-W11-11.** Group 12 "Uncertain external results": the line "Acts whose filing is unknown:
  [n]" links to SA-04l `?filing=unknown` (exists today, D11); the line "Acts closed with reconciliation exhausted: [n]"
  has no link (no list read; it needs no action). Group 15 "Protection marks after a restore": "[n] applications held
  by a protection mark" links to SA-04l `?owner=superadmin` with the line "Held applications show 'Held after a
  restore' as their reason." (interim; STOP-W11-04).
- **TA-07 and TA-10** (WP-03, WP-08 pages): AM-W11-10 words; no control on TA-07 submits, files or asks to file again
  for an application with this outcome (none exists: TA-08's submit needs a draft). E-16 travel agent sentence.
- **Individual intake** (WP-03 TA-09): a new application for the same applicant, service and group shows Core's
  `duplicate_open_scope` text (exists). The text for `reconciliation_exhausted_no_refiling` is missing on the travel
  agent side (only `CORE_MESSAGES` has it); the UAT-13 fallback shows the code. Proposed text (seam note S-W11-01,
  shared file `src/apps/shared/pages/intake.ts`): "This applicant has an earlier application for this service in this
  group whose filing could not be confirmed. TravelMudra does not file it again, so no new application was created."

### 2.8 SA-04 read pages (phase 2, separable; Q-W11-02)

| Page | Anatomy | States |
|---|---|---|
| SA-04l Applications `/admin/applications` | `h1` "Applications"; projection lag line (LD-08); saved views (CMP-20, links): All; Waiting on a SuperAdmin (`owner=superadmin`); Filing uncertain (`filing=unknown`); Travel-date recheck pending (`recheck=pending`); Payment follow-up open (`followUp=open`); then the existing filters (travel agent, offering, mode, progress) as a GET form; `queueTable` rows: applicant (link SA-04a), reference, service, progress, Core's reason sentence and owner label, payment status words; "Read the next part of the list" with `after` (200 rows a read) | S2 "No application exists yet."; S3 "No application matches this view." + "Clear the filter"; S5 lag line; read failed: SH-02 |
| SA-04s Search `/admin/search` | Search form (the WP-03 seal pattern is not needed: SuperAdmin search text goes to Core and is never logged, as today); results as SA-04l rows | S2 "Enter a name, passport number or reference."; S3 "No application matches." |
| SA-04g Group `/admin/groups/:groupId` | Frame: `h1` group label; travel dates; state; reference; "Today (India time)"; clock check; table "Group end status" (as today) with applicant links to SA-04a | as today |
| SA-04d Delivery `/admin/applications/:applicationId/delivery` | WP-08 OP-06 renderer in read mode (files, notices, attempts, handovers; no operator record form); the SuperAdmin single-file retrieval with "Purpose" (select) and "Reason" for each file; the completion boundary with no control (CC-07). The purpose is read whole (today `purpose.slice(0, 60)`, `src/apps/shared/delivery/routes.ts:88`: LD-17) | WP-08 states; a refused retrieval re-renders SA-04d with purpose and reason kept |

### 2.9 Closed word tables

Act state words (staff; extends WP-07 §2.8.1; by shape for a provider handoff, WP-10 §2.11.1):

| State | TravelMudra-filed act | Provider handoff |
|---|---|---|
| `authorized` | "Authorized; execution not yet evidenced" (F-01) | "Handoff authorized; not yet evidenced" |
| `filed_evidenced` | "Filed (evidence recorded)" | "Handed to the provider (evidence recorded)" |
| `not_filed_evidenced` | "Not filed (evidence recorded)" | "Not handed over (evidence recorded)" |
| `filing_unknown` | "Execution uncertain: filing unknown" | "Handoff uncertain" |
| `reconciliation_exhausted` | "Reconciliation exhausted: filing unknown" | "Reconciliation exhausted: handoff unknown" |

Reconciliation method and result words: WP-07's labels (`ops.case_work` codes; "Checked the government portal",
"Contacted the authority", "Contacted the provider", "Checked a payment statement", "Other check"; "No information",
"Inconclusive", "Found it was filed", "Found it was not filed").

Outcome `external_outcome_unresolved`: staff meaning "Reconciliation was exhausted. The filing state is unknown and it
is never repeated." (today's text, `presentation.ts:129-134`, with "refiling is not safe" kept for staff); travel agent
AM-W11-10. Tone `warning`, never `danger` or `success`.

### 2.10 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `unresolved` | SA-09u | `application`, path id | `applicationId` only | cannot be told from another command's summary on the same application | neutral "Request recorded" | Reference | "Current: Outcome [words]"; each act "[act]: [state words]"; when the outcome is `external_outcome_unresolved`, the fixed line "No external act is repeated for this application." |
| `corrected` | SA-09o | `application`, path id | `applicationId` only | as above | neutral | Reference | "Current: Outcome [words]" |
| `corrected` | SA-09e | `application`, path id | `correctionId` string, `stage` ∈ {`applied`, `held`} | the summary keys and the host page | "Correction applied" / "Correction recorded and held: the details did not change" (by `stage`) | Correction reference; stage sentence (held: "It waits for the filing evidence of [act]."); no before or after values (the read carries no corrections) | Identity details (Current) |
| `mark` | SA-09m | `application`, path id | `markId` string (pattern `pmk_`) | `markId` is unique to this command | "Protection mark resolved" | Mark reference | "Current: another protection mark holds this application: [reference]" or "Current: no protection mark holds this application." |

No receipt shows an accepted time or names the actor until S-08 (P-10 b). The receipt never tells anyone to perform an
act (F-01).

### 2.11 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| SA-09u | `_rev.application` | Act states (the ones you saw / current); Outcome (current); attempts count (current, opt.); owner choice and reason kept |
| SA-09o | `_rev.application` | Outcome (you saw / current); evidence and reason kept |
| SA-09e | `_rev.application` | Changed details table (§2.4); evidence ticks kept |
| SA-09m | mark state (Core answers `stale_revision`) | Not CMP-14: the §2.5 C2 state |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

### 2.12 Refusal sentences (closed table, staff audience)

`CORE_MESSAGES` stay unless listed.

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| SA-09u | `control_blocked/outcome_already_recorded` | "The outcome was recorded meanwhile: [outcome]. Nothing was recorded now." + the "Decided" or "Outcome recorded" state; unsent text | form-level |
| SA-09u | `control_blocked/act_state_transition_invalid` | By the re-read facts: an act `authorized` → the "Execution not recorded" sentence; no act `filing_unknown` → "No act of this application has an unknown filing now: [act]: [state words]." | form-level |
| SA-09u | `control_blocked/reconciliation_attempt_missing` | "Each act whose filing is unknown needs at least one reconciliation attempt that found no information or was inconclusive. Missing for: [acts]." | form-level |
| SA-09u | `validation_failed`, field `futureOwnerAccountId` (`not_active_staff`) | "That person cannot own later official facts now: not an active operator or SuperAdmin with a second factor. Choose another." | owner field |
| SA-09u | field `reason` (`too_small`, `too_big`) | "Enter at least 20 characters." / "Enter at most 1,000 characters." | reason field |
| SA-09o, SA-09e, SA-09m | field `reason` | "Enter at least 10 characters." / "Enter at most 1,000 characters." | reason field |
| SA-09e | `control_blocked/identity_same_person_evidence_insufficient` | "The chosen documents do not show the new details with at least two unchanged details of the same person. Choose the document that shows them." | evidence fieldset |
| SA-09e | `validation_failed`, field `evidence` (`too_small` or `business_evidence_required`) | "Choose the identity document that shows the new details, or enter an evidence reference." | evidence fieldset |
| SA-09e | field `evidenceVersionIds` (`too_big`) | "Choose at most 4 documents." | evidence fieldset |
| SA-09e | `validation_failed/correction_no_change` | "Nothing changed: the details already have these values." | form-level |
| SA-09e | `control_blocked/population_out_of_scope` | "TravelMudra serves Indian ordinary-passport holders resident in India. This change leaves that scope." | form-level |
| SA-09e | `control_blocked/filing_possibly_occurred` | "The filing could not be established meanwhile (External outcome unresolved): no correction applies." + state | form-level |
| SA-09e | `control_blocked/correction_historical_after_filing` | "The application was filed, released or closed meanwhile: its details are historical." + state | form-level |
| SA-09e | `conflict_duplicate/duplicate_open_scope`; `control_blocked/reconciliation_exhausted_no_refiling`; `later_attempt_declaration_required` | existing sentences (`shared.ts:92, 151, 152`) | form-level |
| SA-09m | `stale_revision` | §2.5 | form-level |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden` | shell SH-02 (LD-14) | — |

## 3. Interim and switch for the pending Core facts

| Item | Interim (now) | Switch |
|---|---|---|
| Command identity (P-10 b, S-08) | Neutral receipts for `unresolved` and SA-09o `corrected` | Titles "Unresolved external outcome recorded", "Outcome corrected"; "Accepted at [time] IST"; one data change per expectation |
| STOP-W11-01 mark facts | SA-09m names no lost fact; audit link; hard-stop sentence names all three | "The restore may have lost: [a filing / a government fee payment / a packet release]" from the flags; recorded at; restore reference; number of active marks |
| STOP-W11-02 exhausted act facts | "Owner of a later official fact: not shown on this page"; audit link; neutral receipt | SA-04a and OP-04b: "Closed by [decider] at [time] IST. Reason: [reason]. Owner of a later official fact: [name]." The SA-09u "Decided" state shows the same |
| STOP-W11-03 held corrections and the staff re-apply route | Effect sentence names the gap; action panel row 7 interim; no list | SA-04a section "Held and released corrections" (kind, fields, state, actor, time) with "Apply again" → a new SA-09 kind `reapply_correction` posting `core.apply_held_correction` on a staff route; OP-02 the same for an operator's assistance entry (WP-09) |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at f78e558 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical decision and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| SA-09u | Same `_op`, same content (double click, resend) | Kernel replays the original result; the same 303 and receipt; one fact, one notice (dedupe key `external_outcome_unresolved:<app>`) | None | Yes (copy and location new) |
| SA-09u | Same `_op`, other content (owner changed after a lost answer) | `conflict_operation_key`; nothing recorded | None | Yes |
| SA-09u | New `_op` from a tab opened before the decision | `stale_revision` (the revision moved) → CMP-14 with "Outcome: External outcome unresolved" current; unsent reason | None | Partly (generic page) |
| SA-09u | New `_op` with the current revision (hand-made) | `outcome_already_recorded` → "Decided" state | None | Partly |
| SA-09u | Lost answer | 303 `/admin/operations/<key>`; a reopened SA-09u with a new key is refused by the outcome guard if the first committed. No external act is involved, so no pending mode is needed (unlike WP-07 §2.7.4) | None | Yes |
| SA-09o | Same `_op` | Replay | None | Yes |
| SA-09o | New `_op`, stale tab | `stale_revision` → CMP-14 (outcome you saw / now) | None | Partly |
| SA-09o | New `_op`, current revision, same target | `correction_no_change` → "Nothing changed" | None | Partly |
| SA-09e | Same `_op` after acceptance | Byte-equal input (D-W11-03) → replay; same receipt | None | **No**: the handler reads `core.admin_case` at POST time and sends only the diff (`admin.ts:615-621`); after acceptance the diff is empty, the content differs, the kernel answers `conflict_operation_key` (F-W11-03) |
| SA-09e | New `_op`, same values after an applied correction | `stale_revision` (stale tab) or `correction_no_change` | None | Partly |
| SA-09e | New `_op`, same values after a held correction | Core records a second held correction (no semantic duplicate guard; WP-09 G-03 class). The held effect sentence warns that held corrections are not listed (STOP-W11-03) | A second held correction | Yes (Core behaviour; P2 note) |
| SA-09m | Same `_op` | Replay | None | Yes |
| SA-09m | New `_op` (second tab or second SuperAdmin) | `stale_revision` → "Mark [ref] was resolved since you opened the page"; unsent evidence and reason; next mark shown with a fresh form | None | **No**: `ctx.respond` without a re-render shows the shell error page; typed text lost (F-W11-05) |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused decision (C1, C2, C5) | The kind page at the POST address, CMP-07 focused | Every typed value and tick; the owner choice | Nothing typed |
| Refusal that ends the form (decided, mark gone) | The new state and the unsent text block | The text, read only | The form (it no longer applies) |
| Core unreachable before the command | SH-02 neutral page | — | The form; reopen the page |
| Answer lost | WP-01 operation page | The operation key | — |
| Optional read failed | "Unavailable" for its facts; the form stays where Core decides | Everything else | — |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Reconciliation after reassignment** (act `filing_unknown` by OP2, reassigned to OP1) | OP1 is the reconciliation owner (`assignment.ts` transfer); OP-04b shows "(you)" and the form; OP2's next read is SH-02; OP2's earlier records stay listed with OP2's name; a hand-made post by OP2 is refused for access (`requireAssigned`) and shows SH-02 | Yes (copy new) |
| **Reconciliation after reassignment, act still `authorized`** | F-28: OP1 is never told to perform the act; "Execution is uncertain" and evidence modes offered; no authorization form (Core `act_already_open`) | **No** in the WP-07 design (F-01 text addresses every viewer) |
| **Reconciliation after a rule change** (travel dates edited, offering suspended or withdrawn, catalogue transition, declaration item unresolved) | Reconciliation stays offered (Core runs no control on it); OP-04a shows no form and names the new blockers; no page proposes a new act; an authorization granted before the change stands (B23/B45 accepted residual; no added lock) | Yes |
| **Rule change after exhaustion** | No act offered (`reconciliation_exhausted_no_refiling`, no exception); a new application for the same applicant, service and group refused | Yes |
| **A correction proposed while filing is possibly done** | SA-09e states the held effect before the button; Core holds it; the receipt says "recorded and held: the details did not change"; the operator's authorization waits (`held_correction_pending`); after exhaustion the form is absent | **No**: the current disclosure says nothing about holding (F-W11-09) |
| **A correction proposed after filed evidence or a packet release** | No form ("historical"); a post-filing incident is the remedy | Partly (Core refuses; the page shows the form) |
| **A protection mark resolved twice** | §4.1 rows; the second SuperAdmin sees "resolved since you opened the page"; evidence typed for the first mark never fills the form of a second mark | No (F-W11-05) |
| **Two marks on one application** | After the first resolution the page shows the second mark's reference and a fresh form; the banner stays | Partly |
| **Unresolved decision with stale facts**: the operator records a concluding attempt (filed or not filed) between GET and POST | The revision moved → CMP-14 showing the act's new state; the decision state becomes "No unknown filing" | Partly |
| — an inconclusive attempt recorded meanwhile | No revision change; the decision is accepted; the attempt is part of the record | Yes |
| — a new act authorized meanwhile | CMP-14 (revision) or `act_state_transition_invalid` → "Execution not recorded" | Partly |
| — the chosen future owner suspended meanwhile | Field refusal `not_active_staff`; values kept | Partly (error at the disclosure) |
| — a protection mark recorded meanwhile | Core accepts (no stage 3); SA-09u shows the mark warning on GET only. Core note STOP-W11-07 | — |
| **Access revoked mid-page**: SuperAdmin suspended | Next request: session ended → sign-in; typed input lost (accepted residue, as WP-07 §4.4) | Yes |
| — SuperAdmin starts a support view in another tab | The decision POST is refused for a support view (404/409); nothing recorded; the page after the support view ends shows the decision again | Yes |
| — operator reassigned away while on OP-04b | Next read SH-02; a post shows SH-02 (LD-14) | Yes |
| **Mark blocks reassignment of an absent reconciliation owner** | SA-04a action panel shows row 1 before row 2: the mark is resolved first (Core stage 3 on `reassign`) | — |

### 4.4 Counts, caps and long lists

| Situation | Required behaviour |
|---|---|
| 50 reconciliation attempts on one act | Listed in full in order on SA-04a, SA-09u and OP-04b; the page scrolls; no nested scroll region |
| 4 acts on one application, 2 unknown | SA-09u scope lists both; each with its attempts |
| 20 identity documents (`identityEvidence` max) | All listed as checkboxes; more than 4 ticked → Core's field refusal, ticks kept |
| 100 declared form fields | All rendered; values over the declared `maxLength` refused at their field by Core |
| Long names and reasons (400, 1000 characters) | Wrap anywhere; `h1` wraps; tables stack to cards |
| SA-04l at 200 rows a read | "Read the next part of the list"; no total; lag line |

### 4.5 Device and environment

JavaScript off: every page works (tabs are links; plain forms; the review shows "the person you choose"). 320 px and
400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: tabs, decision rows and forms in reading order;
the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-11

- One `h1` per page; frame and decision parts are `h2`; act blocks `h3` (AC-03).
- Tabs are a `nav` list of links with `aria-current="page"` (AC-01).
- The future-owner `select` has a visible label and a hint linked by `aria-describedby`; no option preselected.
- Evidence checkboxes are real inputs in a `fieldset` with a `legend` "Evidence"; never prechecked.
- The destructive primary button keeps its text label ("Record the unresolved external outcome"); colour is not the
  only signal (AC-06).
- The protected-state banner is plain text in the page flow (no live region); receipts announce politely (AC-09).
- Unavailable decisions use CMP-10 with `aria-describedby` on any shown `unavailableButton` (AC-13).
- The unsent text block is a `blockquote` with a heading; it is not focusable and not a live region.

## 6. Proof V11 on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652), source = this lane's clone. At the
  WP-11 proof it holds WP-02, WP-03, WP-06, WP-07, WP-08, WP-09 and WP-10 pages (package order).
- Synthetic seed (fact, `catalogue/synthetic/catalogue.json`): "SYN Tourist e-visa" (TravelMudra files; the government
  submission carries no fee; a separate government fee payment act; `deliveryEvidence.external_outcome_unresolved =
  none`). Accounts syn-ta-1 to -3, syn-operator-1 to -3, syn-superadmin-1 to -3.
- The submission of this offering carries no fee, so the default ₹0 ceiling does not stop it (inference from WP-07
  §2.7: only the fee-carrying act is compared with the ceiling). Gate 2 needs the service payment recorded as received.
- No product path records a protection mark (engineering only, `facade.ts:180`), and synthetic declarations have no
  form fields and no document that shows a different identity: marks, held corrections and `field.<key>` run as tests.
- Sign-in through the LD-11 harness; codes never printed. axe at 1440 px and 390 px. Synthetic writes only (Q-W11-08).

### 6.2 Setup (synthetic writes, labelled as setup; run tag `wp11-[yyyymmddhhmm]`)

S1. syn-ta-2 (TA) creates group `wp11-[stamp]` in Synthetica, travel +30/+40 days, and submits three applications on
"SYN Tourist e-visa": U (the unresolved path), W (the authorized-then-reassigned path), O (the outcome correction).
S2. syn-superadmin-1 (SA1) records "Payment received" for U, W and O on SA-07a (evidence `SYN-V-[stamp]`), assigns U
and W to syn-operator-2 (OP2) and O to syn-operator-1 (OP1) on SA-03a.
S3. OP2 starts work and confirms readiness on U and W; OP1 on O.
S4. OP2 requests authorization of the government submission for U and W on OP-04a. For U, OP2 records "Execution is
uncertain" on OP-04b with the statement "Portal session ended after submit; no receipt shown".
S5. OP1 requests authorization for O, records "Filed" with reference `SYN-PORTAL-O-[stamp]`, then records the outcome
"Refused" on OP-05 with reference `SYN-REF-O-[stamp]` and no file.

### 6.3 Steps and observable results

"L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V11-1 | SA1, SA-04a of U | Read Overview and External acts | Banner "Filing outcome is unknown. Do not repeat the external action. [OP2] is reconciling the evidence."; panel row 9 "Waiting on [OP2]: reconcile whether the government submission was filed"; act block "Execution uncertain: filing unknown"; OP2's evidence record listed; attempts: none; no SuperAdmin form for an act | L |
| V11-2 | SA1, SA-09u of U | Read | State "Attempt missing", owner [OP2]; scope, evidence, effect and hard stops visible; no form | L |
| V11-3 | TA, group page | Change the travel dates to +31/+41 (rule change, carried WP-17 form) | Accepted | L |
| V11-4 | SA1, SA-03c | Reassign U and W from OP2 to OP1, each with a reason | Receipts; SA-04a Operator: OP1 | L |
| V11-5 | OP2 | Reload OP-04b of U; open OP-04a of W | SH-02 "Your access changed" on both | L |
| V11-6 | OP1, OP-04b of U | Read | Owner "[OP1] (you)"; WP-07 sentence; F-26 next-step line; reconciliation form; OP2's uncertain record listed with OP2's name; the travel-date change does not block or remove the reconciliation form (Core's recheck answers "historical or held" for U) | L |
| V11-7 | OP1, OP-04a of U for `government_submission` and `government_fee_payment` | Read | No form on both: "already authorized … may have happened" and the F-02 fee reason; no "Request authorization" anywhere for U | L |
| V11-8 | OP1, OP-04b of W | Read; record "Execution is uncertain" with "Authorized by the previous operator; no record of execution" | F-28 banner: "Authorized by [OP2] … You did not request this authorization: do not perform the act under it."; no text tells OP1 to perform it; receipt "Execution recorded as uncertain"; W now uncertain | L |
| V11-9 | OP1, OP-04b of U | Reconciliation: "Checked the government portal", "Inconclusive", note | Receipt "Reconciliation attempt recorded"; banner stays; attempts table one row by OP1; OP2's record unchanged | L |
| V11-10 | SA1, SA-09u of U | Read; choose syn-operator-3 (OP3); reason "Short" | Form shown; refusal at the reason field "Enter at least 20 characters."; OP3 still chosen | L |
| V11-11 | SA1, SA-09u of U | Reason of 20+ characters; record | Neutral receipt "Request recorded" with "Current: Outcome External outcome unresolved"; "Government submission: Reconciliation exhausted: filing unknown"; "No external act is repeated for this application."; then the "Decided" state | L |
| V11-12 | Harness; SA1 second tab | Resend the V11-11 POST (same `_op`); submit from a tab opened before V11-11 | Same 303 and receipt, one TA notice; the second tab: CMP-14 "Outcome: Outcome not recorded / External outcome unresolved", nothing recorded, reason in the unsent block | L |
| V11-13 | OP1, OP-04b and OP-04a of U, OP-02 | Read | F-22 banner; no mode links; OP2's record and OP1's attempt unchanged; OP-04a F-23 text and no form; OP-02 F-24 banner on every tab | L |
| V11-14 | Harness (OP1) | Re-post the V11-9 reconciliation envelope with a new `_op` | Refused; F-25 sentence; attempts still one | L |
| V11-15 | TA, TA-07 and TA-10 | Read | Outcome "External outcome unresolved" with the AM-W11-10 sentence; no submit or file control; completion sentence E-16; notice "The external outcome could not be confirmed." | L |
| V11-16 | TA, TA-09 | Start an individual intake for the same applicant (same passport) in group `wp11-[stamp]` on "SYN Tourist e-visa" | Refused `duplicate_open_scope`: "This applicant already has an open application for that service. Nothing was created." | L |
| V11-17 | SA1, SA-09e and SA-09o of U | Read | SA-09e "Unresolved" state, no form; SA-09o "Only Issued and Refused can be corrected here … a later official fact … follow-up", no form | L |
| V11-18 | OP1, OP-05 of U | "Record a later official fact": Issued, reference `SYN-LATER-[stamp]` | Receipt "Later official fact recorded. The outcome stays External outcome unresolved. A follow-up is open."; SA-04a outcome unchanged; OP3's Incidents and follow-up lists the official-fact follow-up of U | L |
| V11-19 | OP1, OP-07 of U | Read | `no_possible_filing` "Filing could not be established: recorded as External outcome unresolved" (E-16); completion boundary, no control | L |
| V11-20 | SA1, SA-09e of W | Change given names to a value not on the passport; tick the passport; record | Held effect sentence before the button; refused at the evidence fieldset (`identity_same_person_evidence_insufficient`); typed values and tick kept; SA-04a shows the old name | L |
| V11-21 | SA1, SA-09o of O | Read; evidence `SYN-CORR-[stamp]`, reason; record; then a tab opened before | Scope "from Refused to Issued"; neutral receipt "Current: Outcome Issued"; audit subject page shows the before/after fact; the old tab: CMP-14 (Refused / Issued), nothing changed | L |
| V11-22 | SA1, SA-01 | Read | Group 12 "Acts closed with reconciliation exhausted" counts U; the "filing unknown" link lists W and not U | L |
| V11-23 | axe | Every WP-11 page and the amended pages visited | No violation at 1440 px and 390 px | L |
| T1 | Test (system, fixture through `recordProtectionMark`) | Mark on an assigned application | SA-04a banner and panel row 1; SA-09e and SA-09g blocked; SA-09m resolve → receipt; a second tab → "resolved since you opened the page", unsent text, no prefill; two marks → the second shown after the first | T |
| T2 | Test (fixture as `case-rules.test.ts:316-334` plus an `authorized` act) | Field correction | Receipt "Correction recorded and held"; snapshot unchanged; operator notified; not-filed evidence → `released_for_reapply`; SA-04a panel row 7 | T |
| T3 | Test | Same `_op` resend of an accepted field correction | Same 303; no `conflict_operation_key` (D-W11-03) | T |
| T4 | Test (BFF) | Over-limit input: reason of 1,001 characters; 5 evidence ticks; owner id of 41 characters; 101 `field.<key>` | Each refused at its field by Core's contract; every value and tick kept; nothing truncated (LD-17) | T |
| T5 | Test | Unresolved decision with an `authorized` act; without an inconclusive attempt; future owner suspended | `act_state_transition_invalid` → "Execution not recorded"; `reconciliation_attempt_missing`; `not_active_staff` at the field | T |
| T6 | Test | Offering suspended while an act is `filing_unknown` | Reconciliation accepted; OP-04a no form with the launch blocker words | T |
| T7 | Test (harness completion) | New intake of the applicant after the unresolved application completes | `reconciliation_exhausted_no_refiling` with the S-W11-01 text (or the code under the UAT-13 fallback until the seam note is accepted) | T |
| T8 | Test | Provider handoff exhausted | Shape words of §2.9 and AM-W11-13 on SA-04a, OP-04b, TA-07 | T |
| T9 | Test | Lost answer of SA-09u | 303 `/admin/operations/<key>`; a new key after commit refused by the outcome guard | T |

Proof split: V11 passes when V11-1 to V11-23 pass on `lane-ui` and T1 to T9 pass as tests. The package acceptance
records "Owner and decider of an exhausted act shown" as partly met until STOP-W11-02, and "what the restore may have
lost" as partly met until STOP-W11-01.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel. Phase C: U6. Phase 2 (separable, Q-W11-02): U7. The architect registers
gallery modules in `scripts/dev/gallery-pages.ts` and edits `DESIGN.md` once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Oversight reading** | New `src/apps/staff/oversight/reading.ts` (closed tables: SuperAdmin action panel §2.1.3, decisions list §2.1.4, correction stage by Core facts, outcome target; imports WP-07 act words and owner labels, WP-10 shape words; pure functions) | New `test/unit/web/oversight-reading.test.ts` (panel rows by code; mark first; no permission words; decision rows by facts; stage mapping equals Core's `changeStageOf` for a fixture table) | — |
| **U1 SA-04a** | New `src/apps/staff/oversight/workspace.ts` (frame through WP-06 `admin-context.ts` and WP-07 `frame.ts` exports; four tabs; carried WP-17 sections); new `src/apps/staff/oversight/routes.ts` (GET `admin.applications.detail` moved from `src/apps/staff/core/admin.ts`; exported `oversightAgain(ctx, state)`) | New `test/unit/web/oversight-workspace.test.ts` (banner on every tab; full passport only on Application; evidence and attempts listed with no edit control; no operator form; History link to the audit page; states of §2.1.8) | `scripts/dev/gallery/oversight.ts` |
| **U2 SA-09u, SA-09m** | New `src/apps/staff/decisions/unresolved.ts`, new `src/apps/staff/decisions/marks.ts` (renderers, states, receipts, stale rules) | New `test/unit/web/unresolved-outcome.test.ts` (section order; effect never says "completed"; owner options include "You" and nothing preselected; states in order; no checkbox); new `test/unit/web/protection-mark.test.ts` (no lost-fact claim; unsent text not prefilled into another mark) | extend `scripts/dev/gallery/decisions.ts` |
| **U3 SA-09o, SA-09e** | New `src/apps/staff/decisions/corrections.ts` (two renderers; held effect; `field.<key>` inputs; evidence ticks restored) | New `test/unit/web/evidence-corrections.test.ts` (target outcome hidden and stated; delivered warning keeps the form; stage sentences; prefill byte-equal to stored values; ticks never prechecked) | extend `scripts/dev/gallery/decisions.ts` |
| **U4 Registry and POST routes** | `src/apps/staff/decisions/kinds.ts` (four entries); `src/apps/staff/decisions/routes.ts` (kind enumeration; POST `admin.applications.unresolved_completion`, `admin.applications.correct_from_evidence`, `admin.protection_marks.resolve` moved from `admin.ts` with receipts, re-render and the posted-identity mapping through WP-09 `postedIdentity`; no truncation) | New `test/unit/bff-evidence-decisions.test.ts` (scripted Core: replay of each form; refusal re-renders with values; `kind` mapping; mark re-render from the hidden `applicationId`; LD-17 cases of T4; stale CMP-14) | — |
| **U5 Amendments** | WP-07 `src/apps/staff/work/reading.ts`, `frame.ts`, `acts-pages.ts` (F-22 to F-28); WP-08 `src/apps/shared/delivery/words.ts`, `src/apps/staff/outcome/pages.ts` (E-16, E-17); `src/web/ui/presentation.ts` travel agent meaning (AM-W11-10; architect, one value set); WP-06 `src/apps/staff/home/inbox.ts` (groups 12, 15) | Update `test/unit/web/external-action.test.ts` (F-22 to F-28; the F-01 replay test extended to a reassigned viewer), `test/unit/web/operator-reading.test.ts`, the WP-08 completion and OP-05 tests, `test/unit/web/decision-inbox.test.ts` | — |
| **U6 Wiring and system tests** | `src/apps/staff/core/admin.ts` (remove the case page, the four forms and three POST routes; carried WP-17 handlers re-render through `oversightAgain`); `src/apps/staff/instance.ts` (new modules) | New `test/unit/web/oversight-host-pages.test.ts` (§7.2); `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (no new inventory row in phase 1); new `test/system/unresolved-outcome.test.ts` (real Core: uncertain → reassignment → attempt → decision → no form on OP-04a → TA notice → later fact follow-up → refused reconciliation; T1, T2, T7 fixtures); the system tests of §7.3 | — |
| **U7 Phase 2 read pages** | `src/apps/staff/views/cases.ts` (SA-04l, SA-04s); new `src/apps/staff/oversight/group.ts` (SA-04g; route moved from `admin.ts` in U6's phase C); SA-04d: `src/apps/shared/delivery/routes.ts` (admin branch, purpose read whole), `src/apps/staff/delivery/routes.ts` (admin routes) | Update `test/system/case-views.test.ts` (view links), `test/system/delivery.test.ts` (admin view); new `test/unit/web/oversight-lists.test.ts` | extend `oversight.ts` |

U1 to U3 create new files; U4 owns `kinds.ts` and `routes.ts`; U5 owns the amended files of earlier packages; U6
removes the old copies in phase C. No two units edit one file. U7 touches `src/apps/shared/delivery/routes.ts`, a WP-08
file: it starts only after WP-08 is integrated.

### 7.2 Host-page test

`test/unit/web/oversight-host-pages.test.ts` renders SA-04a fixtures (filing unknown; exhausted; mark; held stage;
outcome Refused; closed) and asserts: no form with action `…/unresolved-completion`, `…/correct-from-evidence` or
`/admin/protection-marks/…/resolve`; no form of a WP-06, WP-07 or WP-09 command; the carried WP-17 forms of §1.6 are
present; the links of §1.6 are present. It also asserts that OP-02, OP-04a and OP-04b rendered for a viewer who is
not the authorizer contain no instruction to perform the act: the F-01 sentence "Perform the act only if it has not
been attempted" is absent, and "perform" appears only in the negation of F-28 ("do not perform the act under it").

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-rules.test.ts:316-334` | `evidenceField(page, …/correct-from-evidence)` on the case page; `location === ${admin}?done=corrected` | GET SA-09e `…/decide/correct_fields`; location `…/decide/correct_fields?done=corrected&op=…`; `submit` posts the hidden `kind` |
| `test/system/case-rules.test.ts:363-373` | The SuperAdmin re-key refusal posted from the case page; 409 with the `later_attempt_declaration_required` sentence | GET SA-09e; the refusal re-renders SA-09e with status 409 and the same sentence |
| `test/system/case-work.test.ts:496-502, 556` | `staffDocket(sa1, '/admin/applications/<id>')` reads `.docket` and `.docket__owner` | Read the SA-04a action panel and its owner line (the CMP-01 markup); the words stay ("Waiting on the travel agent: download the packet") |
| `test/system/core-pages.test.ts:240-266, 308-318` | SuperAdmin case page facts (WP-06/WP-09 already move the forms) | The case page links and facts on SA-04a Overview |
| `test/system/case-views.test.ts:115-135` | Admin list links to `/admin/applications/<id>` | Unchanged in phase 1; phase 2 keeps the links |
| `test/core/completion-group-end.test.ts:61-66` | Route commands containing "complet" | Unchanged (route and command names stay) |
| `test/unit/web/signed-in.test.ts:67` | Admin rail | Unchanged |

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `core.authorize_unresolved_completion` | SA-04 (decision on SA-09); WP-11 | SA-09u kind `unresolved_outcome` (`/admin/applications/:id/decide/unresolved_outcome`); linked from SA-04a (External acts, Decisions) and reached through SA-01 group 12; records the outcome and closes reconciliation; does not complete the case; WP-11 |
| `core.correct_from_evidence` | SA-04 (decision on SA-09); WP-11 | SA-09o kind `correct_outcome`; SA-09e kind `correct_fields` (identity, residence and the served `fields` shape); linked from SA-04a; WP-11 |
| `core.resolve_protection_mark` | SA-04 (decision on SA-09); WP-11 | SA-09m kind `protection_mark` (CC-04 delivered; no subject: the application's current mark); linked from the SA-04a banner and action panel and SA-01 group 15; WP-11 |
| `core.apply_held_correction` (WP-17) | TA-07 (pending-work panel) | Note: staff re-application (SuperAdmin `superadmin_evidence`, operator `assistance_entry`) has no route; edge allowlist only (STOP-W11-03) |
| `ops.record_reconciliation_attempt` (WP-07) | OP-04b | Note: WP-11 amendments F-25, F-26 |

§5.1 count unchanged: WP-11 3. Proposed §6 disposition **CC-15**: "The WP-11 commands leave the old SuperAdmin case
page; SA-04a is rebuilt on the kept path (OP-02 layout without operator actions) and keeps facts and links; one host page
per command use (SA-09u, SA-09o, SA-09e, SA-09m). The carried WP-17 forms stay on SA-04a until WP-17." §6.1: no package
move.

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code or earlier design) | Scenario | Design |
|---|---|---|---|---|
| F-W11-01 | P1 | WP-07 §2.8.2 tells the reader of a `reconciliation_exhausted` act that "A SuperAdmin records the unresolved outcome (WP-11)"; the state exists only after that decision (`acts.ts:198-213`) | The operator waits for a SuperAdmin decision that was already recorded and does not record the later official result | F-22 |
| F-W11-02 | P1 | WP-08 shows "No filing is in doubt" when `no_possible_filing` is met; Core reports it met for an exhausted act under `external_outcome_unresolved` (`derived.ts:175`) | The travel agent reads that no filing is in doubt for an application whose filing could not be established, and files elsewhere for the same trip | E-16 |
| F-W11-03 | P1 | The field correction handler reads `core.admin_case` at POST time and sends only the diff (`admin.ts:615-621`, `case.ts:409-420`) | First click commits; the browser resends; the diff is empty; the kernel answers `conflict_operation_key`; the SuperAdmin re-enters the values and gets "Nothing changed" or records a second correction | D-W11-03 |
| F-W11-04 | P1 | LD-17 truncations: `futureOwnerAccountId.slice(0, 40)` (`admin.ts:602`), `outcome.slice(0, 40)` (`:613`), `applicationId.slice(0, 40)` (`:629`), identity values `slice(0, max)` and evidence ticks `slice(0, 4)` (`case.ts:413-418`) | A SuperAdmin ticks five documents; the fifth is dropped silently; the correction rests on less evidence than chosen | D-W11-06 |
| F-W11-05 | P1 | The mark resolution answers without a re-render (`admin.ts:628-633`); a refusal shows the shell error page | Two SuperAdmins resolve the same mark; the second loses the typed evidence and sees a generic "changed" page with no mark facts | §2.5 states |
| F-W11-06 | P1 | The unresolved form is a disclosure in "Ending the case" (`admin.ts:308-323`) with no attempts, no reconciliation owner and a one-sentence effect; it says nothing of the TA notice, the lifecycle or held corrections; "Authorise" spelling; operators only | A SuperAdmin records the outcome without seeing that the only attempt found the filing; or believes the case is completed | SA-09u |
| F-W11-07 | P2 | The flash `corrected` reads "The outcome was corrected." after a field correction (`admin.ts:51`) | The SuperAdmin believes the outcome changed | Receipts by host page (§2.10) |
| F-W11-08 | P2 | The mark disclosure gives no fact about the mark | The SuperAdmin resolves a mark that says "possibly paid" with filing evidence only | SA-09m hard stops; STOP-W11-01 |
| F-W11-09 | P1 | The field correction states no held effect while an act is authorized or uncertain (`admin.ts:332-345`) | The SuperAdmin corrects a passport number while the filing is unknown, sees "corrected", and tells the travel agent the details changed; the snapshot did not change | SA-09e item 4 |
| F-W11-10 | P1 | UI-PLAN SA-04 says Core "records the `external_outcome_unresolved` completion"; Core records the outcome only (`acts.ts:213`) | A page built on the plan text says "Completed" while the case stays Submitted with completion prerequisites | D-W11-09 |
| F-W11-11 | P1 | WP-07 OP-04a names "Owner: SuperAdmin" for the exhausted refiling block | An operator flags a SuperAdmin to unlock refiling; no decision exists for it | F-23 |
| F-W11-12 | P1 | WP-07 F-01 instruction "Perform the act only if it has not been attempted" reaches a new operator after a reassignment | OP1 cannot know whether OP2 attempted it; OP1 performs the act under OP2's authorization: a possible double filing (B23) | F-28 |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W11-01 | P1 | Kind name `unresolved_outcome` instead of WP-06's planned `unresolved_completion` | The address `…/decide/unresolved_completion` and a page title derived from it tell a SuperAdmin the case completes | Yes (AM-W11-12); the command and route names stay |
| Q-W11-02 | P1 | Build the SA-04 read pages (list, search, group, SuperAdmin delivery view) in WP-11 as phase 2 (U7), or in a later package | LD-02 needs every route rebuilt or retired at handover; no other package owns these four; none gates V11 | Yes, phase 2 of WP-11 after phase 1 is integrated; separable if time is short |
| Q-W11-03 | P1 | Kind `protection_mark` without a subject (the application's current mark), instead of a `pmk` subject route | After a resolution the subject address answers 404 (the read carries only the active mark), so the receipt page would vanish | Yes; the form action carries the mark id; a second mark is shown after the first |
| Q-W11-04 | P1 | Offer the served `fields` shape as `field.<key>` inputs on SA-09e (D-W11-04) | A declared application field (for example an address) is wrong; today no page can correct it from evidence | Yes; same names as WP-09 OP-02a; tests only (synthetic declarations have none) |
| Q-W11-05 | P1 | Future-owner options: active operators of the read plus "You" (D-W11-08); other SuperAdmins not listed | The SuperAdmin who decides wants to own the follow-up; today only operators are offered although Core accepts a SuperAdmin | Yes; STOP-W11-05 (P2) for a list of active SuperAdmins |
| Q-W11-06 | P1 | Deterministic identity mapping for SA-09e through WP-09's `postedIdentity` (D-W11-03) | §4.1 row "SA-09e same `_op` after acceptance" | Yes, after the failing-test-first check |
| Q-W11-07 | P2 | No confirmation checkbox on SA-09u (an irreversible decision) | — | Accept (WP-10 Q-W10-08: the visible review satisfies UX §7.4; no new field) |
| Q-W11-08 | P1 | Proof writes on `lane-ui`: one group, three applications, one payment record each, three assignments, two reassignments, two authorizations, one filed record, one outcome and its correction, one unresolved decision, one later fact, one refused intake | A rerun meets earlier rows; the proof identifies its rows by the dated group label | Approve; synthetic only; seeded data unchanged |
| Q-W11-09 | P2 | Travel agent text for `reconciliation_exhausted_no_refiling` in the shared intake catalogue (S-W11-01) | After completion, a new intake shows the bare code | Send the seam note; the UAT-13 fallback stands meanwhile |
| Q-W11-10 | P2 | SA-09u warns, and does not block, while a mark is active (Core accepts) | The restore lost the filed evidence; the SuperAdmin records "unresolved"; the mark's evidence later shows the filing | Accept the warning; STOP-W11-07 note to the orchestrator |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W11-01 | SA-04a rebuilt on the kept path; tabs by `?tab=`; History is a link to the audit page | Address state (enumerated) |
| D-W11-02 | Four SA-09 kinds on WP-06's route; names `unresolved_outcome`, `correct_outcome`, `correct_fields`, `protection_mark` (no subject) | Kind enumeration only; POST paths unchanged |
| D-W11-03 | SA-09e identity input mapped from the posted values; unchanged values sent unchanged | Command input carries unchanged identity values (Core: no change) |
| D-W11-04 | SA-09e adds `field.<key>` inputs for the served `fields` shape | New field names on an existing form (OP-02a convention) |
| D-W11-05 | Success locations carry `&op=` and move to the SA-09 pages | Locations change |
| D-W11-06 | No truncation in the three handlers (LD-17) | Over-limit input reaches Core's contract and is refused at the field |
| D-W11-07 | The mark refusal re-renders SA-09m from the hidden `applicationId` | Re-render target |
| D-W11-08 | The future-owner select adds the viewer ("You") | One more option value (an account id Core accepts) |
| D-W11-09 | UI-PLAN SA-04 "records the completion" read as "records the outcome"; no completion claim | None (Core decides) |
| D-W11-10 | SuperAdmin history is the full audit subject page | Link only |
| D-W11-11 | WP-07 and WP-08 texts amended (F-22 to F-28, E-16, E-17) before their build | Display only |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W11-01 | Kind 1 (P1) | On `core.admin_case.mark`: `possibly_filed`, `possibly_paid`, `possibly_released`, `restore_id`, `recorded_at`, and the number of active marks of the application | UX §6.1 "Resolve a permitted exception: … evidence, actual effect"; B40; SA-09m must say what to check | 1 facts in `core_protection_marks` (`store.ts:495-516`); 2 removes a manual join of the case read with the mark's audit read; 3 same scope as `core.admin_case`; 4 named by subject (the mark) | Generic hard-stop sentence naming all three; audit link. **P1** |
| STOP-W11-02 | Kind 1 (P1) | On the staff act row: `future_owner_id`, `exhausted_by`, `exhausted_reason`, `state_changed_at` | UX §3.2 "show reconciliation evidence, owner and next step"; B23 "with attempts, reason, TA notice and future owner"; the "Decided" state and SA-04a | 1 facts in `core_action_authorizations` (`store.ts:311-317`); the names are already in `names` (`staff-views.ts:159`); 2 removes an audit-page round trip; 3, 4 hold | "Not shown on this page" with the audit link; neutral receipt. **P1** |
| STOP-W11-03 | API surface defect (neither Kind 1 nor Kind 2: Core already defines the behaviour) plus a Kind 1 part (P1) | `core.apply_held_correction` is on the edge allowlist only (`allowlists.ts:43`) and has a TA route only (T48), although Core assigns re-application of a `superadmin_evidence` correction to a SuperAdmin and of an `assistance_entry` correction to the operator (`drafts.ts:170`), and the pending answer names them (`derived.ts:322`). Kind 1 part: held and released corrections (id, kind, state, changed field paths, actor, time) on the staff read | B19 "Assigned unfiled correction pauses filing/packet release until accepted evidence"; UX §3.2 "Keep proposed corrections separate" | Defect: the staff allowlist entry and a staff binding route are `src/core-api/` changes (not lane-owned). Kind 1 part: 1 facts in `core_corrections`; 2 removes a hidden duty; 3, 4 hold | Scenario: a held SuperAdmin correction is released by "not filed" evidence; Core's pending answer names "SuperAdmin: apply the correction again" and no staff page can; the operator's application shows "Waiting on a SuperAdmin" until someone records the correction again from evidence (the released one then no longer applies, but the pending answer keeps naming it: P2 Core note). Interim: §2.1.3 row 7. **P1** |
| STOP-W11-04 | Kind 1 (P2) | A list of applications held by an active protection mark (inventory D08 `/admin/queues/protection-marks` is unregistered) | SA-01 group 15 link | 1, 3, 4 hold; 2 removes a filter of a projection page by reason | SA-04l `owner=superadmin` view with the reason words. P2 |
| STOP-W11-05 | Kind 1 (P2) | Active SuperAdmins with a second factor on `core.admin_case` (as `operators`) | Future-owner choice | 1, 3, 4 hold; 2 removes a refusal-driven discovery | Operators and "You". P2 |
| STOP-W11-06 | Contract note (P2) | `passportType` is absent from the `core.correct_from_evidence` wire contract (`contracts/core.ts:50-53`) although the Core input accepts it (`commands/admin.ts:23-27`) | A SuperAdmin cannot correct the passport type from evidence | A contract change: outside the lane | The field is not offered. P2 |
| STOP-W11-07 | Core behaviour note (P2) | The unresolved decision and the outcome correction run no control stage, so an active protection mark does not stop them (`acts.ts:169-215`, `admin.ts:48-71`) | B40 mark "holds" guarded actions | — (behaviour; Kind 2 if changed) | SA-09u warning; SA-09o states the mark. P2 |
| STOP-W11-08 | Kind 1 (P2) | The reconciliation attempt note on `ops.case_work` (stored in `ops_reconciliation_attempts.note`; the fact `ops.reconciliation_attempt_recorded` does not carry it, `operations/case-work/commands/acts.ts:148-155`) | SA-09u evidence (UX §3.2 "show reconciliation evidence"): the SuperAdmin decides on attempts whose findings are text | 1 fact stored; 2 removes a decision on method and result words alone; 3, 4 hold | "The notes of the attempts are not shown on staff pages in this release." Method, result, evidence references and recorder shown. P2 |

No STOP item blocks the WP-11 main path (V11). No P0 item is open in this design. Kind 2 requested: none. STOP-W11-03
goes to the orchestrator as a defect with its Kind 1 part, for the Core batch (`core-reads-2026-10-12`) or the WP-17
design, whichever the orchestrator chooses.

### 9.5 Seam notes

| ID | Seam | Rule |
|---|---|---|
| S-W11-01 | Travel agent text for `reconciliation_exhausted_no_refiling` in `src/apps/shared/pages/intake.ts` (shared with the bulk lane; S-01 pattern) | One text line; the orchestrator confirms the file grant before U5 edits it; otherwise the UAT-13 fallback stands (P2) |
| S-W11-02 | STOP-W11-01 to -03 adoption | When a seam version serves them, adopt per §3 in the open package then (S-08 pattern) |
