# WP-06 U6 notes: wiring and system tests

Unit U6 of WP-06. Author: the U6 engineer, 13 October 2026. Input for the architect's integration. U6 commits nothing.
Base: lane commit 0e38a04 (dc313f6 plus the multipart fix), with U1 to U5 and other packages' units uncommitted in the
tree. Binding inputs: `WP-06-design.md` §1.2, §1.5, §7.1 (U6 row), §7.2, §7.3; `WP-06.md` §3, §4, §6; `WP-06-U0-notes.md`
to `WP-06-U5-notes.md` (items for U6).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/instance.ts` | Registers `adminHomeRoutes()`, `workQueueRoutes()`, `assignmentRoutes()` and `adminDecisionRoutes({ kinds: [...GATE1_DECISION_KINDS], carriedGrant: carriedGrantRefusal })`, directly after `adminCoreRoutes()` (same surface group). |
| `src/apps/staff/core/admin.ts` | Removed: the assignment queue, the three simple queues, the plan preview page, `planRequest`, `planInput`, `planAgain`, `PROBLEM_TEXT`, `QUEUE_TITLES`, `QUEUE_PATHS`, `applicantOf`, `APP_ID`, `ACC_ID`, and the routes `admin.queues.*` (4), `admin.assignments.preview`, `.selection`, `.round_robin`, `admin.applications.assign`, `.reassign`, `.grant_exception`, `admin.gate_exceptions.revoke`; `DONE` loses `assigned`, `reassigned`, `plan`, `revoked`. Case page: section "Assignment" states "Operator: [name]" or "No operator assigned" and links "Assign an operator" (SA-03a) or "Reassign" (SA-03c); section "Gate exceptions" keeps the open exceptions read only with a "Revoke" link per row (SA-09r, hidden context names gate and action), two links "Gate 1 exception for assignment" / "for first operator work" (SA-09g), and the carried grant form with its selects narrowed to Gate 2 and readiness values. Each link shows only while its page is registered. New export `carriedGrantRefusal` (today's answer of the carried form). Header comment rewritten. |
| `src/web/route-inventory.ts` | D01 gets id `admin.home`. New GET rows D131 `admin.applications.assign_form`, D132 `admin.applications.reassign_form`, D133 `admin.decisions.application`, D134 `admin.decisions.application_subject` (all `superadmin`, no support view). |
| `src/web/ui/shell.ts` | `SURFACE_CONFIG.admin.home`: `/admin/monitors` → `/admin` (one value). |
| `src/apps/shared/common-routes.ts` | `resultHrefOf`: resource `queue` named `assignment` → `/admin/queues/assignment` (label "Assignment queue"); other queues keep no link. |
| `static/js/enhance.js` | Batch bar handler (`initBatch`, `updateBatch`, delegated `change` listener): "Selected on this page: [n] [unit]" (singular for 1), polite announcement through `#toast-region`, no focus move, the "select every" box shown and limited to the boxes of `data-batch-for` with `data-batch-name`, indeterminate when some are checked; the line's `output` gets `aria-live="off"` so a change is said once. Header comment lists the feature. |
| `src/web/ui/page.ts` | Crumb fix: `Crumb.href` optional; a crumb without `href` renders as muted text, not a link. |
| `src/apps/staff/core/admin-context.ts` (U0 file) | `WORK_QUEUE_CRUMBS`: "Work queues" without link, "Assignment" links the queue once. |
| `src/apps/staff/queues/pages.ts` (U2 file) | Smallest fixes: the "Work queues" crumb of the four queue pages has no link (it linked SA-02a to itself); SA-02d "Decide" always links `#deferral` on the case page (removed `DEFERRAL_DECISION_KIND` and its `hasPage` switch). |
| Public-fit scrub (comments and test titles only) | Page codes and a package name removed from `src/apps/staff/home/inbox.ts` (2 comments), `src/apps/staff/queues/pages.ts` (7 comments), `scripts/dev/gallery/work-queues.ts` (1 comment), `test/unit/web/work-queues.test.ts` (4 `describe` titles). No behaviour change. |
| Tests | See section 2. New: `test/unit/web/carried-forms-assignment.test.ts`. Fixture: `test/system/refusals.test.ts`. |

No change under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`, `migrations/`,
`src/apps/staff/decisions/*`, `src/apps/staff/payments/*`, `src/apps/staff/work/*`, `src/apps/staff/operations/*`, CSS, the
gallery registry or `DESIGN.md`.

## 2. Pins changed (old → new, reason)

### Unit and UI tests

| Test | Old | New | Reason |
|---|---|---|---|
| `test/unit/web/signed-in.test.ts` "each role sees its destinations" | `Home /admin/monitors` | `Home /admin` | `admin.home` is registered; Home links its first registered page. |
| `signed-in.test.ts` "land each surface" | admin home `/admin/monitors` | `/admin`; added: Home members are `/admin`, `/admin/monitors` | SuperAdmin landing (Q-W06-03). |
| `signed-in.test.ts` "the context selector" | Administration → `/admin/monitors`; fixture pages without `/admin` | → `/admin`; `/admin` added to the fixture pages | The selector links each context's landing page, listed only when served. |
| `test/unit/web/access-states.test.ts` "a person with two contexts" | selector and brand `/admin/monitors`; rail includes `/admin/monitors` | `/admin`; scripted BFF also serves a shell page at `/admin` | Same landing change. |
| `test/unit/web/work-queues.test.ts` SA-02d | proposed deferral "Decide" → `/decide/deferral_approve` (with the decision route registered) | → `/admin/applications/<id>#deferral`; titles reworded | U2 P1 decision (`WP-06.md` §6): no link to a kind that answers not-found until the deferral kind exists. |
| `work-queues.test.ts` SA-02a header | crumb text only | adds: the breadcrumb has no link | Crumb fix (U2 P2). |
| `test/unit/web/queues.test.ts` crumb test | labels only | adds hrefs `[none, /admin/queues/assignment, application]` and the rendered trail (one queue link) | Crumb fix (U0 P2). |
| `test/unit/web/status-pages.test.ts` result map | no `queue` rows | `queue/assignment` → `/admin/queues/assignment`; `queue/incidents` → none | `resultHrefOf` mapping. |
| `test/unit/web/routes.test.ts` | no admin row pins | new test: D01, D131 to D134 at path, action, `superadmin`, no support view; the POST commands of the forms; queue ids kept; admin surface 58 GET and 80 POST, reserved without id D06, D08, D09, D117, D123 | Inventory rows of U6. |
| `test/unit/bff.test.ts` | — | new test: the 16 WP-06 route ids are served at staff only, once each; the landing is served | Registration. |
| `test/ui/gallery.test.ts` | — | new describe "the batch selection bar" (2 browser tests, product CSP) | Batch bar script. |

### System tests (design §7.3)

| Test | Old | New | Reason |
|---|---|---|---|
| `core-pages.test.ts` "records the service payment … assigns one application" | Gate 1 sentence and assign form read from the case page; `doesNotMatch /Assignment is not available now/` | Case page: link to SA-03a, no assign form. SA-03a: "service payment has not been recorded as received", "Assigning this application is unavailable until the service payment is recorded as received or a Gate 1 exception is granted for this application.", no form; after the payment `doesNotMatch /Assigning this application is unavailable/`; location `…/assign?done=assigned&op=<key>`; receipt "Request recorded". DB assertions unchanged. | Assign moved to SA-03a (D-W06-07); neutral receipt (D-02). |
| `core-pages.test.ts` "assigns an unpaid application only under a gate exception" | Grant on the case page with typed `gate`/`action`; location `…?done=granted`; flash "The gate exception was granted for one use"; assign from the case page | SA-03a blocked sentence and SA-09g link; grant from SA-09g `gate1_assignment`, its hidden `gate`/`action` asserted, only `reason` typed; location `…/decide/gate1_assignment?done=granted&op=<key>`; receipt "Request recorded" and "This exception does not pass Gate 2"; assign from SA-03a. DB assertions unchanged. | Grant moved to SA-09g (D-W06-04). |
| `core-pages.test.ts` round-robin plan | "Choose at least two operators for a round robin"; "Round-robin plan"; "Will be assigned"; location `/admin/queues/assignment?done=plan` | "A round robin needs at least two operators"; "Assignment plan: round robin"; "Assignable now: 1 of 1 application."; "TravelMudra checks every application of this plan again"; location `/admin/assignments/selection/preview?done=plan&op=<key>`; result "Assignment plan confirmed", "Assigned 1 application", "Not assigned 0 applications". DB assertion unchanged. | SA-03b copy (F-W06-01) and result mode (D-W06-06, D-01). |
| `core-pages.test.ts` "reassigns" | Reassign form read from the case page | Case page links SA-03c; form read from SA-03c; location `…/reassign?done=reassigned&op=<key>`. Other assertions unchanged. | Reassign moved to SA-03c. |
| `core-pages.test.ts` documents (`s.d`), `ta-documents-originals.test.ts`, `case-work.test.ts`, `delivery.test.ts`, `payments-views.test.ts` (assign of `app1`) | GET the case page, then post assign | GET SA-03a, then post assign | Assign moved to SA-03a. `case-work` and `payments-views`: only that line. |
| `case-rules.test.ts` (three sites) | Grant (both Gate 1 actions), assign and reassign from the case page | Grant from SA-09g by kind (`gate1_assignment`, `gate1_first_work`; first site asserts the hidden pair and the receipt location), assign from SA-03a, reassign from SA-03c | Same moves. |
| `document-decisions.test.ts` | Grant and assign from the case page | SA-09g and SA-03a | Same moves. |
| `flows.test.ts` landing | `/admin/monitors` | `/admin` | Landing (Q-W06-03). |
| `browser.test.ts` two sign-ins | `waitForURL(…/admin/monitors)` | `waitForURL(…/admin)` | Landing. The coordinator's services-page lines in the same file are untouched. |
| `refusals.test.ts` route sweep (fixture, not an assertion) | Every route took the shared parameters: `kind=launch`, `subjectId=<account>` | `ROUTE_PARAMS`: `admin.decisions.application` takes `kind=gate1_assignment`; `admin.decisions.application_subject` takes `kind=revoke_exception`, `subjectId=<gex reference>` | The decision routes check their parameters first (an unknown kind or a subject of another kind is the uniform 404, design §1.2), so the sweep needs well-formed values, as it already supplies for every other route. The anonymous, wrong-role, suspended and support-view assertions are unchanged. |

Not changed: the queue link assertions `a[href="/admin/applications/<id>"]`; the carried assistance, flag and deferral
posts from the case page; `/admin/monitors` reads; the DB assertions of every moved test. No assertion was weakened.

## 3. Decisions

| Decision | Reason |
|---|---|
| The new carried-form test is `test/unit/web/carried-forms-assignment.test.ts`, not `carried-forms-wp06.test.ts`. | The brief forbids internal identifiers in file names; the name follows `carried-forms-admin` / `carried-forms-ta` (one per area). It covers design §7.2: the SA-07a correction form (by `kind=correction`) and the `#bn-refund`, `#bn-accounts`, `#bn-fee-exclusion` notices without controls; the narrowed grant form (gates exactly Gate 2 and readiness, no Gate 1 action); the carried assistance, flag and deferral forms with their route tokens; no `…/assign`, `…/reassign` or `/admin/gate-exceptions/…/revoke` form on the case page (unassigned and assigned); the links; no links when the pages are not registered; the carried grant route keeps `?done=granted` and its host page on refusal, while a Gate 1 pair answers on SA-09g with `&op=`. |
| Crumb fix: "Work queues" is an unlinked area crumb; "Assignment" links the queue once. | The destination has no page of its own. This keeps the trail text "Work queues › Assignment › [applicant]" (pinned by WP-07's `decision-kinds-gates.test.ts:228`) and needs one optional field on `Crumb` (backward compatible). The queue pages' own "Work queues" crumb no longer links SA-02a to itself. |
| SA-02d "Decide" links `#deferral` unconditionally. | `hasPage` checks the route pattern, not the kind; after U6 the pattern is registered for Gate 1 kinds only. The inbox (U1) already links `#deferral`. WP-17 changes one line when it adds the kind. |
| Case page links are guarded by `hasPage`. | No link to a missing page (DESIGN.md); the carried-form test proves both cases. |
| The batch bar line reads "Selected on this page: 0 applications" with JavaScript when nothing is checked, and counts boxes checked from the address on load without announcing. | One wording (`WP-06.md` §6); an announcement on load would interrupt the page's first reading. |
| `aria-live="off"` on the batch `output`. | `output` is an implicit status (polite) region; the announcement region already says the change, so a screen reader would hear it twice. |
| Browser test of the script in `test/ui/gallery.test.ts`. | That file is the existing enhancement-script test (real browser, product CSP); the fixture is rendered from the U0 components, so it does not depend on gallery registration. |
| `resultHrefOf` label "Assignment queue". | The plan result's resource is the queue; the operation page reads "Recorded result: Assignment queue" with a link to it. |

## 4. Checks run (final tree, 13 October 2026)

| Check | Result |
|---|---|
| `npm run typecheck` | Pass (0 errors). |
| `npm run lint` | Pass. |
| `node --test "test/static/**/*.test.ts"` | 74 tests, 74 pass. |
| `npm run test:unit` | 1978 tests: 1971 pass, 5 fail, 2 todo (existing `bff-services` and `individual-intake` todos). The 5 failures are outside U6 (below). |
| `npm run test:ui` | 2738 tests: 2733 pass, 4 fail, 1 todo. The new browser tests (batch bar, 2) and `carried-forms-assignment` (7) pass. The 4 failures are outside U6 (below). |
| `npm run test:system` (once, whole suite, `TMPDIR=/tmp/w6u6sys`) | 177 tests: 168 pass, 9 fail. 5 failures were U6's (`refusals.test.ts`: the decision routes' parameters, section 2); after the fixture fix `refusals.test.ts` alone: 8 tests, 8 pass. Every moved test in `core-pages`, `case-rules`, `document-decisions`, `ta-documents-originals`, `payments-views`, `flows` and `browser` passes. The other 4 failures are outside U6 (below). |

Failures outside U6 (not fixed; first assertion):

| Test | First assertion | Area |
|---|---|---|
| `test/unit/seo-record.test.ts:72` "names the current renderer digest …" and "the committed crawl record matches the tree" | `rendererSha256` stale | The renderer digest covers `src/web/public/**`, `static/css/*.css`, `static/fonts`; `static/css/components.css` changed in the tree (not U6). Regenerate after the integration commit. |
| `test/unit/web/application-workspace.test.ts:418`, `:452`, `:495` | `:420` `#closure a[href=…/delivery]` count `0 !== 1` (first test) | Travel agent's application page (`src/apps/shared/core/ta.ts`, "Result and delivery" rebuild in the tree). |
| `test/unit/web/carried-forms-ta.test.ts:241` | `:243` "the delivery page" `0 !== 1` | Same. |
| `test/system/case-work.test.ts:235` and `:461` | `:270` "the docket offers the download" | Travel agent's docket link to the delivery page (same rebuild). |
| `test/system/delivery.test.ts:114` | `:120` `/Who starts sending a result by email is not decided yet/` on the travel agent's delivery page | Delivery pages (`src/apps/shared/delivery/pages.ts`, in the tree). |
| `test/system/delivery.test.ts:186` | `:211` operator delivery page breadcrumb `a[href="/ops/applications/<id>"]` text `/Syndeliver/i` is empty | Staff delivery routes (`src/apps/staff/delivery/routes.ts`, in the tree). The assignment step before it (moved to SA-03a) passed. |

## 5. Open items

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Case page assignment link while blocked | P2 | An unpaid application's case page offers "Assign an operator"; SA-03a then shows the Gate 1 boundary and routes. One extra click compared with the old inline callout. | Accept (one host page per command). |
| Crumb component change is shared | P2 | Another package builds a crumb trail with an unlinked crumb by mistake (no `href`) and loses a link silently. | Accept; type documents the rule. The architect MAY add one line to `DESIGN.md` ("an area without a page of its own is an unlinked crumb"). |
| Crawl record stale | — | `seo-record.test.ts` fails on the renderer digest (CSS in the tree changed; `page.ts` too). | The architect regenerates the record after the integration commit, as for earlier style sheet changes. |
| Gallery registration | — | The WP-06 galleries (`queues`, `inbox`, `work-queues`, `assignment`, `decisions`, `service-payment`) are not in `scripts/dev/gallery-pages.ts`. | Architect. |
| `DESIGN.md` | — | The enhancement list in "Progressive enhancement" and the SuperAdmin landing row ("Monitors") now differ from the code. | Architect's single edit at the end: add "the count of the rows selected in a queue" and landing "Decision inbox". |
