# WP-03 U3 notes: application workspace, Check and submit, help request, hand back

Unit U3 of WP-03. Author: the U3 engineer (Claude Opus 5.5 subagent), 13 October 2026. Input for the architect's
integration, the route registration (U7), the gallery registration and the `DESIGN.md` update. U3 commits nothing.
Base: lane HEAD e1f6ac9 plus the uncommitted work of the other units. Binding inputs: `WP-03-design.md` §1, §2.7 to
§2.9, §2.14, §2.15, §3, §5, §7, §9.1 (U3 row), §9.2, §9.3; `WP-03.md` §3 and §4.1 (C-02, C-03, C-05, C-07, C-08,
Q-W03-02, Q-W03-06); `WP-03-U0-notes.md` §2 and §4 (U0-08); `WP-10.md` §3 Q-W10-11 (relayed by the coordinator).

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/core/ta.ts` | TA-07 rebuilt (`applicationPage(ctx, v, options)`); loaders `applicationAgain`, `reviewAgain`, `helpAgain`; origin (`originCrumbs`, `originQuery`, both on U2's `listReturnOf` from `src/apps/shared/pages/applications-list.ts`; no own parsing of `from`); receipts (`workspaceReceipts`); `APPLICATION_PAGES`; GET routes exported, not registered (§4). Groups and lists unchanged (U1, U2 move them; U7 removes the old copies). |
| `src/apps/shared/pages/review-submit.ts` (new) | TA-08 `reviewSubmitPage`, `reviewMode`, `staleRows`; shared helpers for TA-07 and TA-07h: `editingText`, `helpText`, `helpOpen`, `caseName`, `isPolicyCode`, `policyCode`, `policyNotice`, `applicantRows`, `evidenceRowsOf`, `evidenceBlock`, `unlinkedRelations`, `blockerLists`, `partOf`, `refusalText`, `isStale`. |
| `src/apps/shared/pages/help-request.ts` (new) | TA-07h `helpRequestPage`, `helpState`. |
| `src/apps/shared/pages/authority-text.ts` (new) | Statement catalogue (C-08, Q-W03-02): `AUTHORITY_STATEMENTS`, `statementKey`, `statementText(code, version, environment)`. |
| `src/apps/edge/core/routes.ts` | `ta.applications.submit` and `ta.applications.hand_back`: refusal re-renders TA-08; `ta.applications.request_assistance`: refusal re-renders TA-07h; acceptance `receiptLocation('/ta/applications/<id>', 'submitted' / 'handed_back' / 'assistance', key)`. Command inputs, actions, fields unchanged. All other routes (including the old `edit` and `correct-identity`) unchanged. |
| `scripts/dev/gallery/application.ts`, `submit.ts` (new) | 12 + 10 gallery pages; not registered (§6). |
| `test/unit/web/application-workspace.test.ts`, `review-submit.test.ts`, `authority-text.test.ts` (new) | 39 + 29 + 5 tests. |
| `test/system/support/drafts.ts`, `test/system/core-pages.test.ts`, `case-rules.test.ts`, `case-work.test.ts`, `ta-documents-originals.test.ts` | Call sites of my moves only (§7.1). The edit, identity, upload and intake call sites are left for U4, U5 and U7. |

## 2. TA-07 Application workspace

Reading order (DOM order = mobile order, A109): receipt → identity band (`identityBand`: h1 name and reference,
breadcrumb by origin (`listReturnOf`: the applications list with its filters, or the search results; otherwise
"Groups › [group]"; the origin is carried on to TA-08, TA-07h and the task pages only when `listReturnOf` accepts it), "Read at", group link, service, lead for a draft) → error summary of a refused later-package
form → action panel (`#next-action`) → change notice (policy code in `correct.blockers`) → status facts (`#status`)
→ main column: Returned (`#returned`, note first) · Payment (when due) · Waiting for your decision (`#decisions` >
`#pending-work`) · Application (`#applicant`, read only, "Change the application" → TA-09t when `correct.allowed`;
passport-mismatch callout with links to TA-09i and TA-09f) · Documents (`#documents`, `evidenceRows` read only,
document and status first; "Add or replace documents" → TA-09f) · Originals · Price and timing (`#price`) ·
Payment (otherwise) · Related applications · Delivery and completion (`#closure`) → aside "Other actions" (help
link or the open request, report form while approved help runs, History, Open the group) · Withdraw.

Kept ids (Home and tests link to them): `#next-action`, `#status`, `#payment`, `#price`, `#pending-work` (inside the
new section `#decisions`), `#applicant`, `#documents`, `#returned`, `#closure`, `#withdraw`, `#related`. The panel's
owner is a `span[data-owner][data-tone]` (kind and tone of `ownerPresentation`), so a ready file reads "You" in the
delivery tone, never the attention tone.

Deviation (P2, recorded): the action panel precedes the status facts on every width (design §2.7 lists status
facts as item 4 and the panel as item 5; A109 and §2.7 "Mobile" need panel first, and the page has one DOM order).

Status facts (separate rows): Progress; Outcome ("Outcome not recorded"); Next ("[owner] — [reason]" from
`taPendingOf`); Stage; Editing ("You can change it", "With your operator", "Returned to you for correction" /
"for review" (draft), "An operator is entering information with your approval", closed: "Closed: it can no longer
be changed"); Service payment ("Not recorded" for `unrecorded`); Help request; Problem report and return (open
holds by name, "None"); Withdrawal (only when one exists; replaces the old Withdrawn callout); Delivery
("Unavailable now", only when the delivery read failed, with the panel note "Notices and downloads could not be
read now.").

Action panel rows (closed mapping, first that applies; links only when the target page is registered; support
view: the action is a disabled button with the support-view reason, no secondary links):

| # | Core facts | Owner | Step | Blocker | Action / secondary |
|---|---|---|---|---|---|
| 1 | notice to acknowledge (`dlv.delivery_facts`) | You | "A notice … needs your acknowledgement: [notice]." | — | Open the notice → `/ta/notices/:id` |
| 2 | `pending.reasonCode = gate1_payment_not_received` | You | "Pay TravelMudra [₹] and quote the application reference." | — | How to pay → `#payment` |
| 3 | result or packet to download | You (collect tone) | `taPendingOf` next | — | Download your result / packet → delivery page |
| 4 | open `returned_to_ta` hold, submitted, no outcome | You | "Correct what your operator asks, then hand the application back." | — | Correct the application → TA-09t; secondary Check and hand back → TA-08 |
| 5 | `editor_state = assistance_in_progress` | Your operator | "An operator is entering information with your approval. …" | Another person owns this step | — |
| 6 | draft, `submit.allowed` | You | "Check the answers and submit this application." (returned draft: "Review what the operator entered, then submit.") | — | Check and submit → TA-08 |
| 7 | TA step of the pending answer (`decide_price_increase`, `decide_transition`, `reapply_correction`) | You | reason | — | carried anchors `#price`, `#pending-work` |
| 8 | draft waiting for the travel-date recheck | pending owner | `DRAFT_RECHECK.next` | — | Change the travel dates → TA-13b (fallback: group page `#dates` while TA-13b is not registered) |
| 9a | draft blocked by a service rule (`offering_*`, `existing_work_*`, `catalogue_*`, `declaration_*`, `binding_*`, `withdrawal_continuation_not_permitted`) | TravelMudra | Core's sentence | Policy unavailable | notice `#submit-boundary` ("… Your draft is kept."); secondary Continue the application (only when `correct.allowed`) |
| 9b | draft blocked otherwise | You | first blocker sentence; others under "Also needed" | Evidence or details can fix it | Continue the application → TA-09t |
| 10 | assigned, no return hold, no open report | Your operator | "This application is with your operator. Report the problem so it can be returned for correction." | Another person owns this step | the carried report-problem form (opened in place) |
| 10b | assigned with an open problem report | Your operator | "Your operator deals with your report and may return the application to you." | Another person owns this step | — |
| 11 | service rule on submitted work (pending reason or `correct`/`assistance` blocker in `existing_work_hold`, `existing_work_treatment_missing`, `withdrawal_continuation_not_permitted`, `offering_suspended`, `offering_withdrawn`) | TravelMudra | Core's sentence | Policy unavailable | notice `#work-boundary` |
| 12 | draft in a support view (`submit` not evaluated) | pending owner | next action label | — | Check and submit (disabled); aside link "Check the answers (read only)" |
| 13 | otherwise | pending owner | `view.next` or `nextActionLabel(code, 'ta')` | — | submitted unassigned with `correct.allowed`: secondary Change the application, step adds "A change now makes the readiness checks run again." |

"Also needed" (all rows): decide the price change before handing back; the payment due (when not row 2).
Assigned, not returned: no edit control anywhere (tested: no link or form to `/prepare`, `/edit`,
`/correct-identity`, `/documents`, `/submit`).

## 3. TA-08 Check and submit and TA-07h

TA-08 states (`reviewMode` + evaluations, first that applies): returned (submitted, open return hold, no outcome:
note first, "(unchanged)" quote and window, hand-back form unchanged: action `/hand-back`, `_csrf`, `_op`,
`_rev.application`) · assigned (closed, the TA-07 notice text) · submitted / closed (closed, "Open the
application") · support view (read only, statements as text) · blocked (`submit.allowed = false`: unavailable
button described by `#check-boundary`, "What stops submission" and "Other items that stop submission" with links
to TA-09i/TA-09d/TA-09f/TA-13b; a service rule names TravelMudra and "Your draft is kept.") · evidence unavailable
(C-05: answers kept, no form, boundary notice) · no authority declared (no form) · a statement without usable
wording (C-08: no form; "… until the wording of the statement “[code]”, version [v], is approved. Owner:
TravelMudra product owner") · confirm (the form). Hidden values come from the same variables as the shown values
(`_rev.application`, `quotedPricePaise = String(pricePaise)`, `estimateStart`, `estimateEnd`, `version.<code>`);
tested against `data.money[value]` and `time[datetime]`. Statements never prechecked; after C1/C2 the posted
choice is kept; after C5 every statement is unchecked (`stale` passed to `checkAnswers`). C5 rows: Price, Estimated
window, Statement version; none differs → one row "This application … Changed since you opened this page."
Q-W10-11: one row "Related applications: Not linked ([relation])" per declared relation (`case.relations`) with no
dependency of that code in a state other than `unlinked` (`case.dependencies`); information only. Both facts exist
in the TA case read; nothing is inferred.

TA-07h states: form (note optional, max 2000, `_rev.application`) · request open (no form) · unavailable (with the
operator: problem-report text and link to TA-07 `#next-action`; service rule: policy notice; otherwise the blocker
sentences) · not offered (closed or outcome recorded) · refusals: C2 `assistance_request_open` sentence, C5 current
Stage, Editing, Help request with the note kept.

Receipts on TA-07 (C-03): `submitted` (resource = this application, `applicationId` matches, `submissionId`
present), `assistance` (`assistanceId` present), `handed_back` (summary holds `applicationId` only). Recorded facts:
Application, Submission reference, "Time: recorded in the application's History"; later reads labelled "Current"
(quoted price, original estimated window, next step, help request, stage). Unchecked receipt otherwise. Carried
forms keep their `?done=` flash (`problem`, `withdrawal`, `price`, `linked`, `unlinked`, `reapplied`,
`transition`, and `edited`, `corrected` for the old routes until U7 removes them).

## 4. Routes for U7 (exported, not registered)

| Export | Instance | Route id | Method, path | Action | Support view |
|---|---|---|---|---|---|
| `taApplicationStepRoutes()` | edge | `ta.applications.review` | GET `/ta/applications/:applicationId/submit` | `application.read` | yes |
| `taApplicationStepRoutes()` | edge | `ta.applications.help_form` | GET `/ta/applications/:applicationId/request-assistance` | `application.request_assistance` | no |
| `taApplicationSupportRoutes()` | staff | `ta.applications.review` | as above | `application.read` | yes |

Deviation D-U3-01 (P1 for U7, choice made): the review route uses `application.read`, not the design's
`application.submit`. Reason: the policy rule `application.submit` is `TA_OWN` without `sv`, so a support-view GET
with that action answers the uniform 404 (`src/modules/identity/policy.ts`, `rule.sv !== true`). Core still checks
the submission on the POST. U7 adds both inventory rows with these actions.

## 5. Carried forms on TA-07 (by action path, under `/ta/applications/:id`)

`/report-problem` (action panel when assigned; aside while approved help runs; the withdraw "ask for a return"
disclosure), `/price-decision` (accept, decline), `/transition-decision`, `/corrections/:correctionId/reapply`,
`/dependencies`, `/withdraw`; links and sections: `/delivery` (closure), completion checklist, originals, payment
summary. Moved: `/submit` and `/hand-back` → TA-08; `/request-assistance` → TA-07h. Removed from TA-07 (U4 builds
the pages): `/edit`, `/correct-identity`, `/documents` (upload). The old POST routes stay; a refusal there re-renders
TA-07 with the error summary only (`applicationAgain` keeps its signature for `application-documents.ts`).
`application-workspace.test.ts` "the forms of later work stay" lists them (§9.2).

## 6. Items for the architect

| Id | Rank | Item | Proposal |
|---|---|---|---|
| U3-01 | — | Gallery registration | Add `applicationGalleryPages()` (`gallery/application.ts`) and `submitGalleryPages()` (`gallery/submit.ts`) to `galleryPages()`. The modules count the WP-03 GET paths as registered so the links show. |
| U3-02 | P1 | System-test pins (§9.3) that my change breaks until U7 registers the GET routes and U4's pages exist | See §7. |
| U3-03 | P2 | `boundaryNotice` has no neutral kind for "blocked by items you resolve" and for an outage | TA-08 uses `known_limitation` ("Known limitation") for both; a kind such as `blocked` would read better. Component change (`results.ts`, `presentation.ts`). |
| U3-04 | P2 | `actionPanel` has no note slot | The delivery-outage note uses the `notice` slot as a muted paragraph. |
| U3-05 | P2 | `core.hand_back` returns no field of its own | The `handed_back` receipt requires a summary of exactly `{applicationId}`; another bare-result command of the same reader with an edited address could read as handed back. Kind 1: add `holdId` to the hand-back result. |
| U3-06 | P2 | Submission time (STOP-W03-01) | Receipt says the time is in History. |
| U3-07 | P1 (C05) | Approved statement wording | Only `ta_confirms_details@syn-1` (draft) exists. A production installation offers no submission until Max approves texts. |
| U3-08 | — | `DESIGN.md` | One line under the TA pages: "Application workspace: identity band, action panel (closed mapping), status facts, read-only answers and documents; Check and submit sends exactly what it shows." |
| U3-09 | — | Report-a-problem eligibility stays page-side (F-W03-11, carried, WP-09). |

No CSS change is needed: the pages use existing classes (`stack`, `cluster`, `text-muted`, unclassed lists and `h3`).

## 7. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean for U3 files. Errors remain in other units' in-progress files (`test/unit/web/applications-list.test.ts`, `ta-home.test.ts`, `scripts/dev/gallery/prepare.ts`, `test/unit/web/document-detail.test.ts`). Before the `listReturnOf` change, HEAD e1f6ac9 plus the five U3 source files alone typechecked clean. |
| `npx eslint --max-warnings=0` on the 10 U3 files | Clean. |
| `node --test` U3 tests (73) + `travel-recheck` (11) + `bff`, `nav-counts`, `bff-access-change`, `routes` (55) | All pass. |
| `node --test "test/static/**/*.test.ts"` | 74 of 74 (an earlier run failed on `route_without_id` in `src/apps/shared/views/ta.ts`, another unit's file, since fixed there). |
| Scratch browser sweep of the 22 new gallery pages (1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice, all impacts; 360 and 320 px overflow; CSP; script errors) | 132 checks, 0 findings. |
| System tests `core-pages`, `case-rules`, `case-work` (whole tree, `TMPDIR=/tmp/w3u3`) | 4 of 28 pass. Every failure starts at "no form posting to …/intake/individual" (the individual form left `/intake/new`, U5) or cascades from it; no U3 code is reached. |
| Same three files on a scratch copy of HEAD e1f6ac9 plus the five U3 source files (HEAD's tests) | 5 of 28 pass. First failures: "the application page offers the upload form" (`uploadThroughApplicationPage`), the edit and correct-identity forms, the help form read from TA-07: all §9.3 pins that need U4's pages and U7's registration. No other failure. |

### 7.1 System-test call sites updated (my moves only; unverified until U4 and U7 land)

| File | Change |
|---|---|
| `test/system/support/drafts.ts` `submitThroughEdge` | Submit from GET `…/submit`; `Location` `…?done=submitted&op=<key>`. The edit step above it is unchanged (U4/U7). |
| `test/system/core-pages.test.ts` | `.docket` → `#next-action`; submit from TA-08 (hidden price equals the shown `data.money`), C1 text "Confirm the statement to submit this application", receipt "Application submitted"; help from TA-07h with `&op=`; both hand backs from TA-08. The edit steps are unchanged. |
| `test/system/case-rules.test.ts:158, 279` | Help request from TA-07h. |
| `test/system/case-work.test.ts` | Submit from TA-08; `taDocket` reads `#next-action` (`[data-owner]` owner and tone) and `#status`; "TravelMudra operator" → "Your operator" (design §3.1 owner wording; the list rows keep "TravelMudra operator", P2 wording difference). |
| `test/system/ta-documents-originals.test.ts:172, 210` | `#submit` → `#next-action`; submit from TA-08. |

Remaining §9.3 pins for U7 (not mine): intake through TA-09c, uploads through TA-09f, edits through TA-09d,
identity through TA-09i, landing `/ta`, the search GETs.
