# WP-12 design review: physical originals

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-12 holds
commands that record possession, movement and return of a physical original, and a command that ties one original to
several applications with no undo; the records hold completion and cannot be corrected in this release, so a Codex
design review applies).
Product base: lane repository at f78e558 (WP-01 shell and result components, WP-20 public site, WP-02 U0 and U1, WP-03
U0 and U6). WP-03, WP-06, WP-07, WP-08, WP-09 and WP-10 are designed and not yet built; this design depends on their
units named in §1.7 and amends three of them (§1.8). This document writes no product code. Paths in `file:line` form
are relative to the lane repository at f78e558 unless they start with `REC/` (`internal/records/`) or `RM` (lane
`research/route-map.md`). Code is read as committed (`git show f78e558:<path>`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at f78e558. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Four register commands (COMMAND-COVERAGE §3, §5.1): `ops.record_original_receipt`,
  `ops.record_original_movement`, `ops.record_original_return`, `ops.link_original`. The custody detail of the SA-03c
  reassignment preview (WP-06 page; `core.reassign` stays in WP-06, §6.1). The TA-07 "Original documents" section
  (carried by WP-03 for WP-12). Text amendments to the WP-06, WP-07 and WP-08 designs where they show custody. Proof V18
  to its boundary.
- **Page model.** One host page per command (CC-12 to CC-14): OP-09n "Record an original received", OP-09m "Record a
  custody change", OP-09t "Record a return to the travel agent", OP-09l "Share an original with another application".
  Two read pages: OP-09 "Originals" of one application and OP-09i "Original" (one item). All six are new GET pages under
  `/ops/applications/:applicationId/originals…`; every form keeps its current action, hidden inputs (`_rev.original`,
  `returnTo`) and field names. The forms leave the operator case page (OP-02 "Delivery & originals" after WP-07). The
  rail destination "Originals" stays hidden: Core has no register read across applications (STOP-W12-01, D-W12-01).
- **Rules the pages state (Core facts, not page rules).** Each part of an original has its own state and holder. A part
  that is not returned (held, in transit or expected) or whose holder is uncertain holds completion (`derived.ts:199-200`).
  A partial return stays partial. An uncertain holder opens a custody incident. Assignment, reassignment, withdrawal and
  closure never change a custody row (`commands/originals.ts:18-19`). Custody of a shared original can be recorded only
  while one operator is assigned to every application that shares it (`policy.ts:524-535`); sharing across operators is
  parked (B30, B44). Return is available only under an owner-approved return policy of every sharing application
  (`custody.ts:43-52`); no real declaration has one.
- **Findings worked (§9.1).** The receipt handler splits part names at commas and truncates every text field (LD-17
  class); part-number fields drop tokens silently; `itemType` is prefilled with `passport`, so a non-passport item can
  take the applicant's passport slot for good; the share form asks for a raw `app_…` reference; the WP-06 preview reads
  the item-level holder, which Core does not change on a return; the WP-07 status fact calls expected parts "held"; the
  WP-08 travel-agent sentence says "TravelMudra still holds an original" against the parked visibility boundary; a
  parked return sits in "Action now" with nothing to do; no page lists the originals an operator holds across cases.
- **Amendments to designed packages (§1.8).** AM-W12-01 (WP-06 SA-03c custody block), AM-W12-02 to -05 (WP-07 status
  fact, OP-01 view rule, action-panel row, Delivery & originals tab), AM-W12-06 and -07 (WP-08 OP-07 originals row and
  the travel-agent completion sentence). None changes a command or a field of those packages.
- **STOP items (§9.4).** No P0. STOP-W12-01 (Kind 1, P1): originals register read for the operator. STOP-W12-02
  (Kind 1, P1): movement and return history of an original. STOP-W12-04 (defect, P1): Core accepts a 51st original on an
  application and a 51st link of an original, but the case-work read refuses to encode more than 50, so every linked
  application's work panels read "Unavailable" for good. STOP-W12-05 (Kind 2, P1, close to the B44 parked policy): no
  correction route for a custody record (wrong-applicant passport share, unlink, a receipt on the wrong application, an
  expected part that never arrives, a re-receipt after return). Three P2 notes.
- **Top questions (§9.2).** Q-W12-01 host pages and paths; Q-W12-02 re-render a custody refusal of the "not found"
  kind when fresh reads prove the reader still holds the application (the shared-original case after a reassignment);
  Q-W12-03 rail stays hidden and STOP-W12-01 goes to the Core batch; Q-W12-04 passport share candidates marked "Different
  applicant name", not hidden; Q-W12-05 part-list grammar without a field-name change; Q-W12-06 parked return out of
  "Action now".
- **Proof (§6).** V18 on `lane-ui` with the two seeded physical offerings: "SYN Paper visa with original return"
  (return policy approved, synthetic) and "SYN Business visa (paper)" (return policy parked). Partial return holds the
  `originals` completion prerequisite as Core evaluates it (completion itself is the CMD-48 boundary, LD-04);
  reassignment leaves every part's holder and place unchanged; a shared original never shows another operator's
  application, and cross-operator sharing is refused as parked.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.1 (Original item), §2.2 (Custody), §3.1 step 9, §3.2 (Physical route, Withdrawn offering, Group end), §3.3, §5.1, §5.2 (Originals), §5.3, §5.4, §6.3 (Assignment), §7.4, §8.3, §10.1, §12 V18, V19 |
| `BUILD_SPEC.md` r2 | B10, B19, B24, B30, B33, B35, B44 |
| `UI-PLAN.md` | §1, §2.2 (Originals destination), §2.3, §3.3 OP-02, OP-07, OP-09, §3.4 SA-03, §4.2 (Physical route), §5.3 OP-09, §6.3 (Originals register read model), §7 (custody rows, Reassign operator), §8 CMP-17, §10, §11.2 (Custody glossary), §12.2 WP-12, §13.2 B-05 |
| Lane records | `PLAN.md` §4 (LD-03, LD-07, LD-13, LD-14, LD-16, LD-17), §7, §8, §9; `COMMAND-COVERAGE.md` §3, §5.4, §6 (CC-12 to CC-14), §6.1; `WP-06.md` §3–§4 (D-04); `WP-06-design.md` §2.5, §2.8; `WP-06-acceptance.md` A52, A53, A61, Q-02; `WP-07.md` §3–§4 (F-01, F-07, F-13 to F-21); `WP-07-design.md` §1.3–§1.5, §2.1, §2.3, §2.5.3; `WP-08.md` §3–§4 (E-05, E-06); `WP-08-design.md` §2.4, §2.11; `WP-10.md`; `WP-10-design.md` (structure, §2.1 row OP-09, §2.0); `WP-09-design.md` §2.0; `WP-03-design.md` §1.5, §3.4; `PROPOSALS.md`; `DESIGN.md` |
| Route map (RM) | §2 rows O31, O32, O33, O47; §3.2 rows of the four commands |
| Code (pages, routes) | `src/apps/staff/operations/case-work.ts:61-66, 322-404, 443-492, 566-584`; `src/apps/staff/core/case.ts:72, 98, 206-211`; `src/apps/staff/core/ops.ts:81-101, 325-329`; `src/apps/staff/core/admin.ts:236, 369`; `src/apps/shared/core/originals.ts` (all); `src/apps/shared/core/shared.ts:55-56, 170, 184-186, 379-388, 476-503, 603`; `src/web/ui/presentation.ts:249-250, 297-298`; `src/apps/shared/evidence-form.ts`; `src/apps/shared/server.ts:813-830`; `src/apps/shared/core-client.ts:156-168` |
| Code (contracts, bindings) | `src/contracts/operations-work.ts:47-48, 108-124, 161-203`; `src/contracts/core.ts:189-196, 204-208, 273-279, 286-345`; `src/contracts/encoding.ts:63-71`; `src/core-api/bindings/operations-work.ts:46-155, 225-233, 335-348` |
| Code (Core behaviour only) | `src/modules/operations/case-work/commands/originals.ts` (all); `…/case-work/commands/common.ts:47-53`; `…/case-work/custody.ts` (all); `…/case-work/facade.ts:49-62`; `…/case-work/store.ts:177-209`; `…/case-work/types.ts:26-34, 174-209`; `…/case-work/evidence.ts`; `src/modules/identity/policy.ts:222, 524-535, 652-658`; `src/modules/core/derived.ts:196-200, 254-259, 410-416`; `src/modules/core/staff-views.ts:207-233`; `src/modules/core/commands/withdrawal.ts:9, 99-101`; `src/modules/core/commands/admin.ts:209-210`; `src/modules/core/model.ts:70-74`; `src/kernel/vocabulary/operations.ts:58-83`; `catalogue/synthetic/catalogue.json` (`syn_business_paper` :503-513, `syn_paper_return` :1006-1019, approvals :2286-2300, `launch`) |
| Tests that pin the pages | §7.3 |

### 1.2 Custody as Core holds it (facts)

| Fact | Where Core holds it | What the pages must respect |
|---|---|---|
| Physical route | Declaration `custodyPaths.physical` and `originals.custody.held` (`custody.ts:71-78`); item types declared in `originals.custody.itemTypes` | A receipt is offered only by `ops.case_work.offers.recordOriginal` (`bindings/operations-work.ts:150-151`). The staff read does not carry the declared item types (STOP-W12-03) |
| Original and its key | `ops_originals`, one per group and item key (`ON CONFLICT (group_id, item_key)`, `originals.ts:126-131`). A passport's key is `passport:` + issuing country + passport number of the receipt's application (`originals.ts:113-115`, `model.ts:70-74`). Another item's key is type + lower-cased label | The passport is positively associated with the applicant of the application it is recorded on. A second receipt of the same key is refused `original_already_recorded`, whichever application holds the first |
| Parts | 1–50 named parts; each part `expected`, `held`, `in_transit`, `returned` or `unknown` (`received` exists in the vocabulary and no command sets it); each part has its own holder kind and location (`store.ts:185-189`) | State and holder are read per part. The item-level `holderKind` and `location` are the last movement's target and do not change on a return (`originals.ts:77, 292`): pages MUST NOT show them as the item's holder |
| Aggregate state | `aggregateState` (`custody.ts:18-27`): any part `unknown` → `uncertain`; all `returned` → `returned`; some `returned` → `partly_returned`; all `expected` → `expected`; all received parts `in_transit` → `in_transit`; else `held` | `uncertain` hides a partial return and `partly_returned` hides a part in transit: the item's line is derived from its parts (§2.11) |
| Holder kinds | `tm_office`, `tm_person`, `courier`, `authority`, `ta`, `unknown` (`operations.ts:67`); `holder.ref` is accepted and never read back | A receipt refuses `unknown` and `ta`; a movement refuses `ta` (`use_return`); `unknown` needs the uncertainty statement and opens a `custody_discrepancy` incident owned by the assigned operator, on the first linked application by id (`originals.ts:242-247`) |
| Uncertainty statement | Item-level; kept after a later movement to a known holder (`originals.ts:78`) | Shown as current only while a part's holder is uncertain (§2.3 item 4) |
| Links | `ops_original_links`; the view returns ids only (`types.ts:193`, "a link grants no view of another operator's application") | Pages name a linked application only when it is in the reader's own open work list (§2.3 item 5) |
| Who may record | Receipt: the assigned operator of the application. Movement and return: the operator assigned to every linked application (`policy.ts:524-535`; `originals.ts:52-62`); with mixed operators nobody may. Link: the operator assigned to the target and to every linked application; a mix is refused `unavailable_parked`/`parked_custody_route_policy` (`originals.ts:175-177`) | A reassignment of one sharing application stops custody recording of the shared original for both operators until one operator holds all of them (§4.3) |
| Return | Only when every linked application's declaration has a supported, owner-approved `originals.returnPolicy`, and with several links only when the policy is `all_linked_applications` (`custody.ts:30-52`); at least one evidence row of a kind the policy accepts (`originals.ts:281`); parts must be `held`, `received` or `in_transit` (`:288`); the recipient is the owning travel agent account (`:298`) | `ops.case_work.custody.returnAvailable` is the application-level answer (AND over its originals). `unavailable` carries `parked_custody_route_policy` when parts are held and no return is available (`bindings/operations-work.ts:116-118`) |
| Completion | Prerequisite `originals` (E4): `original_held` when a part is not returned and not unknown (expected and in-transit parts count), `custody_evidence_missing` when a holder is uncertain (`derived.ts:199-200`). After an outcome, Core's pending answer is `return_original` with reason `original_held` (return available) or `parked_custody_route_policy` (`derived.ts:413-416`). A held original excludes the group-end path (`derived.ts:257-259`) | A partial return keeps the prerequisite not met. Unknown never reads as returned |
| Lifecycle | A receipt needs lifecycle `draft` or `submitted` (`originals.ts:105`); movement, return and link check no lifecycle. A withdrawal is an outcome, not a lifecycle state (`writers.ts:142-147`, `withdrawal.ts:97`): the application stays `submitted`, assigned and in `core.ops_work` (`staff-views.ts:214`), and keeps its originals (`withdrawal.ts:9`). Completion (harness only today) clears the assignment (`admin.ts:199-210`) and needs every part returned; the group-end path excludes held originals | An application that holds a part is always open and assigned, so it stays in its operator's work list; after an outcome its row is the `return_original` step. A receipt after an outcome (a passport that arrives after a withdrawal) is allowed by Core |
| Read limits | Wire: 50 originals per application, 50 parts, 50 linked ids (`contracts/operations-work.ts:190-194`). Core: no cap on originals per application or links per original (`facade.ts:49-62`) | A 51st original or link makes the read fail as "unavailable" for every linked application (STOP-W12-04) |
| Travel agent | `core.ta_application.originals` = declared item types only; custody facts are not sent (`contracts/core.ts:274-279`); completion codes are sent | TA pages show no custody detail (parked cross-party visibility, B30) |

Synthetic offerings with a physical route (fact, seed): "SYN Business visa (paper)" (`syn_business_paper`: passport;
`returnPolicy.unresolved = parked_custody_route_policy`) and "SYN Paper visa with original return" (`syn_paper_return`:
passport; `recipientEvidenceKinds` attestation and document_version; `sharedItemReturn = single_application_only`;
owner-approved synthetic, approvals :2286-2293). Both are in the seed's `launch` list.

### 1.3 Page list

"New" = new GET route and inventory entry; route ids of new routes are proposals. "opt." = read through `optionalView`
(LD-14). "CW" = `ops.case_work`.

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| OP-09 | Originals (of one application) | `/ops/applications/:applicationId/originals` (GET beside the POST O31) | **New** (`ops.originals.list`, action `application.read`) | `core.ops_case`; opt. CW |
| OP-09i | Original (one item) | `/ops/applications/:applicationId/originals/:originalId` | **New** (`ops.originals.item`, action `application.read`) | `core.ops_case`; opt. CW; opt. `core.ops_work` (names of sharing applications) |
| OP-09n | Record an original received | `/ops/applications/:applicationId/originals/new`; form → POST `/ops/applications/:applicationId/originals` (O31) | **New** (`ops.originals.receipt_form`, action `operator.record_custody`) | `core.ops_case`; CW (required for the form) |
| OP-09m | Record a custody change | `/ops/applications/:applicationId/originals/:originalId/movement`; form → POST `/ops/originals/:originalId/movements` (O32) | **New** (`ops.originals.movement_form`, action `operator.record_custody`) | `core.ops_case`; CW (required for the form); opt. `core.ops_work` |
| OP-09t | Record a return to the travel agent | `…/originals/:originalId/return`; form → POST `/ops/originals/:originalId/return` (O33) | **New** (`ops.originals.return_form`, action `operator.record_custody`) | as OP-09m |
| OP-09l | Share an original with another application | `…/originals/:originalId/share`; form → POST `/ops/originals/:originalId/link` (O47) | **New** (`ops.originals.share_form`, action `operator.record_custody`) | `core.ops_case`; CW (required); `core.ops_work` (required for the candidates) |
| OP-02 | Application workspace (WP-07 page) | `/ops/applications/:applicationId?tab=delivery` | WP-07 page; WP-12 replaces the carried originals block with a summary and a link (§2.9) | as WP-07 |
| OP-01 | My work (WP-07 page) | `/ops/work` | View rule for a parked return (AM-W12-03, §2.9) | as WP-07 |
| OP-07 | Request completion (WP-08 page) | `/ops/applications/:applicationId/completion` | `originals` row words and link (AM-W12-06) | as WP-08 |
| SA-03c | Reassign one application (WP-06 page) | `/admin/applications/:applicationId/reassign` | Custody block replaces WP-06 §2.5 item 5 "originals" lines (AM-W12-01, §2.8) | as WP-06 (`core.admin_case`; opt. CW) |
| TA-07 | Application (WP-03 page), section "Original documents" | `/ta/applications/:applicationId#originals` | WP-12 rebuilds the carried section read only (§2.10) | `core.ta_application` |

Each new GET route validates `zWireId('app')` and `zWireId('org')`; a parse failure is the uniform 404. OP-09i, OP-09m,
OP-09t and OP-09l answer the uniform 404 when CW reads and the original is not in `caseWork.originals` of that
application (the item is reachable only through an application that it is linked to). `resolve` returns
`{ type: 'application', id }`. Query values: `from` ∈ {`applications`} (WP-07 §1.2); an unknown value is ignored.

### 1.4 Shell placement (WP-01 §2.2, WP-07 §1.3)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| OP-09, OP-09i | `/ops/work`, or `/ops/applications` with `from=applications` (as OP-02) | "My work › [applicant] › Originals" / "… › Originals › [item words]" |
| OP-09n | same | "My work › [applicant] › Originals › Record an original received" |
| OP-09m, OP-09t, OP-09l | same | "… › Originals › [item words] › Record a custody change" / "› Record a return" / "› Share" |
| SA-03c | as WP-06 | as WP-06 |

The operator rail destination "Originals" (`/ops/originals`, UI-PLAN §2.2) is **not added** (D-W12-01): no Core read
lists originals across the operator's applications (STOP-W12-01). It stays hidden as WP-07 §1.3 row 4 states. OP-09
pages carry the OP-02 frame items 1–5 (WP-07 §2.3) and no tabs. OP-09n, OP-09m, OP-09t and OP-09l are full-screen task
pages in the CMP-25 order. No navigation count changes, except the parked-return rule of AM-W12-03.

### 1.5 The WP-12 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.record_original_receipt` | `ops.custody.receipt` (`/ops/applications/:applicationId/originals`) | **OP-09n** (moved from the case page, `case-work.ts:325-337`) | `itemType`, `label`, `description`, `parts` (textarea, one part per line, D-W12-05), `receivedParts`, `holder.kind` (radio), `holder.location`, `possessionAttested` (checkbox `yes`), `evidence.<n>.kind\|id\|note` (n = 0…4, D-W12-07), `eventAt` (D-W12-08) | — (Core takes none) | Parsing of §2.15 (no truncation, LD-17); success `receiptLocation('/ops/applications/<app>/originals/<org>', 'original', key)` with `<org>` = `summary.originalId` (pattern `org_`; else OP-09); refusal re-renders OP-09n at the POST address, `restorePath` = OP-09n |
| 2 | `ops.record_original_movement` | `ops.custody.movement` (`/ops/originals/:originalId/movements`) | **OP-09m** (moved, `case-work.ts:338-350`) | `returnTo` (hidden, application id), `kind` (radio), `parts`, `toHolder.kind` (radio), `toHolder.location`, `uncertainty`, `possessionAttested`, `evidence.<n>.*` (D-W12-07), `eventAt` (D-W12-08) | `original` | §2.15; success `receiptLocation('/ops/applications/<returnTo>/originals/<org>', 'movement', key)`; refusal re-renders OP-09m, `restorePath` = OP-09m; `not_found_or_forbidden` → rule D-W12-09 |
| 3 | `ops.record_original_return` | `ops.custody.return` (`/ops/originals/:originalId/return`) | **OP-09t** (moved, `case-work.ts:351-358`) | `returnTo`, `parts`, `evidence.<n>.*` (n = 0…4; at least one), `eventAt` (D-W12-08) | `original` | as #2, code `returned` |
| 4 | `ops.link_original` | `ops.custody.link` (`/ops/originals/:originalId/link`) | **OP-09l** (moved, `case-work.ts:359-364`) | `returnTo`, `applicationId` (radio of candidates, D-W12-06, D-W12-12) | `original` | as #2, code `linked`; the chosen radio is kept on refusal |

Done codes stay as today (`original`, `movement`, `returned`, `linked`, `case-work.ts:462-463`). An invalid `returnTo`
keeps today's fallback (`/ops/work`, `case-work.ts:485`) for a success; a refusal with an invalid `returnTo` goes to the
shell refusal page. Each command has exactly one host page, so a refusal always re-renders the page it came from.

`core.reassign` stays in WP-06 (SA-03c, COMMAND-COVERAGE §6.1). WP-12 adds only the custody block of its preview and its
receipt (§2.8). UI-PLAN §7 "Record holder uncertain" is `ops.record_original_movement` with holder `unknown` on OP-09m;
"Record owner receipt" is `ops.record_original_return` on OP-09t. UI-PLAN §12.2 names no link command; the register's
`ops.link_original` is OP-09l.

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Record an original received (`case-work.ts:325-337`) | Operator case page; after WP-07 the OP-02 "Delivery & originals" tab (WP-07 §1.5 carried it there) | "Originals" summary (§2.9 item 2) → OP-09; OP-09 "Record an original received" → OP-09n |
| Record a movement (`:338-350`) | Same | OP-09i "Record a custody change" → OP-09m |
| Record a return (`:351-358`), and the disabled "Record a return" button | Same | OP-09i "Record a return to the travel agent" → OP-09t, or the boundary notice on OP-09i |
| Link to another application (`:359-364`) | Same | OP-09i "Share with another application of this group" → OP-09l |
| The originals section of `caseWorkPanels` on the SuperAdmin case page (`admin.ts:369`, `can` false: facts only) | Old SuperAdmin case page (not rebuilt until WP-11) | A read-only custody summary from the WP-12 row renderer (§7.1 U6); no form existed there |

Carried on WP-12 pages: none. The custody-incident docket line "Also needed: trace the original" (`ops.ts:325-329`,
`case.ts:206-211`) keeps its words; its `originalsHref` becomes OP-09 (§2.9 item 5).

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13 (operation status
page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage` (task-page order), CMP-01 `actionPanel`,
`statusFacts`. WP-03 U0: CMP-11 `identityBand`. WP-06 U3: SA-03c. WP-07 U0: the OP-02 frame
(`src/apps/staff/work/frame.ts`), the operator reading (`src/apps/staff/work/reading.ts`), the evidence-row block and its
reader (`evidence.<n>.*`, n = 0…4, WP-06 D-10). WP-08: OP-07 (`src/apps/staff/delivery/completion-page.ts`). WP-09 U2:
the unsent text block. Existing: `choiceGroup`, `textField`, `textareaField`, `checkboxField`, `summaryList`,
`dataTable`, `identifier`, `timeAt`, `disclosure`.

CMP-17 "Custody item row" (UI-PLAN §8) is built as a staff renderer, not a `src/web/ui/` component: new
`src/apps/staff/originals/rows.ts` (`custodyItemRow`, `partLines`, `custodySummary`), used by OP-09, OP-09i, the OP-02
tab, SA-03c and the old SuperAdmin case page. One new word module `src/apps/staff/originals/words.ts` holds the closed
tables of §2.11 and §2.14.

Dependency: WP-12 builds after WP-06 U3 (SA-03c), WP-07 U0, U1 and U2 (frame, reading, OP-01, OP-02) and WP-08's OP-07
are integrated (package order of PLAN §3: WP-12 follows WP-11). WP-12 MUST NOT build a second frame, band or evidence-row
reader.

### 1.8 Amendments to designed packages

Each binds the build of the named package if it is not built yet; otherwise WP-12 U4 or U5 applies it (§7.1). The
architect records them in the package records, as WP-10 did with F-16 to F-21 and E-13 to E-15.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W12-01 | WP-06 §2.5 item 5 "Stays as it is: originals"; §2.8 receipt `reassigned` current facts | P1 | Replace "[item] — held by [holder kind], [location …]" by the SA-03c custody block of §2.8: per-part lines derived from part states (§2.11), never the item-level `holderKind`; shared-original consequence; the receipt's current facts use the same lines (F-W12-05) |
| AM-W12-02 | WP-07 §2.3 frame item 5 status fact "Originals" | P1 | "[n] parts not returned" (Core's `heldOriginals`: held, in transit or expected) and, separately, "[m] parts with holder uncertain". Never "held" for that count (F-W12-13) |
| AM-W12-03 | WP-07 §2.1 OP-01 view membership; `workItemNeedsAttention`; the navigation count | P1 | A row whose pending reason is `parked_custody_route_policy` (next action `return_original`) belongs to "Delivery and closure", owner label "Unavailable in this release: return of originals", no marker, and is not counted. A row with reason `original_held` stays "Action now". Same mapping for the view, the count and the page (F-07 class, F-W12-11) |
| AM-W12-04 | WP-07 §2.4.5 action panel | P1 | Row for `return_original`: reason `original_held` → owner You, step "Return the original to the travel agent", action "Open the originals" → OP-09; reason `parked_custody_route_policy` → blocker type "Unavailable in this release", CMP-10 "Returning originals through TravelMudra is unavailable until the return policy is approved. Owner: product owner.", secondary link "Originals" → OP-09, no primary action |
| AM-W12-05 | WP-07 §2.5.3 Delivery & originals | P1 | The carried originals forms are replaced by the "Originals" summary of §2.9 item 2 (counts, return availability, link to OP-09) |
| AM-W12-06 | WP-08 §2.4 OP-07 owner table, row `originals` | P1 | "Where" → OP-09 of this application. Detail sentences by Core's codes (§2.11.4). Owner "You" only when Core's pending answer names the reader (E-06); otherwise "The assigned operator". With `parked_custody_route_policy` in Core's pending answer the row adds the CMP-10 of AM-W12-04 |
| AM-W12-07 | WP-08 §2.11 travel-agent completion sentences, `originals` | P1 | Met: "No original document holds completion". Not met: "An original document holds completion. TravelMudra does not show custody details here." Replaces "TravelMudra still holds an original document of this application", which claims a receipt and a holder that the TA section says it does not show, and is false when the holder is uncertain (F-W12-12) |

The travel-agent next-action words for `return_original` (`presentation.ts:298`, WP-01 file) change by reason; the
architect applies the one-value change (as WP-10 did): §2.10 item 3.

## 2. Page specifications

### 2.0 Rules common to every WP-12 page

- **Freshness (LD-08).** Every WP-12 read is authoritative: CMP-12 "Read at [time] IST".
- **Page states.** S1: pages are rendered complete by the server. S6 and S7: SH-02 pages of WP-01 (uniform 404 without
  object facts; Core unreachable: "TravelMudra is unavailable now"). Each page lists its own states.
- **Optional reads (LD-14).** Only through `optionalView`. On OP-09 and OP-09i an availability failure of CW renders
  "Originals cannot be read now. Nothing is shown in their place." and no action link. On the task pages CW is
  required for the form (revision, parts, offers): an availability failure keeps the frame and shows CMP-10 "This step
  cannot be prepared now: the originals cannot be read. Try again later. Owner: TravelMudra." with no form (WP-07 F-04
  class: a custody record has no undo). `core.ops_work` on OP-09i is optional (names only); on OP-09l it supplies the
  candidates: unavailable → "Your applications cannot be read now, so no application can be offered." and no form.
  Every other refusal reaches the shell.
- **Command results.** ACC: 303 to the item page (§1.5) with `?done=<code>&op=<key>`; CMP-08 first in `main`; its title
  first in the document title. A receipt names a result only when `core.operation` returns the expected resource and
  the summary fields of §2.12. Otherwise it is neutral ("Request recorded"). REJ: the task page re-rendered at the POST
  address with `restorePath` = the GET page, the category's status, CMP-07 focused, every typed value and choice kept,
  the possession checkbox left clear (it is re-attested at the moment of sending, as WP-07 keeps
  `confirmIrreversible` clear). C5: CMP-14 (§2.13). UNR: 303 to `/ops/operations/<key>`; no new submission of the same
  intent is offered while unresolved; `resultHrefOf` is unchanged (an `original` resource has no page without its
  application, so the operation page offers "Go to your work").
- **Access refusals of a custody command (D-W12-09, Q-W12-02).** For movement, return and share, a refusal with
  category `not_found_or_forbidden` is handled so: the handler reads `core.ops_case` and CW of `returnTo` with plain
  `ctx.view` (no catch; any refusal of these reads reaches the shell, LD-14). When both answer, `viewerAssigned` is true
  and the original is still in `caseWork.originals`, the handler re-renders the task page with status 409 (never 404:
  a 404 answer reads as an access change to `enhance.js` and to the reader) and the §2.14 sentence "another application
  that shares this original is not assigned to you now" (share: "the application you chose is not assigned to you now,
  or is in another group"). In every other case the shell's uniform 404 answers. Reason: with the
  reader still assigned to an application that the original is linked to, Core's policy refuses only when another
  linked application has another operator or none (`policy.ts:524-535`, `originals.ts:52-62`).
- **K rules.** All four commands: K-STD. A form carries one `_op` from page load; a browser resend reuses it; a
  re-render after a refusal issues a new `_op`.
- **Core decides.** OP-09n shows its form only when `offers.recordOriginal.allowed` (blocked → CMP-10 with Core's
  sentences; `null` → no form). Movement, return and share have no per-original offer on the read (STOP-W12-03). The
  pages offer them by Core's facts (D-W12-10, a parity test against the command guards lists each discrepancy, as
  WP-10 H-02): movement when the viewer is assigned and the item has a part that is not returned; return when the
  viewer is assigned, `custody.returnAvailable` is true and a part is `held`, `received` or `in_transit`; share when the
  viewer is assigned, the service mode is not `preparation_only` and the item has fewer than 50 links (D-W12-11). Core
  decides at the command.
- **Read grants and support view.** A read-grant reader sees OP-09 and OP-09i with every fact and the line "Only the
  assigned operator records custody. You can read this application.", and no action link; the task pages show the
  frame, the facts and the same line, with no form (WP-07 §2.0). The `/ops` pages are not reachable in a support view
  (409 `support_view_active`). TA pages show no custody detail.
- **Visibility (B30, V18).** A page names another linked application (applicant, service, reference, link) only when
  it is an item of the reader's own `core.ops_work`. Any other linked application reads "Another application of this
  group, not among your open applications", with no name, reference or link. The item key is never shown (Core does
  not send it).
- **Privacy.** The full passport number appears only on OP-09n (the authorized task of a passport receipt, UX §5.3
  "reveal full identifiers only in an authorized task context"); elsewhere the frame shows the masked cue. The
  description hint asks the operator not to type the passport number.
- **Copy.** UI-PLAN §11. Every time carries "IST". Synthetic data shows "Synthetic" (CR-08). Glossary (UI-PLAN §11.2
  custody): "Held by [holder]", "Holder uncertain", "Partly returned"; "Returned to owner" is written "Returned to the
  travel agent" (D-W12-13: Core's recipient is the owning travel agent account). Forbidden on WP-12 pages: "Returned"
  for an item with any part not returned; "Held", "Received" or "In custody" for an expected part; "Delivered"; "Lost",
  "Damaged" (parked); "moved to the new operator" or any custody change for an assignment or reassignment; "Override";
  "Something went wrong"; the name or reference of an application outside the reader's open work list.
- **Mobile (< 768 px).** One column; tables stack into labelled rows. Task pages put scope and effect before the fields;
  the primary action is at the end of the form, never in a fixed bar (UX §7.3).

### 2.1 What each page shows per service shape

| Page, part | Physical route declared | No physical route (TravelMudra-filed or provider) | Preparation only |
|---|---|---|---|
| OP-02 Delivery & originals "Originals" (§2.9) | Summary and link | Absent unless originals exist (they cannot) | Absent (WP-10 §2.1) |
| OP-09 | Full page | "This service holds no physical originals." No form | "A preparation-only service holds no originals." No form |
| OP-09n | Form when Core offers it | Core's blocker `custody_path_not_declared` as CMP-10 | Core's blocker `preparation_only_holds_no_originals` |
| OP-07 `originals` row | Core's codes (AM-W12-06) | Met (Core) | Met (Core) |
| TA-07 "Original documents" | Item types and the boundary (§2.10) | Absent (`originals = null`) | Absent |

### 2.2 OP-09 Originals `/ops/applications/:applicationId/originals`

Purpose: see every original of this application, part by part, and reach each custody record (UX §2.2, §5.1
"Preserve each original"; BS B30; UI-PLAN OP-09).

Anatomy (reading order):

1. OP-02 frame items 1–5 (WP-07 §2.3); page title "Originals". Receipt (`original` when the location fell back to this
   page, §1.5).
2. Route line (info tone, text), by facts: physical route offered or originals exist: "This service holds the
   applicant's physical originals. Record each original when you hold it, each change of its holder, and its return to
   the travel agent. Assigning or reassigning the application moves no original." Otherwise the §2.1 sentence.
3. `h2` "Custody now" (`statusFacts`, each its own row): "Parts not returned: [n]" (`custody.heldOriginals`; "None");
   "Parts with holder uncertain: [m]" (`custody.uncertain`; "None"); "Return to the travel agent" (only when an
   original exists; Core answers `false` before that, `custody.ts:67`): "Available" when `custody.returnAvailable`, else
   "Unavailable in this release" with the CMP-10 of §2.14 (return policy); "Completion": Core's `originals` prerequisite of `core.ops_case.completion` ("Met" / "Not met: [§2.11.4
   sentences]") with the link "Request completion" (OP-07).
4. `h2` "Items" (`dataTable`, CMP-17 rows; caption "Originals of this application"): Item ("[item words]: [description]",
   link to OP-09i); Custody (the part lines of §2.11.2, one per line); Shared ("Only this application" or "With [k] other
   application(s) of this group"). A row with a part whose holder is uncertain carries the text marker "Holder
   uncertain" (warning tone, text and icon). Empty: "No original is recorded for this application."
5. Action: "Record an original received" (primary button link → OP-09n) when `offers.recordOriginal.allowed` and fewer
   than 50 originals; blocked → CMP-10 with Core's sentences (§2.14); 50 originals → CMP-10 "This application has 50
   originals, the most that TravelMudra's pages can show. Record a further original only after TravelMudra raises this
   limit. Owner: TravelMudra." (D-W12-11).
6. `h2` "Custody incidents": open `custody_discrepancy` incidents of `caseWork.incidents`: "Holder uncertain: opened
   [time] IST" with the link `/ops/incidents/<id>`. None: "No open custody incident for this application." When an
   original is shared: "An incident about a shared original is opened on one of the applications that share it."
7. Secondary links: "Back to the application" (OP-02 `?tab=delivery`, `from` kept), "Request completion" (OP-07).

States (first match):

| State | Condition (Core facts) | Copy and controls |
|---|---|---|
| Preparation only | `offering.serviceMode = preparation_only` | Frame; "A preparation-only service holds no originals." No form, no table |
| No physical route | `offers.recordOriginal` blocked `custody_path_not_declared` and no original | Frame; "This service holds no physical originals." No form |
| Originals unavailable | CW availability failure | Frame; "Originals cannot be read now. Nothing is shown in their place." No action |
| Not the assigned operator | `viewerAssigned = false` | Items 2–4, 6; the §2.0 read-grant line; no action link |
| Closed | `lifecycle ∈ {completed, ended_with_group}` (a read-grant reader only: completion ends the assignment) | Items 2–4, 6; "This application is closed. Its custody records do not change." No action |
| Outcome recorded | `outcome ≠ null` (for example `withdrawn`) | Items 1–7 with the line "An outcome is recorded: [outcome words]. Parts that are not returned still need their return; the application completes only after that." The receipt action follows Core's offer (a passport that arrives after a withdrawal is recorded, then returned) |
| Open | otherwise | Items 1–7 |

### 2.3 OP-09i Original `/ops/applications/:applicationId/originals/:originalId`

Purpose: one original with its parts, holders, places, sharing, and the custody records the reader can make (UX §2.1
"item-level holder, movement and return evidence"; UI-PLAN OP-09 item detail).

1. Frame items 1–5; breadcrumb "… › Originals › [item words]"; `h1` "[Item words]: [applicant]". Receipt (`original`,
   `movement`, `returned`, `linked`, §2.12).
2. `h2` "Item" (`summaryList`): Item type ([item words]); Description; Custody (the item line of §2.11.3); Original
   reference (`identifier`, copy).
3. `h2` "Parts" (`dataTable`): Part ("[n]. [label]"); State (§2.11.2 part words); Holder and place (holder words and
   location, or "Place not recorded"; a returned part reads "The travel agent"; an expected part reads "Not received
   yet"; an uncertain part reads "Holder uncertain"). A row with an uncertain holder carries the text marker. The table
   lists every part (at most 50).
4. Uncertainty statement: when a part's holder is uncertain: "What is not known: [statement]". When no part's holder is
   uncertain and a statement exists: "Statement recorded when a part's holder became uncertain: [statement]. Every
   part's holder is known now." (`originals.ts:78` keeps the statement; F-W12-14.)
5. `h2` "Shared with": one line per other linked id: when the id is an item of the reader's `core.ops_work`:
   "[Surname, Given names] · [service] · Application [reference]" linked to that application's OP-09i; otherwise
   "Another application of this group, not among your open applications" (no name, reference or link). Line when
   shared: "Custody of a shared original can be recorded only while one operator is assigned to every application that
   shares it. Sharing across operators is not available in this release." None: "Only this application." `core.ops_work`
   unavailable: "Shared with [k] other application(s). Their details cannot be read now."
6. `h2` "Record custody" (action links by the §2.0 facts rule, each with one sentence):
   - "Record a custody change" → OP-09m: "Expected parts arrived, parts were sent or handed on, or a part's holder
     changed or became uncertain."
   - "Record a return to the travel agent" → OP-09t, when the rule holds. When `custody.returnAvailable` is false:
     CMP-10 "Returning originals through TravelMudra is unavailable until the return policy is approved for every
     application that shares this original. Owner: product owner." and `unavailableButton` "Record a return" (SH-R08:
     the reader expects it here). When no part is held: "No part is held now, so none can be returned."
   - "Share with another application of this group" → OP-09l, when the rule holds; at 50 links the CMP-10 of §2.14.
   - Boundary (always, UI-PLAN B-05): "Marking a part lost or damaged is not available in this release. If you do not
     know where a part is, record its holder as uncertain. Owner: product owner."
7. `h2` "Earlier records of this original": "The list of earlier receipts, changes and returns of this original cannot
   be shown here yet. Each record is kept with who made it, when, and its evidence." (STOP-W12-02; not a policy
   boundary, so no owner line.)
8. Custody incidents of this application (as OP-09 item 6).
9. Secondary links: "All originals of this application" (OP-09), "Back to the application" (OP-02 `?tab=delivery`).

States (first match):

| State | Condition | Copy and controls |
|---|---|---|
| Not linked here | the original is not in `caseWork.originals` | Uniform 404 (SH-02) |
| Originals unavailable | CW availability failure | Frame; "This original cannot be read now." No action |
| Not the assigned operator | `viewerAssigned = false` | Items 2–5, 7, 8; read-grant line; no action links |
| Every part returned | all parts `returned` | Custody "Returned to the travel agent: every part"; item 6 shows only the sentence "Every part was returned to the travel agent. Its records cannot change." |
| Open | otherwise | Items 1–9 |

### 2.4 OP-09n Record an original received `/ops/applications/:applicationId/originals/new`

Purpose: record one physical item that the operator holds now, with its parts (UX §3.2 Physical route "item-level
receipt"; BS B30 "record each original once with positive association"). CMP-25 order: Scope → Evidence → Effect →
Your record → Review → buttons.

1. Frame items 1–5; `h1` "Record an original received: [applicant]".
2. `h2` "Scope": "One physical item that you hold now, for this application. For the applicant's passport, TravelMudra
   links the record to this applicant's passport details itself. Record a passport only on the application of the
   applicant whose passport it is." Identity block (read only, from `core.ops_case.applicant.identity`): "Check a
   passport against: Name [Surname, Given names]; Date of birth [date]; Passport number [full number]; Issuing country
   [code in words]."
3. `h2` "Already recorded for this application": the item lines (§2.11.3) or "No original is recorded for this
   application yet." Line: "TravelMudra keeps one record per applicant's passport in a group, and one record per item
   type and name for other items. A second record of the same item is refused."
4. `h2` "The item":
   - "Item type" (`itemType`, text, required, maxlength 40, **no prefilled value**, D-W12-06), hint "As the service
     names it, for example passport."
   - "Name of the item, not for a passport" (`label`, optional, maxlength 120), hint "Needed for every item other than
     the passport, for example Birth certificate. TravelMudra does not use it for a passport."
   - "Description" (`description`, required, maxlength 200), hint "How to recognise it, for example: booklet with a
     blue cover. Do not type the passport number."
   - "Parts, one per line" (`parts`, `textareaField`, 3 rows, required), hint "For example: Passport booklet. Up to 50
     parts of up to 120 characters each. List only parts you hold now or that are on their way to you. A listed part
     keeps the application from completing until it is returned, and it cannot be removed in this release." (D-W12-05)
   - "Parts you hold now, by their line numbers" (`receivedParts`, text, required, maxlength 200), hint "For example 1,
     or 1 2. The other parts are recorded as expected."
5. `h2` "Who holds it now": "Holder" (`holder.kind`, radio, required, none preselected): "A TravelMudra office"
   (`tm_office`); "A TravelMudra staff member" (`tm_person`); "A courier" (`courier`); "The authority" (`authority`).
   "Where, and with whom" (`holder.location`, optional, maxlength 200), hint "For example: Mumbai office, safe A; or a
   courier's tracking reference."
6. `h2` "Evidence (optional)": the evidence-row block (`evidence.<n>.kind|id|note`, n = 0…4), lead "A courier receipt or
   a parcel label supports the record. It does not show that you hold the item." "Date you received it" (`eventAt`,
   date, optional, not in the future).
7. "Your statement" (`possessionAttested`, checkbox value `yes`, required, never prechecked): "I hold this original now.
   A scan, a parcel label or a courier receipt alone is not enough."
8. `h2` "Effect" (visible): "TravelMudra records the item once for this group, with its parts and the holder you name.
   Parts you do not hold now are recorded as expected. Each part that is not returned keeps the application from
   completing until it is returned to the travel agent. A record cannot be removed or changed in this release, except by
   a later custody record. Assigning or reassigning the application moves no original."
9. Review (visible): "When you record it: your name, the time and your statement that you hold it are kept with the
   record."
10. Buttons "Record the original" (primary); "Cancel" → OP-09.

States (first match): preparation only and no physical route (§2.1; no form); not the assigned operator (frame, the
read-grant line, no form); CW unavailable (§2.0 notice, no form); `offers.recordOriginal` `null` (closed: "This
application is closed. A new original cannot be recorded for it."; no form); blocked (CMP-10 with Core's sentences; no
form); 50 originals (CMP-10 of OP-09 item 5; no form); open (items 1–10); C2 (§2.14, values kept, statement clear); C3
(303 to OP-09i).

### 2.5 OP-09m Record a custody change `/ops/applications/:applicationId/originals/:originalId/movement`

Purpose: record that expected parts arrived, that parts were sent or handed on, or that a part's holder changed or is
not known (UX §3.2 "partial movement and holder uncertainty"; BS B30).

1. Frame; `h1` "Record a custody change: [item words]".
2. `h2` "Scope": "This original only: [item words], [description]. Record what happened to the parts you choose. The
   other parts keep their record."
3. `h2` "Evidence": the Parts table of OP-09i item 3 (with part numbers); the "Shared with" lines and the shared-original
   sentence of OP-09i item 5 when the item is shared.
4. `h2` "What happened" (`kind`, radio, required, none preselected):
   - "Expected parts arrived" (`receipt`), hint "Only for parts recorded as expected. You hold them now."
   - "Parts were sent or handed on" (`partial_movement`), hint "For example to a courier or to the authority. A part
     with a courier is recorded as in transit."
   - "Parts are now with another holder, or their holder is uncertain" (`holder_update`), hint "For example back in the
     office or with another staff member."
5. Parts: when exactly one part is not returned: text "Part: [n]. [label]" and hidden `parts` = n (the WP-10 D-W10-08
   pattern). Otherwise "Parts, by their numbers" (`parts`, text, required, maxlength 200), hint "Not returned: 1.
   Passport booklet (held), 2. Old passport (expected). For example 1 or 1 2."
6. `h2` "Who holds them now": "Holder" (`toHolder.kind`, radio, required, none preselected): the four holders of OP-09n
   and "Holder uncertain" (`unknown`). "Where, and with whom" (`toHolder.location`, optional, maxlength 200). "What is
   known and what is not" (`uncertainty`, `textareaField`, 3 rows, maxlength 500), hint "Needed when the holder is
   uncertain. For example: not in safe A on 12 October; last seen with the courier."
7. "Only when parts arrive" (`possessionAttested`, checkbox `yes`, never prechecked): "I hold the parts that arrived. A
   scan, a parcel label or a courier receipt alone is not enough." Hint "Leave it clear for any other change."
8. Evidence rows (optional, n = 0…4) and "Date it happened" (`eventAt`, optional).
9. `h2` "Effect" (visible): "TravelMudra records the change for the parts you choose. 'Holder uncertain' opens a custody
   incident that you own, and the application cannot complete while a part's holder is uncertain. A returned part
   cannot change. To hand parts back to the travel agent, record a return instead."
10. Hidden `_rev.original`, `returnTo` (the path application). Buttons "Record the change" (primary); "Cancel" → OP-09i.

States: not linked here (404); CW unavailable (no form); not the assigned operator (no form); every part returned
("Every part was returned to the travel agent. Its records cannot change."; no form); open; C2 (§2.14; values kept;
statement clear); C5 (§2.13); the D-W12-09 re-render (the shared-original sentence; values kept).

### 2.6 OP-09t Record a return to the travel agent `/ops/applications/:applicationId/originals/:originalId/return`

Purpose: record that parts were handed back to the owning travel agent, under the service's approved return policy (UX
§3.2 "actual owner receipt"; BS B24 "A physical original holds completion until operator/SuperAdmin records owner
receipt"; B30).

1. Frame; `h1` "Record a return to the travel agent: [item words]".
2. `h2` "Scope": "Parts of this original that you handed back to the travel agent of this application, [travel agent
   name] (`names[ta_account_id]`). TravelMudra records that travel agent as the recipient."
3. `h2` "Evidence": the Parts table; "Return policy: approved for this application's originals" (the fact
   `custody.returnAvailable`).
4. Parts (`parts`): the one-part rule of OP-09m over parts that are `held`, `received` or `in_transit`; otherwise the
   text field with the hint listing those parts. A part whose holder is uncertain is listed under "Cannot be returned
   now: [n]. [label] (holder uncertain; record where it is first)".
5. "Evidence of the travel agent's receipt" (evidence rows, n = 0…4, at least one), lead "This service's return policy
   accepts certain kinds of evidence, for example a document of the case or your statement of the handover."
6. "Date of the return" (`eventAt`, optional).
7. `h2` "Effect" (visible): "The parts you choose are recorded as returned to the travel agent. A part you do not choose
   keeps its record and still keeps the application from completing: a partial return stays partial. A returned part
   cannot be received or changed again in this release."
8. Review: "When you record it: your name, the time and the evidence are kept with the return."
9. Hidden `_rev.original`, `returnTo`. Buttons "Record the return" (primary); "Cancel" → OP-09i.

| State | Condition | Copy and controls |
|---|---|---|
| Return unavailable | `custody.returnAvailable = false` | Items 1–3; CMP-10 of OP-09i item 6; `unavailableButton` "Record the return" described by the notice (AC-13). No form |
| Nothing to return | no part `held`, `received` or `in_transit` | "No part is held now: [part words]." No form |
| Not the assigned operator; CW unavailable; not linked here | as OP-09m | as OP-09m |
| Open | otherwise | Items 1–9 |
| C2, C5, re-render D-W12-09 | — | §2.14, §2.13 |

The page cannot tell a single-linked original whose return the command would accept from the application-level answer
when another original of the same application is shared (STOP-W12-03, §4.3).

### 2.7 OP-09l Share an original with another application `/ops/applications/:applicationId/originals/:originalId/share`

Purpose: record that the same physical item is needed by another application of this group, for example the same
applicant's second visa (BS B30 "linked applications"; same-group linkage grants no other operator's view).

1. Frame; `h1` "Share an original with another application: [item words]".
2. `h2` "Scope": "This original, [item words] ([description]), for another application of this group that is assigned
   to you." For a passport: "This is the passport of [this applicant's name]."
3. `h2` "Evidence": "Shared with" lines (OP-09i item 5).
4. "Application" (`applicationId`, radio, required, none preselected, D-W12-06): one option per candidate: an item of
   `core.ops_work` whose `groupLabel` equals `core.ops_case.group.label`, that is not this application and not already
   linked (D-W12-12). Label "[Surname, Given names] · [service] · Application [reference]". For a passport item, a
   candidate whose applicant name differs from this applicant's name carries the text marker "Different applicant name"
   (Q-W12-04). Empty: "No other open application of this group is assigned to you. An original can be shared only
   between applications that one operator holds; sharing across operators is not available in this release." Cap line
   when `core.ops_work.items` has 500 rows: "Only the first 500 applications assigned to you are read."
5. `h2` "Effect" (visible): "Both applications then show this original. Each part that is not returned keeps every
   sharing application from completing. A shared original can be returned only when every sharing application's
   service allows a shared return. Its custody can be recorded only while one operator holds every sharing
   application. A share cannot be undone in this release. A passport belongs to one applicant: share it only with
   another application of the same applicant. TravelMudra does not check the applicant when you share."
6. Hidden `_rev.original`, `returnTo`. Buttons "Share the original" (primary); "Cancel" → OP-09i.

States: preparation only (no form); not the assigned operator (no form); CW or `core.ops_work` unavailable (§2.0); 50
links (CMP-10 "This original is shared with 50 applications, the most that TravelMudra's pages can show. Owner:
TravelMudra."; no form, D-W12-11); no candidate (the empty line; no form); open; C2 (§2.14; the chosen radio kept);
C5; the D-W12-09 re-render.

### 2.8 SA-03c custody block (WP-06 page) — AM-W12-01

WP-06 §2.5 item 5 "Stays as it is" keeps its other lines. The originals lines are replaced by this block, read from
opt. CW (`core.admin_case` gives the operator names):

1. `h3` "Originals: they stay where they are" with the label "Current" (D-04: the list is this application's originals
   as read now; Core returns every linked original).
2. Per original: "[Item words]: [description]" then the part lines of §2.11.2 grouped by (state, holder, place), for
   example "1 part returned to the travel agent" / "1 part held by a TravelMudra office: Synthetic office, safe B"; "What
   is not known: [statement]" while a holder is uncertain; for a shared original "Shared with [k] other application(s)
   of this group:" and one link per id, "Application [reference]" → `/admin/applications/<id>` (the SuperAdmin may
   read every application; no name is composed).
3. Lines: "Reassignment changes no custody record. Each part keeps its recorded holder and place. The new operator
   records any later receipt, change or return."
4. When an original is shared: "Custody of a shared original can be recorded only while one operator is assigned to
   every application that shares it. If the new operator is not the operator of each application listed above, nobody
   can record that original's receipt, change or return until a SuperAdmin assigns them to one operator. Sharing across
   operators is not available in this release." (The page reads no other application's operator: STOP-W12-03 part
   (f), Q-W12-10.)
5. None: "No original is recorded for this application." CW unavailable: "Originals cannot be read now. A reassignment
   never changes a custody record."
6. Review (WP-06 item 7) keeps "originals, acts and their evidence do not change". Receipt `reassigned` (WP-06 §2.8):
   the current facts add the item lines of item 2, labelled "Current".

The item-level `holderKind` and `location` MUST NOT appear (F-W12-05). The SuperAdmin case page (old, until WP-11) shows
the same read-only block.

### 2.9 OP-02, OP-01 and OP-07 changes (WP-07 and WP-08 pages)

1. **Frame status fact "Originals" (AM-W12-02).** Shown when originals exist or the custody counts are above zero:
   "[n] parts not returned" and, on its own line, "[m] parts with holder uncertain" (each only when above zero); "Every
   part returned to the travel agent" when originals exist and both counts are zero.
2. **Delivery & originals tab, section "Originals" (AM-W12-05)** (`id="originals"`, kept for the docket's anchor),
   shown when the route is physical (`offers.recordOriginal` allowed) or originals exist: the three facts of OP-09 item
   3 and the link "Open the originals" → OP-09 (`from` kept). Read-grant reader: the same link (OP-09 is read only for
   them). No form.
3. **Action panel (AM-W12-04)** row for `return_original`, by Core's reason code (§1.8).
4. **OP-01 view rule (AM-W12-03).** Test: with a parked return, the view count, the page and the navigation count
   agree.
5. **Custody incident link.** `custodyTraceNeeded` keeps its rule; `originalsHref` becomes OP-09 of the application
   (OP-01 rows and the docket). `nextStepTarget` (`case.ts:72`) for `record_custody_receipt` and `return_original`
   targets OP-09 (label "Go to the originals").
6. **OP-07 row `originals` (AM-W12-06).** Detail sentences of §2.11.4; "Where": "Originals" → OP-09.

### 2.10 TA-07 "Original documents" section and travel-agent sentences

1. **Section** (`id="originals"`, `h2` "Original documents"; replaces the carried `originalsSection`), shown when
   `case.originals ≠ null`: lead "This service works with the applicant's physical originals. TravelMudra records each
   original it receives, who holds it and its return." `summaryList` "Originals this service uses: [item words]" ("Not
   named by the service" when the list is empty). CMP-10 boundary (unavailable tone, parked): "Custody details of
   originals are not shown to travel agents in this release: whether TravelMudra recorded receiving an original, who
   holds it and where it is. Owner: product owner." The strings the system test reads stay
   (`ta-documents-originals.test.ts:192-198`); the owner line is added.
2. **Completion sentence** (AM-W12-07, in the WP-08 TA section).
3. **Next-action words** for `return_original` (`presentation.ts:298`, applied by the architect): with reason
   `original_held`: "TravelMudra returns the original documents to you. The application stays open until then."; with
   reason `parked_custody_route_policy`: "Returning original documents through TravelMudra is not available in this
   release. The application stays open until they are returned. Owner: product owner." The words name no holder and no
   place.

### 2.11 Closed word tables

#### 2.11.1 Holder words (staff)

| Holder kind | Words |
|---|---|
| `tm_office` | "a TravelMudra office" |
| `tm_person` | "a TravelMudra staff member" |
| `courier` | "a courier" |
| `authority` | "the authority" |
| `ta` | "the travel agent" |
| `unknown` | "Holder uncertain" |
| other | "Unrecognised holder" + "Reference code: [code]" |

Item words: `passport` → "Passport"; another code → the code in words ("birth_certificate" → "Birth certificate").

#### 2.11.2 Part words and part lines

| Part state | State words | Part line (holder and place) |
|---|---|---|
| `expected` | "Expected" | "Not received yet" |
| `received`, `held` | "Held" | "Held by [holder words]: [location or 'place not recorded']" |
| `in_transit` | "In transit" | "In transit with [holder words]: [location or 'place not recorded']" |
| `returned` | "Returned to the travel agent" | "Returned to the travel agent" |
| `unknown` | "Holder uncertain" | "Holder uncertain" |
| other | "Unrecognised state" + reference code | — |

Grouped lines (OP-09 rows, SA-03c, OP-02 tab): parts with the same (state, holder, place) form one line, "[n] part(s)
[part line]" in part-number order of their first part; a group of one names the part: "Part 1, Passport booklet: held by
a TravelMudra office: Synthetic office, safe A".

#### 2.11.3 Item line (derived from the parts, never from the item-level holder)

| Parts | Item line |
|---|---|
| every part `returned` | "Returned to the travel agent: every part" |
| some `returned`, none `unknown` | "Partly returned: [r] of [t] parts returned" |
| some `unknown` | "Holder uncertain for [u] of [t] parts" and, when some are returned, "; [r] returned" |
| every part `expected` | "Expected: no part received yet" |
| otherwise | "Not returned: [t − r] of [t] parts" |

#### 2.11.4 Completion detail sentences (staff, OP-07 and OP-09 item 3)

| Code of the `originals` prerequisite | Sentence |
|---|---|
| none (met) | "No original holds completion." |
| `original_held` | "[n] parts are not returned to the travel agent (held, in transit or expected)." ([n] from `custody.heldOriginals` when CW reads; else without the number) |
| `custody_evidence_missing` | "The holder of [m] parts is uncertain. A part with an uncertain holder is never counted as returned." |
| other | Core's sentence (`sentence`) with "Reference code: [code]" |

### 2.12 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource | Summary test | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|
| `original` | OP-09i (OP-09 when the location fell back) | `application`, path id | `originalId` matches `^org_` and equals the path original; no `movementId` key | "Original recorded as received" | "Original [reference]" | Item line; part lines; "Parts not returned: [n]" |
| `movement` | OP-09i | `original`, path id | `movementId` matches `^omv_`; no `state` key | "Custody change recorded" | "Change [reference]"; when `incidentId`: "A custody incident is open: [link /ops/incidents/<id>]" | Part lines; item line |
| `returned` | OP-09i | `original`, path id | `movementId` matches `^omv_` and `state` ∈ `ORIGINAL_STATES` | "Return to the travel agent recorded" | "State after the return: [§2.11.3 words of `summary.state`]"; for `partly_returned`: "Partly returned. The parts not returned still keep the application from completing." | Part lines; Core's `originals` prerequisite |
| `linked` | OP-09i | `original`, path id | `applicationId` matches `^app_`; no `movementId` key | "Original shared with another application" | "Shared with application [reference]" (and the applicant name when it is in the reader's `core.ops_work`) | "Shared with" lines |

No receipt shows an accepted time or a command name (P-02, P-10 b pending). A receipt whose check fails reads unchecked
(WP-01 A-04). The receipt facts never come from the address `done` code alone.

### 2.13 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| Movement, return, share | `_rev.original` (`requireRevision`, `common.ts:51-53`) | Parts (you saw [part line] / current [part line]) per chosen part; Shared with (current count); "Another custody record of this original was made since you opened the page." The typed values stay in the form when it still applies |
| Receipt | none (Core takes no revision) | Not CMP-14; a duplicate is `original_already_recorded` (§2.14) |

"Who changed it and when" rows are absent (no read carries them, STOP-W12-02), never "unknown".

### 2.14 Refusal sentences (closed table)

Category plus code selects the sentence; Core's field codes (`validation_failed`/`input_invalid` with `fieldErrors`)
select by field and code. The table lives in `words.ts` (U0). Existing `CORE_MESSAGES` entries stay unless listed.

| Form | Category / code (field) | Sentence | Where |
|---|---|---|---|
| receipt | `control_blocked` / `preparation_only_holds_no_originals` | "A preparation-only service holds no originals. Nothing was recorded." | form-level |
| receipt, share | `control_blocked` / `custody_path_not_declared` | Receipt: "This service holds no physical originals. Nothing was recorded." Share: "That application's service holds no physical originals. Nothing changed." | form-level / `applicationId` |
| receipt | `control_blocked` / `application_not_open` | "This application is closed. A new original cannot be recorded for it." | form-level |
| receipt | `input_invalid` (`itemType`: `item_type_undeclared`) | "This service does not name that item type. Enter a type the service names, for example passport." | `itemType` |
| receipt | `input_invalid` (`label`: `required`) | "Name the item. A name is needed for every item other than the passport." | `label` |
| receipt, movement (arrival) | `control_blocked` / `custody_evidence_missing` | "Confirm that you hold it now. A scan, a parcel label or a courier receipt alone is not enough. Nothing was recorded." | `possessionAttested` |
| receipt | `input_invalid` (`holder.kind`: `holder_not_in_custody`) | "Choose who holds it: a TravelMudra office or staff member, a courier or the authority." | `holder.kind` |
| receipt | `input_invalid` (`receivedParts`: `not_a_part`) | "Enter the line numbers of the parts you hold, from 1 to [number of lines]." | `receivedParts` |
| receipt | `conflict_duplicate` / `original_already_recorded` | "This item is already recorded for this group, for this or another application. Nothing new was recorded. If it is linked to another application assigned to you, open that application's originals and share it with this application. Otherwise ask a SuperAdmin: sharing across operators is not available in this release." | form-level |
| receipt | `validation_failed` / `applicant_key_missing` | "TravelMudra cannot link a passport to this applicant: the applicant's passport details are incomplete. Nothing was recorded." | form-level |
| movement, return | `input_invalid` (`parts`: `not_a_part`) | "Choose parts of this original: [numbers and labels]." | `parts` |
| movement, return | `input_invalid` (`parts`: `part_returned`) | "A chosen part was returned to the travel agent. A returned part cannot change in this release." | `parts` |
| movement | `input_invalid` (`parts`: `part_not_expected`) | "A chosen part is not expected: it was received already. Choose 'Parts were sent or handed on' or 'Parts are now with another holder'." | `parts` |
| movement | `input_invalid` (`parts`: `part_not_received`) | "A chosen part has not arrived yet. Record its arrival first ('Expected parts arrived')." | `parts` |
| movement | `input_invalid` (`uncertainty`: `required`) | "Say what is known and what is not. It is needed when the holder is uncertain." | `uncertainty` |
| movement | `input_invalid` (`toHolder.kind`: `holder_not_in_custody`) | "Parts that arrived need a known holder." | `toHolder.kind` |
| movement | `input_invalid` (`toHolder.kind`: `use_return`) | "To hand parts back to the travel agent, record a return." with the link OP-09t | `toHolder.kind` |
| return | `input_invalid` (`parts`: `part_not_held`) | "A chosen part is not held now (expected, returned, or holder uncertain). Only held or in-transit parts can be returned." | `parts` |
| return | `control_blocked` / `custody_evidence_missing` | "The evidence does not show the travel agent's receipt in a way this service's return policy accepts. Add evidence of another kind. Nothing was recorded." | evidence |
| return, share | `unavailable_parked` / `parked_custody_route_policy` | Return: CMP-10 of OP-09i item 6. Share: CMP-10 "Sharing this original is unavailable: an application that shares it is assigned to another operator. Sharing across operators is not available in this release. Owner: product owner." | form-level |
| share | `conflict_duplicate` / `duplicate_operation` | "That application already shares this original. Nothing changed." | `applicationId` |
| movement, return | `not_found_or_forbidden` (D-W12-09 re-render) | "You are still this application's operator. TravelMudra did not record this, because an application that shares this original is not assigned to you now. Custody of a shared original can be recorded only while one operator holds every sharing application. Nothing was recorded. A SuperAdmin can assign the sharing applications to one operator." | form-level |
| share | `not_found_or_forbidden` (D-W12-09 re-render) | "TravelMudra did not share the original: the application you chose is not assigned to you now, or it is in another group. Nothing changed." | `applicationId` |
| every form | `stale_revision` | CMP-14 (§2.13) | — |
| every form | evidence codes (`evidence_kind_unknown`, `evidence_version_not_usable`, `invalid_id`; a note with an address) | WP-07 evidence-row sentences | the row |
| every form | `instant_invalid`, `instant_in_future` (`eventAt`) | "Enter a date that is not in the future." | `eventAt` |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden` (other cases), `unauthenticated`, `maintenance`, `unavailable_dependency` | Shell (LD-14; `answer`) | — |
| every form | unknown code | Category text + "Reference code: [code]" | form-level |

### 2.15 Input parsing in the handlers (LD-17)

Every field is read whole. Input over a limit is refused at its field with every value kept; the command is not sent.
No handler drops a token, a line or a row.

| Field | Rule | BFF refusal (field) |
|---|---|---|
| `itemType` | trim; 1–40 characters | "Enter the item type (up to 40 characters)." |
| `label` | trim; empty → left out; ≤ 120 | "Up to 120 characters." |
| `description` | trim; 1–200 | "Enter a description (up to 200 characters)." |
| `parts` (receipt) | split at line breaks (CR LF or LF); trim each line; drop empty lines; 1–50 lines; each ≤ 120 characters. A comma is part of a name (D-W12-05) | "Enter at least one part." / "Up to 50 parts." / "Line [n] has more than 120 characters." |
| `receivedParts`, `parts` (movement, return) | tokens separated by spaces or commas; each token a whole number 1–50; at least one; repeated numbers kept (Core removes repeats) | "'[token]' is not a part number. Enter numbers such as 1 or 1 2." |
| `holder.location`, `toHolder.location` | trim; empty → left out; ≤ 200 | "Up to 200 characters." |
| `uncertainty` | trim; empty → left out; ≤ 500 | "Up to 500 characters." |
| `holder.kind`, `toHolder.kind`, `kind` | the posted value is sent as typed (Core checks the closed set) | — |
| `possessionAttested` | `yes` → true; absent → false | — |
| `evidence.<n>.kind\|id\|note` | every indexed row is read (any `n`); a row with empty kind and id is left out; more than 5 rows → refused | "Up to 5 pieces of evidence." (form-level) |
| `eventAt` | `YYYY-MM-DD` → `YYYY-MM-DDT00:00` (India time, the WP-07 helper without its `slice`); any other value sent whole if ≤ 40 characters | "Enter a date such as 2026-10-12." |
| `applicationId` | `zWireId('app')` | "Choose an application." |
| `returnTo` | `^app_[0-9A-Z]{26}$` | §1.5 |

Current code that this replaces: `f()` slices every field (`case-work.ts:446`); the receipt's `parts` splits at commas
and slices to 50 parts of 120 characters (`:569-570`, the input mapping of the route at `:566`); `numbers()` drops any
token that is not one or two digits (`:450`); `instant()` slices (`:449`); `evidenceRowOf` reads one row
(`evidence-form.ts:7-13`).

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Originals register across applications (STOP-W12-01) | Per-application OP-09 only; rail destination hidden; OP-02, OP-07, OP-01 docket links lead to it | Rail "Originals" (`/ops/originals`, shown when the register's "physical route in scope" flag is true): every original of the reader's assigned applications with the application named, filtered by holder and part state (for example "in transit with a courier") |
| Movement and return history (STOP-W12-02) | OP-09i item 7 sentence | OP-09i "Earlier records": kind, parts, from and to holder, possession statement, evidence, who recorded it, event time and recorded time (CMP-09); return recipient and evidence kinds |
| Per-original offers and sharing facts (STOP-W12-03) | Facts mapping with a parity test (D-W12-10); D-W12-09 re-render; the application-level return answer; SA-03c conditional sentence | Forms shown by Core's per-original evaluations; "Shared with an application of another operator: custody cannot be recorded" before any attempt; SA-03c states the consequence for the chosen operator |
| Declared item types (STOP-W12-03) | `itemType` text field | `itemType` radio group of the declared types, none preselected |
| Recipient evidence kinds of the return policy (STOP-W12-03) | Generic lead on OP-09t | OP-09t names the accepted kinds |
| Holder reference (STOP-W12-03) | Place field carries "with whom" | `holder.ref` field and its words in part lines |
| Command identity in receipts (P-10 b, S-08) | §2.12 summary keys | `commandName` and `acceptedAt` from `core.operation` |
| Read bound (STOP-W12-04) | UI caps at 50 (D-W12-11) | Core refuses the 51st receipt or link, or the read pages; the UI caps follow Core's answer |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at f78e558 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical record and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Receipt | Same `_op` (double click, browser resend) | K-STD replay; the same 303 and receipt; one original | None | Yes (receipt new) |
| Receipt | New `_op`, same item, second tab or after a reload | `original_already_recorded` (unique group and key, `originals.ts:126-131`); §2.14 sentence; OP-09n lists the existing item | None | Partly (generic sentence) |
| Receipt | New `_op`, same non-passport item with a differently spelt name ("Birth cert" / "Birth certificate") | Core accepts a second item (key = type + lower-cased name). OP-09n item 3 lists the items already recorded before the fields | Two records of one physical item; no correction (STOP-W12-05) | No (no list before the form) |
| Movement | Same `_op` | Replay | None | Yes |
| Movement | Second tab loaded before the first change | `_rev.original` moved → CMP-14 with the current part lines | None | Partly (generic text) |
| Movement | After a reload, the same change again (same parts, same holder) | Core records a second movement (no business duplicate guard for a holder update); the page shows the current holder of each chosen part in Evidence before the button | Two identical movement records with their times (P2, STOP-W12-06) | Yes (same) |
| Movement | Arrival recorded twice | Second: `part_not_expected` → §2.14 | None | Partly |
| Return | Same `_op` | Replay | None | Yes |
| Return | New `_op` for a part already returned | Stale revision, or `part_not_held` → §2.14; nothing changes | None | Partly |
| Share | Same `_op` | Replay | None | Yes |
| Share | New `_op`, same target | `duplicate_operation` or stale revision → §2.14 | None | Partly |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same task page at the POST address, CMP-07 focused, `restorePath` = the GET page | Every typed value and choice; the statement checkbox clear | — |
| A form that no longer applies (every part returned meanwhile; return became unavailable) | The new state; the WP-09 unsent text block with the typed text (description, place, uncertainty) | Typed text, read only | The form |
| Shared original with mixed operators (D-W12-09) | Task page re-rendered with the §2.14 sentence | Typed values | Nothing recorded |
| Access lost (reassigned, read grant ended, suspended) | Shell SH-02 or sign-in (LD-14) | — | Typed values (B10: restricted content removed) |
| Core unreachable before a command | SH-02 "TravelMudra is unavailable now" | — | The form; the reader opens the page again |
| Answer lost | Operation page (CMP-13) | — | No new submission is offered |
| CW unavailable | OP-09/OP-09i facts "cannot be read now"; task pages without a form | Frame | — |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Partial return** | Item line "Partly returned: [r] of [t] parts returned"; Core's `originals` prerequisite "Not met" (`original_held`); OP-07, OP-09 item 3 and the frame say "[n] parts not returned"; no page says "Returned" for the item; the return receipt's recorded state is `partly_returned` | Partly (the case page lists parts; no completion link) |
| **Holder uncertain** | Part "Holder uncertain"; item line "Holder uncertain for [u] of [t] parts"; the uncertainty statement; a custody incident owned by the assigned operator (link in the receipt and on OP-09); `originals` prerequisite "Not met" with `custody_evidence_missing`; the part is not offered for return; never "returned"; no loss control (parked) | Partly (statement shown after the part is found, F-W12-14) |
| **Holder uncertain on a partly returned item** | `aggregateState` gives `uncertain` and hides the partial return: the item line comes from the parts and names both ("Holder uncertain for 1 of 2 parts; 1 returned") | No |
| **Found again** | A holder update to a known holder sets the part "Held"; the incident stays open until resolved (WP-14); the statement reads as the earlier statement | Partly |
| **Receipt after return** (the same part comes back; or the same passport arrives again in this group) | Movement "arrived" on a returned part → `part_returned`; a new receipt of the same item → `original_already_recorded`. No product route: boundary "A returned original cannot be recorded again for this group in this release. Owner: product owner." on OP-09n when the existing item linked to this application is fully returned (STOP-W12-05 e) | No (generic refusal) |
| **An expected part that never arrives** | It counts as not returned and holds completion; no command removes it (loss and correction parked). OP-09n warns before the record (§2.4 item 4 hint); OP-09i shows "Expected"; boundary as OP-09i item 6 (STOP-W12-05 d) | No (no warning) |
| **An item recorded on the wrong application** (operator on the wrong page) | For a passport Core keys the record to this application's applicant: the real passport of this applicant is refused later. OP-09n shows the identity block to check against and the scope sentence; no correction route (STOP-W12-05 c) | No |
| **An item linked to the wrong application** | Candidates only from the reader's own open applications of this group (named); passport candidates with another applicant name carry the "Different applicant name" marker and the effect warning; Core does not check the applicant and has no unlink (STOP-W12-05 a, b). A hand-made post naming another operator's application or an application of another group → `not_found_or_forbidden` → the D-W12-09 share sentence ("not assigned to you now, or in another group"), which names nothing about the target; nothing is linked | No (raw `app_…` text field, F-W12-08) |
| **Reassignment mid-movement** (this application reassigned while OP-09m is open) | The command is refused for access; the re-read fails → shell "no access"; nothing recorded; custody rows unchanged | Yes |
| **Reassignment of a sharing application** | Both operators lose custody recording of the shared original (policy null operator). The SuperAdmin is warned on SA-03c (§2.8 item 4). Operators: D-W12-09 re-render after a refused record. Recovery: SuperAdmin assigns the sharing applications to one operator | No (shell 404 for an operator who still holds the case, F-W12-10) |
| **Reassignment while a part is in transit** | Custody unchanged; the new operator sees "In transit with a courier"; records the return to office by "Parts are now with another holder" | Yes (words new) |
| **Undeclared shared-item visibility** | A third operator with an application in the same group sees no original that is not linked to their application (OP-09 lists only linked originals; OP-09i of another original → 404). After a reassignment, the operator of one sharing application sees the original (linked to their application) and the other application only as "Another application of this group, not among your open applications" | Yes for the reads; No for the words (ids today) |
| **Withdrawn application with a part not returned** | Withdrawal is an outcome: the application stays submitted and assigned, OP-01 shows its `return_original` step (AM-W12-03 view by reason), and OP-09 keeps every action Core allows; a passport that arrives after the withdrawal can still be recorded and then returned | Partly (words new) |
| **Return policy unavailable (parked)** | CMP-10 with owner "product owner" on OP-09i and OP-09t; OP-01 places the post-outcome row in "Delivery and closure", not "Action now" (AM-W12-03) | Partly (no owner; Action now) |
| **Shared original whose sharing applications differ in return policy** | Application-level `returnAvailable` is false for each: the boundary shows on both; Core decides at the command | Yes |
| **Two originals on one application, one shared** | Application-level `returnAvailable` is false, so the return of the single-linked original is not offered although Core would accept it: a served action hidden (P2; STOP-W12-03) | Yes (same) |
| **Access revoked mid-page** (read grant ends, operator suspended, application reassigned) | The next read or command: SH-02 "no access" or sign-in; no earlier facts remain (LD-14) | Yes |
| **TA reads the case** | No custody detail (no description, part label, holder, place, statement, reference); the completion sentence is neutral (AM-W12-07) | Partly (the WP-08 sentence) |

### 4.4 Access and accounts changing mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| Operator reassigned between OP-09t load and submit | Refused for access; the re-read fails → shell; nothing recorded | Yes |
| The other sharing application reassigned between load and submit | D-W12-09 re-render; nothing recorded | No (shell 404) |
| Share target reassigned to another operator after the page loaded | Refused (`not_found_or_forbidden` at the target, or parked when the target became a sharing application of another operator) → D-W12-09 share sentence | No |
| A receipt address opened by another reader | `core.operation` answers "no record yet": unchecked receipt, no facts | Yes |
| Read grant ends while OP-09i is open | Next read: SH-02 | Yes |

### 4.5 Counts, caps and long lists (200 items)

| Situation | Required behaviour |
|---|---|
| 200 applications in a group, each with a passport, one operator | Each OP-09 lists its own originals; nothing across applications (STOP-W12-01). OP-09l lists up to 200 candidates as one radio group with wrapping labels; no nested scroll |
| An original of 50 parts | OP-09i lists 50 rows (cards on phones); grouped lines elsewhere keep OP-09, OP-02 and SA-03c short |
| 50 originals on one application | OP-09 table of 50 rows; no receipt offered (D-W12-11) |
| An original shared with 50 applications | OP-09i lists 50 lines (named only for the reader's open applications); no share offered (D-W12-11) |
| A 51st original or link reached by a hand-made post (or a share into an application that holds 50 originals from another application's page) | Core accepts it; the read of every linked application then fails as "unavailable" (STOP-W12-04). The pages show "cannot be read now" (truthful about the read, silent about the cause) |
| `core.ops_work` at 500 rows | Cap line on OP-09l; OP-09i names only applications in the read |

### 4.6 Device and environment

JavaScript off: every page works (plain forms; no conditional fields; the uncertainty and possession fields carry their
own condition in the label). 320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: radios,
checkboxes and links in reading order; the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-12

- One `h1` per page; frame and task parts are `h2` (AC-03).
- Radio groups (`holder.kind`, `toHolder.kind`, `kind`, `applicationId`) are `fieldset` with a `legend`; none is
  preselected; after a refusal the chosen value is kept (AC-15).
- The parts textarea has a visible hint with the line rule; its error names the line number.
- State, holder and the "Holder uncertain" and "Different applicant name" markers are text with an icon, never colour
  only (AC-06).
- Every unavailable control (`unavailableButton` "Record a return") has `aria-disabled="true"` and `aria-describedby`
  to its CMP-10 (AC-13).
- The parts table has a caption ("Parts of [item words]"); grouped lines are a list (`ul`).
- Receipts are announced politely without moving focus (AC-09).

## 6. Proof V18 on `lane-ui`

V18 (UX §12): "Partial original return holds applicable completion; reassignment does not move custody; undeclared
shared-item policy does not grant other operators visibility" (B19, B24, B30).

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone, ref `ui-revamp-2026-10-12`). At
  the WP-12 proof it holds the integrated WP-02, WP-03 and WP-06 to WP-11 pages (package order; inference). Synthetic
  data only.
- Offerings with a physical route (fact, seed; both in the seed's `launch` list): "SYN Paper visa with original
  return" (`syn_paper_return`: passport; return policy supported and owner-approved synthetic; accepted recipient
  evidence attestation and document_version; shared return `single_application_only`) and "SYN Business visa (paper)"
  (`syn_business_paper`: passport; return policy parked). Inference: both are selectable for syn-ta-1 on TA-03 (the
  system test `ta-documents-originals.test.ts:188` creates a business-paper draft); the PM checks TA-03 first.
- Accounts: syn-ta-1; syn-operator-1 (OP1), syn-operator-2 (OP2); syn-superadmin-1 (SA1). Sign-in through the LD-11
  harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px.
- No outcome is recorded in the proof: Core evaluates the `originals` prerequisite before an outcome (`derived.ts:199-200`)
  and WP-08 E-05 shows Core's blockers then. Completion itself is the CMD-48 boundary (LD-04). The post-outcome pending
  answer (`return_original`) is proven by test.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W12-09)

Run tag `wp12-[yyyymmddhhmm]`. As syn-ta-1: create group `wp12-[stamp]` (travel +30/+40 days). Add, with unique
synthetic passports: applicant R ("Synret, Asha"): P on "SYN Paper visa with original return"; applicant D ("Synshare,
Dev", the same identity facts twice): B on "SYN Business visa (paper)" and P2 on "SYN Paper visa with original return";
applicant E ("Synother, Esha"): E1 on "SYN Business visa (paper)". Upload the mandatory documents (TA-09f); submit all
four (TA-08). As SA1: record "Payment received" for each (SA-07a); assign P, B and P2 to OP1 and E1 to OP2 (SA-03a).
Seeded data is not changed.

### 6.3 Steps and observable results

"L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V18-P1 | OP1, OP-02 of P (Delivery & originals) → OP-09 | Read; open "Open the originals" | Section "Originals" with "Parts not returned: None"; OP-09 route line; no return row (Core answers no return availability before an original exists, `custody.ts:67`); "No original is recorded for this application."; "Record an original received" | L |
| V18-P2 | OP1, OP-09n of P | Read; record: type `passport`; description "SYN booklet, blue cover"; parts "Passport booklet" and "Old passport, cancelled" on two lines; held now "1 2"; holder "A TravelMudra office", place "Synthetic office, safe A"; evidence external reference `SYN-CR-[stamp]`; today's date; statement ticked | Identity block before the fields (full synthetic passport number only here). Receipt on OP-09i "Original recorded as received"; two parts, the second named "Old passport, cancelled" (the comma kept); both "Held by a TravelMudra office: Synthetic office, safe A" | L |
| V18-P3 | Harness | Resend the P2 POST (same `_op`); then post the same content with a new `_op` | Same 303 and receipt, one item on OP-09; second: 409 "This item is already recorded for this group …"; still one item | L |
| V18-P4 | OP1, OP-07 and OP-02 of P | Read | `originals`: "Not met: 2 parts are not returned to the travel agent …"; frame "2 parts not returned" | L |
| V18-P5 | OP1, OP-09t of P | Return part 1 only, evidence "My statement" `SYN-RET-[stamp]` | Effect text visible before the button. Receipt "Return to the travel agent recorded", "State after the return: Partly returned: 1 of 2 parts returned. The parts not returned still keep the application from completing."; part 1 "Returned to the travel agent", part 2 "Held by a TravelMudra office: Synthetic office, safe A" | L |
| V18-P6 | OP1, OP-07, OP-09, OP-02 of P; syn-ta-1, TA-07 of P | Read | Staff: "Not met: 1 part …"; item line "Partly returned: 1 of 2 parts returned"; the word "Returned" never stands alone as the item's state. TA: "Original documents" with item types and the boundary with "Owner: product owner"; no description, part label, holder or place | L |
| V18-P7 | Harness | Post a return of part 1 again with the current revision | 422 at `parts`: "A chosen part is not held now …"; nothing changes | L |
| V18-P8 | OP1, OP-09m of P | "Parts are now with another holder…", part 2 (one-part rule: shown as text), "Holder uncertain", statement "SYN: not in safe A on [date]" | Receipt "Custody change recorded" with "A custody incident is open" (link); item line "Holder uncertain for 1 of 2 parts; 1 returned"; OP-07 "The holder of 1 part is uncertain …"; OP-09t: part 2 under "Cannot be returned now"; OP-01: the row with the marker "Original's whereabouts uncertain" (WP-07 tier 1) | L |
| V18-P9 | OP1, OP-09m of P | Part 2 → "A TravelMudra office", "Synthetic office, safe B" | Part 2 "Held by a TravelMudra office: Synthetic office, safe B"; "Statement recorded when a part's holder became uncertain: … Every part's holder is known now."; the incident stays open (WP-14) | L |
| V18-S1 | OP1, OP-09n of B | Record D's passport (one part, held now "1", office, "Synthetic office, safe C") | Receipt; OP-09i of B: CMP-10 "Returning originals through TravelMudra is unavailable until the return policy is approved … Owner: product owner." and the disabled "Record a return" | L |
| V18-S2 | OP1, OP-09l of B | Read | Candidates: P2 "Synshare, Dev · SYN Paper visa with original return" and P "Synret, Asha · … · Different applicant name"; E1 absent (OP2's); effect text with the passport warning | L |
| V18-S3 | OP1, OP-09l of B | Share with P2 | Receipt "Original shared with another application", "Shared with application [P2 ref] (Synshare, Dev)"; OP-09 of P2 lists the item; OP-09i of P2: return boundary (shared, B's policy parked) | L |
| V18-R1 | SA1, SA-03c of P | Read; reassign to OP2 with a reason | Block "Originals: they stay where they are" (Current): "1 part returned to the travel agent"; "Part 2, Old passport, cancelled: held by a TravelMudra office: Synthetic office, safe B"; "Reassignment changes no custody record …"; no "held by" for the returned part; receipt current lines identical | L |
| V18-R2 | OP1; OP2, OP-09i of P | OP1 opens P's item address; OP2 reads and returns part 2 (OP-09t) | OP1: SH-02 no access. OP2: the same part lines as before the reassignment; return receipt "State after the return: Returned to the travel agent: every part"; OP-07 `originals` "Met" | L |
| V18-V1 | OP2, OP-09 of E1; harness | Read; GET B's OP-09 and `/ops/applications/<E1>/originals/<B's org>`; post a custody change on B's original with `returnTo` = E1 | E1: "No original is recorded …"; both GETs: SH-02; the post: SH-02 (the original is not linked to E1); nothing recorded | L |
| V18-V2 | SA1, SA-03c of P2 | Read; reassign to OP2 | The shared line "Shared with 1 other application of this group: Application [B ref]" and the shared-original consequence sentence | L |
| V18-V3 | OP2, OP-09i of P2 | Read; GET B's OP-02 | The item and its parts; "Another application of this group, not among your open applications" with no name, reference or link; B's OP-02: SH-02 | L |
| V18-V4 | OP1, OP-09m of B | Record a holder update of part 1 | Re-render (D-W12-09): "You are still this application's operator. TravelMudra did not record this …"; values kept; OP-09i of B unchanged. (If Q-W12-02 is declined: SH-02, and the step reads "nothing recorded" only) | L |
| V18-V5 | Harness | OP2 posts a share of the original with E1 (`returnTo` = P2) | 409 CMP-10 "Sharing this original is unavailable: an application that shares it is assigned to another operator … Owner: product owner."; nothing changes | L |
| V18-V6 | SA1, SA-03c of P2; OP1, OP-09m of B | Reassign P2 back to OP1; record the holder update | Accepted; receipt "Custody change recorded" (recovery route) | L |
| V18-T1 | Test | Post-outcome fixtures: reason `original_held` and `parked_custody_route_policy` | OP-01 view and count by AM-W12-03; action panel by AM-W12-04; TA next words by §2.10 item 3 | T |
| V18-T2 | Test | Renderer sweep over OP-09, OP-09i, OP-02 tab, OP-07, SA-03c, TA-07 with fixtures (partly returned, uncertain on a partly returned item, every part returned with the item-level holder still `tm_office`, shared with a non-listed application) | No item reads "Returned" unless every part is returned; uncertain never reads returned; no returned part reads "held by"; no item-level holder; no name or reference of an application outside the reader's `core.ops_work`; TA pages hold no custody detail | T |
| V18-T3 | Test | Handlers: comma in a part name; 51 lines; a 121-character line; "1, 2, 3a"; six evidence rows; a 501-character statement | Each refused at its field with the values kept; never truncated or dropped (LD-17) | T |
| V18-T4 | Test | Caps: 50 originals; an original with 50 links | No receipt offer; no share offer (D-W12-11) | T |
| V18-A | axe | OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l, OP-02 Delivery & originals, OP-07 of P, SA-03c of P, TA-07 of P | No violation at 1440 px and 390 px | L |

### 6.4 Proof split

V18 passes when every L step passes on `lane-ui` and every T step passes as a test. Boundaries stated, not crossed:
completion is requested through the CMD-48 boundary (OP-07 shows Core's prerequisite only); returning the business
paper passport and sharing across operators stay parked (B30, B44). V18-V4 depends on Q-W12-02.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel. Phase C: U6. The architect registers the gallery module in
`scripts/dev/gallery-pages.ts`, applies the one-value TA next-action change in `src/web/ui/presentation.ts` (§2.10 item
3) and edits `DESIGN.md` once at the end (custody words; "item line from parts").

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Custody words and rows** | New `src/apps/staff/originals/words.ts` (§2.11 tables, §2.14 table, item words); new `src/apps/staff/originals/rows.ts` (`partLines`, `itemLine`, `custodyItemRow`, `custodySummary`, `sharedLines` with the visibility rule) | New `test/unit/web/custody-words.test.ts` (every `ORIGINAL_PART_STATES`, `ORIGINAL_STATES` and `ORIGINAL_HOLDER_KINDS` value has words; unknown values fall back with the code; item line from parts in every combination of §2.11.3; no line uses the item-level holder; a linked id outside the reader's list renders without name, reference or link; every §2.14 code has a sentence) | — |
| **U1 OP-09 pages** | New `src/apps/staff/originals/pages.ts` (OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l renderers) | New `test/unit/web/originals-pages.test.ts` (states in order; forms only by the §2.0 rule; one-part hidden `parts`; no preselected radio; statement never prechecked; identity block only on OP-09n; read-grant reader without forms; return boundary with owner; caps; receipts per §2.12 with the summary tests; parity test of the facts mapping against the command guards with its listed discrepancies) | `scripts/dev/gallery/originals.ts` |
| **U2 OP-09 routes** | New `src/apps/staff/originals/routes.ts` (GET `ops.originals.list`, `.item`, `.receipt_form`, `.movement_form`, `.return_form`, `.share_form`; POST `ops.custody.receipt`, `.movement`, `.return`, `.link` moved from `case-work.ts` with the §2.15 parsing, receipt locations, re-render with `restorePath`, the D-W12-09 rule) | BFF tests in `test/unit/bff-originals.test.ts`: every §2.15 refusal keeps the values and sends no command; a refused receipt re-renders OP-09n; same `_op` resend answers the same 303; `not_found_or_forbidden` with a readable case and a linked original → re-render with status 409 and the sentence; with an unreadable case → shell; stale → CMP-14 | — |
| **U3 TA section** | `src/apps/shared/core/originals.ts` (§2.10 item 1); the WP-08 TA completion sentence for `originals` (AM-W12-07) in `src/apps/shared/delivery/ta-pages.ts` (or `PREREQUISITE_SENTENCES`, `shared.ts:603`, if WP-08 left it there) | Update the TA section test; new assertion that no TA renderer holds a custody detail from a fixture with every custody fact set | — |
| **U4 Operator reading and WP-07/08 amendments** | `src/apps/staff/work/frame.ts` (AM-W12-02); `src/apps/staff/work/reading.ts` (AM-W12-03, -04; `originalsHref`; `nextStepTarget` target); `src/apps/staff/work/workspace.ts` (AM-W12-05); `src/apps/staff/delivery/completion-page.ts` (AM-W12-06) | Update `test/unit/web/operator-reading.test.ts`, `operator-workspace.test.ts`, `completion-page.test.ts`, `test/unit/nav-counts.test.ts` (a parked return is not counted; an `original_held` return is) | extend `scripts/dev/gallery/workspace.ts` |
| **U5 SA-03c custody block** | `src/apps/staff/assignment/pages.ts` (§2.8; AM-W12-01) | Update `test/unit/web/assignment-pages.test.ts` (part lines; no item-level holder; shared consequence; unavailable read; receipt current lines) | extend `scripts/dev/gallery/assignment.ts` |
| **U6 Wiring and removal** | `src/apps/staff/instance.ts` (route module); `src/web/route-inventory.ts` (six GET entries; the four POST rows keep id, path, action and command); `src/apps/staff/operations/case-work.ts` (remove the originals forms, `originalPost` and the four routes; the originals block becomes `custodySummary` read only for `admin`); `src/apps/staff/core/case.ts`, `src/apps/staff/core/ops.ts` (the `#originals` targets, if WP-07 left these files) | `test/unit/web/routes.test.ts` (six GET rows; POST rows unchanged, `:220`); `test/unit/bff.test.ts`; new `test/unit/web/originals-host-pages.test.ts` (§7.2); the system tests of §7.3 | — |

U0 owns `words.ts` and `rows.ts`; U1 `pages.ts`; U2 `routes.ts`; U3 the TA files; U4 the WP-07 work files and the
WP-08 completion page; U5 the WP-06 assignment pages; U6 the wiring files and `case-work.ts`. No two units edit one
file. Test file names carry no package or proof identifier (WP-10 record).

### 7.2 Host-page test

`test/unit/web/originals-host-pages.test.ts` renders OP-02 (every tab, a physical-route fixture with originals), OP-07,
OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l, the old operator case page and the old SuperAdmin case page, and asserts:
the action paths `/ops/applications/:id/originals` (POST), `/ops/originals/:org/movements`, `/ops/originals/:org/return`
and `/ops/originals/:org/link` each appear as a form action on exactly one renderer (OP-09n, OP-09m, OP-09t, OP-09l);
OP-02, OP-07, OP-09, OP-09i and both old case pages hold none of them.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-work.test.ts:579-615` | Receipt posted from the case page (`op1.get(ops)`, `${ops}/originals`); movement posted from the case page; "Physical originals" and "Returning originals is unavailable until the return policy is decided" on the case page | GET OP-09n for the receipt and OP-09m (`/ops/applications/<app>/originals/<org>/movement`) for the movement (field names and values unchanged; `parts: 'Passport booklet'` is one line); the text assertions move to OP-09/OP-09i with the §2.14 boundary words; the docket and work-row custody assertions stay (their link target becomes OP-09 when several incidents exist) |
| `test/system/ta-documents-originals.test.ts:218-229` | Receipt and movement forms read from the operator case page | GET OP-09n and OP-09m; the TA assertions (`:192-198`, `:231-234`) stay valid |
| `test/unit/web/routes.test.ts:220` | POST `/ops/originals/:originalId/link` row | Unchanged; six GET rows added; inventory counts |
| `test/unit/web/travel-recheck.test.ts:104-106` | "Trace the original (custody incident)" docket text | Unchanged words; the href when several incidents exist becomes OP-09 |
| `test/unit/nav-counts.test.ts:181-190` | Custody incident counting | Unchanged; add the parked-return case (AM-W12-03) |
| WP-07 carried-form tests | Entries for the four originals forms on OP-02 | Removed |

Stay valid: Core-level tests (`test/operations/*` custody tests, `test/delivery/packets-handover.test.ts:335-347`,
`test/integration/launch-control.test.ts:109-134`, `test/ops-tooling/restore-reopen.test.ts:415`).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `ops.record_original_receipt` | OP-09, WP-12 | OP-09n `/ops/applications/:id/originals/new` (form → O31); WP-12. Note: "Possession attested; a passport is keyed to the receipt's applicant" |
| `ops.record_original_movement` | OP-09, WP-12 | OP-09m `/ops/applications/:id/originals/:org/movement` (form → O32); WP-12. Note: "Arrival, movement, holder change or holder uncertain" |
| `ops.record_original_return` | OP-09, WP-12 | OP-09t `…/originals/:org/return` (form → O33); WP-12. Note: "Only under an owner-approved return policy; partial stays partial" |
| `ops.link_original` | OP-09, WP-12 | OP-09l `…/originals/:org/share` (form → O47); WP-12. Note: "Same operator only; no unlink" |
| `core.reassign` | SA-03c, WP-06 | unchanged; note "WP-12 adds the custody block of the preview and receipt (AM-W12-01)" |

Proposed §6 disposition CC-15: "The WP-12 commands leave the operator case page (OP-02 'Delivery & originals'); each
has one host page (OP-09n, OP-09m, OP-09t, OP-09l) under the application's Originals page OP-09. The operator rail
destination 'Originals' stays hidden until Core serves an originals register read (STOP-W12-01)." §5.1 counts
unchanged (WP-12: 4).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W12-01 | P1 | The receipt's `parts` splits at commas and keeps 50 parts of 120 characters (`case-work.ts:569-570`); `f()` slices every field (`:446`) | The operator types "Old passport, cancelled" as one part; two parts are recorded, the second "cancelled" expected and never received; the application can never complete and no command removes the part | Line grammar, whole fields, refusals with values kept (§2.15, D-W12-05) |
| F-W12-02 | P1 | `numbers()` drops tokens that are not one or two digits (`:450`) | The operator returns parts "1, 2, 3a"; parts 1 and 2 are returned, the receipt says "return recorded", part 3 stays held unnoticed | Strict tokens; refusal names the token (§2.15) |
| F-W12-03 | P1 | `itemType` is prefilled `passport` (`:328`) | An operator records a birth certificate and leaves the type; the item takes the applicant's passport key; the real passport is refused as already recorded, with no correction route | No prefill (D-W12-06); scope and "already recorded" lists |
| F-W12-04 | P1 | The receipt and movement forms have no evidence and no date input although the commands take both | A courier receipt number and the true arrival date are lost; the record shows only when it was typed (B33 event vs recorded time) | Evidence rows and `eventAt` (D-W12-07, D-W12-08) |
| F-W12-05 | P1 | WP-06 §2.5 item 5 shows "held by [holder kind]" from the item-level holder, which a return does not change (`originals.ts:77, 292`) | A fully returned passport reads "held by TravelMudra office" in the reassignment preview; the SuperAdmin tells the travel agent the passport is still in the office | AM-W12-01: part lines only |
| F-W12-06 | P2 | The movement form's possession checkbox has no condition in its label | An operator ticks it for a courier handoff; the record says possession was attested for a part they no longer hold | Label "Only when parts arrive…" (§2.5 item 7); the value is sent as chosen |
| F-W12-07 | P2 | The disabled "Record a return" names no owner (`:358`) | The operator does not know who can make returns possible | CMP-10 with "Owner: product owner" |
| F-W12-08 | P1 | The link form asks for a raw application reference (`:363`) | The operator pastes the reference of another applicant's application in the group; the passport is linked to the wrong applicant for good | Radio candidates with names; "Different applicant name" marker (D-W12-12, Q-W12-04) |
| F-W12-09 | P1 | No page lists the originals an operator holds across applications; custody is visible one application at a time (UX §5.2 "Originals" register; UI-PLAN OP-09) | A courier reports a lost parcel; the operator holds 120 passports across applications and cannot find which parts are in transit with that courier without opening each application | STOP-W12-01; interim per-application OP-09 |
| F-W12-10 | P1 | A custody record refused because a sharing application has another operator answers the shell's "no access" page | The operator still holds the case, reloads it, sees the same form, and retries; nobody tells them a SuperAdmin must act | D-W12-09 re-render; SA-03c warning |
| F-W12-11 | P1 | A post-outcome parked return is "Action now" and counted (owner `assigned_operator`, `ops.ts:99-101`) | 40 business-paper cases with outcomes sit in Action now with nothing the operator can do; real work drowns | AM-W12-03 |
| F-W12-12 | P1 | WP-08 TA sentence "TravelMudra still holds an original document" | The TA page says custody details are not shown, then states a receipt and a holder; with an uncertain holder the sentence is false | AM-W12-07 |
| F-W12-13 | P1 | WP-07 status fact "[n] parts held" counts expected and in-transit parts | An operator reads "2 parts held" while one part never arrived; B30 "possession" claimed without evidence | AM-W12-02 |
| F-W12-14 | P2 | The uncertainty statement stays on the item after the part is found (`originals.ts:78`); the case page shows it as current (`case-work.ts:394`) | The operator and a SuperAdmin read "Uncertain: not in safe A" for a part back in the safe | §2.3 item 4 wording |
| F-W12-15 | P2 | The item line for an uncertain item hides a partial return (aggregate `uncertain`) | A SuperAdmin reads "uncertain" and does not see that one part was returned | Item line from parts (§2.11.3) |
| F-W12-16 | P2 | The TA next-action words promise a return while it is parked (`presentation.ts:298`) | The travel agent waits for a return that the product cannot record | §2.10 item 3 |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W12-01 | P1 | Host pages OP-09n, OP-09m, OP-09t, OP-09l; read pages OP-09, OP-09i; forms leave OP-02 (CC-15) | Two forms for one command carry different words; a refusal re-renders a page without the reader's form | Yes |
| Q-W12-02 | P1 | Re-render a movement, return or share refused `not_found_or_forbidden` when fresh mandatory reads prove the reader still holds the application and the original is linked to it (D-W12-09) | A sharing application is reassigned; the other operator's custody record is refused; the shell says "no access" for a case they still hold | Yes: fresh reads still send every real access change to the shell (LD-14 intact); STOP-W12-03 replaces it with per-original offers |
| Q-W12-03 | P1 | Rail "Originals" stays hidden; STOP-W12-01 (register read) goes to the orchestrator for the Core batch | A courier loses a parcel; the operator cannot find which of 120 held passports were with that courier (F-W12-09) | Yes; P1 with the scenario |
| Q-W12-04 | P1 | Passport share candidates with another applicant name: mark them ("Different applicant name") or hide them | Hidden: a same-person application with a typed name variant cannot be shared and its receipt is refused as a duplicate. Marked: an operator can still share the wrong passport, with no undo | Mark and warn now (a name comparison must not become a permission rule); Core's same-applicant guard (STOP-W12-05 a) fixes the class |
| Q-W12-05 | P1 | Part lists without a field-name change: receipt `parts` as lines (D-W12-05); number lists strict; one-part hidden `parts` | Checkboxes per part would need names `parts.<n>` (repeated names are refused, `server.ts:821-830`) | Keep the names now; a checkbox design is a later P2 deviation if UAT shows number entry errors |
| Q-W12-06 | P1 | OP-01: a parked post-outcome return to "Delivery and closure", not counted (AM-W12-03) | F-W12-11 | Yes (F-07 class) |
| Q-W12-07 | P2 | Evidence rows and `eventAt` on receipt and movement (existing contract inputs; new on the forms) | F-W12-04 | Yes |
| Q-W12-08 | P2 | UI caps at the wire maximum (50 originals per application; 50 links per original) until STOP-W12-04 is fixed | A 51st share makes every sharing application's work panels unreadable | Yes; Core fix requested |
| Q-W12-09 | P1 | Proof writes on `lane-ui`: one group, four applications, three originals, one share, two reassignments and one reassignment back, returns, harness posts | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only |
| Q-W12-10 | P2 | SA-03c shared-original consequence as a conditional sentence with links, not a composition of every sharing application's operator | The SuperAdmin must open each sharing application to see its operator | Accept; Kind 1 part (f) of STOP-W12-03, joins P-10 d |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W12-01 | Operator rail destination "Originals" (UI-PLAN §2.2) not shown | None (no route added) |
| D-W12-02 | Six new GET pages under `/ops/applications/:id/originals…`; the task pages' forms post to the existing `/ops/originals/:org/*` and `/ops/applications/:id/originals` paths; a refusal shows at the POST address with `restorePath` | New routes and inventory entries; actions and fields unchanged |
| D-W12-03 | Success locations move to OP-09i with `&op=`; done codes kept | Locations change; system tests change their GET source |
| D-W12-04 | Forms leave the operator case page (OP-02 "Delivery & originals"); the SuperAdmin case page keeps a read-only summary | Host pages change |
| D-W12-05 | Receipt `parts` is a textarea, one part per line (was comma separated); number lists are parsed strictly; an item with one part not returned gets a hidden `parts` | Field names unchanged; value grammar of `parts` (receipt) changes |
| D-W12-06 | `holder.kind`, `toHolder.kind`, `kind` and `applicationId` become radio groups, none preselected; `itemType` loses its prefilled value | Names and values unchanged |
| D-W12-07 | Evidence rows `evidence.<n>.*` (n = 0…4) on the receipt and movement forms; the return form reads every row | Existing names; the handlers read every row |
| D-W12-08 | `eventAt` ("Date …") on receipt, movement and return; the handlers map it | New form field (existing contract input) |
| D-W12-09 | A movement, return or share refused `not_found_or_forbidden` re-renders (status 409) when fresh mandatory reads prove the reader still holds the application | Handler behaviour; LD-14 kept (no catch-all) |
| D-W12-10 | Movement, return and share offered by Core's facts with a parity test | None (Core decides at the command) |
| D-W12-11 | No receipt offer at 50 originals; no share offer at 50 links | None (technical limit of the read) |
| D-W12-12 | Share candidates from `core.ops_work` filtered by group label (no group id on the rows); Core refuses another group | None |
| D-W12-13 | Glossary "Returned to owner" written "Returned to the travel agent" | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W12-01 | Kind 1 (P1) | Originals register read for an operator: every original linked to an application assigned to the reader, with item type, description, part states, holders and places, uncertainty, link count, and the application (id, applicant name, service, outcome); filters by holder kind and part state; a flag "a physical route is in the reader's scope" | UX §5.2 "Originals: assigned/scoped item register"; UI-PLAN OP-09 and its read model (§6.3); F-W12-09 | 1 facts stored (`ops_originals`, links, parts, assignment); 2 removes a composition of one `ops.case_work` read per assigned application (up to 500 per page view); 3, 4 hold | Per-application OP-09; rail hidden; the post-outcome return step shows on OP-01 per application. **P1** |
| STOP-W12-02 | Kind 1 (P1) | Movement and return history per original: kind, parts, from and to holder, possession statement, evidence, actor, recorded time and event time; return recipient and evidence kinds (`ops_original_movements`) | UX §2.1 "item-level holder, movement and return evidence"; UI-PLAN OP-09 item detail; B33 event vs recorded time; a dispute about a return needs its evidence | 1 facts stored; 2 removes no inference but no page can show the facts otherwise (staff history uses the TA lines); 3, 4 hold | OP-09i item 7 sentence. **P1** |
| STOP-W12-03 | Kind 1 (P2) | On `ops.case_work.originals[]`: (a) per-original `movementOffer`, `returnOffer`, `linkOffer` for the viewer; (b) per linked application `assignedToViewer`; (c) declared item types; (d) the return policy's accepted recipient evidence kinds; (e) `holder.ref` per part; (f) for SA-03c (with P-10 d), each sharing application's operator; (g) the original id on `custody_discrepancy` incident rows | Forms by Core's answer (D5) instead of the facts mapping and the D-W12-09 re-render; truthful return offer when one original of several is shared | 1 facts exist; 2 removes page-side permission mapping and a refusal-driven discovery; 3, 4 hold | D-W12-09, D-W12-10, text fields and generic hints. P2 |
| STOP-W12-04 | Defect (P1) | Core accepts any number of originals per application and of links per original (`originals.ts:126-139, 179`; `facade.ts:49-62`), but `zWireCaseWork` encodes at most 50 of each (`contracts/operations-work.ts:190-194`); a larger value fails `encodeWire` (`encoding.ts:64-65`) and the BFF reads it as `unavailable_dependency` (`core-client.ts:163`) | A group invitation letter shared by 60 applications of one operator: from the 51st share, the readiness, evidence and custody panels of all 51 applications read "Unavailable" for good, which looks like an outage | — (defect; fix: refuse the 51st at the command, or page the read) | UI caps (D-W12-11); a share into an application that already holds 50 originals is not prevented. **P1** |
| STOP-W12-05 | Kind 2 (P1; close to the B44 parked "generic erroneous-case cancellation") | No correction route for a custody record: (a) no same-applicant guard when a passport is linked; (b) no unlink; (c) no void of a receipt recorded on the wrong application; (d) no removal of an expected part that never arrives; (e) no re-receipt of a returned item in the same group | B30 "positive association"; B24 an original holds completion; each error blocks completion of every affected application with no product route | New behaviour → Kind 2 gate; (a) is a guard on an existing command; (b)–(e) are new commands or states. Recommend (a) first as a defect-class guard | Copy mitigations (§2.4, §2.7, §4.3); boundary "Owner: product owner". **P1**, with Max through the orchestrator (options paper, as P-15) |
| STOP-W12-06 | Defect notes (P2) | No business duplicate guard for a movement to the same holder; the uncertainty statement is kept after the part is found; the item-level holder is unchanged by a return | B35 "a new key cannot evade business duplicate checks"; truthful reads | — | Page words (§2.3, §2.11); P2 |
| STOP-W12-07 | Note (P2) | `core.ta_application.completion` gives the travel agent the `originals` codes (held, uncertain) while the contract states custody facts are not sent to the travel agent (`contracts/core.ts:274-279`) | Parked cross-party visibility (B30): which facts the travel agent may know is the owner's decision | — | Neutral TA sentence (AM-W12-07); the orchestrator confirms the intent. P2 |

No STOP item blocks the WP-12 main path. No P0 item is open in this design. Kind 2 requested: STOP-W12-05 goes to Max
through the orchestrator. Kind 1 requested: STOP-W12-01 and STOP-W12-02 (P1) for the Core batch; STOP-W12-03 parked as a
P2 note. STOP-W12-04 is a defect for the Core task.
