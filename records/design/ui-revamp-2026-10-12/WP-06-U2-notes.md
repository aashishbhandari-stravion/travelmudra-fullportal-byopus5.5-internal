# WP-06 U2 notes: SA-02 work queues

Unit U2 of WP-06. Author: the U2 engineer, 13 October 2026. Input for the architect's integration (U6 wiring, gallery
registration). U2 commits nothing. Base: lane commit 101eff1. Binding inputs: `WP-06-design.md` §2.0, §2.2, §4.6, §5,
§7.1 (U2 row); `WP-06.md` §3, §4.1 (D-06, D-07, D-13), §4.8 (D-23) as changed by `WP-17.md` O-06; `WP-06-U0-notes.md`
§2 and §4 (U2 row).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/queues/pages.ts` (new) | SA-02a to SA-02d page functions; the address parser of SA-02a; constants. |
| `src/apps/staff/queues/routes.ts` (new) | `workQueueRoutes()`: the four GET routes. Not registered. |
| `scripts/dev/gallery/work-queues.ts` (new) | `workQueuesGalleryPages()` (7 pages); exports the fixture `galleryQueueRow`. Not registered. |
| `test/unit/web/work-queues.test.ts` (new) | 29 tests. |

No change to `admin.ts`, `instance.ts`, `route-inventory.ts`, `src/web/ui/**`, CSS, `enhance.js` or `DESIGN.md`.

## 2. Exported API

```ts
// src/apps/staff/queues/pages.ts
ASSIGNMENT_QUEUE_PATH, HELP_QUEUE_PATH, FLAGS_QUEUE_PATH, DEFERRALS_QUEUE_PATH, PLAN_PREVIEW_PATH
QUEUE_LIMIT = 200                                   // Core's row limit; a test pins it to both contract maxima
PAYMENT_FILTERS = ['received', 'not_received', 'unrecorded']; PLAN_MODES = ['selection', 'round_robin']
assignmentQueueQuery(query): { payment; items; mode; operators }   // checked, deduplicated, bounded 200 / 50
assignmentQueuePage(ctx, v: core.assignment_queue, q)               // SA-02a
helpQueuePage(ctx, v), flagsQueuePage(ctx, v), deferralsQueuePage(ctx, v)   // SA-02b, c, d (core.admin_queue)
adminQueuePage(ctx, kind, v)                                        // dispatch by kind
servicePaymentCell(status); DEFERRAL_DECISION_KIND = 'deferral_approve'

// src/apps/staff/queues/routes.ts
workQueueRoutes(): GET admin.queues.assignment, admin.queues.assistance, admin.queues.flags, admin.queues.deferrals
```

The routes keep the ids, paths, action `queue.read` and resource `{ type: 'queue', name: 'assignment' }` of the
`admin.ts` routes (inventory rows D02, D03, D04, D07; a test compares them with `ROUTE_INVENTORY`).

## 3. Views and states

| View | Content | States |
|---|---|---|
| SA-02a Assignment | Lead; info notice "Assignment needs Gate 1"; GET filter `payment` (Any / Received / Not received / Not recorded, "Clear the filter" when set). Section `#waiting` (`assigned_operator_id = null`): Select, Application, Why it waits, Service payment (Gate 1), Action ("Assign"; when not `payment_received` also "Record the payment" and "Gate 1 exception" → `…/decide/gate1_assignment`); the table and `batchBar` in one GET form `#plan-form` to the plan preview (radio `mode`, none preselected, required; checkbox `operator` from Core's operators). Section `#operator-not-active`: no selection box; "Reassign". | Rows; S2 per section; S3 "No application matches this filter."; cap lines from `cap.read` = Core's row count before the filter ("[n] applications shown, from the oldest 200 applications read. More may be waiting. They appear as these are [re]assigned."); no operator → CMP-10 notice in place of the batch bar, no boxes, "Assign" links kept; prefill of `item`, `mode`, `operator` from the address (unknown references never echoed). |
| SA-02b Help requests | Lead with both cases of D-07; D-06 known-gap callout; Application, Status of the application, Service payment (Gate 1), "Decide" → `#assistance`. | Rows; S2; cap line. |
| SA-02c Flags | Application, Waiting for, "Respond" / "Open" → `#holds`. | Rows; S2; cap line. |
| SA-02d Deferrals | Lead (O-06 words); Application, Deferral, "Decide" → `…/decide/deferral_approve` for `deferral_proposed`, else "Open" → `#deferral`. | Rows; S2; cap line. |

Every row links the applicant once to `/admin/applications/<id>` (the system-test selectors stay valid). Read failure:
the route does not catch it; the shell answers (S7, LD-14). Gate 1 fact per row: "Received", "Not received", "Not
recorded" with the payment icon; a value outside the enumeration reads "Unavailable" with its reference code (A16).

## 4. Decisions within the unit

- **Links follow the registered pages.** "Assign" goes to SA-03a when `/admin/applications/:applicationId/assign` is a
  registered GET page, else to `/admin/applications/<id>#assignment` (today's form). "Reassign" likewise (`#assignment`).
  "Record the payment", "Gate 1 exception" and the group link show only when their pages are registered. "Decide" on
  SA-02d goes to the decision route when it is registered, else to `#deferral`. Reason: every integration order keeps a
  working route; no link to an unregistered page.
- **SA-02c "Waiting for".** "Your response" for `respond_to_flag`; "The operator, after your response" only for
  `hold_flagged_to_superadmin` with another next action; any other pending reason shows Core's sentence (Core puts price,
  transition and correction waits before the flag, `derived.ts:300-330`, so the design's fixed text could be false).
  Action "Respond" only while the response waits; else "Open" (WP-09 acceptance uses the same pair).
- **SA-02a "Operator no longer active" reason.** The design's sentence only for `assigned_operator_inactive`; another
  code shows Core's sentence.
- **Deferral words (O-06 over D-23).** The lead says "readiness, authorization and packet release remain held until the
  deferral is ended; the review date alone does not end it" (Core blocks all three while approved, `controls.ts:435-458`),
  in place of D-23's "holds filing and packet release only". The approved row reads "Approved. Readiness, authorization
  and packet release remain held until the deferral is ended." in place of "Approved: waits for its review". The row
  carries no review date (STOP-W17-10), so no "Review on [date]" is shown and none is invented.
- **SA-02b lead (D-07).** States both cases: approval on an application without an operator; approval on an assigned
  application whose work has not started needs the payment or a first-work exception (`assignment.ts:321-324`). The
  D-06 gap is a callout with boundary kind `known_limitation`, under the lead.
- **No-operator notice** uses boundary kind `known_limitation`, owner "SuperAdmin", route "Open the operator accounts"
  (`/admin/accounts?role=operator`, shown when registered).
- **Filter field** is a select with "Any" (`optional`, so the label reads "Service payment (optional)", as on the
  accounts list). A repeated `payment` or `mode` parameter counts as no value.
- The batch bar adds one muted line beside the button: "Nothing is assigned until you confirm the plan on the next
  page." The rule notice and the filter, and the SA-02b gap and list, sit in a `.stack` for spacing.

## 5. Items for U6

| Item | Detail |
|---|---|
| Register routes | Add `...workQueueRoutes()` to `staffRoutes()`; remove the four GET routes, `assignmentQueuePage`, `simpleQueuePage`, `QUEUE_TITLES`, `QUEUE_PATHS` from `admin.ts`. No inventory change (same ids). |
| `enhance.js` batch bar | For each `[data-batch-bar]`: count the checked `input[name=<data-batch-name>]` inside `#<data-batch-for>`; set `[data-batch-count]` to "Selected on this page: [n] [data-unit-one / data-unit-other]" (architect's wording, `WP-06.md` §6); announce it politely (`#toast-region`) without moving focus; unhide `[data-batch-select-all]` and let its box check or clear only those boxes; update on `change`. The box has an empty name and is never submitted. |
| Tests | No existing test calls the moved functions. `core-pages.test.ts` queue link selectors stay valid. |

## 6. Open items for the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| D-23 "Decide" target before WP-17 | P1 | After U6 registers `/admin/applications/:applicationId/decide/:kind` (U4's kinds only), a SuperAdmin selects "Decide" on a proposed deferral in SA-02d and gets the uniform 404 until WP-17 adds `deferral_approve`. `hasPage` checks the pattern, not the kind. Likelihood: medium once a deferral is proposed between the two integrations. | Accept (WP-17 follows; the applicant link still reaches the carried form), or have U6 point the link at `#deferral` until WP-17 (one line in `deferralsQueuePage`). |
| Acceptance wording | P2 | The PM checklist differs from the design and amendments: A15 row text vs Core's sentence; A20 "Approved, review on [date]" (no date in the read); A22 "Assign selected"; A25 "first 200" vs "oldest 200"; A14 price and TA columns. | PM aligns the rows (D-11 class). |
| SA-02b operator column | P2 | The D-07 lead names two cases, but a row does not say whether an operator is assigned; the SuperAdmin opens the case to tell. | WP-09 U6 adds the column (already planned). |
| "Work queues" crumb on SA-02a | P2 | The crumb links to the page itself (U0 P2 class). | U6's crumb fix covers it. |
| Gallery registration | — | `workQueuesGalleryPages()` is not in `scripts/dev/gallery-pages.ts`. | Register it. |

## 7. Checks run

- `npx eslint --max-warnings=0` on the four files: pass.
- `node --test test/unit/web/work-queues.test.ts`: 29 tests, 29 pass.
- `npm run typecheck`: pass on the tree with the four files (first run). A later run failed only in other units'
  in-progress files (`scripts/dev/gallery/assignment.ts`, `decisions.ts`, `service-payment.ts`); none of the U2 files.
- `node --test "test/static/**/*.test.ts"`: 74/74 on the first run. A later run: 73/74; the failure is
  `route_without_id src/apps/staff/assignment/routes.ts:175` (U3's in-progress file), not U2.
- Gallery: the 7 pages rendered in Chromium (Playwright, assets served from disk through request routing, no server)
  at 1440, 390 and 320 px: no horizontal overflow, no script error; axe (WCAG 2.2 A/AA and best practice) at 1440 and
  390 px: no violation. Screenshots of SA-02a (1440 px) and SA-02b (390 px) inspected.
