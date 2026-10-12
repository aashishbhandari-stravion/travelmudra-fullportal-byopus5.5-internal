# WP-14 design review: incidents, audit and degradation

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-14 holds
commands that block a released file for good, post notices to travel agents that cannot be withdrawn, give a reviewer
access to a result file, and send quarantined documents back through their checks; so a Codex design review applies).
Product base: lane repository at e1f6ac9 (WP-01 shell and result components incl. U7 tests, WP-20 public site, WP-02 U0
and U1, WP-03 U0 and U6). WP-06 to WP-12 are designed and not yet built; this design depends on their units named in
§1.7 and amends four of them (§1.8). This document writes no product code. Paths in `file:line` form are relative to
the lane repository at e1f6ac9 unless they start with `REC/` (`internal/records/`) or `RM` (lane
`research/route-map.md`). Code is read as committed (`git show e1f6ac9:<path>`); the working tree was not read.

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at e1f6ac9. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Ten register commands (COMMAND-COVERAGE §3, §5.1, §6 CC-01, CC-13): `ops.report_wrong_recipient`,
  `ops.post_disclosure_notice`, `ops.record_incident_evidence`, `ops.resolve_incident`, `ops.close_incident`,
  `ops.open_incident`, `ops.assign_incident_reviewer`, `ops.classify_failure`, `doc.requeue_check`, `doc.requeue_bulk`.
  Pages OP-08 (operator incidents and follow-up), SA-08 (SuperAdmin incidents, audit, reporting health, document
  checks, monitors) and the WP-14 part of SA-01 (incident and reporting-gap groups). Proofs V13 (disclosure part) and
  V23 (SA-08 part). Seam item S-09.
- **Page model.** One host page per command (CC-12 to CC-16). New GET task pages sit beside the existing POST paths:
  record evidence, post a notice, resolve (both surfaces); name a reviewer, classify a failure, open an incident
  (SuperAdmin); report a release to a wrong recipient and open an incident (operator, under the application path);
  run one document check again and run the waiting checks again. Close stays on the incident page (one button and an
  optional note). Every form keeps its action, its hidden inputs (`_rev.incident`, `_rev.version`, `documentVersionId`,
  `applicationId`, `stage`, `limit`) and its field names. Read pages are rebuilt on their kept paths.
- **S-09 (orchestrator, binding).** The SuperAdmin incident page (SA-08i) renders no confirm or reject association
  form. Today it renders both, posting to `/admin/incidents/:id/confirm-association` and `…/reject-association`, for
  which no route exists (`incidents.ts:112, 164-180`). The association decision stays with OP-05r (WP-08); a
  SuperAdmin names a reviewer when the application has no active operator (BS B13). A test asserts that every form
  action rendered by every WP-14 page is a registered POST route of the staff instance (§7.2).
- **V13 disclosure part.** The report blocks the file for good and the page says so only from Core's current facts;
  each affected account gets one notice with the variant Core accepts for that account; the notice text states only
  what the notice records (AM-W14-02 fixes a TA notice body that claims "The file is blocked" and "TravelMudra has
  asked the recipient to delete it" without those facts); resolution needs every required item; closure ends every
  duty and cannot be undone.
- **V23 SA-08 part.** Reporting health states each derived view in the LD-08 lag form, never "all current" or "0"
  for an unknown; Monitors never shows a success callout while a count is unknown; no SA-08 page shows a restore,
  reopen or rebuild control or a server command; incident and requeue commands continue during a projection outage
  because they read only authoritative records; maintenance answers the status document and nothing is replayed.
- **Findings worked (§9.1).** The S-09 forms; a notice form that offers every variant for every recipient; the TA
  disclosure body claims; LD-17 truncations in four handlers; refusals of open, classify and requeue that drop the
  typed reason; a success callout over unknown counts; a fabricated "0 entries projected" and "0 checks were sent
  again"; a server command shown to SuperAdmins; raw application and country references typed by hand; a SuperAdmin
  kind (`artifact_association`) that opens an incident Core can never resolve.
- **STOP items (§9.4).** No P0. STOP-W14-01 (defect, P1): incident rows carry the stored owner, not the current duty
  holder, so an incident whose application's assignment ended is nobody's count. STOP-W14-02 (surface gap, P1): no
  SuperAdmin route reports a wrong recipient with the file block, although Core's policy allows it. Kind 1 P2 items:
  resolved incidents in the lists, current classification, notice recipients. Defect notes P2: a SuperAdmin-opened
  association incident is unresolvable; no business duplicate guard on open and evidence; "correction" met by any
  reference; the documents queue read stops at 200.
- **Top questions (§9.2).** Q-W14-01 host pages and paths; Q-W14-02 add the SuperAdmin report route once the
  orchestrator confirms; Q-W14-03 leave `artifact_association` out of SA-08o; Q-W14-04 bind AM-W14-02 to the WP-08
  build; Q-W14-05 STOP-W14-01 to the Core batch with the interim words; Q-W14-06 proof writes.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.1 (Incident/follow-up), §2.2, §2.3, §3.2 (Completed case with continuing duty), §3.3, §5.2, §5.3 (artifact review), §5.4, §6.1–§6.3 (Incidents & audit, Support view, Recovery boundary), §7.4, §8.3, §10.1, §12 V13, V19, V23 |
| `BUILD_SPEC.md` r2 | B10, B12, B13, B33, B35, B37, B38, B39, B40 |
| `UI-PLAN.md` | A (AD-10, AD-13), §1.1–§1.4, §2.1–§2.4, §3.3 OP-08, §3.4 SA-01, SA-08, §5.3 OP-08, §5.4 SA-01, SA-08, §6.3–§6.4 (Owned incidents, Incident and audit, Reporting health), §7 (incident rows, Block document version, Assign reviewer), §8, §10, §11, §12.2 WP-14, §13.2 B-09 |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-13, LD-14, LD-16, LD-17), §7, §8 (S-06, S-08, S-09), §9; `PROPOSALS.md`; `COMMAND-COVERAGE.md` §3, §5.1, §6 (CC-01, CC-13), §6.1; `WP-01.md` §3, §4, §6.1; `WP-01-acceptance.md` §3 V23; `WP-06.md` §3–§4; `WP-06-design.md` §1.2, §1.3, §2.0, §2.1; `WP-07.md` §3–§4 (F-01, F-04, F-33); `WP-07-design.md` §1.5, §2.5.3, U0; `WP-08.md` §3–§4 (Q-W08-08, PM Q-11, E-01, E-03, E-05); `WP-08-design.md` §1.2, §1.4, §1.5, §2.1, §2.2, §2.12–§2.14, §6.3; `WP-08-acceptance.md` Q-11, Q-13; `WP-09.md` to `WP-12.md` §3–§4; `WP-12-design.md` (structure); `DESIGN.md` |
| Route map (RM) | §2.2 rows O34–O39, O41, O48–O51, D05, D28, D72–D75, D97–D99, D113–D116, D122, D124–D127; §2.3 D01, D09, D123; §3.2 rows of the ten commands |
| Code (pages, routes) | `src/apps/staff/operations/incidents.ts` (all); `src/apps/staff/operations/labels.ts` (all); `src/apps/staff/operations/case-work.ts:100-111, 264-300, 406-419, 446-456, 585-591`; `src/apps/staff/documents.ts` (all); `src/apps/shared/pages/documents.ts:426-510`; `src/apps/staff/views/routes.ts` (all); `src/apps/staff/views/pages.ts:55-92, 205-251, 500-553`; `src/apps/staff/views/cases.ts:200-375`; `src/apps/staff/attention.ts`; `src/apps/shared/delivery/pages.ts:181-210, 647-690`; `src/apps/shared/core/shared.ts:375-525`; `src/apps/shared/evidence-form.ts`; `src/web/ui/shell.ts:120-195`; `src/web/route-inventory.ts:179-198, 216-357` |
| Code (contracts, bindings) | `src/contracts/operations-work.ts:43-46, 86-106, 140-237`; `src/contracts/documents.ts:33-34, 81-128`; `src/contracts/views.ts` (all); `src/contracts/views-cases.ts:30-72, 98-101`; `src/contracts/catalogue.ts:186-193`; `src/core-api/bindings/operations-work.ts:64-83, 155-253, 300-330`; `src/core-api/bindings/documents.ts:82-83, 120-145`; `src/core-api/allowlists.ts:85`; `src/kernel/errors.ts:23-31` |
| Code (Core behaviour only) | `src/modules/operations/case-work/commands/incidents.ts` (all); `…/case-work/incidents.ts` (all); `…/case-work/store.ts:150-174`; `…/case-work/facade.ts:100-150`; `…/case-work/evidence.ts:16-60`; `…/case-work/commands/common.ts:19-25`; `src/modules/documents/commands/requeue.ts` (all); `src/modules/documents/queries.ts:107-138`; `src/modules/documents/commands/common.ts:12-18`; `src/modules/delivery/notices.ts:1-20`; `src/modules/views/health.ts:1-110`; `src/modules/views/case-queries.ts:270-330`; `src/modules/core/derived.ts:180-200, 405-416`; `src/modules/core/commands/admin.ts:195-215`; `src/modules/identity/policy.ts:80-86, 170-259, 725-745`; `src/kernel/vocabulary/{incidents,operations,views,subjects}.ts` |
| Tests that pin the pages | §7.3 |

### 1.2 Incidents and degradation as Core holds them (facts)

| Fact | Where Core holds it | What the pages must respect |
|---|---|---|
| Kinds | Nine kinds (`vocabulary/incidents.ts`). An operator opens only `operational_failure`, `custody_discrepancy`, `post_filing_correction`, on its own application (`operations.ts:59`; `commands/incidents.ts:298-302`). A SuperAdmin opens any kind; `country_defect` needs a country (`:303`). Core itself opens `artifact_association` (association rule), `bytes_integrity` (documents, delivery), `custody_discrepancy` (holder uncertain), `official_fact_follow_up` (WP-11) and `wrong_recipient_disclosure` (the report) | Kind options come from Core's closed sets; Core decides at the command |
| States | `open`, `assigned` (a reviewer is named), `awaiting_evidence`, `resolved`, `closed` (`vocabulary/incidents.ts`). Open = the first three (`incidents.ts:50-52`). Close only from `resolved` (`commands/incidents.ts:272`). No command reopens | Closed is final; a page says so before the close button |
| Owner | Stored `owner_kind` (`assigned_operator`, `superadmin`, `reviewer`) and `owner_account_id`. A SuperAdmin-opened incident is owned by `superadmin` (`:321`). The current duty holder follows `incidentDutyHolders` (`incidents.ts:123-141`): an operator owner holds the duty only while it is the case's assigned operator; a reviewer only while the case has no active operator; closure ends every duty. Reassignment moves open and resolved incidents to the new operator (`incidents.ts:263-288`). Completion clears the assignment and moves nothing (`core/commands/admin.ts:199-210`) | The wire row carries the stored owner (`bindings/operations-work.ts:74-81`), not the current duty holder (STOP-W14-01). Pages label it "as recorded" until Core serves the holder |
| Who reads and works | `incident.read`: operator assigned or reviewer, SuperAdmin any (`policy.ts:227`, SQL `:736-745`). `incident.work`, `incident.resolve`: operator assigned or reviewer, SuperAdmin any (`:228-229`). `incident.open`, `incident.report_disclosure`: assigned operator or SuperAdmin (`:85, 203-204`). `incident.assign_reviewer`, `failure.classify`: SuperAdmin (`:196, 198`). Read grants and support views get no incident action | Forms show only by Core's offers on `ops.incident` (`bindings/operations-work.ts:196-205`) |
| Required evidence | Codes per incident (`incidents.ts:25-31, 54-85`): `evidence` (a non-attestation reference), `association_decision` (the artifact verified or rejected), `correction` (an eligible replacement artifact, or any non-attestation reference on the incident), `notice:<account>` (a disclosure notice posted to that account). `missingEvidence` is empty when the incident is not open (`:101`) | The "Required to resolve" list is Core's codes, in Core's order, with Core's met state |
| Report of a wrong recipient | `ops.report_wrong_recipient` (`commands/incidents.ts:99-159`): names release and email records of one version, or business evidence outside the records; one disclosure incident per version (`dedupe_key = disclosure:<dov>`, `:126-128`, refusal `conflict_duplicate` with the existing incident); blocks the version for good (`:143`) and the artifact (`:144-151`); requires `correction` and one notice per recipient account and the owning travel agent (`:130-132, 141`); keeps the report's evidence apart from the incident's evidence (`:138, 140`) | The block is permanent: resolution does not unblock the file. The report's own evidence never counts as the correction |
| Disclosure notice | `ops.post_disclosure_notice` (`:162-196`): only for `wrong_recipient_disclosure` (else `not_found_or_forbidden`, `:172`); `deletion_request` only to a recipient of the released records, `disclosure_information` only to the owning travel agent (`:175-176`, refusal `input_invalid`/`not_affected` at `recipientAccountId`); one notice per account per incident (`:177`, `conflict_duplicate`); the notice carries `incidentId`, `variant`, up to 50 release references and the file type, never personal data (`:178-187`; `delivery/notices.ts:1-16`); a deletion request asks for an acknowledgement (`:186`) | One form per account that still needs its notice, with the variant Core accepts for that account. The preview uses the travel agent's own renderer |
| A SuperAdmin-opened disclosure | `ops.open_incident` with kind `wrong_recipient_disclosure` (`:314-323`): no file, no block, no recipients; with an application it requires `correction` and the owning travel agent's notice | The effect text says that no file is blocked (F-W14-14); the TA notice text must not claim a block (AM-W14-02) |
| Reviewer | `ops.assign_incident_reviewer` (`:338-368`): only while the case has no active assigned operator (`already_assigned`, `:349-356`); the reviewer is an active operator with MFA (`not_active_operator`, `:358`); the reviewer becomes owner and the state `assigned`; a later naming replaces the earlier reviewer. A reviewer reads the incident, works and resolves it, takes the review copy; no case action, no filing authority (`incidents.ts:6-23`) | The page states what a reviewer gets and that a replacement ends the earlier reviewer's access at once |
| Classification | `ops.classify_failure` (`:371-411`): scope `local` (a country unless the subject is an application), `shared` (an origin component and non-attestation evidence whose id or note names it, `:69-73, 398-400`), `unresolved`; a new classification supersedes the current one (`:80-81`); `operational_failure` and `country_defect` open with `unresolved` (`:324-328`). Result resource is the incidents queue, summary `classificationId`, `scope` (`:409`) | The incident read carries no classification (STOP-W14-05); the page links the incident's audit history |
| Resolve and close | Resolve needs every code met, counting the evidence sent with the resolution (`:240-246`; refusal `control_blocked`/`incident_evidence_insufficient` with `fieldErrors` per missing code). Close has no revision and takes an optional note (`:260-280`) | The resolve form MAY carry the evidence that completes `evidence` and `correction` (D-W14-10) |
| Release block | Open `wrong_recipient_disclosure` and `bytes_integrity` incidents block releases of their version, or with an application and no version, every version of the application (`incidents.ts:242-254`) | A SuperAdmin `bytes_integrity` incident on an application stops every release of it until resolved; the effect text says so |
| Lists | `ops.incidents` and `ops.admin_incidents` list only open incidents, oldest first, at most 500 (`store.ts:170-174`; `bindings:233-246`). Resolved incidents waiting for closure and closed incidents are in no list; per application, `ops.case_work.incidents` lists every state, at most 100 (`store.ts:160-166`) | A cap shows "500 or more"; the list says that resolved incidents are not listed (STOP-W14-03) |
| Document checks | `doc.queue` (`queries.ts:123-131`): versions whose check is exhausted, that carry a failure code, wait for an automatic scanner retry, or whose bytes are unavailable; the read stops at 200 rows (contract 500). `requeueable` = `scan`, `parse` or null (`:107-116`). `doc.requeue_check` needs the version's revision and the stage; refusal `stale_revision`, `requeue_not_applicable` (`requeue.ts:85-91`). `doc.requeue_bulk` takes up to `limit` (1–500) waiting checks, oldest first, skips any that no longer need it, refuses `nothing_to_requeue` (`:104-123`). Reasons 1–500 characters (`documents/commands/common.ts:12`) | Counts at the cap are "200 or more"; the bulk receipt states Core's counts only |
| Derived views | Six projectors (`vocabulary/views.ts:21`). `views.projections` judges each one in the read from committed state (`bindings/views.ts:118-124`; `health.ts:41-55`): healthy, or `never_run`, `rebuilding`, `degraded`, `failed`, `stale`, `lag`; `lagMs` is always a number. Privileged elevation waits for a healthy audit index; containment continues (`health.ts:1-11`). `views.monitors` is authoritative counts plus `pendingBoundary` with a projection `asOf` (`lagMs` null when never run, `case-queries.ts:280`); a null count means the counting module is not composed | LD-08 lag form; "Freshness unavailable" when the projection has no usable lag; unknown is never zero |

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14). "CW" = `ops.case_work` of the incident's application.

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| OP-08 | Incidents and follow-up | `/ops/incidents?view=&kind=&page=` | Kept, rebuilt (`ops.incidents.list`) | `ops.incidents` |
| OP-08i | Incident (operator) | `/ops/incidents/:incidentId` | Kept, rebuilt (`ops.incidents.detail`); hosts **Close** | `ops.incident`; opt. `core.ops_case` and opt. CW, only when `incident.application ≠ null` and `viewerIsReviewer = false` (today's `namesFor` rule, `incidents.ts:256-264`) |
| OP-08e | Record evidence | `/ops/incidents/:incidentId/evidence` (GET beside POST O37) | **New** (`ops.incidents.evidence_form`, action `incident.work`) | as OP-08i |
| OP-08n | Post a disclosure notice | `/ops/incidents/:incidentId/notices` (GET beside POST O49) | **New** (`ops.incidents.notice_form`, action `incident.work`) | as OP-08i |
| OP-08r | Resolve the incident | `/ops/incidents/:incidentId/resolve` (GET beside POST O38) | **New** (`ops.incidents.resolve_form`, action `incident.resolve`) | as OP-08i |
| OP-08w | Report a release to a wrong recipient | `/ops/applications/:applicationId/disclosure?version=` (GET beside POST O34) | **New** (`ops.incidents.disclosure_form`, action `incident.report_disclosure`) | `core.ops_case`; CW (required for the form); opt. `dlv.delivery_page` (releases, emails) |
| OP-08o | Open an incident (operator) | `/ops/applications/:applicationId/incidents/new`; form → POST `/ops/incidents` (O51) | **New** (`ops.incidents.open_form`, action `incident.open`) | `core.ops_case`; opt. CW (open incidents of the application) |
| SA-08 | Incidents | `/admin/incidents?view=&kind=&page=` | Kept, rebuilt (`admin.incidents.list`) | `ops.admin_incidents` |
| SA-08i | Incident (SuperAdmin) | `/admin/incidents/:incidentId` | Kept, rebuilt (`admin.incidents.detail`); hosts **Close** | `ops.incident`; opt. `core.admin_case` and opt. CW (same rule); opt. `ops.admin_incidents` (reviewer names only) |
| SA-08e, SA-08n, SA-08r | Record evidence; post a notice; resolve | `/admin/incidents/:incidentId/{evidence,notices,resolve}` (GET beside D124, D125, D126) | **New** (`admin.incidents.evidence_form`, `.notice_form`, `.resolve_form`) | as SA-08i |
| SA-08v | Name a reviewer | `/admin/incidents/:incidentId/reviewer` (GET beside D28) | **New** (`admin.incidents.reviewer_form`, action `incident.assign_reviewer`) | `ops.incident`; `ops.admin_incidents` (required: the operators to choose from); opt. `core.admin_case` |
| SA-08f | Classify the failure | `/admin/failures/incident/:incidentId/classify` (GET beside D75; `subjectType` = `incident` only, D-W14-11) | **New** (`admin.failures.classify_form`, action `failure.classify`) | `ops.incident`; opt. `cat.admin_index` (countries) |
| SA-08o | Open an incident (SuperAdmin) | `/admin/incidents/new?application=`; form → POST `/admin/incidents` (D116) | **New** (`admin.incidents.open_form`, action `incident.open`) | opt. `core.admin_case` and opt. CW (only with `application`); opt. `cat.admin_index` (countries) |
| SA-08h | Reporting health | `/admin/system/projections` | Kept, rebuilt (`admin.views.projections`) | opt. `views.projections`; opt. `views.monitors` (reporting gaps); opt. `doc.queue` (document checks count) |
| SA-08m | Monitors | `/admin/monitors` | Kept, rebuilt (`admin.monitors`; WP-06 §1.2 left it to WP-14) | `views.monitors` |
| (alias) | Monitoring queue | `/admin/queues/monitoring` | Kept path; answers 303 to `/admin/monitors#open` (Q-W14-07) | none |
| SA-08d | Document checks that could not finish | `/admin/documents/queue` | Kept, rebuilt (`admin.documents.queue`; CC-01) | `doc.queue` |
| SA-08c | Run one check again | `/admin/documents/:versionId/requeue` (GET beside D98) | **New** (`admin.documents.requeue_form`, action `document.requeue_check`) | `doc.queue` (the entry) |
| SA-08b | Run the waiting checks again | `/admin/documents/requeue` (GET beside D99) | **New** (`admin.documents.requeue_all_form`, action `document.requeue_check`) | `doc.queue` |
| SA-08a | Audit history (search) | `/admin/audit` | Kept, rebuilt (conformance, §2.14) | `views.audit_search` |
| SA-08s | Subject history | `/admin/audit/:subjectType/:subjectId` | Kept, rebuilt (conformance, §2.14) | `views.audit_subject` |
| SA-08q | Measures | `/admin/measures` | Kept, rebuilt in phase C, separable (Q-W14-08) | `views.measures`; opt. `cat.admin_index` |
| SA-01 | Decision inbox (WP-06 page) | `/admin` | Groups 10 and 16 amended (AM-W14-04) | as WP-06; opt. `doc.queue` added |

Each new GET route validates its ids (`zWireId('app')`, `zWireId('dov')`; `incidentId` as today, `z.string().max(40)`,
checked at Core, `incidents.ts:241`); a parse failure is the uniform 404. `resolve` returns the resource the POST
route on the same path returns (`incident`, `application`, `document_version`, queue `incidents`, queue `tasks`). The
static paths `/admin/incidents/new` and `/ops/applications/:applicationId/incidents/new` take precedence over the
parametric `/:incidentId` path (Fastify's router); a route test asserts it. OP-08n and SA-08n answer the uniform 404
when the incident is not of kind `wrong_recipient_disclosure` (Core answers the same for the command, `:172`).
SA-08f answers the uniform 404 for a `subjectType` other than `incident`. Query values (`view`, `kind`, `page`,
`version`, `application`) are enumerated or opaque ids (SH-R06); an unknown value is ignored.

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| OP-08, OP-08i, OP-08e, OP-08n, OP-08r | Operator: Incidents and follow-up `/ops/incidents` | "Incidents and follow-up › [kind words]" / "… › [kind words] › Record evidence" (› "Post a notice", › "Resolve") |
| OP-08w, OP-08o | Operator: My work `/ops/work` (as OP-02) | "My work › [applicant] › Report a release to a wrong recipient" / "› Open an incident" |
| SA-08, SA-08i, SA-08e, SA-08n, SA-08r, SA-08v, SA-08f, SA-08o | SuperAdmin: Incidents & audit, member "Incidents" `/admin/incidents` | "Incidents & audit › Incidents › [kind words] › [task]" |
| SA-08a, SA-08s | member "Audit" `/admin/audit` | "Incidents & audit › Audit history" / "… › [subject words]" |
| SA-08h | member "Reporting health" `/admin/system/projections` (label change, AM-W14-07) | "Incidents & audit › Reporting health" |
| SA-08d, SA-08c, SA-08b | member "Document checks" `/admin/documents/queue` (moved from Work queues, CC-01, AM-W14-07) | "Incidents & audit › Document checks" / "› [document reference]" / "› Run the waiting checks again" |
| SA-08q | member "Measures" | "Incidents & audit › Measures" |
| SA-08m | Home, member "Monitors" (WP-06 §1.3) | "Home › Monitors" |

The navigation counts do not change: `/ops/incidents` and `/admin/incidents` keep the `readerActsOn` rule
(`attention.ts:24-38`), which is the "Yours to act on" and "Needs a SuperAdmin" view of the lists (a tab and its
page agree, DESIGN). No new count is added for Document checks (one more `doc.queue` read per page view is not worth
it; SA-01 states the count).

### 1.5 The WP-14 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.report_wrong_recipient` | `ops.incidents.disclosure` (`/ops/applications/:applicationId/disclosure`) | **OP-08w** (moved from the case page, `case-work.ts:264-300`; after WP-07 from OP-02 Delivery & originals) | `documentVersionId` (hidden), `release.<n>` (checkbox, value `rls_…`), `email.<n>` (checkbox, value `eml_…`), `evidence.<n>.kind\|id\|note` (n = 0…4), `note` | — | §2.13 parsing; success `receiptLocation('/ops/incidents/<summary.incidentId>', 'reported', key)` (pattern `inc_`; else OP-08w); refusal re-renders OP-08w at the POST address, `restorePath` = OP-08w with `version` |
| 2 | `ops.post_disclosure_notice` | `ops.incidents.notice`, `admin.incidents.notice` (`/{ops,admin}/incidents/:incidentId/notices`) | **OP-08n**, **SA-08n** (moved from the incident page, `incidents.ts:181-188`) | `recipientAccountId` (hidden per form), `variant` (hidden, or radio when both apply, D-W14-05) | `incident` | success `receiptLocation('/<s>/incidents/<id>', 'notice', key)`; refusal re-renders the notice page |
| 3 | `ops.record_incident_evidence` | `ops.incidents.evidence`, `admin.incidents.evidence` | **OP-08e**, **SA-08e** (moved, `:189-194`) | `evidence.<n>.kind\|id\|note` (n = 0…4; at least one row), `note` | `incident` | as #2, code `evidence` |
| 4 | `ops.resolve_incident` | `ops.incidents.resolve`, `admin.incidents.resolve` | **OP-08r**, **SA-08r** (moved, `:195-200`) | `resolutionNote`, `evidence.<n>.*` (n = 0…4, optional) | `incident` | as #2, code `resolved` |
| 5 | `ops.close_incident` | `ops.incidents.close`, `admin.incidents.close` | **OP-08i**, **SA-08i** (stays, rebuilt, `:201-203`) | `note` (new on the form; existing contract input, D-W14-04) | — (Core takes none) | as #2, code `closed`; refusal re-renders the incident page |
| 6 | `ops.open_incident` (operator) | `ops.incidents.open` (`/ops/incidents`) | **OP-08o** (moved from the case page, `case-work.ts:407-415`; after WP-07 from OP-02) | `applicationId` (hidden), `kind` (radio), `note`, `evidence.<n>.*` (n = 0…4) | — | success `receiptLocation('/ops/incidents/<summary.incidentId>', 'opened', key)`; refusal re-renders OP-08o (today: shell, `incidents.ts:350`) |
| 7 | `ops.open_incident` (SuperAdmin) | `admin.incidents.open` (`/admin/incidents`) | **SA-08o** (moved from the list page, `incidents.ts:89-98`) | `kind` (radio), `applicationId` (hidden, only from the address context, D-W14-07), `countryId` (select from countries, D-W14-07), `note`, `evidence.<n>.*` | — | as #6 for `/admin/incidents/<id>`; refusal re-renders SA-08o (today: shell, `:360`) |
| 8 | `ops.assign_incident_reviewer` | `admin.incidents.reviewer` (`/admin/incidents/:incidentId/reviewer`) | **SA-08v** (moved, `:204-211`) | `reviewerAccountId` (radio), `reason` | `incident` | as #2, code `reviewer`; refusal re-renders SA-08v |
| 9 | `ops.classify_failure` | `admin.failures.classify` (`/admin/failures/:subjectType/:subjectId/classify`) | **SA-08f** (moved, `:212-221`) | `scope` (radio), `originComponent` (radio), `countryId` (select), `evidence.<n>.*` (n = 0…4), `reason` | — (Core takes none) | success `receiptLocation('/admin/incidents/<subjectId>', 'classified', key)`; refusal re-renders SA-08f (today: shell, `:372`) |
| 10 | `doc.requeue_check` | `admin.documents.requeue` (`/admin/documents/:versionId/requeue`) | **SA-08c** (moved from the queue rows, `pages/documents.ts:433-441`) | `stage` (hidden), `reason` | `version` | success `receiptLocation('/admin/documents/<dov>/requeue', 'requeued', key)`; refusal re-renders SA-08c (today: shell, `documents.ts:44`) |
| 11 | `doc.requeue_bulk` | `admin.documents.requeue_bulk` (`/admin/documents/requeue`) | **SA-08b** (moved from the queue page, `pages/documents.ts:489-503`) | `stage` (radio), `limit` (hidden, `500` as today), `reason` | — | success `receiptLocation('/admin/documents/queue', 'checks', key)` (today `?requeued=<n>`, `documents.ts:56`); refusal re-renders SA-08b |

Done codes: `reported`, `notice`, `evidence`, `resolved`, `closed`, `opened`, `reviewer`, `classified`, `requeued`,
`checks`. Each command has exactly one host page per surface, so a refusal always re-renders the page it came from.
`dlv.retrieve_for_review`, `ops.confirm_artifact_association` and `ops.reject_artifact_association` stay on OP-05r
(WP-08); OP-08i links to it. UI-PLAN §7 "Block document version" is `ops.report_wrong_recipient` (register note,
CMD-50): the report blocks the version; no separate block command exists. UI-PLAN "Assign incident owner" has no
Core command; "Name a reviewer" is the served assignment (§9.3 D-W14-15).

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Report a release to a wrong recipient (`case-work.ts:264-300`) | Operator case page; after WP-07 the OP-02 "Delivery & originals" tab (WP-07 §1.5 carried it there) | "Report a release to a wrong recipient" → OP-08w, shown when CW lists a result file not yet reported (`case-work.ts:267` rule); also from OP-05 (WP-08 §2.1 item 11, AM-W14-03) |
| Open an incident, operator (`case-work.ts:407-415`) | Same | "Open an incident" → OP-08o, under the case's incidents table |
| Open an incident, SuperAdmin (`incidents.ts:89-98`) | SuperAdmin incidents list | Primary button link "Open an incident" → SA-08o; from SA-04a with the application (AM-W14-05) |
| Evidence, notice, resolve, reviewer, classify (`incidents.ts:181-221`) | Both incident pages | Action panel and "Required to resolve" links → OP-08e/n/r, SA-08e/n/r/v/f |
| Confirm, reject, review copy (`incidents.ts:159-180`) | Incident page (WP-08 already moves them to OP-05r for the operator) | OP-08i: "Review the association" → OP-05r. SA-08i: no form (S-09), §2.3 item 8 |
| Row requeue and bulk requeue (`pages/documents.ts:433-441, 489-503`) | Documents queue | Row link "Run the check again" → SA-08c; primary button link → SA-08b |

Carried on WP-14 pages: none. After WP-14 no WP-14 form remains carried on any page (WP-07 §7.2 and WP-08 §7.2
carried-form tests drop their WP-14 entries).

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`,
`readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13
(operation status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage`, CMP-01 `actionPanel`,
`statusFacts`. WP-03 U0: CMP-11 `identityBand`. WP-07 U0: the OP-02 frame (`src/apps/staff/work/frame.ts`), CMP-20
`savedViewTabs`, the evidence-row block and its reader (`evidence.<n>.*`, n = 0…4). WP-08: OP-05, OP-05r, the TA
notice renderer (`disclosureBody`). WP-06 U1: SA-01. WP-09 U2: the unsent text block. Existing: `choiceGroup`,
`checkboxField`, `selectField`, `textareaField`, `dataTable`, `summaryList`, `checklist`, `identifier`, `timeAt`,
`disclosure`, `confirmDisclosure`.

New staff modules (no new `src/web/ui/` component): `src/apps/staff/incidents/words.ts` (closed word tables of §2.15
and §2.16), `src/apps/staff/incidents/blocks.ts` (incident table, required-items task list, disclosure block, action
panel mapping, owner words). The task list of §2.3 item 6 is the UX §7.4 "Task list": completeness comes from Core's
codes, never from a page score.

Dependency: WP-14 builds after WP-06 U1 (SA-01), WP-07 U0 and U2 (frame, OP-02 tabs), WP-08 (OP-05, OP-05r, TA-10n) and
WP-12 (OP-09 links to custody incidents) are integrated (PLAN §3 order). WP-14 MUST NOT build a second frame, decision
page, evidence-row reader or notice renderer.

### 1.8 Amendments to designed packages

Each binds the build of the named package if it is not built yet; otherwise the WP-14 unit named in §7.1 applies it.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W14-01 | WP-07 §2.5.3 Delivery & originals; §1.5 carried table | P1 | The carried report and operator open-incident forms are replaced by the two links of §1.6. The case's incidents table keeps its rows; each row links OP-08i (state words from §2.15) |
| AM-W14-02 | WP-08 §2.8 TA-10n disclosure body (`delivery/pages.ts:647-670`) | P1 | The notice text states only what the notice records (variant, file type, release references). `disclosure_information`: "[File type] of this application was released to an account that was not entitled to it. TravelMudra is handling the correction. A corrected result, when TravelMudra records one, appears on the application's delivery page." It MUST NOT say "The file is blocked" or "TravelMudra has asked the recipient to delete it": neither is a fact of the notice (F-W14-03). `deletion_request` keeps today's words (each one is the request itself). The staff preview (§2.6) uses the same function |
| AM-W14-03 | WP-08 §2.1 OP-05 item 11; item 7 Incident column | P2 | "Report a release to a wrong recipient" → OP-08w (`?version=<dov>` of that row). "Open the incident" → OP-08i (unchanged path) |
| AM-W14-04 | WP-06 §2.1 SA-01 groups 10 and 16 | P2 | Group 10 "Incidents": "Need a SuperAdmin: [n] incidents" (as WP-06) with link `/admin/incidents?view=superadmin`; "Open in total: [m] incidents"; from `views.monitors.incidents` (null → "Unavailable"): "Releases to a wrong recipient: [d] open", "Result files under review or missing: [a] open", "Custody incidents: [c] open; original parts with holder uncertain: [p]". Group 16 "Reporting gaps": link → SA-08h; new line from opt. `doc.queue`: "Document checks that could not finish: [k] documents" ("200 or more" at the read's cap; read unavailable → "Unavailable"), link SA-08d (Q-W14-09) |
| AM-W14-05 | WP-11 §2.1 SA-04a frame, secondary links | P2 | "Open an incident about this application" → `/admin/incidents/new?application=<id>` |
| AM-W14-06 | WP-07 §2.1 OP-01 Continuing duties | P2 | Row link target OP-08i unchanged; state and owner words from §2.15; the stale-owner interim line of §2.2 item 6 is not needed there (an operator never sees an incident of an ended assignment) |
| AM-W14-07 | WP-01 shell (`src/web/ui/shell.ts:146-190`; the architect applies the values) | P2 | SuperAdmin "Incidents & audit" members: Incidents, Audit, Reporting health (`/admin/system/projections`, label was "Derived views"), Document checks (`/admin/documents/queue`, moved from Work queues "Documents", CC-01), Measures. The "Documents" member leaves Work queues |

## 2. Page specifications

### 2.0 Rules common to every WP-14 page

- **Freshness (LD-08).** Incident reads, the documents queue, the monitors' counts and the subject history are
  authoritative: CMP-12 "Read at [time] IST". The audit search and the `pendingBoundary` line read projections: lag
  form "Up to date when read at [time] IST" / "Behind by [n] s when read at [time] IST" / "Freshness unavailable".
  SA-08h states each projection's lag form (§2.10). No page applies its own age threshold.
- **Page states.** S1: pages are rendered complete by the server. S6 and S7: the SH-02 pages of WP-01 (uniform 404
  without object facts; Core unreachable: "TravelMudra is unavailable now"; maintenance: the status document, A-09).
  Each page lists its own S2 to S5 states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders the block's own
  "[…] cannot be read now. Nothing is shown in its place." and never a zero, "None" or a success word. Every other
  refusal reaches the shell. A task page whose form needs a read (OP-08w needs CW; SA-08v needs the operators; SA-08c
  and SA-08b need `doc.queue`) keeps its frame and shows CMP-10 "This step cannot be prepared now: [what] cannot be
  read. Try again later. Owner: TravelMudra." with no form (WP-07 F-04 class: a block, a notice and a requeue have no
  undo).
- **Command results.** ACC: 303 to the receipt location of §1.5; CMP-08 first in `main`, its title first in the
  document title. A receipt names a result only when `core.operation` returns the expected resource and the summary
  test of §2.17; otherwise it is neutral ("Request recorded"; WP-06 D-02). Recorded facts come only from the
  operation summary and from records selected by the ids it returns; every later read is labelled "Current". REJ:
  the task page re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07
  focused, every typed value and choice kept (LD-17), sentences from §2.16. C5: CMP-14 (§2.18). UNR: 303 to
  `/<surface>/operations/<key>`; no new submission of the same intent is offered; `resultHrefOf` gives the incident
  page for an `incident` resource (`status-pages.test.ts:327`), the queue for a `queue` resource.
- **Access refusals.** `unauthenticated`, `not_found_or_forbidden`, `maintenance` and `unavailable_dependency` answers
  of a command reach the shell (`answer`, `shared.ts:514-525`): the typed values are lost and the page says nothing
  about the object (B10). Every other refusal re-renders.
- **K rules.** All eleven routes: K-STD. A form carries one `_op` from page load; a browser resend reuses it; a
  re-render after a refusal issues a new `_op` on every form of the page. `doc.requeue_bulk` is one command with
  counted results (no per-item `_op`).
- **Core decides.** A task page shows its form only when Core's offer on `ops.incident` is non-null and allowed
  (`recordEvidence`, `postNotice`, `resolve`, `close`, `assignReviewer`); blocked → the §2.16 sentence for the code as
  CMP-10 or a blocked callout; null → "Only the incident's owner or reviewer works it. You can read it." with no form.
  Two exceptions are facts mappings with a parity test (as WP-10 H-02): the resolve form when only `evidence` and
  `correction` are missing (D-W14-10), and classify (no offer exists; shown to a SuperAdmin for
  `operational_failure` and `country_defect`, as today). OP-08w and OP-08o show their forms when `viewerAssigned` is
  true (Core has no offer for them); Core decides at the command.
- **Names.** A page names an account only from a Core read that returns the name for this reader: the case's
  `names` (when the case is readable), the reviewers list (SuperAdmin), or "You". Any other account reads "An
  operator", "A travel agent account" or "An account" by the role Core states; never a raw reference in place of a
  name except the copyable `identifier` beside it.
- **Visibility and privacy.** A reviewer sees no applicant name, application link or case facts (Core returns
  `application = null` to a reviewer, `bindings:188`). No incident page shows a passport number. File names of
  queued documents are not shown (they may hold personal data, as today). The report's own evidence is not shown
  (Core does not return it).
- **No restore and no engineering steps (B39, B40; UX §6.3).** No WP-14 page shows a restore, reopen,
  reconstruction or rebuild control, or a server command. A recovery duty reads "Owner: engineering"; a policy
  boundary reads "Owner: product owner".
- **Support view and read grants.** `/ops` and `/admin` pages are not reachable in a support view (409
  `support_view_active`). A read-grant operator has no incident read.
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic"
  (CR-08). Forbidden on WP-14 pages: "recall", "recalled", "unsent", "retracted", "deleted" for a recipient's copy (a
  notice asks; it proves nothing), "Override", "Reopen", "Restore", "Rebuild", "Something went wrong", "All current"
  or "Nothing needs attention" while any value is unknown, "0" for an unknown count. All copy is draft (CR-09).
- **Mobile (< 768 px).** One column; tables stack into labelled rows. Task pages put scope and effect before the
  fields; the primary action is at the end of the form, never in a fixed bar (UX §7.3).

### 2.1 OP-08 Incidents and follow-up `/ops/incidents`

Purpose: work owned operational duties, including those of completed applications (UX §5.2; UI-PLAN OP-08).

1. Header: `h1` "Incidents and follow-up"; lead "Duties you own or review, and incidents about the applications
   assigned to you. An incident can stay open after its application completed."; freshness "Read at [time] IST".
2. Saved views (CMP-20, `view`): "Yours to act on" (`mine`, default: `readerActsOn`) and "About your applications"
   (`all`: every row of the read). Each with "[n] incidents", or "500 or more incidents" when the read holds 500
   rows.
3. Filter (GET, enumerated): "Kind" (`kind` ∈ the nine kinds, words of §2.15), "Apply", "Clear the filter".
4. Table (caption "Incidents", CMP queue table): Incident (kind words linking OP-08i; second line "what happened",
   `whatHappened`); Application (applicant and service linking OP-02 when Core named it; the reference when Core did
   not; "None" without an application); State (§2.15); Owner (§2.15 owner words); Still needed ("[n] items",
   "Ready to resolve"); Opened (time IST). Display paging 50 rows per page (`page`), over the one read (Q-W14-11).
5. Lines under the table: "Resolved incidents that wait to be closed are not listed here. Each application's page
   lists all its incidents." (STOP-W14-03.)

| State | Copy |
|---|---|
| S2 `mine` empty, `all` has rows | "Nothing is yours to act on now. [m] other incidents are about your applications." with the `all` link |
| S2 both empty | "No open incident is about your applications." |
| S3 kind filter, no row | "No open incident of this kind." and "Clear the filter" |
| Cap | Line "The list shows the oldest 500 open incidents. Others exist." |

### 2.2 SA-08 Incidents `/admin/incidents`

As OP-08 with these differences:

1. `h1` "Incidents"; lead "Every open incident, with its recorded owner. An incident can stay open after its
   application completed." Primary button link "Open an incident" → SA-08o.
2. Views: "Needs a SuperAdmin" (`superadmin`, default: `readerActsOn` with the SuperAdmin reader), "All open"
   (`all`).
3. Owner column header "Owner (as recorded)"; names from the reviewers list (active operators) or "An operator".
4. Application cell links SA-04a.
5. Line above the table (interim of STOP-W14-01): "An incident keeps the owner recorded when it was opened or last
   moved. If its application's assignment has ended, no operator holds it now: a SuperAdmin can work it."
6. Line under the table as OP-08 item 5.

### 2.3 OP-08i and SA-08i Incident `/{ops,admin}/incidents/:incidentId`

Purpose: one incident with its facts, what it still needs, and the next action (UX §6.1 "Resolve incidents and
degraded operations"; UI-PLAN OP-08 detail).

1. Header: breadcrumb; `h1` "[kind words]" and, when Core named the application, ": [applicant]"; meta: Reference
   (`identifier`, copy), Opened [time] IST by "You" / [name] / "TravelMudra (automatically)"; freshness.
2. Receipt (§2.17).
3. `h2` "Now" (`statusFacts`, each its own row): State (§2.15); Owner (owner words; "(reviewer)"); "You are the named
   reviewer" when `viewerIsReviewer`; Application (link, reference, or "None"); File (`identifier` of
   `documentVersionId`) when set.
4. Action panel (CMP-01) "Next step" — closed table, first match:

   | Condition (Core facts) | Owner line | Step and action |
   |---|---|---|
   | `state = closed` | — | "Closed [time] IST. Its records cannot change." No action |
   | `offers.close` allowed | the reader | "Close the incident" → item 12 |
   | `state = resolved`, `offers.close = null` | "[owner words]" | "Resolved [time] IST. Its owner closes it." |
   | missing `association_decision` | the reader when Core offers `confirmAssociation` | "Decide the result file's association" → OP-05r (operator); SA-08i: item 8 |
   | missing `notice:<acc>` and `offers.postNotice` allowed | the reader | "Post the notice to [name]" → OP-08n / SA-08n |
   | missing `correction` | the reader when Core offers work | "Record the correction" → OP-05 `#record-file` (operator owner or reviewer, WP-08 E-03) or "Record evidence" → OP-08e / SA-08e |
   | missing `evidence` | as above | "Record evidence of what was done" → OP-08e / SA-08e |
   | nothing missing, `offers.resolve` allowed | the reader | "Resolve the incident" → OP-08r / SA-08r |
   | every offer null | "[owner words]" | "Only the incident's owner or reviewer works it. You can read it." |

5. `h2` "What happened": `note` or the automatic sentence (`AUTOMATIC_NOTE`); "No note was recorded." otherwise.
   For a `wrong_recipient_disclosure`: "The evidence given with the report is kept with the report. It does not
   count as the correction."
6. `h2` "Required to resolve" (task list): one row per `requiredEvidence` code, in Core's order: label (§2.15),
   status "Recorded" / "Not recorded yet" (met = not in `missingEvidence`; for a resolved or closed incident every
   row is "Recorded"), and the link of item 4 for an unmet row the reader can work. Line: "TravelMudra checks every
   item again when the incident is resolved."
7. `h2` "The disclosure" (only `wrong_recipient_disclosure`):
   - "File": type and version reference; when CW reads and lists the artifact: Current "[type]: Blocked after a
     release to a wrong recipient. It is never released again." from the artifact's `eligibility = blocked`; when CW
     cannot be read: "The file's state cannot be read now."; when the incident names no file: "This incident names
     no file. No file was blocked by it." (a SuperAdmin-opened disclosure).
   - "Releases named in the report: [n]" and "Emails named in the report: [m]" with copyable references (Core's
     `affected`; at most 50 each).
   - "Accounts that must get a notice" (`dataTable`): one row per `notice:<acc>` code: Account (name or role
     words); Why ("Received the file" when in `recipientAccountIds`; "The application's travel agent" when it is
     `owningTaAccountId`; both lines when both); Notice ("Posted" / "Not posted yet").
   - "Notices posted: [k]".
   - CMP-10 (B-09): "Notices to the applicant, to a regulator or for legal purposes are not part of this release.
     They need separately authorized compliance work. Owner: product owner."
8. `h2` "Result file association" (only `artifact_association`):
   - Operator: "Association now: [CW association words]" when readable; link "Review the association" (OP-05r).
   - SuperAdmin (S-09): facts as above and the sentence "The application's operator, or a reviewer you name, decides
     the association on the association review. A SuperAdmin names a reviewer only while the application has no
     active operator." Link "Name a reviewer" → SA-08v when `offers.assignReviewer` is non-null (blocked → the
     `already_assigned` sentence). **No form.** No element posts to `/admin/incidents/:id/confirm-association` or
     `…/reject-association`.
9. `h2` "Failure classification" (SuperAdmin, `operational_failure` and `country_defect`): "Classify the failure" →
   SA-08f; "Earlier classifications are in this incident's history." → SA-08s `/admin/audit/incident/<id>`.
10. `h2` "Evidence recorded" (`dataTable`): Evidence (kind words), Reference (`identifier`), Note. Empty: "No
    evidence is recorded yet."
11. `h2` "Resolution" (resolved or closed): "Resolved [time] IST: [resolutionNote]"; "Closed [time] IST".
12. Close (only when `offers.close` is allowed; host of `ops.close_incident`): `h2` "Close the incident"; Effect
    (visible): "Closing ends every duty on this incident: its owner and any reviewer no longer hold it. A closed
    incident cannot be reopened."; "Closing note (optional)" (`note`, textarea, maxlength 2000); button "Close the
    incident" (secondary).
13. Secondary links: "Incidents" (the list); "The application" (OP-02 / SA-04a, when Core named it); SuperAdmin:
    "History of this incident" (SA-08s); custody kind: "Originals of this application" (OP-09, operator).

| State | Condition | Copy and controls |
|---|---|---|
| Not readable | `ops.incident` refused | Uniform 404 (SH-02) |
| Reviewer | `viewerIsReviewer` | Items 1–12 without application facts; line "You see this incident and its result file only. You have no other action on the application." |
| Case facts unavailable | opt. reads unavailable | Names read "An account"; item 7 file line and item 8 "Association now" read "cannot be read now" |
| Closed | `state = closed` | Items 1–3, 5–7, 9–11; no task links |
| Resolved | `state = resolved` | Items 1–11; item 12 when offered |
| Open | otherwise | Items 1–10, 13 |
| C2, C5 (close) | §2.16 | Re-render at the POST address; the note kept |

### 2.4 OP-08w Report a release to a wrong recipient `/ops/applications/:applicationId/disclosure`

Purpose: report that one result file reached an account that was not entitled to it, so TravelMudra blocks it and
records whom to inform (UX §6.1; BS B13 "On confirmed wrong-recipient disclosure, block/noncurrent the version,
preserve known retrieval/recipients, assign correction and truthful notices"). CMP-25 order.

1. OP-02 frame items 1–5 (WP-07 §2.3); `h1` "Report a release to a wrong recipient: [applicant]".
2. `h2` "Scope": "One result file of this application that reached an account or a person who should not have it.
   Report it as soon as you know." Files: CW artifacts not yet reported (no `wrong_recipient_disclosure` incident of
   the same `documentVersionId` in CW's incidents, today's rule `case-work.ts:267`). One file: shown as text with
   hidden `documentVersionId`. Several: GET form "Choose the file" (radio `version`, values from CW only, none
   preselected; button "Continue"); the report form appears after the choice. Already reported files: "Already
   reported: [type] — Open the incident" (OP-08i).
3. `h2` "Evidence: the releases of this file" (opt. `dlv.delivery_page`): fieldset "Releases and emails that went to
   a wrong recipient (choose those that apply)": `release.<n>` per allowed release that is not a review copy
   ("[time] IST: Single download / In a ZIP to [name] (travel agent)"; hint "Requested by [name] · [reference]"),
   `email.<n>` per sent email ("[time] IST: email to [name]'s account address"). Read unavailable: "The releases of
   this file cannot be read now. Report a disclosure outside the delivery records with its evidence below, or try
   again later." None: "No release or email of this file is recorded."
4. `h2` "Evidence outside the delivery records": evidence rows (n = 0…4; Core accepts 5), lead "Your own email, a
   handover or another route outside TravelMudra's delivery records: give a reference or a document. A statement
   alone is not enough."
5. "What happened" (`note`, textarea, required, maxlength 2000), hint "Who received it, how you know, and when."
6. `h2` "Effect" (visible): "When you report: TravelMudra opens a disclosure incident that you own and blocks this
   file for good. It is never released again, also not to this application's travel agent. The delivery records
   stay as they are; nothing is recalled. TravelMudra records which accounts must get a notice: each account the
   chosen releases went to (a request to delete it) and this application's travel agent (information). You post
   each notice from the incident. The incident is resolved after the correction and every notice."
7. Review (visible): "Your name, the time, the releases you chose and your evidence are recorded."
8. Button "Report and block the file" (destructive variant, DESIGN); "Cancel" → OP-02 `?tab=delivery`.

States (first match): not assigned or read grant ("Only the assigned operator reports a release of this
application."; no form); CW unavailable (§2.0 notice, no form); no result file ("This application has no result
file to report."); every file reported ("Every result file of this application is already reported." with links);
choose file (item 2 GET form only); open (items 1–8); C2 (§2.16, values and checks kept); C3 (303 to OP-08i of the
new incident).

### 2.5 OP-08e and SA-08e Record evidence `/{ops,admin}/incidents/:incidentId/evidence`

1. Incident frame (items 1 and 3 of §2.3); `h1` "Record evidence: [kind words]".
2. `h2` "Scope": "Evidence of what was done about this incident. It is added to the incident and cannot be
   removed."
3. `h2` "Evidence": the "Required to resolve" list (§2.3 item 6) and "Evidence recorded" (§2.3 item 10), so the
   reader sees what is there before adding the same again.
4. Evidence rows (n = 0…4; at least one row; Core accepts 1–10); kind options as the WP-07 block (External
   reference; Document of this group; Recorded fact; My statement).
5. "Note (optional)" (`note`, maxlength 2000).
6. `h2` "Effect": "A reference or a document counts toward 'Evidence of what was done' and toward 'The correction'.
   Your statement alone counts toward neither. TravelMudra counts any reference or document recorded here as the
   correction: record only evidence that shows it." (STOP-W14-08.)
7. Hidden `_rev.incident`. Button "Record the evidence"; "Cancel" → incident page.

States: not open ("This incident is [resolved/closed]. Evidence is no longer added."; no form); offer null (§2.0);
open; C2; C5.

### 2.6 OP-08n and SA-08n Post a disclosure notice `/{ops,admin}/incidents/:incidentId/notices`

Purpose: post the truthful notice each affected account must get (BS B13 "truthful notices to affected TAs; request
deletion without claiming recall").

1. Incident frame; `h1` "Post a notice: [kind words]".
2. `h2` "Scope": "One notice to each account that must get one. A notice cannot be changed or withdrawn after it is
   posted."
3. `h2` "Accounts that must get a notice": the table of §2.3 item 7, with one action per account whose notice is
   not posted (`notice:<acc>` in `missingEvidence`), each its own form (one `_op` each) with hidden
   `recipientAccountId` and `_rev.incident`:
   - The account received the file only: hidden `variant` = `deletion_request`; button "Ask [name] to delete it".
   - The account is the application's travel agent only: hidden `variant` = `disclosure_information`; button
     "Inform [name]".
   - Both: radio `variant` (none preselected): "Ask them to delete it (they received the file)" /
     "Inform them (they are the application's travel agent)", hint "They get one notice for this incident. Choose
     the request to delete it when they hold a copy."; button "Post the notice".
   - An account whose notice is posted: "Posted"; no form.
4. Under each form: `h3` "What [name] will read" — the travel agent's notice body rendered by the WP-08 TA-10n
   function (`disclosureBody`, with AM-W14-02) from the would-be parameters: the variant, the artifact type (CW, when
   readable), and the release references of `affected.releaseIds`.
5. `h2` "Effect": "TravelMudra posts the notice to the account's Notices. A request to delete it asks them to delete
   every copy and to acknowledge it. The notice never says that the file was recalled."
6. CMP-10 B-09 as §2.3 item 7.

States: not a disclosure (404); not open ("This incident is [state]. No notice is posted now."); every notice posted
("Every account that must get a notice has one." with the table); offer null or blocked (§2.0); C2; C5.

### 2.7 OP-08r and SA-08r Resolve the incident `/{ops,admin}/incidents/:incidentId/resolve`

1. Incident frame; `h1` "Resolve: [kind words]".
2. `h2` "Scope": "This incident only. A resolved incident is then closed by its owner."
3. `h2` "Evidence": "Required to resolve" (§2.3 item 6) and "Evidence recorded".
4. Missing items other than `evidence` and `correction` (a notice, the association decision): no form; CMP-10-style
   list "Cannot be resolved yet:" with one line and link per missing item (§2.3 item 4 targets). Missing only
   `evidence` and/or `correction` (D-W14-10): the form with the line "Add a reference or a document that shows [what
   was done / the correction] below. It is recorded with the resolution."; evidence rows then required.
5. "How it was resolved" (`resolutionNote`, required, maxlength 2000); evidence rows (n = 0…4, optional unless item 4
   says so).
6. `h2` "Effect" (by kind, from Core facts): every kind: "TravelMudra records the resolution with your note and
   evidence. Your name and the time are kept." `wrong_recipient_disclosure`: "+ The file stays blocked for good."
   `bytes_integrity`: "+ Releases this incident held may run again; each release is checked again first."
   `custody_discrepancy`: "+ The custody records do not change. A part whose holder is uncertain stays uncertain
   until a custody change records its holder."
7. Hidden `_rev.incident`. Button "Resolve the incident"; "Cancel".

States: not open ("This incident is already [resolved at [time] IST / closed]."; no form; link to the incident);
offer null; blocked with a non-evidence code (item 4 list); open; C2 (missing codes named, §2.16); C5.

### 2.8 SA-08v Name a reviewer `/admin/incidents/:incidentId/reviewer`

Purpose: give the incident a scoped reviewer while the application has no active operator (BS B13; UX §5.3).

1. Incident frame; `h1` "Name a reviewer: [kind words]".
2. `h2` "Scope": "A reviewer is an active operator who works this incident while its application has no active
   operator. A reviewer reads this incident and, for a result file, takes a review copy and decides its association.
   A reviewer gets no other action on the application and no filing authority."
3. `h2` "Evidence": Owner now (as recorded); Reviewer now ("[name]" or "None"); Application and its operator line
   from opt. `core.admin_case` ("No operator assigned" / "[name] (not active)").
4. "Reviewer" (`reviewerAccountId`, radio of `ops.admin_incidents.reviewers`, none preselected; the current reviewer
   marked "(reviewer now)"). Hint "Only active operators who use an authenticator are listed."
5. "Reason" (`reason`, textarea, required, 10–1000 characters, hint "At least 10 characters.").
6. `h2` "Effect": "The reviewer owns this incident from now on. When an operator is assigned to the application, the
   incident moves to that operator and the reviewer's access ends." With a current reviewer: "+ [name] loses access
   to this incident and its result file at once."
7. Hidden `_rev.incident`. Button "Name the reviewer".

States: no application or no active operator (open); `already_assigned` ("A reviewer is named only while the
application has no active operator. Its operator owns this incident."; no form); not open; reviewers unavailable
(§2.0, no form); no operator listed ("No active operator with an authenticator exists. A reviewer cannot be named
now. Owner: TravelMudra."); C2; C5.

### 2.9 SA-08f Classify the failure `/admin/failures/incident/:incidentId/classify`

1. Incident frame; `h1` "Classify the failure: [kind words]".
2. `h2` "Scope": "Whether this failure is local to one country, comes from a shared component, or is not known yet.
   A new classification replaces the current one; earlier ones stay in the history."
3. `h2` "Evidence": the incident's evidence; link "Earlier classifications" (SA-08s).
4. "Scope" (`scope`, radio, none preselected): "Local to one country" (`local`); "From a shared component"
   (`shared`); "Not known yet" (`unresolved`).
5. "Country, only for a local failure" (`countryId`, select from `cat.admin_index.countries`, placeholder "Choose";
   unavailable: text field "Country reference" with hint `cty_…`).
6. "Shared component, only for a shared failure" (`originComponent`, radio of the eight components, words §2.15).
7. Evidence rows (n = 0…4), lead "For a shared failure, give a reference or a document whose reference or note names
   the component, for example 'upload'. A shared server or a shared outage alone does not make a failure shared."
8. "Reason" (`reason`, 10–1000 characters).
9. `h2` "Effect": "TravelMudra records the classification with your reason and evidence. It changes no application."
10. Button "Record the classification". No revision (Core takes none).

States: kind not `operational_failure`/`country_defect` (404 for the GET; Core still accepts a post); not open
("This incident is closed. Its classification does not change." — Core accepts it for a closed incident; the page
does not offer it, D-W14-11); open; C2.

### 2.10 OP-08o and SA-08o Open an incident

OP-08o `/ops/applications/:applicationId/incidents/new`:

1. OP-02 frame; `h1` "Open an incident: [applicant]".
2. `h2` "Scope": "An incident about this application that you own while you are its operator."
3. `h2` "Open incidents of this application" (opt. CW, open states): kind, opened time, link; "None." / "cannot be
   read now". Line: "Opening the same incident again creates a second one."
4. "Kind" (`kind`, radio, none preselected), each with its hint: Operational failure ("Work stopped because a step
   or a system failed. A SuperAdmin classifies it later."); Original's whereabouts uncertain ("To record that a
   part's holder is uncertain, record a custody change on the original instead; that opens this incident with the
   part." link OP-09); Correction after filing ("A correction after filing; the filed facts do not change.").
5. "What happened" (`note`, required, 2000); evidence rows (optional).
6. `h2` "Effect": "TravelMudra opens the incident. You own it while you are this application's operator. It needs
   evidence of what was done before it can be resolved. It changes nothing on the application."
7. Hidden `applicationId`. Button "Open the incident".

SA-08o `/admin/incidents/new` (optional `application`):

1. `h1` "Open an incident"; with an application: frame line "About: [applicant] · [service] · Application
   [reference]" (opt. `core.admin_case`); without: "This incident is about no application. To open an incident about
   one application, start from that application's page."
2. Open incidents of the application (as OP-08o item 3) when one is named.
3. "Kind" (radio; the kinds of §2.15 without `artifact_association`, Q-W14-03), each with its effect hint (§2.15
   effect table).
4. "Country, for a country rule defect" (`countryId`, as SA-08f item 5).
5. "What happened"; evidence rows.
6. `h2` "Effect": "TravelMudra administration owns the incident: any SuperAdmin works it. The application's operator
   can read and work it too." + the effect of the chosen kind (§2.15), shown for every kind in its hint (no script
   needed).
7. Hidden `applicationId` only with an application. Button "Open the incident".

States (both): not assigned (OP-08o; no form); application not readable (SA-08o with a refused `core.admin_case`:
shell, LD-14); C2; C3 (303 to the new incident).

### 2.11 SA-08h Reporting health `/admin/system/projections`

Purpose: show whether the derived views, the reporting measures and the document checks are current, without
fabricated zero or success (UI-PLAN "Reporting health read model"; UX §6.2 "diagnostic/reporting degradation"; BS
B33, B38).

1. `h1` "Reporting health"; lead "Lists, search, the audit index and measures are copies of the records. They never
   decide access or control a case. When one is behind, its pages say so. Commands that read the records themselves
   continue. Privileged changes (account approvals, grants, support views, administrative file access) wait for the
   audit index." Freshness "Read at [time] IST".
2. `h2` "Derived views" (opt. `views.projections`):
   - Summary line: "[u] of [t] derived views are not up to date: [names]" or, only when every judgement is healthy,
     "Every derived view was up to date when read at [time] IST." Read unavailable: "The state of the derived views
     cannot be read now. Nothing is shown in its place." (no summary, no table).
   - Table: View (title and purpose); State (§2.15 projection words); Freshness ("Up to date when read at [time]
     IST" when healthy; "Behind by [n] s when read at [time] IST" for `lag` and `stale`; "Freshness unavailable" for
     `never_run`, `rebuilding`, `degraded`, `failed`); Current to ("Entry [n]" / "No entries yet"); Entries projected
     (the state row's count; no row → "Not recorded", never 0, F-W14-08); Not projected ([gapCount] facts); Last run
     (time IST / "Never").
   - Per view not up to date, CMP-10: what it means by view (audit index: "Audit search shows entries up to entry
     [n]. Privileged changes are refused until it is up to date. Containment stays available."; applications,
     assignment queue, history, follow-up, wait intervals: "Lists and counts based on it say they may be out of date.
     Commands are not affected."); "Last problem: [code words]"; "Owner: engineering." No server command (F-W14-09).
   - Disclosure "Facts not projected" (gaps, up to 200; "200 or more" at the cap).
3. `h2` "Reporting gaps" (opt. `views.monitors.reportingGaps`): "Measures with cases missing a value: [n]";
   "Measures with no data source yet: [n]"; link "Measures" (SA-08q).
4. `h2` "Document checks" (opt. `doc.queue`): "Documents waiting for a check that could not finish: [k]" ("200 or
   more"); "Malware scanner: [words]"; "File reader: [words]"; link SA-08d.

No control on this page. Mobile: tables stack.

### 2.12 SA-08m Monitors `/admin/monitors` (and the monitoring queue path)

1. `h1` "Monitors"; lead "Counts that may need a SuperAdmin, read from the records now. A count that cannot be read
   shows Unavailable, never 0."; freshness "Read at [time] IST" (`computedAt`).
2. `h2` "Open now" (`id="open"`): every count > 0, as today's monitoring queue table (What, Area, Open, Where to act).
   Below it: "Unavailable: [labels]" when any count is null. No success callout while any count is null (F-W14-07);
   when every count is known and zero: "Nothing monitored is open now."
3. One `h2` per area with every count (today's items, `cases.ts:221-255`), unit words ("[n] items", "[n]
   applications", "[n] incidents"); "None" for a known zero; "Unavailable" for null.
4. `h2` "Waiting on a step that is not available in this release" (LD-04, replaces F-W06-09's "no product trigger"):
   "Sending the result and requesting completion are the assigned operator's explicit steps. They are not available
   in this release. [n] applications wait on a result send and [m] on a completion request." + the lag line of
   `pendingBoundary.asOf`. Owner: product owner.
5. `/admin/queues/monitoring` answers 303 to `/admin/monitors#open` (Q-W14-07; the route stays, its handler and
   action unchanged; `views.monitoring_queue` is then unused and stays on the allowlist).

### 2.13 SA-08d, SA-08c, SA-08b Document checks (CC-01)

SA-08d `/admin/documents/queue`:

1. `h1` "Document checks that could not finish"; lead "Documents whose malware scan or content check ended without a
   result. Their files stay in quarantine and nothing passes without a check."; freshness.
2. Receipt `checks` (§2.17).
3. `h2` "Checking facilities now" (as today, words of §2.15; `unknown` → "Not known").
4. Primary button link "Run the waiting checks again" → SA-08b, when any entry is `requeueable`.
5. `h2` "Waiting documents": count line "[n] documents wait" ("200 or more documents wait; the oldest 200 are shown"
   at the read's cap). Table: Document (purpose words, `identifier`); Travel agent and group (name or reference;
   group reference); Waiting for ("Malware scan" / "Content check" / "Automatic retry of the scanner" / "The stored
   file is missing or altered: a check cannot run"); Problem (failure or unavailable-cause words); Received (time
   IST); Action ("Run the check again" → SA-08c when `requeueable`; "None needed now" otherwise). Caption line: "File
   names are not shown: they can hold personal data."
6. Empty: "No document waits for a check now." (never "Every document finished its checks").

SA-08c `/admin/documents/:versionId/requeue`:

1. `h1` "Run the check again: [purpose words] [reference]"; receipt `requeued`.
2. `h2` "Scope": "This document only: [purpose words], travel agent [name], group [reference], received [time] IST."
3. `h2` "Evidence": Waiting for; Problem; Checking facilities now (scanner, file reader). When the facility the
   stage needs does not answer: warning "The [malware scanner / file reader] does not answer now. The check would
   wait again."
4. "Reason" (`reason`, textarea, required, 1–500 characters), hint "For example: the scanner is back after
   maintenance."
5. `h2` "Effect" by stage: scan "The malware scan runs again. The file stays in quarantine until it passes. Nothing
   passes without it."; parse "The content check runs again. If the file already passed its safety check, only the
   reading of its details runs again."
6. Hidden `stage` (the entry's `requeueable`) and `_rev.version` (the entry's revision). Button "Run the check
   again".

States: not in the queue ("This document does not wait for a check now." Current waiting state when listed;
no form); listed but not requeueable ("[waiting words]. It cannot be sent again now."); read unavailable (§2.0);
open; C2; C5; C3 (receipt on this page).

SA-08b `/admin/documents/requeue`:

1. `h1` "Run the waiting checks again".
2. `h2` "Scope": "Malware scans waiting: [s]; content checks waiting: [p]" (from the read; "or more" at the cap).
   "TravelMudra takes the oldest waiting checks first, up to its limit for one request. Run it again for the
   rest."
3. Facilities (as SA-08c item 3, for both).
4. "Checks" (`stage`, radio, none preselected): "Every waiting check" (`all`); "Malware scans only" (`scan`);
   "Content checks only" (`parse`).
5. "Reason" (as SA-08c).
6. `h2` "Effect": "Each chosen document goes through the same check again. Its file stays in quarantine until it
   passes. A document whose check is already running is left out."
7. Hidden `limit` = `500`. Button "Run the waiting checks again".

States: nothing requeueable ("No document waits for a check that can be sent again now."; no form); read unavailable;
open; C2 (`nothing_to_requeue`, §2.16); C3 (303 to SA-08d with the receipt).

### 2.14 SA-08a, SA-08s, SA-08q Audit and measures (conformance)

The pages keep their paths, query fields and contents (`views/pages.ts:94-360` audit, `:362-500` measures). Changes:

- SA-08a freshness: the audit index line in the LD-08 lag form (healthy → "Up to date when read at …"; `lag`,
  `stale` → "Behind by [n] s when read at …"; otherwise and when `judgement = null` → "Freshness unavailable"); meta
  "Searchable up to entry [n]". The index notice keeps its consequence sentences and links SA-08h; its "View
  projection status" becomes "Reporting health".
- SA-08a empty states: when the index is not up to date, the no-match state adds "Entries recorded after entry [n]
  are not searchable yet." (as today) and never "Nothing recorded yet".
- SA-08a rows show recorded time and, when present, event time ("Happened [time] IST"), and the "Retrospective" mark
  (UX §6.2 "event and recorded times").
- SA-08s is read from the fact log (authoritative): "Read at [time] IST".
- SA-08q (phase C, separable): units on every count, "Not enough cases" below the minimum sample, missing values never
  0 (`n`, `nMissing`), "Computed at [time] IST from entries up to [n]".

### 2.15 Closed word tables (`incidents/words.ts`)

Kind words (today's `INCIDENT_KIND_LABELS`, kept): "Result file needs review", "Result file missing or wrong",
"Released to a wrong recipient", "Stored file damaged or missing", "Operational failure", "Country rule defect",
"Original's whereabouts uncertain", "Official fact after an unresolved outcome", "Correction after filing".

State words: `open` "Open"; `assigned` "With a reviewer"; `awaiting_evidence` "Waiting for evidence"; `resolved`
"Resolved: waiting to be closed"; `closed` "Closed". Unknown value: "Reference code: [code]".

Owner words: `superadmin` or no account → "TravelMudra administration"; the reader → "You"; a known name → the name;
otherwise "An operator"; `reviewer` adds " (reviewer)".

Required item words: `evidence` "Evidence of what was done: a reference or a document"; `association_decision` "The
result file's association is decided (confirmed or rejected)"; `correction` "The correction: a replacement result
file verified for this application, or a reference or document that shows the correction"; `notice:<acc>` "A notice
to [name or 'an affected account']"; other "Reference code: [code]".

SuperAdmin kind effect (SA-08o hints; Core facts):

| Kind | Effect sentence |
|---|---|
| `artifact_missing_or_wrong`, `post_filing_correction`, `official_fact_follow_up` | "It needs evidence of what was done before it can be resolved." |
| `operational_failure` | "+ TravelMudra records the failure as not classified yet. Classify it on the incident." |
| `country_defect` | "+ Name the country. TravelMudra records the failure as not classified yet." |
| `bytes_integrity` | With an application: "While it is open, no file of this application is released: downloads, ZIPs and review copies are refused." Without: "It blocks no file: it names no application." |
| `wrong_recipient_disclosure` | "It blocks no file and names no recipient. To block a released result file, the application's operator reports the release from the file. With an application, the application's travel agent must be informed before it is resolved." |
| `custody_discrepancy` | "It changes no custody record. To record that a part's holder is uncertain, the operator records a custody change." |

Projection words: healthy "Up to date"; `lag`, `stale` "Behind"; `rebuilding` "Being rebuilt"; `degraded` "Facts
not projected"; `failed` "Failing"; `never_run` "Never run". Facility words: `up` "Answering now"; `down` "Not
answering"; `unknown` "Not known". Shared components: passport "Passport reading", upload "Upload", authentication
"Sign-in", payment_check "Payment check", configuration "Configuration", kernel "Core platform", worker_runner "Task
runner", database "Database".

### 2.16 Refusal sentences (closed table)

Category plus code selects the sentence; `fieldErrors` select by field. Existing `CORE_MESSAGES` entries stay unless
listed.

| Form | Category / code (field) | Sentence | Where |
|---|---|---|---|
| report | `control_blocked` / `incident_evidence_insufficient` | "Choose at least one release or email of this file that went out, or give a reference or a document of a disclosure outside the delivery records. A statement alone is not enough. Nothing was recorded." (today's `DISCLOSURE_MESSAGES`) | releases fieldset |
| report | `conflict_duplicate` / `duplicate_operation` | "This file is already reported. Nothing new was recorded." + "Open the incident" when `existing` names one | form-level |
| notice | `input_invalid` (`recipientAccountId`: `not_affected`) | "This account cannot get that kind of notice. Choose the other kind." | `variant` |
| notice | `conflict_duplicate` / `duplicate_operation` | "A notice to [name] is already posted for this incident. Nothing new was posted." | the account's form |
| evidence, resolve | `input_invalid` (`evidence`: kind or id codes) | WP-07 evidence-row sentences | the row |
| resolve | `control_blocked` / `incident_evidence_insufficient` (`requiredEvidence`: codes) | "The incident cannot be resolved yet. Still needed: [item words of each code]." with the item links | form-level |
| every incident form | `control_blocked` / `incident_not_open` | "This incident is no longer open: it is [state words] ([time] IST). Nothing was recorded." | form-level |
| close | `control_blocked` / `incident_not_open` | "This incident is not resolved, or it is already closed. Nothing changed." | form-level |
| reviewer | `control_blocked` / `already_assigned` | "The application now has an active operator, who owns this incident. A reviewer is no longer named. Nothing changed." | form-level |
| reviewer | `input_invalid` (`reviewerAccountId`: `not_active_operator`) | "That operator is not active or does not use an authenticator now. Choose another." | `reviewerAccountId` |
| reviewer, classify | `validation_failed` (`reason`) | "Give a reason of at least 10 characters." | `reason` |
| open | `input_invalid` (`kind`: `not_operator_openable`) | "Operators open only an operational failure, an original's whereabouts uncertain or a correction after filing." | `kind` |
| open, classify | `input_invalid` (`countryId`: `required`) | "Choose the country." | `countryId` |
| classify | `input_invalid` (`originComponent`: `required` / `not_applicable`) | "Choose the shared component." / "Leave the shared component empty unless the failure is shared." | `originComponent` |
| classify | `control_blocked` / `failure_scope_evidence_missing` | "For a shared failure, give a reference or a document whose reference or note names the component." | evidence |
| requeue one | `control_blocked` / `requeue_not_applicable` | "This document does not need this check now: [current waiting words]. Nothing was sent again." | form-level |
| requeue all | `control_blocked` / `nothing_to_requeue` | "No document waits for that check now. Nothing was sent again." | `stage` |
| requeue | `validation_failed` (`reason`) | "Give a reason (up to 500 characters)." | `reason` |
| every form | `stale_revision` | CMP-14 (§2.18) | — |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden`, `unauthenticated`, `maintenance`, `unavailable_dependency` | Shell (§2.0) | — |
| every form | unknown code | Category text + "Reference code: [code]" | form-level |

### 2.17 Receipt facts per command (CMP-08)

| Done | Host | Expected resource | Summary test | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|
| `reported` | OP-08i | `incident`, path id | `incidentId` equals path id; `applicationId` matches `^app_` | "Release to a wrong recipient reported" | "Incident [reference]" | File state from CW (§2.3 item 7); "Required to resolve" |
| `opened` | OP-08i, SA-08i | `incident`, path id | `incidentId` equals path id; no other key | "Incident opened" | "Incident [reference]" | State, owner, required items |
| `notice` | OP-08i, SA-08i | `incident`, path id | `noticeId` matches `^ntc_` | "Notice posted" | "Notice [reference]" | Accounts that must get a notice |
| `evidence`, `resolved`, `closed`, `reviewer` | OP-08i, SA-08i | `incident`, path id | `incidentId` equals path id; no other key | "Request recorded" (neutral: Core's summary is the same for the four commands, WP-06 D-02, S-08) | — | State; evidence count; resolution; reviewer |
| `classified` | SA-08i | queue `incidents`, no id | `classificationId` matches `^fcl_`; `scope` ∈ `FAILURE_SCOPES` | "Classification recorded" | "Scope: [scope words]" | — (no read, STOP-W14-05) |
| `requeued` | SA-08c | `document_version`, path id | `versionId` equals path id | "Request recorded" (neutral: the summary is shared by other document commands) | — | "Waiting for: [words]" or "Not waiting for a check now" |
| `checks` | SA-08d | queue `tasks`, no id | `requeued`, `scan`, `parse` are whole numbers and `scan + parse = requeued` | "Checks sent again" | "[requeued] documents: [scan] malware scans, [parse] content checks" | The queue as read now |

No receipt shows an accepted time or a command name (P-02, P-10 b pending; S-08 switches the neutral titles). A
receipt whose check fails reads unchecked (WP-01 A-04). The receipt facts never come from the address alone: the
`requeued=<n>` flash of today (`documents.ts:56`) goes.

### 2.18 Stale revision (CMP-14) per form

| Form | Guard | Rows (yours / current) |
|---|---|---|
| Evidence, notice, resolve, reviewer | `_rev.incident` | State; Owner; Reviewer; Still needed; Notices posted. Typed note, reason and evidence stay when the form still applies |
| Requeue one | `_rev.version` | Waiting for (you saw / now); the reason stays |
| Close, open, classify, report, requeue all | none | Not CMP-14 |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

### 2.19 Input parsing in the handlers (LD-17)

Every field is read whole. Input over a limit is refused at its field with every value kept; the command is not sent.

| Field | Rule | BFF refusal (field) |
|---|---|---|
| `note`, `resolutionNote` | trim; `note` (open, report) 1–2000; `note` (evidence, close) empty → left out, ≤ 2000; `resolutionNote` 1–2000 | "Up to 2000 characters." / "Say what happened." |
| `reason` (reviewer, classify) | trim; 10–1000 | "Give a reason of at least 10 characters (up to 1000)." |
| `reason` (requeue) | trim; 1–500 | "Give a reason (up to 500 characters)." |
| `release.<n>`, `email.<n>` | every indexed field (any digits); value `^rls_[0-9A-Z]{26}$` / `^eml_[0-9A-Z]{26}$`; at most 50 each | "Choose at most 50 releases and 50 emails in one report." / "'[value]' is not a release reference." |
| `evidence.<n>.*` | every indexed row; a row with empty kind and id is left out; more than Core's limit (5 report; 10 elsewhere) → refused | "Give at most [k] pieces of evidence." |
| `recipientAccountId`, `reviewerAccountId` | `zWireId('acc')` | "Choose an account." |
| `variant`, `kind`, `scope`, `originComponent`, `stage` | sent as posted when non-empty (Core checks the closed set); empty → field refusal | "Choose one." |
| `countryId` | `zWireId('cty')` when non-empty | "Choose a country." |
| `applicationId` (open) | `zWireId('app')` when present | form-level (shell for a forged value) |
| `documentVersionId` | `zWireId('dov')` | form-level |
| `limit` | sent as posted (Core checks 1–500) | — |

Current code that this replaces: `f()` slices every incident field (`incidents.ts:244`); `chosen()` keeps 50 values of
40 characters (`case-work.ts:452-453`); the requeue handlers slice `stage` and `limit` (`documents.ts:42, 53`);
`evidenceRowOf` reads row 0 only (`evidence-form.ts`).

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Current duty holder per incident (STOP-W14-01) | "Owner (as recorded)" and the §2.2 item 5 line; `readerActsOn` as today | Owner column and the SuperAdmin view from Core's holder; an incident with no holder counts as "Needs a SuperAdmin" |
| SuperAdmin report route (STOP-W14-02) | SA-08o disclosure kind with its no-block effect; the operator reports | SA-08w on `/admin/applications/:applicationId/disclosure` (as OP-08w) |
| Resolved incidents in lists (STOP-W14-03) | Per-application incidents; receipt page | OP-08/SA-08 view "Resolved, to close" |
| Current classification (STOP-W14-05) | Audit history link | "Classified as [scope] on [time] IST by [name]" on SA-08i and SA-08f |
| Notice recipient per notice (STOP-W14-06) | Required codes minus missing codes | "Posted [time] IST: [variant words]; acknowledged [time] IST" |
| Command identity (P-10 b, S-08) | Neutral titles (§2.17) | "Evidence recorded", "Incident resolved", "Incident closed", "Reviewer named", "Check sent again" |
| Documents queue total (STOP-W14-09) | "200 or more" | Exact counts |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at e1f6ac9 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical incident action and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Any | Same `_op` (double click, browser resend) | K-STD replay: the same 303 and receipt; one effect | None | Yes (receipt new) |
| Report | New `_op`, same file (second tab, reload) | `duplicate_operation` with the existing incident: §2.16 sentence and link; OP-08w lists the file as already reported | None | Partly (generic) |
| Notice | Second notice to the same account, new `_op` | Stale revision (CMP-14 with "Notices posted") from a stale tab; with the current revision `duplicate_operation` → §2.16; after a reload the account shows "Posted" and has no form | None | Partly (form offered again; generic) |
| Evidence | New `_op`, same evidence, after a reload | Core appends it again (no business key); OP-08e shows the evidence recorded before the fields | Two equal evidence rows with their times (P2, STOP-W14-07) | Partly |
| Resolve | Second resolve (two tabs) | Tab 2: CMP-14 (state now "Resolved: waiting to be closed"); with a fresh revision `incident_not_open` → §2.16; no second resolution | None | Partly |
| Close | Second close | `incident_not_open` → "already closed"; no change | None | Partly (generic) |
| Open | New `_op`, same kind and note | Core opens a second incident (dedupe key per operation, `:311, 321`); the open incidents of the application are listed before the form | Two incidents (P2, STOP-W14-07) | No (no list) |
| Reviewer | Same reviewer again, new `_op` | Stale revision from the old page; with the current revision Core records the naming again (no change of holder) | One more fact | Partly |
| Classify | Same classification again | Core supersedes the current one with an equal one | One more classification in the history (P2) | Yes |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same task page at the POST address, CMP-07 focused | Every typed value and choice | — |
| A form that no longer applies (incident resolved or closed meanwhile; document already requeued) | The new state; the WP-09 unsent text block with the typed note or reason | Typed text, read only | The form |
| Access lost (reassigned, reviewer replaced, suspended, assignment ended) | Shell SH-02 or sign-in (LD-14) | — | Typed values (B10) |
| Core unreachable before a command | SH-02 "TravelMudra is unavailable now" | — | The form |
| Answer lost | Operation page (CMP-13); "Check status" reads the same key | — | No new submission offered |
| Maintenance | The status document, 503 (A-09) | — | The form; nothing replayed after reopening |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **An incident resolved twice** | §4.1 rows Resolve: one resolution; the second reader sees the state, the time and the link; nothing is overwritten | Partly |
| **Reviewer reassigned mid-review** | SA-08v names B while A reviews: Core replaces the reviewer. A's next read of OP-08i, OP-05r or the review copy answers the uniform 404; A's next command `not_found_or_forbidden` → shell; no earlier facts stay (LD-14). An operator assigned meanwhile ends both reviewers; the SuperAdmin's naming is refused `already_assigned` (or CMP-14 first) | Yes (Core); words new |
| **Disclosure notice posted twice** | §4.1 Notice rows; never two notices to one account; the preview never differs from the posted text (one renderer) | Partly |
| **Requeue of a check already running** | SA-08c from a stale page: the revision moved → CMP-14 "Waiting for: you saw Malware scan / now not waiting"; a fresh page shows "does not wait for a check now", no form. SA-08b leaves running checks out; when none remains, `nothing_to_requeue` → §2.16 | Partly (shell page) |
| **Projection outage on the reporting page** | SA-08h states each view's words and lag form; the summary names the views not up to date; a failed `views.projections` read shows "cannot be read now", never "Every derived view was up to date"; SA-01 group 16 "Unavailable" for that line; Monitors' authoritative counts stay; the boundary line reads "Freshness unavailable" when `lagMs = null`; incident pages ("Read at") and their commands are unaffected | Partly (`?? 0n`; CLI text) |
| **Maintenance during a requeue** | The POST answers the maintenance status document (503); no command is accepted; after reopening SA-08d lists the document still waiting; nothing is requeued by itself (B39). If maintenance closed after the commit and the answer was lost: UNR → the operation page; "Check status" after reopening shows the accepted request once | Yes (shell); copy WP-01 |
| **Access revoked mid-page** | Operator reassigned or suspended, SuperAdmin suspended, reviewer replaced: next read or command → shell; the incident list and nav count drop the incident on the next read | Yes |
| **200 incidents** | §4.4 | Partly |
| **Disclosure found after the assignment ended** (completion clears it; reachable only by the harness today, LD-04) | The operator has no route (no assignment); the SuperAdmin has no report route (STOP-W14-02). SA-08o's disclosure kind opens an incident with no block and says so | No |
| **Incident of an application whose assignment ended** | It stays open, owned "as recorded" by the old operator, who cannot read it; the SuperAdmin view does not count it (STOP-W14-01); SA-08 states the interim line | No (silently uncounted) |
| **Association incident opened by a SuperAdmin** | Core cannot resolve it (no artifact); SA-08o does not offer the kind (Q-W14-03) | No |
| **SuperAdmin presses Confirm on an association** (S-09) | No such form on SA-08i; a hand-made POST to `/admin/incidents/:id/confirm-association` answers the uniform 404 (no route), nothing recorded | No (form posts nowhere) |
| **Correction recorded with unrelated evidence** | Core counts it (`incidents.ts:74-76`); OP-08e and OP-08r state the rule; STOP-W14-08 | No |
| **Wrong pairing of notice variant and account** | Not possible from the page (one form per account with Core's variant); a hand-made post → §2.16 `not_affected` | No |

### 4.4 Counts, caps and long lists

| Situation | Required behaviour |
|---|---|
| 200 open incidents for one operator or SuperAdmin | List pages of 50 (`page` in the address), views and kind filter in the address; counts "[n] incidents"; one Core read per page view |
| 500 incidents (read cap) | "500 or more incidents"; the cap line; SA-01 "500 or more" (WP-06) |
| An application with 100 incidents (CW cap) | OP-08o "100 or more" in its list |
| A file released 60 times | OP-08w lists the releases (the delivery read's own cap applies); more than 50 chosen → §2.19 refusal; the file is blocked for every recipient anyway |
| 50 notice accounts | OP-08n lists 50 forms in one page; each its own `_op` |
| 200 queued documents (read cap) | "200 or more"; the bulk request takes up to 500 |

### 4.5 Device and environment

JavaScript off: every page works (plain forms; views and filters are GET links; conditional fields carry their
condition in the label). 320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: radios,
checkboxes and links in reading order; the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-14

- One `h1` per page; frame and task parts are `h2` (AC-03).
- Radio groups (`kind`, `scope`, `originComponent`, `reviewerAccountId`, `variant`, `stage`, `version`) are `fieldset`
  with a `legend`; none preselected; after a refusal the chosen value is kept (AC-15).
- State, owner, "Recorded" / "Not recorded yet", facility and projection words are text with an icon, never colour
  only (AC-06).
- Several forms on OP-08n: each button names its account ("Ask Synthetic TA 1 to delete it"), so buttons are
  distinguishable out of context (WCAG 2.4.6).
- The notice preview is a `section` with a heading, not a live region.
- Receipts are announced politely without moving focus (AC-09).

## 6. Proofs on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone). At the WP-14 proof it holds the
  integrated WP-02, WP-03 and WP-06 to WP-13 pages (package order; inference). Synthetic data only.
- Accounts: syn-ta-1; syn-operator-1 (OP1), syn-operator-2 (OP2); syn-superadmin-1 (SA1). Sign-in through the LD-11
  harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px.
- Result PDFs are generated in memory by the WP-08 test fixture (PM Q-06). Email sends and completion stay with the
  labelled harness (LD-04): a disclosure after completion is proven by test.
- `lane-ui` cannot close admission or fail a projector (P-03 parked): the V23 outage and maintenance steps are tests,
  as WP-01 decided.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W14-06)

Run tag `wp14-[yyyymmddhhmm]`. As syn-ta-1: group `wp14-[stamp]` on the TravelMudra-filed electronic offering "SYN
Tourist e-visa"; applicants A ("Syndisc, Asha"), B ("Synout, Dev"), C ("Synreview, Ravi") with unique synthetic
passports; mandatory documents; submit. As SA1: "Payment received"; assign A, B, C to OP1. As OP1 (WP-07 pages): start
work, readiness, authorization, filed evidence. OP1 records "Issued" for A and B with PDFs that hold the applicant's
name and passport number (verified), and for C with a nameless PDF (association incident). syn-ta-1 downloads A's
result (one release). Seeded data is not changed.

### 6.3 V13, disclosure part

V13 (UX §12): "Issued result with wrong/missing artifact keeps outcome but blocks release; ambiguous association goes
to scoped review. Replaced/revoked artifact never silently substitutes" (B12, B13). WP-08 proved the outcome,
association and replacement parts; WP-14 proves the disclosure, notice and closure parts and S-09.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V13D-1 | OP1, OP-05 of A → OP-08w | Read; choose the TA download; note "SYN: released through the wrong case"; report | Effect text before the button; receipt on OP-08i "Release to a wrong recipient reported"; Current "Result file: Blocked after a release to a wrong recipient. It is never released again."; required: correction, notice to syn-ta-1's name; the B-09 notice with "Owner: product owner" | L |
| V13D-2 | Harness | Resend V13D-1 (same `_op`); post again with a new `_op` | Same 303 and receipt; then 409 "This file is already reported. Nothing new was recorded." with the incident link; one incident | L |
| V13D-3 | syn-ta-1, TA-07 and TA-07d of A; harness | Read; post the old download form | Outcome "Issued" kept; no download of the blocked file; the post refused (blocked); no other file offered | L |
| V13D-4 | OP1, OP-08n | Read; post the deletion request | One row for syn-ta-1 with two choices (received the file; the application's travel agent); preview "…was released to your account in error…"; receipt "Notice posted"; the row "Posted"; TA-10 shows "Delete a file that was sent to you in error" with "Delete every copy you hold"; no page says "recalled" | L |
| V13D-5 | Harness | Post a second notice to syn-ta-1 (stale page; then current revision) | CMP-14; then 409 "A notice to [name] is already posted…"; one notice in TA-10 | L |
| V13D-6 | OP1, OP-08r; harness | Read before the correction; post a resolve | No form; "Cannot be resolved yet: The correction…" with links; the post refused with the missing item named | L |
| V13D-7 | OP1, OP-05 of A | Record a replacement result file for the incident (WP-08 form) | After verification OP-08i "The correction: Recorded"; TA-07 of A offers the replacement only; the blocked file never | L |
| V13D-8 | OP1, OP-08r then OP-08i | Resolve with a note; close with a note | Receipt "Request recorded", Current "Resolved: waiting to be closed"; close effect text visible; Current "Closed"; the incident leaves OP-08; OP-02's incidents table shows "Closed" | L |
| V13D-9 | OP1, two tabs of OP-08r | Resolve in tab 1 (on a fresh incident of V13D-10), then tab 2 | Tab 2: CMP-14 with the current state; no second resolution | L |
| V13D-10 | OP1, OP-08w of B; OP-08n | Report with no release, evidence external reference `SYN-MAIL-[stamp]`; post the notice | Required: correction, notice to syn-ta-1 (one fixed choice "Inform …"); TA-10 notice in AM-W14-02 words: no "blocked" and no "asked the recipient to delete it" | L |
| V13D-11 | SA1, SA-08 and SA-08i of B | Read | "All open" lists B's incident with "Owner (as recorded)"; SA-08i offers record evidence, notice, resolve links; no association section | L |
| V13D-12 | SA1, SA-08i of C's association incident; harness | Read; collect every form action; post to `/admin/incidents/<id>/confirm-association` | S-09: the association section with the sentence and "Name a reviewer" blocked `already_assigned` words; no form posts to `…/confirm-association` or `…/reject-association`; every form action is a registered POST route; the hand-made post answers 404 and records nothing | L |
| V13D-13 | Test | Reviewer B named while reviewer A works an incident with no active operator | A: 404 on OP-08i, OP-05r and the review copy; B reads it | T |
| V13D-14 | Test | Assignment ended (harness completion) with an open disclosure | The operator: 404; SA-08 lists it "as recorded" with the interim line; SA-08o disclosure kind effect "blocks no file" | T |
| V13D-15 | Test | AM-W14-02 renderer: both variants, with and without release references | No "blocked", "asked the recipient", "recalled" in the information variant | T |

### 6.4 V23, SA-08 part

V23 (UX §12): "Projection outage reports uncertainty without fabricated zero/success; authoritative commands continue
only when required current evidence/controls work. Maintenance/restore remains closed" (B33, B38–B40). WP-01 proved
the shell part; WP-14 proves the SuperAdmin reporting and degradation views.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V23S-1 | SA1, SA-08h | Read | Each derived view with words and the lag form; "Read at"; no server command; no restore, reopen or rebuild control; reporting gaps and document checks blocks | L |
| V23S-2 | SA1, SA-08m; SA-01 | Read | Every count with a unit; "None" for a known zero; no success callout unless every count is known; LD-04 boundary words with the lag line; SA-01 groups 10 and 16 lines | L |
| V23S-3 | SA1, SA-08d, SA-08c | Read; run one check again (if a document waits; else T) | Facilities in words; receipt neutral with "Waiting for" current | L or T |
| V23S-4 | Test (pattern "core restarted with its audit projector failing", `ported-pages.test.ts`) | Read SA-08h, SA-08a, SA-08m, SA-01; record incident evidence and resolve; requeue a check | SA-08h: audit index "Failing"/"Behind" with "Freshness unavailable" or "Behind by [n] s…", the privileged-change sentence, "Owner: engineering"; SA-08a "Freshness unavailable" and the index notice; SA-08m and SA-01 "Derived views not current: 1 (audit index)"; the incident commands and the requeue are accepted with receipts; a privileged elevation is refused (WP-01 B7) | T |
| V23S-5 | Test | `views.projections`, `views.monitors`, `doc.queue` answer `unavailable_dependency` | Each block "cannot be read now"; no "Every derived view was up to date", no "0", no "None"; an access refusal of any of them → shell | T |
| V23S-6 | Test | `doc.queue` facilities `unknown` | "Not known"; SA-08b warning; the requeue is accepted (Core decides) | T |
| V23S-7 | Test | Admission closed during a requeue POST; reopen | Status document 503; nothing recorded; after reopening the document still waits; no automatic requeue; a lost answer resolves through the operation page once | T |
| V23S-8 | Test | Renderer sweep over every SA-08 page | No "Restore", "Reopen", "Rebuild", `tm ` command text, "0" for a null count, or success words with a null count | T |
| V23S-A / V13D-A | axe | OP-08, OP-08i, OP-08w, OP-08n, OP-08r, OP-08e, OP-08o, SA-08, SA-08i, SA-08o, SA-08v, SA-08f, SA-08h, SA-08m, SA-08d, SA-08c, SA-08b, SA-08a | No violation at 1440 px and 390 px | L |

### 6.5 Proof split

V13 (disclosure part) passes when V13D-1 to -12 pass on `lane-ui` and V13D-13 to -15 pass as tests. V23 (SA-08 part)
passes when V23S-1, -2 pass on `lane-ui` and V23S-3 to -8 pass as tests (P-03 parked). Boundaries stated, not crossed:
applicant, regulator and legal notices (B-09); completion (LD-04).

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel. Phase C: U6 (wiring), then U7 (audit and measures, separable). The
architect registers gallery modules in `scripts/dev/gallery-pages.ts`, applies AM-W14-07 in `src/web/ui/shell.ts`
and edits `DESIGN.md` once at the end (incident words; "a notice states only what it records").

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Incident words and blocks** | `src/apps/staff/operations/labels.ts` (kept exports; words aligned to §2.15); new `src/apps/staff/incidents/words.ts` (§2.15, §2.16); new `src/apps/staff/incidents/blocks.ts` (incident table with views and paging, required-items task list, disclosure block, action-panel mapping, owner words) | New `test/unit/web/incident-words.test.ts` (every kind, state, required code, component, projection reason and facility value has words; unknown values fall back with the code; owner words never name an account outside the read; every §2.16 code has a sentence) | — |
| **U1 Incident pages** | New `src/apps/staff/incidents/pages.ts` (OP-08, SA-08, OP-08i, SA-08i with close) | New `test/unit/web/incident-pages.test.ts` (states in order; action panel first match; S-09: SA-08i of an association incident with `confirmAssociation` allowed renders no form whose action ends in `/confirm-association` or `/reject-association`; reviewer reader sees no application facts; views and caps; interim owner line) | `scripts/dev/gallery/incidents.ts` |
| **U2 Incident task pages** | New `src/apps/staff/incidents/task-pages.ts` (OP-08e/n/r/w/o, SA-08e/n/r/v/f/o) | New `test/unit/web/incident-task-pages.test.ts` (forms only by offers; one notice form per missing account with Core's variant; preview equals the TA renderer's output; no preselected radio; effect per kind; resolve form when only evidence/correction missing — parity test against `missingEvidence` with resolution evidence) | extend `scripts/dev/gallery/incidents.ts` |
| **U3 Incident routes** | New `src/apps/staff/incidents/routes.ts` (GET routes of §1.3; POST routes of §1.5 rows 1–9 moved from `operations/incidents.ts` and `case-work.ts` with ids, paths, actions and commands unchanged; §2.19 parsing; re-render; receipt locations) | New `test/unit/bff-incidents.test.ts` (each §2.19 refusal keeps the values and sends no command; 51 releases refused, never cut; six evidence rows on the report refused; re-render on refusal for open, classify; same `_op` resend answers the same 303; `not_found_or_forbidden` → shell; stale → CMP-14) | — |
| **U4 Document checks** | New `src/apps/staff/documents/pages.ts` (SA-08d, SA-08c, SA-08b); `src/apps/staff/documents.ts` (GET routes; POST handlers with §2.19 and re-render) | New `test/unit/web/document-checks.test.ts` (cap words; facilities words; no count from a capped read without "or more"; receipt from the summary only); new `test/unit/bff-document-checks.test.ts` (refusals re-render with the reason; `stage`/`limit` sent whole) | `scripts/dev/gallery/document-checks.ts` |
| **U5 Reporting health and Monitors** | New `src/apps/staff/views/reporting.ts` (SA-08h); new `src/apps/staff/views/monitors.ts` (SA-08m, the 303 alias); `src/apps/staff/views/routes.ts` (projections handler → SA-08h with opt. reads) | New `test/unit/web/reporting-pages.test.ts` (lag form per reason; "Not recorded" for a missing state row; no success summary with an unhealthy or unread view; no server command; Monitors: no success callout with a null count; LD-04 words) | `scripts/dev/gallery/reporting.ts` |
| **U6 Wiring, removal, amendments** | `src/apps/staff/instance.ts`; `src/web/route-inventory.ts` (new GET rows; POST rows unchanged); `src/apps/staff/operations/incidents.ts` (deleted); `src/apps/staff/operations/case-work.ts` (report and open forms and the report route removed); `src/apps/staff/work/workspace.ts` (AM-W14-01, AM-W14-06); `src/apps/staff/views/cases.ts` (monitor functions and routes removed); `src/apps/staff/attention.ts` (imports); `src/apps/staff/home/inbox.ts` (AM-W14-04); `src/apps/staff/outcome/pages.ts` (WP-08 U1, AM-W14-03); `src/apps/shared/pages/notices.ts` or wherever WP-08 U4 placed `disclosureBody` (AM-W14-02, if WP-08 is built); `src/apps/shared/pages/documents.ts` (`queuePage` removed; the architect coordinates the shared file) | `test/unit/web/routes.test.ts` (new GET rows; static `new` paths before `:incidentId`); new `test/unit/web/incident-host-pages.test.ts` (§7.2); the system tests of §7.3 | — |
| **U7 Audit and measures (separable)** | `src/apps/staff/views/pages.ts` (§2.14) | Update audit and measures page tests; LD-08 words | — |

U0 owns `labels.ts`, `words.ts`, `blocks.ts`; U1 `pages.ts`; U2 `task-pages.ts`; U3 `incidents/routes.ts`; U4 the
document files; U5 the views files except `pages.ts` and `cases.ts`; U6 the wiring and the files of other packages;
U7 `views/pages.ts`. No two units edit one file. Test file names carry no package or proof identifier.

### 7.2 Host-page and route test (S-09)

`test/unit/web/incident-host-pages.test.ts` renders OP-08, OP-08i, SA-08, SA-08i (one fixture per kind, with every
offer allowed), every task page, OP-02 (every tab), OP-05, OP-05r, SA-04a, SA-08d, SA-08h, SA-08m, and asserts:
(a) each WP-14 POST path appears as a form action on exactly the host pages of §1.5; (b) **every form action rendered
by these renderers matches a registered POST route of the staff instance** (method, path pattern) — the class fix of
S-09; (c) no renderer of the SuperAdmin surface renders an action under `/admin/incidents/:id/confirm-association`
or `…/reject-association`. The system step V13D-12 repeats (b) and (c) on `lane-ui`.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-work.test.ts:318-420` | SA open from `/admin/incidents`; evidence, resolve and notice posted from the incident page; report from the case page (`#disclosure`); "Applicant, regulator and legal notices" text; `#incidents` on `/ops/work` | GET SA-08o, SA-08e, SA-08r, OP-08n, OP-08w (field names and values unchanged); the boundary text from §2.3 item 7; `/ops/work` per WP-07 |
| `test/system/document-decisions.test.ts:255-295` | Row form on the queue page; location `?requeued=1`; bulk form on the queue page | GET SA-08c and SA-08b; locations of §1.5 rows 10, 11 |
| `test/system/ported-pages.test.ts:106-111` | "Checking facilities now" on the queue page | Unchanged words (kept) |
| `test/system/case-views.test.ts:139-147` | Monitors and the monitoring queue page | Queue path → 303 to Monitors `#open` |
| `test/system/case-measures-currency.test.ts:51-81` | "The application lists are not current" on Monitors | LD-08 lag words |
| `test/system/case-rules.test.ts:225-235`, `test/system/payments-views.test.ts:252-313` | Projections, audit and measures pages | Titles and words of §2.11, §2.14 |
| `test/system/flows.test.ts:86`, `test/system/browser.test.ts:184, 257` | Monitors as a page | Unchanged path (landing per WP-06) |
| `test/unit/bff-access-change.test.ts:25, 199-229` | `incidentRoutes` import | Import from `incidents/routes.ts` |
| `test/unit/web/access-states.test.ts:145-146` | shell pages of incidents and monitors | Unchanged ids |
| `test/unit/web/signed-in.test.ts:65-68, 177` | Admin rail members | AM-W14-07 |
| `test/unit/web/routes.test.ts` | Inventory rows | New GET rows |
| WP-07 and WP-08 carried-form tests | Entries for the report, open, evidence, resolve, notice, reviewer forms | Removed |

Stay valid: Core tests (`test/operations/artifacts-incidents.test.ts`, `incident-authority.test.ts`,
`incident-duty-end.test.ts`, `test/views/audit-health.test.ts`, `audit-scope.test.ts`), `test/unit/nav-counts.test.ts`.

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `ops.report_wrong_recipient` | OP-08; OP-02; WP-14 | OP-08w `/ops/applications/:id/disclosure` (form → O34); WP-14. Note: "Blocks the file for good; one per file; SuperAdmin route missing (STOP-W14-02)" |
| `ops.post_disclosure_notice` | OP-08; SA-08 | OP-08n, SA-08n `…/incidents/:id/notices`; note "One per account; variant by Core's role of the account" |
| `ops.record_incident_evidence` | OP-08; SA-08 | OP-08e, SA-08e `…/incidents/:id/evidence` |
| `ops.resolve_incident` | OP-08; SA-08 | OP-08r, SA-08r `…/incidents/:id/resolve` |
| `ops.close_incident` | OP-08; SA-08 | OP-08i, SA-08i (on the incident page); note "Ends every duty; no reopen" |
| `ops.open_incident` | OP-08; SA-08; WP-14 | OP-08o `/ops/applications/:id/incidents/new` (→ O51); SA-08o `/admin/incidents/new` (→ D116); note "`artifact_association` not offered (Q-W14-03)" |
| `ops.assign_incident_reviewer` | SA-08; SA-02 | SA-08v `/admin/incidents/:id/reviewer` |
| `ops.classify_failure` | SA-08 | SA-08f `/admin/failures/incident/:id/classify`; note "Incident subjects only on a page" |
| `doc.requeue_check` | SA-08 (CC-01) | SA-08c `/admin/documents/:dov/requeue` |
| `doc.requeue_bulk` | SA-08 (CC-01) | SA-08b `/admin/documents/requeue` |

Proposed §6 disposition CC-17: "The WP-14 commands leave the incident pages' disclosures, the case page and OP-02
Delivery & originals, and the documents queue rows; each has one host page per surface; close stays on the incident
page. The SuperAdmin incident page has no association decision form (S-09)." §5.1 counts unchanged (WP-14: 10).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W14-01 | P1 | SA incident page renders confirm and reject association forms posting to `/admin/incidents/:id/…` with no route (`incidents.ts:112, 164-180`; Core offers them to a SuperAdmin, `bindings:197`) | A SuperAdmin ticks three checks and presses Confirm on an association incident with no operator; the answer is "not found"; they retry or think the file was rejected | S-09: no form; reviewer route; route test (§7.2) |
| F-W14-02 | P1 | The notice form offers both variants for every affected account (`incidents.ts:184-185`) | The poster sends "Inform" to the account that received the file; Core refuses `not_affected` with a generic sentence; the notice is never posted and the incident stays open | One form per account with Core's variant (D-W14-05) |
| F-W14-03 | P1 | The TA "information" notice says "The file is blocked" and "TravelMudra has asked the recipient to delete it" (`delivery/pages.ts:662-667`), facts the notice does not record | A SuperAdmin-opened disclosure (no block, no recipient) or an information notice posted first: the travel agent tells the customer the file was blocked and the recipient asked to delete it — both false | AM-W14-02 |
| F-W14-04 | P1 | LD-17 class: `f()` (`incidents.ts:244`), `chosen()` (`case-work.ts:452-453`), `stage`/`limit` slices (`documents.ts:42, 53`), one evidence row (`evidence-form.ts`) | 60 releases chosen; 50 named silently; the report's record misses ten | §2.19 |
| F-W14-05 | P1 | Refusals of open, classify and requeue go to the shell error page (`incidents.ts:350, 360, 372`; `documents.ts:44, 55`) | A classification with a 9-character reason: the typed reason, scope and evidence are lost | Re-render task pages |
| F-W14-06 | P1 | Monitors shows "Nothing monitored needs attention" (success) while counts are unavailable (`cases.ts:270-273`) | Delivery counts are not composed: travel-date risk unknown; the SuperAdmin reads the green callout and checks nothing | §2.12 item 2 |
| F-W14-07 | P1 | The queue lead, the bulk button and the flash count from a read capped at 200 or from a missing summary (`pages/documents.ts:474, 506`; `documents.ts:56` "0 checks were sent again") | 300 documents wait; the page says 200 and the bulk sends up to 500; a summary without a count shows "0 checks were sent again" after checks were sent | §2.13; receipt from the summary only |
| F-W14-08 | P2 | "Entries projected" shows 0 when no state row exists (`views/pages.ts:519`) | A projector never ran; the page states 0 entries projected | "Not recorded" |
| F-W14-09 | P2 | The projections page shows `tm views rebuild …` to SuperAdmins (`views/pages.ts:527`) | A SuperAdmin asks for server access or runs it on the wrong host; B40 keeps recovery with engineering | "Owner: engineering", no command |
| F-W14-10 | P1 | The SuperAdmin open form takes raw application and country references (`incidents.ts:93-94`) | A pasted reference of another applicant opens a `bytes_integrity` incident that blocks every release of the wrong application | Context only; countries from Core (D-W14-07) |
| F-W14-11 | P1 | The SuperAdmin open form offers `artifact_association` (never resolvable without a file) and `wrong_recipient_disclosure` (no block) with no effect text | A SuperAdmin opens a disclosure believing the file is blocked; the travel agent keeps downloading it | Effect per kind (§2.15); Q-W14-03; STOP-W14-02 |
| F-W14-12 | P1 | Owner shown from the stored row; SuperAdmin attention excludes incidents whose operator duty ended (`labels.ts:46-66`) | Completion (harness) or an ended assignment leaves an open disclosure with no notice posted; nobody counts it | Interim words; STOP-W14-01 |
| F-W14-13 | P2 | Close has no effect text and no note (`incidents.ts:201-203`) | An owner closes by mistake; no reopen exists | Effect line; optional note |
| F-W14-14 | P1 | Naming a reviewer states nothing about replacing a current reviewer or what a reviewer gets (`incidents.ts:204-211`) | A SuperAdmin replaces a reviewer mid-review without knowing it ends their access | SA-08v |
| F-W14-15 | P2 | The shared-scope rule (evidence naming the component) is not stated (`commands/incidents.ts:69-73, 400`) | Refused `failure_scope_evidence_missing` twice | Lead text (§2.9 item 7) |
| F-W14-16 | P2 | The resolve form is hidden whenever an item is missing (`incidents.ts:195-200`), although Core accepts the missing evidence with the resolution | Two steps for one act | D-W14-10 |
| F-W14-17 | P2 | Resolved incidents are in no list (`store.ts:170-174`) | A resolved incident is never closed | List line; STOP-W14-03 |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W14-01 | P1 | Host pages and paths of §1.3 and §1.5; close on the incident page | Two forms for one command carry different words; a refusal re-renders a page without the reader's form | Yes |
| Q-W14-02 | P1 | Add `admin.incidents.disclosure` (POST `/admin/applications/:applicationId/disclosure`, command `ops.report_wrong_recipient`) and its GET page SA-08w, after the orchestrator confirms it needs no Core change (policy allows SuperAdmins; binding and staff allowlist exist) | A disclosure is found while the application has no assignment; nobody can block the file; it keeps being released | Yes, through the orchestrator (STOP-W14-02); interim stands |
| Q-W14-03 | P1 | Leave `artifact_association` out of SA-08o kinds (D-W14-08) | A SuperAdmin opens one; it can never be resolved and stays open for good | Yes (an option that cannot complete; the command stays offered); Core defect note STOP-W14-04 |
| Q-W14-04 | P1 | Bind AM-W14-02 to the WP-08 build | F-W14-03 | Yes |
| Q-W14-05 | P1 | STOP-W14-01 to the Core batch; interim "as recorded" words | F-W14-12 | Yes |
| Q-W14-06 | P1 | Proof writes on `lane-ui` (§6.2): one group, three applications, three result files, one download, two reports, two notices, one replacement, resolve, close | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only |
| Q-W14-07 | P2 | `/admin/queues/monitoring` answers 303 to Monitors `#open` | Two pages show the same counts with different words | Yes (LD-03: the path stays) |
| Q-W14-08 | P2 | Measures rebuilt in WP-14 phase C (U7), or in WP-13 with launch readiness | LD-02 needs every route rebuilt | WP-14 U7, separable |
| Q-W14-09 | P2 | SA-01 document-checks line (one more optional read, AM-W14-04) | Checks wait unnoticed after a scanner outage | Yes |
| Q-W14-10 | P2 | Offer non-result documents of the application in OP-08w (Core accepts any version of the group) | An operator emails a passport scan to a wrong address; the page offers only result files | Later; note to Max's end review |
| Q-W14-11 | P2 | Display paging of 50 over the one list read | 200 incidents in one table on a phone | Yes |
| Q-W14-12 | P1 | Resolve form when only `evidence`/`correction` are missing (D-W14-10, parity test) | F-W14-16 | Yes |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W14-01 | New GET task pages beside the existing POST paths (§1.3) | New routes and inventory entries; actions and fields unchanged |
| D-W14-02 | Forms leave the incident pages (except close), OP-02 and the queue rows | Host pages change; system tests change their GET source |
| D-W14-03 | Success locations with `done` and `op` (§1.5); `?requeued=<n>` removed | Locations change |
| D-W14-04 | The close form gets an optional `note` | New form field (existing contract input) |
| D-W14-05 | One notice form per account; `variant` hidden where one applies, radio where both apply | Names unchanged |
| D-W14-06 | `kind`, `scope`, `originComponent`, `reviewerAccountId`, `stage`, `version` are radio groups, none preselected | Names and values unchanged |
| D-W14-07 | SA-08o: `applicationId` only from the address context; `countryId` from Core's country list (text fallback) | Names unchanged |
| D-W14-08 | `artifact_association` not offered on SA-08o | None (Core unchanged) |
| D-W14-09 | Evidence rows `evidence.<n>.*` (n = 0…4) on evidence, resolve, open, classify, report | Existing names; handlers read every row |
| D-W14-10 | Resolve form shown when only `evidence`/`correction` are missing | None (Core decides at the command) |
| D-W14-11 | SA-08f only for `incident` subjects, and only for `operational_failure`/`country_defect` | None |
| D-W14-12 | Monitoring queue path → 303 | Handler change |
| D-W14-13 | Rail: "Derived views" → "Reporting health"; "Documents" → Incidents & audit "Document checks" | Shell values |
| D-W14-14 | SA-08i shows no association decision form (S-09) | Form removed (it posted to no route) |
| D-W14-15 | UI-PLAN "Assign incident owner" and "Block document version" are not separate commands: "Name a reviewer" and the report | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W14-01 | Defect (P1) | Incident rows (`zWireIncidentRow`) carry the stored owner; Core's own rule (`incidentDutyHolders`, `incidents.ts:123-141`; header: "otherwise the SuperAdmin queue") is not applied to the read. After completion or an ended assignment the row names an operator who has no access | The SuperAdmin attention count and owner words; V19 "completed processing can retain disclosure follow-up" | Facts exist; removes a page-side inference; same scope | "Owner (as recorded)" and the interim line. **P1** |
| STOP-W14-02 | Surface gap (P1) | No SuperAdmin route posts `ops.report_wrong_recipient`, although `incident.report_disclosure` allows SuperAdmins (`policy.ts:85, 204`) and the binding and staff allowlist exist (`allowlists.ts:85`) | B13 block on confirmed disclosure when no operator is assigned | No Core change; a BFF route and an inventory row (Q-W14-02) | SA-08o disclosure kind without block, stated. **P1** |
| STOP-W14-03 | Kind 1 (P2) | `ops.incidents` and `ops.admin_incidents` include `resolved` incidents (state filter) | Closure of resolved incidents | Facts exist | List line; per-application incidents |
| STOP-W14-04 | Defect note (P2) | `ops.open_incident` accepts `artifact_association` without an artifact; `association_decision` can then never be met | An unresolvable incident | — | D-W14-08 |
| STOP-W14-05 | Kind 1 (P2) | Current classification on `ops.incident` | SA-08i, SA-08f | Facts exist (`ops_failure_classifications`) | Audit history link |
| STOP-W14-06 | Kind 1 (P2) | Recipient, variant, posted and acknowledged times per notice on `ops.incident` | Proof that the travel agent acknowledged a deletion request | Facts exist (Delivery notices) | Required codes minus missing codes |
| STOP-W14-07 | Defect note (P2) | No business duplicate guard on `ops.open_incident` and `ops.record_incident_evidence` (B35 "a new key cannot evade business duplicate checks") | Nth identical action | — | Lists before the forms |
| STOP-W14-08 | Note (P2) | `correction` is met by any non-attestation evidence on the incident (`incidents.ts:74-76`), including evidence recorded for another reason | B13 "closure needs actual correction evidence" | — | Effect text on OP-08e and OP-08r |
| STOP-W14-09 | Kind 1 (P2) | `doc.queue` stops at 200 rows (`queries.ts:123`) while the contract allows 500 and the bulk takes 500; no total count | D7 counts | Facts exist | "200 or more" |
| — | Boundary (existing) | Applicant, regulator and legal notices (B-09, BS B13) | — | Separately authorized compliance work | CMP-10, owner product owner |

No STOP item blocks the WP-14 main path. No P0 item is open in this design. No Kind 2 change is requested. STOP-W14-01
goes to the Core batch as a defect; STOP-W14-02 goes to the orchestrator as a surface gap with Q-W14-02; the P2 items
are parked as notes.
