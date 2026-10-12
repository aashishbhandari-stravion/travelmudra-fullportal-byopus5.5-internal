# WP-07 design review: operator readiness and external action

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-07
holds commands that change filing state, money exposure and access to case work, so a Codex design review applies).
Product base: lane repository at 42cb373 (WP-01 shell and result components, WP-20 public site; LD-14 optional-read
helper). WP-02, WP-03 and WP-06 are designed and not yet built; this design depends on their unit U0 components and
on the WP-06 SA-09 route family (§1.6). This document writes no product code. Paths in `file:line` form are relative
to the lane repository at 42cb373 unless they start with `REC/` (`internal/records/`) or `RM` (lane
`research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 42cb373. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** OP-01 My work (saved views) and the operator's Applications destination (view "All assigned" and a
  labelled read-only section for read grants); OP-02 Application workspace (identity band, status facts, action
  panel, tabs Work, Application & documents, External actions, Delivery & originals, History; readiness checklist
  CMP-15; money summary CMP-16 per AD-09); OP-03 Return to TA (also "Return for TA review") and Flag to SuperAdmin;
  OP-04 external action: authorization review, execution evidence, "Execution is uncertain", reconciliation
  attempts; SA-07 Finance home, a travel agent's exposure ceiling, lower, request increase; SA-09 kinds: Gate 2,
  four readiness-gate kinds, ceiling increase approve and decline. 12 register commands plus two pulled in
  (`ops.record_reconciliation_attempt` from WP-11, `core.flag` from WP-09) and the Gate 2 and readiness uses of
  `core.grant_gate_exception`.
- **Page model.** Existing paths stay (LD-03). OP-02 tabs are `?tab=` values on the kept case path. OP-04a (the
  authorization review) registers the existing unregistered inventory entry O45 `GET /ops/applications/:id/acts`, the
  path its form already posts to. OP-04b is new: `/ops/applications/:id/acts/:authorizationId`. OP-03, the ceiling
  task pages and the decision pages sit as GET pages on the POST paths of their one form (WP-06 pattern). New:
  `/ops/applications` (Applications). `/ops/grants` answers 303 to the read-only section. No form action changes. No
  hidden-field name changes; three deviations touch the protocol (§9.3: D-W07-07 hidden `result` on the uncertain
  form and up to five evidence rows; D-W07-06 the authorize UNR location; D-W07-12 one re-rendered refusal).
- **Rules the pages state (Core facts, not page rules).** Authorization is permission, not execution. An authorized
  or uncertain act is protected as possibly filed: no repeat of that act, no second fee payment, no ordinary
  withdrawal. Gate 2 applies to TravelMudra-filed work at the first government commitment of an attempt; a Gate 1
  exception never passes it. The exposure ceiling is compared and the fee reserved in the same commit as the
  authorization; a breach has no exception. Of the three B28 parked cases, OP-04 shows the two that can arise for
  an operator (paid case at the default ₹0 ceiling; unused reservation release) and SA-07 shows all three.
- **Findings worked (§9.1).** The authorization is a disclosure with a digest prefix as its "review"; the lost
  answer copy tells the operator to "resubmit the same form"; "filing uncertain" is an option in a select; the
  applicant-withdrawal form stays offered while a filing may have happened; the work list has no views or owner
  labels and lists no read-grant application anywhere; the ceiling pages compute "Within the ceiling" (green) and
  "Over the ceiling"; approval has no decision page; the reason sentence of `ready` reads "Ready".
- **Interim and switch (§3).** Command identity in receipts (P-10 b): receipts establish the command from the
  record selected by the returned id where they can; neutral "Request recorded" elsewhere; one data change switches
  to `commandName`. Action-specific gate context (P-10 e): gate rows show Core's blockers and the exception records
  side by side, never "Payment received"; the switch shows "Met" or "Action allowed by exception ([scope])".
- **STOP items (§9.4).** No P0. STOP-W07-01 (Kind 1, P1): the gate basis of each offered act (Gate 2, readiness
  gate) and of the start-work offer on the operator's case view, an extension of the approved P-10 (e) helper.
  STOP-W07-02 to -07 (Kind 1 or defect note, P2): exposure preview for the operator, authority confirmations on the
  staff case view, a grant-only filter on `views.ops_work`, a Gate 2 decision queue, the `gate2` payments view that
  likely always reads "unknown", the review point per work item.
- **Top questions (§9.2).** Q-W07-01 retire the operator "Services" rail item (recommended: retire the destination,
  keep the two routes until Max decides). Q-W07-02/-03 pull reconciliation and flag into WP-07. Q-W07-04 build the
  four readiness kinds now and delete the carried generic grant form. Q-W07-07 (P1, two readings): a separate
  government fee payment while the submission's filing is unknown.
- **Proofs (§6).** V09 and V10 on `lane-ui` with a fresh synthetic travel agent per run: the paid case at ₹0 refused
  as parked, a two-SuperAdmin increase (AD-03), a reservation, a non-overridable breach under a Gate 2 exception,
  lowering below counted exposure, an unused reservation; authorization not execution, protected uncertainty,
  reassignment, reconciliation to "filed". V08 on `lane-ui` with the interim gate rows (partly met until
  STOP-W07-01) and by test for missing evidence and a cut-off.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` | §2 (all), §3.1 steps 5–6, §3.2 (TA reports a problem; unknown external execution; preparation-only and third-party as context), §3.3, §5 (all), §6.3 (exception, manual money record), §7.3, §7.4, §8.2, §8.3, §10.1, §12 V07–V11 |
| `BUILD_SPEC.md` r2 | B10, B18–B23, B26–B29, B33, B35, B43, B45 |
| `UI-PLAN.md` | A (AD-03, AD-04, AD-09, AD-13), §1, §2.1–§2.3, §3.3 OP-01 to OP-05, §3.4 SA-07, SA-09, §4.1 steps 6–10, §4.2 (assistance; report a problem; preparation-only; third-party; unknown external execution), §5.3, §5.4 SA-07, SA-09, §6.3, §6.4, §7 (K rules; rows of the WP-07 commands), §8 (CMP-01, 03, 06, 09, 11, 15, 16, 20, 25), §10, §11, §12.1, §13 (B-03, B-04, A-04, A-09, A-13, A-14) |
| `SURFACE-INVENTORY-2026-10-10.md` | §0, §1, §2.3 RM-O1 to RM-O4, §2.4 RM-A8, RM-A11, §2.6, CMD-29 to CMD-40, CMD-69 to CMD-72, §4, §5 (groups A, C, F), §6 |
| `DECISIONS-2026-10-10.md` | §1.3, §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-01 to LD-15), §7, §8 (S-07, S-08); `PROPOSALS.md` (P-02, P-10, P-11, P-12); `COMMAND-COVERAGE.md` §3, §5, §6; `WP-01.md` §3, §4; `WP-02.md` §3, §4.1 (B-01 to B-14); `WP-03.md` §3, §4.1 (C-01 to C-14); `WP-06.md` §3, §4.1 (D-01 to D-13); `WP-02-design.md` §1.6, §2.6, §3.10; `WP-03-design.md` §1.6, §2.0, §2.7, §3.1, §3.2, §4.7; `WP-06-design.md` (structure; §1.6, §2.0, §2.6, §2.7, §2.8–§2.10); `execution-2026-10-12/CORE-TASK-PROMPT.md`; `DESIGN.md` |
| Route map (RM) | §1, §2.2 rows C03.ops, C04–C06.ops, O02–O60, D10, D19, D20, D27, D47–D51, D102–D108; §2.3 O01, O05, O45; §3.1, §3.2; §4.3; §5 |
| Code (reads, commands, fields, states) | `src/apps/staff/core/{ops,case,admin}.ts`, `src/apps/staff/operations/{case-work,labels,incidents}.ts`, `src/apps/staff/payments/{routes,admin}.ts`, `src/apps/shared/pages/payments.ts`, `src/apps/staff/attention.ts`, `src/apps/staff/identity.ts:508-522, 566-572`, `src/apps/shared/core/shared.ts` (`CORE_MESSAGES`, `optionalView`, `answer`, `receiptLocation`, `readReceipt`, label tables), `src/apps/shared/evidence-form.ts`, `src/web/ui/{shell,status,presentation}.ts`, `src/web/route-inventory.ts`; contracts `src/contracts/{core,operations-work,payments,views-cases,identity,queries}.ts`; Core behaviour only: `src/modules/core/commands/{acts,gates,holds,withdrawal}.ts`, `src/modules/core/{controls,derived,model,staff-views}.ts`, `src/modules/operations/case-work/commands/{acts,work,effort}.ts`, `src/modules/payments/{commands/ceiling,writers,queries}.ts`, `src/core-api/bindings/{core,kernel,views-cases}.ts`, `src/kernel/vocabulary/{application,controls,external-acts,operations,payments}.ts`, `catalogue/synthetic/catalogue.json` |
| Tests that pin the pages | §7.3 |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| OP-01 | My work | `/ops/work?view=&page=` | Kept, rebuilt (landing stays) | `core.ops_work`; opt. `ops.incidents`; opt. `dlv.packet_handovers` (only for rows whose pending answer is a released packet, today's `packetHandoversOf`) |
| OP-01a | Applications (view "All assigned" and read-only access) | `/ops/applications?progress=&owner=&page=&after=` | **New** (`ops.applications.list`, action `application.read`) | `core.ops_work`; opt. `iam.own_grants`; opt. `views.ops_work` (projection; read-only rows) |
| (kept) | Read grants | `/ops/grants` | Kept path; answers 303 to `/ops/applications#read-only` (D-W07-02) | — |
| OP-02 | Application workspace | `/ops/applications/:applicationId?tab=work\|application\|acts\|delivery` | Kept, rebuilt; tabs by query value (D-W07-03) | `core.ops_case`; `ops.case_work`; opt. `doc.application_evidence`; opt. `dlv.delivery_page` (outside a support view, as today); opt. `ops.official_result_form` (when offered, as today); opt. `dlv.packet_handovers`; opt. `iam.own_grants` (read-grant line only) |
| OP-02h | History tab | `/ops/applications/:applicationId/history` | Kept, wrapped in the OP-02 frame (Q-W07-13) | `views.ta_history` (as today); `core.ops_case` (frame) |
| OP-03r | Return to TA / Return for TA review | `/ops/applications/:applicationId/return` (GET beside the POST) | **New** (`ops.applications.return_form`, action `operator.formal_return`) | `core.ops_case`; opt. `ops.case_work` |
| OP-03f | Flag to SuperAdmin | `/ops/applications/:applicationId/flag` (GET beside the POST) | **New** (`ops.applications.flag_form`, action `operator.flag`) | `core.ops_case` |
| OP-04a | Request authorization for an external act | `/ops/applications/:applicationId/acts?act=&pending=` | **New registration** of inventory O45 (id `ops.applications.acts`, action `operator.authorize_external_act` as declared) | `core.ops_case`; `ops.case_work`; opt. `doc.application_evidence`; `core.operation` (pending mode only) |
| OP-04b | External act record (evidence, execution uncertain, reconciliation) | `/ops/applications/:applicationId/acts/:authorizationId?record=evidence\|uncertain\|reconciliation` | **New** (`ops.applications.act`, action `application.read`) | `core.ops_case`; `ops.case_work`; `core.operation` (receipt) |
| SA-07h | Finance (Money & exposure home) | `/admin/finance` | Kept, rebuilt | `pay.finance_index` |
| SA-07t | Exposure ceiling of one travel agent | `/admin/finance/tas/:taAccountId` | Kept, rebuilt | `pay.ta_finance`; `core.operation` (receipt) |
| SA-07l | Lower the ceiling | `/admin/finance/tas/:taAccountId/ceiling/lower` (GET beside the POST) | **New** (`admin.finance.lower_form`, action `ceiling.lower`) | `pay.ta_finance` |
| SA-07i | Request a ceiling increase | `/admin/finance/tas/:taAccountId/ceiling/increase-request` (GET beside the POST) | **New** (`admin.finance.increase_form`, action `ceiling.increase_request`) | `pay.ta_finance` |
| SA-09c | Decision: approve or decline a ceiling increase | `/admin/finance/ceiling-changes/:changeId/decide/:kind`, `kind` ∈ {`approve_increase`, `decline_increase`} | **New** (`admin.finance.change_decision`, action `exposure.read`; no `resolve`, as the POSTs) | `pay.ceiling_change`; `pay.ta_finance` |
| SA-09 (Gate 2) | Decision: Gate 2 exception | `/admin/applications/:applicationId/decide/gate2_commitment` | Kind added to the WP-06 route `admin.decisions.application` | `core.admin_case`; opt. `pay.application_payments` |
| SA-09 (readiness) | Decision: readiness-gate exception for one act | `/admin/applications/:applicationId/decide/:kind`, `kind` ∈ {`readiness_submission`, `readiness_fee_payment`, `readiness_provider_handoff`, `readiness_packet_release`} | Kinds added to the same route (Q-W07-04) | `core.admin_case` |
| (WP-06) | Service payment of one application (SA-07a) | `/admin/applications/:applicationId/payments` | WP-06 page; WP-07 adds the Gate 2 decision link only | as WP-06 |
| (old) | SuperAdmin case page | `/admin/applications/:applicationId` | Not rebuilt (SA-04, WP-11). WP-07 removes the carried generic grant form and adds links | unchanged |

Each new GET route validates its parameters with zod (`zWireId('app')`, `zWireId('aut')`, `zWireId('acc')`,
`zWireId('cec')`, the kind enumerations); a parse failure is the uniform 404. Query values are enumerated or opaque
(SH-R06): `tab`, `view`, `act`, `record`, `progress`, `owner` are closed sets (an unknown value is ignored and the
default applies); `page` is a positive integer below 100; `after` is the projection cursor pattern of
`views-cases.ts` (`<seq>:app_…`); `pending` is an operation key (pattern of `receiptLocation`).

### 1.3 Shell placement and the operator "Services" decision

Operator rail after WP-07 (WP-01 §2.2 table, `SURFACE_CONFIG.ops`; one block, applied by the architect):

| # | Destination | Candidates | Members (tabs) | Note |
|---|---|---|---|---|
| 1 | My work | `/ops/work` | "My work" `/ops/work` | "Read grants" leaves this destination (transitional member removed) |
| 2 | Applications | `/ops/applications` | "Applications" `/ops/applications` | Appears now that the page is registered |
| 3 | Incidents and follow-up | `/ops/incidents` | as today | — |
| 4 | Originals | `/ops/originals` (none) | — | Hidden until OP-09 (WP-12) |
| 5 | Notices and account | `/ops/notices` | as today | — |
| — | Services | — | — | **Removed from the rail** (Q-W07-01) |

Pages that pass `current`: OP-01 `/ops/work`; OP-01a `/ops/applications`; OP-02, OP-02h, OP-03, OP-04 the origin
destination: `/ops/work` by default, `/ops/applications` when the address carries `from=applications` (SH-R07). The
nav count of `/ops/work` keeps its rule (`workNeedingAttention`, `src/apps/staff/attention.ts:20-23`); the new
destination has no count. SuperAdmin pages pass `/admin/finance` (SA-07h, SA-07t, SA-07l, SA-07i, SA-09c, SA-09 Gate
2) and `/admin/queues/assignment` (SA-09 readiness kinds: they follow a reassignment).

**Decision recommended on "Services" (WP-01 Q-12, WP-02 B-08).** Retire the rail destination now. Keep the two
read-only routes (`ops.catalogue.index`, `ops.catalogue.offering`) registered, with no link from the shell, until
Max decides their retirement at the end review (LD-02 makes route retirement Max's decision). Reasons: (1) UX §5.2
and UI-PLAN §2.2 list no Services destination for the operator; (2) an operator works an application under the
values it was submitted with, and the current published values can differ, so a top-level destination invites the
wrong reading; (3) the staff case view carries no offering id (`zWireStaffCase.offering`, `src/contracts/core.ts:293`),
so a contextual link from OP-02 to the offering page is not possible without a new fact; (4) WP-02 B-08 already made
the pages read-only with no admission conclusion, so keeping the routes harms nothing. Breadcrumbs: OP-02 reads "My
work › [applicant]" or "Applications › [applicant]"; OP-03 and OP-04 add "› [page]". SA-07t reads "Money & exposure ›
Finance › [travel agent]"; SA-09 Gate 2 reads "Money & exposure › Finance › [applicant]".

### 1.4 The WP-07 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" lists the `_rev.<aggregate>` fields.
"Handler change" lists location, receipt and re-render changes; no command input mapping changes except D-W07-07.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.start_work` | `ops.case_work.start_work` (`…/start-work`) | **OP-02 Work** | — | — | Success `receiptLocation('/ops/applications/<id>?tab=work', 'work_started', key)`; refusal re-renders OP-02 Work |
| 2 | `ops.record_work_step` | `ops.case_work.work_step` (`…/work-steps`) | OP-02 Work | `stepCode`, `state`, `note` | — | as #1, code `step`; typed values kept |
| 3 | `ops.record_readiness` | `ops.case_work.readiness` (`…/readiness`) | OP-02 Work (readiness section) | `basisDigest` (hidden), `note` | `application`, `hold`, `material` | as #1, code `readiness`; note kept |
| 4 | `ops.withdraw_readiness` | `ops.case_work.withdraw_readiness` (`…/readiness/:readinessId/withdraw`) | OP-02 Work | — | — | as #1, code `readiness_withdrawn` |
| 5 | `ops.record_effort_sample` | `ops.case_work.effort` (`…/effort-samples`) | OP-02 Work (secondary disclosure) | `stepCode`, `minutes`, `missingReason` | — | as #1, code `effort` |
| 6 | `core.formal_return` | `ops.applications.return` (`…/return`) | **OP-03r** (moved from the case page) | `note`, `resolveProblemHoldId` (optional select) | `application` | Success `receiptLocation('/ops/applications/<id>/return', 'returned', key)`; refusal re-renders OP-03r with both values |
| 7 | `core.flag` (from WP-09, Q-W07-03) | `ops.applications.flag` (`…/flag`) | **OP-03f** (moved from the case page) | `note` | — | Success `receiptLocation('/ops/applications/<id>/flag', 'flagged', key)`; refusal re-renders OP-03f |
| 8 | `core.authorize_external_act` | `ops.applications.authorize_act` (`…/acts`) | **OP-04a** (moved from the case page) | `actKind`, `readinessId`, `basisDigest` (hidden), `feeAmount` (fee-carrying act), `confirmIrreversible=yes` (checkbox) | `application`, `hold`, `material` | Success `receiptLocation('/ops/applications/<id>/acts/<aut>', 'authorized', key)` with `<aut>` = `summary.authorizationId` (pattern-checked; else the External actions tab); refusal re-renders OP-04a for the posted `actKind` (fee kept, confirmation unchecked); **UNR: 303 to `/ops/applications/<id>/acts?act=<kind>&pending=<key>`** (D-W07-06) |
| 9 | `ops.record_act_evidence` (filed / not filed) | `ops.case_work.act_evidence` (`…/acts/:aut/evidence`) | **OP-04b** `record=evidence` | `fromState` (hidden), `result` (select of two), `evidence.<n>.kind\|id\|note` (n = 0…4), `eventAt`, `feePaid` | — (Core checks `fromState`) | Success `receiptLocation('/ops/applications/<id>/acts/<aut>', 'evidence', key)`; refusal re-renders OP-04b in the posted mode |
| 10 | `ops.record_act_evidence` (filing unknown, CMD-38) | same route | **OP-04b** `record=uncertain` | `fromState` (hidden), `result` (**hidden** = `filing_unknown`, D-W07-07), `evidence.<n>.*`, `eventAt` | — | as #9 |
| 11 | `ops.record_reconciliation_attempt` (from WP-11, Q-W07-02) | `ops.case_work.reconciliation` (`…/acts/:aut/reconciliation`) | **OP-04b** `record=reconciliation` | `method`, `result`, `evidence.<n>.*`, `note`, `feePaid` (`conclude` derived by the BFF, as today) | — | Success code `reconciliation`; refusal re-renders OP-04b |
| 12 | `core.grant_gate_exception` (Gate 2) | `admin.applications.grant_exception` (`/admin/applications/:id/gate-exceptions`) | **SA-09 `gate2_commitment`** | `gate`=`gate2_government_commitment`, `action`=`first_government_commitment` (both hidden), `reason` | `application` | The WP-06 handler's (gate, action) → kind map gains this pair; success `receiptLocation('/admin/applications/<id>/decide/gate2_commitment', 'granted', key)`; refusal re-renders the kind with the reason |
| 13 | `core.grant_gate_exception` (readiness gate) | same | **SA-09 `readiness_*`** | `gate`=`readiness_gate`, `action` ∈ {`authorize_government_submission`, `authorize_government_fee_payment`, `authorize_provider_handoff`, `release_packet`} (hidden), `reason` | `application` | as #12 for the four pairs |
| 14 | `pay.lower_ceiling` | `admin.finance.lower` (`…/ceiling/lower`) | **SA-07l** | `newCeiling` (₹), `reason`, `basis` (hidden; the BFF sends it as `expectedCeilingBasis`) | — (basis) | Success `receiptLocation('/admin/finance/tas/<ta>', 'lowered', key)`; refusal re-renders SA-07l with values |
| 15 | `pay.request_ceiling_increase` | `admin.finance.increase_request` (`…/ceiling/increase-request`) | **SA-07i** | as #14 | — (basis) | Success to SA-07t code `requested`; refusal re-renders SA-07i |
| 16 | `pay.approve_ceiling_increase` | `admin.finance.increase_approve` (`/admin/finance/ceiling-changes/:changeId/approve`) | **SA-09c `approve_increase`** | `reason` (optional) | `change` | Success `receiptLocation('/admin/finance/ceiling-changes/<id>/decide/approve_increase', 'approved', key)`; refusal re-renders SA-09c, **also for `unavailable_dependency`/`audit_degraded`** (D-W07-12) |
| 17 | `pay.decline_ceiling_increase` | `admin.finance.increase_decline` (`…/decline`) | **SA-09c `decline_increase`** | `reason` | `change` | Success code `declined` on the decline page; refusal re-renders it |

Each command has exactly one host page for its WP-07 use, so a refusal always re-renders the page it came from.

### 1.5 Carried forms

Carried (LD-07). Each keeps its markup, fields, action and success redirect until its package rebuilds it. A unit
test lists them by action path (§7.2). The table names the tab that hosts each one after WP-07.

| Command (route) | Owner | Host after WP-07 |
|---|---|---|
| `core.resolve_hold` (`ops.applications.resolve_hold`) | WP-09 | OP-02 Work, section "Holds" (per open hold, as today `ops.ts:162-170`) |
| `core.record_assistance_entry` (`ops.applications.assistance_entry`); `doc.upload_for_application`, `doc.associate` (ops routes) | WP-09; WP-03 (ops route) | OP-02 Application & documents (only in `assistance_in_progress`, as today) |
| `core.record_forecast`, `core.propose_deferral`, `core.end_deferral`, `core.recheck_travel_dates` | WP-17 | OP-02 Work, sections "Timing", "Deferral", "Travel-date recheck" |
| `core.record_applicant_withdrawal` | WP-17 | OP-02 Work, section "Ending the case"; relabelled under possible filing (§2.4.6, D-W07-15) |
| `ops.request_packet_build`, `core.release_packet` | WP-10 | OP-02 External actions (preparation-only services) |
| `ops.record_official_result`, `core.record_outcome` (cancellation), `ops.record_artifact`, `ops.open_incident` | WP-08 | OP-02 Delivery & originals |
| `ops.record_original_receipt`, `…_movement`, `…_return`, `ops.link_original` | WP-12 | OP-02 Delivery & originals |
| `ops.report_wrong_recipient` | WP-14 | OP-02 Delivery & originals |
| `dlv.*` downloads and the delivery page | WP-08 | Link "Open the delivery page" in Delivery & originals (old page, LD-02) |
| `pay.reassign_follow_up_owner`; follow-up list and item | WP-16 | Linked from SA-07h; unchanged |
| `pay.release_reservation`, `pay.exclude_fee` (boundaries, no form) | WP-16 (CC-08) | Notices on SA-07t (§2.10.2); no form |

Forms that leave a page: the return, flag and authorize forms leave the operator case page; the act-evidence and
reconciliation disclosures leave the case-work panels; the ceiling forms (lower, increase, approve, decline) leave
SA-07t; the generic "Grant a gate exception" disclosure leaves the old SuperAdmin case page (`admin.ts:269-276`).
The old case page then holds links "Gate 2 decision" (SA-09 `gate2_commitment`, open TravelMudra-filed application)
and "Readiness exception for [act]" (when `readiness.validity = previous_operator`).

### 1.6 Shared components

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`,
`readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`),
CMP-13 (operation status page; `unresolvedBanner`), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage`,
CMP-01 `actionPanel`, `statusFacts`, `objectTabs`. WP-03 U0: CMP-02 `evidenceRows`, CMP-11 `identityBand`. WP-06 U0:
CMP-06 `queueTable`; U4: the SA-09 registry and routes. Existing: `dataTable`, `summaryList`, `choiceGroup`,
`selectField`, `textareaField`, `textField`, `checkboxField`, `confirmDisclosure`, `disclosure`, `identifier`,
`timeAt`, `money`, `pollRegion` (not used).

Dependency: WP-07 builds after the WP-02, WP-03 and WP-06 U0 commits and the WP-06 U4 SA-09 commit are integrated.
WP-07 MUST NOT build a second decision frame, band or queue table.

New in WP-07 (unit U0, §7.1):

- **CMP-15 Readiness checklist** (`readinessChecklist`, `src/web/ui/readiness.ts`). `h3` per group in a fixed order
  (Mandatory validations; Declared prerequisites; Gates; Cut-offs; Holds and open decisions; Other). One row per
  item: label, status word from the closed set {Met; Not met; Action allowed by exception ([scope]); No blocker now;
  Checked at the request; Applicability unknown; No exception exists for this control; Not applicable yet;
  Unavailable}, evidence text,
  owner, one resolution link. No summary line, no count of met rows, no "Ready", no percentage. The status word is
  text and an icon (AC-06). Tone: Not met uses `blocked`; allowed by exception uses `warning` ("passed by exception",
  DESIGN tone table); Met uses the success presentation (ink text with check, no hue); the others are neutral.
- **CMP-16 Money facts panel** (`moneyPanel`, `src/web/ui/money-panel.ts`). `h3` "Money"; rows with a label, a
  value (`money(…, 'neutral')`) or a state word ("Not recorded", "Unavailable", "Payment unknown"); an optional
  note line. It renders no "due", no "owed", no total and no sum of rows.
- **CMP-20 Saved view tabs** (`savedViewTabs`, `src/web/ui/saved-views.ts`). A `nav` with a list of links; each link
  "[view name]" with a count line "[n] applications" or "Unavailable"; the current one has `aria-current="page"`.
  Views are links (GET), never client-side filters. A count of zero shows "None".
- **CMP-11 staff meta** (`identityBand` in `src/web/ui/bands.ts`, WP-03 U0 file): optional meta items for staff
  (masked passport cue, service kind, travel agent, operator). The `h1` keeps name and reference.

## 2. Page specifications

### 2.0 Rules common to every WP-07 page

- **Freshness (LD-08).** Every WP-07 read is authoritative except `views.ops_work` (OP-01a read-only section). Pages
  show CMP-12 "Read at [time] IST". The read-only section carries its own lag line ("Up to date when read at …",
  "Behind by [n] s when read at …", "Freshness unavailable"). No page applies its own age threshold.
- **Page states.** S1: pages are rendered complete by the server; no skeleton exists. S5: only the read-only section.
  S6 and S7: SH-02 pages of WP-01 (uniform 404 without object facts; Core unreachable: neutral "TravelMudra is
  unavailable now" (WP-01 A-09, WP-02 B-03); "Nothing was sent, so nothing changed" only after a proven refusal).
  Each page below lists S2, S3, S4 and its specific states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders "Unavailable" in place of
  each fact the read supplies. Every other refusal reaches the shell, so a reassignment, a revoked read grant or a
  suspension removes the page on the next read (B10, SH-R04). No page code catches every error.
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>`; CMP-08 first in `main`; its title first
  in the document title; recorded facts only from the operation summary and from records selected by the ids it
  returns; every later read labelled "Current" (WP-02 B-02, WP-03 C-03, WP-06 D-02). Where the command cannot be
  established from kind, id, summary and the selected record, the receipt is neutral: "Request recorded" (§2.11).
  REJ: the host page re-rendered at the POST address with `restorePath` = the GET page; the category's status;
  CMP-07 focused; every typed value kept, except the `confirmIrreversible` checkbox (unchecked after any refusal)
  and the hidden digests (re-read); sentences from the closed table (§2.13); an unknown code shows the category text
  plus "Reference code: [code]". C5: CMP-14 (§2.12). UNR: 303 to `/ops/operations/<key>` (WP-01 CMP-13), except
  authorize (§2.7.4); no page offers a new submission of the same intent while it is unresolved.
- **K rules.** `core.authorize_external_act`, `ops.record_act_evidence`: K-EXT. All other WP-07 commands: K-STD; the
  ceiling increase pair: K-2P. A form carries one `_op` from page load; a browser resend reuses it; a re-render
  after a refusal issues a new `_op` (a refused command records nothing, B35).
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic"
  (CR-08). Forbidden: "File visa", "Override", "Admin override", "Ready" or "Approved" as an overall status,
  "Payment received" as a gate status, "Something went wrong", "Force", "Pay now". The authorize action always reads
  "Request authorization for the [act]". The words follow the specification's spelling ("authorization"); the
  current copy's "Authorise" is replaced (staff `nextActionLabel('authorize_external_act')` becomes "Request
  authorization for the external act", a one-value change in `src/web/ui/presentation.ts`, architect). The reason
  sentence of the pending code `ready` ("Ready for the next external step.", `shared.ts:52`) MUST NOT appear on an
  operator page; OP-01 and OP-02 use "Readiness is recorded and current. Next: request authorization for the
  external act." (staff variant in the WP-07 closed table, F-W07-13). All copy is draft (CR-09).
- **Read grants (SH-R10).** A reader with a group read grant and no assignment sees OP-02, OP-02h and OP-04b read
  only: no form, no action link to a form page, the line "Read-only access: [purpose], until [time] IST" from
  `iam.own_grants` (the grant whose `group_id` equals the case's group; "Read-only access" alone when that read is
  unavailable). On OP-03 and OP-04a they see the frame and the line "Only the assigned operator takes this step.
  You can read this application." with no form (`viewerAssigned = false`; the BFF does not enforce the route's
  declared action, RM §1 item 1, so the page states it from Core's fact). A former operator after a reassignment
  gets the uniform 404 from `core.ops_case` (SH-02).
- **Support view.** None of these pages offers a form in a support view (existing rule, `inSupportView`).
- **Mobile (< 768 px).** One column. Identity band → protected-state banner → action panel → tab links (wrapping, never
  scrolling sideways) → content (AC-21). OP-03, OP-04 and the SuperAdmin decision pages are full-screen task pages:
  scope and effect before fields; the primary action at the end of the form, never in a fixed bar. Queue rows become
  labelled cards.

### 2.1 OP-01 My work `/ops/work`

Purpose: choose the next accountable task (UX §5.1, §5.2, §5.4, §7.3 Operator Home).

Anatomy (reading order):

1. Header: `h1` "My work"; lead "Applications assigned to you, those that need you first. Views are filters of the
   same list."; freshness "Read at [time] IST".
2. Primary action (when Action now has a row): button link "Open [applicant]: [step]" to the first Action-now row
   (OP-02, `from` absent). No primary action otherwise.
3. Saved view tabs (CMP-20): Action now, Waiting, Returned to TA, Delivery and closure, Continuing duties. Each with
   its count ("[n] applications"; Continuing duties "[n] duties"). A link "All assigned applications" to OP-01a sits
   after the strip (it is another destination, so it is not a tab).
4. The current view's list (`queueTable`, section `id="work-list"`), columns in this order: Application (applicant
   link to OP-02, reference `identifier`, group label); Service; Current task (`nextActionLabel(code)` or the staff
   reading's step); Blocker (the reason sentence when the step waits or is blocked; empty for an ordinary own step);
   Owner (closed labels below); Review point (only a recorded date, else empty). A row of alert tier 1 or 2 carries a
   text marker (below).
5. Pagination: 50 rows a page (A-12), `page` in the address; "Rows [a]–[b] of [n] applications in this view".
6. Cap line when `items.length = 500` (`staff-views.ts:215`): "This list shows the first 500 applications assigned to
   you. More may be assigned."

View membership (closed rules over Core facts; each open item in exactly one of the first four views, by this
precedence):

| View | Rule (Core facts of `core.ops_work` and the reads above) |
|---|---|
| Action now | `workItemNeedsAttention` today (`ops.ts:99-101`): the staff reading's owner is `assigned_operator`, or `openProblemReport`, or an open custody incident the reader acts on; plus every `reviewsDue` application. Its count equals the nav count by construction (DESIGN "a tab and its page agree") |
| Returned to TA | `pending.reasonCode = hold_returned_to_ta` |
| Delivery and closure | `progress = delivery_closure_pending` (an outcome is recorded) or `pending.reasonCode = packet_released` |
| Waiting | every other open item (owner TA for another reason, SuperAdmin, external party, system, Accounts, a known limitation or none) |
| Continuing duties | incidents of `ops.incidents` that the reader acts on (`readerActsOn`) whose `applicationId` is not an open assigned item (completed, ended or no application). One row per incident: kind label, application (incident row's `application`), opened [time] IST, link to `/ops/incidents/<id>` |

Owner labels (UX §5.4): own step → "You must act"; `ta` → "Travel agent must act"; `superadmin` → "SuperAdmin
decision needed"; `external_party` → "External evidence awaited"; `deferral_active` → "No current action; next review
[date]" when the date is known (a `reviewsDue` row), else "No current action until the deferral review" (STOP-W07-07);
`system` → "TravelMudra processing"; `accounts` → "Accounts"; `unresolved_known_limitation` → "Unavailable in this
release"; `none` → "No current action". A step the staff reading moves to the travel agent (packet download) reads
"Travel agent must act" (DESIGN "A file to collect").

Alert order inside every view (UX §5.4): tier 1 first, then tier 2, then tier 3; Core's order inside a tier.

| Tier | Facts | Marker (text and `warning` tone; never `danger`) |
|---|---|---|
| 1 Protected or blocked action | `pending.reasonCode` ∈ {`act_authorized`, `filing_possibly_occurred`, `protection_mark_active`, `held_correction_pending`}; `openProblemReport`; an open custody incident the reader acts on | "Protected: a filing may have happened" / "Held after a restore" / "Problem reported" / "Correction held" / "Original's whereabouts uncertain" |
| 2 Recorded travel risk or overdue review | `reviewsDue`; `pending.reasonCode = travel_date_recheck_pending` | "Review date reached [date]" / "Travel dates changed: recheck pending" |
| 3 Ordinary task | every other row | none. Waiting rows never carry a marker (no red badge on ordinary waits) |

| State | Copy |
|---|---|
| S2 nothing assigned | "Nothing is assigned to you. A SuperAdmin assigns applications to you; they appear here, those that need you first." |
| S2 view empty | Action now: "Nothing needs you now. [n] applications wait on others: see Waiting." Other views: "No application in this view." |
| S4 `ops.incidents` unavailable | Continuing duties count "Unavailable"; its list "Incidents cannot be read now."; custody markers absent with the line "Custody incidents cannot be read now." above the list; nav count follows WP-01 (Unavailable) |
| S4 `dlv.packet_handovers` unavailable | Rows read as Core's pending answer alone (today's rule, `case.ts:133-138`) |
| S4 unknown reason code | Core's sentence fallback with the code as a reference (`sentence`) |

Mobile: each row a card in the order applicant, current task, owner, blocker, review point, service, group.

### 2.2 OP-01a Applications `/ops/applications`

Purpose: all assigned applications, and the applications the operator may read under a group read grant (UI-PLAN
§2.2 row "Applications"; A-09; UX §5.2 "A rare read grant is clearly labelled and never adds actions").

1. Header: `h1` "Applications"; lead "Applications assigned to you, and applications you may read under a read grant.";
   freshness.
2. Filter (GET, enumerated): "Progress" (the six B21 meanings, staff labels) and "Waiting on" (You; Travel agent;
   SuperAdmin; External party; Other). "Apply"; "Clear the filter".
3. Section `h2` "Assigned to you" (`id="assigned"`): the same row columns as OP-01, all open items, Core's order,
   pagination 50, the 500 cap line.
4. Section `h2` "Read-only access" (`id="read-only"`), lead "You may read these applications for the purpose
   stated. Read access allows no action and ends at its time." Then:
   - one line per grant of `iam.own_grants` with state active: "Read-only access: [purpose], until [valid_until] IST
     · Group [group reference]" (`identifier`; the group label is not in the read, STOP-W07-04);
   - a table of the `readOnly = true` rows of the `views.ops_work` page read with `after` (columns: Application
     (`displayName` link to OP-02 with `from=applications`), Progress, Waiting on), and the projection lag line;
   - when the page read has `next ≠ null`: link "Read the next part of the list" (`after=<next>`) and the line "The
     list is read 200 applications at a time; read-only applications may be in a later part." (interim, STOP-W07-04).
5. Grants that ended show nowhere here (the reader no longer has them).

| State | Copy |
|---|---|
| S2 nothing assigned, no grant | "Nothing is assigned to you and you hold no read access." |
| S3 | "No application matches this filter." + "Clear the filter" |
| S4 `iam.own_grants` unavailable | "Read access cannot be read now." (section kept) |
| S4 `views.ops_work` unavailable | Grant lines stay; "The applications you may read cannot be listed now." |
| S5 projection behind | The lag line; rows shown as read |

`/ops/grants` answers 303 to `/ops/applications#read-only` (D-W07-02).

### 2.3 OP-02 frame (every tab, OP-02h, OP-03, OP-04)

1. Breadcrumb (§1.3); freshness.
2. Receipt (when `done` and `op` are in the address).
3. Identity band (CMP-11): `h1` "[SURNAME], [Given names]" and "Application [reference]" (`identifier` with copy).
   Meta: "Passport ending [last 2 characters]" (the masked cue, `aria-label` "Passport number ending [..]"; the full
   number shows only in Application & documents and OP-04a, the task contexts); Service (`offering.title`); Kind
   (`MODE_LABELS`); Group; Travel agent (name, "account suspended" when `taSuspended`); Operator ("You" when the
   viewer is assigned, else the name; "Not assigned"); "Synthetic" when synthetic. Country is not in the staff case
   read and is left out (never "Unknown").
4. Protected-state banner (every tab; first match first, all that apply, alert order): protection mark ("Held after a
   restore: [sentence]"); an act in `filing_unknown` (the fixed sentence of §2.8.2); an act in `authorized`
   ("Authorized, not executed: [act] may have happened at any time since [time] IST. Record what happened."); open
   problem report; open return; open flag; active deferral ("No current action until [review date]");
   travel-date recheck pending. A tab MUST NOT hide one of these (UX §7.3). Tones: protected or blocked items use
   `warning` (text and icon); a deferral or a pending recheck uses `info`; no item uses `danger`.
5. Status facts (CMP-03, `statusFacts`), separate rows: Progress; Outcome ("Outcome not recorded"); Next ("You —
   [step]" or "Waiting on [owner]: [step]"); Stage (lifecycle); Editing (`EDITOR_LABELS`); External acts (one line
   per act: "[act]: [state words]", or "None authorized"); Readiness (`VALIDITY_LABELS`, recorded by [name] at [time]
   IST); Holds ("None open" or the open holds by name); Originals (only when originals exist or custody counts are
   above zero: "[n] parts held; [m] whereabouts unknown"); Delivery evidence (from `completion` prerequisite
   `delivery`: "Recorded", "Not recorded yet", or "Not applicable yet" before an outcome). No payment row: the money
   panel says why (§2.4.3).
6. Action panel (CMP-01) "Next action" (§2.4.5).
7. Tabs (`objectTabs`, links): Work `?tab=work` (default), Application & documents `?tab=application`, External
   actions `?tab=acts`, Delivery & originals `?tab=delivery`, History `/ops/applications/:id/history`. The current
   tab has `aria-current="page"`. Each tab keeps `from` in its link.
8. Tab content.

Read-grant reader: items 6 and every form are absent; item 4 and 5 stay; the read-grant line of §2.0 shows under the
band.

### 2.4 OP-02 Work tab (default)

#### 2.4.1 Content in reading order

1. Readiness checklist (CMP-15) `h2` "Readiness checklist for [next act]" (the first offered act whose evaluation
   is shown; "for the packet release" for preparation-only; "for the next step" when no act is offered). Lead "Each
   row comes from the records now. TravelMudra checks every row again when you confirm readiness or request
   authorization."
2. Money panel (CMP-16) (§2.4.3).
3. Section "Work" (`id="work"`): "Work on this assignment: Started [time] IST / Not started"; the work steps table
   (as today); "Start work" form (offered when `offers.startWork.allowed`; otherwise CMP-10 with the blockers, §2.4.4);
   "Record a step" (disclosure, as today); "Record your effort" (disclosure, secondary).
4. Section "Readiness" (`id="readiness"`): facts (state, recorded by, at, note); the confirm form (below); "Withdraw
   this judgement" (own judgement only, as today).
5. Section "Holds" (`id="holds"`): open holds table with the carried resolve form; links "Return to TA" (OP-03r) and
   "Flag to SuperAdmin" (OP-03f) when Core's state allows the command (editor state facts, as today `ops.ts:218,225`).
6. Carried sections: "Travel-date recheck" (when pending), "Deferral", "Timing" (forecast form), "Ending the case".

#### 2.4.2 Readiness checklist rows (sources and words)

Rows come from Core facts only. A row is "Met" only on a positive fact. Evaluation blockers carry only a code on the
wire (`zWireEvaluation`), so the page places each code by a closed table (`src/apps/staff/work/reading.ts`); an unknown
code goes to "Other" with its sentence and reference. Blockers are taken from `caseWork.offers.recordReadiness`, from
`caseWork.offers.startWork` and from each `actOffers[].evaluation`, de-duplicated by code.

| Group | Row | Source | Status words |
|---|---|---|---|
| Mandatory validations | One row per declared requirement | `doc.application_evidence` (opt.) | "Met: accepted (version [ref])" only for `satisfied`; every other status uses the WP-03 §4.7 words with owner (travel agent through a return, or TravelMudra) and link "Open the document"; "Unavailable" when the read failed |
| | Applicant population and identity | blocker codes `population_*`, `identity_conflict_unresolved`, `identity_*` | "Not met: [sentence]"; owner travel agent; route "Return to TA" (OP-03r). No row when no such blocker |
| | Travel dates | `travelRecheck`; codes `travel_rule_*` | "Not met: [sentence]"; owner you; route "Go to the recheck" |
| Declared prerequisites | One row per dependency | `case.dependencies` | `met` → "Met"; `waiting`, `unmet_missing_evidence` → "Not met: [DEPENDENCY_LABELS]"; owner "The related application's work"; `failed_incompatible` → "Not met: incompatible result". Sibling content never shown (B22) |
| Gates (for [act]) | Gate 1: service payment, first operator work | `caseWork.workStarted`; `offers.startWork` blockers | Work started → "Met when work started on this assignment" (interim; the basis is not in the read, §3.2). Not started, allowed → "No blocker now". Blocked by `gate1_payment_not_received` (+ `gate_exception_stale\|expired\|grantor_inactive`) → "Not met: the service payment is not recorded as received and no fresh Gate 1 exception for the first work exists"; owner SuperAdmin; route "Flag to SuperAdmin" (assigned) or the known-gap line (assistance in progress, §2.6.3) |
| | Gate 2: government commitment (TravelMudra-filed only) | `actOffers[]` of `government_submission` / `government_fee_payment`; `case.gateExceptions` | Blocker `gate2_payment_not_received` → "Not met: the service payment is not recorded as received and no fresh Gate 2 exception exists"; owner SuperAdmin; route "Flag to SuperAdmin". No Gate 2 blocker on an offered act → "No blocker now" (interim) plus, when a `gate2_government_commitment` exception row is `granted`, the line "Exception on record: Gate 2, first government commitment, open until [time] IST"; after the switch "Met: service payment recorded as received" or "Action allowed by exception (Gate 2, first government commitment, until [time] IST)" (§3.2). Never "Payment received" as a status |
| | Readiness gate | `readiness.validity` | `valid` → "Met: recorded by [name] at [time] IST"; `missing` → "Not met: not recorded; you record it"; `stale_basis` → "Not met: something changed since it was recorded; confirm it again"; `held` → "Not met: a hold is open"; `previous_operator` → "Not met: recorded by the previous operator; confirm it yourself, or a SuperAdmin may grant a readiness exception for one act" |
| | Exposure ceiling (fee-carrying act only, `carriesFee`) | none for the operator (STOP-W07-02) | Status "Checked at the request"; text "TravelMudra compares the fee with the travel agent's ceiling when you request authorization. A breach stops the request. No exception exists for this control." |
| Cut-offs | Each cut-off code | `declared_cutoff_passed`, `withdrawal_cutoff_*` | "No exception exists for this control: [sentence]". No row when none |
| Holds and open decisions | Open holds; deferral active; protection mark; transition pending; held or released correction; catalogue impact; offering treatment (`existing_work_*`, `offering_*`); filing protection (`act_already_open`, `fee_payment_unknown`, `reconciliation_exhausted_no_refiling`) | `case.holds`, `case.deferral`, `case.mark`, blocker codes | "Not met: [sentence]" with owner and route (Return to TA, resolve the hold, OP-04b, SuperAdmin) |
| Other | Unknown codes | — | "Not met: [Core sentence]" + "Reference code: [code]" |

Notes under the group "Gates": "A Gate 1 exception never passes Gate 2." and "An exception allows one action. It
records no payment and asserts no readiness, authority or evidence." The checklist never renders an overall line.

#### 2.4.3 Money panel (CMP-16, AD-09) on Work and External actions

Rows (Core facts the operator may read): Price in effect (`price.effectivePricePaise`, "Not quoted (not submitted)");
Price change ("None open" / "Waiting for the travel agent's decision"); Government fee (fee-carrying act only): "Not
authorized yet" / "Reserved [₹] at authorization ([time] IST)" (`acts[].fee_amount_paise`) / "Paid [₹] (evidence
recorded [time] IST)" (`actEvidence[].feePaidPaise`) / "Payment unknown" (fee-carrying act in `filing_unknown`).
Note line: "Service payment and exposure are recorded by SuperAdmins. The gates above show whether they block your
next act." No "due", no amount owed, no total.

#### 2.4.4 Start work and the other Work forms

- **Start work** (`offers.startWork.allowed`): text "Starting work records the first work on this assignment. Gate 1
  (the service payment, or a Gate 1 exception for the first work) is checked now." Button "Start work". Blocked:
  CMP-10 "Starting work is unavailable until [first blocker sentence]. Owner: [owner]." with the route of §2.4.2.
- **Record readiness** (`offers.recordReadiness.allowed` and `basisDigest ≠ null`): visible review text (not inside
  `<details>`): "You judge this application ready on what this page shows now. A later change to documents, identity,
  holds, dates, terms, external acts or the packet makes the judgement out of date, and you confirm it again."
  Fields: hidden `basisDigest` (= `caseWork.basisDigest`), `_rev.application`, `_rev.hold`, `_rev.material`; "Note
  (optional)" `note` (maxlength 1000). Button "Confirm readiness" (first record) / "Confirm readiness again". The
  "Basis fingerprint" identifier of today (`case-work.ts:161`) is removed (meaningless to the reader; the digest
  stays hidden). Blocked: CMP-10 with the blocker sentences; no form.
- **Withdraw readiness**: `confirmDisclosure` "Withdraw this readiness judgement?" body "External acts and the packet
  release then wait until you confirm readiness again." Button "Withdraw the judgement".
- **Record a step**, **Record your effort**: as today (fields unchanged), in disclosures.

#### 2.4.5 Action panel (CMP-01) mapping, in priority order

Facts: Core's pending answer through the staff reading (`staffReadingOf`), the offers and the acts. The panel states
no permission; a step that Core reports blocked shows its blocker type in text. Closed table:

| # | Condition (Core facts) | Owner | Step | Blocker type | Action |
|---|---|---|---|---|---|
| 1 | an act `filing_unknown` | You | "Reconcile whether the act was filed" | "Protected: a filing may have happened" | "Record a reconciliation attempt" → OP-04b `record=reconciliation` |
| 2 | an act `authorized` | You | "Record what happened after the authorized act" | — | "Record external action evidence" → OP-04b `record=evidence` |
| 3 | `nextActionCode = resolve_problem_report` | You | "Deal with the travel agent's problem report" | "Filing authorization and packet release wait until you deal with it and confirm readiness again" | "Return to TA" → OP-03r; secondary "Go to the holds" |
| 4 | `nextActionCode = return_to_ta` | You | the step label | — | "Return to TA" → OP-03r |
| 5 | `start_operator_work` | You | "Start work" | Gate 1 blocked → "A SuperAdmin decision can resolve it" | "Start work" (`#work`) or "Flag to SuperAdmin" |
| 6 | `record_readiness`, `reconfirm_readiness` | You | the step label | validation blockers → "Evidence can fix it" | "Confirm readiness" (`#readiness`) |
| 7 | `authorize_external_act` | You | "Request authorization for the [act]" (first offered act; the reason sentence of `ready` is replaced, §2.0) | from that act's blockers: gate → "A SuperAdmin decision can resolve it"; parked → "Policy unavailable"; holds → "You deal with it" | "Request authorization for the [act]" → OP-04a `act=<kind>` |
| 8 | `release_packet` | You | the step label | — | "Go to the packet" (External actions tab) |
| 9 | `record_outcome` | You | the step label | — | "Go to the official result" (Delivery & originals) |
| 10 | other own steps (`nextStepTarget` today) | You | the step label | — | the existing targets, mapped to their tabs |
| 11 | owner is not the viewer | the owner label of §2.1 | "Waiting on [owner]: [step]" | "Another person owns this step" | none |

"Also needed" (as today) lists an open custody incident the reader owns. Review point: the deferral's `review_on`
when a deferral is approved ("Review point: [date]"); nothing else is a review point (no invented deadline).

#### 2.4.6 Ending the case under possible filing (UX §5.3, B23)

When any act is in a possibly-filed state (`isPossiblyFiled`, the kernel's classification
`src/kernel/vocabulary/external-acts.ts:39`; `authorized`, `filing_unknown`, `reconciliation_exhausted`), the
"Ending the case" section shows CMP-10 first: "Ordinary withdrawal is unavailable: a filing may have happened.
Owner: you (reconcile the act). Route: [the act's page]." The carried WP-17 form stays reachable only under the
trigger "Record the applicant's request only" with the added line "TravelMudra records the request and refuses it as
a withdrawal while a filing may have happened." (Core records the request and assesses it refused,
`withdrawal.ts:1-9`.) The cancellation button follows Core's offer as today.

#### 2.4.7 States of the Work tab

| State | Copy and controls |
|---|---|
| Not started, Gate 1 blocked | Action panel row 5 with "Flag to SuperAdmin"; checklist Gate 1 row "Not met" |
| Approved help in progress | "An operator is entering information with the travel agent's approval." Return form labelled "Return for TA review" (§2.6.1) |
| TA reported a problem | Banner; checklist hold row; panel row 3 |
| Readiness by the previous operator (after reassignment) | Readiness row "Not met: recorded by the previous operator…"; panel row 6 |
| Execution uncertain | Banner (fixed sentence); panel row 1; §2.4.6 |
| Offering hold | Hold row "Not met: [sentence]"; owner TravelMudra; no route (policy) |
| Read-grant reader | Facts only, no forms |
| C3 `work_started`, `step`, `readiness`, `readiness_withdrawn`, `effort` | Receipts (§2.11) |
| C2 | §2.13; typed values kept |
| C5 readiness | CMP-14 (§2.12) |

### 2.5 OP-02 other tabs

#### 2.5.1 Application & documents `?tab=application`

Applicant facts (full identifiers: the task context), information version, Country of residence, Passport type; the
documents (CMP-02 `evidenceRows`, staff wording, "Open the document" links; carried assistance upload and associate
forms when approved help is in progress); Related applications (declared dependencies: relation, requirement, state);
Price and timing (as today, without the "Due" amount: `serviceAmountDue` is not used on the operator page;
`servicePayment` is null for the operator anyway); carried assistance entry when in progress. S4: documents read
unavailable → "Documents cannot be read now."

#### 2.5.2 External actions `?tab=acts`

Protected banner (frame). Money panel. Acts table (as today `actsTable`: act, state words, fee, authorized by and at,
reconciliation owner) with one link per row "Open the act record" (OP-04b). For each offered act kind (assigned
operator only): a line "[act]: [Can be requested now / Not available now: first blocker sentence]" and a link
"Request authorization for the [act]" (OP-04a). Carried WP-10 packet build and release (preparation-only). Context
lines per mode: TravelMudra-filed "You perform the government acts by hand after authorization."; third-party "The
declared provider files. Authorizing the provider handoff is permission to hand over, not filing."; preparation-only
"No external act: the work ends in a packet for the travel agent." Read-grant reader: the table and lines only.

#### 2.5.3 Delivery & originals `?tab=delivery`

Delivery and completion prerequisites (`completionSection`, as today, with its boundary notice wording kept until
WP-08: LD-04 applies there); link "Open the delivery page"; carried official result, cancellation, artifacts,
disclosure and incident forms (WP-08, WP-14); carried originals (WP-12); incidents table of the case.

#### 2.5.4 History

The existing page, wrapped in the OP-02 frame (identity band, banner, status facts, tabs; no action panel). The
timeline content is unchanged until its package rebuilds it (CMP-09 is not in WP-07).

### 2.6 OP-03 Return and Flag

Full-screen task pages in the CMP-25 order (Scope → Evidence → Effect → Your decision → Review → buttons). The
OP-02 frame items 1–5 head the page; no tabs.

#### 2.6.1 OP-03r Return to TA `/ops/applications/:id/return`

Label by Core fact: `editor_state = assistance_in_progress` → "Return for TA review" (never "Submit for TA");
otherwise "Return to TA".

1. `h1` "Return to the travel agent: [applicant]" / "Return for the travel agent's review: [applicant]".
2. Scope: "This application only. You stay its assigned operator."
3. Evidence: open holds (problem report note, opened [time]); assistance state; readiness; documents needing the
   travel agent (CMP-02 rows that are not satisfied).
4. Effect: "The travel agent can change the application within the returned scope and hands it back. You stay the
   assigned operator. Filing authorization and packet release wait until it is handed back and you confirm
   readiness again." Assistance: "The travel agent reviews what you entered and submits; help never confirms or
   submits for them."
5. Your decision: "What the travel agent must do" (`note`, textarea, 4 rows, maxlength 2000, hint "Name the fields
   or documents and the reason."); "Resolve the problem report with this return" (`resolveProblemHoldId`, select,
   optional, placeholder "Keep it open", only when a problem report is open; options name the report by opened time
   and the first 60 characters of its note); `_rev.application`.
6. Review (visible): "When you return it: the travel agent is notified and can correct it; you remain the operator;
   readiness must be confirmed again before any filing authorization or packet release."
7. Buttons "Return to TA" / "Return for TA review" (primary); "Cancel" → OP-02 Work.

| State | Condition | Copy |
|---|---|---|
| Not possible | `editor_state` ∉ {`assigned`, `assistance_in_progress`} or a return hold is open | "The application is already with the travel agent." / "A return is open: the travel agent hands it back." No form |
| Possibly filed | any act possibly filed | The form stays (Core accepts a return then: `holds.ts:83-118` checks no act). A warning above the fields: "A filing may have happened. Corrections the travel agent makes are held until the act is reconciled; protected facts do not change." (B23; Core holds the corrections, `controls.ts` stage 8). Deviation D-W07-16 from UI-PLAN §5.3, which shows a boundary: a page MUST NOT block a command that Core accepts |
| C3 `returned` | — | Receipt; then the "already with the travel agent" state |
| C2 | — | `hold_not_applicable` → "The application cannot be returned in its current state." + re-read state; note kept |
| C5 | `stale_revision` | CMP-14 (§2.12) |

#### 2.6.2 OP-03f Flag to SuperAdmin `/ops/applications/:id/flag`

1. `h1` "Flag to a SuperAdmin: [applicant]".
2. Scope: "A decision only a SuperAdmin can make on this application, for example a Gate 2 decision or a Gate 1
   exception for the first work. You keep the application."
3. Evidence: the current blockers that a SuperAdmin decision can resolve (gate codes from the offers), with their
   sentences; open holds.
4. Effect: "Filing authorization and packet release wait until a SuperAdmin responds, you resolve the flag and you
   confirm readiness again." (B18; the hold changes the readiness basis, `derived.ts:58-60`.)
5. Your decision: "What needs a decision" (`note`, 4 rows, maxlength 2000, hint "Name the decision and the action
   it is for, for example: Gate 2 decision for the government submission.").
6. Review (visible): "When you send it: SuperAdmins see it in Flags from operators; the application waits for their
   response."
7. Buttons "Send the flag" (primary); "Cancel".

| State | Condition | Copy |
|---|---|---|
| Already flagged | open `flagged_to_superadmin` hold | "A flag is open since [time] IST. Wait for the SuperAdmin's response." No form |
| Not assigned state | `editor_state ≠ assigned` | `assistance_in_progress`: "A flag is not available while approved help is in progress. Ask a SuperAdmin directly: no in-product request exists for this state yet." (WP-06 D-06 known gap; switch when P-12 C lands, §3.3). Returned: "The application is with the travel agent." No form |
| C3 `flagged` | — | Receipt (neutral until P-10 b, §2.11) |
| C2 | `conflict_duplicate`/`hold_not_applicable` | "A flag is already open. No second flag was sent." |

#### 2.6.3 Gate routes the operator sees

Gate 1 for the first work and Gate 2 have one in-product route for the operator: "Flag to SuperAdmin" (WP-06 PM Q-05
decision; UI-PLAN A-04). Every CMP-10 that names a gate blocker says "Owner: SuperAdmin" and links OP-03f, with the
line "The flag holds filing until you resolve it and confirm readiness again." No page offers the operator a control
that grants, waives or overrides a gate.

### 2.7 OP-04a Request authorization `/ops/applications/:id/acts?act=<kind>`

Purpose: perform the declared external act once (UX §5.3 "Manual filing"; B23, B27, B28). `act` ∈
{`government_submission`, `government_fee_payment`, `provider_handoff`}. Without `act`: 303 to `?tab=acts` of OP-02.

#### 2.7.1 Anatomy (review screen; facts before fields)

1. Frame items 1–5; `h1` "Request authorization for the [act]: [applicant]".
2. `h2` "Scope": Application [reference] · Service · Kind · Travel agent · Operator: you. "Act: the [act] of this
   application, first attempt. Authorization is permission to act by hand. It is not evidence that the act happened."
3. `h2` "Governing facts": Applicant (full name, date of birth, passport number, issuing country: the task context);
   Information version [n]; Accepted documents (CMP-02 rows with version references, `satisfied` only as "Accepted");
   Readiness judgement (recorded by [name] at [time] IST; state); Price in effect; Original estimated window.
4. `h2` "Authority": "The travel agent's authority statements were confirmed at submission. A renewed authority after
   a price or terms change is checked when you request authorization." Open price change or terms change: its fact.
   (Statements and versions are not in the staff read, STOP-W07-03.)
5. `h2` "Payment and fee controls": the Gates rows of the checklist for this act (§2.4.2); for the fee-carrying act:
   "Government fee: you enter the exact amount TravelMudra will pay. TravelMudra compares it with the travel agent's
   exposure ceiling and reserves it in the same step as the authorization. A breach stops the request; no exception
   exists for it." Money panel.
6. `h2` "External action": TravelMudra-filed: "You perform the [act] by hand on the authority's site after the
   authorization. TravelMudra does not file for you." Provider handoff: "You hand the application to the declared
   provider by hand. A handoff is not filing; the provider's filing evidence is recorded separately."
7. `h2` "Reconciliation owner": "You. If the application is reassigned, the new operator becomes the owner." (Core
   sets the authorizer, `acts.ts:144`; reassignment transfers, `assignment.ts:263`.)
8. Blockers (when `evaluation.allowed = false`): CMP-10 per blocker group, in the order of the checklist, each with
   reason, owner and route (§2.13). No form. `unavailableButton` "Request authorization for the [act]" with
   `aria-describedby` (AC-13).
9. `h2` "Your request" (when allowed): fee-carrying act: "Government fee" (`feeAmount`, ₹ prefix, `inputmode
   decimal`, hint "The exact amount TravelMudra will pay, in rupees, for example 1,500."); checkbox
   `confirmIrreversible` value `yes`, label "I understand that this act cannot be undone once performed, and that I
   perform it by hand.", never prechecked, unchecked after every refusal; hidden `actKind`, `readinessId`
   (`readiness.readinessId`), `basisDigest` (`authorizationDigest`), `_rev.application`, `_rev.hold`, `_rev.material`.
10. Review (visible): "When you request authorization: TravelMudra checks everything again and records the
    authorization with your name, the evidence it rests on, and you as reconciliation owner[; it reserves the
    government fee you entered against the travel agent's exposure ceiling in the same step]. From that moment this
    application is protected as possibly filed: no repeat of this act, no ordinary withdrawal. Authorization is not
    execution: after you act, record what happened, or that it is uncertain."
11. Buttons "Request authorization for the [act]" (primary); "Cancel" → External actions tab.

#### 2.7.2 States (first match)

| State | Condition (Core facts) | Copy and controls |
|---|---|---|
| Not the assigned operator | `viewerAssigned = false` (a read grant) | "Only the assigned operator requests authorization. You can read this application." No form |
| No access (reassigned away, grant ended) | `core.ops_case` refused | Shell SH-02 (LD-14) |
| Not an act of this service | `act` not among `actOffers[].kind` | "This service has no [act]." Link back. No form |
| Already authorized or uncertain | blocker `act_already_open`, or an act of this kind in `authorized`/`filing_unknown` | "The [act] is already authorized ([time] IST, [name]). It may have happened. Do not perform it again: record what happened." Link "Open the act record" (OP-04b). No form. (Repeat removed, B23) |
| Filed before | blocker `parked_repeat_external_act` | CMP-10 "A second [act] after a filing is unavailable in this release. Owner: product owner." No form |
| Reconciliation exhausted | `reconciliation_exhausted_no_refiling` | "Reconciliation was exhausted for an earlier act. Refiling is never implied. Owner: SuperAdmin." No form |
| Fee payment unknown | `fee_payment_unknown` | "Whether the government fee was paid is unknown. It cannot be paid again until that is reconciled. Owner: you." Link to the act record. No form (payment removed) |
| Gate 2 blocks | `gate2_payment_not_received` (+ freshness codes) | CMP-10 "Requesting authorization is unavailable until the service payment is recorded as received or a SuperAdmin records a Gate 2 exception for this application. Owner: SuperAdmin." Route "Flag to SuperAdmin" (§2.6.3); line "A Gate 1 exception does not pass Gate 2." No form |
| Readiness gate blocks | `readiness_*` | CMP-10 with the validity sentence; route "Confirm readiness" (OP-02 Work); `previous_operator` adds "or a SuperAdmin may grant a readiness exception for this act". No form |
| Hold, deferral, mark, offering hold, validation | the codes | CMP-10 with owner and route (§2.13). No form |
| Allowed | `evaluation.allowed = true` | §2.7.1 items 9–11 |

#### 2.7.3 Results

| Result | Page |
|---|---|
| ACC | 303 to OP-04b of the new authorization `?done=authorized&op=` (§2.11) |
| REJ `control_blocked` | Re-render OP-04a at `/ops/applications/<id>/acts` (`restorePath` `?act=<kind>`): CMP-07 with the blocker sentences; fee kept; checkbox unchecked; the state table above applies to the re-read facts |
| REJ `unavailable_parked` / `exposure_parked_paid_case_default_ceiling` | Specific boundary (B28 parked case, paid at ₹0): "Committing this government fee is unavailable: for a paid application of a travel agent whose ceiling is the default ₹0, the reservation rule is not decided. Owner: product owner. A SuperAdmin can set a ceiling for this travel agent; an increase needs two SuperAdmins." Nothing authorized, nothing reserved (one commit, B28) |
| REJ `exposure_ceiling_breach` | Non-overridable stop: "The government fee would take this travel agent over the exposure ceiling. Nothing was authorized or reserved. No exception exists for this control. Owner: SuperAdmin; two SuperAdmins can raise the ceiling." No exception route |
| REJ `stale_revision` (`readiness_basis_changed`, `authorization_basis_changed`, `stale_revision`) | CMP-14 (§2.12); fresh hidden digests from the re-read |
| REJ validation (`feeAmountPaise` required / not applicable / too small) | On the fee field: "Enter the exact government fee in rupees." / "This act carries no government fee." |
| REJ `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." |
| UNR | §2.7.4 |

#### 2.7.4 Pending mode (UNR, D-W07-06): `?act=<kind>&pending=<key>`

The authorize handler answers `outcome_unknown` with 303 to this address. The page reads `core.operation {key}`
(opt.) and the case. No authorization form renders in this mode while the result is unknown.

| `core.operation` | Copy (banner first in `main`, CMP-13) | Controls |
|---|---|---|
| `in_progress`, `no_record_yet` | "Authorization result unknown. Do not perform the external act." + "TravelMudra is still checking request [reference]." | "Check status" (GET of the same address). No form |
| read unavailable | "Authorization result unknown. Do not perform the external act." + "The status cannot be read now." | "Check status". No form |
| `accepted` and the expectation of `authorized` holds | Receipt "Authorization recorded" (as §2.11) | Link "Open the act record" |
| `accepted`, expectation fails | Unchecked receipt (WP-01 A-04) + the line above | "Check status" |
| `not_recorded` | "Request not recorded. Nothing was authorized. You may request authorization again." | The review and form with a new `_op` |

The case facts render below the banner; when they show an `authorized` act of this kind, the line "Current: the
[act] is authorized ([time] IST)" corroborates the result.

### 2.8 OP-04b External act record `/ops/applications/:id/acts/:authorizationId`

Reads the case and case work; the act is the `acts` row with this id (absent → uniform 404). Modes by `record`:
none (facts only), `evidence`, `uncertain`, `reconciliation`. Forms only for the assigned operator outside a support
view; a mode that the act's state does not allow falls back to the facts with a line saying why.

#### 2.8.1 Facts (every mode)

`h1` "[Act]: [applicant]"; state words (closed set: "Authorized, not executed"; "Filed (evidence recorded)"; "Not filed
(evidence recorded)"; "Execution uncertain"; "Reconciliation exhausted"); authorized by [name] at [time] IST;
government fee reserved [₹] (fee-carrying); reconciliation owner [name] ("you" when the viewer); evidence records
(result, evidence references, event time, recorded by and at); reconciliation attempts (method, found, recorded by and
at, concluded evidence). Mode links: "Record external action evidence", "Execution is uncertain" (from `authorized`
only), "Record a reconciliation attempt" (from `authorized` or `filing_unknown`).

#### 2.8.2 State banners

| Act state | Banner (first in the page body) |
|---|---|
| `authorized` | "Authorized, not executed. Perform the [act] by hand, then record what happened. Until evidence is recorded the application is protected as possibly filed: no repeat, no ordinary withdrawal." |
| `filing_unknown` | **"Filing outcome is unknown. Do not repeat the external action. [Owner] is reconciling the evidence."** ([Owner] = the reconciliation owner's name, "(you)" appended for the viewer.) Then: "Repeat, government fee payment and ordinary withdrawal are unavailable until the evidence is reconciled. Elapsed time does not mean it was not filed." |
| `filed_evidenced` | "Filed: evidence recorded [time] IST. The result is awaited from the authority or provider." |
| `not_filed_evidenced` | "Not filed: evidence recorded. The application goes through readiness again before a new authorization." Fee-carrying act: B28 parked notice "The [₹] reserved for this fee stays counted against the travel agent's exposure ceiling: releasing an unused reservation is not decided. Owner: product owner." |
| `reconciliation_exhausted` | "Reconciliation exhausted. Refiling is never implied. A SuperAdmin records the unresolved outcome (WP-11)." |

#### 2.8.3 Mode `evidence` (CMD-37)

Fields: hidden `fromState` (= the act's state); "What the evidence shows" `result` (radio, none preselected): "Filed
(I have proof it reached the authority)" `filed_evidenced` / "Not filed (I have proof it did not)" `not_filed_evidenced`;
evidence rows `evidence.<n>.kind` (select: External reference; Document of this group), `evidence.<n>.id`,
`evidence.<n>.note` (optional), rows 0 to 4 (row 0 shown; rows 1–4 inside "Add more references" disclosure without
JavaScript, revealed one by one with it); "When it happened (optional)" `eventAt` (date); fee-carrying act and
result filed: "Government fee paid" `feePaid` (₹; hint "Required when the fee-carrying act is filed."). Review:
"When you record it: the act moves to [Filed/Not filed]; this record is kept as it is. A record that was wrong is
corrected by a later record or an owned incident, never by editing." Button "Record the evidence". Attestation is not
offered here (Core refuses it for filed and not filed, `src/modules/operations/case-work/commands/acts.ts:35-38`).

#### 2.8.4 Mode `uncertain` (CMD-38, the "Execution is uncertain" path)

Only from `authorized`. `h2` "Execution is uncertain". Lead "Use this when you may have performed the act but have no
proof either way, for example the portal timed out after you paid." Fields: hidden `fromState` = `authorized`, hidden
`result` = `filing_unknown` (D-W07-07); "What happened" evidence rows with kind options "My statement" (attestation),
External reference, Document; at least one row; `eventAt` optional. Review (visible): "When you record it: the
application stays protected as filed. Repeat, government fee payment and ordinary withdrawal stay unavailable. You
reconcile the evidence; TravelMudra never retries the act." Button "Record execution as uncertain".

#### 2.8.5 Mode `reconciliation` (CMD-39)

Fields: "How you checked" `method` (the five methods, labels as today); "What you found" `result` (No information;
Inconclusive; Found it was filed; Found it was not filed); evidence rows (optional; required by Core for a
conclusion); "What happened" `note` (required, maxlength 2000); fee-carrying act and "Found it was filed": `feePaid`.
Review: "A finding 'filed' or 'not filed' records the act's evidence in the same step. 'No information' and
'Inconclusive' keep the act uncertain." Button "Record the attempt".

#### 2.8.6 States and results

| State | Copy |
|---|---|
| Mode not allowed by state | "This act is [state words]: [mode] does not apply." Facts only |
| Not the assigned operator (read grant) | Facts only; no mode links |
| C3 `evidence`, `reconciliation` | Receipts (§2.11); the page then shows the new state |
| C2 `act_evidence_insufficient` | On the evidence fieldset: "Filed or not filed needs an external reference or a document; a statement alone is not enough." |
| C2 `act_state_transition_invalid` | Form-level: "That change of the act's state is not allowed from [state]." + re-read state |
| C2 `stale_revision` (`fromState` differs) | CMP-14: "The act changed since you opened the page: it is now [state]." |
| C2 fee field (`required`, `not_applicable`) | On `feePaid` |
| C2 evidence rows over five | Form-level, before any command: "Give at most five references." (BFF check, D-W07-07) |
| Reassigned away | Shell SH-02 (Core 404 on the next read) |

### 2.9 SA-09 decision kinds of WP-07

Rendered through CMP-25 and the WP-06 registry (`src/apps/staff/decisions/kinds.ts`). Each kind is one registry
entry; the frame, routes, receipts and the hidden-field protocol are WP-06's.

#### 2.9.1 Kind `gate2_commitment` (`/admin/applications/:id/decide/gate2_commitment`)

Reads `core.admin_case`; opt. `pay.application_payments` (entries, follow-ups).

1. Header: breadcrumb "Money & exposure › Finance › [applicant]"; `h1` "Gate 2 exception for the first government
   commitment: [applicant]"; freshness.
2. `h2` Scope: Application [reference] · Service · Kind "Filed by TravelMudra" · Travel agent · Operator. "Gate: Gate 2,
   government commitment. Action: the first government commitment of this application's filing attempt (the
   government fee payment or the government submission, whichever is requested first), once."
3. `h2` Evidence: Service payment status (`servicePayment`) and the latest entry (opt.; "Unavailable"); External
   acts (table: act, state, authorized at); Readiness (state, by, at); Gate exceptions of the application (Gate, For,
   State, Expires [time] IST), with the line "A Gate 1 exception does not pass Gate 2."; Payment-missing follow-ups
   open (opt.).
4. `h2` Effect:
   - "This decision allows: the assigned operator to request authorization of the first government commitment while
     the service payment is not recorded as received. That authorization uses it."
   - "It does not: record a payment; authorize the act (the operator requests it and every check runs again); pass
     the exposure ceiling; assert readiness, the travel agent's authority or any document; allow a second commitment
     after a filing; pass anything at Gate 1."
   - "It ends: when it is used; when you or another SuperAdmin revokes it; when it expires (the receipt shows the
     time); when the payment record, the assignment or any external act of this application changes before it is
     used; when you are no longer an active SuperAdmin. Record it after the operator is assigned: an assignment made
     later makes it lapse."
   - "When it is used while the payment is not recorded, a payment-missing follow-up opens, owned by you, until a
     'payment received' entry is recorded." (`acts.ts:156-161`)
5. `h2` Hard stops: "The exposure ceiling, mandatory validations, fixed cut-offs and the protection of a possible
   filing. No exception exists for these controls."
6. `h2` Your decision: "Reason for the exception" (`reason`, 3 rows, maxlength 1000, hint "At least 10 characters.
   Recorded with the decision and shown in the audit history."); hidden `gate`, `action`, `_rev.application`.
   Evidence rows join in the P-11 integration window (S-07), as for the Gate 1 kinds.
7. Review (visible): "When you record it: the first government commitment of [applicant] may be authorized once
   while the service payment stays not recorded; your name, the reason and the time are recorded; the assigned
   operator is notified."
8. Buttons "Record Gate 2 exception" (primary); "Cancel" → SA-07a of the application.

| State (first match) | Condition (Core facts of `core.admin_case`) | Copy and controls |
|---|---|---|
| Closed | `lifecycle` ∉ {`draft`, `submitted`} | "Gate exceptions apply only to open applications." No form |
| Not TravelMudra-filed | `offering.serviceMode ≠ travelmudra_filed` | "Gate 2 applies only to work TravelMudra files. This service is [kind]: no Gate 2 decision exists for it." No form |
| Protection mark | `mark ≠ null` | CMP-10 as WP-06 §2.7.2. No form |
| Not needed | `servicePayment = payment_received` | "Gate 2 does not block: the service payment is recorded as received." No form |
| Commitment made | an act with `act_state ≠ not_filed_evidenced` | "A government commitment of this attempt may already have happened ([act], [state words], [time] IST). Gate 2 was decided then; no Gate 2 decision exists now." No form (Core: `gate_exception_not_eligible`, `gates.ts:44-47`) |
| Already open | a `gate2_government_commitment`/`first_government_commitment`/`granted` row | "A Gate 2 exception is open until [expires_at] IST. TravelMudra uses it only while it is fresh." Links "Revoke" (SA-09r). No form |
| C3 `granted` | — | Receipt (neutral interim, §2.11); then "Already open" |
| C2 | — | `gate_not_blocking` → "The service payment was recorded meanwhile: Gate 2 does not block. No exception was recorded."; `gate_exception_not_eligible` (control) → the "Commitment made" sentence; `conflict_duplicate` → "A Gate 2 exception is already open. No second one was recorded."; reason kept |
| C5 | `stale_revision` | §2.12 |

#### 2.9.2 Kinds `readiness_submission`, `readiness_fee_payment`, `readiness_provider_handoff`, `readiness_packet_release`

One renderer with the act as parameter (`authorize_government_submission`, `authorize_government_fee_payment`,
`authorize_provider_handoff`, `release_packet`). Breadcrumb "Work queues › Assignment › [applicant]".

- `h1` "Readiness exception for the [act]: [applicant]". Scope: "Gate: readiness. Action: the [act] once, on the
  readiness judgement that the previous operator recorded."
- Evidence: readiness (recorded by [name] at [time] IST; "Recorded by the previous operator"); operator now; holds;
  acts.
- Effect: allows "the assigned operator to request the [act] once on the previous operator's readiness judgement";
  does not "record a new readiness judgement, assert any document, authority or payment, or pass Gate 2 or the
  exposure ceiling"; ends "when used, revoked, expired, or when the readiness judgement or the assignment changes".
- Hidden `gate` = `readiness_gate`, `action` = the act. Button "Record readiness exception".

| State | Condition | Copy |
|---|---|---|
| Closed; protection mark | as §2.9.1 | as §2.9.1 |
| Not an act of this service | mode does not have the act (submission and fee: TravelMudra-filed; handoff: third-party; packet release: preparation-only) | "This service has no [act]." No form |
| Not needed | `readiness.validity = valid` | "The readiness judgement is the current operator's: no exception is needed." No form |
| Not eligible | validity ∈ {`missing`, `stale_basis`, `held`} | "A readiness exception exists only for a judgement recorded by a previous operator. Now: [validity sentence]. The assigned operator records readiness." No form |
| Already open; C2; C3; C5 | as §2.9.1 | as §2.9.1 (`gate_not_blocking` → "Readiness is current now. No exception was recorded.") |

Registry test (WP-06 §2.7.5): with these kinds the registry's (gate, action) pairs equal Core's `SCOPE` table
(`gates.ts:26-30`) exactly; the test becomes strict.

#### 2.9.3 Revocation

Unchanged WP-06 kind `revoke_exception` (D-08: the effect text follows the recorded gate). WP-07 adds the Gate 2 and
readiness rows to the D-08 table only if WP-06 left them out.

### 2.10 SA-07 Money & exposure pages of WP-07

#### 2.10.1 SA-07h Finance `/admin/finance`

1. Header: `h1` "Finance"; lead "Travel agents' exposure ceilings, ceiling increases that wait for a second
   SuperAdmin, and payment-missing follow-up."; freshness.
2. Section "Ceiling increases waiting for a second SuperAdmin" (`id="requests"`): rows (travel agent link to SA-07t;
   requested ceiling with "from [old]"; requested by [name] at [time] IST; reason). Action per row: "Decide" →
   SA-09c `approve_increase`; when the requester is the viewer: the line "You requested this; a different SuperAdmin
   decides." and the link "Withdraw your request" → SA-09c `decline_increase` (presentation of the record, Core
   decides). Count "[n] requests". S2: "No ceiling increase waits for a decision."
3. Section "Travel agents' exposure" (`id="tas"`): rows (travel agent link; Ceiling [₹] with "Default" or "Set";
   Counted exposure [₹]; Unused reservations [₹]; Paid by TravelMudra, not recovered [₹]). No status badge and no
   colour per row (F-W07-06). Cap line at 200: "This list shows at most 200 travel agents."
4. Section "Payment-missing follow-up": "[open] items open; [mine] for which you are accountable." Link to the
   existing list (WP-16).
5. Section "Gate 2 decisions": "A Gate 2 exception is decided on the application. Operators ask through a flag
   (Flags from operators); the application's payment page links the decision." Links to SA-02c and SA-07a search
   (no list exists: STOP-W07-05).
6. Section "How exposure decreases": the existing boundary (parked Accounts actions).

| State | Copy |
|---|---|
| S2 no travel agent | "No travel agent has an application or a ceiling yet." |
| S4 | Required read; S7 on failure |

#### 2.10.2 SA-07t Exposure ceiling of one travel agent `/admin/finance/tas/:taAccountId`

1. Header: breadcrumb "Money & exposure › Finance"; `h1` "Exposure ceiling: [travel agent]"; lead "What TravelMudra
   may commit in government fees for this travel agent across all groups and applications."; freshness.
2. Receipt (`lowered`, `requested`; approve and decline receipts are on SA-09c).
3. Status facts: Ceiling ([₹], "Default ₹0" or "Set by a SuperAdmin on [time] IST"); Counted exposure [₹]; of
   which Unused reservations (still counted) [₹] and Paid by TravelMudra, not recovered [₹]; "Ceiling minus counted
   exposure: [₹]" (arithmetic of two values of the same read) or "Counted exposure is [₹] above the ceiling" (Q-W07-11);
   the rule line "A new government fee is refused when counted exposure plus the fee would exceed the ceiling."
4. B28 parked notices, each specific (never one blanket notice):
   - Default ceiling (case "ordinary paid case at ₹0"), when `ceiling_source = default`: "Committing a government fee
     for a paid application of this travel agent is unavailable while the ceiling is the default ₹0: that reservation
     rule is not decided. Owner: product owner. Setting a ceiling (two SuperAdmins for an increase) makes fee
     commitments possible within it."
   - Reservations (case "unused reservation release"): under the reservations table: "Releasing an unused reservation
     is unavailable: that rule is not decided, so reservations stay counted. Owner: product owner."
   - Fee records (case "which payment record excludes a fee"): under the fee table: "Excluding a fee from counted
     exposure is unavailable: that rule is not decided. Owner: product owner."
5. Open increase request panel (when a change is `increase_requested`): requested ceiling, from, requested by, at,
   reason; links "Decide" (SA-09c approve) and "Decline" or "Withdraw your request" (SA-09c decline).
6. Actions: "Lower the ceiling" → SA-07l (when `ceiling_source = set`; otherwise the line "The default ceiling is ₹0:
   it cannot be lowered."); "Request an increase" → SA-07i (when no request is open; otherwise "An increase request
   already waits; it is decided first.").
7. Tables: Reservations (as today), Government fee records across all groups (as today), Ceiling history (as today,
   with "Withdrawn by the requester" when `declined_by = requested_by`).
8. "How exposure decreases" boundary (Accounts actions parked).

Removed: the "Within the ceiling" success badge and the "Over the ceiling" badge (`payments/admin.ts:371-374`); the
approve and decline forms (moved to SA-09c); the lower and increase forms (moved to SA-07l, SA-07i).

#### 2.10.3 SA-07l Lower the ceiling and SA-07i Request an increase

CMP-25 frame.

| Part | SA-07l Lower | SA-07i Request an increase |
|---|---|---|
| `h1` | "Lower the exposure ceiling: [travel agent]" | "Request a higher exposure ceiling: [travel agent]" |
| Scope | "This travel agent's ceiling, across all groups and applications." | same |
| Evidence | Ceiling now (source), counted exposure and its parts, open increase request (if any) | same |
| Effect | "It takes effect at once. New government fee commitments above the new ceiling are refused. Nothing counted is erased: reservations and paid amounts stay counted, and in this release counted exposure does not decrease. An open increase request can no longer be approved: its basis changes." | "Nothing changes until a different SuperAdmin approves it. When approved, the ceiling becomes the amount you request at once. A lowering meanwhile makes this request unapprovable." |
| Fields | "New, lower ceiling" `newCeiling` (₹, `inputmode decimal`); "Reason for lowering" `reason` (hint "At least ten characters. Kept with the record."); hidden `basis` (= `current_ceiling_change_id` or `default`) | "Requested ceiling" `newCeiling`; "Reason for the increase" `reason`; hidden `basis` |
| Review | "When you lower it: the new ceiling applies to the next fee commitment of this travel agent. Your name, the reason and the time are recorded." | "When you request it: a different SuperAdmin decides. Your name, the reason and the time are recorded." |
| Button | "Lower the ceiling" | "Request the increase" |
| Unavailable | Default ceiling: "The ceiling is the default ₹0. It cannot be lowered." No form | Request open: "An increase to [₹] waits since [time] IST, requested by [name]." Links to SA-09c. No form |
| C3 | 303 to SA-07t `lowered` | 303 to SA-07t `requested` |
| C2 | `ceiling_not_lower` on the field; reason length on the field | `ceiling_not_higher` on the field; `ceiling_increase_already_requested` → "Another SuperAdmin requested an increase first: [re-read]." |
| C5 | basis changed → CMP-14 (§2.12) | same |

#### 2.10.4 SA-09c Ceiling increase decision `/admin/finance/ceiling-changes/:changeId/decide/:kind`

Reads `pay.ceiling_change` (travel agent of the change), then `pay.ta_finance`; the change is the `changes` row with
this id (absent → 404).

`approve_increase`:

1. `h1` "Approve a higher exposure ceiling: [travel agent]".
2. Scope: "This travel agent's ceiling: from [old ₹] to [new ₹]. Requested by [name] at [time] IST."
3. Evidence: the request's reason; counted exposure and its parts; ceiling history (last five rows; link to all);
   reservations count.
4. Effect: "The new ceiling applies at once. TravelMudra may then commit government fees for this travel agent up to
   it. It records no payment and decreases no exposure."
5. Hard stops: "A ceiling increase needs two different SuperAdmins. It is refused while the audit record is not
   healthy (lowering stays available)."
6. Your decision: "Reason for approving (optional)" `reason`; hidden `_rev.change`.
7. Review: "When you approve: the ceiling becomes [new ₹] now; the requester's name and yours, both reasons and the
   time are recorded."
8. Buttons "Approve the increase to [new ₹]" (primary); "Cancel" → SA-07t.

`decline_increase`: `h1` "Decline the ceiling increase: [travel agent]" or, for the requester, "Withdraw your
increase request: [travel agent]"; effect "The ceiling stays [old ₹]. A new request can follow."; field "Reason for
declining" / "Reason for withdrawing" (`reason`, required); button "Decline the increase" / "Withdraw the request".

| State (first match) | Condition | Copy |
|---|---|---|
| Decided | `state` ≠ `increase_requested` | "This request was [approved by [name] at [time] IST / declined by [name] / withdrawn by the requester]." Link SA-07t. No form |
| Approve: own request | `requested_by` = viewer | CMP-10: "Approving is unavailable for you: you requested this increase. A different SuperAdmin approves it." Link "Withdraw your request" (decline kind). No approve form |
| Approve: audit not healthy | `auditHealthy = false` | CMP-10: "Approving an increase is unavailable until the audit record is healthy again. Lowering a ceiling stays available. Owner: TravelMudra." No form |
| Approve: requester not active | `names[requested_by].active = false` | "The SuperAdmin who requested it is no longer active, so it cannot be approved. Decline it and request again." Link to decline. No form |
| Approve: ceiling changed | `old_paise ≠ exposure.ceiling_paise` | "The ceiling changed after this request was made (requested from [old ₹]; now [current ₹]). Decline it and request again." Link to decline. No form |
| C3 `approved` / `declined` | — | Receipt (§2.11); then "Decided" |
| C2 | — | `self_approval_forbidden`, `requester_inactive`, `ceiling_changed_since_request` → the sentences above with the re-read state; `conflict_duplicate`/`ceiling_request_not_open` → "Another SuperAdmin decided this request first: [re-read]."; `unavailable_dependency`/`audit_degraded` → re-render (D-W07-12) "The audit record is not healthy, so increases cannot be approved now. Nothing was approved." |
| C5 | `stale_revision` on `change` | §2.12 |

### 2.11 Receipt facts per command (CMP-08), with the command-identity interim

"Establishes by" names how the page knows which command produced the record before P-10 (b). When it cannot, the
receipt is neutral: title "Request recorded", the reference, and the current facts labelled "Current" (WP-06 D-02).
No receipt shows an accepted time before P-10 (b).

| Done code | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `work_started` | OP-02 Work | `application`, path id | `stepId` string | the `steps` row with that id has `stepCode = _work_started` | Work started | Started at [time] IST | Gate 1 row; next action |
| `step` | OP-02 Work | as above | `stepId` | row with a declared (not reserved) code | Step recorded | Step, state, note | — |
| `readiness` | OP-02 Work | as above | `readinessId` | equals `caseWork.readiness.readinessId` | Readiness recorded | Recorded by, at, note | Readiness state |
| `readiness_withdrawn` | OP-02 Work | as above | `readinessId` | cannot be told from a later superseding record | neutral | — | Readiness state |
| `effort` | OP-02 Work | as above | `sampleId` | unique summary key | Effort recorded | — | — |
| `returned` | OP-03r | as above | `holdId` starts `ret_` | only a formal return creates `ret_` holds | Returned to the travel agent / Returned for the travel agent's review | The note (hold row by id), at | Editing; readiness |
| `flagged` | OP-03f | as above | `holdId` starts `flg_` | a hold resolution also returns a `flg_` id | neutral | — | Flag state (hold by id) |
| `authorized` | OP-04b | as above | `authorizationId` = path, `actKind` string, `carriesFee` boolean | unique summary keys | Authorization recorded | Act; authorized by and at; government fee reserved [₹] when `carriesFee`; reconciliation owner; the line "Authorization is permission, not evidence. Perform the [act] by hand, then record what happened." | Act state |
| `evidence` | OP-04b | as above | `authorizationId` = path, `evidenceId`, `result` | unique keys; record by `evidenceId` | Filing evidence recorded / Non-filing evidence recorded / Execution recorded as uncertain (by `result`) | The evidence record | Act state; banner |
| `reconciliation` | OP-04b | as above | `attemptId`, `authorizationId` = path, `concludedEvidenceId` | unique keys | Reconciliation attempt recorded (+ "Filing concluded: filed / not filed" when concluded) | Attempt; concluded evidence | Act state |
| `lowered` | SA-07t | `ta_finance` (no id) | `changeId`, `ceilingPaise` | the `changes` row of this page's travel agent with that id has `kind = lower` | Ceiling lowered | Old → new, by, at, reason | Ceiling; counted |
| `requested` | SA-07t | as above | `changeId`, `state = increase_requested` | row `kind = increase` | Increase requested | Requested amount, from, by, reason | "Waiting for a different SuperAdmin" |
| `approved` | SA-09c approve | as above | `changeId` = path, `ceilingPaise` | row `approved_by ≠ null` | Ceiling increase approved | Requested by, approved by, old → new, in effect from | Ceiling now |
| `declined` | SA-09c decline | as above | `changeId` = path, `state = increase_declined` | row `declined_by ≠ null` | Increase declined / Increase request withdrawn | Declined by, reason | Ceiling (unchanged) |
| `granted` | SA-09 Gate 2, readiness | `application`, path id | `gateExceptionId` | a revocation returns the same shape | neutral | — | The exception row: gate, for, state, expires |

Selecting the record from this page's own read also binds a `ta_finance` receipt to this travel agent: `meets`
compares only `id`, which a `ta_finance` resource does not carry, so the summary test MUST look the change up in the
page's `changes` and fail when it is absent.

### 2.12 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| Readiness | `_rev.*`, `readiness_basis_changed` | Basis: "the one this page showed" / "changed"; current blockers listed; note kept |
| Authorize | `_rev.*`, `readiness_basis_changed`, `authorization_basis_changed` | Readiness judgement (the one you saw / current); "The evidence this authorization rests on changed since you opened the page."; fee kept; checkbox unchecked |
| Act evidence, uncertain, reconciliation | `fromState` | Act state (the one you saw / current) |
| Return | `_rev.application` | Editing state; open holds (current); note kept |
| Grant (Gate 2, readiness) | `_rev.application` | Service payment (current); acts (current); readiness (current); reason kept |
| Lower, request | `basis` | Ceiling (you saw [₹], source / current [₹], source); values kept |
| Approve, decline | `_rev.change` | Request state (you saw "waiting" / current) |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

### 2.13 Refusal sentences (closed table, staff audience)

Existing `CORE_MESSAGES` and `PAY_MESSAGES` stay unless listed. Category plus code selects the sentence.

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| start work | `conflict_duplicate`/`work_already_started` | "Work has already started on this assignment." + re-read | form-level |
| start work | `control_blocked`/`gate1_*` | "Gate 1 blocks the first work: the service payment is not recorded as received and no fresh Gate 1 exception for the first work exists. Owner: SuperAdmin." + "Flag to SuperAdmin" | form-level |
| readiness | `control_blocked`/`operator_work_not_started` | "Start work first." | form-level |
| authorize | `control_blocked`/`act_already_open` | the "Already authorized or uncertain" text of §2.7.2 | form-level |
| authorize | `control_blocked`/`gate2_payment_not_received` | the "Gate 2 blocks" text of §2.7.2 | form-level |
| authorize | `unavailable_parked`/`exposure_parked_paid_case_default_ceiling` | §2.7.3 | form-level |
| authorize | `control_blocked`/`exposure_ceiling_breach` | §2.7.3 | form-level |
| authorize | `control_blocked`/`fee_payment_unknown`, `fee_already_paid_for_effect` | `PAY_MESSAGES` sentences | form-level |
| authorize | `control_blocked`/`declaration_item_unresolved` | "A term of this service that the act depends on is not decided. Owner: TravelMudra." | form-level |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden` | shell SH-02 (LD-14) | — |

## 3. Interim and switch for the pending Core facts

### 3.1 Command identity in receipts (P-10 b, approved in the Core batch)

Interim: §2.11 (establish from the selected record; else neutral). Switch (seam item S-08): when `core.operation`
returns `commandName` (and `acceptedAt`), each WP-07 `ReceiptExpectation` gains the command name (a data field in the
expectations table of each page), the neutral rows (`readiness_withdrawn`, `flagged`, `granted`) get their titles
("Readiness withdrawn", "Flag sent to the SuperAdmins", "Gate 2 exception recorded" / "Readiness exception recorded"),
and every receipt adds "Accepted at [time] IST". The record checks stay as a second test of the facts. The switch is
one change in the shared expectation helper (WP-01 file, the package open at S-08) plus the table rows; no page
structure changes.

### 3.2 Gate basis per action (P-10 e, approved; STOP-W07-01 asks to extend it)

P-10 (e) serves Gate 1 for first work and reassignment. WP-07 needs the same answer for Gate 2 and the readiness gate
on each offered act. Core computes it already (`Evaluation.gateBasis`, `controls.ts:240-254`); the wire strips it
(`zWireEvaluation` carries `allowed` and `blockers` only).

| Row | Interim (now) | After the switch |
|---|---|---|
| Gate 1 (first work) | "Met when work started on this assignment" / "No blocker now" / "Not met" + exception records listed | "Met: service payment recorded as received" or "Action allowed by exception (Gate 1, first operator work)" |
| Gate 2 | "No blocker now" + "Exception on record: …, open until …" / "Not met" | "Met: …" / "Action allowed by exception (Gate 2, first government commitment, until [time] IST)" / "Not applicable for this service" |
| Readiness gate | validity words (already exact) | "Action allowed by exception (readiness, [act])" when the basis is an exception |

The interim never states a basis it cannot read and never says "Payment received". UX §5.3's "Action allowed by
exception" with exact scope is partly met until the switch (V08 acceptance item marked so).

### 3.3 First-work Gate 1 route on approved help (P-12 C)

Interim: OP-03f and the Gate 1 row show the known-gap line (§2.6.2). Switch: when the SuperAdmin queue kind
`first_work_gate1` is served, the line becomes "A SuperAdmin sees this application in the queue 'First work waiting
for Gate 1'." (no operator command).

### 3.4 Evidence on gate exceptions (P-11, seam S-07)

The Gate 2 and readiness kinds use the same evidence fieldset as the WP-06 Gate 1 kinds, in the same integration
window as P-11's Core commit. Until then they record the reason only and the acceptance items for evidence stay
"Unmet: waits for P-11".

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 42cb373 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Authorize (K-EXT) | Same `_op`, same content (double click, browser resend) | Core returns the original result; the same 303 to OP-04b; one authorization, one reservation; no act repeated | None | Yes (copy and location new) |
| Authorize | Same `_op`, different content (fee changed) | `conflict_operation_key`; nothing changes | None | Yes |
| Authorize | New `_op` after acceptance (second tab, reload) | OP-04a shows "Already authorized" with no form; a hand-made post is refused `act_already_open` (business duplicate guard, B35) | None | Partly (the case page hides the form; copy invites a resubmission) |
| Authorize | Lost acknowledgement | Pending mode: "Authorization result unknown. Do not perform the external act."; no form until Core answers `not_recorded` | None; the operator does not act blind | No (generic page; F-W07-01) |
| Act evidence | Same `_op` | Replay; same receipt | None | Yes |
| Act evidence | New `_op`, same move after the first moved the act | `stale_revision` on `fromState` → CMP-14 with the current state | None | Partly (generic text) |
| Reconciliation | New `_op`, same finding | A second attempt is a new fact (deliberate); same `_op` replays | None | Yes |
| Start work | New `_op` after start | `work_already_started` sentence | None | Partly |
| Readiness | New `_op` in a second tab | A second judgement supersedes the first (Core records both; harmless) | Two records, one current | Yes |
| Return / flag | New `_op` after acceptance | Core refuses `hold_not_applicable` / duplicate; the page shows the open hold | None | Partly |
| Lower / request | New `_op` after acceptance | Basis changed → CMP-14; request open → "already requested" | None | Partly |
| Approve | Same `_op` | Replay; same receipt; one effective change | None | Yes |
| Approve | New `_op` after approval | `ceiling_request_not_open` → "Decided" state | None | Partly (TA page) |
| Grant Gate 2 | New `_op` | `conflict_duplicate` → "already open" | None | No (misleading "cannot be excepted") |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same page at the POST address, CMP-07 focused, `restorePath` = the GET page | Every typed value except `confirmIrreversible` (unchecked) and hidden digests (re-read) | Nothing typed |
| Core unreachable before a command | SH-02 neutral unavailable page | — | The form; the operator opens the page again |
| Answer lost (authorize) | OP-04a pending mode | The operation key in the address | No new authorization is offered until resolved |
| Answer lost (other) | WP-01 operation page | — | — |
| Optional read failed | "Unavailable" for its facts | Everything else | — |
| Authorize refused for exposure or parked case | OP-04a with the specific notice | Fee typed | Nothing authorized, nothing reserved (one commit) |

### 4.3 Stale and concurrent work

| Situation | Required behaviour | Today |
|---|---|---|
| Documents change between OP-04a load and submit (stale basis digest) | `authorization_basis_changed` → CMP-14; new digests from the re-read; no authorization | Partly (generic text) |
| The operator records readiness again in another tab before authorizing | `readiness_basis_changed` (the hidden `readinessId` differs) → CMP-14 | Partly |
| Reassignment between OP-04a load and submit | The command is refused for access (`not_found_or_forbidden`); the shell shows "Your access changed"; nothing authorized | Yes (LD-14 class) |
| Reassignment after authorization, before evidence | The new operator owns reconciliation (`assignment.ts:263`); OP-04b shows them as owner with the forms; the old operator's next read is SH-02 | Yes (copy new) |
| Gate 2 exception granted between OP-04a load (blocked) and reload | The reload shows the form; Core checks again at submit | Yes |
| Gate 2 exception revoked or expired, or payment corrected, between OP-04a load (allowed) and submit | `gate2_payment_not_received` (+ freshness code) → CMP-10 "Gate 2 blocks"; nothing authorized | Partly |
| Payment recorded as received after a Gate 2 exception was granted | Gate 2 passes by payment; the exception lapses (stale basis); the interim row shows both facts | Partly |
| Ceiling changed by another SuperAdmin between SA-07l/SA-07i load and submit | `stale_revision` on `basis` → CMP-14 with the current ceiling; typed values kept | Partly |
| Two SuperAdmins on an increase | Requester cannot approve (state); a second approver after the first gets "Another SuperAdmin decided this request first" | Partly |
| Ceiling lowered while an increase waits | Approve state "ceiling changed"; Core refuses `ceiling_changed_since_request` | Yes (TA page) |
| Ceiling lowered between OP-04a load and submit | `exposure_ceiling_breach` at submit; nothing reserved | Yes |
| Another operator opens the application under a read grant | Read only, no form; Core refuses a hand-made post (`requireAssigned`, `case-work/commands/common.ts:47-49`; `OPERATOR_ASG`) | Yes |

### 4.4 Access and accounts changing mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| Operator suspended | Next request: session ended → sign-in; typed input lost; nothing written | Yes (accepted residue) |
| Read grant revoked or expired while OP-02 is open | Next read: SH-02; the read-only section loses the rows | Yes (LD-14) |
| Back after authorize | The page reloads (WP-01 A-02); no POST is sent again silently | Yes |
| A receipt address opened by another operator | `core.operation` answers "no record yet": unchecked receipt | Yes |
| SuperAdmin requester suspended before approval | "requester not active" state; Core refuses `requester_inactive` | Partly |

### 4.5 Counts, caps and long lists

| Situation | Required behaviour | Today |
|---|---|---|
| 200 assigned applications | Views split by the rule of §2.1; counts per view with units; 50 rows a page; nav count = Action now count; one `core.ops_work` read per request (shared with the nav count, RM §1 item 5) | No (no views; one long list) |
| 500 or more | The first 500 with the cap line; counts say "in the first 500" | No |
| `ops.incidents` unavailable | Continuing duties "Unavailable"; never zero | No (required read) |
| 50 reconciliation attempts on one act | The table lists all in order; the page scrolls, no nested region | Partly |
| Long names (applicant 400, service 300, group 200, reasons 2000) | Wrap anywhere; `h1` wraps; tables stack to cards | Partly |

### 4.6 Device and environment

JavaScript off: every page works (GET tabs and views, plain forms, evidence rows 1–4 inside a native
`<details>`). 320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: tabs, views and forms
in reading order; the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-07

- One `h1` per page; frame parts and decision parts are `h2`; checklist groups `h3` (AC-03).
- Tabs and views are `nav` lists of links with `aria-current="page"`; no ARIA tab widget without the keyboard
  model (AC-01).
- Checklist rows, status facts and the money panel are definition lists or lists with text states (AC-06).
- The confirmation checkbox is a real `input` with a visible label; never prechecked (UX §7.4).
- Every unavailable control has `aria-disabled="true"` and `aria-describedby` to its CMP-10 (AC-13).
- The protected-state banner is plain text in the page flow (not a live region); command results announce politely
  through the WP-01 receipt (AC-09).
- The masked passport cue has an accessible label; the full number is in the task pages only.

## 6. Proof scenarios V08, V09, V10 on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge 4650, staff 4652; config `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source
  = this lane's clone). At the WP-07 proof it holds the integrated WP-02, WP-03 and WP-06 pages (package order).
- Synthetic seed (fact, `catalogue/synthetic/catalogue.json`): "SYN e-visa, fee paid with submission" (TravelMudra
  files, ₹3,600, the government submission carries the fee, Gate 2 applicable); "SYN Tourist e-visa" (TravelMudra
  files, ₹3,500, a separate government fee payment act). Accounts syn-ta-1 to -3, syn-operator-1 to -3,
  syn-superadmin-1 to -3 (CLAUDE.md), active, staff with a second factor (inference from WP-06 §6.1).
- Each run uses the tag `wp07-[yyyymmddhhmm]` and a **fresh synthetic travel agent** `wp07-ta-[stamp]` created and
  activated on SA-06 (WP-02 pages): its ceiling is the default ₹0, which V09 needs, and the increase stays local to
  the run. Inference to check first: the LD-11 harness can sign in a newly created synthetic travel agent (WP-02 V01
  did the same for its accounts) and the two offerings are launched for every active travel agent. Fallback: use
  syn-ta-3 when SA-07t shows "Default ₹0" for it; otherwise run V09-3 as a test.
- Sign-in through the LD-11 harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px. Synthetic
  writes are approved (brief); seeded data is not changed.

### 6.2 Setup (synthetic writes, labelled as setup)

Through the rebuilt pages, driven by the harness: SuperAdmin syn-superadmin-1 (SA1) creates and activates travel agent
X; X creates group `wp07-[stamp]` in Synthetica (travel +30/+40 days) and submits three applications: P and U on "SYN
e-visa, fee paid with submission", W on the same offering (synthetic passports as WP-03 §8.1). SA1 records P and W as
"Payment received" (SA-07a, evidence reference `SYN-V-[stamp]`); assigns P to syn-operator-1 (OP1), W to
syn-operator-2 (OP2) (SA-03a). For U: SA1 records the Gate 1 exception for assignment, assigns OP1, records the Gate 1
exception for the first work (SA-09g, WP-06). OP1 and OP2 start work and confirm readiness on OP-02.

### 6.3 Steps and observable results

Order: V09-1 to V09-13, then V10-1 to V10-9, then V09-14 to V09-18, then V08. "L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V09-1 | SA1, SA-07t for X | Read | "Default ₹0" ceiling; counted ₹0; the three B28 notices, each specific; no "Lower" link; no status badge | L |
| V09-2 | OP1, OP-02 of P | Read Work | Checklist: Readiness "Met"; Gate 1 "Met when work started"; Gate 2 "No blocker now"; Exposure "Checked when you request authorization… No exception exists"; no "Ready" anywhere | L |
| V09-3 | OP1, OP-04a `act=government_submission` for P | Fee ₹1,500, confirm, request | Refused as the parked case: the specific notice of §2.7.3 (paid at ₹0, owner product owner, two-SuperAdmin route); OP-02 acts table: none; SA-07t: counted ₹0 | L |
| V09-4 | SA1, SA-07i for X | Request ₹10,000 with a reason | Receipt "Increase requested" on SA-07t; panel "waits for a different SuperAdmin" | L |
| V09-5 | SA1, SA-09c `approve_increase` | Open | CMP-10 "Approving is unavailable for you: you requested this increase…"; no approve form; link "Withdraw your request" | L |
| V09-6 | syn-superadmin-2 (SA2), SA-09c approve | Scope, evidence, effect, hard stops visible; approve | Receipt "Ceiling increase approved": requested by SA1, approved by SA2, ₹0 → ₹10,000, in effect from [time] IST; SA-07t ceiling ₹10,000 "Set" | L |
| V09-7 | Harness | Resend the approve POST (same `_op`) | Same 303 and receipt; ceiling history shows one effective increase | L |
| V09-8 | OP1, OP-04a for P | Fee ₹1,500, confirm, request | Receipt on OP-04b "Authorization recorded", "government fee ₹1,500 reserved", "permission, not evidence"; SA-07t counted ₹1,500, reservation row "Unused, still counted ₹1,500" | L |
| V09-9 | OP1, OP-04a for U (after readiness) | Read | Gate 2 blocks: CMP-10 with "Owner: SuperAdmin", "A Gate 1 exception does not pass Gate 2", route "Flag to SuperAdmin"; no form | L |
| V09-10 | OP1, OP-03f for U | Flag "Gate 2 decision needed for the government submission" | Receipt (neutral); effect text named readiness reconfirmation; SA-01 and SA-02c list the flag | L |
| V09-11 | SA2, SA-09 `gate2_commitment` for U | Read and record | Scope, evidence (payment "Not recorded", acts none, Gate 1 exceptions "used"), effect (allows / does not / ends / follow-up), hard stops (exposure ceiling) before the reason; receipt (neutral) with Current "Gate 2 · first government commitment · Open until [time]". Setup: SA2 responds to the flag (carried WP-09 form); OP1 resolves it (carried) and confirms readiness again | L |
| V09-12 | OP1, OP-04a for U | Fee ₹9,000, request | Refused `exposure_ceiling_breach` (₹1,500 + ₹9,000 > ₹10,000): non-overridable stop, "Nothing was authorized or reserved", no exception route; SA-09 for U still "Already open" (not consumed) | L |
| V09-13 | OP1, OP-04a for U | Fee ₹1,500, request | Accepted; SA-07a for U: Service payment "Not recorded"; payment-missing follow-up opened, owned by SA2; SA-07t counted ₹3,000 | L |
| V10-1 | OP2, OP-04a for W | Read | Review sections in order: scope, governing facts (full passport number), authority, payment and fee controls, external action, reconciliation owner; label "Request authorization for the government submission"; no "File visa" | L |
| V10-2 | OP2 | Fee ₹1,000, confirm, request | Receipt "Authorization recorded"; OP-02 banner "Authorized, not executed…"; status fact "Government submission: Authorized, not executed"; action panel "Record external action evidence" | L |
| V10-3 | Harness | Resend the authorize POST (same `_op`) | Same 303 location and receipt; acts table one row; SA-07t counted ₹4,000 (one reservation) | L |
| V10-4 | OP2, OP-04a for W | Reload | "Already authorized … Do not perform it again" with link to the act record; no form | L |
| V10-5 | OP2, OP-04b `record=uncertain` | Statement "Portal session ended after payment; receipt not shown" | Receipt "Execution recorded as uncertain"; banner on OP-02 (every tab) and OP-04b: "Filing outcome is unknown. Do not repeat the external action. [OP2] (you) is reconciling the evidence."; OP-04a: no form, its blockers name the open act and the unknown fee payment (repeat and payment removed); OP-02 "Ending the case": "Ordinary withdrawal is unavailable: a filing may have happened" | L |
| V10-6 | SA1, SA-03c for W | Reassign to OP1 with a reason (WP-06 page) | OP2 reloads OP-04b: SH-02 "Your access changed"; OP1 opens OP-04b: owner "[OP1] (you)", forms offered | L |
| V10-7 | OP1, OP-04b `record=reconciliation` | "Checked the government portal", "No information", note | Receipt; banner stays; attempts table one row | L |
| V10-8 | OP1, OP-04b `record=reconciliation` | "Found it was filed", external reference `SYN-PORTAL-[stamp]`, fee paid ₹1,000 | Receipt "Reconciliation attempt recorded. Filing concluded: filed."; act "Filed (evidence recorded)"; progress "External wait"; the uncertain record stays in the evidence table | L |
| V10-9 | Test | Authorize with the acknowledgement dropped after commit (fault point) | OP-04a pending mode shows the fixed sentence and no form; "Check status" → receipt; one authorization row | T |
| V09-14 | SA1, SA-07l for X | Lower to ₹2,000 with a reason | Receipt "Ceiling lowered"; SA-07t "Counted exposure is ₹2,000 above the ceiling" (₹4,000 vs ₹2,000), nothing erased | L |
| V09-15 | OP1, OP-04b for P | Record "Not filed" with an external reference | Banner "Not filed…" and the B28 notice "The ₹1,500 reserved for this fee stays counted… releasing an unused reservation is not decided"; SA-07t reservation row still counted | L |
| V09-16 | SA1, SA-07a for P | Read | Fee row with the fee-exclusion boundary notice (B28 third case); no control | L |
| V09-17 | Test | Same-key authorize resend books one reservation (today `case-work.test.ts:432-455`, GET source moved to OP-04a) | One reservation; one authorization | T |
| V09-18 | axe | Every WP-07 page visited | No violation at 1440 px and 390 px | L |
| V08-1 | OP1, OP-02 of U (between V09-11 and V09-13) | Read Work | Gate 1 row "Met when work started" with "Exception on record: Gate 1, first operator work, used"; Gate 2 row "No blocker now" with "Exception on record: Gate 2 …, open until …"; the line "An exception allows one action. It records no payment and asserts no readiness, authority or evidence."; no "Payment received" (interim; "Action allowed by exception ([scope])" after STOP-W07-01) | L |
| V08-2 | OP1, OP-02 of U (V09-9 time) | Read | Gate 2 row "Not met … a SuperAdmin decision can resolve it" | L |
| V08-3 | OP1, OP-02 of P (V09-2) | Read | Ordinary readiness: "Met: recorded by you at [time]" | L |
| V08-4 | Test | Fixtures: a mandatory document not satisfied; a dependency with its evidence missing; a declared cut-off passed | Rows "Not met" with owner and route; cut-off "No exception exists for this control"; no overall status | T |
| V08-5 | OP-04a (V09-12) and SA-09 (V09-11) | — | Exposure breach shown as non-overridable; SA-09 hard stops name the ceiling | L |
| V08-6 | SA1, SA-07a for U after V09-13 | Read | Service payment "Not recorded" although Gate 2 passed by exception | L |

Proof split: V09 passes when V09-1 to -16 and -18 pass on `lane-ui` and V09-17 as a test. V10 passes when V10-1 to -8
pass on `lane-ui` and V10-9 as a test. V08 passes when V08-1 to -3, -5, -6 pass on `lane-ui` and V08-4 as a test,
with V08-1 recorded as "partly met until STOP-W07-01". V11 (current-authorized recorder after reassignment) is shown
in passing by V10-6 to -8; it stays WP-11's proof.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0 (after the WP-02, WP-03 and WP-06 component commits and WP-06 U4 are integrated). Phase B: U1 to U6 in
parallel. Phase C: U7. The architect registers gallery modules in `scripts/dev/gallery-pages.ts`, applies the
one-block `SURFACE_CONFIG.ops` change and the one-value `presentation.ts` change, and edits `DESIGN.md` once.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Components and the operator reading** | New `src/web/ui/readiness.ts` (CMP-15), `src/web/ui/money-panel.ts` (CMP-16), `src/web/ui/saved-views.ts` (CMP-20); `src/web/ui/bands.ts` (CMP-11 staff meta); `src/web/ui/index.ts` exports; WP-07 block in `static/css/components.css`. New `src/apps/staff/work/reading.ts` (closed tables: code → checklist group, blocker type, alert tier, owner label, action-panel mapping, act state words; pure functions: view membership, checklist rows, gate rows with the interim/switch adapter, status facts, money facts; `workItemNeedsAttention` and `workNeedingAttention` moved unchanged from `ops.ts`). New `src/apps/staff/work/frame.ts` (OP-02 frame) | New `test/unit/web/wp07-components.test.ts` (closed status set; no overall line; unknown code row; money panel without "due"; view counts with unit, "Unavailable", "None"; masked cue label). New `test/unit/web/operator-reading.test.ts` (view precedence; alert tiers; Action now count equals `workNeedingAttention`; owner labels; action panel rows including the Gate 2 flag route; never "Payment received"; `ready` sentence replaced; possibly-filed set from the kernel) | `scripts/dev/gallery/operator.ts` |
| **U1 OP-01, OP-01a** | New `src/apps/staff/work/queue-page.ts`, new `src/apps/staff/work/queue-routes.ts` (GET `ops.work` moved; new `ops.applications.list`; `ops.grants` → 303 moved from `identity.ts`) | New `test/unit/web/my-work.test.ts` (views and counts; 500 cap; 50 per page; read-only section line "Read-only access: [purpose], until [time]"; projection lag line; no form on read-only rows); BFF test: `ops.incidents` unavailable → "Unavailable"; an access refusal of an optional read → shell | `scripts/dev/gallery/my-work.ts` |
| **U2 OP-02 workspace** | New `src/apps/staff/work/workspace.ts` (Work, Application & documents, External actions overview, Delivery & originals; carried forms placement; §2.4.6), new `src/apps/staff/work/workspace-routes.ts` (GET `ops.applications.detail` moved; POST start work, work step, readiness, withdraw readiness, effort moved from `case-work.ts` with receipts and typed re-render; the exported case re-render for carried forms by tab) | New `test/unit/web/operator-workspace.test.ts` (banner on every tab; tabs keep `from`; full passport only in Application tab; readiness form hidden fields; no "Basis fingerprint"; withdrawal boundary under possible filing; read-grant reader without forms); BFF: refused readiness re-renders Work with the note; stale → CMP-14 | `scripts/dev/gallery/workspace.ts` |
| **U3 OP-03** | New `src/apps/staff/work/return-flag.ts` (pages, GET routes, POST `ops.applications.return` and `ops.applications.flag` moved from `ops.ts` with receipts and re-render) | New `test/unit/web/return-flag.test.ts` (labels by editor state; "Submit for TA" absent; problem-report select; states; neutral flag receipt) | `scripts/dev/gallery/return-flag.ts` |
| **U4 OP-04** | New `src/apps/staff/work/acts-pages.ts` (OP-04a, OP-04b), new `src/apps/staff/work/acts-routes.ts` (GET `ops.applications.acts`, `ops.applications.act`; POST authorize moved from `ops.ts`; act evidence and reconciliation moved from `case-work.ts`; UNR pending mode; evidence rows); `src/apps/shared/evidence-form.ts` (new `evidenceRowsOf(fields, 5)`) | New `test/unit/web/external-action.test.ts` (review section order; label never "File visa"; checkbox never prechecked; state table; banners with the fixed sentences; uncertain form hidden `result`; ≤5 rows); BFF tests: UNR → 303 pending; pending without form; refused authorize keeps fee and unchecks; parked and breach notices; replay same location | `scripts/dev/gallery/external-action.ts` |
| **U5 SA-09 Gate 2 and readiness** | `src/apps/staff/decisions/kinds.ts` (five entries), new `src/apps/staff/decisions/gates.ts` (renderers), `src/apps/staff/decisions/routes.ts` (kind enumeration; (gate, action) → kind map), `src/apps/staff/core/admin.ts` (case page: carried generic grant form removed; links) | `test/unit/web/decision-kinds.test.ts` extended (order; effect; hard stops; hidden pairs; states; registry pairs equal Core `SCOPE`) | `scripts/dev/gallery/decisions.ts` (extend) |
| **U6 SA-07 finance and ceiling** | `src/apps/staff/payments/admin.ts` (`financeIndexPage`, `taFinancePage` rebuilt; `applicationPaymentsPage` Gate 2 link only), new `src/apps/staff/payments/ceiling-pages.ts` (SA-07l, SA-07i, SA-09c), `src/apps/staff/payments/routes.ts` (new GETs; receipts; re-render targets; D-W07-12) | New `test/unit/web/ceiling-pages.test.ts` (no status badges; three specific B28 notices; requester state; audit state; receipts select the change of this travel agent); BFF: `audit_degraded` re-renders with status 503 | `scripts/dev/gallery/finance.ts` |
| **U7 Wiring and system tests** | `src/apps/staff/instance.ts` (new modules), `src/web/route-inventory.ts` (id for O45; new entries for the GET routes of §1.2), `src/apps/staff/attention.ts` (import path), `src/apps/staff/core/ops.ts` and `src/apps/staff/operations/case-work.ts` (remove moved code; carried routes re-render through U2's export), `src/apps/staff/views/cases.ts` (ops history in the OP-02 frame), `src/apps/staff/home/inbox.ts` (SA-01 group 7 link `/admin/finance#requests`; WP-06 file, one value) | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids), `test/unit/web/signed-in.test.ts` (ops rail; no transitional ops member), new `test/unit/web/carried-forms-wp07.test.ts` (§7.2), the system tests of §7.3 | — |

### 7.2 Carried-form test

`test/unit/web/carried-forms-wp07.test.ts` renders OP-02 fixtures per tab (assigned; approved help; preparation-only
with a built packet; outcome recorded; physical originals; possibly filed) and asserts each action path of §1.5. It
asserts that the old SuperAdmin case page holds no form with action `/admin/applications/<id>/gate-exceptions` and
that the operator case page holds no form with action `…/return`, `…/flag`, `…/acts`, `…/acts/<aut>/evidence` or
`…/reconciliation`. WP-06's carried-form test drops its Gate 2/readiness entry. Later packages remove their entries.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-work.test.ts:73-81` (`opsWork`) | `#assigned tr`, `#reviews`, `tr.is-attention` on `/ops/work` | `#work-list` rows of the view that holds the application; flagged = Action now |
| `test/system/case-work.test.ts:167-178` (`startAndReady`) | Start and readiness forms on the case page; `location === …?done=work_started` | Same forms on OP-02 Work; allow `&tab=work&op=` |
| `test/system/case-work.test.ts:180-186, 445-450` (`authorize`) | `fieldsOf(page, …/acts)` from the case page | GET OP-04a `?act=<kind>` |
| `test/system/case-work.test.ts:217` | Evidence form on the case page | GET OP-04b `?record=evidence` |
| `test/system/case-work.test.ts:353, 601` | `#incidents` and `#assigned` on `/ops/work` | Incidents: OP-01 Continuing duties or `/ops/incidents`; row: `#work-list` |
| `test/system/case-work.test.ts:434-439` | Ceiling forms on the travel agent page | GET SA-07i; approve from SA-09c |
| `test/system/payments-views.test.ts:195-263` | Forms and texts on SA-07t; `location === …?done=requested\|approved`; requester sees no approve form there | Forms from SA-07i, SA-07l, SA-09c; allow `&op=`; approved location is SA-09c; texts "Default ₹0", "You requested this increase", audit text kept; the 503 status on audit stays |
| `test/system/core-pages.test.ts:289-297, 360` | Return form on the case page; `location === …?done=returned` | GET OP-03r; location OP-03r `?done=returned&op=` |
| `test/system/document-decisions.test.ts:221-225` | No `…/acts` form on the case page before work | The same assertion on OP-04a (no form; the "Start work first" sentence) |
| `test/system/ported-pages.test.ts:131`, `test/system/three-instances.test.ts:154` | `/ops/grants` answers 200 | Follow the 303; assert the read-only section |
| `test/system/ported-pages.test.ts:142-168` | Operator Services links in the rail | Rail without Services; the two routes still answer 200 by address |
| `test/unit/web/signed-in.test.ts:65, 99` | Ops rail list; transitional member `/ops/grants` | New rail list; no ops transitional member |
| `test/unit/web/routes.test.ts` | Inventory counts | New rows; id for O45 |

Stay valid: landing `/ops/work` (`flows.test.ts:68, 106, 168-169`), the support-view paths
(`core-pages.test.ts:513`), Core-level tests (`test/core/acts.test.ts`, `test/operations/work-acts.test.ts`,
`test/ops-tooling/restore-reopen.test.ts`), `test/unit/nav-counts.test.ts` (rule unchanged).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `core.authorize_external_act` | OP-04, WP-07 | OP-04a `/ops/applications/:id/acts?act=`; WP-07 |
| `ops.record_act_evidence` | OP-04, WP-07 | OP-04b `record=evidence` and `record=uncertain`; WP-07 |
| `ops.record_reconciliation_attempt` | OP-04, WP-11 | OP-04b `record=reconciliation`; **WP-07** (Q-W07-02) |
| `core.formal_return` | OP-03, OP-02, WP-07 | OP-03r (both labels); WP-07; WP-09 keeps the assistance entry only |
| `core.flag` | OP-03, WP-09 | OP-03f; **WP-07** (Q-W07-03) |
| `ops.start_work`, `ops.record_work_step`, `ops.record_readiness`, `ops.withdraw_readiness`, `ops.record_effort_sample` | OP-02, WP-07 | OP-02 Work tab; WP-07 |
| `pay.lower_ceiling` | SA-07, WP-07 | SA-07l; WP-07 |
| `pay.request_ceiling_increase` | SA-07, WP-07 | SA-07i; WP-07 |
| `pay.approve_ceiling_increase`, `pay.decline_ceiling_increase` | SA-07, SA-09, WP-07 | SA-09c kinds `approve_increase`, `decline_increase`; WP-07 |
| `core.grant_gate_exception` | SA-09, WP-06 | add: Gate 2 kind `gate2_commitment` and readiness kinds (WP-07); the generic form is gone |

§5.1 counts: WP-07 14 (adds reconciliation and flag), WP-09 6, WP-11 3. Proposed §6 disposition CC-13: "The operator
case commands of WP-07 leave the long case page: return and flag to OP-03, authorization to OP-04a, act evidence and
reconciliation to OP-04b; the case page becomes the OP-02 workspace with tabs. The ceiling forms leave SA-07t for
SA-07l, SA-07i and SA-09c." CC-14: "Operator Services destination retired from the rail; the two routes stay until
Max decides."

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W07-01 | P1 | Authorize copy "A lost confirmation means: do not perform the act; open this page again and resubmit the same form." (`ops.ts:191`); UNR goes to the generic operation page without the required sentence | An operator's answer is lost; they reload and send a new request while the first one may be committed and may already have been acted on | Pending mode with "Authorization result unknown. Do not perform the external act." and no form until Core answers (§2.7.4) |
| F-W07-02 | P1 | Authorization is a `confirmDisclosure` inside the long case page; its "review" is a readiness id and a 16-character digest (`ops.ts:183-203`) | The operator authorizes an irreversible government act without seeing the governing facts, the gates or that the fee will be reserved | OP-04a review screen (§2.7) |
| F-W07-03 | P1 | "Filing uncertain" is one option of the evidence select (`case-work.ts:180-187`); no protected-state sentence anywhere | An operator unsure whether the portal accepted the submission picks a result at random | OP-04b `uncertain` mode and the fixed banner on every tab |
| F-W07-04 | P1 | The applicant-withdrawal form is offered while a filing may have happened, with "An accepted withdrawal stops filing" (`ops.ts:297-304`) | The operator records a withdrawal believing it stops a filing that may already have happened; Core records it as refused | Boundary first; relabelled request (§2.4.6) |
| F-W07-05 | P1 | The work list has no views or owner labels and marks every operator-owned row with the attention tone; read-grant applications are listed nowhere (`views.ops_work` unused; `/ops/grants` lists grants without links) | With 200 cases the operator cannot find the protected ones; a grantee cannot reach the applications the grant is for | OP-01 views and tiers; OP-01a read-only section |
| F-W07-06 | P1 | Ceiling pages compute "Within the ceiling" (success tone), "Over the ceiling" and "Headroom" (`payments/admin.ts:371-374, 446, 492-497`) | A green "Within" reads as "commitments will pass" while the paid-at-₹0 parked case still refuses them | Facts and labelled arithmetic; no status badge (Q-W07-11) |
| F-W07-07 | P1 | Approve and decline are forms on the travel agent page with no effect statement or hard stops | The second SuperAdmin approves without the consequence review UX §6.3 requires | SA-09c decision pages |
| F-W07-08 | P2 | An approval refused for `audit_degraded` shows the shell 503 page (`payments/routes.ts:107`) | The approver loses the page and its context | Re-render with the specific sentence (D-W07-12) |
| F-W07-09 | P2 | `pay.application_payments.gate2` evaluates the operator's authorize action with the SuperAdmin as actor; stage 1 refuses the relation and the view answers `unknown` (`payments/queries.ts:90-103`, `controls.ts:215-225`, `policy.ts:214`) — static reading, to be confirmed by a test | SA-07a always shows "Gate 2: Unavailable" for TravelMudra-filed work | Not worked in the lane: STOP-W07-06 note; SA-09 uses the case facts instead |
| F-W07-10 | P2 | One generic grant form for Gate 2 and the readiness gate on the old SuperAdmin case page | A SuperAdmin records a readiness exception believing it passes Gate 2 | Kinds with their effects (§2.9) |
| F-W07-11 | P2 | The act-evidence form has one evidence row and no note; Core accepts five | Evidence of a filing needs a portal reference and a receipt document | Rows 0–4 (D-W07-07) |
| F-W07-12 | P2 | The case page says "Read only" to a grantee without the purpose and end of the grant (SH-R10) | A grantee cannot tell why or until when they may read | Read-grant line (§2.0) |
| F-W07-13 | P2 | The pending code `ready` reads "Ready for the next external step." (`shared.ts:52`) on staff dockets | A universal "Ready" while Gate 2 or the ceiling still blocks | Replaced wording (§2.0) |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W07-01 | P2 | Operator "Services" rail item (WP-01 Q-12) | An operator reads current published values as the terms of a case submitted earlier | Retire the destination now; keep both routes without a link; Max decides route retirement at the end review |
| Q-W07-02 | P1 | Pull `ops.record_reconciliation_attempt` from WP-11 into WP-07 | V10 needs the uncertain path to end in evidence; without it OP-04b shows "reconcile" with no form until WP-11 | Yes; WP-11 keeps the unresolved completion and SA-04 |
| Q-W07-03 | P1 | Pull `core.flag` from WP-09 into WP-07 (OP-03f) | Gate 2 and first-work Gate 1 have no operator route but the flag; without OP-03f the route is a form in the old layout | Yes; `core.respond_flag` and `core.resolve_hold` stay WP-09 (carried) |
| Q-W07-04 | P1 | Build the four readiness-gate kinds in WP-07 and delete the carried generic grant form | After a reassignment OP-04a shows "or a SuperAdmin may grant a readiness exception"; without a kind page that route is the generic form | Yes |
| Q-W07-05 | P1 | OP-02 tabs as `?tab=` on the kept path; OP-04a on the O45 path; OP-04b new | A path per tab needs new inventory entries and breaks the case page address that every link uses | Yes |
| Q-W07-06 | P1 | Authorize UNR to OP-04a pending mode (D-W07-06) | The generic operation page cannot say "Do not perform the external act" | Yes |
| Q-W07-07 | P1 | A separate government fee payment act while the submission's filing is unknown: Core allows it (stage 8 blocks only the same act kind, a fee-carrying unknown act and exhausted reconciliation, `controls.ts:327-345`); UX §5.3 says unknown execution "removes repeat/payment/ordinary withdrawal options"; BS B23 says "No blind repeat payment/filing" | The operator records the submission of "SYN Tourist e-visa" as uncertain, then is offered the separate fee payment and pays it; if the submission never happened the fee may be spent on nothing | Two readings. Recommend B23's reading (repeat payment): show Core's answer and add on that review "The government submission's filing is unknown. Paying the fee is a separate act; check the submission first." If Max chooses the UX reading, it is a Kind 2 change (a new blocker), not a page rule |
| Q-W07-08 | P2 | Fresh synthetic travel agent per proof run, created through SA-06 and signed in by the harness | A rerun on a travel agent whose ceiling is already set cannot show the paid-at-₹0 case | Yes; fallback syn-ta-3 or a test |
| Q-W07-09 | P2 | "Return for TA review" built in WP-07 (the same command and form) | Two packages would style one form two ways | Yes; WP-09 builds the assistance entry only |
| Q-W07-10 | P2 | Read-only section from `views.ops_work` pages (interim) | With many assigned rows the read-only rows sit in a later part of the list | Accept with the stated line; STOP-W07-04 |
| Q-W07-11 | P2 | Show "Ceiling minus counted exposure" as labelled arithmetic; drop both status badges | — | Accept |
| Q-W07-12 | P2 | Relabel the carried WP-17 withdrawal form under possible filing | — | Accept (§2.4.6) |
| Q-W07-13 | P2 | Wrap the existing history page in the OP-02 frame | Tabs would vanish on History | Accept |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W07-01 | New GET `/ops/applications` (Applications destination) | New route and inventory entry |
| D-W07-02 | `/ops/grants` answers 303 to `/ops/applications#read-only` | Location of a kept GET |
| D-W07-03 | OP-02 tabs by `?tab=`; History is the kept page in the frame | Address state (enumerated) |
| D-W07-04 | New GET pages on POST paths: OP-03r, OP-03f, OP-04a (O45 registered), SA-07l, SA-07i | New routes; actions and fields unchanged |
| D-W07-05 | New GET OP-04b `/ops/applications/:id/acts/:authorizationId` with `?record=` modes; new SA-09c route; SA-09 kind enumeration extended | New routes |
| D-W07-06 | Authorize `outcome_unknown` answers 303 to OP-04a pending mode, not to `/ops/operations/<key>` | Location of UNR |
| D-W07-07 | Uncertain form: `result` hidden (`filing_unknown`); evidence rows `evidence.<n>.*` for n = 0…4 read by the BFF; more refused before the command | Names unchanged; more rows |
| D-W07-08 | Success locations carry `&op=` and move to the host pages of §1.4 (approve/decline to SA-09c) | Locations change |
| D-W07-09 | Operator rail: Applications added; Services removed; "Read grants" member removed | Shell config |
| D-W07-10 | Generic grant form removed from the old SuperAdmin case page; Gate 2 and readiness kinds | Host page changes |
| D-W07-11 | `reconciliation` and `flag` built in WP-07 | Register rows |
| D-W07-12 | Approve re-renders SA-09c for `unavailable_dependency`/`audit_degraded` (a definite Core refusal), status 503 | Re-render for one code |
| D-W07-13 | The "Basis fingerprint" identifier leaves the readiness form; the digests stay hidden | Display only |
| D-W07-14 | SA-07h and SA-07t show no status badge per travel agent | Display only |
| D-W07-15 | Carried WP-17 withdrawal form relabelled and placed under a boundary while a filing may have happened | Label only; form unchanged |
| D-W07-16 | OP-03r keeps the return form while a filing may have happened (UI-PLAN §5.3 shows a boundary); a warning states that corrections are held | None (Core decides) |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W07-01 | Kind 1 (projection of computed facts) | The gate basis of each offered act (`actOffers[].evaluation`) and of `offers.startWork`: per gate `passed` \| `exception` (id, gate, action) \| `not_applicable`; an extension of the approved P-10 (e) helper | UX §5.3 "An exception shows 'Action allowed by exception' with exact scope, not 'Payment received'"; V08 | 1. Core computes it (`Evaluation.gateBasis`). 2. Removes a client-side inference of a permission basis (D4, D5). 3. Same scope as `core.ops_case`. 4. Named by subject (gate basis of an evaluation). 5, 6: owner duties | Interim rows (§3.2); V08-1 partly met. **P1**: route to the orchestrator as an addition to the `core-reads-2026-10-12` batch |
| STOP-W07-02 | Kind 1 | For the assigned operator's fee-carrying act: whether a fee of a given size fits the travel agent's ceiling now, and whether the paid-at-₹0 parked case applies (or the counted exposure and ceiling, if Max allows operators to see them) | UI-PLAN External action read model lists exposure; UX §5.1 "applicable payment/exposure" | 1. Facts exist. 2. Removes a refusal-driven discovery on a P0 page. 3. Needs a scope decision (operators reading a travel agent's money facts) | The refusal after the request is specific and harmless (one commit). P2 |
| STOP-W07-03 | Kind 1 | The submission's authority confirmations (code, version, state) and submission time on the staff case view | UX §5.3 review screen "authority" | 1. Facts exist (`staff-views.ts:75`, `confirmations`). 2. One fewer statement the operator must take on trust. 3. Same scope | Interim text (§2.7.1 item 4). P2 |
| STOP-W07-04 | Kind 1 | A grant-only filter on `views.ops_work`, and offering title and group label on its rows | OP-01a read-only section | 1–4 as inventory RM-O1 | Paging line (§2.2). P2 |
| STOP-W07-05 | Kind 1 | A SuperAdmin queue "first government commitment waiting for Gate 2" (applications ready for the commitment, unpaid, TravelMudra-filed, no possible filing) sharing the P-12 C helper | SA-07 "Gate 2 requests" (UI-PLAN SA-07 blocks) | 1. Derived from recorded facts. 2. Removes a manual hand-off (the flag). 3, 4 hold | Operator flag (§2.6.3). P2 |
| STOP-W07-06 | Defect note (payments view) | `pay.application_payments.gate2` answers `unknown` for TravelMudra-filed work (F-W07-09) | SA-07a Gate 2 row | — (defect, not a projection) | "Unavailable" on SA-07a; SA-09 uses case facts. P2; confirm by a Core test |
| STOP-W07-07 | Kind 1 | The review point (`review_on`) of an approved deferral per item of `core.ops_work` | UX §7.3 Operator Home row "actual review point" | 1–4 hold | "No current action until the deferral review"; the date on OP-02. P2 |

No STOP item blocks the WP-07 main path. No P0 item is open in this design. Kind 2: none requested; Q-W07-07 becomes
one only if Max chooses the UX reading.
