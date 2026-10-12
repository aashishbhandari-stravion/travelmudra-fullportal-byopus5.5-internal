# WP-03 U5 and U5s notes: "Add one applicant", the individual result, and the shared intake rendering (P-07)

Unit U5 with U5s of WP-03. Author: the U5 engineer, 13 October 2026. Input for the architect's integration (U7 wiring,
gallery registration, `DESIGN.md`). U5 commits nothing. Base: lane commit e9e96e3 plus the uncommitted WP-02 and WP-03
U0 work. Binding inputs: `WP-03-design.md` §1.2, §1.4 row 3, §2.0, §2.10, §2.13, §2.14, §2.15, §4.3, §4.4, §4.6, §4.9,
§7, §9.1 (U5, U5s), §9.3; `WP-03.md` §3 (Q-W03-03 to Q-W03-05) and §4.1 (C-03, C-07, C-10); proposal P-07 items (a)
to (e) as assigned by the orchestrator; `WP-03-acceptance.md` A40 to A58.

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/pages/individual-intake.ts` (new) | TA-09c renderer `individualStartPage(chrome, view)`; `individualReceiptExpectations(attemptId)` (receipt `drafts`); types `IndividualStartView`, `IndividualRefusal`, `IndividualGroup`. |
| `src/apps/edge/core/individual.ts` (new) | GET route `ta.applications.new` (`individualIntakeRoutes()`); `renderIndividualStart(ctx, extra)` (reads `intake.start_page`, required, and `core.ta_group`, optional through `optionalView`). |
| `src/apps/shared/pages/intake.ts` | Renderer parts only. `StartView` loses `individual`; `error.form` is `'bulk'` only. `startPage` renders the list import form only, with a section "One applicant" that links TA-09c (only when the page is served, outside a support view, and when a service can be chosen). `attemptPage` renders the individual variant (INT-1) for `surface = 'ta'` and `sourceKind = individual_form`; `AttemptPageView` gains optional `receipt` and `readAt`. New export `ADD_ONE_APPLICANT_PATH`. `CODE_TEXT.passport_number_invalid` changed (§3 item d). No parsing change. |
| `src/apps/edge/intake/routes.ts` | P-07 items (a), (b), (c), (e) only (§3). Command envelope, input mapping and multipart field names unchanged. |
| `scripts/dev/gallery/individual-intake.ts` (new) | `individualIntakeGalleryPages()`: 7 pages (§6). Not registered. |
| `test/unit/web/individual-intake.test.ts` (new) | 32 tests: 23 renderer tests and 9 BFF route tests in front of a scripted core; one of them is `todo` (§5 F-U5-01). |
| `test/system/intake-pages.test.ts` | The two pins of the old individual form: the start page holds no individual form and links TA-09c; the refused send re-renders TA-09c (h1, field error at `doc-passport`, "Choose the files again", values kept, the two-shape passport message). Test titles unchanged (the traceability document names them). |

## 2. TA-09c "Add one applicant" (`/ta/groups/:groupId/applications/new`)

Anatomy in the order of design §2.10: header (breadcrumb Groups › [group label], `h1` "Add one applicant", lead,
freshness "Read at"); context band (CMP-24, title "About this group": group, country, travel dates IST; "View
requirements" per choosable service with formats, size and, for the identity document, the passport rule); error
summary; the duplicate link; the stale notice; in-page index "Parts of this form"; one multipart form (action
`/ta/groups/:groupId/intake/individual`, `_csrf`, `_op`, `_rev.group`) with the parts Services, Applicant, Documents,
"Create the drafts" (consequence text described by the button; "Create drafts"; "Cancel" to TA-05).

| State | Rendering |
|---|---|
| Form | Every offering of the country is one checkbox `service.<offeringId>`; never checked unless the refused form sent `yes` for it. A choosable one has the hint "[who files] · Documents: [labels]". |
| Service not choosable | Checkbox `disabled`, never checked, `aria-describedby` = its hint "Cannot be chosen now. [WP-02 TA reason]". |
| No choosable service | No form. `boundaryNotice` "Adding an applicant is unavailable until a service of [country] is open for new applications." Owner TravelMudra; route to Services when served. |
| Group closed | No form. Notice "Adding an applicant is unavailable because the group is closed." |
| Support view | No form; "Read only in a support view: only the travel agent takes this step." (The route is edge only.) |
| Group read unavailable | Form renders; the band's facts read "Unavailable"; the crumb to the group is the plain "Group" link. |
| C1 | Field errors at the fields and in the summary (design §4.9 texts). Files refused at edge: at `doc-<type>`; "The file is larger than [requirement size] for this document." A file refusal that is not about the file (storage full, rate) is form-level. |
| C2 duplicate | "This applicant already has an open application for [service] in this group. Nothing was created." ("one of the chosen services … for any service" with several chosen) and "Open the existing application" from `error.existing`. |
| C2 control | "[WP-02 TA reason] Nothing was created for any service." The re-render reads the start page again, so the service shows its reason. |
| C5 group | Summary "This group changed since you opened the form. Nothing was created."; notice "The group as it is now" (travel dates, group state) and "Your applicant details are kept below." |
| Same `_op`, changed content | "This form was already used with different content. Nothing was created. Your values are kept: check them and create the drafts." A re-render issues a new `_op`. |
| Any refusal of a form that carried files | Form-level item "Choose the files again. The page does not keep files after a refusal." |
| Unknown code | "This could not be completed. Reference: [code]." |

Passport (TA-09-R1, partly met per Q-W03-04): one input labelled "[label]: one file with both pages", hint "Asked for
by [services]. A passport has two pages to send: the front page (with the photo and the two machine-readable lines)
and the back page. Send one PDF that holds the front page and the back page." No second input and no two-file text.

Passport number (TA-09-R2, partly met per Q-W03-05): hint "As printed on the passport. Spaces and hyphens are
ignored." (no format until the shared shapes are on main, design §4.4 item 5). Refusal: for the population's issuing
country (`POPULATION_SCOPE.nationality`, the constant Core's rule uses) the catalogue text; for another issuing
country "Check the passport number. Enter it as printed on the passport." The page holds no format of its own.

## 3. P-07 items

| Item | How it is met |
|---|---|
| (a) refused `ta.intake.start_individual` re-renders TA-09c | Both refusal paths (a file refused at edge or staging, and a Core refusal shown on the form) call `renderIndividualStart` → `individualStartPage`, with the typed values and `withFiles`. Statuses unchanged (422 validation, 409 others; staging refusals keep `formStatus`). Session, access, maintenance and dependency refusals still go to the shell's pages (`onForm`). The edge refusal now carries its field (`refusalShape(…, true)`) so the error sits at the file input. |
| (b) receipt on acceptance | `receiptLocation('/ta/intake/<attemptId>', 'drafts', ctx.operationKey)`; another resource type falls back to `/ta/groups`; an unknown outcome still goes to the operation page. |
| (c) combined start page renders the bulk form only | `renderStart` passes only the bulk `FormRef`; `startPage` links TA-09c. The bulk form markup, fields and re-render are unchanged. |
| (d) `passport_number_invalid` | "Enter the passport number as one letter and seven digits (A1234567) or two letters and six digits (AB123456)." (proposal wording, WP-03 §3). The other two texts of the proposal (`unexpected`, `document_too_large`) are not changed in `CODE_TEXT` (outside this unit's write list); TA-09c uses its own texts for both. |
| (e) no silent slicing | The individual handler sends every chosen, well-formed `service.<offeringId>` (`chosenServices`); Core's contract refuses more than 8 with `offeringIds`/`too_big`, shown as "Choose at most 8 services in one form." The list import keeps its slice to 8 (`services`, bulk lane's seam). |

## 4. INT-1 individual result (`attemptPage`, TA surface, `sourceKind = individual_form`)

Header: crumbs Groups › Group; `h1` "Applicant added: [applicant as read]"; meta Source "One applicant (form)", Started;
freshness when the route passes `readAt`. Receipt first when the route passes `receipt` (`operationReceipt`; accepted:
"Drafts created", recorded fact "Applications created: [n] applications" from the summary; unchecked: the reference and
"The receipt cannot be checked now."); document title starts with the receipt title. Status: "Document checks are
running. You can prepare the applications meanwhile." (processing), a finished note (fully processed), else the old
state callout. Section "Applications created": Service, Result ("Draft created" or the code text), Application
(reference with copy, "Prepare this application" to TA-09t when served, else "Open the application"). Section
"Documents sent with the form" ("Document [n]", state). Link "What the form recorded" to the row page (the system
helpers read it). No question, correction or stop form. "Resume" stays for a paused attempt (a served command). The
bulk variant and the staff oversight are unchanged.

## 5. Findings and items for the architect

| Id | Rank | Finding | Scenario | Proposal |
|---|---|---|---|---|
| F-U5-01 | P1 | The catalogue text names "two letters and six digits (AB123456)" while Core's rule at this base still refuses it for the population's passports. | A TA types AB123456 for an Indian passport and is refused with a message that says the shape is valid (A47 before the bulk lane's rule is on main). | Known seam dependency (Q-W03-05, DEP-1). The drift-guard test "every example the passport number text names passes core's rule" is `todo` and passes once the rule is integrated; then drop the `todo` and, if the shared shapes file arrives, build the text and the hint from it (design §4.4 items 1 and 4). |
| F-U5-02 | P1 | (b) and (c) change what `test/system/support/browser.ts` `intakeThroughEdge` reads (it reads the individual form from `/intake/new` and expects `Location` `^/ta/intake/ina_…$`). | Every system test that adds an applicant fails until U7 lands: run here, `intake-pages.test.ts` 8 of 11 fail: the two updated pins need the registered GET route; six cascade from the empty `formAttempt` or from the helper (the scanner test times out on it). `new-service.test.ts` passes. | U5s and U7 MUST be integrated in one commit: register `individualIntakeRoutes()` at edge, give inventory entry T09 the id `ta.applications.new`, and update `intakeThroughEdge` (GET TA-09c; accept `?done=drafts&op=<key>`) as design §9.3 row 1 says. |
| F-U5-03 | P1 | The INT-1 receipt needs the route to read it: `renderTaAttempt` (`src/apps/shared/ta-intake.ts`, not this unit's file) passes no `receipt` or `readAt`. | After a successful send the address carries `done=drafts&op=…` but the page shows no receipt (C-03 not visible). | In `renderTaAttempt`: `receipt: view.attempt.sourceKind === 'individual_form' && !inSupportView(ctx) ? await readReceipt(ctx, individualReceiptExpectations(view.attempt.attemptId)) : null` and `readAt: ctx.now`. |
| F-U5-04 | P2 | `checkboxField` has no `disabled` option, so TA-09c renders its service choices with a local helper that copies the choice markup. | A later change to `checkboxField` markup does not reach the service choices. | Add `disabled?: boolean` (and pass-through `aria-describedby` to the hint, as today) to `checkboxField`; then replace `serviceChoice`. CSS: a disabled `.choice__input` and its label have no style of their own (browser default); propose `cursor: not-allowed` and the muted text colour for `.choice:has(.choice__input:disabled)`. |
| F-U5-05 | P2 | Data gaps: `intake.start_page` has no price per offering (A41 "each with its price"); `intake.attempt_page` has no group label (INT-1 crumb reads "Group") and no price per application (A51). | The TA reads the price on TA-07 or Services instead. | Add to the Kind 1 bundle (P-09); no page-side read added. |
| F-U5-06 | P2 | The enhancement script refuses a file whose type the strictest rule of the document does not accept before the form is sent (as the old form did). | A49 step 3 (a PDF as the photograph) in a browser with scripts on is stopped client side; without scripts (harness) Core creates the draft and the row shows the verdict (C-10 holds at the server). | Record in the A49 run: run step 3 through the harness. No change proposed. |
| F-U5-07 | P2 | The list import still drops chosen services beyond 8 without a word. | A TA names 9 services for a folder import; one is not used. | Bulk lane's seam: the same change as item (e) when the bulk lane owns the form. |
| F-U5-08 | P2 | `CODE_TEXT.passport_number_invalid` also reads on the bulk row and attempt pages, where the row may hold another state's passport. TA-09c chooses its text by the typed issuing country; it compares the three-letter code only, so a typed two-letter "IN" reads the general text. | A bulk row of a non-Indian passport shows the Indian shapes. | Bulk lane: a per-country text once the shared shapes file has the general shape (P-W03-02). |
| F-U5-09 | P2 | Service mode words are copied from `src/apps/shared/pages/services.ts` (`MODE_LABELS` is not exported). | The two lists drift. | Export one mode-label function from `services.ts` and use it here. |

Deviations: D-U5-01 TA-09c's C5 uses a warning notice with the current group facts instead of the CMP-14 two-column
table, because the form carries no group values (design §2.15 says it shows the current ones). D-U5-02 Surname and
given names are both marked optional with the sentence "Enter the surname, the given names or both"; Core needs at
least one (the old form required the surname in HTML). D-U5-03 The INT-1 page omits "Stop this intake" (design §2.13
item 5) and keeps "Resume" for a paused attempt.

## 6. Exports for U7 and the gallery

| What | Name | Note |
|---|---|---|
| Edge GET route | `individualIntakeRoutes()` in `src/apps/edge/core/individual.ts` | Route id `ta.applications.new`, GET `/ta/groups/:groupId/applications/new`, surface `ta`, action `application.create_draft` (matches the inventory entry T09, which needs the id). Edge only; not a support-view route. |
| Re-render | `renderIndividualStart(ctx, { values, refusal })` | Used by `routes.ts`. |
| INT-1 receipt | `individualReceiptExpectations(attemptId)` | For F-U5-03. |
| `resultHrefOf` | `intake_attempt` → `/ta/intake/:attemptId` | Design §9.1 U7 one-line addition (operation page "Open the result"). |
| Gallery | `individualIntakeGalleryPages()` in `scripts/dev/gallery/individual-intake.ts` | `add-one-applicant.html`, `-refused`, `-duplicate`, `-stale`, `-no-service`, `-closed`, `applicant-added.html`. TA shell; synthetic data. |
| `DESIGN.md` | TA-09c and INT-1 | One line each in the page list, if the architect keeps one. |

## 7. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean for this unit's files. The final run shows 27 errors in `test/unit/web/prepare-pages.test.ts` (another unit's file in progress); earlier runs showed errors in `groups-pages.test.ts`, `ta-home.test.ts` and gallery modules of other units. |
| `npx eslint --max-warnings=0` on the 7 files of this unit | Clean. |
| `node --test test/unit/web/individual-intake.test.ts test/unit/bff.test.ts` | 48 tests: 47 pass, 1 `todo` (F-U5-01). |
| `node --test "test/static/**/*.test.ts"` | 74 tests: 73 pass, 1 fail: `route_without_id` at `src/apps/shared/views/ta.ts:190, 224` (another unit's file). |
| System `intake-pages.test.ts`, `new-service.test.ts` (`TMPDIR=/tmp/w3u5`) | 13 tests: 5 pass, 8 fail, all on F-U5-02 (the TA-09c GET route is not registered and the helper reads the old form). `new-service.test.ts` passes. |
| Scratch browser sweep of the 7 gallery pages (1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice, all impacts; 360 and 320 px; overflow, CSP, script errors) | 56 of 56 checks without a finding. |
