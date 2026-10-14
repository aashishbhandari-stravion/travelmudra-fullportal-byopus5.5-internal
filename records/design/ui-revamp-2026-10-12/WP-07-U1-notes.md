# WP-07 U1 notes: OP-01 My work and OP-01a Applications

Unit U1 of WP-07. Author: the U1 engineer, 13 October 2026. Input for the architect's integration and for U7. U1
commits nothing; the architect integrates. Base: lane commit 101eff1 with the uncommitted U0 files (`reading.ts`,
`saved-views.ts`, the WP-07 CSS block). Binding inputs: `WP-07-design.md` §2.0, §2.1, §2.2, §4.5, §5, §7.1 (U1 row);
`WP-07.md` §3, §4.1 to §4.12 (F-07, F-16, F-30, F-35, F-36, F-38, AM-W15-05), §6.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/work/queue-page.ts` (new) | OP-01 `myWorkPage`, OP-01a `applicationsPage`; address parsers `myWorkQuery`, `applicationsQuery`; `activeReadGrants`, `waitingOnOf`, `myWorkViews`; constants (`PAGE_SIZE` 50, `WORK_LIST_LIMIT` 500, `PROJECTION_PART` 200, `READ_ONLY_HREF`). |
| `src/apps/staff/work/queue-routes.ts` (new) | `opsWorkListRoutes()`: GET `ops.work` (same id, path, action as today), GET `ops.applications.list` (new), GET `ops.grants` (303). Exports the read functions `myWorkReads`, `applicationsReads`. |
| `scripts/dev/gallery/my-work.ts` (new) | `myWorkGalleryPages()` (10 pages, not registered) and the fixtures the tests share. |
| `test/unit/web/my-work.test.ts` (new) | 21 tests. |
| `test/unit/bff-my-work.test.ts` (new) | 24 tests (scripted core, real BFF server). |

No other file changed.

## 2. Exported routes (U7 wires them)

| Route id | Method, path | Action | Reads | Replaces |
|---|---|---|---|---|
| `ops.work` | GET `/ops/work?view=&page=` | `application.read` | `core.ops_work`; opt. `ops.incidents`; opt. `dlv.packet_handovers` (only rows that await a handover) | `ops.work` in `src/apps/staff/core/ops.ts` |
| `ops.applications.list` | GET `/ops/applications?progress=&owner=&page=&after=` | `application.read` | `core.ops_work`; opt. `iam.own_grants`; opt. `dlv.packet_handovers`; opt. `views.ops_work` (not read when the grants show no active group read grant) | new; needs its inventory entry |
| `ops.grants` | GET `/ops/grants` → 303 `/ops/applications#read-only` | `self.read` (resource self) | none | `ops.grants` in `src/apps/staff/identity.ts` |

Every optional read goes through `optionalView`. An availability failure turns only its block into "Unavailable".
Every other refusal reaches the shell (BFF tests for withdrawn access, an ended session and closed admission on each
optional read of both pages). A failure of `core.ops_work` is the page's error (503 unavailable page, never zeros).

## 3. Views and states

OP-01 (design §2.1 with F-07, F-16, F-30, F-36): views Action now, Waiting, Returned to TA, Delivery and closure,
Continuing duties as `savedViewTabs` links; membership, owner labels, alert tiers, steps and blockers only from
`workRows`/`viewRows`/`continuingDuties` of `reading.ts`. The count of Action now equals `workNeedingAttention` (test).
Counts: "[n] applications", "[n] duties", "None", "Unavailable"; at the 500 cap "[n] applications shown". Rows: tier 1,
then tier 2, then tier 3, Core's order inside a tier; markers are text badges in the warning tone; waiting rows carry
none. Primary action "Open [applicant]: [step]" to the first Action-now row. 50 rows a page with "Rows [a]–[b] of [n]
applications in this view". Cap line "This list shows the first 500 applications assigned to you. More may be
assigned." States: S2 nothing assigned; Action now empty ("Nothing needs you now. [n] applications wait on others: see
Waiting."); other view empty; empty at the cap; incidents unavailable (duties "Unavailable", "Incidents cannot be read
now.", "Custody incidents cannot be read now.", no custody marker); unknown reason code with "Reference code: [code]";
a packet the travel agent downloads reads "Travel agent must act" and is not counted.

OP-01a (design §2.2): enumerated GET filter (Progress: the six meanings, staff labels; Waiting on: You, Travel agent,
SuperAdmin, External party, Other); "Assigned to you" (`#assigned`): every row in Core's order, 50 a page, cap line,
links `?tab=work&from=applications`; "Read-only access" (`#read-only`): one line per active group read grant
"Read-only access: [purpose], until [time] IST · Group [reference]" (AM-W15-05), the projection lag line, the
`readOnly` rows of the projection part (Application, Progress, Waiting on), "Read the next part of the list" with the
interim line. No form, input, button, select or action link in the section (test); F-38 needs nothing on a list page.
States: S2 nothing assigned and no grant; S3 no match with "Clear the filter" (both sections); grants unavailable
("Read access cannot be read now."); projection unavailable ("The applications you may read cannot be listed now.",
grant lines kept); no read access ("You hold no read access."); lag "Up to date", "Behind by [n] s", "Freshness
unavailable".

## 4. Decisions made in U1 (deviations for the record)

| ID | Decision | Reason |
|---|---|---|
| D-U1-01 | OP-01a also reads `dlv.packet_handovers` (optional, only rows that await a handover). It does not read `ops.incidents`: no custody marker or "Also needed" line on OP-01a. | The Owner column and the "Waiting on" filter read the same as OP-01; the design lists no incidents read for OP-01a. |
| D-U1-02 | The range line shows only when a list has more than one page; the shared `pagination` adds its own "Showing [a]–[b] of [n]" under the table. On OP-01a it ends "assigned to you" or "that match the filter". | One page needs no range; `pagination` cannot drop its line. |
| D-U1-03 | The 500 cap line is one page-level line; `queueTable` gets no `cap` option. An empty view at the cap reads "None shown in this view" and never "No application in this view". | `queueTable`'s cap words differ from the design's; a view at the cap can have rows beyond the 500. |
| D-U1-04 | Columns: Application (the WP-06 cell: applicant, service, group, reference), Current task, Blocker, Owner, Review point. The phone card keeps this order. | `queueTable` has one order; the design's phone order (owner before blocker) is not met. P2. |
| D-U1-05 | Action now empty while Waiting is empty, and every other empty view: body "The other views list the rest of your work." | The design gives only the Waiting variant. |
| D-U1-06 | "Waiting on" maps the row's owner label: You = "You must act"; Travel agent, SuperAdmin, External party by their labels; Other = every other label (deferral, dependency, parked return, "Assigned operator must act" on read-only rows, Accounts, processing, unavailable, no current action). | One closed mapping, the same as the Owner column. |
| D-U1-07 | Active read grant: kind `group_read`, state `active`, group set, `valid_until` null or after the read time. | A grant past its end gives no access even before Core marks it expired. |
| D-U1-08 | Continuing duties columns: Incident (kind label linking `/ops/incidents/:id`, what happened), Application, State, Still needed, Opened; words from `operations/labels.ts`. No "Processing completed" (acceptance A07). | WP-14 `incidents/words.ts` does not exist yet (F-35). No read tells a completed application from an ended or unassigned one. |
| D-U1-09 | Gallery and test references use Crockford characters only. | The BFF test sends the fixtures through the wire contract. |

Acceptance rows that differ from the design (the design governs, header rule): A02 and A08 ("All assigned" is a link
to OP-01a, not a tab; the read-only section is on OP-01a); A06, A09, A10 copy; A07 "Processing completed".

## 5. Items for U7

1. `src/apps/staff/instance.ts`: add `...opsWorkListRoutes()` (`./work/queue-routes.ts`). Remove from
   `src/apps/staff/core/ops.ts` the `ops.work` route, `workPage`, `workItemNeedsAttention`, `workNeedingAttention`,
   `custodyOf`, `workReading`; remove from `src/apps/staff/identity.ts` the `ops.grants` route, `opsGrantsPage` and
   `grantStateText` (no other user). `attention.ts` imports `workNeedingAttention` from `./work/reading.ts` (U0 item 1).
2. `src/web/route-inventory.ts`: new GET `/ops/applications`, surface `ops`, action `application.read`, who as O02
   (`op_asg`, `op_grant`), id `ops.applications.list`; `ops.grants` (O06) stays registered (it answers 303).
3. Tests that pin the old pages: `test/system/case-work.test.ts` `opsWork` (`#assigned tr`, `#reviews`, `tr.is-attention`
   → rows `#work-list tbody tr` of the view that holds the application; flagged = Action now) and `#incidents` on
   `/ops/work` (→ `/ops/work?view=duties` `#duties-table`, or `/ops/incidents`); `test/system/ported-pages.test.ts:131`
   and `test/system/three-instances.test.ts:154` (`/ops/grants` → 303 to `/ops/applications#read-only`; assert
   `#read-only`); `test/unit/web/routes.test.ts` (inventory counts); `test/unit/web/signed-in.test.ts` (ops rail; no
   transitional member).

## 6. Items for the architect

1. `SURFACE_CONFIG.ops`: "My work" with the one member `/ops/work` (the transitional "Read grants" leaves); new
   destination "Applications" `/ops/applications`. Until then OP-01 shows the local tabs "Assigned work" and "Read
   grants" (visible in the gallery).
2. Register `myWorkGalleryPages()` in `scripts/dev/gallery-pages.ts`.
3. P2 (U0 reading, `reading.ts`). `operatorSentence('act_authorized')` falls back to the shared sentence "An external
   act was authorised; it may have happened. Its evidence is awaited." Scenario: every OP-01 row of an authorized act
   shows "authorised" against the copy rule ("authorization"). It instructs no act (F-33 holds).
4. P2. At the 500 cap, an incident of an assigned application beyond the first 500 reads as a continuing duty.
   Scenario: an operator with more than 500 open assignments and an owned incident on one not listed. Unlikely.
5. P2. D-U1-04 (phone card order).
6. `DESIGN.md`: no new component in U1.

## 7. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | No error in a U1 file. The last run showed one error in U4's `test/unit/web/external-action.test.ts` (in progress); an earlier run showed errors only in U2's `workspace.ts`. |
| `npx eslint` on the five U1 files | Clean. |
| `node --test test/unit/web/my-work.test.ts` | 21 pass. |
| `node --test test/unit/bff-my-work.test.ts` | 24 pass. |
| `node --test "test/static/**/*.test.ts"` | 74 pass (an earlier run failed `route_without_id` in U3's `return-flag.ts`, since fixed by U3). |
| Local render of the 10 gallery pages (scratch script, product CSP, Playwright and axe, as the gallery test) | Light and dark at 1440 and 390 px, and 360 and 320 px: no horizontal overflow, no CSP violation, no script error, no axe violation of any impact. |

Not run: `npm run test:system` and the full `test:ui` sweep (the pages are not wired or registered yet).
