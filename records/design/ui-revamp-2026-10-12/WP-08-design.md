# WP-08 design review: outcome, delivery and completion surfaces

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-08
holds commands that change outcome, artifact association and delivery facts, so a Codex design review applies).
Product base: lane repository at 42cb373 (WP-01 shell and result components, WP-20 public site, LD-14 sweep).
WP-02, WP-03 and WP-06 are designed and not yet built; WP-07 is not designed yet. This design depends on their unit
U0 components and on the rebuilt TA-07 of WP-03 (§1.6, §7.1). This document writes no product code. Paths in
`file:line` form are relative to the lane repository at 42cb373 unless they start with `REC/` (`internal/records/`)
or `RM` (lane `research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 42cb373. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** OP-05 Outcome and result file (record outcome with Core's allowed values only, record a result file or
  a replacement, the declared cancellation), OP-05r Result file association review (confirm or reject, review copy;
  no "accept best match"), OP-06 Result delivery (send preview, the send boundary, manual email record, resend of a
  failed send, operator downloads, carried WP-10 records), OP-07 Request completion (prerequisites, continuing
  duties, the completion boundary), TA-07 "Result and delivery" section (outcome, result file download, separate
  delivery facts, closing steps), TA-07d the travel agent's delivery page, TA-07s and OP-06s "Download of several
  files" (CC-10), TA-10 Notices and TA-10n Notice (LD-06), TA-07x Application history (CMP-09, Q-W03-15).
- **Commands.** Six served commands of the register (`ops.record_official_result`, `ops.record_artifact`,
  `core.record_outcome`, `ops.confirm_artifact_association`, `ops.reject_artifact_association`, and the review
  copy byte release) plus three pulled in (Q-W08-01, Q-W08-02): `dlv.record_manual_email`, `dlv.manual_resend`
  (WP-19 today) and the travel agent route of `dlv.acknowledge_notice` (WP-17 today). Two deliberate boundaries
  (`dlv.queue_document_email`, `core.check_completion`) are shown as Core reports them, with no form. Byte releases
  `dlv.retrieve_document` and `dlv.retrieve_selection` are available actions (LD-05) with a recheck at every
  release (K-BYTE). `ops.open_incident` gets no WP-08 form: Core refuses result-file incident kinds for operators
  (`src/kernel/vocabulary/operations.ts:59`); the register row moves to WP-14 (Q-W08-08). Release packet and packet
  handover stay WP-10, as the register says; their forms are carried.
- **Page model.** Existing paths stay (LD-03): `/ops/applications/:id/delivery` becomes OP-06, the TA delivery,
  selection, notices and history paths stay. Three new GET pages: OP-05 `/ops/applications/:id/outcome` (beside the
  cancellation POST), OP-05r `/ops/incidents/:id/association`, OP-07 `/ops/applications/:id/completion`. No form
  action and no field name changes.
- **LD-04 wording (§2.10).** One closed wording table replaces every "not decided", "undecided", "unselected" and
  "Owner not yet decided" text of the three boundary codes, in eight current places (F-W08-01). Staff copy: "Send
  result is unavailable until it is added to the product. Owner: TravelMudra." with the decided rule stated. The
  required sentence "Email delivery is uncertain. No automatic resend will occur." is used verbatim.
- **Findings worked (§9.1).** No page offers "Record the result file" after an outcome recorded without one (stuck
  V13 path, F-W08-02); the SuperAdmin delivery page shows a completion control (CC-07, F-W08-03); a disclosure
  deletion request can be acknowledged from a list without its instruction (F-W08-08); the operator's file
  availability reads as send eligibility (F-W08-11); the TA history hides a failed or uncertain email (F-W08-06).
- **STOP items (§9.4).** No P0. STOP-W08-01 (Kind 1, P1): the travel agent's current account email on the staff
  delivery read (criterion point 2 not met; Max's exception needed, as P-05). STOP-W08-03 (Kind 1, P1): candidate
  identity facts for an association reviewer who is not the case's operator. Five Kind 1 items at P2.
- **Proofs (§6).** V13 runs on `lane-ui` with result PDFs generated in memory. V14 and V17 run to their boundary on
  `lane-ui`; sends, email states and the completed state are proven by tests, because only the labelled harness
  sends email or completes a case (`src/modules/core/commands/admin.ts:171-218`, `src/modules/delivery/commands/email.ts:112-170`).

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` | §2.2, §2.3, §3.1 steps 7–9, §3.2, §3.3, §4.2, §4.4, §5.3 (artifact review, send result, uncertain email, request completion), §7.3, §7.4, §8.2, §8.3, §10.1, §12 V13–V17 |
| `BUILD_SPEC.md` r2 | B10, B12, B13, B21, B24, B31, B33, B35, B45, B46 |
| `UI-PLAN.md` | A (AD-01, AD-02, AD-09, AD-10, AD-13), §1, §2.1–2.3, §3.2 TA-07, TA-10, §3.3 OP-02, OP-05 to OP-07, §4.1 steps 11–13, §4.2 (completed with continuing duty), §5.2 TA-07, TA-10, §5.3 OP-05 to OP-07, §6, §7 (K rules; rows 1142–1180), §8 (CMP-02, 08, 09, 10, 18, 19, 21), §10, §11, §12.1, §13 |
| `DECISIONS-2026-10-10.md` | §1.1, §1.2, §1.3 (OC-01 to OC-05), §1.5 (OC-09), §3 |
| `SURFACE-INVENTORY-2026-10-10.md` | RM-S4, RM-O5 to RM-O7; CMD-15, CMD-16, CMD-18, CMD-40 to CMD-48; §4, §6 |
| Lane records | `PLAN.md` §4 (LD-01 to LD-15), §7, §8 (S-08); `PROPOSALS.md` (P-02, P-10); `COMMAND-COVERAGE.md` §3, §4, §5, §6 (CC-06, CC-07, CC-10); `WP-01.md` §3, §4 (A-01 to A-12, code review R-01 to R-05); `WP-02.md` §4.1 (B-02, B-03); `WP-03.md` §3 (Q-W03-15), §4.1 (C-02, C-03, C-07); `WP-03-design.md` §1.5, §2.0, §2.7, §3; `WP-06.md` §4.1 (D-02); `WP-06-design.md` (structure; §2.1 group 13); `DESIGN.md` |
| Route map (RM) | §2.1 rows C04–C06 (ta), T19, T20, T28, T29, T56–T58; §2.2 rows C04–C06 (ops, admin), O03, O04, O12, O21, O22, O27–O30, O35–O41, O46, O48, O51, O53–O57, D12, D13, D116, D118–D120; §3.1, §3.2; §5 items 2, 6, 7, 11 |
| Code (pages, routes, read models) | `src/apps/shared/delivery/{pages,routes}.ts`, `src/apps/edge/delivery/routes.ts`, `src/apps/staff/delivery/routes.ts`, `src/apps/staff/operations/{case-work,incidents,labels}.ts`, `src/apps/staff/core/{ops,case}.ts`, `src/apps/shared/core/{ta,shared}.ts`, `src/apps/shared/views/{ta,cases}.ts`, `src/apps/staff/views/cases.ts:258-266`, `src/web/ui/{results,presentation}.ts`; contracts `src/contracts/{delivery,operations-work,core,views-cases}.ts` |
| Code (Core behaviour only) | `src/modules/delivery/{pages,release}.ts`, `src/modules/delivery/commands/{handover,email,notices}.ts`, `src/modules/operations/case-work/{association.ts,commands/results.ts,commands/incidents.ts}`, `src/modules/core/{derived,controls}.ts`, `src/modules/core/commands/{acts,admin}.ts`, `src/core-api/bindings/{delivery,operations-work}.ts`, `src/kernel/vocabulary/{delivery,operations,incidents,views}.ts` |
| Tests that pin the pages | §7.3 |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry. Route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14): an availability failure renders "Unavailable"; every other refusal
reaches the shell.

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| OP-05 | Outcome and result file | `/ops/applications/:applicationId/outcome` (GET beside the cancellation POST) | **New** (`ops.applications.outcome_form`, action `application.read`) | `core.ops_case`; `ops.case_work`; opt. `ops.official_result_form` (only when `caseWork.offers.recordOfficialResult ≠ null`) |
| OP-05r | Result file association review | `/ops/incidents/:incidentId/association` | **New** (`ops.incidents.association`, action `incident.read`) | `ops.incident`; opt. `ops.case_work` and opt. `core.ops_case` of the incident's application, only when `incident.application ≠ null` and `viewerIsReviewer = false` (the rule of today's `namesFor`, `incidents.ts:256-262`) |
| OP-06 | Result delivery | `/ops/applications/:applicationId/delivery` | Kept, rebuilt (`ops.delivery`) | `dlv.delivery_page`; `core.ops_case` |
| OP-06s | Download of several files (operator) | `/ops/selections/:selectionId` | Kept, rebuilt (`ops.selections.one`) | `dlv.selection` |
| OP-07 | Request completion | `/ops/applications/:applicationId/completion` | **New** (`ops.applications.completion`, action `application.read`) | `core.ops_case`; opt. `ops.case_work` (open incidents) |
| TA-07r | TA-07 section "Result and delivery" | `/ta/applications/:applicationId#result` | Rebuilt section of the WP-03 TA-07 (replaces the carried WP-08 section) | adds opt. `dlv.delivery_page` when `lifecycle ≠ draft` (Q-W08-06); WP-03 reads stay |
| TA-07d | Delivery (travel agent) | `/ta/applications/:applicationId/delivery` | Kept, rebuilt (`ta.delivery`; support view: yes, read only) | `dlv.delivery_page`; opt. `core.ta_application` (context band and closing steps) |
| TA-07s | Download of several files | `/ta/selections/:selectionId` | Kept, rebuilt (`ta.selections.one`) | `dlv.selection` |
| TA-10 | Notices | `/ta/notices` | Kept, rebuilt (`ta.notices`; support view: yes) | `dlv.notices`; opt. `core.ta_applications` (applicant names only) |
| TA-10n | Notice | `/ta/notices/:noticeId` | Kept, rebuilt (`ta.notices.one`; support view: yes) | `dlv.notice`; `core.operation` (receipt only, through `readReceipt`) |
| TA-07x | Application history | `/ta/applications/:applicationId/history` | Kept, rebuilt (`ta.applications.history`; support view: yes) | `views.ta_history`; opt. `core.ta_application` (applicant name for the breadcrumb) |
| (old) | Operator case page | `/ops/applications/:applicationId` (or WP-07's OP-02) | Not rebuilt here. The result, replacement and cancellation forms leave it; it links to OP-05, OP-06, OP-07 (§1.5) | unchanged |
| (old) | Incident page | `/ops/incidents/:incidentId` | Not rebuilt (OP-08, WP-14). The confirm, reject and review-copy forms leave it; it links to OP-05r | unchanged |
| (old) | SuperAdmin delivery view | `/admin/applications/:applicationId/delivery` | Not rebuilt (SA-04, WP-11). Its boundary block gets the §2.10 wording and loses the completion control (CC-07) | unchanged |
| (old) | Operator and SuperAdmin notices | `/ops/notices[/:id]`, `/admin/notices[/:id]` | Not rebuilt (OP-10, SA-10: WP-15). They keep the old renderer | unchanged |

Each new GET route: `params` zod with `applicationId: zWireId('app')`, or `incidentId` as today
(`z.string().max(40)`, checked at Core, `incidents.ts:241`); a parse failure is the uniform 404. `resolve` returns
the resource that the POST routes on the same paths return (`application`, `incident`). OP-05r answers the uniform
404 when the incident is not of kind `artifact_association` (the page has no other use), so it discloses nothing
about other incident kinds.

### 1.3 Shell placement (WP-01 §2.2)

| Rail destination | Pages that pass it as `current` | Notes |
|---|---|---|
| Operator: My work `/ops/work` | OP-05, OP-06, OP-06s, OP-07 | As the current delivery page does (`pages.ts:239-241`). Breadcrumb "My work › [applicant] › [page]", the applicant links to the operator case page (OP-02). |
| Operator: Incidents and follow-up `/ops/incidents` | OP-05r | As the incident page does. Breadcrumb "Incidents › [incident title] › Association review". |
| TA: Applications `/ta/applications` | TA-07 (section), TA-07d, TA-07s, TA-07x | Breadcrumb by origin as WP-03 §2.7 item 1, then "› Delivery" or "› History". |
| TA: Notices `/ta/notices` | TA-10, TA-10n | Breadcrumb "Notices". |

OP-05, OP-06 and OP-07 carry one local strip `objectTabs` (WP-02 U0) named "Delivery and completion" with three
members: "Outcome and result file", "Result delivery", "Request completion". When WP-07 has built OP-02 with its
"Delivery & originals" tab (UI-PLAN AD-09), the three pages sit under that tab and the strip is its second level
(Q-W08-14). The nav counts do not change: the TA "Notices" count stays the count of notices that wait for an
acknowledgement (`src/apps/shared/attention.ts`).

### 1.4 The WP-08 commands, boundaries and byte releases, and their pages

Field names are the current ones; none changes. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>`
hidden field. "Handler change" lists rendering-only changes; no command input mapping changes.

| # | Command or release | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.record_official_result` | `ops.case_work.official_result` (`/ops/applications/:id/official-result`, multipart) | **OP-05** (moved from the case page) | `outcome` (select from Core's `outcomes`), `evidence.0.kind`, `evidence.0.id`, `eventAt` (date), `artifactType`, `file` (optional) | `application` | Refusal re-renders OP-05 at the POST address (`restorePath` = OP-05) with the typed values kept (the file is chosen again); success `receiptLocation('/ops/applications/<id>/outcome', 'result', key)` |
| 2 | `ops.record_artifact` | `ops.case_work.artifact` (`/ops/applications/:id/artifacts`, multipart) | **OP-05** | `replacesArtifactId` (optional select; value `art_…` or `art_…:inc_…` as today), `artifactType`, `file`; `incidentId` stays accepted | — (Core answers `stale_revision` when the replaced file was replaced meanwhile) | As #1; receipt code `artifact`. New: the form is also offered with no `replacesArtifactId` when no current result file exists (F-W08-02) |
| 3 | `core.record_outcome` (cancellation) | `ops.case_work.cancelled` (`/ops/applications/:id/outcome`) | **OP-05** | `evidence.0.kind`, `evidence.0.id`, `reason` | `application` | As #1; receipt code `cancelled` (neutral title until P-10 b, §2.12) |
| 4 | `ops.confirm_artifact_association` | `ops.incidents.confirm_association` (`/ops/incidents/:id/confirm-association`) | **OP-05r** (moved from the incident page) | `artifactId` (hidden), `chosenApplicationId` (radio, D-W08-17), `verified.surname`, `verified.passportNumber`, `verified.type` (checkboxes, value `yes`, never prechecked) | `incident` | Refusal re-renders OP-05r; success `receiptLocation('/ops/incidents/<id>/association', 'confirmed', key)` |
| 5 | `ops.reject_artifact_association` | `ops.incidents.reject_association` (`/ops/incidents/:id/reject-association`) | **OP-05r** | `artifactId` (hidden), `note` | `incident` | As #4; receipt code `rejected` |
| 6 | `dlv.retrieve_for_review` (byte release) | `ops.incidents.review_copy` (`/ops/incidents/:id/artifacts/:artifactId/review-copy`) | **OP-05r** | — | — | Refusal re-renders OP-05r with the reason (today: shell error page, `staff/delivery/routes.ts:157-161`); bytes stream on success |
| 7 | `dlv.record_manual_email` (register WP-19; Q-W08-01) | `ops.delivery.manual_email` (`/ops/applications/:id/manual-emails`) | **OP-06** | `recipientEmail`, `version.N`, `evidence.0.kind`, `evidence.0.id`, `eventDate` | — | Refusal re-renders OP-06 with the form open and values kept; success `receiptLocation('/ops/applications/<id>/delivery', 'manual_email', key)` |
| 8 | `dlv.manual_resend` (register WP-19; Q-W08-01) | `ops.delivery.resend` (`/ops/email-sends/:emailSendId/resend`) | **OP-06** | `reason`; `applicationId` (hidden, BFF only, as today) | `email` | As #7; receipt code `resend` |
| 9 | `dlv.queue_document_email` (deliberate boundary) | `ops.delivery.document_email` (`/ops/applications/:id/document-email`) | **OP-06** | none: no form posts it (RM §5 item 7) | — | A hand-made POST re-renders OP-06 with Core's boundary refusal (409), as today |
| 10 | `core.check_completion` (deliberate boundary) | `admin.delivery.completion_check` (`/admin/applications/:id/completion-check`) | none (CC-07); OP-07 shows the boundary | none | — | Unchanged (re-renders the SuperAdmin delivery view with the boundary); the view shows no control |
| 11 | `dlv.retrieve_document` (byte release, one file or the packet) | `ta.delivery.retrieve`, `ta.delivery.packet_retrieve`; `ops.delivery.retrieve`, `ops.delivery.packet_retrieve` | **TA-07r**, **TA-07d**; **OP-06** | — | — | Refusal re-renders the page it came from (TA-07 or TA-07d by a hidden BFF-only `from` field, D-W08-11; OP-06) with fresh form tokens |
| 12 | `dlv.retrieve_selection` (byte release, ZIP) | `ta.selections.create`; `ops.selections.create` | **TA-07d** (CC-10, Q-W08-09); **OP-06** | `applicationId` (hidden), `item.N` = `document_version:<dov>` | — | Refusal re-renders TA-07d or OP-06 |
| 13 | `dlv.acknowledge_notice` (travel agent route; register WP-17; Q-W08-02) | `ta.notices.acknowledge` (`/ta/notices/:noticeId/acknowledge`) | **TA-10n** only (inline list and delivery-page forms removed, D-W08-04) | — | `notice` | Refusal re-renders TA-10n (as today, `shared/delivery/routes.ts:118-126`); success `receiptLocation('/ta/notices/<id>', 'acknowledged', key)` |

Each command has exactly one host page for its WP-08 use, so a refusal re-renders the page it came from. Rows 11
and 12 are byte releases, not commands (register §4); each release, including a retry, is a new recorded check.

### 1.5 Carried forms and forms that leave other pages

Carried (LD-07: a served command keeps its page). Each keeps its current markup, fields, action and success
redirect (`?done=` flash). The owning package rebuilds it. A unit test lists them by action path (§7.2).

| Command | Owner | Page in WP-08 | Placement |
|---|---|---|---|
| `dlv.record_handover` | WP-10 | OP-06 | Section "Other delivery records", disclosure "Record a handover" (today `pages.ts:506-524`, with its packet-waits note `:500-505`) |
| `dlv.record_direct_external` | WP-10 | OP-06 | Same section, "Record a delivery made directly by an external party" (`pages.ts:538-549`) |
| `ops.report_wrong_recipient` | WP-14 | old case page (or OP-02) | Unchanged (`case-work.ts:264-300`); OP-05 links to it for a released file ("Report a release to a wrong recipient") |
| `ops.open_incident` (operator kinds) | WP-14 | old case page (or OP-02) | Unchanged (`case-work.ts:407-415`) |
| `ops.request_packet_build`, `core.release_packet` | WP-10 | old case page (or OP-04) | Unchanged |
| `dlv.acknowledge_notice` (ops, admin routes) | WP-15 | OP-10, SA-10 notice pages | Unchanged; the inline acknowledge forms on the old staff delivery views go (D-W08-04) |
| SuperAdmin single-file retrieval with purpose and reason | WP-11 (SA-04) | old SuperAdmin delivery view | Unchanged |

Forms that leave other pages (one host page per command, as WP-06 CC-12):

- The operator case page (`case-work.ts:227-263`, or WP-07's OP-02 if it is integrated first): the official-result,
  replacement and cancellation forms leave. The section "Official result and files" keeps its table read only and
  gets one link "Record or review the outcome and result file" (OP-05). The section "Delivery and completion"
  (`case.ts:375-382`) becomes two links, "Result delivery" (OP-06) and "Request completion" (OP-07), with the
  checklist kept read only.
- The incident page (`incidents.ts:159-180`): the review-copy, confirm and reject forms leave. For an
  `artifact_association` incident the "Candidates" section keeps its table and gets one link "Review the
  association" (OP-05r).
- The TA delivery page and the ops and admin delivery views: the inline "Acknowledge" forms of the notices section
  (`pages.ts:474-485`) leave. Each notice links to its notice page, which holds the form (F-W08-08).
- The SuperAdmin delivery view: the disabled "Run the completion check" and "Send the result by email" controls
  (`pages.ts:558-564`) leave (CC-07, F-W08-03). The view keeps a read-only boundary note with the §2.10 wording.

### 1.6 Shared components

Reused, no new variant: WP-01 §7 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`,
`readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`),
CMP-13 (operation status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-01 `actionPanel`, `statusFacts`,
`objectTabs`. WP-03 U0: CMP-02 `evidenceRows` (not used for result files: a result file is not a requirement row),
CMP-11 `identityBand`, CMP-24 `contextBand`. Existing parts: `dataTable`, `summaryList`, `checklist`,
`checkboxField`, `choiceGroup`, `selectField`, `textField`, `textareaField`, `fileField`, `disclosure`,
`confirmDisclosure`, `identifier`, `timeAt`, `timeline`.

Dependency: WP-08 builds after the WP-02 U0, WP-03 U0 and WP-03 U3 commits (TA-07 rebuilt). If one is not
integrated, WP-08 waits; it MUST NOT build a second action panel, status-facts list or TA-07 frame.

New in WP-08 (unit U0, §7.1), in `src/web/ui/delivery.ts`:

- **CMP-18 Delivery attempt row and file row** (`fileRows`, `attemptRows`). `fileRows`: one row per file: File
  (name from the closed label rule, §2.11), Kind ("Official result", "Your document", "Preparation packet"),
  Version ("Current version" or "Replaced by a newer version", and the version reference as a copyable
  `identifier`), Check now (text, §2.11), Action (a download form, a reason, or nothing). `attemptRows`: one row
  per email send or record: Started (time IST), Files ("[n] files" and their names where known), Channel ("Document
  email", "Email sent by an operator", "Handover", "Delivered by an external party"), Result (closed text of
  §2.11), Result time, Action (resend form, boundary reason, or nothing). States: included, unavailable, failed,
  uncertain, proven success, proven failure (UI-PLAN CMP-18). Every state is text, never colour only (AC-06).
- **CMP-21 Notice item** (`noticeItem`). Notice text (link to TA-10n), application (link), posted time IST,
  acknowledgement fact in one of three texts: "Needs your acknowledgement", "Acknowledged [time] IST", "No
  acknowledgement asked". No read or unread marker (LD-06).
- **Delivery facts list** (`deliveryFacts`). A definition list with one row per delivery fact (§2.11): email,
  notice in TravelMudra, downloads, acknowledgement, handover. A fact that does not apply is left out; a fact
  whose read failed reads "Unavailable".
- **CMP-09 Timeline**: the existing `timeline` (`src/web/ui/status.ts`) with one change in the caller: each entry
  states "Recorded [time] IST" in text (no event time exists in the TA history read; D-W08-13).

## 2. Page specifications

### 2.0 Rules common to every WP-08 page

- **Freshness (LD-08).** Every WP-08 read is authoritative except `views.ta_history`. Pages show CMP-12 "Read at
  [time] IST". TA-07x shows the projection's lag form ("Up to date when read at …", "Behind by [n] s when read at
  …", "Freshness unavailable") from `asOf.healthy` and `asOf.lagMs`. No page applies its own age threshold.
- **Page states.** S1 Loading: pages are rendered complete by the server; no skeleton exists. S5 Stale: TA-07x only.
  S6 Denied and S7 Error: the SH-02 pages of WP-01 (uniform 404 without object facts; Core unreachable: the neutral
  "TravelMudra is unavailable now" of WP-01 A-09, WP-02 B-03; "Nothing was sent, so nothing changed" only after a
  proven refusal). Each page below lists only S2, S3, S4 and its own variants.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders "Unavailable" in place of
  each fact the read supplies. Every other refusal reaches the shell. No page code catches every error.
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>`; CMP-08 first in `main`, its title
  first in the document title; recorded facts only from the operation summary and from records selected by the ids
  it returns; every later read labelled "Current" (WP-02 B-02, WP-03 C-03). Where the command cannot be
  established from resource kind, id and summary, the receipt is neutral, "Request recorded" (WP-06 D-02; P-10 b
  pending, S-08). REJ: the host page re-rendered at the POST address with `restorePath` = the GET page, the
  category's status, CMP-07 focused, every typed value kept except files; sentences from the closed tables (§2.14);
  an unknown code shows the category text plus "Reference code: [code]" (staff) or "Reference: [code]" (travel
  agent, UAT-13 rule). C5: CMP-14 (§2.13). UNR: 303 to `/<surface>/operations/<key>`; the page MUST NOT offer a new
  submission of the same intent.
- **K rules.** `ops.record_official_result`, `ops.record_artifact`, `core.record_outcome`,
  `ops.confirm_artifact_association`, `ops.reject_artifact_association`, `dlv.record_manual_email`,
  `dlv.acknowledge_notice`: K-STD. `dlv.manual_resend`: K-EXT (a deliberate new send needs a new identity; Core
  allows one resend per failed send). Byte releases: K-BYTE (§3). A form carries one `_op` from page load; a browser
  resend reuses it; a re-render after a refusal issues a new `_op` on every form of the page.
- **Boundaries (LD-04).** A deliberate boundary is shown as Core reports it: the codes in `dlv.delivery_page.unavailable`,
  the completion prerequisites' codes and the pending answer. The wording is the closed table of §2.10 only. No page
  says that a product owner still has to choose a trigger, an owner or a handling rule.
- **Delivery truth (B31, UX §3.3).** Sending, web notice, retrieval and acknowledgement are separate rows. A download
  is "Sent in full", never "Received" or "Delivered". Acceptance by a mail provider is "Accepted by the mail
  provider", never "Delivered" or "Received". An uncertain or failed result is never success.
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic"
  (CR-08). Forbidden: "Received", "Delivered" (for a download or an accepted email), "Done", "Approved" as an
  overall status, "accept best match", "Force complete", "Something went wrong", "Download again" as a promise of
  the same bytes. No configured number (selection size, attachment count, file size) appears in copy unless a read
  returns it. All copy is draft (CR-09).
- **Support view.** TA-07, TA-07d, TA-07x, TA-10 and TA-10n render at staff with no form. A download the travel agent
  could start shows disabled with "Read only in a support view: only the travel agent downloads it." The staff pages
  OP-05 to OP-07 are not reachable in a support view (`/ops` answers 409 `support_view_active`).
- **Read grant.** An operator with a group read grant reads OP-05, OP-06 and OP-07 (Core offers no action: every
  offer is null); the pages show "Read-only access: [purpose], until [end]" from the shell (SH-R10) and no form.
- **Mobile (< 768 px).** One column. Identity, status facts and the next action come before details (AC-21). File
  and attempt rows become labelled cards. OP-05r is a full-screen task page: evidence before the decision. The
  primary action sits at the end of its form, never in a fixed bar.

### 2.1 OP-05 Outcome and result file `/ops/applications/:applicationId/outcome`

Purpose: record the official outcome and the exact result file, and see whether the file can be released (UX §5.3
"Artifact review"; UI-PLAN OP-05; BS B13, B21).

Anatomy (reading order):

1. Header: breadcrumb "My work › [applicant] › Outcome and result file"; `h1` "Outcome and result file:
   [applicant]"; meta: Application reference (copy), Service (`offering.title`), Mode (`offering.serviceMode`
   label), Travel agent (`names[ta_account_id]`), "Synthetic" when synthetic; freshness "Read at [time] IST".
2. Local strip "Delivery and completion" (§1.3).
3. Receipt (`result`, `artifact`, `cancelled`; §2.12).
4. Status facts (`statusFacts`), each its own row: Outcome (`outcomePresentation`, or "Outcome not recorded");
   Stage (lifecycle); Filing (the act states of `acts`, "No external act recorded" when none); Result file (one line
   per current artifact: "[type]: [association text] · [delivery text]", §2.11; "None recorded" when none).
5. Action panel (CMP-01) "Next action", from Core's pending answer only (`pending.ownerKind`, `reasonCode`,
   `nextActionCode`). Mapping: `record_outcome` → "You: record the official outcome." with the anchor to the
   form; `resolve_incident` with `artifact_not_eligible` → "You: record the result file, or finish its association
   review." with the anchor to the result-file form or the OP-05r link; `reconcile_filing` →
   "Reconcile the filing first. The outcome waits for conclusive filing evidence." with a link to the external
   actions page (OP-04); any other answer → Core's sentence and owner, no action.
6. `h2` "Record the official outcome" (`id="record-outcome"`), only when `caseWork.offers.recordOfficialResult ≠ null`:
   - `allowed = true`: the form of §1.4 row 1. "Outcome" is a radio group (`outcome`) whose options are exactly
     Core's `ops.official_result_form.outcomes` (labels "Issued", "Refused"); none preselected. The heading reads
     "Record a later official fact" when the outcome is `external_outcome_unresolved` (Core's rule, `results.ts:110`).
     "Evidence" (`evidence.0.kind` with the two business kinds, as today; `evidence.0.id`); "Date of the outcome"
     (`eventAt`, date); "Type of the result file" (`artifactType`, select from `artifactTypes`; a text field when the
     list is empty, as today); "Result file" (`file`, optional, PDF, JPEG or PNG, the size stated from the shared
     upload rule). Review (visible): "When you record: TravelMudra records the outcome with your evidence. A result
     file is checked and associated with this application before it can be released. Recording sends nothing to the
     travel agent." Button "Record the outcome".
   - `allowed = false`: CMP-10 or a blocked callout with each blocker sentence (§2.14), as `offerCallout` does
     today; for `filing_not_evidenced` the sentence "The filing is uncertain: record conclusive evidence that it was
     filed or not filed, or a reconciliation finding, first." (today `case-work.ts:240-241`).
   - `ops.official_result_form` unavailable: the form shows with a text field for the type and the line "The
     allowed outcomes cannot be read now. TravelMudra checks the outcome when you record it." (Core decides.)
7. `h2` "Result files" (`id="files"`): table from `caseWork.artifacts`: File (type), Version (reference, copy),
   Association (§2.11), Delivery (§2.11), Replaced by (link to the row), Incident (link: "Review the association"
   → OP-05r for an `artifact_association` incident; "Open the incident" → OP-08 for any other), Recorded (time
   IST). Line under the table: "A result file is released only when its association is verified and it is
   current. A replaced file is never released again, and no other file is sent in its place."
8. `h2` "Record a result file" (`id="record-file"`), only for the assigned operator (`viewerAssigned`, outside a
   support view) while the application is open: the form of §1.4 row 2. "Replaces" is offered only when a
   replaceable file exists (as today, `case-work.ts:251-258`), with an explicit first option "No: a new result
   file" whenever no current verified or pending file of a declared type exists (F-W08-02). Review (visible): "When
   you record: the file is checked and associated before it can be released. A file it replaces is no longer
   released from that moment. A file replaced after a disclosure is that incident's correction once it is verified
   for this application." Button "Record the result file".
9. `h2` "Cancellation" (`id="cancellation"`), only when `caseWork.offers.recordCancelled ≠ null`:
   `confirmDisclosure` as today (`case-work.ts:242-247`), title "Record the cancellation?", body "The cancellation
   follows the path the service declares, with its evidence. It records the outcome Cancelled; nothing is sent."
   Blocked with `cancellation_undeclared`: CMP-10 "Recording a cancellation is unavailable until the service
   declares a cancellation path. Owner: TravelMudra." Other blockers: the blocked callout.
10. `h2` "Outcomes recorded elsewhere": one fixed paragraph per outcome Core records through another step, shown only
    when the current outcome is one of them: Withdrawn ("Recorded when the withdrawal was accepted."), Dependency
    failed ("Recorded by TravelMudra because the related application ended with an outcome this one cannot use."),
    Prepared and handed over ("Recorded with the packet handover."), External outcome unresolved ("Recorded after
    reconciliation of the filing was exhausted. A later official fact opens a follow-up and does not change it.").
11. Secondary links: "Report a release to a wrong recipient" (the carried WP-14 form on the case page, when a file
    was released), "Result delivery" (OP-06), "Request completion" (OP-07).

| State | Copy and controls |
|---|---|
| S2 no outcome, no file | Status "Outcome not recorded"; files table empty state "No result file recorded. A result file is recorded with the outcome, or here." |
| Issued, no result file (V13) | Status "Outcome: Issued"; "Result file: None recorded"; action panel "You: record the result file. Delivery of the result waits for it."; form of item 8 shown with "No: a new result file". The outcome is never changed or hidden because the file is missing |
| Issued, file pending review | Delivery "Withheld until reviewed"; link "Review the association" (OP-05r); action panel per pending answer |
| Issued, file rejected (not this case) | Delivery "Withheld: not this application's file"; incident link; item 8 offers a new file |
| File blocked after a disclosure | Delivery "Blocked after a release to a wrong recipient. It is never released again."; item 8 offers a replacement under that incident |
| Preparation-only service | No item 6 form (Core: `outcomes` is empty and the offer is blocked `service_mode_not_applicable`); line "This service ends with a packet handover. Its outcome is recorded with the handover (Result delivery)." |
| Read grant or not assigned | Facts only; no form; "Only the assigned operator records the outcome and result files." |
| C3 `result`, `artifact`, `cancelled` | §2.12 |
| C2 | §2.14 |
| C5 `_rev.application` | §2.13 |

Mobile: status facts → action panel → the form of the next action → files as cards → other sections.

### 2.2 OP-05r Result file association review `/ops/incidents/:incidentId/association`

Purpose: decide, with evidence, whether one result file belongs to one application (BS B13; UX §5.3 "Missing or
multiple candidates require a scoped reviewer and incident. Never add an accept best match shortcut").

Reads `ops.incident` (required). Reads the uploaded-for application's case only under the rule of §1.2. Core
authorizes the page (`incident.read`): the incident owner (by default the assigned operator) and a named reviewer
read it; another operator gets the uniform 404.

Anatomy:

1. Header: breadcrumb "Incidents › Result file needs review"; `h1` "Association review: result file
   [reference]"; meta: Incident reference, Opened [time] IST, State (`incidentStateBadge`), Owner (`ownerOf`),
   "You are the named reviewer" when `viewerIsReviewer`; freshness.
2. Receipt (`confirmed`, `rejected`).
3. `h2` "Why this needs review": `incident.note` or the automatic note (`AUTOMATIC_NOTE`, `labels.ts`); the fixed
   line "TravelMudra matches a result file to an application only when the name, the passport number, the declared
   type and exactly one application agree. Otherwise a person decides here." The rule's failure reason is not in
   the read model (STOP-W08-04).
4. `h2` "The file": Claimed type (from `caseWork.artifacts` row with `artifactId = incident.artifactId`, when the
   case read is allowed; else "Shown on the review copy"); Version reference (`incident.documentVersionId`, copy);
   Association now; the review copy form (§1.4 row 6): text "Open the file to compare the surname, the passport
   number and the type before you decide. Opening it is recorded." Button "Open a review copy" (secondary). The
   review copy is a byte release of the file itself; there is no in-page viewer (D-W08-10).
5. `h2` "Candidate applications": one row per `candidates[]` entry, in Core's order (the uploaded-for application
   first): Application reference, Group, and the identity facts the reader may see: for the uploaded-for
   application, when its case is readable, Surname, Given names, Passport number (full: an authorized comparison
   task, UX §5.3); for every other candidate "Identity facts are not shown to you" (STOP-W08-03). No row is marked
   "best", "likely" or "suggested", and no order other than Core's is applied.
6. `h2` "Your decision" (only when `offers.confirmAssociation.allowed`):
   - "Which application does this file belong to?" (`chosenApplicationId`, radio, one option per candidate, none
     preselected, D-W08-17). A candidate whose identity facts are not shown carries the hint "You cannot compare
     this candidate here. Confirm it only if you compared it another way, or ask its assigned operator."
   - "What you compared on the review copy" (`fieldset`): three checkboxes, never prechecked: "The surname on the
     file matches the chosen application." (`verified.surname`), "The passport number on the file matches the chosen
     application." (`verified.passportNumber`), "The file is the declared type of result." (`verified.type`).
   - Hidden `artifactId`, `_rev.incident`.
   - Review (visible): "When you confirm: the file is associated with the chosen application and becomes eligible
     for release to its travel agent. Your name and the three checks are recorded, and the incident is resolved."
   - Button "Confirm the association" (primary).
7. `h2` "Reject the association" (only when `offers.rejectAssociation.allowed`): `confirmDisclosure` (destructive
   variant, DESIGN.md): "Why the file is not this application's" (`note`, required, maxlength 2000); body "The file
   is withheld and is never released for this application. The incident then waits for a replacement file or for
   evidence that none is owed." Confirm label "Reject the association".
8. Unavailable decision: `offers.confirmAssociation` blocked `artifact_not_eligible` → "This file can no longer be
   associated: it was replaced, blocked or already decided." `rejectAssociation` blocked `version_blocked` → "The
   file is blocked after a release to a wrong recipient. Its association is not decided here."

| State | Copy and controls |
|---|---|
| Already decided (`association` verified or rejected; incident resolved) | Facts only: "The association was confirmed for application [ref]." or "The association was rejected."; no form |
| No candidate | Section 5 reads "No candidate application was found."; no confirm form; reject offered |
| Review copy refused (incident block, bytes unavailable, access) | Re-render with the reason (§2.14); the decision forms stay |
| Support view, read grant, or neither owner nor reviewer | Uniform 404 or no form (Core decides) |
| C3 `confirmed`, `rejected` | §2.12 |
| C2 `not_a_candidate`, `all_fields_required`, `artifact_type_already_eligible`, `artifact_cross_group`, `incident_not_open` | §2.14 |
| C5 `_rev.incident` | §2.13 |

Mobile: file and review copy → candidates as cards → decision. The decision form stays below the evidence.

### 2.3 OP-06 Result delivery `/ops/applications/:applicationId/delivery`

Purpose: show exactly what a result send would include, to whom, what was sent or recorded so far, and the operator's
served delivery actions (UX §5.3 "Send result"; UI-PLAN OP-06; BS B12, B24, B31).

Reads `dlv.delivery_page` (operator surface) and `core.ops_case`.

Anatomy:

1. Header: breadcrumb "My work › [applicant] › Result delivery"; `h1` "Result delivery: [applicant]"; meta:
   Application reference, Service, Travel agent, Outcome; freshness.
2. Local strip; receipt (`manual_email`, `resend`; the carried `handover`, `direct_external` keep their flash).
3. Refusal callout (CMP-07) when re-rendered.
4. `h2` "Send result" (`id="send"`): the preview, in this order.
   a. "Recipient" (`summaryList`): "To: The travel agent's current account email address" and, once STOP-W08-01 is
      served, the address as text; never an input. "Travel agent account: Active" or "Suspended: nothing is sent or
      released to a suspended account." (`taSuspended`). Line: "TravelMudra reads the address and the account again
      at the moment of any send."
   b. "Files": `fileRows` of the official results and the released packet in `files` (`subjectKind` `artifact` or
      `packet`). Column "Check now" (§2.11): "Releasable now" or "Not releasable now: [reason]". Caption line:
      "These checks ran for this page as you read it. They show the file's own state (version, association, blocks).
      TravelMudra checks each file and the recipient again at the moment of any send." (F-W08-11; STOP-W08-02.) No
      evidence document of the applicant is listed here; they are in item 7.
   c. "What this service requires" (`checklist` of two rows from `core.ops_case.completion`: `delivery` and
      `declared_completion`, with Core's `satisfied` flag and its codes as sentences, §2.10, §2.11). This is the
      notice requirement of UX §5.3, read from Core, not derived by the page.
   d. "Earlier sends and records": `attemptRows` of `emails` (document emails) and `handovers` (manual emails,
      handovers, external deliveries), newest first. A failed email shows the resend form (§1.4 row 8) when its
      `resendOffer.allowed`: "Reason for the resend" (`reason`, 2 rows, maxlength 1000, hint "At least ten
      characters. Recorded with the resend."), hidden `_rev.email`, `applicationId`; review "The resend is a new send
      attributed to you. TravelMudra checks each file and the travel agent's current address again before it sends."
      Button "Resend this email". A failed send already resent shows "Resent: [link to the new row]". An uncertain
      email shows the uncertain panel (§2.10 row 3) and no form. Empty: "Nothing was sent or recorded for this
      application yet."
   e. The send action: CMP-10 boundary notice (§2.10 row 1) and `unavailableButton` "Send result" described by it
      (AC-13). Shown whenever `unavailable` holds `delivery_send_trigger_unselected` (Core's answer). The notice's
      route is "Record an email you sent yourself" (`#manual-email`).
5. `h2` "Record an email you sent yourself" (`id="manual-email"`), when `offers.recordManualEmail ≠ null`: the
   form of §1.4 row 7. Text first: "An attributed record of an email you sent outside TravelMudra to the travel
   agent's current account address. It is not system-verified. It does not count as TravelMudra's delivery, and the
   completion check does not count it. An email to any other address is a release to a wrong recipient: report it
   instead." Fields: "Sent to" (`recipientEmail`, type email, hint "The travel agent's current account email
   address. TravelMudra refuses any other address."); "Files you attached" (`version.N`, one checkbox per non-packet
   file of `files`, never prechecked, labelled by the file name rule); "Evidence" (`evidence.0.kind`,
   `evidence.0.id`, hint "A reference you can find again, such as the sent message's identifier."); "Date sent"
   (`eventDate`, date, required). Button "Record the email".
6. `h2` "Other delivery records": the carried WP-10 forms (§1.5).
7. `h2` "Files of this application" (`id="files"`): `fileRows` of every file in `files` with the operator's download
   form (§1.4 row 11) when `available`, and the ZIP form (§1.4 row 12) when two or more non-packet files are
   available ("Download several files as one ZIP"; checkboxes `item.N`, all checked, labelled by file; line "Each
   file is checked again just before it is added. A file that is no longer releasable is left out and named in the
   results."). Blocked application (`applicationBlocked`): callout "Releases are paused. An open incident on this
   application stops every release while it is handled." above the table.
8. `h2` "Downloads and checks": the retrievals table as today (`pages.ts:435-472`) with the §2.11 result texts and
   "The ZIP's results" links (OP-06s) for the reader's own ZIPs.
9. Secondary links: "Outcome and result file" (OP-05), "Request completion" (OP-07).

| State | Copy and controls |
|---|---|
| No outcome yet | Item 4 shows the recipient and "No result file is recorded yet."; the boundary notice shows only when Core lists the code (Core lists it for every submitted application, `modules/delivery/pages.ts:201`) |
| Outcome recorded, no releasable result file | Item 4b empty state "No result file can be released now. [reason from the completion `artifact` prerequisite]" with the link "Outcome and result file" |
| Uncertain email (V16 part) | Row result "Uncertain"; the uncertain panel of §2.10 row 3 with Core's codes; no resend form; the boundary of §2.10 row 4 |
| Failed email | Row result "Failed: not sent"; resend form when allowed |
| Travel agent suspended | Recipient row as item 4a; the file checks show Core's reasons |
| Read grant | No form; facts only |
| C3 `manual_email`, `resend` | §2.12 |
| C2 `recipient_not_owning_ta` | On `recipientEmail`: "TravelMudra accepts only the travel agent's current account address. If you sent the email to another address, report a release to a wrong recipient instead." Values kept |
| C2 hand-made boundary POST | The page with the §2.10 row 1 notice, status 409; nothing recorded |
| C5 `_rev.email` | §2.13 |

Mobile: send preview (recipient, files as cards, requirements, the unavailable button) → earlier sends → manual
email → other records → files → downloads.

### 2.4 OP-07 Request completion `/ops/applications/:applicationId/completion`

Purpose: show what completion needs, with evidence and owner, and the completion step as Core reports it (UX §5.3
"Request completion"; UI-PLAN OP-07; BS B24; OD §3).

Anatomy:

1. Header: breadcrumb "My work › [applicant] › Request completion"; `h1` "Request completion: [applicant]"; meta;
   freshness.
2. Local strip.
3. Status facts: Stage (lifecycle: Submitted, Completed, Ended with the group); Outcome (separate row: "Completed"
   never implies an outcome, B21); Next (Core's pending answer, owner and step).
4. `h2` "What completion needs" (`id="prerequisites"`): one row per `completion[]` entry, in Core's order. Columns:
   Requirement (the closed sentence of `PREREQUISITE_SENTENCES`, the met form or the blocker form); State ("Met",
   "Not met", "Not applicable yet" before an outcome, as `completionItems` does today); Detail (Core's codes as
   sentences, §2.10, §2.14); Owner (closed table below, D-W08-09); Where (link). The page computes no State.

   | Prerequisite | Owner (who records the fact) | Where |
   |---|---|---|
   | `outcome` | You (the assigned operator) | OP-05 |
   | `no_possible_filing` | You (the act's reconciliation owner) | OP-04 (external actions) |
   | `artifact` | You (the assigned operator); the incident's owner or reviewer when an incident holds the file | OP-05, OP-05r |
   | `originals` | You (the assigned operator) | the originals section (OP-09) |
   | `delivery` | You (the assigned operator), through Send result | OP-06 |
   | `declared_completion` | TravelMudra (the result notice) | OP-06 |
   | `not_group_end_case` | TravelMudra, automatically after the travel return date | none |

5. `h2` "Continuing duties" (`id="duties"`): open incidents of this application (`caseWork.incidents` with state
   open, assigned or awaiting evidence): kind, owner, link. Line: "An open incident alone does not stop completion.
   When an incident holds the result file, the requirement above says so." (B24.) None: "No open incident." Read
   failed: "Unavailable".
6. The completion action: CMP-10 boundary notice (§2.10 row 2) and `unavailableButton` "Request completion". The
   button shows while the application is open; it never posts.
7. Secondary links: OP-05, OP-06.

| State | Copy and controls |
|---|---|
| No outcome yet | Requirements other than the outcome and the group end read "Not applicable yet"; the action still shows unavailable with the boundary |
| Every requirement met, still Submitted | Line above the action: "Every requirement is met now. The application does not complete by itself: completion is the step below." (OD §3; V17) |
| Completed | `h2` "Processing completed"; the outcome row separate; the requirements as recorded now; Continuing duties as item 5 ("Processing completed. [n] incidents remain open." when any); no action |
| Ended with the group | "This application ended with its group after the travel return date. This is not an outcome." No action |
| Read grant | Facts only |

There is no SuperAdmin completion control anywhere (CC-07, OD §3, OC-05).

### 2.5 TA-07r TA-07 "Result and delivery" `/ta/applications/:applicationId#result`

WP-03 builds TA-07 and carries today's "Delivery and completion" section (`ta.ts:650-664`) as item 11. WP-08
replaces that section with this one and adds two status rows. The rest of TA-07 does not change.

Status facts added to WP-03 §2.7 item 4 (each its own row): Result file ("Ready to download", "Not available yet",
"Not part of this service", "Unavailable"; §2.11) and Delivery (the newest delivery fact in words, §2.11). The
Outcome row stays WP-03's.

Action panel (WP-03 §3.2): item 1 (a notice that needs acknowledgement) links to TA-10n; item 3 "Download your
result" / "Download your packet" links to `#result` on TA-07 (not to the delivery page), because the section holds
the download form.

Section anatomy (`id="result"`, shown when `lifecycle ≠ draft`):

1. `h2` "Result and delivery".
2. Outcome line: "Outcome: [label]" or "Outcome not recorded yet."
3. "Result file" (`fileRows`, travel agent variant): the `artifact` and `packet` rows of `dlv.delivery_page.files`.
   An available row has a download form (§1.4 row 11) labelled "Download [file name]". An unavailable row shows the
   travel agent sentence of its `denyCode` (§2.11). A replaced row reads "Replaced by a newer version. Only the
   current version is released." No other file is shown in its place.
4. Issued with no releasable result file (V13): when `outcome = issued` and no artifact row is available, the text
   of UX §4.4: "Outcome: Issued. The result document is not available yet. [safe reason]" with the safe reason
   from the `artifact` prerequisite code (§2.11) and "Who acts: [owner from the pending answer]". No download, no
   substitute.
5. "Delivery" (`deliveryFacts`, §2.11): Email with the result; Notice in TravelMudra; Your downloads; Acknowledgement
   (only when a notice of this application asks for one); Handover (only when one is recorded).
6. "Closing steps": `checklist` of `completion[]` with the travel agent sentences (§2.11) and Core's flags, then
   the CMP-10 notice of §2.10 row 1 or row 2 (travel agent wording) when Core's pending reason or `completion`
   codes name the boundary.
7. Links: "All files, emails and downloads of this application" → TA-07d; "Download several files as one ZIP" →
   TA-07d `#zip` (shown when two or more non-packet files are available).

| State | Copy |
|---|---|
| Submitted, no outcome | "Outcome not recorded yet. The result appears here when TravelMudra records it." Delivery rows left out |
| Result ready | Download form; "Your downloads: None yet" until a download is recorded |
| Downloaded | "Your downloads: Sent in full on [time] IST. Whether your browser kept the file cannot be known." |
| Email uncertain | "Email with the result: Not confirmed. The email result is not confirmed. No automatic resend will occur. TravelMudra follows up the send attempt." No resend request control (UX §4.4) |
| Email failed | "Email with the result: Failed. It was not sent." |
| Direct external delivery | "Handover: Delivered directly by an external party. TravelMudra holds no result file for this application." |
| Preparation-only packet | Packet row with download; after the handover: "Outcome: Prepared and handed over. No government result is claimed." |
| Completed | `h3` "Processing completed" with the outcome separate; a notice of this application that still needs acknowledgement is listed as "Still needs your acknowledgement"; continuing financial duties are not shown (STOP-W08-06) |
| Delivery read unavailable | Section text "Files and delivery records are unavailable now. Your result, if any, is not lost." The outcome line stays (it comes from the case read) |
| Support view | Download disabled with the support-view reason |

### 2.6 TA-07d Delivery (travel agent) `/ta/applications/:applicationId/delivery`

Purpose: every file TravelMudra releases to the travel agent for one application, what was sent, and their own
downloads (UX §4.1 "Retrieve eligible bytes"; LD-05).

Anatomy:

1. Header: breadcrumb "Applications › [applicant] › Delivery" (origin rule of WP-03 §2.7 item 1); `h1` "Delivery:
   [applicant]"; meta: Application reference, Service; freshness.
2. Refusal callout when re-rendered (travel agent sentences only, no code except the UAT-13 fallback).
3. `h2` "Files" (`id="files"`): `fileRows` of every file (your documents, official results, packet) with the download
   form or the reason. Blocked application: "Releases are paused while TravelMudra handles a problem with this
   application." Lead: "Each download is checked first: only the current, accepted version is sent, and the result
   of every download is recorded."
4. `h2` "Download several files as one ZIP" (`id="zip"`), when two or more non-packet files are available: the form
   of §1.4 row 12 (CC-10). Line "Each file is checked again just before it is added to the ZIP. A file that is no
   longer releasable is left out, and the results list names it. Nothing is put in its place."
5. `h2` "Emails with documents": `attemptRows` of `emails` (travel agent texts, §2.11); "Emails go only to your
   account email address."
6. `h2` "Handover records": as today, with the §2.11 texts.
7. `h2` "Notices about this application": `noticeItem` list (links to TA-10n; no inline form).
8. `h2` "Your downloads": the reader's own retrievals with §2.11 result texts and "The ZIP's results" links.
9. "Closing steps": as TA-07r item 6, from opt. `core.ta_application` ("Unavailable" when it fails).

| State | Copy |
|---|---|
| S2 no file | "No file is released to you yet. Your accepted documents, the official result and a released packet appear here." |
| C2 refusal of a download | The sentence of §2.11 (`denyCode`) or §2.14; the table re-read now; fresh form tokens |
| Support view | Every download disabled with its reason; no ZIP form |

### 2.7 TA-07s and OP-06s Download of several files `/ta/selections/:selectionId`, `/ops/selections/:selectionId`

One renderer for both surfaces. Reads `dlv.selection` (the reader's own; another reader's id is the uniform 404).

1. Header: breadcrumb "Applications › [applicant] › Delivery › Download of several files" when every item is of one
   application (TA), "My work › … › Result delivery › …" (ops); `h1` "Download of several files"; freshness.
2. Facts: Started [time] IST; Download ("Sent in full", "Stopped early", "In progress or not recorded"); Files asked
   for: [n] files; Finished [time] IST when recorded.
3. Table, one row per item in `itemNo` order: Item [n]; File (closed label rule); Application (only when items span
   several applications); Result ("Sent in full", "Not included: [reason]", "Failed: the download stopped before
   this file", "Not recorded").
4. Lines: "Each file was checked just before it was added. Nothing was substituted for a file that was not released.
   'Sent in full' means every byte was handed to the network toward your browser; whether your browser kept the file
   cannot be known."

| State | Copy |
|---|---|
| Outcome null | "This download is still running, or its end was not recorded. Items without a result are never counted as sent." |
| Aborted | "The download stopped before the end. The files after the stop failed with it." |
| 200 or more items | The table scrolls in the page; no nested region; one line per item |

### 2.8 TA-10 Notices `/ta/notices` and TA-10n Notice `/ta/notices/:noticeId`

TA-10 anatomy:

1. Header: `h1` "Notices"; lead "Notices from TravelMudra about your applications. Opening a notice changes nothing.
   A notice that needs a decision from you asks for your acknowledgement."; freshness.
2. Count line: "Needs your acknowledgement: [n] notices" (the same rule as the rail count; "Unavailable" never
   applies here because the list itself is the read).
3. View filter (GET, enumerated, SH-R06): `view` = `needs_ack` ("Needs your acknowledgement") or absent ("All
   notices"). An unknown value is ignored. No read or unread filter (LD-06, D-W08-05).
4. List of `noticeItem` rows, newest first. Applicant names come from opt. `core.ta_applications` ("Application
   [reference]" when the read fails or the application is not in it).
5. Cap line when 500 rows: "This list shows the newest 500 notices."

| State | Copy |
|---|---|
| S2 | "No notices yet. Notices about your applications appear here." |
| S3 (`needs_ack`, none) | "No notice needs your acknowledgement." + "Show all notices" |

TA-10n anatomy:

1. Header: breadcrumb "Notices"; `h1` the notice text (closed `noticeText` rule); freshness.
2. Receipt `acknowledged`.
3. Body: the disclosure-correction body as today (`pages.ts:648-669`); for other kinds the notice text and the link
   to the application.
4. Facts: Posted [time] IST; Application (link); Delivery (link to TA-07d when the notice concerns a result);
   Acknowledgement ("Needs your acknowledgement", "Acknowledged [time] IST", "No acknowledgement asked").
5. Form (§1.4 row 13), only when `ackRequired` and not acknowledged, outside a support view: review line "Acknowledging
   records that you read this notice[ and deleted the file]. It changes nothing else." Button "Acknowledge" or, for
   a deletion request, "I deleted it: acknowledge" (as today).

| State | Copy |
|---|---|
| C3 `acknowledged` | Receipt "Notice acknowledged"; Current acknowledgement: Acknowledged [time] IST |
| C2 `ack_not_required` | "This notice does not ask for an acknowledgement." |
| C2 `already_acknowledged` | "This notice was already acknowledged." The re-read shows the time |
| C5 `_rev.notice` | §2.13 |
| Support view | No form |

### 2.9 TA-07x Application history `/ta/applications/:applicationId/history`

Purpose: the scoped case history of one application for the travel agent (UX §2.3 "Relevant scoped case history";
CMP-09; Q-W03-15).

1. Header: breadcrumb "Applications › [applicant] › History" (applicant from opt. `core.ta_application`, else
   "Application [reference]"); `h1` "History: [applicant]"; lead "What happened to this application, newest first.
   The application page shows where it stands now."; freshness in the lag form (§2.0).
2. Timeline (CMP-09): one entry per line: title (`LINE_TITLES`), detail (`lineDetail` with the additions below),
   "Recorded [time] IST". No actor is shown (the read carries none for the travel agent). Corrections appear as
   their own later entries; nothing is edited in place.
3. Cap line when 1000 lines: "This history shows 1000 entries. Older entries may exist."

`lineDetail` additions (F-W08-06): `email_result_recorded` with `state` `accepted` → "Accepted by the mail
provider. This does not show that it reached your inbox."; `synthetic_accepted` → "Stored in the test mailbox. No
real email was sent."; `failed` → "Failed: it was not sent."; `uncertain` → "Not confirmed. No automatic resend
will occur."; `denied_at_check` → "Not sent: the file check refused it." `notice_posted` with `kind` → the notice
text. Unknown values add no detail (never a guess).

| State | Copy |
|---|---|
| S2 | "No history yet. Changes to this application appear here as they are recorded." |
| S5 unhealthy | Freshness "Freshness unavailable" and the line "This history may be incomplete. The application page itself is always current." |

The operator history page `/ops/applications/:id/history` uses the same timeline renderer and gets the same
detail additions; it is not otherwise rebuilt.

### 2.10 Boundary wording (LD-04), closed table

This table is the only source of text for the three boundary codes and the owner kind
`unresolved_known_limitation`. It replaces the texts at `src/apps/shared/core/shared.ts:58-60`,
`src/apps/shared/core/ta.ts:359-363` and `:659-662`, `src/apps/shared/delivery/pages.ts:124-127` and `:555-570`,
`src/apps/staff/core/case.ts:381`, `src/web/ui/presentation.ts:173-178` and `:301`, and
`src/apps/staff/views/cases.ts:263-265` (F-W08-01).

| # | Code / place | Staff text | Travel agent text |
|---|---|---|---|
| 1 | `delivery_send_trigger_unselected`; OP-06 send notice | CMP-10: "Send result is unavailable until it is added to the product. Owner: TravelMudra." Then: "The rule is decided: the assigned operator starts each send with Send result. TravelMudra then checks each file, its version and the travel agent's current account address again, and records the result of each file. No result is emailed automatically." Sentence form: "Sending the result by email is the assigned operator's explicit step. It is not available in this release, so no result is emailed." | "Emailing your result from TravelMudra is unavailable until it is added to the product. Owner: TravelMudra." Then: "A result file that is ready for you is listed here to download." |
| 2 | `completion_check_trigger_unselected`; OP-07 notice | CMP-10: "Request completion is unavailable until it is added to the product. Owner: TravelMudra." Then: "The rule is decided: the assigned operator requests completion, and TravelMudra checks every requirement at that moment and answers with the completion or the requirements still missing. An application never completes by itself when its last requirement is met. A SuperAdmin cannot request or force completion." Sentence form: "Requesting completion is the assigned operator's explicit step. It is not available in this release, so the application stays open." | "Completing the application is TravelMudra's step. It is not available in this release, so this application stays open after its result." |
| 3 | `uncertain_email_handling_unselected`; uncertain email | "Email delivery is uncertain. No automatic resend will occur." Then: "Sent [time] IST. Result recorded [time] IST, or not recorded." (attempt facts from the email row); "Follow-up: [follow-up owner from the pending answer]." | "The email result is not confirmed. No automatic resend will occur. TravelMudra follows up the send attempt." |
| 4 | Resend of an uncertain email (`resendOffer` blocked with code 3) | CMP-10: "Resending an email whose result is uncertain is unavailable until the SuperAdmin authorization step is added to the product. Owner: SuperAdmin." | — (no control on the travel agent pages) |
| 5 | `real_mail_transport_unselected` (resend refusal) | "This installation has no mail transport, so it sends no email." The callout label reads "Not configured in this installation" (F-W08-12) | — |
| 6 | Owner kind `unresolved_known_limitation` (`ownerLabel`) | Label "Not available in this release"; meaning "The step is decided but not available in this release. [Follow-up owner] keeps the application." | Label "TravelMudra" |
| 7 | Next action `completion_check_pending` (travel agent) | — | "TravelMudra completes the application. This step is not available in this release." |
| 8 | SuperAdmin delivery view and Monitors | "Sending the result and requesting completion are the assigned operator's explicit steps. They are not available in this release." (WP-06 SA-01 group 13 wording) | — |

Forbidden in any rendered page for these codes (a unit test sweeps every WP-08 renderer and the eight places above):
"not decided", "undecided", "not yet decided", "unselected", "Owner not yet decided", "no trigger", "trigger and
owner".

### 2.11 Delivery and file wording, closed tables

File name rule: a packet is "Preparation packet (ZIP)"; an artifact is "[type] (official result)"; a document
version is its requirement type in words (today's `fileLabel`, `pages.ts:221-225`).

Check now (`available`, `denyCode`), staff and travel agent:

| Value | Staff (OP-06) | Travel agent (TA-07r, TA-07d) |
|---|---|---|
| available | "Releasable now" | "Ready to download" |
| `version_replaced` | "Not releasable now: a newer version replaced it" | "Replaced by a newer version. Only the current version is released." |
| `version_blocked` | "Not releasable now: blocked after a release to a wrong recipient" | "This file is held. It is not released again." |
| `artifact_not_eligible` | "Not releasable now: its association is under review, withheld or no longer current" | "The result document is not available yet. TravelMudra is resolving it." |
| `association_not_positive`, `version_not_eligible`, `version_not_processed` | today's `DLV_MESSAGES` sentences | today's sentences |
| `bytes_unavailable` | "Not releasable now: the stored file is missing or damaged" | "The stored file cannot be read. TravelMudra is resolving it." |
| `incident_block`, `incident_block_application` | "Not releasable now: an open incident holds it" | "Held while TravelMudra handles a problem with it." |
| `recipient_inactive`, `recipient_access_revoked` | today's sentences | today's sentences |
| any other code | "Not releasable now" + "Reference code: [code]" | "Not available now. Reference: [code]" |

Artifact association and delivery (OP-05, OP-05r): association `verified` "Verified for this application",
`pending_review` "Waiting for review", `conflict` "Conflicting candidates: waiting for review", `rejected` "Rejected:
not this application's file"; eligibility `eligible` "Eligible for release", `withheld_pending_review` "Withheld
until reviewed", `withheld_wrong` "Withheld: not this application's file", `blocked` "Blocked after a release to a
wrong recipient", `noncurrent` "Replaced: never released again".

Delivery facts (`deliveryFacts`):

| Fact | Source | Staff text | Travel agent text |
|---|---|---|---|
| Email with the result | newest `emails[]` row with a version of a current result file | "Queued [time]", "Not sent: the file check refused it", "Sending", "Accepted by the mail provider [time]: this is not proof that it reached the mailbox", "Stored in the test mailbox [time]: no real email was sent", "Failed [time]: not sent", "Uncertain [time]" (§2.10 row 3) | "Waiting to be sent", "Not sent", "Being sent", "Sent [time] IST: accepted by the mail provider. This does not show that it reached your inbox.", "Test installation: no real email was sent", "Failed: it was not sent", §2.10 row 3; none: "No email sent" |
| Notice in TravelMudra | `notices[]` of kind `result_available` (travel agent page: own notices); staff: the `declared_completion` and `delivery` prerequisite codes | from the requirement rows (OP-06 item 4c) | "Posted [time] IST" or "Not posted" |
| Your downloads | own `retrievals[]` of a result file or the packet | — | "Sent in full on [time] IST", "Interrupted on [time] IST", "Not sent: refused", "Result not recorded", "None yet" |
| Acknowledgement | a notice of this application with `ackRequired` | — | "Needs your acknowledgement" (link) or "Acknowledged [time] IST" |
| Handover | `handovers[]` | "Packet handover: system-verified, sent in full to the travel agent's download", "Attributed record, not system-verified", "Delivered directly by an external party: no result held by TravelMudra" | the same meaning in "you" form |

Completion prerequisites, travel agent sentences (met / not met): outcome "The result is recorded" / "The result is
not recorded yet"; no_possible_filing "No filing is in doubt" / "TravelMudra is confirming whether the filing went
through"; artifact "The result document is ready" / the `artifact` code sentence above; originals "No original
document is held" / "TravelMudra still holds an original document of this application"; delivery "The result was
delivered as this service requires" / §2.10 row 1 (or row 3 when Core's code is the uncertain one); declared_completion
"The result notice was posted" / "The result notice is not posted yet"; not_group_end_case "The application does not
end with its group" / "The application ends with its group after the travel return date".

### 2.12 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource (kind, id) | Summary test | Title | Recorded facts | Current facts (labelled "Current") |
|---|---|---|---|---|---|---|
| `result` | OP-05 | `application`, path id | `outcome` ∈ {`issued`, `refused`, `external_outcome_unresolved`}; `followUp` is a boolean; `artifactId` is a string or null | "Outcome recorded" (`followUp = false`); "Later official fact recorded" (`followUp = true`) | Outcome (summary); "Result file: recorded, waiting for its association check" (the artifact row selected by `artifactId`) or "Result file: none recorded"; "Nothing was sent." With `followUp`: "The outcome stays External outcome unresolved. A follow-up is open." | Outcome; the file's association and delivery; Next |
| `artifact` | OP-05 | `application`, path id | `artifactId` is a string and the summary has no `outcome` key | "Result file recorded" | File type and version reference (row selected by `artifactId`); "Replaces: [type] (now never released again)" when the row replaced one | Association; Delivery |
| `cancelled` | OP-05 | `application`, path id | the summary holds `applicationId` only | "Request recorded" (neutral, D-W08-14; "Cancellation recorded" once P-10 b serves command identity, S-08) | — | Outcome; Stage |
| `confirmed` | OP-05r | `incident`, path id | `artifactId` and `applicationId` are strings | "Association confirmed" | File reference; Application reference (`applicationId`) | Incident state; the file's delivery (when readable) |
| `rejected` | OP-05r | `incident`, path id | `artifactId` is a string and the summary has no `applicationId` key | "Association rejected" | File reference | Incident state ("Waiting for evidence: a replacement file, or evidence that none is owed") |
| `manual_email` | OP-06 | `application`, path id | `handoverId` is a string and the `handovers` row with that id has kind `manual_operator_email` | "Manual email recorded" | "An attributed record, not system-verified. It does not count as TravelMudra's delivery." Recorded [time] IST (the row's `recordedAt`) | Requirement "delivery" as Core reports it now |
| `resend` | OP-06 | `application`, path id | `emailSendId` and `resendOf` are strings | "Resend queued" | New send reference; "Resend of [reference]" | The new send's state (row selected by `emailSendId`) |
| `acknowledged` | TA-10n | `notice`, path id | `noticeId` equals the path id | "Notice acknowledged" | — | Acknowledgement |

No receipt shows an accepted time or a command name (P-02, P-10 b pending). A receipt whose check fails reads
unchecked (WP-01 A-04). The carried WP-10 forms on OP-06 keep their `?done=` flash (`handover`, `direct_external`).

### 2.13 Stale revision (CMP-14) per form

| Form | `_rev` | Rows (your unsent value / current value) |
|---|---|---|
| OP-05 record outcome | `application` | Outcome (yours / current or "Not recorded"); Result files (current count); Stage. Typed values stay; the file is chosen again |
| OP-05 cancellation | `application` | Outcome (current); the reason stays |
| OP-05 result file | none (Core `stale_revision` when the replaced file changed) | Not CMP-14: "The file you chose to replace was replaced since you opened the page." + the re-read table |
| OP-05r confirm, reject | `incident` | Incident state; Association (current). The note stays; the checkboxes are unchecked again |
| OP-06 resend | `email` | Email state (current) |
| TA-10n acknowledge | `notice` | Acknowledgement (current) |

"Who changed it and when" rows are absent (no read model carries them), never "unknown".

### 2.14 Refusal sentences (closed table)

Existing `CORE_MESSAGES` and `DLV_MESSAGES` stay unless listed or replaced by §2.10. Category plus code selects
the sentence.

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| record outcome | `control_blocked` / `outcome_already_recorded` | "An outcome is already recorded for this application: [current outcome]. Nothing was recorded." | form-level |
| record outcome | `control_blocked` / `application_not_submitted` | "Only a submitted application gets an outcome." | form-level |
| record outcome | `control_blocked` / `act_evidence_insufficient` | "Give a reference or a document of the official result. A statement alone is not enough." | evidence |
| record outcome | `validation_failed` / `artifact_type_undeclared` | "This service does not declare that type of result file." | `artifactType` |
| record outcome, cancellation | `control_blocked` / `filing_not_evidenced`, `filing_possibly_occurred` | "The filing is uncertain. Record conclusive filing evidence or a reconciliation finding first." | form-level |
| cancellation | `unavailable_parked` / `cancellation_undeclared` | §2.1 item 9 boundary | form-level |
| result file | `stale_revision` | §2.13 | form-level |
| result file, record outcome | upload refusals (format, size, safety) | today's upload sentences, at `file` | `file` |
| confirm | `validation_failed` / `not_a_candidate` | "Choose one of the candidate applications listed." | `chosenApplicationId` |
| confirm | `validation_failed` / `all_fields_required` | "Confirm that you compared all three: the surname, the passport number and the type." | the fieldset |
| confirm | `control_blocked` / `artifact_type_already_eligible` | "That application already has a released result file of this type. Reject this one, or replace the other on its own page." | form-level |
| confirm | `validation_failed` / `artifact_cross_group` | "The file belongs to another group. It cannot be associated with that application." | `chosenApplicationId` |
| confirm, reject | `control_blocked` / `incident_not_open` | "This review is already closed." | form-level |
| reject | `control_blocked` / `version_blocked` | §2.2 item 8 | form-level |
| review copy, downloads | `control_blocked` / a `denyCode` | §2.11 | page-level |
| downloads | `conflict_duplicate` / `duplicate_operation` | "This download button was already used. Its result is listed under your downloads. To download again, use the button again: each new download checks the file again." (F-W08-10) | page-level |
| downloads | `capacity_limited` / `capacity_streams` | "Too many downloads are running at once. Try again in a moment." (no automatic retry) | page-level |
| ZIP | `validation_failed` / `none_selected`, `selection_too_large` | "Choose at least one file." / "Too many files were chosen at once. Choose fewer." | page-level |
| manual email | `validation_failed` / `recipient_not_owning_ta` | §2.3 C2 | `recipientEmail` |
| manual email | `validation_failed` / `not_in_group` | "One of the chosen files is not a file of this group." | files |
| resend | `validation_failed` / `resend_source_not_failed` | "Only a send that failed can be resent." | form-level |
| resend | `conflict_duplicate` / `resend_exists` | "This failed email was already resent once. The resend is listed above." | form-level |
| resend | `unavailable_known_limitation` / `uncertain_email_handling_unselected` | §2.10 row 4 | form-level |
| acknowledge | as §2.8 | — | — |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |

## 3. Byte releases (K-BYTE)

| Step | Page | What happens | Recorded |
|---|---|---|---|
| 1 | TA-07r, TA-07d, OP-06, OP-05r | The page reads `dlv.delivery_page` (or the incident) and renders one form per available file, each with its own `_op` | nothing (a read-only check; `modules/delivery/pages.ts:111-120`) |
| 2 | POST | Core runs the release check for that file now: recipient, version, association, eligibility, incident block (B12) | one release record with the check result |
| 3 | Answer | Allowed: the bytes stream, verified against the recorded digest. Refused: the page re-renders with the reason (§2.11) and fresh tokens | the result `streamed`, `stream_failed`, `unavailable` or `denied` when the response ends |
| 4 | Same `_op` again (double click, browser resend) | Core answers the recorded result and never streams (`conflict_duplicate`, `duplicate_operation`) | nothing new |
| 5 | A new click after the re-render | A new `_op`: a new release with a fresh check | a new record |

A ZIP checks each file just before it adds it (B12): a change after a file's check, through that file's send, is the
accepted interval (B12, B45); there is no send lock, streaming recheck or recall. Each item's result is recorded and
shown on the selection page. The page never substitutes another version for a refused one, and never claims that the
browser received a file.

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 42cb373 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Record outcome (OP-05) | Same `_op`, same content | K-STD replay: the original result; 303 to the same receipt | None | Yes (receipt new) |
| Record outcome | New `_op`, same content (second tab, page loaded before the first) | `stale_revision` (`_rev.application`) → CMP-14 with the current outcome | None | Partly (generic text) |
| Record outcome | New `_op` after a reload | `outcome_already_recorded` → "An outcome is already recorded …" | None | Partly |
| Record outcome after `external_outcome_unresolved` | New `_op`, same official fact | Core's follow-up rule decides; the receipt states `followUp`; the outcome stays | A follow-up as Core records it | Partly |
| Result file | Same `_op` | Replay; one artifact | None | Yes |
| Result file | New `_op`, same file, same replaced file | The second: `stale_revision` (the first replaced it) | None | Partly (shell error, no re-render) |
| Confirm association | Same `_op` | Replay; same receipt | None | Yes |
| Confirm association | Two reviewers, two tabs | The second: `stale_revision` (`_rev.incident`) or `incident_not_open` → "already closed"; the re-read shows the decision | None | Partly |
| Reject after confirm (another tab) | New `_op` | `stale_revision` or `incident_not_open` | None | Partly |
| Manual email record | Same `_op` | Replay; one record | None | Yes |
| Manual email record | New `_op`, same content | A second attributed record: Core has no business key for it (P2 note, Q-W08-15); the attempts list shows both with their times | Two records | Yes (same) |
| Resend | Same `_op` | Replay | None | Yes |
| Resend | New `_op` (second tab) | `resend_exists` → "already resent once" with the link | None | Partly (generic) |
| Send boundary hit twice (hand-made POST) | Any | Core refuses each with the boundary (409); OP-06 re-renders the notice; nothing recorded | None | Yes (wording changes) |
| Completion boundary (admin, hand-made POST) | Any | As above on the SuperAdmin view; no control is rendered | None | Yes (control removed) |
| Acknowledge | Same `_op` | Replay | None | Yes |
| Acknowledge | New `_op` (second tab) | `already_acknowledged` with the re-read time | None | Yes |
| Download | Same `_op` | §3 step 4: never streams again | None | Yes (copy changes) |
| Download | Retried after an interruption | A new click after the re-render is a new release with a fresh check | One more record | Yes |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same page at the POST address, CMP-07 focused, `restorePath` = the GET page | Typed values | Files: "Choose the file again. The page does not keep files after a refusal." |
| Refused download | The page re-read with the reason; fresh tokens | — | — |
| Interrupted download | No page change; "Your downloads" shows "Interrupted" after a reload | — | The partial file is the browser's; it is never counted as sent |
| ZIP stopped early | The selection page: earlier items "Sent in full", later items "Failed" | — | — |
| Core unreachable before the command | SH-02 neutral unavailable page (WP-01 A-09) | — | The form; the reader opens the page again |
| Answer lost | Operation page (CMP-13); "Open the result" goes to OP-05 for `application`, to OP-05r for `incident`, to TA-10n for `notice` (`resultHrefOf`) | — | No new submission is offered |
| Optional read failed | The fact reads "Unavailable" | Everything else | — |

### 4.3 Facts that change between page load and action

| Situation | Required behaviour | Today |
|---|---|---|
| Version replaced between preview and download (TA-07d loaded, operator records a replacement, TA clicks Download) | Core refuses `version_replaced`; the page re-reads: the old row "Replaced by a newer version"; the new file is not listed until it is verified; nothing is substituted | Partly (copy) |
| Version replaced between ZIP page load and ZIP request | That item "Not included: replaced"; the other items as checked | Yes |
| File blocked (disclosure) between preview and download or send | Refused `version_blocked`; OP-06 "Not releasable now: blocked …" | Yes |
| Application-level incident opened mid-session | `applicationBlocked`: "Releases are paused …"; every download refused at its check | Yes |
| Association confirmed for another candidate while the reviewer decides | `stale_revision` / `incident_not_open` on submit | Partly |
| Outcome recorded by another tab while OP-05 is open | Stale or already-recorded sentence with the current outcome | Partly |
| Travel agent's email changed (both proofs done) | Every TA session ends (B09): the next TA request is sign-in with the email-change message. A manual email record naming the old address is refused `recipient_not_owning_ta`. A send (when built) reads the current address at its check | Yes (copy new) |
| Travel agent suspended | OP-06 "Travel agent account: Suspended"; file checks refuse `recipient_inactive` | Partly |
| Every completion requirement becomes met | OP-07 says so and still shows the action unavailable; the lifecycle stays Submitted (OD §3) | No (copy new) |

### 4.4 Access changing mid-task (B10, LD-14, WP-01 A-01, A-02)

| Situation | Required behaviour | Today |
|---|---|---|
| Operator reassigned while OP-05, OP-06 or OP-07 is open | The next read or command: access refusal → SH-02 "Your access changed"; no old facts remain | Yes (LD-14 sweep) |
| Operator reassigned during a single download | The release was checked at its start; the stream ends normally (accepted interval). The next page read denies | Yes |
| Access revoked during a ZIP | Each later item is checked just before it is added: "Not included: Your access to this file has ended." Earlier items keep their results | Yes |
| Reviewer unnamed while OP-05r is open | The next read: uniform 404; a POST: refused at Core | Yes |
| TA account suspended during a TA download | The stream continues (checked at start); the next request: sign-in with the session-ended message | Yes |
| Back after a confirm, record or download | The page reloads (WP-01 A-02); a POST is never re-sent silently | Yes |
| A receipt address opened by another operator | `core.operation` answers "no record yet" for another reader's key: unchecked receipt, no facts | Yes |

### 4.5 Counts, caps and long lists

| Situation | Required behaviour |
|---|---|
| 200 files on one application (delivery page maximum) | TA-07d and OP-06 list them in the page (cards on phones), no nested scroll; the ZIP form lists 200 labelled checkboxes in one fieldset |
| A ZIP of 200 files | One request; each file checked as it is added; the selection page lists 200 rows with their results; a stop mid-way marks later items "Failed" |
| More files than a ZIP accepts (configured maximum) | Core refuses `selection_too_large`: "Too many files were chosen at once. Choose fewer." No number in copy |
| 500 notices | TA-10 cap line |
| 1000 history lines | TA-07x cap line |
| 100 email sends or handovers | OP-06 lists them all (the read's maximum); no "show more" |
| Long names and types (applicant 400, service 300, type 40, note 2000) | Wrap anywhere; `h1` wraps; tables become cards |

### 4.6 Device and environment

| Situation | Required behaviour |
|---|---|
| JavaScript off | Every page works: plain forms, `<details>` for secondary content only, the review block always visible; downloads are plain form POSTs |
| 320 px, 400 % zoom | One column; no two-dimensional page scroll (AC-04) |
| Keyboard only | Download buttons, radios, checkboxes and links reachable in reading order; the error summary takes focus after a refusal (AC-08); the unavailable buttons stay focusable and are described (AC-13) |

## 5. Accessibility notes specific to WP-08

- One `h1` per page; sections are `h2`; the local strip is a `nav` named "Delivery and completion pages" (AC-03).
- Status facts and delivery facts are definition lists; each result has text, not colour only (AC-06).
- Each download button's accessible name names the file: "Download [file name]" (two files of one type are told
  apart by their version reference in the name).
- The ZIP checkboxes and the manual-email file checkboxes are labelled with the file name and version (AC-15).
- "Send result" and "Request completion" are `unavailableButton`s with `aria-describedby` to their CMP-10 notice
  (AC-13).
- The association decision: the three attestation checkboxes are in a `fieldset` with a legend; none is prechecked;
  after any refusal they render unchecked.
- The timeline is an ordered list; "Recorded [time] IST" is text in each entry.
- Receipts are announced politely without moving focus (AC-09).

## 6. Proofs V13, V14 and V17 on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge 4650, staff 4652; config `~/.local/share/travelmudra-uat/configs/lane-ui.json`,
  source = this lane's clone, ref `ui-revamp-2026-10-12`). At the WP-08 proof it holds the integrated WP-02, WP-03,
  WP-06 and WP-07 pages (package order, PLAN §3).
- Synthetic seed: Synthetica (SYN), "SYN Tourist e-visa" (TravelMudra files; declared result type `evisa_grant`, as
  the system tests use it, `test/system/case-work.test.ts:204`); accounts syn-ta-1 to -3, syn-operator-1 to -3,
  syn-superadmin-1 and -2.
- Fact: no HTTP route on `lane-ui` queues a document email, posts a result notice or completes a case. Those are
  harness commands called in process by tests (`src/modules/delivery/commands/email.ts:112-170`,
  `src/modules/core/commands/admin.ts:171-218`). So V14's sends and V17's completed state are proven as tests.
- Inference (the PM confirms before step 1): the artifact token extraction reads the text layer of a PDF generated
  with `pdf-lib`, as the system test does (`case-work.test.ts:189-196`). The harness generates result PDFs in memory
  and never writes them to disk.
- Sign-in through the LD-11 harness; codes never printed; screenshots allowed. axe at 1440 px and 390 px.

### 6.2 Setup (synthetic writes; Q-W08-07)

Through the rebuilt pages, as syn-ta-1, syn-superadmin-1 and syn-operator-1: create group `wp08-[yyyymmddhhmm]` in
Synthetica; add applicants A, B, C, D with unique synthetic passport numbers; submit each; record service payment;
assign each to syn-operator-1; start work, record readiness, authorize the government submission and record filed
evidence (WP-07 pages). Seeded data is not changed.

### 6.3 V13: issued result with wrong or missing artifact keeps the outcome and blocks release (B12, B13)

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V13-1 | syn-operator-1, OP-05 for A | Record "Issued" with a PDF that holds A's name and passport number | Receipt "Outcome recorded", "Result file: recorded, waiting for its association check"; after the check: Association "Verified for this application", Delivery "Eligible for release" | L |
| V13-2 | syn-ta-1, TA-07 for A | Read; download the result | Outcome "Issued"; Result file "Ready to download"; after the download: "Your downloads: Sent in full on [time] IST"; the word "Received" appears nowhere | L |
| V13-3 | syn-operator-1, OP-05 for B | Record "Issued" with a PDF that holds B's passport number and no name | Association "Waiting for review"; Delivery "Withheld until reviewed"; link "Review the association" | L |
| V13-4 | syn-ta-1, TA-07 for B | Read | "Outcome: Issued. The result document is not available yet. TravelMudra is resolving it."; no download; the outcome is not hidden | L |
| V13-5 | syn-operator-1, OP-05r for B | Read; open the review copy; confirm B with the three checks | No "best match" control and no preselected candidate; the review copy downloads; receipt "Association confirmed"; TA-07 for B then offers the download | L |
| V13-6 | syn-operator-1, OP-05 for C | Record "Issued" with no file | Outcome "Issued" kept; "Result file: None recorded"; the form "Record a result file" offers "No: a new result file" (F-W08-02); OP-07 for C: "artifact" Not met, owner "You" | L |
| V13-7 | syn-ta-1 (tab 1 TA-07d for A); syn-operator-1 (OP-05 for A) | Operator records a replacement of A's file; the TA then clicks the old Download | Refusal "Replaced by a newer version. Only the current version is released."; the new file is not listed until verified; nothing substituted | L |
| V13-8 | syn-operator-1, OP-05r for D | Record "Issued" for D with a nameless PDF; reject the association with a note | Receipt "Association rejected"; incident "Waiting for evidence"; OP-05 for D "Withheld: not this application's file"; TA-07 for D: not available yet | L |
| V13-9 | Test | Nth identical record outcome; two-tab outcome; `outcome_already_recorded`; two reviewers | Per §4.1 | T |
| V13-10 | axe | OP-05, OP-05r, TA-07, TA-07d | No violation at 1440 px and 390 px | L |

### 6.4 V14 to its boundary: explicit send of the exact eligible version to the current TA email (B09–B12, B31; OD §2)

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V14-1 | syn-operator-1, OP-06 for A | Read | Recipient row (role words, or the address once STOP-W08-01 is served); "Travel agent account: Active"; A's current result file "Releasable now" with its version reference; the replaced file "Not releasable now: a newer version replaced it"; requirements "delivery" and "declared_completion" Not met with the §2.10 sentences; "Send result" unavailable with the §2.10 row 1 notice; none of the forbidden words | L |
| V14-2 | Harness | Hand-made POST to `/ops/applications/<A>/document-email`, twice (fresh `_op` each) | 409 both times; the notice; no email row | L |
| V14-3 | syn-operator-1, OP-06 for A | Record a manual email to syn-ta-1's current address with A's result file | Receipt "Manual email recorded", "not system-verified"; requirement "delivery" still Not met (Core does not count it) | L |
| V14-4 | syn-operator-1, OP-06 for A | Record a manual email to another address | Refusal on "Sent to" with the §2.3 sentence; values kept | L |
| V14-5 | syn-ta-1, TA-07d for A | ZIP of A's files; before the request, syn-superadmin-1 opens a `bytes_integrity` incident on A (`/admin/incidents`) | Selection page: each file "Not included: held while TravelMudra handles a problem", no substitute; TA-07d "Releases are paused …" | L |
| V14-6 | syn-superadmin-1, SA-03c; syn-operator-1 | Reassign A to syn-operator-2; syn-operator-1 reloads OP-06 | SH-02 "Your access changed"; syn-operator-2 reads OP-06 | L |
| V14-7 | Test | Harness email states `accepted`, `synthetic_accepted`, `failed`, `uncertain`, `denied_at_check` on OP-06 and TA-07 | §2.11 texts; uncertain: "Email delivery is uncertain. No automatic resend will occur." (staff) and the travel agent sentence; resend form only on `failed`; uncertain → §2.10 row 4 | T |
| V14-8 | Test | Resend a failed send; second tab | Receipt "Resend queued"; `resend_exists` on the second | T |
| V14-9 | Test | Email change completed, then a manual email record naming the old address | `recipient_not_owning_ta` | T |
| V14-10 | axe | OP-06, OP-06s, TA-07s | No violation | L |

### 6.5 V17 to its boundary: Request completion returns Core's result; a download alone is not delivery; no auto-complete (B24; OD §3)

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V17-1 | syn-operator-2, OP-07 for A (after V13-2's download) | Read | outcome Met; artifact Met; delivery Not met (§2.10 row 1 sentence); declared completion Not met; "Request completion" unavailable with the §2.10 row 2 notice; Stage "Submitted" | L |
| V17-2 | syn-ta-1, TA-07 for A | Read | "Your downloads: Sent in full …" beside "Closing steps: The result was not delivered as this service requires …": a download alone does not satisfy delivery | L |
| V17-3 | syn-superadmin-1, SuperAdmin delivery view of A | Read; hand-made POST to `/admin/applications/<A>/completion-check` | No completion control; the POST answers the boundary (409); nothing changes | L |
| V17-4 | Test | Harness: email accepted and result notice posted for A's version | Every requirement Met; Stage still "Submitted"; OP-07 line "Every requirement is met now. The application does not complete by itself" | T |
| V17-5 | Test | Harness completion check, with an open operational incident | TA-07 "Processing completed" with the outcome separate; OP-07 "Processing completed. 1 incident remains open." | T |
| V17-6 | axe | OP-07 | No violation | L |

Proof split: V13 passes when V13-1 to V13-8 and V13-10 pass on `lane-ui` and V13-9 passes as a test. V14 and V17
pass "to their boundary" when every L step passes on `lane-ui` and every T step passes as a test; the send and the
completion request themselves wait for their Kind 2 lanes (LD-04).

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0 (after WP-02 U0, WP-03 U0 and U3 are integrated). Phase B: U1, U2, U3, U4, U5 in parallel. Phase C:
U6. The architect registers gallery modules in `scripts/dev/gallery-pages.ts`, applies the WP-01-file copy block
(`src/web/ui/presentation.ts`, §2.10 rows 6 and 7) and edits `DESIGN.md` once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Components and wording** | New `src/web/ui/delivery.ts` (CMP-18 `fileRows`, `attemptRows`; CMP-21 `noticeItem`; `deliveryFacts`); WP-08 block in `static/css/components.css`; exports in `src/web/ui/index.ts`; new `src/apps/shared/delivery/words.ts` (the closed tables of §2.10, §2.11, §2.14; `DLV_MESSAGES`, `fileLabel`, `noticeText` moved from `pages.ts` unchanged except the §2.10 rows) | New `test/unit/web/delivery-components.test.ts` (every state is text; no "Received"; download buttons name the file; notice item never says read or unread); new `test/unit/web/boundary-wording.test.ts` (the forbidden-phrase sweep of §2.10 over every renderer of U1 to U5 and the eight places) | `scripts/dev/gallery/delivery.ts` |
| **U1 OP-05, OP-05r** | New `src/apps/staff/outcome/pages.ts`; new `src/apps/staff/outcome/routes.ts` (GET `ops.applications.outcome_form`, `ops.incidents.association`; POST `ops.case_work.official_result`, `ops.case_work.artifact`, `ops.case_work.cancelled` moved from `case-work.ts` with re-render and receipts; POST `ops.incidents.confirm_association`, `ops.incidents.reject_association` moved from `incidents.ts`; POST `ops.incidents.review_copy` moved from `staff/delivery/routes.ts` with re-render) | New `test/unit/web/outcome-pages.test.ts` (outcome options equal Core's list; no form when the offer is null; the "No: a new result file" option when no current file exists; candidates in Core order with none preselected; attestation unchecked after a refusal; no "best match" text; receipts by summary shape; `cancelled` neutral); BFF test: a refused confirm re-renders OP-05r with the note kept | `scripts/dev/gallery/outcome.ts` |
| **U2 OP-06, OP-06s, OP-07** | New `src/apps/staff/delivery/send-page.ts` (OP-06), new `src/apps/staff/delivery/completion-page.ts` (OP-07); `src/apps/staff/delivery/routes.ts` (GET `ops.delivery` renders OP-06; new GET `ops.applications.completion`; manual email and resend with receipts and re-render; the boundary POST re-renders OP-06; ops downloads and ZIP refusals re-render OP-06; `ops.selections.one` uses the shared selection renderer of U3) | New `test/unit/web/send-page.test.ts` (recipient never an input; file checks captioned as checks now; requirements from Core flags only; the unavailable "Send result" button described by the notice; resend form only for `failed`; uncertain panel verbatim sentence); new `test/unit/web/completion-page.test.ts` (rows in Core's order; State from Core; "never completes by itself" line when all met; no form; completed state); BFF test: the hand-made boundary POST answers 409 with the notice | `scripts/dev/gallery/send-result.ts`, `completion.ts` |
| **U3 Travel agent delivery** | New `src/apps/shared/delivery/ta-pages.ts` (TA-07r section renderer `resultDeliverySection`, TA-07d, the selection renderer for both surfaces); `src/apps/shared/delivery/routes.ts` (`deliveryPageResult` per surface: `ta` → TA-07d, `admin` → the old renderer; refusal re-render by `from`; selection renderer); `src/apps/edge/delivery/routes.ts` (selection page); `src/apps/shared/core/ta.ts` (TA-07: the opt. `dlv.delivery_page` read, the section call, the two status rows and the `#result` action targets) | New `test/unit/web/ta-delivery.test.ts` (separate delivery rows; "Sent in full" never "Received"; issued-without-file sentence; replaced row never substituted; ZIP form only with two or more files; support view disables downloads; delivery read unavailable keeps the outcome line); update `test/unit/web/delivery-words.test.ts` (new renderers, same assertions) | `scripts/dev/gallery/ta-delivery.ts` |
| **U4 TA-10, TA-10n, TA-07x** | New `src/apps/shared/pages/notices.ts` (TA-10, TA-10n renderers); new `src/apps/shared/delivery/ta-notice-routes.ts` (GET `ta.notices`, `ta.notices.one` for the travel agent surface, with `readReceipt`); the acknowledge handler for `ta.notices.acknowledge` as a new export of `ta-notice-routes.ts` (U3 keeps `edge/delivery/routes.ts`; U6 points the route at the new handler in phase C); `src/apps/shared/views/ta.ts` (`taHistoryPage` only); `src/apps/shared/views/cases.ts` (`lineDetail` additions; lag-form freshness for history) | New `test/unit/web/ta-notices.test.ts` (no read marker; three acknowledgement texts; `view=needs_ack`; no inline form in the list; the deletion-request label); new `test/unit/web/ta-history.test.ts` (email states detailed; lag form; cap line; recorded time text) | `scripts/dev/gallery/notices.ts`, `history.ts` |
| **U5 LD-04 copy sweep** | `src/apps/shared/core/shared.ts` (`CORE_MESSAGES` three codes), `src/apps/staff/core/case.ts` (`completionSection`: links to OP-06 and OP-07 on ops; read-only list and §2.10 row 8 on admin), `src/apps/shared/delivery/pages.ts` (the old renderer, now admin and staff notices only: boundary block of §2.10 row 8 with no control; inline acknowledge forms removed), `src/apps/staff/views/cases.ts:258-266` (Monitors sentence, F-W06-09) | Update `test/system/delivery.test.ts:119-120, 227-231`, `test/system/case-work.test.ts:266-288, 575` (§7.3) | — |
| **U6 Wiring and system tests** | `src/apps/staff/operations/case-work.ts` (remove the three moved forms and routes; the section links to OP-05), `src/apps/staff/operations/incidents.ts` (remove confirm, reject and review-copy forms and the two routes; link to OP-05r), `src/apps/staff/core/ops.ts` (links to OP-05, OP-06, OP-07; or WP-07's OP-02 tab, Q-W08-14), `src/apps/staff/instance.ts`, `src/apps/edge/instance.ts` (register the new route modules), `src/web/route-inventory.ts` (three new GET entries), `src/apps/shared/common-routes.ts` `resultHrefOf` (`incident` → OP-05r when kind is association, else OP-08; `notice` → TA-10n), removal of the moved copies | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids; the confirm and reject rows stay); new `test/unit/web/carried-forms-wp08.test.ts` (§7.2); the system tests of §7.3 | — |

U1 and U2 read the closed tables of U0 only. U3 owns `ta.ts`, `shared/delivery/routes.ts` and
`edge/delivery/routes.ts`; U4 adds new files and U6 rewires the acknowledge route in phase C, so no two units edit
one file.

### 7.2 Carried-form test

`test/unit/web/carried-forms-wp08.test.ts` renders OP-06 (released packet; external delivery case), the old
operator case page fixtures and the incident page fixture, and asserts: OP-06 holds the carried WP-10 forms by
action path (`/ops/applications/:id/handovers`, `/direct-external`); the old case page holds the carried WP-14
disclosure and incident forms and the WP-10 packet forms; the old case page holds no form with action
`…/official-result`, `…/artifacts` or `…/outcome`; the incident page holds no form with action
`…/confirm-association`, `…/reject-association` or `…/review-copy`; no TA list page and no delivery page holds a
form with action `…/notices/:id/acknowledge`; the SuperAdmin delivery view holds no button named "Run the
completion check" or "Send the result by email". WP-10, WP-14 and WP-15 remove their entries when they rebuild them.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-work.test.ts:198-208` (`recordResult`) | The official-result form read from the case page; `location === ${ops}?done=result` | GET OP-05; location `/ops/applications/<id>/outcome?done=result&op=<key>` |
| `test/system/case-work.test.ts:361-363` | The review-copy form read from the incident page | GET OP-05r |
| `test/system/case-work.test.ts:266-288` | `#closure` text "Who sends your result to you is not decided in this release"; "Owner not yet decided" absent | Section `#result`; the §2.10 row 1 travel agent sentence; the forbidden phrases absent |
| `test/system/case-work.test.ts:575` | "Who starts the completion check is not decided in this release" | §2.10 row 2 travel agent sentence |
| `test/system/delivery.test.ts:119-120, 231` | "Who starts sending a result by email is not decided yet" | §2.10 row 1 sentences |
| `test/system/delivery.test.ts:227` | Button text "Send the result by email" | "Send result" (unavailable button) |
| `test/system/delivery.test.ts:239-253` | The admin delivery view's controls | No completion control; read-only note |
| `test/system/delivery.test.ts:145-168` | ZIP form `form[action="/ta/selections"]` on the TA delivery page; selection link | Stays valid (same action, fields and page); the selection page heading unchanged |
| `test/unit/web/delivery-words.test.ts` | Imports `deliveryPageHtml`, `selectionPageHtml` | The new renderers (U3); the same "Sent in full" assertions |
| `test/unit/web/packet-handover.test.ts:132-140` | The handover form on the old ops delivery renderer | OP-06 renderer (carried form unchanged) |
| `test/unit/bff-access-change.test.ts:70` | Incident page fixture with association offers | Fixture stays; assertions on removed forms move to OP-05r |
| Other tests that read the official-result form from the case page (`test/operations/*`, `test/system/*` helpers that post `/official-result`) | Form on the case page | GET OP-05 (the implementer lists every call site with `git grep "official-result"` before the change) |
| `test/unit/web/routes.test.ts:114-115` and inventory counts | POST rows | Add the three GET rows |

Stay valid: `test/system/case-views.test.ts:97-111, 152-162` (TA history status codes and the support-view read with
no form), `test/system/delivery.test.ts:177, 196-203` (TA and ops notices lists and links),
`test/unit/nav-counts.test.ts` (counters unchanged).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `ops.record_official_result`, `ops.record_artifact`, `core.record_outcome` | OP-05, WP-08 | OP-05 `/ops/applications/:id/outcome`; WP-08; "moved off the operator case page" |
| `ops.confirm_artifact_association`, `ops.reject_artifact_association` | OP-05, WP-08 | OP-05r `/ops/incidents/:id/association`; WP-08; "moved off the incident page" |
| `ops.open_incident` | OP-05 (association incident); OP-08; SA-08; WP-08 | OP-08, SA-08; **WP-14**. Note: "Core opens association incidents itself (rule `assoc/1` fails closed); an operator cannot open result-file kinds (`not_operator_openable`); a SuperAdmin can (SA-08)" |
| `dlv.record_manual_email` | OP-06, WP-19 | OP-06; **WP-08** (Q-W08-01) |
| `dlv.manual_resend` | OP-06, WP-19 | OP-06; **WP-08** (Q-W08-01) |
| `dlv.acknowledge_notice` | TA-10; TA-07; OP-10; SA-10; WP-17 | `ta.notices.acknowledge` on TA-10n, **WP-08** (Q-W08-02); `ops.notices.acknowledge` OP-10 and `admin.notices.acknowledge` SA-10, WP-15 |
| `dlv.queue_document_email`, `core.check_completion` | WP-08 | unchanged; CC-07 delivered (no SuperAdmin control) |
| Byte releases (§4 of the register) | `dlv.retrieve_document` TA-07; `dlv.retrieve_selection` TA-07; `dlv.retrieve_for_review` OP-05 | TA routes on TA-07r and TA-07d; ops routes on OP-06; review copy on OP-05r; the selection page has a home (TA-07s, OP-06s), so register §5.2's "NO PAGE" note for it closes |

§5.1 counts: WP-08 10 (8 − `ops.open_incident` + `dlv.record_manual_email` + `dlv.manual_resend` +
`dlv.acknowledge_notice`); WP-14 8; WP-17 12; WP-19 0 (it keeps the delivery-ownership and uncertainty views, V15
and V16, with no command of its own). Proposed §6 disposition CC-13: "The WP-08 commands leave the operator case page
and the incident page; those pages keep the facts and link to OP-05 and OP-05r. Each command has one host page."

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W08-01 | P1 | Eight places say the send, completion or uncertain-email step is "not decided" or has an "Owner not yet decided" (`shared.ts:58-60`, `ta.ts:359-363`, `:659-662`, `delivery/pages.ts:124-127`, `:563`, `case.ts:381`, `presentation.ts:173-178`, `staff/views/cases.ts:263-265`) | A travel agent reads "Who sends your result to you is not decided in this release" and tells the customer that TravelMudra has no process; LD-04 forbids the claim (OD §2–4 decided it) | One closed wording table (§2.10) and a sweep test |
| F-W08-02 | P1 | After "Issued" is recorded without a file, no page offers to record the result file: the replacement form needs an existing file (`case-work.ts:251-252`) and the result form is no longer offered | V13: the outcome is Issued, delivery is blocked, the owner is the assigned operator, and the operator has no control; the case stays open with no route | OP-05 item 8 offers "No: a new result file" |
| F-W08-03 | P1 | The SuperAdmin delivery view renders a disabled "Run the completion check" control (`delivery/pages.ts:558-564`) | A SuperAdmin reads it as a control that a later release unlocks for them; OD §3 and CC-07 say no SuperAdmin completion request exists | Control removed; read-only note (§2.10 row 8) |
| F-W08-04 | P2 | The outcome select is hard-coded to Issued and Refused (`case-work.ts:232`) while Core returns the allowed list (`ops.official_result_form.outcomes`) | A future mode allows a different set; the page offers values Core refuses | Options from Core's list (D-W08-03) |
| F-W08-05 | P1 | The confirm form asks the reviewer to attest that the surname and passport number match, but a named reviewer sees only candidate references and group labels (`bindings/operations-work.ts:170-176`) | An operator named as reviewer of another operator's case ticks three boxes without seeing the candidate's identity; the association is recorded as verified with a blind attestation | Identity shown where readable; hint for other candidates; STOP-W08-03 |
| F-W08-06 | P1 | The TA history shows "Document email result recorded" with no detail for any state (`views/cases.ts` `lineDetail`) | An email failed; the travel agent reads the line as a successful send and waits for an email that never comes | Detail per email state (§2.9) |
| F-W08-07 | P2 | The history freshness says "entry N" (`asOfNotice`), not the LD-08 lag form | — | Lag form |
| F-W08-08 | P1 | The delivery page shows an inline "Acknowledge" button for every notice that asks for one, a disclosure deletion request included (`delivery/pages.ts:480-483`) | A travel agent acknowledges "Delete a file that was sent to you in error" from the delivery page without reading "Delete every copy you hold"; the record says they deleted it | One host page (TA-10n) with the instruction above the button (D-W08-04) |
| F-W08-09 | P2 | The refused-download sentence says "Start a new download" without saying how (`delivery/pages.ts:111`) | The travel agent reloads, or gives up | §2.14 sentence |
| F-W08-10 | P2 | A refused review copy answers the shell error page (`staff/delivery/routes.ts:157-161`) | The reviewer loses the review page | Re-render OP-05r with the reason |
| F-W08-11 | P1 | On the operator page, "Availability" is the operator's own release check (`modules/delivery/pages.ts:118-120`), shown beside the send boundary as if it were send eligibility | An operator reads "Available" and emails the file manually to an account Core would refuse (suspended travel agent); the check never asked about the travel agent | Caption "checks now … again at the moment of any send"; recipient account row; STOP-W08-02 |
| F-W08-12 | P2 | A resend refused for `real_mail_transport_unselected` shows the label "Awaiting product decision" | PD selected the provider; the label misstates the cause | §2.10 row 5 |
| F-W08-13 | P2 | The TA history has no TA-07 entry point beyond a header link and no breadcrumb to the applicant | — | §2.9 breadcrumb |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W08-01 | P1 | Build `dlv.record_manual_email` and `dlv.manual_resend` in WP-08 on OP-06 (register WP-19) | OP-06 is rebuilt now; without them the only served delivery actions of an operator stay on a page in the old layout until WP-19 | Yes. WP-19 keeps the ownership and uncertainty views (V15, V16) |
| Q-W08-02 | P1 | Build the travel agent route of `dlv.acknowledge_notice` in WP-08 (TA-10n), and remove every inline acknowledge form (D-W08-04) | TA-10 is built in WP-08 (register note); its only command would otherwise stay on an old renderer; F-W08-08 | Yes |
| Q-W08-03 | P1 | Adopt the §2.10 wording as the LD-04 wording | LD-04 sets the exact wording at this review | Adopt; Max reads it in the end review |
| Q-W08-04 | P1 | The WP-08 forms leave the operator case page and the incident page (CC-13); about ten system-test call sites change their GET source | Two forms record one decision with different text; tests keep passing against the old form while OP-05 is broken | Yes |
| Q-W08-05 | P1 | New GET paths OP-05 `/outcome`, OP-05r `/association`, OP-07 `/completion`; OP-06 keeps `/delivery` | — | Yes (LD-03) |
| Q-W08-06 | P1 | TA-07 reads `dlv.delivery_page` (optional) beside WP-03's `dlv.delivery_facts`, so the result download sits in TA-07 | Without it "Download your result" leads to another page: two clicks and a second context | Yes; the read runs only when `lifecycle ≠ draft` |
| Q-W08-07 | P1 | V13, V14 and V17 writes on `lane-ui`: one group, four applications per run, outcomes, result PDFs generated in memory, one replacement, one confirm, one reject, two manual-email records (one refused), one SuperAdmin `bytes_integrity` incident, one reassignment | A rerun meets earlier rows; the proof identifies its rows by the dated group label | Approve; synthetic only; seeded data not changed |
| Q-W08-08 | P2 | `ops.open_incident` → WP-14 (no WP-08 form) | UI-PLAN says the operator may open an association incident on a contradiction; Core refuses that kind for operators; the automatic rule already fails closed on contradictions (rule 6) | Yes; deviation D-W08-15; no Kind 2 proposal |
| Q-W08-09 | P2 | The ZIP form lives on TA-07d, reached from TA-07's section (reading of CC-10) | A result has one or two files; the ZIP is useful with the evidence documents, which TA-07d lists | Yes |
| Q-W08-10 | P2 | OP-07's Owner column from a closed table per prerequisite (D-W08-09) | The read has no owner per prerequisite; the pending answer names only the next one | Accept as presentation of who records each fact |
| Q-W08-11 | P2 | Fix the Monitors sentence now (F-W06-09) in U5 | WP-14 rebuilds Monitors later; meanwhile it contradicts LD-04 | Yes, one sentence |
| Q-W08-12 | P2 | The architect applies the `presentation.ts` copy block (WP-01 file) | — | Yes |
| Q-W08-13 | P2 | The operator history page shares the rebuilt timeline details | — | Accept; no other change to that page |
| Q-W08-14 | P1 | Where the entry links live: WP-07's OP-02 "Delivery & originals" tab (if WP-07 is integrated first) or the old case page | WP-07 is not designed yet; if it rebuilds OP-02 with tabs, WP-08's links belong in that tab | WP-07's design names the tab content; WP-08 U6 adds the three links to whichever page is live |
| Q-W08-15 | P2 | A second identical manual-email record with a new `_op` creates a second record (no business key) | Two tabs record the same email twice | Accept; both are attributed records with times; note to the orchestrator |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W08-01 | New GET pages OP-05, OP-05r, OP-07 | New routes and inventory entries; actions and fields unchanged |
| D-W08-02 | Forms leave the operator case page and the incident page (CC-13) | Host pages change; system tests change their GET source |
| D-W08-03 | Outcome options from Core's `outcomes` list; radio instead of select | Field name and values unchanged |
| D-W08-04 | Inline acknowledge forms removed from lists and delivery pages; TA-10n is the one host | Host page changes |
| D-W08-05 | No "Mark as read" and no unread filter (LD-06) | None |
| D-W08-06 | Send result and Request completion shown as unavailable buttons with a boundary notice; no SuperAdmin completion control (CC-07) | None |
| D-W08-07 | Recipient in role words until STOP-W08-01 | None |
| D-W08-08 | File checks captioned as checks now, not as send eligibility, until STOP-W08-02 | None |
| D-W08-09 | OP-07 owner column from a closed table | None |
| D-W08-10 | No in-page document viewer (CMP-19); the review copy is a byte release | None |
| D-W08-11 | Download forms on TA-07 carry a hidden, BFF-only `from` (`application` or `delivery`) to choose the re-render page; Core never receives it | One new hidden field |
| D-W08-12 | ZIP form on TA-07d (CC-10 reading) | None |
| D-W08-13 | TA history: recorded time only, no actor, no event time | None |
| D-W08-14 | Cancellation receipt neutral until P-10 b | None |
| D-W08-15 | `ops.open_incident` not built in WP-08; operators cannot open result-file incidents (Core) | Register row |
| D-W08-16 | Manual email and resend receipts on OP-06 with `done` and `op` (was `?done=` only) | Location changes |
| D-W08-17 | The confirm form's application choice is a radio group, not a select | Field name unchanged |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W08-01 | Kind 1, P1 | The owning travel agent's current account email (display form) on `dlv.delivery_page` for the assigned operator (and the SuperAdmin view) | UX §2.3 "Receive at current account email", §5.3 "current account recipient … informational, not a free-text field"; the manual-email record needs the address Core will accept | 1: the fact exists (`identity.getRecipient(...).currentEmail`, `handover.ts:147`). 2: it removes no join, computation or round trip; it adds a missing fact. Point 2 is not met, so it needs Max's exception, as P-05. 3, 4: same scope as the page; subject "delivery recipient" | Role words (D-W08-07); Core refuses a wrong address on the record |
| STOP-W08-02 | Kind 1, P2 | Per-file release check toward the owning travel agent on the `document_email` channel, on the staff delivery read | UX §5.3 "per-file eligibility" for the send preview; today the check is the reader's | 1: `releaseAvailability` takes any recipient and channel. 2: removes a page-side reading of the operator's check as the travel agent's. 3, 4: as the page | Captioned checks (D-W08-08) |
| STOP-W08-03 | Kind 1, P1 | For an association reviewer: each candidate's surname, given names and passport number on `ops.incident` (association incidents only, open only) | The reviewer attests these three facts (`confirm_artifact_association`); B13 needs a real secondary review | 1: facts exist (case snapshots). 2: removes an off-product comparison per candidate (round trips). 3: scope = the incident's candidates while it is open. Privacy: full passport numbers to a named reviewer; the architect decides with the reviewer | Identity shown only where the reader may read the case; hint for the others (F-W08-05) |
| STOP-W08-04 | Kind 1, P2 | The association rule's stored outcome (`failed` reason, rule version) and the artifact type on `ops.incident` | UX §5.3 "claimed type … contradictions"; the reviewer sees why review is needed | 1: stored in `association_metadata`. 2: removes a case read for the type | Generic note; type from the case read when allowed |
| STOP-W08-05 | Kind 1, P2 | Safe provider correlation of an email send on `dlv.delivery_page.emails` | UX §5.3 "Uncertain email: … safe provider/message correlation" | 1: recorded by the mail task (inference; the implementer checks). 2: removes a diagnostics look-up | Attempt times only |
| STOP-W08-06 | Kind 1, P2 | Continuing duties (open financial follow-up, open incidents) on `core.ta_application` | UX §3.2 "Processing completed. Financial follow-up remains open." | 1: facts exist. 2: removes a guess | Completed state without the follow-up line |
| STOP-W08-07 | Kind 1, P2 | Event time on TA history lines | CMP-09 "event time vs recorded time" | 1: facts carry `eventAt` where recorded | Recorded time only (D-W08-13) |
| — | Kind 2 (existing inventory items, not new) | Send result (CMD-44), Request completion (CMD-48), the SuperAdmin authorization of an uncertain-email resend (OD §4), bounded SuperAdmin delivery ownership (OD §2) | The decided policy | Inventory §4 item 2: own lanes | The boundaries of §2.10 |

No STOP item blocks the WP-08 main path. No P0 item is open in this design.
