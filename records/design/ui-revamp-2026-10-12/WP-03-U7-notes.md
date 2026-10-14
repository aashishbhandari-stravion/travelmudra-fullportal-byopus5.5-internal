# WP-03 U7 notes: wiring and system tests

Unit U7 of WP-03. Implementer: Claude (Opus 5.5) subagent, 13 October 2026. Base: lane HEAD 34e875b (WP-02 committed at
228816a) plus the uncommitted WP-03 units U1 to U5 and U5s. Nothing is committed; the architect integrates. Binding inputs:
`WP-03-design.md` §1.2, §1.5, §9.1 (U7 row), §9.2, §9.3; `WP-03.md` §3, §4 and §6; `WP-03-U1-notes.md` to
`WP-03-U5-notes.md`; the architect's note on `test/system/refusals.test.ts` path parameters.

## 1. Routes registered

| Route id | Method, path | Edge | Staff (support view) | Export |
|---|---|---|---|---|
| `ta.home` | GET `/ta` | yes | yes | `taHomeRoutes()` |
| `ta.groups.list`, `ta.groups.detail` | GET `/ta/groups`, `/ta/groups/:groupId` | yes | yes | `taGroupReadRoutes()` (moved) |
| `ta.groups.new`, `ta.groups.travel_dates_form` | GET `/ta/groups/new`, `/ta/groups/:groupId/travel-dates` | yes | no | `taGroupTaskRoutes()` |
| `ta.groups.create`, `ta.groups.travel_dates`, `ta.groups.close` | POST (unchanged paths) | yes | no | `taGroupFormRoutes()` (moved) |
| `ta.applications.list` | GET `/ta/applications` | yes | yes | `taApplicationsListRoutes()` (moved) |
| `ta.applications.review` | GET `/ta/applications/:applicationId/submit` | yes | yes | `taApplicationStepRoutes()` / `taApplicationSupportRoutes()` |
| `ta.applications.help_form` | GET `/ta/applications/:applicationId/request-assistance` | yes | no | `taApplicationStepRoutes()` |
| `ta.applications.prepare` | GET `/ta/applications/:applicationId/prepare` | yes | yes | `prepareReadRoutes()` / `prepareTaskListRoute()` |
| `ta.applications.identity_form`, `details_form`, `documents_form`, `documents_existing` | GET `…/correct-identity`, `…/edit`, `…/documents`, `…/documents/existing/:requirementType` | yes | no | `prepareReadRoutes()` |
| `ta.applications.edit`, `ta.applications.correct_identity` | POST (unchanged paths) | yes | no | `prepareFormRoutes()` (moved) |
| `ta.applications.new` | GET `/ta/groups/:groupId/applications/new` | yes | no | `individualIntakeRoutes()` |
| `ta.search.seal` | POST `/ta/search` (seal, target `ta.search`, field `q`) | yes | no | `taSearchSealRoutes()` |

Files: `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts`.

## 2. Inventory (`src/web/route-inventory.ts`)

- T01 gets id `ta.home`; T09 gets id `ta.applications.new`.
- New: T60 `ta.groups.new` (who `ta`), T61 `ta.groups.travel_dates_form`, T62 `ta.applications.prepare` (sv), T63
  `ta.applications.identity_form`, T64 `ta.applications.details_form`, T65 `ta.applications.documents_form`, T66
  `ta.applications.documents_existing`, T67 `ta.applications.review` (action `application.read`, sv; D-U3-01), T68
  `ta.applications.help_form`, T69 `ta.search.seal` (POST, no command).
- `RouteSpec` gains `seal?: string` (the target route id), also in the `r()` extras (U6-F1, first half). The inventory
  POST rule test (`postRuleViolations`) now sees T69 as a valid seal entry.
- Counts: 284 → 294 entries (+10), 270 → 282 with an id (+12). Travel agent surface 61 → 71 (GET 25 → 34, POST 36 → 37);
  the only TA entries without an id are T25 and T26 (reserved document routes).

## 3. Removed copies

- `src/apps/shared/core/ta.ts`: `groupsPage`, `groupPage`, `groupAgain`, `applicationsPage`, `appRows`, `applicantName`,
  `page`, `DONE`, `INTAKE_NEW`, `INTAKE_LIST`, `GROUP_DOCUMENTS`, `zGroupParams`, `GroupParams`; the GET routes
  `ta.groups.list`, `ta.groups.detail`, `ta.applications.list` from `taCoreReadRoutes()`; the imports they used; the
  header comment.
- `src/apps/edge/core/routes.ts`: `ta.groups.create`, `ta.groups.travel_dates`, `ta.groups.close`,
  `ta.applications.edit`, `ta.applications.correct_identity`; the `optional` helper; their imports; the header comment.

## 4. One-line and shared-file changes

- `SURFACE_CONFIG.ta.home = '/ta'` (`src/web/ui/shell.ts`); its comment now says "the travel agent's Home".
- `resultHrefOf`: the `intake_attempt` mapping to `/ta/intake/:attemptId` already existed. Its label read "Spreadsheet
  import", which is wrong for the one-applicant form's result on the operation page; it now reads "Intake" (the word the
  intake pages use). Decision for the architect to confirm (P2 wording).
- S-11 (`src/apps/shared/ta-intake.ts`): `renderTaAttempt` passes `receipt` (`readReceipt(ctx,
  individualReceiptExpectations(attemptId))` for an `individual_form` attempt outside a support view, else null) and
  `readAt: ctx.now`. Rendering only.

## 5. Component and CSS

- `checkboxField` (`src/web/ui/forms.ts`): new option `disabled?: { reason }`. The box renders `disabled`, never
  checked and never `required`; the reason renders as `p.choice__hint.choice__reason#<id>-reason` after the hint; the
  input's `aria-describedby` names hint, reason and error.
- TA-09c (`src/apps/shared/pages/individual-intake.ts`): `serviceChoice` uses `checkboxField` (a service that cannot be
  chosen passes `disabled: { reason }`); the local choice markup is gone. The passport hint uses `PASSPORT_PAGES_RULE`
  and `PASSPORT_ONE_FILE` from `pages/prepare.ts`: "Send one file that holds the front page and the back page."
- `static/css/components.css`, one block before the page-hidden rule: hairline between Home items and notices; Home
  item name and meta sizes; numbered `.home-start`; Home items as cards in a `main` container ≤ 36rem; the reference in
  the applications list's Applicant column at `--text-sm` (`#applications-table th.data-table__cell .identifier`);
  `not-allowed` cursor and `--text-muted` label for a disabled `.choice`. Tokens only.

## 6. Galleries

`scripts/dev/gallery-pages.ts` registers `taHomeGalleryPages`, `groupsGalleryPages`, `applicationsGalleryPages`,
`applicationGalleryPages`, `submitGalleryPages`, `prepareGalleryPages`, `documentDetailGalleryPages`,
`individualIntakeGalleryPages` (82 pages; 182 in total, no duplicate file name).

## 7. Tests changed or added

| File | Change |
|---|---|
| `test/unit/web/routes.test.ts` | New: the TA routes T01, T09, T60–T69 at their path, action and support-view flag; step pages beside their POST; the seal target; TA counts 34 GET, 37 POST. |
| `test/unit/bff.test.ts` | New: edge serves all new routes; staff serves only `ta.home`, the group read pages, the list, the task list and Check and submit; each served seal route's target equals its inventory `seal` (covers U6-F1 without an `app.ts` change). |
| `test/unit/web/signed-in.test.ts` | Rail shows Home `/ta`; landing `/ta`; brand `/ta`. |
| `test/unit/web/carried-forms-ta.test.ts` | New (design §9.2): TA-05 close form; TA-07 report-problem (2 forms), withdraw, price-decision (accept, decline), transition-decision, reapply, dependencies; each with its own token and `_op`, plain `?done=` redirect; delivery link, completion checklist, download step, originals, payment summary. Hand back is not carried (moved to TA-08, Q-W03-06). |
| `test/integration/identity-correction-replay.test.ts` | New (C-04): six posted fields, five unchanged (number in lower case) → accepted, `core_corrections.fields = ['identity.surname']`; identical envelope replays (same summary, no write); same key, other content → `operation_key_reused`; fresh key → `correction_no_change`. |
| `test/unit/signin-address.test.ts` | `/ta` is a return page now; POST-only example `/ta/applications/app_x/withdraw` (`…/edit` has a GET now); unregistered-page example `/ops/groups/grp_x` at staff. |
| `test/unit/bff-access-change.test.ts`, `test/unit/nav-counts.test.ts` | Serve `taApplicationsListRoutes()` (moved out of `taCoreReadRoutes()`); the list also reads `core.ta_groups`. |
| `test/unit/web/individual-intake.test.ts` | Passport hint "one file"; reason read through every id of `aria-describedby`. |
| `test/system/support/browser.ts` | `groupThroughEdge`: form from GET `/ta/groups/new`, location `?done=group_created&op=`. `intakeThroughEdge`: GET TA-09c, location `?done=drafts&op=`. |
| `test/system/support/drafts.ts` | Upload from the row's form on TA-09f, location `…/documents?done=document&op=`; edit from TA-09d, location `…/prepare?done=saved&op=`. |
| `test/system/core-pages.test.ts` | TA-13a create; per-field date sentence (U1-D2); "Group created" receipt; TA-13b dates with `&op=`; TA-09d edit and "Application details saved"; list row `?from=applications`; TA-09i identity, message "The documents you chose do not show …", location `…/prepare?done=corrected&op=`; close form present on a busy group, 409 with "Some applications of this group are still open." in `#close-errors` (U1-02). |
| `test/system/case-work.test.ts` | Draft via TA-09c and TA-09d; `taRow` accepts `?from=`; list row selector; `#next-action` for the notice step; Home `#needs-action` and `#needs-action-count` (U2-04). |
| `test/system/case-rules.test.ts` | Intake via TA-09c. |
| `test/system/ta-documents-originals.test.ts` | Passport drafts via TA-09c; rules per document form on TA-09f (upload or replace input, by `requirementType`); browser lands on `/ta`; refused PDF photo re-renders TA-09f (`#upload-photo`, summary link, no `#document-requirement`) (U4 N-6); TA-09c photo rule; originals edit via TA-09d. |
| `test/system/intake-pages.test.ts` | Uploads from the photo form of TA-09f; upload and replace receipt locations (U4 N-6). |
| `test/system/document-decisions.test.ts` | Resolve answers `…?done=resolved&op=` (U4 N-6). |
| `test/system/browser.test.ts` | Landing `/ta`, title "Home", brand `/ta`; "Add one applicant" clicked on TA-05; INT-1 address with `?done=drafts&op=`. |
| `test/system/three-instances.test.ts`, `flows.test.ts` | `/home` → `/ta`. |
| `test/system/web-shell.test.ts` | Group form from `/ta/groups/new`; "Go to your home" → `/ta`; create location with `&op=`. |
| `test/system/capacity-pages.test.ts`, `interrupted-work.test.ts`, `sign-in.test.ts` | Group form from `/ta/groups/new`. |
| `test/system/new-service.test.ts` | Service read on TA-09c (design §9.3). |
| `test/system/refusals.test.ts` | `PARAMS['requirementType'] = 'passport'` beside the architect's `kind` line (new path parameter of T66). |
| `test/ui/gallery.test.ts` | Phone navigation menu lists Home first (T01 is registered; design §9.3 expected this pin to stay valid, it does not). |

Traced test titles: none changed.

No fix in a unit's page file was needed beyond the assigned TA-09c changes.

## 8. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean. |
| `npm run lint` | Clean. |
| `npm run test:unit` | 1173 tests: 1171 pass, 1 todo (the U5 passport drift guard), 1 fail: `seo-record.test.ts` (expected; record stale after the CSS block). |
| `npm run test:ui` | 2087 tests: 2085 pass, 1 todo, 1 fail: the gallery's phone menu pin (Home now listed). Pin fixed; the "phone layouts" group (8 tests) rerun: 8 of 8. The 43-minute full UI run was not repeated. |
| `node --test "test/static/**/*.test.ts"` | 74 of 74. |
| `TMPDIR=/tmp/w3u7 npm run test:system` | 177 of 177. |
| `TMPDIR=/tmp/w3u7 npm run test:integration` | First run 292 of 293: `documents-tasks.test.ts` › "carry ids and closed codes only …" found `ASHA` in the diagnostics. Not reproduced in two reruns of that file (26 of 26 each) or a full rerun (293 of 293). Inference: a random id in a diagnostic line contained the substring (P2 flaky test, documents module, not this unit's). |

## 9. Items for the architect

| Id | Rank | Item | Proposal |
|---|---|---|---|
| U7-01 | — | `test/unit/seo-record.test.ts` stale (CSS block of §5). | Regenerate the crawl record. |
| U7-02 | P2 | U6-F1 second half: `assertRoutesInInventory` / `checkAppRoutes` do not compare a seal target at start-up (`src/apps/shared/app.ts` was outside this unit). The BFF unit test compares the served seal routes. | Pass `seal` through `RegisteredRoute` and compare it, when the shell owner next edits `app.ts`. |
| U7-03 | P2 | `docs/verification/traceability.md` row T-S23 still says "every POST maps to exactly one command" (U6-F2). | Update the row's wording with the seal exception; titles unchanged. |
| U7-04 | P2 | `#dates` fallbacks remain in `pages/ta-home.ts:93` and `core/ta.ts:389`; they apply only while TA-13b is not served, which is never the case now. | Remove when those files are next edited. |
| U7-05 | P2 | Result label "Intake" for `intake_attempt` (§4). | Confirm or reword. |
| U7-06 | — | `DESIGN.md` lines named by U3-08, U4 N-4 and the U5 notes are not written (outside this unit). | Architect's single `DESIGN.md` edit. |
| U7-07 | — | `test:ui` duration grew with 82 gallery pages (the full UI run took 43 minutes). | None needed; note for planning check runs. |
| U7-08 | P2 | `test/integration/documents-tasks.test.ts` "carry ids and closed codes only" checks forbidden words as substrings of the whole diagnostic text; a random id that contains `ASHA` (Crockford letters) fails it without any personal data (inference from one failure not reproduced in three runs). | Documents module: match the forbidden values as whole words, or use fixture words that cannot occur in an id. |
