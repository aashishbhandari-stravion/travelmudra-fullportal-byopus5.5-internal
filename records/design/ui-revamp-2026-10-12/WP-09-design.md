# WP-09 design review: assistance and report a problem

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-09
holds commands that change who may edit an application, the application information itself, and the holds that
block filing, so a Codex design review applies).
Product base: lane repository at e9e96e3 (WP-01 shell and result components, WP-20 public site, WP-02 U0 decision and
panel components, WP-02 U1 Services, WP-03 U6 seal). WP-03, WP-06, WP-07 and WP-08 are designed and not yet built;
this design depends on their units named in §1.6. This document writes no product code. Paths in `file:line` form are
relative to the lane repository at e9e96e3 unless they start with `REC/` (`internal/records/`) or `RM` (lane
`research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at e9e96e3. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Five register commands (COMMAND-COVERAGE §5.1, §6.1): `core.report_problem` (TA-07p, a new task page of
  TA-07), `core.record_assistance_entry` (OP-02a, the approved-assistance task page of OP-02), `core.resolve_hold`
  (OP-02r, one page per open hold), `core.decide_assistance` (two SA-09 kinds, approve and decline) and
  `core.respond_flag` (SA-09 kind `flag_response`, CC-04), with their list entries on SA-01, SA-02b and SA-02c. The
  ending of approved assistance, "Return for TA review", is `core.formal_return` from `editor_state =
  assistance_in_progress` (fields `note`, `resolveProblemHoldId`, `_rev.application`). WP-07 builds its page (OP-03r);
  WP-09 designs the path to it on OP-02 and corrects its effect text per lifecycle. No new command.
- **Page model.** New GET pages on the POST paths of their one form (WP-06/07 pattern): TA-07p
  `/ta/applications/:id/report-problem`, OP-02a `/ops/applications/:id/assistance-entry`, OP-02r
  `/ops/applications/:id/holds/:holdId/resolve`. SA-09 gains three kinds on the WP-06 route
  `/admin/applications/:id/decide/:kind` without a subject (queue rows carry no request or hold id; Core keeps at
  most one open help request and one open flag per application). No form action changes. Field names do not change;
  three deviations touch the form protocol (§9.3: D-W09-04 hidden `decision`, D-W09-05 identity input from the posted
  values, D-W09-07 BFF-only origin fields).
- **Rules the pages state (Core facts, not page rules).** A travel agent on an assigned application that is not
  formally returned reads and reports only; the report changes no application data; filing authorization and packet
  release wait until the operator deals with it and confirms readiness again (B18). Help approval on an application
  with no operator assigns nothing and passes no gate; an approval on an assigned application starts operator entry
  at once and Core checks Gate 1 for the first work at the approval (D-07). Approved assistance ends only by "Return
  for TA review"; the travel agent then submits (draft) or hands back (submitted). A SuperAdmin's flag response is a
  note: it records no decision and does not close the flag.
- **Interim and adoption (§3).** The operator cannot flag during approved assistance (`holds.ts:156`), and no queue
  lists an approved-assistance case whose first work Gate 1 blocks (D-06). Until the Core Kind 1 batch serves P-12
  option C (seam item S-08), OP-02, OP-02a, OP-03f, SA-09 and SA-02b show one shared known-gap line and the SA-09
  approval page names the SuperAdmin's own routes. §3.3 lists each change at adoption.
- **Findings worked (§9.1).** The report form is hidden by a page rule after an outcome although Core accepts the
  report; the assistance entry diffs identity against a fresh read, so a resend of the same operation conflicts after
  acceptance (the WP-03 C-04 class); typed text is lost on three staff refusals; the help decision has no effect
  statement although an in-place approval checks Gate 1, may consume a first-work exception and closes an open
  return; the flag response hides the question and that the operator changed; WP-07's action panel names a problem
  report for an answered flag; WP-07's OP-03r text says the travel agent "submits" a returned submitted case.
- **STOP items (§9.4).** No P0. Four Kind 1 notes at P2 (a Core evaluation of the report on the TA case read; the
  operator's name for the TA; help request and hold resolution facts on the staff read; what the operator changed).
  One seam item at P1 for the bulk lane (BU-21 help before an application exists).
- **Top questions (§9.2).** Q-W09-01 TA-07p as a task page; Q-W09-02 offer the report by Core's guard facts, also
  after an outcome; Q-W09-03 two help kinds with a hidden `decision`; Q-W09-04 deterministic identity mapping of the
  entry; Q-W09-05 OP-02a hosts the entry and the operator's assistance upload; Q-W09-06 amend WP-07 (row split, OP-03r
  text) before WP-07 is built; Q-W09-07 Gate 1 first-work block shown on OP-02a from Core's `start_operator_work`
  evaluation; Q-W09-08 BU-21 first half stays a bulk-lane boundary; Q-W09-09 proof writes on `lane-ui`.
- **Proofs (§6).** V07 on `lane-ui` end to end (report, return, correction, hand back, same operator reconfirms;
  approved help on a draft from request to the travel agent's own submission) with the hostile variants; BU-21 to its
  boundary (help on a draft through the normal path; help before an application exists is the bulk lane's); BU-22 to
  its boundary (TA-07 and TA-09 side; BU-P07's "edit unavailable" link is the bulk lane's).

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.3, §3.1 step 5, §3.2 (approved assistance; TA reports a problem), §3.3, §4.1, §4.3 "Corrections and pricing", §4.4, §5.1, §5.3 "Assistance", §5.4, §6.1, §6.3 (exception), §7.4, §8.3, §10.3 R17, §12 V07 |
| Bulk spec `BULK_UPLOAD_PRODUCT_UX_SPEC.md` (SHA-256 c2686f12552be10f…) | §6.4 (resolution controls), §7.2 (edit unavailable), §8.2, §12 BU-21, BU-22 |
| `BUILD_SPEC.md` r2 | B14–B20, B33, B35 |
| `UI-PLAN.md` | §1, §3.2 TA-07, §3.3 OP-02, OP-03, §3.4 SA-01, SA-02, SA-09, §4.2 (approved assistance A1–A6; report R1–R4), §5.2 TA-07, §5.3 OP-02, OP-03, §5.4 SA-02, §6, §7 (rows Request help, Report a problem, Save assistance entry, Return for TA review, Flag to SuperAdmin, Decide help request), §8, §10, §11, §12.2 WP-09, §13 |
| `BULK-UPLOAD-UI-PLAN.md` | BU-P06, §4.7 item 3, §4.10 item 5, coverage rows BU-21, BU-22 |
| Lane records | `PLAN.md` §4 (LD-04, LD-05, LD-13, LD-14), §7 (#25), §8 (S-05, S-08), §9; `PROPOSALS.md` (P-09, P-10, P-12); lane `output/proposals/P-12-…md` §4.3 and §11 (narrowed option C); `COMMAND-COVERAGE.md` §3, §5, §6, §6.1; `WP-03.md` §3, §4.1 (C-02, C-03, C-04, C-14); `WP-03-design.md` §1.2–§1.5, §2.0, §2.7, §2.9, §3, §5.6, §9; `WP-06.md` §3 (PM Q-05), §4.1 (D-02, D-05, D-06, D-07); `WP-06-design.md` §1.4, §1.5, §2.0, §2.1, §2.2, §2.7; `WP-07.md` §3, §4.1 (F-01 to F-12); `WP-07-design.md` §1.2–§1.6, §2.0, §2.3–§2.6, §2.11, §3.3; `WP-08.md` §3, §4; `WP-02.md` §3 (CMP-25); `DESIGN.md` |
| Route map (RM) | §1, §2 rows T30, T32, O08, O09, O11, O14, O15, D03, D04, D14, D25; §3.2 |
| Code (read models, commands, guards) | Pages: `src/apps/shared/core/ta.ts:548-602`, `src/apps/edge/core/routes.ts:120-129`, `src/apps/staff/core/ops.ts:162-170, 217-251, 396-451`, `src/apps/staff/core/case.ts:266-278, 392-420`, `src/apps/staff/core/admin.ts:183-207, 278-285, 367, 418-425, 556-569`, `src/apps/staff/intake/routes.ts:77-104`, `src/apps/shared/core/shared.ts` (`CORE_MESSAGES`, `TA_MESSAGES`, `EDITOR_LABELS`, `HOLD_LABELS`), `src/web/ui/decision.ts`, `src/web/ui/panels.ts`. Contracts: `src/contracts/core.ts:83-130` (commands), `:222-281` (`zWireTaCase`), `:286-345` (`zWireStaffCase`), `:405-408` (`core.admin_queue`); `src/contracts/operations-work.ts:197-200` (`offers`). Core behaviour only: `src/modules/core/commands/holds.ts` (all), `src/modules/core/commands/assignment.ts:64-75, 278-397`, `src/modules/core/commands/drafts.ts:122-148`, `src/modules/core/corrections.ts:36-45, 120-130`, `src/modules/core/commands/submission.ts:150-200`, `src/modules/core/controls.ts:100-110, 400-430, 487-514, 666-676, 715-719`, `src/modules/core/derived.ts:290-345`, `src/modules/core/store.ts:205-215, 291-297`, `src/core-api/bindings/core.ts:195-205, 466-512`, `src/core-api/bindings/operations-work.ts:144`, `src/kernel/command.ts:330-345` |
| Tests that pin the pages | §7.3 |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| TA-07p | Report a problem | `/ta/applications/:applicationId/report-problem` (GET beside the POST T32) | **New** (`ta.applications.problem_form`, action `application.report_problem`, support view: no) | `core.ta_application` |
| TA-07 | Application (WP-03 page) | `/ta/applications/:applicationId` | WP-03 page; WP-09 changes the report panel, two status rows, one receipt and the withdraw route (§2.2) | as WP-03 |
| OP-02a | Approved assistance | `/ops/applications/:applicationId/assistance-entry` (GET beside the POST O08) | **New** (`ops.applications.assistance_form`, action `operator.assistance_entry`) | `core.ops_case`; opt. `ops.case_work`; opt. `doc.application_evidence` |
| OP-02r | Resolve a hold | `/ops/applications/:applicationId/holds/:holdId/resolve` (GET beside the POST O15) | **New** (`ops.applications.hold_form`, action `operator.resolve_hold`; `holdId` zod `zWireHoldId`) | `core.ops_case` |
| OP-02 | Application workspace (WP-07 page) | `/ops/applications/:applicationId?tab=` | WP-07 page; WP-09 changes the frame line, the Holds section, two action-panel rows and the Application & documents tab (§2.5) | as WP-07 |
| OP-03r | Return to TA / Return for TA review (WP-07 page) | `/ops/applications/:applicationId/return` | WP-07 page; WP-09 changes the assistance effect text and adds an optional `resolve` preselection (§2.6) | as WP-07 |
| SA-09h | Decision: help request | `/admin/applications/:applicationId/decide/:kind`, `kind` ∈ {`assistance_approve`, `assistance_decline`} | Kinds added to the WP-06 route `admin.decisions.application` | `core.admin_case`; opt. `ops.case_work` (only with an active assignment); opt. `pay.application_payments` |
| SA-09f | Decision: respond to a flag | same route, `kind` = `flag_response` | Kind added to the same route | `core.admin_case` |
| SA-02b, SA-02c | Help requests, Flags from operators (WP-06 pages) | `/admin/queues/assistance`, `/admin/queues/flags` | WP-06 pages; WP-09 changes the lead, one column and the row actions (§2.9) | as WP-06 |
| SA-01 | Decision inbox (WP-06 page) | `/admin` | WP-06 page; WP-09 changes the item links of groups 4 and 5 (§2.9) | as WP-06 |
| (old) | SuperAdmin case page | `/admin/applications/:applicationId` | Not rebuilt (SA-04, WP-11). The help decision and flag response forms leave it; facts and links stay (§2.9) | unchanged |

New GET routes validate parameters with zod (`zWireId('app')`, `zWireHoldId`); a parse failure is the uniform 404.
`resolve` returns `{ type: 'application', id }`, as the POST routes on the same paths do. Query values are enumerated
or opaque (SH-R06): TA-07p `from` ∈ {`applications`, `group`, `search`, `import`} with the origin parameters TA-07
already accepts (WP-03 §2.7 item 1) and `attempt` (pattern `ina_…`, only with `from=import`), `purpose` ∈ {`withdraw`};
OP-02a and OP-02r `from` ∈ {`applications`}; OP-03r `resolve` (pattern `prb_…`). An unknown value is ignored.

### 1.3 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| TA-07p | Applications `/ta/applications` (as TA-07) | By origin, as TA-07 (WP-03 §2.7 item 1), then "› [applicant] › Report a problem". `from=import`: "Groups › [group label] › Import › [applicant]", the import linking `/ta/intake/<attemptId>` |
| OP-02a, OP-02r | `/ops/work`, or `/ops/applications` with `from=applications` (WP-07 §1.3) | "My work › [applicant] › Approved assistance" / "› Resolve a problem report" / "› Resolve a flag" |
| SA-09h | Work queues › Help requests `/admin/queues/assistance` | "Work queues › Help requests › [applicant]" (applicant links to the old case page) |
| SA-09f | Work queues › Flags `/admin/queues/flags` | "Work queues › Flags from operators › [applicant]" |

No rail change in WP-09. At P-12 adoption a fifth Work queues member "First work (Gate 1)" appears (§3.3; one block
in `SURFACE_CONFIG.admin`, applied by the architect).

### 1.4 The WP-09 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `core.report_problem` | `ta.applications.report_problem` (`/ta/applications/:applicationId/report-problem`) | **TA-07p** (moved from the TA-07 disclosure and the withdraw section) | `note`; BFF-only hidden `from`, `r` or `attempt` (D-W09-07) | — (Core takes none: "valid against any revision", `holds.ts:56`) | Success `receiptLocation('/ta/applications/<id>' + origin, 'problem', key)`; refusal re-renders TA-07p with `note` kept |
| 2 | `core.record_assistance_entry` | `ops.applications.assistance_entry` (`/ops/applications/:applicationId/assistance-entry`) | **OP-02a** (moved from OP-02 Application & documents) | `field.<key>`, `declaredCountry`, `passportType`, `surname`, `givenNames`, `dateOfBirth`, `passportNumber`, `issuingCountry`, `nationality`, `evidence.<dov id>`=`yes`, `explanation` | `application` | Identity input mapped from the posted values, without a second read (D-W09-05, Q-W09-04); success `receiptLocation('/ops/applications/<id>/assistance-entry', 'entry', key)`; refusal re-renders OP-02a with every typed value |
| 3 | `core.resolve_hold` | `ops.applications.resolve_hold` (`/ops/applications/:applicationId/holds/:holdId/resolve`) | **OP-02r** (moved from the OP-02 Holds table) | `resolutionNote` | — (Core takes none) | Success `receiptLocation('/ops/applications/<id>/holds/<holdId>/resolve', 'resolved', key)`; refusal re-renders OP-02r with the note |
| 4 | `core.decide_assistance` | `admin.applications.assistance_decision` (`/admin/applications/:applicationId/assistance-decision`) | **SA-09h** `assistance_approve`, `assistance_decline` (moved from the old case page) | `assistanceId` (hidden, from the read), `decision` (**hidden**, fixed by the kind, D-W09-04), `reason` | `application` | The handler maps the posted `decision` to the kind; success `receiptLocation('/admin/applications/<id>/decide/<kind>', 'decided', key)`; refusal re-renders that kind with the reason. Another `decision` value re-renders `assistance_approve` with Core's refusal |
| 5 | `core.respond_flag` | `admin.applications.respond_flag` (`/admin/applications/:applicationId/flags/:holdId/respond`) | **SA-09f** `flag_response` (moved from the old case page Holds table) | `responseNote`, `reason` | — (Core takes none) | Success `receiptLocation('/admin/applications/<id>/decide/flag_response', 'responded', key)`; refusal re-renders the kind with both values |
| 6 | `doc.upload_for_application` (ops route; register WP-03) | `ops.documents.upload` (`/ops/applications/:applicationId/documents`, multipart) | **OP-02a** section "Documents" (moved from OP-02) | `requirementType` (hidden per row), `file` | — (as today) | Rendering only, in `src/apps/staff/intake/routes.ts`: success `receiptLocation('/ops/applications/<id>/assistance-entry', 'document', key)`; refusal re-renders OP-02a with the reason at the row (today the shell error page, F-W09-08). Command input and multipart names unchanged (bulk seam v2, S-05: §1.7) |

The ending of approved assistance is `core.formal_return` on OP-03r (WP-07 row 6): not a WP-09 command; §3.1.
Each WP-09 command has exactly one host page, so a refusal always re-renders the page it came from.

### 1.5 Forms that leave pages, and carried forms

Forms that leave a page in WP-09 (each page keeps its facts and gets a link):

| Form | Leaves | Link that replaces it |
|---|---|---|
| Report a problem (disclosure, `ta.ts:551-556`) | TA-07 (carried in WP-03) | Action panel "Report a problem" → TA-07p (assigned state); aside link (assistance state) |
| "Ask for a return to withdraw" (`ta.ts:580-585`, posts `report-problem`) | TA-07 withdraw section (carried WP-17 section) | Link "Ask your operator for a return" → TA-07p `?purpose=withdraw` (prefills the current note text). The rest of the withdraw section stays WP-17's |
| Assistance entry (`ops.ts:230-244`) | OP-02 Application & documents (carried in WP-07) | "Enter information" → OP-02a |
| Operator upload during assistance (`ops.ts:249`, `documentsSection` `canUpload`) | OP-02 Application & documents | "Add or replace documents" → OP-02a `#documents` |
| Resolve a hold (`ops.ts:162-170`) | OP-02 Work › Holds (carried in WP-07) | Per hold row: "Resolve the problem report" / "Resolve the flag" → OP-02r |
| Decide on assistance (`admin.ts:278-285`) | Old SuperAdmin case page (carried in WP-06) | "Approve help request" → SA-09h approve; "Decline help request" → SA-09h decline |
| Respond to the flag (`admin.ts:199-207`, `:367`) | Old SuperAdmin case page Holds table | Per unanswered open flag: "Respond" → SA-09f |

Carried on WP-09 pages: none. The operator's associate route `ops.documents.associate` (O11) has no form today
(RM §2) and keeps none (Q-W09-12, P2): the command has its page on TA-09u (WP-03).

### 1.6 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13 (operation
status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage` (states `draft`, `unavailable`, `closed`),
CMP-01 `actionPanel`, `statusFacts`. WP-03 U0: CMP-02 `evidenceRows`, CMP-11 `identityBand`. WP-06 U4: the SA-09
registry (`src/apps/staff/decisions/kinds.ts`) and routes. WP-07 U0: OP-02 frame (`src/apps/staff/work/frame.ts`) and
the operator reading (`src/apps/staff/work/reading.ts`). Existing: `textareaField`, `textField`, `selectField`,
`checkboxField`, `fileField`, `summaryList`, `dataTable`, `identifier`, `timeAt`.

One small shared part, new in WP-09 U2 (no new component file): **Unsent text block** — after a refusal that
removes the form (the state changed), the page shows the reader's typed text read-only under the heading "Your
unsent [report / response / note]" with the line "This text was not sent. Copy it if you still need it." Plain
`<blockquote>` in the page flow; no live region. It applies the WP-03 C-14 rule ("permitted unsent text kept").

Dependency: WP-09 builds after WP-03 U3 and U4, WP-06 U2 and U4, and WP-07 U0, U2 and U3 are integrated (package
order of PLAN §3: WP-09 follows WP-08). WP-09 MUST NOT build a second frame, decision page, band or queue table.

### 1.7 Seams with other lanes and packages

| ID | Seam | Owner of the other side | Rule |
|---|---|---|---|
| S-W09-01 | BU-P06 and BU-P07 "Report a problem" (bulk spec §6.4, §7.2 "edit unavailable") for an application that is assigned and not returned | Bulk work packages WP-04, WP-05, WP-18 (UI lane, bulk pages) and the bulk lane's read facts | The bulk page MUST link to TA-07p `/ta/applications/:applicationId/report-problem?from=import&attempt=<ina_…>`. It MUST NOT post `core.report_problem` itself (one host page per command). TA-07p returns the reader to `/ta/intake/<attemptId>` on Cancel and keeps the origin on its receipt location. No command or field change |
| S-W09-02 | BU-21 first half: "Request help before an application exists" keeps the issue in the SuperAdmin intake queue | Bulk lane (intake commands) and WP-18 (BU-P06, SA-02 import issues) | No Core command records a help request on an intake issue at e9e96e3 (`src/modules/intake/**` has none). An open intake issue is already listed in the SuperAdmin import issues (`intake.admin_incidents`). Whether BU-P06 needs a request command or only states that TravelMudra already owns the issue is the bulk lane's decision (Q-W09-08). WP-09 builds nothing for it |
| S-W09-03 | Seam version 2 (S-05): the operator's upload may accept `part` for the passport | Bulk lane (parsing in the handlers) | WP-09 changes only the location and the re-render of `ops.documents.upload` in `src/apps/staff/intake/routes.ts`. If the bulk lane's CAP-04 commit touches the same handler, the orchestrator resolves the overlap on main; WP-09 renders the `part` inputs on OP-02a in the integration window of seam v2, as TA-09f does |
| S-W09-04 | P-12 option C (narrowed) and P-10 (e) in the Core Kind 1 batch | Core task `core-reads-2026-10-12` | Adopt per §3.3 when the seam version serves them (S-08); remove the interim lines |

## 2. Page specifications

### 2.0 Rules common to every WP-09 page

- **Freshness (LD-08).** Every WP-09 read is authoritative. Pages show CMP-12 "Read at [time] IST". No page applies
  its own age threshold.
- **Page states.** S1: pages are rendered complete by the server; no skeleton exists. S6 and S7: SH-02 pages of WP-01
  (uniform 404 without object facts; Core unreachable: neutral "TravelMudra is unavailable now", WP-01 A-09, WP-02
  B-03; "Nothing was sent, so nothing changed" only after a proven refusal). Each page below lists its own states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders "Unavailable" in place of
  each fact the read supplies. Every other refusal reaches the shell, so a reassignment, a revoked read grant, a
  suspension or an open support view removes the page on the next read (B10, SH-R04). No page code catches every
  error.
- **Command results.** ACC: 303 to the host page (TA-07 for the report) with `?done=<code>&op=<key>`; CMP-08 first
  in `main`; its title first in the document title. The receipt names a result only when `core.operation` returns
  the expected resource id and the command-specific summary fields (§2.11); records are selected by the ids it
  returns; every later read is labelled "Current" (WP-02 B-02, WP-03 C-03, WP-06 D-02). REJ: the host page
  re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07 focused, every
  typed value kept except files and identity-evidence checkboxes (never prechecked); sentences from the closed tables
  (§2.10); an unknown code shows the category text plus "Reference code: [code]" (staff) or "Reference:
  [code]" (TA). When the refusal shows that the form no longer applies (the state changed), the page shows the
  state and the unsent text block (§1.6). C5: CMP-14. UNR: 303 to `/<ta|ops|admin>/operations/<key>`; "Open the
  result" goes to TA-07, OP-02 or the old SuperAdmin case page; no page offers a new submission of the same intent
  while it is unresolved.
- **K rules.** All five commands: K-STD (UI-PLAN §7). A form carries one `_op` from page load; a browser resend
  reuses it; a re-render after a refusal issues a new `_op` (a refused command records nothing, B35). The command
  input of a resend MUST be byte-equal to the first, so no handler derives input from a read made at POST time
  (F-W09-02).
- **Copy.** UI-PLAN §11. Every time carries "IST". Synthetic data shows "Synthetic" (CR-08). Forbidden: "Submit for
  TA", "Override", "Approved" or "Ready" as an overall status, "Something went wrong", "Pay now". Staff pages say
  "approved assistance" (UI-PLAN A4); TA pages say "help" (WP-03 TA-07h). A help approval is never called a payment,
  an assignment or a gate exception. A flag response is never called a decision. No WP-09 receipt or state tells the
  operator to perform an external act (WP-07 F-01). All copy is draft (CR-09).
- **Read grants and support view.** A read-grant reader sees OP-02a and OP-02r with the OP-02 frame and the line
  "Only the assigned operator takes this step. You can read this application." and no form (WP-07 §2.0). No WP-09
  page offers a form in a support view; TA-07p is not registered at staff.
- **Mobile (< 768 px).** One column. TA-07p, OP-02a, OP-02r and SA-09 are full-screen task pages: scope and effect
  before the fields; the primary action at the end of the form, never in a fixed bar (UX §7.3).

### 2.1 TA-07p Report a problem `/ta/applications/:applicationId/report-problem`

Purpose: the travel agent tells the assigned operator what is wrong, without changing the application (UX §2.3,
§3.2, §4.3, §4.4; B18). Entry: TA-07 action panel or aside; TA-09t and TA-09 section pages (the `awaiting_formal_return`
notice); TA-07h (the same notice); the withdraw section; bulk pages (S-W09-01).

Anatomy (reading order):

1. Header: breadcrumb (§1.3); `h1` "Report a problem: [SURNAME], [Given names]"; meta "Application [reference]"
   (`identifier`); freshness.
2. Who owns the application (status lines from Core facts):
   - `editor_state = assigned`: "Your assigned operator owns this application now. Only your operator can return it
     to you for correction (a formal return). Until then you cannot change it."
   - `editor_state = assistance_in_progress`: "An operator is entering information with your approval. When they
     finish, they return the application to you for your review."
   - The operator's name is not in the travel agent's read (STOP-W09-02); the copy names the role.
3. What a report does (visible text, before the field): "A report tells your operator what is wrong. It changes no
   application data. Your operator deals with it: they may return the application to you for correction, or close
   the report. Filing and the packet release wait until your operator has dealt with it and checked the application
   again." With `purpose=withdraw`, a lead first: "To withdraw an application that is with your operator, ask for a
   return first. Once it is returned to you, you can withdraw it on the application page."
4. Form (action = the path): "What is the problem?" (`note`, `textareaField`, 5 rows, maxlength 2000, required, hint
   "Name the details or documents that are wrong and what they should be."). With `purpose=withdraw` the field holds
   the current text "Please return this application to me: the applicant wants to withdraw it." (`ta.ts:584`), which
   the travel agent may change. BFF-only hidden fields `from` and `r` or `attempt` keep the origin (D-W09-07).
5. Review (visible): "When you send it: your operator is notified; the application data stays as it is; the
   application page shows the report as open."
6. Buttons: "Send the report" (primary); "Cancel" → TA-07 (origin kept) or, with `from=import`, the import page.

States (first match; each state is a Core fact; Core decides at the command):

| State | Condition (Core facts, `core.ta_application`) | Copy and controls |
|---|---|---|
| Closed | `lifecycle` ∉ {`draft`, `submitted`} | "This application is closed. A problem report is not available." Link "Open the application". No form |
| Not with an operator | `editor_state = unassigned` | "This application is not with an operator. You can change it yourself." Link "Change the application" (TA-09t) when `correct.allowed`; otherwise the `correct` blocker sentences. No form |
| Returned to you | `editor_state = returned_to_ta`, or an open `returned_to_ta` hold | "Your operator returned the application to you. You do not need to report a problem." Then the operator's note (the return hold's `note`, "No note was given." when null) and "Returned [time] IST". Draft: "Check every answer, then submit it yourself." with "Check and submit" (TA-08). Submitted: "Correct what your operator asks, then hand the application back." with "Correct the application" (TA-09t) and "Hand it back" (TA-08 returned mode). No form |
| Report already open | an open `problem_reported` hold | "Your problem report is with your operator since [opened_at] IST. A second report is not accepted while this one is open. Your operator deals with it and may return the application to you." No form |
| Assistance in progress | `editor_state = assistance_in_progress` | Status line of item 2; form |
| Assigned | `editor_state = assigned` | Form. An outcome on record does not remove the form: Core accepts a report while the application is open (`holds.ts:66-71`; Q-W09-02) |
| C1 | `validation_failed` on `note` | "Describe the problem." (empty) / "Use at most 2,000 characters." (too long); note kept |
| C2 `conflict_duplicate` / `problem_report_open` | a report opened meanwhile (another tab) | "Your earlier report is still open with your operator. Nothing was sent." Then the "Report already open" state and the unsent text block |
| C2 `control_blocked` / `hold_not_applicable` | returned, or no longer with an operator, meanwhile | "The application changed before your report was sent. Nothing was sent." Then the state that now applies (re-read) and the unsent text block |
| C2 `control_blocked` / `application_not_open` | closed meanwhile | "This application is closed. Nothing was sent." Unsent text block |
| C3 `problem` | — | 303 to TA-07 with the receipt (§2.11) |
| C4 | — | `/ta/operations/<key>`; "Open the result" → TA-07 |

Mobile: full-screen task page; the ownership lines before the field.

### 2.2 TA-07 changes (WP-03 page, WP-09 panels)

WP-09 changes these parts of TA-07 (`src/apps/shared/core/ta.ts` after WP-03 U3); the WP-03 structure stays.

1. **Action panel (WP-03 §3.2 item 9).** `editor_state = assigned`, no open `problem_reported` hold, no open return:
   owner "Your assigned operator"; step "This application is with your operator. Report the problem so it can be
   returned for correction." (UX §4.4, verbatim); blocker type "Another person owns this step"; action "Report a
   problem" → TA-07p. The outcome is not a condition (Q-W09-02).
2. **Approved help in progress (WP-03 §3.1 row "Draft with approved help in progress").** No primary action (the
   operator owns the step). The aside gains "Report a problem" → TA-07p.
3. **Report open.** Owner "Your assigned operator"; "Your operator deals with your report and may return the
   application to you."; no action.
4. **Status rows (WP-03 §2.7 item 4).** "Help request" (closed table; replaces `humanize(v.assist.state)`,
   `ta.ts:569`, F-W09-07):

   | `assist.state` | `editor_state` | Words |
   |---|---|---|
   | null | any | "Not requested" |
   | `requested` | any | "Requested: TravelMudra decides" |
   | `approved` | `unassigned` | "Approved: TravelMudra assigns an operator" |
   | `approved` | `assistance_in_progress` | "Approved: an operator is entering information" |
   | `approved` | other | "Approved" |
   | `declined` | any | "Declined" |
   | `fulfilled` | any | "Ended" |
   | other | any | "Unrecognised state" + "Reference: [code]" |

   "Problem report and return": one line per open hold, "Problem report: open since [time] IST", "Returned to you
   since [time] IST", "Your operator asked TravelMudra for a decision" (flag); "None" when no hold is open.
5. **Receipt `problem`** (§2.11) first in `main`, replacing the `doneFlash` code `problem`.
6. **Withdraw section (carried WP-17).** While the application is with the operator, the confirm disclosure
   `withdraw-ask-return` (`ta.ts:580-585`) becomes the link "Ask your operator for a return" → TA-07p
   `?purpose=withdraw`. The rest of the section is unchanged.
7. **Links from WP-03 pages.** The `awaiting_formal_return` notices of TA-09t, the TA-09 section pages and TA-07h
   link to TA-07p, not to `#report-problem` (one-value changes in `src/apps/shared/pages/prepare.ts` and
   `help-request.ts`; U1). TA-07h's "Request already open" state for `approved` reads "TravelMudra approved your
   request. An operator is entering information with your approval." when `editor_state = assistance_in_progress`.
8. **Breadcrumb origin `import`.** TA-07 accepts `from=import` with `attempt` and shows "Groups › [group] › Import ›
   [applicant]" (S-W09-01).

### 2.3 OP-02a Approved assistance `/ops/applications/:applicationId/assistance-entry`

Purpose: the assigned operator enters information within approved assistance, with a visible label and scope, and
ends by returning the application for the travel agent's review (UX §5.3 "Assistance"; B18; UI-PLAN A4, A5).
Entry: OP-02 action panel, the frame line, the Application & documents tab; OP-01 rows of the case.

Anatomy (reading order):

1. OP-02 frame items 1–5 (WP-07 §2.3: breadcrumb, receipt, identity band, protected-state banner, status facts); no
   tabs. `h1` in the band: the applicant and the reference (frame). Page title "Approved assistance".
2. Label band (info tone, text and icon): "Approved assistance. You enter information with the travel agent's
   approval. You never confirm or submit for them. When you finish, return the application for their review."
3. Section "What the travel agent asked for" (`h2`): `assistance.request_note`, or "No note was given."; "Help request
   [reference]" (`identifier`).
4. Section "Gate 1 for your first work on this assignment" (`h2`), from `ops.case_work` (opt.):
   - `workStarted = true` (then `offers.startWork` is null): "Not checked again: work on this assignment has started."
   - `offers.startWork.allowed = true`: "No blocker now. Your first entry records the basis."
   - `offers.startWork` with a `gate1_*` blocker: the CMP-10 of the state table below.
   - read unavailable: "Unavailable. TravelMudra checks Gate 1 when you record the entry."
   The section reads Core's evaluation of the gate action `start_operator_work`; Core checks the same gate and action
   for the first assistance entry (`controls.ts:668-675`, `assignment.ts:363-397`; Q-W09-07).
5. Section "What you can change" (`h2`), a description of the command's scope (static, from the command shape):
   "The details of this service's application form; country of residence; passport type; identity details (only
   with an identity document of this application that shows the new values); documents (one file for a required
   document)." "What you cannot change here: the service, the group and its travel dates, the price and the original
   estimate, the travel agent's confirmations, and the submission. The travel agent reviews every answer and submits
   or hands back the application themselves." Core restricts the scope to the command; no per-request field scope
   exists (D-W09-09).
6. Form (action = the path, `_rev.application`), in three fieldsets:
   - "Application details": one input per `formFields` entry (`field.<key>`; select when `options`; "(optional)"
     when not `required`), prefilled from `applicant.fields`; "Country of residence (three-letter code)"
     (`declaredCountry`); "Passport type" (`passportType`).
   - "Identity details": `surname`, `givenNames`, `dateOfBirth`, `passportNumber` (mono), `issuingCountry`,
     `nationality`, prefilled with the current values (as `identityInputs`, `case.ts:395-406`); hint "Change a detail
     only when an identity document of this application shows the new value."
   - "Identity evidence": one checkbox per `identityEvidence` row (`evidence.<dov id>`), never prechecked; "No
     identity document of this application can support a change of identity details yet." when none.
   - "Where the information came from" (`explanation`, textarea 3 rows, maxlength 1000, required, hint "For example:
     a call with the travel agent. Recorded with the entry.").
   - Review (visible): "When you record this: the application information changes now, or is held if a filing may
     have happened; an identity change needs the chosen document to show the new values; the travel agent sees the
     information when you return the application for their review." Button "Record the information" (primary).
7. Section "Documents" (`id="documents"`, `h2`): CMP-02 rows (staff words), from `doc.application_evidence` (opt.;
   "Documents cannot be read now." when unavailable, and no upload form). Per row, while the form state applies: an
   upload form (action `/ops/applications/:id/documents`, multipart; hidden `requirementType`; `fileField` with the
   requirement's own formats and `maxBytes`, WP-03 §4.6), button "Upload". "Each file is checked for safety before
   anything reads it."
8. Section "Finish" (`h2`): "When you have entered what the travel agent asked for, return the application for their
   review. This ends the approved assistance, whether or not you entered information." Button link "Return for TA
   review" → OP-03r (§2.6). Never "Submit for TA".

States (first match):

| State | Condition (Core facts) | Copy and controls |
|---|---|---|
| Not the assigned operator | `viewerAssigned = false` (read grant) | Frame, sections 3 and 5, the line of §2.0; no form, no upload, no Finish button |
| Closed | `lifecycle` ∉ {`draft`, `submitted`} | "This application is closed." No form |
| Returned for review | `editor_state = returned_to_ta` | "You returned the application for the travel agent's review. Approved assistance has ended." Link "Open the application". No form |
| No approved assistance | `editor_state = assigned` | "No approved assistance is in progress. Ordinary work does not change application information: return the application to the travel agent for corrections." Link "Return to TA" (OP-03r). No form |
| Gate 1 blocks the first work | `offers.startWork` has `gate1_payment_not_received` (and any of `gate_exception_stale`, `_expired`, `_grantor_inactive`) | CMP-10 in place of the form and the upload forms: "Entering information is unavailable until Gate 1 passes for your first work on this assignment: the service payment is not recorded as received and no fresh Gate 1 exception for first operator work exists. Owner: SuperAdmin." Then the known-gap line (§3.2). Section 8 stays (Core accepts a return) |
| Possibly filed | an act in `authorized`, `filing_unknown` or `reconciliation_exhausted` (`isPossiblyFiled`) | Warning above the form: "A filing may have happened. An entry is held, not applied, until the act is reconciled; protected facts do not change." The form stays (Core decides: `corrections.ts:36-45`) |
| Entry | `editor_state = assistance_in_progress`, viewer assigned | Form, documents and Finish |
| C2 | — | §2.10 |
| C5 `stale_revision` | another entry, a return or a reassignment meanwhile | CMP-14 rows: each field whose posted value differs from the current snapshot ("your value / current value"); Editing (current). Values kept in the fields when the Entry state still applies; otherwise the new state and the unsent values as a read-only list |
| C3 `entry` / `document` | — | Receipts (§2.11) |

Mobile: full-screen task page; label band, request note and Gate 1 section before the form; Finish last.

### 2.4 OP-02r Resolve a hold `/ops/applications/:applicationId/holds/:holdId/resolve`

Purpose: the assigned operator closes a problem report or an answered flag with a note (`core.resolve_hold`). The
subject is the `case.holds` row whose `hold_id` equals the path value; absent → the uniform 404 (not this
application's hold, or the reader cannot read the application).

Anatomy (CMP-25 order, as OP-03):

1. OP-02 frame items 1–5; `h1` (band) as the frame; page title "Resolve a problem report" or "Resolve a flag" by the
   hold's `kind`.
2. Scope: "[Problem report from the travel agent / Flag to a SuperAdmin], opened [time] IST by [name]."
3. Evidence: problem report: "What the travel agent reported: [note]". Flag: "The question: [note]"; "Response:
   [response_note]" and "Answered [responded_at] IST" (the responder's name is not in the hold row, STOP-W09-04);
   Readiness (current, staff words); other open holds.
4. Effect:
   - Problem report: "Resolving closes the travel agent's report. The travel agent is notified that it is resolved.
     The application data stays as it is. Readiness must be confirmed again before filing authorization or packet
     release." And: "If the travel agent must change something, return the application instead: the return can close
     the report." (link "Return to TA" → OP-03r `?resolve=<prb id>`).
   - Flag: "Resolving closes the flag. The SuperAdmin's response stays on record. A response records no decision:
     check the decisions on record (gate exceptions, payment) before you act. Readiness must be confirmed again
     before filing authorization or packet release."
5. Your decision: "How it was resolved" (`resolutionNote`, textarea 4 rows, maxlength 2000, required, hint "Recorded
   with the resolution.").
6. Review (visible): "When you resolve it: the [report / flag] closes; [the travel agent is notified]; you confirm
   readiness again before any filing authorization or packet release."
7. Buttons "Resolve the problem report" / "Resolve the flag" (primary); "Cancel" → OP-02 Work `#holds`.

States (first match):

| State | Condition | Copy |
|---|---|---|
| Not the assigned operator | `viewerAssigned = false` | Frame and items 2–3; §2.0 line; no form |
| Resolved | `state = resolved` | "This [report / flag] is resolved." Link "Back to the application". No form |
| A return | `kind = returned_to_ta` | "A return is closed by the travel agent when they hand the application back or submit it. You do not resolve it." No form |
| Flag not answered | `kind = flagged_to_superadmin`, `responded_at = null` | "A SuperAdmin has not answered this flag yet. You resolve it after the answer." No form |
| Draft | otherwise | Form |
| C1 | `resolutionNote` empty or too long | "Describe how it was resolved." / "Use at most 2,000 characters." Note kept |
| C2 `stale_revision` | resolved meanwhile (another tab, or by a return that closed the report) | "This [report / flag] was resolved since you opened the page. Nothing was recorded." Resolved state; unsent text block |
| C2 `hold_not_operator_closable`, `flag_response_missing` | (raced state) | The state sentences above; unsent text block |
| C3 `resolved` | — | Receipt (§2.11); then the Resolved state |

### 2.5 OP-02 changes (WP-07 page, WP-09 panels)

1. **Frame (WP-07 §2.3 item 4).** When `editor_state = assistance_in_progress`, an info-tone line on every tab, after
   the protected-state banner: "Approved assistance in progress. You may enter information with the travel agent's
   approval, then return it for their review." Link "Enter information" (OP-02a) for the assigned operator.
2. **Action panel (WP-07 §2.4.5), two changes in the closed table (`reading.ts`):**
   - Row 3 splits by `pending.reasonCode` (F-W09-09): 3a `resolve_problem_report` with `hold_problem_reported`: as
     WP-07, plus secondary "Resolve without a return" → OP-02r of the open `prb_` hold. 3b `resolve_problem_report`
     with `hold_flagged_to_superadmin` (Core's rule 10, an answered flag, `derived.ts:328-330`): owner You; step "Read
     the SuperAdmin's response and resolve the flag"; blocker type "Filing authorization and packet release wait until
     you resolve it and confirm readiness again"; action "Resolve the flag" → OP-02r of the open `flg_` hold.
   - New row before row 5: `editor_state = assistance_in_progress` and viewer assigned: owner You; step "Approved
     assistance: enter the information, then return it for the travel agent's review"; action "Enter information" →
     OP-02a; secondary "Return for TA review" → OP-03r. When `offers.startWork` has a `gate1_*` blocker: blocker type
     "A decision can resolve it", owner of the blocker "SuperAdmin", no flag route, the known-gap line (§3.2).
3. **Work tab, section "Holds" (WP-07 §2.4.1 item 5).** Per open hold row, a link instead of the carried form:
   problem report → "Resolve the problem report" (OP-02r) and "Return to TA (closes the report)" (OP-03r
   `?resolve=<prb id>`); flag answered → "Resolve the flag" (OP-02r); flag not answered → text "Waiting for a
   SuperAdmin's response"; return → text "The travel agent hands it back or submits it". The flag row shows the
   response note and "Answered [time] IST".
4. **Application & documents tab (WP-07 §2.5.1).** With approved assistance in progress: the line "Approved
   assistance: you may change the application details, identity details with evidence, and documents." and link
   "Enter information" (OP-02a). Evidence rows stay read only here; the upload form lives on OP-02a.

### 2.6 OP-03r changes (WP-07 page)

WP-07 §2.6.1 stays (labels by `editor_state`; "Return for TA review" while `assistance_in_progress`). WP-09 changes:

1. **Effect text for approved assistance by lifecycle** (F-W09-10). Draft: "The travel agent reviews what you entered
   and submits it themselves. Help never confirms or submits for them." Submitted: "The travel agent reviews what you
   entered and hands the application back to you. The quote and the original estimated window stay as submitted.
   You confirm readiness again before any filing authorization or packet release." Both add: "This ends the approved
   assistance, whether or not you entered information. You stay the assigned operator."
2. **Evidence for approved assistance:** "What the travel agent asked for: [request_note]"; "Information version
   [snapshotVersionNo]"; a link "See the entries in the history" (OP-02h). What exactly changed is not in the read
   (STOP-W09-03).
3. **`resolve` preselection:** a well-formed `prb_` value that equals an open problem report preselects it in
   `resolveProblemHoldId`; any other value is ignored.
4. **Receipt title** (WP-07 §2.11 `returned`): one title "Returned to the travel agent" for both labels; the receipt
   adds "Current: Help request: Ended" when the case's latest help state is `fulfilled`. Reason: no recorded fact
   tells the two returns apart after the command (`editor_state` is `returned_to_ta` for both); the label difference
   is on the form, where the UX requires it (F-W09-11, P2).

### 2.7 SA-09h Decision: help request, kinds `assistance_approve` and `assistance_decline`

Reads: `core.admin_case` (required: `app`, `assistance`, `servicePayment`, `gateExceptions`, `holds`, `names`,
`mark`, `pending`); opt. `ops.case_work` (`workStarted`) only when `active_assignment_id ≠ null`; opt.
`pay.application_payments` (latest entry, open payment follow-ups). The subject is `case.assistance` (Core's latest
request, open first, `store.ts:213-215`); its id travels as hidden `assistanceId`, so Core refuses a stale page
(`assignment.ts:316-318`).

Anatomy (CMP-25 `decisionPage`, UX §7.3 order):

1. Header: breadcrumb (§1.3); `h1` "Approve a help request: [applicant]" / "Decline a help request: [applicant]";
   freshness. Header action link: "Decline instead" (approve page) / "Approve instead" (decline page).
2. `h2` "Scope": "Application [reference] · [service] · Travel agent [name]. Help request [reference]: the travel agent
   asks TravelMudra to enter information with them. This decision answers this one request."
3. `h2` "Evidence": "What the travel agent asked for: [request_note / 'No note was given.']"; Stage (Draft /
   Submitted); Editing (staff words); Operator ("[name]" / "No operator assigned"); Service payment (Gate 1)
   (status words; latest entry "Entry [no], [status], recorded [time] IST", opt.); Gate 1 exceptions of this
   application (table: For, State, Expires [time] IST); "Work on this assignment: Started / Not started /
   Unavailable" (only with an operator); open holds ("Returned to the travel agent since [time] IST", flags, reports);
   "Held after a restore" when `mark ≠ null`.
4. `h2` "Effect of this decision" — approve, by Core facts (closed table; no conclusion about Gate 1 is computed,
   WP-06 D-05):

   | Facts | What this decision changes | What stays unchanged |
   |---|---|---|
   | `active_assignment_id = null` | "The help request becomes approved. The travel agent is notified." "The application waits in Assignment as approved help for an operator." "When an operator is assigned, the editing state becomes 'Operator assistance in progress': the operator may enter information, and the travel agent cannot change the application until the operator returns it for their review." | "It does not assign an operator." "It does not pass Gate 1: assignment needs the service payment recorded as received or a Gate 1 exception for assignment; the operator's first work needs Gate 1 again." "It does not submit the application, confirm the travel agent's authority, record a payment, pass Gate 2, record readiness, or change the price or the original estimate." Draft: "The application stays a draft until the travel agent submits it." Submitted: "Until an operator is assigned, the travel agent can still change the application." |
   | `active_assignment_id ≠ null` | "Approved assistance starts on the current assignment now: the editing state becomes 'Operator assistance in progress' and [operator] is notified." "Core checks Gate 1 for the operator's first work on this assignment at this approval, unless it was already decided for this assignment. It passes on a service payment recorded as received. Otherwise it uses a fresh Gate 1 exception for first operator work once; while the payment is not recorded, that opens a payment-missing follow-up owned by the SuperAdmin who granted the exception." With an open return hold: "The open return to the travel agent closes: the operator enters the information instead." | As the row above, without the assignment sentence, plus "Filing authorization and packet release stay unavailable while assistance is in progress." |

   Both rows end with the known-gap line of §3.2 (interim). Decline: changes "The help request becomes declined. The
   travel agent is notified of the decision."; unchanged "The application, its editing state and its operator stay
   as they are." "Declining does not prevent a later request."
5. Hard stops: none (a help decision is not an exception); the section is left out.
6. `h2` "Your decision": "Reason for approving" / "Reason for declining" (`reason`, textarea 3 rows, maxlength 1000,
   hint "At least 10 characters. Recorded with the decision and shown in the audit history."); hidden
   `assistanceId`, `decision` (`approve` / `decline`), `_rev.application`.
7. Review (visible): approve without operator: "When you approve: the help request is approved; the travel agent is
   notified; the application waits in Assignment for an operator; your name, the reason and the time are recorded."
   Approve with operator: "When you approve: if Gate 1 for the first work passes, assistance starts now for
   [operator]; otherwise nothing is recorded and this page shows the routes." Decline: "When you decline: the help
   request is declined and the travel agent is notified; your name, the reason and the time are recorded."
8. Buttons: "Approve help request" / "Decline help request" (primary); "Cancel" → SA-02b.

States (first match; the `decisionPage` state in brackets):

| State | Condition | Copy and controls |
|---|---|---|
| Closed application [`closed`] | `lifecycle` ∉ {`draft`, `submitted`} | "Help decisions apply only to open applications." Link "Open the application" |
| No request [`closed`] | `assistance = null` | "No help request exists for this application." |
| Decided [`closed`] | `assistance.state` ∈ {`approved`, `declined`, `fulfilled`} | Approved: "This help request was approved." plus "It waits for an operator." (no operator; link "Assign an operator", SA-03a) or "Approved assistance is in progress." Declined: "This help request was declined." Fulfilled: "This help has ended." |
| Draft [`draft`] | `assistance.state = requested` | The form |
| C3 `decided` | — | Receipt (§2.11); then the Decided state |
| C2 `control_blocked` / `gate1_payment_not_received` (approve, in place) | Gate 1 at the first work blocks | Form-level: "Approval needs Gate 1 for the operator's first work on this assignment: the service payment is not recorded as received and no fresh Gate 1 exception for first operator work exists. Nothing was recorded." Routes: "Record a Gate 1 exception for first operator work" (SA-09g `gate1_first_work`), "Record the payment" (SA-07a), "Decline instead". Reason kept |
| C2 `control_blocked` / `application_not_open` | closed meanwhile | Closed state; unsent text block |
| C1 `validation_failed` (reason) | — | "Enter a reason of at least 10 characters." at the field |
| C5 `stale_revision` | decided by another SuperAdmin, a new request, a reassignment, a submission or a travel agent change meanwhile | CMP-14 rows: Help request (you saw "Requested" / current state), Operator (current), Editing (current), Stage (current); reason kept; the form returns only when the request is still `requested` (with the new revision and the effect of the current facts) |

### 2.8 SA-09f Decision: respond to a flag, kind `flag_response`

Reads: `core.admin_case`. The subject is the open `flagged_to_superadmin` hold of the application; Core keeps at most
one open (`holds.ts:157`). The form posts to `/admin/applications/<id>/flags/<holdId>/respond` with that hold's id.

Anatomy:

1. Header: `h1` "Respond to a flag: [applicant]"; freshness.
2. Scope: "Flag raised by [opened_by name] at [opened_at] IST on application [reference] · [service]. Your response
   is a note to the assigned operator."
3. Evidence: "The question: [note]"; Operator now ("[name]" / "No operator assigned"); when `opened_by ≠
   assigned_operator_id`: "The operator who raised this flag is no longer assigned. [Operator now] receives your
   response and resolves the flag. Check that the question still applies." Service payment; gate exceptions (all
   gates: Gate, For, State, Expires); readiness (staff words); external acts (state words); open holds; deferral.
4. Effect: changes "Your response is recorded on the flag, and the assigned operator is notified."; unchanged "The
   flag stays open: only the assigned operator resolves it." "A response records no decision: it grants no
   exception, records no payment, changes no readiness and files nothing." More, "Decisions you may record, each on
   its own page": links "Gate 1 exception for assignment", "Gate 1 exception for first operator work" (SA-09g), "Gate
   2 decision" (SA-09 `gate2_commitment`), "Readiness exception" (SA-09 readiness kinds, when readiness reads
   "recorded by the previous operator"), "Record the payment" (SA-07a), "Reassign" (SA-03c). Each page shows its own
   state.
5. Your decision: "Response to the operator" (`responseNote`, textarea 4 rows, maxlength 2000, required, hint "The
   operator reads this on the application."); "Reason for this response" (`reason`, textarea 2 rows, maxlength 1000,
   hint "At least 10 characters. Recorded in the audit history.").
6. Review (visible): "When you send it: the operator is notified; the flag stays open until the operator resolves
   it; filing authorization and packet release wait until then and until the operator confirms readiness again."
7. Buttons "Send the response" (primary); "Cancel" → SA-02c.

| State | Condition | Copy |
|---|---|---|
| No open flag [`closed`] | no open `flagged_to_superadmin` hold | "No flag is open on this application." |
| Answered [`closed`] | the open flag has `responded_at` | "This flag was answered at [time] IST: [response_note]. The operator resolves it." |
| Draft | the open flag has no response | Form |
| C3 `responded` | — | Receipt (§2.11); then Answered |
| C2 `control_blocked` / `flag_already_responded` | another SuperAdmin answered first | "Another SuperAdmin answered this flag first, at [time] IST: [response_note]. Your response was not sent." Answered state; unsent text block |
| C1 | `responseNote` empty; `reason` short | "Enter your response." / "Enter a reason of at least 10 characters." Values kept |
| C2 `not_found_or_forbidden` | — | Shell (LD-14) |

### 2.9 SA-01, SA-02b, SA-02c and the old SuperAdmin case page

- **SA-02b Help requests (WP-06 §2.2.2).** Lead (D-07): "Travel agents ask TravelMudra to enter information with
  them. On an application with no operator, approving assigns nothing and does not pass Gate 1: assignment and the
  operator's first work still need the service payment recorded, or a Gate 1 exception. On an application that
  already has an operator, approving starts the operator's entry at once, and Gate 1 for the first work is checked
  at the approval." New column "Operator" ("Assigned" / "Not assigned", from `assigned_operator_id`). Row actions
  "Approve…" (SA-09h approve) and "Decline…" (SA-09h decline). Under the lead, the known-gap note (§3.2).
- **SA-02c Flags from operators (WP-06 §2.2.3).** Row action "Respond" → SA-09f when `pending.nextActionCode =
  respond_to_flag`; otherwise "Open" → SA-09f (Answered state).
- **SA-01 (WP-06 §2.1).** Group 4 items: "Approve" and "Decline" links (SA-09h). Group 5 items: "Respond" (SA-09f)
  for items waiting for a response; "Open" otherwise.
- **Old SuperAdmin case page.** Section "Assistance request": facts (state, the travel agent's note) and the two
  links; section "Holds": the table read only, with "Respond" (SA-09f) on an unanswered open flag.

### 2.10 Refusal and copy sentences, closed tables

TA audience (TA-07p). Existing `TA_MESSAGES` stay unless listed.

| Category / code | Sentence | Where |
|---|---|---|
| `conflict_duplicate` / `problem_report_open` | "Your earlier report is still open with your operator. Nothing was sent." | form-level |
| `control_blocked` / `hold_not_applicable` | "The application changed before your report was sent. Nothing was sent." + the current state | form-level |
| `control_blocked` / `application_not_open` | "This application is closed. Nothing was sent." | form-level |
| `validation_failed` (note) | "Describe the problem." / "Use at most 2,000 characters." | field |
| `conflict_operation_key` | "This form was already used with different text. Your text is kept: check it and send again." | form-level |

Staff audience (OP-02a, OP-02r, SA-09h, SA-09f). Existing `CORE_MESSAGES` stay unless listed.

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| entry | `validation_failed` / `correction_no_change` | "Nothing changed: every value you sent is the one on record. Nothing was recorded." | form-level |
| entry | `control_blocked` / `identity_same_person_evidence_insufficient` | "The chosen documents do not show the new identity details with at least two unchanged details of this applicant. Choose the document that shows them, or leave the identity details unchanged." | evidence fieldset |
| entry | `control_blocked` / `gate1_payment_not_received` | The CMP-10 sentence of §2.3 (state "Gate 1 blocks the first work") + the known-gap line | form-level |
| entry | `control_blocked` / `hold_returned_to_ta`, `assistance_not_approved` | "Approved assistance is no longer in progress: [current editing state]. Nothing was recorded." + unsent values | form-level |
| entry | `control_blocked` / `population_out_of_scope` | existing sentence | form-level |
| entry | `control_blocked` / `filing_possibly_occurred`, `correction_historical_after_filing` | existing sentences + "Nothing was recorded." | form-level |
| entry | `validation_failed` field codes of `validateFormFields` | existing field sentences | field |
| resolve | `stale_revision` | "This [report / flag] was resolved since you opened the page. Nothing was recorded." | form-level |
| resolve | `hold_not_operator_closable`, `flag_response_missing` | existing sentences | form-level |
| decide | `control_blocked` / `gate1_payment_not_received` | §2.7 | form-level |
| decide | `stale_revision` | CMP-14 | — |
| respond | `control_blocked` / `flag_already_responded` | §2.8 | form-level |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden` | shell SH-02 (LD-14) | — |

### 2.11 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource | Summary test (establishes the command) | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|
| `problem` | TA-07 | `application`, path id | `holdId` matches `^prb_`. Among a travel agent's commands only `core.report_problem` returns a `prb_` id (`holds.ts:76`; `hand_back` returns none) | Problem report sent to your operator | "Your report changes no application data." | Problem report (open since [time] IST, or "None open"); Editing |
| `entry` | OP-02a | `application`, path id | `correctionId` matches `^cor_` and `stage` ∈ {`applied`, `held`}. Among an operator's commands only the entry returns both (`drafts.ts:147`; the held-correction reapply returns no `stage`, `:204`) | Information recorded (`applied`) / Information held: a filing may have happened (`held`) | `held`: "It applies only after evidence that the act was not filed. The current information is unchanged." | Information version [snapshotVersionNo]; Editing; Gate 1 for the first work |
| `document` | OP-02a | as WP-03 §2.14 `document` | as WP-03 | File received | Document type | Status now (CMP-02) |
| `resolved` | OP-02r | `application`, path id | `holdId` equals the path `holdId`, and the hold selected by that id has `state = resolved` (an operator's return and flag return new ids) | Problem report resolved / Flag resolved (by the hold's kind) | "Your note is recorded with the resolution." | Readiness (staff words) |
| `decided` | SA-09h | `application`, path id | `assistanceId` matches `^ast_` and equals `case.assistance.assistance_id` (only `core.decide_assistance` returns it to a SuperAdmin) | Help request approved (state `approved` or `fulfilled`) / Help request declined (`declined`) | — | Editing; Operator; "Gate 1 for the first work" facts (approve with operator) |
| `responded` | SA-09f | `application`, path id | `holdId` matches `^flg_` and the hold selected by it has `responded_at` (only `core.respond_flag` returns a `flg_` id to a SuperAdmin) | Response sent to the operator | The response (`response_note`), "Answered [responded_at] IST" | Flag: "Open: the operator resolves it"; Operator now |

A receipt whose test fails reads unchecked (WP-01 A-04). A `decided` receipt whose `assistanceId` no longer equals
the latest request reads neutral "Request recorded" with the current facts (WP-06 D-02). No receipt shows an accepted
time before P-10 (b) (S-08).

### 2.12 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| OP-02a entry | `_rev.application` | Each field whose posted value differs from the current snapshot; Editing (current) |
| SA-09h decide | `_rev.application`, `assistanceId` | Help request (you saw "Requested" / current); Operator (current); Editing (current); Stage (current) |
| TA-07p, OP-02r, SA-09f | none (Core takes no revision) | Not CMP-14: the state tables of §2.1, §2.4, §2.8 |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

## 3. The ending of approved assistance, and the interim for the pending Core facts

### 3.1 "Return for TA review": command, fields and design on OP-02

The ending is `core.formal_return` (route `ops.applications.return`, POST `/ops/applications/:id/return`), posted from
OP-03r (WP-07) while `editor_state = assistance_in_progress`. Fields: `note` (what the travel agent must review),
`resolveProblemHoldId` (optional; only when a problem report is open), `_rev.application`. No new command and no new
field.

What Core does (`holds.ts:80-119`): checks the revision and that the application is open; accepts
`editor_state` ∈ {`assigned`, `assistance_in_progress`} with no open return; opens a `ret_` hold; resolves the chosen
problem report; marks approved help `fulfilled`; sets `editor_state = returned_to_ta`; moves the hold revision; posts
the `return_for_correction` notice to the travel agent. The same operator stays assigned. Core does not check Gate 1
here.

What follows (Core): a returned draft goes back by `core.submit` on TA-08 (`submission.ts:155-200`: closes the
return, marks approved help `fulfilled`, `editor_state = assigned`, `via = after_assistance`); a returned submitted
application goes back by `core.hand_back` on TA-08 returned mode (WP-03 §5.6). The operator then confirms readiness
again (the hold revision changed).

Design on OP-02 (no second form for the command, one host page):

| Place | What WP-09 shows |
|---|---|
| OP-02 frame (every tab) | The approved-assistance line with "Enter information" (§2.5 item 1) |
| OP-02 action panel | Row "Approved assistance": primary "Enter information" (OP-02a), secondary "Return for TA review" (OP-03r) (§2.5 item 2) |
| OP-02a section "Finish" | "Return for TA review" button link, with "This ends the approved assistance, whether or not you entered information." (§2.3 item 8) |
| OP-03r (WP-07) | Label "Return for TA review" and h1 "Return for the travel agent's review: [applicant]"; WP-09's lifecycle-specific effect and evidence (§2.6) |
| Receipt | "Returned to the travel agent", Current "Help request: Ended" (§2.6 item 4) |
| TA-07 after the return | WP-03 rows "Returned after approved help (draft)" and "Formally returned (submitted)"; status "Help request: Ended" (§2.2 item 4) |

### 3.2 Interim for D-06 (no route to the first-work Gate 1 decision during approved assistance)

One shared constant (`KNOWN_GAP_FIRST_WORK`, `src/apps/staff/work/reading.ts`) feeds every place, so the switch is
one change:

| Place | Interim text (until S-08 serves P-12 C) |
|---|---|
| OP-02 action panel, OP-02a Gate 1 section, OP-03f "Not assigned state" (WP-07) | "A flag is not available while approved assistance is in progress, and no SuperAdmin queue lists this application yet. Ask a SuperAdmin to record the service payment or a Gate 1 exception for first operator work." |
| SA-09h approve (effect) | "Known gap: if Gate 1 later blocks the operator's first work, no queue lists the application and the operator cannot flag it. After you assign an unpaid application with approved help, record the payment or a Gate 1 exception for first operator work." |
| SA-02b (note under the lead) | The same sentence as SA-09h |
| Receipt `decided` (approve, no operator, payment not recorded) | Current line: "Service payment: not recorded. The operator's first work will need the payment or a Gate 1 exception for first operator work." |

### 3.3 Adoption when the Core batch is served (S-08)

| Served fact | Change | Interim removed |
|---|---|---|
| P-12 C: `core.admin_queue` kind `first_work_gate1` (rows, required `asOf`, `truncated`) | New SA-02 view "First work waiting for Gate 1" (`/admin/queues/first-work`, new GET `admin.queues.first_work`, action `queue.read`); rows: Application, Why it waits (Core sentence), Service payment, actions "Gate 1 exception for first operator work" (SA-09g) and "Record the payment" (SA-07a); freshness from `asOf` ("Read at [asOf] IST"); `truncated = true` → "This list may be incomplete: more applications may wait." New SA-01 group "First work waiting for Gate 1" after group 3 (count "[n] applications", "or more" when truncated). Work queues member and its nav count (`attention.ts`) | SA-02b note; SA-09h known-gap line |
| P-12 C: substituted pending answer (owner `superadmin`, reason `gate1_payment_not_received`, next `grant_or_refuse_gate_exception`, follow-up the operator) | OP-02 panel: row 11 "Waiting on SuperAdmin: a Gate 1 decision for your first work" with "A SuperAdmin sees this application in 'First work waiting for Gate 1'." TA-07: step "TravelMudra decides how the operator's work can start. Nothing is needed from you now." (TA mapping of the next action; a submitted unpaid application keeps the payment step of WP-03 §3.1) | OP-02 and OP-02a known-gap line; OP-03f line becomes the queue sentence (WP-07 §3.3) |
| P-12 C §11.4: the id and failure of an unusable first-work exception in the case context | SA-09g and SA-09h: "The exception on record is [expired / stale / its grantor is not active]: revoke it, then record a new one." with links SA-09r, SA-09g | — |
| P-10 (e): action-specific Gate 1 context (first work) | SA-09h approve with operator: Evidence shows Core's answer ("Recorded for this assignment" / "Passes on the recorded payment" / "A fresh exception is used" / "Blocked") in place of the side-by-side facts; the review sentence names that answer | The conditional review sentence of §2.7 item 7 |
| P-10 (b): command identity and accepted time in `core.operation` | Receipts add "Accepted at [time] IST"; the `returned` receipt keeps one title (the command is the same) | — |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at e9e96e3 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Report (TA-07p) | Same `_op`, same note (double click, browser resend) | Core returns the original result; the same 303 to TA-07 and the same receipt; one report | None | Yes (receipt new) |
| Report | New `_op` while the report is open (second tab) | `conflict_duplicate` / `problem_report_open` → the TA-07p sentence and the "Report already open" state; no second hold | None | Partly (generic sentence) |
| Report | New `_op` after the operator resolved the first | A new report: a new, deliberate fact (Core accepts) | A second report | Yes |
| Entry (OP-02a) | Same `_op` after acceptance | Byte-equal input (D-W09-05) → the original result; same receipt; one correction | None | **No**: the handler diffs identity against a read made at POST time (`ops.ts:444-448`); after acceptance the diff is empty, the content hash differs and the kernel answers `conflict_operation_key` (`command.ts:343`) — the operator sees "already used with different content" for an entry that was recorded (F-W09-02) |
| Entry | New `_op`, same values | `validation_failed` / `correction_no_change` → "Nothing changed…" | None | Partly (sentence "Nothing changed.") |
| Entry | New `_op`, other values | A second correction (deliberate); stale only if the revision moved | A second correction | Yes |
| Resolve (OP-02r) | Same `_op` | Replay; same receipt | None | Yes |
| Resolve | New `_op` after the first resolved it (second tab, or the return closed the report) | `stale_revision` → "resolved since you opened the page"; Resolved state; unsent note | None | Partly (case page with a generic sentence; note lost) |
| Decide help (SA-09h) | Same `_op` | Replay; same receipt | None | Yes |
| Decide help | New `_op` after a decision (another SuperAdmin, or a second tab) | `stale_revision` (request no longer `requested`; revision moved) → CMP-14 "Help request: you saw Requested / current Approved"; "No second decision was recorded." | None | Partly (generic stale sentence) |
| Respond (SA-09f) | Same `_op` | Replay | None | Yes |
| Respond | New `_op` after a response | `flag_already_responded` → Answered state with the recorded response; unsent text block | None | Partly (sentence; typed response lost) |
| Upload (OP-02a) | Same `_op` | The operation key makes the repeated upload safe (DESIGN "Uploads") | None | Yes |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form, state unchanged (C1, C2, C5) | Same page at the POST address, CMP-07 focused, `restorePath` = the GET page | Every typed value; identity evidence checkboxes unchecked | Files (DESIGN "Uploads"; "Choose the file again.") |
| Refused form, state changed (returned, decided, answered, resolved) | The state of the page, the sentence, the unsent text block | The typed text, read only | The form (it no longer applies) |
| Core unreachable before the command | SH-02 neutral unavailable page | — | The form; the reader opens the page again |
| Answer lost | Operation page (CMP-13); "Open the result" → TA-07 / OP-02 / old case page | — | No new submission is offered there |
| Optional read failed | "Unavailable" for its facts (Gate 1 section, documents, payment entry) | Everything else | — |

### 4.3 Stale and concurrent work (the named hostile states)

| Situation | Required behaviour | Today |
|---|---|---|
| **Nth identical report** | §4.1 rows "Report" | Partly |
| **A hold resolved twice** (two tabs; or the operator returns with `resolveProblemHoldId` while OP-02r is open) | Second resolve → `stale_revision` (`holds.ts:202`) → "resolved since you opened the page"; a return that names a report already resolved → `stale_revision` (`holds.ts:99`) → CMP-14 on OP-03r with the current holds | Partly |
| **Help decided while the case was reassigned** (SA-09h open at revision N; another SuperAdmin reassigns to a new operator) | Approve posts `_rev = N` → `stale_revision` (`assignment.ts:317`) → CMP-14 "Operator: you saw [old] / current [new]"; the form returns with the current facts. The effect now names the new assignment; a first-work exception granted for the old assignment has lapsed (freshness checks the active assignment), so the next approval may be refused for Gate 1, with the routes | Partly |
| **Approval while Gate 1 at work is blocked** (assigned, unpaid, no first-work basis, no fresh first-work exception) | Core refuses `gate1_payment_not_received` (`assignment.ts:322-324, 394`); nothing recorded; SA-09h re-renders with the sentence, the two routes and the reason kept. After a first-work exception is recorded, a new approval is accepted; the exception is consumed and a payment-missing follow-up opens, owned by its grantor (stated in the effect, visible on SA-07a) | No (case page with a generic sentence; reason lost; no effect statement) |
| **Flag answered after the operator was replaced** (OP1 flags; SuperAdmin reassigns to OP2; a SuperAdmin answers) | Core accepts (no assignment guard, `holds.ts:165-187`); the notice goes to OP2. SA-09f states before the answer that the raiser is no longer assigned and names OP2. OP2 sees the question and the answer on OP-02 Holds and resolves on OP-02r. OP1's next read is SH-02 | No (no context on the form) |
| **A returned case reported** (operator returns while TA-07p is open) | Core refuses `hold_not_applicable` (`holds.ts:68-69`); TA-07p shows "The application changed before your report was sent. Nothing was sent.", then the Returned state with the operator's note and the correction links, and the unsent text block | Partly (generic sentence; the form path is hidden by the page rule before the race) |
| **Access revoked mid-page** | TA suspended: next request ends the session (sign-in), nothing written, typed text lost (accepted residue, WP-02 Q-W02-12). Operator reassigned while OP-02a or OP-02r is open: the POST is refused `not_found_or_forbidden` (`OPERATOR_ASG`) → SH-02 "no access", nothing written, typed entry lost (accepted residue). Read grant revoked: next read → SH-02. SuperAdmin opens a support view: `/admin` answers 409 | Yes (LD-14 class) |
| Help approved while the travel agent edits a returned application (in-place approval closes the return) | The travel agent's next save is refused (`hold_assistance_in_progress`); WP-03 C-14 keeps the unsent text; SA-09h effect stated the closing of the return before approval | Partly |
| Entry while another tab returned the application for review | `stale_revision` first (`drafts.ts:131`), then the Returned state with the unsent values | Partly |
| Entry while an act was authorized meanwhile (in-place approval on an application with an authorized act) | Core holds the correction (`stage = held`); receipt "Information held: a filing may have happened"; the possibly-filed warning on OP-02a | No (generic "The information was recorded.") |
| Two SuperAdmins answer one flag | First wins; the second: `flag_already_responded` → Answered with the first response | Partly |
| Report after an outcome, while still assigned | Core accepts; TA-07p offers it (Q-W09-02) | No (hidden, `ta.ts:550`) |

### 4.4 Counts, caps and long lists

| Situation | Required behaviour |
|---|---|
| 100 declared form fields on OP-02a | All in one fieldset, in declaration order; the page scrolls; no nested region |
| 20 identity documents | One checkbox each, labelled by requirement type and "of this application" |
| 100 holds on one application (contract cap) | OP-02 Holds lists the open ones; resolved ones are in History; a read beyond the cap fails as the contract fails (no page-side truncation) |
| Notes of 2000 characters, reasons of 1000, applicant names of 400 | Wrap anywhere; quoted notes in `<blockquote>`; `h1` wraps |
| 200 help requests or flags | SA-02b and SA-02c keep WP-06's cap line ("This list shows the oldest 200 …") |

### 4.5 Device and environment

JavaScript off: every page works (plain forms; `<details>` only for secondary content). 320 px and 400 % zoom: one
column, no two-dimensional scroll (AC-04). Keyboard: fields and buttons in reading order; the error summary takes
focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-09

- One `h1` per page; decision and task parts are `h2` (AC-03).
- Every reason or note field names its purpose; no two fields on a page share a label ("What is the problem?", "How it
  was resolved", "Response to the operator", "Reason for this response", "Reason for approving", "Reason for
  declining", "Where the information came from").
- Identity evidence checkboxes are real inputs with visible labels; never prechecked (UX §7.4).
- The approved-assistance label band and the known-gap line are text in the page flow (not live regions); receipts
  announce politely through the WP-01 receipt (AC-09).
- The unsent text block is a `<blockquote>` with a visible heading; it is not a form field, so it is not submitted.
- Every unavailable control has `aria-disabled="true"` and `aria-describedby` to its CMP-10 (AC-13).
- Decision pages: the review is visible text before the button, never inside `<details>` (UX §7.3).

## 6. Proofs V07, BU-21 and BU-22 on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone, ref `ui-revamp-2026-10-12`; it ran
  42cb373 when this design was written). At the WP-09 proof it holds the integrated WP-02, WP-03, WP-06, WP-07 and
  WP-08 pages (package order, PLAN §3).
- Synthetic seed (fact, `catalogue/synthetic/catalogue.json`; WP-06 §6.1, WP-07 §6.1): country Synthetica (SYN);
  offering "SYN Tourist e-visa" (TravelMudra files, ₹3,500); accounts syn-ta-1 to -3, syn-operator-1 to -3,
  syn-superadmin-1 to -3, active; staff with a second factor.
- Sign-in through the LD-11 harness; codes never printed; screenshots allowed. axe at 1440 px and 390 px.
- Each run uses the tag `wp09-[yyyymmddhhmm]`. Synthetic writes only; seeded data is not changed (Q-W09-09).

### 6.2 Setup (synthetic writes, labelled as setup)

Through the rebuilt pages, driven by the harness. TA = syn-ta-1; OP1 = syn-operator-1; OP2 = syn-operator-2; SA1 =
syn-superadmin-1; SA2 = syn-superadmin-2. TA creates group `wp09-[stamp]` in Synthetica (travel +30/+40 days) and adds
four applicants on "SYN Tourist e-visa" (synthetic passports as WP-03 §8.1):

- **P** (report path): submitted; SA1 records "Payment received" (SA-07a, evidence `SYN-WP09-[stamp]`); SA1 assigns
  OP1 (SA-03a); OP1 starts work and confirms readiness (OP-02 Work).
- **H** (help on a draft): draft; TA asks for help on TA-07h ("Please complete the travel purpose with us.").
- **R** (in-place approval): submitted, payment not recorded; TA asks for help on TA-07h; SA1 records a Gate 1
  exception for assignment (SA-09g) and assigns OP2 (SA-03a) while the help request is open.
- **F** (flag after reassignment): submitted; payment received; assigned to OP1; OP1 starts work.

### 6.3 V07: assigned TA reports only; formal return enables correction; same operator reconfirms; approved assistance ends in TA review and submission (B18–B20)

"L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V07-1 | TA, TA-07 of P | Read | Editing "With your operator"; action panel "This application is with your operator. Report the problem so it can be returned for correction."; action "Report a problem"; no "Change the application", no "Check and submit", no help form | L |
| V07-2 | TA, TA-09d of P (by address) | Open | No form; CMP-10 with `awaiting_formal_return`; link "Report a problem" → TA-07p | L |
| V07-3 | Test | Hand-made POST `core.edit_draft` and `core.correct_identity` for P | Refused `awaiting_formal_return`; snapshot unchanged | T |
| V07-4 | TA, TA-07p of P | Read; send "The photo is more than six months old." | Ownership lines and "changes no application data" before the field; receipt on TA-07 "Problem report sent to your operator"; status "Problem report: open since [time] IST"; action panel without an action | L |
| V07-5 | Harness | Resend the report POST (same `_op`); then POST from a TA-07p loaded before step 4 (new `_op`) | First: same 303 and receipt. Second: "Your earlier report is still open with your operator. Nothing was sent."; OP-02 Holds lists one problem report | L |
| V07-6 | OP1, OP-02 of P | Read Work | Banner "problem reported"; readiness row "Not met: a hold is open"; action panel row 3a "Deal with the travel agent's problem report", primary "Return to TA", secondary "Resolve without a return"; OP-04a shows no authorization form | L |
| V07-7 | OP1, OP-03r of P (from the Holds row, `?resolve=`) | Return with "Upload a new photo" | The problem report preselected; receipt "Returned to the travel agent"; the report closed with the return | L |
| V07-8 | TA, TA-07 → TA-09f → TA-08 of P | Replace the photo; hand back | "Returned to you" with the operator's note; TA-08 returned mode; receipt "Handed back to your operator", quote and original estimate unchanged (WP-03) | L |
| V07-9 | OP1, OP-02 of P | Read; confirm readiness | Operator "You" (same operator); readiness "Not met: something changed since it was recorded; confirm it again"; after confirming, "Met: recorded by you" | L |
| V07-10 | SA1, SA-02b | Read | H and R listed; column Operator "Not assigned" (H) / "Assigned" (R); lead states both cases (D-07); the known-gap note | L |
| V07-11 | SA1, SA-09h approve for H | Read; approve with a reason | Scope, evidence (payment "Not recorded", Operator "No operator assigned"), effect "does not assign … does not pass Gate 1" before the reason; receipt "Help request approved"; SA-02a lists H under "Approved help waiting for an operator" | L |
| V07-12 | SA1, SA-09g `gate1_assignment` for H; SA-03a | Record the exception; assign OP1 | Editing "Operator assistance in progress" (SA-03a receipt Current) | L |
| V07-13 | OP1, OP-02 and OP-02a of H | Read | Frame line "Approved assistance in progress"; action panel "Approved assistance…" with blocker "A decision can resolve it", owner SuperAdmin, no flag route, the known-gap line; OP-02a: CMP-10 "Entering information is unavailable until Gate 1 passes…", no form, "Return for TA review" present | L |
| V07-14 | SA1, SA-09g `gate1_first_work` for H | Record | Receipt | L |
| V07-15 | OP1, OP-02a of H | Enter the travel purpose and "Where the information came from" | Label band, the travel agent's note and "What you can change" before the form; receipt "Information recorded"; SA-07a for H: one payment-missing follow-up more (Core's count) | L |
| V07-16 | Harness | Resend the entry POST (same `_op`); then the same values with a new `_op` | First: same 303 and receipt; one `assistance_entry` correction (history). Second: "Nothing changed: every value you sent is the one on record." | L |
| V07-17 | OP1, OP-02a → OP-03r of H | "Return for TA review" with "Please check the travel purpose." | Label and h1 "Return for the travel agent's review"; effect "reviews what you entered and submits it themselves … whether or not you entered information"; no "Submit for TA" anywhere; receipt "Returned to the travel agent" with Current "Help request: Ended" | L |
| V07-18 | TA, TA-07 → TA-08 of H | Read; tick the statements; submit | TA-07 "Returned after approved help" state; Help request "Ended"; TA-08 "An operator entered information with your approval. Check every answer."; statements unchecked until the TA ticks them; receipt "Application submitted", Next "your assigned operator" | L |
| V07-19 | Test | OP1 hand-made POST of `core.submit` on H before step 18; `core.flag` during assistance | Refused (operator has no submit action; `hold_not_applicable` for the flag, the known gap) | T |
| V07-20 | SA1, SA-09h approve for R | Read; approve | Effect row "operator assigned": Gate 1 for the first work checked at approval; refusal "Approval needs Gate 1 for the operator's first work…"; routes SA-09g and SA-07a; reason kept; nothing recorded (help still "Requested") | L |
| V07-21 | SA1, SA-09g `gate1_first_work` for R, then SA-09h approve | Record; approve again | Receipt "Help request approved"; Current Editing "Operator assistance in progress", Operator OP2; SA-07a for R shows the new payment-missing follow-up | L |
| V07-22 | SA1 and SA2, SA-09h for a fresh request (H2, setup as H) | Both open approve; SA1 approves; SA2 declines | SA2: CMP-14 "Help request: you saw Requested / current Approved"; no second decision | L |
| V07-23 | OP1 flags F (OP-03f); SA1 reassigns F to OP2 (SA-03c); SA2 opens SA-09f | Read; respond | Evidence "The operator who raised this flag is no longer assigned. [OP2] receives your response…"; receipt "Response sent to the operator"; OP1's next read of F is SH-02 | L |
| V07-24 | OP2, OP-02 and OP-02r of F | Read; resolve | Action panel row 3b "Read the SuperAdmin's response and resolve the flag"; OP-02r shows question and answer; receipt "Flag resolved"; readiness must be confirmed again | L |
| V07-25 | Harness | Second resolve POST from an OP-02r loaded before step 24 (new `_op`) | "This flag was resolved since you opened the page. Nothing was recorded." | L |
| V07-26 | TA, TA-07p of P after an outcome is recorded (test fixture) | Read | Form offered (Core accepts); a report is accepted | T |
| V07-27 | axe | Every WP-09 page visited | No violation at 1440 px and 390 px | L |

### 6.4 BU-21 to its boundary: help before an application exists, then on a draft

| Step | Actor, page | Observable result | Where |
|---|---|---|---|
| BU21-1 | TA, TA-07h of draft H (V07 setup) | The help request uses the normal path: SA-02b lists it; the decision is on SA-09h | L |
| BU21-2 | SA1, SA-09h for H (V07-11) | No submission, no assignment and no Gate 1 pass follow the approval (effect and receipt); SA-02a "Approved help waiting for an operator"; Gate 1 still required (V07-12, V07-13) | L |
| BU21-3 | Boundary | Help before an application exists: an open intake issue stays in the SuperAdmin import issues (`/admin/intake-incidents`, existing page, WP-18). No help command for an intake issue exists at e9e96e3; BU-P06 belongs to the bulk work (S-W09-02, Q-W09-08) | — |

BU-21 is partly met at WP-09: the draft half passes on `lane-ui`; the first half is the bulk boundary.

### 6.5 BU-22 to its boundary: a TA tries to correct an assigned, not-returned case

| Step | Actor, page | Observable result | Where |
|---|---|---|---|
| BU22-1 | TA, TA-07 and TA-09d of P (V07-1, V07-2) | No edit; the report path names the role that must formally return it ("your assigned operator") and the formal return | L |
| BU22-2 | TA, TA-07p from a bulk link (`?from=import&attempt=<ina>`), test fixture | Breadcrumb and Cancel return to the import page; receipt location keeps the origin | T |
| BU22-3 | Boundary | BU-P07's "Current application changed or edit unavailable" category and its "Report a problem" link are the bulk work's (S-W09-01); a bulk correction cannot change an assigned application (Core `awaiting_formal_return` on the edit path; the bulk lane's proof) | — |

BU-22 is met on the TA-07/TA-09 side at WP-09 (operator named by role until STOP-W09-02); the BU-P07 side is the
bulk boundary.

### 6.6 Proof split

V07 passes when V07-1, -2, -4 to -18, -20 to -25 and -27 pass on `lane-ui` and V07-3, -19, -26 pass as tests. V07-13
records the D-06 interim (known gap shown, no in-product route) until S-08.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: none (WP-09 adds no component file; the unsent text block is a local helper in U2, exported for U1, U3 and
U5 through `src/web/ui/index.ts` by the architect, one line). Phase B: U1 to U6 in parallel. Phase C: U7. The
architect registers gallery modules in `scripts/dev/gallery-pages.ts` and edits `DESIGN.md` once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U1 TA report path** | New `src/apps/shared/pages/problem-report.ts` (TA-07p renderer, states, `purpose`, origin); new `src/apps/edge/core/problem-routes.ts` (GET `ta.applications.problem_form`; POST `ta.applications.report_problem` moved from `src/apps/edge/core/routes.ts`, with receipt location and re-render); `src/apps/shared/core/ta.ts` (action panel rows, aside link, status rows "Help request" and "Problem report and return", receipt expectation `problem`, withdraw link, origin `import`, removal of the report disclosures); `src/apps/shared/pages/prepare.ts`, `src/apps/shared/pages/help-request.ts` (link target; one approved-state string) | New `test/unit/web/problem-report.test.ts` (states in order; form also after an outcome; "Report already open" without a form; Returned state shows the note and the correct links per lifecycle; `purpose=withdraw` prefill; origin kept and unknown values ignored; unsent text block after `hold_not_applicable`); update `test/unit/web/application-workspace.test.ts` (WP-03: the report panel rows; the help labels table including `fulfilled`); BFF test: refused report keeps the note; same `_op` resend answers the same 303 | `scripts/dev/gallery/problem-report.ts` |
| **U2 OP-02a** | New `src/apps/staff/work/assistance.ts` (OP-02a page; GET `ops.applications.assistance_form`; POST `ops.applications.assistance_entry` moved from `src/apps/staff/core/ops.ts`; `postedIdentity(fields)` maps the posted identity values deterministically, no read at POST time; unsent text block helper); `src/apps/staff/intake/routes.ts` (`ops.documents.upload` and `ops.documents.associate`: receipt location to OP-02a and re-render of OP-02a; command input unchanged) | New `test/unit/web/assistance-entry.test.ts` (label band; scope text; states in order; Gate 1 block removes the form and keeps Finish; possibly-filed warning; evidence never prechecked; receipts by `stage`); BFF tests: same `_op` resend after acceptance answers the same 303 (no `conflict_operation_key`); refused entry keeps every typed value; refused upload re-renders OP-02a with the reason at the row. The engineer checks first that Core accepts unchanged identity values in the change set (§9.2 Q-W09-04); if Core refuses them, the unit keeps the diff, records the replay defect and the architect sends a proposal | `scripts/dev/gallery/assistance.ts` |
| **U3 OP-02r** | New `src/apps/staff/work/holds.ts` (OP-02r page; GET `ops.applications.hold_form`; POST `ops.applications.resolve_hold` moved from `src/apps/staff/core/ops.ts`) | New `test/unit/web/hold-resolution.test.ts` (no form for a return, an unanswered flag, a resolved hold, a read-grant reader; flag evidence shows question and answer; receipt test by path `holdId`); BFF: `stale_revision` shows the Resolved state and the unsent note | `scripts/dev/gallery/holds.ts` |
| **U4 OP-02 integration** | `src/apps/staff/work/reading.ts` (row 3 split; assistance row; `KNOWN_GAP_FIRST_WORK`; adoption adapter for S-08); `src/apps/staff/work/workspace.ts` (Holds rows → links; Application & documents assistance line; entry and upload forms removed); `src/apps/staff/work/frame.ts` (assistance line); `src/apps/staff/work/return-flag.ts` (assistance effect by lifecycle; evidence; `resolve` preselection; one receipt title; OP-03f line from the constant) | Update `test/unit/web/operator-reading.test.ts` (row 3a/3b by reason code; assistance row with and without a Gate 1 blocker; no flag route during assistance); `test/unit/web/operator-workspace.test.ts` (frame line on every tab; no entry, upload or resolve form on OP-02); `test/unit/web/return-flag.test.ts` (draft and submitted assistance texts; never "Submit for TA"; preselection only for an open report) | extend `scripts/dev/gallery/workspace.ts` |
| **U5 SA-09 kinds** | New `src/apps/staff/decisions/help-flags.ts` (renderers `assistance_approve`, `assistance_decline`, `flag_response`); `src/apps/staff/decisions/kinds.ts` (three entries, subject `none`); `src/apps/staff/decisions/routes.ts` (kind enumeration; POST `admin.applications.assistance_decision` and `admin.applications.respond_flag` moved from `src/apps/staff/core/admin.ts`, with `decision` → kind mapping, receipts and re-render) | Extend `test/unit/web/decision-kinds.test.ts` (section order; review not in `<details>`; hidden `decision` per kind; effect rows by assignment; no hard-stops section for help); new `test/unit/web/help-flag-decisions.test.ts` (states; changed-operator line on the flag; Gate 1 refusal routes; receipts); BFF: refused approval keeps the reason; `flag_already_responded` shows the Answered state and the unsent text | extend `scripts/dev/gallery/decisions.ts` |
| **U6 SuperAdmin lists and old case page** | `src/apps/staff/queues/pages.ts` (SA-02b lead, column, actions, note; SA-02c actions); `src/apps/staff/home/inbox.ts` (groups 4 and 5 item links); `src/apps/staff/core/admin.ts` (case page: assistance and holds sections read only with links) | Update `test/unit/web/work-queues.test.ts` (help lead covers both cases; two actions per row; Operator column) and `test/unit/web/decision-inbox.test.ts` (item links) | — |
| **U7 Wiring and system tests** | `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts` (new modules); `src/web/route-inventory.ts` (three new GET entries); removal of the moved POSTs from `src/apps/edge/core/routes.ts` and `src/apps/staff/core/ops.ts`; one line in `src/web/ui/index.ts` | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids); carried-form tests of WP-03, WP-06 and WP-07 drop their WP-09 entries; new `test/unit/web/wp09-host-pages.test.ts` (§7.2); the system tests of §7.3 | — |

U1 owns `ta.ts`, `prepare.ts` and `help-request.ts` in WP-09; U4 owns the four WP-07 files; U6 owns the WP-06 list
files and `admin.ts`. U2, U3 and U5 create new files with the moved routes; U7 removes the old copies in phase C, so no
two units edit one file.

### 7.2 Host-page test

`test/unit/web/wp09-host-pages.test.ts` renders TA-07 (assigned; assistance; returned), OP-02 (assistance; problem
report; answered flag) and the old SuperAdmin case page (open request; open flag) fixtures and asserts: TA-07 holds no
form with action `…/report-problem`; OP-02 holds no form with action `…/assistance-entry`, `…/holds/<id>/resolve` or
`/ops/applications/<id>/documents`; the old case page holds no form with action `…/assistance-decision` or
`…/flags/<id>/respond`; each page holds the replacing links of §1.5.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/core-pages.test.ts:214-219` | Request assistance from TA-07 (WP-03 changes it to TA-07h) | none in WP-09 |
| `test/system/core-pages.test.ts:308-318` | Respond form read from the SuperAdmin case page (`formAction(saCase, /…\/respond$/)`); resolve form read from the operator case page | GET SA-09f `/decide/flag_response`; GET OP-02r for the `flg_` hold; allow `&op=` on locations |
| `test/system/core-pages.test.ts:346-351` | Help decision (decline) posted from the case page | GET SA-09h `assistance_decline`; location `…/decide/assistance_decline?done=decided&op=` |
| `test/system/core-pages.test.ts:371-376` | Report posted from TA-07 | GET TA-07p; location `/ta/applications/<id>?done=problem&op=` |
| `test/system/core-pages.test.ts:414-419` | Approve posted from the case page | GET SA-09h `assistance_approve` |
| `test/system/core-pages.test.ts:424-455` | Upload form on the operator case page during assistance | GET OP-02a; the form `#documents`; location `…/assistance-entry?done=document&op=` |
| `test/system/case-rules.test.ts:158-200` | Help decision from the case page; entry from the case page | SA-09h; GET OP-02a for the entry; the refused entry answers 409 on OP-02a |
| `test/system/case-rules.test.ts:260, 279-310, 322, 355-357` | `evidenceField` reads the case page form; `location === ${ops}?done=entry` | Read OP-02a; location `${ops}/assistance-entry?done=entry&op=…` |
| `test/unit/web/routes.test.ts` | Inventory counts | Three new GET rows |

Stay valid: Core-level tests (`test/core/**`), the assignment and Gate 1 assertions of `case-rules.test.ts` (database
facts), `test/unit/nav-counts.test.ts` (counts unchanged in WP-09).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `core.report_problem` | TA-07; BU-P06; WP-09 | TA-07p `/ta/applications/:id/report-problem`; bulk pages link to it (S-W09-01); WP-09 |
| `core.record_assistance_entry` | OP-02; WP-09 | OP-02a `/ops/applications/:id/assistance-entry`; WP-09 |
| `core.resolve_hold` | OP-02; OP-03; WP-09 | OP-02r `/ops/applications/:id/holds/:holdId/resolve`; WP-09 |
| `core.decide_assistance` | SA-02; SA-09; WP-09 | SA-09h kinds `assistance_approve`, `assistance_decline`; listed on SA-01, SA-02b; WP-09 |
| `core.respond_flag` | SA-09; SA-01; SA-02; WP-09 | SA-09f kind `flag_response` (CC-04 delivered); listed on SA-01, SA-02c; WP-09 |
| `core.formal_return` | Note "WP-09 adds 'Return for TA review'" | Note: "WP-07 builds OP-03r with both labels; WP-09 designs the ending path on OP-02 and the assistance effect text" |
| `doc.upload_for_application` | WP-03; OP-02 (ops route) | Ops route hosted on OP-02a (built in WP-09); register WP stays WP-03 |
| `doc.associate` | WP-03; OP-02 (ops route) | Note: "the ops route keeps no form (as at 102e4c9)" |

§5.1 count unchanged: WP-09 5.

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code or earlier design) | Scenario | Design |
|---|---|---|---|---|
| F-W09-01 | P1 | The report form is hidden by a page rule when an outcome is recorded (`ta.ts:548-550`), although Core accepts a report while the application is open (`holds.ts:66-71`) (F-W03-11 carried) | The operator records "Issued"; the visa shows a misspelled name; the travel agent cannot report it while the case stays assigned for delivery | TA-07p by Core's guard facts; Core decides (§2.1, Q-W09-02) |
| F-W09-02 | P1 | The entry handler diffs identity against a read made at POST time (`ops.ts:444-448`); a resend of the same operation after acceptance has another content hash and the kernel answers `conflict_operation_key` (`command.ts:343`) | The operator's first click commits; the browser resends; the page says "already used with different content"; the operator enters the values again and gets "Nothing changed", or changes them and records a second correction | Deterministic mapping from the posted values (D-W09-05; WP-03 C-04 class) |
| F-W09-03 | P1 | Staff refusals lose typed text: resolve note, flag response and reason, help decision reason (`ops.ts:396-401`, `admin.ts:423-425` render without the fields) | A SuperAdmin writes a 900-character response; another SuperAdmin answered first; the page shows an empty form | Re-render with values; unsent text block when the form no longer applies |
| F-W09-04 | P1 | The help decision has no effect statement (`admin.ts:278-285`); an in-place approval checks Gate 1 for the first work, may consume a first-work exception, opens a payment follow-up owned by its grantor, and closes an open return (`assignment.ts:321-340`) | A SuperAdmin approves help on an assigned, unpaid case; a colleague's first-work exception is consumed and a follow-up opens under the colleague's name; the travel agent's open return disappears | SA-09h effect rows by Core facts (§2.7) |
| F-W09-05 | P1 | The flag response form shows neither the question's context nor that the raising operator was replaced (`admin.ts:199-207`) | OP1 asks about Gate 2; the case moves to OP2; the SuperAdmin answers OP1's question; OP2 reads an answer to a question they did not ask | SA-09f evidence names the raiser and the operator now (§2.8) |
| F-W09-06 | P1 | The WP-06 SA-02b lead (WP-06 design §2.2.2) describes help approval without the assigned-application case that D-07 names | A SuperAdmin expects an approval on an assigned unpaid case to pass and is refused without explanation | SA-02b lead and SA-09h state both cases (§2.9) |
| F-W09-07 | P2 | The TA reads `humanize(v.assist.state)` ("Fulfilled") (`ta.ts:569`) | The operator returns without entering anything; the travel agent reads "Fulfilled" and believes the work was done | Closed label table; `fulfilled` → "Ended" (§2.2) |
| F-W09-08 | P2 | The operator's upload refusal shows the shell error page (`src/apps/staff/intake/routes.ts:84-90`, `ctx.fail`/`ctx.respond` without a re-render) | A 6 MB scan is refused; the operator loses the page and the rule | Re-render OP-02a with the reason at the row (§1.4 row 6) |
| F-W09-09 | P1 | WP-07 §2.4.5 row 3 maps `resolve_problem_report` to "Deal with the travel agent's problem report"; Core uses the same next action for an answered flag (`derived.ts:328-330`, rule 10) | A SuperAdmin answers a flag; the operator's panel names a problem report that does not exist; the operator searches the holds and returns the case by mistake | Row 3 split by `reasonCode` (§2.5; Q-W09-06) |
| F-W09-10 | P1 | WP-07 §2.6.1 effect text: "The travel agent reviews what you entered and submits" also for a submitted case; Core confirms a returned submitted case by hand back (`holds.ts:133-135`) | The operator tells the travel agent to "submit"; the travel agent finds no submit control and calls support | Lifecycle-specific texts (§2.6) |
| F-W09-11 | P2 | WP-07 §2.11 names two receipt titles for `returned` with no establishing fact | A replayed receipt shows "Returned for the travel agent's review" for an ordinary return | One title; label difference stays on the form (§2.6 item 4) |
| F-W09-12 | P2 | The resolve form is an inline table-cell form with no effect statement (`ops.ts:162-170`) | The operator resolves a report believing readiness stays valid | OP-02r with effect and review (§2.4) |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W09-01 | P1 | TA-07p as a task page (GET beside the POST), instead of the in-place disclosure WP-03 carries | A refused report re-renders the whole TA-07 with the error inside a closed disclosure on a phone; the travel agent does not find it | Yes: one host page, full-screen on mobile, re-render target |
| Q-W09-02 | P1 | Offer the report by Core's guard facts (open application, `editor_state` ∈ {`assigned`, `assistance_in_progress`}, no open return, no open report) and drop the page-side "outcome recorded" condition | Issued with a wrong name, still assigned for delivery: the travel agent must be able to report it (B18 "report a problem only") | Yes; Core decides at the command; STOP-W09-01 asks for Core's own evaluation (P2) |
| Q-W09-03 | P1 | Two SA-09 kinds for help (approve, decline) with a hidden `decision`, on the application route without a subject (D-W09-03, D-W09-04) | One page with a choice puts the effect after the choice; queue rows carry no `ast_` id, so a subject route cannot be linked from SA-02b | Yes; Core keeps one open request per application and the hidden `assistanceId` guards staleness |
| Q-W09-04 | P1 | Map the entry's identity input from the posted values (the WP-03 C-04 rule), dropping the read at POST time | §4.1 row "Entry, same `_op` after acceptance" | Yes, after the engineer confirms by test that Core treats unchanged identity values as no change (`corrections.ts:120-128` computes changed paths; `requireSamePersonEvidence` returns early with no changed field). If Core refuses them, keep the diff and send a replay-defect proposal |
| Q-W09-05 | P1 | OP-02a hosts the entry and the operator's assistance upload; the upload handler in `src/apps/staff/intake/routes.ts` gets a WP-09 re-render (coordinate with seam v2, S-W09-03) | Without it, the upload stays on OP-02 with a shell error page on refusal, outside the labelled assistance task | Yes; the orchestrator resolves an overlap with the bulk lane's CAP-04 commit on main |
| Q-W09-06 | P1 | Apply F-W09-09 and F-W09-10 to WP-07 now (WP-07 is designed, not built) instead of in WP-09 U4 | Two packages edit the same closed table; WP-07's tests pin the wrong row first | Yes: amend WP-07 before its U0/U3 start; WP-09 U4 then only adds the assistance row and the known-gap constant |
| Q-W09-07 | P1 | OP-02a removes the form when Core's `start_operator_work` evaluation reports a Gate 1 blocker (same gate and action as the first entry, `controls.ts:668-675`) | Without it, the operator types twenty fields and is refused; with it, the page reads one action's evaluation for another action's form (the WP-06 R-05 concern) | Yes: Core names the first assistance entry as first work and uses the same gate action; the section labels exactly what it reads; when the evaluation is absent or unavailable the form shows and Core decides |
| Q-W09-08 | P1 | BU-21 first half (help before an application exists): a bulk-lane command, or BU-P06 copy only ("TravelMudra already owns this issue in its intake queue") | A travel agent with an unmatched passport row looks for "Request help" on BU-P06; no control exists and no command records the request | Route to the bulk lane (S-W09-02); WP-09 records BU-21 as partly met with the boundary |
| Q-W09-09 | P1 | Proof writes on `lane-ui`: four applications per run (P, H, R, F) plus H2, a payment, three Gate 1 exceptions, two assignments, one reassignment, one flag, help decisions, entries and returns | A rerun meets earlier synthetic rows; the proof identifies its rows by the dated group label | Approve; synthetic only; seeded data not changed |
| Q-W09-10 | P2 | `purpose=withdraw` prefill on TA-07p replaces the carried WP-17 disclosure that posts the report | Two forms post one command with different wording | Accept (one host page); WP-17 keeps the rest of the withdraw section |
| Q-W09-11 | P2 | TA-07p keeps the origin through BFF-only hidden fields (D-W09-07) | After a report from an import, the travel agent lands on TA-07 without the way back to the import | Accept |
| Q-W09-12 | P2 | The operator's associate route keeps no form | An operator wants to link a file already in the group during assistance | Accept as at 102e4c9; the travel agent links it on TA-09u after the return |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W09-01 | New GET pages on POST paths: TA-07p, OP-02a, OP-02r | New routes and inventory entries; actions and fields unchanged |
| D-W09-02 | Forms leave TA-07, OP-02, the OP-02 Holds table and the old SuperAdmin case page (§1.5) | Host pages change; system tests change their GET source |
| D-W09-03 | SA-09 kinds `assistance_approve`, `assistance_decline`, `flag_response` on the application route without a subject (WP-06 §2.7.5 planned subject routes `ast`, `flg`) | Kind enumeration only |
| D-W09-04 | Help decision: `decision` becomes hidden, fixed by the kind | Name unchanged; value fixed |
| D-W09-05 | Entry: identity input mapped from the posted values; unchanged identity values are sent unchanged | Command input carries unchanged identity values (Core: no change) |
| D-W09-06 | Success locations carry `&op=` and move to the host pages (report receipt on TA-07) | Locations change |
| D-W09-07 | TA-07p form: BFF-only hidden `from` and `r` or `attempt`, validated as on the GET, never sent to Core | New hidden fields |
| D-W09-08 | The report is offered after an outcome while the case is assigned (current page rule removed) | None (Core decides) |
| D-W09-09 | "Editable scope" is the command's scope; no per-request scope (UI-PLAN A4 "Only that scope is editable" read as the command's scope) | None; a per-request scope would be Kind 2 |
| D-W09-10 | The operator's upload refusal re-renders OP-02a (`src/apps/staff/intake/routes.ts`, rendering only) | Re-render target |
| D-W09-11 | OP-03r accepts `resolve=<prb id>` to preselect the report | Address state (pattern-checked) |
| D-W09-12 | One `returned` receipt title (WP-07 §2.11 had two) | Display only |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W09-01 | Kind 1 | `problemReport: zWireEvaluation \| null` on `core.ta_application` (Core's guard of `core.report_problem` as an evaluation) | D5: the page shows the report by facts that mirror Core's guard (F-W03-11) | 1. Facts exist (editor state, holds, lifecycle). 2. Removes a page-side copy of a guard. 3. Same scope as the case read | State from Core facts; Core refuses at the command. P2 |
| STOP-W09-02 | Kind 1 (existing P-09 item, STOP-W03-03) | The assigned operator's display name on the travel agent's case read | UX §4.3 "who must formally return the case"; BU-22 "identifies operator" | 1. Fact exists. 2. Removes a role-only answer. 3. Needs a scope decision (an operator's name to a travel agent) | "your assigned operator". P2 |
| STOP-W09-03 | Kind 1 | Help request facts on `core.admin_case` (`requested_at`, `decided_by`, `decided_at`, `decision_reason`) and a list of the corrections recorded during the current help (fields, at, by) on the staff and travel agent case reads | UX §4.3 "Returned cases show exactly what changed"; OP-03r evidence; SA-09h "asked [time]" | 1. Columns exist (`core_assistance_requests`, `core_corrections`). 2. Removes a trip to the history. 3. Same scope | History link; information version number. P2 |
| STOP-W09-04 | Kind 1 | Hold facts on `zWireStaffCase.holds` (`responded_by`, `resolved_by`, `resolved_at`, `resolution_note`) | OP-02r and SA-09f name who answered; the `resolved` receipt shows the note | 1. Columns exist (`core_holds`); `names` already carries the accounts. 2. Removes the history trip. 3. Same scope | "Answered [time] IST" without a name; "Your note is recorded". P2 |
| STOP-W09-05 | Seam (bulk lane) | Help on an intake issue with no application (BU-21 first half) | BU-21 | — (a command; Kind 2 if new) | Boundary; Q-W09-08. P1 |

No STOP item blocks the WP-09 main path. No P0 item is open in this design. Kind 2: none requested by WP-09;
STOP-W09-05 becomes one only if the bulk lane chooses a new command.

