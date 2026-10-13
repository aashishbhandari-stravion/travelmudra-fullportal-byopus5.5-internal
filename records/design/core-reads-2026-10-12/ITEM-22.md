# ITEM-22 P-17 (2): the exhausted act's future owner, decider, reason and time; the active mark count

Kind 1 read. Wave 3, worker W12 (Opus, worktree `wave3-reads`; about 162k context for ITEM-22 and ITEM-17 together).
Commit: `1793248` (cherry-picked from `7b3c7a6`; parent e0b978d on the worker branch). Grants: prompt scope
(`src/modules/core/store.ts`, `src/modules/core/staff-views.ts`, `src/contracts/core.ts`,
`src/core-api/bindings/core.ts`); orchestrator (13 Oct 2026, D-16 G3, G4) `test/operations/protection-mark-filing.test.ts`
and one line in `docs/verification/read-model-register.md`. Integration: one conflict in the register (all lines kept).

## Read and change

The staff case read already served a protection mark's flags, restore id and recorded time. It did not serve the number
of active marks, and its `acts[]` omitted the exhausted act's future owner, decider, reason and time, although the Core
row loads them. Each staff case act now carries `future_owner_id`, `exhausted_by`, `exhausted_reason` and
`exhausted_at` (the state change time; the exhausted state is terminal in the writers' transitions), null unless the act
is `reconciliation_exhausted`; `names` includes the decider. A top-level `activeMarkCount` counts the application's
active marks (one per restore; `mark` stays the oldest). Served on `core.admin_case` and `core.ops_case`;
`core.ta_application` is unchanged (D-16 D-a). Additive contract change; register line.

## Tests

`test/operations/protection-mark-filing.test.ts`, "the staff case read": V2 the four fields with their values and the
decider's name; V3 the count at 0, 1 and 2 marks; the travel agent's read carries no reason. Failed first:
`evidence/ITEM-22-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `7b3c7a6` (`reviews/ITEM-22-review.md`). Verdict: sound with the fixes
above.

- R-01, P1: an unassigned operator with a group-read grant also receives `exhausted_reason` through `core.ops_case`.
  **Orchestrator (13 Oct 2026, under the overnight
  delegation; PLAN D-17): parked as P2.** Group-read grantees see the reason: they are staff and already read the whole
  case on the same projection, including the applicant's data; the reason is the SuperAdmin's working note. Revisit
  trigger: Max restricts the exhaustion reason to the assigned operator, or a reason text is found to carry remarks about
  a staff member. If reversed, the fix is one review follow-up commit that masks the reason unless the reader is the
  assigned operator or a SuperAdmin, with a grantee test.
- R-02, P2, parked: only `exhausted_at` is masked by state; the database allows a partly filled exhaustion row in another
  state (the writers never produce one).
- R-03, P2, parked: the tests do not separate the authorization and exhaustion times, nor the oldest and newest mark.

## Checks

`npm run check` at `1793248`: typecheck and lint clean; 2629 of 2629. Deployed on `lane-max` at `03abf9a` (release `rel_171VQHJEPZCMFK1XXTFDH195BK`).
