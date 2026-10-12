# WP-06 design review: Gate 1 and assignment

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-06
holds commands that change assignment, access to case work and money facts, so a Codex design review applies).
Product base: lane repository at 9efb379 (WP-01 shell and result components, sign-in and status pages, WP-20 public
site). WP-02 and WP-03 are designed and not yet built; this design depends on their unit U0 components (§1.6). This
document writes no product code. Paths in `file:line` form are relative to the lane repository unless they start with
`REC/` (`internal/records/`) or `RM` (lane `research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 9efb379. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** SA-01 Decision inbox (new, `/admin`, the SuperAdmin landing), SA-02 Work queues (assignment view with
  the Gate 1 fact per row and the "operator not active" part, help requests, flags, deferrals), SA-03 Assignment and
  reassignment (one application, the batch plan preview and its per-application result, reassignment with a
  composed preview), SA-07 limited to one application's service payment page (record a payment entry), and SA-09
  decision pages for the Gate 1 exception (two kinds: for assignment, for the operator's first work) and its
  revocation (CC-04). Five WP-06 commands of the register plus `core.reassign`, pulled from WP-12 (Q-W06-01).
- **Page model.** Existing paths stay (LD-03). New GET pages sit on the POST path of their one form
  (`/admin/applications/:id/assign`, `/admin/applications/:id/reassign`). SA-09 gets one generic route family per
  subject: `/admin/applications/:applicationId/decide/:kind` and `…/decide/:kind/:subjectId`; later packages add
  kinds to the enumerations (§2.7.4). No form action changes. Field names do not change; two deviations touch the
  hidden-field protocol (D-W06-04 `gate` and `action` become hidden; D-W06-05 a BFF-only `applicationId` on the
  revoke form).
- **Batch flow (§3).** SA-02 selection (GET, opaque ids in the address) → `core.assignment_plan` preview (exact plan,
  per-application availability now) → confirm posts the previewed plan (`item.N`, `rev.N`, `plan.N`, `operator.N`)
  → 303 to the preview path with `done=plan&op=<key>` → per-application results from the operation summary. Core
  re-checks every row at confirm; the copy says so (F-W06-01).
- **Gate 1 rules the pages state (Core facts, not page rules).** Assignment and reassignment need the service
  payment received or a fresh Gate 1 exception for `assign`; the operator's first work needs it again
  (`start_operator_work`); an exception is single use, expires, lapses when the payment record or the assignment
  changes, and is unusable when its grantor is no longer an active SuperAdmin; using it while unpaid opens a payment
  follow-up owned by the grantor; it never passes Gate 2. Mandatory validations, cut-offs and the exposure ceiling
  read "No exception exists for this control" and have no form.
- **Findings worked (§9.1).** False plan copy ("left out", "Assign 2 of 3"); no per-application result after a
  plan; one generic grant form for every gate and action (an "admin override" in effect); a duplicate grant reads
  "cannot be excepted"; typed input lost on assign, reassign and grant refusals; a page-computed "Due from the travel
  agent"; a configured number ("fifty") in copy.
- **STOP items (§9.4).** No P0. STOP-W06-01 (Kind 2, P2): the exception command takes a reason but no evidence
  reference (UX §6.3 asks for both). STOP-W06-02 (Kind 1, P2): `gateExceptions` lacks grantor, grant time and
  reason. STOP-W06-03 (Kind 1, P2): no reassignment preview read and no transfer set in the result. STOP-W06-04 (Kind
  1, P2, existing RM-A1): decision inbox projection; interim BFF composition of ten reads.
- **Top questions.** Q-W06-01 pull `core.reassign` into WP-06 (P1). Q-W06-02 move the WP-06 forms off the old
  SuperAdmin case page and replace them with links; about 20 system-test call sites change their GET source (P1).
  Q-W06-03 `/admin` becomes the SuperAdmin landing (P1). Q-W06-04 plan result on the preview path (P1). Q-W06-05
  confirm posts every previewed row; copy states the re-check (P1). Q-W06-10 V06 writes on `lane-ui` (P1).
- **V06 on `lane-ui` (§6).** Four new synthetic applications per run (unpaid, paid, excepted, help); proof of the
  queue visibility, the refusals, the exception scope, the per-application plan result, first work under Gate 1,
  payment closing the follow-up, revocation, two SuperAdmins, and the Nth identical confirm. Gate 2 separation is
  shown as Core's gate facts on SA-07 and proven by test (WP-07 builds Gate 2).

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` | §2.1, §2.2, §2.3, §3.1 steps 4–5, §3.2 (approved assistance), §3.3, §6 (all), §7.3 (SuperAdmin decision page, Mobile), §7.4, §8.3, §10.1, §12 V06, V08, V15 |
| `BUILD_SPEC.md` r2 | B10, B11, B18, B19, B20, B26, B27, B29, B33, B35 |
| `UI-PLAN.md` | A (AD-04, AD-10, AD-13), §1, §2.1–2.3, §3.4 SA-01, SA-02, SA-03, SA-07, SA-09, §4.1 steps 4–7, §4.2 assistance, §5.4, §6.4, §7 (K rules; rows Decide help request, Assign operator, Reassign operator, Record service payment, Record gate exception), §8 (CMP-01, CMP-06, CMP-08, CMP-10, CMP-14, CMP-25, CMP-26), §10, §11, §12.1, §12.2 (WP-09, WP-12, WP-14, WP-16, WP-19) |
| `SURFACE-INVENTORY-2026-10-10.md` | §2.4 RM-A1, RM-A2, RM-A3, RM-A8, RM-A10, RM-A11; §2.6; CMD-52, CMD-56, CMD-57, CMD-69, CMD-72; §4 item 3; §5 group A |
| `DECISIONS-2026-10-10.md` | §1.3 (OC-02, OC-04, OC-05), §3.1, §3.2 |
| Lane records | `PLAN.md` §4 (LD-01 to LD-14), §7; `PROPOSALS.md`; `COMMAND-COVERAGE.md` §3, §5, §6; `WP-01.md` §3, §4.1 (A-01 to A-12); `WP-01-design.md` §2.2, §7; `WP-02.md` §3, §4.1 (B-01 to B-14); `WP-02-design.md` (structure; §1.6; §3.10); `WP-03.md` §3, §4.1 (C-02, C-03); `WP-03-design.md` §1, §2.0, §7, §8, §9; `DESIGN.md` |
| Route map (RM) | §1, §2.2 rows D02–D04, D07, D10–D12, D14–D27, D47–D51, D100–D109, D114, D121, D122; §2.3 D01; §3.1, §3.2; §4.3; §5 |
| Code (read models, commands, states) | `src/apps/staff/core/admin.ts`, `src/apps/staff/attention.ts`, `src/apps/staff/views/{cases,pages,routes,text}.ts`, `src/apps/staff/payments/{routes,admin}.ts`, `src/apps/shared/pages/payments.ts`, `src/apps/shared/core/shared.ts` (`optionalView`, `receiptLocation`, `readReceipt`, `answer`, `CORE_MESSAGES`), `src/apps/staff/intake/routes.ts`, `src/web/ui/{results,shell}.ts`, `src/web/route-inventory.ts:216`; contracts `src/contracts/{core,payments,views-cases,operations-work,identity,catalogue}.ts`; Core behaviour only: `src/modules/core/commands/{assignment,gates}.ts`, `src/modules/core/{controls,derived,lists,staff-views}.ts`, `src/modules/payments/commands/service-status.ts`, `src/core-api/bindings/core.ts:376-425, 495-515`, `src/platform/config.ts:140, 147-148` |
| Tests that pin the pages | §7.3 |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry. Route ids of new routes are proposals.

| ID | Page | Path | Status | Reads (one row per query; "opt." = through `optionalView`, LD-14) |
|---|---|---|---|---|
| SA-01 | Decision inbox | `/admin` | **New** (inventory D01 gets id `admin.home`; action `queue.read`) | `core.assignment_queue`, `core.admin_queue` ×3 (`assistance`, `flags`, `deferrals`), `pay.finance_index`, `iam.admin_elevations`, `cat.admin_impact_index`, `intake.admin_incidents`, `ops.admin_incidents`, `views.monitors` — every one opt. (§2.1) |
| (kept) | Monitors | `/admin/monitors` | Kept, not rebuilt; becomes the second tab of Home (WP-14 rebuilds it with SA-08) | `views.monitors` |
| SA-02a | Assignment queue | `/admin/queues/assignment` | Kept, rebuilt | `core.assignment_queue` |
| SA-02b | Help requests | `/admin/queues/assistance` | Kept, rebuilt (list only; the decision stays a carried WP-09 form) | `core.admin_queue {kind:'assistance'}` |
| SA-02c | Flags from operators | `/admin/queues/flags` | Kept, rebuilt (list only; response carried, WP-09) | `core.admin_queue {kind:'flags'}` |
| SA-02d | Deferrals | `/admin/queues/deferrals` | Kept, rebuilt (list only; decision carried, WP-17) | `core.admin_queue {kind:'deferrals'}` |
| (kept) | Import issues, Imports, Documents | `/admin/intake-incidents`, `/admin/intake/attempts`, `/admin/documents/queue` | Kept, not rebuilt (WP-18, WP-18, WP-14; D-W06-10) | — |
| SA-03a | Assign one application | `/admin/applications/:applicationId/assign` (GET beside the POST) | **New** (`admin.applications.assign_form`, action `assignment.assign`) | `core.admin_case`; opt. `ops.case_work`; opt. `pay.application_payments` (receipt only) |
| SA-03b | Assignment plan (preview and result) | `/admin/assignments/selection/preview` | Kept, rebuilt; result mode added (D-W06-06) | `core.assignment_plan`; `core.operation` (receipt, through `readReceipt`) |
| SA-03c | Reassign one application | `/admin/applications/:applicationId/reassign` (GET beside the POST) | **New** (`admin.applications.reassign_form`, action `assignment.reassign`) | `core.admin_case`; opt. `ops.case_work` |
| SA-07a | Service payment of one application | `/admin/applications/:applicationId/payments` | Kept, rebuilt; carried WP-16 forms | `pay.application_payments` |
| SA-09g | Decision: Gate 1 exception | `/admin/applications/:applicationId/decide/:kind`, `kind` ∈ {`gate1_assignment`, `gate1_first_work`} | **New** (`admin.decisions.application`, action `application.read`) | `core.admin_case`; opt. `pay.application_payments`; opt. `ops.case_work` (`gate1_first_work` only) |
| SA-09r | Decision: revoke a gate exception | `/admin/applications/:applicationId/decide/:kind/:subjectId`, `kind` ∈ {`revoke_exception`}, `subjectId` = `gex_…` | **New** (`admin.decisions.application_subject`, action `application.read`) | `core.admin_case` |
| (old) | SuperAdmin case page | `/admin/applications/:applicationId` | Not rebuilt (SA-04, WP-11). WP-06 replaces its assign, reassign, Gate 1 grant and revoke forms with links (D-W06-07, Q-W06-02) | unchanged |

Each new GET route: `params` zod with `applicationId: zWireId('app')`; for SA-09 `kind: z.enum([...])` and, on the
subject route, `subjectId` validated per kind (`zWireId('gex')` for `revoke_exception`); a parse failure is the
uniform 404. `resolve` returns `{ type: 'application', id }` as the POST routes on the same paths do
(`src/apps/staff/core/admin.ts:413`). `admin.home` resolves as `admin.applications.list` does (`{ type: 'self' }`);
the implementer checks the resource type set and uses the queue resource if `self` is refused.

### 1.3 Shell placement (WP-01 §2.2)

| Rail destination | Tab (member) | Pages that pass it as `current` |
|---|---|---|
| Home | Home `/admin` | SA-01. The destination link becomes `/admin` (first registered candidate). WP-06 changes `SURFACE_CONFIG.admin.home` from `/admin/monitors` to `/admin` (`src/web/ui/shell.ts:149`; WP-01 file, one value; the architect applies it, as WP-03 did for `/ta`). `/home` then answers 303 `/admin`. |
| Home | Monitors `/admin/monitors` | the existing Monitors page (unchanged) |
| Work queues | Assignment `/admin/queues/assignment` | SA-02a, SA-03a, SA-03b, SA-03c, SA-09g, SA-09r |
| Work queues | Assistance, Flags, Deferrals | SA-02b, SA-02c, SA-02d |
| Money & exposure | Finance `/admin/finance` | SA-07a (as today, `payments/admin.ts:305`) |

The SA-09 pages pass `/admin/queues/assignment` because every WP-06 entry to them comes from the assignment work.
WP-07 passes `/admin/finance` for its Gate 2 kind. The nav counts do not change (`src/apps/staff/attention.ts:31-35`):
the tabs of Work queues keep their per-member numbers, and SA-01 shows its own counts.

Breadcrumbs: SA-03a, SA-03c, SA-09g, SA-09r read "Work queues › Assignment › [applicant]" with the applicant linking
to the old case page (SA-04). SA-03b reads "Work queues › Assignment". SA-07a reads "Money & exposure › Finance ›
[application title]" as today.

### 1.4 The WP-06 commands and their pages

Field names are the current ones; none changes. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>`
hidden field. "Handler change" lists rendering-only changes; no command input mapping changes.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `core.assign` | `admin.applications.assign` (`/admin/applications/:applicationId/assign`) | **SA-03a** (moved from the queue row and the case page) | `operatorAccountId` | `application` | Refusal re-renders SA-03a with the chosen operator kept; success `receiptLocation('/admin/applications/<id>/assign', 'assigned', key)` |
| 2 | `core.assign_selection` (mode `selection`) | `admin.assignments.selection` (`/admin/assignments/selection`) | **SA-03b** | `item.N`, `rev.N`, `plan.N`, `operator.N` (hidden, N from 0) | — (revision per item in the input) | Success: 303 to the preview path rebuilt from the posted fields, plus `done=plan&op=<key>` (§3.3); refusal re-renders SA-03b (as today, `admin.ts:452-459`) |
| 3 | `core.assign_selection` (mode `round_robin`) | `admin.assignments.round_robin` (`/admin/assignments/round-robin`) | **SA-03b** | as #2 | — | as #2 |
| 4 | `core.reassign` (register: WP-12; Q-W06-01) | `admin.applications.reassign` (`/admin/applications/:applicationId/reassign`) | **SA-03c** (moved from the case page) | `toOperatorAccountId`, `reason` | `application` | Refusal re-renders SA-03c with both values kept; success `receiptLocation('/admin/applications/<id>/reassign', 'reassigned', key)` |
| 5 | `core.grant_gate_exception` (Gate 1) | `admin.applications.grant_exception` (`/admin/applications/:applicationId/gate-exceptions`) | **SA-09g** (moved from the case page) | `gate` (hidden, `gate1_service_payment`), `action` (hidden, `assign` or `start_operator_work`), `reason` | `application` | The handler maps the posted (`gate`, `action`) to the SA-09 kind. Refusal re-renders that kind with the reason kept; success `receiptLocation('/admin/applications/<id>/decide/<kind>', 'granted', key)`. A pair with no WP-06 kind (Gate 2, readiness: only the carried WP-07 form posts them) keeps today's answer (`caseForm`, `admin.ts:423-426`) |
| 6 | `core.revoke_gate_exception` | `admin.gate_exceptions.revoke` (`/admin/gate-exceptions/:gateExceptionId/revoke`) | **SA-09r** (moved from the case page table) | `reason`; `applicationId` (hidden, BFF only, D-W06-05) | — (Core has none; a revoked, used or expired exception answers `stale_revision`, `gates.ts:113-115`) | Refusal re-renders SA-09r from `ctx.fields.applicationId` (pattern-checked); without a usable value, today's answer. Success `receiptLocation('/admin/applications/<id>/decide/revoke_exception/<gex>', 'revoked', key)` with `<id>` from the result resource (`appResult`) and `<gex>` from the path |
| 7 | `pay.record_service_status` (kind `record`) | `admin.payments.record` (`/admin/applications/:applicationId/payments`) | **SA-07a** | `kind`=`record` (hidden), `status` (radio, or hidden when one status applies), `amount`, `eventDate`, `evidence.0.kind`, `evidence.0.id`, `evidence.0.note`, `evidence.1.*`, `reason` | `payment` | Success `receiptLocation(page, 'recorded' \| 'corrected', key)` (the same handler serves the carried correction form, so both codes get an expectation); refusal re-renders as today (values kept, `payments/routes.ts:125-143`) |

Seven rows hold five register commands of WP-06 (§5.1 of the register) plus `core.reassign`. Each command has
exactly one host page in WP-06 for its WP-06 use, so a refusal always re-renders the page it came from.

### 1.5 Carried forms and forms that leave the old case page

Carried (LD-07: a served command keeps its page). Each keeps its current markup, fields, action and success
redirect. The owning package rebuilds it. A unit test lists them by action path (§7.2).

| Command | Owner | Page in WP-06 | Placement |
|---|---|---|---|
| `pay.record_service_status` kind `correction` | WP-16 | SA-07a | Section "Correct the current entry" (today's `confirmDisclosure`, `payments/admin.ts:243-258`) |
| `pay.record_refund`, `pay.exclude_fee` (boundaries, no form today) | WP-16 (CC-08) | SA-07a | Section "Not available in this release" (today's `unavailableActions`, `payments/admin.ts:297-304`) |
| `core.grant_gate_exception` for Gate 2 and the readiness gate | WP-07 | old case page | The existing "Grant a gate exception" disclosure stays with its two selects narrowed to the Gate 2 and readiness values; Gate 1 values leave it (they move to SA-09g). Field names unchanged |
| `core.decide_assistance`, `core.respond_flag` | WP-09 | old case page | Unchanged; SA-02b and SA-02c link to `#assistance` and `#holds` |
| `core.decide_deferral` | WP-17 | old case page | Unchanged; SA-02d links to `#deferral` |

Forms that leave the old case page (`src/apps/staff/core/admin.ts:219-276`) and the queue rows (`:104-109`):
`core.assign` (row disclosure and case section), `core.reassign` (case section), `core.grant_gate_exception` with
a Gate 1 value, `core.revoke_gate_exception` (table cells). The case page keeps the facts and gets links: section
"Assignment" shows "Operator: [name]" or "No operator assigned" and one link "Assign an operator" (SA-03a) or
"Reassign" (SA-03c); section "Gate exceptions" keeps its table read only with a "Revoke" link per granted row
(SA-09r) and two links "Gate 1 exception for assignment" and "Gate 1 exception for first operator work" (SA-09g).
Reason: one host page per command for its use (WP-02 decision Q-W02-02: one decision page per kind).

### 1.6 Shared components

Reused, no new variant: WP-01 §7 CMP-07 (`errorSummary`, form-level items), CMP-08 (`operationReceipt` with
`items`, `receiptLocation`, `readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`,
`unavailableButton`), CMP-12 (`freshness` on `pageHeader`), CMP-13 (operation status page), CMP-14
(`staleComparison`). WP-02 U0: CMP-25 `decisionPage` (Scope → Evidence → Effect on new and existing work → Your
decision → Review → buttons; states draft, unavailable, already decided, stale), CMP-01 `actionPanel`,
`statusFacts`. Existing parts: `dataTable`, `summaryList`, `choiceGroup`, `selectField`, `textareaField`,
`checkboxField`, `confirmDisclosure`, `disclosure`, `identifier`, `timeAt`, `paymentBadge`, `gateBadge`,
`signedInPage({ restorePath })`.

Dependency: WP-06 builds after the WP-02 U0 commit (`src/web/ui/decision.ts`, `src/web/ui/panels.ts`). If U0 is
not integrated, WP-06 waits; it MUST NOT build a second decision frame.

New in WP-06 (unit U0, §7.1):

- **CMP-06 Queue table** (`queueTable`, `src/web/ui/queues.ts`). A `dataTable` of application rows with: a stable
  row identity (the application reference, `identifier` with copy); the applicant as a link to the case page
  (`/admin/applications/<id>`; system tests select it, §7.3); the service; Core's reason sentence; named fact
  columns supplied by the page; one action link per row; an optional selection checkbox per row. States: rows;
  empty (S2, the page's copy); no match (S3, "No application matches this filter." + "Clear the filter"); at cap
  (a line "This list shows the oldest [cap] [unit]. More may be waiting."). Accessibility: header cells; each
  checkbox labelled "Select [applicant], application [reference]" (AC-15); row text before secondary metadata on
  narrow screens (AC-21).
- **CMP-26 Batch selection bar** (`batchBar`, same file). Below the table, never fixed. Holds the plan inputs
  (§2.2.1) and the line "[n] selected on this page" (an `output` element the script updates and the polite region
  announces; without JavaScript the line reads "Selected applications are listed on the next page."). No
  "select all" without JavaScript; with JavaScript one "Select every application on this page" checkbox. It never
  selects rows that are not on the page.
- **Inbox group** (`inboxGroup`, same file). `h2` title; count line (count with unit, or "Unavailable", or "[cap]
  or more"); optional "in total" line from an authoritative total; up to five item lines; one link "Open [queue]".

## 2. Page specifications

### 2.0 Rules common to every WP-06 page

- **Freshness (LD-08).** Every WP-06 read is authoritative. Pages show CMP-12 "Read at [time] IST". Exception: the
  SA-01 group "Result send and completion waiting" reads `views.monitors.pendingBoundary`, a projection count; that
  group carries its own lag line ("Up to date when read at …", "Behind by [n] s when read at …", "Freshness
  unavailable"). No page applies its own age threshold.
- **Page states.** S1 Loading: pages are rendered complete by the server; no skeleton exists. S5 Stale: only the
  SA-01 boundary group (above). S6 Denied and S7 Error: the SH-02 pages of WP-01 (uniform 404 without object facts;
  Core unreachable: WP-01 A-09 / WP-02 B-03 neutral wording "TravelMudra is unavailable now"; "Nothing was sent,
  so nothing changed" only after a proven refusal). Each page below lists only S2, S3, S4 and its variants.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders "Unavailable" in place of
  each fact the read supplies. Every other refusal reaches the shell. No page code catches every error.
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>` (`receiptLocation`); CMP-08 first in
  `main`, its title first in the document title (`receiptDocumentTitle`); recorded facts only from the operation
  summary and from records selected by the ids it returns; every later read labelled "Current" (WP-02 B-02, WP-03
  C-03). REJ: the host page re-rendered at the POST address with `restorePath` = the GET page, the category's
  status, CMP-07 focused, every typed value kept; refusal sentences from the closed table (§2.10); an unknown code
  shows the category text plus "Reference code: [code]". C5: CMP-14 (§2.9). UNR: 303 to `/admin/operations/<key>`;
  the page MUST NOT offer a new submission of the same intent.
- **K rules.** `core.assign`, `core.reassign`, `core.grant_gate_exception`, `core.revoke_gate_exception`,
  `pay.record_service_status`: K-STD. `core.assign_selection`: K-BATCH (UI-PLAN §7). A form carries one `_op` from
  page load; a browser resend reuses it; a re-render after a refusal issues a new `_op` (a refused command records
  nothing, B35).
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic"
  (CR-08). Forbidden: "Override", "Admin override", "Approved" or "Ready" as an overall status, "Something went
  wrong", "Pay now". A Gate 1 exception is never called a payment, an approval or a waiver. No configured number
  (batch size, exception lifetime) appears in copy; the page states only values that a read returns (WP-01 Q-13).
  All copy is draft (CR-09).
- **Support view.** None of these pages is reachable in a support view (`/admin` answers 409 `support_view_active`,
  RM §1 item 4).
- **Mobile (< 768 px).** One column. Identity, status facts and the next action come before details (AC-21). Queue
  rows become labelled cards. SA-03 and SA-09 are full-screen task pages: scope and effect before fields (UI-PLAN
  SA-09 mobile). The primary action sits at the end of the form, never in a fixed bar.

### 2.1 SA-01 Decision inbox `/admin`

Purpose: show which decision or assignment unblocks work (UI-PLAN SA-01; UX §6.2 Home). The page composes existing
reads in the BFF (inventory RM-A1 interim). It decides nothing and computes no business fact: each count is the
length of a Core list, a partition of that list by a Core field (`pending.reasonCode`, `pending.nextActionCode`,
`servicePayment`, `assigned_operator_id`), or a count Core computes (`views.monitors`).

Anatomy (reading order):

1. Header: `h1` "Decisions waiting"; lead "Work that waits for a SuperAdmin, read from the records now. Counts of
   different things are never added together."; freshness "Read at [time] IST".
2. Primary action: "Open [title of the first group with work]" (a button link to that group's first item, or to its
   queue when the group has no item list). When no group has work and no group is unavailable: no primary action.
3. Groups with work or an unavailable count, as `inboxGroup` sections in the fixed order below.
4. Section "Nothing waiting now": one line per group whose count is a known zero ("[Group title]: none").

Fixed order and sources (WP-06 builds every group whose read exists; later packages change only their own group's
link target when they rebuild the target page):

| # | Group (h2) | Read (all opt.) | Count, unit | Lines | Link |
|---|---|---|---|---|---|
| 1 | Applications whose operator is not active | `core.assignment_queue` rows with `assigned_operator_id ≠ null` (Core lists these only when the operator is not active, `lists.ts:84-98`) | "[n] applications" | up to 5 items: applicant, service, "Reassign" → SA-03c | SA-02a `#operator-not-active` |
| 2 | Submitted applications waiting for an operator | `core.assignment_queue` rows with `assigned_operator_id = null` and `pending.reasonCode` ∈ {`awaiting_assignment`, `gate1_payment_not_received`} | "[n] applications"; then "Service payment received: [a] applications" and "Service payment not received or not recorded: [b] applications" (partition by `servicePayment`) | up to 5 items: applicant, service, service payment, "Assign" → SA-03a | SA-02a |
| 3 | Approved help waiting for an operator | rows with `pending.reasonCode = assistance_approved` | "[n] applications" | up to 5 items | SA-02a |
| 4 | Help requests to decide | `core.admin_queue {assistance}` | "[n] help requests" | up to 5 items: applicant, service, service payment | SA-02b |
| 5 | Flags from operators | `core.admin_queue {flags}` | "[n] flags open"; "Waiting for your response: [r] flags" (rows with `pending.nextActionCode = respond_to_flag`) | up to 5 items | SA-02c |
| 6 | Deferrals | `core.admin_queue {deferrals}`; `views.monitors.deferralReviewsDue` | "Proposed, to decide: [p] deferrals" (`pending.reasonCode = deferral_proposed`); "Reviews due: [d] deferrals" | up to 5 proposed items | SA-02d |
| 7 | Second approvals | `pay.finance_index.requests`; `iam.admin_elevations.open` | "Ceiling increase requests: [c]"; "SuperAdmin elevation requests: [e]"; each with "[k] of them requested by you: a different SuperAdmin decides those." (requester id equals the viewer's account; presentation of the record, not a permission) | — | `/admin/finance`, `/admin/elevations` |
| 8 | Offering impact decisions | `cat.admin_impact_index.rows` with `open_items > 0` | "[n] impact assessments with items to decide" | up to 5: offering title, assessment no. | `/admin/catalogue/impact` |
| 9 | Import issues | `intake.admin_incidents.incidents` | "[n] import issues open" | — | `/admin/intake-incidents` |
| 10 | Incidents | `ops.admin_incidents.incidents` filtered by `readerActsOn(i, incidentReaderOf(ctx,'admin'))` (the nav count's rule, `attention.ts:36-39`) | "[n] incidents need a SuperAdmin" | — | `/admin/incidents` |
| 11 | Payment follow-up | `views.monitors.unpaidOverrides`, `.unownedWaits.followUpOwnerInactive` | "[n] follow-up items open"; "Oldest opened [time] IST"; "Accountable SuperAdmin not active: [k] items" | — | `/admin/queues/financial-follow-up` |
| 12 | Uncertain external results | `views.monitors.externalUncertainty` | "Acts whose filing is unknown: [n]"; "Acts closed with reconciliation exhausted: [n]"; "Government fees whose payment is unknown: [n]"; "Document emails with an uncertain result: [n]" (null → "Unavailable") | — | `/admin/applications?filing=unknown`, `/admin/finance` |
| 13 | Result send and completion waiting | `views.monitors.pendingBoundary` (projection) | "Waiting on a result send: [n] applications"; "Waiting on a completion request: [m] applications" | lag line (§2.0) | — |
| 14 | Travel dates | `views.monitors.travelDateRisk` (null → "Unavailable"), `.travelRechecksPending` | "At risk for their travel dates: [n] applications"; "Travel-date rechecks pending: [n] applications" | — | `/admin/applications?recheck=pending` |
| 15 | Protection marks after a restore | `views.monitors.activeProtectionMarks` | "[n] applications held by a protection mark" | — | — |
| 16 | Reporting gaps | `views.monitors.reportingGaps` | "Derived views not current: [n]" with names; "Measures with cases missing a value: [n]"; "Measures with no data source yet: [n]" | — | `/admin/system/projections`, `/admin/measures` |

Group 13 copy (LD-04): "Sending the result and requesting completion are the assigned operator's explicit steps.
They are not available in this release. [n] applications wait on a result send and [m] on a completion request."
It MUST NOT say that an owner still has to choose the trigger. The existing Monitors callout says "have no product
trigger in this build" (`src/apps/staff/views/cases.ts:265`); it stays until WP-14 rebuilds Monitors (F-W06-09).

Caps (D7). A list read at its contract maximum shows "[max] or more" in place of an exact count: assignment queue
and admin queues 200 (`lists.ts:97, 110`), import issues 500, incidents 500. Groups 1 and 2 add an "in total" line
from `views.monitors.unownedWaits` (`assignedOperatorInactive`, `superadminQueue`) when that read succeeds:
"[n] in total". The two sources are read in the same request; the page states both and adds neither.

| State | Copy |
|---|---|
| S2 nothing waits | Every group is in "Nothing waiting now"; a line above it: "Nothing waits for a SuperAdmin now." No "All done". |
| S4 one read unavailable | That group shows "Unavailable" as its count and "This count cannot be read now." with its link; it stays in the fixed order among the groups with work; other groups are unaffected |
| S4 a monitors field null | "Unavailable" for that line only |
| Every read unavailable | Each group "Unavailable"; no primary action; the page still renders (it is a landing page) |
| Access refusal of any read | The shell's page (LD-14), never the earlier groups |

Mobile: groups stacked; counts before item lines.

### 2.2 SA-02 Work queues

#### 2.2.1 SA-02a Assignment queue `/admin/queues/assignment`

Anatomy:

1. Header: breadcrumb "Work queues"; `h1` "Assignment"; lead "Submitted applications, approved help and work whose
   operator is no longer active. Nothing is assigned until you confirm it, one application at a time or as a
   previewed plan."; freshness.
2. Receipt: none on this page (assignment receipts are on SA-03a, SA-03b and SA-03c).
3. Rule notice (info, not a boundary): "Assignment needs Gate 1: the service payment recorded as received, or a
   Gate 1 exception for that application. Assignment is not a payment and moves no original. Approving help does
   not pass Gate 1."
4. Filter (GET, enumerated, SH-R06): "Service payment" = Any / Received / Not received / Not recorded (`payment` =
   `received` | `not_received` | `unrecorded`); "Apply"; "Clear the filter" when set. The BFF filters Core's rows
   by `servicePayment` (presentation of a Core field). An unknown value is ignored.
5. Section "Waiting for an operator" (`id="waiting"`): `queueTable` of rows with `assigned_operator_id = null`.
   Columns: Select (checkbox `item` = application id); Application (applicant link `/admin/applications/<id>`,
   service, group link `/admin/groups/<id>`, reference); Why it waits (`sentence(pending.reasonCode)`); Service
   payment (Gate 1) (`paymentBadge(servicePayment)` text: "Received", "Not received", "Not recorded");
   Action: "Assign" → SA-03a. When `servicePayment ≠ payment_received`, the action cell also holds "Record the
   payment" → SA-07a and "Gate 1 exception" → SA-09g `gate1_assignment` (links, not forms).
6. Batch bar (CMP-26) under the table, inside the GET form `action="/admin/assignments/selection/preview"`:
   "How to assign" radio `mode` (none preselected, `required`): "One operator for every selected application"
   (`selection`) / "Round robin over several operators" (`round_robin`, hint "Application 1 goes to the first
   operator you tick, application 2 to the second, and so on, in the order of this list."); "Operators" checkbox
   group `operator` (from `operators`, Core's assignable operators: active, with a second factor); button "Preview
   the plan". The selection line of CMP-26.
7. Section "Operator no longer active" (`id="operator-not-active"`): rows with `assigned_operator_id ≠ null`.
   Columns: Application; Why it waits ("The assigned operator is no longer active."); Service payment (Gate 1);
   Action "Reassign" → SA-03c. No selection checkbox (Core has no batch reassignment).
8. Cap line when `rows.length = 200`: "This list shows the oldest 200 applications. More may be waiting; they appear
   as these are assigned."

Prefill (D-W06-08): the page reads `item`, `mode` and `operator` from its own address (well-formed ids only, bounded
as `planRequest` does, `admin.ts:139-145`) and checks those boxes, so "Change the selection" from SA-03b returns
with the selection kept. Ids not in the current rows are ignored and not echoed.

| State | Copy |
|---|---|
| S2 | "Nothing waits for an operator. Submitted applications, approved help and work whose operator is no longer active appear here." |
| S3 | "No application matches this filter." + "Clear the filter" |
| No assignable operator (`operators` empty) | CMP-10 in place of the batch bar: "Assigning is unavailable until an operator account is active and has set up its second factor. Owner: SuperAdmin." Route "Accounts & access" (`/admin/accounts?role=operator`). Row "Assign" links stay (SA-03a shows the same notice) |
| S4 unknown reason code | Core's sentence fallback (`sentence`) with the code as a reference |

Mobile: each row a card (applicant, why, service payment, actions); the batch bar after the list.

#### 2.2.2 SA-02b Help requests `/admin/queues/assistance`

`h1` "Help requests"; lead "Travel agents ask TravelMudra to enter information with them. Approving help does not
assign an operator and does not pass Gate 1: assignment and the operator's first work still need the service
payment recorded, or a Gate 1 exception." `queueTable` columns: Application; Status of the application
(`progress` text); Service payment (Gate 1); Action "Decide" → `/admin/applications/<id>#assistance` (carried
WP-09 form). S2: "No help request waits for a decision." Cap line at 200.

#### 2.2.3 SA-02c Flags from operators `/admin/queues/flags`

`h1` "Flags from operators"; lead "An assigned operator asks a SuperAdmin to decide something on an application. The
operator keeps the case." Columns: Application; Waiting for ("Your response" when `pending.nextActionCode =
respond_to_flag`, else "The operator, after your response"); Action "Respond" → `/admin/applications/<id>#holds`
(carried WP-09). S2: "No flag is open."

#### 2.2.4 SA-02d Deferrals `/admin/queues/deferrals`

`h1` "Deferrals"; lead "An operator proposes to pause work until a review date. A deferral is not a refusal and not
a completion." Columns: Application; State ("Proposed: to decide" for `deferral_proposed`; "Approved: review
running" for `deferral_active`); Action "Decide" → `/admin/applications/<id>#deferral` (carried WP-17). S2: "No
deferral is proposed or running."

#### 2.2.5 Views that WP-06 does not build

Import issues stays the existing page: its renderer is the shared intake renderer that the bulk lane also changes
(`src/apps/shared/pages/intake.ts`; SEAM-CONTRACT), and its dismiss form is WP-18 (D-W06-10). Documents (WP-14,
CC-01) and Imports (WP-18) stay. Dependency waits, delivery and closure ownership (OD §2, V15) are WP-10 and WP-19
views; WP-06 adds no tab for them.

### 2.3 SA-03a Assign one application `/admin/applications/:applicationId/assign`

Full-screen task page. Reads `core.admin_case` (case facts, `operators`, `assignOffer`, `servicePayment`,
`gateExceptions`, `assistance`, `names`); opt. `ops.case_work` (`incidents`, for the duties line).

Anatomy:

1. Header: breadcrumb; `h1` "Assign an operator: [applicant]"; meta: Application reference (copy), Service
   (`offering.title`), Group (link), Travel agent (`names[ta_account_id]`), "Synthetic" when synthetic; freshness.
2. Receipt (`assigned`). The exception receipt stays on SA-09g.
3. Status facts (`statusFacts`): Progress; Operator ("None" or name); Service payment (Gate 1) (`servicePayment`);
   Help request (`assistance.state`: "Requested", "Approved", "Declined" or "None"); Next ("[owner]: [reason
   sentence]").
4. `h2` "Can this application be assigned now": Core's evaluation `assignOffer`:
   - `allowed = true`: "Yes. TravelMudra checks again when you assign." When a Gate 1 exception for `assign` is
     granted (`gateExceptions` row `gate1_service_payment`/`assign`/`granted`) and the payment is not received:
     "Gate 1 rests on the exception granted until [expires_at] IST. Assigning uses it. While the payment is not
     recorded, a payment follow-up opens, owned by the SuperAdmin who granted it."
   - `allowed = false`: one line per blocker (`sentence(code)`), grouped: "Gate 1" (`gate1_payment_not_received`,
     `gate_exception_stale`, `gate_exception_expired`, `gate_exception_grantor_inactive`) with the routes "Record
     the payment" (SA-07a) and "Decide a Gate 1 exception for assignment" (SA-09g); "Other blockers" (every other
     code), with "A Gate 1 exception does not pass these." The grouping uses the Gate 1 code set of
     `src/modules/core/controls.ts:627-641`, a closed table in the page, not a rule the page applies.
   - `assignOffer = null` (already assigned or closed): the fact ("Already assigned to [name]." with "Reassign" →
     SA-03c; or "This application is closed.").
5. `h2` "Duties the operator takes on": "The operator becomes the one accountable operator of this application."
   Approved help: "Help is approved: the operator enters information with the travel agent's approval. The first
   entry needs Gate 1 again." Incidents (opt. `ops.case_work.incidents`, open): "Open incidents of this application
   move to the operator: [n] incidents." (`Unavailable` when the read fails.) Originals: "Assignment moves no
   original."
6. `h2` "Your decision" (only when `assignOffer.allowed = true`): `selectField` "Operator" (`operatorAccountId`,
   options `operators` as "[display name]", placeholder "Choose an operator", none preselected; after a refusal the
   typed choice stays selected when it is still in the list); hidden `_rev.application`.
7. Review (visible): "When you assign: [chosen operator] becomes the operator of this application at once and is
   notified. The travel agent can no longer change the application and can report a problem instead. Assignment
   records no payment and moves no original."
8. Buttons: "Assign" (primary); "Cancel" → SA-02a.

| State | Copy and controls |
|---|---|
| Not assignable, Gate 1 only | CMP-10 in place of the fields: "Assigning is unavailable until the service payment is recorded as received or a Gate 1 exception is granted for this application. Owner: SuperAdmin." Routes as item 4. `unavailableButton` "Assign" (AC-13). No form |
| Not assignable, other blockers | CMP-10 with the blocker sentences; no form |
| No assignable operator | As SA-02a; no form |
| C3 `assigned` | 303 here: receipt "Operator assigned" (§2.8). The page then shows the "already assigned" state |
| C2 | §2.10; operator choice kept |
| C5 | §2.9 |

### 2.4 SA-03b Assignment plan `/admin/assignments/selection/preview`

#### 2.4.1 Preview mode (no `done`)

Reads `core.assignment_plan {mode, applicationIds, operatorIds}` from the address (`planRequest`, bounded and
pattern-checked). Absent `mode`: no read; the page shows the form-level item "Choose how to assign: one operator for
every application, or a round robin." with "Change the selection" (D-W06-08; today an absent mode silently means
`selection`, `admin.ts:141`).

1. Header: breadcrumb "Work queues › Assignment"; `h1` "Assignment plan: one operator" / "Assignment plan: round
   robin"; freshness.
2. Problems (`problems`, Core's): CMP-07 form-level items from `PROBLEM_TEXT` (`admin.ts:64-69`), with
   `assignment_batch_too_large` reworded "Too many applications for one plan. Choose fewer." (F-W06-08); link
   "Change the selection" (SA-02a with `item`, `mode`, `operator` prefilled). No plan table.
3. `h2` "Scope": "[n] applications selected on the queue page." "Operators: [names in the chosen order]". Round
   robin: "Application 1 goes to the first operator, 2 to the second, and so on." "Each application gets its own
   operator and its own result. Nothing is assigned as a group."
4. `h2` "Evidence": the plan table. Columns: Order (1…n); Application (applicant, service); Operator
   (`names[operatorId]`, else "Not an assignable operator"); Assignable now ("Yes" or "Not now: [blocker
   sentences]" with the route links of SA-03a item 4 for a Gate 1 blocker). Line above the table: "Assignable now:
   [a] of [n] applications." (count of Core's `allowed`).
5. `h2` "Effect": "Assignment is not a payment and moves no original. An application whose Gate 1 rests on an
   exception uses it; while its payment is not recorded a payment follow-up opens, owned by the SuperAdmin who
   granted the exception. The operator's first work on an unpaid application needs the payment, or another Gate 1
   exception."
6. Review (visible, F-W06-01): "When you confirm, TravelMudra checks every application of this plan again. An
   application that is assignable then is assigned to the operator shown, also one that was not assignable when
   you previewed it (for example because its payment was recorded since). One that is not assignable stays
   unassigned, and the result says why."
7. Form (when `a ≥ 1`): action `/admin/assignments/round-robin` or `/admin/assignments/selection` (as today,
   `admin.ts:163-169`); hidden `item.N` (= `rows[N].applicationId`), `rev.N` (= `rows[N].revision`), `plan.N`
   (= `rows[N].operatorId`), `operator.N` (= the address operators in order). Button "Confirm the plan for [n]
   applications" (primary); "Change the selection" (secondary link).

| State | Copy |
|---|---|
| `a = 0` | CMP-10: "None of these applications can be assigned now. Each row says why." No form; "Change the selection" |
| C2 whole plan refused (`control_blocked`) | Re-render (today `planAgain`) with a re-read plan; form-level item "Nothing in this plan was assigned. Each application's current state is shown below." The code sentence is not shown for `already_assigned` without blockers (F-W06-11: Core reports an all-stale plan with that code, `assignment.ts:207-208`) |
| C2 `round_robin_plan_mismatch`, `input_invalid` | "The plan changed after the preview. Preview it again." + "Preview again" (GET of the same address) |
| C2 `operator_not_assignable` (selection mode, every row) | "The operator you chose can no longer be assigned (not an active operator with a second factor). Nothing was assigned." + "Change the selection" |

#### 2.4.2 Result mode (`done=plan&op=<key>`)

The confirm handler answers 303 to `receiptLocation('/admin/assignments/selection/preview?mode=<mode>&item=<item.0>…&operator=<operator.0>…', 'plan', key)`,
built from the posted fields in their posted order (D-W06-06). The GET reads `readReceipt` with the expectation of
§2.8 (`plan`) and, for names and operators, `core.assignment_plan` with the same address.

1. Receipt "Assignment plan confirmed" (accepted only): facts "Assigned: [assigned] applications", "Not assigned:
   [refused] applications"; `items`: one line per address item i, in order: label "[applicant] — [service]"
   (from the re-read row i), recorded = `summary['item'+i] = 'assigned'`, result "Assigned to [operator of row i]"
   or "Not assigned: [sentence(code)]" (`stale_revision` → "Changed since your preview. Not assigned.").
2. `h1` "Assignment plan: result". No confirm form in result mode, also when the receipt is unchecked.
3. Next steps: "Plan the [k] unassigned applications again" → SA-02a with those `item` ids, `mode` and `operator`
   (ids of rows whose summary code is not `assigned`); "Back to the assignment queue".
4. Unchecked receipt: CMP-08 unchecked ("Request reference [key]. The receipt cannot be checked now.") with "Check
   status" (operation page). No item list, no form.

### 2.5 SA-03c Reassign one application `/admin/applications/:applicationId/reassign`

Reads `core.admin_case` and opt. `ops.case_work` (the two reads the old case page makes today, `admin.ts:415-420`).
The preview is composed from Core's facts; Core decides the transfer at the command (STOP-W06-03).

1. Header: breadcrumb; `h1` "Reassign: [applicant]"; meta as SA-03a; freshness.
2. Receipt (`reassigned`).
3. Status facts: Progress; Operator now ("[name]" and, when `pending.reasonCode = assigned_operator_inactive`, "not
   active"); Service payment (Gate 1); Readiness (`readiness.validity` text: "Recorded and current", "Not
   recorded", "Out of date", "Held", "Recorded by the previous operator").
4. `h2` "Scope": "This application only. The new operator becomes its one accountable operator."
5. `h2` "Evidence: what moves and what stays" (UX §6.3 reassignment preview; BS B19):
   - "Moves to the new operator when you confirm": open holds (`holds` with `state = open`: kind label, opened
     [time] IST) or "No open hold"; acts whose filing may have happened or is authorized (`acts` with `act_state`
     ∈ {`authorized`, `filing_unknown`}): "Reconciliation of [act label] ([state]) moves to the new operator" or
     "None"; incidents of this application owned by the current operator (opt. `case_work.incidents`, open,
     `ownerAccountId` = current operator): "[n] incidents" or "Unavailable". Line: "TravelMudra moves the open
     duties as a whole; the history records exactly what moved."
   - "Stays as it is": originals (opt. `case_work.originals`: "[item] — held by [holder kind], [location or
     'location not recorded']"; none: "No original is recorded for this application"); "Originals do not move.
     Custody stays with its holder." External acts and their evidence stay as recorded.
   - Readiness: "The current readiness judgement becomes the previous operator's. The new operator records
     readiness again before any filing or packet release, unless a SuperAdmin grants a readiness exception."
   - Gate 1: "Reassignment needs Gate 1, like an assignment." When `servicePayment ≠ payment_received`: "The
     service payment is not recorded as received. Reassigning needs a fresh Gate 1 exception for assignment." with
     the SA-09g link. The form stays: Core decides.
6. `h2` "Your decision": "New operator" (`toOperatorAccountId`, options `operators` minus the current operator,
   placeholder, none preselected); "Reason for reassigning" (`reason`, `textareaField`, 2 rows, maxlength 1000,
   hint "At least 10 characters. Recorded with the reassignment."); hidden `_rev.application`.
7. Review (visible): "When you reassign: [current] stops acting on this application at once and is notified; [new]
   becomes its operator; the open duties above move to [new]; originals, acts and their evidence do not change;
   readiness must be recorded again."
8. Buttons "Reassign" (primary); "Cancel" → SA-02a or the case page (origin).

| State | Copy |
|---|---|
| Not assigned (`active_assignment_id = null`) | "No operator is assigned. Assign one instead." Link SA-03a. No form |
| Closed | "This application is closed." No form |
| Only one assignable operator and it is the current one | CMP-10: "Reassigning is unavailable until another operator account is active and has set up its second factor. Owner: SuperAdmin." No form |
| C3 `reassigned` | Receipt (§2.8) |
| C2 | §2.10; both values kept |
| C5 | §2.9 |

### 2.6 SA-07a Service payment of one application `/admin/applications/:applicationId/payments`

Reads `pay.application_payments` (one read). Scope in WP-06: recording a payment entry (Gate 1). Corrections, fees,
follow-up decisions and boundary notices are carried (§1.5).

1. Header: breadcrumbs (as today); `h1` "Service payment: [title or 'Application [reference]']"; meta: Application
   (link to the case page), Travel agent (link to `/admin/finance/tas/<id>`), Application status, Price in effect
   ("Not fixed until submitted" when null); freshness.
2. Receipt (`recorded`, `corrected`).
3. Status facts (separate rows, D4): Service payment ("Received" / "Not received" / "Not recorded"); Gate 1 for
   the next guarded action (`gate1`: "Passed", "Blocked", "Passed by exception", "Not applicable", "Unavailable");
   Gate 2 for the next guarded action (`gate2`, same words) with the line "Gate 2 is separate: a Gate 1 exception
   never passes it."; Payment follow-ups open ("[n] items", link to the section).
4. Action panel "Next action" (CMP-01), from Core facts only: `unrecorded` → "SuperAdmin: record the first payment
   entry when the travel agent pays or when the payment is confirmed missing."; `not_received` → "SuperAdmin: record
   payment received when it arrives."; `payment_received` → "No payment step is waiting."; open follow-ups → "A
   payment-missing follow-up is open; a 'payment received' entry closes it."
5. `h2` "Record a payment entry" (when `entry_count = 0` or `current_status = not_received`, as today
   `payments/admin.ts:230-231`; Core refuses other cases with `payment_entry_kind_invalid`): fields of #7 with
   today's labels and hints (`entryFields`), plus the review line "When you record: the entry is added and never
   changed; 'Payment received' passes Gate 1 for assignment and the first operator work, closes open payment-missing
   follow-ups of this application, and makes any open Gate 1 exception unnecessary. 'Not received' keeps Gate 1
   blocked and makes any open Gate 1 exception lapse." Button "Record payment entry" / "Record payment received".
6. Carried "Correct the current entry" (WP-16).
7. `h2` "Payment entries" (table as today); `h2` "Payment-missing follow-up" (table as today); `h2` "Government
   fees paid by TravelMudra" (as today); carried "Not available in this release".

Removed: the meta "Due from the travel agent" (`payments/admin.ts:260, 273`): a page computation of an amount owed
(F-W06-07). The price in effect and the payment status stay as separate facts.

| State | Copy |
|---|---|
| S2 no entry | "No payment entry yet. 'Not recorded' is not the same as received." (today) |
| S4 `gate1` or `gate2` = `unknown` | "Unavailable" (today's badge) |
| C3 `recorded` | Receipt (§2.8) |
| C2 | `payment_evidence_required` on the evidence fieldset: "A received payment needs a bank or payment reference, or a document, as evidence. An attestation alone is not enough."; `kind_not_allowed`, `invalid_id`, `in_future` on their fields; `payment_entry_kind_invalid` form-level: "The payment is already recorded as received. A change is a correction of the current entry."; values kept |
| C5 `_rev.payment` | §2.9 |

### 2.7 SA-09 Decision pages

#### 2.7.1 Frame and registry

Every SA-09 page renders through CMP-25 `decisionPage` in the UX §7.3 order: Scope → Evidence → Effect on new and
existing work (what it allows; what it does not do; hard stops) → Your decision → Review (visible) → buttons →
receipt on the same page after the 303. One decision page per kind (WP-02 Q-W02-02). A kind is a registry entry in
`src/apps/staff/decisions/kinds.ts`:

| Registry field | Meaning |
|---|---|
| `kind` | Path value (closed enumeration per route) |
| `subject` | `none` or the id prefix of the subject (`gex`, later `ast`, `flg`, `dfr`, `pmk`) |
| `reads` | Required reads and opt. reads |
| `scope`, `evidence`, `effect`, `hardStops` | Renderers over the reads (facts only) |
| `unavailable` | Ordered list of (Core fact → CMP-10 copy, routes); the first match replaces the fields |
| `form` | POST route id, action path, hidden fields, visible fields |
| `receipt` | Done code, `ReceiptExpectation`, recorded and current facts |
| `stale` | CMP-14 rows |
| `current` | The rail member the page passes |

#### 2.7.2 Kind `gate1_assignment`

Reads: `core.admin_case`; opt. `pay.application_payments` (latest entry and gate states).

1. Header: breadcrumb; `h1` "Gate 1 exception for assignment: [applicant]"; freshness.
2. `h2` "Scope": Application [reference] · Service · Travel agent. "Gate: Gate 1, service payment. Action:
   assignment of an operator to this application (also a reassignment), once."
3. `h2` "Evidence": Service payment: status; latest entry "Entry [no], [status], recorded [time] IST by [name]"
   (opt.; "Unavailable"); "No entry yet" when none. Help request state. Operator: none / name. Core's evaluation of
   assignment now (`assignOffer` blockers as SA-03a item 4). Gate exceptions of this application (table: Gate,
   For, State, Expires [time] IST).
4. `h2` "Effect on this application":
   - "This decision allows: one assignment (or reassignment) of this application while Gate 1 blocks it. It is used
     by the next assignment."
   - "It does not: record a payment; confirm the travel agent's authority or the application's details; assert
     readiness; pass Gate 2 (the government commitment); allow the operator's first work. The first work needs the
     payment recorded, or its own Gate 1 exception."
   - "It ends: when it is used; when you or another SuperAdmin revokes it; when it expires (the receipt shows the
     time); when the payment record or the assignment changes before it is used; when you are no longer an active
     SuperAdmin."
   - "When it is used while the payment is not recorded, a payment-missing follow-up opens, owned by you. It stays
     open until a 'payment received' entry is recorded. Write-off is not available in this release."
5. `h2` "Hard stops (no exception exists for these)": "Mandatory validations (document safety, required documents,
   identity evidence, population scope, dependency evidence, custody evidence), fixed cut-offs and the exposure
   ceiling. No exception exists for these controls." When `assignOffer` has blockers other than the Gate 1 codes:
   "Assignment also waits for: [sentences]. This exception does not pass them."
6. `h2` "Your decision": "Reason for the exception" (`reason`, `textareaField`, 3 rows, maxlength 1000, hint "At
   least 10 characters. Recorded with the decision and shown in the audit history."); hidden `gate` =
   `gate1_service_payment`, `action` = `assign`, `_rev.application`.
7. Review (visible): "When you record this exception: assignment of [applicant] may go ahead once, while the
   service payment stays not recorded; your name, the reason and the time are recorded; the assigned operator is
   notified when an operator is assigned."
8. Buttons "Record Gate 1 exception for assignment" (primary); "Cancel" → SA-03a.

| State (first match) | Condition (Core facts) | Copy and controls |
|---|---|---|
| Closed | `lifecycle` ∉ {`draft`, `submitted`} | "Gate exceptions apply only to open applications." No form |
| Not needed | `servicePayment = payment_received` | "Gate 1 does not block this application: the service payment is recorded as received. No exception is needed." Link "Assign an operator" (SA-03a). No form |
| Protection mark | `mark ≠ null` | CMP-10: "A Gate 1 exception is unavailable while a post-restore protection mark holds this application. Owner: SuperAdmin, who resolves the mark with evidence." No form |
| Already open | a `gateExceptions` row `gate1_service_payment`/`assign`/`granted` | "A Gate 1 exception for assignment is open until [expires_at] IST. TravelMudra uses it only while it is fresh." When `assignOffer` reports `gate_exception_stale`, `_expired` or `_grantor_inactive`: that sentence and "Revoke it, then record a new one if it is still needed." Links "Assign an operator" (SA-03a), "Revoke" (SA-09r). No form |
| Draft without approved help | `lifecycle = draft` and `assistance.state ≠ approved` | "Assignment needs a submitted application or approved help. A Gate 1 exception does not change that." No form |
| C3 `granted` | — | Receipt (§2.8); the page then shows "Already open" |
| C2 | — | §2.10; reason kept |
| C5 | `stale_revision` | §2.9 |

#### 2.7.3 Kind `gate1_first_work`

As §2.7.2 with these differences. Reads add opt. `ops.case_work` (`workStarted`).

- `h1` "Gate 1 exception for the operator's first work: [applicant]". Scope: "Action: the first work of the
  assigned operator on the current assignment (for example the first approved-help entry), once."
- Effect allows: "the first operator work on the current assignment while Gate 1 blocks it; later work on the same
  assignment rests on that basis". Does not: as §2.7.2, and "allow a new assignment". Ends: as §2.7.2; "a
  reassignment makes it lapse".
- Hidden `action` = `start_operator_work`. Button "Record Gate 1 exception for first operator work". Cancel → the
  case page.
- States add: "No assignment" (`active_assignment_id = null`): "No operator is assigned yet. Decide the exception for
  assignment instead." Link to `gate1_assignment`. "Work started" (`case_work.workStarted = true`): "The operator's
  work on this assignment has started. Gate 1 is not checked again for it." No form. When `case_work` is
  unavailable, the form shows and Core decides (`gate_not_blocking`).

#### 2.7.4 Kind `revoke_exception` (subject `gex_…`)

Reads `core.admin_case`; the subject is the `gateExceptions` row whose id equals `subjectId`. Absent → the uniform
404 (the exception is not this application's, or the reader cannot read it).

1. `h1` "Revoke a gate exception: [applicant]".
2. Scope: "Exception [reference] · [gate label] · for [action label]". Evidence: State, Expires [time] IST, Service
   payment now, Operator now. Grantor, grant time and reason are not in the read model (STOP-W06-02); the page
   shows "Who granted it and why: in the audit history" with a link to the audit subject page when registered.
3. Effect: "After you revoke it, [action label] needs the service payment recorded, or a new exception. Nothing
   else changes: an assignment already made stays, and no payment record changes."
4. Your decision: "Reason for revoking" (`reason`, hint as above); hidden `applicationId` (D-W06-05).
5. Review (visible): "When you revoke: the exception can no longer be used. Your name, the reason and the time are
   recorded."
6. Buttons "Revoke the exception" (primary, `destructive` variant per DESIGN.md "destructive actions confirm": the
   page itself is the confirmation); "Cancel" → SA-09g of its kind (Gate 1) or the case page.

| State | Condition | Copy |
|---|---|---|
| Not open | `state` ∈ {`consumed`, `expired`, `revoked`} | "This exception is [used / expired / revoked]. There is nothing to revoke." No form |
| C3 `revoked` | — | Receipt (§2.8); the page then shows "Not open" |
| C2 `stale_revision` | another SuperAdmin revoked it, or it was used meanwhile | "This exception is no longer open: it was used, expired or revoked since you opened the page." Re-read shows the state |

#### 2.7.5 How the other decision kinds plug in

Each later package adds registry entries and extends the `kind` enumeration of the route it needs. The frame,
the routes, the receipt mechanism and the hidden-field protocol stay. Known kinds (AD-13; CC-04):

| Kind | Package | Route | Subject | POST (unchanged) |
|---|---|---|---|---|
| `gate2_commitment` | WP-07 | `…/decide/:kind` | — | `/admin/applications/:id/gate-exceptions` (`gate2_government_commitment` / `first_government_commitment`) |
| `readiness_submission`, `readiness_fee_payment`, `readiness_provider_handoff`, `readiness_packet_release` | WP-07 (reassignment readiness, also WP-12) | `…/decide/:kind` | — | same POST with `readiness_gate` |
| `assistance` | WP-09 | `…/decide/:kind/:subjectId` | `ast` | `/admin/applications/:id/assistance-decision` |
| `flag_response` | WP-09 | subject route | `flg` | `/admin/applications/:id/flags/:holdId/respond` |
| `deferral` | WP-17 | subject route | `dfr` | `/admin/deferrals/:deferralId/decision` (hidden BFF `applicationId`, as D-W06-05) |
| `price_increase`, `operational_withdrawal` | WP-17 | `…/decide/:kind` | — | existing POSTs |
| `unresolved_completion`, `correct_outcome`, `correct_fields`, `protection_mark` | WP-11 | `…/decide/:kind` (mark: subject `pmk`) | — / `pmk` | existing POSTs |
| launch kinds | WP-02, WP-13 | SA-05j (`/admin/catalogue/offerings/:id/launch/decide/:kind`) | — | existing |
| ceiling increase approve/decline | WP-07 | `/admin/finance/ceiling-changes/:changeId/decide/:kind` | — | existing |
| elevation approve/decline | WP-15 | `/admin/elevations/:elevationId/decide/:kind` | — | existing |
| intake issue dismissal | WP-18 | `/admin/intake-incidents/:incidentId/decide/dismiss` | — | existing |

When WP-07 adds the Gate 2 and readiness kinds, the carried generic grant form on the old case page (§1.5) is
deleted. A unit test asserts that the registry's (`gate`, `action`) pairs equal Core's `SCOPE` table
(`src/modules/core/commands/gates.ts:26-30`) once all three gates have kinds, so no pair is left without a page.

### 2.8 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource (kind, id) | Summary test | Title | Recorded facts | Current facts (labelled "Current") |
|---|---|---|---|---|---|---|
| `assigned` | SA-03a | `application`, path id | `assignmentId` is a string | Operator assigned | Assignment reference | Operator (`names[assigned_operator_id]`); Service payment; Gate 1 for the operator's first work (opt. `pay.application_payments.gate1`); Payment follow-ups open (opt.) |
| `plan` | SA-03b | `queue`, no id (`{type:'queue', name:'assignment'}`) | `assigned` and `refused` are numbers, `assigned + refused` = the number of address items, and `item0…item(n-1)` are strings | Assignment plan confirmed | Assigned [n]; Not assigned [n]; per-item lines (§2.4.2) | Applicant and operator names from the re-read plan |
| `reassigned` | SA-03c | `application`, path id | `assignmentId` is a string | Application reassigned | Assignment reference | Operator; Readiness ("Recorded by the previous operator: the new operator records it again" when `previous_operator`); Open holds; Originals holder (opt.) |
| `granted` | SA-09g | `application`, path id | `gateExceptionId` is a string | Gate 1 exception recorded for assignment / for first operator work | Exception reference; Gate; For; Expires [time] IST (the `gateExceptions` row selected by the returned id) | State; Service payment ("still not recorded"); the fixed line "This exception does not pass Gate 2." |
| `revoked` | SA-09r | `application`, path id | `gateExceptionId` equals the path `subjectId` | Gate exception revoked | Exception reference; Gate; For | State "Revoked" |
| `recorded` | SA-07a | `application`, path id | `entryId` string, `entryNo` number, `status` string | Payment entry recorded | Entry [no]; Status recorded; Evidence (the entry selected by `entryId`); "Payment-missing follow-ups closed by this entry: [closedExceptions] items" | Service payment; Gate 1; Gate 2 |
| `corrected` | SA-07a (carried form) | as `recorded` | as `recorded` | Correction recorded | as `recorded`; "Follow-up opened: yes/no" from `openedException` | as `recorded` |

No receipt shows an accepted time (P-02 parked). A receipt whose check fails reads unchecked (WP-01 A-04).

### 2.9 Stale revision (CMP-14) per form

| Form | `_rev` | Rows (your unsent value / current value) |
|---|---|---|
| SA-03a assign | `application` | Operator (your choice / current operator or "None"); Service payment (current only) |
| SA-03c reassign | `application` | New operator (yours / current operator); the reason stays in its field |
| SA-09g grant | `application` | Operator (current); Service payment (current); Gate exceptions open (current); the reason stays |
| SA-07a record | `payment` | Payment status (your entry's status / current status); Entries ("[n] entries" current) |
| SA-03b plan | per item (`rev.N`) | Not CMP-14: per-item result "Changed since your preview" (§2.4.2) |

"Who changed it and when" rows are absent (no read model carries them), never "unknown".

### 2.10 Refusal sentences (closed table, staff audience)

Existing `CORE_MESSAGES` (`src/apps/shared/core/shared.ts`) stay unless listed. Category plus code selects the
sentence.

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| assign, reassign | `stale_revision` | CMP-14 | — |
| assign, reassign | `control_blocked` / `operator_not_assignable` | "That operator cannot be assigned now: not an active operator with a second factor. Choose another." | operator field |
| assign | `control_blocked` / `gate1_payment_not_received` | "Gate 1 blocks assignment: the service payment is not recorded as received and no fresh Gate 1 exception exists." + the two routes | form-level |
| assign | `control_blocked` / `already_assigned` | "Another SuperAdmin assigned this application first: [current operator]." (current from the re-read) | form-level |
| reassign | `control_blocked` / `assignment_changed` | "The assignment changed since you opened the page." + re-read state | form-level |
| reassign | `validation_failed` reason | "Enter a reason of at least 10 characters." | reason field |
| grant | `control_blocked` / `gate_not_blocking` | "Gate 1 does not block this action now. No exception was recorded." (with the re-read state) | form-level |
| grant | `conflict_duplicate` / `gate_exception_not_eligible` | "A Gate 1 exception for this action is already open. No second one was recorded." (F-W06-04) | form-level |
| grant | `validation_failed` / `gate_exception_not_eligible` | "This gate cannot be excepted for this action." | form-level |
| grant | `control_blocked` / `protection_mark_active`, `application_not_open` | existing sentences | form-level |
| revoke | `stale_revision` | §2.7.4 | form-level |
| record payment | as §2.6 | — | — |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |

## 3. The batch assignment flow

### 3.1 Sequence

| Step | Page | Call | Writes |
|---|---|---|---|
| 1 | SA-02a | `core.assignment_queue` | nothing |
| 2 | SA-02a → SA-03b | GET form: `item` (checked rows), `mode`, `operator` (ticked, in list order) | nothing |
| 3 | SA-03b preview | `core.assignment_plan` | nothing ("a preview assigns nothing") |
| 4 | SA-03b confirm | `core.assign_selection` with `{mode, items[{applicationId, expectedRevision}], operators, plan[{applicationId, operatorId}]}` (`planInput`, `admin.ts:433-449`) | per item, in one transaction: assignment, consumed exception, opened follow-up, operator notice (`assignment.ts:186-221`) |
| 5 | SA-03b result | `core.operation` (receipt), `core.assignment_plan` (names) | nothing |

### 3.2 Per-application results

Core accepts the command when at least one item passes and records a code per item: `assigned`, `stale_revision`,
`operator_not_assignable` or the first blocker code (`assignment.ts:186-221`). The result page maps each code to its
sentence (§2.4.2). No item result is inferred: an item with no summary code makes the summary test fail and the
receipt reads unchecked. When no item passes, Core refuses the whole command; the preview re-renders (§2.4.1).

### 3.3 Retries (K-BATCH)

- Same `_op`, same content (browser resend, double click): Core returns the original result; the handler answers the
  same 303 (the location is built from the same fields); the result page is the same. Nothing is assigned twice.
- Same `_op`, different content: `conflict_operation_key`; the preview re-renders with the form-level sentence.
- New `_op`, same plan (a second tab, or "Back" then confirm again): every already assigned item reads
  `stale_revision` or `already_assigned`; the result shows them as not assigned with the current operator; no
  duplicate assignment (business guard: one active assignment per application).
- "Plan the unassigned applications again" is a new intent: a new preview, a new `_op`.

### 3.4 Limits

The BFF bounds a plan request to 200 ids and 50 operators (`admin.ts:142-143`); Core refuses more than its
configured batch maximum (`assignment_batch_too_large`, `config.ts:147`) and more round-robin operators than
configured (`round_robin_needs_operators`, `config.ts:148`). The page states neither number (F-W06-08).

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 9efb379 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Assign (SA-03a) | Same `_op`, same content | K-STD replay: original result; 303 to the same receipt | None | Yes (receipt new) |
| Assign | New `_op`, same application (two tabs) | Second: `stale_revision` (the first assignment raised the revision) → CMP-14 with the current operator | None | Partly (generic text) |
| Plan confirm (SA-03b) | Same `_op`, same fields | Replay; same result page | None | Yes (result page new) |
| Plan confirm | New `_op`, same plan | §3.3 | None | Partly (flash only) |
| Grant (SA-09g) | Same `_op`, same reason | Replay; same receipt | None | Yes |
| Grant | New `_op` (two tabs) | `conflict_duplicate` → "already open" sentence and state | None | No (misleading sentence, F-W06-04) |
| Revoke (SA-09r) | Same `_op` | Replay | None | Yes |
| Revoke | New `_op` after a revocation | `stale_revision` → "no longer open" | None | Partly (shell error page today: the revoke route has no re-render, `admin.ts:553`) |
| Record payment (SA-07a) | Same `_op` | Replay; same receipt | None | Yes |
| Record payment | New `_op`, same entry (two tabs) | Second: `stale_revision` (`_rev.payment`) → CMP-14; no second entry | None | Partly |
| Reassign | New `_op` after a reassignment | `stale_revision` → CMP-14 with the current operator | None | Partly |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused single form (C1, C2, C5) | Same page at the POST address, CMP-07 focused, `restorePath` = the GET page | Operator choice, reason, payment fields | Nothing |
| Refused plan | SA-03b re-rendered with the re-read plan | The selection (address and hidden fields) | Nothing |
| Partly accepted plan | Result page | Assigned items stay assigned (no rollback); unassigned items listed with reasons and "Plan again" | — |
| Core unreachable before the command | SH-02 neutral unavailable page (WP-01 A-09) | — | The form; the reader opens the page again |
| Answer lost | Operation page (CMP-13); "Open the result" goes to the assignment queue for `queue` and to the case page for `application` | — | No new submission is offered there |
| Optional read failed | The fact reads "Unavailable" | Everything else | — |

### 4.3 Stale and concurrent work

| Situation | Required behaviour | Today |
|---|---|---|
| Two SuperAdmins assign the same application (single) | The first wins; the second gets CMP-14 "Operator: yours [A] / current [B]" | Partly |
| Two SuperAdmins confirm plans that share an application | Each item is decided once; the second plan's shared item reads "Changed since your preview. Not assigned." with the current operator in the re-read; its other items are assigned | Partly |
| One SuperAdmin grants an exception while another records "payment received" | Whichever commits first decides: grant after payment → `gate_not_blocking` with the re-read state; payment after grant → the exception lapses (status revision) and is no longer needed; SA-09g shows "Not needed" | Partly |
| Payment corrected to "not received" after an exception for assignment was granted | The exception lapses (`gate_exception_stale`); SA-03a shows the Gate 1 group with that sentence and "Revoke it, then record a new one" | Partly |
| The application is changed by the travel agent between SA-03a load and submit (submitted, unassigned) | `stale_revision` → CMP-14 | Partly |

### 4.4 Facts that change between preview and confirm

| Situation | Required behaviour | Today |
|---|---|---|
| A row previewed "Not now" is paid or excepted before confirm | Core assigns it at confirm; the review text said so (F-W06-01); the result line reads "Assigned to [operator]" | No (copy promised "left out") |
| A row previewed "Yes" loses its basis (payment corrected, exception revoked or expired) | Core refuses that row; result "Not assigned: [Gate 1 sentence]" | Partly |
| An operator of the plan is suspended or loses the second factor | Rows to that operator: "Not assigned: that operator cannot be assigned now"; selection mode, every row → whole-plan refusal with "Change the selection" | Partly |
| The operator chosen on SA-03a is suspended before submit | C2 `operator_not_assignable` on the field; the re-read list no longer holds that operator; the line "The operator you chose is no longer in the list." | Partly |
| The application is withdrawn, closed or held by a protection mark before confirm | Per-row (plan) or form-level (single) sentence from Core's code | Yes (codes) |
| The SuperAdmin who granted an exception is suspended before it is used | `gate_exception_grantor_inactive` on SA-03a and the plan row; route "Revoke it, then record a new one" | Partly |

### 4.5 Access and accounts changing mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| The SuperAdmin is suspended by another SuperAdmin | Next request: session ended → sign-in with the WP-01 message; typed input is lost; nothing was written | Yes (residue accepted, as WP-02 Q-W02-12) |
| A SuperAdmin opens a support view and follows an `/admin` link | 409 `support_view_active` (shell) | Yes |
| The assigned operator is suspended after assignment | The application appears in SA-02a "Operator no longer active" and SA-01 group 1; reassign needs Gate 1 again (and a fresh exception when unpaid) | Yes (copy new) |
| A receipt address is opened by another SuperAdmin | `core.operation` re-authorizes: a SuperAdmin reads it; another role gets no receipt (SH-R05) | Yes |
| Back after a confirm | The page reloads (WP-01 A-02) and the GET shows the current state; a POST is never re-sent silently | Yes |

### 4.6 Counts, caps and long lists

| Situation | Required behaviour | Today |
|---|---|---|
| 500 applications wait for assignment | SA-02a lists the oldest 200 with the cap line; SA-01 shows "200 or more" and "[500] in total" from `views.monitors` | No (no cap line; no total) |
| A count read fails | "Unavailable" for that group only (SA-01); nav counts as WP-01 | Partly |
| A plan of 50 applications | The table scrolls in the page (not a nested region); the result list reads one line per item | Partly |
| 200 selected (more than the configured maximum) | Core's problem `assignment_batch_too_large` → "Too many applications for one plan. Choose fewer." | Partly (states "fifty") |
| Long names: applicant 400, service 300, group 200, operator 200, reason 1000 | Wrap anywhere; `h1` wraps; tables stack to cards | Partly |

### 4.7 Device and environment

| Situation | Required behaviour |
|---|---|
| JavaScript off | Every page works: GET selection form, plain decision forms, `<details>` only for secondary content; no "select all"; the selection line names the next page |
| 320 px, 400 % zoom | One column; no two-dimensional page scroll (AC-04); the batch bar wraps |
| Keyboard only | Checkboxes, radios and buttons reachable in reading order; the error summary takes focus after a refusal (AC-08) |

## 5. Accessibility notes specific to WP-06

- One `h1` per page; SA-01 groups and SA-09 frame parts are `h2` (AC-03).
- Status facts are a definition list; every badge has text (AC-06).
- Every unavailable control has `aria-disabled="true"` and `aria-describedby` to its CMP-10 notice (AC-13).
- Queue checkboxes are labelled with the row's applicant and reference (AC-15); the "[n] selected on this page"
  output announces politely and does not move focus (AC-16).
- The plan result list is a list with one text result per item; "Assigned" and "Not assigned" are words, not colour
  (AC-06).
- Decision pages: the review block is visible text before the button, never inside `<details>` (UX §7.3).

## 6. Proof scenario V06 on `lane-ui`

V06 (UX §12): "Unpaid submitted case is visible in assignment queue, but assignment/help/operator work requires
Gate 1 or fresh exception. Gate 2 remains separate." BS B18, B26, B27.

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge 4650, staff 4652; config `~/.local/share/travelmudra-uat/configs/lane-ui.json`,
  source = this lane's clone; deployed ref 9efb379 when this design was written). At the WP-06 proof it holds the
  integrated WP-02 and WP-03 pages (package order, PLAN §3).
- Synthetic seed: countries Synthetica (SYN) and Synthetica Beta (SYX); eight launched offerings; accounts
  syn-ta-1 to -3, syn-operator-1 to -3, syn-superadmin-1 and -2, all active (WP-02 §7.1). Operators have a second
  factor from the seed (inference: the seed enrols them; the PM confirms that SA-03a lists them before step 1).
- Offering used: "SYN Tourist e-visa" (TravelMudra files, ₹3,500), as in WP-03 V05.
- Sign-in through the LD-11 harness; codes never printed; screenshots allowed. axe at 1440 px and 390 px.

### 6.2 Setup (synthetic writes; Q-W06-10)

Through the rebuilt TA pages (WP-03) driven by the harness as syn-ta-1: create group `wp06-v06-[yyyymmddhhmm]` in
Synthetica, travel start today + 30, return today + 40; add applicants A, B, C, D (synthetic passports and photos
generated in memory as WP-03 §8.1); submit A, B and C on TA-08; ask for help on D (TA-07h) and leave D a draft.
Seeded data is not changed.

### 6.3 Steps and observable results

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V06-1 | syn-superadmin-1, `/home` | Sign in | 303 to `/admin`; SA-01 group 2 counts A, B, C ("Service payment not received or not recorded: 3 applications" at least); group 4 counts D's help request | L |
| V06-2 | SA-02a | Read | A, B, C listed with "Service payment (Gate 1): Not recorded"; the applicant links `/admin/applications/<id>` | L |
| V06-3 | SA-03a for A | Open | Gate 1 group with the sentence and two routes; no form; "Assign" shown unavailable with its reason | L |
| V06-4 | Test | Hand-made POST `core.assign` for an unpaid application without an exception | Refused `gate1_payment_not_received`; no assignment row (existing `case-rules`/`core-pages` coverage, moved to the new GET source) | T |
| V06-5 | SA-07a for B | Record "Payment received" with evidence reference `SYN-V06-[stamp]` | Receipt "Payment entry recorded": Entry 1, Received; Current Gate 1 "Passed"; Gate 2 row separate | L |
| V06-6 | SA-09g `gate1_assignment` for C | Read, enter a reason, record | Scope, evidence (payment not recorded), effect (allows / does not / ends / follow-up), hard stops visible before the reason field; receipt "Gate 1 exception recorded for assignment" with expiry; "This exception does not pass Gate 2." | L |
| V06-7 | SA-02a → SA-03b | Select A, B, C; "One operator…"; tick syn-operator-1; preview | Assignable now: 2 of 3; A "Not now: the service payment has not been recorded as received" with routes; review text states the re-check | L |
| V06-8 | SA-03b | Confirm | Result: B "Assigned to syn-operator-1"; C "Assigned to syn-operator-1"; A "Not assigned: …"; "Plan the 1 unassigned application again" | L |
| V06-9 | Harness | Resend the confirm POST (same `_op`, same fields) | 303 to the same result address; same per-item lines; one active assignment each (checked on SA-03a of B and C) | L |
| V06-10 | SA-07a for C | Read | Service payment "Not recorded"; Gate 1 for the next action "Blocked" (first work); "Payment-missing follow-up: 1 item" owned by syn-superadmin-1; Gate 2 its own row | L |
| V06-11 | syn-operator-1, old operator case page of C | Try the first work (start work) | Refused with the Gate 1 sentence; no work recorded | L |
| V06-12 | syn-superadmin-1, SA-09g `gate1_first_work` for C | Record | Receipt; then syn-operator-1 starts work on C: accepted | L |
| V06-13 | SA-07a for C | Record "Payment received" | Receipt "Payment-missing follow-ups closed by this entry: 1 item" (or 2, when step V06-12 opened a second follow-up: the receipt states Core's number) | L |
| V06-14 | SA-09g for A, then SA-09r | Record an exception for assignment for A; revoke it with a reason | Revoke receipt; SA-03a for A shows the Gate 1 group again; SA-09g for A shows the form again | L |
| V06-15 | Old SuperAdmin case page of D (carried WP-09 form) | Approve D's help request | SA-02a lists D under "Approved help waiting for an operator" with "Service payment: Not recorded"; SA-03a for D shows the Gate 1 group (help does not pass Gate 1) | L |
| V06-16 | syn-superadmin-1 and -2, SA-03a for A | Both open SA-03a after A's payment is recorded; -1 assigns syn-operator-2; -2 assigns syn-operator-3 | -2 sees CMP-14 "Operator: yours syn-operator-3 / current syn-operator-2"; one assignment | L |
| V06-17 | SA-03c for B | Reassign to syn-operator-2 with a reason | Preview shows moving duties, originals unchanged, readiness to record again; receipt "Application reassigned" | L |
| V06-18 | Test | Gate 2 separation: an application assigned under a Gate 1 exception; the operator authorizes a government fee or submission | Refused `gate2_payment_not_received` (Gate 2 needs its own decision, WP-07); the Gate 1 exception is consumed and is not used again | T |
| V06-19 | Test | Plan with a row paid between preview and confirm; operator suspended between preview and confirm | Per §4.4 | T |
| V06-20 | axe | Every WP-06 page visited | No violation at 1440 px and 390 px | L |

Proof split: V06 passes when V06-1 to V06-3, V06-5 to V06-17 and V06-20 pass on `lane-ui` and V06-4, V06-18 and
V06-19 pass as tests. V06-11 and V06-12 use the old operator page (WP-07 rebuilds it); the architect approves the
operator write (Q-W06-10).

### 6.4 V08 and V15 in WP-06

V08 (ordinary readiness, allowed exception, missing evidence, non-overridable controls distinguished; an exception
asserts none of the missing facts): WP-06 delivers the Gate 1 part (SA-09g effect and hard stops; SA-07a separate
gate rows). WP-07 completes V08. V15 (unassigned delivery owned through assignment or bounded ownership): WP-06
delivers assignment and reassignment; the delivery ownership view is WP-19.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0 (after WP-02 U0 is integrated). Phase B: U1, U2, U3, U4, U5 in parallel. Phase C: U6. The architect
registers gallery modules in `scripts/dev/gallery-pages.ts`, applies the one-value shell change and edits `DESIGN.md`
once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Components and the application context** | New `src/web/ui/queues.ts` (CMP-06 `queueTable`, CMP-26 `batchBar`, `inboxGroup`); WP-06 block in `static/css/components.css`; exports in `src/web/ui/index.ts`; new `src/apps/staff/core/admin-context.ts` (application header meta and status facts for SA-03 and SA-09 from `core.admin_case`; Gate 1 code table) | New `test/unit/web/queues.test.ts` (checkbox labels name the row; cap line; S3 copy; selection line without JavaScript; inbox group shows "Unavailable" for null and "[max] or more" at cap; no summed counts) | `scripts/dev/gallery/queues.ts` |
| **U1 SA-01** | New `src/apps/staff/home/inbox.ts` (route `admin.home`, the ten opt. reads, group builders), new `src/apps/staff/home/inbox-page.ts` | New `test/unit/web/decision-inbox.test.ts` (fixed order; zero groups in "Nothing waiting now"; one failed read → only that group "Unavailable"; partitions by reason code and payment status; LD-04 wording; no "All done"); BFF test with a scripted Core: an access refusal of one read renders the shell page | `scripts/dev/gallery/inbox.ts` |
| **U2 SA-02** | New `src/apps/staff/queues/pages.ts` (four views), new `src/apps/staff/queues/routes.ts` (GET `admin.queues.assignment`, `.assistance`, `.flags`, `.deferrals` moved from `admin.ts`) | New `test/unit/web/work-queues.test.ts` (Gate 1 fact per row; filter enumerated and unknown values ignored; prefill from the address; "operator not active" part has no checkbox; links to the case page kept; help-queue lead) | `scripts/dev/gallery/work-queues.ts` |
| **U3 SA-03** | New `src/apps/staff/assignment/pages.ts` (SA-03a, SA-03b preview and result, SA-03c), new `src/apps/staff/assignment/routes.ts` (GET `admin.applications.assign_form`, `admin.applications.reassign_form`, `admin.assignments.preview` moved; POST `admin.applications.assign`, `admin.applications.reassign`, `admin.assignments.selection`, `admin.assignments.round_robin` moved with receipts and typed re-render; `planInput` moved) | New `test/unit/web/assignment-pages.test.ts` (no form when `assignOffer` blocks; Gate 1 group routes; review copy states the re-check; hidden `item.N`/`rev.N`/`plan.N`/`operator.N` equal the plan rows; result mode has no form; per-item lines from summary codes; summary mismatch → unchecked; reassignment preview lists holds, acts, originals, readiness line); BFF test: a refused assign keeps the chosen operator; a confirm answers 303 to the preview path with `done=plan&op=` | `scripts/dev/gallery/assignment.ts` |
| **U4 SA-09** | New `src/apps/staff/decisions/kinds.ts` (registry), new `src/apps/staff/decisions/application.ts` (renderers for `gate1_assignment`, `gate1_first_work`, `revoke_exception`), new `src/apps/staff/decisions/routes.ts` (GET `admin.decisions.application`, `admin.decisions.application_subject`; POST `admin.applications.grant_exception`, `admin.gate_exceptions.revoke` moved with kind mapping, receipts and re-render) | New `test/unit/web/decision-kinds.test.ts` (section order; review never inside `<details>`; states in order; hard stops text; "does not pass Gate 2" in effect and receipt; hidden `gate`/`action` per kind; revoke form carries `applicationId`; the registry pairs are a subset of Core's `SCOPE`) ; BFF test: a refused revoke re-renders SA-09r from `applicationId`, and without it answers as today | `scripts/dev/gallery/decisions.ts` |
| **U5 SA-07a** | `src/apps/staff/payments/admin.ts` (`applicationPaymentsPage` only), `src/apps/staff/payments/routes.ts` (record route: `receiptLocation`, expectations for `recorded` and `corrected`) | New `test/unit/web/service-payment-page.test.ts` (separate gate rows; no "Due from the travel agent"; record form statuses per Core facts; carried correction form present; receipt facts selected by `entryId`) | `scripts/dev/gallery/service-payment.ts` |
| **U6 Wiring and system tests** | `src/apps/staff/core/admin.ts` (remove the moved queue pages, preview page and routes; case page sections become links; the carried grant form narrowed to Gate 2 and readiness values), `src/apps/staff/instance.ts` (register the new route modules), `src/web/route-inventory.ts` (id `admin.home` for D01; new entries for the five new GET routes), one-value change `SURFACE_CONFIG.admin.home = '/admin'`, `src/apps/shared/common-routes.ts` `resultHrefOf` (`queue` assignment → `/admin/queues/assignment`, if absent) | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids); `test/unit/web/signed-in.test.ts` (SuperAdmin landing); new `test/unit/web/carried-forms-wp06.test.ts` (§7.2); the system tests of §7.3 | — |

U3 and U4 both import `admin-context.ts`; U0 owns it. U6 removes the old copies in phase C, so no two units edit one
file.

### 7.2 Carried-form test

`test/unit/web/carried-forms-wp06.test.ts` renders SA-07a (an entry exists) and the old case page fixtures and
asserts: the correction form (`/admin/applications/:id/payments` with `kind=correction`), the boundary notices of
§1.5, the carried Gate 2 and readiness grant form (its selects hold no Gate 1 value), and the carried WP-09 and
WP-17 forms. It also asserts that the old case page holds no form with action `…/assign`, `…/reassign` or
`/admin/gate-exceptions/…/revoke`. WP-07, WP-09, WP-16 and WP-17 remove their entries when they rebuild them.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/core-pages.test.ts:237-252` | Assign form read from the case page; "Assignment is not available now" text | GET SA-03a; the Gate 1 sentence of §2.3 |
| `test/system/core-pages.test.ts:254-271` | Grant form on the case page; `location === /admin/applications/<id>?done=granted`; flash text | GET SA-09g `gate1_assignment`; location `…/decide/gate1_assignment?done=granted&op=<key>`; receipt title; assign from SA-03a |
| `test/system/core-pages.test.ts:273-286` | "Will be assigned"; `location === '/admin/queues/assignment?done=plan'` | "Assignable now"; location = the preview path with `done=plan&op=`; result lines |
| `test/system/core-pages.test.ts:383-386`, `:420` | Reassign and assign forms read from the case page | GET SA-03c and SA-03a |
| `test/system/case-rules.test.ts:161-167`, `:206-207`, `:283-287` | Grant (both Gate 1 actions), assign, reassign from the case page | GET SA-09g (kind by action), SA-03a, SA-03c |
| `test/system/document-decisions.test.ts:217-218` | Grant and assign from the case page | GET SA-09g, SA-03a |
| `test/system/ta-documents-originals.test.ts:218`, `case-work.test.ts:163`, `delivery.test.ts:193`, `payments-views.test.ts:116` | Assign from the case page | GET SA-03a |
| `test/system/payments-views.test.ts:90, 93` | `location === …/payments?done=recorded` | Allow `&op=<key>` |
| `test/system/flows.test.ts:68` | SuperAdmin landing `/admin/monitors` | `/admin` |
| `test/system/browser.test.ts:181, 254` | `waitForURL(…/admin/monitors)` after sign-in | `…/admin` |
| `test/unit/web/routes.test.ts:130` and inventory counts | Admin GET rows | Add the new rows and the `admin.home` id |

Stay valid: the queue link assertions `a[href="/admin/applications/<id>"]` on the assignment, assistance, flags and
deferrals queues (`core-pages.test.ts:239, 308, 331, 346`) — the rebuilt rows keep that link; the carried WP-09 and
WP-17 posts from the case page (`core-pages.test.ts:310-312, 333-335, 349, 417`; `case-rules.test.ts:160, 281`);
`/admin/monitors` reads (`case-views.test.ts:139-147`, `case-measures-currency.test.ts`, `case-work.test.ts:605`,
`flows.test.ts:86`); `test/unit/nav-counts.test.ts:210`; `test/unit/web/shell.test.ts` fixtures.

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits to the register for the architect (this design does not edit it):

| Command | Row now | Proposed row |
|---|---|---|
| `core.assign` | SA-03, WP-06 | SA-03a `/admin/applications/:id/assign`; WP-06. Note: "moved off the case page and the queue rows" |
| `core.assign_selection` | SA-03, WP-06 | SA-03b (preview and result on `/admin/assignments/selection/preview`); WP-06 |
| `core.grant_gate_exception` | SA-09, WP-06 | SA-09g kinds `gate1_assignment`, `gate1_first_work` (WP-06); Gate 2 and readiness kinds WP-07 (carried generic form until then) |
| `core.revoke_gate_exception` | SA-09, WP-06 | SA-09r kind `revoke_exception` (CC-04 delivered); WP-06 |
| `pay.record_service_status` | SA-07, WP-06 | SA-07a, kind `record` WP-06; kind `correction` WP-16 (carried) |
| `core.reassign` | SA-03, WP-12 | SA-03c, **WP-06** (Q-W06-01); WP-12 adds custody detail to the preview only |

§5.1 count: WP-06 6 (adds `core.reassign`), WP-12 4. Proposed §6 disposition CC-12: "The WP-06 commands leave the
old SuperAdmin case page (`admin.applications.detail`): the page keeps the facts and links to SA-03a, SA-03c,
SA-09g and SA-09r. Each command has one host page for each use." Reason: one decision page per kind; a second form
for the same decision would carry different wording (WP-02 Q-W02-02).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W06-01 | P1 | The plan page says "Items that cannot be assigned now are left out" and the button reads "Assign [a] of [n]" (`admin.ts:163-172`), but the confirm posts every row and Core assigns any row that passes at confirm (`assignment.ts:186-206`) | A SuperAdmin previews A (unpaid) and B, records A's payment in another tab, confirms "Assign 1 of 2"; both are assigned, against the text | Truthful review text and button (§2.4.1) |
| F-W06-02 | P1 | After a plan, the queue shows the flash "Each application shows its own result" (`admin.ts:47, 529`); no page shows the per-application result | A 10-item plan with 3 refusals; the SuperAdmin cannot tell which 3 | Result mode with per-item lines (§2.4.2) |
| F-W06-03 | P1 | One generic grant form with two independent selects for every gate and action (`admin.ts:268-275`), no effect statement | A SuperAdmin grants a readiness exception believing it passes Gate 1; the UX forbids one override affordance for every blocker (§6.3) | One SA-09 kind per gate and action with its effect and hard stops (§2.7) |
| F-W06-04 | P1 | A second grant (another tab) shows "This gate cannot be excepted for this action now." (`gates.ts:73`, `shared.ts:131`) | The SuperAdmin believes the gate is not exceptable and stops; an exception is in fact open | Category-specific sentence and the "already open" state |
| F-W06-05 | P1 | Typed input lost on refusal: assign choice, reassign reason, grant reason (`caseAgain` renders without `ctx.fields`, `admin.ts:415-426`) | A SuperAdmin writes a 600-character reason; the refusal re-renders an empty field | Re-render with `ctx.fields` on every WP-06 form |
| F-W06-06 | P2 | The revoke form is a table cell with a visually hidden reason label and no consequence (`admin.ts:265`); its refusal shows the shell error page (`:553`) | A misclick revokes the wrong row's exception | SA-09r decision page |
| F-W06-07 | P2 | SA-07 computes "Due from the travel agent" (`payments/admin.ts:260, 273`) | A partial or disputed payment reads as a full amount owed | Removed; price and status stay separate |
| F-W06-08 | P2 | `assignment_batch_too_large` states "fifty" (`shared.ts:165`); the number is configuration (`config.ts:147`) | An installation configured to 20 tells the SuperAdmin 50 | "Too many applications for one plan. Choose fewer." |
| F-W06-09 | P2 | Monitors says "have no product trigger in this build" (`views/cases.ts:265`), against LD-04 wording | — | SA-01 uses LD-04 wording; Monitors fixed when WP-14 rebuilds it (or now, one sentence, at the architect's choice) |
| F-W06-10 | P2 | Queue row "Reassign" links to an anchor on the long case page (`admin.ts:104`) | — | SA-03c |
| F-W06-11 | P2 | Core refuses an all-stale plan with the code `already_assigned` and no blockers (`assignment.ts:207-208`) | The page would claim every application is already assigned | The page states "Nothing in this plan was assigned" and the re-read per-row state; note to the orchestrator (not a fix in the lane) |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W06-01 | P1 | Pull `core.reassign` from WP-12 into WP-06 (SA-03c with the composed preview) | An operator is suspended; SA-01 shows "Applications whose operator is not active", whose only action is reassign; without SA-03c the link goes to a form on the old case page in another layout | Yes. WP-12 adds custody detail to the preview |
| Q-W06-02 | P1 | Move assign, reassign, Gate 1 grant and revoke off the old case page (links instead); about 20 system-test call sites change their GET source | Two forms record one decision with different wording; tests keep passing against the old form while the new page is broken | Yes (CC-12) |
| Q-W06-03 | P1 | `/admin` (SA-01) becomes the SuperAdmin landing; Monitors stays as the second Home tab until WP-14 | A SuperAdmin signs in and lands on counts without the queue items that unblock work | Yes; one shell value; two system tests change |
| Q-W06-04 | P1 | The plan result lives on the preview path with the items in the address (`done=plan&op=`) | Without the item order the result cannot name the applications; the summary carries indexes only | Yes (D-W06-06) |
| Q-W06-05 | P1 | The confirm posts every previewed row (as today); the copy states the re-check | Posting only assignable rows breaks Core's round-robin check (`plan[i] = operators[i mod n]`, `assignment.ts:159-162`) and silently changes which operator gets which application | Keep posting every row; truthful copy (F-W06-01) |
| Q-W06-06 | P2 | Gate 1 as two kinds (assignment, first work) rather than one page with an action choice | The effect differs per action; one page with a choice puts the effect after the choice, against "exact scope first" | Two kinds |
| Q-W06-07 | P2 | A BFF-only hidden `applicationId` on the revoke form (D-W06-05) | Without it a refused revoke cannot re-render its page (no query by exception id) | Accept; Core ignores it |
| Q-W06-08 | P2 | Import issues stay on the existing page until WP-18 | Rebuilding touches the shared intake renderer during the bulk lane's work | Keep; SA-01 counts it |
| Q-W06-09 | P2 | SA-02a filter by service payment in the BFF over Core's list | A SuperAdmin wants only the paid applications to assign first | Accept as presentation of a Core field |
| Q-W06-10 | P1 | V06 writes on `lane-ui`: one group and four applications per run, payments, three exceptions, assignments to syn-operator-1/-2/-3, one reassignment, one revocation, operator first work on the old operator page | A rerun meets earlier synthetic rows; the proof identifies its rows by the dated group label | Approve; synthetic only; seeded data not changed |
| Q-W06-11 | P2 | `admin.home` resource declaration (`self` or the queue resource) | — | Implementer checks the resource type set |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W06-01 | New GET SA-01 at `/admin` (D01 gets id `admin.home`); SuperAdmin landing changes | New route id; one shell value |
| D-W06-02 | New GET pages on POST paths: SA-03a, SA-03c | New routes and inventory entries; actions and fields unchanged |
| D-W06-03 | New SA-09 route family `/admin/applications/:id/decide/:kind[/:subjectId]` | New routes; POST actions unchanged |
| D-W06-04 | Grant form: `gate` and `action` become hidden, fixed by the kind | Names unchanged; values fixed |
| D-W06-05 | Revoke form: new hidden `applicationId`, read by the BFF only for re-render; not sent to Core | One new hidden field |
| D-W06-06 | Plan confirm answers 303 to the preview path with `done=plan&op=` (was `/admin/queues/assignment?done=plan`) | Location changes; fields unchanged |
| D-W06-07 | WP-06 forms leave the old case page and the queue rows; the carried grant form keeps only Gate 2 and readiness values | Host page changes; system tests change their GET source |
| D-W06-08 | SA-02a reads `item`, `mode`, `operator` from its own address to prefill; SA-03b refuses an absent `mode` instead of defaulting | Address state (opaque ids, enumerated values only, SH-R06) |
| D-W06-09 | `core.reassign` built in WP-06 (register WP-12) | Register row |
| D-W06-10 | Import issues, Imports, Documents and Monitors not rebuilt in WP-06 | None |
| D-W06-11 | The exception decision records a reason only (no evidence reference): Core takes none | None (STOP-W06-01) |
| D-W06-12 | "Due from the travel agent" removed from SA-07a | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W06-01 | Kind 2 (new input to an existing command) | An evidence reference on `core.grant_gate_exception` | UX §6.3 "Exception: require application, named gate, specific action, reason and evidence"; UI-PLAN §7 row "Record gate exception" inputs include evidence | Kind 2 gate applies (a new command input changes what Core records); the UI has no vote | SA-09g shows the evidence facts Core holds (payment entries, help state, evaluation) and records the reason. P2, parked |
| STOP-W06-02 | Kind 1 (projection of existing facts) | `granted_by`, `granted_at`, `reason` (and revocation facts) on `core.admin_case.case.gateExceptions[]` | SA-09r and SA-09g show who granted an open exception and why (evidence before a revocation) | 1. Columns exist (`core_gate_exceptions`, `gates.ts:81-83`). 2. Removes a trip to the audit page for a P0 decision page (round trips). 3. Same scope as `core.admin_case`. 4. Field addition to an existing view; the architect decides whether a field addition needs the criterion (as WP-02 STOP-W02-01) | "In the audit history" link. P2 |
| STOP-W06-03 | Kind 1 | A reassignment preview read (the transfer set Core would move) and the transfer set in the `core.reassign` result summary | UX §6.3 "Reassignment preview names old/new operator and retained custody holder, transfers all unresolved duties"; the receipt cannot list what moved | 1. Facts exist (`assignment.ts:245-249` computes them). 2. Removes a client-side composition of two reads (admin case, case work). The result-summary part is a command result change: Kind 2 | Composed preview from `core.admin_case` and `ops.case_work` with "the history records exactly what moved". P2 |
| STOP-W06-04 | Kind 1 (existing inventory item RM-A1, §4 item 3) | A "decisions waiting" projection | SA-01 composes ten reads per load | As inventory | BFF composition; measure before proposing. P2 |

No STOP item blocks the WP-06 main path. No P0 item is open in this design.
