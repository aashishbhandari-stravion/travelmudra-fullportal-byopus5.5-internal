# WP-02 U2 notes: SuperAdmin catalogue pages (SA-05a to SA-05f, SA-05k)

Unit U2 of WP-02. Author: the U2 engineer, 12–13 October 2026. Input for the architect's integration, the gallery
registration, the U5 wiring and the `DESIGN.md` update. U2 commits nothing. Base: lane commit e9e96e3. Binding
inputs: `WP-02-design.md` §1.2–1.6, §2, §3.0–3.6, §3.11, §3.14, §3.15, §5, §6, §8.1 (U2 row), §8.3; `WP-02.md` §3 and
§4 (B-02, B-03, B-06 govern).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/catalogue/admin.ts` | SA-05a `indexPage`, SA-05b `offeringPage`, SA-05c `declarationPage`; receipt builders `indexReceipts()`, `offeringReceipts(m)`, `declarationReceipts(m)`. `itemTable`, `itemOverview` kept. |
| `src/apps/staff/catalogue/baselines.ts` | SA-05d `baselinePage`, SA-05e `previewPage` (on `decisionPage`), SA-05f `publicationPage`; `baselineReceipts`, `previewReceipts`, `publicationReceipts`; `previewFacts`, `estimateText`; `priceChange` kept. |
| `src/apps/staff/catalogue/editor.ts` | `editorFields` takes field problems (5th argument); new `editorFieldRefs`, `rupeesText`, `processText`. |
| `src/apps/staff/catalogue/shared.ts` | Additions only (§4). Every existing export kept. |
| `src/apps/staff/catalogue/public-site.ts` | SA-05k; `BLOCKER_TEXT` (with `public_copy_unapproved`), `blockerText`. |
| `scripts/dev/gallery/offerings.ts` (new) | `offeringsGalleryPages()`: 20 admin pages (§6). Not registered. |
| `test/unit/web/catalogue-pages.test.ts` (new) | 31 tests. |

No route, form action, hidden input or field name changed. Every renderer keeps its old call signature, so the current
`routes.ts` compiles and works unchanged.

## 2. Pages, sections and states

| Page | Order and states |
|---|---|
| SA-05a Offerings | Receipt; header h1 "Offerings", lead, "Read at", secondary link "Impact review"; impact attention callout (rows with open items); section Offerings (table: Offering, Definition with binding badge, Business values, Launch and admission, Launch plan, Existing work) + disclosure "Create an offering" (open when no offering or refused; "Create a country first" when no country); section Countries (table with per-row List/Unlist confirm disclosure) + disclosure "Add a country". Launch null → "Launch state unavailable"; named audience without count → "count unavailable"; plan completeness → value + "Recorded when the plan was saved" (B-07 shape). |
| SA-05b Definition and values | Receipt; header (breadcrumb Offerings, Synthetic badge, Country, Who files, Service code, Offering reference, "Read at"); `statusFacts` Catalogue/Launch/Suspension/Withdrawal (launch null → Unavailable); `objectTabs` (Readiness tab only when that page is registered); retired notice; `actionPanel` (first applicable fact in the design order, the rest "Also needed"; published and nothing open → "Next: readiness and launch"); h2 "Definition and binding" (head summary, items, versions, draft form or "A draft is open"); h2 "Effective business values" (published head, versions, one editor per target or "Continue the draft"); Publications; Impact on existing work + carried recheck; Readiness and launch summary; carried Retire. |
| SA-05c Declaration version | Receipt; header (status, Head badge, Support basis, Digest, "Read at"); status notice (draft, planning record, discarded); What this version declares; Items; Owner approvals (table + form in design order, nothing preselected); Bindings (+ bind form); Publication (preview form; "Open the publication decision" when a current preview exists; out-of-date line); carried Discard; Declared content JSON. **No publish form.** |
| SA-05d Business values version | Receipt; header (For declaration link, price, estimate "5 to 12 calendar days", "Read at"); "Previewed" callout with "Open the publication decision" (head declaration only); "Published with its declaration" callout with the declaration link (not head); editor with typed values, stale comparison and optional reason; preview form (head only); read-only Values when published or superseded. |
| SA-05e Publication decision | `decisionPage` id `publish`: receipt, header ("Publish business values: [offering]" / "Publish a declaration version: [offering]", "Preview computed", "Read at"), Scope, Evidence titled "Price and impact preview", Effect (changes, unchanged, existing-work facts, class table, affected list in a labelled `.scroll-region`), Your decision (continuation choices, price correction for values only, evidence, reason `_reason`), visible review, submit + Cancel. Closed states: "This preview is out of date" (+ "Preview again" form for the same subject), "No longer the current preview", "Already published". |
| SA-05f Publication record | Receipt; h1 "Publication no. [n]: [offering]"; record list with IST times (no UTC); "Before and after" code region. |
| SA-05k Public site | h1, lead, "Read at"; Published content with units ("14 pages", "1 country"); Release blockers (warning callout, one sentence each, unknown → "Release blocker [code]"; none → "No release blocker in the content."); "No public content is loaded in this installation." for `site = null`. No command. |

## 3. Amendments

| Item | How it is met |
|---|---|
| B-02 receipts | Each page exports its `ReceiptExpectation` set built from its own read: resource `offering` with the page's offering id (country and listing: `catalogue_admin`, no id) and the command's own summary fields (country: `countryId` and no `revision`; listing: `countryId` + numeric `revision`; offering: own `offeringId`, no `revision`; draft: own `declarationId` + `versionNo`; approval: own `declarationId` + `ownerApprovalId`; bound: `bindingId`; baseline: own `baselineId` + numeric `revision`; previewed: own `previewId`; published: own `publicationId` + `assessmentId`). Recorded facts come only from the summary (draft version number, the assessment link); records are selected by returned ids (country); everything read now is "Current …". Unchecked → neutral receipt. Carried codes (`recheck`, `retired`, `retired_draft`) keep the one-line flash. |
| B-03 | No optional read on these pages except `readReceipt` (through `optionalView`). "Nothing was published." appears only after a `preview_stale` refusal. |
| B-06 | SA-05e shows no version numbers, no governing tuples, no applicability counts. A summary key that is absent or malformed → "Unavailable" (never 0 or ₹0). `audienceSize` null → "count unavailable". Stale comparisons show the reader's unsent input beside the current value only (listing; draft JSON vs open draft; approval kind vs status and approval count; each changed business value). |
| D-W02-01 | Declaration publish form only on SA-05e: action `/admin/catalogue/declarations/:id/publish`, hidden `previewId`, `baselineId` (when the preview has values), `_rev.offering`. Proven end to end with a scratch copy of the system test (§7). |
| F-W02-03 | Every WP-02 form re-renders with the typed values (JSON body, editor values, approval fields and checked items, policy and price-correction choices, evidence, reason) and its own error summary linked to fields in form order. |

## 4. `shared.ts` exports added (for U3 and others)

`surfacePage` now takes `receiptTitle` and `restorePath`. `reasonField` takes `value`, `error`. `evidenceFields` takes
`values`, `errors`, `hint`. `continuationChoices` takes `values`, `errors`. New: `evidenceKindLabel`, `OFFERINGS_CRUMB`,
`offeringCrumbs(offering)`, `CARRIED_DONE_MESSAGES`, `FormFieldRef`, `Problems`, `NO_PROBLEMS`,
`refusalProblems(error, fields, codeFields)` (error summary items + per-field messages), `receiptBlock(read, {recorded,
current})`, `summaryText(read, key)`, `LaunchSummaryFacts`, `launchText`, `audienceText`, `planText` (stored plan
completeness with "Recorded when the plan was saved").

## 5. Wiring for U5 (routes.ts only)

1. GET handlers: read the model, then `readReceipt(ctx, <page>Receipts(model))` and pass `{ receipt }`: index
   (`indexReceipts()`), offering, declaration, baseline, preview, publication.
2. POST success locations via `receiptLocation(path, code, ctx.operationKey)`: country and listing → `/admin/catalogue`
   (`country`, `listing`); offering create → SA-05b (`offering`); declaration draft → SA-05c (`declaration`); owner
   approval, bind → SA-05c (`approval`, `bound`); both previews → SA-05e (`previewed`); both publishes → SA-05f
   (`published`); baseline create and edit → SA-05d (`baseline`). Carried routes (recheck, retire, retire-draft) keep
   plain `?done=`.
3. Refusal re-renders pass `typed: ctx.fields`: `indexPage(..., { error, form, typed, countryId: ctx.params.countryId })`
   for listing; `offeringPage(..., { error, form: 'declaration', typed })`; `declarationPage(..., { error, form, typed })`
   for approval and preview; `previewPage(..., { error, typed })` for the baseline publish.
4. `admin.catalogue.declaration_publish` refusal re-renders SA-05e: read `cat.admin_preview` with
   `ctx.fields.previewId` (parse as a `prv_` id; fall back to the declaration page when invalid).
5. Renderers set `restorePath` to their GET page whenever `error` is passed; no route work needed.
6. System pins (design §8.3): `new-service.test.ts:102` and `ported-pages.test.ts:300-307` fail until changed
   (publish from SA-05e). `ported-pages` `?done=…$` regexes need `&op=`. `/Price and impact preview/` still matches.

## 6. Gallery, CSS and other items for the architect

| # | Rank | Item | Proposal |
|---|---|---|---|
| 1 | — | Register `...offeringsGalleryPages()` in `scripts/dev/gallery-pages.ts`. | 20 pages: offerings (receipt), -empty, -refused, -listing-stale, offering, -new (receipt), -draft-refused, -retired, declaration, -approval-refused, business-values-stale, -published, publish-values, publish-declaration (receipt), publish-unavailable-counts, publish-out-of-date, publish-refused, publication (receipt), public-site, public-site-none. |
| 2 | P2 | CSS for the affected-applications region (class `scroll-region`, `role="region"`, labelled). Without it the list shows in full (no overflow). | `.scroll-region { max-block-size: 28rem; overflow-y: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-m); }` and a focus-visible ring with `--focus-ring`. |
| 3 | P2 | `textareaField` has no `spellcheck` option (design §6 wants `spellcheck="false"` on the JSON field). | Add the option in `forms.ts` (components owner); then set it on `decl-body`. |
| 4 | P2 | Shell tab member is "Catalogue"; the page h1 is now "Offerings". | Rename the member label in `SURFACE_CONFIG` (`shell.ts`). D-W02-11 "Impact review" tab is still open; SA-05a keeps a secondary header link to it meanwhile. |
| 5 | P2 | The `bound` result summary carries only `bindingId`: the receipt check is the offering plus the presence of a binding id, not this declaration. | Accept, or add `declarationId` to the bind result (catalogue module, separate task). |
| 6 | P2 | `cat.admin_declaration.approvals` rows carry no id, so the approval receipt cannot name the recorded approval (current status and count only). | Accept (B-02). |
| 7 | — | All copy in this unit is draft copy (CR-09). | Add to the copy-approval list. |
| 8 | — | `DESIGN.md`: catalogue page notes (one publication decision per preview kind on SA-05e; stored plan completeness wording). | Architect's DESIGN.md pass. |

## 7. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | My files clean. Errors only in other units' in-progress files (`test/unit/web/accounts-pages.test.ts`, `scripts/dev/gallery/accounts.ts`) at one point; gone from my scope. |
| `npx eslint` on the 7 files | Clean. |
| `node --test test/unit/web/catalogue-pages.test.ts test/unit/catalogue.test.ts` | 31/31 and 62/62 together. |
| `npm run test:ui` | 952 of 953 pass. The one failure is `test/unit/web/wp03-components.test.ts`, a file another unit renamed during the run (not present afterwards). |
| System: `ported-pages`, `new-service`, `browser` (`TMPDIR=/tmp/w2u2`, concurrency 1) | 16 of 18 pass. The 2 failures are the §8.3 pins of item 6 above. |
| Scratch system check (copy of the ported-pages declaration test outside the repository, publish from SA-05e, refusal then acceptance, publication page renders) | Pass. |
| Scratch browser sweep of the 20 gallery pages (1440 and 390 px light and dark with axe WCAG 2.2 A/AA + best practice; 360 and 320 px overflow; CSP; script errors) | No finding after one fix (duplicate region name on SA-05f). |
