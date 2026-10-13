# WP-08 U3 notes: the travel agent's result and delivery surfaces

Unit U3 of WP-08 (TA-07r, TA-07d, TA-07s and the shared selection renderer for OP-06s). Author: the U3 engineer, 13
October 2026. Input for the architect's integration and for U6 (wiring). U3 commits nothing. Base: lane branch
`ui-revamp-2026-10-12` at 0e38a04 (dc313f6 holds the WP-03 travel-agent fixes) with other units' uncommitted work in
the same tree; U3 edited only the files of §1. Binding inputs: `WP-08-design.md` §2.0, §2.5 to §2.7, §2.10, §2.11, §2.14,
§3, §4, §5, §7.1 (U3 row); `WP-08.md` §3, §4 (E-05, E-09, E-10, E-15, E-16, E-19, E-24, E-29 in particular), §6;
`WP-08-acceptance.md` A63 to A88, A108 to A121, A152; `WP-08-U0-notes.md` §6 and P2-2; `WP-08-U2-notes.md`;
`WP-08-U4-notes.md`; PLAN LD-14, LD-17; the coordinator's three items of 13 October (§4 D17, D18, D19).

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/delivery/ta-pages.ts` (new) | `resultDeliverySection` (TA-07r), `resultStatusFacts` (the two status rows), `sectionOffersDownload`, `taDeliveryPage` (TA-07d), `selectionPage` (TA-07s and OP-06s), `downloadRefusalMessage`, `selectionItemName`, `zipItemValue`, types `DeliveryPageRead`, `ResultCase`, `TaDeliveryCase`, `DownloadRefusal`, `DownloadOrigin`, constants `DELIVERY_READ_LIMITS`, `DOWNLOAD_ORIGIN_FIELD`, `DOWNLOAD_REFUSAL_TITLE`, `ZIP_UNREADABLE`. Built on U0's components and words; declares no word that `words.ts` holds. |
| `src/apps/shared/delivery/routes.ts` | `taDeliveryPageResult` (TA-07d with the optional case read and the origin breadcrumb); `deliveryPageResult` per surface (`ta` → TA-07d, `ops`/`admin` → the old renderer); `refusedOnTaPage` (re-render by `from`); `retrieveFile` (parameters whole, release-contract check first: `releaseInputRefusal`); `retrieveSelection` (every item read whole: `selectionItems`); `selectionPageResult` (both surfaces); `zSelectionParams`. `acknowledge`, `noticeReadRoutes`, `refusedOnPage`, `deliveryCaseContext` unchanged. |
| `src/apps/edge/delivery/routes.ts` | `ta.selections.one` → `selectionPageResult(ctx, 'ta')`; ZIP body limit 32 → 64 KiB (`SELECTION_BODY_LIMIT`). `ta.notices.acknowledge` untouched. |
| `src/apps/shared/core/ta.ts` | TA-07 only: optional `dlv.delivery_page` read (`resultOf`, not for a draft); the section in place of the carried "Delivery and completion" section (`#closure` and `UNDECIDED_CLOSING` removed); the two status rows after Outcome; the panel's download step → `#result` when the section offers a form now; `applicationAgain(ctx, state, { resultRefusal, restorePath })`; `WorkspaceOptions.result`, `.resultRefusal`, `.restorePath`; the notice step's double full stop (D19). |
| `test/unit/web/ta-delivery.test.ts` (new) | 21 tests. |
| `test/unit/web/delivery-words.test.ts` | Points at `taDeliveryPage`, U2's `sendPage` (ops) and the old renderer (admin, still served), and `selectionPage`; same assertions (the limit sentence regex now accepts "your browser kept the file"). 6 tests. |
| `test/unit/bff-ta-delivery.test.ts` (new) | 7 tests (6 HTTP with a scripted Core, 1 handler test of the SuperAdmin retrieval). |
| `scripts/dev/gallery/ta-delivery.ts` (new) | `taDeliveryGalleryPages()`: 29 pages; exports the fixtures the tests share (`tdPage`, `tdIssued`, `tdFullPage`, `tdSelection`, `tdDeliveryPage`, `TD_*`, …). Not registered. |
| `test/unit/web/boundary-wording.test.ts` | `oldWording` mark of "the travel agent's application page, result and closing steps" removed; one import and one `SWEPT_PLACES` entry appended (every gallery page: `#result` of the application pages, `main` of the others). |

No change under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`,
`migrations/`, and none in `words.ts`, `delivery.ts`, `pages.ts`, `ta-reading.ts` or another unit's file.

## 2. Routes

Ids, paths, actions, commands and field names are unchanged except where stated.

| Id | Method, path | Action, command | Change |
|---|---|---|---|
| `ta.applications.detail` | GET `/ta/applications/:applicationId` | `application.read` | Adds opt. `dlv.delivery_page` (not for a draft; LD-14: only an availability failure degrades the section). |
| `ta.delivery` | GET `/ta/applications/:applicationId/delivery` | `application.read` | Renders TA-07d. Reads `dlv.delivery_page` (required) and opt. `core.ta_application` (header name, service, origin breadcrumb, closing steps). Staff serves it to a support view as before. |
| `ta.delivery.retrieve`, `ta.delivery.packet_retrieve` | POST `…/documents/:versionId/retrieve`, `…/packets/:packetId/retrieve` | `document.retrieve_bytes`, `dlv.retrieve_document` | New hidden field `from` (`application` or `delivery`, BFF only, D-W08-11); the form action carries the origin query. A refusal re-renders TA-07 (`from=application`) or TA-07d at the POST address with the reason, fresh tokens and `restorePath` (the page with its origin query). Not found → uniform 404; unauthenticated, maintenance, internal, `unavailable_dependency`, `outcome_unknown` → the shell. Body limit 4,096 unchanged. |
| `ta.selections.create` | POST `/ta/selections` | `selection.retrieve`, `dlv.retrieve_selection` | Every `item.<n>` read whole, any index, in index order (the old handler cut kind and id to 40 and dropped unreadable items). An unreadable item, a stray `item.*` field with a value, none, or more than the contract's 500 → refused before Core, TA-07d re-rendered with the ticks. Core's refusals (its own size limit, a duplicate key, capacity) re-render TA-07d with the ticks. Body limit 32 → 64 KiB. |
| `ta.selections.one` | GET `/ta/selections/:selectionId` | `selection.retrieve` | The shared renderer; opt. `core.ta_application` when every item is of one application (breadcrumb name). |
| `admin.delivery.retrieve`, `admin.delivery.packet_retrieve` (staff, via `retrieveFile`) | unchanged | `document.retrieve_bytes_admin` | Purpose and reason sent whole (were cut to 60 and 1,000); a value over the release route's contract is refused at its field before any release (old renderer re-rendered, 422). |
| `ops.selections.one` (staff) | — | — | Not changed here: U6 points it at `selectionPageResult(ctx, 'ops')`. |

## 3. States per page

**TA-07r** (`#result`, not for a draft). Order: refusal (error summary "The download did not start"), outcome line,
"Files and delivery records are unavailable now." when the read failed, "Result file" (artifact and packet rows with
download forms; a limit line when a row is refused "not eligible", D5), "Delivery" facts, "Closing steps" (or
"Processing completed"), links ("All files, emails and downloads of this application"; "Download several files as one
ZIP" when two or more non-packet files are available and not in a support view).

| State | What shows |
|---|---|
| Submitted, no outcome | "Outcome not recorded yet. The result appears here when TravelMudra records it."; no facts, no closing steps |
| Result ready | Download form; facts "No email sent", "Not posted", "None yet"; status "Result file: Ready to download" |
| Downloaded | "Your downloads: Sent in full on [time] IST" + "Whether your browser kept the file cannot be known." |
| Outcome with the result file requirement unmet (V13) | "Outcome: Issued. [Core's artifact blocker in TA words]" and "Who acts: [owner]" only when Core's pending reason is `artifact_not_eligible`; the row reads its reason; no form; status "Not available yet" |
| Replaced result file | Both rows listed; the old one reads Core's reason (see P1-1) with no form; the limit line |
| Email uncertain / failed / accepted | §2.11 TA words; uncertain reads the row 3 TA sentence; no resend control |
| Only emails of earlier result files (E-29) | "No email with the current result file." + "Earlier emails are listed under Delivery." (link `delivery#emails`) |
| Direct external delivery | Handover fact "Delivered directly by an external party. This record names no file held by TravelMudra." (E-15); status "No result file from TravelMudra for this outcome" when Core marks the result file requirement met and no file is listed |
| Preparation only (E-15) | Not released / ready / sent in full on [time] / "Outcome: Prepared and handed over. TravelMudra claims no government result for this application."; before an outcome only the downloads fact |
| Completed | h3 "Processing completed", "Its outcome is a separate fact.", "Still needs your acknowledgement:" with links; nothing about duties (STOP-W08-06) |
| Ended with the group | "This application ended with its group after the travel return date. This is not an outcome." |
| Delivery read unavailable | Outcome line and closing steps stay; both status rows "Unavailable"; the panel's download step links to TA-07d |
| Support view | Facts in the travel agent's words; files "Available / Not available to the travel agent" with the reason; no form, no button, no ZIP link |
| Lists at the read's limit (E-10) | Emails ≥ 100, handovers ≥ 100: "Listed on the delivery page" + cap line; notices ≥ 200, downloads ≥ 500: "Not among the newest …" instead of "Not posted" / "None yet" |

**TA-07d.** Header "Delivery: [applicant]" (or "Delivery" when the case read is unavailable), breadcrumb by origin
then the applicant, meta Application and Service, "Read at". Sections: refusal; Files (`#files`, every file, lead,
"Releases are paused …", limit line, cap line at 200); ZIP (`#zip`, not a disclosure, two or more files); Emails with
documents (`#emails`, attempt rows, cap line); Handover records (when any); Notices about this application (notice
items, no form, cap line); Your downloads (`#downloads`, result words, "The ZIP's results" links, cap line at 500);
Closing steps (`#closing`, "Unavailable" when the case read failed). States: S2 "No file is released to you yet";
refused download; refused ZIP with ticks and the "not listed now" line; support view (third-person headings for
emails and downloads, no form).

**Selection page (both surfaces).** Breadcrumb "Applications › [applicant] › Delivery" (TA) or "My work › [applicant] ›
Result delivery" (ops) when one application, else the root only; facts Started, Download (Sent in full / Stopped early /
In progress or not recorded, with the design's sentence), Files asked for, Finished; the two lines (checked just before,
nothing substituted, "Sent in full" limit; E-09 identity limit); table Item [n] (row header), File, Application (several
applications only), Result ("Sent in full", "Not included" + reason, "Failed: the download stopped before this file",
"Not recorded"); "This list shows [n] of the [m] files asked for." when the read holds fewer items.

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| D1 | The section replaces the carried `#closure` section at the same place of the main column (`id="result"`). | Design §2.5 ("WP-08 replaces that section"); one anchor for the notices' "See the result" (U4). |
| D2 | Status rows "Result file" and "Delivery" after "Outcome"; the WP-03 row "Delivery: Unavailable now" stays only when the delivery page was not read and the delivery facts are unavailable. | §2.5; one Delivery row. |
| D3 | The panel's download step links to `#result` only when the section shows a download form now (`sectionOffersDownload`); otherwise to TA-07d, which reads again. | A link must lead to a form that exists. |
| D4 | The ZIP form lives on TA-07d only; TA-07r links to `#zip`. | Q-W08-09, D-W08-12. |
| D5 | U0 P2-2: a current result file is an artifact row that is available, or refused for a reason other than `version_replaced` or `artifact_not_eligible`. The email fact and the newest-fact row use only those. When a row is refused `artifact_not_eligible`, the page says: "A result file that is not available yet may be under review, withheld, or replaced by a newer file. This page cannot tell which." | Core answers `artifact_not_eligible` for a replaced (noncurrent) artifact and for one under review alike (`modules/delivery/release.ts`); a page that counted it as current would show an old email as the current one. |
| D6 | The V13 block applies to any recorded outcome whose `artifact` requirement Core reports unmet; "Who acts" only when Core's pending reason is `artifact_not_eligible`. | Core's flag decides (E-05); E-27's discipline (the owner only when the pending answer is about it). |
| D7 | Delivery facts appear once an outcome is recorded or a preparation packet is released; email and notice facts only after an outcome; acknowledgement only when a notice of the application asks for one; handover only when one is recorded. | §2.5 table ("delivery rows left out" before an outcome); E-15 (packet download before the outcome). |
| D8 | The newest delivery fact (status row) is chosen by time among the current-result email, the result notice, the reader's newest result or packet download and the newest handover; none → "Nothing recorded yet". | §2.5 "the newest delivery fact in words"; presentation only. |
| D9 | Delivery read unavailable: "Files and delivery records are unavailable now." without "Your result, if any, is not lost." | DESIGN.md "No claim the page cannot know"; the page did not read the result. |
| D10 | Closing steps from `taCompletionWords` with Core's flags (never "Not applicable yet"); the send boundary notice (row 1, TA words, owner TravelMudra) when Core's pending reason or the delivery requirement's codes name it; the completion line (row 2) while the pending reason is one of the three boundary codes; nothing before an outcome. | §2.5 item 6, §2.10, E-05, A152. |
| D11 | Support view: no download control and no ZIP form or link; files read the support words; TA-07d's email and download headings in the third person; TA-07r keeps the travel agent's words. | E-24, DESIGN.md support view (supersedes §2.0 "disabled with its reason"); TA-07 "reads exactly as the travel agent's" (`ta.ts` header). |
| D12 | Refusals: `errorSummary` titled "The download did not start" with `refusalSentence('download'|'zip', …, { reader: 'ta' })`, else the category's recovery + "Reference: [code]" (UAT-13). | A refused release sends no byte, so the title is true for every refusal; category titles name fields the form lacks (U4 D10). |
| D13 | After a refused ZIP the listed files that were sent are ticked again; sent values the page no longer lists are counted in a line ("[n] files you chose are not listed now: only files you can download now are listed."), never silently dropped. | LD-17: the refusal is whole; the re-rendered form lists only files available now. |
| D14 | The selection page reads the applicant's name through an optional case read (TA `core.ta_application`, ops `core.ops_case`) when every item is of one application. | The design's breadcrumb names the applicant; LD-14 (an access refusal of that read reaches the shell). |
| D15 | Download and ZIP forms carry the origin query; the refusal's re-render keeps the breadcrumb and `restorePath` includes it. | WP-03 origin rule. |
| D16 | Notices on TA-07d use U4's `taNoticeWords` (corrected deferral words, the travel agent's changed-terms words). | One source of the travel agent's notice words. |
| D17 | Coordinator item 1 (LD-17): the SuperAdmin's purpose and reason are read whole; `releaseInputRefusal` checks the parameters against `DELIVERY_RELEASE_ROUTES['dlv.retrieve_document']` and refuses at the field before any release. `sendWhole` / `inputRefusal` (`whole-input.ts`) apply to command contracts; a byte release route is not one, so the same rule is applied with the release route's contract. Test: Devanagari reason of 979 characters reaches the release unchanged; 1,001 characters → 422, no release. | LD-17. |
| D18 | Coordinator item 3: the `oldWording` mark of the application page's result and closing steps removed; the sweep passes on it. | Ratchet. |
| D19 | Coordinator item 2: the panel's notice step adds a full stop only when the notice words do not end with one (`noticeText` words for disclosure variants have none). | No "..", no missing stop. |

## 5. Deviations from the design

1. Status "Result file": "No result file from TravelMudra for this outcome" in place of "Not part of this service"
   (Core marks the requirement met for the recorded outcome, not for the service).
2. D9 (no "not lost" claim); D11 (no disabled download in a support view); D6 (V13 block for any outcome, "Who acts"
   conditional); D14 (one more optional read on the selection page).
3. The downloads table reuses `downloadsFactWord`, so a sent download's word carries its time beside the "Checked"
   column.
4. ZIP checkboxes are labelled with the file name and a version hint; the applicant is the page's header (A79 asks for
   the applicant in each label).
5. Not built: the live "Selected: [n] files" announcement (A79, A88; needs `static/js/enhance.js`).
6. Derived words without a design source (P2-1): "No result file from TravelMudra for this outcome", "Nothing recorded
   yet", "Who acts: [owner]", "Files and delivery records are unavailable now.", the limit line of D5, "Listed on the
   delivery page", "Not among the newest 200 notices of this application", "Not among your newest 500 downloads",
   "Recorded [time]" under a handover fact, "TravelMudra completed the processing of this application. Its outcome is a
   separate fact.", "Still needs your acknowledgement:", "No closing step is reported for this application.", "The
   download did not start", the ZIP unreadable sentence and "not listed now" line, the files, downloads and handover cap
   lines, the TA-07d support-view headings, "Each row is known by its item number. …", "This list shows [n] of the [m]
   files asked for.", "Releases are paused while TravelMudra handles a problem with this application." (design §2.6
   words, used on TA-07r too).

## 6. What U6 and the architect must do

1. `test/unit/web/application-workspace.test.ts` (outside U3's files): `:420` `#closure a[href=…/delivery]` →
   `#result-links a[href=…/delivery]`; the receipts tests' scripted `view` (`context(…)`, about `:428-434`) must answer
   `dlv.delivery_page` (for example `() => ({ page })` or an `unavailable_dependency` refusal): two tests fail with
   "unexpected read dlv.delivery_page" until then.
2. `test/unit/web/carried-forms-ta.test.ts:243-246`: `#closure a[href=…/delivery]` → `#result-links a[href=…/delivery]`
   (both lines); `#closure ul.checklist[aria-label="Completion requirements"]` → `#result-closing
   ul.checklist[aria-label="Closing steps"]`. The `#next-action` assertion stays valid (the fixture passes no delivery
   page read, so the step links to TA-07d).
3. Staff: `ops.selections.one` → `selectionPageResult(ctx, 'ops')` (import from `shared/delivery/routes.ts`); then
   `selectionPageHtml` and `itemLabel` in `pages.ts` can go (owner of `pages.ts`).
4. System pins (not run here): `test/system/case-work.test.ts:273` `#closure` "Who sends your result…" → `#result`
   /Emailing your result from TravelMudra is unavailable until it is added to the product/; `:483` `#closure` packet
   text → `#result` /Your preparation packet (is ready|was sent to you in full)/; `:580` → /Completing the application
   is TravelMudra’s step/; `:296` stays. `test/system/delivery.test.ts:145-168`: the ZIP form is now in `#zip` (a
   section, not a disclosure; action, fields and the selection page heading unchanged).
5. Architect: register `taDeliveryGalleryPages()` in `scripts/dev/gallery-pages.ts`; DESIGN.md (one line under
   "Travel agent's application pages": the "Result and delivery" section and the download refusal re-render by page).
6. U6 may consolidate `selectionItems` (now in `shared/delivery/routes.ts` and U2's `staff/delivery/routes.ts`).

## 7. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| P1-1 | P1 | The travel agent's words for `artifact_not_eligible` (`words.ts` `TA_CHECK`: "The result document is not available yet. TravelMudra is resolving it.") are false for a replaced result file, and Core answers that code for a noncurrent artifact (it never answers `version_replaced` for one). | V13-7: the travel agent keeps TA-07d open; the operator records a replacement of A's result; the travel agent clicks the old Download and reads "not available yet. TravelMudra is resolving it." instead of "Replaced by a newer version" (V13-7 and A66 (3) fail); TA-07 lists the old file as if it were coming. Interim: the D5 limit line. | Either reword the TA sentence in `words.ts` to a neutral one ("This result file is not released now: it is under review, withheld or replaced by a newer one."), or a Kind 1 read addition (P-13): the travel agent's delivery read answers `version_replaced` (or a `current` flag) for a noncurrent artifact. |
| P1-2 | P1 | Four unit tests outside U3's files pin the old section and reads (§6 items 1, 2). | The architect integrates U3 alone: `node --test "test/unit/**/*.test.ts"` reports 4 failures (2 in `application-workspace`, 1 in `carried-forms-ta` plus its suite). | Apply §6 items 1 and 2 in the U3 integration commit or U6. |
| P2-1 | P2 | Derived words (§5 item 6). | A reviewer asks for the source of "Nothing recorded yet". | PM review at the acceptance alignment. |
| P2-2 | P2 | No live "Selected: [n] files" announcement on the ZIP form (A79, A88). | A screen-reader user ticks a box and hears nothing about the count. | A small `enhance.js` behaviour (owner of `static/js/`). |
| P2-3 | P2 | The old SuperAdmin delivery renderer has no value slots: a refused retrieval (reason over the limit) shows the refusal but not the typed purpose and reason. | A SuperAdmin pastes a 1,200-character reason; the page says "Reason: too big" and the textarea is empty. | WP-11 rebuilds the SuperAdmin delivery view (SA-04). |
| P2-4 | P2 | The action panel and the "Next" status row of TA-07 show "Owner not yet decided" for the owner kind `unresolved_known_limitation` (`presentation.ts`, marked `oldWording` in the sweep for the architect). | After an outcome, TA-07's panel reads "Owner not yet decided" above the section's LD-04 words. | The architect's `presentation.ts` copy block (row 6, `LIMITATION_OWNER_WORDS.ta`). |
| P2-5 | P2 | `selectionItems` exists twice (shared and staff). | A change to the ZIP field rule is made in one copy. | §6 item 6. |
| P2-6 | P2 | `test/unit/web/…` "the committed crawl record matches the tree" fails in the tree (renderer digest); not caused by U3's files (public site only). | The architect's full unit run shows one failure. | The architect regenerates the crawl record at commit (not run here, as instructed). |

No P0 item.

## 8. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json --noEmit` (whole project, other units' work included) | 0 errors |
| `npx eslint --max-warnings=0` on the 9 files of §1 | 0 problems |
| `node --test test/unit/web/ta-delivery.test.ts test/unit/web/delivery-words.test.ts test/unit/bff-ta-delivery.test.ts test/unit/web/boundary-wording.test.ts test/unit/web/delivery-components.test.ts` | 91 tests pass (21 + 6 + 7 own; sweep and components 57) |
| `node --test "test/static/**/*.test.ts"` | 74 tests pass |
| `node --test "test/unit/web/*.test.ts" "test/unit/*.test.ts"` | 1,978 tests: 1,971 pass, 2 todo (other units'), 5 fail: P1-2 (4) and P2-6 (1) |
| Gallery: `taDeliveryGalleryPages()` rendered to a scratch directory | 29 pages, one `h1` each |
| Browser (Chromium, loopback, scratch copy of `static/`): overflow at 1440, 390, 360, 320 px, light and dark; axe 4 (WCAG 2.0/2.1/2.2 A and AA tags) at 1440 and 390 px | 29 pages × 2 themes: 0 px overflow at every width; 0 axe violations of any impact; the download button is 44 px tall at 390 px |

Not run: system tests, the public-site crawl record, deploys.
