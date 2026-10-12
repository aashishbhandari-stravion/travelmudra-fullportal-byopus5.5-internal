# WP-03 U2 notes: TA-01 Home, TA-06 Applications, TA-06s search

Unit U2 of WP-03. Author: the U2 engineer (Claude Opus 5.5 subagent), 13 October 2026. Input for the
architect's integration, unit U7 (wiring) and the gallery registration. U2 commits nothing. Base: lane commit
f78e558 plus the uncommitted work of the other units. Binding inputs: `WP-03-design.md` §1.2, §1.3, §2.0, §2.1,
§2.5, §2.6, §6 (all), §7, §9.1 (U2 row), §9.3; `WP-03.md` §3 (Q-W03-01, Q-W03-07) and §4.1 (C-02, C-06, C-07);
`WP-03-U6-notes.md` §4; `DESIGN.md` (support view, optional reads).

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/core/ta-home.ts` (new) | `readTaHome`, `TaHomeData`, `taHomeRoutes()` (GET `ta.home`). |
| `src/apps/shared/pages/ta-home.ts` (new) | `taHomePage`, `homeStepOf`, `TA_HOME_PATH`, `HOME_ACTIONS_SHOWN` (20), `HOME_NOTICES_SHOWN` (5). |
| `src/apps/shared/core/ta-applications-list.ts` (new) | `readApplicationsList`, `ApplicationsListData`, `listFactsRead` (delivery facts with an `available` flag), `taApplicationsListRoutes()` (GET `ta.applications.list`, moved). |
| `src/apps/shared/pages/applications-list.ts` (new) | `applicationsListPage`, `readListFilters`, `NO_FILTERS`, `applicationsListHref`, `applicationHrefFromList`, `listReturnOf` (for TA-07), `APPLICATION_LIST_LIMIT` (200). |
| `src/apps/shared/views/ta.ts` | TA-06s rebuilt on the seal: `taSearchPage(ctx, state)`, `taSearchForm`, `searchToken`, `searchHref`, `searchResultHref`, `TA_SEARCH_SEAL_ROUTE_ID`, `TA_SEARCH_FIELD`; new `taSearchSealRoutes()`. The `?q=` GET and the `progress` listing (`views.ta_applications`) are removed; TA-06's filters replace the listing. History page unchanged. |
| `scripts/dev/gallery/applications.ts` (new) | `applicationsGalleryPages()`: 13 pages. Exports `galleryRequest`, `galleryRef` and the synthetic rows. |
| `scripts/dev/gallery/ta-home.ts` (new) | `taHomeGalleryPages()`: 5 pages. |
| `test/unit/web/ta-home.test.ts` (new) | 19 tests. |
| `test/unit/web/applications-list.test.ts` (new) | 26 tests (list, search page, BFF search flow). |
| `test/unit/web/travel-recheck.test.ts` | Line 13 imports; the list case renders `applicationsListPage` (row link `?from=applications`) and the home page (no item); the TA-07 case reads U3's `#next-action` and `#status` and the TA-13b link. Sentences and the traced title unchanged. |
| `test/system/case-views.test.ts` | Search through the seal POST (helper `search`: 303, token address, no text); "list by progress" moves to `/ta/applications?progress=`; support view reads the list and the formless search page (§6.5, §6.6). |

## 2. Pages and states

**TA-01 Home `/ta`.** Reads `core.ta_applications` (required: failure is S7; an unknown list is never "nothing
needs your action"), then in parallel `dlv.delivery_facts`, `dlv.notices` and `intake.incidents` (optional, each
through `optionalView`; incidents only where `/ta/intake-incidents` is served). States: S2 "Start here" (three
steps, the one-group-one-country sentence, no number, no country name; "Browse services", "Create a group" →
`/ta/groups/new`, else `/ta/groups`); items by `needingAction` in Core's order, at most 20, with the count line
"[n] applications need your action." and "Show all [n] …" → `/ta/applications?view=needs_action`; "Nothing needs
your action now."; delivery facts unavailable → "Some reasons may be missing" note with "Open Notices", and
"No application needs your action for a reason that could be read now." when the list is empty; at the 200-row
limit "Only the first 200 of your applications were read."; import issues callout (open count, "500 or more" at
the limit; "Import issues are unavailable now."); "Travel-date notices" (`timing_risk`, newest first, 5,
acknowledgement line) and "Recent results and closures" (four kinds, 5, "All notices"), each hidden when empty
and "[Block] is unavailable now." when unread; shortcuts. Item step (`homeStepOf`, priority of design §3.2):
notice → "Open the notice"; payment → "How to pay" (`#payment`); download → "Download your result/packet";
formal return → "Correct the application" (TA-09t when served, else TA-07); `decide_price_increase` /
`decide_transition` / `reapply_correction` → TA-07 anchors `#price`, `#pending-work`; recheck → "Change the
travel dates" (TA-13b when served); draft → "Continue the application"; otherwise "Open the application".
Support view: same facts, no step, no "Create a group", no form.

**TA-06 Applications `/ta/applications`.** Reads `core.ta_applications` (required), `dlv.delivery_facts` and
`core.ta_groups` (optional). Search form (POST to the seal; absent in a support view). Filters (GET, "Filter
applications"): `view` ∈ {`needs_action`}, `progress` ∈ PROGRESS_MEANINGS (the progress the row shows, i.e. the TA
reading), `group` = a group reference that is one of the TA's groups or rows; anything else, or a repeated value,
turns the filter off. Result line "[n] applications shown" before the table. Columns in stacked-card order
(identity, next, status, context): Applicant (link + reference), Next (`pendingCell`), Progress, Outcome
("Outcome not recorded"), Group (link + country), Service, Travel (start date). Row link
`/ta/applications/:id?from=applications[&view=…][&progress=…][&group=…]`. S2 "No applications yet" + "Go to your
groups"; S3 "No application matches these filters." + "Clear filters" + "[n] applications exist without these
filters." ("200 or more" at the limit); groups unread → Group/Travel cells "Unavailable", no Group filter, a line
saying so; facts unread → note, and "This view may be incomplete now." with `view=needs_action`; at 200 rows "This
list shows at most 200 applications. Search finds any of your applications." (no search sentence in a support view).

**TA-06s Search `/ta/search`.** States: none (form only); results (projection freshness lag form, `asOfNotice`,
"[n] applications shown", results table, "Show older changes" paging); S3 "No application matches." (no count);
expired "This search has expired. Search again." (status 200); unavailable "Search is unavailable now." + "Try
again" (same token address); support view: no form, "Search is not available in a support view. Use the lists and
filters." + link to the list.

## 3. How the search text stays out of the address

The form posts `_csrf` (for `ta.search.seal`) and `q` only; no `_op`. The shell seals the text (U6) and answers
303 to `/ta/search?r=<token>`. The GET opens the token with `openSealToken(ctx, ctx.query.r)` for its own session
and route and reads `views.search {q, after}`. The text is rendered only in the field's value and never in the
document title (the history keeps titles), any `href` or form action. Result links carry
`?from=search&r=<token>`; paging links `?r=<token>&after=<cursor>`; "Try again" the same token address. A `q` in
the address is never read or echoed. Verified: BFF test with the real routes (303 `Location` holds no part of the
text and no `q=`; core asked with the text; every address of the results and next page free of the text; old
`?q=` address runs no search; other session and altered token → expired); system test in the scratch run (§6).

## 4. Routes for U7 (export, not registered)

| Route id | Method, path | Action | Export | Register at |
|---|---|---|---|---|
| `ta.home` | GET `/ta` | `application.read`, resolve self | `taHomeRoutes()` (`core/ta-home.ts`) | edge and staff (support view); inventory T01 gets id `ta.home` |
| `ta.applications.list` | GET `/ta/applications` | `application.read`, resolve self | `taApplicationsListRoutes()` (`core/ta-applications-list.ts`) | edge and staff; remove the old copy from `taCoreReadRoutes()` in `core/ta.ts` and the old `applicationsPage` |
| `ta.search` | GET `/ta/search` | `search.private` | `taViewsRoutes()` (unchanged registration) | edge and staff (as today) |
| `ta.search.seal` | POST `/ta/search`, seal `{target: 'ta.search', field: 'q'}`, body `form` | `search.private`, no command | `taSearchSealRoutes()` (`views/ta.ts`) | edge only; inventory entry `r('…', 'POST', '/ta/search', 'ta', 'search.private', ['ta_own'], { id: 'ta.search.seal' })` (+ `seal` when U6-F1 lands) |

Also U7: `SURFACE_CONFIG.ta.home = '/ta'`. Verified wiring (scratch copy of HEAD + U2 files): edge
`...taCoreReadRoutes().filter(r => r.id !== 'ta.applications.list'), ...taApplicationsListRoutes(), ...taHomeRoutes(),
...taSearchSealRoutes()`; staff the same without the seal; inventory as above. `checkAppRoutes` accepted it.

## 5. CSS and component needs (none blocks; the sweep is clean without them)

| Need | Owner | Proposal |
|---|---|---|
| Home item list | `components.css` | `.home-actions` (hairline between `.home-actions__item`, card at < 48rem), `.home-actions__meta`, `.home-notices` / `__item`, `.home-shortcuts`, `.home-start`. Classes are already in the markup. |
| Applications table width | `components.css` | The Applicant column takes the width of the reference and long names; consider a smaller `.identifier` in table cells. |
| Row marker text | `src/web/ui/data.ts` | `dataTable` marks "Needs attention"; the design says "Needs your action". One word option on `attention`. |
| Autofocus | `src/web/ui/forms.ts` | `textField` has no `autofocus`; design §6.3 item 6 asks for it on TA-06s only. |

## 6. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree at the final run). |
| `npx eslint --max-warnings=0` on the 11 U2 files | Clean. |
| `node --test` ta-home, applications-list, travel-recheck, bff-seal (+ bff, nav-counts, optional-read) | 99 of 99. New: 19 + 26. |
| `node --test "test/static/**/*.test.ts"` | 74 of 74 (route ids are literals: the tree scanner requires it). |
| `case-views.test.ts` in place (`TMPDIR=/tmp/w3u2`) | Fails at setup, before any U2 code: `test/system/support/browser.ts:179` `intakeThroughEdge` finds no individual form on `/intake/new` (U5's move, in progress; the helper is a §9.3 U7 item). Not a U2 failure. Its leftover instances were stopped. |
| `case-views.test.ts` in a scratch copy (`git archive HEAD` + U2 files + the wiring of §4) | 8 of 8. |
| `case-work.test.ts`, `core-pages.test.ts` in the same copy | 23 of 27 as is; 27 of 27 with the pin changes of §7 item U2-04. |
| Scratch browser sweep of the 18 gallery pages (1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice, CSP, script errors; 360 and 320 px overflow) | 108 checks, 0 failures, no moderate or minor axe finding. |

## 7. Items for the architect (ranked)

| Id | Rank | Item | Scenario | Proposal |
|---|---|---|---|---|
| U2-01 | P1 | `ta.search` (live in `taViewsRoutes()`) calls `ctx.csrfToken('ta.search.seal')`, which throws `internal` while the seal route is not registered. | U2 integrated without U7: edge `/ta/search` answers 500. | Integrate U2 and U7 in one commit. |
| U2-02 | P1 | TA-07 (U3) must lead back to the list: rows carry `from=applications` + filters; search results `from=search&r=<token>`. | Without it the breadcrumb ignores the origin (A86, A87 "Back"). | U3 calls `listReturnOf(ctx.query)` (`pages/applications-list.ts`): it validates every value (closed sets, group format, token form) and returns `{label, href}` or null. |
| U2-03 | P1 | Home links into TA-07 anchors `#payment`, `#price`, `#pending-work` (today's ids). | U3 renames a section: "How to pay" lands at the top of TA-07. | U3 keeps the ids, or names the new ones. |
| U2-04 | P1 | System pins of the old TA-06 (verified failing/passing in the scratch copy). | U7 swaps the route: 4 tests fail. | `case-work.test.ts:44` `tr:has(a[href="/ta/applications/${app}"]), tr:has(a[href^="/ta/applications/${app}?"])`; `:292` row selector with `?from=applications`; `:401-402` read `/ta` `#needs-action`, regex `/Syncase, Mira .*A notice about this application needs your acknowledgement/`; `:484-487` read `/ta`, regex `/Synprep, Mira .*Download your preparation packet/`, count from `#needs-action-count`; `core-pages.test.ts:192` `#all a[href="/ta/applications/${s.a}?from=applications"]`. |
| U2-05 | P2 | `listFacts` (`ta-reading.ts`) returns an empty map on an outage, so callers cannot tell "none" from "unread". | The navigation count and TA-05 read silently (F-W03-01 class). | U2 reads through `listFactsRead` (same parameters). Later: `ta-reading.ts` builds on `listFactsRead`. |
| U2-06 | P2 | The list read model has no `submit.allowed`: Home cannot tell "Check and submit" from "Continue the application". | A submittable draft reads "Continue the application" on Home. | Accept; the task list states the step. Kind 1 data gap with P-09 if wanted. |
| U2-07 | — | Design §2.1 support view says "disabled text"; `DESIGN.md` and the work order say no action. | — | Followed `DESIGN.md`: no step in a support view. |
| U2-08 | — | `/ta/search` no longer lists by progress (`views.ta_applications` unused by it). | Route map T59 and the inventory comment still name the listing. | Update the route map row when U7 edits the inventory. |
| U2-09 | — | `travel-recheck.test.ts` TA-07 case now pins U3's `#next-action` and `#status`. The title is traced (T-C23) and unchanged. | U3 renames the ids. | Update the selectors with U3's change. |
| U2-10 | — | Gallery registration. | — | Add `...applicationsGalleryPages(), ...taHomeGalleryPages()` to `galleryPages()`. The gallery request marks `/ta`, `/ta/groups/new`, TA-13b and TA-09t as served (finished navigation). |
