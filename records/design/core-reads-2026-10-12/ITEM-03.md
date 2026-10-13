# ITEM-03 P-17 (1) Part 1: a possibly filed mark could be resolved without a filing determination (K2-P17-1)

Commit ids in this record are those before the reword of 13 Oct 2026; the map old → new is in `PLAN.md` §7.

Kind 2, P0 (register OD-X5). Proposal `K2-P17-1-possibly-filed-guard.md` (frozen in the lane `research/inputs/`, hash in
`MANIFEST.sha256`) and its review. Part 1 only (1a, 1b and the Part 1 reads of §0.7). Part 2 (§0.5, §0.6,
`core.record_restore_uncertainty`, reconstructed acts, `reconstructedActs`) is not built (OD-X14). Commit: `d2067af` (parent `e41d64f`).

## 1. Grants and decisions

| Item | Source |
|---|---|
| Kernel values `PROTECTION_MARK_FILING_DETERMINATIONS`, reason `protection_mark_determination_missing` (appended last), fact type `core.protection_mark_disposition_recorded` (appended last); four closed-set registrations in `src/kernel/schema-sets.ts` | Orchestrator grant, 13 Oct 2026 (additive values only; commit body names it; `npm run check` green) |
| Migration `1170` with the `fact_type` CHECK widening of `sys_facts` and `view_audit_index` on the 1010 pattern | Orchestrator grant, 13 Oct 2026 |
| `src/platform/restore-scope.ts` items 4 and 7, text only | Orchestrator grant, 13 Oct 2026 |
| `src/kernel/guard-constraints.ts` unchanged | It lists unique non-primary indexes only; this part adds none (`core_mark_dispositions` has its primary key only) |
| The refusal of `filing` on a row 1 mark or a mark without `possibly_filed` | `validation_failed` / `input_invalid` with field error `{ field: 'filing', code: 'not_applicable' }`: no reason code `not_applicable` exists, and the grant adds none |
| Walk-through | Max chose option C on 13 Oct 2026 (OD-X17, D-04): a test transcript now; the `uat.py` restore drill later as its own item, after the Core package is integrated and the UI renders the `filing` field |

## 2. Failing tests first

| Test | Before the change |
|---|---|
| `test/unit/core-mark-filing.test.ts` | Written first: fails until `filingDetermination` and `filingKindOf` exist |
| F1 `test/operations/protection-mark-filing.test.ts` | At `e41d64f` (source without the change, test file copied in) the resolution of a possibly filed mark with no act and no filing statement was `accepted` (expected `rejected`). Architect's own run: `evidence/ITEM-03-F1-fails-at-e41d64f.txt` (beside this record) |

## 3. Change

- `core.resolve_protection_mark` (`src/modules/core/commands/admin.ts`, `determineFiling`): under the application lock,
  for a mark that holds `possibly_filed`, the determination from the live act records of the filing kind of the service
  mode (`filingKindOf`, `filingDetermination` in `store.ts`): row 1 `not_applicable`; row 2 `filed_on_record`; row 3
  refused `filing_possibly_occurred` while an act is `authorized`; row 4 `protected_by_act`; row 5 only
  `filing: 'not_filed'` with an `external_reference` or a `document_version` records `not_filed`. Order: ownership,
  state, table. Marks without `possibly_filed` unchanged (G3). The fact `after` carries the determination for
  `possibly_filed` marks only.
- Migration `1170`: three columns with checks C1 to C3 (C2 and C3 written strict for a NULL determination, `COALESCE`
  form: stronger than the design and valid for every existing row, L1); C4 `NOT VALID`; `core_mark_dispositions`
  (`tm_append_only` for UPDATE, DELETE, TRUNCATE; SELECT and INSERT to `tm_app`).
- `core.record_mark_disposition` (SuperAdmin, `protection_mark.resolve`): one immutable disposition row per legacy mark;
  the mark row is never changed (L4 of the design); application revision + 1; the new fact.
- `controls.ts` stage 8: the three authorizations wait while a legacy mark has no disposition
  (`protection_mark_determination_missing`).
- Wire and reads (Kind 1, register line in `docs/verification/read-model-register.md`): `filing` on the resolution input;
  the new command (contracts, binding, allowlist); the staff case read's mark gains its flags, `restore_id`,
  `recorded_at` and the `filing` preview; `legacyMarks` (at most 16).
- Text: restore procedure items 4 and 7; refusal playbook row for `protection_mark_determination_missing`.

## 4. Tests

| Cases | File | Result |
|---|---|---|
| Unit table: every row, each mode, each act state, `not_filed_evidenced` only, fee act only, mixed acts | `test/unit/core-mark-filing.test.ts` | pass (in `npm run check`) |
| F1 to F16, V1 (staff case read through the core-api binding, every preview row) | `test/operations/protection-mark-filing.test.ts` | 17/17 |
| L2, L3, L4 (with attestation-only evidence, a mark resolved with a determination, TRUNCATE), L6, V2 | `test/operations/protection-mark-legacy.test.ts` | 9/9 |
| L1 (migration over a database at `1160` holding a legacy row; rows not rewritten (`xmin`); C4 not validated; `VALIDATE` fails; a second migrate applies nothing) | `test/ops-tooling/mark-filing-migration.test.ts` | 5/5 |
| S2 (helper passes `filing: 'not_filed'`), S3 (backup and restore keep the legacy row and C4 `NOT VALID`; a new violating write refused) | `test/ops-tooling/restore-reopen.test.ts` | 9/9 |

Deviations and observations:

- F7: the product reaches `reconciliation_exhausted` only through `core.authorize_unresolved_completion`, which also
  records the unresolved outcome; the authorization is refused with the leading code `outcome_already_recorded` and
  the blocker list also holds `reconciliation_exhausted_no_refiling`. The test asserts both. The design's table named
  only the second.
- L5 needs Part 2 (not built). S6 (a backup of the previous tree restored and cut over) is not built: it needs new harness
  code (a `1160` backup, a release manifest at that head, a product run after migrating). Its parts are covered: L1
  (migration over a legacy row), S3 (backup and restore keep C4 `NOT VALID` and the row), L2 (the blocker).
- Fixtures: the legacy resolution runs a test-local copy of the earlier resolver as `core.resolve_protection_mark` while C4
  is dropped, then re-adds C4 `NOT VALID` (real operation record, fact and revision); L1 drops the foreign keys of the
  mark table in its scratch `1160` database to avoid an application chain. The composed tests use the Operations kit;
  `reconciliation_exhausted` is reached through product commands.
- The legacy cases live in their own file (the proposal put them in the F file) so that two engineers could work in
  parallel; L1 lives in an ops-tooling file because it migrates its own database.

## 5. Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one review of `d2067af`: lane `research/reviews/ITEM-03-review.md`. Verdict "sound
with the fixes above". The reviewer found that the writers close the duplicate-filing defect: the resolution checks
ownership and state before the ordered table; every authorization insert passes stage 8; the application lock serializes
dispositions, resolutions and authorizations; two marks stay independently guarded; retries keep operation identity;
C1 to C3 hold for existing rows; C4 exempts historical rows only; grants and triggers match the append-only tables; the
audit and projection readers accept the new fact type. 15 determination unit tests passed in the reviewer's run.

| Finding | Rank | Disposition |
|---|---|---|
| R-01 With valid readiness, no act and an undisposed legacy mark, the pending answer says `ready / authorize_external_act` (`derived.ts:460`) while stage 8 refuses it | P1 (wrong owner and next step on work lists; no safety gap) | WITH MAX. Recommended: work it now. Before the `authorize_external_act` return, a legacy mark without a disposition gives `pending('superadmin', 'protection_mark_determination_missing', 'resolve_incident', …)`, as the active-mark rule does (`derived.ts:338`). Existing vocabulary only; one pending-versus-control test |
| R-02 S6 (a backup of the previous release restored, reopened, then cut over) is not built | P1 (coverage gap on a rare recovery path) | WITH MAX. Recommended: fold into the restore-drill item that Max already chose for later (D-04), which runs that path on a real installation |
| R-03 The preview reads `not_applicable` when the offering cannot be read; the command refuses `internal` | P2 | Parked (§6): an application always has an offering |

## 6. Parked notes (P2)

| Note | Why parked |
|---|---|
| The preview reads `not_applicable` when the offering cannot be read, while the command fails `internal` | An application always has an offering (foreign key); no reachable case |
| `FILING_ACT_KINDS` is defined twice (a local constant in `schema-sets.ts`, an export in `store.ts`) | The kernel cannot import from a module; the grant named the kernel values exactly |
| The restore procedure text cannot print the `--not-filed` count (proposal Q-A4) | The grant is text only; the count needs a CLI change |

## 7. For the UI lane (package message)

The staff route and the form field `filing` for the resolution (`src/apps/staff/core/admin.ts`, `src/web/route-inventory.ts`);
the route and form for `core.record_mark_disposition`; the page use of `mark.filing` and `legacyMarks`; the sentence for
`protection_mark_determination_missing` (`src/apps/shared/core/shared.ts`).

## 8. Checks

- `npm run check` (typecheck, lint, every test) on the tree committed as `d2067af`: 2541 of 2541 pass, 0 fail, 0 skipped.
- F1 at `e41d64f` fails at the refusal assertion (`evidence/ITEM-03-F1-fails-at-e41d64f.txt`, beside this record).
- Test transcript for the walk-through: `evidence/ITEM-03-transcript.txt` (beside this record).
