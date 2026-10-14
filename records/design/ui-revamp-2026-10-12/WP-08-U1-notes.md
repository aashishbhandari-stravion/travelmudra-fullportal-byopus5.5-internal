# WP-08 U1 notes: OP-05 Outcome and result file, OP-05r Association review

Unit U1 of WP-08. Author: the U1 engineer (Claude Opus subagent), 13 October 2026. Input for the architect's
integration (U6 wiring, gallery registration, `DESIGN.md`). U1 commits nothing. Base: lane branch
`ui-revamp-2026-10-12` at bc9a353 with other units' uncommitted work in the same working tree; U1 touched none of it.

Binding inputs: `WP-08-design.md` §1.2–§1.5, §2.0, §2.1, §2.2, §2.10–§2.14, §4, §5, §7.1 (U1 row);
`WP-08.md` §3 (Q-W08-08) and §4 (E-01, E-03, E-11, E-13, E-17, E-21; every other row read);
`WP-08-acceptance.md` A01–A34, A111–A118, A154–A156; `WP-08-U0-notes.md` §6; `PLAN.md` LD-14, LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/outcome/pages.ts` (new) | OP-05 `outcomePage`, OP-05r `associationPage`; receipts (`outcomeReceiptExpectations`, `associationReceiptExpectations`); the strip `deliveryCompletionStrip` (exported for U2); `needsResultForm`, `readsCase`, `newFileOffered`, `filingShapeOf`; addresses (`outcomeHref`, `associationHref`, `outcomeActions`, `associationActions`); fixed lines as constants. Words only from `words.ts` (U0) except the page lines of §4. |
| `src/apps/staff/outcome/routes.ts` (new) | `outcomeRoutes()`: 2 GET + 6 POST copies (§2). `inputRefusal`, body limits and multipart limits exported. |
| `test/unit/web/outcome-pages.test.ts` (new) | 20 tests. |
| `test/unit/bff-outcome.test.ts` (new) | 9 tests (HTTP, scripted Core with upload and release). |
| `scripts/dev/gallery/outcome.ts` (new) | `outcomeGalleryPages()` (14 pages) and the fixtures the two test files share. Not registered. |
| `test/unit/web/boundary-wording.test.ts` | One import line and one `SWEPT_PLACES` entry appended (every gallery page of OP-05 and OP-05r, reader staff). No other line changed. |

## 2. Routes

All routes have surface `ops`. The six POST routes are copies: same ids, paths, actions and commands as the copies in
`src/apps/staff/operations/case-work.ts`, `src/apps/staff/operations/incidents.ts` and `src/apps/staff/delivery/routes.ts`.

| Route id | Method, path | Action | Command | Body | Success | Refusal |
|---|---|---|---|---|---|---|
| `ops.applications.outcome_form` | GET `/ops/applications/:applicationId/outcome` | `application.read` | — | — | page; receipts `result`, `artifact`, `cancelled` | — |
| `ops.incidents.association` | GET `/ops/incidents/:incidentId/association` | `incident.read` | — | — | page; receipts `confirmed`, `rejected`, `artifact`; uniform 404 for another incident kind | — |
| `ops.case_work.official_result` | POST `…/official-result` | `operator.record_outcome` | `ops.record_official_result` | multipart (files 1, fields 30, fieldSize 4096, parts 40, file 5 MiB + 1) | 303 `receiptLocation(OP-05, 'result')` | OP-05 at the POST address, `restorePath` OP-05 |
| `ops.case_work.artifact` | POST `…/artifacts` | `operator.record_artifact` | `ops.record_artifact` | multipart (as above) | 303 to OP-05 (`artifact`), or to OP-05r when `hostPage=association` with a valid `incidentId` | OP-05, or OP-05r for the OP-05r form |
| `ops.case_work.cancelled` | POST `…/outcome` | `operator.record_outcome` | `core.record_outcome` | form, 32 KiB | 303 OP-05 (`cancelled`) | OP-05 |
| `ops.incidents.confirm_association` | POST `/ops/incidents/:incidentId/confirm-association` | `incident.work` | `ops.confirm_artifact_association` | form, 8 KiB | 303 OP-05r (`confirmed`) | OP-05r |
| `ops.incidents.reject_association` | POST `…/reject-association` | `incident.work` | `ops.reject_artifact_association` | form, 32 KiB | 303 OP-05r (`rejected`) | OP-05r |
| `ops.incidents.review_copy` | POST `…/artifacts/:artifactId/review-copy` | `document.retrieve_for_review` | `dlv.retrieve_for_review` (byte release) | form, 4 KiB | the bytes | OP-05r with the reason (status by category); `not_found_or_forbidden` → 404; `unauthenticated`, `maintenance`, `internal`, `unavailable_dependency` → the shell |

Posted field names are unchanged, with two changes: `replacesArtifactId` is a radio group (was a select; values
unchanged, `art_…` or `art_…:inc_…`), and the OP-05r replacement form adds the hidden, BFF-only field `hostPage`
(`association`), which never reaches Core. `chosenApplicationId` is a radio group (D-W08-17, as designed).

LD-17: every field is read whole (trimmed of surrounding spaces only); every evidence row is read
(`evidenceRowsOf(fields, 1)`: a second row is refused, never dropped); input outside the command contract is refused
at its field before any command (`inputRefusal`); a replacement value of another shape is refused at its field.
Body limits: a 2,000-character Devanagari note is about 18,000 bytes percent-encoded (reject, 32 KiB); a 1,000-character
reason plus a 200-character reference about 11,000 bytes (cancellation, 32 KiB). Tests prove both within the limits
and sent whole.

Reads (LD-14): OP-05 reads `core.ops_case` and `ops.case_work` (required); `ops.official_result_form` through
`optionalView` only for the assigned operator outside a support view when a form needs it; `iam.own_grants` through
`optionalView` for a reader who is not the assigned operator. OP-05r reads `ops.incident` (required); `core.ops_case`
and `ops.case_work` of the incident's application through `optionalView` only when Core names the application for
the reader and the reader is not only its named reviewer (today's `namesFor` rule). Receipts through `readReceipt`.
No code catches every error.

## 3. States per page

OP-05: no outcome, no file (S2); outcome form (Core's outcomes, none chosen); outcome blocked (Core's sentences;
`filing_not_evidenced` by shape, E-13, with `THIRD_PARTY_OUTCOME_LINE` for a provider-filed service); outcome read
unavailable (no form, line); issued with no file (V13: panel "Record the result file. Delivery of the result waits
for it.", form with "Replaces: No: a new result file"); file pending review (link "Review the association" to
OP-05r, `CHECKS_LINE`); file rejected (new file or replacement); file blocked after a disclosure (replacement under
that incident); replaced file (link to its replacement); preparation-only (line, no forms); read grant (facts only,
read-grant line, `ASSIGNED_ONLY_LINE`); support view (facts only); completed with an open result-file incident the
reader owns or reviews (incident-scoped form, E-03); cancellation allowed (confirm disclosure), undeclared
(boundary notice and unavailable control), blocked (sentences); outcomes recorded elsewhere (four paragraphs, E-17
for External outcome unresolved); later official fact (heading); refusal (C2, fields kept, file chosen again);
stale (C5, CMP-14); outcome already recorded (refusal and unsent values, no form); receipts (C3).

OP-05r: open review (file facts, review copy, candidates with the uploaded-for application's identity facts, others
"Evidence unavailable to you" and not selectable, decision, reject); named reviewer with no readable candidate (no
confirm form, info callout, reject); case read unavailable (facts "Unavailable", nothing selectable); refused
confirmation (choice kept, comparisons unticked, posted `artifactId` and `_rev.incident` kept); stale (CMP-14);
rejected and waiting (decided line, replacement form, E-03); confirmed and resolved (decided line, no form); refused
review copy (reason, forms stay); receipts.

## 4. Decisions with reasons

| ID | Decision | Reason |
|---|---|---|
| U1-D1 | OP-05 builds its own header (h1 "Outcome and result file: [applicant]", meta, freshness), then WP-07's `workspaceTabs` with "Delivery & originals" current, then the strip "Delivery and completion pages", then its own status facts and action panel. It does not use `workspaceFrame`. | `workspaceFrame`'s identity band renders its own h1 (one h1 per page), and its action panel links to other pages, while design §2.1 item 5 anchors the panel to OP-05's forms. WP-07's external action pages use the same pattern. Q-W08-14: the strip is the second level under the workspace tab. |
| U1-D2 | The status fact "Filing" reads "External acts" with WP-07's `externalActsLines`. | Shape-neutral (E-13 class: a handoff is not a filing); the same words as the workspace frame. |
| U1-D3 | `ops.official_result_form` is read also when a result-file form shows (for the declared types), only for the assigned operator outside a support view. | A select of declared types prevents `artifact_type_undeclared` on "No: a new result file". The read's policy is the assigned-operator relation, the same as `viewerAssigned`. |
| U1-D4 | While `ops.official_result_form` is unavailable, OP-05 shows no outcome form and states why (design: the form with a text type field). | A02: the page does not hard-code outcomes and offers no free-text outcome. The result-file form keeps a text type field. |
| U1-D5 | "Replaces" is a radio group with no choice in advance. With no replaceable file the form states "Replaces: No: a new result file" as text. "No: a new result file" is a choice only while no current verified or pending file of a declared type exists (all declared types unknown: no such file at all). | A replacement stops a file's release at once: an explicit choice. The V13 state shows the words without a one-option choice. |
| U1-D6 | A file blocked after a disclosure counts as current: no "new" choice; the replacement answers the disclosure incident (`art_…:inc_…`, as today). | The incident's correction is a replacement of that file; a separate new file is not its correction. |
| U1-D7 | E-03: OP-05 shows one incident-scoped form (hidden `incidentId`) per open result-file incident the reader owns or reviews, when the application is no longer open. OP-05r shows a replacement form once the association is rejected (incident `awaiting_evidence`, Core offers incident work), with `hostPage=association` so its refusal and receipt show on OP-05r. | Core takes `incidentId` from the incident's owner or reviewer after completion (`results.ts:135-156`). A reviewer who cannot read the case cannot open OP-05. |
| U1-D8 | E-01: identity facts show only for the uploaded-for application when its case is read; every other candidate is a disabled radio with "Evidence unavailable to you" and the route; with none selectable there is no confirm form. | E-01, A155. |
| U1-D9 | A refusal keeps the posted hidden values (`_rev.*`, `artifactId`). | Common rule: hidden decision values come from what was posted. A blind resend after a stale refusal is refused again; "Review current information" reloads the page. |
| U1-D10 | The review copy form shows only while Core offers the confirmation as allowed (today: while the offer is not null). A refused review copy re-renders OP-05r; `duplicate_operation` has a page sentence. | After a decision Core refuses `review_channel_not_applicable`. The U0 table words `duplicate_operation` with "listed under the downloads below", which OP-05r has not. |
| U1-D11 | The action panel says "You" and maps the step only for the owner Core names; any other reader reads Core's owner label and sentence with no action. A reader under a read grant sees no panel. | E-06 ("you" only for the owner Core names); WP-07 precedent for read grants. |
| U1-D12 | Receipt `result` is titled "Later official fact recorded" when `followUp` is true; `cancelled` needs a summary of exactly `{applicationId}` and stays "Request recorded". | §2.12; A111 (an edited address never shows the wrong command). |
| U1-D13 | E-21: each file not yet reported links "Report a release to a wrong recipient" to `/ops/applications/:id/disclosure?version=<dov>` when served, else to the workspace tab `?tab=delivery#disclosure`. "Open the incident" goes to `/ops/incidents/:id`; an association incident goes to OP-05r when served. | E-21; WP-14 §2 OP-08w path; WP-14's rule "a file not yet reported" (the page has no release read to know "when a file was released"). |
| U1-D14 | No "Synthetic" meta. | `core.ops_case` carries no synthetic fact; the environment label covers test installations. |
| U1-D15 | The preparation-only line shows by service mode. | Core's outcome offer is null for that mode (`bindings/operations-work.ts` `resultOffer`), not blocked `service_mode_not_applicable` as the design assumed. |
| U1-D16 | Route ids in `defineRoute` are string literals. | The static scanner (`test/static/tree.test.ts`) requires a literal id. |
| U1-D17 | OP-05r states "The facts read from the file are not shown on this page yet. Compare them on the review copy." | A19 interim for STOP-W08-04. |

## 5. Deviations

1. U1-D3 (an extra optional read), U1-D4 (no outcome form while the outcomes cannot be read), U1-D5 (radio markup,
   field name and values unchanged), U1-D7 (new BFF-only hidden field `hostPage`), U1-D10 (review copy offered only
   while the confirmation is allowed), U1-D2 (fact label).
2. Page words without a design or U0 source (PM or architect review): `OUTCOMES_UNREADABLE_LINE`, `CHECKS_LINE`,
   `CORRECTION_LINE` (A26), `REPLACED_MEANWHILE`, the field messages of `fieldMessage` (A08 words where they exist),
   the review-copy `duplicate_operation` sentence, "No candidate can be confirmed here", the E-03 lead lines, the
   E-17 paragraph wording.

## 6. What U6 must do

1. Register `outcomeRoutes()` in `src/apps/staff/instance.ts`. Remove the old copies in the same change (same ids):
   `ops.case_work.official_result`, `ops.case_work.artifact`, `ops.case_work.cancelled` and their forms in
   `case-work.ts` (or WP-07's carried copies on the "Delivery & originals" tab, `workspace.ts`); the confirm, reject
   and review-copy forms and the two routes in `incidents.ts`; `ops.incidents.review_copy` in
   `staff/delivery/routes.ts` (U2 owns that file now: coordinate).
2. Route inventory (`src/web/route-inventory.ts`): add GET `ops.applications.outcome_form`
   `/ops/applications/:applicationId/outcome` (`application.read`) and GET `ops.incidents.association`
   `/ops/incidents/:incidentId/association` (`incident.read`). WP-07's `operatorHref({ page: 'outcome' })` then
   resolves to OP-05 by itself.
3. Workspace "Delivery & originals" tab: replace the carried official-result, replacement and cancellation forms by a
   link "Record or review the outcome and result file" (OP-05); drop `CARRIED_DONE` `result`, `cancelled`, `artifact`
   and the three names in `carriedFormTab`. Old incident page: "Review the association" → OP-05r for an
   `artifact_association` incident.
4. `resultHrefOf` (`src/apps/shared/common-routes.ts`): `application` receipts of these codes → OP-05; `incident` →
   OP-05r when the kind is association, else the incident page.
5. U2 imports `deliveryCompletionStrip(ctx, applicationId, 'delivery' | 'completion', from)` so the strip has one
   wording (or the architect moves it to a shared module).
6. Tests of design §7.3: `test/system/case-work.test.ts` `recordResult` from OP-05 (location
   `/ops/applications/<id>/outcome?done=result&op=<key>`) and the review copy from OP-05r; `bff-access-change.test.ts:70`
   assertions on removed forms move to OP-05r; `routes.test.ts` inventory counts; the carried-form test of §7.2.
7. Architect: register `outcomeGalleryPages()` in `scripts/dev/gallery-pages.ts`.

## 7. Open items (ranked)

| ID | Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|---|
| U1-P1-1 | P1 | E-03 and A154 name the incident's owner and a named reviewer. A named reviewer who cannot read the case cannot open OP-05 (`core.ops_case` refuses), and OP-05r serves association incidents only. | A SuperAdmin names operator-2 reviewer of a `bytes_integrity` incident on a completed application of operator-1. WP-14's OP-08i links "Record the correction" to OP-05 `#record-file`; operator-2 gets the no-access page and cannot record the replacement Core would accept. | WP-14's OP-08i hosts the incident-scoped result-file form (the POST route and the `hostPage` pattern of U1 serve it), or OP-05r is widened to every result-file incident kind. Architect decides. |
| U1-P1-2 | P1 | `ops.case_work.artifacts` carries no processing state, so a file that failed its asynchronous safety check reads "Waiting for review · Withheld until reviewed" (A156, E-11 "truthful processing state"). | A result file fails the malware scan. OP-05 shows it waiting for review for days; the operator waits instead of recording a replacement. The page claims nothing false (`CHECKS_LINE` says the page does not show a file's checks), but the reason is missing. | Kind 1 read addition (the processing state of each artifact's version on `ops.case_work`) for P-13. |
| U1-P2-1 | P2 | Inference from `src/apps/shared/server.ts` `readMultipart`: the multipart parser marks a text part over `fieldSize` (4,096 bytes) as truncated and the server does not check the mark, so the handler may see a cut value. Every valid field is at most 600 bytes, and any cut value stays over its contract limit, so it is refused at the field; but the re-rendered value is the cut one. | A hand-made request sends a 10,000-byte evidence reference; the refusal shows the first 4,096 bytes as "your value". | Shared server change: refuse a part over `fieldSize` as a whole (`valueTruncated`). Not in U1's files. |
| U1-P2-2 | P2 | The review copy's `duplicate_operation` sentence is page-local; the U0 table `REFUSALS.review_copy` is empty. | A later edit of `words.ts` changes the download sentence; OP-05r keeps its own. | Move the sentence into `words.ts` `review_copy`. |
| U1-P2-3 | P2 | Two navigations mark `aria-current="page"`: the workspace tab "Delivery & originals" and the strip's "Outcome and result file". | A screen-reader user hears "current page" twice. | `objectTabs` option for `aria-current="true"` on a parent level (WP-02 component). |
| U1-P2-4 | P2 | Several declared result types: "No: a new result file" is a choice while one declared type has no current file; the type select lists all declared types. | A service declares two types; the operator records a second file of a type that already has a current file as "new" instead of replacing it; Core records it and its association review decides. | Accept; Core decides. Revisit if a service declares more than one type. |
| U1-P2-5 | P2 | The static test `test/static/tree.test.ts` "no country code literal" fails on `src/apps/shared/pages/services.ts:321,323` (`IND`). | The architect integrates and the static suite fails. | Not U1's file (another unit's uncommitted change); the owner of that change fixes it. |

No P0 item.

## 8. Checks run

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json` (whole project, other units' work included) | 0 errors at the last run (an earlier run showed 3 errors in U2's `send-page.ts`, since fixed by its owner) |
| `npx eslint --max-warnings=0` on the 6 files of §1 | 0 problems |
| `node --test test/unit/web/outcome-pages.test.ts test/unit/bff-outcome.test.ts test/unit/web/boundary-wording.test.ts test/unit/web/delivery-components.test.ts` | 73 tests, 73 pass (20 + 9 of U1; the sweep now covers 14 OP-05 and OP-05r renders) |
| `node --test "test/unit/web/*.test.ts"` | 1,373 tests: 1,372 pass, 1 todo (existing), 0 fail |
| `node --test test/static/**/*.test.ts` | 74 tests: 73 pass, 1 fail (U1-P2-5, not U1's file) |
| Gallery: `outcomeGalleryPages()` rendered (scratch script, not kept) | 14 pages, one `h1` each |

Not run: system tests, browser checks (axe, overflow at 320 px), the crawl record, `npm run check`.
