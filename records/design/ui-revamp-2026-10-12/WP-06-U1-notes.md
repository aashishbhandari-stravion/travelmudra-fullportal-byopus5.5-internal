# WP-06 U1 notes: SA-01 Decision inbox (`/admin`)

Unit U1 of WP-06. Author: the U1 engineer, 13 October 2026. Input for the architect's integration (U6 wiring, gallery
registration). U1 commits nothing. Base: lane commit 101eff1 (U0 components). Binding inputs: `WP-06-design.md` §2.0,
§2.1, §5, §7.1 (U1 row); `WP-06.md` §3 and amendments D-13, D-14, D-17, D-18, D-19, D-21, D-22, D-23; `WP-06-U0-notes.md`
§4 (U1 row); source designs of the amendments (WP-11 §2.7, WP-13 AM-W13-01/-02, WP-14 AM-W14-04, WP-16 AM-W16-03, WP-19
AM-W19-06, WP-17 AM-W17-01).

## 1. Files

| File | Content |
|---|---|
| `src/apps/staff/home/inbox.ts` (new) | Route `admin.home`; `readInbox` (12 optional reads in parallel); `inboxContextOf`; group builders `inboxGroups`; `INBOX_GROUP_KEYS`, `INBOX_READ_LIMITS`, `BOUNDARY_WORDS` |
| `src/apps/staff/home/inbox-page.ts` (new) | `decisionInboxPage`, `primaryGroup`; `INBOX_TITLE`, `INBOX_LEAD`, `NOTHING_WAITS` |
| `scripts/dev/gallery/inbox.ts` (new) | `inboxGalleryPages()` (5 pages); synthetic fixtures shared with the unit tests. Not registered |
| `test/unit/web/decision-inbox.test.ts` (new) | 29 tests |
| `test/unit/bff-inbox.test.ts` (new) | 10 tests, scripted Core |

No change to any existing file. No CSS, no `src/web/ui/**`, no `DESIGN.md`.

## 2. Items for U6 and the architect

| Item | Action |
|---|---|
| Route registration | Add `...adminHomeRoutes()` (from `src/apps/staff/home/inbox.ts`) to `staffRoutes()` in `src/apps/staff/instance.ts`. |
| Inventory | Row D01 (`GET /admin`, `queue.read`): add `{ id: 'admin.home' }`. The route declares exactly that method, path, surface and action. |
| Resource (Q-W06-11) | `resolve: () => ({ type: 'self' })`, as `admin.applications.list`. Checked: `queue.read` is `{ superadmin: 'any' }`; the relation `any` holds for a `self` resource, so `self` is not refused. The BFF authorizes nothing itself; Core authorizes each read. |
| Shell value | `SURFACE_CONFIG.admin.home` `/admin/monitors` → `/admin` (architect, design §1.3). |
| Gallery | Register `inboxGalleryPages()` (`inbox.html`, `inbox-nothing.html`, `inbox-one-unavailable.html`, `inbox-unavailable.html`, `inbox-capped.html`). U1 did not run the browser sweep (no axe, no screenshots); the five pages render, each with one `h1`, no inline script and no inline style. |
| Nav counts | No change. The counters in `attention.ts` read the same views; one request shares them, so a failed read is "Unavailable" in the page and `null` in the rail. |
| Primary action class | `p.inbox-primary` has no CSS rule. It renders as a normal paragraph. A spacing rule is optional (`components.css`, architect). |

## 3. Groups and states

Fixed order (17 groups: the design's 16 plus D-19 after group 8). "#" is the design's group number (8a: D-19). Every read is
optional (`optionalView`).

| # | Key (`#inbox-<key>`) | Source | Count and lines |
|---|---|---|---|
| 1 | `operator-not-active` | `core.assignment_queue` rows, `assigned_operator_id ≠ null` | `partCount` applications; total `unownedWaits.assignedOperatorInactive`; items "Reassign" → SA-03c |
| 2 | `waiting-for-operator` | rows, operator null, reason ∈ {`awaiting_assignment`, `gate1_payment_not_received`} | `partCount`; lines "Service payment received", "… not received or not recorded" (each by filter, never by subtraction); total `superadminQueue`; items "Assign" → SA-03a with the Gate 1 fact |
| 3 | `approved-help` | rows, reason `assistance_approved` | `partCount`; items "Assign" → SA-03a |
| 4 | `help-requests` | `core.admin_queue {assistance}` | `listCount` (200); items "Decide" → `#assistance` (carried WP-09 form) |
| 5 | `flags` | `core.admin_queue {flags}` | `listCount` "flags open"; line "Waiting for your response" (`nextActionCode = respond_to_flag`); "Respond" → `#holds` on those rows only |
| 6 | `deferrals` | `core.admin_queue {deferrals}`; `monitors.deferralReviewsDue` | lines "Proposed, to decide" (reason `deferral_proposed`), "Reviews due"; proposed items "Decide" |
| 7 | `second-approvals` | `pay.finance_index.requests` (1000); `iam.admin_elevations.open` (500) | two lines; "[k] of them requested by you: a different SuperAdmin decides those." when k ≥ 1 ("Of those shown, …" at the cap) |
| 8 | `impact` | `cat.admin_index.rows[].openItems > 0` (D-18) | `partCount` offerings (5000); items → SA-05b `#assessments`; note "A transition that the travel agent declined is not counted yet." |
| 8a | `suspended-offerings` | `ops.launch_overview` rows, `suspension_state = active` (D-19) | `partCount`; items "Check treatment" → SA-05h `#existing-work`; never "held" or "continues" |
| 9 | `import-issues` | `intake.admin_incidents` (open only) | `listCount` (500) "import issues open" |
| 10 | `incidents` | `ops.admin_incidents` (open only, 500); `monitors.incidents` (D-17) | lines "Need a SuperAdmin" (`readerActsOn`, the nav count's rule, `partCount`), "Open in total" (`listCount`), four by-kind lines (null → "Unavailable") |
| 11 | `payment-follow-up` | `monitors.unpaidOverrides`, `.unownedWaits.followUpOwnerInactive`; `pay.finance_index.followUp.mine` (D-21) | count; "Oldest opened [time] IST"; "Accountable SuperAdmin not active" → SA-07f `?state=open`; "Yours" → `?state=mine` |
| 12 | `external-uncertainty` | `monitors.externalUncertainty` (D-14, D-22) | four lines; the email line is the all-time count; its link → SA-02f `#uncertain` only while `/admin/queues/delivery` is served |
| 13 | `boundary` | `monitors.pendingBoundary` (projection) | AM-W19-06 lines; LD-04 note; lag line from `freshnessText`; link → SA-02f `#boundary` only when served |
| 14 | `travel-dates` | `monitors.travelDateRisk` (null → "Unavailable"), `.travelRechecksPending` | two lines; link `?recheck=pending` |
| 15 | `protection-marks` | `monitors.activeProtectionMarks` (D-14) | count; link SA-04l `?owner=superadmin` with an interim note |
| 16 | `reporting-gaps` | `monitors.reportingGaps`; `doc.queue.entries` (200, D-17) | lines with the view names; "Document checks that could not finish" (`listCount`, "200 or more") → SA-08d |

Group state (from every count the group states: its count, its total, its labelled lines):

| State | Rule | Page |
|---|---|---|
| work | a count above zero, or a list at its limit | section; can be the primary action |
| none | every count is a known zero (`isKnownZero`) | "[Title]: none" under "Nothing waiting now" |
| unknown | no count above zero and one unreadable count or "0 shown" | section; never "none"; never the primary action |

- A group whose every count is unreadable shows one "Unavailable" with "This count cannot be read now." and its links.
- The primary action reads "Open [title]" and leads to the first item's action (SA-03c, SA-03a, …), else the item's page,
  else the group's first link. A work group without any target (group 13 before SA-02f) is skipped.
- Every group "none": the line "Nothing waits for a SuperAdmin now." above "Nothing waiting now". No "All done".
- Every read unavailable: 17 "Unavailable" sections, no primary action, status 200.
- An access, session, maintenance or support-view refusal of any read: the shell's page (tested on two reads, four kinds).

## 4. Decisions within the unit

- **Totals decide the state.** A group is "none" only when its total is also zero. Reason: the page never says "none"
  beside a positive count of the same group. Effect: a positive monitors total with zero queue rows keeps groups 1 and 2
  as sections with work; the primary action then opens the queue.
- **Links to later pages are guarded with `hasPage`.** SA-03a and SA-03c fall back to `/admin/applications/<id>#assignment`
  while not served; SA-02f links appear only when `/admin/queues/delivery` is served. The incidents link stays
  `/admin/incidents` (WP-14 adds `?view=superadmin`).
- **Units.** The design's words are kept: a line whose label names the counted noun has no unit ("Acts whose filing is
  unknown: 1"); other lines name the unit ("Reviews due: 1 deferral", "Custody incidents: 1 open").
- **D-19 wording.** "New work is refused. Check what happens to existing work." (AM-W13-02 says "check how existing work
  continues"; the word "continues" is dropped because the overview carries no treatment).
- **Group 1 link** goes to `/admin/queues/assignment#operator-not-active`. It depends on U2's section id (design §2.2.1 item 7).

## 5. Findings and deviations for the architect

| ID | Rank | Finding | Scenario | Proposal |
|---|---|---|---|---|
| U1-01 | P2 | D-23 (c) asks group 6 "Decide" → SA-09d `deferral_approve`. U4 serves only the Gate 1 kinds, so that address answers 404 until WP-17. | A SuperAdmin selects "Decide" on a proposed deferral and gets the not-found page. | U1 keeps the label rule of D-23 (b) and links `/admin/applications/<id>#deferral` (the carried WP-17 form). WP-17 U5 changes the link in `deferrals()` (one place). U2 SHOULD do the same on SA-02d. |
| U1-02 | P2 | D-14 note "Held applications show 'Held after a restore' as their reason." is not verified: that phrase is the case page's callout title; the list's reason words were not checked. | The note names words the list does not show. | U1 uses "No list of only the held applications exists yet: they are among the applications waiting for a SuperAdmin." WP-11 can restore its sentence when it verifies the list words. |
| U1-03 | P2 | Group 2 counts only reasons `awaiting_assignment` and `gate1_payment_not_received` (design §2.1). Core also lists submitted unassigned rows with other reasons (price decision, transition, held correction, protection mark, help requested). Acceptance A03 says group 2 counts the SA-02a "Waiting for an operator" rows that are submitted. | A submitted unassigned application with an open price increase is on SA-02a and in the monitors total, but not in group 2's count. | Keep the design's partition (Core field). The PM aligns A03 to "rows whose next step is assignment", or the architect widens the set. |
| U1-04 | P2 | One landing makes 12 reads (design: 10). D-17, D-18 and D-19 add `doc.queue`, `cat.admin_index` (up to 5000 rows) and `ops.launch_overview` (up to 5000 rows). | A large catalogue makes every SuperAdmin landing slower. | Measure on `lane-ui`; STOP-W06-04 (inbox projection) stays parked until a measurement justifies it. |
| U1-05 | P2 | D-22 email count is all time (F-W19-06). While it is above zero, group 12 never moves to "Nothing waiting now". | One old uncertain send keeps the group visible forever. | Accept (the label says "recorded in total"); revisit with a Core count of open uncertain sends. |

## 6. Checks run

- `node --test test/unit/web/decision-inbox.test.ts test/unit/bff-inbox.test.ts`: 39 tests, 39 pass.
- `npx eslint --max-warnings=0` on the five U1 files: pass.
- `npm run typecheck`: no error in a U1 file. The tree fails at check time on `scripts/dev/gallery/service-payment.ts:185`
  (`ServicePaymentReceipt | undefined`), a U5 file in progress; one run between U5's edits passed with 0 errors.
- `node --test "test/static/**/*.test.ts"`: 74 tests, 73 pass, 1 fail: `route_without_id` at
  `src/apps/staff/assignment/routes.ts:175`, a U3 file in progress. No U1 file is reported.
- Gallery: the five pages render through a scratch script (outside the repository); each has one `h1`, no inline script,
  no inline style. No browser, axe or screenshot run.
