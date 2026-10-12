# WP-03 U0 notes: travel-agent components and the TA reading rule

Unit U0 of WP-03. Author: the U0 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration and the `DESIGN.md` update. U0 commits nothing; the architect integrates. Base: lane commit e9e96e3.
Binding inputs: `WP-03-design.md` §1.6, §2.7, §2.10 to §2.12, §4.2, §4.3, §4.7, §5.2 to §5.6, §7, §9.1 (U0 row),
§9.3; `WP-03.md` §3 and §4.1 (C-05, C-08, C-09, C-11); `WP-03-acceptance.md` A43, A59, A60, A66, A71, A95, A98,
A112 to A116, A143 to A147.

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/tasks.ts` (new) | CMP-04 `taskList`, `taskStateText`, `TASK_STATES`. |
| `src/web/ui/review.ts` (new) | CMP-05 `checkAnswers`, `statementFieldId`, `CHECK_STATES` and the option types. |
| `src/web/ui/evidence.ts` (new) | CMP-02 `evidenceRows`, `evidenceStatusText`, `evidenceOwner`, `EVIDENCE_STATUSES`. |
| `src/web/ui/bands.ts` (new) | CMP-11 `identityBand`; CMP-24 `contextBand` (design name "Context band"; the work order calls it "status band"). |
| `src/web/ui/index.ts` | Four `export *` lines appended. |
| `static/css/components.css` | One block of 280 lines, inserted before the back/forward-cache rule (the place of the WP-02 U0 block; that rule stays last). No existing rule changed. Tokens only; no new colour. |
| `src/apps/shared/core/ta-reading.ts` (new) | Pure move out of `ta.ts` (§3). |
| `src/apps/shared/core/ta.ts` | Moved code removed (170 lines); imports the moved names back; `WirePending` and `ownerLabel` imports dropped (no longer used there). |
| `src/apps/shared/attention.ts` | Import path `./core/ta.ts` → `./core/ta-reading.ts`. |
| `scripts/dev/gallery/{tasks,review,evidence,bands}.ts` (new) | 13 gallery pages (§5). Not registered. |
| `test/unit/web/wp03-components.test.ts` (new) | 33 tests. |

## 2. APIs

```ts
taskList(o: { items: readonly TaskItem[]; label?: string /* "Parts of this application" */; id?: string /* "task-list" */ }): SafeHtml
TaskItem = { label: string; href?: string; state: TaskState; stateDetail?: string; hint?: Renderable }
taskStateText(state: TaskState, detail?: string): string   // "Cannot start yet: 2 items above stop submission"

checkAnswers(o: { id?: string /* "check" */; errors?: FieldError[]; stale?: StaleComparisonOptions;
                  sections: readonly CheckSection[]; submission: CheckSubmission }): SafeHtml
statementFieldId(code: string, prefix = 'check'): string    // "check-confirm-<code>", for the error summary link

evidenceRows(o: { rows: readonly EvidenceRow[]; caption?: string; readOnly?: boolean; id?: string /* "evidence" */ }
           | { status: 'unavailable'; text?: Renderable; id?: string }): SafeHtml
evidenceStatusText(status: string, reason?: string): string; evidenceOwner(status: string): EvidenceOwner | null

identityBand(o: IdentityBandOptions): SafeHtml   // the page header of one application
contextBand(o: ContextBandOptions): SafeHtml
```

**Task states (closed set, design §1.6, C-11):** `no_open_item` "No open item", `needs_input` "Needs your input",
`needs_evidence` "Needs evidence", `being_checked` "Being checked", `cannot_change` "Cannot change",
`cannot_start_yet` "Cannot start yet", `not_checked_here` "Not checked here", `unavailable` "Unavailable". A value
outside the set renders "Unrecognised state". Markup: `ol.task-list[aria-label]`; per item the name (a link only
with `href`), then the state as a small badge (+ detail), then the hint. The link has `aria-describedby` = state
and hint. No count, no percentage, no verdict.

**`CheckSection`:** `{ id, title, lead?, rows?: {key, value}[], body?: SafeHtml, changes?: {href, part}[] }`. A
change link reads "Change [part]" in visible text ("Change identity details"). An empty row value reads "Not given".

**`CheckSubmission` states:**

| `state` | Fields | Renders |
|---|---|---|
| `confirm` | `form {action, csrfToken, operationKey, hidden?}`, `statements?`, `legend?` ("Confirm before you submit"), `consequence`, `submitLabel`, `secondary?` | Form: hidden fields; section "Your confirmation" with a fieldset (one `checkboxField` per statement: name `confirm.<code>`, value `yes`, hint "Statement version [v] (required/optional)" and the tag "Draft wording" when `draft`; hidden `version.<code>`); the consequence block (visible, never in a `<details>`); the primary button (`aria-describedby` = consequence) and `secondary`. No statements: no confirmation section (returned mode, hand back). |
| `unavailable` | `notice` (`boundaryNotice` options; id default `[prefix]-boundary`), `submitLabel`, `secondary?` | No form. The notice, then `unavailableButton` described by it, then `secondary`. |
| `read_only` | `statements?`, `legend?`, `reason?`, `secondary?` | No form, no button. The statements as text with their version; "Read only in a support view: only the travel agent takes this step." |
| `closed` | `statement`, `links?` | A sentence and links. |

`CheckStatement`: `{ code, text, version, required, checked?, error?, draft? }`. A checkbox is checked only when
`checked: true` is passed, and never when `stale` is given (§5.4: after C5 every statement is unchecked). The
checkbox has no HTML `required` attribute, so a missing confirmation reaches Core and comes back as C1 (A115).
Order inside `div.check-answers`: error summary (`[prefix]-errors`) or stale comparison (`[prefix]-stale`) →
sections → submission.

**`EvidenceRow`:** `{ requirementType, label, mandatory, status, reason?, rule?, note?, file?: {href, label?}, owner?,
actions? }`. Columns: Document (row header; "(optional)" suffix; anchor `[id]-[requirementType]`), Status, What the
file must be (only when a row has `rule` or `note`), File ("View the document: [label]" or "No file"), Whose step,
Action (absent with `readOnly`). Status words (§4.7):

| Status | Words | Whose step (default) |
|---|---|---|
| `missing` | Missing | You |
| `safety_pending` | Being checked for safety | TravelMudra |
| `unclassified` | Being checked: what it is is not confirmed yet | TravelMudra (pass `owner: 'you'` when DOC offers the classification form) |
| `unreadable` | The details could not be read with confidence | You |
| `conflict` | Does not match the applicant | You |
| `validity_failed` | Not valid for this application[: reason] | You |
| `validity_unknown` | Validity could not be checked | TravelMudra |
| `blocked` | Blocked by TravelMudra | TravelMudra |
| `unassociated` | Received, not yet linked to this application | TravelMudra |
| `satisfied` | Accepted | Nothing is needed |
| any other | Unrecognised state ([code]) | Not known |

A TravelMudra row without actions reads "You do not need to do anything." The table's attention mark is set for
the reader's step, except an optional document that is missing. `{ status: 'unavailable' }` renders "Documents are
unavailable now." (or the given text) and no table. No declared requirement renders the empty state "No documents
are declared".

**`IdentityBandOptions`:** `{ name, reference, referenceLabel? ("Application"), breadcrumbs?, freshness?, group?:
{label, href?} | null, service?: string | null, meta?, lead?, actions?, id? ("identity") }`. The h1 reads
"[name], Application [reference]" (name and reference on their own lines); the copy button sits beside the h1, not
in it. A missing group or service is left out; an empty name reads "Unnamed applicant".

**`ContextBandOptions`:** `{ group, country, travelDates, service? : StatusFactValue; serviceLabel? ("Service");
title? ("About this application", visually hidden unless titleVisible); headingLevel?; notice?: SafeHtml;
requirements?: {status:'known', services: {service, documents: {label, required, rule, note?}[]}[]} |
{status:'unavailable', text?}; requirementsOpen?; id? ("context") }`. The facts render through `statusFacts`
(labels Group, Country, Travel dates (IST), Service), so a failed read is `unavailableFact()` → "Unavailable". The
notice sits inside the band. "View requirements" is a native `<details class="disclosure disclosure--section
context-band__requirements">`, closed unless `requirementsOpen`.

## 3. The TA reading rule (pure move)

Moved verbatim from `src/apps/shared/core/ta.ts` to `src/apps/shared/core/ta-reading.ts`; only `export` added:
`paymentAwaited`, `TaPending`, `TaDeliveryStep`, `draftRecheckWaits`, `DRAFT_RECHECK`, `mayDownload`, `taPendingOf`,
`ListFacts`, `rowViews`, `pendingCell`, `needingAction`, `applicationsNeedingAction`, `listFacts`, and the private
`DOWNLOAD_STEPS`, `DELIVERY_PAGE`, `NOTICE_PAGE` (used only by the moved code). `ta.ts` imports the eight functions and
two types it still uses. Import sites changed: `src/apps/shared/attention.ts` only (grep over `src/`, `test/`,
`scripts/`). `ta.ts` no longer exports `ListFacts`, `listFacts` or `applicationsNeedingAction`.

## 4. Items for the architect and the page units (U1 to U5)

| Id | Rank | Item | Scenario | Proposal |
|---|---|---|---|---|
| U0-01 | P1 | The closed task-state set has no state for "Check and submit" while Core allows submission (§4.2 row 6 "Not started" was dropped by C-11). | U4 needs a state for TA-09t row 6 of a submittable draft. | The gallery uses "No open item". The architect confirms or picks another member of the set. |
| U0-02 | P2 | §4.2 still names "Cannot continue" (row 3, `population_out_of_scope`) and "Needs your review" (row 5). | U4 copies a word outside the set. | Map row 3 to `cannot_change` with the CMP-10 notice above the list; row 5 to `needs_evidence` (the reader's review of a document). |
| U0-03 | P1 | A145: Escape closes "View requirements" and returns focus. `static/js/enhance.js` closes only the help panel, the account menu and the phone menu. | A keyboard user cannot close the panel with Escape. | One-line change: add `details.context-band__requirements[open]` to `ESCAPABLE` (not to `PANELS`, so focus outside does not close it). Not changed in U0. |
| U0-04 | P2 | Seam statuses `incomplete` and `over_supplied` (§4.3 item 4). | Bulk lane adds them to `REQUIREMENT_EVIDENCE_STATUSES`. | The status map is `Record<RequirementEvidenceStatus, …>`, so typecheck fails in `evidence.ts` until the two texts of §4.3 item 4 are added. Until then they render "Unrecognised state (code)". |
| U0-05 | P2 | The test file name carries the package id (`wp03-components`). | The name reaches the public repository. | Rename before commit, for example `test/unit/web/application-components.test.ts`. The file content holds no internal id. |
| U0-06 | — | Gallery registration. | — | Add `tasksGalleryPages()`, `reviewGalleryPages()`, `evidenceGalleryPages()`, `bandsGalleryPages()` to `galleryPages()`. The last three import `taGalleryPage` and the synthetic constants from `gallery/tasks.ts`. |
| U0-07 | — | Status words differ from today's `STATUS_TEXT` in `core/documents.ts` for five statuses (`safety_pending`, `unclassified`, `unreadable`, `blocked`, `unassociated`). | U3/U4 switch TA-07 and TA-09f to `evidenceRows`. | The system tests read only "Accepted", "Does not match the applicant" and "Not valid for this application: …" (unchanged); `documentStatuses` reads cell 0 (document, "(optional)", attention mark) and cell 1 (status): compatible. |
| U0-08 | — | Notes for U3 and U4. | — | TA-07 and TA-09t use `identityBand` instead of `pageHeader`; pass `personName(...)` as `name`. TA-08 passes `_rev.application`, `quotedPricePaise`, `estimateStart`, `estimateEnd` in `form.hidden` from the same variables as the shown values; after C1/C2 pass each statement's `checked` from the posted form; after C5 pass `stale` (the component then unchecks). Blocked or evidence unavailable (C-05): `state: 'unavailable'`. Support view: `read_only` and no `changes` links. Returned submitted case: `confirm` without statements, action `…/hand-back`. TA-09c context band: no `service` fact, `title: 'About this group'`. A support view passes no `href` to task items. |

## 5. Gallery

`tasksGalleryPages()`: `task-list.html` (a draft with open items, a draft that nothing stops, a submitted case, a
travel-date rule, read only, unavailable parts, every state). `reviewGalleryPages()`: `check-answers.html`,
`-refused`, `-stale`, `-blocked`, `-read-only`, `-returned`, `-closed`. `evidenceGalleryPages()`:
`evidence-rows.html` (every status and an unrecognised one, with actions), `evidence-rows-read-only.html` (read
only, unavailable, none declared). `bandsGalleryPages()`: `identity-band.html` (full, with a context band),
`identity-band-partial.html` (long name, no group or service), `context-band.html` (adding an applicant with the
requirements open, failed facts, a paused service). All TA shell; synthetic data only.

## 6. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean on the final run. An earlier run showed six errors in `test/unit/web/accounts-pages.test.ts` (another engineer's in-progress file); they were gone at the final run. |
| `npx eslint --max-warnings=0` on the 13 changed or new files | Clean. |
| `node --test test/unit/web/wp03-components.test.ts test/unit/web/travel-recheck.test.ts test/unit/nav-counts.test.ts` | 54 of 54 pass (33 new). |
| `node --test "test/static/**/*.test.ts"` | 74 of 74 pass. |
| `npm run test:ui` | 949 of 949 pass (the new gallery modules are not registered yet, so the gallery sweep does not open their pages). |
| System tests with their own `TMPDIR`: `core-pages`, `case-views`, `case-work` (TA lists, attention, the case page) | 35 of 35 pass. |
| Scratch browser sweep of the 13 new gallery pages (the checks of `test/ui/gallery.test.ts`: 1440 and 390 px light and dark with axe WCAG 2.2 A/AA and best practice, overflow, CSP, script errors; 360 and 320 px overflow) | 112 of 112 pass. One moderate `landmark-unique` on `context-band.html` (two bands with one title) was fixed in the gallery content. |
| Move check | `git diff` of `ta.ts`: only removals and three import lines; the moved text equals the removed text except the added `export` keywords. |
