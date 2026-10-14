# Brief ITEM-03-B1: composed product tests of the filing determination at mark resolution

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). Do not commit. Do not push. Do not stash, revert or stage anything.

You MUST create only `test/operations/protection-mark-filing.test.ts`. You MUST NOT change any other file. Other
engineers are writing `test/operations/work-acts.test.ts`, `test/operations/protection-mark-legacy.test.ts` and
`test/ops-tooling/restore-reopen.test.ts` at the same time: do not touch or run them.

Public-fit rule: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, "seam log") in code, comments or test
names. The case ids below (`F1`, `V1`) are allowed as test-name prefixes, as the repository's `T-15-68` style is. Synthetic
data only.

## Context: the change under test (uncommitted in the tree; read `git diff src/modules/core` for detail)

A protection mark records that a restore may have lost work on an application. `core.resolve_protection_mark` now
computes a filing determination when the mark holds `possibly_filed`, under the application lock, from the live act
records (`core_action_authorizations`) of the act kind that files for the offering's service mode
(`travelmudra_filed` → `government_submission`; `third_party_filed` → `provider_handoff`; otherwise none). Table
(`filingDetermination` in `src/modules/core/store.ts`; `determineFiling` in `src/modules/core/commands/admin.ts`):

| Row | Act records of the filing kind | Without `filing` | With `filing: 'not_filed'` |
|---|---|---|---|
| 1 | no filing kind (`preparation_only`) | records `not_applicable`, act kind NULL | `validation_failed` / `input_invalid`, field error `{ field: 'filing', code: 'not_applicable' }` |
| 2 | one is `filed_evidenced` | records `filed_on_record`, kind, that act's id | `stale_revision` |
| 3 | one is `authorized` | `control_blocked` / `filing_possibly_occurred` | same |
| 4 | one is `filing_unknown` or `reconciliation_exhausted` | records `protected_by_act`, kind, that act's id | `stale_revision` |
| 5 | otherwise (none, or only `not_filed_evidenced`) | `control_blocked` / `filing_possibly_occurred` | evidence needs an `external_reference` or a `document_version`, else `control_blocked` / `act_evidence_insufficient`; records `not_filed`, kind, act id NULL |

A mark without `possibly_filed` resolves exactly as before: the three new columns stay NULL, fact `after` is
`{ state: 'resolved' }`, and `filing` present is the `validation_failed` refusal. A resolved mark row carries
`filing_determination`, `filing_act_kind`, `filing_authorization_id`; the fact `core.protection_mark_resolved` `after`
carries `filingDetermination`, `filingActKind`, `filingAuthorizationId` for `possibly_filed` marks. Check C4
(`core_protection_marks_resolved_filing_determined`, migration `1170`) refuses any write that leaves a resolved
`possibly_filed` mark without a determination. The staff case read (`zWireStaffCase` in `src/contracts/core.ts`, filled by
`staffCase` in `src/core-api/bindings/core.ts`) now gives `mark` with `possibly_filed`, `possibly_paid`,
`possibly_released`, `restore_id`, `recorded_at` and `filing`: the preview `not_applicable` (row 1), `filed_on_record`
(2), `uncertainty_required` (3), `protected_by_act` (4), `determination_required` (5), or null when the mark does not hold
`possibly_filed`.

## Fixtures

- The Operations case-work kit `test/operations/kit.ts` (`startOpsKit`, `OFFERINGS`; every owner on its real port).
  `test/operations/work-acts.test.ts` shows how to reach an authorized act, record filed, record "execution uncertain",
  and add an offering with `Object.assign(OFFERINGS, …)` (read it; do not change it).
- Record a mark with Core's `recordProtectionMark(tx, { applicationId, restoreId, possiblyFiled, possiblyPaid,
  possiblyReleased })` (`src/modules/core/api.ts:125`) in a harness write transaction; see
  `test/integration/module-wiring.test.ts:218` for a working call and how a `restoreId` is made.
- Faults: `command.lose_ack`, `command.before_commit` (`src/kernel/faults.ts`); grep `lose_ack` in `test/` for how a
  test arms one.
- A `reconciliation_exhausted` act: reach it through the product commands if the kit makes that short; otherwise set the
  act state with one SQL `UPDATE` in a harness transaction and say so in a comment and in your return.

## Constraint for the failing-first proof (MUST)

The file MUST NOT import any symbol that this change added to `src/` (for example `filingDetermination`, `filingKindOf`,
`markFilingPreview`, `PROTECTION_MARK_FILING_DETERMINATIONS`). Use commands, the wire read and plain SQL. The F1 test MUST
reach its refusal assertion before it reads any new column, and the file's shared setup (`before`, helpers that run for
every test) MUST NOT read the new columns. The parent will run F1 against the source without this change and expects it
to fail at the refusal assertion.

## Tests (each test name starts with its case id, then a plain sentence: `F1: a possibly filed mark …`)

| ID | Case | Expected |
|---|---|---|
| F1 | Submitted, assigned, ready, no act; mark with all three flags; resolve without `filing` | `filing_possibly_occurred`; mark still active; authorization of the submission still refused with `protection_mark_active`; no new fact; no operation record for the key |
| F2 | Resolve with `filing: 'not_filed'` and an external reference | accepted; columns `not_filed`, `government_submission`, NULL; the fact `after` carries them; then the submission authorization is accepted |
| F3 | `not_filed` with evidence of another kind only (an attestation or a note: use a kind `zRequiredEvidence` accepts) | `act_evidence_insufficient`; nothing written |
| F4 | A filed act; resolve without `filing`, and (separate application) with `filing` | `filed_on_record` with that act id / `stale_revision`; then a new submission authorization is refused with `parked_repeat_external_act` |
| F5 | An `authorized` act when the mark is recorded; resolve | `filing_possibly_occurred` (row 3), with and without `filing` |
| F6 | The operator records "execution uncertain" (`filing_unknown`); resolve | `protected_by_act` with that act id; authorization refused with `act_already_open` |
| F7 | A `reconciliation_exhausted` act | `protected_by_act`; authorization refused with `reconciliation_exhausted_no_refiling` |
| F8 | `preparation_only` offering | `not_applicable`, act kind NULL; with `filing` → `validation_failed` with the field error |
| F9 | Marks with flags (filed, paid, released) = (F,T,T), (F,F,T), (F,F,F) | resolve with any accepted evidence kind as before; fact `after` exactly `{ state: 'resolved' }`; three columns NULL; `filing` present → `validation_failed` |
| F10 | Two marks on one application (two restores) | each needs its own determination; resolving one leaves the other active |
| F11 | Operation keys: the same key and body again; the same key with another `filing`; a new key | replay of the first result; `conflict_operation_key`; `stale_revision` |
| F12 | `command.lose_ack` armed, resolve, then the same key | `outcome_unknown`, then replay; exactly one resolution fact |
| F13 | `command.before_commit` throws during a resolution | mark active, three columns NULL, no fact, no operation record |
| F14 | A direct SQL `UPDATE` that resolves a `possibly_filed` mark and leaves the determination NULL | refused by check `core_protection_marks_resolved_filing_determined` (SQLSTATE 23514) |
| F15 | `third_party_filed` offering with a filed provider handoff | `filed_on_record`, `provider_handoff`; a second handoff authorization refused |
| F16 | A Gate 1 or Gate 2 exception granted before the mark | still `granted` after the resolution |
| V1 | The staff case read (through the core-api binding, so `zWireStaffCase` parses it) | no mark → `mark: null`, `legacyMarks: []`; a mark → its flags, `restore_id`, `recorded_at`; `filing` per row: 1 (F8 state), 2 (F4), 3 (F5), 4 (F6), 5 (F1); a mark without `possibly_filed` → `filing: null` |

"Nothing written" means: no `sys_operations` row for the refused key, no new `sys_facts` row, the mark row unchanged.
Use the operation-key and fact queries the existing tests use. Name the refusal codes in the assertions.

## Checks

`export TMPDIR=/tmp/claude-1000/cr8; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts
test/operations/protection-mark-filing.test.ts`. The file MUST be green as a whole. `npx eslint
test/operations/protection-mark-filing.test.ts` clean.

A case the product refuses differently from the table above is a finding: do not change the expectation to make it
pass; stop that case, mark it `todo` with the observed result, and report it.

If your context approaches 100k tokens, stop and return what you have, naming what remains.

## Return (at most about 300 words)

Pass/fail counts; each case built or not, and why; every observed refusal that differs from the table; fixture shortcuts
(SQL state changes); assumptions.
