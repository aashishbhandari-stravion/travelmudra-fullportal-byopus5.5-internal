# Brief ITEM-03-A1: the possibly-filed guard on mark resolution, Core part (K2-P17-1 Part 1)

Role: Principal Software Engineer (implementation). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer in the product tree. Do not commit. Do not push. Do not edit
`internal/`, `src/apps/**`, `src/web/**`, `catalogue/synthetic/catalogue.json`, `scripts/uat/**`.

The design is decided; implement it exactly. Design source (read these lines only):
`../research/inputs/proposals/K2-P17-1-possibly-filed-guard.md` lines 54-133 (§0.2 to §0.4) and 231-244 (§1 Part 1).
Part 2 (§0.5, `core.record_restore_uncertainty`, reconstructed acts) is NOT built.

## Grants (orchestrator, 13 Oct 2026). Conditions: additive values only; no existing value, order or default changes

- `src/kernel/vocabulary/core.ts`: `export const PROTECTION_MARK_FILING_DETERMINATIONS = ['not_applicable', 'filed_on_record', 'protected_by_act', 'not_filed'] as const;` and its type.
- `src/kernel/vocabulary/reasons.ts`: APPEND `'protection_mark_determination_missing'` as the LAST value of `REASON_CODES`.
- `src/kernel/vocabulary/facts.ts`: APPEND `'core.protection_mark_disposition_recorded'` as the LAST value of the fact type list.
- `src/kernel/schema-sets.ts`: register the new closed-set CHECK columns (the schema test
  `test/integration/schema.test.ts` "every closed-set CHECK equals its closed set" requires it):
  `core_protection_marks.filing_determination` and `core_mark_dispositions.filing_determination` with
  `PROTECTION_MARK_FILING_DETERMINATIONS`; `core_protection_marks.filing_act_kind` and `core_mark_dispositions.filing_act_kind`
  with the two values `['government_submission', 'provider_handoff']` (typed against `ExternalActKind`; follow the file's style).
- Do NOT change `src/kernel/guard-constraints.ts` (it lists unique non-primary indexes only; this part adds none).

## 1. Migration `migrations/1170_core_mark_filing_determination.sql` (verify 1170 is the next free number)

Header comment in the style of `migrations/1010_core_price_order_and_work_gate.sql`. Contents:
- `core_protection_marks` gains `filing_determination text` (CHECK IN the four values), `filing_act_kind text` (CHECK IN the
  two act kinds), `filing_authorization_id text REFERENCES core_action_authorizations (authorization_id) ON DELETE RESTRICT ON UPDATE RESTRICT`.
- Named checks valid for every existing row: C1 `filing_determination IS NULL OR (possibly_filed AND state = 'resolved')`;
  C2 `(filing_determination IN ('filed_on_record', 'protected_by_act')) = (filing_authorization_id IS NOT NULL)`;
  C3 `(filing_determination = 'not_applicable') = (filing_act_kind IS NULL)`.
- C4 `NOT (state = 'resolved' AND possibly_filed AND filing_determination IS NULL) NOT VALID` (named; stays NOT VALID).
- Table `core_mark_dispositions`: `mark_id text PRIMARY KEY REFERENCES core_protection_marks (mark_id)`, `application_id`
  (FK as the marks table does), `filing_determination text NOT NULL` (same CHECK), `filing_act_kind text` (same CHECK),
  `filing_authorization_id text` (FK as above), `evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence) = 'array')`,
  `reason text NOT NULL CHECK (char_length(reason) BETWEEN 10 AND 1000)`, `recorded_by text NOT NULL REFERENCES iam_accounts (account_id) ...`,
  `recorded_at timestamptz NOT NULL`; C2 and C3 analogues; an immutability trigger that forbids every UPDATE (find the
  existing trigger function used for append-only tables: grep `forbid` in `migrations/0001_kernel.sql` and `0300_core.sql`);
  grants to the application role exactly as other Core tables have them (grep `GRANT` for `core_protection_marks`).
- The fact type CHECK widening: drop and add `sys_facts_fact_type_check` and `view_audit_index_fact_type_check` on the
  1010 pattern (`1010...sql` lines 55 and 102): the existing lists from 1010 unchanged plus the one new value. Nothing else on
  those tables.
- Find every other registry that lists Core tables (grep `core_protection_marks` in `src/` and `test/`: for example a
  table-owner list, backup or restore table lists, a schema test of table names) and add `core_mark_dispositions` where a
  test requires it. If such a registry is outside Core, the kernel files named above or `src/platform/`, stop and report.

## 2. Core logic (`src/modules/core/store.ts`)

- `filingKindOf(serviceMode)`: `travelmudra_filed` → `government_submission`; `third_party_filed` → `provider_handoff`;
  otherwise `null` (see how `src/modules/core/staff-views.ts:149` gets the mode from the offering).
- Pure `filingDetermination(kind, acts)` returning one of: `{ row: 1, determination: 'not_applicable' }`;
  `{ row: 2, determination: 'filed_on_record', authorizationId }`; `{ row: 3 }` (live permission);
  `{ row: 4, determination: 'protected_by_act', authorizationId }`; `{ row: 5 }` (needs not-filed evidence). Order: `kind`
  null → 1; else any act of `kind` `filed_evidenced` → 2; else any `authorized` → 3; else any `filing_unknown` or
  `reconciliation_exhausted` → 4; else 5. No time comparison (G4). Acts of other kinds are ignored (a filed fee act alone → 5).
- `zMarkRow` and the mark readers gain `filing_determination`, `filing_act_kind`, `filing_authorization_id`, `resolved_at`.
- `legacyMarksWithoutDisposition(tx, applicationId)`: marks with `state = 'resolved' AND possibly_filed AND
  filing_determination IS NULL` and no `core_mark_dispositions` row.
- Disposition insert and read helpers.

## 3. Commands (`src/modules/core/commands/admin.ts`, `src/modules/core/register.ts`)

Shared helper `determineFiling(deps, tx, app, mark, input)` used by both commands, applying G1 under the application lock:
- Mark without `possibly_filed` (G3, resolution only): `filing` present → `new TmError('validation_failed', 'input_invalid',
  { fieldErrors: [{ field: 'filing', code: 'not_applicable' }] })`; otherwise resolve exactly as today (columns stay NULL,
  fact `after` stays `{ state: 'resolved' }`).
- Row 1: `filing` present → the same `validation_failed` / field `filing` / `not_applicable`. Record `not_applicable`, kind NULL.
- Row 2 and row 4: `filing` present → `TmError('stale_revision', 'stale_revision')`. Record the determination, kind, act id.
- Row 3: `TmError('control_blocked', 'filing_possibly_occurred')`.
- Row 5: `filing` absent → `control_blocked` / `filing_possibly_occurred`; evidence without an `external_reference` or a
  `document_version` → `control_blocked` / `act_evidence_insufficient`. Record `not_filed`, kind `K`, act id NULL.
- Order of checks: lock, mark ownership (`not_found_or_forbidden`), mark state, then the table. A refusal writes nothing.

`core.resolve_protection_mark`: input gains `filing: z.literal('not_filed').optional()`. The UPDATE sets the three columns.
The fact `core.protection_mark_resolved` `after` gains `filingDetermination`, `filingActKind`, `filingAuthorizationId` for
marks with `possibly_filed` only.

New `core.record_mark_disposition` (SuperAdmin; `authorizeOn(..., 'protection_mark.resolve', ...)` as the resolution does;
`reasonRequired: true`; input `{ applicationId, markId, filing?: 'not_filed', evidence: zRequiredEvidence, reason }`):
lock; mark of the application else `not_found_or_forbidden`; an existing disposition → `TmError('conflict_duplicate',
'duplicate_operation')` (check how other Core commands raise a business duplicate and use that code); a mark that is not
legacy-ambiguous (active, or not `possibly_filed`, or with a determination) → `stale_revision`; then the G1 table
(rows 1 to 5, same refusals). Insert one disposition row (never update the mark row: L4); application `revision + 1`;
fact `core.protection_mark_disposition_recorded`, subject the mark, `after` `{ filingDetermination, filingActKind,
filingAuthorizationId }`, the evidence. Register the command where Core's command set is assembled.

## 4. Control (`src/modules/core/controls.ts`, stage 8, the `AUTHORIZE.includes(action)` branch)

If `legacyMarksWithoutDisposition` is non-empty: `c.blockers.push(tenet('protection_mark', 'protection_mark_determination_missing'))`
for the three authorizations. No other action changes. One short comment naming the owner decision OD-X5 (13 Oct 2026).

## 5. Unit test `test/unit/core-mark-filing.test.ts` (write it FIRST; it fails until `filingDetermination` exists)

`filingDetermination` over every row of G1; each mode via `filingKindOf`; each act state alone; `not_filed_evidenced`
only → row 5; a filed fee act with no submission → row 5; two acts (one `not_filed_evidenced`, one `filing_unknown`) → row 4.

## Checks

`npx tsc -p tsconfig.json --noEmit`; `npx eslint` on every changed file; with a short TMPDIR
(`export TMPDIR=/tmp/claude-1000/cr5; mkdir -p $TMPDIR`): `node --test --test-global-setup=test/support/global-setup.ts`
on `test/unit/core-mark-filing.test.ts`, `test/integration/schema.test.ts`, `test/unit/vocabulary.test.ts`,
`test/ops-tooling/restore-reopen.test.ts`, `test/core/invariants.test.ts`, `test/unit/frozen-interfaces.test.ts`.
`restore-reopen` resolves `possibly_filed` marks without `filing` today (T-15-68, T-15-78; helper `resolveMark` at about
`:266-274`): update ONLY that helper to pass `filing: 'not_filed'` with its existing evidence when the design requires it
(proposal test S2), nothing else in that file. A pinned-interface test that changes because of the new values MAY be
updated; name it in the return.

Rules: change only the files named here plus registries a test requires (report each). If your context approaches 100k
tokens, stop and return a partial result naming what remains.

## Return (at most about 300 words)

Files changed (one line each). Check results (pass/fail counts). Every deviation from this brief and why. Registries you
had to touch. Open points.
