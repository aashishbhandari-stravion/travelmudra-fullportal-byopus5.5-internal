# ITEM-33 OD-X18: an applicant whose passport carries one name; a code for a missing identity value (grant P-K1f)

Owner decision of 13 Oct 2026 (OD-X18), model change. Commit: `b26d2a5` (parent `6ad592e`). Worked after ITEM-03 and
before ITEM-04, as the orchestrator placed it.

## 1. Decisions and grants

| Item | Source |
|---|---|
| Core keeps an applicant with the surname OR the given names (at least one) plus the date of birth; no block, no confirmation step; the missing name is stored as `''`, never as an absent key | OD-X18, Max, 13 Oct 2026 |
| A non-blocking hint for the operator: a read on the staff case read, not a block | OD-X18 |
| `applicant_identity_missing` appended last to `REASON_CODES` | Grant P-K1f (orchestrator, 13 Oct 2026) |
| `applicant_identity_missing` appended last to `INTAKE_CODES`; migration `1180` widens the five intake code CHECKs by that one value (1080 pattern), nothing else | Orchestrator grant, 13 Oct 2026 (one commit naming the grant; `npm run check` green; intake code-set tests in the same commit) |
| The UI text of the code in `src/apps/shared/pages/intake.ts` | Orchestrator-owned: the placement goes in the package message |

## 2. Failing tests first

The worker (Sonnet) wrote the tests first and re-ran them on the source with the change reverted: 19 tests failed
(model, spreadsheet rows, the one-applicant form, identity corrections, displays, the hint). The Codex reviewer
re-ran the 11 new unit tests on the parent: 8 failed.

## 3. Change

- `src/modules/core/model.ts`: `zName` allows `''` after trim (max 100, no control characters); the identity refuses
  both names empty with `too_small` on `surname` and on `givenNames`.
- `src/modules/core/corrections.ts` `mergeChanges`: `''` sets `surname` or `givenNames` to `''`; for any other field it
  still removes the key.
- `src/modules/core/intake-writers.ts`: a null name from intake becomes `''`.
- `src/domain/module-ports.ts` `coreApplicantOf`: both names blank, or no date of birth, refuses with
  `applicant_identity_missing`; one blank name is kept as `''`; malformed values keep their format codes.
- Displays (`staff-views.ts` `personName`, `core-api/bindings/core.ts`, `core-api/registry.ts`, the payments title in
  `module-ports.ts`) join only the non-empty parts.
- Kind 1 read: `oneNameApplicant` on `zWireStaffCase` (true when the current snapshot has exactly one empty name);
  dated comment; register line in `docs/verification/read-model-register.md`.
- Kernel: both values appended last; migration `1180_intake_applicant_identity_missing.sql`.
- `test/ops-tooling/mark-filing-migration.test.ts` (ITEM-03 L1): the migration under test applies first and any later
  migration of the tree follows it (1180 now follows 1170).

Observed product behaviour (recorded, not changed): on the one-applicant form a missing date of birth gives
`control_blocked/applicant_identity_missing`; both names empty there still give `validation_failed/name_invalid` from
intake's own check (intake is not a lane-owned module). A malformed date fails the row with `date_invalid`.

## 4. Tests

| File | Cases |
|---|---|
| `test/unit/applicant-names.test.ts` (new) | Model: one name each way, two names unchanged, both empty and both white space refused with a field error on each, an absent name key refused, control characters and length; identity change: one name to `''`, both emptied refused, a one-name applicant gains the missing name, an optional field still removed by `''`, no change for an unchanged empty name; display join; "no snapshot" detected by a null surname |
| `test/core/groups-drafts.test.ts` | Draft with one name each way; neither name refused by Core's intake acceptance writer, nothing created; the given names corrected to `''` under the same-person evidence rule; a null name of an intake correction read as `''`; the one name alone in the group end status, the assignment plan, the travel agent's group list and the payment record title; `oneNameApplicant` true and false through the binding, parsed by the wire contract |
| `test/intake/bulk-rows.test.ts` | Spreadsheet rows: both names empty and no passport zone, and no birth date → `applicant_identity_missing`; one name empty → draft with `''`; a malformed birth date keeps `date_invalid` |
| `test/intake/individual.test.ts` | One-applicant form: one name → draft with `''`; neither name refused |
| `test/integration/module-wiring.test.ts` | The port's refusal code for a missing identity value |

## 5. Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one review of `b26d2a5`: lane `research/reviews/ITEM-33-review.md`. Verdict "sound
with the fixes above". The reviewer confirmed: Core's writers keep both name keys, trim whitespace and refuse both
empty; no phantom change for an unchanged empty name; the duplicate check, the document name-token comparison, the
same-person evidence and the wire contracts handle `''`; migration 1180 keeps every earlier code and changes the schema
head, so code rollback is refused.

| Finding | Rank | Disposition |
|---|---|---|
| R-01 The browser forms still require both names (`src/apps/shared/pages/intake.ts:340`, `src/apps/shared/core/ta.ts:485-486`, `src/apps/staff/core/case.ts:397-398`): a one-name applicant cannot be entered on the form or in an identity correction | P1 | WITH MAX. UI-lane files. Recommended: the UI lane drops `required` from both name inputs; Core keeps the at-least-one rule. Package message |
| R-02 The identity-correction route handlers drop every empty value (`src/apps/edge/core/routes.ts:103`, `src/apps/staff/core/case.ts:416`), so a name cannot be cleared | P1 | WITH MAX. UI-lane files (already in the UI list as "correction forms treat a blank as no change"). Recommended: send `''` for a name the person cleared; omit untouched fields |
| R-03 Manual passport-zone resolution refuses an empty surname (`src/modules/documents/commands/resolve-extraction.ts:35`, form `src/apps/shared/pages/documents.ts:286`) | P1 | WITH MAX. Not a lane-owned module. Architect's position: ICAO 9303 puts a single name in the primary identifier (the surname field of the zone), so a conforming zone always has a surname; the case arises only for a state that writes the single name as a secondary identifier. Recommended: park as P2 unless Max knows such passports in the market; otherwise the owning lane allows either name and refuses both empty |
| R-04 Browser name displays keep stray punctuation (`shared.ts:585`, `ta.ts:376`, `ta-documents.ts:69`) | P2 | Parked; already in the UI list |
| R-05 `applicant_identity_missing` has no explanation text; the row's aggregate code (`intake_rows.state_code`) is null, the code is in `intake_row_services` | P2 | Parked; the text is in the package message (orchestrator-owned file); the row aggregate is intake's (bulk lane note) |

## 6. Parked notes (P2)

| Note | Why parked |
|---|---|
| A snapshot holding `''` cannot be read by the previous release | Migration 1180 changes the schema head; code rollback to the previous release is refused; snapshot rollback is limited to the unopened cutover |
| `src/modules/intake/rows.ts:36` reads the passport zone names only when both row names are empty | Intake (bulk lane) note for the package message |

## 7. For the UI lane and the orchestrator (package message)

The sentence for `applicant_identity_missing` in `src/apps/shared/pages/intake.ts` (orchestrator-owned): "A required
passport value is missing: surname, given names or date of birth."; R-01, R-02 and R-04 above; the staff page shows
`oneNameApplicant`.

## 8. Checks

- `npm run check` on the tree committed as `b26d2a5`: 2562 of 2562 pass (the first run gave 2561 of 2562: L1 of ITEM-03
  expected 1170 to be the last migration; fixed in the same commit).
