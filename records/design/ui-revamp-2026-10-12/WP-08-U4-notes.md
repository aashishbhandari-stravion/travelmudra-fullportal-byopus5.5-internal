# WP-08 U4 notes: travel agent notices, notice acknowledgement, application history

Unit U4 of WP-08 (TA-10, TA-10n, TA-07x). Author: the U4 engineer, 13 October 2026. Input for the architect's
integration, U6 wiring and WP-15 U5. U4 commits nothing. Base: lane branch `ui-revamp-2026-10-12` at bc9a353 with
other units' uncommitted work in the same tree (U4 touched none of it). Binding inputs: `WP-08-design.md` §2.0, §2.8,
§2.9, §2.10, §2.11, §2.14, §4, §5, §7.1 (U4 row); `WP-08.md` §3 (Q-W08-02), §4 (E-10, E-20, E-22, E-23, E-30), §6 (U0
decisions, "E-30 deferral words"); `WP-08-acceptance.md` A89 to A107, A120; `WP-08-U0-notes.md` §6; `WP-15.md` §4
N-05 and `WP-15-acceptance.md` A81 (acknowledgement records reading only); `WP-14-design.md` AM-W14-02; `WP-13-design.md`
AM-W13-04; `WP-17.md` R-06 / O-06; PLAN LD-14, LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/pages/notices.ts` (new) | TA-10 `noticesPage` and TA-10n `noticePage` over a `NoticeSurfaceSpec` (surface, paths, words function, application, delivery, links, body); `taNoticeSurface(ctx, { names })`; `taNoticeWords`, `taNoticeKindWords`, `deferralNoticeWords`; `disclosureBody` (E-20); `acknowledgementReview`; `acknowledgeRefusalMessage`; `noticeReceipts`; `noticeViewOf`, `noticesViewHref`, `awaitsAcknowledgement`; `NOTICE_LIST_LIMIT` = 200. Built on `noticeItem`/`noticeList`/`noticeAcknowledgement`/`deliveryState` (U0) and `noticeText`/`noticesCapLine`/`refusalSentence` (U0 words). |
| `src/apps/shared/delivery/ta-notice-routes.ts` (new) | `taNoticeReadRoutes()` (GET `ta.notices`, `ta.notices.one`); `acknowledgeTaNotice(ctx)` (the handler of `ta.notices.acknowledge`); path constants; `TaNoticeParams`. |
| `src/apps/shared/views/ta.ts` | `taHistoryPage` only: new optional fourth parameter `{ applicantName }`; heading, breadcrumb, lead, projection freshness, cap line. Nothing else in the file changed. |
| `src/apps/shared/views/cases.ts` | `asOfNotice`: the `history` branch (no "entry N"; the list branch unchanged); `EMAIL_RESULT_DETAILS` and two `lineDetail` cases (`email_result_recorded`, `notice_posted`); `historyTimeline`: "Recorded [time] IST". |
| `test/unit/web/ta-notices.test.ts` (new) | 18 tests. |
| `test/unit/web/ta-history.test.ts` (new) | 9 tests. |
| `test/unit/bff-notices.test.ts` (new) | 8 tests (HTTP, scripted Core). |
| `test/unit/web/boundary-wording.test.ts` | Two entries appended to `SWEPT_PLACES` (notices list and pages of every notice kind; the history with every email state and notice kind) and two import lines. No other line changed. |
| `scripts/dev/gallery/notices.ts` (new) | `noticesGalleryPages()`: 14 pages. Also exports `noticesGalleryRequest`, `galleryNotice`, `GALLERY_NOTICES`. Not registered. |
| `scripts/dev/gallery/history.ts` (new) | `historyGalleryPages()`: 6 pages. Not registered. |

## 2. Routes

| Id | Method | Path | Action | Command | Reads | Answer |
|---|---|---|---|---|---|---|
| `ta.notices` | GET | `/ta/notices` | `notice.read` (resolve `self`) | — | `dlv.notices`; opt. `core.ta_applications` (applicant names) | The list; `?view=needs_ack` (any other value: every notice) |
| `ta.notices.one` | GET | `/ta/notices/:noticeId` (`zWireId('ntc')`) | `notice.read` (resolve `notice`) | — | `dlv.notice`; `core.operation` through `readReceipt` | The notice; receipt `acknowledged` |
| `ta.notices.acknowledge` | POST | `/ta/notices/:noticeId/acknowledge` | `notice.acknowledge` | `dlv.acknowledge_notice` | re-read `dlv.notice` after a refusal | Handler `acknowledgeTaNotice` only; the declaration stays in `src/apps/edge/delivery/routes.ts` (form body, `bodyLimit` 4096, same params and resolve) |

Ids, paths and actions equal the route inventory (test). Posted fields unchanged: `_csrf`, `_op`, `_rev.notice` (the
binding maps `_rev.notice` to `expectedRevision`). Changed answers: success is `303
receiptLocation('/ta/notices/<id>', 'acknowledged', key)` (was `?done=acknowledged`); a refusal re-renders TA-10n at the
POST address with `restorePath` = `/ta/notices/<id>`, the category's status, CMP-07 focused and, when the notice still
waits, a form with the revision read now and a new `_op`. `answer()` sends session, access, maintenance and dependency
refusals to the shell; an unknown outcome goes to `/ta/operations/<key>`. The same form sent again (same `_op`) answers
the same address (test).

## 3. States per page

| Page | States |
|---|---|
| TA-10 | List (count line, two views with counts, items newest first in Core's order, no form); `needs_ack` view; S2 "No notices yet." (no count line, no views); S3 "No notice needs your acknowledgement." + "Show all notices"; at 200: qualified counts ("200 or more notices", "[n] notices shown", "Needs your acknowledgement: [n] notices among the newest 200 notices."), S3 "No notice among the newest 200 needs your acknowledgement.", cap line; names unavailable (references + a line); support view (same list; it holds no form anyway). |
| TA-10n | Waits for an acknowledgement (review line + "Acknowledge"); acknowledged; no acknowledgement asked; receipt accepted ("Notice acknowledged", current acknowledgement) or unchecked; refused `already_acknowledged`, `ack_not_required`, `stale_revision` (CMP-14 + form again), `conflict_operation_key`, any other code (category recovery + "Reference: [code]"); support view (callout, no form); disclosure deletion request, disclosure information, unknown variant (no body). |
| TA-07x | Up to date; behind by [n] s; unhealthy ("Freshness unavailable" + "This history may be incomplete"); at 1000 (cap line); empty; without the applicant's name (heading "Application history", the reference as a header fact, breadcrumb "Application"); support view (no form). |

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| D1 | Renderers take a `NoticeSurfaceSpec`: surface, paths, acknowledge route id, rail page, lead, reader, words, application (label + optional link), delivery link, extra links, body. `taNoticeSurface` is the travel agent's. | E-23: OP-10 and SA-10 reuse the same renderers with staff words and an unlinked `reassigned_away` application (tested with a staff spec). |
| D2 | The button is always "Acknowledge". Review line: deletion request "Acknowledging records that you read this notice. It does not record that you deleted anything and changes nothing else." (WP-15 A81 word for word); every other kind "Acknowledging records that you read this notice. It accepts or declines nothing and changes nothing else." | WP-15 N-05 (R-05) forbids "I deleted it"; A90 asks the review to say it accepts or declines nothing. Supersedes design §2.8 item 5 and today's "I deleted it: acknowledge". |
| D3 | E-20 disclosure body: `deletion_request` keeps today's request words, without "Then acknowledge this notice to confirm that you deleted it."; `disclosure_information` uses AM-W14-02 word for word; both list every valid release reference ("Release reference(s)", copyable), file type as "[Type] (official result)" or "An official result file". | E-20 / AM-W14-02 (only what the notice records); N-05 (the removed line presents acknowledgement as deletion evidence). Today's slice to 10 references dropped: Core records at most 50, all are shown. |
| D4 | Deferral words: "Review on [date]; readiness, authorization and packet release remain held until the deferral is ended." Without a readable `reviewOn`: "Filing is deferred. Readiness, authorization and packet release remain held until the deferral is ended." Built in `taNoticeWords` (U4), not in U0's `noticeText`. | **Correction recorded:** E-30's "Filing waits until [reviewOn]" is superseded by WP-17 R-06 / O-06 (`WP-08.md` §6, "E-30 deferral words"): the review date does not end the hold. No U4 page says "waits until" (test over every notice kind). U0's `noticeText` still has the old words (§7 P1-1). |
| D5 | `generic_case_update` / `transition_pending` reads "Changed service terms of this application wait for your decision." on the travel agent's pages. | U0's `EVENT_TEXT` is the staff third person ("waits for the travel agent"); the travel agent is the reader. Same pattern as "A new price waits for your decision." Derived word (P2-1). |
| D6 | Links (E-22, E-30), each only when this instance serves the target page (`ctx.hasPage`): `result_available` → TA-07 `#result` "See the result"; `transition_pending` → `/changed-terms` "Decide on the changed terms"; `price_change` with cause `mistaken_price` or `material_scope_change` → `/price-decision` "Decide on the price change" (else TA-07 `#price`); other `price_change`, `deferral`, `timing_risk`, events `deferral_ended`, `deferral_review_due`, `withdrawn` → TA-07 `#price` "See the price and timing"; `withdrawal_decision` → `/withdraw` "See the withdrawal decision". The links show on the list item and on the notice page. Delivery fact link only for `result_available` and `disclosure_correction` with an application. | E-22, E-30 ("TA-07d for an open increase, TA-07w for a withdrawal decision, TA-07 `#price` otherwise"); no link to a page that is not registered (TA-07t, the price decision and withdraw pages are WP-13/WP-17 GET pages not yet built). Acknowledgement unchanged for every kind. |
| D7 | Counts with `savedViewTabs` + `listCount`/`partCount` (unit "notice"); count line; `noticesCapLine`; S3 at cap. | E-10 (limit 200, `noticesOf` `LIMIT 200`); no "none", "latest" or "all" beyond the returned rows. Design §2.8 "500" is superseded. |
| D8 | TA-10n names the application "Application [reference]" (linked); the list uses applicant names from opt. `core.ta_applications`. | Design §1.2 reads for TA-10n (`dlv.notice`, `core.operation` only). P2-6. |
| D9 | Lead: "Notices from TravelMudra about your applications. Opening a notice changes nothing. A notice that asks for your acknowledgement says so; you acknowledge it on its own page." | Design's "A notice that needs a decision from you asks for your acknowledgement" is not true for a deletion request (no decision) or changed terms (decision elsewhere). |
| D10 | Refusal: `errorSummary` titled "Your acknowledgement was not recorded" with the sentence (`refusalSentence('acknowledge', …)`; stale: "This notice changed after you opened it." + CMP-14 row "Acknowledgement": yours "Needs your acknowledgement", current from the re-read); document title "Error: Notice". | Category titles ("Check the highlighted fields") name fields this form does not have; a refused command records nothing, so the title is true for every refusal. §2.13 row TA-10n. |
| D11 | History cap line: "This history shows the first 1000 entries recorded. Later entries may exist and are not shown here." | Core reads `ORDER BY seq LIMIT 1000` (`case-queries.ts`): the first recorded entries. Design §2.9 "Older entries may exist" is wrong; A104 says "first 1000". The top entry at the cap is not the latest; the page claims none. |
| D12 | History freshness: `pageHeader` projection freshness (lag form); `asOfNotice(…, 'history')` reads "This history may be incomplete" + "The application page itself is always current." with no "entry N". | LD-08, F-W08-07, §2.9 S5. The list branch of `asOfNotice` is unchanged. |
| D13 | `historyTimeline` labels each time "Recorded [time] IST" (the label of the existing `<time>`; `datetime` unchanged). | §1.6 CMP-09, A101, D-W08-13. Shared with the operator history page (Q-W08-13). |
| D14 | History heading "History: [applicant]", breadcrumb "Applications › [applicant]"; the "Back to the application" button removed. Without the name: heading "Application history", the reference as a header fact ("Application [reference]"), breadcrumb "Application". | §2.9 item 1; the breadcrumb is the way back (A107). The design's "Application [reference]" in the heading and breadcrumb overflowed by 150 px at 390 px (measured): one long word does not wrap there (A106, AC-04). |
| D15 | `email_result_recorded` details for the five recorded results only; `queued`, `sending` and unknown states add none. `notice_posted` detail = `taNoticeKindWords(kind)` (the general words of the kind; the line carries no parameters); an unknown kind adds none. | §2.9 `lineDetail` additions; "unknown values add no detail". |
| D16 | Support view on TA-10n: callout "Read only in a support view" / "Only the travel agent acknowledges this notice."; no form. | §2.0 support view, A120. |

## 5. Deviations from the design

1. D2 (button and review), D3 (deletion line removed; "Release reference"), D4 (deferral words), D5, D9, D10 change design
   words; D7 and D11 correct the design's caps (500 → 200; "older" → "later") to Core's reads.
2. D14: without the applicant's name the reference moves from the heading and breadcrumb to a header fact.
   `taHistoryPage` receives the applicant name as a parameter; the route handler (outside U4's scope) does not read it
   yet, so the page shows "Application [reference]" until U6 adds the optional read (§6 item 3).
3. Derived words without a design source (P2-1): D5; the deferral fallback; the lead; "Your acknowledgement was not
   recorded"; "This notice changed after you opened it."; "See the result", "See the price and timing", "See the
   withdrawal decision", "Decide on the price change"; "Release reference(s)"; "Applicant names cannot be read now. Each
   notice names its application by its reference."; "Older notices are not shown here."; "[n] notices shown, newest
   first."; the support-view callout.
4. Not built in U4 (owned elsewhere): the old `disclosureBody`, `noticePageHtml` and `noticesPageHtml` in
   `src/apps/shared/delivery/pages.ts` still serve the staff notice pages (U5 / WP-15 U5; §6 item 6).

## 6. What U6 and the architect must do

1. `src/apps/edge/delivery/routes.ts`: point the handler of `ta.notices.acknowledge` at `acknowledgeTaNotice` (import
   from `../../shared/delivery/ta-notice-routes.ts`); keep id, path, action, command, body, `bodyLimit` 4096, params and
   resolve. `test/unit/bff-notices.test.ts` composes exactly that route.
2. `src/apps/shared/delivery/routes.ts` `taDeliveryReadRoutes()`: replace `...noticeReadRoutes('ta')` with
   `...taNoticeReadRoutes()` (edge, and staff for the support view, both take it from there). `noticeReadRoutes` and
   `acknowledge` stay for `ops` and `admin` until WP-15 U5.
3. `src/apps/shared/views/ta.ts`, handler of `ta.applications.history` (not U4's to edit):

   ```ts
   const [v, app] = await Promise.all([
     ctx.view('views.ta_history', { applicationId: ctx.params.applicationId }),
     optionalView(ctx, 'core.ta_application', { applicationId: ctx.params.applicationId }),
   ]);
   const c = app.ok ? app.view.case.applicant.identity : null;
   return ctx.page(taHistoryPage(ctx, ctx.params.applicationId, v, { applicantName: c === null ? null : personName(c.surname, c.givenNames) }));
   ```

   (`personName` from `../core/shared.ts`.) An access refusal of the optional read reaches the shell (LD-14).
4. Register `noticesGalleryPages()` and `historyGalleryPages()` in `scripts/dev/gallery-pages.ts`.
5. U0 words (architect): correct `noticeText` in `src/apps/shared/delivery/words.ts` for `deferral` (both the dated
   "Filing … waits until [date] (IST)." and the general "Work on the application is deferred until its review date.")
   to `deferralNoticeWords`' sentences, or make `noticeText` delegate to it; then `taNoticeWords` keeps only the
   `transition_pending` override. Consumers that still show the old words: `src/apps/shared/pages/ta-home.ts:177`,
   `src/apps/shared/core/ta.ts:357`, the old `pages.ts` renderers.
6. WP-15 U5 (staff notices): build OP-10/SA-10 on `noticesPage`/`noticePage` with a staff `NoticeSurfaceSpec` (reader
   `staff`, staff words, `reassigned_away` unlinked) and `disclosureBody`; that removes the old `disclosureBody` ("The
   file is blocked", "asked the recipient to delete", "Then acknowledge … deleted it") and the "I deleted it:
   acknowledge" button from `pages.ts`.
7. Operator history page (`src/apps/staff/views/cases.ts` `opsHistoryPage`, not U4's): add the projection freshness
   line and the same cap line; it already receives the new details, "Recorded [time] IST" and the reworded unhealthy
   callout through the shared functions.
8. System tests that read these pages stay valid by content: `test/system/delivery.test.ts:177, 235` (list text),
   `test/system/case-work.test.ts:393` (`/sent to you in error/`), `test/system/case-views.test.ts:118-130, 182-185`
   (history lines and no form in a support view). Not run here.

## 7. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| P1-1 | P1 | U0's `noticeText` still words a deferral as "Filing of [applicant] waits until [date] (IST)." (and "deferred until its review date" without one); TA-01 and the TA-07 action panel use it. | A deferral is approved with review on 20 Oct. TA-01 "Recent notices" says filing waits until 20 Oct; the travel agent expects filing to resume that day, but readiness, authorization and packet release stay held until a SuperAdmin ends the deferral (O-06). | §6 item 5: one change in `words.ts` by its owner. |
| P2-1 | P2 | Derived words (§5 item 3) have no design source. | A reviewer asks where "Changed service terms of this application wait for your decision." comes from. | PM review at the acceptance alignment. |
| P2-2 | P2 | The history shows "Application history" with the reference until U6 adds the optional read (§6 item 3). | Before U6, a travel agent opens History and reads the reference instead of the applicant's name. | §6 item 3. |
| P2-8 | P2 | The design system's breadcrumb item (`.breadcrumbs a`, inline-flex) and page heading do not wrap inside one long word. | An applicant recorded with a 60-character surname without spaces: the history heading and breadcrumb overflow the page at 320 px. | A design-system CSS change (`overflow-wrap: anywhere` and `min-width: 0` on the breadcrumb link and the heading), owner of `components.css`. |
| P2-3 | P2 | "See the result" points to TA-07 `#result`, which exists only after U3 is integrated. | Integrated before U3: the link opens TA-07 at the top. | None; U3 adds the anchor. |
| P2-4 | P2 | `conflict_operation_key` reads "Your values are kept: check them and send again." on a form with no typed values (U0 sentence). | A travel agent's acknowledge form is replayed with another `_rev.notice`; the page says values were kept. | Accept, or a form-specific sentence in `words.ts` (U0 owner). |
| P2-5 | P2 | E-30 maps the staff-only events `deferral_review_due` and `withdrawn` to TA-07 `#price`; Core posts them to operators only. | None on the travel agent surface today. | None. |
| P2-6 | P2 | TA-10n names the application by reference only (design reads). | A travel agent with many applications opens a notice and must open the application to see whose it is. | Optional `core.ta_application` read on TA-10n if the PM wants the name (one more read). |
| P2-7 | P2 | `test/static/tree.test.ts` fails on `src/apps/staff/outcome/routes.ts` (`route_without_id`, six routes): another unit's uncommitted file. | The architect runs the static suite before U1 fixes it: one failure. | U1 gives its routes literal ids. |

No P0 item.

## 8. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json --noEmit` (whole project, other units' work included) | 0 errors |
| `npx eslint --max-warnings=0` on the 10 files of §1 | 0 problems |
| `node --test test/unit/web/ta-notices.test.ts test/unit/web/ta-history.test.ts test/unit/bff-notices.test.ts test/unit/web/boundary-wording.test.ts test/unit/web/delivery-components.test.ts test/unit/web/delivery-words.test.ts` | 85 tests pass (18 + 9 + 8 own; the sweep includes another unit's entry appended meanwhile) |
| `node --test "test/unit/web/*.test.ts"` | 1347 tests: 1346 pass, 1 todo (existing, `individual-intake.test.ts`), 0 fail |
| `node --test test/static/**/*.test.ts` | 74 tests: 73 pass, 1 fail (P2-7, not U4's files) |
| Gallery: `noticesGalleryPages()` and `historyGalleryPages()` rendered in a scratch directory | 20 pages, one `h1` each |
| Browser (Chromium, loopback, product CSP, scratch copy of `static/`): horizontal overflow at 1440, 390, 360, 320 px; axe 4 (WCAG 2.0/2.1/2.2 A and AA tags) at 1440 and 390 px; light and dark | 20 pages: 0 px overflow at every width and theme; 0 axe violations of any impact; the acknowledge button is 44 px tall at 390 px. The first run found 150 px overflow at 390 px on the history page without a name (fixed by D14) |

Not run: system tests, the public-site crawl record, deploys.
