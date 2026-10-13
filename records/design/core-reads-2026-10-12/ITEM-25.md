# ITEM-25 P-19 (3): current impact items of an offering; launch effect per existing action on the TA's case read

Kind 1 reads. Wave 2, worker W8 (Opus, worktree `wave2-impact`; about 250k context for both parts). One commit and one
Codex review per part:

| Part | Commit | From (worker) | Parent |
|---|---|---|---|
| A: launch effect per existing action on the TA's case read | `6b9b87d` | `e864a6f` | `10916cc` |
| B: the SuperAdmin's current impact items of an offering | `96bcf5d` | `1c5d365`, amended at integration | `6b9b87d` |

Grants (orchestrator, 13 Oct 2026): A, prompt scope (`src/modules/core/derived.ts`, `src/contracts/core.ts`,
`src/core-api/bindings/core.ts`, `test/core/launch.test.ts`, `docs/verification/read-model-register.md`); B,
`src/modules/catalogue/read-models.ts`, `src/modules/catalogue/api.ts`, `src/contracts/catalogue.ts`,
`src/core-api/bindings/catalogue-admin.ts`, `src/core-api/allowlists.ts`, `test/core/offering-impact-items.test.ts`,
`docs/verification/read-model-register.md`, and prompt scope `src/modules/core/staff-views.ts`.

## Reads and changes

A. The travel agent's case read now carries `launchEffects`: for each existing-work action of the application's
lifecycle (and, when submitted, of its service mode), the effect and the reason codes launch control gives. Core
computes it (`launchEffectsOf` in `derived.ts`) with the application's admitted launch and lifecycle, exactly as the
control evaluator's launch stage does. Only the effect and the codes are served; a support view reads the same field. A
completed or ended application has none. Required field on the wire (additive within a matched release). Kind 1 record:
a line in `docs/verification/read-model-register.md`.

B. A new SuperAdmin query `cat.admin_offering_impact_items` lists the offering's current impact items across all its
assessments, with assessment number and state, applicability, classification, treatment, continuation kind, hold owner
and decision facts. Core's `impactItemCases` adds, by impact item id, the state of the structural transition Core holds,
the applicant's name and the owning travel agent; account names come through the identity port. Latest assessment
first, then by application; at most 500 rows, with a truncated flag. Authorized with `catalogue.read_admin` on the
offering (a SuperAdmin session; travel agents, operators and support views are refused); staff allowlist only. Additive
contract change. Kind 1 record: a line in the read-model register.

Integration note (B): the worker's test approved a transition for work submitted before the second publication. After
ITEM-10 (c) the approval targets the head the item's assessment reviewed, so that approval was refused with
`impact_item_not_current`. The test was reordered at integration (the work is submitted between the publications and
approved while the head is the one its assessment reviewed) and the commit amended; an untested claim was removed from
its message.

## Tests

A: `test/core/launch.test.ts`: a launched offering gives `allow` for every action of a draft and of a submitted
application; a holding suspension gives `hold` with `existing_work_hold`; each entry equals the launch stage of
`evaluateControls` for that action. Failed first: `evidence/ITEM-25-A-fails-first.txt`.

B: `test/core/offering-impact-items.test.ts` (real Core and catalogue): two publications give a draft and newly submitted
work current items in the later assessment and a held item carried in the earlier one; the read lists the three with
their assessment, treatment, decision facts, transition state, applicant names and the travel agent's name; a limit of
two gives two rows and the truncated flag; a travel agent and an operator are refused. Failed first:
`evidence/ITEM-25-B-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass per part (`reviews/ITEM-25-A-review.md`, `reviews/ITEM-25-B-review.md`).
Both verdicts: sound as written. All findings P2, parked:

- A R-01: no withdrawal, other service mode or terminal lifecycle comparisons.
- A R-02: every open-case read adds five to seven sequential launch decisions (about 16 to 43 queries); latency
  unmeasured.
- A R-03: the UI fixture `test/unit/web/travel-recheck.test.ts:127` omits the required field behind a cast (UI lane
  item in the package message).
- B R-01: `accountNames` reads accounts one at a time (up to 4 + U queries at 500 rows).
- B R-02: the test calls the binding directly and checks the cap at a helper limit of two, not 500 and 501.

## Checks

`npm run check` at `6b9b87d` (A) and at `96bcf5d` (B), each in a detached checkout: typecheck and lint clean;
2607 of 2607 and 2608 of 2608 tests pass.
