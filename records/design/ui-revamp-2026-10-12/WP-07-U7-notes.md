# WP-07 U7 notes: wiring and system tests

Unit U7 of WP-07. Author: the U7 engineer, 13 October 2026. Input for the architect's integration. U7 commits nothing.
Base: lane branch `ui-revamp-2026-10-12` at 4479b6d, with the uncommitted WP-06 files, the WP-07 U1 to U6 files and the
WP-08 units in the tree. Binding inputs: `WP-07-design.md` §1.2, §1.5, §7.1 (U7 row), §7.2, §7.3; `WP-07.md` §3, §4
(F-01 to F-39), §6 (every row that names U7); `WP-07-U0-notes.md` to `WP-07-U6-notes.md`; the coordinator's message of
13 October 2026 (operator Services tests in `services-pages.test.ts`).

## 1. Files

### 1.1 Changed (product)

| File | Change |
|---|---|
| `src/apps/staff/instance.ts` | Registers `opsWorkListRoutes()`, `workspaceRoutes()`, `returnFlagRoutes()`, `opsActRoutes()`, `financeRoutes()`; decision kinds `[...GATE1_DECISION_KINDS, ...gateDecisionKinds]`; `caseWorkRoutes(workspaceRerender)`; `opsCatalogueRoutes()` no longer registered. |
| `src/apps/staff/core/ops.ts` | Rewritten to the carried routes only (resolve hold, approved-help entry, packet release, forecast, travel-date recheck, deferral, end of deferral, applicant withdrawal). Removed: GET `ops.work`, GET `ops.applications.detail`, POST `ops.applications.return`, `.flag`, `.authorize_act`, the old case page (`casePage`, `actForms`, `caseActions`), `workPage`, `workNeedingAttention` and its helpers, `opsCaseRerender`. Refusals re-render through `workspaceRerender`; every command goes through `sendWhole` (the `.slice()` of `packetId` and `basisCode` removed). |
| `src/apps/staff/operations/case-work.ts` | Removed the routes and the forms of start work, work step, readiness, withdraw readiness, effort, act evidence, reconciliation (moved to U2/U4) and `CASE_WORK_DONE`. `f()`, `instant()`, `numbers()`, `chosen()`, the replacement reference and `returnTo` read whole; every command through `sendWhole`. `caseWorkPanels` stays for the SuperAdmin case page (read only). |
| `src/apps/staff/attention.ts` | `/ops/work` count from `work/reading.ts` `workNeedingAttention`. |
| `src/apps/staff/identity.ts` | Removed the old `ops.grants` page (`opsGrantsPage`, `grantStateText`); U1 serves `ops.grants` (303). |
| `src/apps/staff/catalogue/ops-discovery.ts` | `opsCatalogueRoutes()` removed (routes retired); `OPS_SERVICES` and `OPS_CATALOGUE_PATH` kept because `scripts/dev/gallery/services.ts` imports them. |
| `src/web/route-inventory.ts` | O45 gets id `ops.applications.acts`; new O61 `ops.applications.list`, O62 `ops.applications.return_form`, O63 `ops.applications.flag_form`, O64 `ops.applications.act`, D135 `admin.finance.lower_form`, D136 `admin.finance.increase_form`, D137 `admin.finance.change_decision`; O58 and O59 deleted (retired). |
| `src/web/ui/shell.ts` | `SURFACE_CONFIG.ops`: "My work" (one member), new "Applications" (`/ops/applications`, icon `layers`), Services destination removed; no transitional ops member. |
| `src/web/ui/presentation.ts` | `nextActionLabel('perform_external_act')`: "Perform the authorised external act" → "Record what happened to the external act". |
| `src/apps/shared/core/shared.ts` | Spelling: `act_authorized`, `act_already_open`, `authorization_basis_changed`, `operator_work_authorized`, `ACT_STATE_LABELS.authorized` ("authorised" → "authorized"). |
| `src/apps/shared/whole-input.ts` | New option `rows: 'row'` (problems named by the row's whole path, for forms numbered like the command's list); `sendWhole` passes it. Default unchanged. |
| `src/apps/staff/assignment/routes.ts`, `src/apps/staff/decisions/routes.ts` | Local `inputRefusal`/`contractRefusal`/`sendWhole` removed; the shared module used. |
| `src/apps/staff/work/acts-routes.ts` | Local `inputRefusal` removed (shared `sendWhole` with `rows: 'row'`); new exported `unresolvedAuthorizations()` used by OP-04a and the External actions tab. |
| `src/apps/staff/work/acts-pages.ts` | `earlierBlock` exported; banner titles from `bannerTitle`. |
| `src/apps/staff/work/return-flag.ts` | Local `inputRefusal`/`sendWhole` removed; `FLAG_KNOWN_GAP` removed (uses `KNOWN_GAP_FIRST_WORK`); banner titles from `bannerTitle`. |
| `src/apps/staff/work/workspace-routes.ts` | `workspaceInputRefusal` removed (shared `sendWhole`); the acts tab reads `unresolvedAuthorizations()` before the case. |
| `src/apps/staff/work/workspace.ts` | Deferral banner override and local `deferralHeldSentence` removed; banner titles from `bannerTitle`; new exports `framedMain`, `workspaceRail`, `workspaceApplicantName`; `WorkspaceRead.earlier`; the acts tab shows the earlier-request notice and no offer while one is unresolved. |
| `src/apps/staff/work/reading.ts` | `deferralHeldSentence` (banner and checklist); `KNOWN_GAP_FIRST_WORK` exported; handoff banner words by shape; `WAITING_WORDS.unresolved_known_limitation` from the delivery boundary words; `bannerTitle` (one table for OP-02/03/04). |
| `src/apps/staff/views/cases.ts` | The operator history page is the History tab in the workspace frame (no change to the WP-08 Monitors lines). |
| `src/apps/staff/inbox/inbox.ts` (moved from its earlier folder by the coordinator; the edit moved with it) | Group "Second approvals": "Open Finance" → `/admin/finance#requests`. |
| `src/apps/staff/payments/admin.ts` | Removed `taFinancePage`, `financeIndexPage`, `CeilingFormState`, `feeTable`, `reservationTable`, `changeTable`, `ceilingRupeesField`, `reasonText`, `person`, the ceiling `DONE` codes, the ceiling paths and route ids; "Decide Gate 2" link on `applicationPaymentsPage`. |
| `src/apps/staff/payments/routes.ts` | Removed the six same-id finance routes, `renderTa`, `changeAnswer`, `paiseField`, `accountOf`. |
| `src/apps/staff/core/admin.ts` | Case page: generic "Grant a gate exception" form removed; `#gate-decisions` links from `gateDecisionLinks`; a refused out-of-table grant shows its refusal in the Gate exceptions section; "authorised" → "authorized". |

### 1.2 Tests

New: `test/unit/web/carried-forms-operator.test.ts` (4), `test/unit/web/handoff-wording.test.ts` (2),
`test/unit/bff-operator-carried-routes.test.ts` (6; the real `staffRoutes()` in front of a scripted core).
Changed: listed in §2.

## 2. Pins changed (old → new, reason)

### 2.1 Unit

| Test | Old | New | Reason |
|---|---|---|---|
| `bff-acts`, `bff-assignment`, `bff-decisions` | `inputRefusal`/`contractRefusal` from the route modules | `inputRefusal` from `shared/whole-input.ts` | One implementation. |
| `web/return-flag` | `FLAG_KNOWN_GAP` | `KNOWN_GAP_FIRST_WORK` (reading) | One text. |
| `web/operator-reading` (checklist) | "Not met: deferred until 20 Oct 2026" | "Not met: review on 20 Oct 2026; readiness, authorization and packet release remain held until the deferral is ended." | O-06 words in the reading. |
| `web/operator-reading` (banner) | "Deferred: filing and packet release wait until 20 Oct 2026 IST." | "Review on 20 Oct 2026; readiness, authorization and packet release remain held until the deferral is ended." | Same. |
| `web/operator-workspace` | `deferralHeldSentence` from workspace | from reading | Moved. |
| `web/signed-in` | ops rail `… Services /ops/catalogue`; transitional `ops My work: /ops/grants`, `ops destination Services`, `ops Services: /ops/catalogue` | `My work, Applications, Incidents and follow-up, Notices and account`; no ops transitional entry; no Services destination | Rail decision. |
| `web/my-work` | `a[href="/ops/applications"]` | `main a[href="/ops/applications"]` | The rail now links it too. |
| `web/routes` | SuperAdmin GET count 58 | 61; new test of O45, O61–O64, D135–D137 and the retired O58/O59 | New pages. |
| `web/carried-forms-assignment` | carried entry `core.grant_gate_exception`; "generic grant form offers only Gate 2 and readiness"; a Gate 2 grant keeps `?done=granted` on the case page | entry removed; no grant form, `#gate-decisions` links (Gate 2; readiness for `previous_operator`); Gate 2 and readiness grants answer on their decision pages; a hand-made pair keeps the plain redirect and shows its refusal in `#gate-exceptions` | Gate 2/readiness kinds registered. |
| `web/services-pages` (coordinator) | the operator's list, service and routes | one test: no staff route, no inventory row, no rail entry for `/ops/catalogue…` | Services retired. Travel-agent tests untouched. |
| `nav-counts` | — | new: a deferral before review, a dependency wait and a parked return are not counted; a due review is | F-07, F-16, F-30 through `STAFF_ATTENTION`. |
| `web/service-payment-page` | — | new: "Decide Gate 2" for blocked/unknown only, and only when the decision page is registered | A98. |
| `web/decision-inbox` | — | the "Second approvals" link is `/admin/finance#requests` | Inbox value. |

### 2.2 System

| Test | Old | New | Reason |
|---|---|---|---|
| `case-work` `opsWork` | `#assigned tr`, `tr.is-attention`, `#reviews` on `/ops/work` | the row in `#work-list` of the view that lists it; flagged = "Action now"; count from the view's count | OP-01. |
| `case-work` `staffDocket` | `.docket` | `.docket` (SuperAdmin) or `#next-action` (workspace) | OP-02 panel. |
| `case-work` `startAndReady` | `location === ${ops}?done=work_started` | `^${ops}?tab=work&done=work_started&op=<key>$` | U2 receipts. |
| `case-work` `authorize` | form from the case page | GET `…/acts?act=<kind>` | OP-04a. |
| `case-work` `filedCase` evidence | form from the case page | GET `…/acts/<aut>?record=evidence`; location `?done=evidence&op=` | OP-04b. |
| `case-work` result, disclosure, replacement, originals | GET case page | `?tab=delivery` | Hosting tab. |
| `case-work` document download | GET case page | `?tab=application` | Hosting tab. |
| `case-work` `#incidents` on `/ops/work` | incident row on the work page | the application is listed in My work; the incident is no continuing duty while its application is open work | OP-01 views. |
| `case-work` ceiling | forms on SA-07t | request from SA-07i, approve from SA-09c `approve_increase` | U6. |
| `case-work` fee authorize | case page | OP-04a | OP-04a. |
| `case-work` packet build and release | case page | `?tab=acts` | Hosting tab. |
| `case-work` handover | owner "Assigned to you", "Next step Record the handover" | owner "You", "Next step Record the packet handover" | Panel row 8a. |
| `case-work` originals words | "Physical originals", "Returning originals is unavailable until the return policy is decided" | "Originals", "Returning originals through TravelMudra is unavailable until the return policy is approved" | Workspace words. |
| `case-work` custody | `.docket`, `#assigned` row | `#next-action`; My work row in "Action now" with the incident link | OP-01/OP-02. |
| `payments-views` finance home | "Payment-missing follow-up (1 open)" | "Payment follow-up: 1 item open" | D-U6-09. |
| `payments-views` ceiling (both tests) | forms and texts on SA-07t; `?done=requested`, `?done=approved` on SA-07t; "The increase is in effect"; approval sent from SA-07t | SA-07t holds no form; "Default ₹0" in `#exposure-facts`; "The default ceiling is ₹0: it cannot be lowered."; request from SA-07i (`?done=requested&op=`); requester reads SA-09c "Approving is unavailable for you: you requested this increase"; approve from SA-09c (`<SA-09c>?done=approved&op=`, receipt "Ceiling increase approved"); lower from SA-07l (`?done=lowered&op=`), not-lower refusal names "(₹50,000.00)"; audit: approval form loaded on SA-09c, 503 kept, SA-07t says why; after the lowering the approval is posted from the form loaded before it (new `_op`): 409 "The ceiling changed after this request was made"; decline from SA-09c `decline_increase` | U6 §6.8. |
| `core-pages` | work link anywhere on `/ops/work`; `.docket`; return form on the case page, `location === …?done=returned`; flag from the case page | link inside `#work-list`; `#next-action`; no return form on the workspace, a link to OP-03r; return from OP-03r, `…/return?done=returned&op=`; flag from OP-03f, `…/flag?done=flagged&op=`; documents upload from `?tab=application` | OP-01/02/03. |
| `document-decisions` | no `…/acts` form on the case page and `sentence('operator_work_not_started')`; stale refusal `sentence('stale_revision')` | no form on the workspace; OP-04a `?act=government_submission` has no form and reads "Start work first."; stale: "This application changed after you opened the page. Nothing was authorized." | OP-04a. |
| `ported-pages` | `/ops/grants` 200 "Your read grants"; the operator Services discovery | `/ops/grants` 303 → `/ops/applications#read-only`, the section has no form; `/ops/catalogue…` 404, no rail link, rail links Applications | U1; retirement. |
| `case-rules` | assistance entry from the case page | `?tab=application` | Hosting tab. |
| `delivery` | operator case page links the delivery page; breadcrumb `a[href="/ops/applications/<id>"]` | `?tab=delivery` links it; breadcrumb href `…?tab=delivery` | The registered workspace (the delivery page's breadcrumb now names the tab). |
| `ta-documents-originals` | originals forms from the case page | `?tab=delivery` | Hosting tab. |
| `refusals` (every route walked with concrete parameters) | `kind` = `launch` for every route | `admin.finance.change_decision` gets `kind` = `approve_increase` | A new route whose `kind` is a closed set; otherwise its address is the uniform 404 before the session check. |

`three-instances.test.ts:154` (`/ops/grants` on edge answers 404) stays valid: edge serves no ops page.

## 3. Decisions

| ID | Decision | Reason |
|---|---|---|
| D-U7-01 | The shared `inputRefusal` gains `rows: 'row'` instead of keeping a second copy in `acts-routes.ts`. The act evidence and reconciliation routes use it, so a row's problem keeps its field (`evidence.2.note`); every other caller keeps the list naming, which equals the old copies' output (their commands have no list). | One implementation, no behaviour change. |
| D-U7-02 | Retiring the operator Services pages deletes inventory rows O58/O59 (an entry without an id means "not built yet"), unregisters the routes and removes `opsCatalogueRoutes()`. `OPS_SERVICES` stays for the services gallery. | Uniform not-found; the gallery is the services follow-up's file. |
| D-U7-03 | Carried form inputs whole: every part number token is sent (a token that is not a whole number goes as not a number, so the contract refuses `parts`/`receivedParts`); checkbox lists, the replacement reference (everything after the first ":" is the incident's) and every text go whole. | Lane input rule; refusal at the field, nothing cut or dropped. |
| D-U7-04 | The History tab reads the history, `core.ops_case` and `ops.case_work` (and, as the workspace does, the handover and a grant reader's own grants); title "History: [applicant]"; the old lead sentence becomes the section description; the rail follows `from`. | OP-02 frame on every tab. |
| D-U7-05 | The External actions tab checks this session's remembered authorizations with Core before it reads the case; while one is unresolved it shows the review's earlier-request notice, lists the acts as "not offered until the result of the earlier request is known" and links no request. | F-03 at every entry; same order as OP-04a. |
| D-U7-06 | Frame consolidation is limited to the banner titles (`bannerTitle` in the reading). OP-04's "Outcome unknown" becomes "Filing outcome unknown" or "Handoff outcome unknown"; OP-03's handoff item no longer reads "Filing outcome unknown". The status facts stay per page (§5). | F-06 class; the facts differ by unit decisions and would change outputs. |
| D-U7-07 | The checklist row reads the held sentence in lower case after "Not met:". | A row is "[status]: [evidence]". |
| D-U7-08 | "an owner not yet decided" → "a step that is not available in this release" (built from `LIMITATION_OWNER_WORDS.staff.label`). | WP-08 boundary words. |
| D-U7-09 | "Decide Gate 2" shows for Gate 2 `blocked` or `unknown`, only when the decision page is registered. | A98; the payment read has no service mode (§5). |
| D-U7-10 | The SuperAdmin case page shows `#gate-decisions` links (secondary buttons, as the Gate 1 links). Revoke links per granted row were already there (WP-06 U6). The assignment callout item was already done by WP-06. | U5 item. |
| D-U7-11 | Rail icon `layers` for Applications; the Originals destination is not added (WP-12). | Design §1.3. |
| D-U7-12 | Inventory refs O61–O64, D135–D137; the new ops pages carry who and support-view flag as O03; O45 keeps its declared who. | U1, U3, U4 notes. |
| D-U7-13 | Gallery registration of the WP-07 galleries (`my-work`, `workspace`, `return-flag`, `acts`, `decision-gates`, `finance`) and `DESIGN.md` are left to the architect. | Design §7.1. |

## 4. Checks run (13 October 2026)

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree, last run). |
| `npm run lint` | Clean (last run; an earlier run showed errors only in another writer's new `test/ui/travel-agent-fields.test.ts`). |
| `npm run test:unit` | 2042 tests: 2035 pass, 5 fail, 2 todo (existing). Failures, all WP-08: `web/application-workspace.test.ts:418` (actual 0, expected 1 at :420), `:452` and `:495` ("unexpected read dlv.delivery_page" from `shared/core/ta.ts` `resultOf`), `web/carried-forms-ta.test.ts:241` ("the delivery page", 0 ≠ 1), `seo-record.test.ts:72` (stale record; WP-08 CSS). |
| `node --test "test/static/**/*.test.ts"` | 74 pass. |
| `npm run test:ui` | `test/unit/web`: 1452 tests, 1447 pass, 4 fail (the WP-08 failures above), 1 todo. `test/ui` (browser sweep, run alone because it takes about 70 minutes): 1656 of 1656 pass. |
| `npm run test:system` | 177 tests: 168 pass, 9 fail. Five were `refusals.test.ts` (the new decision route's `kind`; fixed, then `refusals.test.ts` alone: 8 of 8 pass). The four left are WP-08: `case-work.test.ts:253` and `:480` ("the docket offers the download": the travel agent's application page no longer links `/ta/applications/<id>/delivery`), `delivery.test.ts:114` ("Who starts sending a result by email is not decided yet" absent from the travel agent's delivery page), `delivery.test.ts:186` ("Attributed record, not system-verified" absent from the staff delivery page after a direct external delivery). With the travel agent's assertions bypassed in a scratch run, `case-work.test.ts` passed every staff step up to the staff delivery page's `#record` (WP-08), so the operator's handover row 8a pins (owner "You", "Record the packet handover") were not reached. |

## 5. Open items

| Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|
| P1 | The carried approved-help entry (`ops.ts`) and the SuperAdmin correction still cut identity values: `identityChangesOf` in `core/case.ts` slices each value to its maximum and the evidence list to 4. | A crafted post sends a 101-character surname in an assistance entry: 100 characters are recorded as a change, without a refusal. The form's `maxlength` stops a browser user. | Whole values in `identityChangesOf` (refusal at the field). `case.ts` was edited by WP-08; the architect assigns it (WP-09 rebuilds the entry). |
| P2 | Carried routes keep 8,192-byte body limits for 2,000-character notes (resolve hold, forecast, deferral, end of deferral, withdrawal). | A 2,000-character resolution note in Devanagari (about 18 KB encoded) is refused with 413; nothing is cut. | Raise to 32 KB when each route's own page is built. |
| P2 | OP-04b names a contract problem by the row Core received; empty form rows are left out, so a later row's index shifts. | A crafted post with row 1 empty and an over-limit note in row 2 shows the problem at row 1. The inputs' `maxlength` equals the contract limit. | Map the compacted index to the form row in `acts-routes.ts`. |
| P2 | "a filing may have happened" still reads for a handoff-only case (panel blocker "Protected: …", the Ending-the-case boundary, OP-03r lines). True (the provider may file after a handoff) but not by shape as F-21 does for status sentences. | A third-party case with only a handoff in `filing_unknown`: the Work tab says "a filing may have happened". | Shape words with the next copy pass. |
| P2 | Status facts of OP-02, OP-03 and OP-04 are three implementations (U2 `workspaceFacts`, U3 `frameFacts`, U4 `frameFacts`). | OP-04 shows no "Next", "Stage" or "Editing" fact while OP-02 and OP-03 do. | One facts builder at the next OP-03/OP-04 change. |
| P2 | `caseWorkPanels` keeps form branches that only the operator surface rendered; only the SuperAdmin page calls it now. | None at run time (the branches are unreachable). | Remove when the SuperAdmin case page is rebuilt (WP-11). |
| P2 | `cat.ops_offering` loses its page consumer once the operator Services pages are retired (so does `cat.ops_offerings`); the staff allowlist still lists both. | None at run time; dead query names in the contract and allowlist. | Remove in a Core/contract task (frozen interface). |
| P2 | "Decide Gate 2" shows for Gate 2 `unknown` on any service; the payment read has no service mode. | A third-party service with an unreadable Gate 2 state shows the link; SA-09 then reads "Not filed by TravelMudra". | Accept, or add the mode to `pay.application_payments`. |
| P2 | Spelling left: three "authorised" strings in `core/case.ts` (SuperAdmin case page; WP-08-edited file) and `authorize_external_act: 'Authorise the external act'` in `presentation.ts` (the architect's one-value change). | The SuperAdmin case page reads "Authorised by". | Architect / next `case.ts` owner. |
| P2 | `ops-discovery.ts` remains for the services gallery's operator pages, which show retired pages. | The gallery renders "Services (operator)". | Drop those gallery pages and the module in the services follow-up. |

No P0.
