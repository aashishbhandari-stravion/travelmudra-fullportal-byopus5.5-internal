# WP-02 design review: offering admission minimum

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13).
Product base: lane repository at 102e4c9 (WP-01 not yet integrated). This document writes no product code.
Paths in `file:line` form are relative to the lane repository unless they start with `REC/`
(`internal/records/`) or `RM` (lane `research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 102e4c9. "Target" means the specification or the plan.

## 0. Summary for the architect

- **Scope.** SA-05 Offerings & launch (catalogue authoring, publication, launch plan, launch and scope expansion),
  SA-06 Accounts & access (create account, approve, decline, activate, suspend, restore), TA-02 Services, TA-03
  Service detail. All 20 WP-02 commands of `COMMAND-COVERAGE.md` §5.1 get a page (§1.4). Eleven commands of WP-13
  and WP-15 have their only form on a page that WP-02 rebuilds; they are carried over unchanged (§1.5, D-W02-10).
- **Page model.** Every existing path stays (LD-03). Two new GET pages: the launch plan task page
  `/admin/catalogue/offerings/:offeringId/launch/plan` and the launch decision page
  `/admin/catalogue/offerings/:offeringId/launch/decide/:kind`. The declaration publication form moves from the
  declaration page to the publication decision page (the preview page), so the effect on existing work is on the
  same page as the decision (UX §7.3). No form action and no field name changes.
- **Four panels (UX §6.3).** The offering workspace has two object tabs. "Definition and values" holds panel 1
  (definition and binding) and panel 2 (effective business values). "Readiness and launch" holds panel 3
  (readiness evidence, grouped under the five OD §6 labels as headings, with no current-stage marker) and panel 4
  (launch and admission). Each tab reads one Core query; no page joins two catalogue reads.
- **Operator "Services".** Re-rendered read-only with the shared TA-03 display component (cheap, no orphan old
  page). The rail item stays transitional; WP-07 decides retirement (WP-01 Q-12).
- **Findings worked in the design (§9.1).** Three fabricated zeros (`audienceSize ?? 0`, `audienceSizes[...] ?? 0`,
  preview summary `?? 0`; D7), lost input on refusal (declaration JSON, the 240-field launch plan, decision fields,
  account reasons; C1), and `formatBytes(0)` showing "0 bytes" for an undeclared size.
- **STOP items (§9.3).** STOP-W02-01 (Kind 1, P1): `cat.offering_display` carries no eligibility and no service
  promise, which UX §3.1 step 1 and §4.2 require on TA-03. It does not block V01. STOP-W02-02 (content input, P2):
  no fact names a third-party filing provider (UX §3.2). No P0 item is open.
- **Top questions.** Q-W02-01 STOP-W02-01 (P1). Q-W02-02 the launch decision page under SA-05 now versus SA-09 in
  WP-06 (P1). Q-W02-03 the second-SuperAdmin approval of a new SuperAdmin stays on the old `/admin/elevations`
  page until WP-15 (P1). Q-W02-04 the V01 proof on `lane-ui` creates one new synthetic offering per run (P1).
- **V01 on `lane-ui`.** The installation holds the synthetic seed: countries Synthetica (SYN) and Synthetica Beta
  (SYX), nine offerings, eight launched for every active travel agent, and "SYN Provider visa (route not approved)"
  left unlaunched by the seed (§7). The proof uses that offering for "an unavailable route cannot create a draft".

## 1. Scope, sources and page list

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` | §2.1, §2.2, §2.3, §3.1 step 1, §3.2 (withdrawn/suspended row, third-party row), §4.1, §4.2 Services, §4.4 "No offering selectable", §6.1, §6.2, §6.3 (Offering management, Publication and impact, Launch/suspension/lift, Account changes), §7.3 (SuperAdmin decision page, Mobile), §7.4, §10.1, §12 V01 |
| `BUILD_SPEC.md` r2 | B01, B02, B05, B06, B07, B08, B10, B11, B15, B17, B32, B43, B44 |
| `UI-PLAN.md` | A (AD-05, AD-10, AD-12, AD-13), §1, §2.1–2.3, §3.2 TA-02/TA-03, §3.4 SA-05, SA-06, SA-09, §4.1, §5.2 TA-02/TA-03, §5.4 SA-05, SA-06, SA-09, §6.2, §6.4, §7 (K rules, rows 57–62), §8.1, §10, §11, §12.1, §13 |
| `SURFACE-INVENTORY-2026-10-10.md` | §2.6, RM-T2, RM-A5, RM-A6, CMD-60 to CMD-65, §4, §5 group E |
| `DECISIONS-2026-10-10.md` | §1.3 (OC-07, OC-10), §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-01 to LD-13), §7; `COMMAND-COVERAGE.md` §3, §5, §6; `WP-01-design.md` §2, §3, §7; `WP-01.md` §3 |
| Route map (RM) | §1, §2 rows D31–D96, D52–D71, T02, T03, O58, O59, A01; §3.1, §3.2 catalogue and identity rows; §4; §5 |
| Code | `src/apps/staff/catalogue/*.ts`, `src/apps/shared/ta-catalogue.ts`, `src/apps/staff/identity.ts`, `src/apps/shared/pages/identity.ts` (messages), `src/contracts/catalogue.ts`, `src/contracts/identity.ts`, `src/contracts/queries.ts:54-87`, `src/core-api/bindings/catalogue.ts`, `src/core-api/bindings/catalogue-admin.ts:208-331`, `src/core-api/bindings/identity-admin.ts:71-101`; module refusals in `src/modules/catalogue/commands/*.ts`, `src/modules/operations/commands/launch.ts`, `src/modules/operations/launch/readiness.ts`, `src/modules/identity/commands/accounts.ts`; seeds `catalogue/synthetic/catalogue.json`, `src/modules/operations/commands/seed.ts`, `src/modules/identity/commands/seed.ts` |
| Tests that pin the pages | `test/system/new-service.test.ts`, `test/system/ported-pages.test.ts`, `test/system/browser.test.ts`, `test/system/flows.test.ts`, and the support-view callers (§8.3) |

### 1.2 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry. "Carried" = the page keeps a form of
another package unchanged until that package rebuilds it (§1.5).

| ID | Page | Path | Status | Read model (one per page unless stated) |
|---|---|---|---|---|
| SA-05a | Offerings (list, countries) | `/admin/catalogue` | Kept, rebuilt | `cat.admin_index` |
| SA-05b | Offering: Definition and values | `/admin/catalogue/offerings/:offeringId` | Kept, rebuilt; carried WP-13 forms | `cat.admin_offering` |
| SA-05c | Declaration version | `/admin/catalogue/declarations/:declarationId` | Kept, rebuilt; publish form moves out; carried WP-13 form | `cat.admin_declaration` |
| SA-05d | Business values version | `/admin/catalogue/baselines/:baselineId` | Kept, rebuilt | `cat.admin_baseline` |
| SA-05e | Publication decision | `/admin/catalogue/previews/:previewId` | Kept, rebuilt as a decision page | `cat.admin_preview` |
| SA-05f | Publication record | `/admin/catalogue/publications/:publicationId` | Kept, rebuilt (receipt host) | `cat.admin_publication` |
| SA-05g | Launch (overview) | `/admin/launch` | Kept, rebuilt | `ops.launch_overview` |
| SA-05h | Offering: Readiness and launch | `/admin/catalogue/offerings/:offeringId/launch` | Kept, rebuilt; carried WP-13 forms | `ops.launch_offering` |
| SA-05i | Launch plan | `/admin/catalogue/offerings/:offeringId/launch/plan` | **New** (route id `admin.launch.plan_form`) | `ops.launch_offering`; optional `iam.admin_accounts` (owner choices) |
| SA-05j | Launch decision | `/admin/catalogue/offerings/:offeringId/launch/decide/:kind`, `kind` ∈ {`launch`, `expand`} | **New** (route id `admin.launch.decision`) | `ops.launch_offering`; optional `iam.admin_accounts {role:'ta'}` (reference list) |
| SA-05k | Public site | `/admin/public-site` | Kept, rebuilt | `cat.public_site_status` |
| (WP-13) | Impact review, Impact assessment | `/admin/catalogue/impact`, `/admin/catalogue/impact/:assessmentId` | Not rebuilt in WP-02 (old pages stay, LD-02) | — |
| SA-06a | Accounts | `/admin/accounts` | Kept, rebuilt | `iam.admin_accounts` |
| SA-06b | Create an account | `/admin/accounts/new` | Kept, rebuilt | `iam.account_create_form` |
| SA-06c | Account | `/admin/accounts/:accountId` | Kept, rebuilt; carried WP-15 forms | `iam.admin_account`; for an operator also `iam.operator_duties` (optional) |
| SA-06d | Operator duties | `/admin/accounts/:accountId/duties` | Kept, rebuilt | `iam.operator_duties` |
| (WP-15) | Elevation requests, Grants | `/admin/elevations`, `/admin/grants` | Not rebuilt in WP-02 | — |
| TA-02 | Services | `/ta/catalogue` | Kept, rebuilt | `cat.selectable_offerings` |
| TA-03 | Service detail | `/ta/catalogue/:offeringId` | Kept, rebuilt | `cat.offering_display` |
| OPS-S1, OPS-S2 | Services (operator, read only) | `/ops/catalogue`, `/ops/catalogue/offerings/:offeringId` | Kept, re-rendered with the TA-03 component (§2.6) | `cat.ops_offerings`, `cat.ops_offering` |

Both new routes: method GET, surface `admin`, action `catalogue.read_admin`, `params` zod with
`offeringId: zWireId('off')` and, for the decision page, `kind: z.enum(['launch','expand'])` (a parse failure is
the uniform 404). `resolve` returns the offering reference, as `admin.launch.offering` does
(`src/apps/staff/catalogue/routes.ts:300-306`). WP-13 later extends `kind` with `suspend`, `lift`, `withdraw`,
`treatment`.

### 1.3 Shell placement (WP-01 §2.2)

- Rail destination "Offerings & launch". Destination tabs (WP-01 R10): Offerings `/admin/catalogue`, Launch
  `/admin/launch`, Public site `/admin/public-site`. Recommendation D-W02-11 (P2): add "Impact review"
  `/admin/catalogue/impact` as a fourth member, so the impact pages mark a tab; one line in the WP-01 destination
  table.
- Rail destination "Accounts & access". Tabs: Accounts `/admin/accounts`, Elevation requests `/admin/elevations`,
  Grants `/admin/grants`.
- TA rail destination "Services" (`/ta/catalogue`).
- `current` per page: SA-05a–f pass `/admin/catalogue`; SA-05g–j pass `/admin/launch`; SA-05k passes
  `/admin/public-site`; SA-06 pages pass `/admin/accounts`.
- Object tabs inside one offering (SA-05b and SA-05h): a `<nav class="local-nav" aria-label="[Offering title]
  pages">` with two links, "Definition and values" and "Readiness and launch", `aria-current="page"` on the
  current one. It reuses the WP-01 R10 markup and class (no new variant). It sits below the identity band, not on
  the destination-tab row, so the two tab rows are not adjacent.

### 1.4 The 20 WP-02 commands and their pages

Field names are the current ones; none changes. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>`
hidden field. The command's wire input is built by the existing route handler (catalogue: `runForm`,
`src/apps/staff/catalogue/shared.ts:198-205`; identity: `targetInput`, `src/apps/staff/identity.ts:366-368`).

| # | Command | Route id (POST path) | Page that hosts the form | Fields | Rev |
|---|---|---|---|---|---|
| 1 | `cat.create_country` | `admin.catalogue.country_create` (`/admin/catalogue/countries`) | SA-05a "Add a country" | `code`, `name`, `publicSlug`, `listingState`, `_reason` | — |
| 2 | `cat.set_country_listing` | `admin.catalogue.country_listing` (`/admin/catalogue/countries/:countryId/listing`) | SA-05a Countries table, per row | `listingState` (hidden), `_reason` | `country` |
| 3 | `cat.create_offering` | `admin.catalogue.offering_create` (`/admin/catalogue/offerings`) | SA-05a "Create an offering" | `countryId`, `serviceCode`, `serviceMode`, `title`, `_reason` | — |
| 4 | `cat.draft_declaration` | `admin.catalogue.declaration_draft` (`…/offerings/:offeringId/declarations`) | SA-05b panel 1 | `body`, `_reason` | `offering` |
| 5 | `cat.record_owner_approval` | `admin.catalogue.owner_approval` (`…/declarations/:declarationId/owner-approval`) | SA-05c | `approvalKind`, `itemKey.<key>`=`yes`, `approvedBodySha256`, `approverRoleStatement`, `approvedOn`, `evidence.kind`, `evidence.id`, `evidence.note`, `_reason` | `declaration` |
| 6 | `cat.bind_declaration` | `admin.catalogue.bind` (`…/declarations/:declarationId/bind`) | SA-05c | none | — |
| 7 | `cat.preview_declaration` | `admin.catalogue.declaration_preview` (`…/declarations/:declarationId/preview`) | SA-05c; also SA-05e "Preview again" | `baselineId` (optional) | — |
| 8 | `cat.publish_declaration` | `admin.catalogue.declaration_publish` (`…/declarations/:declarationId/publish`) | **SA-05e** (moved from SA-05c, D-W02-01) | `previewId`, `baselineId` (hidden, optional), `policy.drafts`, `policy.submitted`, `evidence.*`, `_reason` | `offering` |
| 9 | `cat.edit_baseline` (new) | `admin.catalogue.baseline_create` (`…/offerings/:offeringId/baselines`) | SA-05b panel 2 | `declarationId`, `price`, `priceZeroConfirmed`, `minDays`, `maxDays`, `estimateNote`, `doc.<type>.label`, `doc.<type>.description`, `process`, `displayNotes` | — |
| 10 | `cat.edit_baseline` (edit) | `admin.catalogue.baseline_edit` (`…/baselines/:baselineId`) | SA-05d | as #9 without `declarationId`; `_reason` optional | `baseline` |
| 11 | `cat.preview_baseline` | `admin.catalogue.baseline_preview` (`…/baselines/:baselineId/preview`) | SA-05d; also SA-05e "Preview again" | none | `baseline` |
| 12 | `cat.publish_baseline` | `admin.catalogue.baseline_publish` (`…/baselines/:baselineId/publish`) | SA-05e | `previewId`, `policy.drafts`, `policy.submitted`, `priceCorrection`, `evidence.*`, `_reason` | `baseline`, `offering` |
| 13 | `ops.record_launch_plan` | `admin.launch.plan` (`…/offerings/:offeringId/launch-plans`) | **SA-05i** (moved from SA-05h, D-W02-03) | `m.<code>.*`, `mon.<code>.*`, `op.<field>`, `evidence.*`, `_reason` | `controls` |
| 14 | `ops.approve_launch` | `admin.launch.approve` (`…/offerings/:offeringId/launch`) | **SA-05j kind=launch** (moved, D-W02-02) | `planId` (hidden), `audienceKind`, `taAccountIds`, `ack.<itemKey>`=`<code>`, `evidence.*`, `_reason` | `controls` |
| 15 | `ops.expand_launch_scope` | `admin.launch.expand` (`…/offerings/:offeringId/launch-scope`) | **SA-05j kind=expand** (moved, D-W02-02) | as #14 | `controls` |
| 16 | `iam.create_account` | `admin.accounts.create` (`/admin/accounts`) | SA-06b | `role`, `email`, `displayName`, `reason` | — |
| 17 | `iam.approve_account` | `admin.accounts.approve` | SA-06c | `reason` | `account` |
| 18 | `iam.decline_account` | `admin.accounts.decline` | SA-06c | `reason` | `account` |
| 19 | `iam.activate_account` | `admin.accounts.activate` | SA-06c | `reason` | `account` |
| 20 | `iam.suspend_account` | `admin.accounts.suspend` | SA-06c | `reason`, `acknowledgeLastSuperAdmin`=`yes` (only for the last active SuperAdmin) | `account` |
| 21 | `iam.restore_account` | `admin.accounts.restore` | SA-06c | `reason` | `account` |

Rows 9 and 10 are one command with two routes; the count is 20 commands.

The new-baseline form (#9) carries no reason field today (`admin.ts:243-249`); the command has
`reasonRequired: false` for a draft. No change.

### 1.5 Carried forms (WP-13, WP-15) on pages that WP-02 rebuilds

LD-07 forbids hiding a served command. These forms have their only home on a page WP-02 rebuilds. WP-02 keeps
each one with its current markup, fields, action and success redirect (`?done=` only, no receipt), placed in the
panel where it belongs. The owning package rebuilds it. A unit test lists them (same rule as the WP-01
transitional rail members), so none stays by accident.

| Command | Owner | Page in WP-02 | Placement |
|---|---|---|---|
| `cat.request_impact_recheck` | WP-13 | SA-05b | "Impact on existing work" section |
| `cat.retire_offering` | WP-13 | SA-05b | Last section, "Retire this offering" |
| `cat.retire_declaration_draft` | WP-13 | SA-05c | "Discard this draft" |
| `ops.suspend_offering`, `ops.record_existing_work_treatment`, `ops.lift_suspension`, `ops.withdraw_offering` | WP-13 | SA-05h | Panel 4, "Suspension" and "Withdrawal" |
| `iam.reset_credentials`, `iam.request_elevation`, `iam.set_accounting_grant`, `iam.start_support_view` | WP-15 | SA-06c | Section "Access and support" |

Seven system tests post `/admin/support-view` from `/admin/accounts/:id` (§8.3). The carried support-view form
MUST stay on SA-06c.

### 1.6 Shared components used

From WP-01 §7 (reused, no new variant): CMP-07 error summary, CMP-08 operation receipt (`receiptLocation`,
`?done=&op=`), CMP-10 policy boundary notice (`boundaryNotice`), CMP-12 freshness ("Read at [time] IST"; every
WP-02 read is authoritative), CMP-13 unresolved banner (through the WP-01 operation status page), CMP-14 stale
revision comparison. Existing design-system parts: `dataTable` (stacks to cards at narrow width), `summaryList`,
`checklist` (CMP-15 shape: Met / Not met / Not applicable yet, `src/web/ui/status.ts:20-51`), `confirmDisclosure`,
`disclosure`, `timeline`, `identifier`, `badge`.

Plan components that WP-01 did not build and WP-02 needs (new unit U0, §8):

- **CMP-25 Decision form** (`decisionPage`): the fixed order of UX §7.3 as `h2` sections: Scope → Evidence →
  Effect on new and existing work → Your decision (fields) → Review (consequence review, visible, never inside a
  collapsed region) → primary button and "Cancel". States: draft; unavailable (no form: CMP-10 in place of the
  fields, the button shown disabled with its reason); already decided; stale (CMP-14 above the fields). WP-06
  reuses it for SA-09.
- **CMP-01 Action panel** (`actionPanel`): heading "Next action"; owner; the next step as text; blocker type in
  text (evidence can fix / a decision can resolve / another person owns / policy unavailable); one link or button.
  Facts come from the read model; the panel never states a permission.
- **Status facts list** (CMP-03 subset, `statusFacts`): a definition list with one label per fact, no combined badge.

## 2. SA-05 information architecture

### 2.1 The code's lifecycle mapped onto the four panels of UX §6.3

| Lifecycle step (code) | Command | Panel | Page | WP |
|---|---|---|---|---|
| Country identity and listing | `cat.create_country`, `cat.set_country_listing` | Outside the panels: catalogue identity (country level) | SA-05a | WP-02 |
| Offering identity | `cat.create_offering` | 1 Definition and binding | SA-05a (create), SA-05b (identity band) | WP-02 |
| Declaration draft | `cat.draft_declaration` | 1 | SA-05b | WP-02 |
| Owner (structure or item) approval | `cat.record_owner_approval` | 1 | SA-05c | WP-02 |
| Binding under the active release | `cat.bind_declaration` | 1 | SA-05c | WP-02 |
| Discard a draft | `cat.retire_declaration_draft` | 1 | SA-05c | WP-13 (carried) |
| Business values draft, edit | `cat.edit_baseline` | 2 Effective business values | SA-05b, SA-05d | WP-02 |
| Preview (values, or structure with values) | `cat.preview_baseline`, `cat.preview_declaration` | 2 (impact preview) | SA-05d, SA-05c, SA-05e | WP-02 |
| Publish values; publish structure | `cat.publish_baseline`, `cat.publish_declaration` | 2 (publication decision) | SA-05e | WP-02 |
| Publication record | — | 2 | SA-05f | WP-02 |
| Impact index, assessment, reviewer, item decision, transition, recheck | `cat.assign_impact_reviewer`, `cat.decide_impact_items`, `cat.approve_transition`, `cat.request_impact_recheck` | 2 (existing work) | Impact pages; SA-05b section | WP-13 |
| Launch plan (B32 measures, monitors, operating readiness) | `ops.record_launch_plan` | 3 Readiness evidence | SA-05i | WP-02 |
| Readiness evidence (B07, B32) | — (read) | 3 | SA-05h, SA-05g | WP-02 |
| Approve launch; expand scope | `ops.approve_launch`, `ops.expand_launch_scope` | 4 Launch and admission | SA-05j | WP-02 |
| Suspend, existing-work treatment, lift, withdraw | `ops.suspend_offering`, `ops.record_existing_work_treatment`, `ops.lift_suspension`, `ops.withdraw_offering` | 4 | SA-05h (carried), later SA-05j kinds | WP-13 |
| Retire offering | `cat.retire_offering` | 1 (identity end) | SA-05b | WP-13 (carried) |
| Public-site status | — (read) | Outside the panels | SA-05k | WP-02 |

### 2.2 Navigation within SA-05

```text
Offerings & launch
├── [tab] Offerings  /admin/catalogue                     (SA-05a)
│     └── Offering  /admin/catalogue/offerings/:id
│           ├── [object tab] Definition and values         (SA-05b: panels 1, 2)
│           │     ├── Declaration version  /declarations/:id       (SA-05c)
│           │     ├── Business values version  /baselines/:id      (SA-05d)
│           │     ├── Publication decision  /previews/:id          (SA-05e)
│           │     └── Publication record  /publications/:id        (SA-05f)
│           └── [object tab] Readiness and launch  …/launch (SA-05h: panels 3, 4)
│                 ├── Launch plan  …/launch/plan                   (SA-05i, NEW)
│                 └── Launch decision  …/launch/decide/:kind        (SA-05j, NEW)
├── [tab] Launch  /admin/launch                             (SA-05g)
├── [tab] Impact review  /admin/catalogue/impact            (WP-13; tab per D-W02-11)
└── [tab] Public site  /admin/public-site                   (SA-05k)
```

### 2.3 The four panels

| Panel (heading) | Page | Content (facts) | Primary action | Secondary |
|---|---|---|---|---|
| 1 Definition and binding | SA-05b | Head declaration (version link, support basis), binding under the active release (Supported / Incompatible / Missing), items of the head not supported (item, status, reason, dependent actions) then all items behind a disclosure, declaration versions table | "Register a declaration draft" (only when no draft is open and the offering is not retired) | Open a declaration version |
| 2 Effective business values | SA-05b | Published head values (version link, service price, effective from), business values versions table (version, status, price, effective from), open draft link, publications table | "New business values" editor (one per editor target), or "Continue the draft (version [n])" when a draft is open | Open a version; open a publication |
| 3 Readiness evidence | SA-05h | B07 and B32 evidence items grouped under the OD §6 labels (§2.4), the current launch plan (version, completeness, missing fields), the action-scoped items that stay unavailable for live cases | "Record the launch plan" / "Record a new plan version" (to SA-05i) | — |
| 4 Launch and admission | SA-05h | Status facts: launch state, current scope (audience), suspension, withdrawal (separate rows, UX §6.3); "What launch control allows now" (per-action effect); launch decisions history; suspension history and treatment; withdrawal facts | "Approve the launch" (to SA-05j kind=launch) or "Expand the launch scope" (kind=expand) | Carried WP-13 forms |

SA-05b shows a summary card for panels 3 and 4 from `cat.admin_offering.launch` (launch state, audience, plan
completeness, suspended, withdrawn) with the link "Open readiness and launch". SA-05h shows the catalogue
availability fact from `ops.launch_offering.offering.availability`. Neither page reads the other's query.

### 2.4 Readiness labels (OC-07)

OC-07 decided the five OD §6 labels as labels (`DECISIONS-2026-10-10.md` §1.3). UX §6.3 allows them to group the
checklist and forbids an invented state machine. SA-05h panel 3 therefore renders five `h3` group headings in
this order, each with the CMP-15 checklist of the B07/B32 evidence items Core reports. The page MUST NOT mark a
"current stage", MUST NOT compute a stage from the items and MUST NOT show a progress bar or count of stages.

| Label (h3) | Evidence items (source field of `ops.launch_offering`) | Not applicable yet when |
|---|---|---|
| Defined | "A head declaration exists" (`readiness.hasHeadDeclaration`) | — |
| Validated | "Business values are published" (`readiness.published`); "Every launch-required item of the head declaration is supported", blocker names the items (`readiness.failingLaunchItems`); "The head declaration, values and binding are usable for new cases", blocker gives the `governingCode` sentence (`readiness.governingOk`) | — |
| Operationally ready | "A launch plan is recorded" (`readiness.plan.recorded`); "The current launch plan is complete for the head declaration", detail lists the missing fields (`readiness.plan.complete`, `plan.missing`); "The return of originals held by TravelMudra is decided" (shown only when `readiness.originalsReturnUnresolved` is true, as Not met) | — |
| Approved for launch | "A launch decision is current" (`controls.launch_state = launched`), detail: audience, approver, acknowledged items (`decisions[state=current]`) | — |
| Active | "New work is not suspended" (`controls.suspension_state = none`); "The offering is not withdrawn" (`controls.withdrawal_state = none`) | `controls.launch_state = not_launched` |

The checklist wording reuses the current `checks()` sentences (`launch.ts:98-121`), which state an unmet item as
its blocker, never as a positive statement. The group headings carry no badge.

### 2.5 WP-02 versus WP-13

WP-02 builds the admission path: country, offering, declaration, approval, binding, values, preview, publication,
plan, launch, scope expansion. WP-13 builds suspension, existing-work treatment, lift, withdrawal, retirement,
draft discard, impact review and per-application transitions (register §5.1). WP-02 carries the WP-13 forms
(§1.5). WP-13 adds its decision kinds to SA-05j (`kind` = `suspend`, `lift`, `withdraw`, `treatment`) with the
same CMP-25 frame.

### 2.6 Operator "Services" pages

Decision recommended to the architect: **WP-02 re-renders `/ops/catalogue` and `/ops/catalogue/offerings/:id`
with the shared TA-03 display component**, read only, with the staff wording that exists today
(`ops-discovery.ts:28-106`): no action, the callout "Read only. These are the service's current published values.
An application keeps the values it was submitted under: read them on its case page." Reasons: the display model
is the same (`zSelectable`, `zOfferingDisplay`, `src/contracts/queries.ts:54-87`); the cost is one call site; LD-02
requires that no old page remains at handover. The rail item stays transitional (WP-01 Q-12); WP-07 decides
whether the operator keeps a Services destination (UX §5.2 lists none). Paths, route ids and the system-test
selectors (`ported-pages.test.ts:142-168`) stay valid.

## 3. SA-05 page specifications

### 3.0 Rules common to every WP-02 page

- **Freshness.** Every read in WP-02 is authoritative. Every page shows CMP-12 "Read at [time] IST" on the
  breadcrumb row. SA-05e also shows "Preview computed at [computed_at] IST".
- **Page states.** S1 Loading: every WP-02 page is server-rendered complete; there is no in-page loading region,
  so no skeleton exists. S5 Stale: no projection is read; staleness appears only as a stale revision (C5) or an
  out-of-date preview (SA-05e). S6 Denied and S7 Error: the SH-02 pages of WP-01 (uniform 404 without object facts;
  Core unreachable 503 "Nothing was sent, so nothing changed"). Each page table below lists only S2, S3, S4 and the
  page-specific variants.
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>` (WP-01 `receiptLocation`); CMP-08
  receipt first in `main`, title first in the document title, facts from the page's own read (§3.14). REJ: the
  same page re-rendered with the category's status, CMP-07 error summary focused, every typed value kept
  (finding F-W02-03), the refusal sentence from the closed table (`REASON_MESSAGES`, `shared.ts:40-119`; unknown
  code: the category recovery text plus "Reference code: [code]"). Stale revision: CMP-14 (§3.15). UNR: 303 to
  `/admin/operations/<key>` (WP-01 CMP-13, "Checking the original result"); the page MUST NOT offer a new
  submission of the same intent.
- **K rules.** Every WP-02 command is K-STD (UI-PLAN §7 rows 57–62). The form carries one `_op` from page load;
  a resubmission of the same form reuses it. Account creation of a SuperAdmin is K-2P through the elevation
  request that Core opens (§4.3).
- **Copy.** UI-PLAN §11 rules. No "Ready", "Approved" as an overall status, "Override", "Something went wrong".
  Every time carries "IST". Counts name their unit. Synthetic data shows "Synthetic" (CR-08). Item names use
  `ITEM_LABELS` (`shared.ts:125-134`) with the key as a quiet secondary reference.
- **Mobile (< 768 px).** One column. Tables stack into labelled cards (`dataTable`). Identity, status facts and the
  next action come before details (AC-21). Long lists (affected applications, declaration JSON) scroll inside a
  labelled region (AC-04). Decision pages are full-screen task pages: scope and effect before fields (UI-PLAN
  SA-09 mobile).

### 3.1 SA-05a Offerings `/admin/catalogue`

Anatomy (reading order):

1. Header: breadcrumb "Offerings & launch"; `h1` "Offerings"; lead "Countries, offerings and their business values.
   Publishing values never launches an offering. Launch is a separate decision on the Launch tab."; freshness.
2. Receipt (when `done` and `op`).
3. Attention notice (only when rows with `openItems > 0` exist): "[n] offerings have existing work waiting for an
   impact decision. Unknown or pending impact blocks filing readiness for those applications." Action "Open
   impact review".
4. Section "Offerings" (`id="offerings"`): table. Columns: Offering (title link, then "[country] · [who files]",
   "Synthetic" badge); Definition (head "Declaration version [n]" or "No head declaration"; binding badge text);
   Business values ("Version [n] published" or "None published"); Launch and admission (status facts: "Not
   launched" / "Launched for every active travel agent" / "Launched for [n] named travel agents" / "Launched for
   named travel agents (count unavailable)" when `audienceSize` is null; then "Suspended" or "Withdrawn" as a
   separate line); Launch plan ("Complete", "Incomplete", "Not recorded" from `launch.planCompleteness`);
   Existing work ("[n] impact items to decide", link to impact; "None" when 0).
5. Disclosure "Create an offering" (open when the list is empty): fields of #3; Country select from
   `countries`; Service mode radio with no preselection, hint "It never changes."; button "Create offering". When
   no country exists: empty state "Create a country first. An offering belongs to one country." and no form.
6. Section "Countries" (`id="countries"`): table. Columns: Country (name, code, "Synthetic"); Public address
   (`/countries/[slug]`); Listing ("Listed: travel agents can create groups" / "Unlisted: no new groups"); Change
   listing (confirmDisclosure, #2; consequences as today `admin.ts:63-72`).
7. Disclosure "Add a country": fields of #1; hint on Listing "Listing a country lets travel agents create groups
   there. It approves no route and launches nothing."

Actions: primary "Create offering" (in its disclosure). Secondary: open an offering; "Add country"; "List" /
"Unlist".

| State | Copy |
|---|---|
| S2 no offering | Empty state title "No offerings yet"; body "Create an offering for a country. A new offering is not published and not launched." |
| S2 no country | Countries table empty state "No countries yet. Add the first country. Listing a country approves no route and launches nothing." |
| S4 | `launch` null on a row: "Launch state unavailable" (not "Not launched"); unknown enum value: "Unrecognised state" (existing `presentationOf`) |
| C1/C2 | Error summary above the form that was sent (`form` = `country` / `offering` / `listing`); the other forms stay closed |
| C3 receipts | `country`: "Country added" — facts: Country [name] ([code]), Public address, Listing. `listing`: "Listing changed" — Country, Listing now. `offering`: 303 goes to SA-05b (§3.2) |
| C5 listing | CMP-14 rows: Listing (yours / current) |

Mobile: offerings first, as cards (title, country · who files, launch facts); forms below.

### 3.2 SA-05b Offering: Definition and values `/admin/catalogue/offerings/:offeringId`

Anatomy:

1. Header: breadcrumb "Offerings & launch / Offerings"; `h1` offering title; identity meta: Country, Who files
   (`MODE_LABELS`), Service code (mono), Offering reference (copy); "Synthetic" badge; freshness.
2. Status facts (definition list): Catalogue ("Unpublished" / "Published" / "Retired"); Launch (as §3.1 column);
   Suspension ("None" / "Active"); Withdrawal ("None" / "Effective"); with `launch = null`: each launch row reads
   "Unavailable".
3. Object tabs: "Definition and values" (current), "Readiness and launch".
4. Receipt.
5. Action panel "Next action" (CMP-01). Owner "SuperAdmin". The step is the first applicable fact, stated as a
   fact with a link, in this order: no supported declaration ("No declaration is supported yet. A release
   registers one, or record the product owner's approval of a draft." → open the draft); no head ("No head
   declaration yet. Publish a supported declaration with its first business values."); no published values ("No
   business values are published. Draft, preview and publish them."); open draft ("A business values draft is
   open." → "Continue version [n]"); head binding not supported ("The active release does not support the head
   binding. New cases are unavailable."); review needed ("Existing work needs an impact decision." → assessment).
   When none applies and the offering is published: "Next: readiness and launch" → SA-05h. The panel states facts
   that `cat.admin_offering` carries; it never says that an action is allowed.
6. Panel 1 `h2` "Definition and binding": head summary list (Declaration: version link or "None"; Support basis;
   Binding under the active release: badge text); items of the head not supported first (`itemOverview`,
   `admin.ts:152-158`), all items in a disclosure "All [n] items"; declaration versions table (Version link,
   "(head)", Status, Support basis, Registered by); disclosure "Register a declaration draft" (#4: textarea
   "Declaration (decl/1 JSON)", 10 rows, hint as today; reason; button "Register draft"), or the line "A draft is
   open: [Version n]" when one exists. Retired offering: no form.
7. Panel 2 `h2` "Effective business values": summary (Published head: "Version [n], service price [₹], effective
   from [time] IST" or "None published"); versions table (Version link, Status, Service price, Effective from or
   "Not published"); for each editor target a disclosure "New business values for declaration version [n]
   [(head)]" (#9, open when no head baseline exists or after a refusal of that form), or "Continue the draft
   (version [n])" when a draft or previewed baseline exists.
8. Section "Publications": table (Publication no. link, Kind, By, Publication time IST).
9. Section "Impact on existing work": assessments table (Assessment no. link, Cause, State); carried form
   "Request a new recheck" (WP-13).
10. Summary card "Readiness and launch": Launch, Audience, Launch plan, Suspension, Withdrawal; link "Open
    readiness and launch".
11. Carried section "Retire this offering" (WP-13), last, separated.

| State | Copy |
|---|---|
| S2 no declaration | "No declarations. A release registers declarations. A SuperAdmin may register a draft for an owner approval." |
| S2 no values | "No business values yet. Draft the first version for a supported declaration." (the editor disclosure is open) |
| S2 no publication | "Nothing published yet. Each publication records who, what, why, when and the affected scope." |
| S4 | Unknown account name: "Unknown account [reference]" (existing `accountName`); `launch` null: summary card rows "Unavailable" |
| Retired | Status fact Catalogue "Retired"; panel 1 and 2 forms absent; notice "This offering is retired. Travel agents can no longer select it. Open work keeps its governing values." |
| C3 `offering` | "Offering created" — Offering [title], Country, Who files, "Not published. Not launched." |
| C3 (declaration draft) | 303 to SA-05c with `declaration` |
| C3 (new values) | 303 to SA-05d with `baseline` |
| C1/C2 | Error summary on the form that was sent; JSON body and editor values kept (F-W02-03) |
| C5 draft | `_rev.offering` stale: CMP-14 rows "Head declaration", "Open draft" (yours from the page / current re-read); the typed JSON stays in the field |

Mobile: identity, status facts, next action, then panels; tables as cards; the JSON textarea full width.

### 3.3 SA-05c Declaration version `/admin/catalogue/declarations/:declarationId`

Anatomy:

1. Header: breadcrumb "Offerings & launch / Offerings / [offering]"; `h1` "Declaration version [n]"; status badge
   (Draft / Supported / Planning record / Retired) and "Head" badge when it is the head; meta: Support basis, Digest
   (copy); freshness.
2. Receipt.
3. `h2` "What this version declares": Promise, Who files, Documents (type, required/optional, formats), Provider
   ("No provider" / "Route [routeRef]"), Not supported yet; "Not declared" for a null part (existing
   `declarationSummary`, `admin.ts:295-310`).
4. `h2` "Items": not-supported first; all items in a disclosure.
5. `h2` "Owner approvals": table; the form #5 when the version is a draft or has owner-gated items waiting.
   Form order: scope sentence "This records the product owner's decision, made outside TravelMudra, for this exact
   version (digest [first 12 characters]…)." → "What the product owner approved" radio (structure only for a
   draft; nothing preselected) → owner-gated item checkboxes (none checked) → Approved body digest (hint shows this
   version's digest with copy) → Approver statement → Date of the approval → Evidence (kind, reference, note) →
   Reason → button "Record approval".
6. `h2` "Bindings": table (Capability profile, Under the active release); form #6 "Ask the active release for a
   binding" when the version is supported and has no supported binding.
7. `h2` "Publication" (only for a supported, owner-approved version that is not the head): form #7 "Preview the
   impact" (baseline select, optional, placeholder "Keep the published head values"; button "Preview the impact",
   or "Preview again" when a current preview exists) and, when `preview` is current, the link "Open the publication
   decision" to SA-05e. No publish form here (D-W02-01).
8. Carried section "Discard this draft" (WP-13).
9. `h2` "Declared content": disclosure "Show the declaration record (JSON)" in a labelled scroll region.

| State | Copy |
|---|---|
| Draft | Notice "A draft has no support basis. It becomes supported only by a release, or by recording the product owner's outside approval of this exact version." |
| Planning record (`unsupported`) | Notice "A planning record. It was shipped without support and never becomes the head." No forms |
| Preview out of date | Line "The preview no longer matches the offering. Preview again before you publish." |
| C3 | `declaration`: "Declaration draft registered" — Version, Status Draft. `approval`: "Owner approval recorded" — Kind, Items, Approved on. `bound`: "Binding registered" — Capability profile, Support. `previewed`: 303 to SA-05e |
| C2 approval | `owner_approval_scope_mismatch` against the digest field; `item_unsupported_needs_release` as a form-level item |
| C5 approval | CMP-14 rows Status, Owner approvals (count with unit "approvals") |

### 3.4 SA-05d Business values version `/admin/catalogue/baselines/:baselineId`

Anatomy:

1. Header: breadcrumb to the offering; `h1` "Business values version [n]"; status badge; meta: For declaration
   version [n] [(head)], Service price, Estimate "[min] to [max] calendar days"; freshness.
2. Receipt.
3. When previewed and current: notice "Previewed. The publication decision shows the price and the effect on
   existing work." Action "Open the publication decision" (SA-05e).
4. When editable: `h2` "Edit the values" (#10; typed values kept on refusal; reason optional; hint "Saving a
   previewed version returns it to draft: the old preview no longer describes it."; button "Save draft").
5. When editable and of the head declaration: `h2` "Preview price and impact" (#11; button "Preview price and
   impact").
6. When editable and not of the head declaration: notice "These values belong to declaration version [n], which is
   not the head. They are previewed and published with that declaration." Link to SA-05c.
7. When not editable: `h2` "Values": price, estimate (with note), documents table (Type, Label, Description),
   process steps, notes.

| State | Copy |
|---|---|
| C3 `baseline` | "Business values draft saved" — Version, Status Draft, Service price |
| C3 `previewed` | 303 to SA-05e |
| C2 | `baseline_incompatible` form-level: "The documents described must be exactly the document types the declaration requires."; `priceZeroConfirmed` field error; `too_big` on price |
| C5 | CMP-14 rows per changed value: Service price, Estimate from, Estimate up to, Estimate note, each document label and description, Process steps, Notes (yours = typed, current = re-read) |

### 3.5 SA-05e Publication decision `/admin/catalogue/previews/:previewId`

The preview page becomes the publication decision page (CMP-25) for both preview kinds.

1. Header: breadcrumb to the offering; `h1` "Publish business values: [offering]" (kind `baseline`) or "Publish
   declaration version [n]: [offering]" (kind `declaration`); freshness "Preview computed at [time] IST · Read at
   [time] IST".
2. Receipt (`previewed`): "Preview recorded" — Computed at, Open applications "[n] applications".
3. Out of date (when `preview.offering_revision ≠ offering.revision`): notice "This preview is out of date. The
   offering changed after the preview was computed. Preview again before you publish." with the form "Preview
   again" (kind baseline: #11 with `_rev.baseline`; kind declaration: #7 with `baselineId` hidden). No publish form.
4. `h2` Scope: Offering; What is published ("Business values version [n]" or "Declaration version [n] together
   with business values version [n]" / "with the published head values"); "New cases use them from the
   publication."
5. `h2` Evidence: Price (Current head price or "None (first publication)"; New price; Change "₹[x] increase" /
   "₹[x] decrease" / "No change"); Processing estimate (current maximum, new maximum, in days); Values changed
   (`fieldDiff` list) when present.
6. `h2` Effect on new and existing work: Existing work by class (table: Class, Applications), "[n] submitted
   applications whose forecast reaches the travel date", automatic reductions ("[n] applications, total ₹[x]"),
   higher than a quoted price, paid applications with a higher quoted price; affected applications (Application,
   Travel agent, Class) in a labelled scroll region with "The first 500 are listed; the counts cover every
   application." when `listedAll` is false. Every count whose key is absent from `summary` reads "Unavailable"
   (F-W02-01). With no open application: "No open application is affected."
7. `h2` Your decision: continuation choices `policy.drafts`, `policy.submitted` (required when
   `affected_count > 0`; nothing preselected; existing `continuationChoices`, `shared.ts:346-360`); for kind
   baseline the price-correction radio (`none` / `mistaken_price`, nothing preselected); evidence (optional; hint
   "Required for a mistaken-price correction."); reason.
8. `h2` Review (visible): "When you publish: new cases use these values at once; existing work follows the choices
   above; an impact assessment of existing work opens, and filing readiness of affected applications waits for its
   decisions; the launch does not change: publishing is not a launch; your name, reason and the time are
   recorded."
9. Buttons: "Publish business values" / "Publish declaration version [n]" (primary); "Cancel" (back to SA-05d or
   SA-05c).

Form for kind `declaration` (#8): action `/admin/catalogue/declarations/[preview.declaration_id]/publish`, hidden
`previewId`, `baselineId` (when `baseline` is not null), `_rev.offering` = `offering.revision`. Form for kind
`baseline` (#12): as today (`baselines.ts:154-171`).

| State | Copy |
|---|---|
| Baseline no longer previewed by this preview (`baseline.preview_id ≠ preview_id` or status not `previewed`) | "This preview is no longer the current preview of these values. Open the values to preview them again." No form |
| C3 | 303 to SA-05f with `published` |
| C2 | `preview_stale`, `continuation_policy_missing`, `mistaken_price_evidence_missing`, `launch_item_not_supported`, `binding_incompatible`, `declaration_unsupported` as summary items; continuation fields marked for `continuation_policy_missing`; choices kept |
| C5 | CMP-14 rows: Offering revision ("Changed after your preview"), Values status; action "Preview again" |
| Two SuperAdmins | The second publisher gets `baseline_already_published` (conflict) or `preview_stale`: "Someone published these values first." with a link to the publication when Core names it |

### 3.6 SA-05f Publication record `/admin/catalogue/publications/:publicationId`

Receipt host for both publish commands. `h1` "Publication no. [n]: [offering]". Receipt `published`: "Published"
— Publication no., What was published, Publication time IST, "New cases use it from now. Existing work is
rechecked.", link "Open the impact assessment". Record list (existing fields, `baselines.ts:178-191`) with times in
IST (today UTC, `timeAt(..., {utc: true})`: change to IST per AD-10, show recorded time and publication time
both). "Before and after" in a labelled scroll region.

### 3.7 SA-05g Launch `/admin/launch`

`h1` "Launch"; lead "Launch scope is an offering for a travel agent audience. Publishing values and releases never
launch an offering."; freshness. Table: Offering (link to SA-05h); Launch ("Not launched" / "Launched");
Suspension; Withdrawal (separate cells); What blocks a launch (when not launched: the unmet items as CMP-15; when
none is unmet: "Every listed launch requirement is met. No launch decision yet."; when launched: "—"). S2: "No
offerings yet. Create offerings on the Offerings tab." The word "Ready" MUST NOT appear.

### 3.8 SA-05h Offering: Readiness and launch `/admin/catalogue/offerings/:offeringId/launch`

1. Header: breadcrumb "Offerings & launch / Launch / [offering]"; `h1` "[offering]"; identity meta (Who files,
   Scope "Offering × travel agent audience"); "Synthetic" notice "Synthetic test data. Synthetic offerings are
   refused in production."; freshness.
2. Status facts: Catalogue (from `offering.availability`); Launch; Current audience ("Every active travel agent" /
   "[n] named travel agents" / "Named travel agents (count unavailable)"); Suspension; Withdrawal.
3. Object tabs (current: "Readiness and launch").
4. Receipt (`plan`, `launched`, `expanded`).
5. Action panel "Next action": the first of — unmet readiness item ("[blocker sentence]" with its route: plan →
   SA-05i, values → SA-05b); "Every listed launch requirement is met. A SuperAdmin approves the launch." →
   "Approve the launch" (SA-05j kind=launch); launched with a named audience → "Expand the launch scope" (kind
   expand) as secondary; suspended or withdrawn → the state as a fact, no launch action.
6. Panel 3 `h2` "Readiness evidence": `h3` "Launch requirements" lead, then the five label groups (§2.4); launch
   plan summary (Current version [n]; Completeness "Complete" / "Incomplete: [n] fields missing"; missing fields
   mapped to labels, §3.9); link "Record the launch plan" / "Record a new plan version" (SA-05i); "Actions that stay
   unavailable for live cases" (from `acknowledgements`: item label and reason sentence; "None" when empty).
7. Panel 4 `h2` "Launch and admission": `h3` "What launch control allows now" (effects table, as today
   `launch.ts:139-153`); `h3` "Launch decisions" (table: Decision, Audience, Approved by, Reason, Acknowledged
   unavailable; audience size from `audienceSizes`, "count unavailable" when absent, F-W02-01); entry links "Approve
   the launch" / "Expand the launch scope" (to SA-05j; shown as described in §3.10 states); carried `h3`
   "Suspension" and "Withdrawal" (WP-13).

The headings "Launch requirements" and "What launch control allows now" stay (pinned by
`ported-pages.test.ts:323-324`).

### 3.9 SA-05i Launch plan `/admin/catalogue/offerings/:offeringId/launch/plan` (new)

Purpose: record the B32 launch plan. Full-screen task page (UX §7.3 Mobile).

1. Header: breadcrumb to SA-05h; `h1` "Launch plan: [offering]"; freshness.
2. Current plan facts: "Version [n], complete" / "Version [n], incomplete: [n] fields missing" / "No plan recorded".
   Lead "An incomplete plan may be recorded. Launching, expanding and lifting a suspension need a complete current
   plan for the head declaration."
3. Error summary (C1/C2; field errors from Core: `ownerAccountId` `not_active_staff`, `measures.<code>.timezone`
   `timezone_invalid`), each item linking to its field.
4. Task list "Parts of the plan" (CMP-04 shape): Measures ([n] of [m] complete is NOT computed; each measure link
   shows "[k] fields missing" from `plan.missing` grouped by code, or "Nothing missing"); Monitors; Operating
   readiness. Grouping Core's missing list by its prefix is presentation of Core's facts, not a computed state.
5. Fieldsets per measure (`m.<code>.*`, as today `launch.ts:164-185`), per monitor (`mon.<code>.*`), Operating
   readiness (`op.<field>`, labels `OPERATING_LABELS`), Evidence (optional), Reason.
6. Owner fields: `select` of active staff accounts (D-W02-04): options from two reads of `iam.admin_accounts`
   (`{role:'operator', status:'active'}` and `{role:'superadmin', status:'active'}`), label "[name] ([role])",
   value = account id, field name unchanged; current value preselected only when it was in the recorded plan.
   When either read fails: the current text field with the hint "Account reference of an active operator or
   SuperAdmin. The account list is unavailable now." Core validates the owner either way.
7. Button "Record plan version [n+1]"; "Cancel" to SA-05h.

Missing-field labels: `measures.<code>` → "[measure label]: not entered"; `measures.<code>.<field>` → "[measure
label]: [field label]"; `….not_expected` → "[measure label]: [field label] must be empty when the measure does not
apply"; `monitors.<code>.<field>`; `operating.<field>` → `OPERATING_LABELS`; `operatingReadiness` → "The head
declaration declares no operating readiness". Unknown code: shown as the code. Measure and monitor labels are
`code` with underscores as spaces until approved labels exist (CR-09).

| State | Copy |
|---|---|
| `requirements = null` | CMP-10: "Recording a complete launch plan is unavailable until the head declaration declares its required measures and monitors. Owner: engineering release." No form |
| Retired offering | "This offering is retired. No plan can be recorded." No form |
| C3 `plan` | 303 to SA-05h: "Launch plan recorded" — Version [n], "Complete" or "Incomplete: [n] fields missing" |
| C1/C2 | Every typed value kept (F-W02-03); focus on the summary |
| C5 | CMP-14: "Changed since your review: launch plan version [n] is now current." Typed values kept; "Review current information" opens the page fresh |

### 3.10 SA-05j Launch decision `/admin/catalogue/offerings/:offeringId/launch/decide/:kind` (new)

CMP-25 frame. `kind=launch` posts #14; `kind=expand` posts #15.

1. Header: breadcrumb to SA-05h; `h1` "Approve the launch: [offering]" / "Expand the launch scope: [offering]";
   freshness.
2. `h2` Scope: Offering, Who files, Launch plan "version [n], complete", for expand: Current audience "[n] named
   travel agents". Line "The launch scope is this offering for the audience you choose below."
3. `h2` Evidence: the readiness checklist (all five groups, §2.4); "Actions that stay unavailable for live cases"
   list.
4. `h2` Effect on new and existing work: launch — "After approval, travel agents in the audience can select this
   service, start intake and create drafts at once. The actions listed above stay unavailable for live cases.";
   "Existing work: none. Without a launch, no application can start for this offering." (B07: no intake, including
   drafts, without a current scoped approval). Expand — "Travel agents you add can select this service at once.
   Travel agents already in the audience keep it. Existing work does not change." Plus the effects table "What
   launch control allows now".
5. `h2` Your decision: Audience radio (`audienceKind`: "Every active travel agent" / "Named travel agents only";
   nothing preselected); Named travel agent accounts (`taAccountIds` textarea, hint "One account reference per line.
   Each must be a travel agent account that is active or approved."; for expand: "Include everyone already
   approved."); reference list "Travel agent accounts" (name, status, reference with copy) from
   `iam.admin_accounts {role:'ta', status:null}`, in a disclosure; "Unavailable" when that read fails;
   acknowledgements (`ack.<itemKey>` = code; one checkbox per item, none checked; legend "Unavailable actions to
   acknowledge"; or "No action-scoped item stays unavailable, so there is nothing to acknowledge."); Evidence
   (required: `readinessEvidence` has a minimum of one, `launch.ts:236`; legend "Readiness evidence for this
   scope"); Reason. Hidden `planId`, `_rev.controls`.
6. `h2` Review (visible): "When you approve: the audience you chose can select [offering] at once. Your name,
   reason and evidence are recorded. A later publication does not undo the launch. Suspension is the narrowing
   tool; lifting a suspension restores exactly the approved scope." (expand: "The audience widens to your choice.
   Scope cannot narrow later; suspension is the narrowing tool.")
7. Buttons: "Approve launch" / "Expand scope"; "Cancel" to SA-05h.

| State | Condition (facts of `ops.launch_offering`) | Copy and controls |
|---|---|---|
| Unavailable: requirements not met (launch) | Any §2.4 item of Defined, Validated, Operationally ready is Not met, or `plan = null` | CMP-10 in place of the fields: "Approving the launch is unavailable until every launch requirement above is met. Owner: SuperAdmin." Route links to SA-05i and SA-05b. Button "Approve launch" shown with `aria-disabled` and the reason (AC-13). No form |
| Already launched (launch) | `launch_state = launched` | "This offering is already launched for [audience]." Link "Expand the launch scope" when the audience is named; otherwise "The audience is every active travel agent; it cannot widen further." No form |
| Withdrawn | `withdrawal_state = effective` | "This offering is withdrawn. Withdrawal is irreversible in this build: there is no relaunch." No form |
| Expand not applicable | not launched, suspended, or audience `all_active_tas` | The fact: "Expanding needs a current launch for named travel agents, with no suspension." Link to SA-05h. No form |
| C3 | — | 303 to SA-05h: `launched` "Offering launched" — Audience, Launch plan version, Acknowledged unavailable items, "Travel agents in the audience see it in Services now."; `expanded` "Launch scope expanded" — Audience |
| C2 | — | `launch_acknowledgement_mismatch` → acknowledgement fieldset; `launch_audience_invalid` → named accounts field; `launch_audience_not_wider` → audience; `launch_plan_not_current`, `launch_plan_incomplete`, `launch_item_not_supported` (blockers name the items), `provider_route_unapproved`, `parked_custody_route_policy` (CMP-10, parked) → form-level items; all typed values kept |
| C2 already decided by another SuperAdmin | `conflict_duplicate` `launch_already_current` (`launch.ts:179`) | "Another SuperAdmin launched this offering first: [approver name], audience [audience]." from the re-read `decisions[state=current]`; no form; link to SA-05h |
| C5 | `stale_revision` on `controls` | CMP-14 rows: Launch plan (version in the form / current), Launch, Suspension; typed values kept |

### 3.11 SA-05k Public site `/admin/public-site`

`h1` "Public site"; lead "The public pages are static, versioned content. They never show live catalogue data,
prices or private data."; freshness. Section "Published content": Content version, Content digest (copy), Pages
"[n] pages", Supported countries listed "[n] countries". Section "Release blockers": each blocker as text
(`BLOCKER_TEXT`, `public-site.ts:18-23`, plus the WP-20 code `public_copy_unapproved`: "The public copy is not
approved for this content version."); an unknown code shows "Release blocker [code]" (UAT-13 fallback); none:
"No release blocker in the content." Line "Run the crawl and search-readiness check before the first release and
record its report as release evidence." `site = null`: "No public content is loaded in this installation."
No command.

### 3.12 TA-02 Services `/ta/catalogue`

1. Header: `h1` "Services"; lead "Services TravelMudra offers you, by country, with their price, processing
   estimate and documents. A price is fixed for an application when you submit it."; freshness.
2. Notice when no row is selectable but rows exist: "No service is currently available for new applications in
   this scope." (UX §4.4). The information rows stay.
3. Country index (only with two or more countries): "Countries: [A] · [B]" as in-page links to the sections
   (D-W02-06).
4. One section per country (`h2` country name, `id="country-[n]"`): table (caption "Services in [country]",
   hidden). Columns: Service (link `/ta/catalogue/[offeringId]`, then "Synthetic test service" when synthetic);
   Who files ("TravelMudra files" / "Preparation only — you file" / "Filed by a declared provider"); Availability
   ("Available for new applications", or "Information only" with the reason line from `TA_REASONS`,
   `ta-catalogue.ts:35-51`; withdrawn: "Withdrawn"; suspended: "Paused").
5. No action column. The table stays a `table` with links (pinned by `browser.test.ts:95`).

| State | Copy |
|---|---|
| S2 | Empty state title "No service is available for new applications"; body "No service is currently available for new applications in this scope." No wait-list promise; no "appear here" sentence |
| S4 | Unknown reason code: "This is not available at the moment." (existing fallback) |
| Support view | Same page on the staff origin, read only; no actions exist on this page |

Mobile: rows as cards: service (link), who files, availability with reason.

### 3.13 TA-03 Service detail `/ta/catalogue/:offeringId`

Section ids `cost`, `estimate`, `documents`, `process` stay (pinned by `browser.test.ts:102`).

1. Identity band: breadcrumb "Services"; `h1` service title; meta: Country; Who files; "Synthetic test service"
   badge and the notice "This service exists only in test installations. Nothing is filed with a real authority."
   when synthetic; freshness.
2. Availability fact: selectable → "Available for new applications." Not selectable → CMP-10: "Starting a new
   application for this service is unavailable: [reason]. Owner: TravelMudra." Reason from `TA_REASONS` per code,
   deduplicated (suspended: "TravelMudra has paused new applications for this service. Work you already started
   continues as TravelMudra decided."; withdrawn; not open; head unusable).
3. Primary action (selectable, `/ta/groups` registered, not support view): "Start an application" → `/ta/groups`,
   with the line "Choose or create a group of travellers for [country], then add an application for this
   service." At wide width it is in the header actions; on phones it is at the end of the identity band. WP-03 MAY
   point it at TA-13. In support view: no action and no sentence.
4. `section#cost` "Cost": Service price "[₹] fixed when you submit"; Government fee (fee statement; `unavailable`
   → "Not declared." plus the reason sentence); when `priceFeeRelation = unselected`: CMP-10 "How the service price
   relates to the government fee is unavailable until the product owner decides it. Owner: product owner."
5. `section#estimate` "Processing estimate": "[min] to [max] calendar days" ("[n] calendar days" when equal),
   "This is an estimate, not a guarantee.", the note when present.
6. `section#documents` "Required documents": table: Document (label, description), Needed (Required / Optional),
   Formats (PDF, JPEG, PNG as declared), Size limit (`formatBytes`). A row with no formats or `maxBytes = 0` shows
   "Not declared" in that cell (F-W02-05). No global "5 MB" sentence: the page states only the values Core returns
   (WP-01 Q-13 rule).
7. `section#process` "How it works": ordered steps; "Notes from TravelMudra" paragraph when `displayNotes` is set.
8. Section "Not available for this service" (from `boundaries`, without `unselected_price_fee_formula`): one CMP-10
   line per code (withdrawal after submission, cancellation, original return), owner "product owner".
9. Not rendered until STOP-W02-01 is served (D-W02-07): "Who can apply" (eligibility) and "What TravelMudra does"
   (promise, inclusions).

| State | Copy |
|---|---|
| S6 | Not visible to this travel agent (not launched, outside the audience, unpublished, no head): uniform SH-02 Denied; no name, no id echo |
| S4 | "Not declared" per missing value; never "0 bytes", never an empty cell |

Mobile: identity, availability, primary action, then the sections stacked.

### 3.14 Receipt facts per command (CMP-08)

| Done code | Host page | Receipt title | Resulting facts (source) |
|---|---|---|---|
| `country` | SA-05a | Country added | Country, code, public address, listing (`cat.admin_index.countries`, by `summary.countryId`) |
| `listing` | SA-05a | Listing changed | Country, listing now (same) |
| `offering` | SA-05b | Offering created | Title, country, who files; "Not published. Not launched." (`cat.admin_offering`) |
| `declaration` | SA-05c | Declaration draft registered | Version, status (`cat.admin_declaration.row`) |
| `approval` | SA-05c | Owner approval recorded | Last approval: kind, items, approved on (`approvals`) |
| `bound` | SA-05c | Binding registered | Capability profile, support (`bindings`) |
| `baseline` | SA-05d | Business values draft saved | Version, status, price (`cat.admin_baseline`) |
| `previewed` | SA-05e | Preview recorded | Computed at, open applications |
| `published` | SA-05f | Published | Publication no., kind, publication time, impact assessment link |
| `plan` | SA-05h | Launch plan recorded | Version, completeness, missing count (`plan`) |
| `launched` | SA-05h | Offering launched | Audience, plan version, acknowledged items (`decisions[current]`) |
| `expanded` | SA-05h | Launch scope expanded | Audience (`decisions[current]`) |
| `created` | SA-06c | Account created | Name, role, status; next step (§4.3) |
| `approved` | SA-06c | Account approved | Status; "Activate it when it should be able to sign in." |
| `declined` | SA-06c | Account declined | Status; "Its address is free for a new account." |
| `activated` | SA-06c | Account activated | Status; staff: enrolment row (state, mail state, expiry) and "An enrolment code is being sent to [email]. You never see it." |
| `suspended` | SA-06c | Account suspended | Status; "Every session, open code, address change, enrolment and grant of the account ended." |
| `restored` | SA-06c | Account restored | Status; "Grants were not restored." |
| `restore_requested` | SA-06c | Restoration requested | Open elevation request (requester, expiry); "A second, different SuperAdmin decides it." |

No receipt shows an accepted time (WP-01 STOP-01, P-02). Where the read model has the event time of the fact
(publication time, status changed at), the receipt shows it with its own label.

### 3.15 Stale revision (CMP-14) per aggregate

| `_rev` | Pages | Rows shown (yours / current) |
|---|---|---|
| `country` | SA-05a listing | Listing |
| `offering` | SA-05b draft; SA-05e publish | Head declaration, head values, availability |
| `declaration` | SA-05c approval | Status, approvals count (unit "approvals") |
| `baseline` | SA-05d edit and preview; SA-05e publish | Changed values field by field (typed vs re-read); status |
| `controls` | SA-05i plan; SA-05j decision | Plan version, launch, suspension, audience |
| `account` | SA-06c actions | Status ("Approved, since [time] IST") |

"Who changed it and when" rows are absent (no read model carries them), never "unknown".

## 4. SA-06 Accounts & access

### 4.1 SA-06a Accounts `/admin/accounts`

1. Header: `h1` "Accounts"; destination tabs; actions "Create an account" (primary); meta: Active SuperAdmins
   "[n]", Open elevation requests "[n]" (link to `/admin/elevations`); freshness.
2. Receipt (none on this page; account receipts are on SA-06c).
3. Admin-loss notices when `activeSuperAdmins ≤ 1`: "Only one active SuperAdmin." (or "No active SuperAdmin.")
   "Creating, elevating or restoring a SuperAdmin needs a second, distinct active SuperAdmin." and CMP-10:
   "Recovering access after the loss of every SuperAdmin is unavailable until the product owner selects a recovery
   policy. Owner: product owner."
4. Filters (GET `role`, `status`, enumerated values only, SH-R06): Role, Status, "Apply filters"; "Clear filters"
   link when one is set.
5. Table: Name (link), Email (wraps anywhere), Role, Status (badge text), Authenticator (staff: "Set up" / "Not set
   up"; travel agent: "Not used"), Data ("Synthetic fixture" / "Real"). Rows that wait for a SuperAdmin (pending,
   approved) carry the attention marker with text.
6. Cap line when `rows.length = 500` (the contract maximum): "This list shows at most 500 accounts. Use the filters
   to narrow it." (no total is claimed, Q-W02-07).

| State | Copy |
|---|---|
| S2 | "No accounts yet." (cannot occur once a SuperAdmin is signed in; kept for the fixture) |
| S3 | "No accounts match these filters." Action "Clear filters" |

### 4.2 SA-06b Create an account `/admin/accounts/new`

1. Header: breadcrumb "Accounts & access / Accounts"; `h1` "Create an account"; lead "The account starts as
   waiting for approval. It cannot sign in until it is approved and activated."
2. CMP-10 (TA eligibility, OC-10, B-01): "Checking a travel agent's eligibility or fraud risk is unavailable until
   the product owner selects the criteria. Approval records your judgement and reason. Owner: product owner."
3. Error summary (C1/C2).
4. Form #16: Role (select, placeholder "Choose a role", no default; hint "A new SuperAdmin needs approval by a
   second, different SuperAdmin."); Email address (type email, maxlength 320; hint "The person signs in with codes
   sent here. Only a travel agent can change their own address later."); Display name (maxlength 120); Reason.
5. Review (visible): "What happens next: Travel agent or operator: a SuperAdmin approves the account, then
   activates it. SuperAdmin: a second, different SuperAdmin approves the request, then the account is activated.
   Staff receive an enrolment code at their own address when activated; nobody else sees it."
6. Button "Create account"; "Cancel".

| State | Copy |
|---|---|
| C2 `email_in_use` | On the email field: "Another account already uses this address." Link "Open that account" when Core returns `existing` (SuperAdmin scope covers every account; CR-04 concerns sign-in pages) |
| C2 `email_invalid`, `synthetic_email_refused` | On the email field (existing `MESSAGES`) |
| C2 `audit_degraded` | Form-level: "The audit record is behind, so creating an account is unavailable now. Suspension and declines still work." (create is privileged, `accounts.ts:84`) |
| C3 `created` | 303 to SA-06c |

### 4.3 SA-06c Account `/admin/accounts/:accountId`

1. Header: breadcrumb; `h1` display name (wraps); status badge; meta Role, Reference (copy); action "Duties and
   hand-off" (operator only); freshness.
2. Receipt.
3. Facts list: Email address; Role; Status "since [time] IST"; Created "[time] IST by [name]" or "by the synthetic
   seed"; Authenticator; Enrolment (state, purpose, mail state, expiry; "The code is never shown here.", existing
   `enrolmentText`, `identity.ts:205-214`); Open sessions "[n] sessions"; Data.
4. Action panel "Next action" by status:

| Status | Owner and next step |
|---|---|
| `pending_approval`, not SuperAdmin | "SuperAdmin: approve or decline this account." |
| `pending_approval`, SuperAdmin | "A second, different SuperAdmin decides the request." Open request: "Requested by [name] on [time] IST. Expires [time] IST." Link "Open elevation requests". No approve control on this page |
| `approved` | "SuperAdmin: activate the account when it should be able to sign in." |
| `active` | "No action is waiting." |
| `suspended` | "The account cannot sign in. Restore it, or leave it suspended." SuperAdmin: "Restoring needs a second, different SuperAdmin." |
| `declined` | "No action. A declined account stays declined. Its address can be used for a new account." |

5. Section "Account status" (WP-02 actions, in-page `confirmDisclosure`, ordinary first, containment last):

| Action | Shown when (facts) | Title | Consequences | Extra |
|---|---|---|---|---|
| Approve | `pending_approval`, role not SuperAdmin | "Approve [name]'s account" | "Status becomes Approved. The account still cannot sign in until it is activated." | — |
| Activate | `approved` | "Activate [name]'s account" | TA: "Status becomes Active. The travel agent can sign in with codes sent to their address." Staff: "Status becomes Active. An enrolment code is sent to [email]. You never see it." | — |
| Restore | `suspended` | "Restore [name]'s account" / SuperAdmin: "Request restoration of [name]" | "Status becomes Active. Grants are not restored." (+ staff without authenticator: "An enrolment code is sent to the account's address.") / "An elevation request opens. A second, different SuperAdmin decides it." | — |
| Decline | `pending_approval` | "Decline [name]'s account" | "Status becomes Declined. The address becomes free for a new account." (+ SuperAdmin: "The open creation request is declined.") | — |
| Suspend | `active` or `approved` | "Suspend [name]'s account" / self: "Suspend your own account" | "It takes effect at once, everywhere." "Every session ends; open codes, address changes and enrolments stop working." "Every grant is revoked and is not restored later." TA: "Groups and applications are kept." Operator: "Assigned work stays assigned. The SuperAdmin queue owns it until it is reassigned." Self: "You are signed out at once." | Operator: duties summary (below). Last active SuperAdmin: warning + CMP-10 + checkbox `acknowledgeLastSuperAdmin` "I understand that no active SuperAdmin will remain and that recovery is unavailable" (not checked) |

   Each form has a reason field labelled for its purpose ("Reason for approving", …) and `_rev.account`.
   Privileged actions (approve, activate, restore; create on SA-06b) when `auditOk` is false: the trigger is shown
   disabled with the visible reason "Unavailable while the audit record is behind." (AC-13). Decline and suspend
   stay available (`privilegedElevation: false`, `accounts.ts:142,195`).

   Operator duties summary inside the suspend confirmation (UX §6.3 Account changes): from `iam.operator_duties`:
   "Unresolved duties that need audited reassignment: [n] assigned applications, [n] acts where this operator owns
   reconciliation, [n] open holds, [n] owned incidents." Link "Open duties and hand-off". When the read fails:
   "Duties: Unavailable now. Open duties and hand-off before you suspend." The counts are lengths of Core's lists
   (not a computed business fact).

6. Section "Access and support" (carried WP-15 forms: reset second factor, request elevation, accounting grant,
   support view; current markup and rules).
7. Boundaries (CMP-10): travel agent — "Only the travel agent can change this address. Staff cannot change it."
   and "Signing in without access to the current email address is unavailable until the product owner approves a
   recovery rule. Owner: product owner."; staff — "Changing a staff sign-in address is unavailable. Owner: product
   owner." No control changes an email address on this page (B11, UX §6.3).
8. Section "Grants" (table, read only; "Grants are managed on the Grants page").
9. Section "History" (timeline: title, actor, "Recorded [time] IST", reason).

| State | Copy |
|---|---|
| C2 `second_superadmin_required` | "A second, different SuperAdmin must decide this. The requester and the account itself cannot approve it." |
| C2 `last_superadmin_ack_required` | On the checkbox: "Confirm that you understand no active SuperAdmin will remain." |
| C2 `audit_degraded` | As SA-06b |
| C2 `self_action_not_allowed` | "You cannot do this to your own account." |
| C5 | CMP-14 row Status (yours from the page; current "[status] since [time] IST"); the reason text stays in the field |
| Self suspension ACC | 303 to `/staff/sign-in` (existing); WP-01 shows the signed-out message |

### 4.4 SA-06d Operator duties `/admin/accounts/:accountId/duties`

`h1` "Duties of [name]"; status badge. Suspended operator notice: "These duties stay with this suspended operator
until each one is reassigned. The SuperAdmin queue owns them meanwhile. Reassign each application with a reason
from its case page; nothing moves automatically." Sections with counts and units: "Assigned applications ([n])"
(each a link to `/admin/applications/[id]` when that page is registered, else the reference with copy); "Acts where
this operator owns reconciliation ([n])"; "Open holds on assigned applications: [n] holds"; "Owned incidents
([n])". Empty list: "None." A non-operator account: SH-02 Denied as Core answers.

### 4.5 Boundaries on SA-06 (summary)

| Boundary | Source | Where | Treatment |
|---|---|---|---|
| TA eligibility and fraud criteria | BS B08, B44; OC-10; B-01 | SA-06b | CMP-10; approval records judgement |
| First-admin and all-admin-loss recovery | BS B11, B44 | SA-06a (≤ 1 active SuperAdmin), SA-06c (last-SuperAdmin suspension) | CMP-10; acknowledgement checkbox |
| Lost travel-agent mailbox | BS B09, B44 | SA-06c (TA) | CMP-10; no reset control for a travel agent |
| Email overwrite | UX §6.3; BS B11 | SA-06c | No control; note "Only the travel agent can change this address" |
| Second SuperAdmin for a new SuperAdmin | BS B11 | SA-06b, SA-06c | Elevation request opened by Core; decided on `/admin/elevations` (WP-15, Q-W02-03) |

## 5. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 102e4c9 already behaves as required.

| Page | Hostile state | Required behavior | Today |
|---|---|---|---|
| Every form | Nth identical submission (same `_op`, same content) | K-STD replay: the original accepted result; 303 to the same receipt; "Recorded once" | Yes (receipt is new) |
| Every form | Same `_op`, different content (Back, edit, resend) | `conflict_operation_key`: re-render, form-level "This form was already used with different content. Open the page again." (`operation_key_reused`), typed values kept | Partly (values lost) |
| SA-05a create offering | New `_op`, same country + service code + mode (double click across tabs) | `offering_identity_taken` from the unique guard (`kernel/guard-constraints.ts:45`); link to the existing offering when Core names it | Partly (no link) |
| SA-05a create country | Two SuperAdmins add the same code at once | One wins; the other gets `country_code_taken` or `slug_taken` on the field | Yes (copy) |
| SA-05a listing | Two SuperAdmins change the listing at once | Second: `stale_revision` → CMP-14 (Listing) or `listing_unchanged` | Partly (no comparison) |
| SA-05b draft | Refusal of a 10 KB JSON body | Body kept in the field; error summary | **No**: `declarationRerender` passes no typed value (`routes.ts:44-45`), the body is lost (F-W02-03) |
| SA-05b draft | Two SuperAdmins draft at once | Second: `declaration_draft_open` (conflict) with a link to the open draft | Yes (copy) |
| SA-05d edit | Stale `_rev.baseline` (another tab saved) | CMP-14 per value; typed values kept | Partly |
| SA-05e publish | Two SuperAdmins publish the same preview | Second: `baseline_already_published` or `preview_stale`; no second publication; link to the publication | Yes (copy) |
| SA-05e publish | Preview computed, then new applications submitted | `preview_stale` (scope fingerprint, `baselines.ts:161`); "Preview again" on the same page | Partly (preview form only on the values page) |
| SA-05e publish | Summary lacks a key (old preview row) | "Unavailable", never "0 applications" | **No** (`baselines.ts:125-132` uses `?? 0`, F-W02-01) |
| SA-05e publish | Answer lost | 303 to `/admin/operations/<key>`; "Checking the original result"; the page offers no new publication of the same preview | Yes (WP-01 copy) |
| SA-05i plan | Refusal (invalid time zone) of a 240-field plan | Every typed value kept; summary links to the field | **No**: `launchRerender` re-reads the old plan (`routes.ts:50-51`), every typed value is lost (F-W02-03) |
| SA-05i plan | Two SuperAdmins record plans at once | Second: `stale_revision` on `controls`; CMP-14; typed values kept | Partly |
| SA-05j launch | Two SuperAdmins approve at once | Second: `launch_already_current` whatever revision it carried (`launch.ts:179`); "Another SuperAdmin launched this offering first: [name]" | Partly (generic text) |
| SA-05j launch | Requirement becomes unmet after the page loaded (plan superseded, binding withdrawn) | Core refuses with the named blocker; page shows it and the current checklist | Yes |
| SA-05j launch | Acknowledgement list changed after load (release changed item support) | `launch_acknowledgement_mismatch`; re-render lists the current items, none checked | Partly |
| SA-05h, SA-05a | `audienceSize` null; `audienceSizes` lacks a launch | "count unavailable" | **No** (`admin.ts:39`, `launch.ts:240` use `?? 0`, F-W02-01) |
| TA-03 | Document requirement without formats or size (defensive fallback `display.ts:106`) | "Not declared" | **No** (`formatBytes(0)` = "0 bytes", F-W02-05) |
| TA-03 | Offering suspended while the travel agent reads it | Reload shows "Paused" and CMP-10; Start is absent; intake refuses `offering_suspended` (WP-03 copy) | Yes |
| TA-03 | Out-of-audience or unlaunched offering by direct link | Uniform 404 (`bindings/catalogue.ts:27-33`) | Yes |
| SA-06c | Two SuperAdmins approve the same account | Second: `stale_revision` (status changed); CMP-14 "Approved since [time]" | Partly |
| SA-06c | Two SuperAdmins suspend the last two SuperAdmins at once | Each transaction locks its target; the count check runs in each; the second sees one active SuperAdmin and needs the acknowledgement (`accounts.ts:205-207`) | Yes (Core) |
| SA-06c | Reason refused (too short) | Reason kept; error on the field | **No**: `reasonField` has no value (`identity.ts:103-108`) (F-W02-03) |
| SA-06c | Audit projection behind | Privileged actions disabled with reason; decline and suspend available | Yes |
| SA-06c | Operator duties read fails | "Duties: Unavailable now" with the link; suspension stays available | New |
| All SA pages | The SuperAdmin is suspended by another SuperAdmin mid-task | Next request: session ended → sign-in with the WP-01 "session ended" message; typed input is lost; nothing was written | Yes (residue accepted, P2 note) |
| All | Access revoked for a travel agent (suspended) | Session revoked; sign-in page | Yes |
| All | Long names: offering title 400, country 80, display name 400, email 320, reason 4000, JSON 128 KB | Wrap anywhere; `h1` wraps; tables stack; JSON and impact lists scroll in labelled regions; breadcrumb items truncate visually with the full text in the DOM | Partly |
| All | 320 px and 400 % zoom | One column; no two-dimensional page scroll except labelled regions (AC-04) | Partly |
| All | JavaScript off | Every page works: disclosures are `<details>`, decision pages are plain forms, no dialog is needed | Yes |

## 6. Accessibility notes specific to WP-02

- One `h1` per page; panels are `h2`; readiness groups `h3` (AC-03).
- Status facts are a definition list; every badge has text (AC-06).
- Every disabled control has `aria-disabled="true"` and `aria-describedby` to its visible reason (AC-13).
- Checkbox groups (acknowledgements, owner-gated items) are fieldsets with legends; each label names the item
  (AC-15).
- Decision pages: the error summary takes focus after a refusal (AC-08); the receipt is first in `main` and first
  in the title after a 303 (WP-01 R14).
- The JSON textarea has `spellcheck="false"` and a visible label; the code block region has `role="region"` and a
  label.

## 7. Proof scenario V01 on `lane-ui`

V01 (UX §12): "TA explains cost, estimate, documents and actual service mode before intake; unavailable route
cannot create a draft." BS B01–B07.

### 7.1 What exists on `lane-ui` today (facts and inference)

- Installation record `~/.local/share/travelmudra-uat/lane-ui/uat-instance.json`: deployed ref
  `ui-revamp-2026-10-12` at 102e4c9, `steps_done` includes `seed` (`tm seed synthetic`, accounts then catalogue
  with launch). Edge 4650, staff 4652.
- Seed content (`catalogue/synthetic/catalogue.json`): countries Synthetica (SYN, listed) and Synthetica Beta (SYX,
  listed); nine offerings; baselines ₹1,800 to ₹5,400, estimate 5 to 12 calendar days with the note "SYN synthetic
  estimate", documents passport and photo (preparation only adds travel itinerary), three process steps.
- Launch seed (`src/modules/operations/commands/seed.ts:1-6, 72-84`): every named offering gets a complete plan and
  a launch for every active travel agent; an offering whose head cannot launch is left unlaunched. "SYN Provider
  visa (route not approved)" cannot launch (`provider_route_unapproved`, `readiness.ts:85`).
- Accounts (`src/modules/identity/commands/seed.ts:36-45`): syn-superadmin-1 and -2, syn-operator-1 to -3,
  syn-ta-1 to -3, all active.
- Inference, not checked against the database (no server access in this design step): eight offerings are
  launched; the unapproved provider offering is not launched. The PM MUST confirm both on SA-05g before step 1.

### 7.2 Steps and observable results

Sign-in through the LD-11 harness; screenshots allowed, codes never printed.

| Step | Actor, page | Observable result |
|---|---|---|
| V01-1 | syn-ta-1, TA-02 | Two country sections. Eight rows "Available for new applications". Each row names who files. "SYN Provider visa (route not approved)" is absent. Environment label present |
| V01-2 | syn-ta-1, TA-03 "SYN Tourist e-visa" | Cost ₹3,500 "fixed when you submit"; government-fee statement as Core returns it; estimate "5 to 12 calendar days. This is an estimate, not a guarantee. SYN synthetic estimate"; documents Passport and Photograph with formats and size; three steps; "TravelMudra files"; "Synthetic test service"; "Start an application" |
| V01-3 | syn-ta-1, TA-03 "SYN Tourist visa preparation" and "SYN Tourist visa via provider" | Who files "Preparation only — you file" (travel itinerary in documents) and "Filed by a declared provider"; each "Not available for this service" boundary line names its owner |
| V01-4 | syn-superadmin-1, SA-05g | The unapproved provider offering: "Not launched"; "What blocks a launch" names the provider item |
| V01-5 | syn-superadmin-1, SA-05j kind=launch for that offering | No form; CMP-10 "Approving the launch is unavailable until every launch requirement above is met"; disabled button with its reason |
| V01-6 | syn-ta-1, direct URL `/ta/catalogue/[that offering id]` | SH-02 Denied (404), no name, no id echo |
| V01-7 | syn-superadmin-1, SA-05a → SA-05j (new synthetic offering) | Through the rebuilt pages: create offering in Synthetica Beta with a unique code per run (`syx_v01_[yyyymmddhhmm]`, Q-W02-04); register the draft from the JSON shown on an existing SYX declaration page; record the structure approval (evidence kind owner approval); bind; save values; preview; publish on SA-05e; record the plan on SA-05i (owners from the select); launch on SA-05j for named audience syn-ta-1 only. Each step shows its receipt |
| V01-8 | syn-ta-1 and syn-ta-2, TA-02 | syn-ta-1 sees the new offering with its price and estimate; syn-ta-2 does not; syn-ta-2's direct URL is Denied |
| V01-9 | Test (not `lane-ui`) | System test: a hand-made POST of the individual intake form (`ta.intake.start_individual`) with `service.[unlaunched offering id]=yes` is refused `control_blocked` with the row's launch code (all or nothing, `src/modules/intake/commands/start-individual.ts:146-152`; bulk: `offering_not_launched`, `start-bulk.ts:79-82`), and no application row exists. WP-03 adds the same proof on its own pages |
| V01-10 | axe | Every WP-02 page visited in V01-1 to V01-8 has no axe violation at 1440 px and 390 px |

Proof split: `L` (on `lane-ui`) V01-1 to V01-8 and V01-10; `T` (test) V01-9 and the states of §3 and §4 that
`lane-ui` cannot produce (information-only rows need a suspension, which is WP-13; a fixture covers them).

### 7.3 SA-06 acceptance proof (not V01; for the PM's checklist)

On `lane-ui`: syn-superadmin-1 creates a travel agent account (approve, activate; receipts); creates an operator
account and activates it (enrolment row shows the mail state; the harness enrols the account from the synthetic
mailbox in memory, as WP-01 PM Q-05); creates a SuperAdmin account (status "Waiting for approval", next action
names the second SuperAdmin; syn-superadmin-2 approves on `/admin/elevations`; syn-superadmin-1 activates); suspends
an operator that holds no work (duties "0 assigned applications" from Core's empty list) and restores it. The
last-SuperAdmin acknowledgement is proven by test only: suspending on `lane-ui` would lock the installation.

## 8. Implementation breakdown

### 8.1 Work units (disjoint files)

Phase A runs U0 and U1 in parallel after WP-01 is integrated. Phase B runs U2, U3 and U4 in parallel after U0.
Phase C runs U5. The architect adds gallery registration lines to `scripts/dev/gallery-pages.ts` and edits
`DESIGN.md` once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery module |
|---|---|---|---|
| **U0 Decision and panel components** | New `src/web/ui/decision.ts` (CMP-25 `decisionPage`, review block), new `src/web/ui/panels.ts` (CMP-01 `actionPanel`, `statusFacts`, `objectTabs` reusing the WP-01 local-nav markup), `src/web/ui/index.ts` (exports), `static/css/components.css` (WP-02 additions only) | New `test/unit/web/decision.test.ts` (section order; review never inside `<details>`; unavailable state renders no `form`; disabled control has `aria-describedby`) | `scripts/dev/gallery/decision.ts` |
| **U1 Services** | `src/apps/shared/ta-catalogue.ts`, new `src/apps/shared/pages/services.ts` (list and detail renderers, TA and staff wording), `src/apps/staff/catalogue/ops-discovery.ts` | New `test/unit/web/services-pages.test.ts` (groups, information-only reasons, empty copy, all-unselectable notice, section ids, "Not declared" cells, no "0 bytes", support view without action, synthetic labels); update `test/system/browser.test.ts:28, 93, 227` (title "Services") | `scripts/dev/gallery/services.ts` |
| **U2 Catalogue pages** | `src/apps/staff/catalogue/admin.ts`, `baselines.ts`, `editor.ts`, `shared.ts` (receipt titles, missing-field labels, the D7 fixes), `public-site.ts` | New `test/unit/web/catalogue-pages.test.ts` (panels and headings; next-action facts; `audienceSize` null; preview summary keys absent → "Unavailable"; declaration page has no publish form; preview page has the declaration publish form with `previewId`, `baselineId`, `_rev.offering`; typed JSON and values kept) | `scripts/dev/gallery/offerings.ts` |
| **U3 Launch pages** | `src/apps/staff/catalogue/launch.ts`, new `src/apps/staff/catalogue/launch-plan.ts`, new `src/apps/staff/catalogue/launch-decision.ts` | New `test/unit/web/launch-pages.test.ts` (five label headings and no stage marker; decision page states of §3.10; acknowledgements none checked; plan typed values kept; owner select with text fallback) | `scripts/dev/gallery/launch.ts` |
| **U4 Accounts** | New `src/apps/staff/accounts/pages.ts` (list, create, detail, duties renderers; account messages table, falling back to `messageOf`), `src/apps/staff/identity.ts` (account routes only: new renderers, typed reason on refusal, receipt locations, the optional duties read; elevation, grant and support-view routes unchanged) | New `test/unit/web/accounts-pages.test.ts` (actions per status; SuperAdmin pending shows no approve and names the second SuperAdmin; last-SuperAdmin acknowledgement; duties summary and "Unavailable"; no email control; boundaries; carried WP-15 forms present) | `scripts/dev/gallery/accounts.ts` |
| **U5 Routes and wiring** | `src/apps/staff/catalogue/routes.ts` (receipt locations; typed re-render for draft, plan, decision, publish; the two new GET routes; publish-declaration refusal re-renders SA-05e), `src/web/route-inventory.ts` (two entries), `src/apps/shared/common-routes.ts` (`resultHrefOf`: `offering` → `/admin/catalogue/offerings/:id`, `catalogue_admin` → `/admin/catalogue`; WP-01 file), `docs/extending/new-service.md` (steps 6 to 8 name the new pages; step titles unchanged) | Update `test/unit/web/routes.test.ts` and `test/unit/bff.test.ts` (inventory count, new ids); update system tests of §8.3; new BFF test with a scripted Core: a refused plan re-renders with every typed value, a refused account action keeps the reason | — |

U2 and U3 both import `src/apps/staff/catalogue/shared.ts`; U2 owns it. U3 requests additions from U2 through the
architect.

### 8.2 Carried-form test

A unit test lists the carried forms of §1.5 by action path and asserts that each rebuilt page still renders them.
WP-13 and WP-15 remove entries when they rebuild them.

### 8.3 Existing tests that pin current behavior and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/new-service.test.ts:109-145` | Plan form read from the launch page; approve form and `ack.` inputs on the launch page | Read the plan form from SA-05i; the approve form from SA-05j kind=launch |
| `test/system/new-service.test.ts:102` | Declaration publish from the declaration page | Publish from SA-05e (the preview page) |
| `test/system/ported-pages.test.ts:214-260, 295, 309` | Exact redirect locations `?done=country`, `\?done=offering$`, `\?done=baseline$`, `\?done=previewed$`, `\?done=published$` | Allow `&op=<key>` |
| `test/system/ported-pages.test.ts:300-307` | Link `declaration#publish` on the declaration preview; publish from the declaration page | Assert the declaration publish form on the preview page and no baseline publish form there |
| `test/system/ported-pages.test.ts:85` | `location === /admin/accounts/[id]?done=suspended` | Allow `&op=<key>` |
| `test/system/browser.test.ts:28, 93, 227` | Title "Countries and services · Travel agent · TravelMudra" | "[TEST] Services · …" (with the WP-01 prefix) |

Stay valid (no change): `ported-pages.test.ts:142-168` (operator Services links), `:323-324` (headings kept),
`:329` (carried suspend redirect without `op`), `browser.test.ts:95-102` (table links, section ids),
`flows.test.ts:94, 114` (accounting-grant and create forms), and every support-view caller
(`case-views.test.ts:153`, `case-work.test.ts:278`, `core-pages.test.ts:515`, `intake-pages.test.ts:257`,
`payments-views.test.ts:335`, `refusals.test.ts:323, 354`).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding | Scenario | Design |
|---|---|---|---|---|
| F-W02-01 | P1 | Fabricated zeros: `audienceSize ?? 0` (`admin.ts:39`), `audienceSizes[...] ?? 0` (`launch.ts:240`), preview summary `?? 0` (`baselines.ts:125-132`) | A SuperAdmin reads "0 applications, total ₹0" for automatic reductions on an old preview whose summary lacks the key, and publishes without the price-correction choice the real count needed. | "Unavailable" / "count unavailable" (§3.5, §3.8) |
| F-W02-02 | P1 | The effect on existing work and the structure publication are on two pages | A SuperAdmin publishes a structure from the declaration page without the affected-application list in view, against UX §7.3 ("effect … before reason fields"). | D-W02-01 |
| F-W02-03 | P1 | Typed input lost on refusal: declaration JSON (`routes.ts:44-45`), the launch plan (`routes.ts:50-51`), decision fields, account reasons (`identity.ts:103-108, 357-364`) | A SuperAdmin types 240 plan fields, one time zone is invalid, and the re-rendered page shows the old plan; the work is retyped or abandoned (C1). | Re-render with `ctx.fields` over the read model on every WP-02 form |
| F-W02-04 | P2 | Publication record times in UTC (`baselines.ts:182-183`) | A SuperAdmin compares a publication at "08:30 UTC" with a receipt in IST. | IST (AD-10) |
| F-W02-05 | P2 | `formatBytes(0)` renders "0 bytes" for an undeclared size (`display.ts:106` fallback) | A travel agent reads a 0-byte limit and uploads nothing. | "Not declared" |
| F-W02-06 | P2 | The overview says "Ready for a launch decision" (`launch.ts:373`), a forbidden universal "Ready" | — | "Every listed launch requirement is met. No launch decision yet." |

### 9.2 Open questions and deviations for the architect

| ID | Rank | Question or deviation | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W02-01 | P1 | STOP-W02-01: TA-03 without eligibility and inclusions (D-W02-07) | A travel agent opens a service for a work-visa traveller; TA-03 does not say that the service covers tourism and business purposes only, and the agent starts intake for an ineligible applicant. | Raise STOP-W02-01. Until served, omit the two blocks and record the TA-03 acceptance item as partly met. V01 passes without them |
| Q-W02-02 | P1 | D-W02-02: the launch decision page under SA-05 now; AD-13 names launch as an SA-09 kind, SA-09 is built in WP-06 | WP-06 builds a second launch form on SA-09; two forms then record one decision with different wording. | Build CMP-25 and SA-05j in WP-02. WP-06 reuses CMP-25 for SA-09 and links launch kinds to SA-05j; one decision page per kind |
| Q-W02-03 | P1 | The second-SuperAdmin approval of a new SuperAdmin (`iam.approve_elevation`, WP-15) stays on the old `/admin/elevations` page | Max creates a SuperAdmin on `lane-ui`, follows "Open elevation requests" and lands on a page in the old layout. | Keep in WP-15 (register); the old page works (LD-02); the SA-06 proof uses it. Pull forward only if Max asks |
| Q-W02-04 | P1 | V01-7 writes a new synthetic offering on `lane-ui` per run | A rerun with a fixed service code fails with `offering_identity_taken`; the proof then fails for a reason unrelated to the pages. | Unique code per run; synthetic country only; the architect approves the write |
| Q-W02-05 | P2 | Named audience as a textarea of account references (D-W02-12) | A SuperAdmin copies a wrong reference; Core refuses `launch_audience_invalid`; no harm. | Keep the field; add the reference list. A checkbox picker needs a BFF field transform (repeated names are refused, `server.ts:726-734`); park |
| Q-W02-06 | P2 | STOP-W02-02: no fact names a third-party filing provider (UX §3.2) | A travel agent reads "Filed by a declared provider" and asks who the provider is. | Content input to Max; show the mode label only |
| Q-W02-07 | P2 | Account list capped at 500 rows, no total (`modules/identity/queries.ts:25-31`) | At 600 accounts, a SuperAdmin does not find an account without filters. | "At most 500" line; a Kind 1 total only on evidence |
| Q-W02-08 | P2 | Operator Services destination after WP-02 (§2.6) | An operator keeps a rail item that UX §5.2 does not list. | Re-render now; WP-07 decides retirement |
| Q-W02-09 | P2 | Government-fee timing (`travelmudra_pays.timing`) not worded on TA-03 | A travel agent cannot tell whether the fee is paid at submission. | Needs approved copy (CR-09); omit until supplied |
| Q-W02-10 | P2 | TA-03 "Start an application" goes to `/ta/groups` until WP-03 | The agent must choose the country again on the group form. | WP-03 points it at TA-13 with the country |
| Q-W02-11 | P2 | D-W02-11: "Impact review" as a fourth Offerings & launch tab | Impact pages mark the "Offerings" tab. | Add the member in the WP-01 destination table |
| Q-W02-12 | P2 | A SuperAdmin suspended mid-task loses typed input | A long plan form is lost when another SuperAdmin suspends the author. | Accept: nothing is written; SH-R12 forbids keeping it across sessions |

Deviation register:

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W02-01 | Declaration publication form on SA-05e, not SA-05c | Action and fields unchanged; host page changes; two system tests change |
| D-W02-02 | New GET page SA-05j for launch and expand | New route and inventory entry; actions and fields unchanged |
| D-W02-03 | New GET page SA-05i for the launch plan | New route and inventory entry; action and fields unchanged |
| D-W02-04 | Plan owner fields as a select of active staff, text fallback | Field names unchanged; two extra reads |
| D-W02-05 | Operator Services re-rendered with the TA-03 component | None |
| D-W02-06 | TA-02 country "filter" as grouped sections with in-page links | `zSelectable` has no country key (`bindings/catalogue.ts:20-25` drops `countryId`); no URL state |
| D-W02-07 | TA-03 eligibility and inclusions omitted until STOP-W02-01 | None |
| D-W02-08 | Consequence review as a visible block before the button; no extra checkbox, no two-step POST | None |
| D-W02-09 | Readiness grouped under the five OD §6 labels; no stage marker | None |
| D-W02-10 | WP-13 and WP-15 forms carried unchanged on rebuilt pages | None |
| D-W02-11 | "Impact review" destination tab (recommended) | One line in the WP-01 destination table |
| D-W02-12 | Named audience stays a textarea with a reference list | None |

### 9.3 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check (Kind 1) | Without it |
|---|---|---|---|---|---|
| STOP-W02-01 | Kind 1 (projection of existing facts) | Add to `cat.offering_display` (and `cat.ops_offering`, same `zOfferingDisplay`, `src/contracts/queries.ts:67-87`): `eligibility` {nationality, passportType, residence, purposes} from `eligibility.population`, and `promise` {deliverable, summary, claimsGovernmentResult}, each null when undeclared | UX §3.1 step 1 ("show declared … eligibility"), §4.2 Services detail ("eligibility, mode, inclusions"), UI-PLAN TA-03 blocks | 1. Both are declaration items Core holds (`src/kernel/vocabulary/decl.ts:99-109, 213-216`); nothing is inferred. 2. Not met in its letter: the need is a missing fact, not a join or a client computation (a travel agent cannot read declarations). The architect decides whether a field addition to an existing view needs the criterion. 3. Same authorization as today (`bindings/catalogue.ts:27-44`). 4. Named by subject; BU-P01/P02 reuse it. 5, 6: at implementation | TA-03 without the two blocks (D-W02-07); V01 unaffected |
| STOP-W02-02 | Not a Core change (no fact exists) | A provider name for third-party-filed offerings | UX §3.2 "Name the declared filing provider and responsibilities" | — (the declaration holds `routeRef` and `ownerApprovalRef` only) | Mode label only; content input to Max (Q-W02-06) |

No STOP item blocks the WP-02 main path. No P0 item is open in this design.
