# WP-03 fixes notes: code review R-01 to R-06

Fixes of the six findings of the independent WP-03 code review (lane `research/reviews/WP-03-code-review.md`). Author:
the fix engineer, 13 October 2026. Input for the architect's integration. Nothing is committed. Base: lane commit
b2a6341. The tree also holds another engineer's uncommitted SuperAdmin work (`src/web/ui/index.ts`,
`src/web/ui/queues.ts`, `static/css/components.css`, `src/apps/staff/core/admin-context.ts`, a gallery and a test);
those files are not touched.

## 1. Files

| File | Change |
|---|---|
| `src/apps/edge/core/prepare-forms.ts` | `inputRefusal` and `sendWhole` (refuse input the command's contract does not take, before any command, at its field); identity, evidence and details input sent whole |
| `src/apps/edge/core/routes.ts` | Submission, decisions and link forms sent whole through `sendWhole` |
| `src/apps/edge/documents.ts` | Resolution and classification sent whole through `sendWhole` |
| `src/apps/edge/intake/application-documents.ts` | Upload, replacement and association sent whole through `sendWhole` |
| `src/apps/shared/ta-documents.ts` | Decision forms only while every application the version is in force for allows changes |
| `src/apps/shared/pages/documents.ts` | Closed-form notice; correction action only while the shown application allows changes; kept refusal block; neutral receipts |
| `src/apps/shared/pages/prepare.ts` | Neutral task-list and documents receipts; messages for a value over a limit |
| `src/apps/shared/pages/groups.ts` | Neutral creation receipt; no support-view control; travel dates before today: advisory minimum, review block (section 6a) |
| `src/apps/edge/core/group-routes.ts` | Travel dates before today sent only with the acknowledgement of exactly those dates (section 6a) |
| `src/apps/shared/pages/review-submit.ts` | Statements unchecked after every refusal |
| `src/apps/shared/pages/individual-intake.ts` | Surname, given names and date of birth required; empty ones named at their fields (section 6b) |
| `src/apps/shared/core/ta.ts` | No support-view control in the action panel; two dead plain flashes removed |
| `src/apps/shared/core/ta-reading.ts`, `ta-applications-list.ts` | The navigation counter's delivery read propagates its refusal; one parameter builder for both reads |
| `scripts/dev/gallery/{prepare,document-detail,groups}.ts` | Receipt titles of the gallery fixtures follow the neutral receipts; new page `group-dates-past.html` (section 6a) |
| Tests | `test/unit/web/{prepare-pages,document-detail,groups-pages,application-workspace,review-submit,individual-intake}.test.ts`, `test/unit/bff-documents.test.ts`, `test/unit/nav-counts.test.ts`, `test/system/{core-pages,case-work}.test.ts` |

No file under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`,
`src/web/` or migrations changed. No route path, form action or field name changed.

## 2. R-01: no handler cuts or drops submitted input

Rule applied: every handler sends what the form chose whole. `sendWhole(ctx, name, input)` checks the input against
the command's own wire contract (`COMMANDS[name].input`, the schema Core checks first). Input the contract does not
take is refused before any command, as `validation_failed`/`input_invalid` with one field error per problem (an
indexed row is named by its list: `evidenceVersionIds`, `confirmations`). The page shows the refusal at the field
with every value kept. Nothing is sent and nothing is recorded. The limits stay in one place (the frozen contract).

| Site (before) | After |
|---|---|
| `prepare-forms.ts` identity: `value.slice(0, max)`; an empty value dropped | Every identity field the form sent, whole (surrounding spaces removed, country codes in capitals); an emptied field is sent as `''` (Core removes it); a 101-character surname is refused at `identityChanges.surname` |
| `prepare-forms.ts` evidence: invalid ids filtered, `.slice(0, 4)` | Every chosen `evidence.*` sent; five (or a non-reference) refused at `evidenceVersionIds` |
| `prepare-forms.ts` details: `optional()` dropped an emptied nationality or passport type | Every field the form sent, also an emptied one |
| `routes.ts` submit: `slice(0, 50)` rows, `slice(0, 80)` code, `slice(0, 40)` version | Every confirmed statement, whole |
| `routes.ts` price, transition, link decisions: `slice(0, 40/20/80)` | Whole |
| `documents.ts` resolution: MRZ key allowlist, value `slice(0, 200)`, attestation `slice(0, 16)` | Every `fields.*` value, the attestation and the reason, whole |
| `documents.ts` classification: type `slice(0, 64)` | Whole |
| `application-documents.ts`: requirement type `slice(0, 40)` (upload, replace, associate) | Whole |

Messages: the identity page names the limit for names and "What was wrong" ("Surname: at most 100 characters.
Nothing was shortened: shorten it yourself and save again.") and "Choose at most four documents: the ones that show
the new details." for the evidence; the details page says "the value is too long".

Sweep, clean: `group-routes.ts` (create, travel dates, close), hand back, help request, problem report, withdrawal,
individual intake page renderer. Remaining `.slice` calls in the WP-03 files cut display lists only (home items,
notices, paging, field-name parsing).

**Bulk-service slice (not changed; shared file):** `src/apps/edge/intake/routes.ts` (shared with the bulk lane) still
cuts input: `services()` `.slice(0, 8)` of the chosen bulk services (nine reach Core as eight); `chosenServices()`
drops a non-reference service id; the individual-intake applicant fields `.slice(0, 200/20/60/8)`; the file field
name `.slice(…, 40)`; the bulk `sourceKind`, `sourceUrl`, `companionSheetUrl` and `altcha` slices. The same
`sendWhole` pattern applies (export it from a shared module first). Being cleared with the orchestrator.

## 3. R-02: edit ownership on the document page

- `ta-documents.ts` `versionForms`: no form in a support view; otherwise the forms show only while every application
  the version is in force for (`proposed`, `positive`, `conflict`, `ambiguous`; Core re-decides exactly these after a
  decision; `rejected` and `revoked` are final) allows changes (`case.correct.allowed`, read now through
  `optionalView`). Any `false` gives `closed: 'not_allowed'`; any unavailable read gives `closed: 'unavailable'`. A
  version in force for no application is the group's file: Core's ownership check decides. Each case is read once
  per page (`caseReader`).
- `documents.ts` `nextStep`: the identity correction ("Compare and correct") shows only while the application the page
  is shown for allows changes; the step stays with a notice ("The application is not open for your changes now … Open
  the application to see who acts now" or "… cannot be read at the moment"). The classification step is stated from
  the document's state, not from the form's presence (before, a closed form read "Nothing is needed now").
- `documents.ts` `unsentDecision`: a refused decision whose form is not offered now keeps the refusal and every value
  sent, read only, with the submit unavailable and "Review current information" (DESIGN "A refusal keeps what was
  sent"). Before, such a refusal vanished.

## 4. R-03: receipts

Summaries Core records (checked in `src/modules/**`): `core.edit_draft` and `core.correct_identity` both
`{applicationId, correctionId, stage}`; `doc.upload_for_application`, `doc.replace_version`, `doc.associate` all
`{associationId, versionId, status}`; `doc.resolve_extraction`, `doc.confirm_classification` both `{versionId,
revision}`; `core.create_group` and `core.close_group` both `{groupId}`.

| Page | Codes | After |
|---|---|---|
| Task list | `saved`, `corrected` | "Request recorded"; the summary must also carry `stage` `applied`/`held` (excludes a held correction applied again); recorded fact "Change" from the stage; the evidence claim removed; current facts labelled "Current" |
| Documents | `document`, `replaced`, `associated` | "Request recorded"; recorded "Document"; current "state of this file", "file in use for this application" (This file / Another file / None), "status of this document", the same for every code |
| Version | `resolved`, `classified` | "Request recorded"; current facts labelled "Current" |
| Group | `group_created` | "Request recorded"; summary must be the group alone (a dates change no longer matches); current name, country, dates and state; the "Next" claim removed |

Checked distinct and unchanged: workspace `submitted` (`submissionId`), `assistance` (`assistanceId`), `handed_back`
(the application alone: only `core.hand_back` among the travel agent's commands); group `dates` (`datesRevision`);
individual intake `drafts` (`applications`). Removed: the workspace's plain flashes `edited` and `corrected` (no form
leads there any more; "corrected with your evidence" was a claim any address could raise).

Amendment C-09 named the receipt "Replacement file received". The summary cannot tell a replacement from an upload,
so R-03 governs; the page still says the earlier file stays in use (current "file in use" fact and the documents
rows). Command identity (seam item S-08) would let these titles return.

## 5. R-04: navigation count

`applicationsNeedingAction` reads the delivery facts with `ctx.view` (no `optionalView`): an availability failure
rejects the counter, and `nav-counts` shows "Unavailable" and keeps nothing; any other refusal reaches the shell.
The applications list, home and group pages keep their own optional block and explicit degraded state. Both reads
use `deliveryFactsParams`, so on one GET request the page and the count share one Core read.

## 6. R-05 and R-06

- R-05: `ta.ts` `panelHtml` and `groups.ts` `primaryAction` (panel and empty state) render no action control in a
  support view; owner and step stay. Sweep, clean: home, applications list, task list, check and submit (read-only
  text), individual intake, document page. The delivery page (not rebuilt) keeps its disabled download, as DESIGN
  allows; the system pin still asserts that.
- R-06: `review-submit.ts` `checkStatements` never restores `checked`; every refused submission shows every statement
  unchecked.

## 6a. WP-17 review R-01 (P0, assigned by the coordinator): travel dates before today

Core accepts past travel dates on `core.edit_travel_dates`; at the next date check the group's qualifying applications
end with the group, irreversibly. UI interim (Core unchanged):

- `groups.ts` `travelDatesPage`: both date inputs carry `min` = today's India date (`indiaToday(ctx.now)`, the BFF's
  clock in Asia/Kolkata; `core.ta_group` serves no `today`). Advisory only: the Save button has `formnovalidate`, so
  the browser never blocks an unchanged past start date of a trip under way; the BFF review below is the gate.
- `group-routes.ts` travel-dates handler: `pastTravelDates(start, end, today)` (a calendar date before today in
  either field). Then the command is sent only when `ackPastDates` equals exactly `start|end`; otherwise nothing is
  sent and TA-13b shows the review (`#dates-past`: the exact dates, "At the next date check, applications of this
  group that qualify will end with the group. This cannot be undone.", the unchecked BFF-only checkbox `ackPastDates`
  with value `start|end`), the typed dates and the `_rev.group` the reader sent. Changed dates need a new
  acknowledgement. `ackPastDates` never reaches Core. A non-stale refusal after an acknowledgement shows the review
  again (unchecked); a stale refusal shows Core's comparison.
- Tests (`groups-pages.test.ts`, "travel dates before today"): the advisory minimum; past dates with no
  acknowledgement (no command, review, values and revision kept, one past date suffices); a matching acknowledgement
  (sent without it); dates changed after acknowledging (no command, review for the new dates); a stale revision with an
  acknowledgement (Core's refusal, the comparison); an identical acknowledged replay (same input, same key, same
  receipt); today and later (no review, sent).
- Open (P2): the BFF's clock decides "today"; around midnight IST a clock skew of seconds between edge and Core
  shifts the boundary by that much. The real guard belongs in Core (WP-17's Core fix).

## 6b. WP-02 acceptance finding (assigned by the coordinator): TA-09c required details

Read (no change) `src/modules/intake/commands/start-individual.ts`, `src/domain/module-ports.ts` (`coreApplicantOf`,
`applicantRefusal`) and `src/modules/core/model.ts` (`zApplicantIdentity`): the intake form itself takes an empty
surname or given names (one of them) and an empty date of birth, but Core keeps no draft without a surname, given
names and a date of birth; the port refuses the whole form as `control_blocked`/`name_invalid` or `date_invalid`,
naming no field, by the first missing detail. The page showed "(optional)" on all three, "Enter the surname, the given
names or both", and the generic sentences "A name holds other characters…" / "A date is not a real calendar date…".

- `individual-intake.ts`: surname, given names and date of birth are required (no "(optional)", `required`); the
  section says "Enter the surname, the given names and the date of birth as printed on the passport: each draft needs
  all three." On a name or date refusal, every empty required detail is named at its field ("Enter the given names as
  printed on the passport." and the same for the surname and the date of birth), because Core names only the first.
  Filled-in but refused names say what is wrong at the field Core names, or in words when it names none. No message
  names an internal field. Nationality, sex and residence stay optional (Core keeps a draft without them).
- This reverses the accepted U5 deviation "surname and given names both optional with a one or both sentence" (Core
  requires both). The handler (`src/apps/edge/intake/routes.ts`, shared file) is unchanged.
- Tests (`individual-intake.test.ts`): required labels; an empty given names, date of birth and surname (one each);
  several empty details at once; filled-in details refused for their characters.

## 7. Tests

Added (14, plus 7 for section 6a and 6 for section 6b):

- prepare-pages: "no input is cut or dropped: a 101-character surname is refused at its field, never shortened; an
  emptied given name is sent empty"; "five chosen documents: all five reach the check, which refuses them at the
  evidence field before any command (Core takes four)"; "a refused 101-character surname is shown again whole at its
  field, with the limit in words".
- bff-documents (real BFF, scripted Core): "refuses a 101-character surname at its field before any command, never
  shortened, with every value kept; an emptied given name is sent empty"; "refuses five chosen documents at the
  evidence field before any command (core takes four), with all five kept"; "a receipt whose code was edited to the
  identity correction claims no evidence for a details save".
- document-detail: "an assigned case that is not returned: no decision form, no action, and the reason; the facts
  stay"; "a document that does not match an assigned case offers no identity correction"; "a permission read that
  core cannot answer now: no form, and the page says it cannot tell now"; "a version shared by two applications: a
  form only while both allow the change"; "a refused decision whose form is no longer offered keeps the refusal and
  every value sent, read only".
- groups-pages: "an edited receipt code with a valid key claims no command the operation did not record".
- review-submit: "every refused submission shows every statement unchecked, whatever the refusal".
- nav-counts: "a travel agent's applications: delivery facts that core cannot read now make the count unknown
  ("Unavailable"), never a known number".

Changed (11): prepare-pages task-list receipt (now read through `readReceipt` with an edited code), identity mapping
(an emptied field is sent; no id filtering), document receipt (all three codes read the same); document-detail
receipts (edited codes); groups-pages creation receipt and support view (asserts absence); application-workspace
support view (asserts absence); review-submit control refusal (unchecked); bff-documents upload receipt (and the
same key under `replaced`); system `core-pages` creation and saved receipts; system `case-work` support-view docket
(asserts absence).

## 8. Checks

The lane moved to 101eff1 during the work (the architect committed the other engineer's queue components); this work
stays uncommitted on top. Other engineers' untracked files appeared in the tree meanwhile; the failures they cause are
listed, none is in a file of this change.

| Check | Result |
|---|---|
| `npm run typecheck` | Clean for every file of this change. Errors only in other engineers' untracked files (`scripts/dev/gallery/{assignment,decisions,service-payment}.ts`, `test/unit/web/{decision-kinds,service-payment-page}.test.ts`) |
| `npx eslint` on every source, gallery and test file of this change | Clean |
| `npm run test:unit` (final, after 6a and 6b) | 1407 pass, 0 fail, 1 todo (passport rule) |
| `node --test "test/static/**/*.test.ts"` | 74/74 before the other engineer's untracked staff routes appeared; final run 73/74, the one failure `route_without_id src/apps/staff/assignment/routes.ts:175` (their file) |
| System: core-pages, case-views, ta-documents-originals, intake-pages, document-decisions, case-work | First run 55/56 (a new pin of mine expected a space between a receipt label and its value; fixed); after section 6a: core-pages + case-views 26/26; after section 6b: intake-pages 11/11 |
| `test/ui/gallery.test.ts` | Full run 1191/1191 before 6a and 6b; final full run 1227/1227 (includes the new `group-dates-past.html` and the changed add-one-applicant pages). A run filtered with `--test-name-pattern` hangs ("Promise resolution is still pending"); run the gallery unfiltered |
| Focused suites, final (`prepare-pages`, `document-detail`, `groups-pages`, `application-workspace`, `review-submit`, `individual-intake`, `bff-documents`, `nav-counts`) | 236 pass, 1 todo |
| `test/unit/web/**` with `bff-documents` and `nav-counts`, final | 1247 pass, 1 todo |

## 9. Open items (ranked)

| Item | Rank | Likelihood | Proposal |
|---|---|---|---|
| Core's `doc.resolve_extraction` and `doc.confirm_classification` authorize by group ownership only; they do not check the editor state of the applications the version is in force for. A page opened before an assignment (or a hand-made POST) still records a decision on a document of an assigned case. The page now hides the forms; Core is the real guard. | P1 | Low for the page (a race between opening the page and the assignment); certain for a hand-made POST | Documents module: refuse these two commands while an application the version is in force for does not allow travel-agent changes (`awaiting_formal_return`, `hold_assistance_in_progress`), as `core.correct_identity` does. |
| `src/apps/edge/intake/routes.ts` input cuts (section 2) | P1 | Nine selected bulk services is a normal case | Shared file: orchestrator decision pending. |
| `sendWhole` lives in `src/apps/edge/core/prepare-forms.ts`; the document routes import it from there | P2 | Certain; no user effect | Move it to `src/apps/shared/core/shared.ts` beside `answer` when that file is in a write set, then use it in `intake/routes.ts` too. |
| The neutral receipts lose the command's name on the main path ("Request recorded" after creating a group) | P2 | Certain; wording only | Command identity in the operation read (S-08), then restore the titles. |

## Acceptance fixes, 13 October 2026

Fixes of the four acceptance findings F-01 to F-04 (`WP-03-acceptance.md` §8; F-04 raised to P1 by the architect under the
lane rule that no input is cut). Author: the acceptance fix engineer. Input for the architect's integration. Nothing is
committed. Base: lane HEAD 4479b6d. The tree also holds other packages' uncommitted work (operator and SuperAdmin wiring,
delivery pages, `static/css/components.css` block at the end of the file, `static/js/enhance.js`); none of it is changed.

### Files and changed lines (lane tree)

| File | Lines | Change |
|---|---|---|
| `src/apps/edge/core/group-routes.ts` | 20–22, 32–34, 60–61 | F-01: the review of dates before today answers 422 (`REVIEW_STATUS`); comment |
| `static/css/components.css` | 434–443 (one new block after `.page-header__lead`, before the container query) | F-02: `.page-header__title`, `.breadcrumbs__item`, `.page-header__meta dd`, `.page-header__lead`: `min-width: 0; overflow-wrap: anywhere`. Separate from the other package's block at the end of the file (3533 onward) |
| `src/apps/shared/pages/groups.ts` | 167–177, 459, 488–489, 576–580, 615 (one line removed), 621–622 | F-03: no `min` on the four travel-date inputs; the rules in the hints (`START_DATE_HINT`, `CHANGED_START_HINT`, `RETURN_DATE_HINT`); comments |
| `src/apps/shared/pages/individual-intake.ts` | 148–156, 181–183, 186 (three lines removed), 381, 385 | F-04: no `maxlength` on issuing country and nationality; any refusal at either field states the three-letter rule |
| `src/apps/shared/pages/prepare.ts` | 596–613, 622, 631, 657–658, 741–742, 816–817 | F-04: no `maxlength` on details nationality and residence and on identity issuing country and nationality; `COUNTRY_RULE`/`countryRule` names the field and the rule |
| `src/apps/shared/pages/documents.ts` | 335–345, 350, 432–433 | F-04: no `maxlength` on the passport details' issuing state and nationality; their refusal states the rule. **Outside the named file list** (the same class on a travel-agent form; the file had no other uncommitted change). The architect may drop this hunk; then the open item below applies to it |
| `scripts/dev/gallery/groups.ts` | 9–10, 35–41, 164, 179 | `LONG_GROUP_NAME` (120 characters, no space); pages `group-long-name.html`, `group-dates-long-name.html` |
| `scripts/dev/gallery/application.ts` | 9–12, 27, 169 | Page `application-long-group-name.html` |
| `scripts/dev/gallery/individual-intake.ts` | 6–10, 22, 140–150 | Pages `add-one-applicant-country-name.html` ("India" refused, kept) and `add-one-applicant-long-group-name.html` |
| `test/unit/bff-form-answers.test.ts` | new | Class test (F-01) |
| `test/ui/travel-agent-fields.test.ts` | new | Browser checks (F-02, F-03, F-04) |
| `test/unit/web/{groups-pages,individual-intake,prepare-pages,document-detail}.test.ts` | see Tests | Page tests |

`static/js/enhance.js` is not changed. No file under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`,
`src/core-api/`, `src/platform/` or migrations changed.

### F-01: the review of dates before today

- Cause confirmed: `group-routes.ts` answered the review with `ctx.page(...)` and no status (200); `server.ts`
  `sendResult` throws `internal`/`unexpected` for a POST page answer below 400. The handler tests passed because their
  scripted `ctx.page` returns whatever status it gets.
- Fix: the review answers 422 (a refusal to save until acknowledged, as for a refused value). The handler tests now
  assert 422 for the review (both review tests in `groups-pages.test.ts`).
- Class fix: `test/unit/bff-form-answers.test.ts` starts the real app server with **the full edge route set**
  (`edgeRoutes()`) in front of a scripted Core and posts every POST route, with a CSRF token and an operation key of
  its own. The first test fails when a POST route of edge has no row (a new form needs its row). Each scripted read
  goes through Core's wire contract of its query and back, so a fixture outside the contract fails. Each case asserts
  the status (never 500, always 400 or more), an HTML answer, an element of the page shown again, and that nothing
  reached Core where nothing may. Proof: with the 422 removed, the travel-date review case fails ("the server refused
  the handler's answer").
- Routes covered (all 38 POST routes edge serves):
  - Page shown again, 33 routes: `ta.groups.create`; `ta.groups.travel_dates` (review 422, stale comparison 409,
    field refusal 422); `ta.groups.close`; `ta.applications.submit`, `hand_back`, `request_assistance`,
    `report_problem`, `withdraw`, `price_decision`, `transition_decision`, `link_dependency`, `unlink_dependency`,
    `reapply_correction`, `edit` ("India" refused before any command 422; stale 409), `correct_identity` ("India"
    refused before any command 422; Core refusal 422); `ta.documents.resolve_extraction`, `classification`, `upload`,
    `replace`, `associate`; `ta.intake.start_individual`, `start_bulk`, `correction`; `ta.delivery.retrieve`,
    `packet_retrieve`; `ta.selections.create`; `ta.notices.acknowledge`; `ta.account.email.start`, `confirm` (refused,
    and accepted with an unusable address 422), `cancel`; `ta.search.seal` (bad request 400); `sign_in.ta.request`,
    `sign_in.ta.verify`.
  - Error page only (no page of their own; a refusal is the shell's page with the category's status), 4 routes:
    `ta.intake.answer`, `abandon`, `resume`, `incident_dispose`.
  - Redirect only: `sign_in.sign_out` and `ta.search.seal` (accepted) answer 303.
- Limit: one or two representative page paths per route, not every path (for example the address page's ended
  states and the sign-in pages' unknown-result 503 pages are not posted). Staff POST routes are not covered.

### F-02: long words in titles and breadcrumbs

- Cause: the reset gives `h1`, `li`, `dd` and `p` `overflow-wrap: break-word`, which wraps a long run only after the
  layout sized the flex and grid columns by it: the TA-05 `h1`, the breadcrumb item and (on the application pages)
  the "Group" fact in the header widen the page header grid to the run's width. An inherited `anywhere` on
  `.page-header` does not reach these elements (the reset rule applies to them directly).
- Fix: one rule at the component level for every page header: the title, every breadcrumb item, the header facts and
  the lead get `overflow-wrap: anywhere` (which also narrows a flex or grid column) and `min-width: 0`. It is the WP-02
  F-09 property, applied to the shared header instead of a `.user-text` class per name, so every page with a typed
  name in its header is covered. The identity band title already had it.
- Fixtures: a group name of 120 characters without a space on the group page, the travel-date page, an application
  workspace and "Add one applicant". The gallery sweep (`test/ui/gallery.test.ts`, 360 and 320 px, and axe at 1440 and
  390 px) checks them like every page; `travel-agent-fields.test.ts` also checks them at 320 and 390 px and asserts the
  name is in the title or the breadcrumb. Before the fix the application page's breadcrumb was 946 px wide at 320 px.

### F-03: travel dates with the page script

- Every travel-agent date input with a range: the four travel-date inputs in `groups.ts` (create: `min` = today;
  travel-date page: `min` = today, advisory). No other travel-agent date input has `min` or `max` (date of birth on
  the one-applicant, identity and document pages, declared date fields: none).
- Fix as WP-02 F-02 (server-judged, page words): the inputs carry no `min` or `max`, so the browser never runs a
  range check and never shows its own text or date format. The rules stand in the hints: create "Today or later, as a
  date in India time (IST)."; travel-date page "Dates are in India time (IST). A date before today is saved only after
  you confirm it."; return date "On the travel start date or later." The inline check keeps the page's own words for
  an empty field. A start date before today is sent: on create, Core refuses it and the page names it at the field
  ("The travel start date must be today or later, as an India date.", summary link to the field); on the travel-date
  page, edge shows the review. No change to `enhance.js` was needed.
- Tests: `groups-pages.test.ts` (no `min`/`max`, the hints, `aria-describedby`); `travel-agent-fields.test.ts`
  (with the script: a past date on both forms shows no message on leaving the field and is sent as typed; the
  refused create page shows the page's rule at the field). Proof: with `min` restored, the create-form browser test
  fails.

### F-04: country codes are never cut

- Removed `maxlength="3"` from every travel-agent code field that took it: "Add one applicant" issuing country and
  nationality; application details nationality and country of residence; identity correction issuing country and
  nationality; the document page's passport details issuing state and nationality. The hints still name the
  three-letter code.
- The value goes whole to the server. The one-applicant form: Core's input check refuses "India" at
  `applicant.issuingCountry` (`too_big`); the page now says "Enter the issuing country as its three-letter code on the
  passport, for example IND for India." (any refusal at the field, before: "This is longer than accepted. Shorten
  it."). The details and identity forms: `sendWhole` refuses "India" before any command at its field (Core's contract
  takes three characters); the messages name the field ("Nationality: enter the three-letter code shown on the
  passport, for example IND for India.", before: "the value is too long"). The document page: Core's MRZ rule refuses
  it at `fields.issuingState`; the message states the rule (before: "Enter a valid value."). Every value stays as
  typed.
- Tests: "India" is refused at its field and comes back as "India" on all four forms (page tests; the one-applicant
  BFF test computes Core's refusal from the command's own input schema `zStartIndividual` and asserts the command
  received "India" whole); the browser test types "India" key by key into both one-applicant fields, reads "India"
  back and finds "India" in the posted body. Proof: with `maxlength` restored, the browser test fails.

### Tests

| File | Added | Changed |
|---|---|---|
| `test/unit/bff-form-answers.test.ts` | 46 (wire shape of the scripted reads; every POST route has a row; 42 cases; 2 redirects) | — |
| `test/ui/travel-agent-fields.test.ts` | 8 | — |
| `test/unit/web/groups-pages.test.ts` | — | 2 rewritten (create form; travel-date inputs: no range, hints) and the 422 status asserted in 2 review tests |
| `test/unit/web/individual-intake.test.ts` | 3 (no `maxlength`; "India" refused at both fields, kept; BFF: sent whole, Core's own refusal, kept) | — |
| `test/unit/web/prepare-pages.test.ts` | 2 (identity and details: "India" refused before any command, kept, rule named) | — |
| `test/unit/web/document-detail.test.ts` | 1 (issuing state: no `maxlength`; refused, kept, rule) | — |

Each new test was checked to fail without its fix (F-01 class case; F-02, F-03 and F-04 browser tests).

### Checks

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json` (lane tree) | Clean |
| `npx eslint --max-warnings=0` on every changed and new file | Clean |
| `node --test` groups-pages, individual-intake, prepare-pages, document-detail, bff-form-answers, bff-documents, carried-forms-ta, ta-components, components (lane tree) | 321 pass, 1 todo, 1 fail: `carried-forms-ta.test.ts` "a submitted case links the delivery page…" (the workspace's delivery link; another package's uncommitted delivery work, not a file of this change) |
| `node --test "test/static/**/*.test.ts"` | 74/74 |
| `test/ui/travel-agent-fields.test.ts` | 8/8 |
| Clean copy of 4479b6d with only this change applied (CSS: this hunk only) | tsc clean; the five page and BFF suites 197 pass, 1 todo; static 74 and browser 8 pass |
| `test/unit/seo-record.test.ts` | 1 fail, expected: the style sheet change changes the renderer digest; the crawl record is the architect's to regenerate (not run here) |
| `test/ui/gallery.test.ts` (lane tree) | Every gallery page at 1440 and 390 px, light and dark, with axe, and at 360 and 320 px for overflow: 1551 pass, 0 fail (includes the five new pages). The run reached the phone layouts and was stopped by its 50-minute time limit during "navigation: what needs attention…" (it loops over every page at three widths); the other twelve later tests were run by name: 13 pass. Not run: that navigation test (rail and menu only; this change touches the page header) |

### Open items (ranked)

| Item | Rank | Scenario and likelihood | Proposal |
|---|---|---|---|
| Other `maxlength` cuts on the document page's passport details: passport number (9), document code (2), personal number (14) | P1 | A travel agent types a ten-character passport number by mistake; the browser keeps nine, Core's MRZ rule accepts nine, and a wrong number is recorded without a word. Low (Indian numbers have eight characters) | Same pattern as F-04 (no `maxlength`; Core refuses at the field; the rule in words). Same file as the F-04 hunk |
| Other `maxlength` cuts of free text on travel-agent forms: group name 120 (`groups.ts`), identity surname and given names 100, passport number 30, passport type 40, "What was wrong" 1,000, declared field limits (`prepare.ts`), the document page's reason 500, notes 2,000, search 200 | P2 | A travel agent pastes a 130-character name or reference as the group name; the group is created with 120 characters, no message. Low | Remove `maxlength` where a server limit and a message at the field exist (identity names already have "Nothing was shortened" messages); one sweep |
| A partly typed date (Chromium `badInput`) still shows the browser's text: `enhance.js` `messageFor` returns `validationMessage` for `badInput` | P2 | A travel agent types only the day and month and leaves the field: "Please enter a valid value. The field is incomplete or has an invalid date." Medium; the text is clear but not the page's | One line in `enhance.js` (`badInput`: "Enter the whole date: day, month and year."); the file holds another package's uncommitted change, so the orchestrator schedules it |
| The class test covers edge only; staff POST routes are not posted through the server | P2 | A staff form handler answers `ctx.page(page)` without a status; every send of that form answers 500. Low (this review found every edge page answer with a status but this one) | Add a staff table to the same test (staff routes, operator and SuperAdmin sessions), or make `AppPostContext.page` require a status of 400 or more in `src/apps/shared/routes.ts` (shared wiring; orchestrator) |
