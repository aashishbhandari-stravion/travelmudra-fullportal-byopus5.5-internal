# WP-07 U2 notes: OP-02 application workspace

Unit U2 of WP-07. Author: the U2 engineer, 13 October 2026. Input for the architect's integration and for U7. U2
commits nothing. Base: lane commit 101eff1 with the uncommitted U0 files (`reading.ts`, `readiness.ts`,
`money-panel.ts`, staff `bands.ts`). Binding inputs: `WP-07-design.md` §2.0, §2.3 to §2.5, §2.11 to §2.13, §7.1 (U2
row); `WP-07.md` §3, §4.1 to §4.12 (F-01, F-13, F-16 to F-19, F-21, F-24, F-29, F-31 to F-34, F-36 to F-39; the
amendments govern); `WP-17.md` O-06 (deferral words); `WP-12-design.md` §2.2, §2.9; `WP-14-design.md` §1.6.

## 1. Files

| File | Content |
|---|---|
| `src/apps/staff/work/workspace.ts` (new) | Frame (`workspaceFrame`, `workspaceTabs`, `protectedBanner`, `workspaceFacts`), the four tabs, carried forms by tab, receipts (`workspaceReceipts`, `establishedReceipt`), refusal words (`ownProblems`), `workspacePage`, `requestedTab`, `carriedFormTab`, `CARRIED_DONE`. |
| `src/apps/staff/work/workspace-routes.ts` (new) | `workspaceRoutes()` (GET `ops.applications.detail`; POST `ops.case_work.start_work`, `.work_step`, `.readiness`, `.withdraw_readiness`, `.effort`), `workspaceRerender` (carried forms), `workspaceInputRefusal`, `minutesOf`, `WORKSPACE_FORM_BODY_LIMIT` (16,384). |
| `scripts/dev/gallery/workspace.ts` (new) | 10 gallery pages, `workspaceGalleryPages()`; shared fixtures `galleryWorkspaceRequest`, `galleryWorkspaceRead`, `galleryProtectedCase`, `galleryDeliveryWork`, `galleryEvidence`, `galleryDeliveryPage`, `galleryReadinessReceipt`. Not registered. |
| `test/unit/web/operator-workspace.test.ts` (new) | 29 tests. |
| `test/unit/bff-workspace.test.ts` (new) | 13 tests (HTTP, scripted core). |

## 2. The page

Order in `main`: receipt (when the address names a checked one) → identity band (breadcrumb "My work" or
"Applications", "Read at [time] IST", staff meta: masked passport, service, kind, group, travel agent, operator) →
read-grant line (grant reader only) → error summary (after a refusal) → `workLayout`: main column = protected-state
banner, action panel ("Next action"), tabs, tab content; side column = status facts. On a phone the order is band →
banner → panel → tabs → content → facts (the design's mobile order). Tabs: Work, Application & documents, External
actions, Delivery & originals, History (when served); every link keeps `from=applications`.

| Tab | Sections (id) |
|---|---|
| Work | approved-help line; readiness checklist (`readiness-checklist`); money panel; Work (`work`: started time, steps, start form or blocked notice, step and effort disclosures); Readiness (`readiness`: facts, stale comparison, confirm form with visible review, withdraw `confirmDisclosure`); Holds (`holds`: table with the carried resolve form; links Return to TA / Return for TA review, Flag to SuperAdmin); Travel-date recheck (`travel-recheck`, in place); Timing (`timing`); Deferral (`deferral`); Ending the case (`ending`) |
| Application & documents | Applicant in full (`applicant`, the only place with the full passport number and date of birth); Documents (`documents`: staff downloads by release check, carried upload during approved help); Related applications (`related`); Price and timing (`price`, no "due"); Assistance entry (`assistance-entry`, carried) |
| External actions | money panel; External acts (`acts`: mode line, acts table with "Open the act record", acts the operator may request with "Request authorization for the [act]", the fee act hidden line, Packet `packet` with carried build and release for preparation only) |
| Delivery & originals | Delivery and completion (`completion`, link to the delivery page); Official result and files (`artifacts`: carried result, replacement, cancellation, wrong-recipient report); Originals (`originals`: "Custody now" facts, return boundary, link to the originals page or the carried forms); Incidents (`incidents`: rows link the incident page; open form or link); unavailable boundaries |

Action-panel rows come from `actionPanelReading` (U0): 1, 2, 3/3a/3b, 4, 5, 6/6a/6b, 7, 8/8a/8b, 9, 10/10a/10c/10d/10h/10p/10r,
11. The blocker words, the reading's lines and the review point ("Review point: [date]") render in the panel's
notice; row 10p renders its `boundaryNotice`. Actions and secondary links show only for the assigned operator outside
a support view; a reader under a read grant gets no panel.

## 3. Receipts (Work tab; location `/ops/applications/<id>?tab=work&done=<code>&op=<key>`)

| Code | Expectation (resource `application`, path id) | Named when | Title | Facts |
|---|---|---|---|---|
| `work_started` | `stepId`, no `packetId` | the step row with that id is `_work_started` | Work started | Started at; Current Gate 1; Current next step |
| `step` | as above | the row has a declared (not reserved) code | Step recorded | Step, State, Note |
| `readiness` | `readinessId` | equals the current judgement's id | Readiness recorded | Recorded by, at, Note; Current readiness |
| `readiness_withdrawn` | `readinessId` | never (same shape) | Request recorded | Current readiness |
| `effort` | `sampleId` | its own key | Effort recorded | — |

Otherwise "Request recorded"; an unchecked read stays unchecked. No accepted time.

## 4. Carried forms by tab

| Tab | Action path (route) |
|---|---|
| Work | `…/holds/:holdId/resolve`; `…/travel-recheck`; `…/forecast`, `…/deferral`, `…/deferrals/:deferralId/end`, `…/applicant-withdrawal` (each replaced by a link once its GET page is served) |
| Application & documents | `…/assistance-entry`; `…/documents` (upload) |
| External actions | `…/packet/build`; `…/packet/release` |
| Delivery & originals | `…/official-result`; `…/artifacts`; `…/outcome`; `…/disclosure` (link once `/ops/applications/:applicationId/disclosure` is served); `…/originals`, `/ops/originals/:originalId/{movements,return,link}` (link once `/ops/applications/:applicationId/originals` is served); `/ops/incidents` open (link once `/ops/applications/:applicationId/incidents/new` is served) |
| Left the page | `…/return`, `…/flag` (OP-03), `…/acts`, `…/acts/:aut/evidence`, `…/reconciliation` (OP-04): tested absent |

A carried form's plain `?done=` redirect without a tab opens the tab that hosts the form (`requestedTab`) with its
one-line confirmation (`CARRIED_DONE`).

## 5. Decisions made in U2 (deviations for the record)

| ID | Decision | Reason |
|---|---|---|
| D-U2-01 | Application & documents keeps `documentsSection` (staff words, download by release check, carried upload), not CMP-02 `evidenceRows`. | `evidenceRows` has only reader-relative owners ("You"): on a staff page "You" would name the operator for the travel agent's step. |
| D-U2-02 | F-32, F-34 and F-39 links replace a carried form only when the target GET page is registered (`ctx.hasPage`); until then the carried form stays. The originals summary ("Custody now") always shows. | LD-07 and acceptance A34, A37: a carried form stays reachable until its package serves its page. |
| D-U2-03 | "Ending the case" under possible filing: a warning callout "Ordinary withdrawal is unavailable: a filing may have happened" + "Owner: you (reconcile the act)" + act record link, then the carried form under "Record the applicant’s request only". | `boundaryNotice` kinds (parked, known limitation…) would mislabel a protection. |
| D-U2-04 | The TravelMudra-filed context line reads "Government acts of this service are done by hand on the authority’s site. Authorization is permission to act, not evidence that the act happened." | F-33 class: "You perform the government acts…" reads as an instruction. |
| D-U2-05 | The approved-deferral banner item and the Deferral section use the O-06 sentence "Review on [date]; readiness, authorization and packet release remain held until the deferral is ended." The workspace overrides the banner text of `protectedStateItems` (see item 1 of §6). | WP-17 O-06 (everywhere); F-39 (b) as corrected. |
| D-U2-06 | Each GET reads only the optional blocks of its tab: documents on Work and Application; the delivery page on Application and Delivery (never in a support view); result types on Delivery when Core offers the result to the assigned operator; own grants for a grant reader only. | Fewer reads; each block keeps `optionalView`. |
| D-U2-07 | Effort minutes that are not a whole number are refused at the field before any command (the old handler dropped them silently); the withdraw route's `readinessId` is `zWireId('rdy')` (malformed → uniform 404, nothing sent). | No handler truncates or drops input. |
| D-U2-08 | A grant reader or support view keeps only the checklist routes that read (this page's tabs, act records); routes to pages that take a step are removed. | Design §2.0: no action link to a form page for a grant reader. |
| D-U2-09 | Start of work and readiness when blocked: a `blocked` callout (reasons, owner, route) with the `unavailableButton` described by it. | The design's CMP-10 text for a control that Core blocks; not a policy boundary. |

## 6. Items for the architect and U7

| # | Rank | Item | Proposal |
|---|---|---|---|
| 1 | P1 | `reading.ts` (U0) still says "Deferred: filing and packet release wait until [date] IST." (banner) and "Not met: deferred until [date]" (checklist); WP-17 O-06 asks for the held sentence everywhere. | Change both in `reading.ts`; then drop the banner override in `protectedBanner` (D-U2-05). |
| 2 | P1 (U7) | Wiring: register `workspaceRoutes()`; remove GET `ops.applications.detail` from `opsCoreRoutes()` and the five POSTs from `caseWorkRoutes()`; pass `workspaceRerender` to `caseWorkRoutes(rerender)` and call it from the carried routes of `ops.ts` (signature equals `CaseRerender`). The page renders forms of every carried route: each must stay registered, or `ctx.csrfToken` throws and the page answers 500 (the BFF test registers stand-ins). | — |
| 3 | P2 (U7) | History tab: wrap the history page with `workspaceFrame(ctx, { case, work, current: 'history', from })` (needs `core.ops_case` and `ops.case_work`). U3 and U4 build their own frame parts; one shared frame module at integration avoids two wordings. | — |
| 4 | P2 (U7) | System tests: `startAndReady` posts the readiness form (now a plain form, not a disclosure) and expects `?tab=work&done=…&op=`; carried redirects keep `?done=`. | — |
| 5 | P2 | `actionPanel` cannot show the reading's blocker words or a date-only review point: they render as lines in the notice (known, §6 of `WP-07.md`). | As noted. |
| 6 | P2 | The staff case read carries no synthetic flag: the band shows no "Synthetic" (acceptance A14). | Kind 1 fact on `core.ops_case`, or accept. |
| 7 | P2 | A POST loses `from=applications` (form actions unchanged): receipts and refusals land on the Work tab of My work. | Accept, or a hidden `from` field later. |
| 8 | P2 | `inputRefusal` now exists five times (`workspaceInputRefusal` here). | One helper in `shared/core/shared.ts` at integration. |
| 9 | P2 | U4's fallback authorize receipt (`?tab=acts&done=authorized&op=`, never served today) shows nothing on this page; the acts tab line does not consult the session's unresolved authorizations (OP-04a does). | Accept (U4 note). |
| 10 | — | Gallery: register `workspaceGalleryPages()` in `scripts/dev/gallery-pages.ts`. | — |

## 7. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree, last run). |
| `npx eslint --max-warnings=0` on the five files | Clean. |
| `node --test test/unit/web/operator-workspace.test.ts test/unit/bff-workspace.test.ts` | 42 pass. |
| `node --test "test/unit/web/**/*.test.ts" test/unit/bff-workspace.test.ts test/unit/nav-counts.test.ts` | 1249 pass, 0 fail, 1 todo (existing). |
| `node --test "test/static/**/*.test.ts"` | 74 pass. |
| Local render of the 10 gallery pages (scratch script: product CSP server, Playwright + axe) | Light and dark at 1440, 390, 360 and 320 px: no horizontal overflow, no serious or critical axe violation. Console errors appear only after axe runs (axe's own injected style and a `/fonts.css` request), none on a page load before axe. |

Not run: `npm run test:ui` (the pages are not registered), system tests (U7 wires the routes).
