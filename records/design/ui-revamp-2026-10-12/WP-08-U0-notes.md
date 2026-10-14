# WP-08 U0 notes: delivery components and the closed wording tables

Unit U0 of WP-08. Author: the U0 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration, the `DESIGN.md` update and the page units U1 to U6. U0 commits nothing; the architect integrates. Base:
lane commit bc9a353 (other units' uncommitted work was present in the same working tree; U0 touched none of it).
Binding inputs: `WP-08-design.md` §1.6, §2.0, §2.5, §2.10, §2.11, §2.14, §5, §7.1 (U0 row); `WP-08.md` §3 (Q-W08-03)
and §4 (E-01 to E-30; the amendments govern where they differ from the design); `WP-08-acceptance.md` §0.2, A36,
A38, A42, A43, A53, A70, A89, A115, A117, A126, A152.

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/delivery.ts` (new) | CMP-18 `fileRows`, `attemptRows`; CMP-21 `noticeItem` (+ `noticeList`); `deliveryFacts`; the state word `deliveryState`. No import from `src/apps/` (design-system layer). |
| `src/web/ui/index.ts` | One `export * from './delivery.ts'` line appended. No name collision (checked). |
| `static/css/components.css` | One marked block (194 lines) appended at the end of the file, after the user-text block, in its own `@layer components`. Tokens only; no existing rule changed. |
| `src/apps/shared/delivery/words.ts` (new) | The closed tables of §2.10, §2.11, §2.14 with the amendments; `DLV_MESSAGES`, `fileLabel`, `noticeText` moved here; row builders for the components; the forbidden-phrase list and checker. |
| `src/apps/shared/delivery/pages.ts` | The moved definitions removed; `import { DLV_MESSAGES, fileLabel, noticeText } from './words.ts'` and `export { DLV_MESSAGES, fileLabel, noticeText }` added. `param` stays (the old `disclosureBody` uses it). Nothing else changed. |
| `test/unit/web/delivery-components.test.ts` (new) | 23 tests. |
| `test/unit/web/boundary-wording.test.ts` (new) | 18 tests (12 swept places, 6 word-for-word tests). |
| `scripts/dev/gallery/delivery.ts` (new) | `deliveryGalleryPages()`: `delivery-staff.html` (surface `ops`), `delivery-ta.html` (surface `ta`). Not registered. |

## 2. Component API (`src/web/ui/delivery.ts`)

```ts
DELIVERY_STATE_KINDS = ['done','info','pending','action','held','failed','uncertain','unavailable','none']
interface DeliveryWord { state: DeliveryStateKind; text: Renderable; detail?: Renderable }
deliveryState(w)            // icon + text (+ detail line); unknown state or empty text → "Unavailable"
DELIVERY_UNAVAILABLE, NOT_RECORDED ('Not recorded')

interface DownloadFormTokens { action; csrfToken; operationKey; hidden?: Record<string,string> }
interface DeliveryFileRow { name; kind; reference; version?: string|null; check: DeliveryWord; download?: DownloadFormTokens|null; note? }
fileRows({ rows, caption, captionHidden?, id?, empty?, checkHeader? = 'Check now', actions? = true })

interface DeliveryAttemptRow { id?; started: Date|null; files; channel; result: DeliveryWord; resultAt: Date|null; action? }
attemptRows({ rows, caption, captionHidden?, id?, empty? })     // rows in the caller's order

type NoticeSurface = 'ta'|'ops'|'admin'
NOTICE_ACK_WORDS = { needed: 'Needs your acknowledgement', acknowledged: 'Acknowledged', notAsked: 'No acknowledgement asked' }
noticeAcknowledgement(n): DeliveryWord
noticeItem({ surface, notice: { kind, params, ackRequired, acknowledgedAt, postedAt }, words: (n) => string, href,
             application?: { label; href?: string|null }, links?: { label; href }[] })   // returns <li>
noticeList({ label, items, id? })                                                      // <ul aria-label>

interface DeliveryFact { label: string; value: DeliveryWord | 'unavailable' }
deliveryFacts({ facts, title?, id? = 'delivery-facts', headingLevel? = 3 })            // nothing when facts is empty
```

- State tones: done `success` (ink text, check), info `info`, pending `neutral` (clock), action `attention` (flag),
  held `blocked`, failed `danger`, uncertain `warning`, unavailable `unavailable`, none `neutral` (dot). The word is
  always text with an icon; `data-delivery-state` and `data-tone` are hooks, never the only cue (AC-06).
- `fileRows`: `dataTable` columns File (row header), Kind, Version (word + copyable reference), Check now (state
  word), Action (download form or note; label hidden in the card layout). The download button's visible label is
  "Download"; its accessible name is "Download [name]", plus ", version [reference]" when two rows share a name
  (design §5). Normal button size: 44 px tall (measured). Each form carries its own `_op` and `_csrf`. Forms have
  no `aria-label` (no landmark per row). `actions: false` removes the column (support view).
- `attemptRows`: columns Channel (row header, so a phone card is titled by its channel), Started, Files, Result,
  Result time, Action (only when a row has one). A missing time reads "Not recorded". `id` puts an anchor in the
  channel cell for "Resent: [link]".
- `noticeItem`: words link to the notice page; Application (unlinked without `href`, E-23); Posted [time] IST;
  Acknowledgement (one of the three words). No form, no read or unread mark (LD-06, D-W08-04).
- `deliveryFacts`: one `dl` row per fact; `'unavailable'` reads "Unavailable".

## 3. Word tables (`src/apps/shared/delivery/words.ts`)

### 3.1 API

```ts
type DeliveryReader = 'ta'|'staff'|'support'
DLV_MESSAGES, fileLabel(f), noticeText(n, { applicantName? })            // moved; re-exported by pages.ts
// §2.10 boundaries
DELIVERY_BOUNDARY_STEPS = ['send_result','request_completion','resend_uncertain_email','record_email_investigation']
boundaryWords(step, reader) → { notice?: { action, until, owner }, lines, sentence } | null   // notice parts feed boundaryNotice()
boundaryStepOf(code, context 'state'|'resend')
UNCERTAIN_EMAIL_SENTENCE, UNCERTAIN_EMAIL_TA, MAIL_TRANSPORT_WORDS, LIMITATION_OWNER_WORDS, TA_COMPLETION_PENDING_STEP,
SUPERADMIN_BOUNDARY_SENTENCE, RESEND_DUPLICATE_WARNING
followUpOwnerWords(owner|null), uncertainEmailPanelWords({ startedAt, resultAt, pending|null, otherStep })
BOUNDARY_FORBIDDEN_PHRASES, TA_BOUNDARY_FORBIDDEN_PHRASES, boundaryWordingProblems(text, 'ta'|'staff') → string[]
// §2.11 files, checks, sends, facts
fileKindWords(kind, reader), fileVersionWords(f), checkReason(code, reader), checkNowWord(f, reader), deliveryFileRow(f, reader)
ASSOCIATION_WORDS, RELEASE_ELIGIBILITY_WORDS, artifactStateWords(table, value)
emailResultWord(state, reader, at?), CHANNEL_WORDS, handoverWord(h, reader)
emailAttemptRow(e, reader, { fileNames?, action?, id?, resendOfHref? }), handoverAttemptRow(h, reader, { action?, id? })
emailAttemptsCapLine(n), noticesCapLine(n)
DELIVERY_FACT_LABELS, type EmailFact, emailFactWord(f, reader), noticeFactWord(at|null), downloadsFactWord(r|null),
acknowledgementFactWord({ acknowledgedAt, noticeHref })
PREPARATION_ONLY_TA, THIRD_PARTY_OUTCOME_LINE
type FilingShape = 'filed'|'third_party'; noPossibleFilingWords(reader, { outcome, shape? }); taCompletionWords(c, { outcome, shape? })
// §2.14 refusals
type RefusalForm; refusalSentence(form, { category, code }, { reader?, shape? }) → string|undefined
CONFLICT_OPERATION_KEY_SENTENCE, outcomeAlreadyRecordedSentence(label), CANCELLATION_UNDECLARED
```

### 3.2 Rows changed against the design, by decision or amendment

| Table, row | Words now | Source |
|---|---|---|
| `DLV_MESSAGES` `delivery_send_trigger_unselected` | §2.10 row 1 staff sentence form | §2.10 (F-W08-01) |
| `DLV_MESSAGES` `completion_check_trigger_unselected` | §2.10 row 2 staff sentence form | §2.10 |
| `DLV_MESSAGES` `uncertain_email_handling_unselected` | "Email delivery is uncertain. No automatic resend will occur." | §2.10 row 3, Q-W08-03 (verbatim) |
| `DLV_MESSAGES` `real_mail_transport_unselected` | "This installation has no mail transport, so it sends no email." | §2.10 row 5 (F-W08-12) |
| Every other `DLV_MESSAGES` row | unchanged | §7.1 U0 row |
| Boundary rows 1, 2 (staff notice owner) | "Owner: product owner" | Q-W08-03 |
| Boundary row 1 (travel agent) | notice "Emailing your result from TravelMudra is unavailable until it is added to the product. Owner: TravelMudra." + route line | §2.10; A152 (no "product owner" on TA pages); decision D3 |
| Boundary row 4 → W1 | "Resending an email whose result is uncertain is unavailable until it is added to the product. Owner: product owner." + decided rule; no travel agent words | E-25 (AM-W19-01) |
| W2 (investigation record) | notice + "The email stays uncertain." | E-26 (AM-W19-02, WP-19 §2.4) |
| Uncertain-email panel | lead, attempt facts, follow-up, "What this release offers for this email" (W1, W2), closing line | E-26 |
| Follow-up line | owner only with reason `uncertain_email_handling_unselected`; else "The application’s next step is another one: [Core's sentence]"; owner words of WP-19 §2.3 | E-27 (AM-W19-03) |
| Resend review line | `RESEND_DUPLICATE_WARNING` | E-28 (AM-W19-04) |
| Row 6 owner label, row 7 TA next step, row 8 SuperAdmin sentence | constants for the architect's `presentation.ts` copy block and U5 | §2.10, §7.1 |
| Check now (staff) | "Available for your download" / "Not available for your download" + reason | E-07 (A38) |
| Email fact (TA), only earlier files | "No email with the current result file." + "Earlier emails are listed under [Delivery]." | E-29 (AM-W19-05) |
| Email fact (TA), uncertain | "Not confirmed" + the row 3 TA sentence | §2.5, A70 |
| Cap lines | first 100 email attempts; newest 200 notices | E-10 |
| Handover (TA), direct external | "Delivered directly by an external party. This record names no file held by TravelMudra." | E-15 (AM-W10-09) |
| Preparation-only TA states | `PREPARATION_ONLY_TA` (four states) | E-15 |
| Completion (TA), met forms of `artifact`, `delivery`, `declared_completion` | neutral (decision D8) | E-05 |
| Completion (TA), `originals` | "No original document holds completion" / "An original document holds completion. TravelMudra does not show custody details here." | E-19 (AM-W12-07) |
| Completion, `no_possible_filing` | unresolved outcome: staff "Filing could not be established: recorded as External outcome unresolved", TA "TravelMudra could not confirm whether its external step went through. This is recorded as the outcome."; by shape (WP-10 words); TA neutral by default | E-16 (AM-W11-08), E-14 (AM-W10-08) |
| Completion (TA), `delivery` not met | by Core's code: row 1 TA sentence, row 3 TA sentence, or a channel-neutral sentence | §2.11, E-06 |
| Refusal, `filing_not_evidenced`, third party | "The handoff to the provider is not evidenced yet. Record the handoff evidence first (External actions)." and `THIRD_PARTY_OUTCOME_LINE` | E-13 (AM-W10-07) |
| Refusal, reject `version_blocked` | "… Its association cannot be confirmed or rejected here." | decision D9 |
| `noticeText` | `withdrawal_decision` by `result`/`code`, `deferral` "Filing [of applicant] waits until [date] (IST).", `price_change` by `cause`, `timing_risk` by `condition`; general events unchanged; missing parameter → today's words | E-30 (AM-W17-05, WP-17 §2.11 T7) |
| `noticeItem` | surface + words function; optional application link | E-23 (AM-W15-03) |

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| D1 | Components take worded values (`DeliveryWord`); `words.ts` builds rows (`deliveryFileRow`, `emailAttemptRow`, `handoverAttemptRow`). | `src/web/ui` imports nothing from `src/apps`; the words stay in one closed file; a component computes no fact (A110). |
| D2 | `DLV_MESSAGES` changes only its §2.10 rows. §2.11 and §2.14 words are new tables. | §7.1 U0 row. The old renderer still serves the SuperAdmin view and staff notices; e.g. `operation_key_reused` stays "Open the page again" because "Your values are kept" is true only on the rebuilt host pages. |
| D3 | Travel agent boundary owner reads "TravelMudra"; staff reads "product owner". | Q-W08-03 names the staff owner; A152 forbids "product owner" on TA pages; §2.10 row 1 TA text and row 6 TA label say "TravelMudra". Open item P1-2. |
| D4 | Staff check = state word + reason sentence on its own line, not "Not releasable now: [fragment]". | E-07 changes the label; acceptance §0.2: draft copy passes when it states the same facts. |
| D5 | Attempt time reads "Started [time]" (row 3 says "Sent [time]"); attempt rows put Channel first. | The read carries `queuedAt`, not a send time; design §1.6 names the column "Started". Channel first gives each phone card a title. |
| D6 | Kind "Your document" (TA) and "Document" (staff, support). | DESIGN.md: staff pages never say "you" for the travel agent; "Document" is today's staff fallback word. |
| D7 | TA `no_possible_filing` words are neutral ("its external step") unless the caller passes `shape: 'filed'`. | The TA read has no service mode (WP-10 STOP-W10-07); "the filing" is false for a provider handoff. |
| D8 | TA met sentences: "No result document holds completion", "Nothing the service requires for delivery is missing", "Nothing the service declares for completion is missing". | E-05 / R-05: Core marks these met without a file, a delivery (delivery kind `none`) or a notice; the design's sentences claimed them; "delivered" for a mail acceptance is banned (E-12). Built on E-19's approved pattern. |
| D9 | §2.2 item 8 "Its association is not decided here." → "… cannot be confirmed or rejected here." | Q-W08-03: the sweep refuses "not decided" in staff delivery copy. |
| D10 | The sweep's phrase list and checker live in `words.ts`; the test reads visible text (text, `title`, `aria-label`) without `code` identifiers. | Other units' own tests can import the checker; a staff reference code (`…_unselected`) is an identifier, not wording. |
| D11 | `checkReason`: the §2.11 table, then the code's `DLV_MESSAGES` sentence (packet codes, recipient codes), then the reference fallback. | §2.11 "today's sentences"; A115 requires words where they exist. |
| D12 | Support reader: no action column; "Available to the travel agent" / "Not available to the travel agent" + the TA reason. | DESIGN.md support view; E-24 ("a support view shows none"). §2.0's disabled download is superseded. |
| D13 | `noticeText` takes an optional `applicantName`; a deferral date reads "20 Oct 2026 (IST)"; an invalid date gives today's words. | T7 names the applicant; the notice carries none. |
| D14 | TA downloads result `unavailable` → "Not sent: file unavailable". | §2.11 has no word for it; today's label. |
| D15 | Files of a non-packet record read "Not shown here". | The read returns no files for those records. |

## 5. Deviations

1. D4, D5, D8, D9 change design words (reasons above).
2. Derived words with no design or amendment text (architect or PM review, P2-1): D8 sentences; TA blockers
   `document_blocked` ("The result document is held while TravelMudra handles a problem with it."),
   `delivery_evidence_missing` ("The delivery record this service requires is not recorded yet."),
   `declaration_item_unresolved` (two sentences); E-16 staff third-party form ("The handoff to the provider could
   not be established: recorded as External outcome unresolved"); "Started"; "Not shown here"; "Not sent: file
   unavailable"; "Unrecognised requirement".
3. Not built in U0 (owned elsewhere): E-20 disclosure body (the notice page renderer, U4 or WP-14); E-22 and E-30
   links ("Decide on the changed terms" and the T7 pages; U4 passes them through `noticeItem({ links })`); AM-W11-10
   notice addition (WP-11 U5, now in `words.ts`, not `pages.ts`); OP-07 neutral staff requirement labels (U2).

## 6. What U1 to U6 must use

- All units: words only from `words.ts`; states only through `deliveryState`, `fileRows`, `attemptRows`,
  `deliveryFacts`, `noticeItem`. Boundary notices: `boundaryNotice({ id, ...boundaryWords(step, reader).notice,
  kind: 'known_limitation' })`, then its `lines`; the unavailable control `unavailableButton({ label, noticeId })`.
  Refusals: `refusalSentence(form, error, { reader, shape })`, else the category text + reference (UAT-13).
- U1 (OP-05, OP-05r): `ASSOCIATION_WORDS`, `RELEASE_ELIGIBILITY_WORDS`, `artifactStateWords`; refusal forms
  `record_outcome`, `cancellation`, `result_file`, `confirm`, `reject`, `review_copy`; `outcomeAlreadyRecordedSentence`;
  `CANCELLATION_UNDECLARED`; `THIRD_PARTY_OUTCOME_LINE` and `shape: 'third_party'` (E-13).
- U2 (OP-06, OP-06s, OP-07): `fileRows` with `deliveryFileRow(f, 'staff')` + download tokens; `attemptRows` with
  `emailAttemptRow`/`handoverAttemptRow`; uncertain row action = the panel of `uncertainEmailPanelWords` (E-26,
  E-27; `otherStep` = Core's pending sentence); `RESEND_DUPLICATE_WARNING` (E-28); `emailAttemptsCapLine`; send
  boundary `send_result`, completion boundary `request_completion`; `MAIL_TRANSPORT_WORDS` label for the resend
  refusal; `noPossibleFilingWords('staff', …)` (E-16). The OP-07 neutral labels (E-05, A51) are U2's.
- U3 (TA-07r, TA-07d, selection page): `deliveryFileRow(f, 'ta' | 'support')`; `deliveryFacts` with
  `emailFactWord` (choose `none_current` when emails exist but none holds a current result version, E-29),
  `noticeFactWord`, `downloadsFactWord`, `acknowledgementFactWord`, `handoverWord(h, 'ta')`; closing steps
  `checklist(c.map((x) => taCompletionWords(x, { outcome })))` (never pass `notApplicable`, E-05);
  `PREPARATION_ONLY_TA` (E-15); TA boundary words. Do not claim "Not posted" or "None yet" when the read returned
  its cap (E-10).
- U4 (TA-10, TA-10n, TA-07x): `noticeList` + `noticeItem({ surface, words: noticeText, … })`; `noticesCapLine`;
  pass `applicantName` to `noticeText` for a deferral; the E-20 disclosure body words (AM-W14-02) on the notice
  page.
- U5 (copy sweep): `DLV_MESSAGES` is already reworded. Use `SUPERADMIN_BOUNDARY_SENTENCE` (row 8) on the SuperAdmin
  delivery view and Monitors; `boundaryWords(…, 'staff').sentence` for `CORE_MESSAGES`; update
  `test/system/delivery.test.ts:120, 231` (old sentence, see P1-1).
- Architect: `presentation.ts` copy block from `LIMITATION_OWNER_WORDS` (row 6) and `TA_COMPLETION_PENDING_STEP`
  (row 7). Register `deliveryGalleryPages()` in `scripts/dev/gallery-pages.ts`.
- Sweep list: each unit adds its renderers to `SWEPT_PLACES` in `test/unit/web/boundary-wording.test.ts`, and the
  unit that rewords an old place removes its `oldWording` mark in the same change (the test fails when a marked
  place is clean). Marked now: the shared case sentences (U5), the TA application page `#closure`/`#result` (U3),
  the staff case page completion section (U5), the owner label of `unresolved_known_limitation` (architect), the
  SuperAdmin Monitors (U5). Clean now: the word tables, today's TA, ops and admin delivery pages, the TA next steps.
  Other tests can call `boundaryWordingProblems(text, reader)` directly.

## 7. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| P1-1 | P1 | Two system-test assertions pin the old `DLV_MESSAGES` sentence: `test/system/delivery.test.ts:120` and `:231` ("Who starts sending a result by email is not decided yet"). | The architect integrates U0 alone and runs `npm run test:system`: both assertions fail although the page is correct. | Integrate U0 with U5's test update (design §7.3), or change the two lines to `/Sending the result by email is the assigned operator’s explicit step/` in the U0 commit. |
| P1-2 | P1 | Owner word on travel agent pages: Q-W08-03 says "product owner (not TravelMudra)"; A152 forbids "product owner" on TA pages. U0 uses "TravelMudra" for the TA (D3). | The architect reads Q-W08-03 as binding for the TA too; a TA page then shows "Owner: product owner" and fails A152. | The architect confirms D3 (or decides), and records it for Max's end review. |
| P2-1 | P2 | Derived words (§5 item 2) have no design source. | A reviewer finds "Nothing the service requires for delivery is missing" and asks for its source. | PM or architect review in the integration pass. |
| P2-2 | P2 | "Current result file" for the TA email fact: the TA delivery read marks currency only through `available` and `denyCode`. | A replaced result whose check answers `artifact_not_eligible` (noncurrent) counts as current; the fact shows its old email, not "No email with the current result file". | U3 treats only available artifact files (or `denyCode` not `version_replaced`/`artifact_not_eligible`) as current, and states the limit. |
| P2-3 | P2 | `src/apps/staff/home/inbox.ts` (another unit's uncommitted file) holds row 8 words in its own `BOUNDARY_WORDS` constant. | The row 8 words change in `words.ts`; the SA-01 inbox keeps the old copy. | After integration, import `SUPERADMIN_BOUNDARY_SENTENCE`. |
| P2-4 | P2 | The old `disclosureBody` in `pages.ts` still says "The file is blocked" and "TravelMudra has asked the recipient to delete it" (E-20 not applied; U0 may not edit it). | A SuperAdmin-opened disclosure notice tells the travel agent the file was blocked when nothing was blocked. | U4 applies E-20 on the rebuilt notice page (WP-14 Q-W14-04 binds it to WP-08). |
| P2-5 | P2 | The sweep marks old places by a ratchet. | U5 rewords `CORE_MESSAGES` and the boundary-wording test fails with "remove its old-wording mark". | Expected; the unit removes the mark in the same change (§6). |
| P2-6 | P2 | The operator reading `src/apps/staff/work/reading.ts:1248` (`WAITING_WORDS.unresolved_known_limitation`) holds "an owner not yet decided". Today the branch is not reached: `actionPanelReading` returns "Unavailable in this release" for that owner kind first (`:1447`). | A later edit moves the `unresolved_known_limitation` branch below the generic "Waiting on …" row; OP-02 then reads "Waiting on an owner not yet decided" (LD-04 forbids it). | One-line change to the row 6 words in a WP-07 follow-up or U5; add the reading to `SWEPT_PLACES`. |

No P0 item.

## 8. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json --noEmit` (whole project, other units' work included) | 0 errors |
| `npx eslint --max-warnings=0` on the 8 files of §1 | 0 problems |
| `node --test test/unit/web/delivery-components.test.ts test/unit/web/boundary-wording.test.ts` | 41 tests pass |
| Tests on the path of the moved names (`delivery-words`, `ta-home`, `packet-handover`, `application-workspace`, `carried-forms-ta`, `operator-tables`, `travel-recheck`, `review-submit`, `prepare-pages`, `applications-list`, `document-detail`, `nav-counts`, `bff-access-change`, `bff-documents`, plus the two new files) | 282 tests pass |
| `node --test "test/unit/web/*.test.ts"` | 1317 tests: 1316 pass, 1 todo (another unit's existing todo in `individual-intake.test.ts`), 0 fail |
| Gallery: `deliveryGalleryPages()` rendered with the static directory (scratch directory, temporary script removed) | 2 pages, one `h1` each |
| Browser (Chromium, loopback): horizontal overflow at 1440, 390, 360, 320 px, light and dark | 0 px on both pages |
| axe 4 (WCAG 2.2 A/AA tags) at 1440 and 390 px, light and dark | 0 violations of any impact |
| Download button size at 390 px | 44 px tall |

Not run: system tests (`npm run test:system`; P1-1 predicts two failures), the public-site crawl record (the architect
regenerates it at commit), `npm run check`. The CSP console messages seen during the browser check came from the axe
script injection (they appear only on the widths where axe ran); the components render no inline style or script
(unit test).
