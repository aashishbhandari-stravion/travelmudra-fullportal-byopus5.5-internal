# Brief ITEM-33: an applicant with one name; a code for a missing identity value

Role: Principal Software Engineer (implementation and tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer. Do not commit, push, stash or stage.

MUST NOT edit: `internal/`, `src/apps/**`, `src/web/**`, `src/modules/intake/**`, `src/modules/documents/**`,
`catalogue/synthetic/catalogue.json`, `scripts/uat/**`. If a needed change sits there, stop that part and report it.
Public-fit rule: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`) in code, comments, test names.
Write "owner decision of 13 October 2026" where a comment needs the source.

## Decisions (owner decision of 13 October 2026, and grants)

- A real passport can carry one name. Core keeps a draft when the surname OR the given names is present (at least one)
  and the date of birth is present. No block, no confirmation step.
- The missing name is stored as an empty string `''`, never as an absent key (the wire keeps the key; SQL `->>` stays
  non-null; the duplicate check and the name tokeniser keep working).
- The spreadsheet path refuses a row with both names empty, or with no date of birth, with the new code
  `applicant_identity_missing` (today it gives the format code `name_invalid` / `date_invalid`). A malformed value keeps its
  format code.
- The operator gets a non-blocking hint: a read on the operator's case read, not a block.
- Grants (orchestrator, 13 Oct 2026), additive only, no existing value, order or default changes:
  1. `src/kernel/vocabulary/reasons.ts`: append `'applicant_identity_missing'` as the LAST value of `REASON_CODES`.
  2. `src/kernel/vocabulary/intake.ts`: append `'applicant_identity_missing'` as the LAST value of `INTAKE_CODES`.
  3. NEW `migrations/1180_intake_applicant_identity_missing.sql` on the pattern of
     `migrations/1080_intake_provider_response_codes.sql`: drop and re-add the five intake code CHECKs with exactly
     that one value added, nothing else on those tables. Header comment in the style of 1080.
  4. `src/domain/module-ports.ts` `coreApplicantOf` (about `:179-200`): the missing-value rule below. The malformed path
     (`applicantRefusal` over parse errors, about `:196`) stays unchanged.

## Survey already done (verified from source; do not repeat it)

| Place | Change |
|---|---|
| `src/modules/core/model.ts:22,35-36` `zName` (`trim().min(1)`) on both names | A name part allows `''` after trim (max 100, no control characters); `zApplicantIdentity` refuses when BOTH are empty, with field errors on `identity.surname` and `identity.givenNames` using the same code `zName` gives today for an empty value (read `parseApplicantData` for how codes are mapped). |
| `src/modules/core/corrections.ts:195` `mergeChanges`; `src/modules/core/commands/drafts.ts:318-330` `applyPaths`; `commands/admin.ts:81` `zIdentityChanges` | Today `''` in an identity change means "remove this optional key". For `surname` and `givenNames` only, `''` MUST set the value to `''` (the model refuses clearing both). Other fields unchanged. |
| `src/modules/core/model.ts:99,106` (field comparison with `?? null`) | Keep one representation (`''`) so no phantom identity change appears. |
| `src/modules/core/intake-writers.ts:168` | A `null` name from intake maps to `''`. |
| `src/domain/module-ports.ts:181` | `missing` = both names null or `''`, or the date of birth null or `''` → `{ ok: false, code: 'applicant_identity_missing' }`. One null name → `''`. |
| Display: `src/modules/core/staff-views.ts:270-272` (`personName`), `src/core-api/bindings/core.ts:137-139`, `src/core-api/registry.ts:91`, `src/domain/module-ports.ts:146` | Join only the non-empty parts: "Surname, Given names" when both; the one name alone otherwise; no leading or trailing comma or space. "No snapshot" stays detected by NULL, not by `''`. |
| `src/modules/core/writers.ts:112,119`, `src/modules/operations/case-work/association.ts:114` | Safe with `''` (no change). |
| `src/modules/core/corrections.ts:53,65,95` (same-person evidence needs 2 kept distinguishing fields) | No change: a one-name applicant has fewer fields, so the rule is stricter, not weaker. |

## The hint (Kind 1 read)

`zWireStaffCase` (`src/contracts/core.ts`) gains `oneNameApplicant: z.boolean()`: true when the current snapshot has
exactly one empty name. Fill it in `src/modules/core/staff-views.ts` and `src/core-api/bindings/core.ts`. One comment above
the computation: intent (a person checks that the passport really carries one name, not a reading error), source facts
(the current applicant snapshot), consumers (the operator and SuperAdmin case pages), date 13 October 2026. Add one line to
`docs/verification/read-model-register.md`.

If `test/static/refusal-playbook.test.ts` requires an entry for the new code, add it to `docs/playbooks/refusal-codes.md`
in the file's format: the travel agent acts; enter the surname or the given names, and the date of birth, as the passport
shows them. Pinned-interface tests (`test/unit/frozen-interfaces.test.ts`, `test/unit/vocabulary.test.ts`,
`test/unit/contracts.test.ts`, intake code-set tests) MAY be updated for the new values only; name each.

## Tests (write first; each fails before the change, except the unchanged-behaviour ones)

Put Core cases in the existing test files that already cover the same path (grep `parseApplicantData`,
`acceptIntakeProposals`, `name_invalid`, `start_individual` in `test/`); new files only if none fits.

1. Model: surname only, and given names only, are accepted (stored `''`); both empty (and both whitespace) refused with
   field errors on both names; two names unchanged; control characters still refused.
2. Spreadsheet path through the composed intake (the code reaches `intake_row_services.code`): both names empty and no
   passport zone → `applicant_identity_missing`; no date of birth → `applicant_identity_missing`; one name empty → the draft
   is created and its snapshot holds `''`; a malformed date → `date_invalid` (unchanged).
3. One-applicant form path (`intake.start_individual` or its current name): one name empty → the draft is created.
4. Identity correction: set the given names to `''` while the surname stays → accepted under the existing evidence rule;
   an edit that empties both → refused.
5. Display: the staff case read and the application list show the single name alone, for a surname-only and a
   given-names-only applicant.
6. Hint: `oneNameApplicant` is true for a one-name applicant and false for a two-name applicant, through the core-api
   binding so `zWireStaffCase` parses it.
7. Schema: `test/integration/schema.test.ts` passes with migration 1180 (the CHECKs equal `INTAKE_CODES`).

## Checks

`npx tsc -p tsconfig.json --noEmit`; `npx eslint` on every changed file; with `export TMPDIR=/tmp/claude-1000/cr14;
mkdir -p $TMPDIR`: `node --test --test-global-setup=test/support/global-setup.ts` on every test file you changed or added,
plus `test/integration/schema.test.ts`, `test/unit/vocabulary.test.ts`, `test/unit/frozen-interfaces.test.ts`,
`test/static/refusal-playbook.test.ts`, and `test/intake/*.test.ts`. Do not run `npm run check` (the parent runs it).

A case the product handles differently from this brief is a finding: report it; do not bend the expectation.
If your context approaches 100k tokens, stop and return what is built and green, naming what remains.

## Return (at most about 300 words)

Files changed (one line each); which tests failed before the change (name them); check results (pass/fail counts); every
deviation and why; open points (including anything found in a file you MUST NOT edit).
