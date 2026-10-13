# ITEM-32 P-11 (OD-X10 O1): required evidence on every gate exception grant

Kind 2, P1. Built from the accepted proposal and its one review (`P-11-12-review.md`); the four review fixes are
conditions. Worker W15 (Opus, worktree `wt/w15-gex-evidence`; about 298k context, above the 275k partial-return rule;
logged with the orchestrator).

HELD (PLAN D-18). Branch `held/gate-exception-evidence` in the lane clone, never on the lane branch. Commit `3265989`
(rebased on the lane head `3a81652` as `475a501`, then reworded only, same tree; the first build was `172a97b` on
`e0b978d`). Review follow-up (tests only): `6a39fd3` (worker W18, Opus; about 265k context). Frozen head: `6a39fd3`. The UI lane merges it with its two
grant forms; the combined `npm run check` runs in the UI lane, then on main. Deviation accepted by the orchestrator: no
green per-commit check for this commit alone. Public-fit choices (architect): the branch name is not `held/item-32`, and
the commit body carries no internal ids. Migration renumbered 1060 to 1190 (1060 is taken on main).

## Change

- `core.grant_gate_exception` requires one to five evidence references: `external_reference` (a reference to an outside
  record) or `attestation` (the SuperAdmin's own statement). An attestation alone is accepted; it documents the
  exception decision only and never replaces payment, filing or other required evidence. A grant without evidence, with
  more than five items, with another kind, or with an address or a link in a note is refused with a field error before
  any write.
- The exception row (new column, migration `1190_core_gate_exception_evidence.sql`) and the
  `core.gate_exception_granted` fact carry the same normalized list. The immutable-column trigger is recreated with its
  full column list. The column is `NOT NULL` without a default; earlier rows keep an empty list and stay usable until
  consumed, revoked or expired. The minimum of one item is the command's rule only.
- The evidence is optional at parse time, with no default, so a request of the earlier shape keeps its content hash: a
  grant committed before the change replays under its operation key; the same key with evidence added conflicts; a new
  request without evidence is refused by the handler.
- `exceptionRecords` on `core.admin_case` (evidence, grantor, grant time, reason): SuperAdmin with the live
  `gate_exception.grant` decision only; null for every other reader. `core.ops_case` and the operator notice are unchanged.

Walk-through: `ITEM-32-WALKTHROUGH.md`.

## Tests

`test/core/gate-exception-evidence.test.ts` and `test/core/gate-exception-evidence-migration.test.ts` (new): refusals
before any write, attestation-only accepted, row and fact identical, legacy replay and conflict, legacy rows readable
and usable, immutability, migration interruption, SuperAdmin-only read. Failed first:
`evidence/ITEM-32-fails-first.txt`.

Worker deviations (reported to the orchestrator, 13 Oct 2026):
1. One synthetic evidence item was added to the grant calls in `test/delivery/kit.ts`,
   `test/delivery/packets-handover.test.ts`, `test/operations/work-acts.test.ts`,
   `test/operations/protection-mark-filing.test.ts`, `test/documents-association/application-documents.test.ts` and
   `test/ops-tooling/restore-reopen.test.ts`. These are outside the brief; existing callers needed the change.
2. `exceptionRecords` on `core.admin_case` is the reader of the evidence (the proposal named no read).
3. No `document_version` evidence kind.
4. Proposal §13.2 recovery tests 24 and 25 were not built (`test/ops-tooling` was outside the brief); see R-01.

Expected failures on the held branch until the UI lane's grant forms post evidence: `test/system/case-rules.test.ts:227`
(post `:226`, test `:218`), `:261` (follows), `:348` (post `:347` in `assisted()`; fails tests `:357` and `:401`);
`test/system/core-pages.test.ts:262` (post `:261`); `test/system/document-decisions.test.ts:218` (422 instead of 303).

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `475a501` (`reviews/ITEM-32-review.md`). Verdict: sound with the fixes
above. The four review fixes and the §13 amendments are met; the migration is additive and transactional; no non-UI
positive grant caller remains without evidence; operator responses omit the privileged fields.

- R-01, P1: proposal §13.2 recovery tests 24 and 25 are missing (checkpoint before 1190, closed-cutover rollback without
  loss of accepted work; reopen admission, accept an evidence-bearing grant, the prior release is refused with
  `schema_incompatible`, a repair release keeps the grant and refuses evidence-free grants). **Orchestrator (13 Oct
  2026, under OD-X26; PLAN D-21): fix now, tests only**, one commit by a fresh Opus worker (W18), grant `test/ops-tooling/`
  and `test/core/gate-exception-evidence-migration.test.ts`, no re-review. The orchestrator asked the commit body to name
  the finding id; the body describes the finding in plain words instead (public-fit rule), and this record maps it.

## Checks

At `475a501` after the rebase: `test/static` 76 of 76. The commit body said the value-import cycle check "fails the
same way on the parent commit"; that held for the first parent `e0b978d` only. The body was reworded to `3265989` (tree
unchanged) before the follow-up. Targeted suites after the rebase: 101 of 101. No `npm run check` for this commit alone (D-18).

Follow-up `6a39fd3` (`test/ops-tooling/gate-exception-evidence-recovery.test.ts`, new; no product or kit change): test 1
starts on head 1180 with the prior release active, accepts a grant of the earlier shape, closes, checkpoints, applies the
real 1190, activates, then runs the closed-cutover snapshot rollback: the prior ledger (no 1190 row) and schema (no
`evidence` column), the prior release active, admission closed, every operation accepted before the closure unchanged.
Test 2 (continues from test 1's state): the cutover again, admission reopened, an evidence grant accepted; after an
emergency closure the code rollback to the prior release is refused `schema_incompatible` and changes nothing; a repair
release on head 1190 activates, verifies and opens, keeps the grant's row and fact, and refuses a grant without evidence
with `evidence/required`; an insert without the column fails 23502. Mutations (`evidence/ITEM-32-followup-mutations.txt`,
each file restored and checked by sha256): (a) skip the restore in `rollbackSnapshot`: test 1 fails; (b) the prior
manifest names 1190 (fixture): test 2 fails; (b') `headCompatible` accepts any head (product): test 2 fails; (c) the
handler's evidence rule removed: test 2 fails; (d) 1190 keeps its column default: test 2 fails. Deviations: the earlier
release is simulated (current code on the 1180 schema with an earlier-shape grant handler, as the core migration test
does); test 2 depends on test 1's state. Checks at `6a39fd3`: tsc, eslint clean; new tests 2 of 2; `test/static` 76 of
76; `test/ops-tooling` 153 of 153.
