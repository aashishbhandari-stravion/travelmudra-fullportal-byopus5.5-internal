# WP-08 U2 notes: OP-06 result delivery (send preview) and OP-07 request completion

Unit U2 of WP-08. Author: the U2 engineer, 13 October 2026. Input for the architect's integration and for U6 (wiring).
U2 commits nothing. Base: lane branch `ui-revamp-2026-10-12` at bc9a353 with the other units' uncommitted work in the same
tree (U2 touched none of it). Binding inputs: `WP-08-design.md` §2.0, §2.3, §2.4, §2.10, §2.11, §2.12, §2.13, §2.14, §4, §5,
§7.1 (U2 row); `WP-08.md` §3 (Q-W08-01, Q-W08-03), §4 (E-04 to E-07, E-10, E-14, E-16, E-18, E-24 to E-28), §6;
`WP-08-acceptance.md` A35 to A62, A111 to A117, A153; `WP-08-U0-notes.md` §6; `PLAN.md` LD-14, LD-17; and the owner
decision **E-31** (Max, 13 Oct 2026, through the coordinator): the operator's delivery and send-preview page MUST NOT show
the travel agent's email address; it names the recipient in role words, with no address and no address input.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/delivery/send-page.ts` (new) | OP-06 renderer `sendPage` (with the send preview the brief calls OP-06s), `sendReceiptExpectations`, `SendRefusal`, `manualEmailProblems`, `MANUAL_TOO_MANY`, `CARRIED_DONE`. |
| `src/apps/staff/delivery/completion-page.ts` (new) | OP-07 renderer `completionPage`; the shared frame of the delivery and completion pages (`deliveryFrame`, `deliveryStrip`, `deliveryShell`, `deliveryMeta`, `deliveryReaderOf`); hrefs (`resultDeliveryHref`, `completionHref`, `outcomeHref`, `withOrigin`); the staff requirement words (`requirementLabel`, `requirementDetail`, `requirementItem`, `deliveryChannelOf`, `filingShapeOf`, `DELIVERY_NOT_MET_BY_DOWNLOAD`). |
| `src/apps/staff/delivery/routes.ts` | Operator routes rebuilt (§2); new export `opsCompletionRoutes()`; SuperAdmin routes unchanged in behaviour; `ops.incidents.review_copy` and `ops.selections.one` kept as they were. |
| `test/unit/web/send-page.test.ts` (new) | 15 tests. |
| `test/unit/web/completion-page.test.ts` (new) | 11 tests. |
| `test/unit/bff-send.test.ts` (new) | 7 HTTP tests with a scripted Core. |
| `scripts/dev/gallery/send-result.ts` (new) | `sendResultGalleryPages()` (4 pages) and the shared fixtures (`sendCase`, `sendDeliveryPage`, `elevenFiles`, `elevenSelections`, `sendRequest`, …). Not registered. |
| `scripts/dev/gallery/completion.ts` (new) | `completionGalleryPages()` (6 pages) and `completionCase`, `completionIncident`, `completionWork`, `COMPLETION_ROWS`. Not registered. |
| `test/unit/web/boundary-wording.test.ts` | Two imports and two `SWEPT_PLACES` entries appended (every state of both galleries). No `oldWording` mark removed: U2 rewords no marked place. |

No change under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`,
`migrations/`, and no WP-07 file edited (U2 imports `workspaceTabs`, `workspaceHref`, `originOf`, `istToday` from
`workspace.ts` and `actionPanelReading`, `operatorHref`, `operatorSentence`, `accountNameOf` from `reading.ts`).

## 2. Routes

Every id, path, method, surface, action, command and field name is unchanged unless stated. Form actions on OP-06 carry
`?from=applications` only when the reader came from Applications (the handlers read it from the query); the carried forms
never do.

| Route id | Method, path | Action, command | Change |
|---|---|---|---|
| `ops.delivery` | GET `/ops/applications/:applicationId/delivery` | `application.read` | Renders OP-06. Reads `dlv.delivery_page` and `core.ops_case` (required), opt. `iam.own_grants` (only when the reader is not the assigned operator), the receipt through `readReceipt`. |
| `ops.applications.completion` (new) | GET `/ops/applications/:applicationId/completion` | `application.read` | OP-07. Reads `core.ops_case` (required), opt. `ops.case_work`, opt. `iam.own_grants`. **Exported by `opsCompletionRoutes()`, not by `staffDeliveryRoutes()`** (§5 item 1). |
| `ops.delivery.manual_email` | POST `…/manual-emails` | `operator.record_manual_email`, `dlv.record_manual_email` | Every `version.<n>` read whole, any index; a `version.*` field of another form holding a value is refused; input over the contract (eleven files, an address over 254) refused at its field before any command; accepted → `receiptLocation(OP-06, 'manual_email', key)` (D-W08-16); refused → OP-06 at the POST address with every value kept. Body limit 8 KiB → 32 KiB. |
| `ops.delivery.resend` | POST `/ops/email-sends/:emailSendId/resend` | `operator.manual_resend`, `dlv.manual_resend` | Reason read whole (contract refuses over 1,000); accepted → `receiptLocation(OP-06, 'resend', key)`; refused → OP-06 with the form open and the reason kept; `stale_revision` → CMP-14 comparison; the posted `_rev.email` kept on the form shown again. Hidden `applicationId` stays BFF-only. Body limit 8 KiB → 16 KiB. |
| `ops.delivery.document_email` | POST `…/document-email` | `delivery.send_document_email`, `dlv.queue_document_email` | Core's boundary refusal re-renders OP-06 (409) with the §2.10 row 1 words; nothing runs. |
| `ops.delivery.retrieve`, `ops.delivery.packet_retrieve` | POST `…/documents/:versionId/retrieve`, `…/packets/:packetId/retrieve` | `document.retrieve_bytes`, `dlv.retrieve_document` | A refused release re-renders OP-06 with the §2.14 sentence (was the old renderer). |
| `ops.selections.create` | POST `/ops/selections` | `selection.retrieve`, `dlv.retrieve_selection` | Every `item.<n>` read whole (the old handler cut kind and id to 40 and dropped unreadable items); unreadable, none and over 500 refused before Core with the ticks kept; a refused release re-renders OP-06 with the ZIP open and ticks kept. Body limit 32 KiB → 64 KiB. |
| `ops.delivery.handover`, `ops.delivery.direct_external` | POST `…/handovers`, `…/direct-external` | as before | Carried (WP-10). Fields read whole (no `slice`), contract check before the command, success `?done=` unchanged; a refusal re-renders OP-06 with the carried form open (was the old renderer). Body limit 8 KiB → 16 KiB. |
| `ops.selections.one` | GET `/ops/selections/:selectionId` | unchanged | Still the old `selectionPageHtml`; U6 points it at U3's shared renderer. |
| `ops.incidents.review_copy` | POST | unchanged | Kept (U1 copies it; U6 removes it here). |
| `ops.notices`, `ops.notices.one`, `ops.notices.acknowledge`; all `admin.*`; `ta.delivery`, `ta.notices*` | | unchanged | `admin.delivery.completion_check` now calls a local `boundaryOnAdminPage` with the same behaviour as before. |

## 3. States per page

**OP-06** (`/ops/applications/:id/delivery`). Frame: header "Result delivery: [applicant]" (breadcrumb My work or
Applications › applicant → the workspace's Delivery & originals tab; meta Application, Service, Travel agent with
"(account suspended)", Outcome; "Read at"), read-grant line for a reader who is not the assigned operator, the WP-07 tabs
(Delivery & originals current), the strip "Delivery and completion pages". Then the receipt (first in `main`) or the
refusal block, then:

| State | What shows |
|---|---|
| Assigned operator, issued | Send result: Recipient ("Recipient: The travel agent who owns this application (their account email)", "Travel agent account: Active/Suspended…", the re-read line); Files (result files and packet, check column "Check now: your web download", caption E-07); What this service requires (delivery and declared completion from Core's flags); Send the result (§2.10 row 1 notice with the route "Record an email you sent yourself", the decided rule, unavailable "Send result"); Earlier sends and records (newest first; caps of E-10). Then Record an email you sent yourself; Other delivery records (carried or links); Files of this application (downloads, ZIP); Downloads and checks; related links. |
| No outcome | Files: "No result file is recorded yet."; requirements Not met by Core's codes (never "Not applicable yet"). |
| Outcome, nothing releasable | "No result file can be released now. [artifact requirement in words]" + link "Outcome and result file". |
| Failed email | "Failed: not sent"; resend form only when `resendOffer.allowed` and the reader is the assigned operator; E-28 warning when another email is uncertain; a resent one reads "Resent: the resend started [time]". |
| Uncertain email | Result "Uncertain"; panel in E-26 order: the sentence word for word, Started, Result recorded/not recorded, follow-up (E-27: owner only when Core's pending reason is `uncertain_email_handling_unselected`, else "The application’s next step is another one: …"), "What this release offers for this email" with W1 and W2 notices (owner "product owner"), the closing line. No control. |
| Travel agent suspended | "Suspended: nothing is sent or released to a suspended account."; Core's reasons on each file. |
| Application blocked | Callout "Releases are paused" above the files. |
| Read grant (E-24) | Facts, the read-grant line, downloads and the ZIP for what Core allows; no command form. |
| Refusals | Manual email (fields, eleven files → `MANUAL_TOO_MANY`, address → §2.3 C2), resend (reason, W1, mail transport label F-W08-12, stale → comparison), send boundary (409, links to the notice), download and ZIP (§2.14), carried forms (sentence, form open). |
| Receipts | `manual_email` "Manual email recorded" only when the handover row named by `handoverId` is an operator's email; `resend` "Resend queued" when both ids are send references; otherwise unchecked. |

**OP-07** (`/ops/applications/:id/completion`). Same frame (strip current "Request completion"). Status facts: Stage,
Outcome (own row), Next (WP-07 `actionPanelReading` owner and step). "What completion needs" table: Requirement
(neutral label), State (Core's flag: Met / Not met), Detail (Core's codes in words), Owner ("Owner now: …" only when Core
names it, "You" only for the reader, else "Owner not shown by this read."; then the recording role), Where (by channel).
Continuing duties: Core's open incidents, the two lines (B24, E-06 "may be incomplete"), "No open incident." or
"Unavailable". The completion step: §2.10 row 2 notice + unavailable "Request completion" while the lifecycle is submitted.

| State | What shows |
|---|---|
| Waiting (issued, delivery not met) | Delivery row: §2.10 row 1 sentence + "A download by the travel agent or a manual email record does not meet this requirement…"; owner "Not available in this release. Follow-up: You."; Where Result delivery `#send`. |
| Every requirement met, submitted | "Every requirement is met now. The application does not complete by itself: completion is the step below." |
| Completed | h2 "Processing completed"; requirements "as recorded now"; "Processing completed. [n] incident(s) remain(s) open."; no action. |
| Ended with the group | "This application ended with its group after the travel return date. This is not an outcome."; no action. |
| Before an outcome | Rows by Core's flags; the filing row names the reconciliation owner; originals with the parked return notice when Core's pending reason is `parked_custody_route_policy` (E-18). |
| External outcome unresolved (E-16) | Filing row "Filing could not be established: recorded as External outcome unresolved." (provider form for a third-party service). |
| Case work unreadable | Duties "Open incidents: Unavailable."; artifact incident owners not shown. |

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| U2-D1 | Frame = `pageHeader` + WP-07 `workspaceTabs(…, 'delivery', from)` + the second-level strip; not the full `workspaceFrame`. | Design §1.3 and Q-W08-14 place the pages under "Delivery & originals" with the strip as its second level. `workspaceFrame` needs `ops.case_work`, which the design does not read on OP-06; the WP-07 act pages use the same header pattern. |
| U2-D2 | Command forms show only when Core's `viewerAssigned` is true (and outside a support view) and Core's offer is not null. | Core's delivery read sets `offers` for every operator reader, a read-grant reader included (`modules/delivery/pages.ts`), while the command refuses them; `viewerAssigned` is Core's fact "only then are operator actions offered". |
| U2-D3 | Send result order: recipient, files, requirements, the send step, then earlier sends and records. | A49 and the design's mobile note put the boundary before earlier sends; A35's relative order of the other four is kept. One DOM order serves every width. |
| U2-D4 | The brief's "OP-06s" is built as the send preview section of OP-06. The design's OP-06s (the operator's selection page) stays on the old renderer. | Brief: `ops.selections.one` waits for U3's shared renderer (U6). |
| U2-D5 | E-31 recipient words: "Recipient: The travel agent who owns this application (their account email)"; no address, no input in the preview. | Owner decision E-31. |
| U2-D6 | OP-07 neutral labels (E-05, A51): "Outcome of the application", "Filing state settled" / "Handoff to the provider settled" / "External acts settled" (by service mode), "Result file", "Originals", "Delivery of the result", "Completion evidence the service declares", "Group end rule". A met row reads "Nothing reported missing."; the filing row reads the shape words of `noPossibleFilingWords('staff')` (E-14, E-16). | U0 notes §5 item 3 left the staff labels to U2; no label claims a file, notice or delivery. |
| U2-D7 | Owner column: "Owner now" from three Core facts only: the pending answer (closed table reason → requirement), the reconciliation owners of acts in doubt, and the owners/reviewers of open result-file incidents. The recording role is a second line in role words. | E-06, A51. |
| U2-D8 | Delivery channel from Core's codes and the service mode: `document_email` when the codes name the send or an uncertain email, `packet` for a preparation-only service, otherwise not shown. Where: OP-06 `#send`, OP-06h when served, else OP-06. | E-06, E-14; Core does not return the declared delivery kind (§6 P2-1). |
| U2-D9 | OP-07 "Next" uses WP-07 `actionPanelReading` (owner, step, lines). | One operator wording of Core's pending answer; no new owner words. |
| U2-D10 | The completion control shows while the lifecycle is `submitted`. | Design §2.4 item 6 ("while the application is open"); the lifecycle is Core's. |
| U2-D11 | The uncertain row's result keeps "Uncertain" and its time without the detail sentence; the panel leads with the sentence. | The sentence would otherwise show twice in one row; E-26 puts it first in the panel. |
| U2-D12 | Manual email ticks: every non-packet file of the read (design §2.3 item 5), each hinted with its version words and reference; after a refusal, a submitted value the page does not list is kept as an extra ticked box under a new index. | E-04 / LD-17: every value kept; no name collision with listed indices. |
| U2-D13 | Receipt checks bind the summary to the read: `manual_email` needs the `handovers` row of `handoverId` with kind `manual_operator_email`; `resend` needs two `eml_` references. | Design §2.12; a handover operation key under `done=manual_email` reads unchecked. |
| U2-D14 | Retrieval result words are a local staff table (Sent in full, Interrupted, Not sent: file unavailable / refused, Result not recorded); every returned row shows (the old page cut at 100) with the "newest 500" cap line. | LD-17, E-10. |
| U2-D15 | Carried handover and direct external forms keep their markup, fields, action and `?done=` redirect; their refusals now re-render OP-06 with the form open and the reason. Typed values are not kept (the carried markup has no value slots). | One host page per command; WP-10 rebuilds them (OP-06h, OP-06e). Where those pages are served (`hasPage`), OP-06 links to them instead. |
| U2-D16 | `ops.applications.completion` is exported by `opsCompletionRoutes()`, not by `staffDeliveryRoutes()`. | The staff instance registers `staffDeliveryRoutes()` and refuses to start with a route the inventory does not list (`route_not_in_inventory`, seen in `test/unit/bff.test.ts`). The inventory is U6's file. |
| U2-D17 | A local `inputRefusal` in `routes.ts` (contract check before the command). | The WP-07 copy lives in a route module (`acts-routes.ts`); importing it would couple two route modules. |
| U2-D18 | ZIP: a fieldset "Files in the ZIP"; button "Download selected files" (A130). | Labelled group; acceptance wording. |

## 5. What U6 must do

1. Add the inventory entry for `ops.applications.completion` (GET `/ops/applications/:applicationId/completion`, surface
   `ops`, action `application.read`, roles as O53) and register `opsCompletionRoutes()` (in the staff instance, or inside
   `staffDeliveryRoutes()`), in the same change. Until then the strip shows no "Request completion" tab on a live instance.
2. Point `ops.selections.one` at U3's shared selection renderer.
3. Remove `ops.incidents.review_copy` from `src/apps/staff/delivery/routes.ts` when U1's copy is registered.
4. System-test pins on OP-06 (`test/system/delivery.test.ts`): `:208` "Record a delivery" → "Other delivery records";
   `:211` the breadcrumb link is now `/ops/applications/<id>?tab=delivery` (the workspace tab); `:227` "Send the result by
   email" → "Send result"; `:120` and `:231` the §2.10 sentence (U0 P1-1). The direct external submit at `:215` still
   works (same carried form and action).
5. Links into OP-06 and OP-07 from the workspace's Delivery & originals tab (WP-07) and the old case page
   (`completionSection`, U5): "Result delivery" and "Request completion".
6. E-31 SuperAdmin variant: the SuperAdmin delivery view (old renderer, WP-11) shows the travel agent's address once Core
   serves it (P-13 item 1). Not in U2.
7. `carried-forms-wp08.test.ts`: OP-06 holds `form[action="/ops/applications/:id/handovers"]` and `…/direct-external`
   while OP-06h and OP-06e are not served; no form posts `…/document-email`.
8. Architect: register `sendResultGalleryPages()` and `completionGalleryPages()` in `scripts/dev/gallery-pages.ts`.

## 6. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| P1-1 | P1 | E-31 says "no address input". OP-06 keeps the manual email form's "Sent to" (`recipientEmail`, type email), which `dlv.record_manual_email` requires; after a refusal the field shows the address the operator typed. | The architect reads E-31 as page-wide; the manual record (Q-W08-01) then cannot be posted, because Core refuses a record without `recipientEmail`. Or: an operator types the correct address, forgets the date, and the refused page shows that address back in the field. | U2 applies E-31 to the recipient fact of the send preview (test: no "@" and no input there). Max confirms the scope. If E-31 covers the form too, a Kind 2 change: Core records the manual email against the current account address without a typed one. |
| P1-2 | P1 | The completion route is outside `staffDeliveryRoutes()` until U6 adds its inventory entry. | U6 registers `opsCompletionRoutes()` without the inventory row: the staff instance refuses to start (`route_not_in_inventory`). Or U6 adds the row and forgets the routes: `test/unit/bff.test.ts` fails "serve every inventory route". | One U6 change does both (§5 item 1). |
| P2-1 | P2 | Core returns no declared delivery kind on `core.ops_case`. | A direct-external service with no record yet: the OP-07 delivery row reads "The delivery record this service requires is not recorded yet." and links "Result delivery", not OP-06e (E-14 asks for OP-06e). | Add "declared delivery kind for the recorded outcome" to P-13 (Kind 1). |
| P2-2 | P2 | Derived words without a design source: OP-07 labels and details (U2-D6), "Nothing reported missing.", "Owner not shown by this read.", recording roles, `MANUAL_TOO_MANY`, the handover cap line "This list shows the first 100 delivery records. Later records may exist.", the downloads cap line, "Resent once. The resend is not among the attempts listed here.", the ZIP unreadable sentence. | A reviewer asks for the source of "Group end rule". | PM review at the acceptance alignment. |
| P2-3 | P2 | `inputRefusal` now exists in five places. | A change to the refusal shape is made in four of them. | One helper in `src/apps/shared/core/shared.ts` (WP-07 U4 notes already propose it). |
| P2-4 | P2 | The carried handover and direct external forms keep no typed values after a refusal. | An operator's refused handover record loses the evidence reference typed. | WP-10 rebuilds both forms on OP-06h and OP-06e. |
| P2-5 | P2 | `test/static/tree.test.ts` fails on `src/apps/shared/pages/services.ts:321, 323` (country code literal `IND`). Not a U2 file. | The static suite is red at integration. | The owner of `services.ts` fixes it. |

No P0 item.

## 7. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json --noEmit` (whole project, other units' work included) | 0 errors |
| `npx eslint --max-warnings=0` on the 9 files of §1 | 0 problems |
| `node --test test/unit/web/send-page.test.ts test/unit/web/completion-page.test.ts test/unit/bff-send.test.ts test/unit/web/boundary-wording.test.ts test/unit/web/delivery-components.test.ts` | 79 tests pass (15 + 11 + 7 + 23 + 23) |
| `node --test "test/static/**/*.test.ts"` | 74 tests: 73 pass, 1 fail (P2-5, not U2) |
| `node --test test/unit/bff.test.ts` (wiring, inventory) | 17 pass |
| `node --test "test/unit/web/*.test.ts"` | 1401 tests: 1400 pass, 1 todo (another unit's), 0 fail |
| Gallery: both modules rendered from a scratch script | 10 pages, one `h1` each |

Not run: system tests (`npm run test:system`; §5 item 4 predicts four pins in `delivery.test.ts`), browser axe and width
checks, the public-site crawl record, deployment.
