# Brief ITEM-03-B2: tests of marks resolved before the filing determination existed (legacy marks)

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). Do not commit. Do not push. Do not stash, revert or stage anything.

You MAY create `test/operations/protection-mark-legacy.test.ts` and add tests to `test/ops-tooling/restore-reopen.test.ts`
(new `describe` blocks or `it`s only; do not change its existing tests or its `resolveMark` helper). You MUST NOT change
any other file. Other engineers are writing `test/operations/work-acts.test.ts` and
`test/operations/protection-mark-filing.test.ts` at the same time: do not touch or run them.

Public-fit rule: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, "seam log") in code, comments or test
names. The case ids below (`L1`, `S3`) are allowed as test-name prefixes, as the repository's `T-15-68` style is.
Synthetic data only.

## Context: the change under test (uncommitted; read `git diff src/modules/core` and `migrations/1170_core_mark_filing_determination.sql`)

`core.resolve_protection_mark` now records a filing determination for a mark that holds `possibly_filed` (columns
`filing_determination`, `filing_act_kind`, `filing_authorization_id` on `core_protection_marks`). A mark that an earlier
release resolved while it held `possibly_filed` has no determination: a **legacy mark** (`state = 'resolved' AND
possibly_filed AND filing_determination IS NULL`). Migration `1170` adds check C4
`core_protection_marks_resolved_filing_determined` as `NOT VALID`: legacy rows stay, a new violating write is refused.

- While an application has a legacy mark without a disposition, the three authorizations (`authorize_government_submission`,
  `authorize_government_fee_payment`, `authorize_provider_handoff`; check the exact action names in
  `src/modules/core/controls.ts`) are refused with the blocker `protection_mark_determination_missing` (stage 8).
- New SuperAdmin command `core.record_mark_disposition` (`src/modules/core/commands/admin.ts`), input `{ applicationId,
  markId, filing?: 'not_filed', evidence, reason }`, policy action `protection_mark.resolve`. Order: lock; mark of the
  application else `not_found_or_forbidden`; an existing disposition → `conflict_duplicate` / `duplicate_operation`; a mark
  that is not legacy (active, no `possibly_filed`, or with a determination) → `stale_revision`; then the same table as the
  resolution (row 1 `not_applicable`; row 2 `filed_on_record`; row 3 `filing_possibly_occurred`; row 4
  `protected_by_act`; row 5 needs `filing: 'not_filed'` with an `external_reference` or a `document_version`, else
  `filing_possibly_occurred` / `act_evidence_insufficient`). It inserts one row in `core_mark_dispositions` (append-only:
  trigger `tm_append_only` refuses UPDATE, DELETE, TRUNCATE), never updates the mark row, raises the application revision
  by one, and appends the fact `core.protection_mark_disposition_recorded` (`after`: `filingDetermination`,
  `filingActKind`, `filingAuthorizationId`).
- The staff case read (`zWireStaffCase`, `src/contracts/core.ts`; `staffCase` in `src/core-api/bindings/core.ts`) gives
  `legacyMarks`: `{ mark_id, restore_id, resolved_at, filing }` per legacy mark without a disposition (preview: row 5 →
  `determination_required`).

## The fixture `legacyResolved`: a mark resolved as the earlier release wrote it

The earlier release's resolution set `state = 'resolved'`, `resolved_by`, `resolved_at`, `resolution_reason`, `evidence`,
`revision + 1`, raised the application revision, and appended `core.protection_mark_resolved` with `after: { state:
'resolved' }`. Preferred way to write it: migrate a fresh database to `1160` (copy of the migrations up to and including
the file before `1170`; see `treeWith`, `migrate` and `useTestDatabase` in `test/ops-tooling/migrate-to-target.test.ts`),
write the application, the mark and its resolution with SQL as above, then migrate with the full tree. If the composed
kit cannot run on a database you migrate yourself, fall back: on the migrated database, in one harness transaction, drop
C4, write the resolved mark, and re-add C4 `NOT VALID` with the exact text of `1170`. Say which way you used.

## Tests (each test name starts with its case id, then a plain sentence)

In `test/operations/protection-mark-legacy.test.ts` (the Operations kit `test/operations/kit.ts`; `work-acts.test.ts`
shows how to reach an authorizable application; read it, do not change it):

| ID | Case | Expected |
|---|---|---|
| L1 | Migration `1170` over a database holding `legacyResolved` | migration succeeds; the row is unchanged (resolver, time, reason, evidence; NULL determination); C4 exists with `convalidated = false` (`pg_constraint`) |
| L2 | Authorization of the submission and of the fee act on that application | refused with `protection_mark_determination_missing`; nothing written (no authorization row, no operation record for the key, no new fact) |
| L3 | `core.record_mark_disposition` with `filing: 'not_filed'` and an external reference (SuperAdmin) | accepted; one disposition row with `not_filed`, `government_submission`, NULL act; the mark row byte-for-byte unchanged; application revision + 1; the fact with its `after`; then the authorization is accepted |
| L4 | Refusals: a disposition without `filing` and no protective act; a second disposition after L3's; a disposition on an active mark and on a mark without `possibly_filed`; an operator (not SuperAdmin) actor; UPDATE and DELETE of a disposition row by SQL | `filing_possibly_occurred`; `conflict_duplicate`; `stale_revision`; the policy refusal the product gives (name it); the append-only error |
| L6 | The earlier release's resolution operation resent with its key (write its `sys_operations` record as the earlier release did, with the kernel's own request-hash helper) | replay of the stored result; no determination written; L2 still applies. If this fixture needs more than about 40 lines, do not build L6; report why |
| V2 | The staff case read (through the core-api binding) | `legacyMarks` lists the legacy mark with `filing: 'determination_required'`; after L3's disposition, `legacyMarks` is empty |

In `test/ops-tooling/restore-reopen.test.ts` (or `test/ops-tooling/backup-restore.test.ts` if the backup fixture lives
there; say which):

| ID | Case | Expected |
|---|---|---|
| S3 | Backup and restore of a database holding `legacyResolved` | the restore succeeds; C4 present and not validated; the legacy row unchanged; a new violating write refused |
| S6 | A backup taken before `1170` holding a mark resolved by the earlier rule, restored, then migrated to the head | the mark is legacy; an authorization is refused with `protection_mark_determination_missing` |

S6 in the proposal uses the previous release's tree. If the harness cannot run an earlier tree, build the nearest
equivalent (a backup at schema `1160` holding the legacy row; restore; migrate to head; the L2 assertion) and say so. If
S6 needs new harness code outside the test files, do not build it; report why.

## Checks

`export TMPDIR=/tmp/claude-1000/cr9; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts
test/operations/protection-mark-legacy.test.ts test/ops-tooling/restore-reopen.test.ts`. Both files MUST be green as a
whole. `npx eslint` on both files clean.

A case the product refuses differently from the tables is a finding: do not change the expectation to make it pass;
stop that case, mark it `todo` with the observed result, and report it.

If your context approaches 100k tokens, stop and return what you have, naming what remains.

## Return (at most about 300 words)

Pass/fail counts per file; each case built or not, and why; the fixture way used; every observed refusal that differs
from the tables; assumptions.
