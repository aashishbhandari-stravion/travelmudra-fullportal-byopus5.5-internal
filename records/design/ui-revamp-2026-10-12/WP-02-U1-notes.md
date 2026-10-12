# WP-02 U1 notes: Services pages (TA-02, TA-03, operator Services)

Unit U1 of WP-02. Author: the U1 engineer, 12 October 2026. Input for the architect's integration and the
`DESIGN.md` update. U1 commits nothing; the architect integrates. Base: lane repository at 42cb373. Binding inputs:
`WP-02-design.md` §2.6, §3.0, §3.12, §3.13, §5, §6, §8.1 (U1 row), §8.3; `WP-02.md` §3 and §4.1. The architect's
decisions and amendments B-04, B-05, B-06, B-08 and B-09 govern where they differ from the design.

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/pages/services.ts` (new) | One renderer for both readers: `servicesListPage(ctx, reader, rows)` and `serviceDetailPage(ctx, reader, row, display)`. `ServicesReader` holds the audience (`ta` or `staff`), surface, paths, list title and the reason-sentence function. `TA_SERVICES` (travel agent wording, `TA_REASONS`) is defined here. No import from `src/apps/staff/`. |
| `src/apps/shared/ta-catalogue.ts` | Routes only. Paths, route ids, actions, queries and the resolver are unchanged. |
| `src/apps/staff/catalogue/ops-discovery.ts` | Routes only, plus `OPS_SERVICES` (staff wording; reason sentences from `codeSentence` of `shared.ts`, read only). Paths, route ids and queries are unchanged. |
| `scripts/dev/gallery/services.ts` (new) | `servicesGalleryPages()`: 9 pages (§4). Not registered: the architect adds it to `galleryPages()` in `scripts/dev/gallery-pages.ts`. |
| `test/unit/web/services-pages.test.ts` (new) | 20 tests (§5). |
| `test/system/browser.test.ts` | `TA_TITLE` is "[TEST] Services · Travel agent · TravelMudra" (lines 28, 93, 229). Three assertions added: "Available for new applications" and "Read at … IST" on TA-02; the interim eligibility sentence on TA-03. |

No form, field, route path or query changes. No change under `src/modules/`, `src/contracts/`, `src/core-api/` or
migrations. The pages read one authoritative query each and have no optional block, so no `optionalView` call
exists; every failure of the one read reaches the shell (WP-01 rule).

## 2. Page states and copy

Every page: one h1, the freshness line "Read at [time] IST" on the breadcrumb row, no form in `main`.

### 2.1 TA-02 Services `/ta/catalogue`

| State | Copy and layout |
|---|---|
| Header | h1 "Services". Lead: "Services TravelMudra offers you, by country. Open a service for its price, processing estimate and required documents. A price is fixed for an application when you submit it." No price on the list (B-06: the read model returns none). |
| Country index | Two or more countries only: `nav` "Countries" (`pageIndex`) with in-page links `#country-0`, `#country-1`, … No query string, no filter state. A query string in the address is ignored and never echoed. |
| Rows | One section per country (`h2` country name, `id="country-[n]"`), table caption "Services in [country]" (hidden). Columns: Service (link holds only the title; badge "Synthetic test service" beside it), Who files ("TravelMudra files", "Preparation only — you file", "Filed by a declared provider"), Availability. |
| Available | Badge "Available for new applications" (success: ink text and check icon). |
| Not available | Badge "Not available for new applications" (unavailable tone) and each reason sentence once, in Core's order, from `TA_REASONS`. Suspended and withdrawn read through their reason sentences; no "Paused", "Withdrawn" or "Information only" label (PM Q-02 decision). Unknown code: "This is not available at the moment." |
| All rows not available | Info callout "No service is available for new applications": "No service is currently available for new applications in this scope. Each service below states its reason." The rows stay. |
| Empty (S2) | Empty state "No service is available for new applications" / "No service is currently available for new applications in this scope." No promise, no count. |
| Support view | The same page at staff; it has no action. |

### 2.2 TA-03 Service detail `/ta/catalogue/:offeringId`

Order: identity band, availability, synthetic notice, `#eligibility`, `#cost`, `#estimate`, `#documents`, `#process`,
`#unavailable`. Section ids `cost`, `estimate`, `documents`, `process` are kept.

| Block | Copy |
|---|---|
| Identity | Breadcrumb "Services"; h1 the service title; status badge (as TA-02); meta Country and Who files (mode label only, B-05). |
| Start (selectable, Groups page registered, not a support view) | Primary "Start an application" → `/ta/groups` in the header actions, and the line "Choose or create a group of travellers for [country], then add an application for this service." No preselection claim (B-09). |
| Not selectable | Unavailable callout "Not available for new applications": each reason sentence, then "Owner: TravelMudra". No start action. All published values still show. |
| No Groups page in the instance | Known-limitation callout "Applications open in a later release" (existing copy kept). |
| Support view | The same facts; no action and no start sentence (design §3.13 item 3). |
| Synthetic | Info callout "Synthetic test service": "This service exists only in test installations. Nothing is filed with a real authority." |
| Eligibility (B-04 interim) | Section "Who TravelMudra serves", description "These apply to every TravelMudra service.": Travellers "Indian citizens who hold an ordinary passport and live in India"; Purposes "Tourism and business"; Outside the service "Student, diplomatic and work visas"; then "Offering-specific conditions are not shown on this page yet." Wording follows the public site's approved scope block (`content/public/pages.json`). No "Not declared" here. |
| Cost | "Service price ₹[n] fixed when you submit"; Government fee (§2.4); when `priceFeeRelation = unselected`: boundary notice "How the service price relates to the government fee is unavailable until the product owner decides it. Owner: product owner". |
| Estimate | "[min] to [max] calendar days. This is an estimate, not a guarantee." ("[n] calendar days" when equal, "1 calendar day"), then the note. No date computed. |
| Documents | Table Document (label, description), Needed, Formats, Size limit ("Up to 5 MB"). A requirement without formats or with size 0 is not declared (the declaration schema requires at least one format and a positive size): each such cell reads "Not declared", Needed included, never "0 bytes" or an empty cell. No global size sentence. |
| Process | Ordered steps; "Notes from TravelMudra" (h3) when display notes exist. |
| Boundaries | Section "Not available for this service": one `boundaryNotice` per code (price-fee relation excluded, it is in Cost). Withdrawal after submission, cancellation (declared or parked) and return of originals each name the action, "until the product owner …" and "Owner: product owner". Any other code: "One action of this service is unavailable until its policy or support is recorded. Owner: not yet named." |

### 2.3 Operator Services `/ops/catalogue`, `/ops/catalogue/offerings/:id` (B-08)

| Block | Copy |
|---|---|
| List | h1 "Countries and services" (kept, see §6 item 2). Lead: "Every published service by country. Open a service for its price, processing estimate, required documents and process." Read-only callout (below). Same grouping and index as TA-02. Column "Published values": "Published", or "Published, with a catalogue problem" with the catalogue's sentence (`codeSentence`). Who files in staff words ("Preparation only — the travel agent files"). Empty: "No published services" / "No service has published values." |
| Read-only explanation | "Read only": "These are the service’s current published values. An application keeps the values it was submitted under: read them on its case page." "Whether a travel agent can start an application also depends on the service’s launch and its audience. These pages do not show them." |
| Detail | Breadcrumb "Countries and services"; status as the list; the read-only callout; a warning callout "Catalogue problem with the published values" when the head has codes; then the same sections as TA-03 in staff words ("fixed for an application when it is submitted", "from the travel agent"); boundary notices carry the reference code; the boundary section is "Actions this service does not offer". |
| No conclusion | Neither "Available" nor "Not available" appears on either page; no start action, no form (unit test). |

### 2.4 Government-fee statement (Q-W02-09: declared timing worded as draft copy)

| Value | Travel agent ("you"; staff reads "the travel agent") |
|---|---|
| `travelmudra_pays`, `separate_act` | "TravelMudra pays the government fee as a separate step from filing the application, and recovers the exact government amount from you, separately from the service price." |
| `travelmudra_pays`, `with_submission` | "TravelMudra pays the government fee when it files the application, and recovers the exact government amount from you, separately from the service price." |
| `no_government_fee` | "No government fee applies to this service." |
| `not_handled_by_travelmudra` | "TravelMudra does not handle government or provider fees for this service." |
| `unavailable`, `declaration_incomplete` | "Not declared. TravelMudra has not stated how the government fee of this service is handled." (staff: "Not declared." and the catalogue sentence) |
| `unavailable`, any other code | "Unavailable." and the reason sentence. A declared but unsupported fee never reads "Not declared". |

All copy in this unit is draft copy (CR-09) until Max approves it.

## 3. Amendments and decisions: how each is met

| Item | Implementation |
|---|---|
| PM Q-02 (no "Information only") | Two availability states only, with the reasons Core reports. |
| B-04 eligibility interim | §2.2 Eligibility. Offering-specific eligibility, promise, travel-date rules and dependencies are not shown (P-05). |
| B-05 provider label | Mode label only. |
| Q-W02-09 fee timing | §2.4, from the declared closed set. |
| B-06 facts the read model returns | No price on TA-02. "Not declared" for an undeclared document requirement; never "0 bytes". No invented counts or defaults. |
| B-08 operator pages | §2.3. Published values, read-only explanation, no admission conclusion. |
| B-09 start | Link to `/ta/groups` with the country sentence; no preselection claim. |
| D-W02-06 country grouping | In-page sections with an index of links; no country in the address. |
| Freshness (CMP-12) | `pageHeader({ freshness: { kind: 'read', at: ctx.now } })` on all four pages. |
| Optional reads | None on these pages (one query each). |
| Support view | TA pages in a support view: same facts, no action, no start sentence, no form except the shell's End support view and Sign out (unit test; browser system test). |

## 4. Gallery

`servicesGalleryPages()`: `services-ta-list` (two countries, index, available, paused, out of scope, synthetic),
`services-ta-list-none`, `services-ta-list-empty`, `services-ta-detail` (available, price-fee boundary, two
boundaries), `services-ta-detail-paused` (preparation only, not available), `services-ta-detail-undeclared` (long
title, undeclared document, undeclared fee, equal estimate, unknown boundary code), `services-ta-detail-support`
(support view), `services-ops-list`, `services-ops-detail` (catalogue problem). Checked outside the suite with the
gallery sweep's checks (axe serious or critical, CSP, horizontal overflow) at 1440 and 390 px in light and dark,
and overflow at 360 and 320 px: 9 pages, no finding. The suite's own gallery test covers them once registered.

## 5. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | Pass. |
| `npx eslint` on the six changed files | Pass. |
| `node --test test/unit/web/services-pages.test.ts` | 20 of 20 pass. |
| `npm run test:ui` | 736 of 736 pass (includes the 20 new tests; gallery module not yet registered). |
| System tests `browser`, `ported-pages`, `new-service`, `refusals` (`TMPDIR=/tmp/w2u1`, global setup, concurrency 1) | 26 of 26 pass. Other units edited shared files (`src/apps/shared/server.ts`, `routes.ts`) in the same working tree during the run; the result is for that tree state. |

## 6. Items for the architect

| # | Rank | Item | Scenario | Proposal |
|---|---|---|---|---|
| 1 | — | Register the gallery module | The services pages are not in the gallery sweep until registered. | Add `...servicesGalleryPages()` to `galleryPages()` in `scripts/dev/gallery-pages.ts`. |
| 2 | P2 | Operator list h1 stays "Countries and services" | The rail says "Services"; the operator page title says "Countries and services". `test/system/ported-pages.test.ts:144` pins the old h1, and U1 does not own that file (design §8.3 lists it as unchanged). | Rename `OPS_SERVICES.listTitle` to "Services" and change the regex at `ported-pages.test.ts:144` in one integration step, or keep. |
| 3 | P2 | Boundary codes without their item | `cat.offering_display` drops the item key of a boundary, so a code other than the four known ones cannot name its action; the page shows a generic notice with "Owner: not yet named". No seeded offering produces such a code. | Part of P-05 if the owner wants the item named. |
| 4 | P2 | Support view shows no disabled start | `DESIGN.md` says a support view shows the viewed person's step disabled with "Read only in a support view"; WP-02 design §3.13 says no action and no sentence. U1 follows the WP-02 design. | Confirm, or add `unavailableButton` with the support-view reason. |
| 5 | — | `DESIGN.md` | The Services pages are not described. | One line under the destinations: TA-02/TA-03 states (§2.1, §2.2) and the B-08 rule for the operator pages. |
| 6 | — | Draft copy list | §2.2 eligibility wording, §2.4 fee wording, boundary sentences (§2.2) and the operator explanation are draft copy (CR-09). | Add to the copy-approval list. |
