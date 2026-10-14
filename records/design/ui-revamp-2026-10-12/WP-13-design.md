# WP-13 design review: offering change and suspension

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-13 holds
commands that stop new work, hold or release existing work, withdraw and retire an offering for good, and move an
application to other terms; a withdrawal and a retirement have no undo, so a Codex design review applies).
Product base: lane repository at 34e875b. WP-02 is committed at 228816a (SA-05 catalogue and launch pages,
`decisionPage`, the carried-form test); `src/modules`, `src/contracts`, `src/core-api` and `src/kernel` are identical
at e1f6ac9, 228816a and 34e875b. WP-03 (TA-07, TA-08, TA-09) is finished in the working tree and not committed; this
design reads its files from the working tree and builds after its integration. WP-06 to WP-12 are designed and not
built; §1.8 amends three of them. This document writes no product code. Paths in `file:line` form are relative to the
lane repository unless they start with `REC/` (`internal/records/`) or `RM` (lane `research/route-map.md`). The lane
research reports `research/wp13-facts/launch-control-commands.md` and `research/wp13-facts/impact-transition-commands.md`
were read; every fact this design relies on was checked against the code.

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 34e875b (WP-03 files: the working tree). "Target" means the specification or the plan.
"Core decides" means the page shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Eleven register commands (COMMAND-COVERAGE §3, §5.1): `ops.suspend_offering`,
  `ops.record_existing_work_treatment`, `ops.lift_suspension`, `ops.withdraw_offering`, `cat.retire_offering`,
  `cat.retire_declaration_draft`, `cat.request_impact_recheck`, `cat.assign_impact_reviewer`, `cat.decide_impact_items`,
  `cat.approve_transition`, `core.decide_transition` (TA-07 changed-terms panel, CC-06). SA-05 in full (UI-PLAN §12.2),
  TA-03 and TA-07 for an offering change. Proofs V20 and BU-27.
- **Page model (one host page per command).** The four launch-control commands become decision kinds of SA-05j
  (`…/launch/decide/:kind`, kinds `suspend`, `suspension_treatment`, `lift`, `withdraw`, `withdrawal_treatment`); their
  carried forms leave SA-05h. Retirement gets its own decision page SA-05x (`GET …/offerings/:id/retire`). The impact
  forms leave the assessment page: SA-05n decides one impact item, SA-05t approves one transition. The travel agent
  decides changed terms on TA-07t (`/ta/applications/:id/changed-terms`), with **Accept and Decline** (today only Accept;
  the decline is served and hidden). Recheck stays on SA-05b, draft discard on SA-05c, reviewer assignment on SA-05m;
  each is rebuilt with a receipt and kept typed values. Every form action, hidden input and field name stays.
- **Shell.** The rail member "Catalogue" becomes "Offerings" (the page title); "Impact review" `/admin/catalogue/impact`
  becomes a member of "Offerings & launch" (WP-02 §6, D-W02-11 closed).
- **V20 is met by Core and shown by the pages.** A publication and a released binding do not launch (SA-05h,
  TA-02 absence, tested release cut-over); a supported structural update of a launched, unsuspended offering admits new
  drafts on the new head with the same launch decision; existing work gets explicit impact items, owned holds and
  per-application transitions with the travel agent's renewed authority.
- **BU-27 is met for the non-bulk pages.** No page invents an offering or preselects one; every affected action
  states its constraint, its owner and that earlier work is kept. Bulk pages get acceptance additions (AM-W13-05).
- **Findings worked (§9.1).** The effect table shows generic text for the three existing-work codes (wrong message
  keys); the suspend form says submission stops when Core lets a draft submit under "continue"; the travel-agent text
  promises a withdrawn service may return; the TA-03 text claims existing work continues under a hold; the decline of
  changed terms is hidden; the TA handler truncates its fields (LD-17); held items on a superseded assessment cannot be
  reached; every WP-13 refusal loses the typed values and two lose the refusal itself.
- **STOP items (§9.4).** No P0. Kind 1 (P1): STOP-W13-01 changed terms for the travel agent (criterion point 2 needs
  Max's exception, as P-05); STOP-W13-02 impact items of an offering with application, transition state and decision
  facts; STOP-W13-06 launch-control effect per existing action on the TA case. Defects (P1): STOP-W13-03 a declined
  transition is invisible to every count and state while the application stays blocked; STOP-W13-04 a second approval
  after a decline reuses the declined transition and opens nothing; STOP-W13-05 the transition target is the head at
  command time and an applied transition to a superseded head is never rechecked (suspected; failing test first).
  P2 notes: STOP-W13-07, -08, -09.
- **Top questions (§9.2).** Q-W13-01 host pages and paths (CC-17); Q-W13-02 offer Accept and Decline on TA-07t before
  STOP-W13-01 is served; Q-W13-03 rail label and Impact review destination; Q-W13-04 decision forms by item facts on any
  assessment; Q-W13-07 irreversible proof writes on the run's own synthetic offering.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.1, §2.2, §2.3, §3.1 step 1, §3.2 (Withdrawn/suspended offering), §3.3, §4.1, §4.4 ("No offering selectable"), §6.1, §6.2, §6.3 (Offering management, Publication and impact, Launch/suspension/lift), §7.3, §7.4, §8.3, §10.1, §12 V20 |
| Bulk spec `BULK_UPLOAD_PRODUCT_UX_SPEC.md` | BU-27 (line 424) |
| `BUILD_SPEC.md` r2 | B05, B06, B07, B32, B33, B35 |
| `UI-PLAN.md` | A (AD-13), §3.2 TA-03, TA-07, §3.4 SA-05, SA-09, §4.2 (Withdrawn or suspended offering), §5.4 SA-05, §6.4, §7 (rows 1192–1195), §8, §10, §11.3, §12.2 WP-13, §13.1 OC-07 |
| `DECISIONS-2026-10-10.md` | §1.3 (OC-07), §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-07, LD-08, LD-12 to LD-17), §7, §8 (S-08), §9; `PROPOSALS.md` (P-02, P-05, P-06, P-09, P-10); `COMMAND-COVERAGE.md` §3, §5.4, §6, §6.1; `WP-02.md` (all; B-01 to B-14, §6); `WP-02-design.md` §1.2–§1.5, §2, §3.0, §3.8–§3.10, §3.14, §3.15, §8.2; `WP-02-U2-notes.md`, `-U3-notes.md`, `-U5-notes.md`; `WP-03.md` §3, §6; `WP-03-design.md` §1.5, §3.1, §7.5; `WP-06.md` §3–§4 (D-02, D-08); `WP-06-design.md` §2.1 group 8, §2.7.5; `WP-07-design.md` §2.4.7; `WP-10-design.md` (structure, §2.6, §7.1); `WP-11.md` §3–§4 (I-05, I-09); `WP-12-design.md` (structure); `WP-12.md` §3–§4 (J-02, J-08); `REPO/DESIGN.md` (Rules for new screens) |
| Route map (RM) | §2 rows D38, D39, D40, D43–D46, D80, D81, D84, D91, D92, T36; §2.3 (D06 unregistered); §3.2 rows of the eleven commands |
| Code (pages, routes) | `src/apps/staff/catalogue/impact.ts` (all); `launch.ts:517-720` (carried forms), `:547-585` (next action); `launch-decision.ts` (all); `admin.ts:574-591, 807-813`; `baselines.ts:425-480`; `routes.ts` (all); `shared.ts:59-135, 208-226, 399-435`; `src/apps/shared/core/ta.ts:298-306, 637-650`; `src/apps/edge/core/routes.ts:94-100`; `src/apps/shared/pages/review-submit.ts:85-120`; `src/apps/shared/pages/services.ts:54-75, 304-315`; `src/web/ui/decision.ts`; `src/web/ui/shell.ts:146-190`; `src/apps/staff/views/cases.ts:98-167` |
| Code (contracts, bindings) | `src/contracts/catalogue.ts:49-76, 150-176, 187-312`; `src/contracts/core.ts:88, 220-280`; `src/contracts/queries.ts:54-87`; `src/contracts/views-cases.ts:44, 84-92`; `src/contracts/identity.ts:48-62, 117-121`; `src/core-api/bindings/catalogue-admin.ts:95-172, 255-330`; `src/core-api/bindings/core.ts:187-232, 471` |
| Code (Core behaviour only) | `src/modules/operations/commands/launch.ts` (all); `src/modules/operations/launch/effect.ts`, `decision.ts`, `readiness.ts`, `read-model.ts`; `src/modules/catalogue/commands/impact.ts` (all), `identity.ts:127-150`, `declarations.ts:216-235, 320-360`, `common.ts:38-47`; `src/modules/catalogue/impact.ts`, `domain.ts:125-150, 211-268`, `queries.ts:73-101`, `read-models.ts:75-95, 199-226, 258-270`; `src/modules/catalogue/tasks/impact-recheck.ts` (all); `src/modules/core/commands/admin.ts:93-139`; `src/modules/core/catalogue-writers.ts:100-155`; `src/modules/core/derived.ts:285-421`; `src/modules/core/controls.ts:200-320, 375-378` |
| Tests that pin the pages | §7.3 |

### 1.2 What Core does (facts the pages rest on)

| Fact | Where Core holds it | What the pages must respect |
|---|---|---|
| Launch, suspension and withdrawal are separate controls of one offering | `ops_offering_controls` (`launch_state`, `suspension_state`, `withdrawal_state`, `revision`); every launch command locks the offering (share) then the controls row (update) and checks the controls revision (`operations/commands/launch.ts:74-85`) | Status facts on separate rows (UX §6.3); every launch-control form posts `_rev.controls` except the treatment form (below) |
| A suspension stops new work and gives existing work one treatment | `ops.suspend_offering` (`launch.ts:290-330`): needs `launched` and no active suspension (`offering_not_launched`, `suspension_active`); input `existingWorkTreatment` ∈ {`continue`, `hold`, `not_recorded`}; `not_recorded` is stored as `missing`; evidence 1–20; reason 10–1000. It does **not** check withdrawal or retirement | The suspension decision names the treatment before the button; "not decided yet" holds existing work (fail closed, `decision.ts:120-124`) |
| The effect of launch control per action | `launchEffect` (`effect.ts:46-75`). New work (`select_offering`, `start_intake`, `create_draft`): refused while not launched, out of audience, suspended, withdrawn or not published. Existing work (`submit`, `request_assistance`, `assign`, `start_operator_work`, `assistance_entry`, `record_readiness`, `authorize_*`, `release_packet`): suspension `hold` → hold `existing_work_hold`; `missing` → hold `existing_work_treatment_missing`; `continue` → no effect; withdrawal refuses `submit` and a draft's work (`offering_withdrawn`), and holds the rest unless its treatment is `continue` (`withdrawal_continuation_not_permitted`). Never stopped: `record_outcome`, `release_bytes`, `send_document_email`, `complete`, `reassign` (`:16`); untouched: act evidence, reconciliation, original return, incidents, withdrawal requests. The most restrictive effect wins, every code listed | The effect table of SA-05h is Core's (`ops.launch_offering.effects`, binding `catalogue-admin.ts:116-133`); a page MUST NOT compute an effect. A draft can be **submitted** under a `continue` suspension (`test/core/launch.test.ts:70`) |
| The existing-work treatment changes by its own token | `ops.record_existing_work_treatment` (`launch.ts:332-379`): input `causeRef` (`sus_` or `owd_`), `treatment` ∈ {`continue`, `hold`}, `expectedTreatmentId` (the concurrency token; no controls revision), evidence 0–20. A suspension treatment moves either way (`treatment_unchanged` for the same value); a withdrawal treatment only narrows `continue → hold` (`withdrawal_treatment_widening_unavailable`). The binding ignores the path offering (`catalogue-admin.ts:316-318`) | The form carries `causeRef` and `expectedTreatmentId` hidden; the page offers only a change that differs from the current value |
| Lifting restores exactly the approved scope and re-checks the head | `ops.lift_suspension` (`launch.ts:381-428`): `suspensionId`, `planId`, acknowledgements, evidence 1–20, `_rev.controls`; refuses `suspension_not_active`; runs `requireLaunchableHead` (published, launch-required items, provider route, original returns, exact acknowledgements, current and complete plan, `readiness.ts:74-100`). It does not check the treatment or a withdrawal. Expansion is refused while suspended (`launch.ts:262`), so the decision in force is the one suspended | The lift decision shows the launch requirements as for a launch; after a structural update the plan MUST be complete for the new head |
| Withdrawal is terminal | `ops.withdraw_offering` (`launch.ts:430-476`): `permitsUnfiledContinuation` (yes/no, required), `feasibility.*` (required when yes: `withdrawal_permission_required`), `acknowledgeIrreversible` (`withdrawal_irreversible_unacknowledged` at the field), evidence 1–20, `_rev.controls`; refuses a second withdrawal `conflict_duplicate/offering_already_withdrawn`, an unlaunched offering `offering_not_launched`. `launch_state` stays `launched`; no relaunch exists (`launch_already_current` afterwards) | The page states "cannot be undone" in Effect and Review; the acknowledgement is never prechecked and is left clear after a refusal |
| Retirement ends new selection only | `cat.retire_offering` (`identity.ts:127-150`): `_rev.offering`; refuses `offering_retired`, and `retire_requires_not_launched` while launched and not withdrawn; changes no application; later catalogue and launch edits refuse `offering_retired`. Result summary `{offeringId, revision}` | Retirement follows a withdrawal for a launched offering; open work keeps its governing terms |
| Draft discard | `cat.retire_declaration_draft` (`declarations.ts:216-235`): status check first (`declaration_not_draft`), then the revision; summary `{declarationId}` | A second discard answers `declaration_not_draft` |
| Impact assessments | One per head change (`domain.ts:211-268`), states `rechecking`, `review_required`, `reviewed`, `superseded`; a new head change supersedes the open ones. `review_required` while any current item of **this** assessment is `unknown` or `pending` (`impact.ts:120-140`). Suspension and withdrawal create no assessment | "Reviewed" does not mean "nothing open": holds and declined transitions are not counted (STOP-W13-03) |
| Impact items | One current item per application (`cat_impact_items_current_uq`); applicability `unknown`/`unaffected`/`affected`, treatment `pending`/`continue`/`transition`/`hold`. The recheck carries a decided item forward by raising `valid_through`, so the item stays attached to its **original** assessment, which can be superseded (`impact-recheck.ts:73-84, 108-110, 131-135`) | A current item MUST be decidable from the page of whatever assessment holds it (F-W13-07) |
| Impact decision | `cat.decide_impact_items` (`commands/impact.ts:85-160, 190-210`): the BFF binding posts one item (`catalogue-admin.ts:286-292`); decisions `unaffected` (only for `unknown` items classified `statement_missing`, `pending_recheck` or `country_rule_defect`, with evidence), `continue_current` (governing declaration supported, binding supported, no transition waiting), `continue_on_head` (no possible filing; baseline-only difference or engineering-classified compatible), `hold` (an active SuperAdmin with a second factor owns it, `common.ts:42-47`). Refusals: `impact_item_not_current`, `stale_revision`, `application_not_open`, `transition_pending`, `impact_decision_not_allowed`, `continuation_unsupported`, `filing_possibly_occurred`, field `holdOwnerId` (`required`, `not_active_superadmin`), field `evidence` (`required`). Summary `{decided: n}`, no item id | The receipt cannot name the item; facts read after it are "Current" |
| Transition | `cat.approve_transition` (`commands/impact.ts:212-270`): the binding refuses an item of another application as not found (`catalogue-admin.ts:293-299`); needs evidence (≥ 1) that establishes compatibility: the assessment's engineering statement names this offering, or a `release_manifest` whose id is the **head binding** or a recorded release supporting it (`transition_evidence_missing`); refuses possible filing, a waiting transition (`conflict_duplicate/transition_pending`), an unsupported head. The target is the head **at command time** (`headOf(offering)`, `:231`). A draft moves at once; a submitted application waits for the travel agent when the statement says so or one of 17 authority items differs (`:33-38, 245-250`). Summary `{transitionId, taAuthorityRequired}`. After a decline or an immediate apply, a new approval of the same item reuses the old transition (`catalogue-writers.ts:123-124`) | The transition page shows the head that Core will use, read now; STOP-W13-04, -05 |
| The travel agent's decision | `core.decide_transition` (`core/commands/admin.ts:95-139`): `decision` ∈ {`apply`, `decline`}, `transitionId`, `_rev.application`; refuses a non-awaiting transition as `stale_revision`, `awaiting_formal_return` while assigned or in assisted entry, `filing_possibly_occurred`; apply also refuses `application_not_open`, `outcome_already_recorded`, a governing change (`stale_revision`). Apply moves the governing ids to the transition's target, which may no longer be the head. Decline posts no notice. Price records are not touched. Summary `{applicationId, transitionId}`: the decision is not in it | While a transition waits, `submit`, `record_readiness`, `release_packet` and `authorize_*` are blocked `transition_pending` (`controls.ts:312-318`); after a decline the application is `affected_pending` and blocked `catalogue_impact_unknown` (`domain.ts:145-148`, `controls.ts:375-378`) |
| Pending answer | `pendingOnAction` (`derived.ts:285-421`) has a transition rule (TA `decide_transition` when unassigned; operator `return_to_ta` otherwise) and **no** launch-control rule | A held submitted case can read "awaiting assignment" or "ready" while its work is held (STOP-W13-06) |
| TA reads | `cat.selectable_offerings` lists an offering launched for the TA, with `selectable` and `codes` (suspended and withdrawn offerings stay listed, not selectable); `core.ta_application` has `transition: {transition_id} \| null` (awaiting only, open work, no outcome), the `submit`, `assistance`, `correct` evaluations, `pending`, the offering **title** only (no offering id) | TA-07t can show neither what changes nor a link to the service page (STOP-W13-01) |
| Staff reads | `ops.launch_offering` (controls, effects, decisions, suspensions `{id, state, suspended_at, reason}`, treatments `{id, cause_ref, treatment, is_current}`, `suspensionTreatment`, `withdrawal {id, effective_at, permits_unfiled_continuation}`, `withdrawalTreatment`); `cat.admin_impact_index` (assessments `rechecking`/`review_required` only; `open_items` = current items `unknown`, `pending` or `hold`); `cat.admin_assessment` (all items of the assessment, current and not, ≤ 5000, with `is_current`, applicability, classification, treatment, hold owner, revision; `lifecycles` map; no applicant, TA, from-tuple, transition state or decider); `cat.admin_index.rows[].openItems` (per offering, current items unknown, pending or hold, any assessment); `views.admin_applications {offeringId}` (projection, pages of 200 with `next`, `asOf`) | Unknown is never zero; counts name their unit and their source |

### 1.3 Page list

"New" = new GET route and inventory entry; route ids of new routes are proposals. "opt." = read through `optionalView`
(LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| SA-05h | Offering: Readiness and launch (WP-02 page) | `/admin/catalogue/offerings/:offeringId/launch` | Rebuilt section "Suspension, withdrawal and existing work"; carried forms removed; four receipt codes added | `ops.launch_offering` |
| SA-05j | Launch decision (WP-02 page), new kinds `suspend`, `suspension_treatment`, `lift`, `withdraw`, `withdrawal_treatment` | `/admin/catalogue/offerings/:offeringId/launch/decide/:kind` | Kept route `admin.launch.decision`; `kind` enumeration extended (D-W13-01) | `ops.launch_offering`; `lift`: opt. `cat.admin_offering` (head versions, as `launch`) |
| SA-05x | Retire the offering | `/admin/catalogue/offerings/:offeringId/retire` (GET beside the POST D81) | **New** (`admin.catalogue.retire_form`, action `catalogue.read_admin`) | `cat.admin_offering` |
| SA-05b | Offering: Definition and values (WP-02 page) | `/admin/catalogue/offerings/:offeringId` | Recheck form rebuilt in place (host); retire section replaced by a summary and a link | `cat.admin_offering` |
| SA-05c | Declaration version (WP-02 page) | `/admin/catalogue/declarations/:declarationId` | Discard form rebuilt in place (host) | `cat.admin_declaration` |
| SA-05l | Impact review | `/admin/catalogue/impact` | Kept route `admin.catalogue.impact_index`, rebuilt | `cat.admin_impact_index` |
| SA-05m | Impact assessment | `/admin/catalogue/impact/:assessmentId` | Kept route `admin.catalogue.impact`, rebuilt; hosts the reviewer form | `cat.admin_assessment`; opt. `iam.admin_accounts {role: superadmin, status: active}` |
| SA-05n | Decide the impact on one application | `/admin/catalogue/impact/:assessmentId/items/:itemId` | **New** (`admin.catalogue.impact_item`, action `catalogue.read_admin`) | `cat.admin_assessment`; opt. `iam.admin_accounts` (hold owner choices) |
| SA-05t | Approve a transition for one application | `/admin/catalogue/impact/:assessmentId/items/:itemId/transition` | **New** (`admin.catalogue.transition_form`, action `catalogue.read_admin`) | `cat.admin_assessment`; `cat.admin_offering` (the head; required for the form) |
| SA-05a | Offerings (WP-02 page) | `/admin/catalogue` | "Existing work" link target and words; header link removed (now a tab) | as WP-02 |
| SA-05e | Publication decision (WP-02 page) | `/admin/catalogue/previews/:previewId` | Two sentences (AM inside WP-13, §2.12) | as WP-02 |
| TA-07t | Changed service terms | `/ta/applications/:applicationId/changed-terms` | **New** (`ta.applications.changed_terms`, action `application.read`; edge, and staff for a support view as WP-03 registers TA-08) | `core.ta_application` |
| TA-07 | Application (WP-03 page) | `/ta/applications/:applicationId` | Carried transition form removed; step link and status row (§2.11) | as WP-03 |
| TA-08, TA-02, TA-03 | Check and submit; Services; Service detail (WP-03 and WP-02 pages) | as built | Closed sentences of the offering and impact codes (§2.11) | as built |

Each new GET route validates its path ids with `zWireId` (`off`, `ima`, `imi`, `app`); a parse failure is the uniform
404. SA-05n and SA-05t answer the uniform 404 when the item is not in `cat.admin_assessment.items` of that assessment.
`resolve` returns `{ type: 'offering', id }` for SA-05x, `{ type: 'catalogue_admin' }` for SA-05n and SA-05t (as SA-05m,
`routes.ts:296-301`), `{ type: 'application', id }` for TA-07t.

### 1.4 Shell placement (WP-01 §2.2; WP-02 §6 items carried to WP-13)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| SA-05h, SA-05j (all kinds) | `/admin/launch` (as WP-02) | SA-05j: "Offerings › [offering] › Readiness and launch" (`offeringLaunchCrumbs`) |
| SA-05x | `/admin/catalogue` | "Offerings › [offering] › Retire" |
| SA-05l, SA-05m, SA-05n, SA-05t | `/admin/catalogue/impact` (new member) | "Impact review" / "Impact review › Assessment no. [n]: [offering]" / "… › Application [reference]" / "… › Application [reference] › Transition" |
| TA-07t | TA "Applications" (as TA-07) | By origin (WP-03 `listReturnOf`) "… › [applicant] › Changed service terms" |

Decisions proposed (Q-W13-03):

1. The member "Catalogue" of "Offerings & launch" becomes **"Offerings"** (the page `h1`, the breadcrumb
   `OFFERINGS_CRUMB` and the receipt label already say "Offerings"; one name for one destination, as WP-02 §4.2 for the
   operator Services). SA-05g's crumb "Offerings & launch" for `/admin/catalogue` becomes "Offerings" (WP-02 U5
   F-U5-06).
2. **"Impact review"** `/admin/catalogue/impact` becomes the second member: Offerings, Impact review, Launch, Public
   site. UX §6.2 places "impact preview" and existing-work treatment under Offerings & launch; UX §6.2 Work queues does
   not list impact work. SA-05a's secondary header link "Impact review" is removed (the tab replaces it).
3. The unregistered inventory entry D06 `/admin/queues/impact` (no route id, RM §2.3) stays unregistered. Proposal
   (P2): remove it from `ROUTE_INVENTORY` in U6, so no second address for the same list can appear later.

Both rail changes are one-line edits in `src/web/ui/shell.ts:172` (architect-owned, WP-01 file), applied at integration
as WP-12 did with `presentation.ts`. No navigation count changes (SA-01 counts are WP-06's, AM-W13-01, -02).

### 1.5 The WP-13 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.
Catalogue and launch handlers send every field whole (`runForm`, `shared.ts:218-226`); `evidenceOf` reads one
evidence row per prefix (`read-models.ts:258-264`).

| # | Command | Route id (POST path, kept) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.suspend_offering` | `admin.launch.suspend` (`…/offerings/:id/suspend`, D43) | **SA-05j kind `suspend`** (moved from SA-05h) | `existingWorkTreatment` (radio `continue`/`hold`/`not_recorded`, none preselected), `evidence.kind\|id\|note` (required), `_reason` | `controls` | Success `receiptLocation(launchPath(id), 'suspended', key)`; refusal `launchDecisionRefusalPage(ctx, 'suspend', e)` |
| 2 | `ops.record_existing_work_treatment` | `admin.launch.treatment` (`…/existing-work-treatment`, D46) | **SA-05j kinds `suspension_treatment`, `withdrawal_treatment`** (moved) | hidden `causeRef`, `expectedTreatmentId`; `treatment` (radio when the current value is `missing`; hidden when it is `continue` or `hold`, D-W13-08); `evidence.*` (optional); `_reason` | — (Core uses `expectedTreatmentId`) | Success code `treatment`; refusal re-renders the kind named by the posted `causeRef` prefix (`sus_` → `suspension_treatment`, `owd_` → `withdrawal_treatment`, else the shell refusal page) |
| 3 | `ops.lift_suspension` | `admin.launch.lift` (`…/lift-suspension`, D44) | **SA-05j kind `lift`** (moved) | hidden `suspensionId`, `planId`; `ack.<itemKey>` = code (none ticked); `evidence.*` (required); `_reason` | `controls` | Code `lifted`; refusal `launchDecisionRefusalPage(ctx, 'lift', e)` |
| 4 | `ops.withdraw_offering` | `admin.launch.withdraw` (`…/withdraw`, D45) | **SA-05j kind `withdraw`** (moved) | `permitsUnfiledContinuation` (radio `yes`/`no`, none preselected), `feasibility.kind\|id\|note`, `evidence.*` (required), `acknowledgeIrreversible` (checkbox `yes`, never prechecked), `_reason` | `controls` | Code `withdrawn`; refusal `launchDecisionRefusalPage(ctx, 'withdraw', e)` |
| 5 | `cat.retire_offering` | `admin.catalogue.retire` (`…/offerings/:id/retire`, D81) | **SA-05x** (moved from SA-05b) | `_reason` | `offering` | Code `retired` → SA-05b with `&op=`; refusal re-renders SA-05x |
| 6 | `cat.retire_declaration_draft` | `admin.catalogue.declaration_retire` (`…/declarations/:id/retire-draft`, D84) | **SA-05c** (stays; rebuilt) | `_reason` | `declaration` | Code `retired_draft` → SA-05c with `&op=`; refusal re-renders SA-05c with the typed reason and the refusal first in `main` |
| 7 | `cat.request_impact_recheck` | `admin.catalogue.recheck` (`…/offerings/:id/recheck`, D80) | **SA-05b** "Impact on existing work" (stays; rebuilt) | `_reason` | — (Core takes none) | Code `recheck` → SA-05b `#assessments` with `&op=`; refusal re-renders SA-05b with the typed reason |
| 8 | `cat.assign_impact_reviewer` | `admin.catalogue.impact_reviewer` (`…/impact/:assessmentId/reviewer`, D92) | **SA-05m** (stays; rebuilt) | `superAdminId` (select of active SuperAdmins, text fallback, D-W13-05), `_reason` | `assessment` | Code `reviewer` with `&op=`; refusal re-renders SA-05m with the typed values |
| 9 | `cat.decide_impact_items` | `admin.catalogue.impact_decision` (`/admin/catalogue/impact-items/:itemId/decision`, D39) | **SA-05n** (moved from SA-05m) | `decision` (radio, none preselected; options by item facts), `holdOwnerId` (select, text fallback), `evidence.*`, `_reason`, hidden `assessmentId` | `item` | Code `decided` → SA-05n of the posted `assessmentId` and the path item; refusal re-renders SA-05n at the POST address, `restorePath` = SA-05n; an invalid `assessmentId` → today's fallback (`/admin/catalogue/impact`, unchecked receipt) and, for a refusal, the shell refusal page |
| 10 | `cat.approve_transition` | `admin.catalogue.transition` (`/admin/applications/:applicationId/transition`, D40) | **SA-05t** (moved from SA-05m) | hidden `itemId`, `assessmentId`; `evidence.kind` (select `release_manifest`/`external_reference`/`document_version`), `evidence.id`, `evidence.note`; `_reason` | `item` | Code `transition` → SA-05n of the posted assessment and item; refusal re-renders SA-05t; invalid hidden ids as row 9 |
| 11 | `core.decide_transition` | `ta.applications.transition_decision` (`/ta/applications/:id/transition-decision`, T36) | **TA-07t** (moved from TA-07 "Waiting for your decision") | hidden `transitionId`; `decision` (radio `apply`/`decline`, none preselected; was hidden `apply`, D-W13-06) | `application` | Moved to `src/apps/edge/core/transition-routes.ts`; fields read whole (no `slice`, LD-17); success `receiptLocation('/ta/applications/<id>/changed-terms', 'transition', key)`; refusal re-renders TA-07t, `restorePath` = TA-07t |

Every command has exactly one host page, so a refusal re-renders the page that holds the form. Every UNR answer goes to
the operation page (`/admin/operations/<key>`, `/ta/operations/<key>`); no new submission of the same intent is offered.

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Suspend, Record treatment, Lift, Withdraw, Hold the remaining work (`launch.ts:646-720`) | SA-05h | SA-05h "Suspension, withdrawal and existing work" links to the SA-05j kinds (§2.1) |
| Retire this offering (`admin.ts:582-591`) | SA-05b | SA-05b summary and "Retire this offering" → SA-05x (§2.4) |
| Decide, Approve transition (`impact.ts:65-95, 130`) | SA-05m (per row, inside `<details>`) | SA-05m row links "Decide" → SA-05n, "Approve a transition" → SA-05t |
| Accept the changed terms (`ta.ts:645-650`) | TA-07 "Waiting for your decision" | TA-07 action panel "Decide on the changed terms" → TA-07t; status row (§2.11) |

Carried-form tests: WP-13 removes the seven entries of `test/unit/web/carried-forms-admin.test.ts:65-71` (the four
WP-15 account entries stay) and the `core.decide_transition` entry of `test/unit/web/carried-forms-ta.test.ts:165`
and `test/unit/web/application-workspace.test.ts:398`. No WP-13 page carries a form of another package. TA-07 keeps
the carried WP-17 held-correction form in "Waiting for your decision" (`ta.ts:637-644`).

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13 (operation status
page), CMP-14 (`staleComparison`). WP-02: CMP-25 `decisionPage` (`src/web/ui/decision.ts`), CMP-01 `actionPanel`,
`statusFacts`, `objectTabs`; the launch vocabulary of `launch.ts` (`readinessEvidence`, `effectTable`,
`unavailableActions`, `launchProblems`, `evidenceInputs`, `shownValue`, `currentDecision`, `audienceOf`); the launch
decision frame of `launch-decision.ts` (`scopeBlock`, `HARD_STOPS`, `readHead`); `readOwnerChoices` pattern
(`launch-plan.ts:51-60`) for the SuperAdmin selects. WP-03: TA-07 frame, `listReturnOf`, `policyNotice`,
`isPolicyCode` (`review-submit.ts:85-120`). Existing: `choiceGroup`, `checkboxField`, `selectField`, `textField`,
`dataTable`, `summaryList`, `identifier`, `timeAt`, `disclosure`, `confirmDisclosure`.

New modules (§7.1): `src/apps/staff/catalogue/existing-work.ts` (closed word tables of §2.13 and the refusal table of
§2.16); `src/apps/staff/catalogue/launch-control.ts` (the five SA-05j kinds); `src/apps/staff/catalogue/retire.ts`
(SA-05x); `src/apps/shared/pages/changed-terms.ts` (TA-07t); `src/apps/edge/core/transition-routes.ts`.

Dependency: WP-13 builds after WP-02 (integrated, 228816a) and WP-03 (TA-07, TA-08 files) are integrated. It needs no
WP-06 to WP-12 unit. Its amendments to WP-06, WP-07, WP-08 and the bulk packages (§1.8) bind those builds.

### 1.8 Amendments to designed packages

Each binds the build of the named package (not built yet). The architect records them in the package records, as
WP-10 to WP-12 did.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W13-01 | WP-06 §2.1 SA-01 group 8 "Offering impact decisions" | P1 | Source `cat.admin_index.rows[].openItems > 0` (current items unknown, pending or held, on any assessment), not `cat.admin_impact_index` rows: the index omits held items of reviewed assessments (F-W13-07). Words: "[n] offerings have existing work waiting for an impact decision or held"; up to 5 offering titles; link per offering → SA-05b `#assessments`; group link → SA-05l. Line under the group: "A transition that the travel agent declined is not counted yet." (STOP-W13-03) |
| AM-W13-02 | WP-06 §2.1 SA-01, new group after group 8 | P1 | "Suspended offerings" from `ops.launch_overview.rows` with `controls.suspension_state = active` (optional read, as every SA-01 read): "[n] suspended offerings. New work is refused; check how existing work continues." Link per offering → SA-05h `#existing-work`. The overview carries no treatment (STOP-W13-07), so the group never says "held" or "continues" |
| AM-W13-03 | WP-07 §2.4.7 "Offering hold" row and §2.4.2 hold rows | P1 | Owner "SuperAdmin" (not "TravelMudra"); the closed staff sentences of §2.13.5 per code (`existing_work_hold`, `existing_work_treatment_missing`, `withdrawal_continuation_not_permitted`, `offering_withdrawn`, `catalogue_impact_unknown`, `catalogue_impact_hold`, `transition_pending`); no form. For `transition_pending` on an assigned case (Core pending `assigned_operator`/`return_to_ta`): action panel step "Return the application to the travel agent so they can decide on the changed terms", action the WP-07 return form |
| AM-W13-04 | WP-08 TA-10 notice page, notice `generic_case_update` with `event = transition_pending` | P2 | Link "Decide on the changed terms" → TA-07t of the notice's application; acknowledgement unchanged |
| AM-W13-05 | Bulk packages WP-04, WP-05, WP-18 (BU-P02, BU-P06, BU-P07) | P1 | BU-27 acceptance additions: BU-P02 lists only services Core reports for the group's country and offers none preselected; a service that is not selectable shows Core's reasons and "Owner: TravelMudra"; with no selectable service the page says UX §4.4 "No service is currently available for new applications in this scope." and offers no form; a row whose service is refused mid-import (`offering_suspended`, `offering_withdrawn`, per row, `intake-writers.ts:77-81`) names the service, the reason and the owner and keeps every accepted draft; the correction route is offered for `offering_suspended` only (`intake/domain/correction.ts:15-18`). `intake.start_bulk` answers `offering_not_launched` for a suspended service (`start-bulk.ts:78-83`): the page words it "This service is not open for new applications now" without claiming "not launched" |

WP-02 and WP-03 pages are built; WP-13 changes them itself (§2.1–§2.5, §2.11, §2.12; units §7.1).

## 2. Page specifications

### 2.0 Rules common to every WP-13 page

- **Freshness (LD-08).** Every WP-13 read is authoritative: CMP-12 "Read at [time] IST". The only projection is the
  link to the application list (`views.admin_applications`), which shows its own freshness on its own page.
- **Page states.** S1: pages are rendered complete by the server. S6, S7: SH-02 pages of WP-01. Each page lists its own
  states, first match.
- **Optional reads (LD-14).** Only through `optionalView`. The SuperAdmin selects (`iam.admin_accounts`) degrade to a
  text field with the hint "Account reference of an active SuperAdmin. The account list is unavailable now." (also at
  the 200-row cap, as D-U3-05). The head read of SA-05j `lift` degrades to "Unavailable" (as `launch`, D-U3-01). On
  SA-05t the head read is required decision evidence (WP-11 I-05 class): its outage keeps the frame and shows CMP-10
  "Approving a transition cannot be prepared now: the offering's head cannot be read. Try again later. Owner:
  TravelMudra." and no form. Every other refusal reaches the shell.
- **Command results.** ACC: 303 to the receipt host with `?done=<code>&op=<key>`; CMP-08 first in `main`; its title
  first in the document title. A receipt names a result only when `core.operation` returns the expected resource id and
  the summary fields of §2.14 (WP-02 B-02); recorded facts use only stored summary fields or a record selected by a
  returned id (WP-12 J-08); facts read after the operation are "Current". Otherwise the receipt is neutral. REJ: the
  host page re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07 focused,
  every typed value and choice kept (LD-17), except the irreversibility checkbox, which is left clear (as WP-07 keeps
  `confirmIrreversible` clear). A refusal of a page whose state closed meanwhile shows the refusal sentence in the
  receipt slot above the closed state (WP-02 D-U3-03); a refusal is never hidden with its form (F-W13-08). C5: CMP-14
  (§2.15). UNR: 303 to the operation page.
- **K rules.** All eleven commands are K-STD. A form carries one `_op` from page load; a browser resend reuses it; a
  re-render after a refusal issues a new `_op`. UI-PLAN §7 row 1194 names "Record existing-work treatment" K-BATCH with
  per-application receipts; the contract takes one impact item (`catalogue.ts:66`), so WP-13 builds no batch
  (D-W13-12, STOP-W13-09).
- **Core decides.** A page offers a decision only from Core's facts (the read states). Where it mirrors a Core guard
  (the SA-05j kind states, the SA-05n decision options, the SA-05t states), a parity test lists each guard and each
  known difference (WP-10 H-02 pattern). Core decides at the command.
- **Existing-case impact is explicit.** Every decision page that changes what existing work may do states, before the
  button, the effect per action class, what stays unchanged, and where the affected applications are listed. No page
  says "affected" or "not affected" for work it cannot read.
- **Support view.** The SuperAdmin pages are not reachable in a support view. TA-07t in a support view shows the facts
  and "Read-only view: the travel agent decides here." with no form (SH-R09).
- **Copy.** UI-PLAN §11. Every time carries "IST". Synthetic data shows "Synthetic" (CR-08). Forbidden on WP-13 pages:
  "Relaunch"; "Override"; "Reviewed" or "Nothing to review" as a claim that no work waits (§2.13.2); "continues as
  TravelMudra decided" without the treatment; "until TravelMudra offers this service again" (withdrawal has no undo);
  "Accepted the changed terms" or "Declined" on a receipt (the summary does not say which, §2.14); "applied" for a
  transition the read does not show applied; "Something went wrong". All copy is draft (CR-09).
- **Mobile (< 768 px).** One column; tables stack into labelled rows. Decision pages put scope and effect before the
  fields; the primary action is at the end of the form (UX §7.3).

### 2.1 SA-05h Readiness and launch: changes (WP-02 page)

1. **Receipt codes.** `LAUNCH_RECEIPT_CODES` adds `suspended`, `treatment`, `lifted`, `withdrawn` (§2.14). The
   carried flash table `CARRIED_DONE` (`launch.ts:517-523`) and the `LaunchPageOptions.form` values `suspend`,
   `treatment`, `lift`, `withdraw`, `plan`, `approve`, `expand` are removed (F-U5-03 cleaned up).
2. **Next action** (replaces rows 1–2 of `nextAction`, `launch.ts:547-558`), first match:
   - Withdrawn, current withdrawal treatment `continue`: owner "SuperAdmin"; step "The offering is withdrawn for good.
     Submitted, unfiled work continues as the withdrawal permits."; secondary "Hold the remaining work" → kind
     `withdrawal_treatment`.
   - Withdrawn otherwise: owner "No one"; step "Nothing. The offering is withdrawn for good; there is no relaunch.
     Submitted, unfiled work is held."
   - Suspended, current suspension treatment `missing` (or no treatment row): owner "SuperAdmin"; blocker type
     "decision"; step "Existing work of this offering is held until you record how it continues during the
     suspension."; action "Record the existing-work treatment" → kind `suspension_treatment`; secondary "Lift the
     suspension" → kind `lift`.
   - Suspended otherwise: owner "SuperAdmin"; step "New work is suspended. Existing work [continues / is held] (the
     treatment you recorded). Lifting restores exactly the approved scope."; action "Lift the suspension"; secondary
     "Change the existing-work treatment".
   - The remaining rows stay as WP-02 built them.
3. **Readiness evidence note (V20).** Under the `h2` "Readiness evidence", when `launch_state = launched`: "A launch
   decision stays in force when the definition or the business values change: new cases of the audience use the new head
   at once, with no new launch decision. These requirements are checked again only when the scope widens or a
   suspension is lifted." (`launch.ts:262-267, 404` in Core; F-W13-14).
4. **New section `h2` "Suspension, withdrawal and existing work"** (`id="existing-work"`), after "Launch and admission":
   1. `statusFacts`: "Suspension": "Not suspended" / "Suspended since [time] IST" (the active row of `suspensions`);
      "Reason for the suspension" (its `reason`); "Existing work during the suspension" (the current
      `suspensionTreatment`, §2.13.3 words; no row → "Not recorded: existing work is held"); "Withdrawal": "Not
      withdrawn" / "Withdrawn [time] IST"; "Submitted, unfiled work after the withdrawal" (the current
      `withdrawalTreatment` words; the stored `permits_unfiled_continuation` as "Permitted at withdrawal: yes / no").
      Not shown (no read carries them, STOP-W13-07): who suspended, lifted or withdrew, when a suspension was lifted,
      the withdrawal reason and evidence.
   2. Lead (fixed, from Core's effect rules): "Launch control never stops outcome recording, delivery, completion or
      reassignment. Recording what happened to an act already authorized, its reconciliation, the return of originals
      and incidents keep their own checks. What launch control allows now for each action is in the table under 'Launch
      and admission'."
   3. `h3` "Existing-work treatments" (`dataTable`, caption "Existing-work treatments of this offering"): For ("The
      suspension of [date]" / "The withdrawal", by `cause_ref` matched to `suspensions` or `withdrawal`; otherwise
      "Another record"); Treatment (§2.13.3); State ("In force" when `is_current`, else "Replaced or ended"). Empty:
      "No suspension or withdrawal was recorded."
   4. `h3` "Suspensions" (the WP-02 history table, unchanged columns); the empty state uses level 3 correctly (F-U3-04).
   5. `h3` "Decisions" (links, each with one sentence; shown by the facts of the kind states, §2.2):
      "Suspend this offering" (`suspend`), "Record the existing-work treatment" (`suspension_treatment`), "Lift the
      suspension" (`lift`), "Withdraw this offering" (`withdraw`), "Hold the remaining work" (`withdrawal_treatment`).
      Not launched: "Suspension and withdrawal apply to a launched offering. This offering is not launched." and the
      link "Retire this offering" (SA-05x) when it is not retired.
   6. "Applications of this offering": link `/admin/applications?offering=<offeringId>` (`cases.ts:115-118, 347`)
      with "The list shows each application's progress and owner. It can lag behind; it shows its own freshness."
5. **Effect table labels.** The rows and Core's effects stay. The codes `existing_work_hold`,
   `existing_work_treatment_missing` and `withdrawal_continuation_not_permitted` read their §2.13.5 sentences (fix of
   F-W13-01 in `shared.ts` `REASON_MESSAGES`).

States: the WP-02 states; withdrawn and suspended at once shows both facts and both treatments; the "Decisions" links
follow §2.2.

### 2.2 SA-05j Launch decision: the five new kinds

Common frame (WP-02 `launchDecisionPage` frame and `decisionPage`): header `h1` "[Verb]: [offering]", crumbs
`offeringLaunchCrumbs`, freshness; Scope; Evidence; Effect; Hard stops; Your decision; Review; button and "Cancel" →
SA-05h. One kind per address (Q-W02-02). `LAUNCH_DECISION_PAGE_KINDS` becomes `['launch', 'expand', 'suspend',
'suspension_treatment', 'lift', 'withdraw', 'withdrawal_treatment']`; `loadLaunchDecisionPage` dispatches the five new
kinds to `launch-control.ts`. State rules mirror Core's guards (parity test, §2.0).

Evidence block for every new kind (fixed parts): "What launch control allows now" (`effectTable`, Core's); the link
"Applications of this offering" (§2.1 item 4.6) with "Inspect them before you decide." (UX §7.3 secondary impact
list).

#### 2.2.1 Kind `suspend` (`ops.suspend_offering`)

- Scope: Offering (title, reference, copy); Who files; Launch "Launched"; Current audience (`audienceOf`); "In force:
  the launch decision approved by [name]".
- Effect: changes: "New selection, intake and draft creation stop at once for every travel agent of the audience."
  Group "Existing work follows the treatment you choose": "Let it continue: drafts can still be submitted, and
  preparation, readiness, packet release and filing go on under their own checks." / "Hold it: submission of drafts,
  help requests, assignment, preparation, readiness, packet release and filing are held." / "Not decided yet: the same
  actions are held until a treatment is recorded." (`effect.ts:22-25, 62-65`) Unchanged: "The audience and the launch decision do not change." "Outcome
  recording, delivery, completion and reassignment are never stopped; recording what happened to an act already
  authorized, its reconciliation, the return of originals and incidents keep their own checks." "Payment facts do not
  change." (Corrects F-W13-02.)
- Hard stops: "The scope cannot widen while the offering is suspended." "Lifting the suspension later needs the launch
  requirements again, including a launch plan complete for the head declaration."
- Your decision: `existingWorkTreatment` radio, legend "Existing work during the suspension", options "Let existing
  work continue" (`continue`), "Hold existing work" (`hold`), "Not decided yet: hold it until I record a treatment"
  (`not_recorded`), none preselected; evidence (`evidenceInputs`, legend "Evidence for the suspension", required);
  reason (`_reason`, label "Reason for the suspension").
- Review: "When you suspend: new work stops at once for every travel agent of the audience; existing work follows the
  treatment you chose; your name, reason and evidence are recorded; the offering stays launched for its audience, and
  lifting restores exactly that scope."
- Button "Suspend offering" (destructive variant).
- States: not launched → closed "Suspending needs a launched offering. This offering is not launched." (link "Retire
  this offering" when not retired); suspended → closed "This offering is already suspended." links to
  `suspension_treatment` and `lift`; withdrawn → closed "This offering is withdrawn. A withdrawal already stops new work
  for good; narrow existing work with the withdrawal's treatment." link to `withdrawal_treatment` when it applies
  (D-W13-07, Q-W13-05: Core accepts a suspension of a withdrawn offering, `launch.ts:304-305`); draft; C2 (§2.16); C5.

#### 2.2.2 Kind `suspension_treatment` (`ops.record_existing_work_treatment`, cause: the active suspension)

- Scope: Offering; "Suspended since [time] IST"; "Reason for the suspension"; "Existing work now: [§2.13.3 words of
  `suspensionTreatment`]".
- Effect: per choice, the same three sentences as §2.2.1 (only the ones that differ from now); unchanged: "New work
  stays suspended. The audience does not change."
- Your decision: hidden `causeRef` = the suspension id, `expectedTreatmentId` = the current treatment id. Current
  `missing`: radio `treatment` "Let existing work continue" (`continue`) / "Hold existing work" (`hold`), none
  preselected. Current `hold`: hidden `treatment = continue`, verb "Let existing work continue". Current `continue`:
  hidden `treatment = hold`, verb "Hold existing work" (D-W13-08, F-W13-15). Evidence optional (legend "Evidence
  (optional)"); reason "Reason for the change".
- Review: "When you record it: existing work of this offering [continues / is held] from now; your name and reason are
  recorded; the suspension stays until it is lifted."
- Button: "Record the treatment" / "Let existing work continue" / "Hold existing work".
- States: no active suspension → closed "This offering is not suspended. A treatment applies only during a
  suspension."; active suspension without a treatment row → CMP-10 "The current treatment cannot be read, so it cannot
  be changed here now. Existing work is held meanwhile. Owner: TravelMudra." and no form; draft; C2; C5
  (`stale_revision`: the treatment changed, §2.15).

#### 2.2.3 Kind `lift` (`ops.lift_suspension`)

- Scope: Offering; the suspension (since, reason); "Restores: the launch decision approved by [name], audience
  [audience]" (`currentDecision`; Core restores `restores_launch_id`, which equals it because expansion is refused while
  suspended); head declaration, business values, binding and launch plan version with its completeness for the head
  (as `launch`, B-01; the head through `readHead`).
- Evidence: the five readiness labels and "Actions that stay unavailable for live cases" (as `launch`).
- Effect: changes: "New work opens again for exactly the restored audience." "The suspension's existing-work treatment
  ends; existing work follows its normal checks [and the withdrawal's treatment, when withdrawn]." Unchanged: "The
  audience cannot widen here; expand the scope afterwards if needed." "[When withdrawn:] The withdrawal stays: new work
  stays refused for good."
- Hard stops: the WP-02 `HARD_STOPS` list.
- Your decision: hidden `suspensionId`, `planId`; acknowledgements (none ticked; kept ticked after another refusal when
  the item and code are unchanged, as `launch`); evidence (legend "Scoped readiness evidence", required); reason.
- Button "Lift suspension".
- States: no active suspension → closed "This offering is not suspended."; `plan = null` or a launch requirement not
  met → unavailable (the boundary of `launch`: provider route, return of originals, else "Lifting the suspension is
  unavailable until every launch requirement above is met. Owner: SuperAdmin."; links "Open the launch plan", "Open
  definition and values") (F-W13-16); draft; C2 (the launch codes, §2.16); C5.

#### 2.2.4 Kind `withdraw` (`ops.withdraw_offering`)

- Scope: Offering; Launch; Current audience; Suspension (and its treatment when active).
- Effect: changes: "New selection, intake, draft creation and the submission of drafts stop for good." "Submitted,
  unfiled work continues only if you permit it with feasibility evidence; otherwise it is held." Group "It ends": "There
  is no relaunch: the offering cannot be launched again." Unchanged: "Outcome recording, delivery, completion and
  reassignment; recording what happened to an act already authorized, its reconciliation, the return of originals and
  incidents keep their own checks." "Payment status never forces a withdrawn service." "The catalogue entry stays until
  you retire it." Conditional (from the read): suspended with treatment `missing` or `hold`: "While the suspension holds
  existing work, it stays held whatever you choose here: the most restrictive treatment applies to each action."
- Hard stops: "A withdrawal cannot be undone." "A withdrawal's treatment can later change only from continue to hold."
- Your decision: `permitsUnfiledContinuation` radio, legend "May submitted, unfiled work continue?", "Yes, it may
  continue" (`yes`, hint "Needs feasibility evidence.") / "No, it is held" (`no`), none preselected; feasibility
  evidence (`evidenceInputs` with prefix `feasibility`, legend "Feasibility evidence (needed for Yes)"); evidence
  (legend "Evidence for the withdrawal", required); `acknowledgeIrreversible` checkbox "I understand that this
  withdrawal cannot be undone." (never prechecked; clear after any refusal); reason "Reason for the withdrawal".
- Review: "When you withdraw: the offering is withdrawn for good; no travel agent can start or submit an application
  for it; submitted, unfiled work [continues / is held] as you chose; your name, reason and evidence are recorded."
- Button "Withdraw offering" (destructive).
- States: withdrawn → closed "This offering is already withdrawn ([time] IST)." link to `withdrawal_treatment` when it
  applies; not launched → closed "A withdrawal applies to a launched offering. To end an offering that was never
  launched, retire it." link SA-05x; draft; C2; C5.

#### 2.2.5 Kind `withdrawal_treatment` (`ops.record_existing_work_treatment`, cause: the withdrawal)

- Scope: Offering; "Withdrawn [time] IST"; "Submitted, unfiled work now: continues (permitted)".
- Effect: changes: "Submitted, unfiled work of this offering is held from now: preparation, readiness, packet release
  and filing." Unchanged: as §2.2.4. Hard stop: "This cannot be widened back to continue."
- Your decision: hidden `causeRef` = withdrawal id, `expectedTreatmentId`, `treatment = hold`; evidence optional;
  reason "Reason for holding the remaining work".
- Button "Hold the remaining work" (destructive).
- States: not withdrawn → closed "This offering is not withdrawn."; current treatment `hold` → closed "Submitted,
  unfiled work is already held. A withdrawal's treatment cannot widen."; draft; C2; C5.

### 2.3 SA-05x Retire the offering `/admin/catalogue/offerings/:offeringId/retire`

Purpose: end new selection of an offering for good (B05 identity end; register CC: SA-05 offering detail). A decision
page (DESIGN.md "Decisions on their own page"): it has no undo command.

- Header `h1` "Retire the offering: [offering]"; crumbs "Offerings › [offering] › Retire"; freshness.
- Scope: Offering, Country, Who files, Service code, Catalogue availability, Launch (`cat.admin_offering.launch`: "Not
  launched" / "Launched" / "Withdrawn").
- Evidence: "Applications of this offering" link (§2.1 item 4.6) and "Impact on existing work" link (SA-05b
  `#assessments`).
- Effect: changes: "Travel agents can no longer select this offering." "Its availability stays Retired: a later
  publication or release does not reopen it (`domain.ts:252`), and catalogue and launch changes are refused." Unchanged:
  "Open work keeps its governing declaration, business values and binding." "No application changes."
- Hard stops: "A launched offering is withdrawn first."
- Your decision: hidden `_rev.offering`; reason "Reason for retiring".
- Review: "When you retire: the offering is retired for good; open work keeps its terms; your name and reason are
  recorded."
- Button "Retire offering" (destructive).
- States: retired → closed "This offering is retired."; launch read `null` (Core returns no launch summary) → CMP-10
  "Whether this offering is launched cannot be read now, so it cannot be retired here. Owner: TravelMudra." no form;
  launched and not withdrawn → unavailable `boundaryNotice` "Retiring is unavailable until the offering is withdrawn.
  Owner: SuperAdmin." with `unavailableButton` "Retire offering" and the link "Withdraw this offering" (SA-05j
  `withdraw`); draft; C2; C5 (`_rev.offering`).

### 2.4 SA-05b Definition and values: changes (WP-02 page)

1. **Section "Impact on existing work"** (`id="assessments"`): the assessments table (No. link → SA-05m, Cause in words
   §2.13.1, State §2.13.2). Line: "Held applications and transitions the travel agent declined stay with the assessment
   that decided them. Open each assessment to see them." Recheck form (host, rebuilt): shown when the assessment with
   the highest number exists and is not `superseded` (Core's `nothing_to_recheck` rule, `commands/impact.ts:279-280`);
   lead "A recheck classifies open applications again against the head. Decisions already recorded stay. Use it after a
   failed recheck, or when an application on older terms appeared."; when that assessment is `rechecking`: "A recheck
   is running. A further request starts it again."; reason "Reason for the recheck" (typed value kept); button "Request
   a new recheck". Otherwise: "There is no open assessment to recheck." Link "Impact review".
2. **Section "Retire this offering"** (replaces the carried form): not retired and not launched, or withdrawn → "Ends
   new selection for good. Open work keeps its terms." link "Retire this offering" → SA-05x; launched and not withdrawn
   → `boundaryNotice` "Retiring is unavailable until the offering is withdrawn. Owner: SuperAdmin." with the link
   "Readiness and launch". Retired → the WP-02 retired notice only.
3. **Receipts.** `offeringReceipts` adds `recheck` and `retired` (§2.14); `CARRIED_DONE_MESSAGES` is removed from
   `shared.ts` (also from SA-05c).

### 2.5 SA-05c Declaration version: changes (WP-02 page)

Section "Discard this draft" stays the host (one host page; reversible in effect: a new draft can be registered).
`confirmDisclosure` kept; the reason keeps its typed value; `_rev.declaration`; receipt `retired_draft` (§2.14). A
refusal `declaration_not_draft` re-renders with the sentence of §2.16 first in `main` (the section is gone because the
status changed) (F-W13-08).

### 2.6 SA-05l Impact review `/admin/catalogue/impact`

Purpose: find assessments of existing work that need a SuperAdmin (UX §6.3 Publication and impact; B06).

1. `h1` "Impact review"; lead "Assessments of existing work after a change of an offering's definition, business
   values or release binding. Unknown or pending impact blocks filing readiness of the application until it is
   decided."; freshness.
2. Failed rechecks: callout per offering "The recheck of [offering] failed. Its unclassified applications stay unknown.
   Request a new recheck on the offering page." link SA-05b `#assessments`.
3. Table (caption "Assessments rechecking or waiting for review"): Offering (link SA-05b); Assessment ("No. [n]", link
   SA-05m); Cause (§2.13.1); State (§2.13.2; "Recheck failed" as its own text); Open items ("[n] open: unknown, pending
   or held", from `open_items`); Accountable ("SuperAdmin queue" or the name).
4. Line under the table (always): "Held applications and declined transitions of assessments that are no longer
   rechecking or waiting for review are not listed here. Each offering's page lists all its assessments." (STOP-W13-02,
   -03).
5. Empty: "No assessment is rechecking or waiting for review." plus item 4.

### 2.7 SA-05m Impact assessment `/admin/catalogue/impact/:assessmentId`

Purpose: see one change's effect on every application it reached, and open each decision (UX §6.3).

1. Receipt (`reviewer`). Header `h1` "Impact assessment no. [n]: [offering]"; crumbs "Impact review"; freshness.
   `statusFacts`: State; Cause; Change (§2.13.1); Engineering statement ("Not applicable", "Supplied", "Missing");
   Accountable SuperAdmin.
2. Callouts: recheck failed (as §2.6 item 2); statement missing ("A changed capability has no engineering impact
   statement. Affected work stays unknown until a release supplies one or a SuperAdmin decides each application with
   evidence."); superseded ("A newer assessment covers this offering. Items of this assessment that are still current
   can still be decided here.").
3. `h2` "What changed": Before and After — declaration (link SA-05c), business values (link SA-05d), binding
   (`identifier`); "None" for an absent id; "Continuation chosen at publication" (§2.13.4 words of
   `continuation_policy`); engineering statement changes table (capability, from → to, compatibility words §2.13.4,
   business impact), with the line "Whether the statement names this offering is not shown here."
4. `h2` "Accountable SuperAdmin" (host of `cat.assign_impact_reviewer`): current name or "SuperAdmin queue"; form when
   the assessment is not `superseded`: `superAdminId` select (active SuperAdmins by name; text fallback), hint "Holds
   that later rechecks place are owned by this SuperAdmin while they are active. Holds already recorded keep their
   owner."; reason "Reason for the assignment"; `_rev.assessment`; button "Assign".
5. `h2` "Applications": groups in this order, each an `h3` with its count and unit ("[n] applications") and a
   `dataTable`; an empty group is not shown:
   1. "Need a decision": current items with applicability `unknown` or treatment `pending`.
   2. "Held": current, treatment `hold`; column Owner.
   3. "Transition approved": current, treatment `transition`; line "Whether the travel agent accepted, declined or
      still has to decide is not shown here yet. After a decline the application waits for your new decision: open it
      and decide again." (STOP-W13-02, -03).
   4. "Continue": current, treatment `continue`.
   5. "Not affected": current, applicability `unaffected`.
   6. "Earlier items" (`disclosure`, closed): items with `is_current = false`, read only.
   Columns: Application (reference, link SA-04a `/admin/applications/:id`); Lifecycle (`lifecycles` words; absent →
   "Not known"); Classification (§2.13.1); Treatment (§2.13.3 with "Owner: [name or SuperAdmin queue]" for a hold);
   Actions: "Decide" → SA-05n, and "Approve a transition" → SA-05t, by the item facts of §2.8 and §2.9 (on every
   current item, on any assessment state, D-W13-15, Q-W13-04). No form on this page except item 4.
6. Secondary links: "Offering" (SA-05b), "Impact review".

States: assessment not found → uniform 404; `rechecking` → line "The recheck is still running. The list changes when
it finishes."; else as above.

### 2.8 SA-05n Decide the impact on one application `/admin/catalogue/impact/:assessmentId/items/:itemId`

Purpose: record one bounded decision for one application's existing work (UX §6.3 "supported continuation … or an
owned hold"; B06). A decision page (CMP-25).

- Receipt (`decided`, `transition`, §2.14). Header `h1` "Decide the impact: application [reference]"; crumbs;
  freshness.
- Scope: Application (reference, link SA-04a); Lifecycle; Assessment no. [n] (link) and its cause; Classification
  (§2.13.1); Current treatment (with owner); Item reference.
- Evidence: "What changed" (SA-05m item 3, short form); the applicant and travel agent are not shown here yet: "Open the
  application to see the applicant." (STOP-W13-02).
- Effect: one row per offered option (only the offered ones):

  | Option (`decision` value) | Offered when (item facts; Core decides) | Effect sentence |
  |---|---|---|
  | "Continue on its current terms" (`continue_current`) | current, lifecycle not closed | "The application keeps its governing declaration, business values and binding. This change no longer blocks its filing readiness. Core accepts it only while those terms are still supported by the active release." |
  | "Move to the head without a transition" (`continue_on_head`) | current, applicability ≠ `unaffected`, classification ≠ `held_while_filing_possible` | "The application moves to the offering's head at once, without the travel agent's renewed authority. Core accepts it only for a business-values difference or a change that engineering classified as compatible. The quoted price does not change." |
  | "Hold" (`hold`) | current | "Filing readiness stays blocked until a SuperAdmin decides again. The SuperAdmin you name owns the hold." |
  | "Not affected" (`unaffected`) | current, applicability `unknown`, classification ∈ {`statement_missing`, `pending_recheck`, `country_rule_defect`} | "Records with evidence that the change does not affect this application. It continues on its current terms." |

- Hard stops: "No decision moves an application whose filing may already have happened to other terms." "A transition
  to the head with the travel agent's renewed authority is a separate decision: 'Approve a transition'."
- Your decision: `decision` radio (legend "Decision", none preselected); `holdOwnerId` select (label "Owner of the hold
  (for Hold)", optional, active SuperAdmins; text fallback); evidence (`evidenceInputs`, legend "Evidence (needed for
  Not affected)", optional); reason "Reason for the decision"; hidden `assessmentId`, `_rev.item`.
- Review: "When you record it: the application's existing work follows your decision; your name, reason and evidence
  are recorded; the assessment state is updated."
- Button "Record the decision". Secondary "Approve a transition instead" → SA-05t (when §2.9 offers it).
- Navigation after a receipt: "Next application that needs a decision" (the first other item of group 1 in the same
  read, a link only) and "Back to the assessment".
- States (first match): item not in the assessment → 404; `is_current = false` → closed "This item is no longer
  current: a later recheck or decision replaced it. The offering's page lists its assessments." link SA-05b
  `#assessments`; lifecycle known and not `draft`/`submitted` → closed "This application is closed. Its terms do not
  change."; classification `filed_historical` → closed "Filed work keeps its terms: its facts are historical."
  (D-W13-10); treatment `transition` → draft with the line "If a transition of this application still waits for the
  travel agent, Core refuses a new decision until the travel agent answers."; draft; C2 (§2.16); C5 (§2.15).

### 2.9 SA-05t Approve a transition `/admin/catalogue/impact/:assessmentId/items/:itemId/transition`

Purpose: approve one per-application structural transition with engineering compatibility evidence (UX §6.3; B06
"never in bulk").

- Header `h1` "Approve a transition: application [reference]"; crumbs; freshness.
- Scope: Application (link SA-04a), Lifecycle, Assessment, Classification, Current treatment; "Target: the offering's
  head now: declaration version [n], business values version [n], binding [reference, copy]" (from `cat.admin_offering`,
  read now). Line: "Core moves the application to the head the offering has when you approve. If the head changes
  before you send, the application moves to the newer head." (STOP-W13-05 a).
- Evidence: "What changed" (SA-05m item 3); the engineering statement lines.
- Effect: changes: "A draft moves to the head at once." "A submitted application moves at once when nothing that needs
  the travel agent's authority differs; otherwise it waits for the travel agent's decision on their 'Changed service
  terms' page. While it waits, submission, readiness, packet release and filing of the application wait too." Unchanged:
  "The quoted price does not change." Group "If the travel agent declines": "The application keeps its terms and waits
  for your new decision: continue on its current terms, or hold. Approving a transition again for the same item does not
  reopen it." (STOP-W13-04).
- Hard stops: "No transition for an application whose filing may already have happened." "One transition waits at a
  time." "The evidence must establish compatibility: a release manifest that names the target binding [reference], or a
  release under which it is supported, unless the engineering statement covers this offering."
- Your decision: evidence (`evidenceInputs`, legend "Engineering compatibility evidence", kinds `release_manifest`,
  `external_reference`, `document_version`, required); reason "Reason for the transition"; hidden `itemId`,
  `assessmentId`, `_rev.item`. No value is prefilled.
- Review: "When you approve: Core opens the transition to the head named above; your name, reason and evidence are
  recorded; the travel agent is notified when their decision is needed."
- Button "Approve the transition".
- States (first match): 404 as §2.8; not current → closed as §2.8; applicability `unaffected` → closed "This
  application is not affected. It needs no transition."; lifecycle closed → closed; classification
  `held_while_filing_possible` → closed "Filing may have happened for this application. It cannot move to other terms.
  Decide 'Continue on its current terms' or 'Hold' instead." link SA-05n; head read unavailable → §2.0 CMP-10, no
  form; head null → CMP-10 "The offering has no published head, so no transition is possible." no form; draft; C2;
  C5.

### 2.10 TA-07t Changed service terms `/ta/applications/:applicationId/changed-terms`

Purpose: the travel agent gives or refuses renewed authority for one application to follow changed terms (B06 "renewed
TA authority where required"; CC-06).

1. Breadcrumb by origin; freshness; receipt (`transition`).
2. `h1` "Changed service terms: [applicant]"; meta: Application [reference], Service [title], Group.
3. Lead: "TravelMudra changed the terms of [service] and approved moving this application to the changed terms. The
   change is one that needs your renewed authority, so TravelMudra needs your decision."
4. `h2` "What changes": interim (STOP-W13-01): "This page cannot list the changes yet. The terms approved for this
   application are the ones TravelMudra published when it approved the move. They can differ from what the Services
   page shows now if TravelMudra changed the service again." No contact route is named: no TA command or read serves
   one (the notice of this change carries only its event, `catalogue-writers.ts:149-152`).
5. `h2` "What stays the same": "The price TravelMudra quoted when you submitted. The original estimated window. Nothing
   you recorded is removed." (Core: `decide_transition` touches no price or timing record, `admin.ts:118-138`.)
6. `h2` "Your decision" (form, when open): `decision` radio, legend "Your decision", none preselected:
   - "Accept the changed terms" (`apply`), hint "The application then follows the changed terms: their documents,
     checks and rules apply from then on. You cannot undo this."
   - "Decline" (`decline`), hint "The application keeps its current terms for now. TravelMudra then decides how it
     continues: on its current terms where they are still supported, or it is held until TravelMudra decides."
   Hidden `transitionId`, `_rev.application`.
7. Review (visible): "When you record your decision, TravelMudra records your choice with your name and the time."
8. Button "Record my decision"; "Cancel" → TA-07.

States (first match):

| State | Condition (`core.ta_application`) | Copy and controls |
|---|---|---|
| Nothing waits | `transition = null` | "No change of service terms waits for your decision." Link "Back to the application". (Also the state after the receipt) |
| Support view | session support view | Items 2–5, "Read-only view: the travel agent decides here." No form |
| With the operator | `editor_state ∈ {assigned, assistance_in_progress}` | Items 2–5; "This application is with your operator. They return it to you so you can decide." No form (Core: `awaiting_formal_return`) |
| Open | otherwise | Items 1–8 |
| C2 | §2.16 | Choice kept |
| C5 | `stale_revision` | CMP-14 "The application changed, or this change of terms was decided, after you opened the page." with the current state; no "you saw" line |

### 2.11 TA-07, TA-08, TA-02, TA-03: changes (WP-03 and WP-02 pages)

1. **TA-07 (`ta.ts`).** The carried transition form leaves "Waiting for your decision" (`ta.ts:645-650`); the section
   stays for the WP-17 held correction. `TA_STEP_LINKS.decide_transition` → TA-07t (when registered; else no action).
   Status row "Service terms": "A change waits for your decision" (link TA-07t) when `transition ≠ null`; no row
   otherwise. The `transition` code leaves TA-07's flash table (the receipt is on TA-07t).
2. **Policy notices (TA-07, TA-08: `review-submit.ts` `POLICY_UNTIL`, `ta.ts` `WORK_POLICY`)**, closed TA sentences:

   | Code | TA sentence (notice) |
   |---|---|
   | `offering_suspended` | "[Action] is unavailable until TravelMudra resumes new applications for this service. Owner: TravelMudra." |
   | `existing_work_treatment_missing` | "[Action] is unavailable until TravelMudra records how existing work of this service continues during its suspension. Owner: TravelMudra." |
   | `existing_work_hold` | "[Action] is unavailable while TravelMudra holds existing work of this service during its suspension. Owner: TravelMudra." |
   | `offering_withdrawn` | "[Action] is unavailable: TravelMudra withdrew this service, and a withdrawal cannot be undone. Owner: TravelMudra." (no "until"; replaces "until TravelMudra offers this service again", F-W13-03) |
   | `withdrawal_continuation_not_permitted` | "Work on this application is held: TravelMudra withdrew this service and did not permit unfiled work to continue. Owner: TravelMudra." Plus, when Core offers the withdrawal request: "You can request the withdrawal of this application." |
   | `catalogue_impact_unknown` | "[Action] is unavailable until TravelMudra reviews how a change of this service affects this application. Owner: TravelMudra." |
   | `catalogue_impact_hold` | "[Action] is unavailable until TravelMudra releases the hold it placed after a change of this service. Owner: TravelMudra." |
   | `transition_pending` (not a policy code: the TA's own step) | "Submitting waits for your decision on the changed service terms." with the link "Decide on the changed terms" (TA-07t) |

   Each notice ends with "Your draft is kept." for a draft, "Your application is kept." otherwise (BU-27).
3. **TA-02, TA-03 (`services.ts` `TA_REASONS`).** `offering_suspended`: "TravelMudra has paused new applications for
   this service. Applications you already started are kept; each one shows on its own page what it can do now."
   (F-W13-04). `offering_withdrawn`: "TravelMudra has withdrawn this service for good. New applications cannot start,
   and drafts cannot be submitted. Applications you already started are kept." `catalogue_not_published`: "This service
   is not offered for new applications." (retired; no "at the moment"). The "Owner: TravelMudra" line stays. No row is
   preselected anywhere; no other offering is suggested (BU-27).
4. **CORE_MESSAGES (`src/apps/shared/core/shared.ts`).** The TA and staff sentences of these codes follow the tables of
   item 2 and §2.13.5; the stray key `existing_work_held` (`:263`) is removed.

### 2.12 SA-05a, SA-05e, SA-05g: changes (WP-02 pages)

1. SA-05a: the "Existing work" cell links to SA-05b `#assessments` (not the index, which omits holds of reviewed
   assessments): "[n] open: unknown, pending or held". The header link "Impact review" is removed (tab). The attention
   callout keeps "Open impact review".
2. SA-05e (`baselines.ts`): Effect unchanged list adds "If the offering is launched, new cases of its audience use this
   version at once. No new launch decision is needed." (V20; true whether or not it is launched). For a structure
   preview, `continuationChoices` gets `structural: true` and the option "Move to the new head" reads "Move to the new
   head: for a new declaration version this leaves each application waiting for your decision on its impact page (a
   transition with compatibility evidence, or another choice)." (`impact-recheck.ts:174-192`, F-W13-10).
3. SA-05g: the crumb "Offerings & launch" becomes "Offerings" (§1.4).

### 2.13 Closed word tables (`existing-work.ts`)

#### 2.13.1 Cause, change class, classification (staff)

| Value | Words |
|---|---|
| cause `baseline_publication` / `declaration_change` / `release` / `binding_change` | "Business values published" / "New declaration version published" / "Engineering release" / "Binding changed" |
| change `baseline_only` / `structural` / `binding_only` / `support_withdrawn` | "Business values only" / "Structure" / "Binding only" / "Support withdrawn by a release" |
| `pending_recheck` | "Not classified yet" |
| `closed_historical`, `filed_historical` | "Closed: historical", "Filed: historical" |
| `held_while_filing_possible` | "Filing may have happened: held" |
| `left_behind_baseline_only`, `left_behind_structural` | "On earlier business values", "On an earlier structure" |
| `binding_support_withdrawn` | "Its binding is no longer supported" |
| `statement_compatible_continuation`, `statement_requires_transition`, `statement_incompatible_hold`, `statement_unaffected`, `statement_missing` | "Engineering: compatible", "Engineering: needs a transition", "Engineering: incompatible, held", "Engineering: unaffected", "Engineering statement missing" |
| `country_rule_defect`, `superadmin_judged` | "Country rule failed", "Judged by a SuperAdmin" |
| unknown value | "Unrecognised classification ([code])" |

#### 2.13.2 Assessment states

| State | Words and meaning |
|---|---|
| `rechecking` | "Rechecking": the recheck is classifying open applications |
| `review_required` | "Review required": an application of this assessment is unknown or pending |
| `reviewed` | "Reviewed": no application of this assessment is unknown or pending. Held applications and declined transitions are not counted (F-W13-09) |
| `superseded` | "Replaced": a newer assessment covers the offering; current items here stay decidable |

#### 2.13.3 Treatments

| Value | Impact item | Existing-work treatment (launch) |
|---|---|---|
| `pending` | "Needs a decision" | — |
| `continue` | "Continues" | "Continues" |
| `transition` | "Transition approved" | — |
| `hold` | "Held" | "Held" |
| `missing` | — | "Not decided yet: held" |

#### 2.13.4 Continuation and compatibility

`continue_current` "Continue on their own terms"; `continue_on_head` "Move to the new head"; `hold` "Hold"; an absent
class "Not chosen"; compatibility `compatible_continuation` "Compatible", `requires_transition` "Needs a transition",
`incompatible_hold` "Incompatible: held", `unaffected` "Unaffected".

#### 2.13.5 Staff sentences of the launch and impact codes (`REASON_MESSAGES`)

| Code | Sentence |
|---|---|
| `existing_work_hold` | "Existing work is held by the suspension's treatment." |
| `existing_work_treatment_missing` | "No existing-work treatment is recorded for the suspension, so existing work is held." |
| `withdrawal_continuation_not_permitted` | "The withdrawal does not permit unfiled work to continue, so it is held." |
| `catalogue_impact_unknown` | "A catalogue change may affect this application and is not decided yet." |
| `catalogue_impact_hold` | "A SuperAdmin holds this application after a catalogue change." |
| `application_not_open` | "The application is closed: completed or ended with its group." |
| `not_active_superadmin` | "Choose an active SuperAdmin with a second factor set up." |
| `awaiting_formal_return` | "The application is with its operator until it is formally returned to the travel agent." |
| `outcome_already_recorded` | "A result is already recorded for this application." |

The wrong keys `existing_work_held` and `treatment_missing` (`shared.ts:130-131`) are removed (F-W13-01).

### 2.14 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource | Summary test | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|
| `suspended` | SA-05h | `offering`, path id | `suspensionId` `^sus_`; `treatment` ∈ {`continue`,`hold`,`missing`}; no `withdrawalId` | "Offering suspended" | "Existing work: [§2.13.3 words of `treatment`]" | Suspension state; current treatment; the `create_draft` effect |
| `treatment` | SA-05h | `offering`, path id | `treatmentId` `^ewt_`, the only domain key | "Existing-work treatment recorded" | The row of `treatments` selected by `treatmentId`: "Treatment: [words]" and "For: [the suspension of [date] / the withdrawal]"; no row → neutral | "In force" / "Replaced since" for that row |
| `lifted` | SA-05h | `offering`, path id | `suspensionId` `^sus_`; `restoredLaunchId` `^lch_` | "Suspension lifted" | "Restored: the launch decision approved by [name], [audience]" (decision selected by `restoredLaunchId`) | Suspension state; the `create_draft` effect |
| `withdrawn` | SA-05h | `offering`, path id | `withdrawalId` `^owd_`; `treatment` ∈ {`continue`,`hold`} | "Offering withdrawn" | "Submitted, unfiled work: [continues (permitted) / held]" | Withdrawal time; current withdrawal treatment |
| `retired` | SA-05b | `offering`, path id | `offeringId` = path id and numeric `revision` | "Offering retired" | — | Availability "Retired" |
| `recheck` | SA-05b | `offering`, path id | `assessmentId` `^ima_`; numeric `generation` | "Recheck requested" | "Generation [n] of assessment [no., selected by `assessmentId`, link]" | That assessment's state |
| `retired_draft` | SA-05c | `offering` = the declaration's offering | `declarationId` = path id; no `versionNo` | "Declaration draft discarded" | — | Status "Discarded" |
| `reviewer` | SA-05m | `offering` = the assessment's offering | `assessmentId` = path id; no `generation` | "Accountable SuperAdmin assigned" | — | Accountable SuperAdmin |
| `decided` | SA-05n | `offering` = the assessment's offering | integer `decided` ≥ 1 | "Impact decision recorded" | "Applications decided: [n]" | This item's treatment and owner (the address names the item; the summary names none, J-08) |
| `transition` (staff) | SA-05n | `application` = the item's application | `transitionId` `^stt_`; boolean `taAuthorityRequired` | "Transition approved" | "Travel agent's renewed authority required: [Yes / No]" and "Transition [reference]" | This item's treatment. No "waits" or "applied" claim (the read has no transition state; STOP-W13-02, -04) |
| `transition` (TA) | TA-07t | `application`, path id | `transitionId` `^stt_`; `applicationId` = path id | "Decision on the changed terms recorded" (neutral: the summary does not name the choice, Q-W13-08) | — | "No change of service terms waits for your decision now." or "Another change of service terms waits." |

No receipt shows an accepted time or a command name (P-02, S-08). The receipt facts never come from the address
`done` code alone.

### 2.15 Stale revision (CMP-14) per form

| Form | Guard | Rows (the reader's unsent choice / the current value read now; no "you saw", WP-12 J-10) |
|---|---|---|
| suspend, lift, withdraw | `_rev.controls` | Launch; Suspension; Withdrawal; Existing work (current treatment); Launch plan (lift) |
| suspension and withdrawal treatment | `expectedTreatmentId` (Core answers `stale_revision`) | Existing work: your choice / current treatment |
| retire | `_rev.offering` | Catalogue availability; Launch |
| discard draft | `_rev.declaration` | Status |
| reviewer | `_rev.assessment` | Accountable SuperAdmin: your choice / current; State |
| decide, transition | `_rev.item` | Treatment: your choice / current; Owner; whether the item is still current |
| TA decision | `_rev.application` | "Change of terms waiting": yes / no now |

### 2.16 Refusal sentences (closed table, `existing-work.ts`)

Category plus code selects the sentence; Core's `fieldErrors` select by field and code. "Nothing changed" is used only
after a proven refusal (WP-02 B-03). Existing `REASON_MESSAGES` and `DECISION_MESSAGES` entries stay unless listed.

| Form | Category / code (field) | Sentence | Where |
|---|---|---|---|
| suspend | `control_blocked` / `offering_not_launched` | "Suspending needs a launched offering. Nothing changed." | closed state |
| suspend | `control_blocked` or `conflict_duplicate` / `suspension_active` | "This offering is already suspended. Nothing changed." | closed state |
| suspend | `input_invalid` (`existingWorkTreatment`) | "Choose how existing work continues during the suspension." | field |
| suspend, lift, withdraw | `input_invalid` (`evidence`: `too_small`) | "Add the evidence for this decision." | evidence |
| treatment | `control_blocked` / `suspension_not_active` | "This suspension is no longer active. Nothing changed." | closed state |
| treatment | `control_blocked` / `treatment_unchanged` | "Existing work already follows that treatment. Nothing changed." | form-level |
| treatment | `control_blocked` / `withdrawal_treatment_widening_unavailable` | "A withdrawal's treatment can change only from continue to hold. Existing work is already held. Nothing changed." | closed state |
| lift | launch codes (`launch_acknowledgement_mismatch`, `launch_plan_incomplete`, `launch_plan_not_current`, `provider_route_unapproved`, `launch_item_not_supported`, `catalogue_not_published`, `parked_custody_route_policy`, `synthetic_not_permitted`) | The WP-02 `DECISION_MESSAGES` and `REASON_MESSAGES` sentences, with "Lifting" for "Launching"; `launch_plan_not_current`: "The launch plan changed after you opened this page. Review the current plan and send again." | as `launch` |
| withdraw | `validation_failed` / `withdrawal_irreversible_unacknowledged` (`acknowledgeIrreversible`) | "Confirm that you understand the withdrawal cannot be undone." | field (left clear) |
| withdraw | `control_blocked` / `withdrawal_permission_required` | "Permitting continuation needs feasibility evidence." | feasibility |
| withdraw | `input_invalid` (`permitsUnfiledContinuation`) | "Choose whether submitted, unfiled work may continue." | field |
| withdraw | `conflict_duplicate` / `offering_already_withdrawn` | "This offering is already withdrawn. Nothing changed." | closed state |
| retire | `control_blocked` / `offering_retired` | "This offering is already retired. Nothing changed." | closed state |
| retire | `control_blocked` / `retire_requires_not_launched` | "A launched offering is withdrawn before it is retired. Nothing changed." | unavailable state |
| discard | `control_blocked` / `declaration_not_draft` | "This version is no longer a draft: it was discarded, approved or published meanwhile. Nothing changed." | first in `main` |
| recheck | `validation_failed` / `nothing_to_recheck` | "There is no open assessment to recheck: the latest one was replaced, or none exists. Nothing changed." | form-level |
| reviewer | `input_invalid` (`superAdminId`: `not_active_superadmin`, `custom`) | "Choose an active SuperAdmin with a second factor set up." | field |
| reviewer | `control_blocked` / `impact_item_not_current` | "A newer assessment replaced this one. Assign the reviewer on the newer assessment. Nothing changed." | closed form |
| decide, transition | `control_blocked` / `impact_item_not_current` | "This item is no longer current: a later recheck or decision replaced it. Nothing changed." | closed state |
| decide, transition | `control_blocked` / `application_not_open` | "This application is closed. Its terms do not change. Nothing changed." | closed state |
| decide | `control_blocked` / `transition_pending` | "A transition of this application waits for the travel agent. Decide again after the travel agent answers. Nothing changed." | form-level |
| decide | `control_blocked` / `impact_decision_not_allowed` | "'Not affected' is available only when the impact is unknown because the engineering statement is missing, the recheck has not classified it, or a country rule failed." | `decision` |
| decide | `control_blocked` / `continuation_unsupported` | By the posted decision: `continue_current` "Its current terms are no longer supported by the active release, or a transition waits. Choose Hold, or approve a transition."; `continue_on_head` "Moving without a transition needs a business-values difference or a change engineering classified as compatible. Approve a transition instead, or choose another decision." | `decision` |
| decide, transition | `control_blocked` / `filing_possibly_occurred` | "Filing may already have happened for this application. It cannot move to other terms. Nothing changed." | form-level |
| decide | `input_invalid` (`holdOwnerId`: `required`, `not_active_superadmin`) | "Choose the SuperAdmin who owns the hold." / "Choose an active SuperAdmin with a second factor set up." | `holdOwnerId` |
| decide | `input_invalid` (`evidence`: `required`) | "'Not affected' needs evidence." | evidence |
| decide | `input_invalid` (`decision`) | "Choose a decision." | `decision` |
| transition | `input_invalid` (`compatibilityEvidence`: `too_small`) | "Add engineering compatibility evidence." | evidence |
| transition | `control_blocked` / `transition_evidence_missing` | "The evidence does not establish compatibility. Give a release manifest that names the target binding [reference], or a release under which it is supported. Nothing changed." | `evidence.id` |
| transition | `conflict_duplicate` / `transition_pending` | "A transition of this application already waits for the travel agent. Nothing changed." | closed state |
| transition | `control_blocked` / `impact_decision_not_allowed` | "This application is not affected. It needs no transition. Nothing changed." | closed state |
| transition | `control_blocked` / `catalogue_not_published`, `declaration_unsupported`, `binding_incompatible` | "The offering's head cannot take new terms now: [REASON_MESSAGES sentence]. Nothing changed." | form-level |
| TA decision | `input_invalid` (`decision`) | "Choose Accept or Decline." | `decision` |
| TA decision | `input_invalid` (`transitionId`) | "This page is out of date. Open it again." | form-level |
| TA decision | `control_blocked` / `awaiting_formal_return` | "This application is with your operator. They return it to you so you can decide. Nothing changed." | state |
| TA decision | `control_blocked` / `filing_possibly_occurred` | "TravelMudra cannot change this application's terms now: a filing may already have happened. Nothing changed. TravelMudra resolves this first." | form-level |
| TA decision | `control_blocked` / `application_not_open`, `outcome_already_recorded` | "This application is closed or has a result. Its terms do not change. Nothing changed." | state |
| every form | `stale_revision` | CMP-14 (§2.15) | — |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden`, `unauthenticated`, `maintenance`, `unavailable_dependency` | Shell (`answer`, LD-14; B-03 neutral wording) | — |
| every form | unknown code | Category recovery text + "Reference code: [code]" | form-level |

### 2.17 Input handling in the handlers (LD-17)

The catalogue and launch handlers send every field whole (`runForm`); `zFormFields` bounds fields at 131,072
characters and 600 keys (`catalogue.ts:41-44`); a value over a contract bound is refused by Core at the field with
the values kept on the re-render. No WP-13 handler slices, drops or rewrites a field. The TA handler
(`edge/core/routes.ts:94-100`) slices `transitionId` to 40 and `decision` to 20 characters today (F-W13-06): it MUST
send both whole; the contract (`text(40)`, `text(20)`) and the module enum refuse a wrong value, which TA-07t maps to
§2.16. The BFF checks only the hidden redirect ids it reads itself (`assessmentId` `^ima_…$`, `itemId` `^imi_…$`,
`causeRef` prefix) and never sends Core less than the reader chose. Each form offers one evidence row because the
binding reads one (`evidenceOf`); more rows would be dropped by the binding, so none is offered (D-W13-11).

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Changed terms for the TA (STOP-W13-01) | TA-07t §2.10 item 4 sentence; Accept and Decline offered (Q-W13-02) | "What changes": per authority item, before and after in TA words; the approved target version; a link to the service page |
| Impact items of an offering with application, transition and decision facts (STOP-W13-02) | SA-05m groups from one assessment; SA-05b lists assessments; "Transition approved" with the decline line; links to SA-04a for the applicant | SA-05b "Existing work now" list across assessments (held, declined, pending) with applicant, travel agent and owner; SA-05m rows with names; "Waiting for the travel agent" / "Declined: decide again" / "Applied" |
| Declined transitions counted as open (STOP-W13-03) | Lines on SA-05l, SA-05m, SA-01 (AM-W13-01) | Counts and states include them; the lines go |
| Second approval after a decline (STOP-W13-04) | SA-05t effect line; neutral receipt facts | Core refuses with a code (or opens a new transition after a Kind 2 decision); §2.16 gets its sentence |
| Transition target and recheck after a newer head (STOP-W13-05) | SA-05t scope line; TA-07t item 4 caveat | The form posts the reviewed head; Core refuses a changed head; an applied transition to a superseded head is rechecked |
| Launch effect per action on the TA case (STOP-W13-06) | TA-07 shows Core's evaluation blockers only | TA-07 "What can happen now": per action of this application, Core's effect and owner |
| Launch history facts; treatment on the overview (STOP-W13-07) | SA-05h states only what the read carries; SA-01 group says "check" | Who, when, why for each suspension, lift, withdrawal and treatment; SA-01 says "held" or "continues" |
| Command identity in receipts (P-02, P-10 b, S-08) | Neutral TA receipt; summary keys of §2.14 | The TA receipt says "You accepted" / "You declined" |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 34e875b already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical decision and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Suspend | Same `_op` | K-STD replay; the same 303 and receipt; one suspension (`launch-control.test.ts:296`) | None | Partly (no receipt) |
| Suspend | New `_op`, second tab | Old revision → CMP-14; fresh revision → `suspension_active` → closed "already suspended" | None | Partly (generic callout, values lost) |
| Treatment | Same content again, new `_op` | `stale_revision` (the token moved) → CMP-14; or `treatment_unchanged` | None | Partly |
| Lift | Twice | Fresh revision → `suspension_not_active` → closed; old → CMP-14 | None | Partly |
| Withdraw | Twice | Fresh revision → `offering_already_withdrawn` → closed "already withdrawn"; old → CMP-14 | None | Partly |
| Withdrawal treatment | Twice | `withdrawal_treatment_widening_unavailable` or `stale_revision` → closed "already held" | None | Partly |
| Retire, discard | Twice | `offering_retired` / `declaration_not_draft` → closed with the sentence (not hidden) | None | No (refusal hidden with the section, F-W13-08) |
| Recheck | Twice | Core accepts each request as a new generation; no second item, reduction or notice (`catalogue-impact.test.ts:107`); the page says a further request restarts the run | A second run | Yes |
| Reviewer | Same reviewer again | Core accepts (new revision and fact) | One more fact | Yes |
| Decide | Two SuperAdmins on one item | Second: `stale_revision` → CMP-14 with the current treatment and owner; values kept | None | No (values lost) |
| Decide | Same SuperAdmin later, fresh page, same decision | Core records it again (no business duplicate check, B35 accepted for a re-decision) | One more fact | Yes |
| Transition | Twice while waiting | `conflict_duplicate/transition_pending` → closed | None | Partly |
| Transition | Again after a decline | Core accepts and reopens nothing (STOP-W13-04); receipt claims only the summary | Item looks decided; application stays blocked | Yes (defect) |
| TA decision | Same `_op` | Replay | None | Partly (no receipt) |
| TA decision | New `_op` after a decision | `stale_revision` → CMP-14 "decided after you opened the page" | None | Partly |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused decision (C1, C2, C5) | Same host page at the POST address, CMP-07 focused | Every typed value and choice; the irreversibility box clear | — |
| The state closed meanwhile (already suspended, withdrawn, retired, not current) | Closed state with the refusal sentence first | The typed reason is shown read-only in the unsent text block (WP-09 U2) | The form |
| Required read unavailable (SA-05t head, SA-05x launch summary, treatment row) | Frame and CMP-10, no form | — | The form |
| Access lost | Shell SH-02 or sign-in (LD-14) | — | Typed values (B10) |
| Answer lost | Operation page (CMP-13) | — | No new submission offered |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Suspension while applications are mid-filing** | An act authorized before the suspension: recording its evidence and reconciling it go on (no launch control); a new authorization, readiness and packet release are held under `hold` or `missing`; outcome, delivery and completion go on. SA-05j `suspend` states this in Effect; SA-05h's lead and Core's table show it; OP-02 shows the held actions (AM-W13-03). A suspension racing a submission gives one consistent result (`launch.test.ts:70`) | Partly (copy says submission stops; F-W13-02) |
| **Suspension with treatment not decided** | Existing work held (fail closed, `decision.ts:120-124`); SA-05h next action "Record the existing-work treatment"; SA-01 group (AM-W13-02); TA-07/TA-08 notice "until TravelMudra records how existing work … continues" | No (generic text, wrong keys, F-W13-01) |
| **A transition decided after the offering changed again** | SuperAdmin side: a pending item becomes not current → `impact_item_not_current` → closed; a carried decided item is still current and moves to the **newer** head, which SA-05t shows read now (STOP-W13-05 a). TA side: Core applies the older target; TA-07t never says "current terms"; the application is not rechecked against the newer change (STOP-W13-05 b, suspected; failing test first) | No |
| **Impact items decided twice** | §4.1 rows "Decide"; a re-decision of a held item by its owner with a fresh page is a new record, shown as the current treatment | Partly |
| **Withdrawal with unresolved treatment** | Withdrawal while the suspension's treatment is `missing` or `hold`: the most restrictive effect applies per action; SA-05j `withdraw` states that existing work stays held whatever the permission. Withdrawal while impact items are open: those applications stay blocked by impact too; the withdrawal page links the offering's assessments | Partly (no statement) |
| **Withdrawn, continuation not permitted** | Submitted unfiled work is held for good (a withdrawal treatment cannot widen); TA-07 says so and offers the withdrawal request when Core offers it; staff see the hold row with owner SuperAdmin | No |
| **Suspension of a withdrawn offering** | Core accepts it; SA-05j `suspend` shows the closed state with the route to the withdrawal treatment (D-W13-07) | No (form offered) |
| **Lift after a structural update** | `requireLaunchableHead` checks the new head: an incomplete plan for the new head → unavailable state with "Open the launch plan" | No (form offered, refusal) |
| **Declined changed terms** | The application is blocked `catalogue_impact_unknown`; TA-07 notice "until TravelMudra reviews…"; SA-05m "Transition approved" line tells the SuperAdmin to decide again; counts miss it (STOP-W13-03) | No (decline hidden; nothing shown) |
| **Held item on a superseded assessment** | SA-05m shows decision links on every current item; SA-05a links to SA-05b, where every assessment is listed | No (forms hidden, F-W13-07) |
| **Release supplies a binding / changes the head** | No launch, no migration (`catalogue-release.test.ts:60`); SA-05h decisions unchanged; an impact assessment opens | Yes |
| **Retire while open work exists** | Allowed after a withdrawal; open work keeps its terms; SA-05x states it | Yes (words new) |
| **Access revoked mid-page** (SuperAdmin suspended, session ended; TA suspended; travel agent's application reassigned to an operator) | Next read or command: SH-02 or sign-in; no earlier facts remain (LD-14). A TA whose application was assigned meanwhile gets `awaiting_formal_return` → "With the operator" state | Yes |
| **Hand-made treatment or lift post on another offering's path** | The binding acts on the treatment's or suspension's own offering (`catalogue-admin.ts:316-322`); the receipt check on the path offering fails → neutral receipt | Yes (P2, STOP-W13-08) |

### 4.4 Access and accounts changing mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| The named hold owner or reviewer is suspended or loses the second factor between load and submit | Core refuses at the field (`not_active_superadmin`); the select is read again on the re-render | Partly |
| The accountable SuperAdmin becomes inactive | Later rechecks give holds to the SuperAdmin queue (`impact-recheck.ts:254-259`); SA-05m shows "SuperAdmin queue" for new holds | Yes |
| The TA's application is assigned while TA-07t is open | Refused `awaiting_formal_return` → state "With the operator" | No |
| A second SuperAdmin suspends while the first is on `withdraw` | `_rev.controls` moved → CMP-14 with the suspension shown | Partly |

### 4.5 Counts, caps and long lists (200 affected applications)

| Situation | Required behaviour |
|---|---|
| 200 applications reached by one structural change | SA-05m groups 200 rows (one table per group, rows stack on phones, no nested scroll); each row links to its decision page; no page holds 200 forms (F-W13-12). The publication's continuation choice handles classes of work at once; transitions stay per application (B06) |
| 200 items to hold or continue one by one | No batch (D-W13-12); STOP-W13-09 asks for the binding of the existing batch input; the decision page offers "Next application that needs a decision" |
| An assessment with more than 5000 items | The read caps at 5000 (`catalogue.ts:276`); SA-05m says "The list shows at most 5000 applications and may be incomplete." when 5000 rows return |
| Suspension of an offering with 200 open applications | Effects are per action, not per application; the list link opens `views.admin_applications` (pages of 200 with `next`); no count is claimed on the decision page |
| Impact index at its 5000 cap | Cap line as above |
| SuperAdmin list at 200 rows | Text fallback (D-U3-05) |

### 4.6 Device and environment

JavaScript off: every page works (plain forms; radios; no conditional fields). 320 px and 400 % zoom: one column, no
two-dimensional scroll (AC-04). Keyboard: radios, checkboxes and links in reading order; the error summary takes focus
after a refusal (AC-08).

## 5. Accessibility notes specific to WP-13

- One `h1` per page; decision blocks are `h2`; SA-05m groups and SA-05h subsections are `h3` (AC-03; F-U3-04 fixed).
- Radio groups (`existingWorkTreatment`, `treatment`, `permitsUnfiledContinuation`, `decision`) are `fieldset` with a
  `legend`; none preselected; after a refusal the choice is kept (AC-15).
- The irreversibility checkbox has a visible label and is described by the "It ends" effect group.
- Unavailable controls (`unavailableButton` "Retire offering", the lift and launch boundaries) carry
  `aria-disabled="true"` and `aria-describedby` to their CMP-10 (AC-13).
- Status words ("Held", "Needs a decision", "Not decided yet: held") are text with an icon, never colour only (AC-06).
- Receipts are announced politely without moving focus (AC-09). Group counts name their unit.

## 6. Proofs V20 and BU-27 on `lane-ui`

V20 (UX §12): "Publication/released binding does not launch a new route. Existing-case impact is explicit. Supported
structural update to launched unsuspended offering needs no invented second launch approval for new cases" (B05–B07).
BU-27: "No offered service available or current eligibility changes → no invented offering/default; affected action
explains its constraint and next owner while preserving earlier accepted work".

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone, ref `ui-revamp-2026-10-12`). At
  the WP-13 proof it holds the integrated WP-02, WP-03 and the packages integrated before WP-13 (inference). Synthetic
  data only.
- Seed: Synthetica (SYN, listed); the seeded offerings launched for every active TA except the unapproved provider
  offering (WP-02 §7.1, inference to confirm on SA-05g). Accounts syn-superadmin-1 (SA1), syn-superadmin-2 (SA2),
  syn-ta-1 (TA1), syn-ta-2 (TA2). Sign-in through the LD-11 harness; codes never printed. Screenshots allowed. axe at
  1440 px and 390 px.
- The run creates its own offering. Withdrawal and retirement are irreversible: they act only on the run's offering
  (Q-W13-07). Seeded data is not changed.

### 6.2 Setup (synthetic writes, labelled as setup; run tag `wp13-[yyyymmddhhmm]`)

As SA1, through the WP-02 pages (the WP-02 Part D recipe): create offering "WP-13 proof [stamp]", service code
`wp13_[stamp]`, Synthetica, "TravelMudra files"; register declaration version 1 from the head body of "SYN Tourist
e-visa"; record the structure approval; bind; save values ₹3,300; preview; publish. As TA1: create group
`wp13-[stamp]` in Synthetica (travel +30/+40 days).

### 6.3 Steps and observable results

"L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V20-1 | SA1, SA-05h and SA-05g of the proof offering; TA1, TA-02 and direct TA-03 URL | Read | Launch "Not launched"; "No launch decision"; TA-02 has no row for it; TA-03 address → SH-02 404. A publication and a binding did not launch it | L |
| V20-2 | Test | Release cut-over test | "registers during the cutover: a head binding change at deployment, not a launch, and no application migrated" (`catalogue-release.test.ts:60`) passes | T |
| V20-3 | SA1, SA-05i and SA-05j `launch` | Record a complete plan; launch for named TA1 | Receipts; TA1 TA-02 "Available for new applications"; TA2 no row | L |
| V20-4 | TA1, TA-09c, TA-09, TA-08 | Add applicant A1 (stays a draft) and applicant A2 (documents, submit) | A1 draft; A2 submitted, unassigned | L |
| V20-5 | SA1, SA-05b → SA-05c → SA-05e | Register version 2: version 1's body with `eligibility.travelDateRules.minDaysBeforeTravelStartToSubmit` changed from the seed's 3 to 5 (an authority item; the group at +30 days stays valid; the value the ported-pages test uses); approval; binding; values for version 2; preview with values. Read SA-05e | Effect lists "If the offering is launched, new cases of its audience use this version at once. No new launch decision is needed."; "Move to the new head" reads the structural hint (§2.12) | L |
| V20-6 | SA1, SA-05e | Publish with "Existing drafts: Hold for review", "Submitted, unfiled work: Move to the new head" | Receipt "published" | L |
| V20-7 | SA1, SA-05h; TA1, TA-02 and TA-09c | Read; TA1 adds applicant A3 | SA-05h: Launch "Launched", the decisions table holds one decision, no "Approve the launch"; the readiness note of §2.1 item 3. TA-02 "Available". A3 is created at once: **no second launch approval** | L |
| V20-8 | SA1, SA-05b, SA-05a, SA-05l, SA-05m | Read (reload until the recheck ends) | SA-05b assessment no. 2 "Review required"; SA-05a "2 open: unknown, pending or held" → SA-05b; SA-05l row "2 open"; SA-05m: "Need a decision" A2 ("On an earlier structure"), "Held" A1 (owner SA1); A3 absent. **Existing-case impact explicit** | L |
| V20-9 | TA1, TA-07 and TA-08 of A1 | Read | Notice "Submitting this application is unavailable until TravelMudra releases the hold it placed after a change of this service. Owner: TravelMudra. Your draft is kept."; no submit form | L |
| V20-10 | SA1, SA-05t of A2 | Read; send with no evidence; with `external_reference` `SYN-[stamp]`; with `release_manifest` = the target binding reference shown on the page | Scope shows the head versions read now and the binding with copy. First: 422 at evidence, reason kept. Second: 409 "The evidence does not establish compatibility …", values kept. Third: receipt on SA-05n "Transition approved", "Travel agent's renewed authority required: Yes" | L |
| V20-11 | TA1, TA-07 of A2 → TA-07t | Read; send with no choice; choose "Accept the changed terms" | TA-07 step "Decide on the changed terms"; TA-07t item 4 interim text; no choice → 422 "Choose Accept or Decline."; then receipt "Decision on the changed terms recorded" and "No change of service terms waits for your decision now." | L |
| V20-12 | Harness | Resend the V20-11 POST (same `_op`); post again with a new `_op` | Same 303; then 409 CMP-14 "… decided after you opened the page"; nothing changes | L |
| V20-13 | SA1, SA-05n of A1; SA2 on the same page loaded before | SA1: "Continue on its current terms"; SA2: "Hold" | SA1 receipt; SA2 409 CMP-14 with "Current: Continues", values kept. TA1 TA-08 of A1 shows the submit form again | L |
| V20-14 | Test | Decline path; a second approval after the decline | Decline: application blocked `catalogue_impact_unknown`; SA-05m "Transition approved" line. Second approval: accepted, no new transition (pins STOP-W13-04 as known; turns into a refusal test when fixed) | T |
| V20-15 | Test | A transition approved; a newer publication; the TA accepts | The application moves to the older target (pins STOP-W13-05 b; failing-first test of the expected recheck) | T |
| B27-1 | SA1, SA-05j `suspend` | Read; choose "Not decided yet", evidence `SYN-SUS-[stamp]`, reason | Effect per treatment; link "Applications of this offering"; receipt on SA-05h "Offering suspended", "Existing work: Not decided yet: held"; effect table: create draft "Refused", submit and operator rows "Held" with the §2.13.5 sentence, record outcome "Allowed"; next action "Record the existing-work treatment" | L |
| B27-2 | TA1, TA-02, TA-03, TA-09c of the group, TA-08 of A1 | Read | TA-02 row "Not available for new applications" with "TravelMudra has paused … kept …" and "Owner: TravelMudra"; no row or option preselected, no other offering suggested; TA-03 the same; TA-09c does not offer the proof service for a new applicant and states why (WP-03 rule); A1: "… until TravelMudra records how existing work of this service continues during its suspension. Owner: TravelMudra. Your draft is kept." | L |
| B27-3 | SA1, SA-05j `suspend` again; harness | Read; post the B27-1 form again with a new `_op` | Closed "already suspended"; 409 CMP-14 or closed state with "Nothing changed" | L |
| B27-4 | SA1, SA-05j `suspension_treatment` | "Let existing work continue" | Receipt "Existing-work treatment recorded", "Treatment: Continues", "For: the suspension of [date]"; effect table: submit "Allowed". TA1 submits A1 on TA-08: accepted (earlier accepted work preserved while new work is refused) | L |
| B27-5 | SA1, SA-05j `lift` | Acknowledge, evidence, reason | Receipt "Suspension lifted", "Restored: … Named travel agents (1)"; TA1 TA-02 "Available"; TA2 still no row | L |
| B27-6 | SA1, SA-05b | Request a recheck | Receipt "Recheck requested", "Generation [n] of assessment no. 2" | L |
| B27-7 | SA1, SA-05c | Register draft version 3 and discard it; discard again from the old page | Receipt "Declaration draft discarded"; second: the §2.16 sentence first in `main` | L |
| B27-8 | SA1, SA-05j `withdraw` | Choose "No, it is held"; send without the acknowledgement; then with it | 422 at the acknowledgement (left clear), other values kept; then receipt "Offering withdrawn", "Submitted, unfiled work: held"; TA1 TA-02 "withdrawn for good … drafts cannot be submitted … kept"; TA-07 of A3 (draft): "Submitting this application is unavailable: TravelMudra withdrew this service, and a withdrawal cannot be undone …"; A1, A2 (submitted): staff OP-02 (when built) show the held rows; TA-07 per STOP-W13-06 (partly met) | L |
| B27-9 | SA1, SA-05j `withdraw`, `withdrawal_treatment`, `suspend` | Read each | Closed states: "already withdrawn", "already held", "withdrawn: narrow existing work with the withdrawal's treatment" | L |
| B27-10 | SA1, SA-05x | Retire | Receipt on SA-05b "Offering retired"; TA1 TA-02 row with the withdrawn and "not offered" sentences; A1–A3 keep their pages | L |
| T-1 | Test | Renderer sweep: SA-05h and SA-05j kinds over the effect matrix (`effect.ts` states incl. suspended + withdrawn); TA-02/03/07/08 with every launch and impact code | No "continues" claim under `hold`/`missing`; no "until … offers this service again"; every code has a sentence; no preselected offering | T |
| T-2 | Test | Handlers: TA decision with a 41-character `transitionId` and a 21-character `decision` | Sent whole; Core's refusal mapped; nothing truncated (LD-17) | T |
| T-3 | Test | Parity tests: kind states vs the four launch guards; SA-05n options vs `decideItems`; SA-05t states vs `approve_transition` | Each guard listed; known differences named (D-W13-07, -10) | T |
| T-4 | Test | 200 items on SA-05m; 5000-row cap line | Grouped rows, links only, no forms | T |
| T-5 | Test | Suspension racing a submission (Core) | `launch.test.ts:70` passes | T |
| V-A | axe | SA-05h, SA-05j (five kinds), SA-05x, SA-05b, SA-05c, SA-05l, SA-05m, SA-05n, SA-05t, TA-07t, TA-07, TA-08, TA-02, TA-03 | No violation at 1440 px and 390 px | L |

### 6.4 Proof split

V20 passes when V20-1, -3 to -13 pass on `lane-ui` and V20-2, -14, -15 pass as tests (V20-14 and -15 pin the
defects as known and become refusal or recheck tests when Core fixes them). BU-27 passes for the non-bulk pages when
B27-1 to B27-10 pass; the TA-07 statement for submitted work under a hold is "partly met" until STOP-W13-06; the bulk
part is AM-W13-05.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel. Phase C: U6. The architect applies the two rail lines in
`src/web/ui/shell.ts:172`, registers the gallery modules in `scripts/dev/gallery-pages.ts` and edits `DESIGN.md` once
(launch-control decision kinds; impact pages; "Reviewed" meaning; TA changed terms).

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Words and messages** | New `src/apps/staff/catalogue/existing-work.ts` (§2.13, §2.16); `src/apps/staff/catalogue/shared.ts` (`REASON_MESSAGES` §2.13.5 and the two wrong keys; `ASSESSMENT_STATE`, `IMPACT_TREATMENT` words; `continuationChoices({ structural })`; `CARRIED_DONE_MESSAGES` removed; `CATALOGUE_CRUMB` removed when unused) | New `test/unit/web/existing-work-words.test.ts` (every `IMPACT_CAUSES`, `IMPACT_CHANGE_CLASSES`, `IMPACT_CLASSIFICATIONS`, `IMPACT_TREATMENTS`, `ASSESSMENT_STATES`, `EXISTING_WORK_TREATMENTS` value has words; unknown values fall back with the code; every launch and impact code of §2.16 has a sentence; no sentence says "until … offers this service again") | — |
| **U1 Impact pages** | `src/apps/staff/catalogue/impact.ts` rewritten (SA-05l, SA-05m, SA-05n, SA-05t renderers, loaders, refusal pages, receipt expectations, the SuperAdmin select reader) | New `test/unit/web/impact-pages.test.ts` (groups and counts; links on items of superseded and reviewed assessments; options per item facts; states in order; no form on SA-05m except the reviewer; head read outage removes the SA-05t form; receipts per §2.14; typed values kept; parity tests T-3); `catalogue-pages.test.ts` loses nothing | `scripts/dev/gallery/impact.ts` |
| **U2 Launch control** | `src/apps/staff/catalogue/launch.ts` (§2.1: section, next action, readiness note, receipts; carried forms and `CARRIED_DONE` removed; `LaunchPageOptions.form` removed); `launch-decision.ts` (kinds; dispatch); new `launch-control.ts` (§2.2 five kinds) | Update `test/unit/web/launch-pages.test.ts` (`:207-218` carried-form pins replaced by links and the new section); new `test/unit/web/launch-control-pages.test.ts` (kind states over the effect matrix; hidden treatment value by current value; acknowledgement clear after refusal; withdrawal conditional sentence; lift unavailable after a head change; receipts) | extend `scripts/dev/gallery/launch.ts` |
| **U3 Definition pages** | `src/apps/staff/catalogue/admin.ts` (§2.4, §2.5, §2.12 item 1); new `src/apps/staff/catalogue/retire.ts` (SA-05x); `baselines.ts` (§2.12 item 2); `public-site.ts` not touched | Update `test/unit/web/catalogue-pages.test.ts` (`:336-338` recheck and retire pins; `:388` discard pin keeps the form with a receipt); new `test/unit/web/retire-page.test.ts` | extend `scripts/dev/gallery/offerings.ts` |
| **U4 Changed terms (TA)** | New `src/apps/shared/pages/changed-terms.ts` (TA-07t); new `src/apps/edge/core/transition-routes.ts` (GET `ta.applications.changed_terms`; POST `ta.applications.transition_decision` moved, whole fields, receipt, re-render); `src/apps/shared/core/ta.ts` (§2.11 item 1) | New `test/unit/web/changed-terms.test.ts` (states; radio none preselected; support view without form; receipt neutral); update `test/unit/web/application-workspace.test.ts` (`:398` entry removed; `:303` fixture replaced by Core-shaped blockers) and `test/unit/web/carried-forms-ta.test.ts` (`:165` entry removed); BFF test in `test/unit/bff-changed-terms.test.ts` (whole fields; refusal re-renders TA-07t; same `_op` → same 303) | `scripts/dev/gallery/changed-terms.ts` |
| **U5 TA copy** | `src/apps/shared/pages/review-submit.ts` (`POLICY_UNTIL`, withdrawn sentence); `src/apps/shared/pages/services.ts` (`TA_REASONS`); `src/apps/shared/core/shared.ts` (`CORE_MESSAGES` of the codes; stray key) | Update `test/unit/web/review-submit.test.ts` (`:229` fixture and sentences), the services page tests; sweep T-1 (TA part) | — |
| **U6 Routes and wiring** | `src/apps/staff/catalogue/routes.ts` (GET `admin.catalogue.retire_form`, `admin.catalogue.impact_item`, `admin.catalogue.transition_form`; receipt locations and re-renders of §1.5; `launchRerender`, `launchBack`, `assessmentOf` replaced); `src/web/route-inventory.ts` (four GET entries; D06 per Q-W13-03 item 3); `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts` (TA-07t route module; staff support-view GET); `src/apps/edge/core/routes.ts` (T36 removed); `src/apps/shared/common-routes.ts` only if `resultHrefOf` lacks the admin `application` page | `test/unit/web/routes.test.ts` (four GET rows; POST rows unchanged); `test/unit/bff.test.ts`; `test/unit/bff-catalogue.test.ts` (`:194` `decide/suspend` is now 200: use an unknown kind such as `decide/relaunch` for the 404); `test/unit/web/carried-forms-admin.test.ts` (`:65-71` removed; the account entries stay); new BFF test `test/unit/bff-offering-change.test.ts` (each launch-control and impact POST: receipt location with `&op=`, refusal re-render with typed values, treatment kind by `causeRef`); new `test/unit/web/offering-change-host-pages.test.ts` (§7.2); new system test `test/system/offering-change.test.ts` (V20 steps 1, 3–8, 10–13 with synthetic data); the system tests of §7.3 | — |

No two units edit one file. Test file names carry no package or proof identifier.

### 7.2 Host-page test

`test/unit/web/offering-change-host-pages.test.ts` renders SA-05h (every control state), SA-05j (all seven kinds),
SA-05x, SA-05b, SA-05c, SA-05l, SA-05m, SA-05n, SA-05t, TA-07 (transition waiting) and TA-07t, and asserts: the actions
`…/suspend`, `…/existing-work-treatment`, `…/lift-suspension`, `…/withdraw` appear as form actions only on SA-05j
(the treatment action on two kinds, one each); `…/retire` only on SA-05x; `…/retire-draft` only on SA-05c; `…/recheck`
only on SA-05b; `…/impact/:id/reviewer` only on SA-05m; `/admin/catalogue/impact-items/:id/decision` only on SA-05n;
`/admin/applications/:id/transition` only on SA-05t; `/ta/applications/:id/transition-decision` only on TA-07t.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/ported-pages.test.ts:322-340` | Suspends from SA-05h (`cl.submit(page, …/suspend)`), plain `?done=suspended`, flash "The offering is suspended" | GET SA-05j `decide/suspend`, submit there (fields unchanged); location `…/launch?done=suspended&op=<key>`; receipt "Offering suspended"; the edge assertion stays (TA-02 sentence updated) |
| `test/unit/web/launch-pages.test.ts:207-218` | Carried suspend, withdraw, lift, treatment forms on SA-05h | Links of §2.1; the field list assertion moves to `launch-control-pages.test.ts` on SA-05j `suspend` (same names) |
| `test/unit/web/carried-forms-admin.test.ts:65-71, 198, 213, 223` | Seven WP-13 entries and their plain redirects | Entries removed; the account entries stay |
| `test/unit/web/catalogue-pages.test.ts:336-338, 388` | Carried recheck, retire, discard forms | Recheck and discard stay on their host with receipts; retire is a link |
| `test/unit/bff-catalogue.test.ts:194` | `decide/suspend` answers 404 | 200; an unknown kind answers 404 |
| `test/unit/web/carried-forms-ta.test.ts:165`; `test/unit/web/application-workspace.test.ts:398, 303` | Transition form on TA-07; non-Core pending fixture | Entry removed; TA-07 links TA-07t; fixture uses Core's blockers |
| `test/system/ported-pages.test.ts:237` | GET `/admin/catalogue/impact` 200 | Unchanged |

Stay valid: Core-level tests (`test/integration/launch-control.test.ts`, `catalogue-impact.test.ts`,
`catalogue-release.test.ts`, `catalogue-concurrency.test.ts`, `test/core/launch.test.ts`,
`test/core/catalogue-impact.test.ts`, `test/unit/catalogue.test.ts`).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `ops.suspend_offering` | SA-05; SA-09, WP-13 | SA-05j kind `suspend` (form → D43); WP-13. Note "Not offered for a withdrawn offering (D-W13-07)" |
| `ops.record_existing_work_treatment` | SA-05; SA-09, WP-13, K-BATCH | SA-05j kinds `suspension_treatment`, `withdrawal_treatment` (form → D46); WP-13. Note "One treatment per suspension or withdrawal; K-STD" |
| `ops.lift_suspension` | SA-05; SA-09, WP-13 | SA-05j kind `lift` (form → D44); WP-13 |
| `ops.withdraw_offering` | SA-05; SA-09, WP-13 | SA-05j kind `withdraw` (form → D45); WP-13 |
| `cat.retire_offering` | SA-05 (offering detail), WP-13 | SA-05x `…/offerings/:id/retire` (form → D81); WP-13 |
| `cat.retire_declaration_draft` | SA-05 (definition and binding), WP-13 | SA-05c (unchanged host); WP-13 |
| `cat.request_impact_recheck` | SA-05 (impact preview), WP-13 | SA-05b "Impact on existing work" (host); WP-13 |
| `cat.assign_impact_reviewer` | SA-05 (impact assessment sub-page), WP-13 | SA-05m (host); WP-13 |
| `cat.decide_impact_items` | SA-05 (impact preview); SA-09, WP-13 | SA-05n `/admin/catalogue/impact/:a/items/:i` (form → D39); WP-13. Note "One item per command (binding); K-STD" |
| `cat.approve_transition` | SA-05 (impact assessment sub-page), WP-13 | SA-05t `…/items/:i/transition` (form → D40); WP-13 |
| `core.decide_transition` | TA-07 (pending-work panel), WP-13 | TA-07t `/ta/applications/:id/changed-terms` (form → T36); WP-13. Note "Accept and Decline" |

Proposed §6 disposition CC-17: "The WP-13 forms leave SA-05h, SA-05b (retire), SA-05m (decide, transition) and TA-07;
the four launch-control commands are SA-05j decision kinds (`suspend`, `suspension_treatment`, `lift`, `withdraw`,
`withdrawal_treatment`); retirement is the decision page SA-05x; impact decisions and transitions have one page per
application (SA-05n, SA-05t); the travel agent decides changed terms on TA-07t. Recheck, draft discard and reviewer
assignment stay on SA-05b, SA-05c and SA-05m." §5.1 counts unchanged (WP-13: 11).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W13-01 | P1 | `REASON_MESSAGES` has `existing_work_held` and `treatment_missing`, not Core's `existing_work_hold`, `existing_work_treatment_missing`, `withdrawal_continuation_not_permitted` (`shared.ts:130-131`); the effect table shows the generic recovery text for exactly the hold codes | A SuperAdmin suspends with "not decided yet" and reads "Held: Check the details and try again" for filing; nobody learns that a treatment must be recorded | §2.13.5 |
| F-W13-02 | P1 | The suspend form says "New selection, intake and submission stop at once" (`launch.ts:667`); under `continue` Core lets drafts submit (`launch.test.ts:70`) | A SuperAdmin chooses "continue" expecting submissions to stop; a travel agent submits a draft during the suspension | §2.2.1 Effect |
| F-W13-03 | P1 | TA text for `offering_withdrawn` "until TravelMudra offers this service again" (`review-submit.ts:105`) | A travel agent keeps a draft for a withdrawn service and waits for a reopening that cannot happen | §2.11 item 2 |
| F-W13-04 | P1 | TA-03 suspended text "Work you already started continues as TravelMudra decided" (`services.ts:57`) | Under a hold the travel agent tells the customer the filing proceeds | §2.11 item 3 |
| F-W13-05 | P1 | The changed-terms form offers only Accept (`ta.ts:645-650`); `decline` is served (LD-07) | A travel agent who does not agree has no way to say so; the application stays blocked until they accept | TA-07t (§2.10) |
| F-W13-06 | P1 | The TA handler slices `transitionId` and `decision` (`edge/core/routes.ts:98`) | A hand-made or corrupted value is silently cut and sent; Core decides on a value the reader did not send (LD-17 class) | §2.17 |
| F-W13-07 | P1 | The assessment page hides every form on a superseded assessment (`impact.ts:120, 130`); a decided item stays on its original assessment; the index lists only open assessments | A held application whose assessment was superseded can never be released from the UI; SA-05a links to an index that does not list it | §2.7 item 5, D-W13-15, §2.12 item 1, AM-W13-01 |
| F-W13-08 | P1 | Every WP-13 refusal re-renders without the typed values; `offering_retired` and `declaration_not_draft` hide their section and so the refusal itself | A SuperAdmin's long withdrawal reason is lost after a missing acknowledgement; a second retirement shows the page with no message | §2.0 command results |
| F-W13-09 | P1 | "Reviewed: Every open item is classified" (`shared.ts:335`) while holds and declined transitions remain | A SuperAdmin reads "Reviewed" and stops looking; a held application waits for months | §2.13.2 |
| F-W13-10 | P1 | SA-05e "Move to the new head" says it applies where compatible; for a structure every application stays pending (`impact-recheck.ts:174-192`) | A SuperAdmin publishes a structure with "Move to the new head" and believes the work moved; 50 applications wait for decisions | §2.12 item 2 |
| F-W13-11 | P1 | Hold owner and reviewer are raw account references (`impact.ts:79, 122`) | A typo names an inactive account; the refusal arrives after the form is lost | Selects (D-W13-05) |
| F-W13-12 | P1 | The assessment page renders two forms per item inside `<details>` (`impact.ts:130`) | 200 affected applications give 400 forms on one page; a refusal re-renders without the reader's form | SA-05n, SA-05t |
| F-W13-13 | P2 | The transition and decision forms redirect to the assessment with a flash that cannot name the item | The SuperAdmin cannot tell which of 200 decisions was recorded | Receipts on SA-05n |
| F-W13-14 | P1 | After a structural update SA-05h shows "The current launch plan is not complete for the head declaration" for a launched offering with no word that the launch stays | A SuperAdmin approves an invented second launch, or suspends; V20 "no invented second launch approval" | §2.1 item 3 |
| F-W13-15 | P2 | The treatment form offers the current value and posts no revision | A SuperAdmin re-records the same treatment and gets `treatment_unchanged` | D-W13-08 |
| F-W13-16 | P1 | The lift form shows whenever a plan exists, also when a launch requirement is not met | After a structural update the lift is refused with a generic callout and blank fields | §2.2.3 unavailable state |
| F-W13-17 | P2 | The suspend form shows for a withdrawn offering (`launch.ts:665`) | A SuperAdmin suspends a withdrawn offering; the suspension adds a second treatment layer and a lift with a launch check | D-W13-07 |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W13-01 | P1 | Host pages and paths: SA-05j kinds, SA-05x, SA-05n, SA-05t, TA-07t; recheck, discard and reviewer stay in place (CC-17) | Two forms for one command carry different words; a refusal re-renders a page without the reader's form | Yes |
| Q-W13-02 | P1 | TA-07t offers Accept and Decline before STOP-W13-01 is served (A), or offers Decline only (B, hiding a served action: Max's decision), or neither (C) | A: a travel agent accepts terms they cannot read (no price or window change; documents and rules may change). B/C: every transition waits; the application stays blocked | A, with the honest "What changes" text; acceptance item "partly met until STOP-W13-01"; B or C only on Max's word |
| Q-W13-03 | P1 | Rail member "Offerings"; "Impact review" as a member of Offerings & launch; D06 removed from the inventory (P2) | Three names for one place; impact pages mark no tab | Yes |
| Q-W13-04 | P1 | Decision links on every current item, whatever the assessment state | F-W13-07 | Yes (Core decides currency) |
| Q-W13-05 | P2 | Suspension not offered for a withdrawn offering although Core accepts it | F-W13-17 | Closed state with the route to the withdrawal treatment; Core guard noted (STOP-W13-08) |
| Q-W13-06 | P1 | Route STOP-W13-01 to Max as a criterion exception with P-05, P-13, P-18 item 2; STOP-W13-02 and -06 as Kind 1 to the Core batch; STOP-W13-03, -04, -05 as defects to the Core batch (failing test first for -05) | §9.4 | Yes |
| Q-W13-07 | P1 | Proof writes on `lane-ui`: one new synthetic offering per run, withdrawn and retired by the run; three applications; synthetic accounts only | A rerun meets earlier rows; the run tag and service code identify them; seeded offerings are never suspended or withdrawn | Approve |
| Q-W13-08 | P2 | Neutral TA receipt (the summary does not say accept or decline) | The travel agent reads "Decision recorded" without the choice | Accept; joins S-08 (command identity) |
| Q-W13-09 | P1 | Amendments AM-W13-01 to -05 to WP-06, WP-07, WP-08 and the bulk packages | §1.8 | Yes |
| Q-W13-10 | P2 | `filed_historical` items get no decision form (D-W13-10) | A SuperAdmin tries to hold filed work; Core would accept a hold that changes nothing filed | Yes |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W13-01 | SA-05j kinds named `suspension_treatment` and `withdrawal_treatment` (WP-02 §2.5 said `treatment`) | Kind enumeration only |
| D-W13-02 | New GET pages SA-05x, SA-05n, SA-05t, TA-07t; their forms post to the existing paths; a refusal shows at the POST address with `restorePath` | New routes and inventory entries; actions and fields unchanged |
| D-W13-03 | Receipts with `&op=` replace the plain `?done=` flashes; done codes kept (`suspended`, `treatment`, `lifted`, `withdrawn`, `retired`, `recheck`, `retired_draft`, `reviewer`, `decided`, `transition`); `decided` and `transition` (staff) move from the assessment page to SA-05n; the TA `transition` moves from TA-07 to TA-07t | Locations change |
| D-W13-04 | Forms leave SA-05h, SA-05b (retire), SA-05m (decide, transition), TA-07 | Host pages change |
| D-W13-05 | `superAdminId` and `holdOwnerId` become selects of active SuperAdmins (text fallback) | Names and values unchanged |
| D-W13-06 | `decision` on the TA form becomes a radio with `apply` and `decline` (was hidden `apply`) | Name unchanged; a served value is offered |
| D-W13-07 | SA-05j `suspend` closed for a withdrawn offering (Core accepts) | None; hand-made posts still reach Core |
| D-W13-08 | The treatment form posts a hidden `treatment` when only one change applies | Names and values unchanged |
| D-W13-09 | "Not affected" offered only for Core's three classifications | None (Core decides) |
| D-W13-10 | `filed_historical` items have no decision form | None |
| D-W13-11 | One evidence row per form (the binding reads one; Core accepts 20) | None |
| D-W13-12 | No batch impact decision (the contract takes one item; UI-PLAN K-BATCH) | None |
| D-W13-13 | Rail member "Catalogue" renamed "Offerings"; "Impact review" member added | Shell lines |
| D-W13-14 | SA-05a "Existing work" links to SA-05b, not the index | Link target |
| D-W13-15 | Impact decision links on current items of superseded and reviewed assessments | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W13-01 | Kind 1 (P1), criterion point 2 likely needs Max's exception | For the travel agent's waiting transition: the target versions in TA words and, per authority item that differs (`commands/impact.ts:33-38`: promise, eligibility, travel-date rules, authority, gates, submit checks, cut-offs, documents and form fields, dependencies, price, fee, outcomes, artifacts, handover), the before and after values the TA may read; and the offering id on the TA case (P-09 item 5) | B06 "renewed TA authority"; UX §4.1 "before/after change"; Q-W13-02 | 1 facts stored (both declarations, the transition row); 2 no page can show them otherwise (the TA reads neither declaration): the same situation as P-18 item 2, so an exception request; 3, 4 hold | TA-07t interim text; the TA decides without the list. **P1**, with P-05 |
| STOP-W13-02 | Kind 1 (P1) | The current impact items of an offering across assessments, and on `cat.admin_assessment.items`: applicant name, travel agent name, group label, lifecycle, from-tuple versions, continuation kind, transition state (awaiting, applied, declined), decided by, decided at, decision reason, and whether the item is valid for the latest assessment | UX §6.3 "affected unfiled applications"; SA-05m and SA-05n name applications by reference only; a declined transition cannot be seen | 1 facts stored (`cat_impact_items`, `core_transitions`, applications); 2 removes one read per assessment of the offering and one case read per application (200 for one change), and a refusal-driven discovery of declines; 3, 4 hold | References and links; the decline line. **P1** |
| STOP-W13-03 | Defect (P1) | A declined transition is invisible: `open_items` (`read-models.ts:84-86, 199-211`) and `refreshAssessmentState` (`impact.ts:120-140`) count only `unknown`, `pending` and `hold`; `core.decide_transition` (decline) refreshes no assessment and notifies no SuperAdmin, while the application is `affected_pending` and blocked `catalogue_impact_unknown` | A travel agent declines; the operator cannot record readiness; SA-01, SA-05a and SA-05l show nothing to decide; the case waits with no owner (UX §2.2 "Waiting without reason or owner is insufficient") | — (fix: count a transition item whose transition is declined as open; refresh the assessment on decline) | Lines on SA-05l, SA-05m, SA-01. **P1** |
| STOP-W13-04 | Defect (P1) | `cat.approve_transition` after a declined (or applied) transition of the same item is accepted, reuses the old transition (`catalogue-writers.ts:123-124`) and records treatment `transition` again; nothing reopens | A SuperAdmin approves again after a decline; the receipt shows "Transition approved"; the travel agent sees nothing to decide; the application stays blocked | — (fix A: refuse with a code, a guard on an existing command; fix B: open a new transition, Kind 2) | SA-05t effect line. **P1**, recommend A |
| STOP-W13-05 | Defect (P1; b suspected, failing test first) | (a) `cat.approve_transition` targets the head at command time and takes no reviewed head (P-06 class); (b) a transition the travel agent applies after a newer head change moves the application to the older target, and no recheck classifies it against the newer change (the carried item stays decided) | (a) a carried held item moves to a head published after the SuperAdmin opened the page; (b) B06 "unknown applicability prevents filing readiness" is bypassed for the newer change | — (fix: an expected-head input on approve, with P-06; recheck or a fresh item after an applied transition behind the head) | SA-05t scope line; TA-07t caveat. **P1** |
| STOP-W13-06 | Kind 1 (P1) | On `core.ta_application`: the launch-control effect and codes per existing action of this application (submit, preparation, readiness, packet release, filing) | UX §3.2 "show explicit treatment of each existing action"; the pending answer has no launch rule (`derived.ts:285-421`); `correct` carries no launch codes | 1 facts exist (`launchDecision` over the stored controls); 2 removes a page-side inference of the effect from the offering title; 3, 4 hold | TA-07 shows Core's evaluation blockers only; a held submitted case can read "With TravelMudra". **P1** |
| STOP-W13-07 | Kind 1 (P2) | Launch history: suspended by, lifted by/at/reason/evidence, withdrawal actor/reason/evidence, treatment recorded by/at/reason; the current suspension treatment on `ops.launch_overview` rows | B33 actor and reason on each consequential fact; SA-01 AM-W13-02 | 1 stored; 2 removes one `ops.launch_offering` read per suspended offering for SA-01 | SA-05h shows what the read carries. P2 |
| STOP-W13-08 | Defect notes (P2) | Suspend and lift accept a withdrawn offering; the treatment and lift bindings ignore the path offering; `decide_transition` treats `reconciliation_exhausted` as not filed (unreachable while a transition waits, since acts are blocked); the next action `record_existing_work_treatment` and `review_catalogue_impact` are never produced | Consistency | — | D-W13-07; neutral receipts. P2 |
| STOP-W13-09 | Seam note (P2) | Bind the existing batch input of `cat.decide_impact_items` (items 1–200, all or nothing) with per-item results | 200 holds decided one by one | — (binding exposure, as P-16) | One page per item. P2 |

No STOP item blocks the WP-13 main path. No P0 item is open in this design. Kind 2: none requested (STOP-W13-04 fix B
would be one). Kind 1 requested: STOP-W13-01 (with an exception request to Max), STOP-W13-02 and STOP-W13-06 (P1);
STOP-W13-07 parked as P2. STOP-W13-03, -04 and -05 are defects for the Core task (failing test first for -05 b).
