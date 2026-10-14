# WP-03 U1: the travel agent's Groups pages (notes)

Lane `ui-revamp-2026-10-12`, base e9e96e3 plus the committed U0 components (a029a5d). Unit U1 of WP-03: TA-04 Groups,
TA-05 Group, TA-13a Create a group, TA-13b Change the travel dates. Governing text: `WP-03.md` §3 and §4 (C-01 to
C-14), design `WP-03-design.md` §1.2 to §1.5, §2.0, §2.2 to §2.4, §2.14, §2.15, §7, §9.1 (U1 row), §9.2, §9.3.
Implementer: Claude (Opus 5.5) subagent. The architect integrates and commits. Nothing is committed. All copy is
draft (CR-09).

## 1. Files

| File | Content |
|---|---|
| `src/apps/shared/pages/groups.ts` (new) | Renderers `groupsListPage` (TA-04), `groupDetailPage` (TA-05), `createGroupPage` (TA-13a), `travelDatesPage` (TA-13b); `groupReceipts(groupId)`, `groupStateFilter(query)`, `groupStateText`, path constants, `LIST_CAP = 200`; the refusal-to-problems mapping of the group forms. |
| `src/apps/shared/core/ta-groups.ts` (new) | GET routes; loaders `groupsAgain`, `groupAgain`, `createGroupAgain`, `travelDatesAgain`; `groupDeliveryFacts` (through `optionalView`); `zGroupParams`, `GroupParams`. |
| `src/apps/edge/core/group-routes.ts` (new) | POST routes `ta.groups.create`, `ta.groups.travel_dates`, `ta.groups.close`. Command input mapping unchanged; only the re-render target and the success location changed. |
| `scripts/dev/gallery/groups.ts` (new) | `groupsGalleryPages()`: 15 pages (§6). Not registered. |
| `test/unit/web/groups-pages.test.ts` (new) | 44 tests (§7). |

No existing file is changed. No CSS, component, shell or `DESIGN.md` change.

## 2. Routes for U7 (exported, not registered)

Two definitions exist until U7 removes the old copies (`ta.ts` `taCoreReadRoutes` list and detail; `edge/core/routes.ts`
`taCoreFormRoutes` create, travel_dates, close). The unit test proves that the five moved routes keep the inventory's
id, method, path, action and command.

| Export | Route id | Method, path | Action | Register at | Inventory |
|---|---|---|---|---|---|
| `taGroupReadRoutes()` | `ta.groups.list` | GET `/ta/groups` | `group.read` | edge and staff (support view) | T04 (unchanged) |
| `taGroupReadRoutes()` | `ta.groups.detail` | GET `/ta/groups/:groupId` | `group.read` | edge and staff (support view) | T06 (unchanged) |
| `taGroupTaskRoutes()` | `ta.groups.new` | GET `/ta/groups/new` | `group.create` | edge only | **New**: who `['ta']`, no `sv` |
| `taGroupTaskRoutes()` | `ta.groups.travel_dates_form` | GET `/ta/groups/:groupId/travel-dates` | `group.edit_travel_dates` | edge only | **New**: who `['ta_own']`, no `sv` |
| `taGroupFormRoutes()` | `ta.groups.create` | POST `/ta/groups` (`core.create_group`) | `group.create` | edge | T05 (unchanged) |
| `taGroupFormRoutes()` | `ta.groups.travel_dates` | POST `/ta/groups/:groupId/travel-dates` (`core.edit_travel_dates`) | `group.edit_travel_dates` | edge | T07 (unchanged) |
| `taGroupFormRoutes()` | `ta.groups.close` | POST `/ta/groups/:groupId/close` (`core.close_group`) | `group.close` | edge | T08 (unchanged) |

`/ta/groups/new` is a static segment; Fastify matches it before `/ta/groups/:groupId`.

## 3. Pages and states

| Page | States built |
|---|---|
| TA-04 | Rows (label link and country, travel dates, state in words, "[open] open of [total] applications" or "No applications yet" from Core); state filter `state` ∈ {open, closed} only, unknown or repeated value = off; result line "[n] groups shown" first in the list region; S2 "No groups yet" (no zero count, no filter form); S3 "No group matches this filter." + "[n] groups are in other states." (capped list: "[n] groups of this list are in other states."); "This list shows at most 200 groups." only at 200 rows; header action "Create a group" only when TA-13a is served and not in a support view; freshness. |
| TA-05 | Receipt first in `main` (`group_created`, `dates`; carried `closed` keeps its flash); header meta Country ("Country no longer listed"), Travel dates (IST); status fact "Group"; action panel (open: owner You, "Add the applicants of this trip.", primary "Add one applicant", secondary "Import a list", "Change travel dates", "Group documents"; closed: owner "None", the closed sentence); Applications (TA-06 row reading without the group column; link `?from=group`; reference as `identifier`; "Outcome not recorded"; S4 note "Some reasons may be missing …" when the delivery facts read is unavailable; the 200 line); Imports and Import issues (Core's `closure` counts with units and links to the old pages); Closing the group (B25 rule text, the two Core facts, the carried confirm form whenever the group is open, Core's refusal in an error summary). No page-side closure verdict. Support view: no form, no link to a form page; the primary step disabled with "Read only in a support view: …". |
| TA-13a | Form to `/ta/groups` with `countryId` (no preselection, listed countries), `label`, `travelStartDate`, `travelReturnDate` (`min` = Core's `today`); consequence before the button (`aria-describedby`); Cancel; C1/C2 per field, typed values kept, new `_op`; `conflict_operation_key` text; no listed country → `boundaryNotice` (kind `not_launched`), no form; support view → no form. Refusal shown at the POST address restores to `/ta/groups/new`. |
| TA-13b | Facts "Travel dates now", Country (cannot change); form with `_rev.group`, both dates prefilled; consequence text; no affected list; C1 (`unchanged` → "The dates are unchanged …"; return before start on the return field); typed dates kept; the re-render keeps the **posted** `_rev.group`; C5 → `staleComparison` (yours / current) and no form, "Review current information" = GET of the page; closed group → callout "The group is closed. Its travel dates cannot change." + "Open the group", no form. |

## 4. Receipt codes (C-03)

| Code | Host | Expectation (`groupReceipts`) | Recorded facts | Current facts |
|---|---|---|---|---|
| `group_created` | TA-05 | resource `group`, id = the page's group, `summary.groupId` = that id | "Next: Add the applicants of this trip." | group name, country, travel dates |
| `dates` | TA-05 | resource `group`, id = the page's group, `summary.groupId` = that id and `summary.datesRevision` is a number | "Effect: TravelMudra checks this group's unfiled applications …" | travel dates |
| `closed` | TA-05 | none: carried flash `?done=closed` (design §2.3 item 2; WP-02 B-02 residual P2) | — | — |

Every other answer (another group, kind or summary; no record; an operation read Core cannot answer now) renders
the neutral unchecked receipt. The success locations use `receiptLocation(…, ctx.operationKey)`.

## 5. Deviations and decisions inside the unit

| Id | Item | Reason |
|---|---|---|
| U1-D1 | Group name `maxlength` 120, not 200 (design §2.4). | Core's `zLabel` accepts 1 to 120 characters (`src/modules/core/commands/groups.ts`); A11 says 1 to 120. |
| U1-D2 | Date errors are per field ("The travel start date must be today or later, as an India date.", "The travel return date must be on the travel start date or later.") instead of the one combined sentence. | Core names the field (`travelStartDate` or `travelReturnDate`); A12 asks for per-field words. |
| U1-D3 | TA-13b closed state uses a callout with A20's wording, not `boundaryNotice`. | A closed group is a business state, not a policy boundary; the boundary sentence form "… is unavailable until …" does not fit. |
| U1-D4 | After a refused close, the confirm disclosure renders closed; the error summary in "Closing the group" takes focus. | The refusal and Core's conditions read first; the form stays one click away. |
| U1-D5 | TA-05 shows only Core's two closure counts. A31's example "1 application is not completed" has no fact on `core.ta_group`; the page does not count rows. | CC-02, F-W03-05: no page-side rule. |
| U1-D6 | Until TA-09c is served, the TA-05 primary is "Add applicants" to the old `/intake/new` page and "Import a list" is absent. | Links show only to served pages (`hasPage`). |
| U1-D7 | TA-04 shows "Create a group" only when TA-13a is served. Until U7 the rebuilt TA-04 has no create path. | The renderer is not wired before U7, so nothing changes for users now. |

## 6. Gallery (`groupsGalleryPages()`)

`groups.html`, `groups-no-match.html`, `groups-empty.html`, `group.html` (created receipt), `group-with-applications.html`
(dates receipt), `group-reasons-unavailable.html` (unchecked receipt, S4 note), `group-close-refused.html`,
`group-closed.html` (closed after the travel return date), `group-support-view.html`, `group-new.html`,
`group-new-refused.html`, `group-new-unavailable.html`, `group-dates.html`, `group-dates-stale.html`,
`group-dates-closed.html`. The module adds the three task paths to the registered pages so the finished navigation
shows. Registration: add `...groupsGalleryPages()` to `galleryPages()` in `scripts/dev/gallery-pages.ts`.

## 7. Checks

| Check | Result |
|---|---|
| `npm run typecheck` (`tsc -p tsconfig.json`) | No error in the U1 files. The final run showed 3 errors in `test/unit/web/application-workspace.test.ts` (another unit's in-progress file); earlier runs showed errors in `ta-applications-list.ts`, `prepare.ts`, `ta-home.test.ts` that came and went with the other units' work. |
| `npx eslint --max-warnings=0` on the 5 U1 files | Clean. |
| `node --test test/unit/web/groups-pages.test.ts` | 44 of 44 pass. |
| `node --test "test/static/**/*.test.ts"` | 73 of 74 pass. The failure is `route_without_id src/apps/shared/views/ta.ts:190, :224` (another unit's in-progress file), not U1. |
| `TMPDIR=/tmp/w3u1 … test/system/core-pages.test.ts` | 2 of 18 pass. "creates a group … and changes its travel dates" passes (old routes). The first failure is "no form posting to /ta/groups/<id>/intake/individual": `src/apps/shared/pages/intake.ts` is changed by the individual-intake unit; the later tests depend on that draft. U1 changes no registered file. |
| Scratch browser sweep of the 15 gallery pages (the checks of `test/ui/gallery.test.ts`: 1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice, overflow, CSP, script errors; 360 and 320 px overflow) | 90 of 90 pass; no axe finding of any impact. |

## 8. Items for the architect

| Id | Rank | Item | Scenario | Proposal |
|---|---|---|---|---|
| U1-01 | P1 | System tests pin the old group pages (U7). | After U7, `groupThroughEdge` (`test/system/support/browser.ts:137`), `interrupted-work.test.ts:50`, `capacity-pages.test.ts:74, 141`, `sign-in.test.ts:142`, `web-shell.test.ts:41` read the create form and country id from GET `/ta/groups` and find none. `core-pages.test.ts:127-147` also pins the location `?done=group_created$` / `?done=dates`, the flash "The group was created", the combined date sentence and the date form on TA-05; `web-shell.test.ts:173` pins the create location. | GET `/ta/groups/new` for the form; allow `&op=<key>`; read "Group created"; GET `/ta/groups/:id/travel-dates` for the date form; match the per-field sentence. |
| U1-02 | P1 | `core-pages.test.ts:229-231` asserts the old page-side rule: a group with open applications "offers no close form" and says "The group still has open applications". | After U7 the test fails by design (Q-W03-09: the form shows whenever the group is open). | Change to: the form is present; its POST answers 409 and TA-05 shows "Some applications of this group are still open." in `#close-errors`. |
| U1-03 | P2 | `dataTable`'s attention mark reads "Needs attention"; design §2.6 says "Needs your action". | TA-05 and TA-06 rows read "Needs attention". | Component option for the mark text (for example `attentionLabel`), if wanted; U2 has the same need. |
| U1-04 | P2 | No style exists for a list result line. | "[n] groups shown" renders as a plain paragraph. | Optional `.result-count` rule (muted, small) in `components.css`. |
| U1-05 | P2 | `src/apps/shared/pages/prepare.ts:428` links "Change the travel dates" to `/ta/groups/:id#dates`. | After U7 TA-05 has no `#dates` anchor; the link lands at the top of TA-05. | Link to TA-13b (`/ta/groups/:id/travel-dates`) when served, as `ta-home.ts:93` and `ta.ts:528` already do. |
| U1-06 | — | U7 removals. | — | Remove `groupsPage`, `groupPage`, `groupAgain` and the five group routes from `ta.ts` and `edge/core/routes.ts`; keep `zGroupParams` there only if U3 still uses it (U1 has its own in `ta-groups.ts`). |
