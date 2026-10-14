# WP-02 U5 notes: routes and wiring (SA-05, SA-06)

Unit U5 of WP-02. Author: the U5 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration and the `DESIGN.md` update. U5 commits nothing. Base: lane commit e9e96e3 plus the finished, uncommitted
work of U2, U3 and U4. Binding inputs: `WP-02-design.md` §1.4, §1.5, §3.0, §3.8–3.10, §3.14, §3.15, §8 (U5 row, §8.2,
§8.3); `WP-02.md` §3 and §4 (B-01 to B-14 govern); the wiring lists of `WP-02-U2-notes.md` §5, `WP-02-U3-notes.md` §4
and D-U3-07/D-U3-08, `WP-02-U4-notes.md` §1.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/catalogue/routes.ts` | Receipts on every rebuilt GET page; `receiptLocation` on every rebuilt POST; typed re-renders; the declaration-publish refusal on SA-05e; the two new GET routes; launch POSTs on the U3 pages. Carried routes unchanged. |
| `src/web/route-inventory.ts` | Two GET entries: `D129` `admin.launch.plan_form`, `D130` `admin.launch.decision`. |
| `src/apps/shared/common-routes.ts` | `resultHrefOf` / `resultLabelOf`: `offering` → `/admin/catalogue/offerings/:offeringId` ("Offering"), `catalogue_admin` → `/admin/catalogue` ("Catalogue"); admin surface only. Nothing else. |
| `docs/extending/new-service.md` | Steps 6 to 8 name the publication decision page, the launch plan page and the launch decision page. Step titles unchanged (pinned by `new-service.test.ts`). |
| `src/apps/staff/catalogue/launch.ts`, `launch-plan.ts`, `launch-decision.ts` | Helper swaps to U2's `shared.ts` exports and U2's breadcrumb pattern only (§5). No behaviour change. |
| `test/unit/web/routes.test.ts` | +1 test: the three launch GET pages and the three launch POST routes at their path, action, command; launch area = 4 GET + 7 POST. |
| `test/unit/bff.test.ts` | +1 test: the launch page and its two task pages are staff-only and served by `staffRoutes()`. |
| `test/unit/bff-catalogue.test.ts` (new) | 9 tests, BFF in front of a scripted Core (§6). |
| `test/unit/web/carried-forms-admin.test.ts` (new) | 3 tests, design §8.2 (§7). |
| `test/system/new-service.test.ts` | §8.3 pins: publish from SA-05e; plan form from SA-05i; approve form from SA-05j kind `launch`; receipt locations; refusal keeps typed values. |
| `test/system/ported-pages.test.ts` | §8.3 pins in the catalogue section only: `&op=<key>` on the seven receipt locations; declaration publication from the preview page (form, `previewId`, `baselineId`, `_rev.offering`), no publication form on the declaration page. Line 85 (accounts) was U4's; lines 323–329 unchanged. |

No route path, form action, hidden input or field name changed. No file under `src/modules/`, `src/workers/`,
`src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/` or migrations changed.

## 2. Routes wired

| Route id | Method, path | GET read / POST answer | Refusal re-renders |
|---|---|---|---|
| `admin.catalogue.index` | GET `/admin/catalogue` | `readReceipt(indexReceipts())` | — |
| `admin.catalogue.country_create` | POST `/admin/catalogue/countries` | `country` → `/admin/catalogue` | SA-05a, `form: 'country'`, `typed` |
| `admin.catalogue.country_listing` | POST `…/countries/:countryId/listing` | `listing` → `/admin/catalogue` | SA-05a, `form: 'listing'`, `typed`, `countryId` |
| `admin.catalogue.offering_create` | POST `/admin/catalogue/offerings` | `offering` → SA-05b (summary `offeringId`) | SA-05a, `form: 'offering'`, `typed` |
| `admin.catalogue.offering` | GET SA-05b | `readReceipt(offeringReceipts(m))` | — |
| `admin.catalogue.declaration_draft` | POST `…/offerings/:id/declarations` | `declaration` → SA-05c (summary `declarationId`) | SA-05b, `form: 'declaration'`, `typed` |
| `admin.catalogue.baseline_create` | POST `…/offerings/:id/baselines` | `baseline` → SA-05d (summary `baselineId`) | SA-05b, `form: 'baseline'`, `typed`, `typedDeclarationId` (as before) |
| `admin.catalogue.declaration` | GET SA-05c | `readReceipt(declarationReceipts(m))` | — |
| `admin.catalogue.owner_approval` | POST `…/declarations/:id/owner-approval` | `approval` → SA-05c | SA-05c, `form: 'approval'`, `typed` |
| `admin.catalogue.bind` | POST `…/declarations/:id/bind` | `bound` → SA-05c | SA-05c, `form: 'bind'` |
| `admin.catalogue.declaration_preview` | POST `…/declarations/:id/preview` | `previewed` → SA-05e (summary `previewId`) | SA-05c, `form: 'preview'`, `typed` |
| `admin.catalogue.declaration_publish` | POST `…/declarations/:id/publish` | `published` → SA-05f (summary `publicationId`) | **SA-05e**: `cat.admin_preview` with the posted `previewId` (parsed as a `prv_` id), only when that preview is a declaration preview of this declaration; `typed`. Otherwise the refusal's own error page (D-U5-01). |
| `admin.catalogue.baseline` | GET SA-05d | `readReceipt(baselineReceipts(m))` | — |
| `admin.catalogue.baseline_edit` | POST `…/baselines/:id` | `baseline` → SA-05d | SA-05d, `form: 'edit'`, `typed` (as before) |
| `admin.catalogue.baseline_preview` | POST `…/baselines/:id/preview` | `previewed` → SA-05e | SA-05d, `form: 'preview'` |
| `admin.catalogue.baseline_publish` | POST `…/baselines/:id/publish` | `published` → SA-05f | SA-05e of the values' current preview (as before), now with `typed`; SA-05d when none |
| `admin.catalogue.preview` | GET SA-05e | `readReceipt(previewReceipts(m))` | — |
| `admin.catalogue.publication` | GET SA-05f | `readReceipt(publicationReceipts(m))` | — |
| `admin.launch.offering` | GET SA-05h | `loadLaunchPage` (receipt inside) | — |
| `admin.launch.plan_form` (new) | GET `…/offerings/:offeringId/launch/plan` | `loadPlanPage` | — |
| `admin.launch.decision` (new) | GET `…/offerings/:offeringId/launch/decide/:kind`, `kind` ∈ `LAUNCH_DECISION_PAGE_KINDS` (other kinds: 404 by parameter validation) | `loadLaunchDecisionPage` | — |
| `admin.launch.plan` | POST `…/launch-plans` | `plan` → SA-05h | `planRefusalPage` (SA-05i, typed, posted revisions) |
| `admin.launch.approve` | POST `…/launch` | `launched` → SA-05h | `launchDecisionRefusalPage(ctx, 'launch', e)` |
| `admin.launch.expand` | POST `…/launch-scope` | `expanded` → SA-05h | `launchDecisionRefusalPage(ctx, 'expand', e)` |

Unchanged (carried, plain `?done=`): `admin.catalogue.recheck` (`recheck`), `admin.catalogue.retire` (`retired`),
`admin.catalogue.declaration_retire` (`retired_draft`), `admin.launch.suspend` / `treatment` / `lift` / `withdraw`
(`suspended`, `treatment`, `lifted`, `withdrawn`); also the impact routes (WP-13) and `admin.launch.index`,
`admin.public_site.status`.

Accounts: U4 had already wired every account route in `src/apps/staff/identity.ts` (receipt locations `created`,
`approved`, `declined`, `activated`, `suspended`, `restored`/`restore_requested`; typed reason on refusal; duties
through `optionalView`). Nothing was left for U5; `identity.ts` is not changed by U5.

All POST answers go through the existing `answer` of `shared.ts`: an unknown outcome is the operation status page
(CMP-13); `unauthenticated`, `not_found_or_forbidden`, `maintenance` and `unavailable_dependency` reach the shell (B-03
neutral wording); every other refusal re-renders. Optional reads stay inside the U2–U4 loaders (`optionalView`); U5
adds none.

## 3. Inventory and `resultHrefOf`

- Inventory: 2 new GET entries (`D129`, `D130`), surface `admin`, action `catalogue.read_admin`, `who: ['superadmin']`.
  Total entries 270 → 272 at the time of writing (other lanes may add more). The launch area is 4 GET + 7 POST.
- `resultHrefOf`: the operation status page (`/admin/operations/:key`) now links an accepted catalogue or launch result
  to its page. `resultLabelOf` is surface-independent, so an offering result on a TA or operator status page would read
  "Recorded result: Offering" without a link; no TA or operator command returns that resource (F-U5-02).

## 4. Guide (`docs/extending/new-service.md`)

Step 6: preview on the declaration page under "Publication", then publish from the publication decision page
(`/admin/catalogue/previews/:previewId`); the declaration page has no publication form. Step 7: "Record the launch plan"
on "Readiness and launch" opens `…/launch/plan`. Step 8: "Approve the launch" opens `…/launch/decide/launch`; expansion is
`…/launch/decide/expand`; suspension and lifting stay on "Readiness and launch". Step titles unchanged.

## 5. Helper swaps in the launch files (D-U3-07, D-U3-08)

| Local helper | Now | Equivalence |
|---|---|---|
| `launchDocument` (`launch.ts`) | Removed; the four call sites call `surfacePage(ctx, 'admin', { …, current: LAUNCH_HOME })`. | Same `signedInPage` arguments. |
| `accountName` (`launch.ts`) | Removed; `launch.ts` and `launch-decision.ts` import `accountName` from `shared.ts`. | Identical body. |
| `reasonInput` (`launch.ts`) | Removed; SA-05i uses `reasonField({ id: 'plan-reason', value, error })`. | Same id, name, label, hint, maxlength, typed value and error. The textarea has 2 rows instead of 3 (F-U5-05). |
| `evidenceInputs` (`launch.ts`) | Kept as a fieldset wrapper (legend, optional marker, hint); its three fields are now `evidenceFields({ id, optional, values, errors })`. The local `EVIDENCE_LABELS` copy is removed. | Same ids, names, labels, hints, kinds and order; errors mapped from field ids to field names. The legend ("Readiness evidence for this scope", "Evidence for this plan") stays, as the design names it. |
| `launchProblems` (`launch.ts`) | **Kept.** | Not equivalent to `refusalProblems` (F-U5-04). |
| Crumbs | SA-05h: `[OFFERINGS_CRUMB]` (as SA-05b, its sibling tab). SA-05i and SA-05j: `offeringLaunchCrumbs` = `offeringCrumbs(offering)` + "Readiness and launch" → SA-05h. SA-05g overview unchanged ("Offerings & launch"). | U2's pattern "Offerings / [offering]"; the task pages keep their link to SA-05h (design §3.9, §3.10). |

`launch-pages.test.ts` (36), `catalogue-pages.test.ts` (31) and `accounts-pages.test.ts` (35) pass unchanged after the
swaps.

## 6. BFF test (`test/unit/bff-catalogue.test.ts`)

A staff BFF (sign-in, self, catalogue, identity and operation-lookup routes) in front of a scripted Core; real CSRF,
operation keys and session cookie. Tests: the plan page and both decision kinds are served, another kind is 404; a
refused plan (`input_invalid`, `timezone_invalid` on one measure) re-renders SA-05i with every typed value (text,
blank, radios, checkbox, select, unlisted typed owner, operating textarea, evidence, reason), the summary links the
field, and the page reads `ops.launch_offering` and the two owner lists again; an accepted plan answers
`…/launch?done=plan&op=<the form's key>` and SA-05h then shows "Launch plan recorded" from `core.operation`, while a
plain `?done=plan` reads no operation and claims nothing; a refused launch decision re-renders SA-05j with the typed
values; a refused declaration publication re-renders SA-05e (only `cat.admin_preview` with the posted `previewId` is
read) with every typed value and no "Nothing changed"; a publication naming another declaration's preview or no valid
preview gets the error page; an accepted declaration publication answers `…/publications/:id?done=published&op=<key>`;
a refused account action (validation and `control_blocked`) keeps the typed reason in that action's form; an accepted
suspension answers `…?done=suspended&op=<key>`.

## 7. Carried-form test (`test/unit/web/carried-forms-admin.test.ts`, design §8.2)

The list (by action path): `…/offerings/:offeringId/recheck`, `…/retire` (SA-05b); `…/declarations/:declarationId/retire-draft`
(SA-05c); `…/suspend`, `…/existing-work-treatment`, `…/lift-suspension`, `…/withdraw` (SA-05h); and U4's
`CARRIED_ACCOUNT_FORMS` (`reset-credentials`, `elevation`, `accounting-grant`, `/admin/support-view`) on SA-06c. Tests:
each entry is an inventory POST route with that command; each rebuilt page, rendered in the states where the form
applies (not launched with an assessment; a draft; launched; suspended with a treatment and a plan; withdrawn with
continuing work; an active operator), renders the form posting with its own route's token; each route answers an
accepted command with its plain `?done=<code>` (support view: `/account`) and no `op=`. WP-13 and WP-15 remove entries
when they rebuild the forms.

## 8. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | U5 files clean. Errors only in other lanes' in-progress travel-agent files (`scripts/dev/gallery/applications.ts`, `scripts/dev/gallery/ta-home.ts`, `src/apps/shared/pages/documents.ts`, `test/unit/web/applications-list.test.ts`, `test/unit/web/ta-home.test.ts`; earlier `src/apps/shared/core/ta-applications-list.ts`). |
| `npx eslint --max-warnings=0` on the 12 changed or new files | Clean. |
| `node --test` bff, bff-catalogue, routes, carried-forms-admin, catalogue-pages, launch-pages, accounts-pages | 146 of 146 pass. |
| `node --test "test/static/**/*.test.ts"` | 73 of 74. The failure is `route_without_id` in `src/apps/shared/views/ta.ts:190, 224` (another lane's in-progress file). |
| `node --test test/unit/web/status-pages.test.ts` | 19 of 21. The 2 failures are the pins of the old `resultHrefOf` map (F-U5-01). |
| `node --test "test/unit/**/*.test.ts"` (whole unit tree) | Second run: 1106 pass, 2 fail (the status-page pins). First run also failed `individual-intake.test.ts:258` (another lane's in-progress file). |
| System tests | See §8.1. |

### 8.1 System tests (`TMPDIR=/tmp/w2u5`, concurrency 1)

Run: `new-service`, `ported-pages`, `flows`, `browser` and every system test that reaches `/admin/catalogue`,
`/admin/launch` or `/admin/accounts` (`case-views`, `case-work`, `core-pages`, `lifecycle`, `refusals`, `intake-pages`,
`web-shell`, `no-monolith`, `payments-views`, `sign-in-states`): 82 tests, 51 pass, 31 fail.

- Pass, every SuperAdmin catalogue, launch and account test: `new-service` (the documented procedure end to end through
  SA-05e, SA-05i, SA-05j, with the receipt locations and the refused launch keeping its typed values); `ported-pages`
  ("the catalogue through staff" including the publication from the preview page and the suspension from launch
  control, "a SuperAdmin through staff", "the audit record behind"); `flows` ("a new operator"); `browser` ("sign in …
  then read the accounts and catalogue pages"); `web-shell`, `no-monolith`, `sign-in-states`.
- Fail, all on travel-agent pages that other lanes are rebuilding now, or cascades of them: the individual intake form
  is missing at `/ta/groups/:groupId/intake/individual` (`core-pages`, `intake-pages`, `browser` edge test, and the
  setup of `case-views`, `case-work`, `payments-views`, `refusals`, which then fail as whole files); the form passport
  scan never runs (`lifecycle` intake background work, `intake-pages`); `/ta/search` answers 500 (`flows` landing and
  navigation); tests that read ids from those failed steps (`core-pages` empty application ids, the `browser` support
  view test that needs the travel agent test first). None touches a file of U5, U2, U3 or U4. Not fixed (lane rule).

## 9. Items for the architect

| # | Item | Proposal |
|---|---|---|
| 1 | `test/unit/web/status-pages.test.ts` pins the old map (F-U5-01). | Line 295–297: use a kind still outside the map for "a kind without a page", for example `{ type: 'intake_incident', id: 'iin_X' }`. Line 338: `[{ type: 'offering', id: 'off_X' }, { admin: '/admin/catalogue/offerings/off_X' }]`, and add `[{ type: 'catalogue_admin' }, { admin: '/admin/catalogue' }]`. |
| 2 | `DESIGN.md` | The SA-05 page list gains SA-05i `…/launch/plan` and SA-05j `…/launch/decide/:kind`; the receipt codes per host page (§2 above; accounts per U4); carried forms keep `?done=` and are listed in `test/unit/web/carried-forms-admin.test.ts`; pages inside one offering use "Offerings / [offering]" crumbs, the launch task pages add "Readiness and launch". |
| 3 | CSS | None needed by U5. |
| 4 | Gallery | No U5 module. |
| 5 | Copy | "Offering" and "Catalogue" result labels on the operation status page are draft copy (CR-09). |

## 10. Decisions and findings

| Id | Rank | Item | Scenario | Disposition |
|---|---|---|---|---|
| D-U5-01 | — | A declaration-publish refusal whose posted `previewId` is not a declaration preview of this declaration gets the refusal's own error page (`throw new TmError(category, code)`, the pattern of the impact routes in the same file). | The declaration page no longer renders a publication refusal, so falling back to it would hide the refusal. Only a hand-made request reaches this path. | Done; tested. |
| D-U5-02 | — | The baseline-publish refusal keeps re-reading the values' current preview (`b.row.preview_id`), not the posted `previewId`. | Unchanged behaviour; the two differ only when another SuperAdmin previewed the same values meanwhile, and then the current preview is the one to decide. | Kept. |
| F-U5-01 | P0 (integration) | `status-pages.test.ts:295-297, 338` fail after the required `resultHrefOf` change. | Integrating U5 without item 1 fails `npm run test:ui`. | Architect applies item 1 (the file is outside U5's write set). |
| F-U5-02 | P2 | `resultLabelOf` names "Offering"/"Catalogue" on every surface. | A TA or operator status page of an offering result would show the label without a link; no TA or operator command returns that resource. | Parked. |
| F-U5-03 | P2 | `launchPage` still accepts `form: 'plan' \| 'approve' \| 'expand'` and shows that refusal at the top (D-U3-12); no route passes those forms now. | Dead branch only. | Remove when the launch file is next changed (outside U5's helper-only edit). |
| F-U5-04 | P2 | `launchProblems` was not swapped for `refusalProblems`. | `refusalProblems` has no page-specific sentences (`DECISION_MESSAGES`, the plan's `input_invalid` sentence), resolves fields from a static record (the plan's `m.<code>.*` targets are computed), keys problems by field name not id, and lacks `timezone_invalid`/`not_active_staff` field sentences. A swap changes wording. | Kept; a shared helper needs those options first (U2 owner). |
| F-U5-05 | P2 | The plan reason textarea now has 2 rows (shared `reasonField`) instead of 3. | Visual only. | Accept, or add a `rows` option to `reasonField`. |
| F-U5-06 | P2 | SA-05g's crumb reads "Offerings & launch" for `/admin/catalogue`; the offering pages read "Offerings" for the same address. | Two names for one address in crumbs. | Architect decides (SA-05a has no crumb). |
