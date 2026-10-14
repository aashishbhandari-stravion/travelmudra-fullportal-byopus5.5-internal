# WP-02 U3 notes: launch pages (SA-05g, SA-05h, SA-05i, SA-05j)

Unit U3 of WP-02. Author: the U3 engineer, 12–13 October 2026. Input for the architect's integration, the U5 route
wiring, the gallery registration and the `DESIGN.md` update. U3 commits nothing. Base: lane commit e9e96e3.
Binding inputs: `WP-02-design.md` §1.2–1.6, §2.4, §3.0, §3.7–3.10, §3.14, §3.15, §5, §6, §8.1 (U3 row), §8.3;
`WP-02.md` §3 (Q-W02-02) and §4.1 (B-01, B-02, B-03, B-06, B-07); `WP-02-U0-notes.md` §4.

All copy on these pages is draft under the copy rules (CR-09).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/catalogue/launch.ts` | Rewritten. SA-05g overview, SA-05h "Readiness and launch", and the launch vocabulary the two task pages share (paths, crumbs, five readiness labels, plan completeness wording, missing-field labels, effects table, receipt expectations and facts, value-keeping field helpers, refusal problems). Carried WP-13 forms kept. |
| `src/apps/staff/catalogue/launch-plan.ts` (new) | SA-05i launch plan task page, its loader, its refusal page, the owner choices read. |
| `src/apps/staff/catalogue/launch-decision.ts` (new) | SA-05j launch decision page (kinds `launch`, `expand`) on `decisionPage`, its loader, its refusal page, the head read and the TA reference-list read. |
| `scripts/dev/gallery/launch.ts` (new) | `launchGalleryPages()`: 14 admin pages (§6). Not registered. |
| `test/unit/web/launch-pages.test.ts` (new) | 36 tests (§7). |

No change to `shared.ts`, `routes.ts`, `route-inventory.ts`, `common-routes.ts` or `components.css`. No CSS rule is needed:
the pages use existing classes only (`fieldset.form-section` with `legend.form-section__title`, `fieldset.field.choice-group`
with `legend.field__label`, `.stack`, `.text-muted`).

## 2. Pages

### 2.1 SA-05g Launch `/admin/launch` — `overviewPage(ctx, model)`

`h1` "Launch"; lead; freshness "Read at … IST". Table: Offering (link to SA-05h), Launch, Suspension, Withdrawal (separate
cells), What blocks a launch (not launched: the unmet items of Defined, Validated and Operationally ready as a checklist;
none unmet: "Every listed launch requirement is met. No launch decision yet."; launched: "—"). Empty: "No offerings yet"
with "Open the catalogue". No "Ready" (F-W02-06 fixed).

### 2.2 SA-05h Readiness and launch `/admin/catalogue/offerings/:offeringId/launch` — `launchPage`, `loadLaunchPage`

Order in `main`: receipt (when the address names one) → header (crumbs "Offerings & launch / Launch", `h1` offering,
Who files, Scope, freshness) → "Synthetic" notice → status facts (Catalogue, Launch, Current audience, Suspension,
Withdrawal) → object tabs (`[title] pages`, current "Readiness and launch") → next action → `h2` "Readiness evidence"
(five `h3` label groups; `h3` "Launch plan" summary; `h3` "Actions that stay unavailable for live cases") → `h2` "Launch and
admission" (`h3` "What launch control allows now"; `h3` "Launch decisions"; link to SA-05j; carried `h3` "Suspension" and
"Withdrawal").

Next action (first that applies): withdrawn → "No one", the fact; suspended → SuperAdmin, link to `#suspension`; launched
named → SuperAdmin, secondary "Expand the launch scope"; launched all → "No one", the fact; first unmet requirement → its
blocker sentence, blocker type `evidence` (plan items link SA-05i, other items link SA-05b) or `policy` with owner
"Product owner" (provider route, return of originals; originals has no link); all met → "Approve the launch" (SA-05j).

No plan form and no approve or expand form on this page. The design's pinned headings "Launch requirements" (lead and
checklist names) and "What launch control allows now" stay.

### 2.3 SA-05i Launch plan `…/launch/plan` (new) — `planPage`, `loadPlanPage`, `planRefusalPage`

Header (`h1` "Launch plan: [offering]", crumbs to SA-05h) → `h2` "Current plan" (version; "Completeness for the head
declaration"; "Recorded when the plan was saved") → `h2` "Parts of the plan" (per measure, monitor and operating
readiness: what the stored plan recorded as missing when saved, linked to the fieldset) → form: error summary, stale
comparison, `_rev.controls`, `h2` Measures (one fieldset per measure), `h2` Monitors, `h2` Operating readiness, `h2`
Evidence and reason, "Record plan version [n+1]" and "Cancel".

States: draft; refused (C1/C2: error summary first in the form, each field problem linked; every typed value kept,
blank ones blank); stale (CMP-14 rows "Launch plan" and "Launch control record"); `requirements = null` (CMP-10 "Recording
a complete launch plan is unavailable until the head declaration declares its required measures and monitors. Owner:
Engineering release.", no form); retired (no form). A refusal with no form shows the refusal callout above the facts.

Owner fields (D-W02-04): a select of active operators and SuperAdmins ("[name] (SuperAdmin|Operator)", value = account
id, field name unchanged). The recorded owner is preselected only while it is in the list; otherwise a hint names it.
Text fallback (mono, hint "Account reference of an active operator or SuperAdmin. The account list is unavailable now.")
when either read is unavailable, or when either list returns the 200-row cap.

### 2.4 SA-05j Launch decision `…/launch/decide/:kind` (new) — `launchDecisionPage`, `loadLaunchDecisionPage`, `launchDecisionRefusalPage`

`decisionPage` (CMP-25), one page per kind (Q-W02-02). Scope: offering, who files, head declaration version, head
business values version, head binding, launch plan version with its completeness for the head and its reference; for
`expand` the current audience. Evidence: the five label groups and the unavailable actions. Effect: changes, unchanged,
"What launch control allows now". Hard stops: published values; supported launch-required items; approved provider
route; complete current plan (A71). Your decision: audience radio (nothing chosen), named accounts textarea, TA reference
list (disclosure, name/status/reference with copy; "Unavailable now" when the read fails; "at most 200" line at the cap),
acknowledgements (fieldset, none ticked), readiness evidence (required), reason (`_reason`). Review section, then "Approve
launch" / "Expand scope" and "Cancel".

| Page state (`launchDecisionState`) | Component state | Condition |
|---|---|---|
| `withdrawn` | `closed` "Withdrawn" | `withdrawal_state = effective` |
| `launched` (kind `launch`) | `closed` "Already launched", or "Launched by another SuperAdmin" after `launch_already_current` when the current decision's approver is not the reader | `launch_state = launched` |
| `expand_not_open` (kind `expand`) | `closed` "Expanding is not open" + the fact | not launched, suspended, or audience every active TA |
| `unavailable` | `unavailable`, `boundaryNotice` + `unavailableButton` + links to SA-05i and SA-05b | `plan = null` or any item of Defined, Validated, Operationally ready not met. Kind `owner_decision` (provider route, Owner: Product owner), `parked` (return of originals, Owner: Product owner), else `not_launched` ("… until every launch requirement above is met. Owner: SuperAdmin.") |
| `draft` | `draft`; `errors` after C2; `stale` after C5 | otherwise |

C2 field mapping: `launch_audience_invalid` → named accounts; `launch_audience_not_wider` → audience; `launch_acknowledgement_mismatch` →
first acknowledgement (re-render with none ticked); `reason_required` → reason; other codes and blockers → form-level.
Acknowledgements the reader ticked stay ticked after other refusals when the item and its code are unchanged.

## 3. B-01, B-07, B-02/B-03

- **B-01.** SA-05j shows the head declaration version, head business values version, head binding and plan version
  (with the plan reference) under review. The form posts `_rev.controls` and `planId` (the revisions the form carries);
  the page checks nothing. `ops.launch_offering` carries no head, so the page reads `cat.admin_offering` through
  `optionalView` (D-U3-01).
- **B-07.** "Complete" appears only when `readiness.plan.complete` is true. The stored completeness is labelled
  "Recorded when the plan was saved" and reads "Incomplete: [n] fields missing", "Complete" (only when current readiness
  is complete), or "No field was missing for the requirements of that time" (stored complete, current not complete).
  The plan readiness item's detail is "Missing when the plan was saved: …". Pinned by two tests.
- **B-02.** `launchReceiptExpectations(offeringId)`: `plan` (resource `offering`, id of the page, summary `planId` = `lpl_*` and
  boolean `complete`), `launched` and `expanded` (summary `launchId` = `lch_*`). Facts: plan → recorded "Completeness when
  saved"; current "launch plan" and "plan readiness" (only for the plan selected by the returned id). launched/expanded →
  current facts of the decision selected by `launchId`. A selected decision of the other kind (both codes have the same
  summary fields) renders the neutral receipt and no title. A plain `?done=plan|launched|expanded` without `op` shows
  nothing; the carried codes (`suspended`, `treatment`, `lifted`, `withdrawn`) keep their flash.
- **B-03.** Optional reads only through `optionalView`; an availability refusal gives "Unavailable" (head, reference
  list) or the owner text fallback; every other refusal reaches the shell (tested).

## 4. Wiring for U5

Routes (`src/apps/staff/catalogue/routes.ts`; `zOffering`, `offeringRef` as today):

| Route id | Method, path | Handler |
|---|---|---|
| `admin.launch.index` | GET `/admin/launch` | unchanged: `overviewPage(ctx, await ctx.view('ops.launch_overview', {}))` |
| `admin.launch.offering` | GET `/admin/catalogue/offerings/:offeringId/launch` | `ctx.page(await loadLaunchPage(ctx))` |
| `admin.launch.plan_form` (new) | GET `/admin/catalogue/offerings/:offeringId/launch/plan`, action `catalogue.read_admin`, `params: zOffering`, `resolve: offeringRef` | `ctx.page(await loadPlanPage(ctx))` |
| `admin.launch.decision` (new) | GET `/admin/catalogue/offerings/:offeringId/launch/decide/:kind`, action `catalogue.read_admin`, `params: z.object({ offeringId: zWireId('off'), kind: z.enum(LAUNCH_DECISION_PAGE_KINDS) })`, `resolve: offeringRef` | `ctx.page(await loadLaunchDecisionPage(ctx))` |
| `admin.launch.plan` | POST `…/launch-plans` | location `receiptLocation(launchPath(id), 'plan', ctx.operationKey)`; rerender `(e) => planRefusalPage(ctx, e)` |
| `admin.launch.approve` | POST `…/launch` | location `receiptLocation(launchPath(id), 'launched', ctx.operationKey)`; rerender `(e) => launchDecisionRefusalPage(ctx, 'launch', e)` |
| `admin.launch.expand` | POST `…/launch-scope` | location `receiptLocation(launchPath(id), 'expanded', ctx.operationKey)`; rerender `(e) => launchDecisionRefusalPage(ctx, 'expand', e)` |
| suspend, treatment, lift, withdraw | POST (carried) | unchanged: `launchBack` and `launchRerender(ctx, form)`; `launchPage(ctx, m, { error, form })` keeps its signature |

Exports: `launch.ts` — `overviewPage`, `launchPage`, `loadLaunchPage`, `LAUNCH_RECEIPT_CODES`, `launchReceiptExpectations`,
`launchPath`, `planPath`, `decisionPath`, `offeringPath`, `LaunchParams`; `launch-plan.ts` — `loadPlanPage`,
`planRefusalPage`, `planPage`, `readOwnerChoices`; `launch-decision.ts` — `LAUNCH_DECISION_PAGE_KINDS`, `LaunchDecisionParams`,
`loadLaunchDecisionPage`, `launchDecisionRefusalPage`, `launchDecisionPage`, `readHead`, `readTaAccounts`. The refusal pages
set `restorePath` to the GET page (the approve POST path equals the SA-05h path).

Inventory (`src/web/route-inventory.ts`): two GET entries for the new ids, surface `admin`, action `catalogue.read_admin`,
roles `['superadmin']`. Until U5 lands, `launchPage` still accepts `form: 'plan' | 'approve' | 'expand'` and shows the
refusal at the top, so the current POST re-render keeps working (D-U3-12).

Tests U5 changes (§8.3): `test/system/new-service.test.ts` step 7 reads the plan form from `${offeringPath}/launch/plan`;
step 8 reads the approve form from `${offeringPath}/launch/decide/launch` (form action, `ack.*`, `planId`, `_rev.controls`
unchanged). `test/system/ported-pages.test.ts:323-324` and `:329` stay valid.

## 5. Decisions of this unit

| Id | Choice | Reason |
|---|---|---|
| D-U3-01 | SA-05j reads `cat.admin_offering` (optional) for the head versions. | B-01 and A71 need the head version; `ops.launch_offering` has none. The two reads are not one snapshot; Core's atomic check is P-06. Recommendation for P-06: add the head ids and versions to `ops.launch_offering` so the page needs one read. |
| D-U3-02 | After a refusal (stale included) the forms post the current `_rev.controls` and current `planId`. | The page re-reads; every fact it shows is current. The stale comparison states the change before the fields. |
| D-U3-03 | A refusal on SA-05j in a no-form state (requirement became unmet, withdrawn) is passed through `decisionPage`'s `receipt` slot (first in `main`). | CMP-25 has no notice slot for no-form states. P2: the architect MAY add a `notice` slot. |
| D-U3-04 | Plan "Applies to this offering?" radios are optional (were required). | An incomplete plan may be recorded (design §3.9); all other plan fields are optional too. |
| D-U3-05 | Owner select falls back to the text field also at the 200-row cap. | A cut list would hide valid owners. |
| D-U3-06 | A typed owner that is not listed stays after a refusal as an extra option "[ref] (not an active operator or SuperAdmin now)". | Typed values kept (F-W02-03). |
| D-U3-07 | Local helpers instead of U2's in-progress `shared.ts` additions: `launchDocument` (calls `signedInPage` for `receiptTitle`, `restorePath`), `evidenceInputs`, `reasonInput`, `launchProblems`, `accountName`. Imports from `shared.ts` are HEAD exports only. | `shared.ts` changed while U3 worked. After integration the architect MAY switch to U2's `surfacePage`, `evidenceFields({ values })`, `reasonField({ value })`, `refusalProblems`. |
| D-U3-08 | SA-05h–j crumbs "Offerings & launch / Launch" (design §3.8); object tabs label `[title] pages` as U2's SA-05b. | U2's `offeringCrumbs` ("Offerings / [offering]") differs; the architect aligns the two if wanted. |
| D-U3-09 | Unmet-requirement boundary kind `not_launched` (label "Not available yet"). | No kind fits "evidence missing" exactly; the sentence carries the meaning. |
| D-U3-10 | SA-05j button labels "Approve launch" / "Expand scope" (design), not the acceptance example "Launch for 1 travel agent". | The count depends on typed input; the page has no script for it. |

## 6. Gallery

`launchGalleryPages()` (admin shell): `launch-overview.html`, `launch-readiness.html` (plan incomplete),
`launch-readiness-launched.html` (accepted receipt), `launch-readiness-suspended.html` (carried forms),
`launch-plan.html`, `launch-plan-refused.html` (owners unavailable, typed values, two field problems),
`launch-plan-unavailable.html`, `launch-decision.html`, `launch-decision-refused.html`, `launch-decision-stale.html`,
`launch-decision-unavailable.html` (provider route), `launch-decision-launched.html` (another SuperAdmin first),
`launch-expand.html`, `launch-expand-closed.html`. Synthetic data only. Registration line for `scripts/dev/gallery-pages.ts`:
`...launchGalleryPages()` in `galleryPages()`.

## 7. Checks

| Check | Result |
|---|---|
| `node --test test/unit/web/launch-pages.test.ts` | 36 of 36 pass. |
| `npx eslint` on the five U3 files | Clean. |
| `npm run typecheck` | Clean (whole project) on the final run. Earlier runs showed errors only in U4's in-progress files. |
| Scratch browser sweep of the 14 gallery pages (axe WCAG 2.2 A/AA and best practice at 1440 and 390 px, light and dark; overflow at 1440, 390, 360, 320 px; CSP; script errors) | 84 checks, no violation of any impact, no overflow, no CSP violation, no script error. |
| `npm run test:ui` | 952 of 953 pass. The one failure is `test/unit/web/wp03-components.test.ts` (MODULE_NOT_FOUND: the file was removed or renamed by another unit during the run). Not U3. The U3 gallery module is not registered, so the gallery sweep does not open its pages. |
| `TMPDIR=… node --test --test-concurrency=1 --test-global-setup=test/support/global-setup.ts test/system/new-service.test.ts test/system/ported-pages.test.ts` | 10 of 12 pass. `ported-pages` "suspends a launched offering from launch control" passes on the new SA-05h (headings, carried suspend form, plain `?done=suspended` redirect and flash). Two failures are U2's declaration-publish move (§8.3 pins `new-service.test.ts:102`, `ported-pages.test.ts:300`). `new-service` stops there, before its launch steps; steps 7 and 8 will fail until U5 adds the two GET routes and the test reads the plan and approve forms from SA-05i and SA-05j (§4). |

## 8. Findings and gaps

| Id | Rank | Finding | Scenario | Disposition |
|---|---|---|---|---|
| F-U3-01 | P1 | A72 wants the launch receipt to name the plan version and the head; `decisions[]` carries neither (B-06). | A SuperAdmin reads the receipt and cannot see which plan version the launch used. | Not shown. Add the plan id and head ids to the decision row of `ops.launch_offering` with P-06. |
| F-U3-02 | P2 | `readiness.plan.missing` is the stored list. When the head now requires more, the page says "not complete" with no list. | A head change adds a measure; the page says "Record a new plan version" but names no field. | Accepted; the page says so. P-06 MAY return the current missing list. |
| F-U3-03 | P2 | A72 asks for the named audience "by name"; the read model returns a count only. | — | Count shown (B-06). |
| F-U3-04 | P2 | The carried "Suspension" empty state uses an `h3` under the `h3` "Suspension" (`emptyState` supports only levels 2 and 3). | A screen-reader user hears two headings of the same level. | Parked until WP-13 rebuilds the section. |
| F-U3-05 | P2 | `decisionPage` has no slot for a refusal notice in a no-form state (D-U3-03). | — | Architect MAY add one. |
