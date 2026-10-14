# WP-08 U5 notes: boundary-wording copy sweep (LD-04)

Unit U5 of WP-08. Author: the U5 engineer, 13 October 2026. Input for the architect's integration and for U6 (wiring
and system tests). U5 commits nothing. Base: lane branch `ui-revamp-2026-10-12` at dc313f6 with other units'
uncommitted work in the same tree (U5 touched none of their files). Binding inputs: `WP-08-design.md` §2.10 (rows 2,
3, 6 to 8), §7.1 row U5, §7.3; `WP-08.md` §3 Q-W08-03, §4 E-05, E-06, E-16, E-18, E-19, E-20, E-25, §6 (U0 owner
words; "E-30 deferral words"; U4 P1-1); `WP-08-acceptance.md` §0.2 (copy), A36, A43, A53, A54, A55, A115, A152;
`WP-08-U0-notes.md` §6; `WP-08-U4-notes.md` §6 items 5 and 6, §7 P1-1; PLAN LD-04.

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/core/shared.ts` | `CORE_MESSAGES` three codes only: `delivery_send_trigger_unselected` and `completion_check_trigger_unselected` = `boundaryWords(step, 'staff').sentence` (through a local `staffBoundarySentence`, which throws at load if the words ever lose a staff sentence); `uncertain_email_handling_unselected` = `UNCERTAIN_EMAIL_SENTENCE`. One value import and one type import of `../delivery/words.ts`. No other entry changed. |
| `src/apps/shared/delivery/words.ts` | `noticeText`: deferral words (§2.4). One structural change outside `noticeText` (deviation 1): the module no longer imports `humanize` from `../core/shared.ts`; it holds a private copy of the two-line helper, so `shared.ts` can import the closed words without a value-import cycle (`test/static/tree.test.ts` refuses cycles). |
| `src/apps/staff/core/case.ts` | `completionSection(v, surface, o?)`: links per surface, the checklist kept read only, the boundary by surface (§3). New optional third parameter `{ hasPage? }`. Imports `href`, `inventoryEntry`, `boundaryNotice`, `SUPERADMIN_BOUNDARY_SENTENCE`, `boundaryWords`. |
| `src/apps/shared/delivery/pages.ts` | The old renderer: header comment; boundary block without control in the reader's closed words (row 8 for the SuperAdmin view); the delivery page's notices section uses U0 `noticeList`/`noticeItem` (no inline acknowledge form); the notice page uses U4's E-20 `disclosureBody` and `acknowledgementReview`, button "Acknowledge"; the old `disclosureBody`, `param` and the `boundaryPresentation` import removed. The U0 re-export lines kept. |
| `src/apps/staff/views/cases.ts` | Monitors `boundaryNotice` (lines 264-268): title and sentence; one import line of `SUPERADMIN_BOUNDARY_SENTENCE`. Nothing else. |
| `test/unit/web/delivery-components.test.ts` | Deferral pins updated (old "Filing waits until …", "Filing of [name] waits until …", "deferred until its review date" removed); one test added (dated and undated words for five parameter shapes; equality with U4's `taNoticeWords`; no "waits until" / "deferred until" in any deferral notice words). |
| `test/unit/web/boundary-wording.test.ts` | `oldWording` marks removed from: the shared case sentences (staff, travel agent), the staff case page delivery and completion, the SuperAdmin monitors. Fixtures `staffCase()`, `staffNotices()`; one `SWEPT_PLACES` entry appended (staff notices list and notice pages, ops and admin, every kind); one describe block with 8 structural tests (§7). Imports: `noticePageHtml`, `noticesPageHtml`, `WireNotice`, `inventoryEntry`. |

No route, posted field, Core read or command changed. No gallery module (design §7.1: none for U5).

## 2. Words applied, by place

### 2.1 `CORE_MESSAGES` (shared case sentences)

| Code | Before | After (source) |
|---|---|---|
| `delivery_send_trigger_unselected` | "Who starts the result delivery is a recorded, not-yet-decided step." | "Sending the result by email is the assigned operator’s explicit step. It is not available in this release, so no result is emailed." (§2.10 row 1 sentence form, `boundaryWords('send_result','staff').sentence`) |
| `completion_check_trigger_unselected` | "Who starts the completion check is a recorded, not-yet-decided step." | "Requesting completion is the assigned operator’s explicit step. It is not available in this release, so the application stays open." (row 2 sentence form) |
| `uncertain_email_handling_unselected` | "The result email’s outcome is uncertain, and how to handle that is not yet decided." | "Email delivery is uncertain. No automatic resend will occur." (row 3, `UNCERTAIN_EMAIL_SENTENCE`) |

The travel agent reads these through `sentence(code, 'ta')`, which falls back to `CORE_MESSAGES` (no `TA_MESSAGES`
entry exists for the three codes). The words hold no forbidden phrase for either reader (sweep). See P2-1 for the
travel agent's own words.

### 2.2 Staff case page section "Delivery and completion" (`completionSection`)

| Surface | Links | List | Boundary (only while `lifecycle = submitted` and an outcome is recorded) |
|---|---|---|---|
| `ops` | "Result delivery" → `/ops/applications/:id/delivery`; "Request completion" → `/ops/applications/:id/completion`; each only when served | Checklist read only (unchanged: `completionItems`) | Row 2 staff: `boundaryNotice` id `case-completion-boundary`, "Request completion is unavailable until it is added to the product." "Owner: product owner", reference `completion_check_trigger_unselected`, then the decided-rule line. No control (the unavailable "Request completion" button is on OP-07). |
| `admin` | "Open the delivery page" → `/admin/applications/:id/delivery` (unchanged words) | Checklist read only | Row 8: callout "Result send and completion request", known limitation, `SUPERADMIN_BOUNDARY_SENTENCE`. No control, no operator page link. |

"Served" = `o.hasPage(path)` when the caller passes it, else an entry in the route inventory
(`inventoryEntry('GET', path)`). Today the inventory has no `GET /ops/applications/:applicationId/completion`, so the
"Request completion" link appears when U6 adds the entry with `opsCompletionRoutes()` (staff refuses to start with a
registered route outside the inventory, so the inventory entry and the served page arrive together).

### 2.3 Old renderer (`src/apps/shared/delivery/pages.ts`)

| Part | Before | After |
|---|---|---|
| Boundary block, SuperAdmin view | List of `DLV_MESSAGES` sentences + disabled "Run the completion check" (F-W08-03) | Note "What happens next" (known limitation): row 8 once when Core names the send or completion code; "Email delivery is uncertain. No automatic resend will occur." when it names the uncertain code. No control. |
| Boundary block, operator (only a refused ZIP still renders it; GET `ops.delivery` is U2's OP-06 now) | `DLV_MESSAGES` + disabled "Send the result by email", "Run the completion check" | Each step's staff sentence form; no control (the controls are on OP-06 and OP-07). |
| Boundary block, travel agent (until U3/U6) | Staff `DLV_MESSAGES` sentences | Row 1 and row 2 travel agent sentences ("Emailing your result from TravelMudra is unavailable until it is added to the product."; "Completing the application is TravelMudra’s step. It is not available in this release, so this application stays open after its result."). |
| Notices section of the delivery page (all surfaces) | Up to 20 items, each with an inline "Acknowledge" form (F-W08-08, D-W08-04) | `noticeList` + `noticeItem` (U0): words linked to the notice page, posted time, acknowledgement fact; no form; every notice the read returned (the silent cut to 20 removed, E-10). |
| Notice page, disclosure correction | Old body: "The file is blocked and is not released again.", "TravelMudra has asked the recipient to delete it.", "Then acknowledge this notice to confirm that you deleted it.", "Download reference(s)" (cut to 10) | U4's `disclosureBody` (E-20 / AM-W14-02): what the notice records only; "Release reference(s)", every valid one. |
| Notice page, acknowledge button | "I deleted it: acknowledge" for a disclosure correction | "Acknowledge" for every kind, with U4's review line above it (`acknowledgementReview`: reading only; never deletion evidence, WP-15 N-05). The form stays on the notice page (the host page). |

### 2.4 Deferral notice words (`noticeText`, used at `ta-home.ts:177`, `ta.ts:357`, the old renderer)

- Readable `reviewOn`: "Review on [d Mon yyyy]; readiness, authorization and packet release remain held until the
  deferral is ended."
- No readable date (missing, invalid calendar date, not `yyyy-mm-dd`, not a string): "Filing is deferred. Readiness,
  authorization and packet release remain held until the deferral is ended." (also the kind's general words, used by
  `noticeText({ kind: 'deferral', params: {} })`).
- The `applicantName` option is removed: the words name no applicant (WP-17 O-06 words). No caller passed it except
  the U0 test.
- U4's `deferralNoticeWords` returns the same words (test). `taNoticeWords`' deferral branch is now redundant (§6).

### 2.5 Monitors (`src/apps/staff/views/cases.ts`, F-W06-09)

Title "Waiting on a step that has no trigger yet" → "Waiting on the result send or the completion request". Body:
`SUPERADMIN_BOUNDARY_SENTENCE` (row 8), then "[n] open application(s) wait(s) on a result send or an uncertain email,
and [m] on a completion request (as of the application lists, entry N)." The first count includes
`uncertain_email_handling_unselected` waits (Core: `case-queries.ts` `boundaryWaits`), so the words name both, as the
SA-01 inbox group does. The freshness clause ("entry N") is unchanged (outside the brief; P2-4).

## 3. States per place

| Place | States |
|---|---|
| `completionSection` | before an outcome (description line, no boundary); open with an outcome (boundary by surface); closed (`completed`, `ended_with_group`: no boundary); completion page served or not (link or none); `ops` or `admin`. |
| SuperAdmin delivery view boundary | no code (no note); send and/or completion code (row 8 once); uncertain code (row 3 sentence); an unknown code (`DLV_MESSAGES` sentence or the code in words, as before). |
| Delivery page notices | none (no section); some waiting (title "Notices that need your acknowledgement"); none waiting ("Notices"); support view (same items; there was never a form in it). |
| Notice page | waiting (review line + "Acknowledge"); acknowledged / not asked (no form); support view (no form); refusal (unchanged refusal callout); disclosure deletion request, disclosure information, other kinds (no body). |
| Monitors | counts 1 / many (singular, plural); projection healthy or not (unchanged clause). |

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| D1 | `CORE_MESSAGES` takes the staff sentence forms from `words.ts`; nothing re-declared. | Brief ("never re-declare"); U0 notes §6. |
| D2 | Break the `words.ts` → `shared.ts` value import (private `humanize` copy in `words.ts`). | `shared.ts` → `words.ts` plus the existing `words.ts` → `shared.ts` is a value-import cycle (static test refuses; with `words.ts` loaded first, `CORE_MESSAGES` would read `BOUNDARIES` in its temporal dead zone). Re-declaring three sentences in `shared.ts` would break D1. The copy duplicates a two-line formatter, not words. |
| D3 | Operator case section: row 2 as the full CMP-10 notice + decided rule, no control; the unavailable button stays on OP-07. | A53 "The case page callout uses the same row"; design §1.5 "two links … with the checklist kept read only"; one control per command (OP-07). |
| D4 | SuperAdmin case section and delivery view: row 8 sentence, no control, no operator link. | §2.10 row 8; F-W08-03; A55; CC-07. |
| D5 | Boundary only while the application is submitted with an outcome. | Core lists the boundary codes only for `lifecycle = submitted` (`modules/delivery/pages.ts:201`); a completed application does not "stay open". Before an outcome the old section showed none either. |
| D6 | Links only for a served page (`hasPage`, else the inventory). | DESIGN.md "links show only pages that exist"; OP-07 is not registered until U6. Callers need no change. |
| D7 | Old renderer travel agent boundary in travel agent words; operator boundary without controls. | The old renderer still serves the travel agent's delivery page until U3/U6; GET `ops.delivery` is already OP-06 (U2), so old operator controls served no page. |
| D8 | Delivery page notices: U0 `noticeItem` (no form), every notice returned. | D-W08-04, F-W08-08; E-10 (the silent cut to 20 presented a capped list as complete). |
| D9 | E-20 by reusing U4's `disclosureBody` and `acknowledgementReview` on the staff notice page; button "Acknowledge". | Brief ("the old one … is yours to correct"); one source of words; WP-15 N-05. |
| D10 | Monitors first count named "a result send or an uncertain email". | Core counts both reasons in `deliverySendTrigger`; the SA-01 inbox uses the same words. |
| D11 | `noticeText` drops the `applicantName` option. | The O-06 words name no applicant; an unused option would fail lint. |

## 5. Deviations

1. D2: one change in `words.ts` outside `noticeText` (import line replaced by a private helper). Without it the brief's
   own instruction (D1) creates an import cycle.
2. `staff/views/cases.ts`: one import line added outside lines 258-266 (needed to use the row 8 constant).
3. `case.ts`: `completionSection` gains an optional third parameter (`hasPage`); existing two-argument callers keep
   working (inventory default).
4. The old renderer's travel agent and operator boundary words changed too (D7), not only the SuperAdmin block.
5. Derived words without a design source (P2-2): section links "Result delivery: the result files, the sends and the
   handovers of this application." and "Request completion: what completion needs now, and the completion
   request."; the admin callout title "Result send and completion request"; the Monitors title and count sentence
   ("on a result send or an uncertain email, and [m] on a completion request").

## 6. What U6 and the architect must do

1. System test pins (U6; exact old → new, §8 has the run that shows them):
   - `test/system/delivery.test.ts:119` comment "who starts a result email and the completion check are not
     decided" → "sending the result and requesting completion are decided steps that are not in this release".
   - `test/system/delivery.test.ts:120` (TA delivery page) `/Who starts sending a result by email is not decided yet/`
     → `/Emailing your result from TravelMudra is unavailable until it is added to the product/` (true on the old
     renderer's travel agent path now and on U3's TA-07d notice). Add `assert.deepEqual(boundaryWordingProblems(mainText(page), 'ta'), [])`.
   - `test/system/delivery.test.ts:227` (operator page after the direct-external record, now OP-06)
     `/Send the result by email/` → `page.$('#send-boundary').text()` matching `/Send result is unavailable until it is
     added to the product\./` (U2's notice) and one `button[aria-disabled="true"]` named "Send result".
   - `test/system/delivery.test.ts:231` (409 page of the boundary POST) `/Who starts sending a result by email is not
     decided yet/` → `/Sending the result by email is the assigned operator’s explicit step\. It is not available in
     this release, so no result is emailed\./` (the words `test/unit/bff-send.test.ts` pins in `#error-summary`).
   - `test/system/case-work.test.ts:271` comment "Who sends the result is still undecided" → "Sending the result is a
     decided step that is not in this release". `:273` `#closure` `/Who sends your result to you is not decided in
     this release/` → U3's section (`#result`) with `/Emailing your result from TravelMudra is unavailable until it is
     added to the product/`, plus `boundaryWordingProblems(text, 'ta')` empty.
   - `test/system/case-work.test.ts:580` `#closure` `/Who starts the completion check is not decided in this release/`
     → `/Completing the application is TravelMudra’s step\. It is not available in this release/` (U3's section id).
   - `:272`, `:277`, `:294` stay valid (they assert absence of "Owner not yet decided").
2. Pass `{ hasPage: (p) => ctx.hasPage(p) }` to `completionSection` in `staff/core/ops.ts:351`, `staff/core/admin.ts:375`
   and `staff/work/workspace.ts:1382` (optional: the inventory default is correct once the completion route is in the
   inventory). The design's U6 item "links to Result delivery and Request completion from the workspace Delivery tab
   and the old case page" is met by `completionSection` (both pages render it); U6 adds no second pair.
3. `src/apps/shared/pages/notices.ts` (U4's file): `taNoticeWords` may drop its deferral branch (U4 notes §6 item 5);
   the words are equal now (test).
4. `src/apps/staff/home/inbox.ts:83` (U0 P2-3): import `SUPERADMIN_BOUNDARY_SENTENCE` instead of its own copy.
5. WP-15 U5 (staff notices on the shared renderers) removes the old `noticesPageHtml`/`noticePageHtml`; until then
   they carry E-20 and the "Acknowledge" button.
6. Architect: the remaining `oldWording` marks are the travel agent's application page `#closure`/`#result` (U3) and
   the owner of a step not in this release (`presentation.ts` copy block, row 6).

## 7. Tests

| File | Added or changed |
|---|---|
| `test/unit/web/delivery-components.test.ts` | 1 test added ("a deferral notice names its review date and what stays held …"); 3 pins changed in "notice texts by the parameters Core records …". |
| `test/unit/web/boundary-wording.test.ts` | 4 marks removed (the places now swept as clean); 1 place appended (staff notices list and pages, ops and admin, every kind and both disclosure variants); 8 tests added: case sentences equal the closed words for both readers; operator section links, read-only list, row 2 notice and reference, no control; links only for served pages (`hasPage`, inventory default); SuperAdmin section row 8, no control, no operator link, no boundary before an outcome or after closure; SuperAdmin delivery view row 8 once + uncertain sentence, no send or completion control, travel agent path in travel agent words; no delivery page holds an acknowledge form on any surface or in a support view, each notice links to its page; staff/TA notice page disclosure words (no "blocked", "asked the recipient", "Then acknowledge", "I deleted it"), button "Acknowledge" with the reading-only review, release reference shown; Monitors row 8 and count sentence. |

## 8. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json --noEmit` | My files: 0 errors. One error in another unit's new file `test/unit/web/carried-forms-assignment.test.ts(89,46)` (`'paid'` not in the fee-state union); not touched. |
| `npx eslint --max-warnings=0` on the 7 files of §1 | 0 problems |
| `node --test test/unit/web/boundary-wording.test.ts test/unit/web/delivery-components.test.ts` | First run: all pass (32 + 25). Final rerun at 11:12: 55 pass, 1 fail — the ratchet of the travel agent's application page (`#closure`, `#result`): U3 reworded `src/apps/shared/core/ta.ts` at 11:07, so its `oldWording` mark must go in U3's change (U3's place; U5 did not touch it). |
| `node --test "test/unit/web/*.test.ts"` | 1419 tests: 1418 pass, 1 todo (existing, `individual-intake.test.ts`), 0 fail |
| `node --test "test/unit/*.test.ts"` | 530 tests: 528 pass, 1 todo (existing, `bff-services.test.ts`), 1 fail: `seo-record.test.ts` (crawl record stale: the renderer digest covers `src/web/public`, `static/css`, `static/fonts`; U5 changed none of them; the architect regenerates the record) |
| `node --test test/static/**/*.test.ts` | 74 pass, 0 fail (no import cycle) |
| Gallery: `workspaceGalleryPages`, `sendResultGalleryPages`, `completionGalleryPages`, `deliveryGalleryPages`, `noticesGalleryPages` rendered (scratch script) | 36 pages, one `h1` each; the workspace Delivery tab shows the "Result delivery" link and the row 2 notice; no "Request completion" link (completion route not in the inventory yet) |
| System tests, read only: `test/system/delivery.test.ts`, `test/system/case-work.test.ts` | See §8.1 |

Not run: the public-site crawl record, deploys, `npm run check`, a browser pass (U5 adds no component or layout; the
case section uses the existing `boundaryNotice` and `callout`).

### 8.1 System tests (read only)

Run: `TMPDIR=<short dir> node --test --test-concurrency=1 --test-global-setup=test/support/global-setup.ts
test/system/delivery.test.ts test/system/case-work.test.ts` on the shared working tree (all units' uncommitted work
present). 10 tests: 7 pass, 3 fail. No test file edited.

| Assertion | Result | Cause |
|---|---|---|
| `delivery.test.ts:120` (TA delivery page, old renderer) | Fails on words only. Actual text holds "What happens next Known limitation Emailing your result from TravelMudra is unavailable until it is added to the product. Completing the application is TravelMudra’s step. It is not available in this release, so this application stays open after its result." | U0 `DLV_MESSAGES` + U5 travel agent boundary words. New pin in §6 item 1 verified against this text. |
| `delivery.test.ts:201-203` (operator notice page, old renderer: links to the application and the delivery page) | Pass | — |
| `delivery.test.ts:211` (operator delivery page breadcrumb `/Syndeliver/`) | Fails: empty text | Not words: GET `ops.delivery` is U2's OP-06 (crumb "My work › applicant"); U2 listed `:208, :211` for U6. `:227` and `:231` are not reached. Their new text is pinned by `test/unit/bff-send.test.ts` (U2): `#error-summary` "Sending the result by email is the assigned operator’s explicit step. It is not available in this release, so no result is emailed. Nothing was sent or recorded."; `#send-boundary` "Send result is unavailable until it is added to the product." |
| `delivery.test.ts:236-256` (SuperAdmin delivery view: retrieval with purpose and reason; no bulk form; no "Record a delivery") | Pass | The row 8 note without control does not disturb it. |
| `delivery.test.ts:259-274` (each case page links its delivery page) | Pass | The case section keeps the delivery links; the header links too. |
| `case-work.test.ts` (whole file) | Fails at setup: `no form posting to /admin/applications/<id>/assign` (`payAndAssign`, line 168) | Not words: the SuperAdmin assignment form moved (another package's wiring). `:273` and `:580` are not reached; their new pins in §6 item 1 follow design §7.3 and U3's section. |

No reached assertion fails because of a U5 word other than `delivery.test.ts:120` (which U0's sentences already
broke; P1-1 of the U0 notes).

## 9. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| P1-1 | P1 | Two more deferral sentences in `shared.ts` outside the three codes say the hold ends on the review date: `TA_MESSAGES.deferral_active` "Filing waits until the review date." and `CORE_MESSAGES.deferral_active` "The application is deferred until its review date." (same class as U4 P1-1, WP-17 O-06; WP-07's queue test already refuses "deferred until its review date"). | A deferral is approved with review on 20 Oct. The travel agent's action panel and TA-01 row (`ta-reading.ts:141`) say "Filing waits until the review date"; the agent tells the customer filing resumes on 20 Oct, but readiness, authorization and packet release stay held until a SuperAdmin ends the deferral. | Owner of `shared.ts` (architect or WP-17 follow-up): `TA_MESSAGES.deferral_active` → "Filing is deferred. Readiness, authorization and packet release remain held until the deferral is ended."; `CORE_MESSAGES.deferral_active` → "The application is deferred. Readiness, authorization and packet release remain held until the deferral is ended." Not done: outside the brief's three codes. |
| P2-1 | P2 | The travel agent reads the three codes in staff sentence form ("the assigned operator’s explicit step"; "Email delivery is uncertain …") through the `CORE_MESSAGES` fallback (TA action panel reason, the TA completion checklist detail). | A travel agent with an uncertain email reads "Email delivery is uncertain. No automatic resend will occur." in the action panel, while TA-07 says "The email result is not confirmed … TravelMudra follows up the send attempt." Both are true; the voice differs. | Add three `TA_MESSAGES` rows from `words.ts` (row 1 TA sentence, row 2 TA sentence, `UNCERTAIN_EMAIL_TA`) in the `shared.ts` owner's change; the sweep entry for the TA case sentences stays clean. |
| P2-2 | P2 | Derived words (§5 item 5) have no design source. | A reviewer asks where "Waiting on the result send or the completion request" comes from. | PM review at the acceptance alignment. |
| P2-3 | P2 | The staff case section's checklist still uses `completionItems` (met sentences such as "The official document is eligible for delivery", "Not applicable yet" before an outcome); E-05's neutral labels are OP-07's (U2), whose module cannot be imported by `case.ts` (cycle through `work/workspace.ts`). | Before an outcome, an application whose filing may have happened shows "Not applicable yet" for `no_possible_filing` on the case page while OP-07 shows "Not met". | Move U2's `requirementItem` words (labels and detail tables) into `words.ts` or a staff words module both can import; then `completionSection` uses them. WP-08 follow-up or WP-14. |
| P2-4 | P2 | The Monitors freshness clause still reads "(as of the application lists, entry N)" (F-W08-07 class, LD-08 lag form). | A SuperAdmin reads "entry 7" and cannot tell how old the counts are. | WP-14 rebuilds Monitors with the projection lag form. |
| P2-5 | P2 | `ta.ts:357` appends "." to `noticeText(...)`, which already ends with a full stop ("…acknowledgement: Review on 20 Oct 2026; … is ended.."). Pre-existing for every notice kind. | The TA-07 action panel shows a double full stop. | U3 (owner of `ta.ts`) drops the appended ".". |
| P2-6 | P2 | `src/apps/shared/delivery/routes.ts:88-89` (`retrieveFile`, U3's file) cuts the SuperAdmin's purpose to 60 and reason to 1000 characters with `.slice()` (LD-17 class). The form's `maxlength` stops a browser; a hand-made post is cut silently. | A scripted SuperAdmin retrieval with a 1,200-character reason is recorded with its first 1,000 characters; the record differs from what was sent. | LD-17 report-only sweep: refuse over-limit input with the values kept. |

No P0 item.
