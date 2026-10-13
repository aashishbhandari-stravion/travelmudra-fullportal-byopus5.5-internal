# WP-02 follow-up P-05: declared facts on the service detail page (implementation notes)

Unit: P-05 follow-up of WP-02 (`WP-02.md` §8). Author: implementing engineer of the UI lane. Date: 13 October 2026.
Authority: Max's exception OD-X11 to DECISIONS §3.1 point 2 (orchestrator, internal 637118a); seam grant confirmed by
the orchestrator (internal bfae3a7) with three conditions (§3 below). Nothing is committed: the architect integrates.

## 1. Files and functions changed

| File | Change |
|---|---|
| `src/contracts/queries.ts` | New schema `zDeclaredTerms`. The `cat.offering_display` entry gains the field `declared: zDeclaredTerms` beside `offering` and `display`. `zSelectable`, `zOfferingDisplay` and the `cat.ops_offering` entry are not changed. |
| `src/core-api/bindings/catalogue.ts` | `offeringView` is split into `readableOffering` (the scope guard, same calls in the same order with the same refusals) and `displayView` (the same display mapping). New: `declaredTermsOf` (exported, pure), `readableTitle`, `dependencyTerms`, `declaredTerms`. The `cat.offering_display` binding adds `declared`. `cat.ops_offering` still calls `offeringView` and answers the same value. Dated comment above the new read model. |
| `src/modules/catalogue/` | No change. The read model uses the existing module interface (`getDeclaration`, `getOffering`, `selectableOfferings`, `offeringDisplay`). `offeringDisplay` (`display.ts`) is not changed, so its other consumer (`intake/api.ts` start page) is not affected. |
| `src/apps/shared/ta-catalogue.ts` | The service route passes `declared` to the page. |
| `src/apps/shared/pages/services.ts` | New sections on the travel agent's service: `#delivers` "What this service delivers", `#eligibility` "Who can apply" (declared), `#travel-dates` "When to submit", `#dependencies` "Services this service needs"; `#process` gains the declared steps table, the takeover sentence and the declared acts, then the published overview. New type `ServiceDeclared`. `serviceDetailPage` gains an optional `declared` argument. The estimate sentence changes on both readers. The freshness line uses `declared.asOf` when present. Without `declared` (operator) the page is as before, with the product-wide population. |
| `scripts/dev/gallery/services.ts` | Declared-term fixtures for the existing travel-agent pages; new page `services-ta-detail-provider.html` (provider-filed, two dependencies, declared summary in the completion pattern). |
| `test/integration/catalogue-offering-display.test.ts` | New. Core-level tests through the query bindings over the real database (7 tests). |
| `test/unit/web/services-pages.test.ts` | Updated and extended (25 tests). |
| `test/unit/bff-services.test.ts` | Extended (8 tests; 1 is the existing `todo`). |

## 2. Wire shape (`declared`)

`asOf` (instant of the read transaction, `tx.now`); `promise {deliverable, claimsGovernmentResult, summary}`;
`population {nationality, passportType, residence, purposes}`; `travelDateRules {minDaysBeforeTravelStartToSubmit,
maxDaysBeforeTravelStartToSubmit}`; `dependencies [{upstreamServiceCode, upstreamTitle, applicantRelation,
requiredOutcome, requiredArtifactType, conditionedActions}]`; `externalAuthority {kind, label}`; `steps [{code, actor, meaning}]`;
`externalActs []`. Each term is `null` when the governing declaration holds no value (absent or unresolved).
`upstreamServiceCode` is the declared code. `upstreamTitle` is the title of the one offering the reader may read, in the
same country, with the service code the relation names, in a service mode Core accepts for the required outcome; `null`
when no such offering or more than one exists (review fix R-01, §10). A step's `meaning` is `null` when `progressMapping` does not map its code.

## 3. Orchestrator conditions (bfae3a7)

| Condition | Evidence |
|---|---|
| (1) Additive only | `bff-services.test.ts` "adds the declared terms beside the display; the list entry and the display keep the schemas the operator's variant uses": the view keys are `offering, display, declared`; `offering` and `display` are the same schema objects as in `cat.ops_offering`. No field is renamed, removed or retyped. |
| (2) Staff variant unchanged | `catalogue-offering-display.test.ts` "the operator's variant: exactly the display it had …": keys `offering, display`; display keys are exactly the 12 earlier keys; the operator's display equals the travel agent's display for the same head. `bff-services.test.ts`: the operator's contract refuses an answer with `declared`. |
| (3) Scope guard unchanged | `readableOffering` holds the earlier guard code without change in logic. The declared terms are read only after it passes, in the same read transaction. Tests "the scope guard of one service": an offering outside the travel agent's scope (unpublished, not launched), an unknown id, and a call without a session are refused `not_found_or_forbidden/access_denied` and `unauthenticated/session_expired`; an upstream service the reader may not read gives `upstreamTitle: null` and its title is not on the wire. |

## 4. Kind 1 criterion (DECISIONS §3.1), points 1 and 3 to 6

| Point | Answer | Evidence |
|---|---|---|
| 1 Recorded facts only; no new fact; no inference | Each field copies a declared item of the head declaration version, or the title and service code of a readable offering. An absent or unresolved item is `null`; no default is filled. The step-to-meaning join is a lookup by code inside one declaration. The takeover step (AC-P05-3) is NOT in the read model: the page derives it from the declared order and actor, so the read model infers nothing. | `declaredTermsOf`; tests "the tourist e-visa … nothing added" (equal to `declaredTermsOf` of the head declaration) and "a declaration without a term: … null, never a default". |
| 2 | Excepted by Max (OD-X11). The read model still does the two joins in Core (steps with meanings; dependency with the upstream title). | — |
| 3 As-of time; same scope guard; no permission | `declared.asOf` is the read transaction's instant. Same guard as the display (`readableOffering`), same transaction, same readable list for the upstream title. It grants nothing; no action reads it. | Test asserts `asOf` equals the clock; §3 condition (3). |
| 4 Named by subject; reusable | Field `declared` of the offering display, functions `declaredTermsOf` and `declaredTerms`: named by the offering's declared terms, not by a page. `declaredTermsOf(decl)` is pure; `declaredTerms` takes the guard's result. The services list or a bulk service context can call it per offering under the same guard. | Binding code. |
| 5 Dated code comment | Above the implementation in `src/core-api/bindings/catalogue.ts`: intent (consistency), source facts (the seven declaration items; titles and service codes of readable offerings), consumers, date 13 October 2026. | Binding code. |
| 6 Read-model register line | NOT written: `docs/verification/read-model-register.md` does not exist and is not in this unit's file list. Proposed line for the architect (§7 D-2). | — |

## 5. Acceptance criteria (Max, `WP-02.md` §8)

| Id | How the page meets it | Test (`services-pages.test.ts` unless named) |
|---|---|---|
| AC-P05-1 | Section "What this service delivers": the declared summary, the deliverable in words, "Government decision" (included / not included, from `claimsGovernmentResult`), the authority or provider by its declared label. The page's own words hold no guarantee language. The estimate sentence "This is an estimate, not a guarantee." becomes "This is an estimate. The actual time can differ." on both readers. Every page test runs a sweep (`GUARANTEE`: guarantee, assure, will be approved/issued/granted, certain, 100 %). | "what this service delivers …"; `assertCommon` on every page; "estimate …" |
| AC-P05-2 | The declared summary is the first paragraph of the section, a sentence of its own: declared text in the pattern "This service is completed in XX days on average after the YY milestone." reads as written. The page computes no number. | "the completion statement …" (only the declared number appears; text escaped); gallery `services-ta-detail-provider.html` |
| AC-P05-3 | Table "Steps of this service": the declared local steps in declared order (step name = declared code in words), who acts (You / TravelMudra), the progress the travel agent's lists show during the step (from `progressMapping`). Sentence: "After you submit, TravelMudra takes over from step N, NAME." N is the first declared step whose actor is TravelMudra (assigned operator or SuperAdmin). The declaration has no field that marks a step, so the rule "the step after the travel agent's submission" applies; when the first declared step is the travel agent's, the sentence names the next TravelMudra step (truthful). Steps marked "You" are named as needing the travel agent's action. The declared external acts follow, named with the declared label. | "the steps: …" (other declared codes read as declared; no fixed list) |
| AC-P05-4 | "Who can apply" (declared population and purposes), "When to submit" (latest and earliest submission from the declared window; a declared open start reads "No earliest date is set"), "Services this service needs" (each declared relation with the upstream title, or "A service that is not listed for you"; a declared empty list reads "This service does not need another service."), the authority or provider label. Each missing term reads "Not declared", never "None". | "who can apply and when to submit …", "a provider-filed service …", "terms that are not declared read "Not declared", never "None" …" |

## 6. Decisions

1. No module change. The binding reads the declaration through the existing catalogue interface. Reason: smallest change; `offeringDisplay` has a second consumer (intake start page).
2. `declared` is a sibling of `display`, not new fields inside it. Reason: the operator's variant shares `zOfferingDisplay`; a sibling keeps that schema and its output unchanged by construction.
3. `declared` is required on the wire. Reason: the three instances of one installation run one release (an instance exits when another release becomes active).
4. The external authority shows for government-filed services too ("Government authority"), not only for provider filing ("Filing provider"). Reason: it is a declared fact under the same guard; the review page already names the authority.
5. Travel-date rules = the declared submission window: its two cut-offs (latest: at least N days before travel start; earliest: no more than M days). The withdrawal cut-off and the other cut-offs (`controls.*`) are not shown: they are controls, not travel-date rules, and an unsupported withdrawal cut-off already reads in "Not available for this service".
6. Declared external acts are listed apart from the steps ("With the authority or provider"). Reason: the declaration orders the local steps but declares no order between steps and acts.
7. Step names are the declared step codes in words (`humanize`). The declaration has no step label.
8. A population inside the approved one reads "Indian citizens who hold an ordinary passport and live in India" (the approved product words, via `populationInScope`); any other declared population shows its declared codes. Reason: the static tree test refuses country-code literals in shared code.
9. The operator's page keeps the product-wide population and the sentence "Offering-specific conditions are not shown on this page yet.": its read model has no declared terms, so the sentence stays true there.

## 7. Deviations and items for the architect

- **D-1 (P0 for integration).** `test/system/browser.test.ts:106` pins the interim sentence on the travel agent's service page. The page now shows the declared terms, so this system test fails. The file is outside this unit's list. Scenario: the integration commit runs `npm test`; the browser system test fails at line 106. Proposed replacement of line 106:
  `assert.match(await page.locator('main section#eligibility').innerText(), /Who can apply[\s\S]*Indian citizens who hold an ordinary passport and live in India/);`
  and, after it, `assert.match(await page.locator('main section#delivers').innerText(), /What this service delivers/);`
- **D-2 (P1, criterion point 6).** Register line not written (file absent, not in the list). Proposed line for `docs/verification/read-model-register.md`:
  `| cat.offering_display: declared (declared terms of one offering) | head declaration version items promise, eligibility.population, eligibility.travelDateRules, dependencies, authority.externalAuthority, actorsActions, progressMapping; titles and service codes of offerings the reader may read | travel agent's service page (edge; staff support view); reusable by the services list and a bulk service context | 13 Oct 2026 |`
  Scenario: the independent reviewer checks point 6, finds no register line, and records a P1 finding.

## 8. Open items (ranked)

| Rank | Item | Scenario |
|---|---|---|
| P1 | Declared text is shown as declared. A summary that holds guarantee words would show them on the page; the page cannot meet AC-P05-1 "anywhere" then. Owner choice: refuse guarantee words at declaration registration (a catalogue change outside this lane), or accept that declared text is the owner's words. | A SuperAdmin registers a summary "Visa approval assured in 5 days"; the travel agent's page shows it under "What this service delivers". |
| P1 | Scope of "no guarantee language anywhere". This unit removed it from the Services pages. Other pages still say "an estimate, not a guarantee" (`review-submit.ts`, `core/ta.ts`, staff case and workspace pages). | Max reads "an estimate, not a guarantee" on the review page and counts it against AC-P05-1. |
| P2 | Step names come from declared codes. An unclear code reads unclear ("Chk docs v2"). A declared step label would need a declaration schema change (Kind 2). | A SuperAdmin declares the code `chk_docs_v2`; the table shows "Chk docs v2". |
| P2 | A declared and supported withdrawal cut-off is not shown as a positive statement ("You can withdraw until …"). | A travel agent asks until when a withdrawal is possible; the page states nothing when the cut-off is supported. |
| P2 | Country adapter checks declared for travel dates (`evaluateTravelDateRules`) are not shown; only the declared window is. | A country rule refuses dates inside the shown window; the travel agent learns it at the draft check. |
| P2 | The upstream mode rule copies Core's link check (`core.link_dependency`: a preparation-only upstream is refused for an issued or refused result) as `upstreamModeAccepted` in the binding. Core does not export the rule. | Core widens its link rule later; the binding still names a title Core would refuse. Fix then: Core exports one predicate that both use. |
| P2 (R-02, parked) | The new wire limits are tighter than the declaration schema: `steps` max 100 and `dependencies` max 50, while the declaration does not cap local steps or relations. Above a limit the whole answer cannot be encoded. Not changed (orchestrator: parked). | A declaration with 101 local steps is registered; the travel agent's service page for that offering fails with an internal error. |
| P2 | The services list (TA-02) and a bulk service context do not use the declared terms yet. | — (reuse is possible under the same guard). |

## 9. Checks run (13 October 2026, lane working tree, uncommitted)

| Check | Result |
|---|---|
| `npx tsc -p tsconfig.json` | Clean for these files. One error in `test/unit/bff-send.test.ts:215` (untracked file of another engineer; not touched). |
| `npx eslint --max-warnings=0` on the changed files and the gallery module | Clean. |
| `node --test --test-global-setup=test/support/global-setup.ts test/integration/catalogue-offering-display.test.ts` | 7/7 pass. |
| `node --test test/unit/web/services-pages.test.ts test/unit/bff-services.test.ts` | 32 pass, 0 fail, 1 todo (existing). |
| `node --test test/static/*.test.ts` | 74/74 pass (after the population wording used `populationInScope`; the first run refused an `IND` literal). |
| `test/unit/contracts.test.ts`, `bff.test.ts`, `frozen-interfaces.test.ts`, `bff-access-change.test.ts` | 50/50 pass. |
| Services gallery pages (scratch script with the checks of `test/ui/gallery.test.ts`: overflow, CSP, script errors, axe serious or critical at 1440 and 390 px light and dark; overflow at 360 and 320 px) | 10 pages, 60 checks, 0 problems, no axe finding at any impact at 1440 px light. The full gallery test was not run. |
| `test/system/new-service.test.ts`, `test/system/ported-pages.test.ts` (three instances; the travel agent's service page through edge from the real core, including a service created through the SuperAdmin pages) | 12/12 pass. |
| `test/system/browser.test.ts` | 5 pass, 1 fail: the expected failure D-1 at line 106 only. The real page showed "Who can apply / Travellers / Indian citizens who hold an ordinary passport and live in India / Purposes / Business", which the proposed replacement line matches. The assertion after line 106 in that test (`violations` empty) did not run. |
| `node --test "test/unit/web/**/*.test.ts"` | 1400 pass, 0 fail, 1 todo. |

## 10. Review fixes (13 October 2026, after commit 935d723)

Review: lane `research/reviews/P05-code-review.md`, verdict "sound with the fixes above"; point 1 failed on R-01.

**R-01 (P1), fixed, uncommitted.** The dependency title lookup returned the first readable offering with the same country
and service code, in any filing mode. Fix in `src/core-api/bindings/catalogue.ts`:

- `upstreamModeAccepted(mode, requiredOutcome)` (lines 120-128): Core's link rule; a preparation-only upstream is not
  accepted for an `issued` or `refused` result.
- `upstreamTitle(tx, catalogue, sel, readable, relation)` (lines 130-147) replaces `readableTitle`: it takes the
  relation, keeps the readable offerings in the same country with the named service code and an accepted mode, and
  returns a title only when exactly one remains; else `null`.
- `dependencyTerms` (line 154) also carries the declared `upstreamServiceCode`.
- Contract (`src/contracts/queries.ts` lines 111-117): `upstreamServiceCode` added to the dependency item of `declared`
  (additive inside the new schema; nothing earlier changed); the comment states the rule.
- Page (`src/apps/shared/pages/services.ts` lines 372-373): without a title the item reads "The service with the code
  “<declared code>”, …". The earlier wording "A service that is not listed for you" is removed: it was untrue for the
  ambiguous case.
- Fixtures (gallery, unit tests) carry the code.

Tests (`test/integration/catalogue-offering-display.test.ts`, new describe "a dependency whose service code two filing
modes share"): a second synthetic database seeded with the synthetic catalogue plus a preparation-only offering under
the code `syn_tourist_evisa` (titled to sort first) and a second transit relation to that code requiring `withdrawn`.
Three tests: both modes are readable and the preparation-only one comes first (precondition); the `issued` relation
names "SYN Tourist e-visa" (two-mode regression); the `withdrawn` relation, which both modes can meet, gives no title
and only the code (ambiguous match). Sensitivity: with the earlier first-match lookup restored temporarily, the two
relation tests fail; with the fix they pass.

**R-02 (P2), parked** as instructed; recorded in §8.

Checks after the fix: `npx tsc -p tsconfig.json` clean; eslint clean on the seven changed files; integration test 10/10;
`services-pages` + `bff-services` 31 pass, 1 fail, 1 todo; `test/static` 74/74; services gallery pages 60 checks, 0
problems. The one failure is the operator's list test ("the list: published values by country …", expects
`aria-current` on `/ops/catalogue`). Cause: concurrent uncommitted work in the tree removes the operator's Services
pages (`opsCatalogueRoutes` from `src/apps/staff/instance.ts`, rows O58 and O59 from `src/web/route-inventory.ts`, the
Services entry from `src/web/ui/shell.ts`). This fix does not cause it; the owner of that change updates or removes the
operator tests in `services-pages.test.ts`.
