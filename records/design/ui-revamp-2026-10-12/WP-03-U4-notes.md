# WP-03 U4 notes: task list, sections, documents, document detail

Unit U4 of WP-03. Implementer: Claude (Opus 5.5) subagent, 13 October 2026. Base: lane commit e9e96e3 with the
uncommitted WP-02 and WP-03 U0 work. Nothing is committed; the architect integrates. Binding inputs: `WP-03-design.md`
§1, §2.11, §2.12, §2.14, §2.15, §4 (all), §7, §9.1 (U4 row), §9.3; `WP-03.md` §3 and §4.1 (C-01, C-03, C-04, C-07,
C-09, C-10); `WP-03-acceptance.md` A43, A59 to A83, A177, A178; `WP-03-U0-notes.md` §2 and §4. Coordinator change
during the work: the group part's "Change the travel dates" links to `/ta/groups/:groupId/travel-dates` (no `#dates`).

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/pages/prepare.ts` (new) | Renderers of TA-09t `preparePage`, TA-09i `identityPage`, TA-09d `detailsPage`, TA-09f `documentsPage`, TA-09u `existingFilesPage`; the closed blocker table `BLOCKER_SECTIONS`, `OFFERING_BLOCKERS`, `readSections`; receipt expectations `prepareReceiptExpectations`, `documentsReceiptExpectations`; passport texts. |
| `src/apps/shared/core/prepare-routes.ts` (new) | GET routes and the re-render functions `renderPrepare`, `renderIdentity`, `renderDetails`, `renderDocuments`, `renderExisting`. |
| `src/apps/edge/core/prepare-forms.ts` (new) | POST `ta.applications.edit` and `ta.applications.correct_identity` (moved; command input as before except C-04; re-render on the section page; receipt on TA-09t). |
| `src/apps/edge/intake/application-documents.ts` | Re-render targets and receipts only: upload and replace refusals (edge or Core) re-render TA-09f; association refusals re-render TA-09u; accepted answers go to TA-09f with `document`, `replaced`, `associated`. Paths, fields, multipart limits and command inputs unchanged. |
| `src/apps/shared/core/documents.ts` | Exports `EVIDENCE_MAX_BYTES`, `requirementMaxBytes`, `requirementLimit`, `narrowedByRequirement`. `documentsSection` unchanged (TA-07 and the operator case page still use it). |
| `src/apps/shared/pages/documents.ts` | Version page only: separate status rows, action panel, breadcrumb by association and change right, receipts, stale comparison, `id="resolve-form"`; `documentTitle` exported. Group documents page and queue page unchanged. |
| `src/apps/shared/ta-documents.ts` | `VersionContext.canChange` from Core's change evaluation; receipt read; read time. |
| `src/apps/edge/documents.ts` | Decision answers: `receiptLocation('/ta/documents/<id>', 'resolved' | 'classified', key)`; refusal status from `HTTP_STATUS_BY_CATEGORY`. |
| `scripts/dev/gallery/prepare.ts`, `scripts/dev/gallery/document-detail.ts` (new) | 8 + 4 gallery pages; not registered. |
| `test/unit/web/prepare-pages.test.ts`, `test/unit/web/document-detail.test.ts`, `test/unit/bff-documents.test.ts` (new) | 38 + 10 + 8 tests. |

## 2. Routes for U7 (not registered, not in the inventory)

Export `prepareReadRoutes()` (all five GET routes, edge), `prepareTaskListRoute()` (the support-view GET, also staff),
`prepareSectionRoutes()` (the four section GETs, edge only), `prepareFormRoutes()` (the two POSTs, edge). Remove the
old `ta.applications.edit` and `ta.applications.correct_identity` from `src/apps/edge/core/routes.ts` when
registering `prepareFormRoutes()` (same ids, paths, actions and commands; the inventory rows T21 and T22 stay).

| Route id | M | Path | Action | Support view (staff) |
|---|---|---|---|---|
| `ta.applications.prepare` | GET | `/ta/applications/:applicationId/prepare` | `application.read` | yes |
| `ta.applications.identity_form` | GET | `/ta/applications/:applicationId/correct-identity` | `application.correct_identity` | no |
| `ta.applications.details_form` | GET | `/ta/applications/:applicationId/edit` | `application.edit_draft` | no |
| `ta.applications.documents_form` | GET | `/ta/applications/:applicationId/documents` | `document.upload` | no |
| `ta.applications.documents_existing` | GET | `/ta/applications/:applicationId/documents/existing/:requirementType` | `document.associate` | no |

`requirementType` is parsed with `^[a-z][a-z0-9_]{1,39}$`; another shape, or a type the application does not declare,
is the uniform not-found page.

## 3. Amendments

- **C-01.** Each replaceable row (association status `proposed` or `positive`, read from
  `doc.application_evidence.associations` by the row's `associationId`) carries `_rev.association` of exactly that
  association, the hidden `requirementType` and one `file`. BFF test: the form names revision 7; the post reaches Core
  as `doc.replace_version` with `expectedRevisions.association = 7` and the row's version; accepted → 303 to
  `…/documents?done=replaced&op=<key>`; Core's `stale_revision` → 409 with the stale comparison and a fresh form naming
  the current revision (8).
- **C-04.** Core check first (scratch DB test against `core.correct_identity`, not kept in the repository; it imports
  the Core test kit): a change set with all six fields, five of them unchanged (passport number and issuing country in
  lower case), is accepted and records only the changed surname; the identical envelope after acceptance replays
  (`replayed: true`, same summary); the same key with changed content is `conflict_operation_key`/`operation_key_reused`;
  the old diff mapping after acceptance sends `{}` under the same key and gets the same conflict (the R-04 defect);
  a fresh key with no change is `correction_no_change`. Result: Core accepts unchanged fields, so the handler maps
  `identityChangesOf(fields)` from the posted values only (every non-empty field, country codes upper case). BFF test
  (fails with the old diff mapping, verified, passes now): two posts of one form send identical inputs although the
  saved identity changed in between. Proposal: keep the scratch check as a Core test in
  `test/core/groups-drafts.test.ts` (outside this unit).
- **C-09.** Receipt "Replacement file received": Document; "Current state of the new file" (from the returned
  association); "Current file in use for this application" ("The earlier file, until the new file is accepted");
  "Current status of this document". The row keeps the earlier file and says "A new file is being checked. This file
  stays in use until the new file is accepted."; the section "Other files sent for these documents" shows each other
  association of the application with its state (a replacement being checked, one not accepted with its reason, one no
  longer used). Tests: a failed replacement (rejected association listed with its reason, earlier file still accepted),
  a version shared by two applications (each page reads its own association state).
- **C-10.** No whole-form refusal: a requirement-narrowed refusal is the refusal of that row's form only, and a
  `validity_failed` row with `format_not_accepted_by_offering` reads "Not valid for this application: a photo must be
  JPEG or PNG, up to 2 MB" with the forms still offered (test).
- **C-03.** Receipts name a result only for the expected resource id and summary: `saved`/`corrected` need this
  application and a `cor_` correction id; `document`/`replaced`/`associated` need `das_` and `dov_` ids; document facts
  are selected by the returned association and version ids; later reads are "Current".
- **C-07.** No outage text claims that nothing changed; "Nothing changed" appears only after Core's refusal.

## 4. States and rules worth knowing

- Task states come only from Core: submission blockers through `BLOCKER_SECTIONS`; evidence statuses for the
  Documents, Document checks and Identity parts (also on a submitted case, where the other parts read "Not checked
  here"). A part's default state is replaced by its first fact; further facts keep the most demanding state.
- `travel_date_recheck_pending` maps to "Being checked" (TravelMudra runs the recheck; the docket says nothing is
  needed), not "Needs your input" as design §4.2 row 1 says. `population_out_of_scope` maps to "Cannot change" (U0-02).
  "Document checks" uses "Needs evidence" with the count of documents (U0-02).
- Section pages show their form only while `correct.allowed`. `awaiting_formal_return` and
  `hold_assistance_in_progress` show their own notice; after a refusal the typed values that differ from the saved
  ones are listed read only under "Your unsent changes" (no form, files never kept).
- After `stale_revision` the section form shows the current values with a fresh revision; the typed values are in the
  comparison only, so a resend never overwrites the other change.
- Evidence checkboxes start unchecked; a refusal restores the posted choice; a stale refusal clears it. The
  attestation of the DOC resolve form is never checked.
- Passport: every passport input and row states "A passport has two pages to send: …" and "Send one file that holds
  the front page and the back page."; label "Passport: one file with both pages"; one input only (DEP-2). The design
  text said "one PDF"; the page says "one file" because the requirement also accepts JPEG and PNG and the page states no
  format of its own.
- Passport number (TA-09i): hint and refusal message state both Indian shapes as text; `src/workers/passport-number.ts`
  is not on this branch, and a drift-guard test fails when it appears so the text is switched to it (TA-09-R2 partly
  met until DEP-1).
- TA-09f `unassociated` row: whose step is "You" with "Use a file already in this group" and an upload form (design §4.7
  says TravelMudra, no action). Reason: Core proposes associations only through the three person commands and the
  intake proposal (`propose` call sites), so nothing links such a file unless a person does.
- DOC: rows Safety check, Details read, What it is, For this application (with context), Version, Stored file; no
  header badge; action panel per state; breadcrumb Applications › applicant › Documents (TA-09f while the travel agent
  may change the application, else `TA-07#documents`), or Groups › Group documents; rail current `/ta/applications`
  with an application context, else `/ta/groups`.

## 5. Needs of other units and the architect (not changed here)

| Id | Item |
|---|---|
| N-1 | U7: register the routes of §2; inventory rows; staff support-view registration of `ta.applications.prepare`. |
| N-2 | Gallery: add `prepareGalleryPages()` (`scripts/dev/gallery/prepare.ts`) and `documentDetailGalleryPages()` (`scripts/dev/gallery/document-detail.ts`) to `galleryPages()`. Scratch sweep of the 12 pages (the checks of `test/ui/gallery.test.ts`: 1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice; 360 and 320 px overflow; CSP; script errors): 104 of 104 pass, no minor or moderate axe finding after one fix (duplicate form landmark names on TA-09u). |
| N-3 | CSS and components: none needed. |
| N-4 | `DESIGN.md`: the document page states each fact on its own row (no combined badge) with a "Next action" panel; the task list's blocker table and "Other items that stop submission"; "Your unsent changes" after a hand-over mid-edit. |
| N-5 | U3: TA-07 links "Change the application" to `/ta/applications/:id/prepare` and "Add or replace documents" to `/ta/applications/:id/documents`; TA-07's `applicationAgain` state `documents` is no longer used by the document routes. |
| N-6 | System test pins that change with this unit (§9.3 and one more): `test/system/intake-pages.test.ts:177` (upload `Location` is now `/ta/applications/:id/documents?done=document&op=…`), `:188-195` (replace answers the receipt location; the form is on TA-09f); `test/system/ta-documents-originals.test.ts:150-156` (the refused PDF photo re-renders TA-09f: `#upload-photo`, summary link `#upload-photo`, no `#document-requirement`); `test/system/document-decisions.test.ts:180` (`done.location` is `${path}?done=resolved&op=…`). |

## 6. Findings

| Id | Rank | Finding (fact) | Scenario | Proposal |
|---|---|---|---|---|
| U4-F1 | P1 | `doc.replace_version` replaces only a `proposed` or `positive` association (`src/modules/documents/commands/associate.ts`, status filter), and a recorded `conflict` association stays visible beside a positive one (`src/modules/documents/evidence.ts` header). Design §4.7 offers "Replace this file" on a conflict row. | A travel agent uploads another person's passport by mistake (recorded conflict). The page can offer only a new upload; the conflict stays, so the row and submission keep the conflict until an identity correction, which is the wrong remedy for a wrong file. | The page offers the replacement only where Core accepts it (done). Documents module task: let a person replace a `conflict` association (or revoke it). |
| U4-F2 | P2 | The receipt codes `document`, `replaced` and `associated` share one summary shape, as do `saved`/`corrected` and `resolved`/`classified`. | An edited address `done=replaced&op=<an upload's key>` reads "Replacement file received" for an upload. The facts shown are still selected by the returned ids, so no fact is wrong. | Park. A command name in the operation read would close it. |

## 6a. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (final run). Errors seen earlier during the work were in other units' in-progress files only (`test/unit/web/application-workspace.test.ts`, `scripts/dev/gallery/applications.ts`, `scripts/dev/gallery/ta-home.ts`, `test/unit/web/applications-list.test.ts`). |
| `npx eslint --max-warnings=0` on the 13 files of this unit | Clean. |
| `node --test test/unit/web/prepare-pages.test.ts test/unit/web/document-detail.test.ts test/unit/bff-documents.test.ts test/unit/bff.test.ts` | 72 of 72 pass (56 new). |
| `node --test "test/unit/**/*.test.ts"` | 1163 of 1165 pass; failures outside this unit: `seo-record.test.ts` (renderer hash record stale) and `web/individual-intake.test.ts:264` (U5, two-letter number). |
| `node --test "test/static/**/*.test.ts"` | 74 of 74 pass. |
| System `ta-documents-originals`, `intake-pages` (own `TMPDIR`) | 3 of 15 pass. Every failure starts at "no form posting to `/ta/groups/:id/intake/individual`" on `/intake/new` or the missing one-applicant link (U5's in-progress move to TA-09c, a §9.3 pin that needs U7's routes); the document steps depend on those drafts, so they do not run. The pins of N-6 apply once they run. |
| Core check for C-04 (scratch DB test, own `TMPDIR`) | 1 of 1 pass (§3). |
