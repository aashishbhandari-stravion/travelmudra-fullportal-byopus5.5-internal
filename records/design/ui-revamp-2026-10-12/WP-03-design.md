# WP-03 design review: groups, individual intake, submit

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-03
holds commands that change filing state, so a Codex design review applies).
Product base: lane repository at 102e4c9 with the uncommitted WP-01 working tree (shell, `results.ts`,
`receiptLocation`, `readReceipt`). This document writes no product code. Paths in `file:line` form are relative to
the lane repository unless they start with `REC/` (`internal/records/`) or `RM` (lane `research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 102e4c9. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** TA-01 Home (new, `/ta`), TA-04 Groups, TA-05 Group detail, TA-13 Group setup (create; edit travel
  dates), TA-06 Applications and the TA search, TA-07 Application workspace (submit path and help request),
  TA-08 Check and submit, TA-09 Individual intake (create form and task list), the document detail view (CC-05)
  and the individual-form result. Eleven WP-03 commands (register §5.1) plus `core.edit_travel_dates`, whose form
  moves to TA-13 in WP-03 (§1.4). The forms and sections of WP-08, WP-09, WP-10, WP-12, WP-13, WP-16 and WP-17 stay working on the rebuilt TA-05 and TA-07
  (§1.5).
- **Page model.** Every existing path stays (LD-03). New GET pages sit on the POST path of their one form
  (`/ta/applications/:id/edit`, `/correct-identity`, `/documents`, `/submit`, `/request-assistance`,
  `/ta/groups/:id/travel-dates`), so a refused form is re-rendered at the address it was sent from. Two unused
  inventory entries get ids: T01 `/ta` (TA-01) and T09 `/ta/groups/:groupId/applications/new` (TA-09 create).
  New paths: `/ta/groups/new`, `/ta/applications/:id/prepare` (task list) and the "use a file already in this
  group" picker. No form action and no hidden-field name changes (§1.2, D-W03-02).
- **TA-09 is two modes.** Create mode is one form page, because `intake.start_individual` creates every
  application from one multipart body with its files (CMD-8). The task list (CMP-04) starts after creation, over
  `core.edit_draft`, `core.correct_identity` and the three document commands (§4).
- **SH-R06 for the TA search (§6).** A POST needs exactly one Core command (RM §1 item 1), and no search command
  exists. Recommendation D-W03-05: a narrowly scoped web-shell route kind "seal" (POST, no command, shell-owned
  handler) that answers 303 to `/ta/search?r=<token>`, the token an AES-256-GCM envelope of the text bound to the
  session and valid 30 minutes. No Core change; it changes the BFF's "every POST is a command" invariant, so it
  is a P1 decision with an independent review. Fallback without any shell change: enumerated filters on TA-06 and
  an in-page name filter; free-text search across all applications is then removed (P1 loss).
- **TA-09-R1 and R2 depend on the bulk lane.** R2: the bulk lane commit 4496ee9 (not yet on main) adds
  `src/workers/passport-number.ts`, an import-free single source of the Indian passport-number shapes with labels
  and examples; the page states the format from it, never from its own text (§4.4). R1: today Core takes one file
  per document type on the individual form (`src/contracts/intake.ts:51`), so the page can state only "one file
  with both pages" until the bulk lane's passport parts (bulk DESIGN §2.5 DR-11, DOC-15) are served (§4.3).
  Both items are partly met until then (DEP-1, DEP-2).
- **STOP items (§10.4).** No P0. Five Kind 1 data gaps, all P2 (submission time, group-list facts, the TA case's
  service mode and country, list ids for filters, the offering's country id). One content input, P1:
  the approved wording of each authority statement version (C05); without a text for a statement version, the
  page offers no submission for it (D-W03-10).
- **Top questions.** Q-W03-01 the seal route (P1). Q-W03-02 the statement wording catalogue (P1). Q-W03-03 the
  shared-file proposal P-W03-01 for `src/apps/edge/intake/routes.ts` (rendering only, P1). Q-W03-06 TA-08 hosts
  the hand back of a returned submitted case (pulls `core.hand_back` from WP-09, P1). Q-W03-07 the TA landing
  moves to `/ta` (P1).
- **Proofs.** V05 and V02 run on `lane-ui` with new synthetic groups per run and synthetic passport files that the
  LD-11 harness generates in memory (§8). The payment, forecast and new-price parts of V05 run as tests or on the
  old staff pages (Q-W03-08).

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` | §2 (all), §3.1 steps 1–5, §3.2 (approved assistance, TA reports a problem, withdrawn/suspended, dependency, group end), §3.3, §4 (all), §7.3 (TA Home, Mobile), §7.4, §7.5, §8.2, §8.3, §9 C05, §12 V02, V05, V07, V24 |
| `BUILD_SPEC.md` r2 | B03, B06, B07, B10, B14 to B21, B25, B33, B35 |
| `UI-PLAN.md` | A (AD-04, AD-06, AD-07, AD-10, AD-11), §1, §2.1 to §2.3, §3.2 TA-01 to TA-13, §4.1 steps 2–5, §4.2 (assistance, report a problem, withdrawn/suspended, group end), §5.2, §6.2, §7 (K rules; rows Create group to Report a problem), §8 (CMP-01 to CMP-05, CMP-09, CMP-11, CMP-24, CMP-28), §10, §11, §12.1, §14.2 |
| `SURFACE-INVENTORY-2026-10-10.md` | §2.6, RM-T1 to RM-T7, CMD-6 to CMD-13 |
| `DECISIONS-2026-10-10.md` | §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §3, §4, §7, §8 (S-01); `WP-01-design.md` §2, §7; `WP-01.md` §3, §4.1 (A-01 to A-12); `WP-02-design.md` §1.6, §3.12, §3.13, §8.1 (U0); `WP-02.md` §3; `WP-02-acceptance.md` §0.3, §3; `COMMAND-COVERAGE.md` §3, §5, §6 (CC-02, CC-05, CC-06); `PROPOSALS.md`; `execution-2026-10-12/SEAM-CONTRACT.md` §1 to §5; `uat/2026-10-12-uat-pass1-triage.md` Q-7 |
| Route map (RM) | §1, §2.1 rows C03, T02 to T59, §2.2.1, §2.3 (T01, T09), §3.1, §3.2, §4, §5 |
| Code | `src/apps/shared/core/{ta,shared,documents}.ts`, `src/apps/shared/{ta-intake,ta-documents,uploads,attention}.ts`, `src/apps/shared/pages/{intake,documents}.ts`, `src/apps/shared/views/{ta,cases}.ts`, `src/apps/edge/core/routes.ts`, `src/apps/edge/intake/{routes,application-documents}.ts`, `src/apps/edge/documents.ts`, `src/web/ui/shell.ts:100-125`, `src/web/route-inventory.ts:75-100`, `src/contracts/{core,intake,documents,views-cases,queries,delivery}.ts`; for Core behaviour only: `src/modules/intake/commands/start-individual.ts`, `src/modules/core/commands/{submission,drafts}.ts`, `src/modules/core/controls.ts:395-620`, `src/core-api/bindings/core.ts:170-232` |
| Bulk lane (read only, for the seam) | lane `bulk-refactor-2026-10-12`: commit 4496ee9 (`src/workers/passport-number.ts`), `bulk-redesign-2026-10-12/DESIGN.md` §2.5 |
| Tests that pin the pages | §9.3 |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry. Route ids of new routes are proposals.

| ID | Page | Path | Status | Reads (one row per query) |
|---|---|---|---|---|
| TA-01 | Home | `/ta` | **New** (inventory T01 gets id `ta.home`; action `application.read`; support view: yes) | `core.ta_applications`, `dlv.delivery_facts`, `dlv.notices`, `intake.incidents` |
| TA-04 | Groups | `/ta/groups` | Kept, rebuilt; create form moves to TA-13 | `core.ta_groups` |
| TA-13a | Create a group | `/ta/groups/new` | **New** (`ta.groups.new`, action `group.create`, support view: no) | `core.ta_groups` (countries, today) |
| TA-13b | Change travel dates | `/ta/groups/:groupId/travel-dates` (GET beside the existing POST) | **New** (`ta.groups.travel_dates_form`, action `group.edit_travel_dates`, support view: no) | `core.ta_group` |
| TA-05 | Group | `/ta/groups/:groupId` | Kept, rebuilt; carried WP-17 close form | `core.ta_group`, `dlv.delivery_facts` |
| TA-06 | Applications | `/ta/applications` | Kept, rebuilt; filters in the address | `core.ta_applications`, `dlv.delivery_facts`, `core.ta_groups` (group names, countries and dates for filters and cells; optional) |
| TA-06s | Search your applications | `/ta/search` | Kept, rebuilt; `?q=` removed (§6) | `views.search` |
| TA-07 | Application | `/ta/applications/:applicationId` | Kept, rebuilt; carried forms of WP-08, WP-09, WP-10, WP-13, WP-17 | `core.ta_application`, `doc.application_evidence`, `dlv.delivery_facts` (not for a draft), `doc.version_page` (identity conflict only, as today) |
| TA-08 | Check and submit | `/ta/applications/:applicationId/submit` (GET beside the existing POST) | **New** (`ta.applications.review`, action `application.submit`, support view: yes, read only) | `core.ta_application`, `doc.application_evidence`, `core.ta_group` (optional, context band) |
| TA-07h | Ask TravelMudra for help | `/ta/applications/:applicationId/request-assistance` (GET beside the POST) | **New** (`ta.applications.help_form`, action `application.request_assistance`, support view: no) | `core.ta_application` |
| TA-09c | Add one applicant (create mode) | `/ta/groups/:groupId/applications/new` | **New** (inventory T09 gets id `ta.applications.new`; action `application.create_draft`; support view: no) | `intake.start_page`, `core.ta_group` (optional, context band) |
| TA-09t | Prepare the application (task list) | `/ta/applications/:applicationId/prepare` | **New** (`ta.applications.prepare`, action `application.read`, support view: yes, read only) | `core.ta_application`, `doc.application_evidence`, `core.ta_group` (optional) |
| TA-09i | Identity details | `/ta/applications/:applicationId/correct-identity` (GET beside the POST) | **New** (`ta.applications.identity_form`, action `application.correct_identity`, support view: no) | `core.ta_application`, `doc.application_evidence`, `doc.version_page` (identity conflict only) |
| TA-09d | Application details | `/ta/applications/:applicationId/edit` (GET beside the POST) | **New** (`ta.applications.details_form`, action `application.edit_draft`, support view: no) | `core.ta_application` |
| TA-09f | Documents | `/ta/applications/:applicationId/documents` (GET beside the POST) | **New** (`ta.applications.documents_form`, action `document.upload`, support view: no) | `core.ta_application`, `doc.application_evidence` |
| TA-09u | Use a file already in this group | `/ta/applications/:applicationId/documents/existing/:requirementType` | **New** (`ta.applications.documents_existing`, action `document.associate`, support view: no; `requirementType` zod `^[a-z][a-z0-9_]{1,39}$`, a parse failure is the uniform 404) | `core.ta_application`, `doc.application_evidence`, `doc.group_versions` |
| DOC | Document (detail view, CC-05) | `/ta/documents/:versionId` | Kept, rebuilt | `doc.version_page`, `core.ta_application` (context, as today) |
| INT-1 | Individual-form result | `/ta/intake/:attemptId` when `attempt.sourceKind = individual_form` | Kept path; new rendering variant of `attemptPage` (bulk variant unchanged until WP-04) | `intake.attempt_page` |
| (old) | Add applicants (bulk start) | `/ta/groups/:groupId/intake/new` | Kept, not rebuilt (WP-04); its individual form becomes a link to TA-09c (D-W03-04) | `intake.start_page` |
| (old) | Group intakes, import issues, group documents, application history | `/ta/groups/:groupId/intake`, `/ta/intake-incidents`, `/ta/groups/:groupId/documents`, `/ta/applications/:id/history` | Not rebuilt (LD-02); linked from WP-03 pages | — |

GET routes with "support view: yes" are also registered at staff (RM §2.2.1), where they render no form.
Each new GET route: `params` zod with `zWireId('grp')`, `zWireId('app')` or `zWireId('dov')` as today
(`src/apps/shared/core/ta.ts:49-50`); `resolve` as the POST route on the same path. A GET on a POST path is
already a pattern (`/ta/groups` T04/T05; `/ta/account/email` T38/T39).

### 1.3 Shell placement (WP-01 §2.2)

| Rail destination | Pages that pass it as `current` | Notes |
|---|---|---|
| Home `/ta` | TA-01 | Shows once `ta.home` is registered (`hasPage`). WP-03 changes `SURFACE_CONFIG.ta.home` from `/ta/applications` to `/ta` (`src/web/ui/shell.ts:110`; WP-01 file, one value; the architect applies it). `/home` then answers 303 `/ta`. |
| Groups `/ta/groups` | TA-04, TA-13a, TA-13b, TA-05, TA-09c, INT-1 | The transitional member "Import issues" `/ta/intake-incidents` stays (WP-01 Q-12). |
| Applications `/ta/applications` | TA-06, TA-07, TA-07h, TA-08, TA-09t, TA-09i, TA-09d, TA-09f, TA-09u, DOC | DOC passes `/ta/applications` when it is shown for an application (context), else `/ta/groups` (group documents origin); today it always passes `/ta/groups` (`pages/documents.ts:392`). |
| Top bar "Search your applications" `/ta/search` | TA-06s | Unchanged link. |

Object tabs: none in WP-03. TA-05's Imports and Intake issues "tabs" are sections until WP-04 builds BU-P09 and the
issue view (D-W03-06, §2.3).

Breadcrumbs follow the origin (SH-R07, §2.6): TA-07 and its task pages show "Applications" (with the list's
filters) or "Groups › [group]" depending on how the page was reached.

### 1.4 The WP-03 commands and their pages

Field names are the current ones; none changes. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>`
hidden field. Handlers are the current ones unless the "Handler change" column says otherwise; no command input
mapping changes.

| # | Command | Route id (POST path) | Host page (WP-03) | Fields | Rev | Handler change (rendering only) |
|---|---|---|---|---|---|---|
| 1 | `core.create_group` | `ta.groups.create` (`/ta/groups`) | **TA-13a** (moved from TA-04) | `countryId`, `label`, `travelStartDate`, `travelReturnDate` | — | Refusal re-renders TA-13a; success `receiptLocation('/ta/groups/<id>', 'group_created', key)` |
| 2 | `core.edit_travel_dates` (register: WP-17) | `ta.groups.travel_dates` (`/ta/groups/:groupId/travel-dates`) | **TA-13b** (moved from TA-05) | `travelStartDate`, `travelReturnDate` | `group` | Refusal re-renders TA-13b; success receipt on TA-05 (`dates`) |
| 3 | `intake.start_individual` | `ta.intake.start_individual` (`/ta/groups/:groupId/intake/individual`, multipart) | **TA-09c** (moved from `/intake/new`) | `service.<offeringId>`=`yes`, `passportNumber`, `issuingCountry`, `surname`, `givenNames`, `dateOfBirth`, `nationality`, `sex`, `residentInIndia`, `doc.<requirementType>` (files) | `group` | Shared file: proposal P-W03-01 (re-render TA-09c; success receipt on INT-1) |
| 4 | `core.edit_draft` | `ta.applications.edit` (`/ta/applications/:id/edit`) | **TA-09d** (moved from TA-07) | `nationality` (only while none is recorded), `passportType`, `declaredCountry`, `field.<key>` | `application` | Refusal re-renders TA-09d; success receipt on TA-09t (`saved`) |
| 5 | `core.correct_identity` | `ta.applications.correct_identity` (`/ta/applications/:id/correct-identity`) | **TA-09i** (moved from TA-07) | `surname`, `givenNames`, `dateOfBirth`, `passportNumber`, `issuingCountry`, `nationality`, `evidence.<dov id>`=`yes`, `explanation` | `application` | Refusal re-renders TA-09i; success receipt on TA-09t (`corrected`) |
| 6 | `doc.upload_for_application` | `ta.documents.upload` (`/ta/applications/:id/documents`, multipart) | **TA-09f** (moved from TA-07) | `requirementType` (hidden per row; today a select), `file` | — (as today) | Refusal re-renders TA-09f; success receipt on TA-09f (`document`) |
| 7 | `doc.replace_version` | `ta.documents.replace` (`…/documents/:versionId/replace`, multipart) | **TA-09f** (no form posts it today) | `requirementType` (hidden), `file` | — | Today a refusal renders the shell error page (`ctx.respond`, `src/apps/edge/intake/application-documents.ts:64-75`); WP-03 re-renders TA-09f with the reason (F-W03-04); success receipt `replaced` |
| 8 | `doc.associate` | `ta.documents.associate` (`…/documents/:versionId/associate`) | **TA-09u** (no form posts it today) | `requirementType` (hidden) | — | As #7: re-render TA-09u; success receipt on TA-09f (`associated`) |
| 9 | `doc.resolve_extraction` | `ta.documents.resolve_extraction` (`/ta/documents/:versionId/resolve-extraction`) | DOC (CC-05) | `fields.<mrzKey>`, `attestation`, `reason` | `version` | Success `receiptLocation('/ta/documents/<id>', 'resolved', key)` (today no confirmation, F-W03-06) |
| 10 | `doc.confirm_classification` | `ta.documents.classification` (`/ta/documents/:versionId/classification`) | DOC (CC-05) | `type`, `reason` | `version` | Success receipt `classified` |
| 11 | `core.submit` | `ta.applications.submit` (`/ta/applications/:id/submit`) | **TA-08** (moved from TA-07) | `confirm.<code>`=`yes`, `version.<code>` (hidden), `quotedPricePaise`, `estimateStart`, `estimateEnd` (hidden) | `application` | Refusal re-renders TA-08; success receipt on TA-07 (`submitted`) |
| 12 | `core.request_assistance` | `ta.applications.request_assistance` (`…/request-assistance`) | **TA-07h** (moved from TA-07; TA-07, TA-08 and TA-09 link to it) | `note` | `application` | Refusal re-renders TA-07h; success receipt on TA-07 (`assistance`) |

Rows 1 to 12 hold eleven commands of the register (§5.1) plus `core.edit_travel_dates`. Register update proposed
to the architect: `core.edit_travel_dates` gets WP-03 as its building package (TA-13 is built in WP-03; the
travel-date impact preview of UI-PLAN TA-13 needs a read model that does not exist, so WP-17 adds it only if one
appears).

Each command has exactly one host page in WP-03. So a refusal always re-renders the page it came from, and no form
needs a new hidden "origin" field. `src/apps/edge/core/routes.ts` `appForm` (`:26-32`) re-renders TA-07 for every
application form today; WP-03 gives `appForm` a re-render function per form (§9.1 U3, U4).

### 1.5 Carried forms of later packages on pages that WP-03 rebuilds

LD-07 forbids hiding a served command. Each form below keeps its current markup, fields, action, re-render target
(TA-07 or TA-05) and success redirect (`?done=` only). The owning package rebuilds it. A unit test lists them by
action path, as in WP-02 §8.2, and asserts that each rebuilt page still renders them.

| Command | Owner | Page | Placement in WP-03 | Current markup |
|---|---|---|---|---|
| `core.close_group` | WP-17 (CC-02) | TA-05 | Section "Closing the group" | `src/apps/shared/core/ta.ts:306-310` (see Q-W03-09 on its visibility rule) |
| `core.report_problem` | WP-09 | TA-07 | Action panel of "assigned, not returned" (§3) and the withdraw-ask-return disclosure | `ta.ts:551-556`, `:580-585` |
| `core.hand_back` | WP-09 | TA-07 (or TA-08, Q-W03-06) | Section "Returned to you for correction" | `ta.ts:434-441` |
| `core.request_withdrawal` | WP-17 | TA-07 | Aside "Other actions", "Withdraw" | `ta.ts:576-602` |
| `core.decide_price_increase` (accept, decline) | WP-17 | TA-07 | Section "Price and timing" | `ta.ts:521-534` |
| `core.decide_transition` | WP-13 | TA-07 | Section "Waiting for your decision" | `ta.ts:635-640` |
| `core.apply_held_correction` | WP-17 | TA-07 | Same section | `ta.ts:630-634` |
| `core.link_dependency`, `core.unlink_dependency` | WP-10 | TA-07 | Section "Related applications" (the unlink form has no host today; it stays without one, as at 102e4c9) | `ta.ts:604-627` |
| Delivery link, completion checklist, download step | WP-08 | TA-07 | Section "Result and delivery" | `ta.ts:650-664` |
| Originals section | WP-12 | TA-07 | Section "Originals" | `originalsSection` |
| Payment summary ("How to pay") | WP-16 (TA-11 family) | TA-07 | Section "Payment" | `ta.ts:445-453` |

The register (§6 CC-06) already assigns these panels. Nothing in WP-03 changes their behavior, except that each now
sits in the WP-03 section order of §2.7.

### 1.6 Shared components

Reused, no new variant: WP-01 §7 CMP-07 (`errorSummary`, form-level items), CMP-08 (`operationReceipt`,
`receiptLocation`, `readReceipt`), CMP-10 (`boundaryNotice`), CMP-12 (freshness on `pageHeader`), CMP-13 (operation
status page), CMP-14 (`staleComparison`; WP-03 is its first consumer, WP-01 §7.6); WP-02 U0 CMP-01 `actionPanel`,
`statusFacts` (CMP-03 subset), `objectTabs` (not used in WP-03). Existing parts: `dataTable` (cards at narrow width),
`summaryList`, `checkboxField`, `fileField` (with `rulesFrom`), `disclosure`, `confirmDisclosure`, `identifier`,
`timeAt`, `money`.

New in WP-03 (unit U0, §9.1):

- **CMP-04 Task list** (`taskList`). An ordered list of links; each item "label — state text" with the state also in
  a visually separate tag. States (closed set): "No open item", "Needs your input", "Needs evidence", "Being
  checked", "Cannot change", "Cannot start yet", "Not checked here" (no Core evaluation for this case state),
  "Unavailable" (read failed). No percentage, no count of completed sections, no "Ready", no "Complete" (UX §4.3,
  §7.4). Accessibility: `ol` with `aria-label="Parts of this application"`; each state in text (AC-06).
- **CMP-05 Check answers** (`checkAnswers`). Sections of `summaryList` rows, each section with a "Change [section
  name]" link (link text names the section, AC). A confirmation block: one checkbox per statement, never
  prechecked, the statement text in the label, the statement version as a hint. States: draft review;
  confirmation required; stale (CMP-14 above); unavailable (CMP-10 in place of the form). The consequence text is
  visible before the button, never inside a collapsed region.
- **CMP-02 Evidence row** (`evidenceRows`). One row per declared requirement: document (type; required or
  optional), what the file must be (formats and size from the requirement), status in words (§4.7 table), the
  file (link to DOC), whose step it is (you, or TravelMudra), and the row's action. States: missing; processing;
  accepted; conflict; unsafe or refused; unreadable; unavailable; replaced; unknown status ("Unrecognised state",
  S4).
- **CMP-11 Identity band** (`identityBand`). `h1` holds the applicant's name and the application reference
  (`identifier` with copy); meta row: group (link), service. States: full; partial (a missing fact is left out, never
  "Unknown"). Service mode and country are not in the TA case read model (STOP-W03-03, P2).
- **CMP-24 Context band** (`contextBand`). Group, country, travel dates (IST), service(s); a `<details>` "View
  requirements" with the declared documents (formats, size limit). States: full; partial ("Unavailable" for a fact
  whose read failed); offering unavailable (CMP-10 inside the band).
- **CMP-28 File input** reuses `fileField`; WP-03 adds only copy (§4.6). No new markup.

## 2. Page specifications

### 2.0 Rules common to every WP-03 page

- **Freshness (LD-08).** Every WP-03 read is authoritative except `views.search`. Pages show CMP-12 "Read at [time]
  IST" on the breadcrumb row. TA-06s shows the projection's lag form ("Up to date when read at …", "Behind by [n] s
  when read at …", "Freshness unavailable"). No page applies its own age threshold.
- **Page states.** S1 Loading: every page is rendered complete by the server; no skeleton exists. S5 Stale: only
  TA-06s reads a projection; elsewhere staleness appears as a stale revision (C5). S6 Denied and S7 Error: the SH-02
  pages of WP-01 (uniform 404 without object facts; Core unreachable 503 "Nothing was sent, so nothing changed").
  The tables below list S2, S3, S4 and page-specific variants only.
- **Optional reads.** A read named "optional" in §1.2 is wrapped as today (`listFacts`, `ta.ts:770-780`): a failure
  renders the page without it and shows "Unavailable" in place of each fact it supplies (D7). A required read that
  fails is S7.
- **Command results.** ACC: 303 to the host or result page with `?done=<code>&op=<key>` (`receiptLocation`); CMP-08
  first in `main`, its title first in the document title; facts from the page's own reads (§2.14). REJ: the host
  page re-rendered with the category's status, CMP-07 focused, every typed value kept except files and
  confirmation checkboxes after a stale refusal (§5.4); the refusal sentence from the closed TA tables (`sentence(code,
  'ta')`, `codeText`); an unknown code shows the category text plus "Reference: [code]" (UAT-13 rule). C5:
  CMP-14 (§2.15). UNR: 303 to `/ta/operations/<key>` (WP-01 CMP-13); the page MUST NOT offer a new submission of the
  same intent.
- **K rules.** Every WP-03 command is K-STD (UI-PLAN §7). The form carries one `_op` from page load; a browser
  resend reuses it. Re-rendering a refused form issues a new `_op` (a refused command records nothing,
  B35).
- **Support view.** Pages marked "support view: yes" render at staff with no form and no action link to a form
  page. A step the TA would take is shown disabled with "Read only in a support view: only the travel agent takes
  this step." (current docket rule, `ta.ts:702-706`).
- **Copy.** UI-PLAN §11 rules and the UX §4.4 TA copy. Times carry "IST". Counts name their unit. Money is "₹" with
  Indian grouping (`money`). Synthetic data shows "Synthetic" (CR-08). No "Ready", "Complete", "All done", "Submit
  all", percentage or SLA. Estimates read "estimate, not a guarantee". All copy is draft (CR-09).
- **Mobile (< 768 px).** One column. Identity, status facts and the next action come before details (AC-21). Tables
  become labelled cards (`dataTable`). Task pages (TA-13, TA-09, TA-08, TA-07h) are full-screen task pages; the
  primary action sits at the end of the form, never in a fixed bar. Long lists (group documents, 200 applications)
  scroll in the page, not in a nested region, except the TA-09u version list (labelled region).

### 2.1 TA-01 Home `/ta`

Anatomy (reading order):

1. Header: `h1` "Home"; lead "What needs your action now, and recent notices about your applications."; freshness.
2. Section "Needs your action" (`id="needs-action"`). A list (not a table) of the applications that need the TA's
   action, by the TA attention rule that TA-06 and the navigation count use (`needingAction`, `ta.ts:730-736`;
   WP-01 Q-06). Each item: applicant (link to TA-07), service, the reason in the TA's words (`taPendingOf`), and one
   action link ("Open the notice", "Download your result", "How to pay", "Continue the application", "Check and
   submit") built from the same mapping as TA-07's action panel (§3). Order: Core's list order. At most 20 items,
   then "Show all [n] applications that need your action" → `/ta/applications?view=needs_action`.
3. Line "Import issues waiting for you: [n] issues" with the link "Open import issues" (`/ta/intake-incidents`),
   only when `intake.incidents` has open items (`intakeIncidentOpen`).
4. Section "Travel-date notices" (`id="travel-risk"`): notices of kind `timing_risk`, newest first, at most 5, each
   with its application link, posted time (IST) and "Needs your acknowledgement" or "Acknowledged [time]" (LD-06).
   Hidden when there is none.
5. Section "Recent results and closures" (`id="recent"`): notices of kinds `result_available`,
   `external_outcome_unresolved`, `withdrawal_decision` and `generic_case_update`, newest first, at most 5, text by
   `noticeText`. Link "All notices" (`/ta/notices`). Hidden when there is none.
6. Shortcuts (quiet): "Browse services" (`/ta/catalogue`), "Create a group" (TA-13a).

Primary action: the first item's action link. Secondary: any item; the shortcuts. Actions are navigation only.

| State | Copy |
|---|---|
| S2 (no application exists) | Title "Start here"; ordered steps: "1. Choose a service: read its price, estimate and documents. [Browse services]" "2. Create a group for the trip: one country, one set of travel dates. [Create a group]" "3. Add the applicants of the group. Each applicant gets an application that you submit yourself." No country name, no count. |
| Nothing needs action (applications exist) | "Nothing needs your action now." followed by blocks 4 to 6 |
| S4 delivery facts unreadable | Above the list: "Some reasons may be missing: notices and downloads could not be read now. Open Notices to check." The list shows Core's pending answers only (F-W03-01) |
| S4 one block's read fails | That block reads "[Block] is unavailable now." The other blocks render. No zero |
| Support view | Same page at staff; action links to form pages render as disabled text with the support-view reason |

Mobile: items as cards: applicant and service, then the reason, then the action link.

### 2.2 TA-04 Groups `/ta/groups`

1. Header: `h1` "Groups"; lead "A group is one trip: one country and one set of travel dates, in India time (IST).
   Each applicant of the trip gets their own application in it."; header action "Create a group" (primary, TA-13a;
   absent in a support view); freshness.
2. Filter (GET form, `aria-label="Filter groups"`): "Show" select `state` ∈ {`` (all), `open`, `closed`}; button
   "Apply"; link "Clear filters". The address holds only `state` (SH-R06). Filtering compares the row's `state`
   with the value; it computes nothing else. A change of filter re-renders the page; the result line "[n] groups
   shown" is the first text of the list region (AC-16).
3. Table "Your groups" (caption hidden). Columns: Group (label link; country name below); Travel dates ("[start] to
   [return]"); State ("Open", "Closed", "Closed after the travel return date" for `closed_kind = group_end`);
   Applications ("[open_count] open of [total_count] applications", from Core).
4. Line "This list shows at most 200 groups." only when 200 rows are returned (D7: more may exist).

Not available (data absent, D-W03-07, STOP-W03-02): application counts by common progress, unresolved import
issues per group, next action per group, country filter (rows carry no country id).

| State | Copy |
|---|---|
| S2 | Empty state "No groups yet"; body "Create a group for a trip, then add its applicants."; action "Create a group" |
| S3 | "No group matches this filter. [Clear filters]" and "[n] groups are in other states." |
| Receipt | None on this page (group receipts are on TA-05) |

Mobile: group cards: label and country, then state and applications, then dates.

### 2.3 TA-05 Group `/ta/groups/:groupId`

1. Header: breadcrumb "Groups"; `h1` group label; meta: Country (or "Country no longer listed", existing text),
   Travel dates ("[start] to [return] (IST)"); freshness.
2. Receipt (`group_created`, `dates`; the carried `closed` keeps its `doneFlash`).
3. Status facts (`statusFacts`): "Group" Open / Closed / Closed after the travel return date. One row; no badge.
4. Action panel (CMP-01) "Next action": open group: owner "You"; step "Add the applicants of this trip."; primary
   "Add one applicant" (TA-09c); secondary "Import a list" (`/ta/groups/:id/intake/new#list`, old page until WP-04),
   "Change travel dates" (TA-13b), "Group documents" (old page). Closed group: "This group is closed. It takes no new
   applications. Its history is kept." and no action.
5. Section "Applications" (`id="applications"`): rows as TA-06 (§2.6) without the group column; each row links to
   TA-07 with `from=group`. Empty: "No applications yet. Add the applicants of this trip: one at a time with their
   passport, or a list from a spreadsheet, a public Google Sheet or a public folder. Each applicant gets a draft
   you review and submit." with "Add one applicant".
6. Section "Imports" (`id="imports"`): "Imports still running: [closure.activeAttempts] imports" (Core) and the link
   "Open the imports of this group" (`/ta/groups/:id/intake`, old page). WP-04 replaces it with BU-P09.
7. Section "Import issues" (`id="issues"`): "Open import issues of this group: [closure.openIncidents] issues"
   (Core) and the link "Open import issues" (`/ta/intake-incidents`). WP-04/WP-18 replace it.
8. Section "Closing the group" (`id="close"`): the rule as static text (B25): "A group closes when every application
   in it is completed or has ended, and no import issue or running import remains. After the travel return date,
   unpaid applications with no TravelMudra work end with the group. Nothing is deleted." The facts of items 6 and 7.
   The carried WP-17 "Close the group" confirmation (§1.5). The page MUST NOT compute "can close" from the rows
   (F-W03-05, Q-W03-09).
9. No "Submit all" and no group-level action on applications (UX §4.2).

| State | Copy |
|---|---|
| S2 | Item 5 empty text |
| S4 delivery facts unreadable | Row reasons read as Core's pending answer; the note of §2.1 S4 above the table |
| Closed group | Header and sections read only; action panel text of item 4; carried close form absent (Core state `closed`) |
| Receipt `group_created` | "Group created" — Group [label] (link), Country, Travel dates; "Next: add the applicants." |
| Receipt `dates` | "Travel dates changed" — Travel dates now; "TravelMudra checks this group's unfiled applications against the new dates. An application that waits for that check says so below." |

Mobile: identity, status, action panel (its primary at the end of the panel), then sections stacked (UI-PLAN TA-05
"tabs become a labelled select" does not apply: no tabs in WP-03).

### 2.4 TA-13 Group setup

**TA-13a Create a group `/ta/groups/new`.** Full-screen task page.

1. Header: breadcrumb "Groups"; `h1` "Create a group"; lead "A group is one trip: one country and one set of travel
   dates. You add the applicants after you create it."
2. Error summary (C1/C2).
3. Form (action `/ta/groups`): Country (select `countryId`, options from `core.ta_groups.countries`, placeholder
   "Choose a country", no preselection; hint "The country cannot change later. Another country needs another
   group."); Group name (`label`, maxlength 200; hint "Your own name for the trip, for example the client and the
   month."); Travel start date (`travelStartDate`, `type=date`, `min` = `today`); Travel return date
   (`travelReturnDate`, `min` = `today`); hint "Dates are in India time (IST)."
4. Consequence line before the button: "Creating a group creates no application and sends nothing to TravelMudra."
5. Primary "Create group"; secondary "Cancel" → `/ta/groups`.

| State | Copy |
|---|---|
| No listed country (`countries` empty) | No form; CMP-10 "Creating a group is unavailable until TravelMudra opens a country for new groups. Owner: TravelMudra." |
| C1 | Field errors: `group_dates_invalid` "Travel must start today or later and return on or after the start." (existing); empty name "Enter a name for the group."; `country_not_listed` on the country field |
| C3 | 303 to TA-05 with receipt `group_created` |
| C4 | WP-01 operation page; "Open the result" → TA-05 (`resultHrefOf` group) |

**TA-13b Change travel dates `/ta/groups/:groupId/travel-dates`.** Full-screen task page.

1. Header: breadcrumb "Groups › [group]"; `h1` "Change the travel dates of [group]".
2. Facts: "Travel dates now: [start] to [return] (IST)".
3. Form (action as the path; `_rev.group`): Travel start date, Travel return date (prefilled with the current dates).
4. Consequence text, visible: "TravelMudra checks this group's unfiled applications against the new dates. Filed
   work does not change. An application may wait for that check before you can submit it." No list of "affected"
   applications: Core decides which are affected and no read model previews it (UI-PLAN TA-13 preview: D-W03-07).
5. Primary "Save travel dates"; secondary "Cancel" → TA-05.

| State | Copy |
|---|---|
| Group closed | No form; CMP-10 "Changing the travel dates is unavailable because the group is closed." |
| C1 | `group_dates_invalid` on the start field |
| C5 | CMP-14 rows: Travel start date, Travel return date (your unsent value / current value); "Review current information" re-opens the form with the current dates |
| C3 | 303 to TA-05 with receipt `dates` |

### 2.5 TA-06s Search your applications `/ta/search`

Specified in §6 (SH-R06).

### 2.6 TA-06 Applications `/ta/applications`

1. Header: `h1` "Applications"; lead "Every application of your groups, with what happens next. To add an applicant,
   open a group."; freshness.
2. Search form (§6): "Search your applications" (name, passport number or application reference) → TA-06s.
3. Filters (GET form, `aria-label="Filter applications"`): View `view` ∈ {`` all, `needs_action`}; Progress
   `progress` ∈ PROGRESS_MEANINGS (TA labels from `progressPresentation`); Group `group` = a group id (select from
   `core.ta_groups`). Buttons "Apply", "Clear filters". Values outside the closed sets are ignored (the filter is
   then off).
4. Result line: "[n] applications shown" (AC-16), then the table. Columns: Applicant (name link; reference as
   `identifier` below); Group (link; country below, from `core.ta_groups`); Service (`offering_title`); Progress
   (`progressBadge` text); Outcome ("Outcome not recorded" when null); Next (owner label and the reason,
   `pendingCell`); Travel ("[start date]", from `core.ta_groups`). Rows the attention rule marks carry the
   "Needs your action" row marker (text, not colour only).
5. Line "This list shows at most 200 applications. Search finds any of your applications." when 200 rows return.

Each row's link carries the list state: `/ta/applications/:id?from=applications&view=…&progress=…&group=…` (only
the params set). TA-07 uses them for its breadcrumb and "Back to the list" link (SH-R07). No page stores the
return position.

Not available (D-W03-08, STOP-W03-04): service filter and country filter (rows carry no offering id and no country
id), sort.

| State | Copy |
|---|---|
| S2 | "No applications yet. Applications start in a group: open a group and add its applicants." with "Go to your groups" |
| S3 | "No application matches these filters. [Clear filters]" and "[n] applications exist without these filters." |
| S4 groups read failed | Group and travel cells and the Group filter read "Unavailable"; the Group filter is not offered |
| S4 delivery facts unreadable | Note of §2.1 S4; `view=needs_action` then shows "This view may be incomplete now." |
| Support view | Same page at staff, no search form (§6.5) |

Mobile: cards: applicant and reference → next (owner, reason) → progress and outcome → group, service, travel.

### 2.7 TA-07 Application `/ta/applications/:applicationId`

Anatomy (reading order). Items marked "carried" keep their current markup (§1.5).

1. Breadcrumb by origin: `from=applications` → "Applications" (with the list's params); `from=group` or none →
   "Groups › [group label]"; `from=search` → "Search results" (with `r`, §6). Freshness "Read at [time] IST".
2. Receipt (`submitted`, `assistance`; the carried forms keep their `doneFlash` codes `problem`, `handed_back`,
   `withdrawal`, `price`, `linked`, `unlinked`, `reapplied`, `transition`). The codes `edited` and `corrected` move to
   TA-09t (`saved`, `corrected`).
3. Identity band (CMP-11): `h1` "[SURNAME], [Given names]" and "Application [reference]" (`identifier` with copy);
   meta: Group (link), Service.
4. Status facts (CMP-03, `statusFacts`), each its own labelled row: Progress (TA label); Outcome ("Outcome not
   recorded" when null); Next ("[owner] — [reason]" from `taPendingOf`); Stage (lifecycle: Draft, Submitted,
   Completed, Ended with the group); Editing (`editor_state`: "You can change it", "With your operator", "Returned to
   you for correction", "An operator is entering information with your approval"); Service payment (Payment Records
   status, "Not recorded" for `unrecorded`); Help request ("Not requested", "Requested: TravelMudra decides",
   "Approved", "Declined"); Problem report and return (open holds by name, "None"); Withdrawal (only when a withdrawal
   exists). No combined badge, no percentage (D4).
5. Action panel (CMP-01) "Next action": owner, step, blocker type in words, one action, built by the closed mapping
   of §3.2. When the step is the TA's own and another fact is also due (payment, price decision), "Also needed"
   lists it (current `alsoNeeded`, `ta.ts:686-689`).
6. Notices that bound an action (CMP-10), when Core's evaluations block them: submission (`submit.blockers` of
   offering, existing-work, catalogue or travel-rule codes) and change (`correct.blockers`). Each notice names the
   action, the reason sentence, the owner (TravelMudra) and the route ("Your draft is kept.").
7. "Returned to you for correction" (carried WP-09 hand-back section; first in the main column, as today), when a
   return hold is open.
8. Section "Application" (`id="applicant"`): summary of identity and details (read only). When `correct.allowed`
   is true: link "Change the application" → TA-09t. The passport-mismatch callout stays (`ta.ts:501-507`) with its
   link to TA-09i.
9. Section "Documents" (`id="documents"`): CMP-02 rows read only (first two cells: document, status; the system-test
   helper `untilDocuments` reads them, `test/system/support/drafts.ts:40-45`); "View the document" links to DOC with
   `?application=`. When the TA may change the application: link "Add or replace documents" → TA-09f.
10. Section "Price and timing" (`id="price"`): Price now ("[₹] if you submit today, fixed when you submit") for a
    draft; for a submitted case: Quoted at submission; Price in effect; Proposed new price (carried WP-17 decision
    forms); Original estimated window ("[start] to [end], an estimate, not a guarantee"; "Not set" for a draft);
    Current forecast ("No later forecast" when null), each its own row (B17).
11. Section "Payment" (carried), "Waiting for your decision" (carried WP-13/WP-17), "Related applications" (carried
    WP-10), "Result and delivery" (carried WP-08), "Originals" (carried WP-12).
12. Aside "Other actions": "Ask TravelMudra for help" (→ TA-07h; shown when `assistance` is evaluated, §3.3);
    "Withdraw" (carried WP-17 section); "History" (`/ta/applications/:id/history`, old page); "Open the group".

Primary action: the action panel's one action. Secondary: the aside.

| State | Copy |
|---|---|
| S4 delivery facts unreadable (submitted case) | Status row "Delivery: unavailable now"; the action panel reads Core's pending answer; note "Notices and downloads could not be read now." |
| S4 evidence unreadable | Section 9 "Documents are unavailable now." (today `doc.application_evidence` is a required read; WP-03 makes it optional on TA-07 only) |
| S4 identity conflict reading failed | The mismatch callout without the "Passport reads" row (current behavior, `ta.ts:788-803`) |
| Support view | No form; links to the form pages (TA-09i, TA-09d, TA-09f, TA-07h) absent; TA-09t and TA-08 open read only; the action panel step disabled with its reason |
| Receipt `submitted` | §5.5 |
| Receipt `assistance` | §2.9 |

Mobile (UX §7.3): identity band → action panel and its blockers → status facts → sections → aside items at the
end. The action panel is not sticky.

### 2.8 TA-08 Check and submit `/ta/applications/:applicationId/submit`

Full-screen task page. Specified in §5. Anatomy: header (breadcrumb "Applications › [applicant]"; `h1` "Check and
submit: [applicant]"; freshness) → error summary or CMP-14 → check-answers sections → evidence → price and
estimate → unpaid facts → authority statements → consequence text → "Submit this application" → secondary links.

### 2.9 TA-07h Ask TravelMudra for help `/ta/applications/:applicationId/request-assistance`

1. Header: breadcrumb "Applications › [applicant]"; `h1` "Ask TravelMudra for help with [applicant]".
2. Text: "An operator may enter the application information with you. TravelMudra decides whether to help. Asking
   for help is not a submission and changes no price. The application stays a draft until you submit it yourself."
   For a submitted case: "… The application stays as it is until TravelMudra decides."
3. Form (action as the path; `_rev.application`): "What do you need help with?" (`note`, optional, maxlength 2000).
4. Primary "Ask for help"; secondary "Back to the application".

| State | Copy |
|---|---|
| Request already open (`assist.state` requested or approved) | No form. "You already asked for help. TravelMudra decides on it and tells you on the application page." (approved: "TravelMudra approved your request and assigns an operator to it.") |
| Unavailable (`assistance.allowed = false`) | No form; CMP-10 with each blocker sentence; for `awaiting_formal_return`: "This application is with your operator. Report the problem so it can be returned for correction." with the link to TA-07's report form |
| C2 `assistance_request_open` | "A help request is already open. TravelMudra decides on it." |
| C3 | 303 to TA-07 with receipt `assistance`: "Help requested" — Help request: Requested, TravelMudra decides; Application: still [Draft/Submitted], nothing was submitted; Next: TravelMudra administration decides |

### 2.10 TA-09c Add one applicant `/ta/groups/:groupId/applications/new`

Full-screen task page; one form (§4.1). Anatomy:

1. Header: breadcrumb "Groups › [group]"; `h1` "Add one applicant"; lead "Choose the services for this applicant
   and enter their passport details. Each service you choose becomes its own draft application. Nothing is sent to
   TravelMudra until you submit each application yourself."
2. Context band (CMP-24): group, country, travel dates (IST), "View requirements" (per selectable service: its
   documents with formats and size limit).
3. Error summary (C1/C2), focused after a refusal; a form-level item "Choose the files again. The page does not keep
   files after a refusal." whenever the refused form carried files.
4. In-page index (links to the four parts below; not a task list, D-W03-01).
5. Form (multipart, action `/ta/groups/:groupId/intake/individual`, `_rev.group`):
   - Part "Services" (`fieldset`, legend "Services for this applicant"): one checkbox `service.<offeringId>` per
     offering of `intake.start_page.offerings`, never prechecked except the TA's own typed values after a refusal.
     Label "[title]"; hint "[who files] · Documents: [labels]". An offering with `selectable = false` shows its
     reason (`codeText(reason)`) as the hint and its checkbox `disabled` with `aria-describedby` (AC-13).
   - Part "Applicant" (passport details): Passport number (`passportNumber`, mono, hint from the shared rule, §4.4);
     Issuing country (`issuingCountry`, three-letter code); Surname; Given names; Date of birth; Nationality; Sex
     (optional); Lives in India (`residentInIndia`, optional, select Yes/No/Not stated). Line: "The passport number
     and issuing country identify the applicant. Nothing is matched by name."
   - Part "Documents": one `fileField` per document type that a selectable offering declares (`doc.<type>`),
     with the strictest rule of the services that ask for it (current `strictestRule`), the services that ask for it
     in the hint, and for the passport type the passport rule (§4.3). Line: "Optional now: you can add documents
     to each draft later. Each file is checked for safety before anything reads it."
   - Part "Create": consequence text "This creates one draft application for each service you chose. It submits
     nothing." Primary "Create drafts"; secondary "Cancel" → TA-05.

| State | Copy |
|---|---|
| No selectable offering in the country | No form; CMP-10 "Adding an applicant is unavailable until a service of [country] is open for new applications. Owner: TravelMudra." (UX §4.4 "No service is currently available for new applications in this scope.") |
| Group closed | No form; CMP-10 "Adding an applicant is unavailable because the group is closed." |
| C1 | Field errors at the fields (§4.9) |
| C2 `duplicate_open_scope` | "This applicant already has an open application for [service] in this group. Nothing was created." with "Open the existing application" (`error.existing`) |
| C2 control refusal of one service | "[Service]: [reason sentence]. Nothing was created for any service." (all or nothing, `start-individual.ts:146-152`); the service's checkbox shows the reason after the re-render |
| C3 | 303 to INT-1 with receipt `drafts` (P-W03-01) |
| C4 | WP-01 operation page; "Open the result" → INT-1 (`resultHrefOf` `intake_attempt`, §9.1 U7) |
| C5 `stale_revision` (group) | CMP-14 rows: Travel dates (yours at page load / current), Group state; values kept; files to be chosen again |

### 2.11 TA-09t Prepare the application, and its section pages

Specified in §4. TA-09t anatomy: header (breadcrumb by origin; `h1` "Prepare the application: [applicant]";
freshness) → receipt (`saved`, `corrected`) → context band (CMP-24) → status line (draft or returned) → CMP-10
notices of offering-level blockers → task list (CMP-04) → "Other items that stop submission" (blockers with no
section) → secondary links ("Ask TravelMudra for help", "Back to the application").

Section pages TA-09i, TA-09d, TA-09f, TA-09u: full-screen task pages with breadcrumb "… › Prepare the application",
one form each (TA-09f: one form per document row), primary "Save" (or "Upload", "Use this file"), secondary
"Back to the task list". After an accepted save the page answers 303 to TA-09t with the receipt (TA-09f answers to
itself, so the TA sees the new row status at once).

### 2.12 DOC Document detail view `/ta/documents/:versionId` (CC-05)

Path, reads and both forms stay (`src/apps/shared/ta-documents.ts:61-82`, `src/apps/shared/pages/documents.ts`).
Rebuilt anatomy:

1. Breadcrumb from the version's own associations (current `applicationContext` rule; never from the link alone):
   "Applications › [applicant] › Documents" (TA-09f when the TA may change the application, else TA-07#documents),
   or "Groups › Group documents". Freshness.
2. Receipt (`resolved`, `classified`).
3. `h1`: the document's name (current `documentTitle`).
4. Status facts (CMP-03 style, replacing the one combined badge, F-W03-09), each its own row: Safety check (Passed;
   Refused: [reason]; Running; Waiting for the malware scanner; With TravelMudra support); Details read (Read and
   verified; Your review is needed; Not read; Nothing to read; Recorded by you); What it is ([type], confirmed or
   proposed; Not yet classified; Not related to any application); For this application (Accepted; Proposed;
   Does not match the applicant; Refused; Not linked) — only with an application context; Version (Current;
   Replaced by a newer file); Stored file (Available; Unavailable). Sources: `detail.version` fields,
   `detail.extraction`, the association of the context.
5. Action panel (CMP-01): your review needed → "Check the details" (anchor to the resolve form); type not confirmed
   → "Confirm what this document is"; does not match → "Compare and correct the identity details" (TA-09i);
   refused → "Upload a new file" (TA-09f, when allowed); TravelMudra's step (scanner, support) → owner
   "TravelMudra", "You do not need to do anything."; accepted → "Nothing is needed."
6. Section "Details read from the document": as today (`extractionSection`), with the resolve form (`fields.<key>`,
   `reason`, `attestation` never prechecked, `_rev.version`).
7. Section "What this document is": as today (`classificationSection`), the classification form.
8. Section "File": facts (kind, received, size, detected type, pages, image size, reference).
9. Section "Safety checks": the table (as today).
10. When the bulk lane serves passport parts: a row "Passport page: Front / Back / Front and back in one file".

| State | Copy |
|---|---|
| C1 resolve | Field errors at the MRZ fields (`manual_contradicts_check_digit`; "Enter a valid value."); the attestation box unchecked after any refusal |
| C2 | Existing `CODE_TEXT` sentences (`pages/documents.ts:34-75`) |
| C5 `stale_revision` (version) | CMP-14 rows: Details read, What it is (yours / current) |
| C3 `resolved` | "Details recorded" — Details read: Recorded by you; For this application: [status now] |
| C3 `classified` | "Document type confirmed" — What it is: [type] (confirmed), or "Excluded as unrelated" |
| Support view | No form (as today) |

### 2.13 INT-1 Individual-form result `/ta/intake/:attemptId` (`sourceKind = individual_form`)

`attemptPage` (`src/apps/shared/pages/intake.ts:474`, UI-owned renderer) renders this variant; the bulk variant does
not change before WP-04. The route and its read stay (`src/apps/shared/ta-intake.ts:52-68`, shared file, untouched).

1. Breadcrumb "Groups › [group]"; `h1` "Applicant added: [applicant name as read]"; freshness.
2. Receipt `drafts` (when the address carries `done=drafts&op=…`, P-W03-01): "Drafts created".
3. Table "Applications created" from `rows[0]` and `services[]`: Service (offering title), Result ("Draft created",
   or the refusal sentence), Application (link "Prepare this application" → TA-09t, by `applicationId`).
4. "Documents sent with the form": `files[]` with state (Being checked, Checked, Refused: [reason], Not available)
   and "Each application shows its own document checks."
5. While `attempt.state = processing`: "Document checks are running. You can prepare the applications meanwhile."
   No question, correction or abandon form (they do not apply to an individual form, `correction_not_applicable`).

### 2.14 Receipt facts per command (CMP-08)

| Done code | Host page | Resource kind | Receipt title | Resulting facts (source) |
|---|---|---|---|---|
| `group_created` | TA-05 | `group` | Group created | Group, country, travel dates (`core.ta_group.group`) |
| `dates` | TA-05 | `group` | Travel dates changed | Travel dates now; recheck sentence (§2.3) |
| `drafts` | INT-1 | `intake_attempt` | Drafts created | Applicant, each service with its application link (`intake.attempt_page.services`) |
| `saved` | TA-09t | `application` | Application details saved | The details section's values now (`core.ta_application`) |
| `corrected` | TA-09t | `application` | Identity details corrected | Identity values now; "The documents you chose are recorded as the evidence." |
| `document` | TA-09f | `application` | File received | Document type; status now from `doc.application_evidence` ("Being checked …") |
| `replaced` | TA-09f | `application` | File replaced | Document type; status now; "The earlier file stays on record as replaced." |
| `associated` | TA-09f | `application` | File linked | Document type; status now |
| `resolved` | DOC | `document_version` | Details recorded | §2.12 |
| `classified` | DOC | `document_version` | Document type confirmed | §2.12 |
| `submitted` | TA-07 | `application` | Application submitted | §5.5 |
| `assistance` | TA-07 | `application` | Help requested | §2.9 |

No receipt shows an accepted time (WP-01 STOP-01, P-02). The receipt is checked against `core.operation` (WP-01 A-04):
a resource kind other than the column's reads as "The receipt cannot be checked now."

### 2.15 Stale revision (CMP-14) per form

| Form | `_rev` | Rows (your unsent value / current value) |
|---|---|---|
| TA-13b travel dates | `group` | Travel start date, Travel return date |
| TA-09c create | `group` | Travel dates, Group state (the form holds no group values, so it shows the current ones and "Your applicant details are kept below.") |
| TA-09d details | `application` | Each field the TA changed: typed value / current snapshot value |
| TA-09i identity | `application` | Each identity field the TA changed |
| TA-07h help | `application` | Stage, Editing, Help request (current facts only; the note is kept in the field) |
| TA-08 submit | `application` | Price, Estimated window, each statement version (§5.4) |
| DOC resolve, classify | `version` | Details read, What it is |

"Who changed it and when" rows are absent (no read model carries them), never "unknown".

## 3. TA-07 states in WP-03 and the panels of later packages

### 3.1 States that WP-03 builds (UI-PLAN §3.2 TA-07 "Specific")

The facts come from `core.ta_application` (`src/contracts/core.ts:222-280`). "Shown when" names Core facts only.

| State | Shown when (Core facts) | Status facts that differ | Action panel | Copy (draft, CR-09) |
|---|---|---|---|---|
| Draft, can be submitted | `lifecycle = draft`, `submit.allowed = true` | Progress Draft; Editing "You can change it" | Owner You; "Check the answers and submit this application."; action "Check and submit" → TA-08 | "This application is a draft. Nothing is sent to TravelMudra until you submit it." |
| Draft, not yet submittable | `lifecycle = draft`, `submit.allowed = false`, every blocker is of a TA-09 section (§4.2 map) | as above | Owner You; step = first blocker sentence; blocker type "Evidence or details can fix it"; action "Continue the application" → TA-09t; "Also needed" lists the other blockers | "Before you can submit: [sentences]." |
| Draft, blocked by the offering | a blocker of `offering_*`, `existing_work_*`, `catalogue_*`, `declaration_*`, `binding_*` | as above | Owner TravelMudra; blocker type "Policy unavailable"; no action; secondary "Continue the application" only when `correct.allowed` | CMP-10, e.g. "Submitting is unavailable while TravelMudra has paused new applications for this service. Owner: TravelMudra. Your draft is kept." (`offering_suspended`); withdrawn: "… because TravelMudra withdrew this service. Your draft is kept; it cannot be submitted." |
| Draft waiting for a travel-date recheck | `pending.reasonCode = travel_date_recheck_pending` | — | Owner TravelMudra; current DRAFT_RECHECK text (`ta.ts:139-142`); action "Change the travel dates" → TA-13b | Current text |
| Draft with approved help in progress | `editor_state = assistance_in_progress` | Editing "An operator is entering information with your approval" | Owner your operator; blocker type "Another person owns this step"; no action | "An operator is entering information with your approval. You can change the application again when they return it to you." |
| Submitted, payment not recorded | `lifecycle = submitted`, `pending.reasonCode = gate1_payment_not_received` | Service payment "Not recorded" | Owner You; "Pay TravelMudra [₹] and quote the application reference."; action "How to pay" (carried Payment section) | Current text (`ta.ts:178-180`) |
| Submitted unassigned, payment recorded | `editor_state = unassigned`, `pending.reasonCode = awaiting_assignment` | Editing "You can change it" | Owner TravelMudra; "TravelMudra assigns an operator."; no action; secondary "Change the application" (when `correct.allowed`) | "Application submitted. Operator assignment is pending." (UX §8.2) and "A change now makes the readiness checks run again." (B19) |
| Assigned, not formally returned | `editor_state = assigned`, no return hold | Editing "With your operator" | Owner your assigned operator; blocker type "Another person owns this step"; action "Report a problem" (carried WP-09 form, opened in place) | UX §4.4: "This application is with your operator. Report the problem so it can be returned for correction." The page MUST NOT offer an edit link, TA-08 or TA-07h's form here (Core blocks them: `awaiting_formal_return`, `controls.ts:492-496`) |
| Problem reported, still assigned | open hold `problem_reported` | Problem report "Open" | Owner your operator; "Your operator deals with your report and may return the application to you."; no action | Current text (`ta.ts:557`) |
| Formally returned (submitted) | open hold `returned_to_ta`, `lifecycle = submitted` | Editing "Returned to you for correction" | Owner You; step "Correct what your operator asks, then hand the application back."; action "Correct the application" → TA-09t; then TA-08 returned mode (Q-W03-06) or the carried hand-back form | The operator's note first (carried section); "The same operator continues and checks the application again." |
| Returned after approved help (draft) | `lifecycle = draft`, `editor_state = returned_to_ta` | Editing "Returned to you for review" | Owner You; "Review what the operator entered, then submit."; action "Check and submit" → TA-08 | "An operator entered information with your approval. Check every answer before you submit." (UX §3.2 approved assistance) |
| Offering withdrawn or suspended (submitted work) | The pending reason, or a blocker of `correct` or `assistance`, is one of `existing_work_hold`, `existing_work_treatment_missing`, `withdrawal_continuation_not_permitted`, `offering_suspended`, `offering_withdrawn` (which codes Core uses as pending reasons is not verified here; the page maps any of them) | — | Owner TravelMudra; blocker type "Policy unavailable"; no action | CMP-10 from the code sentence, e.g. "Work on this application is held until TravelMudra records how existing work of this service continues. Owner: TravelMudra." Per-action treatments are WP-13 (§3.4) |
| Notice to acknowledge, result to download, price decision | as today (`taPendingOf`) | Delivery row | Carried WP-08/WP-17 steps | Current texts |

The action panel's step for every case state comes from this closed table. A pending answer that no row names
shows Core's sentence (`sentence(reasonCode, 'ta')`) with owner from `pending.ownerKind` and no action.

### 3.2 Action panel mapping (CMP-01), in priority order

1. A notice that needs acknowledgement (carried WP-08/WP-17): "Open the notice".
2. A payment that blocks assignment: "How to pay".
3. A download (carried WP-08): "Download your result" / "Download your packet".
4. Formally returned: "Correct the application".
5. Draft, `submit.allowed`: "Check and submit".
6. A TA step of the pending answer (`decide_price_increase`, `decide_transition`, `reapply_correction`; carried):
   the current link labels (`ta.ts:71-75`).
7. Draft waiting for a travel-date recheck: "Change the travel dates".
8. Draft not yet submittable: "Continue the application".
9. Assigned, not returned, no open problem report: "Report a problem".
10. Otherwise: no action; the owner and the reason only.

The order is today's docket order (`ta.ts:691-701`) with items 4, 5, 8 and 9 renamed to their WP-03 targets. The
mapping reads Core's evaluations and pending answer; it decides no permission (a step the TA cannot take is not
offered because Core reports it blocked, not because the page judged it).

### 3.3 "Ask TravelMudra for help" on TA-07

Shown in the aside when `assistance` is not null (Core evaluates it for open applications with no outcome). When
`assistance.allowed` is false, the link stays (SH-R08: the TA expects it here) and TA-07h shows why (§2.9). When a
request is open (`assist.state` requested or approved), the aside shows "Help requested: TravelMudra decides"
instead of the link.

### 3.4 Panels that later packages add or rebuild

| Panel or form on TA-07 | Package | WP-03 treatment |
|---|---|---|
| Report a problem form; hand back; problem-report state | WP-09 | Carried (`ta.ts:434-441`, `:551-557`); WP-03 places the report form in the action panel of the assigned state. Hand back: Q-W03-06 |
| Result, delivery rows, downloads, completion, notices list for this application | WP-08 | Carried section "Result and delivery" |
| Related applications (link, unlink) | WP-10 | Carried |
| Originals | WP-12 | Carried |
| Offering change: per-action treatment of a suspended or withdrawn service; changed-terms decision | WP-13 | WP-03 shows Core's blockers and pending sentence as CMP-10 (§3.1); the transition form is carried |
| Payment facts panel (CMP-16), payment history link | WP-16 | Carried "Payment" section |
| Price increase decision, withdrawal request, timing notice acknowledgement, held correction | WP-17 | Carried |
| Delivery uncertainty | WP-19 | Not present in the TA case read model today |
| Scoped history (CMP-09) | Not assigned in UI-PLAN §12 | Link to the old history page (LD-02); Q-W03-15 |

## 4. TA-09 Individual intake against `intake.start_individual` and `core.edit_draft`

### 4.1 Two modes, one command each

| Mode | Page | Command | Why this shape |
|---|---|---|---|
| Create | TA-09c (one form page) | `intake.start_individual {groupId, applicant, offeringIds, files}` | The command creates every draft (one per chosen service) from one multipart body; the files are staged from the same request (`src/apps/edge/intake/routes.ts:80-101`, `stageFormFiles`). A step-by-step form would have to keep files or staged blob ids between requests: the first breaks SH-R12 (identity documents in browser storage), the second changes the command shape (bulk lane). So the create mode is one form (D-W03-01). |
| Continue | TA-09t task list and section pages TA-09i, TA-09d, TA-09f, TA-09u | `core.correct_identity`, `core.edit_draft`, `doc.upload_for_application`, `doc.replace_version`, `doc.associate` | Each section is a subset of the application's facts with its own command (inventory CMD-9: "a section is a subset of `fields`"; `core.edit_draft` merges the fields it is given, `src/modules/core/commands/drafts.ts:70-77`). |

The continue mode serves a draft, a submitted unassigned case and a formally returned case: Core allows
`correct_application` for all three and blocks it while assigned or in assistance (`controls.ts:492-496`). The
page offers each section's form only when `correct.allowed` is true; otherwise the section page shows the blockers
as CMP-10 and no form.

### 4.2 Sections of the task list (TA-09t)

| # | Section | Page | Content | State (CMP-04) from Core facts |
|---|---|---|---|---|
| 1 | Group and service | TA-09t (no page) | Group, country, travel dates, service; "Another service needs its own application. Another country needs another group." (B03) | "Cannot change" always; when a travel-rule blocker is present (`travel_rule_*`, `travel_date_recheck_pending`): "Needs your input" with the sentence and the link "Change the travel dates" (TA-13b) |
| 2 | Identity details | TA-09i | Surname, given names, date of birth, passport number, issuing country, nationality | "Needs evidence" when a submit blocker is `identity_conflict_unresolved` or a requirement of the identity role has status `conflict`; otherwise "No open item" |
| 3 | Application details | TA-09d | Passport type, country of residence, nationality (only while none is recorded), the declared form fields | "Needs your input" when a submit blocker is `draft_incomplete` or `population_declaration_missing`; "Cannot continue" with CMP-10 for `population_out_of_scope`; otherwise "No open item" |
| 4 | Documents | TA-09f | One row per declared requirement (CMP-02) | "Needs evidence" when a mandatory requirement is `missing` or `unassociated`, or a submit blocker is `mandatory_document_missing`, `document_unassociated`, `format_not_accepted_by_offering`, `size_not_accepted_by_offering`, `document_validity_failed`; "Being checked" when a requirement is `safety_pending` or `unclassified` and nothing needs the TA; otherwise "No open item" |
| 5 | Document checks | TA-09f anchor `#checks` | The rows whose status needs a review on DOC: `unreadable` (review the details), `unclassified` with a TA step (confirm the type), `conflict` | "Needs your review" (counted rows, unit "documents") / "Being checked" / "No open item" |
| 6 | Check and submit | TA-08 | — | "Cannot start yet: [n] items above stop submission" when `submit.allowed` is false; "Not started" when true. Never "Ready" |

Rules:

- The section states come from one closed table of blocker codes → section (above). A blocker code not in the table
  goes to "Other items that stop submission" on TA-09t and on TA-08, with Core's sentence. Offering-level codes show
  as CMP-10 above the task list. The page never computes completeness from field values (UX §7.4: "completeness
  comes from actual task facts").
- `submit` is evaluated only for a draft (`src/core-api/bindings/core.ts:198`). For a submitted unassigned or
  returned case the states read "Not checked here" and TA-09t shows, for a returned case, the operator's note first:
  "What your operator asks: [note]".
- Inside TA-09d, a declared field with `required = true` shows "(required)" in its label; a required field with no
  value shows no error before a submission is tried. Core names the missing field only as a code without the field
  (`zWireEvaluation` blockers carry `code` only); the page does not guess which one.

### 4.3 The passport two-page rule (TA-09-R1, UAT-14)

Facts. Today the individual form takes one file per document type (`src/contracts/intake.ts:51` "One file per
declared document type"; a repeated field is refused `input_invalid`, `start-individual.ts:96`), and an upload takes
one `file`. The bulk lane designs passport parts (bulk DESIGN §2.5 DR-11 and DOC-15: "the individual form takes the
passport field once or twice with `part`"; new requirement statuses `incomplete` and `over_supplied`). That work is
not integrated (SEAM-CONTRACT §2: the UI lane builds against the latest integrated version only).

Design.

1. Beside every passport input (TA-09c Documents, TA-09f passport row, DOC replacement) the form states the rule as a
   fixed sentence: "A passport has two pages to send: the front page (with the photo and the two machine-readable
   lines) and the back page."
2. **Until the seam version serves parts (DEP-2):** one file input, labelled "Passport: one file with both pages",
   with the hint "Send one PDF that holds the front page and the back page." The page MUST NOT offer a second
   passport input and MUST NOT state the two-file shape, because Core would refuse it. TA-09-R1 is partly met
   (the rule is stated; one of the two accepted shapes is offered).
3. **When the seam version serves parts:** a `fieldset` "Passport" with two file inputs, "Front page, or one file with
   both pages" and "Back page (only if the front page file does not hold it)", and the hint "Send one file with both
   pages, or two files, one for each page." The field names and the `part` values are the bulk lane's (the command
   shape); the UI renders what the read model declares (P-W03-02 asks for a per-requirement `parts` fact on
   `intake.start_page` and `doc.application_evidence`).
4. Statuses `incomplete` ("Back page missing: send the back page, or one file with both pages") and `over_supplied`
   ("More pages than a passport has: send one file with both pages, or the two pages as two files") get their texts
   in the same integration window (PLAN §8 S-01). Until then an unknown status renders "Unrecognised state" with the
   code (UAT-13 rule), never "Accepted".
5. Completeness checks of the two pages are Core's (bulk lane document policy). The page shows what the read model
   reports.

### 4.4 Passport number format message (TA-09-R2, UAT-09)

Facts. Core's rule today is `passportNumber()` in `src/modules/intake/domain/fields.ts:84-89` (Indian passports: one
letter and seven digits only). Max confirmed on 12 October 2026 that two letters and six digits is also valid
(triage Q-7). The bulk lane's commit 4496ee9 (lane branch, not on main) makes `src/workers/passport-number.ts` the
single source: `INDIAN_PASSPORT_NUMBER_SHAPES` with `label` and synthetic `example`, and
`indianPassportNumberShapesText()`; the file has no imports "so the sandboxed workers, the modules and the pages
can all load it". A refusal carries only `{field: 'applicant.passportNumber', code: 'passport_number_invalid'}`
(`start-individual.ts:50-52, 80`); a field error has no parameters (`src/kernel/errors.ts:21`).

Design (no Core change; the page imports the shared definition read only, it changes no file of the bulk lane):

1. Hint of the passport number field (TA-09c, TA-09i): "For an Indian passport: [indianPassportNumberShapesText()]."
   → "For an Indian passport: one letter and seven digits (A1234567) or two letters and six digits (AB123456)."
   "Spaces and hyphens are ignored."
2. Refusal message for `passport_number_invalid` (field error at the field and in the summary): "Check the passport
   number. For an Indian passport it is [shapes text]." The text comes from the shared function at run time; the page
   holds no format of its own. The message lives in the code catalogue (`CODE_TEXT` in
   `src/apps/shared/pages/intake.ts:71`, shared-owned): proposal P-W03-01 item (d) asks the orchestrator to apply it
   in WP-03's integration window (S-01 allows it with WP-04 only).
3. Passport issued by another state: the general rule (5 to 20 letters and digits) lives only in module code. The
   page states no format for it: "Check the passport number. Enter it as printed on the passport." P-W03-02 asks the
   bulk lane to add the general shape (label, example) to the same shared file; then the message names it too (P2).
4. A unit test imports the shared shapes and asserts that every example in the message passes the rule and that the
   rendered message contains every shape label (a drift guard; tests may import modules).
5. **Until 4496ee9 is on main (DEP-1):** no hint, and the refusal shows the catalogue's current text "The passport
   number has the wrong format." TA-09-R2 is then partly met, and a valid two-letter Indian number is still refused
   by Core (UAT-09, P0 in the bulk lane, not a WP-03 defect).

### 4.5 Same-person evidence for identity changes (B19)

- TA-09i lists the application's own identity documents (`case.identityEvidence`: version id and requirement type)
  as a `fieldset` "Evidence for the change" of checkboxes `evidence.<dov id>`, none prechecked (F-W03-10 removes the
  current precheck from the passport reading, `ta.ts:494`). The read model gives only the version id and the
  requirement type, so the label is "[Requirement type] of this application" with a "View the document" link to DOC
  that names the version.
- When a passport of the application does not match (requirement status `conflict`), TA-09i shows the comparison
  "Passport reads / Application says" (current `identityLine`, read by `doc.version_page` for the owning TA only) and
  pre-fills the fields with what the passport reads (current behaviour; the TA still chooses the evidence).
- When `identityEvidence` is empty: no form; "Identity details change only with this application's passport
  showing the new details. Upload the passport first." with "Go to Documents" (TA-09f).
- The handler keeps sending only the fields that differ (`src/apps/edge/core/routes.ts:97-104`).
- Copy: lead "Change only what is wrong. The passport you choose must show the new details and the details that
  stay." Field `explanation` "What was wrong" (required by the command, maxlength 1000).
- Refusals: `identity_same_person_evidence_insufficient` "The documents you chose do not show that this is the same
  person. Choose the passport that shows the new details, or upload it first." `correction_no_change` "Nothing
  changed. The saved details are shown." (category info, not an error tone). `identity_field_requires_correction`
  (from TA-09d when a recorded nationality is typed differently) "A recorded nationality changes only here, with
  evidence." with a link to TA-09i.
- Create mode (TA-09c) has no evidence step: the identity comes from the form and is checked against the passport
  by Core's processing; a mismatch later shows as `conflict` on TA-09t section 2.

### 4.6 Upload states (CMP-28) on TA-09c and TA-09f

| State | Where | Text |
|---|---|---|
| Empty | the input | Label; hint "[formats], up to [size]" from the requirement (`requirementRule`); "No file chosen" (browser) |
| Transferring | the input (script, `enhance.js` upload progress) | "Sending [file name]: [n]%" in the polite region; the button reads "Sending…" and is disabled while the request runs (one request per form) |
| Accepted | after the 303 | Receipt `document` (§2.14); the row status "Being checked for safety" |
| Not accepted at edge or staging | re-rendered page | Field error: `document_format_unsupported` "The file is not a PDF, JPEG or PNG."; `document_too_large` "The file is larger than [requirement's size] for this document." (F-W03-12: no fixed "5 MB" text); `capacity_storage`, `rate_limited`: the current texts (form-level) |
| Not accepted by the requirement | re-rendered page | `format_not_accepted_by_offering`, `size_not_accepted_by_offering`: "The file was not uploaded: [requirementRule]." (current, `core/documents.ts:124-127`) |
| Replaced | TA-09f row, DOC | Row: the new file's status; DOC of the old version: "Version: Replaced by a newer file" |

Files are never kept after a refusal: the re-rendered form says "Choose the files again." (§2.10 item 3). Staged
blobs of a refused form expire by their lease at Core (`src/apps/shared/uploads.ts:1-9`); they grant nothing.

### 4.7 Document processing states on TA-09f rows (CMP-02)

| Requirement status (`doc.application_evidence`) | Row text | Whose step | Row action |
|---|---|---|---|
| `missing` | Missing | You | "Upload a file"; "Use a file already in this group" (TA-09u) |
| `safety_pending` | Being checked for safety | TravelMudra | none ("You do not need to do anything.") |
| `unclassified` | Being checked: what it is is not confirmed yet | You when DOC offers the classification form, else TravelMudra | "Confirm what this document is" (DOC) |
| `unreadable` | The details could not be read with confidence | You | "Check the details" (DOC) |
| `conflict` | Does not match the applicant | You | "Compare and correct" (TA-09i); "Replace this file" |
| `validity_failed` | Not valid for this application: [requirementRule or the code sentence] | You | "Replace this file" |
| `validity_unknown` | Validity could not be checked | TravelMudra | none |
| `blocked` | Blocked by TravelMudra | TravelMudra | none |
| `unassociated` | Received, not yet linked to this application | TravelMudra (association runs) | none |
| `satisfied` | Accepted | — | "Replace this file" (secondary) |
| `incomplete`, `over_supplied` (seam, §4.3) | texts of §4.3 item 4 | You | "Upload the back page" / "Replace this file" |
| any other | Unrecognised state ([code]) | — | none (S4) |

No row reads "Accepted" unless Core reports `satisfied`. A document check that is still running is not polled in
WP-03: the row says "Being checked" and the page offers "Check again" (a GET of the same address) (D-W03-13).

### 4.8 TA-09u Use a file already in this group

- Lists `doc.group_versions` rows of the application's group that are evidence (`purpose = evidence`), current
  (`currency = current`), and neither refused nor excluded, newest first, 25 per page (`?page=n`, numeric; SH-R06).
  This narrows the list by Core facts; Core decides the association (`doc.associate` refuses a version of another
  group or of another applicant's identity).
- Each row: document name (`documentTitle`), state, classified type, received (IST), and a form "Use for [requirement]"
  (POST `…/documents/:versionId/associate`, hidden `requirementType`).
- Copy: lead "Files of this group only. A file of another group cannot be used here (B03)."; empty: "No file of this
  group can be used for [requirement]. Upload a file instead."
- The list is in a labelled region (`role="region"`, `aria-label="Files of this group"`) with the paging links after
  it.

### 4.9 TA-09c refusal texts

Field errors come from `fieldErrors` (`start-individual.ts:50-87`); the field ids follow the current map
(`src/apps/shared/pages/intake.ts:313-316`). Every message names the field and what to do (CR-01).

| Field (wire) | Code | Text at the field and in the summary |
|---|---|---|
| `offeringIds` | `too_small` (none chosen) | "Choose at least one service for this applicant." |
| `offeringIds` | `offering_not_in_country` | "A chosen service is not a service of [country]. Choose services of this group's country." |
| `applicant.passportNumber` | `applicant_key_missing` | "Enter the passport number." |
| `applicant.issuingCountry` | `applicant_key_missing` / `country_code_invalid` | "Enter the issuing country as its three-letter code on the passport, for example IND." |
| `applicant.passportNumber` | `passport_number_invalid` | §4.4 item 2 |
| `applicant.nationality` | `country_code_invalid` | "Enter the nationality as a three-letter code, for example IND." |
| `applicant.surname`, `applicant.givenNames` | `name_invalid` | "Use letters, spaces, apostrophes and hyphens only. Enter at least a surname or given names." |
| `applicant.dateOfBirth` | `date_invalid` | "Enter a real date of birth." |
| `files.<type>` | `requirement_not_declared` | "None of the chosen services asks for [document]. Remove the file or choose a service that asks for it." |
| `doc.<type>` (edge) | `document_format_unsupported`, `document_too_large` | §4.6 |
| form | `input_invalid` (repeated file field, more than 8 services) | "Check the form: send one file per document and choose at most 8 services." |
| form | `catalogue_not_published`, a control code | §2.10 "C2 control refusal" row |
| form | `conflict_operation_key` | §7.1 |

## 5. TA-08 Check and submit

### 5.1 What Core checks (facts, `src/modules/core/commands/submission.ts:110-175`)

`core.submit {applicationId, confirmations: [{code, textVersion}], quotedPricePaise, estimateStart, estimateEnd}`
with `expectedRevisions.application`. Core refuses: a revision that changed (`stale_revision`); any control blocker
(`requireControls`, action `submit`); a declared statement whose version differs from the one sent
(`stale_revision`); a required statement not sent (`validation_failed ta_confirmation_absent`, field
`confirm.<code>`); a statement code the declaration does not hold (`input_invalid`); a price other than today's
business-values price (`stale_revision price_changed`); an estimated window other than the one that starts today in
India time (`stale_revision`); an application that is no longer a draft (the guarded update). It records the
confirmation `code:textVersion` list, the quote, the window and the governing identities in one commit (B17, B35).

### 5.2 Anatomy (reading order)

1. Header: breadcrumb by origin › "[applicant]"; `h1` "Check and submit: [SURNAME, Given names]"; freshness.
2. Error summary (C1/C2) or CMP-14 (C5), first in `main` after a refusal.
3. Section "Applicant and service" (CMP-05 rows; "Change identity details" → TA-09i, "Change application details" →
   TA-09d): name, date of birth, passport number (mono), issuing country, nationality, passport type, country of
   residence, the declared fields (labels from `humanize(key)`, "Not given" when absent); service (offering title);
   group (label, travel dates from the optional `core.ta_group` read, "Unavailable" when it failed).
4. Section "Documents" ("Change documents" → TA-09f): CMP-02 rows read only; then "What stops submission" when
   `submit.allowed` is false: each blocker sentence, each with the link to its section (§4.2 map).
5. Section "Price and estimate": "Price: [₹ pricePaise]. It is fixed for this application when you submit."; "Original
   estimated window: [window.start] to [window.end], if you submit today. It is an estimate, not a guarantee. It
   starts when you submit, whether or not you have paid."; "Filed with: [authority.label]".
6. Section "Payment": "Payment is due after you submit. TravelMudra records your payment by hand; work on the
   application starts once it is recorded. Paying online is not available."
7. Section "Your confirmation" (`fieldset`, legend "Confirm before you submit"): one checkbox per
   `authority.confirmationItems` entry, `confirm.<code>` = `yes`, never prechecked, label = the statement text of
   `code@textVersion` (§5.4), hint "Statement version [textVersion]" and "(required)" or "(optional)"; hidden
   `version.<code>`.
8. Consequence text, visible before the button: "Submitting is your instruction to TravelMudra to work on this one
   application at the price above. Help, imports and payments never submit an application for you."
9. Hidden `quotedPricePaise` = `case.pricePaise`, `estimateStart` = `case.window.start`, `estimateEnd` =
   `case.window.end`, `_rev.application` = `app.revision`. The values shown in items 5 and the hidden values come from
   the same variables; a test asserts that they are equal in the rendered page.
10. Primary "Submit this application". Secondary: "Ask TravelMudra for help instead" (TA-07h; "Help is not a
    submission."), "Back to the application".

When `submit.allowed` is false: items 7 to 10 are replaced by CMP-10 "Submitting this application is unavailable
until the items above are resolved." and a visible disabled button with `aria-describedby` to that notice (AC-13,
D5: explanatory only; Core decides a hand-made POST). No universal "all documents complete" gate exists beyond
Core's blockers (UX §4.3, UI-PLAN TA-08).

### 5.3 States

| State | Shown when | Copy and behaviour |
|---|---|---|
| Draft review | `lifecycle = draft`, `submit.allowed` | §5.2 |
| Blocked | `submit.allowed = false` | §5.2 last paragraph; offering-level codes as CMP-10 with owner TravelMudra ("Your draft is kept.") |
| Statement text missing | a confirmation item whose `code@textVersion` has no approved text | No form; CMP-10 "Submitting is unavailable until the wording of the statement '[code]', version [v], is approved. Owner: product owner." (D-W03-10, STOP-W03-06) |
| Already submitted | `lifecycle ≠ draft` and no return hold | No form. "This application was submitted. [Open the application]" (also the Nth visit after a browser Back) |
| Assigned, not returned | `editor_state = assigned` | No form; the TA-07 notice (§3.1) |
| Returned (submitted case) | open return hold, `lifecycle = submitted` | §5.6 |
| S4 evidence unreadable | `doc.application_evidence` failed | Section 4 "Documents are unavailable now. Core still checks them when you submit." Submission stays offered (Core decides) |
| Support view | staff | Read only: no form; statement texts shown; the button absent |
| C1 | `ta_confirmation_absent` | Summary item "Confirm the statement '[short text]' to submit." linked to the checkbox; field error at the checkbox; nothing submitted |
| C2 | control blockers | Summary lists each blocker sentence with the link to its section |
| C5 | `stale_revision`, `price_changed` | CMP-14 (§5.4); "Review current information" is the re-rendered page itself with current values; every statement checkbox unchecked |
| C4 | lost answer | WP-01 operation page, heading "Checking the original result", "Check status"; no submit control there |
| C3 | accepted | 303 `receiptLocation('/ta/applications/<id>', 'submitted', key)`; receipt §5.5 |

### 5.4 Confirmations, quoted price and the stale comparison

- **Statement wording (C05).** The read model carries each statement's `code` and `textVersion`, not its wording
  (`src/contracts/core.ts:235-238`; the declaration holds only code and version, `src/kernel/vocabulary/decl.ts:120`).
  Today the label is `humanize(code)` ("Ta confirms details", `ta.ts:415`), so Core records that the TA confirmed
  version "syn-1" of a text the TA never read (F-W03-02, P1). WP-03 adds a UI catalogue
  `src/apps/shared/pages/authority-text.ts`: `Record<'<code>@<textVersion>', {text, status: 'draft' | 'approved'}>`.
  Synthetic entries carry draft wording marked "Draft wording for test installations" (CR-08, CR-09); for example
  `ta_confirms_details@syn-1`: "I confirm that the applicant's details and documents in this application are
  correct, and that the applicant authorised me to submit this application to TravelMudra." A unit test enumerates
  every confirmation item of `catalogue/synthetic/catalogue.json` and asserts an entry exists. Real statements need
  approved text from the product owner per version (content input C05; STOP-W03-06). A version with no entry → the
  "Statement text missing" state (no submission).
- **Quoted price and window.** The page sends exactly what it shows (§5.2 item 9). It never formats a price into the
  hidden value: the hidden value is `String(case.pricePaise)`.
- **Stale comparison (CMP-14).** After a `stale_revision` or `price_changed` refusal the page reads the case again
  and shows only the rows that differ between the posted values and the new read: Price (posted `quotedPricePaise` /
  current `pricePaise`); Estimated window (posted start–end / current; typical cause: the India date changed between
  page load and submit); Statement version (posted `version.<code>` / current `textVersion`). When no posted value
  differs (another change of the application): "This application changed since you opened this page. Check the
  answers below again." The current refusal sentence "Someone changed this application since you opened the page"
  (`shared.ts:133`) is not used here, because a date change is no person's change (F-W03-08).
- **Checkbox after a refusal.** After C5 every statement is unchecked (the facts the TA confirmed changed). After
  C1 or C2 each checkbox keeps the TA's own choice (AC-08: entered values remain).

### 5.5 Receipt (on TA-07, code `submitted`)

| Row | Value | Source |
|---|---|---|
| Title | "Application submitted" (UX §8.2 "Application submitted. Operator assignment is pending." when the pending reason is `awaiting_assignment`) | done code; pending |
| Request reference | `[key]`, link to `/ta/operations/[key]`, copy button | CMP-08 |
| Recorded | "Once. Sending the same form again does not repeat it." | CMP-08 |
| Application | reference (copy) | `app.application_id` |
| Quoted price | "[₹ submission.quoted_price_paise], fixed for this application" | `case.submission` |
| Original estimated window | "[timing.estimate.start] to [end], an estimate, not a guarantee" | `case.timing.estimate` |
| Next | "[owner] — [step]" from Core's pending answer as the TA reads it (for example "You — Pay TravelMudra ₹3,500 and quote the application reference. TravelMudra then assigns an operator.") | `taPendingOf` |
| Submitted at | Not shown until STOP-W03-01 or P-02 is served; the receipt says "The time is in the application's History." with the link | — |

The receipt states no payment success and no assignment. Later forecasts show in "Price and timing" as their own row,
never in the receipt (B17).

### 5.6 Returned cases

| Case | Core facts | TA-08 behaviour | Command |
|---|---|---|---|
| Draft returned after approved help | `lifecycle = draft`, `editor_state = returned_to_ta` | Normal TA-08 with the line "An operator entered information with your approval. Check every answer." The receipt's Next names "your assigned operator" (Core sets `editor_state = assigned` on submit, `submission.ts:166-170`) | `core.submit` (WP-03) |
| Submitted case formally returned | `lifecycle = submitted`, open `returned_to_ta` hold | Core refuses `core.submit` for a non-draft. Recommended (Q-W03-06): TA-08 "returned mode" — same check-answers sections, "What your operator asked: [note]" first, Price and estimate as "Quoted at submission: [₹] (unchanged)" and "Original estimated window: [dates] (unchanged)", no statement checkboxes (Core records none for this step), primary "Hand the application back" = the carried WP-09 hand-back form moved here unchanged (action `/ta/applications/:id/hand-back`, `_rev.application`), its refusal re-rendering TA-08. Receipt on TA-07 `handed_back`: "Handed back to your operator" — quote unchanged, original estimate unchanged, Next: "Your operator checks the application again." | `core.hand_back` (register: WP-09) |

UI-PLAN §4.2 R3 (RF-04) says "Submit application confirms the correction" and that the receipt "adds the
confirmation time". Core confirms a returned submitted case with `core.hand_back`, which takes no confirmation and
fixes no price; the original quote and estimate stay (B17). The time is the operation's accepted time (P-02).
Recorded deviation D-W03-11.

## 6. TA-06 search and filters: resolving SH-R06

### 6.1 The problem

SH-R06: "The address MUST hold only opaque identifiers and enumerated filter values. It MUST NOT hold search text or
personal data." Today `/ta/search` is a GET form whose text travels as `?q=` (`src/apps/shared/views/ta.ts:66,
113-124`): the applicant's name or passport number lands in browser history, bookmarks, the Referer of the next
request and any proxy log (F-W03-03, P1). WP-01 Q-05 gave the resolution to WP-03.

### 6.2 What the route model allows (RM §1)

| Option | Possible without a Core change? | Notes |
|---|---|---|
| GET with the text in the address | Yes | Forbidden by SH-R06 |
| POST that runs a search command | No | No search command exists; a new command for this is a Kind 2 change justified only by "the UI is easier", the rejection reason of DECISIONS §3.2 |
| POST route with no command | No, in the current shell | `defineRoute` refuses a POST without a command (`post_route_without_command`, `src/web/routes.ts:296`); the inventory pins a command per POST. The shell is UI-lane code (`src/web/`), so the rule can change without Core, with the architect's decision |
| Text in a cookie or browser storage | — | A script cannot set an HttpOnly cookie; browser storage of a name or passport number breaks SH-R12 |
| Filter in the page only (script, in memory) | Yes | The text never leaves the browser; only the rows already on the page (≤ 200, `core.ta_applications`) and only the facts in them (name, reference, group, service; no passport number) |
| Enumerated filters in the address | Yes | `views.ta_applications` takes `groupId` and `progress`; `core.ta_applications` rows carry `group_id`, `progress` |

### 6.3 Recommended design (D-W03-05): a sealed search token

1. **Route kind "seal" in the web shell.** A POST route with `seal: {target: 'ta.search', field: 'q', maxChars: 200,
   ttlMs: 1_800_000}` and no `command`. The shell supplies the handler; page code cannot give one (`defineRoute`
   refuses a seal route with a `handler`, a `command` or another field). The handler: verify `_csrf` (bound to the
   session and the route id, as every POST); read `q`, trim, NFC, at most 200 characters; empty → 303 `/ta/search`;
   otherwise seal and 303 `/ta/search?r=<token>`. It calls no Core query or command, writes nothing, and answers
   only 303 (a POST never answers 200, RM §5 item 9). No `_op` (no operation exists).
2. **Token.** Version byte, random 96-bit IV, AES-256-GCM ciphertext of `{q, exp}` with associated data = session id
   and the target route id; key derived from the CSRF key with the label `tm-search-v1` (the WP-01 A-05 envelope with
   another label); base64url. The GET refuses a token with a bad tag, another session, a wrong version, a size over
   the bound, or past `exp`; it then renders the search form empty with "This search has expired. Search again." (no
   error status: an expired search is not a fault).
3. **GET `/ta/search?r=<token>[&after=<cursor>]`.** Reads `views.search {q, after}`. The text appears only in the
   page body (the input's value and "Results for your search"), never in the address. Paging links carry `r` and
   `after` (both opaque). Opening a result carries `from=search&r=<token>` so TA-07's breadcrumb returns to the
   results while the token lives (SH-R07).
4. **Route inventory.** New entry `ta.search.seal` (POST `/ta/search`, surface `ta`, action `search.private`,
   `command: null`, `seal: true`). The inventory test gains the rule "every POST names a command, or is a seal route
   whose target is a registered GET route of the same surface". Edge only: a support view cannot POST (server rule,
   RM §1 item 4), so staff does not register it.
5. **Freshness.** `views.search` is a projection: the lag form of LD-08, and the current "may be out of date" notice
   when `asOf.healthy` is false (`asOfNotice`).
6. **Search form placement.** On TA-06 (top) and on TA-06s. The top-bar link "Search your applications" stays a link
   (WP-01 R5) to TA-06s with the input focused (`autofocus` on that page only).

Risks of the recommendation (for the independent review): it adds a second POST kind to an invariant the system
tests and the audit reading rely on ("every POST is one Core command"); the seal key and the token add a secret-use
path. Mitigations: the shell owns the handler; the kind is closed to one field and one target; tests below. Rank of
the decision: P1 (Q-W03-01).

### 6.4 Fallback without any shell change (if the architect rejects 6.3)

- TA-06 keeps the enumerated filters of §2.6 and adds an in-page "Filter this list" input (script only; no `name`
  attribute, so it is never sent): it hides rows whose applicant, reference, group or service does not contain the
  text, announces "[n] applications shown" in the polite region, and is absent without JavaScript.
- `/ta/search` keeps only enumerated listing (`progress`, `after`) and drops `q`; the top-bar link goes to TA-06.
- Loss: search by passport number and search beyond the 200 rows of `core.ta_applications` are gone. P1 loss against
  UX §4.2 ("cross-group searchable list"); not a STOP (no Core change would fix it better than 6.3).

### 6.5 TA-06s page (with 6.3)

1. Header: `h1` "Search your applications"; lead "Search your own applications by the applicant's name, passport
   number or application reference. The words you search for are not kept in the page address."; freshness (lag form).
2. Form (POST `/ta/search`, `_csrf`): "Name, passport number or application reference" (`q`, type search, maxlength
   200, `spellcheck=false`, `autocomplete=off`); "Search".
3. Results (`projectedTable`, current columns: applicant link, progress and outcome, waiting on, service payment);
   "Show older changes" paging.

| State | Copy |
|---|---|
| No search yet | The form only |
| S3 | "No application matches. Check the spelling, or search by passport number or the application reference." |
| S5 | `asOfNotice` and the lag line |
| Expired token | "This search has expired. Search again." |
| Support view | The form is absent: "Search is not available in a support view. Use the lists and filters." (the POST is refused there, Q-W03-12) |

### 6.6 Tests for the search

Unit: the route model refuses a POST with neither command nor seal, and a seal route with a handler; seal and open
round trip; tamper, other session, expiry, oversize, wrong version. BFF (scripted Core): POST answers 303 to
`/ta/search?r=…` and the `Location` contains no byte of the text; GET with the token calls `views.search` with the
text. Browser: after a search, `page.url()` contains neither the text nor `q=`; Back from an application returns to
the results; reload works while the token lives. `test/system/case-views.test.ts:60-77, 156-159` change from `?q=` GETs
to the POST (support-view cases change to the filters, §6.5).

## 7. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 102e4c9 already behaves as required. "Residue" is what a failure leaves.

### 7.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Create group (TA-13a) | Same `_op`, same content (browser resend, double click) | K-STD replay: the original group; 303 to the same receipt | None | Yes (receipt new) |
| Create group | New `_op`, same content (two tabs; form opened twice) | Core has no business duplicate key for a group (label is free text, B03 keys applications, not groups): a second group is created | A second, empty group. The TA can close it with the carried "Close the group" (Core allows an empty group to close) | Yes. Q-W03-17 (P2): accept; TA-04 shows both with dates, so the TA sees it |
| Create group | Same `_op`, changed content (Back, edit, resend) | `conflict_operation_key` → re-render TA-13a with a fresh `_op`, the form-level text "This form was already used with different content. Your values are kept: check them and create the group." | None | Partly (values kept; text differs) |
| Add one applicant (TA-09c) | Same `_op`, same fields and same file bytes (resend) | Replay: the files are staged again as new blobs, but the operation's content hash uses their SHA-256 and size, never the blob id (`stagedContent`, `src/modules/intake/commands/common.ts:89-92`), so Core answers the original result: same attempt, same applications | The resend's staged blobs, unreferenced, removed by the staging lease | Yes |
| Add one applicant | New `_op`, same applicant and service (two tabs) | `conflict_duplicate duplicate_open_scope` with `existing` → "This applicant already has an open application for [service] in this group. Nothing was created." + "Open the existing application" | Staged blobs (lease) | Partly (no link) |
| Add one applicant | Same `_op`, changed content | `conflict_operation_key` → fresh form, values kept, "Choose the files again." | Staged blobs (lease) | Partly |
| Save details (TA-09d) | Same `_op` resend | Replay; same receipt | None | Yes |
| Save details | New `_op`, no change | Core answers `correction_no_change` or accepts a no-op; the page shows "Nothing changed. The saved details are shown." as information | None | Partly |
| Correct identity (TA-09i) | Replay / new `_op` same content | Replay; a second attempt answers `correction_no_change` ("Nothing changed") | None | Yes |
| Upload (TA-09f) | Same `_op` resend | Replay (content hash) | Staged blob of the resend (lease) | Yes |
| Upload | New `_op`, same file again | Core decides (a second version or a refusal); the row shows Core's status | Possibly a second version, shown on DOC as replaced or proposed | Yes |
| Submit (TA-08) | Same `_op` resend | Replay: 303 to the same receipt, one submission | None | Yes |
| Submit | New `_op` after success (second tab, Back then submit) | Back reloads TA-08 (A-02); TA-08 reads `lifecycle = submitted` and shows "This application was submitted." without a form. A hand-made POST gets the guarded update refusal (`application_not_draft` / `stale_revision`): no second quote | None | Partly (Back shows the old form today) |
| Submit | Answer lost (UNR) | Operation page; "Check status". If the TA opens TA-08 meanwhile: draft → the form shows again with a new `_op`; a second submit is refused if the first one committed (guarded update), or becomes the only submission if it did not (B35: a new key cannot evade the duplicate check) | None | Yes (Core); copy new |
| Request help (TA-07h) | Same `_op` resend | Replay | None | Yes |
| Request help | New `_op` while one is open | `assistance_request_open` → "A help request is already open. TravelMudra decides on it." | None | Yes (copy) |
| Resolve details, confirm type (DOC) | Same `_op` resend | Replay; receipt | None | Yes (no receipt today) |
| Resolve details | Another tab resolved first | `stale_revision` (version) → CMP-14; or `extraction_already_verified` → "The details were already read and verified." | None | Partly |
| Seal search (TA-06s, §6.3) | Any repeat | Each POST makes a new token; no state anywhere | None | New |

### 7.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated on the page) |
|---|---|---|---|
| Any refused text form (C1/C2/C5) | Same page, CMP-07 focused | Every typed value | Statement checkboxes after C5 (§5.4) |
| Refused multipart form (TA-09c, TA-09f) | Same page | Typed values and service choices | Files: "Choose the files again." |
| File refused at edge (format) | Same page | As above | No later file of that form was staged (drained, `uploads.ts:94-120`) |
| Core unreachable before the command | SH-02 "Nothing was sent, so nothing changed" (503) | — | The form; the TA re-opens the page |
| Answer lost | Operation page (CMP-13) | — | The form; no new submission is offered there |
| Optional read failed | Page renders; the facts it supplies read "Unavailable" | Everything else | — |

### 7.3 Stale revision

Covered per form in §2.15. Two cases need care:

- **India date rolls over between page load and submit (TA-08).** `estimateStart` no longer matches; Core answers
  `stale_revision`. CMP-14 shows the window yours/current; the TA re-confirms. Today the text blames "someone"
  (F-W03-08).
- **Price published while TA-08 is open.** `price_changed` → CMP-14 Price; statements unchecked; the new price shows
  in item 5. A draft takes the new price; a submitted application keeps its quote (B17).

### 7.4 Access and ownership changes mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| TA suspended or session revoked while editing | Next request: session ended → PUB-02 with the WP-01 message; typed input is lost; nothing was written | Yes (residue accepted, P2 as in WP-02) |
| SuperAdmin assigns an operator while the TA edits a submitted unassigned case on TA-09d/TA-09i | Core refuses `awaiting_formal_return` (control). The re-render shows no form, the TA-07 assigned notice, and "Your unsent changes" as a read-only list of the typed values, so the TA can copy them into a problem report. The values stay in the page only (SH-R12) | No (generic refusal; form shown again) |
| Approved help starts (assistance in progress) while the TA edits | `hold_assistance_in_progress` → same treatment, notice text of §3.1 | No |
| Group closed (another tab) while TA-09c is open | `group_closed` → CMP-10, no form | Partly |
| Application moved out of the TA's scope (another account) | Uniform 404 on the next read or command (SH-R04) | Yes |
| Background result after access loss | No WP-03 page polls (D-W03-13); A-01 protects later pollers | — |

### 7.5 Offering suspended or withdrawn mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| Suspended between TA-09c load and "Create drafts" | Core refuses all or nothing (`control_blocked`, the service's code); "[Service]: TravelMudra has paused new applications for this service. Nothing was created for any service."; the re-render shows the service unavailable (start page reread); other values kept | Partly (no service name) |
| Suspended while a draft exists | TA-07, TA-09t and TA-08 show CMP-10 from `submit.blockers`: "Submitting is unavailable while TravelMudra has paused new applications for this service. Owner: TravelMudra. Your draft is kept." Edits stay offered only if `correct.allowed` | Partly |
| Suspended between TA-08 load and submit | Refused with the blocker; CMP-10 replaces the statements; nothing submitted | Partly |
| Withdrawn, existing-work treatment missing (submitted) | TA-07 action panel: owner TravelMudra, the treatment sentence; no TA action | Yes (sentence) |

### 7.6 Counts and lists

| Situation | Required behaviour | Today |
|---|---|---|
| Delivery facts unreadable | Needs-action list and TA-06 `view=needs_action` say "may be incomplete"; reasons read as Core's pending answer (F-W03-01) | **No**: rows silently lose notices and downloads (`ta.ts:770-780`) |
| `intake.incidents` unreadable | TA-01 import-issues line: "Import issues are unavailable now." | New |
| `core.ta_groups` unreadable on TA-06 | Group, country and travel cells "Unavailable"; Group filter not offered | New |
| 200 groups, 200 applications | "This list shows at most 200 …" lines (§2.2, §2.6); search reaches the rest (§6) | No |
| Nav count unreadable | WP-01 "Unavailable" | WP-01 |

### 7.7 Long names and many documents

| Situation | Required behaviour |
|---|---|
| Surname 200 and given names 200 characters (`zWireApplicant`), group label 200, offering title 300, file display name 400 | `h1` wraps; table cells wrap anywhere; the identity band keeps the reference on its own line; breadcrumb items truncate visually at about 30 characters with the full text in the DOM; cards at narrow width keep the name first (AC-20) |
| Passport number with spaces typed | Core normalizes (`passportNumber`); the hint says spaces and hyphens are ignored |
| 100 requirements on one application (`max(100)`) | TA-09f is one table; each row's forms are compact (one file input and one button); the page has an in-page index of missing rows when more than 10 rows exist |
| 200 or 1000 files in the group (`doc.group_versions` max 1000) | TA-09u pages at 25 rows; the old group documents page keeps its full list (LD-02) |
| 12 files in one TA-09c form (`files: 12` multipart limit) | The form shows one input per declared type; when more than 12 types exist (none in the synthetic catalogue) the form states "At most 12 files can be sent with this form; add the others to each draft." |
| 8 services chosen (`offeringIds.max(8)`) | More than 8 checked → Core refuses `input_invalid`; the summary says "Choose at most 8 services in one form." (the BFF slices to 8 today, `routes.ts:40`, silently: F-W03-13, P2: the page must not drop choices silently; propose the handler stop slicing — shared file, P-W03-01 item (e)) |

### 7.8 Device and environment

| Situation | Required behaviour |
|---|---|
| 320 px and 400 % zoom | One column; task pages full-screen; no two-dimensional scroll except TA-09u's labelled region (AC-04) |
| JavaScript off | Every form works (plain POST; `<details>`); no upload progress; TA-06 in-page filter absent (fallback only); errors focus by `autofocus` |
| Back/forward cache | A-02 reloads every WP-03 page on restore; TA-08 then shows the current state |
| Clock skew BFF/Core | No WP-03 decision uses the BFF clock; the `min` date of TA-13 comes from Core's `today` |

## 8. Proof scenarios V05 and V02 on `lane-ui`

### 8.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge 4650, staff 4652, core 4651, processing 4653; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone). The synthetic seed of
  `WP-02-acceptance.md` §0.3: Synthetica (SYN) and Synthetica Beta (SYX), both listed; eight offerings launched for
  every active travel agent; accounts syn-ta-1 to -3, syn-operator-1 to -3, syn-superadmin-1 and -2.
- Offerings used: "SYN Tourist e-visa" (₹3,500; passport required PDF/JPEG/PNG 5 MB; photograph required JPEG/PNG
  2 MB; submit 3 to 90 days before travel; statement `ta_confirms_details` version `syn-1`) and "SYN e-visa, fee paid
  with submission" (₹3,600, same documents). Estimate 5 to 12 calendar days.
- Documents: the LD-11 harness builds synthetic passport files in memory with the test fixtures
  (`passportTextPdf(td3Lines(...))`, `test/fixtures/documents/samples.ts:44-91`) and a photograph (`plainPng(600,
  600)`), with a passport number unique per run in the one-letter-seven-digits shape (accepted by both the current and
  the 4496ee9 rule). Nothing real is uploaded. If the bulk version with passport parts is integrated before the
  proof, the harness builds a two-page PDF (front with the MRZ, plain back page) — PM to confirm against the seam
  version (DEP-2).
- Inference, not checked (no server access in this step): the processing instance reads the synthetic MRZ, as
  the system tests show (`test/system/support/drafts.ts:68-80`). The PM MUST confirm on the first run.
- Writes: each run creates new groups (label `wp03-v05-[yyyymmddhhmm]`, `wp03-v02-…`) for syn-ta-1 with travel start
  today + 30 days, and drafts and one or two submissions in them. Seeded data is not changed (Q-W03-08).

Sign-in through the LD-11 harness; screenshots allowed; codes never printed. axe at 1440 px and 390 px on every
WP-03 page visited.

### 8.2 V05 — explicit per-application submission fixes quote and original estimate (B17)

UX §12: "Explicit per-application submission/authority fixes quote and original estimate; help/import/payment never
substitutes; changed forecast stays separate."

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V05-1 | syn-ta-1, `/home` | Sign in | 303 to `/ta`; TA-01 with "Needs your action" (or "Nothing needs your action now"), notices blocks, "Create a group" | L |
| V05-2 | TA-13a | Create group `wp03-v05-…`, Synthetica, start today+30, return today+40 | TA-05 with receipt "Group created" (reference, country, dates) | L |
| V05-3 | TA-05 → TA-09c | Choose "SYN Tourist e-visa"; enter the synthetic applicant A; attach the passport file; "Create drafts" | INT-1 "Drafts created": one application, link "Prepare this application" | L |
| V05-4 | TA-09c | Same form again with a new `_op` (open the page again, same applicant and service) | C2 "This applicant already has an open application for SYN Tourist e-visa in this group. Nothing was created." with the link; TA-06 `group=` shows one row | L |
| V05-5 | TA-09t | Open; read the task list | Section states from Core: Application details "Needs your input"; Documents "Needs evidence" (photograph missing) or "Being checked"; Check and submit "Cannot start yet: … items above stop submission". No percentage | L |
| V05-6 | TA-09d | Save travel purpose, passport type "ordinary", residence IND | Receipt "Application details saved" on TA-09t | L |
| V05-7 | TA-09f | Upload the photograph | Receipt "File received"; row "Being checked for safety"; after "Check again", "Accepted"; passport "Accepted" | L |
| V05-8 | TA-07h for applicant A | Ask for help with a note | TA-07 receipt "Help requested": application still "Draft", "nothing was submitted"; status row Help request "Requested: TravelMudra decides"; Progress still Draft | L |
| V05-9 | TA-08 (applicant A) | Read; press "Submit this application" without the statement | Price "₹3,500 … fixed when you submit"; window "[today] + estimate", "if you submit today"; statement text (draft wording) unchecked. C1: summary "Confirm the statement … to submit." focused; nothing submitted (TA-06 still Draft) | L |
| V05-10 | TA-08 | Tick the statement; submit | TA-07 receipt "Application submitted": quote ₹3,500; original estimated window; Next per Core (pay ₹3,500, then TravelMudra assigns an operator); "Recorded once" | L |
| V05-11 | Harness | Resend the same POST (same `_op`, same fields) | 303 to the same receipt; History shows one "Submitted to TravelMudra" line | L |
| V05-12 | TA-07 | Read "Price and timing" and status facts | Quoted at submission ₹3,500; Original estimated window; Current forecast "No later forecast" — three separate rows; Service payment "Not recorded" separate; no "Approved", no percentage | L |
| V05-13 | Test | Publish new business values for the offering after the submission (`cat.publish_baseline`), then read the submitted application and a draft of the same offering | Submitted: quote unchanged; draft's TA-08 shows the new price; a TA-08 opened before the publication and sent after it gets `price_changed` with CMP-14 "Price: yours / current" and an unchecked statement | T |
| V05-14 | Test (or `lane-ui` old staff pages, Q-W03-08) | SuperAdmin records the service payment; an assigned operator records a forecast | TA-07: payment row changes; quote and original window unchanged; forecast shows as its own row | T |
| V05-15 | Test | Bulk import of the same applicant and service in another group; help approved | Import and help create no submission: the applications stay "Draft" until the TA submits each (UI-PLAN A6) | T |
| V05-16 | axe | Pages of V05-1 to V05-12 | No violation at 1440 px and 390 px | L |

### 8.3 V02 — one applicant, two services, two independent applications (B03, B14)

UX §12: "One row yields two services; two independent applications retain separate quote/authority/owner/outcome and
no cross-group reuse."

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V02-1 | syn-ta-1, TA-13a | Create group `wp03-v02-…` (Synthetica) | Receipt on TA-05 | L |
| V02-2 | TA-09c | Choose "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission"; applicant B; passport file | INT-1: two rows "Draft created", two different application references | L |
| V02-3 | TA-06 `?group=<id>` | Read | Two rows: same applicant, two services, two references; Progress Draft each | L |
| V02-4 | TA-07 of each | Read | Each has its own status facts, its own price (₹3,500 / ₹3,600 "if you submit today"), its own documents table: the passport proposed for both (Core proposes it for each service that declares it) | L |
| V02-5 | TA-09f of the first | Upload the photograph | First: photograph "Being checked"/"Accepted"; second: photograph still "Missing" (independent evidence) | L |
| V02-6 | TA-08 of the first | Tick and submit | First: Submitted, quote ₹3,500. Second: still Draft, no quote; its TA-08 still shows its own unchecked statement (separate authority) | L |
| V02-7 | TA-07 of each | Read Next | Different next owners: first "You — pay …"; second "You — complete the application" | L |
| V02-8 | TA-13a, TA-09c | Create a second group (same country); add applicant B with "SYN Tourist e-visa" | Allowed: a new independent application (duplicate scope is applicant + group + service) | L |
| V02-9 | TA-09u in the second group's application | Open "Use a file already in this group" for the passport | The list holds only files of the second group; the first group's passport is absent | L |
| V02-10 | Harness | POST `…/documents/<first group's passport version>/associate` for the second group's application | Refused (uniform 404 or Core's reason); nothing linked; the second application's passport row unchanged (no cross-group reuse) | L+T |
| V02-11 | Test | Assign an operator to the first application; record an outcome | The second application's owner and outcome do not change | T |
| V02-12 | axe | Pages of V02-1 to V02-9 | No violation | L |

Proof split: `L` on `lane-ui`; `T` named tests. V05 passes when V05-1 to V05-12 and V05-16 pass on `lane-ui` and
V05-13 to V05-15 pass as tests (or on `lane-ui` with the architect's approval of the staff-page writes). V02 passes when
V02-1 to V02-10 and V02-12 pass on `lane-ui` and V02-11 passes as a test.

### 8.4 Acceptance additions in the proofs

| Item | Proof step |
|---|---|
| TA-09-R1 rule text beside the passport input | V05-3 (screenshot of the Documents part); two-file shape only after DEP-2 |
| TA-09-R2 format message | Harness step after V05-3: send the TA-09c form with passport number `12AB` for issuing country IND → the field error names "one letter and seven digits (A1234567) or two letters and six digits (AB123456)" (after DEP-1); before DEP-1 the item is recorded "partly met" |
| TA landing `/ta` | V05-1 |
| SH-R06 | Harness: search for applicant B's surname on TA-06s; assert no address in the session's history contains the text |

## 9. Implementation breakdown

### 9.1 Work units (disjoint files)

Phase A: U0 (and U6 only after Q-W03-01). Phase B: U1 to U5 in parallel. Phase C: U7. The architect registers the
gallery modules in `scripts/dev/gallery-pages.ts` and edits `DESIGN.md` once at the end. Files of WP-01 and WP-02
(`src/web/ui/shell.ts`, `src/web/ui/index.ts`, `src/apps/shared/common-routes.ts`, `static/css/components.css`)
change only through the named one-line or one-block additions, applied by the architect.

| Unit | Files (change or add) | Tests (add or update) | Gallery module |
|---|---|---|---|
| **U0 Components and the TA reading rule** | New `src/web/ui/tasks.ts` (CMP-04), `src/web/ui/review.ts` (CMP-05), `src/web/ui/evidence.ts` (CMP-02), `src/web/ui/bands.ts` (CMP-11, CMP-24); WP-03 block in `static/css/components.css`; exports in `src/web/ui/index.ts`. New `src/apps/shared/core/ta-reading.ts`: a pure move of `taPendingOf`, `rowViews`, `pendingCell`, `needingAction`, `applicationsNeedingAction`, `listFacts`, `paymentAwaited`, `mayDownload`, `draftRecheckWaits` out of `ta.ts` (no behaviour change; `attention.ts` import path) | New `test/unit/web/wp03-components.test.ts`: task-list states are the closed set and no percentage renders; a confirmation renders unchecked unless a value is passed; "Change" links name their section; evidence row text per status, unknown status → "Unrecognised state"; identity band `h1` holds name and reference | `scripts/dev/gallery/tasks.ts`, `review.ts`, `evidence.ts`, `bands.ts` |
| **U1 Groups** | New `src/apps/shared/pages/groups.ts` (TA-04, TA-05, TA-13a, TA-13b); new `src/apps/shared/core/ta-groups.ts` (GET `ta.groups.list`, `ta.groups.detail`, `ta.groups.new`, `ta.groups.travel_dates_form`); new `src/apps/edge/core/group-routes.ts` (POST `ta.groups.create`, `ta.groups.travel_dates`, `ta.groups.close`: handlers moved unchanged except re-render and receipt) | New `test/unit/web/groups-pages.test.ts`: state filter only; counts from Core; no "can close" verdict; carried close form present on an open group; receipts; "at most 200" line; TA-13b without "affected" list | `scripts/dev/gallery/groups.ts` |
| **U2 Home and lists** | New `src/apps/shared/pages/ta-home.ts`, new `src/apps/shared/core/ta-home.ts` (`ta.home`); new `src/apps/shared/pages/applications-list.ts`, new `src/apps/shared/core/ta-applications-list.ts` (`ta.applications.list` moved); `src/apps/shared/views/ta.ts` (TA-06s: token GET, or the fallback) | New `test/unit/web/ta-home.test.ts` (S2 teaching without counts or country; blocks fail independently; incompleteness note); new `test/unit/web/applications-list.test.ts` (enumerated filters, unknown values ignored, S3 copy, row links carry `from` and filters, 200 line); update `test/unit/web/travel-recheck.test.ts:13, 131-158` | `scripts/dev/gallery/ta-home.ts`, `applications.ts` |
| **U3 Workspace, TA-08, help** | `src/apps/shared/core/ta.ts` (TA-07 rebuilt; GET `ta.applications.review`, `ta.applications.help_form`); new `src/apps/shared/pages/review-submit.ts`, `help-request.ts`, `authority-text.ts`; `src/apps/edge/core/routes.ts` (submit and assistance: re-render and receipt; hand back per Q-W03-06; carried forms unchanged) | New `test/unit/web/application-workspace.test.ts` (separate status rows; action panel per §3.1/§3.2; assigned notice copy; no edit link when assigned; carried forms listed); new `test/unit/web/review-submit.test.ts` (hidden values equal shown values; never prechecked; unchecked after C5; missing statement text → no form; blocked → disabled button described; returned mode); new `test/unit/web/authority-text.test.ts` (every statement of the synthetic catalogue has text) | `scripts/dev/gallery/application.ts`, `submit.ts` |
| **U4 Task list, sections, documents, DOC** | New `src/apps/shared/pages/prepare.ts` (TA-09t, TA-09i, TA-09d, TA-09f, TA-09u); new `src/apps/shared/core/prepare-routes.ts` (their GET routes); new `src/apps/edge/core/prepare-forms.ts` (POST `ta.applications.edit`, `ta.applications.correct_identity` moved; bodies unchanged except re-render and receipt); `src/apps/shared/core/documents.ts`; `src/apps/edge/intake/application-documents.ts` (re-render targets, receipts; not a shared file of the seam); `src/apps/shared/pages/documents.ts` (version page only); `src/apps/shared/ta-documents.ts`; `src/apps/edge/documents.ts` (receipt locations) | New `test/unit/web/prepare-pages.test.ts` (blocker → section map; unknown code → "Other items"; no form when `correct` is blocked; evidence not prechecked; passport rule text; passport number hint and message from the shared rule with the drift guard of §4.4; unsent-changes list after `awaiting_formal_return`); new `test/unit/web/document-detail.test.ts` (separate status rows; attestation unchecked after a refusal; receipts); new BFF test: refused replace and associate re-render TA-09f/TA-09u with the reason | `scripts/dev/gallery/prepare.ts`, `document-detail.ts` |
| **U5 Add one applicant, individual result** | New `src/apps/shared/pages/individual-intake.ts` (TA-09c; exported `individualStartPage` for the shared route's re-render); new `src/apps/edge/core/individual.ts` (GET `ta.applications.new`); `src/apps/shared/pages/intake.ts` renderer parts only (startPage: individual section becomes a link to TA-09c; attemptPage: individual variant INT-1) | New `test/unit/web/individual-intake.test.ts` (one form; services never prechecked; an unselectable service disabled with its reason; passport rule text; "Choose the files again" after a refusal; duplicate link; 8-service message) | `scripts/dev/gallery/individual-intake.ts` |
| **U5s Shared intake file (proposal P-W03-01)** | `src/apps/edge/intake/routes.ts` (individual re-render via `individualStartPage`; success `receiptLocation`; no silent slice of services); `CODE_TEXT.passport_number_invalid` in `src/apps/shared/pages/intake.ts` | Update the BFF intake test that pins the re-render | — |
| **U6 Search seal** (after Q-W03-01) | `src/web/routes.ts` (seal kind), `src/apps/shared/server.ts` (shell handler), new `src/web/seal.ts` (envelope; reuse of the WP-01 A-05 code) | §6.6 | — |
| **U7 Wiring and system tests** | `src/web/route-inventory.ts` (new entries; ids for T01 and T09; seal entry); `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts` (support-view GET routes `ta.home`, `ta.applications.prepare`, `ta.applications.review`); removal of the code moved out of `ta.ts` and `edge/core/routes.ts`; one-line additions: `SURFACE_CONFIG.ta.home = '/ta'`, `resultHrefOf` `intake_attempt` | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids); `test/unit/web/signed-in.test.ts` (TA landing); new `test/unit/web/carried-forms-wp03.test.ts` (§1.5 forms present by action path); the system tests of §9.3 | — |

U3 owns `ta.ts` and `edge/core/routes.ts`. U1, U2 and U4 create new files with the moved routes; U7 removes the old
copies in phase C, so no two units edit one file.

### 9.2 Carried-form test

`test/unit/web/carried-forms-wp03.test.ts` renders TA-05 and TA-07 fixtures (open group; assigned case; returned
case; price increase; transition; released correction; dependency relation; submitted case with delivery facts) and
asserts each action path of §1.5. WP-08, WP-09, WP-10, WP-13 and WP-17 remove their entries when they rebuild them.

### 9.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/support/browser.ts:170-185` (`intakeThroughEdge`) | GET `/intake/new` for the individual form; `Location` regex `^/ta/intake/(ina_…)$` | GET `/ta/groups/:id/applications/new`; allow `?done=drafts&op=…` |
| `test/system/support/drafts.ts:48-55` (`uploadThroughApplicationPage`) | Upload form on TA-07; `Location` `/ta/applications/:id` | GET TA-09f; `Location` `/ta/applications/:id/documents?done=document&op=…` |
| `test/system/support/drafts.ts:88-106` (`submitThroughEdge`) | Edit and submit forms on TA-07; `Location === …?done=submitted` | Edit from TA-09d (303 to TA-09t), submit from TA-08; allow `&op=` |
| `test/system/core-pages.test.ts:160-220` | Edit, submit, correct-identity, request-assistance read from TA-07 | Read from TA-09d, TA-08, TA-09i, TA-07h |
| `test/system/case-work.test.ts:129-151` | `/intake/new`; edit and submit on TA-07 | Through the helpers |
| `test/system/case-rules.test.ts:74-76, 158, 279` | `/intake/new`; request-assistance on TA-07 | TA-09c; TA-07h |
| `test/system/ta-documents-originals.test.ts:63-64, 126, 135, 149, 160, 204-211` | `/intake/new`; landing `/ta/applications`; upload, edit, submit on TA-07 | TA-09c; landing `/ta`; TA-09f, TA-09d, TA-08 |
| `test/system/intake-pages.test.ts:53-107, 168, 304` | Individual form on `/intake/new`; upload on TA-07 | TA-09c; TA-09f |
| `test/system/new-service.test.ts:155` | `/intake/new` for the individual form | TA-09c |
| `test/system/browser.test.ts:64, 89, 116-118, 151` | Landing `/ta/applications`; brand `href`; click `main a[href=…/intake/new]`, then the individual form | Landing `/ta`; brand `/ta`; click "Add one applicant" |
| `test/system/three-instances.test.ts:142` | `/home` → `/ta/applications` | `/ta` |
| `test/system/case-views.test.ts:60-77, 156-159` | `/ta/search?q=…` GETs (also in a support view) | §6.6 |
| `test/unit/web/travel-recheck.test.ts:13, 131-158` | `applicationPage`, `applicationsPage` imports; `.docket`, `#needs-action` | New renderers and selectors; same sentences |
| `test/unit/web/routes.test.ts:128` and inventory counts | `/ta/search` GET row | Add the new rows |

Stay valid: `test/system/support/drafts.ts:40-45` (`untilDocuments`, if TA-07 keeps `section#documents` with document
and status first), the carried-form posts (`core-pages.test.ts:302, 364-378`; `case-rules.test.ts:99, 127, 136, 341`),
`intake-pages.test.ts:263` (support view: no add link on the group intake page), `test/ui/gallery.test.ts:707`,
`test/unit/nav-counts.test.ts` (counters unchanged).

## 10. Findings, open questions, deviations, STOP items and proposals

Ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12 and then to Max's end review; P2 is parked as a note.

### 10.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W03-01 | P1 | The needs-action rule silently drops notices, downloads and packets when `dlv.delivery_facts` fails (`listFacts` returns an empty map, `src/apps/shared/core/ta.ts:770-780`) | A notice that needs the TA's acknowledgement exists; the delivery read fails; Home says "Nothing needs your action now" and the TA does not acknowledge a timing decision | "May be incomplete" note on TA-01 and TA-06 (§2.1, §7.6); unknown is never "nothing" (D7) |
| F-W03-02 | P1 | The authority statement is labelled `humanize(code)` ("Ta confirms details", `ta.ts:415`); Core records the TA's confirmation of text version `syn-1` | A TA ticks a statement whose words they never saw; the record claims a confirmed text (B17 "actual authority/consent confirmation") | Statement catalogue by `code@version`; missing text → no submission (§5.4, D-W03-10) |
| F-W03-03 | P1 | Search text in the address (`src/apps/shared/views/ta.ts:66`) | A passport number searched on a shared office computer stays in the browser history and is sent as Referer | §6 |
| F-W03-04 | P1 | `ta.documents.replace` and `ta.documents.associate` answer a refusal with the shell error page (`ctx.respond`, `src/apps/edge/intake/application-documents.ts:64-89`); no form posts them today | A TA replaces a passport with a 6 MB scan, gets a full-page error, loses the page context and does not know which rule failed | Re-render TA-09f/TA-09u with the reason and the requirement's rule (§1.4 rows 7, 8) |
| F-W03-05 | P1 | TA-05 computes whether the group can close from the rows and hides the close form (`ta.ts:280-306`) (D5) | Core's closure rule changes (for example ended-with-group applications); the page hides a closure Core would accept, or shows one it refuses | Show Core's closure facts and the rule text; never a page verdict; form visibility Q-W03-09 |
| F-W03-06 | P2 | Document decisions answer 303 with no confirmation (`src/apps/edge/documents.ts`, `versionLocation`) | The TA records passport details and cannot tell whether anything was recorded | Receipts `resolved`, `classified` |
| F-W03-07 | P2 | The intake catalogue says "Something went wrong. TravelMudra support has been notified." (`src/apps/shared/pages/intake.ts:119`) (CR-01) | — | "This could not be completed. Reference: [code]." (catalogue text: proposal P-W03-01 item (d)) |
| F-W03-08 | P2 | A stale submit says "Someone changed this application" (`shared.ts:133`) when the cause is the India date | The TA looks for a colleague's change that never happened | CMP-14 names the changed value (§5.4) |
| F-W03-09 | P2 | The document page shows one combined state badge (`src/apps/shared/pages/documents.ts:129-140`) | Safety passed, details unread and association proposed read as one label | Separate status rows (§2.12) |
| F-W03-10 | P2 | The identity form prechecks the evidence from the passport reading (`ta.ts:494`) | A TA corrects a field without looking at which document is the evidence | Evidence never prechecked (§4.5) |
| F-W03-11 | P1 (carried, WP-09) | Report-a-problem eligibility is computed in the page (`ta.ts:548-549`) | Core's rule for reports changes; the page offers or hides the form wrongly | Carried unchanged in WP-03; WP-09 replaces it with Core's evaluation |
| F-W03-12 | P2 | Copy states a configured value it does not read ("5 MB": `src/apps/shared/core/documents.ts:47`, `pages/intake.ts:99`) | A future 3 MB limit shows "5 MB" | Use the requirement's own `maxBytes` (§4.6); catalogue text via P-W03-01 |
| F-W03-13 | P2 | The intake handler silently keeps only the first 8 services (`src/apps/edge/intake/routes.ts:40`) | A TA ticks 9 services; one draft is silently missing | Propose to stop slicing so Core refuses (P-W03-01 item (e)); message "Choose at most 8 services in one form." |

### 10.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W03-01 | P1 | SH-R06: add the shell route kind "seal" (§6.3), or take the fallback (§6.4)? | Without 6.3, a TA with 260 applications cannot find applicant 230 by passport number; with 6.3, the BFF gains a POST that sends no Core command | Adopt 6.3 with the independent review and the tests of §6.6; the fallback only if the reviewer finds a P0 |
| Q-W03-02 | P1 | Statement wording: a UI catalogue by `code@version`, with no submission when a version has no text | A real offering launches with statement `consent_v2`; without its text the TA cannot submit any of its applications | Adopt; ask Max for the approved texts (C05) before the first real offering; synthetic texts marked draft |
| Q-W03-03 | P1 | Send P-W03-01 (rendering-only changes in `src/apps/edge/intake/routes.ts` and the catalogue texts) to the orchestrator, to be applied by the UI lane in one commit? | Without it, a refused "Create drafts" re-renders the old combined page, and the result page has no receipt | Yes |
| Q-W03-04 | P1 | TA-09-R1: accept "partly met" (one-file shape only) until the bulk lane serves passport parts (DEP-2)? | Max reads the form during WP-03 acceptance and asks why two files cannot be sent | Yes; the rule text is stated now; the two-file input lands in the integration window of the bulk version |
| Q-W03-05 | P1 | TA-09-R2: ask the orchestrator to integrate bulk commit 4496ee9 before WP-03's implementation (DEP-1)? | Without it, a valid two-letter Indian number is refused and the message states no format | Yes; otherwise R2 is partly met and UAT-09 stays open |
| Q-W03-06 | P1 | TA-08 hosts the hand back of a formally returned submitted case (moves the carried WP-09 form, register `core.hand_back` → WP-03)? | Without it, the TA corrects on TA-09 and must find the hand-back form on TA-07; TA-08 cannot show the "unchanged quote" review the plan asks for | Yes, form unchanged (action, fields); WP-09 keeps the report-problem panels |
| Q-W03-07 | P1 | Move the TA landing to `/ta` now (WP-01 shell value; 3 system tests change)? | — | Yes (WP-01 §2.2 deferred it to WP-03) |
| Q-W03-08 | P1 | V05/V02 write new synthetic groups, drafts and submissions per run on `lane-ui`; V05-13 to V05-15 as tests, or on `lane-ui` through the old staff pages | A rerun with fixed labels collides with nothing (groups are not unique) but fills TA-04; staff-page writes touch WP-06/WP-07 areas | Approve the per-run writes with dated labels; keep V05-13 to V05-15 as tests |
| Q-W03-09 | P2 | Carried close form: show it whenever the group is open and let Core refuse, instead of today's page-side hiding? | An empty group from a double create (Q-W03-17) cannot be closed when the page's rule is wrong | Show it; Core refuses with the condition (CC-02 intent) |
| Q-W03-10 | P2 | Accept the data gaps of TA-04, TA-06, TA-07 as deviations until a Kind 1 bundle (STOP-W03-02 to -05) is decided? | A TA cannot filter applications by service | Accept; send the bundle as one P2 proposal |
| Q-W03-11 | P2 | No polling of document checks in WP-03 ("Check again" link) | A TA waits on TA-09f and reloads by hand | Accept; reuse WP-04's self-refresh pattern later |
| Q-W03-12 | P2 | No free-text search in a support view | A SuperAdmin in a support view searches for a name | Accept; the SuperAdmin search covers it |
| Q-W03-13 | P2 | One "Save" per section (to the task list), no "Save and continue" / "Save and exit" pair | A TA wants to go straight to the next section | Accept; the task list is one click away and shows the next state |
| Q-W03-14 | P2 | Submission time on the receipt | The TA tells the customer "submitted today" without the time | Via P-02 or STOP-W03-01; the History link meanwhile |
| Q-W03-15 | P2 | Which package rebuilds the TA history page (CMP-09)? | It stays in the old layout after WP-03 | WP-08 (TA-07 outcome and delivery) or WP-17; the architect decides |
| Q-W03-16 | P2 | TA-03 "Start an application" (Q-W02-10): stays `/ta/groups` | The display has no country id (STOP-W03-05) | Keep `/ta/groups`; TA-04's "Create a group" is one click |
| Q-W03-17 | P2 | Two tabs create two groups (no business key) | A stray empty group in TA-04 | Accept; closable |

### 10.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W03-01 | TA-09 create mode is one form page; the task list starts after creation | None |
| D-W03-02 | New GET pages on POST paths and new paths (§1.2); T01, T09 get ids | New routes and inventory entries; no action or field changes |
| D-W03-03 | Forms leave TA-07 for TA-08, TA-09 sections and TA-07h; re-render targets change | Host pages change; system tests change (§9.3) |
| D-W03-04 | The individual form leaves `/ta/groups/:id/intake/new` (link to TA-09c) | Tests change; the action stays |
| D-W03-05 | TA search via a sealed token and a shell route kind "seal" (or the §6.4 fallback) | New POST route without a command; `?q=` removed |
| D-W03-06 | TA-05 Imports and Intake issues are sections, not tabs, until WP-04 | None |
| D-W03-07 | TA-04 without counts by progress, issue counts, next action, country filter; TA-13b without an impact preview | None |
| D-W03-08 | TA-06 without service and country filters and without sort | None |
| D-W03-09 | TA-01 items without a recorded date | None |
| D-W03-10 | Statement texts from a UI catalogue; a version without text blocks the submission | None |
| D-W03-11 | A returned submitted case is confirmed by hand back (Core), not by submit (UI-PLAN R3) | None (Q-W03-06 moves the form) |
| D-W03-12 | The document view shows separate status rows, not one state badge | None |
| D-W03-13 | No polling of document checks | None |
| D-W03-14 | "Save" only (no Save and continue / Save and exit) | None |

### 10.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check (Kind 1) | Without it |
|---|---|---|---|---|---|
| STOP-W03-01 | Kind 1, P2 | `core.ta_application.submission.submitted_at` (or P-02's accepted time) | UX §4.3 and UI-PLAN TA-08: the receipt reports the submission time | 1: `core_submissions.submitted_at` exists. 2: removes a second read (history projection) on the receipt. 3: same scope as the case read | Receipt without the time; link to History (§5.5) |
| STOP-W03-02 | Kind 1, P2 | `core.ta_groups` rows: counts by common progress (unit applications), open import issues, country id, the next action | UI-PLAN TA-04 columns and filters | 1: facts exist (lifecycle, pending, incidents). 2: removes N group reads or a page count. 3, 4: group-list projection, reusable by BU-P01 | TA-04 shows "[open] open of [total] applications" only (D-W03-07) |
| STOP-W03-03 | Kind 1, P2 | `core.ta_application`: service mode, country, the assigned operator's display name | CMP-11 identity band (mode, country); UX §4.3 "who must formally return the case" | 1: facts exist (offering, group, assignment). 2: removes reads of `core.ta_group` and the catalogue | Band without mode and country; "your operator" as the role |
| STOP-W03-04 | Kind 1, P2 | `core.ta_applications` rows: offering id, country id, group travel dates | TA-06 service and country filters, travel-date column without a second read | 1: facts exist. 2: removes the `core.ta_groups` join | Filters by view, progress and group only (D-W03-08) |
| STOP-W03-05 | Kind 1, P2 | `cat.offering_display`: country id | TA-03 → TA-13a with the country chosen | 1: fact exists. 2: removes a name match | Start goes to `/ta/groups` (Q-W03-16) |
| STOP-W03-06 | Content input (C05), P1 | Approved wording of each authority statement version | UX §4.3, B17: the actual confirmation | — | Synthetic draft texts only; a real version without text cannot be submitted |

No STOP item blocks V05 or V02. No P0 item is open in this design.

### 10.5 Dependencies on the bulk lane (seam)

| ID | Rank | Dependency | Effect until served |
|---|---|---|---|
| DEP-1 | P1 | Bulk commit 4496ee9 (`src/workers/passport-number.ts`, both Indian shapes) integrated on main | TA-09-R2 partly met (§4.4 item 5) |
| DEP-2 | P1 | Passport parts in a seam version: the individual form and `doc.upload_for_application` accept the passport twice with `part`; statuses `incomplete`, `over_supplied`; a per-requirement `parts` fact in `intake.start_page` and `doc.application_evidence` | TA-09-R1 partly met (§4.3 item 2) |

### 10.6 Proposals needed

| ID | To | Kind | Rank | Content |
|---|---|---|---|---|
| P-W03-01 | Orchestrator (shared files, SEAM-CONTRACT §1 row 3) | Rendering change in shared files; no command shape change | P1 | In `src/apps/edge/intake/routes.ts`: (a) a refused `ta.intake.start_individual` re-renders TA-09c (`individualStartPage`), not `startPage`; (b) its accepted answer is `receiptLocation('/ta/intake/<attemptId>', 'drafts', operationKey)`; (c) `renderStart` keeps working for the bulk form only; (e) `services()` stops slicing to 8 so Core refuses more. In `src/apps/shared/pages/intake.ts` `CODE_TEXT`: (d) `passport_number_invalid` built from `indianPassportNumberShapesText()` (after DEP-1), `unexpected` → "This could not be completed. Reference: [code].", `document_too_large` → "The file is larger than this document accepts." Applied in one UI-lane commit if the orchestrator assigns it |
| P-W03-02 | Orchestrator → bulk lane (seam request) | Seam fields | P1 | DEP-2's read-model facts and multipart field names for passport parts; the general (non-Indian) passport-number shape in `src/workers/passport-number.ts` with label and example (P2 part) |
| P-W03-03 | Orchestrator | Kind 1 bundle | P2 | STOP-W03-01 to -05 as one proposal under the six-point criterion |
| — | Architect (WP-01 files) | One-line changes | P1 | `SURFACE_CONFIG.ta.home = '/ta'`; `resultHrefOf` maps `intake_attempt` → `/ta/intake/:attemptId`; `staleComparison` first consumer (WP-01 §7.6) |
| — | Architect (register) | `COMMAND-COVERAGE.md` | P2 | `core.edit_travel_dates` built in WP-03 (TA-13b); `core.hand_back` to WP-03 if Q-W03-06 is adopted |
