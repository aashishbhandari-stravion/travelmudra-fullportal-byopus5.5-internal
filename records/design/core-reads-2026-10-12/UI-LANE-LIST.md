# Core lane core-reads-2026-10-12: everything the UI lane must do or know (consolidated, 14 Oct 2026)

Sources: the P0 package (ITEM-01 to 04, 33), the wave 1, wave 2, wave 3 and Kind 2 package messages, the held
hand-overs (ITEM-05, ITEM-32), and the item records. File paths are at lane head `dfbafaa` unless a record says otherwise.
"Required" means a Core contract or test depends on it; everything else is a recommendation.

## 1. Forms (required)

| Item | What the UI lane MUST do | Why |
|---|---|---|
| ITEM-07 (1), D-15 | The launch and the expansion forms MUST post `_rev.offering`: `revisionInputs({ controls, offering: m.offeringRevision })` in `src/apps/staff/catalogue/launch.ts` | The reviewed-head guard is complete only when the forms send the offering revision (review R-01 P1, handed to the UI lane) |
| ITEM-32, D-18 | Both gate exception grant forms MUST post one to five evidence items (`external_reference` or `attestation`, each with a note) and land in the same integration as the held branch `held/gate-exception-evidence` (`6a39fd3`) | Core refuses a grant without evidence. Failing until then: `test/system/case-rules.test.ts:227` (post `:226`, test `:218`), `:261`, `:348` (post `:347`; tests `:357`, `:401`); `test/system/core-pages.test.ts:262` (post `:261`); `test/system/document-decisions.test.ts:218` (422 instead of 303) |
| ITEM-03 | The staff route and the form field `filing` for the mark resolution (`src/apps/staff/core/admin.ts`, `src/web/route-inventory.ts`); the route and form for `core.record_mark_disposition` | The commands exist; no page calls them (the D-04 restore drill waits for the `filing` field) |
| ITEM-23, D-16 D-b | `core.apply_held_correction` on the staff allowlist together with its staff route, one commit in the UI lane | Handed over: the allowlist line without a route fails the route-inventory test |
| ITEM-33 R-01 | The browser forms still require both names (`src/apps/shared/pages/intake.ts:340`, `src/apps/shared/core/ta.ts:485-486`, the staff identity form) | Core accepts a surname OR given names; the forms refuse a one-name applicant (D-07, WITH MAX) |
| ITEM-33 R-02 | The identity-correction route handlers drop every empty value (`src/apps/edge/core/routes.ts:103`, `src/apps/staff/core/case.ts:416`), so a name cannot be cleared | Same (D-07) |
| ITEM-28 R-01 (parked P2, D-11) | The wrong-recipient report form (`src/apps/staff/operations/case-work.ts:272`) takes its email choices from the 100-send page window | An older file's email can fall outside the window; a fix needs a wider choice list |

## 2. Texts (sentences for new codes and events)

| Code or event | Where | Proposed words |
|---|---|---|
| `dependency_not_linked` (ITEM-02) | `src/apps/shared/core/shared.ts` | None in the UI today: a sentence that names the missing dependency link and who links it |
| `protection_mark_determination_missing` (ITEM-03) | `src/apps/shared/core/shared.ts` | None in the UI today: the filing determination is missing on a legacy protection mark; a SuperAdmin records it |
| `passport_identity_mismatch` (ITEM-04) | `src/apps/shared/core/shared.ts` | "This passport belongs to another applicant. Share it only with an application of the person whose passport it is." |
| `applicant_identity_missing` (ITEM-33) | `src/apps/shared/pages/intake.ts` (orchestrator-owned) | "A required passport value is missing: surname, given names or date of birth." |
| event `outcome_corrected` of `generic_case_update` (ITEM-30) | `EVENT_TEXT`, `src/apps/shared/delivery/pages.ts:189`; `test/unit/web/delivery-words.test.ts` | Proposal K2-P17-4 §0.5 words; until then the travel agent reads the generic text. SA-09o Effect: "TravelMudra posts no notice for this correction." becomes "The travel agent gets a notice: the outcome was corrected from [current] to [target]." |
| pending answer under a withdrawal (ITEM-10 (d), D-14, D-15) | TA and staff pending sentences | Owner `superadmin`, next action `record_outcome`, reasons `withdrawal_continuation_not_permitted` or `offering_withdrawn`: the TA sentence for `record_outcome` names the operator today; under a withdrawal it MUST name the SuperAdmin. Owner `unresolved_known_limitation`, reason `withdrawal_continuation_not_permitted`, next action `none`, follow-up superadmin. The staff case link for that answer should open the operational withdrawal (D22) |
| disclosure correction (ITEM-05, held) | `src/apps/staff/operations/labels.ts:38`, `incidents.ts:76` say "or evidence that none is owed"; `case-work.ts:259` says "verified and available" | With the held rule, only a receivable replacement meets the correction (current, canonical, content-safe, same group, no blocking incident); "evidence that none is owed" exists only after Point D |
| ITEM-11 R-01 (P2) | `src/apps/staff/operations/labels.ts:31` | The `assigned` badge reads "With a reviewer" after a stand-in reviewer's operator returns, while the owner is the SuperAdmin queue |
| ITEM-33 R-04 (P2) | `shared.ts:585`, `ta.ts:376`, `ta-documents.ts:69` | Name displays keep stray punctuation for one-name applicants |

## 3. New wire fields and queries (additive; the UI does not use them yet unless stated)

| Item | Field or query | Audience |
|---|---|---|
| ITEM-26 | `dlv.delivery_page.taAccountEmail` (nullable, optional on the wire, D-10; normalized form, D-09) | SuperAdmin |
| ITEM-27 | `dlv.selection` items `subjectId`, `documentVersionId` | staff |
| ITEM-28 | the delivery page's email list is newest first (100 sends; uncertain send outside the window still sets the boundary) | rendered in array order: no UI change |
| ITEM-12 | incident read serves the bounds the command accepts for required items and notices | staff |
| ITEM-11 | incident rows carry the current duty holder | staff |
| ITEM-24 | query `ops.originals` (originals register; 500 rows, `truncated`; never the item key) | operators, SuperAdmin (staff allowlist) |
| ITEM-25 A | `launchEffects` on `core.ta_application` (required; `test/unit/web/travel-recheck.test.ts:127` omits it behind a cast) | travel agent |
| ITEM-25 B | query `cat.admin_offering_impact_items` | SuperAdmin |
| ITEM-07 (1) | `offeringRevision` on `ops.launch_offering`; optional `expectedOfferingRevision` on approve and expand | staff |
| ITEM-07 (2) | the launch-plan form's missing-measure error path is now `measures.<code>` | staff |
| ITEM-19 | `gate1Context { assign, startOperatorWork }` on `core.admin_case` | SuperAdmin |
| ITEM-20 | `core.admin_queue` kind `first_work_gate1` with `firstWorkGate1`; required `asOf` and `truncated` on every kind. The kind unions in `src/apps/staff/attention.ts:13` and `src/apps/staff/core/admin.ts:183`; the navigation count reads `rows.length` and undercounts when `truncated` (adding this kind to the count runs its per-candidate reads on every staff page) | SuperAdmin |
| ITEM-21 | `recordedGateBasis` on `core.ops_case` and `core.admin_case` (operator copy without payment status) | operator, SuperAdmin |
| ITEM-22 | `acts[]` `future_owner_id`, `exhausted_by`, `exhausted_reason`, `exhausted_at`; `activeMarkCount` | operator, SuperAdmin |
| ITEM-16 | query `core.assignment_batch { operationKey }` | SuperAdmin |
| ITEM-18 | query `core.reassignment_preview { applicationId }`: present it as informational; the command re-checks at its own time | SuperAdmin |
| ITEM-17 | `commandName`, `acceptedAt` on the accepted `core.operation` answer | caller |
| ITEM-33 | `oneNameApplicant` nudge fact on the staff page | operator |
| ITEM-03 | `mark.filing` and `legacyMarks` on the case reads | staff |
| ITEM-32 (held) | `exceptionRecords` on `core.admin_case` (evidence, grantor, grant time, reason) | SuperAdmin with the live grant decision |

## 4. Not for the UI lane until Max decides

ITEM-30 Point H (the history line "Outcome corrected — From Issued to Refused"; Q-N3); ITEM-05 Point D (the "no
replacement owed" decision and its form; Q-1 to Q-3); ITEM-31 part (a) (price fixed by payment; Q1, Q2, Q4); ITEM-20
§11.1 substitution; ITEM-21 operator payment visibility.
